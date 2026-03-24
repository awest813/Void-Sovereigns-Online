export type DungeonType =
    | 'derelict'
    | 'installation'
    | 'asteroid-complex'
    | 'shipwreck'
    | 'void-pocket';

/** Tier 1 = Ashwake-adjacent, starter difficulty. Tier 5 = deep void, endgame. */
export type DungeonTier = 1 | 2 | 3 | 4 | 5;

export type RoomType =
    | 'entrance'
    | 'corridor'
    | 'combat'
    | 'puzzle'
    | 'boss'
    | 'loot'
    | 'hazard';

export interface DungeonRoom {
    id: string;
    type: RoomType;
    description: string;
    /** Enemy or encounter IDs spawned here. */
    encounters?: string[];
}

export interface DungeonReward {
    /** [min, max] credit drop. */
    creditRange: [number, number];
    /** [min, max] XP granted on completion. */
    xpRange: [number, number];
    /** Item IDs that can appear in the loot pool. */
    lootTable: string[];
}

export interface Dungeon {
    /** Unique kebab-case identifier, e.g. "rig-alpha-7". */
    id: string;
    name: string;
    type: DungeonType;
    tier: DungeonTier;
    /** Sector ID this dungeon belongs to. */
    sector: string;
    description: string;
    rooms: DungeonRoom[];
    /** Enemy ID for the optional boss encounter. */
    bossId?: string;
    rewards: DungeonReward;
    tags: string[];
}
