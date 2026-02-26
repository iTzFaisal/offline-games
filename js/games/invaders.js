/**
 * Space Invaders Game
 * Classic arcade fixed shooter with descending alien formations
 * Extends BaseGame with 'highscore' mode
 */
class InvadersGame extends BaseGame {
    constructor(canvasId) {
        super('invaders', 'highscore');

        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game constants
        this.CANVAS_WIDTH = 400;
        this.CANVAS_HEIGHT = 400;
        this.PLAYER_WIDTH = 30;
        this.PLAYER_HEIGHT = 15;
        this.PLAYER_SPEED = 4;
        this.ALIEN_ROWS = 5;
        this.ALIEN_COLS = 11;
        this.ALIEN_WIDTH = 25;
        this.ALIEN_HEIGHT = 18;
        this.ALIEN_PADDING = 8;
        this.BUNKER_COUNT = 4;
        this.BUNKER_WIDTH = 40;
        this.BUNKER_HEIGHT = 20;
        this.BUNKER_SECTIONS = 3;
        this.BULLET_SPEED = 5;
        this.ALIEN_BULLET_SPEED = 2;
        this.UFO_WIDTH = 30;
        this.UFO_HEIGHT = 12;
        this.MAX_LIVES = 3;
        this.INVINCIBILITY_TIME = 2000;

        // Alien types and points
        this.ALIEN_TYPES = [
            { points: 30, color: '#ff00ff' },  // Squid (top row)
            { points: 20, color: '#00ffff' },  // Crab (middle rows)
            { points: 10, color: '#39ff14' }   // Octopus (bottom rows)
        ];

        // Game state
        this.player = { x: 185, y: 370, alive: true, invincibleUntil: 0 };
        this.aliens = [];
        this.bunkers = [];
        this.playerBullet = null;
        this.alienBullets = [];
        this.ufo = null;
        this.ufoTimer = 0;
        this.scorePopups = [];
        this.particles = [];
        this.score = 0;
        this.wave = 1;
        this.lives = this.MAX_LIVES;
        this.highScore = 0;
        this.alienDirection = 1; // 1 = right, -1 = left
        this.alienSpeed = 0.5;
        this.alienMoveTimer = 0;
        this.alienMoveInterval = 60;
        this.alienFireRate = 0.001;
        this.gameRunning = false;
        this.isPaused = false;
        this.gameOver = false;

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
        this.createAliens();
        this.createBunkers();
        this.resetPlayer();
        this.startGameLoop();
        this.updateStatus('Defend Earth from the alien invasion!');
    }

    /**
     * Reset game state
     */
    reset() {
        // Stop any existing game loop
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }

        // Reset game state
        this.score = 0;
        this.wave = 1;
        this.lives = this.MAX_LIVES;
        this.alienSpeed = 0.5;
        this.alienMoveInterval = 60;
        this.alienFireRate = 0.001;
        this.ufoTimer = 0;
        this.alienDirection = 1;

        // Clear arrays
        this.aliens = [];
        this.bunkers = [];
        this.alienBullets = [];
        this.scorePopups = [];
        this.particles = [];
        this.playerBullet = null;
        this.ufo = null;

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

        // Space to fire or toggle pause
        if (e.key === ' ') {
            if (this.gameRunning && !this.isPaused && !this.gameOver) {
                this.firePlayerBullet();
            } else {
                this.togglePause();
            }
            return;
        }

        // P to toggle pause
        if (e.key === 'p' || e.key === 'P') {
            this.togglePause();
            return;
        }

        // Don't process movement if paused or game over
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

        // Tap to fire (if touch didn't move much)
        if (this.touchX !== null) {
            const touch = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.CANVAS_WIDTH / rect.width;
            const endX = (touch.clientX - rect.left) * scaleX;

            if (Math.abs(endX - this.touchX) < 10) {
                if (this.gameRunning && !this.isPaused && !this.gameOver) {
                    this.firePlayerBullet();
                } else {
                    this.togglePause();
                }
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
            this.updateStatus('Defend Earth from the alien invasion!');
        }
    }

