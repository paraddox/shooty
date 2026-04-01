import Phaser from 'phaser';

/**
 * MetaSystemOperator — The 50th Dimension: ARCHITECTURAL ONTOLOGY
 * 
 * The apotheosis of all temporal systems. Players don't just USE systems—
 * they REWIRE how systems affect each other. Create feedback loops, 
 * bidirectional couplings, and emergent system-topologies.
 * 
 * Core Innovation: The game becomes a modular synthesizer where systems
 * are oscillators and players patch cables between them.
 * 
 * Example Patches:
 * - Near-Miss → Echo Storm: Every graze auto-absorbs nearby echoes
 * - Fracture → Singularity: Ghost bullets charge singularity while real fires
 * - Resonance → Paradox: High cascade multipliers extend paradox windows
 * - Aurora → Rhythm: Phase-space density modulates musical tempo
 * - Aperture → Nemesis: Where you look spawns personalized rivals
 * 
 * Color: Meta-Gold (#ffb700) — the color of pure potential
 * Interface: Radial patchbay with flowing energy conduits
 * 
 * This is the final dimension. The system of systems. The meta becomes ground.
 */

export default class MetaSystemOperator {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.META_COLOR = 0xffb700;        // Meta-gold (potential)
        this.PATCH_COLOR = 0x00f0ff;       // Cyan (active patch)
        this.FLOW_COLOR = 0xffd700;         // Gold (energy flow)
        this.VOID_COLOR = 0x1a0a2e;         // Deep void
        
        // Available systems for patching (system nodes)
        this.systemNodes = [
            { id: 'nearMiss', name: 'NEAR-MISS', color: 0xffd700, radius: 80, angle: 0 },
            { id: 'echoStorm', name: 'ECHO', color: 0xffd700, radius: 80, angle: Math.PI / 8 },
            { id: 'fracture', name: 'FRACTURE', color: 0xffd700, radius: 80, angle: Math.PI / 4 },
            { id: 'residue', name: 'RESIDUE', color: 0x9d4edd, radius: 80, angle: 3 * Math.PI / 8 },
            { id: 'singularity', name: 'SINGULARITY', color: 0xdc143c, radius: 80, angle: Math.PI / 2 },
            { id: 'omniWeapon', name: 'WEAPON', color: 0xff3366, radius: 80, angle: 5 * Math.PI / 8 },
            { id: 'paradox', name: 'PARADOX', color: 0xff00ff, radius: 80, angle: 3 * Math.PI / 4 },
            { id: 'chronoLoop', name: 'CHRONO', color: 0x008080, radius: 80, angle: 7 * Math.PI / 8 },
            { id: 'quantum', name: 'QUANTUM', color: 0xffffff, radius: 80, angle: Math.PI },
            { id: 'resonance', name: 'RESONANCE', color: 0xffd700, radius: 80, angle: 9 * Math.PI / 8 },
            { id: 'observer', name: 'OBSERVER', color: 0x00d4ff, radius: 80, angle: 5 * Math.PI / 4 },
            { id: 'voidCoherence', name: 'VOID', color: 0x4b0082, radius: 80, angle: 11 * Math.PI / 8 },
            { id: 'oracle', name: 'ORACLE', color: 0x00ffff, radius: 80, angle: 3 * Math.PI / 2 },
            { id: 'nemesis', name: 'NEMESIS', color: 0xff0040, radius: 80, angle: 13 * Math.PI / 8 },
            { id: 'architect', name: 'ARCHITECT', color: 0xffb700, radius: 80, angle: 7 * Math.PI / 4 },
            { id: 'synaesthesia', name: 'AUDIO', color: 0xc0c0c0, radius: 80, angle: 15 * Math.PI / 8 }
        ];
        
        // Active patches (source → target with modulation type)
        this.activePatches = new Map(); // "source|target" → { type, strength, visual }
        
        // Patch types and their effects
        this.patchTypes = {
            AMPLIFY: { name: 'AMPLIFY', color: 0xff3366, desc: 'Source boosts target' },
            CASCADE: { name: 'CASCADE', color: 0xffd700, desc: 'Source triggers target' },
            MODULATE: { name: 'MODULATE', color: 0x00f0ff, desc: 'Source scales target' },
            SYNERGY: { name: 'SYNERGY', color: 0xff00ff, desc: 'Bidirectional loop' }
        };
        
        // State
        this.isPatchMode = false;
        this.selectedSource = null;
        this.patchMenuOpen = false;
        this.patchEnergy = 100; // Energy for maintaining patches
        this.maxPatches = 3; // Limited patching slots
        
        // Visuals
        this.nodeGraphics = [];
        this.flowLines = [];
        this.patchMenuContainer = null;
        this.patchHUD = null;
        // Note: Graphics rendering is now handled by UnifiedGraphicsManager
        
        // Patch history (for learning)
        this.patchHistory = [];
        this.emergentBehaviors = new Set();
        
