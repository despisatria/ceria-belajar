import React from 'react';
import { Link } from 'react-router-dom';

interface GameOverScreenProps {
    /** Whether the player won (lives > 0) */
    isWin: boolean;
    /** Final score to display */
    score: number;
    /** Handler for the "Main Lagi" (Play Again) button */
    onRestart: () => void;
    /** Route path for the "Menu Utama" (Main Menu) link */
    menuLink: string;
    /** Theme color for buttons (e.g. 'var(--cat-blue)') */
    themeColor?: string;
    /** CSS class for the container (from parent's CSS module) */
    className?: string;
    /** CSS class for the score display (from parent's CSS module) */
    scoreClassName?: string;
    /** Custom win message (defaults to "Kamu berhasil menyelesaikan permainan ini!") */
    winMessage?: string;
    /** Custom lose message (defaults to "Jangan menyerah, ayo coba lagi!") */
    loseMessage?: string;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
    isWin,
    score,
    onRestart,
    menuLink,
    themeColor = 'var(--primary)',
    className,
    scoreClassName,
    winMessage = 'Kamu berhasil menyelesaikan permainan ini!',
    loseMessage = 'Jangan menyerah, ayo coba lagi!',
}) => {
    return (
        <div className={`game-over-container ${className || ''}`}>
            {isWin ? (
                <>
                    <h2 className="game-over-title">🎉 Luar Biasa! 🎉</h2>
                    <p className="game-over-desc">{winMessage}</p>
                </>
            ) : (
                <>
                    <h2 className="game-over-title">💔 Kesempatan Habis! 💔</h2>
                    <p className="game-over-desc">{loseMessage}</p>
                </>
            )}
            <div className={`game-over-score ${scoreClassName || ''}`}>Skor Akhir: {score}</div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                    className="btn"
                    onClick={onRestart}
                    style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: themeColor }}
                >
                    🔄 Main Lagi
                </button>
                <Link
                    to={menuLink}
                    className="btn"
                    style={{ fontSize: '1.2rem', padding: '10px 20px', backgroundColor: 'var(--quaternary)' }}
                >
                    ⬅️ Menu Utama
                </Link>
            </div>
        </div>
    );
};

export default GameOverScreen;
