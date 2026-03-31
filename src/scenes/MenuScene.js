import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const cx = w / 2;
        const cy = h / 2;

        // Dark void background
        this.cameras.main.setBackgroundColor('#0a0a0f');

        // Subtle grid effect
        this.createGridEffect();

        // Title - minimalist typography
        const title = this.add.text(cx, cy - 100, 'SHOOTY', {
            fontFamily: 'monospace',
            fontSize: '72px',
            fontStyle: 'bold',
            letterSpacing: 8,
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(cx, cy - 30, 'minimalist roguelike shooter', {
            fontFamily: 'monospace',
            fontSize: '16px',
            letterSpacing: 2,
            fill: '#666677'
        }).setOrigin(0.5);

        // Control hints - clean layout
        const controls = [
            { key: 'WASD', desc: 'move' },
            { key: 'MOUSE', desc: 'aim' },
            { key: 'CLICK', desc: 'shoot' }
        ];

        let y = cy + 40;
        controls.forEach(c => {
            const keyText = this.add.text(cx - 60, y, c.key, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#00f0ff'
            }).setOrigin(1, 0.5);
            
            this.add.text(cx - 40, y, c.desc, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#888899'
            }).setOrigin(0, 0.5);
            
            y += 30;
        });

        // Start prompt with pulse animation
        const startText = this.add.text(cx, cy + 150, '[ CLICK TO START ]', {
            fontFamily: 'monospace',
            fontSize: '18px',
            letterSpacing: 4,
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Pulse animation
        this.tweens.add({
            targets: startText,
            alpha: 0.4,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Input handlers
        this.input.on('pointerdown', () => this.startGame());
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());

        // Ambient grid
        this.createGridEffect();
    }

    createGridEffect() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        
        // Draw subtle grid lines
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

    startGame() {
        this.cameras.main.fade(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
}
