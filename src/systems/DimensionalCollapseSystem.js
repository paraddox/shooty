import Phaser from 'phaser';

/**
 * Dimensional Collapse System — The Apotheosis of Temporal Mastery
 * 
 * The ultimate synthesis: you cease fighting the geometry and BECOME it.
 * When all temporal systems reach critical resonance, you can activate
 * DIMENSIONAL COLLAPSE — transforming into a 4D hypercube entity that
 * exists outside normal causality, wielding ALL systems simultaneously.
 * 
 * === CORE MECHANIC ===
 * Press F when all conditions are met (all system bars at threshold):
 * - Temporal Singularity: 80%+ charge
 * - Momentum (Fracture): 100% available
 * - Void Coherence: 85%+ 
 * - Quantum Echoes: 3+ active
 * - Resonance Cascade: Chain of 5+ active
 * 
 * When activated, you transform for 12 seconds into the Dimensional Form:
 * - Invulnerable (bullets phase through)
 * - All bullets become omni-system (have ALL weapon properties)
 * - Time dilates to 15% speed (slower than bullet time)
 * - Auto-fire in 8 directions simultaneously
 * - Your form IS a rotating tesseract that damages on contact
 * 
 * === THE APOSTHEOSIS STATE ===
 * During collapse, you exist in 5 states simultaneously (visualized as
 * translucent overlapping forms in cyan, gold, magenta, purple, white):
 * 1. Base form (cyan) - continuous fire
 * 2. Echo form (gold) - leaves time-delayed echoes that fire again
 * 3. Fracture form (magenta) - splits bullets into 3-way spread
 * 4. Void form (purple) - bullets crystallize void structures on impact
 * 5. Quantum form (white) - bullets phase through everything then seek
 * 
 * === AFTERMATH ===
 * When collapse ends:
 * - All systems enter 5-second cooldown (recovery)
 * - Score multiplier based on damage dealt during collapse (up to 10x)
 * - "Timeline Scar" remains at collapse location (persistent geometric anomaly)
 * - All enemies gain "dimensional trauma" (permanently slowed 20%)
 * 
 * === SYNTHESIS HUB ===
 * This system is the ultimate bridge — it requires and uses EVERY system:
 * - Echo Storm: Echoes remain after collapse as quantum remnants
 * - Fracture: Ghost joins the dimensional form (twin hypercube)
 * - Residue: Nodes explode into void crystals on collapse
 * - Singularity: Deploys automatically at collapse center
 * - Omni-Weapon: ALL mods active simultaneously (impossible otherwise)
 * - Paradox Engine: Future echo becomes present during collapse
 * - Chrono-Loop: Past echoes synchronize with dimensional form
 * - Quantum Immortality: Death echoes merge into collapse duration
 * - Observer Effect: AI observes your "true form" and adapts
 * - Void Coherence: Collapse location becomes permanent void node
 * - Resonance Cascade: Maximum chain bonus during collapse
 * - Tesseract Titan: Boss takes DOUBLE damage from dimensional form
 * - Chronicle: Collapse generates "Apotheosis Shard" (highest tier)
 * - Contract: Collapse auto-fulfills pending contracts
 * - Entanglement: All links explode in cascade
 * - Cinematic: Auto-captures collapse moment
 * - Symbiotic: AI prediction becomes 100% accurate during collapse
 * 
 * Color: Rainbow spectrum cycling (all colors at once) — the unity of all systems
 * 
 * This transforms the player from mortal pilot to TEMPORAL DEITY,
 * completing the power fantasy arc from fighting geometry to embodying it.
 */

