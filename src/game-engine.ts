import * as pc from 'playcanvas';
import playerModelUrl from './player.glb?url';

export async function initAmmo(): Promise<void> {
  pc.WasmModule.setConfig('Ammo', {
    glueUrl: '/ammo.wasm.js',
    wasmUrl: '/ammo.wasm.wasm',
    fallbackUrl: '/ammo.js'
  });

  await new Promise<void>((resolve) => {
    pc.WasmModule.getInstance('Ammo', () => resolve());
  });
}

export function createApp(canvas: HTMLCanvasElement): pc.Application {
  const app = new pc.Application(canvas, {
    elementInput: new pc.ElementInput(canvas),
    keyboard: new pc.Keyboard(window),
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas)
  });

  app.start();
  return app;
}

async function loadGlb(app: pc.Application, url: string): Promise<pc.Entity> {
  return await new Promise((resolve, reject) => {
    app.assets.loadFromUrl(url, 'container', (err, asset) => {
      if (err || !asset) {
        reject(err);
        return;
      }
      const entity = (asset as pc.Asset).resource.instantiateRenderEntity();
      resolve(entity);
    });
  });
}

export interface LevelData {
  width: number;
  height: number;
  grid: string[];
  spawn?: { x: number; y: number };
  goal?: { x: number; y: number };
  enemies?: { x: number; y: number }[];
  palette?: { background?: string; primary?: string; accent?: string };
  theme?: string;
  skybox?: { url: string; source: string };
  meta?: Record<string, unknown>;
}

export function buildLevel(
  app: pc.Application,
  level: LevelData
): { spawn: pc.Vec3; goal: pc.Entity; enemies: pc.Vec3[] } {
  const cellSize = 1;
  const offsetX = -(level.width * cellSize) / 2 + cellSize / 2;
  const offsetZ = -(level.height * cellSize) / 2 + cellSize / 2;

  const enemies: pc.Vec3[] = [];
  let spawnPos: pc.Vec3 | null = null;
  let goal: pc.Entity | null = null;

  for (let y = 0; y < level.height; y++) {
    const row = level.grid[y];
    for (let x = 0; x < level.width; x++) {
      const ch = row[x];
      const worldPos = new pc.Vec3(
        offsetX + x * cellSize,
        cellSize / 2,
        offsetZ + y * cellSize
      );
      switch (ch) {
        case 'S': {
          const block = new pc.Entity(`block-${x}-${y}`);
          block.addComponent('render', { type: 'box' });
          block.addComponent('collision', { type: 'box' });
          block.addComponent('rigidbody', { type: 'static' });
          block.setLocalScale(cellSize, cellSize, cellSize);
          block.setLocalPosition(worldPos);
          app.root.addChild(block);
          break;
        }
        case 'P':
          spawnPos = worldPos.clone();
          break;
        case 'G':
          goal = new pc.Entity('goal');
          goal.addComponent('render', { type: 'box' });
          goal.setLocalScale(cellSize, cellSize, cellSize);
          goal.setLocalPosition(worldPos);
          app.root.addChild(goal);
          break;
        case 'E':
          enemies.push(worldPos.clone());
          break;
      }
    }
  }

  if (!spawnPos && level.spawn) {
    spawnPos = new pc.Vec3(
      offsetX + level.spawn.x * cellSize,
      cellSize / 2,
      offsetZ + level.spawn.y * cellSize
    );
  }
  if (!goal && level.goal) {
    goal = new pc.Entity('goal');
    goal.addComponent('render', { type: 'box' });
    goal.setLocalScale(cellSize, cellSize, cellSize);
    goal.setLocalPosition(
      offsetX + level.goal.x * cellSize,
      cellSize / 2,
      offsetZ + level.goal.y * cellSize
    );
    app.root.addChild(goal);
  }
  if (level.enemies) {
    for (const e of level.enemies) {
      enemies.push(
        new pc.Vec3(
          offsetX + e.x * cellSize,
          cellSize / 2,
          offsetZ + e.y * cellSize
        )
      );
    }
  }

  if (!spawnPos || !goal) {
    throw new Error('Level is missing spawn or goal');
  }

  return { spawn: spawnPos, goal, enemies };
}

export async function createPlayer(
  app: pc.Application,
  position: pc.Vec3
): Promise<pc.Entity> {
  const player = await loadGlb(app, playerModelUrl);
  player.name = 'player';
  player.addComponent('collision', { type: 'box' });
  player.addComponent('rigidbody', { mass: 1 });
  player.setLocalPosition(position);
  app.root.addChild(player);
  return player;
}

export function createEnemy(
  app: pc.Application,
  position: pc.Vec3
): pc.Entity {
  const mat = new pc.StandardMaterial();
  mat.diffuse.set(1, 0, 0);
  mat.update();
  const enemy = new pc.Entity('enemy');
  enemy.addComponent('render', { type: 'capsule', material: mat });
  enemy.addComponent('collision', { type: 'capsule', radius: 0.25, height: 1 });
  enemy.addComponent('rigidbody', { type: 'kinematic' });
  enemy.setLocalPosition(position);
  app.root.addChild(enemy);
  return enemy;
}