    /**
     * Create aliens for current wave
     */
    createAliens() {
        this.aliens = [];

        const startX = 30;
        const startY = 30 + Math.min((this.wave - 1) * 10, 90); // Start lower in later waves

        for (let row = 0; row < this.ALIEN_ROWS; row++) {
            for (let col = 0; col < this.ALIEN_COLS; col++) {
                const typeIndex = row < 1 ? 0 : (row < 3 ? 1 : 2);
                this.aliens.push({
                    x: startX + col * (this.ALIEN_WIDTH + this.ALIEN_PADDING),
                    y: startY + row * (this.ALIEN_HEIGHT + this.ALIEN_PADDING),
                    width: this.ALIEN_WIDTH,
                    height: this.ALIEN_HEIGHT,
                    type: typeIndex,
                    alive: true,
                    frame: 0
                });
            }
        }

        // Adjust speed based on wave
        this.alienSpeed = 0.5 + (this.wave - 1) * 0.1;
        this.alienMoveInterval = Math.max(20, 60 - (this.wave - 1) * 5);
        this.alienFireRate = Math.min(0.005, 0.001 + (this.wave - 1) * 0.0005);
    }

    /**
     * Create bunkers
     */
    createBunkers() {
        this.bunkers = [];
        const spacing = this.CANVAS_WIDTH / (this.BUNKER_COUNT + 1);

        for (let i = 0; i < this.BUNKER_COUNT; i++) {
            const x = spacing * (i + 1) - this.BUNKER_WIDTH / 2;
            const y = 320;

            const sections = [];
            for (let j = 0; j < this.BUNKER_SECTIONS; j++) {
                sections.push({
                    x: x + (j * this.BUNKER_WIDTH / this.BUNKER_SECTIONS),
                    y: y,
                    width: this.BUNKER_WIDTH / this.BUNKER_SECTIONS,
                    height: this.BUNKER_HEIGHT,
                    health: 3
                });
            }

            this.bunkers.push({ sections: sections, alive: true });
        }
    }

    /**
     * Reset player position
     */
    resetPlayer() {
        this.player.x = this.CANVAS_WIDTH / 2 - this.PLAYER_WIDTH / 2;
        this.player.y = 370;
        this.player.alive = true;
        this.player.invincibleUntil = performance.now() + this.INVINCIBILITY_TIME;
    }

