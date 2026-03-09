import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { startBackgroundMusic, stopBackgroundMusic, isBackgroundMusicPlaying } from '../utils/backgroundMusic';

const floatingBtnStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '3px solid var(--text-color)',
    boxShadow: '4px 4px 0px var(--text-color)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    zIndex: 1000,
    transition: 'all 0.2s ease',
};

// Define menu paths where music should play
const MENU_PATHS = ['/', '/alfabet', '/angka', '/mencocokkan'];

const MusicToggle: React.FC = () => {
    const [playing, setPlaying] = useState(true);
    const [userMuted, setUserMuted] = useState(false); // Track if user explicitly muted
    const location = useLocation();

    // Check if current path is a menu page
    const isMenuPage = MENU_PATHS.includes(location.pathname);

    // Initial setup for interactions
    useEffect(() => {
        const handleInteraction = () => {
            // Only auto-play on first interaction if we are on a menu page and user hasn't muted
            if (isMenuPage && !userMuted && !isBackgroundMusicPlaying()) {
                startBackgroundMusic();
                setPlaying(true);
            }
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    // Handle route changes
    useEffect(() => {
        if (isMenuPage) {
            // Arrived at a menu page - resume if not explicitly muted by user
            if (!userMuted && !isBackgroundMusicPlaying()) {
                startBackgroundMusic();
                setPlaying(true);
            }
        } else {
            // Arrived at a game page - automatically pause, but don't count as user mute
            if (isBackgroundMusicPlaying()) {
                stopBackgroundMusic();
                setPlaying(false);
            }
        }
    }, [location.pathname, isMenuPage, userMuted]);

    const toggleMusic = () => {
        if (playing) {
            stopBackgroundMusic();
            setPlaying(false);
            setUserMuted(true); // User explicitly muted
        } else {
            startBackgroundMusic();
            setPlaying(true);
            setUserMuted(false); // User explicitly unmuted
        }
    };

    return (
        <button
            onClick={toggleMusic}
            style={{
                ...floatingBtnStyle,
                backgroundColor: playing ? 'var(--cat-green)' : 'var(--cat-yellow)',
            }}
            title={playing ? 'Matikan Musik' : 'Nyalakan Musik'}
            aria-label={playing ? 'Matikan Musik' : 'Nyalakan Musik'}
        >
            {playing ? '🔊' : '🔇'}
        </button>
    );
};

export default MusicToggle;
