import Phaser from 'phaser';

/**
 * Quantum Immortality System — The "Quantum Suicide" Engine
 * 
 * MIGRATED to UnifiedGraphicsManager (April 2026):
 * - Main echo rendering now uses UnifiedGraphicsManager on 'effects' layer
 * - Removed 1 graphics.clear() call (now handled by UnifiedGraphicsManager)
 * - Legacy graphics objects removed when using unified renderer
 * 
 * Based on the quantum suicide thought experiment: in a multiverse, you never 
 * truly die — you only experience the branches where you survive.
 * 
 * Core Mechanics:
 * 1. DEATH BRANCHING: When hit, instead of game over, the timeline splits
 *    - You respawn instantly at a safe position
 *    - A Quantum Echo (gold ghost) continues fighting where you "died"
 *    - Echo follows the death trajectory, firing at enemies for 8 seconds
 * 
 * 2. ENTROPY ACCUMULATION: Each death increases "Timeline Entropy"
 *    - Enemies spawn faster and hit harder (higher entropy = harder)
 *    - BUT your Quantum Echoes also deal more damage and last longer
 *    - Risk/reward: dying makes the game harder AND boosts your ghost army
 * 
 * 3. TIMELINE MERGE (Press Q): When you have 3+ echoes active
 *    - All echoes become fully controllable for 5 seconds
 *    - You control a squadron of yourself — every input mirrors to all echoes
 *    - Creates coordinated "death blossom" patterns
 *    - After merge: echoes dissipate, entropy resets partially
 * 
 * 4. CONSCIOUSNESS FRAGMENTS: Random echoes gain "sentience"
 *    - Occasionally an echo will do something clever (dodge, aim ahead)
 *    - Shows as bright gold sparkle on the echo
 *    - These echoes last 2x longer
 * 
 * Why this is revolutionary:
 * - Transforms death from failure state into strategic resource
 * - Creates true "solo squadron" gameplay without recording mechanics
 * - Every run becomes unique based on WHERE you died (death geography)
 * - Highest entropy states create "beautiful chaos" — screen filled with 
 *   your own ghosts fighting alongside you against overwhelming odds
 * - The "Quantum Suicide" aesthetic: accepting death as evolution
 * 
 * Color: White/Gold gradient (#ffffff → #ffd700) — pure quantum state
 * 
 * Integration Pattern: See skill documentation for full details
 */

