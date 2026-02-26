# audio-system Specification

## Purpose
TBD - created by archiving change retro-arcade-overhaul. Update Purpose after archive.
## Requirements
### Requirement: SoundManager initialization

The system SHALL provide a SoundManager singleton that initializes Web Audio API.

#### Scenario: SoundManager loads on page load
- **WHEN** any page loads
- **THEN** a SoundManager instance is created
- **AND** an AudioContext is initialized
- **AND** a master gain node is created and connected to destination
- **AND** the master gain volume is set to 30% by default

#### Scenario: SoundManager is accessible globally
- **WHEN** any game code needs to play a sound
- **THEN** the SoundManager is available as a global singleton
- **AND** sounds can be played via `sound.play(type)` method

### Requirement: UI sound effects

The system SHALL generate sound effects for UI interactions.

#### Scenario: Click sound plays on button click
- **WHEN** a user clicks any button
- **THEN** a short blip sound plays at 800Hz for 50ms
- **AND** the sound uses a sine wave oscillator
- **AND** the sound has exponential decay to silence

#### Scenario: Hover sound plays on button hover
- **WHEN** a user hovers over an interactive element
- **THEN** a tone slide sound plays from 400Hz to 600Hz over 100ms
- **AND** the sound uses a sine wave oscillator with frequency ramp

### Requirement: Gameplay sound effects

The system SHALL generate sound effects for common gameplay events.

#### Scenario: Score sound plays when player scores
- **WHEN** a player scores points in any game
- **THEN** a ascending chime plays (C5→E5→G5 arpeggio)
- **AND** each note plays for 150ms
- **AND** notes overlap slightly for musical effect

#### Scenario: Bonus sound plays for special events
- **WHEN** a player collects a bonus item or achieves a special goal
- **THEN** a higher-pitched chime plays (E5→G5→C6 arpeggio)
- **AND** the sound lasts 200ms
- **AND** the sound is brighter than regular score sound

#### Scenario: Collision sound plays on impact
- **WHEN** a collision occurs in any game (ball hits wall, paddle, etc.)
- **THEN** a low thud sound plays at 150Hz for 100ms
- **AND** the sound uses a square wave oscillator
- **AND** the sound has quick attack and decay envelope

#### Scenario: Wrong move sound plays on invalid action
- **WHEN** a player makes an invalid move or action
- **THEN** a buzz tone plays at 200Hz for 150ms
- **AND** the sound uses a sawtooth wave oscillator
- **AND** the sound has a dissonant quality

#### Scenario: Level up sound plays
- **WHEN** a player advances to a new level
- **THEN** a rising sweep sound plays from 200Hz to 800Hz over 300ms
- **AND** the sound uses exponential frequency ramp
- **AND** the sound creates anticipation and excitement

### Requirement: Game state sound effects

The system SHALL generate sound effects for game state changes.

#### Scenario: Game over sound plays
- **WHEN** a game ends
- **THEN** a descending slide sound plays from G (392Hz) to C (261.63Hz) over 500ms
- **AND** the sound conveys finality and loss
- **AND** the sound uses a triangle wave oscillator

#### Scenario: High score sound plays
- **WHEN** a player achieves a new high score
- **THEN** a victory fanfare plays (C-E-G-C arpeggio with extended final note)
- **AND** each note is bright and celebratory
- **AND** the total sound lasts approximately 1 second

### Requirement: Snake-specific sounds

The system SHALL generate sound effects specific to the Snake game.

#### Scenario: Snake eat sound plays
- **WHEN** the snake eats regular food
- **THEN** a short blip plays at 1200Hz for 50ms
- **AND** the sound is crisp and satisfying
- **AND** the sound matches Pac-Man dot collection style

#### Scenario: Snake bonus eat sound plays
- **WHEN** the snake eats bonus food
- **THEN** a celebratory chime plays (C→E→G arpeggio)
- **AND** the sound is distinct from regular eat sound
- **AND** the sound conveys special reward

