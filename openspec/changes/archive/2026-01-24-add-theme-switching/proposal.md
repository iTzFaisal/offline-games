# Change: Add Theme Switching

## Why
The website currently only has a dark theme. Users should be able to choose between light and dark modes to match their preferences. The theme should respect system preferences by default but allow manual override.

## What Changes
- Add light and dark theme color schemes
- Detect and apply user's system theme preference (prefers-color-scheme)
- Add theme toggle button to homepage and game pages
- Persist user's theme choice in localStorage
- Apply theme across all pages (homepage and game pages)
- Smooth transitions when switching themes

## Impact
- Affected specs: `website` (modify existing requirements, add theme switching)
- Affected code: CSS files (main.css, games.css), HTML files (index.html, game pages), JavaScript files (main.js, potentially theme.js)
