import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Header from '../../components/Header';
import { playWinSound, playPopSound } from '../../utils/soundEffects';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

const BelajarPenjumlahan: React.FC = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [applesMoved, setApplesMoved] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const generateQuestion = () => {
        // Generate a random sum between 2 and 10
        const targetSum = Math.floor(Math.random() * 9) + 2; 
        // Generate num1 between 1 and targetSum - 1
        const n1 = Math.floor(Math.random() * (targetSum - 1)) + 1;
        const n2 = targetSum - n1;
        
        setNum1(n1);
        setNum2(n2);
        setApplesMoved(0);
        setIsComplete(false);
    };

    useEffect(() => {
        generateQuestion();
    }, []);

    useSpeakOnMount("Pindahkan semua buah apel ke dalam keranjang besar!");

    useEffect(() => {
        if (num1 > 0 && applesMoved === num1 + num2) {
            setIsComplete(true);
            playWinSound();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']
            });
        }
    }, [applesMoved, num1, num2]);

    const handleAppleClick = () => {
        if (applesMoved < num1 + num2) {
            playPopSound();
            setApplesMoved(prev => prev + 1);
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
                        padding: '10px 20px'
                    }}>
                        ⬅️ Kembali ke Menu
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.2rem', color: 'var(--cat-blue)', marginBottom: '10px' }}>
                    Belajar Penjumlahan ➕
                </h2>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
                    Pindahkan semua buah apel ke dalam keranjang besar!
                </p>

                <div style={{ 
                    background: 'white', 
                    borderRadius: '20px', 
                    padding: '30px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    maxWidth: '800px',
                    margin: '0 auto',
                    position: 'relative'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '40px'
                    }}>
                        {/* Num 1 Area */}
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            width: '150px', 
                            justifyContent: 'center', 
                            alignContent: 'flex-start',
                            minHeight: '120px',
                            background: 'var(--bg-light)',
                            borderRadius: '15px',
                            padding: '10px'
                        }}>
                            {Array.from({ length: num1 }).map((_, i) => (
                                <span 
                                    key={`n1-${i}`} 
                                    style={{ 
                                        cursor: 'pointer', 
                                        opacity: i < Math.min(applesMoved, num1) ? 0.2 : 1,
                                        transition: 'all 0.3s ease',
                                        transform: i < Math.min(applesMoved, num1) ? 'scale(0.8)' : 'scale(1)'
                                    }}
                                    onClick={() => i >= Math.min(applesMoved, num1) && handleAppleClick()}
                                >
                                    🍎
                                </span>
                            ))}
                        </div>

                        <div style={{ color: 'var(--cat-blue)' }}>+</div>

                        {/* Num 2 Area */}
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            width: '150px', 
                            justifyContent: 'center', 
                            alignContent: 'flex-start',
                            minHeight: '120px',
                            background: 'var(--bg-light)',
                            borderRadius: '15px',
                            padding: '10px'
                        }}>
                            {Array.from({ length: num2 }).map((_, i) => (
                                <span 
                                    key={`n2-${i}`} 
                                    style={{ 
                                        cursor: 'pointer',
                                        opacity: i < (applesMoved - num1) ? 0.2 : 1,
                                        transition: 'all 0.3s ease',
                                        transform: i < (applesMoved - num1) ? 'scale(0.8)' : 'scale(1)'
                                    }}
                                    onClick={() => i >= (applesMoved - num1) && handleAppleClick()}
                                >
                                    🍎
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Result Basket Area */}
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '20px',
                        border: '3px dashed var(--cat-blue)',
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            gap: '5px',
                            marginBottom: '15px'
                        }}>
                            {Array.from({ length: applesMoved }).map((_, i) => (
                                <span key={`res-${i}`} style={{ animation: 'popIn 0.3s ease-out' }}>
                                    🍎
                                </span>
                            ))}
                        </div>

                        <div style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: 'bold', 
                            color: isComplete ? 'var(--cat-green)' : '#999',
                            height: '50px'
                        }}>
                            {isComplete ? `${num1} + ${num2} = ${num1 + num2}` : `${num1} + ${num2} = ?`}
                        </div>
                    </div>

                    {isComplete && (
                        <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease' }}>
                            <button className="btn" onClick={generateQuestion} style={{ fontSize: '1.2rem', padding: '15px 30px' }}>
                                Soal Berikutnya ➡️
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
};

export default BelajarPenjumlahan;
