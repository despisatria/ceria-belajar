"""
Generate Edge TTS audio files for the Membaca Kata (Word Reading) module.
Uses Microsoft Neural Indonesian voice (id-ID-GadisNeural).

Generates:
1. Full word audio -> /audio/membaca-kata/kata_*.mp3
2. Closed-syllable audio that don't exist yet -> /audio/suku-kata/kvk_*.mp3
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

# === WORD DATA ===
# Level 1: KV+KV (4 huruf) - all syllables already exist in kv_*.mp3
LEVEL1_WORDS = [
    "baju", "batu", "bola", "buku", "gigi",
    "guru", "kaki", "kuda", "mata", "nasi",
    "pipi", "roti", "sapi", "susu", "topi",
]

# Level 2: KV+KVK / KVK+KV (5 huruf) - some closed syllables needed
LEVEL2_WORDS = [
    "ayam", "balon", "bulan", "hujan", "ikan",
    "kapal", "makan", "mandi", "mulut", "pintu",
    "rumah", "sayur", "sikat", "telur", "tidur",
]

# Level 3: Words with NG/NY - some syllables already exist
LEVEL3_WORDS = [
    "bunga", "singa", "angsa", "tangan", "payung",
    "bunyi", "nyanyi", "tanya", "nyamuk", "penyu",
]

ALL_WORDS = LEVEL1_WORDS + LEVEL2_WORDS + LEVEL3_WORDS

# Closed syllables that need to be generated (not already in kv_*.mp3 or ng_/ny_ files)
# These are syllables ending in a consonant, or special combos
CLOSED_SYLLABLES = [
    # Level 2 closed syllables
    "yam", "lon", "lan", "jan", "kan", "pal",
    "man", "lut", "pin", "mah", "yur", "kat", "lur", "dur",
    # Level 3 special syllables
    "ang", "ngan", "yung", "muk",
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
        await generate_audio(word, filepath)
        total += 1
    print()

    # === 2. Closed syllable audio ===
    print(f"📦 [2/2] Generating {len(CLOSED_SYLLABLES)} closed-syllable audio files...")
    for syl in CLOSED_SYLLABLES:
        filepath = os.path.join(SUKU_DIR, f"kvk_{syl}.mp3")
        # Skip if already exists
        if os.path.exists(filepath):
            print(f"  ⏭️ {os.path.basename(filepath)} (exists)")
            continue
        await generate_audio(syl, filepath)
        total += 1
    print()

    print(f"🎉 Done! Generated {total} new audio files.")

if __name__ == "__main__":
    asyncio.run(main())
