import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './TebakKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';
import confetti from 'canvas-confetti';

interface WordEntry {
    word: string;
    emoji: string;
}

// === WORD POOLS BY DIFFICULTY (matching materi Membaca Kata) ===

// Pool 1: 2 suku kata KV+KV (Level 1 - paling mudah)
const POOL_1: WordEntry[] = [
    { word: 'baju', emoji: '👕' },
    { word: 'bola', emoji: '⚽' },
    { word: 'buku', emoji: '📚' },
    { word: 'kuda', emoji: '🐴' },
    { word: 'nasi', emoji: '🍚' },
    { word: 'roti', emoji: '🍞' },
    { word: 'sapi', emoji: '🐮' },
    { word: 'susu', emoji: '🥛' },
    { word: 'topi', emoji: '🧢' },
];

// Pool 2: 2 suku kata 5 huruf (Level 2)
const POOL_2: WordEntry[] = [
    { word: 'ayam', emoji: '🐔' },
    { word: 'balon', emoji: '🎈' },
    { word: 'ikan', emoji: '🐟' },
    { word: 'kapal', emoji: '🚢' },
    { word: 'rumah', emoji: '🏠' },
    { word: 'telur', emoji: '🥚' },
];

// Pool 3: 2 suku kata NG/NY (Level 3)
const POOL_3: WordEntry[] = [
    { word: 'bunga', emoji: '🌸' },
    { word: 'singa', emoji: '🦁' },
    { word: 'payung', emoji: '☂️' },
    { word: 'penyu', emoji: '🐢' },
];

// Pool 4: 3 suku kata terbuka (KV+KV+KV)
const POOL_4: WordEntry[] = [
    { word: 'sepatu', emoji: '👟' },
    { word: 'celana', emoji: '👖' },
    { word: 'boneka', emoji: '🧸' },
    { word: 'gurita', emoji: '🐙' },
    { word: 'sepeda', emoji: '🚲' },
    { word: 'kelapa', emoji: '🥥' },
    { word: 'kamera', emoji: '📷' },
    { word: 'kereta', emoji: '🚂' },
];

// Pool 5: 3 suku kata campuran (paling sulit)
const POOL_5: WordEntry[] = [
    { word: 'jerapah', emoji: '🦒' },
    { word: 'kelinci', emoji: '🐰' },
    { word: 'pesawat', emoji: '✈️' },
    { word: 'harimau', emoji: '🐯' },
    { word: 'semangka', emoji: '🍉' },
];

// Round → pool mapping (10 rounds, progressively harder)
// Rounds 1-2: Pool 1 (kata mudah), Rounds 3-4: Pool 2, etc.
const ROUND_POOL_MAP: { pool: WordEntry[]; allPools: WordEntry[][] }[] = [
    { pool: POOL_1, allPools: [POOL_1] },                                    // Round 1
    { pool: POOL_1, allPools: [POOL_1] },                                    // Round 2
    { pool: POOL_2, allPools: [POOL_2, POOL_1] },                            // Round 3
    { pool: POOL_2, allPools: [POOL_2, POOL_1] },                            // Round 4
    { pool: POOL_3, allPools: [POOL_3, POOL_1, POOL_2] },                    // Round 5
    { pool: POOL_3, allPools: [POOL_3, POOL_1, POOL_2] },                    // Round 6
    { pool: POOL_4, allPools: [POOL_4, POOL_1, POOL_2, POOL_3] },            // Round 7
    { pool: POOL_4, allPools: [POOL_4, POOL_1, POOL_2, POOL_3] },            // Round 8
    { pool: POOL_5, allPools: [POOL_5, POOL_1, POOL_2, POOL_3, POOL_4] },    // Round 9
    { pool: POOL_5, allPools: [POOL_5, POOL_1, POOL_2, POOL_3, POOL_4] },    // Round 10
];

