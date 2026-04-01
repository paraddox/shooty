import Phaser from 'phaser';

/**
 * Bootstrap Protocol — The Retrocausal Discovery Engine
 * 
 * MIGRATED to UnifiedGraphicsManager (2026-04-01):
 * - momentumArc rendering now uses UnifiedGraphicsManager on 'effects' layer
 * - Removed echoGraphics graphics object (not needed, uses containers)
 * - graphics.clear() calls removed for UnifiedGraphicsManager compatibility
 * 
 * THE MISSING DIMENSION: Effects that manifest BEFORE their causes.
 * 
 * Core Mechanic: The game generates "Future Echoes" — ghostly fragments 
 * of things that WILL happen in 10-30 seconds. These echoes appear in 
 * the present as pale, translucent visions.
 * 
 * The Bootstrap Paradox: By heeding these echoes (avoiding ghost bullets 
 * that haven't spawned yet, positioning where ghost enemies WILL be), 
 * the player CAUSES the future they witnessed — completing a genuine 
 * bootstrap paradox where effect precedes cause.
 * 
 * Example: You see ghost bullets passing through a spot. You avoid that 
 * spot. 15 seconds later, real bullets follow the exact path you saw. 
 * Your avoidance CAUSED the bullets to be fired there (AI adapts).
 * 
 * This is fundamentally different from Oracle Protocol (shows enemy spawns 
 * to prepare for) — here, the player experiences the CONSEQUENCE before 
 * the CHOICE, and the choice is motivated by having already experienced 
 * the consequence.
 * 
 * Color: Bootstrap Amber (#ffaa00) — warm golden-orange representing 
 * temporal paradox energy. Distinct from Oracle gold (#ffd700) and 
 * Echo Storm gold.
 */

