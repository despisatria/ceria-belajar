import React, { useCallback } from 'react';
import CatchGame, { type CatchItem } from '../../components/games/CatchGame';
import styles from '../../components/games/CatchGame.module.css';
import { shuffleArray } from '../../utils/helpers';

const COLORS = [
    { id: 'merah', name: 'Merah', hex: '#E53935' },
    { id: 'kuning', name: 'Kuning', hex: '#FDD835' },
    { id: 'biru', name: 'Biru', hex: '#1E88E5' },
    { id: 'hijau', name: 'Hijau', hex: '#43A047' },
    { id: 'oranye', name: 'Oranye', hex: '#FB8C00' },
    { id: 'ungu', name: 'Ungu', hex: '#8E24AA' },
];

const PancingWarna: React.FC = () => {
    const buildRound = useCallback(() => {
        const correctColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const otherColors = COLORS.filter(c => c.id !== correctColor.id);
        const distractors = shuffleArray([...otherColors]).slice(0, 4);

        const allColors = shuffleArray([correctColor, ...distractors]);
        
        const targetItem: CatchItem = {
            id: correctColor.id,
            data: correctColor
        };
        
        const allItems: CatchItem[] = allColors.map(c => ({
            id: c.id,
            data: c
        }));

        return { target: targetItem, allItems };
    }, []);

    return (
        <CatchGame
            title="Pancing Warna! 🎣"
            subtitle="Tangkap ikan dengan warna yang benar"
            themeColor="var(--cat-cyan)"
            menuLink="/warna"
            totalRounds={5}
            winMessage="Kamu berhasil menangkap ikan yang tepat!"
            loseMessage="Jangan menyerah, ayo coba pancing lagi!"
            buildRound={buildRound}
            getSpeechText={(target) => `Tangkaplah ikan warna ${target.data.name}!`}
            renderInstruction={(target) => (
                <div className={styles.instructionArea}>
                    <h2 className={styles.instructionText} style={{ marginBottom: '20px' }}>Tangkaplah Ikan warna:</h2>
                    <div className={styles.targetEmojiWrapper} style={{ backgroundColor: target.data.hex }}>
                        <span className={styles.targetEmoji} style={{ color: 'white', textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>{target.data.name}</span>
                    </div>
                </div>
            )}
            renderFishContent={(item) => (
                <div className={styles.fishEmoji} style={{ position: 'relative', width: '80px', height: 'auto', marginTop: '5px' }}>
                    <svg viewBox="10 10 105 55" style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))' }}>
                        <g fill={item.data.hex} stroke="rgba(0,0,0,0.15)" strokeWidth="3">
                            {/* Ekor */}
                            <path d="M 90,40 L 115,20 C 110,35 110,45 115,60 Z" strokeLinejoin="round" />
                            {/* Sirip Atas */}
                            <path d="M 40,25 C 50,10 65,15 75,28 Z" />
                            {/* Sirip Bawah */}
                            <path d="M 45,55 C 55,65 65,60 70,52 Z" />
                            {/* Badan utama */}
                            <path d="M 10,40 C 10,15 50,15 90,40 C 50,65 10,65 10,40 Z" />
                        </g>
                        {/* Mata */}
                        <circle cx="30" cy="35" r="7" fill="white" />
                        <circle cx="27" cy="35" r="3.5" fill="#1e293b" />
                        {/* Senyum */}
                        <path d="M 20,48 Q 28,52 32,46" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Insang */}
                        <path d="M 45,35 Q 50,40 45,48" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" />
                        {/* Sisik (Scales) */}
                        <path d="M 60,30 Q 65,35 60,40" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 70,35 Q 75,40 70,45" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 62,45 Q 67,50 62,55" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            )}
        />
    );
};

export default PancingWarna;
