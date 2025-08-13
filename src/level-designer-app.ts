import { LevelDesigner } from './level-designer';
import { LevelData } from './game-engine';

const size = 8;
const designer = new LevelDesigner(size, size);

const editor = document.getElementById('editor') as HTMLElement;
editor.style.display = 'grid';
editor.style.gridTemplateColumns = `repeat(${size}, 30px)`;

const states = ['.', 'S', 'P', 'G', 'E'];

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const cell = document.createElement('button');
    cell.style.width = '30px';
    cell.style.height = '30px';
    cell.dataset.state = '0';
    cell.dataset.x = String(x);
    cell.dataset.y = String(y);
    cell.addEventListener('click', () => {
      const cx = Number(cell.dataset.x);
      const cy = Number(cell.dataset.y);
      const idx = Number(cell.dataset.state);
      const next = (idx + 1) % states.length;
      cell.dataset.state = String(next);
      const ch = states[next];
      cell.textContent = ch === '.' ? '' : ch;
      switch (ch) {
        case 'S':
          designer.setBlock(cx, cy);
          break;
        case 'P':
          designer.setSpawn(cx, cy);
          break;
        case 'G':
          designer.setGoal(cx, cy);
          break;
        case 'E':
          designer.addEnemy(cx, cy);
          break;
        default:
          designer.clearCell(cx, cy);
      }
    });
    editor.appendChild(cell);
  }
}

(document.getElementById('export') as HTMLButtonElement).addEventListener(
  'click',
  () => {
    const data: LevelData = designer.build();
    console.log(JSON.stringify(data, null, 2));
  }
);
