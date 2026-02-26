# invaders-game Specification

## Purpose

Defines the Space Invaders arcade game where players control a fixed-position ship to shoot descending alien invaders, featuring bunkers for cover and a mystery UFO.

## ADDED Requirements

### Requirement: Game canvas and layout

The system SHALL provide a Space Invaders game with player ship, alien formation, and bunkers rendered on HTML5 Canvas.

#### Scenario: Game canvas displays
- **WHEN** the Space Invaders game page loads
- **THEN** a 400x400 pixel canvas is displayed
- **THEN** the canvas contains a player ship at the bottom center
- **AND** the canvas contains rows of alien invaders at the top
- **AND** the canvas contains 4 bunkers between player and aliens
- **AND** the canvas scales responsively on mobile devices

#### Scenario: Canvas scales for mobile
- **WHEN** a user views the game on a mobile device
- **THEN** the canvas scales to fit the screen width
- **AND** the aspect ratio is preserved
- **AND** touch controls are enabled

### Requirement: Player ship controls

The system SHALL allow the player to move the ship horizontally and fire projectiles.

#### Scenario: Player moves ship left
- **WHEN** a player presses Left Arrow or A key
- **THEN** the ship moves left
- **AND** the ship stops at the left edge of the canvas

#### Scenario: Player moves ship right
- **WHEN** a player presses Right Arrow or D key
- **THEN** the ship moves right
- **AND** the ship stops at the right edge of the canvas

#### Scenario: Touch controls move ship
- **WHEN** a user touches the left side of the canvas
- **THEN** the ship moves left
- **AND** when the user touches the right side of the canvas
- **THEN** the ship moves right

#### Scenario: Player fires bullet
- **WHEN** a player presses Space bar
- **THEN** a bullet fires upward from the ship
- **AND** a sound effect plays
- **AND** only one bullet can be on screen at a time

### Requirement: Alien formation movement

The system SHALL move the alien formation horizontally and downward in a coordinated pattern.

#### Scenario: Aliens move horizontally
- **WHEN** the game is running
- **THEN** the entire alien formation moves horizontally
- **AND** the formation moves right initially
- **AND** the movement speed is determined by the number of remaining aliens

#### Scenario: Aliens drop down when reaching edge
- **WHEN** any alien reaches the edge of the canvas
- **THEN** the entire formation moves down by one row
- **AND** the formation reverses horizontal direction
- **AND** a sound effect plays

#### Scenario: Aliens speed up as their numbers decrease
- **WHEN** aliens are destroyed
- **THEN** the formation moves faster
- **AND** the speed increase is proportional to the percentage of aliens remaining

#### Scenario: Aliens reach player level
- **WHEN** any alien reaches the same Y position as the player ship
- **THEN** the game ends immediately
- **AND** a game over sound effect plays

### Requirement: Alien shooting

The system SHALL have aliens fire bullets at random intervals that destroy the player on hit.

#### Scenario: Bottom row aliens fire bullets
- **WHEN** the game is running
- **THEN** aliens in the bottom row randomly fire bullets
- **AND** each alien has a 0.1% chance per frame to fire
- **AND** bullets travel downward

#### Scenario: Alien bullets destroy bunkers
- **WHEN** an alien bullet hits a bunker
- **THEN** the bunker is damaged at the hit location
- **AND** the bullet is removed

#### Scenario: Alien bullet destroys player
- **WHEN** an alien bullet hits the player ship
- **THEN** the ship is destroyed
- **AND** a life is lost
- **AND** a sound effect plays

### Requirement: Bunker destruction

The system SHALL provide destructible bunkers that protect the player from alien fire.

#### Scenario: Bunkers block bullets
- **WHEN** a bullet (player or alien) hits a bunker
- **THEN** the bunker absorbs the hit
- **AND** the bunker is damaged at the impact point
- **AND** the bullet is removed

#### Scenario: Bunkers are progressively destroyed
- **WHEN** a bunker section takes 3 hits
- **THEN** that section is completely destroyed
- **AND** bullets can pass through destroyed sections

#### Scenario: Aliens destroy bunkers on contact
- **WHEN** an alien touches a bunker
- **THEN** the entire bunker is destroyed
- **AND** the alien continues moving

### Requirement: Scoring system

The system SHALL award different points for different alien types and track high scores.

#### Scenario: Points awarded per alien type
- **WHEN** a top row alien (squid) is destroyed
- **THEN** the player earns 30 points
- **AND** when a middle row alien (crab) is destroyed
- **THEN** the player earns 20 points
- **AND** when a bottom row alien (octopus) is destroyed
- **THEN** the player earns 10 points

