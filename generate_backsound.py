#!/usr/bin/env python3
"""Generate a cheerful children's background music MP3 using pydub."""
import math
import struct
import wave
import tempfile
import os

from pydub import AudioSegment

SAMPLE_RATE = 44100

def generate_tone(frequency, duration_ms, volume=0.3, sample_rate=SAMPLE_RATE):
    """Generate a music-box style tone."""
    num_samples = int(sample_rate * duration_ms / 1000)
    samples = []
    for i in range(num_samples):
        t = i / sample_rate
        # Attack and decay envelope
        env = 1.0
        attack_samples = int(0.01 * sample_rate)
        decay_start = int(0.3 * num_samples)
        if i < attack_samples:
            env = i / attack_samples
        elif i > decay_start:
            progress = (i - decay_start) / (num_samples - decay_start)
            env = max(0, 1.0 - progress)
        
        # Main tone (sine) + soft overtone for warmth
        sample = (
            math.sin(2 * math.pi * frequency * t) * 0.7 +
            math.sin(2 * math.pi * frequency * 2 * t) * 0.15 +
            math.sin(2 * math.pi * frequency * 3 * t) * 0.08 +
            math.sin(2 * math.pi * frequency * 4 * t) * 0.04
        )
        sample *= env * volume
        sample = max(-1.0, min(1.0, sample))
        samples.append(int(sample * 32767))
    
    return samples

def samples_to_wav(samples, filename, sample_rate=SAMPLE_RATE):
    """Write samples to a WAV file."""
    with wave.open(filename, 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        data = struct.pack(f'<{len(samples)}h', *samples)
        wav.writeframes(data)

# Notes (Hz)
NOTES = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
    'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50,
    'REST': 0,
}

# Cheerful melody: "If You're Happy and You Know It" inspired + variations
# More playful and bouncy
MELODY = [
    # Phrase 1 (bouncy intro)
    ('C5', 300), ('E5', 300), ('G5', 300), ('E5', 300),
    ('C5', 200), ('D5', 200), ('E5', 400),
    ('REST', 200),
    # Phrase 2
    ('D5', 300), ('F5', 300), ('A5', 300), ('F5', 300),
    ('D5', 200), ('E5', 200), ('F5', 400),
    ('REST', 200),
    # Phrase 3 (ascending happy)
    ('E5', 200), ('E5', 200), ('F5', 200), ('G5', 400),
    ('G5', 200), ('A5', 200), ('G5', 200), ('F5', 200), ('E5', 400),
    ('REST', 200),
    # Phrase 4 (playful descent)
    ('G5', 200), ('F5', 200), ('E5', 200), ('D5', 200),
    ('C5', 400), ('E5', 200), ('D5', 200), ('C5', 600),
    ('REST', 300),
    # Phrase 5 (happy ending)
    ('C5', 150), ('D5', 150), ('E5', 150), ('F5', 150),
    ('G5', 300), ('G5', 300),
    ('A5', 200), ('G5', 200), ('F5', 200), ('E5', 200),
    ('D5', 300), ('E5', 300), ('C5', 600),
    ('REST', 300),
    # Phrase 6 (gentle bridge)
    ('E5', 250), ('G5', 250), ('C6', 500),
    ('B5', 250), ('A5', 250), ('G5', 500),
    ('F5', 250), ('E5', 250), ('D5', 250), ('C5', 250),
    ('D5', 300), ('E5', 300), ('C5', 600),
    ('REST', 500),
]

def main():
    output_dir = "public/audio"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "backsound.mp3")
    
    print("🎵 Generating cheerful children's background music...")
    
    # Generate one full cycle of the melody
    all_samples = []
    for note_name, duration_ms in MELODY:
        if note_name == 'REST':
            # Silence
            num_silence = int(SAMPLE_RATE * duration_ms / 1000)
            all_samples.extend([0] * num_silence)
        else:
            freq = NOTES[note_name]
            samples = generate_tone(freq, duration_ms, volume=0.35)
            all_samples.extend(samples)
    
    # Create WAV from samples
    tmp_wav = tempfile.mktemp(suffix='.wav')
    samples_to_wav(all_samples, tmp_wav)
    
    # Convert to AudioSegment
    melody = AudioSegment.from_wav(tmp_wav)
    os.remove(tmp_wav)
    
    # Loop the melody 4 times for a nice ~1min track
    full_track = melody + melody + melody + melody
    
    # Add a gentle fade in at start and fade out at end
    full_track = full_track.fade_in(500).fade_out(1000)
    
    # Export as MP3
    full_track.export(output_path, format="mp3")
    
    duration_sec = len(full_track) / 1000
    print(f"✅ Saved to {output_path} ({duration_sec:.1f} seconds)")

if __name__ == "__main__":
    main()
