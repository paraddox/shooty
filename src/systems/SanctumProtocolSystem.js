import Phaser from 'phaser';

/**
 * The Sanctum Protocol — The 49th Dimension: PERSISTENT SPATIAL METAGAME
 * 
 * A sanctuary outside time where players walk through their accumulated legacy.
 * Not a menu. Not a screen. A space.
 * 
 * Core Innovation: The metagame becomes physical. Players embody their history.
 * 
 * Key Features:
 * - Spatial shard collection (walk up to memories, choose which to equip)
 * - The Hall of Echoes (frozen moments from past runs as dioramas)
 * - The Resonance Altar (sacrifice progress for permanent evolution)
 * - The Void Pool (practice dives into bullet patterns)
 * - The Observatory (all runs as a constellation of stars)
 * - Rivals stalk the Sanctum (persistent enemies who remember)
 * 
 * Color: Sanctum Violet (#8b5cf6) — the color of sacred space
 */

export default class SanctumProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.SANCTUM_COLOR = 0x8b5cf6;      // Sacred violet
        this.ECHO_COLOR = 0x00d4ff;         // Frozen cyan echoes  
        this.RIVAL_COLOR = 0xcd7f32;        // Burnished bronze
        this.VOID_COLOR = 0x1a0a2e;         // Deep void
        
        this.isInSanctum = false;
        this.sanctumScene = null;
        
        // Sanctum entities
        this.shardPedestals = [];
        this.echoDioramas = [];
        this.rivalPhantoms = [];
        this.resonanceAltar = null;
        this.voidPool = null;
        this.observatory = null;
        
        // State
        this.playerSanctumPos = { x: 400, y: 300 };
        this.equippedShards = [];
        this.sanctumLevel = 1; // Grows with total lifetime score
        
        this.init();
    }
    
    init() {
        this.loadSanctumState();
        this.setupSanctumAccess();
    }
    
    loadSanctumState() {
        // Load from localStorage
        const saved = localStorage.getItem('shooty_sanctum');
        if (saved) {
            const data = JSON.parse(saved);
            this.sanctumLevel = data.level || 1;
            this.playerSanctumPos = data.pos || { x: 400, y: 300 };
            this.equippedShards = data.equipped || [];
        }
        
        // Calculate sanctum level from total lifetime score
        const lifetimeScore = parseInt(localStorage.getItem('shooty_lifetime_score') || '0');
        this.sanctumLevel = Math.max(1, Math.floor(lifetimeScore / 50000) + 1);
    }
    
    saveSanctumState() {
        const data = {
            level: this.sanctumLevel,
            pos: this.playerSanctumPos,
            equipped: this.equippedShards,
            lastVisit: Date.now()
        };
        localStorage.setItem('shooty_sanctum', JSON.stringify(data));
    }
    
    setupSanctumAccess() {
        // Override game over to offer Sanctum entry
        this.originalGameOver = this.scene.gameOver.bind(this.scene);
        this.scene.gameOver = this.handleGameEnd.bind(this);
        
        // Also intercept wave 5 boss defeat
        this.originalSpawnBoss = this.scene.spawnBoss?.bind(this.scene);
    }
    
    handleGameEnd() {
        // Save the final run state for the Sanctum
        this.captureRunForSanctum();
        
        // Show choice: Enter Sanctum or New Run
        this.showSanctumChoice();
    }
    
    captureRunForSanctum() {
        // Capture key moments from this run
        const runData = {
            score: this.scene.score,
            wave: this.scene.wave,
            timestamp: Date.now(),
            duration: this.scene.time.now / 1000,
            systemsUsed: this.getActiveSystems(),
            nemesisEncounters: this.scene.nemesisGenesis?.encounterCount || 0,
            echoesAbsorbed: this.scene.echoStorm?.totalEchoesAbsorbed || 0,
            nearMisses: this.scene.nearMissState?.totalCount || 0
        };
        
        // Save to hall of echoes
        let hallOfEchoes = JSON.parse(localStorage.getItem('shooty_hall_of_echoes') || '[]');
        hallOfEchoes.unshift(runData);
        if (hallOfEchoes.length > 20) hallOfEchoes = hallOfEchoes.slice(0, 20);
        localStorage.setItem('shooty_hall_of_echoes', JSON.stringify(hallOfEchoes));
        
        // Update lifetime score
        const lifetime = parseInt(localStorage.getItem('shooty_lifetime_score') || '0');
        localStorage.setItem('shooty_lifetime_score', (lifetime + runData.score).toString());
        
        return runData;
    }
    
    getActiveSystems() {
        const systems = [];
        const systemMap = {
            'echoStorm': 'Echo Storm',
            'fractureSystem': 'Fracture Protocol',
            'temporalResidue': 'Temporal Residue',
            'resonanceCascade': 'Resonance Cascade',
            'singularitySystem': 'Temporal Singularity',
            'paradoxEngine': 'Paradox Engine',
            'chronoLoop': 'Chrono-Loop',
            'quantumImmortality': 'Quantum Immortality',
            'causalEntanglement': 'Causal Entanglement',
            'dimensionalCollapse': 'Dimensional Collapse'
        };
        
        for (const [key, name] of Object.entries(systemMap)) {
            if (this.scene[key]) systems.push(name);
        }
        return systems;
    }
    
    showSanctumChoice() {
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;
        
        // Dark overlay
        const overlay = this.scene.add.rectangle(
            centerX, centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x0a0a0f, 0.85
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(1000);
        
        // Title
        const title = this.scene.add.text(centerX, centerY - 100, '◈ THE SANCTUM AWAITS ◈', {
            fontFamily: 'monospace',
            fontSize: '28px',
            fill: '#8b5cf6',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
        
        // Subtitle
        const subtitle = this.scene.add.text(centerX, centerY - 60, 
            `Sanctum Level ${this.sanctumLevel} · ${this.getHallOfEchoes().length} Echoes Preserved`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#a78bfa',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
        
        // Sanctum button
        const sanctumBtn = this.scene.add.container(centerX - 100, centerY + 40);
        const btnBg = this.scene.add.rectangle(0, 0, 160, 50, 0x8b5cf6, 0.3);
        btnBg.setStrokeStyle(2, 0x8b5cf6);
        const btnText = this.scene.add.text(0, 0, 'ENTER\nSANCTUM', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        sanctumBtn.add([btnBg, btnText]);
        sanctumBtn.setScrollFactor(0).setDepth(1001);
        
        // New Run button
        const runBtn = this.scene.add.container(centerX + 100, centerY + 40);
        const runBg = this.scene.add.rectangle(0, 0, 160, 50, 0x00d4ff, 0.2);
        runBg.setStrokeStyle(2, 0x00d4ff);
        const runText = this.scene.add.text(0, 0, 'NEW RUN\nIMMEDIATELY', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#00d4ff',
            align: 'center'
        }).setOrigin(0.5);
        runBtn.add([runBg, runText]);
        runBtn.setScrollFactor(0).setDepth(1001);
        
        // Make interactive
        btnBg.setInteractive({ useHandCursor: true });
        btnBg.on('pointerover', () => btnBg.setFillStyle(0x8b5cf6, 0.5));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0x8b5cf6, 0.3));
        btnBg.on('pointerdown', () => {
            this.cleanupChoice([overlay, title, subtitle, sanctumBtn, runBtn]);
            this.enterSanctum();
        });
        
        runBg.setInteractive({ useHandCursor: true });
        runBg.on('pointerover', () => runBg.setFillStyle(0x00d4ff, 0.4));
        runBg.on('pointerout', () => runBg.setFillStyle(0x00d4ff, 0.2));
        runBg.on('pointerdown', () => {
            this.cleanupChoice([overlay, title, subtitle, sanctumBtn, runBtn]);
            this.originalGameOver();
        });
        
        // Hint text
        const hint = this.scene.add.text(centerX, centerY + 120,
            '[S] to Enter Sanctum  ·  [SPACE] for New Run', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
        
        // Keyboard shortcuts
        this.scene.input.keyboard.once('keydown-S', () => {
            this.cleanupChoice([overlay, title, subtitle, sanctumBtn, runBtn, hint]);
            this.enterSanctum();
        });
        this.scene.input.keyboard.once('keydown-SPACE', () => {
            this.cleanupChoice([overlay, title, subtitle, sanctumBtn, runBtn, hint]);
            this.originalGameOver();
        });
    }
    
    cleanupChoice(elements) {
        elements.forEach(el => el.destroy());
    }
    
    enterSanctum() {
        this.isInSanctum = true;
        this.saveSanctumState();
        
        // Transition to Sanctum scene
        this.scene.scene.pause();
        this.scene.scene.launch('SanctumScene', {
            parentSystem: this,
            sanctumLevel: this.sanctumLevel,
            equippedShards: this.equippedShards,
            playerPos: this.playerSanctumPos
        });
    }
    
    exitSanctum(equippedShards, playerPos) {
        this.isInSanctum = false;
        this.equippedShards = equippedShards;
        this.playerSanctumPos = playerPos;
        this.saveSanctumState();
        
        // Apply any new shard bonuses
        this.applyEquippedShards(equippedShards);
        
        // Resume game scene with fresh run
        this.scene.scene.stop('SanctumScene');
        this.scene.scene.restart();
    }
    
    applyEquippedShards(shards) {
        // Convert equipped shards to in-game bonuses
        const bonuses = {};
        shards.forEach(shard => {
            if (shard.type === 'temporal') {
                bonuses.timeScale = 0.9; // 10% slower time
            } else if (shard.type === 'echo') {
                bonuses.echoAbsorptionRadius = 80; // Larger absorption
            } else if (shard.type === 'quantum') {
                bonuses.extraLives = 1;
            } else if (shard.type === 'void') {
                bonuses.voidCoherenceGain = 2.0;
            }
        });
        this.scene.shardBonuses = bonuses;
    }
    
    getHallOfEchoes() {
        return JSON.parse(localStorage.getItem('shooty_hall_of_echoes') || '[]');
    }
    
    getRivals() {
        // Load from RivalProtocol if exists
        if (this.scene.rivalProtocol) {
            return this.scene.rivalProtocol.getRivalRoster();
        }
        return [];
    }
    
    destroy() {
        this.saveSanctumState();
        if (this.isInSanctum) {
            this.scene.scene.stop('SanctumScene');
        }
    }
}

/**
 * SanctumScene — The actual spatial sanctuary
 * 
 * A separate Phaser scene that runs as overlay during Sanctum mode.
 * Player walks around with WASD, interacts with objects by proximity.
 */

export class SanctumScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SanctumScene' });
    }
    
    init(data) {
        this.parentSystem = data.parentSystem;
        this.sanctumLevel = data.sanctumLevel;
        this.equippedShards = [...data.equippedShards];
        this.playerPos = { ...data.playerPos };
    }
    
    create() {
        // Sanctum dimensions grow with level
        this.worldWidth = 800 + (this.sanctumLevel * 200);
        this.worldHeight = 600 + (this.sanctumLevel * 150);
        
        this.cameras.main.setBackgroundColor('#0d0d14');
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
        
        // Create Sanctum architecture
        this.createFloor();
        this.createAtmosphere();
        
        // Create zones
        this.createHallOfEchoes();
        this.createShardChamber();
        this.createResonanceAltar();
        this.createVoidPool();
        this.createObservatory();
        
        // Player (contemplative avatar - slower, more deliberate)
        this.createPlayer();
        
        // Rivals may appear
        this.createRivalPhantoms();
        
        // UI
        this.createSanctumUI();
        
        // Instructions
        this.showInstructions();
    }
    
    createFloor() {
        // Sanctum floor - sacred geometry pattern
        const graphics = this.add.graphics();
        
        // Base grid
        graphics.lineStyle(1, 0x8b5cf6, 0.2);
        for (let x = 0; x < this.worldWidth; x += 50) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.worldHeight);
        }
        for (let y = 0; y < this.worldHeight; y += 50) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.worldWidth, y);
        }
        graphics.strokePath();
        
        // Sanctum symbol at center
        const cx = this.worldWidth / 2;
        const cy = this.worldHeight / 2;
        
        graphics.lineStyle(2, 0x8b5cf6, 0.5);
        graphics.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = 100;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (i === 0) graphics.moveTo(x, y);
            else graphics.lineTo(x, y);
        }
        graphics.closePath();
        graphics.strokePath();
        
        // Inner circle
        graphics.strokeCircle(cx, cy, 40);
    }
    
    createAtmosphere() {
        // Floating particles
        const particles = this.add.particles(0, 0, 'flare', {
            x: { min: 0, max: this.worldWidth },
            y: { min: 0, max: this.worldHeight },
            scale: { start: 0.1, end: 0.3 },
            alpha: { start: 0.3, end: 0 },
            lifespan: 4000,
            frequency: 200,
            quantity: 1,
            tint: 0x8b5cf6
        });
        
        // Ambient glow at center
        const glow = this.add.pointlight(
            this.worldWidth / 2,
            this.worldHeight / 2,
            0x8b5cf6,
            200,
            0.3
        );
        
        // Slow breathing animation for glow
        this.tweens.add({
            targets: glow,
            intensity: { from: 0.3, to: 0.5 },
            duration: 3000,
            yoyo: true,
            repeat: -1
        });
    }
    
    createHallOfEchoes() {
        // Left side - Hall of Echoes (frozen run dioramas)
        const startX = 100;
        const startY = 100;
        
        const hallOfEchoes = JSON.parse(localStorage.getItem('shooty_hall_of_echoes') || '[]');
        
        hallOfEchoes.slice(0, 5).forEach((echo, index) => {
            const x = startX + (index % 3) * 150;
            const y = startY + Math.floor(index / 3) * 120;
            
            // Echo container
            const container = this.add.container(x, y);
            
            // Frozen moment visual (small diorama)
            const diorama = this.add.rectangle(0, 0, 100, 80, 0x00d4ff, 0.1);
            diorama.setStrokeStyle(1, 0x00d4ff, 0.5);
            
            // Echo score
            const scoreText = this.add.text(0, -25, echo.score.toString(), {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#00d4ff'
            }).setOrigin(0.5);
            
            // Wave indicator
            const waveText = this.add.text(0, -10, `W${echo.wave}`, {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#a78bfa'
            }).setOrigin(0.5);
            
            // Systems count
            const sysText = this.add.text(0, 5, `${echo.systemsUsed?.length || 0} systems`, {
                fontFamily: 'monospace',
                fontSize: '8px',
                fill: '#666666'
            }).setOrigin(0.5);
            
            // Date
            const date = new Date(echo.timestamp).toLocaleDateString();
            const dateText = this.add.text(0, 20, date, {
                fontFamily: 'monospace',
                fontSize: '8px',
                fill: '#444444'
            }).setOrigin(0.5);
            
            container.add([diorama, scoreText, waveText, sysText, dateText]);
            
            // Interactivity
            diorama.setInteractive();
            diorama.on('pointerover', () => {
                diorama.setFillStyle(0x00d4ff, 0.2);
                this.showEchoDetails(echo, x, y);
            });
            diorama.on('pointerout', () => {
                diorama.setFillStyle(0x00d4ff, 0.1);
                this.hideEchoDetails();
            });
            
            this[`echoDiorama_${index}`] = container;
        });
        
        // Label
        this.add.text(startX, startY - 50, '◈ HALL OF ECHOES ◈', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#00d4ff'
        }).setOrigin(0.5);
    }
    
    createShardChamber() {
        // Right side - Shard Chamber (spatial equipment)
        const startX = this.worldWidth - 100;
        const startY = 100;
        
        // Label
        this.add.text(startX, startY - 50, '◈ SHARD CHAMBER ◈', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        // Available shards (hardcoded types for now, could be dynamic)
        const shardTypes = [
            { id: 'temporal', name: 'Temporal Shard', color: 0x00d4ff, desc: 'Time flows 10% slower' },
            { id: 'echo', name: 'Echo Resonator', color: 0xffd700, desc: 'Larger echo absorption' },
            { id: 'quantum', name: 'Quantum Anchor', color: 0xffffff, desc: 'One extra quantum life' },
            { id: 'void', name: 'Void Crystal', color: 0x8b5cf6, desc: 'Double void coherence' },
            { id: 'paradox', name: 'Paradox Lens', color: 0xff00ff, desc: 'Perfect predictions' },
            { id: 'nemesis', name: 'Nemesis Bane', color: 0xcd7f32, desc: 'Rivals spawn weaker' }
        ];
        
        this.shardPedestals = [];
        
        shardTypes.forEach((shard, index) => {
            const x = startX - 80 + (index % 2) * 160;
            const y = startY + Math.floor(index / 2) * 90;
            
            const pedestal = this.createShardPedestal(x, y, shard);
            this.shardPedestals.push(pedestal);
        });
        
        // Equipped indicator
        this.equippedContainer = this.add.container(startX, startY + 300);
        this.updateEquippedDisplay();
    }
    
    createShardPedestal(x, y, shard) {
        const container = this.add.container(x, y);
        
        // Pedestal base
        const base = this.add.rectangle(0, 20, 60, 10, 0x333333);
        base.setStrokeStyle(1, 0x555555);
        
        // Shard visual (glowing crystal)
        const crystal = this.add.polygon(0, -5, [
            [0, -20], [15, -5], [15, 10], [0, 15], [-15, 10], [-15, -5]
        ], shard.color, 0.8);
        crystal.setStrokeStyle(2, shard.color);
        
        // Glow effect
        const glow = this.add.ellipse(0, -5, 40, 40, shard.color, 0.3);
        
        // Animation
        this.tweens.add({
            targets: [crystal, glow],
            y: { from: -5, to: -10 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Label
        const label = this.add.text(0, 40, shard.name, {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        container.add([base, glow, crystal, label]);
        
        // Selection ring (hidden initially)
        const selectRing = this.add.ellipse(0, -5, 50, 50, shard.color, 0);
        selectRing.setStrokeStyle(2, shard.color);
        selectRing.setVisible(false);
        container.add(selectRing);
        container.selectRing = selectRing;
        
        // Interactivity
        const hitArea = this.add.rectangle(0, 0, 70, 70, 0xffffff, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);
        
        hitArea.on('pointerover', () => {
            crystal.setAlpha(1);
            this.showShardTooltip(shard, x, y);
        });
        
        hitArea.on('pointerout', () => {
            crystal.setAlpha(0.8);
            this.hideShardTooltip();
        });
        
        hitArea.on('pointerdown', () => {
            this.toggleShard(shard, container);
        });
        
        // Check if already equipped
        const isEquipped = this.equippedShards.some(s => s.id === shard.id);
        if (isEquipped) {
            selectRing.setVisible(true);
        }
        
        return { container, shard, selectRing };
    }
    
    toggleShard(shard, container) {
        const index = this.equippedShards.findIndex(s => s.id === shard.id);
        
        if (index >= 0) {
            // Unequip
            this.equippedShards.splice(index, 1);
            container.selectRing.setVisible(false);
        } else {
            // Equip (max 3)
            if (this.equippedShards.length >= 3) {
                this.showMessage('Maximum 3 shards equipped');
                return;
            }
            this.equippedShards.push(shard);
            container.selectRing.setVisible(true);
            
            // Visual feedback
            this.cameras.main.shake(100, 0.01);
        }
        
        this.updateEquippedDisplay();
    }
    
    updateEquippedDisplay() {
        this.equippedContainer.removeAll(true);
        
        const bg = this.add.rectangle(0, 0, 200, 40, 0x1a1a25, 0.8);
        bg.setStrokeStyle(1, 0x8b5cf6);
        this.equippedContainer.add(bg);
        
        if (this.equippedShards.length === 0) {
            const text = this.add.text(0, 0, 'No shards equipped', {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#666666'
            }).setOrigin(0.5);
            this.equippedContainer.add(text);
        } else {
            this.equippedShards.forEach((shard, i) => {
                const x = -60 + i * 60;
                const icon = this.add.ellipse(x, 0, 20, 20, shard.color);
                this.equippedContainer.add(icon);
            });
            
            const count = this.add.text(0, 15, 
                `${this.equippedShards.length}/3 EQUIPPED`, {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#8b5cf6'
            }).setOrigin(0.5);
            this.equippedContainer.add(count);
        }
    }
    
    createResonanceAltar() {
        // Bottom center - Resonance Altar (sacrifice for permanent gains)
        const x = this.worldWidth / 2;
        const y = this.worldHeight - 100;
        
        // Altar base
        const base = this.add.ellipse(x, y, 120, 60, 0x333333);
        base.setStrokeStyle(2, 0xff6600);
        
        // Altar flame (animated)
        const flame = this.add.ellipse(x, y - 30, 40, 60, 0xff6600, 0.8);
        
        this.tweens.add({
            targets: flame,
            scaleY: { from: 1, to: 1.3 },
            scaleX: { from: 1, to: 0.9 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Label
        this.add.text(x, y + 40, '◈ RESONANCE ALTAR ◈', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff6600'
        }).setOrigin(0.5);
        
        // Instruction
        this.add.text(x, y + 60, 'Sacrifice echoes for permanent evolution', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#666666'
        }).setOrigin(0.5);
        
        // Interactivity
        base.setInteractive({ useHandCursor: true });
        base.on('pointerover', () => flame.setFillStyle(0xff8844));
        base.on('pointerout', () => flame.setFillStyle(0xff6600));
        base.on('pointerdown', () => this.openAltarMenu());
    }
    
    createVoidPool() {
        // Top center - Void Pool (practice arena)
        const x = this.worldWidth / 2;
        const y = 80;
        
        // Pool (dark void visual)
        const pool = this.add.ellipse(x, y, 100, 60, 0x1a0a2e);
        pool.setStrokeStyle(2, 0x4a148c);
        
        // Animated void swirl
        const swirl = this.add.ellipse(x, y, 80, 50, 0x4a148c, 0.3);
        
        this.tweens.add({
            targets: swirl,
            rotation: { from: 0, to: Math.PI * 2 },
            duration: 10000,
            repeat: -1
        });
        
        // Label
        this.add.text(x, y + 50, '◈ VOID POOL ◈', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#4a148c'
        }).setOrigin(0.5);
        
        this.add.text(x, y + 70, 'Practice dive (bullet patterns)', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#666666'
        }).setOrigin(0.5);
        
        // Interactivity
        pool.setInteractive({ useHandCursor: true });
        pool.on('pointerover', () => swirl.setAlpha(0.5));
        pool.on('pointerout', () => swirl.setAlpha(0.3));
        pool.on('pointerdown', () => this.enterVoidPool());
    }
    
    createObservatory() {
        // Top right - Observatory (constellation of all runs)
        const x = this.worldWidth - 150;
        const y = this.worldHeight - 150;
        
        // Observatory dome
        const dome = this.add.arc(x, y, 60, 180, 360, false, 0x1a1a25);
        dome.setStrokeStyle(2, 0xffffff);
        
        // Starfield (miniature representation of all runs)
        const stars = this.add.container(x, y - 20);
        const hallOfEchoes = JSON.parse(localStorage.getItem('shooty_hall_of_echoes') || '[]');
        
        hallOfEchoes.forEach((echo, i) => {
            const angle = (i / Math.max(hallOfEchoes.length, 1)) * Math.PI;
            const dist = 20 + (echo.score / 10000) * 30;
            const sx = Math.cos(angle) * dist;
            const sy = Math.sin(angle) * dist * 0.5;
            
            const star = this.add.circle(sx, sy, 
                2 + (echo.wave / 10), 
                echo.score > 50000 ? 0xffd700 : 0xffffff,
                0.8
            );
            stars.add(star);
        });
        
        // Label
        this.add.text(x, y + 30, '◈ OBSERVATORY ◈', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Interactivity
        dome.setInteractive({ useHandCursor: true });
        dome.on('pointerdown', () => this.showConstellationView());
    }
    
    createPlayer() {
        // Player avatar (contemplative wanderer)
        this.player = this.add.circle(
            this.playerPos.x, 
            this.playerPos.y, 
            8, 
            0x8b5cf6
        );
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setDrag(500);
        
        // Gentle glow
        const glow = this.add.ellipse(
            this.playerPos.x, 
            this.playerPos.y, 
            30, 30, 
            0x8b5cf6, 
            0.3
        );
        this.player.glow = glow;
        
        // Movement keys
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            exit: 'ESC'
        });
        
        // Particle trail
        this.trail = [];
    }
    
    createRivalPhantoms() {
        // Occasionally, rivals appear as phantoms in the Sanctum
        const rivalCount = Math.min(3, Math.floor(this.sanctumLevel / 2));
        
        for (let i = 0; i < rivalCount; i++) {
            const x = Phaser.Math.Between(100, this.worldWidth - 100);
            const y = Phaser.Math.Between(100, this.worldHeight - 100);
            
            const phantom = this.add.ellipse(x, y, 30, 40, 0xcd7f32, 0.3);
            phantom.setStrokeStyle(1, 0xcd7f32);
            
            // Floating animation
            this.tweens.add({
                targets: phantom,
                y: y - 10,
                duration: 3000 + i * 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Dialogue on proximity
            phantom.setInteractive();
            phantom.on('pointerover', () => {
                this.showRivalDialogue(x, y - 50, i);
            });
        }
    }
    
    showRivalDialogue(x, y, index) {
        const taunts = [
            '"You cannot escape what you\'ve done..."',
            '"I remember every bullet."',
            '"The Sanctum cannot protect you forever."',
            '"We await you in the void."',
            '"Your echoes betray your fear."'
        ];
        
        if (!this.rivalText) {
            this.rivalText = this.add.text(x, y, taunts[index % taunts.length], {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#cd7f32',
                align: 'center'
            }).setOrigin(0.5);
            
            this.time.delayedCall(3000, () => {
                this.rivalText?.destroy();
                this.rivalText = null;
            });
        }
    }
    
    createSanctumUI() {
        // Top bar
        const bar = this.add.rectangle(400, 20, 800, 40, 0x0a0a0f, 0.9);
        bar.setScrollFactor(0);
        
        // Title
        this.add.text(400, 20, `THE SANCTUM · Level ${this.sanctumLevel}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#8b5cf6'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Controls hint
        this.add.text(400, this.cameras.main.height - 20, 
            '[WASD] Walk · [CLICK] Interact · [ESC] Begin New Run', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(0.5).setScrollFactor(0);
    }
    
    showInstructions() {
        const instructions = [
            'Welcome to the Sanctum, wanderer.',
            '',
            'Here, your history takes physical form.',
            'Walk among your echoes. Choose your shards.',
            'Prepare. When you are ready, press [ESC] to begin.',
            '',
            'The void remembers. The void waits.'
        ];
        
        const text = this.add.text(
            this.worldWidth / 2, 
            this.worldHeight / 2 - 100, 
            instructions.join('\n'), {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#a78bfa',
            align: 'center',
            backgroundColor: '#0a0a0f88'
        }).setOrigin(0.5);
        
        // Fade out after delay
        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1000,
            delay: 6000,
            onComplete: () => text.destroy()
        });
    }
    
    update() {
        // Player movement (slower, more contemplative)
        const speed = 150;
        this.player.body.setVelocity(0);
        
        if (this.keys.up.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.keys.down.isDown) {
            this.player.body.setVelocityY(speed);
        }
        
        if (this.keys.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.keys.right.isDown) {
            this.player.body.setVelocityX(speed);
        }
        
        // Update glow position
        this.player.glow.x = this.player.x;
        this.player.glow.y = this.player.y;
        
        // Update trail
        this.updateTrail();
        
        // Save position
        this.playerPos.x = this.player.x;
        this.playerPos.y = this.player.y;
        
        // Exit check
        if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
            this.exitSanctum();
        }
    }
    
    updateTrail() {
        this.trail.push({ x: this.player.x, y: this.player.y, age: 0 });
        
        // Fade old trail points
        this.trail = this.trail.filter(t => {
            t.age += 1;
            return t.age < 20;
        });
    }
    
    showEchoDetails(echo, x, y) {
        if (this.echoTooltip) this.echoTooltip.destroy();
        
        const text = [
            `Score: ${echo.score}`,
            `Wave: ${echo.wave}`,
            `Duration: ${Math.floor(echo.duration)}s`,
            `Systems: ${echo.systemsUsed?.join(', ') || 'None'}`
        ].join('\n');
        
        this.echoTooltip = this.add.text(x + 60, y, text, {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#00d4ff',
            backgroundColor: '#0a0a0f',
            padding: { x: 8, y: 4 }
        });
    }
    
    hideEchoDetails() {
        if (this.echoTooltip) {
            this.echoTooltip.destroy();
            this.echoTooltip = null;
        }
    }
    
    showShardTooltip(shard, x, y) {
        if (this.shardTooltip) this.shardTooltip.destroy();
        
        this.shardTooltip = this.add.text(x, y - 60, shard.desc, {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#ffffff',
            backgroundColor: '#0a0a0f',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
    }
    
    hideShardTooltip() {
        if (this.shardTooltip) {
            this.shardTooltip.destroy();
            this.shardTooltip = null;
        }
    }
    
    showMessage(text) {
        const msg = this.add.text(this.player.x, this.player.y - 30, text, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#ff4444'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: msg,
            y: msg.y - 30,
            alpha: 0,
            duration: 1500,
            onComplete: () => msg.destroy()
        });
    }
    
    openAltarMenu() {
        // Simple altar interaction
        this.showMessage('Resonance Altar: Coming in next update...');
    }
    
    enterVoidPool() {
        this.showMessage('Void Pool practice: Coming in next update...');
    }
    
    showConstellationView() {
        this.showMessage('Constellation view: Coming in next update...');
    }
    
    exitSanctum() {
        // Transition out
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.parentSystem.exitSanctum(this.equippedShards, this.playerPos);
        });
    }
}
