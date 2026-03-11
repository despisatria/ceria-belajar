import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './BalonAngka.module.css';
import { audioPlayer } from '../../utils/audioPlayer';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface Balloon {
    id: number;
    number: number;
    colorClass: string;
    speed: number;
    xPos: number; // Percentage for horizontal position
    delay: number; // Animation delay
}

const BALLOON_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
const TOTAL_ROUNDS = 10;

const BalonAngka: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [targetNumber, setTargetNumber] = useState<number>(0);
    const [poppedCount, setPoppedCount] = useState(0);
    const [balloons, setBalloons] = useState<Balloon[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false); // To prevent multiple clicks while transitioning

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
        });
    }, []);

    const speakInstruction = useCallback((num: number) => {
        // Play instruction: "Pecahkan Balon Angka X!"
        audioPlayer.play(`/audio/balon-angka/${num}.mp3`);
    }, []);

    const initRound = useCallback((currentRound: number) => {
        setIsPaused(false);
        setPoppedCount(0);
        // Generate random target number (1-20)
        const target = Math.floor(Math.random() * 20) + 1;
        setTargetNumber(target);

        // Calculate how many correct balloons the user must pop this round
        const targetCount = Math.min(currentRound, 4);

        // Generate balloons
        // Round 1 = 6 balloons, Round 2 = 7 balloons... Round 10 = 15 balloons
        const balloonCount = 5 + currentRound;
        const newBalloons: Balloon[] = [];

        // Ensure exactly targetCount correct balloons exist
        for (let i = 0; i < targetCount; i++) {
            newBalloons.push({
                id: Date.now() + i,
                number: target,
                colorClass: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
                speed: 10 + Math.random() * 10, // 10s to 20s animation duration
                xPos: 10 + Math.random() * 80, // 10% to 90%
                delay: Math.random() * 5,
            });
        }

        // Add decoy balloons
        for (let i = targetCount; i < balloonCount; i++) {
            let decoyNum = target;
            while (decoyNum === target) {
                decoyNum = Math.floor(Math.random() * 20) + 1;
            }

            newBalloons.push({
                id: Date.now() + i,
                number: decoyNum,
                colorClass: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
                speed: 10 + Math.random() * 10,
                xPos: 5 + Math.random() * 90,
                delay: Math.random() * 8, // Stagger appearances
            });
        }

        // Shuffle balloons so the correct one isn't always first or last in DOM
        setBalloons(newBalloons.sort(() => Math.random() - 0.5));

        // Speak instruction shortly after round starts
        setTimeout(() => {
            speakInstruction(target);
        }, 800);

    }, [speakInstruction]);

    useEffect(() => {
        if (!gameOver) {
            initRound(round);
        }
    }, [round, gameOver, initRound]);

    // Continuously spawn balloons that float away (optional enhancement: if balloon reaches top, recreate it at bottom)
    // For simplicity, CSS animation is infinite, so they just keep floating up from bottom

    const handleBalloonClick = (balloonNum: number, balloonId: number) => {
        if (isPaused || gameOver) return;

        if (balloonNum === targetNumber) {
            // Correct click
            playCorrectSound();

            const newPoppedCount = poppedCount + 1;
            setPoppedCount(newPoppedCount);
            setBalloons(prev => prev.filter(b => b.id !== balloonId));

            const targetCount = Math.min(round, 4);

            if (newPoppedCount >= targetCount) {
                // Round complete!
                setIsPaused(true);
                triggerConfetti();
                setScore(prev => prev + 10); // 10 points per round

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
        } else {
            // Wrong
            playWrongSound();
            // Just pop the wrong one so it disappears
            setBalloons(prev => prev.filter(b => b.id !== balloonId));
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setPoppedCount(0);
        setGameOver(false);
    };

    const currentTargetCount = Math.min(round, 4);

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <div className={styles.headerTop}>
                    <Link to="/angka" className="btn" style={{
                        backgroundColor: 'var(--cat-blue)',
                        textTransform: 'none',
                        fontSize: '1rem',
                        padding: '8px 16px'
                    }}>
                        ⬅️ Kembali
                    </Link>
                    <div className={styles.statsPanel}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nilai</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-blue)' }}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Ronde</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-blue)' }}>{round}/{TOTAL_ROUNDS}</span>
                        </div>
                    </div>
                </div>

                {!gameOver && (
                    <div className={styles.instructionPanel}>
                        <h2>Pecahkan Balon Angka: <span className={styles.targetNumber}>{targetNumber}</span> <span style={{ fontSize: '1.2rem', color: 'var(--cat-blue)' }}>({poppedCount}/{currentTargetCount})</span></h2>
                        <button
                            className={styles.speakBtn}
                            onClick={() => speakInstruction(targetNumber)}
                            title="Dengarkan Angka"
                        >
                            🔊 Dengar
                        </button>
                    </div>
                )}
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverPanel}>
                        <h2>Hebat Sekali! 🎉</h2>
                        <p>Kamu pintar mencari angka!</p>
                        <p className={styles.finalScore}>Total Nilai: {score}</p>
                        <div style={{ marginTop: '20px' }}>
                            <button className="btn" onClick={handleRestart} style={{ backgroundColor: 'var(--cat-blue)', marginRight: '15px' }}>
                                Main Lagi 🔄
                            </button>
                            <Link to="/angka" className="btn" style={{ backgroundColor: 'var(--cat-green)' }}>
                                Menu Angka 🔢
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className={styles.skyArea}>
                        {balloons.map(balloon => (
                            <div
                                key={balloon.id}
                                className={`${styles.balloon} ${styles[balloon.colorClass]}`}
                                style={{
                                    left: `${balloon.xPos}%`,
                                    animationDuration: `${balloon.speed}s`,
                                    animationDelay: `${balloon.delay}s`
                                }}
                                onClick={() => handleBalloonClick(balloon.number, balloon.id)}
                            >
                                <div className={styles.balloonString}></div>
                                <span className={styles.balloonNumber}>{balloon.number}</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default BalonAngka;
