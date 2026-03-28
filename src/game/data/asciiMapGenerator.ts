/**
 * AsciiMapGenerator — Procedurally generates ASCII room layouts for rooms
 * that don't have hand-authored asciiMap data.
 *
 * Templates are selected based on room type and optionally by dungeon theme.
 * Each template is a small grid (8×10 to 10×10) with appropriate symbols.
 */
import { Room, RoomInteractable, RoomEnemyPlacement } from './dungeons';
import { ENEMIES } from './enemies';

// ── Seeded PRNG (simple LCG for deterministic layouts per room ID) ───────────

function hashCode(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0x7fffffff;
        return s / 0x7fffffff;
    };
}

// ── Template definitions ─────────────────────────────────────────────────────

interface RoomTemplate {
    /** Base ASCII grid. '@' is placed by the generator. Enemies/interactables overlay. */
    grid: string[];
    /** Valid positions for enemy placement (row, col). */
    enemySlots: [number, number][];
    /** Valid positions for interactable placement (row, col). */
    interactSlots: [number, number][];
    /** Player spawn position (row, col). */
    playerSpawn: [number, number];
}

// ── Entrance templates ───────────────────────────────────────────────────────

const ENTRANCE_TEMPLATES: RoomTemplate[] = [
    {
        grid: [
            '##########',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '####++####',
        ],
        enemySlots: [],
        interactSlots: [[1, 3], [1, 7], [2, 5]],
        playerSpawn: [3, 4],
    },
    {
        grid: [
            '##########',
            '#..==....#',
            '#..==....#',
            '#........#',
            '#........#',
            '####++####',
        ],
        enemySlots: [],
        interactSlots: [[1, 6], [3, 2], [3, 7]],
        playerSpawn: [4, 4],
    },
];

// ── Combat templates ─────────────────────────────────────────────────────────

const COMBAT_TEMPLATES: RoomTemplate[] = [
    {
        grid: [
            '####++####',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '####++####',
        ],
        enemySlots: [[2, 3], [2, 6], [4, 5], [4, 2]],
        interactSlots: [[1, 1], [6, 8]],
        playerSpawn: [6, 4],
    },
    {
        grid: [
            '####++####',
            '#........#',
            '#..##....#',
            '#..##....#',
            '#........#',
            '#....##..#',
            '#........#',
            '####++####',
        ],
        enemySlots: [[1, 6], [3, 6], [5, 2], [6, 6]],
        interactSlots: [[1, 1], [4, 4], [6, 1]],
        playerSpawn: [6, 4],
    },
    {
        grid: [
            '####++####',
            '#........#',
            '#.=....=.#',
            '#........#',
            '#........#',
            '#.=....=.#',
            '#........#',
            '####++####',
        ],
        enemySlots: [[2, 4], [2, 5], [4, 3], [4, 6]],
        interactSlots: [[1, 1], [1, 8], [6, 4]],
        playerSpawn: [6, 4],
    },
    {
        // T-shaped corridor: wide upper chamber, narrow lower approach
        grid: [
            '####++####',
            '#........#',
            '#........#',
            '###....###',
            '  #....#  ',
            '  #....#  ',
            '  #....#  ',
            '  ##++##  ',
        ],
        enemySlots: [[1, 2], [1, 7], [2, 4], [2, 5]],
        interactSlots: [[1, 1], [1, 8], [3, 4]],
        playerSpawn: [6, 4],
    },
    {
        // Pillared room: two rows of supports create three combat lanes
        grid: [
            '####++####',
            '#........#',
            '#.##..##.#',
            '#........#',
            '#........#',
            '#.##..##.#',
            '#........#',
            '####++####',
        ],
        enemySlots: [[1, 2], [1, 7], [3, 4], [4, 4]],
        interactSlots: [[2, 4], [5, 4], [1, 8]],
        playerSpawn: [6, 4],
    },
];

// ── Boss templates ───────────────────────────────────────────────────────────

