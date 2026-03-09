"""
Generate Edge TTS audio files for the Alfabet game.
Uses Microsoft Neural Indonesian voice (id-ID-GadisNeural) for natural pronunciation.
"""
import asyncio
import os

# Try to import edge_tts
try:
    import edge_tts
except ImportError:
    print("edge-tts not found. Installing...")
    os.system("pip3 install edge-tts")
    import edge_tts

# Indonesian Neural voice
VOICE = "id-ID-GadisNeural"  # Female Indonesian Neural voice

# Output directory
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "audio", "alfabet")

# All letters with their Indonesian pronunciation and example words
ALPHABET_DATA = [
    ("A", "a", "Apel"),
    ("B", "be", "Buku"),
    ("C", "ce", "Cicak"),
    ("D", "de", "Domba"),
    ("E", "e", "Ember"),
    ("F", "ef", "Foto"),
    ("G", "ge", "Gajah"),
    ("H", "ha", "Harimau"),
    ("I", "i", "Ikan"),
    ("J", "je", "Jeruk"),
    ("K", "ka", "Kucing"),
    ("L", "el", "Lampu"),
    ("M", "em", "Mobil"),
    ("N", "en", "Nanas"),
    ("O", "o", "Obat"),
    ("P", "pe", "Pisang"),
    ("Q", "ki", "Quran"),
    ("R", "er", "Rumah"),
    ("S", "es", "Sapi"),
    ("T", "te", "Topi"),
    ("U", "u", "Ular"),
    ("V", "ve", "Vila"),
    ("W", "we", "Wortel"),
    ("X", "eks", "Xilofon"),
    ("Y", "ye", "Yoyo"),
    ("Z", "zet", "Zebra"),
]

async def generate_audio(text: str, filename: str):
    """Generate audio file using Edge TTS."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    communicate = edge_tts.Communicate(text, VOICE, rate="-10%", pitch="+5Hz")
    await communicate.save(filepath)
    print(f"  ✅ Generated: {filename}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"🎙️ Using voice: {VOICE}")
    print(f"📂 Output directory: {OUTPUT_DIR}")
    print(f"📝 Generating {len(ALPHABET_DATA)} letters x 2 (letter + word) = {len(ALPHABET_DATA) * 2} audio files\n")

    for letter, pronunciation, word in ALPHABET_DATA:
        letter_lower = letter.lower()
        
        # Generate letter pronunciation (e.g., "a", "be", "ce")
        print(f"🔤 Letter {letter}:")
        await generate_audio(pronunciation, f"letter_{letter_lower}.mp3")
        
        # Generate word (e.g., "Apel", "Buku")
        await generate_audio(word, f"word_{letter_lower}.mp3")
    
    print(f"\n🎉 Done! Generated {len(ALPHABET_DATA) * 2} audio files in {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
