import { ItemRarity } from './common';

export type ImplantSlot =
    | 'neural'
    | 'skeletal'
    | 'ocular'
    | 'dermal'
    | 'cardiovascular';

export interface ImplantEffect {
    /** Stat key this effect modifies, e.g. "agility", "psi", "hullRegen". */
    stat: string;
    value: number;
}

export interface Implant {
    /** Unique kebab-case identifier, e.g. "reflex-booster-i". */
    id: string;
    name: string;
    slot: ImplantSlot;
    description: string;
    effects: ImplantEffect[];
    /**
     * Psionic contamination rating (0–10). 0 = no psi exposure.
     * High ratings attract Covenant attention and may cause instability events.
     */
    psiRating: number;
    rarity: ItemRarity;
    tags: string[];
}
