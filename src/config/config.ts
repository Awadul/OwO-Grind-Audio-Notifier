import type { BotConfig } from "../types/index.js";
import { getRequiredEnv } from "../utils/load_environment.util.js";
import { loadEnvFile } from "node:process";
loadEnvFile();

export const config: BotConfig = {
    prefix: 'owo',
    owoBotId: "408785106942164992",
    soundPlay: true,
    token: getRequiredEnv("TOKEN"),
    targetServerId: getRequiredEnv("SERVER_ID"),
    targetChannelId: getRequiredEnv("CHANNEL_ID"),
    accountId: getRequiredEnv("ACCOUNT_ID"),
    cooldowns: {
        hunt: 17000,
        battle: 19000,
        pray: 350000,
        curse: 380000
    },
    enableAutoBattle: true,
    enableAutoCurse: false,
    enableAutoHunt: true,
    enableAutoGems: false,
    enableAutoPray: false,
    maxGemTier: 'm'
};