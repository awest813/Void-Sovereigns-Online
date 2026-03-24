export interface Ammo {
    /** Unique kebab-case identifier, e.g. "std-9mm". */
    id: string;
    name: string;
    /** Matches Weapon.ammoType. */
    ammoType: string;
    description: string;
    /** Max units per inventory stack. */
    stackSize: number;
    /** Optional damage or effect modifiers applied when this ammo is used. */
    modifiers?: Record<string, number>;
    tags: string[];
}
