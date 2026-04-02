import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GambarSama.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';

// Color pairs: colored circle -> emoji representing that color
const COLOR_PAIRS = [
    { id: 1, name: 'Merah', color: '#E53935', emoji: '🌹' },
    { id: 2, name: 'Biru', color: '#1E88E5', emoji: '🐳' },
    { id: 3, name: 'Kuning', color: '#FDD835', emoji: '🌻' },
    { id: 4, name: 'Hijau', color: '#43A047', emoji: '🐸' },
    { id: 5, name: 'Oranye', color: '#FB8C00', emoji: '🥕' },
    { id: 6, name: 'Ungu', color: '#8E24AA', emoji: '🍇' },
    { id: 7, name: 'Merah Muda', color: '#EC407A', emoji: '🌸' },
    { id: 8, name: 'Coklat', color: '#6D4C41', emoji: '🐻' },
    { id: 9, name: 'Hitam', color: '#212121', emoji: '🎩' },
    { id: 10, name: 'Putih', color: '#FAFAFA', emoji: '🐑' },
    { id: 11, name: 'Abu-abu', color: '#9E9E9E', emoji: '🐘' },
];

// 5 rounds with progressively more pairs
const ROUND_CONFIGS = [
    4, // Round 1: 4 pairs (8 cards)
    6, // Round 2: 6 pairs (12 cards)
    8, // Round 3: 8 pairs (16 cards)
    10, // Round 4: 10 pairs (20 cards)
    11, // Round 5: 11 pairs (22 cards)
];

interface CardProps {
    content: string;
    colorCircle?: string;
    isSelected: boolean;
    isMatched: boolean;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ content, colorCircle, isSelected, isMatched, onClick }) => {
    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ''} ${isMatched ? styles.matched : ''}`}
            onClick={!isSelected && !isMatched ? onClick : undefined}
        >
            <div className={styles.cardInnerFaceUp}>
                {colorCircle ? (
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: colorCircle,
                        border: colorCircle === '#FAFAFA' ? '3px solid #ccc' : '3px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }} />
                ) : (
                    <span style={{ fontSize: '4rem' }}>
                        {content}
                    </span>
                )}
            </div>
        </div>
    );
};

const CocokkanWarna: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<{ uniqueId: string; pairId: number; content: string; colorCircle?: string }[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState(false);
    const [lives, setLives] = useState(5);

    const initRound = (r: number) => {
        const pairCount = ROUND_CONFIGS[r - 1];

        // Select random color pairs
        const shuffledPairs = [...COLOR_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);

        // Create the deck: one card shows the emoji, the other shows the colored circle
        const deck: { uniqueId: string; pairId: number; content: string; colorCircle?: string }[] = [];
        shuffledPairs.forEach((pair) => {
            deck.push({ uniqueId: `${pair.id}-emoji`, pairId: pair.id, content: pair.emoji });
            deck.push({ uniqueId: `${pair.id}-color`, pairId: pair.id, content: '', colorCircle: pair.color });
        });

        // Shuffle
        deck.sort(() => Math.random() - 0.5);

        setCards(deck);
        setFlippedIndices([]);
        setMatchedIndices([]);
        setRoundWinner(false);
        setIsLocked(false);
    };

    useEffect(() => {
        initRound(round);
    }, [round]);

    // Speak title on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Cocokkan Nama Warna!");
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

            if (firstCard.pairId === secondCard.pairId) {
                playCorrectSound();
                setTimeout(() => {
                    setMatchedIndices(prev => [...prev, firstIndex, secondIndex]);
                    setFlippedIndices([]);
                    setScore(prev => prev + 10);
                    setIsLocked(false);
                }, 800);
            } else {
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
                    <Link to="/mencocokkan" className="btn" style={{
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
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-orange)' }}>Cocokkan Nama Warna! 🎨</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Pasangkan warna dengan gambar yang sesuai
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
                            <Link to="/mencocokkan" className="btn" style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}>
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
                                    <p>Semua warna cocok!</p>
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
                                    colorCircle={card.colorCircle}
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

export default CocokkanWarna;
