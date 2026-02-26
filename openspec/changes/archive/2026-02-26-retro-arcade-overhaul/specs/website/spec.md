# website Specification (Delta)

## Purpose
This delta spec documents changes to the existing website capability, specifically replacing the light/dark theme system with a permanent retro arcade theme.

## REMOVED Requirements

### Requirement: Light and dark theme support
**Reason**: Replaced by permanent retro arcade theme as per retro-theme specification
**Migration**: All pages now use the retro theme exclusively. Theme toggle is removed.

### Requirement: Manual theme override
**Reason**: No longer applicable with single theme system
**Migration**: Users no longer need to toggle themes. Retro theme is always active.

### Requirement: Theme persistence
**Reason**: No longer applicable with single theme system
**Migration**: Remove 'games_theme' localStorage key. Theme is no longer a user preference.

### Requirement: Theme toggle control
**Reason**: Theme toggle button removed from header
**Migration**: Header now displays mute button in place of theme toggle.

### Requirement: Smooth theme transitions
**Reason**: No longer applicable with single theme system
**Migration**: Transitions still exist for hover states and interactive elements, but not for theme switching.

## MODIFIED Requirements

### Requirement: Homepage listing available games

The system SHALL provide a homepage listing available games using retro arcade styling.

#### Scenario: User visits the website
- **WHEN** a user navigates to the website root
- **THEN** a homepage is displayed showing all available games
- **AND** each game is displayed as a card with neon cyan border and glow effect
- **AND** game titles use Press Start 2P font
- **AND** game descriptions use VT323 font
- **AND** the background is deep arcade black (#0a0a12)

#### Scenario: User clicks Play on a game
- **WHEN** the user clicks the "Play" button for a game
- **THEN** the user is navigated to that game's page
- **AND** a click sound effect plays (if not muted)
- **AND** the button hover effect activates before navigation

### Requirement: Score tracking and persistence

The system SHALL track and persist game scores using appropriate scoring models for each game type.

#### Scenario: Competitive game scores are saved
- **GIVEN** a game uses competitive scoring mode (e.g., Tic-Tac-Toe)
- **WHEN** the game concludes (win, lose, or draw)
- **THEN** the result is saved to localStorage with keys for wins, losses, and draws
- **AND** the score counter is updated on screen

#### Scenario: High score game saves best score
- **GIVEN** a game uses high score mode (e.g., Snake)
- **WHEN** the game ends
- **THEN** the final score is compared to the stored high score
- **AND** if the final score is higher, it becomes the new high score
- **AND** the high score is saved to localStorage with key 'games_highscore_<gameid>'

### Requirement: Responsive mobile design

The system SHALL be responsive and work on mobile devices with reduced visual effects.

#### Scenario: User accesses site on mobile
- **WHEN** a user accesses the site on a mobile device (max-width 768px)
- **THEN** the layout adapts to the smaller screen
- **AND** glow effects use reduced intensity for battery life
- **AND** all touch targets are at least 44x44 pixels
- **AND** the game board or canvas scales appropriately

## ADDED Requirements

### Requirement: Mute control in header

The system SHALL provide a sound mute toggle button on all pages.

#### Scenario: Mute button is visible in header
- **WHEN** any page loads
- **THEN** a mute toggle button is visible in the header
- **AND** the button shows a speaker icon when sounds are enabled
- **AND** the button shows a muted speaker icon when sounds are disabled
- **AND** the button uses neon magenta styling matching the retro theme

#### Scenario: Mute button is accessible
- **WHEN** a user navigates with keyboard
- **THEN** the mute button can be focused with Tab key
- **AND** the button can be activated with Enter or Space key
- **AND** the button has an appropriate ARIA label ("Mute sounds" or "Unmute sounds")

#### Scenario: Mute state persists across sessions
- **WHEN** a user toggles the mute button
- **THEN** the mute state is saved to localStorage with key 'games_sound_muted'
- **AND** the mute state is restored on subsequent page loads
- **AND** the mute state is consistent across all pages and games