        this.init();
    }
    
    init() {
        this.createPatchGraphics();
        this.createPatchHUD();
        this.setupInput();
        this.loadSavedPatches();
    }
    
    createPatchGraphics() {
        // Note: Graphics rendering is now handled by UnifiedGraphicsManager on 'effects' layer
        // Node containers remain as they use interactive GameObjects (circles, text)
        
        // Create node graphics for each system
        this.systemNodes.forEach((node, index) => {
            const container = this.scene.add.container(0, 0);
            container.setDepth(91);
            container.setVisible(false);
            
            // Node circle
            const circle = this.scene.add.circle(0, 0, 25, node.color, 0.3);
            circle.setStrokeStyle(2, node.color, 0.8);
            
            // Inner pulse
            const pulse = this.scene.add.circle(0, 0, 15, node.color, 0.6);
            
            // Label
            const label = this.scene.add.text(0, 35, node.name, {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#' + node.color.toString(16).padStart(6, '0')
            }).setOrigin(0.5);
            
            container.add([circle, pulse, label]);
            
            // Idle pulse animation
            this.scene.tweens.add({
                targets: pulse,
                scale: { from: 0.5, to: 1.2 },
                alpha: { from: 0.6, to: 0.2 },
                duration: 2000,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
            
            // Click handler
            circle.setInteractive();
            circle.on('pointerdown', () => this.onNodeClick(node));
            circle.on('pointerover', () => {
                circle.setScale(1.2);
                label.setScale(1.1);
            });
            circle.on('pointerout', () => {
                circle.setScale(1);
                label.setScale(1);
            });
            
            this.nodeGraphics[index] = { container, circle, pulse, label };
        });
    }
    
    createPatchHUD() {
        // Small indicator in corner showing active patches
        this.patchHUD = this.scene.add.container(
            this.scene.scale.width - 120,
            this.scene.scale.height - 80
        );
        this.patchHUD.setDepth(100);
        this.patchHUD.setScrollFactor(0);
        
        // Background
        const bg = this.scene.add.rectangle(0, 0, 100, 60, 0x0a0a0f, 0.8);
        bg.setStrokeStyle(1, this.META_COLOR, 0.5);
        
        // Title
        const title = this.scene.add.text(0, -20, 'META-SYSTEM', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#ffb700'
        }).setOrigin(0.5);
        
        // Patch count
        this.patchCountText = this.scene.add.text(0, 0, 'PATCHES: 0/3', {
            fontFamily: 'monospace',
            fontSize: '11px',
            fill: '#00f0ff'
        }).setOrigin(0.5);
        
        // Energy bar
        this.energyBarBg = this.scene.add.rectangle(0, 18, 80, 6, 0x222222);
        this.energyBar = this.scene.add.rectangle(0, 18, 80, 6, this.META_COLOR);
        
        // Key hint
        const hint = this.scene.add.text(0, 32, '[P] PATCH MODE', {
            fontFamily: 'monospace',
            fontSize: '8px',
            fill: '#666666'
        }).setOrigin(0.5);
        
        this.patchHUD.add([bg, title, this.patchCountText, this.energyBarBg, this.energyBar, hint]);
        
        // Initially hidden until discovered
        this.patchHUD.setVisible(false);
        this.patchHUD.setAlpha(0);
    }
    
    setupInput() {
        // P key to enter patch mode
        this.scene.input.keyboard.on('keydown-P', () => {
            this.togglePatchMode();
        });
        
        // ESC to exit patch mode
        this.scene.input.keyboard.on('keydown-ESC', () => {
            if (this.isPatchMode) {
                this.exitPatchMode();
            }
        });
    }
    
    togglePatchMode() {
        if (this.isPatchMode) {
            this.exitPatchMode();
        } else {
            this.enterPatchMode();
        }
    }
    
    enterPatchMode() {
        this.isPatchMode = true;
        
        // Pause game time (not completely - systems still run)
        this.scene.physics.world.timeScale = 0.1;
        
        // Note: Graphics rendering is now handled by UnifiedGraphicsManager on 'effects' layer
        
        // Position nodes around player
        const centerX = this.scene.cameras.main.scrollX + this.scene.scale.width / 2;
        const centerY = this.scene.cameras.main.scrollY + this.scene.scale.height / 2;
        
        this.systemNodes.forEach((node, index) => {
            const x = centerX + Math.cos(node.angle) * node.radius * 2;
            const y = centerY + Math.sin(node.angle) * node.radius * 2;
            
            this.nodeGraphics[index].container.setPosition(x, y);
            this.nodeGraphics[index].container.setVisible(true);
            this.nodeGraphics[index].container.setAlpha(0);
            
            // Animate in
            this.scene.tweens.add({
                targets: this.nodeGraphics[index].container,
                alpha: 1,
                scale: { from: 0, to: 1 },
                duration: 300,
                delay: index * 50,
                ease: 'Back.easeOut'
            });
        });
        
        // Draw existing patches
        this.renderActivePatches();
        
        // Show instruction
        this.showPatchModeHint();
    }
    
    exitPatchMode() {
        this.isPatchMode = false;
        this.selectedSource = null;
        this.closePatchMenu();
        
        // Resume game time
        this.scene.physics.world.timeScale = 1;
        
        // Note: Graphics clearing is now handled by UnifiedGraphicsManager (no visibility toggle needed)
        
        // Hide nodes
        this.nodeGraphics.forEach(ng => {
            ng.container.setVisible(false);
        });
    }
    
    onNodeClick(node) {
        if (!this.selectedSource) {
            // Select source
            this.selectedSource = node;
            
            // Highlight
            const index = this.systemNodes.indexOf(node);
            this.nodeGraphics[index].circle.setStrokeStyle(4, 0xffffff);
            
            // Show patch type menu
            this.showPatchMenu(node);
        } else if (this.selectedSource === node) {
            // Deselect
            this.selectedSource = null;
            const index = this.systemNodes.indexOf(node);
            this.nodeGraphics[index].circle.setStrokeStyle(2, node.color);
            this.closePatchMenu();
        } else {
            // Try to create patch
            this.attemptCreatePatch(this.selectedSource, node);
        }
    }
    
    showPatchMenu(sourceNode) {
        if (this.patchMenuContainer) {
            this.patchMenuContainer.destroy();
        }
        
        const sourceIndex = this.systemNodes.indexOf(sourceNode);
        const sourcePos = this.nodeGraphics[sourceIndex].container;
        
        this.patchMenuContainer = this.scene.add.container(
            sourcePos.x + 40,
            sourcePos.y
        );
        this.patchMenuContainer.setDepth(92);
        
        // Menu background
        const bg = this.scene.add.rectangle(0, 0, 120, 100, 0x0a0a0f, 0.95);
        bg.setStrokeStyle(1, this.META_COLOR);
        
        // Title
        const title = this.scene.add.text(0, -35, 'PATCH TYPE', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#ffb700'
        }).setOrigin(0.5);
        
        this.patchMenuContainer.add([bg, title]);
        
        // Patch type options
        const types = Object.values(this.patchTypes);
        types.forEach((type, index) => {
            const y = -10 + index * 22;
            
            const item = this.scene.add.container(0, y);
            
            const colorRect = this.scene.add.rectangle(-45, 0, 12, 12, type.color);
            const label = this.scene.add.text(-30, 0, type.name, {
                fontFamily: 'monospace',
                fontSize: '11px',
                fill: '#ffffff'
            }).setOrigin(0, 0.5);
            
            item.add([colorRect, label]);
            item.setInteractive(new Phaser.Geom.Rectangle(-60, -10, 120, 20), Phaser.Geom.Rectangle.Contains);
            
            item.on('pointerdown', () => {
                this.selectedPatchType = type;
                this.showTargetSelectionHint(type);
            });
            
            item.on('pointerover', () => {
                label.setFill('#' + type.color.toString(16));
                item.setScale(1.05);
            });
            
            item.on('pointerout', () => {
                label.setFill('#ffffff');
                item.setScale(1);
            });
            
            this.patchMenuContainer.add(item);
        });
        
        this.patchMenuOpen = true;
    }
    
    closePatchMenu() {
        if (this.patchMenuContainer) {
            this.patchMenuContainer.destroy();
            this.patchMenuContainer = null;
        }
        this.patchMenuOpen = false;
        this.selectedPatchType = null;
    }
    
    showPatchModeHint() {
        const centerX = this.scene.cameras.main.scrollX + this.scene.scale.width / 2;
        const centerY = this.scene.cameras.main.scrollY + this.scene.scale.height / 2 - 200;
        
        const hint = this.scene.add.text(centerX, centerY, 
            'META-SYSTEM OPERATOR — THE 50TH DIMENSION\n' +
            'Click a system to select SOURCE\n' +
            'Choose patch type, then click TARGET\n' +
            'Create synergies between your temporal systems\n' +
            '[ESC] to exit', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffb700',
            align: 'center'
        }).setOrigin(0.5);
        
        hint.setDepth(93);
        
        this.scene.tweens.add({
            targets: hint,
            alpha: 0,
            y: centerY - 20,
            duration: 4000,
            delay: 2000,
            ease: 'Power2',
            onComplete: () => hint.destroy()
        });
    }
    
    showTargetSelectionHint(patchType) {
        const centerX = this.scene.cameras.main.scrollX + this.scene.scale.width / 2;
        const centerY = this.scene.cameras.main.scrollY + this.scene.scale.height / 2;
        
        const hint = this.scene.add.text(centerX, centerY + 180,
            `${patchType.name}: ${patchType.desc}\n` +
            'Now select TARGET system...', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#' + patchType.color.toString(16),
            align: 'center'
        }).setOrigin(0.5);
        
        hint.setDepth(93);
        
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: hint,
                alpha: 0,
                duration: 500,
                onComplete: () => hint.destroy()
            });
        });
    }
    
    attemptCreatePatch(source, target) {
        if (!this.selectedPatchType) {
            // Default to AMPLIFY
            this.selectedPatchType = this.patchTypes.AMPLIFY;
        }
        
        // Check if at max patches
        if (this.activePatches.size >= this.maxPatches) {
            this.showPatchLimitWarning();
            return;
        }
        
        // Check if patch already exists
        const patchKey = `${source.id}|${target.id}`;
        if (this.activePatches.has(patchKey)) {
            this.showPatchExistsWarning();
            return;
        }
        
        // Create the patch
        const patch = {
            source: source,
            target: target,
            type: this.selectedPatchType,
            strength: 1.0,
            createdAt: this.scene.time.now,
            visual: null
        };
        
        this.activePatches.set(patchKey, patch);
        this.patchHistory.push(patch);
        
        // Apply the patch effect
        this.applyPatchEffect(patch);
        
        // Visual feedback
        this.renderActivePatches();
        this.showPatchCreatedEffect(source, target, patch);
        
        // Reset selection
        const sourceIndex = this.systemNodes.indexOf(source);
        this.nodeGraphics[sourceIndex].circle.setStrokeStyle(2, source.color);
        
        this.selectedSource = null;
        this.closePatchMenu();
        
        // Update HUD
        this.updatePatchHUD();
        
        // Save patches
        this.savePatches();
        
        // Record in Resonance Cascade if available
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('META_PATCH', {
                source: source.id,
                target: target.id,
                type: patch.type.name
            });
        }
        
        // Check for emergent behavior
        this.checkEmergentBehavior(patch);
    }
    
    applyPatchEffect(patch) {
        // Store reference for cleanup
        patch.handler = this.createPatchHandler(patch);
        
        // Apply based on type
        switch (patch.type.name) {
            case 'AMPLIFY':
                this.applyAmplifyPatch(patch);
                break;
            case 'CASCADE':
                this.applyCascadePatch(patch);
                break;
            case 'MODULATE':
                this.applyModulatePatch(patch);
                break;
            case 'SYNERGY':
                this.applySynergyPatch(patch);
                break;
        }
    }
    
    createPatchHandler(patch) {
        // Return object with methods for each patch type
        // NOTE: Callbacks not yet implemented - returning empty functions
        return {
            cleanup: () => {},
            onSourceActivate: () => {},
            onTargetActivate: () => {}
        };
    }
    
    applyAmplifyPatch(patch) {
        // When source activates, boost target's next activation
        // Example: Near-Miss → Echo Storm: Grazes absorb more echoes
        const scene = this.scene;
        
        patch.boostActive = false;
        
        // Hook into source activation
        switch (patch.source.id) {
            case 'nearMiss':
                // Hook into near-miss detection
                const origNearMiss = scene.triggerNearMiss.bind(scene);
                scene.triggerNearMiss = (...args) => {
                    const result = origNearMiss(...args);
                    patch.boostActive = true;
                    this.scene.time.delayedCall(2000, () => {
                        patch.boostActive = false;
                    });
                    return result;
                };
                break;
                
            case 'fracture':
                // Hook into fracture resolution
                if (scene.fractureSystem) {
                    const origResolve = scene.fractureSystem.showResolveText.bind(scene.fractureSystem);
                    scene.fractureSystem.showResolveText = (isPerfect) => {
                        origResolve(isPerfect);
                        if (isPerfect) {
                            patch.boostActive = true;
                            this.scene.time.delayedCall(3000, () => {
                                patch.boostActive = false;
                            });
                        }
                    };
                }
                break;
                
            case 'echoStorm':
                // Hook into echo absorption
                if (scene.echoStorm) {
                    const origAbsorb = scene.echoStorm.absorbEcho.bind(scene.echoStorm);
                    scene.echoStorm.absorbEcho = (...args) => {
                        const result = origAbsorb(...args);
                        patch.boostActive = true;
                        this.scene.time.delayedCall(1500, () => {
                            patch.boostActive = false;
                        });
                        return result;
                    };
                }
                break;
        }
        
        // Apply boost to target
        switch (patch.target.id) {
            case 'echoStorm':
                if (scene.echoStorm) {
                    const origFire = scene.echoStorm.fireAbsorbedEchoes.bind(scene.echoStorm);
                    scene.echoStorm.fireAbsorbedEchoes = () => {
                        const multiplier = patch.boostActive ? 1.5 : 1.0;
                        const originalCount = scene.echoStorm.absorbedCount;
                        scene.echoStorm.absorbedCount = Math.floor(originalCount * multiplier);
                        origFire();
                        scene.echoStorm.absorbedCount = originalCount;
                    };
                }
                break;
                
            case 'singularity':
                if (scene.singularitySystem) {
                    const origCharge = scene.singularitySystem.addCharge.bind(scene.singularitySystem);
                    scene.singularitySystem.addCharge = (amount) => {
                        const boost = patch.boostActive ? 1.3 : 1.0;
                        origCharge(amount * boost);
                    };
                }
                break;
                
            case 'paradox':
                if (scene.paradoxEngine) {
                    const origMult = scene.paradoxEngine.calculateMultiplier.bind(scene.paradoxEngine);
                    scene.paradoxEngine.calculateMultiplier = () => {
                        const base = origMult();
                        return patch.boostActive ? base * 1.4 : base;
                    };
                }
                break;
        }
    }
    
    applyCascadePatch(patch) {
        // Source activation auto-triggers target
        // Example: Fracture → Singularity: Fracturing auto-deploys singularity
        
        switch (patch.source.id) {
            case 'fracture':
                if (this.scene.fractureSystem) {
                    const origStart = this.scene.fractureSystem.activate.bind(this.scene.fractureSystem);
                    this.scene.fractureSystem.activate = () => {
                        origStart();
                        // Trigger target
                        this.triggerSystem(patch.target.id);
                    };
                }
                break;
                
            case 'quantum':
                if (this.scene.quantumImmortality) {
                    const origDeath = this.scene.quantumImmortality.onPlayerDeath.bind(this.scene.quantumImmortality);
                    this.scene.quantumImmortality.onPlayerDeath = (...args) => {
                        const result = origDeath(...args);
                        this.triggerSystem(patch.target.id);
                        return result;
                    };
                }
                break;
                
            case 'resonance':
                if (this.scene.resonanceCascade) {
                    const origBreak = this.scene.resonanceCascade.forceBreak.bind(this.scene.resonanceCascade);
                    this.scene.resonanceCascade.forceBreak = () => {
                        origBreak();
                        this.triggerSystem(patch.target.id);
                    };
                }
                break;
        }
    }
    
    applyModulatePatch(patch) {
        // Source state scales target behavior
        // Example: Resonance → Paradox: Higher cascade = longer paradox windows
        
        switch (patch.source.id) {
            case 'resonance':
                if (this.scene.resonanceCascade && this.scene.paradoxEngine) {
                    const origWindow = this.scene.paradoxEngine.projectionWindow;
                    Object.defineProperty(this.scene.paradoxEngine, 'projectionWindow', {
                        get: () => {
                            const chainLevel = this.scene.resonanceCascade.chainLevel || 1;
                            return origWindow * (1 + chainLevel * 0.2);
                        }
                    });
                }
                break;
                
            case 'voidCoherence':
                if (this.scene.voidCoherence) {
                    // Coherence level affects various systems
                    patch.coherenceModulation = true;
                }
                break;
        }
    }
    
    applySynergyPatch(patch) {
        // Bidirectional loop - both systems enhance each other
        // Example: Chrono-Loop + Echo Storm: Echoes spawn chrono echoes, chrono absorbs real echoes
        
        // Create mutual enhancement
        patch.bidirectional = true;
        
        switch (patch.source.id + '|' + patch.target.id) {
            case 'chronoLoop|echoStorm':
            case 'echoStorm|chronoLoop':
                // Chrono echoes can absorb real echoes
                if (this.scene.chronoLoop && this.scene.echoStorm) {
                    // Custom behavior: Past echoes graze real echoes
                    patch.synergyHandler = this.createChronoEchoSynergy();
                }
                break;
                
            case 'paradox|quantum':
            case 'quantum|paradox':
                // Paradox predictions show quantum branches
                patch.synergyHandler = this.createParadoxQuantumSynergy();
                break;
        }
    }
    
    triggerSystem(systemId) {
        // Trigger a system by ID
        switch (systemId) {
            case 'echoStorm':
                if (this.scene.echoStorm && this.scene.nearMissState.active) {
                    // Auto-absorb nearby echoes
                    this.scene.echoStorm.absorbNearbyEchoes();
                }
                break;
                
            case 'singularity':
                if (this.scene.singularitySystem) {
                    if (this.scene.singularitySystem.isDeployed) {
                        this.scene.singularitySystem.detonate();
                    } else if (this.scene.singularitySystem.canDeploy()) {
                        this.scene.singularitySystem.deploy();
                    }
                }
                break;
                
            case 'fracture':
                if (this.scene.fractureSystem) {
                    if (this.scene.fractureSystem.isFractured) {
                        this.scene.fractureSystem.resolve();
                    } else if (this.scene.fractureSystem.canFracture()) {
                        this.scene.fractureSystem.activate();
                    }
                }
                break;
                
            case 'paradox':
                if (this.scene.paradoxEngine) {
                    if (!this.scene.paradoxEngine.isProjecting && this.scene.paradoxEngine.canProject()) {
                        this.scene.paradoxEngine.startProjection();
                    }
                }
                break;
        }
    }
    
    createChronoEchoSynergy() {
        // Chrono echoes absorb real echoes
        const handler = {
            update: () => {
                if (!this.scene.chronoLoop || !this.scene.echoStorm) return;
                
                const echoes = this.scene.echoStorm.getActiveEchoes?.() || [];
                const chronoEchoes = this.scene.chronoLoop.getPastEchoes?.() || [];
                
                chronoEchoes.forEach(chrono => {
                    echoes.forEach(echo => {
                        if (!echo.absorbed && !echo.chronoAbsorbed) {
                            const dist = Phaser.Math.Distance.Between(
                                chrono.x, chrono.y,
                                echo.x, echo.y
                            );
                            if (dist < 50) {
                                echo.chronoAbsorbed = true;
                                // Chrono echo fires when it loops back
                                this.scene.echoStorm.createHomingBullet(
                                    chrono.x, chrono.y, 0xff00ff, true
                                );
                            }
                        }
                    });
                });
            }
        };
        
        return handler;
    }
    
    createParadoxQuantumSynergy() {
        // Paradox predictions show quantum branch probabilities
        return {
            update: () => {
                // Custom rendering in paradox predictions
            }
        };
    }
    
    renderActivePatches() {
        // Use UnifiedGraphicsManager on 'effects' layer
        const manager = this.scene.graphicsManager;
        if (!manager) return;
        
        this.activePatches.forEach((patch, key) => {
            const sourceIndex = this.systemNodes.indexOf(patch.source);
            const targetIndex = this.systemNodes.indexOf(patch.target);
            
            const sourcePos = this.nodeGraphics[sourceIndex]?.container;
            const targetPos = this.nodeGraphics[targetIndex]?.container;
            
            if (!sourcePos || !targetPos) return;
            
            const sx = sourcePos.x;
            const sy = sourcePos.y;
            const tx = targetPos.x;
            const ty = targetPos.y;
            
            // Calculate curve control point (quadratic bezier)
            const midX = (sx + tx) / 2;
            const midY = (sy + ty) / 2;
            const perpX = -(ty - sy);
            const perpY = tx - sx;
            const len = Math.sqrt(perpX * perpX + perpY * perpY);
            const curve = len * 0.2;
            const cx = midX + (perpX / len) * curve;
            const cy = midY + (perpY / len) * curve;
            
            // Convert quadratic bezier to points for drawPath
            const points = this.calculateBezierPoints(sx, sy, cx, cy, tx, ty, 20);
            const color = patch.type.color;
            
            // Outer glow (thicker, lower alpha)
            manager.drawPath('effects', points, color, 0.2, 6);
            
            // Inner bright line (thinner, higher alpha)
            manager.drawPath('effects', points, color, 0.9, 2);
            
            // Animated flow particles
            const time = this.scene.time.now / 1000;
            const flowPos = (time % 1);
            
            // Bezier interpolation for particle position
            const t = flowPos;
            const mt = 1 - t;
            const px = mt * mt * sx + 2 * mt * t * cx + t * t * tx;
            const py = mt * mt * sy + 2 * mt * t * cy + t * t * ty;
            
            // Draw flowing particle
            manager.drawCircle('effects', px, py, 4, color, 1);
        });
    }
    
    /**
     * Calculate points along a quadratic bezier curve for drawPath
     */
    calculateBezierPoints(sx, sy, cx, cy, ex, ey, segments = 20) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const mt = 1 - t;
            const x = mt * mt * sx + 2 * mt * t * cx + t * t * ex;
            const y = mt * mt * sy + 2 * mt * t * cy + t * t * ey;
            points.push({ x, y });
        }
        return points;
    }
    
    showPatchCreatedEffect(source, target, patch) {
        const sourceIndex = this.systemNodes.indexOf(source);
        const targetIndex = this.systemNodes.indexOf(target);
        const sourcePos = this.nodeGraphics[sourceIndex].container;
        const targetPos = this.nodeGraphics[targetIndex].container;
        
        // Flash line
        const flash = this.scene.add.graphics();
        flash.lineStyle(4, 0xffffff, 1);
        flash.lineBetween(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
        flash.setDepth(94);
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
        
        // Text announcement
        const midX = (sourcePos.x + targetPos.x) / 2;
        const midY = (sourcePos.y + targetPos.y) / 2;
        
        const text = this.scene.add.text(midX, midY,
            `${patch.type.name}\n${source.name} → ${target.name}`, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#' + patch.type.color.toString(16),
            align: 'center'
        }).setOrigin(0.5);
        
        text.setDepth(94);
        
        this.scene.tweens.add({
            targets: text,
            y: midY - 30,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Screen flash
        this.scene.cameras.main.flash(300, 255, 183, 0, 0.3);
    }
    
    showPatchLimitWarning() {
        const centerX = this.scene.cameras.main.scrollX + this.scene.scale.width / 2;
        const centerY = this.scene.cameras.main.scrollY + this.scene.scale.height / 2;
        
        const text = this.scene.add.text(centerX, centerY,
            'PATCH LIMIT REACHED\nDissolve an existing patch first', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff3366',
            align: 'center'
        }).setOrigin(0.5);
        
        text.setDepth(95);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }
    
    showPatchExistsWarning() {
        const centerX = this.scene.cameras.main.scrollX + this.scene.scale.width / 2;
        const centerY = this.scene.cameras.main.scrollY + this.scene.scale.height / 2;
        
        const text = this.scene.add.text(centerX, centerY,
            'PATCH ALREADY EXISTS', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff9933'
        }).setOrigin(0.5);
        
        text.setDepth(95);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }
    
    checkEmergentBehavior(patch) {
        // Check for interesting system combinations
        const combination = [patch.source.id, patch.target.id].sort().join('|');
        
        const emergentBehaviors = {
            'echoStorm|fracture': {
                name: 'ECHO FRACTURE',
                desc: 'Ghost bullets absorb echoes while real bullets fire',
                effect: () => this.enableEchoFractureSynergy()
            },
            'paradox|singularity': {
                name: 'PARADOX SINGULARITY',
                desc: 'Predicted bullets are pulled into the gravity well',
                effect: () => this.enableParadoxSingularitySynergy()
            },
            'quantum|resonance': {
                name: 'QUANTUM CASCADE',
                desc: 'Death echoes contribute to resonance chain',
                effect: () => this.enableQuantumCascadeSynergy()
            },
            'chronoLoop|residue': {
                name: 'CHRONO RESIDUE',
                desc: 'Past echoes spawn residue nodes from their path',
                effect: () => this.enableChronoResidueSynergy()
            },
            'nemesis|observer': {
                name: 'NEMESIS SIGHT',
                desc: 'The Nemesis learns from Observer predictions',
                effect: () => this.enableNemesisSightSynergy()
            },
            'synaesthesia|rhythm': {
                name: 'RHYTHMIC SYNTHESIS',
                desc: 'Audio intensity drives all temporal systems',
                effect: () => this.enableRhythmicSynthesisSynergy()
            }
        };
        
        if (emergentBehaviors[combination] && !this.emergentBehaviors.has(combination)) {
            const behavior = emergentBehaviors[combination];
            this.emergentBehaviors.add(combination);
            behavior.effect();
            
            // Announce
            this.showEmergentBehaviorAnnouncement(behavior);
        }
    }
    
    showEmergentBehaviorAnnouncement(behavior) {
        const centerX = this.scene.cameras.main.scrollX + this.scene.scale.width / 2;
        const centerY = this.scene.cameras.main.scrollY + this.scene.scale.height / 2;
        
        const container = this.scene.add.container(centerX, centerY);
        container.setDepth(100);
        
        // Background
        const bg = this.scene.add.rectangle(0, 0, 400, 120, 0x0a0a0f, 0.95);
        bg.setStrokeStyle(2, 0xffb700);
        
        // Title
        const title = this.scene.add.text(0, -30, 'EMERGENT BEHAVIOR DISCOVERED', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffb700'
        }).setOrigin(0.5);
        
        // Name
        const name = this.scene.add.text(0, -5, behavior.name, {
            fontFamily: 'monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Description
        const desc = this.scene.add.text(0, 25, behavior.desc, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#cccccc',
            align: 'center'
        }).setOrigin(0.5);
        
        container.add([bg, title, name, desc]);
        
        // Dramatic entrance
        container.setScale(0);
        
        this.scene.tweens.add({
            targets: container,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
        
        // Exit
        this.scene.tweens.add({
            targets: container,
            alpha: 0,
            scale: 0.8,
            duration: 500,
            delay: 4000,
            ease: 'Power2',
            onComplete: () => container.destroy()
        });
        
        // Record in Architect system if available
        if (this.scene.architectSystem) {
            this.scene.architectSystem.recordEmergentDiscovery(behavior.name, behavior.desc);
        }
    }
    
    // Emergent synergy implementations
    enableEchoFractureSynergy() {
        // Ghost bullets absorb echoes
        if (this.scene.fractureSystem && this.scene.echoStorm) {
            // Hook into ghost bullet updates
            this.scene.fractureSystem.onGhostBulletUpdate = (ghost) => {
                const echoes = this.scene.echoStorm.getActiveEchoes?.() || [];
                echoes.forEach(echo => {
                    if (!echo.absorbed) {
                        const dist = Phaser.Math.Distance.Between(
                            ghost.x, ghost.y, echo.x, echo.y
                        );
                        if (dist < 40) {
                            this.scene.echoStorm.absorbEcho(echo, true);
                        }
                    }
                });
            };
        }
    }
    
    enableParadoxSingularitySynergy() {
        // Predicted bullets are pulled into singularity
        if (this.scene.paradoxEngine && this.scene.singularitySystem) {
            // Custom rendering hook
            this.scene.paradoxEngine.onPredictionUpdate = (predictions) => {
                if (this.scene.singularitySystem.singularity) {
                    const sing = this.scene.singularitySystem.singularity;
                    predictions.forEach(pred => {
                        const dist = Phaser.Math.Distance.Between(
                            pred.x, pred.y, sing.x, sing.y
                        );
                        if (dist < sing.pullRadius) {
                            // Curve prediction toward singularity
                            pred.isPulled = true;
                        }
                    });
                }
            };
        }
    }
    
    enableQuantumCascadeSynergy() {
        // Death echoes contribute to resonance
        if (this.scene.quantumImmortality && this.scene.resonanceCascade) {
            const origSpawn = this.scene.quantumImmortality.spawnQuantumEcho.bind(this.scene.quantumImmortality);
            this.scene.quantumImmortality.spawnQuantumEcho = (...args) => {
                const result = origSpawn(...args);
                this.scene.resonanceCascade.addToChain?.('QUANTUM_ECHO', 1);
                return result;
            };
        }
    }
    
    enableChronoResidueSynergy() {
        // Past echoes spawn residue nodes
        if (this.scene.chronoLoop && this.scene.temporalResidue) {
            this.scene.chronoLoop.onEchoComplete = (echo) => {
                // Spawn residue at echo's final position
                this.scene.temporalResidue.spawnNodeAt?.(echo.x, echo.y, {
                    lifespan: 15,
                    fireRate: 500,
                    color: 0x008080 // Teal residue
                });
            };
        }
    }
    
    enableNemesisSightSynergy() {
        // Nemesis learns from Observer predictions
        if (this.scene.nemesisGenesis && this.scene.observerEffect) {
            // Nemesis can anticipate predicted player positions
            this.scene.nemesisGenesis.canPredictPlayer = true;
        }
    }
    
    enableRhythmicSynthesisSynergy() {
        // Audio intensity drives temporal systems
        if (this.scene.synaesthesiaProtocol) {
            const audioIntensity = this.scene.synaesthesiaProtocol.getIntensity?.() || 0;
            
            // Scale all system cooldowns by audio intensity
            if (this.scene.fractureSystem) {
                this.scene.fractureSystem.cooldownMultiplier = 1 - (audioIntensity * 0.3);
            }
            if (this.scene.chronoLoop) {
                this.scene.chronoLoop.cooldownMultiplier = 1 - (audioIntensity * 0.3);
            }
        }
    }
    
    update(dt) {
        // Update patch energy
        this.patchEnergy = Math.min(100, this.patchEnergy + dt * 5);
        
        // Update HUD
        this.updatePatchHUD();
        
        // Update patch visuals if in patch mode
        if (this.isPatchMode) {
            this.renderActivePatches();
        }
        
        // Update emergent behavior handlers
        this.emergentBehaviors.forEach(behavior => {
            // Each behavior updates itself
        });
    }
    
    updatePatchHUD() {
        this.patchCountText.setText(`PATCHES: ${this.activePatches.size}/${this.maxPatches}`);
        
        const barWidth = (this.patchEnergy / 100) * 80;
        this.energyBar.setSize(barWidth, 6);
        this.energyBar.setPosition(-40 + barWidth / 2, 18);
    }
    
    removePatch(sourceId, targetId) {
        const patchKey = `${sourceId}|${targetId}`;
        const patch = this.activePatches.get(patchKey);
        
        if (patch && patch.handler) {
            patch.handler.cleanup();
        }
        
        this.activePatches.delete(patchKey);
        this.savePatches();
        this.updatePatchHUD();
    }
    
    savePatches() {
        const data = Array.from(this.activePatches.values()).map(p => ({
            source: p.source.id,
            target: p.target.id,
            type: p.type.name,
            createdAt: p.createdAt
        }));
        localStorage.setItem('shooty_metasystem_patches', JSON.stringify(data));
    }
    
    loadSavedPatches() {
        try {
            const saved = localStorage.getItem('shooty_metasystem_patches');
            if (saved) {
                const patches = JSON.parse(saved);
                // Note: We can't restore patches immediately as systems may not be initialized
                // Store for later restoration
                this.pendingPatches = patches;
            }
        } catch (e) {
            console.warn('Failed to load saved patches:', e);
        }
    }
    
    getActivePatches() {
        return Array.from(this.activePatches.values());
    }
    
    getEmergentBehaviors() {
        return Array.from(this.emergentBehaviors);
    }
    
    revealHUD() {
        // Called when system is unlocked
        this.patchHUD.setVisible(true);
        this.scene.tweens.add({
            targets: this.patchHUD,
            alpha: 1,
            duration: 1000
        });
    }
    
    destroy() {
        this.activePatches.forEach(patch => {
            if (patch.handler) {
                patch.handler.cleanup();
            }
        });
        this.activePatches.clear();
        
        // Note: Graphics objects are now managed by UnifiedGraphicsManager (no manual cleanup needed)
        
        this.nodeGraphics.forEach(ng => {
            ng.container.destroy();
        });
        
        if (this.patchMenuContainer) {
            this.patchMenuContainer.destroy();
        }
        
        if (this.patchHUD) {
            this.patchHUD.destroy();
        }
    }
}
