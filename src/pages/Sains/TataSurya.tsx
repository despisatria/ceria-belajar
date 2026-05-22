import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

interface Planet {
    id: string;
    nama: string;
    emoji: string;
    deskripsi: string;
}

const TATA_SURYA: Planet[] = [
    { id: 'matahari', nama: 'Matahari', emoji: '☀️', deskripsi: 'Matahari adalah bintang yang panas dan terang.' },
    { id: 'bumi', nama: 'Bumi', emoji: '🌍', deskripsi: 'Bumi adalah planet tempat kita tinggal.' },
    { id: 'bulan', nama: 'Bulan', emoji: '🌙', deskripsi: 'Bulan menemani bumi dan bersinar di malam hari.' },
    { id: 'bintang', nama: 'Bintang', emoji: '⭐', deskripsi: 'Bintang berkelap-kelip indah di langit malam.' },
];

const TataSurya: React.FC = () => {
    useSpeakOnMount('Mari menjelajah tata surya');
    const [planetAktif, setPlanetAktif] = useState<Planet | null>(null);

    const mainkanSuara = (planet: Planet) => {
        setPlanetAktif(planet);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`${planet.nama}. ${planet.deskripsi}`);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div style={{ backgroundColor: '#0B0D17', minHeight: '100vh', color: 'white' }}>
            <Header />
            <main className="app-container" style={{ textAlign: 'center', paddingBottom: '50px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'left', padding: '0 20px' }}>
                    <Link to="/sains" className="btn" style={{ backgroundColor: 'white', color: 'black', textTransform: 'none', padding: '10px 20px' }}>
                        ⬅️ Kembali
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.5rem', color: '#FFD700', marginBottom: '20px', textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}>
                    Tata Surya 🪐
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '20px',
                    padding: '20px',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {TATA_SURYA.map((planet) => (
                        <div 
                            key={planet.id}
                            className="card-hover"
                            onClick={() => mainkanSuara(planet)}
                            style={{
                                backgroundColor: planetAktif?.id === planet.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '20px',
                                padding: '20px',
                                cursor: 'pointer',
                                border: planetAktif?.id === planet.id ? '3px solid #FFD700' : '3px solid transparent',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '15px',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(5px)'
                            }}
                        >
                            <span style={{ fontSize: '6rem', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))' }}>
                                {planet.emoji}
                            </span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {planet.nama}
                            </span>
                        </div>
                    ))}
                </div>

                {planetAktif && (
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #FFD700',
                        color: 'white',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        margin: '30px auto 0',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                        animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {planetAktif.deskripsi}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TataSurya;
