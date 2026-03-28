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
            if (AsciiGridState.manhattanDist(enemy.pos, this.playerPos) <= enemy.aggroRange
                && this.hasLineOfSight(enemy.pos, this.playerPos)) {
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

    /**
     * Returns true if the player is currently adjacent (4-directional) to a wall tile.
     * Used to grant the cover damage-reduction bonus in combat.
     */
    isInCover(): boolean {
        const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dr, dc] of dirs) {
            const r = this.playerPos.row + dr;
            const c = this.playerPos.col + dc;
            if (this.isInBounds({ row: r, col: c }) && this.grid[r][c] === '#') {
                return true;
            }
        }
        return false;
    }

    /**
     * Move a specific enemy one step toward the player using BFS pathfinding.
     * The enemy will not step onto the player's tile or onto another enemy.
     * Returns true if the enemy moved.
     */
    stepEnemyToward(enemyId: string): boolean {
        const enemy = this.enemies.find(e => e.id === enemyId);
        if (!enemy) return false;

        const target = this.playerPos;
        const start = enemy.pos;

        // Already adjacent — no need to move closer
        const dist = Math.abs(start.row - target.row) + Math.abs(start.col - target.col);
        if (dist <= 1) return false;

        // BFS from enemy to player to find the shortest path
        const visited = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => false),
        );
        const parent = new Map<string, GridPos | null>();
        const queue: GridPos[] = [start];
        visited[start.row][start.col] = true;
        parent.set(`${start.row},${start.col}`, null);

        const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let found = false;

        outer: while (queue.length > 0) {
            const curr = queue.shift()!;
            for (const [dr, dc] of dirs) {
                const nr = curr.row + dr;
                const nc = curr.col + dc;
                const key = `${nr},${nc}`;
                if (!this.isInBounds({ row: nr, col: nc }) || visited[nr][nc]) continue;
                visited[nr][nc] = true;
                parent.set(key, curr);
                if (nr === target.row && nc === target.col) { found = true; break outer; }
                const ch = this.grid[nr][nc];
                if (isPassable(ch) &&
                    !this.enemies.some(e => e.id !== enemyId && e.pos.row === nr && e.pos.col === nc)
                ) {
                    queue.push({ row: nr, col: nc });
                }
            }
        }

        if (!found) return false;

        // Trace back from target to find the first step after start
        let step: GridPos = target;
        let prev = parent.get(`${target.row},${target.col}`) ?? null;
        while (prev && !(prev.row === start.row && prev.col === start.col)) {
            step = prev;
            prev = parent.get(`${prev.row},${prev.col}`) ?? null;
        }
        if (!prev) return false; // Path reconstruction failed

        // Never actually step onto the player's tile
        if (step.row === target.row && step.col === target.col) return false;

        // Move the enemy on the grid
        this.grid[enemy.pos.row][enemy.pos.col] = '.';
        enemy.pos = { ...step };
        this.grid[step.row][step.col] = enemy.symbol;

        return true;
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
     * Manhattan distance between two grid positions.
     */
    static manhattanDist(a: GridPos, b: GridPos): number {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    /**
     * Convert the current grid state back to string array format.
     */
    toAsciiMap(): string[] {
        return this.grid.map(row => row.join(''));
    }
}
