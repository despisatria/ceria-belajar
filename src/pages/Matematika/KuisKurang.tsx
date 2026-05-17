import React, { useState, useEffect, useCallback } from 'react';
import styles from '../Membaca/TebakKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameHeader from '../../components/GameHeader';
import GameOverScreen from '../../components/GameOverScreen';
import { shuffleArray } from '../../utils/helpers';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import confetti from 'canvas-confetti';

const TOTAL_ROUNDS = 10;

const KuisKurang: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [selectedCorrect, setSelectedCorrect] = useState<number | null>(null);
    const [selectedWrong, setSelectedWrong] = useState<number | null>(null);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F97316', '#FB923C', '#10B981', '#F59E0B']
        });
    }, []);

    const generateRound = useCallback(() => {
        setSelectedCorrect(null);
        setSelectedWrong(null);

        // Target range 2 to 10 for num1
        const n1 = Math.floor(Math.random() * 9) + 2; 
        const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // 1 to n1-1
        const targetDiff = n1 - n2;

        setNum1(n1);
        setNum2(n2);

        // Generate 3 wrong options close to the answer
        const wrongOptions = new Set<number>();
        while (wrongOptions.size < 3) {
            const offset = Math.floor(Math.random() * 6) - 3; 
            let wrongAns = targetDiff + (offset >= 0 ? offset + 1 : offset);
            
            // Ensure >= 0 and <= 10
            if (wrongAns >= 0 && wrongAns <= 10 && wrongAns !== targetDiff) {
                wrongOptions.add(wrongAns);
            }
        }

        const allOptions = shuffleArray([targetDiff, ...Array.from(wrongOptions)]);
        setOptions(allOptions);
    }, []);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver, generateRound]);

    useSpeakOnMount("Berapa sisa kuenya? Pilih angka yang benar!");

    const handleOptionClick = (ans: number) => {
        if (selectedCorrect !== null || selectedWrong !== null) return;

        const correctAnswer = num1 - num2;

        if (ans === correctAnswer) {
            // Correct!
            playCorrectSound();
            triggerConfetti();
            setSelectedCorrect(ans);
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
            setSelectedWrong(ans);

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
    };

    return (
        <div className={styles.gameContainer}>             <GameHeader
                 menuLink="/matematika"
                 themeColor="var(--cat-orange)"
                 styles={styles}
                 lives={lives}
                 score={score}
                 round={round}
                 totalRounds={TOTAL_ROUNDS}
                 borderColor="var(--cat-orange)"
             >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-orange)' }}>Kuis Kurang Kue 🍪</h2>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '10px', fontWeight: 'bold' }}>
                    Hitung sisa kuenya dan pilih jawaban yang benar!
                </p>
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/matematika"
                        themeColor="var(--cat-orange)"
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                    />
                ) : (
                    <>
                        {/* Visual representation of subtraction */}
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'center', 
                            gap: '10px',
                            marginBottom: '20px',
                            minHeight: '100px',
                            marginTop: '20px'
                        }}>
                            {Array.from({ length: num1 }).map((_, i) => {
                                const isEaten = i >= num1 - num2;
                                return (
                                    <div key={`cookie-${i}`} className="math-visual-item" style={{ position: 'relative', fontSize: '3.5rem' }}>
                                        <span style={{ opacity: isEaten ? 0.3 : 1, transition: 'all 0.3s ease' }}>🍪</span>
                                        {isEaten && (
                                            <span className="math-visual-item" style={{ 
                                                position: 'absolute', 
                                                top: '50%', 
                                                left: '50%', 
                                                transform: 'translate(-50%, -50%)',
                                                color: 'red',
                                                fontSize: '3.5rem',
                                                opacity: 0.8
                                            }}>
                                                ❌
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Equation display */}
                        <div className="math-equation" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '20px',
                            fontSize: '4rem',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '40px',
                            background: 'var(--bg-light)',
                            padding: '10px 30px',
                            borderRadius: '20px',
                            border: '3px dashed #ccc'
                        }}>
                            <div style={{ color: 'var(--cat-orange)' }}>{num1}</div>
                            <div style={{ color: 'var(--cat-orange)' }}>-</div>
                            <div style={{ color: 'var(--cat-orange)' }}>{num2}</div>
                            <div style={{ color: '#ccc' }}>=</div>
                            <div style={{ color: '#333' }}>?</div>
                        </div>

                        <div className={styles.optionsGrid}>
                            {options.map((ans, idx) => {
                                let btnClass = styles.wordBtn;
                                if (selectedCorrect === ans) btnClass += ` ${styles.wordBtnCorrect}`;
                                if (selectedWrong === ans) btnClass += ` ${styles.wordBtnWrong}`;

                                return (
                                    <button
                                        key={`opt-${idx}`}
                                        className={`${btnClass} math-option-btn`}
                                        onClick={() => handleOptionClick(ans)}
                                        disabled={selectedCorrect !== null}
                                        style={{ fontSize: '2.5rem', padding: '15px' }} 
                                    >
                                        {ans}
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

export default KuisKurang;
