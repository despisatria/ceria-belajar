import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';

const MENCOCOKKAN_GAMES = [
    { id: 'gambar-sama', title: 'Cari Gambar Sama', icon: '🔍', colorClass: 'red', link: '/mencocokkan/gambar-sama', description: 'Temukan dan cocokkan dua gambar yang sama' },
    { id: 'gambar-berpasangan', title: 'Pasangkan Gambar', icon: '🔗', colorClass: 'blue', link: '/mencocokkan/gambar-berpasangan', description: 'Cocokkan gambar yang saling berkaitan' },
    { id: 'cocokkan-warna', title: 'Warna & Gambar', icon: '🎨', colorClass: 'orange', link: '/mencocokkan/cocokkan-warna', description: 'Cocokkan warna dengan gambar yang sesuai' },
    { id: 'cocokkan-bayangan', title: 'Tebak Bayangan', icon: '👤🧑🏻‍💼', colorClass: 'purple', link: '/mencocokkan/cocokkan-bayangan', description: 'Cocokkan benda dengan siluet hitamnya' },
    { id: 'cocokkan-bentuk', title: 'Tebak Bentuk', icon: '🟠🍊', colorClass: 'green', link: '/mencocokkan/cocokkan-bentuk', description: 'Pasangkan benda dengan bentuk dasarnya' },
    { id: 'cocokkan-induk-anak', title: 'Hewan yang Mirip', icon: '🐣🐓', colorClass: 'cyan', link: '/mencocokkan/cocokkan-induk-anak', description: 'Pasangkan hewan dengan hewan lain yang mirip' },
];

const MencocokkanMenu: React.FC = () => {
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

                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '30px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                    Game Tebak & Cocok
                </h2>

                <div className="category-grid" style={{ justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                    {MENCOCOKKAN_GAMES.map((game) => (
                        <CategoryCard
                            key={game.id}
                            title={game.title}
                            icon={game.icon}
                            colorClass={game.colorClass as any}
                            link={game.link}
                            description={game.description}
                        />
                    ))}
                </div>

            </main>
        </>
    );
};

export default MencocokkanMenu;
