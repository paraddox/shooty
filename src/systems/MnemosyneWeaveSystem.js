import Phaser from 'phaser';

/**
 * Mnemosyne Weave System — The Living Monument
 * 
 * Timeline Shards are no longer mere trophies. They are DOORS.
 * 
 * Press M to enter Mnemosyne Trance. The world fractures. Your equipped shards
 * manifest as floating crystalline portals — windows into your own past. Step through
 * one and you dive into that run's reality, fighting alongside your own ghost
 * for 15 seconds of temporal incursion.
 * 
 * === THE CORE MECHANIC ===
 * 
 * 1. MNEMOSYNE TRANCE (Press M when shard bar full)
 *    - Time dilates to 20% speed in main world
 *    - Three shard portals materialize around you
 *    - Each portal shows a live preview of that shard's final moments
 * 
 * 2. SHARD INCURSION (Click portal to enter)
 *    - You are transported into the shard's recorded timeline
 *    - Your past self's movement path plays as a cyan ghost
 *    - Enemies from that run spawn and fight you BOTH
 *    - You have 15 seconds to "rewrite" history
 * 
 * 3. BUTTERFLY EFFECT (Changes cascade forward)
 *    - Each enemy killed in the shard heals you in the present
 *    - Each bullet absorbed grants ammo to your current weapon
 *    - Your past self's death location becomes a power node
 * 
 * 4. CORRUPTION RISK (Every incursion has cost)
 *    - 30% chance the shard "corrupts" — its bonuses invert
 *    - Corrupted shards glow red, grant chaotic benefits
 *    - Three corruptions = shard becomes a "Void Tear" (boss spawner)
 * 
 * 4. THE WEAVE (Combining shards)
 *    - After visiting 2+ shards in one trance, they "braid"
 *    - Braided shards share bonuses — equip one, get both effects
 *    - Full braid (3 shards) unlocks "Ouroboros State" for next run
 * 
 * === STRATEGIC DEPTH ===
 * 
 * The Mnemosyne Weave transforms the game's entire structure:
 * 
 * - WHEN to enter trance? (Only when safe in present?)
 * - WHICH shard to visit? (High-score run for healing? Death run for revenge?)
 * - RISK vs REWARD (Corrupt a powerful shard for short-term gain?)
 * - WEAVING (Which shard combinations create best synergies?)
 * 
 * === SYNERGIES ===
 * 
 * - Timeline Chronicle: Provides the shard data and persistence
 * - Chrono-Loop: Past self in shard IS your loop echo
 * - Quantum Immortality: Death echoes manifest as shard bosses
 * - Paradox Engine: See shard futures before entering
 * - Symbiotic Prediction: AI predicts which shard helps most
 * - Void Coherence: Corrupted shards boost void power
 * - Observer Effect: AI learns from your shard choices
 * - Dimensional Collapse: In collapse, can visit ALL shards at once
 * 
 * Color: Shifting iridescent — each shard portal shows its true color
 * 
 * This system transforms your entire history into a strategic resource,
 * making every run permanently part of an evolving multidimensional tapestry.
 * Your failures become weapons. Your triumphs become sanctuaries.
 * You are building not just a legacy, but a playable universe.
 */

