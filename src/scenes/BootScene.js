import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create placeholder sprites programmatically
        this.createPlayerTexture();
        this.createBulletTexture();
        this.createEnemyTexture();
        this.createTileTexture();
    }

    create() {
        this.scene.start('MenuScene');
    }

    createPlayerTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Body
        graphics.fillStyle(0x00ff88);
        graphics.fillCircle(16, 16, 12);
        
        // Gun direction indicator
        graphics.fillStyle(0x0044aa);
        graphics.fillRect(16, 10, 14, 12);
        
        graphics.generateTexture('player', 32, 32);
        graphics.destroy();
    }

    createBulletTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xffff00);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('bullet', 8, 8);
        graphics.destroy();
    }

    createEnemyTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xff0044);
        graphics.fillCircle(16, 16, 14);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(10, 12, 4);
        graphics.fillCircle(22, 12, 4);
        graphics.generateTexture('enemy', 32, 32);
        graphics.destroy();
    }

    createTileTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0x2a2a3e);
        graphics.fillRect(0, 0, 64, 64);
        graphics.lineStyle(2, 0x3a3a4e);
        graphics.strokeRect(0, 0, 64, 64);
        graphics.generateTexture('floor', 64, 64);
        graphics.destroy();
    }
}
