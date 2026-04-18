import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './SusunSukuKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';
import confetti from 'canvas-confetti';

interface WordEntry {
    word: string;
    syllables: string[];
    emoji: string;
}

// === WORD POOLS WITH SYLLABLE DATA (from MembacaKata + MembacaKata3) ===

// Pool 1: 2 suku kata KV+KV
const POOL_1: WordEntry[] = [
    { word: 'baju', syllables: ['ba', 'ju'], emoji: '👕' },
    { word: 'bola', syllables: ['bo', 'la'], emoji: '⚽' },
    { word: 'buku', syllables: ['bu', 'ku'], emoji: '📚' },
    { word: 'kuda', syllables: ['ku', 'da'], emoji: '🐴' },
    { word: 'nasi', syllables: ['na', 'si'], emoji: '🍚' },
    { word: 'roti', syllables: ['ro', 'ti'], emoji: '🍞' },
    { word: 'sapi', syllables: ['sa', 'pi'], emoji: '🐮' },
    { word: 'susu', syllables: ['su', 'su'], emoji: '🥛' },
    { word: 'topi', syllables: ['to', 'pi'], emoji: '🧢' },
];

// Pool 2: 2 suku kata 5 huruf
const POOL_2: WordEntry[] = [
    { word: 'ayam', syllables: ['a', 'yam'], emoji: '🐔' },
    { word: 'balon', syllables: ['ba', 'lon'], emoji: '🎈' },
    { word: 'ikan', syllables: ['i', 'kan'], emoji: '🐟' },
    { word: 'kapal', syllables: ['ka', 'pal'], emoji: '🚢' },
    { word: 'rumah', syllables: ['ru', 'mah'], emoji: '🏠' },
    { word: 'telur', syllables: ['te', 'lur'], emoji: '🥚' },
];

// Pool 3: 2 suku kata NG/NY
const POOL_3: WordEntry[] = [
    { word: 'bunga', syllables: ['bu', 'nga'], emoji: '🌸' },
    { word: 'singa', syllables: ['si', 'nga'], emoji: '🦁' },
    { word: 'payung', syllables: ['pa', 'yung'], emoji: '☂️' },
    { word: 'nyanyi', syllables: ['nya', 'nyi'], emoji: '🎤' },
    { word: 'pisang', syllables: ['pi', 'sang'], emoji: '🍌' },
];

// Pool 4: 3 suku kata terbuka (KV+KV+KV)
const POOL_4: WordEntry[] = [
    { word: 'sepatu', syllables: ['se', 'pa', 'tu'], emoji: '👟' },
    { word: 'celana', syllables: ['ce', 'la', 'na'], emoji: '👖' },
    { word: 'boneka', syllables: ['bo', 'ne', 'ka'], emoji: '🧸' },
    { word: 'gurita', syllables: ['gu', 'ri', 'ta'], emoji: '🐙' },
    { word: 'sepeda', syllables: ['se', 'pe', 'da'], emoji: '🚲' },
    { word: 'kelapa', syllables: ['ke', 'la', 'pa'], emoji: '🥥' },
    { word: 'kamera', syllables: ['ka', 'me', 'ra'], emoji: '📷' },
    { word: 'kereta', syllables: ['ke', 're', 'ta'], emoji: '🚂' },
];

// Pool 5: 3 suku kata campuran
const POOL_5: WordEntry[] = [
    { word: 'jerapah', syllables: ['je', 'ra', 'pah'], emoji: '🦒' },
    { word: 'kelinci', syllables: ['ke', 'lin', 'ci'], emoji: '🐰' },
    { word: 'pesawat', syllables: ['pe', 'sa', 'wat'], emoji: '✈️' },
    { word: 'harimau', syllables: ['ha', 'ri', 'mau'], emoji: '🐯' },
    { word: 'semangka', syllables: ['se', 'mang', 'ka'], emoji: '🍉' },
];

// Round → pool mapping (10 rounds, progressively harder)
const ROUND_POOL_MAP: WordEntry[][] = [
    POOL_1,  // Round 1
    POOL_1,  // Round 2
    POOL_2,  // Round 3
    POOL_2,  // Round 4
    POOL_3,  // Round 5
    POOL_3,  // Round 6
    POOL_4,  // Round 7
    POOL_4,  // Round 8
    POOL_5,  // Round 9
    POOL_5,  // Round 10
];

