/**
 * Breakout Game
 * Classic arcade brick-breaking game with power-ups and level progression
 * Extends BaseGame with 'highscore' mode
 */
class BreakoutGame extends BaseGame {
    constructor(canvasId) {
        super('breakout', 'highscore');

        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game constants
        this.CANVAS_WIDTH = 400;
        this.CANVAS_HEIGHT = 400;
        this.PADDLE_WIDTH = 80;
        this.PADDLE_HEIGHT = 10;
        this.BALL_RADIUS = 8;
        this.BRICK_ROWS = 5;
        this.BRICK_COLS = 8;
        this.BRICK_WIDTH = 45;
        this.BRICK_HEIGHT = 18;
        this.BRICK_PADDING = 5;
        this.BRICK_TOP_OFFSET = 30;
        this.BRICK_LEFT_OFFSET = 10;
        this.PADDLE_SPEED = 7;
        this.INITIAL_BALL_SPEED = 3;
        this.BALL_SPEED_INCREASE = 1.10;
        this.MAX_BALL_SPEED = 6;
        this.POWER_UP_CHANCE = 0.20;

        // Brick colors by row (top to bottom): red, orange, yellow, green, blue
        this.BRICK_COLORS = ['#ff0040', '#ff8000', '#ffff00', '#39ff14', '#00ffff'];
        this.BRICK_POINTS = [50, 40, 30, 20, 10];

        // Game state
        this.paddle = { x: 160, y: 380, width: this.PADDLE_WIDTH };
        this.balls = [];
        this.bricks = [];
        this.powerUps = [];
        this.lasers = [];
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.highScore = 0;
        this.ballSpeed = this.INITIAL_BALL_SPEED;
        this.gameRunning = false;
        this.isPaused = false;
        this.gameOver = false;

        // Power-up state
        this.activePowerUps = {
            wide: { active: false, endTime: 0 },
            laser: { active: false, endTime: 0 }
        };

        // Key states
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            a: false,
            d: false
        };

