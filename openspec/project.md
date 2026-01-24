# Project Context

## Purpose
A simple, lightweight website for playing offline games directly in the browser. The goal is to provide classic games that work entirely client-side with no internet connection required after the initial page load.

## Tech Stack
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JavaScript

## Project Conventions

### Code Style
- Use ES6+ JavaScript features (classes, arrow functions, template literals)
- Follow JSDoc conventions for function documentation
- Use camelCase for variables and functions
- Use PascalCase for class names
- Avoid frameworks - write vanilla JavaScript

### Architecture Patterns
- **Game Registry Pattern**: All games are registered in `js/main.js` with a consistent configuration object
- **Base Class Inheritance**: Games extend `BaseGame` class for common functionality (score tracking)
- **Module Pattern**: Separate modules for theme management (`js/theme.js`)
- **Semantic HTML5**: Use proper semantic elements (header, main, article, footer)
- **localStorage**: Persist scores and theme preferences

### Testing Strategy
Manual testing in browsers. No automated testing framework currently implemented.

### Git Workflow
- Main branch: `main`
- Commit messages should be descriptive of changes made
- No specific branching strategy documented yet

## Domain Context

### Game Structure
Each game consists of:
1. **HTML file** in `games/` directory (e.g., `games/tictactoe.html`)
2. **JavaScript file** in `js/games/` directory (e.g., `js/games/tictactoe.js`)
3. **Game registry entry** in `js/main.js`

### Adding a New Game
1. Create HTML file in `games/` that links to `../css/main.css` and `../css/games.css`
2. Create JavaScript class in `js/games/` that extends `BaseGame`
3. Add game to `gameRegistry` in `js/main.js` with properties: `id`, `name`, `description`, `path`

### Score Storage Format
```javascript
{
  wins: 0,
  losses: 0,
  draws: 0,
  gamesPlayed: 0,
  lastPlayed: "2025-01-24T23:00:00.000Z"
}
```
Storage key format: `games_scores_<gameId>`

## Important Constraints
- **Offline-first**: All code must run client-side without internet
- **No frameworks**: Do not introduce React, Vue, jQuery, or other libraries
- **Browser compatibility**: Support modern browsers with ES6, CSS Grid/Flexbox, CSS variables, localStorage
- **Accessibility**: WCAG AA compliant, keyboard navigation, ARIA labels
- **Responsive**: Must work on mobile and desktop

## External Dependencies
None. All code runs locally in the browser with no external APIs or services.
