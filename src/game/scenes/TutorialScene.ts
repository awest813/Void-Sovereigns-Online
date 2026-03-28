import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameState } from '../state/GameState';
import { T } from '../ui/UITheme';
import { DebugPanel } from '../ui/DebugPanel';

// Scene colour aliases — sourced from shared UITheme.
const C = T;

// ── Tutorial step definitions ────────────────────────────────────────────────
interface TutorialStep {
    title: string;
    subtitle: string;
    body: string[];
    // Optional detail blocks shown as a bulleted list below the body.
    bullets?: string[];
    // Optional footer note (italicised).
    note?: string;
}

const STEPS: TutorialStep[] = [
    {
        title:    'WELCOME, PILOT',
        subtitle: 'New-recruit briefing — Meridian Station, Ashwake Belt',
        body: [
            'You are a freelance pilot operating out of Meridian Station in the Ashwake',
            'Belt — a dying industrial sector far from the core. Work is scarce.',
            'The Void Relays went dark two years ago. Nobody came to fix them.',
            '',
            'You have a ship, a small stack of credits, and a contract board full of jobs',
            'nobody else wants to take. That is where you start.',
            '',
            'Your long-term goal: earn enough credits to upgrade your ship and transit',
            'through Void Relay 7-9 — the last relay still responding — to reach',
            'Farpoint Waystation and whatever waits beyond it.',
        ],
        note: '"Thirty ships a day, once. Now eight. The Relays went out and everyone forgot we existed."',
    },
    {
        title:    'MERIDIAN STATION',
        subtitle: 'Your base of operations — the Hub',
        body: [
            'After every run you dock here. The Hub has several panels:',
        ],
        bullets: [
            'CONTRACT BOARD — Accept jobs. Completed jobs pay credits and XP.',
            'SERVICES         — Repair pilot HP and ship hull · Buy supplies · Sell salvage.',
            'SECTOR MAP       — Launch to dungeon sites in the Belt.',
            'SHIPYARD         — Upgrade your Cutter or buy a relay-capable ship.',
            'SHIP STATUS      — Track your relay goal progress.',
            'STATION CONTACTS — Talk to the locals for lore and faction info.',
            'CODEX            — Lore entries unlocked by completing contracts.',
        ],
        note: 'Start with the Contract Board — accept a job, then hit the Sector Map.',
    },
    {
        title:    'CONTRACTS',
        subtitle: 'The work — how you earn credits and progress',
        body: [
            'Contracts are the core progression loop. Open the Contract Board and',
            'accept a job. Each contract has a tier, a category, and a reward.',
            '',
            'The starter jobs send you to Shalehook Dig Site — a Tier 1 site in the',
            'Ashwake Belt. Clear the dungeon, then return here and TURN IN the contract',
            'for your credits and XP reward.',
            '',
            'Reputation — completing faction contracts raises your standing and',
            'unlocks higher-tier work over time.',
        ],
        bullets: [
            '⚠ REDLINE contracts — high-risk runs. Death costs you field gear.',
            '     Avoid Redline runs until you are well-supplied and confident.',
        ],
        note: 'Hint: hover over [ ▶ DETAILS ] to read the full contract brief before accepting.',
    },
    {
        title:    'SECTOR MAP  ·  DUNGEONS',
        subtitle: 'Launch to a site and work through its rooms',
        body: [
            'Open the Sector Map from the Hub. Click [ LAUNCH ] next to a site to deploy.',
            'Each launch costs 2 FUEL. Refuel at Services if needed (it\'s cheap).',
            '',
            'Dungeons are a sequence of rooms:',
        ],
        bullets: [
            'ENTRANCE / TRANSITION — advance to the next room.',
            'COMBAT room           — fight the enemy, then loot the remains.',
            'LOOT room             — search for salvage. Hidden caches appear sometimes.',
            'HAZARD room           — take environmental damage for a loot reward, or bypass.',
            'BOSS room             — the final target. Clear this to complete the site.',
            '── ASCII MAP ──  green tiles = click to move  ·  cyan tiles = click to interact.',
            '                 Fog-of-war lifts as you explore each room.',
        ],
        note: 'You can RETREAT at any time — you keep loot and credits, but lose 50 % of earned XP.',
    },
    {
        title:    'COMBAT',
        subtitle: 'Turn-based — one action per round',
        body: [
            'Each combat round you choose one action. The enemy responds immediately.',
        ],
        bullets: [
            'ATTACK      — Deal damage. 10 % chance of a critical hit (×1.5 damage).',
            'DODGE       — Reduce incoming damage by ~65 %. 15 % chance of full evasion.',
            'MED KIT     — Restore 35 pilot HP. Use when below 50 %.',
            'REPAIR KIT  — Restore 30 ship hull. Check the header bar.',
            'SCAN TARGET — Reveal enemy stats. Unlocks EXPLOIT SCAN DATA (+60 % damage, free hit).',
            'NANO-REPAIR — 10 HP regen per turn for 3 turns. Stack with attacks.',
            'COMBAT STIM — +50 % attack for 2 turns. Burst down tough enemies.',
            'ANOMALY KIT — Cancel an enemy special attack mid-charge. Keep one handy.',
            'REPOSITION  — Move on the ASCII grid during combat (range 2). Enemy counterattacks.',
            'RETREAT     — Leave the dungeon. Loot kept; 50 % XP penalty.',
            '── COVER ──  Standing adjacent to a wall (█) reduces incoming damage by 15 %.',
            '── STATUS ── 🔥 Burning deals damage/turn  ·  ⚡ Disrupted cuts ATK  ·  💚 Regen heals/turn.',
        ],
        note: 'Momentum: 3 attacks in a row without taking damage adds +25 % damage. Watch the ⚡ indicator.',
    },
    {
        title:    'READY, PILOT',
        subtitle: 'You\'re briefed. Time to work.',
        body: [
            'Quick checklist before your first run:',
            '',
            '  1.  Open CONTRACT BOARD — accept "Scrap Recovery — Shalehook" or any Tier 1 job.',
            '  2.  Check SERVICES — you start with a Medical Kit and Repair Kit. That\'s enough.',
            '  3.  Open SECTOR MAP — launch to Shalehook Dig Site.',
            '  4.  Work through the rooms. Attack enemies. Use items when HP drops below 40 %.',
            '  5.  Return to the Hub and TURN IN your contract for the reward.',
            '',
            'Complete enough contracts to buy a relay-capable ship or install the Nav Computer',
            'and Drift Drive upgrade at the Shipyard. Once relay-capable, transit Void Relay 7-9',
            'and reach Farpoint Waystation to continue the frontier campaign.',
            '',
            'Good luck out there.',
        ],
    },
];

