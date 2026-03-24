/** The player's current standing with a faction. */
export type FactionStanding = 'allied' | 'friendly' | 'neutral' | 'hostile' | 'war';

/** A named reputation tier with unlock information. */
export interface FactionReputationThreshold {
    /** Minimum numeric reputation to reach this tier. */
    minRep: number;
    label: string;
    /** Short label for compact UI display. */
    shortLabel: string;
    /** Human-readable description of what unlocks at this tier. */
    unlocks?: string[];
}

export interface Faction {
    /** Unique kebab-case identifier, e.g. "meridian-dock-authority". */
    id: string;
    name: string;
    /** Abbreviated name for UI display, e.g. "ICA". */
    shortName?: string;
    description: string;
    /** Primary station or location this faction operates from. */
    homeStation?: string;
    /** Standing assigned to new players with no prior history. */
    defaultStanding: FactionStanding;
    tags: string[];
    /** Named reputation thresholds for this faction. Sorted ascending by minRep. */
    reputationThresholds?: FactionReputationThreshold[];
}