const BOSS_TEMPLATES: RoomTemplate[] = [
    {
        grid: [
            '####++####',
            '#........#',
            '#.^....^.#',
            '#........#',
            '#........#',
            '#.^....^.#',
            '#........#',
            '#........#',
            '####><####',
        ],
        enemySlots: [[3, 4], [3, 5]],
        interactSlots: [[1, 1], [1, 8], [7, 1], [7, 8]],
        playerSpawn: [7, 4],
    },
    {
        grid: [
            '####++####',
            '#........#',
            '#........#',
            '#..####..#',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '####><####',
        ],
        enemySlots: [[2, 4], [4, 3], [4, 6]],
        interactSlots: [[1, 1], [1, 8], [6, 4]],
        playerSpawn: [7, 4],
    },
    {
        // Arena: outer ring of pillars, boss in the center
        grid: [
            '####++####',
            '#.##..##.#',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '#.##..##.#',
            '#........#',
            '####><####',
        ],
        enemySlots: [[3, 4], [4, 4]],
        interactSlots: [[2, 1], [2, 8], [5, 1], [5, 8]],
        playerSpawn: [7, 4],
    },
];

// ── Loot templates ───────────────────────────────────────────────────────────

const LOOT_TEMPLATES: RoomTemplate[] = [
    {
        grid: [
            '####++####',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '##########',
        ],
        enemySlots: [],
        interactSlots: [[1, 3], [1, 6], [2, 2], [3, 5], [4, 7]],
        playerSpawn: [5, 4],
    },
    {
        grid: [
            '####++####',
            '#...##...#',
            '#........#',
            '#........#',
            '#........#',
            '#........#',
            '##########',
        ],
        enemySlots: [],
        interactSlots: [[1, 2], [1, 7], [3, 3], [3, 6], [4, 4]],
        playerSpawn: [5, 4],
    },
];

// ── Hazard templates ─────────────────────────────────────────────────────────

const HAZARD_TEMPLATES: RoomTemplate[] = [
    {
        grid: [
            '####++####',
            '#..^.....#',
            '#....^...#',
            '#........#',
            '#.^...^..#',
            '#........#',
            '#........#',
            '####++####',
        ],
        enemySlots: [],
        interactSlots: [[3, 5], [5, 7], [6, 2]],
        playerSpawn: [6, 4],
    },
    {
        grid: [
            '####++####',
            '#........#',
            '#.^^.....#',
            '#........#',
            '#.....^^.#',
            '#........#',
            '#........#',
            '####++####',
        ],
        enemySlots: [],
        interactSlots: [[1, 4], [3, 7], [5, 2]],
        playerSpawn: [6, 4],
    },
    {
        // Gauntlet: two rows of traps force the player to weave through
        grid: [
            '####++####',
            '#........#',
            '#^..^..^.#',
            '#........#',
            '#........#',
            '#.^..^..^#',
            '#........#',
            '####++####',
        ],
        enemySlots: [],
        interactSlots: [[1, 1], [1, 8], [3, 4]],
        playerSpawn: [6, 4],
    },
];

const TEMPLATES_BY_TYPE: Record<string, RoomTemplate[]> = {
    entrance: ENTRANCE_TEMPLATES,
    combat:   COMBAT_TEMPLATES,
    boss:     BOSS_TEMPLATES,
    loot:     LOOT_TEMPLATES,
    hazard:   HAZARD_TEMPLATES,
};

// ── Enemy symbol assignment ──────────────────────────────────────────────────

function enemySymbol(enemyId: string, isBoss: boolean): string {
    if (isBoss) return 'B';
    const def = ENEMIES[enemyId];
    if (!def) return 'd';
    const name = def.name.toLowerCase();
    if (name.includes('drone'))     return 'd';
    if (name.includes('raider'))    return 'r';
    if (name.includes('sentinel'))  return 's';
    if (name.includes('warden'))    return 's';
    if (name.includes('guardian'))  return 's';
    if (name.includes('arbiter'))   return 'A';
    if (name.includes('herald'))    return 'A';
    if (name.includes('seraph'))    return 'A';
    if (name.includes('executor'))  return 'A';
    return 'd';
}

// ── Interactable symbol assignment ───────────────────────────────────────────

