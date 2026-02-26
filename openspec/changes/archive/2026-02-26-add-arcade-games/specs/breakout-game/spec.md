# breakout-game Specification

## Purpose

Defines the Breakout/Arkanoid arcade game where players control a paddle to bounce a ball and destroy bricks, with power-ups and level progression.

## ADDED Requirements

### Requirement: Game canvas and layout

The system SHALL provide a Breakout game with paddle, ball, and brick grid rendered on HTML5 Canvas.

#### Scenario: Game canvas displays
- **WHEN** the Breakout game page loads
- **THEN** a 400x400 pixel canvas is displayed
- **THEN** the canvas contains a paddle at the bottom
- **AND** the canvas contains rows of colored bricks at the top
- **AND** the canvas contains one ball above the paddle
- **AND** the canvas scales responsively on mobile devices

#### Scenario: Canvas scales for mobile
- **WHEN** a user views the game on a mobile device
- **THEN** the canvas scales to fit the screen width
- **AND** the aspect ratio is preserved
- **AND** touch controls are enabled

### Requirement: Paddle controls

The system SHALL allow the paddle to move horizontally within the canvas bounds.

#### Scenario: Player controls paddle with keyboard
- **WHEN** a player presses Left Arrow or A key
- **THEN** the paddle moves left
- **AND** the paddle stops at the left edge of the canvas

#### Scenario: Player controls paddle with keyboard (right)
- **WHEN** a player presses Right Arrow or D key
- **THEN** the paddle moves right
- **AND** the paddle stops at the right edge of the canvas

#### Scenario: Touch controls move paddle
- **WHEN** a user touches and drags on the canvas
- **THEN** the paddle moves horizontally to match the touch X position
- **AND** the paddle stays within canvas bounds

### Requirement: Ball physics and deflection

The system SHALL move the ball with realistic bouncing physics based on where it hits the paddle.

#### Scenario: Ball bounces off walls
- **WHEN** the ball collides with the top, left, or right edges of the canvas
- **THEN** the appropriate velocity component is inverted
- **AND** a sound effect plays

#### Scenario: Ball lost at bottom edge
- **WHEN** the ball passes the bottom edge of the canvas
- **THEN** the player loses a life
- **AND** the ball resets to above the paddle
- **AND** a sound effect plays

#### Scenario: Ball angle changes based on paddle hit position
- **WHEN** the ball hits the left side of the paddle
- **THEN** the ball bounces left at a steep angle
- **AND** when the ball hits the right side of the paddle
- **THEN** the ball bounces right at a steep angle
- **AND** when the ball hits the center of the paddle
- **THEN** the ball bounces upward at a shallow angle

### Requirement: Brick destruction

The system SHALL destroy bricks when hit by the ball and award points.

#### Scenario: Regular brick destroyed
- **WHEN** the ball collides with a regular brick
- **THEN** the brick is removed from the canvas
- **AND** the player earns 10 points
- **AND** the ball bounces off the brick
- **AND** a sound effect plays

#### Scenario: Multi-hit brick requires multiple hits
- **WHEN** the ball collides with a multi-hit brick
- **THEN** the brick changes color to indicate damage
- **AND** when the brick has been hit the required number of times
- **THEN** the brick is destroyed

#### Scenario: Brick gives points on destruction
- **WHEN** a brick is destroyed
- **THEN** the player earns points based on brick color
- **AND** red bricks = 10 points, orange = 20, yellow = 30, green = 40, blue = 50

### Requirement: Level progression

The system SHALL advance to harder levels when all bricks are destroyed.

#### Scenario: Level complete when all bricks destroyed
- **WHEN** all bricks on the screen are destroyed
- **THEN** the level increases by 1
- **AND** a level-up sound effect plays
- **AND** a new brick pattern loads
- **AND** the ball speed increases by 10%

#### Scenario: Ball speed increases per level
- **WHEN** progressing through levels
- **THEN** level 1 uses base speed
- **AND** each subsequent level increases ball speed by 10%
- **AND** maximum speed is capped at 2x base speed

#### Scenario: Brick patterns vary per level
- **WHEN** advancing to a new level
- **THEN** a different brick pattern loads
- **AND** patterns may include different brick arrangements and multi-hit bricks
- **AND** levels 5+ include more multi-hit bricks

