import { LevelData } from './game-engine';

/**
 * In-memory level designer backed by a grid of characters. The grid uses:
 * - `S` for solid blocks
 * - `P` for player spawn
 * - `G` for the level goal
 * - `E` for enemy spawns
 * - `.` for empty space
 */
export class LevelDesigner {
  private grid: string[];
  constructor(private width: number, private height: number) {
    this.grid = Array.from({ length: height }, () => '.'.repeat(width));
  }

  /** Mark a cell as a solid block. */
  setBlock(x: number, y: number): void {
    this.setCell(x, y, 'S');
  }

  /** Remove any object from a cell. */
  clearCell(x: number, y: number): void {
    this.setCell(x, y, '.');
  }

  /** Set the player spawn position, clearing any previous spawn. */
  setSpawn(x: number, y: number): void {
    this.clearAll('P');
    this.setCell(x, y, 'P');
  }

  /** Set the goal position, clearing any previous goal. */
  setGoal(x: number, y: number): void {
    this.clearAll('G');
    this.setCell(x, y, 'G');
  }

  /** Add an enemy spawn point at the given cell. */
  addEnemy(x: number, y: number): void {
    this.setCell(x, y, 'E');
  }

  private setCell(x: number, y: number, ch: string): void {
    const row = this.grid[y].split('');
    row[x] = ch;
    this.grid[y] = row.join('');
  }

  private clearAll(ch: string): void {
    for (let y = 0; y < this.height; y++) {
      this.grid[y] = this.grid[y].replace(ch, '.');
    }
  }

  /** Build a {@link LevelData} object by scanning the grid for special cells. */
  build(): LevelData {
    const data: LevelData = {
      width: this.width,
      height: this.height,
      grid: this.grid.slice()
    } as LevelData;

    const enemies: { x: number; y: number }[] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const ch = this.grid[y][x];
        if (ch === 'P') data.spawn = { x, y };
        else if (ch === 'G') data.goal = { x, y };
        else if (ch === 'E') enemies.push({ x, y });
      }
    }
    if (enemies.length > 0) data.enemies = enemies;
    return data;
  }
}
