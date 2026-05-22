import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

interface Cuaca {
    id: string;
    nama: string;
    emoji: string;
    deskripsi: string;
    bgColor: string;
}

const DAFTAR_CUACA: Cuaca[] = [
    { id: 'cerah', nama: 'Cerah', emoji: '☀️', deskripsi: 'Matahari bersinar terang, asyik untuk bermain di luar!', bgColor: '#87CEEB' },
    { id: 'hujan', nama: 'Hujan', emoji: '🌧️', deskripsi: 'Air turun dari awan. Jangan lupa pakai payung!', bgColor: '#778899' },
    { id: 'berawan', nama: 'Berawan', emoji: '☁️', deskripsi: 'Matahari bersembunyi di balik awan putih.', bgColor: '#B0C4DE' },
    { id: 'petir', nama: 'Petir', emoji: '⛈️', deskripsi: 'Ada suara gemuruh dan kilat. Lebih baik kita di dalam rumah.', bgColor: '#4A5D23' },
];

const MengenalCuaca: React.FC = () => {
    useSpeakOnMount('Mari mengenal cuaca');
    const [cuacaAktif, setCuacaAktif] = useState<Cuaca>(DAFTAR_CUACA[0]);

    const mainkanSuara = (cuaca: Cuaca) => {
        setCuacaAktif(cuaca);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`${cuaca.nama}. ${cuaca.deskripsi}`);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div style={{ backgroundColor: cuacaAktif.bgColor, minHeight: '100vh', transition: 'background-color 1s ease' }}>
            <Header />
            <main className="app-container" style={{ textAlign: 'center', paddingBottom: '50px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'left', padding: '0 20px' }}>
                    <Link to="/sains" className="btn" style={{ backgroundColor: 'white', color: 'black', textTransform: 'none', padding: '10px 20px' }}>
                        ⬅️ Kembali
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Mengenal Cuaca 🌤️
                </h2>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        fontSize: '10rem',
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                        animation: 'bounce 2s infinite ease-in-out'
                    }}>
                        {cuacaAktif.emoji}
                    </div>
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '20px',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        marginTop: '20px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ fontSize: '2rem', margin: '0 0 10px 0', color: 'var(--cat-blue)' }}>{cuacaAktif.nama}</h3>
                        <p style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold' }}>{cuacaAktif.deskripsi}</p>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    flexWrap: 'wrap',
                    padding: '0 20px'
                }}>
                    {DAFTAR_CUACA.map((cuaca) => (
                        <button
                            key={cuaca.id}
                            onClick={() => mainkanSuara(cuaca)}
                            style={{
                                fontSize: '3rem',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                border: cuacaAktif.id === cuaca.id ? '4px solid white' : '4px solid transparent',
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                transform: cuacaAktif.id === cuaca.id ? 'scale(1.1)' : 'scale(1)'
                            }}
                        >
                            {cuaca.emoji}
                        </button>
                    ))}
                </div>
                <style>{`
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                `}</style>
            </main>
        </div>
    );
};

export default MengenalCuaca;
