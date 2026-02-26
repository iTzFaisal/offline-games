# retro-theme Specification

## Purpose
Defines the retro arcade visual theme applied across all pages and games in the offline games website.

## ADDED Requirements

### Requirement: Retro arcade color scheme

The system SHALL display all UI elements using a retro arcade color palette with neon accents on dark backgrounds.

#### Scenario: Website loads with retro colors
- **WHEN** a user visits any page on the website
- **THEN** the background uses deep arcade black (#0a0a12)
- **AND** card backgrounds use dark blue-black (#1a1a2e)
- **AND** primary elements use neon magenta (#ff00ff)
- **AND** secondary elements use cyan (#00ffff)
- **AND** success indicators use neon green (#39ff14)
- **AND** warnings use bright yellow (#ffff00)
- **AND** errors use arcade red (#ff0040)

#### Scenario: Text is readable on dark backgrounds
- **WHEN** text is displayed on any page
- **THEN** primary text uses off-white (#e0e0e0)
- **AND** secondary text uses dimmed gray (#a0a0b0)
- **AND** all text has minimum 4.5:1 contrast ratio against backgrounds

### Requirement: Pixel font typography

The system SHALL use pixel fonts for all text to evoke retro arcade aesthetics.

#### Scenario: Headers use pixel font
- **WHEN** a page loads with h1, h2, or h3 elements
- **THEN** headers use Press Start 2P font
- **AND** the font loads from Google Fonts CDN
- **AND** fallback fonts include 'Courier New', monospace

#### Scenario: Body text uses readable pixel font
- **WHEN** body text, buttons, or card content is displayed
- **THEN** text uses VT323 font at 1.25rem size
- **AND** the font loads from Google Fonts CDN
- **AND** fallback fonts include 'Courier New', monospace

### Requirement: Neon glow effects

The system SHALL apply neon glow effects to interactive elements using CSS box-shadow.

#### Scenario: Buttons have neon glow
- **WHEN** a button is displayed
- **THEN** the button has a 3px solid border in the primary color
- **AND** the button has a box-shadow glow effect (0 0 10px color, 0 0 20px color with transparency)
- **AND** the button has no border-radius (pixel-perfect corners)

#### Scenario: Hover increases glow intensity
- **WHEN** a user hovers over a button
- **THEN** the glow effect becomes brighter (0 0 15px color, 0 0 30px color with increased transparency)
- **AND** the background color changes to the border color
- **AND** text color inverts for contrast

### Requirement: Game cards have arcade styling

The system SHALL display game cards with neon borders and inset shadows.

#### Scenario: Game card displays on homepage
- **WHEN** the homepage loads
- **THEN** each game card has a 2px cyan border
- **AND** the card has an outer glow effect in cyan
- **AND** the card has an inner shadow (inset 0 0 20px black)
- **AND** the card uses pixel fonts for title and description

### Requirement: Text glow on headings

The system SHALL apply a subtle glow effect to all headings.

#### Scenario: Headings have text glow
- **WHEN** h1, h2, or game title elements are displayed
- **THEN** the text has a text-shadow with semi-transparent magenta
- **AND** the text color is neon magenta
- **AND** the glow effect is visible but not overwhelming

### Requirement: Reduced glow on mobile

The system SHALL reduce glow effects on mobile devices for performance and battery life.

#### Scenario: Mobile device loads website
- **WHEN** a user views the website on a device with max-width 768px
- **THEN** all glow effects use reduced intensity (smaller blur radius, lower opacity)
- **AND** all touch targets are at least 44x44 pixels for accessibility

### Requirement: No theme toggle

The system SHALL NOT provide a theme toggle button or alternative theme options.

#### Scenario: Header has no theme toggle
- **WHEN** a user views any page header
- **THEN** no theme toggle button is displayed
- **AND** the retro theme is permanently applied
- **AND** no localStorage theme preference is stored

### Requirement: Smooth color transitions

The system SHALL apply smooth transitions when interactive elements change state.

#### Scenario: Button hover transitions smoothly
- **WHEN** a user hovers over a button
- **THEN** background and text colors transition over 200ms
- **AND** the glow effect transitions smoothly
- **AND** the transition uses ease-in-out timing function

#### Scenario: No flash of unstyled content
- **WHEN** a user loads any page
- **THEN** the correct fonts and colors are applied immediately
- **AND** no flash of default styling occurs
- **AND** Google Fonts are loaded in <head> before body renders
