# Snake Game Easter Egg Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a playable canvas-based snake game easter egg triggered by a small button in the hero section of the portfolio homepage.

**Architecture:** A ghost trigger button in the hero opens a fullscreen overlay containing a `<canvas>` element. All game logic lives in `snake.js` (loaded only on `index.html`). The overlay and trigger styles live in `css/style.css`. No frameworks, no build step.

**Tech Stack:** Vanilla JS (ES6), HTML5 Canvas, CSS custom properties

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `css/style.css` | Modify | Overlay styles, trigger button styles |
| `index.html` | Modify | Trigger button in hero, overlay HTML at end of body, `<script src="snake.js">` |
| `snake.js` | Create | All game logic: state, render loop, input, mobile swipe |

---

### Task 1: Add CSS — trigger button and overlay

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Add trigger button styles**

Append to `css/style.css`:

```css
/* ===== SNAKE GAME ===== */
.snake-trigger {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.375rem 0.75rem;
  font-family: var(--font);
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s ease, border-color 0.15s ease;
  letter-spacing: 0.02em;
}
.snake-trigger:hover {
  color: rgba(255,255,255,0.75);
  border-color: rgba(255,255,255,0.3);
}
```

- [ ] **Step 2: Add overlay styles**

Append after the trigger styles:

```css
.snake-overlay {
  position: fixed;
  inset: 0;
  background: #111827;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}
.snake-overlay.active {
  opacity: 1;
  visibility: visible;
}
.snake-score {
  font-family: var(--font);
  font-size: 0.875rem;
  font-weight: 600;
  color: #d97706;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.snake-canvas {
  display: block;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  touch-action: none;
}
.snake-close {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  transition: color 0.15s ease;
}
.snake-close:hover { color: rgba(255,255,255,0.8); }
```

- [ ] **Step 3: Verify no syntax errors by opening index.html in browser**

The page should look identical to before — no visual changes yet.

- [ ] **Step 4: Commit**

```bash
git add css/style.css
git commit -m "feat: add snake game overlay and trigger CSS"
```

---

### Task 2: Add HTML — trigger button and overlay markup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the trigger button inside the hero**

In `index.html`, find the closing `</div>` of the `hero-links` div and add the button after it, before the closing `</div>` of `hero-inner--centered`:

```html
      <button class="snake-trigger" id="snakeTrigger">🐍 play snake</button>
```

The hero block should look like this after the change:

```html
      <div class="hero-links">
        <!-- LinkedIn and GitHub links -->
      </div>
      <button class="snake-trigger" id="snakeTrigger">🐍 play snake</button>
    </div>
  </section>
```

- [ ] **Step 2: Add the overlay HTML at the end of body, before </body>**

```html
  <!-- Snake Game Overlay -->
  <div class="snake-overlay" id="snakeOverlay" role="dialog" aria-label="Snake game">
    <button class="snake-close" id="snakeClose" aria-label="Close game">&times;</button>
    <p class="snake-score" id="snakeScore">SCORE: 0</p>
    <canvas class="snake-canvas" id="snakeCanvas" width="400" height="400"></canvas>
  </div>

  <script src="snake.js"></script>
</body>
```

- [ ] **Step 3: Open index.html in browser and verify**

- Trigger button appears below LinkedIn/GitHub links in the hero, low opacity
- Clicking it does nothing yet (JS not written)
- No layout breakage

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add snake trigger button and overlay HTML"
```

---

### Task 3: Create snake.js — constants, state, and canvas setup

**Files:**
- Create: `snake.js`

- [ ] **Step 1: Create snake.js with constants and initial state**

```js
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
const COLOR_SCORE = '#d97706';

let state = null;
let loopTimer = null;

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
    status: 'playing', // 'playing' | 'gameover'
  };
}
```

- [ ] **Step 2: Add food spawning function**

```js
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
```

- [ ] **Step 3: Commit**

```bash
git add snake.js
git commit -m "feat: snake game constants, state shape, food spawning"
```

---

### Task 4: Game logic — tick, collision, growth

**Files:**
- Modify: `snake.js`

- [ ] **Step 1: Add the tick function**

```js
function tick() {
  if (state.status !== 'playing') return;

  state.dir = state.nextDir;
  const head = {
    x: state.snake[0].x + state.dir.x,
    y: state.snake[0].y + state.dir.y,
  };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    state.status = 'gameover';
    render();
    return;
  }

  // Self collision
  if (state.snake.some(s => s.x === head.x && s.y === head.y)) {
    state.status = 'gameover';
    render();
    return;
  }

  state.snake.unshift(head);

  // Food collision
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

