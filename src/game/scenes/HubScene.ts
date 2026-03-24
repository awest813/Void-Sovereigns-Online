import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState } from '../state/GameState';
import { starterContracts } from '../../../content/contracts/starter-contracts';
import { meridianNPCs } from '../../../content/npcs/meridian-npcs';

// ── Colour palette ──────────────────────────────────────────────────────────
const C = {
    bg:          0x080818,
    panelBg:     0x0d0d22,
    border:      0x223355,
    textPrimary: '#e8e0cc',
    textSecond:  '#888899',
    textAccent:  '#5599ee',
    textWarn:    '#dd9944',
    textDanger:  '#dd4444',
    textSuccess: '#44cc88',
    btnNormal:   '#aabbcc',
    btnHover:    '#ffffff',
    btnAccent:   '#55aaff',
    barFull:     0x44aa66,
    barDamaged:  0xcc6622,
    barFuel:     0x4488cc,
};

// Board contracts shown in Phase 1
const BOARD_CONTRACT_IDS = [
    'scrap-recovery-shalehook',
    'robot-suppression-shalehook',
    'equipment-retrieval-shalehook',
    'bounty-rogue-drone-mk3',
    'delivery-fuel-cells-ashwake',
];

// Phase 1 NPCs shown in hub
const HUB_NPC_IDS = [
    'tamsin-vale',
    'rook-mendera',
    'ilya-sorn',
    'nera-quill',
    'brother-caldus',
];

// ── HubScene ────────────────────────────────────────────────────────────────
export class HubScene extends Scene {
    private panels: Map<string, Phaser.GameObjects.Container> = new Map();
    private statusBarTexts: { credits: Phaser.GameObjects.Text; xp: Phaser.GameObjects.Text; level: Phaser.GameObjects.Text } | null = null;
    private shipHullBar: Phaser.GameObjects.Rectangle | null = null;
    private shipFuelBar: Phaser.GameObjects.Rectangle | null = null;
    private shipHullText: Phaser.GameObjects.Text | null = null;
    private shipFuelText: Phaser.GameObjects.Text | null = null;

    constructor() {
        super('Hub');
    }

    create() {
        const gs = GameState.get();
        this.cameras.main.setBackgroundColor(C.bg);

        this.buildStatusBar();
        this.buildShipBar();
        this.buildMainPanel();
        this.buildContractPanel();
        this.buildNpcListPanel();
        this.buildServicesPanel();
        this.buildShipStatusPanel();

        if (gs.returnFromDungeon) {
            this.buildDebriefPanel();
            this.showPanel('debrief');
            GameState.clearReturnFromDungeon();
        } else {
            this.showPanel('main');
        }

        EventBus.emit('current-scene-ready', this);
    }

    // ── Status bar (top) ──────────────────────────────────────────────────
    private buildStatusBar() {
        const gs = GameState.get();
        this.add.rectangle(512, 20, 1024, 40, C.panelBg);
        this.add.rectangle(512, 40, 1024, 1, C.border);

        this.add.text(16, 12, 'MERIDIAN STATION', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textAccent,
        });

