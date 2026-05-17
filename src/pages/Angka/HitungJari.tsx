import React, { useState, useEffect, useCallback } from 'react';
import styles from './HitungJari.module.css';
import { audioPlayer } from '../../utils/audioPlayer';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import confetti from 'canvas-confetti';

const TOTAL_ROUNDS = 10;

const HitungJari: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [targetNumber, setTargetNumber] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [showCorrection, setShowCorrection] = useState(false);
    const [selectedWrongId, setSelectedWrongId] = useState<number | null>(null);
    const [lives, setLives] = useState(5);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
        });
    }, []);

    const speakInstruction = useCallback(() => {
        audioPlayer.play('/audio/instruksi/hitung_jari.mp3');
    }, []);

    const initRound = useCallback(() => {
        setShowCorrection(false);
        setSelectedWrongId(null);

        // Generate random target number (1-20)
        const target = Math.floor(Math.random() * 20) + 1;
        setTargetNumber(target);

        // Generate options
        const newOptions = [target];
        while (newOptions.length < 3) {
            const wrongOption = Math.floor(Math.random() * 20) + 1;
            if (!newOptions.includes(wrongOption)) {
                newOptions.push(wrongOption);
            }
        }

        setOptions(newOptions.sort(() => Math.random() - 0.5));

        setTimeout(() => {
            speakInstruction();
        }, 500);

    }, [speakInstruction]);

    useEffect(() => {
        if (!gameOver) {
            initRound();
        }
    }, [round, gameOver, initRound]);

    const handleOptionClick = (selectedNum: number) => {
        if (showCorrection || gameOver) return;

        if (selectedNum === targetNumber) {
            // Correct click
            playCorrectSound();
            triggerConfetti();
            setShowCorrection(true); // briefly pause to show success state if needed
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
        } else {
            // Wrong
            playWrongSound();
            setSelectedWrongId(selectedNum);
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });
            // Re-enable clicking after a short delay
            setTimeout(() => {
                setSelectedWrongId(null);
            }, 800);
        }
    };

    const handleRestart = () => {
        if (round === 1) {
            initRound();
        } else {
            setRound(1);
        }
        setScore(0);
        setLives(5);
        setGameOver(false);
    };

    return (
        <div className={styles.gameContainer}>
            <GameHeader
                menuLink="/angka"
                themeColor="var(--cat-orange)"
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={TOTAL_ROUNDS}
            >

                {!gameOver && (
                    <div className={styles.instructionPanel}>
                        <h2>Berapa jumlah jari nya?</h2>
                        <button
                            className={styles.speakBtn}
                            onClick={speakInstruction}
                            title="Dengarkan Instruksi"
                        >
                            🔊 Dengar
                        </button>
                    </div>
                )}
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/angka"
                        themeColor="var(--cat-orange)"
                        className={styles.gameOverPanel}
                        scoreClassName={styles.finalScore}
                    />
                ) : (
                    <div className={styles.playArea}>
                        <div className={styles.visualContainer}>
                            <div className={styles.fingerDisplay}>
                                {(() => {
                                    // Function to get distinct finger combinations representing the number
                                    const getFingerEmojis = (num: number): string[] => {
                                        const emojis: string[] = [];
                                        let remaining = num;

                                        // Add full hands (5 fingers)
                                        while (remaining >= 5) {
                                            emojis.push('🖐️');
                                            remaining -= 5;
                                        }

                                        // Add remaining fingers
                                        if (remaining === 4) emojis.push('✌️', '✌️');
                                        else if (remaining === 3) emojis.push('✌️', '☝️');
                                        else if (remaining === 2) emojis.push('✌️');
                                        else if (remaining === 1) emojis.push('☝️');

                                        return emojis;
                                    };

                                    return getFingerEmojis(targetNumber).map((emoji, i) => (
                                        <span key={i} className={styles.fingerIcon} style={{ animationDelay: `${i * 0.1}s` }}>
                                            {emoji}
                                        </span>
                                    ));
                                })()}
                            </div>
                        </div>

                        <div className={styles.optionsContainer}>
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionClick(opt)}
                                    className={`${styles.optionBtn} ${showCorrection && opt === targetNumber ? styles.correct : ''} ${selectedWrongId === opt ? styles.wrong : ''}`}
                                    disabled={showCorrection}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HitungJari;