#### Scenario: Snake death sound plays
- **WHEN** the snake collides and dies
- **THEN** a descending slide plays from G (392Hz) to low C (130.81Hz) over 400ms
- **AND** the sound conveys failure and loss
- **AND** a buzz undertone is added for emphasis

### Requirement: Sound generation using oscillators

The system SHALL generate all sounds using Web Audio API oscillators without external audio files.

#### Scenario: Sine wave for smooth sounds
- **WHEN** a smooth UI sound is generated
- **THEN** a sine wave oscillator is used
- **AND** the oscillator connects to a gain node for volume envelope
- **AND** the gain node connects to the master gain node

#### Scenario: Square wave for retro sounds
- **WHEN** a retro game sound is generated
- **THEN** a square wave oscillator is used
- **AND** the sound has a characteristic "bit-crushed" quality
- **AND** the waveform matches classic 8-bit game consoles

#### Scenario: Sawtooth wave for harsh sounds
- **WHEN** a harsh or warning sound is generated
- **THEN** a sawtooth wave oscillator is used
- **AND** the sound has a buzzy quality
- **AND** the sound conveys negative feedback

#### Scenario: Triangle wave for warm sounds
- **WHEN** a warm musical sound is generated
- **THEN** a triangle wave oscillator is used
- **AND** the sound is softer than square or sawtooth
- **AND** the sound is suitable for pad-like effects

### Requirement: Sound envelope control

The system SHALL apply attack and decay envelopes to all sounds.

#### Scenario: Short blip has quick decay
- **WHEN** a short UI sound plays
- **THEN** the sound has immediate attack (gain starts at 0.3)
- **AND** the sound decays exponentially to 0.01 over the duration
- **AND** the oscillator stops after decay completes

#### Scenario: Musical note has smooth envelope
- **WHEN** a musical note plays (chime, arpeggio)
- **THEN** the attack is smooth over 10ms
- **AND** the sustain holds for most of the duration
- **AND** the release fades over 20-50ms

### Requirement: Master volume control

The system SHALL provide master volume control with mute functionality.

#### Scenario: Master gain controls overall volume
- **WHEN** the SoundManager initializes
- **THEN** the master gain node is set to 0.3 (30% volume)
- **AND** all sounds pass through this gain node
- **AND** changing the master gain affects all sounds

#### Scenario: Mute toggles sound on/off
- **WHEN** the mute toggle is activated
- **THEN** the master gain is set to 0 (no sound)
- **AND** the mute state is saved to localStorage with key 'games_sound_muted'
- **AND** future page loads remember the mute state

#### Scenario: Unmute restores volume
- **WHEN** the mute toggle is activated while muted
- **THEN** the master gain is restored to 0.3 (30% volume)
- **AND** the unmute state is saved to localStorage
- **AND** sounds resume playing immediately

### Requirement: Mute button in header

The system SHALL provide a mute toggle button in the page header.

#### Scenario: Mute button displays on all pages
- **WHEN** any page loads
- **THEN** a mute toggle button is visible in the header
- **AND** the button shows a speaker icon when unmuted
- **AND** the button shows a muted speaker icon when muted

#### Scenario: Mute button is accessible
- **WHEN** a user navigates with keyboard
- **THEN** the mute button can be focused with Tab key
- **AND** the button can be activated with Enter or Space key
- **AND** the button has an appropriate ARIA label ("Mute sounds" or "Unmute sounds")

### Requirement: Sound plays only when unmuted

The system SHALL prevent sound playback when muted.

#### Scenario: No sound plays when muted
- **WHEN** any sound would play while muted
- **THEN** the sound is immediately skipped
- **AND** no audio is generated
- **AND** no error is thrown

### Requirement: Feature detection for Web Audio API

The system SHALL detect Web Audio API support and degrade gracefully.

#### Scenario: Web Audio API is supported
- **WHEN** a browser supports Web Audio API
- **THEN** the SoundManager initializes normally
- **AND** all sound features are available

#### Scenario: Web Audio API is not supported
- **WHEN** a browser does not support Web Audio API
- **THEN** the SoundManager still initializes (no error thrown)
- **AND** all `sound.play()` calls silently fail
- **AND** the game remains fully functional without sound

