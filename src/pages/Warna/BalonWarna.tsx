import React, { useCallback } from 'react';
import BalloonGame, { type BalloonGameItem } from '../../components/games/BalloonGame';

const COLORS = [
    { id: 'merah', name: 'Merah', hex: '#E53935' },
    { id: 'kuning', name: 'Kuning', hex: '#FDD835' },
    { id: 'biru', name: 'Biru', hex: '#1E88E5' },
    { id: 'hijau', name: 'Hijau', hex: '#43A047' },
    { id: 'oranye', name: 'Oranye', hex: '#FB8C00' },
    { id: 'ungu', name: 'Ungu', hex: '#8E24AA' },
];

const BalonWarna: React.FC = () => {

    const buildRound = useCallback((round: number) => {
        const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        // Fixed quota of 3 for BalonWarna, or we can increase it slightly
        const targetCount = 3;
        const balloonCount = 8 + round;

        const targetItem: BalloonGameItem = {
            id: targetColor.id,
            data: targetColor
        };

        const generateDecoy = () => {
            const otherColors = COLORS.filter(c => c.id !== targetColor.id);
            const decoyColor = otherColors[Math.floor(Math.random() * otherColors.length)];
            return {
                id: decoyColor.id,
                data: decoyColor
            };
        };

        return {
            target: targetItem,
            targetQuota: targetCount,
            totalBalloons: balloonCount,
            generateDecoy
        };
    }, []);

    return (
        <BalloonGame
            title="Balon Warna 🎈"
            themeColor="var(--cat-purple)"
            menuLink="/warna"
            totalRounds={5}
            winMessage="Hebat! Kamu penembak jitu yang handal!"
            loseMessage="Jangan menyerah, ayo coba lagi!"
            buildRound={buildRound}
            getBalloonStyle={(item) => ({ backgroundColor: item.data.hex })}
            getSpeechText={(target) => `Pecahkan balon warna ${target.data.name}!`}
            renderInstruction={(target, poppedCount, targetQuota) => (
                <div style={{ textAlign: 'center', marginTop: '10px', display: 'inline-block' }}>
                    <span style={{ fontSize: '1.2rem', color: 'var(--quaternary)', fontWeight: 'bold' }}>Pecahkan balon warna: </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: target.data.hex, backgroundColor: 'white', padding: '5px 15px', borderRadius: '15px', border: `3px solid ${target.data.hex}` }}>
                        {target.data.name}
                    </span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--cat-purple)', marginLeft: '10px' }}>({poppedCount}/{targetQuota})</span>
                </div>
            )}
            renderBalloonContent={() => null}
        />
    );
};

export default BalonWarna;
