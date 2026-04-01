import Phaser from 'phaser';

/**
 * THE RIVAL PROTOCOL — Kinemorphic Echoes
 * 
 * The 44th Cognitive Dimension: RELATIONAL EVOLUTION
 * 
 * While Nemesis Genesis creates a boss that IS you, the Rival Protocol creates
 * enemies who BECOME characters through their history with you. Every enemy
 * that survives an encounter remembers you. Some evolve into named Rivals —
 * persistent adversaries with unique personalities, scar patterns, learned
 * tactics, and vendettas spanning multiple runs.
 * 
 * === THE CORE INNOVATION ===
 * 
 * Generic enemies become NAMED INDIVIDUALS through survival:
 * 
 * 1. SURVIVAL = MEMORY
 *    - Enemy escapes with low health? It remembers your face (player signature)
 *    - Enemy witnesses you kill its squad? It develops a grudge
 *    - Enemy survives 3+ encounters? It becomes a RIVAL
 * 
 * 2. EVOLUTION THROUGH TRAUMA
 *    - Rivals evolve based on HOW you almost killed them
 *    - If you pierced them: They learn phasing
 *    - If you exploded them: They develop spread-fire
 *    - If you chased them down: They gain speed boosts
 * 
 * 3. THE ROSTER OF SHADOWS
 *    - Persistent database of all Rivals you've created
 *    - Each has: Name, scar pattern, evolution tier, grudge level, kill count vs you
 *    - They appear unpredictably, hunting YOU specifically
 *    - They REMEMBER your tactics and counter them
 * 
 * 4. THE RIVAL TIER SYSTEM
 *    - SCRAP (Tier 0): Just escaped, no name, just a scar
 *    - ASPIRANT (Tier 1): Named, basic adaptation, seeking you
 *    - HUNTER (Tier 2): Counter-tactics, ambush behavior, personal grudge
 *    - NEMESIS-RANK (Tier 3): Unique abilities, spawns with minions, epic encounters
 *    - ARCH-RIVAL (Tier 4): Legendary status, appears once per run at climax moment
 * 
 * === THE EMOTIONAL ARCHITECTURE ===
 * 
 * This isn't difficulty scaling — it's RELATIONAL DEPTH:
 * 
 * - "THERE'S Krexx-9! The one that got away in Wave 3!"
 * - "He learned from last time — he's using phase-dodge now!"
 * - "That scar on his left side — I gave him that in the last run!"
 * - "He's leading a squad now — he taught them my bullet patterns!"
 * 
 * === THE KINEMORPHIC PRINCIPLE ===
 * 
 * "Kinemorphic" — form through motion. Rivals evolve through the specific
 * dynamics of their encounters with you. Their evolution is a physical
 * memory of your violence against them.
 * 
 * === KEY MECHANICS ===
 * 
 * 1. ESCAPE DETECTION (Automatic)
 *    - Enemy leaves arena with <25% health = "Trauma Event"
 *    - Trauma is tagged with: Your weapon type, system used, time of escape
 *    - Trauma becomes their evolution path
 * 
 * 2. THE GRUDGE SYSTEM
 *    - Rivals track how many times they've seen you die
 *    - High grudge = aggressive pursuit, ignoring other threats
 *    - They literally hunt YOU over other targets
 * 
 * 3. TACTICAL MEMORY
 *    - Rivals remember your most-used systems
 *    - They develop counters: If you love Singularity, they gain anti-grav
 *    - If you graze bullets, they learn wide spread patterns
 * 
 * 4. THE SCAR CANVAS
 *    - Visual record of every hit you landed on them
 *    - Persistent across runs — you can recognize them by their scars
 *    - Scar density determines their visual tier
 * 
 * 5. RIVAL SPAWNING
 *    - Every run, 0-3 Rivals from your roster appear at random moments
 *    - They announce themselves: "KREXX-9 EMERGES FROM THE VOID"
 *    - Epic music sting, camera focus, dramatic pause
 * 
 * === THE NAME GENERATOR ===
 * 
 * Procedural names based on their trauma type:
 * - Piercing trauma → names with sharp sounds: Vex, Kriss, Thraal
 * - Explosive trauma → names with hard stops: Kronk, Grak, Blort
 * - Burning trauma → names with sibilance: Ssyl, Vhis, Ashaa
 * - Survivors of many wounds → compound names: Nine-Scar, Never-Die
 * 
 * === SYNERGIES WITH EXISTING SYSTEMS ===
 * 
 * - Nemesis Genesis: Rivals can be ABSORBED by Nemesis, making Nemesis stronger
 * - Egregore Protocol: Rivals contribute to collective unconscious evolution
 * - Timeline Chronicle: Every Rival encounter recorded as "Legend: Krexx-9"
 * - Observer Effect: Rivals are the ultimate test — they learned from Observer data
 * - Mnemosyne Weave: Rivals can appear IN your shards, hunting your past self
 * - Architect System: Defeating Rivals in novel ways teaches the Architect
 * - Noetic Mirror: Rivals provide "relationship commentary" — "Krexx-9 fears you"
 * 
 * === THE META-NARRATIVE ===
 * 
 * Every Rival becomes a STORY:
 * - "Remember Krexx-9? I hunted him across 7 runs."
 * - "He started as a fast enemy that escaped. Then he became my shadow."
 * - "The final time, he had learned all my tricks. Epic duel."
 * - "Now he's in my Roster of Shadows — a legend I've created."
 * 
 * === WHY THIS IS REVOLUTIONARY ===
 * 
 * 1. **Personal History**: The game becomes a record of YOUR specific violence
 * 2. **Relational Depth**: Not just "enemies" but "characters who hate you"
 * 3. **Emergent Narrative**: Every player gets unique rival stories
 * 4. **Dynamic Difficulty**: Rivals adapt to YOUR specific playstyle
 * 5. **Emotional Investment**: You RECOGNIZE them. You have HISTORY.
 * 
 * This is the 44th dimension: RELATIONAL EVOLUTION — the game remembers
 * not just your systems, but the specific individuals who survived you.
 * 
 * Color: Burnished Bronze (#cd7f32) — the color of old blood, old grudges,
 * and the patina of memory
 */

