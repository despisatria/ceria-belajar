import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GambarSama.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';

// Base sets of emojis for different rounds
const EMOJI_SETS = [
    ['🍎', '🍌', '🍇', '🍉'], // Round 1: 4 pairs (8 cards)
    ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'], // Round 2: 6 pairs (12 cards)
    ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑'], // Round 3: 8 pairs (16 cards)
    ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🎱', '🪀'], // Round 4: 10 pairs (20 cards)
    ['🍎', '🐶', '🚗', '⚽️', '🍌', '🐱', '🚕', '🏀', '🍉', '🦊', '🚌', '🎾'], // Round 5: 12 pairs (24 cards)
];

interface CardProps {
    id: number;
    content: string;
    isFlipped: boolean;
    isMatched: boolean;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ content, isFlipped, isMatched, onClick }) => {
    return (
        <div
            className={`${styles.card} ${isFlipped || isMatched ? styles.flipped : ''} ${isMatched ? styles.matched : ''}`}
            onClick={!isFlipped && !isMatched ? onClick : undefined}
        >
            <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                    <div className={styles.cardPattern}>❓</div>
                </div>
                <div className={styles.cardBack}>
                    {content}
                </div>
            </div>
        </div>
    );
};

const GambarSama: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<{ id: number; content: string }[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState(false);

    const initRound = (r: number) => {
        const emojiSet = EMOJI_SETS[r - 1];
        const deck = [...emojiSet, ...emojiSet]
            .sort(() => Math.random() - 0.5)
            .map((content, index) => ({ id: index, content }));
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

        setFlippedIndices(prev => [...prev, index]);
    };

    useEffect(() => {
        if (flippedIndices.length === 2) {
            setIsLocked(true);
            const [firstIndex, secondIndex] = flippedIndices;

            if (cards[firstIndex].content === cards[secondIndex].content) {
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
            <header className={styles.gameHeader}>
                <div className={styles.headerTop}>
                    <Link to="/mencocokkan" className="btn" style={{
                        backgroundColor: 'var(--cat-red)',
                        textTransform: 'none',
                        fontSize: '1rem',
                        padding: '8px 16px'
                    }}>
                        ⬅️ Kembali
                    </Link>
                    <div className={styles.statsPanel}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nilai</span>
                            <span className={styles.statValue}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Putaran</span>
                            <span className={styles.statValue}>{round}/5</span>
                        </div>
                    </div>
                </div>
                <h2 className={styles.gameTitle}>Klik dua gambar identik!</h2>
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverPanel}>
                        <h2>Game Selesai! 🎉</h2>
                        <p>Selamat! Kamu telah menyelesaikan semua putaran!</p>
                        <p className={styles.finalScore}>Total Nilai: {score}</p>
                        <button className="btn" onClick={handleRestart}>Main Lagi 🔄</button>
                        <Link to="/mencocokkan" className="btn" style={{ marginLeft: '15px', backgroundColor: 'var(--quaternary)' }}>
                            Mencocokkan Lainnya 🧩
                        </Link>
                    </div>
                ) : (
                    <>
                        {roundWinner && (
                            <div className={styles.roundWinnerOverlay}>
                                <div className={styles.roundWinnerPanel}>
                                    <h2>Luar Biasa! 🌟</h2>
                                    <p>Bersiap untuk tantangan selanjutnya...</p>
                                </div>
                            </div>
                        )}
                        <div
                            className={styles.cardsGrid}
                            style={{
                                gridTemplateColumns: `repeat(${cards.length <= 12 ? 4 : cards.length <= 16 ? 4 : 6}, 1fr)`
                            }}
                        >
                            {cards.map((card, index) => (
                                <Card
                                    key={card.id}
                                    id={card.id}
                                    content={card.content}
                                    isFlipped={flippedIndices.includes(index)}
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

export default GambarSama;
