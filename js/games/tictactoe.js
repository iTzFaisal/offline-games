/**
 * Tic-Tac-Toe Game
 * Complete implementation with AI, two-player mode, and score tracking
 */

class TicTacToe extends BaseGame {
    constructor() {
        super('tictactoe');

        // Game state
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'ai'; // 'ai' or '2p'
        this.aiDifficulty = 'easy';
        this.winningLine = null;

        // Winning patterns (rows, columns, diagonals)
        this.winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];

        // DOM elements
        this.boardElement = null;
        this.statusElement = null;
        this.cells = [];

        // Initialize
        this.init();
    }

    /**
     * Initialize the game
     */
    init() {
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');

        if (!this.boardElement || !this.statusElement) {
            console.error('Required DOM elements not found');
            return;
        }

        this.createBoard();
        this.setupEventListeners();
        this.loadScores();
        this.updateStatus();
    }

    /**
     * Create the game board cells
     */
    createBoard() {
        this.boardElement.innerHTML = '';
        this.cells = [];

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
            cell.addEventListener('click', () => this.handleCellClick(i));
            this.boardElement.appendChild(cell);
            this.cells.push(cell);
        }
    }

    /**
     * Setup event listeners for controls
     */
    setupEventListeners() {
        // New Game button
        const newGameBtn = document.getElementById('new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.resetGame());
        }

        // Game mode selector
        const modeSelect = document.getElementById('game-mode');
        if (modeSelect) {
            modeSelect.addEventListener('change', (e) => {
                this.gameMode = e.target.value;
                this.toggleDifficultySelector();
                this.resetGame();
            });
        }

        // Difficulty selector
        const difficultySelect = document.getElementById('difficulty');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.aiDifficulty = e.target.value;
                this.resetGame();
            });
        }
    }

    /**
     * Toggle difficulty selector visibility based on game mode
     */
    toggleDifficultySelector() {
        const difficultyGroup = document.getElementById('difficulty-group');
        if (difficultyGroup) {
            difficultyGroup.style.display = this.gameMode === 'ai' ? 'block' : 'none';
        }
    }

    /**
     * Handle cell click
     * @param {number} index - Cell index
     */
    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== null) {
            return;
        }

        this.makeMove(index, this.currentPlayer);

        // If game is still active and playing vs AI, make AI move
        if (this.gameActive && this.gameMode === 'ai' && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    /**
     * Make a move on the board
     * @param {number} index - Cell index
     * @param {string} player - 'X' or 'O'
     */
    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player;
        this.cells[index].setAttribute('aria-label', `Cell ${index + 1}, ${player}`);

        // Check for winner
        const winner = this.checkWinner();
        if (winner) {
            this.endGame(winner);
            return;
        }

        // Check for draw
        if (this.board.every(cell => cell !== null)) {
            this.endGame('draw');
            return;
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    /**
     * Make AI move based on difficulty
     */
    makeAIMove() {
        if (!this.gameActive) return;

        let move;

        switch (this.aiDifficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = this.getMediumMove();
                break;
            case 'hard':
                move = this.getBestMove();
                break;
            default:
                move = this.getRandomMove();
        }

        if (move !== null) {
            this.makeMove(move, 'O');
        }
    }

    /**
     * Get a random valid move (Easy AI)
     * @returns {number|null} Random empty cell index
     */
    getRandomMove() {
        const emptyCells = this.board
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);

        if (emptyCells.length === 0) return null;

        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    /**
     * Get medium difficulty move using limited minimax
     * @returns {number} Best move index
     */
    getMediumMove() {
        // Use minimax with limited depth (3) for medium difficulty
        return this.minimax(3);
    }

    /**
     * Get best move using full minimax (Hard AI - unbeatable)
     * @returns {number} Best move index
     */
    getBestMove() {
        return this.minimax(9);
    }

    /**
     * Minimax algorithm for AI decision making
     * @param {number} maxDepth - Maximum search depth
     * @returns {number} Best move index
     */
    minimax(maxDepth) {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = 'O';
                const score = this.minimaxHelper(0, false, -Infinity, Infinity, maxDepth);
                this.board[i] = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    /**
     * Helper function for minimax algorithm with alpha-beta pruning
     */
    minimaxHelper(depth, isMaximizing, alpha, beta, maxDepth) {
        // Check terminal states
        const winner = this.checkWinner();
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (this.board.every(cell => cell !== null) || depth >= maxDepth) return 0;

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === null) {
                    this.board[i] = 'O';
                    const score = this.minimaxHelper(depth + 1, false, alpha, beta, maxDepth);
                    this.board[i] = null;
                    maxScore = Math.max(maxScore, score);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) break;
                }
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === null) {
                    this.board[i] = 'X';
                    const score = this.minimaxHelper(depth + 1, true, alpha, beta, maxDepth);
                    this.board[i] = null;
                    minScore = Math.min(minScore, score);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) break;
                }
            }
            return minScore;
        }
    }

    /**
     * Check if there's a winner
     * @returns {string|null} Winner ('X', 'O') or null
     */
    checkWinner() {
        for (const pattern of this.winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winningLine = pattern;
                return this.board[a];
            }
        }
        this.winningLine = null;
        return null;
    }

    /**
     * End the game
     * @param {string} result - 'X', 'O', or 'draw'
     */
    endGame(result) {
        this.gameActive = false;

        // Highlight winning line
        if (this.winningLine) {
            this.winningLine.forEach(index => {
                this.cells[index].classList.add('winner');
            });
        }

        // Determine game result for scoring
        let scoreResult;
        let message;

        if (result === 'draw') {
            scoreResult = 'draw';
            message = "It's a draw!";
        } else if (result === 'X') {
            scoreResult = this.gameMode === 'ai' ? 'win' : 'X';
            message = this.gameMode === 'ai' ? 'You win! 🎉' : 'Player X wins! 🎉';
        } else {
            scoreResult = this.gameMode === 'ai' ? 'loss' : 'O';
            message = this.gameMode === 'ai' ? 'AI wins! 🤖' : 'Player O wins! 🎉';
        }

        this.statusElement.textContent = message;

        // Save score (only in single player mode)
        if (this.gameMode === 'ai' && ['win', 'loss', 'draw'].includes(scoreResult)) {
            this.saveScore(scoreResult);
            this.loadScores();
        }
    }

    /**
     * Reset the game
     */
    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningLine = null;

        // Clear cells
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner');
            cell.removeAttribute('aria-label');
            cell.setAttribute('aria-label', 'Empty cell');
        });

        this.updateStatus();
    }

    /**
     * Update the status message
     */
    updateStatus() {
        if (!this.gameActive) return;

        if (this.gameMode === 'ai') {
            if (this.currentPlayer === 'X') {
                this.statusElement.textContent = 'Your turn (X)';
            } else {
                this.statusElement.textContent = 'AI is thinking... (O)';
            }
        } else {
            this.statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
        }
    }

    /**
     * Load and display scores from localStorage
     */
    loadScores() {
        const scores = this.getScores();

        const winsElement = document.getElementById('score-wins');
        const lossesElement = document.getElementById('score-losses');
        const drawsElement = document.getElementById('score-draws');

        if (winsElement) winsElement.textContent = scores.wins || 0;
        if (lossesElement) lossesElement.textContent = scores.losses || 0;
        if (drawsElement) drawsElement.textContent = scores.draws || 0;
    }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TicTacToe());
} else {
    new TicTacToe();
}
