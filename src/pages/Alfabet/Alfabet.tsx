import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Alfabet.module.css';
import { audioPlayer } from '../../utils/audioPlayer';

const ALPHABETS = [
    { letter: 'A', word: 'Apel', icon: '🍎' },
    { letter: 'B', word: 'Buku', icon: '📚' },
    { letter: 'C', word: 'Cicak', icon: '🦎' },
    { letter: 'D', word: 'Domba', icon: '🐑' },
    { letter: 'E', word: 'Ember', icon: '🪣' },
    { letter: 'F', word: 'Foto', icon: '📷' },
    { letter: 'G', word: 'Gajah', icon: '🐘' },
    { letter: 'H', word: 'Harimau', icon: '🐅' },
    { letter: 'I', word: 'Ikan', icon: '🐟' },
    { letter: 'J', word: 'Jeruk', icon: '🍊' },
    { letter: 'K', word: 'Kucing', icon: '🐈' },
    { letter: 'L', word: 'Lampu', icon: '💡' },
    { letter: 'M', word: 'Mobil', icon: '🚗' },
    { letter: 'N', word: 'Nanas', icon: '🍍' },
    { letter: 'O', word: 'Obat', icon: '💊' },
    { letter: 'P', word: 'Pisang', icon: '🍌' },
    { letter: 'Q', word: 'Quran', icon: '📖' },
    { letter: 'R', word: 'Rumah', icon: '🏠' },
    { letter: 'S', word: 'Sapi', icon: '🐄' },
    { letter: 'T', word: 'Topi', icon: '🧢' },
    { letter: 'U', word: 'Ular', icon: '🐍' },
    { letter: 'V', word: 'Vila', icon: '🏡' },
    { letter: 'W', word: 'Wortel', icon: '🥕' },
    { letter: 'X', word: 'Xilofon', icon: '🎹' },
    { letter: 'Y', word: 'Yoyo', icon: '🪀' },
    { letter: 'Z', word: 'Zebra', icon: '🦓' },
];

interface AlfabetProps {
    isLowercase?: boolean;
}

const Alfabet: React.FC<AlfabetProps> = ({ isLowercase = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showWord, setShowWord] = useState(false);

    const currentItem = ALPHABETS[currentIndex];

    // Play pre-generated Edge TTS audio file via optimized player
    const playAudio = (type: 'letter' | 'word', letterKey: string, onEnd?: () => void) => {
        const filename = type === 'letter'
            ? `letter_${letterKey.toLowerCase()}.mp3`
            : `word_${letterKey.toLowerCase()}.mp3`;

        audioPlayer.play(`/audio/alfabet/${filename}`, onEnd);
    };

    const handleNext = () => {
        setShowWord(false);
        const nextIndex = (currentIndex + 1) % ALPHABETS.length;
        setCurrentIndex(nextIndex);
        playAudio('letter', ALPHABETS[nextIndex].letter);
    };

    const handlePrev = () => {
        setShowWord(false);
        const prevIndex = (currentIndex - 1 + ALPHABETS.length) % ALPHABETS.length;
        setCurrentIndex(prevIndex);
        playAudio('letter', ALPHABETS[prevIndex].letter);
    };

    const handleCardClick = () => {
        const isRevealing = !showWord;
        setShowWord(isRevealing);

        if (isRevealing) {
            playAudio('word', currentItem.letter);
        } else {
            playAudio('letter', currentItem.letter);
        }
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/alfabet" className="btn" style={{
                    backgroundColor: 'var(--cat-blue)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                }}>
                    ⬅️ Kembali
                </Link>
                <h2 className={styles.gameTitle}>Belajar Huruf {isLowercase ? 'Kecil' : 'Besar'}</h2>
            </header>

            <main className={styles.gameBoard}>
                <div className={styles.letterCard} onClick={handleCardClick}>
                    <div className={styles.bigLetter}>{isLowercase ? currentItem.letter.toLowerCase() : currentItem.letter}</div>

                    <div className={`${styles.wordReveal} ${showWord ? styles.show : ''}`}>
                        <span className={styles.wordIcon}>{currentItem.icon}</span>
                        <span className={styles.wordText}>{currentItem.word}</span>
                    </div>

                    {!showWord && (
                        <div className={styles.hintText}>Klik untuk melihat kata!</div>
                    )}
                </div>

                <div className={styles.progress}>
                    {currentIndex + 1} / {ALPHABETS.length}
                </div>

                <div className={styles.letterSelector}>
                    {ALPHABETS.map((item, index) => {
                        const letterDisplay = isLowercase ? item.letter.toLowerCase() : item.letter;
                        return (
                            <button
                                key={item.letter}
                                className={`${styles.selectorBtn} ${index === currentIndex ? styles.selectorBtnActive : ''}`}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowWord(false);
                                    if (currentIndex !== index) {
                                        setCurrentIndex(index);
                                        playAudio('letter', item.letter);
                                    } else {
                                        // If clicking the same letter again, just replay the sound
                                        playAudio('letter', item.letter);
                                    }
                                }}
                                // Define empty onClick to satisfy React a11y, but we handle logic in pointer down
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                {letterDisplay}
                            </button>
                        );
                    })}
                </div>

                <div className={styles.controls}>
                    <button className={`${styles.controlBtn} ${styles.prevBtn}`} onClick={handlePrev}>
                        ◀️ Sebelumnya
                    </button>
                    <button className={`${styles.controlBtn} ${styles.nextBtn}`} onClick={handleNext}>
                        Selanjutnya ▶️
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Alfabet;
