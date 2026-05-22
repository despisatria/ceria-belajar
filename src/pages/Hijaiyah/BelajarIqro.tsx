import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { audioPlayer } from '../../utils/audioPlayer';
import { IQRO_PAGES, IQRO_LETTERS_MAP } from '../../data/iqro1Data';
import styles from './BelajarIqro.module.css';

const BelajarIqro: React.FC = () => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [playingId, setPlayingId] = useState<string | null>(null);

    const currentPage = IQRO_PAGES[currentPageIndex];

    const playAudio = useCallback((id: string, uniqueKey: string) => {
        setPlayingId(uniqueKey);
        
        // Use the audioPlayer util
        audioPlayer.play(`/audio/iqro/${id}.mp3`);
        
        // Remove playing state after roughly the duration of the audio
        // The audio is usually very short (0.5 - 1 second)
        setTimeout(() => {
            setPlayingId(null);
        }, 800);
    }, []);

    const handleNextPage = () => {
        if (currentPageIndex < IQRO_PAGES.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
        }
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/hijaiyah" className="btn" style={{
                    backgroundColor: 'var(--cat-purple)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                }}>
                    ⬅️ Kembali
                </Link>
                <h2 className={styles.gameTitle}>Membaca Iqro 1 📖</h2>
            </header>

            <main className={styles.bookBoard}>
                <div className={styles.bookPage}>
                    {/* Header: New Letters Introduction */}
                    <div className={styles.pageHeader}>
                        <h3>{currentPage.title}</h3>
                        <p className={styles.pageDesc}>{currentPage.description}</p>
                        <div className={styles.newLettersGrid}>
                            {currentPage.newLetters.map((letterId, index) => {
                                const letterInfo = IQRO_LETTERS_MAP[letterId];
                                const uniqueKey = `header-${letterId}-${index}`;
                                return (
                                    <div 
                                        key={uniqueKey}
                                        className={styles.newLetterBox}
                                        onClick={() => playAudio(letterId, uniqueKey)}
                                    >
                                        {letterInfo.arabic}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Reading Area */}
                    <div className={styles.readingArea}>
                        {currentPage.lines.map((line, lineIndex) => (
                            <div key={`line-${lineIndex}`} className={styles.readingLine}>
                                {line.map((letterId, letterIndex) => {
                                    const letterInfo = IQRO_LETTERS_MAP[letterId];
                                    const uniqueKey = `line-${lineIndex}-letter-${letterIndex}`;
                                    const isPlaying = playingId === uniqueKey;
                                    
                                    return (
                                        <div
                                            key={uniqueKey}
                                            className={`${styles.letterBox} ${isPlaying ? styles.playing : ''}`}
                                            onClick={() => playAudio(letterId, uniqueKey)}
                                        >
                                            {letterInfo.arabic}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.progress}>
                    Halaman {currentPage.pageNumber} dari {IQRO_PAGES.length}
                </div>

                <div className={styles.controls}>
                    <button 
                        className={`${styles.controlBtn} ${styles.prevBtn}`} 
                        onClick={handlePrevPage}
                        disabled={currentPageIndex === 0}
                    >
                        ◀️ Hal Sebelumnya
                    </button>
                    <button 
                        className={`${styles.controlBtn} ${styles.nextBtn}`} 
                        onClick={handleNextPage}
                        disabled={currentPageIndex === IQRO_PAGES.length - 1}
                    >
                        Hal Selanjutnya ▶️
                    </button>
                </div>
            </main>
        </div>
    );
};

export default BelajarIqro;