export default class QuantumImmortalitySystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.ECHO_COLOR = 0xffffff;      // Pure white base
        this.ECHO_GLOW = 0xffd700;       // Gold glow
        this.SENTIENT_COLOR = 0x00f0ff;  // Cyan spark for sentient echoes
        this.MERGE_COLOR = 0xff00ff;     // Magenta during timeline merge
        
        // Echo state
        this.quantumEchoes = [];         // Active death echoes
        this.maxEchoes = 8;              // Cap at 8 simultaneous echoes
        this.echoLifespan = 8.0;         // Base seconds per echo
        this.echoFiringRate = 200;       // ms between shots
        
        // Entropy system
        this.timelineEntropy = 0;        // Current entropy level
        this.entropyPerDeath = 15;       // Entropy gained per death
        this.entropyDecay = 2;           // Entropy lost per second
        this.maxEntropy = 100;           // Cap
        
        // Entropy effects
        this.entropyEffects = {
            enemySpawnRate: 1.0,          // Multiplier (higher = faster spawns)
            enemyDamage: 1.0,             // Multiplier (higher = more damage)
            echoDamage: 1.0,              // Multiplier (higher = echo shots hurt more)
            echoDuration: 1.0             // Multiplier (longer lifespans)
        };
        
        // Timeline merge
        this.mergeReady = false;         // Have enough echoes?
        this.mergeActive = false;        // Currently merging?
        this.mergeDuration = 5.0;        // Seconds of merge
        this.mergeRemaining = 0;
        this.mergeCooldown = 0;
        this.mergeRequiredEchoes = 3;  // Need 3 echoes to merge
        
        // Visuals
        this.entropyBar = null;
        this.entropyText = null;
        this.echoIndicator = null;
        this.mergePrompt = null;
        
        // Death tracking
        this.deathCount = 0;
        this.totalEchoesSpawned = 0;
        this.branchesCreated = [];     // Record of branch points
        
        // Throttling for performance (critical for post-death FPS)
        this.renderInterval = 2; // Render every 2nd frame (30fps)
        this.renderCounter = 0;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
    }
    
    createVisuals() {
        // Rendering via UnifiedGraphicsManager
        
        // Entropy bar (top-right) - registered with HUDPanelManager
        if (!this.scene.hudPanels) {
            console.warn('[QuantumImmortalitySystem] hudPanels not available, skipping UI registration');
            return;
        }
        console.log('[QuantumImmortalitySystem] Registering QUANTUM_IMMORTALITY slot...');
        console.log('[QuantumImmortalitySystem] hudPanels object:', this.scene.hudPanels);
        console.log('[QuantumImmortalitySystem] hudPanels type:', typeof this.scene.hudPanels);
        console.log('[QuantumImmortalitySystem] registerSlot type:', typeof this.scene.hudPanels?.registerSlot);
        console.log('[QuantumImmortalitySystem] panels Map:', this.scene.hudPanels?.panels);
        let result;
        try {
            result = this.scene.hudPanels.registerSlot('QUANTUM_IMMORTALITY', (container, width) => {
                console.log('[QuantumImmortalitySystem] CALLBACK EXECUTING!');
                this.entropyContainer = container;
                this.entropyContainer.setDepth(100);
                
                // Background
                const bg = this.scene.add.rectangle(0, 0, Math.min(100, width), 12, 0x1a1a25, 0.9);
                container.add(bg);
                
                // Entropy fill (white→gold gradient effect)
                this.entropyFill = this.scene.add.rectangle(-Math.min(50, width/2), 0, 0, 10, this.ECHO_COLOR);
                this.entropyFill.setOrigin(0, 0.5);
                container.add(this.entropyFill);
                
                // Echo count indicator
                this.echoIndicator = this.scene.add.text(0, 12, '◉ 0', {
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    letterSpacing: 2,
                    fill: '#ffffff'
                }).setOrigin(0.5);
                container.add(this.echoIndicator);
            }, 'TOP_RIGHT');
            console.log('[QuantumImmortalitySystem] registerSlot returned:', result);
        } catch (err) {
            console.error('[QuantumImmortalitySystem] registerSlot THREW:', err);
        }
        
        // Merge prompt (appears when ready) - NOT in panel, screen-centered
        this.mergePrompt = this.scene.add.text(this.scene.scale.width / 2, 120, '[Q] MERGE TIMELINES', {
            fontFamily: 'monospace',
            fontSize: '20px',
            fontStyle: 'bold',
            letterSpacing: 2,
            fill: '#ff00ff'
        }).setOrigin(0.5);
        this.mergePrompt.setScrollFactor(0);
        this.mergePrompt.setDepth(100);
        this.mergePrompt.setVisible(false);
        
        // Quantum vignette texture
        this.createQuantumVignette();
    }
    
    createQuantumVignette() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Draw quantum interference pattern
        const gradient = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        this.scene.textures.addCanvas('quantum_vignette', canvas);
    }
    
    setupInput() {
        // Q key for timeline merge
        this.scene.input.keyboard.on('keydown-Q', () => {
            if (this.mergeReady && !this.mergeActive && this.mergeCooldown <= 0) {
                this.activateTimelineMerge();
            }
        });
    }
    
    /**
     * Called when player would die — creates a quantum branch instead
     */
    onPlayerDeath(playerX, playerY, playerVx, playerVy) {
        // Increment death count
        this.deathCount++;
        
        // Add entropy
        this.timelineEntropy = Math.min(
            this.maxEntropy, 
            this.timelineEntropy + this.entropyPerDeath
        );
        
        // Create quantum echo at death location
        this.spawnQuantumEcho(playerX, playerY, playerVx, playerVy);
        
        // Record branch point
        this.branchesCreated.push({
            x: playerX,
            y: playerY,
            time: this.scene.time.now / 1000,
            entropy: this.timelineEntropy
        });
        
        // Visual feedback
        this.showDeathBranchEffect(playerX, playerY);
        
        // Update entropy effects
        this.updateEntropyEffects();
        
        // Check if merge is now available
        this.checkMergeAvailability();
        
        // Return respawn position (safe location near death, but offset)
        return this.findSafeRespawnPosition(playerX, playerY);
    }
    
    spawnQuantumEcho(x, y, vx, vy) {
        // Cap echoes
        if (this.quantumEchoes.length >= this.maxEchoes) {
            // Remove oldest
            this.quantumEchoes.shift();
        }
        
        // Determine if this echo gains "sentience" (5% chance, +2% per entropy level)
        const sentienceChance = 0.05 + (this.timelineEntropy / 100) * 0.02;
        const isSentient = Math.random() < sentienceChance;
        
        const echo = {
            x: x,
            y: y,
            vx: vx * 0.5,      // Continue with reduced velocity
            vy: vy * 0.5,
            rotation: Math.atan2(vy, vx) + Math.PI / 2,
            spawnTime: this.scene.time.now / 1000,
            lifespan: this.echoLifespan * this.entropyEffects.echoDuration,
            lastFireTime: 0,
            isSentient: isSentient,
            sentientTarget: null,
            health: 3,          // Can absorb 3 bullets before dissipating
            trail: [],
            id: this.totalEchoesSpawned++
        };
        
        this.quantumEchoes.push(echo);
        
        // Spawn effect
        this.spawnEchoEffect(x, y, isSentient);
        
        // Record in resonance cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('QUANTUM_BRANCH', { 
                sentient: isSentient,
                entropy: this.timelineEntropy 
            });
        }
        
        // Synchronicity Cascade: quantum immortality activation
        if (this.scene.synchronicityCascade) {
            this.scene.synchronicityCascade.onSystemActivate('quantum');
        }
        
        // Saga Engine: record quantum death/resurrection story beat
        if (this.scene.sagaEngine) {
            this.scene.sagaEngine.onSystemActivated('quantumDeath', {
                deathCount: this.deathCount,
                entropy: this.timelineEntropy,
                isSentient: isSentient,
                echoesActive: this.quantumEchoes.length
            });
        }
        
        // Notify omni-weapon
        if (this.scene.omniWeapon) {
            this.scene.omniWeapon.onQuantumBranch();
        }
        
        // Harmonic Convergence: quantum branch creates dissonance then resolution
        if (this.scene.harmonicConvergence) {
            this.scene.harmonicConvergence.onQuantumBranch();
        }
    }
    
    spawnEchoEffect(x, y, isSentient) {
        // Ring explosion
        const ring = this.scene.add.circle(x, y, 20, isSentient ? this.SENTIENT_COLOR : this.ECHO_GLOW);
        ring.setAlpha(0.8);
        ring.setDepth(46);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 4,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
        
        // Particle burst
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const particle = this.scene.add.circle(
                x + Math.cos(angle) * 10,
                y + Math.sin(angle) * 10,
                3,
                this.ECHO_COLOR
            );
            particle.setDepth(46);
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * 40,
                y: y + Math.sin(angle) * 40,
                alpha: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
        
        // Text
        const text = this.scene.add.text(x, y - 40, isSentient ? 'SENTIENT BRANCH' : 'BRANCH', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 1,
            fill: isSentient ? '#00f0ff' : '#ffffff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    showDeathBranchEffect(x, y) {
        // Timeline split visualization
        const split = this.scene.add.graphics();
        split.lineStyle(2, this.ECHO_GLOW, 0.8);
        split.lineBetween(x - 50, y, x + 50, y);
        split.setDepth(99);
        
        this.scene.tweens.add({
            targets: split,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => split.destroy()
        });
        
        // "TIMELINE SPLIT" announcement
        const announce = this.scene.add.text(x, y - 80, 'TIMELINE SPLIT', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fontStyle: 'bold',
            letterSpacing: 2,
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: announce,
            y: y - 100,
            alpha: 0,
            scale: 1.2,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => announce.destroy()
        });
    }
    
    findSafeRespawnPosition(deathX, deathY) {
        // Find position away from enemies and bullets
        const worldWidth = 1920;
        const worldHeight = 1440;
        
        // Try positions in expanding circles
        for (let radius = 100; radius <= 400; radius += 100) {
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                const x = Phaser.Math.Clamp(
                    deathX + Math.cos(angle) * radius,
                    100, worldWidth - 100
                );
                const y = Phaser.Math.Clamp(
                    deathY + Math.sin(angle) * radius,
                    100, worldHeight - 100
                );
                
                // Check if safe (no enemies nearby)
                let safe = true;
                this.scene.enemies.children.entries.forEach(enemy => {
                    if (enemy.active) {
                        const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                        if (dist < 150) safe = false;
                    }
                });
                
                // Check bullets
                this.scene.enemyBullets.children.entries.forEach(bullet => {
                    if (bullet.active) {
                        const dist = Phaser.Math.Distance.Between(x, y, bullet.x, bullet.y);
                        if (dist < 100) safe = false;
                    }
                });
                
                if (safe) return { x, y };
            }
        }
        
        // Fallback: return to center
        return { x: worldWidth / 2, y: worldHeight / 2 };
    }
    
    updateEntropyEffects() {
        const e = this.timelineEntropy / 100; // 0.0 to 1.0
        
        // Higher entropy = faster enemy spawns, stronger enemies
        this.entropyEffects.enemySpawnRate = 1.0 + e * 1.5;  // Up to 2.5x faster
        this.entropyEffects.enemyDamage = 1.0 + e * 0.5;      // Up to 1.5x damage
        
        // BUT also stronger, longer-lasting echoes
        this.entropyEffects.echoDamage = 1.0 + e * 2.0;     // Up to 3x damage
        this.entropyEffects.echoDuration = 1.0 + e * 1.0;     // Up to 2x duration
        
        // Visual overlay intensity based on entropy
        this.updateEntropyOverlay();
    }
    
    updateEntropyOverlay() {
        const intensity = (this.timelineEntropy - 30) / 70; // 0.0 to 1.0
        if (this.timelineEntropy < 30 || intensity <= 0) return;
        
        // Draw corruption lines at high entropy via UnifiedGraphicsManager
        const w = this.scene.scale.width;
        const h = this.scene.scale.height;
        const time = this.scene.time.now / 1000;
        
        for (let i = 0; i < 5 * intensity; i++) {
            const y = (i / (5 * intensity)) * h + Math.sin(time + i) * 20;
            this.scene.graphicsManager.drawLine('effects', 0, y, w, y, this.ECHO_GLOW, intensity * 0.3, 1);
        }
    }
    
    checkMergeAvailability() {
        const wasReady = this.mergeReady;
        this.mergeReady = this.quantumEchoes.length >= this.mergeRequiredEchoes && this.mergeCooldown <= 0;
        
        // Show/hide prompt
        if (this.mergeReady && !this.mergeActive) {
            this.mergePrompt.setVisible(true);
            this.mergePrompt.setAlpha(0.8 + Math.sin(this.scene.time.now / 200) * 0.2);
        } else {
            this.mergePrompt.setVisible(false);
        }
        
        // Pulse effect when first becoming ready
        if (this.mergeReady && !wasReady && !this.mergeActive) {
            this.showMergeReadyEffect();
        }
    }
    
    showMergeReadyEffect() {
        const screenCenterX = this.scene.scale.width / 2;
        const screenCenterY = this.scene.scale.height / 2;
        
        const ring = this.scene.add.circle(screenCenterX, screenCenterY, 100, this.MERGE_COLOR, 0);
        ring.setStrokeStyle(3, this.MERGE_COLOR);
        ring.setScrollFactor(0);
        ring.setDepth(99);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
    }
    
    activateTimelineMerge() {
        this.mergeActive = true;
        this.mergeRemaining = this.mergeDuration;
        this.mergeReady = false;
        this.mergePrompt.setVisible(false);
        
        // All echoes become fully controlled
        this.quantumEchoes.forEach(echo => {
            echo.isControlled = true;
        });
        
        // Visual transformation
        this.showMergeActivationEffect();
        
        // Record in resonance cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('TIMELINE_MERGE', {
                echoCount: this.quantumEchoes.length
            });
        }
        
        // Screen shake
        if (this.scene.shakeIntensity !== undefined) {
            this.scene.shakeIntensity = 10;
        }
    }
    
    showMergeActivationEffect() {
        const screenCenterX = this.scene.scale.width / 2;
        const screenCenterY = this.scene.scale.height / 2;
        
        // Flash
        const flash = this.scene.add.rectangle(
            screenCenterX, screenCenterY, 
            this.scene.scale.width, this.scene.scale.height, 
            this.MERGE_COLOR, 0.5
        );
        flash.setScrollFactor(0);
        flash.setDepth(200);
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });
        
        // Text
        const text = this.scene.add.text(screenCenterX, screenCenterY, 'TIMELINE MERGE', {
            fontFamily: 'monospace',
            fontSize: '32px',
            fontStyle: 'bold',
            letterSpacing: 3,
            fill: '#ff00ff'
        }).setOrigin(0.5);
        text.setScrollFactor(0);
        text.setDepth(201);
        
        this.scene.tweens.add({
            targets: text,
            scale: 1.5,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Connect echoes with lines
        if (this.quantumEchoes.length >= 2) {
            const connections = this.scene.add.graphics();
            connections.lineStyle(2, this.MERGE_COLOR, 0.6);
            connections.setDepth(44);
            
            for (let i = 0; i < this.quantumEchoes.length - 1; i++) {
                const e1 = this.quantumEchoes[i];
                const e2 = this.quantumEchoes[i + 1];
                connections.lineBetween(e1.x, e1.y, e2.x, e2.y);
            }
            
            this.scene.tweens.add({
                targets: connections,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => connections.destroy()
            });
        }
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;
        
        // Update cooldowns
        if (this.mergeCooldown > 0) {
            this.mergeCooldown -= dt;
        }
        
        // Update merge timer
        if (this.mergeActive) {
            this.mergeRemaining -= dt;
            
            // During merge, echoes mirror player movement
            this.updateMergedEchoes();
            
            if (this.mergeRemaining <= 0) {
                this.endTimelineMerge();
            }
        } else {
            // Normal echo update
            this.updateEchoes(dt);
        }
        
        // Decay entropy
        if (this.timelineEntropy > 0) {
            this.timelineEntropy = Math.max(0, this.timelineEntropy - this.entropyDecay * dt);
            this.updateEntropyEffects();
        }
        
        // UI (throttled - only update every 5th frame)
        if (this.renderCounter % 5 === 0) {
            this.updateUI();
        }
        
        // Check merge availability
        this.checkMergeAvailability();
        
        // Render (throttled for performance)
        this.renderCounter++;
        if (this.renderCounter >= this.renderInterval) {
            this.renderCounter = 0;
            this.render();
        }
    }
    
    updateEchoes(dt) {
        const now = this.scene.time.now / 1000;
        const player = this.scene.player;
        
        this.quantumEchoes = this.quantumEchoes.filter(echo => {
            const age = now - echo.spawnTime;
            const maxAge = echo.lifespan;
            
            // Check expiration
            if (age >= maxAge || echo.health <= 0) {
                this.dissipateEcho(echo);
                return false;
            }
            
            // Drift slowly in original direction with drag
            echo.vx *= 0.98;
            echo.vy *= 0.98;
            echo.x += echo.vx * dt;
            echo.y += echo.vy * dt;
            
            // Keep in bounds
            echo.x = Phaser.Math.Clamp(echo.x, 0, 1920);
            echo.y = Phaser.Math.Clamp(echo.y, 0, 1440);
            
            // Sentient echoes seek enemies
            if (echo.isSentient) {
                this.updateSentientEcho(echo, dt);
            }
            
            // Fire at enemies
            this.updateEchoFiring(echo);
            
            // Update trail
            echo.trail.push({ x: echo.x, y: echo.y, age: 0 });
            echo.trail = echo.trail.filter(t => {
                t.age += dt;
                return t.age < 0.5;
            });
            
            return true;
        });
    }
    
    updateSentientEcho(echo, dt) {
        // Find nearest enemy
        let nearest = null;
        let nearestDist = Infinity;
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(echo.x, echo.y, enemy.x, enemy.y);
                if (dist < nearestDist && dist < 400) {
                    nearestDist = dist;
                    nearest = enemy;
                }
            }
        });
        
        if (nearest) {
            echo.sentientTarget = nearest;
            
            // Slowly drift toward target
            const angle = Phaser.Math.Angle.Between(echo.x, echo.y, nearest.x, nearest.y);
            echo.vx += Math.cos(angle) * 30 * dt;
            echo.vy += Math.sin(angle) * 30 * dt;
            
            // Update rotation to face target
            echo.rotation = angle + Math.PI / 2;
            
            // Dodge nearby bullets
            this.scene.enemyBullets.children.entries.forEach(bullet => {
                if (bullet.active) {
                    const dist = Phaser.Math.Distance.Between(echo.x, echo.y, bullet.x, bullet.y);
                    if (dist < 80) {
                        const dodgeAngle = Phaser.Math.Angle.Between(bullet.x, bullet.y, echo.x, echo.y);
                        echo.vx += Math.cos(dodgeAngle) * 100 * dt;
                        echo.vy += Math.sin(dodgeAngle) * 100 * dt;
                    }
                }
            });
        }
    }
    
    updateEchoFiring(echo) {
        const now = this.scene.time.now;
        if (now - echo.lastFireTime < this.echoFiringRate) return;
        
        // Find nearest enemy
        let nearest = null;
        let nearestDist = 400; // Max range
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(echo.x, echo.y, enemy.x, enemy.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = enemy;
                }
            }
        });
        
        if (nearest) {
            // Fire at enemy
            const angle = Phaser.Math.Angle.Between(echo.x, echo.y, nearest.x, nearest.y);
            
            // Create echo bullet
            const bullet = this.scene.bullets.get(echo.x, echo.y);
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setTexture('particle');
                bullet.setTint(this.ECHO_GLOW);
                bullet.setScale(0.8);
                
                const speed = 350;
                bullet.body.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
                
                // Apply entropy damage multiplier
                bullet.echoDamage = 20 * this.entropyEffects.echoDamage;
                bullet.isEchoBullet = true;
                
                echo.lastFireTime = now;
                echo.rotation = angle + Math.PI / 2;
            }
        }
    }
    
    updateMergedEchoes() {
        const player = this.scene.player;
        const input = this.scene.input;
        
        // Calculate player movement delta
        // Echoes mirror player input relative to their positions
        
        this.quantumEchoes.forEach((echo, index) => {
            // Echoes fire continuously during merge
            const now = this.scene.time.now;
            if (now - echo.lastFireTime > 100) { // Rapid fire
                this.fireMergeShot(echo, index);
                echo.lastFireTime = now;
            }
            
            // Sentient echoes continue to move intelligently
            if (echo.isSentient) {
                this.updateSentientEcho(echo, 0.016);
            }
        });
    }
    
    fireMergeShot(echo, index) {
        // Fire in a spread pattern based on echo index
        const baseAngle = echo.rotation - Math.PI / 2;
        const spreadOffset = (index % 3 - 1) * 0.3; // -0.3, 0, +0.3 radians
        const angle = baseAngle + spreadOffset;
        
        const bullet = this.scene.bullets.get(echo.x, echo.y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setTexture('particle');
            bullet.setTint(this.MERGE_COLOR);
            bullet.setScale(1.2);
            
            const speed = 400;
            bullet.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            // Merged bullets deal massive damage
            bullet.echoDamage = 50 * this.entropyEffects.echoDamage;
            bullet.isEchoBullet = true;
            bullet.isMergedBullet = true;
        }
    }
    
    endTimelineMerge() {
        this.mergeActive = false;
        this.mergeCooldown = 8.0; // 8 second cooldown
        
        // Dissipate all echoes with effect
        this.quantumEchoes.forEach(echo => {
            this.dissipateEcho(echo, true);
        });
        this.quantumEchoes = [];
        
        // Reduce entropy (partial reset)
        this.timelineEntropy = Math.max(0, this.timelineEntropy - 30);
        this.updateEntropyEffects();
        
        // Visual
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 50, 
            'TIMELINES DIVERGED', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    dissipateEcho(echo, isMergeEnd = false) {
        // Dissipation effect
        const color = echo.isSentient ? this.SENTIENT_COLOR : this.ECHO_COLOR;
        
        const burst = this.scene.add.circle(echo.x, echo.y, 15, color);
        burst.setAlpha(0.6);
        burst.setDepth(46);
        
        this.scene.tweens.add({
            targets: burst,
            scale: isMergeEnd ? 3 : 1.5,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => burst.destroy()
        });
        
        // Particles
        for (let i = 0; i < (isMergeEnd ? 16 : 8); i++) {
            const angle = (i / (isMergeEnd ? 16 : 8)) * Math.PI * 2;
            const dist = isMergeEnd ? 60 : 30;
            const particle = this.scene.add.circle(
                echo.x + Math.cos(angle) * 10,
                echo.y + Math.sin(angle) * 10,
                isMergeEnd ? 4 : 2,
                color
            );
            particle.setDepth(46);
            
            this.scene.tweens.add({
                targets: particle,
                x: echo.x + Math.cos(angle) * dist,
                y: echo.y + Math.sin(angle) * dist,
                alpha: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    /**
     * Check if an echo can absorb a bullet (collision detection)
     */
    checkEchoCollision(bulletX, bulletY, bulletRadius = 8) {
        for (const echo of this.quantumEchoes) {
            const dist = Phaser.Math.Distance.Between(bulletX, bulletY, echo.x, echo.y);
            if (dist < 20 + bulletRadius) {
                // Echo absorbs bullet
                echo.health--;
                
                // Absorption flash
                const flash = this.scene.add.circle(echo.x, echo.y, 25, this.ECHO_GLOW);
                flash.setAlpha(0.5);
                flash.setDepth(47);
                
                this.scene.tweens.add({
                    targets: flash,
                    scale: 1.5,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => flash.destroy()
                });
                
                return true;
            }
        }
        return false;
    }
    
    updateUI() {
        // Guard: panel elements may not be initialized yet
        if (!this.entropyFill || !this.echoIndicator || !this.entropyText) return;
        
        // Update entropy bar
        const entropyPercent = this.timelineEntropy / 100;
        this.entropyFill.width = 98 * entropyPercent;
        
        // Color shift from white to gold as entropy increases
        const r = 255;
        const g = Math.floor(240 + (215 - 240) * entropyPercent);
        const b = Math.floor(255 + (0 - 255) * entropyPercent);
        this.entropyFill.fillColor = (r << 16) | (g << 8) | b;
        
        // Update echo indicator
        const echoCount = this.quantumEchoes.length;
        this.echoIndicator.setText(`◉ ${echoCount}`);
        this.echoIndicator.setFill(echoCount >= this.mergeRequiredEchoes ? '#ff00ff' : '#ffffff');
        
        // Update entropy label to show effects
        if (this.timelineEntropy > 70) {
            this.entropyText.setText('ENTROPY: CHAOS');
            this.entropyText.setFill('#ff6666');
        } else if (this.timelineEntropy > 40) {
            this.entropyText.setText('ENTROPY: HIGH');
            this.entropyText.setFill('#ffd700');
        } else {
            this.entropyText.setText('ENTROPY');
            this.entropyText.setFill('#aaaaaa');
        }
    }
    
    render() {
        // Render via UnifiedGraphicsManager
        this.renderUnified();
    }
    
    /**
     * Unified rendering via UnifiedGraphicsManager - registers commands instead of direct drawing
     */
    renderUnified() {
        const manager = this.scene.graphicsManager;
        
        // Draw each echo as registered commands
        this.quantumEchoes.forEach(echo => {
            // Trail
            if (echo.trail.length > 1) {
                manager.drawPath('effects', echo.trail, this.ECHO_COLOR, 0.3, 2);
            }
            
            // Color based on state
            let color = this.ECHO_COLOR;
            let glowColor = this.ECHO_GLOW;
            
            if (this.mergeActive) {
                color = this.MERGE_COLOR;
                glowColor = this.MERGE_COLOR;
            } else if (echo.isSentient) {
                color = this.SENTIENT_COLOR;
            }
            
            // Glow
            manager.drawCircle('effects', echo.x, echo.y, 18, glowColor, 0.3);
            
            // Core
            manager.drawCircle('effects', echo.x, echo.y, 10, color, 0.9);
            
            // Triangle shape (simplified to 3 lines for unified renderer)
            const angle = echo.rotation;
            const size = 12;
            const tipX = echo.x + Math.cos(angle) * size;
            const tipY = echo.y + Math.sin(angle) * size;
            const leftX = echo.x + Math.cos(angle + 2.5) * size * 0.6;
            const leftY = echo.y + Math.sin(angle + 2.5) * size * 0.6;
            const rightX = echo.x + Math.cos(angle - 2.5) * size * 0.6;
            const rightY = echo.y + Math.sin(angle - 2.5) * size * 0.6;
            
            manager.drawLine('effects', tipX, tipY, leftX, leftY, color, 1, 2);
            manager.drawLine('effects', leftX, leftY, rightX, rightY, color, 1, 2);
            manager.drawLine('effects', rightX, rightY, tipX, tipY, color, 1, 2);
            
            // Health dots
            if (echo.health < 3) {
                for (let i = 0; i < (3 - echo.health); i++) {
                    manager.drawCircle('effects', echo.x - 8 + i * 8, echo.y - 18, 2, 0xff0000, 0.8);
                }
            }
            
            // Sentient sparkle (only every few frames to save performance)
            if (echo.isSentient && !this.mergeActive && this.renderCounter % 3 === 0) {
                const time = this.scene.time.now / 1000;
                const sparkleX = echo.x + Math.cos(time * 3) * 15;
                const sparkleY = echo.y + Math.sin(time * 2.5) * 15;
                manager.drawCircle('effects', sparkleX, sparkleY, 3, this.SENTIENT_COLOR, 0.8);
            }
        });
        
        // Merge connection lines
        if (this.mergeActive && this.quantumEchoes.length >= 2) {
            const player = this.scene.player;
            this.quantumEchoes.forEach(echo => {
                manager.drawLine('effects', player.x, player.y, echo.x, echo.y, this.MERGE_COLOR, 0.4, 2);
            });
        }
    }
    
    /**
     * Get modified spawn delay based on entropy
     */
    getModifiedSpawnDelay(baseDelay) {
        return baseDelay / this.entropyEffects.enemySpawnRate;
    }
    
    /**
     * Get enemy damage multiplier based on entropy
     */
    getEnemyDamageMultiplier() {
        return this.entropyEffects.enemyDamage;
    }
    
    /**
     * Check if player would die (for external systems)
     */
    wouldDie() {
        // Always branch instead of dying (unless in some special mode)
        return true;
    }
    
    destroy() {
        // UnifiedGraphicsManager handles its own cleanup
        
        this.entropyContainer.destroy();
        this.mergePrompt.destroy();
    }
}
