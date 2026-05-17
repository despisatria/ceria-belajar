import React, { useState, useEffect } from 'react';
import styles from './GambarSama.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

// ─── Types ───────────────────────────────────────────────

/** A single card in the deck, produced by the game's buildDeck function. */
export interface DeckCard {
    uniqueId: string;
    pairId: number;
    content: string;
    /** Arbitrary extra data the renderCard function can use. */
    extra?: Record<string, unknown>;
}

/** Configuration for a single matching game variant. */
export interface MatchingGameConfig {
    /** Title shown above the game board (e.g., "Cocokkan Bentuk dengan Bendanya! 🔺") */
    title: string;
    /** Subtitle / hint line */
    subtitle: string;
    /** Text spoken on mount via useSpeakOnMount */
    speechText: string;
    /** Theme color CSS variable (e.g., "var(--cat-green)") */
    themeColor: string;
    /** Link back to the menu (e.g., "/mencocokkan") */
    menuLink: string;
    /** Round winner panel — heading */
    roundWinTitle: string;
    /** Round winner panel — body */
    roundWinMessage: string;
    /** How many pairs per round. Default: [4, 6, 8, 10, 12] */
    roundConfigs?: number[];
    /** Grid column formula override. Default uses card count. */
    getGridCols?: (cardCount: number) => number;
    /**
     * Build the deck for a given round.
     * Receives the pair count for the round.
     * Must return an array of DeckCard objects (already shuffled).
     */
    buildDeck: (pairCount: number) => DeckCard[];
    /**
     * Render the inside of a card.
     * Receives the card data and returns a React node.
     */
    renderCard: (card: DeckCard) => React.ReactNode;
}

// ─── Default helpers ─────────────────────────────────────

const DEFAULT_ROUND_CONFIGS = [4, 6, 8, 10, 12];

function defaultGetGridCols(cardCount: number): number {
    if (cardCount <= 12) return 4;
    if (cardCount <= 16) return 4;
    if (cardCount <= 20) return 5;
    return 6;
}

// ─── Component ───────────────────────────────────────────

const PairMatchingGame: React.FC<{ config: MatchingGameConfig }> = ({ config }) => {
    const {
        title,
        subtitle,
        speechText,
        themeColor,
        menuLink,
        roundWinTitle,
        roundWinMessage,
        roundConfigs = DEFAULT_ROUND_CONFIGS,
        getGridCols = defaultGetGridCols,
        buildDeck,
        renderCard,
    } = config;

    const totalRounds = roundConfigs.length;

    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<DeckCard[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState(false);
    const [lives, setLives] = useState(5);

    const initRound = (r: number) => {
        const pairCount = roundConfigs[r - 1];
        const deck = buildDeck(pairCount);
        setCards(deck);
        setFlippedIndices([]);
        setMatchedIndices([]);
        setRoundWinner(false);
        setIsLocked(false);
    };

    useEffect(() => {
        initRound(round);
    }, [round]);

    useSpeakOnMount(speechText);

    const handleCardClick = (index: number) => {
        if (isLocked) return;
        if (flippedIndices.length === 2) return;
        if (flippedIndices.includes(index)) return;
        setFlippedIndices(prev => [...prev, index]);
    };

    // Check for match when 2 cards are flipped
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

    // Check for round completion
    useEffect(() => {
        if (cards.length > 0 && matchedIndices.length === cards.length && !roundWinner) {
            setRoundWinner(true);
            playWinSound();
            const nextRound = round + 1;
            if (nextRound > totalRounds) {
                setTimeout(() => setGameOver(true), 2000);
            } else {
                setTimeout(() => setRound(nextRound), 2000);
            }
        }
    }, [matchedIndices, cards.length, round, roundWinner, totalRounds]);

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
                menuLink={menuLink}
                themeColor={themeColor}
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={totalRounds}
                borderColor={themeColor}
            >
                <h2 className={styles.gameTitle} style={{ color: themeColor }}>{title}</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    {subtitle}
                </p>
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink={menuLink}
                        themeColor={themeColor}
                        className={styles.gameOverPanel}
                        scoreClassName={styles.finalScore}
                    />
                ) : (
                    <>
                        {roundWinner && (
                            <div className={styles.roundWinnerOverlay}>
                                <div className={styles.roundWinnerPanel}>
                                    <h2 style={{ color: themeColor }}>{roundWinTitle}</h2>
                                    <p>{roundWinMessage}</p>
                                </div>
                            </div>
                        )}
                        <div
                            className={styles.cardsGrid}
                            style={{
                                gridTemplateColumns: `repeat(${getGridCols(cards.length)}, 1fr)`
                            }}
                        >
                            {cards.map((card, index) => (
                                <div
                                    key={card.uniqueId}
                                    className={`${styles.card} ${flippedIndices.includes(index) ? styles.selected : ''} ${matchedIndices.includes(index) ? styles.matched : ''}`}
                                    onClick={!flippedIndices.includes(index) && !matchedIndices.includes(index) ? () => handleCardClick(index) : undefined}
                                >
                                    <div className={styles.cardInnerFaceUp}>
                                        {renderCard(card)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PairMatchingGame;
