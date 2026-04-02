"""
Generate Edge TTS audio files for the Suku Kata (Syllable) learning module.
Uses Microsoft Neural Indonesian voice (id-ID-GadisNeural) for natural pronunciation.

Covers:
- Vokal: A, I, U, E, O (standalone as syllables)
- KV (Konsonan + Vokal): subset konsonan PAUD/TK-friendly
- NG: Nga, Ngi, Ngu, Nge, Ngo
- NY: Nya, Nyi, Nyu, Nye, Nyo
"""
import asyncio
import os

try:
    import edge_tts
except ImportError:
    print("edge-tts not found. Installing...")
    os.system("pip3 install edge-tts")
    import edge_tts

# Indonesian Neural voice
VOICE = "id-ID-GadisNeural"

# Output directory
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "audio", "suku-kata")

VOWELS = ["a", "i", "u", "e", "o"]

# Subset konsonan PAUD/TK-friendly (huruf yang mudah diucapkan dan sering muncul di buku PAUD)
# Menghindari: F, Q, V, X, Z (jarang digunakan / konsonan asing)
KV_CONSONANTS = ["b", "c", "d", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "w", "y"]

async def generate_audio(text: str, filename: str):
    """Generate audio file using Edge TTS."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    communicate = edge_tts.Communicate(text, VOICE, rate="-15%", pitch="+5Hz")
    await communicate.save(filepath)
    print(f"  ✅ Generated: {filename}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"🎙️ Using voice: {VOICE}")
    print(f"📂 Output directory: {OUTPUT_DIR}\n")

    total = 0

    # === 1. VOKAL (standalone syllables) ===
    print("📦 [1/4] Generating VOKAL audio...")
    for v in VOWELS:
        await generate_audio(v, f"vokal_{v}.mp3")
        total += 1
    print()

    # === 2. KV (Konsonan + Vokal) ===
    print(f"📦 [2/4] Generating KV audio ({len(KV_CONSONANTS)} konsonan x 5 vokal = {len(KV_CONSONANTS)*5} files)...")
    for consonant in KV_CONSONANTS:
        for v in VOWELS:
            syllable = consonant + v
            # Pronounce slowly and clearly: e.g. "ba", "bi", "bu"
            await generate_audio(syllable, f"kv_{syllable}.mp3")
            total += 1
    print()

    # === 3. NG + Vokal ===
    print("📦 [3/4] Generating NG audio...")
    for v in VOWELS:
        syllable = "ng" + v
        await generate_audio(syllable, f"ng_{syllable}.mp3")
        total += 1
    print()

    # === 4. NY + Vokal ===
    print("📦 [4/4] Generating NY audio...")
    for v in VOWELS:
        syllable = "ny" + v
        await generate_audio(syllable, f"ny_{syllable}.mp3")
        total += 1
    print()

    print(f"🎉 Done! Generated {total} audio files in {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
