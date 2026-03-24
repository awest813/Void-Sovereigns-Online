/** The player's current standing with a faction. */
export type FactionStanding = 'allied' | 'friendly' | 'neutral' | 'hostile' | 'war';

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
}
