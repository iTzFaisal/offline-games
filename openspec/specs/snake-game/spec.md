# snake-game Specification

## Purpose
TBD - created by archiving change retro-arcade-overhaul. Update Purpose after archive.
## Requirements
### Requirement: Game grid and canvas

The system SHALL provide a 20x20 grid game area rendered on HTML5 Canvas.

#### Scenario: Game canvas displays
- **WHEN** the Snake game page loads
- **THEN** a 400x400 pixel canvas is displayed
- **AND** the canvas is divided into a 20x20 grid (20px per cell)
- **AND** the canvas scales responsively on mobile devices

#### Scenario: Canvas scales for mobile
- **WHEN** a user views the game on a mobile device
- **THEN** the canvas scales to fit the screen width
- **AND** the aspect ratio is preserved
- **AND** touch controls are enabled

### Requirement: Snake movement

The system SHALL move the snake in the current direction every game tick.

#### Scenario: Snake moves continuously
- **WHEN** the game is running
- **THEN** the snake moves one cell per game tick
- **AND** the movement speed is determined by the current level
- **AND** the snake cannot reverse direction into itself

#### Scenario: Player changes direction
- **WHEN** a player presses an arrow key or swipes
- **THEN** the snake changes to the new direction
- **AND** the change takes effect on the next game tick
- **AND** the snake cannot directly reverse (e.g., can't go down if moving up)

### Requirement: Snake grows when eating

The system SHALL increase snake length when the snake head collides with food.

#### Scenario: Snake eats regular food
- **WHEN** the snake head occupies the same cell as regular food
- **THEN** the snake grows by 1 segment
- **AND** 10 points are added to the score
- **AND** a sound effect plays
- **AND** new regular food spawns at a random empty location

#### Scenario: Snake eats bonus food
- **WHEN** the snake head occupies the same cell as bonus food
- **THEN** the snake grows by 2 segments
- **AND** 50 points are added to the score
- **AND** a different sound effect plays
- **AND** new regular food spawns (bonus food does not respawn)

### Requirement: Regular food spawning

The system SHALL spawn regular food at random empty locations on the grid.

#### Scenario: Food spawns on game start
- **WHEN** a new game begins
- **THEN** one regular food item spawns at a random location
- **AND** the food is not on the snake
- **AND** the food is not on an obstacle

#### Scenario: Food respawns after being eaten
- **WHEN** the snake eats food
- **THEN** a new regular food spawns at a different random location
- **AND** the spawn location is not occupied by the snake or obstacles

### Requirement: Bonus food spawning

The system SHALL spawn bonus food randomly with limited lifetime.

#### Scenario: Bonus food spawns randomly
- **WHEN** regular food is eaten
- **THEN** there is a 10% chance that bonus food also spawns
- **AND** bonus food is colored yellow with a glow effect
- **AND** bonus food is worth 50 points

#### Scenario: Bonus food disappears after timer
- **WHEN** bonus food spawns
- **THEN** the bonus food disappears after 5 seconds
- **AND** if not eaten, the bonus food is removed from the board
- **AND** a countdown indicator is visible below the food

### Requirement: Speed levels

The system SHALL increase game speed as the player scores more points.

#### Scenario: Level increases with score
- **WHEN** the player reaches 50 points (5 regular food eaten)
- **THEN** the level increases by 1
- **AND** the game tick interval decreases (game speeds up)
- **AND** a level-up sound effect plays
- **AND** the new level is displayed on screen

#### Scenario: Speed increases per level
- **WHEN** the game progresses through levels 1-10
- **THEN** level 1 uses 150ms per tick
- **AND** each subsequent level reduces tick interval by 10ms
- **AND** level 10 (maximum) uses 60ms per tick

### Requirement: Obstacles

The system SHALL place static obstacles on the grid starting at level 6.

#### Scenario: No obstacles in early levels
- **WHEN** the game is at level 1-5
- **THEN** no obstacles are placed on the grid
- **AND** the snake can move anywhere except walls

#### Scenario: Obstacles appear at level 6
- **WHEN** the game reaches level 6
- **THEN** 3 obstacles spawn at random locations
- **AND** obstacles are colored arcade red
- **AND** obstacles are not adjacent to the snake starting position

#### Scenario: More obstacles at higher levels
- **WHEN** the game reaches level 11 or higher
- **THEN** 5 obstacles are placed on the grid
- **AND** obstacles form random patterns or walls

### Requirement: Collision detection

The system SHALL detect and handle game-ending collisions.

#### Scenario: Snake collides with wall
- **WHEN** the snake head moves outside the 20x20 grid
- **THEN** the game ends immediately
- **AND** a game-over sound effect plays
- **AND** the final score is displayed
- **AND** the player can restart or return to menu

#### Scenario: Snake collides with itself
- **WHEN** the snake head occupies the same cell as any body segment
- **THEN** the game ends immediately
- **AND** a game-over sound effect plays
- **AND** the final score is displayed

#### Scenario: Snake collides with obstacle
- **WHEN** the snake head occupies the same cell as an obstacle
- **THEN** the game ends immediately
- **AND** a game-over sound effect plays
- **AND** the final score is displayed

### Requirement: Desktop controls

The system SHALL support keyboard controls for desktop play.

#### Scenario: Arrow keys control snake
- **WHEN** a player presses arrow keys (up, down, left, right)
- **THEN** the snake changes direction accordingly
- **AND** the snake cannot reverse into itself

#### Scenario: WASD keys control snake
- **WHEN** a player presses W, A, S, or D keys
- **THEN** the snake changes direction (W=up, A=left, S=down, D=right)
- **AND** the keys function identically to arrow keys

#### Scenario: Space bar pauses game
- **WHEN** a player presses the Space bar
- **THEN** the game pauses if running
- **AND** the game resumes if paused
- **AND** a "PAUSED" message is displayed when paused

### Requirement: Mobile controls

The system SHALL support touch swipe controls for mobile play.

#### Scenario: Swipe changes direction
- **WHEN** a player swipes up, down, left, or right on the canvas
- **THEN** the snake changes direction to match the swipe
- **AND** the snake cannot reverse into itself

#### Scenario: Tap pauses game
- **WHEN** a player taps the canvas
- **THEN** the game toggles between running and paused
- **AND** a "PAUSED" message is displayed when paused

### Requirement: Score display

The system SHALL display current score, level, and high score during gameplay.

#### Scenario: Score display updates in real-time
- **WHEN** the game is running
- **THEN** the current score is displayed
- **AND** the current level is displayed
- **AND** the high score for this game is displayed
- **AND** all values update immediately when changed

### Requirement: High score persistence

The system SHALL save and load high scores using localStorage.

#### Scenario: High score is saved
- **WHEN** a game ends
- **THEN** the final score is compared to the stored high score
- **AND** if the final score is higher, it becomes the new high score
- **AND** the new high score is saved to localStorage with key 'games_highscore_snake'

#### Scenario: High score is loaded
- **WHEN** the Snake game page loads
- **THEN** the high score is loaded from localStorage
- **AND** if no high score exists, it defaults to 0
- **AND** the high score is displayed on the game screen

#### Scenario: New high score celebration
- **WHEN** a game ends with a new high score
- **THEN** a special "NEW HIGH SCORE!" message is displayed
- **AND** a victory fanfare sound effect plays
- **AND** the score text glows or pulses

### Requirement: Game restart

The system SHALL allow players to restart the game after it ends.

#### Scenario: Restart button starts new game
- **WHEN** a player clicks the "Restart" button after game over
- **THEN** a new game begins immediately
- **AND** the snake is reset to starting position and length
- **AND** the score and level are reset to initial values
- **AND** obstacles are regenerated based on starting level

### Requirement: Navigation

The system SHALL provide navigation back to the homepage.

#### Scenario: Back to menu button
- **WHEN** a player clicks "Back to Menu"
- **THEN** the user is redirected to the homepage
- **AND** the current game state is saved to localStorage
- **AND** the user can return to the game by clicking Snake again

