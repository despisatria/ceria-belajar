import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';

const ALFABET_LEARNING = [
    { id: 'huruf-besar', title: 'Huruf Besar', icon: '🔠', colorClass: 'blue', link: '/alfabet/besar', description: 'Belajar mengenal huruf besar A-Z' },
    { id: 'huruf-kecil', title: 'Huruf Kecil', icon: '🔡', colorClass: 'green', link: '/alfabet/kecil', description: 'Belajar mengenal huruf kecil a-z' },
];

const ALFABET_GAMES = [
    { id: 'besar-kecil', title: 'Huruf Besar & Kecil', icon: '🔠 🔡', colorClass: 'orange', link: '/alfabet/besar-kecil', description: 'Cocokkan huruf besar dengan huruf kecil' },
    { id: 'cocokkan', title: 'Huruf Besar & Gambar', icon: '🔠 🧩', colorClass: 'purple', link: '/alfabet/cocokkan', description: 'Cocokkan huruf besar dengan gambar' },
    { id: 'cocokkan-kecil', title: 'Huruf Kecil & Gambar', icon: '🔡 🧩', colorClass: 'red', link: '/alfabet/cocokkan-kecil', description: 'Cocokkan huruf kecil dengan gambar' },
];

const AlfabetMenu: React.FC = () => {
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

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-blue)', marginBottom: '30px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                    Belajar Alfabet 🔠
                </h2>

                <div className="category-grid" style={{ justifyContent: 'center', display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
                    {ALFABET_LEARNING.map((game) => (
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

                <div style={{ padding: '40px 0', borderTop: '3px dashed rgba(59, 130, 246, 0.3)' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-orange)', marginBottom: '30px' }}>
                        Game Dunia Huruf 🎮
                    </h2>

                    <div className="category-grid" style={{ justifyContent: 'center', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        {ALFABET_GAMES.map((game) => (
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
                </div>

            </main>
        </>
    );
};

export default AlfabetMenu;
