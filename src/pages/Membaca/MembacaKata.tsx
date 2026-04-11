import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MembacaKata.module.css';
import { audioPlayer } from '../../utils/audioPlayer';

interface WordEntry {
    word: string;
    syllables: string[];
    emoji: string;
}

// === LEVEL 1: KV + KV (4 huruf) ===
const LEVEL1: WordEntry[] = [
    { word: 'baju', syllables: ['ba', 'ju'], emoji: '👕' },
    { word: 'batu', syllables: ['ba', 'tu'], emoji: '🪨' },
    { word: 'bola', syllables: ['bo', 'la'], emoji: '⚽' },
    { word: 'buku', syllables: ['bu', 'ku'], emoji: '📚' },
    { word: 'gigi', syllables: ['gi', 'gi'], emoji: '🦷' },
    { word: 'guru', syllables: ['gu', 'ru'], emoji: '👩‍🏫' },
    { word: 'kaki', syllables: ['ka', 'ki'], emoji: '🦶' },
    { word: 'kuda', syllables: ['ku', 'da'], emoji: '🐴' },
    { word: 'mata', syllables: ['ma', 'ta'], emoji: '👁️' },
    { word: 'nasi', syllables: ['na', 'si'], emoji: '🍚' },
    { word: 'pipi', syllables: ['pi', 'pi'], emoji: '😊' },
    { word: 'roti', syllables: ['ro', 'ti'], emoji: '🍞' },
    { word: 'sapi', syllables: ['sa', 'pi'], emoji: '🐮' },
    { word: 'susu', syllables: ['su', 'su'], emoji: '🥛' },
    { word: 'topi', syllables: ['to', 'pi'], emoji: '🧢' },
];

// === LEVEL 2: KV+KVK / KVK+KV (5 huruf) ===
const LEVEL2: WordEntry[] = [
    { word: 'ayam', syllables: ['a', 'yam'], emoji: '🐔' },
    { word: 'balon', syllables: ['ba', 'lon'], emoji: '🎈' },
    { word: 'bulan', syllables: ['bu', 'lan'], emoji: '🌙' },
    { word: 'hujan', syllables: ['hu', 'jan'], emoji: '🌧️' },
    { word: 'ikan', syllables: ['i', 'kan'], emoji: '🐟' },
    { word: 'kapal', syllables: ['ka', 'pal'], emoji: '🚢' },
    { word: 'makan', syllables: ['ma', 'kan'], emoji: '🍽️' },
    { word: 'mandi', syllables: ['man', 'di'], emoji: '🚿' },
    { word: 'mulut', syllables: ['mu', 'lut'], emoji: '👄' },
    { word: 'pintu', syllables: ['pin', 'tu'], emoji: '🚪' },
    { word: 'rumah', syllables: ['ru', 'mah'], emoji: '🏠' },
    { word: 'sayur', syllables: ['sa', 'yur'], emoji: '🥬' },
    { word: 'sikat', syllables: ['si', 'kat'], emoji: '🪥' },
    { word: 'telur', syllables: ['te', 'lur'], emoji: '🥚' },
    { word: 'tidur', syllables: ['ti', 'dur'], emoji: '😴' },
];

// === LEVEL 3: NG & NY ===
const LEVEL3: WordEntry[] = [
    { word: 'bunga', syllables: ['bu', 'nga'], emoji: '🌸' },
    { word: 'singa', syllables: ['si', 'nga'], emoji: '🦁' },
    { word: 'angsa', syllables: ['ang', 'sa'], emoji: '🦢' },
    { word: 'tangan', syllables: ['ta', 'ngan'], emoji: '✋' },
    { word: 'payung', syllables: ['pa', 'yung'], emoji: '☂️' },
    { word: 'bunyi', syllables: ['bu', 'nyi'], emoji: '🔔' },
    { word: 'nyanyi', syllables: ['nya', 'nyi'], emoji: '🎤' },
    { word: 'tanya', syllables: ['ta', 'nya'], emoji: '❓' },
    { word: 'nyamuk', syllables: ['nya', 'muk'], emoji: '🦟' },
    { word: 'penyu', syllables: ['pe', 'nyu'], emoji: '🐢' },
];

