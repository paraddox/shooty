import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.setDrag(800);
        this.setDamping(true);
        this.baseScale = 1.0;
        
        // Stats
        this.speed = 280;
        this.health = 100;
        this.maxHealth = 100;
        
        // Shooting
        this.lastFired = 0;
        this.fireRate = 120;
        this.bulletSpeed = 600;
        this.bulletSpread = 0.05;
        
        // Knockback
        this.isKnockedBack = false;
        this.knockbackTimer = null;
        
        // Trail
        this.trailTimer = 0;
    }

    update() {
        if (!this.active) return;
        
        const wasd = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Movement
        if (!this.isKnockedBack) {
            let vx = 0;
            let vy = 0;
            
            if (wasd.left.isDown) vx = -this.speed;
            else if (wasd.right.isDown) vx = this.speed;
            
            if (wasd.up.isDown) vy = -this.speed;
            else if (wasd.down.isDown) vy = this.speed;
            
            // Normalize diagonal
            if (vx !== 0 && vy !== 0) {
                vx *= 0.707;
                vy *= 0.707;
            }
            
            this.setVelocity(vx, vy);
            
            // Movement trail
            if ((vx !== 0 || vy !== 0) && this.scene.time.now > this.trailTimer) {
                this.scene.hitParticles.emitParticleAt(this.x, this.y);
                this.trailTimer = this.scene.time.now + 100;
            }
        }
        
        // Aim - account for camera zoom and scroll
        const pointer = this.scene.input.activePointer;
        const camera = this.scene.cameras.main;
        
        // Safety check: ensure camera is valid
        if (!camera || typeof camera.zoom !== 'number' || camera.zoom <= 0) {
            console.error('[Player] Invalid camera state in update');
            return;
        }
        
        // Convert screen coordinates to world coordinates manually
        // accounting for camera zoom and scroll position
        const worldX = camera.scrollX + pointer.x / camera.zoom;
        const worldY = camera.scrollY + pointer.y / camera.zoom;
        
        // Safety check: ensure world coordinates are valid numbers
        if (typeof worldX !== 'number' || typeof worldY !== 'number' ||
            isNaN(worldX) || isNaN(worldY)) {
            console.error('[Player] Invalid mouse world coordinates:', { worldX, worldY, zoom: camera.zoom });
            return;
        }
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, worldX, worldY);
        this.setRotation(angle + Math.PI / 2);
        
        // Shooting
        if (pointer.isDown && this.scene.time.now > this.lastFired) {
            this.shoot(angle);
            this.lastFired = this.scene.time.now + this.fireRate;
        }
    }

    shoot(angle) {
        // Get weapon stats from omni-weapon system
        const weaponStats = this.scene.omniWeapon ? this.scene.omniWeapon.weaponStats : {
            fireRate: 120, bulletSpeed: 600, spread: 0.05
        };
        
        // Handle SPREAD barrel - multiple shots
        const shotCount = weaponStats.spread > 0.15 ? 3 : 1;
        const spreadAngles = shotCount === 3 ? [-0.15, 0, 0.15] : [0];
        
        spreadAngles.forEach(spreadOffset => {
            const bullet = this.scene.getBulletsGroup().get(this.x, this.y, 'bullet');
            
            if (bullet) {
                // Reactivate recycled bullet
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setDepth(1);
                bullet.body.enable = true;
                bullet.body.reset(this.x, this.y);
                bullet.baseScale = shotCount === 3 ? 0.4 : 0.5;
                
                // Slight random spread + weapon spread + spread barrel
                const randomSpread = (Math.random() - 0.5) * this.bulletSpread;
                const finalAngle = angle + spreadOffset + randomSpread;
                
                bullet.setVelocity(
                    Math.cos(finalAngle) * weaponStats.bulletSpeed,
                    Math.sin(finalAngle) * weaponStats.bulletSpeed
                );
                
                bullet.setRotation(finalAngle);
                
                // Apply omni-weapon effects
                if (this.scene.omniWeapon) {
                    this.scene.omniWeapon.applyBulletEffects(bullet);
                }
                
                // Record in Timeline Chronicle
                if (this.scene.timelineChronicle) {
                    this.scene.timelineChronicle.recordBulletFired(
                        this.x, this.y, finalAngle, weaponStats.bulletSpeed, true
                    );
                }
                
                // Record bullet trail for Apophenia Protocol — The 53rd Dimension
                if (this.scene.apophenia) {
                    this.scene.apophenia.recordBulletTrail(this.x, this.y, finalAngle, weaponStats.bulletSpeed);
                }
                
                // Emit bullet fired event for Dream State Protocol
                this.scene.events.emit('bulletFired', {
                    x: this.x,
                    y: this.y,
                    angle: finalAngle,
                    speed: weaponStats.bulletSpeed,
                    vx: Math.cos(finalAngle) * weaponStats.bulletSpeed,
                    vy: Math.sin(finalAngle) * weaponStats.bulletSpeed,
                    isPlayer: true
                });
            }
        });
        
        // Track for Recursion Engine (shot analysis)
        if (this.scene.recursionEngine) {
            this.scene.recursionEngine.recordShot();
        }
        
        // Audio: bullet fired
        if (this.scene.synaesthesiaProtocol) {
            const weaponType = shotCount === 3 ? 'spread' : weaponStats.fireRate < 100 ? 'rapid' : 'standard';
            this.scene.synaesthesiaProtocol.onGameplayEvent('bulletFired', weaponType);
        }
        
        // Rhythm of the Void: Check for on-beat bonus
        if (this.scene.rhythmOfTheVoid) {
            this.scene.rhythmOfTheVoid.onPlayerFire();
        }
    }

    takeDamage(amount) {
        // Invulnerability check (e.g., after quantum respawn)
        if (this.isInvulnerable) return;
        
        this.health -= amount;
        
        // Flash white
        this.setTint(0xff3366);
        this.scene.time.delayedCall(100, () => {
            if (this.active) this.clearTint();
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }

    knockback(vx, vy) {
        this.isKnockedBack = true;
        this.setVelocity(vx, vy);
        
        if (this.knockbackTimer) this.knockbackTimer.remove();
        
        this.knockbackTimer = this.scene.time.delayedCall(150, () => {
            this.isKnockedBack = false;
        });
    }

    die() {
        // Death explosion
        this.scene.deathParticles.setParticleTint(0x00f0ff);
        this.scene.deathParticles.emitParticleAt(this.x, this.y);
        this.destroy();
    }
}
