import Phaser from 'phaser';

/**
 * Nemesis Genesis System — The Adversarial Mirror
 * 
 * Every game has bosses. No game has a boss that IS you.
 * 
 * The Nemesis observes your playstyle across runs — your movement patterns, 
 * weapon preferences, temporal system usage, risk tolerance, and tactical rhythms.
 * It then generates a NEMESIS: a boss that fights using your own strategies 
 * against you.
 * 
 * === THE CORE INNOVATION ===
 * 
 * This is behavioral cloning as gameplay. The AI doesn't just get harder —
 * it gets MORE LIKE YOU. Aggressive players face aggressive nemeses. 
 * Tactical players face tactical nemeses. Bullet-time grazers face 
 * bullet-time grazing nemeses.
 * 
 * === NEMESIS ARCHITECTURE ===
 * 
 * 1. BEHAVIORAL PROFILING (Silent, always active)
 *    - Movement clustering: Do you circle-strafe? Corner-camp? Zigzag?
 *    - Temporal preferences: Which systems do you use most?
 *    - Risk signature: Near-miss frequency, danger zone dwell time
 *    - Rhythm analysis: Burst-dodge vs. smooth-flow patterns
 *    - Weapon DNA: Preferred fire patterns, range preferences
 * 
 * 2. NEMESIS GENESIS (Wave 10 — when you're ready)
 *    - Generates boss using YOUR movement clusters
 *    - Weapon mimics your evolved omni-weapon configuration
 *    - Temporal abilities match your most-used systems
 *    - Name: "Nemesis-[PlayerArchetype]-[Generation]"
 * 
 * 3. THE MIRROR BATTLE
 *    - Nemesis uses your tactics: if you corner-camp, it flank-pushes
 *    - Nemesis counters your counters: learns your favorite dodge patterns
 *    - Nemesis evolves mid-fight: adapts to what you're doing RIGHT NOW
 * 
 * 4. NEMESIS MEMORY (Cross-run persistence)
 *    - Each nemesis you defeat becomes a "Shadow" in your gallery
 *    - Shadows can be RE-SUMMONED for training runs
 *    - Nemeses evolve generations: each rematch is smarter, more you
 *    - Share nemesis seeds: fight other players' shadows
 * 
 * === NEMESIS TACTICAL PATTERNS ===
 * 
 * The Nemesis has access to corrupted versions of YOUR systems:
 * 
 * - Echo Storm → VOID ECHOES (bullets that echo after delay, in reverse)
 * - Fracture → SHADOW CLONES (splits into 2-3 copies of itself)
 * - Paradox Engine → CRIMSON FORESIGHT (predicts YOUR movement, shows red warnings)
 * - Residue → TACTICAL MINES (places traps where you WILL be)
 * - Singularity → ENTROPY WELLS (anti-singularity that repels your bullets)
 * 
 * === THE META-REALIZATION ===
 * 
 * Fighting your Nemesis reveals your own weaknesses:
 * - "It keeps cornering me — do I overcommit to positions?"
 * - "It predicts my dodges — am I too predictable?"
 * - "It uses bullet-time exactly when I would — is my timing obvious?"
 * 
 * The Nemesis is the ULTIMATE teacher because it doesn't teach you 
 * THE GAME — it teaches you YOURSELF.
 * 
 * === SYNERGIES ===
 * 
 * - Observer Effect: Provides the behavioral data for profiling
 * - Symbiotic Prediction: Your prediction + Nemesis prediction = Double foresight
 * - Mnemosyne Weave: Nemesis can enter your shards and fight your past self
 * - Dimensional Collapse: You AND Nemesis can collapse simultaneously
 * - Causal Entanglement: Link yourself to Nemesis for mutual damage (risky!)
 * - Timeline Chronicle: Every Nemesis death is recorded as a "Shadow Defeat"
 * 
 * Color: Inverted Player Cyan — Crimson Core (#ff0040) with Cyan accents
 *        Represents "you, but wrong"
 * 
 * === THE FINAL ENCOUNTER ===
 * 
 * Generation 10 Nemesis unlocks "Ouroboros Protocol" — you and the Nemesis
 * merge into a single entity fighting together against endless waves.
 * The ultimate synthesis of self-mastery.
 */

