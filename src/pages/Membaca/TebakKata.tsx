import React, { useState, useEffect, useCallback } from 'react';
import styles from './TebakKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import { shuffleArray } from '../../utils/helpers';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import confetti from 'canvas-confetti';

import { type WordEntry, POOL_1, POOL_2, POOL_3, POOL_4, POOL_5 } from '../../data/membacaWordPools';

// Round → pool mapping (10 rounds, progressively harder)
// Rounds 1-2: Pool 1 (kata mudah), Rounds 3-4: Pool 2, etc.
const ROUND_POOL_MAP: { pool: WordEntry[]; allPools: WordEntry[][] }[] = [
    { pool: POOL_1, allPools: [POOL_1] },                                    // Round 1
    { pool: POOL_1, allPools: [POOL_1] },                                    // Round 2
    { pool: POOL_2, allPools: [POOL_2, POOL_1] },                            // Round 3
    { pool: POOL_2, allPools: [POOL_2, POOL_1] },                            // Round 4
    { pool: POOL_3, allPools: [POOL_3, POOL_1, POOL_2] },                    // Round 5
    { pool: POOL_3, allPools: [POOL_3, POOL_1, POOL_2] },                    // Round 6
    { pool: POOL_4, allPools: [POOL_4, POOL_1, POOL_2, POOL_3] },            // Round 7
    { pool: POOL_4, allPools: [POOL_4, POOL_1, POOL_2, POOL_3] },            // Round 8
    { pool: POOL_5, allPools: [POOL_5, POOL_1, POOL_2, POOL_3, POOL_4] },    // Round 9
    { pool: POOL_5, allPools: [POOL_5, POOL_1, POOL_2, POOL_3, POOL_4] },    // Round 10
];

const TOTAL_ROUNDS = 10;



const TebakKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [currentWord, setCurrentWord] = useState<WordEntry>(POOL_1[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedCorrect, setSelectedCorrect] = useState<string | null>(null);
    const [selectedWrong, setSelectedWrong] = useState<string | null>(null);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
        });
    }, []);

    const generateRound = useCallback(() => {
        setSelectedCorrect(null);
        setSelectedWrong(null);

        // Get pool config for current round
        const config = ROUND_POOL_MAP[round - 1];
        const { pool, allPools } = config;

        // Pick a word from the primary pool, not yet used
        const available = pool.filter(w => !usedWords.has(w.word));
        const primaryPool = available.length > 0 ? available : pool;

        // Pick random correct word
        const correct = shuffleArray(primaryPool)[0];
        setCurrentWord(correct);
        setUsedWords(prev => new Set(prev).add(correct.word));

        // Pick 3 wrong options from all available pools (same difficulty range)
        const allWords = allPools.flat();
        const wrongPool = allWords.filter(w => w.word !== correct.word);
        const wrongOptions = shuffleArray(wrongPool).slice(0, 3).map(w => w.word);

        // Combine and shuffle
        const allOptions = shuffleArray([correct.word, ...wrongOptions]);
        setOptions(allOptions);
    }, [round, usedWords]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver]);

    useSpeakOnMount("Gambar apa ini? Pilih kata yang benar!");

    const handleOptionClick = (word: string) => {
        if (selectedCorrect || selectedWrong) return;

        if (word === currentWord.word) {
            // Correct!
            playCorrectSound();
            triggerConfetti();
            setSelectedCorrect(word);
            setScore(prev => prev + 10);

            setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound > TOTAL_ROUNDS) {
                    playWinSound();
                    setGameOver(true);
                } else {
                    setRound(nextRound);
                }
            }, 1500);
        } else {
            // Wrong!
            playWrongSound();
            setSelectedWrong(word);

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            // Allow retry after shake animation
            setTimeout(() => {
                setSelectedWrong(null);
            }, 800);
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
        setUsedWords(new Set());
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
                totalRounds={TOTAL_ROUNDS}
                borderColor="var(--cat-orange)"
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-orange)' }}>Tebak Kata dari Gambar! 🖼️</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Lihat gambar di bawah dan pilih kata yang benar
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
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                    />
                ) : (
                    <>
                        <h2 className={styles.questionText}>Gambar apa ini? 🤔</h2>

                        <div className={styles.emojiDisplay}>
                            <span key={round} className={styles.emojiLarge}>{currentWord.emoji}</span>
                        </div>

                        <div className={styles.optionsGrid}>
                            {options.map((word) => {
                                let btnClass = styles.wordBtn;
                                if (selectedCorrect === word) btnClass += ` ${styles.wordBtnCorrect}`;
                                if (selectedWrong === word) btnClass += ` ${styles.wordBtnWrong}`;

                                return (
                                    <button
                                        key={word}
                                        className={btnClass}
                                        onClick={() => handleOptionClick(word)}
                                        disabled={selectedCorrect !== null}
                                    >
                                        {word}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default TebakKata;
