import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { audioPlayer } from '../../utils/audioPlayer';
import styles from './MengenalHijaiyah.module.css';

interface HijaiyahLetter {
    id: string;
    arabic: string;
    latin: string;
    order: number;  // Urutan huruf (1-29)
}

// 29 Hijaiyah letters (standard order) + Lam Alif
const HIJAIYAH_LETTERS: HijaiyahLetter[] = [
    { id: 'alif', arabic: 'ا', latin: 'Alif', order: 1 },
    { id: 'ba', arabic: 'ب', latin: 'Ba', order: 2 },
    { id: 'ta', arabic: 'ت', latin: 'Ta', order: 3 },
    { id: 'tsa', arabic: 'ث', latin: 'Tsa', order: 4 },
    { id: 'jim', arabic: 'ج', latin: 'Jim', order: 5 },
    { id: 'ha', arabic: 'ح', latin: 'Ha', order: 6 },
    { id: 'kha', arabic: 'خ', latin: 'Kha', order: 7 },
    { id: 'dal', arabic: 'د', latin: 'Dal', order: 8 },
    { id: 'dzal', arabic: 'ذ', latin: 'Dzal', order: 9 },
    { id: 'ra', arabic: 'ر', latin: 'Ra', order: 10 },
    { id: 'zai', arabic: 'ز', latin: 'Zai', order: 11 },
    { id: 'sin', arabic: 'س', latin: 'Sin', order: 12 },
    { id: 'syin', arabic: 'ش', latin: 'Syin', order: 13 },
    { id: 'shad', arabic: 'ص', latin: 'Shad', order: 14 },
    { id: 'dhad', arabic: 'ض', latin: 'Dhad', order: 15 },
    { id: 'tha', arabic: 'ط', latin: 'Tha', order: 16 },
    { id: 'zha', arabic: 'ظ', latin: 'Zha', order: 17 },
    { id: 'ain', arabic: 'ع', latin: "'Ain", order: 18 },
    { id: 'ghain', arabic: 'غ', latin: 'Ghain', order: 19 },
    { id: 'fa', arabic: 'ف', latin: 'Fa', order: 20 },
    { id: 'qaf', arabic: 'ق', latin: 'Qaf', order: 21 },
    { id: 'kaf', arabic: 'ك', latin: 'Kaf', order: 22 },
    { id: 'lam', arabic: 'ل', latin: 'Lam', order: 23 },
    { id: 'mim', arabic: 'م', latin: 'Mim', order: 24 },
    { id: 'nun', arabic: 'ن', latin: 'Nun', order: 25 },
    { id: 'wawu', arabic: 'و', latin: 'Wawu', order: 26 },
    { id: 'ha_besar', arabic: 'هـ', latin: 'Ha', order: 27 },
    { id: 'lam_alif', arabic: 'لا', latin: 'Lam Alif', order: 28 },
    { id: 'hamzah', arabic: 'ء', latin: 'Hamzah', order: 29 },
    { id: 'ya', arabic: 'ي', latin: 'Ya', order: 30 },
];

const MengenalHijaiyah: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDetail, setShowDetail] = useState(false);

    const currentItem = HIJAIYAH_LETTERS[currentIndex];

    const playAudio = useCallback((id: string) => {
        audioPlayer.play(`/audio/hijaiyah/${id}.mp3`);
    }, []);

    // Play audio automatically when letter changes
    useEffect(() => {
        playAudio(currentItem.id);
    }, [currentIndex, currentItem.id, playAudio]);

    const handleNext = () => {
        setShowDetail(false);
        const nextIndex = (currentIndex + 1) % HIJAIYAH_LETTERS.length;
        setCurrentIndex(nextIndex);
    };

    const handlePrev = () => {
        setShowDetail(false);
        const prevIndex = (currentIndex - 1 + HIJAIYAH_LETTERS.length) % HIJAIYAH_LETTERS.length;
        setCurrentIndex(prevIndex);
    };

    const handleCardClick = () => {
        const isRevealing = !showDetail;
        setShowDetail(isRevealing);
        playAudio(currentItem.id);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/hijaiyah" className="btn" style={{
                    backgroundColor: 'var(--cat-green)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                }}>
                    ⬅️ Kembali
                </Link>
                <h2 className={styles.gameTitle}>Mengenal Huruf Hijaiyah ☪️</h2>
            </header>

            <main className={styles.gameBoard}>
                <div className={styles.letterCard} onClick={handleCardClick}>
                    <div className={styles.bigLetter}>{currentItem.arabic}</div>

                    <div className={`${styles.wordReveal} ${showDetail ? styles.show : ''}`}>
                        <span className={styles.revealIcon}>🌙</span>
                        <span className={styles.revealText}>{currentItem.latin}</span>
                        <span className={styles.revealSub}>( {currentItem.arabic} )</span>
                    </div>

                    {!showDetail && (
                        <div className={styles.hintText}>Klik untuk lihat nama!</div>
                    )}
                </div>

                <div className={styles.progress}>
                    {currentIndex + 1} / {HIJAIYAH_LETTERS.length}
                </div>

                <div className={styles.controls}>
                    <button className={`${styles.controlBtn} ${styles.prevBtn}`} onClick={handlePrev}>
                        ◀️ Sebelumnya
                    </button>
                    <button className={`${styles.controlBtn} ${styles.nextBtn}`} onClick={handleNext}>
                        Selanjutnya ▶️
                    </button>
                </div>

                <div className={styles.letterSelector}>
                    {HIJAIYAH_LETTERS.map((item, index) => (
                        <button
                            key={item.id}
                            className={`${styles.selectorBtn} ${index === currentIndex ? styles.selectorBtnActive : ''}`}
                            onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowDetail(false);
                                if (currentIndex !== index) {
                                    setCurrentIndex(index);
                                } else {
                                    playAudio(item.id);
                                }
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            {item.arabic}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MengenalHijaiyah;
