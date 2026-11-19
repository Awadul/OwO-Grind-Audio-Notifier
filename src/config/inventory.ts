import type { constants } from "buffer";
import type { GemInventory, GemName, GemTier } from "../types/index.js";

export const gemInventory = {} as GemInventory;

export function isGemName(name: string): name is GemName {

    // 2. Regex matching [tier: curemlf] + "gem" + [slot: 1, 3, or 4]
    const GEM_NAME_REGEX = /^[curemlf]gem[134]$/;
    return GEM_NAME_REGEX.test(name);
}

export const TIER_RANKS: Record<GemTier, number> = {
    c: 1, // Common
    u: 2, // Uncommon
    r: 3, // Rare
    e: 4, // Epic
    m: 5, // Mythic
    l: 6, // Legendary
    f: 7  // Fabled
}