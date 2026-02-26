# asteroids-game Specification

## Purpose

Defines the Asteroids arcade game where players control a spaceship to shoot and split asteroids while avoiding collisions, featuring vector-style graphics and physics-based movement.

## ADDED Requirements

### Requirement: Game canvas and ship

The system SHALL provide an Asteroids game with a spaceship rendered on HTML5 Canvas using vector-style line drawing.

#### Scenario: Game canvas displays
- **WHEN** the Asteroids game page loads
- **THEN** a 400x400 pixel canvas is displayed
- **THEN** the canvas contains a triangular ship in the center
- **AND** the ship is drawn using vector lines (not filled shapes)
- **AND** the canvas contains asteroids floating in space
- **AND** the canvas scales responsively on mobile devices

#### Scenario: Canvas scales for mobile
- **WHEN** a user views the game on a mobile device
- **THEN** the canvas scales to fit the screen width
- **AND** the aspect ratio is preserved
- **AND** touch controls are enabled

### Requirement: Ship controls and physics

The system SHALL allow the ship to rotate, thrust, and shoot with realistic momentum physics.

#### Scenario: Ship rotates with controls
- **WHEN** a player presses Left Arrow or A key
- **THEN** the ship rotates counter-clockwise
- **AND** rotation continues while key is held

#### Scenario: Ship rotates right with controls
- **WHEN** a player presses Right Arrow or D key
- **THEN** the ship rotates clockwise
- **AND** rotation continues while key is held

#### Scenario: Ship thrusts forward
- **WHEN** a player presses Up Arrow or W key
- **THEN** the ship accelerates in the direction it's facing
- **AND** a thrust flame is drawn behind the ship
- **AND** a thrust sound plays

#### Scenario: Ship maintains momentum
- **WHEN** the player releases the thrust key
- **THEN** the ship continues moving in its current direction
- **AND** the ship gradually slows due to friction (5% per second)

#### Scenario: Ship wraps around screen edges
- **WHEN** the ship moves past the edge of the canvas
- **THEN** the ship appears on the opposite edge
- **AND** velocity and rotation are preserved

### Requirement: Shooting mechanics

The system SHALL allow the ship to fire projectiles that destroy asteroids.

#### Scenario: Ship fires bullets
- **WHEN** a player presses Space bar
- **THEN** a bullet fires from the ship's nose
- **AND** the bullet travels in the direction the ship is facing
- **AND** a sound effect plays
- **AND** the bullet disappears after 2 seconds or when it hits an object

#### Scenario: Bullet limit prevents spam
- **WHEN** 4 bullets are already on screen
- **THEN** the ship cannot fire additional bullets
- **AND** the player must wait for existing bullets to expire

#### Scenario: Bullet destroys asteroid
- **WHEN** a bullet collides with an asteroid
- **THEN** the bullet is removed
- **AND** the asteroid is split or destroyed
- **AND** a sound effect plays

### Requirement: Asteroid behavior

The system SHALL spawn asteroids that float, split when shot, and destroy the ship on collision.

#### Scenario: Asteroids spawn at level start
- **WHEN** a new level begins
- **THEN** 4 large asteroids spawn at random positions away from the ship
- **AND** asteroids have random velocities and rotation speeds

#### Scenario: Large asteroid splits into medium
- **WHEN** a large asteroid is shot
- **THEN** it splits into 2 medium asteroids
- **AND** the medium asteroids move in opposite directions
- **AND** each medium asteroid inherits the parent's velocity plus a split impulse

#### Scenario: Medium asteroid splits into small
- **WHEN** a medium asteroid is shot
- **THEN** it splits into 2 small asteroids
- **AND** the small asteroids move in opposite directions
- **AND** each small asteroid inherits the parent's velocity plus a split impulse

#### Scenario: Small asteroid is destroyed
- **WHEN** a small asteroid is shot
- **THEN** it is completely destroyed
- **AND** debris particles are drawn for 0.5 seconds

#### Scenario: Asteroid wraps around screen
- **WHEN** an asteroid moves past the edge of the canvas
- **THEN** the asteroid appears on the opposite edge
- **AND** velocity and rotation are preserved

### Requirement: Collision detection

The system SHALL detect collisions between ship/asteroids and bullets/asteroids.

#### Scenario: Ship collides with asteroid
- **WHEN** the ship collides with any asteroid
- **THEN** the ship is destroyed
- **AND** a life is lost
- **AND** debris particles are drawn at the collision point
- **AND** a sound effect plays

#### Scenario: Ship respawns after destruction
- **WHEN** the ship is destroyed and lives remain
- **THEN** the ship respawns in the center after 2 seconds
- **AND** the ship is invincible for 3 seconds (blinking effect)
- **AND** asteroids clear from the center area during respawn

