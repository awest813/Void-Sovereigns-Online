// Ship upgrade definitions for Phase 2 progression.
// Upgrades can be installed on the current ship to improve stats and
// eventually satisfy relay-capable requirements.

export interface ShipUpgradeDef {
    id: string;
    name: string;
    description: string;
    cost: number;
    /** Seller NPC id */
    seller: 'ilya-sorn' | 'oziel-kaur' | 'jasso';
    /** Stat bonuses applied on install */
    statBonus: {
        hull?: number;
        shielding?: number;
        cargoCapacity?: number;
        fuelCapacity?: number;
        jumpRange?: number;
    };
    /** Whether installing this upgrade contributes to relay capability */
    relayContribution: boolean;
    /** Flavor text shown after purchase */
    installNote: string;
    tags: string[];
}

export const SHIP_UPGRADES: Record<string, ShipUpgradeDef> = {
    'hull-plating': {
        id: 'hull-plating',
        name: 'Reinforced Hull Plating',
        description:
            'Layered alloy panels bonded over the primary hull. Not elegant, but it stops small arms and collision debris. ' +
            'Increases maximum hull by 30.',
        cost: 480,
        seller: 'ilya-sorn',
        statBonus: { hull: 30 },
        relayContribution: false,
        installNote: 'Ilya welds the last panel into place and wipes her hands on a rag. "Better. Not good, but better."',
        tags: ['hull', 'defensive', 'tier-1'],
    },
    'fuel-expansion': {
        id: 'fuel-expansion',
        name: 'Auxiliary Fuel Tank',
        description:
            'A secondary fuel cell unit mounted in the cargo bay. Costs you one cargo slot. ' +
            'Increases max fuel by 20.',
        cost: 360,
        seller: 'ilya-sorn',
        statBonus: { fuelCapacity: 20 },
        relayContribution: false,
        installNote: '"You\'ll want to keep that tank clean," Ilya says. "Corroded seals are how ships disappear."',
        tags: ['fuel', 'range', 'tier-1'],
    },
    'cargo-rack': {
        id: 'cargo-rack',
        name: 'Modular Cargo Rack',
        description:
            'A fold-out rack system that reconfigures unused internal space into secured cargo volume. ' +
            'Adds 4 cargo units.',
        cost: 280,
        seller: 'jasso',
        statBonus: { cargoCapacity: 4 },
        relayContribution: false,
        installNote: 'Nera hands you the assembly key. "Install it yourself. Instructions are on the side."',
        tags: ['cargo', 'hauling', 'tier-1'],
    },
    'nav-computer': {
        id: 'nav-computer',
        name: 'Astral Nav Computer Mk.II',
        description:
            'Precision navigation processor. Required for Void Relay approach calculations — ' +
            'without it, relay entry is fatal. ' +
            'Part one of making the Cutter relay-capable.',
        cost: 1200,
        seller: 'oziel-kaur',
        statBonus: { jumpRange: 1 },
        relayContribution: true,
        installNote:
            'Oziel runs the calibration sequence himself. "Nav computer is the easy part," he says. ' +
            '"The drive is the problem. Come back when you have the credits."',
        tags: ['navigation', 'relay-path', 'tier-2'],
    },
    'drift-drive-upgrade': {
        id: 'drift-drive-upgrade',
        name: 'Class-II Drift Drive',
        description:
            'A reconditioned relay-grade drift drive. Replaces the Cutter\'s original jump engine. ' +
            'Alone it is not enough — the nav computer must already be installed. ' +
            'Together they make the Cutter relay-capable. Part two of the relay upgrade path.',
        cost: 1800,
        seller: 'oziel-kaur',
        statBonus: { jumpRange: 1 },
        relayContribution: true,
        installNote:
            'The drive hums differently now — deeper, steadier. ' +
            'Oziel closes the panel. "You\'re relay-capable. Don\'t go through one alone."',
        tags: ['drive', 'relay-path', 'tier-2', 'phase-2-goal'],
    },
    'gray-market-shield': {
        id: 'gray-market-shield',
        name: 'Surplus Deflector Array',
        description:
            'Guild-surplus shield unit, no serial number. Not technically legal on a civilian craft, ' +
            'but Jasso does not ask questions and neither should you. ' +
            'Adds 20 shielding.',
        cost: 720,
        seller: 'jasso',
        statBonus: { shielding: 20 },
        relayContribution: false,
        installNote: 'Jasso slides the crate across the counter without making eye contact. "Never saw you."',
        tags: ['shields', 'gray-market', 'tier-2'],
    },
};

/** The relay upgrade path: both nav-computer and drift-drive-upgrade must be installed. */
export const RELAY_UPGRADE_REQUIREMENTS = ['nav-computer', 'drift-drive-upgrade'] as const;

/** Cost to buy the Meridian Hauler II outright (the alternative relay path). */
export const HAULER_PURCHASE_COST = 3800;
