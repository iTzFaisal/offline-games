/**
 * Asteroids Game
 * Classic vector-style space shooter with ship rotation and thrust physics
 * Extends BaseGame with 'highscore' mode
 */
class AsteroidsGame extends BaseGame {
    constructor(canvasId) {
        super('asteroids', 'highscore');

        // Canvas setup
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game constants
        this.CANVAS_WIDTH = 400;
        this.CANVAS_HEIGHT = 400;
        this.SHIP_SIZE = 20;
        this.SHIP_TURN_SPEED = 0.1;
        this.SHIP_THRUST = 0.15;
        this.SHIP_FRICTION = 0.99;
        this.BULLET_LENGTH = 5;
        this.BULLET_SPEED = 8;
        this.BULLET_MAX = 4;
        this.BULLET_LIFETIME = 120; // 2 seconds at 60fps
        this.ASTEROID_SPEED = 1;
        this.ASTEROID_LARGE = 40;
        this.ASTEROID_MEDIUM = 20;
        this.ASTEROID_SMALL = 10;
        this.MAX_ASTEROIDS = 12;
        this.EXTRA_LIFE_SCORE = 10000;
        this.RESPAWN_DELAY = 120; // 2 seconds
        this.INVINCIBILITY_TIME = 180; // 3 seconds

        // Points for asteroid sizes
        this.ASTEROID_POINTS = {
            large: 20,
            medium: 50,
            small: 100
        };

        // Game state
        this.ship = null;
        this.bullets = [];
        this.asteroids = [];
        this.particles = [];
        this.ufo = null;
        this.ufoTimer = 0;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.highScore = 0;
        this.gameRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        this.respawnTimer = 0;

        // Key states
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            w: false,
            a: false,
            d: false
        };

        // Touch handling
        this.touchLeft = false;
        this.touchRight = false;
        this.touchThrust = false;
        this.touchFire = false;

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
        this.createShip();
        this.createAsteroids();
        this.startGameLoop();
        this.updateStatus('Destroy all asteroids!');
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
        this.level = 1;
        this.lives = 3;
        this.ufoTimer = 0;
        this.respawnTimer = 0;

