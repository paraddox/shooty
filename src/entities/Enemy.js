import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, target) {
        super(scene, x, y, 'enemy');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        
        this.target = target;
        this.speed = Phaser.Math.Between(80, 150);
        this.health = 50;
        this.damage = 10;
        
        // Random size variation
        const scale = 0.8 + Math.random() * 0.4;
        this.setScale(scale);
        this.health = Math.floor(this.health * scale);
        
        // Create health bar
        this.createHealthBar(scene);
    }

    createHealthBar(scene) {
        this.healthBarBg = scene.add.rectangle(0, -20, 30, 4, 0x000000);
        this.healthBar = scene.add.rectangle(0, -20, 30, 4, 0xff0000);
        
        scene.events.on('update', () => {
            if (this.active) {
                this.healthBarBg.x = this.x;
                this.healthBarBg.y = this.y - 20 * this.scaleY;
                this.healthBar.x = this.x - (30 - this.health / 50 * 30) / 2;
                this.healthBar.y = this.y - 20 * this.scaleY;
                this.healthBar.width = (this.health / 50) * 30;
            }
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
        
        // Flash white
        this.setTint(0xffffff);
        this.scene.time.delayedCall(50, () => {
            if (this.active) this.clearTint();
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Death effect - particles could go here
        this.healthBarBg.destroy();
        this.healthBar.destroy();
        this.destroy();
    }
}