function restartLoop() {
  clearInterval(loopTimer);
  loopTimer = setInterval(tick, state.interval);
}

function updateScore() {
  document.getElementById('snakeScore').textContent = `SCORE: ${state.score}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add snake.js
git commit -m "feat: snake tick, collision detection, food eating, speed ramp"
```

---

### Task 5: Rendering

**Files:**
- Modify: `snake.js`

- [ ] **Step 1: Add the render function**

```js
function render() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Food
  ctx.fillStyle = COLOR_FOOD;
  ctx.beginPath();
  ctx.roundRect(
    state.food.x * CELL + 2,
    state.food.y * CELL + 2,
    CELL - 4,
    CELL - 4,
    4
  );
  ctx.fill();

  // Snake
  state.snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? COLOR_HEAD : COLOR_SNAKE;
    ctx.globalAlpha = i === 0 ? 1 : Math.max(0.5, 1 - i * 0.02);
    ctx.beginPath();
    ctx.roundRect(
      seg.x * CELL + 1,
      seg.y * CELL + 1,
      CELL - 2,
      CELL - 2,
      3
    );
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Game over screen
  if (state.status === 'gameover') {
    ctx.fillStyle = 'rgba(17,24,39,0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 1.5rem Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = COLOR_FOOD;
    ctx.font = '0.9rem Inter, sans-serif';
    ctx.fillText(`Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 15);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '0.75rem Inter, sans-serif';
    ctx.fillText('Press R or tap to restart', canvas.width / 2, canvas.height / 2 + 45);
    ctx.textAlign = 'left';
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add snake.js
git commit -m "feat: snake canvas render function with game over screen"
```

---

### Task 6: Input handling — keyboard and touch

**Files:**
- Modify: `snake.js`

- [ ] **Step 1: Add keyboard handler**

```js
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

  // Prevent reversing
  if (newDir.x === -state.dir.x && newDir.y === -state.dir.y) return;

  // Prevent default scroll on arrow keys
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  state.nextDir = newDir;
}
```

- [ ] **Step 2: Add touch/swipe handler**

```js
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

  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return; // too short

  let newDir;
  if (Math.abs(dx) > Math.abs(dy)) {
    newDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
  } else {
    newDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  if (newDir.x === -state.dir.x && newDir.y === -state.dir.y) return;
  state.nextDir = newDir;
}
```

- [ ] **Step 3: Commit**

```bash
git add snake.js
git commit -m "feat: keyboard and swipe input handling for snake game"
```

---

### Task 7: Overlay open/close and game start/stop

**Files:**
- Modify: `snake.js`

- [ ] **Step 1: Add startGame, openOverlay, closeOverlay, and init**

```js
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

  // Click outside canvas closes overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    handleKey(e);
  });

  canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
  canvas.addEventListener('touchend', handleTouchEnd);

  // Scale canvas on small screens
  const size = Math.min(400, window.innerWidth - 32);
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 2: Commit**

```bash
git add snake.js
git commit -m "feat: snake game overlay open/close and game lifecycle"
```

---

### Task 8: Manual verification

**Files:** None

- [ ] **Step 1: Desktop — open index.html and verify trigger**
  - Trigger button visible below LinkedIn/GitHub, low opacity
  - Hover darkens it slightly

- [ ] **Step 2: Desktop — open and play**
  - Click trigger → overlay fades in, game starts immediately
  - Arrow keys and WASD move the snake
  - Eating food increments score, snake grows
  - Speed increases after several foods eaten
  - Hitting wall → game over screen appears with score and restart prompt
  - Press R → game resets and starts again
  - Press Esc → overlay closes, body scroll restored

- [ ] **Step 3: Desktop — click outside**
  - Click the dark area outside the canvas → overlay closes

- [ ] **Step 4: Mobile — open and play**
  - Trigger button visible in hero
  - Tap trigger → overlay opens
  - Swipe to change direction (min 20px swipe)
  - Tap after game over → restarts

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: snake game easter egg complete"
```
