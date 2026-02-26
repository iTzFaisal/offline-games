# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack & Constraints

- **Pure Vanilla JavaScript (ES6+)** - No frameworks, no build tools, no npm packages
- **HTML5 Canvas** - Hardware-accelerated game rendering for arcade games
- **CSS3** with custom properties (variables) for theming
- **HTML5** semantic markup
- **LocalStorage API** for persistence (scores, theme preferences)
- **Web Audio API** - Procedural sound generation (no external audio files)
- No external dependencies - everything runs locally in the browser

## Running the Project

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Use a local server (recommended for proper relative path resolution)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Architecture

### Game Registry Pattern

All games are registered in `js/main.js` via the `gameRegistry` object. This is the single source of truth for available games:

```javascript
const gameRegistry = {
    gameid: {
        id: 'gameid',
        name: 'Display Name',
        description: 'Game description',
        path: 'games/gamefile.html'
    }
};
```

The homepage (`index.html`) dynamically renders game cards from this registry.

### Base Game Class

All games extend `BaseGame` from `js/games/base.js`, which provides two game modes:

**Competitive Mode** (Tic-Tac-Toe):
- Score storage: `games_scores_<gameId>`
- Tracks: wins, losses, draws, gamesPlayed, lastPlayed
- Methods: `getScores()`, `saveScore(result)`, `resetScores()`

**High Score Mode** (Snake, Pong, Breakout, Space Invaders, Asteroids):
- Score storage: `games_highscore_<gameId>`
- Stores single best score (integer)
- Methods: `getHighScore()`, `isNewHighScore(score)`, `saveScore(score)`
- Returns object with `{ score, highScore, isNewRecord }`

### Retro Arcade Theme

The project uses a permanent retro arcade theme (not togglable):
- **Neon Colors**: Magenta (#ff00ff), Cyan (#00ffff), Neon Green (#39ff14), Yellow (#ffff00), Arcade Red (#ff0040)
- **Pixel Fonts**: Press Start 2P (headings), VT323 (body text)
- **Glow Effects**: CSS box-shadows create authentic neon glow
- **Dark Background**: Deep arcade black (#0a0a12) and blue-black (#12121f)
- **No Border Radius**: Sharp corners for pixel-perfect retro look

### Sound Manager

The `SoundManager` module (`js/sound.js`) provides procedural audio:
- Uses Web Audio API with oscillators (no external files)
- Game-specific sounds for each game type
- Mute toggle persisted in localStorage (`games_sound_muted`)
- Methods: `play(soundType)`, `toggleMute()`, `isMuted()`, `updateMuteButton()`

### Canvas Game Pattern

All arcade games (Snake, Pong, Breakout, Space Invaders, Asteroids) use Canvas:

```javascript
class ArcadeGame extends BaseGame {
    constructor(canvasId) {
        super('gamename', 'highscore');
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        // Canvas size: 400x400 for consistency
        // Game initialization
    }

    startGameLoop() {
        const loop = (currentTime) => {
            if (!this.isRunning) return;
            if (!this.isPaused && !this.gameOver) {
                this.update();
            }
            this.render();
            this.gameLoop = requestAnimationFrame(loop);
        };
        this.gameLoop = requestAnimationFrame(loop);
    }
}
```

### Game File Structure

Each game requires two files:

1. **HTML**: `games/<game>.html` - Game page markup
2. **JavaScript**: `js/games/<game>.js` - Game logic extending `BaseGame`

Game HTML must:
- Link Google Fonts (Press Start 2P, VT323)
- Link `../css/main.css` and `../css/games.css`
- Load `../js/theme.js` in `<head>` (before body renders)
- Load `../js/sound.js` for audio
- Load `../js/games/base.js` before game-specific JS
- Include mute toggle button with SVG icons
- Include game canvas (400x400), score display, status message, restart button

## Adding a New Game

1. Create `games/newgame.html` following the pattern in existing games
2. Create `js/games/newgame.js` with a class extending `BaseGame`
3. Add entry to `gameRegistry` in `js/main.js`
4. Add any game-specific sounds to `SoundManager` in `js/sound.js`
5. Add any game-specific styles to `css/games.css`

## Canvas Game Patterns

### Common Canvas Elements

**Ball Physics** (Pong, Breakout):
```javascript
this.ball = { x, y, vx, vy, speed, radius };
// Update: x += vx, y += vy
// Wall bounce: vy *= -1 at top/bottom edges
// Paddle collision: Calculate angle based on hit position
```

**Paddle Controls** (Pong, Breakout):
```javascript
// Keyboard: Arrow keys, A/D
// Touch: Track touch X position with smooth interpolation
// Boundary: Clamp to canvas width
```

**Game States**:
```javascript
this.gameRunning = false;  // Game is active
this.isPaused = false;     // Game is paused
this.gameOver = false;     // Game ended
```

**Pause Toggle**: Space bar or canvas click

### Sound Effects

Add to `js/sound.js` in the `sounds` object:

```javascript
'gamename-event': () => {
    if (isMuted) return;
    ensureContextRunning();
    createOscillator('square', 440, audioContext.currentTime, 0.05);
}
```

Common sound types:
- `createOscillator(type, freq, startTime, duration)` - Simple beep
- `playFrequencyRamp(startFreq, endFreq, duration, type)` - Slide effect
- `playArpeggio([freq1, freq2, ...], noteDuration, type)` - Musical sequence

## Key Conventions

- **localStorage keys**: Prefix with `games_` (e.g., `games_highscore_snake`, `games_sound_muted`)
- **Game IDs**: Use lowercase, no spaces (e.g., `spaceinvaders` or `invaders`, not `space-invaders`)
- **Canvas Size**: Standardize on 400x400 for all arcade games
- **CSS Variables**: All colors use `--*` custom properties
- **Accessibility**: All interactive elements need ARIA labels, keyboard navigation support
- **Responsive**: Mobile-first with touch controls, canvas scales with CSS
- **Reduced Motion**: Respect `prefers-reduced-motion` in CSS

## File Organization

```
/
├── index.html           # Homepage with game library
├── css/
│   ├── main.css        # Global styles + retro theme variables
│   └── games.css       # Game-specific styles
├── js/
│   ├── main.js         # Game registry + homepage logic
│   ├── sound.js        # Procedural audio manager
│   └── games/
│       ├── base.js     # BaseGame class
│       ├── tictactoe.js # Competitive mode game
│       ├── snake.js     # High score mode game
│       ├── pong.js      # Canvas arcade game
│       ├── breakout.js  # Canvas arcade game
│       ├── invaders.js  # Canvas arcade game
│       └── asteroids.js # Canvas arcade game
└── games/
    └── *.html          # Individual game pages
```
