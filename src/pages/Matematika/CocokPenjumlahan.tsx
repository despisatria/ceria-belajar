import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Membaca/TebakKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import LivesDisplay from '../../components/LivesDisplay';
import confetti from 'canvas-confetti';

const TOTAL_ROUNDS = 5;
const ITEMS_PER_ROUND = 4;

interface QuestionItem {
    id: string;
    text: string;
    answer: number;
}

interface AnswerItem {
    id: string;
    value: number;
}

interface MatchPair {
    leftIndex: number;
    rightIndex: number;
}

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const CocokPenjumlahan: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);

    const [questions, setQuestions] = useState<QuestionItem[]>([]);
    const [answers, setAnswers] = useState<AnswerItem[]>([]);

    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<MatchPair[]>([]);
    const [wrongRightId, setWrongRightId] = useState<number | null>(null);
    const [correctFlash, setCorrectFlash] = useState<number | null>(null);

    const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#FCD34D', '#10B981']
        });
    }, []);

    const generateRound = useCallback(() => {
        setSelectedLeft(null);
        setMatchedPairs([]);
        setWrongRightId(null);
        setCorrectFlash(null);

        const newQuestions: QuestionItem[] = [];
        const usedAnswers = new Set<number>();

        while (newQuestions.length < ITEMS_PER_ROUND) {
            const targetSum = Math.floor(Math.random() * 9) + 2;
            if (!usedAnswers.has(targetSum)) {
                usedAnswers.add(targetSum);
                const n1 = Math.floor(Math.random() * (targetSum - 1)) + 1;
                const n2 = targetSum - n1;

                newQuestions.push({
                    id: `q-${newQuestions.length}`,
                    text: `${n1} + ${n2}`,
                    answer: targetSum,
                });
            }
        }

        const newAnswers: AnswerItem[] = newQuestions.map((q, i) => ({
            id: `a-${i}`,
            value: q.answer
        }));

        setQuestions(newQuestions);
        setAnswers(shuffleArray(newAnswers));
    }, []);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver, generateRound]);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Pilih soal di kiri, lalu pilih jawaban yang benar di kanan!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const getLineCoords = useCallback((leftIdx: number, rightIdx: number) => {
        const container = containerRef.current;
        const leftEl = leftRefs.current[leftIdx];
        const rightEl = rightRefs.current[rightIdx];
        if (!container || !leftEl || !rightEl) return null;

        const containerRect = container.getBoundingClientRect();
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        return {
            x1: leftRect.right - containerRect.left,
            y1: leftRect.top + leftRect.height / 2 - containerRect.top,
            x2: rightRect.left - containerRect.left,
            y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        };
    }, []);

    const handleLeftClick = (index: number) => {
        if (matchedPairs.some(p => p.leftIndex === index)) return;
        setSelectedLeft(index);
        setWrongRightId(null);
    };

    const handleRightClick = (index: number) => {
        if (selectedLeft === null) return;
        if (matchedPairs.some(p => p.rightIndex === index)) return;

        const q = questions[selectedLeft];
        const a = answers[index];

        if (q.answer === a.value) {
            playCorrectSound();
            setCorrectFlash(index);
            const newPairs = [...matchedPairs, { leftIndex: selectedLeft, rightIndex: index }];
            setMatchedPairs(newPairs);
            setScore(prev => prev + 10);
            setSelectedLeft(null);
            setTimeout(() => setCorrectFlash(null), 600);

            if (newPairs.length === ITEMS_PER_ROUND) {
                setTimeout(() => {
                    triggerConfetti();
                    setTimeout(() => {
                        const nextRound = round + 1;
                        if (nextRound > TOTAL_ROUNDS) {
                            playWinSound();
                            setGameOver(true);
                        } else {
                            setRound(nextRound);
                        }
                    }, 2000);
                }, 500);
            }
        } else {
            playWrongSound();
            setWrongRightId(index);
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setTimeout(() => setGameOver(true), 500);
                }
                return newLives;
            });
            setTimeout(() => {
                setSelectedLeft(null);
                setWrongRightId(null);
            }, 800);
        }
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
    };

    // Shared card style
    const getCardStyle = (isMatched: boolean, isSelected: boolean, isWrong: boolean, isCorrectFlash: boolean, isReady: boolean): React.CSSProperties => ({
        height: '90px',
        borderRadius: '14px',
        border: isWrong
            ? '3px solid #EF4444'
            : isCorrectFlash
                ? '3px solid #10B981'
                : isSelected
                    ? '3px solid #3B82F6'
                    : isMatched
                        ? '3px solid #93C5FD'
                        : '3px dashed #CBD5E1',
        background: isWrong
            ? '#FEE2E2'
            : isCorrectFlash
                ? '#D1FAE5'
                : isSelected
                    ? '#DBEAFE'
                    : isMatched
                        ? '#EFF6FF'
                        : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        fontSize: 'clamp(1.4rem, 5vw, 2rem)',
        fontWeight: 900,
        color: isWrong
            ? '#DC2626'
            : isCorrectFlash
                ? '#059669'
                : isSelected
                    ? '#1D4ED8'
                    : isMatched
                        ? '#3B82F6'
                        : '#1E293B',
        cursor: isMatched ? 'default' : 'pointer',
        transition: 'all 0.15s ease',
        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
        opacity: isMatched ? 0.55 : 1,
        position: 'relative' as const,
        animation: isWrong ? 'cocok-shake 0.4s ease-in-out' : isReady ? 'cocok-pulse 2s ease-in-out infinite' : 'none',
        boxShadow: isSelected ? '0 0 0 3px rgba(59,130,246,0.25)' : 'none',
        letterSpacing: '1px',
    });

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader} style={{ borderBottomColor: 'var(--cat-blue)' }}>
                <div className={styles.headerTop}>
                    <Link to="/matematika" className="btn" style={{
                        backgroundColor: 'var(--cat-blue)',
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
                            <span className={styles.statValue} style={{ color: 'var(--cat-blue)' }}>{score}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Putaran</span>
                            <span className={styles.statValue} style={{ color: 'var(--cat-blue)' }}>{Math.min(round, TOTAL_ROUNDS)}/5</span>
                        </div>
                    </div>
                </div>
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-blue)' }}>Cocokkan Penjumlahan 🔗</h2>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {selectedLeft !== null
                        ? '👉 Sekarang pilih jawaban di sebelah kanan!'
                        : '👈 Pilih soal di sebelah kiri dulu!'}
                </p>
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverCard}>
                        {lives > 0 ? (
                            <>
                                <h2>🎉 Luar Biasa! 🎉</h2>
                                <p>Kamu berhasil mencocokkan semua angka!</p>
                            </>
                        ) : (
                            <>
                                <h2>💔 Kesempatan Habis! 💔</h2>
                                <p>Jangan menyerah, ayo coba lagi!</p>
                            </>
                        )}
                        <div className={styles.finalScore}>Skor Akhir: {score}</div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn" onClick={handleRestart} style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--cat-blue)' }}>
                                🔄 Main Lagi
                            </button>
                            <Link to="/matematika" className="btn" style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}>
                                ⬅️ Menu Utama
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div ref={containerRef} style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        width: '100%',
                        gap: '12%',
                    }}>
                        {/* SVG Overlay for arrows */}
                        <svg style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 10,
                            overflow: 'visible'
                        }}>
                            <defs></defs>
                            {matchedPairs.map((pair, idx) => {
                                const coords = getLineCoords(pair.leftIndex, pair.rightIndex);
                                if (!coords) return null;
                                const lineLen = Math.sqrt(
                                    Math.pow(coords.x2 - coords.x1, 2) + Math.pow(coords.y2 - coords.y1, 2)
                                );
                                return (
                                    <line
                                        key={`line-${idx}`}
                                        x1={coords.x1}
                                        y1={coords.y1}
                                        x2={coords.x2}
                                        y2={coords.y2}
                                        stroke="#10B981"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        style={{
                                            filter: 'drop-shadow(0px 1px 2px rgba(16,185,129,0.3))',
                                            strokeDasharray: lineLen,
                                            strokeDashoffset: lineLen,
                                            animation: 'cocok-draw-line 0.6s ease-out forwards',
                                        }}
                                    />
                                );
                            })}
                        </svg>

                        {/* LEFT CONTAINER — Soal */}
                        <div style={{
                            width: '40%',
                            background: 'white',
                            borderRadius: '24px',
                            border: '4px solid #1E293B',
                            padding: '20px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '28px',
                        }}>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                color: 'var(--cat-blue)',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                            }}>📝 Soal</div>
                            {questions.map((q, idx) => {
                                const isMatched = matchedPairs.some(p => p.leftIndex === idx);
                                const isSelected = selectedLeft === idx;
                                const style = getCardStyle(isMatched, isSelected, false, false, false);

                                return (
                                    <button
                                        key={q.id}
                                        ref={el => { leftRefs.current[idx] = el; }}
                                        onClick={() => handleLeftClick(idx)}
                                        disabled={isMatched}
                                        style={style}
                                    >
                                        {q.text}
                                        {isMatched && <span style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '1rem' }}>✅</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* RIGHT CONTAINER — Jawaban */}
                        <div style={{
                            width: '40%',
                            background: 'white',
                            borderRadius: '24px',
                            border: '4px solid #1E293B',
                            padding: '20px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '28px',
                        }}>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                color: 'var(--cat-orange)',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                            }}>🎯 Jawaban</div>
                            {answers.map((a, idx) => {
                                const isMatched = matchedPairs.some(p => p.rightIndex === idx);
                                const isWrong = wrongRightId === idx;
                                const isFlash = correctFlash === idx;
                                const isReady = selectedLeft !== null && !isMatched;
                                const style = getCardStyle(isMatched, false, isWrong, isFlash, isReady);

                                return (
                                    <button
                                        key={a.id}
                                        ref={el => { rightRefs.current[idx] = el; }}
                                        onClick={() => handleRightClick(idx)}
                                        disabled={isMatched || selectedLeft === null}
                                        style={{
                                            ...style,
                                            cursor: isMatched ? 'default' : (selectedLeft !== null ? 'pointer' : 'default'),
                                            opacity: isMatched ? 0.55 : (selectedLeft === null && !isMatched ? 0.7 : 1),
                                        }}
                                    >
                                        {a.value}
                                        {isMatched && <span style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '1rem' }}>✅</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes cocok-shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-8px); }
                    40%, 80% { transform: translateX(8px); }
                }
                @keyframes cocok-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                }
                @keyframes cocok-draw-line {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
};

export default CocokPenjumlahan;
