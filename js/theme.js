/**
 * Theme Management Module
 * Handles light/dark theme switching with system preference detection and localStorage persistence
 */

const ThemeManager = {
    STORAGE_KEY: 'games_theme',

    /**
     * Initialize theme on page load
     * Must be called as early as possible to prevent FOUC
     */
    init() {
        // Apply theme immediately from localStorage or system preference
        const theme = this.getStoredTheme() || this.getSystemTheme();
        this.applyTheme(theme);

        // Listen for system theme changes (optional enhancement)
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', () => {
                // Only update if user hasn't set a manual preference
                if (!this.getStoredTheme()) {
                    this.applyTheme(this.getSystemTheme());
                }
            });
        }
    },

    /**
     * Get theme from localStorage
     * @returns {string|null} 'light', 'dark', or null
     */
    getStoredTheme() {
        try {
            return localStorage.getItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    },

    /**
     * Get system theme preference
     * @returns {string} 'light' or 'dark'
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    },

    /**
     * Apply theme to the document
     * @param {string} theme - 'light' or 'dark'
     */
    applyTheme(theme) {
        const html = document.documentElement;

        if (theme === 'light') {
            html.setAttribute('data-theme', 'light');
        } else if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            // Remove data attribute to use system preference
            html.removeAttribute('data-theme');
        }

        // Update theme toggle button icons if it exists
        this.updateToggleButton();
    },

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Save to localStorage
        try {
            localStorage.setItem(this.STORAGE_KEY, newTheme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }

        // Apply new theme
        this.applyTheme(newTheme);
    },

    /**
     * Get current active theme
     * @returns {string} 'light' or 'dark'
     */
    getCurrentTheme() {
        const stored = this.getStoredTheme();
        if (stored) {
            return stored;
        }
        return this.getSystemTheme();
    },

    /**
     * Update theme toggle button icons
     */
    updateToggleButton() {
        const toggleButton = document.querySelector('.theme-toggle');
        if (!toggleButton) return;

        const currentTheme = this.getCurrentTheme();
        const sunIcon = toggleButton.querySelector('.icon-sun');
        const moonIcon = toggleButton.querySelector('.icon-moon');

        if (currentTheme === 'light') {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
            toggleButton.setAttribute('aria-label', 'Switch to dark mode');
        } else {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
            toggleButton.setAttribute('aria-label', 'Switch to light mode');
        }
    }
};

// Auto-initialize on script load
if (typeof document !== 'undefined') {
    // Apply theme immediately to prevent FOUC
    ThemeManager.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
