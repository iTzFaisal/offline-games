# Spec: Theme Switching

Capability: `website`

## ADDED Requirements

### Requirement: Light and dark theme support

The system SHALL provide light and dark theme options.

#### Scenario: Website loads with system preference
- **Given** a user has not manually set a theme preference
- **When** the user visits the website
- **Then** the theme matches the user's system preference (light or dark mode)
- **And** the theme is applied immediately on page load

#### Scenario: Website applies dark theme
- **Given** the dark theme is active
- **When** the user views any page
- **Then** dark backgrounds and light text are displayed
- **And** all UI elements use dark theme colors

#### Scenario: Website applies light theme
- **Given** the light theme is active
- **When** the user views any page
- **Then** light backgrounds and dark text are displayed
- **And** all UI elements use light theme colors

### Requirement: Manual theme override

The system SHALL allow users to manually override the system theme preference.

#### Scenario: User manually selects light theme
- **Given** the user is on any page
- **When** the user clicks the theme toggle button to select light theme
- **Then** the light theme is applied immediately
- **And** the preference overrides the system theme

#### Scenario: User manually selects dark theme
- **Given** the user is on any page
- **When** the user clicks the theme toggle button to select dark theme
- **Then** the dark theme is applied immediately
- **And** the preference overrides the system theme

#### Scenario: User toggles between themes
- **Given** a theme is currently active
- **When** the user clicks the theme toggle button
- **Then** the theme switches to the other option (light ↔ dark)
- **And** the transition is smooth and animated

### Requirement: Theme persistence

The system SHALL persist the user's theme choice across sessions.

#### Scenario: Theme preference is saved
- **Given** a user manually selects a theme
- **When** the selection is made
- **Then** the preference is saved to localStorage

#### Scenario: Theme preference persists across page refreshes
- **Given** a user has manually selected a theme
- **When** the user refreshes the page
- **Then** the manually selected theme is applied
- **And** the system preference is ignored

#### Scenario: Theme preference persists across different pages
- **Given** a user has manually selected a theme on the homepage
- **When** the user navigates to a game page
- **Then** the manually selected theme is applied on the game page
- **And** the theme remains consistent across all pages

#### Scenario: Theme preference persists across sessions
- **Given** a user has manually selected a theme
- **When** the user closes and reopens the browser
- **Then** the manually selected theme is applied on return
- **And** the preference is remembered until changed

### Requirement: Theme toggle control

The system SHALL provide a theme toggle button on all pages.

#### Scenario: Theme toggle button is visible
- **Given** a user is on any page (homepage or game page)
- **When** the page loads
- **Then** a theme toggle button is visible in the header
- **And** the button shows an icon indicating the current theme (sun for light, moon for dark)

#### Scenario: Theme toggle button is accessible
- **Given** a theme toggle button is displayed
- **When** the user navigates with keyboard
- **Then** the button can be focused with Tab key
- **And** the button can be activated with Enter or Space key
- **And** the button has an appropriate ARIA label

### Requirement: Smooth theme transitions

The system SHALL apply smooth transitions when switching themes.

#### Scenario: Theme switch animates smoothly
- **Given** a user clicks the theme toggle button
- **When** the theme changes
- **Then** background and text colors transition smoothly over 300ms
- **And** the transition feels polished and intentional

#### Scenario: No flash on page load
- **Given** a user visits any page
- **When** the page loads
- **Then** the correct theme is applied immediately
- **And** no flash of unstyled content or wrong theme occurs

## Related Capabilities
- `website` - This feature enhances all existing website requirements with theming support
