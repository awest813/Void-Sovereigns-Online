import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState, InventoryItem } from '../state/GameState';
import { ENEMIES, EnemyDef, rollLoot, rollCredits } from '../data/enemies';
import { ITEMS } from '../data/items';
import { DUNGEON_REGISTRY as _DUNGEON_REGISTRY, DungeonDef, Room, loadDungeon } from '../data/dungeons';
import { starterContracts } from '../../../content/contracts/starter-contracts';
import { phase2Contracts } from '../../../content/contracts/phase2-contracts';
import { phase3Contracts } from '../../../content/contracts/phase3-contracts';
import { phase4Contracts } from '../../../content/contracts/phase4-contracts';
import { phase5Contracts } from '../../../content/contracts/phase5-contracts';
import { T } from '../ui/UITheme';
import { DebugPanel } from '../ui/DebugPanel';

// Scene colour palette — extends shared UITheme with dungeon-atmosphere overrides.
const C = {
    ...T,
    bg:        T.bgDeep,     // deeper space
    panelBg:   T.panelMid,   // greenish-dark panels
    border:    T.borderFaint, // subtle border
    textSecond:'#666677',     // dimmer secondary text
    barHull:   0x33994d,      // slightly cooler hull green
    barDamaged:0xaa4422,      // slightly muted damaged
    barFuel:   0x336699,      // muted fuel blue
};

// All contracts from all phases — used for ID→title lookups in completion screen.
const ALL_CONTRACTS = [...starterContracts, ...phase2Contracts, ...phase3Contracts, ...phase4Contracts, ...phase5Contracts];

// ── DungeonScene ────────────────────────────────────────────────────────────
type DungeonPhase =
    | 'intro'
    | 'room-enter'
    | 'combat'
    | 'post-combat'
    | 'loot'
    | 'complete'
    | 'dead';

