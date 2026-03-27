/**
 * AsciiGridState — Manages player position, movement, line-of-sight, and
 * tile-based enemy aggro within an ASCII room grid.
 *
 * This module provides the logic layer for Phase C: movement inside rooms.
 * It tracks:
 *   - Player position (@) on the grid
 *   - Enemy positions and aggro ranges
 *   - Line-of-sight (LOS) from player to any tile
 *   - Fog of war (tiles not yet seen)
 *   - Pathfinding for tap-to-move
 */

// ── Grid cell types ──────────────────────────────────────────────────────────

/** Whether a cell blocks movement / LOS. */
function isBlocking(ch: string): boolean {
    return ch === '#' || ch === ' ';
}

/** Whether a cell blocks movement but not LOS (e.g. doors when closed). */
function isPassable(ch: string): boolean {
    return !isBlocking(ch);
}

// ── Coordinate types ─────────────────────────────────────────────────────────

export interface GridPos {
    row: number;
    col: number;
}

export interface EnemyOnGrid {
    id: string;
    symbol: string;
    pos: GridPos;
    /** How many tiles away the enemy detects the player (Manhattan distance). */
    aggroRange: number;
    /** Whether the enemy is currently aggro'd on the player. */
    aggrod: boolean;
}

// ── Grid state ───────────────────────────────────────────────────────────────

export class AsciiGridState {
    /** The mutable grid (array of character arrays). */
    readonly grid: string[][];
    readonly rows: number;
    readonly cols: number;

    /** Current player position. */
    playerPos: GridPos;

    /** Enemies placed on the grid. */
    enemies: EnemyOnGrid[];

    /** Fog of war — true = revealed. Indexed [row][col]. */
    revealed: boolean[][];

