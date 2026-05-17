import React, { useState, useEffect } from 'react';
import styles from '../Mencocokkan/GambarSama.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameHeader from '../../components/GameHeader';
import GameOverScreen from '../../components/GameOverScreen';

// All alphabet pairs: letter -> word + icon
const ALPHABET_PAIRS = [
    { id: 1, letter: 'A', word: 'Apel', icon: '🍎' },
    { id: 2, letter: 'B', word: 'Buku', icon: '📚' },
    { id: 3, letter: 'C', word: 'Cicak', icon: '🦎' },
    { id: 4, letter: 'D', word: 'Domba', icon: '🐑' },
    { id: 5, letter: 'E', word: 'Ember', icon: '🪣' },
    { id: 6, letter: 'F', word: 'Foto', icon: '📷' },
    { id: 7, letter: 'G', word: 'Gajah', icon: '🐘' },
    { id: 8, letter: 'H', word: 'Harimau', icon: '🐅' },
    { id: 9, letter: 'I', word: 'Ikan', icon: '🐟' },
    { id: 10, letter: 'J', word: 'Jeruk', icon: '🍊' },
    { id: 11, letter: 'K', word: 'Kucing', icon: '🐈' },
    { id: 12, letter: 'L', word: 'Lampu', icon: '💡' },
    { id: 13, letter: 'M', word: 'Mobil', icon: '🚗' },
    { id: 14, letter: 'N', word: 'Nanas', icon: '🍍' },
    { id: 15, letter: 'O', word: 'Obat', icon: '💊' },
    { id: 16, letter: 'P', word: 'Pisang', icon: '🍌' },
    { id: 17, letter: 'Q', word: 'Quran', icon: '📖' },
    { id: 18, letter: 'R', word: 'Rumah', icon: '🏠' },
    { id: 19, letter: 'S', word: 'Sapi', icon: '🐄' },
    { id: 20, letter: 'T', word: 'Topi', icon: '🧢' },
    { id: 21, letter: 'U', word: 'Ular', icon: '🐍' },
    { id: 22, letter: 'V', word: 'Virus', icon: '🦠' },
    { id: 23, letter: 'W', word: 'Wortel', icon: '🥕' },
    { id: 24, letter: 'X', word: 'Xilofon', icon: '🎹' },
    { id: 25, letter: 'Y', word: 'Yoyo', icon: '🪀' },
    { id: 26, letter: 'Z', word: 'Zebra', icon: '🦓' },
];

// 5 rounds with progressively more pairs
const ROUND_CONFIGS = [
    4, // Round 1: 4 pairs (8 cards)
    6, // Round 2: 6 pairs (12 cards)
    8, // Round 3: 8 pairs (16 cards)
    10, // Round 4: 10 pairs (20 cards)
    12, // Round 5: 12 pairs (24 cards)
];

interface CardProps {
    id: string;
    content: string;
    isSelected: boolean;
    isMatched: boolean;
    isLetter?: boolean;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ content, isSelected, isMatched, isLetter, onClick }) => {
    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ''} ${isMatched ? styles.matched : ''}`}
            onClick={!isSelected && !isMatched ? onClick : undefined}
        >
            <div className={styles.cardInnerFaceUp} style={isLetter ? { fontWeight: 900, color: 'var(--cat-blue)' } : {}}>
                {content}
            </div>
        </div>
    );
};
interface AlfabetCocokkanProps {
    isLowercase?: boolean;
}

const AlfabetCocokkan: React.FC<AlfabetCocokkanProps> = ({ isLowercase = false }) => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<{ uniqueId: string; pairId: number; content: string; isLetter: boolean }[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [roundWinner, setRoundWinner] = useState(false);
    const [lives, setLives] = useState(5);

    const initRound = (r: number) => {
        const pairCount = ROUND_CONFIGS[r - 1];

        // Select random alphabet pairs for this round
        const shuffledPairs = [...ALPHABET_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);

        // Create the deck: one card shows the letter, the other shows icon + word
        const deck: { uniqueId: string; pairId: number; content: string; isLetter: boolean }[] = [];
        shuffledPairs.forEach((pair) => {
            const displayLetter = isLowercase ? pair.letter.toLowerCase() : pair.letter;
            deck.push({ uniqueId: `${pair.id}-letter`, pairId: pair.id, content: displayLetter, isLetter: true });
            deck.push({ uniqueId: `${pair.id}-word`, pairId: pair.id, content: pair.icon, isLetter: false });
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

    // Speak title on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const text = isLowercase ? "Cocokkan Huruf Kecil dengan Gambar!" : "Cocokkan Huruf Besar dengan Gambar!";
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, [isLowercase]);

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
        <div className={styles.gameContainer}>             <GameHeader
            menuLink="/alfabet"
            themeColor="var(--cat-blue)"
            styles={styles}
            lives={lives}
            score={score}
            round={round}
            totalRounds={5}
            borderColor="var(--cat-blue)"
        >
            <h2 className={styles.gameTitle} style={{ color: 'var(--cat-blue)' }}>Cocokkan Huruf {isLowercase ? 'Kecil' : 'Besar'} dengan Gambar! 🔤</h2>
            <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                Contoh: Huruf {isLowercase ? 'a' : 'A'} dipasangkan dengan 🍎
            </p>
        </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/alfabet"
                        themeColor="var(--cat-blue)"
                        className={styles.gameOverPanel}
                        scoreClassName={styles.finalScore}
                    />
                ) : (
                    <>
                        {roundWinner && (
                            <div className={styles.roundWinnerOverlay}>
                                <div className={styles.roundWinnerPanel}>
                                    <h2 style={{ color: 'var(--cat-blue)' }}>Hebat! 🌟</h2>
                                    <p>Huruf dan gambar cocok semua!</p>
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
                                    id={card.uniqueId}
                                    content={card.content}
                                    isLetter={card.isLetter}
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

export default AlfabetCocokkan;