const TOTAL_ROUNDS = 10;
const SYLLABLE_COLORS = ['', styles.syllableBtnColor2, styles.syllableBtnColor3, styles.syllableBtnColor4];

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const SusunSukuKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [currentWord, setCurrentWord] = useState<WordEntry>(POOL_1[0]);
    const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [resultState, setResultState] = useState<'none' | 'correct' | 'wrong'>('none');
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
        });
    }, []);

    const generateRound = useCallback(() => {
        setSelectedIndices([]);
        setResultState('none');

        const pool = ROUND_POOL_MAP[round - 1];
        const available = pool.filter(w => !usedWords.has(w.word));
        const candidates = available.length > 0 ? available : pool;

        const word = shuffleArray(candidates)[0];
        setCurrentWord(word);
        setUsedWords(prev => new Set(prev).add(word.word));

        // We want exactly 4 options total
        const correctSyllables = word.syllables;
        const neededDistractors = 4 - correctSyllables.length;

        // Get distractors from other words in the same pool
        const otherWords = pool.filter(w => w.word !== word.word);
        const distractorPool = otherWords.flatMap(w => w.syllables);

        let selectedDistractors: string[] = [];
        if (neededDistractors > 0) {
            // Filter to get unique syllables not already in the correct word
            const uniqueDistractors = Array.from(new Set(distractorPool)).filter(syl => !correctSyllables.includes(syl));
            selectedDistractors = shuffleArray(uniqueDistractors).slice(0, neededDistractors);
        }

        // Combine and shuffle
        const allOptions = [...correctSyllables, ...selectedDistractors];
        setShuffledSyllables(shuffleArray(allOptions));
    }, [round, usedWords]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver]);

    // Speak instruction on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Susun suku kata menjadi kata yang benar!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const handleSyllableTap = (shuffledIndex: number) => {
        if (resultState !== 'none') return;

        // Allow unclicking
        if (selectedIndices.includes(shuffledIndex)) {
            setSelectedIndices(selectedIndices.filter(i => i !== shuffledIndex));
            return;
        }

        // Limit selection to the required word length
        if (selectedIndices.length >= currentWord.syllables.length) return;

        const newSelected = [...selectedIndices, shuffledIndex];
        setSelectedIndices(newSelected);
    };

    const handleSubmit = () => {
        if (selectedIndices.length !== currentWord.syllables.length || resultState !== 'none') return;

        // Build the answer from the order selected
        const answer = selectedIndices.map(i => shuffledSyllables[i]);
        const isCorrect = answer.every((syl, idx) => syl === currentWord.syllables[idx]);

        if (isCorrect) {
            setResultState('correct');
            playCorrectSound();
            triggerConfetti();
            setScore(prev => prev + 10);

            setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound > TOTAL_ROUNDS) {
                    playWinSound();
                    setGameOver(true);
                } else {
                    setRound(nextRound);
                }
            }, 1500);
        } else {
            setResultState('wrong');
            playWrongSound();

            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });

            // Reset after shake animation
            setTimeout(() => {
                setSelectedIndices([]);
                setResultState('none');
            }, 1000);
        }
    };



    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
        setUsedWords(new Set());
    };

    // Build answer display
    const answerSlots = currentWord.syllables.map((_, idx) => {
        if (idx < selectedIndices.length) {
            return shuffledSyllables[selectedIndices[idx]];
        }
        return null;
    });

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader} style={{ borderBottomColor: 'var(--cat-purple)' }}>
                <div className={styles.headerTop}>
                    <Link to="/membaca" className="btn" style={{
                        backgroundColor: 'var(--cat-purple)',
                        textTransform: 'none',
                        fontSize: '1rem',
                        padding: '8px 16px'
                    }}>
                        ⬅️ Kembali
                    </Link>
                    <div className={styles.statsPanel}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nyawa</span>
                            <LivesDisplay lives={lives} />
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Nilai</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-purple)' }}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Putaran</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-purple)' }}>{Math.min(round, TOTAL_ROUNDS)}/5</span>
                        </div>
                    </div>
                </div>
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-purple)' }}>Susun Suku Kata! 🧩</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Susun suku kata yang acak menjadi kata yang sesuai gambar
                </p>
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverCard}>
                        {lives > 0 ? (
                            <>
                                <h2>🎉 Luar Biasa! 🎉</h2>
                                <p>Kamu berhasil menyelesaikan permainan ini!</p>
                            </>
                        ) : (
                            <>
                                <h2>💔 Kesempatan Habis! 💔</h2>
                                <p>Jangan menyerah, ayo coba lagi!</p>
                            </>
                        )}
                        <div className={styles.finalScore}>Skor Akhir: {score}</div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn" onClick={handleRestart} style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--cat-purple)' }}>
                                🔄 Main Lagi
                            </button>
                            <Link to="/membaca" className="btn" style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}>
                                ⬅️ Menu Utama
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.questionText}>Susun kata untuk: </h2>

                        <div className={styles.emojiCard}>
                            <span key={round} className={styles.emojiLarge}>{currentWord.emoji}</span>
                        </div>

                        {/* Answer Slots */}
                        <div className={`${styles.slotsSection} ${resultState === 'correct' ? styles.resultCorrect : ''} ${resultState === 'wrong' ? styles.resultWrong : ''}`}>
                            <div className={styles.slotsLabel}>Jawabanmu:</div>
                            <div className={styles.slotsRow}>
                                {answerSlots.map((syl, idx) => (
                                    <div key={idx} className={`${styles.slot} ${syl ? styles.slotFilled : ''}`}>
                                        {syl && <span className={styles.slotText}>{syl}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Syllable Options */}
                        <div className={styles.optionsSection}>
                            <div className={styles.optionsLabel}>Ketuk suku kata sesuai urutan:</div>
                            <div className={styles.optionsRow}>
                                {shuffledSyllables.map((syl, idx) => {
                                    const isUsed = selectedIndices.includes(idx);
                                    const colorClass = SYLLABLE_COLORS[idx % SYLLABLE_COLORS.length];
                                    return (
                                        <button
                                            key={idx}
                                            className={`${styles.syllableBtn} ${colorClass} ${isUsed ? styles.syllableBtnUsed : ''}`}
                                            onClick={() => handleSyllableTap(idx)}
                                            disabled={resultState !== 'none'}
                                        >
                                            {syl}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {selectedIndices.length === currentWord.syllables.length && resultState === 'none' && (
                                <button
                                    className="btn"
                                    onClick={handleSubmit}
                                    style={{ backgroundColor: 'var(--cat-green)', padding: '10px 24px', fontSize: '1.2rem', margin: 0, textTransform: 'none' }}
                                >
                                    ✅ Cek Jawaban
                                </button>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default SusunSukuKata;