function pickInteractSymbol(roomType: string, rand: () => number): { symbol: string; label: string; action: RoomInteractable['action'] } {
    if (roomType === 'loot') {
        const choices: { symbol: string; label: string; action: RoomInteractable['action'] }[] = [
            { symbol: 'C', label: 'Supply crate', action: 'open-cache' },
            { symbol: '$', label: 'Salvage cache', action: 'open-cache' },
            { symbol: 'C', label: 'Equipment locker', action: 'open-cache' },
        ];
        return choices[Math.floor(rand() * choices.length)];
    }
    if (roomType === 'hazard') {
        const choices: { symbol: string; label: string; action: RoomInteractable['action'] }[] = [
            { symbol: '^', label: 'Radiation vent', action: 'avoid-hazard' },
            { symbol: '^', label: 'Heat vent', action: 'avoid-hazard' },
            { symbol: '!', label: 'Emergency kit', action: 'open-cache' },
        ];
        return choices[Math.floor(rand() * choices.length)];
    }
    // combat / boss / entrance
    const choices: { symbol: string; label: string; action: RoomInteractable['action'] }[] = [
        { symbol: 'T', label: 'Access terminal', action: 'hack-terminal' },
        { symbol: '?', label: 'Unknown signal', action: 'inspect' },
        { symbol: 'T', label: 'System console', action: 'hack-terminal' },
    ];
    return choices[Math.floor(rand() * choices.length)];
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate an ASCII map for a room that doesn't have one.
 * Mutates the room in-place, adding asciiMap, legend, interactables, and enemyPlacements.
 */
export function generateAsciiMap(room: Room): void {
    if (room.asciiMap && room.asciiMap.length > 0) return; // Already has a map

    const templates = TEMPLATES_BY_TYPE[room.type] ?? COMBAT_TEMPLATES;
    const seed = hashCode(room.id);
    const rand = seededRandom(seed);

    // Pick template deterministically
    const template = templates[Math.floor(rand() * templates.length)];

    // Clone the grid so we can mutate it
    const grid = template.grid.map(row => [...row]);

    // Place player
    const [pR, pC] = template.playerSpawn;
    if (pR < grid.length && pC < grid[pR].length) {
        grid[pR][pC] = '@';
    }

    // Place enemies
    const enemyPlacements: RoomEnemyPlacement[] = [];
    const isBossRoom = room.type === 'boss';
    const enemiesToPlace = [...room.enemies];
    const availableEnemySlots = [...template.enemySlots];

    for (let i = 0; i < enemiesToPlace.length && availableEnemySlots.length > 0; i++) {
        const slotIdx = Math.floor(rand() * availableEnemySlots.length);
        const [eR, eC] = availableEnemySlots.splice(slotIdx, 1)[0];
        const sym = enemySymbol(enemiesToPlace[i], isBossRoom && i === enemiesToPlace.length - 1);

        if (eR < grid.length && eC < grid[eR].length) {
            grid[eR][eC] = sym;
            enemyPlacements.push({
                enemyId: enemiesToPlace[i],
                symbol: sym,
                row: eR,
                col: eC,
            });
        }
    }

    // Place interactables (1-2 for combat/entrance, 2-3 for loot, 1 for hazard)
    const interactables: RoomInteractable[] = [];
    const availableInteractSlots = [...template.interactSlots];
    let numInteract: number;
    if (room.type === 'loot')    numInteract = 2 + (rand() < 0.5 ? 1 : 0);
    else if (room.type === 'hazard') numInteract = 1;
    else numInteract = 1 + (rand() < 0.4 ? 1 : 0);

    for (let i = 0; i < numInteract && availableInteractSlots.length > 0; i++) {
        const slotIdx = Math.floor(rand() * availableInteractSlots.length);
        const [iR, iC] = availableInteractSlots.splice(slotIdx, 1)[0];
        const pick = pickInteractSymbol(room.type, rand);

        if (iR < grid.length && iC < grid[iR].length && grid[iR][iC] === '.') {
            grid[iR][iC] = pick.symbol;
            interactables.push({
                symbol: pick.symbol,
                row: iR,
                col: iC,
                label: pick.label,
                action: pick.action,
                used: false,
            });
        }
    }

    // Build legend from placed symbols
    const legend: Record<string, string> = {};
    for (const ep of enemyPlacements) {
        const def = ENEMIES[ep.enemyId];
        legend[ep.symbol] = def?.name ?? ep.enemyId;
    }
    for (const ia of interactables) {
        legend[ia.symbol] = ia.label;
    }

    // Assign to room
    room.asciiMap = grid.map(row => row.join(''));
    room.legend = legend;
    room.interactables = interactables;
    room.enemyPlacements = enemyPlacements;
}
