/**
 * Pong Game
 * Classic arcade Pong game with ball physics and AI opponent
 * Extends BaseGame with 'highscore' mode
 */
class PongGame extends BaseGame {
    constructor(canvasId) {
        super('pong', 'highscore');

        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game constants
        this.CANVAS_WIDTH = 400;
        this.CANVAS_HEIGHT = 400;
        this.PADDLE_WIDTH = 10;
        this.PADDLE_HEIGHT = 60;
        this.BALL_RADIUS = 10;
        this.PADDLE_SPEED = 6;
        this.WINNING_SCORE = 10;
        this.BALL_SPEED_INCREASE = 1.05; // 5% per hit

        // AI difficulty settings
        this.AI_SETTINGS = {
            easy: { reactionDelay: 200, speed: 0.6, errorRate: 0.10 },
            medium: { reactionDelay: 100, speed: 0.8, errorRate: 0.02 },
            hard: { reactionDelay: 50, speed: 0.95, errorRate: 0.00 }
        };

        // Game state
        this.leftPaddle = { x: 10, y: 170, targetY: 170 };
        this.rightPaddle = { x: 380, y: 170, targetY: 170 };
        this.ball = { x: 200, y: 200, vx: 3, vy: 2, speed: 3 };
        this.leftScore = 0;
        this.rightScore = 0;
        this.highScore = 0;
        this.gameMode = '1p'; // '1p' or '2p'
        this.difficulty = 'medium';
        this.gameRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        this.aiLastUpdate = 0;
        this.aiTargetY = 200;

        // Key states
        this.keys = {
            w: false,
            s: false,
            ArrowUp: false,
            ArrowDown: false
        };

        // Touch handling
        this.touchY = null;

        // Load high score
        this.highScore = this.getHighScore();

        // Initialize
        this.init();
    }

