import React, { useState, useEffect } from 'react';
import styles from '../Mencocokkan/GambarSama.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import { shuffleArray } from '../../utils/helpers';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

import { type WordEntry, POOL_1, POOL_2, POOL_3, POOL_4, POOL_5 } from '../../data/membacaWordPools';

// Round config: [pairCount, primaryPool, ...fillerPools]
const ROUND_CONFIGS: { pairs: number; primary: WordEntry[]; fillers: WordEntry[][] }[] = [
    { pairs: 4, primary: POOL_1, fillers: [] },
    { pairs: 6, primary: POOL_2, fillers: [POOL_1] },
    { pairs: 8, primary: POOL_3, fillers: [POOL_1, POOL_2] },
    { pairs: 10, primary: POOL_4, fillers: [POOL_1, POOL_2, POOL_3] },
    { pairs: 12, primary: POOL_5, fillers: [POOL_1, POOL_2, POOL_3, POOL_4] },
];



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

    useSpeakOnMount("Pasangkan kata dengan gambar yang tepat!");

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
            <GameHeader
                menuLink="/membaca"
                themeColor="var(--cat-orange)"
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={5}
                borderColor="var(--cat-orange)"
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-orange)' }}>Pasangkan Kata & Gambar! 🔗</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Cocokkan kata dengan gambar yang sesuai
                </p>
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/membaca"
                        themeColor="var(--cat-orange)"
                        className={styles.gameOverPanel}
                        scoreClassName={styles.finalScore}
                    />
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
