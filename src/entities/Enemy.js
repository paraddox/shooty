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
                break;
            case 'enemyTank':
                this.speed = Phaser.Math.Between(60, 90);
                this.health = 120;
                this.damage = 25;
                this.scoreValue = 50;
                this.baseScale = 1.3;
                this.setTint(0xcc66ff);
                break;
            default: // normal
                this.speed = Phaser.Math.Between(100, 140);
                this.health = 50;
                this.damage = 10;
                this.scoreValue = 10;
                this.baseScale = 1.0;
        }
        
        this.maxHealth = this.health;
        
        // Visuals
        this.setAlpha(0);
        scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
    }

    update() {
        if (!this.active || !this.target.active) return;
        
        // Chase player
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );
        this.setRotation(angle + Math.PI / 2);
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
