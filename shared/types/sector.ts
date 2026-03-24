export type SectorType = 'station' | 'belt' | 'deep-space' | 'nebula' | 'ruins';
export type SectorDanger = 'safe' | 'low' | 'moderate' | 'high' | 'extreme';

export interface Sector {
    /** Unique kebab-case identifier, e.g. "ashwake-belt". */
    id: string;
    name: string;
    type: SectorType;
    description: string;
    dangerLevel: SectorDanger;
    /** Faction IDs active in this sector. */
    factions: string[];
    /** Dungeon IDs accessible from this sector. */
    dungeons: string[];
    /** Contract IDs seeded from this sector. */
    contracts: string[];
    /** Lore entry IDs discoverable here. */
    lore?: string[];
    tags: string[];
}
