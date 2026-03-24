import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState } from '../state/GameState';
import { starterContracts } from '../../../content/contracts/starter-contracts';
import { phase2Contracts } from '../../../content/contracts/phase2-contracts';
import { phase3Contracts } from '../../../content/contracts/phase3-contracts';
import { phase4Contracts } from '../../../content/contracts/phase4-contracts';
import { phase5Contracts } from '../../../content/contracts/phase5-contracts';
import { phase6Contracts } from '../../../content/contracts/phase6-contracts';
import { meridianNPCs } from '../../../content/npcs/meridian-npcs';
import { phase4NPCs } from '../../../content/npcs/phase4-npcs';
import { phase5NPCs } from '../../../content/npcs/phase5-npcs';
import { phase6NPCs } from '../../../content/npcs/phase6-npcs';
import { phase6Lore } from '../../../content/lore/phase6-lore';
import { factions } from '../../../content/factions/factions';
import { SHIP_UPGRADES, HAULER_PURCHASE_COST } from '../data/shipUpgrades';
import { ITEMS } from '../data/items';
import { T } from '../ui/UITheme';
import { DebugPanel } from '../ui/DebugPanel';

// Scene colour aliases — sourced from shared UITheme.
const C = T;

// All contracts shown on the Phase 5 board (Phase 1 + Phase 2 + Phase 3 + Phase 4 + Phase 5)
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
    // Phase 3 — pre-relay (requires relay-capable ship but always visible)
    'relay-approach-survey',
    'ica-relay-assessment',
    'covenant-relay-data',
    // Phase 3 — post-relay (only shown after relay-jump-completed flag)
    'farpoint-first-contact',
    'farpoint-salvage-extraction',
    'anomaly-trace-farpoint',
    'relay-ghost-telemetry',
    // Phase 4 — post-relay frontier (only shown after relay-jump-completed flag)
    'frontier-supply-run-kalindra',
    'frontier-route-survey-kalindra',
    'frontier-salvage-certification',
    'sol-union-compliance-check',
    'sol-union-sector-enforcement',
    'aegis-sealed-site-recovery',
    'aegis-missing-team-kalindra',
    'aegis-anomaly-trace-orin',
    'vanta-off-book-salvage',
    'redline-kalindra-core',
    // Phase 5 — post-relay Redline and high-risk contracts
    'vanta-vault-intel-run',
    'helion-contaminated-survey',
    'redline-vault-broken-signal',
    'frontier-ghost-box-extraction',
    'redline-ashveil-data-extraction',
    'redline-helion-anomaly-sample',
    'aegis-black-site-breach',
    // Phase 6 — Farpoint Hub and Ghost Site contracts
    'farpoint-outer-ring-survey',
    'kael-ping-investigation',
    'void-covenant-signal-trace',
    'ica-relay-lockdown',
    'farpoint-ghost-route-patrol',
    'aegis-farpoint-audit',
    'kael-zero-second-expedition',
    'ghost-site-ica-recovery',
    'ghost-site-covenant-witness',
    'farpoint-archive-lore-pull',
];

// Contract IDs that require relay jump to be visible on the board
const POST_RELAY_CONTRACT_IDS = new Set([
    'farpoint-first-contact',
    'farpoint-salvage-extraction',
    'anomaly-trace-farpoint',
    'relay-ghost-telemetry',
    // Phase 4
    'frontier-supply-run-kalindra',
    'frontier-route-survey-kalindra',
    'frontier-salvage-certification',
    'sol-union-compliance-check',
    'sol-union-sector-enforcement',
    'aegis-sealed-site-recovery',
    'aegis-missing-team-kalindra',
    'aegis-anomaly-trace-orin',
    'vanta-off-book-salvage',
    'redline-kalindra-core',
    // Phase 5
    'vanta-vault-intel-run',
    'helion-contaminated-survey',
    'redline-vault-broken-signal',
    'frontier-ghost-box-extraction',
    'redline-ashveil-data-extraction',
    'redline-helion-anomaly-sample',
    'aegis-black-site-breach',
    // Phase 6
    'farpoint-outer-ring-survey',
    'kael-ping-investigation',
    'void-covenant-signal-trace',
    'ica-relay-lockdown',
    'farpoint-ghost-route-patrol',
    'aegis-farpoint-audit',
    'kael-zero-second-expedition',
    'ghost-site-ica-recovery',
    'ghost-site-covenant-witness',
    'farpoint-archive-lore-pull',
]);

// NPCs shown in the main Station Contacts panel (Meridian hub)
const HUB_NPC_IDS = [
    'tamsin-vale',
    'rook-mendera',
    'ilya-sorn',
    'nera-quill',
    'brother-caldus',
    'oziel-kaur',
    'veera-mox',
    'jasso',
    // Phase 3
    'ica-agent-vorren',
    'void-covenant-kestrel',
    'farpoint-kael',
];

// NPCs shown in the Station Contacts panel when at Farpoint hub
const FARPOINT_HUB_NPC_IDS = [
    'farpoint-kael-expanded',
    'tovan-vex',
    'aryn-voss',
    // Phase 3/4 faction contacts accessible at Farpoint
    'ica-agent-vorren',
    'void-covenant-kestrel',
    'crow-veslin',
    'operative-sable',
    'frontier-agent-leva',
];

// Phase 4+5 faction contact NPC IDs shown in the Faction Standings panel
const FACTION_NPC_IDS = [
    'frontier-agent-leva',
    'commander-dresh',
    'operative-sable',
    'crow-veslin',
    // Phase 5
    'aris-vel',
    'the-broker',
];

// ── HubScene ────────────────────────────────────────────────────────────────
// Layout / animation constants used across multiple methods.
const SCENE_TRANSITION_FADE_MS  = 300;
const DIALOGUE_LINE_HEIGHT       = 80;   // px per NPC dialogue row
const DIALOGUE_VIEWPORT_TOP      = 260;  // y where the masked dialogue area begins
const DIALOGUE_VIEWPORT_HEIGHT   = 316;  // visible height of the dialogue clip region
const DIALOGUE_SCROLL_SPEED      = 0.3;  // wheel-delta multiplier for NPC dialogue scroll
const CODEX_SCROLL_SPEED         = 0.3;  // wheel-delta multiplier for codex scroll

// Ghost-site contract IDs — only visible when kael-questline-stage-2 flag is set
const GHOST_SITE_CONTRACT_IDS = new Set(['ghost-site-ica-recovery', 'ghost-site-covenant-witness']);

// Lore entries unlocked when specific contracts are turned in
const CONTRACT_LORE_UNLOCKS: Record<string, string[]> = {
    'kael-ping-investigation':      ['kael-personal-record'],
    'kael-zero-second-expedition':  ['transit-node-zero-approach', 'transit-zero-interior-partial'],
    'ghost-site-ica-recovery':      ['ica-relay-archive-fragment', 'null-architect-encounter-report'],
    'ghost-site-covenant-witness':  ['covenant-field-report-tovan', 'null-architect-encounter-report'],
    'farpoint-archive-lore-pull':   ['farpoint-ops-log-month-14'],
    'aegis-farpoint-audit':         ['vorren-zero-second-analysis'],
    'void-covenant-signal-trace':   ['covenant-field-report-tovan'],
    'ica-relay-lockdown':           ['ica-relay-archive-fragment'],
};

export class HubScene extends Scene {
    private panels: Map<string, Phaser.GameObjects.Container> = new Map();
    private statusBarTexts: { credits: Phaser.GameObjects.Text; xp: Phaser.GameObjects.Text; level: Phaser.GameObjects.Text; pilotHp: Phaser.GameObjects.Text } | null = null;
    private shipHullBar: Phaser.GameObjects.Rectangle | null = null;
    private shipFuelBar: Phaser.GameObjects.Rectangle | null = null;
    private shipHullText: Phaser.GameObjects.Text | null = null;
    private shipFuelText: Phaser.GameObjects.Text | null = null;
    // Wheel-scroll handler wired during NPC dialogue — removed when leaving that panel.
    private _npcScrollHandler: ((...args: unknown[]) => void) | null = null;
    // Wheel-scroll handler wired during contract board — removed when leaving that panel.
    private _contractScrollHandler: ((...args: unknown[]) => void) | null = null;
    // Wheel-scroll handler wired during codex panel — removed when leaving that panel.
    private _codexScrollHandler: ((...args: unknown[]) => void) | null = null;

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
        this.buildFactionsPanel();
        this.buildCodexPanel();

