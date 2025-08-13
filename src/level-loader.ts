import * as pc from 'playcanvas';

export interface LevelData {
  id: string;
  name: string;
  width: number;
  height: number;
  grid: string[];
  theme: string;
  palette: {
    background: string;
    primary: string;
    accent: string;
  };
  skybox: {
    url: string;
    source: 'imagen' | 'user';
    prompt?: string;
  };
  spawn: { x: number; y: number };
  goal: { x: number; y: number };
  entities: {
    type: string;
    x: number;
    y: number;
    params?: Record<string, unknown>;
  }[];
  meta: {
    difficulty: 'easy' | 'medium' | 'hard';
    version: number;
  };
}

export function validateLevel(level: LevelData): string[] {
  const errors: string[] = [];
  if (level.grid.length !== level.height) {
    errors.push('Grid height mismatch');
  }
  for (const row of level.grid) {
    if (row.length !== level.width) {
      errors.push('Grid width mismatch');
      break;
    }
  }
  const flat = level.grid.join('');
  if (!flat.includes('P')) errors.push('Missing player start');
  if (!flat.includes('G')) errors.push('Missing goal');
  return errors;
}

export function loadLevel(app: pc.Application, level: LevelData) {
  const size = 1;
  let player: pc.Entity | null = null;
  let goal: pc.Entity | null = null;

  for (let y = 0; y < level.height; y++) {
    const row = level.grid[y];
    for (let x = 0; x < level.width; x++) {
      const tile = row[x];
      const position = new pc.Vec3(x * size, 0, y * size);
      switch (tile) {
        case 'S': {
          const platform = new pc.Entity('platform');
          platform.addComponent('render', { type: 'box' });
          platform.addComponent('rigidbody', { type: 'static' });
          platform.setLocalPosition(position);
          app.root.addChild(platform);
          break;
        }
        case 'P': {
          player = new pc.Entity('player');
          player.addComponent('render', { type: 'box' });
          player.addComponent('rigidbody', { mass: 1 });
          player.setLocalPosition(position.clone().add(pc.Vec3.UP));
          app.root.addChild(player);
          break;
        }
        case 'G': {
          goal = new pc.Entity('goal');
          goal.addComponent('render', { type: 'box' });
          goal.setLocalPosition(position);
          app.root.addChild(goal);
          break;
        }
        default:
          break;
      }
    }
  }

  if (!player || !goal) {
    throw new Error('Level missing player or goal');
  }

  return { player, goal };
}
