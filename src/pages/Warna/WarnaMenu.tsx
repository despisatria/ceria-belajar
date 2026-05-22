import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

const WARNA_GAMES = [
    { id: 'mengenal', title: 'Mengenal Warna', icon: '🌈', colorClass: 'blue', link: '/warna/mengenal', description: 'Belajar nama-nama warna di sekitar kita' },
    { id: 'cocokkan-warna', title: 'Warna & Gambar', icon: '🎨', colorClass: 'orange', link: '/warna/cocokkan-warna', description: 'Cocokkan warna dengan gambar yang sesuai' },
    { id: 'belajar-campur', title: 'Belajar Campur', icon: '🪄', colorClass: 'pink', link: '/warna/belajar-campur', description: 'Belajar perpaduan dua warna' },
    { id: 'campur-warna', title: 'Game Campur Warna', icon: '🧪', colorClass: 'red', link: '/warna/campur-warna', description: 'Bermain mencampur dua warna' },
    { id: 'kelompokkan-warna', title: 'Mewarnai Pintar', icon: '🖌️', colorClass: 'green', link: '/warna/kelompokkan-warna', description: 'Isi warna pada bidang gambar' },
    { id: 'balon-warna', title: 'Balon Warna', icon: '🎈', colorClass: 'pink', link: '/warna/balon-warna', description: 'Pecahkan balon sesuai warna yang diminta' },
    { id: 'pancing-warna', title: 'Pancing Warna', icon: '🎣', colorClass: 'cyan', link: '/warna/pancing-warna', description: 'Pancing ikan dengan warna yang benar' },
    { id: 'mewarnai', title: 'Mewarnai Canvas', icon: '🖌️', colorClass: 'purple', link: '/warna/mewarnai', description: 'Warnai canvas kosong sesukamu' },
    { id: 'buku-mewarnai', title: 'Buku Mewarnai', icon: '🖍️', colorClass: 'yellow', link: '/warna/buku-mewarnai', description: 'Warnai berbagai macam gambar keren' },
];

const WarnaMenu: React.FC = () => {
    useSpeakOnMount('Dunia Warna');

    return (
        <>
            <Header />
            <main className="app-container" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '30px', textAlign: 'left', padding: '0 20px' }}>
                    <Link to="/" className="btn" style={{
                        backgroundColor: 'var(--text-color)',
                        textTransform: 'none',
                        fontSize: '1.2rem',
                        padding: '12px 24px'
                    }}>
                        ⬅️ Kembali ke Beranda
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-cyan)', marginBottom: '30px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                    Dunia Warna 🎨
                </h2>

                <div className="category-grid">
                    {WARNA_GAMES.map((game) => (
                        <CategoryCard
                            key={game.id}
                            title={game.title}
                            icon={game.icon}
                            colorClass={game.colorClass as 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'cyan'}
                            link={game.link}
                            description={game.description}
                        />
                    ))}
                </div>
            </main>
        </>
    );
};

export default WarnaMenu;
