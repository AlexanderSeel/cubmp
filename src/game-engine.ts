import * as pc from 'playcanvas';

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
