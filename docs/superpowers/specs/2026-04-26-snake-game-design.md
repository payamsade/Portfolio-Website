# Snake Game Easter Egg — Design Spec

## Overview

Add a playable snake game easter egg to the portfolio homepage. Triggered by a small button in the hero section, it opens a fullscreen overlay with a canvas-based snake game. Styled to match the site.

---

## Trigger

- A small ghost button placed below the LinkedIn/GitHub links in the hero section of `index.html`
- Label: `🐍 play snake`
- Style: low opacity (~0.45), small font (0.8rem), no background, subtle border — feels like a discovery, not a feature
- On click: opens the game overlay, locks body scroll

---

## Overlay

- Fullscreen fixed overlay, `z-index: 1000`, background `#111827`
- Centered canvas (fixed size: 400×400px on desktop, scales down on mobile)
- Score displayed above canvas in amber (`#d97706`), Inter font
- Close button (×) top-right corner
- Click outside canvas OR press `Esc` to close
- Closing resets the game state

---

## Game Rules

- Standard snake gameplay
- Snake starts at center, length 3, moving right
- Food spawns at random empty cell, colored amber (`#d97706`)
- Snake body: white (`#ffffff`), head slightly brighter
- Eating food: snake grows by 1, score +1, speed increases slightly (capped)
- Hitting wall or self: game over
- Game over screen: shows score, "Press R or tap to restart" prompt

---

## Controls

**Desktop:**
- Arrow keys or WASD to change direction
- `R` to restart after game over
- `Esc` to close overlay

**Mobile:**
- Swipe on canvas to change direction (min swipe distance: 20px)
- Tap to restart after game over

---

## Files

| File | Change |
|------|--------|
| `index.html` | Add trigger button in hero, add overlay HTML at end of body |
| `snake.js` | All game logic (canvas render loop, input handling, game state) |
| `css/style.css` | Overlay styles, trigger button styles |

---

## Style Reference

| Token | Value |
|-------|-------|
| Background | `#111827` |
| Accent / food | `#d97706` |
| Snake | `#ffffff` |
| Font | Inter |
| Border radius | `10px` (matches site `--radius`) |

---

## Out of Scope

- High score persistence (no localStorage)
- Sound effects
- Animations on the overlay open/close (simple opacity fade is fine)
- Multiple difficulty settings
