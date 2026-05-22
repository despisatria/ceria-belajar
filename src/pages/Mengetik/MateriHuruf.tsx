import React, { useState, useEffect, useRef } from 'react';
import styles from './Mengetik.module.css';
import { playCorrectSound, playWrongSound } from '../../utils/soundEffects';
import GameHeader from '../../components/GameHeader';
import confetti from 'canvas-confetti';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const MateriHuruf: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const currentLetter = ALPHABET[currentIndex];

    // Fokus ke input saat komponen dimuat
    useEffect(() => {
        focusInput();
    }, []);

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3B82F6', '#10B981', '#F59E0B']
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setInputValue(val); // Keep input value updated

        if (!val) return; // if backspaced completely

        const typedChar = val.slice(-1); // Get the last typed character

        if (typedChar === currentLetter) {
            // Benar
            setStatus('correct');
            playCorrectSound();
            
            setTimeout(() => {
                const nextIndex = (currentIndex + 1) % ALPHABET.length;
                if (nextIndex === 0) {
                    triggerConfetti(); // Beri sedikit hadiah confetti setiap berhasil menyelesaikan 1 putaran A-Z
                }
                setCurrentIndex(nextIndex);
                setStatus('idle');
                setInputValue(''); // Reset input for next letter
            }, 800);
        } else {
            // Salah
            setStatus('wrong');
            playWrongSound();
            
            setTimeout(() => {
                setStatus('idle');
                setInputValue('');
            }, 500);
        }
    };

    return (
        <div className={styles.gameContainer}>
            <GameHeader 
                menuLink="/alfabet" 
                themeColor="var(--cat-blue)" 
                styles={styles} 
                borderColor="var(--cat-blue)"
                hideStats={true}
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-blue)' }}>Materi Ketik Huruf</h2>
            </GameHeader>

            <main className={styles.gameBoard} onClick={focusInput}>
                <p className={styles.instruction}>
                    Ketik huruf yang muncul di layar!
                </p>

                        <div className={`${styles.letterDisplay} ${styles[status]}`}>
                            {currentLetter}
                        </div>

                        <input 
                            ref={inputRef}
                            type="text"
                            className={styles.hiddenInput}
                            value={inputValue}
                            onChange={handleInputChange}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            autoFocus
                        />

                        <button className={styles.keyboardBtn} onClick={focusInput}>
                            ⌨️ Munculkan Keyboard
                        </button>
            </main>
        </div>
    );
};

export default MateriHuruf;
