import Phaser from 'phaser';
import ControlsManager from '../systems/ControlsManager.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        // Initialize ControlsManager for this scene
        this.controls = new ControlsManager(this);
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

        // Quantum Immortality stats (if available)
        if (data.quantumStats && data.quantumStats.deaths > 0) {
            this.add.text(cx, cy + 55, `TIMELINE BRANCHES  ${data.quantumStats.deaths}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                letterSpacing: 1,
                fill: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(cx, cy + 75, `QUANTUM ECHOES  ${data.quantumStats.echoes}`, {
                fontFamily: 'monospace',
                fontSize: '12px',
                letterSpacing: 1,
                fill: '#ffd700'
            }).setOrigin(0.5);
        }
        
        // New Timeline Shard info
        if (data.newShard) {
            const shardY = data.quantumStats && data.quantumStats.deaths > 0 ? cy + 105 : cy + 55;
            const rarityColor = this.getRarityColor(data.newShard.rarity);
            
            this.add.text(cx, shardY, `◆ ${data.newShard.rarity.toUpperCase()} SHARD CREATED ◆`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fontStyle: 'bold',
                letterSpacing: 2,
                fill: rarityColor
            }).setOrigin(0.5);
            
            this.add.text(cx, shardY + 22, 
                `${data.newShard.playstyle} • ${data.newShard.dominantSystem}`, {
                fontFamily: 'monospace',
                fontSize: '11px',
                letterSpacing: 1,
                fill: '#888899'
            }).setOrigin(0.5);
        }
        
        // Causal Entanglement stats
        if (data.entanglementStats && data.entanglementStats.linksCreated > 0) {
            const entY = data.newShard ? cy + 155 : (data.quantumStats && data.quantumStats.deaths > 0 ? cy + 105 : cy + 55);
            
            this.add.text(cx, entY, `≈ CAUSAL LINKS  ${data.entanglementStats.linksCreated} ≈`, {
                fontFamily: 'monospace',
                fontSize: '12px',
                letterSpacing: 1,
                fill: '#00f0ff'
            }).setOrigin(0.5);
            
            if (data.entanglementStats.damageShared > 0) {
                this.add.text(cx, entY + 18, 
                    `Damage Shared: ${Math.floor(data.entanglementStats.damageShared)}`, {
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    letterSpacing: 1,
                    fill: '#00d4ff'
                }).setOrigin(0.5);
            }
        }

        // Chronicle button
        const chronicleBtn = this.add.text(cx - 100, cy + 100, '[ CHRONICLE ]', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 2,
            fill: '#9d4edd'
        }).setOrigin(0.5).setInteractive();
        
        chronicleBtn.on('pointerdown', () => this.openChronicle());
        chronicleBtn.on('pointerover', () => chronicleBtn.setFill('#ffffff'));
        chronicleBtn.on('pointerout', () => chronicleBtn.setFill('#9d4edd'));

        // Restart prompt
        const restart = this.add.text(cx + 100, cy + 100, '[ RESTART ]', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 2,
            fill: '#00f0ff'
        }).setOrigin(0.5).setInteractive();

        restart.on('pointerdown', () => this.restart());
        restart.on('pointerover', () => restart.setFill('#ffffff'));
        restart.on('pointerout', () => restart.setFill('#00f0ff'));

        // Register with ControlsManager ONLY (no fallbacks)
        this.controls.register('SPACE', 'Restart', () => this.restart(), {
            system: 'GameOverScene',
            description: 'Restart game from game over'
        });
        this.controls.register('ENTER', 'Restart', () => this.restart(), {
            system: 'GameOverScene',
            description: 'Restart game from game over'
        });
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
    
    openChronicle() {
        this.cameras.main.fade(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('ChronicleMenuScene');
        });
    }
    
    getRarityColor(rarity) {
        const colors = {
            common: '#aaaaaa',
            rare: '#00f0ff',
            epic: '#9d4edd',
            legendary: '#ffd700',
            mythic: '#ff0066'
        };
        return colors[rarity] || '#aaaaaa';
    }
}
