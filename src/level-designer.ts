import { LevelData } from './game-engine';

/**
 * Simple in-memory level designer that lets callers mark cells and export a
 * {@link LevelData} object. The grid uses the following characters:
 * - `S` for solid blocks
 * - `P` for player spawn
 * - `G` for the level goal
 * - `E` for enemy spawns
 * - `.` for empty space
 */
export class LevelDesigner {
  private width: number;
  private height: number;
  private grid: string[];
  private spawn = { x: 0, y: 0 };
  private goal = { x: 0, y: 0 };
  private enemies: { x: number; y: number }[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
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

  /** Set the player spawn position. */
  setSpawn(x: number, y: number): void {
    this.setCell(x, y, 'P');
  }

  /** Set the goal position. */
  setGoal(x: number, y: number): void {
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

  /**
   * Build a {@link LevelData} object by scanning the grid for special cells.
   */
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
  private setCell(x: number, y: number, ch: string): void {
    const row = this.grid[y].split('');
    row[x] = ch;
    this.grid[y] = row.join('');
  }

  setSpawn(x: number, y: number): void {
    this.spawn = { x, y };
  }

  setGoal(x: number, y: number): void {
    this.goal = { x, y };
  }

  addEnemy(x: number, y: number): void {
    this.enemies.push({ x, y });
  }

  build(): LevelData {
    return {
      width: this.width,
      height: this.height,
      grid: this.grid,
      spawn: this.spawn,
      goal: this.goal,
      enemies: this.enemies
    };
  }
}