export default class BootstrapProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.BOOTSTRAP_COLOR = 0xffaa00;      // Amber paradox energy
        this.BOOTSTRAP_GLOW = 0xffcc66;       // Lighter amber
        this.PREMONITION_COLOR = 0xffaa0080;  // Semi-transparent amber
        this.DISSONANCE_COLOR = 0xff4444;     // Red for paradox collapse
        
        // Bootstrap state
        this.isActive = false;
        this.bootstrapLevel = 0;              // 0-10 based on prophecy fulfillment
        this.paradoxMomentum = 0;               // Builds when fulfilling prophecies
        
        // Future Echo tracking
        this.futureEchoes = [];               // Active ghost fragments
        this.propheciesFulfilled = 0;
        this.propheciesIgnored = 0;
        
        // Timing
        this.bootstrapTimer = 0;
        this.bootstrapInterval = 12;          // Generate echoes every 12 seconds
        this.prophecyHorizon = 15;            // Seconds into future
        this.echoLifespan = 8;                // Seconds echo remains visible
        
        // Visuals
        this.echoGraphics = null;
        this.connectionLines = [];
        this.particleEmitters = [];
        
        // UI
        this.bootstrapIndicator = null;
        this.paradoxText = null;
        
        // Audio synthesis (procedural)
        this.resonanceOscillator = null;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.createUI();
        this.setupAudio();
    }
    
    createVisuals() {
        // Note: Echo rendering uses container-based visuals (not graphics objects)
        // Graphics rendering handled by UnifiedGraphicsManager for UI elements
        
        // Echo particle texture
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Radial gradient for ethereal echo
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 170, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 170, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 170, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        this.scene.textures.addCanvas('echoParticle', canvas);
        
        // Bootstrap glow texture (larger, softer)
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 64;
        glowCanvas.height = 64;
        const glowCtx = glowCanvas.getContext('2d');
        const glowGrad = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        glowGrad.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
        glowGrad.addColorStop(1, 'rgba(255, 170, 0, 0)');
        glowCtx.fillStyle = glowGrad;
        glowCtx.fillRect(0, 0, 64, 64);
        
        this.scene.textures.addCanvas('bootstrapGlow', glowCanvas);
    }
    
    createUI() {
        // Bootstrap indicator - circular gauge showing paradox momentum
        const x = this.scene.cameras.main.width - 60;
        const y = 80;
        
        this.bootstrapIndicator = this.scene.add.container(x, y);
        this.bootstrapIndicator.setScrollFactor(0);
        this.bootstrapIndicator.setDepth(100);
        
        // Background ring
        const bgRing = this.scene.add.circle(0, 0, 20, 0x22222a, 0.8);
        bgRing.setStrokeStyle(2, 0x444455);
        this.bootstrapIndicator.add(bgRing);
        
        // Note: momentumArc now rendered via UnifiedGraphicsManager (see updateUI)
        // Store position for UnifiedGraphicsManager rendering
        this.indicatorPos = { x, y };
        
        // Center icon
        const icon = this.scene.add.text(0, 0, '⟲', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#ffaa00'
        }).setOrigin(0.5);
        this.bootstrapIndicator.add(icon);
        
        // Bootstrap level text
        this.levelText = this.scene.add.text(0, 28, '0', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#ffaa00'
        }).setOrigin(0.5);
        this.bootstrapIndicator.add(this.levelText);
        
        // Paradox text (floating announcements)
        this.paradoxText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 - 100,
            '', {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#ffaa00'
            }
        ).setOrigin(0.5);
        this.paradoxText.setScrollFactor(0);
        this.paradoxText.setDepth(100);
        this.paradoxText.setAlpha(0);
    }
    
    setupAudio() {
        // Audio context for procedural paradox resonance
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            this.audioContext = null;
        }
    }
    
    update(dt) {
        const now = this.scene.time.now / 1000;
        
        // Generate future echoes on interval
        this.bootstrapTimer += dt;
        if (this.bootstrapTimer >= this.bootstrapInterval) {
            this.generateFutureEcho();
            this.bootstrapTimer = 0;
            
            // Interval decreases slightly as level increases (more frequent)
            this.bootstrapInterval = Math.max(8, 12 - this.bootstrapLevel * 0.3);
        }
        
        // Update existing echoes
        this.updateEchoes(dt, now);
        
        // Check for prophecy fulfillment
        this.checkProphecyFulfillment();
        
        // Update UI
        this.updateUI();
        
        // Decay paradox momentum
        this.paradoxMomentum = Math.max(0, this.paradoxMomentum - dt * 2);
    }
    
    generateFutureEcho() {
        // Generate 1-3 ghost fragments based on bootstrap level
        const echoCount = Math.min(3, 1 + Math.floor(this.bootstrapLevel / 3));
        
        for (let i = 0; i < echoCount; i++) {
            this.createEchoFragment();
        }
        
        // Trigger resonance cascade notification
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('BOOTSTRAP_ECHO', {
                count: echoCount,
                level: this.bootstrapLevel
            });
        }
        
        // Show "FUTURE ECHO" text
        this.showParadoxText('FUTURE ECHO', 0.5);
    }
    
    createEchoFragment() {
        const player = this.scene.player;
        const worldWidth = 1920;
        const worldHeight = 1440;
        
        // Generate echo at semi-random position weighted toward player area
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 300;
        const baseX = player.x + Math.cos(angle) * distance;
        const baseY = player.y + Math.sin(angle) * distance;
        
        // Clamp to world bounds
        const x = Phaser.Math.Clamp(baseX, 50, worldWidth - 50);
        const y = Phaser.Math.Clamp(baseY, 50, worldHeight - 50);
        
        // Echo type determines what it represents
        const echoTypes = ['bullet_path', 'enemy_spawn', 'danger_zone', 'safe_corridor'];
        const type = echoTypes[Math.floor(Math.random() * echoTypes.length)];
        
        const echo = {
            id: Date.now() + Math.random(),
            x, y,
            type,
            birthTime: this.scene.time.now / 1000,
            fulfillmentTime: this.scene.time.now / 1000 + this.prophecyHorizon,
            fulfilled: false,
            ignored: false,
            visual: null,
            data: this.generateEchoData(type, x, y)
        };
        
        // Create visual representation
        this.createEchoVisual(echo);
        
        this.futureEchoes.push(echo);
        
        // Play echo spawn sound (subtle resonance)
        this.playResonanceTone(200 + Math.random() * 100, 0.1);
    }
    
    generateEchoData(type, x, y) {
        const player = this.scene.player;
        
        switch (type) {
            case 'bullet_path':
                // Predict bullet trajectory from nearest enemy direction
                const nearestEnemy = this.findNearestEnemy(x, y);
                let angle;
                if (nearestEnemy) {
                    angle = Phaser.Math.Angle.Between(
                        nearestEnemy.x, nearestEnemy.y, x, y
                    );
                } else {
                    angle = Math.random() * Math.PI * 2;
                }
                return {
                    startX: x - Math.cos(angle) * 200,
                    startY: y - Math.sin(angle) * 200,
                    endX: x + Math.cos(angle) * 200,
                    endY: y + Math.sin(angle) * 200,
                    angle
                };
                
            case 'enemy_spawn':
                // Ghost enemy position
                return {
                    enemyType: Math.random() > 0.5 ? 'chaser' : 'shooter',
                    health: 60 + Math.random() * 40
                };
                
            case 'danger_zone':
                // Area that will be dangerous
                return {
                    radius: 60 + Math.random() * 40,
                    intensity: 0.5 + Math.random() * 0.5
                };
                
            case 'safe_corridor':
                // Path through bullet pattern
                const corridorAngle = Math.atan2(player.y - y, player.x - x);
                return {
                    width: 40 + Math.random() * 30,
                    angle: corridorAngle,
                    length: 150 + Math.random() * 100
                };
                
            default:
                return {};
        }
    }
    
    createEchoVisual(echo) {
        const container = this.scene.add.container(echo.x, echo.y);
        container.setDepth(25);
        
        const age = 0;
        const alpha = 0.6;
        
        switch (echo.type) {
            case 'bullet_path':
                // Ghost bullet trajectory line
                const line = this.scene.add.graphics();
                line.lineStyle(3, this.BOOTSTRAP_COLOR, alpha * 0.5);
                line.lineBetween(
                    echo.data.startX - echo.x, echo.data.startY - echo.y,
                    echo.data.endX - echo.x, echo.data.endY - echo.y
                );
                
                // Ghost bullets along path
                for (let i = 0; i < 5; i++) {
                    const t = i / 4;
                    const bx = (echo.data.startX - echo.x) * (1 - t) + (echo.data.endX - echo.x) * t;
                    const by = (echo.data.startY - echo.y) * (1 - t) + (echo.data.endY - echo.y) * t;
                    const ghost = this.scene.add.circle(bx, by, 4, this.BOOTSTRAP_COLOR, alpha * 0.4);
                    line.fillStyle(this.BOOTSTRAP_COLOR, alpha * 0.3);
                    line.fillCircle(bx, by, 4);
                }
                
                container.add(line);
                break;
                
            case 'enemy_spawn':
                // Ghost enemy outline
                const ghostEnemy = this.scene.add.graphics();
                ghostEnemy.lineStyle(2, this.BOOTSTRAP_COLOR, alpha);
                
                if (echo.data.enemyType === 'chaser') {
                    // Triangle for chaser
                    ghostEnemy.beginPath();
                    ghostEnemy.moveTo(0, -15);
                    ghostEnemy.lineTo(12, 10);
                    ghostEnemy.lineTo(-12, 10);
                    ghostEnemy.closePath();
                    ghostEnemy.strokePath();
                } else {
                    // Square for shooter
                    ghostEnemy.strokeRect(-10, -10, 20, 20);
                }
                
                // Pulsing glow
                const glow = this.scene.add.image(0, 0, 'bootstrapGlow');
                glow.setAlpha(0.3);
                glow.setScale(0.8);
                container.add([glow, ghostEnemy]);
                break;
                
            case 'danger_zone':
                // Warning zone
                const zone = this.scene.add.graphics();
                zone.lineStyle(2, 0xff4444, alpha * 0.6);
                zone.strokeCircle(0, 0, echo.data.radius);
                zone.fillStyle(0xff4444, alpha * 0.15);
                zone.fillCircle(0, 0, echo.data.radius);
                
                // Warning symbol
                const warning = this.scene.add.text(0, 0, '✕', {
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    fill: '#ff4444'
                }).setOrigin(0.5).setAlpha(alpha);
                
                container.add([zone, warning]);
                break;
                
            case 'safe_corridor':
                // Safe path indicator
                const corridor = this.scene.add.graphics();
                corridor.lineStyle(3, 0x00f0ff, alpha * 0.5);
                
                const halfWidth = echo.data.width / 2;
                const cos = Math.cos(echo.data.angle);
                const sin = Math.sin(echo.data.angle);
                const len = echo.data.length / 2;
                
                corridor.beginPath();
                corridor.moveTo((-len * cos) - (halfWidth * sin), (-len * sin) + (halfWidth * cos));
                corridor.lineTo((len * cos) - (halfWidth * sin), (len * sin) + (halfWidth * cos));
                corridor.lineTo((len * cos) + (halfWidth * sin), (len * sin) - (halfWidth * cos));
                corridor.lineTo((-len * cos) + (halfWidth * sin), (-len * sin) - (halfWidth * cos));
                corridor.closePath();
                corridor.strokePath();
                corridor.fillStyle(0x00f0ff, alpha * 0.1);
                corridor.fillPath();
                
                // Direction arrow
                const arrow = this.scene.add.text(0, 0, '→', {
                    fontFamily: 'monospace',
                    fontSize: '20px',
                    fill: '#00f0ff'
                }).setOrigin(0.5).setAlpha(alpha);
                arrow.setRotation(echo.data.angle);
                
                container.add([corridor, arrow]);
                break;
        }
        
        // Add label
        const label = this.scene.add.text(0, -30, echo.type.replace('_', ' ').toUpperCase(), {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#ffaa00'
        }).setOrigin(0.5).setAlpha(alpha * 0.7);
        container.add(label);
        
        // Breathing animation
        this.scene.tweens.add({
            targets: container,
            scaleX: 1.05,
            scaleY: 1.05,
            alpha: alpha * 0.8,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        echo.visual = container;
    }
    
    updateEchoes(dt, now) {
        this.futureEchoes = this.futureEchoes.filter(echo => {
            const age = now - echo.birthTime;
            const remaining = this.echoLifespan - age;
            
            if (remaining <= 0 || echo.fulfilled || echo.ignored) {
                // Fade out and destroy
                if (echo.visual && echo.visual.active) {
                    this.scene.tweens.add({
                        targets: echo.visual,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            if (echo.visual && echo.visual.active) {
                                echo.visual.destroy();
                            }
                        }
                    });
                }
                return false;
            }
            
            // Fade in first second, fade out last second
            let alpha = 0.6;
            if (age < 1) {
                alpha = 0.6 * age;
            } else if (remaining < 1) {
                alpha = 0.6 * remaining;
            }
            
            // Pulsing as fulfillment time approaches
            const timeUntilFulfillment = echo.fulfillmentTime - now;
            if (timeUntilFulfillment < 3 && timeUntilFulfillment > 0) {
                // Rapid pulse
                const pulse = 1 + Math.sin((3 - timeUntilFulfillment) * 10) * 0.1;
                if (echo.visual) {
                    echo.visual.setScale(pulse);
                }
            }
            
            return true;
        });
    }
    
    checkProphecyFulfillment() {
        const player = this.scene.player;
        const now = this.scene.time.now / 1000;
        
        this.futureEchoes.forEach(echo => {
            if (echo.fulfilled || echo.ignored) return;
            
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y, echo.x, echo.y
            );
            
            // Echo-specific fulfillment conditions
            let fulfilled = false;
            let ignored = false;
            
            switch (echo.type) {
                case 'bullet_path':
                case 'danger_zone':
                    // Fulfilled by staying away (avoidance prophecy)
                    if (dist > 100) {
                        fulfilled = true;
                    } else if (now > echo.fulfillmentTime) {
                        ignored = true;
                    }
                    break;
                    
                case 'safe_corridor':
                    // Fulfilled by being in/near the corridor
                    const corridorDist = this.distanceToCorridor(player, echo);
                    if (corridorDist < echo.data.width / 2) {
                        fulfilled = true;
                    } else if (now > echo.fulfillmentTime) {
                        ignored = true;
                    }
                    break;
                    
                case 'enemy_spawn':
                    // Fulfilled by being near and ready (positioning prophecy)
                    if (dist < 150 && now > echo.fulfillmentTime - 2) {
                        fulfilled = true;
                    } else if (now > echo.fulfillmentTime + 3) {
                        ignored = true;
                    }
                    break;
            }
            
            if (fulfilled && !echo.fulfilled) {
                this.onProphecyFulfilled(echo);
            } else if (ignored && !echo.ignored) {
                this.onProphecyIgnored(echo);
            }
        });
    }
    
    distanceToCorridor(player, echo) {
        // Project player position onto corridor line
        const cos = Math.cos(echo.data.angle);
        const sin = Math.sin(echo.data.angle);
        
        const dx = player.x - echo.x;
        const dy = player.y - echo.y;
        
        // Distance along corridor direction
        const along = dx * cos + dy * sin;
        
        // Distance perpendicular to corridor
        const perp = Math.abs(dx * (-sin) + dy * cos);
        
        // Check if within length bounds
        const halfLen = echo.data.length / 2;
        if (Math.abs(along) <= halfLen) {
            return perp;
        }
        
        // Distance to nearest endpoint
        const endX = along > 0 ? echo.x + halfLen * cos : echo.x - halfLen * cos;
        const endY = along > 0 ? echo.y + halfLen * sin : echo.y - halfLen * sin;
        
        return Phaser.Math.Distance.Between(player.x, player.y, endX, endY);
    }
    
    onProphecyFulfilled(echo) {
        echo.fulfilled = true;
        this.propheciesFulfilled++;
        
        // Build paradox momentum
        this.paradoxMomentum = Math.min(100, this.paradoxMomentum + 25);
        
        // Increase bootstrap level
        this.bootstrapLevel = Math.min(10, this.bootstrapLevel + 1);
        
        // Visual feedback
        this.showParadoxText('BOOTSTRAP PARADOX', 0.8);
        
        // Create fulfillment burst
        this.createFulfillmentBurst(echo.x, echo.y);
        
        // Play success tone
        this.playResonanceTone(440, 0.2, 'sine');
        setTimeout(() => this.playResonanceTone(554, 0.15, 'sine'), 100);
        setTimeout(() => this.playResonanceTone(659, 0.3, 'sine'), 200);
        
        // Notify other systems
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('BOOTSTRAP_FULFILLED', {
                type: echo.type,
                level: this.bootstrapLevel
            });
        }
        
        if (this.scene.omniWeapon) {
            // Fulfilling prophecies grants progress toward RAPID (anticipation)
            this.scene.omniWeapon.addProgress('RAPID', 10);
        }
        
        // Apply immediate gameplay effects based on bootstrap level
        this.applyBootstrapEffects();
        
        // Log the bootstrap paradox
        console.log(`Bootstrap Paradox: Player ${echo.type} prophecy fulfilled. Level ${this.bootstrapLevel}`);
    }
    
    onProphecyIgnored(echo) {
        echo.ignored = true;
        this.propheciesIgnored++;
        
        // Decay bootstrap level slightly
        this.bootstrapLevel = Math.max(0, this.bootstrapLevel - 1);
        
        // Show dissonance text
        this.showParadoxText('PARADOX COLLAPSE', 0.5);
        
        // Notify systems
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('BOOTSTRAP_IGNORED');
        }
    }
    
    applyBootstrapEffects() {
        // Bootstrap effects scale with level
        
        // Level 3+: Brief bullet time on prophecy fulfillment
        if (this.bootstrapLevel >= 3 && this.scene.nearMissState) {
            this.scene.nearMissState.active = true;
            this.scene.nearMissState.remaining = 0.5;
        }
        
        // Level 5+: Spawn prophecy echoes for nearby enemies
        if (this.bootstrapLevel >= 5) {
            this.enhanceEnemySpawns();
        }
        
        // Level 7+: Retrocausal damage (enemies near fulfilled echoes take damage)
        if (this.bootstrapLevel >= 7) {
            this.applyRetrocausalDamage();
        }
        
        // Level 10: The Bootstrap Singularity - all echoes become real
        if (this.bootstrapLevel >= 10) {
            this.triggerBootstrapSingularity();
        }
    }
    
    enhanceEnemySpawns() {
        // Next enemy spawn will be where echo predicted
        // This creates genuine retrocausal gameplay - the echo predicted it
        // The player acted on it, and now the enemy spawns there BECAUSE of it
        this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active && Math.random() < 0.1) {
                // Small chance to "echo resonate" - enemy takes damage from nowhere
                enemy.takeDamage(10);
                this.createEchoParticles(enemy.x, enemy.y);
            }
        });
    }
    
    applyRetrocausalDamage() {
        // Find enemies near recently fulfilled echoes
        this.futureEchoes.forEach(echo => {
            if (!echo.fulfilled) return;
            
            this.scene.enemies.children.entries.forEach(enemy => {
                if (!enemy.active) return;
                
                const dist = Phaser.Math.Distance.Between(
                    enemy.x, enemy.y, echo.x, echo.y
                );
                
                if (dist < 100) {
                    enemy.takeDamage(5 * this.scene.game.loop.delta / 1000);
                }
            });
        });
    }
    
    triggerBootstrapSingularity() {
        // Ultimate bootstrap paradox: Convert all active echoes to reality
        this.showParadoxText('BOOTSTRAP SINGULARITY', 1.0);
        
        // Screen flash
        this.scene.cameras.main.flash(1000, 255, 170, 0, 0.5);
        
        // Reset level after singularity
        this.bootstrapLevel = 3; // Keep some progress
        
        // Bonus to all systems
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.addChainBonus(5);
        }
    }
    
    createFulfillmentBurst(x, y) {
        // Particle burst at fulfilled echo location
        const particles = this.scene.add.particles(0, 0, 'echoParticle', {
            x: x,
            y: y,
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 15,
            frequency: -1
        });
        
        particles.explode();
        
        // Cleanup
        this.scene.time.delayedCall(1000, () => {
            if (particles && particles.active) {
                particles.destroy();
            }
        });
    }
    
    createEchoParticles(x, y) {
        const particles = this.scene.add.particles(0, 0, 'echoParticle', {
            x: x,
            y: y,
            speed: { min: 20, max: 60 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            quantity: 5,
            frequency: -1
        });
        
        particles.explode();
        
        this.scene.time.delayedCall(600, () => {
            if (particles && particles.active) {
                particles.destroy();
            }
        });
    }
    
    showParadoxText(text, duration = 1.0) {
        this.paradoxText.setText(text);
        this.paradoxText.setAlpha(0);
        this.paradoxText.setScale(0.8);
        
        this.scene.tweens.add({
            targets: this.paradoxText,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.paradoxText,
                    alpha: 0,
                    y: this.paradoxText.y - 30,
                    duration: duration * 1000,
                    delay: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        this.paradoxText.setY(
                            this.scene.cameras.main.height / 2 - 100
                        );
                    }
                });
            }
        });
    }
    
    updateUI() {
        // Update momentum arc via UnifiedGraphicsManager
        const manager = this.scene.graphicsManager;
        if (manager && this.indicatorPos) {
            // Clear previous frame's arc for this system
            manager.clearLayer('bootstrap_momentum');
            
            if (this.paradoxMomentum > 0) {
                const radius = 18;
                const startAngle = -Math.PI / 2;
                const endAngle = startAngle + (this.paradoxMomentum / 100) * Math.PI * 2;
                
                // Draw arc using UnifiedGraphicsManager
                manager.drawArc('effects', this.indicatorPos.x, this.indicatorPos.y, radius, startAngle, endAngle, {
                    lineStyle: { width: 3, color: this.BOOTSTRAP_COLOR, alpha: 0.9 }
                });
            }
        }
        
        // Update level text
        this.levelText.setText(this.bootstrapLevel.toString());
        
        // Pulse icon at high momentum
        if (this.paradoxMomentum > 80) {
            if (!this.pulsing) {
                this.pulsing = true;
                this.scene.tweens.add({
                    targets: this.bootstrapIndicator.list[1],
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 300,
                    yoyo: true,
                    repeat: -1
                });
            }
        } else {
            this.pulsing = false;
        }
    }
    
    playResonanceTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            // Audio failed, ignore
        }
    }
    
    findNearestEnemy(x, y) {
        let nearest = null;
        let nearestDist = Infinity;
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        });
        
        return nearest;
    }
    
    // External API for other systems
    getBootstrapMultiplier() {
        // Returns damage/score multiplier based on bootstrap level
        return 1 + (this.bootstrapLevel * 0.1);
    }
    
    isProphecyActive(type) {
        return this.futureEchoes.some(e => e.type === type && !e.fulfilled && !e.ignored);
    }
    
    destroy() {
        // Cleanup all echoes
        this.futureEchoes.forEach(echo => {
            if (echo.visual && echo.visual.active) {
                echo.visual.destroy();
            }
        });
        this.futureEchoes = [];
        
        // Note: echoGraphics removed - now rendered via UnifiedGraphicsManager
        // UnifiedGraphicsManager clears layers automatically each frame
        
        // Cleanup UI
        if (this.bootstrapIndicator && this.bootstrapIndicator.active) {
            this.bootstrapIndicator.destroy();
        }
        
        if (this.paradoxText && this.paradoxText.active) {
            this.paradoxText.destroy();
        }
        
        // Cleanup textures
        if (this.scene.textures.exists('echoParticle')) {
            this.scene.textures.remove('echoParticle');
        }
        if (this.scene.textures.exists('bootstrapGlow')) {
            this.scene.textures.remove('bootstrapGlow');
        }
    }
}
