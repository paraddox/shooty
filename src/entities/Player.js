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
        
        // Aim
        const pointer = this.scene.input.activePointer;
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);
        this.setRotation(angle + Math.PI / 2);
        
        // Shooting
        if (pointer.isDown && this.scene.time.now > this.lastFired) {
            this.shoot(angle);
            this.lastFired = this.scene.time.now + this.fireRate;
        }
    }

    shoot(angle) {
        const bullet = this.scene.getBulletsGroup().get(this.x, this.y, 'bullet');
        
        if (bullet) {
            // Reactivate recycled bullet
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(1);
            bullet.body.enable = true;
            bullet.body.reset(this.x, this.y);
            bullet.baseScale = 0.5;
            
            // Slight random spread
            const spread = (Math.random() - 0.5) * this.bulletSpread;
            const finalAngle = angle + spread;
            
            bullet.setVelocity(
                Math.cos(finalAngle) * this.bulletSpeed,
                Math.sin(finalAngle) * this.bulletSpeed
            );
            
            bullet.setRotation(finalAngle);
        }
    }

    takeDamage(amount) {
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
