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
        // Prevent double-entry
        if (this.isInSanctum) {
            console.warn('[SanctumProtocol] Already in sanctum, ignoring duplicate enter request');
            return;
        }
        
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
            this.isInSanctum = false;
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

        // Register shutdown handler to clean up keyboard input
        this.events.on('shutdown', this.shutdown, this);
    }
    
    createFloor() {
        // Sanctum floor - sacred geometry pattern
        this.floorGraphics = this.add.graphics();
        this.floorGraphics.setDepth(0); // Background layer
        
        // Base grid
        this.floorGraphics.lineStyle(1, 0x8b5cf6, 0.2);
        for (let x = 0; x < this.worldWidth; x += 50) {
            this.floorGraphics.moveTo(x, 0);
            this.floorGraphics.lineTo(x, this.worldHeight);
        }
        for (let y = 0; y < this.worldHeight; y += 50) {
            this.floorGraphics.moveTo(0, y);
            this.floorGraphics.lineTo(this.worldWidth, y);
        }
        this.floorGraphics.strokePath();
        
        // Sanctum symbol at center
        const cx = this.worldWidth / 2;
        const cy = this.worldHeight / 2;
        
        this.floorGraphics.lineStyle(2, 0x8b5cf6, 0.5);
        this.floorGraphics.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = 100;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (i === 0) this.floorGraphics.moveTo(x, y);
            else this.floorGraphics.lineTo(x, y);
        }
        this.floorGraphics.closePath();
        this.floorGraphics.strokePath();
        
        // Inner circle
        this.floorGraphics.strokeCircle(cx, cy, 40);
    }
    
    createAtmosphere() {
        // Floating particles
        this.atmosphereParticles = this.add.particles(0, 0, 'flare', {
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
        this.atmosphereGlow = this.add.pointlight(
            this.worldWidth / 2,
            this.worldHeight / 2,
            0x8b5cf6,
            200,
            0.3
        );
        
        // Slow breathing animation for glow
        this.atmosphereTween = this.tweens.add({
            targets: this.atmosphereGlow,
            intensity: { from: 0.3, to: 0.5 },
            duration: 3000,
            yoyo: true,
            repeat: -1
        });
    }
    
    createHallOfEchoes() {
        // Left side - Hall of Echoes (frozen run dioramas) - positioned upper-left
        const startX = 100;
        const startY = 150;
        
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
            container.setDepth(20); // World objects at depth 20
            
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
        
        // Label - UI layer
        this.add.text(startX, startY - 60, '◈ HALL OF ECHOES ◈', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#00d4ff'
        }).setOrigin(0.5).setDepth(101);
    }
    
    createShardChamber() {
        // Right side - Shard Chamber (spatial equipment) - positioned upper-right
        const startX = this.worldWidth - 100;
        const startY = 120;
        
        // Label - UI layer
        this.add.text(startX, startY - 50, '◈ SHARD CHAMBER ◈', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffd700'
        }).setOrigin(0.5).setDepth(101);
        
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
        this.equippedContainer.setDepth(20);
        this.updateEquippedDisplay();
    }
    
    createShardPedestal(x, y, shard) {
        const container = this.add.container(x, y);
        container.setDepth(20); // World objects at depth 20
        
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
        base.setDepth(20);
        
        // Altar flame (animated)
        const flame = this.add.ellipse(x, y - 30, 40, 60, 0xff6600, 0.8);
        flame.setDepth(21);
        
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
        }).setOrigin(0.5).setDepth(101);
        
        // Instruction
        this.add.text(x, y + 60, 'Sacrifice echoes for permanent evolution', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#666666'
        }).setOrigin(0.5).setDepth(101);
        
        // Interactivity
        base.setInteractive({ useHandCursor: true });
        base.on('pointerover', () => flame.setFillStyle(0xff8844));
        base.on('pointerout', () => flame.setFillStyle(0xff6600));
        base.on('pointerdown', () => this.openAltarMenu());
    }
    
    createVoidPool() {
        // Center area - Void Pool (practice arena) - positioned mid-center, away from top
        const x = this.worldWidth / 2;
        const y = 200;
        
        // Pool (dark void visual)
        const pool = this.add.ellipse(x, y, 100, 60, 0x1a0a2e);
        pool.setStrokeStyle(2, 0x4a148c);
        pool.setDepth(20);
        
        // Animated void swirl
        const swirl = this.add.ellipse(x, y, 80, 50, 0x4a148c, 0.3);
        swirl.setDepth(21);
        
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
        }).setOrigin(0.5).setDepth(101);
        
        this.add.text(x, y + 70, 'Practice dive (bullet patterns)', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#666666'
        }).setOrigin(0.5).setDepth(101);
        
        // Interactivity
        pool.setInteractive({ useHandCursor: true });
        pool.on('pointerover', () => swirl.setAlpha(0.5));
        pool.on('pointerout', () => swirl.setAlpha(0.3));
        pool.on('pointerdown', () => this.enterVoidPool());
    }
    
    createObservatory() {
        // Bottom right - Observatory (constellation of all runs) - well separated from Shard Chamber
        const x = this.worldWidth - 150;
        const y = this.worldHeight - 120;
        
        // Observatory dome
        const dome = this.add.arc(x, y, 60, 180, 360, false, 0x1a1a25);
        dome.setStrokeStyle(2, 0xffffff);
        dome.setDepth(20);
        
        // Starfield (miniature representation of all runs)
        const stars = this.add.container(x, y - 20);
        stars.setDepth(21);
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
        }).setOrigin(0.5).setDepth(101);
        
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
        this.player.setDepth(50); // Player renders above world objects
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
        glow.setDepth(49); // Glow renders below player
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
        // Top bar - highest depth for UI
        const bar = this.add.rectangle(400, 20, 800, 40, 0x0a0a0f, 0.9);
        bar.setScrollFactor(0).setDepth(100);
        
        // Title
        this.add.text(400, 20, `THE SANCTUM · Level ${this.sanctumLevel}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#8b5cf6'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        // Controls hint
        this.add.text(400, this.cameras.main.height - 20, 
            '[WASD] Walk · [CLICK] Interact · [ESC] Begin New Run', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
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
        
        // Position instructions at bottom center, above the Resonance Altar
        const text = this.add.text(
            this.worldWidth / 2, 
            this.worldHeight - 200, 
            instructions.join('\n'), {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#a78bfa',
            align: 'center',
            backgroundColor: '#0a0a0f88'
        }).setOrigin(0.5).setDepth(102);
        
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
        // Handle Altar menu mode
        if (this.isAltarOpen) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
                this.closeAltarMenu();
            }
            return;
        }
        
        // Handle Void Pool mode separately
        if (this.isInVoidPool) {
            this.updateVoidPoolMode();
            return;
        }
        
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
    
    /**
     * Update loop for Void Pool practice mode.
     */
    updateVoidPoolMode() {
        // Player movement
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
        
        // Keep player within safe zone bounds
        const boundsX = this.worldWidth / 2;
        const boundsY = 150;
        const boundsRadiusX = 140;
        const boundsRadiusY = 70;
        
        const dx = this.player.x - boundsX;
        const dy = this.player.y - boundsY;
        
        // Simple ellipse boundary check
        if ((dx * dx) / (boundsRadiusX * boundsRadiusX) + (dy * dy) / (boundsRadiusY * boundsRadiusY) > 1) {
            // Push player back toward center
            const angle = Math.atan2(dy, dx);
            this.player.x = boundsX + Math.cos(angle) * boundsRadiusX * 0.9;
            this.player.y = boundsY + Math.sin(angle) * boundsRadiusY * 0.9;
        }
        
        // Update glow position
        this.player.glow.x = this.player.x;
        this.player.glow.y = this.player.y;
        
        // Update stats display
        this.updateVoidPoolStats();
        
        // Check for exit
        if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
            this.exitVoidPool();
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
        this.showResonanceAltarMenu();
    }
    
    /**
     * Show the Resonance Altar menu.
     * Allows sacrificing shards for permanent character evolution.
     */
    showResonanceAltarMenu() {
        // Prevent opening if already open
        if (this.isAltarOpen) {
            return;
        }
        this.isAltarOpen = true;
        
        // Load all available shards (equipped + stored chronicle shards)
        const availableShards = this.getAvailableShardsForSacrifice();
        
        if (availableShards.length === 0) {
            this.showMessage('No echoes available for sacrifice.\nComplete runs to collect echoes.');
            this.isAltarOpen = false;
            return;
        }
        
        // Load current permanent bonuses
        this.permanentUpgrades = this.loadPermanentUpgrades();
        
        // Create menu overlay
        this.createAltarMenuOverlay(availableShards);
    }
    
    /**
     * Get all available shards that can be sacrificed.
     * Combines equipped shards and chronicle shards.
     */
    getAvailableShardsForSacrifice() {
        const shards = [];
        
        // Add equipped shards
        this.equippedShards.forEach((shard, index) => {
            shards.push({
                ...shard,
                source: 'equipped',
                sourceIndex: index
            });
        });
        
        // Load chronicle shards
        const chronicle = this.loadChronicleData();
        if (chronicle.shards) {
            chronicle.shards.forEach((shard, index) => {
                // Only add if not already equipped
                const isEquipped = this.equippedShards.some(s => s.id === shard.id);
                if (!isEquipped) {
                    shards.push({
                        ...shard,
                        source: 'chronicle',
                        sourceIndex: index
                    });
                }
            });
        }
        
        return shards;
    }
    
    /**
     * Load permanent upgrade data from storage.
     */
    loadPermanentUpgrades() {
        try {
            const saved = localStorage.getItem('shooty_permanent_upgrades_v1');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('[Sanctum] Failed to load upgrades:', e);
        }
        
        return {
            version: 1,
            maxHealthBonus: 0,
            movementSpeedBonus: 0,
            fireRateBonus: 0,
            scoreMultiplier: 0,
            echoAbsorptionBonus: 0,
            predictionBonus: 0,
            totalShardsSacrificed: 0
        };
    }
    
    /**
     * Save permanent upgrade data to storage.
     */
    savePermanentUpgrades(upgrades) {
        try {
            localStorage.setItem('shooty_permanent_upgrades_v1', JSON.stringify(upgrades));
        } catch (e) {
            console.warn('[Sanctum] Failed to save upgrades:', e);
        }
    }
    
    /**
     * Create the altar menu overlay.
     */
    createAltarMenuOverlay(shards) {
        // Dark overlay
        this.altarOverlay = this.add.rectangle(
            this.worldWidth / 2, this.worldHeight / 2,
            this.worldWidth, this.worldHeight,
            0x000000, 0.9
        );
        this.altarOverlay.setScrollFactor(0);
        this.altarOverlay.setDepth(100);
        
        // Title
        this.altarTitle = this.add.text(this.worldWidth / 2, 50, '◈ RESONANCE ALTAR ◈', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: '#ff6600',
            letterSpacing: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        // Subtitle
        this.altarSubtitle = this.add.text(this.worldWidth / 2, 85, 
            'Sacrifice echoes to gain permanent evolution', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#888888'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        // Current bonuses display
        this.createUpgradesDisplay();
        
        // Shard list
        this.createShardList(shards);
        
        // Close instruction
        this.altarCloseText = this.add.text(this.worldWidth / 2, this.worldHeight - 40,
            '[CLICK] Select echo to sacrifice  ·  [ESC] Close', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    }
    
    /**
     * Create display of current permanent upgrades.
     */
    createUpgradesDisplay() {
        const u = this.permanentUpgrades;
        const upgrades = [
            { label: 'Max Health', value: u.maxHealthBonus, suffix: '', color: '#ff4444' },
            { label: 'Movement', value: u.movementSpeedBonus, suffix: '%', color: '#00d4ff' },
            { label: 'Fire Rate', value: u.fireRateBonus, suffix: '%', color: '#ffd700' },
            { label: 'Score', value: u.scoreMultiplier, suffix: '%', color: '#9d4edd' },
            { label: 'Echo Range', value: u.echoAbsorptionBonus, suffix: '%', color: '#00ff00' },
            { label: 'Prediction', value: u.predictionBonus, suffix: 's', color: '#ff6600' }
        ].filter(u => u.value > 0);
        
        const startY = 115;
        
        if (upgrades.length === 0) {
            this.altarUpgradesText = this.add.text(this.worldWidth / 2, startY,
                'No permanent evolution yet. Sacrifice echoes to grow.', {
                fontFamily: 'monospace',
                fontSize: '11px',
                fill: '#555555'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        } else {
            this.altarUpgradesText = this.add.text(this.worldWidth / 2, startY,
                'CURRENT EVOLUTION:\n' + upgrades.map(u => 
                    `${u.label}: +${u.value}${u.suffix}`
                ).join('  ·  '), {
                fontFamily: 'monospace',
                fontSize: '11px',
                fill: '#a78bfa',
                align: 'center'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        }
    }
    
    /**
     * Create the interactive shard list.
     */
    createShardList(shards) {
        this.altarShardItems = [];
        
        const startY = 160;
        const itemHeight = 55;
        const itemsPerRow = 3;
        const itemWidth = 220;
        const startX = (this.worldWidth - (itemsPerRow * itemWidth)) / 2 + itemWidth / 2;
        
        shards.forEach((shard, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            const x = startX + col * itemWidth;
            const y = startY + row * itemHeight;
            
            // Item background
            const bg = this.add.rectangle(x, y, itemWidth - 10, itemHeight - 5, 0x1a1a25, 0.8);
            bg.setStrokeStyle(1, 0x333333);
            bg.setScrollFactor(0);
            bg.setDepth(101);
            bg.setInteractive({ useHandCursor: true });
            
            // Shard color indicator
            const rarityColors = {
                mythic: 0xffd700,
                legendary: 0xff6600,
                epic: 0x9d4edd,
                rare: 0x00d4ff,
                common: 0xaaaaaa
            };
            const color = rarityColors[shard.rarity] || 0xffffff;
            
            const indicator = this.add.ellipse(x - 90, y, 12, 12, color);
            indicator.setScrollFactor(0);
            indicator.setDepth(102);
            
            // Shard name
            const name = this.add.text(x - 75, y - 12, shard.name || 'Unknown Echo', {
                fontFamily: 'monospace',
                fontSize: '11px',
                fill: '#ffffff'
            }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(102);
            
            // Shard details
            const details = this.add.text(x - 75, y + 8, [
                shard.rarity?.toUpperCase() || 'COMMON',
                shard.source === 'equipped' ? ' [EQUIPPED]' : ''
            ].join(''), {
                fontFamily: 'monospace',
                fontSize: '9px',
                fill: '#888888'
            }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(102);
            
            // Bonuses preview
            const bonuses = shard.bonuses || [];
            const bonusText = bonuses.slice(0, 2).map(b => b.name).join(', ') || 'Unknown bonus';
            const bonusLabel = this.add.text(x + 95, y, bonusText, {
                fontFamily: 'monospace',
                fontSize: '9px',
                fill: '#4ade80',
                align: 'right'
            }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(102);
            
            // Hover effects
            bg.on('pointerover', () => {
                bg.setFillStyle(0x2a2a35, 0.9);
                bg.setStrokeStyle(2, color);
            });
            
            bg.on('pointerout', () => {
                bg.setFillStyle(0x1a1a25, 0.8);
                bg.setStrokeStyle(1, 0x333333);
            });
            
            // Click to sacrifice
            bg.on('pointerdown', () => {
                this.sacrificeShard(shard, index);
            });
            
            this.altarShardItems.push({ bg, indicator, name, details, bonusLabel });
        });
        
        // Store shards for reference
        this.altarShards = shards;
    }
    
    /**
     * Sacrifice a shard and grant permanent bonuses.
     */
    sacrificeShard(shard, index) {
        // Calculate bonuses based on shard rarity and bonuses
        const rarityMultiplier = {
            mythic: 3,
            legendary: 2.5,
            epic: 2,
            rare: 1.5,
            common: 1
        }[shard.rarity] || 1;
        
        // Apply bonuses from the shard's bonus types
        let bonusApplied = [];
        
        if (shard.bonuses) {
            shard.bonuses.forEach(bonus => {
                const value = Math.ceil(bonus.value * rarityMultiplier);
                
                switch (bonus.type) {
                    case 'health':
                    case 'defense':
                        this.permanentUpgrades.maxHealthBonus += value;
                        bonusApplied.push(`+${value} Max Health`);
                        break;
                    case 'movement':
                        this.permanentUpgrades.movementSpeedBonus += value;
                        bonusApplied.push(`+${value}% Movement`);
                        break;
                    case 'combat':
                    case 'fireRate':
                        this.permanentUpgrades.fireRateBonus += value;
                        bonusApplied.push(`+${value}% Fire Rate`);
                        break;
                    case 'general':
                        this.permanentUpgrades.scoreMultiplier += value;
                        bonusApplied.push(`+${value}% Score`);
                        break;
                    case 'echoStorm':
                        this.permanentUpgrades.echoAbsorptionBonus += value * 10;
                        bonusApplied.push(`+${value * 10}% Echo Range`);
                        break;
                    case 'paradox':
                        this.permanentUpgrades.predictionBonus += value;
                        bonusApplied.push(`+${value}s Prediction`);
                        break;
                    default:
                        // Default to score multiplier
                        this.permanentUpgrades.scoreMultiplier += Math.ceil(value / 2);
                        bonusApplied.push(`+${Math.ceil(value / 2)}% Score`);
                }
            });
        }
        
        // Base bonus from rarity if no specific bonuses
        if (bonusApplied.length === 0) {
            const baseValue = Math.ceil(5 * rarityMultiplier);
            this.permanentUpgrades.maxHealthBonus += baseValue;
            bonusApplied.push(`+${baseValue} Max Health`);
        }
        
        this.permanentUpgrades.totalShardsSacrificed++;
        
        // Save upgrades
        this.savePermanentUpgrades(this.permanentUpgrades);
        
        // Remove shard from source
        this.removeShardFromSource(shard);
        
        // Visual feedback
        this.showSacrificeFeedback(bonusApplied);
        
        // Refresh menu
        this.closeAltarMenu();
        this.altarRefreshTimer = this.time.delayedCall(500, () => {
            this.altarRefreshTimer = null;
            // Guard: Only reopen if still in Sanctum and not shutting down
            if (this.scene.isActive() && !this.isAltarOpen) {
                this.showResonanceAltarMenu();
            }
        });
    }
    
    /**
     * Remove a sacrificed shard from its source (equipped or chronicle).
     */
    removeShardFromSource(shard) {
        if (shard.source === 'equipped') {
            // Remove from equipped
            const idx = this.equippedShards.findIndex(s => s.id === shard.id);
            if (idx >= 0) {
                this.equippedShards.splice(idx, 1);
            }
            // Update equipped display
            this.updateEquippedDisplay();
        } else if (shard.source === 'chronicle') {
            // Remove from chronicle storage
            const chronicle = this.loadChronicleData();
            chronicle.shards = chronicle.shards.filter(s => s.id !== shard.id);
            
            // Also update equipped list if it was there
            chronicle.equippedShards = chronicle.equippedShards.filter(id => id !== shard.id);
            
            // Save updated chronicle
            try {
                localStorage.setItem('shooty_chronicle_v1', JSON.stringify(chronicle));
            } catch (e) {
                console.warn('[Sanctum] Failed to update chronicle:', e);
            }
        }
    }
    
    /**
     * Show visual feedback after sacrificing a shard.
     */
    showSacrificeFeedback(bonuses) {
        // Flash effect
        this.cameras.main.flash(300, 255, 100, 0);
        
        // Message
        const text = bonuses.join('\n');
        const msg = this.add.text(this.worldWidth / 2, this.worldHeight / 2, [
            'ECHO SACRIFICED',
            '',
            text,
            '',
            'Evolution complete.'
        ].join('\n'), {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff6600',
            align: 'center',
            backgroundColor: '#0a0a0f',
            padding: { x: 20, y: 15 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
        
        // Animate
        this.tweens.add({
            targets: msg,
            alpha: 0,
            duration: 2000,
            delay: 2000,
            onComplete: () => msg.destroy()
        });
    }
    
    /**
     * Close the altar menu.
     */
    closeAltarMenu() {
        this.isAltarOpen = false;
        
        // Cancel any pending refresh timer
        if (this.altarRefreshTimer) {
            this.altarRefreshTimer.remove();
            this.altarRefreshTimer = null;
        }
        
        // Destroy all menu elements
        this.altarOverlay?.destroy();
        this.altarTitle?.destroy();
        this.altarSubtitle?.destroy();
        this.altarUpgradesText?.destroy();
        this.altarCloseText?.destroy();
        
        // Destroy shard items
        if (this.altarShardItems) {
            this.altarShardItems.forEach(item => {
                item.bg?.destroy();
                item.indicator?.destroy();
                item.name?.destroy();
                item.details?.destroy();
                item.bonusLabel?.destroy();
            });
            this.altarShardItems = null;
        }
        
        // Clean up references
        this.altarOverlay = null;
        this.altarTitle = null;
        this.altarSubtitle = null;
        this.altarUpgradesText = null;
        this.altarCloseText = null;
        this.altarShards = null;
        this.permanentUpgrades = null;
    }
    
    enterVoidPool() {
        this.startVoidPoolPractice();
    }
    
    /**
     * Start the Void Pool practice mode.
     * Creates a safe arena where players can practice dodging bullet patterns.
     */
    startVoidPoolPractice() {
        // Prevent entering if already in void pool
        if (this.isInVoidPool) {
            return;
        }
        this.isInVoidPool = true;
        
        // Save player position for return
        this.savedPlayerPos = { x: this.player.x, y: this.player.y };
        
        // Move player to void pool center
        this.player.setPosition(this.worldWidth / 2, 80);
        this.player.body.setVelocity(0, 0);
        
        // Create void pool overlay
        this.createVoidPoolOverlay();
        
        // Initialize practice session
        this.voidPoolStartTime = this.time.now;
        this.voidPoolScore = 0;
        this.voidPoolGrazes = 0;
        
        // Create safe bullets group (no damage)
        this.createSafeBulletPool();
        
        // Start spawning patterns
        this.startBulletPatterns();
        
        // Show instructions
        this.showVoidPoolInstructions();
    }
    
    /**
     * Create the visual overlay for the void pool practice mode.
     */
    createVoidPoolOverlay() {
        // Full-screen dark overlay to hide underlying Sanctum elements
        // Must be above all UI elements (depth 101+) to properly hide them
        this.voidPoolWorldOverlay = this.add.rectangle(
            this.worldWidth / 2, this.worldHeight / 2,
            this.worldWidth, this.worldHeight,
            0x0d0d14, 1.0
        );
        this.voidPoolWorldOverlay.setScrollFactor(0);
        this.voidPoolWorldOverlay.setDepth(150); // Above all UI elements
        
        // Practice area backdrop (on top of world overlay)
        this.voidPoolOverlay = this.add.rectangle(
            this.worldWidth / 2, this.worldHeight / 2,
            this.worldWidth, this.worldHeight,
            0x1a0a2e, 0.3
        );
        this.voidPoolOverlay.setScrollFactor(0);
        this.voidPoolOverlay.setDepth(151);
        
        // Title
        this.voidPoolTitle = this.add.text(this.worldWidth / 2, 30, '◈ VOID POOL ◈', {
            fontFamily: 'monospace',
            fontSize: '20px',
            fill: '#4a148c',
            letterSpacing: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(152);
        
        // Stats display
        this.voidPoolStats = this.add.text(this.worldWidth / 2, 60, 
            'Time: 0s  ·  Grazes: 0  ·  Patterns: 0', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#8b5cf6'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(152);
        
        // Exit instruction
        this.voidPoolExitText = this.add.text(this.worldWidth / 2, this.worldHeight - 30,
            '[ESC] Exit Practice', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff4444'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(152);
        
        // Safe zone indicator (the pool area)
        this.safeZone = this.add.ellipse(
            this.worldWidth / 2, 150, 300, 150, 0x4a148c, 0.2
        );
        this.safeZone.setStrokeStyle(2, 0x8b5cf6);
        this.safeZone.setDepth(151);
    }
    
    /**
     * Create a safe bullet pool that doesn't damage the player.
     */
    createSafeBulletPool() {
        // Check if enemyBullet texture exists, fallback to a circle if not
        const bulletTexture = this.textures.exists('enemyBullet') ? 'enemyBullet' : null;
        
        // Use existing group or create new one for practice bullets
        this.safeBullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 100,
            runChildUpdate: false,
            defaultKey: bulletTexture
        });
        
        // Safe collision - no damage, just tracking
        this.safeBulletCollider = this.physics.add.overlap(this.player, this.safeBullets, (player, bullet) => {
            if (!bullet.active) return;
            
            // Track near-miss (grazing)
            const dist = Phaser.Math.Distance.Between(player.x, player.y, bullet.x, bullet.y);
            if (dist < 35 && dist > 20) {
                // Grazing the bullet
                if (!bullet.grazeCounted) {
                    bullet.grazeCounted = true;
                    this.voidPoolGrazes++;
                    this.showGrazingFeedback(bullet.x, bullet.y);
                }
            }
            
            // Bullet passes through - no damage in practice mode
            // But we can flash the screen to indicate "would have been hit"
            if (dist < 20) {
                this.cameras.main.flash(100, 100, 0, 0, 0.3);
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });
    }
    
    /**
     * Show visual feedback when grazing a bullet.
     */
    showGrazingFeedback(x, y) {
        const text = this.add.text(x, y - 20, 'GRAZE!', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#00d4ff'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    /**
     * Start spawning bullet patterns.
     */
    startBulletPatterns() {
        this.voidPoolPatternsSpawned = 0;
        this.voidPoolPatternTimer = this.time.addEvent({
            delay: 3000, // New pattern every 3 seconds
            callback: this.spawnBulletPattern,
            callbackScope: this,
            loop: true
        });
        
        // Spawn first pattern immediately
        this.spawnBulletPattern();
    }
    
    /**
     * Spawn a bullet pattern. Progresses in difficulty over time.
     */
    spawnBulletPattern() {
        if (!this.isInVoidPool) return;
        
        this.voidPoolPatternsSpawned++;
        
        // Calculate difficulty based on time in practice
        const elapsed = (this.time.now - this.voidPoolStartTime) / 1000;
        const difficulty = Math.min(Math.floor(elapsed / 30), 5); // Increases every 30s, max 5
        
        const patterns = [
            this.spawnSpiralPattern,
            this.spawnCirclePattern,
            this.spawnWavePattern,
            this.spawnBurstPattern,
            this.spawnCrossPattern,
            this.spawnDoubleSpiralPattern
        ];
        
        // Select pattern based on difficulty
        const patternIndex = Math.min(difficulty, patterns.length - 1);
        const availablePatterns = patterns.slice(0, patternIndex + 1);
        const selectedPattern = Phaser.Utils.Array.GetRandom(availablePatterns);
        
        selectedPattern.call(this);
        
        // Show pattern name
        this.showPatternName(selectedPattern.name.replace('spawn', '').replace('Pattern', ''));
    }
    
    showPatternName(name) {
        const text = this.add.text(this.worldWidth / 2, 120, name, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#ffd700'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(153);
        
        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    // ===== BULLET PATTERN IMPLEMENTATIONS =====
    
    spawnSpiralPattern() {
        const centerX = this.worldWidth / 2;
        const centerY = 150;
        const bulletCount = 12;
        const speed = 150;
        
        for (let i = 0; i < bulletCount; i++) {
            const angle = (Math.PI * 2 / bulletCount) * i;
            this.spawnSafeBullet(centerX, centerY, angle, speed);
        }
    }
    
    spawnCirclePattern() {
        const radius = 120;
        const centerX = this.worldWidth / 2;
        const centerY = 150;
        const bulletCount = 16;
        const speed = 120;
        
        // Spawn bullets in a circle that converge toward center
        for (let i = 0; i < bulletCount; i++) {
            const angle = (Math.PI * 2 / bulletCount) * i;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            // Aim toward center
            const aimAngle = Math.atan2(centerY - y, centerX - x);
            this.spawnSafeBullet(x, y, aimAngle, speed);
        }
    }
    
    spawnWavePattern() {
        const startX = this.worldWidth / 2 - 150;
        const y = 50;
        const bulletCount = 7;
        const speed = 180;
        
        for (let i = 0; i < bulletCount; i++) {
            const x = startX + i * 50;
            const angle = Math.PI / 2; // Downward
            this.spawnSafeBullet(x, y, angle, speed);
        }
    }
    
    spawnBurstPattern() {
        const centerX = this.worldWidth / 2;
        const centerY = 150;
        const speed = 200;
        const bulletCount = 24;
        
        for (let i = 0; i < bulletCount; i++) {
            const angle = (Math.PI * 2 / bulletCount) * i;
            this.spawnSafeBullet(centerX, centerY, angle, speed);
        }
    }
    
    spawnCrossPattern() {
        const centerX = this.worldWidth / 2;
        const centerY = 150;
        const speed = 160;
        const countPerArm = 6;
        const spacing = 25;
        
        // Four cardinal directions
        const directions = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
        
        directions.forEach(dir => {
            for (let i = 1; i <= countPerArm; i++) {
                const offset = i * spacing;
                const x = centerX + Math.cos(dir + Math.PI) * offset;
                const y = centerY + Math.sin(dir + Math.PI) * offset;
                this.spawnSafeBullet(x, y, dir, speed);
            }
        });
    }
    
    spawnDoubleSpiralPattern() {
        const centerX = this.worldWidth / 2;
        const centerY = 150;
        const bulletCount = 16;
        const speed = 140;
        
        // Two interleaved spirals
        for (let i = 0; i < bulletCount; i++) {
            const angle1 = (Math.PI * 2 / bulletCount) * i;
            const angle2 = (Math.PI * 2 / bulletCount) * i + Math.PI;
            this.spawnSafeBullet(centerX, centerY, angle1, speed);
            this.time.delayedCall(200, () => {
                if (this.isInVoidPool) {
                    this.spawnSafeBullet(centerX, centerY, angle2, speed);
                }
            });
        }
    }
    
    /**
     * Spawn a safe practice bullet.
     */
    spawnSafeBullet(x, y, angle, speed) {
        const bullet = this.safeBullets.get(x, y, 'enemyBullet');
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(160); // Above all practice UI layers
            bullet.body.enable = true;
            bullet.body.reset(x, y);
            bullet.setTint(0xff3366);
            bullet.setScale(0.6);
            bullet.grazeCounted = false;
            
            bullet.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            bullet.setRotation(angle);
            
            // Auto-cleanup after 5 seconds
            this.time.delayedCall(5000, () => {
                if (bullet.active) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                }
            });
        }
        
        return bullet;
    }
    
    /**
     * Show void pool instructions at start.
     */
    showVoidPoolInstructions() {
        const instructions = this.add.text(this.worldWidth / 2, 250, [
            'Practice dodging without fear.',
            'Bullets pass through you safely.',
            'Get close for GRAZE bonuses!',
            '',
            'Patterns get harder over time.'
        ].join('\n'), {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#a78bfa',
            align: 'center',
            backgroundColor: '#0a0a0f88',
            padding: { x: 12, y: 8 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(153);
        
        this.tweens.add({
            targets: instructions,
            alpha: 0,
            duration: 1000,
            delay: 4000,
            onComplete: () => instructions.destroy()
        });
    }
    
    /**
     * Exit the void pool and return to the Sanctum.
     */
    exitVoidPool() {
        if (!this.isInVoidPool) return;
        
        this.isInVoidPool = false;
        
        // Stop pattern timer
        if (this.voidPoolPatternTimer) {
            this.voidPoolPatternTimer.remove();
            this.voidPoolPatternTimer = null;
        }
        
        // Remove the physics collider
        if (this.safeBulletCollider) {
            this.safeBulletCollider.destroy();
            this.safeBulletCollider = null;
        }
        
        // Destroy the bullet group completely
        if (this.safeBullets) {
            this.safeBullets.destroy(true);
            this.safeBullets = null;
        }
        
        // Destroy overlay elements
        this.voidPoolWorldOverlay?.destroy();
        this.voidPoolOverlay?.destroy();
        this.voidPoolTitle?.destroy();
        this.voidPoolStats?.destroy();
        this.voidPoolExitText?.destroy();
        this.safeZone?.destroy();
        
        // Show practice summary
        const elapsed = Math.floor((this.time.now - this.voidPoolStartTime) / 1000);
        this.showMessage(`Practice Complete! ${this.voidPoolGrazes} grazes · ${elapsed}s · ${this.voidPoolPatternsSpawned} patterns`);
        
        // Return player to saved position
        if (this.savedPlayerPos) {
            this.player.setPosition(this.savedPlayerPos.x, this.savedPlayerPos.y);
        }
        
        // Clean up references
        this.voidPoolWorldOverlay = null;
        this.voidPoolOverlay = null;
        this.voidPoolTitle = null;
        this.voidPoolStats = null;
        this.voidPoolExitText = null;
        this.safeZone = null;
        this.savedPlayerPos = null;
    }
    
    /**
     * Update void pool stats display.
     */
    updateVoidPoolStats() {
        if (!this.isInVoidPool || !this.voidPoolStats) return;
        
        const elapsed = Math.floor((this.time.now - this.voidPoolStartTime) / 1000);
        this.voidPoolStats.setText(
            `Time: ${elapsed}s  ·  Grazes: ${this.voidPoolGrazes}  ·  Patterns: ${this.voidPoolPatternsSpawned}`
        );
    }
    
    showConstellationView() {
        // Prevent opening if already open
        if (this.constellationOverlay) {
            return;
        }
        
        // Load all timeline shards from the chronicle
        const chronicle = this.loadChronicleData();
        const shards = chronicle.shards || [];
        
        // Create constellation overlay
        this.createConstellationOverlay(shards, chronicle);
    }
    
    /**
     * Create an immersive constellation view showing all past runs as stars.
     * Stars are positioned based on run performance (score = brightness, wave = height).
     * Connections show relationships between runs.
     */
    createConstellationOverlay(shards, chronicle) {
        // Darken the background
        const overlay = this.add.rectangle(
            this.worldWidth / 2, this.worldHeight / 2,
            this.worldWidth, this.worldHeight,
            0x000000, 0.85
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(100);
        
        // Title
        const title = this.add.text(this.worldWidth / 2, 60, '✧ CONSTELLATION OF MEMORY ✧', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: '#ffd700',
            letterSpacing: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        
        // Stats summary
        const statsY = 100;
        const statsText = [
            `Total Runs: ${chronicle.totalRuns || shards.length}`,
            `Highest Wave: ${chronicle.highestWave || Math.max(...shards.map(s => s.finalStats?.wave || 0), 0)}`,
            `Mythic Shards: ${chronicle.mythicShards || shards.filter(s => s.rarity === 'mythic').length}`,
            `Legendary: ${chronicle.legendaryShards || shards.filter(s => s.rarity === 'legendary').length}`
        ].join('  ·  ');
        
        const stats = this.add.text(this.worldWidth / 2, statsY, statsText, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#8b5cf6'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        
        // Create constellation container
        const constellationContainer = this.add.container(0, 0);
        constellationContainer.setScrollFactor(0);
        constellationContainer.setDepth(100);
        
        // Generate star positions based on shard data
        const stars = [];
        const centerX = this.worldWidth / 2;
        const centerY = this.worldHeight / 2 + 20;
        
        // Color mapping for rarity
        const rarityColors = {
            mythic: 0xffd700,
            legendary: 0xff6600,
            epic: 0x9d4edd,
            rare: 0x00d4ff,
            common: 0xaaaaaa
        };
        
        if (shards.length === 0) {
            // No runs yet - show placeholder
            const placeholder = this.add.text(centerX, centerY, 
                'No echoes yet...\nYour first run will begin your constellation.', {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#666666',
                align: 'center'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
            
            constellationContainer.add(placeholder);
        } else {
            // Position stars in a spiral pattern based on chronological order
            // Earlier runs are closer to center, later runs spiral outward
            const maxRadius = Math.min(this.worldWidth, this.worldHeight) * 0.35;
            
            shards.forEach((shard, index) => {
                const progress = index / Math.max(shards.length - 1, 1);
                const angle = progress * Math.PI * 4; // 2 full rotations
                const radius = maxRadius * (0.2 + progress * 0.8);
                
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius * 0.6; // Flatten for perspective
                
                // Star size based on score
                const score = shard.finalStats?.score || 0;
                const maxScore = Math.max(...shards.map(s => s.finalStats?.score || 0), 1);
                const starSize = 3 + (score / maxScore) * 8;
                
                // Color based on rarity
                const color = rarityColors[shard.rarity] || 0xffffff;
                
                // Create star with glow
                const star = this.add.ellipse(x, y, starSize * 2, starSize * 2, color, 1);
                star.setInteractive({ useHandCursor: true });
                
                // Glow effect
                const glow = this.add.ellipse(x, y, starSize * 4, starSize * 4, color, 0.3);
                this.tweens.add({
                    targets: glow,
                    scale: { from: 1, to: 1.5 },
                    alpha: { from: 0.3, to: 0.1 },
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                // Pulse animation for mythic/legendary
                if (shard.rarity === 'mythic' || shard.rarity === 'legendary') {
                    this.tweens.add({
                        targets: star,
                        scale: { from: 1, to: 1.3 },
                        duration: 1500,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
                
                // Tooltip on hover
                star.on('pointerover', () => {
                    const date = new Date(shard.timestamp || Date.now()).toLocaleDateString();
                    const tooltipText = [
                        `${shard.playstyle || 'Unknown'} · ${shard.rarity || 'common'}`,
                        `Score: ${shard.finalStats?.score || 0} · Wave: ${shard.finalStats?.wave || 0}`,
                        `Date: ${date}`
                    ].join('\n');
                    
                    this.showConstellationTooltip(tooltipText, x, y - starSize * 3, color);
                    glow.setAlpha(0.6);
                });
                
                star.on('pointerout', () => {
                    this.hideConstellationTooltip();
                    glow.setAlpha(0.3);
                });
                
                stars.push({ star, glow, shard, index });
                constellationContainer.add([glow, star]);
            });
            
            // Draw constellation lines between related runs
            // Connect runs with similar playstyles or consecutive runs
            const graphics = this.add.graphics();
            graphics.lineStyle(1, 0x8b5cf6, 0.3);
            graphics.setScrollFactor(0);
            graphics.setDepth(99);
            
            for (let i = 0; i < stars.length - 1; i++) {
                const current = stars[i];
                const next = stars[i + 1];
                
                // Always connect consecutive runs (timeline thread)
                graphics.lineBetween(
                    current.star.x, current.star.y,
                    next.star.x, next.star.y
                );
                
                // Connect similar playstyles
                if (current.shard.playstyle === next.shard.playstyle && i + 2 < stars.length) {
                    graphics.lineStyle(1, rarityColors[current.shard.playstyle] || 0x8b5cf6, 0.15);
                }
            }
            
            constellationContainer.add(graphics);
        }
        
        // Close instruction
        const closeText = this.add.text(this.worldWidth / 2, this.worldHeight - 60,
            '[CLICK] Close Constellation View', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        
        // Close on click
        const closeHandler = () => {
            overlay.destroy();
            title.destroy();
            stats.destroy();
            constellationContainer.destroy();
            closeText.destroy();
            this.hideConstellationTooltip();
            this.input.off('pointerdown', closeHandler);
            this.constellationOverlay = null;
        };
        
        this.input.on('pointerdown', closeHandler);
        
        // Store references for cleanup
        this.constellationOverlay = {
            overlay, title, stats, constellationContainer, closeText, closeHandler
        };
    }
    
    showConstellationTooltip(text, x, y, color) {
        this.hideConstellationTooltip();
        
        this.constellationTooltip = this.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '11px',
            fill: '#ffffff',
            backgroundColor: '#0a0a0f',
            padding: { x: 8, y: 4 },
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        // Border effect with color (convert hex to CSS color string)
        const colorHex = typeof color === 'number' ? color.toString(16).padStart(6, '0') : 'ffffff';
        this.constellationTooltip.setStroke('#' + colorHex, 1);
    }
    
    hideConstellationTooltip() {
        if (this.constellationTooltip) {
            this.constellationTooltip.destroy();
            this.constellationTooltip = null;
        }
    }
    
    /**
     * Load chronicle data from the TimelineChronicleSystem storage.
     * Returns an object with shards and statistics.
     */
    loadChronicleData() {
        try {
            const saved = localStorage.getItem('shooty_chronicle_v1');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('[Sanctum] Failed to load chronicle:', e);
        }
        
        return {
            version: 1,
            shards: [],
            totalRuns: 0,
            highestWave: 0,
            mythicShards: 0,
            legendaryShards: 0,
            epicShards: 0,
            rareShards: 0,
            equippedShards: [],
            resonantHarmonies: []
        };
    }
    
    exitSanctum() {
        // Transition out
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.parentSystem.exitSanctum(this.equippedShards, this.playerPos);
        });
    }

    /**
     * Shutdown handler - clean up keyboard keys when scene stops.
     * Prevents input conflicts when returning to GameScene.
     */
    shutdown() {
        // Close any open UIs first
        if (this.isAltarOpen) {
            this.closeAltarMenu();
        }
        if (this.isInVoidPool) {
            this.exitVoidPool();
        }
        if (this.constellationOverlay) {
            // Close constellation view if open
            this.constellationOverlay.closeHandler?.();
        }
        
        // Clean up keyboard keys
        if (this.keys) {
            Object.values(this.keys).forEach(key => {
                if (key && typeof key.destroy === 'function') {
                    key.destroy();
                }
            });
            this.keys = null;
        }
        
        // Clean up visual elements
        this.floorGraphics?.destroy();
        this.floorGraphics = null;
        
        this.atmosphereTween?.stop();
        this.atmosphereTween = null;
        
        this.atmosphereGlow?.destroy();
        this.atmosphereGlow = null;
        
        this.atmosphereParticles?.destroy();
        this.atmosphereParticles = null;
    }
}