export default class DimensionalCollapseSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== COLLAPSE STATE =====
        this.isCollapsed = false;
        this.collapseTimer = 0;
        this.collapseDuration = 12; // Seconds
        this.collapseCooldown = 0;
        this.collapseCooldownMax = 30; // Seconds between uses
        this.totalCollapses = 0;
        this.collapseDamageDealt = 0;
        
        // ===== ACTIVATION THRESHOLDS =====
        this.thresholds = {
            singularityCharge: 80,      // %
            momentumAvailable: 100,   // % (full bar ready)
            voidCoherence: 85,         // %
            quantumEchoes: 3,          // count
            resonanceChain: 5          // chain length
        };
        
        // ===== DIMENSIONAL FORM STATE =====
        this.dimensionalForms = {
            BASE: { color: 0x00f0ff, active: true, timer: 0 },
            ECHO: { color: 0xffd700, active: false, timer: 0 },
            FRACTURE: { color: 0xff00ff, active: false, timer: 0 },
            VOID: { color: 0x9d4edd, active: false, timer: 0 },
            QUANTUM: { color: 0xffffff, active: false, timer: 0 }
        };
        this.formRotation = 0;
        this.formCycleInterval = 2.4; // Seconds per form (12s / 5 forms)
        
        // ===== TESSERACT VISUALS =====
        this.tesseractVertices = [];
        this.tesseractRotation = { xy: 0, xz: 0, xw: 0 };
        this.tesseractGraphics = null;
        this.glowGraphics = null;
        this.coreGlow = null;
        this.formContainer = null;
        
        // ===== OVERLAY EFFECTS =====
        this.scanlineOverlay = null;
        this.vignetteOverlay = null;
        this.chromaticAberration = 0;
        
        // ===== AUTO-FIRE STATE =====
        this.autoFireTimer = 0;
        this.autoFireInterval = 0.08; // Very rapid fire
        this.fireDirections = 8;
        
        // ===== AFTERMATH =====
        this.timelineScars = []; // Persistent anomalies
        this.maxScars = 5;
        
        // ===== STATISTICS =====
        this.stats = {
            totalDamage: 0,
            enemiesDefeated: 0,
            bulletsFired: 0,
            bestMultiplier: 0
        };
        
        // Colors
        this.SPECTRUM_COLORS = [0x00f0ff, 0xffd700, 0xff00ff, 0x9d4edd, 0xffffff];
        this.currentColorIndex = 0;
        
        this.init();
    }
    
    init() {
        this.createTesseractGraphics();
        this.createOverlayEffects();
        this.createFormContainer();
        this.setupInput();
    }
    
    createTesseractGraphics() {
        // Main graphics for 4D hypercube projection
        this.tesseractGraphics = this.scene.add.graphics();
        this.tesseractGraphics.setDepth(45);
        
        // Glow/bloom effect
        this.glowGraphics = this.scene.add.graphics();
        this.glowGraphics.setDepth(44);
        
        // Core pulsing glow (sprite for easier tweening)
        this.coreGlow = this.scene.add.circle(0, 0, 60, 0x00f0ff, 0.3);
        this.coreGlow.setDepth(43);
        this.coreGlow.setVisible(false);
    }
    
    createOverlayEffects() {
        // Scanline overlay for glitch effect
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
        for (let y = 0; y < 256; y += 4) {
            ctx.fillRect(0, y, 256, 1);
        }
        
        this.scene.textures.addCanvas('scanlines_dim', canvas);
        
        this.scanlineOverlay = this.scene.add.image(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'scanlines_dim'
        );
        this.scanlineOverlay.setScrollFactor(0);
        this.scanlineOverlay.setDepth(90);
        this.scanlineOverlay.setVisible(false);
        this.scanlineOverlay.setAlpha(0);
        
        // Vignette for tunnel vision effect
        this.vignetteOverlay = this.scene.add.graphics();
        this.vignetteOverlay.setScrollFactor(0);
        this.vignetteOverlay.setDepth(89);
    }
    
    createFormContainer() {
        // Container for all dimensional form visual elements
        this.formContainer = this.scene.add.container(0, 0);
        this.formContainer.setDepth(45);
        this.formContainer.setVisible(false);
        
        // Add glowing orbs representing the 5 forms
        this.formOrbs = [];
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const orb = this.scene.add.circle(
                Math.cos(angle) * 40,
                Math.sin(angle) * 40,
                12,
                this.SPECTRUM_COLORS[i],
                0.6
            );
            orb.setBlendMode(Phaser.BlendModes.ADD);
            this.formOrbs.push(orb);
            this.formContainer.add(orb);
        }
    }
    
    setupInput() {
        // F key to activate dimensional collapse
        this.scene.input.keyboard.on('keydown-F', () => {
            this.attemptActivation();
        });
    }
    
    // ===== CONDITION CHECKING =====
    
    canActivate() {
        if (this.isCollapsed) return false;
        if (this.collapseCooldown > 0) return false;
        
        // Check all system thresholds
        const checks = this.checkAllThresholds();
        return checks.allMet;
    }
    
    getReadinessDisplay() {
        const percent = this.getReadinessPercent();
        if (this.isCollapsed) return 'ACTIVE';
        if (this.collapseCooldown > 0) return 'COOLDOWN';
        if (percent >= 100) return 'READY (F)';
        if (percent >= 80) return `${percent.toFixed(0)}%`;
        return '';
    }
    
    checkAllThresholds() {
        const player = this.scene.player;
        const singularity = this.scene.singularitySystem;
        const fracture = this.scene.fractureSystem;
        const voidCoherence = this.scene.voidCoherence;
        const quantum = this.scene.quantumImmortality;
        const resonance = this.scene.resonanceCascade;
        
        const checks = {
            singularity: singularity && singularity.chargePercent >= this.thresholds.singularityCharge,
            momentum: fracture && fracture.momentum >= this.thresholds.momentumAvailable,
            voidCoherence: voidCoherence && voidCoherence.coherenceLevel >= this.thresholds.voidCoherence,
            quantumEchoes: quantum && quantum.quantumEchoes.length >= this.thresholds.quantumEchoes,
            resonanceChain: resonance && resonance.chainLength >= this.thresholds.resonanceChain,
            allMet: false
        };
        
        checks.allMet = checks.singularity && checks.momentum && checks.voidCoherence && 
                        checks.quantumEchoes && checks.resonanceChain;
        
        return checks;
    }
    
    getReadinessPercent() {
        const checks = this.checkAllThresholds();
        let passed = 0;
        if (checks.singularity) passed++;
        if (checks.momentum) passed++;
        if (checks.voidCoherence) passed++;
        if (checks.quantumEchoes) passed++;
        if (checks.resonanceChain) passed++;
        return (passed / 5) * 100;
    }
    
    // ===== ACTIVATION =====
    
    attemptActivation() {
        if (!this.canActivate()) {
            this.showNotReadyText();
            return;
        }
        
        this.activateCollapse();
    }
    
    activateCollapse() {
        this.isCollapsed = true;
        this.collapseTimer = this.collapseDuration;
        this.totalCollapses++;
        this.collapseDamageDealt = 0;
        
        // Record in resonance cascade (ultimate activation)
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('DIMENSIONAL_COLLAPSE', {
                form: 'ALL_SYSTEMS_SYNTHESIS'
            });
        }
        
        // Consume all resources
        this.consumeResources();
        
        // Transform player
        this.transformPlayer();
        
        // Activate all system synergies
        this.activateAllSynergies();
        
        // Show activation text
        this.showCollapseActivation();
        
        // Auto-capture cinematic moment
        if (this.scene.cinematicArchive) {
            this.scene.cinematicArchive.triggerManualCapture('APOTHEOSIS');
        }
    }
    
    consumeResources() {
        // Consume singularity charge
        if (this.scene.singularitySystem) {
            this.scene.singularitySystem.chargePercent = 0;
        }
        
        // Consume momentum
        if (this.scene.fractureSystem) {
            this.scene.fractureSystem.momentum = 0;
        }
        
        // Consume void coherence
        if (this.scene.voidCoherence) {
            this.scene.voidCoherence.coherenceLevel = Math.max(0, this.scene.voidCoherence.coherenceLevel - 50);
        }
        
        // Convert quantum echoes into collapse duration bonus
        if (this.scene.quantumImmortality) {
            const echoBonus = Math.min(3, this.scene.quantumImmortality.quantumEchoes.length);
            this.collapseDuration += echoBonus * 2;
            // Echoes are consumed
        }
    }
    
    transformPlayer() {
        const player = this.scene.player;
        
        // Store original player state
        this.originalPlayerState = {
            scaleX: player.scaleX,
            scaleY: player.scaleY,
            alpha: player.alpha,
            tint: player.tintTopLeft
        };
        
        // Make player invulnerable
        player.isInvulnerable = true;
        
        // Hide normal player sprite, show dimensional form
        player.setAlpha(0.3);
        
        // Show tesseract graphics
        this.tesseractGraphics.setVisible(true);
        this.glowGraphics.setVisible(true);
        this.coreGlow.setVisible(true);
        this.coreGlow.setPosition(player.x, player.y);
        this.formContainer.setVisible(true);
        this.formContainer.setPosition(player.x, player.y);
        
        // Show overlay effects
        this.scanlineOverlay.setVisible(true);
        this.scene.tweens.add({
            targets: this.scanlineOverlay,
            alpha: 0.6,
            duration: 500
        });
        
        // Extreme time dilation (slower than bullet time)
        this.scene.physics.world.timeScale = 0.15;
        this.scene.time.timeScale = 0.15;
        
        // Pulse the core
        this.scene.tweens.add({
            targets: this.coreGlow,
            scale: { from: 1, to: 1.5 },
            alpha: { from: 0.3, to: 0.6 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Animate form orbs
        this.formOrbs.forEach((orb, i) => {
            this.scene.tweens.add({
                targets: orb,
                scale: { from: 1, to: 1.8 },
                alpha: { from: 0.6, to: 1 },
                duration: 800 + i * 200,
                yoyo: true,
                repeat: -1
            });
        });
        
        // Screen effects
        this.scene.cameras.main.shake(1000, 0.02);
        this.scene.cameras.main.flash(500, 255, 255, 255, 0.5);
    }
    
    activateAllSynergies() {
        // Deploy automatic singularity at player position
        if (this.scene.singularitySystem && !this.scene.singularitySystem.activeSingularity) {
            this.scene.singularitySystem.deployAt(this.scene.player.x, this.scene.player.y);
        }
        
        // Trigger void resonance
        if (this.scene.voidCoherence) {
            this.scene.voidCoherence.triggerResonance();
        }
        
        // Activate all residue nodes at once
        if (this.scene.temporalResidue) {
            this.scene.temporalResidue.nodes.forEach(node => {
                node.attackSpeed = 0.1; // Rapid fire
            });
        }
        
        // Boost resonance cascade to max
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.damageMultiplier = 5.0; // Maximum multiplier
        }
        
        // Fracture ghost joins as twin hypercube
        if (this.scene.fractureSystem) {
            this.scene.fractureSystem.triggerTwinMode();
        }
        
        // Auto-entangle all enemies to each other
        if (this.scene.causalEntanglement) {
            this.autoEntangleAllEnemies();
        }
        
        // Fulfill all pending contracts
        if (this.scene.temporalContract) {
            this.scene.temporalContract.fulfillAllContracts();
        }
    }
    
    autoEntangleAllEnemies() {
        const entanglement = this.scene.causalEntanglement;
        if (!entanglement) return;
        
        const enemies = this.scene.enemies.children.entries.filter(e => e.active);
        
        // Link all enemies in a cascade network
        for (let i = 0; i < enemies.length - 1 && i < 6; i++) {
            entanglement.createEntanglement(
                { entity: enemies[i], type: 'enemy' },
                { entity: enemies[i + 1], type: 'enemy' },
                'CASCADE'
            );
        }
    }
    
    // ===== UPDATE LOOP =====
    
    update(dt) {
        // Update cooldown
        if (this.collapseCooldown > 0) {
            this.collapseCooldown -= dt;
        }
        
        if (!this.isCollapsed) {
            return;
        }
        
        // Update collapse timer
        this.collapseTimer -= dt * (1 / this.scene.physics.world.timeScale); // Account for time dilation
        
        if (this.collapseTimer <= 0) {
            this.deactivateCollapse();
            return;
        }
        
        // Update dimensional form
        this.updateDimensionalForm(dt);
        
        // Auto-fire in all directions
        this.autoFire(dt);
        
        // Update visual effects
        this.updateVisualEffects(dt);
        
        // Update tesseract rotation
        this.updateTesseract(dt);
        
        // Deal contact damage to nearby enemies
        this.dealContactDamage(dt);
    }
    
    updateDimensionalForm(dt) {
        const player = this.scene.player;
        
        // Rotate through the 5 forms
        const formIndex = Math.floor((this.collapseDuration - this.collapseTimer) / this.formCycleInterval) % 5;
        
        if (formIndex !== this.currentColorIndex) {
            this.currentColorIndex = formIndex;
            this.activateFormEffect(formIndex);
        }
        
        // Rotate form orbs
        this.formContainer.rotation += dt * 2;
        this.formContainer.setPosition(player.x, player.y);
        
        // Update core glow position
        this.coreGlow.setPosition(player.x, player.y);
        this.coreGlow.fillColor = this.SPECTRUM_COLORS[this.currentColorIndex];
        
        // Cycle through form colors
        const currentColor = this.SPECTRUM_COLORS[this.currentColorIndex];
        
        // Update graphics color
        this.tesseractGraphics.lineStyle(3, currentColor, 0.9);
    }
    
    activateFormEffect(formIndex) {
        const formNames = ['BASE', 'ECHO', 'FRACTURE', 'VOID', 'QUANTUM'];
        const formName = formNames[formIndex];
        
        // Show form transition text
        const formText = this.scene.add.text(
            this.scene.player.x, 
            this.scene.player.y - 100,
            formName,
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#' + this.SPECTRUM_COLORS[formIndex].toString(16).padStart(6, '0'),
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: formText,
            y: formText.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => formText.destroy()
        });
        
        // Apply form-specific bonuses
        switch (formIndex) {
            case 0: // BASE - increased fire rate
                this.autoFireInterval = 0.05;
                break;
            case 1: // ECHO - echoes fire too
                this.fireEchoBurst();
                break;
            case 2: // FRACTURE - 3-way spread
                this.fireDirections = 12;
                break;
            case 3: // VOID - create void crystal
                if (this.scene.voidCoherence) {
                    this.scene.voidCoherence.spawnStructure(
                        this.scene.player.x, 
                        this.scene.player.y, 
                        'crystal'
                    );
                }
                break;
            case 4: // QUANTUM - homing bullets
                this.fireHomingBurst();
                break;
        }
    }
    
    fireEchoBurst() {
        // Fire a burst of delayed-echo bullets
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const bullet = this.fireDimensionalBullet(angle, 400);
            if (bullet) {
                bullet.isTemporalEcho = true;
                bullet.echoDelay = 800;
            }
        }
    }
    
    fireHomingBurst() {
        // Fire seeking bullets at all enemies
        const enemies = this.scene.enemies.children.entries.filter(e => e.active);
        enemies.forEach(enemy => {
            const angle = Phaser.Math.Angle.Between(
                this.scene.player.x, this.scene.player.y,
                enemy.x, enemy.y
            );
            const bullet = this.fireDimensionalBullet(angle, 350);
            if (bullet) {
                bullet.isHoming = true;
                bullet.targetEnemy = enemy;
            }
        });
    }
    
    autoFire(dt) {
        this.autoFireTimer += dt;
        
        if (this.autoFireTimer >= this.autoFireInterval) {
            this.autoFireTimer = 0;
            
            // Fire in all directions
            for (let i = 0; i < this.fireDirections; i++) {
                const angle = (i / this.fireDirections) * Math.PI * 2 + this.formContainer.rotation;
                this.fireDimensionalBullet(angle, 450);
            }
        }
    }
    
    fireDimensionalBullet(angle, speed) {
        const bullet = this.scene.bullets.get(this.scene.player.x, this.scene.player.y);
        if (!bullet) return null;
        
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setTint(this.SPECTRUM_COLORS[this.currentColorIndex]);
        bullet.setBlendMode(Phaser.BlendModes.ADD);
        
        // Apply dimensional properties (ALL weapon mods active)
        bullet.isPiercing = true;
        bullet.isExplosive = true;
        bullet.isPhasing = true;
        bullet.isHoming = this.currentColorIndex === 4;
        bullet.damageMultiplier = 5.0;
        
        // Set velocity
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        bullet.body.setVelocity(vx, vy);
        
        this.stats.bulletsFired++;
        
        return bullet;
    }
    
    updateVisualEffects(dt) {
        // Animate scanlines
        this.scanlineOverlay.y += dt * 10;
        if (this.scanlineOverlay.y > this.scene.scale.height) {
            this.scanlineOverlay.y = 0;
        }
        
        // Draw vignette
        this.vignetteOverlay.clear();
        const gradient = this.vignetteOverlay.createRadialGradient(
            this.scene.scale.width / 2, this.scene.scale.height / 2, 50,
            this.scene.scale.width / 2, this.scene.scale.height / 2, this.scene.scale.height
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        
        this.vignetteOverlay.fillStyle(0x000000, 0);
        this.vignetteOverlay.fillGradientStyle(0, 0, 0, 0, 0);
    }
    
    updateTesseract(dt) {
        // Update 4D rotation
        this.tesseractRotation.xy += dt * 0.5;
        this.tesseractRotation.xz += dt * 0.3;
        this.tesseractRotation.xw += dt * 0.2;
        
        // Generate 4D vertices
        this.generateTesseractVertices();
        
        // Project to 2D and render
        this.renderTesseract();
    }
    
    generateTesseractVertices() {
        // 16 vertices of a 4D tesseract
        this.tesseractVertices = [];
        for (let i = 0; i < 16; i++) {
            this.tesseractVertices.push({
                x: (i & 1) ? 1 : -1,
                y: (i & 2) ? 1 : -1,
                z: (i & 4) ? 1 : -1,
                w: (i & 8) ? 1 : -1
            });
        }
    }
    
    renderTesseract() {
        this.tesseractGraphics.clear();
        this.glowGraphics.clear();
        
        const player = this.scene.player;
        const scale = 80;
        
        // Project vertices
        const projectedVertices = this.tesseractVertices.map(v => {
            // Apply 4D rotations
            let { x, y, z, w } = v;
            
            // XY rotation
            let cos = Math.cos(this.tesseractRotation.xy);
            let sin = Math.sin(this.tesseractRotation.xy);
            let x1 = x * cos - y * sin;
            let y1 = x * sin + y * cos;
            x = x1; y = y1;
            
            // XZ rotation
            cos = Math.cos(this.tesseractRotation.xz);
            sin = Math.sin(this.tesseractRotation.xz);
            x1 = x * cos - z * sin;
            let z1 = x * sin + z * cos;
            x = x1; z = z1;
            
            // XW rotation
            cos = Math.cos(this.tesseractRotation.xw);
            sin = Math.sin(this.tesseractRotation.xw);
            x1 = x * cos - w * sin;
            let w1 = x * sin + w * cos;
            x = x1; w = w1;
            
            // Project 4D to 3D
            const distance4D = 3;
            const wFactor = 1 / (distance4D - w);
            x *= wFactor;
            y *= wFactor;
            z *= wFactor;
            
            // Project 3D to 2D
            const distance3D = 4;
            const zFactor = 1 / (distance3D - z);
            
            return {
                x: player.x + x * scale * zFactor,
                y: player.y + y * scale * zFactor,
                z: z
            };
        });
        
        // Draw edges
        const currentColor = this.SPECTRUM_COLORS[this.currentColorIndex];
        this.tesseractGraphics.lineStyle(3, currentColor, 0.9);
        
        // Edges of a tesseract
        const edges = this.getTesseractEdges();
        edges.forEach(edge => {
            const v1 = projectedVertices[edge[0]];
            const v2 = projectedVertices[edge[1]];
            this.tesseractGraphics.lineBetween(v1.x, v1.y, v2.x, v2.y);
        });
        
        // Draw glow
        this.glowGraphics.lineStyle(8, currentColor, 0.2);
        edges.forEach(edge => {
            const v1 = projectedVertices[edge[0]];
            const v2 = projectedVertices[edge[1]];
            this.glowGraphics.lineBetween(v1.x, v1.y, v2.x, v2.y);
        });
    }
    
    getTesseractEdges() {
        // Define the 32 edges of a tesseract
        const edges = [];
        
        // Inner cube edges (0-7)
        for (let i = 0; i < 8; i++) {
            for (let j = i + 1; j < 8; j++) {
                let diff = i ^ j;
                if ((diff & (diff - 1)) === 0) { // Single bit difference
                    edges.push([i, j]);
                }
            }
        }
        
        // Outer cube edges (8-15)
        for (let i = 8; i < 16; i++) {
            for (let j = i + 1; j < 16; j++) {
                let diff = (i - 8) ^ (j - 8);
                if ((diff & (diff - 1)) === 0) {
                    edges.push([i, j]);
                }
            }
        }
        
        // Connecting edges between inner and outer cubes
        for (let i = 0; i < 8; i++) {
            edges.push([i, i + 8]);
        }
        
        return edges;
    }
    
    dealContactDamage(dt) {
        const player = this.scene.player;
        const contactRadius = 100;
        const damagePerSecond = 200;
        
        // Damage all enemies within contact radius
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y, enemy.x, enemy.y
            );
            
            if (dist < contactRadius) {
                const damage = damagePerSecond * dt;
                enemy.takeDamage(damage);
                this.collapseDamageDealt += damage;
                this.stats.totalDamage += damage;
                
                // Visual spark
                this.scene.hitParticles.emitParticleAt(enemy.x, enemy.y);
            }
        });
        
        // Extra damage to boss (dimensional trauma)
        if (this.scene.tesseractTitan && this.scene.tesseractTitan.active) {
            const bossDist = Phaser.Math.Distance.Between(
                player.x, player.y,
                this.scene.tesseractTitan.x, this.scene.tesseractTitan.y
            );
            
            if (bossDist < contactRadius + 60) {
                const damage = damagePerSecond * 2 * dt; // Double damage to boss
                this.scene.tesseractTitan.takeDamage(damage);
                this.collapseDamageDealt += damage;
            }
        }
    }
    
    // ===== DEACTIVATION =====
    
    deactivateCollapse() {
        this.isCollapsed = false;
        this.collapseCooldown = this.collapseCooldownMax;
        
        // Restore player
        this.restorePlayer();
        
        // Restore normal time
        this.scene.physics.world.timeScale = 1;
        this.scene.time.timeScale = 1;
        
        // Hide dimensional form
        this.tesseractGraphics.setVisible(false);
        this.glowGraphics.setVisible(false);
        this.coreGlow.setVisible(false);
        this.formContainer.setVisible(false);
        
        // Fade out overlay
        this.scene.tweens.add({
            targets: this.scanlineOverlay,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.scanlineOverlay.setVisible(false);
            }
        });
        
        // Create aftermath effects
        this.createAftermath();
        
        // Show deactivation text
        this.showCollapseEnd();
        
        // Update statistics
        this.updateBestMultiplier();
    }
    
    restorePlayer() {
        const player = this.scene.player;
        
        // Restore original appearance
        player.setAlpha(this.originalPlayerState.alpha);
        player.clearTint();
        
        // Remove invulnerability after brief delay
        this.scene.time.delayedCall(2000, () => {
            player.isInvulnerable = false;
        });
    }
    
    createAftermath() {
        // Create Timeline Scar at collapse location
        this.createTimelineScar(this.scene.player.x, this.scene.player.y);
        
        // Apply dimensional trauma to all enemies (permanent slow)
        this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
                enemy.speed = (enemy.speed || 100) * 0.8; // 20% permanent slow
                enemy.setTint(0x664466); // Trauma visual marker
            }
        });
        
        // Calculate and apply score multiplier
        const multiplier = Math.min(10, 1 + this.collapseDamageDealt / 1000);
        this.scene.score += Math.floor(this.collapseDamageDealt * multiplier);
        
        // Award "Apotheosis Shard" if damage was high enough
        if (this.collapseDamageDealt > 2000) {
            this.awardApotheosisShard();
        }
    }
    
    createTimelineScar(x, y) {
        // Limit scars
        if (this.timelineScars.length >= this.maxScars) {
            const oldScar = this.timelineScars.shift();
            if (oldScar && oldScar.destroy) oldScar.destroy();
        }
        
        // Create persistent geometric anomaly
        const scar = this.scene.add.graphics();
        scar.x = x;
        scar.y = y;
        scar.setDepth(30);
        
        // Draw crystalline structure
        scar.lineStyle(2, 0x9d4edd, 0.6);
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const r = 40;
            scar.lineBetween(
                x + Math.cos(angle) * r,
                y + Math.sin(angle) * r,
                x + Math.cos(angle + Math.PI / 3) * r,
                y + Math.sin(angle + Math.PI / 3) * r
            );
        }
        
        // Pulsing animation
        this.scene.tweens.add({
            targets: scar,
            alpha: { from: 0.3, to: 0.8 },
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        // Store reference
        this.timelineScars.push(scar);
        
        // Scar effect: nearby bullets slow down
        scar.update = (dt) => {
            this.scene.enemyBullets.children.entries.forEach(bullet => {
                if (!bullet.active) return;
                const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, x, y);
                if (dist < 100) {
                    bullet.body.velocity.scale(0.9); // Slow in scar zone
                }
            });
        };
    }
    
    awardApotheosisShard() {
        if (this.scene.timelineChronicle) {
            this.scene.timelineChronicle.awardShard('APOTHEOSIS', {
                damage: this.collapseDamageDealt,
                duration: this.collapseDuration,
                timestamp: Date.now()
            });
        }
        
        // Show shard award text
        const shardText = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 150,
            'APOTHEOSIS SHARD EARNED',
            {
                fontFamily: 'monospace',
                fontSize: '22px',
                fontStyle: 'bold',
                fill: '#ffd700'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: shardText,
            y: shardText.y - 50,
            alpha: 0,
            duration: 3000,
            onComplete: () => shardText.destroy()
        });
    }
    
    updateBestMultiplier() {
        const multiplier = 1 + this.collapseDamageDealt / 1000;
        if (multiplier > this.stats.bestMultiplier) {
            this.stats.bestMultiplier = multiplier;
        }
    }
    
    // ===== UI TEXT =====
    
    showNotReadyText() {
        const readiness = this.getReadinessPercent();
        const checks = this.checkAllThresholds();
        
        let missing = [];
        if (!checks.singularity) missing.push('Singularity');
        if (!checks.momentum) missing.push('Momentum');
        if (!checks.voidCoherence) missing.push('Void');
        if (!checks.quantumEchoes) missing.push('Echoes');
        if (!checks.resonanceChain) missing.push('Chain');
        
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 80,
            `DIMENSIONAL COLLAPSE ${readiness.toFixed(0)}%\nNeed: ${missing.join(', ')}`,
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#ff6666'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }
    
    showCollapseActivation() {
        // Main activation text
        const mainText = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'DIMENSIONAL COLLAPSE',
            {
                fontFamily: 'monospace',
                fontSize: '36px',
                fontStyle: 'bold',
                fill: '#ffffff'
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        const subText = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2 + 50,
            'APOTHEOSIS ACHIEVED',
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fill: '#00f0ff'
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        // Dramatic entrance
        mainText.setScale(0.5);
        mainText.setAlpha(0);
        
        this.scene.tweens.add({
            targets: mainText,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Back.out'
        });
        
        this.scene.tweens.add({
            targets: [mainText, subText],
            alpha: 0,
            delay: 2000,
            duration: 1000,
            onComplete: () => {
                mainText.destroy();
                subText.destroy();
            }
        });
        
        // Screen flash
        this.scene.cameras.main.flash(1000, 255, 255, 255, 0.8);
    }
    
    showCollapseEnd() {
        const multiplier = (1 + this.collapseDamageDealt / 1000).toFixed(1);
        
        const text = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            `COLLAPSE RESOLVED\n${this.collapseDamageDealt.toFixed(0)} DAMAGE × ${multiplier} = ${(this.collapseDamageDealt * parseFloat(multiplier)).toFixed(0)} SCORE`,
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fill: '#9d4edd',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            delay: 4000,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }
    
    // ===== UTILITY =====
    
    getIsCollapsed() {
        return this.isCollapsed;
    }
    
    getRemainingTime() {
        return this.isCollapsed ? this.collapseTimer : 0;
    }
    
    getCooldownPercent() {
        if (this.isCollapsed) return 0;
        return 1 - (this.collapseCooldown / this.collapseCooldownMax);
    }
    
    destroy() {
        if (this.tesseractGraphics) this.tesseractGraphics.destroy();
        if (this.glowGraphics) this.glowGraphics.destroy();
        if (this.coreGlow) this.coreGlow.destroy();
        if (this.formContainer) this.formContainer.destroy();
        if (this.scanlineOverlay) this.scanlineOverlay.destroy();
        if (this.vignetteOverlay) this.vignetteOverlay.destroy();
        
        // Cleanup timeline scars
        this.timelineScars.forEach(scar => {
            if (scar && scar.destroy) scar.destroy();
        });
    }
}
