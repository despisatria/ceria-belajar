import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Mengetik.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import confetti from 'canvas-confetti';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import { type WordEntry, POOL_1, POOL_2, POOL_3, POOL_4, POOL_5 } from '../../data/membacaWordPools';
import { shuffleArray } from '../../utils/helpers';

const ROUND_POOL_MAP: { pool: WordEntry[] }[] = [
    { pool: POOL_1 }, // Round 1
    { pool: POOL_1 }, // Round 2
    { pool: POOL_2 }, // Round 3
    { pool: POOL_2 }, // Round 4
    { pool: POOL_3 }, // Round 5
    { pool: POOL_3 }, // Round 6
    { pool: POOL_4 }, // Round 7
    { pool: POOL_4 }, // Round 8
    { pool: POOL_5 }, // Round 9
    { pool: POOL_5 }, // Round 10
];

const TOTAL_ROUNDS = 10;

const GameKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    
    const [currentWord, setCurrentWord] = useState<WordEntry>(POOL_1[0]);
    const [typedWord, setTypedWord] = useState('');
    const [status, setStatus] = useState<'idle' | 'wrong'>('idle');
    const [inputValue, setInputValue] = useState('');
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    const inputRef = useRef<HTMLInputElement>(null);

    useSpeakOnMount("Ketik kata yang ada di gambar!");

    const generateRound = useCallback(() => {
        const config = ROUND_POOL_MAP[round - 1];
        const pool = config.pool;

        // Pick a word from the pool, not yet used if possible
        const available = pool.filter(w => !usedWords.has(w.word));
        const primaryPool = available.length > 0 ? available : pool;
        
        const randomWord = shuffleArray([...primaryPool])[0];
        
        setCurrentWord(randomWord);
        setUsedWords(prev => new Set(prev).add(randomWord.word));
        setTypedWord('');
        setStatus('idle');
        setInputValue('');
    }, [round, usedWords]);

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
        if (gameOver || status === 'wrong') return;
        
        const val = e.target.value;
        if (!val) return;
        
        const typedChar = val.slice(-1).toLowerCase();
        setInputValue(typedChar);

        // Hanya proses huruf
        if (!/^[a-z]+$/.test(typedChar)) {
            setInputValue('');
            return;
        }

        const targetWord = currentWord.word.toLowerCase();
        const currentIndex = typedWord.length;
        const expectedChar = targetWord[currentIndex];

        if (typedChar === expectedChar) {
            // Benar
            playCorrectSound();
            const newTypedWord = typedWord + expectedChar;
            setTypedWord(newTypedWord);
            
            // Cek apakah seluruh kata sudah selesai diketik
            if (newTypedWord === targetWord) {
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
                        confetti({
                            particleCount: 50,
                            spread: 60,
                            origin: { y: 0.8 }
                        });
                        setRound(nextRound);
                    }
                }, 800);
            }
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
        
        // Reset input immediately so they can type next char
        setTimeout(() => setInputValue(''), 10);
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setUsedWords(new Set());
        setGameOver(false);
        setTimeout(focusInput, 100);
    };

    return (
        <div className={styles.gameContainer}>
            <GameHeader 
                menuLink="/membaca" 
                themeColor="var(--cat-orange)" 
                styles={styles} 
                lives={lives}
                score={score}
                round={round}
                totalRounds={TOTAL_ROUNDS}
                borderColor="var(--cat-orange)"
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-orange)' }}>Game Ketik Kata</h2>
            </GameHeader>

            <main className={styles.gameBoard} onClick={focusInput}>
                {gameOver ? (
                    <GameOverScreen 
                        isWin={lives > 0} 
                        score={score} 
                        onRestart={handleRestart} 
                        menuLink="/membaca"
                        themeColor="var(--cat-orange)"
                        winMessage="Kamu Hebat!"
                        loseMessage="Permainan Selesai!"
                    />
                ) : (
                    <>
                        <p className={styles.instruction}>
                            Ketik kata di bawah ini!
                        </p>
                        
                        <div style={{ fontSize: '6rem', marginBottom: '10px' }}>
                            {currentWord.emoji}
                        </div>

                        <div className={styles.wordDisplay}>
                            {currentWord.word.toUpperCase().split('').map((char, idx) => {
                                const isTyped = idx < typedWord.length;
                                const isActive = idx === typedWord.length;
                                const isWrong = isActive && status === 'wrong';
                                
                                let charClass = styles.wordLetter;
                                if (isTyped) charClass += ` ${styles.typed}`;
                                else if (isActive) charClass += ` ${styles.active}`;
                                if (isWrong) charClass += ` ${styles.wrong}`; // Menggunakan animasi getar

                                return (
                                    <div key={idx} className={charClass}>
                                        {isTyped ? char : ''}
                                    </div>
                                );
                            })}
                        </div>

                        <input 
                            ref={inputRef}
                            type="text" 
                            value={inputValue}
                            onChange={handleInputChange}
                            className={styles.hiddenInput}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck="false"
                        />
                        
                        <button className={styles.keyboardBtn} onClick={focusInput} style={{ background: 'linear-gradient(135deg, var(--cat-orange), #EA580C)' }}>
                            ⌨️ Munculkan Keyboard
                        </button>
                    </>
                )}
            </main>
        </div>
    );
};

export default GameKata;
