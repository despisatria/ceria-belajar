/**
 * Resolve the audio path for a syllable.
 * - Simple KV syllables (2 chars, consonant+vowel) -> /audio/suku-kata/kv_*.mp3
 * - Standalone vowels (a, i, u, e, o) -> /audio/suku-kata/vokal_*.mp3
 * - NG syllables (nga, ngi, ...) -> /audio/suku-kata/ng_ng*.mp3
 * - NY syllables (nya, nyi, ...) -> /audio/suku-kata/ny_ny*.mp3
 * - Closed syllables (kvk) -> /audio/suku-kata/kvk_*.mp3
 */
export function getSyllableAudioPath(syl: string): string {
    const vowels = ['a', 'i', 'u', 'e', 'o'];

    // Standalone vowel
    if (vowels.includes(syl)) {
        return `/audio/suku-kata/vokal_${syl}.mp3`;
    }

    // NG syllables (nga, ngi, ngu, nge, ngo)
    if (syl.startsWith('ng') && syl.length === 3 && vowels.includes(syl[2])) {
        return `/audio/suku-kata/ng_${syl}.mp3`;
    }

    // NY syllables (nya, nyi, nyu, nye, nyo)
    if (syl.startsWith('ny') && syl.length === 3 && vowels.includes(syl[2])) {
        return `/audio/suku-kata/ny_${syl}.mp3`;
    }

    // Simple KV (2 chars: consonant + vowel)
    if (syl.length === 2 && vowels.includes(syl[1])) {
        return `/audio/suku-kata/kv_${syl}.mp3`;
    }

    // Everything else is a closed/complex syllable
    return `/audio/suku-kata/kvk_${syl}.mp3`;
}
