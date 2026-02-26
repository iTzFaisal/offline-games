## Context

The project currently uses a clean, minimal design with light/dark theme support. All games extend a BaseGame class that tracks wins/losses/draws, which works well for competitive games like Tic-Tac-Toe but doesn't fit high-score arcade games. The theme toggle adds complexity and doesn't align with the retro game aesthetic.

**Current State:**
- Generic web design with CSS custom properties for theming
- ThemeManager handles light/dark toggling with localStorage persistence
- BaseGame class assumes competitive scoring (wins/losses/draws)
- No sound effects system
- One game: Tic-Tac-Toe

**Constraints:**
- Pure vanilla JavaScript (no frameworks/build tools)
- No external assets (sounds must be procedurally generated)
- Mobile + desktop parity
- All persistence via localStorage

## Goals / Non-Goals

**Goals:**
- Transform visual aesthetic to retro arcade (neon colors, pixel fonts, glow effects)
- Add Snake game with full arcade feature set (speed levels, obstacles, bonus items)
- Create reusable sound system for all games
- Enable high-score tracking for non-competitive games

**Non-Goals:**
- CRT scanline effects, flicker, or other eye-strain visuals
- External audio files or assets
- Multiplayer or online features
- Leaderboards beyond local high scores

## Decisions

### 1. Permanent Retro Theme (No Toggle)

**Decision:** Remove theme toggle entirely, commit to retro arcade as the only theme.

**Rationale:**
- Simplifies codebase (no theme state management)
- Stronger brand identity (arcade cabinet experience)
- Retro aesthetic is core to the project, not a preference
- Reduces testing surface area

**Alternatives Considered:**
- Add retro as third option → More complexity, inconsistent experience
- Keep light/dark but add retro toggle → Even more complexity

### 2. Google Fonts for Typography

**Decision:** Use Press Start 2P (headers) and VT323 (body) via Google Fonts CDN.

**Rationale:**
- Authentic retro pixel font look
- No self-hosting required (CDN handles caching)
- VT323 has larger x-height for readability at game UI sizes
- Both fonts load quickly (~10-20KB each)

**Alternatives Considered:**
- Base64 encode fonts → Increases initial bundle size significantly
- System monospace fonts → Not authentic enough for retro feel

### 3. Neon Color Palette on Dark Backgrounds

