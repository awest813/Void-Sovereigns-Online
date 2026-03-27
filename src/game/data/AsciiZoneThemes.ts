/**
 * AsciiZoneThemes — Zone-specific symbol palettes and color overrides
 * for procedurally generated ASCII dungeon rooms.
 *
 * Each zone type gets:
 *   - A distinct color palette (applied as CSS color overrides)
 *   - Flavor symbols that replace generic ones
 *   - Atmosphere text fragments for generated rooms
 *
 * Zone types map to dungeon IDs / sector themes:
 *   meridian    → amber industrial (Shalehook, Coldframe)
 *   relay       → sterile cyan (Void Relay 7-9, Transit Node)
 *   redline     → red/orange warnings (Ashveil, Vault)
 *   ghost       → violet corrupted glyphs (Transit Node Zero, Ghost sites)
 *   ashveil     → white/blue flicker (Ashveil Deep)
 *   index       → teal terminal (Index Chamber)
 *   cycle       → violet archive (Cycle Archive)
 *   sovereign   → gold ceremonial (Sovereign Threshold)
 *   origin      → rust/copper abstract (Origin Node)
 *   frontier    → green frontier (Farpoint, Kalindra, Orins)
 */

export interface ZoneTheme {
    /** Primary color for walls and structure. */
    wallColor: string;
    /** Primary color for floor tiles. */
    floorColor: string;
    /** Primary color for doors and corridors. */
    doorColor: string;
    /** Color for enemy symbols. */
    enemyColor: string;
    /** Color for interactable symbols. */
    interactColor: string;
    /** Color for hazard symbols. */
    hazardColor: string;
    /** Atmosphere text fragments for flavor. */
    atmosphereTexts: string[];
    /** Wall symbol override (default '#'). */
    wallSymbol?: string;
    /** Floor symbol override (default '.'). */
    floorSymbol?: string;
}

