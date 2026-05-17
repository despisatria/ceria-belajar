// ─── Centralized Word Pool Data ───────────────────────────
// All Membaca game files share these word pools.
// Each game imports the pools it needs and builds its own round mapping.

export interface WordEntry {
    word: string;
    syllables: string[];
    emoji: string;
}

// Pool 1: 2 suku kata KV+KV (4 huruf - paling mudah)
export const POOL_1: WordEntry[] = [
    { word: 'baju', syllables: ['ba', 'ju'], emoji: '👕' },
    { word: 'bola', syllables: ['bo', 'la'], emoji: '⚽' },
    { word: 'buku', syllables: ['bu', 'ku'], emoji: '📚' },
    { word: 'kuda', syllables: ['ku', 'da'], emoji: '🐴' },
    { word: 'nasi', syllables: ['na', 'si'], emoji: '🍚' },
    { word: 'roti', syllables: ['ro', 'ti'], emoji: '🍞' },
    { word: 'sapi', syllables: ['sa', 'pi'], emoji: '🐮' },
    { word: 'susu', syllables: ['su', 'su'], emoji: '🥛' },
    { word: 'topi', syllables: ['to', 'pi'], emoji: '🧢' },
];

// Pool 2: 2 suku kata 5 huruf
export const POOL_2: WordEntry[] = [
    { word: 'ayam', syllables: ['a', 'yam'], emoji: '🐔' },
    { word: 'balon', syllables: ['ba', 'lon'], emoji: '🎈' },
    { word: 'ikan', syllables: ['i', 'kan'], emoji: '🐟' },
    { word: 'kapal', syllables: ['ka', 'pal'], emoji: '🚢' },
    { word: 'rumah', syllables: ['ru', 'mah'], emoji: '🏠' },
    { word: 'telur', syllables: ['te', 'lur'], emoji: '🥚' },
];

// Pool 3: 2 suku kata NG/NY
export const POOL_3: WordEntry[] = [
    { word: 'bunga', syllables: ['bu', 'nga'], emoji: '🌸' },
    { word: 'singa', syllables: ['si', 'nga'], emoji: '🦁' },
    { word: 'payung', syllables: ['pa', 'yung'], emoji: '☂️' },
    { word: 'nyanyi', syllables: ['nya', 'nyi'], emoji: '🎤' },
    { word: 'pisang', syllables: ['pi', 'sang'], emoji: '🍌' },
];

// Pool 4: 3 suku kata terbuka (KV+KV+KV)
export const POOL_4: WordEntry[] = [
    { word: 'sepatu', syllables: ['se', 'pa', 'tu'], emoji: '👟' },
    { word: 'celana', syllables: ['ce', 'la', 'na'], emoji: '👖' },
    { word: 'boneka', syllables: ['bo', 'ne', 'ka'], emoji: '🧸' },
    { word: 'gurita', syllables: ['gu', 'ri', 'ta'], emoji: '🐙' },
    { word: 'sepeda', syllables: ['se', 'pe', 'da'], emoji: '🚲' },
    { word: 'kelapa', syllables: ['ke', 'la', 'pa'], emoji: '🥥' },
    { word: 'kamera', syllables: ['ka', 'me', 'ra'], emoji: '📷' },
    { word: 'kereta', syllables: ['ke', 're', 'ta'], emoji: '🚂' },
];

// Pool 5: 3 suku kata campuran (paling sulit)
export const POOL_5: WordEntry[] = [
    { word: 'jerapah', syllables: ['je', 'ra', 'pah'], emoji: '🦒' },
    { word: 'kelinci', syllables: ['ke', 'lin', 'ci'], emoji: '🐰' },
    { word: 'pesawat', syllables: ['pe', 'sa', 'wat'], emoji: '✈️' },
    { word: 'harimau', syllables: ['ha', 'ri', 'mau'], emoji: '🐯' },
    { word: 'semangka', syllables: ['se', 'mang', 'ka'], emoji: '🍉' },
];

// Convenience: all pools in order of difficulty
export const ALL_POOLS: WordEntry[][] = [POOL_1, POOL_2, POOL_3, POOL_4, POOL_5];
