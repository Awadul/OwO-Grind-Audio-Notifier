import { gemInventory, TIER_RANKS } from "../config/inventory.js";
import { GEM_TIERS, type GemInfo, type GemSlot, type GemTier } from "../types/index.js";
import { isGemName } from "../config/inventory.js";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import { config } from "../config/config.js";
import { count } from "node:console";

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
};

export function checkGems(message: Message): void {
    let content = message.content.toLowerCase();
    let maxTierNumber = TIER_RANKS[config.maxGemTier];

    if (!content.includes('gem1')) {
        // find the gems with the equal or lower id from the gemInventory
        const availableGems = Object.values(gemInventory).filter(
            gem => gem.slot === 1 && gem.count > 0 && gem.tierLevel <= maxTierNumber
        ).sort((a, b) => b.tierLevel - a.tierLevel);

        if (availableGems.length == 0) return;

        let selectedGem = availableGems[0];

        if (selectedGem) {
            try {
                message.channel.send(`owo use ${selectedGem.id}`)
            } catch (error) {
                console.error(`[INVENTORY] Can't use the gem ${selectedGem}!`)
            }
        } else {
            console.warn(`[GEMS] No valid Slot 1 gems found under tier ${config.maxGemTier}!`);
        }
    }
}