        if (gs.returnFromDungeon) {
            this.buildDebriefPanel();
            this.showPanel('debrief');
            GameState.clearReturnFromDungeon();
        } else {
            this.showPanel('main');
        }

        new DebugPanel(this);

        EventBus.emit('current-scene-ready', this);
    }

    // ── Status bar (top) ──────────────────────────────────────────────────
    private buildStatusBar() {
        const gs = GameState.get();
        this.add.rectangle(512, 20, 1024, 40, C.panelBg);
        this.add.rectangle(512, 40, 1024, 1, C.border);

        const hubLabel = gs.currentHubId === 'farpoint' ? 'FARPOINT WAYSTATION' : 'MERIDIAN STATION';
        this.add.text(16, 12, hubLabel, {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textAccent,
        });

        const pilotHpColor = gs.pilotHull < gs.pilotMaxHull * 0.4 ? C.textDanger : C.textSecond;
        this.statusBarTexts = {
            credits: this.add.text(300, 12, `CREDITS: ${gs.credits}c`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textWarn,
            }),
            xp: this.add.text(480, 12, `XP: ${gs.xp}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textSecond,
            }),
            level: this.add.text(570, 12, `LVL: ${gs.level}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textPrimary,
            }),
            pilotHp: this.add.text(650, 12, `PILOT: ${gs.pilotHull}/${gs.pilotMaxHull}`, {
                fontFamily: 'Arial', fontSize: 13, color: pilotHpColor,
            }),
        };

        // Show last-run credits if we just returned
        if (gs.returnFromDungeon && gs.lastRunCredits > 0) {
            this.add.text(820, 12, `+${gs.lastRunCredits}c`, {
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
        const pilotHpColor = gs.pilotHull < gs.pilotMaxHull * 0.4 ? C.textDanger : C.textSecond;
        this.statusBarTexts.pilotHp.setText(`PILOT: ${gs.pilotHull}/${gs.pilotMaxHull}`).setColor(pilotHpColor);
    }

    // ── Ship bar (bottom) ─────────────────────────────────────────────────
    private buildShipBar() {
        const gs = GameState.get();
        const y = 748;
        this.add.rectangle(512, y, 1024, 1, C.border);
        this.add.rectangle(512, y + 10, 1024, 20, C.panelBg);

        const shipDisplayName = gs.activeShipId === 'meridian-hauler-ii' ? 'Meridian Hauler II' : 'Cutter Mk.I';
        this.add.text(16, y + 3, `SHIP: ${shipDisplayName}`, {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });

        // Hull bar
        this.add.text(190, y + 3, 'HULL', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });
        const hullPct = gs.shipHull / gs.shipMaxHull;
        this.shipHullBar = this.drawBar(null, 240, y + 10, 100, 10, hullPct,
            hullPct > 0.5 ? C.barFull : C.barDamaged, 0x223322);
        this.shipHullText = this.add.text(295, y + 3, `${gs.shipHull}/${gs.shipMaxHull}`, {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
        });

        // Fuel bar
        this.add.text(380, y + 3, 'FUEL', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        });
        const fuelPct = gs.shipFuel / gs.shipMaxFuel;
        this.shipFuelBar = this.drawBar(null, 415, y + 10, 80, 10, fuelPct, C.barFuel, 0x112233);
        this.shipFuelText = this.add.text(500, y + 3, `${gs.shipFuel}/${gs.shipMaxFuel}`, {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
        });

        // Relay progress hint or post-relay status
        const relayJumped = GameState.getFlag('relay-jump-completed');
        if (relayJumped) {
            this.add.text(590, y + 3, '✓ RELAY TRANSITED  ▶ Farpoint Waystation is open — explore the frontier', {
                fontFamily: 'Arial', fontSize: 11, color: C.textWarn,
            });
        } else {
            this.add.text(590, y + 3, '▶ GOAL: Meridian Hauler II (relay-capable) — 3,800c needed', {
                fontFamily: 'Arial', fontSize: 11, color: C.textWarn,
            });
        }
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
        // Tear down the NPC dialogue scroll handler whenever we leave that panel.
        if (name !== 'npc-dialogue' && this._npcScrollHandler) {
            this.input.off('wheel', this._npcScrollHandler);
            this._npcScrollHandler = null;
        }
        // Tear down the contract board scroll handler whenever we leave that panel.
        if (name !== 'contracts' && this._contractScrollHandler) {
            this.input.off('wheel', this._contractScrollHandler);
            this._contractScrollHandler = null;
        }
        // Tear down the codex scroll handler whenever we leave that panel.
        if (name !== 'codex' && this._codexScrollHandler) {
            this.input.off('wheel', this._codexScrollHandler);
            this._codexScrollHandler = null;
        }
        // Re-populate the main panel so contract badges reflect the latest state.
        if (name === 'main') {
            const c = this.panels.get('main');
            if (c) this.populateMainPanel(c);
        }
    }

    /** Brief feedback message that fades out after 2 s. */
    private showToast(text: string, color: string = C.textSuccess) {
        const toast = this.add.text(512, 740, text, {
            fontFamily: 'Arial', fontSize: 13, color, align: 'center',
        }).setOrigin(0.5).setDepth(1000).setAlpha(1);
        this.tweens.add({
            targets: toast,
            alpha: 0,
            duration: 1800,
            delay: 800,
            onComplete: () => toast.destroy(),
        });
    }

    private makeButton(
        container: Phaser.GameObjects.Container,
        x: number,
        y: number,
        label: string,
        callback: () => void,
        color: string = C.btnNormal,
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

    /**
     * Draws a background track plus a filled progress bar and adds both to
     * `container` (pass `null` to add directly to the scene).
     * Returns the fill rectangle so the caller can update it later.
     */
    private drawBar(
        container: Phaser.GameObjects.Container | null,
        x: number, y: number,
        width: number, height: number,
        pct: number, fillColor: number,
        bgColor = 0x1a1a2a,
        withBgStroke = false,
    ): Phaser.GameObjects.Rectangle {
        const clampedPct = Math.max(0, Math.min(1, pct));
        const bg = this.add.rectangle(x, y, width, height, bgColor);
        if (withBgStroke) bg.setStrokeStyle(1, C.border);
        if (container) container.add(bg);
        const fillW = clampedPct > 0 ? clampedPct * width : 0;
        const fill = this.add.rectangle(
            fillW > 0 ? x - width / 2 + fillW / 2 : x,
            y, Math.max(fillW, 0), height, fillColor,
        );
        if (container) container.add(fill);
        return fill;
    }

    // ── Main panel ────────────────────────────────────────────────────────
    private buildMainPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('main', c);
        this.populateMainPanel(c);
    }

    private populateMainPanel(c: Phaser.GameObjects.Container) {
        c.removeAll(true);

        const gs = GameState.get();
        const isFarpoint = gs.currentHubId === 'farpoint';

        if (isFarpoint) {
            this.panelHeader(c, 'FARPOINT WAYSTATION', "Frontier outpost. Kael's territory.");
        } else {
            this.panelHeader(c, 'MERIDIAN STATION', 'Low-rent. Busy. Yours for now.');
        }

        const activeCount    = gs.contracts.filter(ct => ct.accepted && !ct.turnedIn).length;
        const readyCount     = gs.contracts.filter(ct => ct.completed && !ct.turnedIn).length;

        const contractBadge =
            readyCount > 0 ? ` (${readyCount} READY TO TURN IN)` :
            activeCount > 0 ? ` (${activeCount} active)` : '';
        const contractBadgeColor = readyCount > 0 ? C.textSuccess : C.textSecond;

        const unlockedLoreCount = gs.unlockedLoreIds.length;
        const codexBadge = unlockedLoreCount > 0 ? ` (${unlockedLoreCount} entries)` : '';

        const items = [
            { label: '[ CONTRACT BOARD ]',    badge: contractBadge, badgeColor: contractBadgeColor, sub: 'Take on work in the Belt', target: 'contracts' },
            { label: '[ SERVICES ]',          badge: '',            badgeColor: C.textSecond,       sub: 'Repair, fuel, sell salvage',         target: 'services' },
            { label: '[ SECTOR MAP ]',        badge: '',            badgeColor: C.textSecond,       sub: 'Launch to Ashwake Belt',             target: 'sectormap' },
            { label: '[ STATION CONTACTS ]',  badge: '',            badgeColor: C.textSecond,       sub: 'Talk to the locals',                 target: 'npcs' },
            { label: '[ FACTION STANDINGS ]', badge: '',            badgeColor: C.textSecond,       sub: 'Reputation + faction contacts',      target: 'factions' },
            { label: '[ SHIP STATUS ]',       badge: '',            badgeColor: C.textSecond,       sub: 'Current ship + relay goal',          target: 'shipstatus' },
            { label: '[ SHIPYARD ]',          badge: '',            badgeColor: C.textSecond,       sub: 'Upgrades from Ilya, Oziel & Jasso',  target: 'shipyard' },
            { label: '[ CODEX ]',             badge: codexBadge,    badgeColor: C.textAccent,       sub: 'Unlocked lore entries',              target: 'codex' },
        ];

        items.forEach((item, i) => {
            const y = 170 + i * 72;
            c.add(this.add.rectangle(512, y + 18, 420, 60, C.panelBg).setStrokeStyle(1, C.border));

            const btn = this.add.text(370, y + 6, item.label, {
                fontFamily: 'Arial Black', fontSize: 19, color: C.textPrimary, align: 'left',
            }).setOrigin(0, 0).setInteractive({ useHandCursor: true });
            btn.on('pointerover', () => btn.setColor(C.btnHover));
            btn.on('pointerout', () => btn.setColor(C.textPrimary));
            btn.on('pointerdown', () => {
                if (item.target === 'sectormap') {
                    this.cameras.main.fadeOut(SCENE_TRANSITION_FADE_MS, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('SectorMap'));
                } else {
                    this.showPanel(item.target);
                }
            });
            c.add(btn);

            if (item.badge) {
                c.add(this.add.text(512, y + 30, item.badge, {
                    fontFamily: 'Arial', fontSize: 11, color: item.badgeColor, align: 'center',
                }).setOrigin(0.5));
            } else {
                c.add(this.add.text(512, y + 30, item.sub, {
                    fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
                }).setOrigin(0.5));
            }
        });

        // Relay goal / milestone banner
        const relayCapable = GameState.isRelayCapable();
        const relayJumped = GameState.getFlag('relay-jump-completed');
        let goalText: string;
        let goalColor: string;
        if (isFarpoint) {
            goalText = '✓  FARPOINT WAYSTATION — Kael\'s questline is active. Check the contract board and talk to the locals.';
            goalColor = C.textWarn;
        } else if (relayJumped) {
            goalText = '✓  RELAY TRANSITED — Farpoint Waystation is open. New contacts and contracts are available.';
            goalColor = C.textWarn;
        } else if (relayCapable) {
            goalText = '✓  Your ship is relay-capable. Void Relay 7-9 is within reach. Speak to Brother Caldus and Kestrel Vin.';
            goalColor = C.textSuccess;
        } else {
            goalText = `▶ RELAY GOAL: Earn credits and upgrade your ship to reach Void Relay 7-9.`;
            goalColor = C.textWarn;
        }
        c.add(this.add.text(512, 706, goalText, {
            fontFamily: 'Arial', fontSize: 12, color: goalColor, align: 'center',
        }).setOrigin(0.5));

        if (!isFarpoint) {
            c.add(this.add.text(512, 726, '"Thirty ships a day, once. Now eight. The Relays went out and everyone forgot we existed."', {
                fontFamily: 'Arial', fontSize: 12, color: '#555566', align: 'center', fontStyle: 'italic',
            }).setOrigin(0.5));
        }
    }

    // ── Contract board ────────────────────────────────────────────────────
    private buildContractPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('contracts', c);
        this.populateContractPanel(c);
    }

    private populateContractPanel(c: Phaser.GameObjects.Container) {
        c.removeAll(true);
        const gs = GameState.get();
        const isFarpoint = gs.currentHubId === 'farpoint';
        const boardSubtitle = isFarpoint
            ? 'Farpoint Waystation — Kael Mourne, Coordinator'
            : 'Meridian Station — Tamsin Vale, Dispatcher';
        this.panelHeader(c, 'CONTRACT BOARD', boardSubtitle);

        const allContracts = [...starterContracts, ...phase2Contracts, ...phase3Contracts, ...phase4Contracts, ...phase5Contracts, ...phase6Contracts];
        const relayJumped = GameState.getFlag('relay-jump-completed');
        const kaelStage2 = GameState.getFlag('kael-questline-stage-2');

        const contracts = allContracts.filter(ct =>
            BOARD_CONTRACT_IDS.includes(ct.id) &&
            (!POST_RELAY_CONTRACT_IDS.has(ct.id) || relayJumped) &&
            (!GHOST_SITE_CONTRACT_IDS.has(ct.id) || kaelStage2),
        );
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
            extraction: '#ff6644',
        };

        // Faction short-name map for contract labels
        const factionShortNames: Record<string, string> = {
            'meridian-dock-authority': 'MDA',
            'ashwake-extraction-guild': 'Guild',
            'void-covenant': 'Covenant',
            'free-transit-compact': 'Transit',
            'interstellar-commonwealth-authority': 'ICA',
            'frontier-compact': 'Compact',
            'sol-union-directorate': 'Sol Union',
            'aegis-division': 'Aegis',
            'vanta-corsairs': 'Vanta',
            'helion-synod': 'Synod',
        };

        // ── Scrollable contract list ──────────────────────────────────────
        const CONTRACT_VIEWPORT_TOP    = startY;
        const CONTRACT_VIEWPORT_HEIGHT = 552; // 700 (back btn) - 148 (startY)
        const totalContractH = contracts.length * rowH;
        const maxContractScroll = Math.max(0, totalContractH - CONTRACT_VIEWPORT_HEIGHT);
        let contractScrollY = 0;

        // Tear down any previous contract scroll handler before rebuilding.
        if (this._contractScrollHandler) {
            this.input.off('wheel', this._contractScrollHandler);
            this._contractScrollHandler = null;
        }

        const contractMaskGfx = this.make.graphics({ x: 0, y: 0 });
        contractMaskGfx.fillRect(0, CONTRACT_VIEWPORT_TOP, 1024, CONTRACT_VIEWPORT_HEIGHT);
        const contractMask = contractMaskGfx.createGeometryMask();

        const scrollCt = this.add.container(0, 0);
        scrollCt.setMask(contractMask);
        c.add(scrollCt);

        contracts.forEach((ct, i) => {
            const y = startY + i * rowH;
            const isAccepted = GameState.isContractAccepted(ct.id);
            const isCompleted = GameState.isContractCompleted(ct.id);

            // Check reputation requirement
            const repReq = ct.reputationRequirement;
            const repLocked = repReq
                ? !GameState.meetsReputationRequirement(repReq.factionId, repReq.minRep)
                : false;
            const isRedline = !!ct.isRedline;

            const rowBg = isRedline ? 0x1a0505 : C.panelBg;
            const rowBorder = isRedline ? 0x882222 : C.border;
            scrollCt.add(this.add.rectangle(492, y + 34, 860, rowH - 8, rowBg).setStrokeStyle(1, rowBorder));

            // Tier badge
            const tierColor = ct.tier <= 2 ? C.textSuccess : ct.tier === 3 ? C.textWarn : C.textDanger;
            scrollCt.add(this.add.text(78, y + 8, `T${ct.tier}`, {
                fontFamily: 'Arial Black', fontSize: 13, color: tierColor,
            }).setOrigin(0.5));

            // Category + REDLINE badge
            const catLabel = ct.category.toUpperCase();
            const catColor = catColors[ct.category] ?? C.textSecond;
            if (isRedline) {
                scrollCt.add(this.add.text(78, y + 28, '⚠ REDLINE', {
                    fontFamily: 'Arial Black', fontSize: 10, color: '#ff3333',
                }).setOrigin(0.5));
            } else {
                scrollCt.add(this.add.text(78, y + 28, catLabel, {
                    fontFamily: 'Arial', fontSize: 10, color: catColor,
                }).setOrigin(0.5));
            }

            // Faction tag
            if (ct.factionId) {
                const fShort = factionShortNames[ct.factionId] ?? ct.factionId;
                scrollCt.add(this.add.text(78, y + 46, `[${fShort}]`, {
                    fontFamily: 'Arial', fontSize: 9, color: '#6688aa',
                }).setOrigin(0.5));
            }

            // Title (dimmed if rep-locked)
            const titleColor = repLocked ? '#555566' : (isRedline ? '#ff8866' : C.textPrimary);
            scrollCt.add(this.add.text(140, y + 6, ct.title, {
                fontFamily: 'Arial Black', fontSize: 13, color: titleColor,
            }));

            // Description (truncated) or rep-lock notice
            if (repLocked && repReq) {
                const fShort = factionShortNames[repReq.factionId] ?? repReq.factionId;
                const playerRep = GameState.getReputation(repReq.factionId);
                scrollCt.add(this.add.text(140, y + 26, `REQUIRES ${fShort} reputation ${repReq.minRep} (current: ${playerRep})`, {
                    fontFamily: 'Arial', fontSize: 11, color: '#665544',
                    wordWrap: { width: 560 },
                }));
            } else {
                const desc = ct.description.length > 110 ? ct.description.slice(0, 107) + '…' : ct.description;
                scrollCt.add(this.add.text(140, y + 26, desc, {
                    fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
                    wordWrap: { width: 560 },
                }));
            }

            // Reward
            const rewardParts = [`${ct.reward.credits}c`, `${ct.reward.xp} XP`];
            if (ct.reward.itemRewards && ct.reward.itemRewards.length > 0) {
                rewardParts.push(`+item`);
            }
            const rewardColor = isRedline ? '#ffaa44' : C.textWarn;
            scrollCt.add(this.add.text(140, y + 60, `REWARD: ${rewardParts.join('  ·  ')}`, {
                fontFamily: 'Arial', fontSize: 11, color: rewardColor,
            }));

            // State button
            if (repLocked) {
                scrollCt.add(this.add.text(870, y + 34, '[ REP REQUIRED ]', {
                    fontFamily: 'Arial', fontSize: 11, color: '#665544',
                }).setOrigin(1, 0.5));
            } else if (isCompleted) {
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
                    // Grant any item rewards
                    if (ct.reward.itemRewards && ct.reward.itemRewards.length > 0) {
                        for (const itemId of ct.reward.itemRewards) {
                            const def = ITEMS[itemId];
                            if (def) {
                                GameState.addItem({ id: def.id, name: def.name, qty: 1, type: def.type, value: def.value });
                            }
                        }
                    }
                    // ── Phase 6: questline flag triggers ─────────────────
                    if (ct.id === 'kael-ping-investigation') {
                        GameState.setFlag('kael-questline-stage-1', true);
                    }
                    if (ct.id === 'kael-zero-second-expedition') {
                        GameState.setFlag('kael-questline-stage-2', true);
                    }
                    if (ct.id === 'farpoint-archive-lore-pull') {
                        GameState.setFlag('farpoint-archive-pulled', true);
                    }
                    // ── Phase 6: lore unlocks ─────────────────────────────
                    const loreUnlocks = CONTRACT_LORE_UNLOCKS[ct.id];
                    if (loreUnlocks) {
                        for (const loreId of loreUnlocks) {
                            GameState.unlockLore(loreId);
                        }
                    }
                    this.refreshStatusBar();
                    this.buildContractPanel();
                    this.showPanel('contracts');
                    this.showToast(`Contract turned in — +${ct.reward.credits}c  +${ct.reward.xp} XP`, C.textSuccess);
                });
                scrollCt.add(turnInBtn);
            } else if (isAccepted) {
                scrollCt.add(this.add.text(870, y + 34, '[ ACCEPTED ✓ ]', {
                    fontFamily: 'Arial', fontSize: 12, color: C.textAccent,
                }).setOrigin(1, 0.5));
            } else {
                const acceptLabel = isRedline ? '[ ACCEPT REDLINE ]' : '[ ACCEPT ]';
                const acceptColor = isRedline ? '#ff4422' : C.btnNormal;
                const acceptBtn = this.add.text(870, y + 34, acceptLabel, {
                    fontFamily: 'Arial Black', fontSize: 13, color: acceptColor,
                }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
                acceptBtn.on('pointerover', () => acceptBtn.setColor(C.btnHover));
                acceptBtn.on('pointerout', () => acceptBtn.setColor(acceptColor));
                acceptBtn.on('pointerdown', () => {
                    if (isRedline) {
                        this.showRedlineWarning(ct.id, ct.title, ct.redlineWarning ?? '');
                    } else {
                        GameState.acceptContract(ct.id);
                        this.buildContractPanel();
                        this.showPanel('contracts');
                        this.showToast(`Contract accepted: ${ct.title}`, C.textAccent);
                    }
                });
                scrollCt.add(acceptBtn);
            }
        });

        // Scroll hint and wheel handler when content overflows the viewport.
        if (maxContractScroll > 0) {
            c.add(this.add.text(512, CONTRACT_VIEWPORT_TOP + CONTRACT_VIEWPORT_HEIGHT + 6, '▼ scroll for more', {
                fontFamily: 'Arial', fontSize: 11, color: C.textMuted, align: 'center',
            }).setOrigin(0.5));

            this._contractScrollHandler = (_pointer: unknown, _gameObjects: unknown, _deltaX: unknown, deltaY: unknown) => {
                contractScrollY = Math.max(0, Math.min(maxContractScroll, contractScrollY + (deltaY as number) * DIALOGUE_SCROLL_SPEED));
                scrollCt.setY(-contractScrollY);
            };
            this.input.on('wheel', this._contractScrollHandler);
        }

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    /** Show a Redline contract acceptance confirmation dialog. */
    private showRedlineWarning(contractId: string, contractTitle: string, warningText: string) {
        const existing = this.panels.get('redline-warn');
        if (existing) existing.destroy();

        const c = this.add.container(0, 0);
        this.panels.set('redline-warn', c);

        c.add(this.add.rectangle(512, 384, 840, 440, 0x0f0005).setStrokeStyle(2, 0xaa2222));
        c.add(this.add.text(512, 200, '⚠  REDLINE CONTRACT', {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ff3333', align: 'center',
        }).setOrigin(0.5));
        c.add(this.add.text(512, 232, contractTitle, {
            fontFamily: 'Arial', fontSize: 14, color: '#ff8866', align: 'center',
        }).setOrigin(0.5));
        c.add(this.add.rectangle(512, 252, 780, 1, 0x882222));

        const warnText = warningText.length > 0 ? warningText
            : 'If you are killed during this run, most equipped field gear will not be recovered. Accept with full knowledge of the risk.';
        c.add(this.add.text(512, 348, warnText, {
            fontFamily: 'Arial', fontSize: 12, color: '#cc8866', align: 'center',
            wordWrap: { width: 740 },
        }).setOrigin(0.5));

        // Show current insurance/secure slot status
        const gs = GameState.get();
        const insuranceStatus = gs.redlineInsuranceActive
            ? '✓ Field Insurance ACTIVE'
            : '✗ No insurance — buy at Services (250c)';
        c.add(this.add.text(512, 472, insuranceStatus, {
            fontFamily: 'Arial Black', fontSize: 11,
            color: gs.redlineInsuranceActive ? '#44ff88' : '#886644', align: 'center',
        }).setOrigin(0.5));

        c.add(this.add.text(512, 490, 'Use Services → Field Insurance to protect gear. Set secure slot to protect 1 critical item.', {
            fontFamily: 'Arial', fontSize: 11, color: '#665544', align: 'center',
        }).setOrigin(0.5));

        const acceptBtn = this.add.text(380, 560, '[ ACCEPT REDLINE CONTRACT ]', {
            fontFamily: 'Arial Black', fontSize: 14, color: '#ff3333', align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        acceptBtn.on('pointerover', () => acceptBtn.setColor('#ffffff'));
        acceptBtn.on('pointerout', () => acceptBtn.setColor('#ff3333'));
        acceptBtn.on('pointerdown', () => {
            GameState.acceptContract(contractId);
            c.destroy();
            this.panels.delete('redline-warn');
            this.buildContractPanel();
            this.showPanel('contracts');
            this.showToast(`REDLINE CONTRACT ACCEPTED: ${contractTitle}`, '#ff6644');
        });
        c.add(acceptBtn);

        const cancelBtn = this.add.text(650, 560, '[ CANCEL ]', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textSecond, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        cancelBtn.on('pointerover', () => cancelBtn.setColor(C.btnHover));
        cancelBtn.on('pointerout', () => cancelBtn.setColor(C.textSecond));
        cancelBtn.on('pointerdown', () => {
            c.destroy();
            this.panels.delete('redline-warn');
            this.showPanel('contracts');
        });
        c.add(cancelBtn);

        this.showPanel('redline-warn');
    }

    // ── NPC list panel ────────────────────────────────────────────────────
    private buildNpcListPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('npcs', c);
        const gs = GameState.get();
        const isFarpoint = gs.currentHubId === 'farpoint';
        const subtitle = isFarpoint
            ? 'Farpoint Waystation — talk to the locals'
            : 'Meridian Station — talk to the locals';
        this.panelHeader(c, 'STATION CONTACTS', subtitle);

        const allNPCs = [...meridianNPCs, ...phase4NPCs, ...phase6NPCs];
        const npcIds = isFarpoint ? FARPOINT_HUB_NPC_IDS : HUB_NPC_IDS;
        const npcs = allNPCs.filter(n => npcIds.includes(n.id));
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
        const npc = this.findNpc(npcId);
        if (!npc) return;

        // Tear down any previous wheel handler before rebuilding the panel.
        if (this._npcScrollHandler) {
            this.input.off('wheel', this._npcScrollHandler);
            this._npcScrollHandler = null;
        }

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

        // ── Scrollable dialogue area ──────────────────────────────────────
        // Only lines whose condition evaluates true are shown.
        const visibleLines = npc.dialogue.filter(line => this.evaluateDialogueCondition(line.condition));
        const totalH    = visibleLines.length * DIALOGUE_LINE_HEIGHT;
        const maxScroll = Math.max(0, totalH - DIALOGUE_VIEWPORT_HEIGHT);
        let   scrollY   = 0;

        // Mask that clips the scrollable container to the visible area.
        const maskGfx = this.make.graphics({ x: 0, y: 0 });
        maskGfx.fillRect(112, DIALOGUE_VIEWPORT_TOP, 800, DIALOGUE_VIEWPORT_HEIGHT);
        const mask = maskGfx.createGeometryMask();

        const scrollCt = this.add.container(0, 0);
        scrollCt.setMask(mask);
        c.add(scrollCt);

        visibleLines.forEach((line, i) => {
            const y = DIALOGUE_VIEWPORT_TOP + i * DIALOGUE_LINE_HEIGHT;
            scrollCt.add(this.add.rectangle(512, y + 32, 720, DIALOGUE_LINE_HEIGHT - 8, 0x0a0a1a).setStrokeStyle(1, C.border));
            scrollCt.add(this.add.text(512, y + 32, `"${line.text}"`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textPrimary, align: 'center',
                fontStyle: 'italic', wordWrap: { width: 680 },
            }).setOrigin(0.5));
        });

        // Scroll hint when there is overflow content.
        if (maxScroll > 0) {
            c.add(this.add.text(512, DIALOGUE_VIEWPORT_TOP + DIALOGUE_VIEWPORT_HEIGHT + 6, '▼ scroll for more', {
                fontFamily: 'Arial', fontSize: 11, color: C.textMuted, align: 'center',
            }).setOrigin(0.5));

            this._npcScrollHandler = (_pointer: unknown, _gameObjects: unknown, _deltaX: unknown, deltaY: unknown) => {
                scrollY = Math.max(0, Math.min(maxScroll, scrollY + (deltaY as number) * DIALOGUE_SCROLL_SPEED));
                scrollCt.setY(-scrollY);
            };
            this.input.on('wheel', this._npcScrollHandler);
        }

        if (npc.services && npc.services.length > 0) {
            const servicesStr = npc.services.join('  ·  ').toUpperCase();
            c.add(this.add.text(512, 596, `SERVICES: ${servicesStr}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textWarn, align: 'center',
            }).setOrigin(0.5));
        }

        this.makeButton(c, 512, 640, '[ ← BACK TO CONTACTS ]', () => {
            this.showPanel('npcs');
        }, C.textSecond);

        this.showPanel('npc-dialogue');
    }

    /**
     * Evaluates an NPC dialogue condition string.
     * Supported formats:
     *   - `flag.<flag-id>`                         — true if the flag is set
     *   - `reputation.<faction-id> >= <value>`     — compares player reputation
     * Unknown or missing conditions return true (fail open).
     */
    private evaluateDialogueCondition(condition: string | undefined): boolean {
        if (!condition) return true;
        const repMatch = condition.match(/^reputation\.([^\s]+)\s*(>=|<=|>|<|==)\s*(\d+)$/);
        if (repMatch) {
            const playerRep = GameState.getReputation(repMatch[1]);
            const threshold = parseInt(repMatch[3], 10);
            switch (repMatch[2]) {
                case '>=': return playerRep >= threshold;
                case '<=': return playerRep <= threshold;
                case '>':  return playerRep >  threshold;
                case '<':  return playerRep <  threshold;
                case '==': return playerRep === threshold;
            }
        }
        const flagMatch = condition.match(/^flag\.(.+)$/);
        if (flagMatch) {
            return GameState.getFlag(flagMatch[1]);
        }
        return true;
    }

    /** Searches all NPC arrays to find an NPC by ID. */
    private findNpc(npcId: string) {
        return [...meridianNPCs, ...phase4NPCs, ...phase5NPCs, ...phase6NPCs].find(n => n.id === npcId) ?? null;
    }

    // ── Codex panel ───────────────────────────────────────────────────────
    private buildCodexPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('codex', c);
        this.populateCodexPanel(c);
    }

    private populateCodexPanel(c: Phaser.GameObjects.Container) {
        c.removeAll(true);

        if (this._codexScrollHandler) {
            this.input.off('wheel', this._codexScrollHandler);
            this._codexScrollHandler = null;
        }

        this.panelHeader(c, 'CODEX', 'Unlocked field intelligence and personal records');

        const unlockedEntries = phase6Lore.filter(entry => GameState.isLoreUnlocked(entry.id));

        const CODEX_VIEWPORT_TOP    = 148;
        const CODEX_VIEWPORT_HEIGHT = 552;
        const ENTRY_HEIGHT          = 160;
        const totalH                = unlockedEntries.length * ENTRY_HEIGHT;
        const maxScroll             = Math.max(0, totalH - CODEX_VIEWPORT_HEIGHT);
        let   codexScrollY          = 0;

        if (unlockedEntries.length === 0) {
            c.add(this.add.text(512, 380, 'No entries unlocked.\nComplete contracts and explore sites to build the archive.', {
                fontFamily: 'Arial', fontSize: 14, color: C.textSecond, align: 'center',
                wordWrap: { width: 600 },
            }).setOrigin(0.5));
            this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
            return;
        }

        const maskGfx = this.make.graphics({ x: 0, y: 0 });
        maskGfx.fillRect(0, CODEX_VIEWPORT_TOP, 1024, CODEX_VIEWPORT_HEIGHT);
        const mask = maskGfx.createGeometryMask();

        const scrollCt = this.add.container(0, 0);
        scrollCt.setMask(mask);
        c.add(scrollCt);

        unlockedEntries.forEach((entry, i) => {
            const y = CODEX_VIEWPORT_TOP + i * ENTRY_HEIGHT;
            scrollCt.add(this.add.rectangle(492, y + 72, 900, ENTRY_HEIGHT - 8, C.panelBg).setStrokeStyle(1, C.border));

            // Category tag
            const catColor = '#6688aa';
            scrollCt.add(this.add.text(80, y + 12, entry.category.toUpperCase().replace('-', ' '), {
                fontFamily: 'Arial', fontSize: 10, color: catColor,
            }).setOrigin(0.5));

            // Title
            scrollCt.add(this.add.text(140, y + 10, entry.title, {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textPrimary,
            }));

            // Source
            if (entry.source) {
                scrollCt.add(this.add.text(140, y + 30, entry.source, {
                    fontFamily: 'Arial', fontSize: 10, color: C.textAccent,
                }));
            }

            // Content (truncated/wrapped)
            const contentLines = entry.content.length > 360
                ? entry.content.slice(0, 357) + '…'
                : entry.content;
            scrollCt.add(this.add.text(140, y + 50, contentLines, {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
                wordWrap: { width: 800 },
            }));

            // Separator
            if (i < unlockedEntries.length - 1) {
                scrollCt.add(this.add.rectangle(492, y + ENTRY_HEIGHT - 4, 900, 1, C.border));
            }
        });

        if (maxScroll > 0) {
            c.add(this.add.text(512, CODEX_VIEWPORT_TOP + CODEX_VIEWPORT_HEIGHT + 6, '▼ scroll for more', {
                fontFamily: 'Arial', fontSize: 11, color: C.textMuted, align: 'center',
            }).setOrigin(0.5));

            this._codexScrollHandler = (_pointer: unknown, _gameObjects: unknown, _deltaX: unknown, deltaY: unknown) => {
                codexScrollY = Math.max(0, Math.min(maxScroll, codexScrollY + (deltaY as number) * CODEX_SCROLL_SPEED));
                scrollCt.setY(-codexScrollY);
            };
            this.input.on('wheel', this._codexScrollHandler);
        }

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
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

        // ── Pilot HP status ─────────────────────────────────────────────
        const pilotPct = gs.pilotHull / gs.pilotMaxHull;
        const pilotBarColor  = pilotPct < 0.4 ? C.barCritical : pilotPct < 0.7 ? C.barDamaged : C.barHull;
        const pilotTextColor = pilotPct < 0.4 ? C.textDanger  : pilotPct < 0.7 ? C.textWarn   : C.textSuccess;
        c.add(this.add.rectangle(512, 342, 700, 30, 0x0a0a1a).setStrokeStyle(1, C.border));
        c.add(this.add.text(180, 334, 'PILOT HP', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
        }));
        this.drawBar(c, 340, 342, 180, 10, pilotPct, pilotBarColor);
        c.add(this.add.text(440, 334, `${gs.pilotHull} / ${gs.pilotMaxHull}`, {
            fontFamily: 'Arial', fontSize: 12, color: pilotTextColor,
        }));
        if (pilotPct < 0.5) {
            c.add(this.add.text(600, 334, '⚠ Low HP', {
                fontFamily: 'Arial', fontSize: 11, color: C.textWarn,
            }));
        }

        const shopItems: Array<{ id: string; name: string; cost: number }> = [
            { id: 'medical-kit',       name: 'Medical Kit (heal 35 HP)',       cost: 50 },
            { id: 'repair-kit',        name: 'Repair Kit (repair 30 hull)',    cost: 65 },
            { id: 'anomaly-field-kit', name: 'Anomaly Field Kit (heal 50 HP)', cost: 120 },
        ];

        shopItems.forEach((item, i) => {
            const y = 380 + i * 48;
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

        // ── Field Insurance (Redline protection) ────────────────────────
        const insuranceY = 380 + shopItems.length * 48 + 8;
        const insuranceActive = gs.redlineInsuranceActive;
        c.add(this.add.rectangle(512, insuranceY + 12, 700, 38, insuranceActive ? 0x0a1a0a : 0x0a0a1a)
            .setStrokeStyle(1, insuranceActive ? 0x33aa55 : 0xaa4422));
        const insuranceLabel = insuranceActive
            ? '◆ FIELD INSURANCE — ACTIVE  (protects 1 extra item on Redline death)'
            : '◆ Field Insurance (250c) — Redline: reduces gear loss by 1 item';
        c.add(this.add.text(180, insuranceY + 2, insuranceLabel, {
            fontFamily: 'Arial', fontSize: 12, color: insuranceActive ? C.textSuccess : '#cc7744',
        }));
        if (!insuranceActive) {
            const insBtn = this.add.text(870, insuranceY + 12, `[ BUY INSURANCE (250c) ]`, {
                fontFamily: 'Arial Black', fontSize: 12, color: gs.credits >= 250 ? '#ffaa22' : C.textDanger,
            }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
            insBtn.on('pointerover', () => insBtn.setColor(C.btnHover));
            insBtn.on('pointerout',  () => insBtn.setColor(gs.credits >= 250 ? '#ffaa22' : C.textDanger));
            insBtn.on('pointerdown', () => {
                if (GameState.purchaseInsurance()) {
                    this.refreshStatusBar();
                    this.populateServicesPanel(c);
                    this.showToast('Field Insurance active — Redline gear loss reduced.', '#ffaa22');
                }
            });
            c.add(insBtn);
        } else {
            c.add(this.add.text(870, insuranceY + 12, '[ ACTIVE ✓ ]', {
                fontFamily: 'Arial Black', fontSize: 12, color: C.textSuccess,
            }).setOrigin(1, 0.5));
        }

        // ── Secure Slot (Redline protection) ───────────────────────────
        const secureSlotY = insuranceY + 104;
        c.add(this.add.text(180, secureSlotY, '◆ SECURE SLOT — One item protected on Redline death', {
            fontFamily: 'Arial Black', fontSize: 12, color: '#ffcc44',
        }));
        const securedId = gs.redlineSecuredItemId;
        const securableItems = gs.inventory.filter(i => i.type === 'consumable');
        if (securableItems.length === 0) {
            c.add(this.add.text(180, secureSlotY + 18, '  No consumables in inventory to secure.', {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
            }));
        } else {
            securableItems.forEach((item, i) => {
                const sy = secureSlotY + 18 + i * 22;
                const isSecured = securedId === item.id;
                const label = `  ${isSecured ? '✓ [SECURED]' : '[ SECURE ]'}  ${item.name}  ×${item.qty}`;
                const secBtn = this.add.text(180, sy, label, {
                    fontFamily: isSecured ? 'Arial Black' : 'Arial', fontSize: 11,
                    color: isSecured ? '#44ff88' : '#aaaacc',
                }).setInteractive({ useHandCursor: true });
                secBtn.on('pointerover', () => secBtn.setColor(C.btnHover));
                secBtn.on('pointerout',  () => secBtn.setColor(isSecured ? '#44ff88' : '#aaaacc'));
                secBtn.on('pointerdown', () => {
                    GameState.secureRunItem(isSecured ? null : item.id);
                    this.populateServicesPanel(c);
                });
                c.add(secBtn);
            });
        }

        // ── Nera Quill — sell salvage ───────────────────────────────────
        const sellHeaderY = secureSlotY + 24 + Math.max(1, securableItems.length) * 22 + 12;
        c.add(this.add.text(512, sellHeaderY, 'SELL SALVAGE', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textWarn, align: 'center',
        }).setOrigin(0.5));

        const sellable = gs.inventory.filter(item => item.type === 'salvage' && item.qty > 0);
        if (sellable.length === 0) {
            c.add(this.add.text(512, sellHeaderY + 24, 'No salvage in inventory.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        } else {
            sellable.forEach((item, i) => {
                const y = sellHeaderY + 18 + i * 40;
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
        this.populateShipStatusPanel(c);
    }

    private populateShipStatusPanel(c: Phaser.GameObjects.Container) {
        c.removeAll(true);
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

        // ── Relay Goal / Post-Relay section ───────────────────────────────
        const relayJumped = GameState.getFlag('relay-jump-completed');
        const farpointCleared = GameState.getFlag('farpoint-cleared');

        if (relayJumped) {
            c.add(this.add.text(512, 394, 'FRONTIER STATUS', {
                fontFamily: 'Arial Black', fontSize: 15, color: C.textWarn, align: 'center',
            }).setOrigin(0.5));
            c.add(this.add.text(512, 422, '✓  Void Relay 7-9 — TRANSITED', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textSuccess, align: 'center',
            }).setOrigin(0.5));
            c.add(this.add.text(512, 446, farpointCleared
                ? '✓  Farpoint Waystation Outer Ring — CLEARED'
                : '▶  Farpoint Waystation — Tier 3 site available', {
                fontFamily: 'Arial', fontSize: 13, color: farpointCleared ? C.textSuccess : C.textWarn, align: 'center',
            }).setOrigin(0.5));
            c.add(this.add.text(512, 470, 'New factions active: ICA · Void Covenant · Farpoint contacts', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
            c.add(this.add.text(512, 494, 'Watch for Redline Runs, black-market ops, and deeper anomaly contracts.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        } else if (isRelayCapable) {
            c.add(this.add.text(512, 394, 'RELAY GOAL — VOID RELAY 7-9', {
                fontFamily: 'Arial Black', fontSize: 15, color: C.textWarn, align: 'center',
            }).setOrigin(0.5));
            c.add(this.add.text(512, 422, '✓  Your ship is relay-capable. Void Relay 7-9 is within reach.', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textSuccess, align: 'center',
            }).setOrigin(0.5));
            c.add(this.add.text(512, 446, 'Speak to Brother Caldus and Kestrel Vin before you go through.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
            c.add(this.add.text(512, 468, 'Use SECTOR MAP → INITIATE RELAY JUMP to transit Void Relay 7-9.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textAccent, align: 'center',
            }).setOrigin(0.5));
        } else {
            c.add(this.add.text(512, 394, 'RELAY GOAL — VOID RELAY 7-9', {
                fontFamily: 'Arial Black', fontSize: 15, color: C.textWarn, align: 'center',
            }).setOrigin(0.5));
            // Path A: buy Hauler — progress bar via shared helper
            const creditsToHauler = Math.max(0, HAULER_PURCHASE_COST - gs.credits);
            const pathAProgress = Math.min(gs.credits / HAULER_PURCHASE_COST, 1);
            c.add(this.add.text(150, 418, `PATH A: Buy Meridian Hauler II from Oziel Kaur — ${HAULER_PURCHASE_COST}c`, {
                fontFamily: 'Arial Black', fontSize: 12, color: C.textWarn,
            }));
            this.drawBar(c, 512, 446, 700, 14, pathAProgress, 0xcc8822, 0x1a1a2a, true);
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
                            // Keep ship status panel current so upgrades are visible immediately.
                            const shipStatusC = this.panels.get('shipstatus');
                            if (shipStatusC) this.populateShipStatusPanel(shipStatusC);
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

    // ── Faction Standings panel ───────────────────────────────────────────
    private buildFactionsPanel() {
        const c = this.add.container(0, 0);
        this.panels.set('factions', c);
        this.populateFactionsPanel(c);
    }

    private populateFactionsPanel(c: Phaser.GameObjects.Container) {
        c.removeAll(true);
        this.panelHeader(c, 'FACTION STANDINGS', 'Your reputation across the frontier');

        const allNPCs = [...meridianNPCs, ...phase4NPCs, ...phase5NPCs, ...phase6NPCs];

        // Show all tracked factions in two columns
        const trackedFactionIds = Object.keys(GameState.get().reputation);
        const displayFactions = factions.filter(f => trackedFactionIds.includes(f.id));

        const colW = 480;
        const rowH = 72;
        const startY = 148;

        displayFactions.forEach((faction, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = 80 + col * colW;
            const y = startY + row * rowH;

            const rep = GameState.getReputation(faction.id);
            const label = GameState.getReputationLabel(rep);
            const repColor = GameState.getReputationColor(rep);
            const repPct = Math.max(0, Math.min(1, (rep + 50) / 250));

            c.add(this.add.rectangle(x + colW / 2 - 40, y + 26, colW - 30, rowH - 10, C.panelBg).setStrokeStyle(1, C.border));

            // Faction name
            c.add(this.add.text(x, y + 6, faction.shortName ?? faction.name, {
                fontFamily: 'Arial Black', fontSize: 13, color: repColor,
            }));
            c.add(this.add.text(x, y + 24, faction.name, {
                fontFamily: 'Arial', fontSize: 10, color: C.textSecond,
            }));

            // Standing label
            c.add(this.add.text(x + colW - 90, y + 6, label, {
                fontFamily: 'Arial Black', fontSize: 12, color: repColor, align: 'right',
            }).setOrigin(1, 0));
            c.add(this.add.text(x + colW - 90, y + 22, `${rep > 0 ? '+' : ''}${rep}`, {
                fontFamily: 'Arial', fontSize: 11, color: repColor, align: 'right',
            }).setOrigin(1, 0));

            // Rep bar
            this.drawBar(c, x + 100, y + 44, 180, 6, repPct, parseInt(repColor.replace('#', '0x'), 16), 0x111122, true);

            // Contact NPC button (if available and relay jumped for Phase 4 NPCs)
            const factionNPC = allNPCs.find(n => n.faction === faction.id && FACTION_NPC_IDS.includes(n.id));
            const relayJumped = GameState.getFlag('relay-jump-completed');
            if (factionNPC && relayJumped) {
                const contactBtn = this.add.text(x + colW - 90, y + 40, '[ CONTACT ]', {
                    fontFamily: 'Arial', fontSize: 11, color: C.btnNormal, align: 'right',
                }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
                contactBtn.on('pointerover', () => contactBtn.setColor(C.btnHover));
                contactBtn.on('pointerout', () => contactBtn.setColor(C.btnNormal));
                contactBtn.on('pointerdown', () => this.showFactionNpcDialogue(factionNPC.id));
                c.add(contactBtn);
            }
        });

        // Phase 4+5 contacts section header (only post-relay)
        const relayJumped = GameState.getFlag('relay-jump-completed');
        if (relayJumped) {
            const sectionY = startY + Math.ceil(displayFactions.length / 2) * rowH + 16;
            c.add(this.add.text(80, sectionY, 'FRONTIER CONTACTS', {
                fontFamily: 'Arial Black', fontSize: 14, color: C.textWarn,
            }));
            c.add(this.add.text(80, sectionY + 18, 'New operators encountered in the post-relay frontier', {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond,
            }));

            const contactNPCs = [...phase4NPCs, ...phase5NPCs, ...phase6NPCs];
            const npcColW = 220;
            contactNPCs.forEach((npc, i) => {
                const cx = 80 + i * npcColW;
                const cy = sectionY + 50;
                c.add(this.add.rectangle(cx + 100, cy + 38, 200, 70, C.panelBg).setStrokeStyle(1, C.border));
                c.add(this.add.text(cx + 100, cy + 12, npc.name, {
                    fontFamily: 'Arial Black', fontSize: 11, color: C.textPrimary, align: 'center',
                }).setOrigin(0.5));

                const factionOfNPC = factions.find(f => f.id === npc.faction);
                const fRep = npc.faction ? GameState.getReputation(npc.faction) : 0;
                const fRepColor = npc.faction ? GameState.getReputationColor(fRep) : C.textSecond;
                c.add(this.add.text(cx + 100, cy + 28, factionOfNPC?.shortName ?? npc.faction ?? '', {
                    fontFamily: 'Arial', fontSize: 10, color: fRepColor, align: 'center',
                }).setOrigin(0.5));

                const talkBtn = this.add.text(cx + 100, cy + 56, '[ TALK ]', {
                    fontFamily: 'Arial Black', fontSize: 12, color: C.btnNormal, align: 'center',
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                talkBtn.on('pointerover', () => talkBtn.setColor(C.btnHover));
                talkBtn.on('pointerout', () => talkBtn.setColor(C.btnNormal));
                talkBtn.on('pointerdown', () => this.showFactionNpcDialogue(npc.id));
                c.add(talkBtn);
            });
        } else {
            const sectionY = startY + Math.ceil(displayFactions.length / 2) * rowH + 16;
            c.add(this.add.text(512, sectionY, '▶ Reach the Void Relay to access frontier faction contacts', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        }

        this.makeButton(c, 512, 700, '[ ← BACK TO STATION ]', () => this.showPanel('main'), C.textSecond);
    }

    private showFactionNpcDialogue(npcId: string) {
        const npc = this.findNpc(npcId);
        if (!npc) return;

        // Tear down any previous wheel handler before rebuilding the panel.
        if (this._npcScrollHandler) {
            this.input.off('wheel', this._npcScrollHandler);
            this._npcScrollHandler = null;
        }

        const existing = this.panels.get('npc-dialogue');
        if (existing) existing.destroy();

        const c = this.add.container(0, 0);
        this.panels.set('npc-dialogue', c);

        c.add(this.add.rectangle(512, 420, 800, 500, C.panelBg).setStrokeStyle(1, C.border));
        c.add(this.add.text(512, 200, npc.name, {
            fontFamily: 'Arial Black', fontSize: 22, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5));

        const roleLine = npc.role.map(r => r.replace('-', ' ')).join('  ·  ').toUpperCase();
        c.add(this.add.text(512, 232, roleLine, {
            fontFamily: 'Arial', fontSize: 13, color: C.textAccent, align: 'center',
        }).setOrigin(0.5));

        const totalH = npc.dialogue.filter(line => this.evaluateDialogueCondition(line.condition)).length * DIALOGUE_LINE_HEIGHT;
        const maxScroll = Math.max(0, totalH - DIALOGUE_VIEWPORT_HEIGHT);
        let scrollY = 0;

        const maskGfx = this.make.graphics({ x: 0, y: 0 });
        maskGfx.fillRect(112, DIALOGUE_VIEWPORT_TOP, 800, DIALOGUE_VIEWPORT_HEIGHT);
        const mask = maskGfx.createGeometryMask();

        const scrollCt = this.add.container(0, 0);
        scrollCt.setMask(mask);
        c.add(scrollCt);

        npc.dialogue.filter(line => this.evaluateDialogueCondition(line.condition)).forEach((line, i) => {
            const y = DIALOGUE_VIEWPORT_TOP + i * DIALOGUE_LINE_HEIGHT;
            scrollCt.add(this.add.rectangle(512, y + 32, 720, DIALOGUE_LINE_HEIGHT - 8, 0x0a0a1a).setStrokeStyle(1, C.border));
            scrollCt.add(this.add.text(512, y + 32, `"${line.text}"`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textPrimary, align: 'center',
                fontStyle: 'italic', wordWrap: { width: 680 },
            }).setOrigin(0.5));
        });

        if (maxScroll > 0) {
            c.add(this.add.text(512, DIALOGUE_VIEWPORT_TOP + DIALOGUE_VIEWPORT_HEIGHT + 6, '▼ scroll for more', {
                fontFamily: 'Arial', fontSize: 11, color: C.textMuted, align: 'center',
            }).setOrigin(0.5));

            this._npcScrollHandler = (_pointer: unknown, _gameObjects: unknown, _deltaX: unknown, deltaY: unknown) => {
                scrollY = Math.max(0, Math.min(maxScroll, scrollY + (deltaY as number) * DIALOGUE_SCROLL_SPEED));
                scrollCt.setY(-scrollY);
            };
            this.input.on('wheel', this._npcScrollHandler);
        }

        if (npc.services && npc.services.length > 0) {
            const servicesStr = npc.services.join('  ·  ').toUpperCase();
            c.add(this.add.text(512, 596, `SERVICES: ${servicesStr}`, {
                fontFamily: 'Arial', fontSize: 13, color: C.textWarn, align: 'center',
            }).setOrigin(0.5));
        }

        this.makeButton(c, 512, 640, '[ ← BACK TO FACTIONS ]', () => {
            this.showPanel('factions');
        }, C.textSecond);

        this.showPanel('npc-dialogue');
    }

    // ── Debrief panel (post-dungeon) ──────────────────────────────────────
    private buildDebriefPanel() {
        const gs = GameState.get();
        const c = this.add.container(0, 0);
        this.panels.set('debrief', c);

        // Detect run type
        const isRelayMilestone = gs.lastDungeonId === 'void-relay-7-9' && gs.lastRunSuccess;
        const isRedlineDeath   = !gs.lastRunSuccess && gs.lastRunRedlineLoss.length > 0;

        let title: string;
        let titleColor: string;
        if (isRelayMilestone) {
            title = 'RELAY TRANSIT COMPLETE';
            titleColor = C.textWarn;
        } else if (isRedlineDeath) {
            title = '⚠ REDLINE FAILURE';
            titleColor = '#ff3333';
        } else if (gs.lastRunSuccess) {
            title = 'EXTRACTION SUCCESSFUL';
            titleColor = C.textSuccess;
        } else {
            title = 'EMERGENCY EXTRACTION';
            titleColor = C.textWarn;
        }

        c.add(this.add.text(512, 90, title, {
            fontFamily: 'Arial Black', fontSize: 28, color: titleColor,
            stroke: '#000000', strokeThickness: 4, align: 'center',
        }).setOrigin(0.5));

        // Use lastDungeonId to show dungeon name
        const dungeonNames: Record<string, string> = {
            'shalehook-dig-site':             'Shalehook Dig Site',
            'coldframe-station-b':            'Coldframe Station-B',
            'void-relay-7-9':                 'Void Relay 7-9',
            'farpoint-outer-ring':            'Farpoint Waystation — Outer Ring',
            'kalindra-processing-hub':        'Kalindra Processing Hub',
            'orins-crossing-locked-sector':   "Orin's Crossing — Locked Sector",
            'vault-of-the-broken-signal':     'Vault of the Broken Signal',
            'ashveil-observation-post':       'Ashveil Observation Post',
            'transit-node-zero':              'Transit Node Zero',
        };
        const siteName = dungeonNames[gs.lastDungeonId ?? ''] ?? 'Unknown Site';
        c.add(this.add.text(512, 132, `${siteName} — Run Complete`, {
            fontFamily: 'Arial', fontSize: 16, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));

        // Relay milestone highlight
        if (isRelayMilestone) {
            c.add(this.add.rectangle(512, 166, 800, 28, 0x0a1a0a).setStrokeStyle(1, 0x335544));
            c.add(this.add.text(512, 166, '✓  FARPOINT WAYSTATION IS NOW ACCESSIBLE — Check the Sector Map and Contract Board', {
                fontFamily: 'Arial Black', fontSize: 12, color: C.textSuccess, align: 'center',
            }).setOrigin(0.5));
        }

        // Redline death alert
        if (isRedlineDeath) {
            c.add(this.add.rectangle(512, 166, 800, 28, 0x1a0005).setStrokeStyle(1, 0xaa2222));
            c.add(this.add.text(512, 166, '⚠ Redline failure — field gear was lost during emergency extraction', {
                fontFamily: 'Arial Black', fontSize: 12, color: '#ff4422', align: 'center',
            }).setOrigin(0.5));
        }

        c.add(this.add.rectangle(512, 380, 700, 440, C.panelBg).setStrokeStyle(1, C.border));

        // Credits and XP
        c.add(this.add.text(175, 188, `CREDITS EARNED:  +${gs.lastRunCredits}c`, {
            fontFamily: 'Arial Black', fontSize: 16, color: C.textWarn,
        }));
        c.add(this.add.text(175, 216, `XP EARNED:       +${gs.lastRunXp}`, {
            fontFamily: 'Arial', fontSize: 15, color: C.textAccent,
        }));

        // Loot
        c.add(this.add.text(175, 252, 'ITEMS RECOVERED:', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textPrimary,
        }));

        if (gs.lastRunLoot.length === 0) {
            c.add(this.add.text(175, 278, '  None.', {
                fontFamily: 'Arial', fontSize: 14, color: C.textSecond,
            }));
        } else {
            gs.lastRunLoot.forEach((item, i) => {
                c.add(this.add.text(175, 278 + i * 24, `  ◆ ${item.name}  x${item.qty}`, {
                    fontFamily: 'Arial', fontSize: 14, color: C.textPrimary,
                }));
            });
        }

        let lootBottom = 278 + gs.lastRunLoot.length * 24 + 8;

        // Redline gear loss section
        if (isRedlineDeath && gs.lastRunRedlineLoss.length > 0) {
            c.add(this.add.text(175, lootBottom, 'FIELD GEAR LOST:', {
                fontFamily: 'Arial Black', fontSize: 14, color: '#ff5533',
            }));
            lootBottom += 22;
            gs.lastRunRedlineLoss.forEach((item, i) => {
                c.add(this.add.text(175, lootBottom + i * 22, `  ◆ ${item.name}  x${item.qty}  — LOST`, {
                    fontFamily: 'Arial', fontSize: 13, color: '#ff5533',
                }));
            });
            lootBottom += gs.lastRunRedlineLoss.length * 22 + 8;
        }

        // Contracts updated — all phases
        const allContracts = [...starterContracts, ...phase2Contracts, ...phase3Contracts, ...phase4Contracts, ...phase5Contracts, ...phase6Contracts];
        const completedContracts = gs.contracts.filter(ct => ct.completed && !ct.turnedIn);
        if (completedContracts.length > 0) {
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

