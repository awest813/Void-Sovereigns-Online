import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { GameState } from '../state/GameState';

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
// Simple sector selection screen: launch to Ashwake Belt, or see locked Void Relay.
export class SectorMapScene extends Scene {
    constructor() {
        super('SectorMap');
    }

    create() {
        const gs = GameState.get();
        this.cameras.main.setBackgroundColor(C.bg);

        // Star field (simple dots)
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

        // ── Meridian Station node ──────────────────────────────────────────
        this.drawSectorNode(180, 380, 'MERIDIAN STATION', 'Safe Zone — Hub', C.textAccent, false, () => {});

        // You are here indicator
        this.add.text(180, 460, '▶ YOU ARE HERE', {
            fontFamily: 'Arial Black', fontSize: 11, color: C.textSuccess, align: 'center',
        }).setOrigin(0.5);

        // Connection line
        this.add.rectangle(380, 380, 140, 2, 0x334455);

        // ── Ashwake Belt node ──────────────────────────────────────────────
        const hasAcceptedContract = gs.contracts.some(c => c.accepted && !c.turnedIn);
        const ashwakeColor = C.textWarn;
        this.drawSectorNode(560, 380, 'ASHWAKE BELT', 'Danger: Low — Mining Ruins', ashwakeColor, true, () => {
            this.launchToAshwake();
        });

        if (hasAcceptedContract) {
            this.add.text(560, 460, '▶ CONTRACTS ACTIVE', {
                fontFamily: 'Arial', fontSize: 11, color: C.textSuccess, align: 'center',
            }).setOrigin(0.5);
        } else {
            this.add.text(560, 460, 'Accept a contract first', {
                fontFamily: 'Arial', fontSize: 11, color: C.textSecond, align: 'center',
            }).setOrigin(0.5);
        }

        // Connection line (dashed style — broken, toward Relay)
        for (let x = 760; x < 950; x += 20) {
            this.add.rectangle(x, 380, 12, 2, 0x223344);
        }

        // ── Void Relay node (locked) ───────────────────────────────────────
        this.drawSectorNode(940, 380, 'VOID RELAY 7-9', 'Relay Jump — LOCKED', '#444455', false, () => {
            this.showRelayLockedMessage();
        });
        this.add.text(940, 460, '✗ Relay ship required', {
            fontFamily: 'Arial', fontSize: 11, color: C.textDanger, align: 'center',
        }).setOrigin(0.5);

        // Dungeon selection area
        this.add.rectangle(560, 560, 600, 80, C.panelBg).setStrokeStyle(1, C.border);
        this.add.text(560, 532, 'ASHWAKE BELT — AVAILABLE SITES', {
            fontFamily: 'Arial Black', fontSize: 14, color: C.textWarn, align: 'center',
        }).setOrigin(0.5);

        this.add.text(560, 556, '◆ Shalehook Dig Site  ·  Tier 1  ·  Rogue Automation', {
            fontFamily: 'Arial', fontSize: 13, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5);

        const launchBtn = this.add.text(560, 582, '[ LAUNCH TO SHALEHOOK ]', {
            fontFamily: 'Arial Black', fontSize: 16, color: C.btnNormal, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        launchBtn.on('pointerover', () => launchBtn.setColor(C.btnHover));
        launchBtn.on('pointerout', () => launchBtn.setColor(C.btnNormal));
        launchBtn.on('pointerdown', () => this.launchToAshwake());

        // Ship status bar at bottom
        this.add.rectangle(512, 748, 1024, 1, C.border);
        this.add.rectangle(512, 758, 1024, 20, C.panelBg);

        const hullPct = gs.shipHull / gs.shipMaxHull;
        const fuelPct = gs.shipFuel / gs.shipMaxFuel;
        this.add.text(20, 750, `CUTTER Mk.I   HULL: ${gs.shipHull}/${gs.shipMaxHull}  FUEL: ${gs.shipFuel}/${gs.shipMaxFuel}   CREDITS: ${gs.credits}c`, {
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

    private launchToAshwake() {
        const gs = GameState.get();

        if (gs.shipFuel < 2) {
            this.showWarning('NOT ENOUGH FUEL — Refuel at Meridian Services before launching.');
            return;
        }

        GameState.launchDungeon('shalehook-dig-site');
        this.scene.start('Dungeon');
    }

    private showRelayLockedMessage() {
        const existing = this.children.getByName('relay-msg');
        if (existing) return;

        const panel = this.add.container(512, 300);
        panel.setName('relay-msg');

        panel.add(this.add.rectangle(0, 0, 620, 150, C.panelBg).setStrokeStyle(1, C.border));
        panel.add(this.add.text(0, -44, 'VOID RELAY 7-9 — LOCKED', {
            fontFamily: 'Arial Black', fontSize: 18, color: C.textDanger, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, -10, 'Your current ship is not relay-capable.', {
            fontFamily: 'Arial', fontSize: 14, color: C.textPrimary, align: 'center',
        }).setOrigin(0.5));
        panel.add(this.add.text(0, 14, 'Upgrade to a Meridian Hauler II or better to access Relay travel.', {
            fontFamily: 'Arial', fontSize: 13, color: C.textSecond, align: 'center',
        }).setOrigin(0.5));

        const close = this.add.text(0, 50, '[ DISMISS ]', {
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
