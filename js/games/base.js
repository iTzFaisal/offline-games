/**
 * Base Game Interface
 * Provides common functionality for all games including score tracking
 * Supports two game modes: 'competitive' (wins/losses/draws) and 'highscore' (single best score)
 */
class BaseGame {
    constructor(gameId, mode = 'competitive') {
        this.gameId = gameId;
        this.scoreMode = mode; // 'competitive' or 'highscore'

        // Different storage keys based on mode
        if (mode === 'highscore') {
            this.storageKey = `games_highscore_${gameId}`;
        } else {
            this.storageKey = `games_scores_${gameId}`;
        }
    }

    /**
     * Get scores from localStorage
     * Returns different formats based on game mode
     * @returns {Object|number} For competitive: object with wins, losses, draws, gamesPlayed, lastPlayed
     *                          For highscore: number (best score)
     */
    getScores() {
        if (this.scoreMode === 'highscore') {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? parseInt(stored, 10) : 0;
        }

        // Competitive mode (original behavior)
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            wins: 0,
            losses: 0,
            draws: 0,
            gamesPlayed: 0,
            lastPlayed: null
        };
    }

    /**
     * Save score to localStorage
     * Behavior differs based on game mode
     * @param {string|number} result - For competitive: 'win', 'loss', or 'draw'
     *                                For highscore: numeric score value
     * @returns {Object} Result object with isNewRecord flag
     */
    saveScore(result) {
        if (this.scoreMode === 'highscore') {
            const score = typeof result === 'number' ? result : parseInt(result, 10);
            const currentHigh = this.getScores();
            const isNewRecord = score > currentHigh;

            if (isNewRecord) {
                localStorage.setItem(this.storageKey, score.toString());
            }

            return {
                score: score,
                highScore: isNewRecord ? score : currentHigh,
                isNewRecord: isNewRecord
            };
        }

        // Competitive mode (original behavior)
        const scores = this.getScores();
        scores.gamesPlayed = (scores.gamesPlayed || 0) + 1;
        scores.lastPlayed = new Date().toISOString();

        if (result === 'win') {
            scores.wins = (scores.wins || 0) + 1;
        } else if (result === 'loss') {
            scores.losses = (scores.losses || 0) + 1;
        } else if (result === 'draw') {
            scores.draws = (scores.draws || 0) + 1;
        }

        localStorage.setItem(this.storageKey, JSON.stringify(scores));
        return scores;
    }

    /**
     * Get the high score for highscore mode games
     * @returns {number} The current high score
     */
    getHighScore() {
        if (this.scoreMode === 'highscore') {
            return this.getScores();
        }
        return 0;
    }

    /**
     * Check if a given score is a new high score
     * @param {number} score - The score to check
     * @returns {boolean} True if this is a new high score
     */
    isNewHighScore(score) {
        if (this.scoreMode !== 'highscore') return false;
        return score > this.getHighScore();
    }

    /**
     * Reset all scores for this game
     */
    resetScores() {
        localStorage.removeItem(this.storageKey);
    }
}
