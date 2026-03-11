#!/usr/bin/env python3
"""Generate audio files for 'Pecahkan Balon Angka [X]' using Edge TTS."""
import asyncio
import os
import edge_tts

VOICE = "id-ID-GadisNeural"
OUTPUT_DIR = "public/audio/balon-angka"

# Indonesian number names (1-20)
def number_to_text(num):
    satuan = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
    belasan = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas',
               'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas']
    puluhan = ['', '', 'dua puluh']
    
    if num < 10:
        return satuan[num]
    if num < 20:
        return belasan[num - 10]
    tens = num // 10
    ones = num % 10
    if ones == 0:
        return puluhan[tens]
    return f"{puluhan[tens]} {satuan[ones]}"

async def generate_audio(num, text):
    filepath = os.path.join(OUTPUT_DIR, f"{num}.mp3")
    if os.path.exists(filepath):
        return
    tts = edge_tts.Communicate(text, VOICE, rate="-10%")
    await tts.save(filepath)
    print(f"  ✅ {num}: {text}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("🎈 Generating balon angka audio files (1-20)...")
    
    tasks = []
    for num in range(1, 21):
        num_text = number_to_text(num)
        full_text = f"Pecahkan Balon Angka {num_text}"
        tasks.append(generate_audio(num, full_text))
    
    await asyncio.gather(*tasks)
    print(f"\n✅ Done! {len(tasks)} audio files generated in {OUTPUT_DIR}/")

if __name__ == "__main__":
    asyncio.run(main())
