import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            {/* Animated Background Elements */}
            <div className={styles.sun}>☀️</div>
            <div className={`${styles.cloud} ${styles.cloud1}`}>☁️</div>
            <div className={`${styles.cloud} ${styles.cloud2}`}>☁️</div>
            <div className={`${styles.cloud} ${styles.cloud3}`}>☁️</div>

            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>🌈</div>
                <h1 className={styles.logoText}>Ceria Belajar</h1>
            </div>
            <p className={styles.subtitle}>Belajar Senang, Tumbuh Cemerlang.</p>

            {/* Unique decorations — carnival/playground theme */}
            <div className={`${styles.deco} ${styles.deco1}`}>🎈</div>
            <div className={`${styles.deco} ${styles.deco2}`}>🚀</div>
            <div className={`${styles.deco} ${styles.deco3}`}>🚁</div>
            <div className={`${styles.deco} ${styles.deco4}`}>🦋</div>
            <div className={`${styles.deco} ${styles.deco5}`}>⭐️</div>
        </header>
    );
};

export default Header;
