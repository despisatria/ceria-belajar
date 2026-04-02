import React, { useEffect, useState } from 'react';

interface LivesDisplayProps {
    lives: number;
}

const LivesDisplay: React.FC<LivesDisplayProps> = ({ lives }) => {
    const [animationKey, setAnimationKey] = useState(0);
    const [prevLives, setPrevLives] = useState(lives);

    useEffect(() => {
        if (lives < prevLives) {
            // Trigger a re-render with a new key to restart the CSS animation
            setAnimationKey(prev => prev + 1);
        }
        setPrevLives(lives);
    }, [lives, prevLives]);

    return (
        <span
            key={animationKey}
            className={animationKey > 0 ? 'lives-shake-anim' : ''}
            style={{
                letterSpacing: '5px',
                fontSize: '2rem',
                display: 'inline-block',
            }}
        >
            <style>{`
                @keyframes emptyHeartShake {
                    0% { transform: translateX(0) scale(1.2); filter: drop-shadow(0 0 8px red); }
                    20% { transform: translateX(-5px) scale(1.2) rotate(-10deg); filter: drop-shadow(0 0 12px red); }
                    40% { transform: translateX(5px) scale(1.2) rotate(10deg); filter: drop-shadow(0 0 12px red); }
                    60% { transform: translateX(-5px) scale(1.2) rotate(-5deg); filter: drop-shadow(0 0 8px red); }
                    80% { transform: translateX(5px) scale(1.2) rotate(5deg); filter: drop-shadow(0 0 4px red); }
                    100% { transform: translateX(0) scale(1); filter: drop-shadow(0 0 0px transparent); }
                }
                .lives-shake-anim {
                    animation: emptyHeartShake 0.6s ease-in-out;
                    color: red;
                }
            `}</style>
            {Array(5).fill(0).map((_, i) => i < lives ? '♥️' : '🖤').join('')}
        </span>
    );
};

export default LivesDisplay;
