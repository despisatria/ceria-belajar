import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

interface Bagian {
    id: string;
    nama: string;
    emoji: string;
    deskripsi: string;
}

const BAGIAN_TUMBUHAN: Bagian[] = [
    { id: 'akar', nama: 'Akar', emoji: '🪢', deskripsi: 'Akar mencari minum di dalam tanah.' },
    { id: 'batang', nama: 'Batang', emoji: '🪵', deskripsi: 'Batang membuat pohon berdiri kuat.' },
    { id: 'daun', nama: 'Daun', emoji: '🍃', deskripsi: 'Daun memasak makanan dari sinar matahari.' },
    { id: 'bunga', nama: 'Bunga', emoji: '🌸', deskripsi: 'Bunga yang cantik dan wangi.' },
    { id: 'buah', nama: 'Buah', emoji: '🍎', deskripsi: 'Buah yang manis untuk kita makan.' },
];

const BagianTumbuhan: React.FC = () => {
    useSpeakOnMount('Mari mengenal bagian tumbuhan');
    const [bagianAktif, setBagianAktif] = useState<Bagian | null>(null);

    const mainkanSuara = (bagian: Bagian) => {
        setBagianAktif(bagian);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`${bagian.nama}. ${bagian.deskripsi}`);
            utterance.lang = 'id-ID';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <>
            <Header />
            <main className="app-container" style={{ textAlign: 'center', paddingBottom: '50px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'left', padding: '0 20px' }}>
                    <Link to="/sains" className="btn" style={{ backgroundColor: 'var(--text-color)', textTransform: 'none', padding: '10px 20px' }}>
                        ⬅️ Kembali
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-green)', marginBottom: '20px' }}>
                    Bagian Tumbuhan 🌳
                </h2>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '20px',
                    maxWidth: '600px',
                    margin: '0 auto 30px'
                }}>
                    <span style={{ fontSize: '6rem', filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.2))' }}>🌳</span>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-color)', fontWeight: 'bold' }}>
                        Klik setiap bagian di bawah ini untuk mengenalnya!
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '15px',
                    padding: '0 20px',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {BAGIAN_TUMBUHAN.map((bagian) => (
                        <div 
                            key={bagian.id}
                            className={`card-hover ${bagianAktif?.id === bagian.id ? 'active' : ''}`}
                            onClick={() => mainkanSuara(bagian)}
                            style={{
                                backgroundColor: bagianAktif?.id === bagian.id ? 'var(--tertiary)' : 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '15px',
                                padding: '15px',
                                boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                border: '3px solid var(--cat-green)',
                                transform: bagianAktif?.id === bagian.id ? 'scale(1.05)' : 'scale(1)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ fontSize: '4rem' }}>{bagian.emoji}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '10px', color: 'var(--text-color)' }}>
                                {bagian.nama}
                            </div>
                        </div>
                    ))}
                </div>

                {bagianAktif && (
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        backgroundColor: 'var(--cat-blue)',
                        color: 'white',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        margin: '30px auto 0',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        {bagianAktif.deskripsi}
                    </div>
                )}
                <style>{`
                    @keyframes popIn {
                        from { transform: scale(0.5); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </main>
        </>
    );
};

export default BagianTumbuhan;
