# Design: Offline Games Website

## Architecture Overview

### Project Structure
```
/
├── index.html              # Homepage with game library
├── css/
│   ├── main.css           # Global styles
│   └── games.css          # Game-specific styles
├── js/
│   ├── main.js            # Homepage logic
│   └── games/
│       ├── tictactoe.js   # Tic-Tac-Toe game logic
│       └── base.js        # Base game class/interface
└── games/
    └── tictactoe.html     # Tic-Tac-Toe game page
```

## Component Design

### 1. Game Registry System
A simple JavaScript object that registers available games:
```javascript
const gameRegistry = {
  tictactoe: {
    name: "Tic-Tac-Toe",
    description: "Classic 3x3 strategy game",
    path: "games/tictactoe.html",
    thumbnail: "images/tictactoe.png"
  }
  // Future games added here
};
```

### 2. Base Game Interface
All games should implement a common interface:
- `init()`: Initialize the game
- `start()`: Start a new game
- `reset()`: Reset the current game
- `saveScore(result)`: Save game result to localStorage
- `getScores()`: Retrieve historical scores

### 3. Score Storage Schema
```javascript
// localStorage key: "games_scores_<gameId>"
{
  wins: 0,
  losses: 0,
  draws: 0,
  gamesPlayed: 0,
  lastPlayed: "2025-01-24T23:00:00.000Z"
}
```

## Tic-Tac-Toe Specific Design

### Game State
```javascript
{
  board: Array(9).fill(null),  // 3x3 grid as flat array
  currentPlayer: 'X',          // 'X' or 'O'
  gameActive: true,            // Is game in progress?
  gameMode: 'ai' | '2p',       // Single player or two player
  aiDifficulty: 'easy' | 'medium' | 'hard',
  winningLine: null            // Array of indices when won
}
```

### AI Implementation
- **Easy**: Random moves
- **Medium**: Minimax with limited depth (2-3 moves)
- **Hard**: Full minimax algorithm (unbeatable)

### Win Detection
Hardcoded winning combinations (rows, columns, diagonals):
```javascript
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
  [0, 4, 8], [2, 4, 6]              // Diagonals
];
```

## UI/UX Design

### Homepage
- Grid layout of game cards
- Each card shows: game name, description, "Play" button
- Simple, clean design with game thumbnails (optional)
- Responsive: 1 column on mobile, 2-3 on desktop

### Game Page
- Game board centered on screen
- Score display at top (Wins / Losses / Draws)
- Controls: New Game, Difficulty selector, Mode toggle, Back to Home
- Status message area (whose turn, winner announcement)
- Responsive board that scales with viewport

## Technical Considerations

### Responsiveness
- Use CSS Grid/Flexbox for layout
- Board cells use `aspect-ratio` to maintain square shape
- Touch-friendly button sizes (min 44x44px)

### Accessibility
- Semantic HTML (`<button>`, `<main>`, `<nav>`)
- ARIA labels for game cells
- Keyboard navigation support
- Focus indicators visible

### Performance
- No external dependencies for fast load
- Minimal JavaScript (~300 lines total for MVP)
- CSS animations using transforms (GPU accelerated)

### Offline Capability
- All assets embedded or data URIs
- No external CDN links
- Works completely offline once loaded
- Can be enhanced to PWA later

## Trade-offs

### Why Vanilla JS over Framework?
- **Pros**: No build step, faster to learn, lighter weight, simpler deployment
- **Cons**: Manual DOM manipulation, no built-in state management
- **Decision**: Accept trade-offs for simplicity and learning value

### Why localStorage over IndexedDB?
- **Pros**: Simpler API, sufficient for small data
- **Cons**: Synchronous, limited to ~5MB
- **Decision**: Acceptable for just storing scores

### AI Algorithm Choice
- **Minimax**: Standard algorithm for Tic-Tac-Toe, unbeatable on hard mode
- **Alpha-beta pruning**: Not needed due to small game tree (9 cells)
- **Decision**: Minimax is sufficient and simpler to implement
