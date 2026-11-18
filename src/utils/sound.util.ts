import path from "node:path";
import sound from 'sound-play';

const soundPath = path.join(import.meta.dirname, '../assets/sound/Alarm (Official Audio) Cheema Y Gur Sidhu Deepak Dhillon.mp3')

export function playSound() {
    sound.play(soundPath).catch((err: any) => console.error(`[AUDIO ERROR] couldn't be played! ${err}`));
}