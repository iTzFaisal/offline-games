## Why

The retro arcade theme is established but only has two games (Tic-Tac-Toe and Snake). A true arcade experience needs variety across different game genres - paddle games, brick breakers, space shooters, and fixed-position shooters. This change adds four classic arcade games that showcase the retro aesthetic and reuse the existing infrastructure (SoundManager, BaseGame high score mode, retro theme).

## What Changes

### New Games
- **Pong**: Classic 2-player or vs AI paddle game with ball physics
- **Breakout/Arkanoid**: Brick-breaking paddle game with power-ups and multi-ball
- **Asteroids**: Vector-style space shooter with ship rotation and thrust physics
- **Space Invaders**: Fixed-position shooter with descending alien formations and bunkers

### Shared Features Across All Games
- Canvas-based rendering (reusing Snake's approach)
- High score mode with localStorage persistence
- Retro arcade sound effects via SoundManager
- Keyboard controls with mobile touch support
- Progressive difficulty levels
- Pause/restart functionality
- Game-specific sound effects

### Code Changes
- New game HTML files: `games/pong.html`, `games/breakout.html`, `games/asteroids.html`, `games/invaders.html`
- New game JavaScript files: `js/games/pong.js`, `js/games/breakout.js`, `js/games/asteroids.js`, `js/games/invaders.js`
- Updates to `js/main.js` game registry
- Additional game-specific styles in `css/games.css`

## Capabilities

### New Capabilities
- `pong-game`: Classic paddle-based table tennis simulation with ball physics, paddle collision detection, and AI opponent
- `breakout-game`: Brick-breaking game with paddle, ball, destructible bricks, power-ups (wide paddle, multi-ball, laser), and level progression
- `asteroids-game`: Vector-style space shooter with ship rotation/thrust physics, wrap-around screen edges, and splitting asteroids
- `invaders-game`: Fixed-position horizontal shooter with descending alien formations, destructible bunkers, and mystery UFO

### Modified Capabilities
- `website`: Adding 4 new games to the game registry (no spec requirement changes, just additional game entries)

## Impact

### Affected Files
- `js/main.js` - Add 4 new game registry entries
- `css/games.css` - Add game-specific styles for each new game
- `js/sound.js` - May need additional game-specific sound effects

### New Files
- `games/pong.html`, `games/breakout.html`, `games/asteroids.html`, `games/invaders.html`
- `js/games/pong.js`, `js/games/breakout.js`, `js/games/asteroids.js`, `js/games/invaders.js`

### Dependencies
- No new external dependencies
- Reuses existing: SoundManager, BaseGame (highscore mode), retro theme CSS

### Browser Compatibility
- All games use Canvas API (already supported)
- Touch controls for mobile (established pattern from Snake)
- Keyboard controls for desktop

### Backward Compatibility
- Fully backward compatible
- Existing games (Tic-Tac-Toe, Snake) unaffected
- BaseGame changes are additive only
