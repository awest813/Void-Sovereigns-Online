import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState } from '../state/GameState';
import { HAULER_PURCHASE_COST, RELAY_UPGRADE_REQUIREMENTS } from '../data/shipUpgrades';

const C = {
    bg:          0x040412,
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
};

// ── SectorMapScene ──────────────────────────────────────────────────────────
export class SectorMapScene extends Scene {
    constructor() {
        super('SectorMap');
    }

    create() {
        const gs = GameState.get();
        this.cameras.main.setBackgroundColor(C.bg);

        // Star field
        for (let i = 0; i < 120; i++) {
            const x = Phaser.Math.Between(0, 1024);
            const y = Phaser.Math.Between(0, 768);
            const size = Math.random() < 0.1 ? 2 : 1;
            this.add.rectangle(x, y, size, size, 0xffffff).setAlpha(0.2 + Math.random() * 0.5);
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
        this.add.rectangle(340, 340, 120, 2, 0x334455);

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
            this.add.rectangle(x, 340, 12, 2, 0x223344);
        }

        // ── Void Relay node
        const isRelayCapable = GameState.isRelayCapable();
        const relayColor = isRelayCapable ? C.textSuccess : '#444455';
        this.drawSectorNode(870, 340, 'VOID RELAY 7-9',
            isRelayCapable ? 'Relay Jump — UNLOCKED' : 'Relay Jump — LOCKED',
            relayColor, true, () => {
                if (isRelayCapable) this.showRelayReadyMessage();
                else this.showRelayLockedMessage();
            });
        this.add.text(870, 400, isRelayCapable ? '✓ RELAY CAPABLE' : '✗ Relay ship required', {
            fontFamily: 'Arial', fontSize: 11,
            color: isRelayCapable ? C.textSuccess : C.textDanger, align: 'center',
        }).setOrigin(0.5);

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

        // ── Relay goal strip
        this.buildRelayGoalStrip();

        // Ship status bar at bottom
        this.add.rectangle(512, 748, 1024, 1, C.border);
        this.add.rectangle(512, 758, 1024, 20, C.panelBg);
        const hullPct = gs.shipHull / gs.shipMaxHull;
        const fuelPct = gs.shipFuel / gs.shipMaxFuel;
        const shipLabel = gs.activeShipId === 'meridian-hauler-ii' ? 'MERIDIAN HAULER II' : 'CUTTER Mk.I';
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

        EventBus.emit('current-scene-ready', this);
    }

    private buildRelayGoalStrip() {
        const gs = GameState.get();
        const y = 640;
        this.add.rectangle(512, y + 18, 980, 50, 0x080815).setStrokeStyle(1, C.border);

        if (GameState.isRelayCapable()) {
            this.add.text(512, y + 18, '✓  YOUR SHIP IS RELAY-CAPABLE  —  Void Relay 7-9 is within reach', {
                fontFamily: 'Arial Black', fontSize: 14, color: C.textSuccess, align: 'center',
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
        this.add.circle(x, y, 42, 0x0d0d22).setStrokeStyle(2, 0x334466);
        this.add.circle(x, y, 28, 0x111133);

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

    private launchToDungeon(dungeonId: string) {
        const gs = GameState.get();
        if (gs.shipFuel < 2) {
            this.showWarning('NOT ENOUGH FUEL — Refuel at Meridian Services before launching.');
            return;
        }
        GameState.launchDungeon(dungeonId);
        this.scene.start('Dungeon');
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

        const panel = this.add.container(512, 300);
        panel.setName('relay-msg');
        panel.add(this.add.rectangle(0, 0, 620, 160, C.panelBg).setStrokeStyle(1, C.border));
        panel.add(this.add.text(0, -54, 'VOID RELAY 7-9 — RELAY JUMP AVAILABLE', {
            fontFamily: 'Arial Black', fontSize: 17, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -24, 'Your ship is relay-capable.', {
            fontFamily: 'Arial', fontSize: 14, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, 0, 'But consider: Relay 7-9 has been dark for months.', {
            fontFamily: 'Arial', fontSize: 13, color: C.textWarn, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, 22, 'Talk to Brother Caldus before you go through.', {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));
        const close = this.add.text(0, 60, '[ DISMISS ]', {
            fontFamily: 'Arial', fontSize: 14, color: C.btnNormal, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        close.on('pointerdown', () => panel.destroy());
        panel.add(close);
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
