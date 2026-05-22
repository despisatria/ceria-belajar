import React, { useState, useEffect, useCallback } from 'react';
import styles from './BalloonGame.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../GameOverScreen';
import GameHeader from '../GameHeader';
import confetti from 'canvas-confetti';


export interface BalloonGameItem {
    id: string | number;
    data: any;
}

export interface BalloonGameProps {
    title?: string;
    themeColor: string;
    menuLink: string;
    totalRounds?: number;
    winMessage?: string;
    loseMessage?: string;
    
    buildRound: (round: number) => {
        target: BalloonGameItem;
        targetQuota: number;
        totalBalloons: number;
        generateDecoy: () => BalloonGameItem;
    };
    
    getBalloonStyle?: (item: BalloonGameItem) => React.CSSProperties;
    getBalloonClass?: (item: BalloonGameItem) => string;
    
    renderBalloonContent?: (item: BalloonGameItem) => React.ReactNode;
    renderInstruction: (target: BalloonGameItem, poppedCount: number, targetQuota: number) => React.ReactNode;
    
    getSpeechText?: (target: BalloonGameItem) => string;
    onPlaySpeech?: (target: BalloonGameItem) => void;
}

interface BalloonData {
    id: number;
    item: BalloonGameItem;
    speed: number;
    xPos: number; // Percentage for horizontal position
    delay: number; // Animation delay
}

const BalloonGame: React.FC<BalloonGameProps> = ({
    title,
    themeColor,
    menuLink,
    totalRounds = 10,
    winMessage = "Kamu penembak jitu yang hebat!",
    loseMessage = "Jangan menyerah, ayo coba lagi!",
    buildRound,
    getBalloonStyle,
    getBalloonClass,
    renderBalloonContent,
    renderInstruction,
    getSpeechText,
    onPlaySpeech
}) => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    
    const [targetItem, setTargetItem] = useState<BalloonGameItem | null>(null);
    const [targetQuota, setTargetQuota] = useState(1);
    const [poppedCount, setPoppedCount] = useState(0);
    const [balloons, setBalloons] = useState<BalloonData[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
        });
    }, []);

    const playSpeech = useCallback((target: BalloonGameItem) => {
        if (onPlaySpeech) {
            onPlaySpeech(target);
        } else if (getSpeechText) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(getSpeechText(target));
                utterance.lang = 'id-ID';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        }
    }, [getSpeechText, onPlaySpeech]);

    const initRound = useCallback(() => {
        setIsPaused(false);
        setPoppedCount(0);
        
        const { target, targetQuota: quota, totalBalloons, generateDecoy } = buildRound(round);
        setTargetItem(target);
        setTargetQuota(quota);

        const newBalloons: BalloonData[] = [];

        for (let i = 0; i < quota; i++) {
            newBalloons.push({
                id: Date.now() + i,
                item: target,
                speed: 10 + Math.random() * 10,
                xPos: 10 + Math.random() * 80,
                delay: Math.random() * 5,
            });
        }

        for (let i = quota; i < totalBalloons; i++) {
            newBalloons.push({
                id: Date.now() + i,
                item: generateDecoy(),
                speed: 10 + Math.random() * 10,
                xPos: 5 + Math.random() * 90,
                delay: Math.random() * 8,
            });
        }

        setBalloons(newBalloons.sort(() => Math.random() - 0.5));

        // Play audio instruction (delay to avoid browser autoplay block on mount)
        setTimeout(() => {
            playSpeech(target);
        }, 800);

    }, [round, buildRound, playSpeech]);

    useEffect(() => {
        if (!gameOver && round <= totalRounds) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            initRound();
        }
    }, [round, gameOver, initRound, totalRounds]);

    const handleBalloonClick = (item: BalloonGameItem, balloonId: number) => {
        if (isPaused || gameOver || !targetItem) return;

        if (item.id === targetItem.id) {
            playCorrectSound();

            const newPoppedCount = poppedCount + 1;
            setPoppedCount(newPoppedCount);
            setBalloons(prev => prev.filter(b => b.id !== balloonId));

            if (newPoppedCount >= targetQuota) {
                setIsPaused(true);
                triggerConfetti();
                setScore(prev => prev + 10);

                setTimeout(() => {
                    const nextRound = round + 1;
                    if (nextRound > totalRounds) {
                        playWinSound();
                        setGameOver(true);
                    } else {
                        setRound(nextRound);
                    }
                }, 1500);
            }
        } else {
            playWrongSound();
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });
            setBalloons(prev => prev.filter(b => b.id !== balloonId));
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setPoppedCount(0);
        setLives(5);
        setGameOver(false);
    };

    return (
        <div className={styles.gameContainer}>
            <GameHeader
                menuLink={menuLink}
                themeColor={themeColor}
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={totalRounds}
            >
                {!gameOver && targetItem && (
                    <div className={styles.instructionPanel}>
                        {title && <h2 className={styles.gameTitle} style={{ color: themeColor, fontSize: '1.5rem', marginBottom: '10px' }}>{title}</h2>}
                        {renderInstruction(targetItem, poppedCount, targetQuota)}
                        <button
                            className={styles.speakBtn}
                            style={{ backgroundColor: themeColor, marginLeft: '10px' }}
                            onClick={() => playSpeech(targetItem)}
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
                        menuLink={menuLink}
                        themeColor={themeColor}
                        className={styles.gameOverPanel}
                        scoreClassName={styles.finalScore}
                        winMessage={winMessage}
                        loseMessage={loseMessage}
                    />
                ) : (
                    <div className={styles.skyArea}>
                        {balloons.map(balloon => {
                            const extraClass = getBalloonClass ? getBalloonClass(balloon.item) : '';
                            const inlineStyle = getBalloonStyle ? getBalloonStyle(balloon.item) : {};
                            
                            return (
                                <div
                                    key={balloon.id}
                                    className={`${styles.balloon} ${extraClass ? styles[extraClass] : ''}`}
                                    style={{
                                        left: `${balloon.xPos}%`,
                                        animationDuration: `${balloon.speed}s`,
                                        animationDelay: `${balloon.delay}s`,
                                        ...inlineStyle
                                    }}
                                    onClick={() => handleBalloonClick(balloon.item, balloon.id)}
                                >
                                    <div className={styles.balloonString} style={inlineStyle.backgroundColor ? { borderBottomColor: inlineStyle.backgroundColor } : {}}></div>
                                    {renderBalloonContent && renderBalloonContent(balloon.item)}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default BalloonGame;