interface CombatState {
    enemies: Array<EnemyDef & { currentHp: number }>;
    enemyIndex: number;   // which enemy is active
    log: string[];
    playerDodging: boolean;
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
            // Fallback if invalid ID: use shalehook
            this.dungeonDef = loadDungeon('shalehook-dig-site')!;
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
        c.add(this.add.rectangle(510, 20, 120, 10, 0x1a1a2a).setStrokeStyle(1, C.border));
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
        c.add(this.add.rectangle(695, 20, 100, 10, 0x1a1a2a).setStrokeStyle(1, C.border));
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
        const btn = this.add.text(x, y, label, {
            fontFamily: 'Arial Black', fontSize: 16, color: disabled ? '#555566' : color,
        }).setOrigin(0.5);
        if (!disabled) {
            btn.setInteractive({ useHandCursor: true });
            btn.on('pointerover', () => btn.setColor(C.btnHover));
            btn.on('pointerout', () => btn.setColor(color));
            btn.on('pointerdown', callback);
        }
        this.actionContainer.add(btn);
        return btn;
    }

    // ── Phases ────────────────────────────────────────────────────────────
    private showIntro() {
        this.phase = 'intro';
        this.clearContent();
        const def = this.dungeonDef!;
        const gs = GameState.get();
        const isRedlineRun = gs.activeRunIsRedline;

        // Panel
        this.contentContainer.add(
            this.add.rectangle(512, 330, 900, 380, isRedlineRun ? 0x0f0005 : C.panelBg)
                .setStrokeStyle(1, isRedlineRun ? 0xaa2222 : C.border),
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
            this.add.rectangle(512, 340, 900, 440, 0x0a0005).setStrokeStyle(2, 0xaa2222),
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
                const color = isSecured ? '#44ff88' : '#ff8855';
                this.addContentText(110, 234 + i * 22, label, {
                    fontFamily: 'Arial', fontSize: 12, color,
                });
            });
        }

        // Insurance status
        const insuranceY = 240 + atRiskItems.length * 22;
        if (insuranceActive) {
            this.addContentText(110, insuranceY, '✓ FIELD INSURANCE ACTIVE — One additional item protected on death', {
                fontFamily: 'Arial Black', fontSize: 12, color: '#44ff88',
            });
        } else {
            this.addContentText(110, insuranceY, '✗ No insurance — Purchase at Meridian Services (250c) before launch', {
                fontFamily: 'Arial', fontSize: 12, color: '#996644',
            });
        }

        // What you gain on success
        this.addContentText(110, insuranceY + 36, 'ON SUCCESSFUL EXTRACTION:', {
            fontFamily: 'Arial Black', fontSize: 13, color: '#ffaa44',
        });
        this.addContentText(110, insuranceY + 56, '  All run loot recovered  ·  Full contract reward claimed  ·  Faction reputation earned', {
            fontFamily: 'Arial', fontSize: 12, color: C.textPrimary,
        });

        // What you lose on death
        this.addContentText(110, insuranceY + 88, 'ON DEATH (emergency extract):', {
            fontFamily: 'Arial Black', fontSize: 13, color: '#ff5533',
        });
        const lossLines = insuranceActive
            ? '  Run loot is lost  ·  1 field consumable lost (insurance reduces from 2 to 1)  ·  Secured item is safe'
            : '  Run loot is lost  ·  Up to 2 field consumables lost  ·  Secured item (if set) is safe';
        this.addContentText(110, insuranceY + 108, lossLines, {
            fontFamily: 'Arial', fontSize: 12, color: '#cc6644',
        });

        this.addContentText(512, 576, '"Go prepared. Extract alive."', {
            fontFamily: 'Arial', fontSize: 12, color: '#774433', align: 'center', fontStyle: 'italic',
        }).setOrigin(0.5);

        this.addActionButton(340, 630, '[ ENTER SITE — ACCEPT RISK ]', () => this.enterRoom(0), '#ff4422');
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
            this.addActionButton(512, 500, '[ ADVANCE ]', () => this.enterRoom(idx + 1));
        } else if (room.type === 'loot' || room.type === 'hazard') {
            this.addActionButton(512, 500, '[ SEARCH ROOM ]', () => this.showLootRoom(room));
        } else if (room.type === 'combat' || room.type === 'boss') {
            const enemyNames = room.enemies.map(e => ENEMIES[e]?.name ?? e).join(', ');
            this.addContentText(512, 390, `THREATS DETECTED: ${enemyNames}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textDanger, align: 'center',
            }).setOrigin(0.5);
            this.addActionButton(380, 500, '[ ENGAGE ]', () => this.startCombat(room), C.textDanger);
            this.addActionButton(700, 500, '[ RETREAT ]', () => this.doRetreat(), C.textSecond);
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

        room.cleared = true;

        this.addActionButton(512, 560, '[ CONTINUE ]', () => {
            if (this.currentRoomIdx + 1 < this.rooms.length) {
                this.enterRoom(this.currentRoomIdx + 1);
            } else {
                this.showCompletion();
            }
        });
    }

    // ── Combat ────────────────────────────────────────────────────────────
    private startCombat(room: Room) {
        this.phase = 'combat';
        const enemyDefs = room.enemies
            .map(id => ENEMIES[id])
            .filter(Boolean)
            .map(def => ({ ...def, currentHp: def.hp }));

        this.combat = {
            enemies: enemyDefs,
            enemyIndex: 0,
            log: [],
            playerDodging: false,
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

        // Panel background
        this.contentContainer.add(
            this.add.rectangle(512, 360, 1000, 580, C.panelBg).setStrokeStyle(1, C.border),
        );

        // Enemy block
        const enemyHpPct = enemy.currentHp / enemy.hp;
        this.addContentText(512, 82, enemy.name.toUpperCase(), {
            fontFamily: 'Arial Black', fontSize: 18, color: C.textDanger, align: 'center',
        }).setOrigin(0.5);

        this.addContentText(512, 104, enemy.description, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
        }).setOrigin(0.5);

        // Enemy HP bar
        this.contentContainer.add(this.add.rectangle(512, 130, 360, 16, 0x1a0a0a).setStrokeStyle(1, C.border));
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

        // Combat log
        this.contentContainer.add(
            this.add.rectangle(512, 258, 940, 150, 0x080810).setStrokeStyle(1, C.border),
        );
        const logLines = cb.log.slice(-5);
        logLines.forEach((line, i) => {
            const alpha = 0.4 + (i / Math.max(logLines.length - 1, 1)) * 0.6;
            const logText = this.addContentText(60, 192 + i * 24, `▶ ${line}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textSecond,
            });
            logText.setAlpha(alpha);
        });

        // Player status row
        const pilotPct = gs.pilotHull / gs.pilotMaxHull;
        const shipPct = gs.shipHull / gs.shipMaxHull;

        this.addContentText(80, 348, `PILOT HP:`, {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond,
        });
        this.contentContainer.add(this.add.rectangle(190, 358, 160, 12, 0x0a1a0a).setStrokeStyle(1, C.border));
        this.contentContainer.add(this.add.rectangle(
            110 + (pilotPct * 160) / 2, 358,
            pilotPct * 160, 12,
            pilotPct > 0.4 ? C.barHull : C.barDamaged,
        ));
        this.addContentText(278, 349, `${gs.pilotHull}/${gs.pilotMaxHull}`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });

        this.addContentText(340, 348, `SHIP HP:`, {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond,
        });
        this.contentContainer.add(this.add.rectangle(445, 358, 120, 12, 0x0a0a1a).setStrokeStyle(1, C.border));
        this.contentContainer.add(this.add.rectangle(
            385 + (shipPct * 120) / 2, 358,
            shipPct * 120, 12,
            shipPct > 0.4 ? C.barHull : C.barDamaged,
        ));
        this.addContentText(515, 349, `${gs.shipHull}/${gs.shipMaxHull}`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });

        // Inventory
        const medKits = GameState.countItem('medical-kit');
        const repairKits = GameState.countItem('repair-kit');
        const anomalyKits = GameState.countItem('anomaly-field-kit');
        this.addContentText(610, 348, `Med: ${medKits}  Repair: ${repairKits}  Anomaly: ${anomalyKits}`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });

        // ── Action buttons ──────────────────────────────────────────────
        const actionY = 420;
        this.addActionButton(180, actionY, '[ ATTACK ]', () => this.combatAttack(), C.textDanger);
        this.addActionButton(380, actionY, '[ DODGE ]', () => this.combatDodge(), C.textWarn);
        this.addActionButton(570, actionY, '[ USE MED KIT ]', () => this.combatUseItem('medical-kit'),
            medKits > 0 ? C.textSuccess : C.textSecond, medKits === 0);
        this.addActionButton(780, actionY, '[ USE REPAIR KIT ]', () => this.combatUseItem('repair-kit'),
            repairKits > 0 ? C.textAccent : C.textSecond, repairKits === 0);
        this.addActionButton(512, actionY + 52, '[ USE ANOMALY KIT ]', () => this.combatUseItem('anomaly-field-kit'),
            anomalyKits > 0 ? '#88ddff' : C.textSecond, anomalyKits === 0);

        this.addActionButton(512, actionY + 104, '[ EMERGENCY RETREAT ]', () => this.doRetreat(), '#445566');
    }

    private combatAttack() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];

        // Player attack
        const playerDmg = Math.max(1, Phaser.Math.Between(12, 22) - enemy.defense);
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);
        cb.log.push(`You attack for ${playerDmg} damage. (${enemy.currentHp}/${enemy.hp} HP)`);

        if (enemy.currentHp <= 0) {
            this.onEnemyDefeated();
            return;
        }

        // Enemy counter-attack
        this.enemyAttack(false);
    }

    private combatDodge() {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];

        cb.log.push('You brace and dodge — reduced incoming damage this turn.');
        cb.playerDodging = true;

        // Enemy attack with halved damage
        const rawDmg = Phaser.Math.Between(enemy.attackMin, enemy.attackMax);
        const reduced = Math.max(1, Math.floor(rawDmg * 0.35));
        GameState.damagePilot(reduced);
        cb.log.push(`${enemy.name} attacks for ${reduced} damage (reduced). Pilot HP: ${GameState.get().pilotHull}`);
        cb.playerDodging = false;

        this.checkPlayerDeath();
    }

    private combatUseItem(itemId: string) {
        const cb = this.combat!;
        const item = GameState.useItem(itemId);
        if (!item) return;

        const def = ITEMS[itemId];
        if (def?.effect?.healPilot) {
            GameState.healPilot(def.effect.healPilot);
            cb.log.push(`Used ${item.name} — restored ${def.effect.healPilot} pilot HP. (${GameState.get().pilotHull}/${GameState.get().pilotMaxHull})`);
        } else if (def?.effect?.healShip) {
            GameState.healShip(def.effect.healShip);
            cb.log.push(`Used ${item.name} — repaired ${def.effect.healShip} ship HP. (${GameState.get().shipHull}/${GameState.get().shipMaxHull})`);
        }

        // Enemy still attacks
        this.enemyAttack(false);
    }

    private enemyAttack(logOnly: boolean) {
        const cb = this.combat!;
        const enemy = cb.enemies[cb.enemyIndex];
        const dmg = Math.max(1, Phaser.Math.Between(enemy.attackMin, enemy.attackMax) - 2);
        GameState.damagePilot(dmg);
        if (!logOnly) {
            cb.log.push(`${enemy.name} attacks for ${dmg} damage. Pilot HP: ${GameState.get().pilotHull}`);
        }
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

        // Advance to next enemy
        const nextEnemy = cb.enemies.find((e, i) => i > cb.enemyIndex && e.currentHp > 0);
        if (nextEnemy) {
            cb.enemyIndex = cb.enemies.indexOf(nextEnemy);
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

        this.contentContainer.add(
            this.add.rectangle(512, 330, 900, 400, C.panelBg).setStrokeStyle(1, C.border),
        );

        const isBoss = room.type === 'boss';
        const bossName = this.combat?.enemies[0]?.name ?? 'BOSS';
        const titleText = isBoss ? `${bossName.toUpperCase()} DESTROYED` : 'ROOM CLEARED';
        this.addContentText(512, 130, titleText, {
            fontFamily: 'Arial Black', fontSize: 22, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5);

        this.addContentText(512, 162, `+${this.runCredits}c total  ·  +${this.runXp} XP this run`, {
            fontFamily: 'Arial', fontSize: 14, color: C.textWarn, align: 'center',
        }).setOrigin(0.5);

        if (this.runLoot.length > 0) {
            this.addContentText(200, 200, 'LOOT COLLECTED THIS RUN:', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textPrimary,
            });
            this.runLoot.forEach((item, i) => {
                this.addContentText(200, 224 + i * 22, `  ◆ ${item.name}  ×${item.qty}`, {
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

        const panelBg = isRedline ? 0x050008 : C.panelBg;
        const panelBorder = isRedline ? 0x886600 : C.border;
        this.contentContainer.add(
            this.add.rectangle(512, 330, 900, 420, panelBg).setStrokeStyle(2, panelBorder),
        );

        // Title
        let title: string;
        let titleColor: string;
        if (isRedline && fullClear) {
            title = `⚠ REDLINE EXTRACTION — ${def.name.toUpperCase()}`;
            titleColor = '#ffaa22';
        } else if (isRedline) {
            title = '⚠ REDLINE — PARTIAL EXTRACTION';
            titleColor = '#ff8822';
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
                fontFamily: 'Arial Black', fontSize: 13, color: '#ffaa44', align: 'center',
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
            const lootColor = isRedline ? '#ffaa44' : C.textPrimary;
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
            this.add.rectangle(512, 360, 900, 440, isRedline ? 0x0a0005 : 0x0a0308)
                .setStrokeStyle(2, isRedline ? 0xaa1111 : C.border),
        );

        const titleText = isRedline ? '⚠ REDLINE FAILURE' : 'SYSTEMS CRITICAL';
        const titleColor = isRedline ? '#ff2222' : C.textDanger;
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
                fontFamily: 'Arial', fontSize: 13, color: '#cc4422', align: 'center',
            }).setOrigin(0.5);

            // Loss summary
            this.addContentText(200, 284, 'ITEMS LOST:', {
                fontFamily: 'Arial Black', fontSize: 13, color: '#ff5533',
            });
            if (lossItems.length === 0) {
                this.addContentText(200, 306, '  None. (No field consumables to lose)', {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
                });
            } else {
                lossItems.forEach((item, i) => {
                    this.addContentText(200, 306 + i * 20, `  ◆ ${item.name}  ×${item.qty}  — LOST`, {
                        fontFamily: 'Arial', fontSize: 12, color: '#ff5533',
                    });
                });
            }

            // Secured item
            if (securedId) {
                const securedItem = gs.inventory.find(i => i.id === securedId);
                if (securedItem) {
                    this.addContentText(200, 290 + lossItems.length * 20 + 20, `✓ SECURED: ${securedItem.name} — PROTECTED`, {
                        fontFamily: 'Arial Black', fontSize: 12, color: '#44ff88',
                    });
                }
            }

            const insuranceWasUsed = insuranceWasActive && lossItems.length <= 1;
            if (insuranceWasUsed) {
                this.addContentText(200, 320 + lossItems.length * 20 + 20, '✓ INSURANCE APPLIED — Loss reduced.', {
                    fontFamily: 'Arial Black', fontSize: 12, color: '#44ffaa',
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
}

