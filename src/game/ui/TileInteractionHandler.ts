/**
 * TileInteractionHandler — Processes tile interactions triggered by clicking
 * symbols on the ASCII room grid.
 *
 * Interaction types:
 *   hack-terminal  → reveal intel, bonus credits, or disable a trap
 *   open-cache     → find consumables or credits
 *   avoid-hazard   → environmental warning (no direct effect, flavor text)
 *   take-cover     → temporary defensive bonus message
 *   trigger-alarm  → warn about reinforcements (flavor text)
 *   inspect        → lore text / room detail
 *   none           → no interaction
 */
import { GameState } from '../state/GameState';
import { RoomInteractable } from '../data/dungeons';

// ── Seeded randomness from room context ──────────────────────────────────────

function simpleHash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

// ── Interaction result ───────────────────────────────────────────────────────

export interface InteractionResult {
    /** Summary line to display in the room content area. */
    message: string;
    /** Color for the message text. */
    color: string;
    /** Credits gained (if any). */
    creditsGained: number;
    /** Pilot HP healed (if any). */
    hpHealed: number;
}

// ── Flavor text pools ────────────────────────────────────────────────────────

const TERMINAL_MESSAGES = [
    'Terminal access granted. Partial data recovered — local patrol routes logged.',
    'Decrypted access node. Emergency shutdown codes extracted.',
    'Signal trace complete. One waypoint marker added to nav buffer.',
    'Terminal yields corrupted maintenance logs. Some data is still readable.',
    'Access granted. System clock is offset by 42 days. Last user: UNKNOWN.',
];

const CACHE_MESSAGES = [
    'Cache unsealed. Emergency supplies recovered.',
    'Supply locker open. Field rations and a credit chip inside.',
    'Hidden compartment found. Someone left emergency funds.',
    'Crate contains salvageable components.',
    'Sealed container cracked open. Contents intact.',
];

const HAZARD_MESSAGES = [
    'Radiation spike detected. Rerouting around the vent.',
    'Heat signature exceeds safe thresholds. Marking zone as hazardous.',
    'Atmospheric pressure anomaly. Suit seals auto-engaged.',
    'Structural integrity warning. Debris field ahead.',
];

const COVER_MESSAGES = [
    'Took position behind structural support. Momentary respite.',
    'Ducked behind a bulkhead fragment. Clear sightlines.',
    'Cover established behind machinery housing.',
];

const ALARM_MESSAGES = [
    '⚠ Proximity sensor tripped. Signal broadcast detected.',
    '⚠ Motion tracker activated. Local alert raised.',
    '⚠ Security grid pinged your position. Stay sharp.',
];

const INSPECT_MESSAGES = [
    'A data fragment — partial logs from the last crew rotation.',
    'Scorch marks on the wall. Something happened here.',
    'A scratched tally on the surface — someone was counting days.',
    'Faded operational markings. This sector was active recently.',
    'An old crew manifest. Most names are redacted.',
];

// ── Handler ──────────────────────────────────────────────────────────────────

/**
 * Process a tile interaction and return the result.
 *
 * @param interactable  The interactable that was clicked.
 * @param roomId        The room ID for deterministic randomness.
 * @returns InteractionResult with message, color, and any game-state effects.
 */
export function handleTileInteraction(
    interactable: RoomInteractable,
    roomId: string,
): InteractionResult {
    const seed = simpleHash(roomId + interactable.row + interactable.col);
    const pick = <T>(arr: T[]): T => arr[seed % arr.length];

    switch (interactable.action) {
        case 'hack-terminal': {
            const bonusCredits = 5 + (seed % 16);
            GameState.addCredits(bonusCredits);
            return {
                message: `▸ TERMINAL: ${pick(TERMINAL_MESSAGES)} (+${bonusCredits}c)`,
                color: '#00c8ff',
                creditsGained: bonusCredits,
                hpHealed: 0,
            };
        }

        case 'open-cache': {
            const bonusCredits = 8 + (seed % 23);
            GameState.addCredits(bonusCredits);
            return {
                message: `▸ CACHE: ${pick(CACHE_MESSAGES)} (+${bonusCredits}c)`,
                color: '#ffdd44',
                creditsGained: bonusCredits,
                hpHealed: 0,
            };
        }

        case 'avoid-hazard': {
            return {
                message: `▸ HAZARD: ${pick(HAZARD_MESSAGES)}`,
                color: '#ff9922',
                creditsGained: 0,
                hpHealed: 0,
            };
        }

        case 'take-cover': {
            return {
                message: `▸ COVER: ${pick(COVER_MESSAGES)}`,
                color: '#4a6880',
                creditsGained: 0,
                hpHealed: 0,
            };
        }

        case 'trigger-alarm': {
            return {
                message: pick(ALARM_MESSAGES),
                color: '#ff2244',
                creditsGained: 0,
                hpHealed: 0,
            };
        }

        case 'inspect': {
            return {
                message: `▸ ${pick(INSPECT_MESSAGES)}`,
                color: '#4a6880',
                creditsGained: 0,
                hpHealed: 0,
            };
        }

        case 'none':
        default: {
            return {
                message: '',
                color: '#4a6880',
                creditsGained: 0,
                hpHealed: 0,
            };
        }
    }
}
