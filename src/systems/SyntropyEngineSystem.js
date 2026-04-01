import Phaser from 'phaser';

/**
 * Syntropy Engine — The Anti-Entropy Protocol
 * 
 * In a universe trending toward disorder, the player becomes a force of cosmic significance.
 * Every elegant action, every creative combination, every moment of flow generates SYNTROPY —
 * the opposite of entropy, the principle of emergent order, the signature of life itself.
 * 
 * === THE CORE INNOVATION ===
 * 
 * This isn't a resource you grind. It's a FORCE you EMBODY. The game measures not just
 * WHAT you do, but the ELEGANCE with which you do it — and rewards you by making the 
 * universe itself more organized, more responsive, more ALIVE in your presence.
 * 
 * === SYNTROPY GENERATION ===
 * 
 * Syntropy flows from ELEGANCE, not efficiency:
 * 
 * 1. ELEGANT ELIMINATION
 *    - Kill enemy with single bullet: +5 syntropy
 *    - Kill multiple with one bullet: +15 syntropy (combo multiplier)
 *    - Kill while in bullet-time near-miss: +25 syntropy (risk elegance)
 *    - Kill by bullet curving (attractor): +35 syntropy (physics mastery)
 * 
 * 2. CREATIVE SYNTHESIS  
 *    - Chain 2+ systems within 3 seconds: +20 syntropy
 *    - Chain 4+ systems: +60 syntropy
 *    - Unique system combination (never done this run): +100 syntropy
 * 
 * 3. FLOW CRYSTALLIZATION
 *    - During Kairos Moment: All syntropy ×3
 *    - Near-miss streak: Each adds +10 syntropy
 *    - Zero damage taken for 10s: +50 syntropy
 * 
 * 4. WASTE RECLAMATION
 *    - Bullet that missed returns to pool: +2 syntropy
 *    - Enemy bullet absorbed: +5 syntropy  
 *    - Damage healed through any means: +3 syntropy per HP
 * 
 * === SYNTROPY EXPENDITURE ===
 * 
 * Press Y to open the Syntropy Radial — spend elegance to reshape reality:
 * 
 * [ATTRACTOR NODE] — 100 syntropy
 *     Creates a zone where bullets curve toward enemies
 *     Lasts 8 seconds, grows stronger as more bullets pass through
 *     ELEGANT: Bullets that curve kill give +15 syntropy refund
 * 
 * [RESTRUCTURE FIELD] — 150 syntropy  
 *     Converts all enemy bullets in radius to seeking allies
 *     They target their former masters
 *     ELEGANT: Each converted bullet gives +5 syntropy
 * 
 * [CRYSTALLIZE] — 200 syntropy
 *     Converts temporary power-up to permanent
 *     Only works on currently active pickup
 *     Creates a "Syntropy Imprint" — can be reactivated in future runs
 * 
 * [TEMPORAL ANCHOR UPGRADE] — 75 syntropy
 *     Upgrades existing anchor to "Resonant Anchor"
 *     Rewinding through it costs no instability
 *     Afterimages from this anchor last 2× longer
 * 
 * [VOID COHERENCE HARMONIZE] — 125 syntropy
 *     Synchronizes Void Coherence with current syntropy level
 *     Damage bonus now scales with syntropy generation rate
 *     Creates "Harmonic Feedback" — syntropy generates void coherence
 * 
 * [ECHO AMPLIFICATION] — 180 syntropy
 *     All active echoes become "Resonant Echoes"
 *     They seek, absorb, and RE-FIRE enemy bullets back
 *     Lasts 12 seconds
 * 
 * === THE SYNTROPY CASCADE ===
 * 
 * At 1000+ syntropy: SYNTROPY CASCADE triggers automatically
 * - All bullets become "elegant" (curve slightly toward enemies)
 * - Enemy bullets slow when near you (respect for the master)
 * - Score multiplier: 2×
 * - Visual: World becomes subtly more saturated, geometrically precise
 * - Audio: Underlying harmonic drone emerges
 * 
 * At 2000+ syntropy: SYNTHETIC SINGULARITY available
 * - Can spend 2000 syntropy to create a PERMANENT STRUCTURE
 * - This structure persists across ALL future runs
 * - Examples: Permanent attractor field at center, healing fountain, bullet recycler
 * - The game world literally becomes more ordered through your mastery
 * 
 * === SYNERGY ARCHITECTURE ===
 * 
 * This is the CAPSTONE system — it elevates all others:
 * 
 * - Kairos Moment: Becomes the primary syntropy multiplier (×3 to ×5)
 * - Mnemosyne Weave: Shards can be "syntropy-infused" for 2× bonuses
 * - Temporal Rewind: Rewinding preserves syntropy, creates afterimage farms
 * - Omni-Weapon: Syntropy spent on weapon = permanent unlock in arsenal
 * - Paradox Engine: Predictions show syntropy-optimal paths
 * - Resonance Cascade: Syntropy makes cascades self-sustaining
 * - Quantum Immortality: Death costs syntropy instead of run end
 * - Observer Effect: AI generates syntropy when it fails to predict you
 * - Void Coherence: Syntropy stabilizes the void, prevents burnout
 * - Causal Entanglement: Syntropy unlocks "benevolent entanglement" (heal allies)
 * - Dimensional Collapse: Syntropy makes collapse CONTROLLABLE (not random)
 * - Symbiotic Prediction: Fulfillment during syntropy cascade = transcendence
 * - Chrono-Loop: Loops become syntropy generators (elegant repetition)
 * - Temporal Contract: Contracts sealed with syntropy are unbreakable
 * 
 * === THE PHILOSOPHY ===
 * 
 * This system completes the game's arc:
 * 
 * LEVEL 1: Survive (basic mechanics)
 * LEVEL 2: Master (system chaining)  
 * LEVEL 3: Transcend (flow state)
 * LEVEL 4: CREATE (syntropy expenditure)
 * LEVEL 5: EVOLVE (permanent world changes)
 * 
 * You begin as a victim of entropy (enemies spawning, chaos increasing)
 * You become a master of time (temporal systems)
 * You become a student of yourself (Kairos, Chronicle)
 * You become a force of nature (syntropy generation)
 * You become a CO-CREATOR of the universe itself (synthetic singularities)
 * 
 * The game doesn't end. The game EVOLVES WITH YOU.
 * 
 * Color: Cyan-to-Gold gradient (#00ffff → #ffd700)
 *      Represents the transformation from potential (cyan) to realized order (gold)
 */

