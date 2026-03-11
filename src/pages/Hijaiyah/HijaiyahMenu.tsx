import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';

const HIJAIYAH_GAMES = [
    {
        id: 'mengenal',
        title: 'Huruf Hijaiyah',
        icon: '🕋',
        colorClass: 'green',
        link: '/hijaiyah/mengenal',
        description: 'Mengenal huruf Alif sampai Ya'
    },
    {
        id: 'angka',
        title: 'Angka Hijaiyah',
        icon: '١٢٣',
        colorClass: 'blue',
        link: '/hijaiyah/angka',
        description: 'Mengenal angka 1 sampai 20 dalam tulisan Arab'
    }
];

const HijaiyahMenu: React.FC = () => {
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
                    Dunia Hijaiyah 🕋
                </h2>

                <div className="category-grid" style={{ justifyContent: 'center', display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
                    {HIJAIYAH_GAMES.map((game) => (
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

export default HijaiyahMenu;
