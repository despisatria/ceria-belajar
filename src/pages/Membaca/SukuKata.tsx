import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SukuKata.module.css';
import { audioPlayer } from '../../utils/audioPlayer';

export type SukuKataType = 'dasar' | 'khusus';

interface SukuKataProps {
    type: SukuKataType;
}

const VOWELS = ['a', 'i', 'u', 'e', 'o'];

// Subset konsonan PAUD/TK-friendly
const KV_CONSONANTS = ['b', 'c', 'd', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'w', 'y'];

// Vokal standalone dengan contoh kata
const VOKAL_DATA = [
    { letter: 'A', example: 'Ayam', icon: '🐔' },
    { letter: 'I', example: 'Ikan', icon: '🐟' },
    { letter: 'U', example: 'Ular', icon: '🐍' },
    { letter: 'E', example: 'Ember', icon: '🪣' },
    { letter: 'O', example: 'Obat', icon: '💊' },
];

const SukuKata: React.FC<SukuKataProps> = ({ type }) => {
    // For 'dasar': tab is 'vokal' | 'kv'
    // For 'khusus': tab is 'ng' | 'ny'
    const [activeTab, setActiveTab] = useState<string>(type === 'dasar' ? 'vokal' : 'ng');
    const [selectedConsonant, setSelectedConsonant] = useState<string>('b');
    const [playingKey, setPlayingKey] = useState<string | null>(null);

    const isDasar = type === 'dasar';
    const pageColor = isDasar ? 'var(--cat-blue)' : 'var(--cat-green)';
    const pageTitle = isDasar ? 'Suku Kata Dasar' : 'Suku Kata Khusus';

    const playAudio = (key: string) => {
        setPlayingKey(key);
        audioPlayer.play(`/audio/suku-kata/${key}.mp3`, () => setPlayingKey(null));
    };

    const handleVokalClick = (letter: string) => playAudio(`vokal_${letter.toLowerCase()}`);
    const handleKVClick = (syllable: string) => playAudio(`kv_${syllable}`);
    const handleNGNYClick = (prefix: string, syllable: string) => playAudio(`${prefix}_${syllable}`);

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/membaca" className="btn" style={{
                    backgroundColor: pageColor,
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    flexShrink: 0,
                }}>
                    ⬅️ Kembali
                </Link>
                <h2 className={styles.gameTitle} style={{ color: pageColor }}>
                    {pageTitle}
                </h2>
            </header>

            {/* === TAB SWITCHER === */}
            <div className={styles.tabSwitcher}>
                {isDasar ? (
                    <>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'vokal' ? styles.tabBtnActive : ''}`}
                            style={activeTab === 'vokal' ? { background: 'var(--cat-orange)', borderColor: 'var(--cat-orange)' } : {}}
                            onClick={() => setActiveTab('vokal')}
                        >
                            🔤 Vokal
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'kv' ? styles.tabBtnActive : ''}`}
                            style={activeTab === 'kv' ? { background: 'var(--cat-blue)', borderColor: 'var(--cat-blue)' } : {}}
                            onClick={() => setActiveTab('kv')}
                        >
                            🅱️ Konsonan
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'ng' ? styles.tabBtnActive : ''}`}
                            style={activeTab === 'ng' ? { background: 'var(--cat-green)', borderColor: 'var(--cat-green)' } : {}}
                            onClick={() => setActiveTab('ng')}
                        >
                            🌈 NG
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'ny' ? styles.tabBtnActive : ''}`}
                            style={activeTab === 'ny' ? { background: 'var(--cat-purple)', borderColor: 'var(--cat-purple)' } : {}}
                            onClick={() => setActiveTab('ny')}
                        >
                            🦟 NY
                        </button>
                    </>
                )}
            </div>

            <main className={styles.gameBoard}>
                {/* === VOKAL TAB === */}
                {activeTab === 'vokal' && (
                    <div className={styles.syllableArea} style={{ width: '100%' }}>
                        <p className={styles.syllableTitle}>Ketuk kartu untuk mendengar bunyinya!</p>
                        <div className={styles.vokalGrid}>
                            {VOKAL_DATA.map((item) => (
                                <div
                                    key={item.letter}
                                    className={styles.vokalCard}
                                    onClick={() => handleVokalClick(item.letter)}
                                >
                                    <span className={styles.vokalLetter}>{item.letter}</span>
                                    <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                                    <span className={styles.vokalExample}>{item.example}</span>
                                    {playingKey === `vokal_${item.letter.toLowerCase()}` && (
                                        <span className={styles.playingIndicator}>🔊</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* === KV TAB === */}
                {activeTab === 'kv' && (
                    <>
                        <div className={styles.consonantPanel}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--quaternary)', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Pilih
                            </p>
                            {KV_CONSONANTS.map((c) => (
                                <button
                                    key={c}
                                    className={`${styles.consonantBtn} ${selectedConsonant === c ? styles.consonantBtnActive : ''}`}
                                    onClick={() => setSelectedConsonant(c)}
                                >
                                    {c.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className={styles.syllableArea}>
                            <p className={styles.syllableTitle}>
                                Huruf <strong style={{ color: 'var(--cat-blue)', fontSize: '1.6rem' }}>{selectedConsonant.toUpperCase()}</strong> + Vokal
                            </p>
                            <div className={styles.syllableGrid}>
                                {VOWELS.map((v, i) => {
                                    const syllable = selectedConsonant + v;
                                    return (
                                        <div
                                            key={v}
                                            className={`${styles.syllableCard} ${styles[`color${i}`]}`}
                                            onClick={() => handleKVClick(syllable)}
                                        >
                                            <span className={styles.syllableText}>
                                                {syllable.charAt(0).toUpperCase() + syllable.slice(1)}
                                            </span>
                                            <span className={styles.vowelTag}>{v.toUpperCase()}</span>
                                            {playingKey === `kv_${syllable}` && (
                                                <span className={styles.playingIndicator}>🔊</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* === NG TAB === */}
                {activeTab === 'ng' && (
                    <div className={styles.ngnyArea}>
                        <div className={styles.ngnyBadge}>
                            <span>🌈</span>
                            <span>N + G = "NG"</span>
                        </div>
                        <p className={styles.syllableTitle}>Ketuk kartu untuk mendengar bunyinya!</p>
                        <div className={styles.ngnyGrid}>
                            {VOWELS.map((v, i) => {
                                const syllable = 'ng' + v;
                                return (
                                    <div
                                        key={v}
                                        className={`${styles.syllableCard} ${styles[`color${i}`]}`}
                                        onClick={() => handleNGNYClick('ng', syllable)}
                                    >
                                        <span className={styles.syllableText}>
                                            {syllable.charAt(0).toUpperCase() + syllable.slice(1)}
                                        </span>
                                        <span className={styles.vowelTag}>{v.toUpperCase()}</span>
                                        {playingKey === `ng_${syllable}` && (
                                            <span className={styles.playingIndicator}>🔊</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* === NY TAB === */}
                {activeTab === 'ny' && (
                    <div className={styles.ngnyArea}>
                        <div className={`${styles.ngnyBadge} ${styles.ngnyBadgeNY}`}>
                            <span>🦟</span>
                            <span>N + Y = "NY"</span>
                        </div>
                        <p className={styles.syllableTitle}>Ketuk kartu untuk mendengar bunyinya!</p>
                        <div className={styles.ngnyGrid}>
                            {VOWELS.map((v, i) => {
                                const syllable = 'ny' + v;
                                return (
                                    <div
                                        key={v}
                                        className={`${styles.syllableCard} ${styles[`color${i}`]}`}
                                        onClick={() => handleNGNYClick('ny', syllable)}
                                    >
                                        <span className={styles.syllableText}>
                                            {syllable.charAt(0).toUpperCase() + syllable.slice(1)}
                                        </span>
                                        <span className={styles.vowelTag}>{v.toUpperCase()}</span>
                                        {playingKey === `ny_${syllable}` && (
                                            <span className={styles.playingIndicator}>🔊</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SukuKata;
