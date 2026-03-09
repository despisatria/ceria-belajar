// Type declaration for ResponsiveVoice.js (loaded via CDN)
interface ResponsiveVoiceAPI {
    speak(text: string, voice: string, params?: {
        pitch?: number;
        rate?: number;
        volume?: number;
        onstart?: () => void;
        onend?: () => void;
        onerror?: (e: unknown) => void;
    }): void;
    cancel(): void;
    isPlaying(): boolean;
    voiceSupport(): boolean;
}

declare global {
    interface Window {
        responsiveVoice: ResponsiveVoiceAPI;
    }
}

export { };
