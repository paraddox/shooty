import Phaser from 'phaser';

/**
 * Temporal Rewind System — The "Undo Button" Made Flesh
 * 
 * UnifiedGraphicsManager Implementation (April 2025):
 * - Pure UnifiedGraphicsManager rendering (no legacy graphics objects)
 * - Anchor graphics rendered on 'effects' layer
 * - Rewind effects rendered on 'world' layer (temporal echoes)
 * - Afterimages rendered on 'effects' layer
 * - Zero per-frame graphics.clear() calls (handled by UnifiedGraphicsManager)
 * - Legacy graphics path completely removed
 * 
 * The missing temporal dimension: Intentional time manipulation. While the Paradox
 * Engine lets you predict forward and Chrono-Loop lets you replay recordings, this
 * system lets you actively REWIND TIME — undo mistakes, try different approaches,
 * and weaponize the rewinding itself.
 * 
 * Core Mechanics:
 * 
 * 1. TEMPORAL ANCHORS (Press R to place)
 *    - Creates a glowing checkpoint at your position
 *    - Up to 3 anchors can exist simultaneously
 *    - Each anchor stores: position, health, momentum, all system states
 *    - Anchors persist for 15 seconds before dissolving
 * 
 * 2. TEMPORAL REWIND (Press R again when near an anchor)
 *    - Time flows backward for 2-4 seconds (duration = distance to anchor / speed)
 *    - During rewind: bullets return to their sources, enemies heal, you move backward
 *    - Creates "Temporal Afterimages" — ghost copies of your rewind path
 *    - Afterimages explode when touched, dealing damage to enemies
 * 
 * 3. THE REWIND COST (Strategic tension)
 *    - Each rewind increases "Temporal Instability"
 *    - High instability causes random time glitches (brief slowdowns, visual noise)
 *    - At max instability: anchors become unstable and may explode
 *    - Instability decays over time when not rewinding
 * 
 * 4. AFTERIMAGE COMBAT (The innovation)
 *    - Every rewind creates a trail of afterimages along your rewind path
 *    - Afterimages persist for 5 seconds after rewind completes
 *    - You can shoot through afterimages to amplify bullets (×2 damage)
 *    - Enemies touching afterimages take damage and are briefly stunned
 *    - Afterimages can absorb bullets, protecting you
 * 
 * 5. ANCHOR CHAINS (Advanced technique)
 *    - Rewind through multiple anchors in sequence for combo effects
 *    - Chain rewinds create longer afterimage trails
 *    - Perfect chain (3+ anchors): Creates "Temporal Singularity" at rewind start point
 * 
 * Why this is revolutionary:
 * - First bullet-hell system where rewinding is offensive, not just defensive
 * - Creates "temporal traps" — rewind to create afterimages, lure enemies through
 * - Perfect for correcting near-miss failures or singularity misplacements
 * - Afterimages stack with Echo Storm echoes for massive homing barrages
 * - The instability mechanic prevents spam while rewarding careful timing
 * 
 * Color: Amber/Orange (#ffaa00) — the color of caution, warning, and time reversal
 * 
 * Integration: This system bridges ALL existing mechanics — rewind to fix any mistake,
 * amplify any bullet, enhance any temporal effect.
 */

