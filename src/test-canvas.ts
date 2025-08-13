import * as pc from 'playcanvas';
import {
  initAmmo,
  createApp,
  buildLevel,
  createPlayer,
  createEnemy,
  LevelData
} from './game-engine';
import { LevelDesigner } from './level-designer';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

async function main() {
  await initAmmo();
  const app = createApp(canvas);

  const designer = new LevelDesigner(5, 5);
  for (let i = 0; i < 5; i++) {
    designer.setBlock(i, 0);
    designer.setBlock(i, 4);
    designer.setBlock(0, i);
    designer.setBlock(4, i);
  }
  designer.setSpawn(2, 2);
  designer.setGoal(2, 4);
  designer.addEnemy(1, 3);
  const levelData: LevelData = designer.build();

  const light = new pc.Entity('light');
  light.addComponent('light', { type: 'directional', intensity: 1 });
  light.setLocalEulerAngles(45, 45, 0);
  app.root.addChild(light);

  const { spawn, goal, enemies: enemySpawns } = buildLevel(app, levelData);
  const player = await createPlayer(app, spawn);
  const enemies = enemySpawns.map((pos) => createEnemy(app, pos));

  const camera = new pc.Entity('camera');
  camera.addComponent('camera', {
    clearColor: new pc.Color().fromString(
      levelData.palette?.background || '#000000'
    )
  });
  app.root.addChild(camera);

  app.on('update', () => {
    const force = new pc.Vec3();
    const speed = 5;
    if (app.keyboard.isPressed(pc.KEY_W)) force.z -= speed;
    if (app.keyboard.isPressed(pc.KEY_S)) force.z += speed;
    if (app.keyboard.isPressed(pc.KEY_A)) force.x -= speed;
    if (app.keyboard.isPressed(pc.KEY_D)) force.x += speed;
    if (force.lengthSq() > 0) {
      player.rigidbody.applyForce(force);
    }

    enemies.forEach((enemy) => {
      const ep = enemy.getPosition();
      enemy.setLocalPosition(ep.x + Math.sin(app.time) * 0.01, ep.y, ep.z);
      if (ep.distance(player.getPosition()) < 0.5) {
        console.log('Hit by enemy');
      }
    });

    if (goal.getPosition().distance(player.getPosition()) < 0.5) {
      console.log('Level complete');
    }

    const p = player.getPosition();
    camera.setLocalPosition(p.x, p.y + 5, p.z + 10);
    camera.lookAt(p);
  });
}

main();
