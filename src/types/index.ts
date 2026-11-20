export type OwOCommand = 'owo hunt' | 'owo battle' | 'owo pray' | 'owo curse';
// export type CommandResult = { status: 'waiting' | 'sent' | 'completed', command: OwOCommand, sentAt: number };
export type CurrentStatus = {
    state: 'idle' | 'running' | 'cooldown' | 'captcha_alert';
    sessionStartedAt: number;
    sessionJitter: number;
};
export type CooldownTracker = Record<OwOCommand, number>
export type ActionCounter = Record<OwOCommand, number>

// setting as const to an array, sets the ts literal type to the elements present in the array
export const GEM_TIERS = ['c', 'u', 'r', 'e', 'm', 'l', 'f'] as const;
// if all the indexed of the GEM_TIERS are iterated what values do we get
export type GemTier = typeof GEM_TIERS[number]; // c' | 'u' | 'r' | 'e' | 'm' | 'l' | 'f'

export const GEM_SLOTS = [1, 3, 4] as const;
export type GemSlot = typeof GEM_SLOTS[number]; // 1 | 2 | 3

// typescript union does the MxN operartions for all gem types generation
export type GemName = `${GemTier}gem${GemSlot}`;


export interface GemInfo {
    name: GemName;
    slot: GemSlot;
    tier: GemTier;
    tierLevel: number;
    id: string;
    count: number;
}

export type GemInventory = Record<GemName, GemInfo>;

export interface BotTask {
    name: OwOCommand,
    cooldownMs: number,
    jitter: [number, number];
    enabled: () => boolean;
    status: 'waiting' | 'sent' | 'completed';
    sentAt: number;
    count: number;
};

export interface BotConfig {
    readonly prefix: string;
    readonly token: string;
    soundPlay: boolean;
    targetServerId: string;
    targetChannelId: string;
    readonly owoBotId: string;
    accountId: string;
    cooldowns: {
        'owo hunt': number;
        'owo battle': number;
        'owo pray': number;
        'owo curse': number
    };
    sessionGap: number;
    enableAutoBattle: boolean;
    enableAutoCurse: boolean;
    enableAutoHunt: boolean;
    enableAutoPray: boolean;
    enableAutoGems: boolean;
    maxGemTier: GemTier;
    sound?: string;
}