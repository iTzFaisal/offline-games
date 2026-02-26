/**
 * Snake Game
 * Classic arcade Snake game with high score mode
 * Extends BaseGame with 'highscore' mode
 */
class SnakeGame extends BaseGame {
    constructor(canvasId) {
        super('snake', 'highscore');

        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game constants
        this.GRID_SIZE = 20;
        this.CELL_SIZE = 20;
        this.INITIAL_SPEED = 150; // ms per tick
        this.MIN_SPEED = 60; // ms per tick (level 10+)
        this.SPEED_DECREASE = 10; // ms per level
        this.LEVEL_UP_SCORE = 50; // points per level

        // Game state
        this.snake = [];
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.nextDirection = { x: 1, y: 0 };
        this.food = null;
        this.bonusFood = null;
        this.bonusFoodTimer = null;
        this.obstacles = [];
        this.score = 0;
        this.level = 1;
        this.tickSpeed = this.INITIAL_SPEED;
        this.gameLoop = null;
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;

        // Touch handling
        this.touchStartX = 0;
        this.touchStartY = 0;

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
        this.isRunning = true;
        this.isPaused = false;
        this.gameOver = false;
        this.spawnFood();
        this.startGameLoop();
        this.updateStatus('Use Arrow Keys or WASD to move');
    }

    /**
     * Reset game state
     */
    reset() {
        // Stop any existing game loop
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }

        // Clear bonus food timer
        if (this.bonusFoodTimer) {
            clearTimeout(this.bonusFoodTimer);
            this.bonusFoodTimer = null;
        }

