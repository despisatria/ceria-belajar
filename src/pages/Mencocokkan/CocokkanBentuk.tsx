import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GambarSama.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';

const SHAPE_PAIRS = [
    { id: 1, shape: '🟠', object: '🍊' }, // Circle -> Clock
    { id: 2, shape: '🔺', object: '⛺' }, // Triangle -> Pizza
    { id: 3, shape: '🟧', object: '🎁' }, // Square -> Gift
    { id: 4, shape: '🟦', object: '🧊' }, // Square -> Gift
    { id: 5, shape: '❤️', object: '🍓' }, // Heart -> Strawberry
    { id: 6, shape: '🔷', object: '🪁' }, // Diamond -> Kite
    { id: 7, shape: '🌙', object: '🍌' }, // Crescent -> Croissant
    { id: 8, shape: '🔵', object: '🌍' }, // Blue Circle -> Earth
    { id: 9, shape: '☆', object: '🎖️' }, // Square -> Sponge
    { id: 10, shape: '－', object: '🥢' }, // Inverted Triangle -> Ice Cream Cone
    { id: 11, shape: '🟫', object: '🚪' }, // Black Square -> TV
    { id: 12, shape: '🟢', object: '🥝' }, // Green Circle -> Kiwi
];

const ROUND_CONFIGS = [
    4, // Round 1: 4 pairs (8 cards)
    6, // Round 2: 6 pairs (12 cards)
    8, // Round 3: 8 pairs (16 cards)
    10, // Round 4: 10 pairs (20 cards)
    12 // Round 5: 12 pairs (24 cards)
];

interface CardProps {
    id: string;
    content: string;
    isSelected: boolean;
    isMatched: boolean;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ content, isSelected, isMatched, onClick }) => {
    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ''} ${isMatched ? styles.matched : ''}`}
            onClick={!isSelected && !isMatched ? onClick : undefined}
        >
            <div className={styles.cardInnerFaceUp}>
                <span style={{ fontSize: '4.5rem' }}>
                    {content}
                </span>
            </div>
        </div>
    );
};

const CocokkanBentuk: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<{ uniqueId: string; pairId: number; content: string }[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState(false);
    const [lives, setLives] = useState(5);

    useEffect(() => {
        initRound(round);
    }, [round]);

    // Speak title on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Cocokkan Bentuk dengan Bendanya!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const initRound = (r: number) => {
        const pairCount = ROUND_CONFIGS[r - 1];
        const shuffledPairs = [...SHAPE_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);

        const deck: { uniqueId: string; pairId: number; content: string }[] = [];
        shuffledPairs.forEach((pair) => {
            deck.push({ uniqueId: `${pair.id}-shape`, pairId: pair.id, content: pair.shape });
            deck.push({ uniqueId: `${pair.id}-object`, pairId: pair.id, content: pair.object });
        });

        deck.sort(() => Math.random() - 0.5);

        setCards(deck);
        setFlippedIndices([]);
        setMatchedIndices([]);
        setRoundWinner(false);
        setIsLocked(false);
    };

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
            if (round <= 5) {
                setTimeout(() => {
                    if (nextRound > 5) {
                        setGameOver(true);
                    } else {
                        setRound(nextRound);
                    }
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
            <header className={styles.gameHeader} style={{ borderBottomColor: 'var(--cat-green)' }}>
                <div className={styles.headerTop}>
                    <Link to="/mencocokkan" className="btn" style={{
                        backgroundColor: 'var(--cat-green)',
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
                            <span className={styles.statValue} style={{ color: 'var(--cat-green)' }}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Putaran</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-green)' }}>{round}/5</span>
                        </div>
                    </div>
                </div>
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-green)' }}>Cocokkan Bentuk dengan Bendanya! 🔺</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Pasangkan bentuk dasar dengan benda nyatanya
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
                            <button className="btn" onClick={handleRestart} style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--cat-green)' }}>
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
                                    <h2 style={{ color: 'var(--cat-green)' }}>Bagus! 🌟</h2>
                                    <p>Bentuk berhasil dicocokkan!</p>
                                </div>
                            </div>
                        )}
                        <div
                            className={styles.cardsGrid}
                            style={{
                                gridTemplateColumns: `repeat(${cards.length <= 12 ? 4 : cards.length <= 16 ? 4 : 5}, 1fr)`
                            }}
                        >
                            {cards.map((card, index) => (
                                <Card
                                    key={card.uniqueId}
                                    id={card.uniqueId}
                                    content={card.content}
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

export default CocokkanBentuk;