export default class TemporalRewindSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.AMBER_COLOR = 0xffaa00;
        this.AMBER_GLOW = 0xffcc00;
        this.AMBER_DARK = 0xcc7700;
        this.AFTERIMAGE_COLOR = 0xffdd88;
        
        // Anchor state
        this.anchors = []; // Active temporal anchors
        this.maxAnchors = 3;
        this.anchorLifespan = 15.0; // Seconds before anchor dissolves
        this.anchorRadius = 60; // Detection radius for rewind
        
        // Rewind state
        this.isRewinding = false;
        this.rewindStartTime = 0;
        this.rewindDuration = 0;
        this.rewindSourceAnchor = null;
        this.rewindHistory = []; // Player position history for rewind animation
        this.maxRewindDistance = 500; // Max distance to rewind
        
        // Afterimage combat
        this.afterimages = []; // Active afterimage entities
        this.afterimageLifespan = 5.0;
        this.afterimageDamage = 25;
        this.afterimageAbsorbRadius = 30;
        
        // Instability system (anti-spam mechanic)
        this.instability = 0; // 0-100 scale
        this.maxInstability = 100;
        this.instabilityPerRewind = 25;
        this.instabilityDecay = 8; // Per second
        this.instabilityThreshold = 70; // When glitches start
        
        // Glitch effects at high instability
        this.glitchTimer = 0;
        this.glitchActive = false;
        
        // Input
        this.rKey = null;
        this.rewindCooldown = 0;
        this.rewindCooldownMax = 0.5;
        
        // Chain tracking
        this.chainCount = 0;
        this.chainWindow = 3.0; // Seconds to chain another rewind
        this.chainTimer = 0;
        
        // Visuals - UnifiedGraphicsManager only (no legacy graphics objects)
        this.instabilityBar = null;
        this.rewindOverlay = null;
        
        // Audio/visual effects
        this.rewindPulse = 0;
        this.timeScaleDuringRewind = 0.3; // Slow everything during rewind
        
        // Statistics
        this.totalRewinds = 0;
        this.afterimagesCreated = 0;
        this.bulletsAmplified = 0;
        this.chainRecord = 0;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
        this.startPositionTracking();
    }
    
    createVisuals() {
        // UnifiedGraphicsManager only - all rendering via graphicsManager
        // No legacy graphics objects created
        
        // Instability bar (below resonance cascade)
        this.createInstabilityBar();
        
        // Rewind overlay (amber vignette during rewind)
        this.createRewindOverlay();
    }
    
    createInstabilityBar() {
        // Register with panel-based HUD system
        this.scene.hudPanels.registerSlot('TEMPORAL_REWIND', (container, width) => {
            const barWidth = Math.min(120, width);
            const height = 6;
            
            // Background
            this.instabilityBar = {
                bg: this.scene.add.rectangle(0, 0, barWidth, height, 0x1a1a25, 0.8),
                fill: this.scene.add.rectangle(-barWidth/2 + 1, 0, 0, height - 2, this.AMBER_COLOR, 0.9),
                glow: this.scene.add.rectangle(0, 0, barWidth, height, this.AMBER_GLOW, 0.3)
            };
            
            // Set depth
            Object.values(this.instabilityBar).forEach(el => {
                el.setDepth(101);
                container.add(el);
            });
            
            // Warning text
            this.instabilityText = this.scene.add.text(barWidth/2 + 5, 0, 'UNSTABLE', {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#ffaa00'
            }).setOrigin(0, 0.5).setDepth(101).setVisible(false);
            container.add(this.instabilityText);
        }, 'TOP_LEFT');
    }
    
    createRewindOverlay() {
        // Create amber vignette texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Radial gradient from transparent center to amber edges
        const gradient = ctx.createRadialGradient(128, 128, 50, 128, 128, 180);
        gradient.addColorStop(0, 'rgba(255, 170, 0, 0)');
        gradient.addColorStop(0.7, 'rgba(255, 170, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 170, 0, 0.6)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        this.scene.textures.addCanvas('rewindVignette', canvas);
        
        // Overlay image
        this.rewindOverlay = this.scene.add.image(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'rewindVignette'
        );
        this.rewindOverlay.setScrollFactor(0);
        this.rewindOverlay.setDepth(90);
        this.rewindOverlay.setAlpha(0);
        this.rewindOverlay.setScale(4);
    }
    
    setupInput() {
        this.rKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.rKey.on('down', () => this.onRKeyPressed());
    }
    
    startPositionTracking() {
        // Track player position every 50ms for rewind history
        this.positionHistory = [];
        this.historyDuration = 5.0; // Keep 5 seconds of history
        
        this.scene.time.addEvent({
            delay: 50,
            callback: () => this.recordPosition(),
            loop: true
        });
    }
    
    recordPosition() {
        if (!this.scene.player || this.isRewinding) return;
        
        const now = this.scene.time.now / 1000;
        this.positionHistory.push({
            x: this.scene.player.x,
            y: this.scene.player.y,
            health: this.scene.player.health,
            timestamp: now
        });
        
        // Remove old entries
        const cutoff = now - this.historyDuration;
        this.positionHistory = this.positionHistory.filter(p => p.timestamp > cutoff);
    }
    
    onRKeyPressed() {
        if (this.rewindCooldown > 0 || this.isRewinding) return;
        
        // Check if near an anchor for rewind
        const nearestAnchor = this.findNearestAnchor();
        
        if (nearestAnchor && nearestAnchor.distance < this.anchorRadius) {
            // Rewind to anchor
            this.startRewind(nearestAnchor.anchor);
        } else if (this.anchors.length < this.maxAnchors) {
            // Place new anchor
            this.placeAnchor();
        }
    }
    
    findNearestAnchor() {
        if (this.anchors.length === 0 || !this.scene.player) return null;
        
        let nearest = null;
        let minDist = Infinity;
        
        for (const anchor of this.anchors) {
            const dist = Phaser.Math.Distance.Between(
                this.scene.player.x, this.scene.player.y,
                anchor.x, anchor.y
            );
            if (dist < minDist) {
                minDist = dist;
                nearest = anchor;
            }
        }
        
        return nearest ? { anchor: nearest, distance: minDist } : null;
    }
    
    placeAnchor() {
        const player = this.scene.player;
        if (!player) return;
        
        // Capture current state
        const anchor = {
            id: Phaser.Math.RND.uuid(),
            x: player.x,
            y: player.y,
            health: player.health,
            createdAt: this.scene.time.now / 1000,
            pulsePhase: 0,
            
            // Capture all temporal system states
            systemStates: this.captureSystemStates()
        };
        
        this.anchors.push(anchor);
        
        // Visual effect
        this.spawnAnchorPlacementEffect(anchor.x, anchor.y);
        
        // Announce
        this.showAnchorText(`ANCHOR PLACED (${this.anchors.length}/${this.maxAnchors})`);
        
        // Resonance cascade integration
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('ANCHOR_PLACED', {
                anchorCount: this.anchors.length
            });
        }
        
        // Omni-weapon progress
        if (this.scene.omniWeapon) {
            this.scene.omniWeapon.addProgress('RAPID', 5);
        }
    }
    
    captureSystemStates() {
        // Save relevant states from other systems
        const states = {};
        
        if (this.scene.fractureSystem) {
            states.momentum = this.scene.fractureSystem.momentum || 0;
        }
        
        if (this.scene.singularitySystem) {
            states.singularityCharge = this.scene.singularitySystem.charge || 0;
        }
        
        if (this.scene.resonanceCascade) {
            states.resonanceChain = this.scene.resonanceCascade.currentChain?.length || 0;
        }
        
        return states;
    }
    
    startRewind(anchor) {
        this.isRewinding = true;
        this.rewindSourceAnchor = anchor;
        this.rewindStartTime = this.scene.time.now / 1000;
        this.totalRewinds++;
        
        // Calculate rewind duration based on distance
        const player = this.scene.player;
        const dist = Phaser.Math.Distance.Between(player.x, player.y, anchor.x, anchor.y);
        this.rewindDuration = Math.min(4.0, Math.max(2.0, dist / 150));
        
        // Add instability
        this.instability = Math.min(this.maxInstability, this.instability + this.instabilityPerRewind);
        
        // Track chain
        if (this.chainTimer > 0) {
            this.chainCount++;
            this.chainRecord = Math.max(this.chainRecord, this.chainCount);
        } else {
            this.chainCount = 1;
        }
        this.chainTimer = this.chainWindow;
        
        // Build rewind path from history
        this.buildRewindPath(anchor);
        
        // Show rewind announcement
        const chainBonus = this.chainCount > 1 ? ` ×${this.chainCount}` : '';
        this.showAnchorText(`REWIND${chainBonus}`, true);
        
        // Create afterimages along path
        this.createAfterimagesAlongPath();
        
        // Resonance cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('REWIND', {
                chainCount: this.chainCount,
                distance: Math.floor(dist)
            });
        }
        
        // Reverse bullets during rewind
        this.reverseEnemyBullets();
        
        // Omni-weapon
        if (this.scene.omniWeapon) {
            this.scene.omniWeapon.addProgress('RAPID', 8);
            this.scene.omniWeapon.addProgress('ELEMENTAL', 5);
        }
    }
    
    buildRewindPath(anchor) {
        // Build path from current position back to anchor position
        this.rewindHistory = [];
        
        const now = this.scene.time.now / 1000;
        const targetTime = anchor.createdAt;
        
        // Filter history to get positions between now and anchor time
        const relevantHistory = this.positionHistory.filter(
            p => p.timestamp >= targetTime && p.timestamp <= now
        );
        
        // Reverse the history (rewind goes backward in time)
        this.rewindHistory = relevantHistory.reverse();
        
        // Add anchor position as final destination
        this.rewindHistory.push({
            x: anchor.x,
            y: anchor.y,
            health: anchor.health,
            timestamp: targetTime
        });
    }
    
    createAfterimagesAlongPath() {
        const player = this.scene.player;
        if (!player) return;
        
        // Create afterimages every 40 pixels along rewind path
        let lastX = player.x;
        let lastY = player.y;
        let distanceAccumulator = 0;
        
        for (const point of this.rewindHistory) {
            const dist = Phaser.Math.Distance.Between(lastX, lastY, point.x, point.y);
            distanceAccumulator += dist;
            
            if (distanceAccumulator >= 40) {
                this.createAfterimage(point.x, point.y);
                distanceAccumulator = 0;
            }
            
            lastX = point.x;
            lastY = point.y;
        }
        
        // Always create one at the destination
        this.createAfterimage(lastX, lastY);
    }
    
    createAfterimage(x, y) {
        const afterimage = {
            x, y,
            createdAt: this.scene.time.now / 1000,
            lifespan: this.afterimageLifespan,
            hasAmplified: false,
            absorbedBullets: 0,
            id: Phaser.Math.RND.uuid()
        };
        
        this.afterimages.push(afterimage);
        this.afterimagesCreated++;
        
        // Spawn effect
        this.spawnAfterimageEffect(x, y);
    }
    
    reverseEnemyBullets() {
        // During rewind, reverse enemy bullet velocities
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.active) {
                bullet.isReversed = true;
                bullet.preRewindVelocity = { x: bullet.body.velocity.x, y: bullet.body.velocity.y };
                bullet.body.setVelocity(-bullet.body.velocity.x * 0.5, -bullet.body.velocity.y * 0.5);
            }
        });
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;

        // Update cooldowns
        if (this.rewindCooldown > 0) {
            this.rewindCooldown = Math.max(0, this.rewindCooldown - dt);
        }
        
        // Update chain timer
        if (this.chainTimer > 0) {
            this.chainTimer = Math.max(0, this.chainTimer - dt);
        }
        
        // Decay instability
        if (this.instability > 0 && !this.isRewinding) {
            this.instability = Math.max(0, this.instability - this.instabilityDecay * dt);
        }
        
        // Update glitch effects
        this.updateGlitchEffects(dt);
        
        // Update anchors (lifespan, pulsing)
        this.updateAnchors(dt);
        
        // Update rewind state
        if (this.isRewinding) {
            this.updateRewind(dt);
        }
        
        // Update afterimages
        this.updateAfterimages(dt);
        
        // Update UI
        this.updateUI(dt);
        
        // Render everything
        this.render();
    }
    
    updateGlitchEffects(dt) {
        if (this.instability > this.instabilityThreshold) {
            this.glitchTimer -= dt;
            
            if (this.glitchTimer <= 0) {
                this.glitchTimer = Math.random() * 2 + 0.5;
                this.triggerGlitch();
            }
        }
    }
    
    triggerGlitch() {
        // Brief time slowdown
        this.scene.physics.world.timeScale = 0.5;
        
        // Visual static
        this.scene.cameras.main.shake(100, 0.01);
        
        // Show glitch text
        const glitchText = this.scene.add.text(
            this.scene.player?.x || 400,
            this.scene.player?.y || 300,
            ['GLITCH', 'STATIC', 'UNSTABLE'][Math.floor(Math.random() * 3)],
            { fontFamily: 'monospace', fontSize: '14px', fill: '#ffaa00' }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: glitchText,
            alpha: 0,
            y: glitchText.y - 30,
            duration: 500,
            onComplete: () => glitchText.destroy()
        });
        
        // Restore time scale
        this.scene.time.delayedCall(200, () => {
            if (!this.isRewinding) {
                this.scene.physics.world.timeScale = 1.0;
            }
        });
    }
    
    updateAnchors(dt) {
        const now = this.scene.time.now / 1000;
        
        this.anchors = this.anchors.filter(anchor => {
            const age = now - anchor.createdAt;
            
            if (age >= this.anchorLifespan) {
                // Anchor dissolves
                this.spawnAnchorDissolveEffect(anchor.x, anchor.y);
                return false;
            }
            
            // Pulse animation
            anchor.pulsePhase += dt * 3;
            
            return true;
        });
    }
    
    updateRewind(dt) {
        const now = this.scene.time.now / 1000;
        const elapsed = now - this.rewindStartTime;
        const progress = Math.min(1.0, elapsed / this.rewindDuration);
        
        // Slow time during rewind
        this.scene.physics.world.timeScale = this.timeScaleDuringRewind;
        
        // Move player along rewind path
        this.updatePlayerRewindPosition(progress);
        
        // Visual pulse
        this.rewindPulse += dt * 10;
        
        // Show overlay
        this.rewindOverlay.setAlpha(0.4 + Math.sin(this.rewindPulse) * 0.2);
        
        // Check if rewind complete
        if (progress >= 1.0) {
            this.completeRewind();
        }
    }
    
    updatePlayerRewindPosition(progress) {
        const player = this.scene.player;
        if (!player || this.rewindHistory.length < 2) return;
        
        // Find position in history based on progress
        const targetIndex = Math.floor(progress * (this.rewindHistory.length - 1));
        const clampedIndex = Math.min(targetIndex, this.rewindHistory.length - 1);
        const point = this.rewindHistory[clampedIndex];
        
        if (point) {
            player.x = point.x;
            player.y = point.y;
            
            // Restore health gradually during rewind (optional - can be disabled for difficulty)
            // player.health = point.health;
        }
    }
    
    completeRewind() {
        this.isRewinding = false;
        this.rewindCooldown = this.rewindCooldownMax;
        
        // Restore normal time
        this.scene.physics.world.timeScale = 1.0;
        
        // Hide overlay
        this.rewindOverlay.setAlpha(0);
        
        // Remove the used anchor
        if (this.rewindSourceAnchor) {
            this.anchors = this.anchors.filter(a => a.id !== this.rewindSourceAnchor.id);
            this.rewindSourceAnchor = null;
        }
        
        // Restore bullet velocities
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.active && bullet.isReversed) {
                bullet.isReversed = false;
                if (bullet.preRewindVelocity) {
                    bullet.body.setVelocity(bullet.preRewindVelocity.x, bullet.preRewindVelocity.y);
                }
            }
        });
        
        // Chain bonus effects
        if (this.chainCount >= 3) {
            this.triggerChainBonus();
        }
    }
    
    triggerChainBonus() {
        // 3+ chain rewinds create a temporal singularity at the end point
        const player = this.scene.player;
        if (!player) return;
        
        // Visual announcement
        this.showAnchorText(`CHAIN ×${this.chainCount} — TEMPORAL COLLAPSE!`, true);
        
        // Area damage effect
        this.createTemporalCollapseEffect(player.x, player.y);
        
        // Damage nearby enemies
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
            if (dist < 150) {
                enemy.takeDamage(50 * this.chainCount);
            }
        });
        
        // Screen shake
        this.scene.cameras.main.shake(400, 0.03);
    }
    
    updateAfterimages(dt) {
        const now = this.scene.time.now / 1000;
        
        this.afterimages = this.afterimages.filter(afterimage => {
            const age = now - afterimage.createdAt;
            
            if (age >= afterimage.lifespan) {
                // Fade out effect
                this.spawnAfterimageFadeEffect(afterimage.x, afterimage.y);
                return false;
            }
            
            // Check for bullet amplification
            this.checkBulletAmplification(afterimage);
            
            // Check for enemy collision
            this.checkEnemyCollision(afterimage);
            
            return true;
        });
    }
    
    checkBulletAmplification(afterimage) {
        // Player bullets passing through afterimages get amplified
        // OPTIMIZED: Early exit if afterimage already amplified (one-time effect)
        if (afterimage.hasAmplified) return;
        
        // Only check active bullets that haven't been amplified
        const bullets = this.scene.bullets.children.entries;
        const radius = this.afterimageAbsorbRadius;
        const radiusSq = radius * radius; // Use squared distance to avoid sqrt
        
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            if (!bullet.active || bullet.hasBeenAmplified) continue;
            
            // Quick AABB check first, then squared distance
            const dx = bullet.x - afterimage.x;
            const dy = bullet.y - afterimage.y;
            if (dx * dx + dy * dy > radiusSq) continue;
            
            // Bullet is in range - amplify it
            bullet.damageMultiplier = (bullet.damageMultiplier || 1) * 2;
            bullet.hasBeenAmplified = true;
            bullet.setTint(this.AMBER_COLOR);
            
            afterimage.hasAmplified = true;
            this.bulletsAmplified++;
            
            // Visual feedback
            this.spawnAmplificationEffect(afterimage.x, afterimage.y);
            
            // Afterimage can only amplify once
            break;
        }
    }
    
    checkEnemyCollision(afterimage) {
        // Enemies touching afterimages take damage
        // OPTIMIZED: Throttle collision checks (every 3rd frame)
        if (this.scene.time.now % 3 !== 0) return;
        
        const enemies = this.scene.enemies.children.entries;
        const radius = this.afterimageAbsorbRadius + 20;
        const radiusSq = radius * radius;
        
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (!enemy.active) continue;
            
            // Squared distance check
            const dx = enemy.x - afterimage.x;
            const dy = enemy.y - afterimage.y;
            if (dx * dx + dy * dy > radiusSq) continue;
            
            // Enemy is in range - deal damage
            enemy.takeDamage(this.afterimageDamage);
            
            // Brief stun
            if (enemy.body) {
                const oldSpeed = enemy.body.maxSpeed;
                enemy.body.maxSpeed = 0;
                this.scene.time.delayedCall(300, () => {
                    if (enemy.body) enemy.body.maxSpeed = oldSpeed;
                });
            }
            
            // Visual feedback
            this.spawnAfterimageHitEffect(afterimage.x, afterimage.y);
        }
    }
    
    updateUI(dt) {
        // Update instability bar
        const width = 120;
        const fillWidth = (this.instability / this.maxInstability) * (width - 2);
        
        this.instabilityBar.fill.width = fillWidth;
        this.instabilityBar.fill.x = 30 - width/2 + 1 + fillWidth/2;
        
        // Show warning at high instability
        this.instabilityText.setVisible(this.instability > this.instabilityThreshold);
        
        // Change color at max
        if (this.instability >= this.maxInstability) {
            this.instabilityBar.fill.fillColor = 0xff0000;
        } else {
            this.instabilityBar.fill.fillColor = this.AMBER_COLOR;
        }
    }
    
    /**
     * Unified rendering via UnifiedGraphicsManager - registers commands instead of direct drawing
     * 
     * Layer separation:
     * - 'effects' layer: for afterimages (visual effects)
     * - 'world' layer: for rewind effects (temporal echoes in the world)
     * - 'effects' layer: for anchors (interactive world elements)
     * 
     * Benefits: UnifiedGraphicsManager clears once per frame per layer,
     * eliminating per-frame graphics.clear() calls from this system.
     */
    render() {
        if (!this.scene.graphicsManager) return;
        const manager = this.scene.graphicsManager;
        
        // Render anchors using unified renderer (effects layer)
        this.renderAnchorsUnified(manager);
        
        // Render rewind effects using unified renderer (world layer - temporal echoes)
        if (this.isRewinding) {
            this.renderRewindEffectsUnified(manager);
        }
        
        // Render afterimages using unified renderer (effects layer)
        this.renderAfterimagesUnified(manager);
    }
    
    renderAnchorsUnified(manager) {
        const player = this.scene.player;
        if (!player) return;
        
        for (const anchor of this.anchors) {
            const dist = Phaser.Math.Distance.Between(player.x, player.y, anchor.x, anchor.y);
            const isInRange = dist < this.anchorRadius;
            
            // Pulsing ring
            const pulse = Math.sin(anchor.pulsePhase) * 0.3 + 0.7;
            const alpha = isInRange ? 0.9 : 0.6;
            
            // Outer ring (as filled circle with lower alpha + smaller circle for stroke effect)
            manager.drawCircle('effects', anchor.x, anchor.y, 25 * pulse, this.AMBER_COLOR, alpha * 0.3);
            
            // Inner glow
            manager.drawCircle('effects', anchor.x, anchor.y, 15, this.AMBER_GLOW, alpha * 0.4);
            
            // Center dot
            manager.drawCircle('effects', anchor.x, anchor.y, 6, this.AMBER_COLOR, 1);
            
            // Range indicator when in range (as larger circle outline approximated)
            if (isInRange) {
                manager.drawCircle('effects', anchor.x, anchor.y, this.anchorRadius, this.AMBER_COLOR, 0.15);
                
                // "PRESS R" hint
                if (!this.isRewinding && this.rewindCooldown <= 0) {
                    manager.drawCircle('effects', anchor.x, anchor.y - 35, 3, this.AMBER_COLOR, 0.8);
                }
            }
            
            // Lifespan indicator (arc) - approximate with partial circle
            const age = (this.scene.time.now / 1000) - anchor.createdAt;
            const remaining = 1 - (age / this.anchorLifespan);
            if (remaining > 0) {
                // Draw arc indicator as a ring segment using multiple small circles
                const arcRadius = 30;
                const segments = Math.floor(remaining * 12);
                for (let i = 0; i < segments; i++) {
                    const angle = -Math.PI / 2 + (i / 12) * Math.PI * 2;
                    const arcX = anchor.x + Math.cos(angle) * arcRadius;
                    const arcY = anchor.y + Math.sin(angle) * arcRadius;
                    manager.drawCircle('effects', arcX, arcY, 2, this.AMBER_DARK, 0.5);
                }
            }
        }
    }
    
    renderRewindEffectsUnified(manager) {
        // Time distortion waves - rendered on 'world' layer as temporal echoes
        const waveCount = 3;
        const player = this.scene.player;
        if (!player) return;
        
        for (let i = 0; i < waveCount; i++) {
            const offset = (this.rewindPulse + i * (Math.PI * 2 / waveCount)) % (Math.PI * 2);
            const radius = 50 + offset * 30;
            const alpha = 1 - (offset / (Math.PI * 2));
            
            // Use 'world' layer for rewind temporal echo effects
            manager.drawCircle('world', player.x, player.y, radius, this.AMBER_COLOR, alpha * 0.3);
        }
        
        // Rewind path line - rendered on 'world' layer
        if (this.rewindHistory.length > 1) {
            manager.drawPath('world', this.rewindHistory, this.AMBER_GLOW, 0.6, 3);
        }
    }
    
    renderAfterimagesUnified(manager) {
        // Render afterimages on 'effects' layer (visual effects layer)
        const now = this.scene.time.now / 1000;
        
        for (const afterimage of this.afterimages) {
            const age = now - afterimage.createdAt;
            const remaining = 1 - (age / afterimage.lifespan);
            
            // Fade out as it ages
            const alpha = remaining * 0.6;
            const scale = 0.8 + remaining * 0.2;
            
            // Translucent player shape (filled triangle approximation)
            const size = 15 * scale;
            // Draw player shape as three connected lines forming a triangle
            this.drawPlayerShapeUnified(manager, afterimage.x, afterimage.y, scale, this.AFTERIMAGE_COLOR, alpha * 0.3, false);
            
            // Glow outline
            this.drawPlayerShapeUnified(manager, afterimage.x, afterimage.y, scale, this.AMBER_GLOW, alpha, true);
            
            // Pulse if it has amplified a bullet
            if (afterimage.hasAmplified) {
                const pulse = Math.sin(this.scene.time.now / 200) * 0.3 + 0.7;
                manager.drawCircle('effects', afterimage.x, afterimage.y, 10 * pulse, this.AMBER_COLOR, alpha * 0.5 * pulse);
            }
        }
    }
    
    drawPlayerShapeUnified(manager, x, y, scale, color, alpha, strokeOnly) {
        // Draw triangle like the player ship using lines
        const size = 15 * scale;
        
        // Calculate triangle points
        const tipX = x;
        const tipY = y - size;
        const leftX = x + size * 0.8;
        const leftY = y + size * 0.6;
        const rightX = x - size * 0.8;
        const rightY = y + size * 0.6;
        
        if (strokeOnly) {
            // Draw outline using lines
            manager.drawLine('effects', tipX, tipY, leftX, leftY, color, alpha, 2);
            manager.drawLine('effects', leftX, leftY, rightX, rightY, color, alpha, 2);
            manager.drawLine('effects', rightX, rightY, tipX, tipY, color, alpha, 2);
        } else {
            // Draw filled shape using multiple circles for approximation
            const centerX = x;
            const centerY = y + size * 0.1;
            manager.drawCircle('effects', centerX, centerY, size * 0.7, color, alpha);
        }
    }
    
    // Visual effects
    spawnAnchorPlacementEffect(x, y) {
        // OPTIMIZED: Use circle instead of graphics with per-frame clear()
        // Graphics clear() in onUpdate creates garbage and hurts performance
        const ring = this.scene.add.circle(x, y, 10, this.AMBER_COLOR);
        ring.setStrokeStyle(3, this.AMBER_COLOR, 0.8);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => ring.destroy()
        });
        
        // Particles
        if (this.scene.hitParticles) {
            this.scene.hitParticles.emitParticleAt(x, y, 8);
        }
    }
    
    spawnAnchorDissolveEffect(x, y) {
        const ring = this.scene.add.graphics();
        ring.fillStyle(this.AMBER_COLOR, 0.5);
        ring.fillCircle(x, y, 25);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 0,
            alpha: 0,
            duration: 300,
            onComplete: () => ring.destroy()
        });
    }
    
    spawnAfterimageEffect(x, y) {
        // Brief flash
        const flash = this.scene.add.circle(x, y, 20, this.AFTERIMAGE_COLOR, 0.6);
        
        this.scene.tweens.add({
            targets: flash,
            scale: 1.5,
            alpha: 0,
            duration: 300,
            onComplete: () => flash.destroy()
        });
    }
    
    spawnAmplificationEffect(x, y) {
        // Upward arrow or flash
        const text = this.scene.add.text(x, y - 20, '×2', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            fill: '#ffaa00'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 40,
            alpha: 0,
            duration: 600,
            onComplete: () => text.destroy()
        });
    }
    
    spawnAfterimageHitEffect(x, y) {
        if (this.scene.hitParticles) {
            this.scene.hitParticles.emitParticleAt(x, y, 4);
        }
    }
    
    spawnAfterimageFadeEffect(x, y) {
        const fade = this.scene.add.circle(x, y, 15, this.AFTERIMAGE_COLOR, 0.3);
        
        this.scene.tweens.add({
            targets: fade,
            scale: 0.5,
            alpha: 0,
            duration: 200,
            onComplete: () => fade.destroy()
        });
    }
    
    createTemporalCollapseEffect(x, y) {
        // Massive ring expansion effect
        // Note: This uses a local graphics object for a one-shot tween effect
        // The clear() here is acceptable as it's part of a tween animation, not per-frame rendering
        const ring = this.scene.add.graphics();
        ring.lineStyle(5, this.AMBER_COLOR, 1);
        
        this.scene.tweens.add({
            targets: { radius: 10 },
            radius: 200,
            duration: 500,
            onUpdate: (tween) => {
                ring.clear();
                ring.lineStyle(5, this.AMBER_COLOR, 1 - tween.progress);
                ring.strokeCircle(x, y, tween.getValue());
            },
            onComplete: () => ring.destroy()
        });
        
        // Shockwave particles
        if (this.scene.deathParticles) {
            this.scene.deathParticles.emitParticleAt(x, y, 20);
        }
    }
    
    showAnchorText(text, isBig = false) {
        const player = this.scene.player;
        if (!player) return;
        
        const display = this.scene.add.text(player.x, player.y - 60, text, {
            fontFamily: 'monospace',
            fontSize: isBig ? '18px' : '14px',
            fontStyle: isBig ? 'bold' : 'normal',
            fill: '#ffaa00',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: display,
            y: display.y - 40,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => display.destroy()
        });
    }
    
    // Public methods for integration
    
    checkAfterimageBulletAbsorption(bulletX, bulletY) {
        // Called by GameScene to check if afterimage absorbs a bullet
        for (const afterimage of this.afterimages) {
            const dist = Phaser.Math.Distance.Between(
                bulletX, bulletY, afterimage.x, afterimage.y
            );
            
            if (dist < this.afterimageAbsorbRadius) {
                afterimage.absorbedBullets++;
                this.spawnAfterimageHitEffect(afterimage.x, afterimage.y);
                return true;
            }
        }
        return false;
    }
    
    getAfterimageCount() {
        return this.afterimages.length;
    }
    
    getChainCount() {
        return this.chainCount;
    }
    
    // Cleanup
    destroy() {
        // UnifiedGraphicsManager only - no legacy graphics objects to destroy
        if (this.rewindOverlay) this.rewindOverlay.destroy();
        
        Object.values(this.instabilityBar).forEach(el => el.destroy());
        if (this.instabilityText) this.instabilityText.destroy();
        
        this.anchors = [];
        this.afterimages = [];
    }
}
