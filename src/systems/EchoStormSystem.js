import Phaser from 'phaser';

/**
 * Echo Storm System - Temporal Echo Absorption
 * 
 * During bullet time, enemy bullets leave behind "echo echoes" — ghostly energy
 * trails that the player can graze to absorb. When bullet time ends, all absorbed
 * echoes convert into devastating homing counter-bullets.
 * 
 * This transforms defensive dodging into offensive setup, creating a risk/reward
 * loop where skilled grazing leads to spectacular counter-attacks.
 */

export default class EchoStormSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Echo state
        this.absorbedEchoes = 0;
        this.echoBullets = []; // Bullets currently in echo state (during bullet time)
        this.echoTrailPool = []; // Pool of echo trail sprites
        this.maxEchoTrails = 100;
        
        // Echo visuals
        this.echoGraphics = null;
        this.echoRing = null;
        this.echoCore = null;
        
        // Configuration
        this.ECHO_LIFETIME = 3000; // How long echoes persist (ms)
        this.ECHO_ABSORB_RADIUS = 80; // Distance to absorb an echo
        this.ECHO_DRAG_RADIUS = 150; // Distance to start dragging echoes toward player
        this.HOMING_BULLET_SPEED = 450;
        this.HOMING_TURN_RATE = 0.15; // How aggressively homing bullets turn
        
        // Visual config
        this.ECHO_COLOR = 0xffd700; // Gold
        this.ECHO_CORE_COLOR = 0x00f0ff; // Cyan core
        this.HOMING_BULLET_COLOR = 0xff00ff; // Magenta homing bullets
        
        this.init();
    }
    
    init() {
        this.createEchoVisuals();
        this.createEchoTrailPool();
    }
    
    createEchoVisuals() {
        // Create echo ring around player (shows absorption radius)
        this.echoRing = this.scene.add.graphics();
        this.echoRing.setDepth(50);
        this.echoRing.setVisible(false);
        
        // Create echo core (glowing center)
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Radial gradient for echo core
        const gradient = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.6)');
        gradient.addColorStop(0.7, 'rgba(255, 215, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        this.scene.textures.addCanvas('echoCore', canvas);
        this.echoCore = this.scene.add.image(0, 0, 'echoCore');
        this.echoCore.setDepth(51);
        this.echoCore.setVisible(false);
        this.echoCore.setScale(0);
        
        // Absorbed echo counter text
        this.echoCounter = this.scene.add.text(0, 0, '', {
            fontFamily: 'monospace',
            fontSize: '20px',
            fontStyle: 'bold',
            fill: '#ffd700'
        });
        this.echoCounter.setOrigin(0.5);
        this.echoCounter.setDepth(52);
        this.echoCounter.setVisible(false);
    }
    
    createEchoTrailPool() {
        // Create pool of echo trail sprites
        for (let i = 0; i < this.maxEchoTrails; i++) {
            const echo = this.scene.add.image(0, 0, 'enemyBullet');
            echo.setTint(this.ECHO_COLOR);
            echo.setAlpha(0);
            echo.setScale(0.4);
            echo.setDepth(5);
            echo.setVisible(false);
            
            // Echo data
            echo.echoData = {
                active: false,
                birthTime: 0,
                velocityX: 0,
                velocityY: 0,
                absorbed: false,
                originalBullet: null
            };
            
            this.echoTrailPool.push(echo);
        }
    }
    
    /**
     * Call this when entering bullet time - converts active enemy bullets to echoes
     */
    onBulletTimeStart() {
        this.absorbedEchoes = 0;
        this.echoBullets = [];
        
        // Emit system activation for Dream State Protocol
        this.scene.events.emit('systemActivated', {
            system: 'echoStorm',
            x: this.scene.player?.x || 960,
            y: this.scene.player?.y || 720,
            intensity: 1,
            context: 'bulletTimeStart'
        });
        
        // Show echo ring
        this.echoRing.setVisible(true);
        this.echoCore.setVisible(true);
        this.echoCounter.setVisible(true);
        
        // Convert all active enemy bullets to echo state
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.active) {
                this.convertBulletToEcho(bullet);
            }
        });
        
        // Animate echo core in
        this.scene.tweens.add({
            targets: this.echoCore,
            scale: 1.5,
            duration: 300,
            ease: 'Back.out'
        });
    }
    
    /**
     * Convert a live enemy bullet to an echo trail
     */
    convertBulletToEcho(bullet) {
        // Find inactive echo from pool
        const echo = this.echoTrailPool.find(e => !e.echoData.active);
        if (!echo) return;
        
        // Store bullet velocity for momentum
        const vx = bullet.body?.velocity?.x || 0;
        const vy = bullet.body?.velocity?.y || 0;
        
        // Disable original bullet physics but keep it visible as echo
        bullet.body.enable = false;
        bullet.setVisible(false); // Hide original, use echo visual
        
        // Activate echo at bullet position
        echo.setPosition(bullet.x, bullet.y);
        echo.setAlpha(0.7);
        echo.setVisible(true);
        echo.setRotation(bullet.rotation);
        
        echo.echoData = {
            active: true,
            birthTime: this.scene.time.now,
            velocityX: vx * 0.3, // Echoes move slower
            velocityY: vy * 0.3,
            absorbed: false,
            originalBullet: bullet
        };
        
        this.echoBullets.push({
            echo: echo,
            bullet: bullet
        });
        
        // Fade out echo over time
        this.scene.tweens.add({
            targets: echo,
            alpha: 0,
            duration: this.ECHO_LIFETIME,
            ease: 'Power2',
            onComplete: () => {
                if (echo.echoData.active && !echo.echoData.absorbed) {
                    this.deactivateEcho(echo);
                }
            }
        });
    }
    
    /**
     * Spawn a new echo from a bullet that was just fired during bullet time
     */
    spawnEchoFromNewBullet(bullet) {
        // Find inactive echo from pool
        const echo = this.echoTrailPool.find(e => !e.echoData.active);
        if (!echo) return;
        
        const vx = bullet.body?.velocity?.x || 0;
        const vy = bullet.body?.velocity?.y || 0;
        
        // Activate echo
        echo.setPosition(bullet.x, bullet.y);
        echo.setAlpha(0.7);
        echo.setVisible(true);
        echo.setRotation(bullet.rotation);
        
        echo.echoData = {
            active: true,
            birthTime: this.scene.time.now,
            velocityX: vx * 0.3,
            velocityY: vy * 0.3,
            absorbed: false,
            originalBullet: bullet
        };
        
        this.echoBullets.push({
            echo: echo,
            bullet: bullet
        });
        
        // Fade out
        this.scene.tweens.add({
            targets: echo,
            alpha: 0,
            duration: this.ECHO_LIFETIME,
            ease: 'Power2',
            onComplete: () => {
                if (echo.echoData.active && !echo.echoData.absorbed) {
                    this.deactivateEcho(echo);
                }
            }
        });
    }
    
    /**
     * Update during bullet time - handle echo absorption
     */
    updateBulletTime(player) {
        // Update echo ring position and pulse
        this.echoRing.clear();
        this.echoRing.lineStyle(2, this.ECHO_COLOR, 0.3 + Math.sin(this.scene.time.now / 200) * 0.2);
        const ringRadius = this.getEmpatheticAbsorbRadius();
        this.echoRing.strokeCircle(player.x, player.y, ringRadius);
        
        // Update echo core
        this.echoCore.setPosition(player.x, player.y);
        this.echoCore.setScale(1.5 + Math.sin(this.scene.time.now / 100) * 0.2);
        this.echoCore.setAlpha(0.6 + Math.sin(this.scene.time.now / 150) * 0.3);
        
        // Update counter
        this.echoCounter.setPosition(player.x, player.y - 60);
        this.echoCounter.setText(this.absorbedEchoes > 0 ? `×${this.absorbedEchoes}` : '');
        this.echoCounter.setScale(1 + Math.min(this.absorbedEchoes * 0.1, 0.5));
        
        // Process echoes
        this.echoBullets = this.echoBullets.filter(item => {
            const echo = item.echo;
            if (!echo.echoData.active) return false;
            
            // Move echo with its momentum
            echo.x += echo.echoData.velocityX * this.scene.physics.world.timeScale;
            echo.y += echo.echoData.velocityY * this.scene.physics.world.timeScale;
            
            // Check if echo is within drag radius (start pulling toward player)
            const distToPlayer = Phaser.Math.Distance.Between(echo.x, echo.y, player.x, player.y);
            
            if (distToPlayer <= this.ECHO_DRAG_RADIUS && !echo.echoData.absorbed) {
                // Pull echo toward player
                const angle = Phaser.Math.Angle.Between(echo.x, echo.y, player.x, player.y);
                const pullStrength = (1 - distToPlayer / this.ECHO_DRAG_RADIUS) * 3;
                
                echo.echoData.velocityX += Math.cos(angle) * pullStrength;
                echo.echoData.velocityY += Math.sin(angle) * pullStrength;
                
                // Dampen existing velocity
                echo.echoData.velocityX *= 0.95;
                echo.echoData.velocityY *= 0.95;
            }
            
            // Check absorption (with empathetic radius from Heartflux)
            const absorbRadius = this.getEmpatheticAbsorbRadius();
            if (distToPlayer <= absorbRadius && !echo.echoData.absorbed) {
                this.absorbEcho(echo, player);
                return false; // Remove from active list
            }
            
            return true;
        });
    }
    
    absorbEcho(echo, player) {
        echo.echoData.absorbed = true;
        this.absorbedEchoes++;
        
        // Notify Resonance Cascade of echo absorption
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('ECHO_ABSORB', { 
                totalAbsorbed: this.absorbedEchoes 
            });
        }
        
        // Notify Omni-Weapon of echo absorption (for homing lens mod)
        if (this.scene.omniWeapon) {
            this.scene.omniWeapon.onEchoAbsorbed();
        }
        
        // Record in Timeline Chronicle
        if (this.scene.timelineChronicle) {
            this.scene.timelineChronicle.recordSystemUse('echoStorm', {
                action: 'absorb',
                totalAbsorbed: this.absorbedEchoes
            });
        }
        
        // Record for Temporal Pedagogy System (learning tracking)
        if (this.scene.temporalPedagogy) {
            this.scene.temporalPedagogy.recordSystemUse('ECHO_STORM', 1);
        }
        
        // Emit echo absorbed event for Dream State Protocol
        this.scene.events.emit('echoAbsorbed', {
            x: echo.x,
            y: echo.y,
            type: echo.echoData?.type || 'standard',
            power: echo.echoData?.power || 1,
            totalAbsorbed: this.absorbedEchoes
        });
        
        // Absorption effect
        this.scene.tweens.add({
            targets: echo,
            x: player.x,
            y: player.y,
            scale: 0.1,
            duration: 100,
            ease: 'Power2',
            onComplete: () => {
                this.deactivateEcho(echo);
            }
        });
        
        // Spawn absorption particles
        this.scene.hitParticles.setParticleTint(this.ECHO_COLOR);
        this.scene.hitParticles.emitParticleAt(echo.x, echo.y);
        
        // Flash player with gold tint briefly
        player.setTint(0xffd700);
        this.scene.time.delayedCall(50, () => {
            if (player.active) player.clearTint();
        });
    }
    
    deactivateEcho(echo) {
        echo.echoData.active = false;
        echo.setVisible(false);
        echo.setAlpha(0);
        
        // Recycle original bullet
        if (echo.echoData.originalBullet) {
            echo.echoData.originalBullet.setActive(false);
            echo.echoData.originalBullet.setVisible(false);
            echo.echoData.originalBullet.body.reset(0, 0);
            echo.echoData.originalBullet.body.enable = false;
            echo.echoData.originalBullet.nearMissChecked = false;
            echo.echoData.originalBullet._origVelocity = null;
            echo.echoData.originalBullet._lastTimeScale = 1;
        }
    }
    
    /**
     * Call when bullet time ends - fire all absorbed echoes as homing missiles
     */
    onBulletTimeEnd(player) {
        // Hide visuals
        this.echoRing.setVisible(false);
        this.echoCore.setVisible(false);
        this.echoCounter.setVisible(false);
        
        // Fire absorbed echoes as homing bullets
        if (this.absorbedEchoes > 0) {
            this.fireEchoStorm(player);
        }
        
        // Clean up any remaining echoes
        this.echoBullets.forEach(item => {
            this.deactivateEcho(item.echo);
        });
        this.echoBullets = [];
        
        // Reset counter
        const totalAbsorbed = this.absorbedEchoes;
        this.absorbedEchoes = 0;
        
        return totalAbsorbed;
    }
    
    fireEchoStorm(player) {
        // Get all active enemies as targets
        const targets = this.scene.enemies.children.entries.filter(e => e.active);
        
        if (targets.length === 0) return;
        
        // Show "ECHO STORM" text
        const stormText = this.scene.add.text(player.x, player.y - 80, 'ECHO STORM!', {
            fontFamily: 'monospace',
            fontSize: `${24 + Math.min(this.absorbedEchoes * 2, 24)}px`,
            fontStyle: 'bold',
            fill: '#ff00ff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: stormText,
            y: stormText.y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => stormText.destroy()
        });
        
        // Screen shake based on number of echoes
        this.scene.cameras.main.shake(200 + this.absorbedEchoes * 50, 0.003 + this.absorbedEchoes * 0.001);
        
        // Spawn homing bullets
        const bulletCount = Math.min(this.absorbedEchoes, 20); // Cap at 20 for performance
        
        for (let i = 0; i < bulletCount; i++) {
            this.scene.time.delayedCall(i * 30, () => {
                this.spawnHomingBullet(player, targets);
            });
        }
        
        // Bonus: If we absorbed many echoes, also fire a radial burst
        if (this.absorbedEchoes >= 8) {
            this.scene.time.delayedCall(400, () => {
                this.fireRadialBurst(player);
            });
        }
    }
    
    spawnHomingBullet(player, targets) {
        // Pick random target
        const target = Phaser.Utils.Array.GetRandom(targets);
        
        // Create homing bullet
        const bullet = this.scene.getBulletsGroup().get(player.x, player.y, 'bullet');
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(1);
            bullet.body.enable = true;
            bullet.body.reset(player.x, player.y);
            bullet.setTint(this.HOMING_BULLET_COLOR);
            bullet.setScale(0.8);
            
            // Mark as homing bullet
            bullet.isHoming = true;
            bullet.homingTarget = target;
            bullet.homingLife = 120; // Frames of homing before going straight
            
            // Initial velocity (spread outward)
            const angle = Math.random() * Math.PI * 2;
            bullet.setVelocity(
                Math.cos(angle) * 200,
                Math.sin(angle) * 200
            );
        }
    }
    
    fireRadialBurst(player) {
        const burstCount = 12;
        const burstSpeed = 500;
        
        for (let i = 0; i < burstCount; i++) {
            const angle = (Math.PI * 2 / burstCount) * i;
            
            const bullet = this.scene.getBulletsGroup().get(player.x, player.y, 'bullet');
            
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setDepth(1);
                bullet.body.enable = true;
                bullet.body.reset(player.x, player.y);
                bullet.setTint(0x00ffff); // Cyan for burst
                bullet.setScale(0.6);
                bullet.isHoming = false;
                
                bullet.setVelocity(
                    Math.cos(angle) * burstSpeed,
                    Math.sin(angle) * burstSpeed
                );
                bullet.setRotation(angle);
            }
        }
    }
    
    /**
     * Update homing bullets (call from scene update)
     */
    updateHomingBullets() {
        this.scene.bullets.children.entries.forEach(bullet => {
            if (!bullet.active || !bullet.isHoming) return;
            
            // Check if target still exists
            if (!bullet.homingTarget || !bullet.homingTarget.active) {
                bullet.isHoming = false;
                return;
            }
            
            // Calculate angle to target
            const targetAngle = Phaser.Math.Angle.Between(
                bullet.x, bullet.y,
                bullet.homingTarget.x, bullet.homingTarget.y
            );
            
            // Smoothly turn toward target
            const currentAngle = bullet.body.velocity.angle();
            const newAngle = Phaser.Math.Angle.RotateTo(
                currentAngle,
                targetAngle,
                this.HOMING_TURN_RATE
            );
            
            // Update velocity
            bullet.body.setVelocity(
                Math.cos(newAngle) * this.HOMING_BULLET_SPEED,
                Math.sin(newAngle) * this.HOMING_BULLET_SPEED
            );
            bullet.setRotation(newAngle);
            
            // Decrease homing life
            bullet.homingLife--;
            if (bullet.homingLife <= 0) {
                bullet.isHoming = false;
            }
        });
    }
    
    /**
     * Get empathetic absorb radius from Heartflux Protocol
     * When player shows high tremor (stress), graze radius increases to help
     */
    getEmpatheticAbsorbRadius() {
        const baseRadius = this.ECHO_ABSORB_RADIUS;
        
        // Check if Heartflux is available and player has high tremor
        if (this.scene.heartflux) {
            return this.scene.heartflux.getEmpatheticGrazeRadius(baseRadius);
        }
        
        return baseRadius;
    }
    
    destroy() {
        this.echoTrailPool.forEach(echo => echo.destroy());
        this.echoRing?.destroy();
        this.echoCore?.destroy();
        this.echoCounter?.destroy();
    }
}
