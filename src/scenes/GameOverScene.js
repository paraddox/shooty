import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.text(centerX, centerY - 80, 'GAME OVER', {
            fontSize: '64px',
            fontStyle: 'bold',
            fill: '#ff0044'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY, `Final Score: ${data.score || 0}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY + 80, 'Click to Play Again', {
            fontSize: '24px',
            fill: '#00ff88'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.scene.start('MenuScene'));

        this.input.keyboard.on('keydown-SPACE', () => this.scene.start('MenuScene'));
        this.input.keyboard.on('keydown-ENTER', () => this.scene.start('MenuScene'));
    }
}