    /**
     * Fire player bullet
     */
    firePlayerBullet() {
        if (!this.playerBullet && this.player.alive) {
            this.playerBullet = {
                x: this.player.x + this.PLAYER_WIDTH / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 10,
                active: true
            };
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
        this.updatePlayer();
        this.updatePlayerBullet();
        this.updateAliens();
        this.updateAlienBullets();
        this.updateBunkers();
        this.updateUFO();
        this.updateScorePopups();
        this.updateParticles();
        this.checkCollisions();
        this.checkWaveComplete();
    }

    /**
     * Update player position
     */
    updatePlayer() {
        if (!this.player.alive) return;

        // Keyboard controls
        if (this.keys.ArrowLeft || this.keys.a) {
            this.player.x -= this.PLAYER_SPEED;
        }
        if (this.keys.ArrowRight || this.keys.d) {
            this.player.x += this.PLAYER_SPEED;
        }

        // Touch control
        if (this.touchX !== null) {
            const targetX = this.touchX - this.PLAYER_WIDTH / 2;
            this.player.x += (targetX - this.player.x) * 0.2;
        }

        // Constrain player to canvas
        this.player.x = Math.max(0, Math.min(this.CANVAS_WIDTH - this.PLAYER_WIDTH, this.player.x));
    }

    /**
     * Update player bullet
     */
    updatePlayerBullet() {
        if (!this.playerBullet) return;

        this.playerBullet.y -= this.BULLET_SPEED;

        // Remove if off screen
        if (this.playerBullet.y < 0) {
            this.playerBullet = null;
        }
    }

    /**
     * Update aliens
     */
    updateAliens() {
        this.alienMoveTimer++;

        if (this.alienMoveTimer >= this.alienMoveInterval) {
            this.alienMoveTimer = 0;

            let shouldDrop = false;
            let shouldReverse = false;

            // Check if any alien will hit edge
            for (const alien of this.aliens) {
                if (!alien.alive) continue;

                if ((alien.x + alien.width + this.alienSpeed * this.alienDirection > this.CANVAS_WIDTH - 10) ||
                    (alien.x + this.alienSpeed * this.alienDirection < 10)) {
                    shouldReverse = true;
                    shouldDrop = true;
                    break;
                }
            }

            // Move aliens
            for (const alien of this.aliens) {
                if (!alien.alive) continue;

                if (shouldDrop) {
                    alien.y += 10;
                }

                if (shouldReverse) {
                    this.alienDirection *= -1;
                } else {
                    alien.x += this.alienSpeed * this.alienDirection;
                }

                // Animate alien frame
                alien.frame = 1 - alien.frame;
            }

            // Play sound on move
            SoundManager.play('alien-move');

            // Alien shooting
            for (const alien of this.aliens) {
                if (!alien.alive) continue;

                // Only bottom row aliens can shoot
                const isBottomRow = !this.aliens.some(a =>
                    a.alive && a.x === alien.x && a.y > alien.y
                );

                if (isBottomRow && Math.random() < this.alienFireRate) {
                    this.alienBullets.push({
                        x: alien.x + alien.width / 2 - 2,
                        y: alien.y + alien.height,
                        width: 4,
                        height: 8,
                        active: true
                    });
                }
            }

            // Speed up as aliens are destroyed
            const aliveCount = this.aliens.filter(a => a.alive).length;
            const totalCount = this.ALIEN_ROWS * this.ALIEN_COLS;
            this.alienMoveInterval = Math.max(5, 60 - (1 - aliveCount / totalCount) * 50);
        }
    }

    /**
     * Update alien bullets
     */
    updateAlienBullets() {
        for (let i = this.alienBullets.length - 1; i >= 0; i--) {
            const bullet = this.alienBullets[i];
            bullet.y += this.ALIEN_BULLET_SPEED;

            // Remove if off screen
            if (bullet.y > this.CANVAS_HEIGHT) {
                this.alienBullets.splice(i, 1);
            }
        }
    }

    /**
     * Update bunkers
     */
    updateBunkers() {
        for (const bunker of this.bunkers) {
            if (!bunker.alive) continue;

            // Remove destroyed sections
            bunker.sections = bunker.sections.filter(s => s.health > 0);

            // Check if bunker is completely destroyed
            if (bunker.sections.length === 0) {
                bunker.alive = false;
            }
        }
    }

    /**
     * Update UFO
     */
    updateUFO() {
        this.ufoTimer++;

        // Spawn UFO every 20-30 seconds (1200-1800 frames at 60fps)
        if (!this.ufo && this.ufoTimer > 1200 && Math.random() < 0.001) {
            this.ufoTimer = 0;
            const direction = Math.random() > 0.5 ? 1 : -1;
            this.ufo = {
                x: direction === 1 ? -this.UFO_WIDTH : this.CANVAS_WIDTH,
                y: 15,
                width: this.UFO_WIDTH,
                height: this.UFO_HEIGHT,
                direction: direction,
                active: true
            };
            SoundManager.play('ufo');
        }

        // Move UFO
        if (this.ufo) {
            this.ufo.x += this.ufo.direction * 2;

            // Remove if off screen
            if ((this.ufo.direction === 1 && this.ufo.x > this.CANVAS_WIDTH) ||
                (this.ufo.direction === -1 && this.ufo.x < -this.UFO_WIDTH)) {
                this.ufo = null;
            }
        }
    }

    /**
     * Update score popups
     */
    updateScorePopups() {
        for (let i = this.scorePopups.length - 1; i >= 0; i--) {
            const popup = this.scorePopups[i];
            popup.y -= 1;
            popup.life--;

            if (popup.life <= 0) {
                this.scorePopups.splice(i, 1);
            }
        }
    }

    /**
     * Update particles
     */
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Check collisions
     */
    checkCollisions() {
        // Player bullet vs aliens
        if (this.playerBullet) {
            for (const alien of this.aliens) {
                if (!alien.alive) continue;

                if (this.playerBullet.x + this.playerBullet.width > alien.x &&
                    this.playerBullet.x < alien.x + alien.width &&
                    this.playerBullet.y + this.playerBullet.height > alien.y &&
                    this.playerBullet.y < alien.y + alien.height) {

                    alien.alive = false;
                    this.playerBullet = null;

                    const points = this.ALIEN_TYPES[alien.type].points;
                    this.score += points;

                    // Add score popup
                    this.scorePopups.push({
                        x: alien.x + alien.width / 2,
                        y: alien.y,
                        score: points,
                        life: 60
                    });

                    // Add particles
                    this.createExplosion(alien.x + alien.width / 2, alien.y + alien.height / 2, this.ALIEN_TYPES[alien.type].color);

                    SoundManager.play('explosion');
                    this.updateDisplay();
                    break;
                }
            }
        }

        // Player bullet vs UFO
        if (this.playerBullet && this.ufo) {
            if (this.playerBullet.x + this.playerBullet.width > this.ufo.x &&
                this.playerBullet.x < this.ufo.x + this.ufo.width &&
                this.playerBullet.y + this.playerBullet.height > this.ufo.y &&
                this.playerBullet.y < this.ufo.y + this.ufo.height) {

                const bonus = [50, 100, 150, 200][Math.floor(Math.random() * 4)];
                this.score += bonus;

                this.scorePopups.push({
                    x: this.ufo.x + this.ufo.width / 2,
                    y: this.ufo.y,
                    score: bonus,
                    life: 60
                });

                this.createExplosion(this.ufo.x + this.ufo.width / 2, this.ufo.y + this.ufo.height / 2, '#ff00ff');

                this.ufo = null;
                this.playerBullet = null;

                SoundManager.play('bonus');
                this.updateDisplay();
            }
        }

        // Player bullet vs bunkers
        if (this.playerBullet) {
            for (const bunker of this.bunkers) {
                if (!bunker.alive) continue;

                for (const section of bunker.sections) {
                    if (this.playerBullet.x + this.playerBullet.width > section.x &&
                        this.playerBullet.x < section.x + section.width &&
                        this.playerBullet.y + this.playerBullet.height > section.y &&
                        this.playerBullet.y < section.y + section.height) {

                        section.health--;
                        this.playerBullet = null;
                        SoundManager.play('collision');
                        break;
                    }
                }
            }
        }

        // Alien bullets vs player
        if (this.player.alive && performance.now() > this.player.invincibleUntil) {
            for (let i = this.alienBullets.length - 1; i >= 0; i--) {
                const bullet = this.alienBullets[i];

                if (bullet.x + bullet.width > this.player.x &&
                    bullet.x < this.player.x + this.PLAYER_WIDTH &&
                    bullet.y + bullet.height > this.player.y &&
                    bullet.y < this.player.y + this.PLAYER_HEIGHT) {

                    this.alienBullets.splice(i, 1);
                    this.playerHit();
                    break;
                }
            }
        }

        // Alien bullets vs bunkers
        for (let i = this.alienBullets.length - 1; i >= 0; i--) {
            const bullet = this.alienBullets[i];

            for (const bunker of this.bunkers) {
                if (!bunker.alive) continue;

                for (const section of bunker.sections) {
                    if (bullet.x + bullet.width > section.x &&
                        bullet.x < section.x + section.width &&
                        bullet.y + bullet.height > section.y &&
                        bullet.y < section.y + section.height) {

                        section.health--;
                        this.alienBullets.splice(i, 1);
                        SoundManager.play('collision');
                        break;
                    }
                }
            }
        }

        // Aliens vs player
        if (this.player.alive && performance.now() > this.player.invincibleUntil) {
            for (const alien of this.aliens) {
                if (!alien.alive) continue;

                if (alien.x + alien.width > this.player.x &&
                    alien.x < this.player.x + this.PLAYER_WIDTH &&
                    alien.y + alien.height > this.player.y &&
                    alien.y < this.player.y + this.PLAYER_HEIGHT) {

                    this.playerHit();
                    break;
                }

                // Game over if aliens reach player level
                if (alien.y + alien.height >= this.player.y) {
                    this.gameOverImmediate();
                    return;
                }
            }
        }

        // Aliens vs bunkers
        for (const alien of this.aliens) {
            if (!alien.alive) continue;

            for (const bunker of this.bunkers) {
                if (!bunker.alive) continue;

                for (const section of bunker.sections) {
                    if (alien.x + alien.width > section.x &&
                        alien.x < section.x + section.width &&
                        alien.y + alien.height > section.y &&
                        alien.y < section.y + section.height) {

                        // Destroy entire bunker
                        bunker.alive = false;
                        break;
                    }
                }
            }
        }
    }

    /**
     * Handle player being hit
     */
    playerHit() {
        this.lives--;
        this.createExplosion(this.player.x + this.PLAYER_WIDTH / 2, this.player.y + this.PLAYER_HEIGHT / 2, '#00ffff');
        SoundManager.play('explosion');
        this.updateDisplay();

        if (this.lives <= 0) {
            this.endGame();
        } else {
            this.player.alive = false;
            setTimeout(() => {
                if (!this.gameOver) {
                    this.resetPlayer();
                }
            }, 1000);
        }
    }

    /**
     * Create explosion particles
     */
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 2 + Math.random() * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 30
            });
        }
    }

    /**
     * Check if wave is complete
     */
    checkWaveComplete() {
        const aliveAliens = this.aliens.filter(a => a.alive);
        if (aliveAliens.length === 0) {
            this.nextWave();
        }
    }

    /**
     * Advance to next wave
     */
    nextWave() {
        this.wave++;

        // Clear bullets
        this.playerBullet = null;
        this.alienBullets = [];

        // Create new aliens
        this.createAliens();

        // Restore bunkers
        this.createBunkers();

        this.updateDisplay();
        SoundManager.play('levelup');
        this.updateStatus(`Wave ${this.wave}`);

        setTimeout(() => {
            if (!this.gameOver) this.updateStatus('Defend Earth from the alien invasion!');
        }, 2000);
    }

    /**
     * Game over (immediate)
     */
    gameOverImmediate() {
        this.gameOver = true;
        this.gameRunning = false;
        SoundManager.play('gameover');
        this.updateStatus('ALIENS REACHED EARTH!');
        this.saveScore(this.score);
        this.updateDisplay();
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
        const waveEl = document.getElementById('current-wave');
        const livesEl = document.getElementById('lives');
        const highScoreEl = document.getElementById('high-score');

        if (scoreEl) scoreEl.textContent = this.score;
        if (waveEl) waveEl.textContent = this.wave;
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

        // Draw bunkers
        for (const bunker of this.bunkers) {
            if (!bunker.alive) continue;
            for (const section of bunker.sections) {
                this.ctx.fillStyle = `rgba(0, 255, 255, ${section.health / 3})`;
                this.ctx.shadowColor = '#00ffff';
                this.ctx.shadowBlur = 5;
                this.ctx.fillRect(section.x, section.y, section.width, section.height);
                this.ctx.shadowBlur = 0;
            }
        }

        // Draw aliens
        for (const alien of this.aliens) {
            if (!alien.alive) continue;
            this.drawAlien(alien);
        }

        // Draw UFO
        if (this.ufo) {
            this.drawUFO();
        }

        // Draw player
        if (this.player.alive) {
            this.drawPlayer();
        }

        // Draw player bullet
        if (this.playerBullet) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.shadowColor = '#ffff00';
            this.ctx.shadowBlur = 5;
            this.ctx.fillRect(this.playerBullet.x, this.playerBullet.y, this.playerBullet.width, this.playerBullet.height);
            this.ctx.shadowBlur = 0;
        }

        // Draw alien bullets
        this.ctx.fillStyle = '#ff0040';
        this.ctx.shadowColor = '#ff0040';
        this.ctx.shadowBlur = 3;
        for (const bullet of this.alienBullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
        this.ctx.shadowBlur = 0;

        // Draw score popups
        for (const popup of this.scorePopups) {
            this.ctx.font = '10px "Press Start 2P"';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(popup.score, popup.x, popup.y);
        }

        // Draw particles
        for (const particle of this.particles) {
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, 2, 2);
        }

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
     * Draw an alien
     */
    drawAlien(alien) {
        const type = this.ALIEN_TYPES[alien.type];
        this.ctx.shadowColor = type.color;
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = type.color;

        // Simple pixel art alien
        const x = alien.x;
        const y = alien.y;
        const w = alien.width;
        const h = alien.height;

        // Body
        this.ctx.fillRect(x + w * 0.2, y, w * 0.6, h * 0.6);
        this.ctx.fillRect(x, y + h * 0.3, w, h * 0.4);

        // Legs (animated)
        if (alien.frame === 0) {
            this.ctx.fillRect(x, y + h * 0.7, w * 0.2, h * 0.3);
            this.ctx.fillRect(x + w * 0.8, y + h * 0.7, w * 0.2, h * 0.3);
        } else {
            this.ctx.fillRect(x + w * 0.1, y + h * 0.7, w * 0.2, h * 0.3);
            this.ctx.fillRect(x + w * 0.7, y + h * 0.7, w * 0.2, h * 0.3);
        }

        // Eyes
        this.ctx.fillStyle = '#0a0a12';
        this.ctx.fillRect(x + w * 0.3, y + h * 0.2, w * 0.15, h * 0.2);
        this.ctx.fillRect(x + w * 0.55, y + h * 0.2, w * 0.15, h * 0.2);

        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw UFO
     */
    drawUFO() {
        this.ctx.shadowColor = '#ff00ff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#ff00ff';

        // UFO shape
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.ufo.x + this.ufo.width / 2,
            this.ufo.y + this.ufo.height / 2,
            this.ufo.width / 2,
            this.ufo.height / 2,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Dome
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.ufo.x + this.ufo.width / 2,
            this.ufo.y + this.ufo.height * 0.3,
            this.ufo.width * 0.25,
            this.ufo.height * 0.4,
            0, Math.PI, 0
        );
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw player ship
     */
    drawPlayer() {
        const now = performance.now();
        const isInvincible = now < this.player.invincibleUntil;

        // Blink when invincible
        if (isInvincible && Math.floor(now / 100) % 2 === 0) {
            return;
        }

        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#00ffff';

        // Ship body
        this.ctx.fillRect(this.player.x + this.PLAYER_WIDTH * 0.35, this.player.y, this.PLAYER_WIDTH * 0.3, this.PLAYER_HEIGHT * 0.6);
        this.ctx.fillRect(this.player.x + this.PLAYER_WIDTH * 0.2, this.player.y + this.PLAYER_HEIGHT * 0.4, this.PLAYER_WIDTH * 0.6, this.PLAYER_HEIGHT * 0.4);
        this.ctx.fillRect(this.player.x, this.player.y + this.PLAYER_HEIGHT * 0.7, this.PLAYER_WIDTH, this.PLAYER_HEIGHT * 0.3);

        this.ctx.shadowBlur = 0;
    }
}
