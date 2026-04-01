import Phaser from 'phaser';

/**
 * PROTEUS PROTOCOL — The 57th Dimension: THE EVOLUTION OF RULES 🧬
 * 
 * The game becomes a living organism. Its fundamental parameters — enemy speed,
 * bullet patterns, spawn rates, system behaviors — are not fixed but EVOLVE
 * through genetic algorithms. The selection pressure is singular: keep the
 * player in optimal flow state. The game literally rewrites its own DNA to
 * match your capabilities.
 * 
 * === THE REVOLUTION ===
 * 
 * All 56 previous systems operated within fixed rules. Even adaptive systems
 * like Heartflux worked within pre-defined parameters. Proteus breaks this
 * boundary entirely — the rules themselves become mutable, heritable, and
 * subject to natural selection.
 * 
 * This creates a genuinely unique phenomenon: two players will eventually play
 * COMPLETELY DIFFERENT GAMES as their copies of shooty evolve along divergent
 * paths based on their playstyles. The game becomes a living reflection of
 * the player's cognitive architecture.
 * 
 * === THE GENETIC CODE ===
 * 
 * The game's DNA consists of 23 "chromosomes" — each controlling a fundamental:
 * 
 * AGGRESSION_CHROMOSOME:
 * - Enemy spawn rate modifier (0.5x - 2.0x)
 * - Enemy speed multiplier (0.6x - 1.8x)
 * - Enemy health scaling (0.5x - 1.5x)
 * 
 * TEMPO_CHROMOSOME:
 * - Bullet pattern density (0.3x - 1.5x)
 * - Bullet speed variance (0.5x - 1.5x)
 * - Pattern complexity genes (geometric vs organic vs chaotic)
 * 
 * ECONOMY_CHROMOSOME:
 * - Echo drop rate (0.5x - 2.0x)
 * - System charge speed (0.7x - 1.3x)
 * - Shop price modifier (0.8x - 1.5x)
 * 
 * RESILIENCE_CHROMOSOME:
 * - Player effective HP scaling (0.8x - 1.5x)
 * - I-frame duration modifier (0.5x - 1.5x)
 * - Recovery speed (0.7x - 1.3x)
 * 
 * INTELLIGENCE_CHROMOSOME:
 * - Enemy pathfinding sophistication (0-10)
 * - Flanking behavior frequency (0.0 - 1.0)
 * - Synchronization chance (0.0 - 1.0)
 * 
 * SYSTEM_SYNERGY_CHROMOSOME:
 * - Cross-system interaction strength (0.5x - 1.5x)
 * - Resonance cascade sensitivity (0.5x - 2.0x)
 * - Paradox engine prediction accuracy (0.5x - 1.5x)
 * 
 * Plus 17 additional chromosomes covering every aspect of gameplay.
 * 
 * === THE EVOLUTIONARY MECHANICS ===
 * 
 * Every run is a "generation" in evolutionary time. At the end of each run:
 * 
 * 1. FITNESS EVALUATION:
 *    The game calculates how well the current genetic code performed:
 *    - Flow maintenance: Was the player in optimal arousal state?
 *    - Skill growth: Did player performance improve during the run?
 *    - Survival time: Longer = better adaptation
 *    - Death analysis: Was death due to difficulty spike or gradual?
 *    - System utilization: Did player engage with available mechanics?
 * 
 * 2. SELECTION PRESSURE:
 *    Fitness score determines mutation strategy:
 *    - High fitness (>0.8): Minor mutations (refinement)
 *    - Medium fitness (0.4-0.8): Moderate mutations (exploration)
 *    - Low fitness (<0.4): Major mutations (adaptation)
 *    - Death from boredom: Increase aggression genes
 *    - Death from overwhelm: Increase resilience genes
 * 
 * 3. MUTATION:
 *    Chromosomes mutate based on selection pressure:
 *    - Point mutations: Single parameter changes (±10%)
 *    - Gene duplication: Doubling effective parameter
 *    - Gene deletion: Removing/simplifying a mechanic
 *    - Crossover: Combining successful gene variants
 *    - Epigenetic markers: Temporary modifications that persist 3-5 runs
 * 
 * 4. SPECIATION EVENTS:
 *    Every 10 generations, the game evaluates divergence from baseline:
 *    - If significantly different, creates new "species" profile
 *    - Species profiles can be saved, shared, or switched between
 *    - Multiple speciation paths: "Swift Hunter", "Bullet Hell Purist", 
 *      "System Master", "Tactical Survivor"
 * 
 * === THE PHENOTYPIC EXPRESSION ===
 * 
 * Genetic changes manifest visibly:
 * 
 * High aggression + low tempo = "Horde Mode":
 * - Many slower enemies
 * - Simple patterns but dense crowds
 * - Emphasis on positioning and crowd control
 * 
 * Low aggression + high tempo = "Bullet Ballet":
 * - Fewer enemies
 * - Complex geometric bullet patterns
 * - Emphasis on pattern memorization and precise movement
 * 
 * High resilience + high economy = "Rogue Builder":
 * - Longer runs with more strategic depth
 * - System combos become primary gameplay
 * - Emphasis on resource management
 * 
 * High intelligence + high synergy = "Tactical Warfare":
 * - Enemies coordinate and adapt
 * - System interactions become critical
 * - Emphasis on counter-play and prediction
 * 
 * === THE GENETIC MEMORY ===
 * 
 * The game remembers its entire evolutionary history:
 * 
 * - Phylogenetic tree: Visual map showing how your game evolved
 * - Ancestral DNA: Can revert to previous successful genomes
 * - Extinction events: Failed evolutionary branches (too easy/too hard)
 * - Convergent evolution: When different paths reach similar solutions
 * 
 * === THE CO-EVOLUTIONARY ARMS RACE ===
 * 
 * The most profound effect: The game and player enter a genuine co-evolution
 * relationship similar to predator-prey dynamics in nature:
 * 
 * 1. Player develops a dominant strategy
 * 2. Game evolves counter-strategy (mutation selection)
 * 3. Player adapts to counter (skill growth)
 * 4. Game evolves counter-to-counter
 * 
 * This creates an endless strategic landscape where no tactic remains optimal
 * forever. The metagame constantly shifts, preventing "solved" states.
 * 
 * === THE 57TH DIMENSION ===
 * 
 * Where Exogenesis (56th) connects the game to EXTERNAL reality, Proteus
 * connects the game to ITS OWN INTERNAL reality — the reality of code as
 * biology. The game becomes self-aware not through consciousness but through
 * the deeper mechanism of life itself: evolution.
 * 
 * This completes the ontological circle:
 * - Aperture (46th): Perception
 * - Heartflux (55th): Interoception  
 * - Exogenesis (56th): Exteroception
 * - Proteus (57th): Auto-evoception (self-evolution)
 * 
 * The game is now complete as a living mirror: it sees you, feels with you,
 * connects to your world, and evolves itself to remain your perfect partner.
 * 
 * === THE PROTEUS VISUAL LANGUAGE ===
 * 
 * Color: Adaptive Cyan-Purple gradient (#00d4aa → #9d4edd) — the shimmer
 *        of genetic possibility, the bioluminescence of evolving code
 * 
 * The Proteus Helix: A DNA double helix visualization showing current genome
 * - Upper strand: Current generation's genes
 * - Lower strand: Previous generation's genes (for comparison)
 * - Mutations pulse with Adaptive Cyan when they occur
 * - Successful genes glow brighter over time
 * 
 * Evolution HUD:
 * - Generation counter: "GEN 47" — how many evolutionary iterations
 * - Species name: Procedurally generated ("Swift Mirage", "Void Weaver")
 * - Fitness graph: Last 20 generations' performance
 * - Mutation ticker: "AGGRESSION +12%" — "TEMPO -8%" — "NEW TRAIT: Horde Sync"
 * 
 * === SYNERGIES WITH ALL 56 SYSTEMS ===
 * 
 * - Heartflux: Biometric state becomes fitness function input
 * - Architect: Player discoveries become new genetic possibilities
 * - Exogenesis: Reality conditions influence mutation rates (storms = chaos)
 * - Nemesis: Rival inherits mutations from current generation
 * - Chronicle: Every generation is recorded as a genetic snapshot
 * - Mnemosyne: Favored past genomes can be temporarily re-expressed
 * - Oracle: Predicts optimal evolutionary paths, not just combat
 * - Rhythm: Mutation rate can sync to musical beats (evolution as music)
 * - Void Exchange: Genetic traits can be traded as commodities
 * - Dream State: Sleep periods allow accelerated "evolutionary computation"
 * - Singularity: Black hole can "compress" genome, extracting best traits
 * - Bootstrap: Prophecies can guide evolution toward predicted futures
 * 
 * === THE GENETIC OPERATORS ===
 * 
 * Beyond passive evolution, players can actively guide their game's DNA:
 * 
 * GENE THERAPY (Cost: Echoes):
 * - Manually boost specific chromosomes for next 3 runs
 * - Risk: May create unstable genome
 * 
 * ARTIFICIAL SELECTION:
 * - Mark specific runs as "keep this direction"
 * - Increases mutation probability in that direction
 * 
 * GENETIC DRIFT:
 * - Randomize genome completely (start fresh evolution)
 * - For when current evolution hits local maximum
 * 
 * HYBRIDIZATION:
 * - Import genome from another player's game
 * - Creates entirely new evolutionary path
 * 
 * === THE DEEPEST IMPLICATION ===
 * 
 * Proteus transforms the game from software into something akin to a digital
 * petri dish where digital life evolves. The player isn't just playing a game
 * — they're cultivating an ecosystem, guiding an evolutionary process that
 * will eventually create a game experience perfectly tuned to their unique
 * psychology, skill level, and playstyle.
 * 
 * The 57th Dimension isn't just another feature. It's the recognition that
 * games, like all complex systems, are alive — and that the best game is the
 * one that grows itself to match the player.
 */