export default class MnemosyneWeaveSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== TRANCE STATE =====
        this.inTrance = false;
        this.tranceMeter = 0;
        this.tranceMeterMax = 100;
        this.tranceCost = 100; // Cost to enter trance
        this.tranceDuration = 0;
        this.tranceMaxDuration = 8; // Seconds before forced exit
        
        // ===== SHARD PORTALS =====
        this.portals = []; // Active portal objects
        this.portalDistance = 180; // Distance from player
        this.maxPortals = 3;
        
        // ===== INCURSION STATE =====
        this.activeIncursion = null; // Currently visiting shard
        this.incursionTimeRemaining = 0;
        this.incursionDuration = 15; // Seconds in shard world
        this.incursionFrozen = false; // Present world is paused
        
        // ===== BUTTERFLY EFFECT TRACKING =====
        this.butterflyEffects = {
            enemiesKilledInShard: 0,
            healingQueued: 0,
            ammoGranted: 0,
            powerNodesSpawned: []
        };
        
        // ===== CORRUPTION SYSTEM =====
        this.corruptionChance = 0.3; // 30% base chance
        this.corruptedShardIds = new Set(); // Track corrupted shards
        this.voidTearShardIds = new Set(); // Fully corrupted (3x)
        
        // ===== WEAVE STATE =====
        this.visitedThisTrance = []; // Shards visited in current trance
        this.braidedShardPairs = []; // Pairs of braided shards
        this.ouroborosReady = false; // Full braid achieved
        
        // ===== GHOST REPLAY =====
        this.ghostPlayer = null; // Visual ghost of past self
        this.ghostPath = []; // Path data from shard
        this.ghostTime = 0; // Current playback time
        
        // ===== VISUALS =====
        this.tranceOverlay = null;
        this.butterflyParticles = null;
        this.weaveConnections = [];
        
        // ===== CONSTANTS =====
        this.PORTAL_COLORS = {
            pristine: 0x00f0ff,    // Cyan - untouched shard
            corrupted: 0xff0044,   // Red - inverted bonuses
            voidtear: 0x4a0080,     // Deep purple - boss portal
            braided: 0xffd700      // Gold - linked to another
        };
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
        this.loadCorruptionData();
    }
    
    createVisuals() {
        // Trance overlay (iridescent sheen)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create iridescent gradient
        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.1)');
        gradient.addColorStop(0.3, 'rgba(157, 78, 221, 0.08)');
        gradient.addColorStop(0.6, 'rgba(255, 215, 0, 0.06)');
        gradient.addColorStop(1, 'rgba(255, 0, 100, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        // Add subtle interference pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        for (let i = 0; i < 256; i += 8) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(256, i + (i % 16 === 0 ? 4 : -4));
            ctx.stroke();
        }
        
        this.scene.textures.addCanvas('mnemosyne_overlay', canvas);
        
        this.tranceOverlay = this.scene.add.image(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'mnemosyne_overlay'
        );
        this.tranceOverlay.setScrollFactor(0);
        this.tranceOverlay.setDepth(75);
        this.tranceOverlay.setVisible(false);
        this.tranceOverlay.setAlpha(0);
        this.tranceOverlay.setBlendMode(Phaser.BlendModes.ADD);
        
        // Butterfly effect particles
        this.butterflyParticles = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 0.8, end: 0 },
            alpha: { start: 0.8, end: 0 },
            speed: { min: 20, max: 80 },
            lifespan: 1000,
            gravityY: -30,
            tint: [0x00f0ff, 0x9d4edd, 0xffd700],
            frequency: -1
        });
        this.butterflyParticles.setDepth(85);
    }
    
    setupInput() {
        // M key to enter/exit trance
        this.scene.input.keyboard.on('keydown-M', () => {
            if (this.activeIncursion) {
                this.exitIncursion();
            } else if (this.inTrance) {
                this.exitTrance();
            } else {
                this.enterTrance();
            }
        });
        
        // Click to select portal (only in trance)
        this.scene.input.on('pointerdown', (pointer) => {
            if (!this.inTrance || this.activeIncursion) return;
            
            // Check if clicked on a portal
            const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
            this.checkPortalClick(worldPoint.x, worldPoint.y);
        });
    }
    
    loadCorruptionData() {
        try {
            const saved = localStorage.getItem('mnemosyne_corruption_v1');
            if (saved) {
                const data = JSON.parse(saved);
                this.corruptedShardIds = new Set(data.corrupted || []);
                this.voidTearShardIds = new Set(data.voidTears || []);
                this.braidedShardPairs = data.braided || [];
            }
        } catch (e) {
            console.warn('Failed to load Mnemosyne corruption data:', e);
        }
    }
    
    saveCorruptionData() {
        try {
            const data = {
                corrupted: Array.from(this.corruptedShardIds),
                voidTears: Array.from(this.voidTearShardIds),
                braided: this.braidedShardPairs
            };
            localStorage.setItem('mnemosyne_corruption_v1', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save Mnemosyne corruption data:', e);
        }
    }
    
    // ===== TRANCE MECHANICS =====
    
    canEnterTrance() {
        if (this.inTrance) return false;
        if (this.tranceMeter < this.tranceCost) return false;
        if (!this.scene.player.active) return false;
        
        // Must have equipped shards
        const chronicle = this.scene.timelineChronicle?.loadChronicle();
        if (!chronicle || chronicle.equippedShards.length === 0) return false;
        
        return true;
    }
    
    enterTrance() {
        if (!this.canEnterTrance()) {
            this.showTranceDenied();
            return;
        }
        
        this.inTrance = true;
        this.tranceMeter -= this.tranceCost;
        this.tranceDuration = this.tranceMaxDuration;
        this.visitedThisTrance = [];
        
        // Slow time in main world
        this.scene.physics.world.timeScale = 0.2;
        this.scene.time.timeScale = 0.2;
        
        // Show overlay
        this.tranceOverlay.setVisible(true);
        this.scene.tweens.add({
            targets: this.tranceOverlay,
            alpha: 0.7,
            duration: 400
        });
        
        // Create portals for equipped shards
        this.createShardPortals();
        
        // Visual effect
        this.showTranceActivation();
        
        // Record in chronicle
        this.scene.timelineChronicle?.recordSystemUse('mnemosyneTrance');
    }
    
    exitTrance() {
        if (!this.inTrance) return;
        
        this.inTrance = false;
        
        // Check for braiding
        if (this.visitedThisTrance.length >= 2) {
            this.braidVisitedShards();
        }
        
        // Reset time
        this.scene.physics.world.timeScale = 1;
        this.scene.time.timeScale = 1;
        
        // Hide overlay
        this.scene.tweens.add({
            targets: this.tranceOverlay,
            alpha: 0,
            duration: 300,
            onComplete: () => this.tranceOverlay.setVisible(false)
        });
        
        // Destroy portals
        this.destroyPortals();
        
        // Remove ghost if exists
        if (this.ghostPlayer) {
            this.ghostPlayer.destroy();
            this.ghostPlayer = null;
        }
    }
    
    createShardPortals() {
        const chronicle = this.scene.timelineChronicle?.loadChronicle();
        if (!chronicle) return;
        
        const equippedShards = chronicle.shards.filter(
            s => chronicle.equippedShards.includes(s.id)
        );
        
        const player = this.scene.player;
        const angleStep = (Math.PI * 2) / Math.min(equippedShards.length, this.maxPortals);
        
        equippedShards.slice(0, this.maxPortals).forEach((shard, index) => {
            const angle = index * angleStep - Math.PI / 2; // Start at top
            const x = player.x + Math.cos(angle) * this.portalDistance;
            const y = player.y + Math.sin(angle) * this.portalDistance;
            
            const portal = this.createPortal(x, y, shard, angle);
            this.portals.push(portal);
        });
    }
    
    createPortal(x, y, shard, angle) {
        const container = this.scene.add.container(x, y);
        container.setDepth(80);
        
        // Determine portal state
        let color = this.PORTAL_COLORS.pristine;
        let isCorrupted = this.corruptedShardIds.has(shard.id);
        let isVoidTear = this.voidTearShardIds.has(shard.id);
        let isBraided = this.braidedShardPairs.some(
            pair => pair.includes(shard.id)
        );
        
        if (isVoidTear) color = this.PORTAL_COLORS.voidtear;
        else if (isCorrupted) color = this.PORTAL_COLORS.corrupted;
        else if (isBraided) color = this.PORTAL_COLORS.braided;
        
        // Portal visuals
        // Outer ring (pulsing)
        const outerRing = this.scene.add.circle(0, 0, 50, color, 0.3);
        outerRing.setBlendMode(Phaser.BlendModes.ADD);
        container.add(outerRing);
        
        // Shard info text
        const infoText = this.scene.add.text(0, -70, this.getShardLabel(shard), {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        container.add(infoText);
        
        // Preview circle (shows shard color)
        const preview = this.scene.add.circle(0, 0, 20, shard.shardColor || 0xffffff, 0.6);
        preview.setBlendMode(Phaser.BlendModes.ADD);
        container.add(preview);
        
        // Animate portal
        this.scene.tweens.add({
            targets: outerRing,
            scale: { from: 1, to: 1.3 },
            alpha: { from: 0.3, to: 0.6 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        return {
            container,
            shard,
            outerRing,
            color,
            isCorrupted,
            isVoidTear,
            angle
        };
    }
    
    getShardLabel(shard) {
        if (this.voidTearShardIds.has(shard.id)) return 'VOID TEAR';
        if (this.corruptedShardIds.has(shard.id)) return 'CORRUPTED';
        if (this.braidedShardPairs.some(p => p.includes(shard.id))) return 'BRAIDED';
        return shard.playstyle?.toUpperCase() || 'SHARD';
    }
    
    destroyPortals() {
        this.portals.forEach(portal => {
            portal.container.destroy();
        });
        this.portals = [];
    }
    
    // ===== INCURSION MECHANICS =====
    
    checkPortalClick(x, y) {
        for (const portal of this.portals) {
            const dist = Phaser.Math.Distance.Between(
                x, y, portal.container.x, portal.container.y
            );
            
            if (dist < 60) {
                this.enterIncursion(portal);
                break;
            }
        }
    }
    
    enterIncursion(portal) {
        this.activeIncursion = portal;
        this.incursionTimeRemaining = this.incursionDuration;
        this.incursionFrozen = true;
        
        // Track visit
        this.visitedThisTrance.push(portal.shard.id);
        
        // Create ghost player from shard path data
        this.createGhostPlayer(portal.shard);
        
        // Spawn shard enemies
        this.spawnShardEnemies(portal.shard);
        
        // Apply corruption chance
        this.attemptCorruption(portal.shard);
        
        // Visual transition
        this.showIncursionTransition(portal.shard);
        
        // Start butterfly tracking
        this.butterflyEffects = {
            enemiesKilledInShard: 0,
            healingQueued: 0,
            ammoGranted: 0,
            powerNodesSpawned: []
        };
        
        // Store present world state
        this.storePresentState();
    }
    
    createGhostPlayer(shard) {
        // Create visual ghost from shard's path data
        this.ghostPlayer = this.scene.add.container(0, 0);
        this.ghostPlayer.setDepth(40);
        
        // Ghost body
        const body = this.scene.add.circle(0, 0, 15, 0x00f0ff, 0.4);
        body.setBlendMode(Phaser.BlendModes.ADD);
        this.ghostPlayer.add(body);
        
        // Load path data from shard
        this.ghostPath = shard.pathData || [];
        this.ghostTime = 0;
        
        // Position at start of path
        if (this.ghostPath.length > 0) {
            this.ghostPlayer.setPosition(this.ghostPath[0].x, this.ghostPath[0].y);
        }
        
        // Animate ghost appearance
        this.scene.tweens.add({
            targets: body,
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: 0.4 },
            duration: 500
        });
    }
    
    spawnShardEnemies(shard) {
        // Spawn enemies based on shard's bullet data
        // In a real implementation, we'd have enemy spawn data in the shard
        // For now, spawn a mini-wave representing that run's intensity
        
        const intensity = Math.min(8, Math.floor((shard.score || 0) / 500) + 3);
        
        for (let i = 0; i < intensity; i++) {
            const angle = (i / intensity) * Math.PI * 2;
            const dist = 300 + Math.random() * 200;
            const x = this.scene.player.x + Math.cos(angle) * dist;
            const y = this.scene.player.y + Math.sin(angle) * dist;
            
            const enemy = new this.scene.EnemyClass(
                this.scene, x, y, this.scene.player, 'enemy'
            );
            
            // Mark as shard enemy for butterfly tracking
            enemy.isShardEnemy = true;
            enemy.shardOrigin = shard.id;
            
            this.scene.enemies.add(enemy);
        }
        
        // Spawn boss for void tears
        if (this.voidTearShardIds.has(shard.id)) {
            this.spawnVoidTearBoss(shard);
        }
    }
    
    spawnVoidTearBoss(shard) {
        // Spawn a special "Echo Lich" boss
        const boss = this.spawnEchoLich(shard);
        
        // Announce
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 100,
            'ECHO LICH RISES',
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fill: '#ff0044',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 3000,
            onComplete: () => text.destroy()
        });
    }
    
    spawnEchoLich(shard) {
        // Create a ghostly boss that uses shard data
        const boss = this.scene.add.container(
            this.scene.player.x + 400,
            this.scene.player.y
        );
        boss.setDepth(40);
        
        // Core
        const core = this.scene.add.circle(0, 0, 40, 0xff0044, 0.5);
        core.setBlendMode(Phaser.BlendModes.ADD);
        boss.add(core);
        
        // Orbiting echoes
        for (let i = 0; i < 6; i++) {
            const echo = this.scene.add.circle(0, 0, 15, 0xff0044, 0.3);
            const angle = (i / 6) * Math.PI * 2;
            echo.setPosition(Math.cos(angle) * 60, Math.sin(angle) * 60);
            boss.add(echo);
        }
        
        // Boss data
        boss.health = 500;
        boss.maxHealth = 500;
        boss.isShardBoss = true;
        boss.shardOrigin = shard.id;
        
        // Add to scene's special enemies list if exists
        if (!this.scene.shardBosses) this.scene.shardBosses = [];
        this.scene.shardBosses.push(boss);
        
        return boss;
    }
    
    attemptCorruption(shard) {
        // Skip if already void tear
        if (this.voidTearShardIds.has(shard.id)) return;
        
        // Check corruption chance
        let chance = this.corruptionChance;
        
        // Corrupted shards have higher chance to become void tears
        if (this.corruptedShardIds.has(shard.id)) {
            chance = 0.5;
        }
        
        if (Math.random() < chance) {
            if (this.corruptedShardIds.has(shard.id)) {
                // Second corruption - become void tear
                this.voidTearShardIds.add(shard.id);
                this.corruptedShardIds.delete(shard.id);
                this.showVoidTearConversion(shard);
            } else {
                // First corruption
                this.corruptedShardIds.add(shard.id);
                this.showCorruption(shard);
            }
            
            this.saveCorruptionData();
        }
    }
    
    exitIncursion() {
        if (!this.activeIncursion) return;
        
        // Apply butterfly effects
        this.applyButterflyEffects();
        
        // Return to present world state
        this.restorePresentState();
        
        this.activeIncursion = null;
        this.incursionTimeRemaining = 0;
        this.incursionFrozen = false;
        
        // Remove ghost
        if (this.ghostPlayer) {
            this.scene.tweens.add({
                targets: this.ghostPlayer,
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => {
                    this.ghostPlayer.destroy();
                    this.ghostPlayer = null;
                }
            });
        }
        
        // Clear shard enemies
        this.clearShardEnemies();
        
        // Show return message
        this.showReturnMessage();
    }
    
    applyButterflyEffects() {
        const effects = this.butterflyEffects;
        const player = this.scene.player;
        
        // Healing from enemies killed
        if (effects.enemiesKilledInShard > 0) {
            const healAmount = effects.enemiesKilledInShard * 10;
            player.health = Math.min(player.maxHealth, player.health + healAmount);
            
            this.showFloatingText(
                player.x, player.y - 50,
                `+${healAmount} HEALTH`,
                0x00ff00
            );
        }
        
        // Power nodes at death locations
        effects.powerNodesSpawned.forEach(node => {
            this.spawnPowerNode(node.x, node.y);
        });
        
        // Visual effect
        if (effects.enemiesKilledInShard > 0) {
            this.butterflyParticles.emitParticleAt(player.x, player.y, 20);
        }
    }
    
    spawnPowerNode(x, y) {
        // Create a lingering power node that grants bonuses
        const node = this.scene.add.circle(x, y, 25, 0xffd700, 0.4);
        node.setBlendMode(Phaser.BlendModes.ADD);
        node.setDepth(30);
        
        // Pulse animation
        this.scene.tweens.add({
            targets: node,
            scale: { from: 1, to: 1.5 },
            alpha: { from: 0.4, to: 0.7 },
            duration: 1000,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: node,
                    alpha: 0,
                    scale: 0,
                    duration: 300,
                    onComplete: () => node.destroy()
                });
            }
        });
        
        // Grant bonus on contact
        this.scene.physics.add.existing(node);
        node.body.setCircle(25);
        node.body.isSensor = true;
        
        // Overlap with player
        this.scene.physics.add.overlap(node, this.scene.player, () => {
            this.scene.score += 100;
            this.showFloatingText(x, y, '+100 SCORE', 0xffd700);
            node.destroy();
        });
    }
    
    clearShardEnemies() {
        this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.isShardEnemy) {
                enemy.die();
            }
        });
        
        if (this.scene.shardBosses) {
            this.scene.shardBosses.forEach(boss => boss.destroy());
            this.scene.shardBosses = [];
        }
    }
    
    storePresentState() {
        // Store current world state before entering shard
        this.presentState = {
            enemyBullets: [],
            spawnTimerPaused: true
        };
        
        // Pause spawn timer
        if (this.scene.spawnTimer) {
            this.scene.spawnTimer.paused = true;
        }
    }
    
    restorePresentState() {
        // Resume spawn timer
        if (this.scene.spawnTimer) {
            this.scene.spawnTimer.paused = false;
        }
    }
    
    braidVisitedShards() {
        if (this.visitedThisTrance.length < 2) return;
        
        // Create braid pairs
        for (let i = 0; i < this.visitedThisTrance.length - 1; i++) {
            const pair = [this.visitedThisTrance[i], this.visitedThisTrance[i + 1]];
            
            // Check if already braided
            const exists = this.braidedShardPairs.some(
                p => (p[0] === pair[0] && p[1] === pair[1]) ||
                     (p[0] === pair[1] && p[1] === pair[0])
            );
            
            if (!exists) {
                this.braidedShardPairs.push(pair);
            }
        }
        
        // Check for full braid (all 3 shards visited)
        if (this.visitedThisTrance.length >= 3) {
            this.ouroborosReady = true;
            this.showOuroborosReady();
        }
        
        this.saveCorruptionData();
    }
    
    // ===== UPDATE LOOP =====
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;

        // Update trance meter
        if (this.tranceMeter < this.tranceMeterMax) {
            this.tranceMeter = Math.min(
                this.tranceMeterMax,
                this.tranceMeter + dt * 2 // Takes 50 seconds to fill
            );
        }
        
        // Update trance state
        if (this.inTrance) {
            this.updateTrance(dt);
        }
        
        // Update incursion
        if (this.activeIncursion) {
            this.updateIncursion(dt);
        }
        
        // Update ghost player
        if (this.ghostPlayer && this.ghostPath.length > 0) {
            this.updateGhostPlayer(dt);
        }
        
        // Update portal positions (they orbit player)
        if (this.inTrance && !this.activeIncursion) {
            this.updatePortalPositions();
        }
    }
    
    updateTrance(dt) {
        this.tranceDuration -= dt;
        
        if (this.tranceDuration <= 0) {
            this.exitTrance();
            return;
        }
        
        // Pulse portals
        this.portals.forEach(portal => {
            portal.outerRing.setAlpha(
                0.3 + Math.sin(this.scene.time.now / 200) * 0.2
            );
        });
    }
    
    updateIncursion(dt) {
        this.incursionTimeRemaining -= dt;
        
        if (this.incursionTimeRemaining <= 0) {
            this.exitIncursion();
            return;
        }
        
        // Track ghost collision with enemies
        this.checkGhostCollisions();
    }
    
    updateGhostPlayer(dt) {
        // Advance ghost through its recorded path
        this.ghostTime += dt * 1000; // Convert to ms
        
        // Find position in path
        let currentPos = this.ghostPath[0];
        let nextPos = this.ghostPath[1];
        let progress = 0;
        
        for (let i = 0; i < this.ghostPath.length - 1; i++) {
            const point = this.ghostPath[i];
            const next = this.ghostPath[i + 1];
            
            if (point.t <= this.ghostTime && next.t > this.ghostTime) {
                currentPos = point;
                nextPos = next;
                progress = (this.ghostTime - point.t) / (next.t - point.t);
                break;
            }
        }
        
        if (currentPos && nextPos) {
            const x = currentPos.x + (nextPos.x - currentPos.x) * progress;
            const y = currentPos.y + (nextPos.y - currentPos.y) * progress;
            this.ghostPlayer.setPosition(x, y);
        }
    }
    
    updatePortalPositions() {
        const player = this.scene.player;
        
        this.portals.forEach((portal, index) => {
            const angle = portal.angle + this.scene.time.now / 2000;
            const x = player.x + Math.cos(angle) * this.portalDistance;
            const y = player.y + Math.sin(angle) * this.portalDistance;
            portal.container.setPosition(x, y);
            portal.angle = angle;
        });
    }
    
    checkGhostCollisions() {
        if (!this.ghostPlayer) return;
        
        // Ghost provides support fire
        // If ghost is near enemies, it "fires" automatically
        const ghostX = this.ghostPlayer.x;
        const ghostY = this.ghostPlayer.y;
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active || !enemy.isShardEnemy) return;
            
            const dist = Phaser.Math.Distance.Between(
                ghostX, ghostY, enemy.x, enemy.y
            );
            
            if (dist < 200 && Math.random() < 0.05) {
                // Ghost fires at enemy
                this.spawnGhostBullet(ghostX, ghostY, enemy);
            }
        });
    }
    
    spawnGhostBullet(x, y, target) {
        const angle = Phaser.Math.Angle.Between(x, y, target.x, target.y);
        const bullet = this.scene.getBulletsGroup().get(x, y, 'bullet');
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setTint(0x00f0ff);
            bullet.setAlpha(0.6);
            bullet.body.enable = true;
            bullet.body.reset(x, y);
            bullet.isGhostBullet = true;
            
            const speed = 400;
            bullet.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Ghost bullets do reduced damage but track kills
            bullet.damage = 5;
        }
    }
    
    onShardEnemyKilled(enemy) {
        if (!enemy.isShardEnemy) return;
        
        this.butterflyEffects.enemiesKilledInShard++;
        
        // Visual effect at enemy death location
        this.butterflyParticles.emitParticleAt(enemy.x, enemy.y, 8);
    }
    
    // ===== VISUAL EFFECTS =====
    
    showTranceActivation() {
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 100,
            'MNEMOSYNE TRANCE',
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fill: '#9d4edd',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Screen flash
        this.scene.cameras.main.flash(300, 157, 78, 221, 0.3);
    }
    
    showTranceDenied() {
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 80,
            this.tranceMeter < this.tranceCost ? 'TRANCE CHARGING...' : 'NO SHARDS EQUIPPED',
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#666677'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }
    
    showIncursionTransition(shard) {
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 100,
            `ENTERING: ${shard.playstyle?.toUpperCase() || 'MEMORY'}`,
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#00f0ff',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Chromatic aberration effect
        this.scene.cameras.main.shake(500, 0.01);
    }
    
    showCorruption(shard) {
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 120,
            'SHARD CORRUPTED',
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#ff0044',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 3000,
            onComplete: () => text.destroy()
        });
        
        // Record in chronicle
        this.scene.timelineChronicle?.recordSystemUse('shardCorruption', {
            shardId: shard.id
        });
    }
    
    showVoidTearConversion(shard) {
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 120,
            'VOID TEAR OPENED',
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fill: '#4a0080',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            scale: { from: 1, to: 1.5 },
            duration: 4000,
            onComplete: () => text.destroy()
        });
        
        // Dramatic effect
        this.scene.cameras.main.shake(800, 0.02);
        this.scene.cameras.main.flash(400, 74, 0, 128, 0.4);
    }
    
    showOuroborosReady() {
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 150,
            'OUROBOROS BRAID COMPLETE\nNext run: All systems synergized',
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#ffd700',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Golden flash
        this.scene.cameras.main.flash(500, 255, 215, 0, 0.4);
    }
    
    showReturnMessage() {
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 80,
            `RETURNED: +${this.butterflyEffects.enemiesKilledInShard * 10} HP`,
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#00f0ff'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 2500,
            onComplete: () => text.destroy()
        });
    }
    
    showFloatingText(x, y, text, color) {
        const hexColor = '#' + color.toString(16).padStart(6, '0');
        const txt = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: hexColor
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: txt,
            y: y - 30,
            alpha: 0,
            duration: 1500,
            onComplete: () => txt.destroy()
        });
    }
    
    // ===== HUD INTERFACE =====
    
    getTranceMeterPercent() {
        return (this.tranceMeter / this.tranceMeterMax) * 100;
    }
    
    getStatusText() {
        if (this.activeIncursion) {
            return `INCURSION: ${Math.ceil(this.incursionTimeRemaining)}s`;
        }
        if (this.inTrance) {
            return `TRANCE: ${Math.ceil(this.tranceDuration)}s`;
        }
        if (this.tranceMeter >= this.tranceCost) {
            return 'MNEMOSYNE READY [M]';
        }
        return '';
    }
}
