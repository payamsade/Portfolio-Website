const CELL = 20;
const COLS = 20;
const ROWS = 20;
const BASE_INTERVAL = 150;
const MIN_INTERVAL = 70;
const SPEED_STEP = 5;

const COLOR_BG = '#111827';
const COLOR_SNAKE = '#ffffff';
const COLOR_HEAD = '#ffffff';
const COLOR_FOOD = '#d97706';

let state = null;
let loopTimer = null;
let logicalSize = 400;

function initState() {
  return {
    snake: [
      { x: 12, y: 10 },
      { x: 11, y: 10 },
      { x: 10, y: 10 },
    ],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: null,
    score: 0,
    interval: BASE_INTERVAL,
    status: 'playing',
  };
}

function spawnFood(snake) {
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (occupied.has(`${pos.x},${pos.y}`));
  return pos;
}

function updateScore() {
  document.getElementById('snakeScore').textContent = `SCORE: ${state.score}`;
}

function restartLoop() {
  clearInterval(loopTimer);
  loopTimer = setInterval(tick, state.interval);
}

function render() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const cell = logicalSize / COLS;

  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, logicalSize, logicalSize);

  ctx.fillStyle = COLOR_FOOD;
  ctx.beginPath();
  ctx.roundRect(
    state.food.x * cell + 2,
    state.food.y * cell + 2,
    cell - 4,
    cell - 4,
    4
  );
  ctx.fill();

  state.snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? COLOR_HEAD : COLOR_SNAKE;
    ctx.globalAlpha = i === 0 ? 1 : Math.max(0.5, 1 - i * 0.02);
    ctx.beginPath();
    ctx.roundRect(
      seg.x * cell + 1,
      seg.y * cell + 1,
      cell - 2,
      cell - 2,
      3
    );
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  if (state.status === 'gameover') {
    ctx.fillStyle = 'rgba(17,24,39,0.85)';
    ctx.fillRect(0, 0, logicalSize, logicalSize);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', logicalSize / 2, logicalSize / 2 - 20);

    ctx.fillStyle = COLOR_FOOD;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Score: ${state.score}`, logicalSize / 2, logicalSize / 2 + 15);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Press R or tap to restart', logicalSize / 2, logicalSize / 2 + 45);
    ctx.textAlign = 'left';
  }
}

function tick() {
  if (state.status !== 'playing') return;

  state.dir = state.nextDir;
  const head = {
    x: state.snake[0].x + state.dir.x,
    y: state.snake[0].y + state.dir.y,
  };

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    state.status = 'gameover';
    render();
    return;
  }

  if (state.snake.some(s => s.x === head.x && s.y === head.y)) {
    state.status = 'gameover';
    render();
    return;
  }

  state.snake.unshift(head);

  if (head.x === state.food.x && head.y === state.food.y) {
    state.score += 1;
    state.food = spawnFood(state.snake);
    state.interval = Math.max(MIN_INTERVAL, state.interval - SPEED_STEP);
    restartLoop();
    updateScore();
  } else {
    state.snake.pop();
  }

  render();
}

let touchStart = null;

function handleTouchStart(e) {
  const t = e.touches[0];
  touchStart = { x: t.clientX, y: t.clientY };
}

function handleTouchEnd(e) {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  touchStart = null;

  if (state.status === 'gameover') { startGame(); return; }

  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

  let newDir;
  if (Math.abs(dx) > Math.abs(dy)) {
    newDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
  } else {
    newDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  if (newDir.x === -state.dir.x && newDir.y === -state.dir.y) return;
  state.nextDir = newDir;
}

function handleKey(e) {
  const dirMap = {
    ArrowUp:    { x: 0, y: -1 },
    ArrowDown:  { x: 0, y: 1 },
    ArrowLeft:  { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
  };

  if (e.key === 'Escape') { closeOverlay(); return; }
  if (e.key === 'r' || e.key === 'R') { if (state.status === 'gameover') startGame(); return; }

  const newDir = dirMap[e.key];
  if (!newDir) return;

  if (newDir.x === -state.dir.x && newDir.y === -state.dir.y) return;

  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  state.nextDir = newDir;
}

function startGame() {
  clearInterval(loopTimer);
  state = initState();
  state.food = spawnFood(state.snake);
  updateScore();
  render();
  loopTimer = setInterval(tick, state.interval);
}

function openOverlay() {
  document.getElementById('snakeOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  startGame();
}

function closeOverlay() {
  clearInterval(loopTimer);
  document.getElementById('snakeOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function init() {
  const trigger = document.getElementById('snakeTrigger');
  const closeBtn = document.getElementById('snakeClose');
  const overlay = document.getElementById('snakeOverlay');
  const canvas = document.getElementById('snakeCanvas');

  trigger.addEventListener('click', openOverlay);
  closeBtn.addEventListener('click', closeOverlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    handleKey(e);
  });

  canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
  canvas.addEventListener('touchend', handleTouchEnd);

  const dpr = window.devicePixelRatio || 1;
  logicalSize = Math.min(400, window.innerWidth - 32);
  canvas.style.width = logicalSize + 'px';
  canvas.style.height = logicalSize + 'px';
  canvas.width = logicalSize * dpr;
  canvas.height = logicalSize * dpr;
  canvas.getContext('2d').scale(dpr, dpr);
}

document.addEventListener('DOMContentLoaded', init);
