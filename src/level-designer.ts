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
  private theme?: string;
  private palette: {
    background?: string;
    primary?: string;
    accent?: string;
  } = {};
  constructor(
    private width: number,
    private height: number,
    grid?: string[]
  ) {
    if (grid) {
      if (grid.length !== height)
        throw new Error('Grid height mismatch');
      if (grid.some((row) => row.length !== width))
        throw new Error('Grid width mismatch');
      this.grid = grid.slice();
    } else {
      this.grid = Array.from({ length: height }, () => '.'.repeat(width));
    }
  }

  /** Create a designer pre-populated from existing {@link LevelData}. */
  static fromData(data: LevelData): LevelDesigner {
    const designer = new LevelDesigner(data.width, data.height, data.grid);
    if (data.theme) designer.setTheme(data.theme);
    if (data.palette) designer.setPalette(data.palette);
    return designer;
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

  /** Set the theme name for the level. */
  setTheme(theme: string): void {
    this.theme = theme;
  }

  /** Update the color palette for the level. */
  setPalette(palette: {
    background?: string;
    primary?: string;
    accent?: string;
  }): void {
    this.palette = { ...this.palette, ...palette };
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

    if (this.theme) data.theme = this.theme;
    if (this.palette.background || this.palette.primary || this.palette.accent)
      data.palette = { ...this.palette };

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
