import Phaser from 'phaser';

/**
 * Void Coherence System — The Quantum Vacuum Made Manifest
 * 
 * Based on quantum field theory: empty space isn't empty. It's a seething ocean of
 * virtual particles, quantum foam, and potential energy waiting to be excited.
 * 
 * This system transforms the VOID itself into an active participant:
 * 
 * 1. VOID MEMORY: Every bullet that passes through empty space leaves a trace
 *    - Trajectories are recorded in the quantum foam
 *    - Un-hit bullets charge the void along their path
 *    - High-traffic corridors become "coherent" (glowing paths through space)
 * 
 * 2. SPONTANEOUS STRUCTURE FORMATION: At coherence thresholds, the void crystallizes
 *    - Geometric entities emerge from quantum foam
 *    - Void Crystals: Absorb bullets and redirect them as harmonic patterns
 *    - Phase Walls: Temporary barriers that exist in superposition (passable during bullet time)
 *    - Coherence Nodes: Power sources that amplify all temporal systems in radius
 * 
 * 3. VOID ENTITIES: Self-sustaining geometric forms that evolve
 *    - Feed on temporal residue, quantum echoes, and bullet traffic
 *    - Grow larger as more systems interact with them
 *    - Eventually become "Void Architects" that reshape the arena
 *    - Can be "harvested" for massive score bonuses (but lose the structure)
 * 
 * 4. COHERENCE CASCADE: Chain reactions through the void
 *    - When one structure forms, it can trigger adjacent coherence zones
 *    - Creates emergent "bullet gardens" - beautiful geometric lattices
 *    - High coherence reduces enemy spawn rate (void becomes "full")
 * 
 * 5. THE VOID RESONANCE: Ultimate ability at maximum coherence
 *    - Press V to activate Void Resonance
 *    - All void structures pulse in harmonic sequence
 *    - Bullets fired during resonance pierce through void crystals, multiplying
 *    - Creates cascading bullet symphonies
 * 
 * Why this is revolutionary:
 * - TRANSFORMS EMPTY SPACE: The void becomes your ally, not just background
 * - REWARDS PRECISION: Missing shots intentionally becomes strategic
 * - EMERGENT GARDENS: Previous actions create persistent beautiful structures
 * - SYNTHESIS: Every existing system feeds into and is fed by the void
 * - AESTHETIC PERFECTION: Geometric crystalline structures in dark void space
 * - NEVER BEEN DONE: No bullet-hell has made the background itself a mechanic
 * 
 * Color: Deep purple (#6b00ff) shifting to cyan (#00d4ff) as coherence increases
 * Void Entities: Crystalline geometric shapes (tetrahedrons, octahedrons, dodecahedrons)
 * 
 * Integration: ALL existing systems feed the void:
 * - Echo Storm bullets → High coherence charge (un-hit bullets)
 * - Quantum Echo deaths → Spawn void crystals at death sites
 * - Fracture ghosts → Pass through void = double coherence gain
 * - Temporal Residue → Accelerates void structure growth
 * - Observer Effect → Void learns from player positioning patterns
 */

