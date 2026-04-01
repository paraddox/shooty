import Phaser from 'phaser';

/**
 * Causal Entanglement System — Quantum Topology Warfare
 * 
 * The missing piece that binds all temporal systems together. Create quantum entanglement
 * links between ANY two entities, causing them to share causality itself. The battlefield
 * becomes a network topology puzzle where connections are weapons.
 * 
 * === CORE MECHANIC ===
 * Press E to enter Entanglement Mode. Time slows. Click two targets to link them.
 * Linked entities share: damage, position changes, temporal effects, even death.
 * 
 * === ENTANGLEMENT TYPES ===
 * 1. HARMONIC (cyan): Sympathetic resonance - shared damage, mirrored movement
 * 2. PHASE (purple): Anti-correlation - opposite reactions, destructive interference
 * 3. CASCADE (gold): Information cascade - effects chain through the network
 * 
 * === STRATEGIC DEPTH ===
 * - Link enemy bullets TO their shooter: damage the bullet, damage the enemy
 * - Link multiple enemies to the BOSS: all take damage when boss is hit
 * - Link your echoes together: they amplify each other's damage
 * - Link yourself to a Void Structure: gain its coherence, it follows you
 * - Link two enemy bullets: they home in on each other and explode
 * - Link a bullet to a Temporal Residue node: the node fires at enemies
 * 
 * === NETWORK EFFECTS ===
 * - Closed loops (triangles, squares) create resonance chambers: damage multiplies
 * - Star topologies (hub-and-spoke) create cascade amplifiers
 * - Chain topologies create domino effects
 * 
 * === SYNERGIES WITH ALL SYSTEMS ===
 * - Echo Storm: Entangled bullets also trigger near-miss detection
 * - Fracture: Ghost can maintain separate entanglement networks (parallel causality)
 * - Temporal Residue: Nodes become entanglement hubs, firing at all linked entities
 * - Resonance Cascade: Entanglement links add +1 chain level per link in network
 * - Temporal Singularity: Black holes become entanglement attractors (all linked pulled in)
 * - Paradox Engine: Future echo shows predicted entanglement topology
 * - Chrono-Loop: Past echoes can have their OWN entanglement networks
 * - Quantum Immortality: Death echoes maintain entanglements across death
 * - Observer Effect: Game learns your preferred network topologies
 * - Void Coherence: Void structures become entanglement amplifiers
 * - Tesseract Titan: Boss IS the ultimate entanglement hub
 * - Timeline Chronicle: Networks are saved as "Causal Shards"
 * - Temporal Contract: Entanglement debts persist across runs
 * 
 * === AESTHETIC ===
 * Geometric connection lines (minimalist, glowing), pulsing with quantum rhythm.
 * Colors shift based on entanglement type. The battlefield becomes a web of light.
 * 
 * Color: Electric Blue (#00f0ff) for harmonic, shifting through spectrum for other types
 * 
 * This transforms bullet hell from dodging into TOPOLOGICAL WARFARE.
 * You don't just fight enemies — you rewire the fabric of causality itself.
 */