        this.statusBarTexts = {
            credits: this.add.text(400, 12, `CREDITS: ${gs.credits}c`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textWarn,
            }),
            xp: this.add.text(580, 12, `XP: ${gs.xp}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textSecond,
            }),
            level: this.add.text(680, 12, `LVL: ${gs.level}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textPrimary,
            }),
        };

        // Show last-run credits if we just returned
        if (gs.returnFromDungeon && gs.lastRunCredits > 0) {
            this.add.text(750, 12, `+${gs.lastRunCredits}c`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textSuccess,
            });
        }
    }

    private refreshStatusBar() {
        const gs = GameState.get();
        if (!this.statusBarTexts) return;
        this.statusBarTexts.credits.setText(`CREDITS: ${gs.credits}c`);
        this.statusBarTexts.xp.setText(`XP: ${gs.xp}`);
        this.statusBarTexts.level.setText(`LVL: ${gs.level}`);
    }

    // ── Ship bar (bottom) ─────────────────────────────────────────────────
    private buildShipBar() {
        const gs = GameState.get();
        const y = 748;
        this.add.rectangle(512, y, 1024, 1, C.border);
        this.add.rectangle(512, y + 10, 1024, 20, C.panelBg);

        this.add.text(16, y + 3, 'SHIP: Cutter Mk.I', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });

        // Hull bar
        this.add.text(190, y + 3, 'HULL', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });
        this.add.rectangle(240, y + 10, 100, 10, 0x223322);
        const hullPct = gs.shipHull / gs.shipMaxHull;
        this.shipHullBar = this.add.rectangle(
            240 - 50 + (hullPct * 100) / 2, y + 10,
            hullPct * 100, 10,
            hullPct > 0.5 ? C.barFull : C.barDamaged,
        );
        this.shipHullText = this.add.text(295, y + 3, `${gs.shipHull}/${gs.shipMaxHull}`, {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
        });

        // Fuel bar
        this.add.text(380, y + 3, 'FUEL', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });
        this.add.rectangle(415, y + 10, 80, 10, 0x112233);
        const fuelPct = gs.shipFuel / gs.shipMaxFuel;
        this.shipFuelBar = this.add.rectangle(
            415 - 40 + (fuelPct * 80) / 2, y + 10,
            fuelPct * 80, 10,
            C.barFuel,
        );
        this.shipFuelText = this.add.text(500, y + 3, `${gs.shipFuel}/${gs.shipMaxFuel}`, {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
        });

        // Relay progress hint
        this.add.text(590, y + 3, '▶ GOAL: Meridian Hauler II (relay-capable) — 3,800c needed', {
            fontFamily: 'Arial', fontSize: 11, color: C.textWarn,
        });
    }

    private refreshShipBar() {
        const gs = GameState.get();
        if (!this.shipHullBar || !this.shipFuelBar) return;
        const hullPct = gs.shipHull / gs.shipMaxHull;
        this.shipHullBar.setSize(hullPct * 100, 10);
        this.shipHullBar.setFillStyle(hullPct > 0.5 ? C.barFull : C.barDamaged);
        this.shipHullText?.setText(`${gs.shipHull}/${gs.shipMaxHull}`);
        const fuelPct = gs.shipFuel / gs.shipMaxFuel;
        this.shipFuelBar.setSize(fuelPct * 80, 10);
        this.shipFuelText?.setText(`${gs.shipFuel}/${gs.shipMaxFuel}`);
    }

    // ── Panel utilities ───────────────────────────────────────────────────
    private showPanel(name: string) {
        for (const [key, container] of this.panels) {
            container.setVisible(key === name);
        }
    }

    private makeButton(
        container: Phaser.GameObjects.Container,
        x: number,
        y: number,
        label: string,
        callback: () => void,
        color = C.btnNormal,
    ): Phaser.GameObjects.Text {
        const btn = this.add.text(x, y, label, {
            fontFamily: 'Arial', fontSize: 18, color,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setColor(C.btnHover));
        btn.on('pointerout', () => btn.setColor(color));
        btn.on('pointerdown', callback);
        container.add(btn);
        return btn;
    }

    private panelHeader(container: Phaser.GameObjects.Container, title: string, subtitle = '') {
        container.add(
            this.add.text(512, 80, title, {
                fontFamily: 'Arial Black', fontSize: 26, color: C.textPrimary,
                stroke: '#000000', strokeThickness: 4, align: 'center',
            }).setOrigin(0.5),
        );
        if (subtitle) {
            container.add(
                this.add.text(512, 116, subtitle, {
                    fontFamily: 'Arial', fontSize: 14, color: C.textSecond, align: 'center',
                }).setOrigin(0.5),
            );
        }
    }

    // ── Main panel ────────────────────────────────────────────────────────
    private buildMainPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('main', c);

        this.panelHeader(c, 'MERIDIAN STATION', 'Low-rent. Busy. Yours for now.');

        const items = [
            { label: '[ CONTRACT BOARD ]', sub: 'Take on work in the Belt',         target: 'contracts' },
            { label: '[ SERVICES ]',        sub: 'Repair, fuel, supplies',           target: 'services' },
            { label: '[ SECTOR MAP ]',      sub: 'Launch to Ashwake Belt',           target: 'sectormap' },
            { label: '[ STATION CONTACTS ]',sub: 'Talk to station NPCs',             target: 'npcs' },
            { label: '[ SHIP STATUS ]',     sub: 'Current ship + upgrade path',      target: 'shipstatus' },
        ];

        items.forEach((item, i) => {
            const y = 200 + i * 82;
            c.add(this.add.rectangle(512, y + 18, 420, 64, C.panelBg).setStrokeStyle(1, C.border));

            const btn = this.add.text(512, y + 6, item.label, {
                fontFamily: 'Arial Black', fontSize: 19, color: C.textPrimary, align: 'center',
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            btn.on('pointerover', () => btn.setColor(C.btnHover));
            btn.on('pointerout', () => btn.setColor(C.textPrimary));
            btn.on('pointerdown', () => {
                if (item.target === 'sectormap') {
                    this.scene.start('SectorMap');
                } else {
                    this.showPanel(item.target);
                }
            });
            c.add(btn);

            c.add(this.add.text(512, y + 32, item.sub, {
                fontFamily: 'Arial', fontSize: 13, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        });

        // Station flavor
        c.add(this.add.text(512, 630, '"Thirty ships a day, once. Now eight. The Relays went out and everyone forgot we existed."', {
            fontFamily: 'Arial', fontSize: 13, color: '#555566', align: 'center', fontStyle: 'italic',
        }).setOrigin(0.5));
    }

    // ── Contract board ────────────────────────────────────────────────────
    private buildContractPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('contracts', c);
        this.populateContractPanel(c);
    }

    private populateContractPanel(c: Phaser.GameObjects.Container) {
        c.removeAll(true);
        this.panelHeader(c, 'CONTRACT BOARD', 'Meridian Station — Tamsin Vale, Dispatcher');

        const contracts = starterContracts.filter(ct => BOARD_CONTRACT_IDS.includes(ct.id));
        const rowH = 90;
        const startY = 148;

        contracts.forEach((ct, i) => {
            const y = startY + i * rowH;
            const isAccepted = GameState.isContractAccepted(ct.id);
            const isCompleted = GameState.isContractCompleted(ct.id);

            c.add(this.add.rectangle(492, y + 36, 860, rowH - 8, C.panelBg).setStrokeStyle(1, C.border));

            // Tier badge
            const tierColor = ct.tier === 1 ? C.textSuccess : C.textWarn;
            c.add(this.add.text(80, y + 10, `T${ct.tier}`, {
                fontFamily: 'Arial Black', fontSize: 13, color: tierColor,
            }).setOrigin(0.5));

            // Category
            const catLabel = ct.category.toUpperCase();
            c.add(this.add.text(80, y + 30, catLabel, {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
            }).setOrigin(0.5));

            // Title
            c.add(this.add.text(140, y + 8, ct.title, {
                fontFamily: 'Arial Black', fontSize: 14, color: C.textPrimary,
            }));

            // Description (truncated)
            const desc = ct.description.length > 110 ? ct.description.slice(0, 107) + '…' : ct.description;
            c.add(this.add.text(140, y + 28, desc, {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
                wordWrap: { width: 560 },
            }));

            // Reward
            c.add(this.add.text(140, y + 62, `REWARD: ${ct.reward.credits}c + ${ct.reward.xp} XP`, {
                fontFamily: 'Arial', fontSize: 12, color: C.textWarn,
            }));

            // State button
            if (isCompleted) {
                const turnInBtn = this.add.text(870, y + 36, '[ TURN IN ]', {
                    fontFamily: 'Arial Black', fontSize: 14, color: C.textSuccess,
                }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
                turnInBtn.on('pointerover', () => turnInBtn.setColor('#ffffff'));
                turnInBtn.on('pointerout', () => turnInBtn.setColor(C.textSuccess));
                turnInBtn.on('pointerdown', () => {
                    GameState.turnInContract(ct.id);
                    GameState.addCredits(ct.reward.credits);
                    GameState.addXp(ct.reward.xp);
                    if (ct.reward.reputationGain) {
                        for (const [fac, amt] of Object.entries(ct.reward.reputationGain)) {
                            GameState.gainReputation(fac, amt);
                        }
                    }
                    this.refreshStatusBar();
                    this.buildContractPanel();
                    this.showPanel('contracts');
                });
                c.add(turnInBtn);
            } else if (isAccepted) {
                c.add(this.add.text(870, y + 36, '[ ACCEPTED ✓ ]', {
                    fontFamily: 'Arial', fontSize: 13, color: C.textAccent,
                }).setOrigin(1, 0.5));
            } else {
                const acceptBtn = this.add.text(870, y + 36, '[ ACCEPT ]', {
                    fontFamily: 'Arial Black', fontSize: 14, color: C.btnNormal,
                }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
                acceptBtn.on('pointerover', () => acceptBtn.setColor(C.btnHover));
                acceptBtn.on('pointerout', () => acceptBtn.setColor(C.btnNormal));
                acceptBtn.on('pointerdown', () => {
                    GameState.acceptContract(ct.id);
                    this.buildContractPanel();
                    this.showPanel('contracts');
                });
                c.add(acceptBtn);
            }
        });

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    // ── NPC list panel ────────────────────────────────────────────────────
    private buildNpcListPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('npcs', c);
        this.panelHeader(c, 'STATION CONTACTS', 'Meridian Station — talk to the locals');

        const npcs = meridianNPCs.filter(n => HUB_NPC_IDS.includes(n.id));
        const colW = 290;
        const startX = 160;
        const startY = 160;

        npcs.forEach((npc, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = startX + col * colW;
            const y = startY + row * 170;

            c.add(this.add.rectangle(x + 100, y + 55, 240, 120, C.panelBg).setStrokeStyle(1, C.border));

            c.add(this.add.text(x + 100, y + 20, npc.name, {
                fontFamily: 'Arial Black', fontSize: 14, color: C.textPrimary, align: 'center',
            }).setOrigin(0.5));

            const roleLine = npc.role.map(r => r.replace('-', ' ')).join(', ').toUpperCase();
            c.add(this.add.text(x + 100, y + 40, roleLine, {
                fontFamily: 'Arial', fontSize: 11, color: C.textAccent, align: 'center',
            }).setOrigin(0.5));

            // First dialogue line (always visible)
            const defaultLine = npc.dialogue.find(d => d.id === 'greeting-default') ?? npc.dialogue[0];
            const quote = `"${defaultLine?.text ?? ''}"`;
            const truncated = quote.length > 80 ? quote.slice(0, 77) + '…"' : quote;
            c.add(this.add.text(x + 100, y + 62, truncated, {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond, align: 'center',
                wordWrap: { width: 210 },
            }).setOrigin(0.5));

            const talkBtn = this.add.text(x + 100, y + 108, '[ TALK ]', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.btnNormal, align: 'center',
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            talkBtn.on('pointerover', () => talkBtn.setColor(C.btnHover));
            talkBtn.on('pointerout', () => talkBtn.setColor(C.btnNormal));
            talkBtn.on('pointerdown', () => this.showNpcDialogue(npc.id));
            c.add(talkBtn);
        });

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    private showNpcDialogue(npcId: string) {
        const npc = meridianNPCs.find(n => n.id === npcId);
        if (!npc) return;

        const existing = this.panels.get('npc-dialogue');
        if (existing) existing.destroy();

        const c = this.add.container(0, 0);
        this.panels.set('npc-dialogue', c);

        // Background panel
        c.add(this.add.rectangle(512, 420, 800, 500, C.panelBg).setStrokeStyle(1, C.border));

        c.add(this.add.text(512, 200, npc.name, {
            fontFamily: 'Arial Black', fontSize: 22, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5));

        const roleLine = npc.role.map(r => r.replace('-', ' ')).join('  ·  ').toUpperCase();
        c.add(this.add.text(512, 232, roleLine, {
            fontFamily: 'Arial', fontSize: 13, color: C.textAccent, align: 'center',
        }).setOrigin(0.5));

        // Show up to 3 dialogue lines
        const lines = npc.dialogue.slice(0, 3);
        lines.forEach((line, i) => {
            const y = 280 + i * 100;
            c.add(this.add.rectangle(512, y + 28, 720, 80, 0x0a0a1a).setStrokeStyle(1, C.border));
            c.add(this.add.text(512, y + 28, `"${line.text}"`, {
                fontFamily: 'Arial', fontSize: 14, color: C.textPrimary, align: 'center',
                fontStyle: 'italic', wordWrap: { width: 680 },
            }).setOrigin(0.5));
        });

        if (npc.services && npc.services.length > 0) {
            const servicesStr = npc.services.join('  ·  ').toUpperCase();
            c.add(this.add.text(512, 590, `SERVICES: ${servicesStr}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textWarn, align: 'center',
            }).setOrigin(0.5));
        }

        this.makeButton(c, 512, 640, '[ ← BACK TO CONTACTS ]', () => {
            this.showPanel('npcs');
        }, C.textSecond);

        this.showPanel('npc-dialogue');
    }

    // ── Services panel ────────────────────────────────────────────────────
    private buildServicesPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('services', c);
        this.populateServicesPanel(c);
    }

    private populateServicesPanel(c: Phaser.GameObjects.Container) {
        c.removeAll(true);
        const gs = GameState.get();
        this.panelHeader(c, 'SERVICES', 'Meridian Station — Ilya Sorn & Nera Quill');

        // ── Ilya Sorn — repair ──────────────────────────────────────────
        c.add(this.add.text(512, 158, 'ILYA SORN — Ship Mechanic', {
            fontFamily: 'Arial Black', fontSize: 16, color: C.textAccent, align: 'center',
        }).setOrigin(0.5));
        c.add(this.add.text(512, 180, '"That hull won\'t hold forever."', {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond, align: 'center', fontStyle: 'italic',
        }).setOrigin(0.5));

        const hullDmg = gs.shipMaxHull - gs.shipHull;
        const repairCost = hullDmg * 2;
        const repairLabel = hullDmg === 0
            ? '◆ SHIP HULL — Fully repaired'
            : `◆ REPAIR SHIP HULL — ${hullDmg} HP damaged — Cost: ${repairCost}c`;

        const repairColor = hullDmg === 0 ? C.textSuccess : C.textPrimary;
        c.add(this.add.rectangle(512, 230, 700, 44, 0x0a0a1a).setStrokeStyle(1, C.border));
        const repairLine = this.add.text(180, 218, repairLabel, {
            fontFamily: 'Arial', fontSize: 14, color: repairColor,
        });
        c.add(repairLine);

        if (hullDmg > 0) {
            const repairBtn = this.add.text(870, 230, `[ REPAIR (${repairCost}c) ]`, {
                fontFamily: 'Arial Black', fontSize: 14, color: gs.credits >= repairCost ? C.btnNormal : C.textDanger,
            }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
            repairBtn.on('pointerover', () => repairBtn.setColor(C.btnHover));
            repairBtn.on('pointerout',  () => repairBtn.setColor(gs.credits >= repairCost ? C.btnNormal : C.textDanger));
            repairBtn.on('pointerdown', () => {
                if (GameState.spendCredits(repairCost)) {
                    GameState.healShip(hullDmg);
                    this.refreshStatusBar();
                    this.refreshShipBar();
                    this.populateServicesPanel(c);
                }
            });
            c.add(repairBtn);
        }

        const fuelNeeded = gs.shipMaxFuel - gs.shipFuel;
        const fuelCost = fuelNeeded * 4;
        const fuelLabel = fuelNeeded === 0
            ? '◆ FUEL TANK — Full'
            : `◆ REFUEL SHIP — ${fuelNeeded} units needed — Cost: ${fuelCost}c`;
        const fuelColor = fuelNeeded === 0 ? C.textSuccess : C.textPrimary;

        c.add(this.add.rectangle(512, 290, 700, 44, 0x0a0a1a).setStrokeStyle(1, C.border));
        c.add(this.add.text(180, 278, fuelLabel, {
            fontFamily: 'Arial', fontSize: 14, color: fuelColor,
        }));

        if (fuelNeeded > 0) {
            const fuelBtn = this.add.text(870, 290, `[ REFUEL (${fuelCost}c) ]`, {
                fontFamily: 'Arial Black', fontSize: 14, color: gs.credits >= fuelCost ? C.btnNormal : C.textDanger,
            }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
            fuelBtn.on('pointerover', () => fuelBtn.setColor(C.btnHover));
            fuelBtn.on('pointerout',  () => fuelBtn.setColor(gs.credits >= fuelCost ? C.btnNormal : C.textDanger));
            fuelBtn.on('pointerdown', () => {
                if (GameState.spendCredits(fuelCost)) {
                    GameState.refuelShip(fuelNeeded);
                    this.refreshStatusBar();
                    this.refreshShipBar();
                    this.populateServicesPanel(c);
                }
            });
            c.add(fuelBtn);
        }

        // ── Nera Quill — shop ───────────────────────────────────────────
        c.add(this.add.text(512, 350, 'NERA QUILL — Parts Broker', {
            fontFamily: 'Arial Black', fontSize: 16, color: C.textAccent, align: 'center',
        }).setOrigin(0.5));
        c.add(this.add.text(512, 372, '"I\'ve got what you need. Probably."', {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond, align: 'center', fontStyle: 'italic',
        }).setOrigin(0.5));

        const shopItems: Array<{ id: string; name: string; cost: number }> = [
            { id: 'medical-kit', name: 'Medical Kit (heal 35 HP)', cost: 50 },
            { id: 'repair-kit',  name: 'Repair Kit (repair 30 hull)', cost: 65 },
        ];

        shopItems.forEach((item, i) => {
            const y = 410 + i * 56;
            c.add(this.add.rectangle(512, y + 14, 700, 44, 0x0a0a1a).setStrokeStyle(1, C.border));
            c.add(this.add.text(180, y + 2, `◆ ${item.name}`, {
                fontFamily: 'Arial', fontSize: 14, color: C.textPrimary,
            }));

            const buyBtn = this.add.text(870, y + 14, `[ BUY (${item.cost}c) ]`, {
                fontFamily: 'Arial Black', fontSize: 14, color: gs.credits >= item.cost ? C.btnNormal : C.textDanger,
            }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
            buyBtn.on('pointerover', () => buyBtn.setColor(C.btnHover));
            buyBtn.on('pointerout',  () => buyBtn.setColor(gs.credits >= item.cost ? C.btnNormal : C.textDanger));
            buyBtn.on('pointerdown', () => {
                if (GameState.spendCredits(item.cost)) {
                    GameState.addItem({
                        id: item.id, name: item.name.split(' (')[0],
                        qty: 1, type: 'consumable', value: Math.floor(item.cost * 0.5),
                    });
                    this.refreshStatusBar();
                    this.populateServicesPanel(c);
                }
            });
            c.add(buyBtn);
        });

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    // ── Ship status panel ─────────────────────────────────────────────────
    private buildShipStatusPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('shipstatus', c);
        const gs = GameState.get();

        this.panelHeader(c, 'SHIP STATUS', 'Current ship — upgrade path');

        c.add(this.add.rectangle(512, 280, 800, 280, C.panelBg).setStrokeStyle(1, C.border));

        // Current ship stats
        c.add(this.add.text(150, 170, 'CURRENT SHIP', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textAccent,
        }));
        const shipLines = [
            'Cutter Mk.I  ·  Class: Shuttle',
            `Hull:       ${gs.shipHull} / ${gs.shipMaxHull}`,
            'Shielding:  None',
            `Cargo:      4 units`,
            `Fuel:       ${gs.shipFuel} / ${gs.shipMaxFuel}`,
            'Jump Range: 1 sector',
            'Relay:      ✗  NOT RELAY-CAPABLE',
        ];
        shipLines.forEach((line, i) => {
            const isRelay = line.includes('Relay:');
            c.add(this.add.text(150, 194 + i * 22, line, {
                fontFamily: 'Arial', fontSize: 14, color: isRelay ? C.textDanger : C.textPrimary,
            }));
        });

        // Target ship
        c.add(this.add.text(560, 170, 'UPGRADE TARGET', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textWarn,
        }));
        const targetLines = [
            'Meridian Hauler II  ·  Class: Hauler',
            'Hull:       150 / 150',
            'Shielding:  20',
            'Cargo:      16 units',
            'Fuel:       60 / 60',
            'Jump Range: 3 sectors',
            'Relay:      ✓  RELAY-CAPABLE',
        ];
        targetLines.forEach((line, i) => {
            const isRelay = line.includes('Relay:');
            c.add(this.add.text(560, 194 + i * 22, line, {
                fontFamily: 'Arial', fontSize: 14, color: isRelay ? C.textSuccess : C.textSecond,
            }));
        });

        // Credit progress bar toward upgrade
        const UPGRADE_COST = 3800;
        const progress = Math.min(gs.credits / UPGRADE_COST, 1);
        c.add(this.add.text(150, 396, `CREDITS TOWARD UPGRADE: ${gs.credits}c / ${UPGRADE_COST}c`, {
            fontFamily: 'Arial', fontSize: 14, color: C.textWarn,
        }));
        c.add(this.add.rectangle(512, 432, 700, 18, 0x1a1a2a).setStrokeStyle(1, C.border));
        if (progress > 0) {
            c.add(this.add.rectangle(
                162 + (progress * 700) / 2, 432,
                progress * 700, 18,
                0xcc8822,
            ));
        }

        const pct = Math.floor(progress * 100);
        c.add(this.add.text(512, 432, `${pct}%`, {
            fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff', align: 'center',
        }).setOrigin(0.5));

        c.add(this.add.text(512, 466, 'Complete Belt contracts and sell salvage to earn upgrade credits.', {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    // ── Debrief panel (post-dungeon) ──────────────────────────────────────
    private buildDebriefPanel() {
        const gs = GameState.get();
        const c = this.add.container(0, 0);
        this.panels.set('debrief', c);

        const title = gs.lastRunSuccess ? 'EXTRACTION SUCCESSFUL' : 'EMERGENCY EXTRACTION';
        const titleColor = gs.lastRunSuccess ? C.textSuccess : C.textWarn;

        c.add(this.add.text(512, 90, title, {
            fontFamily: 'Arial Black', fontSize: 28, color: titleColor,
            stroke: '#000000', strokeThickness: 4, align: 'center',
        }).setOrigin(0.5));

        c.add(this.add.text(512, 132, 'Shalehook Dig Site — Run Complete', {
            fontFamily: 'Arial', fontSize: 16, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));

        c.add(this.add.rectangle(512, 370, 700, 450, C.panelBg).setStrokeStyle(1, C.border));

        // Credits and XP
        c.add(this.add.text(175, 168, `CREDITS EARNED:  +${gs.lastRunCredits}c`, {
            fontFamily: 'Arial Black', fontSize: 16, color: C.textWarn,
        }));
        c.add(this.add.text(175, 196, `XP EARNED:       +${gs.lastRunXp}`, {
            fontFamily: 'Arial', fontSize: 15, color: C.textAccent,
        }));

        // Loot
        c.add(this.add.text(175, 232, 'ITEMS RECOVERED:', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textPrimary,
        }));

        if (gs.lastRunLoot.length === 0) {
            c.add(this.add.text(175, 258, '  None.', {
                fontFamily: 'Arial', fontSize: 14, color: C.textSecond,
            }));
        } else {
            gs.lastRunLoot.forEach((item, i) => {
                c.add(this.add.text(175, 258 + i * 24, `  ◆ ${item.name}  x${item.qty}`, {
                    fontFamily: 'Arial', fontSize: 14, color: C.textPrimary,
                }));
            });
        }

        // Contracts updated
        const completedContracts = gs.contracts.filter(ct => ct.completed && !ct.turnedIn);
        if (completedContracts.length > 0) {
            const lootBottom = 258 + gs.lastRunLoot.length * 24 + 16;
            c.add(this.add.text(175, lootBottom, 'CONTRACTS READY TO TURN IN:', {
                fontFamily: 'Arial Black', fontSize: 14, color: C.textSuccess,
            }));
            completedContracts.forEach((ct, i) => {
                const contract = starterContracts.find(s => s.id === ct.id);
                c.add(this.add.text(175, lootBottom + 26 + i * 22, `  ◆ ${contract?.title ?? ct.id}`, {
                    fontFamily: 'Arial', fontSize: 13, color: C.textSuccess,
                }));
            });
        }

        c.add(this.add.text(512, 590, 'Visit the CONTRACT BOARD to turn in completed jobs.', {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));

        this.makeButton(c, 512, 640, '[ ← RETURN TO STATION ]', () => this.showPanel('main'), C.textPrimary);
    }
}

