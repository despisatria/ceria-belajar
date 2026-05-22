import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

type Habitat = 'Darat' | 'Air' | 'Udara';

interface Hewan {
    id: string;
    nama: string;
    emoji: string;
    habitat: Habitat;
    suara?: string; // We will use speech synthesis if no custom sound
}

const DAFTAR_HEWAN: Hewan[] = [
    { id: 'h1', nama: 'Singa', emoji: '🦁', habitat: 'Darat' },
    { id: 'h2', nama: 'Gajah', emoji: '🐘', habitat: 'Darat' },
    { id: 'h3', nama: 'Jerapah', emoji: '🦒', habitat: 'Darat' },
    { id: 'h4', nama: 'Lumba-lumba', emoji: '🐬', habitat: 'Air' },
    { id: 'h5', nama: 'Ikan Hiu', emoji: '🦈', habitat: 'Air' },
    { id: 'h6', nama: 'Penyu', emoji: '🐢', habitat: 'Air' },
    { id: 'h7', nama: 'Burung Hantu', emoji: '🦉', habitat: 'Udara' },
    { id: 'h8', nama: 'Elang', emoji: '🦅', habitat: 'Udara' },
    { id: 'h9', nama: 'Kupu-kupu', emoji: '🦋', habitat: 'Udara' },
];

const MengenalHewan: React.FC = () => {
    useSpeakOnMount('Mari mengenal hewan');
    const [habitatAktif, setHabitatAktif] = useState<Habitat | 'Semua'>('Semua');

    const mainkanSuara = (namaHewan: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Ini adalah ${namaHewan}`);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const hewanDitampilkan = habitatAktif === 'Semua' 
        ? DAFTAR_HEWAN 
        : DAFTAR_HEWAN.filter(h => h.habitat === habitatAktif);

    return (
        <>
            <Header />
            <main className="app-container" style={{ textAlign: 'center', paddingBottom: '50px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'left', padding: '0 20px' }}>
                    <Link to="/sains" className="btn" style={{ backgroundColor: 'var(--text-color)', textTransform: 'none', padding: '10px 20px' }}>
                        ⬅️ Kembali
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-orange)', marginBottom: '20px' }}>
                    Mengenal Hewan 🦁
                </h2>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
                    {['Semua', 'Darat', 'Air', 'Udara'].map((hab) => (
                        <button 
                            key={hab}
                            className={`btn ${habitatAktif === hab ? 'active' : ''}`}
                            onClick={() => setHabitatAktif(hab as Habitat | 'Semua')}
                            style={{
                                backgroundColor: habitatAktif === hab ? 'var(--primary)' : 'var(--tertiary)',
                                padding: '10px 20px',
                                fontSize: '1.2rem',
                                border: '3px solid',
                                borderColor: habitatAktif === hab ? 'var(--cat-orange)' : 'var(--cat-blue)',
                            }}
                        >
                            {hab}
                        </button>
                    ))}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '20px',
                    padding: '0 20px'
                }}>
                    {hewanDitampilkan.map((hewan) => (
                        <div 
                            key={hewan.id}
                            className="card-hover"
                            onClick={() => mainkanSuara(hewan.nama)}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '20px',
                                padding: '20px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                border: '4px solid var(--cat-orange)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '15px',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '5rem', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }}>
                                {hewan.emoji}
                            </span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                {hewan.nama}
                            </span>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default MengenalHewan;
