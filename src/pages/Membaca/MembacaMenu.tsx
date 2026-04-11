import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';

const MEMBACA_LEARNING = [
    {
        id: 'dasar',
        title: 'Suku Kata Dasar',
        icon: '🔤',
        colorClass: 'blue',
        link: '/membaca/dasar',
        description: 'Vokal (A,I,U,E,O) & Konsonan: Ba, Bi, Bu...'
    },
    {
        id: 'khusus',
        title: 'Suku Kata Khusus',
        icon: '🌈',
        colorClass: 'green',
        link: '/membaca/khusus',
        description: 'Bunyi NG (Nga, Ngi...) & NY (Nya, Nyi...)'
    },
    {
        id: 'membaca',
        title: 'Membaca Kata 2 Suku Kata',
        icon: '📝',
        colorClass: 'orange',
        link: '/membaca/kata',
        description: 'Gabungkan suku kata menjadi kata: BA + TU = BATU'
    },
    {
        id: 'kata3',
        title: 'Membaca Kata 3 Suku Kata',
        icon: '📖',
        colorClass: 'cyan',
        link: '/membaca/kata3',
        description: 'Gabungkan 3 suku kata: SE + PA + TU = SEPATU'
    },
];
const MembacaMenu: React.FC = () => {
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

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-purple)', marginBottom: '10px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                    Ayo Membaca 📚
                </h2>

                <div style={{ padding: '10px 0' }}>

                    <div className="category-grid" style={{ justifyContent: 'center', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        {MEMBACA_LEARNING.map((item) => (
                            <CategoryCard
                                key={item.id}
                                title={item.title}
                                icon={item.icon}
                                colorClass={item.colorClass as any}
                                link={item.link}
                                description={item.description}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ padding: '40px 0', borderTop: '3px dashed rgba(249, 115, 22, 0.3)' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-orange)', marginBottom: '30px' }}>
                        Game Membaca 📖
                    </h2>

                    <div className="category-grid" style={{ justifyContent: 'center', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        <CategoryCard
                            title="Tebak Kata dari Gambar"
                            icon="🖼️"
                            colorClass="orange"
                            link="/membaca/tebak-kata"
                            description="Lihat gambar, pilih kata yang benar!"
                        />
                        <CategoryCard
                            title="Pasangkan Kata & Gambar"
                            icon="🔗"
                            colorClass="green"
                            link="/membaca/pasangkan-kata"
                            description="Cocokkan kata dengan gambar yang tepat!"
                        />
                        <CategoryCard
                            title="Susun Suku Kata"
                            icon="🧩"
                            colorClass="purple"
                            link="/membaca/susun-suku-kata"
                            description="Susun suku kata menjadi kata yang benar!"
                        />
                    </div>
                </div>

            </main>
        </>
    );
};

export default MembacaMenu;
