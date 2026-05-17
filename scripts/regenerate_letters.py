"""
Re-generate Edge TTS letter audio files with correct Indonesian pronunciation.
Uses explicit Indonesian letter names to avoid English pronunciation.
"""
import asyncio
import os

import edge_tts

VOICE = "id-ID-GadisNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "audio", "alfabet")

# Indonesian letter pronunciations - spelled out clearly for TTS
# Using full Indonesian names to avoid English pronunciation
LETTER_PRONUNCIATIONS = [
    ("a", "a"),
    ("b", "bé"),
    ("c", "cé"),
    ("d", "dé"),
    ("e", "é"),
    ("f", "éf"),
    ("g", "gé"),
    ("h", "ha"),
    ("i", "i"),
    ("j", "jé"),
    ("k", "ka"),
    ("l", "él"),
    ("m", "ém"),
    ("n", "én"),
    ("o", "o"),
    ("p", "pé"),
    ("q", "ki"),
    ("r", "ér"),
    ("s", "és"),
    ("t", "té"),
    ("u", "u"),
    ("v", "vé"),
    ("w", "wé"),
    ("x", "éks"),
    ("y", "yé"),
    ("z", "zét"),
]

async def generate_audio(text: str, filename: str):
    filepath = os.path.join(OUTPUT_DIR, filename)
    communicate = edge_tts.Communicate(text, VOICE, rate="-10%", pitch="+5Hz")
    await communicate.save(filepath)
    print(f"  ✅ Generated: {filename} (text: '{text}')")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"🎙️ Using voice: {VOICE}")
    print(f"📂 Output directory: {OUTPUT_DIR}")
    print(f"📝 Regenerating {len(LETTER_PRONUNCIATIONS)} letter audio files\n")

    for letter, pronunciation in LETTER_PRONUNCIATIONS:
        print(f"🔤 Letter {letter.upper()}:")
        await generate_audio(pronunciation, f"letter_{letter}.mp3")
    
    print(f"\n🎉 Done! Regenerated {len(LETTER_PRONUNCIATIONS)} letter audio files")

if __name__ == "__main__":
    asyncio.run(main())
