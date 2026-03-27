import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState, InventoryItem } from '../state/GameState';
import { ENEMIES, EnemyDef, EnemySpecialAbility, rollLoot, rollCredits } from '../data/enemies';
import { ITEMS } from '../data/items';
import { DUNGEON_REGISTRY as _DUNGEON_REGISTRY, DungeonDef, Room, loadDungeon } from '../data/dungeons';
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

        // Reset run state
        this.currentRoomIdx = 0;
        this.combat = null;
        this.runLoot = [];
        this.runCredits = 0;
        this.runXp = 0;
        this.phase = 'intro';

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
     * Returns an appropriate highlight color for a combat-log line based on its content.
     * Crits, heals, burns, boss events, etc. each get a distinct tint so the log is
     * scannable at a glance rather than a wall of identical grey text.
     */
    private logLineColor(line: string): string {
        if (/^⚡ (CRITICAL|PRECISION|ARMOR|DIRECT)/.test(line))              return '#ffdd00'; // player crit — gold
        if (/^⚡ MOMENTUM/.test(line))                                        return '#ffdd44'; // momentum — yellow
        if (/PHASE 2|OVERCHARGE INITIATED/.test(line))                        return '#ff6622'; // boss escalation — hot orange
        if (/^⚠/.test(line))                                                  return C.textWarn; // generic warning — amber
        if (/💚 REGEN|restored.*HP|nano-repair/i.test(line))                  return C.textSuccess; // healing — green
        if (/🔥 BURN|BURNING/i.test(line))                                    return '#ff8844'; // burn — orange-red
        if (/^💥/.test(line))                                                  return '#ffdd44'; // combat stim — yellow
        if (/CANCELLED|Signal disruption/i.test(line))                        return C.textAccent; // disruption/cancel — cyan
        if (/SCAN|EXPLOIT/i.test(line))                                        return C.textAccent; // intel actions — cyan
        if (/[Pp]erfect evasion|slipped past/i.test(line))                    return C.textSuccess; // full evade — green
        if (/[Aa]ttack(s)? for|damage\. \(|damage \(reduced\)/i.test(line))   return '#ff5566'; // incoming damage — red
        if (/[Mm]omentum broken/.test(line))                                   return C.textWarn; // streak break — amber
        if (/[Cc]leared\.|[Cc]omplete\.|[Ss]ystems armed/i.test(line))        return C.textSecond; // system messages — grey
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

        this.contentContainer.add(
            this.add.rectangle(512, 300, 900, 340, C.panelBg).setStrokeStyle(1, C.border),
        );

        this.addContentText(512, 130, room.name.toUpperCase(), {
            fontFamily: 'Arial Black', fontSize: 20, color: room.type === 'boss' ? C.textDanger : C.textWarn,
            align: 'center',
        }).setOrigin(0.5);

        this.addContentText(80, 168, room.description, {
            fontFamily: 'Arial', fontSize: 14, color: C.textPrimary, lineSpacing: 5,
        });

        if (room.type === 'entrance') {
            this.addActionButton(512, 500, '[ ADVANCE ]', () => {
                if (idx + 1 < this.rooms.length) this.enterRoom(idx + 1);
                else this.showCompletion();
            });
        } else if (room.type === 'loot') {
            this.addActionButton(512, 500, '[ SEARCH ROOM ]', () => this.showLootRoom(room));
        } else if (room.type === 'hazard') {
            const hazardDamage = room.hazardDamage ?? 15;
            const lootNames = (room.lootItems ?? []).map(id => ITEMS[id]?.name ?? id).join(', ');
            this.addContentText(512, 390, `⚠ ENVIRONMENTAL HAZARD — Breaching this zone costs ${hazardDamage} pilot HP`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textDanger, align: 'center',
            }).setOrigin(0.5);
            if (lootNames) {
                this.addContentText(512, 412, `Potential salvage: ${lootNames}`, {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
                }).setOrigin(0.5);
            }
            this.addActionButton(340, 500, '[ BYPASS — ADVANCE SAFELY ]', () => {
                if (idx + 1 < this.rooms.length) this.enterRoom(idx + 1);
                else this.showCompletion();
            }, C.textSecond);
            this.addActionButton(720, 500, `[ BRAVE HAZARD (−${hazardDamage} HP) ]`,
                () => this.showHazardRoom(room), C.textWarn);
        } else if (room.type === 'combat' || room.type === 'boss') {
            const enemyNames = room.enemies.map(e => ENEMIES[e]?.name ?? e).join(', ');
            this.addContentText(512, 390, `THREATS DETECTED: ${enemyNames}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textDanger, align: 'center',
            }).setOrigin(0.5);
            this.addActionButton(380, 500, '[ ENGAGE ]', () => this.startCombat(room), C.textDanger);
            this.addActionButton(700, 500, '[ RETREAT ]', () => this.showRetreatConfirm(), C.textSecond);
        }
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

        const kitsLine1 = [
            { label: 'Med:', val: medKits },
            { label: 'Repair:', val: repairKits },
            { label: 'Anomaly:', val: anomalyKits },
        ];
        const kitsLine2 = [
            { label: 'Nano-Rep:', val: nanoKits },
            { label: 'Stim:', val: stimKits },
        ];
        const renderKitLine = (x: number, y: number, kits: {label: string; val: number}[]) => {
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
        renderKitLine(610, 348, kitsLine1);
        renderKitLine(610, 364, kitsLine2);

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

        // Momentum indicator — show when one hit away from or at threshold
        if (cb.playerHitStreak >= MOMENTUM_THRESHOLD - 1) {
            const bonusLabel = cb.playerHitStreak >= MOMENTUM_THRESHOLD
                ? `⚡ MOMENTUM ×${cb.playerHitStreak} — +25% DAMAGE ACTIVE`
                : `⚡ MOMENTUM ×${cb.playerHitStreak} — building… (1 more)`;
            this.addContentText(80, statusY, bonusLabel, {
                fontFamily: 'Arial', fontSize: 12, color: '#ffdd44',
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
        this.addActionButton(650, actionY + 48, '[ ANOMALY KIT ]', () => this.combatUseItem('anomaly-field-kit'),
            anomalyKits > 0 ? '#88ddff' : C.textSecond, anomalyKits === 0);

        // Row 3 — intel / exploit
        this.addActionButton(300, actionY + 96, '[ SCAN TARGET ]', () => this.combatScan(), C.textAccent);
        if (cb.enemyScanned && !cb.enemyExploitUsed) {
            this.addActionButton(660, actionY + 96, '[ EXPLOIT SCAN DATA ]',
                () => this.combatExploit(), '#ffaa00');
        }

        // Row 4 — retreat
        this.addActionButton(512, actionY + 148, '[ EMERGENCY RETREAT ]', () => this.showRetreatConfirm(), '#445566');
    }

    // ── Combat helpers ────────────────────────────────────────────────────

    /**
     * Increment the hit streak and log when momentum activates.
     * Call after any player action that doesn't trigger an enemy counter-attack for damage.
     */
    private incrementMomentum() {
        const cb = this.combat!;
        cb.playerHitStreak++;
        if (cb.playerHitStreak === MOMENTUM_THRESHOLD) {
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
        const momentumMult = cb.playerHitStreak >= MOMENTUM_THRESHOLD ? (1.0 + MOMENTUM_DAMAGE_BONUS) : 1.0;

        // Player attack — base damage scales +PLAYER_LEVEL_DAMAGE_BONUS per level above 1
        const levelBonus = (gs.level - 1) * PLAYER_LEVEL_DAMAGE_BONUS;
        const rawRoll = Phaser.Math.Between(PLAYER_BASE_DMG_MIN + levelBonus, PLAYER_BASE_DMG_MAX + levelBonus);
        const isPlayerCrit = Math.random() < PLAYER_CRIT_CHANCE;
        const playerDmg = Math.max(1, Math.floor(
            rawRoll * (isPlayerCrit ? CRIT_MULTIPLIER : 1.0) * disruptMult * boostMult * momentumMult,
        ) - enemy.defense);
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);

        // Build combat log message
        const hitMsg  = isPlayerCrit ? pick(PLAYER_CRIT_MSGS) : pick(PLAYER_HIT_MSGS);
        const suffixes: string[] = [];
        if (disrupted && disruptMult < 1.0) suffixes.push('[disrupted]');
        if (boosted) suffixes.push('[stimmed]');
        if (momentumMult > 1.0) suffixes.push('[momentum]');
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
            const reduced = Math.max(1, Math.floor(rawDmg * 0.35) - shieldDamageReduction(gs.shipStatOverrides.shieldingBonus));
            GameState.damagePilot(reduced);
            cb.damageTakenThisRoom += reduced;
            // Taking damage breaks the streak
            if (cb.playerHitStreak >= MOMENTUM_THRESHOLD) cb.log.push('Momentum broken.');
            cb.playerHitStreak = 0;
            cb.log.push(`${enemy.name} attacks for ${reduced} damage (reduced). Pilot HP: ${GameState.get().pilotHull}`);
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
     */
    private processEnemyTurn() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const spec = (enemy as EnemyDef & { specialAbility?: EnemySpecialAbility }).specialAbility;

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
        const dmg = Math.max(1,
            Math.floor(rawDmg * spec.damageMult * enrageMult)
            - 2
            - shieldDamageReduction(gs.shipStatOverrides.shieldingBonus),
        );
        GameState.damagePilot(dmg);
        cb.damageTakenThisRoom += dmg;

        // Break momentum streak when the player takes damage from a special
        if (dmg > 0) {
            if (cb.playerHitStreak >= MOMENTUM_THRESHOLD) {
                cb.log.push('Momentum broken.');
            }
            cb.playerHitStreak = 0;
        }

        cb.log.push(`💥 ${enemy.name}: ${spec.executeMsg} — ${dmg} damage!`);

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
        const momentumMult = cb.playerHitStreak >= MOMENTUM_THRESHOLD ? (1.0 + MOMENTUM_DAMAGE_BONUS) : 1.0;

        const levelBonus = (gs.level - 1) * PLAYER_LEVEL_DAMAGE_BONUS;
        const rawRoll = Phaser.Math.Between(PLAYER_BASE_DMG_MIN + levelBonus, PLAYER_BASE_DMG_MAX + levelBonus);
        const playerDmg = Math.max(1, Math.floor(rawRoll * EXPLOIT_DAMAGE_MULT * disruptMult * boostMult * momentumMult) - enemy.defense);
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);

        const suffixes: string[] = [];
        if (disrupted && disruptMult < 1.0) suffixes.push('[disrupted]');
        if (boosted) suffixes.push('[stimmed]');
        if (momentumMult > 1.0) suffixes.push('[momentum]');
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
     * SCAN action: reveals detailed enemy intel in the combat log.
     * The enemy fires back at 50% damage (player is distracted by scanning).
     */
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
        const dmg = Math.max(1,
            Math.floor(rawDmg * 0.5 * enrageMult)
            - 2
            - shieldDamageReduction(gs.shipStatOverrides.shieldingBonus),
        );
        GameState.damagePilot(dmg);
        cb.damageTakenThisRoom += dmg;

        // Break momentum streak when the player takes damage during a scan
        if (dmg > 0) {
            if (cb.playerHitStreak >= MOMENTUM_THRESHOLD) {
                cb.log.push('Momentum broken.');
            }
            cb.playerHitStreak = 0;
        }

        cb.log.push(`${enemy.name} fires during scan — ${dmg} damage (reduced). Pilot HP: ${GameState.get().pilotHull}`);

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

        const dmg = Math.max(1, Math.floor(rawDmg * (isEnemyCrit ? CRIT_MULTIPLIER : 1.0) * enrageMult) - 2 - shieldDamageReduction(gs.shipStatOverrides.shieldingBonus));
        GameState.damagePilot(dmg);
        cb.damageTakenThisRoom += dmg;

        // Break the momentum streak when the player takes damage
        if (dmg > 0) {
            if (cb.playerHitStreak >= MOMENTUM_THRESHOLD) {
                cb.log.push('Momentum broken.');
            }
            cb.playerHitStreak = 0;
        }

        const critLabel = isEnemyCrit ? '  [CRIT]' : '';
        const enrageLabel = cb.bossEnrageActive ? '  [OVERCHARGE]' : '';
        cb.log.push(`${enemy.name} attacks for ${dmg} damage.${critLabel}${enrageLabel} Pilot HP: ${GameState.get().pilotHull}`);
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
            cb.log.push(`${nextEnemy.name} engages.`);
            this.buildHeader();
            this.renderCombat();
        } else {
            // All enemies cleared
            this.rooms[this.currentRoomIdx].cleared = true;
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
