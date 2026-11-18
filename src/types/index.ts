export type OwOCommand = 'owo hunt' | 'owo battle' | 'owo pray' | 'owo curse';
export type CommandResult = { status: 'waiting' | 'sent' | 'completed', command: OwOCommand, sentAt: number };
export type CurrentStatus = 'idle' | 'running' | 'cooldown' | 'captcha_alert';
export type CooldownTracker = Record<OwOCommand, number>
export type ActionCounter = Record<OwOCommand, number>
export interface BotConfig {
    readonly prefix: string;
    readonly token: string;
    soundPlay: boolean;
    targetServerId: string;
    targetChannelId: string;
    readonly owoBotId: string;
    accountId: string;
    cooldowns: {
        hunt: number;
        battle: number;
        pray: number;
        curse: number
    };
    enableAutoBattle: boolean;
    enableAutoCurse: boolean;
    enableAutoHunt: boolean;
    enableAutoPray: boolean;
    enableAutoInventory: boolean;
    sound?: string;
};