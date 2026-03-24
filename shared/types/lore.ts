export type LoreCategory =
    | 'history'
    | 'faction'
    | 'technology'
    | 'psionics'
    | 'void-relays'
    | 'species'
    | 'locations'
    // Phase 6 categories
    | 'personal-log'
    | 'site-report'
    | 'intelligence-report'
    | 'faction-intel'
    | 'operational-log'
    | 'after-action';

export interface LoreEntry {
    /** Unique kebab-case identifier, e.g. "history-meridian-decline". */
    id: string;
    title: string;
    category: LoreCategory;
    /** Who recorded or filed this entry (person, faction, or system). */
    source?: string;
    content: string;
    /** Condition string or item ID that unlocks this entry, e.g. "item:old-relay-schematic". */
    unlockedBy?: string;
    /** IDs of related lore entries shown as "see also". */
    relatedEntries?: string[];
    tags: string[];
}