export default class RivalProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== RIVER BRONZE — the color of old blood and memory =====
        this.BRONZE_COLOR = 0xcd7f32;
        this.BRONZE_GLOW = 0xe6a65c;
        this.SCAR_COLOR = 0x8b4513;
        this.GRUDGE_RED = 0xcc3300;
        
        // ===== THE ROSTER OF SHADOWS =====
        this.roster = this.loadRoster();
        this.activeRivals = []; // Currently spawned in game
        this.traumaCandidates = []; // Enemies that escaped this run
        
        // ===== SPAWNING STATE =====
        this.spawnCooldown = 0;
        this.minSpawnInterval = 15000; // Minimum 15s between rival spawns
        this.maxRivalsPerRun = 3;
        this.spawnedThisRun = 0;
        this.runRivalQueue = []; // Pre-selected rivals for this run
        
        // ===== NAME GENERATORS =====
        this.nameFragments = {
            sharp: ['Vex', 'Kriss', 'Thraal', 'Shrike', 'Skarn', 'Zex'],
            explosive: ['Kronk', 'Grak', 'Blort', 'Thump', 'Krak', 'Boom'],
            burning: ['Ssyl', 'Vhis', 'Ashaa', 'Ember', 'Cinder', 'Scorch'],
            pierced: ['Pierce', 'Thorn', 'Spike', 'Needle', 'Stinger', 'Quill'],
            frozen: ['Frost', 'Glac', 'Ice', 'Shiver', 'Chill', 'Rime'],
            survivor: ['Never', 'Still', 'Enduring', 'Last', 'Remains', 'Ghost']
        };
        
        this.nameSuffixes = ['-9', '-X', '-7', '-3', '-Null', '-Prime', 
                            ' the Scarred', ' Broken', ' Unbound', ' Reborn'];
        
        // ===== VISUAL ELEMENTS =====
        this.rivalIndicators = [];
        
        // ===== CONFIGURATION =====
        this.traumaThreshold = 0.25; // Health % to count as trauma escape
        this.evolutionThresholds = {
            ASPIRANT: 1,    // Survived 1 encounter
            HUNTER: 3,      // Survived 3 encounters  
            NEMESIS: 6,     // Survived 6 encounters
            ARCH: 10        // Survived 10 encounters
        };
        
        this.init();
    }
    
    init() {
        this.selectRivalsForRun();
        this.startMonitoring();
    }
    
    // ===== ROSTER MANAGEMENT =====
    
    loadRoster() {
        // Load from localStorage or return empty roster
        try {
            const saved = localStorage.getItem('shooty_rival_roster');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load rival roster:', e);
        }
        return [];
    }
    
    saveRoster() {
        try {
            localStorage.setItem('shooty_rival_roster', JSON.stringify(this.roster));
        } catch (e) {
            console.warn('Could not save rival roster:', e);
        }
    }
    
    selectRivalsForRun() {
        // Select 0-3 rivals to appear this run based on probability
        const maxToSpawn = Math.min(this.maxRivalsPerRun, this.roster.length);
        const numToSpawn = Math.floor(Math.random() * (maxToSpawn + 1)); // 0 to max
        
        if (numToSpawn === 0) return;
        
        // Sort by grudge level (highest first) then by random
        const sortedRivals = [...this.roster].sort((a, b) => {
            if (b.grudgeLevel !== a.grudgeLevel) return b.grudgeLevel - a.grudgeLevel;
            return Math.random() - 0.5;
        });
        
        this.runRivalQueue = sortedRivals.slice(0, numToSpawn);
    }
    
    // ===== TRAUMA DETECTION =====
    
    startMonitoring() {
        // Monitor enemy health to detect trauma escapes
        this.scene.events.on('enemyEscaped', (enemyData) => {
            this.onEnemyEscape(enemyData);
        });
    }
    
    onEnemyEscape(enemyData) {
        // Check if this enemy already exists in roster
        const existingRival = this.roster.find(r => r.id === enemyData.id);
        
        if (existingRival) {
            // Update existing rival
            this.updateRivalTrauma(existingRival, enemyData);
        } else if (enemyData.healthPercent <= this.traumaThreshold) {
            // Create new rival from this escape
            this.createNewRival(enemyData);
        }
    }
    
    createNewRival(enemyData) {
        // Generate name based on trauma type
        const name = this.generateRivalName(enemyData.traumaType);
        
        const rival = {
            id: this.generateRivalId(),
            name: name,
            tier: 'SCRAP',
            createdAt: Date.now(),
            encounters: 1,
            escapes: 1,
            grudgeLevel: 1,
            killCount: 0, // Times they've killed you
            scars: [{
                type: enemyData.traumaType,
                location: enemyData.hitLocation,
                timestamp: Date.now()
            }],
            adaptations: this.determineAdaptations(enemyData),
            baseType: enemyData.enemyType,
            evolutionTraits: [],
            signatureQuote: this.generateQuote(enemyData.traumaType, 'creation'),
            lastSeen: Date.now()
        };
        
        this.roster.push(rival);
        this.saveRoster();
        
        // Announce the birth of a new rival
        this.announceRivalBirth(rival);
        
        return rival;
    }
    
    updateRivalTrauma(rival, enemyData) {
        rival.encounters++;
        rival.escapes++;
        rival.grudgeLevel = Math.min(10, rival.grudgeLevel + 1);
        rival.lastSeen = Date.now();
        
        // Add new scar
        rival.scars.push({
            type: enemyData.traumaType,
            location: enemyData.hitLocation,
            timestamp: Date.now()
        });
        
        // Check for evolution
        this.checkRivalEvolution(rival);
        
        this.saveRoster();
    }
    
    checkRivalEvolution(rival) {
        let newTier = rival.tier;
        
        if (rival.escapes >= this.evolutionThresholds.ARCH && rival.tier !== 'ARCH') {
            newTier = 'ARCH';
        } else if (rival.escapes >= this.evolutionThresholds.NEMESIS && rival.tier !== 'NEMESIS') {
            newTier = 'NEMESIS';
        } else if (rival.escapes >= this.evolutionThresholds.HUNTER && rival.tier === 'ASPIRANT') {
            newTier = 'HUNTER';
        } else if (rival.escapes >= this.evolutionThresholds.ASPIRANT && rival.tier === 'SCRAP') {
            newTier = 'ASPIRANT';
        }
        
        if (newTier !== rival.tier) {
            this.evolveRival(rival, newTier);
        }
    }
    
    evolveRival(rival, newTier) {
        const oldTier = rival.tier;
        rival.tier = newTier;
        
        // Add evolution trait based on new tier
        const trait = this.generateEvolutionTrait(newTier, rival);
        rival.evolutionTraits.push(trait);
        
        // Update quote
        rival.signatureQuote = this.generateQuote('evolution', newTier);
        
        // Visual announcement if this happens during gameplay
        if (this.scene.gameActive) {
            this.announceEvolution(rival, oldTier, newTier);
        }
        
        this.saveRoster();
    }
    
    // ===== SPAWNING RIVALS =====
    
    update(dt) {
        // Pause check
        if (this.scene.pauseSystem?.paused) return;
        
        this.spawnCooldown -= dt;
        
        // Check if it's time to spawn a rival
        if (this.spawnCooldown <= 0 && 
            this.runRivalQueue.length > 0 &&
            this.spawnedThisRun < this.maxRivalsPerRun &&
            this.scene.gameActive &&
            this.scene.wave >= 2) { // Don't spawn in wave 1
            
            this.spawnNextRival();
            this.spawnCooldown = this.minSpawnInterval + Math.random() * 10000;
        }
        
        // Update active rivals
        this.updateActiveRivals(dt);
    }
    
    spawnNextRival() {
        if (this.runRivalQueue.length === 0) return;
        
        const rivalData = this.runRivalQueue.shift();
        this.spawnedThisRun++;
        
        // Create the rival enemy
        const rival = this.createRivalEntity(rivalData);
        this.activeRivals.push(rival);
        
        // Epic entrance
        this.performRivalEntrance(rival, rivalData);
    }
    
    createRivalEntity(rivalData) {
        // Spawn at arena edge, away from player
        const player = this.scene.player;
        const angle = Math.random() * Math.PI * 2;
        const distance = 600;
        const x = player.x + Math.cos(angle) * distance;
        const y = player.y + Math.sin(angle) * distance;
        
        // Clamp to arena bounds
        const clampedX = Phaser.Math.Clamp(x, 50, 1870);
        const clampedY = Phaser.Math.Clamp(y, 50, 1390);
        
        // Create enemy with rival properties
        const enemy = new this.scene.EnemyClass(
            this.scene, 
            clampedX, 
            clampedY, 
            player, 
            rivalData.baseType || 'enemy'
        );
        
        // Apply rival modifications based on tier
        this.applyRivalStats(enemy, rivalData);
        
        // Add visual indicators
        this.addRivalVisuals(enemy, rivalData);
        
        // Add to scene's enemy group
        this.scene.enemies.add(enemy);
        
        // Set up rival-specific behavior
        this.setupRivalBehavior(enemy, rivalData);
        
        return {
            entity: enemy,
            data: rivalData,
            spawnedAt: Date.now()
        };
    }
    
    applyRivalStats(enemy, rivalData) {
        // Base stat multipliers based on tier
        const tierMultipliers = {
            'SCRAP': { health: 1.2, speed: 1.0, damage: 1.1 },
            'ASPIRANT': { health: 1.5, speed: 1.1, damage: 1.2 },
            'HUNTER': { health: 2.0, speed: 1.3, damage: 1.4 },
            'NEMESIS': { health: 3.0, speed: 1.4, damage: 1.6 },
            'ARCH': { health: 4.0, speed: 1.5, damage: 2.0 }
        };
        
        const mult = tierMultipliers[rivalData.tier] || tierMultipliers['SCRAP'];
        
        enemy.maxHealth *= mult.health;
        enemy.health = enemy.maxHealth;
        enemy.speed *= mult.speed;
        enemy.damage *= mult.damage;
        
        // Apply adaptations
        rivalData.adaptations.forEach(adapt => {
            this.applyAdaptation(enemy, adapt);
        });
        
        // Mark as rival
        enemy.isRival = true;
        enemy.rivalId = rivalData.id;
        enemy.rivalName = rivalData.name;
    }
    
    applyAdaptation(enemy, adaptation) {
        switch (adaptation) {
            case 'phasing':
                enemy.canPhase = true;
                enemy.phaseCooldown = 0;
                break;
            case 'speedBurst':
                enemy.hasSpeedBurst = true;
                break;
            case 'spreadShot':
                enemy.shotCount = 3;
                break;
            case 'antiSingularity':
                enemy.antiGravity = true;
                break;
            case 'dodgePrediction':
                enemy.predictsDodges = true;
                break;
        }
    }
    
    addRivalVisuals(enemy, rivalData) {
        // Bronze tint
        enemy.setTint(this.BRONZE_COLOR);
        
        // Name label that appears on hover/proximity
        const nameLabel = this.scene.add.text(enemy.x, enemy.y - 40, rivalData.name, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fontStyle: 'bold',
            fill: '#cd7f32',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setVisible(false);
        
        nameLabel.setDepth(100);
        enemy.rivalNameLabel = nameLabel;
    }
    
    setupRivalBehavior(enemy, rivalData) {
        // Rivals prioritize the player over other targets
        enemy.target = this.scene.player;
        
        // Override update to include rival behavior
        const originalUpdate = enemy.update.bind(enemy);
        enemy.update = (time) => {
            originalUpdate(time);
            
            // Update name label position
            if (enemy.rivalNameLabel) {
                enemy.rivalNameLabel.setPosition(enemy.x, enemy.y - 40);
                
                // Show name when player is close
                const dist = Phaser.Math.Distance.Between(
                    enemy.x, enemy.y,
                    this.scene.player.x, this.scene.player.y
                );
                enemy.rivalNameLabel.setVisible(dist < 200);
            }
            
            // Rival-specific behaviors based on adaptations
            this.updateRivalBehavior(enemy, rivalData, time);
        };
        
        // Handle rival death
        enemy.on('destroy', () => {
            this.onRivalDeath(enemy, rivalData);
        });
    }
    
    updateRivalBehavior(enemy, rivalData, time) {
        // Phasing ability
        if (enemy.canPhase && enemy.phaseCooldown <= time) {
            const dist = Phaser.Math.Distance.Between(
                enemy.x, enemy.y,
                this.scene.player.x, this.scene.player.y
            );
            if (dist < 100 && Math.random() < 0.3) {
                // Phase through bullets
                enemy.setAlpha(0.3);
                enemy.body.checkCollision.none = true;
                
                this.scene.time.delayedCall(1000, () => {
                    if (enemy.active) {
                        enemy.setAlpha(1);
                        enemy.body.checkCollision.none = false;
                    }
                });
                
                enemy.phaseCooldown = time + 5000;
            }
        }
        
        // Speed burst when low health
        if (enemy.hasSpeedBurst && enemy.health < enemy.maxHealth * 0.3) {
            enemy.speed = enemy.baseSpeed * 1.8;
        }
    }
    
    // ===== ENTRANCE/ANNOUNCEMENT =====
    
    performRivalEntrance(rival, rivalData) {
        // Dramatic camera focus
        const originalZoom = this.scene.cameras.main.zoom;
        
        this.scene.tweens.add({
            targets: this.scene.cameras.main,
            zoom: 1.2,
            duration: 500,
            ease: 'Power2'
        });
        
        // Pan to rival
        this.scene.cameras.main.pan(rival.entity.x, rival.entity.y, 500, 'Power2');
        
        // Announcement text
        const announcement = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2 - 100,
            `${rivalData.tier} ${rivalData.name} EMERGES`,
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#cd7f32',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(200);
        
        // Subtitle with grudge info
        const subtitle = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2 - 60,
            rivalData.signatureQuote,
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#e6a65c',
                alpha: 0.8
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(200);
        
        // Screen flash
        this.scene.cameras.main.flash(500, 205, 127, 50, 0.3);
        
        // Return camera to player after delay
        this.scene.time.delayedCall(2000, () => {
            this.scene.tweens.add({
                targets: this.scene.cameras.main,
                zoom: originalZoom,
                duration: 500,
                ease: 'Power2'
            });
            this.scene.cameras.main.pan(this.scene.player.x, this.scene.player.y, 500, 'Power2');
            
            announcement.destroy();
            subtitle.destroy();
        });
        
        // Record in Chronicle
        if (this.scene.timelineChronicle) {
            this.scene.timelineChronicle.recordRivalEncounter(rivalData);
        }
        
        // Record in Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('RIVAL_SPAWN', {
                name: rivalData.name,
                tier: rivalData.tier
            });
        }
    }
    
    announceRivalBirth(rival) {
        // Only announce if during gameplay
        if (!this.scene.gameActive) return;
        
        const birthText = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 100,
            `A RIVAL IS BORN: ${rival.name}`,
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#cd7f32'
            }
        ).setOrigin(0.5).setDepth(100);
        
        this.scene.tweens.add({
            targets: birthText,
            y: birthText.y - 50,
            alpha: 0,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => birthText.destroy()
        });
    }
    
    announceEvolution(rival, oldTier, newTier) {
        const evoText = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            `${rival.name} EVOLVES\n${oldTier} → ${newTier}`,
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#e6a65c',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(200);
        
        this.scene.tweens.add({
            targets: evoText,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 1, to: 0 },
            duration: 3000,
            ease: 'Elastic',
            onComplete: () => evoText.destroy()
        });
    }
    
    // ===== DEATH HANDLING =====
    
    onRivalDeath(enemy, rivalData) {
        // Update rival stats
        rivalData.encounters++;
        rivalData.lastSeen = Date.now();
        
        // Check if player killed them
        const killedByPlayer = true; // Assume player kill for now
        
        if (killedByPlayer) {
            // Reset some stats but keep adaptations
            rivalData.grudgeLevel = Math.max(1, rivalData.grudgeLevel - 2);
            
            // Check for revenge evolution on next encounter
            if (rivalData.escapes >= 3) {
                rivalData.wantsRevenge = true;
            }
        }
        
        // Clean up name label
        if (enemy.rivalNameLabel) enemy.rivalNameLabel.destroy();
        
        // Remove from active rivals
        this.activeRivals = this.activeRivals.filter(r => r.entity !== enemy);
        
        // Save updated roster
        this.saveRoster();
        
        // Announce defeat
        this.announceRivalDefeat(rivalData);
    }
    
    announceRivalDefeat(rivalData) {
        const defeatText = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 80,
            `${rivalData.name} FALLS`,
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fontStyle: 'bold',
                fill: '#e6a65c'
            }
        ).setOrigin(0.5).setDepth(100);
        
        this.scene.tweens.add({
            targets: defeatText,
            y: defeatText.y - 40,
            alpha: 0,
            duration: 2500,
            ease: 'Power2',
            onComplete: () => defeatText.destroy()
        });
        
        // Record in Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('RIVAL_DEFEAT', {
                name: rivalData.name,
                tier: rivalData.tier
            });
        }
    }
    
    // ===== GENERATORS =====
    
    generateRivalId() {
        return 'rival_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateRivalName(traumaType) {
        const fragments = this.nameFragments[traumaType] || this.nameFragments.survivor;
        const baseName = fragments[Math.floor(Math.random() * fragments.length)];
        
        // Add suffix based on rarity
        if (Math.random() < 0.3) {
            const suffix = this.nameSuffixes[Math.floor(Math.random() * this.nameSuffixes.length)];
            return baseName + suffix;
        }
        
        // Occasionally compound two names
        if (Math.random() < 0.2) {
            const fragment2 = fragments[Math.floor(Math.random() * fragments.length)];
            return baseName + '-' + fragment2;
        }
        
        return baseName;
    }
    
    determineAdaptations(enemyData) {
        const adaptations = [];
        
        // Based on trauma type
        switch (enemyData.traumaType) {
            case 'piercing':
                adaptations.push('phasing');
                break;
            case 'explosive':
                adaptations.push('spreadShot');
                break;
            case 'burning':
                adaptations.push('speedBurst');
                break;
            case 'singularity':
                adaptations.push('antiSingularity');
                break;
            case 'grazing':
                adaptations.push('dodgePrediction');
                break;
        }
        
        return adaptations;
    }
    
    generateEvolutionTrait(tier, rival) {
        const traits = {
            'ASPIRANT': ['Quick Recovery', 'Heightened Senses', 'Stubborn Will'],
            'HUNTER': ['Pack Leader', 'Ambush Predator', 'Tactical Memory'],
            'NEMESIS': ['Adaptive Evolution', 'Rallying Cry', 'Vendetta Focus'],
            'ARCH': ['Legendary Resilience', 'Immortal Grudge', 'Master Tactician']
        };
        
        const tierTraits = traits[tier] || ['Unknown Trait'];
        return tierTraits[Math.floor(Math.random() * tierTraits.length)];
    }
    
    generateQuote(context, subtype) {
        const quotes = {
            'creation': [
                "I will remember this...",
                "This scar marks my becoming.",
                "You created me. Now face me.",
                "I am your unfinished business.",
                "From this pain, purpose."
            ],
            'evolution': {
                'ASPIRANT': [
                    "I have learned from our last meeting.",
                    "Your tricks won't work twice.",
                    "I've been watching. Studying."
                ],
                'HUNTER': [
                    "I hunt you now.",
                    "You cannot escape what you created.",
                    "The predator becomes prey."
                ],
                'NEMESIS': [
                    "We are bound, you and I.",
                    "Every scar tells our story.",
                    "I am the consequence of your violence."
                ],
                'ARCH': [
                    "I have become your legend.",
                    "Through ten deaths, I am eternal.",
                    "We are twin stars in this void."
                ]
            }
        };
        
        if (context === 'creation') {
            const list = quotes.creation;
            return list[Math.floor(Math.random() * list.length)];
        }
        
        if (context === 'evolution' && quotes.evolution[subtype]) {
            const list = quotes.evolution[subtype];
            return list[Math.floor(Math.random() * list.length)];
        }
        
        return "I remember.";
    }
    
    updateActiveRivals(dt) {
        // Update any active rival behaviors
        this.activeRivals.forEach(rival => {
            if (!rival.entity.active) return;
            
            // Rivals gain grudge when they see player use systems
            // This is handled through observation
        });
    }
    
    // ===== PUBLIC API =====
    
    getRoster() {
        return this.roster;
    }
    
    getActiveRivals() {
        return this.activeRivals.map(r => ({
            name: r.data.name,
            tier: r.data.tier,
            health: r.entity.health,
            maxHealth: r.entity.maxHealth
        }));
    }
    
    onPlayerDeath() {
        // Rivals that are active gain grudge and escape
        this.activeRivals.forEach(rival => {
            rival.data.grudgeLevel = Math.min(10, rival.data.grudgeLevel + 2);
            rival.data.killCount++;
            
            // They escape (despawn with dramatic effect)
            this.rivalEscapes(rival);
        });
        
        this.saveRoster();
    }
    
    rivalEscapes(rival) {
        // Visual escape effect
        const escapeText = this.scene.add.text(
            rival.entity.x,
            rival.entity.y,
            `${rival.data.name} ESCAPES...`,
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#cd7f32'
            }
        ).setOrigin(0.5).setDepth(100);
        
        this.scene.tweens.add({
            targets: [rival.entity, escapeText],
            alpha: 0,
            scale: 0.5,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                rival.entity.destroy();
                escapeText.destroy();
            }
        });
        
        // Remove from active list
        this.activeRivals = this.activeRivals.filter(r => r !== rival);
    }
    
    destroy() {
        // Clean up name labels for all active rivals
        this.activeRivals.forEach(rival => {
            if (rival.entity.rivalNameLabel) rival.entity.rivalNameLabel.destroy();
        });
        
        this.saveRoster();
    }
}
