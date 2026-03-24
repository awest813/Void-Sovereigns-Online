export type NPCRole =
    | 'merchant'
    | 'quest-giver'
    | 'trainer'
    | 'info-broker'
    | 'faction-rep'
    | 'bartender'
    | 'shipwright';

export interface NPCDialogueLine {
    id: string;
    text: string;
    /** Optional condition string evaluated at runtime, e.g. "reputation.meridian-dock-authority >= 10". */
    condition?: string;
}

export interface NPC {
    /** Unique kebab-case identifier, e.g. "dockmaster-renata". */
    id: string;
    name: string;
    role: NPCRole[];
    /** Faction ID this NPC represents. */
    faction?: string;
    /** Sector ID where this NPC is found. */
    location: string;
    description: string;
    /** Relative path to portrait asset, e.g. "assets/npcs/renata.png". */
    portrait?: string;
    dialogue: NPCDialogueLine[];
    /** Service IDs available from this NPC, e.g. "repair", "contracts", "trade". */
    services?: string[];
    tags: string[];
}
