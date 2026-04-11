import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MembacaKata.module.css';
import { audioPlayer } from '../../utils/audioPlayer';
import { getSyllableAudioPath } from '../../utils/syllableAudio';

interface WordEntry {
    word: string;
    syllables: string[];
    emoji: string;
}

// === LEVEL 1: KV+KV+KV (suku kata terbuka) ===
const LEVEL1: WordEntry[] = [
    { word: 'sepatu', syllables: ['se', 'pa', 'tu'], emoji: '👟' },
    { word: 'celana', syllables: ['ce', 'la', 'na'], emoji: '👖' },
    { word: 'kepala', syllables: ['ke', 'pa', 'la'], emoji: '🗣️' },
    { word: 'boneka', syllables: ['bo', 'ne', 'ka'], emoji: '🧸' },
    { word: 'gurita', syllables: ['gu', 'ri', 'ta'], emoji: '🐙' },
    { word: 'sepeda', syllables: ['se', 'pe', 'da'], emoji: '🚲' },
    { word: 'kelapa', syllables: ['ke', 'la', 'pa'], emoji: '🥥' },
    { word: 'kamera', syllables: ['ka', 'me', 'ra'], emoji: '📷' },
    { word: 'kereta', syllables: ['ke', 're', 'ta'], emoji: '🚂' },
    { word: 'medali', syllables: ['me', 'da', 'li'], emoji: '🏅' },
];

// === LEVEL 2: Campuran (tertutup, NG, NY) ===
const LEVEL2: WordEntry[] = [
    { word: 'jerapah', syllables: ['je', 'ra', 'pah'], emoji: '🦒' },
    { word: 'merpati', syllables: ['mer', 'pa', 'ti'], emoji: '🕊️' },
    { word: 'kelinci', syllables: ['ke', 'lin', 'ci'], emoji: '🐰' },
    { word: 'membaca', syllables: ['mem', 'ba', 'ca'], emoji: '📖' },
    { word: 'menulis', syllables: ['me', 'nu', 'lis'], emoji: '✏️' },
    { word: 'pesawat', syllables: ['pe', 'sa', 'wat'], emoji: '✈️' },
    { word: 'harimau', syllables: ['ha', 'ri', 'mau'], emoji: '🐯' },
    { word: 'menyapu', syllables: ['me', 'nya', 'pu'], emoji: '🧹' },
    { word: 'pelangi', syllables: ['pe', 'la', 'ngi'], emoji: '🌈' },
    { word: 'semangka', syllables: ['se', 'mang', 'ka'], emoji: '🍉' },
];

const LEVELS = [
    { key: 'level1', label: '⭐ Level 1', data: LEVEL1, color: 'var(--cat-blue)' },
    { key: 'level2', label: '⭐⭐ Level 2', data: LEVEL2, color: 'var(--cat-green)' },
];

const CARD_COLORS = [styles.syllableCard1, styles.syllableCard2, styles.syllableCard3];

const MembacaKata3: React.FC = () => {
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
                    backgroundColor: 'var(--cat-cyan)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    flexShrink: 0,
                }}>
                    ⬅️ Kembali
                </Link>
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-cyan)' }}>
                    Membaca Kata 3 Suku Kata 📖
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
                                className={`${styles.syllableCard} ${CARD_COLORS[i] || styles.syllableCard1}`}
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

export default MembacaKata3;
