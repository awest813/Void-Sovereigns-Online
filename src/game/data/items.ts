// Item catalog — consumables, salvage, ammo, and key items.

export interface ItemDef {
    id: string;
    name: string;
    type: 'consumable' | 'salvage' | 'ammo' | 'key';
    value: number;
    description: string;
    effect?: {
        healPilot?: number;
        healShip?: number;
    };
}

export const ITEMS: Record<string, ItemDef> = {
    'medical-kit': {
        id: 'medical-kit',
        name: 'Medical Kit',
        type: 'consumable',
        value: 30,
        description: 'Standard emergency trauma kit. Restores 35 pilot HP.',
        effect: { healPilot: 35 },
    },
    'repair-kit': {
        id: 'repair-kit',
        name: 'Repair Kit',
        type: 'consumable',
        value: 40,
        description: 'Patch compound and micro-welders for field hull repairs. Restores 30 ship HP.',
        effect: { healShip: 30 },
    },
    'scrap-metal': {
        id: 'scrap-metal',
        name: 'Scrap Metal',
        type: 'salvage',
        value: 15,
        description: 'Processed alloy fragments. Low-grade but sellable.',
    },
    'power-cell': {
        id: 'power-cell',
        name: 'Power Cell',
        type: 'salvage',
        value: 45,
        description: 'Intact industrial-grade power cell. Still holds charge.',
    },
    'drill-component': {
        id: 'drill-component',
        name: 'Drill Component',
        type: 'salvage',
        value: 35,
        description: 'Salvaged mining drill mechanism. Useful for equipment traders.',
    },
    'drone-scrap-parts': {
        id: 'drone-scrap-parts',
        name: 'Drone Scrap Parts',
        type: 'salvage',
        value: 25,
        description: 'Wreckage from a rogue mining drone. Partially functional circuits and chassis plating.',
    },
    'control-module': {
        id: 'control-module',
        name: 'Control Module',
        type: 'key',
        value: 80,
        description: 'Central command core recovered from a rogue drone. Proof of destruction for Guild contracts.',
    },
    'salvage-crate-standard': {
        id: 'salvage-crate-standard',
        name: 'Salvage Crate',
        type: 'salvage',
        value: 60,
        description: 'A sealed cargo crate from an abandoned dig site. Contents unverified.',
    },
    'survey-kit-damaged': {
        id: 'survey-kit-damaged',
        name: 'Survey Kit (Damaged)',
        type: 'key',
        value: 50,
        description: 'A Guild-issue survey instrument. Battered but the data core is intact.',
    },
    'std-9mm': {
        id: 'std-9mm',
        name: 'Ammo: 9mm Standard',
        type: 'ammo',
        value: 8,
        description: 'Standard-issue 9mm rounds. Common and reliable.',
    },
};
