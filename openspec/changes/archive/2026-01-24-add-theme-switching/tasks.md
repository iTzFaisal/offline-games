# Tasks: Add Theme Switching

## Implementation Tasks

### Phase 1: CSS Theming Foundation
1. **Add light theme CSS variables**
   - Create light theme color scheme in main.css
   - Add data attribute selectors for theme switching
   - Add system preference detection with @media query
   - Validate: Light theme applies when data-theme="light" set

2. **Update games.css for theme support**
   - Replace any hardcoded colors with CSS variables
   - Add light theme specific overrides if needed
   - Add theme transition animations
   - Validate: All game pages respond to theme changes

### Phase 2: Theme Management Module
3. **Create theme.js module**
   - Create js/theme.js with theme detection logic
   - Implement localStorage read/write for theme preference
   - Implement system preference detection (matchMedia)
   - Implement theme toggle function
   - Validate: Module exports required functions

4. **Initialize theme on page load**
   - Load theme.js in main.js and game pages
   - Apply theme before page render (prevent FOUC)
   - Set data attribute on html element
   - Validate: Correct theme applies on load, respects system preference and localStorage

### Phase 3: UI Controls
5. **Add theme toggle to homepage**
   - Add theme toggle button to index.html header
   - Style button with sun/moon icons
   - Wire up click handler to theme.toggle()
   - Validate: Button switches themes, icon updates

6. **Add theme toggle to game pages**
   - Add theme toggle button to games/tictactoe.html header
   - Ensure consistent styling with homepage
   - Wire up click handler
   - Validate: Button works on game pages, persists across pages

### Phase 4: Polish
7. **Add smooth theme transitions**
   - Add CSS transitions for theme-relevant properties
   - Exclude transitions on initial page load
   - Validate: Smooth theme switch, no flash on load

8. **Test theme persistence**
   - Verify localStorage saves theme choice
   - Verify theme persists across page refreshes
   - Verify theme persists across different pages
   - Validate: Theme choice remembered across sessions

9. **Test system preference detection**
   - Test with OS in dark mode
   - Test with OS in light mode
   - Test manual override behavior
   - Validate: Default theme matches OS, override works correctly

10. **Accessibility testing**
    - Verify keyboard navigation for theme toggle
    - Verify ARIA labels on toggle button
    - Verify color contrast ratios in both themes
    - Validate: WCAG AA compliant in both themes

### Phase 5: Documentation
11. **Update README documentation**
    - Document theme switching feature
    - Document how to add more themes in future
    - Validate: README accurately describes feature

## Task Dependencies
```
1 → 2 → 3 → 4 → 5
              ↓
              6 → 7 → 8 → 9 → 10 → 11
```

## Parallelizable Work
- Task 11 (documentation) can happen anytime after implementation starts
- Tasks 8, 9, 10 (testing) can run in parallel

## Definition of Done
- [x] All tasks completed
- [x] Light and dark themes both work correctly
- [x] System preference detection works
- [x] Manual override works and persists
- [x] Theme toggle on all pages
- [x] Smooth transitions between themes
- [x] Accessible (keyboard, ARIA, contrast)
- [x] Documentation updated
