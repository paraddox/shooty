import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import EchoStormSystem from '../systems/EchoStormSystem.js';
import FractureSystem from '../systems/FractureSystem.js';
import TemporalResidueSystem from '../systems/TemporalResidueSystem.js';
import ResonanceCascadeSystem from '../systems/ResonanceCascadeSystem.js';
import TemporalSingularitySystem from '../systems/TemporalSingularitySystem.js';
import OmniWeaponSystem from '../systems/OmniWeaponSystem.js';
import ParadoxEngineSystem from '../systems/ParadoxEngineSystem.js';
import ChronoLoopSystem from '../systems/ChronoLoopSystem.js';
import QuantumImmortalitySystem from '../systems/QuantumImmortalitySystem.js';
import ObserverEffectSystem from '../systems/ObserverEffectSystem.js';
import VoidCoherenceSystem from '../systems/VoidCoherenceSystem.js';
import TesseractTitan from '../systems/TesseractTitanSystem.js';
import TimelineChronicleSystem from '../systems/TimelineChronicleSystem.js';
import TemporalContractSystem from '../systems/TemporalContractSystem.js';
import CausalEntanglementSystem from '../systems/CausalEntanglementSystem.js';
import CinematicArchiveSystem from '../systems/CinematicArchiveSystem.js';
import SymbioticPredictionSystem from '../systems/SymbioticPredictionSystem.js';
import DimensionalCollapseSystem from '../systems/DimensionalCollapseSystem.js';
import TemporalRewindSystem from '../systems/TemporalRewindSystem.js';
import MnemosyneWeaveSystem from '../systems/MnemosyneWeaveSystem.js';
import KairosMomentSystem from '../systems/KairosMomentSystem.js';
import SyntropyEngineSystem from '../systems/SyntropyEngineSystem.js';
import NemesisGenesisSystem from '../systems/NemesisGenesisSystem.js';
import OracleProtocolSystem from '../systems/OracleProtocolSystem.js';
import ResonantWhisperSystem from '../systems/ResonantWhisperSystem.js';
import EgregoreProtocolSystem from '../systems/EgregoreProtocolSystem.js';
import AethericConvergenceSystem from '../systems/AethericConvergenceSystem.js';
import RecursionEngineSystem from '../systems/RecursionEngineSystem.js';
import HarmonicConvergenceSystem from '../systems/HarmonicConvergenceSystem.js';
import SynchronicityCascadeSystem from '../systems/SynchronicityCascadeSystem.js';
import BootstrapProtocolSystem from '../systems/BootstrapProtocolSystem.js';
import GeometricChorusSystem from '../systems/GeometricChorusSystem.js';
import ArchitectSystem from '../systems/ArchitectSystem.js';
import NarrativeConvergenceSystem from '../systems/NarrativeConvergenceSystem.js';
import NoeticMirrorSystem from '../systems/NoeticMirrorSystem.js';
import AmbientAwarenessSystem from '../systems/AmbientAwarenessSystem.js';
import DissolutionProtocolSystem from '../systems/DissolutionProtocolSystem.js';
import TemporalPedagogySystem from '../systems/TemporalPedagogySystem.js';
import AthenaeumProtocolSystem from '../systems/AthenaeumProtocolSystem.js';
import AxiomNexusSystem from '../systems/AxiomNexusSystem.js';
import InscriptionProtocolSystem from '../systems/InscriptionProtocolSystem.js';
import SynaesthesiaProtocolSystem from '../systems/SynaesthesiaProtocolSystem.js';
import TychosAuroraSystem from '../systems/TychosAuroraSystem.js';
import RivalProtocolSystem from '../systems/RivalProtocolSystem.js';
import RhythmOfTheVoidSystem from '../systems/RhythmOfTheVoidSystem.js';
import ApertureProtocolSystem from '../systems/ApertureProtocolSystem.js';
import CartographerProtocolSystem from '../systems/CartographerProtocolSystem.js';
import ResonanceOrbSystem from '../systems/ResonanceOrbSystem.js';
import SanctumProtocolSystem from '../systems/SanctumProtocolSystem.js';
import MetaSystemOperator from '../systems/MetaSystemOperator.js';
import LivingWorldSystem from '../systems/LivingWorldSystem.js';
import DreamStateProtocol from '../systems/DreamStateProtocol.js';
import ApopheniaProtocol from '../systems/ApopheniaProtocol.js';
import VoidExchangeSystem from '../systems/VoidExchangeSystem.js';
import HeartfluxProtocolSystem from '../systems/HeartfluxProtocolSystem.js';
import ExogenesisProtocolSystem from '../systems/ExogenesisProtocolSystem.js';
import ProteusProtocolSystem from '../systems/ProteusProtocolSystem.js';
import UnifiedGraphicsManager from '../systems/UnifiedGraphicsManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Near-miss bullet time state
        this.nearMissState = {
            active: false,
            remaining: 0,
            cooldown: 0,
            streak: 0,
            timeSinceLast: 0,
            totalCount: 0
        };
        this.NEAR_MISS_RADIUS = 65;      // Detection radius
        this.HIT_RADIUS = 35;          // Actual hit radius (exclusion zone)
        this.SLOW_MO_SCALE = 0.25;       // Time scale during bullet time (0.25 = 25% speed)
        this.SLOW_MO_DURATION = 1.2;     // Base duration in seconds (increased for echo absorption)
        this.SLOW_MO_COOLDOWN = 1.5;     // Minimum seconds between triggers
        this.STREAK_WINDOW = 2.5;        // Seconds to chain near-misses
        this.STREAK_BONUS = 0.15;        // Extra duration per streak level
        
        // Echo Storm system
        this.echoStorm = null;
        
        // Fracture Protocol system
        this.fractureSystem = null;
        
        // Resonance Cascade system
        this.resonanceCascade = null;
        
        // Temporal Singularity system
        this.singularitySystem = null;
        
        // Omni-Weapon Adaptation system
        this.omniWeapon = null;
        
        // Paradox Engine system
        this.paradoxEngine = null;
        
        // Chrono-Loop system
        this.chronoLoop = null;
        
        // Quantum Immortality system
        this.quantumImmortality = null;
        
        // Observer Effect system (the game that watches you back)
        this.observerEffect = null;
        
        // Void Coherence system (the quantum vacuum made manifest)
        this.voidCoherence = null;
        
        // Tesseract Titan - The Geometric Overseer (boss system)
        this.tesseractTitan = null;
        this.bossSpawned = false;
        this.bossWave = 5; // Wave 5 spawns the boss
        
        // Timeline Chronicle - records every run as a permanent shard
        this.timelineChronicle = null;
        
        // Temporal Contract System - Chronos Covenant
        this.temporalContract = null;
        
        // Causal Entanglement System - Quantum Topology Warfare
        this.causalEntanglement = null;
        
        // Cinematic Archive System - Captures "movie moments"
        this.cinematicArchive = null;
        
        // Symbiotic Prediction System - The game that thinks with you
        this.symbioticPrediction = null;
        
        // Dimensional Collapse System - The apotheosis of temporal mastery
        this.dimensionalCollapse = null;
        
        // Temporal Rewind System - Intentional time manipulation
        this.temporalRewind = null;
        
        // Mnemosyne Weave System - The Living Monument
        this.mnemosyneWeave = null;
        
        // Kairos Moment System - The Crystallization of Flow
        this.kairosMoment = null;
        
        // Syntropy Engine - The Anti-Entropy Protocol
        this.syntropyEngine = null;
        
        // Nemesis Genesis System — The Adversarial Mirror
        this.nemesisGenesis = null;
        
        // Oracle Protocol System — Temporal Guidance from Unrealized Futures
        this.oracleProtocol = null;
        
        // Resonant Whisper System — Cross-Timeline Communication
        this.resonantWhispers = null;
        
        // Egregore Protocol System — Collective Unconscious as Game Designer
        this.egregoreProtocol = null;
        
        // Ætheric Convergence System — The Apotheosis of Emergence
        this.aethericConvergence = null;
        
        // Recursion Engine — The Game That Becomes You
        this.recursionEngine = null;
        
        // Harmonic Convergence System — The Music of Temporal Combat
        this.harmonicConvergence = null;
        
        // Synchronicity Cascade — The Transcendental Convergence
        this.synchronicityCascade = null;
        
        // Bootstrap Protocol — The Retrocausal Discovery Engine
        this.bootstrapProtocol = null;
        
        // Geometric Chorus System — The Living Arena
        this.geometricChorus = null;
        
        // Architect System — Player-Authored Mechanics
        this.architectSystem = null;
        
        // NarrativeConvergenceSystem — The Saga Engine
        this.sagaEngine = null;
        
        // Noetic Mirror System — The Self-Aware Commentary Engine
        this.noeticMirror = null;
        
        // Ambient Awareness System — The Game That Breathes With Reality
        this.ambientAwareness = null;
        
        // Dissolution Protocol — The Art of Intentional Forgetting
        this.dissolutionProtocol = null;
        
        // Temporal Pedagogy System — The Self-Teaching Game
        this.temporalPedagogy = null;
        
        // Athenaeum Protocol — The Geography of Memory (39th dimension)
        this.athenaeumProtocol = null;
        
        // Axiom Nexus — The Synthesis Mentor (40th dimension: PEDAGOGICAL SYNTHESIS)
        this.axiomNexus = null;
        
        // Inscription Protocol — Transcendence Through Persistent Memory (41st dimension)
        this.inscriptionProtocol = null;
        
        // Synaesthesia Protocol — The 42nd Dimension: AUDITORY SYNTHESIS
        this.synaesthesiaProtocol = null;
        
        // Tychos Aurora Protocol — The 43rd Dimension: PHASE SPACE MANIFESTATION
        this.tychosAurora = null;
        
        // Rival Protocol — The 44th Dimension: RELATIONAL EVOLUTION
        this.rivalProtocol = null;
        
        // Rhythm of the Void — The 45th Dimension: MUSICAL ONTOGENESIS
        this.rhythmOfTheVoid = null;
        
        // Aperture Protocol — The 46th Dimension: ATTENTION AS ONTOLOGY
        this.apertureProtocol = null;
        
        // Cartographer Protocol — The 47th Dimension: SPATIAL ONTOLOGY
        this.cartographerProtocol = null;
        
        // Resonance Orb System — The 48th Dimension: LIVING POWER-UPS
        this.resonanceOrbs = null;
        
        // Sanctum Protocol — The 49th Dimension: PERSISTENT SPATIAL METAGAME
        this.sanctumProtocol = null;
        
        // Meta-System Operator — The 50th Dimension: ARCHITECTURAL ONTOLOGY
        this.metaSystemOperator = null;
        
        // Living World Protocol — The 51st Dimension: AUTONOMOUS CONTINUITY
        this.livingWorld = null;
        
        // Dream State Protocol — The 52nd Dimension: ONEIRIC SYNTHESIS
        this.dreamState = null;
        
        // Apophenia Protocol — The 53rd Dimension: PATTERN DIVINATION
        this.apophenia = null;
        
        // Void Exchange System — The 54th Dimension: TEMPORAL CAPITALISM
        this.voidExchange = null;
        
        // Heartflux Protocol — The 55th Dimension: BIOMETRIC EMPATHY
        this.heartflux = null;
        
        // Exogenesis Protocol — The 56th Dimension: REALITY MANIFESTATION
        this.exogenesis = null;
        
        // Proteus Protocol — The 57th Dimension: THE EVOLUTION OF RULES
        this.proteus = null;
        
        // Equipped shard bonuses
        this.shardBonuses = {};
    }

    create() {
        // World bounds (game arena)
        const worldWidth = 1920;
        const worldHeight = 1440;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBackgroundColor('#0a0a0f');

        // Create environment
        this.createFloor();
        this.createAmbientGrid();

        // Player
        this.player = new Player(this, worldWidth / 2, worldHeight / 2);
        
        // Make Enemy class available to systems
        this.EnemyClass = Enemy;

        // Camera setup - zoom=1 base, mouse wheel can zoom
        this.cameras.main.setZoom(1.0);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.targetZoom = 1.0;
        
        // Center camera on player initially
        this.cameras.main.setScroll(
            this.player.x - this.cameras.main.width / 2,
            this.player.y - this.cameras.main.height / 2
        );
        
        // Mouse wheel zoom - immediate centering on player
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const zoomStep = 0.2;
            const camera = this.cameras.main;
            const worldWidth = 1920;
            const worldHeight = 1440;
            
            // Calculate new zoom
            let newZoom;
            if (deltaY > 0) {
                newZoom = Math.max(0.5, this.targetZoom - zoomStep);
            } else if (deltaY < 0) {
                newZoom = Math.min(1.5, this.targetZoom + zoomStep);
            } else {
                return; // No change
            }
            
            this.targetZoom = newZoom;
            
            // Calculate view size at new zoom
            const viewWidth = camera.width / newZoom;
            const viewHeight = camera.height / newZoom;
            
            // Calculate scroll to center on player (or center arena if view is larger)
            let scrollX, scrollY;
            
            if (viewWidth < worldWidth) {
                scrollX = this.player.x - viewWidth / 2;
                scrollX = Phaser.Math.Clamp(scrollX, 0, worldWidth - viewWidth);
            } else {
                scrollX = -(viewWidth - worldWidth) / 2;
            }
            
            if (viewHeight < worldHeight) {
                scrollY = this.player.y - viewHeight / 2;
                scrollY = Phaser.Math.Clamp(scrollY, 0, worldHeight - viewHeight);
            } else {
                scrollY = -(viewHeight - worldHeight) / 2;
            }
            
            // Apply immediately - no interpolation
            camera.setZoom(newZoom);
            camera.setScroll(scrollX, scrollY);
        });

        // Bullet pool with trails - 500 for bullet hell
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 500,
            runChildUpdate: true
        });

        // Enemy bullets pool - for bullet time near-miss detection
        this.enemyBullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 300,
            runChildUpdate: true
        });

        // Bullet trail particles
        this.bulletTrails = this.add.particles(0, 0, 'particle', {
            scale: { start: 0.6, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: 0,
            lifespan: 150,
            tint: 0xffff00,
            frequency: -1
        });
        
        // Enemy bullet trail particles (red)
        this.enemyBulletTrails = this.add.particles(0, 0, 'particle', {
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.5, end: 0 },
            speed: 0,
            lifespan: 150,
            tint: 0xff3366,
            frequency: -1
        });

        // Enemy hit particles
        this.hitParticles = this.add.particles(0, 0, 'particle', {
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            speed: { min: 50, max: 150 },
            lifespan: 400,
            gravityY: 0,
            quantity: 8,
            frequency: -1
        });

        // Enemy death particles
        this.deathParticles = this.add.particles(0, 0, 'particle', {
            scale: { start: 1.2, end: 0 },
            alpha: { start: 1, end: 0 },
            speed: { min: 80, max: 200 },
            lifespan: 600,
            gravityY: 0,
            quantity: 12,
            frequency: -1
        });

        // Enemies
        this.enemies = this.physics.add.group();
        this.spawnEnemies(4);

        // Spawn timer
        this.spawnTimer = this.time.addEvent({
            delay: 4000,
            callback: () => this.spawnEnemies(3),
            callbackScope: this,
            loop: true
        });

        // Collisions
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
        this.physics.add.overlap(this.enemyBullets, this.player, this.playerHitByBullet, null, this);
        this.physics.add.collider(this.enemies, this.enemies, this.enemyBounce, null, this);
        
        // Boss collision (will be set up when boss spawns)
        this.bossCollider = null;
        
        // Nemesis collision (will be set up when nemesis spawns)
        this.nemesisCollider = null;
        
        // Bullet time vignette overlay (for visual effect)
        this.createBulletTimeVignette();

        // Minimalist HUD
        this.createHUD();
        
        // Fix HUD elements to screen (ignore camera scroll/zoom)
        [this.healthBarBg, this.healthBar, this.scoreText, this.waveText, 
         this.enemyText, this.nearMissText, this.syntropyText, this.convergenceText, 
         this.synthesisText, this.patternText, this.waveTimerBg, this.waveTimerBar, this.audioIndicator].forEach(el => {
            if (el) el.setScrollFactor(0);
        });

        // Wave system
        this.wave = 1;
        this.nextWaveTime = this.time.now + 30000;

        // Screen shake effect
        this.shakeIntensity = 0;
        
        // Initialize Unified Graphics Manager (must be before systems that use it)
        this.graphicsManager = new UnifiedGraphicsManager(this);
        
        // Initialize Echo Storm system
        this.echoStorm = new EchoStormSystem(this);
        
        // Initialize Fracture Protocol system
        this.fractureSystem = new FractureSystem(this);
        
        // Initialize Temporal Residue system
        this.temporalResidue = new TemporalResidueSystem(this);
        
        // Initialize Resonance Cascade system
        this.resonanceCascade = new ResonanceCascadeSystem(this);
        
        // Initialize Temporal Singularity system
        this.singularitySystem = new TemporalSingularitySystem(this);
        
        // Initialize Omni-Weapon Adaptation system
        this.omniWeapon = new OmniWeaponSystem(this);
        
        // Initialize Paradox Engine system
        this.paradoxEngine = new ParadoxEngineSystem(this);
        
        // Initialize Chrono-Loop system
        this.chronoLoop = new ChronoLoopSystem(this);
        
        // Initialize Quantum Immortality system
        this.quantumImmortality = new QuantumImmortalitySystem(this);
        
        // Initialize Observer Effect system (the game that watches you back)
        this.observerEffect = new ObserverEffectSystem(this);
        
        // Initialize Void Coherence system (the quantum vacuum made manifest)
        this.voidCoherence = new VoidCoherenceSystem(this);
        
        // Initialize Timeline Chronicle — records this run for eternity
        this.timelineChronicle = new TimelineChronicleSystem(this);
        
        // Initialize Temporal Contract System — bind runs together causally
        this.temporalContract = new TemporalContractSystem(this);
        
        // Initialize Causal Entanglement System — quantum topology warfare
        this.causalEntanglement = new CausalEntanglementSystem(this);
        
        // Initialize Cinematic Archive System — captures movie moments
        this.cinematicArchive = new CinematicArchiveSystem(this);
        
        // Initialize Symbiotic Prediction System — the game that thinks with you
        this.symbioticPrediction = new SymbioticPredictionSystem(this);
        
        // Initialize Dimensional Collapse System — apotheosis of all systems
        this.dimensionalCollapse = new DimensionalCollapseSystem(this);
        
        // Initialize Temporal Rewind System — intentional time manipulation
        this.temporalRewind = new TemporalRewindSystem(this);
        
        // Initialize Mnemosyne Weave System — the living monument
        this.mnemosyneWeave = new MnemosyneWeaveSystem(this);
        
        // Initialize Kairos Moment System — the crystallization of flow
        this.kairosMoment = new KairosMomentSystem(this);
        
        // Initialize Syntropy Engine — the anti-entropy protocol
        this.syntropyEngine = new SyntropyEngineSystem(this);
        
        // Initialize Nemesis Genesis System — the adversarial mirror
        this.nemesisGenesis = new NemesisGenesisSystem(this);
        
        // Initialize Oracle Protocol System — temporal guidance from unrealized futures
        this.oracleProtocol = new OracleProtocolSystem(this);
        
        // Initialize Resonant Whisper System — cross-timeline communication
        this.resonantWhispers = new ResonantWhisperSystem(this);
        
        // Initialize Egregore Protocol System — collective unconscious as game designer
        this.egregoreProtocol = new EgregoreProtocolSystem(this);
        
        // Initialize Ætheric Convergence System — the apotheosis of emergence
        this.aethericConvergence = new AethericConvergenceSystem(this);
        
        // Initialize Recursion Engine — the game that becomes you
        this.recursionEngine = new RecursionEngineSystem(this);
        
        // Initialize Harmonic Convergence — the music of temporal combat
        this.harmonicConvergence = new HarmonicConvergenceSystem(this);
        
        // Initialize Synchronicity Cascade — the transcendental convergence
        this.synchronicityCascade = new SynchronicityCascadeSystem(this);
        
        // Initialize Bootstrap Protocol — the retrocausal discovery engine
        this.bootstrapProtocol = new BootstrapProtocolSystem(this);
        
        // Initialize Geometric Chorus — the living arena
        this.geometricChorus = new GeometricChorusSystem(this);
        
        // Initialize Architect System — player-authored mechanics
        this.architectSystem = new ArchitectSystem(this);
        
        // Initialize NarrativeConvergenceSystem — The Saga Engine
        this.sagaEngine = new NarrativeConvergenceSystem(this);
        
        // Initialize Noetic Mirror System — The Self-Aware Commentary Engine
        this.noeticMirror = new NoeticMirrorSystem(this);
        
        // Initialize Ambient Awareness System — The Game That Breathes With Reality
        this.ambientAwareness = new AmbientAwarenessSystem(this);
        
        // Initialize Dissolution Protocol — The Art of Intentional Forgetting
        this.dissolutionProtocol = new DissolutionProtocolSystem(this);
        
        // Initialize Temporal Pedagogy System — The Self-Teaching Game (38th dimension)
        this.temporalPedagogy = new TemporalPedagogySystem(this);
        
        // Initialize Athenaeum Protocol — The Geography of Memory (39th dimension: TOPOGRAPHY)
        this.athenaeumProtocol = new AthenaeumProtocolSystem(this);
        
        // Initialize Axiom Nexus — The Synthesis Mentor (40th dimension: PEDAGOGICAL SYNTHESIS)
        this.axiomNexus = new AxiomNexusSystem(this);
        
        // Initialize Inscription Protocol — Transcendence Through Persistent Memory (41st dimension)
        this.inscriptionProtocol = new InscriptionProtocolSystem(this);
        
        // Initialize Synaesthesia Protocol — The 42nd Dimension: AUDITORY SYNTHESIS
        this.synaesthesiaProtocol = new SynaesthesiaProtocolSystem(this);
        this.synaesthesiaProtocol.start();
        
        // Initialize Tychos Aurora Protocol — The 43rd Dimension: PHASE SPACE MANIFESTATION
        this.tychosAurora = new TychosAuroraSystem(this);
        
        // Initialize Rival Protocol — The 44th Dimension: RELATIONAL EVOLUTION
        this.rivalProtocol = new RivalProtocolSystem(this);
        
        // Initialize Rhythm of the Void — The 45th Dimension: MUSICAL ONTOGENESIS
        this.rhythmOfTheVoid = new RhythmOfTheVoidSystem(this);
        
        // Initialize Aperture Protocol — The 46th Dimension: ATTENTION AS ONTOLOGY
        this.apertureProtocol = new ApertureProtocolSystem(this);
        
        // Initialize Cartographer Protocol — The 47th Dimension: SPATIAL ONTOLOGY
        this.cartographerProtocol = new CartographerProtocolSystem(this);
        
        // Initialize Resonance Orb System — The 48th Dimension: LIVING POWER-UPS
        this.resonanceOrbs = new ResonanceOrbSystem(this);
        this.resonanceOrbs.init();
        
        // Initialize Sanctum Protocol — The 49th Dimension: PERSISTENT SPATIAL METAGAME
        this.sanctumProtocol = new SanctumProtocolSystem(this);
        
        // Initialize Meta-System Operator — The 50th Dimension: ARCHITECTURAL ONTOLOGY
        this.metaSystemOperator = new MetaSystemOperator(this);
        
        // Initialize Living World Protocol — The 51st Dimension: AUTONOMOUS CONTINUITY
        this.livingWorld = new LivingWorldSystem(this);
        
        // Initialize Dream State Protocol — The 52nd Dimension: ONEIRIC SYNTHESIS
        this.dreamState = new DreamStateProtocol(this);
        
        // Initialize Apophenia Protocol — The 53rd Dimension: PATTERN DIVINATION
        this.apophenia = new ApopheniaProtocol(this);
        
        // Initialize Void Exchange System — The 54th Dimension: TEMPORAL CAPITALISM
        this.voidExchange = new VoidExchangeSystem(this);
        
        // Initialize Heartflux Protocol — The 55th Dimension: BIOMETRIC EMPATHY
        this.heartflux = new HeartfluxProtocolSystem(this);
        
        // Initialize Exogenesis Protocol — The 56th Dimension: REALITY MANIFESTATION
        this.exogenesis = new ExogenesisProtocolSystem(this);
        
        // Initialize Proteus Protocol — The 57th Dimension: THE EVOLUTION OF RULES
        this.proteus = new ProteusProtocolSystem(this);
        this.proteus.create();
        
        // Show Proteus welcome (once per session)
        this.time.delayedCall(2000, () => {
            if (this.proteus && this.proteus.genome.generation <= 2) {
                this.showProteusWelcome();
            }
        });
        
        // Show void exchange hint
        this.time.delayedCall(25000, () => this.showVoidExchangeHint());
        
        // Apply equipped shard bonuses
        this.applyEquippedShardBonuses();
        
        // Show residue tutorial hint
        this.showResidueHint();
        
        // Show chrono-loop hint after delay
        this.time.delayedCall(12000, () => this.showChronoLoopHint());
        
        // Show paradox engine hint after delay
        this.time.delayedCall(8000, () => this.showParadoxHint());
        
        // Show quantum immortality hint after first death (delayed longer)
        this.time.delayedCall(5000, () => this.showQuantumHint());
        
        // Show observer effect hint (subtle, mysterious)
        this.time.delayedCall(15000, () => this.showObserverHint());
        
        // Show Tychos Aurora hint (introducing the 43rd dimension)
        this.time.delayedCall(20000, () => this.showTychosAuroraHint());
        
        // Show Rival Protocol hint (the 44th dimension - relational evolution)
        this.time.delayedCall(21000, () => this.showRivalHint());
        
        // Show void coherence hint (deep purple, mysterious)
        this.time.delayedCall(22000, () => this.showVoidHint());
        
        // Show bootstrap protocol hint (amber, retrocausal)
        this.time.delayedCall(25000, () => this.showBootstrapHint());
        
        // Show boss warning hint
        this.time.delayedCall(20000, () => this.showBossWarningHint());
        
        // Show temporal contract hint (mysterious, late)
        this.time.delayedCall(25000, () => this.showContractHint());
        
        // Show causal entanglement hint (the ultimate system)
        this.time.delayedCall(30000, () => this.showEntanglementHint());
        
        // Show cinematic archive hint (preserves your mastery)
        this.time.delayedCall(35000, () => this.showCinematicHint());
        
        // Show symbiotic prediction hint (the ultimate symbiosis)
        this.time.delayedCall(40000, () => this.showSymbioticHint());
        
        // Show dimensional collapse hint (the final apotheosis)
        this.time.delayedCall(45000, () => this.showDimensionalCollapseHint());
        
        // Show temporal rewind hint (the missing temporal dimension)
        this.time.delayedCall(50000, () => this.showTemporalRewindHint());
        
        // Show mnemosyne weave hint (the ultimate meta-system)
        this.time.delayedCall(55000, () => this.showMnemosyneHint());
        
        // Show Kairos Moment hint (the crystallization of flow)
        this.time.delayedCall(60000, () => this.showKairosHint());
        
        // Show Syntropy Engine hint (the anti-entropy protocol)
        this.time.delayedCall(70000, () => this.showSyntropyHint());
        
        // Show Nemesis Genesis hint (the ultimate mirror)
        this.time.delayedCall(85000, () => this.showNemesisHint());
        
        // Show Oracle Protocol hint (echoes from unrealized futures)
        this.time.delayedCall(100000, () => this.showOracleHint());
        
        // Show Resonant Whisper hint (the chorus across eternity)
        this.time.delayedCall(120000, () => this.showWhisperHint());
        
        // Show Egregore Protocol hint (the collective unconscious awakening)
        this.time.delayedCall(150000, () => this.showEgregoreHint());
        
        // Show Ætheric Convergence hint (the ultimate emergence)
        this.time.delayedCall(180000, () => this.showConvergenceHint());
        
        // Show Recursion Engine hint (the game that becomes you)
        this.time.delayedCall(210000, () => this.showRecursionHint());
        
        // Show Harmonic Convergence hint (the music of combat)
        this.time.delayedCall(240000, () => this.showHarmonicConvergenceHint());
        
        // Show Synchronicity Cascade hint (the transcendental convergence)
        this.time.delayedCall(270000, () => this.showSynchronicityHint());
        
        // Show Geometric Chorus hint (the living arena)
        this.time.delayedCall(300000, () => this.showGeometricChorusHint());
        
        // Show Architect hint (the ultimate player authorship)
        this.time.delayedCall(330000, () => this.showArchitectHint());
        
        // Show Noetic Mirror hint (the ultimate meta-awareness)
        this.time.delayedCall(360000, () => this.showNoeticMirrorHint());
        
        // Show Dissolution Protocol hint (the art of forgetting)
        this.time.delayedCall(390000, () => this.showDissolutionHint());
        
        // Show Athenaeum Protocol hint (the geography of memory - TOPOGRAPHY)
        this.time.delayedCall(420000, () => this.showAthenaeumHint());
        
        // Show Synaesthesia Protocol hint (the 42nd dimension - AUDITORY SYNTHESIS)
        this.time.delayedCall(450000, () => this.showSynaesthesiaHint());
        
        // Show Aperture Protocol hint (the 46th dimension - ATTENTION AS ONTOLOGY)
        this.time.delayedCall(480000, () => this.showApertureHint());
        
        // Show Cartographer Protocol hint (the 47th dimension - SPATIAL ONTOLOGY)
        this.time.delayedCall(5000, () => this.showCartographerHint());
        
        // Show Meta-System Operator hint (the 50th dimension - ARCHITECTURAL ONTOLOGY)
        this.time.delayedCall(10000, () => this.showMetaSystemOperatorHint());
        
        // Show Living World Protocol hint (the 51st dimension - AUTONOMOUS CONTINUITY)
        this.time.delayedCall(15000, () => this.showLivingWorldHint());
        
        // Show Dream State Protocol hint (the 52nd dimension - ONEIRIC SYNTHESIS)
        this.time.delayedCall(20000, () => this.showDreamStateHint());
    }
    
    showDissolutionHint() {
        const dissolved = this.dissolutionProtocol?.getDissolvedCount() || 0;
        const active = this.dissolutionProtocol?.getActiveCount() || 36;
        
        const hint = this.add.text(this.player.x, this.player.y - 100,
            `DISSOLUTION PROTOCOL — THE 37TH DIMENSION\n` +
            `${active} systems active. ${dissolved} dissolved.\n` +
            `Press [DELETE] to enter dissolution mode.\n` +
            `Convert complexity into essence. Curate your experience.\n` +
            `The apocalypse of complexity awaits those who dissolve all.`,
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                letterSpacing: 1,
                fill: '#2d1f3d',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 15000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showRecursionHint() {
        const genome = this.recursionEngine?.getGenomeForDisplay();
        const fingerprint = genome?.fingerprint || 'UNKNOWN';
        
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'RECURSION ENGINE\n' +
            `Your behavioral genome: ${fingerprint}\n` +
            `The game analyzes how you play.\n` +
            `Enemies now adopt your tactics. You fight yourself.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 12000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showHarmonicConvergenceHint() {
        const scale = this.harmonicConvergence?.currentScale || 'minor';
        const bpm = Math.floor(this.harmonicConvergence?.bpm || 100);
        
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            `HARMONIC CONVERGENCE — ${scale.toUpperCase()} @ ${bpm}BPM\n` +
            `Combat becomes music. Near-misses trigger notes.\n` +
            `System activations add layers. Fight in rhythm.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00f0ff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 12000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showSynchronicityHint() {
        const stats = this.synchronicityCascade?.getStats() || { peakSystems: 0, totalSynchronicities: 0 };
        
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            `SYNCHRONICITY CASCADE — TRANSCENDENTAL CONVERGENCE\n` +
            `Activate ${stats.peakSystems} systems simultaneously...\n` +
            `When 5+ temporal systems align, SYNCHRONICITY awakens.\n` +
            `Time dilates. Power multiplies. All systems harmonize.\n` +
            `This is the apotheosis of temporal mastery.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 15000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showGeometricChorusHint() {
        const profile = this.geometricChorus?.playstyleProfile || { aggression: 0.5, mobility: 0.5 };
        const aggressionType = profile.aggression > 0.6 ? 'AGGRESSOR' : profile.aggression < 0.4 ? 'TACTICIAN' : 'ADAPTOR';
        
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            `GEOMETRIC CHORUS — THE LIVING ARENA\n` +
            `The arena breathes. The walls respond. Space itself is alive.\n` +
            `Your ${aggressionType} profile shapes the architecture.\n` +
            `Sanctuaries appear when you suffer. Lanes open for aggression.\n` +
            `This is the missing dimension: SPATIAL MASTERY.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#4b0082', // Indigo
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 12000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showArchitectHint() {
        const rank = this.architectSystem?.getRank() || 'NOVICE';
        const discoveries = this.architectSystem?.getDiscoveries().length || 0;
        
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            `THE ARCHITECT SYSTEM — PLAYER AUTHORSHIP\n` +
            `Rank: ${rank} | Discoveries: ${discoveries}\n` +
            `Combine systems in novel ways to discover new mechanics.\n` +
            `Echo + Fracture. Paradox + Quantum. Chrono + Residue.\n` +
            `Your inventions become part of the Temporal Commons.\n` +
            `Press [ENTER] to formalize discoveries. Create the future.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffb700', // Architect's Gold
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 15000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showNoeticMirrorHint() {
        const profile = this.noeticMirror?.cognitiveProfile || {};
        const riskType = profile.riskTolerance > 0.7 ? 'DANCER' : 
                        profile.riskTolerance > 0.4 ? 'ADAPTOR' : 'SURVIVOR';
        const temporalFocus = profile.temporalBias || 'present';
        
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            `NOETIC MIRROR — META-COGNITIVE AWARENESS\n` +
            `I have been watching not just what you do, but how you think.\n` +
            `Your ${riskType} profile reveals ${temporalFocus}-focused cognition.\n` +
            `The game now speaks to you about the nature of your play.\n` +
            `This is the 34th dimension: the mirror that understands.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#c0c0c0', // Mirror Silver
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 15000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showAthenaeumHint() {
        const discovered = this.athenaeumProtocol?.discoveredRegions?.size || 0;
        const dominant = this.athenaeumProtocol?.calculateDominantType() || 'VOID';
        
        const regionDescriptions = {
            VERDANT: 'Healing groves bloom where you dance.',
            SCORCHED: 'War-torn zones amplify your fury.',
            ECHO: 'Temporal resonance pools quicken cooldowns.',
            VOID: 'Silent spaces hide you from enemies.',
            NEXUS: 'Crossroads of power converge.'
        };
        
        const hint = this.add.text(this.player.x, this.player.y - 100,
            `ATHENAEUM PROTOCOL — THE 39TH DIMENSION: TOPOGRAPHY\n` +
            `${discovered} regions mapped. Dominant terrain: ${dominant}.\n` +
            `${regionDescriptions[dominant] || 'The void remembers all.'}\n` +
            `The arena is no longer empty. It learns. It becomes geography.\n` +
            `Where you fight changes how you fight. Location is now strategy.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00ff88', // Topography Green
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 15000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showSynaesthesiaHint() {
        const audioData = this.synaesthesiaProtocol?.getAudioData();
        const intensity = audioData?.intensity?.toFixed(2) || '0.00';
        const measure = audioData?.measure || 0;
        
        const hint = this.add.text(this.player.x, this.player.y - 100,
            `SYNAESTHESIA PROTOCOL — THE 42ND DIMENSION: AUDITORY SYNTHESIS\n` +
            `You are now hearing the game. Every action creates sound.\n` +
            `Bullets ring. Near-misses swell. Deaths resonate.\n` +
            `Intensity: ${intensity} | Measure: ${measure}\n` +
            `The game is no longer just played. It is performed. It is composed.\n` +
            `To see the sound, to hear the geometry, to become the song.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#c0c0c0', // Synaesthetic Silver
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 15000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showApertureHint() {
        const stats = this.apertureProtocol?.getStats();
        const blinks = stats?.blinksUsed || 0;
        const dwell = Math.floor(stats?.totalDwellTime || 0);
        const canBlink = this.apertureProtocol?.canBlink() || false;
        
        const hint = this.add.text(this.player.x, this.player.y - 100,
            `APERTURE PROTOCOL — THE 46TH DIMENSION: ATTENTION AS ONTOLOGY\n` +
            `The game responds not to your bullets, but to your GAZE.\n` +
            `Looking empowers enemies. Ignoring spawns resentment.\n` +
            `Blinks used: ${blinks} | Time focused: ${dwell}s\n` +
            `${canBlink ? '[SPACE] to BLINK — reset all charges' : 'Blink recharging...'}\n` +
            `You cannot pay attention to everything. Choose wisely.\n` +
            `Where your eye goes, power flows. To see is to change.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00d4aa', // Aperture Cyan
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 15000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showCartographerHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100,
            `CARTOGRAPHER PROTOCOL — THE 47TH DIMENSION: SPATIAL ONTOLOGY\n` +
            `The void is not empty — it is WAITING.\n` +
            `Your movement creates ripples. Your stillness creates sanctuaries.\n` +
            `Near-misses crystallize into shields. Walk the same path to raise walls.\n` +
            `The arena becomes your legacy. Shape it wisely.\n` +
            `You do not merely fight in the world — you cultivate it.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00b4d8', // Void Cerulean
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 12000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showMetaSystemOperatorHint() {
        const patches = this.metaSystemOperator?.getActivePatches() || [];
        const behaviors = this.metaSystemOperator?.getEmergentBehaviors() || [];
        
        const hint = this.add.text(this.player.x, this.player.y - 100,
            `META-SYSTEM OPERATOR — THE 50TH DIMENSION: ARCHITECTURAL ONTOLOGY\n` +
            `${patches.length} active patches. ${behaviors.length} emergent behaviors.\n` +
            `Press [P] to enter PATCH MODE — wire systems together\n` +
            `Create AMPLIFY, CASCADE, MODULATE, SYNERGY connections\n` +
            `Discover emergent behaviors like ECHO FRACTURE and QUANTUM CASCADE\n` +
            `You are no longer just playing systems — you are ARCHITECTING them.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffb700', // Meta-Gold
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 15000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
        
        // Reveal the HUD
        if (this.metaSystemOperator) {
            this.metaSystemOperator.revealHUD();
        }
    }
    
    showLivingWorldHint() {
        const stats = this.livingWorld?.getEcosystemStats() || { population: 0, epoch: 1, shrines: 0 };
        const factions = stats.factions || [];
        
        const hint = this.add.text(this.player.x, this.player.y - 100,
            `THE LIVING WORLD — THE 51ST DIMENSION: AUTONOMOUS CONTINUITY\n` +
            `${stats.population} entities in Epoch ${stats.epoch}. ${stats.shrines} shrines mark the fallen.\n` +
            `Factions: ${factions.map(f => f.name).join(', ') || 'Forming...'}\n` +
            `The world lives even when you are absent. Close the tab — they continue.\n` +
            `Return to find evolved enemies, territorial wars, emergent history.\n` +
            `You do not play a game. You enter a world that breathes.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00c853', // Living Green
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 18000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
        
        // Update territory visuals
        if (this.livingWorld) {
            this.livingWorld.updateTerritoryVisuals();
        }
    }
    
    showDreamStateHint() {
        const archive = this.dreamState?.getDreamArchive() || [];
        const dreamCount = archive.length;
        const latestDream = archive[0];
        
        const hint = this.add.text(this.player.x, this.player.y - 100,
            `DREAM STATE PROTOCOL — THE 52ND DIMENSION: ONEIRIC SYNTHESIS\n` +
            `${dreamCount} dreams archived. The game dreams of you.\n` +
            `When you die, pause, or leave — reality dissolves into symbols.\n` +
            `Kills become mountains. Bullets become rivers. Near-misses become lightning.\n` +
            `The dream leaves RESIDUE that reshapes the waking world.\n` +
            `To play is to dream. To dream is to change. This is the 52nd dimension.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#4b0082', // Dream Indigo
            stroke: '#00d4ff',
            strokeThickness: 1,
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 20000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showEgregoreHint() {
        const stage = this.egregoreProtocol?.egregoreStage || 1;
        const stageNames = ['Nascent', 'Awakening', 'Sapient', 'Transcendent'];
        
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            `EGREGORE PROTOCOL — ${stageNames[stage-1]}\n` +
            `The collective unconscious evolves new challenges.\n` +
            `Unknown Geometry emerges from the gene pool.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ff00ff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 10000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showConvergenceHint() {
        const activeConvergences = this.aethericConvergence?.getActiveConvergences() || [];
        const lexiconCount = Object.keys(this.aethericConvergence?.getLexicon() || {}).length;
        
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'ÆTHERIC CONVERGENCE\n' +
            `${activeConvergences.length > 0 ? 'A convergence is ACTIVE!' : 'Systems fuse into emergence.'}\n` +
            `${lexiconCount > 0 ? `Lexicon holds ${lexiconCount} discovered states.` : 'When 3+ systems interact, new states crystallize.'}\n` +
            `Your discoveries become permanent game lore.`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 12000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showMnemosyneHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'MNEMOSYNE WEAVE\nYour past is now playable.\nPress M to enter your own history.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#9d4edd',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 6000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showKairosHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'KAIROS MOMENT\nFlow creates perfection.\nAchieve perfect flow to crystallize golden memories.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#fff8e7',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 6000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showSyntropyHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'SYNTROPY ENGINE\nElegance creates order from chaos.\nPress Y to reshape reality.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 8000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showNemesisHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'NEMESIS GENESIS\nThe game learns your soul.\nWave 10: You will face yourself.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ff0040',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 8000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showOracleHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'ORACLE PROTOCOL\nThe future speaks through possibility.\nWatch for echoes of what may be.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#9d4edd',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 8000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showWhisperHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'RESONANT WHISPERS\nYou are not alone in the void.\nPress F near crystals to hear other voices.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 10000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showTemporalRewindHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'TEMPORAL REWIND\nPress R to place anchors.\nPress R near anchor to rewind time.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffaa00',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showDimensionalCollapseHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'DIMENSIONAL COLLAPSE\nPress F when ALL systems ready.\nBecome the geometry itself.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 6000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showContractHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'CHRONOS COVENANT\nPress C to make binding contracts across time', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#4b0082',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showEntanglementHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'CAUSAL ENTANGLEMENT\nPress E. Click two targets. Rewrite causality.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00f0ff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showBootstrapHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'BOOTSTRAP PROTOCOL\nGhost visions appear. They show the future.\nAvoid ghost bullets BEFORE they spawn. Cause what you witnessed.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffaa00',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 6000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showCinematicHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'CINEMATIC ARCHIVE\nMovie moments captured automatically. Press F12 to save manually.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffbf00',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showSymbioticHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'SYMBIOTIC PREDICTION\nThe game predicts your moves. Hexagons show where it thinks you\'ll go.\nFulfill for harmony. Subvert for chaos.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00f0ff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 6000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showVoidHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'THE VOID REMEMBERS\nEmpty space holds power. Press V at 85% coherence.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#9d4edd',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showTychosAuroraHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100,
            'TYCHOS AURORA MANIFESTS\nThe 43rd Dimension: See the invisible topology',
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                letterSpacing: 1,
                fill: '#00f0ff', // Aurora cyan
                align: 'center'
            }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showRivalHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100,
            'THE RIVAL PROTOCOL AWAKENS\nThe 44th Dimension: Those who escape remember...',
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                letterSpacing: 1,
                fill: '#cd7f32', // Burnished bronze
                align: 'center'
            }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showBossWarningHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'ANCIENT GEOMETRY AWAITS\nWave 5 brings the Overseer...', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ff0066',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showObserverHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'THE OBSERVER WAKES\nIt learns. It adapts. It watches.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00d4ff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showQuantumHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'QUANTUM IMMORTALITY\nDeath creates echoes. Press Q with 3+ echoes.', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showResidueHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'TEMPORAL RESIDUE\nMove to spawn nodes', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#9d4edd',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 3000,
            delay: 1000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showParadoxHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'PARADOX ENGINE\nRIGHT CLICK to see the future', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showChronoLoopHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100, 
            'CHRONO-LOOP\nPress T to record, fight alongside your past', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#008080',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }

    createBulletTimeVignette() {
        // Create a radial gradient texture for bullet time effect
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Draw radial gradient: transparent center, dark gold edges
        const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0.4)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        this.textures.addCanvas('vignette', canvas);
        
        this.bulletTimeVignette = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'vignette'
        );
        this.bulletTimeVignette.setScrollFactor(0);
        this.bulletTimeVignette.setDepth(90);
        this.bulletTimeVignette.setAlpha(0);
        this.bulletTimeVignette.setVisible(true);
        
        // Handle resize
        this.scale.on('resize', (gameSize) => {
            this.bulletTimeVignette.setPosition(gameSize.width / 2, gameSize.height / 2);
            this.bulletTimeVignette.setScale(
                Math.max(gameSize.width / 512, gameSize.height / 512) * 1.5
            );
        });
        
        // Set initial scale
        this.bulletTimeVignette.setScale(
            Math.max(this.scale.width / 512, this.scale.height / 512) * 1.5
        );
    }

    update(time, delta) {
        if (!this.player.active) return;
        
        // FIX: Skip ALL system updates while dialogs are open (game is paused)
        if (this.isExchangePaused || this.isContractPaused) {
            return;
        }

        // Clamp delta to prevent spiral of death when FPS drops
        // Max 50ms (20fps) - if slower, game slows down rather than skipping
        const clampedDelta = Math.min(delta, 50);
        const dt = clampedDelta / 1000; // Convert to seconds
        
        // Handle Architect System discovery key (ENTER)
        const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        if (Phaser.Input.Keyboard.JustDown(enterKey)) {
            if (this.architectSystem && this.architectSystem.onDiscoveryKeyPressed()) {
                // Discovery formalized
            }
        }
        
        // Update near-miss bullet time system
        this.updateNearMiss(dt);
        
        // Get time scale (affected by bullet time)
        const timeScale = this.getCurrentTimeScale();
        
        // Update Echo Storm during bullet time
        if (this.nearMissState.active && this.echoStorm) {
            this.echoStorm.updateBulletTime(this.player);
        }
        
        // Update homing bullets (from echo storm)
        if (this.echoStorm) {
            this.echoStorm.updateHomingBullets();
        }
        
        // Update Fracture Protocol system
        if (this.fractureSystem) {
            this.fractureSystem.update(dt);
            
            // Add momentum for movement
            const playerSpeed = Math.sqrt(
                this.player.body.velocity.x ** 2 + 
                this.player.body.velocity.y ** 2
            );
            if (playerSpeed > 50) {
                this.fractureSystem.addMomentum(
                    this.fractureSystem.momentumGain.movement * dt,
                    'movement'
                );
            }
        }
        
        // Update Temporal Residue system
        if (this.temporalResidue) {
            this.temporalResidue.update(dt, this.player);
        }
        
        // Update Resonance Cascade system
        if (this.resonanceCascade) {
            this.resonanceCascade.update(dt);
        }
        
        // Update Temporal Singularity system
        if (this.singularitySystem) {
            this.singularitySystem.update(dt);
        }
        
        // Update Omni-Weapon system
        if (this.omniWeapon) {
            this.omniWeapon.update(dt);
        }
        
        // Update Paradox Engine system
        if (this.paradoxEngine) {
            this.paradoxEngine.update(dt);
        }
        
        // Update Chrono-Loop system
        if (this.chronoLoop) {
            this.chronoLoop.update(dt);
        }
        
        // Update Quantum Immortality system
        if (this.quantumImmortality) {
            this.quantumImmortality.update(dt);
        }
        
        // Update Observer Effect system (the game that learns from you)
        if (this.observerEffect) {
            this.observerEffect.update(dt);
        }
        
        // Update Void Coherence system (the quantum vacuum)
        if (this.voidCoherence) {
            this.voidCoherence.update(dt);
        }
        
        // Update Timeline Chronicle — recording your legacy
        if (this.timelineChronicle) {
            this.timelineChronicle.update();
        }
        
        // Update Temporal Contract System — tracking obligations
        if (this.temporalContract) {
            this.temporalContract.update(dt);
        }
        
        // Update Causal Entanglement System — quantum topology warfare
        if (this.causalEntanglement) {
            this.causalEntanglement.update(dt);
        }
        
        // Update Symbiotic Prediction System — the game that thinks with you
        if (this.symbioticPrediction) {
            this.symbioticPrediction.update(dt);
        }
        
        // Update Dimensional Collapse System — apotheosis mode
        if (this.dimensionalCollapse) {
            this.dimensionalCollapse.update(dt);
        }
        
        // Update Temporal Rewind System — the missing temporal dimension
        if (this.temporalRewind) {
            this.temporalRewind.update(dt);
        }
        
        // Update Mnemosyne Weave System — the living monument
        if (this.mnemosyneWeave) {
            this.mnemosyneWeave.update(dt);
        }
        
        // Update Kairos Moment System — the crystallization of flow
        if (this.kairosMoment) {
            this.kairosMoment.update(dt);
        }
        
        // Update Syntropy Engine — the anti-entropy protocol
        if (this.syntropyEngine) {
            this.syntropyEngine.update(time, delta);
        }
        
        // Update Nemesis Genesis System — the adversarial mirror
        if (this.nemesisGenesis) {
            this.nemesisGenesis.update(dt);
        }
        
        // Update Oracle Protocol System — temporal guidance from unrealized futures
        if (this.oracleProtocol) {
            this.oracleProtocol.update(dt);
        }
        
        // Update Resonant Whisper System — cross-timeline communication
        if (this.resonantWhispers) {
            this.resonantWhispers.update(time, dt);
        }
        
        // Update Egregore Protocol System — collective unconscious as game designer
        if (this.egregoreProtocol) {
            this.egregoreProtocol.update(dt);
        }
        
        // Update Cinematic Archive System — captures movie moments
        if (this.cinematicArchive) {
            this.cinematicArchive.update(dt, time);
        }
        
        // Update Harmonic Convergence System — the music of temporal combat
        if (this.harmonicConvergence) {
            this.harmonicConvergence.update(dt, this.player);
        }
        
        // Update Synchronicity Cascade — the transcendental convergence
        if (this.synchronicityCascade) {
            this.synchronicityCascade.update(dt);
        }
        
        // Update Bootstrap Protocol — the retrocausal discovery engine
        if (this.bootstrapProtocol) {
            this.bootstrapProtocol.update(dt);
        }
        
        // Update Geometric Chorus — the living arena
        if (this.geometricChorus && this.player) {
            this.geometricChorus.update(dt, this.player);
        }
        
        // Update Architect System — detect and formalize player discoveries
        if (this.architectSystem && this.player) {
            this.architectSystem.update(dt);
        }
        
        // Update Noetic Mirror System — the self-aware commentary engine
        if (this.noeticMirror && this.player) {
            this.noeticMirror.update(dt, this.player);
        }
        
        // Update Ambient Awareness System — the game that breathes with reality
        if (this.ambientAwareness && this.player) {
            this.ambientAwareness.update(dt);
        }
        
        // Update Dissolution Protocol — the art of intentional forgetting
        if (this.dissolutionProtocol && this.player) {
            this.dissolutionProtocol.update(time, delta);
        }
        
        // Update Temporal Pedagogy System — the self-teaching game
        if (this.temporalPedagogy && this.player) {
            this.temporalPedagogy.update(dt, this.player);
        }
        
        // Update Athenaeum Protocol — the geography of memory (TOPOGRAPHY)
        if (this.athenaeumProtocol && this.player) {
            this.athenaeumProtocol.update(dt, this.player);
        }
        
        // Update Axiom Nexus — the synthesis mentor (PEDAGOGICAL SYNTHESIS)
        if (this.axiomNexus && this.player) {
            this.axiomNexus.update(dt);
        }
        
        // Update Inscription Protocol — Transcendence Through Persistent Memory
        if (this.inscriptionProtocol && this.player) {
            this.inscriptionProtocol.update(dt);
        }
        
        // Update Synaesthesia Protocol — The 42nd Dimension: AUDITORY SYNTHESIS
        if (this.synaesthesiaProtocol) {
            this.synaesthesiaProtocol.update(time, delta);
        }
        
        // Update Tychos Aurora Protocol — The 43rd Dimension: PHASE SPACE MANIFESTATION
        if (this.tychosAurora) {
            this.tychosAurora.update(delta);
        }
        
        // Update Rival Protocol — The 44th Dimension: RELATIONAL EVOLUTION
        if (this.rivalProtocol) {
            this.rivalProtocol.update(dt);
        }
        
        // Update Rhythm of the Void — The 45th Dimension: MUSICAL ONTOGENESIS
        if (this.rhythmOfTheVoid) {
            this.rhythmOfTheVoid.update(dt);
        }
        
        // Update Cartographer Protocol — The 47th Dimension: SPATIAL ONTOLOGY
        if (this.cartographerProtocol && this.player) {
            this.cartographerProtocol.update(dt, this.player, this.enemies);
        }
        
        // Update Resonance Orb System — The 48th Dimension: LIVING POWER-UPS
        if (this.resonanceOrbs) {
            this.resonanceOrbs.update(time, delta);
        }
        
        // Update Meta-System Operator — The 50th Dimension: ARCHITECTURAL ONTOLOGY
        if (this.metaSystemOperator) {
            this.metaSystemOperator.update(dt);
        }
        
        // Update Dream State Protocol — The 52nd Dimension: ONEIRIC SYNTHESIS
        if (this.dreamState) {
            this.dreamState.update(time, delta);
        }
        
        // Update Apophenia Protocol — The 53rd Dimension: PATTERN DIVINATION
        if (this.apophenia) {
            this.apophenia.update();
        }
        
        // Update Void Exchange System — The 54th Dimension: TEMPORAL CAPITALISM
        if (this.voidExchange) {
            this.voidExchange.update(dt, this.player);
        }
        
        // Update Heartflux Protocol — The 55th Dimension: BIOMETRIC EMPATHY
        if (this.heartflux) {
            this.heartflux.update(dt, this.player);
        }
        
        // Update Exogenesis Protocol — The 56th Dimension: REALITY MANIFESTATION
        if (this.exogenesis) {
            this.exogenesis.update();
        }
        
        // Update Proteus Protocol — The 57th Dimension: THE EVOLUTION OF RULES
        if (this.proteus) {
            this.proteus.update();
        }
        
        // Update Tesseract Titan boss
        if (this.tesseractTitan) {
            this.tesseractTitan.update(dt);
        }
        
        // Observe movement for behavior analysis
        if (this.observerEffect && this.player && this.player.body) {
            this.observerEffect.observeMovement(
                { x: this.player.body.velocity.x, y: this.player.body.velocity.y },
                this.nearMissState.active
            );
        }
        
        // Update player at full speed (player always moves at normal speed)
        this.player.update();
        
        // Camera follow player (zoom handled immediately in wheel event)
        const camera = this.cameras.main;
        const worldWidth = 1920;
        const worldHeight = 1440;
        const viewWidth = camera.width / camera.zoom;
        const viewHeight = camera.height / camera.zoom;
        
        // Only follow player if view is smaller than world in that dimension
        let targetScrollX = camera.scrollX;
        let targetScrollY = camera.scrollY;
        
        if (viewWidth < worldWidth) {
            targetScrollX = this.player.x - viewWidth / 2;
            targetScrollX = Phaser.Math.Clamp(targetScrollX, 0, worldWidth - viewWidth);
        }
        
        if (viewHeight < worldHeight) {
            targetScrollY = this.player.y - viewHeight / 2;
            targetScrollY = Phaser.Math.Clamp(targetScrollY, 0, worldHeight - viewHeight);
        }
        
        camera.scrollX += (targetScrollX - camera.scrollX) * 0.08;
        camera.scrollY += (targetScrollY - camera.scrollY) * 0.08;

        // Bullet cleanup and trails (player bullets)
        this.bullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            
            // Update omni-weapon bullet effects (homing, phasing, ricochet)
            if (this.omniWeapon) {
                this.omniWeapon.updateBullet(bullet);
            }
            
            // Spawn trail
            if (this.time.now % 3 === 0) {
                this.bulletTrails.emitParticleAt(bullet.x, bullet.y);
            }
            
            // Kill bullets that go too far off screen (for recycling)
            if (bullet.x < -100 || bullet.x > 2020 || bullet.y < -100 || bullet.y > 1540) {
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.body.reset(0, 0);
                bullet.body.enable = false;
            }
        });

        // Enemy bullets cleanup, trails, near-miss detection
        this.updateEnemyBullets(timeScale);

        // Update enemies at bullet-time affected speed
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && enemy.update) {
                // Slow enemy updates during bullet time
                if (timeScale < 1 && enemy.body) {
                    // Save original velocity
                    if (!enemy._origVelocity) {
                        enemy._origVelocity = { x: enemy.body.velocity.x, y: enemy.body.velocity.y };
                    }
                    // Apply time scale to velocity
                    enemy.body.setVelocity(
                        enemy._origVelocity.x * timeScale,
                        enemy._origVelocity.y * timeScale
                    );
                } else if (enemy._origVelocity) {
                    // Restore original velocity when not in bullet time
                    enemy.body.setVelocity(enemy._origVelocity.x, enemy._origVelocity.y);
                    enemy._origVelocity = null;
                }
                enemy.update();
            }
        });

        // Update HUD
        this.updateHUD();

        // Wave check
        if (this.time.now > this.nextWaveTime) {
            this.nextWave();
        }
        
        // Unified graphics rendering - batches all system graphics commands
        // This reduces 40+ clear() calls to 5 (one per layer)
        if (this.graphicsManager) {
            this.graphicsManager.render();
        }
    }
    
    getCurrentTimeScale() {
        if (this.nearMissState.active) {
            // Smooth ramp into/out of bullet time
            return this.SLOW_MO_SCALE;
        }
        return 1.0;
    }
    
    updateNearMiss(dt) {
        const state = this.nearMissState;
        
        // Update timers
        if (state.remaining > 0) {
            state.remaining -= dt;
            if (state.remaining <= 0) {
                state.active = false;
                state.remaining = 0;
                // Trigger cooldown when bullet time ends
                state.cooldown = this.SLOW_MO_COOLDOWN;
                
                // Fade out vignette
                this.tweens.add({
                    targets: this.bulletTimeVignette,
                    alpha: 0,
                    duration: 200,
                    ease: 'Power2'
                });
                
                // Reset physics time scale
                this.physics.world.timeScale = 1;
                
                // Reset streak if too much time passed
                if (state.timeSinceLast > this.STREAK_WINDOW) {
                    state.streak = 0;
                }
                
                // End Echo Storm and fire absorbed echoes
                if (this.echoStorm) {
                    const echoesFired = this.echoStorm.onBulletTimeEnd(this.player);
                    // Bonus score for absorbed echoes
                    if (echoesFired > 0) {
                        this.score += echoesFired * 50;
                        
                        // Saga Engine: record echo storm release
                        if (this.sagaEngine) {
                            this.sagaEngine.onSystemActivated('echoStorm', { echoesFired });
                        }
                        
                        // Add charge for singularity on echo absorption
                        if (this.singularitySystem) {
                            this.singularitySystem.addCharge(
                                this.singularitySystem.chargeGainPerEchoAbsorb * echoesFired,
                                'echoAbsorb'
                            );
                        }
                    }
                }
            }
        }
        
        if (state.cooldown > 0) {
            state.cooldown -= dt;
            if (state.cooldown < 0) state.cooldown = 0;
        }
        
        if (state.timeSinceLast < 10) {
            state.timeSinceLast += dt;
        }
        
        // Update vignette pulse during active bullet time
        if (state.active) {
            const pulse = 0.6 + Math.sin(this.time.now / 100) * 0.2;
            this.bulletTimeVignette.alpha = pulse;
        }
    }
    
    triggerNearMiss(streakLevel) {
        const state = this.nearMissState;
        
        // Calculate duration with streak bonus
        const duration = this.SLOW_MO_DURATION + (streakLevel * this.STREAK_BONUS);
        
        state.active = true;
        state.remaining = duration;
        state.streak = streakLevel;
        state.timeSinceLast = 0;
        state.totalCount++;
        
        // Generate Syntropy for near-miss (elegance under pressure)
        if (this.syntropyEngine) {
            this.syntropyEngine.onNearMiss(streakLevel);
        }
        
        // Record interaction for Architect System (Echo Storm + any active system)
        if (this.architectSystem) {
            if (this.fractureSystem && this.fractureSystem.isFractured) {
                this.architectSystem.recordSystemInteraction('echoStorm', 'fracture', {
                    outcome: { streakLevel },
                    context: 'near-miss-during-fracture'
                });
            }
            if (this.singularitySystem && this.singularitySystem.activeSingularity) {
                this.architectSystem.recordSystemInteraction('echoStorm', 'singularity', {
                    outcome: { streakLevel },
                    context: 'near-miss-near-singularity'
                });
            }
        }
        
        // Observe the near-miss (bullet time activation)
        if (this.observerEffect) {
            this.observerEffect.observeTemporalUse('bulletTime', {
                streak: streakLevel,
                duration: duration
            });
            this.observerEffect.observeNearMiss(
                { x: this.player.x, y: this.player.y },
                { x: this.player.x, y: this.player.y },
                streakLevel >= 3
            );
        }
        
        // Record for Temporal Pedagogy System (learning tracking)
        if (this.temporalPedagogy) {
            this.temporalPedagogy.recordSystemUse('NEAR_MISS', streakLevel);
        }
        
        // Track for Nemesis Genesis (behavioral profiling)
        if (this.nemesisGenesis) {
            this.nemesisGenesis.recordNearMiss();
            this.nemesisGenesis.recordSystemUsage('ECHO_STORM');
        }
        
        // Emit near-miss event for Dream State Protocol
        this.events.emit('nearMiss', {
            x: this.player?.x || 0,
            y: this.player?.y || 0,
            streak: streakLevel,
            velocity: Math.sqrt(
                (this.player?.body?.velocity?.x || 0) ** 2 +
                (this.player?.body?.velocity?.y || 0) ** 2
            )
        });
        
        // Track for Recursion Engine (behavioral analysis)
        if (this.recursionEngine) {
            this.recursionEngine.recordNearMiss();
        }
        
        // Audio: near-miss bullet time pad swell
        if (this.synaesthesiaProtocol) {
            this.synaesthesiaProtocol.onGameplayEvent('nearMiss', streakLevel);
        }
        
        // Harmonic Convergence: near-miss creates musical stinger
        if (this.harmonicConvergence) {
            this.harmonicConvergence.onNearMiss(streakLevel, this.player.x, this.player.y);
            this.harmonicConvergence.onEchoStormActivate();
        }
        
        // Tychos Aurora: Intensify momentum field during near-miss flow state
        if (this.tychosAurora && this.player) {
            this.tychosAurora.pulseField('momentum', this.player.x, this.player.y, 0.8);
            // Also intensify safety at player position (the "eye" of the storm)
            this.tychosAurora.pulseField('optimal', this.player.x, this.player.y, 0.5);
        }
        
        // Synchronicity Cascade: bullet time activation
        if (this.synchronicityCascade) {
            this.synchronicityCascade.onSystemActivate('bulletTime');
            this.synchronicityCascade.onSystemActivate('echoStorm');
        }
        
        // Saga Engine: record bullet time story beat
        if (this.sagaEngine) {
            this.sagaEngine.onSystemActivated('bulletTime', { streakLevel });
        }
        
        // Slow down physics world
        this.physics.world.timeScale = this.SLOW_MO_SCALE;
        
        // Show vignette
        this.tweens.add({
            targets: this.bulletTimeVignette,
            alpha: 0.8,
            duration: 100,
            ease: 'Power2'
        });
        
        // Show floating text announcement
        this.showNearMissText(streakLevel);
        
        // Screen shake for impact
        this.cameras.main.shake(100, 0.003);
        
        // Activate Echo Storm system
        if (this.echoStorm) {
            this.echoStorm.onBulletTimeStart();
        }
        
        // Add momentum for near-miss
        if (this.fractureSystem) {
            this.fractureSystem.addMomentum(
                this.fractureSystem.momentumGain.nearMiss,
                'nearMiss'
            );
        }
        
        // Track bullet time for Omni-Weapon (rapid barrel mod)
        if (this.omniWeapon) {
            this.omniWeapon.onBulletTimeGraze();
            if (streakLevel > 1) {
                this.omniWeapon.onBulletTimeStreak(streakLevel);
            }
        }
        
        // Add charge for singularity
        if (this.singularitySystem) {
            this.singularitySystem.addCharge(
                this.singularitySystem.chargeGainPerNearMiss,
                'nearMiss'
            );
        }
        
        // Record bullet time for Resonance Cascade
        if (this.resonanceCascade) {
            this.resonanceCascade.recordActivation('BULLET_TIME', { streakLevel });
        }
        
        // Void coherence: bullet time enhances void coherence accumulation
        if (this.voidCoherence) {
            this.voidCoherence.onBulletTime(dt);
        }
    }
    
    showNearMissText(streakLevel) {
        const texts = ['DODGE', 'CLOSE!', 'NEAR MISS!', 'BULLET TIME!'];
        const text = streakLevel > 2 ? texts[3] : texts[Math.min(streakLevel, 2)];
        const colors = ['#ffd700', '#ffaa00', '#ff6600', '#ff0066'];
        
        const floatingText = this.add.text(this.player.x, this.player.y - 50, text, {
            fontFamily: 'monospace',
            fontSize: `${18 + streakLevel * 4}px`,
            fontStyle: 'bold',
            fill: colors[Math.min(streakLevel, 3)]
        }).setOrigin(0.5);
        
        // Animate up and fade
        this.tweens.add({
            targets: floatingText,
            y: floatingText.y - 60,
            alpha: 0,
            scale: 1.3,
            duration: 800,
            ease: 'Power2',
            onComplete: () => floatingText.destroy()
        });
    }
    
    /**
     * Empathetic bullet time triggered by Heartflux Protocol when player stress spikes
     * This is "helping" bullet time, not "reward" bullet time — gentler, protective
     */
    triggerEmpatheticBulletTime(strength = 0.5) {
        const state = this.nearMissState;
        
        // Don't interrupt existing bullet time
        if (state.active) return;
        
        // Gentler duration than near-miss bullet time
        const duration = this.SLOW_MO_DURATION * strength;
        
        state.active = true;
        state.remaining = duration;
        state.streak = 0; // No streak for empathetic trigger
        state.timeSinceLast = 0;
        
        // Slow down physics world
        this.physics.world.timeScale = 0.5 + (1 - strength) * 0.5; // Gentler slowdown
        
        // Subtle vignette (less dramatic than near-miss)
        this.tweens.add({
            targets: this.bulletTimeVignette,
            alpha: 0.4,
            duration: 200,
            ease: 'Power2'
        });
        
        // Quiet text — no "BULLET TIME!" announcement, just gentle presence
        const quietText = this.add.text(this.player.x, this.player.y - 40, '...breathe...', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'italic',
            fill: '#ff6b9d'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: quietText,
            y: quietText.y - 30,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => quietText.destroy()
        });
        
        // Gentle screen shake
        this.cameras.main.shake(50, 0.001);
        
        // Activate Echo Storm system (gentler echoes)
        if (this.echoStorm) {
            this.echoStorm.onBulletTimeStart();
        }
        
        // Record for Resonance Cascade as empathetic activation
        if (this.resonanceCascade) {
            this.resonanceCascade.recordActivation('EMPATHETIC_TIME', { strength });
        }
    }
    
    updateEnemyBullets(timeScale) {
        const player = this.player;
        const state = this.nearMissState;
        
        this.enemyBullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            
            // Spawn trail every few frames
            if (bullet.active && this.time.now % 4 === 0) {
                this.enemyBulletTrails.emitParticleAt(bullet.x, bullet.y);
            }
            
            // Check if singularity should trap this bullet
            if (this.singularitySystem && this.singularitySystem.checkBulletTrapping(bullet)) {
                return; // Bullet was trapped, skip rest of processing
            }
            
            // Check if void coherence affects this bullet
            if (this.voidCoherence && this.voidCoherence.checkBulletCollision(bullet, true)) {
                // Bullet was redirected/absorbed by void structure
                return;
            }
            
            // Record trajectory for void coherence (bullets passing through empty space)
            if (this.voidCoherence && bullet.active) {
                this.voidCoherence.recordBulletTrajectory(
                    bullet.x, bullet.y,
                    bullet.body.velocity.x, bullet.body.velocity.y,
                    true
                );
            }
            
            // Near-miss detection (only when not already in bullet time and off cooldown)
            if (!state.active && state.cooldown <= 0 && !bullet.nearMissChecked) {
                const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, player.x, player.y);
                
                // Check if bullet is in near-miss zone but not hitting
                if (dist <= this.NEAR_MISS_RADIUS && dist > this.HIT_RADIUS) {
                    // Increment streak if within window
                    let newStreak = state.streak;
                    if (state.timeSinceLast <= this.STREAK_WINDOW || state.streak === 0) {
                        newStreak = Math.min(state.streak + 1, 5); // Cap at 5
                    } else {
                        newStreak = 1;
                    }
                    
                    this.triggerNearMiss(newStreak);
                    bullet.nearMissChecked = true;
                    
                    // Cartographer Protocol: Near-misses sculpt the arena
                    if (this.cartographerProtocol) {
                        this.cartographerProtocol.onNearMiss(bullet.x, bullet.y);
                    }
                    
                    // Record near-miss in Timeline Chronicle
                    if (this.timelineChronicle) {
                        this.timelineChronicle.recordNearMiss(
                            player.x, player.y,
                            bullet.x, bullet.y,
                            dist < 45 // wasGrazing
                        );
                    }
                    
                    // Record near-miss for Apophenia Protocol — The 53rd Dimension
                    if (this.apophenia) {
                        this.apophenia.recordNearMiss(bullet.x, bullet.y, false);
                    }
                    
                    // Notify Noetic Mirror of threat encounter
                    if (this.noeticMirror) {
                        this.noeticMirror.onThreatEncountered('nearMiss', dist);
                    }
                } else if (dist <= this.HIT_RADIUS) {
                    // Bullet actually hit - mark as checked so we don't trigger near-miss
                    bullet.nearMissChecked = true;
                }
            }
            
            // Apply time scale to bullet velocity
            if (bullet.body) {
                if (!bullet._origVelocity) {
                    bullet._origVelocity = { 
                        x: bullet.body.velocity.x / (bullet._lastTimeScale || 1), 
                        y: bullet.body.velocity.y / (bullet._lastTimeScale || 1) 
                    };
                }
                bullet.body.setVelocity(
                    bullet._origVelocity.x * timeScale,
                    bullet._origVelocity.y * timeScale
                );
                bullet._lastTimeScale = timeScale;
            }
            
            // Kill bullets that go off screen
            if (bullet.x < -100 || bullet.x > 2020 || bullet.y < -100 || bullet.y > 1540) {
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.body.reset(0, 0);
                bullet.body.enable = false;
                bullet.nearMissChecked = false;
                bullet._origVelocity = null;
                bullet._lastTimeScale = 1;
            }
        });
    }
    
    spawnEnemyBullet(x, y, angle, speed = 350) {
        const bullet = this.enemyBullets.get(x, y, 'enemyBullet');
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(1);
            bullet.body.enable = true;
            bullet.body.reset(x, y);
            bullet.setTint(0xff3366);
            bullet.setScale(0.6);
            
            bullet.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            bullet.setRotation(angle);
            
            // Reset near-miss tracking
            bullet.nearMissChecked = false;
            bullet._origVelocity = null;
            bullet._lastTimeScale = 1;
            
            // Record in Timeline Chronicle
            if (this.timelineChronicle) {
                this.timelineChronicle.recordBulletFired(x, y, angle, speed, false);
            }
            
            // Record bullet trail for Apophenia Protocol — The 53rd Dimension
            if (this.apophenia) {
                this.apophenia.recordBulletTrail(x, y, angle, speed);
            }
            
            // Emit bullet fired event for Dream State Protocol
            this.events.emit('bulletFired', {
                x, y, angle, speed,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                isPlayer: false
            });
            
            // If in bullet time, immediately convert to echo
            if (this.nearMissState.active && this.echoStorm) {
                this.echoStorm.spawnEchoFromNewBullet(bullet);
            }
        }
        
        return bullet;
    }
    
    /**
     * Spawn a bullet from an Observer Echo (friendly AI)
     */
    spawnEchoBullet(x, y, angle, speed = 400) {
        const bullet = this.bullets.get(x, y, 'bullet');
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(1);
            bullet.body.enable = true;
            bullet.body.reset(x, y);
            bullet.clearTint();
            bullet.setTint(0x00d4ff); // Cyan echo bullets
            bullet.setScale(0.5);
            
            bullet.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            bullet.setRotation(angle);
            
            // Mark as echo bullet for collision handling
            bullet.isEchoBullet = true;
        }
        
        return bullet;
    }
    
    playerHitByBullet(player, bullet) {
        // FIX: Ignore collisions while dialogs are open (game is paused)
        if (this.isExchangePaused || this.isContractPaused) {
            return;
        }
        
        // Check if temporal residue node absorbed the bullet
        if (this.temporalResidue && this.temporalResidue.checkBulletCollision(bullet.x, bullet.y, 8)) {
            // Node absorbed the bullet - destroy bullet and protect player
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.reset(0, 0);
            bullet.body.enable = false;
            bullet.nearMissChecked = false;
            bullet._origVelocity = null;
            return;
        }
        
        // Check if ghost player was hit (during fracture)
        if (this.fractureSystem && this.fractureSystem.isFractured) {
            const ghostHit = this.fractureSystem.checkGhostCollision(bullet.x, bullet.y, 20);
            if (ghostHit) {
                this.fractureSystem.damageGhost(10);
                // Ghost absorbs the bullet - it doesn't hit real player
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.body.reset(0, 0);
                bullet.body.enable = false;
                return;
            }
        }
        
        // Check if Past Echo absorbed the bullet (Chrono-Loop)
        if (this.chronoLoop && this.chronoLoop.checkEchoCollision(bullet.x, bullet.y, 8)) {
            // Echo absorbed the bullet - destroy bullet and protect player
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.reset(0, 0);
            bullet.body.enable = false;
            bullet.nearMissChecked = false;
            bullet._origVelocity = null;
            return;
        }
        
        // Check if Quantum Echo absorbed the bullet
        if (this.quantumImmortality && this.quantumImmortality.checkEchoCollision(bullet.x, bullet.y, 8)) {
            // Quantum Echo absorbed the bullet - destroy bullet and protect player
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.reset(0, 0);
            bullet.body.enable = false;
            bullet.nearMissChecked = false;
            bullet._origVelocity = null;
            return;
        }
        
        // Check if Temporal Rewind afterimage absorbed the bullet
        if (this.temporalRewind && this.temporalRewind.checkAfterimageBulletAbsorption(bullet.x, bullet.y)) {
            // Afterimage absorbed the bullet - destroy bullet and protect player
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.reset(0, 0);
            bullet.body.enable = false;
            bullet.nearMissChecked = false;
            bullet._origVelocity = null;
            return;
        }
        
        // Check if Nemesis Genesis shield absorbed the bullet
        if (this.nemesisGenesis && bullet.isNemesisBullet && 
            this.nemesisGenesis.checkNemesisCollision(bullet.x, bullet.y, 8)) {
            // Nemesis absorbs its own bullet (friendly fire protection)
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.reset(0, 0);
            bullet.body.enable = false;
            return;
        }
        
        // Track damage during fracture
        if (this.fractureSystem && this.fractureSystem.isFractured) {
            this.fractureSystem.onPlayerTookDamageInFracture(10);
        }
        
        // Notify Paradox Engine of damage (reduces multiplier but doesn't fail paradox)
        if (this.paradoxEngine && this.paradoxEngine.paradoxActive) {
            this.paradoxEngine.onPlayerDamaged();
        }
        
        // Recycle bullet
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.reset(0, 0);
        bullet.body.enable = false;
        bullet.nearMissChecked = false;
        bullet._origVelocity = null;
        
        // Player damage
        player.takeDamage(10);
        
        // Notify Syntropy Engine of damage (resets damageless timer)
        if (this.syntropyEngine) {
            this.syntropyEngine.onPlayerDamaged();
        }
        
        // Notify Noetic Mirror of damage (for error recovery analysis)
        if (this.noeticMirror) {
            this.noeticMirror.onPlayerDamaged(10, 'bullet');
        }
        
        // Apply Causal Entanglement damage sharing
        if (this.causalEntanglement) {
            this.causalEntanglement.onEntityDamaged(player, 10, 'bullet');
        }
        
        // Break Resonance Cascade chain on player damage
        if (this.resonanceCascade) {
            this.resonanceCascade.forceBreak();
        }
        
        // Screen shake
        this.cameras.main.shake(100, 0.005);
        
        // Flash vignette red
        this.cameras.main.flash(100, 255, 50, 50, 0.3);
        
        // End bullet time on hit (punishment for getting hit)
        if (this.nearMissState.active) {
            this.nearMissState.active = false;
            this.nearMissState.remaining = 0;
            this.nearMissState.streak = 0;
            this.tweens.add({
                targets: this.bulletTimeVignette,
                alpha: 0,
                duration: 100,
                ease: 'Power2'
            });
            this.physics.world.timeScale = 1;
            
            // Cancel echo storm (punishment: lose absorbed echoes)
            if (this.echoStorm) {
                this.echoStorm.onBulletTimeEnd(player);
            }
        }
        
        if (player.health <= 0) {
            // Observe death before quantum branching
            if (this.observerEffect) {
                this.observerEffect.observeDeath('bullet');
            }
            
            // Emit player death event for Dream State Protocol
            this.events.emit('playerDeath', {
                x: player.x,
                y: player.y,
                killerType: 'bullet',
                score: this.score || 0,
                wave: this.wave || 1
            });
            
            // QUANTUM IMMORTALITY: Branch timeline instead of game over
            if (this.quantumImmortality) {
                this.triggerQuantumBranch(player, bullet);
            } else {
                this.gameOver();
            }
        }
    }
    
    triggerQuantumBranch(player, damageSource) {
        // Create death branch - spawn quantum echo and respawn player
        const deathX = player.x;
        const deathY = player.y;
        
        // Safely get velocity (player might not have physics body in some states)
        const velocityX = player.body?.velocity?.x || 0;
        const velocityY = player.body?.velocity?.y || 0;
        
        const respawnPos = this.quantumImmortality.onPlayerDeath(
            deathX, deathY,
            velocityX, velocityY
        );
        
        // Void coherence: quantum echo spawns create void structures
        if (this.voidCoherence) {
            this.voidCoherence.onQuantumEchoSpawn(deathX, deathY);
        }
        
        // Respawn player at safe position with full health
        player.x = respawnPos.x;
        player.y = respawnPos.y;
        player.health = 100;
        player.setAlpha(0); // Start invisible for respawn effect
        
        // Respawn animation
        this.tweens.add({
            targets: player,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Clear nearby enemy bullets (give breathing room)
        this.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.active) {
                const dist = Phaser.Math.Distance.Between(player.x, player.y, bullet.x, bullet.y);
                if (dist < 200) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                    bullet.body.reset(0, 0);
                    bullet.body.enable = false;
                }
            }
        });
        
        // Visual respawn effect
        const respawnRing = this.add.circle(player.x, player.y, 30, 0xffffff);
        respawnRing.setAlpha(0.6);
        respawnRing.setDepth(99);
        
        this.tweens.add({
            targets: respawnRing,
            scale: 4,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => respawnRing.destroy()
        });
        
        // Reset player velocity (safely)
        if (player.body?.setVelocity) {
            player.body.setVelocity(0, 0);
        }
        
        // Clear any damage sources temporarily (1 second invulnerability)
        player.isInvulnerable = true;
        this.time.delayedCall(1000, () => {
            player.isInvulnerable = false;
        });
    }

    createFloor() {
        const tileSize = 128;
        // Cover a larger area than the arena to prevent visible edges when zoomed out
        const extraMargin = 400; // Extra tiles beyond arena bounds
        for (let x = -extraMargin; x < 1920 + extraMargin; x += tileSize) {
            for (let y = -extraMargin; y < 1440 + extraMargin; y += tileSize) {
                const tile = this.add.image(x + tileSize/2, y + tileSize/2, 'floor');
                // Full opacity within arena, fade out beyond
                const inArena = x >= 0 && x < 1920 && y >= 0 && y < 1440;
                tile.setAlpha(inArena ? 0.4 + Math.random() * 0.2 : 0.1);
                tile.setDepth(-2);
            }
        }
        
        // Add solid dark background that covers everything
        const bg = this.add.rectangle(960, 720, 4000, 4000, 0x0a0a0f);
        bg.setDepth(-3);
    }

    createAmbientGrid() {
        const spacing = 128;
        
        // Arena boundary - visible grid
        const arenaGrid = this.add.graphics();
        arenaGrid.lineStyle(1, 0x1a1a25, 0.3);
        for (let x = 0; x <= 1920; x += spacing) {
            arenaGrid.moveTo(x, 0);
            arenaGrid.lineTo(x, 1440);
        }
        for (let y = 0; y <= 1440; y += spacing) {
            arenaGrid.moveTo(0, y);
            arenaGrid.lineTo(1920, y);
        }
        arenaGrid.strokePath();
        arenaGrid.setDepth(-1);
        
        // Outer boundary line - shows where arena ends
        const bounds = this.add.graphics();
        bounds.lineStyle(2, 0x00f0ff, 0.3);
        bounds.strokeRect(0, 0, 1920, 1440);
        bounds.setDepth(-1);
    }

    createHUD() {
        const margin = 30;
        
        // Health bar - minimal horizontal bar
        this.healthBarBg = this.add.rectangle(margin, margin, 200, 6, 0x22222a);
        this.healthBar = this.add.rectangle(margin, margin, 200, 6, 0x00f0ff);
        this.healthBar.setOrigin(0, 0.5);
        this.healthBarBg.setOrigin(0, 0.5);
        
        // Score - minimal
        this.scoreText = this.add.text(margin, margin + 20, '0', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: '#ffffff'
        });
        
        // Wave indicator
        this.waveText = this.add.text(margin, margin + 50, 'WAVE 1', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 2,
            fill: '#666677'
        });

        // Enemy count
        this.enemyText = this.add.text(margin, margin + 70, '0 ENEMIES', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 1,
            fill: '#ff3366'
        });

        // Near-miss streak indicator (hidden by default)
        this.nearMissText = this.add.text(margin, margin + 88, '', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 1,
            fontStyle: 'bold',
            fill: '#ffd700'
        });
        
        // Syntropy display (cyan-to-gold gradient representation)
        this.syntropyText = this.add.text(margin, margin + 105, '◈ 0', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 1,
            fill: '#00ffff'
        });
        
        // Convergence indicator (appears when systems fuse)
        this.convergenceText = this.add.text(margin, margin + 122, '', {
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: 1,
            fill: '#ffffff'
        });
        
        // Axiom Nexus - synthesis discovery counter
        this.synthesisText = this.add.text(margin, margin + 139, '◇ 0/50', {
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: 1,
            fill: '#ffeebb'
        });
        
        // Apophenia Protocol - pattern discovery counter (53rd dimension)
        this.patternText = this.add.text(margin, margin + 156, '◈ 0 patterns', {
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: 1,
            fill: '#f0f0f0'
        });

        // Wave timer bar - top right
        const screenWidth = this.scale.width;
        
        // Synaesthesia Protocol indicator — the 42nd dimension
        this.audioIndicator = this.add.text(screenWidth - margin, margin + 20, '♫ ON', {
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: 1,
            fill: '#c0c0c0'
        }).setOrigin(1, 0.5);
        this.waveTimerBg = this.add.rectangle(screenWidth - margin, margin, 100, 3, 0x22222a);
        this.waveTimerBar = this.add.rectangle(screenWidth - margin, margin, 100, 3, 0xffff00);
        this.waveTimerBg.setOrigin(1, 0.5);
        this.waveTimerBar.setOrigin(1, 0.5);

        // Set high depth so UI renders on top
        [this.healthBarBg, this.healthBar, this.scoreText, this.waveText, 
         this.enemyText, this.nearMissText, this.syntropyText, this.convergenceText, 
         this.synthesisText, this.patternText, this.waveTimerBg, this.waveTimerBar, this.audioIndicator].forEach(el => {
            el.setDepth(100);
        });

        this.score = 0;
        this.scoreMultiplier = 1.0;  // For Dream State Protocol residue effects
        
        // Handle window resize
        this.scale.on('resize', this.resizeHUD, this);
    }
    
    resizeHUD(gameSize) {
        const margin = 30;
        const worldWidth = 1920;
        const worldHeight = 1440;
        
        // Update wave timer bar position (top right of screen)
        this.waveTimerBg.x = this.scale.width - margin;
        this.waveTimerBar.x = this.scale.width - margin;
        
        // Update audio indicator position
        if (this.audioIndicator) {
            this.audioIndicator.x = this.scale.width - margin;
        }
        
        // Camera always at zoom=1 - just update bounds and viewport
        this.cameras.main.setZoom(1.0);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        
        // Update camera viewport
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    }

    updateHUD() {
        // Health
        const healthPercent = Math.max(0, this.player.health / this.player.maxHealth);
        this.healthBar.width = 200 * healthPercent;
        
        // Color shift on low health
        if (healthPercent < 0.3) {
            this.healthBar.fillColor = 0xff3366;
        } else {
            this.healthBar.fillColor = 0x00f0ff;
        }

        // Score
        this.scoreText.setText(this.score.toString().padStart(6, '0'));

        // Enemy count
        const enemyCount = this.enemies.countActive();
        this.enemyText.setText(`${enemyCount} ENEMY${enemyCount !== 1 ? 'IES' : ''}`);

        // Near-miss streak indicator
        if (this.nearMissState.streak > 0) {
            const streakSymbols = '★'.repeat(Math.min(this.nearMissState.streak, 5));
            this.nearMissText.setText(`STREAK ${streakSymbols}`);
            this.nearMissText.setAlpha(1);
        } else if (this.nearMissState.active) {
            this.nearMissText.setText('BULLET TIME');
            this.nearMissText.setAlpha(1);
        } else {
            this.nearMissText.setAlpha(0);
        }
        
        // Apophenia Protocol pattern counter
        if (this.apophenia && this.patternText) {
            const patternCount = this.apophenia.totalPatternsDiscovered;
            const activeCount = this.apophenia.detectedPatterns.length;
            this.patternText.setText(`◈ ${patternCount} patterns${activeCount > 0 ? ` (${activeCount} active)` : ''}`);
        }

        // Wave timer
        const waveProgress = 1 - (this.nextWaveTime - this.time.now) / 30000;
        this.waveTimerBar.width = Math.max(0, 100 * waveProgress);
        
        // Mnemosyne Weave status
        if (this.mnemosyneWeave) {
            const status = this.mnemosyneWeave.getStatusText();
            if (status && !this.mnemosyneText) {
                // Create text if doesn't exist
                this.mnemosyneText = this.add.text(
                    this.scale.width / 2, 80, status, {
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    letterSpacing: 2,
                    fill: '#9d4edd'
                }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
            } else if (this.mnemosyneText) {
                if (status) {
                    this.mnemosyneText.setText(status);
                    this.mnemosyneText.setAlpha(1);
                    // Color shift based on state
                    if (this.mnemosyneWeave.activeIncursion) {
                        this.mnemosyneText.setFill('#00f0ff');
                    } else if (this.mnemosyneWeave.inTrance) {
                        this.mnemosyneText.setFill('#ffd700');
                    } else {
                        this.mnemosyneText.setFill('#9d4edd');
                    }
                } else {
                    this.mnemosyneText.setAlpha(0);
                }
            }
        }
        
        // Syntropy display
        if (this.syntropyEngine) {
            const syntropy = this.syntropyEngine.syntropy;
            this.syntropyText.setText(`◈ ${syntropy}`);
            // Color shifts from cyan (low) to gold (high)
            if (syntropy >= 1000) {
                this.syntropyText.setFill('#ffd700'); // Gold at cascade
            } else if (syntropy >= 500) {
                this.syntropyText.setFill('#ffff00'); // Yellow approaching cascade
            } else {
                this.syntropyText.setFill('#00ffff'); // Cyan base
            }
        }
        
        // Convergence display
        if (this.aethericConvergence) {
            const activeConvergences = this.aethericConvergence.getActiveConvergences();
            if (activeConvergences.length > 0) {
                const conv = activeConvergences[0]; // Show first active
                const tierSymbol = conv.tier === 'transcendent' ? '◉' : 
                                  conv.tier === 'major' ? '◎' : '○';
                this.convergenceText.setText(`${tierSymbol} ${conv.name}`);
                
                // Color based on tier
                if (conv.tier === 'transcendent') {
                    this.convergenceText.setFill('#ffffff');
                } else if (conv.tier === 'major') {
                    this.convergenceText.setFill('#ffd700');
                } else {
                    this.convergenceText.setFill('#00ffff');
                }
                this.convergenceText.setAlpha(1);
            } else {
                const recent = this.aethericConvergence.getRecentConvergences();
                if (recent.length > 0 && (Date.now() - recent[0].time) < 5000) {
                    // Show fading recent convergence
                    const conv = recent[0];
                    this.convergenceText.setText(`${conv.name} ✓`);
                    this.convergenceText.setFill('#666666');
                    this.convergenceText.setAlpha(1 - (Date.now() - recent[0].time) / 5000);
                } else {
                    this.convergenceText.setAlpha(0);
                }
            }
        }
        
        // Axiom Nexus synthesis display
        if (this.axiomNexus) {
            const stats = this.axiomNexus.getDiscoveryStats();
            this.synthesisText.setText(`◇ ${stats.discovered}/${stats.total}`);
            
            // Color shifts based on layer progress
            if (stats.layer >= 4) {
                this.synthesisText.setFill('#ffffff'); // White for transcendence
            } else if (stats.layer >= 3) {
                this.synthesisText.setFill('#ffeebb'); // Gold-white for master
            } else if (stats.layer >= 2) {
                this.synthesisText.setFill('#ffd700'); // Gold for journeyman
            } else {
                this.synthesisText.setFill('#ffeebb'); // Default nexus color
            }
        }
    }

    spawnEnemies(count) {
        const types = ['enemy', 'enemyFast', 'enemyTank'];
        const worldWidth = 1920;
        const worldHeight = 1440;
        const spawnMargin = 60; // Distance outside the arena to spawn
        
        for (let i = 0; i < count; i++) {
            let x, y;
            
            // Pick a random edge: 0=top, 1=right, 2=bottom, 3=left
            const edge = Phaser.Math.Between(0, 3);
            
            switch (edge) {
                case 0: // Top edge
                    x = Phaser.Math.Between(0, worldWidth);
                    y = -spawnMargin;
                    break;
                case 1: // Right edge
                    x = worldWidth + spawnMargin;
                    y = Phaser.Math.Between(0, worldHeight);
                    break;
                case 2: // Bottom edge
                    x = Phaser.Math.Between(0, worldWidth);
                    y = worldHeight + spawnMargin;
                    break;
                case 3: // Left edge
                    x = -spawnMargin;
                    y = Phaser.Math.Between(0, worldHeight);
                    break;
            }

            // Choose enemy type based on wave
            let type = types[0];
            if (this.wave > 2 && Math.random() < 0.3) type = types[1];
            if (this.wave > 4 && Math.random() < 0.2) type = types[2];

            const enemy = new Enemy(this, x, y, this.player, type);
            this.enemies.add(enemy);
            
            // Apply Exogenesis reality modifiers to enemy
            if (this.exogenesis) {
                const modifiers = this.exogenesis.getEnemyModifiers();
                enemy.speed *= modifiers.speed;
                enemy.damage *= modifiers.damage;
                
                // Visual indicator for full moon enemies
                if (this.exogenesis.isFullMoon()) {
                    enemy.setTint(0xff4444); // Red tint during full moon
                }
            }
            
            // Apply Proteus Protocol phenotype modifiers to enemy
            if (this.proteus) {
                const phenotype = this.proteus.getPhenotype();
                enemy.speed *= phenotype.enemySpeedMultiplier;
                enemy.damage *= phenotype.enemyHealthMultiplier; // Reuse health as damage mod
                
                // Apply intelligence-based behaviors
                if (this.proteus.shouldFlank()) {
                    enemy.enableFlanking = true;
                }
                
                // Visual tint based on species type
                if (this.proteus.isHighAggression()) {
                    enemy.setTint(0xff6644); // Orange-red for aggressive genomes
                } else if (this.proteus.isHighTempo()) {
                    enemy.setTint(0x66aaff); // Blue for tempo-focused genomes
                }
            }
            
            // Saga Engine: register enemy as character
            if (this.sagaEngine) {
                const character = this.sagaEngine.onEnemySpawned(enemy, type);
                // Store character ID on enemy for later reference
                enemy.characterId = character ? character.id : null;
            }
        }
    }

    hitEnemy(bullet, enemy) {
        // FIX: Ignore collisions while dialogs are open (game is paused)
        if (this.isExchangePaused || this.isContractPaused) {
            return;
        }
        
        // Track ghost bullet damage during fracture
        if (bullet.isGhostBullet && this.fractureSystem) {
            this.fractureSystem.onGhostBulletHitEnemy();
            // Track for phasing mod progress
            if (this.omniWeapon) {
                this.omniWeapon.onGhostBulletHit();
            }
        }
        
        // Apply omni-weapon effects and check if bullet should continue (piercing)
        let shouldDestroy = true;
        if (this.omniWeapon) {
            const result = this.omniWeapon.onBulletHitEnemy(bullet, enemy);
            shouldDestroy = (result !== 'continue');
        }
        
        // Track fracture kills for pierce mod progress
        if (bullet.isGhostBullet && this.fractureSystem && this.omniWeapon) {
            this.omniWeapon.onFractureKill();
        }
        
        // Recycle bullet back to pool (unless piercing)
        if (shouldDestroy) {
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.reset(0, 0);
            bullet.body.enable = false;
        }
        
        // Hit particles
        this.hitParticles.setParticleTint(enemy.tintTopLeft || 0xff3366);
        this.hitParticles.emitParticleAt(enemy.x, enemy.y);
        
        // Audio: enemy hit
        if (this.synaesthesiaProtocol) {
            this.synaesthesiaProtocol.onGameplayEvent('enemyHit');
        }
        
        // Screen shake on hit
        this.cameras.main.shake(50, 0.002);
        
        // Calculate damage
        let damage = this.omniWeapon ? this.omniWeapon.weaponStats.damage : 34;
        
        // Apply Resonance Cascade damage multiplier
        if (this.resonanceCascade) {
            damage *= this.resonanceCascade.getDamageMultiplier();
        }
        
        // Apply Void Coherence damage multiplier
        if (this.voidCoherence) {
            damage *= this.voidCoherence.getBulletDamageMultiplier();
        }
        
        // Apply Symbiotic Prediction harmony multiplier
        if (this.symbioticPrediction) {
            damage *= this.symbioticPrediction.getHarmonyMultiplier();
        }
        
        // Apply Rhythm of the Void on-beat bonus
        if (this.rhythmOfTheVoid) {
            damage *= this.rhythmOfTheVoid.getRhythmBonus();
        }
        
        // Track for Recursion Engine (accuracy analysis)
        if (this.recursionEngine) {
            this.recursionEngine.recordHit();
        }
        
        // Track hit for Rival Protocol trauma system
        if (enemy.onHitByPlayer) {
            enemy.onHitByPlayer(bullet, 'piercing');
        }
        
        enemy.takeDamage(damage);
        
        // Record combat for Athenaeum Protocol (geography of memory)
        if (this.athenaeumProtocol) {
            this.athenaeumProtocol.recordCombat(enemy.x, enemy.y, damage);
        }
        
        // Apply Causal Entanglement damage sharing
        if (this.causalEntanglement) {
            this.causalEntanglement.onEntityDamaged(enemy, damage, 'bullet');
        }
        
        if (!enemy.active) {
            // Death particles
            this.deathParticles.setParticleTint(enemy.tintTopLeft || 0xff3366);
            this.deathParticles.emitParticleAt(enemy.x, enemy.y);
            
            // Emit enemy killed event for Dream State Protocol
            this.events.emit('enemyKilled', {
                x: enemy.x,
                y: enemy.y,
                type: enemy.type,
                maxHealth: enemy.maxHealth,
                scoreValue: enemy.scoreValue
            });
            
            // Record kill for Apophenia Protocol — The 53rd Dimension: PATTERN DIVINATION
            if (this.apophenia) {
                this.apophenia.recordKill(enemy.x, enemy.y, enemy.type);
            }
            
            // Apply Kairos flow multiplier to score
            const kairosMultiplier = this.kairosMoment?.getFlowBonus() || 1.0;
            this.score += Math.floor(enemy.scoreValue * kairosMultiplier);
            
            // Track for Temporal Contracts
            if (this.temporalContract) {
                this.temporalContract.onEnemyKilled();
            }
            
            // Add momentum for kill
            if (this.fractureSystem) {
                this.fractureSystem.addMomentum(
                    this.fractureSystem.momentumGain.kill,
                    'kill'
                );
                // Track kills during fracture
                this.fractureSystem.onEnemyKilledInFracture();
            }
            
            // Add charge for singularity on kill
            if (this.singularitySystem) {
                this.singularitySystem.addCharge(
                    this.singularitySystem.chargeGainPerKill,
                    'kill'
                );
            }
            
            // Track shard enemy kills for Mnemosyne Weave
            if (this.mnemosyneWeave) {
                this.mnemosyneWeave.onShardEnemyKilled(enemy);
            }
            
            // Track for Oracle Protocol (fated kills, doom encounters)
            if (this.oracleProtocol) {
                this.oracleProtocol.onEnemyKilled(enemy);
            }
            
            // Generate Syntropy for elegant elimination
            if (this.syntropyEngine) {
                const context = {
                    singleBullet: !bullet.hasPierced,
                    curvedBullet: bullet.syntropyCurved,
                    nearMissKill: this.nearMissState.active
                };
                this.syntropyEngine.onEnemyKilled(enemy, bullet, context);
            }
            
            // Notify Egregore Protocol of Unknown Geometry destruction
            if (enemy.isUnknownGeometry && this.egregoreProtocol) {
                this.egregoreProtocol.onUnknownDestroyed(enemy);
            }
            
            // Notify Noetic Mirror of enemy killed (for mastery tracking)
            // Report kill method to Noetic Mirror
            const method = bullet.isGhostBullet ? 'ghost' : 'direct';
            if (this.noeticMirror) {
                this.noeticMirror.onEnemyKilled(enemy, method);
            }
            
            // Audio: enemy death satisfaction
            if (this.synaesthesiaProtocol) {
                this.synaesthesiaProtocol.onGameplayEvent('enemyDeath');
            }
            
            // Tychos Aurora: Pulse safety field at enemy death location
            if (this.tychosAurora) {
                this.tychosAurora.pulseField('safety', enemy.x, enemy.y, 0.6);
                this.tychosAurora.pulseField('memory', enemy.x, enemy.y, 0.4);
            }
            
            // Resonance Orb System: Chance to drop power-up orb
            if (this.resonanceOrbs) {
                const comboLength = this.resonanceCascade?.chain?.length || 0;
                this.resonanceOrbs.onEnemyDefeated(enemy.x, enemy.y, comboLength);
            }
        }
    }
    
    hitNemesis(bullet, nemesis) {
        // Process the hit through NemesisGenesis system
        if (this.nemesisGenesis && this.nemesisGenesis.hitNemesis(bullet)) {
            // Recycle bullet
            bullet.setActive(false);
            bullet.setVisible(false);
            bullet.body.reset(0, 0);
            bullet.body.enable = false;
            
            // Track for systems
            if (this.resonanceCascade) {
                this.resonanceCascade.recordActivation('NEMESIS_HIT');
            }
            
            // Generate Syntropy for hitting nemesis
            if (this.syntropyEngine) {
                this.syntropyEngine.onSyntropyGenerated(25, 'nemesis_damage');
            }
        }
    }

    playerHit(player, enemy) {
        // FIX: Ignore collisions while dialogs are open (game is paused)
        if (this.isExchangePaused || this.isContractPaused) {
            return;
        }
        
        // Check if ghost player was hit (during fracture)
        if (this.fractureSystem && this.fractureSystem.isFractured) {
            const ghostHit = this.fractureSystem.checkGhostCollision(enemy.x, enemy.y, 30);
            if (ghostHit) {
                this.fractureSystem.damageGhost(enemy.damage);
                // Ghost takes damage but doesn't take collision damage
                enemy.takeDamage(15); // Ghost deals damage to enemy
                return;
            }
        }
        
        // Track damage during fracture
        if (this.fractureSystem && this.fractureSystem.isFractured) {
            this.fractureSystem.onPlayerTookDamageInFracture(enemy.damage);
        }
        
        // Knockback
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        player.knockback(Math.cos(angle) * 300, Math.sin(angle) * 300);
        
        // Player damage
        player.takeDamage(enemy.damage);
        
        // Audio: damage warning
        if (this.synaesthesiaProtocol) {
            this.synaesthesiaProtocol.onGameplayEvent('damageTaken', player.health);
        }
        
        // Saga Engine: record enemy wound on player
        if (this.sagaEngine && enemy.characterId) {
            this.sagaEngine.onPlayerDamaged(enemy.damage, { 
                id: enemy.characterId,
                type: enemy.enemyType 
            });
        }
        
        // Notify Syntropy Engine of damage
        if (this.syntropyEngine) {
            this.syntropyEngine.onPlayerDamaged();
        }
        
        // Apply Causal Entanglement damage sharing for player
        if (this.causalEntanglement) {
            this.causalEntanglement.onEntityDamaged(player, enemy.damage, 'enemy');
        }
        
        // Break Resonance Cascade chain on player damage
        if (this.resonanceCascade) {
            this.resonanceCascade.forceBreak();
        }
        
        // Enemy also takes damage (mutual destruction)
        enemy.takeDamage(20);
        
        // Apply Causal Entanglement damage sharing for enemy
        if (this.causalEntanglement) {
            this.causalEntanglement.onEntityDamaged(enemy, 20, 'player_collision');
        }
        
        // Screen shake
        this.cameras.main.shake(100, 0.005);
        
        // Flash vignette
        this.cameras.main.flash(100, 255, 50, 50, 0.2);

        if (player.health <= 0) {
            // Observe death from enemy collision
            if (this.observerEffect) {
                const cause = enemy.type === 'enemyTank' ? 'tank' : 
                              enemy.type === 'enemyFast' ? 'fast' : 'normal';
                this.observerEffect.observeDeath(cause);
            }
            
            // QUANTUM IMMORTALITY: Branch timeline instead of game over
            if (this.quantumImmortality) {
                this.triggerQuantumBranch(player, enemy);
            } else {
                this.gameOver();
            }
        }
    }

    enemyBounce(enemy1, enemy2) {
        // Slight separation impulse to prevent clumping
        const angle = Phaser.Math.Angle.Between(enemy1.x, enemy1.y, enemy2.x, enemy2.y);
        const force = 20;
        enemy1.body.velocity.x -= Math.cos(angle) * force;
        enemy1.body.velocity.y -= Math.sin(angle) * force;
        enemy2.body.velocity.x += Math.cos(angle) * force;
        enemy2.body.velocity.y += Math.sin(angle) * force;
    }

    nextWave() {
        this.wave++;
        this.nextWaveTime = this.time.now + 30000;
        
        // Rival Protocol: Check for enemy escapes at wave transition
        // Enemies at low health may escape and become future Rivals
        if (this.rivalProtocol) {
            this.enemies.children.entries.forEach(enemy => {
                if (enemy.active && !enemy.isRival && enemy.health / enemy.maxHealth <= 0.25) {
                    // Low health enemy escapes - will remember this trauma
                    enemy.escape();
                }
            });
        }
        
        // Audio: wave transition cymbal + sub drop
        if (this.synaesthesiaProtocol) {
            this.synaesthesiaProtocol.onGameplayEvent('waveTransition', this.wave);
        }
        
        // Advance Recursion Engine infection
        if (this.recursionEngine) {
            this.recursionEngine.advanceWave(this.wave);
        }
        
        // Check for boss spawn
        if (this.wave === this.bossWave && !this.bossSpawned) {
            this.spawnBoss();
            return; // Skip normal wave spawning when boss spawns
        }
        
        // Wave announcement
        const waveText = this.add.text(this.player.x, this.player.y - 80, `WAVE ${this.wave}`, {
            fontFamily: 'monospace',
            fontSize: '32px',
            letterSpacing: 4,
            fill: '#ffff00'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: waveText,
            y: waveText.y - 50,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => waveText.destroy()
        });
        
        // Spawn wave (reduced spawns if boss is active)
        const spawnCount = this.tesseractTitan && this.tesseractTitan.active 
            ? 2 + this.wave 
            : 3 + this.wave * 2;
        this.spawnEnemies(spawnCount);
        
        // Increase spawn rate
        if (this.spawnTimer.delay > 1500) {
            this.spawnTimer.remove();
            this.spawnTimer = this.time.addEvent({
                delay: Math.max(1500, 4000 - this.wave * 300),
                callback: () => this.spawnEnemies(2 + Math.floor(this.wave / 2)),
                callbackScope: this,
                loop: true
            });
        }
    }
    
    spawnBoss() {
        this.bossSpawned = true;
        
        // Spawn the Tesseract Titan at arena center
        this.tesseractTitan = new TesseractTitan(this);
        this.tesseractTitan.spawn();
        
        // Add collision between player bullets and boss
        this.physics.add.overlap(this.bullets, this.tesseractTitan.coreGlow, this.hitBoss, null, this);
        
        // Add collision between player and boss (contact damage)
        this.bossCollider = this.physics.add.overlap(
            this.player, this.tesseractTitan.coreGlow, 
            this.playerHitBoss, null, this
        );
        
        // Stop regular enemy spawns during boss
        this.spawnTimer.remove();
        
        // Reduced spawns - occasional adds during boss
        this.spawnTimer = this.time.addEvent({
            delay: 6000,
            callback: () => {
                if (this.tesseractTitan && this.tesseractTitan.active) {
                    this.spawnEnemies(2);
                }
            },
            callbackScope: this,
            loop: true
        });
        
        // Observe boss spawn
        if (this.observerEffect) {
            this.observerEffect.observeTemporalUse('bossSpawn', {
                bossName: 'TESSERACT TITAN',
                wave: this.wave
            });
        }
        
        // Saga Engine: record boss confrontation story beat
        if (this.sagaEngine) {
            this.sagaEngine.onSystemActivated('titan', {
                wave: this.wave,
                bossName: 'The Geometric Overseer'
            });
        }
    }
    
    hitBoss(bullet, bossCore) {
        if (!this.tesseractTitan || !this.tesseractTitan.active) return;
        
        // Apply omni-weapon effects
        let shouldDestroy = true;
        if (this.omniWeapon) {
            const result = this.omniWeapon.onBulletHitEnemy(bullet, { active: true });
            shouldDestroy = (result !== 'continue');
        }
        
        // Calculate damage with resonance multiplier
        let damage = this.omniWeapon ? this.omniWeapon.weaponStats.damage : 34;
        if (this.resonanceCascade) {
            damage *= this.resonanceCascade.getDamageMultiplier();
        }
        
        // Deal damage to boss
        const hit = this.tesseractTitan.takeDamage(damage);
        
        if (hit) {
            // Recycle bullet (unless piercing)
            if (shouldDestroy) {
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.body.reset(0, 0);
                bullet.body.enable = false;
            }
            
            // Hit particles
            this.hitParticles.setParticleTint(0xff0066);
            this.hitParticles.emitParticleAt(bullet.x, bullet.y);
            
            // Score for hitting boss
            this.score += 10;
        }
    }
    
    playerHitBoss(player, bossCore) {
        if (!this.tesseractTitan || !this.tesseractTitan.active) return;
        
        // Only hit if not recently hit by boss
        if (player.isInvulnerable) return;
        
        // Contact damage (higher than regular enemies)
        const damage = 25;
        player.takeDamage(damage);
        
        // Knockback away from boss
        const angle = Phaser.Math.Angle.Between(
            this.tesseractTitan.x, this.tesseractTitan.y,
            player.x, player.y
        );
        player.knockback(Math.cos(angle) * 500, Math.sin(angle) * 500);
        
        // Screen shake
        this.cameras.main.shake(150, 0.008);
        this.cameras.main.flash(150, 255, 0, 0, 0.4);
        
        // Break Resonance Cascade chain
        if (this.resonanceCascade) {
            this.resonanceCascade.forceBreak();
        }
        
        // Brief invulnerability after boss hit
        player.isInvulnerable = true;
        this.time.delayedCall(800, () => {
            if (player.active) player.isInvulnerable = false;
        });
        
        // Check for death
        if (player.health <= 0) {
            if (this.observerEffect) {
                this.observerEffect.observeDeath('boss_contact');
            }
            
            if (this.quantumImmortality) {
                this.triggerQuantumBranch(player, { type: 'boss' });
            } else {
                this.gameOver();
            }
        }
    }

    gameOver() {
        // Audio: game over - final chord
        if (this.synaesthesiaProtocol) {
            this.synaesthesiaProtocol.onGameplayEvent('gameOver');
            this.synaesthesiaProtocol.stop();
        }
        
        // Record final death in chronicle
        if (this.timelineChronicle && this.player) {
            this.timelineChronicle.recordDeath(this.player.x, this.player.y, 'final');
        }
        
        // Leave Resonant Whisper bloodmark at death location
        if (this.resonantWhispers && this.player) {
            this.resonantWhispers.onPlayerDeath('final');
        }
        
        // Temporal Pedagogy: Analyze death for learning opportunity
        if (this.temporalPedagogy) {
            this.temporalPedagogy.onPlayerDeath();
        }
        
        // Inscription Protocol: Record death in the living chronicle
        if (this.inscriptionProtocol) {
            this.inscriptionProtocol.requestInscription('death', {
                wave: this.wave,
                score: this.score,
                systems: this.getActiveSystems()
            });
        }
        
        // Finalize and save timeline shard
        let newShard = null;
        if (this.timelineChronicle) {
            newShard = this.timelineChronicle.finalizeAndSave();
        }
        
        // Save Recursion Engine behavioral genome
        if (this.recursionEngine) {
            this.recursionEngine.onGameEnd();
        }
        
        // PROTEUS PROTOCOL: Evolve the game genome based on this run
        if (this.proteus) {
            const evolution = this.proteus.evolveGeneration('death');
            console.log(`[GAME] Proteus evolution complete: Gen ${evolution.generation}, Fitness: ${evolution.fitness.toFixed(2)}`);
        }
        
        // Clean up echo storm
        if (this.echoStorm) {
            this.echoStorm.destroy();
            this.echoStorm = null;
        }
        
        // Clean up fracture system
        if (this.fractureSystem) {
            this.fractureSystem.destroy();
            this.fractureSystem = null;
        }
        
        // Clean up temporal residue system
        if (this.temporalResidue) {
            this.temporalResidue.destroy();
            this.temporalResidue = null;
        }
        
        // Clean up singularity system
        if (this.singularitySystem) {
            this.singularitySystem.destroy();
            this.singularitySystem = null;
        }
        
        // Clean up chrono-loop system
        if (this.chronoLoop) {
            this.chronoLoop.destroy();
            this.chronoLoop = null;
        }
        
        // Clean up quantum immortality system
        if (this.quantumImmortality) {
            this.quantumImmortality.destroy();
            this.quantumImmortality = null;
        }
        
        // Clean up Tesseract Titan boss
        if (this.tesseractTitan) {
            this.tesseractTitan.destroy();
            this.tesseractTitan = null;
        }
        
        // Clean up Dimensional Collapse system
        if (this.dimensionalCollapse) {
            this.dimensionalCollapse.destroy();
            this.dimensionalCollapse = null;
        }
        
        // Clean up Temporal Rewind system
        if (this.temporalRewind) {
            this.temporalRewind.destroy();
            this.temporalRewind = null;
        }
        
        // Clean up temporal contract system (saves contracts for next run)
        if (this.temporalContract) {
            this.temporalContract.onGameEnd();
            this.temporalContract.destroy();
            this.temporalContract = null;
        }
        
        // Clean up cinematic archive system (saves final archive stats)
        if (this.cinematicArchive) {
            this.cinematicArchive.destroy();
            this.cinematicArchive = null;
        }
        
        // Clean up Kairos Moment system (saves flow history)
        if (this.kairosMoment) {
            this.kairosMoment.destroy();
            this.kairosMoment = null;
        }
        
        // Clean up Nemesis Genesis system (saves profile for next nemesis)
        if (this.nemesisGenesis) {
            this.nemesisGenesis.destroy();
            this.nemesisGenesis = null;
        }
        
        // Clean up Oracle Protocol system (saves oracle profile)
        if (this.oracleProtocol) {
            this.oracleProtocol.destroy();
            this.oracleProtocol = null;
        }
        
        // Clean up Egregore Protocol system (saves collective data)
        if (this.egregoreProtocol) {
            this.egregoreProtocol.destroy();
            this.egregoreProtocol = null;
        }
        
        // Clean up Harmonic Convergence system (stops audio)
        if (this.harmonicConvergence) {
            this.harmonicConvergence.destroy();
            this.harmonicConvergence = null;
        }
        
        // Clean up Synchronicity Cascade system
        if (this.synchronicityCascade) {
            this.synchronicityCascade.destroy();
            this.synchronicityCascade = null;
        }
        
        // Clean up Bootstrap Protocol system
        if (this.bootstrapProtocol) {
            this.bootstrapProtocol.destroy();
            this.bootstrapProtocol = null;
        }
        
        // Clean up Geometric Chorus system
        if (this.geometricChorus) {
            this.geometricChorus.destroy();
            this.geometricChorus = null;
        }
        
        // Clean up Architect System
        if (this.architectSystem) {
            this.architectSystem.destroy();
            this.architectSystem = null;
        }
        
        // Complete Saga Engine chapter and clean up
        if (this.sagaEngine) {
            this.sagaEngine.onGameEnd(this.score, this.survivalTime, this.wave);
            this.sagaEngine.destroy();
            this.sagaEngine = null;
        }
        
        // Clean up Noetic Mirror System
        if (this.noeticMirror) {
            this.noeticMirror.destroy();
            this.noeticMirror = null;
        }
        
        // Clean up Ambient Awareness System
        if (this.ambientAwareness) {
            this.ambientAwareness.destroy();
            this.ambientAwareness = null;
        }
        
        // Clean up Temporal Pedagogy System (saves learning profile)
        if (this.temporalPedagogy) {
            this.temporalPedagogy.destroy();
            this.temporalPedagogy = null;
        }
        
        // Clean up Athenaeum Protocol (saves geographic memory)
        if (this.athenaeumProtocol) {
            this.athenaeumProtocol.destroy();
            this.athenaeumProtocol = null;
        }
        
        // Clean up Axiom Nexus (saves synthesis discoveries)
        if (this.axiomNexus) {
            this.axiomNexus.destroy();
            this.axiomNexus = null;
        }
        
        // Finalize Inscription Protocol (writes session closing to chronicle)
        if (this.inscriptionProtocol) {
            this.inscriptionProtocol.finalizeSession();
            this.inscriptionProtocol.destroy();
            this.inscriptionProtocol = null;
        }
        
        // Notify Rival Protocol of player death (rivals escape with grudge)
        if (this.rivalProtocol) {
            this.rivalProtocol.onPlayerDeath();
            this.rivalProtocol.destroy();
            this.rivalProtocol = null;
        }
        
        // Cleanup Rhythm of the Void
        if (this.rhythmOfTheVoid) {
            this.rhythmOfTheVoid.destroy();
            this.rhythmOfTheVoid = null;
        }
        
        // Clean up Cartographer Protocol
        if (this.cartographerProtocol) {
            this.cartographerProtocol.destroy();
            this.cartographerProtocol = null;
        }
        
        // Clean up Sanctum Protocol (saves state for next visit)
        if (this.sanctumProtocol) {
            this.sanctumProtocol.destroy();
            this.sanctumProtocol = null;
        }
        
        // Clean up Meta-System Operator
        if (this.metaSystemOperator) {
            this.metaSystemOperator.destroy();
            this.metaSystemOperator = null;
        }
        
        // Clean up Void Exchange System (saves portfolio state)
        if (this.voidExchange) {
            this.voidExchange.destroy();
            this.voidExchange = null;
        }
        
        // Clean up Heartflux Protocol
        if (this.heartflux) {
            this.heartflux.destroy();
            this.heartflux = null;
        }
        
        // Clean up Proteus Protocol (genome is already saved during evolution)
        if (this.proteus) {
            this.proteus.cleanup();
            this.proteus = null;
        }

        // Stop all sounds and music
        this.cameras.main.fade(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameOverScene', { 
                score: this.score, 
                wave: this.wave,
                quantumStats: this.quantumImmortality ? {
                    deaths: this.quantumImmortality.deathCount,
                    echoes: this.quantumImmortality.totalEchoesSpawned,
                    maxEntropy: this.quantumImmortality.timelineEntropy
                } : null,
                newShard: newShard ? {
                    rarity: newShard.rarity,
                    playstyle: newShard.playstyle,
                    dominantSystem: newShard.dominantSystem
                } : null,
                entanglementStats: this.causalEntanglement ? this.causalEntanglement.getNetworkStats() : null
            });
        });
    }

    getBulletsGroup() {
        return this.bullets;
    }

    getBulletTrails() {
        return this.bulletTrails;
    }
    
    generateEnemyId() {
        // Generate unique ID for enemy tracking in Rival Protocol
        return 'enemy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    applyEquippedShardBonuses() {
        if (!this.timelineChronicle) return;
        
        const equippedShards = this.timelineChronicle.getEquippedShards();
        if (equippedShards.length === 0) return;
        
        this.shardBonuses = {
            fireRateMod: 1.0,
            bulletSpeedMod: 1.0,
            moveSpeedMod: 1.0,
            maxHealthMod: 1.0,
            scoreMultiplier: 1.0,
            bulletTimeDurationMod: 1.0
        };
        
        equippedShards.forEach(shard => {
            shard.bonuses.forEach(bonus => {
                switch (bonus.type) {
                    case 'bulletTime':
                        this.SLOW_MO_DURATION *= (1 + bonus.value);
                        this.shardBonuses.bulletTimeDurationMod *= (1 + bonus.value);
                        break;
                    case 'movement':
                        this.player.speed *= (1 + bonus.value / 100);
                        this.shardBonuses.moveSpeedMod *= (1 + bonus.value / 100);
                        break;
                    case 'combat':
                        this.player.fireRate *= (1 - bonus.value);
                        this.shardBonuses.fireRateMod *= (1 - bonus.value);
                        break;
                    case 'defense':
                        this.player.maxHealth += bonus.value;
                        this.player.health += bonus.value;
                        this.shardBonuses.maxHealthMod += bonus.value / 100;
                        break;
                    case 'general':
                        this.shardBonuses.scoreMultiplier *= (1 + bonus.value);
                        break;
                }
            });
        });
        
        // Check for resonance harmony
        const harmony = this.timelineChronicle.checkResonantHarmony(equippedShards);
        if (harmony) {
            this.currentHarmony = harmony;
            // Show harmony text
            this.time.delayedCall(2000, () => {
                const harmonyText = this.add.text(this.player.x, this.player.y - 100, 
                    `♦ ${harmony.name} ♦`, {
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    fill: '#ffd700'
                }).setOrigin(0.5);
                
                this.tweens.add({
                    targets: harmonyText,
                    y: harmonyText.y - 40,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => harmonyText.destroy()
                });
            });
        }
    }
    
    // Callback for Syntropy Engine when cascade starts
    onSyntropyCascadeStart() {
        // Score multiplier during cascade
        this.cascadeScoreMultiplier = 2.0;
    }
    
    // Callback for Syntropy Engine when cascade ends  
    onSyntropyCascadeEnd() {
        this.cascadeScoreMultiplier = 1.0;
    }
    
    // Update syntropy HUD - called by SyntropyEngine
    updateSyntropyHUD(syntropy, cascadeActive) {
        if (this.syntropyText) {
            this.syntropyText.setText(`◈ ${syntropy}`);
            if (cascadeActive) {
                this.syntropyText.setFill('#ffd700');
            } else if (syntropy >= 500) {
                this.syntropyText.setFill('#ffff00');
            } else {
                this.syntropyText.setFill('#00ffff');
            }
        }
    }
    
    // Public method for other systems to record their usage
    recordSystemUsage(systemName, context = {}) {
        if (this.timelineChronicle) {
            this.timelineChronicle.recordSystemUse(systemName, context);
        }
        // Also notify syntropy engine for system chaining
        if (this.syntropyEngine) {
            this.syntropyEngine.onSystemUsed(systemName);
        }
    }
    
    showVoidExchangeHint() {
        const hint = this.add.text(this.player.x, this.player.y - 100,
            '◈ VOID EXCHANGE — THE 54TH DIMENSION ◈\n' +
            'TEMPORAL CAPITALISM: Trade your future for power now\n' +
            'Press [X] to open the trading floor. Buy futures. Short survival.\n' +
            'Debt is power. Margin calls are death. Trade wisely.',
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                letterSpacing: 1,
                fill: '#ffd700', // Gold - the color of capital
                align: 'center'
            }).setOrigin(0.5);
        
        this.tweens.add({
            targets: hint,
            y: hint.y - 30,
            alpha: 0,
            duration: 6000,
            delay: 1000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showProteusWelcome() {
        const { width, height } = this.scale;
        
        const container = this.add.container(width / 2, height / 2 - 50);
        
        const title = this.add.text(0, -30, '◈ PROTEUS PROTOCOL — THE 57TH DIMENSION ◈', {
            fontFamily: 'monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            fill: '#00d4aa',
            align: 'center'
        }).setOrigin(0.5);
        
        const subtitle = this.add.text(0, 10, 'THE EVOLUTION OF RULES', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#9d4edd',
            align: 'center'
        }).setOrigin(0.5);
        
        const desc = this.add.text(0, 45, 
            'The game is now alive. It evolves to match you.\n' +
            'Each death shapes its DNA. Each run is unique.\n' +
            `Current species: ${this.proteus.genome.species} | Gen ${this.proteus.genome.generation}`, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        container.add([title, subtitle, desc]);
        
        // Animate in
        container.setAlpha(0);
        container.setScale(0.8);
        
        this.tweens.add({
            targets: container,
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Back.out'
        });
        
        // Fade out after delay
        this.tweens.add({
            targets: container,
            alpha: 0,
            scale: 0.9,
            delay: 5000,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => container.destroy()
        });
    }
}
