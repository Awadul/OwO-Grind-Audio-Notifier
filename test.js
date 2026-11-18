import sound from 'sound-play';
import path from 'node:path';
import fs from 'node:fs'
const soundPath = path.join(import.meta.dirname, './src/sound/Alarm (Official Audio) Cheema Y Gur Sidhu Deepak Dhillon.mp3')

console.log('File exists:', fs.existsSync(soundPath), soundPath);
sound.play(soundPath).catch(error => console.error(error));