// ── TutorialScene ────────────────────────────────────────────────────────────
export class TutorialScene extends Scene {
    private stepIndex = 0;
    private debugPanel?: DebugPanel;
    private sceneChanging = false;

    // Containers rebuilt on each step change.
    private titleText!: Phaser.GameObjects.Text;
    private subtitleText!: Phaser.GameObjects.Text;
    private bodyContainer!: Phaser.GameObjects.Container;
    private navContainer!: Phaser.GameObjects.Container;
    private stepIndicator!: Phaser.GameObjects.Text;

    constructor() {
        super('Tutorial');
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        const cx = w / 2;

        this.cameras.main.setBackgroundColor(C.bg);

        // Subtle starfield
        for (let i = 0; i < 70; i++) {
            this.add.rectangle(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                1, 1, 0xffffff,
            ).setAlpha(0.07 + Math.random() * 0.15);
        }

        // Outer panel frame
        this.add.rectangle(cx, h / 2, 920, 680, C.panelBg).setStrokeStyle(1, C.border);

        // Top decoration bar
        this.add.rectangle(cx, 68, 920, 2, C.border);

        // Scene header
        this.add.text(cx, 30, 'VOID SOVEREIGNS ONLINE — PILOT BRIEFING', {
            fontFamily: 'Arial Black', fontSize: 13, color: C.textSecond, align: 'center',
        }).setOrigin(0.5);

        // Separator under header
        this.add.rectangle(cx, 76, 860, 1, C.borderFaint);

        // Title text (updated per step)
        this.titleText = this.add.text(cx, 116, '', {
            fontFamily: 'Arial Black', fontSize: 26, color: C.textPrimary,
            stroke: '#000000', strokeThickness: 4, align: 'center',
        }).setOrigin(0.5);

        // Subtitle text
        this.subtitleText = this.add.text(cx, 154, '', {
            fontFamily: 'Arial', fontSize: 14, color: C.textAccent, align: 'center',
        }).setOrigin(0.5);

        // Divider under title
        this.add.rectangle(cx, 172, 860, 1, C.borderFaint);

        // Body container (cleared and rebuilt on each step)
        this.bodyContainer = this.add.container(0, 0);

        // Step indicator
        this.stepIndicator = this.add.text(cx, 672, '', {
            fontFamily: 'Arial', fontSize: 12, color: C.textMuted, align: 'center',
        }).setOrigin(0.5);

        // Navigation container (prev / skip / next)
        this.navContainer = this.add.container(0, 0);

        // SKIP button (always visible, top-right corner)
        const skipBtn = this.add.text(w - 40, 20, '[ SKIP ]', {
            fontFamily: 'Arial', fontSize: 13, color: C.textMuted, align: 'right',
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
        skipBtn.on('pointerover', () => skipBtn.setColor(C.btnHover));
        skipBtn.on('pointerout',  () => skipBtn.setColor(C.textMuted));
        skipBtn.on('pointerdown', () => this.finishTutorial());

        this.debugPanel = new DebugPanel(this);

        this.renderStep(0);

        EventBus.emit('current-scene-ready', this);
    }

    // ── Step rendering ────────────────────────────────────────────────────
    private renderStep(index: number) {
        this.stepIndex = index;
        const step = STEPS[index];
        const cx = this.scale.width / 2;
        const isLast = index === STEPS.length - 1;

        // Update title and subtitle
        this.titleText.setText(step.title);
        this.subtitleText.setText(step.subtitle);

        // Rebuild body
        this.bodyContainer.removeAll(true);

        let y = 190;
        const lineH = 20;
        const bulletH = 22;

        // Body lines — empty strings act as vertical spacers; skip creating a text object for them.
        for (const line of step.body) {
            if (line === '') {
                y += Math.floor(lineH * 0.6);
                continue;
            }
            this.bodyContainer.add(this.add.text(82, y, line, {
                fontFamily: 'Arial', fontSize: 14, color: C.textPrimary,
                wordWrap: { width: 860 }, lineSpacing: 3,
            }));
            y += lineH;
        }

        // Bullets
        if (step.bullets && step.bullets.length > 0) {
            y += 6;
            for (const bullet of step.bullets) {
                const indented = bullet.startsWith('   ') || bullet.startsWith('  ');
                const x = indented ? 118 : 98;
                const color = bullet.startsWith('⚠') ? C.textWarn : C.textAccent;
                this.bodyContainer.add(this.add.text(x, y, bullet.trim(), {
                    fontFamily: 'Arial', fontSize: 13, color,
                    wordWrap: { width: indented ? 820 : 840 },
                }));
                y += bulletH;
            }
        }

        // Footer note
        if (step.note) {
            y += 10;
            this.bodyContainer.add(this.add.rectangle(cx, y + 12, 860, 1, C.borderFaint));
            y += 24;
            this.bodyContainer.add(this.add.text(cx, y, `"${step.note}"`, {
                fontFamily: 'Arial', fontSize: 12, color: C.textSecond,
                fontStyle: 'italic', align: 'center', wordWrap: { width: 820 },
            }).setOrigin(0.5, 0));
        }

        // Step indicator  e.g. "1 / 6"
        this.stepIndicator.setText(`${index + 1} / ${STEPS.length}`);

        // Rebuild nav buttons
        this.navContainer.removeAll(true);

        // PREV button
        if (index > 0) {
            const prevBtn = this.add.text(160, 700, '[ ← PREVIOUS ]', {
                fontFamily: 'Arial Black', fontSize: 15, color: C.textSecond, align: 'center',
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            prevBtn.on('pointerover', () => prevBtn.setColor(C.btnHover));
            prevBtn.on('pointerout',  () => prevBtn.setColor(C.textSecond));
            prevBtn.on('pointerdown', () => this.renderStep(index - 1));
            this.navContainer.add(prevBtn);
        }

        // NEXT or FINISH button
        if (isLast) {
            const finishBtn = this.add.text(cx, 700, '[ BEGIN — MERIDIAN STATION ]', {
                fontFamily: 'Arial Black', fontSize: 18, color: C.textAccent, align: 'center',
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            finishBtn.on('pointerover', () => finishBtn.setColor(C.btnHover));
            finishBtn.on('pointerout',  () => finishBtn.setColor(C.textAccent));
            finishBtn.on('pointerdown', () => this.finishTutorial());
            this.navContainer.add(finishBtn);
        } else {
            const nextBtn = this.add.text(cx + 100, 700, '[ NEXT → ]', {
                fontFamily: 'Arial Black', fontSize: 18, color: C.textWarn, align: 'center',
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            nextBtn.on('pointerover', () => nextBtn.setColor(C.btnHover));
            nextBtn.on('pointerout',  () => nextBtn.setColor(C.textWarn));
            nextBtn.on('pointerdown', () => this.renderStep(index + 1));
            this.navContainer.add(nextBtn);
        }
    }

    private finishTutorial() {
        if (this.sceneChanging) return;
        this.sceneChanging = true;
        GameState.markTutorialSeen();
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('Hub');
        });
    }
}
