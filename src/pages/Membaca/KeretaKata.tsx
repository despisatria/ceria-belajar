import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './KeretaKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import { shuffleArray } from '../../utils/helpers';
import confetti from 'canvas-confetti';

// ─── Types ───────────────────────────────────────────────
import { type WordEntry, POOL_1, POOL_2, POOL_3, POOL_4, POOL_5 } from '../../data/membacaWordPools';

interface WagonData {
    id: string;
    syllable: string;
    placed: boolean;   // hidden from pool once dropped into slot
    dragging: boolean;
}

const ROUND_POOL_MAP: WordEntry[][] = [
    POOL_1, POOL_1, // Round 1-2
    POOL_2, POOL_2, // Round 3-4
    POOL_3, POOL_3, // Round 5-6
    POOL_4, POOL_4, // Round 7-8
    POOL_5, POOL_5  // Round 9-10
];

// Distractor counts per round (extra wrong syllables in pool)
const DISTRACTOR_COUNTS = [
    1, 1, // Round 1-2
    1, 2, // Round 3-4
    2, 2, // Round 5-6
    2, 3, // Round 7-8
    3, 3  // Round 9-10
];

// All possible distractor syllables
const ALL_SYLLABLES = ['ma', 'ri', 'lo', 'pe', 'tu', 'si', 'ga', 'na', 'ki', 'wo', 'pu', 'de', 'fo', 'le', 'bi'];

const TOTAL_ROUNDS = 10;



function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Component ───────────────────────────────────────────

const WagonArt = () => (
    <div className={styles.cssWagon}>
        <div className={styles.wagonBody}></div>
        <div className={`${styles.wagonWheel} ${styles.wagonWheelLeft}`}></div>
        <div className={`${styles.wagonWheel} ${styles.wagonWheelRight}`}></div>
        <div className={styles.wagonConnector}></div>
    </div>
);

