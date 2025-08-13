import * as pc from 'playcanvas';
import { initAmmo, createApp } from './game-engine';
import levelData from '../levels/level1.json';
import { validateLevel, loadLevel, LevelData } from './level-loader';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

async function main() {
  await initAmmo();
  const app = createApp(canvas);

  if (!app.systems.rigidbody) {
    console.error('RigidBody system missing');
    return;
  }

  const level = levelData as LevelData;
  const errors = validateLevel(level);
  if (errors.length) {
    console.error('Invalid level', errors);
    return;
  }

  loadLevel(app, level);
}

main();
