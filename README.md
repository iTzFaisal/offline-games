# Offline Games Website

A retro arcade-themed collection of classic games that run entirely in your browser. No internet connection required after the initial page load. Features a nostalgic neon aesthetic with authentic arcade gameplay.

## Tech Stack

- **HTML5 Canvas** - Hardware-accelerated game rendering
- **CSS3** - Retro arcade theme with CSS Grid and Flexbox
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JavaScript
- **Web Audio API** - Procedural sound generation (no external audio files)

## Project Structure

```
/
├── index.html              # Homepage with game library
├── css/
│   ├── main.css           # Global styles and retro theme variables
│   └── games.css          # Game-specific styles
├── js/
│   ├── main.js            # Homepage logic and game registry
│   ├── sound.js           # Procedural audio manager
│   └── games/
│       ├── base.js        # Base game class with score tracking
│       ├── tictactoe.js   # Tic-Tac-Toe game
│       ├── snake.js       # Snake game
│       ├── pong.js        # Pong game
│       ├── breakout.js    # Breakout game
│       ├── invaders.js    # Space Invaders game
│       └── asteroids.js   # Asteroids game
└── games/
    ├── tictactoe.html     # Tic-Tac-Toe game page
    ├── snake.html         # Snake game page
    ├── pong.html          # Pong game page
    ├── breakout.html      # Breakout game page
    ├── invaders.html      # Space Invaders game page
    └── asteroids.html     # Asteroids game page
```

## How to Run

1. Open `index.html` in a web browser, or
2. Use a local server:
   ```bash
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Adding a New Game

To add a new game to the website, follow these steps:

### 1. Create the Game HTML File

Create a new file in the `games/` directory (e.g., `games/snake.html`):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Game | Offline Games</title>
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/games.css">
</head>
<body>
    <!-- Your game UI here -->
    <script src="../js/games/base.js"></script>
    <script src="../js/games/yourgame.js"></script>
</body>
</html>
```

### 2. Create the Game JavaScript File

Create a new file in `js/games/` (e.g., `js/games/snake.js`):
```javascript
class YourGame extends BaseGame {
    constructor() {
        super('yourgame'); // Unique game ID for score tracking
        // Your game initialization
    }

    // Implement game methods
}
```

### 3. Register the Game

Add your game to the `gameRegistry` in `js/main.js`:
```javascript
const gameRegistry = {
    tictactoe: { /* existing */ },
    yourgame: {
        id: 'yourgame',
        name: 'Your Game Name',
        description: 'Brief description of the game',
        path: 'games/yourgame.html'
    }
};
```

## Current Games

### Tic-Tac-Toe
- **Modes**: Single player (vs AI) and Two player (local)
- **AI Difficulties**: Easy, Medium, Hard (unbeatable minimax)
- **Features**: Score tracking, responsive design, keyboard accessible

### Snake
- **Gameplay**: Guide the snake to eat food and grow longer
- **Features**: 10 levels of increasing difficulty, bonus food, obstacles
- **Controls**: Arrow keys or WASD, swipe gestures on mobile

### Pong
- **Gameplay**: Classic paddle game - first to 10 points wins
- **Modes**: 1 Player (vs AI) or 2 Players (local)
- **AI Difficulties**: Easy, Medium, Hard with realistic paddle physics
- **Features**: Ball angle deflection based on paddle hit position

### Breakout
- **Gameplay**: Break all the bricks with the bouncing ball
- **Features**: Power-ups (wide paddle, multi-ball, laser), multi-hit bricks
- **Progression**: Multiple levels with increasing ball speed and different brick patterns
- **Controls**: Arrow keys, A/D, or touch drag

### Space Invaders
- **Gameplay**: Defend Earth from waves of descending alien invaders
- **Features**: Destructible bunkers, mystery UFO bonus rounds, wave progression
- **Alien Types**: 3 types with different point values (10, 20, 30 points)
- **Controls**: Arrow keys or A/D to move, Space to shoot

### Asteroids
- **Gameplay**: Navigate space and destroy asteroids with your ship
- **Features**: Vector-style graphics, screen wrapping, asteroid splitting mechanics
- **Progression**: Multiple levels with more asteroids and UFO enemies
- **Controls**: Arrow keys or WASD for rotation/thrust, Space to fire

## Retro Arcade Theme

The website features a permanent retro arcade aesthetic inspired by classic 80s arcade cabinets:

### Theme Features
- **Neon Colors**: Magenta, cyan, neon green, yellow, and arcade red
- **Pixel Fonts**: Press Start 2P for headings, VT323 for body text
- **Glow Effects**: CSS box-shadows create authentic neon glow
- **Dark Background**: Deep arcade black/blue-black color scheme
- **Mute Button**: Toggle sound effects on/off (persisted across sessions)

### Visual Elements
- Canvas-based games with vector-style rendering
- Animated UI elements with retro color palette
- Responsive design that maintains arcade aesthetic on all devices

## Score Storage

Scores are stored in `localStorage` with two different modes:

### Competitive Mode (Tic-Tac-Toe)
Key: `games_scores_<gameId>`
```javascript
{
  wins: 0,
  losses: 0,
  draws: 0,
  gamesPlayed: 0,
  lastPlayed: "2025-01-24T23:00:00.000Z"
}
```

### High Score Mode (Snake, Pong, Breakout, Space Invaders, Asteroids)
Key: `games_highscore_<gameId>`
- Stores single best score
- Tracks new high scores with visual indicator
- Persists across page refreshes

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript (classes, arrow functions, template literals)
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- CSS `prefers-color-scheme` media query
- localStorage API

## Accessibility

- **Keyboard Navigation**: All interactive elements are accessible via keyboard
- **ARIA Labels**: Proper labels for screen readers
- **Focus Indicators**: Visible focus states for keyboard users
- **Color Contrast**: WCAG AA compliant in both light and dark themes
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## License

Free to use and modify.
