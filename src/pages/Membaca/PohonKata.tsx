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

// Flat list for categorization based on starting letters
const ALL_WORDS: WordEntry[] = [
    { word: 'baju', emoji: '👕' }, { word: 'bola', emoji: '⚽' }, { word: 'buku', emoji: '📚' },
    { word: 'kuda', emoji: '🐴' }, { word: 'nasi', emoji: '🍚' }, { word: 'roti', emoji: '🍞' },
    { word: 'sapi', emoji: '🐮' }, { word: 'susu', emoji: '🥛' }, { word: 'topi', emoji: '🧢' },
    { word: 'ayam', emoji: '🐔' }, { word: 'balon', emoji: '🎈' }, { word: 'ikan', emoji: '🐟' },
    { word: 'kapal', emoji: '🚢' }, { word: 'rumah', emoji: '🏠' }, { word: 'telur', emoji: '🥚' },
    { word: 'bunga', emoji: '🌸' }, { word: 'singa', emoji: '🦁' }, { word: 'payung', emoji: '☂️' },
    { word: 'sepatu', emoji: '👟' }, { word: 'celana', emoji: '👖' }, { word: 'boneka', emoji: '🧸' },
    { word: 'gurita', emoji: '🐙' }, { word: 'sepeda', emoji: '🚲' }, { word: 'kelapa', emoji: '🥥' },
    { word: 'kamera', emoji: '📷' }, { word: 'kereta', emoji: '🚂' },
    { word: 'jerapah', emoji: '🦒' }, { word: 'kelinci', emoji: '🐰' }, { word: 'pesawat', emoji: '✈️' },
    { word: 'harimau', emoji: '🐯' }, { word: 'semangka', emoji: '🍉' },
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

interface AppleData {
    id: string;
    word: string;
    emoji: string;
    letter: string;
    top: number; // percentage
    left: number; // percentage
    status: 'onTree' | 'falling' | 'harvested';
}

const PohonKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [apples, setApples] = useState<AppleData[]>([]);
    const [baskets, setBaskets] = useState<string[]>([]);
    const [selectedAppleId, setSelectedAppleId] = useState<string | null>(null);
    const [errorBasket, setErrorBasket] = useState<string | null>(null);

    const generateRound = useCallback(() => {
        // Group words by first letter
        const wordMap: Record<string, WordEntry[]> = {};
        ALL_WORDS.forEach(w => {
            const letter = w.word.charAt(0).toUpperCase();
            if (!wordMap[letter]) wordMap[letter] = [];
            wordMap[letter].push(w);
        });

        // Filter letters with at least 2 items
        const validLetters = Object.keys(wordMap).filter(l => wordMap[l].length >= 2);
        
        // Pick 2 target letters
        const chosenLetters = shuffleArray(validLetters).slice(0, 2);
        setBaskets(chosenLetters);

        // Pick 2 words per letter
        let roundWords: WordEntry[] = [];
        chosenLetters.forEach(letter => {
            const wordsForLetter = shuffleArray(wordMap[letter]).slice(0, 2);
            roundWords = roundWords.concat(wordsForLetter);
        });

        // Shuffle round words
        roundWords = shuffleArray(roundWords);

        // Predefined positions so apples look naturally placed on the tree crown
        const positions = shuffleArray([
            { top: 15, left: 30 },
            { top: 20, left: 60 },
            { top: 50, left: 20 },
            { top: 60, left: 70 }
        ]);

        const newApples: AppleData[] = roundWords.map((wordData, idx) => ({
            id: `apple-${round}-${idx}`,
            word: wordData.word,
            emoji: '🍎', // The apple icon itself
            letter: wordData.word.charAt(0).toUpperCase(),
            top: positions[idx].top,
            left: positions[idx].left,
            status: 'onTree'
        }));

        setApples(newApples);
        setSelectedAppleId(null);
    }, [round]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver, generateRound]);

    // Proceed to next round if all apples are harvested
    useEffect(() => {
        if (apples.length > 0 && apples.every(a => a.status === 'harvested')) {
            setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound > TOTAL_ROUNDS) {
                    playWinSound();
                    setGameOver(true);
                } else {
                    setRound(nextRound);
                }
            }, 1000);
        }
    }, [apples, round]);

    const handleAppleTap = (id: string) => {
        // Find if any is falling, prevent interactions while animation runs
        const isAnimActive = apples.some(a => a.status === 'falling');
        if (isAnimActive) return;

        // Toggle selection
        setSelectedAppleId(prev => (prev === id ? null : id));
    };

    const handleBasketTap = (basketLetter: string) => {
        if (!selectedAppleId) return;

        const targetApple = apples.find(a => a.id === selectedAppleId);
        if (!targetApple || targetApple.status !== 'onTree') return;

        const isCorrect = targetApple.letter === basketLetter;

        if (isCorrect) {
            playCorrectSound();
            setScore(prev => prev + 10);
            
            // Mark as falling
            setApples(prev => prev.map(a => 
                a.id === selectedAppleId ? { ...a, status: 'falling' } : a
            ));
            setSelectedAppleId(null);

            // Confetti for single harvest
            confetti({
                particleCount: 30,
                spread: 30,
                origin: { y: 0.8 },
                colors: ['#EF4444', '#FFFFFF']
            });

            // Remove it from view after some time
            setTimeout(() => {
                setApples(prev => prev.map(a => 
                    a.id === targetApple.id ? { ...a, status: 'harvested' } : a
                ));
            }, 600); // 0.6s falling animation

        } else {
            playWrongSound();
            setErrorBasket(basketLetter);
            setSelectedAppleId(null); // Deselect on error

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            setTimeout(() => {
                setErrorBasket(null);
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
                                <h2>🎉 Pekerja Keras! 🎉</h2>
                                <p>Kamu berhasil memanen dan memilah semua apel!</p>
                            </>
                        ) : (
                            <>
                                <h2>💔 Keranjang Kosong! 💔</h2>
                                <p>Jangan menyerah, ayo panen buah lagi!</p>
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
                        <div className={styles.instructionArea}>
                            <h2 className={styles.instructionText}>
                                {selectedAppleId 
                                    ? "Apel siap! Pilih keranjangnya!" 
                                    : "Pilih apel, lalu masukkan ke keranjang!"}
                            </h2>
                        </div>

                        <div className={styles.playArea}>
                            <div className={styles.treeContainer}>
                                <div className={styles.treeCrown}>
                                    {apples.map(apple => (
                                        apple.status !== 'harvested' && (
                                            <button
                                                key={apple.id}
                                                className={`${styles.appleBtn} ${selectedAppleId === apple.id ? styles.selected : ''} ${apple.status === 'falling' ? styles.falling : ''}`}
                                                style={{ left: `${apple.left}%`, top: `${apple.top}%` }}
                                                onClick={() => handleAppleTap(apple.id)}
                                            >
                                                <span className={styles.appleIcon}>{apple.emoji}</span>
                                                <span className={styles.appleLabel}>{apple.word}</span>
                                            </button>
                                        )
                                    ))}
                                </div>
                                <div className={styles.treeTrunk}></div>
                            </div>

                            <div className={styles.basketArea}>
                                {baskets.map(basket => (
                                    <button
                                        key={basket}
                                        className={`${styles.basketBtn} ${errorBasket === basket ? styles.shake : ''}`}
                                        onClick={() => handleBasketTap(basket)}
                                        disabled={!selectedAppleId}
                                    >
                                        <span className={styles.basketIcon}>🧺</span>
                                        <span className={styles.basketLabel}>Awalan {basket}</span>
                                    </button>
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
