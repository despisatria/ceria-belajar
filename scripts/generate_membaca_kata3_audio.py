"""
Generate Edge TTS audio for Membaca Kata 3 Suku Kata module.
Uses Microsoft Neural Indonesian voice (id-ID-GadisNeural).

Generates:
1. Full word audio -> /audio/membaca-kata/kata_*.mp3
2. New closed-syllable audio -> /audio/suku-kata/kvk_*.mp3
"""
import asyncio
import os

try:
    import edge_tts
except ImportError:
    print("edge-tts not found. Installing...")
    os.system("pip3 install edge-tts")
    import edge_tts

VOICE = "id-ID-GadisNeural"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KATA_DIR = os.path.join(BASE_DIR, "public", "audio", "membaca-kata")
SUKU_DIR = os.path.join(BASE_DIR, "public", "audio", "suku-kata")

# Level 1: KV+KV+KV
LEVEL1_WORDS = [
    "sepatu", "celana", "kepala", "boneka", "gurita",
    "sepeda", "kelapa", "kamera", "kereta", "medali",
]

# Level 2: mixed (tertutup, NG, NY)
LEVEL2_WORDS = [
    "jerapah", "merpati", "kelinci", "membaca", "menulis",
    "pesawat", "harimau", "menyapu", "pelangi", "semangka",
]

ALL_WORDS = LEVEL1_WORDS + LEVEL2_WORDS

# New closed syllables needed (not already generated)
# Already existing: ang, dur, jan, kan, kat, lan, lon, lur, lut, mah, man, muk, ngan, pal, pin, yam, yung, yur
NEW_CLOSED_SYLLABLES = [
    "pah",   # jera-PAH
    "mer",   # MER-pati
    "lin",   # ke-LIN-ci
    "mem",   # MEM-baca
    "lis",   # menu-LIS
    "wat",   # pesa-WAT
    "mau",   # hari-MAU
    "mang",  # se-MANG-ka
]

async def generate_audio(text: str, filepath: str):
    """Generate audio file using Edge TTS."""
    communicate = edge_tts.Communicate(text, VOICE, rate="-15%", pitch="+5Hz")
    await communicate.save(filepath)
    print(f"  ✅ {os.path.basename(filepath)}")

async def main():
    os.makedirs(KATA_DIR, exist_ok=True)
    os.makedirs(SUKU_DIR, exist_ok=True)

    print(f"🎙️ Voice: {VOICE}")
    print(f"📂 Kata dir: {KATA_DIR}")
    print(f"📂 Suku dir: {SUKU_DIR}\n")

    total = 0

    # === 1. Full word audio ===
    print(f"📦 [1/2] Generating {len(ALL_WORDS)} full-word audio files...")
    for word in ALL_WORDS:
        filepath = os.path.join(KATA_DIR, f"kata_{word}.mp3")
        if os.path.exists(filepath):
            print(f"  ⏭️ {os.path.basename(filepath)} (exists)")
            continue
        await generate_audio(word, filepath)
        total += 1
    print()

    # === 2. Closed syllable audio ===
    print(f"📦 [2/2] Generating {len(NEW_CLOSED_SYLLABLES)} new closed-syllable audio files...")
    for syl in NEW_CLOSED_SYLLABLES:
        filepath = os.path.join(SUKU_DIR, f"kvk_{syl}.mp3")
        if os.path.exists(filepath):
            print(f"  ⏭️ {os.path.basename(filepath)} (exists)")
            continue
        await generate_audio(syl, filepath)
        total += 1
    print()

    print(f"🎉 Done! Generated {total} new audio files.")

if __name__ == "__main__":
    asyncio.run(main())
