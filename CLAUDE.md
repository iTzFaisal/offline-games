# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack & Constraints

- **Pure Vanilla JavaScript (ES6+)** - No frameworks, no build tools, no npm packages
- **CSS3** with custom properties (variables) for theming
- **HTML5** semantic markup
- **LocalStorage API** for persistence (scores, theme preferences)
- No external dependencies - everything runs locally in the browser

## Running the Project

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Use a local server (recommended for proper relative path resolution)
uv --script http.server 8000
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

All games extend `BaseGame` from `js/games/base.js`, which provides:
- Score storage with localStorage (`games_scores_<gameId>`)
- Score tracking: wins, losses, draws, gamesPlayed, lastPlayed
- `getScores()`, `saveScore(result)`, `resetScores()` methods

### Theme System

The `ThemeManager` module (`js/theme.js`) handles light/dark theme switching:
- Auto-detects system preference via `prefers-color-scheme`
- Stores manual override in localStorage (`games_theme`)
- Must be loaded early in `<head>` to prevent FOUC
- Uses `data-theme` attribute on `<html>` element

CSS custom properties in `css/main.css` define all colors:
```css
:root { --primary-color: #4a90e2; ... }
:root[data-theme="light"] { --primary-color: #4a90e2; ... }
```

### Game File Structure

Each game requires two files:

1. **HTML**: `games/<game>.html` - Game page markup
2. **JavaScript**: `js/games/<game>.js` - Game logic extending `BaseGame`

Game HTML must:
- Link `../css/main.css` and `../css/games.css`
- Load `../js/theme.js` in `<head>` (before body renders)
- Load `../js/games/base.js` before game-specific JS
- Include theme toggle button with click handler

## Adding a New Game

1. Create `games/newgame.html` following the pattern in `games/tictactoe.html`
2. Create `js/games/newgame.js` with a class extending `BaseGame`
3. Add entry to `gameRegistry` in `js/main.js`
4. Add any game-specific styles to `css/games.css`

## Key Conventions

- **localStorage keys**: Prefix with `games_` (e.g., `games_scores_tictactoe`, `games_theme`)
- **Game IDs**: Use lowercase, no spaces (e.g., `tictactoe`, not `tic-tac-toe`)
- **CSS Variables**: All colors use `--*` custom properties for theme support
- **Accessibility**: All interactive elements need ARIA labels, keyboard navigation support
- **Responsive**: Mobile-first design with CSS Grid/Flexbox
- **Reduced Motion**: Respect `prefers-reduced-motion` in CSS

## File Organization

```
/
├── index.html           # Homepage with game library
├── css/
│   ├── main.css        # Global styles + theme variables
│   └── games.css       # Game-specific styles
├── js/
│   ├── main.js         # Game registry + homepage logic
│   ├── theme.js        # Theme manager (must load early!)
│   └── games/
│       ├── base.js     # BaseGame class
│       └── *.js        # Individual game implementations
└── games/
    └── *.html          # Individual game pages
```
