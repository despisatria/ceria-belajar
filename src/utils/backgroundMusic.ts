// Background music player using HTML5 Audio
// Plays a pre-generated cheerful children's melody MP3

let audio: HTMLAudioElement | null = null;
let isPlaying = false;

function getAudio(): HTMLAudioElement {
    if (!audio) {
        audio = new Audio('/audio/backsound.mp3');
        audio.loop = true;
        audio.volume = 0.4;
    }
    return audio;
}

export function startBackgroundMusic() {
    if (isPlaying) return;

    const player = getAudio();
    // Do not reset currentTime so music continues from where it left off
    player.play().then(() => {
        isPlaying = true;
    }).catch(() => {
        // Browser blocked autoplay, will retry on next user gesture
        isPlaying = false;
    });
    isPlaying = true;
}

export function stopBackgroundMusic() {
    if (!audio) return;
    audio.pause();
    // Do not reset currentTime so it can resume later
    isPlaying = false;
}

export function isBackgroundMusicPlaying() {
    return isPlaying;
}
