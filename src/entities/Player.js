import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.setDrag(500);
        this.setDamping(true);
        
        // Stats
        this.speed = 250;
        this.health = 100;
        this.maxHealth = 100;
        
        // Shooting
        this.lastFired = 0;
        this.fireRate = 150; // ms between shots
        this.bulletSpeed = 500;
        
        // Knockback recovery
        this.isKnockedBack = false;
        this.knockbackTimer = null;
        
        // Create health bar
        this.createHealthBar(scene);
    }

    createHealthBar(scene) {
        this.healthBarBg = scene.add.rectangle(0, -25, 40, 6, 0x000000);
        this.healthBar = scene.add.rectangle(0, -25, 40, 6, 0x00ff00);
        
        scene.events.on('update', () => {
            if (this.active) {
                this.healthBarBg.x = this.x;
                this.healthBarBg.y = this.y - 25;
                this.healthBar.x = this.x - (40 - this.health / this.maxHealth * 40) / 2;
                this.healthBar.y = this.y - 25;
                this.healthBar.width = (this.health / this.maxHealth) * 40;
                
                // Update color based on health
                if (this.health > 60) this.healthBar.fillColor = 0x00ff00;
                else if (this.health > 30) this.healthBar.fillColor = 0xffff00;
                else this.healthBar.fillColor = 0xff0000;
            }
        });
    }

    update() {
        if (!this.active) return;
        
        const cursors = this.scene.input.keyboard.createCursorKeys();
        const wasd = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Movement (disabled during knockback)
        if (!this.isKnockedBack) {
            let vx = 0;
            let vy = 0;
            
            if (cursors.left.isDown || wasd.left.isDown) vx = -this.speed;
            else if (cursors.right.isDown || wasd.right.isDown) vx = this.speed;
            
            if (cursors.up.isDown || wasd.up.isDown) vy = -this.speed;
            else if (cursors.down.isDown || wasd.down.isDown) vy = this.speed;
            
            // Normalize diagonal movement
            if (vx !== 0 && vy !== 0) {
                vx *= 0.707;
                vy *= 0.707;
            }
            
            this.setVelocity(vx, vy);
        }
        
        // Aim at mouse
        const pointer = this.scene.input.activePointer;
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);
        this.setRotation(angle + Math.PI / 2);
        
        // Shooting
        if (pointer.isDown && this.scene.time.now > this.lastFired) {
            this.shoot(worldPoint.x, worldPoint.y);
            this.lastFired = this.scene.time.now + this.fireRate;
        }
    }

    shoot(targetX, targetY) {
        const bullet = this.scene.getBulletsGroup().get(this.x, this.y, 'bullet');
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(0);
            
            const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
            bullet.setVelocity(
                Math.cos(angle) * this.bulletSpeed,
                Math.sin(angle) * this.bulletSpeed
            );
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        
        // Flash red
        this.setTint(0xff0000);
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
        
        this.knockbackTimer = this.scene.time.delayedCall(200, () => {
            this.isKnockedBack = false;
        });
    }

    die() {
        this.healthBarBg.destroy();
        this.healthBar.destroy();
        this.destroy();
    }
}
