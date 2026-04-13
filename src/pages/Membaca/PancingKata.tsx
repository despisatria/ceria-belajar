import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './PancingKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';
import confetti from 'canvas-confetti';

interface WordEntry {
    word: string;
    emoji: string;
}

// === WORD POOLS BY DIFFICULTY ===
const POOL_1: WordEntry[] = [
    { word: 'baju', emoji: '👕' }, { word: 'bola', emoji: '⚽' }, { word: 'buku', emoji: '📚' },
    { word: 'kuda', emoji: '🐴' }, { word: 'nasi', emoji: '🍚' }, { word: 'roti', emoji: '🍞' },
    { word: 'sapi', emoji: '🐮' }, { word: 'susu', emoji: '🥛' }, { word: 'topi', emoji: '🧢' },
];

const POOL_2: WordEntry[] = [
    { word: 'ayam', emoji: '🐔' }, { word: 'balon', emoji: '🎈' }, { word: 'ikan', emoji: '🐟' },
    { word: 'kapal', emoji: '🚢' }, { word: 'rumah', emoji: '🏠' }, { word: 'telur', emoji: '🥚' },
];

const POOL_3: WordEntry[] = [
    { word: 'bunga', emoji: '🌸' }, { word: 'singa', emoji: '🦁' }, { word: 'payung', emoji: '☂️' },
];

const POOL_4: WordEntry[] = [
    { word: 'sepatu', emoji: '👟' }, { word: 'celana', emoji: '👖' }, { word: 'boneka', emoji: '🧸' },
    { word: 'gurita', emoji: '🐙' }, { word: 'sepeda', emoji: '🚲' }, { word: 'kelapa', emoji: '🥥' },
    { word: 'kamera', emoji: '📷' }, { word: 'kereta', emoji: '🚂' },
];

const POOL_5: WordEntry[] = [
    { word: 'jerapah', emoji: '🦒' }, { word: 'kelinci', emoji: '🐰' }, { word: 'pesawat', emoji: '✈️' },
    { word: 'harimau', emoji: '🐯' }, { word: 'semangka', emoji: '🍉' },
];

const ROUND_POOL_MAP: { pool: WordEntry[]; allPools: WordEntry[][] }[] = [
    { pool: POOL_1, allPools: [POOL_1] },
    { pool: POOL_1, allPools: [POOL_1] },
    { pool: POOL_2, allPools: [POOL_2, POOL_1] },
    { pool: POOL_2, allPools: [POOL_2, POOL_1] },
    { pool: POOL_3, allPools: [POOL_3, POOL_1, POOL_2] },
    { pool: POOL_3, allPools: [POOL_3, POOL_1, POOL_2] },
    { pool: POOL_4, allPools: [POOL_4, POOL_2, POOL_1] },
    { pool: POOL_4, allPools: [POOL_4, POOL_2, POOL_1] },
    { pool: POOL_5, allPools: [POOL_5, POOL_4] },
    { pool: POOL_5, allPools: [POOL_5, POOL_4] },
];

const TOTAL_ROUNDS = 10;
const FISH_EMOJIS = ['🐟', '🐠', '🐬', '🐡', '🦈'];

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

interface FishData {
    id: string;
    word: string;
    emoji: string;
    top: number; // percentage
    direction: 'left' | 'right';
    duration: number; // seconds
    status: 'normal' | 'correct' | 'error';
    delay: number; // seconds
}

const PancingKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [currentWord, setCurrentWord] = useState<WordEntry>(POOL_1[0]);
    const [fishes, setFishes] = useState<FishData[]>([]);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
    const [isInteracting, setIsInteracting] = useState(false);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06B6D4', '#3B82F6', '#10B981', '#F59E0B']
        });
    }, []);

    const generateRound = useCallback(() => {
        setIsInteracting(false);
        const mapEntry = ROUND_POOL_MAP[round - 1];
        const primaryPool = mapEntry.pool;
        const available = primaryPool.filter(w => !usedWords.has(w.word));
        const candidates = available.length > 0 ? available : primaryPool;

        const correctWord = shuffleArray(candidates)[0];
        setCurrentWord(correctWord);
        setUsedWords(prev => new Set(prev).add(correctWord.word));

        // Get distractors
        const allPossible = mapEntry.allPools.flat().filter(w => w.word !== correctWord.word);
        const distractors = shuffleArray(allPossible).slice(0, 4); // 4 distractors + 1 correct = 5 fishes
        
        const allFishWords = shuffleArray([correctWord, ...distractors]);

        // Generate fish objects
        // Base swimming speed based on round (higher round = slightly faster/shorter duration)
        const baseDuration = Math.max(12, 20 - round); 

        const newFishes: FishData[] = allFishWords.map((wordData, idx) => {
            const isRightToLeft = Math.random() > 0.5;
            return {
                id: `fish-${idx}-${round}`,
                word: wordData.word,
                emoji: shuffleArray(FISH_EMOJIS)[0],
                // Spread them vertically between 10% and 80% to avoid overflowing bounds
                top: 10 + (idx * (70 / allFishWords.length)) + (Math.random() * 10 - 5),
                direction: isRightToLeft ? 'left' : 'right',
                duration: baseDuration + (Math.random() * 6 - 3), // random variation
                delay: Math.random() * -10, // negative delay so they start already on screen at varied positions
                status: 'normal'
            };
        });

        setFishes(newFishes);

        // Optional instruction audio
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Tolong tangkap ikan ${correctWord.word}!`);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }

    }, [round, usedWords]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver]);

    const handleFishTap = (fishId: string, word: string) => {
        if (isInteracting) return;
        setIsInteracting(true);

        const isCorrect = word === currentWord.word;

        setFishes(prev => prev.map(f => {
            if (f.id === fishId) {
                return { ...f, status: isCorrect ? 'correct' : 'error' };
            }
            return f;
        }));

        if (isCorrect) {
            playCorrectSound();
            triggerConfetti();
            setScore(prev => prev + 10);

            setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound > TOTAL_ROUNDS) {
                    playWinSound();
                    setGameOver(true);
                } else {
                    setRound(nextRound);
                }
            }, 1000);
        } else {
            playWrongSound();

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            // Reset fish status after error animation so user can try again
            setTimeout(() => {
                setFishes(prev => prev.map(f => f.id === fishId ? { ...f, status: 'normal' } : f));
                setIsInteracting(false);
            }, 500);
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
                    backgroundColor: 'var(--cat-cyan)',
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
                        Ronde <span style={{ color: 'var(--cat-cyan)' }}>{Math.min(round, TOTAL_ROUNDS)}</span>/{TOTAL_ROUNDS}
                    </div>
                    <div className={styles.statBox}>
                        Skor: <span style={{ color: 'var(--cat-cyan)' }}>{score}</span>
                    </div>
                </div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {gameOver ? (
                    <div className={styles.gameOverCard}>
                        {lives > 0 ? (
                            <>
                                <h2>🎉 Pemancing Hebat! 🎉</h2>
                                <p>Kamu berhasil menangkap semua ikan kata!</p>
                            </>
                        ) : (
                            <>
                                <h2>💔 Pancingan Terlepas! 💔</h2>
                                <p>Jangan menyerah, ayo coba pancing lagi!</p>
                            </>
                        )}
                        <div className={styles.finalScore}>Skor Akhir: {score}</div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn" onClick={handleRestart} style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--cat-cyan)' }}>
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
                            <h2 className={styles.instructionText}>Tangkap ikan:</h2>
                            <div className={styles.targetEmojiWrapper}>
                                <span className={styles.targetEmoji}>{currentWord.emoji}</span>
                            </div>
                        </div>

                        {/* Ocean Play Area */}
                        <div className={styles.pondArea}>
                            {fishes.map(fish => (
                                <button
                                    key={fish.id}
                                    className={`${styles.fishBtn} ${fish.direction === 'right' ? styles.flipFish : ''} ${fish.direction === 'left' ? styles.animSwimLeft : styles.animSwimRight} ${fish.status === 'error' ? styles.errorFish : ''} ${fish.status === 'correct' ? styles.correctFish : ''}`}
                                    style={{
                                        top: `${fish.top}%`,
                                        //@ts-ignore
                                        '--swim-duration': `${fish.duration}s`,
                                        animationDelay: `${fish.delay}s`
                                    }}
                                    onClick={() => handleFishTap(fish.id, fish.word)}
                                    disabled={isInteracting && fish.status !== 'error'}
                                >
                                    <span className={styles.fishEmoji}>{fish.emoji}</span>
                                    <span className={styles.fishLabel}>{fish.word}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PancingKata;
