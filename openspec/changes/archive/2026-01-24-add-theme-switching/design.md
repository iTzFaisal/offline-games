# Design: Theme Switching

## Context
The current website uses CSS variables defined in `:root` but only provides one color scheme (dark theme). We need to add support for light and dark themes with system preference detection and manual override capability.

## Goals / Non-Goals

### Goals
- Support both light and dark color schemes
- Respect user's system preference by default
- Allow users to manually override the theme
- Persist theme choice across sessions
- Apply theme consistently across all pages
- Smooth transitions between themes

### Non-Goals
- Custom color schemes beyond light/dark
- Theme scheduling (automatic based on time of day)
- Per-game themes
- High contrast mode (can be added later)

## Decisions

### 1. CSS Variable Approach
Use CSS custom properties (variables) with data attribute selectors:

```css
:root {
    /* Default (dark) variables */
}

:root[data-theme="light"] {
    /* Light theme overrides */
}

:root[data-theme="dark"] {
    /* Dark theme (explicit) */
}

@media (prefers-color-scheme: light) {
    :root:not([data-theme]) {
        /* Light theme when no manual preference set */
    }
}
```

**Rationale**: Clean separation of concerns, easy to maintain, performant, works with existing CSS.

**Alternatives considered**:
- Separate CSS files - Rejected due to duplication and FOUC
- CSS classes - Rejected as data attributes are more semantic for themes
- CSS custom properties only - Rejected as we need explicit overrides

### 2. Theme Toggle Button
Place in header of each page:
- Icon button (sun/moon) with tooltip
- Consistent position across all pages
- Keyboard accessible

**Rationale**: Visible, discoverable, standard pattern.

### 3. localStorage Persistence
Store theme preference with key: `games_theme`
Values: `'light'`, `'dark'`, or `null` (system preference)

**Rationale**: Simple, aligns with existing score storage pattern.

### 4. Color Scheme Design

#### Dark Theme (Current)
- Background: Dark blue gradient (#1a1a2e to #16213e)
- Card: Dark blue (#0f3460)
- Text: Light gray (#eee)
- Accents: Blue (#4a90e2) and teal (#50e3c2)

#### Light Theme (New)
- Background: Light gray/white (#f5f7fa to #ffffff)
- Card: White with shadow (#ffffff)
- Text: Dark gray (#2c3e50)
- Accents: Same blue (#4a90e2) and teal (#50e3c2)

**Rationale**: Keep accent colors consistent for brand identity, invert luminance for readability.

### 5. JavaScript Module
Create `js/theme.js` that:
- Detects system preference on load
- Checks localStorage for manual override
- Applies theme via data attribute on `<html>` element
- Provides toggle function
- Listens for system theme changes (optional enhancement)

**Rationale**: Centralized theme logic, reusable across pages.

## Implementation Details

### Files to Modify
1. `css/main.css` - Add light theme variables
2. `css/games.css` - Update any hardcoded colors to use variables
3. `index.html` - Add theme toggle button
4. `games/tictactoe.html` - Add theme toggle button
5. `js/main.js` - Initialize theme module
6. `js/theme.js` - NEW: Theme management module

### Theme Application Order
1. Check localStorage for manual preference
2. If found, apply that theme
3. If not found, check `window.matchMedia('(prefers-color-scheme: dark)')`
4. Apply system preference
5. Set data attribute on `<html>` element

### Transition Strategy
Add `transition: background-color 0.3s, color 0.3s` to body and major elements for smooth theme switching. Exclude during page load to prevent FOUC.

## Risks / Trade-offs

### Risk: Flash of Unstyled Content (FOUC)
**Mitigation**: Set default theme in `<html>` tag before CSS loads, or use inline script to apply theme immediately.

### Risk: Theme Inconsistency Across Pages
**Mitigation**: Centralized theme.js module loaded on all pages, consistent localStorage key.

### Trade-off: Browser Support
`prefers-color-scheme` media query supported in 95%+ browsers. Gracefully degrades to default (dark) theme.

## Migration Plan
1. Add CSS variables for light theme
2. Create theme.js module
3. Update HTML files to include theme toggle and script
4. Test on all pages
5. Verify localStorage persistence
6. Test system preference detection

## Open Questions
- None - requirements are clear
