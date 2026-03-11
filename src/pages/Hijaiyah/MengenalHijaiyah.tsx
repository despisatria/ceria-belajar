import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { audioPlayer } from '../../utils/audioPlayer';
import styles from './MengenalHijaiyah.module.css';

interface HijaiyahLetter {
    id: string;
    arabic: string;
    latin: string;
}

// 30 Hijaiyah letters including Lam Alif and Hamzah
const HIJAIYAH_LETTERS: HijaiyahLetter[] = [
    { id: 'alif', arabic: 'ا', latin: 'Alif' },
    { id: 'ba', arabic: 'ب', latin: 'Ba' },
    { id: 'ta', arabic: 'ت', latin: 'Ta' },
    { id: 'tsa', arabic: 'ث', latin: 'Tsa' },
    { id: 'jim', arabic: 'ج', latin: 'Jim' },
    { id: 'ha', arabic: 'ح', latin: 'Ha' },
    { id: 'kha', arabic: 'خ', latin: 'Kha' },
    { id: 'dal', arabic: 'د', latin: 'Dal' },
    { id: 'dzal', arabic: 'ذ', latin: 'Dzal' },
    { id: 'ra', arabic: 'ر', latin: 'Ra' },
    { id: 'zai', arabic: 'ز', latin: 'Zai' },
    { id: 'sin', arabic: 'س', latin: 'Sin' },
    { id: 'syin', arabic: 'ش', latin: 'Syin' },
    { id: 'shad', arabic: 'ص', latin: 'Shad' },
    { id: 'dhad', arabic: 'ض', latin: 'Dhad' },
    { id: 'tha', arabic: 'ط', latin: 'Tha' },
    { id: 'zha', arabic: 'ظ', latin: 'Zha' },
    { id: 'ain', arabic: 'ع', latin: "'Ain" },
    { id: 'ghain', arabic: 'غ', latin: 'Ghain' },
    { id: 'fa', arabic: 'ف', latin: 'Fa' },
    { id: 'qaf', arabic: 'ق', latin: 'Qaf' },
    { id: 'kaf', arabic: 'ك', latin: 'Kaf' },
    { id: 'lam', arabic: 'ل', latin: 'Lam' },
    { id: 'mim', arabic: 'م', latin: 'Mim' },
    { id: 'nun', arabic: 'ن', latin: 'Nun' },
    { id: 'wawu', arabic: 'و', latin: 'Wawu' },
    { id: 'ha_besar', arabic: 'هـ', latin: 'Ha' },
    { id: 'lam_alif', arabic: 'لا', latin: 'Lam Alif' },
    { id: 'hamzah', arabic: 'ء', latin: 'Hamzah' },
    { id: 'ya', arabic: 'ي', latin: 'Ya' }
];

const MengenalHijaiyah: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentItem = HIJAIYAH_LETTERS[currentIndex];

    const playAudio = useCallback((id: string) => {
        audioPlayer.play(`/audio/hijaiyah/${id}.mp3`);
    }, []);

    // Play audio automatically when letter changes
    useEffect(() => {
        playAudio(currentItem.id);
    }, [currentIndex, currentItem.id, playAudio]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % HIJAIYAH_LETTERS.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + HIJAIYAH_LETTERS.length) % HIJAIYAH_LETTERS.length);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/hijaiyah" className="btn" style={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                }}>
                    ⬅️ Kembali
                </Link>
                <h2 className={styles.gameTitle}>Mengenal Huruf Hijaiyah</h2>
            </header>

            <main className={styles.gameBoard}>
                <div className={styles.numberCard} onClick={() => playAudio(currentItem.id)} style={{ cursor: 'pointer' }}>
                    <div className={styles.bigNumber}>{currentItem.arabic}</div>
                    <div className={styles.numberText}>
                        {currentItem.latin}
                    </div>
                </div>

                <div className={styles.progress}>
                    {currentIndex + 1} / {HIJAIYAH_LETTERS.length}
                </div>

                <div className={styles.numberSelector}>
                    {HIJAIYAH_LETTERS.map((item, index) => (
                        <button
                            key={item.id}
                            className={`${styles.selectorBtn} ${index === currentIndex ? styles.selectorBtnActive : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            {item.arabic}
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

export default MengenalHijaiyah;
