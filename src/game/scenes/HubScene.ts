import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState } from '../state/GameState';
import { starterContracts } from '../../../content/contracts/starter-contracts';
import { phase2Contracts } from '../../../content/contracts/phase2-contracts';
import { meridianNPCs } from '../../../content/npcs/meridian-npcs';
import { SHIP_UPGRADES, HAULER_PURCHASE_COST } from '../data/shipUpgrades';

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

// All contracts shown on the Phase 2 board (Phase 1 + Phase 2)
const BOARD_CONTRACT_IDS = [
    // Phase 1
    'scrap-recovery-shalehook',
    'robot-suppression-shalehook',
    'equipment-retrieval-shalehook',
    'bounty-rogue-drone-mk3',
    'delivery-fuel-cells-ashwake',
    // Phase 2
    'missing-crew-coldframe',
    'scrap-recovery-coldframe',
    'escort-ore-convoy',
    'freight-medical-outer-hab',
    'station-trouble-stolen-kit',
    'deep-survey-relay-static',
    'bounty-automated-sentinel-pack',
];

// Phase 1 + Phase 2 NPCs shown in hub contacts
const HUB_NPC_IDS = [
    'tamsin-vale',
    'rook-mendera',
    'ilya-sorn',
    'nera-quill',
    'brother-caldus',
    'oziel-kaur',
    'veera-mox',
    'jasso',
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
        this.buildShipyardPanel();

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
            { label: '[ CONTRACT BOARD ]', sub: 'Take on work in the Belt',              target: 'contracts' },
            { label: '[ SERVICES ]',        sub: 'Repair, fuel, sell salvage',            target: 'services' },
            { label: '[ SECTOR MAP ]',      sub: 'Launch to Ashwake Belt',                target: 'sectormap' },
            { label: '[ STATION CONTACTS ]',sub: 'Talk to the locals',                    target: 'npcs' },
            { label: '[ SHIP STATUS ]',     sub: 'Current ship + relay goal',             target: 'shipstatus' },
            { label: '[ SHIPYARD ]',        sub: 'Upgrades from Ilya, Oziel & Jasso',     target: 'shipyard' },
        ];

        items.forEach((item, i) => {
            const y = 170 + i * 72;
            c.add(this.add.rectangle(512, y + 18, 420, 60, C.panelBg).setStrokeStyle(1, C.border));

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

            c.add(this.add.text(512, y + 30, item.sub, {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        });

        // Relay goal reminder
        const relayCapable = GameState.isRelayCapable();
        const goalText = relayCapable
            ? '✓  Your ship is relay-capable. Void Relay 7-9 is within reach.'
            : `▶ RELAY GOAL: Earn credits and upgrade your ship to reach Void Relay 7-9.`;
        c.add(this.add.text(512, 616, goalText, {
            fontFamily: 'Arial', fontSize: 12, color: relayCapable ? C.textSuccess : C.textWarn, align: 'center',
        }).setOrigin(0.5));

        // Station flavor
        c.add(this.add.text(512, 640, '"Thirty ships a day, once. Now eight. The Relays went out and everyone forgot we existed."', {
            fontFamily: 'Arial', fontSize: 12, color: '#555566', align: 'center', fontStyle: 'italic',
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

        const allContracts = [...starterContracts, ...phase2Contracts];
        const contracts = allContracts.filter(ct => BOARD_CONTRACT_IDS.includes(ct.id));
        const rowH = 86;
        const startY = 148;

        // Category color map
        const catColors: Record<string, string> = {
            salvage: C.textSecond,
            bounty: C.textDanger,
            delivery: C.textAccent,
            escort: C.textWarn,
            investigation: '#bb88ff',
            station: C.textSuccess,
            survey: '#88ddff',
            extraction: C.textSecond,
        };

        contracts.forEach((ct, i) => {
            const y = startY + i * rowH;
            const isAccepted = GameState.isContractAccepted(ct.id);
            const isCompleted = GameState.isContractCompleted(ct.id);

            c.add(this.add.rectangle(492, y + 34, 860, rowH - 8, C.panelBg).setStrokeStyle(1, C.border));

            // Tier badge
            const tierColor = ct.tier === 1 ? C.textSuccess : C.textWarn;
            c.add(this.add.text(78, y + 8, `T${ct.tier}`, {
                fontFamily: 'Arial Black', fontSize: 13, color: tierColor,
            }).setOrigin(0.5));

            // Category
            const catLabel = ct.category.toUpperCase();
            const catColor = catColors[ct.category] ?? C.textSecond;
            c.add(this.add.text(78, y + 28, catLabel, {
                fontFamily: 'Arial', fontSize: 10, color: catColor,
            }).setOrigin(0.5));

            // Title
            c.add(this.add.text(140, y + 6, ct.title, {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textPrimary,
            }));

            // Description (truncated)
            const desc = ct.description.length > 110 ? ct.description.slice(0, 107) + '…' : ct.description;
            c.add(this.add.text(140, y + 26, desc, {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
                wordWrap: { width: 560 },
            }));

            // Reward
            const rewardParts = [`${ct.reward.credits}c`, `${ct.reward.xp} XP`];
            if (ct.reward.itemRewards && ct.reward.itemRewards.length > 0) {
                rewardParts.push(`+item`);
            }
            c.add(this.add.text(140, y + 60, `REWARD: ${rewardParts.join('  ·  ')}`, {
                fontFamily: 'Arial', fontSize: 11, color: C.textWarn,
            }));

            // State button
            if (isCompleted) {
                const turnInBtn = this.add.text(870, y + 34, '[ TURN IN ]', {
                    fontFamily: 'Arial Black', fontSize: 13, color: C.textSuccess,
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
                c.add(this.add.text(870, y + 34, '[ ACCEPTED ✓ ]', {
                    fontFamily: 'Arial', fontSize: 12, color: C.textAccent,
                }).setOrigin(1, 0.5));
            } else {
                const acceptBtn = this.add.text(870, y + 34, '[ ACCEPT ]', {
                    fontFamily: 'Arial Black', fontSize: 13, color: C.btnNormal,
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
        c.add(this.add.text(512, 148, 'ILYA SORN — Ship Mechanic', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textAccent, align: 'center',
        }).setOrigin(0.5));
        c.add(this.add.text(512, 167, '"That hull won\'t hold forever."', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center', fontStyle: 'italic',
        }).setOrigin(0.5));

        const hullDmg = gs.shipMaxHull - gs.shipHull;
        const repairCost = hullDmg * 2;
        const repairLabel = hullDmg === 0
            ? '◆ SHIP HULL — Fully repaired'
            : `◆ REPAIR SHIP HULL — ${hullDmg} HP damaged — Cost: ${repairCost}c`;

        const repairColor = hullDmg === 0 ? C.textSuccess : C.textPrimary;
        c.add(this.add.rectangle(512, 212, 700, 40, 0x0a0a1a).setStrokeStyle(1, C.border));
        const repairLine = this.add.text(180, 202, repairLabel, {
            fontFamily: 'Arial', fontSize: 13, color: repairColor,
        });
        c.add(repairLine);

        if (hullDmg > 0) {
            const repairBtn = this.add.text(870, 212, `[ REPAIR (${repairCost}c) ]`, {
                fontFamily: 'Arial Black', fontSize: 13, color: gs.credits >= repairCost ? C.btnNormal : C.textDanger,
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

        c.add(this.add.rectangle(512, 262, 700, 40, 0x0a0a1a).setStrokeStyle(1, C.border));
        c.add(this.add.text(180, 251, fuelLabel, {
            fontFamily: 'Arial', fontSize: 13, color: fuelColor,
        }));

        if (fuelNeeded > 0) {
            const fuelBtn = this.add.text(870, 262, `[ REFUEL (${fuelCost}c) ]`, {
                fontFamily: 'Arial Black', fontSize: 13, color: gs.credits >= fuelCost ? C.btnNormal : C.textDanger,
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

        // ── Nera Quill — buy ────────────────────────────────────────────
        c.add(this.add.text(512, 304, 'NERA QUILL — Parts Broker', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textAccent, align: 'center',
        }).setOrigin(0.5));
        c.add(this.add.text(512, 320, '"I\'ve got what you need. Probably."', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center', fontStyle: 'italic',
        }).setOrigin(0.5));

        const shopItems: Array<{ id: string; name: string; cost: number }> = [
            { id: 'medical-kit', name: 'Medical Kit (heal 35 HP)', cost: 50 },
            { id: 'repair-kit',  name: 'Repair Kit (repair 30 hull)', cost: 65 },
        ];

        shopItems.forEach((item, i) => {
            const y = 348 + i * 48;
            c.add(this.add.rectangle(512, y + 12, 700, 38, 0x0a0a1a).setStrokeStyle(1, C.border));
            c.add(this.add.text(180, y + 2, `◆ ${item.name}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textPrimary,
            }));

            const buyBtn = this.add.text(870, y + 12, `[ BUY (${item.cost}c) ]`, {
                fontFamily: 'Arial Black', fontSize: 13, color: gs.credits >= item.cost ? C.btnNormal : C.textDanger,
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

        // ── Nera Quill — sell salvage ───────────────────────────────────
        c.add(this.add.text(512, 454, 'SELL SALVAGE', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textWarn, align: 'center',
        }).setOrigin(0.5));

        const sellable = gs.inventory.filter(item => item.type === 'salvage' && item.qty > 0);
        if (sellable.length === 0) {
            c.add(this.add.text(512, 478, 'No salvage in inventory.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        } else {
            sellable.forEach((item, i) => {
                const y = 472 + i * 40;
                c.add(this.add.rectangle(512, y + 10, 700, 34, 0x0a0a1a).setStrokeStyle(1, C.border));
                c.add(this.add.text(180, y + 2, `◆ ${item.name}  ×${item.qty}  (${item.value}c each)`, {
                    fontFamily: 'Arial', fontSize: 12, color: C.textPrimary,
                }));
                const sellBtn = this.add.text(870, y + 10, `[ SELL ALL (${item.value * item.qty}c) ]`, {
                    fontFamily: 'Arial Black', fontSize: 12, color: C.textSuccess,
                }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
                sellBtn.on('pointerover', () => sellBtn.setColor(C.btnHover));
                sellBtn.on('pointerout',  () => sellBtn.setColor(C.textSuccess));
                sellBtn.on('pointerdown', () => {
                    GameState.sellItem(item.id, item.qty);
                    this.refreshStatusBar();
                    this.populateServicesPanel(c);
                });
                c.add(sellBtn);
            });
        }

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    // ── Ship status panel ─────────────────────────────────────────────────
    private buildShipStatusPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('shipstatus', c);
        const gs = GameState.get();

        this.panelHeader(c, 'SHIP STATUS', 'Current ship + relay goal');

        const isRelayCapable = GameState.isRelayCapable();
        const navInstalled = GameState.isUpgradeInstalled('nav-computer');
        const driveInstalled = GameState.isUpgradeInstalled('drift-drive-upgrade');
        const shieldBonus = gs.shipStatOverrides.shieldingBonus;
        const cargoBonus = gs.shipStatOverrides.cargoBonus;
        const jumpBonus = gs.shipStatOverrides.jumpRangeBonus;

        c.add(this.add.rectangle(512, 270, 800, 240, C.panelBg).setStrokeStyle(1, C.border));

        // Current ship
        const shipName = gs.activeShipId === 'meridian-hauler-ii' ? 'Meridian Hauler II' : 'Cutter Mk.I';
        const shipClass = gs.activeShipId === 'meridian-hauler-ii' ? 'Hauler' : 'Shuttle';
        c.add(this.add.text(150, 168, 'CURRENT SHIP', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textAccent,
        }));
        const shipLines = [
            `${shipName}  ·  Class: ${shipClass}`,
            `Hull:       ${gs.shipHull} / ${gs.shipMaxHull}`,
            `Shielding:  ${shieldBonus > 0 ? shieldBonus : 'None'}`,
            `Cargo:      ${4 + cargoBonus} units`,
            `Fuel:       ${gs.shipFuel} / ${gs.shipMaxFuel}`,
            `Jump Range: ${1 + jumpBonus} sector${1 + jumpBonus !== 1 ? 's' : ''}`,
            isRelayCapable ? 'Relay:      ✓  RELAY-CAPABLE' : 'Relay:      ✗  NOT RELAY-CAPABLE',
        ];
        shipLines.forEach((line, i) => {
            const isRelay = line.startsWith('Relay:');
            c.add(this.add.text(150, 192 + i * 22, line, {
                fontFamily: 'Arial', fontSize: 13, color: isRelay
                    ? (isRelayCapable ? C.textSuccess : C.textDanger)
                    : C.textPrimary,
            }));
        });

        // Installed upgrades
        if (gs.installedUpgrades.length > 0) {
            c.add(this.add.text(150, 354, `Installed: ${gs.installedUpgrades.join(', ')}`, {
                fontFamily: 'Arial', fontSize: 11, color: C.textAccent,
            }));
        }

        // ── Relay Goal section ─────────────────────────────────────────
        c.add(this.add.text(512, 394, 'RELAY GOAL — VOID RELAY 7-9', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textWarn, align: 'center',
        }).setOrigin(0.5));

        if (isRelayCapable) {
            c.add(this.add.text(512, 422, '✓  Your ship is relay-capable. Void Relay 7-9 is within reach.', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textSuccess, align: 'center',
            }).setOrigin(0.5));
            c.add(this.add.text(512, 446, 'Speak to Brother Caldus before you go through.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        } else {
            // Path A: buy Hauler
            const creditsToHauler = Math.max(0, HAULER_PURCHASE_COST - gs.credits);
            const pathAProgress = Math.min(gs.credits / HAULER_PURCHASE_COST, 1);
            c.add(this.add.text(150, 418, `PATH A: Buy Meridian Hauler II from Oziel Kaur — ${HAULER_PURCHASE_COST}c`, {
                fontFamily: 'Arial Black', fontSize: 12, color: C.textWarn,
            }));
            c.add(this.add.rectangle(512, 446, 700, 14, 0x1a1a2a).setStrokeStyle(1, C.border));
            if (pathAProgress > 0) {
                c.add(this.add.rectangle(162 + (pathAProgress * 700) / 2, 446, pathAProgress * 700, 14, 0xcc8822));
            }
            c.add(this.add.text(512, 446, creditsToHauler === 0 ? 'READY' : `${gs.credits}c / ${HAULER_PURCHASE_COST}c`, {
                fontFamily: 'Arial Black', fontSize: 10, color: '#ffffff', align: 'center',
            }).setOrigin(0.5));

            // Path B: upgrade Cutter
            const navText = navInstalled ? '✓ Nav Computer' : '✗ Nav Computer (1,200c)';
            const driveText = driveInstalled ? '✓ Drift Drive' : '✗ Drift Drive (1,800c)';
            c.add(this.add.text(150, 470, `PATH B: Upgrade Cutter at Oziel\'s Shipyard`, {
                fontFamily: 'Arial Black', fontSize: 12, color: C.textAccent,
            }));
            c.add(this.add.text(150, 488, `  ${navText}   ${driveText}   → both required`, {
                fontFamily: 'Arial', fontSize: 12, color: navInstalled && driveInstalled ? C.textSuccess : C.textSecond,
            }));

            c.add(this.add.text(512, 520, 'Complete Belt contracts and sell salvage to earn credits.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        }

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    // ── Shipyard panel ────────────────────────────────────────────────────
    private buildShipyardPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('shipyard', c);
        this.populateShipyardPanel(c);
    }

    private populateShipyardPanel(c: Phaser.GameObjects.Container) {
        c.removeAll(true);
        const gs = GameState.get();
        this.panelHeader(c, 'SHIPYARD', 'Upgrades — Ilya Sorn · Oziel Kaur · Jasso');

        const upgrades = Object.values(SHIP_UPGRADES);
        const rowH = 74;
        const startY = 148;

        // Seller name map
        const sellerNames: Record<string, string> = {
            'ilya-sorn':  'Ilya Sorn',
            'oziel-kaur': 'Oziel Kaur',
            'jasso':       'Jasso',
        };

        upgrades.forEach((upg, i) => {
            const y = startY + i * rowH;
            const installed = GameState.isUpgradeInstalled(upg.id);
            const canAfford = gs.credits >= upg.cost;
            const rowColor = installed ? 0x0a1a0a : 0x0a0a1a;
            c.add(this.add.rectangle(492, y + 28, 860, rowH - 8, rowColor).setStrokeStyle(1, C.border));

            // Relay tag
            if (upg.relayContribution) {
                c.add(this.add.text(80, y + 10, '⭐', {
                    fontFamily: 'Arial', fontSize: 13, color: C.textWarn,
                }).setOrigin(0.5));
            }
            c.add(this.add.text(80, y + 28, sellerNames[upg.seller] ?? upg.seller, {
                fontFamily: 'Arial', fontSize: 10, color: C.textSecond,
            }).setOrigin(0.5));

            c.add(this.add.text(140, y + 6, upg.name, {
                fontFamily: 'Arial Black', fontSize: 13, color: installed ? C.textSuccess : C.textPrimary,
            }));
            const desc = upg.description.length > 120 ? upg.description.slice(0, 117) + '…' : upg.description;
            c.add(this.add.text(140, y + 26, desc, {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
                wordWrap: { width: 580 },
            }));
            c.add(this.add.text(140, y + 54, `Cost: ${upg.cost}c`, {
                fontFamily: 'Arial', fontSize: 11, color: installed ? C.textSuccess : (canAfford ? C.textWarn : C.textDanger),
            }));

            if (installed) {
                c.add(this.add.text(870, y + 28, '[ INSTALLED ✓ ]', {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSuccess,
                }).setOrigin(1, 0.5));
            } else {
                const buyBtn = this.add.text(870, y + 28, `[ INSTALL (${upg.cost}c) ]`, {
                    fontFamily: 'Arial Black', fontSize: 12,
                    color: canAfford ? C.btnNormal : C.textDanger,
                }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
                buyBtn.on('pointerover', () => buyBtn.setColor(C.btnHover));
                buyBtn.on('pointerout',  () => buyBtn.setColor(canAfford ? C.btnNormal : C.textDanger));
                buyBtn.on('pointerdown', () => {
                    if (GameState.spendCredits(upg.cost)) {
                        GameState.installUpgrade(upg.id, upg.statBonus);
                        if (upg.id === 'drift-drive-upgrade' && GameState.isCutterRelayCapable()) {
                            GameState.setFlag('cutter-relay-capable', true);
                        }
                        this.refreshStatusBar();
                        this.refreshShipBar();
                        this.showInstallNote(upg.installNote, () => {
                            this.populateShipyardPanel(c);
                        });
                    }
                });
                c.add(buyBtn);
            }
        });

        c.add(this.add.text(512, 630, '⭐ = required for relay-capable upgrade path', {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    private showInstallNote(note: string, onClose: () => void) {
        const existing = this.panels.get('install-note');
        if (existing) existing.destroy();

        const c = this.add.container(0, 0);
        this.panels.set('install-note', c);

        c.add(this.add.rectangle(512, 384, 780, 200, C.panelBg).setStrokeStyle(2, C.border));
        c.add(this.add.text(512, 310, 'UPGRADE INSTALLED', {
            fontFamily: 'Arial Black', fontSize: 18, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5));
        c.add(this.add.text(512, 376, `"${note}"`, {
            fontFamily: 'Arial', fontSize: 13, color: C.textPrimary, align: 'center',
            fontStyle: 'italic', wordWrap: { width: 700 },
        }).setOrigin(0.5));

        const closeBtn = this.add.text(512, 440, '[ OK ]', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.btnNormal, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => {
            c.destroy();
            this.panels.delete('install-note');
            onClose();
        });
        c.add(closeBtn);
        this.showPanel('install-note');
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

        // Use lastDungeonId to show dungeon name
        const dungeonNames: Record<string, string> = {
            'shalehook-dig-site':  'Shalehook Dig Site',
            'coldframe-station-b': 'Coldframe Station-B',
        };
        const siteName = dungeonNames[gs.lastDungeonId ?? ''] ?? 'Ashwake Belt';
        c.add(this.add.text(512, 132, `${siteName} — Run Complete`, {
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

        // Contracts updated — look in both phase 1 and phase 2
        const allContracts = [...starterContracts, ...phase2Contracts];
        const completedContracts = gs.contracts.filter(ct => ct.completed && !ct.turnedIn);
        if (completedContracts.length > 0) {
            const lootBottom = 258 + gs.lastRunLoot.length * 24 + 16;
            c.add(this.add.text(175, lootBottom, 'CONTRACTS READY TO TURN IN:', {
                fontFamily: 'Arial Black', fontSize: 14, color: C.textSuccess,
            }));
            completedContracts.forEach((ct, i) => {
                const contract = allContracts.find(s => s.id === ct.id);
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

