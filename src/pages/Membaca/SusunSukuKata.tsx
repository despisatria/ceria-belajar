import React, { useState, useEffect, useCallback } from 'react';
import styles from './SusunSukuKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import { shuffleArray } from '../../utils/helpers';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import confetti from 'canvas-confetti';

import { type WordEntry, POOL_1, POOL_2, POOL_3, POOL_4, POOL_5 } from '../../data/membacaWordPools';

// Round → pool mapping (10 rounds, progressively harder)
const ROUND_POOL_MAP: WordEntry[][] = [
    POOL_1,  // Round 1
    POOL_1,  // Round 2
    POOL_2,  // Round 3
    POOL_2,  // Round 4
    POOL_3,  // Round 5
    POOL_3,  // Round 6
    POOL_4,  // Round 7
    POOL_4,  // Round 8
    POOL_5,  // Round 9
    POOL_5,  // Round 10
];

const TOTAL_ROUNDS = 10;
const SYLLABLE_COLORS = ['', styles.syllableBtnColor2, styles.syllableBtnColor3, styles.syllableBtnColor4];



const SusunSukuKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [currentWord, setCurrentWord] = useState<WordEntry>(POOL_1[0]);
    const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [resultState, setResultState] = useState<'none' | 'correct' | 'wrong'>('none');
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
        setSelectedIndices([]);
        setResultState('none');

        const pool = ROUND_POOL_MAP[round - 1];
        const available = pool.filter(w => !usedWords.has(w.word));
        const candidates = available.length > 0 ? available : pool;

        const word = shuffleArray(candidates)[0];
        setCurrentWord(word);
        setUsedWords(prev => new Set(prev).add(word.word));

        // We want exactly 4 options total
        const correctSyllables = word.syllables;
        const neededDistractors = 4 - correctSyllables.length;

        // Get distractors from other words in the same pool
        const otherWords = pool.filter(w => w.word !== word.word);
        const distractorPool = otherWords.flatMap(w => w.syllables);

        let selectedDistractors: string[] = [];
        if (neededDistractors > 0) {
            // Filter to get unique syllables not already in the correct word
            const uniqueDistractors = Array.from(new Set(distractorPool)).filter(syl => !correctSyllables.includes(syl));
            selectedDistractors = shuffleArray(uniqueDistractors).slice(0, neededDistractors);
        }

        // Combine and shuffle
        const allOptions = [...correctSyllables, ...selectedDistractors];
        setShuffledSyllables(shuffleArray(allOptions));
    }, [round, usedWords]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver]);

    useSpeakOnMount("Susun suku kata menjadi kata yang benar!");

    const handleSyllableTap = (shuffledIndex: number) => {
        if (resultState !== 'none') return;

        // Allow unclicking
        if (selectedIndices.includes(shuffledIndex)) {
            setSelectedIndices(selectedIndices.filter(i => i !== shuffledIndex));
            return;
        }

        // Limit selection to the required word length
        if (selectedIndices.length >= currentWord.syllables.length) return;

        const newSelected = [...selectedIndices, shuffledIndex];
        setSelectedIndices(newSelected);
    };

    const handleSubmit = () => {
        if (selectedIndices.length !== currentWord.syllables.length || resultState !== 'none') return;

        // Build the answer from the order selected
        const answer = selectedIndices.map(i => shuffledSyllables[i]);
        const isCorrect = answer.every((syl, idx) => syl === currentWord.syllables[idx]);

        if (isCorrect) {
            setResultState('correct');
            playCorrectSound();
            triggerConfetti();
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
            setResultState('wrong');
            playWrongSound();

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            // Reset after shake animation
            setTimeout(() => {
                setSelectedIndices([]);
                setResultState('none');
            }, 1000);
        }
    };



    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
        setUsedWords(new Set());
    };

    // Build answer display
    const answerSlots = currentWord.syllables.map((_, idx) => {
        if (idx < selectedIndices.length) {
            return shuffledSyllables[selectedIndices[idx]];
        }
        return null;
    });

    return (
        <div className={styles.gameContainer}>
            <GameHeader
                menuLink="/membaca"
                themeColor="var(--cat-purple)"
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={TOTAL_ROUNDS}
                borderColor="var(--cat-purple)"
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-purple)' }}>Susun Suku Kata! 🧩</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Susun suku kata yang acak menjadi kata yang sesuai gambar
                </p>
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/membaca"
                        themeColor="var(--cat-purple)"
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                    />
                ) : (
                    <>
                        <h2 className={styles.questionText}>Susun kata untuk: </h2>

                        <div className={styles.emojiCard}>
                            <span key={round} className={styles.emojiLarge}>{currentWord.emoji}</span>
                        </div>

                        {/* Answer Slots */}
                        <div className={`${styles.slotsSection} ${resultState === 'correct' ? styles.resultCorrect : ''} ${resultState === 'wrong' ? styles.resultWrong : ''}`}>
                            <div className={styles.slotsLabel}>Jawabanmu:</div>
                            <div className={styles.slotsRow}>
                                {answerSlots.map((syl, idx) => (
                                    <div key={idx} className={`${styles.slot} ${syl ? styles.slotFilled : ''}`}>
                                        {syl && <span className={styles.slotText}>{syl}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Syllable Options */}
                        <div className={styles.optionsSection}>
                            <div className={styles.optionsLabel}>Ketuk suku kata sesuai urutan:</div>
                            <div className={styles.optionsRow}>
                                {shuffledSyllables.map((syl, idx) => {
                                    const isUsed = selectedIndices.includes(idx);
                                    const colorClass = SYLLABLE_COLORS[idx % SYLLABLE_COLORS.length];
                                    return (
                                        <button
                                            key={idx}
                                            className={`${styles.syllableBtn} ${colorClass} ${isUsed ? styles.syllableBtnUsed : ''}`}
                                            onClick={() => handleSyllableTap(idx)}
                                            disabled={resultState !== 'none'}
                                        >
                                            {syl}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {selectedIndices.length === currentWord.syllables.length && resultState === 'none' && (
                                <button
                                    className="btn"
                                    onClick={handleSubmit}
                                    style={{ backgroundColor: 'var(--cat-green)', padding: '10px 24px', fontSize: '1.2rem', margin: 0, textTransform: 'none' }}
                                >
                                    ✅ Cek Jawaban
                                </button>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default SusunSukuKata;
