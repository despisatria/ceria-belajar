import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Membaca/TebakKata.module.css'; 
import { playCorrectSound, playWrongSound, playWinSound, playPopSound } from '../../utils/soundEffects';
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

const TebakLompatMaju: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [currentPos, setCurrentPos] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [selectedCorrect, setSelectedCorrect] = useState<number | null>(null);
    const [selectedWrong, setSelectedWrong] = useState<number | null>(null);
    const [isAnimatingJump, setIsAnimatingJump] = useState(false);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#34D399', '#059669', '#FCD34D']
        });
    }, []);

    const generateRound = useCallback(() => {
        setSelectedCorrect(null);
        setSelectedWrong(null);
        setIsAnimatingJump(false);

        // Max sum is 10 for the number line to fit nicely
        const targetSum = Math.floor(Math.random() * 8) + 3; // 3 to 10
        const n1 = Math.floor(Math.random() * (targetSum - 1)) + 1; // 1 to targetSum - 1
        const n2 = targetSum - n1;

        setNum1(n1);
        setNum2(n2);
        setCurrentPos(n1); // Frog starts at n1

        // Generate 3 wrong options close to the answer
        const wrongOptions = new Set<number>();
        while (wrongOptions.size < 3) {
            const offset = Math.floor(Math.random() * 6) - 3; 
            let wrongAns = targetSum + (offset >= 0 ? offset + 1 : offset);
            
            // Ensure >= 0 and <= 10
            if (wrongAns >= 0 && wrongAns <= 10 && wrongAns !== targetSum) {
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
            const utterance = new SpeechSynthesisUtterance("Katak akan mendarat di angka berapa? Pilih jawabannya!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const handleOptionClick = (ans: number) => {
        if (selectedCorrect !== null || selectedWrong !== null || isAnimatingJump) return;

        const correctAnswer = num1 + num2;

        if (ans === correctAnswer) {
            // Correct! Let's animate the frog jump
            playCorrectSound();
            setSelectedCorrect(ans);
            setScore(prev => prev + 10);
            setIsAnimatingJump(true);

            // Animate jumping sequence
            let jumpStep = 0;
            const jumpInterval = setInterval(() => {
                jumpStep++;
                if (jumpStep <= num2) {
                    playPopSound();
                    setCurrentPos(num1 + jumpStep);
                } else {
                    clearInterval(jumpInterval);
                    triggerConfetti();
                    
                    setTimeout(() => {
                        const nextRound = round + 1;
                        if (nextRound > TOTAL_ROUNDS) {
                            playWinSound();
                            setGameOver(true);
                        } else {
                            setRound(nextRound);
                        }
                    }, 1500);
                }
            }, 500); // jump every 500ms
            
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
            <header className={styles.gameHeader} style={{ borderBottomColor: 'var(--cat-green)' }}>
                <div className={styles.headerTop}>
                    <Link to="/matematika" className="btn" style={{
                        backgroundColor: 'var(--cat-green)',
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
                            <span className={styles.statValue} style={{ color: 'var(--cat-green)' }}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Putaran</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-green)' }}>{Math.min(round, TOTAL_ROUNDS)}/10</span>
                        </div>
                    </div>
                </div>
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-green)' }}>Tebak Lompatan Katak 🐸</h2>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '10px', fontWeight: 'bold' }}>
                    Jika katak melompat maju <strong>{num2} kali</strong>, di angka berapa dia mendarat?
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
                            <button className="btn" onClick={handleRestart} style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--cat-green)' }}>
                                🔄 Main Lagi
                            </button>
                            <Link to="/matematika" className="btn" style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}>
                                ⬅️ Menu Utama
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Number Line Area */}
                        <div style={{
                            margin: '40px 0 30px',
                            padding: '20px',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'white',
                            borderRadius: '15px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            {/* The line itself */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '5%',
                                right: '5%',
                                height: '6px',
                                background: '#ccc',
                                zIndex: 1,
                                transform: 'translateY(-50%)'
                            }}></div>

                            {/* The numbers and the frog */}
                            {Array.from({ length: 11 }).map((_, index) => {
                                const isFrogHere = currentPos === index;
                                const isStart = num1 === index;
                                const isTarget = (num1 + num2) === index && selectedCorrect !== null;
                                
                                return (
                                    <div key={`pos-${index}`} style={{
                                        position: 'relative',
                                        zIndex: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: '8%'
                                    }}>
                                        {/* Frog */}
                                        <div style={{
                                            fontSize: '3rem',
                                            height: '50px',
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            transform: isFrogHere ? 'scale(1) translateY(-15px)' : 'scale(0) translateY(0)',
                                            opacity: isFrogHere ? 1 : 0,
                                            position: 'absolute',
                                            bottom: '45px'
                                        }}>
                                            🐸
                                        </div>
                                        
                                        {/* Rock/Point */}
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: isFrogHere || isTarget ? 'var(--cat-green)' : (isStart ? '#bbb' : '#fff'),
                                            border: `4px solid ${isFrogHere || isTarget ? 'var(--cat-green)' : '#ccc'}`,
                                            marginBottom: '10px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: isFrogHere ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none'
                                        }}></div>
                                        
                                        {/* Number */}
                                        <div style={{
                                            fontSize: '1.2rem',
                                            fontWeight: isFrogHere || isTarget ? 'bold' : 'normal',
                                            color: isFrogHere || isTarget ? 'var(--cat-green)' : '#666'
                                        }}>
                                            {index}
                                        </div>
                                    </div>
                                );
                            })}
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
                            <div style={{ color: 'var(--cat-green)' }}>{num1}</div>
                            <div style={{ color: 'var(--cat-green)' }}>+</div>
                            <div style={{ color: 'var(--cat-green)' }}>{num2}</div>
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
                                        disabled={selectedCorrect !== null || isAnimatingJump}
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

export default TebakLompatMaju;
