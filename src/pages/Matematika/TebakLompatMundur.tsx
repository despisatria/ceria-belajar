import React, { useState, useEffect, useCallback } from 'react';
import styles from '../Membaca/TebakKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound, playPopSound } from '../../utils/soundEffects';
import GameHeader from '../../components/GameHeader';
import GameOverScreen from '../../components/GameOverScreen';
import { shuffleArray } from '../../utils/helpers';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import confetti from 'canvas-confetti';

const TOTAL_ROUNDS = 10;

const TebakLompatMundur: React.FC = () => {
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
            colors: ['#EF4444', '#F87171', '#DC2626', '#FCA5A5']
        });
    }, []);

    const generateRound = useCallback(() => {
        setSelectedCorrect(null);
        setSelectedWrong(null);
        setIsAnimatingJump(false);

        // Target range 3 to 10 for num1
        const n1 = Math.floor(Math.random() * 8) + 3; 
        const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // 1 to n1-1
        const targetDiff = n1 - n2;

        setNum1(n1);
        setNum2(n2);
        setCurrentPos(n1);

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

    useSpeakOnMount("Katak melompat mundur! Di angka berapa katak berhenti?");

    const handleOptionClick = (ans: number) => {
        if (selectedCorrect !== null || selectedWrong !== null || isAnimatingJump) return;

        const correctAnswer = num1 - num2;

        if (ans === correctAnswer) {
            // Correct! Animate jump backwards
            playCorrectSound();
            setSelectedCorrect(ans);
            setScore(prev => prev + 10);
            setIsAnimatingJump(true);

            let jumpStep = 0;
            const jumpInterval = setInterval(() => {
                jumpStep++;
                if (jumpStep <= num2) {
                    playPopSound();
                    setCurrentPos(num1 - jumpStep);
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
            }, 500);
            
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
                 themeColor="var(--cat-red)"
                 styles={styles}
                 lives={lives}
                 score={score}
                 round={round}
                 totalRounds={TOTAL_ROUNDS}
                 borderColor="var(--cat-red)"
             >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-red)' }}>Tebak Lompatan Katak Mundur 🐸</h2>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '10px', fontWeight: 'bold' }}>
                    Jika katak melompat mundur <strong>{num2} kali</strong>, di angka berapa dia berhenti?
                </p>
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/matematika"
                        themeColor="var(--cat-red)"
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                    />
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
                                const isTarget = (num1 - num2) === index && selectedCorrect !== null;
                                
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
                                            transform: isFrogHere ? 'scaleX(-1) scale(1) translateY(-15px)' : 'scaleX(-1) scale(0) translateY(0)', // scaleX(-1) to face left
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
                                            background: isFrogHere || isTarget ? 'var(--cat-red)' : (isStart ? '#bbb' : '#fff'),
                                            border: `4px solid ${isFrogHere || isTarget ? 'var(--cat-red)' : '#ccc'}`,
                                            marginBottom: '10px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: isFrogHere ? '0 0 15px rgba(220, 38, 38, 0.5)' : 'none'
                                        }}></div>
                                        
                                        {/* Number */}
                                        <div style={{
                                            fontSize: '1.2rem',
                                            fontWeight: isFrogHere || isTarget ? 'bold' : 'normal',
                                            color: isFrogHere || isTarget ? 'var(--cat-red)' : '#666'
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
                            <div style={{ color: 'var(--cat-red)' }}>{num1}</div>
                            <div style={{ color: 'var(--cat-red)' }}>-</div>
                            <div style={{ color: 'var(--cat-red)' }}>{num2}</div>
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

export default TebakLompatMundur;
