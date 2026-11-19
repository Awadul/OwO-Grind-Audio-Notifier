import { Client, Message, type GuildTextBasedChannel } from "@deksdeveloper/discord.js-self-bot";
import { sleep, jitter } from "./utils/timer.util.js";
import { checkCaptcha } from "./utils/captcha.util.js";
import { playSound } from "./utils/sound.util.js";
import type { CooldownTracker, CurrentStatus, CommandResult, ActionCounter } from "./types/index.js";
import { config } from "./config/config.js";
import { checkGems, parseGems } from "./utils/inventory.util.js";
import { isHuntMessage, isInventoryMessage } from "./utils/action.util.js";

function isOwOBotMessage(message: Message): boolean {
    return message.channelId === config.targetChannelId && message.author?.id === config.owoBotId
};

const lastRan: CooldownTracker = {
    "owo battle": 0,
    "owo curse": 0,
    "owo hunt": 0,
    "owo pray": 0
};

let currentStatus: CurrentStatus = 'idle';
let huntCommand: CommandResult = { status: 'waiting', command: 'owo hunt', sentAt: 0 }
let battleCommand: CommandResult = { status: 'waiting', command: 'owo battle', sentAt: 0 }
let actionCounter: ActionCounter = { "owo hunt": 0, 'owo battle': 0, 'owo pray': 0, 'owo curse': 0 };

const client = new Client();

client.on("messageCreate", async (message: Message) => {

    if (message.channelId != config.targetChannelId) return;
    if (currentStatus == 'idle' && message.content != 'start') return;

    if (currentStatus != "running" && message.content == 'start' && message.author?.id == config.accountId) {
        currentStatus = 'running';
        console.log(`[BOT STATUS] BOT STARTED!`);
        message.channel.send("owo inv");
        BotLoop();
        return;
    }

    if (currentStatus == "running" && message.content == 'stop' && message.author?.id == config.accountId) {
        currentStatus = 'idle';
        console.log(`[BOT STATUS] BOT STOPPED!`);
        return;
    }

    if (isOwOBotMessage(message)) {
        console.log(`Owo Replied: ${message.content || `[Embed/Image]`}`);

        if (checkCaptcha(message)) {
            currentStatus = 'captcha_alert';
            console.log(`[ALERT] CAPTCHA APPEARED!`);
            if (config.soundPlay)
                playSound();
            return;
        }

        if (isInventoryMessage(message)) {
            parseGems(message);
        }

        if (isHuntMessage(message)) {
            checkGems(message);
        }

    }
});

async function BotLoop() {
    const channelLink = await client.channels.fetch(config.targetChannelId) as GuildTextBasedChannel;
    while (currentStatus == 'running') {

        const now = Date.now();
        let huntCooldown: number = config.cooldowns.hunt + jitter(2000, 8000);

        if (config.enableAutoHunt && now - lastRan[huntCommand.command] > huntCooldown) {
            try {
                await channelLink.send(huntCommand.command);
                lastRan[huntCommand.command] = now;
                actionCounter[huntCommand.command] += 1;
                console.log('[ACTION] Sent: owo hunt');
            } catch (error: any) {
                console.error(`[ERROR] Couldn't send the action! [HUNT]: ${error}`);
            }
            await sleep(4000);
        }

        if (currentStatus != "running")
            break;

        let battleCooldown: number = config.cooldowns.battle + jitter(3000, 10000);
        if (config.enableAutoBattle && now - lastRan[battleCommand.command] > battleCooldown) {
            try {
                await channelLink.send(battleCommand.command);
                lastRan[battleCommand.command] = Date.now();
                actionCounter[battleCommand.command] += 1;
                console.log('[ACTION] Sent: owo battle');
            } catch (error) {
                console.error(`[ERROR] Couldn't send the action! [BATTLE]: ${error}`);
            }
            await sleep(jitter(1500, 3000))
        }

        await sleep(5000);
    }
};

client.once('ready', async () => {
    if (!client.user)
        return;

    console.log(`${client.user.username} is ready`);
});

client.login(config.token);