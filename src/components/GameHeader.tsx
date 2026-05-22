import React from 'react';
import { Link } from 'react-router-dom';
import LivesDisplay from './LivesDisplay';

/**
 * Shared game header with back button, lives, score, and round display.
 * Used across all game pages for consistent layout.
 *
 * Content below the stats bar (title, subtitle, instruction panel)
 * can be passed as children.
 */
interface GameHeaderProps {
    /** Link back to the menu (e.g., "/membaca") */
    menuLink: string;
    /** Theme color CSS variable (e.g., "var(--cat-orange)") */
    themeColor: string;
    /** CSS Module styles object from the parent game page */
    styles: Record<string, string>;
    /** Current lives count */
    lives?: number;
    /** Current score */
    score?: number;
    /** Current round number */
    round?: number;
    /** Total rounds in the game */
    totalRounds?: number;
    /** Label for the round counter. Default: "Babak" */
    roundLabel?: string;
    /** Optional border bottom color override */
    borderColor?: string;
    /** Hide the stats panel (lives, score, round) completely */
    hideStats?: boolean;
    /** Optional content below the stats bar (title, subtitle, instructions) */
    children?: React.ReactNode;
}

const GameHeader: React.FC<GameHeaderProps> = ({
    menuLink,
    themeColor,
    styles,
    lives = 0,
    score = 0,
    round = 0,
    totalRounds = 0,
    roundLabel = 'Babak',
    borderColor,
    hideStats = false,
    children,
}) => {
    const headerStyle = borderColor ? { borderBottomColor: borderColor } : undefined;

    return (
        <header className={`global-game-header ${styles.gameHeader || ''}`} style={headerStyle}>
            <div className={`global-header-top ${styles.headerTop || ''}`}>
                <Link to={menuLink} className="btn" style={{
                    backgroundColor: themeColor,
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                }}>
                    ⬅️ Kembali
                </Link>
                {!hideStats && (
                    <div className={`global-stats-panel ${styles.statsPanel || ''}`}>
                        <div className={`global-stat-box ${styles.statBox || ''}`}>
                            <span className={`global-stat-label ${styles.statLabel}`}>Kesempatan</span>
                            <LivesDisplay lives={lives} />
                        </div>
                        <div className={`global-stat-box ${styles.statBox || ''}`}>
                            <span className={`global-stat-label ${styles.statLabel}`}>Nilai</span>
                            <span className={`global-stat-value ${styles.statValue || ''}`} style={{ color: themeColor }}>{score}</span>
                        </div>
                        <div className={`global-stat-box ${styles.statBox || ''}`}>
                            <span className={`global-stat-label ${styles.statLabel}`}>{roundLabel}</span>
                            <span className={`global-stat-value ${styles.statValue || ''}`} style={{ color: themeColor }}>
                                {Math.min(round, totalRounds)}/{totalRounds}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            {children}
        </header>
    );
};

export default GameHeader;