    /**
     * Initialize the game
     */
    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.render();
    }

    /**
     * Start the game
     */
    start() {
        this.reset();
        this.gameRunning = true;
        this.isPaused = false;
        this.gameOver = false;
        this.launchBall();
        this.startGameLoop();
        this.updateStatus('First to 10 wins!');
    }

    /**
     * Reset game state
     */
    reset() {
        // Stop any existing game loop
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }

        // Reset paddles
        this.leftPaddle = { x: 10, y: 170, targetY: 170 };
        this.rightPaddle = { x: 380, y: 170, targetY: 170 };

        // Reset ball
        this.ball = { x: 200, y: 200, vx: 3, vy: 2, speed: 3 };

        // Reset scores
        this.leftScore = 0;
        this.rightScore = 0;

        // Reset touch
        this.touchY = null;

        // Update display
        this.updateDisplay();
    }

    /**
     * Restart the game
     */
    restart() {
        this.start();
    }

    /**
     * Set game mode (1p or 2p)
     */
    setGameMode(mode) {
        this.gameMode = mode;
        this.restart();
    }

    /**
     * Set AI difficulty
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Click to start/pause
        this.canvas.addEventListener('click', () => this.togglePause());
    }

    /**
     * Handle keyboard input
     */
    handleKeyDown(e) {
        // Prevent default for game keys
        if (['ArrowUp', 'ArrowDown', 'w', 's', ' '].includes(e.key)) {
            e.preventDefault();
        }

        // Space to toggle pause
        if (e.key === ' ') {
            this.togglePause();
            return;
        }

        // Don't process input if paused or game over
        if (this.isPaused || this.gameOver) return;

        // Update key states
        if (e.key in this.keys) {
            this.keys[e.key] = true;
        }
    }

    /**
     * Handle key up
     */
    handleKeyUp(e) {
        if (e.key in this.keys) {
            this.keys[e.key] = false;
        }
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleY = this.CANVAS_HEIGHT / rect.height;
        this.touchY = (touch.clientY - rect.top) * scaleY;
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleY = this.CANVAS_HEIGHT / rect.height;
        this.touchY = (touch.clientY - rect.top) * scaleY;
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        e.preventDefault();

        // Tap to toggle pause (if touch didn't move much)
        if (this.touchY !== null) {
            const touch = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleY = this.CANVAS_HEIGHT / rect.height;
            const endY = (touch.clientY - rect.top) * scaleY;

            if (Math.abs(endY - this.touchY) < 10) {
                this.togglePause();
            }
        }

        this.touchY = null;
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        if (!this.gameRunning && !this.gameOver) {
            this.start();
            return;
        }

        if (this.gameOver) return;

        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.updateStatus('PAUSED');
        } else {
            this.updateStatus('First to 10 wins!');
        }
    }

    /**
     * Launch ball from center
     */
    launchBall(towardPlayer = null) {
        this.ball.x = this.CANVAS_WIDTH / 2;
        this.ball.y = this.CANVAS_HEIGHT / 2;
        this.ball.speed = 3;

        // Random angle between -45 and 45 degrees
        const angle = (Math.random() - 0.5) * Math.PI / 2;

        // Determine direction based on who scored (or random)
        let direction = 1;
        if (towardPlayer === 'left') {
            direction = -1; // Ball goes toward left player
        } else if (towardPlayer === 'right') {
            direction = 1; // Ball goes toward right player
        } else {
            direction = Math.random() > 0.5 ? 1 : -1;
        }

        this.ball.vx = Math.cos(angle) * this.ball.speed * direction;
        this.ball.vy = Math.sin(angle) * this.ball.speed;
    }

    /**
     * Start the game loop
     */
    startGameLoop() {
        const gameLoop = (currentTime) => {
            if (!this.gameRunning) return;

            if (!this.isPaused && !this.gameOver) {
                this.update();
            }

            this.render();
            this.gameLoop = requestAnimationFrame(gameLoop);
        };

        this.gameLoop = requestAnimationFrame(gameLoop);
    }

    /**
     * Update game state
     */
    update() {
        // Update paddle positions
        this.updatePaddles();

        // Update ball
        this.updateBall();

        // Update AI
        if (this.gameMode === '1p') {
            this.updateAI();
        }

        // Check for game over
        this.checkGameOver();
    }

    /**
     * Update paddle positions
     */
    updatePaddles() {
        // Left paddle (Player 1)
        if (this.keys.w) {
            this.leftPaddle.y -= this.PADDLE_SPEED;
        }
        if (this.keys.s) {
            this.leftPaddle.y += this.PADDLE_SPEED;
        }

        // Touch control for left paddle
        if (this.touchY !== null) {
            const targetY = this.touchY - this.PADDLE_HEIGHT / 2;
            // Smooth movement toward touch position
            this.leftPaddle.y += (targetY - this.leftPaddle.y) * 0.2;
        }

        // Right paddle (Player 2 in 2P mode)
        if (this.gameMode === '2p') {
            if (this.keys.ArrowUp) {
                this.rightPaddle.y -= this.PADDLE_SPEED;
            }
            if (this.keys.ArrowDown) {
                this.rightPaddle.y += this.PADDLE_SPEED;
            }
        }

        // Constrain paddles to canvas
        this.leftPaddle.y = Math.max(0, Math.min(this.CANVAS_HEIGHT - this.PADDLE_HEIGHT, this.leftPaddle.y));
        this.rightPaddle.y = Math.max(0, Math.min(this.CANVAS_HEIGHT - this.PADDLE_HEIGHT, this.rightPaddle.y));
    }

    /**
     * Update ball position and handle collisions
     */
    updateBall() {
        // Move ball
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Wall collision (top/bottom)
        if (this.ball.y - this.BALL_RADIUS <= 0 || this.ball.y + this.BALL_RADIUS >= this.CANVAS_HEIGHT) {
            this.ball.vy *= -1;
            this.ball.y = Math.max(this.BALL_RADIUS, Math.min(this.CANVAS_HEIGHT - this.BALL_RADIUS, this.ball.y));
            SoundManager.play('pong-wall');
        }

        // Paddle collision - Left
        if (this.ball.x - this.BALL_RADIUS <= this.leftPaddle.x + this.PADDLE_WIDTH &&
            this.ball.x + this.BALL_RADIUS >= this.leftPaddle.x &&
            this.ball.y >= this.leftPaddle.y &&
            this.ball.y <= this.leftPaddle.y + this.PADDLE_HEIGHT &&
            this.ball.vx < 0) {

            this.handlePaddleHit(this.leftPaddle, true);
        }

        // Paddle collision - Right
        if (this.ball.x + this.BALL_RADIUS >= this.rightPaddle.x &&
            this.ball.x - this.BALL_RADIUS <= this.rightPaddle.x + this.PADDLE_WIDTH &&
            this.ball.y >= this.rightPaddle.y &&
            this.ball.y <= this.rightPaddle.y + this.PADDLE_HEIGHT &&
            this.ball.vx > 0) {

            this.handlePaddleHit(this.rightPaddle, false);
        }

        // Score - Ball goes off left edge (right player scores)
        if (this.ball.x < 0) {
            this.rightScore++;
            SoundManager.play('pong-score');
            this.updateDisplay();
            this.launchBall('left');
        }

        // Score - Ball goes off right edge (left player scores)
        if (this.ball.x > this.CANVAS_WIDTH) {
            this.leftScore++;
            SoundManager.play('pong-score');
            this.updateDisplay();
            this.launchBall('right');
        }
    }

    /**
     * Handle ball hitting a paddle
     */
    handlePaddleHit(paddle, isLeft) {
        // Increase ball speed
        this.ball.speed *= this.BALL_SPEED_INCREASE;

        // Calculate hit position relative to paddle center (-1 to 1)
        const hitPos = (this.ball.y - (paddle.y + this.PADDLE_HEIGHT / 2)) / (this.PADDLE_HEIGHT / 2);

        // Calculate new angle based on hit position
        const maxAngle = Math.PI / 3; // 60 degrees
        const angle = hitPos * maxAngle;

        // Set new velocity
        const direction = isLeft ? 1 : -1;
        this.ball.vx = Math.cos(angle) * this.ball.speed * direction;
        this.ball.vy = Math.sin(angle) * this.ball.speed;

        // Push ball out of paddle to prevent sticking
        if (isLeft) {
            this.ball.x = paddle.x + this.PADDLE_WIDTH + this.BALL_RADIUS;
        } else {
            this.ball.x = paddle.x - this.BALL_RADIUS;
        }

        SoundManager.play('pong-hit');
    }

    /**
     * Update AI paddle
     */
    updateAI() {
        const now = performance.now();
        const settings = this.AI_SETTINGS[this.difficulty];

        // Update AI target with reaction delay
        if (now - this.aiLastUpdate > settings.reactionDelay) {
            this.aiLastUpdate = now;

            // Add some error based on difficulty
            if (Math.random() < settings.errorRate) {
                // AI misjudges - target random position
                this.aiTargetY = Math.random() * (this.CANVAS_HEIGHT - this.PADDLE_HEIGHT);
            } else {
                // AI tracks ball
                this.aiTargetY = this.ball.y - this.PADDLE_HEIGHT / 2;
            }
        }

        // Move AI paddle toward target
        const diff = this.aiTargetY - this.rightPaddle.y;
        const maxMove = this.PADDLE_SPEED * settings.speed;

        if (Math.abs(diff) > maxMove) {
            this.rightPaddle.y += Math.sign(diff) * maxMove;
        } else {
            this.rightPaddle.y = this.aiTargetY;
        }

        // Constrain to canvas
        this.rightPaddle.y = Math.max(0, Math.min(this.CANVAS_HEIGHT - this.PADDLE_HEIGHT, this.rightPaddle.y));
    }

    /**
     * Check for game over
     */
    checkGameOver() {
        if (this.leftScore >= this.WINNING_SCORE || this.rightScore >= this.WINNING_SCORE) {
            this.endGame();
        }
    }

    /**
     * End the game
     */
    endGame() {
        this.gameOver = true;
        this.gameRunning = false;

        // Determine winner
        const playerWon = this.leftScore >= this.WINNING_SCORE;

        // Save high score (player's score)
        const result = this.saveScore(this.leftScore);

        if (result.isNewRecord) {
            this.highScore = this.leftScore;
            document.getElementById('high-score').textContent = this.highScore;
            document.getElementById('high-score').classList.add('new-high-score');
        }

        // Play sound and show message
        SoundManager.play('highscore');
        const winner = this.gameMode === '1p' ?
            (playerWon ? 'You Win!' : 'AI Wins!') :
            (playerWon ? 'Player 1 Wins!' : 'Player 2 Wins!');

        this.updateStatus(winner);

        this.updateDisplay();
    }

    /**
     * Update status message
     */
    updateStatus(message) {
        const statusEl = document.getElementById('status-message');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    /**
     * Update score display
     */
    updateDisplay() {
        const leftScoreEl = document.getElementById('left-score');
        const rightScoreEl = document.getElementById('right-score');
        const highScoreEl = document.getElementById('high-score');

        if (leftScoreEl) leftScoreEl.textContent = this.leftScore;
        if (rightScoreEl) rightScoreEl.textContent = this.rightScore;
        if (highScoreEl) highScoreEl.textContent = this.highScore;
    }

    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a12';
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        // Draw center line
        this.ctx.strokeStyle = '#1a1a2e';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.CANVAS_WIDTH / 2, 0);
        this.ctx.lineTo(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw paddles
        this.drawPaddle(this.leftPaddle.x, this.leftPaddle.y, '#ff00ff');
        this.drawPaddle(this.rightPaddle.x, this.rightPaddle.y, '#00ffff');

        // Draw ball
        this.drawBall();

        // Draw pause overlay
        if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(10, 10, 18, 0.8)';
            this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

            this.ctx.font = '30px "Press Start 2P"';
            this.ctx.fillStyle = '#ff00ff';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('PAUSED', this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2);
        }
    }

    /**
     * Draw a paddle
     */
    drawPaddle(x, y, color) {
        // Glow effect
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.PADDLE_WIDTH, this.PADDLE_HEIGHT);

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw the ball
     */
    drawBall() {
        // Glow effect
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 10;

        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.BALL_RADIUS, 0, Math.PI * 2);
        this.ctx.fill();

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
}
