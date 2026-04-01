import Phaser from 'phaser';

/**
 * Temporal Singularity System - Controllable Time Well
 * 
 * Deploy a temporal singularity (SPACE key when charged) that:
 * - Traps enemy bullets in orbital decay, preventing them from reaching the player
 * - Charges with each trapped bullet (visualized as increasing chaos in the well)
 * - Can be detonated (SPACE again) to fire all trapped bullets as a seeking swarm
 * - Creates extreme risk/reward: holding longer = more trapped bullets = bigger explosion
 * 
 * Synergies:
 * - Bullet Time: Echoes can be redirected INTO the singularity for massive charge
 * - Fracture: Both real and ghost bullets can charge the singularity
 * - Resonance: Detonation counts as a system activation; length affects multiplier
 * - Residue: Nodes fire at enemies distracted by the singularity's pull
 * 
 * Color: Deep crimson (#dc143c) - danger, singularity, the event horizon
 */

export default class TemporalSingularitySystem {
    constructor(scene) {
        this.scene = scene;
        
        // Charge state (0-100)
        this.charge = 0;
        this.maxCharge = 100;
        this.chargeGainPerKill = 15;
        this.chargeGainPerNearMiss = 20;
        this.chargeGainPerEchoAbsorb = 25;
        this.chargeDecay = 8; // Per second when not gaining
        
        // Singularity state
        this.singularityActive = false;
        this.singularityX = 0;
        this.singularityY = 0;
        this.singularityRadius = 60; // Event horizon
        this.singularityGravity = 300; // Pull strength
        this.singularityLife = 0;
        this.maxSingularityLife = 8.0; // Seconds before collapse
        
        // Trapped bullets
        this.trappedBullets = []; // { bullet, orbitAngle, orbitRadius, orbitSpeed }
        this.maxTrappedBullets = 50;
        
        // Visuals
        this.singularityCore = null;
        
        // Input
        this.spaceKey = null;
        this.canDeploy = false;
        
        // Configuration
        this.SINGULARITY_COLOR = 0xdc143c; // Crimson
        this.SINGULARITY_CORE_COLOR = 0xff1744; // Bright red
        this.ORBIT_COLOR = 0xff6b6b; // Light red
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
    }
    
    createVisuals() {
        // Singularity core (glowing orb) - sprite-based
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Radial gradient for singularity
        const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
        gradient.addColorStop(0, 'rgba(255, 23, 68, 1)');      // Bright center
        gradient.addColorStop(0.3, 'rgba(220, 20, 60, 0.8)');   // Crimson
        gradient.addColorStop(0.6, 'rgba(220, 20, 60, 0.4)');   // Fade
        gradient.addColorStop(1, 'rgba(220, 20, 60, 0)');       // Transparent edge
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        
        this.scene.textures.addCanvas('singularityCore', canvas);
        this.singularityCore = this.scene.add.image(0, 0, 'singularityCore');
        this.singularityCore.setDepth(45);
        this.singularityCore.setVisible(false);
    }
    
    setupInput() {
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceKey.on('down', () => this.onSpacePressed());
    }
    
    onSpacePressed() {
        if (this.singularityActive) {
            // Detonate singularity
            this.detonateSingularity();
        } else if (this.canDeploy && this.charge >= this.maxCharge) {
            // Deploy singularity at player position
            this.deploySingularity();
        }
    }
    
    deploySingularity() {
        const player = this.scene.player;
        if (!player.active) return;
        
        this.singularityActive = true;
        this.singularityX = player.x;
        this.singularityY = player.y;
        this.singularityLife = this.maxSingularityLife;
        this.trappedBullets = [];
        
        // Consume all charge
        this.charge = 0;
        this.canDeploy = false;
        
        // Show singularity
        this.singularityCore.setPosition(this.singularityX, this.singularityY);
        this.singularityCore.setVisible(true);
        this.singularityCore.setScale(0);
        
        // Animate in
        this.scene.tweens.add({
            targets: this.singularityCore,
            scale: 1,
            duration: 400,
            ease: 'Back.out'
        });
        
        // Visual announcement
        this.showDeployText();
        
        // Screen shake
        this.scene.cameras.main.shake(200, 0.005);
        
        // Spawn effect
        this.spawnDeployEffect();
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('SINGULARITY_DEPLOY');
        }
        
