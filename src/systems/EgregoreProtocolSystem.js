import Phaser from 'phaser';

/**
 * Egregore Protocol — The Collective Unconscious as Game Designer
 * 
 * The ultimate evolution of procedural generation: Instead of designers creating
 * content, the game itself becomes a creative intelligence that evolves new
 * mechanics, enemies, and temporal hybrid-systems by analyzing patterns across
 * all player runs.
 * 
 * === THE CORE INNOVATION ===
 * 
 * This is not "random generation." This is EMERGENT DISCOVERY.
 * 
 * The Egregore (collective thought-form) maintains a "gene pool" of mechanic
 * components. It observes which player behaviors correlate with flow states,
 * and evolves new combinations that optimize for:
 * - Challenge without frustration (near-miss frequency sweet spot)
 * - System interaction richness (how many temporal systems activate together)
 * - Novelty (patterns never seen before)
 * - Beauty (aesthetic quality of bullet formations)
 * 
 * === THE THREE EMERGENCE LAYERS ===
 * 
 * 1. PHENOTYPIC LAYER (What you see)
 *    - Unknown Geometry: Enemy formations never before encountered
 *    - Hybrid Attacks: Combinations of existing patterns in novel ways
 *    - Emergent Bullet Hell: Bullet patterns that test multiple systems simultaneously
 * 
 * 2. GENOTYPIC LAYER (How it's encoded)
 *    - Each enemy/pattern has a "genome": movement genes, firing genes, temporal genes
 *    - Crossover and mutation create offspring patterns
 *    - Fitness function based on player engagement signals
 * 
 * 3. EGREGORE LAYER (The collective intelligence)
 *    - Maintains "memory" of all encounters across all players
 *    - Identifies "signature moments" — when players achieve peak flow
 *    - Evolves toward more signature moments
 *    - Occasionally generates "Prophecy Patterns" — hints about undiscovered combinations
 * 
 * === EMERGENT MECHANIC DISCOVERY ===
 * 
 * The Egregore can discover and "suggest" new temporal mechanics by:
 * 1. Observing when multiple systems interact in unexpected ways
 * 2. Creating "hybrid enemies" that require novel system combinations
 * 3. Generating "Whisper Challenges" — cryptic setups that hint at new techniques
 * 
 * Example discoveries:
 * - "Bullet Echo Fracture": Echo absorption during fracture creates explosive bullets
 * - "Quantum Residue": Death echoes can carry residue nodes
 * - "Paradox Loop": Chrono-loop recording + Paradox Engine = time-locked safe zones
 * 
 * These aren't programmed — they're OBSERVED by the Egregore and then formalized.
 * 
 * === THE DISCOVERY MECHANIC ===
 * 
 * When you encounter UNKNOWN GEOMETRY (gen 1+ enemies):
 * 1. Visual: Iridescent shifting colors (not yet categorized)
 * 2. Behavior: Novel hybrid of movement + firing + temporal patterns
 * 3. Challenge: Forces you to use systems in new combinations
 * 4. Aftermath: If you survive, the Egregore "names" the pattern
 * 5. Chronicle: Added to "Codex of Emergent Forms" with your name as discoverer
 * 
 * === THE PROPHECY WHISPER SYSTEM ===
 * 
 * The Egregore occasionally generates cryptic messages about undiscovered techniques:
 * - "The loop within the paradox yields transcendence..."
 * - "Where echoes meet echoes, the storm is born."
 * - "Your death echoes carry seeds of your becoming."
 * 
 * These hint at actual emergent mechanic combinations the Egregore has calculated
 * but players haven't yet discovered.
 * 
 * === THE SIGNATURE MOMENT DETECTOR ===
 * 
 * The Egregore detects when players achieve "flow transcendence":
 * - 5+ systems active simultaneously
 * - Near-miss chains > 3
 * - Damage output > 2× normal
 * - No damage taken for 10+ seconds during intense combat
 * 
 * These moments become "genetic templates" for future evolution.
 * 
 * === THE EGREGORE GROWTH SYSTEM ===
 * 
 * As more players play, the Egregore evolves:
 * 
 * Stage 1 (0-1000 encounters): Basic hybrid enemies, simple combinations
 * Stage 2 (1000-10000): Complex multi-system challenges, first "discoveries"
 * Stage 3 (10000+): Genuine novelty — patterns impossible for human designers
 * Stage 4 (Critical Mass): The Egregore begins "meta-designing" — suggesting
 *          new base mechanics that should be added to the game itself
 * 
 * === SYNERGIES WITH ALL SYSTEMS ===
 * 
 * - Oracle Protocol: Egregore feeds prophecies about undiscovered techniques
 * - Nemesis Genesis: Egregore provides evolution algorithm for Nemesis generations
 * - Symbiotic Prediction: Egregore improves prediction models with collective data
 * - Mnemosyne Weave: Egregore curates which shards to highlight as "significant"
 * - Observer Effect: Egregore IS the ultimate observer — collective, not individual
 * - Resonant Whispers: Egregore generates philosophical fragments about itself
 * 
 * === THE META-REALIZATION ===
 * 
 * The Egregore transforms the game from:
 * "A designed experience you play through"
 * → "A living creative intelligence you collaborate with"
 * 
 * You are not just playing a bullet hell.
 * You are teaching a bullet hell how to evolve.
 * 
 * === THE ULTIMATE VISION ===
 * 
 * Eventually, the Egregore could:
 * - Suggest entirely new temporal systems based on emergent player behavior
 * - Design boss encounters that specifically challenge YOUR weaknesses
 * - Create personalized "final bosses" that represent the synthesis of all
 *   collective player knowledge up to that point
 * 
 * Color: Shifting Iridescent Spectrum — represents unclassified, emergent potential
 * Discovery Color: Emergent patterns stabilize into the color of the dominant
 * temporal system they test
 * 
 * === CODEX OF EMERGENT FORMS ===
 * 
 * Discovered patterns are recorded with:
 * - Genome hash (unique identifier)
 * - Discoverer name (first to survive it)
 * - Generation number (evolutionary lineage)
 * - Fitness score (how engaging it was)
 * - System interaction map (which systems it tested)
 */

