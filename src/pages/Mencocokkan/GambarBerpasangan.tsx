import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GambarSama.module.css'; // Reusing the same styles for consistency
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';

// Pairs for Gambar Berpasangan (e.g., Animal -> Food/Product)
const MATCHING_PAIRS = [
    { id: 1, itemA: '🐄', itemB: '🥛' }, // Cow -> Milk
    { id: 2, itemA: '🐝', itemB: '🍯' }, // Bee -> Honey
    { id: 3, itemA: '🐒', itemB: '🍌' }, // Monkey -> Banana
    { id: 4, itemA: '🐔', itemB: '🥚' }, // Chicken -> Egg
    { id: 5, itemA: '🌧️', itemB: '☂️' }, // Rain -> Umbrella
    { id: 6, itemA: '🦷', itemB: '🪥' }, // Tooth -> Toothbrush
    { id: 7, itemA: '🔒', itemB: '🔑' }, // Lock -> Key
    { id: 8, itemA: '🔨', itemB: '📍' }, // Hammer -> Nail (Pushpin)
    { id: 9, itemA: '🕸️', itemB: '🕷️' }, // Web -> Spider
    { id: 10, itemA: '🌸', itemB: '🦋' }, // Flower -> Butterfly
    { id: 11, itemA: '🐟', itemB: '🎣' }, // Fish -> Fishing Pole
    { id: 12, itemA: '📝', itemB: '✏️' }, // Paper -> Pencil
];

// 5 rounds with progressively more pairs
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
                {content}
            </div>
        </div>
    );
};

const GambarBerpasangan: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<{ uniqueId: string; pairId: number; content: string }[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState(false);

    const initRound = (r: number) => {
        const pairCount = ROUND_CONFIGS[r - 1];

        // Select random pairs for this round
        const shuffledPairs = [...MATCHING_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);

        // Create the deck
        const deck: { uniqueId: string; pairId: number; content: string }[] = [];
        shuffledPairs.forEach((pair) => {
            deck.push({ uniqueId: `${pair.id}-A`, pairId: pair.id, content: pair.itemA });
            deck.push({ uniqueId: `${pair.id}-B`, pairId: pair.id, content: pair.itemB });
        });

        // Shuffle the deck
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

    const handleCardClick = (index: number) => {
        if (isLocked) return;
        if (flippedIndices.length === 2) return;
        if (flippedIndices.includes(index)) return; // prevent clicking same card twice

        setFlippedIndices(prev => [...prev, index]);
    };

    useEffect(() => {
        if (flippedIndices.length === 2) {
            setIsLocked(true);
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            // Check if they are a pair (same pairId)
            if (firstCard.pairId === secondCard.pairId) {
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
        setRound(1);
        setScore(0);
        setGameOver(false);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader} style={{ borderBottomColor: 'var(--cat-purple)' }}>
                <div className={styles.headerTop}>
                    <Link to="/mencocokkan" className="btn" style={{
                        backgroundColor: 'var(--cat-purple)',
                        textTransform: 'none',
                        fontSize: '1rem',
                        padding: '8px 16px'
                    }}>
                        ⬅️ Kembali
                    </Link>
                    <div className={styles.statsPanel}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nilai</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-purple)' }}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Putaran</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-purple)' }}>{round}/5</span>
                        </div>
                    </div>
                </div>
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-purple)' }}>Cocokkan Gambar Berpasangan!</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Contoh: Sapi (🐄) dipasangkan dengan Susu (🥛)
                </p>
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverPanel}>
                        <h2>Game Selesai! 🎉</h2>
                        <p>Pintar sekali! Kamu berhasil mencocokkan semua pasangan!</p>
                        <p className={styles.finalScore}>Total Nilai: {score}</p>
                        <button className="btn" onClick={handleRestart} style={{ backgroundColor: 'var(--cat-purple)' }}>Main Lagi 🔄</button>
                        <Link to="/mencocokkan" className="btn" style={{ marginLeft: '15px', backgroundColor: 'var(--quaternary)' }}>
                            Mencocokkan Lainnya 🧩
                        </Link>
                    </div>
                ) : (
                    <>
                        {roundWinner && (
                            <div className={styles.roundWinnerOverlay}>
                                <div className={styles.roundWinnerPanel}>
                                    <h2 style={{ color: 'var(--cat-purple)' }}>Hebat! 🌟</h2>
                                    <p>Pasangan gambar sangat cocok!</p>
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

export default GambarBerpasangan;
