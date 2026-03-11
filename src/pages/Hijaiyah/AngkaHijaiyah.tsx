import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { audioPlayer } from '../../utils/audioPlayer';
// Reusing exact same layout styles from MengenalHijaiyah
import styles from './MengenalHijaiyah.module.css';

interface AngkaHijaiyahItem {
    id: number;
    arabic: string;
    latin: string;
}

const ANGKA_HIJAIYAH: AngkaHijaiyahItem[] = [
    { id: 1, arabic: '١', latin: 'Wahid (1)' },
    { id: 2, arabic: '٢', latin: 'Ithnan (2)' },
    { id: 3, arabic: '٣', latin: 'Thalatha (3)' },
    { id: 4, arabic: '٤', latin: "Arba'a (4)" },
    { id: 5, arabic: '٥', latin: 'Khamsa (5)' },
    { id: 6, arabic: '٦', latin: 'Sitta (6)' },
    { id: 7, arabic: '٧', latin: "Sab'a (7)" },
    { id: 8, arabic: '٨', latin: 'Thamaniya (8)' },
    { id: 9, arabic: '٩', latin: "Tis'a (9)" },
    { id: 10, arabic: '١٠', latin: 'Ashara (10)' },
    { id: 11, arabic: '١١', latin: 'Ahada Ashar (11)' },
    { id: 12, arabic: '١٢', latin: 'Ithna Ashar (12)' },
    { id: 13, arabic: '١٣', latin: 'Thalathata Ashar (13)' },
    { id: 14, arabic: '١٤', latin: "Arba'ata Ashar (14)" },
    { id: 15, arabic: '١٥', latin: 'Khamsata Ashar (15)' },
    { id: 16, arabic: '١٦', latin: 'Sittata Ashar (16)' },
    { id: 17, arabic: '١٧', latin: "Sab'ata Ashar (17)" },
    { id: 18, arabic: '١٨', latin: 'Thamanyata Ashar (18)' },
    { id: 19, arabic: '١٩', latin: "Tis'ata Ashar (19)" },
    { id: 20, arabic: '٢٠', latin: 'Ishrun (20)' }
];

const AngkaHijaiyah: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentItem = ANGKA_HIJAIYAH[currentIndex];

    const playAudio = useCallback((id: number) => {
        audioPlayer.play(`/audio/hijaiyah_angka/${id}.mp3`);
    }, []);

    // Play audio automatically when number changes
    useEffect(() => {
        playAudio(currentItem.id);
    }, [currentIndex, currentItem.id, playAudio]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % ANGKA_HIJAIYAH.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + ANGKA_HIJAIYAH.length) % ANGKA_HIJAIYAH.length);
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
                <h2 className={styles.gameTitle}>Angka Hijaiyah (1-20)</h2>
            </header>

            <main className={styles.gameBoard}>
                <div className={styles.numberCard} onClick={() => playAudio(currentItem.id)} style={{ cursor: 'pointer' }}>
                    <div className={styles.bigNumber}>{currentItem.arabic}</div>
                    <div className={styles.numberText}>
                        {currentItem.latin}
                    </div>
                </div>

                <div className={styles.progress}>
                    {currentIndex + 1} / {ANGKA_HIJAIYAH.length}
                </div>

                <div className={styles.numberSelector}>
                    {ANGKA_HIJAIYAH.map((item, index) => (
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

export default AngkaHijaiyah;
