import { LevelData } from './game-engine';

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

  setBlock(x: number, y: number): void {
    this.setCell(x, y, 'S');
  }

  clearCell(x: number, y: number): void {
    this.setCell(x, y, '.');
  }

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
