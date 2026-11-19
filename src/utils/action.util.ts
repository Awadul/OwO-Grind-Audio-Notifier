import type { Message } from "@deksdeveloper/discord.js-self-bot";

export function isHuntMessage(message: Message): boolean {

    let content = message.content.toLowerCase();

    if (content.includes('hunt') || content.includes('empowered')) {
        return true;
    }
    return false;
}

export function isInventoryMessage(message: Message): boolean {
    return message.content.toLowerCase().includes('inventory')
}