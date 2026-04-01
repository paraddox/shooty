import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, target, type = 'enemy') {
        super(scene, x, y, type);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.target = target;
        this.type = type;
        
        // Type-based stats
        switch (type) {
            case 'enemyFast':
                this.speed = Phaser.Math.Between(180, 240);
                this.health = 30;
                this.damage = 15;
                this.scoreValue = 20;
                this.baseScale = 1.0;
                this.setTint(0xffaa44);
                this.fireRate = 2000; // Fast but less frequent shots
                this.bulletSpeed = 400;
                this.shootRange = 250;
                break;
            case 'enemyTank':
                this.speed = Phaser.Math.Between(60, 90);
                this.health = 120;
                this.damage = 25;
                this.scoreValue = 50;
                this.baseScale = 1.3;
                this.setTint(0xcc66ff);
                this.fireRate = 1500; // Slower but steady
                this.bulletSpeed = 300;
                this.shootRange = 350;
                break;
            default: // normal
                this.speed = Phaser.Math.Between(100, 140);
                this.health = 50;
                this.damage = 10;
                this.scoreValue = 10;
                this.baseScale = 1.0;
                this.fireRate = 1800;
                this.bulletSpeed = 350;
                this.shootRange = 300;
        }
        
        this.maxHealth = this.health;
        this.lastFired = 0;
        
        // Apply Recursion Engine behavioral modifiers
        this.applyRecursionModifiers();
        
        // Visuals
        this.setAlpha(0);
        scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
    }
    
    applyRecursionModifiers() {
        if (!this.scene.recursionEngine) return;
        
        const modifiers = this.scene.recursionEngine.getEnemyModifiers(this.type);
        
        // Apply modifiers
        this.speed *= modifiers.speedMult;
        this.fireRate /= modifiers.fireRateMult; // Lower fire rate = faster shooting
        
        // Store behavior profile for update()
        this.behaviorProfile = modifiers;
    }

    update(time) {
        if (!this.active || !this.target.active) return;
        
        // Chase player (with Recursion Engine behavior modification)
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        
        // Apply behavior modifications from Recursion Engine
        if (this.behaviorProfile) {
            this.applyBehavioralMovement(angle, dist, time);
        } else {
            // Default behavior
            this.setVelocity(
                Math.cos(angle) * this.speed,
                Math.sin(angle) * this.speed
            );
            this.setRotation(angle + Math.PI / 2);
        }
        
        // Shoot at player if in range and off cooldown
        if (dist <= this.shootRange && time > this.lastFired + this.fireRate) {
            this.shoot(angle);
            this.lastFired = time;
        }
    }
    
    applyBehavioralMovement(angle, dist, time) {
        const profile = this.behaviorProfile;
        
        // Aggression determines movement style
        if (profile.aggression > 0.7) {
            // High aggression: Relentless chase
            this.setVelocity(
                Math.cos(angle) * this.speed,
                Math.sin(angle) * this.speed
            );
        } else if (profile.aggression < 0.3) {
            // Low aggression: Tactical circling
            const orbitAngle = angle + Math.PI / 3;
            const orbitDist = 200;
            
            if (dist < orbitDist - 50) {
                // Too close, back away
                this.setVelocity(
                    -Math.cos(angle) * this.speed * 0.5,
                    -Math.sin(angle) * this.speed * 0.5
                );
            } else if (dist > orbitDist + 50) {
                // Too far, approach
                this.setVelocity(
                    Math.cos(angle) * this.speed,
                    Math.sin(angle) * this.speed
                );
            } else {
                // In sweet spot, orbit
                this.setVelocity(
                    Math.cos(orbitAngle) * this.speed * 0.7,
                    Math.sin(orbitAngle) * this.speed * 0.7
                );
            }
        } else {
            // Medium aggression: Standard chase
            this.setVelocity(
                Math.cos(angle) * this.speed,
                Math.sin(angle) * this.speed
            );
        }
        
        this.setRotation(angle + Math.PI / 2);
    }
    
    shoot(angle) {
        // Add slight inaccuracy for more interesting bullet patterns
        const inaccuracy = (Math.random() - 0.5) * 0.15;
        const finalAngle = angle + inaccuracy;
        
        // Call the scene's bullet spawning method
        this.scene.spawnEnemyBullet(this.x, this.y, finalAngle, this.bulletSpeed);
    }

    takeDamage(amount) {
        this.health -= amount;
        
        // Flash white on hit
        const originalTint = this.tintTopLeft;
        this.setTint(0xffffff);
        this.scene.time.delayedCall(50, () => {
            if (this.active) this.setTint(originalTint);
        });
        
        // Hit scale pulse
        this.scene.tweens.add({
            targets: this,
            scaleX: this.scaleX * 1.1,
            scaleY: this.scaleY * 1.1,
            duration: 50,
            yoyo: true
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Shrink out
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 150,
            ease: 'Power2',
            onComplete: () => this.destroy()
        });
    }
}
