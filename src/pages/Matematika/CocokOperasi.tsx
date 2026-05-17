import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../Membaca/TebakKata.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import GameOverScreen from '../../components/GameOverScreen';
import GameHeader from '../../components/GameHeader';
import { shuffleArray } from '../../utils/helpers';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
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

// ─── Theme configs for each operator ────────────────────

interface OperatorTheme {
    themeColor: string;
    title: string;
    /** Colors for selected/matched card borders & backgrounds */
    selectedBorder: string;
    selectedBg: string;
    matchedBorder: string;
    matchedBg: string;
    selectedText: string;
    matchedText: string;
    boxShadowColor: string;
    confettiColors: string[];
    /** "Soal" header color */
    soalColor: string;
    /** "Jawaban" header color */
    jawabanColor: string;
}

const ADDITION_THEME: OperatorTheme = {
    themeColor: 'var(--cat-blue)',
    title: 'Cocokkan Penjumlahan 🔗',
    selectedBorder: '#3B82F6',
    selectedBg: '#DBEAFE',
    matchedBorder: '#93C5FD',
    matchedBg: '#EFF6FF',
    selectedText: '#1D4ED8',
    matchedText: '#3B82F6',
    boxShadowColor: 'rgba(59,130,246,0.25)',
    confettiColors: ['#3B82F6', '#60A5FA', '#93C5FD', '#FCD34D', '#10B981'],
    soalColor: 'var(--cat-blue)',
    jawabanColor: 'var(--cat-orange)',
};

const SUBTRACTION_THEME: OperatorTheme = {
    themeColor: 'var(--cat-orange)',
    title: 'Cocokkan Pengurangan 🔗',
    selectedBorder: '#F97316',
    selectedBg: '#FFF7ED',
    matchedBorder: '#FDBA74',
    matchedBg: '#FFF7ED',
    selectedText: '#C2410C',
    matchedText: '#F97316',
    boxShadowColor: 'rgba(249,115,22,0.25)',
    confettiColors: ['#F97316', '#FB923C', '#FDBA74', '#FCD34D', '#10B981'],
    soalColor: 'var(--cat-orange)',
    jawabanColor: 'var(--cat-red)',
};

// ─── Question generators ────────────────────────────────

function generateAdditionQuestions(): QuestionItem[] {
    const questions: QuestionItem[] = [];
    const usedAnswers = new Set<number>();

    while (questions.length < ITEMS_PER_ROUND) {
        const targetSum = Math.floor(Math.random() * 9) + 2;
        if (!usedAnswers.has(targetSum)) {
            usedAnswers.add(targetSum);
            const n1 = Math.floor(Math.random() * (targetSum - 1)) + 1;
            const n2 = targetSum - n1;
            questions.push({
                id: `q-${questions.length}`,
                text: `${n1} + ${n2}`,
                answer: targetSum,
            });
        }
    }
    return questions;
}

function generateSubtractionQuestions(): QuestionItem[] {
    const questions: QuestionItem[] = [];
    const usedAnswers = new Set<number>();

    while (questions.length < ITEMS_PER_ROUND) {
        const targetDiff = Math.floor(Math.random() * 9);
        if (!usedAnswers.has(targetDiff)) {
            usedAnswers.add(targetDiff);
            const minN1 = targetDiff + 1;
            const maxN1 = 10;

            if (minN1 <= maxN1) {
                const n1 = Math.floor(Math.random() * (maxN1 - minN1 + 1)) + minN1;
                const n2 = n1 - targetDiff;
                questions.push({
                    id: `q-${questions.length}`,
                    text: `${n1} - ${n2}`,
                    answer: targetDiff,
                });
            } else {
                usedAnswers.delete(targetDiff);
            }
        }
    }
    return questions;
}

// ─── Component ──────────────────────────────────────────

interface CocokOperasiProps {
    operator: '+' | '-';
}

