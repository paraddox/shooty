import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Title
        this.add.text(centerX, centerY - 100, 'SHOOTY', {
            fontSize: '64px',
            fontStyle: 'bold',
            fill: '#00ff88'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(centerX, centerY - 30, 'Top-Down Roguelike Shooter', {
            fontSize: '24px',
            fill: '#888888'
        }).setOrigin(0.5);

        // Controls hint
        this.add.text(centerX, centerY + 40, 'WASD to move | Mouse to aim & shoot', {
            fontSize: '18px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);

        // Start prompt
        this.add.text(centerX, centerY + 100, 'Click to Start', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.add.tween({
            targets: this,
            scale: 1.1,
            duration: 100
        }))
        .on('pointerdown', () => this.startGame());

        // Also accept keyboard
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
        this.input.on('pointerdown', () => this.startGame());
    }

    startGame() {
        this.scene.start('GameScene');
    }
}
