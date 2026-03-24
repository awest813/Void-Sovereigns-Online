import { ItemRarity } from './common';

export type WeaponType = 'ballistic' | 'energy' | 'missile' | 'melee';
export type WeaponSlot = 'sidearm' | 'primary' | 'heavy';

export interface WeaponDamage {
    base: number;
    max: number;
    /** Damage type label, e.g. "kinetic", "thermal", "void". */
    type: string;
}

export interface Weapon {
    /** Unique kebab-case identifier, e.g. "compact-autopistol". */
    id: string;
    name: string;
    type: WeaponType;
    slot: WeaponSlot;
    damage: WeaponDamage;
    /** Ammo type ID required. Undefined for energy or melee weapons. */
    ammoType?: string;
    magazineSize?: number;
    description: string;
    rarity: ItemRarity;
    tags: string[];
}
