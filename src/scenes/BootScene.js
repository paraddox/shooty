import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create minimalist geometric sprites
        this.createPlayerTexture();
        this.createBulletTexture();
        this.createEnemyTexture();
        this.createFastEnemyTexture();
        this.createTankEnemyTexture();
        this.createFloorTexture();
        this.createParticleTexture();
        this.createGlowTexture();
    }

    create() {
        this.scene.start('MenuScene');
    }

    createPlayerTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Core - cyan triangle
        graphics.fillStyle(0x00f0ff);
        graphics.beginPath();
        graphics.moveTo(20, 0);
        graphics.lineTo(40, 35);
        graphics.lineTo(20, 28);
        graphics.lineTo(0, 35);
        graphics.closePath();
        graphics.fillPath();
        
        // Inner accent
        graphics.fillStyle(0xffffff, 0.6);
        graphics.beginPath();
        graphics.moveTo(20, 5);
        graphics.lineTo(32, 28);
        graphics.lineTo(20, 24);
        graphics.lineTo(8, 28);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.generateTexture('player', 40, 40);
        graphics.destroy();
    }

    createBulletTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Long bright bullet - easy to see in bullet hell
        graphics.fillStyle(0xffff00);
        graphics.fillRect(0, 2, 24, 4);
        
        // Core bright
        graphics.fillStyle(0xffffff);
        graphics.fillRect(2, 3, 12, 2);
        
        graphics.generateTexture('bullet', 24, 8);
        graphics.destroy();
    }

    createEnemyTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Diamond shape - red
        graphics.fillStyle(0xff3366);
        graphics.beginPath();
        graphics.moveTo(20, 0);
        graphics.lineTo(40, 20);
        graphics.lineTo(20, 40);
        graphics.lineTo(0, 20);
        graphics.closePath();
        graphics.fillPath();
        
        // Inner dark
        graphics.fillStyle(0x1a0a10);
        graphics.beginPath();
        graphics.moveTo(20, 8);
        graphics.lineTo(32, 20);
        graphics.lineTo(20, 32);
        graphics.lineTo(8, 20);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.generateTexture('enemy', 40, 40);
        graphics.destroy();
    }

    createFastEnemyTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Triangle - fast scout
        graphics.fillStyle(0xff9933);
        graphics.beginPath();
        graphics.moveTo(18, 0);
        graphics.lineTo(36, 32);
        graphics.lineTo(0, 32);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.generateTexture('enemyFast', 36, 32);
        graphics.destroy();
    }

    createTankEnemyTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Hexagon - tank
        graphics.fillStyle(0xcc33ff);
        graphics.beginPath();
        graphics.moveTo(24, 0);
        graphics.lineTo(48, 14);
        graphics.lineTo(48, 38);
        graphics.lineTo(24, 52);
        graphics.lineTo(0, 38);
        graphics.lineTo(0, 14);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.generateTexture('enemyTank', 48, 52);
        graphics.destroy();
    }

    createFloorTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Dark void with subtle grid
        graphics.fillStyle(0x0d0d12);
        graphics.fillRect(0, 0, 128, 128);
        
        // Subtle grid lines
        graphics.lineStyle(1, 0x1a1a25, 0.5);
        graphics.strokeRect(0, 0, 128, 128);
        graphics.moveTo(64, 0);
        graphics.lineTo(64, 128);
        graphics.moveTo(0, 64);
        graphics.lineTo(128, 64);
        graphics.strokePath();
        
        graphics.generateTexture('floor', 128, 128);
        graphics.destroy();
    }

    createParticleTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }

    createGlowTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Soft glow for effects
        const gradient = graphics.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        graphics.fillStyle(gradient);
        graphics.fillCircle(32, 32, 32);
        
        graphics.generateTexture('glow', 64, 64);
        graphics.destroy();
    }
}