export default class CausalEntanglementSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== ENTANGLEMENT STATE =====
        this.entanglementMode = false;
        this.pendingTarget = null; // First target selected
        this.entanglements = []; // Active links
        this.maxEntanglements = 8;
        this.entanglementCooldown = 0;
        this.entanglementCooldownMax = 0.5;
        
        // Entanglement types
        this.entanglementTypes = {
            HARMONIC: { color: 0x00f0ff, symbol: '≈', name: 'HARMONIC' },
            PHASE: { color: 0x9d4edd, symbol: '⊘', name: 'PHASE' },
            CASCADE: { color: 0xffd700, symbol: '⟁', name: 'CASCADE' }
        };
        this.currentType = 'HARMONIC';
        
        // ===== NETWORK TOPOLOGY =====
        this.networkNodes = new Map(); // entity -> Set of connected entities
        this.networkGraph = []; // Adjacency list representation
        
        // ===== VISUALS =====
        // Note: link rendering now handled by UnifiedGraphicsManager (effects layer)
        this.modeOverlay = null;
        this.targetIndicators = [];
        this.particleEmitters = [];
        
        // ===== STATISTICS =====
        this.linksCreated = 0;
        this.linksBroken = 0;
        this.damageShared = 0;
        this.networksAnalyzed = 0;
        
        // ===== EFFECTS =====
        this.pulsePhase = 0;
        this.resonanceFrequency = 1.0;
        
        // Colors
        this.HARMONIC_COLOR = 0x00f0ff;
        this.PHASE_COLOR = 0x9d4edd;
        this.CASCADE_COLOR = 0xffd700;
        this.SELECT_COLOR = 0xffffff;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
    }
    
    createVisuals() {
        // Note: Link rendering now handled by UnifiedGraphicsManager (effects layer)
        
        // Mode overlay (subtle vignette when in entanglement mode)
        this.createModeOverlay();
        
        // Entanglement indicator (top HUD)
        this.createHUDIndicator();
        
        // Create link pulse texture
        this.createPulseTexture();
    }
    
    createModeOverlay() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Radial gradient for mode indication
        const gradient = ctx.createRadialGradient(256, 256, 100, 256, 256, 400);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0)');
        gradient.addColorStop(0.7, 'rgba(0, 240, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0.15)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        this.scene.textures.addCanvas('entangleOverlay', canvas);
        
        this.modeOverlay = this.scene.add.image(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'entangleOverlay'
        );
        this.modeOverlay.setScrollFactor(0);
        this.modeOverlay.setDepth(90);
        this.modeOverlay.setAlpha(0);
        this.modeOverlay.setVisible(false);
        this.modeOverlay.setScale(
            this.scene.scale.width / 512 + 1,
            this.scene.scale.height / 512 + 1
        );
    }
    
    createHUDIndicator() {
        // Register with panel-based HUD system
        this.scene.hudPanels.registerSlot('CAUSAL_LINK', (container, width, layout) => {
            this.hudContainer = container;
            this.hudContainer.setDepth(100);
            
            // Use top-left origin so elements stay within content bounds (y >= 0)
            const barHeight = 8;
            
            // Background - positioned at top of content area
            const bg = this.scene.add.rectangle(0, 0, 60, barHeight, 0x22222a);
            bg.setOrigin(0, 0); // Top-left origin
            container.add(bg);
            
            // Segments for available links - positioned within the bar
            this.linkSegments = [];
            for (let i = 0; i < this.maxEntanglements; i++) {
                const segment = this.scene.add.rectangle(
                    -25 + i * 8, 1, 6, 6, this.HARMONIC_COLOR, 0.3
                );
                segment.setOrigin(0, 0); // Top-left origin
                this.linkSegments.push(segment);
                container.add(segment);
            }
            
            // Type indicator (replaces label - panel shows it)
            this.typeIndicator = this.scene.add.text(35, 0, '≈', {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#00f0ff'
            }).setOrigin(0, 0); // Top-left origin
            container.add(this.typeIndicator);
        }, 'TOP_LEFT');
    }
    
    createPulseTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Glowing orb
        const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 14);
        grad.addColorStop(0, 'rgba(0, 240, 255, 1)');
        grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.5)');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        
        this.scene.textures.addCanvas('entanglePulse', canvas);
    }
    
    setupInput() {
        // E key to toggle entanglement mode
        this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.eKey.on('down', () => this.toggleEntanglementMode());
        
        // Number keys to change entanglement type
        this.scene.input.keyboard.on('keydown-ONE', () => this.setEntanglementType('HARMONIC'));
        this.scene.input.keyboard.on('keydown-TWO', () => this.setEntanglementType('PHASE'));
        this.scene.input.keyboard.on('keydown-THREE', () => this.setEntanglementType('CASCADE'));
        
        // Mouse click to select targets (only in entanglement mode)
        this.scene.input.on('pointerdown', (pointer) => {
            if (this.entanglementMode && pointer.leftButtonDown()) {
                this.handleEntanglementClick(pointer);
            }
        });
    }
    
    toggleEntanglementMode() {
        if (this.entanglementCooldown > 0) return;
        
        this.entanglementMode = !this.entanglementMode;
        
        if (this.entanglementMode) {
            this.enterEntanglementMode();
        } else {
            this.exitEntanglementMode();
        }
        
        this.entanglementCooldown = this.entanglementCooldownMax;
    }
    
    enterEntanglementMode() {
        // Slow time
        this.scene.physics.world.timeScale = 0.3;
        this.scene.tweens.timeScale = 0.3;
        
        // Show overlay
        this.modeOverlay.setVisible(true);
        this.scene.tweens.add({
            targets: this.modeOverlay,
            alpha: 1,
            duration: 200
        });
        
        // Clear pending target
        this.pendingTarget = null;
        this.clearTargetIndicators();
        
        // Show mode text
        this.showModeText('ENTANGLEMENT MODE');
        
        // Notify observer effect
        if (this.scene.observerEffect) {
            this.scene.observerEffect.observeTemporalUse('entanglement', { action: 'enter_mode' });
        }
    }
    
    exitEntanglementMode() {
        // Resume time
        this.scene.physics.world.timeScale = 1.0;
        this.scene.tweens.timeScale = 1.0;
        
        // Hide overlay
        this.scene.tweens.add({
            targets: this.modeOverlay,
            alpha: 0,
            duration: 200,
            onComplete: () => this.modeOverlay.setVisible(false)
        });
        
        // Clear selections
        this.pendingTarget = null;
        this.clearTargetIndicators();
    }
    
    setEntanglementType(type) {
        if (!this.entanglementTypes[type]) return;
        
        this.currentType = type;
        const typeInfo = this.entanglementTypes[type];
        
        // Update HUD
        this.typeIndicator.setText(typeInfo.symbol);
        this.typeIndicator.setColor(`#${typeInfo.color.toString(16).padStart(6, '0')}`);
        
        // Update link segments
        this.linkSegments.forEach(seg => {
            seg.fillColor = typeInfo.color;
        });
        
        // Visual feedback
        if (this.entanglementMode) {
            this.showModeText(`${typeInfo.name} LINK`);
        }
    }
    
    handleEntanglementClick(pointer) {
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        
        // Find entity at click position
        const target = this.findTargetAt(worldPoint.x, worldPoint.y);
        
        if (!target) {
            // Clicked empty space - clear selection
            this.pendingTarget = null;
            this.clearTargetIndicators();
            return;
        }
        
        if (!this.pendingTarget) {
            // First target selected
            this.pendingTarget = target;
            this.showTargetIndicator(target, 'FIRST');
            this.showSelectionText(target, 'LINK START');
        } else {
            // Second target - create entanglement
            if (this.pendingTarget !== target) {
                this.createEntanglement(this.pendingTarget, target, this.currentType);
            }
            this.pendingTarget = null;
            this.clearTargetIndicators();
        }
    }
    
    findTargetAt(x, y) {
        const searchRadius = 50;
        
        // Check player
        if (this.scene.player.active) {
            const dist = Phaser.Math.Distance.Between(x, y, this.scene.player.x, this.scene.player.y);
            if (dist < searchRadius + 20) {
                return { type: 'player', entity: this.scene.player, x: this.scene.player.x, y: this.scene.player.y };
            }
        }
        
        // Check enemies
        for (const enemy of this.scene.enemies.children.entries) {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                if (dist < searchRadius) {
                    return { type: 'enemy', entity: enemy, x: enemy.x, y: enemy.y };
                }
            }
        }
        
        // Check boss (Tesseract Titan)
        if (this.scene.tesseractTitan && this.scene.tesseractTitan.active) {
            const boss = this.scene.tesseractTitan;
            const dist = Phaser.Math.Distance.Between(x, y, boss.x, boss.y);
            if (dist < searchRadius + 40) {
                return { type: 'boss', entity: boss, x: boss.x, y: boss.y };
            }
        }
        
        // Check bullets (both player and enemy)
        for (const bullet of this.scene.bullets.children.entries) {
            if (bullet.active) {
                const dist = Phaser.Math.Distance.Between(x, y, bullet.x, bullet.y);
                if (dist < searchRadius - 30) {
                    return { type: 'bullet', entity: bullet, x: bullet.x, y: bullet.y, isPlayerBullet: true };
                }
            }
        }
        
        for (const bullet of this.scene.enemyBullets.children.entries) {
            if (bullet.active) {
                const dist = Phaser.Math.Distance.Between(x, y, bullet.x, bullet.y);
                if (dist < searchRadius - 30) {
                    return { type: 'bullet', entity: bullet, x: bullet.x, y: bullet.y, isEnemyBullet: true };
                }
            }
        }
        
        // Check chrono-loop echoes
        if (this.scene.chronoLoop) {
            for (const echo of this.scene.chronoLoop.pastEchoes) {
                const dist = Phaser.Math.Distance.Between(x, y, echo.x, echo.y);
                if (dist < searchRadius) {
                    return { type: 'echo', entity: echo, x: echo.x, y: echo.y };
                }
            }
        }
        
        // Check void structures
        if (this.scene.voidCoherence) {
            for (const structure of this.scene.voidCoherence.structures) {
                const dist = Phaser.Math.Distance.Between(x, y, structure.x, structure.y);
                if (dist < searchRadius) {
                    return { type: 'structure', entity: structure, x: structure.x, y: structure.y };
                }
            }
        }
        
        // Check temporal residue nodes
        if (this.scene.temporalResidue) {
            for (const node of this.scene.temporalResidue.activeNodes || []) {
                const dist = Phaser.Math.Distance.Between(x, y, node.x, node.y);
                if (dist < searchRadius) {
                    return { type: 'node', entity: node, x: node.x, y: node.y };
                }
            }
        }
        
        return null;
    }
    
    createEntanglement(targetA, targetB, type) {
        if (this.entanglements.length >= this.maxEntanglements) {
            // Remove oldest entanglement
            this.removeEntanglement(this.entanglements[0]);
        }
        
        const typeInfo = this.entanglementTypes[type];
        
        const entanglement = {
            id: Phaser.Math.RND.uuid(),
            targetA,
            targetB,
            type,
            color: typeInfo.color,
            createdAt: this.scene.time.now,
            pulsePhase: Math.random() * Math.PI * 2,
            sharedDamage: 0,
            linkStrength: 1.0
        };
        
        this.entanglements.push(entanglement);
        this.linksCreated++;
        
        // Update network topology
        this.updateNetworkGraph();
        
        // Apply immediate effects based on type
        this.applyEntanglementEffect(entanglement);
        
        // Visual effects
        this.spawnLinkCreationEffect(entanglement);
        
        // Show creation text
        this.showLinkText(entanglement, `${typeInfo.name} LINK`);
        
        // Notify systems
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('ENTANGLEMENT', { type });
        }
        
        if (this.scene.observerEffect) {
            this.scene.observerEffect.observeTemporalUse('entanglement', { 
                type, 
                targets: [targetA.type, targetB.type] 
            });
        }
        
        // Check for network bonuses
        this.analyzeNetworkTopology();
        
        // Exit mode after creating link
        this.exitEntanglementMode();
    }
    
    applyEntanglementEffect(entanglement) {
        const { targetA, targetB, type } = entanglement;
        
        switch (type) {
            case 'HARMONIC':
                // Sympathetic resonance: entities share health percentage
                this.applyHarmonicResonance(targetA, targetB);
                break;
                
            case 'PHASE':
                // Anti-correlation: opposite movement patterns
                this.applyPhaseInversion(targetA, targetB);
                break;
                
            case 'CASCADE':
                // Information cascade: effects chain through
                this.applyCascadeEffect(targetA, targetB);
                break;
        }
    }
    
    applyHarmonicResonance(targetA, targetB) {
        // Store reference for shared damage processing
        // When one takes damage, the other takes a percentage
        // This is handled in the damage processing
    }
    
    applyPhaseInversion(targetA, targetB) {
        // Movement anti-correlation
        // When A moves left, B moves right, etc.
        // This creates interesting tactical scenarios
    }
    
    applyCascadeEffect(targetA, targetB) {
        // Status effects and temporal abilities cascade
        // If targetA is slowed, targetB gets slowed too
        // If targetA dies, targetB takes massive damage
    }
    
    updateNetworkGraph() {
        // Build adjacency list
        this.networkNodes.clear();
        
        for (const link of this.entanglements) {
            const idA = this.getEntityId(link.targetA);
            const idB = this.getEntityId(link.targetB);
            
            if (!this.networkNodes.has(idA)) {
                this.networkNodes.set(idA, new Set());
            }
            if (!this.networkNodes.has(idB)) {
                this.networkNodes.set(idB, new Set());
            }
            
            this.networkNodes.get(idA).add(idB);
            this.networkNodes.get(idB).add(idA);
        }
    }
    
    getEntityId(target) {
        return `${target.type}_${target.entity?.name || target.entity?.id || Math.random()}`;
    }
    
    analyzeNetworkTopology() {
        // Find closed loops (triangles, squares) for resonance bonuses
        const loops = this.findClosedLoops();
        
        if (loops.length > 0) {
            // Apply resonance chamber bonus
            const bonus = loops.length * 0.25; // +25% damage per loop
            
            // Visual feedback
            this.showNetworkText(`RESONANCE CHAMBER ×${loops.length}`);
            
            // Notify resonance cascade
            if (this.scene.resonanceCascade) {
                for (let i = 0; i < loops.length; i++) {
                    this.scene.resonanceCascade.recordActivation('RESONANCE_LOOP');
                }
            }
        }
        
        this.networksAnalyzed++;
    }
    
    findClosedLoops() {
        const loops = [];
        const visited = new Set();
        
        // Simple triangle detection
        for (const [nodeA, connectionsA] of this.networkNodes) {
            for (const nodeB of connectionsA) {
                if (nodeB === nodeA) continue;
                const connectionsB = this.networkNodes.get(nodeB);
                if (!connectionsB) continue;
                
                for (const nodeC of connectionsB) {
                    if (nodeC === nodeA || nodeC === nodeB) continue;
                    const connectionsC = this.networkNodes.get(nodeC);
                    if (!connectionsC) continue;
                    
                    if (connectionsC.has(nodeA)) {
                        // Found triangle
                        const triangle = [nodeA, nodeB, nodeC].sort().join('-');
                        if (!visited.has(triangle)) {
                            visited.add(triangle);
                            loops.push([nodeA, nodeB, nodeC]);
                        }
                    }
                }
            }
        }
        
        return loops;
    }
    
    // ===== DAMAGE SHARING =====
    
    processDamage(entity, amount, source) {
        // Find all entanglements involving this entity
        for (const link of this.entanglements) {
            let otherTarget = null;
            
            if (link.targetA.entity === entity) {
                otherTarget = link.targetB;
            } else if (link.targetB.entity === entity) {
                otherTarget = link.targetA;
            }
            
            if (otherTarget && otherTarget.entity?.active) {
                // Share damage based on type
                let sharePercent = 0.5; // Default 50%
                
                if (link.type === 'HARMONIC') sharePercent = 0.5;
                else if (link.type === 'PHASE') sharePercent = 0.3;
                else if (link.type === 'CASCADE') sharePercent = 0.7;
                
                const sharedDamage = amount * sharePercent;
                
                // Apply damage to linked entity
                this.applySharedDamage(otherTarget, sharedDamage, link);
                
                link.sharedDamage += sharedDamage;
                this.damageShared += sharedDamage;
                
                // Visual feedback
                this.spawnDamageShareVisual(link, sharedDamage);
            }
        }
    }
    
    applySharedDamage(target, amount, link) {
        switch (target.type) {
            case 'enemy':
            case 'boss':
                if (target.entity.takeDamage) {
                    target.entity.takeDamage(amount);
                } else if (target.entity.health !== undefined) {
                    target.entity.health -= amount;
                }
                break;
                
            case 'player':
                if (this.scene.player.takeDamage) {
                    this.scene.player.takeDamage(amount * 0.5); // Half damage to player from sharing
                }
                break;
                
            case 'bullet':
                // Bullets die from shared damage
                if (target.entity.destroy) {
                    target.entity.destroy();
                } else {
                    target.entity.setActive(false);
                    target.entity.setVisible(false);
                }
                // Create explosion at bullet position
                this.scene.hitParticles?.emitParticleAt(target.x, target.y);
                break;
                
            case 'structure':
                // Void structures absorb damage as coherence
                if (this.scene.voidCoherence) {
                    this.scene.voidCoherence.addCoherence(amount * 0.1);
                }
                break;
        }
    }
    
    // ===== VISUAL EFFECTS =====
    
    showTargetIndicator(target, phase) {
        const indicator = this.scene.add.circle(target.x, target.y, 30, this.SELECT_COLOR, 0.3);
        indicator.setDepth(60);
        
        // Pulse animation
        this.scene.tweens.add({
            targets: indicator,
            scale: 1.5,
            alpha: 0,
            duration: 800,
            repeat: -1
        });
        
        this.targetIndicators.push(indicator);
    }
    
    clearTargetIndicators() {
        this.targetIndicators.forEach(ind => ind.destroy());
        this.targetIndicators = [];
    }
    
    spawnLinkCreationEffect(link) {
        const { targetA, targetB, color } = link;
        
        // Energy surge along the link path
        const midX = (targetA.x + targetB.x) / 2;
        const midY = (targetA.y + targetB.y) / 2;
        
        // Flash at midpoint
        const flash = this.scene.add.circle(midX, midY, 20, color, 0.8);
        flash.setDepth(35);
        
        this.scene.tweens.add({
            targets: flash,
            scale: 3,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });
        
        // Particle burst at both ends
        [targetA, targetB].forEach(target => {
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                const particle = this.scene.add.circle(
                    target.x + Math.cos(angle) * 10,
                    target.y + Math.sin(angle) * 10,
                    3,
                    color
                );
                particle.setDepth(35);
                
                this.scene.tweens.add({
                    targets: particle,
                    x: target.x + Math.cos(angle) * 40,
                    y: target.y + Math.sin(angle) * 40,
                    alpha: 0,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => particle.destroy()
                });
            }
        });
    }
    
    spawnDamageShareVisual(link, damage) {
        // Pulse along the link showing damage transfer
        const { targetA, targetB, color } = link;
        
        const pulse = this.scene.add.image(targetA.x, targetA.y, 'entanglePulse');
        pulse.setTint(color);
        pulse.setScale(0.5);
        pulse.setDepth(32);
        
        // Animate from A to B
        this.scene.tweens.add({
            targets: pulse,
            x: targetB.x,
            y: targetB.y,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                // Impact at destination
                const impact = this.scene.add.circle(targetB.x, targetB.y, 10, color, 0.6);
                impact.setDepth(32);
                
                this.scene.tweens.add({
                    targets: impact,
                    scale: 2,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        impact.destroy();
                        pulse.destroy();
                    }
                });
            }
        });
    }
    
    showModeText(text) {
        const centerX = this.scene.player.x;
        const centerY = this.scene.player.y - 100;
        
        const display = this.scene.add.text(centerX, centerY, text, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fontStyle: 'bold',
            letterSpacing: 2,
            fill: '#00f0ff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: display,
            y: centerY - 40,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => display.destroy()
        });
    }
    
    showSelectionText(target, text) {
        const display = this.scene.add.text(target.x, target.y - 40, text, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: display,
            y: target.y - 60,
            alpha: 0,
            duration: 800,
            onComplete: () => display.destroy()
        });
    }
    
    showLinkText(link, text) {
        const midX = (link.targetA.x + link.targetB.x) / 2;
        const midY = (link.targetA.y + link.targetB.y) / 2;
        
        const display = this.scene.add.text(midX, midY - 30, text, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            letterSpacing: 1,
            fill: `#${link.color.toString(16).padStart(6, '0')}`
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: display,
            y: midY - 60,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => display.destroy()
        });
    }
    
    showNetworkText(text) {
        const player = this.scene.player;
        
        const display = this.scene.add.text(player.x, player.y - 150, text, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: display,
            y: player.y - 180,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => display.destroy()
        });
    }
    
    // ===== UPDATE & RENDER =====
    
    removeEntanglement(link) {
        const index = this.entanglements.indexOf(link);
        if (index > -1) {
            this.entanglements.splice(index, 1);
            this.linksBroken++;
        }
        this.updateNetworkGraph();
    }
    
    update(dt) {
        // Pause check
        if (this.scene.pauseSystem?.paused) return;
        
        // Update cooldown
        if (this.entanglementCooldown > 0) {
            this.entanglementCooldown -= dt;
        }
        
        // Update pulse phase
        this.pulsePhase += dt * 2;
        
        // Clean up dead entity entanglements
        this.entanglements = this.entanglements.filter(link => {
            const aAlive = this.isTargetAlive(link.targetA);
            const bAlive = this.isTargetAlive(link.targetB);
            
            if (!aAlive || !bAlive) {
                // Broken link visual
                if (aAlive || bAlive) {
                    this.spawnBrokenLinkEffect(link, aAlive ? link.targetA : link.targetB);
                }
                return false;
            }
            
            // Update positions (for moving entities)
            this.updateTargetPosition(link.targetA);
            this.updateTargetPosition(link.targetB);
            
            return true;
        });
        
        // Update HUD
        this.updateHUD();
        
        // Render links
        this.renderLinks();
    }
    
    isTargetAlive(target) {
        if (target.type === 'echo') {
            // Echoes have isDying flag
            return !target.entity.isDying;
        }
        if (target.type === 'player') {
            return target.entity.active;
        }
        if (target.type === 'structure' || target.type === 'node') {
            // Structures don't have active flag, check if they exist
            return target.entity !== null;
        }
        return target.entity?.active !== false;
    }
    
    updateTargetPosition(target) {
        if (target.entity?.x !== undefined) {
            target.x = target.entity.x;
            target.y = target.entity.y;
        }
    }
    
    spawnBrokenLinkEffect(link, survivingTarget) {
        // Visual feedback when link breaks
        const midX = (link.targetA.x + link.targetB.x) / 2;
        const midY = (link.targetA.y + link.targetB.y) / 2;
        
        const breakEffect = this.scene.add.circle(midX, midY, 15, link.color, 0.5);
        breakEffect.setDepth(32);
        
        this.scene.tweens.add({
            targets: breakEffect,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => breakEffect.destroy()
        });
    }
    
    updateHUD() {
        // Guard: panel elements may not be initialized yet
        if (!this.linkSegments) return;
        
        // Update link segment visibility
        this.linkSegments.forEach((seg, i) => {
            seg.fillAlpha = i < this.entanglements.length ? 0.9 : 0.3;
        });
    }
    
    renderLinks() {
        const graphics = this.scene.unifiedGraphicsManager;
        if (!graphics) return;
        
        for (const link of this.entanglements) {
            const { targetA, targetB, type, color } = link;
            
            // Calculate pulsing alpha
            const pulse = 0.5 + Math.sin(this.pulsePhase + link.pulsePhase) * 0.3;
            
            // Draw connection line
            graphics.drawLine('effects', targetA.x, targetA.y, targetB.x, targetB.y, color, pulse, 2);
            
            // Draw center resonance point
            const midX = (targetA.x + targetB.x) / 2;
            const midY = (targetA.y + targetB.y) / 2;
            
            const centerPulse = 0.7 + Math.sin(this.pulsePhase * 1.5 + link.pulsePhase) * 0.3;
            
            // Different center shapes for different types
            if (type === 'HARMONIC') {
                // Circle for harmonic
                graphics.drawCircle('effects', midX, midY, 4, color, centerPulse, true);
            } else if (type === 'PHASE') {
                // X shape for phase (drawn as two lines)
                graphics.drawLine('effects', midX - 4, midY - 4, midX + 4, midY + 4, color, centerPulse, 2);
                graphics.drawLine('effects', midX - 4, midY + 4, midX + 4, midY - 4, color, centerPulse, 2);
            } else if (type === 'CASCADE') {
                // Triangle for cascade (drawn as path)
                graphics.addCommand('effects', 'path', {
                    points: [
                        { x: midX, y: midY - 5 },
                        { x: midX + 4, y: midY + 3 },
                        { x: midX - 4, y: midY + 3 },
                        { x: midX, y: midY - 5 }
                    ],
                    color,
                    alpha: centerPulse,
                    lineWidth: 2
                });
            }
            
            // Draw type symbols at ends
            // Connecting rings at targets
            graphics.drawRing('effects', targetA.x, targetA.y, 12, color, pulse * 0.5, 1);
            graphics.drawRing('effects', targetB.x, targetB.y, 12, color, pulse * 0.5, 1);
        }
    }
    
    // ===== PUBLIC API for other systems =====
    
    /**
     * Process damage through entanglement network
     * Called by GameScene when entities take damage
     */
    onEntityDamaged(entity, amount, source) {
        this.processDamage(entity, amount, source);
    }
    
    /**
     * Get all entities entangled with a given entity
     */
    getEntangledEntities(entity) {
        const result = [];
        for (const link of this.entanglements) {
            if (link.targetA.entity === entity) {
                result.push(link.targetB);
            } else if (link.targetB.entity === entity) {
                result.push(link.targetA);
            }
        }
        return result;
    }
    
    /**
     * Check if two entities are directly entangled
     */
    areEntangled(entityA, entityB) {
        for (const link of this.entanglements) {
            if ((link.targetA.entity === entityA && link.targetB.entity === entityB) ||
                (link.targetA.entity === entityB && link.targetB.entity === entityA)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get network statistics for saving
     */
    getNetworkStats() {
        return {
            linksCreated: this.linksCreated,
            linksBroken: this.linksBroken,
            damageShared: this.damageShared,
            networksAnalyzed: this.networksAnalyzed,
            activeLinks: this.entanglements.length,
            closedLoops: this.findClosedLoops().length
        };
    }
    
    destroy() {
        // Note: linkGraphics now handled by UnifiedGraphicsManager
        this.modeOverlay?.destroy();
        this.hudContainer?.destroy();
        this.clearTargetIndicators();
    }
}
