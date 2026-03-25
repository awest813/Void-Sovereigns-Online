import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState } from '../state/GameState';
import { HAULER_PURCHASE_COST, RELAY_UPGRADE_REQUIREMENTS } from '../data/shipUpgrades';
import { T } from '../ui/UITheme';
import { DebugPanel } from '../ui/DebugPanel';

// Scene colour aliases — sourced from shared UITheme.
const C = { ...T, bg: T.bgDeep };

// ── SectorMapScene ──────────────────────────────────────────────────────────
export class SectorMapScene extends Scene {
    constructor() {
        super('SectorMap');
    }

    create() {
        const gs = GameState.get();
        // Reset to Meridian hub when entering the sector map (Farpoint is accessed via a separate flow)
        GameState.setCurrentHub('meridian');
        this.cameras.main.setBackgroundColor(C.bg);

        // Star field
        for (let i = 0; i < 120; i++) {
            const x = Phaser.Math.Between(0, 1024);
            const y = Phaser.Math.Between(0, 768);
            const size = Math.random() < 0.1 ? 2 : 1;
            this.add.rectangle(x, y, size, size, 0xffffff).setAlpha(0.12 + Math.random() * 0.28);
        }

        // Header
        this.add.rectangle(512, 40, 1024, 80, C.panelBg);
        this.add.rectangle(512, 80, 1024, 1, C.border);
        this.add.text(512, 24, 'SECTOR MAP', {
            fontFamily: 'Arial Black', fontSize: 22, color: C.textAccent, align: 'center',
        }).setOrigin(0.5);
        this.add.text(512, 56, 'Ashwake Region — local jump range', {
            fontFamily: 'Arial', fontSize: 14, color: C.textSecond, align: 'center',
        }).setOrigin(0.5);

        // ── Meridian Station node
        this.drawSectorNode(180, 340, 'MERIDIAN STATION', 'Safe Zone — Hub', C.textAccent, false, () => {});
        this.add.text(180, 400, '▶ YOU ARE HERE', {
            fontFamily: 'Arial Black', fontSize: 11, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5);

        // Connection line
        this.add.rectangle(340, 340, 120, 2, C.border);

        // ── Ashwake Belt node
        const hasAcceptedContract = gs.contracts.some(c => c.accepted && !c.turnedIn);
        this.drawSectorNode(490, 340, 'ASHWAKE BELT', 'Danger: Low — Mining Ruins', C.textWarn, true, () => {});
        if (hasAcceptedContract) {
            this.add.text(490, 400, '▶ CONTRACTS ACTIVE', {
                fontFamily: 'Arial', fontSize: 11, color: C.textSuccess, align: 'center',
            }).setOrigin(0.5);
        }

        // Connection line (dashed — broken toward Relay)
        for (let x = 650; x < 820; x += 20) {
            this.add.rectangle(x, 340, 12, 2, C.borderFaint);
        }

        // ── Void Relay node
        const isRelayCapable = GameState.isRelayCapable();
        const relayJumped = GameState.getFlag('relay-jump-completed');
        const relayColor = isRelayCapable ? C.textSuccess : C.textMuted;
        const relaySubtitle = relayJumped
            ? 'Relay Jump — TRANSITED'
            : isRelayCapable ? 'Relay Jump — UNLOCKED' : 'Relay Jump — LOCKED';
        this.drawSectorNode(870, 340, 'VOID RELAY 7-9',
            relaySubtitle,
            relayJumped ? C.textAccent : relayColor, true, () => {
                if (isRelayCapable) this.showRelayReadyMessage();
                else this.showRelayLockedMessage();
            });
        this.add.text(870, 400, relayJumped ? '✓ TRANSITED' : (isRelayCapable ? '✓ RELAY CAPABLE' : '✗ Relay ship required'), {
            fontFamily: 'Arial', fontSize: 11,
            color: relayJumped ? C.textAccent : (isRelayCapable ? C.textSuccess : C.textDanger), align: 'center',
        }).setOrigin(0.5);

        // ── Farpoint node (post-relay) ─────────────────────────────────────
        if (relayJumped) {
            // Connection line from relay
            for (let x = 920; x < 1010; x += 14) {
                this.add.rectangle(x, 340, 9, 2, 0x2a3018);
            }
            this.drawSectorNode(880, 500, 'FARPOINT WAYSTATION',
                'Post-Relay Frontier Hub', C.textWarn, true, () => {
                    this.enterFarpointHub();
                });
            this.add.text(880, 560, '▶ ENTER HUB', {
                fontFamily: 'Arial', fontSize: 11, color: C.textWarn, align: 'center',
            }).setOrigin(0.5);
        }

        // ── Dungeon sites area
        this.add.rectangle(490, 550, 680, 130, C.panelBg).setStrokeStyle(1, C.border);
        this.add.text(490, 498, 'ASHWAKE BELT — AVAILABLE SITES', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textWarn, align: 'center',
        }).setOrigin(0.5);

        this.add.text(350, 520, '◆ Shalehook Dig Site  ·  Tier 1  ·  Rogue Automation', {
            fontFamily: 'Arial', fontSize: 12, color: C.textPrimary,
        });
        const shalehookBtn = this.add.text(350, 540, '  [ LAUNCH TO SHALEHOOK ]', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.btnNormal,
        }).setInteractive({ useHandCursor: true });
        shalehookBtn.on('pointerover', () => shalehookBtn.setColor(C.btnHover));
        shalehookBtn.on('pointerout',  () => shalehookBtn.setColor(C.btnNormal));
        shalehookBtn.on('pointerdown', () => this.launchToDungeon('shalehook-dig-site'));

