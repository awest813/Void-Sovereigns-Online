export interface ClassAbility {
    /** Unique kebab-case identifier within this class. */
    id: string;
    name: string;
    description: string;
    unlockLevel: number;
}

export interface PlayerClass {
    /** Unique kebab-case identifier, e.g. "salvager". */
    id: string;
    name: string;
    description: string;
    /** The primary stat this class scales with. */
    primaryStat: string;
    abilities: ClassAbility[];
    /** Item IDs given to new players of this class. */
    startingEquipment: string[];
    tags: string[];
}
