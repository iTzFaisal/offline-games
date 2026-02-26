## Context

The project now has a retro arcade theme with SoundManager, BaseGame high score mode, and one canvas-based game (Snake). The architecture supports adding more arcade games using the same patterns. The current constraint is vanilla JavaScript with no external dependencies.

**Current State:**
- Retro arcade theme with neon colors and pixel fonts
- SoundManager for procedural sound generation
- BaseGame supports both competitive (Tic-Tac-Toe) and high score (Snake) modes
- Canvas rendering pattern established in Snake game
- Touch controls pattern for mobile support

**Constraints:**
- Pure vanilla JavaScript (no frameworks)
- Canvas API for game rendering
- Web Audio API for sound generation
- LocalStorage for score persistence
- Mobile + desktop parity

## Goals / Non-Goals

**Goals:**
- Add 4 classic arcade games that complement the existing Snake game
- Reuse existing infrastructure (SoundManager, BaseGame, retro theme)
- Maintain consistent UX across all games (controls, scoring, sound)
- Ensure all games work on mobile (touch controls)
- Implement progressive difficulty for replayability

**Non-Goals:**
- Multiplayer/networked play (all local only)
- High-fidelity emulation of original arcade hardware (inspired by, not identical to)
- Save game states (only high scores persist)
- Leaderboards beyond local storage
- Power-ups for all games (primarily for Breakout)

## Decisions

### 1. Implementation Order: Pong → Breakout → Space Invaders → Asteroids

**Decision:** Implement games in order of complexity to build patterns incrementally.

**Rationale:**
- **Pong** is simplest (2 paddles, 1 ball, simple physics) - establishes paddle game pattern
- **Breakout** builds on Pong (adds bricks, power-ups, levels) - extends paddle pattern
- **Space Invaders** introduces fixed shooter and enemy patterns - new pattern
- **Asteroids** adds vector physics and rotation - most complex, done last

**Alternatives Considered:**
- Implement all in parallel → More efficient but harder to maintain consistency
- Reverse complexity order → Harder to learn from simpler games

### 2. Shared Game Architecture Pattern

**Decision:** All games follow Snake's structure: HTML page + JS class extending BaseGame.

**Pattern:**
```javascript
class GameName extends BaseGame {
    constructor(canvasId) {
        super('gamename', 'highscore');
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        // Game-specific initialization
    }
}
```

**Rationale:**
- Consistent with existing codebase
- BaseGame provides high score tracking automatically
- SoundManager already integrated
- Easy to add new games to registry

### 3. Canvas Size Standardization

**Decision:** Use 400x400 canvas for all games (same as Snake).

**Rationale:**
- Consistent mobile experience (same scaling math)
- Sufficient resolution for retro-style graphics
- Fits well on both desktop and mobile screens

**Alternatives Considered:**
- Different sizes per game → Adds complexity for no clear benefit
- Larger canvas (600x600) → May not fit well on small mobile screens

### 4. Control Schemes Per Game Type

**Decision:** Match controls to game type, support both keyboard and touch.

| Game Type | Keyboard Controls | Touch Controls |
|-----------|------------------|----------------|
| Paddle (Pong/Breakout) | Arrow keys / A-D | Touch drag anywhere on screen |
| Fixed Shooter (Invaders) | Arrow keys / A-D | Touch left/right sides of screen |
| Vector (Asteroids) | Arrow keys + Space | On-screen D-pad + fire button (rotate only) |

**Rationale:**
- Keyboard controls feel natural on desktop
- Touch controls adapted per game for best mobile UX
- Reuse patterns from Snake where applicable

### 5. Difficulty Progression Approach

**Decision:** Each game implements its own difficulty system appropriate to its mechanics.

- **Pong**: AI paddle speed and reaction time
- **Breakout**: Ball speed and brick patterns per level
- **Space Invaders**: Alien descent speed and fire rate per wave
- **Asteroids**: Asteroid count, speed, and split behavior per level

**Rationale:**
- Different games need different difficulty mechanics
- One-size-fits-all doesn't work across game genres
- Players expect genre-appropriate progression

### 6. Sound Effects Strategy

**Decision:** Add game-specific sounds to SoundManager, reuse generic sounds where applicable.

**New Sounds Needed:**
- Pong: Paddle hit, wall bounce, score
- Breakout: Brick break, power-up collect, life lost
- Space Invaders: Shot, explosion, invader move, UFO
- Asteroids: Thrust, shoot, asteroid split, ship death

