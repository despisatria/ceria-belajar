import React, { useState, useEffect, useCallback } from 'react';
import styles from '../Membaca/TebakKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameHeader from '../../components/GameHeader';
import GameOverScreen from '../../components/GameOverScreen';
import { shuffleArray } from '../../utils/helpers';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import confetti from 'canvas-confetti';

const TOTAL_ROUNDS = 10;

const KuisTambah: React.FC = () => {
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
            colors: ['#3B82F6', '#60A5FA', '#10B981', '#F59E0B']
        });
    }, []);

    const generateRound = useCallback(() => {
        setSelectedCorrect(null);
        setSelectedWrong(null);

        // Generate target sum (max 10 for simplicity in this age group)
        const targetSum = Math.floor(Math.random() * 9) + 2; // 2 to 10
        const n1 = Math.floor(Math.random() * (targetSum - 1)) + 1; // 1 to targetSum - 1
        const n2 = targetSum - n1;

        setNum1(n1);
        setNum2(n2);

        // Generate 3 wrong options close to the answer
        const wrongOptions = new Set<number>();
        while (wrongOptions.size < 3) {
            // +/- 1 to 3 from target sum
            const offset = Math.floor(Math.random() * 6) - 3; // -3, -2, -1, 0, 1, 2
            let wrongAns = targetSum + (offset >= 0 ? offset + 1 : offset);
            
            // Ensure > 0 and <= 15
            if (wrongAns > 0 && wrongAns <= 15 && wrongAns !== targetSum) {
                wrongOptions.add(wrongAns);
            }
        }

        const allOptions = shuffleArray([targetSum, ...Array.from(wrongOptions)]);
        setOptions(allOptions);
    }, []);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver, generateRound]);

    useSpeakOnMount("Berapa hasil penjumlahannya? Pilih angka yang benar!");

    const handleOptionClick = (ans: number) => {
        if (selectedCorrect || selectedWrong) return;

        const correctAnswer = num1 + num2;

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
                 themeColor="var(--cat-blue)"
                 styles={styles}
                 lives={lives}
                 score={score}
                 round={round}
                 totalRounds={TOTAL_ROUNDS}
                 borderColor="var(--cat-blue)"
             >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-blue)' }}>Kuis Tambah Apel 🍎</h2>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '10px', fontWeight: 'bold' }}>
                    Hitung jumlah apelnya dan pilih jawaban yang benar!
                </p>
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/matematika"
                        themeColor="var(--cat-blue)"
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                    />
                ) : (
                    <>
                        {/* Visual representation of addition */}
                        <div className="math-visual-container" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '20px',
                            marginTop: '20px',
                            flexWrap: 'wrap'
                        }}>
                            {/* Kotak Apel 1 */}
                            <div className="math-visual-box" style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                padding: '15px',
                                borderRadius: '15px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '5px',
                                minWidth: '100px',
                                border: '2px solid rgba(59, 130, 246, 0.3)'
                            }}>
                                {Array.from({ length: num1 }).map((_, i) => (
                                    <span key={`n1-${i}`} className="math-visual-item" style={{ fontSize: '3rem' }}>🍎</span>
                                ))}
                            </div>

                            <div className="math-visual-item" style={{ fontSize: '3rem', color: '#ccc', fontWeight: 'bold' }}>+</div>

                            {/* Kotak Apel 2 */}
                            <div className="math-visual-box" style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                padding: '15px',
                                borderRadius: '15px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '5px',
                                minWidth: '100px',
                                border: '2px solid rgba(59, 130, 246, 0.3)'
                            }}>
                                {Array.from({ length: num2 }).map((_, i) => (
                                    <span key={`n2-${i}`} className="math-visual-item" style={{ fontSize: '3rem' }}>🍎</span>
                                ))}
                            </div>
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
                            <div style={{ color: 'var(--cat-blue)' }}>{num1}</div>
                            <div style={{ color: 'var(--cat-blue)' }}>+</div>
                            <div style={{ color: 'var(--cat-blue)' }}>{num2}</div>
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
                                        style={{ fontSize: '2.5rem', padding: '15px' }} // Make text bigger for numbers
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

export default KuisTambah;