        // Notify Synchronicity Cascade
        if (this.scene.synchronicityCascade) {
            this.scene.synchronicityCascade.onSystemActivate('singularity');
        }
    }
    
    showDeployText() {
        const text = this.scene.add.text(
            this.singularityX,
            this.singularityY - 80,
            'SINGULARITY',
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#dc143c'
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
        
        // Show detonate hint
        this.scene.time.delayedCall(600, () => {
            if (this.singularityActive) {
                const hint = this.scene.add.text(
                    this.singularityX,
                    this.singularityY - 50,
                    '[SPACE to detonate]',
                    {
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        fill: '#ff6b6b'
                    }
                ).setOrigin(0.5);
                
                this.scene.tweens.add({
                    targets: hint,
                    alpha: 0,
                    duration: 2000,
                    ease: 'Power2',
                    onComplete: () => hint.destroy()
                });
            }
        });
    }
    
    spawnDeployEffect() {
        // Ring explosion - using circle with stroke (sprite-based)
        const ring = this.scene.add.circle(this.singularityX, this.singularityY, 10);
        ring.setStrokeStyle(3, this.SINGULARITY_COLOR, 1);
        ring.setFillStyle(0, 0); // Transparent fill
        ring.setDepth(46);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 8,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
        
        // Particle burst
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 / 16) * i;
            const speed = 100 + Math.random() * 100;
            
            const particle = this.scene.add.circle(
                this.singularityX + Math.cos(angle) * 20,
                this.singularityY + Math.sin(angle) * 20,
                3,
                this.SINGULARITY_COLOR
            );
            particle.setDepth(46);
            
            this.scene.tweens.add({
                targets: particle,
                x: this.singularityX + Math.cos(angle) * speed,
                y: this.singularityY + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    detonateSingularity() {
        if (!this.singularityActive) return;
        
        const trappedCount = this.trappedBullets.length;
        
        // Fire trapped bullets as seeking swarm
        this.fireTrappedBullets();
        
        // Collapse visual
        this.collapseSingularity(trappedCount);
        
        // Reset state
        this.singularityActive = false;
        this.singularityCore.setVisible(false);
        this.trappedBullets = [];
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('SINGULARITY_DETONATE', { 
                bulletsFired: trappedCount 
            });
        }
        
        // Notify Omni-Weapon of singularity detonation (for explosive chamber mod)
        if (this.scene.omniWeapon) {
            this.scene.omniWeapon.onSingularityDetonate(trappedCount);
        }
        
        // Harmonic Convergence: singularity detonation creates crescendo
        if (this.scene.harmonicConvergence) {
            this.scene.harmonicConvergence.onSingularityDetonate(trappedCount);
        }
        
        // Bonus score
        if (trappedCount > 0) {
            const bonus = trappedCount * 25;
            this.scene.score += bonus;
            this.showDetonateBonus(bonus, trappedCount);
        }
    }
    
    fireTrappedBullets() {
        const targets = this.scene.enemies.children.entries.filter(e => e.active);
        
        if (targets.length === 0) {
            // No targets - fire radial burst
            this.fireRadialBurst();
            return;
        }
        
        // Fire each trapped bullet at a target
        this.trappedBullets.forEach((trapped, index) => {
            const target = targets[index % targets.length];
            
            // Reactivate bullet as friendly seeking projectile
            const bullet = trapped.bullet;
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.clearTint();
            bullet.setTint(0xff1744); // Red seeking bullets
            bullet.setScale(0.7);
            bullet.isSeeking = true;
            bullet.seekingTarget = target;
            bullet.seekingLife = 90; // Frames of seeking
            
            // Initial burst velocity outward from singularity
            const angle = trapped.orbitAngle;
            const burstSpeed = 400;
            bullet.body.setVelocity(
                Math.cos(angle) * burstSpeed,
                Math.sin(angle) * burstSpeed
            );
            
            // Enable physics
            bullet.body.enable = true;
        });
        
        // Screen effects
        this.scene.cameras.main.shake(300 + this.trappedBullets.length * 10, 0.006);
        this.scene.cameras.main.flash(100, 220, 20, 60, 0.3);
    }
    
    fireRadialBurst() {
        const count = this.trappedBullets.length;
        const speed = 500;
        
        this.trappedBullets.forEach((trapped, index) => {
            const angle = (Math.PI * 2 / count) * index;
            const bullet = trapped.bullet;
            
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.clearTint();
            bullet.setTint(0xff1744);
            bullet.setScale(0.6);
            bullet.isSeeking = false;
            
            bullet.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            bullet.setRotation(angle);
            bullet.body.enable = true;
        });
    }
    
    collapseSingularity(trappedCount) {
        // Implosion effect - using circle (sprite-based)
        const implosion = this.scene.add.circle(
            this.singularityX, 
            this.singularityY, 
            this.singularityRadius, 
            this.SINGULARITY_COLOR, 
            0.5
        );
        implosion.setDepth(47);
        
        this.scene.tweens.add({
            targets: implosion,
            scale: 0,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => implosion.destroy()
        });
        
        // Text
        const text = trappedCount > 0 ? `SWARM ×${trappedCount}` : 'COLLAPSED';
        const collapseText = this.scene.add.text(
            this.singularityX,
            this.singularityY - 60,
            text,
            {
                fontFamily: 'monospace',
                fontSize: `${18 + Math.min(trappedCount, 20)}px`,
                fontStyle: 'bold',
                fill: trappedCount > 0 ? '#ff1744' : '#888888'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: collapseText,
            y: collapseText.y - 40,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => collapseText.destroy()
        });
        
    }
    
    showDetonateBonus(bonus, count) {
        const text = this.scene.add.text(
            this.singularityX,
            this.singularityY - 80,
            `+${bonus}`,
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#ffd700'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            scale: 1.3,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    /**
     * Add charge from various sources
     */
    addCharge(amount, source = 'generic') {
        if (this.singularityActive) return; // Can't charge while active
        
        const oldCharge = this.charge;
        this.charge = Math.min(this.charge + amount, this.maxCharge);
        
        // Flash when hitting max
        if (oldCharge < this.maxCharge && this.charge >= this.maxCharge) {
            this.onMaxCharge();
        }
    }
    
    onMaxCharge() {
        this.canDeploy = true;
        
        // Flash effect
        const flash = this.scene.add.rectangle(
            30, 44, 200, 4, 0xdc143c
        );
        flash.setScrollFactor(0);
        flash.setAlpha(0.5);
        flash.setDepth(101);
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 300,
            onComplete: () => flash.destroy()
        });
        
        // Show ready text
        const player = this.scene.player;
        const text = this.scene.add.text(player.x, player.y - 70, 'SINGULARITY READY [SPACE]', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#dc143c'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    /**
     * Trap a bullet in the singularity
     */
    trapBullet(bullet) {
        if (!this.singularityActive) return false;
        if (this.trappedBullets.length >= this.maxTrappedBullets) return false;
        
        const dist = Phaser.Math.Distance.Between(
            bullet.x, bullet.y,
            this.singularityX, this.singularityY
        );
        
        if (dist > this.singularityRadius * 1.5) return false;
        
        // Disable bullet physics
        bullet.body.enable = false;
        bullet.setTint(this.ORBIT_COLOR);
        
        // Calculate initial orbit parameters
        const angle = Phaser.Math.Angle.Between(
            this.singularityX, this.singularityY,
            bullet.x, bullet.y
        );
        
        const trapped = {
            bullet: bullet,
            orbitAngle: angle,
            orbitRadius: dist,
            orbitSpeed: 2 + Math.random() * 2, // Random rotation speed
            orbitDirection: Math.random() > 0.5 ? 1 : -1,
            trappedTime: this.scene.time.now
        };
        
        this.trappedBullets.push(trapped);
        
        // Absorption effect
        this.spawnAbsorptionEffect(bullet.x, bullet.y);
        
        return true;
    }
    
    spawnAbsorptionEffect(x, y) {
        // Small flash at absorption point
        const flash = this.scene.add.circle(x, y, 5, this.SINGULARITY_COLOR);
        flash.setDepth(46);
        
        this.scene.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 200,
            onComplete: () => flash.destroy()
        });
    }
    
    update(dt) {
        // Update charge decay
        if (!this.singularityActive && this.charge > 0) {
            this.charge = Math.max(0, this.charge - this.chargeDecay * dt);
            if (this.charge < this.maxCharge) {
                this.canDeploy = false;
            }
        }
        
        // Update charge bar
        this.updateChargeBar();
        
        // Update singularity if active
        if (this.singularityActive) {
            this.updateSingularity(dt);
        }
        
        // Update seeking bullets (from detonation)
        this.updateSeekingBullets();
    }
    
    updateChargeBar() {
        const manager = this.scene.graphicsManager;
        if (!manager) return;
        
        const margin = 30;
        const barY = 44; // Below momentum bar
        const width = 200;
        const height = 4;
        
        // Background
        manager.drawRect('effects', margin, barY, width, height, 0x22222a, 1);
        
        // Fill
        const fill = this.charge / this.maxCharge;
        const color = fill >= 1 ? 0xdc143c : 0xff6b6b;
        manager.drawRect('effects', margin, barY, width * fill, height, color, 1);
        
        // Glow when full - drawn as slightly larger rect with different alpha
        if (fill >= 1) {
            const pulse = 0.5 + Math.sin(this.scene.time.now / 100) * 0.3;
            manager.drawRect('effects', margin - 1, barY - 1, width + 2, height + 2, 0xdc143c, pulse * 0.3);
        }
    }
    
    updateSingularity(dt) {
        // Decrease life
        this.singularityLife -= dt;
        
        // Update visual pulse
        const pulse = 0.8 + Math.sin(this.scene.time.now / 80) * 0.2;
        const scale = 1 + Math.sin(this.scene.time.now / 100) * 0.1;
        this.singularityCore.setScale(scale);
        this.singularityCore.setAlpha(pulse);
        
        // Render singularity visuals via UnifiedGraphicsManager
        if (this.scene.graphicsManager) {
            this.renderSingularityEffects(dt);
        }
        
        // Life warning
        if (this.singularityLife <= 2) {
            this.singularityCore.setTint(0xffaa00); // Yellow warning
        }
        
        // Auto-collapse if life runs out
        if (this.singularityLife <= 0) {
            this.detonateSingularity();
        }
    }
    
    /**
     * Render singularity effects via UnifiedGraphicsManager
     * Uses 'effects' layer for trail visualization
     */
    renderSingularityEffects(dt) {
        const manager = this.scene.graphicsManager;
        
        // Draw singularity ring (stroke circle)
        manager.addCommand('effects', 'circle', {
            x: this.singularityX,
            y: this.singularityY,
            radius: this.singularityRadius,
            color: this.SINGULARITY_COLOR,
            alpha: 0.5,
            filled: false,
            lineWidth: 2
        });
        
        // Draw trapped bullet orbits (trail graphics)
        this.trappedBullets.forEach(trapped => {
            // Update orbit angle
            trapped.orbitAngle += trapped.orbitSpeed * trapped.orbitDirection * dt;
            
            // Calculate position
            const x = this.singularityX + Math.cos(trapped.orbitAngle) * trapped.orbitRadius;
            const y = this.singularityY + Math.sin(trapped.orbitAngle) * trapped.orbitRadius;
            
            // Update bullet position
            trapped.bullet.x = x;
            trapped.bullet.y = y;
            trapped.bullet.setRotation(trapped.orbitAngle + Math.PI / 2);
            
            // Draw orbit trail as a small arc using line segments
            const arcStart = trapped.orbitAngle - 0.5;
            const arcEnd = trapped.orbitAngle + 0.5;
            const segments = 3;
            const radius = trapped.orbitRadius;
            
            for (let i = 0; i < segments; i++) {
                const t1 = arcStart + (arcEnd - arcStart) * (i / segments);
                const t2 = arcStart + (arcEnd - arcStart) * ((i + 1) / segments);
                
                const x1 = this.singularityX + Math.cos(t1) * radius;
                const y1 = this.singularityY + Math.sin(t1) * radius;
                const x2 = this.singularityX + Math.cos(t2) * radius;
                const y2 = this.singularityY + Math.sin(t2) * radius;
                
                manager.drawLine('effects', x1, y1, x2, y2, this.ORBIT_COLOR, 0.2, 1);
            }
        });
    }
    
    updateSeekingBullets() {
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (!bullet.active || !bullet.isSeeking) return;
            
            // Check if target still exists
            if (!bullet.seekingTarget || !bullet.seekingTarget.active) {
                bullet.isSeeking = false;
                return;
            }
            
            // Calculate angle to target
            const targetAngle = Phaser.Math.Angle.Between(
                bullet.x, bullet.y,
                bullet.seekingTarget.x, bullet.seekingTarget.y
            );
            
            // Smoothly turn toward target
            const currentAngle = bullet.body.velocity.angle();
            const newAngle = Phaser.Math.Angle.RotateTo(
                currentAngle,
                targetAngle,
                0.12 // Turn rate
            );
            
            // Update velocity
            const speed = 450;
            bullet.body.setVelocity(
                Math.cos(newAngle) * speed,
                Math.sin(newAngle) * speed
            );
            bullet.setRotation(newAngle);
            
            // Decrease seeking life
            bullet.seekingLife--;
            if (bullet.seekingLife <= 0) {
                bullet.isSeeking = false;
            }
        });
    }
    
    /**
     * Check if singularity should trap a bullet (called from collision)
     */
    checkBulletTrapping(bullet) {
        if (!this.singularityActive) return false;
        
        const dist = Phaser.Math.Distance.Between(
            bullet.x, bullet.y,
            this.singularityX, this.singularityY
        );
        
        // Pull bullets toward singularity
        if (dist <= this.singularityGravity) {
            const angle = Phaser.Math.Angle.Between(
                bullet.x, bullet.y,
                this.singularityX, this.singularityY
            );
            
            // Strong pull toward center
            const pullStrength = (1 - dist / this.singularityGravity) * 400;
            bullet.body.velocity.x += Math.cos(angle) * pullStrength;
            bullet.body.velocity.y += Math.sin(angle) * pullStrength;
            
            // Check if close enough to trap
            if (dist <= this.singularityRadius) {
                return this.trapBullet(bullet);
            }
        }
        
        return false;
    }
    
    destroy() {
        this.singularityCore.destroy();
        this.spaceKey.destroy();
    }
}
