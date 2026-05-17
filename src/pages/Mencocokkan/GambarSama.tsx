import React, { useState, useEffect } from 'react';
import styles from './GambarSama.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameHeader from '../../components/GameHeader';
import GameOverScreen from '../../components/GameOverScreen';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

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
    const [lives, setLives] = useState(5);

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

    useSpeakOnMount("Pilih dua gambar yang sama!");

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
                    setLives(5);
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
        setLives(5);
        setGameOver(false);
        initRound(1);
    };

    return (
        <div className={styles.gameContainer}>             <GameHeader
                 menuLink="/mencocokkan"
                 themeColor="var(--cat-green)"
                 styles={styles}
                 lives={lives}
                 score={score}
                 round={round}
                 totalRounds={EMOJI_SETS.length}
             >
                <h2 className={styles.gameTitle}>Pilih dua gambar yang sama!</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Contoh: Anggur (🍇) dan Anggur (🍇)
                </p>
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/mencocokkan"
                        themeColor="var(--cat-green)"
                        className={styles.gameOverPanel}
                        scoreClassName={styles.finalScore}
                    />
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
