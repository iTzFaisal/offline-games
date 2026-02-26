## Why

The current generic theme system doesn't match the nostalgic arcade game experience. The project needs a distinctive retro aesthetic that evokes 80s/90s arcade cabinets while expanding the game library beyond Tic-Tac-Toe to include classic arcade games like Snake.

## What Changes

### Theme System
- **BREAKING**: Remove light/dark theme toggle entirely
- Replace with permanent retro arcade theme (neon colors on dark backgrounds)
- Apply retro typography (Press Start 2P for headers, VT323 for body text)
- Update all UI elements to use pixel-perfect borders and neon glow effects

### New Game: Snake
- Add full-featured Snake game with 20x20 grid
- Implement two food types: regular (+10 points) and bonus (+50 points)
- Add 10 speed levels that increase as player scores
- Add static obstacles that appear in higher levels (6+)
- Support keyboard (arrows/WASD) and mobile (swipe) controls
- Track high scores per level using localStorage

### Audio System
- Create shared SoundManager module using Web Audio API
- Generate all sounds via oscillators (no external audio files)
- Provide UI sounds (click, hover), gameplay sounds (score, collision), and game-specific effects
- Add master mute toggle in header

### Architecture Extensions
- Extend BaseGame class to support `highscore` mode alongside existing `competitive` mode
- High score mode tracks single best score instead of wins/losses/draws
- Maintain backward compatibility with Tic-Tac-Toe (which uses competitive mode)

## Capabilities

### New Capabilities
- `retro-theme`: Visual theme with arcade colors, pixel fonts, and neon glow effects
- `snake-game`: Classic Snake game with food collection, speed progression, and obstacles
- `audio-system`: Procedural sound generation using Web Audio API oscillators

### Modified Capabilities
- `website`: Theme requirements changing from light/dark toggle to permanent retro theme (delta spec needed)

## Impact

### Affected Files
- `css/main.css` - Complete color scheme and typography overhaul
- `css/games.css` - Game-specific styles updated for retro aesthetic
- `js/theme.js` - Simplified to remove toggle logic
- `js/games/base.js` - Extended with high score mode parameter
- `js/main.js` - Snake game added to registry
- `index.html` - Theme toggle button removed, Google Fonts added

### New Files
- `js/sound.js` - SoundManager singleton with oscillator-based sound generation
- `games/snake.html` - Snake game page with canvas and controls
- `js/games/snake.js` - Snake game logic extending BaseGame

### Dependencies
- Google Fonts (CDN) for Press Start 2P and VT323 fonts
- No other external dependencies (pure vanilla JavaScript)

### Backward Compatibility
- Tic-Tac-Toe game remains functional with existing score tracking
- Existing localStorage scores preserved (uses different keys)
- BaseGame changes are additive (new mode parameter, defaults unchanged)
