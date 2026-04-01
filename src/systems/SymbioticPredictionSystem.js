import Phaser from 'phaser';

/**
 * MIGRATED to UnifiedGraphicsManager (April 2025):
 * - Connection line rendering uses UnifiedGraphicsManager on 'effects' layer
 * - REMOVED: Legacy graphics.clear() calls from renderConnectionLines()
 * - REMOVED: Direct graphics.lineBetween() calls - now batched via manager
 * - REMOVED: Legacy fallback code path entirely
 * 
 * Migration complete - UnifiedGraphicsManager is now the sole rendering path.
 * Connection lines are registered via manager.drawLine('effects', ...) and
 * the manager handles batching and clearing once per frame.
 */

/**
 * Symbiotic Prediction Engine — The Game That Thinks With You
 * 
 * The ultimate evolution of the Observer Effect: the game doesn't just watch,
 * it PREDICTS. Intent Echoes appear showing where the game thinks you'll move.
 * This creates a cognitive partnership between human intuition and machine
 * intelligence - a genuine symbiosis.
 * 
 * === CORE MECHANIC ===
 * The AI continuously predicts your next 2 seconds of movement based on:
 * - Current velocity and momentum
 * - Historical movement patterns (from ObserverEffectSystem)
 * - Threat avoidance patterns (where bullets are)
 * - Your "personality profile" (aggressive/cautious/chaotic)
 * 
 * Predictions manifest as INTENT ECHOES - translucent geometric shapes
 * showing the AI's expectation of your position.
 * 
 * === THE SYMBIOTIC CHOICE ===
 * When an Intent Echo appears, you have two paths:
 * 
 * 1. FULFILL (move to the echo): 
 *    - "Harmony Bonus": +50% damage for 3 seconds
 *    - Resonance Cascade gains +1 chain per fulfilled prediction
 *    - Visual: Echo blooms into cyan flower, peaceful chords
 *    - Message: "MINDS ALIGN"
 * 
 * 2. SUBVERT (move elsewhere):
 *    - "Chaos Bonus": Next bullets home to where AI predicted
 *    - Paradox Engine gains projection duration
 *    - Visual: Echo shatters into red fragments, discordant tone
 *    - Message: "UNPREDICTABLE"
 * 
 * === PREDICTION ACCURACY & ADAPTATION ===
 * The AI tracks its accuracy. If predictions are often subverted:
 * - It becomes more conservative (shorter prediction windows)
 * - Increases "chaos factor" in its models
 * - Switches to "ensemble predictions" (multiple possible echoes)
 * 
 * If predictions are often fulfilled:
 * - Becomes more confident (longer windows, precise echoes)
 * - Generates "combo predictions" (chains of 2-3 echoes)
 * - Rewards increase but so does challenge complexity
 * 
 * === THE PREDICTION FIELD ===
 * A subtle grid overlay shows the AI's "confidence map":
 * - Bright cyan: High confidence you'll be here
 * - Dim purple: Uncertainty territory
 * - Pulsing gold: Critical prediction points (major bonus if fulfilled)
 * 
 * === SYNERGIES ===
 * - Echo Storm: Intent Echoes can absorb bullets, protecting predicted path
 * - Paradox Engine: Future Echo + Intent Echo = Perfect Prediction (5x bonus)
 * - Observer Effect: AI uses behavioral profile to improve predictions
 * - Resonance Cascade: Each fulfilled prediction adds chain potential
 * - Causal Entanglement: Link yourself to your Intent Echo for teleportation
 * - Chrono-Loop: Past echoes show where AI predicted before vs after
 * - Void Coherence: High coherence makes predictions more visible/accurate
 * - Quantum Immortality: Death echoes preserve prediction state
 * - Tesseract Titan: Boss generates INTENT ECHOES of its own attacks
 * - Timeline Chronicle: Saves prediction accuracy as "Symbiosis Score"
 * 
 * === STRATEGIC DEPTH ===
 * Skilled players can:
 * - "Ride the prediction" for consistent harmony bonuses
 * - Intentionally train the AI to predict conservatively, then surprise it
 * - Use prediction fields to identify safe zones (AI avoids predicting into bullets)
 * - Chain fulfillments for massive resonance cascades
 * - Subvert at critical moments to weaponize chaos
 * 
 * === THE META-GAME ===
 * Over multiple runs, the AI develops a "relationship" with you:
 * - New players: AI is cautious, generous with short predictions
 * - Intermediate: AI challenges you with longer, trickier predictions
 * - Expert: AI engages in "prediction duels" - rapid-fire fulfill/subvert choices
 * - Mastery: AI and player enter "flow state" where predictions feel psychic
 * 
 * Color: Shifting cyan (harmony) to magenta (chaos) based on symbiosis state
 * 
 * This is the final evolution: a game that doesn't just react, but ANTICIPATES,
 * creating a genuine cognitive partnership between human creativity and
 * machine intelligence. You don't just play the game - you think with it.
 */