const KeretaKata: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
    const [wagons, setWagons] = useState<WagonData[]>([]);
    const [slots, setSlots] = useState<(string | null)[]>([]); // syllable in each slot
    const [slotWagonIds, setSlotWagonIds] = useState<(string | null)[]>([]); // which wagon is in each slot

    const [wrongSlots, setWrongSlots] = useState<number[]>([]);
    const [isDeparting, setIsDeparting] = useState(false);
    const transitionRef = useRef(false);

    // ── Generate a round ──
    const generateRound = useCallback((r: number, used: Set<string>) => {
        transitionRef.current = false;
        const pool = ROUND_POOL_MAP[r - 1];
        const available = pool.filter(w => !used.has(w.word));
        const wordEntry = pickRandom(available.length > 0 ? available : pool);

        setCurrentWord(wordEntry);
        setUsedWords(prev => new Set(prev).add(wordEntry.word));

        // Build wagon pool: correct syllables + distractors
        const distractorCount = DISTRACTOR_COUNTS[r - 1];
        const distractors = shuffleArray(
            ALL_SYLLABLES.filter(s => !wordEntry.syllables.includes(s))
        ).slice(0, distractorCount);

        const allSyllables = shuffleArray([...wordEntry.syllables, ...distractors]);
        const newWagons: WagonData[] = allSyllables.map((syl, i) => ({
            id: `w-${r}-${i}-${syl}`,
            syllable: syl,
            placed: false,
            dragging: false,
        }));

        setWagons(newWagons);
        setSlots(new Array(wordEntry.syllables.length).fill(null));
        setSlotWagonIds(new Array(wordEntry.syllables.length).fill(null));
        setWrongSlots([]);
        setIsDeparting(false);
    }, []);

    // ── Init & round change ──
    useEffect(() => {
        if (!gameOver) {
            generateRound(round, usedWords);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [round, gameOver]);

    const playInstruction = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance('Susun gerbong suku kata agar membentuk kata yang benar!');
            u.lang = 'id-ID';
            u.rate = 0.9;
            window.speechSynthesis.speak(u);
        }
    };

    // ── Instruction audio on load ──
    useEffect(() => {
        playInstruction();
    }, []);

    // ── Check answer when all slots filled ──
    useEffect(() => {
        if (!currentWord) return;
        const allFilled = slots.length > 0 && slots.every(s => s !== null);
        if (!allFilled) return;
        if (transitionRef.current) return;

        const formed = slots.join('').toLowerCase();
        const correct = currentWord.word.toLowerCase();

        if (formed === correct) {
            transitionRef.current = true;
            playCorrectSound();
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#10B981', '#34D399', '#FCD34D', '#60A5FA'] });

            // Train departs
            setTimeout(() => setIsDeparting(true), 300);

            setTimeout(() => {
                const nextRound = round + 1;
                if (nextRound > TOTAL_ROUNDS) {
                    playWinSound();
                    setGameOver(true);
                } else {
                    setRound(nextRound);
                    setScore(prev => prev + 10);
                }
            }, 1600);
        } else {
            playWrongSound();
            setWrongSlots(slots.map((_, i) => i));
            setLives(prev => {
                const next = prev - 1;
                if (next <= 0) setTimeout(() => setGameOver(true), 800);
                return next;
            });
            // Return all wagons to pool
            setTimeout(() => {
                setWagons(prev => prev.map(w => ({ ...w, placed: false })));
                setSlots(new Array(currentWord.syllables.length).fill(null));
                setSlotWagonIds(new Array(currentWord.syllables.length).fill(null));
                setWrongSlots([]);
            }, 600);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slots]);

    // ── Drag handlers ──
    const handleDragStart = (e: React.DragEvent, wagonId: string) => {
        e.dataTransfer.setData('wagonId', wagonId);
        e.dataTransfer.effectAllowed = 'move';
        setWagons(prev => prev.map(w => w.id === wagonId ? { ...w, dragging: true } : w));
    };

    const handleDragEnd = () => {
        setWagons(prev => prev.map(w => ({ ...w, dragging: false })));
    };

    const handleDropOnSlot = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        const wagonId = e.dataTransfer.getData('wagonId');
        if (!wagonId) return;
        placeWagonIntoSlot(wagonId, slotIndex);
    };

    const handleSlotClick = (slotIndex: number) => {
        // Click on filled slot → return wagon to pool
        const wagonId = slotWagonIds[slotIndex];
        if (!wagonId) return;
        setWagons(prev => prev.map(w => w.id === wagonId ? { ...w, placed: false } : w));
        setSlots(prev => { const n = [...prev]; n[slotIndex] = null; return n; });
        setSlotWagonIds(prev => { const n = [...prev]; n[slotIndex] = null; return n; });
        setWrongSlots([]);
    };

    const handleWagonClick = (wagon: WagonData) => {
        if (wagon.placed) return;
        // Auto-place into first empty slot
        const firstEmpty = slots.findIndex(s => s === null);
        if (firstEmpty === -1) return;
        placeWagonIntoSlot(wagon.id, firstEmpty);
    };

    const placeWagonIntoSlot = (wagonId: string, slotIndex: number) => {
        const wagon = wagons.find(w => w.id === wagonId);
        if (!wagon || wagon.placed) return;

        // If slot already occupied, return old wagon to pool
        const prevWagonId = slotWagonIds[slotIndex];
        if (prevWagonId) {
            setWagons(prev => prev.map(w => w.id === prevWagonId ? { ...w, placed: false, dragging: false } : w));
        }

        setWagons(prev => prev.map(w => w.id === wagonId ? { ...w, placed: true, dragging: false } : w));
        setSlots(prev => { const n = [...prev]; n[slotIndex] = wagon.syllable; return n; });
        setSlotWagonIds(prev => { const n = [...prev]; n[slotIndex] = wagonId; return n; });
        setWrongSlots([]);
    };

    const handleReset = () => {
        if (!currentWord) return;
        setWagons(prev => prev.map(w => ({ ...w, placed: false, dragging: false })));
        setSlots(new Array(currentWord.syllables.length).fill(null));
        setSlotWagonIds(new Array(currentWord.syllables.length).fill(null));
        setWrongSlots([]);
        transitionRef.current = false;
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
        setUsedWords(new Set());
    };

    // ── Render ──
    return (
        <div className={styles.gameContainer}>
            {/* ── Header ── */}
            <GameHeader
                menuLink="/membaca"
                themeColor="var(--cat-green)"
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={TOTAL_ROUNDS}
            >
                <h2 className={styles.gameTitle}>Kereta Kata! 🚂</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Susun gerbong suku kata agar membentuk kata yang benar!
                </p>
            </GameHeader>

            {/* ── Main ── */}
            <main className={styles.playArea}>
                <div className={styles.sky}>
                    {/* Sun */}
                    <div className={styles.sun}>☀️</div>
                    
                    {/* Clouds */}
                    <div className={`${styles.cloud} ${styles.cloud1}`}>☁️</div>
                    <div className={`${styles.cloud} ${styles.cloud2}`}>☁️</div>
                    <div className={`${styles.cloud} ${styles.cloud3}`}>☁️</div>
                    <div className={`${styles.cloud} ${styles.cloud4}`}>☁️</div>
                    <div className={`${styles.cloud} ${styles.cloud5}`}>☁️</div>
                    <div className={`${styles.cloud} ${styles.cloud6}`}>☁️</div>
                </div>

                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/membaca"
                        themeColor="var(--cat-green)"
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                    />
                ) : (
                    <>
                        {/* Target emoji */}
                        <div className={styles.targetArea}>
                            <p className={styles.targetLabel}>Kata apakah ini?</p>
                            <div className={styles.targetEmojiBox}>
                                {currentWord?.emoji}
                            </div>
                        </div>

                        {/* Train track with locomotive + drop slots */}
                        <div className={styles.trainTrack}>
                            {/* Wrapper that moves the train only */}
                            <div className={`${styles.trainWrapper} ${isDeparting ? styles.departing : ''}`}>
                                {/* Locomotive at the Left (Front) */}
                                <div className={styles.locomotive}>
                                    <div className={styles.locoCab}>
                                        <div className={styles.locoWindow}></div>
                                    </div>
                                    <div className={styles.locoBoiler}></div>
                                    <div className={styles.locoBand}></div>
                                    <div className={styles.locoFunnel}></div>
                                    <div className={styles.locoFunnelTop}></div>
                                    <div className={styles.locoCowcatcher}></div>
                                    <div className={`${styles.locoWheel} ${styles.locoWheel1}`}></div>
                                    <div className={`${styles.locoWheel} ${styles.locoWheel2}`}></div>
                                    <div className={`${styles.locoWheel} ${styles.locoWheel3}`}></div>
                                    <div className={styles.locoRod}></div>
                                </div>

                                {/* Slots */}
                                <div className={styles.slotZone}>
                                    {slots.map((syllable, i) => (
                                        <div
                                            key={i}
                                            className={`${styles.slot} ${wrongSlots.includes(i) ? styles.wrong : ''} ${syllable ? styles.correct : ''}`}
                                            onDragOver={e => e.preventDefault()}
                                            onDrop={e => handleDropOnSlot(e, i)}
                                            onClick={() => handleSlotClick(i)}
                                        >
                                            {syllable ? (
                                                <>
                                                    <WagonArt />
                                                    <span className={styles.slotText}>{syllable}</span>
                                                </>
                                            ) : (
                                                <div className={styles.slotEmpty}>+</div>
                                            )}
                                        </div>
                                    ))}
                                </div>


                            </div>
                        </div>

                        {/* Wagon pool */}
                        <div className={styles.wagonPool}>
                            {wagons.map(wagon => (
                                <div
                                    key={wagon.id}
                                    className={`${styles.wagon} ${wagon.placed ? styles.placed : ''} ${wagon.dragging ? styles.dragging : ''}`}
                                    draggable={!wagon.placed}
                                    onDragStart={e => handleDragStart(e, wagon.id)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => handleWagonClick(wagon)}
                                    style={{ animationDelay: `${wagons.indexOf(wagon) * 0.07}s` }}
                                >
                                    <WagonArt />
                                    <span className={styles.wagonText}>{wagon.syllable}</span>
                                </div>
                            ))}
                        </div>

                        {/* Reset button */}
                        <button className={styles.resetBtn} onClick={handleReset}>
                            🔄 Reset Gerbong
                        </button>
                    </>
                )}
            </main>

            {/* Instruction Sound Button */}
            {!gameOver && (
                <button
                    onClick={playInstruction}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--cat-green)',
                        color: 'white',
                        border: '4px solid var(--text-color)',
                        boxShadow: '4px 4px 0px var(--text-color)',
                        fontSize: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 100,
                    }}
                >
                    🔊
                </button>
            )}
        </div>
    );
};

export default KeretaKata;
