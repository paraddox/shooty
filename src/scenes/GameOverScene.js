import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const cx = w / 2;
        const cy = h / 2;

        this.cameras.main.setBackgroundColor('#0a0a0f');
        
        // Grid
        this.createGridEffect();

        // Game Over
        const title = this.add.text(cx, cy - 100, 'GAME OVER', {
            fontFamily: 'monospace',
            fontSize: '48px',
            letterSpacing: 8,
            fill: '#ff3366'
        }).setOrigin(0.5);

        // Stats
        this.add.text(cx, cy - 20, `SCORE  ${(data.score || 0).toString().padStart(6, '0')}`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            letterSpacing: 2,
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(cx, cy + 20, `WAVE   ${data.wave || 1}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            letterSpacing: 2,
            fill: '#666677'
        }).setOrigin(0.5);

        // Restart prompt
        const restart = this.add.text(cx, cy + 100, '[ RESTART ]', {
            fontFamily: 'monospace',
            fontSize: '18px',
            letterSpacing: 4,
            fill: '#00f0ff'
        }).setOrigin(0.5).setInteractive();

        this.tweens.add({
            targets: restart,
            alpha: 0.4,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        restart.on('pointerdown', () => this.restart());
        restart.on('pointerover', () => restart.setFill('#ffffff'));
        restart.on('pointerout', () => restart.setFill('#00f0ff'));

        this.input.keyboard.on('keydown-SPACE', () => this.restart());
        this.input.keyboard.on('keydown-ENTER', () => this.restart());
        this.input.on('pointerdown', () => this.restart());
    }

    createGridEffect() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x1a1a25, 0.3);
        
        const spacing = 64;
        for (let x = 0; x < w; x += spacing) {
            grid.moveTo(x, 0);
            grid.lineTo(x, h);
        }
        for (let y = 0; y < h; y += spacing) {
            grid.moveTo(0, y);
            grid.lineTo(w, y);
        }
        grid.strokePath();
    }

    restart() {
        this.cameras.main.fade(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MenuScene');
        });
    }
}
