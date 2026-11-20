import path from "node:path";
import sound from 'sound-play';

const soundPath = path.join(import.meta.dirname, '../assets/sound/ChemmaYGur.mp3')

export function playSound() {
    console.log('[SOUND PLAY] Starting the sound!')
    sound.play(soundPath).catch((err: any) => console.error(`[AUDIO ERROR] couldn't be played! ${err}`));
}