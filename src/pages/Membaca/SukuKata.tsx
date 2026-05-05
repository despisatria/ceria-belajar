import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SukuKata.module.css';
import { audioPlayer } from '../../utils/audioPlayer';
import KV_WORDS from './kvWordsData';
import { KHUSUS_WORDS } from './khususWordsData';

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

// Kata-kata berawalan vokal untuk detail view
const VOKAL_WORDS: Record<string, { word: string; emoji?: string; image?: string }[]> = {
    A: [
        { word: 'Ayam', emoji: '🐔' },
        { word: 'Air', emoji: '🌊' },
        { word: 'Anggur', emoji: '🍇' },
    ],
    I: [
        { word: 'Ikan', emoji: '🐟' },
        { word: 'Itik', image: '/images/vokal-kata/itik.png' },
        { word: 'Ibu', image: '/images/vokal-kata/ibu.png' },
    ],
    U: [
        { word: 'Ular', emoji: '🐍' },
        { word: 'Ubi', image: '/images/vokal-kata/ubi.png' },
        { word: 'Udang', emoji: '🦐' },
    ],
    E: [
        { word: 'Ember', image: '/images/vokal-kata/ember.png' },
        { word: 'Es', image: '/images/vokal-kata/es.png' },
        { word: 'Elang', image: '/images/vokal-kata/elang.png' },
    ],
    O: [
        { word: 'Obat', image: '/images/vokal-kata/obat.png' },
        { word: 'Orang', image: '/images/vokal-kata/orang.png' },
        { word: 'Otak', image: '/images/vokal-kata/otak.png' },
    ],
};

// Warna untuk setiap vokal
const VOKAL_COLORS: Record<string, string> = {
    A: 'var(--cat-red)',
    I: 'var(--cat-blue)',
    U: 'var(--cat-green)',
    E: 'var(--cat-orange)',
    O: 'var(--cat-purple)',
};

