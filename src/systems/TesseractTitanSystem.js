import Phaser from 'phaser';

/**
 * TESSERACT TITAN - The Geometric Overseer
 * 
 * A massive rotating hypercube boss that weaponizes the game's temporal mechanics.
 * This boss doesn't just attack - it *learns* your temporal abilities and uses them against you.
 * 
 * Core Innovation: The boss exists in 4D, showing multiple "faces" (health pools) that
 * must be destroyed in sequence. Each face has unique temporal attacks that mirror
 * the player's own abilities.
 * 
 * PHASES:
 * - Phase 1 (100-75%): Temporal Bullets - echoes of past shots persist
 * - Phase 2 (75-50%): Fracture Clones - boss splits into attacking shadows
 * - Phase 3 (50-25%): Paradox Fields - zones where time flows backwards
 * - Phase 4 (25-0%): Chrono-Singularity - the boss becomes a temporal black hole
 */
export default class TesseractTitan {
    constructor(scene) {
        this.scene = scene;
        this.active = false;
        this.phase = 1;
        this.maxPhase = 4;
        
        // Tesseract is composed of 8 cube vertices in 4D, projected to 3D
        this.vertices4D = this.generateTesseractVertices();
        this.rotation4D = { xy: 0, xz: 0, xw: 0, yz: 0 };
        this.rotationSpeed = { xy: 0.3, xz: 0.2, xw: 0.1, yz: 0.15 };
        
        // Health system - 4 faces, each must be destroyed
        this.faceHealth = [500, 500, 500, 500];
        this.faceMaxHealth = 500;
        this.currentFace = 0; // Which face is currently vulnerable
        this.totalHealth = 2000;
        
        // Visual components
        this.graphics = null;
        this.coreGlow = null;
        this.faceIndicators = [];
        
        // Attack systems
        this.attackTimer = 0;
        this.attackCooldown = 2000; // Base cooldown
        this.temporalEchoes = []; // Persistent bullet echoes
        this.fractureClones = []; // Shadow copies of boss
        this.paradoxFields = []; // Time-reversal zones
        
        // Position - stays at arena center, rotating
        this.x = 960; // Center of 1920x1440 arena
        this.y = 720;
        this.orbitRadius = 0; // Stationary but can rotate around center
        this.orbitAngle = 0;
        
        // State flags
        this.invulnerable = false;
        this.charging = false;
        this.chargeTimer = 0;
        this.deathSequence = false;
        
        // Particle emitters
        this.coreParticles = null;
        this.deathParticles = null;
        
        // Phase transitions
        this.transitioning = false;
        this.transitionTimer = 0;
        
        // Visual tesseract lines
        this.edges = [];
        this.projectedVertices = [];
        
        // Warning system for attacks
        this.warningGraphics = null;
        
        // Death orbs from defeated faces
        this.faceDeathOrbs = [];
        
        // Chrono-singularity in final phase
        this.singularityRadius = 0;
        this.singularityPull = 0;
        
        // Throttling for performance
        this.renderInterval = 2; // Render every 2nd frame (30fps)
        this.renderCounter = 0;
    }
    
    /**
     * Generate the 8 vertices of a tesseract in 4D space
     * Each vertex is at (+/-1, +/-1, +/-1, +/-1)
     */
    generateTesseractVertices() {
        const vertices = [];
        for (let i = 0; i < 8; i++) {
            vertices.push({
                x: (i & 1) ? 1 : -1,
                y: (i & 2) ? 1 : -1,
                z: (i & 4) ? 1 : -1,
                w: 0 // Projected from 4D, w starts at 0 for 3D slice
            });
        }
        return vertices;
    }
    
