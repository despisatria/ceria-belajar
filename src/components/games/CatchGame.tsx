import React, { useState, useEffect, useCallback } from 'react';
import styles from './CatchGame.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../GameOverScreen';
import GameHeader from '../GameHeader';
import confetti from 'canvas-confetti';


export interface CatchItem {
    id: string; // Unique identifier (e.g. word string, color id)
    data: any;  // Raw data needed for rendering
}

export interface CatchGameProps {
    title: string;
    subtitle: string;
    themeColor: string;
    menuLink: string;
    winMessage?: string;
    loseMessage?: string;
    totalRounds?: number;
    
    // Returns target and a list of all items for this round (including target and distractors)
    buildRound: (round: number) => { target: CatchItem, allItems: CatchItem[] };
    
    // Render functions
    renderInstruction: (target: CatchItem) => React.ReactNode;
    renderFishContent: (item: CatchItem) => React.ReactNode;
    
    // Speech instruction generator
    getSpeechText: (target: CatchItem) => string;
    
    
    // Optional callback when game is restarted (to reset pools if needed)
    onRestart?: () => void;
}

interface FishData {
    id: string;
    item: CatchItem;
    top: number; // percentage
    direction: 'left' | 'right';
    duration: number; // seconds
    status: 'normal' | 'correct' | 'error';
    delay: number; // seconds
}

const CatchGame: React.FC<CatchGameProps> = ({
    title,
    subtitle,
    themeColor,
    menuLink,
    winMessage = "Kamu berhasil menangkap semua ikan yang tepat!",
    loseMessage = "Jangan menyerah, ayo coba pancing lagi!",
    totalRounds = 5,
    buildRound,
    renderInstruction,
    renderFishContent,
    getSpeechText,
    onRestart
}) => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    
    const [targetItem, setTargetItem] = useState<CatchItem | null>(null);
    const [fishes, setFishes] = useState<FishData[]>([]);
    const [isInteracting, setIsInteracting] = useState(false);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06B6D4', '#3B82F6', '#10B981', '#F59E0B']
        });
    }, []);

    const playSpeech = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const initRound = useCallback(() => {
        setIsInteracting(false);
        const { target, allItems } = buildRound(round);
        setTargetItem(target);

        // Generate fish objects
        const baseDuration = Math.max(12, 20 - round);

        const newFishes: FishData[] = allItems.map((item, idx) => {
            const isRightToLeft = Math.random() > 0.5;
            return {
                id: `fish-${idx}-${round}-${Date.now()}`,
                item: item,
                top: 10 + (idx * (70 / allItems.length)) + (Math.random() * 10 - 5),
                direction: isRightToLeft ? 'left' : 'right',
                duration: baseDuration + (Math.random() * 6 - 3),
                delay: Math.random() * -10,
                status: 'normal'
            };
        });

        setFishes(newFishes);

        // Play audio instruction (delay to avoid browser autoplay block on mount)
        setTimeout(() => {
            playSpeech(getSpeechText(target));
        }, 800);

    }, [round, buildRound, getSpeechText, playSpeech]);

    useEffect(() => {
        if (!gameOver && round <= totalRounds) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            initRound();
        }
    }, [round, gameOver, initRound, totalRounds]);

    const handleFishTap = (fishId: string, item: CatchItem) => {
        if (isInteracting || !targetItem) return;
        setIsInteracting(true);

        const isCorrect = item.id === targetItem.id;

        setFishes(prev => prev.map(f => {
            if (f.id === fishId) {
                return { ...f, status: isCorrect ? 'correct' : 'error' };
            }
            return f;
        }));

        if (isCorrect) {
            playCorrectSound();
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
            }, 1000);
        } else {
            playWrongSound();

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            setTimeout(() => {
                setFishes(prev => prev.map(f => f.id === fishId ? { ...f, status: 'normal' } : f));
                setIsInteracting(false);
            }, 500);
        }
    };

    const handleRestart = () => {
        if (onRestart) onRestart();
        setRound(1);
        setScore(0);
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
                borderColor={themeColor}
            >
                <h2 className={styles.gameTitle} style={{ color: themeColor }}>{title}</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    {subtitle}
                </p>
                {!gameOver && targetItem && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <button
                            onClick={() => playSpeech(getSpeechText(targetItem))}
                            className="btn"
                            style={{ backgroundColor: themeColor, fontSize: '1rem', padding: '5px 15px' }}
                            title="Dengarkan Instruksi"
                        >
                            🔊 Dengar
                        </button>
                    </div>
                )}
            </GameHeader>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink={menuLink}
                        themeColor={themeColor}
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                        winMessage={winMessage}
                        loseMessage={loseMessage}
                    />
                ) : (
                    <>
                        {targetItem && renderInstruction(targetItem)}

                        {/* Ocean Play Area */}
                        <div className={styles.pondArea}>
                            {fishes.map(fish => (
                                <button
                                    key={fish.id}
                                    className={`${styles.fishBtn} ${fish.direction === 'right' ? styles.flipFish : ''} ${fish.direction === 'left' ? styles.animSwimLeft : styles.animSwimRight} ${fish.status === 'error' ? styles.errorFish : ''} ${fish.status === 'correct' ? styles.correctFish : ''}`}
                                    style={{
                                        top: `${fish.top}%`,
                                        //@ts-expect-error Custom CSS property
                                        '--swim-duration': `${fish.duration}s`,
                                        animationDelay: `${fish.delay}s`
                                    }}
                                    onClick={() => handleFishTap(fish.id, fish.item)}
                                    disabled={isInteracting && fish.status !== 'error'}
                                >
                                    {renderFishContent(fish.item)}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default CatchGame;
