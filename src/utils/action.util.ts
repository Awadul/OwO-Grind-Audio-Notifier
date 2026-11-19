import type { Message } from "@deksdeveloper/discord.js-self-bot";

export function isHuntMessage(message: Message): boolean {

    let content = message.content.toLowerCase();

    if (content.includes('hunt') || content.includes('empowered') || content.includes('spent')) {
        console.log('[HUNT CONFIRMED] OwO Responded to Hunt Message!')
        return true;
    }
    return false;
}

export function isInventoryMessage(message: Message): boolean {

    if (message.content.toLowerCase().includes('inventory')) {
        console.log(`[INVENTORY MESSAGE]: Popped UP!`);
        return true;
    }
    return false;
}