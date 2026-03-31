import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // World bounds (roguelike room size)
        this.physics.world.setBounds(0, 0, 1600, 1200);

        // Create floor
        this.createFloor();

        // Player
        this.player = new Player(this, 800, 600);

        // Camera follow
        this.cameras.main.setBounds(0, 0, 1600, 1200);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Bullets group
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 100,
            runChildUpdate: true
        });

        // Enemies group
        this.enemies = this.physics.add.group();

        // Spawn initial enemies
        this.spawnEnemies(5);

        // Enemy spawn timer (increasing difficulty)
        this.spawnTimer = this.time.addEvent({
            delay: 3000,
            callback: () => this.spawnEnemies(2),
            callbackScope: this,
            loop: true
        });

        // Collisions
        this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.collider(this.player, this.enemies, this.playerHit, null, this);
        this.physics.add.collider(this.enemies, this.enemies);

        // Score
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setScrollFactor(0);

        // Wave
        this.wave = 1;
        this.waveText = this.add.text(16, 50, 'Wave: 1', {
            fontSize: '20px',
            fill: '#00ff88'
        }).setScrollFactor(0);

        // Wave timer
        this.time.addEvent({
            delay: 30000,
            callback: () => this.nextWave(),
            callbackScope: this,
            loop: true
        });
    }

    update() {
        this.player.update();

        // Clean up off-screen bullets
        this.bullets.children.entries.forEach(bullet => {
            if (bullet.x < 0 || bullet.x > 1600 || bullet.y < 0 || bullet.y > 1200) {
                this.bullets.killAndHide(bullet);
            }
        });

        // Update enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.update) enemy.update();
        });
    }

    createFloor() {
        const tileSize = 64;
        for (let x = 0; x < 1600; x += tileSize) {
            for (let y = 0; y < 1200; y += tileSize) {
                this.add.image(x + tileSize/2, y + tileSize/2, 'floor')
                    .setAlpha(0.5 + Math.random() * 0.3);
            }
        }
    }

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            let x, y;
            do {
                x = Phaser.Math.Between(100, 1500);
                y = Phaser.Math.Between(100, 1100);
            } while (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 300);

            const enemy = new Enemy(this, x, y, this.player);
            this.enemies.add(enemy);
        }
    }

    hitEnemy(bullet, enemy) {
        bullet.setActive(false);
        bullet.setVisible(false);
        
        enemy.takeDamage(25);
        
        if (!enemy.active) {
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
        }
    }

    playerHit(player, enemy) {
        enemy.takeDamage(50);
        player.takeDamage(10);
        
        // Knockback
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        player.knockback(Math.cos(angle) * 200, Math.sin(angle) * 200);

        if (player.health <= 0) {
            this.scene.start('GameOverScene', { score: this.score });
        }
    }

    nextWave() {
        this.wave++;
        this.waveText.setText('Wave: ' + this.wave);
        
        // Spawn more enemies each wave
        this.spawnEnemies(2 + this.wave * 2);
        
        // Decrease spawn delay slightly
        if (this.spawnTimer.delay > 1000) {
            this.spawnTimer.remove();
            this.spawnTimer = this.time.addEvent({
                delay: Math.max(1000, 3000 - this.wave * 200),
                callback: () => this.spawnEnemies(2 + Math.floor(this.wave / 2)),
                callbackScope: this,
                loop: true
            });
        }
    }

    getBulletsGroup() {
        return this.bullets;
    }
}