        // Touch handling
        this.touchX = null;

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
        this.createBricks();
        this.resetBall();
        this.startGameLoop();
        this.updateStatus('Break all the bricks!');
    }

    /**
     * Reset game state
     */
    reset() {
        // Stop any existing game loop
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }

        // Reset paddle
        this.paddle = { x: 160, y: 380, width: this.PADDLE_WIDTH };

        // Reset balls, bricks, power-ups, lasers
        this.balls = [];
        this.bricks = [];
        this.powerUps = [];
        this.lasers = [];

        // Reset game state
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.ballSpeed = this.INITIAL_BALL_SPEED;

        // Reset power-ups
        this.activePowerUps = {
            wide: { active: false, endTime: 0 },
            laser: { active: false, endTime: 0 }
        };

        // Reset touch
        this.touchX = null;

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
        if (['ArrowLeft', 'ArrowRight', 'a', 'd', ' '].includes(e.key)) {
            e.preventDefault();
        }

        // Space to toggle pause or fire laser
        if (e.key === ' ') {
            if (this.activePowerUps.laser.active && this.gameRunning && !this.isPaused && !this.gameOver) {
                this.fireLaser();
            } else {
                this.togglePause();
            }
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
        const scaleX = this.CANVAS_WIDTH / rect.width;
        this.touchX = (touch.clientX - rect.left) * scaleX;
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.CANVAS_WIDTH / rect.width;
        this.touchX = (touch.clientX - rect.left) * scaleX;
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        e.preventDefault();

        // Tap to toggle pause (if touch didn't move much)
        if (this.touchX !== null) {
            const touch = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.CANVAS_WIDTH / rect.width;
            const endX = (touch.clientX - rect.left) * scaleX;

            if (Math.abs(endX - this.touchX) < 10) {
                this.togglePause();
            }
        }

        this.touchX = null;
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
            this.updateStatus('Break all the bricks!');
        }
    }

    /**
     * Create bricks for current level
     */
    createBricks() {
        this.bricks = [];

        for (let row = 0; row < this.BRICK_ROWS; row++) {
            for (let col = 0; col < this.BRICK_COLS; col++) {
                // Higher levels have more multi-hit bricks
                let hits = 1;
                if (this.level >= 3 && row < 2) {
                    hits = 2;
                }
                if (this.level >= 5 && row === 0) {
                    hits = 3;
                }

                this.bricks.push({
                    x: col * (this.BRICK_WIDTH + this.BRICK_PADDING) + this.BRICK_LEFT_OFFSET,
                    y: row * (this.BRICK_HEIGHT + this.BRICK_PADDING) + this.BRICK_TOP_OFFSET,
                    width: this.BRICK_WIDTH,
                    height: this.BRICK_HEIGHT,
                    color: this.BRICK_COLORS[row],
                    points: this.BRICK_POINTS[row] * this.level,
                    hits: hits,
                    maxHits: hits,
                    active: true
                });
            }
        }
    }

    /**
     * Reset ball to paddle
     */
    resetBall() {
        this.balls = [{
            x: this.paddle.x + this.paddle.width / 2,
            y: this.paddle.y - this.BALL_RADIUS - 5,
            vx: 0,
            vy: -this.ballSpeed,
            active: true
        }];
    }

    /**
     * Fire laser (when power-up is active)
     */
    fireLaser() {
        if (this.lasers.length < 3) { // Max 3 lasers at once
            this.lasers.push({
                x: this.paddle.x + this.paddle.width / 2 - 2,
                y: this.paddle.y,
                width: 4,
                height: 15,
                active: true
            });
            SoundManager.play('shoot');
        }
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
        // Update paddle
        this.updatePaddle();

        // Update power-ups
        this.updatePowerUps();

        // Update balls
        this.updateBalls();

        // Update lasers
        if (this.activePowerUps.laser.active) {
            this.updateLasers();
        }

        // Check level complete
        this.checkLevelComplete();
    }

    /**
     * Update paddle position
     */
    updatePaddle() {
        // Keyboard controls
        if (this.keys.ArrowLeft || this.keys.a) {
            this.paddle.x -= this.PADDLE_SPEED;
        }
        if (this.keys.ArrowRight || this.keys.d) {
            this.paddle.x += this.PADDLE_SPEED;
        }

        // Touch control
        if (this.touchX !== null) {
            const targetX = this.touchX - this.paddle.width / 2;
            // Smooth movement toward touch position
            this.paddle.x += (targetX - this.paddle.x) * 0.2;
        }

        // Constrain paddle to canvas
        this.paddle.x = Math.max(0, Math.min(this.CANVAS_WIDTH - this.paddle.width, this.paddle.x));

        // Move ball with paddle if waiting to launch
        if (this.balls.length > 0 && this.balls[0].vx === 0) {
            this.balls[0].x = this.paddle.x + this.paddle.width / 2;
        }
    }

    /**
     * Update power-ups
     */
    updatePowerUps() {
        const now = performance.now();

        // Check for expired power-ups
        if (this.activePowerUps.wide.active && now > this.activePowerUps.wide.endTime) {
            this.activePowerUps.wide.active = false;
            this.paddle.width = this.PADDLE_WIDTH;
        }

        if (this.activePowerUps.laser.active && now > this.activePowerUps.laser.endTime) {
            this.activePowerUps.laser.active = false;
        }

        // Move falling power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.y += 2;

            // Check paddle collision
            if (powerUp.y + powerUp.height >= this.paddle.y &&
                powerUp.y <= this.paddle.y + this.PADDLE_HEIGHT &&
                powerUp.x + powerUp.width >= this.paddle.x &&
                powerUp.x <= this.paddle.x + this.paddle.width) {

                this.activatePowerUp(powerUp.type);
                this.powerUps.splice(i, 1);
                continue;
            }

            // Remove if off screen
            if (powerUp.y > this.CANVAS_HEIGHT) {
                this.powerUps.splice(i, 1);
            }
        }
    }

    /**
     * Activate a power-up
     */
    activatePowerUp(type) {
        const now = performance.now();

        switch (type) {
            case 'wide':
                this.activePowerUps.wide.active = true;
                this.activePowerUps.wide.endTime = now + 10000; // 10 seconds
                this.paddle.width = this.PADDLE_WIDTH * 2;
                break;
            case 'multi':
                // Spawn 2 additional balls
                const mainBall = this.balls.find(b => b.active);
                if (mainBall) {
                    for (let i = 0; i < 2; i++) {
                        const angle = (Math.random() - 0.5) * Math.PI / 3;
                        const speed = Math.sqrt(mainBall.vx * mainBall.vx + mainBall.vy * mainBall.vy);
                        this.balls.push({
                            x: mainBall.x,
                            y: mainBall.y,
                            vx: Math.cos(angle) * speed,
                            vy: -Math.abs(Math.sin(angle) * speed),
                            active: true
                        });
                    }
                }
                break;
            case 'laser':
                this.activePowerUps.laser.active = true;
                this.activePowerUps.laser.endTime = now + 15000; // 15 seconds
                break;
        }

        SoundManager.play('powerup');
    }

    /**
     * Update balls
     */
    updateBalls() {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];

            // Skip if ball not active
            if (!ball.active) continue;

            // Launch ball if at paddle
            if (ball.vx === 0 && ball.vy !== 0) {
                ball.vx = (Math.random() - 0.5) * 4;
                continue;
            }

            // Move ball
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Wall collision (left/right)
            if (ball.x - this.BALL_RADIUS <= 0 || ball.x + this.BALL_RADIUS >= this.CANVAS_WIDTH) {
                ball.vx *= -1;
                ball.x = Math.max(this.BALL_RADIUS, Math.min(this.CANVAS_WIDTH - this.BALL_RADIUS, ball.x));
                SoundManager.play('collision');
            }

            // Wall collision (top)
            if (ball.y - this.BALL_RADIUS <= 0) {
                ball.vy *= -1;
                ball.y = this.BALL_RADIUS;
                SoundManager.play('collision');
            }

            // Paddle collision
            if (ball.y + this.BALL_RADIUS >= this.paddle.y &&
                ball.y - this.BALL_RADIUS <= this.paddle.y + this.PADDLE_HEIGHT &&
                ball.x >= this.paddle.x &&
                ball.x <= this.paddle.x + this.paddle.width &&
                ball.vy > 0) {

                // Calculate hit position relative to paddle center (-1 to 1)
                const hitPos = (ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
                const maxAngle = Math.PI / 3; // 60 degrees
                const angle = hitPos * maxAngle;

                // Set new velocity
                const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                ball.vx = Math.sin(angle) * speed;
                ball.vy = -Math.abs(Math.cos(angle) * speed);
                ball.y = this.paddle.y - this.BALL_RADIUS;

                SoundManager.play('paddle');
            }

            // Brick collision
            for (const brick of this.bricks) {
                if (!brick.active) continue;

                if (ball.x + this.BALL_RADIUS > brick.x &&
                    ball.x - this.BALL_RADIUS < brick.x + brick.width &&
                    ball.y + this.BALL_RADIUS > brick.y &&
                    ball.y - this.BALL_RADIUS < brick.y + brick.height) {

                    brick.hits--;

                    if (brick.hits <= 0) {
                        brick.active = false;
                        this.score += brick.points;

                        // Chance to spawn power-up
                        if (Math.random() < this.POWER_UP_CHANCE) {
                            this.spawnPowerUp(brick.x + brick.width / 2, brick.y);
                        }

                        SoundManager.play('brick-break');
                    } else {
                        // Change color to show damage
                        const colorIndex = Math.floor((1 - brick.hits / brick.maxHits) * this.BRICK_COLORS.length);
                        brick.color = this.BRICK_COLORS[Math.min(colorIndex, this.BRICK_COLORS.length - 1)];
                        SoundManager.play('collision');
                    }

                    // Determine collision side
                    const overlapLeft = ball.x + this.BALL_RADIUS - brick.x;
                    const overlapRight = brick.x + brick.width - (ball.x - this.BALL_RADIUS);
                    const overlapTop = ball.y + this.BALL_RADIUS - brick.y;
                    const overlapBottom = brick.y + brick.height - (ball.y - this.BALL_RADIUS);

                    const minOverlapX = Math.min(overlapLeft, overlapRight);
                    const minOverlapY = Math.min(overlapTop, overlapBottom);

                    if (minOverlapX < minOverlapY) {
                        ball.vx *= -1;
                    } else {
                        ball.vy *= -1;
                    }

                    this.updateDisplay();
                    break;
                }
            }

            // Ball lost (bottom of screen)
            if (ball.y > this.CANVAS_HEIGHT) {
                this.balls.splice(i, 1);
            }
        }

        // Check if all balls lost
        if (this.balls.length === 0) {
            this.loseLife();
        }
    }

    /**
     * Update lasers
     */
    updateLasers() {
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            laser.y -= 8;

            // Check brick collision
            for (const brick of this.bricks) {
                if (!brick.active) continue;

                if (laser.x + laser.width > brick.x &&
                    laser.x < brick.x + brick.width &&
                    laser.y + laser.height > brick.y &&
                    laser.y < brick.y + brick.height) {

                    brick.hits--;
                    laser.active = false;

                    if (brick.hits <= 0) {
                        brick.active = false;
                        this.score += brick.points;

                        if (Math.random() < this.POWER_UP_CHANCE) {
                            this.spawnPowerUp(brick.x + brick.width / 2, brick.y);
                        }

                        SoundManager.play('brick-break');
                    } else {
                        const colorIndex = Math.floor((1 - brick.hits / brick.maxHits) * this.BRICK_COLORS.length);
                        brick.color = this.BRICK_COLORS[Math.min(colorIndex, this.BRICK_COLORS.length - 1)];
                        SoundManager.play('collision');
                    }

                    this.updateDisplay();
                    break;
                }
            }

            // Remove if off screen or inactive
            if (laser.y < 0 || !laser.active) {
                this.lasers.splice(i, 1);
            }
        }
    }

    /**
     * Spawn a power-up
     */
    spawnPowerUp(x, y) {
        const types = ['wide', 'multi', 'laser'];
        const type = types[Math.floor(Math.random() * types.length)];
        const colors = { wide: '#39ff14', multi: '#00ffff', laser: '#ff0040' };

        this.powerUps.push({
            x: x - 10,
            y: y,
            width: 20,
            height: 10,
            type: type,
            color: colors[type]
        });
    }

    /**
     * Lose a life
     */
    loseLife() {
        this.lives--;
        this.updateDisplay();

        if (this.lives <= 0) {
            this.endGame();
        } else {
            SoundManager.play('life-lost');
            this.resetBall();
            this.updateStatus(`${this.lives} ${this.lives === 1 ? 'life' : 'lives'} remaining`);
        }
    }

    /**
     * Check if level is complete
     */
    checkLevelComplete() {
        const activeBricks = this.bricks.filter(b => b.active);
        if (activeBricks.length === 0) {
            this.nextLevel();
        }
    }

    /**
     * Advance to next level
     */
    nextLevel() {
        this.level++;
        this.ballSpeed = Math.min(this.MAX_BALL_SPEED, this.ballSpeed * this.BALL_SPEED_INCREASE);

        // Clear power-ups and reset paddle
        this.powerUps = [];
        this.lasers = [];
        this.activePowerUps = {
            wide: { active: false, endTime: 0 },
            laser: { active: false, endTime: 0 }
        };
        this.paddle.width = this.PADDLE_WIDTH;

        this.createBricks();
        this.resetBall();
        this.updateDisplay();

        SoundManager.play('levelup');
        this.updateStatus(`Level ${this.level}!`);

        setTimeout(() => {
            if (!this.gameOver) this.updateStatus('Break all the bricks!');
        }, 2000);
    }

    /**
     * End the game
     */
    endGame() {
        this.gameOver = true;
        this.gameRunning = false;

        // Save high score
        const result = this.saveScore(this.score);

        if (result.isNewRecord) {
            this.highScore = this.score;
            document.getElementById('high-score').textContent = this.highScore;
            document.getElementById('high-score').classList.add('new-high-score');
            SoundManager.play('highscore');
            this.updateStatus('NEW HIGH SCORE!');
        } else {
            SoundManager.play('gameover');
            this.updateStatus('GAME OVER');
        }

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
        const scoreEl = document.getElementById('current-score');
        const levelEl = document.getElementById('current-level');
        const livesEl = document.getElementById('lives');
        const highScoreEl = document.getElementById('high-score');

        if (scoreEl) scoreEl.textContent = this.score;
        if (levelEl) levelEl.textContent = this.level;
        if (livesEl) livesEl.textContent = this.lives;
        if (highScoreEl) highScoreEl.textContent = this.highScore;
    }

    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a12';
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        // Draw bricks
        for (const brick of this.bricks) {
            if (brick.active) {
                this.drawBrick(brick);
            }
        }

        // Draw power-ups
        for (const powerUp of this.powerUps) {
            this.drawPowerUp(powerUp);
        }

        // Draw lasers
        for (const laser of this.lasers) {
            this.ctx.fillStyle = '#ff0040';
            this.ctx.shadowColor = '#ff0040';
            this.ctx.shadowBlur = 5;
            this.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
            this.ctx.shadowBlur = 0;
        }

        // Draw paddle
        this.drawPaddle();

        // Draw balls
        for (const ball of this.balls) {
            if (ball.active) {
                this.drawBall(ball);
            }
        }

        // Draw power-up indicators
        this.drawPowerUpIndicators();

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
     * Draw a brick
     */
    drawBrick(brick) {
        this.ctx.shadowColor = brick.color;
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = brick.color;
        this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

        // Draw crack effect for damaged bricks
        if (brick.hits < brick.maxHits) {
            this.ctx.strokeStyle = '#0a0a12';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(brick.x + brick.width * 0.3, brick.y);
            this.ctx.lineTo(brick.x + brick.width * 0.5, brick.y + brick.height * 0.5);
            this.ctx.lineTo(brick.x + brick.width * 0.4, brick.y + brick.height);
            this.ctx.stroke();
        }

        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw a power-up
     */
    drawPowerUp(powerUp) {
        this.ctx.shadowColor = powerUp.color;
        this.ctx.shadowBlur = 8;
        this.ctx.fillStyle = powerUp.color;
        this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw the paddle
     */
    drawPaddle() {
        const color = this.activePowerUps.laser.active ? '#ff0040' : '#00ffff';
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.PADDLE_HEIGHT);
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw a ball
     */
    drawBall(ball) {
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 8;
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, this.BALL_RADIUS, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw active power-up indicators
     */
    drawPowerUpIndicators() {
        const now = performance.now();
        let yOffset = 10;

        if (this.activePowerUps.wide.active) {
            const remaining = Math.ceil((this.activePowerUps.wide.endTime - now) / 1000);
            this.ctx.font = '12px "Press Start 2P"';
            this.ctx.fillStyle = '#39ff14';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`WIDE: ${remaining}s`, 10, yOffset);
            yOffset += 20;
        }

        if (this.activePowerUps.laser.active) {
            const remaining = Math.ceil((this.activePowerUps.laser.endTime - now) / 1000);
            this.ctx.font = '12px "Press Start 2P"';
            this.ctx.fillStyle = '#ff0040';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`LASER: ${remaining}s`, 10, yOffset);
        }
    }
}
