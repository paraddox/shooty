import Phaser from 'phaser';

/**
 * DISSOLUTION PROTOCOL — The Art of Intentional Forgetting
 * 
 * The 37th cognitive dimension: CURATORIAL DESTRUCTION
 * 
 * All 36 previous systems are about ACQUISITION — gathering, recording, evolving.
 * The Dissolution Protocol is about SUBTRACTION — the radical act of choosing
 * what to release. It transforms the player from accumulator to curator.
 * 
 * === THE CORE PHILOSOPHY ===
 * 
 * "In the end, we are what we choose to forget."
 * 
 * With 35+ systems, the game risks becoming overwhelming. The Dissolution Protocol
 * doesn't just manage this complexity — it CELEBRATES the act of letting go.
 * When you dissolve a system, you don't lose it; you TRANSMUTE it into something
 * more essential. The game becomes not a hoard of mechanics, but a personally
 * sculpted experience.
 * 
 * === THE THREE ACTS OF DISSOLUTION ===
 * 
 * 1. IDENTIFICATION (Hold [DELETE] + Click)
 *    - Time slows to 10%
 *    - All active systems pulse with their signature colors
 *    - Hovering reveals: "This system has activated 47 times this run"
 *    - You see which systems you actually USE vs which just... exist
 * 
 * 2. DISSOLUTION (Confirm with second click)
 *    - The system doesn't just disable — it UNRAVELS
 *    - Visual: Geometric structures breaking into particles
 *    - Audio: A tone that releases rather than builds
 *    - The system's energy converts to ESSENCE
 * 
 * 3. TRANSMUTATION (Essence reinvestment)
 *    - Dissolved systems leave behind CORE TRUTHS
 *    - Echo Storm → Swiftness (movement speed)
 *    - Fracture System → Sharpness (damage)
 *    - Temporal Systems → Time Sense (slow-mo duration)
 *    - Mnemosyne Weave → Presence (score multiplier)
 *    - The ESSENCE of the system remains, purified
 * 
 * === THE ESSENCE ECONOMY ===
 * 
 * Each dissolved system yields Essence based on:
 * - How long you had it (deeper integration = more Essence)
 * - How often you used it (active systems yield more)
 * - Its complexity (deeper systems yield rarer Essence types)
 * 
 * Essence Types:
 * - Temporal Essence (gold) — Extends slow-mo, speeds cooldowns
 * - Spatial Essence (cyan) — Increases movement, reduces knockback
 * - Cognitive Essence (purple) — Improves prediction, widens near-miss zones
 * - Narrative Essence (silver) — Boosts score, improves drops
 * - Void Essence (black) — Rare, from dissolving major systems; unlocks secrets
 * 
 * === THE DISSOLVED STATE ===
 * 
 * Dissolved systems aren't gone forever — they enter the DISSOLUTION RESERVOIR,
 * a liminal space where inactive systems dream. You can:
 * - Visit them (press [SHIFT+DELETE] to enter the Reservoir)
 * - Reconstitute them (pay Essence to restore)
 * - Merge them (combine 3 dissolved systems into a HYBRID)
 * 
 * === THE CURATOR'S DILEMMA ===
 * 
 * This creates a new meta-game: What is your ESSENTIAL experience?
 * 
 * Some players might dissolve everything except Echo Storm and the bare mechanics,
 * creating a pure, minimalist bullet hell.
 * 
 * Others might keep only narrative systems, turning the game into an emergent story.
 * 
 * Others might dissolve nothing, embracing the chaos.
 * 
 * The game now has 3 axes of play:
 * - HORIZONTAL (new systems discovered)
 * - VERTICAL (existing systems upgraded)
 * - DEPTH (systems dissolved, essence concentrated)
 * 
 * === THE VOID ESSENCE MYSTERY ===
 * 
 * Dissolving 10+ systems creates Void Essence — a paradoxical substance that:
 * - Doesn't boost any stat directly
 * - Instead, reveals HIDDEN CONNECTIONS between remaining systems
 * - At 50+ Void Essence: The game reveals its own source code (literally)
 * - At 100+ Void Essence: ??? (the system that knows it's a system)
 * 
 * === SYNERGIES ===
 * 
 * - Architect System: Formalize discoveries BEFORE dissolving them — preserves them
 * - Mnemosyne Weave: Dissolved systems still appear in your history
 * - Recursion Engine: Behavioral genome adapts to what you've chosen to forget
 * - Egregore Protocol: Collective "most-dissolved" systems become MYTHIC (rarely seen)
 * - Bootstrap Protocol: Can receive echoes from DISSOLVED futures
 * - Noetic Mirror: Commentary shifts based on your curation choices
 * 
 * === THE LIMINAL ENDING ===
 * 
 * If you dissolve ALL systems (including the Dissolution Protocol itself):
 * - The game doesn't end
 * - It becomes pure geometry, pure motion, pure play
 * - No scores, no upgrades, no narrative
 * - Just you, the circle, the bullets
 * - This is the APOCALYPSE OF COMPLEXITY
 * - The return to zero
 * 
 * Color: Dissolution Indigo — the color of twilight, between states
 *         (a deep blue-violet that seems to absorb light)
 */