    spawn() {
        this.active = true;
        
        // Create graphics for tesseract rendering
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(50);
        
        // Warning graphics for attack telegraphs
        this.warningGraphics = this.scene.add.graphics();
        this.warningGraphics.setDepth(49);
        
        // Core glow sprite
        this.coreGlow = this.scene.add.image(this.x, this.y, 'particle');
        this.coreGlow.setScale(8);
        this.coreGlow.setTint(0xff0066);
        this.coreGlow.setAlpha(0.6);
        this.coreGlow.setBlendMode(Phaser.BlendModes.ADD);
        this.coreGlow.setDepth(48);
        
        // Core particle emitter
        this.coreParticles = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 0.8, end: 0 },
            alpha: { start: 0.8, end: 0 },
            speed: { min: 20, max: 80 },
            lifespan: 800,
            tint: 0xff0066,
            frequency: 50,
            quantity: 2,
            blendMode: 'ADD'
        });
        this.coreParticles.startFollow(this.coreGlow);
        
        // Create face indicators (which face is vulnerable)
        this.createFaceIndicators();
        
        // Spawn animation
        this.playSpawnAnimation();
        
        // Announce arrival
        this.showBossAnnouncement();
        
        // Start first attack pattern
        this.scheduleNextAttack();
        
        // Observe boss spawn (for Observer Effect)
        if (this.scene.observerEffect) {
            this.scene.observerEffect.observeTemporalUse('bossSpawn', {
                bossName: 'TESSERACT TITAN',
                phase: this.phase
            });
        }
    }
    
    createFaceIndicators() {
        const colors = [0x00d4ff, 0xffd700, 0xff0066, 0x9d4edd];
        const offsets = [
            { x: -60, y: -40 },
            { x: 60, y: -40 },
            { x: -60, y: 40 },
            { x: 60, y: 40 }
        ];
        
        for (let i = 0; i < 4; i++) {
            const indicator = this.scene.add.graphics();
            indicator.setDepth(51);
            this.faceIndicators.push({
                graphics: indicator,
                color: colors[i],
                offset: offsets[i],
                health: this.faceHealth[i]
            });
        }
    }
    
    playSpawnAnimation() {
        // Scale up from nothing
        this.coreGlow.setScale(0);
        this.scene.tweens.add({
            targets: this.coreGlow,
            scale: 8,
            duration: 2000,
            ease: 'Power3',
            onComplete: () => {
                this.invulnerable = false;
            }
        });
        
        // Flash the arena
        this.scene.cameras.main.flash(1500, 255, 0, 100, 0.3);
        
        // Screen shake building up
        this.scene.tweens.add({
            targets: { shake: 0 },
            shake: 0.02,
            duration: 2000,
            ease: 'Power2',
            onUpdate: (tween) => {
                this.scene.cameras.main.shake(100, tween.getValue());
            }
        });
    }
    
    showBossAnnouncement() {
        const title = this.scene.add.text(this.x, this.y - 150, 'TESSERACT TITAN', {
            fontFamily: 'monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            fill: '#ff0066',
            align: 'center'
        }).setOrigin(0.5);
        
        const subtitle = this.scene.add.text(this.x, this.y - 110, 'GEOMETRIC OVERSEER', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#ff4488',
            letterSpacing: 4,
            align: 'center'
        }).setOrigin(0.5);
        
        // Animate in
        title.setAlpha(0);
        title.setScale(1.5);
        subtitle.setAlpha(0);
        
        this.scene.tweens.add({
            targets: [title, subtitle],
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Power2'
        });
        
        // Fade out after delay
        this.scene.tweens.add({
            targets: [title, subtitle],
            alpha: 0,
            y: '+=30',
            duration: 1000,
            delay: 3000,
            ease: 'Power2',
            onComplete: () => {
                title.destroy();
                subtitle.destroy();
            }
        });
    }
    
    update(dt) {
        if (!this.active || this.deathSequence) return;
        
        // Update 4D rotation
        this.update4DRotation(dt);
        
        // Project 4D vertices to 2D for rendering
        this.projectVertices();
        
        // Render the tesseract (throttled for performance)
        this.renderCounter++;
        if (this.renderCounter >= this.renderInterval) {
            this.renderCounter = 0;
            this.renderTesseract();
        }
        
        // Update face indicators
        this.updateFaceIndicators();
        
        // Core glow pulse
        const pulse = 0.6 + Math.sin(this.scene.time.now / 200) * 0.2;
        this.coreGlow.setAlpha(pulse);
        this.coreGlow.setRotation(this.scene.time.now / 1000);
        
        // Attack patterns
        this.updateAttackPattern(dt);
        
        // Update temporal echoes
        this.updateTemporalEchoes();
        
        // Update fracture clones
        this.updateFractureClones(dt);
        
        // Update paradox fields
        this.updateParadoxFields();
        
        // Update chrono-singularity in phase 4
        if (this.phase === 4) {
            this.updateChronoSingularity(dt);
        }
        
        // Check phase transitions
        this.checkPhaseTransition();
    }
    
    update4DRotation(dt) {
        // Rotate in 4D space - each face rotates in a different plane
        this.rotation4D.xy += this.rotationSpeed.xy * dt;
        this.rotation4D.xz += this.rotationSpeed.xz * dt;
        this.rotation4D.xw += this.rotationSpeed.xw * dt;
        this.rotation4D.yz += this.rotationSpeed.yz * dt;
        
        // Increase rotation speed as boss takes damage (becomes more chaotic)
        const healthPercent = this.getTotalHealthPercent();
        const speedMultiplier = 1 + (1 - healthPercent) * 2;
        
        this.rotationSpeed.xy = 0.3 * speedMultiplier;
        this.rotationSpeed.xz = 0.2 * speedMultiplier;
        this.rotationSpeed.xw = 0.1 * speedMultiplier;
        this.rotationSpeed.yz = 0.15 * speedMultiplier;
    }
    
    projectVertices() {
        // Project 4D vertices to 3D, then to 2D
        const scale = 80; // Size of tesseract
        const distance4D = 3; // 4D projection distance
        
        this.projectedVertices = this.vertices4D.map(v => {
            // Apply 4D rotations (simplified - just rotate in XY and XZ planes)
            let x = v.x;
            let y = v.y;
            let z = v.z;
            let w = Math.sin(this.scene.time.now / 2000) * 0.5; // Animate w coordinate
            
            // XY rotation
            const cosXY = Math.cos(this.rotation4D.xy);
            const sinXY = Math.sin(this.rotation4D.xy);
            const x1 = x * cosXY - y * sinXY;
            const y1 = x * sinXY + y * cosXY;
            x = x1; y = y1;
            
            // XZ rotation
            const cosXZ = Math.cos(this.rotation4D.xz);
            const sinXZ = Math.sin(this.rotation4D.xz);
            const x2 = x * cosXZ - z * sinXZ;
            const z1 = x * sinXZ + z * cosXZ;
            x = x2; z = z1;
            
            // Project from 4D to 3D
            const wProjection = 1 / (distance4D - w);
            x *= wProjection;
            y *= wProjection;
            z *= wProjection;
            
            // Project from 3D to 2D (simple perspective)
            const distance3D = 4;
            const zProjection = 1 / (distance3D - z);
            
            return {
                x: this.x + x * scale * zProjection,
                y: this.y + y * scale * zProjection,
                z: z // Keep z for depth sorting
            };
        });
    }
    
    renderTesseract() {
        this.graphics.clear();
        
        // Define edges of tesseract (which vertices connect)
        // Inner cube: 0-1-3-2-0, 4-5-7-6-4
        // Connecting edges: 0-4, 1-5, 2-6, 3-7
        const edges = [
            [0,1], [1,3], [3,2], [2,0], // Inner square face
            [4,5], [5,7], [7,6], [6,4], // Outer square face  
            [0,4], [1,5], [2,6], [3,7]  // Connecting edges
        ];
        
        // Get current face color based on which face is vulnerable
        const faceColors = [0x00d4ff, 0xffd700, 0xff0066, 0x9d4edd];
        const currentColor = faceColors[this.currentFace];
        const dimColor = 0x444444;
        
        // Draw edges with depth-based opacity
        edges.forEach((edge, index) => {
            const v1 = this.projectedVertices[edge[0]];
            const v2 = this.projectedVertices[edge[1]];
            
            if (!v1 || !v2) return;
            
            // Calculate average z for depth
            const avgZ = (v1.z + v2.z) / 2;
            const alpha = 0.3 + (avgZ + 1) / 2 * 0.7; // 0.3 to 1.0 based on depth
            
            // Color based on edge type and current face
            let color = currentColor;
            let lineWidth = 2;
            
            // Highlight edges of current vulnerable face
            const isFaceEdge = (index >= this.currentFace * 3 && index < (this.currentFace + 1) * 3);
            if (isFaceEdge && !this.invulnerable) {
                lineWidth = 4;
                this.graphics.lineStyle(lineWidth, color, alpha);
            } else {
                // Dim other edges
                const dimmedColor = Phaser.Display.Color.IntegerToColor(currentColor);
                dimmedColor.darken(50);
                this.graphics.lineStyle(1, dimmedColor.color, alpha * 0.5);
            }
            
            this.graphics.lineBetween(v1.x, v1.y, v2.x, v2.y);
        });
        
        // Draw vertices as small circles
        this.projectedVertices.forEach((v, i) => {
            if (!v) return;
            const alpha = 0.5 + (v.z + 1) / 2 * 0.5;
            const size = 3 + (v.z + 1) / 2 * 2;
            this.graphics.fillStyle(currentColor, alpha);
            this.graphics.fillCircle(v.x, v.y, size);
        });
    }
    
    updateFaceIndicators() {
        this.faceIndicators.forEach((indicator, i) => {
            const g = indicator.graphics;
            g.clear();
            
            // Position relative to camera
            const camera = this.scene.cameras.main;
            const x = camera.width / 2 + indicator.offset.x;
            const y = 60 + indicator.offset.y;
            
            // Background
            g.fillStyle(0x000000, 0.7);
            g.fillRoundedRect(x - 25, y - 8, 50, 16, 4);
            
            // Health bar
            const healthPercent = this.faceHealth[i] / this.faceMaxHealth;
            const healthWidth = 46 * healthPercent;
            
            if (healthPercent > 0) {
                const color = i === this.currentFace ? indicator.color : 0x444444;
                g.fillStyle(color, i === this.currentFace ? 1 : 0.3);
                g.fillRoundedRect(x - 23, y - 6, healthWidth, 12, 2);
            }
            
            // Active indicator glow
            if (i === this.currentFace && !this.invulnerable) {
                g.lineStyle(2, indicator.color, 0.8);
                g.strokeRoundedRect(x - 25, y - 8, 50, 16, 4);
            }
        });
    }
    
    updateAttackPattern(dt) {
        if (this.transitioning || this.invulnerable) return;
        
        this.attackTimer += dt * 1000;
        
        if (this.attackTimer >= this.attackCooldown) {
            this.executeAttack();
            this.scheduleNextAttack();
        }
    }
    
    scheduleNextAttack() {
        this.attackTimer = 0;
        // Cooldown decreases as boss gets damaged (more aggressive)
        const healthPercent = this.getTotalHealthPercent();
        this.attackCooldown = 1500 + healthPercent * 1500; // 1.5-3 seconds
    }
    
    executeAttack() {
        // Choose attack based on current phase
        switch (this.phase) {
            case 1:
                this.attackTemporalEcho();
                break;
            case 2:
                // Randomly choose between temporal echo and fracture
                if (Math.random() < 0.5) {
                    this.attackTemporalEcho();
                } else {
                    this.attackFractureClone();
                }
                break;
            case 3:
                // Randomly choose any attack including paradox
                const roll = Math.random();
                if (roll < 0.4) {
                    this.attackTemporalEcho();
                } else if (roll < 0.7) {
                    this.attackFractureClone();
                } else {
                    this.attackParadoxField();
                }
                break;
            case 4:
                // All attacks including singularity pull
                this.attackChronoBurst();
                break;
        }
    }
    
    /**
     * Phase 1 Attack: Temporal Echo
     * Fires bullets that leave persistent "echo" trails
     * These echoes fire again after a delay
     */
    attackTemporalEcho() {
        const bulletCount = 8 + this.phase * 4;
        const baseAngle = Math.random() * Math.PI * 2;
        
        // Telegraph the attack
        this.telegraphAttack('ECHO VOLLEY');
        
        this.scene.time.delayedCall(800, () => {
            for (let i = 0; i < bulletCount; i++) {
                const angle = baseAngle + (i / bulletCount) * Math.PI * 2;
                
                // Spawn bullet
                const bullet = this.scene.spawnEnemyBullet(
                    this.x, this.y, angle, 300
                );
                
                if (bullet) {
                    // Mark as temporal echo - it will respawn after delay
                    bullet.isTemporalEcho = true;
                    bullet.echoDelay = 1500;
                    bullet.echoSpawnTime = this.scene.time.now + bullet.echoDelay;
                    bullet.echoAngle = angle;
                    bullet.echoSpeed = 250;
                    
                    // Visual indicator - cyan tint
                    bullet.setTint(0x00d4ff);
                    
                    this.temporalEchoes.push(bullet);
                }
            }
            
            // Screen shake
            this.scene.cameras.main.shake(150, 0.005);
        });
    }
    
    /**
     * Phase 2 Attack: Fracture Clone
     * Boss splits into 3 shadow copies that fire simultaneously
     */
    attackFractureClone() {
        this.telegraphAttack('FRACTURE PROTOCOL');
        
        this.scene.time.delayedCall(1000, () => {
            const cloneCount = 3;
            const radius = 150;
            
            for (let i = 0; i < cloneCount; i++) {
                const angle = (i / cloneCount) * Math.PI * 2;
                const cx = this.x + Math.cos(angle) * radius;
                const cy = this.y + Math.sin(angle) * radius;
                
                // Create clone visual
                const clone = this.scene.add.graphics();
                clone.setDepth(45);
                
                // Draw hexagon shape
                const drawHexagon = () => {
                    clone.clear();
                    clone.lineStyle(2, 0xff0066, 0.7);
                    
                    for (let j = 0; j < 6; j++) {
                        const a1 = (j / 6) * Math.PI * 2;
                        const a2 = ((j + 1) / 6) * Math.PI * 2;
                        clone.lineBetween(
                            cx + Math.cos(a1) * 30,
                            cy + Math.sin(a1) * 30,
                            cx + Math.cos(a2) * 30,
                            cy + Math.sin(a2) * 30
                        );
                    }
                };
                
                drawHexagon();
                
                // Clone fires bullets at player
                const playerAngle = Phaser.Math.Angle.Between(cx, cy, 
                    this.scene.player.x, this.scene.player.y);
                
                for (let j = 0; j < 5; j++) {
                    const spread = (j - 2) * 0.2;
                    this.scene.spawnEnemyBullet(cx, cy, playerAngle + spread, 280);
                }
                
                // Clone fades after firing
                this.scene.tweens.add({
                    targets: { alpha: 0.7 },
                    alpha: 0,
                    duration: 1000,
                    onUpdate: (tween) => {
                        clone.alpha = tween.getValue();
                        drawHexagon();
                    },
                    onComplete: () => clone.destroy()
                });
                
                this.fractureClones.push({
                    graphics: clone,
                    x: cx,
                    y: cy,
                    birthTime: this.scene.time.now,
                    duration: 1000
                });
            }
            
            // Screen shake
            this.scene.cameras.main.shake(200, 0.008);
        });
    }
    
    /**
     * Phase 3 Attack: Paradox Field
     * Creates zones where bullets reverse direction
     */
    attackParadoxField() {
        this.telegraphAttack('PARADOX FIELD');
        
        this.scene.time.delayedCall(1200, () => {
            const fieldCount = 2;
            
            for (let i = 0; i < fieldCount; i++) {
                // Position near player but not on top
                const angle = Math.random() * Math.PI * 2;
                const dist = 150 + Math.random() * 100;
                const fx = this.scene.player.x + Math.cos(angle) * dist;
                const fy = this.scene.player.y + Math.sin(angle) * dist;
                
                // Clamp to arena
                const x = Phaser.Math.Clamp(fx, 100, 1820);
                const y = Phaser.Math.Clamp(fy, 100, 1340);
                
                // Create field visual
                const field = this.scene.add.graphics();
                field.setDepth(40);
                
                // Draw rotating circle with arrows
                const drawField = (rotation) => {
                    field.clear();
                    
                    // Outer ring
                    field.lineStyle(3, 0xffd700, 0.6);
                    field.strokeCircle(x, y, 80);
                    
                    // Inner rotating arrows
                    field.lineStyle(2, 0xffd700, 0.8);
                    for (let a = 0; a < 4; a++) {
                        const angle = rotation + (a / 4) * Math.PI * 2;
                        const x1 = x + Math.cos(angle) * 50;
                        const y1 = y + Math.sin(angle) * 50;
                        const x2 = x + Math.cos(angle + 0.5) * 50;
                        const y2 = y + Math.sin(angle + 0.5) * 50;
                        field.lineBetween(x1, y1, x2, y2);
                    }
                    
                    // Center swirl
                    field.fillStyle(0xffd700, 0.2);
                    field.fillCircle(x, y, 30);
                };
                
                let rotation = 0;
                const updateInterval = this.scene.time.addEvent({
                    delay: 16,
                    callback: () => {
                        rotation += 0.05;
                        drawField(rotation);
                    },
                    loop: true
                });
                
                // Field lasts 5 seconds
                this.scene.time.delayedCall(5000, () => {
                    updateInterval.remove();
                    
                    // Fade out
                    this.scene.tweens.add({
                        targets: { alpha: 1 },
                        alpha: 0,
                        duration: 500,
                        onUpdate: (tween) => {
                            field.alpha = tween.getValue();
                        },
                        onComplete: () => field.destroy()
                    });
                });
                
                this.paradoxFields.push({
                    x, y, radius: 80,
                    graphics: field,
                    birthTime: this.scene.time.now,
                    duration: 5000
                });
            }
            
            // Also fire some bullets
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                this.scene.spawnEnemyBullet(this.x, this.y, angle, 350);
            }
        });
    }
    
    /**
     * Phase 4 Attack: Chrono Burst
     * Rapid-fire bullets with increasing speed
     */
    attackChronoBurst() {
        this.telegraphAttack('CHRONO-SINGULARITY');
        
        // Multiple rapid bursts
        for (let burst = 0; burst < 3; burst++) {
            this.scene.time.delayedCall(burst * 600, () => {
                const bulletCount = 12;
                const baseAngle = (burst * 0.5) + this.scene.time.now / 1000;
                const speed = 300 + burst * 100;
                
                for (let i = 0; i < bulletCount; i++) {
                    const angle = baseAngle + (i / bulletCount) * Math.PI * 2;
                    const bullet = this.scene.spawnEnemyBullet(
                        this.x, this.y, angle, speed
                    );
                    
                    if (bullet) {
                        bullet.setTint(0xff0066);
                    }
                }
                
                this.scene.cameras.main.shake(100, 0.005 + burst * 0.003);
            });
        }
        
        // Start singularity pull effect
        this.singularityRadius = 400;
        this.singularityPull = 100;
    }
    
    updateChronoSingularity(dt) {
        // Pull player toward boss center
        const player = this.scene.player;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0 && dist < this.singularityRadius) {
            const pullForce = this.singularityPull * (1 - dist / this.singularityRadius);
            player.body.velocity.x += (dx / dist) * pullForce * dt;
            player.body.velocity.y += (dy / dist) * pullForce * dt;
        }
        
        // Visual - draw singularity rings
        this.warningGraphics.clear();
        const time = this.scene.time.now / 1000;
        
        for (let i = 0; i < 3; i++) {
            const radius = this.singularityRadius * (0.5 + i * 0.25);
            const alpha = 0.2 + Math.sin(time * 2 + i) * 0.1;
            this.warningGraphics.lineStyle(2, 0xff0066, alpha);
            this.warningGraphics.strokeCircle(this.x, this.y, radius);
        }
    }
    
    telegraphAttack(name) {
        // Show warning text
        const warning = this.scene.add.text(this.x, this.y - 120, name, {
            fontFamily: 'monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            fill: '#ff4444',
            align: 'center'
        }).setOrigin(0.5);
        
        warning.setAlpha(0);
        warning.setScale(0.8);
        
        this.scene.tweens.add({
            targets: warning,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Power2',
            yoyo: true,
            hold: 400
        });
        
        this.scene.tweens.add({
            targets: warning,
            alpha: 0,
            y: warning.y - 20,
            duration: 400,
            delay: 800,
            onComplete: () => warning.destroy()
        });
        
        // Flash warning ring
        this.warningGraphics.clear();
        this.warningGraphics.lineStyle(3, 0xff4444, 0.8);
        this.warningGraphics.strokeCircle(this.x, this.y, 100);
        
        this.scene.tweens.add({
            targets: { radius: 100, alpha: 0.8 },
            radius: 200,
            alpha: 0,
            duration: 800,
            onUpdate: (tween) => {
                this.warningGraphics.clear();
                this.warningGraphics.lineStyle(3, 0xff4444, tween.getValue());
                this.warningGraphics.strokeCircle(this.x, this.y, 100 + tween.getValue() * 100);
            }
        });
    }
    
    updateTemporalEchoes() {
        // Process bullets that should echo
        this.temporalEchoes = this.temporalEchoes.filter(bullet => {
            if (!bullet.active || !bullet.echoSpawnTime) return false;
            
            // Check if it's time to echo
            if (this.scene.time.now >= bullet.echoSpawnTime && !bullet.echoed) {
                bullet.echoed = true;
                
                // Spawn echo bullet from where this bullet currently is
                const echo = this.scene.spawnEnemyBullet(
                    bullet.x, bullet.y,
                    bullet.echoAngle, bullet.echoSpeed
                );
                
                if (echo) {
                    echo.setTint(0x00d4ff);
                    echo.isEcho = true;
                }
                
                // Visual flash at echo point
                const flash = this.scene.add.graphics();
                flash.fillStyle(0x00d4ff, 0.5);
                flash.fillCircle(bullet.x, bullet.y, 20);
                flash.setDepth(10);
                
                this.scene.tweens.add({
                    targets: flash,
                    alpha: 0,
                    scale: 2,
                    duration: 300,
                    onComplete: () => flash.destroy()
                });
            }
            
            return true;
        });
    }
    
    updateFractureClones(dt) {
        const now = this.scene.time.now;
        this.fractureClones = this.fractureClones.filter(clone => {
            const age = now - clone.birthTime;
            if (age > clone.duration) {
                if (clone.graphics && clone.graphics.active) {
                    clone.graphics.destroy();
                }
                return false;
            }
            return true;
        });
    }
    
    updateParadoxFields() {
        const now = this.scene.time.now;
        this.paradoxFields = this.paradoxFields.filter(field => {
            const age = now - field.birthTime;
            if (age > field.duration) {
                return false;
            }
            
            // Reverse bullets that enter the field
            this.scene.enemyBullets.children.entries.forEach(bullet => {
                if (!bullet.active) return;
                
                const dist = Phaser.Math.Distance.Between(
                    bullet.x, bullet.y, field.x, field.y
                );
                
                if (dist < field.radius && !bullet.inParadoxField) {
                    bullet.inParadoxField = true;
                    
                    // Reverse velocity
                    bullet.body.velocity.x *= -0.5;
                    bullet.body.velocity.y *= -0.5;
                    
                    // Visual feedback
                    bullet.setTint(0xffd700);
                    
                    // Mark for cleanup after leaving field
                    this.scene.time.delayedCall(500, () => {
                        if (bullet.active) {
                            bullet.inParadoxField = false;
                            bullet.setTint(0xff3366);
                        }
                    });
                }
            });
            
            return true;
        });
    }
    
    /**
     * Take damage from player bullets
     * Only the current vulnerable face takes damage
     */
    takeDamage(amount) {
        if (!this.active || this.invulnerable || this.deathSequence) return false;
        
        // Check if player can hit the current face
        if (this.faceHealth[this.currentFace] <= 0) {
            this.advanceFace();
            return false;
        }
        
        // Apply damage to current face
        this.faceHealth[this.currentFace] -= amount;
        this.totalHealth -= amount;
        
        // Visual feedback
        this.flashDamage();
        
        // Screen shake proportional to damage
        this.scene.cameras.main.shake(50, 0.003);
        
        // Check if face is destroyed
        if (this.faceHealth[this.currentFace] <= 0) {
            this.faceHealth[this.currentFace] = 0;
            this.onFaceDestroyed(this.currentFace);
        }
        
        // Observe damage (for Observer Effect)
        if (this.scene.observerEffect) {
            this.scene.observerEffect.observeTemporalUse('bossDamage', {
                face: this.currentFace,
                damage: amount,
                remaining: this.faceHealth[this.currentFace]
            });
        }
        
        return true;
    }
    
    advanceFace() {
        // Find next face with health
        let found = false;
        for (let i = 0; i < 4; i++) {
            const nextFace = (this.currentFace + i + 1) % 4;
            if (this.faceHealth[nextFace] > 0) {
                this.currentFace = nextFace;
                found = true;
                break;
            }
        }
        
        if (!found) {
            // All faces destroyed - trigger death
            this.startDeathSequence();
        }
    }
    
    onFaceDestroyed(faceIndex) {
        // Face death visual
        const colors = [0x00d4ff, 0xffd700, 0xff0066, 0x9d4edd];
        const color = colors[faceIndex];
        
        // Death explosion for face
        const explosion = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 1.5, end: 0 },
            alpha: { start: 1, end: 0 },
            speed: { min: 100, max: 250 },
            lifespan: 800,
            tint: color,
            quantity: 30,
            blendMode: 'ADD'
        });
        explosion.emitParticleAt(this.x, this.y);
        
        // Delayed explosion cleanup
        this.scene.time.delayedCall(1000, () => explosion.destroy());
        
        // Advance to next face
        this.scene.time.delayedCall(500, () => this.advanceFace());
        
        // Boss enters brief invulnerability
        this.invulnerable = true;
        this.coreGlow.setTint(0x888888);
        
        this.scene.time.delayedCall(2000, () => {
            this.invulnerable = false;
            this.coreGlow.setTint(0xff0066);
        });
        
        // Show face destroyed text
        const faceNames = ['CYAN', 'GOLD', 'CRIMSON', 'VIOLET'];
        const text = this.scene.add.text(this.x, this.y - 200, 
            `${faceNames[faceIndex]} FACE SHATTERED`, {
            fontFamily: 'monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        text.setAlpha(0);
        text.setScale(0.8);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Power2'
        });
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 50,
            duration: 1000,
            delay: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Screen flash
        this.scene.cameras.main.flash(500, 
            (color >> 16) & 0xff,
            (color >> 8) & 0xff,
            color & 0xff,
            0.5
        );
        
        // Strong screen shake
        this.scene.cameras.main.shake(500, 0.015);
    }
    
    flashDamage() {
        // Brief white flash on tesseract
        const originalColors = [...this.faceIndicators.map(f => f.color)];
        
        this.faceIndicators.forEach(f => {
            f.color = 0xffffff;
        });
        
        this.scene.time.delayedCall(50, () => {
            const colors = [0x00d4ff, 0xffd700, 0xff0066, 0x9d4edd];
            this.faceIndicators.forEach((f, i) => {
                f.color = colors[i];
            });
        });
    }
    
    checkPhaseTransition() {
        const healthPercent = this.getTotalHealthPercent();
        const newPhase = Math.max(1, Math.ceil((1 - healthPercent) * 4));
        
        if (newPhase !== this.phase && newPhase > this.phase) {
            this.transitionPhase(newPhase);
        }
    }
    
    transitionPhase(newPhase) {
        this.phase = newPhase;
        this.transitioning = true;
        
        const phaseNames = [
            'TEMPORAL AWAKENING',
            'FRACTURE PROTOCOL',
            'PARADOX CASCADE',
            'CHRONO-SINGULARITY'
        ];
        
        // Announce phase transition
        const title = this.scene.add.text(this.x, this.y - 180, 
            `PHASE ${newPhase}: ${phaseNames[newPhase - 1]}`, {
            fontFamily: 'monospace',
            fontSize: '28px',
            fontStyle: 'bold',
            fill: '#ff0066',
            align: 'center'
        }).setOrigin(0.5);
        
        title.setAlpha(0);
        title.setScale(1.3);
        
        this.scene.tweens.add({
            targets: title,
            alpha: 1,
            scale: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        this.scene.tweens.add({
            targets: title,
            alpha: 0,
            y: title.y - 40,
            duration: 1000,
            delay: 2000,
            ease: 'Power2',
            onComplete: () => {
                title.destroy();
                this.transitioning = false;
            }
        });
        
        // Visual transition effect
        this.scene.cameras.main.flash(800, 255, 0, 100, 0.5);
        this.scene.cameras.main.shake(800, 0.01);
        
        // Resonance Orb System: Drop orb on boss phase transition
        if (this.scene.resonanceOrbs) {
            this.scene.resonanceOrbs.onBossPhaseTransition(this.x, this.y);
        }
        
        // Temporarily stop attacks during transition
        this.invulnerable = true;
        this.scene.time.delayedCall(3000, () => {
            this.invulnerable = false;
        });
        
        // Observe phase change
        if (this.scene.observerEffect) {
            this.scene.observerEffect.observeTemporalUse('bossPhaseChange', {
                phase: newPhase,
                healthPercent: this.getTotalHealthPercent()
            });
        }
    }
    
    getTotalHealthPercent() {
        return this.totalHealth / 2000;
    }
    
    /**
     * Get hit box for collision detection
     * Returns radius for circular collision
     */
    getHitRadius() {
        return 60; // Core hit radius
    }
    
    /**
     * Check if a point hits the boss
     */
    checkHit(x, y, radius = 0) {
        if (!this.active || this.invulnerable) return false;
        
        const dist = Phaser.Math.Distance.Between(x, y, this.x, this.y);
        return dist < (this.getHitRadius() + radius);
    }
    
    startDeathSequence() {
        this.deathSequence = true;
        
        // FINAL DEATH SEQUENCE
        const deathText = this.scene.add.text(this.x, this.y - 200, 
            'TESSERACT COLLAPSE', {
            fontFamily: 'monospace',
            fontSize: '36px',
            fontStyle: 'bold',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        deathText.setAlpha(0);
        deathText.setScale(0.5);
        
        this.scene.tweens.add({
            targets: deathText,
            alpha: 1,
            scale: 1.2,
            duration: 800,
            ease: 'Power3'
        });
        
        // Explosion sequence
        let explosionCount = 0;
        const explosionInterval = this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                explosionCount++;
                
                // Random position around boss
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 100;
                const ex = this.x + Math.cos(angle) * dist;
                const ey = this.y + Math.sin(angle) * dist;
                
                const explosion = this.scene.add.particles(0, 0, 'particle', {
                    scale: { start: 2, end: 0 },
                    alpha: { start: 1, end: 0 },
                    speed: { min: 150, max: 400 },
                    lifespan: 1000,
                    tint: 0xff0066,
                    quantity: 20,
                    blendMode: 'ADD'
                });
                explosion.emitParticleAt(ex, ey);
                
                this.scene.cameras.main.shake(150, 0.02);
                
                if (explosionCount >= 15) {
                    explosionInterval.remove();
                    this.completeDeath(deathText);
                }
            },
            loop: true
        });
        
        // Shrink core
        this.scene.tweens.add({
            targets: this.coreGlow,
            scale: 0,
            duration: 3000,
            ease: 'Power2'
        });
    }
    
    completeDeath(deathText) {
        // Final massive explosion
        const finalExplosion = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 3, end: 0 },
            alpha: { start: 1, end: 0 },
            speed: { min: 300, max: 800 },
            lifespan: 2000,
            tint: 0xffffff,
            quantity: 100,
            blendMode: 'ADD'
        });
        finalExplosion.emitParticleAt(this.x, this.y);
        
        this.scene.cameras.main.shake(1000, 0.03);
        this.scene.cameras.main.flash(1000, 255, 255, 255, 0.8);
        
        // Award massive points
        if (this.scene.score !== undefined) {
            this.scene.score += 10000;
        }
        
        // Notify scene of victory for inscription
        if (this.scene.inscriptionProtocol) {
            this.scene.inscriptionProtocol.requestInscription('victory', {
                bossName: 'Tesseract Titan',
                finalScore: this.scene.score,
                sessionDuration: Date.now() - (this.scene.inscriptionProtocol?.sessionStartTime || Date.now())
            });
        }
        
        // Show victory text
        deathText.setText('TESSERACT DESTROYED');
        deathText.setFill('#00d4ff');
        
        this.scene.tweens.add({
            targets: deathText,
            alpha: 0,
            y: deathText.y - 100,
            duration: 2000,
            delay: 2000,
            ease: 'Power2',
            onComplete: () => deathText.destroy()
        });
        
        // Cleanup
        this.scene.time.delayedCall(3000, () => {
            this.destroy();
        });
        
        // Observe boss defeat
        if (this.scene.observerEffect) {
            this.scene.observerEffect.observeTemporalUse('bossDefeat', {
                bossName: 'TESSERACT TITAN',
                scoreBonus: 10000
            });
        }
        
        // Award score popup
        const scoreText = this.scene.add.text(this.x, this.y, '+10000', {
            fontFamily: 'monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            fill: '#00d4ff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: scoreText,
            y: scoreText.y - 150,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => scoreText.destroy()
        });
    }
    
    destroy() {
        this.active = false;
        
        if (this.graphics) this.graphics.destroy();
        if (this.warningGraphics) this.warningGraphics.destroy();
        if (this.coreGlow) this.coreGlow.destroy();
        if (this.coreParticles) this.coreParticles.destroy();
        
        this.faceIndicators.forEach(f => {
            if (f.graphics) f.graphics.destroy();
        });
        
        // Clean up any remaining echoes, clones, fields
        this.temporalEchoes = [];
        this.fractureClones.forEach(c => {
            if (c.graphics) c.graphics.destroy();
        });
        this.paradoxFields.forEach(f => {
            if (f.graphics) f.graphics.destroy();
        });
    }
}