const LEVELS = [
    { key: 'level1', label: '⭐ Level 1', data: LEVEL1, color: 'var(--cat-blue)' },
    { key: 'level2', label: '⭐⭐ Level 2', data: LEVEL2, color: 'var(--cat-green)' },
    { key: 'level3', label: '⭐⭐⭐ Level 3', data: LEVEL3, color: 'var(--cat-purple)' },
];

/**
 * Resolve the audio path for a syllable.
 * - Simple KV syllables (2 chars, consonant+vowel) -> /audio/suku-kata/kv_*.mp3
 * - Standalone vowels (a, i, u, e, o) -> /audio/suku-kata/vokal_*.mp3
 * - NG syllables (nga, ngi, ...) -> /audio/suku-kata/ng_ng*.mp3
 * - NY syllables (nya, nyi, ...) -> /audio/suku-kata/ny_ny*.mp3
 * - Closed syllables (kvk) -> /audio/suku-kata/kvk_*.mp3
 */
function getSyllableAudioPath(syl: string): string {
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

const MembacaKata: React.FC = () => {
    const [activeLevel, setActiveLevel] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [playingKey, setPlayingKey] = useState<string | null>(null);

    const level = LEVELS[activeLevel];
    const words = level.data;
    const current = words[currentIndex];

    const playAudio = (src: string, key: string) => {
        setPlayingKey(key);
        audioPlayer.play(src, () => setPlayingKey(null));
    };

    const handleSyllableClick = (syl: string, index: number) => {
        const path = getSyllableAudioPath(syl);
        playAudio(path, `syl_${index}`);
    };

    const handleCombine = () => {
        setRevealed(true);
        playAudio(`/audio/membaca-kata/kata_${current.word}.mp3`, 'word');
    };

    const handleNav = (direction: 'prev' | 'next') => {
        setRevealed(false);
        setPlayingKey(null);
        if (direction === 'next') {
            setCurrentIndex((currentIndex + 1) % words.length);
        } else {
            setCurrentIndex((currentIndex - 1 + words.length) % words.length);
        }
    };

    const handleTabChange = (idx: number) => {
        setActiveLevel(idx);
        setCurrentIndex(0);
        setRevealed(false);
        setPlayingKey(null);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/membaca" className="btn" style={{
                    backgroundColor: 'var(--cat-orange)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    flexShrink: 0,
                }}>
                    ⬅️ Kembali
                </Link>
                <h2 className={styles.gameTitle}>
                    Membaca Kata 📝
                </h2>
            </header>

            {/* Tab Switcher */}
            <div className={styles.tabSwitcher}>
                {LEVELS.map((lvl, i) => (
                    <button
                        key={lvl.key}
                        className={`${styles.tabBtn} ${activeLevel === i ? styles.tabBtnActive : ''}`}
                        style={activeLevel === i ? { background: lvl.color, borderColor: lvl.color } : {}}
                        onClick={() => handleTabChange(i)}
                    >
                        {lvl.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className={styles.contentArea}>
                <p className={styles.hint}>Ketuk suku kata, lalu gabungkan!</p>

                {/* Syllable Cards */}
                <div className={styles.syllableRow}>
                    {current.syllables.map((syl, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <span className={styles.plusSign}>+</span>}
                            <div
                                className={`${styles.syllableCard} ${i === 0 ? styles.syllableCard1 : styles.syllableCard2}`}
                                onClick={() => handleSyllableClick(syl, i)}
                            >
                                <span className={styles.syllableCardText}>
                                    {syl.toUpperCase()}
                                </span>
                                {playingKey === `syl_${i}` && (
                                    <span className={styles.playingBadge}>🔊</span>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {/* Combine Button */}
                <button className={styles.combineBtn} onClick={handleCombine}>
                    🔊 Gabungkan!
                </button>

                {/* Reveal Card */}
                <div className={`${styles.revealCard} ${revealed ? styles.revealCardVisible : ''}`}>
                    <span className={styles.revealEmoji}>{current.emoji}</span>
                    <span className={styles.revealWord}>{current.word}</span>
                </div>

                {/* Navigation */}
                <div className={styles.navRow}>
                    <button className={styles.navBtn} onClick={() => handleNav('prev')}>
                        ◀️ Sebelumnya
                    </button>
                    <span className={styles.progress}>
                        {currentIndex + 1} / {words.length}
                    </span>
                    <button className={styles.navBtn} onClick={() => handleNav('next')}>
                        Selanjutnya ▶️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MembacaKata;
