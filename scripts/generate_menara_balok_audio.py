#!/usr/bin/env python3
"""Generate audio files for 'Buat menara setinggi angka [X]' using Edge TTS."""
import asyncio
import os
import edge_tts

VOICE = "id-ID-GadisNeural"
OUTPUT_DIR = "public/audio/menara-balok"

def number_to_text(num):
    satuan = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh']
    return satuan[num]

async def generate_audio(num, text):
    filepath = os.path.join(OUTPUT_DIR, f"{num}.mp3")
    if os.path.exists(filepath):
        return
    tts = edge_tts.Communicate(text, VOICE, rate="-10%")
    await tts.save(filepath)
    print(f"  ✅ {num}: {text}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("🧱 Generating menara balok audio files (1-10)...")
    
    tasks = []
    for num in range(1, 11):
        num_text = number_to_text(num)
        full_text = f"Buat menara setinggi angka {num_text}"
        tasks.append(generate_audio(num, full_text))
    
    await asyncio.gather(*tasks)
    print(f"\n✅ Done! {len(tasks)} audio files generated in {OUTPUT_DIR}/")

if __name__ == "__main__":
    asyncio.run(main())
