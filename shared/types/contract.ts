export type ContractCategory =
    | 'salvage'
    | 'bounty'
    | 'delivery'
    | 'escort'
    | 'extraction'
    | 'survey';

/** Tier 1 = rookie work near Meridian. Tier 5 = deep-space, highly dangerous. */
export type ContractTier = 1 | 2 | 3 | 4 | 5;

export interface ContractReward {
    credits: number;
    xp: number;
    /** Faction ID → reputation delta. */
    reputationGain?: Record<string, number>;
    /** Item IDs included in the reward. */
    itemRewards?: string[];
}

export interface Contract {
    /** Unique kebab-case identifier, e.g. "salvage-rig-alpha-7". */
    id: string;
    title: string;
    category: ContractCategory;
    tier: ContractTier;
    description: string;
    /** NPC ID who posted or gives context for this contract. */
    giver?: string;
    /** Sector ID where the contract takes place. */
    sector: string;
    objectives: string[];
    reward: ContractReward;
    tags: string[];
}
