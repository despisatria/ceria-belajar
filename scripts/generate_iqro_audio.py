"""
Generate Edge TTS audio files for the Iqro 1 (Fathah) learning module.
Uses Microsoft Neural Indonesian voice (id-ID-GadisNeural) for natural pronunciation.
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
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "audio", "iqro")

IQRO_SOUNDS = [
    {"id": "alif", "text": "a"},
    {"id": "ba", "text": "ba"},
    {"id": "ta", "text": "ta"},
    {"id": "tsa", "text": "tsa"},
    {"id": "jim", "text": "ja"},
    {"id": "ha", "text": "ha"},
    {"id": "kha", "text": "kho"}, # tebal
    {"id": "dal", "text": "da"},
    {"id": "dzal", "text": "dza"},
    {"id": "ra", "text": "ro"}, # tebal
    {"id": "zai", "text": "za"},
    {"id": "sin", "text": "sa"},
    {"id": "syin", "text": "sya"},
    {"id": "shad", "text": "sho"}, # tebal
    {"id": "dhad", "text": "dho"}, # tebal
    {"id": "tha", "text": "tho"}, # tebal
    {"id": "zha", "text": "zho"}, # tebal
    {"id": "ain", "text": "a"}, # 'A
    {"id": "ghain", "text": "gho"}, # tebal
    {"id": "fa", "text": "fa"},
    {"id": "qaf", "text": "qo"}, # tebal
    {"id": "kaf", "text": "ka"},
    {"id": "lam", "text": "la"},
    {"id": "mim", "text": "ma"},
    {"id": "nun", "text": "na"},
    {"id": "wawu", "text": "wa"},
    {"id": "ha_besar", "text": "ha"},
    {"id": "lam_alif", "text": "la"},
    {"id": "hamzah", "text": "a"},
    {"id": "ya", "text": "ya"}
]

async def generate_audio(text: str, filename: str):
    """Generate audio file using Edge TTS."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    # Pitch slightly higher for a child-friendly tone
    communicate = edge_tts.Communicate(text, VOICE, rate="-15%", pitch="+5Hz")
    await communicate.save(filepath)
    print(f"  ✅ Generated: {filename} (spoken as: '{text}')")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"🎙️ Using voice: {VOICE}")
    print(f"📂 Output directory: {OUTPUT_DIR}\n")

    total = 0

    print("📦 Generating Iqro 1 audio (Fathah)...")
    for item in IQRO_SOUNDS:
        await generate_audio(item["text"], f"{item['id']}.mp3")
        total += 1

    print(f"\n🎉 Done! Generated {total} audio files in {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
