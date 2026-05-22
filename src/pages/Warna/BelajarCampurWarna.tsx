import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import { playCorrectSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface MixTheory {
    id: string;
    color1: { name: string, hex: string };
    color2: { name: string, hex: string };
    result: { name: string, hex: string };
}

const MIX_THEORIES: MixTheory[] = [
    {
        id: 'merah-biru',
        color1: { name: 'Merah', hex: '#EF4444' },
        color2: { name: 'Biru', hex: '#3B82F6' },
        result: { name: 'Ungu', hex: '#8B5CF6' }
    },
    {
        id: 'merah-kuning',
        color1: { name: 'Merah', hex: '#EF4444' },
        color2: { name: 'Kuning', hex: '#F59E0B' },
        result: { name: 'Oranye', hex: '#F97316' }
    },
    {
        id: 'biru-kuning',
        color1: { name: 'Biru', hex: '#3B82F6' },
        color2: { name: 'Kuning', hex: '#F59E0B' },
        result: { name: 'Hijau', hex: '#10B981' }
    },
    {
        id: 'merah-putih',
        color1: { name: 'Merah', hex: '#EF4444' },
        color2: { name: 'Putih', hex: '#F9FAFB' },
        result: { name: 'Merah Muda', hex: '#EC4899' }
    }
];

const BelajarCampurWarna: React.FC = () => {
    useSpeakOnMount('Ayo belajar campur warna!');
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});

    const handleReveal = (theory: MixTheory) => {
        if (!revealed[theory.id]) {
            setRevealed(prev => ({ ...prev, [theory.id]: true }));
            playCorrectSound();
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 },
                colors: [theory.result.hex]
            });
        }
        
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`${theory.color1.name} dicampur ${theory.color2.name} menjadi ${theory.result.name}!`);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="app-container" style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <Link to="/warna" className="btn" style={{
                    backgroundColor: 'var(--text-color)',
                    textTransform: 'none',
                    fontSize: '1.2rem',
                    padding: '12px 24px'
                }}>
                    ⬅️ Kembali
                </Link>
            </div>

            <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-orange)', marginBottom: '10px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                Belajar Campur Warna 🪄
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--quaternary)', marginBottom: '30px', fontWeight: 'bold' }}>
                Klik tombol campur untuk melihat hasil perpaduan warna!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto', width: '100%', flex: 1 }}>
                {MIX_THEORIES.map((theory) => {
                    const isRevealed = revealed[theory.id];
                    return (
                        <div key={theory.id} style={{
                            background: 'white',
                            padding: '20px 15px',
                            borderRadius: '25px',
                            border: '4px solid var(--text-color)',
                            boxShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px'
                        }}>
                            {/* Color 1 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    backgroundColor: theory.color1.hex,
                                    border: theory.color1.hex === '#F9FAFB' ? '2px solid #ccc' : '2px solid rgba(0,0,0,0.1)',
                                    boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.15)'
                                }} />
                                <span style={{ fontWeight: 'bold', marginTop: '8px', fontSize: '1.1rem' }}>{theory.color1.name}</span>
                            </div>

                            <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--cat-orange)' }}>+</span>

                            {/* Color 2 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    backgroundColor: theory.color2.hex,
                                    border: theory.color2.hex === '#F9FAFB' ? '2px solid #ccc' : '2px solid rgba(0,0,0,0.1)',
                                    boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.15)'
                                }} />
                                <span style={{ fontWeight: 'bold', marginTop: '8px', fontSize: '1.1rem' }}>{theory.color2.name}</span>
                            </div>

                            <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-color)' }}>=</span>

                            {/* Result */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1.5 }}>
                                {isRevealed ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}>
                                        <div style={{
                                            width: '60px', height: '60px', borderRadius: '50%',
                                            backgroundColor: theory.result.hex,
                                            border: '3px solid var(--text-color)',
                                            boxShadow: '3px 3px 0px rgba(0,0,0,0.2)'
                                        }} />
                                        <span style={{ fontWeight: '900', marginTop: '8px', color: theory.result.hex, fontSize: '1.2rem', textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>{theory.result.name}</span>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleReveal(theory)}
                                        style={{
                                            padding: '12px 15px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            backgroundColor: 'var(--cat-orange)',
                                            color: 'white',
                                            border: '3px solid var(--text-color)',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            boxShadow: '3px 3px 0px var(--text-color)',
                                            transition: 'transform 0.1s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
                                        onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        Campur! 🪄
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '40px', paddingBottom: '30px' }}>
                <Link to="/warna/campur-warna" className="btn" style={{ fontSize: '1.3rem', padding: '15px 30px', backgroundColor: 'var(--cat-red)', border: '4px solid white', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)' }}>
                    🎮 Main Game Campur Warna
                </Link>
            </div>
        </div>
    );
};

export default BelajarCampurWarna;