### Requirement: Power-ups

The system SHALL spawn power-ups when certain bricks are destroyed that enhance paddle abilities.

#### Scenario: Power-up spawns from destroyed brick
- **WHEN** a brick is destroyed
- **THEN** there is a 20% chance that a power-up spawns
- **AND** the power-up falls slowly toward the bottom of the screen
- **AND** the power-up has a distinct color indicating its type

#### Scenario: Wide paddle power-up collected
- **WHEN** the paddle collides with a wide paddle power-up (green)
- **THEN** the paddle width doubles for 10 seconds
- **AND** a sound effect plays
- **AND** a visual timer shows remaining duration

#### Scenario: Multi-ball power-up collected
- **WHEN** the paddle collides with a multi-ball power-up (blue)
- **THEN** two additional balls spawn from the current ball position
- **AND** all balls are active simultaneously
- **AND** the game continues as long as at least one ball remains in play
- **AND** a sound effect plays

#### Scenario: Laser power-up collected
- **WHEN** the paddle collides with a laser power-up (red)
- **THEN** the paddle can fire lasers by pressing Space
- **AND** lasers destroy bricks they hit
- **AND** the power-up lasts for 15 seconds
- **AND** a sound effect plays when firing

#### Scenario: Power-up expires
- **WHEN** the power-up duration elapses
- **THEN** the paddle returns to normal size
- **AND** multi-balls revert to single ball (longest surviving)
- **AND** laser capability is removed
- **AND** a sound effect plays indicating power-up ended

#### Scenario: Power-up missed
- **WHEN** a power-up falls off the bottom of the screen
- **THEN** the power-up is removed from play
- **AND** no effect is applied

### Requirement: Lives system

The system SHALL give the player multiple lives before game over.

#### Scenario: Player starts with 3 lives
- **WHEN** a new game starts
- **THEN** the player has 3 lives
- **AND** the remaining lives are displayed on screen

#### Scenario: Life lost when ball falls
- **WHEN** the ball passes the bottom edge of the canvas
- **THEN** the player loses one life
- **AND** a sound effect plays
- **AND** if lives remain, the ball resets and play continues

#### Scenario: Game over when no lives remain
- **WHEN** the player loses their last life
- **THEN** the game ends
- **AND** the final score is displayed
- **AND** the player can restart or return to menu
- **AND** a game over sound effect plays

### Requirement: Scoring system

The system SHALL track player score and save high scores.

#### Scenario: Points awarded for brick destruction
- **WHEN** a brick is destroyed
- **THEN** points are awarded based on brick type and color
- **AND** points multiply by current level number

#### Scenario: High score is saved
- **WHEN** a game ends
- **THEN** the final score is compared to the stored high score
- **AND** if the final score is higher, it becomes the new high score
- **AND** the new high score is saved to localStorage

#### Scenario: Score display updates in real-time
- **WHEN** the game is running
- **THEN** the current score is displayed
- **AND** the current level is displayed
- **AND** the high score for this game is displayed
- **AND** all values update immediately when changed

### Requirement: Pause and restart

The system SHALL allow pausing the game and restarting after game over.

#### Scenario: Space bar toggles pause
- **WHEN** a player presses the Space bar
- **THEN** the game pauses if running
- **AND** the game resumes if paused
- **AND** a "PAUSED" message is displayed when paused

#### Scenario: Restart button starts new game
- **WHEN** a player clicks the "Restart" button after game over
- **THEN** a new game begins immediately
- **THEN** lives are reset to 3
- **AND** score and level are reset to initial values

### Requirement: Sound effects

The system SHALL generate sound effects for game events using the SoundManager.

#### Scenario: Brick destroyed sound plays
- **WHEN** a brick is destroyed by the ball
- **THEN** a crisp breaking sound plays (high frequency burst)

#### Scenario: Paddle hit sound plays
- **WHEN** the ball hits the paddle
- **THEN** a bounce sound plays at 300Hz for 50ms

#### Scenario: Power-up collected sound plays
- **WHEN** a power-up is collected
- **THEN** a rising chime plays (440Hz → 880Hz over 200ms)

#### Scenario: Life lost sound plays
- **WHEN** the player loses a life
- **THEN** a descending tone plays (440Hz → 220Hz over 300ms)
