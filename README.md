# Snake JS

Classic snake game built with HTML5 Canvas and vanilla JavaScript — no dependencies, no frameworks.

![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)

---

## Features

- `<canvas>` rendering with sprites for head, body, tail and turn blocks.
- Board adapts to viewport size (computed on page load).
- Two apples on screen at the same time.
- Dynamic scoring: higher speed yields more points per apple.
- Wall and self-collision detection.
- Sound effects when eating and on game over.
- Keyboard controls and touch gesture support (swipe).
- Pause, restart and live speed selector (1–9).

## How to play

Just open `index.html` in a modern browser. No build or install required.

```bash
git clone <repo>
cd snakejs
xdg-open index.html   # Linux
# or simply double-click index.html
```

> Some browsers block audio autoplay until the user interacts with the page. The first click on *Play* enables sound.

### Controls

| Action              | Keyboard         | Mobile          |
|---------------------|------------------|-----------------|
| Move up             | `↑`              | swipe up        |
| Move down           | `↓`              | swipe down      |
| Move left           | `←`              | swipe left      |
| Move right          | `→`              | swipe right     |
| Pause / resume      | *Pause* button   | *Pause* button  |
| Start / restart     | *Play* button    | *Play* button   |

### Speed

The *Speed* field accepts values from 1 to 9:

- `1` = slowest (1000 ms per tick → 1 point per apple)
- `9` = fastest (100 ms per tick → 9 points per apple)

Changes apply immediately during a running game.

## Project structure

```
snakejs/
├── index.html        # DOM structure and sprite references
├── main.css          # Board, buttons and popup styles
├── main.js           # Game logic (loop, render, input)
├── package.json      # Dev dependencies (eslint)
├── .eslintrc.json    # ESLint config (standard)
├── assets/           # Snake, apple and background sprites
│   ├── apple.png
│   ├── grass.png
│   ├── snake-head.png
│   ├── snake-body.png
│   ├── snake-tail.png
│   └── snake-turn.png
└── sounds/           # Sound effects
    ├── eat.wav
    └── end.ogg
```

## Implementation details

- **Block size:** `40 px`. All snake and food positions align to a grid of that step.
- **Board dimensions:** computed in `getDimensions()` from `window.innerWidth` and `0.9 * window.innerHeight`, rounded to the nearest multiple of 40.
- **Main loop:** `setInterval` with period equal to `speed` ms. Each tick checks food, moves the snake and tests collisions.
- **Snake render:** current blocks are cleared with `clearRect`, then the new head is `unshift`ed and the tail `pop`ped if no growth. Each block is drawn with its matching sprite (head, body, tail or turn) and proper rotation.
- **Input lock:** a `move.lock` flag prevents the player from changing direction twice within the same tick (avoids self-reversal in a single frame).

## Development

Project uses ESLint with the `standard` config.

```bash
npm install
npx eslint main.js
```

## Known limitations

- On some browsers audio autoplay stays muted until the first user interaction.
- Board does not resize dynamically when the window changes size; reload the page.
- On touch screens `touchmove` can overlap with page scroll if the gesture starts outside the canvas.
