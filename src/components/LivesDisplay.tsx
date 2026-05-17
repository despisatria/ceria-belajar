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
            className={`lives-display ${animationKey > 0 ? 'lives-shake-anim' : ''}`}
        >
            <style>{`
                .lives-display {
                    letter-spacing: 5px;
                    font-size: 2rem;
                    display: inline-block;
                }
                @media (max-width: 600px) {
                    .lives-display {
                        font-size: 1.2rem;
                        letter-spacing: 3px;
                    }
                }
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
