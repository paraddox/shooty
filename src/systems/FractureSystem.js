import Phaser from 'phaser';

/**
 * Fracture Protocol - Temporal Momentum System
 * 
 * Build momentum through movement and near-misses. At peak momentum, activate
 * FRACTURE to split your timeline — control yourself while a ghost copy 
 * continues your momentum. Both can shoot. Resolve to collapse timelines.
 * 
 * This transforms defensive dodging into calculated aggression — skilled
 * players intentionally fracture into bullet density for double damage output,
 * then resolve with perfect positioning or calculated hits.
 */

export default class FractureSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Momentum state
        this.momentum = 0;
        this.maxMomentum = 100;
        this.momentumDecay = 15; // Per second
        this.momentumGain = {
            movement: 8,
            nearMiss: 25,
            kill: 15,
            dodge: 12
        };
        
        // Fracture state
        this.isFractured = false;
        this.fractureDuration = 2.5; // Seconds
        this.fractureRemaining = 0;
        this.ghostPlayer = null;
        this.ghostPattern = []; // Movement pattern to replay
        this.ghostIndex = 0;
        
        // Damage tracking during fracture
        this.damageDealtInFracture = 0;
        this.damageTakenInFracture = 0;
        this.killsInFracture = 0;
        
        // Visuals
        this.momentumBar = null;
        this.momentumGlow = null;
        this.fractureRing = null;
        this.ghostTrail = [];
        this.afterImages = [];
        
        // Cooldown
        this.cooldown = 0;
        this.cooldownMax = 1.0;
        
        // Input
        this.shiftKey = null;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
    }
    
    createVisuals() {
        // Momentum bar - positioned below health
        const margin = 30;
        this.momentumBar = this.scene.add.graphics();
        this.momentumBar.setScrollFactor(0);
        this.momentumBar.setDepth(100);
        
        // Fracture ready glow around player
        this.fractureRing = this.scene.add.graphics();
        this.fractureRing.setDepth(49);
        this.fractureRing.setVisible(false);
        
        // Ghost afterimages pool
        for (let i = 0; i < 8; i++) {
            const ghost = this.scene.add.image(0, 0, 'player');
            ghost.setTint(0xffd700);
            ghost.setAlpha(0);
            ghost.setScale(0.9);
            ghost.setDepth(0);
            ghost.setVisible(false);
            this.afterImages.push({
                sprite: ghost,
                life: 0,
                maxLife: 20
            });
        }
    }
    
    setupInput() {
        this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.shiftKey.on('down', () => this.onShiftPressed());
    }
    
    onShiftPressed() {
        if (this.isFractured) {
            // Early resolve
            this.resolveFracture();
        } else if (this.canFracture()) {
            // Activate fracture
            this.activateFracture();
        }
    }
    
    canFracture() {
        return this.momentum >= this.maxMomentum && 
               this.cooldown <= 0 && 
               !this.isFractured &&
               this.scene.player.active;
    }
    
    /**
     * Add momentum from various sources
     */
    addMomentum(amount, source = 'generic') {
        if (this.isFractured) return; // No momentum during fracture
        
        const oldMomentum = this.momentum;
        this.momentum = Math.min(this.momentum + amount, this.maxMomentum);
        
        // Visual feedback when gaining significant momentum
        if (Math.floor(oldMomentum / 25) < Math.floor(this.momentum / 25)) {
            this.pulseMomentumBar();
        }
    }
    
    pulseMomentumBar() {
        // Flash effect when hitting momentum thresholds
        const flash = this.scene.add.rectangle(
            this.momentumBar.x || 30, 
            36, 
            200, 
            4, 
            0x00f0ff
        );
        flash.setScrollFactor(0);
        flash.setAlpha(0.5);
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 200,
            onComplete: () => flash.destroy()
        });
    }
    
    activateFracture() {
        this.isFractured = true;
        this.fractureRemaining = this.fractureDuration;
        this.damageDealtInFracture = 0;
        this.damageTakenInFracture = 0;
        this.killsInFracture = 0;
        this.cooldown = this.cooldownMax;
        
        // Record player state for ghost pattern
        this.recordGhostPattern();
        
        // Create ghost player
        this.createGhostPlayer();
        
        // Visual effects
        this.onFractureStart();
        
        // Show FRACTURE announcement
        this.showFractureText();
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('FRACTURE');
        }
        
        // Harmonic Convergence: fracture activates bass layer
        if (this.scene.harmonicConvergence) {
            this.scene.harmonicConvergence.onFractureActivate();
        }
        
        // Synchronicity Cascade: fracture activation
        if (this.scene.synchronicityCascade) {
            this.scene.synchronicityCascade.onSystemActivate('fracture');
        }
        
        // Saga Engine: record fracture story beat
        if (this.scene.sagaEngine) {
            this.scene.sagaEngine.onSystemActivated('fracture', { 
                ghostPattern: this.ghostPattern 
            });
        }
        
        // Record for Temporal Pedagogy System (learning tracking)
        if (this.scene.temporalPedagogy) {
            this.scene.temporalPedagogy.recordSystemUse('FRACTURE', 2);
        }
    }
    
    recordGhostPattern() {
        // Store the movement pattern that the ghost will follow
        this.ghostPattern = [];
        const player = this.scene.player;
        
        // Record current velocity direction and speed
        const velocity = player.body.velocity;
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
        
        // Ghost will continue the current trajectory
        this.ghostPattern = {
            startX: player.x,
            startY: player.y,
            vx: velocity.x,
            vy: velocity.y,
            rotation: player.rotation
        };
    }
    
    createGhostPlayer() {
        // Ghost is a golden afterimage that moves independently
        this.ghostPlayer = {
            x: this.ghostPattern.startX,
            y: this.ghostPattern.startY,
            vx: this.ghostPattern.vx * 0.8, // Slightly slower
            vy: this.ghostPattern.vy * 0.8,
            rotation: this.ghostPattern.rotation,
            active: true,
            lastFired: 0,
            fireRate: 150 // Slightly faster than player
        };
        
        // Create ghost visual
        this.ghostVisual = this.scene.add.image(
            this.ghostPlayer.x, 
            this.ghostPlayer.y, 
            'player'
        );
        this.ghostVisual.setTint(0xffd700);
        this.ghostVisual.setAlpha(0.8);
        this.ghostVisual.setScale(1.0);
        this.ghostVisual.setDepth(5);
        
        // Pulsing ring around ghost
        this.ghostRing = this.scene.add.graphics();
        this.ghostRing.setDepth(4);
    }
    
    onFractureStart() {
        // Time dilation effect
        this.scene.physics.world.timeScale = 0.85;
        
        // Screen effect
        this.scene.cameras.main.flash(200, 255, 215, 0, 0.3);
        
        // Show fracture ring around real player
        this.fractureRing.setVisible(true);
        
        // Reset momentum
        this.momentum = 0;
        
        // Trail effect
        this.spawnFractureTrails();
    }
    
    spawnFractureTrails() {
        // Spawn afterimages in a burst
        this.afterImages.forEach((img, i) => {
            const angle = (Math.PI * 2 / this.afterImages.length) * i;
            img.sprite.x = this.scene.player.x + Math.cos(angle) * 30;
            img.sprite.y = this.scene.player.y + Math.sin(angle) * 30;
            img.sprite.setAlpha(0.4);
            img.sprite.setVisible(true);
            img.life = img.maxLife;
        });
    }
    
    showFractureText() {
        const text = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 70,
            'FRACTURE PROTOCOL',
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#ffd700'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            scale: 1.3,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Show resolve hint
        this.scene.time.delayedCall(500, () => {
            if (this.isFractured) {
                const hint = this.scene.add.text(
                    this.scene.player.x,
                    this.scene.player.y - 50,
                    '[SHIFT to resolve]',
                    {
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        fill: '#888899'
                    }
                ).setOrigin(0.5);
                
                this.scene.tweens.add({
                    targets: hint,
                    alpha: 0,
                    duration: 1500,
                    onComplete: () => hint.destroy()
                });
            }
        });
    }
    
    update(dt) {
        // Update cooldown
        if (this.cooldown > 0) {
            this.cooldown -= dt;
        }
        
        // Update momentum decay
        if (!this.isFractured && this.momentum > 0) {
            this.momentum = Math.max(0, this.momentum - this.momentumDecay * dt);
        }
        
        // Update visuals
        this.updateMomentumBar();
        
        if (this.isFractured) {
            this.updateFracture(dt);
        }
        
        // Update afterimages
        this.updateAfterImages();
    }
    
    updateMomentumBar() {
        const margin = 30;
        const barY = 36; // Below health bar
        const width = 200;
        const height = 4;
        
        this.momentumBar.clear();
        
        // Background
        this.momentumBar.fillStyle(0x22222a, 1);
        this.momentumBar.fillRect(margin, barY, width, height);
        
        // Fill - changes color as it fills
        const fill = this.momentum / this.maxMomentum;
        const color = fill >= 1 ? 0xffd700 : 0x00f0ff;
        this.momentumBar.fillStyle(color, 1);
        this.momentumBar.fillRect(margin, barY, width * fill, height);
        
        // Glow when full
        if (fill >= 1) {
            this.momentumBar.lineStyle(1, 0xffd700, 0.5 + Math.sin(this.scene.time.now / 100) * 0.3);
            this.momentumBar.strokeRect(margin, barY, width, height);
        }
        
        // Store position for pulse effect
        this.momentumBar.x = margin;
    }
    
    updateFracture(dt) {
        this.fractureRemaining -= dt;
        
        // Update ghost player
        this.updateGhostPlayer(dt);
        
        // Update fracture ring around real player
        this.fractureRing.clear();
        const pulse = 0.3 + Math.sin(this.scene.time.now / 100) * 0.2;
        this.fractureRing.lineStyle(2, 0xffd700, pulse);
        this.fractureRing.strokeCircle(
            this.scene.player.x, 
            this.scene.player.y, 
            40 + Math.sin(this.scene.time.now / 80) * 5
        );
        
        // Update ghost ring
        if (this.ghostRing && this.ghostPlayer.active) {
            this.ghostRing.clear();
            this.ghostRing.lineStyle(2, 0xffd700, 0.4);
            this.ghostRing.strokeCircle(this.ghostPlayer.x, this.ghostPlayer.y, 35);
        }
        
        // Auto-resolve when time runs out
        if (this.fractureRemaining <= 0) {
            this.resolveFracture();
        }
    }
    
    updateGhostPlayer(dt) {
        if (!this.ghostPlayer.active) return;
        
        // Ghost continues on its trajectory with slight homing toward nearest enemy
        let vx = this.ghostPlayer.vx;
        let vy = this.ghostPlayer.vy;
        
        // Find nearest enemy for slight homing
        let nearest = null;
        let nearestDist = 400; // Homing range
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(
                this.ghostPlayer.x, this.ghostPlayer.y,
                enemy.x, enemy.y
            );
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        });
        
        if (nearest) {
            const angle = Phaser.Math.Angle.Between(
                this.ghostPlayer.x, this.ghostPlayer.y,
                nearest.x, nearest.y
            );
            // Slight pull toward enemy (subtle homing)
            vx += Math.cos(angle) * 20 * dt;
            vy += Math.sin(angle) * 20 * dt;
            
            // Update rotation to face movement
            this.ghostPlayer.rotation = angle + Math.PI / 2;
        }
        
        // Apply velocity
        this.ghostPlayer.x += vx * dt;
        this.ghostPlayer.y += vy * dt;
        this.ghostPlayer.vx = vx;
        this.ghostPlayer.vy = vy;
        
        // Update visual
        this.ghostVisual.setPosition(this.ghostPlayer.x, this.ghostPlayer.y);
        this.ghostVisual.setRotation(this.ghostPlayer.rotation);
        
        // Ghost shooting
        if (this.scene.time.now > this.ghostPlayer.lastFired + this.ghostPlayer.fireRate) {
            this.ghostShoot();
            this.ghostPlayer.lastFired = this.scene.time.now;
        }
        
        // Bounce off world bounds
        if (this.ghostPlayer.x < 0 || this.ghostPlayer.x > 1920) {
            this.ghostPlayer.vx *= -1;
            this.ghostPlayer.x = Phaser.Math.Clamp(this.ghostPlayer.x, 0, 1920);
        }
        if (this.ghostPlayer.y < 0 || this.ghostPlayer.y > 1440) {
            this.ghostPlayer.vy *= -1;
            this.ghostPlayer.y = Phaser.Math.Clamp(this.ghostPlayer.y, 0, 1440);
        }
    }
    
    ghostShoot() {
        // Ghost fires at nearest enemy
        let nearest = null;
        let nearestDist = 600;
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(
                this.ghostPlayer.x, this.ghostPlayer.y,
                enemy.x, enemy.y
            );
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        });
        
        if (nearest) {
            const angle = Phaser.Math.Angle.Between(
                this.ghostPlayer.x, this.ghostPlayer.y,
                nearest.x, nearest.y
            );
            
            const bullet = this.scene.getBulletsGroup().get(
                this.ghostPlayer.x, 
                this.ghostPlayer.y, 
                'bullet'
            );
            
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setDepth(1);
                bullet.body.enable = true;
                bullet.body.reset(this.ghostPlayer.x, this.ghostPlayer.y);
                bullet.setTint(0xffd700); // Gold bullets from ghost
                bullet.setScale(0.6);
                bullet.isGhostBullet = true; // Mark as ghost bullet
                
                const bulletSpeed = 550;
                bullet.setVelocity(
                    Math.cos(angle) * bulletSpeed,
                    Math.sin(angle) * bulletSpeed
                );
                bullet.setRotation(angle);
            }
        }
    }
    
    updateAfterImages() {
        this.afterImages.forEach(img => {
            if (img.life > 0) {
                img.life--;
                img.sprite.setAlpha((img.life / img.maxLife) * 0.3);
                
                // Pull toward player
                const angle = Phaser.Math.Angle.Between(
                    img.sprite.x, img.sprite.y,
                    this.scene.player.x, this.scene.player.y
                );
                img.sprite.x += Math.cos(angle) * 2;
                img.sprite.y += Math.sin(angle) * 2;
                
                if (img.life <= 0) {
                    img.sprite.setVisible(false);
                }
            }
        });
    }
    
    resolveFracture() {
        if (!this.isFractured) return;
        
        this.isFractured = false;
        
        // Visual effects
        this.onFractureEnd();
        
        // Calculate bonus
        const bonus = this.calculateBonus();
        
        // Show resolve text
        this.showResolveText(bonus);
        
        // Clean up ghost
        if (this.ghostVisual) {
            // Fade out ghost
            this.scene.tweens.add({
                targets: this.ghostVisual,
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => {
                    this.ghostVisual.destroy();
                    this.ghostVisual = null;
                }
            });
        }
        
        if (this.ghostRing) {
            this.ghostRing.destroy();
            this.ghostRing = null;
        }
        
        this.ghostPlayer = null;
    }
    
    onFractureEnd() {
        // Restore time scale
        this.scene.physics.world.timeScale = 1.0;
        
        // Hide fracture ring
        this.fractureRing.setVisible(false);
        this.fractureRing.clear();
        
        // Screen flash
        this.scene.cameras.main.flash(150, 255, 215, 0, 0.2);
        
        // Screen shake based on performance
        const intensity = 0.002 + this.killsInFracture * 0.001;
        this.scene.cameras.main.shake(200, intensity);
    }
    
    calculateBonus() {
        let bonus = 0;
        
        // Damage dealt bonus
        bonus += this.damageDealtInFracture * 2;
        
        // Kill bonus
        bonus += this.killsInFracture * 100;
        
        // No-hit bonus
        if (this.damageTakenInFracture === 0) {
            bonus += 250; // Perfect fracture bonus
        }
        
        return Math.floor(bonus);
    }
    
    showResolveText(bonus) {
        let text = 'RESOLVED';
        let color = '#00f0ff';
        
        if (this.damageTakenInFracture === 0 && this.killsInFracture > 0) {
            text = 'PERFECT FRACTURE';
            color = '#ffd700';
            // Notify Omni-Weapon of perfect fracture (for split lens mod)
            if (this.scene.omniWeapon) {
                this.scene.omniWeapon.onPerfectFracture();
            }
            // Guaranteed Resonance Orb drop for perfect fractures
            if (this.scene.resonanceOrbs) {
                this.scene.resonanceOrbs.onPerfectFracture(this.scene.player.x, this.scene.player.y);
            }
        } else if (this.killsInFracture >= 3) {
            text = 'MASSACRE';
            color = '#ff3366';
        }
        
        const resolveText = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 70,
            text,
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fontStyle: 'bold',
                fill: color
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: resolveText,
            y: resolveText.y - 40,
            alpha: 0,
            scale: 1.2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => resolveText.destroy()
        });
        
        // Bonus score popup
        if (bonus > 0) {
            this.scene.score += bonus;
            
            const bonusText = this.scene.add.text(
                this.scene.player.x,
                this.scene.player.y - 90,
                `+${bonus}`,
                {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fill: '#ffd700'
                }
            ).setOrigin(0.5);
            
            this.scene.tweens.add({
                targets: bonusText,
                y: bonusText.y - 30,
                alpha: 0,
                duration: 800,
                onComplete: () => bonusText.destroy()
            });
        }
    }
    
    /**
     * Track damage dealt during fracture (called from collision handlers)
     */
    onGhostBulletHitEnemy() {
        if (this.isFractured) {
            this.damageDealtInFracture += 34;
            
            // Notify Resonance Cascade of ghost hit
            if (this.scene.resonanceCascade) {
                this.scene.resonanceCascade.recordActivation('GHOST_HIT');
            }
        }
    }
    
    onEnemyKilledInFracture() {
        if (this.isFractured) {
            this.killsInFracture++;
            
            // Notify Resonance Cascade of kill during fracture
            if (this.scene.resonanceCascade) {
                this.scene.resonanceCascade.recordActivation('KILL');
            }
        }
    }
    
    onPlayerTookDamageInFracture(amount) {
        if (this.isFractured) {
            this.damageTakenInFracture += amount;
        }
    }
    
    /**
     * Check if ghost player is at a position (for collision)
     */
    checkGhostCollision(x, y, radius) {
        if (!this.isFractured || !this.ghostPlayer || !this.ghostPlayer.active) {
            return false;
        }
        
        const dist = Phaser.Math.Distance.Between(
            this.ghostPlayer.x, this.ghostPlayer.y,
            x, y
        );
        
        return dist <= radius + 20; // 20 = ghost radius
    }
    
    /**
     * Ghost takes damage
     */
    damageGhost(amount) {
        if (!this.isFractured || !this.ghostPlayer) return;
        
        // Visual feedback
        this.scene.tweens.add({
            targets: this.ghostVisual,
            alpha: 0.3,
            duration: 50,
            yoyo: true
        });
        
        // Ghost flickers and takes reduced damage tracking
        this.damageTakenInFracture += amount * 0.5; // Ghost damage is halved
        
        // Check if ghost should die
        if (this.damageTakenInFracture > 50) {
            // Ghost dies early, end fracture
            this.resolveFracture();
        }
    }
    
    destroy() {
        this.afterImages.forEach(img => img.sprite.destroy());
        this.momentumBar.destroy();
        this.fractureRing.destroy();
        
        if (this.ghostVisual) this.ghostVisual.destroy();
        if (this.ghostRing) this.ghostRing.destroy();
        
        this.shiftKey.destroy();
    }
}