    constructor(asciiMap: string[], playerStart?: GridPos) {
        this.grid = asciiMap.map(row => [...row]);
        this.rows = this.grid.length;
        this.cols = Math.max(...this.grid.map(r => r.length));

        // Pad short rows
        for (let r = 0; r < this.rows; r++) {
            while (this.grid[r].length < this.cols) {
                this.grid[r].push(' ');
            }
        }

        // Find player position from grid or use provided start
        this.playerPos = playerStart ?? { row: 0, col: 0 };
        if (!playerStart) {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.grid[r][c] === '@') {
                        this.playerPos = { row: r, col: c };
                    }
                }
            }
        }

        // Initialize fog of war — all hidden
        this.revealed = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => false),
        );

        this.enemies = [];

        // Initial LOS reveal
        this.updateVisibility();
    }

    // ── Movement ─────────────────────────────────────────────────────────

    /**
     * Attempt to move the player to target position.
     * Returns true if movement succeeded.
     */
    movePlayer(target: GridPos): boolean {
        if (!this.isInBounds(target)) return false;
        if (!isPassable(this.grid[target.row][target.col])) return false;

        // Check if target is occupied by an enemy
        if (this.enemies.some(e => e.pos.row === target.row && e.pos.col === target.col)) {
            return false;
        }

        // Clear old position
        this.grid[this.playerPos.row][this.playerPos.col] = '.';

        // Move
        this.playerPos = { ...target };
        this.grid[target.row][target.col] = '@';

        // Update visibility and aggro
        this.updateVisibility();
        this.updateAggro();

        return true;
    }

    /**
     * Find a path from player to target using BFS.
     * Returns the sequence of positions (excluding current), or empty if unreachable.
     */
    findPath(target: GridPos): GridPos[] {
        if (!this.isInBounds(target) || !isPassable(this.grid[target.row][target.col])) {
            return [];
        }

        const start = this.playerPos;
        if (start.row === target.row && start.col === target.col) return [];

        const visited = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => false),
        );
        const parent = new Map<string, GridPos | null>();
        const queue: GridPos[] = [start];
        visited[start.row][start.col] = true;
        parent.set(`${start.row},${start.col}`, null);

        const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        while (queue.length > 0) {
            const curr = queue.shift()!;
            if (curr.row === target.row && curr.col === target.col) {
                // Reconstruct path
                const path: GridPos[] = [];
                let pos: GridPos | null = target;
                while (pos && !(pos.row === start.row && pos.col === start.col)) {
                    path.unshift(pos);
                    pos = parent.get(`${pos.row},${pos.col}`) ?? null;
                }
                return path;
            }

            for (const [dr, dc] of dirs) {
                const nr = curr.row + dr;
                const nc = curr.col + dc;
                if (this.isInBounds({ row: nr, col: nc }) && !visited[nr][nc]) {
                    const ch = this.grid[nr][nc];
                    // Can walk through floor, doors, corridors, items, player spawn
                    if (isPassable(ch) && !this.enemies.some(e => e.pos.row === nr && e.pos.col === nc)) {
                        visited[nr][nc] = true;
                        parent.set(`${nr},${nc}`, curr);
                        queue.push({ row: nr, col: nc });
                    }
                }
            }
        }

        return []; // Unreachable
    }

    // ── Line of Sight ────────────────────────────────────────────────────

    /**
     * Check if there is a clear line of sight from `from` to `to`.
     * Uses Bresenham's line algorithm.
     */
    hasLineOfSight(from: GridPos, to: GridPos): boolean {
        let x0 = from.col;
        let y0 = from.row;
        const x1 = to.col;
        const y1 = to.row;

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            // Check current position (skip start tile)
            if (!(x0 === from.col && y0 === from.row)) {
                if (x0 === x1 && y0 === y1) return true; // Reached target
                if (isBlocking(this.grid[y0]?.[x0] ?? '#')) return false;
            }

            if (x0 === x1 && y0 === y1) break;

            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx)  { err += dx; y0 += sy; }
        }

        return true;
    }

    /**
     * Update fog of war based on player position.
     * Reveals all tiles within LOS range (default 8 tiles).
     */
    updateVisibility(range = 8): void {
        const { row: pr, col: pc } = this.playerPos;

        for (let r = Math.max(0, pr - range); r <= Math.min(this.rows - 1, pr + range); r++) {
            for (let c = Math.max(0, pc - range); c <= Math.min(this.cols - 1, pc + range); c++) {
                if (this.hasLineOfSight(this.playerPos, { row: r, col: c })) {
                    this.revealed[r][c] = true;
                }
            }
        }
    }

    // ── Enemy aggro ──────────────────────────────────────────────────────

    /**
     * Add an enemy to the grid state.
     */
    addEnemy(id: string, symbol: string, pos: GridPos, aggroRange = 5): void {
        this.enemies.push({ id, symbol, pos, aggroRange, aggrod: false });
    }

    /**
     * Update aggro state for all enemies based on Manhattan distance and LOS to player.
     */
    updateAggro(): void {
        for (const enemy of this.enemies) {
            const dist = Math.abs(enemy.pos.row - this.playerPos.row) +
                         Math.abs(enemy.pos.col - this.playerPos.col);
            if (dist <= enemy.aggroRange && this.hasLineOfSight(enemy.pos, this.playerPos)) {
                enemy.aggrod = true;
            }
        }
    }

    /**
     * Get all currently aggro'd enemies.
     */
    getAggrodEnemies(): EnemyOnGrid[] {
        return this.enemies.filter(e => e.aggrod);
    }

    // ── Utilities ────────────────────────────────────────────────────────

    private isInBounds(pos: GridPos): boolean {
        return pos.row >= 0 && pos.row < this.rows && pos.col >= 0 && pos.col < this.cols;
    }

    /**
     * Get the character at a grid position.
     */
    getCell(pos: GridPos): string {
        if (!this.isInBounds(pos)) return '#';
        return this.grid[pos.row][pos.col];
    }

    /**
     * Convert the current grid state back to string array format.
     */
    toAsciiMap(): string[] {
        return this.grid.map(row => row.join(''));
    }
}