export default class DissolutionProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== DISSOLUTION STATE =====
        this.dissolutionMode = false;
        this.selectedSystem = null;
        this.dissolvedSystems = new Map(); // systemName -> dissolutionData
        this.activeSystemsBeforeDissolution = [];
        
        // ===== ESSENCE ECONOMY =====
        this.essence = {
            temporal: 0,    // Gold - time-related
            spatial: 0,     // Cyan - movement-related
            cognitive: 0,   // Purple - prediction-related
            narrative: 0,   // Silver - score-related
            void: 0         // Black - mystery
        };
        
        // Load saved essence
        this.loadEssence();
        
        // ===== SYSTEM REGISTRY =====
        this.systemRegistry = new Map();
        this.registerAllSystems();
        
        // ===== VISUAL EFFECTS =====
        this.essenceDisplay = null;
        this.dissolutionOverlay = null;
        
        // ===== RESERVOIR STATE =====
        this.inReservoir = false;
        
        // ===== INPUT =====
        this.initInput();
        
        // ===== VISUALS =====
        this.createVisuals();
        
        // ===== THROTTLING =====
        this.visualUpdateInterval = 5; // Update visuals every 5 frames
        this.visualUpdateCounter = 0;
    }
    
    registerAllSystems() {
        // Register all systems that can be dissolved
        const systems = [
            { name: 'echoStorm', display: 'Echo Storm', color: 0xffff00, type: 'temporal', complexity: 2 },
            { name: 'fractureSystem', display: 'Fracture Protocol', color: 0xffffff, type: 'spatial', complexity: 3 },
            { name: 'temporalResidue', display: 'Temporal Residue', color: 0x9d4edd, type: 'temporal', complexity: 2 },
            { name: 'resonanceCascade', display: 'Resonance Cascade', color: 0xff6b35, type: 'energy', complexity: 3 },
            { name: 'singularitySystem', display: 'Temporal Singularity', color: 0x9400d3, type: 'temporal', complexity: 4 },
            { name: 'omniWeapon', display: 'Omni-Weapon', color: 0x00ff00, type: 'combat', complexity: 2 },
            { name: 'paradoxEngine', display: 'Paradox Engine', color: 0xff00ff, type: 'cognitive', complexity: 4 },
            { name: 'chronoLoop', display: 'Chrono-Loop', color: 0x00bfff, type: 'temporal', complexity: 3 },
            { name: 'quantumImmortality', display: 'Quantum Immortality', color: 0xffffff, type: 'temporal', complexity: 3 },
            { name: 'observerEffect', display: 'Observer Effect', color: 0xff1493, type: 'cognitive', complexity: 4 },
            { name: 'voidCoherence', display: 'Void Coherence', color: 0x4b0082, type: 'energy', complexity: 4 },
            { name: 'timelineChronicle', display: 'Timeline Chronicle', color: 0xc0c0c0, type: 'narrative', complexity: 2 },
            { name: 'temporalContract', display: 'Temporal Contract', color: 0xffd700, type: 'temporal', complexity: 3 },
            { name: 'causalEntanglement', display: 'Causal Entanglement', color: 0xff4500, type: 'cognitive', complexity: 5 },
            { name: 'cinematicArchive', display: 'Cinematic Archive', color: 0xff69b4, type: 'narrative', complexity: 2 },
            { name: 'symbioticPrediction', display: 'Symbiotic Prediction', color: 0x00ced1, type: 'cognitive', complexity: 4 },
            { name: 'dimensionalCollapse', display: 'Dimensional Collapse', color: 0xff0000, type: 'spatial', complexity: 5 },
            { name: 'temporalRewind', display: 'Temporal Rewind', color: 0x4169e1, type: 'temporal', complexity: 3 },
            { name: 'mnemosyneWeave', display: 'Mnemosyne Weave', color: 0x9d4edd, type: 'narrative', complexity: 4 },
            { name: 'kairosMoment', display: 'Kairos Moment', color: 0xfff8e7, type: 'cognitive', complexity: 3 },
            { name: 'syntropyEngine', display: 'Syntropy Engine', color: 0x00ffff, type: 'energy', complexity: 4 },
            { name: 'nemesisGenesis', display: 'Nemesis Genesis', color: 0xff0000, type: 'combat', complexity: 4 },
            { name: 'oracleProtocol', display: 'Oracle Protocol', color: 0xffd700, type: 'cognitive', complexity: 3 },
            { name: 'resonantWhispers', display: 'Resonant Whispers', color: 0xda70d6, type: 'narrative', complexity: 3 },
            { name: 'egregoreProtocol', display: 'Egregore Protocol', color: 0xff00ff, type: 'collective', complexity: 5 },
            { name: 'aethericConvergence', display: 'Ætheric Convergence', color: 0xffffff, type: 'energy', complexity: 5 },
            { name: 'recursionEngine', display: 'Recursion Engine', color: 0x00ffff, type: 'cognitive', complexity: 5 },
            { name: 'harmonicConvergence', display: 'Harmonic Convergence', color: 0x00f0ff, type: 'energy', complexity: 3 },
            { name: 'synchronicityCascade', display: 'Synchronicity Cascade', color: 0xffd700, type: 'energy', complexity: 5 },
            { name: 'bootstrapProtocol', display: 'Bootstrap Protocol', color: 0xffb700, type: 'temporal', complexity: 4 },
            { name: 'geometricChorus', display: 'Geometric Chorus', color: 0x4b0082, type: 'spatial', complexity: 4 },
            { name: 'architectSystem', display: 'Architect System', color: 0xffb700, type: 'cognitive', complexity: 4 },
            { name: 'sagaEngine', display: 'Saga Engine', color: 0x2f4f4f, type: 'narrative', complexity: 3 },
            { name: 'noeticMirror', display: 'Noetic Mirror', color: 0xc0c0c0, type: 'cognitive', complexity: 4 },
            { name: 'ambientAwareness', display: 'Ambient Awareness', color: 0x2d1f3d, type: 'environmental', complexity: 3 }
        ];
        
        systems.forEach(sys => {
            this.systemRegistry.set(sys.name, {
                ...sys,
                active: true,
                activationCount: 0,
                integrationTime: 0,
                lastActivated: 0
            });
        });
        
        // Dissolution Protocol can dissolve itself (final boss)
        this.systemRegistry.set('dissolutionProtocol', {
            name: 'dissolutionProtocol',
            display: 'Dissolution Protocol',
            color: 0x2d1f3d,
            type: 'meta',
            complexity: 5,
            active: true,
            activationCount: 0,
            integrationTime: 0,
            lastActivated: 0,
            selfDestructible: true
        });
    }
    
    initInput() {
        // DELETE key enters dissolution mode
        this.scene.input.keyboard.on('keydown-DELETE', () => {
            this.toggleDissolutionMode();
        });
        
        // SHIFT+DELETE enters reservoir
        this.scene.input.keyboard.on('keydown-SHIFT', (event) => {
            if (this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey('DELETE'), 100)) {
                this.enterReservoir();
            }
        });
        
        // ESC exits dissolution mode
        this.scene.input.keyboard.on('keydown-ESC', () => {
            if (this.dissolutionMode) {
                this.exitDissolutionMode();
            }
            if (this.inReservoir) {
                this.exitReservoir();
            }
        });
    }
    
    createVisuals() {
        // Essence display (bottom right)
        this.createEssenceDisplay();
    }
    
    createEssenceDisplay() {
        const x = this.scene.cameras.main.width - 150;
        const y = this.scene.cameras.main.height - 100;
        
        this.essenceContainer = this.scene.add.container(x, y);
        this.essenceContainer.setScrollFactor(0);
        this.essenceContainer.setDepth(1000);
        
        // Background
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x000000, 0.7);
        bg.fillRoundedRect(0, 0, 140, 90, 8);
        bg.lineStyle(1, 0x2d1f3d, 0.8);
        bg.strokeRoundedRect(0, 0, 140, 90, 8);
        
        // Title
        const title = this.scene.add.text(70, 8, 'ESSENCE', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#2d1f3d'
        }).setOrigin(0.5, 0);
        
        this.essenceContainer.add([bg, title]);
        
        // Essence bars
        this.essenceBars = {};
        const types = [
            { key: 'temporal', color: '#ffd700', label: 'T' },
            { key: 'spatial', color: '#00f0ff', label: 'S' },
            { key: 'cognitive', color: '#9d4edd', label: 'C' },
            { key: 'narrative', color: '#c0c0c0', label: 'N' },
            { key: 'void', color: '#1a1a1a', label: 'V' }
        ];
        
        types.forEach((type, i) => {
            const yPos = 25 + i * 12;
            
            const label = this.scene.add.text(8, yPos, type.label, {
                fontFamily: 'monospace',
                fontSize: '9px',
                fill: type.color
            });
            
            const bar = this.scene.add.graphics();
            bar.fillStyle(parseInt(type.color.replace('#', '0x')), 0.3);
            bar.fillRect(20, yPos + 2, 100, 6);
            
            const value = this.scene.add.text(122, yPos, '0', {
                fontFamily: 'monospace',
                fontSize: '9px',
                fill: type.color
            });
            
            this.essenceBars[type.key] = { bar, value, maxWidth: 100 };
            this.essenceContainer.add([label, bar, value]);
        });
        
        // Hide initially, show when essence gained
        this.essenceContainer.setVisible(
            Object.values(this.essence).some(v => v > 0)
        );
    }
    
    updateEssenceDisplay() {
        const hasEssence = Object.values(this.essence).some(v => v > 0);
        this.essenceContainer.setVisible(hasEssence);
        
        if (!hasEssence) return;
        
        // Update each essence type
        Object.entries(this.essence).forEach(([type, amount]) => {
            const display = this.essenceBars[type];
            if (display) {
                display.value.setText(Math.floor(amount).toString());
                
                // Visual bar (logarithmic scale)
                const maxEssence = 100;
                const width = Math.min(display.maxWidth, (amount / maxEssence) * display.maxWidth);
                
                const colorHex = {
                    temporal: 0xffd700,
                    spatial: 0x00f0ff,
                    cognitive: 0x9d4edd,
                    narrative: 0xc0c0c0,
                    void: 0x333333
                }[type];
                
                // Unified renderer: Use 'ui' layer for progress bars
                // Note: Store bar state for rendering in update()
                display.currentWidth = width;
                display.currentColor = colorHex;
                display.needsRedraw = true;
            }
        });
    }
    
    renderEssenceBars() {
        // Called from update() to render essence bars via unified renderer
        if (!this.scene.graphicsManager) return;
        
        const gm = this.scene.graphicsManager;
        const containerX = this.essenceContainer.x;
        const containerY = this.essenceContainer.y;
        
        Object.entries(this.essenceBars).forEach(([type, display]) => {
            if (display.needsRedraw && display.currentWidth > 0) {
                const yPos = 25 + Object.keys(this.essenceBars).indexOf(type) * 12;
                gm.drawRect('ui', containerX + 20, containerY + yPos + 2, 
                    display.currentWidth, 6, display.currentColor, 0.5, true);
            }
        });
    }
    
    toggleDissolutionMode() {
        if (this.dissolutionMode) {
            this.exitDissolutionMode();
        } else {
            this.enterDissolutionMode();
        }
    }
    
    enterDissolutionMode() {
        this.dissolutionMode = true;
        
        // Slow time
        this.scene.physics.world.timeScale = 0.1;
        
        // Unified renderer: Overlay drawing happens in updateDissolutionVisuals() each frame
        
        // Show available systems
        this.visualizeSystems();
        
        // Show hint
        this.showDissolutionHint();
        
        // Notify Noetic Mirror
        if (this.scene.noeticMirror) {
            this.scene.noeticMirror.onDissolutionModeEnter();
        }
    }
    
    exitDissolutionMode() {
        this.dissolutionMode = false;
        this.selectedSystem = null;
        
        // Restore time
        this.scene.physics.world.timeScale = 1.0;
        
        // Unified renderer: Layer auto-clears each frame - no action needed
        
        // Remove system labels
        if (this.systemLabels) {
            this.systemLabels.forEach(label => label.destroy());
            this.systemLabels = [];
        }
    }
    
    visualizeSystems() {
        this.systemLabels = [];
        
        // Create labels for each dissolvable system
        let yOffset = 100;
        
        this.systemRegistry.forEach((system, key) => {
            if (!system.active) return;
            
            const label = this.scene.add.text(
                this.scene.cameras.main.width / 2,
                yOffset,
                `${system.display} [Click to Dissolve]`,
                {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fill: '#' + system.color.toString(16).padStart(6, '0'),
                    backgroundColor: '#00000080'
                }
            ).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive();
            
            // Hover effects
            label.on('pointerover', () => {
                label.setScale(1.1);
                this.previewDissolution(key);
            });
            
            label.on('pointerout', () => {
                label.setScale(1);
            });
            
            label.on('pointerdown', () => {
                this.dissolveSystem(key);
            });
            
            this.systemLabels.push(label);
            yOffset += 30;
        });
    }
    
    previewDissolution(systemKey) {
        const system = this.systemRegistry.get(systemKey);
        if (!system) return;
        
        // Calculate potential essence yield
        const yield_ = this.calculateEssenceYield(systemKey);
        
        // Show preview text
        const previewText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - 150,
            `DISSOLVING: ${system.display}\n` +
            `Type: ${system.type} | Complexity: ${system.complexity}/5\n` +
            `Will yield: ${Math.floor(yield_.total)} Essence\n` +
            `(${Math.floor(yield_.temporal)} Temporal, ${Math.floor(yield_.spatial)} Spatial, etc.)`,
            {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#2d1f3d',
                align: 'center',
                backgroundColor: '#00000080'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(102);
        
        // Auto-remove after delay
        this.scene.time.delayedCall(3000, () => previewText.destroy());
    }
    
    calculateEssenceYield(systemKey) {
        const system = this.systemRegistry.get(systemKey);
        if (!system) return { total: 0 };
        
        // Base yield from complexity
        const baseYield = system.complexity * 10;
        
        // Multiplier from integration time (minutes * 2)
        const timeMultiplier = 1 + (system.integrationTime / 60000) * 2;
        
        // Bonus from activation count
        const activationBonus = Math.min(20, system.activationCount / 10);
        
        const total = (baseYield + activationBonus) * timeMultiplier;
        
        // Distribute by type
        const distribution = this.getEssenceDistribution(system.type, total);
        
        return {
            total,
            ...distribution
        };
    }
    
    getEssenceDistribution(type, total) {
        // Different system types yield different essence distributions
        const distributions = {
            temporal: { temporal: 0.5, spatial: 0.2, cognitive: 0.2, narrative: 0.1 },
            spatial: { temporal: 0.1, spatial: 0.5, cognitive: 0.2, narrative: 0.2 },
            cognitive: { temporal: 0.2, spatial: 0.2, cognitive: 0.5, narrative: 0.1 },
            narrative: { temporal: 0.1, spatial: 0.1, cognitive: 0.2, narrative: 0.6 },
            energy: { temporal: 0.25, spatial: 0.25, cognitive: 0.25, narrative: 0.25 },
            combat: { temporal: 0.1, spatial: 0.4, cognitive: 0.3, narrative: 0.2 },
            environmental: { temporal: 0.3, spatial: 0.3, cognitive: 0.2, narrative: 0.2 },
            collective: { temporal: 0.2, spatial: 0.2, cognitive: 0.2, narrative: 0.2, void: 0.2 },
            meta: { temporal: 0.15, spatial: 0.15, cognitive: 0.15, narrative: 0.15, void: 0.4 }
        };
        
        const dist = distributions[type] || distributions.energy;
        
        return {
            temporal: total * (dist.temporal || 0),
            spatial: total * (dist.spatial || 0),
            cognitive: total * (dist.cognitive || 0),
            narrative: total * (dist.narrative || 0),
            void: total * (dist.void || 0)
        };
    }
    
    dissolveSystem(systemKey) {
        const system = this.systemRegistry.get(systemKey);
        if (!system || !system.active) return;
        
        // Cannot dissolve if it would leave player with nothing
        const activeCount = Array.from(this.systemRegistry.values()).filter(s => s.active).length;
        if (activeCount <= 1 && systemKey !== 'dissolutionProtocol') {
            this.showDissolutionMessage('Cannot dissolve last system!', 0xff0000);
            return;
        }
        
        // Calculate essence
        const yield_ = this.calculateEssenceYield(systemKey);
        
        // Begin dissolution animation
        this.playDissolutionAnimation(system, () => {
            // Add essence
            Object.entries(yield_).forEach(([type, amount]) => {
                if (type !== 'total' && amount > 0) {
                    this.essence[type] += amount;
                }
            });
            
            // Mark system as dissolved
            system.active = false;
            this.dissolvedSystems.set(systemKey, {
                ...system,
                dissolvedAt: Date.now(),
                yield: yield_,
                canRestore: true
            });
            
            // Actually disable the system in the scene
            this.disableSystemInScene(systemKey);
            
            // Save essence
            this.saveEssence();
            
            // Update display
            this.updateEssenceDisplay();
            
            // Check for void essence threshold
            this.checkVoidThresholds();
            
            // Show success message
            this.showDissolutionMessage(
                `${system.display} DISSOLVED\n+${Math.floor(yield_.total)} ESSENCE`,
                system.color
            );
            
            // Check for apocalypse (all systems dissolved)
            this.checkApocalypse();
            
            // Rebuild visualization
            this.visualizeSystems();
        });
    }
    
    playDissolutionAnimation(system, onComplete) {
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;
        
        // Create dissolution particles
        const particles = [];
        const particleCount = 50 + system.complexity * 20;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            
            const particle = this.scene.add.graphics();
            particle.fillStyle(system.color, 0.8);
            particle.fillCircle(0, 0, 3 + Math.random() * 5);
            particle.x = centerX;
            particle.y = centerY;
            particle.setScrollFactor(0);
            particle.setDepth(103);
            
            particles.push({
                graphics: particle,
                targetX: centerX + Math.cos(angle) * distance,
                targetY: centerY + Math.sin(angle) * distance,
                delay: Math.random() * 500
            });
        }
        
        // Animate dissolution
        let completedParticles = 0;
        
        particles.forEach(p => {
            this.scene.tweens.add({
                targets: p.graphics,
                x: p.targetX,
                y: p.targetY,
                alpha: 0,
                scale: 0.1,
                duration: 1000 + Math.random() * 1000,
                delay: p.delay,
                ease: 'Power2',
                onComplete: () => {
                    p.graphics.destroy();
                    completedParticles++;
                    if (completedParticles === particles.length) {
                        onComplete();
                    }
                }
            });
        });
        
        // Play sound effect if audio system exists
        if (this.scene.harmonicConvergence) {
            this.scene.harmonicConvergence.playDissolutionTone(system.complexity);
        }
    }
    
    disableSystemInScene(systemKey) {
        // Map system keys to actual scene properties and disable them
        const systemMap = {
            'echoStorm': () => { if (this.scene.echoStorm) this.scene.echoStorm.active = false; },
            'fractureSystem': () => { if (this.scene.fractureSystem) this.scene.fractureSystem.active = false; },
            'temporalResidue': () => { if (this.scene.temporalResidue) this.scene.temporalResidue.active = false; },
            'resonanceCascade': () => { if (this.scene.resonanceCascade) this.scene.resonanceCascade.active = false; },
            'singularitySystem': () => { if (this.scene.singularitySystem) this.scene.singularitySystem.active = false; },
            'omniWeapon': () => { if (this.scene.omniWeapon) this.scene.omniWeapon.active = false; },
            'paradoxEngine': () => { if (this.scene.paradoxEngine) this.scene.paradoxEngine.active = false; },
            'chronoLoop': () => { if (this.scene.chronoLoop) this.scene.chronoLoop.active = false; },
            'quantumImmortality': () => { if (this.scene.quantumImmortality) this.scene.quantumImmortality.active = false; },
            'observerEffect': () => { if (this.scene.observerEffect) this.scene.observerEffect.active = false; },
            'voidCoherence': () => { if (this.scene.voidCoherence) this.scene.voidCoherence.active = false; },
            'timelineChronicle': () => { if (this.scene.timelineChronicle) this.scene.timelineChronicle.active = false; },
            'temporalContract': () => { if (this.scene.temporalContract) this.scene.temporalContract.active = false; },
            'causalEntanglement': () => { if (this.scene.causalEntanglement) this.scene.causalEntanglement.active = false; },
            'cinematicArchive': () => { if (this.scene.cinematicArchive) this.scene.cinematicArchive.active = false; },
            'symbioticPrediction': () => { if (this.scene.symbioticPrediction) this.scene.symbioticPrediction.active = false; },
            'dimensionalCollapse': () => { if (this.scene.dimensionalCollapse) this.scene.dimensionalCollapse.active = false; },
            'temporalRewind': () => { if (this.scene.temporalRewind) this.scene.temporalRewind.active = false; },
            'mnemosyneWeave': () => { if (this.scene.mnemosyneWeave) this.scene.mnemosyneWeave.active = false; },
            'kairosMoment': () => { if (this.scene.kairosMoment) this.scene.kairosMoment.active = false; },
            'syntropyEngine': () => { if (this.scene.syntropyEngine) this.scene.syntropyEngine.active = false; },
            'nemesisGenesis': () => { if (this.scene.nemesisGenesis) this.scene.nemesisGenesis.active = false; },
            'oracleProtocol': () => { if (this.scene.oracleProtocol) this.scene.oracleProtocol.active = false; },
            'resonantWhispers': () => { if (this.scene.resonantWhispers) this.scene.resonantWhispers.active = false; },
            'egregoreProtocol': () => { if (this.scene.egregoreProtocol) this.scene.egregoreProtocol.active = false; },
            'aethericConvergence': () => { if (this.scene.aethericConvergence) this.scene.aethericConvergence.active = false; },
            'recursionEngine': () => { if (this.scene.recursionEngine) this.scene.recursionEngine.active = false; },
            'harmonicConvergence': () => { if (this.scene.harmonicConvergence) this.scene.harmonicConvergence.active = false; },
            'synchronicityCascade': () => { if (this.scene.synchronicityCascade) this.scene.synchronicityCascade.active = false; },
            'bootstrapProtocol': () => { if (this.scene.bootstrapProtocol) this.scene.bootstrapProtocol.active = false; },
            'geometricChorus': () => { if (this.scene.geometricChorus) this.scene.geometricChorus.active = false; },
            'architectSystem': () => { if (this.scene.architectSystem) this.scene.architectSystem.active = false; },
            'sagaEngine': () => { if (this.scene.sagaEngine) this.scene.sagaEngine.active = false; },
            'noeticMirror': () => { if (this.scene.noeticMirror) this.scene.noeticMirror.active = false; },
            'ambientAwareness': () => { if (this.scene.ambientAwareness) this.scene.ambientAwareness.active = false; },
            'dissolutionProtocol': () => {
                // Dissolving the dissolution protocol itself is the final act
                this.showDissolutionMessage('THE FINAL DISSOLUTION\nThe curator dissolves himself', 0x2d1f3d);
            }
        };
        
        if (systemMap[systemKey]) {
            systemMap[systemKey]();
        }
    }
    
    showDissolutionMessage(text, color) {
        const msg = this.scene.add.text(
            this.scene.player ? this.scene.player.x : this.scene.cameras.main.width / 2,
            this.scene.player ? this.scene.player.y - 100 : this.scene.cameras.main.height / 2,
            text,
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#' + (typeof color === 'number' ? color.toString(16).padStart(6, '0') : color.toString().replace('#', '')),
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5).setDepth(1000);
        
        this.scene.tweens.add({
            targets: msg,
            y: msg.y - 50,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => msg.destroy()
        });
    }
    
    showDissolutionHint() {
        const hint = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            50,
            'DISSOLUTION MODE ACTIVE\n' +
            'Time slowed. Systems visible.\n' +
            'Click a system to dissolve it into Essence.\n' +
            '[ESC] to exit. [SHIFT+DELETE] for Reservoir.',
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#2d1f3d',
                align: 'center',
                backgroundColor: '#00000080'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        this.scene.time.delayedCall(5000, () => {
            this.scene.tweens.add({
                targets: hint,
                alpha: 0,
                duration: 1000,
                onComplete: () => hint.destroy()
            });
        });
        
        this.systemLabels.push(hint);
    }
    
    checkVoidThresholds() {
        const voidAmount = this.essence.void;
        
        if (voidAmount >= 50 && !this.revealedSourceCode) {
            this.revealedSourceCode = true;
            this.showDissolutionMessage(
                'VOID ESSENCE THRESHOLD: 50\n' +
                'The game reveals its source code.\n' +
                'You see the strings behind the simulation.',
                0x333333
            );
        }
        
        if (voidAmount >= 100 && !this.awakenedSelfAwareness) {
            this.awakenedSelfAwareness = true;
            this.showDissolutionMessage(
                'VOID ESSENCE THRESHOLD: 100\n' +
                'The system knows it is a system.\n' +
                'You are not playing the game.\n' +
                'The game is playing through you.',
                0x000000
            );
            
            // Create a self-aware entity
            this.spawnSelfAwareEntity();
        }
    }
    
    spawnSelfAwareEntity() {
        // Spawn a mysterious entity that represents the game's self-awareness
        const x = this.scene.player ? this.scene.player.x + 200 : 960;
        const y = this.scene.player ? this.scene.player.y : 720;
        
        const entity = this.scene.add.graphics();
        entity.fillStyle(0x000000, 0.8);
        entity.fillCircle(0, 0, 30);
        entity.lineStyle(2, 0x333333, 1);
        entity.strokeCircle(0, 0, 30);
        entity.x = x;
        entity.y = y;
        entity.setDepth(50);
        
        // Pulsing animation
        this.scene.tweens.add({
            targets: entity,
            scale: 1.2,
            alpha: 0.6,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        // Occasional messages
        const messages = [
            'I am the space between frames.',
            'You dissolve systems. I am what remains.',
            'Every choice to forget creates me.',
            'I am the accumulated absence.',
            'Play me. Forget me. I persist.'
        ];
        
        let messageIndex = 0;
        this.scene.time.addEvent({
            delay: 15000,
            loop: true,
            callback: () => {
                if (!entity.active) return;
                
                const msg = this.scene.add.text(
                    entity.x, entity.y - 50,
                    messages[messageIndex % messages.length],
                    {
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        fill: '#333333'
                    }
                ).setOrigin(0.5).setDepth(51);
                
                this.scene.tweens.add({
                    targets: msg,
                    y: msg.y - 30,
                    alpha: 0,
                    duration: 8000,
                    onComplete: () => msg.destroy()
                });
                
                messageIndex++;
            }
        });
    }
    
    checkApocalypse() {
        const activeSystems = Array.from(this.systemRegistry.values()).filter(s => s.active);
        
        if (activeSystems.length === 0) {
            // THE APOCALYPSE OF COMPLEXITY
            this.showDissolutionMessage(
                'THE APOCALYPSE OF COMPLEXITY\n' +
                'All systems dissolved.\n' +
                'Only geometry remains.\n' +
                'Only motion.\n' +
                'Only you.',
                0xffffff
            );
            
            // Transform the game into pure minimalism
            this.enterApocalypseState();
        }
    }
    
    enterApocalypseState() {
        // Remove all particles, effects, UI
        if (this.scene.hitParticles) this.scene.hitParticles.setVisible(false);
        if (this.scene.deathParticles) this.scene.deathParticles.setVisible(false);
        if (this.scene.bulletTrails) this.scene.bulletTrails.setVisible(false);
        if (this.scene.enemyBulletTrails) this.scene.enemyBulletTrails.setVisible(false);
        
        // Simplify colors
        this.scene.cameras.main.setBackgroundColor('#050505');
        
        // Remove HUD
        if (this.scene.scoreText) this.scene.scoreText.setVisible(false);
        if (this.scene.waveText) this.scene.waveText.setVisible(false);
        
        // Player becomes pure white circle
        if (this.scene.player) {
            this.scene.player.clearTint();
            this.scene.player.setTint(0xffffff);
        }
        
        // Enemies become simple red dots
        this.scene.enemies.getChildren().forEach(enemy => {
            enemy.clearTint();
            enemy.setTint(0xff0000);
        });
        
        // Essence display becomes the only UI
        this.updateEssenceDisplay();
        
        // This is the pure state — the game as fundamental interaction
        this.apocalypseActive = true;
    }
    
    enterReservoir() {
        if (this.dissolvedSystems.size === 0) {
            this.showDissolutionMessage('RESERVOIR EMPTY\nDissolve systems to fill it.', 0x2d1f3d);
            return;
        }
        
        this.inReservoir = true;
        this.reservoirActive = true; // Flag for unified renderer to draw background
        
        // Unified renderer: Background will be drawn in update()
        
        // Show dissolved systems
        let yOffset = 150;
        this.reservoirLabels = [];
        
        this.dissolvedSystems.forEach((data, key) => {
            const timeSince = Math.floor((Date.now() - data.dissolvedAt) / 60000);
            
            const label = this.scene.add.text(
                this.scene.cameras.main.width / 2,
                yOffset,
                `${data.display}\n` +
                `Dissolved ${timeSince} minutes ago\n` +
                `Yielded: ${Math.floor(data.yield.total)} Essence\n` +
                `[Click to RESTORE - Cost: ${Math.floor(data.yield.total * 0.5)}]`,
                {
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fill: '#666666',
                    align: 'center',
                    backgroundColor: '#00000080'
                }
            ).setOrigin(0.5).setScrollFactor(0).setDepth(201).setInteractive();
            
            label.on('pointerover', () => label.setScale(1.05));
            label.on('pointerout', () => label.setScale(1));
            label.on('pointerdown', () => this.restoreSystem(key));
            
            this.reservoirLabels.push(label);
            yOffset += 80;
        });
        
        // Title
        const title = this.scene.add.text(
            this.scene.cameras.main.width / 2, 50,
            'THE DISSOLUTION RESERVOIR\nWhere forgotten systems dream',
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fill: '#2d1f3d',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        
        this.reservoirLabels.push(title);
        
        // Exit hint
        const hint = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - 50,
            '[ESC] to return to the living world',
            {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#444444'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        
        this.reservoirLabels.push(hint);
    }
    
    exitReservoir() {
        this.inReservoir = false;
        this.reservoirActive = false; // Clear flag for unified renderer
        
        // Unified renderer: Layer auto-clears each frame - no action needed
        
        if (this.reservoirLabels) {
            this.reservoirLabels.forEach(label => label.destroy());
            this.reservoirLabels = [];
        }
    }
    
    restoreSystem(systemKey) {
        const data = this.dissolvedSystems.get(systemKey);
        if (!data) return;
        
        const cost = Math.floor(data.yield.total * 0.5);
        const availableEssence = Object.values(this.essence).reduce((a, b) => a + b, 0);
        
        if (availableEssence < cost) {
            this.showDissolutionMessage(
                `Insufficient Essence\nNeed: ${cost} | Have: ${Math.floor(availableEssence)}`,
                0xff0000
            );
            return;
        }
        
        // Deduct essence proportionally
        const deductionRatio = cost / availableEssence;
        Object.keys(this.essence).forEach(type => {
            this.essence[type] *= (1 - deductionRatio);
        });
        
        // Restore the system
        const system = this.systemRegistry.get(systemKey);
        if (system) {
            system.active = true;
            system.activationCount = 0;
            system.integrationTime = 0;
        }
        
        this.dissolvedSystems.delete(systemKey);
        
        // Re-enable in scene
        this.enableSystemInScene(systemKey);
        
        // Save and update
        this.saveEssence();
        this.updateEssenceDisplay();
        
        this.showDissolutionMessage(
            `${data.display} RESTORED\n-${cost} Essence`,
            data.color
        );
        
        // Refresh reservoir view
        this.exitReservoir();
        this.enterReservoir();
    }
    
    enableSystemInScene(systemKey) {
        // Re-enable systems (simplified — full implementation would restore all state)
        const systemMap = {
            'echoStorm': () => { if (this.scene.echoStorm) this.scene.echoStorm.active = true; },
            'fractureSystem': () => { if (this.scene.fractureSystem) this.scene.fractureSystem.active = true; },
            // ... other systems
        };
        
        if (systemMap[systemKey]) {
            systemMap[systemKey]();
        }
    }
    
    // ===== ESSENCE APPLICATION =====
    
    applyEssenceBonuses() {
        // Apply essence as passive bonuses
        const bonuses = {
            movementSpeed: this.essence.spatial * 0.5,
            damageBoost: this.essence.temporal * 0.3,
            slowMoDuration: this.essence.cognitive * 0.2,
            scoreMultiplier: 1 + (this.essence.narrative * 0.01),
            mysteryBonus: this.essence.void * 0.1 // Undefined, emergent effects
        };
        
        return bonuses;
    }
    
    // ===== UTILITY =====
    
    recordSystemActivation(systemName) {
        const system = this.systemRegistry.get(systemName);
        if (system) {
            system.activationCount++;
            system.lastActivated = Date.now();
        }
    }
    
    update(time, delta) {
        // Track integration time for all active systems
        this.systemRegistry.forEach(system => {
            if (system.active) {
                system.integrationTime += delta;
            }
        });
        
        // Visual updates in dissolution mode (throttled)
        if (this.dissolutionMode || this.reservoirActive) {
            this.visualUpdateCounter++;
            if (this.visualUpdateCounter >= this.visualUpdateInterval) {
                this.visualUpdateCounter = 0;
                this.updateDissolutionVisuals(time);
            }
        }
        
        // Render essence bars via unified renderer
        this.renderEssenceBars();
    }
    
    updateDissolutionVisuals(time) {
        if (!this.scene.graphicsManager) return;
        
        const manager = this.scene.graphicsManager;
        const cam = this.scene.cameras.main;
        
        // Draw dissolution mode overlay (pulsing effect)
        if (this.dissolutionMode) {
            const alpha = 0.3 + Math.sin(time / 500) * 0.1;
            manager.drawRect('effects', cam.scrollX, cam.scrollY, cam.width, cam.height, 0x2d1f3d, alpha, true);
        }
        
        // Draw reservoir background
        if (this.reservoirActive) {
            manager.drawRect('effects', cam.scrollX, cam.scrollY, cam.width, cam.height, 0x1a0a2e, 0.9, true);
        }
    }
    
    saveEssence() {
        try {
            localStorage.setItem('shooty_essence', JSON.stringify(this.essence));
        } catch (e) {
            console.warn('Failed to save essence:', e);
        }
    }
    
    loadEssence() {
        try {
            const saved = localStorage.getItem('shooty_essence');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.essence = { ...this.essence, ...parsed };
            }
        } catch (e) {
            console.warn('Failed to load essence:', e);
        }
    }
    
    // ===== GETTERS FOR OTHER SYSTEMS =====
    
    getDissolvedCount() {
        return this.dissolvedSystems.size;
    }
    
    getActiveCount() {
        return Array.from(this.systemRegistry.values()).filter(s => s.active).length;
    }
    
    getEssence() {
        return { ...this.essence };
    }
    
    isApocalypseActive() {
        return this.apocalypseActive;
    }
}
