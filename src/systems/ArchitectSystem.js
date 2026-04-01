import Phaser from 'phaser';

/**
 * THE ARCHITECT SYSTEM — The Apotheosis of Player Authorship
 * 
 * The ultimate evolution: Players become game designers. Through natural play,
 * players discover novel combinations of existing systems. The Architect detects
 * these innovations, formalizes them into new named mechanics, and shares them
 * with the community. The game becomes a living creative platform that grows
 * through player ingenuity.
 * 
 * === THE CORE INNOVATION ===
 * 
 * Instead of developers creating content, players INVENT new temporal mechanics
 * by organically combining existing systems in unprecedented ways. The game:
 * 1. DETECTS when you've discovered a novel system combination
 * 2. FORMALIZES it into a new, named mechanic
 * 3. REWARDS you for the discovery
 * 4. SHARES it with other players as a new gameplay option
 * 
 * === THE THREE LAYERS OF ARCHITECTURE ===
 * 
 * 1. DISCOVERY LAYER (Detection)
 *    - Monitors all system interactions during gameplay
 *    - Identifies combinations never before documented
 *    - Calculates "novelty score" based on interaction complexity
 * 
 * 2. FORMALIZATION LAYER (Creation)
 *    - Generates a new mechanic from your discovery
 *    - Creates visual signature (procedural from involved systems)
 *    - Assigns procedural name or accepts player naming
 *    - Balances the new mechanic for general use
 * 
 * 3. COMMONS LAYER (Sharing)
 *    - Discovered mechanics enter the "Temporal Commons"
 *    - Other players can encounter and use your inventions
 *    - Community voting elevates exceptional discoveries
 *    - Credit to the original architect (you)
 * 
 * === EXAMPLE PLAYER DISCOVERIES ===
 * 
 * Discovery: "Echo Fracture Singularity"
 * - Player: Absorbs echoes during fracture, deploys singularity with echoes
 * - Effect: Singularity traps echoes, releases them as seeking swarm on detonation
 * - Becomes: New combined mechanic "ECHO SINGULARITY"
 * 
 * Discovery: "Quantum Paradox Loop"
 * - Player: Dies during paradox projection, respawns, completes paradox
 * - Effect: Death echoes continue the paradox, creating double paradox payoff
 * - Becomes: New mechanic "DEATH PARADOX"
 * 
 * Discovery: "Resonant Bootstrap Cascade"
 * - Player: Fulfills bootstrap prophecy → triggers cascade → maintains chain
 * - Effect: Bootstrap fulfillment extends cascade duration by 5 seconds
 * - Becomes: New modifier "PROPHETIC CASCADE"
 * 
 * === THE DISCOVERY MECHANIC ===
 * 
 * 1. OBSERVE: You naturally combine systems in a novel way
 * 2. DETECT: Architect recognizes this as unprecedented (novelty > 0.85)
 * 3. FORMALIZE: Game creates new mechanic from your combination
 * 4. NAME: You're prompted to name your discovery (or accept procedural name)
 * 5. COMMONS: Your invention enters the shared mechanic pool
 * 6. LEGACY: Future players use your discovery, credited to you
 * 
 * === THE NOVELTY CALCULATION ===
 * 
 * novelty = (system_count × interaction_depth × uniqueness × elegance) / complexity_penalty
 * 
 * - system_count: 2-5 systems involved (diminishing returns above 4)
 * - interaction_depth: How deeply systems affect each other (0.0-1.0)
 * - uniqueness: Has this exact combo been seen before? (0.0-1.0)
 * - elegance: Does it create emergent behavior beyond sum of parts? (0.0-1.0)
 * - complexity_penalty: Too complex = harder to use (1.0-2.0)
 * 
 * novelty > 0.85 = Discovery Event triggered
 * novelty > 0.95 = Transcendent Discovery (special visual treatment)
 * 
 * === THE MECHANIC FORMALIZATION ===
 * 
 * When a discovery is formalized:
 * - Unique ID generated from system combination hash
 * - Visual sigil created (procedural geometry from system colors)
 * - Rules encoded as behavior tree
 * - Balance parameters tuned (cooldown, cost, effect magnitude)
 * - Input binding suggested (or inherits from parent systems)
 * 
 * === THE TEMPORAL COMMONS ===
 * 
 * The shared library of player-discovered mechanics:
 * - Browse by: popularity, novelty, architect, systems involved
 * - Equip up to 3 "Discovered Mechanics" per run
 * - Community "Elevation" voting for exceptional discoveries
 * - Elevation milestones unlock visual upgrades for the mechanic
 * 
 * === THE ARCHITECT LEGACY ===
 * 
 * As you discover mechanics:
 * - Architect Rank increases (Novice → Journeyman → Master → Grand Architect)
 * - Higher ranks unlock: naming privileges, tuning parameters, visual design
 * - Grand Architects can propose entirely new base system categories
 * - Your discoveries appear with your name: "ECHO SINGULARITY by PlayerName"
 * 
 * === SYNERGIES WITH ALL SYSTEMS ===
 * 
 * - Egregore Protocol: Uses player discoveries as genetic templates for evolution
 * - Oracle Protocol: Prophecies hint at undiscovered mechanic combinations
 * - Mnemosyne Weave: Your discoveries become permanent monuments
 * - Aetheric Convergence: High-tier convergences often reveal new mechanic spaces
 * - Resonant Whisper: Other architects' discoveries whisper through the void
 * 
 * === THE META-VISION ===
 * 
 * The Architect System transforms the game from:
 * "A designed experience with 31 systems"
 * → "A creative platform with infinite player-generated possibilities"
 * 
 * The developers created the initial 31 dimensions.
 * The players create every dimension beyond.
 * 
 * === THE ULTIMATE REALIZATION ===
 * 
 * Eventually, the majority of temporal mechanics in the game will be
 * player-discovered, not developer-designed. The game becomes a collaborative
 * exploration of possibility space, where the community collectively maps the
 * territory of what bullet hell gameplay can be.
 * 
 * Color: Architect's Gold (#ffb700) — the color of creation and mastery
 * Discovery Flash: Prismatic White → Gold → Cyan
 */

