/**
 * Optimized Audio Utility
 * Manages a single Audio instance to prevent memory leaks and improve responsiveness.
 */

class AudioPlayer {
    private static instance: AudioPlayer;
    private audio: HTMLAudioElement | null = null;

    private constructor() { }

    public static getInstance(): AudioPlayer {
        if (!AudioPlayer.instance) {
            AudioPlayer.instance = new AudioPlayer();
        }
        return AudioPlayer.instance;
    }

    public play(src: string, onEnd?: () => void): void {
        if (!this.audio) {
            this.audio = new Audio();
        } else {
            this.audio.pause();
            this.audio.currentTime = 0;
            // Clear previous event listener
            this.audio.onended = null;
        }

        this.audio.src = src;

        if (onEnd) {
            this.audio.onended = onEnd;
        }

        this.audio.play().catch(err => {
            console.warn('Audio playback failed:', err);
        });
    }

    public stop(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
}

export const audioPlayer = AudioPlayer.getInstance();
