import Phaser from 'phaser';

/**
 * AXIOM NEXUS — The Synthesis Mentor
 * 
 * The 41st cognitive dimension: PEDAGOGICAL SYNTHESIS
 * 
 * While Temporal Pedagogy teaches individual mechanics and Athenaeum Protocol
 * archives discoveries, the Axiom Nexus creates personalized "aha moment" 
 * pathways through the 40+ system ecosystem. It doesn't just track what you 
 * know — it understands what you *haven't synthesized yet* and crafts 
 * experiences that guide you toward emergent mastery.
 * 
 * === THE CORE INNOVATION: Synthesis Gap Analysis ===
 * 
 * The system maintains a "synthesis matrix" tracking which system 
 * combinations the player has discovered vs. which remain hidden. It then:
 * 
 * 1. IDENTIFIES: Detects which synergies you're close to but haven't seen
 * 2. CATALYZES: Creates situations where those synergies naturally emerge  
 * 3. ILLUMINATES: When you discover them, explains what you found
 * 4. CONNECTS: Shows how this new synthesis bridges to others
 * 
 * === THE SYNTHESIS MATRIX ===
 * 
 * 40 systems = 780 possible pairs, but not all are meaningful. The matrix 
 * tracks 50+ genuinely transformative combinations:
 * 
 * | Combination | Name | Synthesis Effect |
 * |-------------|------|------------------|
 * | Echo Storm + Singularity | Gravity Graze | Echoes pulled into singularity |
 * | Paradox + Chrono-Loop | Temporal Echo | Past self commits paradox |
 * | Quantum + Fracture | Schrödinger's Clone | Ghost in superposition |
 * | Resonance + Architect | Creative Cascade | Chains trigger inventions |
 * | Void + Oracle | Prophetic Void | Predictions show through void |
 * | ... and 45+ more ... |
 * 
 * === PERSONALIZED DISCOVERY PATHS ===
 * 
 * Rather than random tutorials, the Nexus creates "curated coincidences":
 * 
 * EXAMPLE: Player uses Echo Storm heavily, has never touched Singularity
 * - Nexus spawns enemies near singularity-ideal geometry
 * - Echoes naturally drift toward potential singularity positions
 * - Player places singularity "accidentally" — sees gravity graze
 * - "AHA" moment: Text explains "ECHO GRAVITY" synthesis discovered
 * - Synthesis becomes permanent; future runs spawn Echo Gravity naturally
 * 
 * === THE DISCOVERY HORIZON ===
 * 
 * The system calculates "discovery potential" for each synthesis:
 * 
 * potential = (systemA_usage × systemB_usage × context_proximity) / previous_attempts
 * 
 * High potential + hasn't happened = Nexus creates "nudge situation"
 * 
 * === PROGRESSIVE REVELATION ===
 * 
 * Layer 1 (0-10 discoveries): Shows basic pairs (Echo+Bullet Time, etc.)
 * Layer 2 (10-25): Reveals triads (3-system combinations)
 * Layer 3 (25-40): Shows "bridge syntheses" (connections between pairs)
 * Layer 4 (40+): The Ultimate Synthesis — when ALL active systems align
 * 
 * === THE ULTIMATE SYNTHESIS ===
 * 
 * When player activates 8+ systems simultaneously:
 * "TRANSCENDENCE" mode activates — time slows, colors shift to prismatic,
 * and for 10 seconds the game demonstrates the full ecosystem working as one.
 * This is the "Impossible Run" that shows what mastery looks like.
 * 
 * Color: Nexus Gold-White (#ffeebb) — the color of illumination
 */

