#!/usr/bin/env python3
"""Generate audio files for 'Pecahkan Balon Huruf [A-Z]' using Edge TTS."""
import asyncio
import os
import edge_tts
import string

VOICE = "id-ID-GadisNeural"
OUTPUT_DIR = "public/audio/balon-huruf"

async def generate_audio(letter, text):
    filepath = os.path.join(OUTPUT_DIR, f"{letter}.mp3")
    if os.path.exists(filepath):
        return
    tts = edge_tts.Communicate(text, VOICE, rate="-10%")
    await tts.save(filepath)
    print(f"  ✅ {letter}: {text}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("🎈 Generating balon huruf audio files (A-Z)...")
    
    tasks = []
    # Generate A to Z
    for letter in string.ascii_uppercase:
        full_text = f"Pecahkan Balon Huruf {letter}"
        tasks.append(generate_audio(letter, full_text))
    
    await asyncio.gather(*tasks)
    print(f"\n✅ Done! {len(tasks)} audio files generated in {OUTPUT_DIR}/")

if __name__ == "__main__":
    asyncio.run(main())