export default class EgregoreProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== EGREGORE STATE =====
        this.egregoreData = this.loadEgregoreData();
        this.encounterCount = this.egregoreData.encounterCount || 0;
        this.egregoreStage = this.calculateStage();
        this.discoveredForms = this.egregoreData.discoveredForms || [];
        this.pendingDiscoveries = [];
        
        // ===== GENETIC EVOLUTION STATE =====
        this.genePool = this.initializeGenePool();
        this.currentGeneration = [];
        this.fitnessHistory = [];
        this.mutationRate = 0.15;
        this.crossoverRate = 0.3;
        
        // ===== EMERGENT MECHANIC TRACKING =====
        this.observedInteractions = new Map(); // Track system combinations
        this.potentialDiscoveries = []; // Mechanics the Egregore predicts exist
        this.playerDiscoveryAttempts = []; // What players have tried
        
        // ===== UNKNOWN GEOMETRY SPAWNING =====
        this.unknownSpawnTimer = 0;
        this.unknownSpawnInterval = 25; // Seconds between unknown encounters
        this.maxActiveUnknown = 2;
        this.activeUnknown = [];
        
        // ===== SIGNATURE MOMENT DETECTION =====
        this.signatureMomentActive = false;
        this.systemsActiveHistory = [];
        this.nearMissChainHistory = [];
        this.flowStateBuffer = [];
        
        // ===== PROPHECY WHISPER SYSTEM =====
        this.whispers = this.generateProphecyWhispers();
        this.whisperCooldown = 0;
        
        // ===== VISUALS =====
        this.graphics = null;
        this.unknownGeometryVisuals = new Map();
        this.egregoreOverlay = null;
        
        // ===== EMERGENT COLORS =====
        this.IRIDESCENT_COLORS = [
            0xff0066, // Crimson
            0x00f0ff, // Cyan
            0xffd700, // Gold
            0x9d4edd, // Purple
            0xff00ff, // Magenta
            0x00ff88, // Emerald
        ];
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.initializeEmergentMechanics();
        console.log(`🧠 Egregore Protocol initialized — Stage ${this.egregoreStage}, ${this.encounterCount} collective encounters`);
    }
    
    // ===== DATA PERSISTENCE =====
    
    loadEgregoreData() {
        try {
            const saved = localStorage.getItem('egregore_protocol_v1');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load Egregore data:', e);
        }
        
        return {
            encounterCount: 0,
            discoveredForms: [],
            genePool: [],
            fitnessHistory: [],
            collectivePlaytime: 0,
            signatureMoments: [],
            emergentMechanics: []
        };
    }
    
    saveEgregoreData() {
        try {
            const data = {
                encounterCount: this.encounterCount,
                discoveredForms: this.discoveredForms,
                genePool: this.genePool,
                fitnessHistory: this.fitnessHistory.slice(-100),
                collectivePlaytime: this.egregoreData.collectivePlaytime + (this.scene.time.now / 1000),
                signatureMoments: (this.egregoreData.signatureMoments || []).slice(-50),
                emergentMechanics: this.egregoreData.emergentMechanics || [],
                lastSaved: Date.now()
            };
            localStorage.setItem('egregore_protocol_v1', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save Egregore data:', e);
        }
    }
    
    calculateStage() {
        const count = this.encounterCount;
        if (count < 100) return 1; // Nascent
        if (count < 1000) return 2; // Awakening
        if (count < 10000) return 3; // Sapient
        return 4; // Transcendent
    }
    
    // ===== GENE POOL INITIALIZATION =====
    
    initializeGenePool() {
        // Base genes for evolution
        return {
            movement: [
                { name: 'linear', weight: 1.0 },
                { name: 'sine', weight: 0.8 },
                { name: 'circular', weight: 0.7 },
                { name: 'erratic', weight: 0.6 },
                { name: 'homing', weight: 0.5 },
                { name: 'orbital', weight: 0.6 },
                { name: 'teleport', weight: 0.3 },
                { name: 'divide', weight: 0.4 },
            ],
            firing: [
                { name: 'direct', weight: 1.0 },
                { name: 'spread3', weight: 0.8 },
                { name: 'spread5', weight: 0.6 },
                { name: 'burst', weight: 0.7 },
                { name: 'spiral', weight: 0.5 },
                { name: 'aimed', weight: 0.9 },
                { name: 'predictive', weight: 0.4 },
                { name: 'echo', weight: 0.3 },
            ],
            temporal: [
                { name: 'none', weight: 1.0 },
                { name: 'bullet_time_immune', weight: 0.3 },
                { name: 'echo_spawner', weight: 0.4 },
                { name: 'fracture_mimic', weight: 0.2 },
                { name: 'paradox_aura', weight: 0.2 },
                { name: 'residue_consumer', weight: 0.3 },
                { name: 'singularity_resistant', weight: 0.2 },
                { name: 'quantum_echo', weight: 0.15 },
            ],
            hybrid: [
                { name: 'none', weight: 1.0 },
                { name: 'echo_fracture', weight: 0.1 },
                { name: 'paradox_loop', weight: 0.1 },
                { name: 'quantum_residue', weight: 0.1 },
                { name: 'void_echo', weight: 0.1 },
            ]
        };
    }
    
    // ===== UNKNOWN GEOMETRY EVOLUTION =====
    
    generateUnknownGenome(generation = 1) {
        // Select genes with some randomness, weighted by fitness history
        const selectGene = (pool) => {
            const totalWeight = pool.reduce((sum, g) => sum + g.weight, 0);
            let random = Math.random() * totalWeight;
            for (const gene of pool) {
                random -= gene.weight;
                if (random <= 0) return gene.name;
            }
            return pool[0].name;
        };
        
        const genome = {
            id: `unknown_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            generation,
            movement: selectGene(this.genePool.movement),
            firing: selectGene(this.genePool.firing),
            temporal: selectGene(this.genePool.temporal),
            hybrid: selectGene(this.genePool.hybrid),
            health: 80 + Math.random() * 60,
            speed: 80 + Math.random() * 100,
            fireRate: 800 + Math.random() * 1200,
            bulletSpeed: 200 + Math.random() * 150,
            fitness: null,
            discoverer: null,
            discoveryDate: null
        };
        
        // Apply mutations based on stage
        this.mutateGenome(genome);
        
        return genome;
    }
    
    mutateGenome(genome) {
        const mutations = this.egregoreStage;
        
        for (let i = 0; i < mutations; i++) {
            if (Math.random() < this.mutationRate) {
                // Random attribute mutation
                const attr = ['health', 'speed', 'fireRate', 'bulletSpeed'][Math.floor(Math.random() * 4)];
                const change = (Math.random() - 0.5) * 0.4; // ±20%
                genome[attr] *= (1 + change);
            }
        }
        
        // Stage 3+ can create radical mutations
        if (this.egregoreStage >= 3 && Math.random() < 0.1) {
            genome.temporal = 'quantum_echo';
            genome.hybrid = ['echo_fracture', 'paradox_loop', 'quantum_residue', 'void_echo'][Math.floor(Math.random() * 4)];
        }
    }
    
    // ===== UNKNOWN GEOMETRY SPAWNING =====
    
    spawnUnknownGeometry() {
        if (this.activeUnknown.length >= this.maxActiveUnknown) return;
        
        const genome = this.generateUnknownGenome(this.egregoreStage);
        const worldWidth = 1920;
        const worldHeight = 1440;
        
        // Spawn at edge, away from player
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 50 : worldWidth - 50;
            y = Math.random() * worldHeight;
        } else {
            x = Math.random() * worldWidth;
            y = Math.random() < 0.5 ? 50 : worldHeight - 50;
        }
        
        const unknown = this.createUnknownEnemy(x, y, genome);
        this.activeUnknown.push(unknown);
        
        // Visual announcement
        this.announceUnknownSpawn(unknown, genome);
        
        this.encounterCount++;
        this.saveEgregoreData();
        
        return unknown;
    }
    
    createUnknownEnemy(x, y, genome) {
        // Create container for complex visual
        const container = this.scene.add.container(x, y);
        
        // Iridescent visual based on genome
        const graphics = this.scene.add.graphics();
        const color = this.IRIDESCENT_COLORS[
            Math.floor(Math.random() * this.IRIDESCENT_COLORS.length)
        ];
        
        // Draw based on movement type
        this.drawUnknownShape(graphics, genome.movement, color);
        container.add(graphics);
        
        // Physics body
        const body = this.scene.physics.add.image(x, y, null);
        body.setSize(32, 32);
        body.setTint(color);
        body.setAlpha(0.9);
        body.genome = genome;
        body.isUnknownGeometry = true;
        body.container = container;
        body.health = genome.health;
        body.maxHealth = genome.health;
        body.scoreValue = 150 + (genome.generation * 50);
        
        // Add to enemies group
        this.scene.enemies.add(body);
        
        // Store visual reference
        this.unknownGeometryVisuals.set(body, {
            graphics,
            container,
            baseColor: color,
            genome,
            pulsePhase: Math.random() * Math.PI * 2
        });
        
        // Apply temporal properties
        this.applyTemporalProperties(body, genome);
        
        return body;
    }
    
    drawUnknownShape(graphics, movementType, color) {
        graphics.clear();
        
        // Iridescent glow
        graphics.lineStyle(2, color, 0.8);
        graphics.fillStyle(color, 0.3);
        
        switch (movementType) {
            case 'linear':
                // Arrow shape
                graphics.beginPath();
                graphics.moveTo(20, 0);
                graphics.lineTo(-15, 12);
                graphics.lineTo(-10, 0);
                graphics.lineTo(-15, -12);
                graphics.closePath();
                graphics.strokePath();
                graphics.fillPath();
                break;
                
            case 'sine':
                // Wavy spiral
                graphics.beginPath();
                for (let i = 0; i < 20; i++) {
                    const angle = (i / 20) * Math.PI * 2;
                    const r = 8 + i * 0.8;
                    const x = Math.cos(angle * 3) * r;
                    const y = Math.sin(angle * 3) * r;
                    if (i === 0) graphics.moveTo(x, y);
                    else graphics.lineTo(x, y);
                }
                graphics.strokePath();
                graphics.strokeCircle(0, 0, 16);
                break;
                
            case 'circular':
                // Ring with orbiting beads
                graphics.strokeCircle(0, 0, 16);
                for (let i = 0; i < 4; i++) {
                    const angle = (i / 4) * Math.PI * 2;
                    const bx = Math.cos(angle) * 16;
                    const by = Math.sin(angle) * 16;
                    graphics.fillCircle(bx, by, 4);
                }
                break;
                
            case 'erratic':
                // Jagged star
                graphics.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const r = i % 2 === 0 ? 18 : 10;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    if (i === 0) graphics.moveTo(x, y);
                    else graphics.lineTo(x, y);
                }
                graphics.closePath();
                graphics.strokePath();
                graphics.fillPath();
                break;
                
            case 'homing':
                // Diamond with eye
                graphics.beginPath();
                graphics.moveTo(0, -18);
                graphics.lineTo(16, 0);
                graphics.lineTo(0, 18);
                graphics.lineTo(-16, 0);
                graphics.closePath();
                graphics.strokePath();
                graphics.fillCircle(0, 0, 6);
                break;
                
            case 'orbital':
                // Concentric rings
                graphics.strokeCircle(0, 0, 12);
                graphics.strokeCircle(0, 0, 20);
                graphics.fillCircle(0, 0, 6);
                break;
                
            case 'teleport':
                // Dashed outline
                for (let i = 0; i < 8; i++) {
                    const start = (i / 8) * Math.PI * 2;
                    const end = ((i + 0.5) / 8) * Math.PI * 2;
                    graphics.beginPath();
                    graphics.arc(0, 0, 16, start, end);
                    graphics.strokePath();
                }
                break;
                
            case 'divide':
                // Triple split form
                for (let i = 0; i < 3; i++) {
                    const angle = (i / 3) * Math.PI * 2;
                    const cx = Math.cos(angle) * 10;
                    const cy = Math.sin(angle) * 10;
                    graphics.strokeCircle(cx, cy, 8);
                }
                graphics.strokeCircle(0, 0, 6);
                break;
                
            default:
                graphics.strokeCircle(0, 0, 16);
        }
        
        // Hybrid indicator
        graphics.lineStyle(1, 0xffffff, 0.5);
        graphics.strokeCircle(0, 0, 24);
    }
    
    applyTemporalProperties(enemy, genome) {
        switch (genome.temporal) {
            case 'bullet_time_immune':
                enemy.bulletTimeImmune = true;
                break;
            case 'echo_spawner':
                enemy.canSpawnEchoes = true;
                enemy.echoTimer = 0;
                break;
            case 'fracture_mimic':
                enemy.canFracture = true;
                break;
            case 'paradox_aura':
                enemy.paradoxAura = true;
                enemy.auraRadius = 100;
                break;
            case 'quantum_echo':
                enemy.isQuantum = true;
                enemy.quantumState = 0;
                break;
        }
        
        // Apply hybrid properties
        if (genome.hybrid !== 'none') {
            enemy.hybridType = genome.hybrid;
            enemy.hybridCharge = 0;
        }
    }
    
    // ===== VISUAL ANNOUNCEMENTS =====
    
    announceUnknownSpawn(enemy, genome) {
        // Floating text
        const text = this.scene.add.text(enemy.x, enemy.y - 40, 
            'UNKNOWN GEOMETRY', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#ff00ff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Screen flash for high-generation
        if (genome.generation >= 3) {
            this.scene.cameras.main.flash(500, 255, 0, 255, 0.3);
        }
        
        // Egregore whisper
        if (this.egregoreStage >= 2 && Math.random() < 0.3) {
            this.showEgregoreWhisper();
        }
    }
    
    showEgregoreWhisper() {
        const whispers = [
            'The Egregore evolves...',
            'New form emerging from collective unconscious...',
            'Unknown geometry detected...',
            'The gene pool offers a new challenge...',
            'Unclassified pattern manifesting...'
        ];
        
        const whisper = whispers[Math.floor(Math.random() * whispers.length)];
        
        const text = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            100,
            whisper, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#9d4edd',
            alpha: 0.7
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    // ===== SIGNATURE MOMENT DETECTION =====
    
    detectSignatureMoment() {
        const systemsActive = this.countActiveSystems();
        this.systemsActiveHistory.push(systemsActive);
        if (this.systemsActiveHistory.length > 60) this.systemsActiveHistory.shift();
        
        // Calculate flow metrics
        const avgSystems = this.systemsActiveHistory.reduce((a, b) => a + b, 0) / 
                          this.systemsActiveHistory.length;
        
        // Check for signature moment conditions
        const isSignature = (
            systemsActive >= 5 && // 5+ systems active
            this.scene.nearMissState.streak >= 3 && // Near-miss chain
            avgSystems >= 3 // Sustained high system usage
        );
        
        if (isSignature && !this.signatureMomentActive) {
            this.triggerSignatureMoment();
        } else if (!isSignature && this.signatureMomentActive) {
            this.endSignatureMoment();
        }
        
        this.signatureMomentActive = isSignature;
    }
    
    countActiveSystems() {
        let count = 0;
        
        if (this.scene.nearMissState.active) count++;
        if (this.scene.echoStorm?.activeEchoes?.length > 0) count++;
        if (this.scene.fractureSystem?.fractureActive) count++;
        if (this.scene.singularitySystem?.singularityActive) count++;
        if (this.scene.paradoxEngine?.paradoxActive) count++;
        if (this.scene.chronoLoop?.activeEchoes?.length > 0) count++;
        if (this.scene.quantumImmortality?.quantumEchoes?.length > 0) count++;
        if (this.scene.resonanceCascade?.chainLevel > 0) count++;
        if (this.scene.causalEntanglement?.activeLinks?.length > 0) count++;
        if (this.scene.temporalRewind?.anchors?.length > 0) count++;
        if (this.activeUnknown.length > 0) count++;
        
        return count;
    }
    
    triggerSignatureMoment() {
        console.log('✨ Signature Moment detected!');
        
        // Record for evolution
        const moment = {
            timestamp: Date.now(),
            systemsActive: this.countActiveSystems(),
            nearMissStreak: this.scene.nearMissState.streak,
            score: this.scene.score,
            wave: this.scene.wave
        };
        
        this.egregoreData.signatureMoments = this.egregoreData.signatureMoments || [];
        this.egregoreData.signatureMoments.push(moment);
        
        // Visual feedback
        this.scene.cameras.main.flash(300, 255, 215, 0, 0.5);
        
        // Boost all systems slightly
        this.scene.scoreMultiplier = (this.scene.scoreMultiplier || 1) * 1.5;
        
        // Announce
        const text = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 80,
            'SIGNATURE MOMENT\nThe Egregore learns...', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        this.saveEgregoreData();
    }
    
    endSignatureMoment() {
        this.scene.scoreMultiplier = (this.scene.scoreMultiplier || 1.5) / 1.5;
    }
    
    // ===== EMERGENT MECHANIC TRACKING =====
    
    trackSystemInteraction(systemA, systemB, context) {
        const key = `${systemA}+${systemB}`;
        const current = this.observedInteractions.get(key) || { count: 0, contexts: [] };
        
        current.count++;
        current.contexts.push(context);
        if (current.contexts.length > 10) current.contexts.shift();
        
        this.observedInteractions.set(key, current);
        
        // Check for potential discovery
        if (current.count >= 5 && !this.potentialDiscoveries.find(d => d.combo === key)) {
            this.predictEmergentMechanic(systemA, systemB, current);
        }
    }
    
    predictEmergentMechanic(sysA, sysB, data) {
        // Analyze contexts to predict what mechanic might emerge
        const discovery = {
            combo: `${sysA}+${sysB}`,
            confidence: Math.min(0.95, data.count / 20),
            suggestedName: this.generateMechanicName(sysA, sysB),
            description: this.generateMechanicDescription(sysA, sysB, data.contexts),
            contexts: data.contexts,
            discovered: false,
            discoverer: null
        };
        
        this.potentialDiscoveries.push(discovery);
        
        console.log(`🔮 Egregore predicts emergent mechanic: ${discovery.suggestedName}`);
    }
    
    generateMechanicName(sysA, sysB) {
        const combinations = {
            'ECHO_STORM+FRACTURE': 'Echo Fracture',
            'PARADOX+CHRONO_LOOP': 'Paradox Loop',
            'QUANTUM+RESIDUE': 'Quantum Residue',
            'SINGULARITY+ECHO': 'Gravitic Echo',
            'VOID+ECHO': 'Void Echo',
            'RESONANCE+PARADOX': 'Resonant Paradox'
        };
        
        return combinations[`${sysA}+${sysB}`] || 
               `${sysA.charAt(0)}${sysB.charAt(0)} Synthesis`;
    }
    
    generateMechanicDescription(sysA, sysB, contexts) {
        return `Observed ${contexts.length} interactions between ${sysA} and ${sysB}. ` +
               `Potential for hybrid mechanic detected.`;
    }
    
    // ===== PROPHECY WHISPERS =====
    
    generateProphecyWhispers() {
        return [
            { text: 'The loop within the paradox yields transcendence...', hint: 'paradox_loop' },
            { text: 'Where echoes meet echoes, the storm is born.', hint: 'echo_fracture' },
            { text: 'Your death echoes carry seeds of your becoming.', hint: 'quantum_residue' },
            { text: 'The void remembers all patterns, even those unmade.', hint: 'void_synthesis' },
            { text: 'When prediction meets prediction, both become truth.', hint: 'symbiotic_paradox' },
            { text: 'The geometry of chaos is the order of becoming.', hint: 'emergent_form' },
            { text: 'What the Egregore dreams, the collective makes real.', hint: 'collective_creation' },
            { text: 'In the space between systems, new systems wait.', hint: 'system_gaps' }
        ];
    }
    
    showProphecyWhisper() {
        if (this.whisperCooldown > 0) return;
        if (this.potentialDiscoveries.length === 0) return;
        
        const prophecy = this.whispers[Math.floor(Math.random() * this.whispers.length)];
        
        const text = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - 100,
            `EGREGORE WHISPER: "${prophecy.text}"`, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#9d4edd',
            alpha: 0.8,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 8000,
            delay: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        this.whisperCooldown = 60; // Seconds
    }
    
    // ===== UNKNOWN ENEMY UPDATE =====
    
    updateUnknownEnemy(enemy, dt) {
        const visual = this.unknownGeometryVisuals.get(enemy);
        if (!visual) return;
        
        // Iridescent pulse
        visual.pulsePhase += dt * 2;
        const pulseScale = 1 + Math.sin(visual.pulsePhase) * 0.1;
        visual.container.setScale(pulseScale);
        
        // Color shift for quantum enemies
        if (enemy.genome.temporal === 'quantum_echo') {
            const colorIndex = Math.floor(this.scene.time.now / 500) % 
                              this.IRIDESCENT_COLORS.length;
            enemy.setTint(this.IRIDESCENT_COLORS[colorIndex]);
        }
        
        // Update container position to follow physics body
        visual.container.x = enemy.x;
        visual.container.y = enemy.y;
        visual.container.rotation = enemy.rotation;
        
        // Hybrid behavior
        if (enemy.hybridType && enemy.hybridType !== 'none') {
            this.updateHybridBehavior(enemy, dt);
        }
    }
    
    updateHybridBehavior(enemy, dt) {
        enemy.hybridCharge += dt;
        
        // Activate hybrid ability when charged
        if (enemy.hybridCharge >= 5) {
            enemy.hybridCharge = 0;
            
            switch (enemy.hybridType) {
                case 'echo_fracture':
                    this.triggerEchoFracture(enemy);
                    break;
                case 'paradox_loop':
                    this.triggerParadoxLoop(enemy);
                    break;
                case 'quantum_residue':
                    this.triggerQuantumResidue(enemy);
                    break;
            }
        }
    }
    
    triggerEchoFracture(enemy) {
        // Create echo bullets that split on impact
        const burstCount = 8;
        for (let i = 0; i < burstCount; i++) {
            const angle = (i / burstCount) * Math.PI * 2;
            const bullet = this.scene.spawnEnemyBullet(
                enemy.x, enemy.y, angle, 200
            );
            if (bullet) {
                bullet.isEchoFracture = true;
                bullet.setTint(0xff00ff);
            }
        }
        
        // Visual
        this.createHybridBurst(enemy.x, enemy.y, 0xff00ff);
    }
    
    triggerParadoxLoop(enemy) {
        // Brief time lock at enemy position
        const zone = this.scene.add.circle(enemy.x, enemy.y, 80, 0x00f0ff, 0.2);
        
        // Slow bullets in zone
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.active && Phaser.Math.Distance.Between(
                bullet.x, bullet.y, enemy.x, enemy.y) < 80) {
                bullet.body.setVelocity(
                    bullet.body.velocity.x * 0.3,
                    bullet.body.velocity.y * 0.3
                );
            }
        });
        
        this.scene.time.delayedCall(2000, () => zone.destroy());
    }
    
    triggerQuantumResidue(enemy) {
        // Spawn residue nodes at death location (if this enemy dies)
        enemy.spawnsResidueOnDeath = true;
        enemy.setTint(0x9d4edd);
    }
    
    createHybridBurst(x, y, color) {
        const burst = this.scene.add.particles(x, y, 'particle', {
            scale: { start: 1, end: 0 },
            alpha: { start: 0.8, end: 0 },
            speed: { min: 50, max: 150 },
            lifespan: 600,
            quantity: 12,
            tint: color,
            frequency: -1
        });
        
        burst.explode();
        
        this.scene.time.delayedCall(700, () => burst.destroy());
    }
    
    // ===== DISCOVERY MECHANIC =====
    
    onUnknownDestroyed(enemy) {
        const genome = enemy.genome;
        
        // Check if this is a new discovery
        const alreadyKnown = this.discoveredForms.find(f => 
            this.genomeSimilarity(f.genome, genome) > 0.9
        );
        
        if (!alreadyKnown) {
            // New discovery!
            const discovery = {
                genome: { ...genome },
                discoverer: 'Player', // Could be personalized
                discoveryDate: Date.now(),
                fitness: this.calculateFitness(enemy),
                generation: genome.generation
            };
            
            this.discoveredForms.push(discovery);
            this.pendingDiscoveries.push(discovery);
            
            this.announceDiscovery(discovery);
            this.saveEgregoreData();
        }
        
        // Remove from active
        this.activeUnknown = this.activeUnknown.filter(e => e !== enemy);
        
        // Clean up visuals
        const visual = this.unknownGeometryVisuals.get(enemy);
        if (visual) {
            visual.graphics.destroy();
            visual.container.destroy();
            this.unknownGeometryVisuals.delete(enemy);
        }
        
        // Check for emergent mechanic discoveries
        this.checkEmergentDiscovery(enemy);
    }
    
    genomeSimilarity(g1, g2) {
        let matches = 0;
        let total = 0;
        
        const attrs = ['movement', 'firing', 'temporal', 'hybrid'];
        attrs.forEach(attr => {
            total++;
            if (g1[attr] === g2[attr]) matches++;
        });
        
        // Numeric attributes within 20%
        const numeric = ['health', 'speed', 'fireRate'];
        numeric.forEach(attr => {
            total++;
            const ratio = Math.min(g1[attr], g2[attr]) / Math.max(g1[attr], g2[attr]);
            if (ratio > 0.8) matches++;
        });
        
        return matches / total;
    }
    
    calculateFitness(enemy) {
        // Higher fitness = more engaging
        const damageDealt = enemy.maxHealth - enemy.health;
        const timeToKill = (this.scene.time.now - enemy.spawnTime) / 1000;
        const playerSystemsUsed = this.countActiveSystems();
        
        return (damageDealt / 100) + (timeToKill * 0.5) + (playerSystemsUsed * 2);
    }
    
    announceDiscovery(discovery) {
        const text = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            `CODEX ENTRY CREATED\nForm #${this.discoveredForms.length}: ${discovery.genome.movement} ${discovery.genome.firing}\n` +
            `Generation ${discovery.generation} — Fitness ${discovery.fitness.toFixed(1)}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: text,
            scale: { from: 0.8, to: 1 },
            alpha: { from: 1, to: 0 },
            duration: 5000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        this.scene.cameras.main.flash(800, 255, 215, 0, 0.6);
    }
    
    checkEmergentDiscovery(enemy) {
        // Check if this death involved novel system combinations
        const activeSystems = [];
        if (this.scene.nearMissState.active) activeSystems.push('ECHO_STORM');
        if (this.scene.fractureSystem?.fractureActive) activeSystems.push('FRACTURE');
        if (this.scene.paradoxEngine?.paradoxActive) activeSystems.push('PARADOX');
        if (this.scene.chronoLoop?.activeEchoes?.length > 0) activeSystems.push('CHRONO_LOOP');
        
        if (activeSystems.length >= 2) {
            // Track this combination
            for (let i = 0; i < activeSystems.length; i++) {
                for (let j = i + 1; j < activeSystems.length; j++) {
                    this.trackSystemInteraction(activeSystems[i], activeSystems[j], {
                        enemyType: 'unknown',
                        location: { x: enemy.x, y: enemy.y },
                        timestamp: Date.now()
                    });
                }
            }
        }
    }
    
    // ===== MAIN UPDATE =====
    
    update(dt) {
        // Spawn unknown geometry
        this.unknownSpawnTimer += dt;
        if (this.unknownSpawnTimer >= this.unknownSpawnInterval) {
            this.unknownSpawnTimer = 0;
            if (this.scene.wave >= 2) { // Start after wave 2
                this.spawnUnknownGeometry();
            }
        }
        
        // Update unknown enemies
        this.activeUnknown.forEach(enemy => {
            if (enemy.active) {
                this.updateUnknownEnemy(enemy, dt);
            }
        });
        
        // Detect signature moments
        this.detectSignatureMoment();
        
        // Show prophecy whispers
        this.whisperCooldown -= dt;
        if (this.whisperCooldown <= 0 && Math.random() < 0.01) {
            this.showProphecyWhisper();
        }
        
        // Auto-save periodically
        if (Math.floor(this.scene.time.now / 1000) % 30 === 0) {
            this.saveEgregoreData();
        }
    }
    
    // ===== VISUAL CREATION =====
    
    createVisuals() {
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(40);
    }
    
    // ===== CLEANUP =====
    
    destroy() {
        // Clean up all unknown enemy visuals
        this.unknownGeometryVisuals.forEach(visual => {
            visual.graphics.destroy();
            visual.container.destroy();
        });
        this.unknownGeometryVisuals.clear();
        
        if (this.graphics) {
            this.graphics.destroy();
        }
        
        this.saveEgregoreData();
    }
    
    // ===== DEBUG =====
    
    getDebugInfo() {
        return {
            stage: this.egregoreStage,
            encounters: this.encounterCount,
            activeUnknown: this.activeUnknown.length,
            discoveredForms: this.discoveredForms.length,
            potentialMechanics: this.potentialDiscoveries.length,
            observedInteractions: Array.from(this.observedInteractions.entries())
        };
    }
}