        // Reset snake to center (3 segments)
        const centerX = Math.floor(this.GRID_SIZE / 2);
        const centerY = Math.floor(this.GRID_SIZE / 2);
        this.snake = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY }
        ];

        // Reset direction
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };

        // Reset game state
        this.score = 0;
        this.level = 1;
        this.tickSpeed = this.INITIAL_SPEED;
        this.food = null;
        this.bonusFood = null;
        this.obstacles = [];

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

        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
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
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
            e.preventDefault();
        }

        // Space to toggle pause
        if (e.key === ' ') {
            this.togglePause();
            return;
        }

        // Don't process input if paused or game over
        if (this.isPaused || this.gameOver) return;

        // Arrow keys
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.setDirection(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.setDirection(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.setDirection(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.setDirection(1, 0);
                break;
        }
    }

    /**
     * Set direction (prevent reversing)
     */
    setDirection(x, y) {
        // Can't reverse into self
        if (this.direction.x === -x && this.direction.y === -y) {
            return;
        }
        // Can't go directly back
        if (this.direction.x + x === 0 && this.direction.y + y === 0) {
            return;
        }
        this.nextDirection = { x, y };
    }

    /**
     * Handle touch start (for swipe detection)
     */
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }

    /**
     * Handle touch end (detect swipe)
     */
    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        // Minimum swipe distance
        const minSwipe = 30;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipe) {
                if (deltaX > 0) {
                    this.setDirection(1, 0); // Right
                } else {
                    this.setDirection(-1, 0); // Left
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipe) {
                if (deltaY > 0) {
                    this.setDirection(0, 1); // Down
                } else {
                    this.setDirection(0, -1); // Up
                }
            }
        }

        // Tap to toggle pause (if swipe distance is small)
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            this.togglePause();
        }
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        if (!this.isRunning && !this.gameOver) {
            this.start();
            return;
        }

        if (this.gameOver) return;

        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.updateStatus('PAUSED');
        } else {
            this.updateStatus('');
        }
    }

    /**
     * Start the game loop
     */
    startGameLoop() {
        let lastTick = performance.now();

        const tick = (currentTime) => {
            if (!this.isRunning) return;

            if (!this.isPaused && !this.gameOver) {
                const elapsed = currentTime - lastTick;

                if (elapsed >= this.tickSpeed) {
                    this.update();
                    lastTick = currentTime;
                }
            }

            this.render();
            this.gameLoop = requestAnimationFrame(tick);
        };

        this.gameLoop = requestAnimationFrame(tick);
    }

    /**
     * Update game state
     */
    update() {
        // Apply direction change
        this.direction = { ...this.nextDirection };

        // Calculate new head position
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // Check collisions
        if (this.checkCollision(newHead)) {
            this.endGame();
            return;
        }

        // Move snake (add new head)
        this.snake.unshift(newHead);

        // Check food collision
        if (this.food && newHead.x === this.food.x && newHead.y === this.food.y) {
            this.eatFood('regular');
        } else if (this.bonusFood && newHead.x === this.bonusFood.x && newHead.y === this.bonusFood.y) {
            this.eatFood('bonus');
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }

    /**
     * Check for collisions
     */
    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= this.GRID_SIZE || head.y < 0 || head.y >= this.GRID_SIZE) {
            return true;
        }

        // Self collision (skip head)
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
                return true;
            }
        }

        // Obstacle collision
        for (const obstacle of this.obstacles) {
            if (obstacle.x === head.x && obstacle.y === head.y) {
                return true;
            }
        }

        return false;
    }

    /**
     * Spawn food at random empty location
     */
    spawnFood() {
        const emptyCells = this.getEmptyCells();
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            this.food = emptyCells[randomIndex];
        }
    }

    /**
     * Spawn bonus food (10% chance)
     */
    spawnBonusFood() {
        const emptyCells = this.getEmptyCells();
        if (emptyCells.length > 0 && Math.random() < 0.1) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            this.bonusFood = emptyCells[randomIndex];

            // Bonus food disappears after 5 seconds
            this.bonusFoodTimer = setTimeout(() => {
                this.bonusFood = null;
                this.bonusFoodTimer = null;
                this.render(); // Re-render to remove bonus food
            }, 5000);
        }
    }

    /**
     * Get all empty grid cells
     */
    getEmptyCells() {
        const empty = [];
        for (let x = 0; x < this.GRID_SIZE; x++) {
            for (let y = 0; y < this.GRID_SIZE; y++) {
                // Check if cell is occupied
                let occupied = false;

                // Snake body
                for (const segment of this.snake) {
                    if (segment.x === x && segment.y === y) {
                        occupied = true;
                        break;
                    }
                }

                // Food
                if (this.food && this.food.x === x && this.food.y === y) {
                    occupied = true;
                }

                // Bonus food
                if (this.bonusFood && this.bonusFood.x === x && this.bonusFood.y === y) {
                    occupied = true;
                }

                // Obstacles
                for (const obstacle of this.obstacles) {
                    if (obstacle.x === x && obstacle.y === y) {
                        occupied = true;
                        break;
                    }
                }

                if (!occupied) {
                    empty.push({ x, y });
                }
            }
        }
        return empty;
    }

    /**
     * Handle eating food
     */
    eatFood(type) {
        if (type === 'regular') {
            this.score += 10;
            SoundManager.play('snake-eat');
            this.spawnFood();
            this.spawnBonusFood();
        } else if (type === 'bonus') {
            this.score += 50;
            SoundManager.play('snake-bonus');
            // Bonus food doesn't respawn
            this.bonusFood = null;
            if (this.bonusFoodTimer) {
                clearTimeout(this.bonusFoodTimer);
                this.bonusFoodTimer = null;
            }
        }

        // Check level up
        this.checkLevelUp();

        // Update display
        this.updateDisplay();
    }

    /**
     * Check if player should level up
     */
    checkLevelUp() {
        const newLevel = Math.floor(this.score / this.LEVEL_UP_SCORE) + 1;

        if (newLevel > this.level && newLevel <= 10) {
            this.level = newLevel;
            // Increase speed (decrease tick interval)
            this.tickSpeed = Math.max(
                this.MIN_SPEED,
                this.INITIAL_SPEED - ((this.level - 1) * this.SPEED_DECREASE)
            );
            SoundManager.play('levelup');
            this.spawnObstacles();
            this.updateStatus(`LEVEL ${this.level}!`);
            setTimeout(() => {
                if (!this.gameOver) this.updateStatus('');
            }, 2000);
        }
    }

    /**
     * Spawn obstacles based on current level
     */
    spawnObstacles() {
        this.obstacles = [];

        // No obstacles in levels 1-5
        if (this.level < 6) return;

        // 3 obstacles at level 6-10
        // 5 obstacles at level 11+
        const obstacleCount = this.level >= 11 ? 5 : 3;
        const centerX = Math.floor(this.GRID_SIZE / 2);
        const centerY = Math.floor(this.GRID_SIZE / 2);

        for (let i = 0; i < obstacleCount; i++) {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;

            while (!placed && attempts < maxAttempts) {
                const emptyCells = this.getEmptyCells();
                if (emptyCells.length === 0) break;

                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const pos = emptyCells[randomIndex];

                // Don't place adjacent to starting position
                const distFromCenter = Math.abs(pos.x - centerX) + Math.abs(pos.y - centerY);
                if (distFromCenter >= 3) {
                    this.obstacles.push(pos);
                    placed = true;
                }
                attempts++;
            }
        }
    }

    /**
     * End the game
     */
    endGame() {
        this.gameOver = true;
        this.isRunning = false;

        // Play death sound
        SoundManager.play('snake-death');

        // Save score
        const result = this.saveScore(this.score);

        // Check for new high score
        if (result.isNewRecord) {
            this.updateStatus('NEW HIGH SCORE!');
            SoundManager.play('highscore');
            this.highScore = this.score;
            document.getElementById('high-score').textContent = this.highScore;
            document.getElementById('high-score').classList.add('new-high-score');
        } else {
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
        const highScoreEl = document.getElementById('high-score');

        if (scoreEl) scoreEl.textContent = this.score;
        if (levelEl) levelEl.textContent = this.level;
        if (highScoreEl) highScoreEl.textContent = this.highScore;
    }

    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a12';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid (subtle)
        this.ctx.strokeStyle = '#1a1a2e';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.GRID_SIZE; i++) {
            const pos = i * this.CELL_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }

        // Draw obstacles
        for (const obstacle of this.obstacles) {
            this.drawCell(obstacle.x, obstacle.y, '#ff0040', false);
        }

        // Draw food (green)
        if (this.food) {
            this.drawCell(this.food.x, this.food.y, '#39ff14', true);
        }

        // Draw bonus food (yellow with glow)
        if (this.bonusFood) {
            this.drawCell(this.bonusFood.x, this.bonusFood.y, '#ffff00', true, true);
        }

        // Draw snake
        this.snake.forEach((segment, index) => {
            const isHead = index === 0;
            const color = isHead ? '#ff00ff' : '#00ffff';
            this.drawCell(segment.x, segment.y, color, false, isHead);
        });

        // Draw pause overlay
        if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(10, 10, 18, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.font = '30px "Press Start 2P"';
            this.ctx.fillStyle = '#ff00ff';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    /**
     * Draw a single cell
     */
    drawCell(gridX, gridY, color, isFood = false, hasGlow = false) {
        const x = gridX * this.CELL_SIZE;
        const y = gridY * this.CELL_SIZE;
        const size = this.CELL_SIZE - 2; // Small gap

        // Glow effect
        if (hasGlow) {
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = 15;
        }

        this.ctx.fillStyle = color;

        if (isFood) {
            // Draw food as circle
            this.ctx.beginPath();
            this.ctx.arc(
                x + this.CELL_SIZE / 2,
                y + this.CELL_SIZE / 2,
                size / 2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        } else {
            // Draw as square (pixel style)
            this.ctx.fillRect(x + 1, y + 1, size, size);
        }

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
}
