import * as pc from 'playcanvas';
import { initAmmo, createApp } from './game-engine';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

async function main() {
  await initAmmo();
  const app = createApp(canvas);

  if (!app.systems.rigidbody) {
    console.error('RigidBody system missing');
    return;
  }

  const ground = new pc.Entity('ground');
  ground.addComponent('render', { type: 'box' });
  ground.addComponent('rigidbody', { type: 'static', restitution: 0.5 });
  ground.setLocalScale(10, 1, 10);
  app.root.addChild(ground);

  const box = new pc.Entity('box');
  box.addComponent('render', { type: 'box' });
  box.addComponent('rigidbody', { mass: 1 });
  box.setLocalPosition(0, 5, 0);
  app.root.addChild(box);
}

main();
