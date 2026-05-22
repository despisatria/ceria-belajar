import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from '../../components/GameHeader';
import GameOverScreen from '../../components/GameOverScreen';
import { playCorrectSound, playWrongSound, playWinSound } from '../../utils/soundEffects';
import styles from '../Mencocokkan/GambarSama.module.css';

const PRIMARY_COLORS = [
    { id: 'merah', name: 'Merah', hex: '#E53935' },
    { id: 'kuning', name: 'Kuning', hex: '#FDD835' },
    { id: 'biru', name: 'Biru', hex: '#1E88E5' },
];

const MIX_RECIPES = [
    { ingredients: ['merah', 'kuning'], result: { id: 'oranye', name: 'Oranye', hex: '#FB8C00' } },
    { ingredients: ['kuning', 'biru'], result: { id: 'hijau', name: 'Hijau', hex: '#43A047' } },
    { ingredients: ['merah', 'biru'], result: { id: 'ungu', name: 'Ungu', hex: '#8E24AA' } },
];

const TOTAL_ROUNDS = 5;

const CampurWarna: React.FC = () => {
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    
    const [targetRecipe, setTargetRecipe] = useState(MIX_RECIPES[0]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [mixResult, setMixResult] = useState<{hex: string, name: string} | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const initRound = () => {
        const randomRecipe = MIX_RECIPES[Math.floor(Math.random() * MIX_RECIPES.length)];
        setTargetRecipe(randomRecipe);
        setSelectedColors([]);
        setMixResult(null);
        setIsAnimating(false);

        setTimeout(() => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(`Buatlah warna ${randomRecipe.result.name}!`);
                utterance.lang = 'id-ID';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        }, 800);
    };

    const playSpeech = useCallback(() => {
        if (!targetRecipe) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Campur warna ${targetRecipe.result.name}!`);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, [targetRecipe]);

    useEffect(() => {
        if (!gameOver && round <= TOTAL_ROUNDS) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            initRound();
        }
    }, [round, gameOver]);

    const handleSelectColor = (colorId: string) => {
        if (isAnimating || selectedColors.length >= 2) return;
        
        const newSelection = [...selectedColors, colorId];
        setSelectedColors(newSelection);
        
        if (newSelection.length === 2) {
            checkMixResult(newSelection);
        }
    };

    const checkMixResult = (selection: string[]) => {
        setIsAnimating(true);
        
        setTimeout(() => {
            // Find recipe that matches the 2 selected colors
            const recipe = MIX_RECIPES.find(
                r => r.ingredients.includes(selection[0]) && r.ingredients.includes(selection[1])
            );

            if (recipe && recipe.result.id === targetRecipe.result.id) {
                // Correct match
                setMixResult({ hex: recipe.result.hex, name: recipe.result.name });
                playCorrectSound();
                setScore(prev => prev + 20);
                
                setTimeout(() => {
                    const nextRound = round + 1;
                    if (nextRound > TOTAL_ROUNDS) {
                        playWinSound();
                        setGameOver(true);
                    } else {
                        setRound(nextRound);
                    }
                }, 2000);
            } else {
                // Wrong match
                const wrongHex = recipe ? recipe.result.hex : '#9E9E9E'; // If same color picked twice, it's grey or just the color itself
                const wrongName = recipe ? recipe.result.name : 'Abu-abu';
                setMixResult({ hex: wrongHex, name: wrongName });
                playWrongSound();
                
                setLives(prev => {
                    const newLives = prev - 1;
                    if (newLives <= 0) {
                        setTimeout(() => setGameOver(true), 2000);
                    } else {
                        setTimeout(() => {
                            setSelectedColors([]);
                            setMixResult(null);
                            setIsAnimating(false);
                        }, 2000);
                    }
                    return newLives;
                });
            }
        }, 1000); // 1 second animation time for mixing
    };

    const handleRestart = () => {
        setRound(1);
        setScore(0);
        setLives(5);
        setGameOver(false);
    };

    const getSelectedColorHex = (index: number) => {
        if (selectedColors.length > index) {
            return PRIMARY_COLORS.find(c => c.id === selectedColors[index])?.hex || '#FFF';
        }
        return '#f0f0f0'; // Empty glass
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <GameHeader
                menuLink="/warna"
                themeColor="var(--cat-orange)"
                styles={styles}
                lives={lives}
                score={score}
                round={round}
                totalRounds={TOTAL_ROUNDS}
                borderColor="var(--cat-orange)"
            >
                <h2 className={styles.gameTitle} style={{ color: 'var(--cat-orange)' }}>Campur Warna! 🧪</h2>
                <p style={{ textAlign: 'center', color: 'var(--quaternary)', marginTop: '10px', fontWeight: 'bold' }}>
                    Gabungkan dua warna untuk menghasilkan warna baru
                </p>
            </GameHeader>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {gameOver ? (
                    <GameOverScreen
                        isWin={lives > 0}
                        score={score}
                        onRestart={handleRestart}
                        menuLink="/warna"
                        themeColor="var(--cat-orange)"
                        className={styles.gameOverPanel}
                        scoreClassName={styles.finalScore}
                        winMessage="Kamu ilmuwan warna yang hebat!"
                        loseMessage="Jangan menyerah, ayo coba campur lagi!"
                    />
                ) : (
                    <>
                        <div className="instructionBox" style={{ textAlign: 'center', marginBottom: '30px', background: 'white', padding: '15px 30px', borderRadius: '20px', border: '4px solid var(--cat-orange)', boxShadow: '4px 4px 0px rgba(251, 140, 0, 0.3)' }}>
                            <h2 style={{ margin: 0, color: 'var(--text-color)' }}>
                                Buat warna: <span className="targetColorName" style={{ color: targetRecipe.result.hex, fontSize: '2.5rem' }}>{targetRecipe.result.name}</span>
                            </h2>
                            <div style={{ marginTop: '10px' }}>
                                <button
                                    onClick={playSpeech}
                                    className="btn"
                                    style={{ backgroundColor: 'var(--cat-orange)', color: 'white', border: 'none', borderRadius: '5px', fontSize: '0.9rem', padding: '5px 10px', cursor: 'pointer' }}
                                    title="Dengarkan Instruksi"
                                >
                                    🔊 Dengar
                                </button>
                            </div>
                        </div>

                        {/* Mixing Area */}
                        <div className="mixingArea" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {/* Glass 1 */}
                            <div className="glass" style={{ border: '6px solid rgba(0,0,0,0.1)', borderTop: 'none', borderRadius: '0 0 20px 20px', position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: selectedColors.length > 0 ? '80%' : '0%', backgroundColor: getSelectedColorHex(0), transition: 'height 0.5s ease-out, background-color 0.3s' }} />
                            </div>
                            
                            <span className="mathSign" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--quaternary)' }}>+</span>
                            
                            {/* Glass 2 */}
                            <div className="glass" style={{ border: '6px solid rgba(0,0,0,0.1)', borderTop: 'none', borderRadius: '0 0 20px 20px', position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: selectedColors.length > 1 ? '80%' : '0%', backgroundColor: getSelectedColorHex(1), transition: 'height 0.5s ease-out, background-color 0.3s' }} />
                            </div>

                            <span className="mathSign" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--quaternary)' }}>=</span>

                            {/* Result Glass */}
                            <div className="resultGlass" style={{ border: '6px solid rgba(0,0,0,0.1)', borderTop: 'none', borderRadius: '0 0 20px 20px', position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.5)', boxShadow: mixResult ? `0 0 20px ${mixResult.hex}` : 'none', transition: 'box-shadow 0.5s' }}>
                                <div style={{ 
                                    position: 'absolute', 
                                    bottom: 0, 
                                    width: '100%', 
                                    height: mixResult ? '80%' : (isAnimating ? '40%' : '0%'), 
                                    backgroundColor: mixResult ? mixResult.hex : (isAnimating ? '#ccc' : 'transparent'), 
                                    transition: 'height 1s ease-in-out, background-color 1s',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {isAnimating && !mixResult && <span style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>🌪️</span>}
                                </div>
                            </div>
                        </div>

                        {/* Color Buttons */}
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {PRIMARY_COLORS.map(color => (
                                <button
                                    key={color.id}
                                    className="colorBtn"
                                    onClick={() => handleSelectColor(color.id)}
                                    disabled={isAnimating || selectedColors.length >= 2}
                                    style={{
                                        borderRadius: '50%',
                                        backgroundColor: color.hex,
                                        border: '4px solid rgba(0,0,0,0.1)',
                                        cursor: isAnimating || selectedColors.length >= 2 ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 8px 0 rgba(0,0,0,0.2)',
                                        transform: 'translateY(0)',
                                        transition: 'all 0.1s',
                                    }}
                                    onMouseDown={(e) => {
                                        if(!isAnimating && selectedColors.length < 2) {
                                            e.currentTarget.style.transform = 'translateY(8px)';
                                            e.currentTarget.style.boxShadow = '0 0px 0 rgba(0,0,0,0.2)';
                                        }
                                    }}
                                    onMouseUp={(e) => {
                                        if(!isAnimating && selectedColors.length < 2) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 8px 0 rgba(0,0,0,0.2)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 0 rgba(0,0,0,0.2)';
                                    }}
                                />
                            ))}
                        </div>
                        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--quaternary)', fontWeight: 'bold' }}>
                            Pilih 2 warna di atas!
                        </p>
                    </>
                )}
            </main>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .glass {
                    width: 100px;
                    height: 150px;
                }
                .resultGlass {
                    width: 120px;
                    height: 180px;
                }
                .colorBtn {
                    width: 80px;
                    height: 80px;
                }
                
                @media (max-width: 600px) {
                    .mixingArea {
                        gap: 10px !important;
                        margin-bottom: 20px !important;
                    }
                    .glass {
                        width: 70px;
                        height: 100px;
                        border-width: 4px !important;
                    }
                    .resultGlass {
                        width: 80px;
                        height: 120px;
                        border-width: 4px !important;
                    }
                    .mathSign {
                        font-size: 2rem !important;
                    }
                    .colorBtn {
                        width: 60px;
                        height: 60px;
                        border-width: 3px !important;
                    }
                    .instructionBox {
                        padding: 10px 15px !important;
                        margin-bottom: 15px !important;
                    }
                    .instructionBox h2 {
                        font-size: 1.2rem !important;
                    }
                    .targetColorName {
                        font-size: 1.8rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CampurWarna;