const TOTAL_ROUNDS = 10;

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const TebakKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [currentWord, setCurrentWord] = useState<WordEntry>(POOL_1[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedCorrect, setSelectedCorrect] = useState<string | null>(null);
    const [selectedWrong, setSelectedWrong] = useState<string | null>(null);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
        });
    }, []);

    const generateRound = useCallback(() => {
        setSelectedCorrect(null);
        setSelectedWrong(null);

        // Get pool config for current round
        const config = ROUND_POOL_MAP[round - 1];
        const { pool, allPools } = config;

        // Pick a word from the primary pool, not yet used
        const available = pool.filter(w => !usedWords.has(w.word));
        const primaryPool = available.length > 0 ? available : pool;

        // Pick random correct word
        const correct = shuffleArray(primaryPool)[0];
        setCurrentWord(correct);
        setUsedWords(prev => new Set(prev).add(correct.word));

        // Pick 3 wrong options from all available pools (same difficulty range)
        const allWords = allPools.flat();
        const wrongPool = allWords.filter(w => w.word !== correct.word);
        const wrongOptions = shuffleArray(wrongPool).slice(0, 3).map(w => w.word);

        // Combine and shuffle
        const allOptions = shuffleArray([correct.word, ...wrongOptions]);
        setOptions(allOptions);
    }, [round, usedWords]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver]);

    // Speak instruction on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Gambar apa ini? Pilih kata yang benar!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const handleOptionClick = (word: string) => {
        if (selectedCorrect || selectedWrong) return;

        if (word === currentWord.word) {
            // Correct!
            playCorrectSound();
            triggerConfetti();
            setSelectedCorrect(word);
            setScore(prev => prev + 10);

            setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound > TOTAL_ROUNDS) {
                    playWinSound();
                    setGameOver(true);
                } else {
                    setRound(nextRound);
                }
            }, 1500);
        } else {
            // Wrong!
            playWrongSound();
            setSelectedWrong(word);

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            // Allow retry after shake animation
            setTimeout(() => {
                setSelectedWrong(null);
            }, 800);
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
        setUsedWords(new Set());
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
                <div className={styles.statsContainer}>
                    <div className={styles.statBox}>
                        Nyawa: <LivesDisplay lives={lives} />
                    </div>
                    <div className={styles.statBox}>
                        Ronde <span style={{ color: 'var(--cat-orange)' }}>{Math.min(round, TOTAL_ROUNDS)}</span>/{TOTAL_ROUNDS}
                    </div>
                    <div className={styles.statBox}>
                        Skor: <span style={{ color: 'var(--cat-orange)' }}>{score}</span>
                    </div>
                </div>
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverCard}>
                        {lives > 0 ? (
                            <>
                                <h2>🎉 Luar Biasa! 🎉</h2>
                                <p>Kamu berhasil menyelesaikan permainan ini!</p>
                            </>
                        ) : (
                            <>
                                <h2>💔 Kesempatan Habis! 💔</h2>
                                <p>Jangan menyerah, ayo coba lagi!</p>
                            </>
                        )}
                        <div className={styles.finalScore}>Skor Akhir: {score}</div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn" onClick={handleRestart} style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--cat-orange)' }}>
                                🔄 Main Lagi
                            </button>
                            <Link to="/membaca" className="btn" style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}>
                                ⬅️ Menu Utama
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.questionText}>Gambar apa ini? 🤔</h2>

                        <div className={styles.emojiDisplay}>
                            <span key={round} className={styles.emojiLarge}>{currentWord.emoji}</span>
                        </div>

                        <div className={styles.optionsGrid}>
                            {options.map((word) => {
                                let btnClass = styles.wordBtn;
                                if (selectedCorrect === word) btnClass += ` ${styles.wordBtnCorrect}`;
                                if (selectedWrong === word) btnClass += ` ${styles.wordBtnWrong}`;

                                return (
                                    <button
                                        key={word}
                                        className={btnClass}
                                        onClick={() => handleOptionClick(word)}
                                        disabled={selectedCorrect !== null}
                                    >
                                        {word}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default TebakKata;
