import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './MenaraBalok.module.css';
import { audioPlayer } from '../../utils/audioPlayer';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';
import confetti from 'canvas-confetti';

const TOTAL_ROUNDS = 10;
const BLOCK_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

const MenaraBalok: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [targetNumber, setTargetNumber] = useState(0);
    const [blocks, setBlocks] = useState<string[]>([]); // Array of block colors
    const [gameOver, setGameOver] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const [lives, setLives] = useState(5);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: BLOCK_COLORS
        });
    }, []);

    const speakInstruction = useCallback((num: number) => {
        audioPlayer.play(`/audio/menara-balok/${num}.mp3`);
    }, []);

    const initRound = useCallback(() => {
        setIsChecking(false);
        setIsWrong(false);
        setBlocks([]);

        // Generate random target number (1-15)
        const target = Math.floor(Math.random() * 15) + 1;
        setTargetNumber(target);

        setTimeout(() => {
            speakInstruction(target);
        }, 500);

    }, [speakInstruction]);

    useEffect(() => {
        if (!gameOver) {
            initRound();
        }
    }, [round, gameOver, initRound]);

    const handleAddBlock = () => {
        if (isChecking || gameOver || blocks.length >= 15) return; // Prevent infinite stacking (max 15)

        playCorrectSound(); // Simple tick/plop sound
        const randomColor = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
        const newBlocks = [...blocks, randomColor];
        setBlocks(newBlocks);
    };

    const handleRemoveBlock = (indexToRemove: number) => {
        if (isChecking || gameOver) return;

        playCorrectSound(); // Reuse pop sound for removal
        setBlocks(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleSubmit = () => {
        if (isChecking || gameOver) return;

        setIsChecking(true);

        // Verify Logic
        if (blocks.length === targetNumber) {
            // Correct! Reached target.
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
            }, 2000); // Wait to enjoy the tower
        } else {
            // Incorrect
            setIsChecking(true);
            setIsWrong(true);
            playWrongSound();
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            setTimeout(() => {
                setIsChecking(false);
                setIsWrong(false);
            }, 1000);
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        if (isChecking || gameOver || blocks.length >= 15) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('text/plain', 'newBlock');
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        if (data === 'newBlock') {
            handleAddBlock();
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
        setBlocks([]);
        setIsWrong(false);
    };

    // Calculate dynamic tower height bounds
    // Matching exact dimensions of source block
    const blockHeight = 50;
    const blockWidth = 350;

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
                            <span className={styles.statLabel}>Nyawa</span>
                            <LivesDisplay lives={lives} />
                        </div>
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
                        <h2>Buat menara setinggi angka: <span className={styles.targetNumber}>{targetNumber}</span></h2>
                        <button
                            className={styles.speakBtn}
                            onClick={() => speakInstruction(targetNumber)}
                            title="Dengarkan Instruksi"
                        >
                            🔊 Dengar
                        </button>
                    </div>
                )}
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverPanel}>
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
                            <Link to="/angka" className="btn" style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}>
                                ⬅️ Menu Utama
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className={styles.playArea}>
                        <div
                            className={styles.towerArea}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className={`${styles.blocksContainer} ${isWrong ? styles.shakeError : ''}`}>
                                {/* Generate slots based on the LARGER of the targetNumber or current blocks length */}
                                {Array.from({ length: Math.max(targetNumber, blocks.length) }).map((_, i) => {
                                    // Flex direction is column-reverse, so index 0 is at the bottom visually
                                    const isFilled = i < blocks.length;
                                    const blockColor = isFilled ? blocks[i] : 'transparent';
                                    const isExtraBlock = isFilled && i >= targetNumber;

                                    return (
                                        <div
                                            key={i}
                                            className={`${styles.blockSlot} ${isFilled ? styles.filledBlock : styles.emptySlot} ${isExtraBlock ? styles.extraBlock : ''}`}
                                            onClick={isFilled ? () => handleRemoveBlock(i) : undefined}
                                            style={{
                                                backgroundColor: blockColor,
                                                height: `${blockHeight}px`,
                                                width: `${blockWidth}px`,
                                                cursor: isFilled ? 'pointer' : 'default'
                                            }}
                                            title={isFilled ? "Tap untuk menghapus" : ""}
                                        >
                                            {isFilled && <span className={styles.blockNumber}>{i + 1}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={styles.towerPlatform}></div>
                        </div>

                        <div className={styles.sourceArea} style={{ flexDirection: 'column', gap: '15px' }}>
                            <div
                                className={`${styles.sourceBlock} ${isChecking || blocks.length >= 15 ? styles.sourceBlockDisabled : ''}`}
                                draggable={!isChecking && blocks.length < 15}
                                onDragStart={handleDragStart}
                                title="Drag untuk memindahkan balok ke atas bayangan"
                            >
                                Pindahkan Balok
                            </div>
                            <button
                                className="btn"
                                onClick={handleSubmit}
                                disabled={isChecking || blocks.length === 0}
                                style={{
                                    width: '200px',
                                    fontSize: '1.5rem',
                                    padding: '12px',
                                    backgroundColor: 'var(--cat-yellow)',
                                    color: 'var(--text-color)',
                                    border: '4px solid var(--text-color)',
                                    boxShadow: isChecking || blocks.length === 0 ? 'none' : '0 6px 0 var(--text-color)'
                                }}
                            >
                                OK ✅
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MenaraBalok;