**Reuse Existing:**
- Click, hover (UI)
- High score fanfare
- Game over

**Rationale:**
- Consistent sound palette across games
- Game-specific sounds enhance thematic identity
- SoundManager already supports arbitrary sound types

### 7. No Power-ups in Pong, Space Invaders, or Asteroids

**Decision:** Power-ups only in Breakout/Arkanoid (the game that defined them).

**Rationale:**
- Breakout/Arkanoid is known for power-ups (expectation)
- Other games don't traditionally feature power-ups
- Keeps other games focused on core mechanics
- Breakout demonstrates the pattern for future games

**Alternatives Considered:**
- Power-ups in all games → Over-complicates simple games
- No power-ups anywhere → Misses key Breakout gameplay element

## Risks / Trade-offs

### Risk: Code duplication across similar games

**Impact:** Shared bug patterns, harder maintenance

**Mitigation:**
- Extract common patterns into helper functions if duplication becomes problematic
- Document patterns in CLAUDE.md for consistency
- Consider game utilities module after 2-3 games implemented

### Risk: Performance on low-end devices with 4 canvas games

**Impact:** Frame rate drops, sluggish controls

**Mitigation:**
- All games use requestAnimationFrame (already optimized)
- Canvas clearing and rendering is minimal (retro graphics = simple)
- Test on actual devices during implementation
- Consider object pooling for particle effects if needed

### Risk: Touch controls feel different than keyboard

**Impact:** Mobile gameplay feels "off" compared to desktop

**Mitigation:**
- Test touch controls extensively on real devices
- Adjust sensitivity/acceleration per game
- Consider haptic feedback API (if available) for game events
- Document touch control expectations clearly

### Trade-off: Vector graphics vs bitmap sprites

**Consideration:** Asteroids traditionally uses vector lines, not sprites

**Decision:**
- Use Canvas line drawing for vector-style graphics in Asteroids
- Use filled rectangles/circles for other games
- All games use same Canvas API, just different drawing methods

**Rationale:** Authentic to original Asteroids, Canvas makes it easy

### Trade-off: AI complexity in Pong

**Consideration:** Perfect AI is unbeatable, random AI is boring

**Decision:**
- Implement three difficulty levels: Easy (slow reaction), Medium (human-like), Hard (near-perfect)
- Add intentional "mistakes" to Easy/Medium AI
- Hard AI has slight prediction delay to make it beatable

## Migration Plan

### Phase 1: Pong (Foundation)
1. Create `games/pong.html` and `js/games/pong.js`
2. Implement paddle physics, ball collision, AI opponent
3. Add keyboard and touch controls
4. Test high score saving
5. Add to game registry

### Phase 2: Breakout (Extension)
1. Create `games/breakout.html` and `js/games/breakout.js`
2. Reuse paddle physics from Pong
3. Add brick grid, power-ups, level system
4. Implement ball physics for deflection angles
5. Test and add to registry

### Phase 3: Space Invaders (New Pattern)
1. Create `games/invaders.html` and `js/games/invaders.js`
2. Implement fixed shooter, alien formation movement
3. Add bunker destruction, UFO, player lives
4. Implement wave progression
5. Test and add to registry

### Phase 4: Asteroids (Complex)
1. Create `games/asteroids.html` and `js/games/asteroids.js`
2. Implement ship rotation, thrust physics, momentum
3. Add asteroid splitting, screen wrapping
4. Implement UFO enemy
5. Test and add to registry

### Rollback Strategy
- Each game is independent (no cross-game dependencies)
- Can remove individual games by deleting files and registry entry
- Git commits per game phase for easy revert

## Open Questions

1. **Should Space Invaders include the "mystery UFO" that appears periodically?**
   - Original game had it for bonus points
   - Decision: Yes, adds variety and scoring opportunity

2. **Should Breakout include laser power-up (shoot bricks from paddle)?**
   - Some Arkanoid versions had it
   - Decision: Yes, demonstrates power-up system flexibility

3. **Should Asteroids have hyperspace button (teleport randomly)?**
   - Original arcade feature, could be frustrating on mobile
   - Decision: Omit for MVP, evaluate after testing

4. **Should Pong support 2-player local mode?**
   - Could use opposite sides of keyboard (WASD vs Arrow keys)
   - Decision: Yes, easy to add and fun for local play