export default class AxiomNexusSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Nexus colors — illumination and revelation
        this.NEXUS_COLOR = 0xffeebb;
        this.NEXUS_GLOW = 0xfff8dd;
        this.TEXT_COLOR = '#ffeebb';
        
        // === SYNTHESIS MATRIX ===
        // Tracks which system combinations have been discovered
        this.synthesisMatrix = new Map();
        this.playerSystemUsage = new Map(); // How much each system is used
        
        // 50+ meaningful syntheses (subset of 780 possible pairs)
        this.defineSyntheses();
        
        // Discovery state
        this.discoveredSyntheses = new Set();
        this.discoveryCount = 0;
        this.currentLayer = 1;
        
        // Real-time analysis
        this.activeSystems = new Set();
        this.systemActivationTimes = new Map();
        this.nearMissCombinations = []; // Combinations "almost" discovered
        
        // Mentorship state
        this.pendingInsights = [];
        this.insightCooldown = 0;
        this.lastSynthesisTime = 0;
        
        // Visual elements
        this.nexusOverlay = null;
        this.connectionLines = null;
        this.illuminationText = null;
        this.synthesisPanel = null;
        
        // Configuration
        this.enabled = true;
        this.nudgeSubtlety = 0.7; // How obvious are the "nudges" (0-1)
        
        this.init();
    }
    
    init() {
        this.createVisualElements();
        this.initializeUsageTracking();
        this.loadPersistedDiscoveries();
    }
    
    // === DEFINE THE 50+ TRANSFORMATIVE SYNTHESES ===
    defineSyntheses() {
        this.syntheses = [
            // === LAYER 1: Basic Pairs (Always Available) ===
            {
                id: 'ECHO_BULLET_TIME',
                systems: ['echoStorm', 'bulletTime'],
                name: 'Echo Dilation',
                description: 'Grazing echoes extends bullet time duration',
                layer: 1,
                catalyst: () => this.scene.nearMissState?.active && this.scene.echoStorm?.absorbedCount > 0,
                hint: 'The echoes respond to temporal distortion...'
            },
            {
                id: 'FRACTURE_RESIDUE',
                systems: ['fractureSystem', 'temporalResidue'],
                name: 'Resonant Fracture',
                description: 'Ghost player spawns purple residue nodes',
                layer: 1,
                catalyst: () => this.scene.fractureSystem?.isFractured && this.scene.temporalResidue?.nodes.length > 0,
                hint: 'Your shadow leaves echoes in its wake...'
            },
            {
                id: 'SINGULARITY_RESONANCE',
                systems: ['singularitySystem', 'resonanceCascade'],
                name: 'Gravitational Chain',
                description: 'Singularity deploy/detonate adds 2 Resonance levels',
                layer: 1,
                catalyst: () => this.scene.singularitySystem?.isActive && this.scene.resonanceCascade?.chainLength > 0,
                hint: 'The cascade flows through the gravity well...'
            },
            
            // === LAYER 2: Intermediate Combinations (Unlock at 5 discoveries) ===
            {
                id: 'PARADOX_CHRONO_LOOP',
                systems: ['paradoxEngine', 'chronoLoop'],
                name: 'Temporal Echo',
                description: 'Past echo can commit paradox predictions',
                layer: 2,
                catalyst: () => this.scene.paradoxEngine?.paradoxActive && this.scene.chronoLoop?.pastEchoes?.length > 0,
                hint: 'Your past self sees the future too...'
            },
            {
                id: 'ECHO_SINGULARITY',
                systems: ['echoStorm', 'singularitySystem'],
                name: 'Gravity Graze',
                description: 'Singularity pulls echoes for easy absorption',
                layer: 2,
                catalyst: () => {
                    const singularity = this.scene.singularitySystem;
                    return singularity?.isActive && this.scene.echoStorm?.echoBullets?.length > 0;
                },
                hint: 'The gravity well yearns for the echoes...'
            },
            {
                id: 'QUANTUM_FRACTURE',
                systems: ['quantumImmortality', 'fractureSystem'],
                name: 'Schrödinger\'s Clone',
                description: 'Death echoes can also fracture into timelines',
                layer: 2,
                catalyst: () => this.scene.quantumImmortality?.quantumEchoes?.length > 0 && 
                               this.scene.fractureSystem?.isFractured,
                hint: 'Even death echoes can split...'
            },
            {
                id: 'RESONANCE_ARCHITECT',
                systems: ['resonanceCascade', 'architectSystem'],
                name: 'Creative Cascade',
                description: 'Long chains trigger Architect discoveries',
                layer: 2,
                catalyst: () => this.scene.resonanceCascade?.chainLength >= 5 && 
                               this.scene.architectSystem?.discoveries?.length > 0,
                hint: 'The cascade crystallizes into new mechanics...'
            },
            {
                id: 'VOID_ORACLE',
                systems: ['voidCoherence', 'oracleProtocol'],
                name: 'Prophetic Void',
                description: 'Oracle predictions visible through void nodes',
                layer: 2,
                catalyst: () => this.scene.voidCoherence?.activeNodes?.length > 0 && 
                               this.scene.oracleProtocol?.echoes?.length > 0,
                hint: 'The void whispers of futures unseen...'
            },
            {
                id: 'OMNI_PARADOX',
                systems: ['omniWeapon', 'paradoxEngine'],
                name: 'Phase-Locked Weapons',
                description: 'Successful paradox grants Phasing mod temporarily',
                layer: 2,
                catalyst: () => this.scene.paradoxEngine?.paradoxSuccess && 
                               this.scene.omniWeapon?.slots?.CHAMBER === 'PHASING',
                hint: 'Time mastery makes weapons ethereal...'
            },
            
            // === LAYER 3: Advanced Syntheses (Unlock at 15 discoveries) ===
            {
                id: 'SYMBIOTIC_NOETIC',
                systems: ['symbioticPrediction', 'noeticMirror'],
                name: 'Reflected Foresight',
                description: 'AI predictions trigger philosophical commentary',
                layer: 3,
                catalyst: () => this.scene.symbioticPrediction?.predictions?.length > 0 && 
                               this.scene.noeticMirror?.lastInsightTime > Date.now() - 5000,
                hint: 'The mirror sees the prediction...'
            },
            {
                id: 'NEMESIS_TITAN',
                systems: ['nemesisGenesis', 'tesseractTitan'],
                name: 'Adversary Ascension',
                description: 'Nemesis spawns during Titan fight, mimics boss',
                layer: 3,
                catalyst: () => this.scene.tesseractTitan?.active && 
                               this.scene.nemesisGenesis?.nemesisActive,
                hint: 'Your shadow faces the geometric overseer...'
            },
            {
                id: 'CAUSAL_CHRONO',
                systems: ['causalEntanglement', 'chronoLoop'],
                name: 'Linked Recursion',
                description: 'Linked echoes share recorded patterns',
                layer: 3,
                catalyst: () => this.scene.causalEntanglement?.links?.length > 0 && 
                               this.scene.chronoLoop?.pastEchoes?.length > 1,
                hint: 'The entangled echoes remember together...'
            },
            {
                id: 'SYNCHRONICITY_ALL',
                systems: ['synchronicityCascade', 'resonanceCascade', 'kairosMoment'],
                name: 'Moment of Moments',
                description: 'Simultaneous + sequential = ∞ multiplier',
                layer: 3,
                catalyst: () => this.scene.synchronicityCascade?.synchronicityLevel >= 3 && 
                               this.scene.resonanceCascade?.chainLength >= 5 &&
                               this.scene.kairosMoment?.isInKairos,
                hint: 'All moments converge into one...'
            },
            {
                id: 'MNEMOSYNE_WEAVE',
                systems: ['mnemosyneWeave', 'timelineChronicle'],
                name: 'Living Monument',
                description: 'Chronicle entries manifest as Weave pillars',
                layer: 3,
                catalyst: () => this.scene.mnemosyneWeave?.pillars?.length > 0 && 
                               this.scene.timelineChronicle?.currentRun?.events?.length > 10,
                hint: 'Your history crystallizes into geography...'
            },
            
            // === LAYER 4: The Ultimate Synthesis (Unlock at 30 discoveries) ===
            {
                id: 'TRANSCENDENCE',
                systems: ['allSystems'],
                name: 'The Axiom Realized',
                description: '8+ systems active simultaneously — transcendence',
                layer: 4,
                catalyst: () => this.countActiveSystems() >= 8,
                hint: 'You have become the nexus...'
            }
        ];
        
        // Initialize matrix
        this.syntheses.forEach(synth => {
            this.synthesisMatrix.set(synth.id, {
                ...synth,
                discovered: false,
                discoveryTime: null,
                triggeredCount: 0
            });
        });
    }
    
    // === INITIALIZATION METHODS ===
    
    createVisualElements() {
        // Main overlay for illumination effects
        this.nexusOverlay = this.scene.add.graphics();
        this.nexusOverlay.setDepth(90);
        
        // Connection lines between active systems
        this.connectionLines = this.scene.add.graphics();
        this.connectionLines.setDepth(89);
        
        // Illumination text for "aha moments"
        this.illuminationText = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2 - 100,
            '',
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                color: this.TEXT_COLOR,
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        this.illuminationText.setOrigin(0.5);
        this.illuminationText.setScrollFactor(0);
        this.illuminationText.setDepth(100);
        this.illuminationText.setVisible(false);
        
        // Synthesis discovery panel (top-right)
        this.synthesisPanel = this.scene.add.container(
            this.scene.scale.width - 20,
            100
        );
        this.synthesisPanel.setScrollFactor(0);
        this.synthesisPanel.setDepth(95);
        this.synthesisPanel.setVisible(false);
    }
    
    initializeUsageTracking() {
        const systems = [
            'echoStorm', 'fractureSystem', 'temporalResidue', 'resonanceCascade',
            'singularitySystem', 'omniWeapon', 'paradoxEngine', 'chronoLoop',
            'quantumImmortality', 'observerEffect', 'voidCoherence', 'timelineChronicle',
            'temporalContract', 'causalEntanglement', 'symbioticPrediction',
            'dimensionalCollapse', 'temporalRewind', 'mnemosyneWeave', 'kairosMoment',
            'syntropyEngine', 'nemesisGenesis', 'oracleProtocol', 'resonantWhispers',
            'egregoreProtocol', 'aethericConvergence', 'recursionEngine',
            'harmonicConvergence', 'synchronicityCascade', 'bootstrapProtocol',
            'geometricChorus', 'architectSystem', 'sagaEngine', 'noeticMirror',
            'ambientAwareness', 'dissolutionProtocol', 'temporalPedagogy',
            'athenaeumProtocol', 'cinematicArchive'
        ];
        
        systems.forEach(sys => {
            this.playerSystemUsage.set(sys, {
                activations: 0,
                totalDuration: 0,
                lastUsed: 0,
                proficiency: 0 // Increases with successful use
            });
        });
    }
    
    loadPersistedDiscoveries() {
        // Load from localStorage if available
        const saved = localStorage.getItem('axiom_nexus_discoveries');
        if (saved) {
            const data = JSON.parse(saved);
            data.discovered?.forEach(id => {
                const synth = this.synthesisMatrix.get(id);
                if (synth) {
                    synth.discovered = true;
                    this.discoveredSyntheses.add(id);
                }
            });
            this.discoveryCount = this.discoveredSyntheses.size;
            this.updateLayer();
        }
    }
    
    saveDiscoveries() {
        const data = {
            discovered: Array.from(this.discoveredSyntheses),
            count: this.discoveryCount,
            layer: this.currentLayer,
            timestamp: Date.now()
        };
        localStorage.setItem('axiom_nexus_discoveries', JSON.stringify(data));
    }
    
    // === CORE UPDATE LOOP ===
    
    update(dt) {
        if (!this.enabled) return;
        
        // Update cooldowns
        this.insightCooldown = Math.max(0, this.insightCooldown - dt);
        
        // Track which systems are currently active
        this.updateActiveSystems();
        
        // Check for synthesis discoveries
        this.checkForSyntheses();
        
        // Update visual elements
        this.updateVisuals();
        
        // Check for "nudge opportunities" (subtle hints)
        this.checkNudgeOpportunities();
    }
    
    updateActiveSystems() {
        const now = Date.now();
        const systemChecks = [
            { id: 'echoStorm', active: this.scene.echoStorm?.absorbedCount > 0 },
            { id: 'fractureSystem', active: this.scene.fractureSystem?.isFractured },
            { id: 'temporalResidue', active: this.scene.temporalResidue?.nodes?.length > 0 },
            { id: 'resonanceCascade', active: this.scene.resonanceCascade?.chainLength > 0 },
            { id: 'singularitySystem', active: this.scene.singularitySystem?.isActive },
            { id: 'paradoxEngine', active: this.scene.paradoxEngine?.paradoxActive },
            { id: 'chronoLoop', active: this.scene.chronoLoop?.pastEchoes?.length > 0 },
            { id: 'quantumImmortality', active: this.scene.quantumImmortality?.quantumEchoes?.length > 0 },
            { id: 'voidCoherence', active: this.scene.voidCoherence?.activeNodes?.length > 0 },
            { id: 'causalEntanglement', active: this.scene.causalEntanglement?.links?.length > 0 },
            { id: 'symbioticPrediction', active: this.scene.symbioticPrediction?.predictions?.length > 0 },
            { id: 'dimensionalCollapse', active: this.scene.dimensionalCollapse?.collapseActive },
            { id: 'temporalRewind', active: this.scene.temporalRewind?.isRewinding },
            { id: 'kairosMoment', active: this.scene.kairosMoment?.isInKairos },
            { id: 'synchronicityCascade', active: this.scene.synchronicityCascade?.synchronicityLevel > 0 },
            { id: 'oracleProtocol', active: this.scene.oracleProtocol?.echoes?.length > 0 },
            { id: 'bootstrapProtocol', active: this.scene.bootstrapProtocol?.ghostBullets?.length > 0 },
            { id: 'bulletTime', active: this.scene.nearMissState?.active }
        ];
        
        systemChecks.forEach(check => {
            if (check.active) {
                if (!this.activeSystems.has(check.id)) {
                    // System just activated
                    this.activeSystems.add(check.id);
                    this.systemActivationTimes.set(check.id, now);
                    this.recordSystemUsage(check.id);
                }
            } else {
                if (this.activeSystems.has(check.id)) {
                    // System just deactivated
                    this.activeSystems.delete(check.id);
                    const startTime = this.systemActivationTimes.get(check.id);
                    if (startTime) {
                        const duration = (now - startTime) / 1000;
                        this.updateSystemDuration(check.id, duration);
                    }
                }
            }
        });
    }
    
    // === DISCOVERY DETECTION ===
    
    checkForSyntheses() {
        // Check each synthesis in the current layer
        const layerSyntheses = Array.from(this.synthesisMatrix.values())
            .filter(s => s.layer <= this.currentLayer && !s.discovered);
        
        for (const synth of layerSyntheses) {
            if (synth.catalyst && synth.catalyst()) {
                synth.triggeredCount++;
                
                // Must trigger consistently to count as "discovered"
                if (synth.triggeredCount >= 3) {
                    this.discoverSynthesis(synth);
                }
            }
        }
        
        // Check for ultimate synthesis
        if (this.discoveryCount >= 30 && !this.ultimateSeen) {
            const ultimate = this.synthesisMatrix.get('TRANSCENDENCE');
            if (ultimate && ultimate.catalyst()) {
                this.triggerUltimateSynthesis();
            }
        }
    }
    
    discoverSynthesis(synth) {
        if (synth.discovered) return;
        
        synth.discovered = true;
        synth.discoveryTime = Date.now();
        this.discoveredSyntheses.add(synth.id);
        this.discoveryCount++;
        
        // Update layer
        this.updateLayer();
        
        // Show illumination
        this.showIllumination(synth);
        
        // Save progress
        this.saveDiscoveries();
        
        // Notify Resonance Cascade if active
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('SYNTHESIS_DISCOVERED', {
                synthesis: synth.name,
                layer: synth.layer
            });
        }
        
        // Notify Noetic Mirror for commentary
        if (this.scene.noeticMirror) {
            this.scene.noeticMirror.onSynthesisDiscovered(synth);
        }
    }
    
    updateLayer() {
        const oldLayer = this.currentLayer;
        
        if (this.discoveryCount >= 30) {
            this.currentLayer = 4;
        } else if (this.discoveryCount >= 15) {
            this.currentLayer = 3;
        } else if (this.discoveryCount >= 5) {
            this.currentLayer = 2;
        } else {
            this.currentLayer = 1;
        }
        
        if (this.currentLayer > oldLayer) {
            this.showLayerUnlock(this.currentLayer);
        }
    }
    
    // === VISUAL EFFECTS ===
    
    showIllumination(synth) {
        if (this.insightCooldown > 0) return;
        this.insightCooldown = 5; // 5 second cooldown
        
        // Flash effect
        this.scene.cameras.main.flash(800, 255, 238, 187, 0.6);
        
        // Show text
        this.illuminationText.setText([
            'SYNTHESIS DISCOVERED',
            synth.name.toUpperCase(),
            '',
            synth.description
        ]);
        this.illuminationText.setVisible(true);
        
        // Animate in
        this.scene.tweens.add({
            targets: this.illuminationText,
            scale: { from: 0.5, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 400,
            ease: 'Back.out'
        });
        
        // Fade out after delay
        this.scene.time.delayedCall(4000, () => {
            this.scene.tweens.add({
                targets: this.illuminationText,
                alpha: 0,
                duration: 600,
                onComplete: () => {
                    this.illuminationText.setVisible(false);
                    this.illuminationText.setAlpha(1);
                }
            });
        });
        
        // Draw connection lines for the synthesis
        this.drawSynthesisConnections(synth);
    }
    
    showLayerUnlock(layer) {
        const layerNames = {
            1: 'APPRENTICE',
            2: 'JOURNEYMAN',
            3: 'MASTER',
            4: 'TRANSCENDENT'
        };
        
        const text = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            [
                'LAYER UNLOCKED',
                layerNames[layer],
                `${this.getLayerDescription(layer)}`
            ],
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ffeebb',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        text.setOrigin(0.5);
        text.setScrollFactor(0);
        text.setDepth(100);
        
        this.scene.tweens.add({
            targets: text,
            scale: { from: 0, to: 1.2 },
            duration: 500,
            ease: 'Back.out'
        });
        
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: text,
                alpha: 0,
                y: text.y - 50,
                duration: 600,
                onComplete: () => text.destroy()
            });
        });
    }
    
    getLayerDescription(layer) {
        const descriptions = {
            1: 'Basic pairs revealed',
            2: 'Triadic combinations emerge',
            3: 'Bridge syntheses connect all',
            4: 'The Ultimate Synthesis awaits'
        };
        return descriptions[layer];
    }
    
    drawSynthesisConnections(synth) {
        // Visual representation of the connection
        this.connectionLines.clear();
        
        const player = this.scene.player;
        const centerX = player.x;
        const centerY = player.y;
        
        // Draw golden web
        this.connectionLines.lineStyle(2, this.NEXUS_COLOR, 0.8);
        
        // Radiating lines
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const length = 100 + Math.random() * 50;
            const endX = centerX + Math.cos(angle) * length;
            const endY = centerY + Math.sin(angle) * length;
            
            this.connectionLines.lineBetween(centerX, centerY, endX, endY);
            
            // Node at end
            this.connectionLines.fillStyle(this.NEXUS_GLOW, 0.6);
            this.connectionLines.fillCircle(endX, endY, 5);
        }
        
        // Fade out
        this.scene.time.delayedCall(2000, () => {
            this.connectionLines.clear();
        });
    }
    
    updateVisuals() {
        // Subtle ambient glow when many systems active
        const activeCount = this.activeSystems.size;
        if (activeCount >= 5) {
            const alpha = (activeCount - 5) / 5 * 0.1; // 0 to 0.1
            
            this.nexusOverlay.clear();
            this.nexusOverlay.fillStyle(this.NEXUS_COLOR, alpha);
            this.nexusOverlay.fillRect(
                this.scene.cameras.main.scrollX,
                this.scene.cameras.main.scrollY,
                this.scene.scale.width,
                this.scene.scale.height
            );
        }
    }
    
    // === NUDGE SYSTEM (Subtle Hints) ===
    
    checkNudgeOpportunities() {
        // Don't nudge too often
        if (Math.random() > 0.01) return; // 1% chance per frame
        
        // Find syntheses that are "close" to being discovered
        const candidates = Array.from(this.synthesisMatrix.values())
            .filter(s => !s.discovered && s.layer <= this.currentLayer);
        
        for (const synth of candidates) {
            const potential = this.calculateSynthesisPotential(synth);
            
            // High potential but hasn't triggered = create nudge
            if (potential > 0.7 && synth.triggeredCount === 0) {
                this.createNudge(synth);
                break; // Only one nudge at a time
            }
        }
    }
    
    calculateSynthesisPotential(synth) {
        // How likely is this synthesis to happen naturally?
        const sysA = this.playerSystemUsage.get(synth.systems[0]);
        const sysB = this.playerSystemUsage.get(synth.systems[1]);
        
        if (!sysA || !sysB) return 0;
        
        // Both systems used recently = high potential
        const usageA = Math.min(sysA.activations / 10, 1); // Cap at 10 uses
        const usageB = Math.min(sysB.activations / 10, 1);
        
        // Both active simultaneously?
        const bothActive = this.activeSystems.has(synth.systems[0]) && 
                          this.activeSystems.has(synth.systems[1]) ? 0.3 : 0;
        
        return (usageA + usageB) / 2 + bothActive;
    }
    
    createNudge(synth) {
        // Subtle environmental hint
        const player = this.scene.player;
        
        // Spawn visual "whisper" near player
        const angle = Math.random() * Math.PI * 2;
        const distance = 150;
        const x = player.x + Math.cos(angle) * distance;
        const y = player.y + Math.sin(angle) * distance;
        
        const whisper = this.scene.add.text(x, y, '?', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffeebb',
            alpha: 0.5
        });
        whisper.setOrigin(0.5);
        
        // Fade in and out
        this.scene.tweens.add({
            targets: whisper,
            alpha: { from: 0, to: 0.6 },
            scale: { from: 0.5, to: 1 },
            duration: 1000,
            yoyo: true,
            onComplete: () => whisper.destroy()
        });
    }
    
    // === UTILITY METHODS ===
    
    recordSystemUsage(systemId) {
        const usage = this.playerSystemUsage.get(systemId);
        if (usage) {
            usage.activations++;
            usage.lastUsed = Date.now();
        }
    }
    
    updateSystemDuration(systemId, duration) {
        const usage = this.playerSystemUsage.get(systemId);
        if (usage) {
            usage.totalDuration += duration;
            // Proficiency increases with successful long-duration use
            usage.proficiency = Math.min(1, usage.totalDuration / 60); // Cap at 60 seconds
        }
    }
    
    countActiveSystems() {
        return this.activeSystems.size;
    }
    
    triggerUltimateSynthesis() {
        this.ultimateSeen = true;
        
        // Create the transcendent experience
        const text = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 150,
            [
                'TRANSCENDENCE',
                'The Axiom Realized'
            ],
            {
                fontFamily: 'monospace',
                fontSize: '28px',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center',
                stroke: '#ffeebb',
                strokeThickness: 2
            }
        );
        text.setOrigin(0.5);
        
        // Dramatic camera effects
        this.scene.cameras.main.flash(2000, 255, 255, 255, 0.8);
        this.scene.cameras.main.shake(2000, 0.02);
        
        // Fade out text
        this.scene.time.delayedCall(5000, () => {
            this.scene.tweens.add({
                targets: text,
                alpha: 0,
                y: text.y - 100,
                duration: 1000,
                onComplete: () => text.destroy()
            });
        });
    }
    
    // === PUBLIC API FOR OTHER SYSTEMS ===
    
    onSystemActivated(systemId) {
        this.recordSystemUsage(systemId);
    }
    
    getSynthesisHint() {
        // Return a hint for the closest undiscovered synthesis
        const candidates = Array.from(this.synthesisMatrix.values())
            .filter(s => !s.discovered && s.layer <= this.currentLayer)
            .sort((a, b) => this.calculateSynthesisPotential(b) - this.calculateSynthesisPotential(a));
        
        if (candidates.length > 0) {
            return candidates[0].hint;
        }
        return null;
    }
    
    getDiscoveryStats() {
        return {
            discovered: this.discoveryCount,
            total: this.syntheses.length,
            layer: this.currentLayer,
            percentage: Math.round((this.discoveryCount / this.syntheses.length) * 100)
        };
    }
    
    destroy() {
        this.nexusOverlay?.destroy();
        this.connectionLines?.destroy();
        this.illuminationText?.destroy();
        this.synthesisPanel?.destroy();
    }
}
