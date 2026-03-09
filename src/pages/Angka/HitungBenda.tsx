import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HitungBenda.module.css';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface EmojiItem {
    icon: string;
    id: string;
    name: string;
}

const EMOJIS: EmojiItem[] = [
    { icon: '🍎', id: 'apel', name: 'apel' },
    { icon: '🚗', id: 'mobil', name: 'mobil' },
    { icon: '🎈', id: 'balon', name: 'balon' },
    { icon: '🐸', id: 'katak', name: 'katak' },
    { icon: '⭐️', id: 'bintang', name: 'bintang' },
    { icon: '🐶', id: 'anjing', name: 'anjing' },
    { icon: '⚽️', id: 'bola', name: 'bola' },
    { icon: '🧸', id: 'boneka', name: 'boneka beruang' },
    { icon: '🍓', id: 'stroberi', name: 'stroberi' },
    { icon: '🦋', id: 'kupu', name: 'kupu-kupu' }
];

const HitungBenda: React.FC = () => {
    // Game state
    const [targetNumber, setTargetNumber] = useState(0);
    const [currentEmoji, setCurrentEmoji] = useState<EmojiItem>(EMOJIS[0]);
    const [options, setOptions] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [selectedWrong, setSelectedWrong] = useState<number[]>([]);
    const [correctSelected, setCorrectSelected] = useState<number | null>(null);
    const questionAudioRef = useRef<HTMLAudioElement | null>(null);

    const TOTAL_ROUNDS = 10;

    // Initialize round
    useEffect(() => {
        if (round <= TOTAL_ROUNDS) {
            generateRound();
        } else {
            setGameOver(true);
            playWinSound();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#7C3AED', '#06B6D4', '#F59E0B', '#10B981']
            });
        }
    }, [round]);

    const generateRound = () => {
        // Random number 1-10
        const target = Math.floor(Math.random() * 15) + 1;
        setTargetNumber(target);

        // Random emoji
        const emojiIndex = Math.floor(Math.random() * EMOJIS.length);
        setCurrentEmoji(EMOJIS[emojiIndex]);

        // Generate 3 unique options including the target
        const newOptions = new Set([target]);
        while (newOptions.size < 3) {
            const randomOption = Math.floor(Math.random() * 15) + 1;
            newOptions.add(randomOption);
        }

        // Shuffle options
        const shuffled = Array.from(newOptions).sort(() => Math.random() - 0.5);
        setOptions(shuffled);

        setSelectedWrong([]);
        setCorrectSelected(null);
    };

    // Play question audio automatically when round changes (and targetNumber is set)
    useEffect(() => {
        if (targetNumber > 0 && !gameOver) {
            playQuestionAudio();
        }
    }, [targetNumber, currentEmoji, gameOver]);

    const playQuestionAudio = () => {
        if (questionAudioRef.current) {
            questionAudioRef.current.pause();
            questionAudioRef.current.currentTime = 0;
        }
        const audio = new Audio(`/audio/tanya/tanya_${currentEmoji.id}.mp3`);
        questionAudioRef.current = audio;
        audio.play().catch(() => { });
    };

    const handleOptionClick = (option: number) => {
        if (correctSelected !== null) return; // Prevent clicking after correct answer
        if (selectedWrong.length > 0) return; // Prevent clicking after ANY wrong answer since it will auto-advance

        if (option === targetNumber) {
            // Correct answer
            playCorrectSound();
            setCorrectSelected(option);
            setScore(prev => prev + 10);

            // Generate audio pronunciation for the correct number
            const audio = new Audio(`/audio/angka/${option}.mp3`);
            audio.play().catch(() => { });

            // Next round after delay
            setTimeout(() => {
                setRound(prev => prev + 1);
            }, 1500);
        } else {
            // Wrong answer
            playWrongSound();
            setSelectedWrong([option]);

            // Next round after a shorter delay with 0 score
            setTimeout(() => {
                setRound(prev => prev + 1);
            }, 1000);
        }
    };

    const restartGame = () => {
        setScore(0);
        setRound(1);
        setGameOver(false);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <Link to="/angka" className="btn" style={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    backgroundColor: 'var(--cat-blue)'
                }}>
                    ⬅️ Kembali
                </Link>
                <div className={styles.statsContainer}>
                    <div className={styles.statBox}>
                        Ronde <span style={{ color: 'var(--primary)' }}>{Math.min(round, TOTAL_ROUNDS)}</span>/{TOTAL_ROUNDS}
                    </div>
                    <div className={styles.statBox}>
                        Skor: <span style={{ color: 'var(--cat-orange)' }}>{score}</span>
                    </div>
                </div>
            </header>

            <main className={styles.gameBoard}>
                {gameOver ? (
                    <div className={styles.gameOverCard}>
                        <h2>🎉 Luar Biasa! 🎉</h2>
                        <p>Kamu berhasil menyelesaikan game berhitung!</p>
                        <div className={styles.finalScore}>Skor Akhir: {score}</div>
                        <button className="btn" onClick={restartGame} style={{ fontSize: '1.5rem', padding: '15px 40px', marginTop: '20px' }}>
                            🔄 Main Lagi
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.gameTitle} onClick={playQuestionAudio} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                            Ada berapa {currentEmoji.icon} di bawah ini?
                        </h2>

                        <div className={styles.objectsContainer}>
                            {Array.from({ length: targetNumber }).map((_, index) => (
                                <span
                                    key={index}
                                    className={styles.objectEmoji}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {currentEmoji.icon}
                                </span>
                            ))}
                        </div>

                        <div className={styles.optionsContainer}>
                            {options.map((option, index) => {
                                let btnClass = styles.optionBtn;
                                if (correctSelected === option) {
                                    btnClass += ` ${styles.optionCorrect}`;
                                } else if (selectedWrong.includes(option)) {
                                    btnClass += ` ${styles.optionWrong}`;
                                }

                                return (
                                    <button
                                        key={index}
                                        className={btnClass}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={correctSelected !== null || selectedWrong.includes(option)}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default HitungBenda;
