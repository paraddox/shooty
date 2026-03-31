import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // World bounds (game arena)
        const worldWidth = 1920;
        const worldHeight = 1440;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBackgroundColor('#0a0a0f');

        // Create environment
        this.createFloor();
        this.createAmbientGrid();

        // Player
        this.player = new Player(this, worldWidth / 2, worldHeight / 2);

        // Camera setup
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        
        // Determine if screen is larger than world
        const screenLarger = screenWidth > worldWidth && screenHeight > worldHeight;
        
        if (screenLarger) {
            // Screen is bigger than world - no zoom, center the world
            this.cameras.main.setZoom(1.0);
            
            // Calculate the offset to center the world in the screen
            const offsetX = (screenWidth - worldWidth) / 2;
            const offsetY = (screenHeight - worldHeight) / 2;
            
            // Set camera bounds to allow the offset
            this.cameras.main.setBounds(-offsetX, -offsetY, screenWidth, screenHeight);
            
            // Position camera so world is centered
            this.cameras.main.setScroll(-offsetX, -offsetY);
            
            // Manual camera follow - no startFollow needed
        } else {
            // Screen is smaller than world - zoom out to fit
            const zoomX = screenWidth / worldWidth;
            const zoomY = screenHeight / worldHeight;
            const baseZoom = Math.min(zoomX, zoomY);
            this.cameras.main.setZoom(baseZoom);
            
            // Camera bounds match world
            this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
            
            // Calculate scroll to center the player in the viewport
            // scroll = playerPosition - (visibleArea / 2)
            const visibleWidth = screenWidth / baseZoom;
            const visibleHeight = screenHeight / baseZoom;
            const scrollX = this.player.x - visibleWidth / 2;
            const scrollY = this.player.y - visibleHeight / 2;
            this.cameras.main.setScroll(scrollX, scrollY);
            
            // Manual camera follow - no startFollow
        }
        
        // Store base zoom for mouse wheel zooming
        this.baseZoom = this.cameras.main.zoom;
        this.currentZoom = this.cameras.main.zoom;
        this.minZoom = 0.3;
        this.maxZoom = 2.0;
        
        // Mouse wheel - adjust camera distance multiplier instead of zoom
        // This avoids the complexity of zoom+scroll calculations
        this.targetZoomOffset = 0;
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const zoomSpeed = 0.05;
            const zoomChange = deltaY > 0 ? zoomSpeed : -zoomSpeed;
            this.targetZoomOffset = Phaser.Math.Clamp(
                this.targetZoomOffset + zoomChange,
                -0.3,  // Can zoom out up to 30% more
                0.5    // Can zoom in up to 50% closer
            );
        });

        // Bullet pool with trails - 500 for bullet hell
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 500,
            runChildUpdate: true
        });

        // Bullet trail particles
        this.bulletTrails = this.add.particles(0, 0, 'particle', {
            scale: { start: 0.6, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: 0,
            lifespan: 150,
            tint: 0xffff00,
            frequency: -1
        });

        // Enemy hit particles
        this.hitParticles = this.add.particles(0, 0, 'particle', {
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            speed: { min: 50, max: 150 },
            lifespan: 400,
            gravityY: 0,
            quantity: 8,
            frequency: -1
        });

        // Enemy death particles
        this.deathParticles = this.add.particles(0, 0, 'particle', {
            scale: { start: 1.2, end: 0 },
            alpha: { start: 1, end: 0 },
            speed: { min: 80, max: 200 },
            lifespan: 600,
            gravityY: 0,
            quantity: 12,
            frequency: -1
        });

        // Enemies
        this.enemies = this.physics.add.group();
        this.spawnEnemies(4);

        // Spawn timer
        this.spawnTimer = this.time.addEvent({
            delay: 4000,
            callback: () => this.spawnEnemies(3),
            callbackScope: this,
            loop: true
        });

        // Collisions
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
        this.physics.add.collider(this.enemies, this.enemies, this.enemyBounce, null, this);

        // Create a separate UI camera that doesn't zoom
        this.uiCamera = this.cameras.add(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.uiCamera.setScroll(0, 0);
        this.uiCamera.setZoom(1);
        this.uiCamera.ignore([this.player, this.enemies, this.bullets, this.bulletTrails, this.hitParticles, this.deathParticles]);
        
        // Minimalist HUD - add to UI camera
        this.createHUD();
        
        // Tell main camera to ignore HUD elements
        this.cameras.main.ignore([
            this.healthBarBg, this.healthBar, 
            this.scoreText, this.waveText, this.enemyText, 
            this.waveTimerBg, this.waveTimerBar
        ]);

        // Wave system
        this.wave = 1;
        this.nextWaveTime = this.time.now + 30000;

        // Screen shake effect
        this.shakeIntensity = 0;
    }

    update() {
        if (!this.player.active) return;

        this.player.update();
        
        // Dynamic zoom based on enemy count + manual zoom offset
        const enemyCount = this.enemies.countActive();
        const dangerZoom = Math.max(0.5, 1.0 - enemyCount * 0.02); // Zoom out as enemies increase
        const targetZoom = dangerZoom + this.targetZoomOffset;
        const newZoom = Phaser.Math.Clamp(targetZoom, 0.4, 1.5);
        
        // Smoothly interpolate zoom
        const camera = this.cameras.main;
        const currentZoom = camera.zoom;
        const smoothedZoom = currentZoom + (newZoom - currentZoom) * 0.05;
        camera.setZoom(smoothedZoom);
        
        // Manual camera follow - smooth lerp toward player
        const targetScrollX = this.player.x - (camera.width / 2) / smoothedZoom;
        const targetScrollY = this.player.y - (camera.height / 2) / smoothedZoom;
        
        // Smooth lerp toward player
        camera.scrollX += (targetScrollX - camera.scrollX) * 0.08;
        camera.scrollY += (targetScrollY - camera.scrollY) * 0.08;

        // Bullet cleanup and trails
        this.bullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            
            // Spawn trail
            if (this.time.now % 3 === 0) {
                this.bulletTrails.emitParticleAt(bullet.x, bullet.y);
            }
            
            // Kill bullets that go too far off screen (for recycling)
            if (bullet.x < -100 || bullet.x > 2020 || bullet.y < -100 || bullet.y > 1540) {
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.body.reset(0, 0);
                bullet.body.enable = false;
            }
        });

        // Update enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && enemy.update) enemy.update();
        });

        // Update HUD
        this.updateHUD();

        // Wave check
        if (this.time.now > this.nextWaveTime) {
            this.nextWave();
        }
    }

    createFloor() {
        const tileSize = 128;
        // Cover the world bounds area only - the arena
        for (let x = 0; x < 1920; x += tileSize) {
            for (let y = 0; y < 1440; y += tileSize) {
                const tile = this.add.image(x + tileSize/2, y + tileSize/2, 'floor');
                tile.setAlpha(0.4 + Math.random() * 0.2);
                tile.setDepth(-1);
            }
        }
    }

    createAmbientGrid() {
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x1a1a25, 0.2);
        
        // Draw grid only within the world bounds (the playable arena)
        const spacing = 128;
        for (let x = 0; x <= 1920; x += spacing) {
            grid.moveTo(x, 0);
            grid.lineTo(x, 1440);
        }
        for (let y = 0; y <= 1440; y += spacing) {
            grid.moveTo(0, y);
            grid.lineTo(1920, y);
        }
        grid.strokePath();
        grid.setDepth(-1);
    }

    createHUD() {
        const margin = 30;
        
        // Health bar - minimal horizontal bar
        this.healthBarBg = this.add.rectangle(margin, margin, 200, 6, 0x22222a);
        this.healthBar = this.add.rectangle(margin, margin, 200, 6, 0x00f0ff);
        this.healthBar.setOrigin(0, 0.5);
        this.healthBarBg.setOrigin(0, 0.5);
        
        // Score - minimal
        this.scoreText = this.add.text(margin, margin + 20, '0', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: '#ffffff'
        });
        
        // Wave indicator
        this.waveText = this.add.text(margin, margin + 50, 'WAVE 1', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 2,
            fill: '#666677'
        });

        // Enemy count
        this.enemyText = this.add.text(margin, margin + 70, '0 ENEMIES', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 1,
            fill: '#ff3366'
        });

        // Wave timer bar
        this.waveTimerBg = this.add.rectangle(this.cameras.main.width - margin, margin, 100, 3, 0x22222a);
        this.waveTimerBar = this.add.rectangle(this.cameras.main.width - margin, margin, 100, 3, 0xffff00);
        this.waveTimerBg.setOrigin(1, 0.5);
        this.waveTimerBar.setOrigin(1, 0.5);

        // Fixed to camera
        [this.healthBarBg, this.healthBar, this.scoreText, this.waveText, 
         this.enemyText, this.waveTimerBg, this.waveTimerBar].forEach(el => {
            el.setScrollFactor(0);
            el.setDepth(100);
        });

        this.score = 0;
        
        // Handle window resize
        this.scale.on('resize', this.resizeHUD, this);
    }
    
    resizeHUD(gameSize) {
        const margin = 30;
        const worldWidth = 1920;
        const worldHeight = 1440;
        
        // Update wave timer bar position
        this.waveTimerBg.x = gameSize.width - margin;
        this.waveTimerBar.x = gameSize.width - margin;
        
        // Recalculate zoom and centering for new screen size
        const screenLarger = gameSize.width > worldWidth && gameSize.height > worldHeight;
        
        if (screenLarger) {
            // Screen larger than world - center it
            this.currentZoom = 1.0;
            this.cameras.main.setZoom(1.0);
            const offsetX = (gameSize.width - worldWidth) / 2;
            const offsetY = (gameSize.height - worldHeight) / 2;
            this.cameras.main.setBounds(-offsetX, -offsetY, gameSize.width, gameSize.height);
            this.cameras.main.setScroll(-offsetX, -offsetY);
        } else {
            // Screen smaller - zoom to fit
            const zoomX = gameSize.width / worldWidth;
            const zoomY = gameSize.height / worldHeight;
            const newZoom = Math.min(zoomX, zoomY);
            this.currentZoom = newZoom;
            this.cameras.main.setZoom(newZoom);
            this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        }
        
        // Update camera viewports
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
        this.uiCamera.setViewport(0, 0, gameSize.width, gameSize.height);
    }

    updateHUD() {
        // Health
        const healthPercent = Math.max(0, this.player.health / this.player.maxHealth);
        this.healthBar.width = 200 * healthPercent;
        
        // Color shift on low health
        if (healthPercent < 0.3) {
            this.healthBar.fillColor = 0xff3366;
        } else {
            this.healthBar.fillColor = 0x00f0ff;
        }

        // Score
        this.scoreText.setText(this.score.toString().padStart(6, '0'));

        // Enemy count
        const enemyCount = this.enemies.countActive();
        this.enemyText.setText(`${enemyCount} ENEMY${enemyCount !== 1 ? 'S' : ''}`);

        // Wave timer
        const waveProgress = 1 - (this.nextWaveTime - this.time.now) / 30000;
        this.waveTimerBar.width = Math.max(0, 100 * waveProgress);
    }

    spawnEnemies(count) {
        const types = ['enemy', 'enemyFast', 'enemyTank'];
        const worldWidth = 1920;
        const worldHeight = 1440;
        const spawnMargin = 60; // Distance outside the arena to spawn
        
        for (let i = 0; i < count; i++) {
            let x, y;
            
            // Pick a random edge: 0=top, 1=right, 2=bottom, 3=left
            const edge = Phaser.Math.Between(0, 3);
            
            switch (edge) {
                case 0: // Top edge
                    x = Phaser.Math.Between(0, worldWidth);
                    y = -spawnMargin;
                    break;
                case 1: // Right edge
                    x = worldWidth + spawnMargin;
                    y = Phaser.Math.Between(0, worldHeight);
                    break;
                case 2: // Bottom edge
                    x = Phaser.Math.Between(0, worldWidth);
                    y = worldHeight + spawnMargin;
                    break;
                case 3: // Left edge
                    x = -spawnMargin;
                    y = Phaser.Math.Between(0, worldHeight);
                    break;
            }

            // Choose enemy type based on wave
            let type = types[0];
            if (this.wave > 2 && Math.random() < 0.3) type = types[1];
            if (this.wave > 4 && Math.random() < 0.2) type = types[2];

            const enemy = new Enemy(this, x, y, this.player, type);
            this.enemies.add(enemy);
        }
    }

    hitEnemy(bullet, enemy) {
        // Recycle bullet back to pool
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.reset(0, 0);
        bullet.body.enable = false;
        
        // Hit particles
        this.hitParticles.setParticleTint(enemy.tintTopLeft || 0xff3366);
        this.hitParticles.emitParticleAt(enemy.x, enemy.y);
        
        // Screen shake on hit
        this.cameras.main.shake(50, 0.002);
        
        enemy.takeDamage(34);
        
        if (!enemy.active) {
            // Death particles
            this.deathParticles.setParticleTint(enemy.tintTopLeft || 0xff3366);
            this.deathParticles.emitParticleAt(enemy.x, enemy.y);
            
            this.score += enemy.scoreValue;
        }
    }

    playerHit(player, enemy) {
        // Knockback
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        player.knockback(Math.cos(angle) * 300, Math.sin(angle) * 300);
        
        // Player damage
        player.takeDamage(enemy.damage);
        
        // Enemy also takes damage (mutual destruction)
        enemy.takeDamage(20);
        
        // Screen shake
        this.cameras.main.shake(100, 0.005);
        
        // Flash vignette
        this.cameras.main.flash(100, 255, 50, 50, 0.2);

        if (player.health <= 0) {
            this.gameOver();
        }
    }

    enemyBounce(enemy1, enemy2) {
        // Slight separation impulse to prevent clumping
        const angle = Phaser.Math.Angle.Between(enemy1.x, enemy1.y, enemy2.x, enemy2.y);
        const force = 20;
        enemy1.body.velocity.x -= Math.cos(angle) * force;
        enemy1.body.velocity.y -= Math.sin(angle) * force;
        enemy2.body.velocity.x += Math.cos(angle) * force;
        enemy2.body.velocity.y += Math.sin(angle) * force;
    }

    nextWave() {
        this.wave++;
        this.nextWaveTime = this.time.now + 30000;
        
        // Wave announcement
        const waveText = this.add.text(this.player.x, this.player.y - 80, `WAVE ${this.wave}`, {
            fontFamily: 'monospace',
            fontSize: '32px',
            letterSpacing: 4,
            fill: '#ffff00'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: waveText,
            y: waveText.y - 50,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => waveText.destroy()
        });
        
        // Spawn wave
        this.spawnEnemies(3 + this.wave * 2);
        
        // Increase spawn rate
        if (this.spawnTimer.delay > 1500) {
            this.spawnTimer.remove();
            this.spawnTimer = this.time.addEvent({
                delay: Math.max(1500, 4000 - this.wave * 300),
                callback: () => this.spawnEnemies(2 + Math.floor(this.wave / 2)),
                callbackScope: this,
                loop: true
            });
        }
    }

    gameOver() {
        this.cameras.main.shake(300, 0.02);
        this.cameras.main.fade(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameOverScene', { 
                score: this.score, 
                wave: this.wave 
            });
        });
    }

    getBulletsGroup() {
        return this.bullets;
    }

    getBulletTrails() {
        return this.bulletTrails;
    }
}
