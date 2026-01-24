# Offline Games Website

A simple, lightweight website for playing offline games directly in your browser. No internet connection required after the initial page load.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JavaScript

## Project Structure

```
/
├── index.html              # Homepage with game library
├── css/
│   ├── main.css           # Global styles and theme variables
│   └── games.css          # Game-specific styles
├── js/
│   ├── main.js            # Homepage logic and game registry
│   ├── theme.js           # Theme management module
│   └── games/
│       ├── base.js        # Base game class with score tracking
│       └── tictactoe.js   # Tic-Tac-Toe game implementation
└── games/
    └── tictactoe.html     # Tic-Tac-Toe game page
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

## Theme Support

The website supports both light and dark themes with automatic system preference detection:

### Theme Features
- **System Preference**: Automatically detects and applies your OS theme (light/dark mode)
- **Manual Override**: Click the theme toggle button (sun/moon icon) in the header to switch themes
- **Persistence**: Your theme choice is saved and remembered across sessions
- **Smooth Transitions**: Animated theme switching for a polished experience

### Adding More Themes

To add custom themes beyond light/dark:

1. **Define CSS Variables** in `css/main.css`:
```css
:root[data-theme="custom"] {
    --primary-color: #your-color;
    --background-start: #your-bg;
    /* ... other variables */
}
```

2. **Update Theme Manager** in `js/theme.js`:
   - Add theme option to the toggle logic
   - Update icons/labels as needed

3. **Test the new theme** across all pages

## Score Storage

Scores are stored in `localStorage` with the key format `games_scores_<gameId>`:

```javascript
{
  wins: 0,
  losses: 0,
  draws: 0,
  gamesPlayed: 0,
  lastPlayed: "2025-01-24T23:00:00.000Z"
}
```

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