        // Clear arrays
        this.bullets = [];
        this.asteroids = [];
        this.particles = [];
        this.ufo = null;

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
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'w', 'a', 'd', ' '].includes(e.key)) {
            e.preventDefault();
        }

        // Space to fire or toggle pause
        if (e.key === ' ') {
            if (this.gameRunning && !this.isPaused && !this.gameOver) {
                this.fireBullet();
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
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;

        for (const touch of e.touches) {
            const x = (touch.clientX - rect.left) / width;

            // Left side: rotate left
            if (x < 0.33) {
                this.touchLeft = true;
            }
            // Middle: thrust
            else if (x < 0.66) {
                this.touchThrust = true;
            }
            // Right side: rotate right
            else {
                this.touchRight = true;
            }
        }

        // Double tap to fire
        if (e.touches.length === 2) {
            this.touchFire = true;
            this.fireBullet();
        }
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        e.preventDefault();

        // Single tap to toggle pause
        if (e.changedTouches.length === 1) {
            const hadMultipleControls = this.touchLeft && this.touchRight;
            this.touchLeft = false;
            this.touchRight = false;
            this.touchThrust = false;
            this.touchFire = false;

            if (!hadMultipleControls) {
                // If only light touch, toggle pause
                const touch = e.changedTouches[0];
                const rect = this.canvas.getBoundingClientRect();
                const width = rect.width;
                const x = (touch.clientX - rect.left) / width;

                // Only pause if tapped in center area (not rotation zones)
                if (x > 0.25 && x < 0.75) {
                    this.togglePause();
                }
            }
        } else {
            // Reset all if multiple touches
            if (e.touches.length === 0) {
                this.touchLeft = false;
                this.touchRight = false;
                this.touchThrust = false;
                this.touchFire = false;
            }
        }
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
            this.updateStatus('Destroy all asteroids!');
        }
    }

    /**
     * Create the player ship
     */
    createShip() {
        this.ship = {
            x: this.CANVAS_WIDTH / 2,
            y: this.CANVAS_HEIGHT / 2,
            vx: 0,
            vy: 0,
            angle: -Math.PI / 2, // Facing up
            alive: true,
            invincibleUntil: performance.now() + this.INVINCIBILITY_TIME
        };
    }

    /**
     * Create asteroids for current level
     */
    createAsteroids() {
        this.asteroids = [];
        const count = Math.min(4 + this.level - 1, this.MAX_ASTEROIDS);

        for (let i = 0; i < count; i++) {
            this.spawnAsteroid('large');
        }
    }

    /**
     * Spawn a single asteroid
     */
    spawnAsteroid(size, x, y) {
        let asteroidX, asteroidY;

        if (x !== undefined && y !== undefined) {
            asteroidX = x;
            asteroidY = y;
        } else {
            // Random position away from ship
            do {
                asteroidX = Math.random() * this.CANVAS_WIDTH;
                asteroidY = Math.random() * this.CANVAS_HEIGHT;
            } while (this.ship && Math.hypot(asteroidX - this.ship.x, asteroidY - this.ship.y) < 100);
        }

        const angle = Math.random() * Math.PI * 2;
        const speed = this.ASTEROID_SPEED * (1 + this.level * 0.1);

        this.asteroids.push({
            x: asteroidX,
            y: asteroidY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            size: size,
            radius: size === 'large' ? this.ASTEROID_LARGE : (size === 'medium' ? this.ASTEROID_MEDIUM : this.ASTEROID_SMALL),
            vertices: this.generateAsteroidVertices(size === 'large' ? this.ASTEROID_LARGE : (size === 'medium' ? this.ASTEROID_MEDIUM : this.ASTEROID_SMALL))
        });
    }

    /**
     * Generate jagged asteroid vertices
     */
    generateAsteroidVertices(radius) {
        const vertices = [];
        const numVertices = 8 + Math.floor(Math.random() * 4);

        for (let i = 0; i < numVertices; i++) {
            const angle = (Math.PI * 2 * i) / numVertices;
            const variance = 0.7 + Math.random() * 0.3;
            vertices.push({
                x: Math.cos(angle) * radius * variance,
                y: Math.sin(angle) * radius * variance
            });
        }

        return vertices;
    }

    /**
     * Fire a bullet
     */
    fireBullet() {
        if (!this.ship || !this.ship.alive) return;
        if (this.bullets.length >= this.BULLET_MAX) return;

        const bullet = {
            x: this.ship.x + Math.cos(this.ship.angle) * this.SHIP_SIZE,
            y: this.ship.y + Math.sin(this.ship.angle) * this.SHIP_SIZE,
            vx: Math.cos(this.ship.angle) * this.BULLET_SPEED,
            vy: Math.sin(this.ship.angle) * this.BULLET_SPEED,
            life: this.BULLET_LIFETIME
        };

        this.bullets.push(bullet);
        SoundManager.play('asteroids-shoot');
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
        this.updateShip();
        this.updateBullets();
        this.updateAsteroids();
        this.updateParticles();
        this.updateUFO();
        this.checkCollisions();
        this.checkLevelComplete();

        // Update respawn timer
        if (this.respawnTimer > 0) {
            this.respawnTimer--;
            if (this.respawnTimer === 0) {
                this.createShip();
            }
        }
    }

    /**
     * Update ship
     */
    updateShip() {
        if (!this.ship || !this.ship.alive) return;

        // Rotation
        if (this.keys.ArrowLeft || this.keys.a || this.touchLeft) {
            this.ship.angle -= this.SHIP_TURN_SPEED;
        }
        if (this.keys.ArrowRight || this.keys.d || this.touchRight) {
            this.ship.angle += this.SHIP_TURN_SPEED;
        }

        // Thrust
        if (this.keys.ArrowUp || this.keys.w || this.touchThrust) {
            this.ship.vx += Math.cos(this.ship.angle) * this.SHIP_THRUST;
            this.ship.vy += Math.sin(this.ship.angle) * this.SHIP_THRUST;

            // Thrust particles
            if (Math.random() < 0.3) {
                this.particles.push({
                    x: this.ship.x - Math.cos(this.ship.angle) * this.SHIP_SIZE,
                    y: this.ship.y - Math.sin(this.ship.angle) * this.SHIP_SIZE,
                    vx: -Math.cos(this.ship.angle) * 2 + (Math.random() - 0.5),
                    vy: -Math.sin(this.ship.angle) * 2 + (Math.random() - 0.5),
                    life: 15,
                    color: '#ff8000'
                });
            }
        }

        // Apply friction
        this.ship.vx *= this.SHIP_FRICTION;
        this.ship.vy *= this.SHIP_FRICTION;

        // Move ship
        this.ship.x += this.ship.vx;
        this.ship.y += this.ship.vy;

        // Screen wrapping
        this.ship.x = (this.ship.x + this.CANVAS_WIDTH) % this.CANVAS_WIDTH;
        this.ship.y = (this.ship.y + this.CANVAS_HEIGHT) % this.CANVAS_HEIGHT;
    }

    /**
     * Update bullets
     */
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;

            // Screen wrapping
            bullet.x = (bullet.x + this.CANVAS_WIDTH) % this.CANVAS_WIDTH;
            bullet.y = (bullet.y + this.CANVAS_HEIGHT) % this.CANVAS_HEIGHT;

            // Remove expired bullets
            if (bullet.life <= 0) {
                this.bullets.splice(i, 1);
            }
        }
    }

    /**
     * Update asteroids
     */
    updateAsteroids() {
        for (const asteroid of this.asteroids) {
            asteroid.x += asteroid.vx;
            asteroid.y += asteroid.vy;
            asteroid.rotation += asteroid.rotationSpeed;

            // Screen wrapping
            asteroid.x = (asteroid.x + this.CANVAS_WIDTH) % this.CANVAS_WIDTH;
            asteroid.y = (asteroid.y + this.CANVAS_HEIGHT) % this.CANVAS_HEIGHT;
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
     * Update UFO
     */
    updateUFO() {
        this.ufoTimer++;

        // Spawn UFO every 30 seconds
        if (!this.ufo && this.ufoTimer > 1800) {
            this.ufoTimer = 0;
            const direction = Math.random() > 0.5 ? 1 : -1;
            this.ufo = {
                x: direction === 1 ? -30 : this.CANVAS_WIDTH + 30,
                y: 50 + Math.random() * 100,
                vx: direction * 2,
                shootTimer: 0,
                direction: direction
            };
        }

        // Move UFO
        if (this.ufo) {
            this.ufo.x += this.ufo.vx;

            // UFO shooting
            this.ufo.shootTimer++;
            if (this.ufo.shootTimer > 180 && this.ship && this.ship.alive) {
                this.ufo.shootTimer = 0;
                const angle = Math.atan2(this.ship.y - this.ufo.y, this.ship.x - this.ufo.x);
                this.bullets.push({
                    x: this.ufo.x,
                    y: this.ufo.y,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3,
                    life: 180,
                    isUfo: true
                });
            }

            // Remove if off screen
            if ((this.ufo.direction === 1 && this.ufo.x > this.CANVAS_WIDTH + 50) ||
                (this.ufo.direction === -1 && this.ufo.x < -50)) {
                this.ufo = null;
            }
        }
    }

    /**
     * Check collisions
     */
    checkCollisions() {
        // Bullets vs asteroids
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.isUfo) continue; // Skip UFO bullets for asteroid collision

            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                const asteroid = this.asteroids[j];

                if (Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y) < asteroid.radius) {
                    // Hit!
                    this.bullets.splice(i, 1);

                    // Score
                    this.score += this.ASTEROID_POINTS[asteroid.size];

                    // Create particles
                    for (let k = 0; k < 8; k++) {
                        const angle = (Math.PI * 2 * k) / 8;
                        this.particles.push({
                            x: asteroid.x,
                            y: asteroid.y,
                            vx: Math.cos(angle) * 2,
                            vy: Math.sin(angle) * 2,
                            life: 30,
                            color: '#ffffff'
                        });
                    }

                    // Split asteroid
                    if (asteroid.size === 'large') {
                        this.spawnAsteroid('medium', asteroid.x, asteroid.y);
                        this.spawnAsteroid('medium', asteroid.x, asteroid.y);
                    } else if (asteroid.size === 'medium') {
                        this.spawnAsteroid('small', asteroid.x, asteroid.y);
                        this.spawnAsteroid('small', asteroid.x, asteroid.y);
                    }

                    this.asteroids.splice(j, 1);
                    SoundManager.play('asteroids-explode');
                    this.updateDisplay();
                    break;
                }
            }
        }

        // Ship vs asteroids
        if (this.ship && this.ship.alive && performance.now() > this.ship.invincibleUntil) {
            for (const asteroid of this.asteroids) {
                if (Math.hypot(this.ship.x - asteroid.x, this.ship.y - asteroid.y) < asteroid.radius + this.SHIP_SIZE / 2) {
                    this.destroyShip();
                    break;
                }
            }
        }

        // Bullets vs UFO
        if (this.ufo) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                if (bullet.isUfo) continue;

                if (Math.hypot(bullet.x - this.ufo.x, bullet.y - this.ufo.y) < 30) {
                    // Hit UFO
                    const bonus = 100 + Math.floor(Math.random() * 400);
                    this.score += bonus;

                    // Create particles
                    for (let k = 0; k < 10; k++) {
                        const angle = (Math.PI * 2 * k) / 10;
                        this.particles.push({
                            x: this.ufo.x,
                            y: this.ufo.y,
                            vx: Math.cos(angle) * 3,
                            vy: Math.sin(angle) * 3,
                            life: 40,
                            color: '#ff00ff'
                        });
                    }

                    this.bullets.splice(i, 1);
                    this.ufo = null;
                    SoundManager.play('bonus');
                    this.updateDisplay();
                    break;
                }
            }
        }

        // UFO bullets vs ship
        if (this.ship && this.ship.alive && performance.now() > this.ship.invincibleUntil) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                if (!bullet.isUfo) continue;

                if (Math.hypot(bullet.x - this.ship.x, bullet.y - this.ship.y) < this.SHIP_SIZE) {
                    this.bullets.splice(i, 1);
                    this.destroyShip();
                    break;
                }
            }
        }

        // Check for extra life
        const lastExtraLife = Math.floor((this.score - this.ASTEROID_POINTS[this.asteroids[0]?.size || 'large']) / this.EXTRA_LIFE_SCORE);
        const currentExtraLife = Math.floor(this.score / this.EXTRA_LIFE_SCORE);
        if (currentExtraLife > lastExtraLife) {
            this.lives++;
            this.updateDisplay();
            SoundManager.play('levelup');
        }
    }

    /**
     * Destroy the ship
     */
    destroyShip() {
        // Create explosion particles
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            this.particles.push({
                x: this.ship.x,
                y: this.ship.y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: 40,
                color: '#00ffff'
            });
        }

        this.ship.alive = false;
        this.lives--;
        this.respawnTimer = this.RESPAWN_DELAY;

        SoundManager.play('asteroids-explode');
        this.updateDisplay();

        if (this.lives <= 0) {
            this.endGame();
        }
    }

    /**
     * Check if level is complete
     */
    checkLevelComplete() {
        if (this.asteroids.length === 0) {
            this.nextLevel();
        }
    }

    /**
     * Advance to next level
     */
    nextLevel() {
        this.level++;
        this.createAsteroids();
        this.updateDisplay();
        SoundManager.play('levelup');
        this.updateStatus(`Level ${this.level}`);

        setTimeout(() => {
            if (!this.gameOver) this.updateStatus('Destroy all asteroids!');
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

        // Draw asteroids
        for (const asteroid of this.asteroids) {
            this.drawAsteroid(asteroid);
        }

        // Draw UFO
        if (this.ufo) {
            this.drawUFO();
        }

        // Draw bullets
        for (const bullet of this.bullets) {
            this.ctx.strokeStyle = bullet.isUfo ? '#ff00ff' : '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = bullet.isUfo ? '#ff00ff' : '#ffffff';
            this.ctx.shadowBlur = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(bullet.x, bullet.y);
            this.ctx.lineTo(bullet.x - bullet.vx * 0.5, bullet.y - bullet.vy * 0.5);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }

        // Draw ship
        if (this.ship && this.ship.alive) {
            this.drawShip();
        }

        // Draw particles
        for (const particle of this.particles) {
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
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
     * Draw the ship
     */
    drawShip() {
        const now = performance.now();
        const isInvincible = now < this.ship.invincibleUntil;

        // Blink when invincible
        if (isInvincible && Math.floor(now / 100) % 2 === 0) {
            return;
        }

        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 10;

        this.ctx.save();
        this.ctx.translate(this.ship.x, this.ship.y);
        this.ctx.rotate(this.ship.angle + Math.PI / 2);

        // Draw ship as triangle
        this.ctx.beginPath();
        this.ctx.moveTo(0, -this.SHIP_SIZE);
        this.ctx.lineTo(-this.SHIP_SIZE * 0.6, this.SHIP_SIZE * 0.6);
        this.ctx.lineTo(0, this.SHIP_SIZE * 0.3);
        this.ctx.lineTo(this.SHIP_SIZE * 0.6, this.SHIP_SIZE * 0.6);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw an asteroid
     */
    drawAsteroid(asteroid) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 5;

        this.ctx.save();
        this.ctx.translate(asteroid.x, asteroid.y);
        this.ctx.rotate(asteroid.rotation);

        this.ctx.beginPath();
        this.ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
        for (let i = 1; i < asteroid.vertices.length; i++) {
            this.ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y);
        }
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw UFO
     */
    drawUFO() {
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#ff00ff';
        this.ctx.shadowBlur = 10;

        this.ctx.beginPath();
        // UFO body
        this.ctx.ellipse(this.ufo.x, this.ufo.y, 20, 8, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        // UFO dome
        this.ctx.beginPath();
        this.ctx.ellipse(this.ufo.x, this.ufo.y - 3, 10, 6, 0, Math.PI, 0);
        this.ctx.stroke();

        this.ctx.shadowBlur = 0;
    }
}
