/** Stat modifiers granted by a race at character creation. Values are additive. */
export interface RaceStatBonus {
    strength?: number;
    agility?: number;
    intellect?: number;
    endurance?: number;
    /** Psionic sensitivity. Higher values increase psi ability access — and risk. */
    psi?: number;
}

export interface Race {
    /** Unique kebab-case identifier, e.g. "karathi". */
    id: string;
    name: string;
    description: string;
    statBonuses: RaceStatBonus;
    /** Faction ID this race has a natural affinity with, if any. */
    startingFaction?: string;
    loreNote?: string;
    tags: string[];
}