export default class ArchitectSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== ARCHITECT STATE =====
        this.architectData = this.loadArchitectData();
        this.architectRank = this.architectData.rank || 'NOVICE';
        this.discoveries = this.architectData.discoveries || [];
        this.equippedMechanics = this.architectData.equipped || [];
        this.commons = this.loadTemporalCommons();
        
        // ===== DISCOVERY TRACKING =====
        this.activeInteractions = new Map(); // system_combo -> interaction_data
        this.noveltyHistory = [];
        this.pendingDiscovery = null;
        this.discoveryCooldown = 0;
        
        // ===== FORMALIZATION STATE =====
        this.formalizationQueue = [];
        this.recentCombinations = new Set(); // Prevent duplicate discoveries
        
        // ===== VISUALS =====
        this.graphics = null;
        this.discoveryUI = null;
        this.commonsUI = null;
        
        // ===== CONSTANTS =====
        this.ARCHITECT_COLOR = 0xffb700;
        this.DISCOVERY_COOLDOWN = 30; // Seconds between discovery checks
        this.NOVELTY_THRESHOLD = 0.85;
        this.TRANSCENDENT_THRESHOLD = 0.95;
        this.MAX_EQUIPPED = 3;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.loadCommonsIntoGame();
    }
    
    // ===== DATA PERSISTENCE =====
    
    loadArchitectData() {
        try {
            const data = localStorage.getItem('architect_data');
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('Failed to load architect data:', e);
        }
        return {
            rank: 'NOVICE',
            discoveries: [],
            equipped: [],
            discoveryCount: 0,
            elevationVotes: 0
        };
    }
    
    saveArchitectData() {
        try {
            localStorage.setItem('architect_data', JSON.stringify({
                rank: this.architectRank,
                discoveries: this.discoveries,
                equipped: this.equippedMechanics,
                discoveryCount: this.discoveries.length,
                lastSave: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save architect data:', e);
        }
    }
    
    loadTemporalCommons() {
        // In a real implementation, this would load from a server
        // For now, use local + sample commons
        try {
            const commons = localStorage.getItem('temporal_commons');
            if (commons) {
                return JSON.parse(commons);
            }
        } catch (e) {
            console.warn('Failed to load commons:', e);
        }
        return this.getSampleCommons();
    }
    
    getSampleCommons() {
        // Sample player-discovered mechanics to seed the system
        return [
            {
                id: 'echo_fracture_burst',
                name: 'ECHO FRACTURE',
                architect: 'SystemSeed',
                description: 'Absorb echoes during fracture for burst damage on resolve',
                systems: ['echoStorm', 'fracture'],
                input: 'SHIFT+E',
                cooldown: 15,
                effect: 'Each absorbed echo adds +50 burst damage when fracture resolves',
                visual: 'Gold echoes pulse around ghost player',
                popularity: 95,
                elevation: 3,
                sigil: '◈'
            },
            {
                id: 'quantum_loop_residue',
                name: 'QUANTUM RESIDUE',
                architect: 'SystemSeed', 
                description: 'Death echoes carry temporal residue nodes',
                systems: ['quantum', 'residue'],
                input: 'Passive',
                cooldown: 0,
                effect: 'Quantum immortality echoes spawn 2 residue nodes each',
                visual: 'White echoes with purple node cores',
                popularity: 88,
                elevation: 2,
                sigil: '◎'
            },
            {
                id: 'paradox_bootstrap_cascade',
                name: 'PROPHETIC PARADOX',
                architect: 'SystemSeed',
                description: 'Fulfilling bootstrap prophecy grants paradox projection',
                systems: ['bootstrap', 'paradox'],
                input: 'Passive',
                cooldown: 0,
                effect: 'Bootstrap fulfillment automatically triggers 1-second paradox projection',
                visual: 'Amber echoes leave gold prediction trails',
                popularity: 92,
                elevation: 3,
                sigil: '◉'
            }
        ];
    }
    
    // ===== DISCOVERY DETECTION =====
    
    update(dt) {
        // Update discovery cooldown
        if (this.discoveryCooldown > 0) {
            this.discoveryCooldown -= dt;
        }
        
        // Process active interactions
        this.updateInteractions(dt);
        
        // Check for discoveries
        if (this.discoveryCooldown <= 0 && !this.pendingDiscovery) {
            this.scanForDiscoveries();
        }
        
        // Update visuals
        this.updateVisuals(dt);
    }
    
    recordSystemInteraction(systemA, systemB, context = {}) {
        const combo = this.getComboKey(systemA, systemB);
        const now = Date.now();
        
        if (!this.activeInteractions.has(combo)) {
            this.activeInteractions.set(combo, {
                systems: [systemA, systemB],
                startTime: now,
                duration: 0,
                depth: 0,
                contexts: [],
                interactions: 0
            });
        }
        
        const interaction = this.activeInteractions.get(combo);
        interaction.duration += 0.016; // Approximate dt
        interaction.interactions++;
        interaction.depth = Math.min(1.0, interaction.interactions / 10);
        interaction.contexts.push(context);
        
        // Limit context history
        if (interaction.contexts.length > 20) {
            interaction.contexts.shift();
        }
    }
    
    getComboKey(a, b) {
        // Canonical ordering
        return a < b ? `${a}+${b}` : `${b}+${a}`;
    }
    
    updateInteractions(dt) {
        const now = Date.now();
        
        for (const [combo, interaction] of this.activeInteractions) {
            // Decay old interactions
            if (now - interaction.startTime > 5000) { // 5 second window
                this.activeInteractions.delete(combo);
            }
        }
    }
    
    scanForDiscoveries() {
        // Look for combinations with high novelty
        for (const [combo, interaction] of this.activeInteractions) {
            const novelty = this.calculateNovelty(interaction);
            
            if (novelty > this.NOVELTY_THRESHOLD && !this.recentCombinations.has(combo)) {
                // Potential discovery!
                this.triggerDiscovery(interaction, novelty);
                break; // One discovery at a time
            }
        }
    }
    
    calculateNovelty(interaction) {
        const systemCount = interaction.systems.length;
        const depth = interaction.depth;
        
        // Check uniqueness against commons
        const uniqueness = this.calculateUniqueness(interaction.systems);
        
        // Calculate elegance (emergent behavior beyond sum of parts)
        const elegance = this.calculateElegance(interaction);
        
        // Complexity penalty (too many systems = harder to use)
        const complexityPenalty = 1.0 + (systemCount > 4 ? (systemCount - 4) * 0.2 : 0);
        
        const novelty = (systemCount * depth * uniqueness * elegance) / complexityPenalty;
        
        return Math.min(1.0, novelty);
    }
    
    calculateUniqueness(systems) {
        // Check if this exact combo exists in commons
        const comboKey = systems.slice().sort().join('+');
        
        for (const mechanic of this.commons) {
            const mechanicKey = mechanic.systems.slice().sort().join('+');
            if (mechanicKey === comboKey) {
                return 0.1; // Very low uniqueness - already exists
            }
        }
        
        // Check similarity to existing
        let maxSimilarity = 0;
        for (const mechanic of this.commons) {
            const common = mechanic.systems.filter(s => systems.includes(s)).length;
            const total = new Set([...mechanic.systems, ...systems]).size;
            const similarity = common / total;
            maxSimilarity = Math.max(maxSimilarity, similarity);
        }
        
        return 1.0 - (maxSimilarity * 0.5); // Partial penalty for similarity
    }
    
    calculateElegance(interaction) {
        // Elegance = interesting behavior that emerges naturally
        // Higher if interaction creates novel outcomes in the contexts observed
        
        if (interaction.contexts.length < 3) return 0.5;
        
        // Look for patterns in contexts that indicate emergent behavior
        const outcomes = interaction.contexts.map(ctx => ctx.outcome);
        const uniqueOutcomes = new Set(outcomes.map(o => JSON.stringify(o))).size;
        
        // More unique outcomes = more emergent = more elegant
        const outcomeRatio = uniqueOutcomes / outcomes.length;
        
        // But also prefer some consistency (not pure chaos)
        return 0.6 + (outcomeRatio * 0.4);
    }
    
    // ===== DISCOVERY FORMALIZATION =====
    
    triggerDiscovery(interaction, novelty) {
        const combo = interaction.systems.slice().sort().join('+');
        this.recentCombinations.add(combo);
        
        // Create the discovery
        this.pendingDiscovery = {
            systems: interaction.systems,
            novelty: novelty,
            isTranscendent: novelty > this.TRANSCENDENT_THRESHOLD,
            timestamp: Date.now(),
            contexts: [...interaction.contexts]
        };
        
        // Show discovery UI
        this.showDiscoveryPrompt();
    }
    
    showDiscoveryPrompt() {
        if (!this.pendingDiscovery) return;
        
        const isTranscendent = this.pendingDiscovery.isTranscendent;
        const systemNames = this.pendingDiscovery.systems.map(s => this.formatSystemName(s)).join(' + ');
        
        // Create dramatic announcement
        const announcement = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 - 100,
            isTranscendent ? 'TRANSCENDENT DISCOVERY!' : 'ARCHITECT DISCOVERY!',
            {
                fontFamily: 'monospace',
                fontSize: isTranscendent ? '28px' : '24px',
                fontStyle: 'bold',
                fill: isTranscendent ? '#ffffff' : '#ffb700',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        // System combination
        const comboText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 - 50,
            systemNames,
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#00f0ff',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        // Prompt for name (simulated in this version)
        const promptText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 + 20,
            'You have discovered a new temporal mechanic!\nPress [ENTER] to formalize it',
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#cccccc',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        // Store UI elements for cleanup
        this.discoveryUI = { announcement, comboText, promptText };
        
        // Animate in
        this.scene.tweens.add({
            targets: [announcement, comboText, promptText],
            alpha: { from: 0, to: 1 },
            y: '-=20',
            duration: 500,
            ease: 'Power2'
        });
        
        // Auto-formalize after delay if not acknowledged
        this.scene.time.delayedCall(10000, () => {
            if (this.pendingDiscovery) {
                this.formalizeDiscovery();
            }
        });
    }
    
    formalizeDiscovery(customName = null) {
        if (!this.pendingDiscovery) return;
        
        const discovery = this.pendingDiscovery;
        
        // Generate mechanic from discovery
        const mechanic = this.generateMechanic(discovery, customName);
        
        // Add to personal discoveries
        this.discoveries.push({
            ...mechanic,
            discoveredAt: Date.now()
        });
        
        // Add to commons
        this.commons.push(mechanic);
        
        // Equip immediately
        this.equipMechanic(mechanic.id);
        
        // Update rank
        this.updateArchitectRank();
        
        // Save
        this.saveArchitectData();
        this.saveTemporalCommons();
        
        // Show formalization announcement
        this.showFormalizationAnnouncement(mechanic);
        
        // Clear pending
        this.pendingDiscovery = null;
        this.discoveryCooldown = this.DISCOVERY_COOLDOWN;
        
        // Clean up UI
        if (this.discoveryUI) {
            Object.values(this.discoveryUI).forEach(el => el.destroy());
            this.discoveryUI = null;
        }
    }
    
    generateMechanic(discovery, customName) {
        const systems = discovery.systems;
        const id = `architect_${systems.join('_')}_${Date.now()}`;
        
        // Generate procedural name if none provided
        const name = customName || this.generateProceduralName(systems);
        
        // Generate description
        const description = this.generateDescription(systems, discovery.contexts);
        
        // Generate effect based on systems involved
        const effect = this.generateEffect(systems);
        
        // Generate visual sigil
        const sigil = this.generateSigil(systems);
        
        // Suggest input
        const input = this.suggestInput(systems);
        
        return {
            id,
            name,
            architect: 'You', // Would be player name in full implementation
            description,
            systems,
            input,
            cooldown: 10 + (systems.length * 5),
            effect,
            visual: this.generateVisualDescription(systems),
            popularity: 0,
            elevation: discovery.isTranscendent ? 1 : 0,
            sigil,
            novelty: discovery.novelty,
            isNew: true
        };
    }
    
    generateProceduralName(systems) {
        const prefixes = {
            echoStorm: 'ECHO',
            fracture: 'FRACTURE',
            residue: 'RESIDUE',
            singularity: 'SINGULARITY',
            paradox: 'PARADOX',
            quantum: 'QUANTUM',
            chronoLoop: 'CHRONO',
            bootstrap: 'BOOTSTRAP',
            resonance: 'RESONANT',
            void: 'VOID'
        };
        
        const suffixes = {
            echoStorm: 'STORM',
            fracture: 'BURST',
            residue: 'NODE',
            singularity: 'WELL',
            paradox: 'VISION',
            quantum: 'ECHO',
            chronoLoop: 'LOOP',
            bootstrap: 'PROPHECY',
            resonance: 'CASCADE',
            void: 'COHERENCE'
        };
        
        if (systems.length === 2) {
            const p1 = prefixes[systems[0]] || systems[0].toUpperCase();
            const s2 = suffixes[systems[1]] || systems[1].toUpperCase();
            return `${p1} ${s2}`;
        }
        
        return `ARCHITECT ${systems.length}`;
    }
    
    generateDescription(systems, contexts) {
        const systemNames = systems.map(s => this.formatSystemName(s));
        return `Combined ${systemNames.join(' + ')} to create emergent temporal effect`;
    }
    
    generateEffect(systems) {
        // Generate plausible effect based on systems
        const effects = [];
        
        if (systems.includes('echoStorm')) {
            effects.push('echo absorption');
        }
        if (systems.includes('fracture')) {
            effects.push('timeline splitting');
        }
        if (systems.includes('paradox')) {
            effects.push('causal projection');
        }
        if (systems.includes('quantum')) {
            effects.push('death branching');
        }
        if (systems.includes('residue')) {
            effects.push('historical node generation');
        }
        if (systems.includes('singularity')) {
            effects.push('gravity manipulation');
        }
        
        return `Synergistic ${effects.join(' + ')} with amplified output`;
    }
    
    generateVisualDescription(systems) {
        const colors = {
            echoStorm: 'gold',
            fracture: 'cyan',
            residue: 'purple',
            singularity: 'crimson',
            paradox: 'magenta',
            quantum: 'white',
            chronoLoop: 'teal',
            bootstrap: 'amber'
        };
        
        const colorList = systems.map(s => colors[s] || 'white').join('-');
        return `Shifting ${colorList} energy patterns`;
    }
    
    generateSigil(systems) {
        const sigils = ['◈', '◉', '◎', '◊', '◐', '◑', '◒', '◓', '◔', '◕'];
        // Deterministic but seemingly random based on system combo
        const hash = systems.join('').charCodeAt(0) % sigils.length;
        return sigils[hash];
    }
    
    suggestInput(systems) {
        // Suggest input based on dominant system
        const inputMap = {
            echoStorm: 'E',
            fracture: 'SHIFT',
            residue: 'Passive',
            singularity: 'SPACE',
            paradox: 'R-CLICK',
            quantum: 'Passive',
            chronoLoop: 'T',
            bootstrap: 'Passive',
            resonance: 'Passive'
        };
        
        return inputMap[systems[0]] || 'Passive';
    }
    
    formatSystemName(system) {
        const names = {
            echoStorm: 'Echo Storm',
            fracture: 'Fracture',
            residue: 'Residue',
            singularity: 'Singularity',
            paradox: 'Paradox Engine',
            quantum: 'Quantum Immortality',
            chronoLoop: 'Chrono-Loop',
            bootstrap: 'Bootstrap Protocol',
            resonance: 'Resonance Cascade',
            void: 'Void Coherence'
        };
        return names[system] || system;
    }
    
    // ===== ARCHITECT RANKS =====
    
    updateArchitectRank() {
        const count = this.discoveries.length;
        
        if (count >= 20) {
            this.architectRank = 'GRAND ARCHITECT';
        } else if (count >= 10) {
            this.architectRank = 'MASTER ARCHITECT';
        } else if (count >= 5) {
            this.architectRank = 'JOURNEYMAN';
        } else if (count >= 1) {
            this.architectRank = 'NOVICE ARCHITECT';
        }
    }
    
    // ===== MECHANIC EQUIPMENT =====
    
    equipMechanic(mechanicId) {
        // Check if already equipped
        if (this.equippedMechanics.includes(mechanicId)) return;
        
        // Check limit
        if (this.equippedMechanics.length >= this.MAX_EQUIPPED) {
            // Remove oldest
            this.equippedMechanics.shift();
        }
        
        this.equippedMechanics.push(mechanicId);
        this.saveArchitectData();
        
        // Apply mechanic effects
        this.applyMechanicEffects(mechanicId);
    }
    
    applyMechanicEffects(mechanicId) {
        const mechanic = this.commons.find(m => m.id === mechanicId);
        if (!mechanic) return;
        
        // In a full implementation, this would modify game behavior
        // For now, just notify
        console.log(`Architect: Equipped ${mechanic.name}`);
        
        // Visual feedback
        this.showEquippedNotification(mechanic);
    }
    
    showEquippedNotification(mechanic) {
        const notif = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 + 80,
            `Equipped: ${mechanic.name} ${mechanic.sigil}`,
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#ffb700'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        this.scene.tweens.add({
            targets: notif,
            alpha: { from: 0, to: 1, to: 0 },
            y: '-=30',
            duration: 2000,
            onComplete: () => notif.destroy()
        });
    }
    
    showFormalizationAnnouncement(mechanic) {
        const container = this.scene.add.container(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2
        );
        container.setScrollFactor(0).setDepth(1001);
        
        // Background panel
        const bg = this.scene.add.rectangle(0, 0, 400, 200, 0x1a1a25, 0.95);
        bg.setStrokeStyle(2, this.ARCHITECT_COLOR);
        container.add(bg);
        
        // Title
        const title = this.scene.add.text(0, -70, 'NEW MECHANIC FORMALIZED', {
            fontFamily: 'monospace',
            fontSize: '20px',
            fontStyle: 'bold',
            fill: '#ffb700'
        }).setOrigin(0.5);
        container.add(title);
        
        // Sigil
        const sigil = this.scene.add.text(0, -30, mechanic.sigil, {
            fontFamily: 'monospace',
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        container.add(sigil);
        
        // Name
        const name = this.scene.add.text(0, 10, mechanic.name, {
            fontFamily: 'monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            fill: '#00f0ff'
        }).setOrigin(0.5);
        container.add(name);
        
        // Description
        const desc = this.scene.add.text(0, 45, mechanic.description, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#cccccc',
            align: 'center',
            wordWrap: { width: 350 }
        }).setOrigin(0.5);
        container.add(desc);
        
        // Effect
        const effect = this.scene.add.text(0, 80, mechanic.effect, {
            fontFamily: 'monospace',
            fontSize: '11px',
            fill: '#ffb700',
            align: 'center',
            wordWrap: { width: 350 }
        }).setOrigin(0.5);
        container.add(effect);
        
        // Animate in
        container.setScale(0);
        this.scene.tweens.add({
            targets: container,
            scale: 1,
            duration: 400,
            ease: 'Back.out'
        });
        
        // Auto-dismiss
        this.scene.time.delayedCall(6000, () => {
            this.scene.tweens.add({
                targets: container,
                alpha: 0,
                scale: 0.8,
                duration: 300,
                onComplete: () => container.destroy()
            });
        });
    }
    
    // ===== COMMONS MANAGEMENT =====
    
    loadCommonsIntoGame() {
        // In a full implementation, this would register all commons as
        // available game mechanics
        for (const mechanic of this.commons) {
            this.registerMechanicWithGame(mechanic);
        }
    }
    
    registerMechanicWithGame(mechanic) {
        // This would integrate the mechanic into the game's systems
        // For now, just log
        console.log(`Architect: Registered ${mechanic.name}`);
    }
    
    saveTemporalCommons() {
        try {
            localStorage.setItem('temporal_commons', JSON.stringify(this.commons));
        } catch (e) {
            console.warn('Failed to save commons:', e);
        }
    }
    
    // ===== VISUALS =====
    
    createVisuals() {
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(100);
    }
    
    updateVisuals(dt) {
        // Draw any active discovery effects
        this.graphics.clear();
        
        if (this.pendingDiscovery) {
            // Draw pulsing indicator around player
            const player = this.scene.player;
            const time = this.scene.time.now / 1000;
            const radius = 60 + Math.sin(time * 3) * 10;
            
            this.graphics.lineStyle(2, this.ARCHITECT_COLOR, 0.5 + Math.sin(time * 5) * 0.3);
            this.graphics.strokeCircle(player.x, player.y, radius);
        }
    }
    
    // ===== PUBLIC API =====
    
    onDiscoveryKeyPressed() {
        if (this.pendingDiscovery) {
            this.formalizeDiscovery();
            return true;
        }
        return false;
    }
    
    getEquippedMechanics() {
        return this.equippedMechanics.map(id => 
            this.commons.find(m => m.id === id)
        ).filter(Boolean);
    }
    
    getCommons() {
        return this.commons;
    }
    
    getDiscoveries() {
        return this.discoveries;
    }
    
    getRank() {
        return this.architectRank;
    }
    
    // ===== CLEANUP =====
    
    destroy() {
        this.saveArchitectData();
        this.saveTemporalCommons();
        
        if (this.graphics) {
            this.graphics.destroy();
        }
        if (this.discoveryUI) {
            Object.values(this.discoveryUI).forEach(el => el.destroy());
        }
    }
}
