import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './PohonKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import { shuffleArray } from '../../utils/helpers';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import confetti from 'canvas-confetti';

import { type WordEntry, POOL_1, POOL_2, POOL_3, POOL_4, POOL_5 } from '../../data/membacaWordPools';

// 5 rounds, progressively harder
const ROUND_POOL_MAP: WordEntry[][] = [
    POOL_1,                    // Round 1: 4 huruf sederhana
    POOL_2,                    // Round 2: 4-5 huruf
    POOL_3,                    // Round 3: 5-6 huruf NG/NY
    POOL_4,                    // Round 4: 6 huruf (3 suku kata)
    POOL_5,                    // Round 5: 7-8 huruf (paling sulit)
];

const TOTAL_ROUNDS = 5;
const DISTRACTOR_COUNT = 2; // jumlah huruf pengecoh



// Generate random distractor letters not in the word
function getDistractors(word: string, count: number): string[] {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const wordLetters = new Set(word.toLowerCase().split(''));
    const available = alphabet.split('').filter(l => !wordLetters.has(l));
    return shuffleArray(available).slice(0, count);
}

// Predefined apple positions on the tree crown (percentage-based)
// Crown center is ~(47%, 33%), spread wide to avoid clumping
const APPLE_POSITIONS = [
    { top: 12, left: 40 },
    { top: 15, left: 55 },
    { top: 22, left: 25 },
    { top: 25, left: 47 },
    { top: 27, left: 65 },
    { top: 35, left: 22 },
    { top: 38, left: 45 },
    { top: 40, left: 65 },
    { top: 48, left: 30 },
    { top: 48, left: 55 },
];

interface AppleData {
    id: string;
    letter: string;
    top: number;
    left: number;
    status: 'onTree' | 'falling' | 'harvested';
}

const PohonKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [apples, setApples] = useState<AppleData[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [currentEmoji, setCurrentEmoji] = useState('');
    const [filledLetters, setFilledLetters] = useState<string[]>([]);
    const [errorAppleId, setErrorAppleId] = useState<string | null>(null);

    const generateRound = useCallback(() => {
        const pool = ROUND_POOL_MAP[Math.min(round - 1, ROUND_POOL_MAP.length - 1)];
        const wordEntry = shuffleArray(pool)[0];
        const word = wordEntry.word.toLowerCase();

        setCurrentWord(word);
        setCurrentEmoji(wordEntry.emoji);
        setFilledLetters([]);

        // Create apple letters: actual word letters + distractors
        const wordLetters = word.split('');
        const distractors = getDistractors(word, DISTRACTOR_COUNT);
        const allLetters = shuffleArray([...wordLetters, ...distractors]);

        // Assign positions
        const positions = shuffleArray(APPLE_POSITIONS.slice(0, allLetters.length));

        const newApples: AppleData[] = allLetters.map((letter, idx) => ({
            id: `apple-${round}-${idx}`,
            letter: letter.toUpperCase(),
            top: positions[idx].top,
            left: positions[idx].left,
            status: 'onTree',
        }));

        setApples(newApples);
        setErrorAppleId(null);
    }, [round]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver, generateRound]);

    const transitionRef = useRef(false);

    // Check if word is complete
    useEffect(() => {
        if (currentWord && filledLetters.length > 0 && filledLetters.length === currentWord.length) {
            if (transitionRef.current) return;
            transitionRef.current = true;

            // Word complete!
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#EF4444', '#10B981', '#F59E0B', '#3B82F6'],
            });

            const t = setTimeout(() => {
                setRound(prev => {
                    const nextRound = prev + 1;
                    if (nextRound > TOTAL_ROUNDS) {
                        playWinSound();
                        setGameOver(true);
                        return prev;
                    }
                    return nextRound;
                });
            }, 1500);

            return () => clearTimeout(t);
        } else if (filledLetters.length === 0) {
            transitionRef.current = false;
        }
    }, [filledLetters.length, currentWord]);

    const handleAppleTap = (apple: AppleData) => {
        if (apple.status !== 'onTree') return;
        if (errorAppleId) return; // prevent rapid taps during error animation

        const nextIndex = filledLetters.length;
        const expectedLetter = currentWord[nextIndex]?.toUpperCase();

        if (apple.letter === expectedLetter) {
            // Correct!
            playCorrectSound();
            setScore(prev => prev + 10);
            setFilledLetters(prev => [...prev, apple.letter]);

            // Mark apple as falling
            setApples(prev => prev.map(a =>
                a.id === apple.id ? { ...a, status: 'falling' } : a
            ));

            // Then mark as harvested
            setTimeout(() => {
                setApples(prev => prev.map(a =>
                    a.id === apple.id ? { ...a, status: 'harvested' } : a
                ));
            }, 500);

        } else {
            // Wrong!
            playWrongSound();
            setErrorAppleId(apple.id);

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            setTimeout(() => {
                setErrorAppleId(null);
            }, 500);
        }
    };

    useSpeakOnMount("Petik buah apel secara berurutan untuk mengeja kata!");

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
    };

    return (
        <div className={styles.gameContainer}>
            <GameHeader
                menuLink="/membaca"
                themeColor="var(--cat-red)"
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={TOTAL_ROUNDS}
                borderColor="var(--cat-red)"
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-red)' }}>Petik Huruf! 🍎</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Petik buah apel berhuruf secara berurutan untuk mengeja kata!
                </p>
            </GameHeader>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/membaca"
                        themeColor="var(--cat-red)"
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                        winMessage="Kamu berhasil mengeja semua kata!"
                    />
                ) : (
                    <>
                        {/* Target Emoji + Instruction */}
                        <div className={styles.instructionArea}>
                            <h2 className={styles.instructionText}>Petik huruf untuk mengeja:</h2>
                            <span className={styles.targetEmoji}>{currentEmoji}</span>
                        </div>

                        {/* Word Boxes */}
                        <div className={styles.wordBoxContainer}>
                            {currentWord.split('').map((_letter, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.letterBox} ${idx < filledLetters.length ? styles.letterBoxFilled : ''} ${idx === filledLetters.length ? styles.letterBoxNext : ''}`}
                                >
                                    {idx < filledLetters.length ? filledLetters[idx] : ''}
                                </div>
                            ))}
                        </div>

                        {/* Play Area with Tree */}
                        <div className={styles.playArea}>
                            <div className={styles.treeContainer}>
                                {apples.map(apple => (
                                    apple.status !== 'harvested' && (
                                        <button
                                            key={apple.id}
                                            className={`${styles.appleBtn} ${apple.status === 'falling' ? styles.falling : ''} ${errorAppleId === apple.id ? styles.errorShake : ''}`}
                                            style={{ left: `${apple.left}%`, top: `${apple.top}%` }}
                                            onClick={() => handleAppleTap(apple)}
                                        >
                                            <span className={styles.appleIcon}>🍎</span>
                                            <span className={styles.appleLabel}>{apple.letter}</span>
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PohonKata;
