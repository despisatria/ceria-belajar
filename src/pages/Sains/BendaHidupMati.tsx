import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';
import confetti from 'canvas-confetti';

interface Benda {
    id: string;
    nama: string;
    emoji: string;
    isHidup: boolean;
}

const DAFTAR_BENDA: Benda[] = [
    { id: 'b1', nama: 'Kucing', emoji: '🐈', isHidup: true },
    { id: 'b2', nama: 'Batu', emoji: '🪨', isHidup: false },
    { id: 'b3', nama: 'Pohon', emoji: '🌳', isHidup: true },
    { id: 'b4', nama: 'Mobil', emoji: '🚗', isHidup: false },
    { id: 'b5', nama: 'Burung', emoji: '🐦', isHidup: true },
    { id: 'b6', nama: 'Kursi', emoji: '🪑', isHidup: false },
    { id: 'b7', nama: 'Bunga', emoji: '🌻', isHidup: true },
    { id: 'b8', nama: 'Buku', emoji: '📖', isHidup: false },
];

const BendaHidupMati: React.FC = () => {
    useSpeakOnMount('Mari belajar benda hidup dan mati');
    
    const [bendaSaatIni, setBendaSaatIni] = useState<Benda | null>(null);
    const [skor, setSkor] = useState(0);
    const [pesan, setPesan] = useState('');
    const [sisaBenda, setSisaBenda] = useState<Benda[]>([...DAFTAR_BENDA].sort(() => Math.random() - 0.5));

    useEffect(() => {
        if (sisaBenda.length > 0 && !bendaSaatIni) {
            setBendaSaatIni(sisaBenda[0]);
        }
    }, [sisaBenda, bendaSaatIni]);

    const handleJawaban = (pilihHidup: boolean) => {
        if (!bendaSaatIni) return;

        if (bendaSaatIni.isHidup === pilihHidup) {
            // Benar
            setPesan('Hebat! Jawabanmu Benar! 🎉');
            setSkor(skor + 1);
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance('Hebat! Benar!');
                u.lang = 'id-ID';
                window.speechSynthesis.speak(u);
            }
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            // Salah
            setPesan('Yah, kurang tepat. Coba lagi! 😊');
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance('Yah kurang tepat');
                u.lang = 'id-ID';
                window.speechSynthesis.speak(u);
            }
        }

        // Lanjut ke benda berikutnya
        setTimeout(() => {
            setPesan('');
            const sisa = sisaBenda.slice(1);
            setSisaBenda(sisa);
            if (sisa.length > 0) {
                setBendaSaatIni(sisa[0]);
            } else {
                setBendaSaatIni(null);
            }
        }, 2000);
    };

    const resetGame = () => {
        setSisaBenda([...DAFTAR_BENDA].sort(() => Math.random() - 0.5));
        setSkor(0);
        setPesan('');
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

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-red)', marginBottom: '10px' }}>
                    Benda Hidup & Mati 🪨
                </h2>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--cat-blue)', marginBottom: '20px' }}>
                    Skor: {skor}
                </div>

                {pesan && (
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: pesan.includes('Hebat') ? 'var(--cat-green)' : 'var(--cat-red)',
                        marginBottom: '20px',
                        animation: 'bounce 0.5s'
                    }}>
                        {pesan}
                    </div>
                )}

                {bendaSaatIni ? (
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '40px',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        margin: '0 auto',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '8rem', marginBottom: '20px', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }}>
                            {bendaSaatIni.emoji}
                        </div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '30px' }}>{bendaSaatIni.nama}</h3>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button 
                                className="btn" 
                                onClick={() => handleJawaban(true)}
                                disabled={!!pesan}
                                style={{ backgroundColor: 'var(--cat-green)', fontSize: '1.5rem', padding: '15px 30px' }}
                            >
                                Hidup 🌱
                            </button>
                            <button 
                                className="btn" 
                                onClick={() => handleJawaban(false)}
                                disabled={!!pesan}
                                style={{ backgroundColor: 'var(--cat-purple)', fontSize: '1.5rem', padding: '15px 30px' }}
                            >
                                Mati 🪨
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '40px',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        margin: '0 auto',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-green)', marginBottom: '20px' }}>
                            Permainan Selesai! 🎉
                        </h2>
                        <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Skor akhirmu: {skor} / {DAFTAR_BENDA.length}</p>
                        <button className="btn" onClick={resetGame} style={{ fontSize: '1.5rem' }}>Main Lagi 🔄</button>
                    </div>
                )}
            </main>
        </>
    );
};

export default BendaHidupMati;
