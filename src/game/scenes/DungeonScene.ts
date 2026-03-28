import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState, InventoryItem } from '../state/GameState';
import { ENEMIES, EnemyDef, EnemySpecialAbility, rollLoot, rollCredits } from '../data/enemies';
import { ITEMS } from '../data/items';
import { DUNGEON_REGISTRY as _DUNGEON_REGISTRY, DungeonDef, Room, RoomInteractable, loadDungeon } from '../data/dungeons';
import { generateAsciiMap } from '../data/asciiMapGenerator';
import { renderAsciiRoom, AsciiRenderResult, AsciiRenderOptions } from '../ui/AsciiRoomRenderer';
import { handleTileInteraction, InteractionResult } from '../ui/TileInteractionHandler';
import { getZoneTheme, ZoneTheme } from '../data/AsciiZoneThemes';
import { AsciiGridState, GridPos } from '../data/AsciiGridState';
import { starterContracts } from '../../../content/contracts/starter-contracts';
import { phase2Contracts } from '../../../content/contracts/phase2-contracts';
import { phase3Contracts } from '../../../content/contracts/phase3-contracts';
import { phase4Contracts } from '../../../content/contracts/phase4-contracts';
import { phase5Contracts } from '../../../content/contracts/phase5-contracts';
import { phase6Contracts } from '../../../content/contracts/phase6-contracts';
import { phase7Contracts } from '../../../content/contracts/phase7-contracts';
import { phase8Contracts } from '../../../content/contracts/phase8-contracts';
import { phase9Contracts } from '../../../content/contracts/phase9-contracts';
import { phase10Contracts } from '../../../content/contracts/phase10-contracts';
import { phase11Contracts } from '../../../content/contracts/phase11-contracts';
import { T } from '../ui/UITheme';
import { DebugPanel } from '../ui/DebugPanel';

// Scene colour palette — extends shared UITheme with dungeon-atmosphere overrides.
const C = {
    ...T,
    bg:        T.bgDeep,     // deeper void
    panelBg:   T.panelMid,   // cold-navy panels
    border:    T.borderFaint, // faint cold border
    textSecond:'#334d66',     // dimmer steel-blue secondary text
    barHull:   0x009955,      // slightly deeper neon green
    barDamaged:0xbb3800,      // deeper orange-red
    barFuel:   0x006699,      // deeper electric blue
};

// All contracts from all phases — used for ID→title lookups in completion screen.
const ALL_CONTRACTS = [...starterContracts, ...phase2Contracts, ...phase3Contracts, ...phase4Contracts, ...phase5Contracts, ...phase6Contracts, ...phase7Contracts, ...phase8Contracts, ...phase9Contracts, ...phase10Contracts, ...phase11Contracts];

// ── Combat balance constants ─────────────────────────────────────────────────
/** Player base damage range (min/max). Scales up by PLAYER_LEVEL_DAMAGE_BONUS per level. */
const PLAYER_BASE_DMG_MIN = 12;
const PLAYER_BASE_DMG_MAX = 22;
/** Extra damage added to both min and max per player level above 1. */
const PLAYER_LEVEL_DAMAGE_BONUS = 2;
/** Probability of a player critical hit (1.5× damage). */
const PLAYER_CRIT_CHANCE = 0.10;
/** Probability of a perfect evasion on Dodge (zero incoming damage). */
const PERFECT_EVASION_CHANCE = 0.15;
/** Critical hit multiplier for both player and enemy. */
const CRIT_MULTIPLIER = 1.5;
/** Boss HP fraction below which the enrage/overcharge state activates. */
const BOSS_ENRAGE_THRESHOLD = 0.33;
/** Damage multiplier applied to all enemy attacks while enraged. */
const BOSS_ENRAGE_MULTIPLIER = 1.35;
/** Enemy crit chance for high-tier enemies (attackMax >= this threshold). */
const HIGH_TIER_ATTACK_THRESHOLD = 35;
const HIGH_TIER_CRIT_CHANCE = 0.08;
/** Enemy crit chance for standard-tier enemies. */
const NORMAL_ENEMY_CRIT_CHANCE = 0.05;
/** Attack damage multiplier when the player is DISRUPTED (reduces output by 30%). */
const DISRUPTED_ATTACK_MULT = 0.70;
/** Number of consecutive attack turns (without taking damage) needed to activate Momentum. */
const MOMENTUM_THRESHOLD = 3;
/** Additive damage bonus while Momentum is active. */
const MOMENTUM_DAMAGE_BONUS = 0.25;
/** Attack multiplier granted by a Combat Stimulant (+50%). */
const BOOSTED_ATTACK_MULT = 0.50;
/** Damage multiplier for the Exploit Scan Data action (+60% damage, no enemy counter). */
const EXPLOIT_DAMAGE_MULT = 1.60;
/** Fraction of incoming damage blocked when the player is in a cover position (adjacent wall). */
const COVER_DAMAGE_REDUCTION = 0.15;
/** Max movement steps available during room exploration (before combat). */
const EXPLORATION_MOVE_RANGE = 3;
/** Max movement steps available when repositioning during combat. */
const COMBAT_REPOSITION_RANGE = 2;
/** Damage multiplier applied to enemy attacks when the player successfully dodges (not a full evade). */
const DODGE_DAMAGE_MULT = 0.35;
/** Maximum number of entries kept in the tile-interaction log shown below the ASCII map. */
const MAX_INTERACTION_LOG_ENTRIES = 3;
// ── Level milestone passive bonuses ─────────────────────────────────────────
/** Level at which Tactical Edge activates: +8% crit chance on all player attacks. */
const LEVEL_CRIT_BONUS_THRESHOLD = 3;
/** Additive crit chance bonus from Tactical Edge (level 3+). */
const LEVEL_CRIT_BONUS = 0.08;
/** Level at which Hardened Pilot activates: 5% flat reduction to all incoming damage. */
const LEVEL_DMG_REDUCE_THRESHOLD = 5;
/** Fraction of incoming damage absorbed by Hardened Pilot (level 5+). */
const LEVEL_DMG_REDUCE = 0.05;
/** Level at which Veteran Instinct activates: Momentum triggers after 2 hits instead of 3. */
const VETERAN_INSTINCT_THRESHOLD = 8;
/** Reduced hit streak required for Momentum while Veteran Instinct is active. */
const VETERAN_MOMENTUM_STREAK = 2;
/** Level at which the OVERCHARGE combat action is unlocked. */
const OVERCHARGE_UNLOCK_LEVEL = 10;
/** HP cost deducted from the pilot when OVERCHARGE is used. */
const OVERCHARGE_HP_COST = 20;
/** Extra damage multiplier applied on top of a forced crit during OVERCHARGE. */
const OVERCHARGE_DMG_MULT = 1.8;
// ── Fragmentation Charge ─────────────────────────────────────────────────────
/** Minimum direct damage dealt by a Fragmentation Charge (ignores enemy defense). */
const FRAG_CHARGE_DMG_MIN = 30;
/** Maximum direct damage dealt by a Fragmentation Charge (ignores enemy defense). */
const FRAG_CHARGE_DMG_MAX = 50;
/** DEF reduction applied to the current enemy while WEAKENED is active. */
const WEAKENED_DEF_REDUCTION = 8;
/** Milliseconds to wait after an enemy makes contact before auto-starting combat. */
const ENEMY_CONTACT_DELAY_MS = 350;
/** Varied hit messages for normal player attacks. */
const PLAYER_HIT_MSGS = [
    'You attack for',
    'Strike connects —',
    'Direct hit —',
    'Impact registered —',
    'Target hit for',
];
/** Varied crit messages for player critical hits. */
const PLAYER_CRIT_MSGS = [
    '⚡ CRITICAL STRIKE —',
    '⚡ PRECISION STRIKE —',
    '⚡ ARMOR BREACH —',
    '⚡ DIRECT HIT —',
];
/**
 * Returns the combat damage reduction provided by the pilot's shielding upgrades.
 * Each 4 points of shielding blocks 1 point of damage.
 */
function shieldDamageReduction(shieldingBonus: number): number {
    return shieldingBonus > 0 ? Math.floor(shieldingBonus / 4) : 0;
}
/** Pick a random element from an array. */
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

// ── DungeonScene ────────────────────────────────────────────────────────────
type DungeonPhase =
    | 'intro'
    | 'room-enter'
    | 'combat'
    | 'post-combat'
    | 'loot'
    | 'complete'
    | 'dead';

/** A persistent status effect applied to the player during combat. */
interface PlayerStatusEffect {
    type: 'burning' | 'disrupted' | 'regen' | 'boosted';
    /** Remaining turns this effect lasts. */
    turnsLeft: number;
    /**
     * For burning: HP damage dealt at the start of each player action.
     * For regen: HP restored at the start of each player action.
     * For disrupted/boosted: unused (percentage is a fixed constant).
     */
    value: number;
}

interface CombatState {
    enemies: Array<EnemyDef & { currentHp: number }>;
    enemyIndex: number;   // which enemy is active
    log: string[];
    playerDodging: boolean;
    /** True once a boss drops below 33% HP — increases damage output. */
    bossEnrageActive: boolean;
    /** True once the boss has crossed the 50% HP mark (phase-2 warning shown). */
    bossPhase2Active: boolean;
    /** Status effects currently active on the player (burning, disrupted, regen, boosted). */
    playerStatus: PlayerStatusEffect[];
    /** True when the current enemy has triggered its special and is charging — fires next turn. */
    enemyCharging: boolean;
    /** True once the current enemy's special has already been triggered this combat. */
    enemySpecialUsed: boolean;
    /** True once the player has used SCAN on the current enemy this combat. */
    enemyScanned: boolean;
    /** True once the player has used Exploit against the current enemy. */
    enemyExploitUsed: boolean;
    /** Consecutive attack turns where the player attacked without taking any damage. */
    playerHitStreak: number;
    /** Total HP damage dealt to the player during this combat room (used for flawless detection). */
    damageTakenThisRoom: number;
    /** Remaining turns the current enemy is WEAKENED (reduces their effective defense). */
    enemyWeakenedTurns: number;
}

export class DungeonScene extends Scene {
    private phase: DungeonPhase = 'intro';
    private dungeonDef: DungeonDef | null = null;
    private rooms: Room[] = [];
    private currentRoomIdx = 0;
    private combat: CombatState | null = null;
    private runLoot: InventoryItem[] = [];
    private runCredits = 0;
    private runXp = 0;

    // UI containers
    private headerContainer!: Phaser.GameObjects.Container;
    private contentContainer!: Phaser.GameObjects.Container;
    private actionContainer!: Phaser.GameObjects.Container;

    /** Last ASCII render result — used to manage the terminal display. */
    private asciiRender: AsciiRenderResult | null = null;
    /** Interaction log messages shown below the ASCII map. */
    private interactionLog: { message: string; color: string }[] = [];
    /** Zone-specific color theme for the current dungeon. */
    private zoneTheme: ZoneTheme | undefined;
    /**
     * Active grid state for the current room — tracks player position, fog-of-war,
     * and enemy positions on the ASCII map. Reset each time a new room is entered.
     */
    private gridState: AsciiGridState | null = null;

    constructor() {
        super('Dungeon');
    }

    create() {
        this.cameras.main.setBackgroundColor(C.bg);

        // Load dungeon from registry
        const dungeonId = GameState.get().pendingDungeon ?? 'shalehook-dig-site';
        this.dungeonDef = loadDungeon(dungeonId);
        if (!this.dungeonDef) {
            this.showInvalidDungeonError(dungeonId);
            return;
        }
        this.rooms = this.dungeonDef.rooms;

        // Generate ASCII maps for rooms that don't have hand-authored ones
        for (const room of this.rooms) {
            generateAsciiMap(room);
        }

        // Determine zone-specific color theme
        this.zoneTheme = getZoneTheme(dungeonId);

        // Reset run state
        this.currentRoomIdx = 0;
        this.combat = null;
        this.runLoot = [];
        this.runCredits = 0;
        this.runXp = 0;
        this.phase = 'intro';
        this.asciiRender = null;
        this.interactionLog = [];

        // Starfield
        for (let i = 0; i < 60; i++) {
            this.add.rectangle(
                Phaser.Math.Between(0, 1024),
                Phaser.Math.Between(0, 768),
                1, 1, 0xffffff,
            ).setAlpha(0.15 + Math.random() * 0.25);
        }

        this.headerContainer  = this.add.container(0, 0);
        this.contentContainer = this.add.container(0, 0);
        this.actionContainer  = this.add.container(0, 0);

        this.buildHeader();
        this.showIntro();

        new DebugPanel(this);

        EventBus.emit('current-scene-ready', this);
    }

    // ── Header bar ────────────────────────────────────────────────────────
    private buildHeader() {
        const gs = GameState.get();
        const c = this.headerContainer;
        c.removeAll(true);

        c.add(this.add.rectangle(512, 26, 1024, 52, C.panelBg));
        c.add(this.add.rectangle(512, 52, 1024, 1, C.border));

        const dungeonName = this.dungeonDef?.name.toUpperCase() ?? 'DUNGEON';
        c.add(this.add.text(16, 10, dungeonName, {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textWarn,
        }));

        const roomName = this.rooms[this.currentRoomIdx]?.name ?? '';
        c.add(this.add.text(16, 30, `ROOM ${this.currentRoomIdx + 1}/${this.rooms.length}: ${roomName.toUpperCase()}`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        }));

