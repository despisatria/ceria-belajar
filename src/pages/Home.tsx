import React from 'react';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';

interface CategoryData {
    id: string;
    title: string;
    icon: string | React.ReactNode;
    colorClass: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'cyan';
    link: string;
    description: string;
}

const CATEGORIES: CategoryData[] = [
    { id: 'alfabet', title: 'Dunia Huruf', icon: '🔠', colorClass: 'blue', link: '/alfabet', description: 'Kenali huruf besar, kecil, dan cocokkan!' },
    { id: 'angka', title: 'Dunia Angka', icon: '🔢', colorClass: 'green', link: '/angka', description: 'Kenali angka dan belajar berhitung' },
    { id: 'hijaiyah', title: 'Dunia Hijaiyah', icon: '🕋', colorClass: 'green', link: '/hijaiyah', description: 'Mengenal huruf dan angka Hijaiyah dasar' },
    { id: 'mencocokkan', title: 'Tebak & Cocok', icon: '🧩', colorClass: 'red', link: '/mencocokkan', description: 'Latih ingatan dengan mencocokkan' },
    { id: 'membaca', title: 'Ayo Membaca', icon: '📚', colorClass: 'purple', link: '/membaca', description: 'Berlatih membaca kata dan kalimat' },
    { id: 'matematika', title: 'Hitung Yuk!', icon: '🧮', colorClass: 'orange', link: '/matematika', description: 'Penjumlahan dan pengurangan seru' },
    { id: 'sains', title: 'Jelajah Alam', icon: '🌍', colorClass: 'cyan', link: '/sains', description: 'Mengenal alam sekitar dan sains dasar' },
];

const Home: React.FC = () => {
    return (
        <>
            <Header />
            <main>
                <div className="category-grid">
                    {CATEGORIES.map((category) => (
                        <CategoryCard
                            key={category.id}
                            title={category.title}
                            icon={category.icon}
                            colorClass={category.colorClass}
                            link={category.link}
                            description={category.description}
                        />
                    ))}
                </div>
            </main>
        </>
    );
};

export default Home;
