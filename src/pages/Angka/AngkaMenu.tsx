import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';

const ANGKA_GAMES = [
    { id: '0-20', title: 'Angka 0 - 20', icon: '🔢', colorClass: 'green', link: '/angka/0-20', description: 'Kenali angka 0 sampai 20' },
    { id: '21-50', title: 'Angka 21 - 50', icon: '㊿', colorClass: 'blue', link: '/angka/21-50', description: 'Kenali angka 21 sampai 50' },
    { id: '51-100', title: 'Angka 51 - 100', icon: '💯', colorClass: 'purple', link: '/angka/51-100', description: 'Kenali angka 51 sampai 100' },
];

const AngkaMenu: React.FC = () => {
    return (
        <>
            <Header />
            <main className="app-container" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '30px', textAlign: 'left', padding: '0 20px' }}>
                    <Link to="/" className="btn" style={{
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        padding: '12px 24px'
                    }}>
                        ⬅️ Kembali ke Beranda
                    </Link>
                </div>

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-green)', marginBottom: '30px' }}>
                    Belajar Angka 🔢
                </h2>

                <div className="category-grid" style={{ justifyContent: 'center', display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
                    {ANGKA_GAMES.map((game) => (
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

                <div style={{ padding: '40px 0', borderTop: '3px dashed rgba(16, 185, 129, 0.3)' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-orange)', marginBottom: '30px' }}>
                        Game Dunia Angka 🎮
                    </h2>

                    <div className="category-grid" style={{ justifyContent: 'center', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        <CategoryCard
                            title="Hitung Benda"
                            icon="🍎"
                            colorClass="orange"
                            link="/angka/hitung-benda"
                            description="Berapa jumlah benda di layar? Yuk kita hitung bersama!"
                        />
                    </div>
                </div>

            </main>
        </>
    );
};

export default AngkaMenu;
