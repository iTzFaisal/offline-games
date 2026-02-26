# pong-game Specification

## Purpose

Defines the Pong arcade game where players control paddles to hit a ball back and forth, scoring when the opponent fails to return the ball.

## ADDED Requirements

### Requirement: Game canvas and paddles

The system SHALL provide a Pong game with two paddles and a ball rendered on HTML5 Canvas.

#### Scenario: Game canvas displays
- **WHEN** the Pong game page loads
- **THEN** a 400x400 pixel canvas is displayed
- **THEN** the canvas contains two paddles (left and right sides)
- **THEN** the canvas contains one ball in the center
- **AND** the canvas scales responsively on mobile devices

#### Scenario: Canvas scales for mobile
- **WHEN** a user views the game on a mobile device
- **THEN** the canvas scales to fit the screen width
- **AND** the aspect ratio is preserved
- **AND** touch controls are enabled

### Requirement: Paddle movement

The system SHALL allow paddles to move vertically within the canvas bounds.

#### Scenario: Player controls left paddle with keyboard
- **WHEN** a player presses W or Up Arrow key
- **THEN** the left paddle moves upward
- **AND** the paddle stops at the top edge of the canvas

#### Scenario: Player controls left paddle with keyboard (down)
- **WHEN** a player presses S or Down Arrow key
- **THEN** the left paddle moves downward
- **AND** the paddle stops at the bottom edge of the canvas

#### Scenario: Right player controls with arrow keys (2-player mode)
- **WHEN** in 2-player mode and right player presses Up Arrow
- **THEN** the right paddle moves upward
- **AND** the paddle stops at the top edge of the canvas

#### Scenario: Touch controls move paddle
- **WHEN** a user touches and drags anywhere on the canvas
- **THEN** the left paddle moves to match the touch Y position
- **AND** the paddle stays within canvas bounds

### Requirement: Ball physics and movement

The system SHALL move the ball with realistic bouncing physics off paddles and walls.

#### Scenario: Ball moves continuously
- **WHEN** the game is running
- **THEN** the ball moves in its current direction each frame
- **AND** the ball speed is determined by the difficulty level

#### Scenario: Ball bounces off top and bottom walls
- **WHEN** the ball collides with the top or bottom edge of the canvas
- **THEN** the ball's Y velocity is inverted
- **AND** a sound effect plays

#### Scenario: Ball bounces off paddles
- **WHEN** the ball collides with a paddle
- **THEN** the ball's X velocity is inverted
- **AND** the ball speed increases slightly (5% per hit)
- **AND** a sound effect plays
- **AND** the ball angle changes based on where it hit the paddle (edges = steeper angle)

#### Scenario: Ball goes past paddle (score)
- **WHEN** the ball passes the left or right edge of the canvas
- **THEN** the opposing player scores a point
- **AND** the ball resets to center
- **AND** the ball launches toward the player who was scored on

### Requirement: AI opponent

The system SHALL provide an AI opponent for single-player mode with adjustable difficulty.

#### Scenario: AI paddle tracks ball
- **WHEN** in single-player mode and the ball is moving toward the AI paddle
- **THEN** the AI paddle moves toward the ball's Y position
- **AND** the AI paddle speed is limited based on difficulty level

#### Scenario: Easy AI makes mistakes
- **WHEN** playing on Easy difficulty
- **THEN** the AI paddle has slow reaction time (200ms delay)
- **AND** the AI paddle speed is 60% of ball speed

#### Scenario: Medium AI plays fairly
- **WHEN** playing on Medium difficulty
- **THEN** the AI paddle has moderate reaction time (100ms delay)
- **AND** the AI paddle speed is 80% of ball speed
- **AND** the AI occasionally misjudges ball angle (10% error rate)

#### Scenario: Hard AI is challenging
- **WHEN** playing on Hard difficulty
- **THEN** the AI paddle has fast reaction time (50ms delay)
- **AND** the AI paddle speed is 95% of ball speed
- **AND** the AI rarely makes mistakes (2% error rate)

### Requirement: Scoring system

The system SHALL track player scores and declare a winner at the score limit.

#### Scenario: Player scores when ball passes opponent
- **WHEN** the ball passes the opponent's paddle edge
- **THEN** the player's score increases by 1
- **AND** a sound effect plays
- **AND** the score display updates immediately

#### Scenario: Game ends at score limit
- **WHEN** a player reaches 10 points
- **THEN** the game ends
- **AND** the winner is displayed on screen
- **AND** a victory sound effect plays

#### Scenario: High score is saved
- **WHEN** a game ends
- **THEN** the winner's score is saved as the high score
- **AND** the high score persists across page refreshes

### Requirement: Game modes

The system SHALL support both single-player (vs AI) and two-player local modes.

#### Scenario: Single-player mode selected
- **WHEN** a user selects "1 Player" mode
- **THEN** the user controls the left paddle
- **AND** the AI controls the right paddle
- **AND** the difficulty can be set to Easy, Medium, or Hard

#### Scenario: Two-player mode selected
- **WHEN** a user selects "2 Players" mode
- **THEN** player 1 uses W/S keys for left paddle
- **AND** player 2 uses Up/Down arrow keys for right paddle
- **AND** no AI is involved

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
- **AND** scores are reset to 0-0
- **AND** the ball resets to center

### Requirement: Sound effects

The system SHALL generate sound effects for game events using the SoundManager.

#### Scenario: Paddle hit sound plays
- **WHEN** the ball hits a paddle
- **THEN** a short beep sound plays at 440Hz for 50ms

#### Scenario: Wall bounce sound plays
- **WHEN** the ball bounces off a wall
- **THEN** a lower beep sound plays at 220Hz for 50ms

#### Scenario: Score sound plays
- **WHEN** a player scores
- **THEN** a ascending tone slide plays (220Hz → 440Hz over 150ms)

#### Scenario: Game over sound plays
- **WHEN** a player reaches 10 points
- **THEN** a victory fanfare plays

### Requirement: Score display

The system SHALL display current scores and high score during gameplay.

#### Scenario: Score display updates in real-time
- **WHEN** the game is running
- **THEN** the left player score is displayed
- **AND** the right player/AI score is displayed
- **AND** all values update immediately when a point is scored

#### Scenario: High score is displayed
- **WHEN** the Pong game page loads
- **THEN** the high score is displayed
- **AND** if no high score exists, it defaults to 0