export const ZONE_THEMES: Record<string, ZoneTheme> = {
    meridian: {
        wallColor: '#3a2818',
        floorColor: '#1a1808',
        doorColor: '#ffaa22',
        enemyColor: '#ff2244',
        interactColor: '#ffaa22',
        hazardColor: '#ff9922',
        atmosphereTexts: [
            'Corroded piping runs along the ceiling. Something drips.',
            'Old mining signage — this sector was active years ago.',
            'The hum of dormant machinery fills the space.',
            'Dust particles drift in the emergency lighting.',
        ],
    },
    relay: {
        wallColor: '#1a2838',
        floorColor: '#0a1818',
        doorColor: '#00c8ff',
        enemyColor: '#ff2244',
        interactColor: '#00c8ff',
        hazardColor: '#00ee77',
        atmosphereTexts: [
            'Sterile corridor. The air recyclers are still running.',
            'Signal routing nodes line the walls in orderly rows.',
            'A faint electronic hum permeates everything.',
            'Clean surfaces. This infrastructure was maintained recently.',
        ],
    },
    redline: {
        wallColor: '#2a0808',
        floorColor: '#1a0808',
        doorColor: '#ff4422',
        enemyColor: '#ff1155',
        interactColor: '#ff9922',
        hazardColor: '#ff2244',
        atmosphereTexts: [
            'Warning markings on every surface. This zone is hot.',
            'The air smells of ozone and something burned.',
            'Emergency klaxon mounts are visible but silent.',
            'Someone painted a crude skull on the airlock.',
        ],
    },
    ghost: {
        wallColor: '#1a0828',
        floorColor: '#0a0418',
        doorColor: '#aa44dd',
        enemyColor: '#ff2244',
        interactColor: '#aa44dd',
        hazardColor: '#7722bb',
        atmosphereTexts: [
            'The walls pulse with faint violet light.',
            'Corrupted data streams flicker across dead screens.',
            'A low-frequency vibration you feel more than hear.',
            'Something here is not right. The geometry seems wrong.',
        ],
    },
    ashveil: {
        wallColor: '#281018',
        floorColor: '#180808',
        doorColor: '#cc2266',
        enemyColor: '#ff2244',
        interactColor: '#cc2266',
        hazardColor: '#ff1155',
        atmosphereTexts: [
            'Ash-like particles drift in the recycled air.',
            'Observation windows are frosted and cracked.',
            'The void beyond the station is absolute.',
            'Monitoring equipment chirps with meaningless data.',
        ],
    },
    index: {
        wallColor: '#0a2828',
        floorColor: '#041818',
        doorColor: '#00ccaa',
        enemyColor: '#ff2244',
        interactColor: '#00ccaa',
        hazardColor: '#009977',
        atmosphereTexts: [
            'Archival terminals line the walls in precise rows.',
            'The Null Architect\'s influence is visible in every surface.',
            'Data-crystals are embedded in the floor plating.',
            'The temperature is exactly controlled. Precisely.',
        ],
    },
    cycle: {
        wallColor: '#1a0828',
        floorColor: '#0a0418',
        doorColor: '#9944ee',
        enemyColor: '#ff2244',
        interactColor: '#9944ee',
        hazardColor: '#7722bb',
        atmosphereTexts: [
            'Recursive patterns are etched into the archive walls.',
            'The cycle records pulse with stored energy.',
            'Each terminal shows a different temporal index.',
            'The air tastes like static electricity.',
        ],
    },
    sovereign: {
        wallColor: '#282008',
        floorColor: '#181408',
        doorColor: '#ffaa00',
        enemyColor: '#ff2244',
        interactColor: '#ffaa00',
        hazardColor: '#cc8800',
        atmosphereTexts: [
            'Gold-inlaid panels mark this as a seat of authority.',
            'The threshold hums with residual power.',
            'Ancient script decorates the archway frames.',
            'This place was built to endure. And it has.',
        ],
    },
    origin: {
        wallColor: '#281808',
        floorColor: '#180c04',
        doorColor: '#ff6622',
        enemyColor: '#ff2244',
        interactColor: '#ff6622',
        hazardColor: '#cc4400',
        atmosphereTexts: [
            'The first record. Everything started here.',
            'Copper-oxide surfaces age-stained and warm.',
            'Symbols you don\'t recognize mark every surface.',
            'The Origin Node vibrates with primordial energy.',
        ],
    },
    frontier: {
        wallColor: '#0a2808',
        floorColor: '#041808',
        doorColor: '#00ee77',
        enemyColor: '#ff2244',
        interactColor: '#00ee77',
        hazardColor: '#ffaa22',
        atmosphereTexts: [
            'Frontier-grade construction. Functional, not pretty.',
            'Cargo markings from a dozen different haulers.',
            'The smell of recycled air and engine grease.',
            'Someone left a half-finished repair job.',
        ],
    },
};

/**
 * Determine the zone theme for a given dungeon ID.
 * Falls back to 'meridian' (the default amber industrial theme).
 */
export function getZoneTheme(dungeonId: string): ZoneTheme {
    // Match by dungeon ID prefix or keyword
    if (dungeonId.includes('relay') || dungeonId.includes('transit-node') && !dungeonId.includes('zero'))
        return ZONE_THEMES.relay;
    if (dungeonId.includes('ghost') || dungeonId.includes('transit-node-zero'))
        return ZONE_THEMES.ghost;
    if (dungeonId.includes('ashveil-deep'))
        return ZONE_THEMES.ashveil;
    if (dungeonId.includes('ashveil') || dungeonId.includes('vault'))
        return ZONE_THEMES.redline;
    if (dungeonId.includes('index'))
        return ZONE_THEMES.index;
    if (dungeonId.includes('cycle'))
        return ZONE_THEMES.cycle;
    if (dungeonId.includes('sovereign'))
        return ZONE_THEMES.sovereign;
    if (dungeonId.includes('origin'))
        return ZONE_THEMES.origin;
    if (dungeonId.includes('farpoint') || dungeonId.includes('kalindra') || dungeonId.includes('orin'))
        return ZONE_THEMES.frontier;
    if (dungeonId.includes('shalehook') || dungeonId.includes('coldframe'))
        return ZONE_THEMES.meridian;

    return ZONE_THEMES.meridian; // default
}
