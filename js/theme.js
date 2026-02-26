/**
 * Theme Management Module
 * Simplified version - retro arcade theme is permanent (no toggle)
 * Loaded early to prevent FOUC (Flash of Unstyled Content)
 */

const ThemeManager = {
    /**
     * Initialize theme on page load
     * Ensures fonts are loaded early and applies retro theme
     */
    init() {
        // Retro theme is permanent - no toggle logic needed
        // This module exists for backward compatibility and future extensibility
        const html = document.documentElement;
        html.setAttribute('data-theme', 'retro');
    }
};

// Auto-initialize on script load to prevent FOUC
if (typeof document !== 'undefined') {
    ThemeManager.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

