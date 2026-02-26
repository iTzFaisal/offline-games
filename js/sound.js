/**
 * Sound Manager Module
 * Procedural audio system using Web Audio API oscillators
 * Generates all sound effects without external audio files
 */
const SoundManager = (function() {
    // Private variables
    let audioContext = null;
    let masterGain = null;
    let isMuted = false;
    let isInitialized = false;

    const STORAGE_KEY = 'games_sound_muted';
    const DEFAULT_VOLUME = 0.3;

    /**
     * Initialize the AudioContext and master gain node
     * Must be called after user interaction due to browser autoplay policies
     */
    function init() {
        if (isInitialized) return;

        // Check if Web Audio API is supported
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.warn('Web Audio API not supported');
            return;
        }

        try {
            // Create AudioContext (handle webkit prefix for older browsers)
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioCtx();

            // Create master gain node for volume control
            masterGain = audioContext.createGain();
            masterGain.gain.value = DEFAULT_VOLUME;
            masterGain.connect(audioContext.destination);

            // Load muted state from localStorage
            const storedMute = localStorage.getItem(STORAGE_KEY);
            if (storedMute === 'true') {
                isMuted = true;
                masterGain.gain.value = 0;
            }

            isInitialized = true;
        } catch (e) {
            console.warn('Could not initialize AudioContext:', e);
        }
    }

    /**
     * Ensure audio context is running (resumes if suspended)
     */
    function ensureContextRunning() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    /**
     * Create an oscillator with gain envelope
     * @param {string} type - Oscillator type (sine, square, sawtooth, triangle)
     * @param {number} frequency - Frequency in Hz
     * @param {number} startTime - When to start the sound
     * @param {number} duration - Duration in seconds
     * @param {number} attack - Attack time in seconds
     * @param {number} decay - Decay time in seconds
     * @returns {OscillatorNode} The created oscillator
     */
    function createOscillator(type, frequency, startTime, duration, attack = 0.01, decay = 0.05) {
        if (!audioContext || !masterGain) return null;

        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startTime);

        // Envelope: attack -> sustain -> release
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(DEFAULT_VOLUME, startTime + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);

        return osc;
    }

    /**
     * Play a frequency ramp (slide) effect
     * @param {number} startFreq - Starting frequency in Hz
     * @param {number} endFreq - Ending frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Oscillator type
     */
    function playFrequencyRamp(startFreq, endFreq, duration, type = 'sine') {
        if (!audioContext || !masterGain || isMuted) return;

        ensureContextRunning();
        const startTime = audioContext.currentTime;

        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

        gainNode.gain.setValueAtTime(DEFAULT_VOLUME, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    /**
     * Play an arpeggio (sequence of notes)
     * @param {Array<number>} frequencies - Array of frequencies in Hz
     * @param {number} noteDuration - Duration of each note in seconds
     * @param {string} type - Oscillator type
     */
    function playArpeggio(frequencies, noteDuration = 0.15, type = 'sine') {
        if (!audioContext || !masterGain || isMuted) return;

        ensureContextRunning();
        const startTime = audioContext.currentTime;

        frequencies.forEach((freq, index) => {
            const noteStart = startTime + (index * noteDuration * 0.8); // Slight overlap
            createOscillator(type, freq, noteStart, noteDuration);
        });
    }

    /**
     * Public API - Sound type definitions
     */
    const sounds = {
        // UI Sounds
        'click': () => {
            if (isMuted) return;
            ensureContextRunning();
            createOscillator('sine', 800, audioContext.currentTime, 0.05);
        },

        'hover': () => {
            if (isMuted) return;
            ensureContextRunning();
            playFrequencyRamp(400, 600, 0.1, 'sine');
        },

        // Gameplay Sounds
        'score': () => {
            if (isMuted) return;
            // C5 -> E5 -> G5 arpeggio
            playArpeggio([523.25, 659.25, 783.99], 0.15, 'sine');
        },

        'bonus': () => {
            if (isMuted) return;
            // E5 -> G5 -> C6 arpeggio (brighter)
            playArpeggio([659.25, 783.99, 1046.50], 0.15, 'sine');
        },

        'collision': () => {
            if (isMuted) return;
            ensureContextRunning();
            createOscillator('square', 150, audioContext.currentTime, 0.1, 0.005, 0.05);
        },

        'wrong': () => {
            if (isMuted) return;
            ensureContextRunning();
            createOscillator('sawtooth', 200, audioContext.currentTime, 0.15, 0.01, 0.1);
        },

        'levelup': () => {
            if (isMuted) return;
            playFrequencyRamp(200, 800, 0.3, 'sine');
        },

        // Game State Sounds
        'gameover': () => {
            if (isMuted) return;
            playFrequencyRamp(392, 261.63, 0.5, 'triangle');
        },

        'highscore': () => {
            if (isMuted) return;
            // C -> E -> G -> C (extended fanfare)
            playArpeggio([261.63, 329.63, 392, 523.25], 0.2, 'sine');
        },

        // Snake-specific Sounds
        'snake-eat': () => {
            if (isMuted) return;
            ensureContextRunning();
            createOscillator('square', 1200, audioContext.currentTime, 0.05, 0.005, 0.02);
        },

        'snake-bonus': () => {
            if (isMuted) return;
            // C -> E -> G arpeggio for bonus food
            playArpeggio([523.25, 659.25, 783.99], 0.12, 'square');
        },

        'snake-death': () => {
            if (isMuted) return;
            ensureContextRunning();
            playFrequencyRamp(392, 130.81, 0.4, 'triangle');
            // Add buzz undertone
            setTimeout(() => {
                if (!isMuted) {
                    createOscillator('sawtooth', 100, audioContext.currentTime, 0.15, 0.01, 0.1);
                }
            }, 300);
        }
    };

    /**
     * Play a sound by type
     * @param {string} type - Sound type identifier
     */
    function play(type) {
        if (!isInitialized) {
            init();
        }

        if (sounds[type]) {
            sounds[type]();
        }
    }

    /**
     * Toggle mute state
     */
    function toggleMute() {
        isMuted = !isMuted;

        if (masterGain) {
            masterGain.gain.setValueAtTime(
                isMuted ? 0 : DEFAULT_VOLUME,
                audioContext.currentTime
            );
        }

        // Save to localStorage
        try {
            localStorage.setItem(STORAGE_KEY, isMuted.toString());
        } catch (e) {
            console.warn('Could not save mute state:', e);
        }

        // Update mute button if it exists
        updateMuteButton();

        return isMuted;
    }

    /**
     * Check if currently muted
     */
    function isMutedState() {
        return isMuted;
    }

    /**
     * Update mute button appearance
     */
    function updateMuteButton() {
        const muteButton = document.querySelector('.mute-toggle');
        if (!muteButton) return;

        const unmutedIcon = muteButton.querySelector('.icon-unmuted');
        const mutedIcon = muteButton.querySelector('.icon-muted');

        if (isMuted) {
            if (unmutedIcon) unmutedIcon.style.display = 'none';
            if (mutedIcon) mutedIcon.style.display = 'block';
            muteButton.setAttribute('aria-label', 'Unmute sounds');
            muteButton.setAttribute('title', 'Unmute sounds');
        } else {
            if (unmutedIcon) unmutedIcon.style.display = 'block';
            if (mutedIcon) mutedIcon.style.display = 'none';
            muteButton.setAttribute('aria-label', 'Mute sounds');
            muteButton.setAttribute('title', 'Mute sounds');
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    function setVolume(volume) {
        if (masterGain) {
            masterGain.gain.setValueAtTime(volume, audioContext.currentTime);
        }
    }

    /**
     * Get current volume
     */
    function getVolume() {
        if (masterGain) {
            return masterGain.gain.value;
        }
        return isMuted ? 0 : DEFAULT_VOLUME;
    }

    // Initialize on load
    if (typeof document !== 'undefined') {
        // Wait for user interaction before fully initializing AudioContext
        // But set up the initial state
        const storedMute = localStorage.getItem(STORAGE_KEY);
        if (storedMute === 'true') {
            isMuted = true;
        }

        // Initialize on first interaction
        const initOnInteraction = () => {
            init();
            document.removeEventListener('click', initOnInteraction);
            document.removeEventListener('keydown', initOnInteraction);
            document.removeEventListener('touchstart', initOnInteraction);
        };

        document.addEventListener('click', initOnInteraction, { once: true });
        document.addEventListener('keydown', initOnInteraction, { once: true });
        document.addEventListener('touchstart', initOnInteraction, { once: true });
    }

    // Public API
    return {
        play,
        toggleMute,
        isMuted: isMutedState,
        setVolume,
        getVolume,
        updateMuteButton,
        init
    };

})();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}
