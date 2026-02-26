# AGENTS.md

Guidance for agentic coding tools working in this repository. Keep changes offline-first, dependency-free, and accessible.

## Quick Facts
- Tech stack: HTML5, CSS3, Vanilla JS (ES6+), no build tools, no npm packages.
- Runs entirely in the browser; offline after initial load.
- Persistence uses localStorage with `games_` prefixes.
- Accessibility and responsive behavior are non-negotiable.

## Build / Lint / Test
There is no build system, linter, or automated test framework in this repo.

### Run Locally
- Open in browser: `open index.html`
- Local server (recommended for relative paths): `uv --script http.server 8000`
- Alt local server: `python3 -m http.server 8000`

### Lint
- None configured. Keep code consistent with existing style.

### Tests
- Manual testing only. Validate behavior in the browser.
- Single test: not applicable (no automated tests).

### Suggested Manual Checks
- Load `index.html` and the game page you edited.
- Verify theme toggle, keyboard navigation, and ARIA labels.
- Check mobile layout (responsive) and `prefers-reduced-motion`.

## Project Structure
- `index.html`: Homepage rendering game cards from registry.
- `games/*.html`: Individual game pages.
- `js/main.js`: Game registry + homepage logic.
- `js/games/base.js`: BaseGame with score tracking.
- `js/games/*.js`: Game implementations.
- `js/theme.js`: Theme manager; must load early to avoid FOUC.
- `css/main.css`: Global styles + theme variables.
- `css/games.css`: Game-specific styles.

## Core Conventions
### Architecture
- Game registry is the single source of truth in `js/main.js` (`gameRegistry`).
- Every game extends `BaseGame` and uses localStorage for scores.
- Theme changes are centralized in `ThemeManager`.

### Adding a Game
1. Add `games/<game>.html` linking `../css/main.css` and `../css/games.css`.
2. Add `js/games/<game>.js` with a class extending `BaseGame`.
3. Register in `gameRegistry` with `id`, `name`, `description`, `path`.
4. Add game-specific styles in `css/games.css`.

## Code Style Guidelines
### JavaScript
- ES6+ only; no framework imports or external libraries.
- Prefer classes for game logic; use `BaseGame` inheritance.
- Use `const` by default; `let` only when reassigned; avoid `var`.
- Naming:
  - Classes: PascalCase (`TicTacToe`).
  - Functions/variables: camelCase (`initHomepage`).
  - Constants: UPPER_SNAKE_CASE only for true constants.
- Use JSDoc for non-trivial functions and public methods.
- Keep functions focused; avoid long, nested control flows.
- Use DOM APIs directly (`document.createElement`, `querySelector`).

### Imports / Modules
- No bundlers; scripts are loaded via `<script>` tags in HTML.
- Avoid module systems unless already used (only `module.exports` in `js/theme.js`).
- When adding new scripts, update HTML and load order explicitly.

### Error Handling
- Guard DOM access: check element existence before use.
- Use `try/catch` for localStorage operations (see `js/theme.js`).
- Log errors with `console.error` for missing critical DOM nodes.
- Prefer graceful degradation over throwing exceptions.

### Types
- No TypeScript; keep runtime checks minimal and focused.
- Use clear naming and JSDoc for parameter/return hints.

### CSS
- Use CSS variables for colors and theme values.
- Keep styles responsive; prefer flex/grid with mobile-first adjustments.
- Respect `prefers-reduced-motion` and `prefers-contrast`.
- Keep selectors specific but simple; avoid deep nesting.

### HTML
- Semantic structure: `header`, `main`, `footer`, `article`.
- Include ARIA labels for interactive elements.
- Load `js/theme.js` in `<head>` to prevent FOUC.

## Accessibility & UX Requirements
- Keyboard navigation for all interactive elements.
- Visible focus states.
- WCAG AA contrast where possible.
- Maintain ARIA labels on buttons and controls.

## Storage Conventions
- Score storage: `games_scores_<gameId>`.
- Theme storage: `games_theme`.
- Game IDs: lowercase, no spaces (e.g., `tictactoe`).

## Repo Constraints (from existing guidance)
- No frameworks, no npm packages, no build tools.
- Offline-first, all code runs client-side.
- Support modern browsers with ES6, CSS Grid/Flexbox, CSS variables, localStorage.

## Agent Workflow Notes
- Prefer small, targeted changes.
- Avoid adding new dependencies or tooling.
- Update documentation when behavior changes.
- Manual test in the browser after any UI change.
