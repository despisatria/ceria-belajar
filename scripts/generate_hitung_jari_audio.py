#!/usr/bin/env python3
"""Generate audio files for 'Berapa jumlah jarinya?' using Edge TTS."""
import asyncio
import os
import edge_tts

VOICE = "id-ID-GadisNeural"
OUTPUT_DIR = "public/audio/instruksi"

async def generate_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = os.path.join(OUTPUT_DIR, "hitung_jari.mp3")
    
    if os.path.exists(filepath):
        print("✅ Audio already exists.")
        return
        
    print("🖐️ Generating hitung_jari.mp3...")
    text = "Berapa jumlah jarinya?"
    tts = edge_tts.Communicate(text, VOICE, rate="-10%")
    await tts.save(filepath)
    print("✅ Done!")

if __name__ == "__main__":
    asyncio.run(generate_audio())