#### Scenario: Score display updates in real-time
- **WHEN** the game is running
- **THEN** the current score is displayed
- **AND** the current wave is displayed
- **AND** the high score for this game is displayed
- **AND** all values update immediately when changed

#### Scenario: High score is saved
- **WHEN** a game ends
- **THEN** the final score is compared to the stored high score
- **AND** if the final score is higher, it becomes the new high score
- **AND** the new high score is saved to localStorage

### Requirement: Mystery UFO

The system SHALL spawn a mystery UFO periodically that awards bonus points when destroyed.

#### Scenario: UFO spawns randomly
- **WHEN** the game is running
- **THEN** every 20-30 seconds, a UFO spawns at a random top edge
- **AND** the UFO moves horizontally across the screen
- **AND** the UFO disappears after 10 seconds or when shot

#### Scenario: UFO destroyed for bonus points
- **WHEN** the player shoots the UFO
- **THEN** a random bonus is awarded (50, 100, 150, or 200 points)
- **AND** the bonus is displayed on screen
- **AND** a special sound effect plays

### Requirement: Wave progression

The system SHALL advance to harder waves when all aliens are destroyed.

#### Scenario: Wave complete when all aliens destroyed
- **WHEN** all aliens on the screen are destroyed
- **THEN** the wave increases by 1
- **AND** a new wave starts immediately
- **AND** a sound effect plays

#### Scenario: Aliens start closer in later waves
- **WHEN** advancing to a new wave
- **THEN** the alien formation starts lower on screen
- **AND** each wave starts 10 pixels lower than the previous
- **AND** the starting position is capped at 30% from the top

#### Scenario: Alien fire rate increases per wave
- **WHEN** advancing to a new wave
- **THEN** the alien fire rate increases by 20%
- **AND** maximum fire rate is capped at 3x the initial rate

### Requirement: Lives system

The system SHALL give the player multiple lives before game over.

#### Scenario: Player starts with 3 lives
- **WHEN** a new game starts
- **THEN** the player has 3 lives
- **AND** the remaining lives are displayed as ship icons

#### Scenario: Life lost when hit
- **WHEN** the player ship is hit by an alien bullet
- **THEN** the player loses one life
- **AND** the ship respawns in the center after 1 second
- **AND** the player is briefly invincible during respawn (blinking)

#### Scenario: Game over when no lives remain
- **WHEN** the player loses their last life
- **THEN** the game ends
- **AND** the final score is displayed
- **AND** the player can restart or return to menu
- **AND** a game over sound effect plays

### Requirement: Pause and restart

The system SHALL allow pausing the game and restarting after game over.

#### Scenario: Space bar toggles pause
- **WHEN** a player presses the P key
- **THEN** the game pauses if running
- **AND** the game resumes if paused
- **AND** a "PAUSED" message is displayed when paused

#### Scenario: Restart button starts new game
- **WHEN** a player clicks the "Restart" button after game over
- **THEN** a new game begins immediately
- **THEN** lives are reset to 3
- **AND** score and wave are reset to initial values
- **AND** bunkers are restored to full health

### Requirement: Sound effects

The system SHALL generate sound effects for game events using the SoundManager.

#### Scenario: Player shot sound plays
- **WHEN** the player fires
- **THEN** a sharp laser sound plays at 880Hz for 50ms

#### Scenario: Alien move sound plays
- **WHEN** the alien formation moves
- **THEN** a rhythmic beat sound plays at 110Hz for 50ms
- **AND** the beat tempo matches the movement speed

#### Scenario: Explosion sound plays
- **WHEN** an alien is destroyed
- **THEN** a noise-based explosion sound plays for 150ms

#### Scenario: UFO sound plays
- **WHEN** the UFO is on screen
- **THEN** a rising siren sound plays repeatedly (440Hz → 880Hz → 440Hz)

### Requirement: Alien animation

The system SHALL animate aliens by changing their sprite appearance as they move.

#### Scenario: Aliens animate as they move
- **WHEN** the alien formation moves horizontally
- **THEN** each alien alternates between two sprite frames
- **AND** the animation creates a walking effect
- **AND** the animation speed matches the movement speed

### Requirement: Visual effects

The system SHALL provide visual feedback for game events.

#### Scenario: Player ship flashes during invincibility
- **WHEN** the player is invincible (after respawn)
- **THEN** the ship blinks on and off every 100ms
- **AND** invincibility lasts for 2 seconds

#### Scenario: Explosion particles on alien death
- **WHEN** an alien is destroyed
- **THEN** particle debris is drawn at the alien's position
- **AND** particles fade out over 0.3 seconds

#### Scenario: Score popup on alien destruction
- **WHEN** an alien is destroyed
- **THEN** the score value floats upward from the alien's position
- **AND** the score popup fades out after 0.5 seconds
