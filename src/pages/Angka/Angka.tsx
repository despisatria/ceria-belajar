import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Angka.module.css';
import { audioPlayer } from '../../utils/audioPlayer';

// Helper: generate emoji items for a number
function generateItems(num: number): string {
    const emojis = ['🍎', '⭐', '🎈', '🐸', '🌸', '🚗', '🍊', '🐱', '💎', '🌻'];
    const emoji = emojis[num % emojis.length];
    return emoji.repeat(num);
}

// Indonesian number names
function numberToText(num: number): string {
    const satuan = ['Nol', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
    const belasan = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas',
        'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
    const puluhan = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh',
        'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];

    if (num === 100) return 'Seratus';
    if (num < 10) return satuan[num];
    if (num < 20) return belasan[num - 10];
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    if (ones === 0) return puluhan[tens];
    return `${puluhan[tens]} ${satuan[ones]}`;
}

interface AngkaProps {
    rangeStart: number;
    rangeEnd: number;
    title: string;
}

const Angka: React.FC<AngkaProps> = ({ rangeStart, rangeEnd, title }) => {
    const numbers = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
        numbers.push({ num: i, text: numberToText(i) });
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentItem = numbers[currentIndex];

    const playNumberAudio = useCallback((num: number) => {
        audioPlayer.play(`/audio/angka/${num}.mp3`);
    }, []);

    // Play audio when number changes
    useEffect(() => {
        playNumberAudio(currentItem.num);
    }, [currentIndex, currentItem.num, playNumberAudio]);

    // For numbers > 20, don't show emoji items (too many)
    const showItems = currentItem.num <= 20;
    const items = showItems ? generateItems(currentItem.num) : '';

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % numbers.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + numbers.length) % numbers.length);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/angka" className="btn" style={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                }}>
                    ⬅️ Kembali
                </Link>
                <h2 className={styles.gameTitle}>{title}</h2>
            </header>

            <main className={styles.gameBoard}>
                <div className={styles.numberCard} onClick={() => playNumberAudio(currentItem.num)} style={{ cursor: 'pointer' }}>
                    <div className={styles.bigNumber}>{currentItem.num}</div>
                    <div className={styles.numberText}>
                        {currentItem.text}
                    </div>

                    {showItems && currentItem.num > 0 && (
                        <div className={styles.itemsContainer}>
                            {Array.from(items).map((emoji, index) => (
                                <span key={`${currentIndex}-${index}`} className={styles.itemEmoji} style={{ animationDelay: `${index * 0.08}s` }}>
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.progress}>
                    {currentIndex + 1} / {numbers.length}
                </div>

                <div className={styles.numberSelector}>
                    {numbers.map((item, index) => (
                        <button
                            key={item.num}
                            className={`${styles.selectorBtn} ${index === currentIndex ? styles.selectorBtnActive : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            {item.num}
                        </button>
                    ))}
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

export default Angka;
