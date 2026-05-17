import { useEffect } from 'react';

/**
 * Custom hook to speak an Indonesian text instruction when the component mounts.
 * Uses the Web Speech API (SpeechSynthesis).
 *
 * @param text - The text to be spoken in Indonesian (id-ID).
 * @param rate - Speech rate (default: 0.9 for child-friendly pace).
 */
export function useSpeakOnMount(text: string, rate: number = 0.9): void {
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = rate;
            window.speechSynthesis.speak(utterance);
        }

        return () => {
            // Clean up speech on unmount to prevent orphaned audio
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);
}
