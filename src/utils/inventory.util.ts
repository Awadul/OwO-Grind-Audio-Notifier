import { gemInventory, TIER_RANKS } from "../config/inventory.js";
import { GEM_TIERS, type GemInfo, type GemSlot, type GemTier } from "../types/index.js";
import { isGemName } from "../config/inventory.js";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import { config } from "../config/config.js";

const superMap: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
};

function parseUniCodeSubscript(inventoryText: string) {
    const normalizedInventoryText = inventoryText.replaceAll(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, match => superMap[match] ?? match)
    return normalizedInventoryText;
}

export function parseGems(message: Message): void {

    const normalized = parseUniCodeSubscript(message.content.toLowerCase());

    const regex: any = /`(\d+)`<a?:([a-zA-Z0-9_]+):\d+>([0123456789]+)/g

    for (const match of normalized.matchAll(regex)) {
        const [, id, name, rawCount] = match;

        if (id && name && rawCount && isGemName(name)) {
            // Extract tier and slot directly from name
            // e.g. "cgem1" -> tier = 'c', slot = 1

            const tier = name[0] as GemTier;
            const slot = Number(name.slice(-1)) as GemSlot;

            gemInventory[name] = {
                name,
                slot,
                tier,
                tierLevel: TIER_RANKS[tier],
                id,
                count: Number(rawCount)
            }
        }
    }
    console.log('[INVENTORY SNAPSHOT] Saved the inventory gems!');
    console.log(`GEMS SNAPSHOT: `);
    console.dir(gemInventory, { depth: null, colors: true });
};

export function checkGems(message: Message): void {

    let gemString: string = 'owo use ';
    if (!config.enableAutoGems) return;

    let content = message.content.toLowerCase();
    let maxTierNumber = TIER_RANKS[config.maxGemTier];

    const gemsTypes: string[] = ['gem1', 'gem3', 'gem4'];
    for (let gemSlot of gemsTypes) {
        if (!content.includes(gemSlot)) {
            // find the gems with the equal or lower id from the gemInventory
            const availableGems = Object.values(gemInventory).filter(
                gem => gem.slot === Number(gemSlot.slice(-1)) && gem.count > 0 && gem.tierLevel <= maxTierNumber
            ).sort((a, b) => b.tierLevel - a.tierLevel);

            // particular gemSlot has no gems left
            if (availableGems.length == 0) continue;

            let selectedGem = availableGems[0];

            if (selectedGem) {
                try {
                    selectedGem.count -= 1;
                    gemString += selectedGem.id + ' ';
                } catch (error) {
                
                    console.error(`[INVENTORY] Can't use the gem ${selectedGem.name}!`)
                }
            } else {
                console.warn(`[GEMS] No valid Slot 1 gems found under tier ${config.maxGemTier}!`);
            }
        }
    }
    if (gemString.trim() != 'owo use')
        message.channel.send(gemString);
}