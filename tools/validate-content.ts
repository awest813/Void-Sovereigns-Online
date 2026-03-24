/**
 * Content Validation Tool
 *
 * Checks all content files for:
 *   - Duplicate IDs within each domain
 *   - Cross-reference integrity (e.g. contract.sector must exist in sectors)
 *   - Required fields not empty
 *
 * Usage:
 *   npx ts-node --project tsconfig.content.json tools/validate-content.ts
 */

import { factions } from '../content/factions/factions';
import { races } from '../content/races/races';
import { playerClasses } from '../content/classes/classes';
import { ships } from '../content/ships/ships';
import { starterWeapons } from '../content/weapons/starter-weapons';
import { starterAmmo } from '../content/ammo/starter-ammo';
import { starterImplants } from '../content/implants/starter-implants';
import { meridianStation } from '../content/sectors/meridian-station';
import { ashwakeBelt } from '../content/sectors/ashwake-belt';
import { starterContracts } from '../content/contracts/starter-contracts';
import { meridianNPCs } from '../content/npcs/meridian-npcs';
import { ashwakeDungeons } from '../content/dungeons/ashwake-dungeons';
import { starterLore } from '../content/lore/starter-lore';

// ── Types ─────────────────────────────────────────────────────────────────────

interface HasId {
    id: string;
}

interface ValidationResult {
    errors: string[];
    warnings: string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function checkDuplicateIds(domain: string, items: HasId[]): string[] {
    const errors: string[] = [];
    const seen = new Set<string>();
    for (const item of items) {
        if (seen.has(item.id)) {
            errors.push(`[${domain}] Duplicate ID: "${item.id}"`);
        }
        seen.add(item.id);
    }
    return errors;
}

function collectIds(items: HasId[]): Set<string> {
    return new Set(items.map((i) => i.id));
}

function checkRefs(
    domain: string,
    sourceItems: Array<{ id: string; [key: string]: unknown }>,
    refField: string,
    validIds: Set<string>
): string[] {
    const errors: string[] = [];
    for (const item of sourceItems) {
        const value = item[refField];
        if (typeof value === 'string' && value.length > 0 && !validIds.has(value)) {
            errors.push(
                `[${domain}] Item "${item.id}" has unknown ${refField}: "${value}"`
            );
        }
        if (Array.isArray(value)) {
            for (const ref of value as string[]) {
                if (!validIds.has(ref)) {
                    errors.push(
                        `[${domain}] Item "${item.id}" has unknown ${refField} entry: "${ref}"`
                    );
                }
            }
        }
    }
    return errors;
}

function checkRequiredString(
    domain: string,
    items: Array<{ id: string; [key: string]: unknown }>,
    field: string
): string[] {
    const errors: string[] = [];
    for (const item of items) {
        const value = item[field];
        if (typeof value !== 'string' || value.trim().length === 0) {
            errors.push(`[${domain}] Item "${item.id}" is missing required field: "${field}"`);
        }
    }
    return errors;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const sectors = [meridianStation, ashwakeBelt];

    // Build ID sets for cross-reference checking
    const sectorIds = collectIds(sectors);
    const factionIds = collectIds(factions);
    const dungeonIds = collectIds(ashwakeDungeons);
    const npcIds = collectIds(meridianNPCs);

    // ── Duplicate ID checks ────────────────────────────────────────────────────
    errors.push(...checkDuplicateIds('factions', factions));
    errors.push(...checkDuplicateIds('races', races));
    errors.push(...checkDuplicateIds('classes', playerClasses));
    errors.push(...checkDuplicateIds('ships', ships));
    errors.push(...checkDuplicateIds('weapons', starterWeapons));
    errors.push(...checkDuplicateIds('ammo', starterAmmo));
    errors.push(...checkDuplicateIds('implants', starterImplants));
    errors.push(...checkDuplicateIds('sectors', sectors));
    errors.push(...checkDuplicateIds('contracts', starterContracts));
    errors.push(...checkDuplicateIds('npcs', meridianNPCs));
    errors.push(...checkDuplicateIds('dungeons', ashwakeDungeons));
    errors.push(...checkDuplicateIds('lore', starterLore));

    // ── Required field checks ─────────────────────────────────────────────────
    for (const [domain, items] of [
        ['factions', factions],
        ['races', races],
        ['ships', ships],
        ['sectors', sectors],
        ['dungeons', ashwakeDungeons],
        ['npcs', meridianNPCs],
    ] as Array<[string, Array<{ id: string; [key: string]: unknown }>]>) {
        errors.push(...checkRequiredString(domain, items, 'name'));
        errors.push(...checkRequiredString(domain, items, 'description'));
    }

    // ── Cross-reference checks ────────────────────────────────────────────────

    // Contracts → sector must exist
    errors.push(...checkRefs('contracts', starterContracts as Array<{ id: string; [key: string]: unknown }>, 'sector', sectorIds));

    // Contracts → giver (NPC) must exist if set
    for (const contract of starterContracts) {
        if (contract.giver && !npcIds.has(contract.giver)) {
            errors.push(`[contracts] Contract "${contract.id}" references unknown giver NPC: "${contract.giver}"`);
        }
    }

    // Sectors → factions must exist
    for (const sector of sectors) {
        for (const factionId of sector.factions) {
            if (!factionIds.has(factionId)) {
                errors.push(`[sectors] Sector "${sector.id}" references unknown faction: "${factionId}"`);
            }
        }
        for (const dungeonId of sector.dungeons) {
            if (!dungeonIds.has(dungeonId)) {
                errors.push(`[sectors] Sector "${sector.id}" references unknown dungeon: "${dungeonId}"`);
            }
        }
    }

    // Dungeons → sector must exist
    errors.push(...checkRefs('dungeons', ashwakeDungeons as Array<{ id: string; [key: string]: unknown }>, 'sector', sectorIds));

    // NPCs → location (sector) must exist
    errors.push(...checkRefs('npcs', meridianNPCs as Array<{ id: string; [key: string]: unknown }>, 'location', sectorIds));

    // NPCs → faction must exist if set
    for (const npc of meridianNPCs) {
        if (npc.faction && !factionIds.has(npc.faction)) {
            errors.push(`[npcs] NPC "${npc.id}" references unknown faction: "${npc.faction}"`);
        }
    }

    // Warn on sectors that have no dungeons defined yet
    for (const sector of sectors) {
        if (sector.dungeons.length === 0) {
            warnings.push(`[sectors] Sector "${sector.id}" has no dungeons defined.`);
        }
    }

    return { errors, warnings };
}

// ── Main ──────────────────────────────────────────────────────────────────────

const result = validate();

if (result.warnings.length > 0) {
    console.log('\n⚠  Warnings:');
    for (const w of result.warnings) {
        console.log('  ' + w);
    }
}

if (result.errors.length > 0) {
    console.error('\n✗ Validation FAILED:');
    for (const e of result.errors) {
        console.error('  ' + e);
    }
    process.exit(1);
} else {
    const totalItems =
        factions.length +
        races.length +
        playerClasses.length +
        ships.length +
        starterWeapons.length +
        starterAmmo.length +
        starterImplants.length +
        2 + // sectors
        starterContracts.length +
        meridianNPCs.length +
        ashwakeDungeons.length +
        starterLore.length;

    console.log(`\n✓ Validation passed. ${totalItems} content items checked.\n`);
}
