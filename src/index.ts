import { Client, Message, type ErrorEvent, type GuildTextBasedChannel } from "@deksdeveloper/discord.js-self-bot";
import { sleep, jitter } from "./utils/timer.util.js";
import { checkCaptcha } from "./utils/captcha.util.js";
import { playSound } from "./utils/sound.util.js";
import type { CurrentStatus, BotTask } from "./types/index.js";
import { config } from "./config/config.js";
import { checkGems, parseGems } from "./utils/inventory.util.js";
import { isHuntMessage, isInventoryMessage } from "./utils/action.util.js";
import { errorHandler } from "./utils/error.util.js";

function isOwOBotMessage(message: Message): boolean {
    return message.channelId === config.targetChannelId && message.author?.id === config.owoBotId
};

let currentStatus: CurrentStatus = {
    state: 'idle',
    sessionStartedAt: Date.now(),
    sessionJitter: jitter(100000, 400000)
}
const TASKS: BotTask[] = [
    { name: 'owo hunt', status: 'waiting', cooldownMs: config.cooldowns['owo hunt'], jitter: [2000, 8000], enabled: () => config.enableAutoHunt, sentAt: 0, count: 0 },
    { name: 'owo battle', status: 'waiting', cooldownMs: config.cooldowns['owo battle'], jitter: [4000, 10000], enabled: () => config.enableAutoBattle, sentAt: 0, count: 0 },
    { name: 'owo pray', status: 'waiting', cooldownMs: config.cooldowns['owo pray'], jitter: [100000, 150000], enabled: () => config.enableAutoPray, sentAt: 0, count: 0 },
    { name: 'owo curse', status: 'waiting', cooldownMs: config.cooldowns['owo curse'], jitter: [150000, 200000], enabled: () => config.enableAutoCurse, sentAt: 0, count: 0 },
];
const client = new Client();

client.on("messageCreate", async (message: Message) => {

    if (message.channelId != config.targetChannelId) return;
    if (currentStatus.state == 'idle' && message.content != 'start') return;

    if (currentStatus.state != "running" && message.content == 'start' && message.author?.id == config.accountId) {
        currentStatus.state = 'running';
        currentStatus.sessionStartedAt = Date.now();
        setTimeout(() => message.channel.send("owo inv"), 20000 + jitter(2000, 7000));
        console.log(`[BOT STATUS] BOT STARTED!`);
        BotLoop();
        return;
    }

    if (currentStatus.state == "running" && message.content == 'stop' && message.author?.id == config.accountId) {
        currentStatus.state = 'idle';
        console.log(`[BOT STATUS] BOT STOPPED!`);
        return;
    }

    if (isOwOBotMessage(message)) {
        console.log(`Owo Replied: ${message.content || `[Embed/Image]`}`);

        if (checkCaptcha(message)) {
            currentStatus.state = 'captcha_alert';
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

    while (currentStatus.state == 'running') {

        const now = Date.now();

        if (config.enableSessionGap && now - currentStatus.sessionStartedAt > config.sessionGap + currentStatus.sessionJitter) {
            console.log(`[Session Break]: Going to sleep for: `, currentStatus.sessionJitter / 60000)
            await sleep(currentStatus.sessionJitter);
            currentStatus.sessionJitter = jitter(600000, 1800000);
            currentStatus.sessionStartedAt = Date.now();
        }

        // random the script
        if (Math.random() > 0.3 && TASKS[0] && TASKS[1]) {
            let temp = TASKS[0];
            TASKS[0] = TASKS[1];
            TASKS[1] = temp;
        }
        for (let task of TASKS) {

            let taskCooldown: number = config.cooldowns[task.name] + jitter(...task.jitter)
            try {
                if (task.enabled() && now - task.sentAt > taskCooldown) {

                    await channelLink.sendTyping();
                    await sleep(jitter(1200, 2400));
                    if (currentStatus.state !== 'running')
                        return;
                    await channelLink.send(task.name);
                    task.sentAt = now;
                    task.count += 1;
                    console.log(`[ACTION SENT] ${task.name}`)

                    await sleep(jitter(3000, 7000));
                }
            } catch (error) {
                if (errorHandler(error)) {
                    currentStatus.state = 'idle';
                    break;
                }
            }
        }
        await sleep(5000);
    }
};

client.once('ready', async () => {
    if (!client.user)
        return;

    console.log(`${client.user.username} is ready`);
});

(async () => {
    try {
        await client.login(config.token);
    } catch (error: any) {

        console.error('[LOGIN ERROR] Failed to authenticate with Discord:');

        if (error.code === 'TOKEN_INVALID' || error.message?.includes('TOKEN_INVALID')) {
            console.error('[INVALID TOKEN] UPDATE .env!');
        } else {
            console.error(error);
        }
    }
})();