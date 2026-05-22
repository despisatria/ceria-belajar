import React, { useCallback } from 'react';
import BalloonGame, { type BalloonGameItem } from '../../components/games/BalloonGame';
import styles from '../../components/games/BalloonGame.module.css';
import { audioPlayer } from '../../utils/audioPlayer';

const BALLOON_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];

const BalonAngka: React.FC = () => {

    const buildRound = useCallback((round: number) => {
        const targetNumber = Math.floor(Math.random() * 20) + 1;
        const targetCount = Math.min(round, 4);
        const balloonCount = 5 + round;

        const targetItem: BalloonGameItem = {
            id: targetNumber,
            data: { number: targetNumber, colorClass: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)] }
        };

        const generateDecoy = () => {
            let decoyNum = targetNumber;
            while (decoyNum === targetNumber) {
                decoyNum = Math.floor(Math.random() * 20) + 1;
            }
            return {
                id: decoyNum,
                data: { number: decoyNum, colorClass: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)] }
            };
        };

        return {
            target: targetItem,
            targetQuota: targetCount,
            totalBalloons: balloonCount,
            generateDecoy
        };
    }, []);

    const handlePlaySpeech = useCallback((target: BalloonGameItem) => {
        audioPlayer.play(`/audio/balon-angka/${target.data.number}.mp3`);
    }, []);

    return (
        <BalloonGame
            themeColor="var(--cat-blue)"
            menuLink="/angka"
            buildRound={buildRound}
            getBalloonClass={(item) => item.data.colorClass}
            onPlaySpeech={handlePlaySpeech}
            renderInstruction={(target, poppedCount, targetQuota) => (
                <h2 style={{ display: 'inline-block', margin: 0, fontSize: '1.2rem' }}>
                    Pecahkan Balon Angka: <span className={styles.targetNumber}>{target.data.number}</span> <span style={{ fontSize: '1.2rem', color: 'var(--cat-blue)' }}>({poppedCount}/{targetQuota})</span>
                </h2>
            )}
            renderBalloonContent={(item) => (
                <span className={styles.balloonNumber}>{item.data.number}</span>
            )}
        />
    );
};

export default BalonAngka;
