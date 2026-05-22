import React, { useState, useEffect, useRef } from 'react';
import styles from './Mengetik.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import confetti from 'canvas-confetti';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const TOTAL_ROUNDS = 10;

const GameHuruf: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [currentLetter, setCurrentLetter] = useState('A');
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useSpeakOnMount("Ketik huruf yang muncul di layar!");

    const generateRound = () => {
        const randomChar = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        setCurrentLetter(randomChar);
        setStatus('idle');
        setInputValue('');
    };

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver]);

    const focusInput = () => {
        if (inputRef.current && !gameOver) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        focusInput();
    }, [gameOver]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (gameOver || status === 'correct' || status === 'wrong') return;
        
        const val = e.target.value;
        if (!val) return;
        
        const typedChar = val.slice(-1).toUpperCase();
        setInputValue(typedChar);

        // Hanya proses jika yang diketik adalah huruf
        if (!ALPHABET.includes(typedChar)) {
            setInputValue('');
            return;
        }

        if (typedChar === currentLetter) {
            // Benar
            setStatus('correct');
            playCorrectSound();
            setScore(prev => prev + 10);
            
            setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound > TOTAL_ROUNDS) {
                    playWinSound();
                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 }
                    });
                    setGameOver(true);
                } else {
                    setRound(nextRound);
                }
            }, 800);
        } else {
            // Salah
            setStatus('wrong');
            playWrongSound();
            
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            setTimeout(() => {
                setStatus('idle');
                setInputValue('');
            }, 500);
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
        setTimeout(focusInput, 100);
    };

    return (
        <div className={styles.gameContainer}>
            <GameHeader 
                menuLink="/alfabet" 
                themeColor="var(--cat-pink)" 
                styles={styles} 
                lives={lives}
                score={score}
                round={round}
                totalRounds={TOTAL_ROUNDS}
                borderColor="var(--cat-pink)"
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-pink)' }}>Game Ketik Huruf</h2>
            </GameHeader>

            <main className={styles.gameBoard} onClick={focusInput}>
                {gameOver ? (
                    <GameOverScreen 
                        isWin={lives > 0} 
                        score={score} 
                        onRestart={handleRestart} 
                        menuLink="/alfabet"
                        themeColor="var(--cat-pink)"
                        winMessage="Kamu Hebat!"
                        loseMessage="Permainan Selesai!"
                    />
                ) : (
                    <>
                        <p className={styles.instruction}>
                            Ketik huruf <strong>{currentLetter}</strong> di keyboard!
                        </p>

                        <div className={`${styles.letterDisplay} ${styles[status]}`} style={{ borderColor: 'var(--cat-pink)', color: 'var(--cat-pink)' }}>
                            {currentLetter}
                        </div>

                        <input 
                            ref={inputRef}
                            type="text" 
                            value={inputValue}
                            onChange={handleInputChange}
                            className={styles.hiddenInput}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="characters"
                            spellCheck="false"
                        />
                        
                        <button className={styles.keyboardBtn} onClick={focusInput} style={{ background: 'linear-gradient(135deg, var(--cat-pink), #DB2777)' }}>
                            ⌨️ Munculkan Keyboard
                        </button>
                    </>
                )}
            </main>
        </div>
    );
};

export default GameHuruf;
