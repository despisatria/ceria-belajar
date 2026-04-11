import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Mencocokkan/GambarSama.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';

interface WordEntry {
    word: string;
    emoji: string;
}

// === WORD POOLS BY DIFFICULTY (matching materi Membaca Kata) ===

// Pool 1: 2 suku kata KV+KV (Level 1)
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

// Pool 5: 3 suku kata campuran (tertutup/NG/NY)
const POOL_5: WordEntry[] = [
    { word: 'jerapah', emoji: '🦒' },
    { word: 'kelinci', emoji: '🐰' },
    { word: 'pesawat', emoji: '✈️' },
    { word: 'harimau', emoji: '🐯' },
    { word: 'semangka', emoji: '🍉' },
];

// Round config: [pairCount, primaryPool, ...fillerPools]
const ROUND_CONFIGS: { pairs: number; primary: WordEntry[]; fillers: WordEntry[][] }[] = [
    { pairs: 4, primary: POOL_1, fillers: [] },
    { pairs: 6, primary: POOL_2, fillers: [POOL_1] },
    { pairs: 8, primary: POOL_3, fillers: [POOL_1, POOL_2] },
    { pairs: 10, primary: POOL_4, fillers: [POOL_1, POOL_2, POOL_3] },
    { pairs: 12, primary: POOL_5, fillers: [POOL_1, POOL_2, POOL_3, POOL_4] },
];

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

interface CardData {
    uniqueId: string;
    pairId: number;
    content: string;
    isWord: boolean;
}

interface CardProps {
    content: string;
    isWord: boolean;
    isSelected: boolean;
    isMatched: boolean;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ content, isWord, isSelected, isMatched, onClick }) => {
    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ''} ${isMatched ? styles.matched : ''}`}
            onClick={!isSelected && !isMatched ? onClick : undefined}
        >
            <div
                className={styles.cardInnerFaceUp}
                style={isWord ? { fontWeight: 900, fontSize: '1.6rem', color: 'var(--cat-blue)', letterSpacing: '1px', textTransform: 'uppercase' } : {}}
            >
                {content}
            </div>
        </div>
    );
};

const PasangkanKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState(false);
    const [lives, setLives] = useState(5);

    const initRound = (r: number) => {
        const config = ROUND_CONFIGS[r - 1];
        const { pairs, primary, fillers } = config;

        // Pick words: prioritize primary pool, fill rest from fillers
        const primaryShuffled = shuffleArray(primary);
        const selected: WordEntry[] = primaryShuffled.slice(0, Math.min(pairs, primaryShuffled.length));

        // Fill remaining from filler pools
        if (selected.length < pairs) {
            const remaining = pairs - selected.length;
            const fillerPool = shuffleArray(fillers.flat().filter(w => !selected.some(s => s.word === w.word)));
            selected.push(...fillerPool.slice(0, remaining));
        }

        // Create card deck: one word card + one emoji card per pair
        const deck: CardData[] = [];
        selected.forEach((entry, idx) => {
            deck.push({ uniqueId: `${idx}-word`, pairId: idx, content: entry.word, isWord: true });
            deck.push({ uniqueId: `${idx}-emoji`, pairId: idx, content: entry.emoji, isWord: false });
        });

        setCards(shuffleArray(deck));
        setFlippedIndices([]);
        setMatchedIndices([]);
        setRoundWinner(false);
        setIsLocked(false);
    };

    useEffect(() => {
        initRound(round);
    }, [round]);

    // Speak instruction on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Pasangkan kata dengan gambar yang tepat!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const handleCardClick = (index: number) => {
        if (isLocked) return;
        if (flippedIndices.length === 2) return;
        if (flippedIndices.includes(index)) return;

        setFlippedIndices(prev => [...prev, index]);
    };

    useEffect(() => {
        if (flippedIndices.length === 2) {
            setIsLocked(true);
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.pairId === secondCard.pairId && firstCard.uniqueId !== secondCard.uniqueId) {
                // Match!
                playCorrectSound();
                setTimeout(() => {
                    setMatchedIndices(prev => [...prev, firstIndex, secondIndex]);
                    setFlippedIndices([]);
                    setScore(prev => prev + 10);
                    setIsLocked(false);
                }, 800);
            } else {
                // No match
                playWrongSound();
                setLives(prev => {
                    const newLives = prev - 1;
                    if (newLives <= 0) {
                        setTimeout(() => setGameOver(true), 500);
                    }
                    return newLives;
                });
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 1200);
            }
        }
    }, [flippedIndices, cards]);

    useEffect(() => {
        if (cards.length > 0 && matchedIndices.length === cards.length && !roundWinner) {
            setRoundWinner(true);
            playWinSound();
            const nextRound = round + 1;
            if (round < 5) {
                setTimeout(() => {
                    setRound(nextRound);
                }, 2000);
            } else {
                setTimeout(() => {
                    setGameOver(true);
                }, 2000);
            }
        }
    }, [matchedIndices, cards.length, round, roundWinner]);

    const handleRestart = () => {
        if (round === 1) {
            initRound(1);
        } else {
            setRound(1);
        }
        setScore(0);
        setLives(5);
        setGameOver(false);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader} style={{ borderBottomColor: 'var(--cat-orange)' }}>
                <div className={styles.headerTop}>
                    <Link to="/membaca" className="btn" style={{
                        backgroundColor: 'var(--cat-orange)',
                        textTransform: 'none',
                        fontSize: '1rem',
                        padding: '8px 16px'
                    }}>
                        ⬅️ Kembali
                    </Link>
                    <div className={styles.statsPanel}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nyawa</span>
                            <LivesDisplay lives={lives} />
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nilai</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-orange)' }}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Putaran</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-orange)' }}>{round}/5</span>
                        </div>
                    </div>
                </div>
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-orange)' }}>Pasangkan Kata & Gambar! 🔗</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Cocokkan kata dengan gambar yang sesuai
                </p>
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverPanel}>
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
                        {roundWinner && (
                            <div className={styles.roundWinnerOverlay}>
                                <div className={styles.roundWinnerPanel}>
                                    <h2 style={{ color: 'var(--cat-orange)' }}>Hebat! 🌟</h2>
                                    <p>Semua kata dan gambar cocok!</p>
                                </div>
                            </div>
                        )}
                        <div
                            className={styles.cardsGrid}
                            style={{
                                gridTemplateColumns: `repeat(${cards.length <= 12 ? 4 : cards.length <= 16 ? 4 : cards.length <= 20 ? 5 : 6}, 1fr)`
                            }}
                        >
                            {cards.map((card, index) => (
                                <Card
                                    key={card.uniqueId}
                                    content={card.content}
                                    isWord={card.isWord}
                                    isSelected={flippedIndices.includes(index)}
                                    isMatched={matchedIndices.includes(index)}
                                    onClick={() => handleCardClick(index)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PasangkanKata;