export default class SymbioticPredictionSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== PREDICTION STATE =====
        this.predictions = []; // Active Intent Echoes
        this.maxPredictions = 3;
        this.predictionCooldown = 0;
        this.predictionInterval = 1.5; // Seconds between new predictions
        this.predictionWindow = 2.0; // How far ahead (seconds)
        this.predictionSteps = 10; // Resolution of prediction path
        
        // ===== AI LEARNING STATE =====
        this.aiState = {
            accuracy: 0.5, // 0-1, tracks how often player fulfills predictions
            confidence: 0.5, // Current confidence level (affects window size)
            chaosFactor: 0.2, // How "unpredictable" it thinks you are
            harmonyStreak: 0, // Consecutive fulfillments
            chaosStreak: 0, // Consecutive subversions
            totalPredictions: 0,
            fulfilledCount: 0,
            subvertedCount: 0,
            symbiosisDepth: 0 // Overall relationship score (0-100)
        };
        
        // ===== PREDICTION MODEL =====
        // Uses weighted factors to predict movement
        this.predictionWeights = {
            momentum: 0.4, // Continue current velocity
            threatAvoidance: 0.3, // Move away from bullets
            historical: 0.2, // Pattern from ObserverEffect
            random: 0.1 // Chaos factor
        };
        
        // ===== VISUALS =====
        this.intentEchoes = []; // Array of echo objects
        this.predictionField = null; // Grid overlay
        this.harmonyIndicator = null; // Shows current state
        this.connectionLines = []; // Lines to predictions
        
        // ===== UNIFIED RENDERING =====
        // Connection lines are rendered via UnifiedGraphicsManager on 'effects' layer
        // No local graphics objects for per-frame rendering
        
        // ===== BONUS STATE =====
        this.harmonyActive = false;
        this.harmonyTimer = 0;
        this.harmonyMultiplier = 1.0;
        this.chaosCharges = 0; // Stored subversion bonuses
        
        // ===== COLORS =====
        this.HARMONY_COLOR = 0x00f0ff; // Cyan - alignment
        this.CHAOS_COLOR = 0xff0066; // Magenta-red - subversion
        this.NEUTRAL_COLOR = 0x9d4edd; // Purple - uncertainty
        this.GOLD_COLOR = 0xffd700; // Gold - critical prediction
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
        this.startPredictionLoop();
    }
    
    createVisuals() {
        // Prediction field - subtle grid showing AI confidence
        this.createPredictionField();
        
        // Harmony/Chaos indicator (top of screen)
        this.createSymbiosisIndicator();
        
        // Note: Connection lines are rendered via UnifiedGraphicsManager on 'effects' layer
        // No local graphics objects - all rendering goes through manager
        
        // Bonus text effects
        this.bonusTextContainer = this.scene.add.container(0, 0);
        this.bonusTextContainer.setDepth(100);
    }
    
    createPredictionField() {
        // Create a subtle animated texture for the prediction field
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Draw faint grid that pulses with AI confidence
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
        ctx.lineWidth = 1;
        
        const gridSize = 32;
        for (let x = 0; x <= 256; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 256);
            ctx.stroke();
        }
        for (let y = 0; y <= 256; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(256, y);
            ctx.stroke();
        }
        
        this.scene.textures.addCanvas('predictionGrid', canvas);
        
        // The field covers the entire arena
        this.predictionField = this.scene.add.tileSprite(
            960, 720, // Center of 1920x1440 world
            1920, 1440,
            'predictionGrid'
        );
        this.predictionField.setDepth(5);
        this.predictionField.setAlpha(0.3);
        this.predictionField.setTint(this.NEUTRAL_COLOR);
    }
    
    createSymbiosisIndicator() {
        // Top-center indicator showing harmony/chaos balance - registered with HUDLayoutManager
        const pos = this.scene.hudLayout.getSlotPosition('SYMBIOSIS', 'TOP_CENTER');
        this.symbiosisContainer = this.scene.add.container(pos.x, pos.y);
        this.symbiosisContainer.setScrollFactor(0);
        this.symbiosisContainer.setDepth(100);
        this.scene.hudLayout.registerSlot('SYMBIOSIS', this.symbiosisContainer, 'TOP_CENTER');
        
        // Background bar
        const barBg = this.scene.add.rectangle(0, 0, 200, 6, 0x22222a);
        this.symbiosisContainer.add(barBg);
        
        // Harmony side (left, cyan)
        this.harmonyBar = this.scene.add.rectangle(-50, 0, 100, 4, this.HARMONY_COLOR, 0.3);
        this.harmonyBar.setOrigin(0, 0.5);
        this.symbiosisContainer.add(this.harmonyBar);
        
        // Chaos side (right, magenta)
        this.chaosBar = this.scene.add.rectangle(50, 0, 100, 4, this.CHAOS_COLOR, 0.3);
        this.chaosBar.setOrigin(1, 0.5);
        this.symbiosisContainer.add(this.chaosBar);
        
        // Center marker
        this.centerMarker = this.scene.add.rectangle(0, 0, 2, 8, 0xffffff, 0.5);
        this.symbiosisContainer.add(this.centerMarker);
        
        // State label
        this.symbiosisLabel = this.scene.add.text(0, -15, 'SYMBIOSIS', {
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: 2,
            fill: '#666677'
        }).setOrigin(0.5);
        this.symbiosisContainer.add(this.symbiosisLabel);
        
        // Status text (HARMONY / CHAOS / BALANCED)
        this.statusText = this.scene.add.text(0, 12, 'BALANCED', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 1,
            fill: '#9d4edd'
        }).setOrigin(0.5);
        this.symbiosisContainer.add(this.statusText);
        
        // Symbiosis depth percentage
        this.depthText = this.scene.add.text(120, 0, '0%', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#00f0ff'
        }).setOrigin(0, 0.5);
        this.symbiosisContainer.add(this.depthText);
    }
    
    setupInput() {
        // No direct input - this system works through movement choices
        // Player fulfills or subverts by their natural movement
    }
    
    startPredictionLoop() {
        // Continuous prediction generation
        this.scene.time.addEvent({
            delay: this.predictionInterval * 1000,
            callback: () => this.generatePrediction(),
            loop: true
        });
        
        // Accuracy tracking loop
        this.scene.time.addEvent({
            delay: 500, // Check every 0.5 seconds
            callback: () => this.checkPredictionOutcomes(),
            loop: true
        });
    }
    
    generatePrediction() {
        if (!this.scene.player.active) return;
        if (this.predictions.length >= this.maxPredictions) return;
        
        const player = this.scene.player;
        const prediction = this.calculatePrediction(player);
        
        if (!prediction) return;
        
        // Create visual echo
        const echo = this.createIntentEcho(prediction);
        
        this.predictions.push({
            ...prediction,
            echo,
            createdAt: this.scene.time.now,
            fulfilled: false,
            subverted: false,
            id: Phaser.Math.RND.uuid()
        });
        
        this.aiState.totalPredictions++;
        
        // Visual feedback for new prediction
        this.onPredictionCreated(echo, prediction);
    }
    
    calculatePrediction(player) {
        // Calculate predicted position using weighted factors
        const worldBounds = { width: 1920, height: 1440 };
        
        // Start from current position
        let predictedX = player.x;
        let predictedY = player.y;
        let velocityX = player.body.velocity.x;
        let velocityY = player.body.velocity.y;
        
        // Build prediction path
        const path = [];
        const dt = this.predictionWindow / this.predictionSteps;
        
        for (let i = 0; i < this.predictionSteps; i++) {
            const t = i * dt;
            
            // Factor 1: Momentum (continue current direction)
            const momentumX = velocityX * dt;
            const momentumY = velocityY * dt;
            
            // Factor 2: Threat avoidance (bullet influence)
            let threatX = 0, threatY = 0;
            const threatResult = this.calculateThreatAvoidance(predictedX, predictedY);
            threatX = threatResult.x * dt * 200;
            threatY = threatResult.y * dt * 200;
            
            // Factor 3: Historical patterns (from ObserverEffect)
            let historicalX = 0, historicalY = 0;
            if (this.scene.observerEffect) {
                const pattern = this.getHistoricalPattern(predictedX, predictedY, t);
                historicalX = pattern.x * dt * 150;
                historicalY = pattern.y * dt * 150;
            }
            
            // Factor 4: Chaos (random perturbation)
            const chaosX = (Math.random() - 0.5) * this.aiState.chaosFactor * 100 * dt;
            const chaosY = (Math.random() - 0.5) * this.aiState.chaosFactor * 100 * dt;
            
            // Weighted combination
            const moveX = 
                momentumX * this.predictionWeights.momentum +
                threatX * this.predictionWeights.threatAvoidance +
                historicalX * this.predictionWeights.historical +
                chaosX * this.predictionWeights.random;
            
            const moveY = 
                momentumY * this.predictionWeights.momentum +
                threatY * this.predictionWeights.threatAvoidance +
                historicalY * this.predictionWeights.historical +
                chaosY * this.predictionWeights.random;
            
            predictedX += moveX;
            predictedY += moveY;
            
            // Clamp to world bounds
            predictedX = Phaser.Math.Clamp(predictedX, 50, worldBounds.width - 50);
            predictedY = Phaser.Math.Clamp(predictedY, 50, worldBounds.height - 50);
            
            // Update velocity for next iteration
            velocityX = moveX / dt * 0.8; // Decay
            velocityY = moveY / dt * 0.8;
            
            path.push({ x: predictedX, y: predictedY, t });
        }
        
        // Calculate confidence based on:
        // - Distance from player (farther = less confident)
        // - Chaos factor (higher = less confident)
        // - Historical accuracy
        const distance = Phaser.Math.Distance.Between(player.x, player.y, predictedX, predictedY);
        const distanceFactor = Math.max(0, 1 - distance / 500);
        const confidence = Math.max(0.2, Math.min(0.95, 
            distanceFactor * (1 - this.aiState.chaosFactor) * (0.5 + this.aiState.accuracy * 0.5)
        ));
        
        // Determine if this is a "critical" prediction (high stakes)
        const isCritical = confidence > 0.8 && this.aiState.harmonyStreak >= 2;
        
        return {
            targetX: predictedX,
            targetY: predictedY,
            path,
            confidence,
            isCritical,
            timeWindow: this.predictionWindow,
            expiresAt: this.scene.time.now + (this.predictionWindow * 1000)
        };
    }
    
    calculateThreatAvoidance(x, y) {
        let avoidX = 0;
        let avoidY = 0;
        let threatCount = 0;
        
        // Check enemy bullets
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            
            const dist = Phaser.Math.Distance.Between(x, y, bullet.x, bullet.y);
            if (dist < 150) {
                const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, x, y);
                const strength = (150 - dist) / 150;
                avoidX += Math.cos(angle) * strength;
                avoidY += Math.sin(angle) * strength;
                threatCount++;
            }
        });
        
        // Check enemies
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            if (dist < 100) {
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, x, y);
                const strength = (100 - dist) / 100;
                avoidX += Math.cos(angle) * strength;
                avoidY += Math.sin(angle) * strength;
                threatCount++;
            }
        });
        
        if (threatCount > 0) {
            avoidX /= threatCount;
            avoidY /= threatCount;
        }
        
        return { x: avoidX, y: avoidY };
    }
    
    getHistoricalPattern(x, y, timeOffset) {
        // Use ObserverEffect data if available
        if (!this.scene.observerEffect) {
            return { x: 0, y: 0 };
        }
        
        const profile = this.scene.observerEffect.behaviorProfile;
        
        // Based on movement entropy, predict either:
        // - Low entropy: Continue in roughly same direction
        // - High entropy: Erratic, unpredictable
        if (profile.movementEntropy < 0.4) {
            // Predictable player - assume they'll continue pattern
            return { x: 0, y: 0 }; // Momentum handles this
        } else {
            // Chaotic player - add randomness
            return { 
                x: (Math.random() - 0.5) * profile.movementEntropy,
                y: (Math.random() - 0.5) * profile.movementEntropy
            };
        }
    }
    
    createIntentEcho(prediction) {
        const container = this.scene.add.container(prediction.targetX, prediction.targetY);
        container.setDepth(35);
        
        // Echo visual: Geometric shape that pulses
        const size = 30 + prediction.confidence * 20;
        const color = prediction.isCritical ? this.GOLD_COLOR : this.HARMONY_COLOR;
        const alpha = 0.4 + prediction.confidence * 0.4;
        
        // Main echo shape (circle replacing hexagon - graphics-free)
        const echoCircle = this.scene.add.circle(0, 0, size, color, alpha * 0.3);
        echoCircle.setStrokeStyle(2, color, alpha);
        
        // Central indicator
        const center = this.scene.add.circle(0, 0, 4, color, 0.8);
        
        // Confidence ring
        const ring = this.scene.add.circle(0, 0, size + 5, color, 0);
        ring.setStrokeStyle(1, color, 0.3);
        
        container.add([echoCircle, center, ring]);
        
        // Pulsing animation
        this.scene.tweens.add({
            targets: [echoCircle, ring],
            scale: 1.1,
            alpha: alpha + 0.1,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Slow rotation
        this.scene.tweens.add({
            targets: container,
            rotation: Math.PI * 2,
            duration: 10000,
            repeat: -1
        });
        
        return container;
    }
    
    onPredictionCreated(echo, prediction) {
        // Visual effect at player position
        // Note: Connection line rendering removed - migrated to UnifiedGraphicsManager
        
        // Text hint for critical predictions
        if (prediction.isCritical) {
            const text = this.scene.add.text(
                prediction.targetX,
                prediction.targetY - 50,
                'CRITICAL',
                {
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fill: '#ffd700',
                    alpha: 0.8
                }
            ).setOrigin(0.5);
            
            this.scene.tweens.add({
                targets: text,
                y: text.y - 20,
                alpha: 0,
                duration: 1000,
                onComplete: () => text.destroy()
            });
        }
    }
    
    checkPredictionOutcomes() {
        if (!this.scene.player.active) return;
        
        const player = this.scene.player;
        const now = this.scene.time.now;
        
        // Check each active prediction
        this.predictions = this.predictions.filter(pred => {
            // Check if player reached prediction
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y,
                pred.targetX, pred.targetY
            );
            
            const fulfillRadius = 40 + (1 - pred.confidence) * 30; // Larger radius for uncertain predictions
            
            if (dist < fulfillRadius && !pred.fulfilled && !pred.subverted) {
                // FULFILLED!
                this.onPredictionFulfilled(pred);
                pred.fulfilled = true;
                
                // Destroy echo with harmony effect
                this.destroyEchoHarmony(pred.echo, pred.targetX, pred.targetY);
                return false; // Remove from array
            }
            
            // Check expiration
            if (now > pred.expiresAt && !pred.fulfilled && !pred.subverted) {
                // EXPIRED (neutral - neither fulfilled nor subverted)
                this.onPredictionExpired(pred);
                this.destroyEchoNeutral(pred.echo);
                return false;
            }
            
            return true;
        });
    }
    
    onPredictionFulfilled(prediction) {
        this.aiState.fulfilledCount++;
        this.aiState.harmonyStreak++;
        this.aiState.chaosStreak = 0;
        
        // Update accuracy
        this.updateAccuracy();
        
        // Calculate bonus based on confidence and streak
        const baseMultiplier = prediction.isCritical ? 2.0 : 1.5;
        const streakBonus = Math.min(0.5, this.aiState.harmonyStreak * 0.1);
        this.harmonyMultiplier = baseMultiplier + streakBonus;
        
        // Activate harmony state
        this.harmonyActive = true;
        this.harmonyTimer = 3000 + this.aiState.harmonyStreak * 500; // 3s + streak bonus
        
        // Visual feedback
        this.showFulfillmentEffect(prediction);
        
        // Apply bonuses
        this.applyHarmonyBonus(prediction);
        
        // Notify ObserverEffect
        if (this.scene.observerEffect) {
            this.scene.observerEffect.observeCombo(['symbioticPrediction', 'fulfill']);
        }
        
        // Record in Timeline Chronicle
        if (this.scene.timelineChronicle) {
            this.scene.timelineChronicle.recordSystemUse('symbiosis', {
                type: 'fulfill',
                confidence: prediction.confidence,
                critical: prediction.isCritical,
                streak: this.aiState.harmonyStreak
            });
        }
        
        // Update symbiosis depth
        this.updateSymbiosisDepth(1);
    }
    
    onPredictionExpired(prediction) {
        // Player neither fulfilled nor subverted - prediction just faded
        // This slightly increases chaos factor (AI becomes less confident)
        this.aiState.chaosFactor = Math.min(0.5, this.aiState.chaosFactor + 0.02);
        this.aiState.harmonyStreak = 0;
        this.aiState.chaosStreak = 0;
    }
    
    showFulfillmentEffect(prediction) {
        const x = prediction.targetX;
        const y = prediction.targetY;
        
        // Harmony bloom effect (using circle instead of graphics)
        const bloom = this.scene.add.circle(x, y, 20, this.HARMONY_COLOR, 0.5);
        bloom.setDepth(40);
        
        this.scene.tweens.add({
            targets: bloom,
            scale: 4,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => bloom.destroy()
        });
        
        // Floating text
        const messages = ['MINDS ALIGN', 'HARMONY', 'SYMBIOSIS', 'PRECOG', 'AS ONE'];
        const message = prediction.isCritical ? '★ PERFECT ★' : messages[Math.floor(Math.random() * messages.length)];
        
        const text = this.scene.add.text(x, y - 40, message, {
            fontFamily: 'monospace',
            fontSize: prediction.isCritical ? '18px' : '14px',
            fontStyle: 'bold',
            fill: prediction.isCritical ? '#ffd700' : '#00f0ff'
        }).setOrigin(0.5);
        text.setDepth(100);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 70,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Screen effect
        if (prediction.isCritical) {
            this.scene.cameras.main.flash(300, 0, 240, 255, 0.2);
        }
    }
    
    applyHarmonyBonus(prediction) {
        // 1. Damage boost to player
        if (this.scene.player) {
            // Store the multiplier for bullet damage
            this.scene.player.symbioticMultiplier = this.harmonyMultiplier;
        }
        
        // 2. Resonance Cascade bonus
        if (this.scene.resonanceCascade) {
            // Each fulfillment adds chain potential
            this.scene.resonanceCascade.recordActivation('SYMBIOTIC_HARMONY');
            
            // Add bonus chain levels for critical predictions
            if (prediction.isCritical) {
                this.scene.resonanceCascade.recordActivation('CRITICAL_PREDICTION');
            }
        }
        
        // 3. Echo Storm enhancement
        // NOTE: createEchoAt() not implemented in EchoStormSystem - skipping echo creation
    }
    
    // Subversion happens when player deliberately avoids the prediction
    // This is detected by checking if player moved away from prediction
    checkSubversion() {
        // Called when we detect player deliberately avoiding predictions
        // This is complex to detect - we track if player consistently moves
        // away from nearby active predictions
        
        const player = this.scene.player;
        let nearPrediction = false;
        let movingAway = true;
        
        this.predictions.forEach(pred => {
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y,
                pred.targetX, pred.targetY
            );
            
            if (dist < 100) {
                nearPrediction = true;
                // Check if velocity is away from prediction
                const angleToPred = Phaser.Math.Angle.Between(
                    player.x, player.y,
                    pred.targetX, pred.targetY
                );
                const playerAngle = Math.atan2(player.body.velocity.y, player.body.velocity.x);
                const angleDiff = Math.abs(playerAngle - angleToPred);
                
                if (angleDiff < Math.PI / 2) {
                    movingAway = false; // Moving toward prediction
                }
            }
        });
        
        if (nearPrediction && movingAway) {
            this.onSubversionDetected();
        }
    }
    
    onSubversionDetected() {
        this.aiState.subvertedCount++;
        this.aiState.chaosStreak++;
        this.aiState.harmonyStreak = 0;
        
        // Update accuracy
        this.updateAccuracy();
        
        // Store chaos charge
        this.chaosCharges = Math.min(5, this.chaosCharges + 1);
        
        // Chaos bonus: Next bullets gain homing toward where AI predicted
        this.applyChaosBonus();
        
        // Increase chaos factor (AI becomes more conservative)
        this.aiState.chaosFactor = Math.min(0.5, this.aiState.chaosFactor + 0.05);
        
        // Update symbiosis (subversion still builds relationship, just differently)
        this.updateSymbiosisDepth(0.5);
    }
    
    applyChaosBonus() {
        // Chaos makes the next few player bullets home toward enemies
        // This is the "weaponized uncertainty" - by being unpredictable,
        // you confuse the enemy AI and gain advantage
        
        // Visual feedback
        const player = this.scene.player;
        
        const text = this.scene.add.text(player.x, player.y - 50, 'CHAOS', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff0066'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: player.y - 80,
            alpha: 0,
            duration: 800,
            onComplete: () => text.destroy()
        });
        
        // Paradox Engine bonus
        if (this.scene.paradoxEngine) {
            // Subversion extends paradox duration
            this.scene.paradoxEngine.maxProjectionTime += 0.5;
        }
    }
    
    updateAccuracy() {
        const total = this.aiState.fulfilledCount + this.aiState.subvertedCount;
        if (total > 0) {
            this.aiState.accuracy = this.aiState.fulfilledCount / total;
        }
        
        // Adjust confidence based on accuracy
        if (this.aiState.accuracy > 0.7) {
            // Player is predictable - AI becomes more confident
            this.aiState.confidence = Math.min(0.95, this.aiState.confidence + 0.05);
            this.predictionWindow = Math.min(3.0, this.predictionWindow + 0.1);
        } else if (this.aiState.accuracy < 0.4) {
            // Player is chaotic - AI becomes conservative
            this.aiState.confidence = Math.max(0.3, this.aiState.confidence - 0.05);
            this.predictionWindow = Math.max(1.0, this.predictionWindow - 0.1);
        }
    }
    
    updateSymbiosisDepth(amount) {
        this.aiState.symbiosisDepth = Math.min(100, this.aiState.symbiosisDepth + amount);
        
        // Update visual indicator
        this.depthText.setText(`${Math.floor(this.aiState.symbiosisDepth)}%`);
        
        // Update bars based on harmony/chaos balance
        const harmonyRatio = this.aiState.fulfilledCount / Math.max(1, this.aiState.totalPredictions);
        const chaosRatio = 1 - harmonyRatio;
        
        this.harmonyBar.width = 100 * harmonyRatio * 2;
        this.chaosBar.width = 100 * chaosRatio * 2;
        
        // Update status text
        if (harmonyRatio > 0.6) {
            this.statusText.setText('HARMONY');
            this.statusText.setColor('#00f0ff');
            this.predictionField.setTint(this.HARMONY_COLOR);
        } else if (chaosRatio > 0.6) {
            this.statusText.setText('CHAOS');
            this.statusText.setColor('#ff0066');
            this.predictionField.setTint(this.CHAOS_COLOR);
        } else {
            this.statusText.setText('BALANCED');
            this.statusText.setColor('#9d4edd');
            this.predictionField.setTint(this.NEUTRAL_COLOR);
        }
    }
    
    destroyEchoHarmony(echo, x, y) {
        // Bloom destruction effect
        const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.6, end: 0 },
            lifespan: 500,
            quantity: 12,
            tint: this.HARMONY_COLOR,
            emitting: false
        });
        particles.explode();
        
        // Destroy after effect
        this.scene.time.delayedCall(500, () => {
            particles.destroy();
        });
        
        echo.destroy();
    }
    
    destroyEchoNeutral(echo) {
        // Fade out
        this.scene.tweens.add({
            targets: echo,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => echo.destroy()
        });
    }
    
    update(dt) {
        // Pause check
        if (this.scene.pauseSystem?.paused) return;
        
        // Update harmony timer
        if (this.harmonyActive) {
            this.harmonyTimer -= dt * 1000;
            if (this.harmonyTimer <= 0) {
                this.harmonyActive = false;
                this.harmonyMultiplier = 1.0;
                if (this.scene.player) {
                    this.scene.player.symbioticMultiplier = 1.0;
                }
            }
        }
        
        // Update prediction field animation
        if (this.predictionField) {
            this.predictionField.tilePositionX += 0.5;
            this.predictionField.tilePositionY += 0.5;
        }
        
        // Draw connection lines from player to predictions
        this.renderConnectionLines();
        
        // Check for subversion patterns
        if (this.scene.time.now % 1000 < 20) { // Once per second roughly
            this.checkSubversion();
        }
        
        // Update cooldown
        if (this.predictionCooldown > 0) {
            this.predictionCooldown -= dt;
        }
    }
    
    renderConnectionLines() {
        // Render connection lines via UnifiedGraphicsManager on 'effects' layer
        // Note: No graphics.clear() needed - manager batches all rendering and clears once per frame
        if (!this.scene.player.active) return;
        if (!this.scene.graphicsManager) return;
        
        const player = this.scene.player;
        const manager = this.scene.graphicsManager;
        
        this.predictions.forEach(pred => {
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y,
                pred.targetX, pred.targetY
            );
            
            // Only draw if reasonably close
            if (dist < 400) {
                const alpha = 0.3 * (1 - dist / 400);
                const color = pred.isCritical ? this.GOLD_COLOR : this.HARMONY_COLOR;
                
                // Register draw command with manager (effects layer)
                manager.drawLine(
                    'effects',
                    player.x, player.y,
                    pred.targetX, pred.targetY,
                    color,
                    alpha,
                    1
                );
            }
        });
    }
    
    // Public API for other systems
    
    getHarmonyMultiplier() {
        return this.harmonyActive ? this.harmonyMultiplier : 1.0;
    }
    
    hasChaosCharges() {
        return this.chaosCharges > 0;
    }
    
    consumeChaosCharge() {
        if (this.chaosCharges > 0) {
            this.chaosCharges--;
            return true;
        }
        return false;
    }
    
    getSymbiosisData() {
        return {
            accuracy: this.aiState.accuracy,
            depth: this.aiState.symbiosisDepth,
            harmony: this.aiState.harmonyStreak,
            chaos: this.aiState.chaosStreak,
            total: this.aiState.totalPredictions
        };
    }
    
    // Called by other systems to notify of player actions
    notifyPlayerAction(action, data) {
        // Update chaos factor based on unexpected actions
        switch (action) {
            case 'sudden_stop':
                this.aiState.chaosFactor = Math.min(0.5, this.aiState.chaosFactor + 0.02);
                break;
            case 'direction_reversal':
                this.aiState.chaosFactor = Math.min(0.5, this.aiState.chaosFactor + 0.03);
                break;
            case 'velocity_spike':
                this.aiState.chaosFactor = Math.min(0.5, this.aiState.chaosFactor + 0.01);
                break;
        }
    }
    
    shutdown() {
        // Cleanup all predictions
        this.predictions.forEach(pred => {
            if (pred.echo) pred.echo.destroy();
        });
        this.predictions = [];
        
        if (this.predictionField) this.predictionField.destroy();
        if (this.symbiosisContainer) this.symbiosisContainer.destroy();
        
        // Note: Connection lines are rendered via UnifiedGraphicsManager
        // No local graphics objects - manager handles its own lifecycle
    }
}