const SukuKata: React.FC<SukuKataProps> = ({ type }) => {
    // For 'dasar': tab is 'vokal' | 'kv'
    // For 'khusus': tab is 'ng' | 'ny'
    const [activeTab, setActiveTab] = useState<string>(type === 'dasar' ? 'vokal' : 'ng');
    const [selectedConsonant, setSelectedConsonant] = useState<string>('b');
    const [playingKey, setPlayingKey] = useState<string | null>(null);
    const [selectedVokal, setSelectedVokal] = useState<string | null>(null);
    const [selectedSyllable, setSelectedSyllable] = useState<string | null>(null);
    const [speakingWord, setSpeakingWord] = useState<string | null>(null);

    const isDasar = type === 'dasar';
    const pageColor = isDasar ? 'var(--cat-blue)' : 'var(--cat-green)';
    const pageTitle = isDasar ? 'Suku Kata Dasar' : 'Suku Kata Khusus';

    const playAudio = (key: string) => {
        setPlayingKey(key);
        audioPlayer.play(`/audio/suku-kata/${key}.mp3`, () => setPlayingKey(null));
    };

    const speakWord = (word: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            audioPlayer.stop();
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'id-ID';
            utterance.rate = 0.85;
            setSpeakingWord(word);
            utterance.onend = () => setSpeakingWord(null);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleVokalClick = (letter: string) => {
        setSelectedVokal(letter);
        playAudio(`vokal_${letter.toLowerCase()}`);
    };

    const handleWordClick = (word: string) => {
        playAudio(`kata_${word.toLowerCase()}`);
    };

    const handleKVClick = (syllable: string) => {
        setSelectedSyllable(syllable);
        playAudio(`kv_${syllable}`);
    };

    const handleKVWordClick = (word: string) => {
        speakWord(word);
    };

    const handleConsonantChange = (c: string) => {
        setSelectedConsonant(c);
        setSelectedSyllable(null);
    };

    const handleNGNYClick = (prefix: string, syllable: string) => {
        setSelectedSyllable(syllable);
        playAudio(`${prefix}_${syllable}`);
    };

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
                            onClick={() => { setActiveTab('vokal'); setSelectedVokal(null); setSelectedSyllable(null); }}
                        >
                            🔤 Vokal
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'kv' ? styles.tabBtnActive : ''}`}
                            style={activeTab === 'kv' ? { background: 'var(--cat-blue)', borderColor: 'var(--cat-blue)' } : {}}
                            onClick={() => { setActiveTab('kv'); setSelectedVokal(null); setSelectedSyllable(null); }}
                        >
                            🅱️ Konsonan
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'ng' ? styles.tabBtnActive : ''}`}
                            style={activeTab === 'ng' ? { background: 'var(--cat-green)', borderColor: 'var(--cat-green)' } : {}}
                            onClick={() => { setActiveTab('ng'); setSelectedSyllable(null); }}
                        >
                            🌈 NG
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'ny' ? styles.tabBtnActive : ''}`}
                            style={activeTab === 'ny' ? { background: 'var(--cat-purple)', borderColor: 'var(--cat-purple)' } : {}}
                            onClick={() => { setActiveTab('ny'); setSelectedSyllable(null); }}
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
                        <p className={styles.syllableTitle}>Ketuk huruf untuk melihat kata!</p>
                        <div className={styles.vokalGrid}>
                            {VOKAL_DATA.map((item) => (
                                <div
                                    key={item.letter}
                                    className={`${styles.vokalCard} ${selectedVokal === item.letter ? styles.vokalCardActive : ''}`}
                                    onClick={() => handleVokalClick(item.letter)}
                                    style={selectedVokal === item.letter ? { borderColor: VOKAL_COLORS[item.letter], boxShadow: `8px 8px 0px ${VOKAL_COLORS[item.letter]}` } : {}}
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

                        {/* === WORD CARDS (muncul di bawah grid vokal) === */}
                        {selectedVokal && (
                            <div className={styles.wordSection} key={selectedVokal}>
                                <p className={styles.wordSectionTitle} style={{ color: VOKAL_COLORS[selectedVokal] }}>
                                    Kata berawalan huruf <span className={styles.wordSectionLetter}>{selectedVokal}</span>
                                </p>
                                <div className={styles.wordGrid}>
                                    {VOKAL_WORDS[selectedVokal]?.map((item, i) => (
                                        <div
                                            key={item.word}
                                            className={styles.wordCard}
                                            onClick={() => handleWordClick(item.word)}
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        >
                                            <div className={styles.wordCardIconWrap}>
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.word}
                                                        className={styles.wordCardImage}
                                                    />
                                                ) : (
                                                    <span className={styles.wordCardEmoji}>{item.emoji}</span>
                                                )}
                                            </div>
                                            <span className={styles.wordCardText} style={{ color: VOKAL_COLORS[selectedVokal] }}>
                                                {item.word}
                                            </span>
                                            {playingKey === `kata_${item.word.toLowerCase()}` && (
                                                <span className={styles.playingIndicator}>🔊</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                                    onClick={() => handleConsonantChange(c)}
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
                                            className={`${styles.syllableCard} ${styles[`color${i}`]} ${selectedSyllable === syllable ? styles.syllableCardActive : ''}`}
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

                            {/* === WORD CARDS (di bawah syllable grid) === */}
                            {selectedSyllable && KV_WORDS[selectedSyllable] && KV_WORDS[selectedSyllable].length > 0 && (
                                <div className={styles.wordSection} key={selectedSyllable}>
                                    <p className={styles.wordSectionTitle} style={{ color: 'var(--cat-blue)' }}>
                                        Kata dengan suku kata <span className={styles.wordSectionLetter}>"{selectedSyllable.charAt(0).toUpperCase() + selectedSyllable.slice(1)}"</span>
                                    </p>
                                    <div className={styles.wordGrid}>
                                        {KV_WORDS[selectedSyllable].map((item, i) => (
                                            <div
                                                key={item.word}
                                                className={styles.wordCard}
                                                onClick={() => handleKVWordClick(item.word)}
                                                style={{ animationDelay: `${i * 0.1}s` }}
                                            >
                                                <div className={styles.wordCardIconWrap}>
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.word}
                                                            className={styles.wordCardImage}
                                                        />
                                                    ) : (
                                                        <span className={styles.wordCardEmoji}>{item.emoji}</span>
                                                    )}
                                                </div>
                                                <span className={styles.wordCardText} style={{ color: 'var(--cat-blue)' }}>
                                                    {item.word}
                                                </span>
                                                {speakingWord === item.word && (
                                                    <span className={styles.playingIndicator}>🔊</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                        className={`${styles.syllableCard} ${styles[`color${i}`]} ${selectedSyllable === syllable ? styles.syllableCardActive : ''}`}
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

                        {/* === WORD CARDS (di bawah ng grid) === */}
                        {selectedSyllable && KHUSUS_WORDS[selectedSyllable] && KHUSUS_WORDS[selectedSyllable].length > 0 && (
                            <div className={styles.wordSection} key={selectedSyllable}>
                                <p className={styles.wordSectionTitle} style={{ color: 'var(--cat-green)' }}>
                                    Kata dengan suku kata <span className={styles.wordSectionLetter}>"{selectedSyllable.charAt(0).toUpperCase() + selectedSyllable.slice(1)}"</span>
                                </p>
                                <div className={styles.wordGrid}>
                                    {KHUSUS_WORDS[selectedSyllable].map((item, i) => (
                                        <div
                                            key={item.word}
                                            className={styles.wordCard}
                                            onClick={() => handleKVWordClick(item.word)}
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        >
                                            <div className={styles.wordCardIconWrap}>
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.word}
                                                        className={styles.wordCardImage}
                                                    />
                                                ) : (
                                                    <span className={styles.wordCardEmoji}>{item.emoji}</span>
                                                )}
                                            </div>
                                            <span className={styles.wordCardText} style={{ color: 'var(--cat-green)' }}>
                                                {item.word}
                                            </span>
                                            {speakingWord === item.word && (
                                                <span className={styles.playingIndicator}>🔊</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                                        className={`${styles.syllableCard} ${styles[`color${i}`]} ${selectedSyllable === syllable ? styles.syllableCardActive : ''}`}
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

                        {/* === WORD CARDS (di bawah ny grid) === */}
                        {selectedSyllable && KHUSUS_WORDS[selectedSyllable] && KHUSUS_WORDS[selectedSyllable].length > 0 && (
                            <div className={styles.wordSection} key={selectedSyllable}>
                                <p className={styles.wordSectionTitle} style={{ color: 'var(--cat-purple)' }}>
                                    Kata dengan suku kata <span className={styles.wordSectionLetter}>"{selectedSyllable.charAt(0).toUpperCase() + selectedSyllable.slice(1)}"</span>
                                </p>
                                <div className={styles.wordGrid}>
                                    {KHUSUS_WORDS[selectedSyllable].map((item, i) => (
                                        <div
                                            key={item.word}
                                            className={styles.wordCard}
                                            onClick={() => handleKVWordClick(item.word)}
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        >
                                            <div className={styles.wordCardIconWrap}>
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.word}
                                                        className={styles.wordCardImage}
                                                    />
                                                ) : (
                                                    <span className={styles.wordCardEmoji}>{item.emoji}</span>
                                                )}
                                            </div>
                                            <span className={styles.wordCardText} style={{ color: 'var(--cat-purple)' }}>
                                                {item.word}
                                            </span>
                                            {speakingWord === item.word && (
                                                <span className={styles.playingIndicator}>🔊</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SukuKata;

