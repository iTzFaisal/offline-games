## 1. Infrastructure Setup

- [x] 1.1 Add Google Fonts to index.html (Press Start 2P and VT323)
- [x] 1.2 Create js/sound.js with SoundManager class and Web Audio API initialization
- [x] 1.3 Implement master gain node and volume control in SoundManager
- [x] 1.4 Create oscillator-based sound generators (sine, square, sawtooth, triangle)
- [x] 1.5 Implement UI sound effects (click blip, hover tone slide)
- [x] 1.6 Implement gameplay sound effects (score chime, collision thud, wrong buzz, level up sweep)
- [x] 1.7 Implement game state sound effects (game over, high score fanfare)
- [x] 1.8 Implement Snake-specific sounds (eat, bonus eat, death)
- [x] 1.9 Add mute toggle functionality to SoundManager with localStorage persistence
- [x] 1.10 Extend BaseGame class in js/games/base.js with mode parameter ('competitive' or 'highscore')
- [x] 1.11 Implement high score mode logic in BaseGame (saveScore, getScores methods)

## 2. Theme Overhaul

- [x] 2.1 Replace CSS color variables in css/main.css with retro palette (backgrounds, neon colors)
- [x] 2.2 Update typography in css/main.css (Press Start 2P for headers, VT323 for body)
- [x] 2.3 Add neon glow effects to buttons in css/main.css (box-shadow, hover states)
- [x] 2.4 Style game cards with neon borders and inset shadows in css/main.css
- [x] 2.5 Add text glow effects to headings in css/main.css
- [x] 2.6 Implement reduced glow effects for mobile devices (@media max-width 768px)
- [x] 2.7 Add smooth transitions for interactive elements (200ms ease-in-out)
- [x] 2.8 Remove theme toggle button from index.html
- [x] 2.9 Add mute button to index.html header with proper ARIA labels
- [x] 2.10 Add mute button click handler in index.html script section
- [x] 2.11 Simplify js/theme.js (remove toggle logic, keep basic initialization)
- [x] 2.12 Update css/games.css with retro game-specific styles

## 3. Snake Game UI

- [x] 3.1 Create games/snake.html with HTML5 canvas (400x400px)
- [x] 3.2 Add score display (current score, level, high score) to snake.html
- [x] 3.3 Add control buttons (Restart, Back to Menu) to snake.html
- [x] 3.4 Link CSS files (main.css, games.css) in snake.html
- [x] 3.5 Load JavaScript files (theme.js, sound.js, base.js, snake.js) in snake.html
- [x] 3.6 Add canvas responsive scaling for mobile devices
- [x] 3.7 Add Google Fonts to snake.html head section
- [x] 3.8 Add mute button to snake.html header

## 4. Snake Game Logic - Core

- [x] 4.1 Create js/games/snake.js extending BaseGame with highscore mode
- [x] 4.2 Implement 20x20 grid initialization with 20px cell size
- [x] 4.3 Implement snake initialization (3 segments, center position)
- [x] 4.4 Implement game tick loop with requestAnimationFrame
- [x] 4.5 Implement snake movement logic (update head position, shift body)
- [x] 4.6 Implement direction change handling (arrow keys, WASD)
- [x] 4.7 Prevent snake from reversing into itself
- [x] 4.8 Implement canvas rendering (clear screen, draw snake, draw food, draw obstacles)

## 5. Snake Game Logic - Food & Scoring

- [x] 5.1 Implement regular food spawning at random empty locations
- [x] 5.2 Implement snake growth when eating regular food (+1 segment, +10 points)
- [x] 5.3 Implement food collision detection (head occupies food cell)
- [x] 5.4 Implement bonus food spawning (10% chance when regular food eaten)
- [x] 5.5 Implement bonus food lifetime (5 seconds with visual countdown)
- [x] 5.6 Implement bonus food eating (+2 segments, +50 points)
- [x] 5.7 Implement sound effects for eating (regular and bonus)
- [x] 5.8 Implement score display updates in real-time

## 6. Snake Game Logic - Speed & Obstacles

- [x] 6.1 Implement level system (level up every 50 points)
- [x] 6.2 Implement speed progression (150ms at level 1, decreasing by 10ms per level, minimum 60ms)
- [x] 6.3 Implement level-up sound effect and display
- [x] 6.4 Implement obstacle placement logic (0 obstacles at level 1-5, 3 at level 6-10, 5 at level 11+)
- [x] 6.5 Ensure obstacles don't spawn adjacent to snake starting position
- [x] 6.6 Render obstacles in arcade red color

## 7. Snake Game Logic - Collision & Game Over

- [x] 7.1 Implement wall collision detection (head outside grid bounds)
- [x] 7.2 Implement self collision detection (head hits body segment)
- [x] 7.3 Implement obstacle collision detection (head hits obstacle)
- [x] 7.4 Implement game over state and display
- [x] 7.5 Implement game over sound effect
- [x] 7.6 Implement high score check and celebration on new record
- [x] 7.7 Implement high score fanfare sound effect

## 8. Snake Game Controls

- [x] 8.1 Implement arrow key controls (up, down, left, right)
- [x] 8.2 Implement WASD key controls (W=up, S=down, A=left, D=right)
- [x] 8.3 Implement Space bar pause toggle
- [x] 8.4 Implement pause state display ("PAUSED" message)
- [x] 8.5 Implement touch swipe detection for mobile (up, down, left, right)
- [x] 8.6 Implement touch tap for pause toggle on mobile
- [x] 8.7 Prevent default touch behaviors within canvas (stop scrolling)
- [x] 8.8 Add Restart button functionality (reset snake, score, level)

## 9. Snake Game Navigation & Integration

- [x] 9.1 Implement "Back to Menu" button navigation to homepage
- [x] 9.2 Add Snake game entry to gameRegistry in js/main.js
- [x] 9.3 Verify Snake game appears on homepage with proper card styling
- [x] 9.4 Test high score persistence across page refreshes
- [x] 9.5 Test localStorage keys (games_highscore_snake, games_sound_muted)

## 10. Testing & Polish

- [x] 10.1 Test retro theme on Chrome desktop (colors, fonts, glow effects)
- [x] 10.2 Test retro theme on Firefox desktop (cross-browser consistency)
- [x] 10.3 Test retro theme on Safari desktop (font rendering)
- [x] 10.4 Test responsive design on iOS Safari mobile (touch targets, swipe)
- [x] 10.5 Test responsive design on Android Chrome mobile (swipe, scaling)
- [x] 10.6 Test all sound effects play correctly and are not too loud
- [x] 10.7 Test mute toggle functionality and persistence
- [x] 10.8 Test Snake game keyboard controls (arrows, WASD, pause)
- [x] 10.9 Test Snake game mobile swipe controls
- [x] 10.10 Test Snake game collision detection (walls, self, obstacles)
- [x] 10.11 Test Snake game food spawning (regular and bonus)
- [x] 10.12 Test Snake game speed progression through all 10 levels
- [x] 10.13 Test high score saving and loading
- [x] 10.14 Test new high score celebration and fanfare
- [x] 10.15 Verify Tic-Tac-Toe still works with existing competitive scoring
- [x] 10.16 Verify accessibility (keyboard navigation, ARIA labels, contrast ratios)
- [x] 10.17 Verify no flash of unstyled content on page load
- [x] 10.18 Performance test (60fps rendering, smooth animations)