        // Pilot HP bar
        c.add(this.add.text(450, 10, 'PILOT', {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
        }));
        c.add(this.add.rectangle(510, 20, 120, 10, 0x110f0c).setStrokeStyle(1, C.border));
        const pilotPct = gs.pilotHull / gs.pilotMaxHull;
        c.add(this.add.rectangle(
            450 + (pilotPct * 120) / 2, 20,
            pilotPct * 120, 10,
            pilotPct > 0.4 ? C.barHull : C.barDamaged,
        ));
        c.add(this.add.text(580, 11, `${gs.pilotHull}/${gs.pilotMaxHull}`, {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
        }));

        // Ship HP bar
        c.add(this.add.text(640, 10, 'SHIP', {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
        }));
        c.add(this.add.rectangle(695, 20, 100, 10, 0x110f0c).setStrokeStyle(1, C.border));
        const shipPct = gs.shipHull / gs.shipMaxHull;
        c.add(this.add.rectangle(
            645 + (shipPct * 100) / 2, 20,
            shipPct * 100, 10,
            shipPct > 0.4 ? C.barHull : C.barDamaged,
        ));
        c.add(this.add.text(752, 11, `${gs.shipHull}/${gs.shipMaxHull}`, {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
        }));

        c.add(this.add.text(870, 10, `CREDITS: ${this.runCredits}c`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textWarn,
        }));
        c.add(this.add.text(870, 28, `XP: +${this.runXp}`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textAccent,
        }));
    }

    // ── Shared helpers ────────────────────────────────────────────────────
    private clearContent() {
        this.contentContainer.removeAll(true);
        this.actionContainer.removeAll(true);
        this.asciiRender = null;
    }

    private addContentText(
        x: number, y: number, text: string,
        style: Partial<Phaser.Types.GameObjects.Text.TextStyle> = {},
    ): Phaser.GameObjects.Text {
        const t = this.add.text(x, y, text, {
            fontFamily: 'Arial', fontSize: 15, color: C.textPrimary,
            wordWrap: { width: 920 },
            ...style,
        });
        this.contentContainer.add(t);
        return t;
    }

    private addActionButton(
        x: number, y: number, label: string,
        callback: () => void,
        color: string = C.btnNormal,
        disabled = false,
    ): Phaser.GameObjects.Text {
        // Disabled buttons use a clearly muted color so players can tell at a glance
        // that the action is unavailable, vs an enabled button they haven't hovered yet.
        const btn = this.add.text(x, y, label, {
            fontFamily: 'Arial Black', fontSize: 16, color: disabled ? '#1e2d3e' : color,
        }).setOrigin(0.5).setAlpha(disabled ? 0.5 : 1);
        if (!disabled) {
            btn.setInteractive({ useHandCursor: true });
            btn.on('pointerover', () => btn.setColor(C.btnHover));
            btn.on('pointerout', () => btn.setColor(color));
            btn.on('pointerdown', callback);
        }
        this.actionContainer.add(btn);
        return btn;
    }

    /**
     * Handle a tile interaction from the ASCII room grid.
     * Shows a message in the interaction log area and applies any game-state effects.
     */
    private onTileInteract(ia: RoomInteractable, room: Room) {
        const result: InteractionResult = handleTileInteraction(ia, room.id);
        if (!result.message) return;

        // Track credits gained from tile interactions in the run total
        if (result.creditsGained > 0) {
            this.runCredits += result.creditsGained;
            this.buildHeader();
        }

        // Add to interaction log (keep last N)
        this.interactionLog.push({ message: result.message, color: result.color });
        if (this.interactionLog.length > MAX_INTERACTION_LOG_ENTRIES) {
            this.interactionLog.shift();
        }

        // Render interaction log below the ASCII map
        this.renderInteractionLog();
    }

    /** Render the tile interaction log below the ASCII room map. */
    private renderInteractionLog() {
        // Remove old log text objects (tagged with 'ia-log')
        this.contentContainer.getAll().forEach((obj: Phaser.GameObjects.GameObject) => {
            if ((obj as { name?: string }).name === 'ia-log') {
                obj.destroy();
            }
        });

        const baseY = this.asciiRender
            ? 120 + this.asciiRender.height
            : 420;

        this.interactionLog.forEach((entry, i) => {
            const alpha = 0.5 + (i / Math.max(this.interactionLog.length - 1, 1)) * 0.5;
            const t = this.add.text(40, baseY + i * 18, entry.message, {
                fontFamily: 'Arial', fontSize: 11, color: entry.color,
                wordWrap: { width: 920 },
            }).setAlpha(alpha);
            (t as { name?: string }).name = 'ia-log';
            this.contentContainer.add(t);
        });
    }

    /**
     * Returns an appropriate highlight color for a combat-log line based on its content.
     * Crits, heals, burns, boss events, etc. each get a distinct tint so the log is
     * scannable at a glance rather than a wall of identical grey text.
     * Uses prefix/includes checks before falling back to regex to minimize overhead.
     */
    private logLineColor(line: string): string {
        // Prefix-based checks (cheapest path)
        if (line.startsWith('⚡ MOMENTUM'))                 return '#ffdd44'; // momentum — yellow
        if (line.startsWith('⚡'))                           return '#ffdd00'; // player crit — gold
        if (line.startsWith('⚠'))                           return C.textWarn; // generic warning — amber
        if (line.startsWith('💚'))                           return C.textSuccess; // healing/regen — green
        if (line.startsWith('🔥 OVERCHARGE'))               return '#ff4488'; // overcharge action — hot pink
        if (line.startsWith('🔥') || line.includes('BURNING')) return '#ff8844'; // burn — orange-red
        if (line.startsWith('💥 FRAG') || line.includes('WEAKENED')) return '#cc44ff'; // frag/weaken — purple
        if (line.startsWith('💥'))                           return '#ffdd44'; // combat stim — yellow
        // Substring checks
        if (line.includes('PHASE 2') || line.includes('OVERCHARGE INITIATED')) return '#ff6622'; // boss escalation
        if (line.includes('CANCELLED') || line.includes('Signal disruption'))  return C.textAccent; // disruption/cancel
        if (line.includes('SCAN') || line.includes('EXPLOIT'))                  return C.textAccent; // intel actions
        if (line.includes('perfect evasion') || line.includes('slipped past'))  return C.textSuccess; // full evade
        if (line.includes('Momentum broken'))                                    return C.textWarn; // streak break
        // Damage-taken patterns (regex only as last resort; called on at most 5 lines per render)
        if (/attacks? for|damage\. \(|damage \(reduced\)/i.test(line))          return '#ff5566'; // incoming damage — red
        return C.textSecond;
    }

    // ── Phases ────────────────────────────────────────────────────────────

    /** Shown when `pendingDungeon` refers to an ID not found in the registry. */
    private showInvalidDungeonError(badId: string) {
        // Starfield
        for (let i = 0; i < 60; i++) {
            this.add.rectangle(
                Phaser.Math.Between(0, 1024),
                Phaser.Math.Between(0, 768),
                1, 1, 0xffffff,
            ).setAlpha(0.1 + Math.random() * 0.2);
        }

        this.add.rectangle(512, 384, 780, 280, C.panelBg).setStrokeStyle(2, C.border);

        this.add.text(512, 270, 'NAVIGATION ERROR', {
            fontFamily: 'Arial Black', fontSize: 24, color: C.textDanger, align: 'center',
            stroke: '#000000', strokeThickness: 3,
        }).setOrigin(0.5);

        this.add.text(512, 316, `Dungeon registry lookup failed for: "${badId}"`, {
            fontFamily: 'Arial', fontSize: 13, color: C.textWarn, align: 'center',
        }).setOrigin(0.5);

        this.add.text(512, 354, 'This site could not be located in the navigation database.\n' +
            'Launch parameters may be corrupted or the site ID is outdated.',
        {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            wordWrap: { width: 680 },
        }).setOrigin(0.5);

        const abortBtn = this.add.text(512, 440, '[ ABORT — RETURN TO SECTOR MAP ]', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        abortBtn.on('pointerover', () => abortBtn.setColor(C.btnHover));
        abortBtn.on('pointerout',  () => abortBtn.setColor(C.textPrimary));
        abortBtn.on('pointerdown', () => this.scene.start('SectorMap'));

        new DebugPanel(this);
        EventBus.emit('current-scene-ready', this);
    }

    private showIntro() {
        this.phase = 'intro';
        this.clearContent();
        const def = this.dungeonDef!;
        const gs = GameState.get();
        const isRedlineRun = gs.activeRunIsRedline;

        // Panel
        this.contentContainer.add(
            this.add.rectangle(512, 330, 900, 380, isRedlineRun ? C.redlinePanelBg : C.panelBg)
                .setStrokeStyle(1, isRedlineRun ? C.redlineBorder : C.border),
        );

        const titleColor = isRedlineRun ? '#ff6644' : C.textWarn;
        this.addContentText(512, 150, (isRedlineRun ? '⚠ REDLINE — ' : '') + def.name.toUpperCase(), {
            fontFamily: 'Arial Black', fontSize: 28, color: titleColor,
            stroke: '#000000', strokeThickness: 4, align: 'center',
        }).setOrigin(0.5);

        this.addContentText(512, 192, def.location + '  ·  ' + def.tagline, {
            fontFamily: 'Arial', fontSize: 14, color: C.textSecond, align: 'center',
        }).setOrigin(0.5);

        this.addContentText(80, 240, def.introText, {
            fontFamily: 'Arial', fontSize: 14, color: C.textPrimary,
            lineSpacing: 6,
        });

        const warningPct = gs.pilotHull / gs.pilotMaxHull;
        if (warningPct < 0.5) {
            this.addContentText(512, 430, '⚠ WARNING: Pilot HP is low. Consider returning to Meridian for medical supplies.', {
                fontFamily: 'Arial', fontSize: 13, color: C.textDanger, align: 'center',
            }).setOrigin(0.5);
        }

        if (isRedlineRun) {
            this.addContentText(512, 452, '⚠ REDLINE RUN — Equipment loss on death. Extract alive.', {
                fontFamily: 'Arial Black', fontSize: 13, color: '#ff3333', align: 'center',
            }).setOrigin(0.5);

            // Show risk summary for Redline runs
            this.addActionButton(350, 520, '[ ENTER SITE ]', () => this.showRedlineRiskSummary(), '#ff4422');
        } else {
            this.addActionButton(350, 520, '[ ENTER SITE ]', () => this.enterRoom(0), C.textWarn);
        }
        this.addActionButton(690, 520, '[ ABORT — RETURN ]', () => this.scene.start('SectorMap'), C.textSecond);
    }

    /** Redline-only: show a pre-run risk summary before entering the first room. */
    private showRedlineRiskSummary() {
        this.clearContent();
        const gs = GameState.get();

        this.contentContainer.add(
            this.add.rectangle(512, 340, 900, 440, C.redlinePanelBg).setStrokeStyle(2, C.redlineBorder),
        );

        this.addContentText(512, 130, '⚠  REDLINE RUN — RISK SUMMARY', {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ff3333', align: 'center',
        }).setOrigin(0.5);

        this.addContentText(512, 168, 'Review what you are risking before entering.', {
            fontFamily: 'Arial', fontSize: 13, color: '#cc8866', align: 'center',
        }).setOrigin(0.5);

        // At-risk consumables
        this.addContentText(110, 210, 'FIELD GEAR AT RISK ON DEATH:', {
            fontFamily: 'Arial Black', fontSize: 13, color: '#ff8866',
        });

        const atRiskItems = gs.inventory.filter(i => i.type === 'consumable');
        const securedId = gs.redlineSecuredItemId;
        const insuranceActive = gs.redlineInsuranceActive;

        if (atRiskItems.length === 0) {
            this.addContentText(110, 234, '  None. (No consumables in inventory)', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
            });
        } else {
            atRiskItems.forEach((item, i) => {
                const isSecured = securedId === item.id;
                const label = isSecured
                    ? `  ◆ ${item.name}  ×${item.qty}   [ SECURED — PROTECTED ]`
                    : `  ◆ ${item.name}  ×${item.qty}   [ AT RISK ]`;
                const color = isSecured ? C.redlineSecured : C.redlineLoss;
                this.addContentText(110, 234 + i * 22, label, {
                    fontFamily: 'Arial', fontSize: 12, color,
                });
            });
        }

        // Insurance status
        const insuranceY = 240 + atRiskItems.length * 22;
        if (insuranceActive) {
            this.addContentText(110, insuranceY, '✓ FIELD INSURANCE ACTIVE — One additional item protected on death', {
                fontFamily: 'Arial Black', fontSize: 12, color: C.redlineSecured,
            });
        } else {
            this.addContentText(110, insuranceY, '✗ No insurance — Purchase at Meridian Services (250c) before launch', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
            });
        }

        // What you gain on success
        this.addContentText(110, insuranceY + 36, 'ON SUCCESSFUL EXTRACTION:', {
            fontFamily: 'Arial Black', fontSize: 13, color: C.textAccent,
        });
        this.addContentText(110, insuranceY + 56, '  All run loot recovered  ·  Full contract reward claimed  ·  Faction reputation earned', {
            fontFamily: 'Arial', fontSize: 12, color: C.textPrimary,
        });

        // What you lose on death
        this.addContentText(110, insuranceY + 88, 'ON DEATH (emergency extract):', {
            fontFamily: 'Arial Black', fontSize: 13, color: C.redlineLoss,
        });
        const lossLines = insuranceActive
            ? '  Run loot is lost  ·  1 field consumable lost (insurance reduces from 2 to 1)  ·  Secured item is safe'
            : '  Run loot is lost  ·  Up to 2 field consumables lost  ·  Secured item (if set) is safe';
        this.addContentText(110, insuranceY + 108, lossLines, {
            fontFamily: 'Arial', fontSize: 12, color: C.textWarn,
        });

        this.addContentText(512, 576, '"Go prepared. Extract alive."', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center', fontStyle: 'italic',
        }).setOrigin(0.5);

        this.addActionButton(340, 630, '[ ENTER SITE — ACCEPT RISK ]', () => this.enterRoom(0), C.redlineBtn);
        this.addActionButton(690, 630, '[ ABORT — RETURN ]', () => this.scene.start('SectorMap'), C.textSecond);
    }

    private enterRoom(idx: number) {
        this.currentRoomIdx = idx;
        const room = this.rooms[idx];
        this.buildHeader();
        this.phase = 'room-enter';
        this.clearContent();
        this.interactionLog = [];

        // ── Initialise grid state for this room ──────────────────────────
        this.gridState = null;
        const hasAsciiMap = room.asciiMap && room.asciiMap.length > 0;
        if (hasAsciiMap) {
            this.gridState = new AsciiGridState(room.asciiMap!);
            // Register enemy positions so they can be tracked during exploration
            if (room.enemyPlacements) {
                for (const ep of room.enemyPlacements) {
                    this.gridState.addEnemy(ep.enemyId, ep.symbol, { row: ep.row, col: ep.col });
                }
            }
        }

        // Wider panel to accommodate ASCII map + description side-by-side
        this.contentContainer.add(
            this.add.rectangle(512, 340, 980, 460, C.panelBg).setStrokeStyle(1, C.border),
        );

        // Room title
        this.addContentText(512, 80, room.name.toUpperCase(), {
            fontFamily: 'Arial Black', fontSize: 20, color: room.type === 'boss' ? C.textDanger : C.textWarn,
            align: 'center',
        }).setOrigin(0.5);

        // ── ASCII tactical terminal view ─────────────────────────────────
        if (hasAsciiMap) {
            this.renderAsciiGrid(room);

            // Room description on the right side, beside the map
            const descX = 40 + (this.asciiRender?.width ?? 0);
            const descWidth = 980 - (this.asciiRender?.width ?? 0) - 60;
            this.addContentText(descX, 104, room.description, {
                fontFamily: 'Arial', fontSize: 13, color: C.textPrimary, lineSpacing: 4,
                wordWrap: { width: descWidth },
            });

            // Zone atmosphere text (one-per-room flavor from zone theme)
            if (this.zoneTheme?.atmosphereTexts?.length) {
                const atmIdx = this.currentRoomIdx % this.zoneTheme.atmosphereTexts.length;
                this.addContentText(descX, 170, `"${this.zoneTheme.atmosphereTexts[atmIdx]}"`, {
                    fontFamily: 'Arial', fontSize: 11, color: C.textSecond, fontStyle: 'italic',
                    wordWrap: { width: descWidth },
                });
            }

            // Interaction log area (below the map, updates when tiles are clicked)
            const logY = 108 + (this.asciiRender?.height ?? 0);
            const hasInteractables = (room.interactables?.length ?? 0) > 0;
            const hintParts: string[] = [];
            if (hasInteractables) hintParts.push('click highlighted symbols to interact');
            hintParts.push('green tiles: click to move');
            this.addContentText(40, logY, `TACTICAL SCAN — ${hintParts.join('  ·  ')}`, {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
            });
        } else {
            // Fallback: text-only presentation for rooms without maps
            this.addContentText(80, 120, room.description, {
                fontFamily: 'Arial', fontSize: 14, color: C.textPrimary, lineSpacing: 5,
            });
        }

        // ── Room-type-specific actions ───────────────────────────────────
        const actionY = hasAsciiMap ? 570 : 500;

        if (room.type === 'entrance') {
            this.addActionButton(512, actionY, '[ ADVANCE ]', () => {
                if (idx + 1 < this.rooms.length) this.enterRoom(idx + 1);
                else this.showCompletion();
            });
        } else if (room.type === 'loot') {
            this.addActionButton(512, actionY, '[ SEARCH ROOM ]', () => this.showLootRoom(room));
        } else if (room.type === 'hazard') {
            const hazardDamage = room.hazardDamage ?? 15;
            const lootNames = (room.lootItems ?? []).map(id => ITEMS[id]?.name ?? id).join(', ');
            const warnY = hasAsciiMap ? 530 : 390;
            this.addContentText(512, warnY, `⚠ ENVIRONMENTAL HAZARD — Breaching this zone costs ${hazardDamage} pilot HP`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textDanger, align: 'center',
            }).setOrigin(0.5);
            if (lootNames) {
                this.addContentText(512, warnY + 22, `Potential salvage: ${lootNames}`, {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
                }).setOrigin(0.5);
            }
            this.addActionButton(340, actionY, '[ BYPASS — ADVANCE SAFELY ]', () => {
                if (idx + 1 < this.rooms.length) this.enterRoom(idx + 1);
                else this.showCompletion();
            }, C.textSecond);
            this.addActionButton(720, actionY, `[ BRAVE HAZARD (−${hazardDamage} HP) ]`,
                () => this.showHazardRoom(room), C.textWarn);
        } else if (room.type === 'combat' || room.type === 'boss') {
            const enemyNames = room.enemies.map(e => ENEMIES[e]?.name ?? e).join(', ');
            const threatY = hasAsciiMap ? 530 : 390;
            this.addContentText(512, threatY, `THREATS DETECTED: ${enemyNames}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textDanger, align: 'center',
            }).setOrigin(0.5);
            this.addActionButton(380, actionY, '[ ENGAGE ]', () => this.startCombat(room), C.textDanger);
            this.addActionButton(700, actionY, '[ RETREAT ]', () => this.showRetreatConfirm(), C.textSecond);
        }
    }

    // ── ASCII grid helpers ─────────────────────────────────────────────────

    /**
     * (Re-)render the ASCII grid for a room using the current gridState.
     * Called on initial room entry and again whenever the player moves.
     * Only swaps the asciiRender container — other content items are unaffected.
     */
    private renderAsciiGrid(room: Room) {
        if (!this.gridState) return;

        // Remove previous render from the container without clearing other content
        if (this.asciiRender) {
            this.contentContainer.remove(this.asciiRender.container, true);
            this.asciiRender = null;
        }

        // Build the proxy map from the live grid state (preserves '@' movement)
        const proxyRoom: Room = { ...room, asciiMap: this.gridState.toAsciiMap() };
        const movableCells = this.getMovableCells(EXPLORATION_MOVE_RANGE);

        const opts: AsciiRenderOptions = {
            revealed:     this.gridState.revealed,
            movableCells,
            onMove: (r: number, c: number) => this.onMovePlayer(r, c, room),
        };

        this.asciiRender = renderAsciiRoom(
            this, proxyRoom, 30, 100,
            (ia: RoomInteractable) => this.onTileInteract(ia, room),
            this.zoneTheme,
            opts,
        );
        this.contentContainer.add(this.asciiRender.container);
    }

    /**
     * BFS from the player's current position, returning a Set of "row,col" strings
     * for every floor cell reachable within `maxSteps` steps.
     * Excludes interactable positions (player must click symbols, not walk onto them)
     * and enemy positions.
     */
    private getMovableCells(maxSteps: number): Set<string> {
        if (!this.gridState) return new Set();
        const room = this.rooms[this.currentRoomIdx];

        // Positions occupied by an unused interactable (don't walk onto them)
        const iaKeys = new Set(
            (room.interactables ?? [])
                .filter(ia => !ia.used)
                .map(ia => `${ia.row},${ia.col}`),
        );
        // Enemy positions
        const enemyKeys = new Set(
            this.gridState.enemies.map(e => `${e.pos.row},${e.pos.col}`),
        );

        const reachable = new Set<string>();
        const visited   = new Set<string>();
        const queue: { pos: GridPos; steps: number }[] = [
            { pos: this.gridState.playerPos, steps: 0 },
        ];
        visited.add(`${this.gridState.playerPos.row},${this.gridState.playerPos.col}`);

        const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        while (queue.length > 0) {
            const { pos, steps } = queue.shift()!;
            if (steps > 0) reachable.add(`${pos.row},${pos.col}`);
            if (steps >= maxSteps) continue;
            for (const [dr, dc] of dirs) {
                const nr = pos.row + dr;
                const nc = pos.col + dc;
                const key = `${nr},${nc}`;
                if (visited.has(key)) continue;
                const ch = this.gridState.getCell({ row: nr, col: nc });
                if (ch === '#' || ch === ' ') continue;
                if (iaKeys.has(key) || enemyKeys.has(key)) continue;
                visited.add(key);
                queue.push({ pos: { row: nr, col: nc }, steps: steps + 1 });
            }
        }
        return reachable;
    }

    /** Handle a player movement click during room exploration — update grid, re-render. */
    private onMovePlayer(row: number, col: number, room: Room) {
        if (!this.gridState) return;

        // Capture the cell character BEFORE movement (grid is mutated by movePlayer)
        const cellAtTarget = this.gridState.getCell({ row, col });

        if (!this.gridState.movePlayer({ row, col })) return;

        // ── Hazard tile damage ────────────────────────────────────────────
        // Walking onto a '^' trap tile deals environmental damage.
        if (cellAtTarget === '^') {
            const trapDmg = Phaser.Math.Between(5, 12);
            GameState.damagePilot(trapDmg);
            this.buildHeader();
            this.interactionLog.push({
                message: `⚠ TRAP TRIGGERED — ${trapDmg} pilot HP damage taken`,
                color: '#ff9922',
            });
            if (this.interactionLog.length > MAX_INTERACTION_LOG_ENTRIES) this.interactionLog.shift();

            if (GameState.get().pilotHull <= 0) {
                this.phase = 'dead';
                this.clearContent();
                this.showDeathScreen();
                return;
            }
        }

        // ── Enemy patrol step ─────────────────────────────────────────────
        // After each player move in a combat/boss room, aggro'd enemies close in.
        if (room.type === 'combat' || room.type === 'boss') {
            // Snapshot which enemies were already aggro'd before this move
            const prevAggrod = new Set(this.gridState.enemies.filter(e => e.aggrod).map(e => e.id));

            // Re-evaluate aggro after the player moved
            this.gridState.updateAggro();
            let contactTriggered = false;

            for (const enemy of this.gridState.enemies) {
                if (!enemy.aggrod) continue;

                const moved = this.gridState.stepEnemyToward(enemy.id);

                // Notify once when an enemy newly aggros and starts moving
                if (!prevAggrod.has(enemy.id) && moved) {
                    this.interactionLog.push({
                        message: `⚠ ${enemy.symbol} CONTACT — enemy closing!`,
                        color: '#ff2244',
                    });
                    if (this.interactionLog.length > MAX_INTERACTION_LOG_ENTRIES) this.interactionLog.shift();
                }

                // If an enemy is now adjacent to the player, trigger combat
                if (AsciiGridState.manhattanDist(enemy.pos, this.gridState.playerPos) <= 1) {
                    contactTriggered = true;
                }
            }

            // Re-render the grid so enemy positions update before combat starts
            this.renderAsciiGrid(room);
            this.renderInteractionLog();

            if (contactTriggered) {
                // Short delay so the player can see the enemy adjacent before combat
                this.time.delayedCall(ENEMY_CONTACT_DELAY_MS, () => {
                    if (this.phase === 'room-enter') this.startCombat(room);
                });
            }
            return;
        }

        // Re-render the grid with the new position and updated fog-of-war
        this.renderAsciiGrid(room);
        // Also refresh the interaction log so it stays at the correct Y position
        this.renderInteractionLog();
    }

    // ── Loot room ─────────────────────────────────────────────────────────
    private showLootRoom(room: Room) {
        this.clearContent();

        this.contentContainer.add(
            this.add.rectangle(512, 330, 900, 400, C.panelBg).setStrokeStyle(1, C.border),
        );

        this.addContentText(512, 130, 'SALVAGE FOUND', {
            fontFamily: 'Arial Black', fontSize: 22, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5);

        const lootItems = room.lootItems ?? [];
        let yOff = 170;
        lootItems.forEach(itemId => {
            const def = ITEMS[itemId];
            if (!def) return;
            const item: InventoryItem = { id: def.id, name: def.name, qty: 1, type: def.type, value: def.value };
            this.runLoot.push(item);
            this.addContentText(220, yOff, `  ◆ ${def.name}  (${def.value}c value)`, {
                fontFamily: 'Arial', fontSize: 14, color: C.textPrimary,
            });
            yOff += 28;
        });

        // 30% chance for a hidden cache discovery
        const DISCOVERY_MESSAGES_CREDITS = [
            'A hidden compartment behind the panel — someone left emergency funds.',
            'A dead operative\'s stash. Credit chips, untouched.',
            'Emergency supply cache sealed behind a false wall.',
        ];
        const DISCOVERY_MESSAGES_ITEM = [
            'A sealed med-locker tucked behind the main racks.',
            'Someone cached field supplies here. Recent, by the look of it.',
            'A forgotten maintenance kit — newer model, barely used.',
        ];
        if (Math.random() < 0.30) {
            yOff += 8;
            if (Math.random() < 0.55) {
                // Credit bonus
                const bonus = Phaser.Math.Between(20, 60);
                this.runCredits += bonus;
                this.buildHeader();
                this.addContentText(220, yOff, `✦ HIDDEN CACHE — +${bonus}c found`, {
                    fontFamily: 'Arial Black', fontSize: 13, color: '#ffdd44',
                });
                yOff += 20;
                this.addContentText(220, yOff, `  "${pick(DISCOVERY_MESSAGES_CREDITS)}"`, {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSecond, fontStyle: 'italic',
                });
            } else {
                // Nano-Repair Kit bonus
                const bonusDef = ITEMS['nano-repair-kit'];
                if (bonusDef) {
                    const bonusItem: InventoryItem = { id: bonusDef.id, name: bonusDef.name, qty: 1, type: bonusDef.type, value: bonusDef.value };
                    this.runLoot.push(bonusItem);
                    this.addContentText(220, yOff, `✦ HIDDEN CACHE — Nano-Repair Kit recovered`, {
                        fontFamily: 'Arial Black', fontSize: 13, color: '#44dd88',
                    });
                    yOff += 20;
                    this.addContentText(220, yOff, `  "${pick(DISCOVERY_MESSAGES_ITEM)}"`, {
                        fontFamily: 'Arial', fontSize: 12, color: C.textSecond, fontStyle: 'italic',
                    });
                }
            }
        }

        room.cleared = true;

        this.addActionButton(512, 560, '[ CONTINUE ]', () => {
            if (this.currentRoomIdx + 1 < this.rooms.length) {
                this.enterRoom(this.currentRoomIdx + 1);
            } else {
                this.showCompletion();
            }
        });
    }

    /**
     * Player chose to brave a hazard room: apply environmental damage, collect loot.
     * Sets room.cleared = true so requireLootCleared contracts count this room.
     */
    private showHazardRoom(room: Room) {
        const hazardDamage = room.hazardDamage ?? 15;
        GameState.damagePilot(hazardDamage);
        this.buildHeader();

        // Check if the hazard killed the player
        if (GameState.get().pilotHull <= 0) {
            this.phase = 'dead';
            this.clearContent();
            this.showDeathScreen();
            return;
        }

        this.clearContent();

        this.contentContainer.add(
            this.add.rectangle(512, 330, 900, 400, C.panelBg).setStrokeStyle(1, C.border),
        );

        this.addContentText(512, 130, 'HAZARD BREACHED', {
            fontFamily: 'Arial Black', fontSize: 22, color: C.textWarn, align: 'center',
        }).setOrigin(0.5);

        this.addContentText(512, 162,
            `Environmental damage: −${hazardDamage} HP  ·  Pilot HP: ${GameState.get().pilotHull}/${GameState.get().pilotMaxHull}`,
        {
            fontFamily: 'Arial', fontSize: 13, color: C.textDanger, align: 'center',
        }).setOrigin(0.5);

        this.addContentText(512, 192, 'SALVAGE RECOVERED:', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5);

        const lootItems = room.lootItems ?? [];
        let yOff = 220;
        lootItems.forEach(itemId => {
            const def = ITEMS[itemId];
            if (!def) return;
            const item: InventoryItem = { id: def.id, name: def.name, qty: 1, type: def.type, value: def.value };
            this.runLoot.push(item);
            this.addContentText(220, yOff, `  ◆ ${def.name}  (${def.value}c value)`, {
                fontFamily: 'Arial', fontSize: 14, color: C.textPrimary,
            });
            yOff += 28;
        });

        room.cleared = true;

        this.addActionButton(512, 560, '[ CONTINUE ]', () => {
            if (this.currentRoomIdx + 1 < this.rooms.length) {
                this.enterRoom(this.currentRoomIdx + 1);
            } else {
                this.showCompletion();
            }
        });
    }


    private startCombat(room: Room) {
        this.phase = 'combat';
        const enemyDefs = room.enemies
            .map(id => ENEMIES[id])
            .filter(Boolean)
            .map(def => ({ ...def, currentHp: def.hp }));

        if (enemyDefs.length === 0) {
            // No valid enemies — treat room as cleared and advance.
            room.cleared = true;
            if (this.currentRoomIdx + 1 < this.rooms.length) {
                this.enterRoom(this.currentRoomIdx + 1);
            } else {
                this.showCompletion();
            }
            return;
        }

        // Populate gridState with enemy positions if they weren't already added during room-enter
        if (this.gridState && room.enemyPlacements && this.gridState.enemies.length === 0) {
            for (const ep of room.enemyPlacements) {
                this.gridState.addEnemy(ep.enemyId, ep.symbol, { row: ep.row, col: ep.col });
            }
        }

        this.combat = {
            enemies: enemyDefs,
            enemyIndex: 0,
            log: [],
            playerDodging: false,
            bossEnrageActive: false,
            bossPhase2Active: false,
            playerStatus: [],
            enemyCharging: false,
            enemySpecialUsed: false,
            enemyScanned: false,
            enemyExploitUsed: false,
            playerHitStreak: 0,
            damageTakenThisRoom: 0,
            enemyWeakenedTurns: 0,
        };

        const firstEnemy = this.combat.enemies[0];
        this.combat.log.push(`${firstEnemy.name} activates. Systems armed.`);

        this.renderCombat();
    }

    private renderCombat() {
        this.clearContent();
        const gs = GameState.get();
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        if (!enemy) return;

        // Panel background
        this.contentContainer.add(
            this.add.rectangle(512, 360, 1000, 580, C.panelBg).setStrokeStyle(1, C.border),
        );

        // Enemy name — highlight when charging
        const isCharging = cb.enemyCharging;
        const enrageColor = cb.bossEnrageActive ? '#ff2222' : (isCharging ? '#ff6622' : C.textDanger);
        const enemyDisplayName = isCharging
            ? `${enemy.name.toUpperCase()} — ⚠ CHARGING!`
            : enemy.name.toUpperCase();
        this.addContentText(512, 82, enemyDisplayName, {
            fontFamily: 'Arial Black', fontSize: 18, color: enrageColor, align: 'center',
        }).setOrigin(0.5);

        this.addContentText(512, 104, enemy.description, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
        }).setOrigin(0.5);

        // Enemy HP bar
        const enemyHpPct = enemy.currentHp / enemy.hp;
        this.contentContainer.add(this.add.rectangle(512, 130, 360, 16, 0x130a08).setStrokeStyle(1, C.border));
        this.contentContainer.add(this.add.rectangle(
            332 + (enemyHpPct * 360) / 2, 130,
            enemyHpPct * 360, 16, C.barEnemy,
        ));
        this.addContentText(512, 122, `${enemy.currentHp} / ${enemy.hp} HP`, {
            fontFamily: 'Arial', fontSize: 11, color: '#ffffff', align: 'center',
        }).setOrigin(0.5);

        // Multi-enemy indicator
        if (cb.enemies.length > 1) {
            const remaining = cb.enemies.filter(e => e.currentHp > 0).length;
            this.addContentText(512, 152, `${remaining} threat${remaining !== 1 ? 's' : ''} remaining in room`, {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond, align: 'center',
            }).setOrigin(0.5);
        }

        // Charging special warning
        if (isCharging) {
            const spec = (enemy as EnemyDef & { specialAbility?: EnemySpecialAbility }).specialAbility;
            this.addContentText(512, 168, `⚠  ${spec?.name ?? 'SPECIAL ATTACK'} INCOMING — use Anomaly Kit or act wisely!`, {
                fontFamily: 'Arial Black', fontSize: 12, color: '#ff4422', align: 'center',
            }).setOrigin(0.5);
        }

        // Combat log — last 5 entries, oldest faded, each line tinted by message type
        this.contentContainer.add(
            this.add.rectangle(512, 258, 940, 150, 0x09080a).setStrokeStyle(1, C.border),
        );
        const logLines = cb.log.slice(-5);
        logLines.forEach((line, i) => {
            const alpha = 0.4 + (i / Math.max(logLines.length - 1, 1)) * 0.6;
            const logText = this.addContentText(60, 192 + i * 24, `▶ ${line}`, {
                fontFamily: 'Arial', fontSize: 13, color: this.logLineColor(line),
            });
            logText.setAlpha(alpha);
        });

        // Player status row
        const pilotPct = gs.pilotHull / gs.pilotMaxHull;
        const shipPct = gs.shipHull / gs.shipMaxHull;

        this.addContentText(80, 348, `PILOT HP:`, {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond,
        });
        this.contentContainer.add(this.add.rectangle(190, 358, 160, 12, 0x0b1009).setStrokeStyle(1, C.border));
        this.contentContainer.add(this.add.rectangle(
            110 + (pilotPct * 160) / 2, 358,
            pilotPct * 160, 12,
            pilotPct > 0.4 ? C.barHull : C.barDamaged,
        ));
        this.addContentText(278, 349, `${gs.pilotHull}/${gs.pilotMaxHull}`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });

        // Pulsing critical warning when pilot HP is dangerously low (≤25%)
        if (pilotPct <= 0.25 && gs.pilotHull > 0) {
            const critWarn = this.addContentText(316, 349, '⚠ CRITICAL', {
                fontFamily: 'Arial Black', fontSize: 10, color: '#ff2244',
            });
            this.tweens.add({
                targets: critWarn, alpha: { from: 1, to: 0.2 },
                duration: 380, yoyo: true, repeat: -1,
            });
        }

        this.addContentText(340, 348, `SHIP HP:`, {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond,
        });
        this.contentContainer.add(this.add.rectangle(445, 358, 120, 12, 0x0b0a09).setStrokeStyle(1, C.border));
        this.contentContainer.add(this.add.rectangle(
            385 + (shipPct * 120) / 2, 358,
            shipPct * 120, 12,
            shipPct > 0.4 ? C.barHull : C.barDamaged,
        ));
        this.addContentText(515, 349, `${gs.shipHull}/${gs.shipMaxHull}`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });

        // Inventory — tint counts green when available so players can see at a glance
        // what they have left without reading the numbers closely.
        const medKits = GameState.countItem('medical-kit');
        const repairKits = GameState.countItem('repair-kit');
        const anomalyKits = GameState.countItem('anomaly-field-kit');
        const nanoKits = GameState.countItem('nano-repair-kit');
        const stimKits = GameState.countItem('combat-stim');
        const fragCharges = GameState.countItem('frag-charge');

        const kitsLine1 = [
            { label: 'Med:', val: medKits },
            { label: 'Repair:', val: repairKits },
            { label: 'Anomaly:', val: anomalyKits },
        ];
        const kitsLine2 = [
            { label: 'Nano-Rep:', val: nanoKits },
            { label: 'Stim:', val: stimKits },
            { label: 'Frag:', val: fragCharges },
        ];
        const drawKitLine = (x: number, y: number, kits: {label: string; val: number}[]) => {
            let curX = x;
            kits.forEach(({ label, val }, ki) => {
                const sep = ki > 0 ? '  ' : '';
                const labelObj = this.addContentText(curX, y, sep + label, {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
                });
                curX += labelObj.width;
                const valObj = this.addContentText(curX, y, ` ${val}`, {
                    fontFamily: 'Arial', fontSize: 12,
                    color: val > 0 ? C.textSuccess : C.textMuted,
                });
                curX += valObj.width;
            });
        };
        drawKitLine(610, 348, kitsLine1);
        drawKitLine(610, 364, kitsLine2);

        // Active player status effects
        let statusY = 392;
        if (cb.playerStatus.length > 0) {
            const parts = cb.playerStatus.map(s => {
                if (s.type === 'burning')   return `🔥 BURN ${s.value}dmg/t(${s.turnsLeft})`;
                if (s.type === 'disrupted') return `⚡ DISRUPT −30%ATK(${s.turnsLeft})`;
                if (s.type === 'regen')     return `💚 REGEN +${s.value}hp/t(${s.turnsLeft})`;
                if (s.type === 'boosted')   return `💥 BOOSTED +50%ATK(${s.turnsLeft})`;
                return '';
            }).filter(Boolean);
            this.addContentText(80, statusY, `STATUS: ${parts.join('  |  ')}`, {
                fontFamily: 'Arial', fontSize: 12, color: '#ff8844',
            });
            statusY += 20;
        }

        // WEAKENED enemy debuff indicator
        if (cb.enemyWeakenedTurns > 0) {
            this.addContentText(80, statusY, `⬇ ${enemy.name}: WEAKENED — −${WEAKENED_DEF_REDUCTION} DEF (${cb.enemyWeakenedTurns} turn${cb.enemyWeakenedTurns !== 1 ? 's' : ''})`, {
                fontFamily: 'Arial', fontSize: 12, color: '#cc44ff',
            });
            statusY += 20;
        }

        // Cover indicator — shown when the player is adjacent to a wall on the grid
        const inCover = this.gridState?.isInCover() ?? false;
        if (inCover) {
            this.addContentText(80, statusY, `🛡 COVER — incoming damage −${Math.round(COVER_DAMAGE_REDUCTION * 100)}%`, {
                fontFamily: 'Arial', fontSize: 12, color: '#44aaff',
            });
            statusY += 20;
        }

        // Momentum indicator — uses level-based effective threshold
        const effectiveThreshold = this.effectiveMomentumThreshold();
        if (cb.playerHitStreak >= effectiveThreshold - 1) {
            const bonusLabel = cb.playerHitStreak >= effectiveThreshold
                ? `⚡ MOMENTUM ×${cb.playerHitStreak} — +25% DAMAGE ACTIVE`
                : `⚡ MOMENTUM ×${cb.playerHitStreak} — building… (1 more)`;
            this.addContentText(80, statusY, bonusLabel, {
                fontFamily: 'Arial', fontSize: 12, color: '#ffdd44',
            });
            statusY += 20;
        }

        // Level milestone passive badges (Tactical Edge, Hardened Pilot, Veteran Instinct, Overcharge Protocol)
        if (gs.level >= LEVEL_CRIT_BONUS_THRESHOLD) {
            const passives: string[] = [];
            passives.push(`🎯 TACTICAL EDGE (+${Math.round(LEVEL_CRIT_BONUS * 100)}% crit)`);
            if (gs.level >= LEVEL_DMG_REDUCE_THRESHOLD) passives.push(`🔰 HARDENED PILOT (−${Math.round(LEVEL_DMG_REDUCE * 100)}% dmg in)`);
            if (gs.level >= VETERAN_INSTINCT_THRESHOLD) passives.push(`⚡ VETERAN INSTINCT (2-hit momentum)`);
            if (gs.level >= OVERCHARGE_UNLOCK_LEVEL) passives.push(`🔥 OVERCHARGE UNLOCKED`);
            this.addContentText(80, statusY, `PASSIVE: ${passives.join('  ·  ')}`, {
                fontFamily: 'Arial', fontSize: 12, color: '#99aacc',
            });
        }

        // ── Action buttons ───────────────────────────────────────────────────
        const actionY = 440;
        // Row 1 — core combat
        this.addActionButton(170, actionY, '[ ATTACK ]', () => this.combatAttack(), C.textDanger);
        this.addActionButton(360, actionY, '[ DODGE ]', () => this.combatDodge(), C.textWarn);
        this.addActionButton(560, actionY, '[ MED KIT ]', () => this.combatUseItem('medical-kit'),
            medKits > 0 ? C.textSuccess : C.textSecond, medKits === 0);
        this.addActionButton(760, actionY, '[ REPAIR KIT ]', () => this.combatUseItem('repair-kit'),
            repairKits > 0 ? C.textAccent : C.textSecond, repairKits === 0);

        // Row 2 — advanced consumables
        this.addActionButton(190, actionY + 48, '[ NANO-REPAIR ]', () => this.combatUseItem('nano-repair-kit'),
            nanoKits > 0 ? '#44dd88' : C.textSecond, nanoKits === 0);
        this.addActionButton(410, actionY + 48, '[ COMBAT STIM ]', () => this.combatUseItem('combat-stim'),
            stimKits > 0 ? '#ffdd44' : C.textSecond, stimKits === 0);
        this.addActionButton(610, actionY + 48, '[ ANOMALY KIT ]', () => this.combatUseItem('anomaly-field-kit'),
            anomalyKits > 0 ? '#88ddff' : C.textSecond, anomalyKits === 0);
        this.addActionButton(820, actionY + 48, '[ FRAG CHARGE ]', () => this.combatUseItem('frag-charge'),
            fragCharges > 0 ? '#cc44ff' : C.textSecond, fragCharges === 0);

        // Row 3 — intel / reposition / exploit / overcharge
        this.addActionButton(155, actionY + 96, '[ SCAN TARGET ]', () => this.combatScan(), C.textAccent);
        if (this.gridState) {
            this.addActionButton(400, actionY + 96, '[ REPOSITION ]',
                () => this.combatReposition(this.rooms[this.currentRoomIdx]), '#44aaff');
        }
        if (cb.enemyScanned && !cb.enemyExploitUsed) {
            this.addActionButton(650, actionY + 96, '[ EXPLOIT SCAN DATA ]',
                () => this.combatExploit(), '#ffaa00');
        }
        if (gs.level >= OVERCHARGE_UNLOCK_LEVEL) {
            const canOvercharge = gs.pilotHull > OVERCHARGE_HP_COST;
            this.addActionButton(870, actionY + 96, `[ OVERCHARGE −${OVERCHARGE_HP_COST}HP ]`,
                () => this.combatOvercharge(),
                canOvercharge ? '#ff4488' : C.textSecond, !canOvercharge);
        }

        // Row 4 — retreat
        this.addActionButton(512, actionY + 148, '[ EMERGENCY RETREAT ]', () => this.showRetreatConfirm(), '#445566');
    }

    // ── Cover helper ──────────────────────────────────────────────────────

    /**
     * Apply the cover damage-reduction bonus to a final damage value.
     * Returns the adjusted damage and a flag indicating whether cover was active.
     */
    private applyCoverReduction(dmg: number): { dmg: number; covered: boolean } {
        if (!this.gridState?.isInCover()) return { dmg, covered: false };
        return { dmg: Math.max(1, Math.floor(dmg * (1 - COVER_DAMAGE_REDUCTION))), covered: true };
    }

    // ── Combat reposition ─────────────────────────────────────────────────

    /**
     * Show the grid with movement options during combat.
     * Moving costs a turn — the enemy will attack after the player repositions.
     * The player can also cancel to stay in their current position.
     */
    private combatReposition(room: Room) {
        if (!this.gridState || !this.combat) return;
        const cb = this.combat;

        // Cannot reposition while the enemy is mid-charge
        if (cb.enemyCharging) {
            cb.log.push('Cannot reposition — enemy attack is mid-charge!');
            this.renderCombat();
            return;
        }

        this.clearContent();
        this.contentContainer.add(
            this.add.rectangle(512, 340, 980, 460, C.panelBg).setStrokeStyle(1, C.border),
        );

        this.addContentText(512, 80, 'REPOSITION — SELECT TARGET TILE', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#44aaff', align: 'center',
        }).setOrigin(0.5);

        const inCover = this.gridState.isInCover();
        const positionLabel = inCover
            ? 'Current: IN COVER (−15% dmg)  ·  Move to a green tile to reposition  ·  Enemy will counterattack'
            : 'Current: exposed  ·  Move adjacent to a wall (█) for cover  ·  Enemy will counterattack';
        this.addContentText(512, 108, positionLabel, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
        }).setOrigin(0.5);

        const movableCells = this.getMovableCells(COMBAT_REPOSITION_RANGE);
        const proxyRoom: Room = { ...room, asciiMap: this.gridState.toAsciiMap() };

        const opts: AsciiRenderOptions = {
            revealed:     this.gridState.revealed,
            movableCells,
            onMove: (r: number, c: number) => {
                if (!this.gridState || !this.combat) return;
                this.gridState.movePlayer({ row: r, col: c });
                this.combat.log.push('You reposition.' + (this.gridState.isInCover() ? ' Cover secured.' : ''));
                if (this.processPlayerTurnStart()) return;
                this.processEnemyTurn();
            },
        };

        const render = renderAsciiRoom(this, proxyRoom, 30, 130, undefined, this.zoneTheme, opts);
        this.contentContainer.add(render.container);

        this.addActionButton(512, 590, '[ CANCEL — HOLD POSITION ]', () => this.renderCombat(), C.textSecond);
    }

    /**
     * Returns the effective Momentum hit-streak threshold for the current player level.
     * Level 8+ reduces the requirement from 3 consecutive hits to 2 (Veteran Instinct).
     */
    private effectiveMomentumThreshold(): number {
        return GameState.get().level >= VETERAN_INSTINCT_THRESHOLD
            ? VETERAN_MOMENTUM_STREAK
            : MOMENTUM_THRESHOLD;
    }

    /**
     * Increment the hit streak and log when momentum activates.
     * Call after any player action that doesn't trigger an enemy counter-attack for damage.
     */
    private incrementMomentum() {
        const cb = this.combat!;
        const threshold = this.effectiveMomentumThreshold();
        cb.playerHitStreak++;
        if (cb.playerHitStreak === threshold) {
            cb.log.push(`⚡ MOMENTUM ×${cb.playerHitStreak} — +25% damage bonus activated!`);
        }
    }

    /**
     * Check and update boss phase milestones (Phase 2 at 50 %, enrage at 33 %).
     * Call after dealing damage to a boss-room enemy.
     */
    private checkBossPhases(enemy: EnemyDef & { currentHp: number }) {
        const cb = this.combat!;
        const room = this.rooms[this.currentRoomIdx];
        if (room.type !== 'boss') return;
        const hpPct = enemy.currentHp / enemy.hp;
        if (!cb.bossPhase2Active && enemy.currentHp > 0 && hpPct < 0.50) {
            cb.bossPhase2Active = true;
            cb.log.push(`⚠  ${enemy.name}: PHASE 2 — secondary systems engaged. Threat level rising.`);
        }
        if (!cb.bossEnrageActive && enemy.currentHp > 0 && hpPct < BOSS_ENRAGE_THRESHOLD) {
            cb.bossEnrageActive = true;
            cb.log.push(`⚠  ${enemy.name}: OVERCHARGE INITIATED — critical systems engaged.`);
        }
    }

    /**
     * Refresh or apply a duration-based status effect.
     * If the effect type already exists, extends duration to the maximum of the two values.
     */
    private applyStatusEffect(type: PlayerStatusEffect['type'], turns: number, value: number) {
        const cb = this.combat!;
        const existing = cb.playerStatus.find(s => s.type === type);
        if (existing) {
            existing.turnsLeft = Math.max(existing.turnsLeft, turns);
            return existing;
        }
        const effect: PlayerStatusEffect = { type, turnsLeft: turns, value };
        cb.playerStatus.push(effect);
        return effect;
    }

    /**
     * Processes burning, regen, and other persistent status effects at the start of the
     * player's turn, BEFORE their chosen action resolves.
     * @returns true if the player died from status-effect damage (caller should return early).
     */
    private processPlayerTurnStart(): boolean {
        const cb = this.combat!;

        // Regen: heal the pilot before anything else
        const regen = cb.playerStatus.find(s => s.type === 'regen');
        if (regen) {
            GameState.healPilot(regen.value);
            cb.log.push(`💚 REGEN — +${regen.value} HP restored. Pilot HP: ${GameState.get().pilotHull}`);
            regen.turnsLeft--;
            if (regen.turnsLeft <= 0) {
                cb.playerStatus = cb.playerStatus.filter(s => s.type !== 'regen');
                cb.log.push('Nano-repair sequence complete.');
            }
            this.buildHeader();
        }

        const burning = cb.playerStatus.find(s => s.type === 'burning');
        if (burning) {
            GameState.damagePilot(burning.value);
            cb.damageTakenThisRoom += burning.value;
            cb.log.push(`🔥 BURNING — ${burning.value} damage. Pilot HP: ${GameState.get().pilotHull}`);
            burning.turnsLeft--;
            if (burning.turnsLeft <= 0) {
                cb.playerStatus = cb.playerStatus.filter(s => s.type !== 'burning');
                cb.log.push('Burning cleared.');
            }
            this.buildHeader();
            if (this.checkPlayerDeath()) return true;
        }
        return false;
    }

    private combatAttack() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const gs = GameState.get();

        if (this.processPlayerTurnStart()) return;

        // Apply DISRUPTED penalty if active (reduces attack output by 30%)
        const disrupted = cb.playerStatus.find(s => s.type === 'disrupted');
        const disruptMult = disrupted ? DISRUPTED_ATTACK_MULT : 1.0;
        if (disrupted) {
            disrupted.turnsLeft--;
            if (disrupted.turnsLeft <= 0) {
                cb.playerStatus = cb.playerStatus.filter(s => s.type !== 'disrupted');
                cb.log.push('Disruption cleared — attack effectiveness restored.');
            }
        }

        // Apply BOOSTED status if active (+50% attack output)
        const boosted = cb.playerStatus.find(s => s.type === 'boosted');
        const boostMult = boosted ? (1.0 + BOOSTED_ATTACK_MULT) : 1.0;
        if (boosted) {
            boosted.turnsLeft--;
            if (boosted.turnsLeft <= 0) {
                cb.playerStatus = cb.playerStatus.filter(s => s.type !== 'boosted');
                cb.log.push('Combat stim wearing off — attack boost fading.');
            }
        }

        // Apply Momentum bonus if streak threshold reached
        const threshold = this.effectiveMomentumThreshold();
        const momentumMult = cb.playerHitStreak >= threshold ? (1.0 + MOMENTUM_DAMAGE_BONUS) : 1.0;

        // Player attack — base damage scales +PLAYER_LEVEL_DAMAGE_BONUS per level above 1
        const levelBonus = (gs.level - 1) * PLAYER_LEVEL_DAMAGE_BONUS;
        const rawRoll = Phaser.Math.Between(PLAYER_BASE_DMG_MIN + levelBonus, PLAYER_BASE_DMG_MAX + levelBonus);
        // Tactical Edge (level 3+): +8% crit chance
        const critChance = PLAYER_CRIT_CHANCE + (gs.level >= LEVEL_CRIT_BONUS_THRESHOLD ? LEVEL_CRIT_BONUS : 0);
        const isPlayerCrit = Math.random() < critChance;
        // WEAKENED debuff: reduce enemy effective defense
        const effectiveDefense = cb.enemyWeakenedTurns > 0 ? Math.max(0, enemy.defense - WEAKENED_DEF_REDUCTION) : enemy.defense;
        const playerDmg = Math.max(1, Math.floor(
            rawRoll * (isPlayerCrit ? CRIT_MULTIPLIER : 1.0) * disruptMult * boostMult * momentumMult,
        ) - effectiveDefense);
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);

        // Build combat log message
        const hitMsg  = isPlayerCrit ? pick(PLAYER_CRIT_MSGS) : pick(PLAYER_HIT_MSGS);
        const suffixes: string[] = [];
        if (disrupted && disruptMult < 1.0) suffixes.push('[disrupted]');
        if (boosted) suffixes.push('[stimmed]');
        if (momentumMult > 1.0) suffixes.push('[momentum]');
        if (cb.enemyWeakenedTurns > 0) suffixes.push('[weakened]');
        const suffix = suffixes.length > 0 ? `  ${suffixes.join(' ')}` : '';
        cb.log.push(`${hitMsg} ${playerDmg} damage.${suffix} (${enemy.currentHp}/${enemy.hp} HP)`);

        // Increment hit streak — will be reset by enemyAttack() if the enemy deals damage
        this.incrementMomentum();

        // Check boss phase milestones
        this.checkBossPhases(enemy);

        if (enemy.currentHp <= 0) {
            this.onEnemyDefeated();
            return;
        }

        // Enemy turn (handles charging / special execution / normal attack)
        this.processEnemyTurn();
    }

    private combatDodge() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const gs = GameState.get();

        if (this.processPlayerTurnStart()) return;

        // If the enemy was charging a special, dodge cannot prevent it from firing.
        if (cb.enemyCharging) {
            cb.log.push('You attempt to dodge — but the charged attack cannot be fully avoided!');
            cb.playerDodging = false;
            // Reset streak — a charged special will definitely deal damage
            cb.playerHitStreak = 0;
            this.processEnemyTurn();
            return;
        }

        // 15% chance to fully evade the incoming attack
        const isEvade = Math.random() < PERFECT_EVASION_CHANCE;
        if (isEvade) {
            cb.log.push('Perfect evasion — you slipped past the attack entirely. No damage taken.');
            // Perfect evasion: streak is maintained (player took no damage)
        } else {
            cb.log.push('You brace and dodge — reduced incoming damage this turn.');
            const rawDmg = Phaser.Math.Between(enemy.attackMin, enemy.attackMax);
            const dodgeDmg = Math.max(1, Math.floor((rawDmg - shieldDamageReduction(gs.shipStatOverrides.shieldingBonus)) * DODGE_DAMAGE_MULT));
            const { dmg: postCover, covered } = this.applyCoverReduction(dodgeDmg);
            // Hardened Pilot (level 5+): additional 5% incoming damage reduction
            const reduced = gs.level >= LEVEL_DMG_REDUCE_THRESHOLD
                ? Math.max(1, Math.floor(postCover * (1 - LEVEL_DMG_REDUCE)))
                : postCover;
            GameState.damagePilot(reduced);
            cb.damageTakenThisRoom += reduced;
            // Taking damage breaks the streak
            const effectiveThreshold = this.effectiveMomentumThreshold();
            if (cb.playerHitStreak >= effectiveThreshold) cb.log.push('Momentum broken.');
            cb.playerHitStreak = 0;
            const coverLabel = covered ? ' [cover]' : '';
            cb.log.push(`${enemy.name} attacks for ${reduced} damage (reduced${coverLabel}). Pilot HP: ${GameState.get().pilotHull}`);
        }
        cb.playerDodging = false;

        this.buildHeader();
        if (!this.checkPlayerDeath()) this.renderCombat();
    }

    private combatUseItem(itemId: string) {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];

        if (this.processPlayerTurnStart()) return;

        const item = GameState.useItem(itemId);
        if (!item) return;

        const def = ITEMS[itemId];
        if (def?.effect?.healPilot) {
            GameState.healPilot(def.effect.healPilot);
            cb.log.push(`Used ${item.name} — restored ${def.effect.healPilot} pilot HP. (${GameState.get().pilotHull}/${GameState.get().pilotMaxHull})`);
        } else if (def?.effect?.healShip) {
            GameState.healShip(def.effect.healShip);
            cb.log.push(`Used ${item.name} — repaired ${def.effect.healShip} ship HP. (${GameState.get().shipHull}/${GameState.get().shipMaxHull})`);
        } else if (def?.effect?.regenPilot) {
            // Nano-Repair Kit: apply a regen status effect
            const turns = def.effect.regenTurns ?? 3;
            const hadRegen = cb.playerStatus.some(s => s.type === 'regen');
            this.applyStatusEffect('regen', turns, def.effect.regenPilot);
            if (hadRegen) {
                cb.log.push(`${item.name} refreshes regen — +${def.effect.regenPilot} HP/turn extended.`);
            } else {
                cb.log.push(`💚 ${item.name} — nano-repair active: +${def.effect.regenPilot} HP/turn for ${turns} turns.`);
            }
        } else if (def?.effect?.boostAttack) {
            // Combat Stim: apply a boosted status effect
            const turns = def.effect.boostTurns ?? 2;
            const hadBoost = cb.playerStatus.some(s => s.type === 'boosted');
            this.applyStatusEffect('boosted', turns, 0);
            if (hadBoost) {
                cb.log.push(`${item.name} refreshes boost — +50% attack extended.`);
            } else {
                cb.log.push(`💥 ${item.name} — attack output boosted by 50% for ${turns} turns.`);
            }
        } else {
            cb.log.push(`Used ${item.name}.`);
        }

        // Anomaly Field Kit suppresses the enemy's targeting this turn (no counter-attack)
        // and cancels any in-progress charge.
        if (itemId === 'anomaly-field-kit') {
            if (enemy && cb.enemyCharging) {
                cb.enemyCharging = false;
                cb.log.push(`⚡ Signal disruption — ${enemy.name}'s charged special CANCELLED.`);
            } else if (enemy) {
                cb.log.push(`Signal disruption from ${item.name} — ${enemy.name} targeting suppressed this turn.`);
            } else {
                cb.log.push(`Signal disruption from ${item.name} — targeting suppressed this turn.`);
            }
            this.buildHeader();
            if (!this.checkPlayerDeath()) this.renderCombat();
        } else if (itemId === 'frag-charge') {
            // Fragmentation Charge: direct damage (bypasses defense) + WEAKENED debuff, no counter-attack
            const fragDmg = Phaser.Math.Between(FRAG_CHARGE_DMG_MIN, FRAG_CHARGE_DMG_MAX);
            enemy.currentHp = Math.max(0, enemy.currentHp - fragDmg);
            cb.enemyWeakenedTurns = 2;
            cb.log.push(`💥 FRAG CHARGE — ${fragDmg} direct damage (ignores armor)! ${enemy.name} is WEAKENED (−${WEAKENED_DEF_REDUCTION} DEF) for 2 turns. (${enemy.currentHp}/${enemy.hp} HP)`);
            this.checkBossPhases(enemy);
            if (enemy.currentHp <= 0) {
                this.onEnemyDefeated();
                return;
            }
            this.buildHeader();
            if (!this.checkPlayerDeath()) this.renderCombat();
        } else {
            // Enemy still attacks
            this.processEnemyTurn();
        }
    }

    /**
     * Decides what the enemy does on its turn:
     * - Executes the queued special attack if charging.
     * - Triggers a new charge if HP is below the special threshold (enemy skips attack).
     * - Falls back to a normal attack.
     * Also steps the active enemy one tile toward the player on the grid.
     */
    private processEnemyTurn() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const spec = (enemy as EnemyDef & { specialAbility?: EnemySpecialAbility }).specialAbility;

        // Move the active enemy one step toward the player on the grid
        if (this.gridState) {
            this.gridState.stepEnemyToward(enemy.id);
        }

        // Decrement WEAKENED debuff (if active)
        if (cb.enemyWeakenedTurns > 0) {
            cb.enemyWeakenedTurns--;
            if (cb.enemyWeakenedTurns === 0) {
                cb.log.push(`${enemy.name} recovers — WEAKENED state cleared.`);
            }
        }

        // Fire the queued special — spec is guaranteed because enemyCharging is only set
        // when spec exists (see the trigger check below). Guard defensively in case.
        if (cb.enemyCharging) {
            cb.enemyCharging = false;
            if (spec) {
                this.enemySpecialAttack(spec);
            } else {
                this.enemyAttack();
            }
            return;
        }

        // Check if the special should trigger now
        if (spec && !cb.enemySpecialUsed && enemy.currentHp > 0 && enemy.currentHp / enemy.hp < spec.triggerHpPct) {
            cb.enemySpecialUsed = true;
            cb.enemyCharging = true;
            cb.log.push(`⚠  ${enemy.name}: ${spec.chargeMsg}`);
            this.buildHeader();
            this.renderCombat();
            return; // Enemy charges this turn — no normal attack
        }

        this.enemyAttack();
    }

    /** Fires the enemy's telegraphed special attack and applies any status effect. */
    private enemySpecialAttack(spec: EnemySpecialAbility) {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const gs = GameState.get();

        const rawDmg = Phaser.Math.Between(enemy.attackMin, enemy.attackMax);
        const enrageMult = cb.bossEnrageActive ? BOSS_ENRAGE_MULTIPLIER : 1.0;
        const baseDmg = Math.max(1,
            Math.floor(rawDmg * spec.damageMult * enrageMult)
            - shieldDamageReduction(gs.shipStatOverrides.shieldingBonus),
        );
        const { dmg: postCover, covered } = this.applyCoverReduction(baseDmg);
        // Hardened Pilot (level 5+): additional 5% incoming damage reduction
        const dmg = gs.level >= LEVEL_DMG_REDUCE_THRESHOLD
            ? Math.max(1, Math.floor(postCover * (1 - LEVEL_DMG_REDUCE)))
            : postCover;
        GameState.damagePilot(dmg);
        cb.damageTakenThisRoom += dmg;

        // Break momentum streak when the player takes damage from a special
        if (dmg > 0) {
            if (cb.playerHitStreak >= this.effectiveMomentumThreshold()) {
                cb.log.push('Momentum broken.');
            }
            cb.playerHitStreak = 0;
        }

        const coverLabel = covered ? '  [cover]' : '';
        cb.log.push(`💥 ${enemy.name}: ${spec.executeMsg} — ${dmg} damage!${coverLabel}`);

        // Apply status effect
        if (spec.appliesEffect) {
            const existing = cb.playerStatus.find(s => s.type === spec.appliesEffect);
            if (existing) {
                // Refresh / extend the duration
                existing.turnsLeft = Math.max(existing.turnsLeft, spec.effectTurns ?? 2);
            } else {
                cb.playerStatus.push({
                    type: spec.appliesEffect,
                    turnsLeft: spec.effectTurns ?? 2,
                    value: spec.effectValue ?? 8,
                });
            }
            const effectLabel = spec.appliesEffect === 'burning'
                ? `🔥 BURNING applied — ${spec.effectValue ?? 8} dmg/turn for ${spec.effectTurns ?? 2} turns`
                : `⚡ DISRUPTED applied — attacks weakened for ${spec.effectTurns ?? 2} turns`;
            cb.log.push(effectLabel);
        }

        this.buildHeader();
        if (!this.checkPlayerDeath()) this.renderCombat();
    }

    /**
     * EXPLOIT action: use scan data for a targeted high-damage strike.
     * Deals +60% damage with no enemy counter-attack. One-time use per enemy.
     */
    private combatExploit() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const gs = GameState.get();

        if (this.processPlayerTurnStart()) return;

        cb.enemyExploitUsed = true;

        // Apply DISRUPTED penalty if active
        const disrupted = cb.playerStatus.find(s => s.type === 'disrupted');
        const disruptMult = disrupted ? DISRUPTED_ATTACK_MULT : 1.0;
        if (disrupted) {
            disrupted.turnsLeft--;
            if (disrupted.turnsLeft <= 0) {
                cb.playerStatus = cb.playerStatus.filter(s => s.type !== 'disrupted');
                cb.log.push('Disruption cleared.');
            }
        }

        // Apply BOOSTED status if active (+50% attack output)
        const boosted = cb.playerStatus.find(s => s.type === 'boosted');
        const boostMult = boosted ? (1.0 + BOOSTED_ATTACK_MULT) : 1.0;
        if (boosted) {
            boosted.turnsLeft--;
            if (boosted.turnsLeft <= 0) {
                cb.playerStatus = cb.playerStatus.filter(s => s.type !== 'boosted');
                cb.log.push('Combat stim wearing off — attack boost fading.');
            }
        }

        // Apply Momentum bonus if streak threshold reached
        const exploitThreshold = this.effectiveMomentumThreshold();
        const momentumMult = cb.playerHitStreak >= exploitThreshold ? (1.0 + MOMENTUM_DAMAGE_BONUS) : 1.0;

        const levelBonus = (gs.level - 1) * PLAYER_LEVEL_DAMAGE_BONUS;
        const rawRoll = Phaser.Math.Between(PLAYER_BASE_DMG_MIN + levelBonus, PLAYER_BASE_DMG_MAX + levelBonus);
        // WEAKENED debuff: reduce enemy effective defense
        const effectiveDefense = cb.enemyWeakenedTurns > 0 ? Math.max(0, enemy.defense - WEAKENED_DEF_REDUCTION) : enemy.defense;
        const playerDmg = Math.max(1, Math.floor(rawRoll * EXPLOIT_DAMAGE_MULT * disruptMult * boostMult * momentumMult) - effectiveDefense);
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);

        const suffixes: string[] = [];
        if (disrupted && disruptMult < 1.0) suffixes.push('[disrupted]');
        if (boosted) suffixes.push('[stimmed]');
        if (momentumMult > 1.0) suffixes.push('[momentum]');
        if (cb.enemyWeakenedTurns > 0) suffixes.push('[weakened]');
        const suffix = suffixes.length > 0 ? `  ${suffixes.join(' ')}` : '';
        cb.log.push(`🎯 EXPLOIT — scan data leveraged for a precision strike! ${playerDmg} damage.${suffix} (${enemy.currentHp}/${enemy.hp} HP)`);

        // Increment streak — exploit doesn't trigger enemy counter-attack
        this.incrementMomentum();

        // Check boss phase milestones
        this.checkBossPhases(enemy);

        if (enemy.currentHp <= 0) {
            this.onEnemyDefeated();
            return;
        }

        // No enemy counter-attack — just re-render
        this.buildHeader();
        this.renderCombat();
    }

    /**
     * OVERCHARGE action (unlocked at level 10): burn OVERCHARGE_HP_COST HP to unleash
     * a guaranteed critical strike with 1.8× extra damage multiplier.
     * The enemy still counter-attacks — the risk is trading HP for burst damage.
     */
    private combatOvercharge() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const gs = GameState.get();

        if (gs.pilotHull <= OVERCHARGE_HP_COST) {
            cb.log.push(`Insufficient HP — OVERCHARGE requires more than ${OVERCHARGE_HP_COST} HP.`);
            this.renderCombat();
            return;
        }

        if (this.processPlayerTurnStart()) return;

        // Spend HP to power the overcharge
        GameState.damagePilot(OVERCHARGE_HP_COST);
        cb.damageTakenThisRoom += OVERCHARGE_HP_COST;
        this.buildHeader();
        if (this.checkPlayerDeath()) return;

        // Apply DISRUPTED penalty if active
        const disrupted = cb.playerStatus.find(s => s.type === 'disrupted');
        const disruptMult = disrupted ? DISRUPTED_ATTACK_MULT : 1.0;
        if (disrupted) {
            disrupted.turnsLeft--;
            if (disrupted.turnsLeft <= 0) {
                cb.playerStatus = cb.playerStatus.filter(s => s.type !== 'disrupted');
                cb.log.push('Disruption cleared.');
            }
        }

        // Apply BOOSTED status if active (+50% attack output)
        const boosted = cb.playerStatus.find(s => s.type === 'boosted');
        const boostMult = boosted ? (1.0 + BOOSTED_ATTACK_MULT) : 1.0;
        if (boosted) {
            boosted.turnsLeft--;
            if (boosted.turnsLeft <= 0) {
                cb.playerStatus = cb.playerStatus.filter(s => s.type !== 'boosted');
                cb.log.push('Combat stim wearing off — attack boost fading.');
            }
        }

        // Apply Momentum bonus if streak threshold reached
        const overchargeThreshold = this.effectiveMomentumThreshold();
        const momentumMult = cb.playerHitStreak >= overchargeThreshold ? (1.0 + MOMENTUM_DAMAGE_BONUS) : 1.0;

        // OVERCHARGE: forced crit × OVERCHARGE_DMG_MULT — but no random crit variance
        const levelBonus = (gs.level - 1) * PLAYER_LEVEL_DAMAGE_BONUS;
        const rawRoll = Phaser.Math.Between(PLAYER_BASE_DMG_MIN + levelBonus, PLAYER_BASE_DMG_MAX + levelBonus);
        const effectiveDefense = cb.enemyWeakenedTurns > 0 ? Math.max(0, enemy.defense - WEAKENED_DEF_REDUCTION) : enemy.defense;
        const playerDmg = Math.max(1, Math.floor(
            rawRoll * CRIT_MULTIPLIER * OVERCHARGE_DMG_MULT * disruptMult * boostMult * momentumMult,
        ) - effectiveDefense);
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);

        const suffixes: string[] = ['[auto-crit]', '[×1.8]'];
        if (disrupted && disruptMult < 1.0) suffixes.push('[disrupted]');
        if (boosted) suffixes.push('[stimmed]');
        if (momentumMult > 1.0) suffixes.push('[momentum]');
        if (cb.enemyWeakenedTurns > 0) suffixes.push('[weakened]');
        cb.log.push(`🔥 OVERCHARGE — ${OVERCHARGE_HP_COST} HP burned for a supercharged strike! ${playerDmg} damage. ${suffixes.join(' ')} (${enemy.currentHp}/${enemy.hp} HP)`);

        this.incrementMomentum();
        this.checkBossPhases(enemy);

        if (enemy.currentHp <= 0) {
            this.onEnemyDefeated();
            return;
        }

        // Enemy still counter-attacks
        this.processEnemyTurn();
    }


    private combatScan() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const gs = GameState.get();

        if (this.processPlayerTurnStart()) return;

        const spec = (enemy as EnemyDef & { specialAbility?: EnemySpecialAbility }).specialAbility;
        const hpPct = enemy.currentHp / enemy.hp;
        const nearEnrage = this.rooms[this.currentRoomIdx].type === 'boss'
            && !cb.bossEnrageActive
            && hpPct < BOSS_ENRAGE_THRESHOLD + 0.15;
        const nearSpecial = spec && !cb.enemySpecialUsed && hpPct < spec.triggerHpPct + 0.20;

        cb.log.push(`SCAN: ${enemy.name} — ${enemy.currentHp}/${enemy.hp} HP  |  ATK ${enemy.attackMin}–${enemy.attackMax}  |  DEF ${enemy.defense}`);
        if (spec && !cb.enemySpecialUsed) {
            cb.log.push(`SCAN: Special — ${spec.name} (triggers below ${Math.round(spec.triggerHpPct * 100)}% HP)`);
        }
        if (nearEnrage) cb.log.push('SCAN: ⚠ Approaching enrage threshold.');
        if (nearSpecial && spec) cb.log.push(`SCAN: ⚠ ${spec.name} charge is imminent.`);

        cb.enemyScanned = true;

        // Enemy fires at 50% damage during the scan
        const rawDmg = Phaser.Math.Between(enemy.attackMin, enemy.attackMax);
        const enrageMult = cb.bossEnrageActive ? BOSS_ENRAGE_MULTIPLIER : 1.0;
        const scanDmg = Math.max(1,
            Math.floor(rawDmg * 0.5 * enrageMult)
            - shieldDamageReduction(gs.shipStatOverrides.shieldingBonus),
        );
        const { dmg: postCoverScan, covered } = this.applyCoverReduction(scanDmg);
        // Hardened Pilot (level 5+): additional 5% incoming damage reduction
        const dmg = gs.level >= LEVEL_DMG_REDUCE_THRESHOLD
            ? Math.max(1, Math.floor(postCoverScan * (1 - LEVEL_DMG_REDUCE)))
            : postCoverScan;
        GameState.damagePilot(dmg);
        cb.damageTakenThisRoom += dmg;

        // Break momentum streak when the player takes damage during a scan
        if (dmg > 0) {
            if (cb.playerHitStreak >= this.effectiveMomentumThreshold()) {
                cb.log.push('Momentum broken.');
            }
            cb.playerHitStreak = 0;
        }

        const coverLabel = covered ? ' [cover]' : '';
        cb.log.push(`${enemy.name} fires during scan — ${dmg} damage (reduced${coverLabel}). Pilot HP: ${GameState.get().pilotHull}`);

        this.buildHeader();
        if (!this.checkPlayerDeath()) this.renderCombat();
    }

    private enemyAttack() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const gs = GameState.get();

        const rawDmg = Phaser.Math.Between(enemy.attackMin, enemy.attackMax);
        // Higher-tier enemies (high attack ceiling) have a slightly better crit chance
        const enemyCritChance = enemy.attackMax >= HIGH_TIER_ATTACK_THRESHOLD ? HIGH_TIER_CRIT_CHANCE : NORMAL_ENEMY_CRIT_CHANCE;
        const isEnemyCrit = Math.random() < enemyCritChance;
        // Boss enrage multiplier kicks in once the enrage flag is set
        const enrageMult = cb.bossEnrageActive ? BOSS_ENRAGE_MULTIPLIER : 1.0;

        const baseDmg = Math.max(1, Math.floor(rawDmg * (isEnemyCrit ? CRIT_MULTIPLIER : 1.0) * enrageMult) - shieldDamageReduction(gs.shipStatOverrides.shieldingBonus));
        const { dmg: postCoverAttack, covered } = this.applyCoverReduction(baseDmg);
        // Hardened Pilot (level 5+): additional 5% incoming damage reduction
        const dmg = gs.level >= LEVEL_DMG_REDUCE_THRESHOLD
            ? Math.max(1, Math.floor(postCoverAttack * (1 - LEVEL_DMG_REDUCE)))
            : postCoverAttack;
        GameState.damagePilot(dmg);
        cb.damageTakenThisRoom += dmg;

        // Break the momentum streak when the player takes damage
        if (dmg > 0) {
            if (cb.playerHitStreak >= this.effectiveMomentumThreshold()) {
                cb.log.push('Momentum broken.');
            }
            cb.playerHitStreak = 0;
        }

        const critLabel   = isEnemyCrit ? '  [CRIT]' : '';
        const enrageLabel = cb.bossEnrageActive ? '  [OVERCHARGE]' : '';
        const coverLabel  = covered ? '  [cover]' : '';
        cb.log.push(`${enemy.name} attacks for ${dmg} damage.${critLabel}${enrageLabel}${coverLabel} Pilot HP: ${GameState.get().pilotHull}`);
        this.buildHeader();
        if (this.checkPlayerDeath()) return;
        this.renderCombat();
    }

    private checkPlayerDeath(): boolean {
        if (GameState.get().pilotHull <= 0) {
            this.phase = 'dead';
            this.clearContent();
            this.showDeathScreen();
            return true;
        }
        return false;
    }

    private onEnemyDefeated() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];

        // Collect loot
        const credits = rollCredits(enemy.id);
        const loot = rollLoot(enemy.id);
        this.runCredits += credits;
        this.runXp += enemy.xpReward;
        for (const item of loot) {
            const existing = this.runLoot.find(i => i.id === item.id);
            if (existing) existing.qty += item.qty;
            else this.runLoot.push({ ...item });
        }

        cb.log.push(`${enemy.name} destroyed. +${credits}c  +${enemy.xpReward} XP`);
        if (loot.length > 0) {
            cb.log.push(`Loot: ${loot.map(l => l.name).join(', ')}`);
        }

        // Remove the defeated enemy from the grid state
        if (this.gridState) {
            const ge = this.gridState.enemies.find(e => e.id === enemy.id);
            if (ge) {
                this.gridState.grid[ge.pos.row][ge.pos.col] = '.';
                this.gridState.enemies = this.gridState.enemies.filter(e => e.id !== enemy.id);
            }
        }

        // Advance to next enemy — reset per-enemy charge/scan/enrage state
        const nextEnemyIdx = cb.enemies.findIndex((e, i) => i > cb.enemyIndex && e.currentHp > 0);
        if (nextEnemyIdx !== -1) {
            const nextEnemy = cb.enemies[nextEnemyIdx];
            cb.enemyIndex = nextEnemyIdx;
            cb.enemyCharging = false;
            cb.enemySpecialUsed = false;
            cb.enemyScanned = false;
            cb.enemyExploitUsed = false;
            cb.bossEnrageActive = false;
            cb.bossPhase2Active = false;
            cb.enemyWeakenedTurns = 0; // WEAKENED is per-enemy
            cb.log.push(`${nextEnemy.name} engages.`);
            this.buildHeader();
            this.renderCombat();
        } else {
            // All enemies cleared — announce flawless before transitioning
            this.rooms[this.currentRoomIdx].cleared = true;
            if ((cb.damageTakenThisRoom) === 0) {
                cb.log.push('★ No damage taken — FLAWLESS bonus incoming!');
            }
            this.showPostCombat();
        }
    }

    private showPostCombat() {
        this.phase = 'post-combat';
        this.clearContent();
        const room = this.rooms[this.currentRoomIdx];

        // Flawless room bonus: no damage taken during this combat
        const flawless = (this.combat?.damageTakenThisRoom ?? 1) === 0;
        const flawlessBonus = 25;
        if (flawless) {
            this.runCredits += flawlessBonus;
        }

        this.contentContainer.add(
            this.add.rectangle(512, 330, 900, 400, C.panelBg).setStrokeStyle(1, C.border),
        );

        const isBoss = room.type === 'boss';
        const bossName = this.combat?.enemies[0]?.name ?? 'BOSS';
        const titleText = isBoss ? `${bossName.toUpperCase()} DESTROYED` : 'ROOM CLEARED';
        this.addContentText(512, 130, titleText, {
            fontFamily: 'Arial Black', fontSize: 22, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5);

        // Flawless badge
        if (flawless) {
            this.addContentText(512, 158, `★ FLAWLESS — No damage taken! +${flawlessBonus}c bonus`, {
                fontFamily: 'Arial Black', fontSize: 13, color: '#ffdd44', align: 'center',
            }).setOrigin(0.5);
        }

        const creditY = flawless ? 178 : 162;
        this.addContentText(512, creditY, `+${this.runCredits}c total  ·  +${this.runXp} XP this run`, {
            fontFamily: 'Arial', fontSize: 14, color: C.textWarn, align: 'center',
        }).setOrigin(0.5);

        if (this.runLoot.length > 0) {
            const lootY = flawless ? 216 : 200;
            this.addContentText(200, lootY, 'LOOT COLLECTED THIS RUN:', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textPrimary,
            });
            this.runLoot.forEach((item, i) => {
                this.addContentText(200, lootY + 24 + i * 22, `  ◆ ${item.name}  ×${item.qty}`, {
                    fontFamily: 'Arial', fontSize: 13, color: C.textPrimary,
                });
            });
        }

        this.buildHeader();

        const isLastRoom = this.currentRoomIdx + 1 >= this.rooms.length;
        if (isLastRoom) {
            this.addActionButton(512, 520, '[ EXTRACTION — RETURN TO STATION ]', () => this.showCompletion(), C.textSuccess);
        } else {
            this.addActionButton(380, 520, '[ ADVANCE ]', () => this.enterRoom(this.currentRoomIdx + 1));
            this.addActionButton(700, 520, '[ EXTRACT NOW ]', () => this.showCompletion(false), C.textSecond);
        }
    }

    // ── Dungeon complete ──────────────────────────────────────────────────
    private showCompletion(fullClear = true) {
        this.phase = 'complete';
        this.clearContent();

        // Determine which contracts this run completes using the dungeon's completion rules
        const completedContractIds: string[] = [];
        const gs = GameState.get();
        const def = this.dungeonDef!;
        const isRedline = gs.activeRunIsRedline;
        const bossCleared = this.rooms.find(r => r.type === 'boss')?.cleared ?? false;
        const lootCleared = this.rooms.some(r => (r.type === 'loot' || r.type === 'hazard') && r.cleared);

        for (const rule of def.contractCompletions) {
            if (gs.contracts.find(c => c.id === rule.contractId && c.accepted && !c.completed)) {
                const meetsBoss = !rule.requireBossCleared || bossCleared;
                const meetsLoot = !rule.requireLootCleared || lootCleared;
                const meetsAny  = !rule.requireAnyProgress || (bossCleared || lootCleared || this.currentRoomIdx > 0);
                if (meetsBoss && meetsLoot && meetsAny) {
                    completedContractIds.push(rule.contractId);
                }
            }
        }

        GameState.setReturnFromDungeon(this.runLoot, this.runCredits, this.runXp, fullClear, completedContractIds, def.id);
        if (bossCleared && def.clearFlag) GameState.setFlag(def.clearFlag, true);

        const panelBg = isRedline ? C.redlinePanelBg : C.panelBg;
        const panelBorder = isRedline ? C.redlineBorder : C.border;
        this.contentContainer.add(
            this.add.rectangle(512, 330, 900, 420, panelBg).setStrokeStyle(2, panelBorder),
        );

        // Title
        let title: string;
        let titleColor: string;
        if (isRedline && fullClear) {
            title = `⚠ REDLINE EXTRACTION — ${def.name.toUpperCase()}`;
            titleColor = C.textAccent;
        } else if (isRedline) {
            title = '⚠ REDLINE — PARTIAL EXTRACTION';
            titleColor = C.textWarn;
        } else if (fullClear) {
            title = `${def.name.toUpperCase()} — CLEARED`;
            titleColor = C.textSuccess;
        } else {
            title = 'EXTRACTION SUCCESSFUL';
            titleColor = C.textSuccess;
        }
        this.addContentText(512, 110, title, {
            fontFamily: 'Arial Black', fontSize: 22, color: titleColor, align: 'center',
            stroke: '#000000', strokeThickness: 3,
        }).setOrigin(0.5);

        if (isRedline) {
            this.addContentText(512, 144, 'You extracted alive. Gear is safe. Full contract reward secured.', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textAccent, align: 'center',
            }).setOrigin(0.5);
        } else {
            this.addContentText(512, 144, 'Returning to Meridian Station...', {
                fontFamily: 'Arial', fontSize: 14, color: C.textSecond, align: 'center',
            }).setOrigin(0.5);
        }

        this.addContentText(512, 172, `CREDITS EARNED:  +${this.runCredits}c`, {
            fontFamily: 'Arial Black', fontSize: 16, color: C.textWarn, align: 'center',
        }).setOrigin(0.5);

        this.addContentText(512, 198, `XP EARNED:       +${this.runXp}`, {
            fontFamily: 'Arial', fontSize: 15, color: C.textAccent, align: 'center',
        }).setOrigin(0.5);

        if (this.runLoot.length > 0) {
            const lootLabel = isRedline ? 'LOOT SECURED:' : 'SALVAGE:';
            const lootColor = isRedline ? C.textAccent : C.textPrimary;
            this.addContentText(200, 234, lootLabel, {
                fontFamily: 'Arial Black', fontSize: 13, color: lootColor,
            });
            this.runLoot.forEach((item, i) => {
                this.addContentText(200, 256 + i * 22, `  ◆ ${item.name}  ×${item.qty}`, {
                    fontFamily: 'Arial', fontSize: 13, color: C.textPrimary,
                });
            });
        }

        if (completedContractIds.length > 0) {
            const lootBase = 256 + this.runLoot.length * 22 + 14;
            this.addContentText(200, lootBase, 'CONTRACTS COMPLETED:', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textSuccess,
            });
            const contractTitleById = new Map(ALL_CONTRACTS.map(ct => [ct.id, ct.title]));
            completedContractIds.forEach((id, i) => {
                const label = contractTitleById.get(id) ?? id;
                this.addContentText(200, lootBase + 22 + i * 20, `  ✓ ${label}`, {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSuccess,
                });
            });
        }

        this.addActionButton(512, 580, '[ DOCK AT MERIDIAN STATION ]', () => {
            this.scene.start('Hub');
        }, C.textSuccess);
    }

    // ── Death / emergency extract ─────────────────────────────────────────
    private showDeathScreen() {
        const gs = GameState.get();
        const isRedline = gs.activeRunIsRedline;

        this.contentContainer.add(
            this.add.rectangle(512, 360, 900, 440, isRedline ? C.redlinePanelBg : C.panelDark)
                .setStrokeStyle(2, isRedline ? C.redlineBorder : C.border),
        );

        const titleText = isRedline ? '⚠ REDLINE FAILURE' : 'SYSTEMS CRITICAL';
        const titleColor = isRedline ? C.redlineText : C.textDanger;
        this.addContentText(512, 160, titleText, {
            fontFamily: 'Arial Black', fontSize: 28, color: titleColor, align: 'center',
            stroke: '#000000', strokeThickness: 4,
        }).setOrigin(0.5);

        this.addContentText(512, 208, 'Emergency extraction initiated.', {
            fontFamily: 'Arial', fontSize: 16, color: C.textSecond, align: 'center',
        }).setOrigin(0.5);

        // Set pilot to minimal HP so they can continue
        GameState.healPilot(10);

        if (isRedline) {
            // Capture insurance state BEFORE resolveRedlineDeath() clears it
            const insuranceWasActive = gs.redlineInsuranceActive;
            // Apply Redline gear loss
            const lossItems = GameState.resolveRedlineDeath();
            const securedId = gs.redlineSecuredItemId;

            this.addContentText(512, 246, 'Redline failure. Run loot is lost. Field gear loss calculated.', {
                fontFamily: 'Arial', fontSize: 13, color: C.redlineTextDim, align: 'center',
            }).setOrigin(0.5);

            // Loss summary
            this.addContentText(200, 284, 'ITEMS LOST:', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.redlineLoss,
            });
            if (lossItems.length === 0) {
                this.addContentText(200, 306, '  None. (No field consumables to lose)', {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
                });
            } else {
                lossItems.forEach((item, i) => {
                    this.addContentText(200, 306 + i * 20, `  ◆ ${item.name}  ×${item.qty}  — LOST`, {
                        fontFamily: 'Arial', fontSize: 12, color: C.redlineLoss,
                    });
                });
            }

            // Secured item
            if (securedId) {
                const securedItem = gs.inventory.find(i => i.id === securedId);
                if (securedItem) {
                    this.addContentText(200, 290 + lossItems.length * 20 + 20, `✓ SECURED: ${securedItem.name} — PROTECTED`, {
                        fontFamily: 'Arial Black', fontSize: 12, color: C.redlineSecured,
                    });
                }
            }

            // insuranceWasActive was captured before resolveRedlineDeath() cleared it.
            const insuranceWasUsed = insuranceWasActive;
            if (insuranceWasUsed) {
                this.addContentText(200, 320 + lossItems.length * 20 + 20, '✓ INSURANCE APPLIED — Loss reduced.', {
                    fontFamily: 'Arial Black', fontSize: 12, color: C.redlineInsure,
                });
            }

            GameState.setReturnFromDungeon([], 0, Math.floor(this.runXp * 0.3), false, [], this.dungeonDef?.id);
        } else {
            this.addContentText(512, 264, 'Salvage is lost. No contract credit.\nYour ship made it back to Meridian Station.', {
                fontFamily: 'Arial', fontSize: 14, color: C.textSecond, align: 'center', lineSpacing: 5,
            }).setOrigin(0.5);

            GameState.setReturnFromDungeon([], 0, Math.floor(this.runXp * 0.3), false, [], this.dungeonDef?.id);
        }

        this.addActionButton(512, 540, '[ RETURN TO MERIDIAN STATION ]', () => {
            this.scene.start('Hub');
        }, C.textWarn);
    }

    private doRetreat() {
        if (this.phase === 'complete' || this.phase === 'dead') return;
        this.phase = 'complete';
        GameState.setReturnFromDungeon(this.runLoot, this.runCredits, Math.floor(this.runXp * 0.5), false, [], this.dungeonDef?.id);
        this.scene.start('Hub');
    }

    /** Show a confirmation overlay before retreating — warns about the 50 % XP penalty. */
    private showRetreatConfirm() {
        if (this.phase === 'complete' || this.phase === 'dead') return;
        const wasInCombat = this.phase === 'combat';
        this.actionContainer.removeAll(true);

        const penaltyXp = Math.floor(this.runXp * 0.5);
        const penaltyText = penaltyXp > 0
            ? `You will keep ${penaltyXp} XP (50% penalty applied).`
            : 'You will lose all XP earned this run.';

        this.contentContainer.add(
            this.add.rectangle(512, 570, 820, 90, 0x120a0a).setStrokeStyle(1, 0x661111),
        );
        this.contentContainer.add(
            this.add.text(512, 548, `⚠  RETREAT — ${penaltyText}  Loot and credits kept.`, {
                fontFamily: 'Arial', fontSize: 12, color: C.textWarn, align: 'center',
            }).setOrigin(0.5),
        );
        this.addActionButton(370, 580, '[ CONFIRM RETREAT ]', () => this.doRetreat(), C.textDanger);
        this.addActionButton(660, 580, '[ CANCEL ]', () => {
            if (wasInCombat) this.renderCombat();
            else this.enterRoom(this.currentRoomIdx);
        }, C.textSecond);
    }
}