        const coldframeCleared = GameState.getFlag('completed-coldframe');
        this.add.text(350, 564, `◆ Coldframe Station-B  ·  Tier 1  ·  Missing Crew${coldframeCleared ? '  [CLEARED]' : ''}`, {
            fontFamily: 'Arial', fontSize: 12, color: coldframeCleared ? C.textSecond : C.textPrimary,
        });
        const coldframeBtn = this.add.text(350, 584, '  [ LAUNCH TO COLDFRAME ]', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.btnNormal,
        }).setInteractive({ useHandCursor: true });
        coldframeBtn.on('pointerover', () => coldframeBtn.setColor(C.btnHover));
        coldframeBtn.on('pointerout',  () => coldframeBtn.setColor(C.btnNormal));
        coldframeBtn.on('pointerdown', () => this.launchToDungeon('coldframe-station-b'));

        // ── Phase 3 relay and post-relay sites ────────────────────────────
        if (isRelayCapable) {
            const relayDungeonCleared = GameState.getFlag('relay-jump-completed');
            this.add.rectangle(490, 440, 680, 50, C.panelBg).setStrokeStyle(1, 0x283820);
            const relayLabel = relayDungeonCleared
                ? '◆ Void Relay 7-9  ·  Tier 2  ·  Anomaly Site  [TRANSITED]'
                : '◆ Void Relay 7-9  ·  Tier 2  ·  Anomaly Site  ★ NEW';
            this.add.text(350, 426, relayLabel, {
                fontFamily: 'Arial', fontSize: 12, color: relayDungeonCleared ? C.textSecond : C.textSuccess,
            });
            const relayLaunchBtn = this.add.text(350, 444, '  [ INITIATE RELAY JUMP — VOID RELAY 7-9 ]', {
                fontFamily: 'Arial Black', fontSize: 14,
                color: relayDungeonCleared ? C.textSecond : C.textSuccess,
            }).setInteractive({ useHandCursor: true });
            relayLaunchBtn.on('pointerover', () => relayLaunchBtn.setColor(C.btnHover));
            relayLaunchBtn.on('pointerout',  () => relayLaunchBtn.setColor(relayDungeonCleared ? C.textSecond : C.textSuccess));
            relayLaunchBtn.on('pointerdown', () => this.confirmRelayJump());
        }

        if (relayJumped) {
            const farpointCleared = GameState.getFlag('farpoint-cleared');
            this.add.rectangle(490, 390, 680, 28, 0x08090c).setStrokeStyle(1, 0x263a22);
            const fpLabel = farpointCleared
                ? '◆ Farpoint Waystation  ·  Tier 3  ·  Frontier Salvage  [CLEARED]'
                : '◆ Farpoint Waystation  ·  Tier 3  ·  Frontier Salvage  ★ NEW';
            this.add.text(350, 380, fpLabel, {
                fontFamily: 'Arial', fontSize: 12, color: farpointCleared ? C.textSecond : C.textWarn,
            });
            const fpBtn = this.add.text(500, 396, '[ LAUNCH TO FARPOINT ]', {
                fontFamily: 'Arial Black', fontSize: 13,
                color: farpointCleared ? C.textSecond : C.textWarn,
            }).setInteractive({ useHandCursor: true });
            fpBtn.on('pointerover', () => fpBtn.setColor(C.btnHover));
            fpBtn.on('pointerout',  () => fpBtn.setColor(farpointCleared ? C.textSecond : C.textWarn));
            fpBtn.on('pointerdown', () => this.launchToDungeon('farpoint-waystation'));

            // ── Phase 4 sector nodes ──────────────────────────────────────
            const kalindraClear = GameState.getFlag('kalindra-cleared');
            const orinsClear    = GameState.getFlag('orins-crossing-cleared');

            // Kalindra Drift node
            this.add.rectangle(490, 345, 680, 26, 0x090c09).setStrokeStyle(1, 0x2a3018);
            const kalindraLabel = kalindraClear
                ? '◆ Kalindra Drift  ·  Tier 3  ·  Salvage / Anomaly  [CLEARED]'
                : '◆ Kalindra Drift  ·  Tier 3  ·  Salvage / Anomaly  ★ NEW';
            this.add.text(350, 337, kalindraLabel, {
                fontFamily: 'Arial', fontSize: 12, color: kalindraClear ? C.textSecond : C.textSuccess,
            });
            const kalindraBtn = this.add.text(500, 351, '[ LAUNCH TO KALINDRA DRIFT ]', {
                fontFamily: 'Arial Black', fontSize: 13,
                color: kalindraClear ? C.textSecond : C.textSuccess,
            }).setInteractive({ useHandCursor: true });
            kalindraBtn.on('pointerover', () => kalindraBtn.setColor(C.btnHover));
            kalindraBtn.on('pointerout',  () => kalindraBtn.setColor(kalindraClear ? C.textSecond : C.textSuccess));
            kalindraBtn.on('pointerdown', () => this.launchToDungeon('kalindra-processing-hub'));

            // Orin's Crossing node
            this.add.rectangle(490, 302, 680, 26, 0x0a0909).setStrokeStyle(1, 0x2c2030);
            const orinsLabel = orinsClear
                ? "◆ Orin's Crossing  ·  Tier 4  ·  Military Checkpoint  [CLEARED]"
                : "◆ Orin's Crossing  ·  Tier 4  ·  Military Checkpoint  ★ NEW";
            this.add.text(350, 294, orinsLabel, {
                fontFamily: 'Arial', fontSize: 12, color: orinsClear ? C.textSecond : C.textDanger,
            });
            const orinsBtn = this.add.text(500, 308, "[ LAUNCH TO ORIN'S CROSSING ]", {
                fontFamily: 'Arial Black', fontSize: 13,
                color: orinsClear ? C.textSecond : C.textDanger,
            }).setInteractive({ useHandCursor: true });
            orinsBtn.on('pointerover', () => orinsBtn.setColor(C.btnHover));
            orinsBtn.on('pointerout',  () => orinsBtn.setColor(orinsClear ? C.textSecond : C.textDanger));
            orinsBtn.on('pointerdown', () => this.launchToDungeon('orins-crossing-locked-sector'));

            // ── Phase 5 Redline sector nodes ─────────────────────────────
            const vaultClear  = GameState.getFlag('vault-broken-signal-cleared');
            const ashveilClear = GameState.getFlag('ashveil-post-cleared');

            // Vault of the Broken Signal node
            this.add.rectangle(490, 258, 680, 26, C.redlinePanelBg).setStrokeStyle(1, C.redlineBorder);
            const vaultLabel = vaultClear
                ? '◆ Vault of the Broken Signal  ·  Tier 4  ·  REDLINE  ·  Industrial  [CLEARED]'
                : '◆ Vault of the Broken Signal  ·  Tier 4  ·  ⚠ REDLINE  ·  Industrial';
            this.add.text(350, 250, vaultLabel, {
                fontFamily: 'Arial', fontSize: 12, color: vaultClear ? C.textSecond : C.redlineText,
            });
            const vaultBtn = this.add.text(500, 264, '[ LAUNCH TO VAULT — REDLINE ]', {
                fontFamily: 'Arial Black', fontSize: 13,
                color: vaultClear ? C.textSecond : C.redlineTextDim,
            }).setInteractive({ useHandCursor: true });
            vaultBtn.on('pointerover', () => vaultBtn.setColor(C.btnHover));
            vaultBtn.on('pointerout',  () => vaultBtn.setColor(vaultClear ? C.textSecond : C.redlineTextDim));
            vaultBtn.on('pointerdown', () => this.confirmRedlineLaunch('vault-of-the-broken-signal', 'Vault of the Broken Signal'));

            // Ashveil Observation Post node
            this.add.rectangle(490, 214, 680, 26, C.ashveilPanelBg).setStrokeStyle(1, C.ashveilBorder);
            const ashveilLabel = ashveilClear
                ? '◆ Ashveil Observation Post  ·  Tier 5  ·  REDLINE  ·  Anomaly Site  [CLEARED]'
                : '◆ Ashveil Observation Post  ·  Tier 5  ·  ⚠ REDLINE  ·  Void-Adjacent';
            this.add.text(350, 206, ashveilLabel, {
                fontFamily: 'Arial', fontSize: 12, color: ashveilClear ? C.textSecond : C.ashveilText,
            });
            const ashveilBtn = this.add.text(500, 220, '[ LAUNCH TO ASHVEIL — REDLINE ]', {
                fontFamily: 'Arial Black', fontSize: 13,
                color: ashveilClear ? C.textSecond : C.ashveilTextDim,
            }).setInteractive({ useHandCursor: true });
            ashveilBtn.on('pointerover', () => ashveilBtn.setColor(C.btnHover));
            ashveilBtn.on('pointerout',  () => ashveilBtn.setColor(ashveilClear ? C.textSecond : C.ashveilTextDim));
            ashveilBtn.on('pointerdown', () => this.confirmRedlineLaunch('ashveil-observation-post', 'Ashveil Observation Post'));

            // ── Phase 6: Transit Node Zero ghost site ─────────────────────
            if (GameState.getFlag('kael-questline-stage-2')) {
                const ghostSiteCleared = GameState.getFlag('transit-node-zero-cleared');
                this.add.rectangle(490, 170, 680, 26, C.ghostPanelBg).setStrokeStyle(1, C.ghostBorder);
                const ghostLabel = ghostSiteCleared
                    ? '◆ Transit Node Zero  ·  Tier 4  ·  REDLINE  ·  Ghost Site  [CLEARED]'
                    : '◆ Transit Node Zero  ·  Tier 4  ·  ⚠ REDLINE  ·  Ghost Site';
                this.add.text(350, 162, ghostLabel, {
                    fontFamily: 'Arial', fontSize: 12, color: ghostSiteCleared ? C.textSecond : C.ghostText,
                });
                const ghostBtn = this.add.text(500, 176, '[ LAUNCH TO TRANSIT NODE ZERO — REDLINE ]', {
                    fontFamily: 'Arial Black', fontSize: 13,
                    color: ghostSiteCleared ? C.textSecond : C.ghostTextDim,
                }).setInteractive({ useHandCursor: true });
                ghostBtn.on('pointerover', () => ghostBtn.setColor(C.btnHover));
                ghostBtn.on('pointerout',  () => ghostBtn.setColor(ghostSiteCleared ? C.textSecond : C.ghostTextDim));
                ghostBtn.on('pointerdown', () => this.confirmRedlineLaunch('transit-node-zero', 'Transit Node Zero'));
            }

            // ── Phase 7: Ashveil Deep void-class site ────────────────────
            if (GameState.getFlag('transit-node-zero-cleared')) {
                const deepCleared = GameState.getFlag('ashveil-deep-cleared');
                this.add.rectangle(490, 126, 680, 26, C.ashveilPanelBg).setStrokeStyle(1, C.ashveilBorder);
                const deepLabel = deepCleared
                    ? '◆ Ashveil Deep  ·  Tier 5  ·  REDLINE  ·  Void-class  [CLEARED]'
                    : '◆ Ashveil Deep  ·  Tier 5  ·  ⚠ REDLINE  ·  Void-class';
                this.add.text(350, 118, deepLabel, {
                    fontFamily: 'Arial', fontSize: 12, color: deepCleared ? C.textSecond : C.ashveilText,
                });
                const deepBtn = this.add.text(500, 132, '[ LAUNCH TO ASHVEIL DEEP — REDLINE ]', {
                    fontFamily: 'Arial Black', fontSize: 13,
                    color: deepCleared ? C.textSecond : C.ashveilTextDim,
                }).setInteractive({ useHandCursor: true });
                deepBtn.on('pointerover', () => deepBtn.setColor(C.btnHover));
                deepBtn.on('pointerout',  () => deepBtn.setColor(deepCleared ? C.textSecond : C.ashveilTextDim));
                deepBtn.on('pointerdown', () => this.confirmRedlineLaunch('ashveil-deep-void-class', 'Ashveil Deep'));
            }
        }

        // ── Relay goal strip
        this.buildRelayGoalStrip();

        // Ship status bar at bottom
        this.add.rectangle(512, 748, 1024, 1, C.border);
        this.add.rectangle(512, 758, 1024, 20, C.panelBg);
        const hullPct = gs.shipHull / gs.shipMaxHull;
        const fuelPct = gs.shipFuel / gs.shipMaxFuel;
        const shipLabel = gs.activeShipId === 'deepfrontier-lancer-iii'
            ? 'DEEPFRONTIER LANCER III'
            : gs.activeShipId === 'meridian-hauler-ii'
                ? 'MERIDIAN HAULER II'
                : 'CUTTER Mk.I';
        const relayTag = GameState.isRelayCapable() ? '  [RELAY-CAPABLE]' : '';
        this.add.text(20, 750, `${shipLabel}${relayTag}   HULL: ${gs.shipHull}/${gs.shipMaxHull}  FUEL: ${gs.shipFuel}/${gs.shipMaxFuel}   CREDITS: ${gs.credits}c`, {
            fontFamily: 'Arial', fontSize: 12,
            color: hullPct < 0.3 || fuelPct < 0.2 ? C.textDanger : C.textSecond,
        });

        // Back button
        const backBtn = this.add.text(512, 700, '[ ← RETURN TO MERIDIAN STATION ]', {
            fontFamily: 'Arial', fontSize: 16, color: C.textSecond, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        backBtn.on('pointerover', () => backBtn.setColor(C.btnHover));
        backBtn.on('pointerout', () => backBtn.setColor(C.textSecond));
        backBtn.on('pointerdown', () => this.scene.start('Hub'));

        new DebugPanel(this);

        EventBus.emit('current-scene-ready', this);
    }

    private buildRelayGoalStrip() {
        const gs = GameState.get();
        const y = 640;
        this.add.rectangle(512, y + 18, 980, 50, 0x09080a).setStrokeStyle(1, C.border);

        const relayJumped = GameState.getFlag('relay-jump-completed');
        const farpointCleared = GameState.getFlag('farpoint-cleared');

        if (relayJumped) {
            const kalindraClear = GameState.getFlag('kalindra-cleared');
            const orinsClear    = GameState.getFlag('orins-crossing-cleared');
            let nextGoal: string;
            if (kalindraClear && orinsClear) {
                nextGoal = '✓  FRONTIER CLEAR — Deeper anomaly contracts and Redline Runs are available. The pattern is not done yet.';
            } else if (farpointCleared) {
                nextGoal = '✓  FARPOINT CLEARED — Kalindra Drift and Orin\'s Crossing are open. Faction contracts active.';
            } else {
                nextGoal = '✓  RELAY TRANSITED — Farpoint Waystation is open. New contracts available.';
            }
            this.add.text(512, y + 18, nextGoal, {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textWarn, align: 'center',
            }).setOrigin(0.5);
            return;
        }

        if (GameState.isRelayCapable()) {
            this.add.text(512, y + 18, '✓  YOUR SHIP IS RELAY-CAPABLE  —  Void Relay 7-9 is within reach — use INITIATE RELAY JUMP above', {
                fontFamily: 'Arial Black', fontSize: 13, color: C.textSuccess, align: 'center',
            }).setOrigin(0.5);
            return;
        }

        const creditsToHauler = Math.max(0, HAULER_PURCHASE_COST - gs.credits);
        const navInstalled = GameState.isUpgradeInstalled('nav-computer');
        const driveInstalled = GameState.isUpgradeInstalled('drift-drive-upgrade');
        const upgradesLeft = RELAY_UPGRADE_REQUIREMENTS.filter(id => !GameState.isUpgradeInstalled(id));
        const upgradeCreditsLeft = (!navInstalled ? 1200 : 0) + (!driveInstalled ? 1800 : 0);

        const pathA = creditsToHauler > 0 ? `Buy Meridian Hauler II: ${creditsToHauler}c remaining` : 'Can buy Meridian Hauler II now';
        const pathB = upgradeCreditsLeft > 0
            ? `Upgrade Cutter: ${upgradesLeft.map(id => id === 'nav-computer' ? 'Nav Computer (1,200c)' : 'Drift Drive (1,800c)').join(' + ')} remaining`
            : 'Cutter upgrades funded — install at Shipyard';

        this.add.text(24, y + 8, `RELAY GOAL ▶  PATH A: ${pathA}`, {
            fontFamily: 'Arial', fontSize: 11, color: C.textWarn,
        });
        this.add.text(24, y + 26, `              PATH B: ${pathB}`, {
            fontFamily: 'Arial', fontSize: 11, color: C.textAccent,
        });
    }

    private drawSectorNode(
        x: number, y: number,
        name: string, sub: string,
        color: string,
        interactive: boolean,
        callback: () => void,
    ) {
        this.add.circle(x, y, 42, C.panelBg).setStrokeStyle(2, C.border);
        this.add.circle(x, y, 28, C.panelDark);

        const nameText = this.add.text(x, y - 60, name, {
            fontFamily: 'Arial Black', fontSize: 12, color, align: 'center',
        }).setOrigin(0.5);

        this.add.text(x, y - 44, sub, {
            fontFamily: 'Arial', fontSize: 11, color: C.textSecond, align: 'center',
        }).setOrigin(0.5);

        if (interactive) {
            const circle = this.add.circle(x, y, 40, 0x000000, 0)
                .setInteractive({ useHandCursor: true });
            circle.on('pointerover', () => nameText.setColor(C.btnHover));
            circle.on('pointerout', () => nameText.setColor(color));
            circle.on('pointerdown', callback);
        }
    }

    private launchToDungeon(dungeonId: string, isRedline = false) {
        const gs = GameState.get();
        if (gs.shipFuel < 2) {
            this.showWarning('NOT ENOUGH FUEL — Refuel at Meridian Services before launching.');
            return;
        }
        GameState.launchDungeon(dungeonId, isRedline);
        this.scene.start('Dungeon');
    }

    private confirmRedlineLaunch(dungeonId: string, siteName: string) {
        const existing = this.children.getByName('redline-confirm');
        if (existing) return;

        const gs = GameState.get();
        const securedId = gs.redlineSecuredItemId;
        const insuranceActive = gs.redlineInsuranceActive;

        const panel = this.add.container(512, 320);
        panel.setName('redline-confirm');
        panel.add(this.add.rectangle(0, 0, 780, 340, C.redlinePanelBg).setStrokeStyle(2, C.redlineBorder));

        panel.add(this.add.text(0, -148, `⚠  REDLINE RUN — ${siteName.toUpperCase()}`, {
            fontFamily: 'Arial Black', fontSize: 18, color: C.redlineText, align: 'center',
        }).setOrigin(0.5));

        panel.add(this.add.text(0, -114, 'HIGH-RISK EXTRACTION  ·  Equipment loss on death', {
            fontFamily: 'Arial', fontSize: 13, color: C.redlineTextDim, align: 'center',
        }).setOrigin(0.5));

        // Risk lines
        const lossLine = insuranceActive
            ? 'On death: run loot lost  ·  1 consumable lost (insurance active)'
            : 'On death: run loot lost  ·  up to 2 consumables lost';
        panel.add(this.add.text(0, -82, lossLine, {
            fontFamily: 'Arial', fontSize: 12, color: C.redlineTextDim, align: 'center',
        }).setOrigin(0.5));

        const securedName = securedId
            ? (gs.inventory.find(i => i.id === securedId)?.name ?? securedId)
            : null;
        const secureText = securedName
            ? `Secure slot: ${securedName} — PROTECTED`
            : 'Secure slot: not set — visit Services to set';
        panel.add(this.add.text(0, -58, secureText, {
            fontFamily: 'Arial', fontSize: 12,
            color: securedName ? C.redlineSecured : C.textSecond, align: 'center',
        }).setOrigin(0.5));

        panel.add(this.add.text(0, -34, insuranceActive
            ? '✓ Field Insurance ACTIVE — loss reduced'
            : '✗ No insurance — buy at Services for 250c', {
            fontFamily: 'Arial', fontSize: 12,
            color: insuranceActive ? C.redlineInsure : C.textSecond, align: 'center',
        }).setOrigin(0.5));

        panel.add(this.add.text(0, -4, 'On success: all loot secured  ·  full contract reward  ·  full reputation earned', {
            fontFamily: 'Arial', fontSize: 12, color: C.textAccent, align: 'center',
        }).setOrigin(0.5));

        const confirmBtn = this.add.text(-120, 68, '[ LAUNCH — ACCEPT RISK ]', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.redlineBtn, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        confirmBtn.on('pointerover', () => confirmBtn.setColor(C.btnHover));
        confirmBtn.on('pointerout',  () => confirmBtn.setColor(C.redlineBtn));
        confirmBtn.on('pointerdown', () => {
            panel.destroy();
            this.launchToDungeon(dungeonId, true);
        });
        panel.add(confirmBtn);

        const cancelBtn = this.add.text(120, 68, '[ NOT YET ]', {
            fontFamily: 'Arial Black', fontSize: 15, color: C.textSecond, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        cancelBtn.on('pointerover', () => cancelBtn.setColor(C.btnHover));
        cancelBtn.on('pointerout',  () => cancelBtn.setColor(C.textSecond));
        cancelBtn.on('pointerdown', () => panel.destroy());
        panel.add(cancelBtn);
    }

    private showRelayLockedMessage() {
        const existing = this.children.getByName('relay-msg');
        if (existing) return;

        const panel = this.add.container(512, 300);
        panel.setName('relay-msg');
        panel.add(this.add.rectangle(0, 0, 680, 200, C.panelBg).setStrokeStyle(1, C.border));
        panel.add(this.add.text(0, -74, 'VOID RELAY 7-9 — LOCKED', {
            fontFamily: 'Arial Black', fontSize: 18, color: C.textDanger, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -44, 'Your current ship is not relay-capable.', {
            fontFamily: 'Arial', fontSize: 14, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -18, 'PATH A: Buy Meridian Hauler II from Oziel Kaur — 3,800c', {
            fontFamily: 'Arial', fontSize: 13, color: C.textWarn, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, 8, 'PATH B: Install Nav Computer (1,200c) + Drift Drive (1,800c) from Oziel', {
            fontFamily: 'Arial', fontSize: 13, color: C.textAccent, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, 34, 'Visit SHIP STATUS for progress tracking.', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));
        const close = this.add.text(0, 72, '[ DISMISS ]', {
            fontFamily: 'Arial', fontSize: 14, color: C.btnNormal, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => panel.destroy());
        panel.add(close);
    }

    private showRelayReadyMessage() {
        const existing = this.children.getByName('relay-msg');
        if (existing) return;

        const relayJumped = GameState.getFlag('relay-jump-completed');
        const panel = this.add.container(512, 300);
        panel.setName('relay-msg');
        panel.add(this.add.rectangle(0, 0, 680, 210, C.panelBg).setStrokeStyle(2, 0x335544));
        panel.add(this.add.text(0, -84, 'VOID RELAY 7-9 — RELAY JUMP AVAILABLE', {
            fontFamily: 'Arial Black', fontSize: 17, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -56, 'Your ship is relay-capable. Void Relay 7-9 is within reach.', {
            fontFamily: 'Arial', fontSize: 13, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5));

        if (relayJumped) {
            panel.add(this.add.text(0, -30, '✓  Relay transited. Farpoint Waystation is open.', {
                fontFamily: 'Arial', fontSize: 13, color: C.textAccent, align: 'center',
            }).setOrigin(0.5));
            panel.add(this.add.text(0, -6, 'Use the LAUNCH TO FARPOINT button to continue the frontier run.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));
        } else {
            panel.add(this.add.text(0, -30, 'But consider: Relay 7-9 has been dark for months.', {
                fontFamily: 'Arial', fontSize: 13, color: C.textWarn, align: 'center',
            }).setOrigin(0.5));
            panel.add(this.add.text(0, -6, 'Talk to Brother Caldus and Kestrel Vin before you go through.', {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
            }).setOrigin(0.5));

            const launchBtn = this.add.text(0, 30, '[ INITIATE RELAY JUMP — VOID RELAY 7-9 ]', {
                fontFamily: 'Arial Black', fontSize: 15, color: C.textSuccess, align: 'center',
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            launchBtn.on('pointerover', () => launchBtn.setColor(C.btnHover));
            launchBtn.on('pointerout',  () => launchBtn.setColor(C.textSuccess));
            launchBtn.on('pointerdown', () => {
                panel.destroy();
                this.confirmRelayJump();
            });
            panel.add(launchBtn);
        }

        const closeY = relayJumped ? 30 : 82;
        const close = this.add.text(0, closeY, '[ DISMISS ]', {
            fontFamily: 'Arial', fontSize: 13, color: C.btnNormal, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => panel.destroy());
        panel.add(close);
    }

    private confirmRelayJump() {
        const existing = this.children.getByName('relay-confirm');
        if (existing) return;

        const panel = this.add.container(512, 340);
        panel.setName('relay-confirm');
        panel.add(this.add.rectangle(0, 0, 720, 280, C.panelBg).setStrokeStyle(2, 0x335544));
        panel.add(this.add.text(0, -116, '⚠  RELAY JUMP — CONFIRM', {
            fontFamily: 'Arial Black', fontSize: 20, color: C.textWarn, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -82, 'Void Relay 7-9 has been non-functional for two years.', {
            fontFamily: 'Arial', fontSize: 13, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -58, 'Brother Caldus has flagged inconsistent telemetry from the approach corridor.', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -36, '"Something has been running in there without oversight."', {
            fontFamily: 'Arial', fontSize: 13, color: C.textAccent, align: 'center', fontStyle: 'italic',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -10, 'You will be the first relay-capable ship to make approach in eighteen months.', {
            fontFamily: 'Arial', fontSize: 12, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));

        const confirmBtn = this.add.text(-100, 60, '[ INITIATE JUMP ]', {
            fontFamily: 'Arial Black', fontSize: 16, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        confirmBtn.on('pointerover', () => confirmBtn.setColor(C.btnHover));
        confirmBtn.on('pointerout',  () => confirmBtn.setColor(C.textSuccess));
        confirmBtn.on('pointerdown', () => {
            panel.destroy();
            this.launchToDungeon('void-relay-7-9');
        });
        panel.add(confirmBtn);

        const cancelBtn = this.add.text(100, 60, '[ NOT YET ]', {
            fontFamily: 'Arial Black', fontSize: 16, color: C.textSecond, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        cancelBtn.on('pointerover', () => cancelBtn.setColor(C.btnHover));
        cancelBtn.on('pointerout',  () => cancelBtn.setColor(C.textSecond));
        cancelBtn.on('pointerdown', () => panel.destroy());
        panel.add(cancelBtn);
    }

    private enterFarpointHub() {
        GameState.setCurrentHub('farpoint');
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
            this.scene.start('Hub');
        });
    }

    private showWarning(msg: string) {
        const existing = this.children.getByName('warn-msg');
        if (existing) existing.destroy();

        const panel = this.add.container(512, 340);
        panel.setName('warn-msg');
        panel.add(this.add.rectangle(0, 0, 680, 100, C.panelBg).setStrokeStyle(1, C.border));
        panel.add(this.add.text(0, -18, msg, {
            fontFamily: 'Arial', fontSize: 14, color: C.textDanger, align: 'center', wordWrap: { width: 640 },
        }).setOrigin(0.5));
        const close = this.add.text(0, 30, '[ OK ]', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.btnNormal, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => panel.destroy());
        panel.add(close);
    }
}
