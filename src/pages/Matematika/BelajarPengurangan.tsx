import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Header from '../../components/Header';
import { playWinSound, playPopSound } from '../../utils/soundEffects';

const BelajarPengurangan: React.FC = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [applesGiven, setApplesGiven] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const generateQuestion = () => {
        // Angka awal 5 sampai 10 agar apelnya cukup banyak
        const n1 = Math.floor(Math.random() * 6) + 5;
        // Yang dikurangi 1 sampai n1 - 1
        const n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
        
        setNum1(n1);
        setNum2(n2);
        setApplesGiven(0);
        setIsComplete(false);
    };

    useEffect(() => {
        generateQuestion();
    }, []);

    // Speak instruction on mount
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Ayo berikan apel kepada Beruang! Klik apelnya ya!");
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    useEffect(() => {
        if (num2 > 0 && applesGiven === num2) {
            setIsComplete(true);
            playWinSound();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF8C00', '#FFA500', '#FFD700']
            });
        }
    }, [applesGiven, num2]);

    const handleAppleClick = () => {
        if (applesGiven < num2) {
            playPopSound();
            setApplesGiven(prev => prev + 1);
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
                        backgroundColor: 'var(--cat-orange)'
                    }}>
                        ⬅️ Kembali ke Menu
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.2rem', color: 'var(--cat-orange)', marginBottom: '10px' }}>
                    Belajar Pengurangan ➖
                </h2>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
                    Ayo berikan <strong>{num2} apel</strong> kepada Beruang! Klik apelnya ya! 🐻
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
                        justifyContent: 'space-between',
                        alignItems: 'stretch',
                        gap: '20px',
                        marginBottom: '40px',
                        flexWrap: 'wrap'
                    }}>
                        {/* Area Apel Kita (Sumber) */}
                        <div style={{
                            flex: '1',
                            minWidth: '250px',
                            background: 'var(--bg-light)',
                            padding: '20px',
                            borderRadius: '20px',
                            border: '3px dashed #ccc',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: '#555' }}>Apel Kita</h3>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '10px',
                                fontSize: '3.5rem',
                                minHeight: '150px',
                                alignContent: 'flex-start'
                            }}>
                                {/* Menampilkan apel yang belum diberikan */}
                                {Array.from({ length: num1 - applesGiven }).map((_, i) => (
                                    <span 
                                        key={`apple-source-${i}`} 
                                        onClick={handleAppleClick}
                                        style={{ 
                                            cursor: 'pointer',
                                            transition: 'transform 0.1s',
                                        }}
                                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.8)'}
                                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        🍎
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tanda Panah */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '3rem',
                            color: '#ccc'
                        }}>
                            ➡️
                        </div>

                        {/* Area Beruang (Tujuan) */}
                        <div style={{
                            flex: '1',
                            minWidth: '250px',
                            background: 'rgba(249, 115, 22, 0.1)',
                            padding: '20px',
                            borderRadius: '20px',
                            border: '3px solid var(--cat-orange)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: 'var(--cat-orange)' }}>Diberikan ke Beruang</h3>
                            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🐻</div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '5px',
                                fontSize: '2.5rem',
                                minHeight: '60px'
                            }}>
                                {/* Menampilkan apel yang sudah diberikan */}
                                {Array.from({ length: applesGiven }).map((_, i) => (
                                    <span key={`apple-given-${i}`} style={{ animation: 'popIn 0.3s ease-out' }}>
                                        🍎
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Result Area */}
                    <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        background: isComplete ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-light)',
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isComplete ? '3px solid var(--cat-green)' : '3px dashed #ccc',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: 'bold', 
                            color: isComplete ? 'var(--cat-green)' : '#999',
                        }}>
                            {isComplete ? `${num1} - ${num2} = ${num1 - num2}` : `${num1} - ${num2} = ?`}
                        </div>
                        {isComplete && (
                            <div style={{ fontSize: '1.2rem', color: 'var(--cat-green)', marginTop: '10px', animation: 'fadeIn 0.5s ease' }}>
                                Hebat! Sisa apel kita tinggal {num1 - num2}.
                            </div>
                        )}
                    </div>

                    {isComplete && (
                        <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease' }}>
                            <button className="btn" onClick={generateQuestion} style={{ fontSize: '1.2rem', padding: '15px 30px', backgroundColor: 'var(--cat-orange)' }}>
                                Soal Berikutnya ➡️
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.3); }
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

export default BelajarPengurangan;