#### Scenario: Bullet collides with asteroid
- **WHEN** a bullet collides with an asteroid
- **THEN** the bullet is removed
- **AND** the asteroid splits or is destroyed
- **AND** points are awarded based on asteroid size

### Requirement: Scoring system

The system SHALL award points based on asteroid size and track high scores.

#### Scenario: Points awarded for destroying asteroids
- **WHEN** a large asteroid is destroyed
- **THEN** the player earns 20 points
- **AND** when a medium asteroid is destroyed
- **THEN** the player earns 50 points
- **AND** when a small asteroid is destroyed
- **THEN** the player earns 100 points

#### Scenario: Score display updates in real-time
- **WHEN** the game is running
- **THEN** the current score is displayed
- **AND** the current level is displayed
- **AND** the high score for this game is displayed
- **AND** all values update immediately when changed

#### Scenario: Extra life awarded at 10,000 points
- **WHEN** the player's score reaches 10,000 points
- **THEN** the player earns an extra life
- **AND** a sound effect plays
- **AND** the extra life notification displays briefly

### Requirement: Level progression

The system SHALL advance to harder levels when all asteroids are destroyed.

#### Scenario: Level complete when all asteroids destroyed
- **WHEN** all asteroids on the screen are destroyed
- **THEN** the level increases by 1
- **AND** a level-up sound effect plays
- **AND** new asteroids spawn

#### Scenario: More asteroids spawn at higher levels
- **WHEN** advancing to a new level
- **THEN** the number of spawning asteroids increases by 1 each level
- **AND** starting level (1) has 4 asteroids
- **AND** maximum asteroids is capped at 12

#### Scenario: Asteroids move faster at higher levels
- **WHEN** progressing through levels
- **THEN** level 1 asteroids move at base speed
- **AND** each subsequent level increases asteroid speed by 5%
- **AND** maximum speed is capped at 2x base speed

### Requirement: Lives system

The system SHALL give the player multiple lives before game over.

#### Scenario: Player starts with 3 lives
- **WHEN** a new game starts
- **THEN** the player has 3 lives
- **AND** the remaining lives are displayed on screen

#### Scenario: Game over when no lives remain
- **WHEN** the player loses their last life
- **THEN** the game ends
- **AND** the final score is displayed
- **AND** the player can restart or return to menu
- **AND** a game over sound effect plays

### Requirement: UFO enemy

The system SHALL spawn a UFO enemy periodically that shoots at the player.

#### Scenario: UFO spawns periodically
- **WHEN** the player has been playing for 30 seconds without dying
- **THEN** a small UFO spawns from a random edge
- **AND** the UFO moves across the screen
- **AND** the UFO disappears after 15 seconds or when shot

#### Scenario: UFO shoots at player
- **WHEN** the UFO is on screen
- **THEN** it fires a bullet toward the player every 3 seconds
- **AND** the bullet travels in a straight line
- **AND** the bullet disappears after 3 seconds or when it hits the ship

#### Scenario: UFO destroyed for bonus points
- **WHEN** the UFO is shot by the player
- **THEN** the player earns a random bonus (100-500 points)
- **AND** a special sound effect plays

### Requirement: Pause and restart

The system SHALL allow pausing the game and restarting after game over.

#### Scenario: P key toggles pause
- **WHEN** a player presses the P key
- **THEN** the game pauses if running
- **AND** the game resumes if paused
- **AND** a "PAUSED" message is displayed when paused

#### Scenario: Restart button starts new game
- **WHEN** a player clicks the "Restart" button after game over
- **THEN** a new game begins immediately
- **THEN** lives are reset to 3
- **AND** score and level are reset to initial values

### Requirement: Touch controls for mobile

The system SHALL provide on-screen controls for mobile devices.

#### Scenario: Rotate buttons on mobile
- **WHEN** playing on a mobile device
- **THEN** left and right rotation buttons are displayed
- **AND** tapping rotation buttons rotates the ship

#### Scenario: Thrust button on mobile
- **WHEN** playing on a mobile device
- **THEN** a thrust button is displayed
- **AND** holding the thrust button accelerates the ship

#### Scenario: Fire button on mobile
- **WHEN** playing on a mobile device
- **THEN** a fire button is displayed
- **AND** tapping the fire button shoots bullets

### Requirement: Sound effects

The system SHALL generate sound effects for game events using the SoundManager.

#### Scenario: Thrust sound plays
- **WHEN** the ship thrusts
- **THEN** a low rumbling white noise sound plays
- **AND** the sound stops when thrust is released

#### Scenario: Shoot sound plays
- **WHEN** the ship fires
- **THEN** a short high-pitched burst plays at 1200Hz for 30ms

#### Scenario: Explosion sound plays
- **WHEN** an asteroid is destroyed
- **THEN** a noise-based explosion sound plays for 200ms
