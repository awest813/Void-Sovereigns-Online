export type ShipClass = 'shuttle' | 'hauler' | 'frigate' | 'corvette' | 'cruiser';

export interface ShipStats {
    /** Maximum hit points. */
    hull: number;
    /** Damage absorbed before hull takes hits. 0 = no shielding. */
    shielding: number;
    /** Inventory units of cargo space. */
    cargoCapacity: number;
    /** Fuel units before refuel needed. */
    fuelCapacity: number;
    /** Relative speed score (1–10). */
    speed: number;
    /** Max sectors reachable per jump. Relay travel requires jumpRange ≥ relayThreshold. */
    jumpRange: number;
}

export interface ShipSlots {
    /** Number of weapon hardpoints. */
    weapons: number;
    /** Number of installable ship modules. */
    modules: number;
    /** Number of pilot implant bay slots supported by ship systems. */
    implantBays: number;
}

export interface Ship {
    /** Unique kebab-case identifier, e.g. "cutter-mk1". */
    id: string;
    name: string;
    class: ShipClass;
    description: string;
    stats: ShipStats;
    slots: ShipSlots;
    /** Whether this ship can use Void Relay jump networks. */
    relayCapable: boolean;
    tags: string[];
}