const CocokOperasi: React.FC<CocokOperasiProps> = ({ operator }) => {
    const theme = operator === '+' ? ADDITION_THEME : SUBTRACTION_THEME;
    const generateQuestions = operator === '+' ? generateAdditionQuestions : generateSubtractionQuestions;

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
            colors: theme.confettiColors
        });
    }, [theme.confettiColors]);

    const generateRound = useCallback(() => {
        setSelectedLeft(null);
        setMatchedPairs([]);
        setWrongRightId(null);
        setCorrectFlash(null);

        const newQuestions = generateQuestions();
        const newAnswers: AnswerItem[] = newQuestions.map((q, i) => ({
            id: `a-${i}`,
            value: q.answer
        }));

        setQuestions(newQuestions);
        setAnswers(shuffleArray(newAnswers));
    }, [generateQuestions]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            generateRound();
        }
    }, [round, gameOver, generateRound]);

    // Redraw lines on window resize (e.g. device rotation)
    const [, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useSpeakOnMount("Pilih soal di kiri, lalu pilih jawaban yang benar di kanan!");

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
        borderRadius: '20px', // Bubbly corners
        border: isWrong
            ? '3px solid #EF4444'
            : isCorrectFlash
                ? '3px solid #10B981'
                : isSelected
                    ? `3px solid ${theme.selectedBorder}`
                    : isMatched
                        ? `3px solid ${theme.matchedBorder}`
                        : '3px dashed #CBD5E1',
        background: isWrong
            ? '#FEE2E2'
            : isCorrectFlash
                ? '#D1FAE5'
                : isSelected
                    ? theme.selectedBg
                    : isMatched
                        ? theme.matchedBg
                        : '#F8FAFC', // Slightly colored instead of pure white
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        fontSize: 'clamp(1.4rem, 4vw, 2rem)',
        fontWeight: 900,
        color: isWrong
            ? '#DC2626'
            : isCorrectFlash
                ? '#059669'
                : isSelected
                    ? theme.selectedText
                    : isMatched
                        ? theme.matchedText
                        : '#334155',
        cursor: isMatched ? 'default' : 'pointer',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isSelected ? 'scale(1.05) translateY(-2px)' : isMatched ? 'scale(0.95)' : 'scale(1)',
        opacity: isMatched ? 0.55 : 1,
        position: 'relative' as const,
        animation: isWrong ? 'cocok-shake 0.4s ease-in-out' : isReady ? 'cocok-pulse 2s ease-in-out infinite' : 'none',
        boxShadow: isSelected 
            ? `0 0 0 4px ${theme.boxShadowColor}, 0 6px 0 ${theme.selectedBorder}` 
            : isMatched 
                ? 'none' 
                : '0 6px 0 #CBD5E1', // Chunky 3D button effect
        marginBottom: isMatched ? '6px' : '0', // Compensate for missing shadow when matched
        letterSpacing: '1px',
    });

    return (
        <div className={styles.gameContainer}>
            <GameHeader
                menuLink="/matematika"
                themeColor={theme.themeColor}
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={TOTAL_ROUNDS}
                borderColor={theme.themeColor}
            >
                <h2 className={styles.gameTitle} style={{ color: theme.themeColor }}>{theme.title}</h2>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {selectedLeft !== null
                        ? '👉 Sekarang pilih jawaban di sebelah kanan!'
                        : '👈 Pilih soal di sebelah kiri dulu!'}
                </p>
            </GameHeader>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/matematika"
                        themeColor={theme.themeColor}
                        className={styles.gameOverCard}
                        scoreClassName={styles.finalScore}
                        winMessage="Kamu berhasil mencocokkan semua angka!"
                    />
                ) : (
                    <div ref={containerRef} style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        width: '100%',
                        gap: '12%',
                    }}>
                        {/* SVG Overlay for lines */}
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
                            boxShadow: '0 8px 0 #1E293B', // Chunky container
                            padding: '20px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '28px',
                            marginBottom: '8px' // Space for shadow
                        }}>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                color: theme.soalColor,
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
                            boxShadow: '0 8px 0 #1E293B', // Chunky container
                            padding: '20px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '28px',
                            marginBottom: '8px' // Space for shadow
                        }}>
                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                color: theme.jawabanColor,
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

export default CocokOperasi;