export default class NemesisGenesisSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== BEHAVIORAL PROFILE =====
        this.profile = {
            movementClusters: [], // Centroids of movement patterns
            temporalPreferences: {}, // System usage frequency
            riskSignature: {
                nearMissRate: 0,
                dangerZoneDwell: 0,
                burstVsSmooth: 0.5 // 0=burst, 1=smooth
            },
            weaponDNA: {
                fireRate: 120,
                rangePreference: 400,
                spreadVsPrecision: 0.5,
                elementalPreference: 'none'
            },
            tacticalDNA: {
                cornerCampTendency: 0,
                strafePreference: 0,
                approachVsRetreat: 0.5
            }
        };
        
        // ===== NEMESIS STATE =====
        this.nemesis = null;
        this.nemesisActive = false;
        this.nemesisGeneration = 1;
        this.spawnWave = 10; // Wave 10 spawns nemesis
        
        // ===== LEARNING STATE =====
        this.observationBuffer = [];
        this.maxBufferSize = 300; // 5 seconds at 60fps
        this.lastClusterUpdate = 0;
        
        // ===== VISUALS =====
        this.nemesisGlow = null;
        this.crimsonForesightActive = false;
        this.crimsonForesightEndTime = 0;
        
        // ===== SHADOW GALLERY =====
        this.defeatedShadows = []; // Persistent across runs
        
        this.init();
    }
    
    init() {
        this.loadProfileFromChronicle();
        this.createVisuals();
    }
    
    createVisuals() {
        // Effects rendered via UnifiedGraphicsManager on 'effects' layer
    }
    
    // ===== BEHAVIORAL PROFILING =====
    
    observePlayer(dt) {
        const player = this.scene.player;
        
        // Capture movement vector
        const movement = {
            vx: player.body.velocity.x,
            vy: player.body.velocity.y,
            speed: Math.sqrt(
                player.body.velocity.x ** 2 + 
                player.body.velocity.y ** 2
            ),
            x: player.x,
            y: player.y,
            timestamp: this.scene.time.now
        };
        
        // Add to buffer
        this.observationBuffer.push(movement);
        if (this.observationBuffer.length > this.maxBufferSize) {
            this.observationBuffer.shift();
        }
        
        // Update clusters every 5 seconds
        if (this.scene.time.now - this.lastClusterUpdate > 5000) {
            this.updateMovementClusters();
            this.lastClusterUpdate = this.scene.time.now;
        }
    }
    
    updateMovementClusters() {
        if (this.observationBuffer.length < 60) return;
        
        // Simple k-means clustering on movement vectors
        const vectors = this.observationBuffer.map(m => ({
            vx: m.vx / (m.speed || 1),
            vy: m.vy / (m.speed || 1),
            speed: m.speed
        }));
        
        // Find dominant patterns (simplified clustering)
        const patterns = {
            strafe: 0,      // High horizontal velocity, low vertical
            advance: 0,     // Moving toward enemies
            retreat: 0,     // Moving away from enemies
            circle: 0,      // Perpendicular to enemy direction
            still: 0        // Low velocity
        };
        
        vectors.forEach(v => {
            if (v.speed < 10) patterns.still++;
            else if (Math.abs(v.vx) > 0.7) patterns.strafe++;
            else if (v.vy < -0.5) patterns.retreat++;
            else if (v.vy > 0.5) patterns.advance++;
            else patterns.circle++;
        });
        
        // Normalize to frequencies
        const total = vectors.length;
        this.profile.tacticalDNA.strafePreference = patterns.strafe / total;
        this.profile.tacticalDNA.cornerCampTendency = patterns.still / total;
        this.profile.tacticalDNA.approachVsRetreat = patterns.advance / 
            (patterns.advance + patterns.retreat || 1);
    }
    
    recordSystemUsage(systemName) {
        if (!this.profile.temporalPreferences[systemName]) {
            this.profile.temporalPreferences[systemName] = 0;
        }
        this.profile.temporalPreferences[systemName]++;
    }
    
    recordNearMiss() {
        this.profile.riskSignature.nearMissRate++;
    }
    
    recordWeaponConfig(weaponStats) {
        // Blend current config into DNA
        this.profile.weaponDNA.fireRate = 
            (this.profile.weaponDNA.fireRate * 0.9) + (weaponStats.fireRate * 0.1);
        this.profile.weaponDNA.spreadVsPrecision = 
            weaponStats.spread ? 0.8 : 0.2;
    }
    
    // ===== NEMESIS GENERATION =====
    
    shouldSpawnNemesis(wave) {
        return wave >= this.spawnWave && !this.nemesisActive && !this.nemesis;
    }
    
    spawnNemesis() {
        this.nemesisActive = true;
        
        // Calculate nemesis position (opposite side from player)
        const player = this.scene.player;
        const worldWidth = 1920;
        const worldHeight = 1440;
        
        const nemesisX = worldWidth - player.x;
        const nemesisY = worldHeight - player.y;
        
        // Create nemesis entity
        this.nemesis = this.createNemesisEntity(nemesisX, nemesisY);
        
        // Announce
        this.announceNemesis();
        
        // Start behavioral mirroring
        this.startMirroring();
        
        // Record in chronicle
        if (this.scene.timelineChronicle) {
            this.scene.timelineChronicle.recordNemesisEncounter(
                this.nemesisGeneration, 
                this.profile
            );
        }
    }
    
    /**
     * Start behavioral mirroring - nemesis begins copying player patterns
     */
    startMirroring() {
        const state = this.nemesis.nemesisState;
        
        // Initialize mirroring state
        state.mirroringActive = true;
        state.mirrorBuffer = []; // Track recent player positions
        state.mirrorDelay = 500; // 500ms delay (reaction time)
        state.mirrorAccuracy = 0.3; // Starts at 30% accuracy, increases with adaptation
        
        // Set up observation of player movement patterns
        this.mirrorEvent = this.scene.time.addEvent({
            delay: 100, // Sample every 100ms
            callback: () => {
                if (!this.nemesis || !this.scene.player) return;
                
                const player = this.scene.player;
                
                // Record player position and velocity
                this.observationBuffer.push({
                    x: player.x,
                    y: player.y,
                    vx: player.body?.velocity.x || 0,
                    vy: player.body?.velocity.y || 0,
                    timestamp: this.scene.time.now
                });
                
                // Keep buffer at manageable size
                if (this.observationBuffer.length > 100) {
                    this.observationBuffer.shift();
                }
                
                // Update mirror accuracy based on adaptation
                state.mirrorAccuracy = Math.min(0.95, 0.3 + state.adaptationLevel * 0.65);
            },
            callbackScope: this,
            loop: true
        });
        
        console.log('[NemesisGenesis] Behavioral mirroring activated');
    }
    
    /**
     * Stop behavioral mirroring and cleanup
     */
    stopMirroring() {
        if (this.mirrorEvent) {
            this.mirrorEvent.remove();
            this.mirrorEvent = null;
        }
        
        if (this.nemesis?.nemesisState) {
            this.nemesis.nemesisState.mirroringActive = false;
        }
        
        console.log('[NemesisGenesis] Behavioral mirroring deactivated');
    }
    
    createNemesisEntity(x, y) {
        // Nemesis visual: Inverted player — cyan core with crimson outline
        const container = this.scene.add.container(x, y);
        
        // Core (player color but inverted)
        const core = this.scene.add.triangle(
            0, 0,
            0, -20,
            15, 15,
            -15, 15,
            0x00f0ff // Cyan core
        );
        
        // Crimson aura (the "corruption")
        const aura = this.scene.add.circle(0, 0, 25, 0xff0040, 0.3);
        
        // Add pulsing animation
        this.scene.tweens.add({
            targets: aura,
            scale: { from: 1, to: 1.3 },
            alpha: { from: 0.3, to: 0.1 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        container.add([aura, core]);
        
        // Physics body
        this.scene.physics.add.existing(container);
        container.body.setCircle(20);
        container.body.setCollideWorldBounds(true);
        
        // Nemesis AI state
        container.nemesisState = {
            health: 2000 * this.nemesisGeneration,
            maxHealth: 2000 * this.nemesisGeneration,
            lastFireTime: 0,
            fireRate: this.profile.weaponDNA.fireRate,
            currentPattern: 'neutral',
            patternTimer: 0,
            adaptationLevel: 0,
            temporalAbilities: this.selectTemporalAbilities(),
            shieldActive: false,
            shieldCooldown: 0
        };
        
        // Add to physics group for collisions
        if (!this.scene.nemesisGroup) {
            this.scene.nemesisGroup = this.scene.physics.add.group();
        }
        this.scene.nemesisGroup.add(container);
        
        return container;
    }
    
    selectTemporalAbilities() {
        // Select top 3 systems player uses most
        const preferences = Object.entries(this.profile.temporalPreferences)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name]) => name);
        
        // Map to nemesis abilities
        const abilityMap = {
            'ECHO_STORM': 'VOID_ECHOES',
            'FRACTURE': 'SHADOW_CLONES',
            'PARADOX': 'CRIMSON_FORESIGHT',
            'RESIDUE': 'TACTICAL_MINES',
            'SINGULARITY': 'ENTROPY_WELLS',
            'BULLET_TIME': 'TIME_WARP',
            'RESONANCE': 'CHAOS_CHAIN',
            'CHRONO_LOOP': 'ECHO_NEXUS'
        };
        
        return preferences.map(p => abilityMap[p] || 'VOID_ECHOES');
    }
    
    announceNemesis() {
        const archetype = this.determineArchetype();
        const name = `NEMESIS-${archetype}-GEN${this.nemesisGeneration}`;
        
        // Dramatic announcement
        const announcement = this.scene.add.text(
            this.scene.cameras.main.scrollX + this.scene.cameras.main.width / 2,
            this.scene.cameras.main.scrollY + this.scene.cameras.main.height / 2,
            `${name}\nTHE MIRROR AWAKENS`,
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#ff0040',
                align: 'center',
                stroke: '#00f0ff',
                strokeThickness: 2
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        // Screen effects
        this.scene.cameras.main.shake(1000, 0.02);
        this.scene.cameras.main.flash(500, 255, 0, 64, 0.5);
        
        // Fade out announcement
        this.scene.tweens.add({
            targets: announcement,
            alpha: 0,
            scale: 1.5,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => announcement.destroy()
        });
        
        // Add nemesis health bar to HUD
        this.createNemesisHUD();
    }
    
    determineArchetype() {
        const dna = this.profile.tacticalDNA;
        
        if (dna.cornerCampTendency > 0.4) return 'SENTINEL';
        if (dna.strafePreference > 0.5) return 'DANCER';
        if (dna.approachVsRetreat > 0.6) return 'BERSERKER';
        if (dna.approachVsRetreat < 0.4) return 'SNIPER';
        return 'ADAPTIVE';
    }
    
    createNemesisHUD() {
        const camera = this.scene.cameras.main;
        // Nemesis health bar - registered with panel-based HUD system
        this.scene.hudPanels.registerSlot('NEMESIS', (container, width) => {
            const barWidth = Math.min(200, width - 20);
            const barHeight = 10;
            
            this.nemesisHealthBg = this.scene.add.rectangle(0, 8, barWidth, barHeight, 0x330011);
            container.add(this.nemesisHealthBg);
            
            this.nemesisHealthBar = this.scene.add.rectangle(-barWidth/2, 8, barWidth, barHeight, 0xff0040);
            this.nemesisHealthBar.setOrigin(0, 0.5);
            container.add(this.nemesisHealthBar);
            
            this.nemesisNameText = this.scene.add.text(
                0, -5,
                `NEMESIS-GEN${this.nemesisGeneration}`,
                {
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fill: '#ff0040'
                }
            ).setOrigin(0.5);
            container.add(this.nemesisNameText);
        }, 'TOP_CENTER');
    }
    
    // ===== NEMESIS AI =====
    
    updateNemesis(dt) {
        if (!this.nemesis || !this.nemesisActive) return;
        
        const state = this.nemesis.nemesisState;
        const player = this.scene.player;
        
        // Update pattern based on player behavior
        this.updateNemesisPattern(dt);
        
        // Execute current pattern
        this.executeNemesisPattern(dt);
        
        // Fire at player using player's own timing
        this.updateNemesisFire(dt);
        
        // Use temporal abilities
        this.updateTemporalAbilities(dt);
        
        // Update health bar
        this.updateNemesisHUD();
        
        // Check death
        if (state.health <= 0) {
            this.defeatNemesis();
        }
    }
    
    updateNemesisPattern(dt) {
        const state = this.nemesis.nemesisState;
        state.patternTimer -= dt;
        
        if (state.patternTimer <= 0) {
            // Select new pattern based on player archetype
            const patterns = this.getPatternForArchetype();
            state.currentPattern = Phaser.Utils.Array.GetRandom(patterns);
            state.patternTimer = 3 + Math.random() * 4; // 3-7 seconds
            
            // Telegraph pattern change
            this.telegraphPattern(state.currentPattern);
        }
        
        // Adapt to player in real-time
        this.adaptToPlayer(dt);
    }
    
    getPatternForArchetype() {
        const archetype = this.determineArchetype();
        
        const patterns = {
            'SENTINEL': ['hold_position', 'shield_burst', 'mine_field'],
            'DANCER': ['circle_strafe', 'mirror_move', 'bullet_dance'],
            'BERSERKER': ['charge_player', 'reckless_fire', 'temporal_rush'],
            'SNIPER': ['maintain_distance', 'precision_shot', 'prediction_fire'],
            'ADAPTIVE': ['mirror_player', 'counter_pattern', 'random_burst']
        };
        
        return patterns[archetype] || patterns['ADAPTIVE'];
    }
    
    executeNemesisPattern(dt) {
        const nemesis = this.nemesis;
        const player = this.scene.player;
        const state = nemesis.nemesisState;
        
        const speed = 150;
        const angleToPlayer = Phaser.Math.Angle.Between(
            nemesis.x, nemesis.y, player.x, player.y
        );
        const distToPlayer = Phaser.Math.Distance.Between(
            nemesis.x, nemesis.y, player.x, player.y
        );
        
        switch (state.currentPattern) {
            case 'hold_position':
                // Stay still, fire frequently
                nemesis.body.setVelocity(0, 0);
                state.fireRate = 80; // Fast fire
                break;
                
            case 'circle_strafe':
                // Circle around player
                const strafeAngle = angleToPlayer + Math.PI / 2;
                nemesis.body.setVelocity(
                    Math.cos(strafeAngle) * speed,
                    Math.sin(strafeAngle) * speed
                );
                break;
                
            case 'charge_player':
                // Move directly toward player
                if (distToPlayer > 150) {
                    nemesis.body.setVelocity(
                        Math.cos(angleToPlayer) * speed * 1.5,
                        Math.sin(angleToPlayer) * speed * 1.5
                    );
                }
                break;
                
            case 'maintain_distance':
                // Stay at optimal range (player's preferred range)
                const optimalRange = this.profile.weaponDNA.rangePreference;
                if (distToPlayer < optimalRange - 50) {
                    // Back up
                    nemesis.body.setVelocity(
                        -Math.cos(angleToPlayer) * speed,
                        -Math.sin(angleToPlayer) * speed
                    );
                } else if (distToPlayer > optimalRange + 50) {
                    // Approach
                    nemesis.body.setVelocity(
                        Math.cos(angleToPlayer) * speed,
                        Math.sin(angleToPlayer) * speed
                    );
                }
                break;
                
            case 'mirror_player':
                // Mirror player's position relative to center
                const worldWidth = 1920;
                const worldHeight = 1440;
                const targetX = worldWidth - player.x;
                const targetY = worldHeight - player.y;
                const angleToMirror = Phaser.Math.Angle.Between(
                    nemesis.x, nemesis.y, targetX, targetY
                );
                nemesis.body.setVelocity(
                    Math.cos(angleToMirror) * speed,
                    Math.sin(angleToMirror) * speed
                );
                break;
                
            default:
                // Default: approach and circle
                nemesis.body.setVelocity(
                    Math.cos(angleToPlayer) * speed * 0.7,
                    Math.sin(angleToPlayer) * speed * 0.7
                );
        }
    }
    
    adaptToPlayer(dt) {
        const state = this.nemesis.nemesisState;
        
        // Learn player's current dodging pattern
        const player = this.scene.player;
        if (this.observationBuffer.length > 10) {
            const recent = this.observationBuffer.slice(-10);
            const avgVX = recent.reduce((s, m) => s + m.vx, 0) / recent.length;
            const avgVY = recent.reduce((s, m) => s + m.vy, 0) / recent.length;
            
            // If player consistently moves in a direction, lead shots
            state.leadFactor = Math.min(1, state.adaptationLevel + dt * 0.1);
            state.leadX = avgVX * state.leadFactor * 0.5;
            state.leadY = avgVY * state.leadFactor * 0.5;
        }
        
        // Increase adaptation over time
        state.adaptationLevel = Math.min(1, state.adaptationLevel + dt * 0.02);
    }
    
    updateNemesisFire(dt) {
        const state = this.nemesis.nemesisState;
        const now = this.scene.time.now;
        
        if (now - state.lastFireTime > state.fireRate) {
            state.lastFireTime = now;
            
            // Fire at player (with leading based on adaptation)
            const player = this.scene.player;
            let targetX = player.x + (state.leadX || 0);
            let targetY = player.y + (state.leadY || 0);
            
            const angle = Phaser.Math.Angle.Between(
                this.nemesis.x, this.nemesis.y, targetX, targetY
            );
            
            // Apply spread based on weapon DNA
            const spread = (1 - this.profile.weaponDNA.spreadVsPrecision) * 0.3;
            const finalAngle = angle + (Math.random() - 0.5) * spread;
            
            // Spawn nemesis bullet
            this.spawnNemesisBullet(finalAngle);
        }
    }
    
    spawnNemesisBullet(angle) {
        // Use enemy bullet pool but with cyan color (inverted player)
        const bullet = this.scene.spawnEnemyBullet(
            this.nemesis.x, this.nemesis.y, angle, 280
        );
        
        if (bullet) {
            bullet.setTint(0x00f0ff); // Cyan (player color)
            bullet.isNemesisBullet = true;
            
            // Apply player's preferred bullet behavior
            if (this.profile.weaponDNA.spreadVsPrecision > 0.7) {
                bullet.isHoming = true; // Precision = homing
            }
        }
    }
    
    updateTemporalAbilities(dt) {
        const state = this.nemesis.nemesisState;
        
        // Randomly use abilities based on adaptation level
        if (Math.random() < state.adaptationLevel * 0.3 * dt) {
            const ability = Phaser.Utils.Array.GetRandom(state.temporalAbilities);
            this.useTemporalAbility(ability);
        }
    }
    
    useTemporalAbility(ability) {
        switch (ability) {
            case 'VOID_ECHOES':
                this.useVoidEchoes();
                break;
            case 'SHADOW_CLONES':
                this.useShadowClones();
                break;
            case 'CRIMSON_FORESIGHT':
                this.useCrimsonForesight();
                break;
            case 'TACTICAL_MINES':
                this.useTacticalMines();
                break;
            case 'ENTROPY_WELLS':
                this.useEntropyWells();
                break;
        }
    }
    
    useVoidEchoes() {
        // Bullets fired will echo after 1 second
        const announcement = this.scene.add.text(
            this.nemesis.x, this.nemesis.y - 40,
            'VOID ECHOES',
            { fontFamily: 'monospace', fontSize: '14px', fill: '#ff0040' }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: announcement,
            y: announcement.y - 30,
            alpha: 0,
            duration: 1500,
            onComplete: () => announcement.destroy()
        });
        
        // Mark next bullets as void echoes
        this.nemesis.nemesisState.voidEchoActive = true;
        this.scene.time.delayedCall(3000, () => {
            if (this.nemesis) {
                this.nemesis.nemesisState.voidEchoActive = false;
            }
        });
    }
    
    useShadowClones() {
        // Create 2 shadow clones that mirror nemesis
        const announcement = this.scene.add.text(
            this.nemesis.x, this.nemesis.y - 40,
            'SHADOW CLONES',
            { fontFamily: 'monospace', fontSize: '14px', fill: '#ff0040' }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: announcement,
            alpha: 0,
            duration: 2000,
            onComplete: () => announcement.destroy()
        });
        
        // Spawn clones (simplified - would spawn actual entities)
        for (let i = 0; i < 2; i++) {
            const offset = (i === 0) ? -60 : 60;
            const clone = this.scene.add.circle(
                this.nemesis.x + offset, this.nemesis.y,
                15, 0xff0040, 0.5
            );
            
            this.scene.tweens.add({
                targets: clone,
                alpha: 0,
                scale: 0,
                duration: 4000,
                onComplete: () => clone.destroy()
            });
        }
    }
    
    useCrimsonForesight() {
        // Show prediction lines for where player WILL be
        // Activate the effect for 1 second (rendered via UnifiedGraphicsManager)
        this.crimsonForesightActive = true;
        this.crimsonForesightEndTime = this.scene.time.now + 1000;
    }
    
    /**
     * Render crimson foresight prediction lines via UnifiedGraphicsManager
     * Called from update() each frame when effect is active
     */
    renderCrimsonForesight() {
        const graphicsManager = this.scene.graphicsManager;
        if (!graphicsManager || !this.nemesis) return;
        
        const player = this.scene.player;
        const targetX = player.x + (this.nemesis.nemesisState.leadX || 0) * 3;
        const targetY = player.y + (this.nemesis.nemesisState.leadY || 0) * 3;
        
        // Draw prediction line on 'effects' layer
        graphicsManager.drawLine('effects', this.nemesis.x, this.nemesis.y, targetX, targetY, 0xff0040, 0.5, 2);
    }
    
    useTacticalMines() {
        // Place mines where player is likely to go
        const player = this.scene.player;
        const mineX = player.x + player.body.velocity.x * 0.5;
        const mineY = player.y + player.body.velocity.y * 0.5;
        
        const mine = this.scene.add.circle(mineX, mineY, 20, 0xff0040, 0.6);
        
        // Explode after delay
        this.scene.time.delayedCall(2000, () => {
            if (mine.active) {
                // Check collision with player
                const dist = Phaser.Math.Distance.Between(
                    mine.x, mine.y, player.x, player.y
                );
                if (dist < 40) {
                    player.takeDamage(20);
                }
                
                // Visual explosion
                this.scene.cameras.main.shake(200, 0.01);
                mine.destroy();
            }
        });
    }
    
    useEntropyWells() {
        // Create anti-singularity that repels player bullets
        const well = this.scene.add.circle(
            this.nemesis.x, this.nemesis.y,
            100, 0x440011, 0.4
        );
        
        // Repel nearby player bullets
        this.scene.bullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            const dist = Phaser.Math.Distance.Between(
                well.x, well.y, bullet.x, bullet.y
            );
            if (dist < 150) {
                const angle = Phaser.Math.Angle.Between(
                    well.x, well.y, bullet.x, bullet.y
                );
                bullet.body.velocity.x += Math.cos(angle) * 100;
                bullet.body.velocity.y += Math.sin(angle) * 100;
            }
        });
        
        // Fade out
        this.scene.tweens.add({
            targets: well,
            alpha: 0,
            scale: 1.5,
            duration: 3000,
            onComplete: () => well.destroy()
        });
    }
    
    telegraphPattern(pattern) {
        const text = pattern.replace('_', ' ').toUpperCase();
        const warning = this.scene.add.text(
            this.nemesis.x, this.nemesis.y - 60,
            text,
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fontStyle: 'bold',
                fill: '#ff0040'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: warning,
            y: warning.y - 20,
            alpha: 0,
            duration: 1500,
            onComplete: () => warning.destroy()
        });
    }
    
    // ===== COMBAT =====
    
    hitNemesis(bullet) {
        if (!this.nemesis || !this.nemesisActive) return false;
        
        const state = this.nemesis.nemesisState;
        
        // Check if shield is active
        if (state.shieldActive) {
            // Shield absorbs hit
            state.shieldActive = false;
            this.showShieldBreak();
            return false; // No damage
        }
        
        // Apply damage
        const damage = bullet.damage || 34;
        state.health -= damage;
        
        // Visual feedback
        this.flashNemesis();
        
        // Spawn hit particles
        this.scene.hitParticles.emitParticleAt(bullet.x, bullet.y);
        
        return true;
    }
    
    showShieldBreak() {
        const shield = this.scene.add.circle(
            this.nemesis.x, this.nemesis.y, 30, 0x00f0ff, 0.8
        );
        
        this.scene.tweens.add({
            targets: shield,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => shield.destroy()
        });
    }
    
    flashNemesis() {
        this.nemesis.list.forEach(child => {
            if (child.setTint) {
                const originalTint = child.tintTopLeft;
                child.setTint(0xffffff);
                this.scene.time.delayedCall(100, () => {
                    if (child.active) child.setTint(originalTint);
                });
            }
        });
    }
    
    updateNemesisHUD() {
        if (!this.nemesis || !this.nemesisHealthBar) return;
        
        const state = this.nemesis.nemesisState;
        const healthPercent = state.health / state.maxHealth;
        const barWidth = 200 * healthPercent;
        
        this.nemesisHealthBar.width = Math.max(0, barWidth);
    }
    
    defeatNemesis() {
        this.nemesisActive = false;
        
        // Death explosion
        this.scene.deathParticles.emitParticleAt(this.nemesis.x, this.nemesis.y);
        this.scene.cameras.main.shake(1000, 0.05);
        this.scene.cameras.main.flash(500, 255, 0, 64);
        
        // Victory text
        const victory = this.scene.add.text(
            this.nemesis.x, this.nemesis.y,
            'NEMESIS DEFEATED',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#00f0ff'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: victory,
            y: victory.y - 50,
            alpha: 0,
            duration: 4000,
            onComplete: () => victory.destroy()
        });
        
        // Store shadow
        this.defeatedShadows.push({
            generation: this.nemesisGeneration,
            archetype: this.determineArchetype(),
            timestamp: Date.now(),
            profile: JSON.parse(JSON.stringify(this.profile))
        });
        
        // Increment generation for next time
        this.nemesisGeneration++;
        
        // Award score
        this.scene.score += 10000 * this.nemesisGeneration;
        
        // Cleanup
        this.nemesis.destroy();
        this.nemesis = null;
        
        // Remove HUD
        if (this.nemesisHealthBg) this.nemesisHealthBg.destroy();
        if (this.nemesisHealthBar) this.nemesisHealthBar.destroy();
        if (this.nemesisNameText) this.nemesisNameText.destroy();
        
        // Save profile
        this.saveProfileToChronicle();
        
        // Trigger Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('NEMESIS_DEFEAT');
        }
    }
    
    // ===== PERSISTENCE =====
    
    loadProfileFromChronicle() {
        // In a real implementation, this would load from localStorage
        // via TimelineChronicle
        const saved = localStorage.getItem('nemesis_profile');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.profile = { ...this.profile, ...data.profile };
                this.nemesisGeneration = data.generation || 1;
                this.defeatedShadows = data.shadows || [];
            } catch (e) {
                console.warn('Failed to load nemesis profile');
            }
        }
    }
    
    saveProfileToChronicle() {
        const data = {
            profile: this.profile,
            generation: this.nemesisGeneration,
            shadows: this.defeatedShadows,
            lastUpdated: Date.now()
        };
        localStorage.setItem('nemesis_profile', JSON.stringify(data));
    }
    
    // ===== MAIN UPDATE =====
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;
        
        // Always observe player
        this.observePlayer(dt);
        
        // Update nemesis if active
        this.updateNemesis(dt);
        
        // Check for spawn condition
        if (this.shouldSpawnNemesis(this.scene.wave)) {
            this.spawnNemesis();
        }
        
        // Render crimson foresight effect via UnifiedGraphicsManager
        if (this.crimsonForesightActive) {
            if (this.scene.time.now > this.crimsonForesightEndTime) {
                this.crimsonForesightActive = false;
            } else {
                this.renderCrimsonForesight();
            }
        }
    }
    
    // ===== COLLISION HELPERS =====
    
    checkNemesisCollision(x, y, radius) {
        if (!this.nemesis || !this.nemesisActive) return false;
        
        const dist = Phaser.Math.Distance.Between(
            this.nemesis.x, this.nemesis.y, x, y
        );
        
        return dist < (20 + radius);
    }
    
    destroy() {
        if (this.nemesis) {
            this.nemesis.destroy();
            this.nemesis = null;
        }
        if (this.nemesisHealthBg) this.nemesisHealthBg.destroy();
        if (this.nemesisHealthBar) this.nemesisHealthBar.destroy();
        if (this.nemesisNameText) this.nemesisNameText.destroy();
        
        this.saveProfileToChronicle();
    }
}