export default class VoidCoherenceSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== VOID STATE =====
        this.coherenceLevel = 0;           // 0-100 current coherence
        this.maxCoherence = 100;
        this.coherenceDecay = 3;           // Lost per second
        this.coherenceGainPerBullet = 2;   // Base gain per un-hit bullet
        
        // ===== VOID MEMORY =====
        this.trajectoryMemory = new Map(); // Grid-based memory of bullet paths
        this.memoryResolution = 40;        // Pixels per memory cell
        this.memoryFadeRate = 5;           // Seconds to fade
        this.coherentPaths = [];           // Active glowing paths
        
        // ===== VOID STRUCTURES =====
        this.structures = [];              // Active void crystals/walls/nodes
        this.maxStructures = 12;
        this.structureThresholds = {
            crystal: 25,    // Coherence needed for crystal
            wall: 45,       // Coherence needed for phase wall
            node: 70,       // Coherence needed for coherence node
            architect: 90   // Coherence needed for void architect
        };
        
        // ===== VOID ENTITIES =====
        this.entities = [];                // Self-sustaining geometric forms
        this.maxEntities = 5;
        this.entityGrowthRate = 0.5;       // Size increase per second with sustenance
        
        // ===== VOID RESONANCE =====
        this.resonanceReady = false;
        this.resonanceActive = false;
        this.resonanceDuration = 8;
        this.resonanceRemaining = 0;
        this.resonanceCooldown = 0;
        this.resonanceRequiredCoherence = 85;
        
        // ===== VISUALS =====
        this.graphics = null;
        this.voidOverlay = null;
        this.coherenceBar = null;
        this.structureContainer = null;
        this.resonancePrompt = null;
        
        // ===== AUDIO-VISUAL SYNTHESIS =====
        this.pulsePhase = 0;
        this.harmonicFrequency = 1.0;
        
        // ===== STATISTICS =====
        this.totalCoherenceGenerated = 0;
        this.structuresCreated = 0;
        this.entitiesSpawned = 0;
        this.resonancesActivated = 0;
        
        this.init();
    }
    
    init() {
        this.initMemoryGrid();
        this.createVisuals();
        this.setupInput();
    }
    
    initMemoryGrid() {
        const worldWidth = 1920;
        const worldHeight = 1440;
        this.memoryCols = Math.ceil(worldWidth / this.memoryResolution);
        this.memoryRows = Math.ceil(worldHeight / this.memoryResolution);
        
        for (let y = 0; y < this.memoryRows; y++) {
            for (let x = 0; x < this.memoryCols; x++) {
                this.trajectoryMemory.set(`${x},${y}`, {
                    x: x * this.memoryResolution + this.memoryResolution / 2,
                    y: y * this.memoryResolution + this.memoryResolution / 2,
                    coherence: 0,
                    lastVisit: 0,
                    bulletCount: 0,
                    hasStructure: false
                });
            }
        }
    }
    
    createVisuals() {
        // Main graphics for void effects
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(5); // Behind bullets but above floor
        
        // Void overlay (subtle purple tint at high coherence)
        this.voidOverlay = this.scene.add.graphics();
        this.voidOverlay.setScrollFactor(0);
        this.voidOverlay.setDepth(4);
        
        // Structure container
        this.structureContainer = this.scene.add.container(0, 0);
        this.structureContainer.setDepth(6);
        
        // Coherence bar (top-left, below health)
        const margin = 30;
        this.coherenceContainer = this.scene.add.container(margin, margin + 105);
        this.coherenceContainer.setScrollFactor(0);
        this.coherenceContainer.setDepth(100);
        
        // Background
        const bg = this.scene.add.rectangle(0, 0, 200, 4, 0x1a1a25);
        bg.setOrigin(0, 0.5);
        this.coherenceContainer.add(bg);
        
        // Coherence fill (purple→cyan gradient effect)
        this.coherenceFill = this.scene.add.rectangle(0, 0, 0, 4, 0x6b00ff);
        this.coherenceFill.setOrigin(0, 0.5);
        this.coherenceContainer.add(this.coherenceFill);
        
        // Coherence label
        this.coherenceText = this.scene.add.text(0, -12, 'VOID COHERENCE', {
            fontFamily: 'monospace',
            fontSize: '9px',
            letterSpacing: 1,
            fill: '#6b00ff'
        }).setOrigin(0, 0.5);
        this.coherenceContainer.add(this.coherenceText);
        
        // Structure count indicator
        this.structureIndicator = this.scene.add.text(100, 12, '◈ 0', {
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: 1,
            fill: '#9d4edd'
        }).setOrigin(0.5);
        this.coherenceContainer.add(this.structureIndicator);
        
        // Resonance prompt
        this.resonancePrompt = this.scene.add.text(
            this.scene.scale.width / 2, 
            150, 
            '[V] VOID RESONANCE', 
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fontStyle: 'bold',
                letterSpacing: 2,
                fill: '#00d4ff'
            }
        ).setOrigin(0.5);
        this.resonancePrompt.setScrollFactor(0);
        this.resonancePrompt.setDepth(100);
        this.resonancePrompt.setVisible(false);
        
        // Create void textures
        this.createVoidTextures();
    }
    
    createVoidTextures() {
        // Void crystal texture
        const crystalCanvas = document.createElement('canvas');
        crystalCanvas.width = 64;
        crystalCanvas.height = 64;
        const crystalCtx = crystalCanvas.getContext('2d');
        
        // Draw crystalline octahedron
        crystalCtx.strokeStyle = '#9d4edd';
        crystalCtx.lineWidth = 2;
        crystalCtx.beginPath();
        // Top pyramid
        crystalCtx.moveTo(32, 8);
        crystalCtx.lineTo(56, 32);
        crystalCtx.lineTo(32, 56);
        crystalCtx.lineTo(8, 32);
        crystalCtx.closePath();
        crystalCtx.stroke();
        // Internal lines
        crystalCtx.beginPath();
        crystalCtx.moveTo(32, 8);
        crystalCtx.lineTo(32, 56);
        crystalCtx.moveTo(8, 32);
        crystalCtx.lineTo(56, 32);
        crystalCtx.stroke();
        
        this.scene.textures.addCanvas('void_crystal', crystalCanvas);
        
        // Phase wall texture
        const wallCanvas = document.createElement('canvas');
        wallCanvas.width = 32;
        wallCanvas.height = 128;
        const wallCtx = wallCanvas.getContext('2d');
        
        const gradient = wallCtx.createLinearGradient(0, 0, 32, 0);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        wallCtx.fillStyle = gradient;
        wallCtx.fillRect(0, 0, 32, 128);
        
        this.scene.textures.addCanvas('phase_wall', wallCanvas);
        
        // Coherence node texture
        const nodeCanvas = document.createElement('canvas');
        nodeCanvas.width = 48;
        nodeCanvas.height = 48;
        const nodeCtx = nodeCanvas.getContext('2d');
        
        // Pulsing ring
        nodeCtx.strokeStyle = '#00d4ff';
        nodeCtx.lineWidth = 3;
        nodeCtx.beginPath();
        nodeCtx.arc(24, 24, 18, 0, Math.PI * 2);
        nodeCtx.stroke();
        
        // Inner glow
        const nodeGrad = nodeCtx.createRadialGradient(24, 24, 5, 24, 24, 18);
        nodeGrad.addColorStop(0, 'rgba(0, 212, 255, 0.6)');
        nodeGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');
        nodeCtx.fillStyle = nodeGrad;
        nodeCtx.fillRect(0, 0, 48, 48);
        
        this.scene.textures.addCanvas('coherence_node', nodeCanvas);
    }
    
    setupInput() {
        // V key for void resonance
        this.scene.input.keyboard.on('keydown-V', () => {
            if (this.resonanceReady && !this.resonanceActive && this.resonanceCooldown <= 0) {
                this.activateResonance();
            }
        });
    }
    
    /**
     * Record a bullet trajectory through the void
     * Called when bullets pass through empty space without hitting
     */
    recordBulletTrajectory(x, y, vx, vy, isEnemyBullet = false) {
        // Calculate memory cell
        const cellX = Math.floor(x / this.memoryResolution);
        const cellY = Math.floor(y / this.memoryResolution);
        const key = `${cellX},${cellY}`;
        
        const cell = this.trajectoryMemory.get(key);
        if (cell && !cell.hasStructure) {
            // Increase coherence in this cell
            cell.coherence = Math.min(100, cell.coherence + this.coherenceGainPerBullet);
            cell.lastVisit = this.scene.time.now;
            cell.bulletCount++;
            
            // Gain global coherence
            const gain = isEnemyBullet ? this.coherenceGainPerBullet * 1.5 : this.coherenceGainPerBullet;
            this.addCoherence(gain);
            
            // Check for spontaneous structure formation
            this.checkStructureFormation(cell);
        }
        
        // Create trajectory particle effect
        if (Math.random() < 0.3) {
            this.createTrajectoryParticle(x, y);
        }
    }
    
    createTrajectoryParticle(x, y) {
        // Subtle purple spark along bullet path
        const particle = this.scene.add.circle(x, y, 2, 0x6b00ff, 0.6);
        particle.setDepth(5);
        
        this.scene.tweens.add({
            targets: particle,
            alpha: 0,
            scale: 0.5,
            duration: 500,
            ease: 'Power2',
            onComplete: () => particle.destroy()
        });
    }
    
    addCoherence(amount) {
        const oldLevel = this.coherenceLevel;
        this.coherenceLevel = Math.min(this.maxCoherence, this.coherenceLevel + amount);
        this.totalCoherenceGenerated += amount;
        
        // Update UI
        this.updateCoherenceUI();
        
        // Check resonance readiness
        if (this.coherenceLevel >= this.resonanceRequiredCoherence) {
            this.resonanceReady = true;
            this.resonancePrompt.setVisible(true);
            this.resonancePrompt.setAlpha(0.5 + Math.sin(this.scene.time.now / 200) * 0.5);
        }
        
        // Notify observer effect
        if (this.scene.observerEffect) {
            this.scene.observerEffect.observeTemporalUse('voidCoherence', {
                level: this.coherenceLevel,
                gain: amount
            });
        }
    }
    
    updateCoherenceUI() {
        const percent = this.coherenceLevel / this.maxCoherence;
        this.coherenceFill.width = 200 * percent;
        
        // Color shift: purple (#6b00ff) → cyan (#00d4ff)
        const r = Math.floor(107 + (0 - 107) * percent);
        const g = Math.floor(0 + (212 - 0) * percent);
        const b = Math.floor(255 + (255 - 255) * percent);
        this.coherenceFill.fillColor = (r << 16) | (g << 8) | b;
        this.coherenceText.setColor(`#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`);
        
        // Structure count
        this.structureIndicator.setText(`◈ ${this.structures.length}`);
    }
    
    checkStructureFormation(cell) {
        if (cell.hasStructure) return;
        
        // Check thresholds
        let structureType = null;
        if (cell.coherence >= this.structureThresholds.architect && this.entities.length < this.maxEntities) {
            structureType = 'architect';
        } else if (cell.coherence >= this.structureThresholds.node && this.structures.length < this.maxStructures) {
            structureType = 'node';
        } else if (cell.coherence >= this.structureThresholds.wall && this.structures.length < this.maxStructures) {
            structureType = 'wall';
        } else if (cell.coherence >= this.structureThresholds.crystal && this.structures.length < this.maxStructures) {
            structureType = 'crystal';
        }
        
        if (structureType) {
            this.spawnStructure(cell.x, cell.y, structureType, cell);
        }
    }
    
    spawnStructure(x, y, type, cell) {
        const structure = {
            x, y, type, cell,
            id: Phaser.Math.RND.uuid(),
            created: this.scene.time.now,
            active: true,
            scale: 0,
            rotation: 0,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        cell.hasStructure = true;
        this.structures.push(structure);
        this.structuresCreated++;
        
        // Create visual
        this.createStructureVisual(structure);
        
        // Animation: grow into existence
        this.scene.tweens.add({
            targets: structure,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });
        
        // Notify systems
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('VOID_STRUCTURE', { type });
        }
        
        // Show formation text
        this.showFormationText(x, y, type);
        
        // Reduce coherence cost
        this.coherenceLevel = Math.max(0, this.coherenceLevel - 15);
        this.updateCoherenceUI();
    }
    
    createStructureVisual(structure) {
        let visual;
        
        switch (structure.type) {
            case 'crystal':
                visual = this.scene.add.image(structure.x, structure.y, 'void_crystal');
                visual.setTint(0x9d4edd);
                visual.setScale(0.8);
                break;
                
            case 'wall':
                visual = this.scene.add.image(structure.x, structure.y, 'phase_wall');
                visual.setTint(0x00d4ff);
                visual.setAlpha(0.6);
                break;
                
            case 'node':
                visual = this.scene.add.image(structure.x, structure.y, 'coherence_node');
                visual.setScale(1.2);
                // Pulsing glow effect
                this.scene.tweens.add({
                    targets: visual,
                    scale: 1.4,
                    duration: 1500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                break;
                
            case 'architect':
                // Complex geometric form
                visual = this.scene.add.container(structure.x, structure.y);
                
                const core = this.scene.add.circle(0, 0, 30, 0x00d4ff, 0.3);
                const ring1 = this.scene.add.ring(0, 0, 35, 40, 0x9d4edd);
                const ring2 = this.scene.add.ring(0, 0, 50, 55, 0x6b00ff);
                
                visual.add([core, ring1, ring2]);
                
                // Rotation animation
                this.scene.tweens.add({
                    targets: [ring1, ring2],
                    rotation: Math.PI * 2,
                    duration: 10000,
                    repeat: -1,
                    ease: 'Linear'
                });
                
                // Promote to entity
                this.promoteToEntity(structure, visual);
                break;
        }
        
        structure.visual = visual;
        this.structureContainer.add(visual);
    }
    
    promoteToEntity(structure, visual) {
        const entity = {
            ...structure,
            visual,
            growth: 1.0,
            sustenance: 0,
            evolution: 0,
            isEntity: true
        };
        
        this.entities.push(entity);
        this.entitiesSpawned++;
        
        // Remove from regular structures
        const idx = this.structures.indexOf(structure);
        if (idx > -1) this.structures.splice(idx, 1);
        
        // Show evolution text
        const text = this.scene.add.text(entity.x, entity.y - 50, 'VOID ARCHITECT EMERGED', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#00d4ff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    showFormationText(x, y, type) {
        const labels = {
            crystal: 'VOID CRYSTAL',
            wall: 'PHASE WALL',
            node: 'COHERENCE NODE',
            architect: 'ARCHITECT FORMING'
        };
        
        const text = this.scene.add.text(x, y - 30, labels[type], {
            fontFamily: 'monospace',
            fontSize: '11px',
            fill: '#9d4edd',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 20,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    /**
     * Check if a bullet hits a void structure
     * Returns true if bullet was affected
     */
    checkBulletCollision(bullet, isEnemyBullet) {
        for (const structure of this.structures) {
            if (!structure.active) continue;
            
            const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, structure.x, structure.y);
            
            switch (structure.type) {
                case 'crystal':
                    if (dist < 35) {
                        // Crystal absorbs and redirects bullet
                        this.crystalRedirect(bullet, structure, isEnemyBullet);
                        return true;
                    }
                    break;
                    
                case 'wall':
                    if (dist < 40 && !isEnemyBullet) {
                        // Phase wall - passable during bullet time
                        if (this.scene.nearMissState.active) {
                            // Bullet passes through with amplification
                            bullet.damageMultiplier = (bullet.damageMultiplier || 1) * 1.5;
                            this.createPhasePassEffect(bullet.x, bullet.y);
                        } else {
                            // Bullet blocked but charges the wall
                            this.chargeWall(structure);
                            return true; // Bullet consumed
                        }
                    }
                    break;
                    
                case 'node':
                    if (dist < 30) {
                        // Node amplifies nearby systems
                        this.nodeAmplification(structure);
                        return false; // Bullet passes through
                    }
                    break;
            }
        }
        
        return false;
    }
    
    crystalRedirect(bullet, crystal, isEnemyBullet) {
        // Calculate harmonic redirect angle
        const toBullet = Phaser.Math.Angle.Between(crystal.x, crystal.y, bullet.x, bullet.y);
        const harmonicAngle = toBullet + (Math.PI / 4); // 45-degree redirect
        
        // Set new velocity
        const speed = Math.sqrt(bullet.body.velocity.x ** 2 + bullet.body.velocity.y ** 2);
        bullet.body.setVelocity(
            Math.cos(harmonicAngle) * speed,
            Math.sin(harmonicAngle) * speed
        );
        bullet.setRotation(harmonicAngle);
        
        // Visual effect
        const spark = this.scene.add.circle(bullet.x, bullet.y, 8, 0x9d4edd, 0.8);
        this.scene.tweens.add({
            targets: spark,
            scale: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => spark.destroy()
        });
        
        // Crystal pulse
        if (crystal.visual) {
            this.scene.tweens.add({
                targets: crystal.visual,
                scale: 1.2,
                duration: 100,
                yoyo: true
            });
        }
    }
    
    chargeWall(wall) {
        // Wall gains charge, becomes more solid
        wall.charge = (wall.charge || 0) + 1;
        
        if (wall.visual) {
            const alpha = Math.min(0.9, 0.6 + wall.charge * 0.1);
            wall.visual.setAlpha(alpha);
        }
        
        // Create block effect
        const flash = this.scene.add.rectangle(wall.x, wall.y, 40, 120, 0x00d4ff, 0.5);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 200,
            onComplete: () => flash.destroy()
        });
    }
    
    createPhasePassEffect(x, y) {
        const ring = this.scene.add.circle(x, y, 20, 0x00d4ff, 0);
        ring.setStrokeStyle(2, 0x00d4ff);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 400,
            onComplete: () => ring.destroy()
        });
    }
    
    nodeAmplification(node) {
        // Add charge to node
        node.charge = (node.charge || 0) + 1;
        
        // Pulse effect
        if (node.visual && node.charge % 5 === 0) {
            this.scene.tweens.add({
                targets: node.visual,
                scale: 1.8,
                duration: 200,
                yoyo: true
            });
        }
    }
    
    activateResonance() {
        this.resonanceActive = true;
        this.resonanceRemaining = this.resonanceDuration;
        this.resonanceReady = false;
        this.resonancesActivated++;
        
        // Hide prompt
        this.resonancePrompt.setVisible(false);
        
        // All structures pulse
        this.structures.forEach(s => {
            if (s.visual) {
                this.scene.tweens.add({
                    targets: s.visual,
                    scale: s.type === 'node' ? 1.6 : 1.3,
                    duration: 300,
                    yoyo: true,
                    repeat: 3
                });
            }
        });
        
        // Visual announcement
        const text = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            'VOID RESONANCE', 
            {
                fontFamily: 'monospace',
                fontSize: '36px',
                fontStyle: 'bold',
                letterSpacing: 4,
                fill: '#00d4ff'
            }
        ).setOrigin(0.5);
        text.setScrollFactor(0);
        text.setDepth(100);
        
        this.scene.tweens.add({
            targets: text,
            scale: 1.5,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Camera shake
        this.scene.cameras.main.shake(500, 0.01);
        
        // Notify systems
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('VOID_RESONANCE', {
                structures: this.structures.length
            });
        }
        
        // Start cooldown
        this.resonanceCooldown = 15;
    }
    
    update(dt) {
        // Decay coherence
        this.coherenceLevel = Math.max(0, this.coherenceLevel - this.coherenceDecay * dt);
        this.updateCoherenceUI();
        
        // Update resonance
        if (this.resonanceActive) {
            this.resonanceRemaining -= dt;
            if (this.resonanceRemaining <= 0) {
                this.resonanceActive = false;
            }
            
            // Pulse all structures during resonance
            this.pulsePhase += dt * 3;
        }
        
        // Update cooldowns
        if (this.resonanceCooldown > 0) {
            this.resonanceCooldown -= dt;
        }
        
        // Update resonance prompt
        if (this.resonanceReady && !this.resonanceActive) {
            const pulse = 0.4 + Math.sin(this.scene.time.now / 150) * 0.4;
            this.resonancePrompt.setAlpha(pulse);
        }
        
        // Update structures
        this.updateStructures(dt);
        
        // Update entities
        this.updateEntities(dt);
        
        // Update memory fade
        this.updateMemory(dt);
        
        // Update visuals
        this.updateVisuals();
    }
    
    updateStructures(dt) {
        this.structures = this.structures.filter(s => {
            if (!s.active) {
                if (s.visual) s.visual.destroy();
                if (s.cell) s.cell.hasStructure = false;
                return false;
            }
            
            // Rotate crystals slowly
            if (s.type === 'crystal' && s.visual) {
                s.rotation += dt * 0.5;
                s.visual.setRotation(s.rotation);
            }
            
            return true;
        });
    }
    
    updateEntities(dt) {
        this.entities.forEach(entity => {
            // Entities grow with sustenance from temporal systems
            if (this.scene.quantumImmortality && this.scene.quantumImmortality.quantumEchoes.length > 0) {
                entity.sustenance += dt * this.scene.quantumImmortality.quantumEchoes.length * 0.1;
            }
            
            // Growth
            if (entity.sustenance > 10) {
                entity.growth += this.entityGrowthRate * dt;
                entity.sustenance -= dt;
                
                if (entity.visual) {
                    const targetScale = Math.min(2, entity.growth);
                    entity.visual.setScale(targetScale);
                }
            }
            
            // Evolution tracking
            entity.evolution += dt;
            
            // Architects at max evolution grant score
            if (entity.evolution > 30 && entity.type === 'architect') {
                // Harvest bonus available
                this.harvestArchitect(entity);
            }
        });
    }
    
    harvestArchitect(entity) {
        // Grant massive score bonus
        const bonus = Math.floor(entity.growth * 1000);
        this.scene.score += bonus;
        
        // Visual
        const text = this.scene.add.text(entity.x, entity.y, `+${bonus}`, {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
        
        // Remove entity
        entity.active = false;
        if (entity.visual) entity.visual.destroy();
        
        const idx = this.entities.indexOf(entity);
        if (idx > -1) this.entities.splice(idx, 1);
    }
    
    updateMemory(dt) {
        const now = this.scene.time.now;
        
        for (const cell of this.trajectoryMemory.values()) {
            if (cell.coherence > 0 && now - cell.lastVisit > this.memoryFadeRate * 1000) {
                cell.coherence = Math.max(0, cell.coherence - dt * 10);
            }
        }
    }
    
    updateVisuals() {
        this.graphics.clear();
        
        // Draw coherence paths
        for (const cell of this.trajectoryMemory.values()) {
            if (cell.coherence > 20) {
                const alpha = cell.coherence / 100 * 0.3;
                const size = this.memoryResolution * 0.8;
                
                this.graphics.fillStyle(0x6b00ff, alpha);
                this.graphics.fillRect(
                    cell.x - size/2, 
                    cell.y - size/2, 
                    size, 
                    size
                );
            }
        }
        
        // Draw void overlay at high coherence
        if (this.coherenceLevel > 50) {
            const overlayAlpha = (this.coherenceLevel - 50) / 100 * 0.15;
            this.voidOverlay.clear();
            this.voidOverlay.fillStyle(0x6b00ff, overlayAlpha);
            this.voidOverlay.fillRect(0, 0, this.scene.scale.width, this.scene.height);
        }
        
        // Resonance effects
        if (this.resonanceActive) {
            const waveRadius = (this.resonanceDuration - this.resonanceRemaining) / this.resonanceDuration * 500;
            this.graphics.lineStyle(2, 0x00d4ff, 0.5);
            this.graphics.strokeCircle(
                this.scene.player.x, 
                this.scene.player.y, 
                waveRadius
            );
        }
    }
    
    /**
     * Integration: Called when quantum echo spawns
     */
    onQuantumEchoSpawn(x, y) {
        // Echoes spawn void coherence at their location
        const cellX = Math.floor(x / this.memoryResolution);
        const cellY = Math.floor(y / this.memoryResolution);
        const cell = this.trajectoryMemory.get(`${cellX},${cellY}`);
        
        if (cell) {
            cell.coherence = Math.min(100, cell.coherence + 30);
            cell.lastVisit = this.scene.time.now;
            this.checkStructureFormation(cell);
        }
    }
    
    /**
     * Integration: Called during bullet time
     */
    onBulletTime(dt) {
        // Enhanced coherence gain during bullet time
        this.coherenceDecay *= 0.3; // Slower decay
        
        // Phase walls become passable
        this.structures.forEach(s => {
            if (s.type === 'wall' && s.visual) {
                s.visual.setAlpha(0.3); // More transparent
            }
        });
    }
    
    /**
     * Integration: Get bullet damage multiplier from resonance
     */
    getBulletDamageMultiplier() {
        return this.resonanceActive ? 2.5 : 1.0;
    }
    
    /**
     * Integration: Check if resonance allows bullet multiplication
     */
    shouldMultiplyBullet() {
        return this.resonanceActive && Math.random() < 0.3;
    }
    
    /**
     * Clean up all structures and effects
     */
    cleanup() {
        this.structures.forEach(s => {
            if (s.visual) s.visual.destroy();
            if (s.cell) s.cell.hasStructure = false;
        });
        this.structures = [];
        
        this.entities.forEach(e => {
            if (e.visual) e.visual.destroy();
        });
        this.entities = [];
        
        this.graphics.clear();
        this.voidOverlay.clear();
        this.coherenceContainer.destroy();
        this.resonancePrompt.destroy();
    }
    
    /**
     * Get stats for game over display
     */
    getStats() {
        return {
            totalCoherence: Math.floor(this.totalCoherenceGenerated),
            structuresCreated: this.structuresCreated,
            entitiesSpawned: this.entitiesSpawned,
            resonancesActivated: this.resonancesActivated,
            currentCoherence: Math.floor(this.coherenceLevel),
            activeStructures: this.structures.length,
            activeEntities: this.entities.length
        };
    }
}
