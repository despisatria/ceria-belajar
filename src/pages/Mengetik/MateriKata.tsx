import React, { useState, useEffect, useRef } from 'react';
import styles from './Mengetik.module.css';
import { playCorrectSound, playWrongSound } from '../../utils/soundEffects';
import GameHeader from '../../components/GameHeader';
import confetti from 'canvas-confetti';
import { ALL_POOLS, type WordEntry } from '../../data/membacaWordPools';
import { shuffleArray } from '../../utils/helpers';

const MateriKata: React.FC = () => {
    const [words, setWords] = useState<WordEntry[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedWord, setTypedWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [status, setStatus] = useState<'idle' | 'wrong'>('idle');
    const inputRef = useRef<HTMLInputElement>(null);

    // Init words on mount
    useEffect(() => {
        setWords(shuffleArray(ALL_POOLS.flat()).slice(0, 5)); // Ambil 5 kata acak untuk satu sesi
    }, []);

    const currentEntry = words[currentIndex];
    const currentWord = currentEntry ? currentEntry.word.toUpperCase() : '';

    useEffect(() => {
        focusInput();
    }, [currentIndex]); // Focus everytime word changes

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
        if (status === 'wrong') return;

        const val = e.target.value.toUpperCase();
        setInputValue(val);

        if (!val) return; 

        const typedChar = val.slice(-1);
        const expectedChar = currentWord[typedWord.length];

        if (typedChar === expectedChar) {
            // Benar
            const newTypedWord = typedWord + typedChar;
            setTypedWord(newTypedWord);
            playCorrectSound();
            
            // Check if whole word is completed
            if (newTypedWord === currentWord) {
                setTimeout(() => {
                    const nextIndex = (currentIndex + 1) % words.length;
                    if (nextIndex === 0) {
                        triggerConfetti();
                        setWords(shuffleArray(ALL_POOLS.flat()).slice(0, 5));
                    }
                    setCurrentIndex(nextIndex);
                    setTypedWord('');
                }, 800);
            }
        } else {
            // Salah
            setStatus('wrong');
            playWrongSound();
            setTimeout(() => {
                setStatus('idle');
            }, 500);
        }

        // Always clear input value to keep catching single keystrokes properly
        setTimeout(() => setInputValue(''), 10);
    };



    if (words.length === 0) return null;

    return (
        <div className={styles.gameContainer}>
            <GameHeader 
                menuLink="/membaca" 
                themeColor="var(--cat-orange)" 
                styles={styles} 
                borderColor="var(--cat-orange)"
                hideStats={true}
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-orange)' }}>Materi Ketik Kata</h2>
            </GameHeader>

            <main className={styles.gameBoard} onClick={focusInput}>
                <p className={styles.instruction}>
                    Ketik huruf demi huruf untuk membentuk kata!
                </p>

                        <div style={{ fontSize: '6rem', marginBottom: '10px', textAlign: 'center' }}>
                            {currentEntry?.emoji}
                        </div>

                        <div className={styles.wordDisplay}>
                            {currentWord.split('').map((char, idx) => {
                                const isTyped = idx < typedWord.length;
                                const isActive = idx === typedWord.length;
                                const isWrong = isActive && status === 'wrong';
                                
                                let className = styles.wordLetter;
                                if (isTyped) className += ` ${styles.typed}`;
                                else if (isActive) className += ` ${styles.active}`;
                                if (isWrong) className += ` ${styles.wrong}`;

                                return (
                                    <div key={idx} className={className}>
                                        {char}
                                    </div>
                                );
                            })}
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

                        <button className={styles.keyboardBtn} onClick={focusInput} style={{ backgroundColor: 'var(--cat-orange)' }}>
                            ⌨️ Munculkan Keyboard
                        </button>
            </main>
        </div>
    );
};

export default MateriKata;
