/**
 * Base Game Interface
 * Provides common functionality for all games including score tracking
 */
class BaseGame {
    constructor(gameId) {
        this.gameId = gameId;
        this.storageKey = `games_scores_${gameId}`;
    }

    /**
     * Get scores from localStorage
     * @returns {Object} Scores object with wins, losses, draws, gamesPlayed, lastPlayed
     */
    getScores() {
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
     * @param {string} result - 'win', 'loss', or 'draw'
     */
    saveScore(result) {
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
     * Reset all scores for this game
     */
    resetScores() {
        localStorage.removeItem(this.storageKey);
    }
}
