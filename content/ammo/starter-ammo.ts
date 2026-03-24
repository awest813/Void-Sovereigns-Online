import { Ammo } from '../../shared/types/ammo';

export const starterAmmo: Ammo[] = [
    {
        id: 'std-9mm',
        name: 'Standard 9mm',
        ammoType: 'ammo-9mm',
        description: 'Ubiquitous frontier-grade pistol ammunition. Cheap, available everywhere, and good enough.',
        stackSize: 60,
        tags: ['common', 'pistol'],
    },
    {
        id: 'std-12mm',
        name: 'Standard 12mm',
        ammoType: 'ammo-12mm',
        description: 'Heavier pistol ammunition. Less common than 9mm but still widely stocked on frontier stations.',
        stackSize: 40,
        tags: ['common', 'pistol', 'heavy'],
    },
    {
        id: 'ap-9mm',
        name: 'Armor-Piercing 9mm',
        ammoType: 'ammo-9mm',
        description: 'Hardened penetrator rounds. More effective against armored targets.',
        stackSize: 30,
        modifiers: { armorPenetration: 8 },
        tags: ['uncommon', 'armor-piercing'],
    },
    {
        id: 'std-shotgun-shell',
        name: 'Standard Shotgun Shell',
        ammoType: 'ammo-shotgun',
        description: 'Spread-pattern boarding ammunition. Wide damage cone at short range.',
        stackSize: 20,
        tags: ['common', 'shotgun'],
    },
];
