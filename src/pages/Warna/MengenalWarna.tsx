import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import { playCorrectSound } from '../../utils/soundEffects';

interface ColorInfo {
    id: string;
    name: string;
    hex: string;
    object: string;
    emoji: string;
}

const COLORS: ColorInfo[] = [
    { id: 'merah', name: 'Merah', hex: '#E53935', object: 'Apel', emoji: '🍎' },
    { id: 'biru', name: 'Biru', hex: '#1E88E5', object: 'Laut', emoji: '🌊' },
    { id: 'kuning', name: 'Kuning', hex: '#FDD835', object: 'Pisang', emoji: '🍌' },
    { id: 'hijau', name: 'Hijau', hex: '#43A047', object: 'Daun', emoji: '🍃' },
    { id: 'oranye', name: 'Oranye', hex: '#FB8C00', object: 'Jeruk', emoji: '🍊' },
    { id: 'ungu', name: 'Ungu', hex: '#8E24AA', object: 'Anggur', emoji: '🍇' },
    { id: 'merah-muda', name: 'Merah Muda', hex: '#EC407A', object: 'Bunga', emoji: '🌸' },
    { id: 'hitam', name: 'Hitam', hex: '#212121', object: 'Kucing', emoji: '🐈‍⬛' },
    { id: 'putih', name: 'Putih', hex: '#FAFAFA', object: 'Awan', emoji: '☁️' },
    { id: 'coklat', name: 'Coklat', hex: '#6D4C41', object: 'Cokelat', emoji: '🍫' },
    { id: 'abu-abu', name: 'Abu-abu', hex: '#9E9E9E', object: 'Gajah', emoji: '🐘' },
];

const MengenalWarna: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
    useSpeakOnMount('Mari mengenal warna!');

    const handleSelectColor = (color: ColorInfo) => {
        setSelectedColor(color);
        playCorrectSound();
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Warna ${color.name}. Seperti ${color.object}`);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="app-container" style={{ padding: '20px', textAlign: 'center' }}>
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

            <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-blue)', marginBottom: '20px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                Mengenal Warna 🌈
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--quaternary)', marginBottom: '30px', fontWeight: 'bold' }}>
                Pilih warna untuk melihat benda dengan warna tersebut!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                
                {/* Active Color Display Area */}
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: '250px',
                    borderRadius: '20px',
                    backgroundColor: selectedColor ? selectedColor.hex : '#f0f0f0',
                    border: '4px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    color: selectedColor?.hex === '#FAFAFA' || selectedColor?.hex === '#FDD835' ? '#333' : 'white',
                    textShadow: selectedColor?.hex === '#FAFAFA' || selectedColor?.hex === '#FDD835' ? 'none' : '1px 1px 4px rgba(0,0,0,0.5)',
                }}>
                    {selectedColor ? (
                        <>
                            <span style={{ fontSize: '5rem', display: 'block', marginBottom: '10px' }}>
                                {selectedColor.emoji}
                            </span>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                {selectedColor.name}
                            </span>
                            <span style={{ fontSize: '1.5rem', opacity: 0.9 }}>
                                ({selectedColor.object})
                            </span>
                        </>
                    ) : (
                        <span style={{ fontSize: '2rem', color: '#888', fontWeight: 'bold' }}>
                            Pilih Warna di Bawah 👇
                        </span>
                    )}
                </div>

                {/* Color Palette Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                    gap: '15px',
                    width: '100%',
                    maxWidth: '500px',
                }}>
                    {COLORS.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => handleSelectColor(color)}
                            style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                borderRadius: '50%',
                                backgroundColor: color.hex,
                                border: color.hex === '#FAFAFA' ? '3px solid #ddd' : '3px solid rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                transform: selectedColor?.id === color.id ? 'scale(1.15)' : 'scale(1)',
                                boxShadow: selectedColor?.id === color.id ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
                                outline: 'none',
                            }}
                            aria-label={`Pilih warna ${color.name}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MengenalWarna;