export default class SyntropyEngineSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== SYNTROPY STATE =====
        this.syntropy = 0;
        this.totalSyntropyGenerated = 0; // Lifetime tracker
        this.syntropyLevel = 0; // 0-5, determines world evolution stage
        this.cascadeActive = false;
        this.singularityAvailable = false;
        
        // ===== GENERATION TRACKING =====
        this.recentSystemUses = []; // Last 3 seconds of system activations
        this.uniqueCombinations = new Set(); // Hash of system chains
        this.lastKillTime = 0;
        this.comboCount = 0;
        this.damagelessTimer = 0;
        this.bulletsReturned = 0;
        
        // ===== EXPENDITURE STATE =====
        this.radialOpen = false;
        this.selectedOption = 0;
        this.radialOptions = [
            { id: 'attractor', name: 'ATTRACTOR', cost: 100, icon: '∿', description: 'Bullets curve to targets' },
            { id: 'restructure', name: 'RESTRUCTURE', cost: 150, icon: '⟲', description: 'Convert enemy bullets' },
            { id: 'crystallize', name: 'CRYSTALLIZE', cost: 200, icon: '◈', description: 'Permanent power-up' },
            { id: 'anchorUpgrade', name: 'ANCHOR+', cost: 75, icon: '⚓', description: 'Resonant anchor' },
            { id: 'harmonize', name: 'HARMONIZE', cost: 125, icon: '◉', description: 'Sync with void' },
            { id: 'echoAmp', name: 'ECHO AMP', cost: 180, icon: '◐', description: 'Resonant echoes' }
        ];
        
        // ===== ATTRACTOR STATE =====
        this.attractors = [];
        this.attractorRadius = 150;
        this.attractorStrength = 0.3; // Radians per frame curve
        this.attractorDuration = 8000; // ms
        
        // ===== RESTRUCTURE STATE =====
        this.restructureActive = false;
        this.restructureRadius = 200;
        this.restructureDuration = 6000;
        
        // ===== ECHO AMPLIFICATION =====
        this.echoAmplified = false;
        this.echoAmpDuration = 12000;
        
        // ===== VISUAL EFFECTS =====
        this.syntropyGlow = null;
        this.cascadeVignette = null;
        this.harmonicParticles = null;
        
        // ===== INPUT =====
        this.yKey = null;
        this.radialCooldown = 0;
        
        // ===== PERMANENT STRUCTURES (cross-run persistence) =====
        this.permanentStructures = this.loadPermanentStructures();
        
        // ===== SYNTHETIC SINGULARITY PROGRESS =====
        this.singularityProgress = 0; // 0-1, builds toward permanent structure
        
        this.init();
    }
    
    init() {
        // Setup input
        this.yKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
        
        // Create visual effects
        this.createSyntropyGlow();
        this.createHarmonicParticles();
        
        // Setup radial input handling
        this.scene.input.on('pointerdown', (pointer) => {
            if (this.radialOpen && pointer.leftButtonDown()) {
                this.selectRadialOption();
            }
        });
        
        // Spawn any saved permanent structures
        this.spawnPermanentStructures();
        
        // Start monitoring loop
        this.scene.time.addEvent({
            delay: 100,
            callback: this.updateSyntropyLevel,
            callbackScope: this,
            loop: true
        });
    }
    
    createSyntropyGlow() {
        // Player glow that intensifies with syntropy
        this.syntropyGlow = this.scene.add.graphics();
        this.syntropyGlow.setDepth(-1);
    }
    
    createHarmonicParticles() {
        // Particles that emerge during cascade
        this.harmonicParticles = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.4, end: 0 },
            speed: { min: 20, max: 60 },
            lifespan: 1000,
            tint: 0x00ffff,
            frequency: -1,
            blendMode: 'ADD'
        });
    }
    
    update(time, delta) {
        if (!this.scene.player?.active) return;
        
        // Handle radial cooldown
        if (this.radialCooldown > 0) {
            this.radialCooldown -= delta;
        }
        
        // Handle radial toggle
        if (Phaser.Input.Keyboard.JustDown(this.yKey) && this.radialCooldown <= 0) {
            this.toggleRadial();
        }
        
        // Update radial selection based on mouse position
        if (this.radialOpen) {
            this.updateRadialSelection();
        }
        
        // Update attractors
        this.updateAttractors(delta);
        
        // Update cascade effects
        if (this.cascadeActive) {
            this.updateCascadeEffects(time, delta);
        }
        
        // Update syntropy glow
        this.updateSyntropyGlow();
        
        // Update damageless timer
        this.damagelessTimer += delta / 1000;
        
        // Clean up old system uses
        const cutoff = time - 3000;
        this.recentSystemUses = this.recentSystemUses.filter(t => t > cutoff);
        
        // Decay combo
        if (time - this.lastKillTime > 2000) {
            this.comboCount = 0;
        }
        
        // Update echo amplification
        if (this.echoAmplified && time > this.echoAmpEndTime) {
            this.echoAmplified = false;
        }
        
        // Update restructure
        if (this.restructureActive && time > this.restructureEndTime) {
            this.restructureActive = false;
        }
    }
    
    updateSyntropyLevel() {
        const oldLevel = this.syntropyLevel;
        
        // Calculate level based on total lifetime syntropy
        if (this.totalSyntropyGenerated >= 5000) this.syntropyLevel = 5;
        else if (this.totalSyntropyGenerated >= 3000) this.syntropyLevel = 4;
        else if (this.totalSyntropyGenerated >= 1500) this.syntropyLevel = 3;
        else if (this.totalSyntropyGenerated >= 500) this.syntropyLevel = 2;
        else if (this.totalSyntropyGenerated >= 100) this.syntropyLevel = 1;
        else this.syntropyLevel = 0;
        
        // Check for cascade trigger
        if (this.syntropy >= 1000 && !this.cascadeActive) {
            this.activateCascade();
        }
        
        // Check for singularity availability
        if (this.syntropy >= 2000 && !this.singularityAvailable) {
            this.singularityAvailable = true;
            this.showSingularityAvailable();
        }
        
        // Level up notification
        if (this.syntropyLevel > oldLevel) {
            this.showLevelUp(oldLevel, this.syntropyLevel);
        }
    }
    
    // ===== SYNTROPY GENERATION METHODS =====
    
    onEnemyKilled(enemy, bullet, context = {}) {
        const time = this.scene.time.now;
        let syntropyGain = 5; // Base for any kill
        
        // Elegant elimination bonuses
        if (context.singleBullet) syntropyGain += 5;
        if (context.multiKill) syntropyGain += 15 * context.killCount;
        if (context.nearMissKill) syntropyGain += 25;
        if (context.attractorKill) syntropyGain += 35;
        if (context.curvedBullet) syntropyGain += 20;
        
        // Combo bonus
        if (time - this.lastKillTime < 2000) {
            this.comboCount++;
            syntropyGain += this.comboCount * 3;
        } else {
            this.comboCount = 1;
        }
        this.lastKillTime = time;
        
        // System chain bonus
        const chainLength = this.recentSystemUses.length;
        if (chainLength >= 2) syntropyGain += 20;
        if (chainLength >= 4) syntropyGain += 60;
        
        // Unique combination bonus
        const comboHash = this.hashRecentSystems();
        if (!this.uniqueCombinations.has(comboHash)) {
            this.uniqueCombinations.add(comboHash);
            syntropyGain += 100;
            this.showUniqueComboNotification();
        }
        
        // Flow state bonus
        if (this.scene.kairosMoment?.inKairosState) {
            syntropyGain *= 3;
        }
        
        // Damageless bonus
        if (this.damagelessTimer >= 10) {
            syntropyGain += 50;
            this.damagelessTimer = 0; // Reset after bonus
        }
        
        // Cascade bonus
        if (this.cascadeActive) {
            syntropyGain *= 1.5;
        }
        
        // Observer effect bonus (AI failed to predict)
        if (context.unpredicted) {
            syntropyGain += 30;
        }
        
        this.addSyntropy(syntropyGain, enemy.x, enemy.y);
    }
    
    onSystemUsed(systemName) {
        this.recentSystemUses.push(this.scene.time.now);
        
        // Small syntropy for creative system use
        this.addSyntropy(3);
    }
    
    onBulletReturned() {
        this.bulletsReturned++;
        this.addSyntropy(2);
        
        // Every 10 bullets returned = bonus
        if (this.bulletsReturned % 10 === 0) {
            this.addSyntropy(25);
            this.showFloatingText(this.scene.player.x, this.scene.player.y - 50, 
                'WASTE RECLAIMED +25', '#00ffff');
        }
    }
    
    onEnemyBulletAbsorbed() {
        this.addSyntropy(5);
    }
    
    onDamageHealed(amount) {
        this.addSyntropy(3 * amount);
    }
    
    onNearMiss(streak) {
        // Base near-miss syntropy
        this.addSyntropy(10 + streak * 5);
    }
    
    onKairosBegin() {
        // Bonus syntropy for entering Kairos
        this.addSyntropy(100, this.scene.player.x, this.scene.player.y);
        this.showFloatingText(this.scene.player.x, this.scene.player.y - 80,
            'KAIROS DETECTED — SYNTROPY ×3', '#ffd700');
    }
    
    onObserverFailed() {
        // AI failed to predict player = player transcended pattern
        this.addSyntropy(50);
        this.showFloatingText(this.scene.player.x, this.scene.player.y - 50,
            'UNPREDICTABLE +50', '#00ffff');
    }
    
    addSyntropy(amount, x = null, y = null) {
        // Round to integer
        amount = Math.floor(amount);
        
        this.syntropy += amount;
        this.totalSyntropyGenerated += amount;
        
        // Visual feedback
        if (x !== null && y !== null && amount >= 10) {
            this.showFloatingText(x, y - 30, `+${amount} ◈`, '#00ffff');
        }
        
        // Update HUD if available
        if (this.scene.updateSyntropyHUD) {
            this.scene.updateSyntropyHUD(this.syntropy, this.cascadeActive);
        }
        
        // Build singularity progress
        if (this.syntropyLevel >= 4) {
            this.singularityProgress += amount / 10000;
        }
    }
    
    spendSyntropy(amount) {
        if (this.syntropy >= amount) {
            this.syntropy -= amount;
            if (this.scene.updateSyntropyHUD) {
                this.scene.updateSyntropyHUD(this.syntropy, this.cascadeActive);
            }
            return true;
        }
        return false;
    }
    
    // ===== EXPENDITURE METHODS =====
    
    toggleRadial() {
        if (this.radialOpen) {
            this.closeRadial();
        } else {
            this.openRadial();
        }
    }
    
    openRadial() {
        this.radialOpen = true;
        this.selectedOption = 0;
        this.radialCooldown = 300;
        
        // Create radial UI
        this.createRadialUI();
        
        // Slow time slightly
        this.scene.physics.world.timeScale = 0.3;
        this.scene.tweens.timeScale = 0.3;
    }
    
    closeRadial() {
        this.radialOpen = false;
        this.radialCooldown = 300;
        
        // Remove radial UI
        if (this.radialContainer) {
            this.radialContainer.destroy();
            this.radialContainer = null;
        }
        
        // Restore time
        this.scene.physics.world.timeScale = 1;
        this.scene.tweens.timeScale = 1;
    }
    
    createRadialUI() {
        const cx = this.scene.cameras.main.width / 2;
        const cy = this.scene.cameras.main.height / 2;
        const radius = 120;
        
        this.radialContainer = this.scene.add.container(0, 0);
        this.radialContainer.setScrollFactor(0);
        this.radialContainer.setDepth(1000);
        
        // Background circle
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x0a0a0f, 0.9);
        bg.fillCircle(cx, cy, radius + 40);
        bg.lineStyle(2, 0x00ffff, 0.5);
        bg.strokeCircle(cx, cy, radius + 40);
        this.radialContainer.add(bg);
        
        // Option segments
        this.radialOptions.forEach((opt, i) => {
            const angle = (i / this.radialOptions.length) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            
            const canAfford = this.syntropy >= opt.cost;
            const color = canAfford ? 0x00ffff : 0x666666;
            
            // Segment circle
            const seg = this.scene.add.graphics();
            seg.fillStyle(color, 0.2);
            seg.fillCircle(x, y, 35);
            seg.lineStyle(2, color, 0.8);
            seg.strokeCircle(x, y, 35);
            this.radialContainer.add(seg);
            
            // Icon
            const icon = this.scene.add.text(x, y - 5, opt.icon, {
                fontFamily: 'monospace',
                fontSize: '20px',
                fill: canAfford ? '#00ffff' : '#666666'
            }).setOrigin(0.5);
            this.radialContainer.add(icon);
            
            // Cost
            const cost = this.scene.add.text(x, y + 18, `${opt.cost}`, {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: canAfford ? '#ffd700' : '#666666'
            }).setOrigin(0.5);
            this.radialContainer.add(cost);
        });
        
        // Center info
        const selected = this.radialOptions[this.selectedOption];
        const nameText = this.scene.add.text(cx, cy - 15, selected.name, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            fill: '#00ffff'
        }).setOrigin(0.5);
        this.radialContainer.add(nameText);
        
        const descText = this.scene.add.text(cx, cy + 10, selected.description, {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);
        this.radialContainer.add(descText);
        
        const costText = this.scene.add.text(cx, cy + 30, `Cost: ${selected.cost} ◈`, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: this.syntropy >= selected.cost ? '#ffd700' : '#ff6666'
        }).setOrigin(0.5);
        this.radialContainer.add(costText);
        
        // Syntropy display
        const synthText = this.scene.add.text(cx, cy + 55, `◈ ${this.syntropy}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#00ffff'
        }).setOrigin(0.5);
        this.radialContainer.add(synthText);
        
        // Store references for updates
        this.radialBg = bg;
        this.radialName = nameText;
        this.radialDesc = descText;
        this.radialCost = costText;
        this.radialSynth = synthText;
    }
    
    updateRadialSelection() {
        const cx = this.scene.cameras.main.width / 2;
        const cy = this.scene.cameras.main.height / 2;
        const pointer = this.scene.input.activePointer;
        
        const angle = Math.atan2(pointer.y - cy, pointer.x - cx);
        const normalizedAngle = (angle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
        const segment = Math.floor(normalizedAngle / (Math.PI * 2 / this.radialOptions.length));
        
        if (segment !== this.selectedOption) {
            this.selectedOption = segment;
            this.refreshRadialInfo();
        }
    }
    
    refreshRadialInfo() {
        const selected = this.radialOptions[this.selectedOption];
        this.radialName.setText(selected.name);
        this.radialDesc.setText(selected.description);
        this.radialCost.setText(`Cost: ${selected.cost} ◈`);
        this.radialCost.setFill(this.syntropy >= selected.cost ? '#ffd700' : '#ff6666');
    }
    
    selectRadialOption() {
        const selected = this.radialOptions[this.selectedOption];
        
        if (!this.spendSyntropy(selected.cost)) {
            // Can't afford
            this.showFloatingText(
                this.scene.cameras.main.width / 2,
                this.scene.cameras.main.height / 2,
                'INSUFFICIENT SYNTROPY', '#ff6666'
            );
            this.closeRadial();
            return;
        }
        
        // Execute the selected option
        switch (selected.id) {
            case 'attractor':
                this.createAttractor();
                break;
            case 'restructure':
                this.activateRestructure();
                break;
            case 'crystallize':
                this.crystallizePowerUp();
                break;
            case 'anchorUpgrade':
                this.upgradeAnchor();
                break;
            case 'harmonize':
                this.harmonizeVoid();
                break;
            case 'echoAmp':
                this.amplifyEchoes();
                break;
        }
        
        this.closeRadial();
    }
    
    // ===== ABILITY IMPLEMENTATIONS =====
    
    createAttractor() {
        const attractor = {
            x: this.scene.player.x,
            y: this.scene.player.y,
            created: this.scene.time.now,
            strength: this.attractorStrength,
            radius: this.attractorRadius,
            bulletsCurved: 0,
            graphics: this.scene.add.graphics()
        };
        
        // Visual
        attractor.graphics.lineStyle(2, 0x00ffff, 0.3);
        attractor.graphics.strokeCircle(attractor.x, attractor.y, 10);
        attractor.graphics.setDepth(-1);
        
        // Pulse animation
        this.scene.tweens.add({
            targets: attractor.graphics,
            scaleX: 15,
            scaleY: 15,
            alpha: 0,
            duration: 2000,
            repeat: -1,
            yoyo: false
        });
        
        this.attractors.push(attractor);
        
        // Notification
        this.showFloatingText(attractor.x, attractor.y - 50, 'ATTRACTOR NODE', '#00ffff');
    }
    
    updateAttractors(delta) {
        const now = this.scene.time.now;
        
        // Remove expired attractors
        this.attractors = this.attractors.filter(a => {
            if (now - a.created > this.attractorDuration) {
                a.graphics.destroy();
                return false;
            }
            return true;
        });
        
        // Apply attraction to all player bullets
        if (this.attractors.length > 0 || this.cascadeActive) {
            const bullets = this.scene.bullets.getChildren();
            const enemies = this.scene.enemies.getChildren().filter(e => e.active);
            
            bullets.forEach(bullet => {
                if (!bullet.active || !bullet.body) return;
                
                // Find nearest enemy
                let nearest = null;
                let nearestDist = Infinity;
                
                enemies.forEach(enemy => {
                    const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y);
                    if (dist < nearestDist && dist < 300) {
                        nearestDist = dist;
                        nearest = enemy;
                    }
                });
                
                if (nearest) {
                    // Calculate desired angle
                    const desiredAngle = Phaser.Math.Angle.Between(bullet.x, bullet.y, nearest.x, nearest.y);
                    const currentAngle = bullet.body.velocity.angle();
                    
                    // Smoothly rotate toward target
                    let angleDiff = desiredAngle - currentAngle;
                    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                    
                    const strength = this.cascadeActive ? 0.05 : 0.03;
                    const newAngle = currentAngle + angleDiff * strength;
                    const speed = bullet.body.velocity.length();
                    
                    bullet.body.setVelocity(
                        Math.cos(newAngle) * speed,
                        Math.sin(newAngle) * speed
                    );
                    bullet.setRotation(newAngle);
                    
                    // Track curved bullets for syntropy refund on kill
                    bullet.syntropyCurved = true;
                }
            });
        }
    }
    
    activateRestructure() {
        this.restructureActive = true;
        this.restructureEndTime = this.scene.time.now + this.restructureDuration;
        
        const px = this.scene.player.x;
        const py = this.scene.player.y;
        
        // Visual effect
        const ring = this.scene.add.graphics();
        ring.lineStyle(4, 0x00ffff, 0.5);
        ring.strokeCircle(px, py, this.restructureRadius);
        
        this.scene.tweens.add({
            targets: ring,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 1000,
            onComplete: () => ring.destroy()
        });
        
        // Convert enemy bullets
        const enemyBullets = this.scene.enemyBullets.getChildren();
        let converted = 0;
        
        enemyBullets.forEach(bullet => {
            if (!bullet.active) return;
            
            const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, px, py);
            if (dist <= this.restructureRadius) {
                // Convert to ally bullet
                bullet.setTint(0x00ffff);
                bullet.isAlly = true;
                
                // Find nearest enemy
                const enemies = this.scene.enemies.getChildren().filter(e => e.active);
                if (enemies.length > 0) {
                    const target = enemies[0]; // Simple targeting
                    const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
                    bullet.body.setVelocity(
                        Math.cos(angle) * bullet.body.velocity.length(),
                        Math.sin(angle) * bullet.body.velocity.length()
                    );
                    bullet.setRotation(angle);
                }
                
                converted++;
            }
        });
        
        // Syntropy refund for conversions
        if (converted > 0) {
            this.addSyntropy(converted * 5, px, py);
            this.showFloatingText(px, py - 50, `RESTRUCTURED ${converted}`, '#00ffff');
        }
        
        // Setup collision for ally bullets
        this.setupAllyBulletCollision();
    }
    
    setupAllyBulletCollision() {
        // Add overlap for ally bullets hitting enemies
        this.scene.physics.add.overlap(
            this.scene.enemyBullets,
            this.scene.enemies,
            (bullet, enemy) => {
                if (bullet.isAlly && enemy.active) {
                    enemy.takeDamage(15);
                    bullet.setActive(false);
                    bullet.setVisible(false);
                    
                    // Syntropy for restructured kill
                    this.addSyntropy(15, enemy.x, enemy.y);
                }
            },
            null,
            this
        );
    }
    
    crystallizePowerUp() {
        // Find active power-up or create one based on current weapon state
        const omni = this.scene.omniWeapon;
        if (!omni || !omni.currentBarrel) {
            this.showFloatingText(this.scene.player.x, this.scene.player.y - 50,
                'NO ACTIVE POWER-UP', '#ff6666');
            return;
        }
        
        // Create a crystallized imprint
        const imprint = {
            type: omni.currentBarrel,
            timestamp: Date.now(),
            run: this.scene.timelineChronicle?.currentRunId || 'unknown'
        };
        
        // Save to localStorage
        const imprints = JSON.parse(localStorage.getItem('syntropyImprints') || '[]');
        imprints.push(imprint);
        localStorage.setItem('syntropyImprints', JSON.stringify(imprints));
        
        // Visual
        const crystal = this.scene.add.graphics();
        crystal.fillStyle(0x00ffff, 0.5);
        crystal.fillCircle(this.scene.player.x, this.scene.player.y, 40);
        
        this.scene.tweens.add({
            targets: crystal,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 1000,
            onComplete: () => crystal.destroy()
        });
        
        this.showFloatingText(this.scene.player.x, this.scene.player.y - 60,
            'IMPRINT CRYSTALLIZED', '#ffd700');
    }
    
    upgradeAnchor() {
        const rewind = this.scene.temporalRewind;
        if (!rewind || rewind.anchors.length === 0) {
            this.showFloatingText(this.scene.player.x, this.scene.player.y - 50,
                'NO ANCHOR TO UPGRADE', '#ff6666');
            return;
        }
        
        // Upgrade most recent anchor
        const anchor = rewind.anchors[rewind.anchors.length - 1];
        anchor.resonant = true;
        anchor.afterimageMultiplier = 2;
        
        // Visual upgrade
        anchor.graphics.clear();
        anchor.graphics.lineStyle(3, 0x00ffff, 0.8);
        anchor.graphics.strokeCircle(0, 0, 20);
        anchor.graphics.lineStyle(2, 0x00ffff, 0.4);
        anchor.graphics.strokeCircle(0, 0, 35);
        
        this.showFloatingText(anchor.x, anchor.y - 40, 'RESONANT ANCHOR', '#00ffff');
    }
    
    harmonizeVoid() {
        const voidCoherence = this.scene.voidCoherence;
        if (!voidCoherence) {
            this.showFloatingText(this.scene.player.x, this.scene.player.y - 50,
                'VOID COHERENCE NOT ACTIVE', '#ff6666');
            return;
        }
        
        // Create harmonic link
        voidCoherence.syntropyLinked = true;
        voidCoherence.syntropyDamageMultiplier = 1 + (this.syntropy / 1000);
        
        // Visual link
        const link = this.scene.add.graphics();
        link.lineStyle(2, 0x9d4edd, 0.5);
        
        // Draw connecting line
        link.lineBetween(this.scene.player.x, this.scene.player.y, 
            this.scene.player.x, this.scene.player.y - 50);
        
        this.scene.tweens.add({
            targets: link,
            alpha: 0,
            duration: 2000,
            onComplete: () => link.destroy()
        });
        
        this.showFloatingText(this.scene.player.x, this.scene.player.y - 60,
            'HARMONIC LINK ESTABLISHED', '#9d4edd');
    }
    
    amplifyEchoes() {
        const echoStorm = this.scene.echoStorm;
        if (!echoStorm) {
            this.showFloatingText(this.scene.player.x, this.scene.player.y - 50,
                'ECHO STORM NOT ACTIVE', '#ff6666');
            return;
        }
        
        this.echoAmplified = true;
        this.echoAmpEndTime = this.scene.time.now + this.echoAmpDuration;
        
        // Upgrade all echoes
        echoStorm.echoes.forEach(echo => {
            if (echo && echo.active) {
                echo.resonant = true;
                echo.setTint(0x00ffff);
                
                // Add particle trail
                if (!echo.trail) {
                    echo.trail = this.scene.add.particles(echo.x, echo.y, 'particle', {
                        scale: { start: 0.4, end: 0 },
                        alpha: { start: 0.6, end: 0 },
                        speed: 0,
                        lifespan: 400,
                        tint: 0x00ffff,
                        frequency: 50
                    });
                }
            }
        });
        
        this.showFloatingText(this.scene.player.x, this.scene.player.y - 60,
            'RESONANT ECHOES ACTIVE', '#00ffff');
    }
    
    // ===== CASCADE & SINGULARITY =====
    
    activateCascade() {
        this.cascadeActive = true;
        
        // Visual transformation
        this.scene.cameras.main.postFX.addVignette(0.5, 0.5, 1.5, 0.3);
        
        // Particle effect around player
        if (this.harmonicParticles) {
            this.harmonicParticles.setFrequency(50);
        }
        
        // Notification
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 100,
            'SYNTROPY CASCADE', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: '#00ffff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Notify scene for score multiplier
        if (this.scene.onSyntropyCascadeStart) {
            this.scene.onSyntropyCascadeStart();
        }
    }
    
    updateCascadeEffects(time, delta) {
        // Spawn harmonic particles
        if (this.harmonicParticles && Math.random() < 0.3) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 80;
            const px = this.scene.player.x + Math.cos(angle) * dist;
            const py = this.scene.player.y + Math.sin(angle) * dist;
            this.harmonicParticles.emitParticleAt(px, py);
        }
        
        // If syntropy drops below threshold, end cascade
        if (this.syntropy < 500) {
            this.cascadeActive = false;
            if (this.scene.onSyntropyCascadeEnd) {
                this.scene.onSyntropyCascadeEnd();
            }
        }
    }
    
    updateSyntropyGlow() {
        if (!this.syntropyGlow) return;
        
        this.syntropyGlow.clear();
        
        // Glow intensity based on syntropy level
        const intensity = Math.min(this.syntropy / 1000, 1);
        if (intensity > 0.1) {
            const alpha = intensity * 0.3;
            const radius = 60 + intensity * 40;
            
            // Gradient from cyan to gold
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                { r: 0, g: 255, b: 255 },
                { r: 255, g: 215, b: 0 },
                100,
                Math.floor(intensity * 100)
            );
            const hex = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
            
            this.syntropyGlow.fillStyle(hex, alpha);
            this.syntropyGlow.fillCircle(this.scene.player.x, this.scene.player.y, radius);
        }
    }
    
    showSingularityAvailable() {
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 120,
            'SYNTHETIC SINGULARITY AVAILABLE\nHold Y + Click to create permanent structure', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 6000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    createSyntheticSingularity() {
        if (this.syntropy < 2000) return false;
        
        this.spendSyntropy(2000);
        
        // Choose structure type based on playstyle
        const structure = this.determineOptimalStructure();
        
        // Save to permanent structures
        this.permanentStructures.push(structure);
        this.savePermanentStructures();
        
        // Visual effect
        const burst = this.scene.add.graphics();
        burst.fillStyle(0xffd700, 1);
        burst.fillCircle(this.scene.player.x, this.scene.player.y, 10);
        
        this.scene.tweens.add({
            targets: burst,
            scaleX: 50,
            scaleY: 50,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => burst.destroy()
        });
        
        this.showFloatingText(this.scene.player.x, this.scene.player.y - 80,
            `PERMANENT STRUCTURE CREATED\n${structure.type.toUpperCase()}`, '#ffd700');
        
        return true;
    }
    
    determineOptimalStructure() {
        // Analyze playstyle to determine best structure
        const usesRewind = this.scene.temporalRewind?.rewindCount > 5;
        const usesEchoes = this.scene.echoStorm?.echoes.length > 0;
        const usesVoid = this.scene.voidCoherence?.coherenceLevel > 50;
        
        if (usesRewind) {
            return { type: 'anchorWell', x: 960, y: 720, effect: 'freeAnchors' };
        } else if (usesEchoes) {
            return { type: 'echoChamber', x: 960, y: 720, effect: 'fasterEchoes' };
        } else if (usesVoid) {
            return { type: 'voidNexus', x: 960, y: 720, effect: 'stableVoid' };
        } else {
            return { type: 'syntropyCollector', x: 960, y: 720, effect: 'passiveGain' };
        }
    }
    
    loadPermanentStructures() {
        try {
            return JSON.parse(localStorage.getItem('syntropyStructures') || '[]');
        } catch {
            return [];
        }
    }
    
    savePermanentStructures() {
        localStorage.setItem('syntropyStructures', JSON.stringify(this.permanentStructures));
    }
    
    spawnPermanentStructures() {
        this.permanentStructures.forEach(struct => {
            // Spawn structure visual and effects
            this.spawnStructureVisual(struct);
        });
    }
    
    spawnStructureVisual(struct) {
        const gfx = this.scene.add.graphics();
        
        switch (struct.type) {
            case 'anchorWell':
                gfx.lineStyle(3, 0xffaa00, 0.6);
                gfx.strokeCircle(struct.x, struct.y, 60);
                break;
            case 'echoChamber':
                gfx.lineStyle(2, 0x00f0ff, 0.5);
                for (let i = 0; i < 3; i++) {
                    gfx.strokeCircle(struct.x, struct.y, 40 + i * 20);
                }
                break;
            case 'voidNexus':
                gfx.fillStyle(0x9d4edd, 0.3);
                gfx.fillCircle(struct.x, struct.y, 50);
                break;
            case 'syntropyCollector':
                gfx.lineStyle(2, 0x00ffff, 0.4);
                gfx.strokeCircle(struct.x, struct.y, 45);
                break;
        }
        
        gfx.setDepth(-1);
        
        // Add subtle animation
        this.scene.tweens.add({
            targets: gfx,
            alpha: 0.3,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
    }
    
    // ===== UTILITY METHODS =====
    
    hashRecentSystems() {
        // Create a hash of recent system uses for uniqueness tracking
        return this.recentSystemUses.map(t => Math.floor(t / 1000)).join('-');
    }
    
    showUniqueComboNotification() {
        const x = this.scene.player.x + (Math.random() - 0.5) * 100;
        const y = this.scene.player.y - 80 + (Math.random() - 0.5) * 50;
        
        this.showFloatingText(x, y, 'UNIQUE COMBINATION +100', '#ffd700');
    }
    
    showLevelUp(oldLevel, newLevel) {
        const colors = ['#666666', '#00ffff', '#00ff00', '#ffff00', '#ffaa00', '#ffd700'];
        
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 100,
            `SYNTROPY LEVEL ${oldLevel} → ${newLevel}`, {
            fontFamily: 'monospace',
            fontSize: '18px',
            fill: colors[newLevel] || '#ffd700'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    showFloatingText(x, y, text, color) {
        const txt = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: color,
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: txt,
            y: y - 30,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => txt.destroy()
        });
    }
    
    // Called when player takes damage
    onPlayerDamaged() {
        this.damagelessTimer = 0; // Reset damageless streak
        
        // Option: Lose some syntropy on damage (risk/reward)
        // this.syntropy = Math.max(0, this.syntropy - 50);
    }
    
    // ===== SYNERGIES WITH OTHER SYSTEMS =====
    
    getSyntropyMultiplier() {
        let mult = 1;
        if (this.cascadeActive) mult *= 1.5;
        if (this.scene.kairosMoment?.inKairosState) mult *= 3;
        return mult;
    }
    
    canAffordCrystallize() {
        return this.syntropy >= 200;
    }
    
    isCascadeActive() {
        return this.cascadeActive;
    }
    
    getCascadeBonus() {
        return this.cascadeActive ? 1.5 : 1.0;
    }
    
    // For save/load integration
    serialize() {
        return {
            syntropy: this.syntropy,
            totalGenerated: this.totalSyntropyGenerated,
            level: this.syntropyLevel,
            uniqueCombinations: Array.from(this.uniqueCombinations),
            permanentStructures: this.permanentStructures
        };
    }
    
    deserialize(data) {
        this.syntropy = data.syntropy || 0;
        this.totalSyntropyGenerated = data.totalGenerated || 0;
        this.syntropyLevel = data.level || 0;
        this.uniqueCombinations = new Set(data.uniqueCombinations || []);
        this.permanentStructures = data.permanentStructures || [];
    }
}
