import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './PohonKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';
import confetti from 'canvas-confetti';

interface WordEntry {
    word: string;
    emoji: string;
}

// === WORD POOLS BY DIFFICULTY (matching materi Membaca Kata) ===

// Pool 1: 2 suku kata KV+KV (4 huruf - paling mudah)
const POOL_1: WordEntry[] = [
    { word: 'baju', emoji: '👕' }, { word: 'bola', emoji: '⚽' }, { word: 'buku', emoji: '📚' },
    { word: 'kuda', emoji: '🐴' }, { word: 'nasi', emoji: '🍚' }, { word: 'roti', emoji: '🍞' },
    { word: 'sapi', emoji: '🐮' }, { word: 'susu', emoji: '🥛' }, { word: 'topi', emoji: '🧢' },
];

// Pool 2: 2 suku kata 4-5 huruf (Level 2)
const POOL_2: WordEntry[] = [
    { word: 'ayam', emoji: '🐔' }, { word: 'balon', emoji: '🎈' }, { word: 'ikan', emoji: '🐟' },
    { word: 'kapal', emoji: '🚢' }, { word: 'rumah', emoji: '🏠' }, { word: 'telur', emoji: '🥚' },
];

// Pool 3: 2 suku kata NG/NY (Level 3)
const POOL_3: WordEntry[] = [
    { word: 'bunga', emoji: '🌸' }, { word: 'singa', emoji: '🦁' }, { word: 'payung', emoji: '☂️' },
];

// Pool 4: 3 suku kata terbuka (KV+KV+KV)
const POOL_4: WordEntry[] = [
    { word: 'sepatu', emoji: '👟' }, { word: 'celana', emoji: '👖' }, { word: 'boneka', emoji: '🧸' },
    { word: 'gurita', emoji: '🐙' }, { word: 'sepeda', emoji: '🚲' }, { word: 'kelapa', emoji: '🥥' },
    { word: 'kamera', emoji: '📷' }, { word: 'kereta', emoji: '🚂' },
];

// Pool 5: 3 suku kata campuran (paling sulit)
const POOL_5: WordEntry[] = [
    { word: 'jerapah', emoji: '🦒' }, { word: 'kelinci', emoji: '🐰' }, { word: 'pesawat', emoji: '✈️' },
    { word: 'harimau', emoji: '🐯' }, { word: 'semangka', emoji: '🍉' },
];

// 5 rounds, progressively harder
const ROUND_POOL_MAP: WordEntry[][] = [
    POOL_1,                    // Round 1: 4 huruf sederhana
    POOL_2,                    // Round 2: 4-5 huruf
    POOL_3,                    // Round 3: 5-6 huruf NG/NY
    POOL_4,                    // Round 4: 6 huruf (3 suku kata)
    POOL_5,                    // Round 5: 7-8 huruf (paling sulit)
];

const TOTAL_ROUNDS = 5;
const DISTRACTOR_COUNT = 2; // jumlah huruf pengecoh

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Generate random distractor letters not in the word
function getDistractors(word: string, count: number): string[] {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const wordLetters = new Set(word.toLowerCase().split(''));
    const available = alphabet.split('').filter(l => !wordLetters.has(l));
    return shuffleArray(available).slice(0, count);
}

// Predefined apple positions on the tree crown (percentage-based)
const APPLE_POSITIONS = [
    { top: 8,  left: 35 },
    { top: 8,  left: 58 },
    { top: 25, left: 18 },
    { top: 25, left: 48 },
    { top: 25, left: 72 },
    { top: 42, left: 28 },
    { top: 42, left: 58 },
    { top: 42, left: 82 },
    { top: 55, left: 15 },
    { top: 55, left: 70 },
];

interface AppleData {
    id: string;
    letter: string;
    top: number;
    left: number;
    status: 'onTree' | 'falling' | 'harvested';
}

const PohonKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [apples, setApples] = useState<AppleData[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [currentEmoji, setCurrentEmoji] = useState('');
    const [filledLetters, setFilledLetters] = useState<string[]>([]);
    const [errorAppleId, setErrorAppleId] = useState<string | null>(null);

    const generateRound = useCallback(() => {
        const pool = ROUND_POOL_MAP[Math.min(round - 1, ROUND_POOL_MAP.length - 1)];
        const wordEntry = shuffleArray(pool)[0];
        const word = wordEntry.word.toLowerCase();

        setCurrentWord(word);
        setCurrentEmoji(wordEntry.emoji);
        setFilledLetters([]);

        // Create apple letters: actual word letters + distractors
        const wordLetters = word.split('');
        const distractors = getDistractors(word, DISTRACTOR_COUNT);
        const allLetters = shuffleArray([...wordLetters, ...distractors]);

        // Assign positions
        const positions = shuffleArray(APPLE_POSITIONS.slice(0, allLetters.length));

        const newApples: AppleData[] = allLetters.map((letter, idx) => ({
            id: `apple-${round}-${idx}`,
            letter: letter.toUpperCase(),
            top: positions[idx].top,
            left: positions[idx].left,
            status: 'onTree',
        }));

        setApples(newApples);
        setErrorAppleId(null);
    }, [round]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver, generateRound]);

    // Check if word is complete
    useEffect(() => {
        if (currentWord && filledLetters.length === currentWord.length) {
            // Word complete!
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#EF4444', '#10B981', '#F59E0B', '#3B82F6'],
            });

            setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound > TOTAL_ROUNDS) {
                    playWinSound();
                    setGameOver(true);
                } else {
                    setRound(nextRound);
                }
            }, 1500);
        }
    }, [filledLetters, currentWord, round]);

    const handleAppleTap = (apple: AppleData) => {
        if (apple.status !== 'onTree') return;
        if (errorAppleId) return; // prevent rapid taps during error animation

        const nextIndex = filledLetters.length;
        const expectedLetter = currentWord[nextIndex]?.toUpperCase();

        if (apple.letter === expectedLetter) {
            // Correct!
            playCorrectSound();
            setScore(prev => prev + 10);
            setFilledLetters(prev => [...prev, apple.letter]);

            // Mark apple as falling
            setApples(prev => prev.map(a =>
                a.id === apple.id ? { ...a, status: 'falling' } : a
            ));

            // Then mark as harvested
            setTimeout(() => {
                setApples(prev => prev.map(a =>
                    a.id === apple.id ? { ...a, status: 'harvested' } : a
                ));
            }, 500);

        } else {
            // Wrong!
            playWrongSound();
            setErrorAppleId(apple.id);

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            setTimeout(() => {
                setErrorAppleId(null);
            }, 500);
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/membaca" className="btn" style={{
                    backgroundColor: 'var(--cat-red)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    flexShrink: 0,
                }}>
                    ⬅️ Kembali
                </Link>
                <div className={styles.statsContainer}>
                    <div className={styles.statBox}>
                        Nyawa: <LivesDisplay lives={lives} />
                    </div>
                    <div className={styles.statBox}>
                        Ronde <span style={{ color: 'var(--cat-red)' }}>{Math.min(round, TOTAL_ROUNDS)}</span>/{TOTAL_ROUNDS}
                    </div>
                    <div className={styles.statBox}>
                        Skor: <span style={{ color: 'var(--cat-red)' }}>{score}</span>
                    </div>
                </div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {gameOver ? (
                    <div className={styles.gameOverCard}>
                        {lives > 0 ? (
                            <>
                                <h2>🎉 Luar Biasa! 🎉</h2>
                                <p>Kamu berhasil mengeja semua kata!</p>
                            </>
                        ) : (
                            <>
                                <h2>😢 Kesempatan Habis!</h2>
                                <p>Jangan menyerah, ayo coba lagi!</p>
                            </>
                        )}
                        <div className={styles.finalScore}>Skor Akhir: {score}</div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn" onClick={handleRestart} style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--cat-red)' }}>
                                🔄 Main Lagi
                            </button>
                            <Link to="/membaca" className="btn" style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}>
                                ⬅️ Menu Utama
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Target Emoji + Instruction */}
                        <div className={styles.instructionArea}>
                            <h2 className={styles.instructionText}>Petik huruf untuk mengeja:</h2>
                            <span className={styles.targetEmoji}>{currentEmoji}</span>
                        </div>

                        {/* Word Boxes */}
                        <div className={styles.wordBoxContainer}>
                            {currentWord.split('').map((_letter, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.letterBox} ${idx < filledLetters.length ? styles.letterBoxFilled : ''} ${idx === filledLetters.length ? styles.letterBoxNext : ''}`}
                                >
                                    {idx < filledLetters.length ? filledLetters[idx] : ''}
                                </div>
                            ))}
                        </div>

                        {/* Play Area with Tree */}
                        <div className={styles.playArea}>
                            <div className={styles.treeContainer}>
                                {apples.map(apple => (
                                    apple.status !== 'harvested' && (
                                        <button
                                            key={apple.id}
                                            className={`${styles.appleBtn} ${apple.status === 'falling' ? styles.falling : ''} ${errorAppleId === apple.id ? styles.errorShake : ''}`}
                                            style={{ left: `${apple.left}%`, top: `${apple.top}%` }}
                                            onClick={() => handleAppleTap(apple)}
                                        >
                                            <span className={styles.appleIcon}>🍎</span>
                                            <span className={styles.appleLabel}>{apple.letter}</span>
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PohonKata;
