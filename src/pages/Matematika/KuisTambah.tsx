import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Membaca/TebakKata.module.css'; // Reusing the same CSS module for consistent UI
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';
import confetti from 'canvas-confetti';

const TOTAL_ROUNDS = 10;

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

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

    // Speak instruction on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Berapa hasil penjumlahannya? Pilih angka yang benar!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

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
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader} style={{ borderBottomColor: 'var(--cat-blue)' }}>
                <div className={styles.headerTop}>
                    <Link to="/matematika" className="btn" style={{
                        backgroundColor: 'var(--cat-blue)',
                        textTransform: 'none',
                        fontSize: '1rem',
                        padding: '8px 16px'
                    }}>
                        ⬅️ Kembali
                    </Link>
                    <div className={styles.statsPanel}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nyawa</span>
                            <LivesDisplay lives={lives} />
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nilai</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-blue)' }}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Putaran</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-blue)' }}>{Math.min(round, TOTAL_ROUNDS)}/10</span>
                        </div>
                    </div>
                </div>
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-blue)' }}>Kuis Tambah Apel 🍎</h2>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '10px', fontWeight: 'bold' }}>
                    Hitung jumlah apelnya dan pilih jawaban yang benar!
                </p>
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverCard}>
                        {lives > 0 ? (
                            <>
                                <h2>🎉 Luar Biasa! 🎉</h2>
                                <p>Kamu berhasil menyelesaikan permainan ini!</p>
                            </>
                        ) : (
                            <>
                                <h2>💔 Kesempatan Habis! 💔</h2>
                                <p>Jangan menyerah, ayo coba lagi!</p>
                            </>
                        )}
                        <div className={styles.finalScore}>Skor Akhir: {score}</div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn" onClick={handleRestart} style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--cat-blue)' }}>
                                🔄 Main Lagi
                            </button>
                            <Link to="/matematika" className="btn" style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}>
                                ⬅️ Menu Utama
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Visual representation of addition */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '20px',
                            marginTop: '20px',
                            flexWrap: 'wrap'
                        }}>
                            {/* Kotak Apel 1 */}
                            <div style={{
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
                                    <span key={`n1-${i}`} style={{ fontSize: '3rem' }}>🍎</span>
                                ))}
                            </div>

                            <div style={{ fontSize: '3rem', color: '#ccc', fontWeight: 'bold' }}>+</div>

                            {/* Kotak Apel 2 */}
                            <div style={{
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
                                    <span key={`n2-${i}`} style={{ fontSize: '3rem' }}>🍎</span>
                                ))}
                            </div>
                        </div>

                        {/* Equation display */}
                        <div style={{
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
                                        className={btnClass}
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