**Decision:** Dark backgrounds (#0a0a12, #12121f) with neon accent colors (magenta #ff00ff, cyan #00ffff, green #39ff14, yellow #ffff00, red #ff0040).

**Rationale:**
- Matches arcade cabinet aesthetic (CRT phosphor colors)
- High contrast for accessibility
- Dark backgrounds reduce eye strain during extended play
- Neon colors provide strong visual hierarchy

**Alternatives Considered:**
- Pastel palette → Too soft, not arcade-authentic
- Full rainbow → Would look chaotic, less cohesive

### 4. Web Audio API for Sound Generation

**Decision:** Create SoundManager class that generates all sounds via Web Audio API oscillators.

**Rationale:**
- No external audio files needed
- Instant loading (no assets to download)
- Sounds can be parameterized (pitch, duration, wave type)
- Small code footprint (~200 lines for full sound library)

**Implementation Approach:**
```javascript
// Oscillator chain: Oscillator → GainNode → MasterGain → Destination
// Each sound type uses specific waveforms and envelopes
// Square/sawtooth for retro "bit-crushed" feel
// Sine for smooth UI sounds
// Noise buffer for explosion/shatter effects
```

**Alternatives Considered:**
- Base64 encoded audio → Larger bundle, harder to modify
- SpeechSynthesis API → Too limited, not cross-browser consistent

### 5. BaseGame Mode Parameter (Extension)

**Decision:** Extend BaseGame constructor with optional `mode` parameter (`'competitive'` or `'highscore'`).

**Rationale:**
- Backward compatible (default is `'competitive'`)
- Single class handles both scoring models
- Shared code for localStorage persistence
- Games self-declare their scoring model

**Implementation:**
```javascript
class BaseGame {
    constructor(gameId, mode = 'competitive') {
        this.gameId = gameId;
        this.scoreMode = mode;
    }

    saveScore(score) {
        if (this.scoreMode === 'highscore') {
            const currentHigh = localStorage.getItem(`games_highscore_${this.gameId}`) || 0;
            if (score > currentHigh) {
                localStorage.setItem(`games_highscore_${this.gameId}`, score);
                return { isNewRecord: true, score };
            }
        } else {
            // Existing wins/losses/draws logic
        }
    }
}
```

**Alternatives Considered:**
- Separate HighScoreGame subclass → More code duplication
- Every game handles its own scoring → Loses shared persistence logic

### 6. Snake Game: Canvas-Based Rendering

**Decision:** Use HTML5 Canvas for Snake game rendering (20x20 grid).

**Rationale:**
- Performance (60fps rendering without DOM manipulation)
- Easy animation of snake movement and food spawning
- Collision detection is straightforward grid math
- Consistent with other planned arcade games (Breakout, Pong)

**Alternatives Considered:**
- DOM-based (divs for each grid cell) → Slower, more complex for animations
- SVG → Overkill for simple 2D graphics

### 7. Snake Features: Food, Speed, Obstacles

**Decision:** Include regular food, bonus food, 10 speed levels, and static obstacles from level 6+.

**Rationale:**
- Progressive difficulty keeps game engaging
- Bonus food adds risk/reward decision (go for it or play safe?)
- Obstacles prevent safe "looping" strategies in higher levels
- All features are standard in classic Snake implementations

**Alternatives Considered:**
- No obstacles → Too repetitive, lacks challenge
- Power-ups → Too complex for initial implementation (future enhancement)

### 8. Mobile Controls: Swipe Gestures

**Decision:** Implement touch swipe detection for mobile Snake controls.

**Rationale:**
- More intuitive than on-screen D-pad
- Doesn't obscure game area
- Standard mobile game interaction pattern

**Fallback:** On-screen buttons added only if swipe testing shows usability issues.

## Risks / Trade-offs

### Risk: Google Fonts CDN Failure
**Impact:** Site falls back to default sans-serif, loses retro feel
**Mitigation:** CSS font stack includes reasonable fallbacks (`'Press Start 2P', 'Courier New', monospace`)

### Risk: Web Audio API Not Available
**Impact:** No sound effects in very old browsers
**Mitigation:** Wrap all sound calls in feature detection; silent degradation is acceptable

### Risk: Mobile Swipe Detection Conflicts with Scroll
**Impact:** Swipe might page-scroll instead of controlling snake
**Mitigation:** `e.preventDefault()` on touch events within game canvas; passive event listeners where possible

### Risk: High Score Mode Doesn't Fit All Future Games
**Impact:** Might need third mode for different scoring (e.g., time-based)
**Mitigation:** Mode parameter is extensible; can add `'timeattack'` or similar later without breaking changes

### Trade-off: Retro Theme May Not Appeal to All Users
**Consideration:** Some users prefer clean/modern aesthetics
**Decision Acceptance:** Retro is core to project identity; appealing to arcade game enthusiasts is the goal

## Migration Plan

### Phase 1: Infrastructure
1. Add Google Fonts to `<head>` of index.html
2. Create SoundManager in js/sound.js
3. Extend BaseGame class with mode parameter

### Phase 2: Theme Overhaul
1. Replace all CSS variables in css/main.css with retro palette
2. Update typography rules (font families, sizes)
3. Add neon glow effects to buttons and cards
4. Remove theme toggle button from index.html
5. Simplify js/theme.js (remove toggle logic, keep basic init)

### Phase 3: Snake Game
1. Create games/snake.html with canvas and UI
2. Create js/games/snake.js extending BaseGame with highscore mode
3. Implement core mechanics (movement, eating, collision)
4. Add food types (regular + bonus)
5. Implement speed levels
6. Add obstacles (level 6+)
7. Wire up sound effects
8. Add mobile swipe controls
9. Add to game registry in js/main.js

### Phase 4: Testing & Polish
1. Test on desktop (Chrome, Firefox, Safari)
2. Test on mobile (iOS Safari, Android Chrome)
3. Verify localStorage persistence
4. Test sound muting and volume
5. Accessibility audit (keyboard nav, screen readers)

### Rollback Strategy
- Git commit after each phase
- Feature flags not needed (can revert individual files)
- localStorage uses different keys, so no data migration needed

## Open Questions

1. **Should bonus food spawn timer be visible to player?**
   - Could add countdown indicator below food
   - Decision: Hidden for MVP (adds tension), evaluate after testing

2. **Should Snake game have pause functionality?**
   - Current plan: Yes, with Space key or tap to pause
   - Need to ensure pause state doesn't exploit game timing

3. **Should sound be on by default?**
   - Current plan: Yes, at 30% volume
   - Will add mute button in header next to game title
