import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Header from '../../components/Header';
import { playWinSound, playPopSound } from '../../utils/soundEffects';

const PenguranganGaris: React.FC = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [currentPos, setCurrentPos] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const generateQuestion = () => {
        // Start number between 3 and 10
        const n1 = Math.floor(Math.random() * 8) + 3;
        // Jumps to make backwards (1 to n1)
        const n2 = Math.floor(Math.random() * n1) + 1;
        
        setNum1(n1);
        setNum2(n2);
        setCurrentPos(n1);
        setIsComplete(false);
    };

    useEffect(() => {
        generateQuestion();
    }, []);

    // Speak instruction on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Bantu katak melompat mundur!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    useEffect(() => {
        if (num2 > 0 && currentPos === num1 - num2) {
            setIsComplete(true);
            playWinSound();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF0000', '#FF8C00', '#FFFF00']
            });
        }
    }, [currentPos, num1, num2]);

    const handleJump = () => {
        if (currentPos > num1 - num2) {
            playPopSound();
            setCurrentPos(prev => prev - 1);
        }
    };

    return (
        <>
            <Header />
            <main className="app-container" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '20px', textAlign: 'left', padding: '0 20px' }}>
                    <Link to="/matematika" className="btn" style={{
                        textTransform: 'none',
                        fontSize: '1rem',
                        padding: '10px 20px',
                        backgroundColor: 'var(--cat-red)'
                    }}>
                        ⬅️ Kembali ke Menu
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.2rem', color: 'var(--cat-red)', marginBottom: '10px' }}>
                    Katak Pengurang 🐸
                </h2>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
                    Bantu katak melompat mundur sebanyak <strong>{num2} kali</strong>!
                </p>

                <div style={{ 
                    background: 'white', 
                    borderRadius: '20px', 
                    padding: '30px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    maxWidth: '900px',
                    margin: '0 auto',
                    position: 'relative'
                }}>
                    
                    {/* Number Line Area */}
                    <div style={{
                        margin: '60px 0 40px',
                        padding: '20px',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        {/* The line itself */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '5%',
                            right: '5%',
                            height: '6px',
                            background: '#ccc',
                            zIndex: 1,
                            transform: 'translateY(-50%)'
                        }}></div>

                        {/* The numbers and the frog */}
                        {Array.from({ length: 11 }).map((_, index) => {
                            const isFrogHere = currentPos === index;
                            const isStart = num1 === index;
                            
                            return (
                                <div key={`pos-${index}`} style={{
                                    position: 'relative',
                                    zIndex: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '8%'
                                }}>
                                    {/* Frog */}
                                    <div style={{
                                        fontSize: '3.5rem',
                                        height: '60px',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        transform: isFrogHere ? 'scaleX(-1) scale(1) translateY(-20px)' : 'scaleX(-1) scale(0) translateY(0)', // scaleX(-1) to face left
                                        opacity: isFrogHere ? 1 : 0,
                                        position: 'absolute',
                                        bottom: '45px'
                                    }}>
                                        🐸
                                    </div>
                                    
                                    {/* Rock/Point */}
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: isFrogHere ? 'var(--cat-red)' : (isStart ? '#bbb' : '#fff'),
                                        border: `4px solid ${isFrogHere ? 'var(--cat-red)' : '#ccc'}`,
                                        marginBottom: '10px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isFrogHere ? '0 0 15px rgba(220, 38, 38, 0.5)' : 'none'
                                    }}></div>
                                    
                                    {/* Number */}
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: isFrogHere ? 'bold' : 'normal',
                                        color: isFrogHere ? 'var(--cat-red)' : '#666'
                                    }}>
                                        {index}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controls & Status */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        {!isComplete && (
                            <button 
                                className="btn" 
                                onClick={handleJump}
                                style={{
                                    fontSize: '1.5rem',
                                    padding: '15px 40px',
                                    backgroundColor: 'var(--cat-red)',
                                    borderRadius: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    boxShadow: '0 5px 15px rgba(220, 38, 38, 0.3)'
                                }}
                            >
                                ⬅️ Lompat Mundur!
                            </button>
                        )}

                        <div style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: 'bold', 
                            color: isComplete ? 'var(--cat-red)' : '#999',
                            background: 'var(--bg-light)',
                            padding: '15px 40px',
                            borderRadius: '20px',
                            border: isComplete ? '3px solid var(--cat-red)' : '3px dashed #ccc',
                            transition: 'all 0.3s ease'
                        }}>
                            {num1} - {num2} = {isComplete ? (num1 - num2) : currentPos}
                        </div>
                    </div>

                    {isComplete && (
                        <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease' }}>
                            <p style={{ fontSize: '1.5rem', color: 'var(--cat-red)', marginBottom: '20px' }}>
                                Hebat! Katak mundur ke angka {currentPos}!
                            </p>
                            <button className="btn" onClick={generateQuestion} style={{ fontSize: '1.2rem', padding: '15px 30px', backgroundColor: 'var(--cat-red)' }}>
                                Soal Berikutnya ➡️
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
};

export default PenguranganGaris;
