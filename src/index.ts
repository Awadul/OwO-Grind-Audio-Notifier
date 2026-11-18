import { Channel, Client, GuildChannel, Message, type GuildTextBasedChannel } from "@deksdeveloper/discord.js-self-bot";
import sound from 'sound-play';
import path from "node:path";
import { loadEnvFile } from "node:process";

loadEnvFile();

function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`[FATAL] Missing required environment variable: ${key}. Check your .env file!`)
    }
    return value;
};

function isOwOBotMessage(message: any): boolean {
    return message.channelId === config.targetChannelId && message.author?.id === OWO_BOT_ID
};

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function checkCaptcha(message: Message): boolean {
    let content = message.content.toLowerCase();
    const captchaMessages = [
        'beep boop',
        'captcha',
        'verify',
        'human',
        'real',
    ];
    let captchaFound = captchaMessages.some(element => content.includes(element));
    return captchaFound;
}
const OWO_BOT_ID = "408785106942164992";
const TOKEN = getRequiredEnv("TOKEN");
const SERVERID = getRequiredEnv("SERVER_ID");
const CHANNELID = getRequiredEnv("CHANNEL_ID");
const ACCOUNTID = getRequiredEnv("ACCOUNT_ID");
const soundPath = path.join(import.meta.dirname, './src/sound/Alarm (Official Audio) Cheema Y Gur Sidhu Deepak Dhillon.mp3')


type OwOCommand = 'owo hunt' | 'owo battle' | 'owo pray' | 'owo curse';
type CommandResult = { status: 'waiting' | 'sent' | 'completed', command: OwOCommand, sentAt: number };
type CurrentStatus = 'idle' | 'running' | 'cooldown' | 'captcha_alert';
type CooldownTracker = Record<OwOCommand, number>

interface BotConfig {
    readonly prefix: string;
    targetServerId: string;
    targetChannelId: string;
    accountId: string;
    cooldowns: {
        hunt: number;
        battle: number;
        pray: number;
        curse: number
    };
    enableAutoBattle: boolean;
    enableAutoHunt: boolean;
    enableAutoPray: boolean;
};

const config: BotConfig = {
    prefix: 'owo',
    targetServerId: SERVERID,
    targetChannelId: CHANNELID,
    accountId: ACCOUNTID,
    cooldowns: {
        hunt: 17000,
        battle: 19000,
        pray: 350,
        curse: 380
    },
    enableAutoBattle: true,
    enableAutoHunt: true,
    enableAutoPray: false
};
const lastRan: CooldownTracker = {
    "owo battle": 0,
    "owo curse": 0,
    "owo hunt": 0,
    "owo pray": 0
}
let currentStatus: CurrentStatus = 'idle';
let huntCommand: CommandResult = { status: 'waiting', command: 'owo hunt', sentAt: 0 }
let battleCommand: CommandResult = { status: 'waiting', command: 'owo battle', sentAt: 0 }
const client = new Client();

client.on("messageCreate", async (message: Message) => {

    if (message.channelId != config.targetChannelId) return;
    if (currentStatus == 'idle' && message.content != 'start') return;

    if (currentStatus != "running" && message.content == 'start' && message.author?.id == config.accountId) {
        currentStatus = 'running';

        BotLoop();
        return;
    }

    if (isOwOBotMessage(message)) {
        console.log("OwO Replied: ", message);

        if (checkCaptcha(message)) {
            currentStatus = 'captcha_alert';
            console.log("Have to put some hard pull for captcha reminder");
            sound.play(soundPath).catch((err: any) => console.error(err));
            return;
        }
    }
});

function jitter(min: number, max: number): number {
    let additionalWait = Math.random() * (max - min) + min;
    return additionalWait;
}

async function BotLoop() {
    const channelLink = await client.channels.fetch(config.targetChannelId) as GuildTextBasedChannel;
    while (currentStatus == 'running') {

        const now = Date.now();
        let huntCooldown: number = config.cooldowns.hunt + jitter(2000, 8000);

        if (config.enableAutoHunt && now - lastRan[huntCommand.command] > huntCooldown) {
            await channelLink.send(huntCommand.command);
            lastRan[huntCommand.command] = now;
            console.log('[ACTION] Sent: owo hunt');
            await sleep(4000);
        }

        if (currentStatus != "running")
            break;

        let battleCooldown: number = config.cooldowns.battle + jitter(3000, 10000);
        if (config.enableAutoBattle && now - lastRan[battleCommand.command] > battleCooldown) {
            await channelLink.send(battleCommand.command);
            lastRan[battleCommand.command] = Date.now();
            console.log('[ACTION] Sent: owo battle');
            await sleep(jitter(1500, 3000))
        }

        await sleep(5000);
    }
}
client.once('ready', async () => {
    if (!client.user)
        return;

    console.log(`${client.user.username} is ready`);
});

client.login(TOKEN);