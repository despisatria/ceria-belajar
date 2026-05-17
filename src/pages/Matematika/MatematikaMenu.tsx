import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';

const MatematikaMenu: React.FC = () => {
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

                <h2 style={{ fontSize: '2.5rem', color: 'var(--cat-pink)', marginBottom: '10px' }}>
                    Dunia Matematika 🧮
                </h2>

                <div style={{ padding: '10px 0' }}>

                    <div className="category-grid">
                        <CategoryCard
                            title="Belajar Penjumlahan"
                            icon="➕"
                            colorClass="blue"
                            link="/matematika/penjumlahan"
                            description="Mari belajar menambah benda menjadi lebih banyak!"
                        />
                        <CategoryCard
                            title="Belajar Pengurangan"
                            icon="➖"
                            colorClass="orange"
                            link="/matematika/pengurangan"
                            description="Mari belajar mengurangi benda yang ada!"
                        />
                        <CategoryCard
                            title="Katak Penjumlah"
                            icon="🐸"
                            colorClass="green"
                            link="/matematika/penjumlahan-garis"
                            description="Bantu katak melompat maju untuk menjumlah angka!"
                        />
                        <CategoryCard
                            title="Katak Pengurang"
                            icon="🐸"
                            colorClass="red"
                            link="/matematika/pengurangan-garis"
                            description="Bantu katak melompat mundur untuk mengurangi angka!"
                        />
                    </div>
                </div>

                <div style={{ padding: '40px 0', borderTop: '3px dashed rgba(236, 72, 153, 0.3)' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--cat-blue)', marginBottom: '30px' }}>
                        Game Matematika 🎮
                    </h2>

                    <div className="category-grid">
                        <CategoryCard
                            title="Kuis Tambah Apel"
                            icon="🍎"
                            colorClass="blue"
                            link="/matematika/kuis-tambah"
                            description="Main kuis penjumlahan seru dengan gambar apel!"
                        />
                        <CategoryCard
                            title="Kuis Kurang Kue"
                            icon="🍪"
                            colorClass="orange"
                            link="/matematika/kuis-kurang"
                            description="Main kuis pengurangan seru dengan gambar kue!"
                        />
                        <CategoryCard
                            title="Tebak Lompatan Maju"
                            icon="🐸"
                            colorClass="green"
                            link="/matematika/tebak-lompat-maju"
                            description="Tebak di angka mana katak mendarat setelah melompat maju!"
                        />
                        <CategoryCard
                            title="Tebak Lompatan Mundur"
                            icon="🐸"
                            colorClass="red"
                            link="/matematika/tebak-lompat-mundur"
                            description="Tebak di angka mana katak mendarat setelah melompat mundur!"
                        />
                        <CategoryCard
                            title="Cocokkan Penjumlahan"
                            icon="🔗"
                            colorClass="blue"
                            link="/matematika/cocok-tambah"
                            description="Tarik garis untuk mencocokkan soal penjumlahan dengan hasilnya!"
                        />
                        <CategoryCard
                            title="Cocokkan Pengurangan"
                            icon="🔗"
                            colorClass="orange"
                            link="/matematika/cocok-kurang"
                            description="Tarik garis untuk mencocokkan soal pengurangan dengan hasilnya!"
                        />
                    </div>
                </div>

            </main>
        </>
    );
};

export default MatematikaMenu;
