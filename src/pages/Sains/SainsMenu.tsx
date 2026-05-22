import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';
import { useSpeakOnMount } from '../../hooks/useSpeakOnMount';

const SAINS_GAMES = [
    { id: 'hewan', title: 'Mengenal Hewan', icon: '🦁', colorClass: 'orange', link: '/sains/hewan', description: 'Kenali berbagai hewan dan suaranya' },
    { id: 'tumbuhan', title: 'Bagian Tumbuhan', icon: '🌳', colorClass: 'green', link: '/sains/tumbuhan', description: 'Belajar bagian-bagian pohon dan bunga' },
    { id: 'cuaca', title: 'Mengenal Cuaca', icon: '🌤️', colorClass: 'cyan', link: '/sains/cuaca', description: 'Cerah, hujan, atau berawan?' },
    { id: 'tata-surya', title: 'Tata Surya', icon: '🪐', colorClass: 'purple', link: '/sains/tata-surya', description: 'Jelajahi luar angkasa dan planet' },
    { id: 'hidup-mati', title: 'Hidup atau Mati', icon: '🪨', colorClass: 'red', link: '/sains/hidup-mati', description: 'Kelompokkan benda hidup dan benda mati' },
];

const SainsMenu: React.FC = () => {
    useSpeakOnMount('Jelajah Alam');

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

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-green)', marginBottom: '30px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                    Jelajah Alam 🌍
                </h2>

                <div className="category-grid">
                    {SAINS_GAMES.map((game) => (
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

export default SainsMenu;