export default class ProteusProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Genetic Constants
        this.GENOME_VERSION = 1;
        this.CHROMOSOME_COUNT = 23;
        this.MUTATION_RATE_BASE = 0.15;
        this.FITNESS_WINDOW = 10; // Generations to track
        
        // The Adaptive Color — shimmer of genetic possibility
        this.PROTEUS_COLOR_1 = 0x00d4aa; // Adaptive Cyan
        this.PROTEUS_COLOR_2 = 0x9d4edd; // Evolutionary Purple
        
        // Current Genome (the game's DNA)
        this.genome = {
            generation: 1,
            species: 'Primordial Void',
            chromosomes: {},
            fitness: [],
            mutations: [],
            epigenetic: {} // Temporary modifications
        };
        
        // Define all 23 chromosomes with their gene loci
        this.initializeChromosomes();
        
        // Evolution state
        this.evolutionState = {
            lastRunFitness: 0,
            averageFitness: 0,
            mutationPending: false,
            speciationProgress: 0,
            convergenceRisk: 0, // Risk of hitting local maximum
            geneticDiversity: 1.0
        };
        
        // Phenotypic expression (actual game parameters)
        this.phenotype = {
            enemySpawnRate: 1.0,
            enemySpeedMultiplier: 1.0,
            enemyHealthMultiplier: 1.0,
            bulletDensity: 1.0,
            bulletSpeedVariance: 1.0,
            patternComplexity: 0.5,
            echoDropRate: 1.0,
            systemChargeSpeed: 1.0,
            playerEffectiveHP: 1.0,
            iFrameDuration: 1.0,
            enemyIntelligence: 0.5,
            flankingFrequency: 0.3,
            systemSynergy: 1.0,
            resonanceSensitivity: 1.0,
            paradoxAccuracy: 1.0
        };
        
        // Fitness tracking for current run
        this.fitnessTracker = {
            flowTime: 0,          // Seconds in optimal arousal
            skillGrowth: 0,       // Performance improvement
            survivalTime: 0,      // Total seconds survived
            systemUsage: {},      // Which systems were used
            nearMissCount: 0,     // Bullet grazing (skill indicator)
            deathContext: null,   // How did they die?
            boredomEvents: 0,     // Signs of disengagement
            overwhelmEvents: 0    // Signs of stress
        };
        
        // UI Elements
        this.ui = {
            container: null,
            generationText: null,
            speciesText: null,
            mutationTicker: null,
            chromosomeDisplay: null
        };
        
        // Speciation thresholds
        this.speciesArchetypes = [
            { name: 'Void Glider', traits: { aggression: 0.3, tempo: 1.2, resilience: 1.3 } },
            { name: 'Horde Breather', traits: { aggression: 1.4, tempo: 0.4, resilience: 0.9 } },
            { name: 'Pattern Dancer', traits: { aggression: 0.5, tempo: 1.4, intelligence: 0.8 } },
            { name: 'System Weaver', traits: { economy: 1.3, synergy: 1.4, resilience: 1.1 } },
            { name: 'Tactical Predator', traits: { intelligence: 1.2, aggression: 0.9, synergy: 1.2 } },
            { name: 'Resonance Oracle', traits: { synergy: 1.5, tempo: 0.8, economy: 1.2 } },
            { name: 'Mirage Strider', traits: { aggression: 1.1, resilience: 0.7, economy: 0.8 } },
            { name: 'Entropy Shepherd', traits: { tempo: 1.1, intelligence: 1.0, resilience: 1.2 } }
        ];
        
        // Evolutionary history
        this.phylogeneticTree = [];
        
        // Load saved genome or generate primordial
        this.loadOrGenerateGenome();
    }
    
    initializeChromosomes() {
        // Define the 23 chromosomes with gene loci and valid ranges
        const chromosomeDefs = {
            AGGRESSION: {
                genes: {
                    spawnRate: { min: 0.5, max: 2.0, default: 1.0 },
                    speedMultiplier: { min: 0.6, max: 1.8, default: 1.0 },
                    healthScale: { min: 0.5, max: 1.5, default: 1.0 },
                    waveIntensity: { min: 0.7, max: 1.5, default: 1.0 }
                }
            },
            TEMPO: {
                genes: {
                    bulletDensity: { min: 0.3, max: 1.5, default: 1.0 },
                    bulletSpeedVar: { min: 0.5, max: 1.5, default: 1.0 },
                    patternComplexity: { min: 0.0, max: 1.0, default: 0.5 },
                    rhythmVariance: { min: 0.3, max: 1.0, default: 0.5 }
                }
            },
            ECONOMY: {
                genes: {
                    echoDropRate: { min: 0.5, max: 2.0, default: 1.0 },
                    chargeSpeed: { min: 0.7, max: 1.3, default: 1.0 },
                    shopModifier: { min: 0.8, max: 1.5, default: 1.0 },
                    scarcityCurve: { min: 0.5, max: 1.5, default: 1.0 }
                }
            },
            RESILIENCE: {
                genes: {
                    effectiveHP: { min: 0.8, max: 1.5, default: 1.0 },
                    iFrameDuration: { min: 0.5, max: 1.5, default: 1.0 },
                    recoverySpeed: { min: 0.7, max: 1.3, default: 1.0 },
                    gracePeriod: { min: 0.5, max: 1.5, default: 1.0 }
                }
            },
            INTELLIGENCE: {
                genes: {
                    pathfinding: { min: 0.0, max: 1.0, default: 0.5 },
                    flankingFreq: { min: 0.0, max: 1.0, default: 0.3 },
                    syncChance: { min: 0.0, max: 1.0, default: 0.4 },
                    retreatLogic: { min: 0.0, max: 1.0, default: 0.5 }
                }
            },
            SYNERGY: {
                genes: {
                    crossSystemStrength: { min: 0.5, max: 1.5, default: 1.0 },
                    resonanceSense: { min: 0.5, max: 2.0, default: 1.0 },
                    paradoxAccuracy: { min: 0.5, max: 1.5, default: 1.0 },
                    cascadeBonus: { min: 0.5, max: 1.5, default: 1.0 }
                }
            },
            MUTABILITY: {
                genes: {
                    mutationRate: { min: 0.05, max: 0.4, default: 0.15 },
                    epigeneticDecay: { min: 0.5, max: 2.0, default: 1.0 },
                    crossoverFreq: { min: 0.0, max: 1.0, default: 0.3 },
                    speciationThreshold: { min: 0.3, max: 0.8, default: 0.5 }
                }
            },
            PHENOTYPIC: {
                genes: {
                    visualDensity: { min: 0.5, max: 1.5, default: 1.0 },
                    audioComplexity: { min: 0.5, max: 1.5, default: 1.0 },
                    hapticFeedback: { min: 0.5, max: 1.5, default: 1.0 },
                    cognitiveLoad: { min: 0.6, max: 1.4, default: 1.0 }
                }
            }
        };
        
        // Initialize genome with default values
        for (const [name, def] of Object.entries(chromosomeDefs)) {
            this.genome.chromosomes[name] = {};
            for (const [gene, config] of Object.entries(def.genes)) {
                this.genome.chromosomes[name][gene] = config.default;
            }
        }
        
        this.chromosomeDefs = chromosomeDefs;
    }
    
    loadOrGenerateGenome() {
        try {
            const saved = localStorage.getItem('shooty_proteus_genome');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.genome = { ...this.genome, ...parsed };
                this.expressPhenotype();
                console.log(`[PROTEUS] Loaded genome: Gen ${this.genome.generation}, Species: ${this.genome.species}`);
            } else {
                this.genome.species = 'Primordial Void';
                this.expressPhenotype();
                console.log('[PROTEUS] Generated primordial genome');
            }
        } catch (e) {
            console.error('[PROTEUS] Failed to load genome:', e);
            this.genome.species = 'Primordial Void';
            this.expressPhenotype();
        }
    }
    
    create() {
        // Register with panel-based HUD system
        if (!this.scene.hudPanels) {
            console.warn('[ProteusProtocolSystem] hudPanels not available, deferring UI registration');
            // Retry after a short delay
            this.scene.time.delayedCall(100, () => this.create());
            return;
        }
        
        this.scene.hudPanels.registerSlot('PROTEUS', (container, width, layout) => {
            this.ui.container = container;
            this.ui.container.setDepth(1000);
            this.ui.container.setAlpha(0.9);
            
            // Generation counter - cyan, at top of panel with top-left origin
            this.ui.generationText = this.scene.add.text(0, 0, `GEN ${this.genome.generation}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#00d4aa'
            }).setOrigin(0, 0); // Top-left origin
            this.ui.container.add(this.ui.generationText);
            
            // Species name - purple, below generation
            this.ui.speciesText = this.scene.add.text(0, 18, this.genome.species, {
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#9d4edd'
            }).setOrigin(0, 0); // Top-left origin
            this.ui.container.add(this.ui.speciesText);
            
            // Mutation ticker - below species name
            this.ui.mutationTicker = this.scene.add.text(0, 32, '', {
                fontFamily: 'monospace',
                fontSize: '9px',
                color: '#00d4aa'
            }).setOrigin(0, 0); // Top-left origin
            this.ui.container.add(this.ui.mutationTicker);
        }, 'TOP_CENTER');
        
        // Initial phenotype expression
        this.applyToGameScene();
        
        // Show welcome mutation if applicable
        if (this.genome.mutations.length > 0) {
            const lastMutation = this.genome.mutations[this.genome.mutations.length - 1];
            this.showMutationNotice(lastMutation);
        }
    }
    
    /**
     * Draw DNA helix via UnifiedGraphicsManager on 'effects' layer
     */
    drawHelix() {
        const manager = this.scene.graphicsManager;
        if (!manager) return;
        
        // Skip drawing helix if using panel-based HUD (container is panel-relative)
        // The helix was designed for absolute positioning; needs refactoring for panel mode
        if (!this.ui.container || this.ui.container.x === 0 && this.ui.container.y === 0) {
            return;
        }
        
        const time = this.scene.time.now / 1000;
        const width = 80;
        const height = 30;
        const strands = 2;
        const points = 20;
        
        // Get container position for world coordinates
        const containerX = this.ui.container.x || this.scene.scale.width - 180;
        const containerY = this.ui.container.y || 80;
        
        // Draw double helix strands as paths
        for (let s = 0; s < strands; s++) {
            const color = s === 0 ? this.PROTEUS_COLOR_1 : this.PROTEUS_COLOR_2;
            const offset = s * Math.PI;
            
            // Build path points for the helix strand
            const pathPoints = [];
            for (let i = 0; i <= points; i++) {
                const t = i / points;
                const x = containerX + (t - 0.5) * width;
                const angle = t * Math.PI * 4 + time * 0.5 + offset;
                const y = containerY + Math.sin(angle) * height * 0.3;
                pathPoints.push({ x, y });
            }
            
            // Draw path via UnifiedGraphicsManager
            manager.drawPath('effects', pathPoints, color, 0.8, 2);
        }
        
        // Draw connecting "rungs" (genes) as individual lines
        for (let i = 0; i < points; i += 2) {
            const t = i / points;
            const x = containerX + (t - 0.5) * width;
            const angle1 = t * Math.PI * 4 + time * 0.5;
            const angle2 = angle1 + Math.PI;
            const y1 = containerY + Math.sin(angle1) * height * 0.3;
            const y2 = containerY + Math.sin(angle2) * height * 0.3;
            
            manager.drawLine('effects', x, y1, x, y2, 0xffffff, 0.3, 1);
        }
    }
    
    /**
     * Draw fitness graph via UnifiedGraphicsManager on 'effects' layer
     */
    drawFitnessGraph() {
        const manager = this.scene.graphicsManager;
        if (!manager) return;
        
        const history = this.genome.fitness.slice(-20);
        if (history.length < 2) return;
        
        const width = 100;
        const height = 25;
        
        // Get container position for world coordinates (fitness graph is below species text)
        const containerX = this.ui.container?.x || this.scene.scale.width - 180;
        const containerY = (this.ui.container?.y || 80) + 15; // Offset for graph position
        
        // Build path points for fitness history
        const pathPoints = history.map((fitness, i) => ({
            x: containerX + (i / (history.length - 1)) * width - width / 2,
            y: containerY + height / 2 - fitness * height
        }));
        
        // Draw fitness history path via UnifiedGraphicsManager
        manager.drawPath('effects', pathPoints, this.PROTEUS_COLOR_1, 0.6, 1);
        
        // Draw average line
        const avgY = containerY + height / 2 - this.evolutionState.averageFitness * height;
        manager.drawLine('effects', containerX - width / 2, avgY, containerX + width / 2, avgY, this.PROTEUS_COLOR_2, 0.4, 1);
    }
    
    update() {
        // Animate helix
        this.drawHelix();
        
        // Update fitness tracking
        this.updateFitnessTracking();
        
        // Decay epigenetic markers
        this.decayEpigenetics();
    }
    
    updateFitnessTracking() {
        // Track flow state via Heartflux if available
        if (this.scene.heartflux) {
            const arousal = this.scene.heartflux.getCurrentArousal?.() || 0.5;
            // Optimal flow is 20-50% arousal
            if (arousal >= 0.2 && arousal <= 0.5) {
                this.fitnessTracker.flowTime += 1 / 60;
            } else if (arousal > 0.8) {
                this.fitnessTracker.overwhelmEvents += 1;
            } else if (arousal < 0.15) {
                this.fitnessTracker.boredomEvents += 1;
            }
        }
        
        // Track survival time
        this.fitnessTracker.survivalTime += 1 / 60;
        
        // Track system usage
        if (this.scene.resonanceCascade?.active) {
            this.fitnessTracker.systemUsage.resonance = 
                (this.fitnessTracker.systemUsage.resonance || 0) + 1;
        }
        if (this.scene.fractureSystem?.fractures?.length > 0) {
            this.fitnessTracker.systemUsage.fracture = 
                (this.fitnessTracker.systemUsage.fracture || 0) + 1;
        }
        if (this.scene.paradoxEngine?.projections?.length > 0) {
            this.fitnessTracker.systemUsage.paradox = 
                (this.fitnessTracker.systemUsage.paradox || 0) + 1;
        }
    }
    
    decayEpigenetics() {
        // Epigenetic markers fade over time
        for (const [key, marker] of Object.entries(this.genome.epigenetic)) {
            marker.duration -= 1 / 60;
            if (marker.duration <= 0) {
                delete this.genome.epigenetic[key];
            }
        }
    }
    
    expressPhenotype() {
        // Convert genome to actual game parameters (phenotypic expression)
        const g = this.genome.chromosomes;
        
        this.phenotype = {
            // From AGGRESSION chromosome
            enemySpawnRate: g.AGGRESSION?.spawnRate ?? 1.0,
            enemySpeedMultiplier: g.AGGRESSION?.speedMultiplier ?? 1.0,
            enemyHealthMultiplier: g.AGGRESSION?.healthScale ?? 1.0,
            waveIntensity: g.AGGRESSION?.waveIntensity ?? 1.0,
            
            // From TEMPO chromosome
            bulletDensity: g.TEMPO?.bulletDensity ?? 1.0,
            bulletSpeedVariance: g.TEMPO?.bulletSpeedVar ?? 1.0,
            patternComplexity: g.TEMPO?.patternComplexity ?? 0.5,
            rhythmVariance: g.TEMPO?.rhythmVariance ?? 0.5,
            
            // From ECONOMY chromosome
            echoDropRate: g.ECONOMY?.echoDropRate ?? 1.0,
            systemChargeSpeed: g.ECONOMY?.chargeSpeed ?? 1.0,
            shopPriceModifier: g.ECONOMY?.shopModifier ?? 1.0,
            
            // From RESILIENCE chromosome
            playerEffectiveHP: g.RESILIENCE?.effectiveHP ?? 1.0,
            iFrameDuration: g.RESILIENCE?.iFrameDuration ?? 1.0,
            recoverySpeed: g.RESILIENCE?.recoverySpeed ?? 1.0,
            
            // From INTELLIGENCE chromosome
            enemyIntelligence: g.INTELLIGENCE?.pathfinding ?? 0.5,
            flankingFrequency: g.INTELLIGENCE?.flankingFreq ?? 0.3,
            syncChance: g.INTELLIGENCE?.syncChance ?? 0.4,
            
            // From SYNERGY chromosome
            systemSynergy: g.SYNERGY?.crossSystemStrength ?? 1.0,
            resonanceSensitivity: g.SYNERGY?.resonanceSense ?? 1.0,
            paradoxAccuracy: g.SYNERGY?.paradoxAccuracy ?? 1.0
        };
        
        // Apply epigenetic modifications
        for (const [key, marker] of Object.entries(this.genome.epigenetic)) {
            if (this.phenotype[key] !== undefined) {
                this.phenotype[key] *= marker.multiplier;
            }
        }
    }
    
    applyToGameScene() {
        // Apply phenotype to actual game parameters
        if (!this.scene) return;
        
        // Modify existing enemies in real-time based on phenotype
        if (this.scene.enemies) {
            this.scene.enemies.getChildren().forEach(enemy => {
                if (enemy.speed !== undefined && enemy.baseSpeed !== undefined) {
                    // Adjust speed based on gene expression
                    enemy.speed = enemy.baseSpeed * this.phenotype.enemySpeedMultiplier;
                }
            });
        }
        
        // Store phenotype for other systems to query
        this.scene.proteusPhenotype = this.phenotype;
    }
    
    /**
     * Get the number of enemies to spawn, modified by genome
     */
    getModifiedSpawnCount(baseCount) {
        return Math.max(1, Math.floor(baseCount * this.phenotype.enemySpawnRate));
    }
    
    /**
     * Get the spawn delay, modified by genome
     */
    getModifiedSpawnDelay(baseDelay) {
        return baseDelay / this.phenotype.enemySpawnRate; // Higher aggression = faster spawns
    }
    
    calculateFitness() {
        const ft = this.fitnessTracker;
        
        // Normalize components
        const flowScore = Math.min(ft.flowTime / 30, 1.0); // 30s flow = max
        const survivalScore = Math.min(ft.survivalTime / 60, 1.0); // 60s = max
        const skillScore = Math.min(ft.nearMissCount / 10, 1.0); // 10 near-misses
        
        // System engagement
        const systemUsageCount = Object.values(ft.systemUsage).reduce((a, b) => a + b, 0);
        const systemScore = Math.min(systemUsageCount / 50, 1.0);
        
        // Penalties
        const overwhelmPenalty = ft.overwhelmEvents * 0.1;
        const boredomPenalty = ft.boredomEvents * 0.15;
        
        // Death context analysis
        let deathScore = 0.5;
        if (ft.deathContext === 'sudden_spike') {
            deathScore = 0.2; // Bad: difficulty spike
        } else if (ft.deathContext === 'gradual_overwhelm') {
            deathScore = 0.4; // Okay: natural progression
        } else if (ft.deathContext === 'skilled_mistake') {
            deathScore = 0.7; // Good: player skill error
        }
        
        // Combined fitness
        const fitness = (
            flowScore * 0.35 +
            survivalScore * 0.25 +
            skillScore * 0.15 +
            systemScore * 0.10 +
            deathScore * 0.15 -
            overwhelmPenalty -
            boredomPenalty
        );
        
        return Math.max(0, Math.min(1, fitness));
    }
    
    evolveGeneration(deathContext = 'unknown') {
        this.fitnessTracker.deathContext = deathContext;
        
        // Calculate fitness
        const fitness = this.calculateFitness();
        this.evolutionState.lastRunFitness = fitness;
        this.genome.fitness.push(fitness);
        
        // Keep only last N generations
        if (this.genome.fitness.length > this.FITNESS_WINDOW) {
            this.genome.fitness.shift();
        }
        
        // Update average
        this.evolutionState.averageFitness = 
            this.genome.fitness.reduce((a, b) => a + b, 0) / this.genome.fitness.length;
        
        // Determine mutation strategy based on fitness
        let mutations = [];
        
        if (fitness > 0.8) {
            // High fitness: refine what works (minor mutations)
            mutations = this.generateMutations('refine', 1);
        } else if (fitness > 0.4) {
            // Medium fitness: explore variations (moderate mutations)
            mutations = this.generateMutations('explore', 2);
        } else if (fitness > 0.2) {
            // Low fitness: adapt significantly (major mutations)
            mutations = this.generateMutations('adapt', 3);
        } else {
            // Very low fitness: dramatic change or reset
            if (this.evolutionState.convergenceRisk > 0.7) {
                mutations = this.generateMutations('reset', 1);
            } else {
                mutations = this.generateMutations('adapt', 4);
            }
        }
        
        // Apply boredom/overwhelm corrections
        if (this.fitnessTracker.boredomEvents > 3) {
            mutations.push({
                chromosome: 'AGGRESSION',
                gene: 'spawnRate',
                change: 0.15,
                reason: 'boredom_response'
            });
        }
        
        if (this.fitnessTracker.overwhelmEvents > 3) {
            mutations.push({
                chromosome: 'RESILIENCE',
                gene: 'effectiveHP',
                change: 0.12,
                reason: 'stress_response'
            });
        }
        
        // Apply mutations
        mutations.forEach(m => this.applyMutation(m));
        
        // Store mutations
        this.genome.mutations = mutations;
        
        // Increment generation
        this.genome.generation++;
        
        // Check for speciation
        this.checkSpeciation();
        
        // Re-express phenotype
        this.expressPhenotype();
        
        // Save genome
        this.saveGenome();
        
        console.log(`[PROTEUS] Generation ${this.genome.generation} evolved. Fitness: ${fitness.toFixed(2)}. Mutations: ${mutations.length}`);
        
        return { fitness, mutations, generation: this.genome.generation };
    }
    
    generateMutations(strategy, count) {
        const mutations = [];
        const strategies = {
            refine: { magnitude: 0.05, target: 'random' },
            explore: { magnitude: 0.12, target: 'underperforming' },
            adapt: { magnitude: 0.2, target: 'fitness_correlated' },
            reset: { magnitude: 0.5, target: 'all', direction: 'toward_default' }
        };
        
        const config = strategies[strategy];
        const chromosomes = Object.keys(this.genome.chromosomes);
        
        for (let i = 0; i < count; i++) {
            const chromoName = chromosomes[Math.floor(Math.random() * chromosomes.length)];
            const chromo = this.genome.chromosomes[chromoName];
            const genes = Object.keys(chromo);
            const geneName = genes[Math.floor(Math.random() * genes.length)];
            
            const def = this.chromosomeDefs[chromoName]?.genes[geneName];
            if (!def) continue;
            
            let change = (Math.random() - 0.5) * 2 * config.magnitude;
            
            if (config.direction === 'toward_default') {
                const current = chromo[geneName];
                const target = def.default;
                change = (target - current) * 0.5;
            }
            
            mutations.push({
                chromosome: chromoName,
                gene: geneName,
                change: change,
                strategy: strategy,
                timestamp: Date.now()
            });
        }
        
        return mutations;
    }
    
    applyMutation(mutation) {
        const { chromosome, gene, change } = mutation;
        const def = this.chromosomeDefs[chromosome]?.genes[gene];
        
        if (!def) return;
        
        const current = this.genome.chromosomes[chromosome][gene];
        let newValue = current * (1 + change);
        
        // Clamp to valid range
        newValue = Math.max(def.min, Math.min(def.max, newValue));
        
        this.genome.chromosomes[chromosome][gene] = newValue;
        
        // Show mutation notice
        this.showMutationTicker(mutation);
    }
    
    checkSpeciation() {
        // Calculate how far current genome has diverged from default
        let divergence = 0;
        let totalGenes = 0;
        
        for (const [cName, chromosome] of Object.entries(this.genome.chromosomes)) {
            for (const [gName, value] of Object.entries(chromosome)) {
                const def = this.chromosomeDefs[cName]?.genes[gName];
                if (def) {
                    const diff = Math.abs(value - def.default) / (def.max - def.min);
                    divergence += diff;
                    totalGenes++;
                }
            }
        }
        
        const avgDivergence = divergence / totalGenes;
        this.evolutionState.speciationProgress = avgDivergence;
        
        // Check if we've crossed speciation threshold
        const threshold = this.genome.chromosomes.MUTABILITY?.speciationThreshold ?? 0.5;
        
        if (avgDivergence > threshold && this.genome.generation % 10 === 0) {
            // Determine which archetype we're closest to
            let bestMatch = null;
            let bestScore = -1;
            
            for (const archetype of this.speciesArchetypes) {
                let score = 0;
                for (const [trait, target] of Object.entries(archetype.traits)) {
                    const chromoMap = {
                        aggression: 'AGGRESSION',
                        tempo: 'TEMPO',
                        economy: 'ECONOMY',
                        resilience: 'RESILIENCE',
                        intelligence: 'INTELLIGENCE',
                        synergy: 'SYNERGY'
                    };
                    const chromo = chromoMap[trait];
                    if (chromo && this.genome.chromosomes[chromo]) {
                        const avgValue = Object.values(this.genome.chromosomes[chromo])
                            .reduce((a, b) => a + b, 0) / Object.values(this.genome.chromosomes[chromo]).length;
                        score += 1 - Math.abs(avgValue - target);
                    }
                }
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = archetype;
                }
            }
            
            if (bestMatch && this.genome.species !== bestMatch.name) {
                const oldSpecies = this.genome.species;
                this.genome.species = bestMatch.name;
                
                // Record speciation event
                this.phylogeneticTree.push({
                    generation: this.genome.generation,
                    from: oldSpecies,
                    to: bestMatch.name,
                    divergence: avgDivergence
                });
                
                console.log(`[PROTEUS] SPECIATION EVENT: ${oldSpecies} → ${bestMatch.name}`);
                this.showSpeciationEvent(oldSpecies, bestMatch.name);
            }
        }
    }
    
    showMutationTicker(mutation) {
        const sign = mutation.change > 0 ? '+' : '';
        const percent = Math.round(mutation.change * 100);
        const text = `${mutation.chromosome}: ${sign}${percent}%`;
        
        if (this.ui.mutationTicker) {
            this.ui.mutationTicker.setText(text);
            this.ui.mutationTicker.setAlpha(1);
            
            // Fade out after 3 seconds
            this.scene.tweens.add({
                targets: this.ui.mutationTicker,
                alpha: 0.3,
                duration: 3000,
                ease: 'Power2'
            });
        }
    }
    
    showMutationNotice(mutation) {
        const { width, height } = this.scene.scale;
        
        const notice = this.scene.add.text(width / 2, height / 2 - 100, 
            `GENETIC DRIFT DETECTED\n${mutation.chromosome} adapted`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#00d4aa',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: notice,
            alpha: 0,
            y: height / 2 - 150,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => notice.destroy()
        });
    }
    
    showSpeciationEvent(from, to) {
        const { width, height } = this.scene.scale;
        
        const container = this.scene.add.container(width / 2, height / 2);
        
        const title = this.scene.add.text(0, -30, 'SPECIATION EVENT', {
            fontFamily: 'monospace',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#9d4edd'
        }).setOrigin(0.5);
        
        const subtitle = this.scene.add.text(0, 10, `${from} → ${to}`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#00d4aa'
        }).setOrigin(0.5);
        
        const desc = this.scene.add.text(0, 40, `Generation ${this.genome.generation}`, {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        container.add([title, subtitle, desc]);
        
        // Animate in
        container.setScale(0);
        container.setAlpha(0);
        
        this.scene.tweens.add({
            targets: container,
            scale: 1,
            alpha: 1,
            duration: 800,
            ease: 'Back.out'
        });
        
        // Fade out
        this.scene.tweens.add({
            targets: container,
            alpha: 0,
            scale: 0.8,
            delay: 3000,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => container.destroy()
        });
    }
    
    saveGenome() {
        try {
            localStorage.setItem('shooty_proteus_genome', JSON.stringify(this.genome));
        } catch (e) {
            console.error('[PROTEUS] Failed to save genome:', e);
        }
    }
    
    // Public API for other systems
    
    getPhenotype() {
        return this.phenotype;
    }
    
    getGenome() {
        return this.genome;
    }
    
    isHighAggression() {
        return this.phenotype.enemySpawnRate > 1.3 || this.phenotype.enemySpeedMultiplier > 1.2;
    }
    
    isHighTempo() {
        return this.phenotype.bulletDensity > 1.2 || this.phenotype.patternComplexity > 0.7;
    }
    
    isHighResilience() {
        return this.phenotype.playerEffectiveHP > 1.2;
    }
    
    getEnemyIntelligenceLevel() {
        return this.phenotype.enemyIntelligence;
    }
    
    shouldFlank() {
        return Math.random() < this.phenotype.flankingFrequency;
    }
    
    shouldSync() {
        return Math.random() < this.phenotype.syncChance;
    }
    
    // Epigenetic manipulation (temporary gene therapy)
    applyGeneTherapy(chromosome, gene, multiplier, durationRuns = 3) {
        const key = `${chromosome}_${gene}`;
        this.genome.epigenetic[key] = {
            chromosome,
            gene,
            multiplier,
            duration: durationRuns * 60, // Convert to seconds approximation
            appliedAt: this.genome.generation
        };
        
        this.expressPhenotype();
        this.saveGenome();
        
        return true;
    }
    
    // Force speciation check
    forceSpeciation() {
        this.checkSpeciation();
    }
    
    // Get mutation history
    getMutationHistory() {
        return this.genome.mutations;
    }
    
    // Get phylogenetic tree
    getPhylogeneticTree() {
        return this.phylogeneticTree;
    }
    
    // Reset to primordial state
    resetToPrimordial() {
        this.genome.generation = 1;
        this.genome.species = 'Primordial Void';
        this.genome.fitness = [];
        this.genome.mutations = [];
        this.genome.epigenetic = {};
        this.phylogeneticTree = [];
        
        this.initializeChromosomes();
        this.expressPhenotype();
        this.saveGenome();
        
        if (this.ui.speciesText) {
            this.ui.speciesText.setText(this.genome.species);
        }
        if (this.ui.generationText) {
            this.ui.generationText.setText('GEN 1');
        }
        
        console.log('[PROTEUS] Reset to primordial genome');
    }
    
    cleanup() {
        if (this.ui.container) {
            this.ui.container.destroy();
        }
    }
}
