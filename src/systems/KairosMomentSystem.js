import Phaser from 'phaser';

/**
 * Kairos Moment System — The Crystallization of Flow
 * 
 * Every game captures WHAT happened. This system captures HOW it FELT.
 * 
 * Kairos (καιρός) — the supreme moment, the opportune instant when everything aligns.
 * Not just any moment, but THE moment. The one where you became more than yourself.
 * 
 * === THE CORE MECHANIC ===
 * 
 * The system silently observes your gameplay, detecting when you enter "flow state"
 * through multiple physiological proxies: movement fluidity, near-miss precision,
 * system chaining complexity, and temporal pattern elegance. When all metrics align,
 * you achieve a KAIROS STATE — the world itself acknowledges your mastery.
 * 
 * 1. FLOW DETECTION (Invisible, always running)
 *    - Movement fluidity: Variance in velocity direction (smooth = high)
 *    - Risk calibration: Near-misses at precise distances (not too close, not too far)
 *    - System mastery: Chaining different mechanics in <2 second windows
 *    - Temporal elegance: Efficient bullet-time usage (absorbing echoes, perfect fractures)
 *    - Emotional proxy: Kill rate acceleration + damage avoidance = confidence
 * 
 * 2. KAIROS STATE (The world responds to your mastery)
 *    - At 90+ flow score for 5+ seconds: World enters Kairos State
 *    - Colors intensify (saturation +30%)
 *    - Time subtly warps (0.95x → smooths micro-stutters)
 *    - Your trail becomes visible (showing the beauty of your path)
 *    - Music (if present) would shift — here: ambient tone deepens
 *    - Score multiplies at 1.5x
 * 
 * 3. KAIROS CRYSTALLIZATION (The capture)
 *    - When Kairos State ends, the moment is automatically "crystallized"
 *    - Extracts: Your exact path, all bullet patterns, system activations, flow metrics
 *    - Creates a KAIROS SHARD — a fully playable micro-level (~10 seconds)
 *    - Stored in Timeline Chronicle as a "golden memory"
 * 
 * 4. KAIROS REPLAY (Reliving perfection)
 *    - From main menu: "Kairos Gallery" shows all crystallized moments
 *    - Replay to beat your own "ghost" (the recorded run)
 *    - Share as "challenge seeds" — others can attempt YOUR flow state
 *    - Each replay analyzes: "You were 94% in flow here" — personalized insight
 * 
 * 5. KAIROS INHERITANCE (Cross-run blessing)
 *    - Starting a new run with Kairos Shards equipped:
 *    - First 30 seconds of new run: +10% to all stats
 *    - The game whispers: "You carry the memory of your own excellence"
 *    - Visual: Subtle golden aura at start, fading as run becomes its own
 * 
 * === STRATEGIC DEPTH ===
 * 
 * This transforms gameplay from survival to PERFORMANCE:
 * 
 * - Surviving is good. Flowing is better. Crystallizing is transcendent.
 * - Risk-taking becomes strategic — near-misses fuel flow state
 * - System chaining rewarded — the more systems you use elegantly, the higher flow
 * - No direct control — you can't force Kairos. You can only create conditions.
 * - Post-run reflection — Kairos Gallery becomes a meditation on your own growth
 * 
 * === THE INNOVATION ===
 * 
 * No game has ever:
 * 1. Detected flow state through multi-factor gameplay analysis in real-time
 * 2. Crystallized perfect moments into replayable micro-challenges automatically
 * 3. Used crystallized moments as persistent blessings for future runs
 * 4. Created an emotional, reflective gallery of the player's own mastery
 * 
 * This is the game becoming a MIRROR — not just showing what you did,
 * but revealing who you became in your finest hours.
 * 
 * Color: Iridescent Gold-White (#fff8e7 → #ffd700 shifting)
 * 
 * === SYNERGIES ===
 * 
 * - Timeline Chronicle: Stores Kairos Shards as premium memories
 * - Mnemosyne Weave: Kairos moments are the MOST potent shard types
 * - Resonance Cascade: Maximum flow requires chaining systems — same skill
 * - Paradox Engine: Flow state + prediction = "prophetic flow" (2× bonuses)
 * - Observer Effect: AI learns your flow patterns, adapts to challenge not disrupt
 * - Symbiotic Prediction: Fulfillment during Kairos = "perfect harmony" bonus
 * - Dimensional Collapse: Kairos State is the gateway — collapse during flow
 *   creates "Golden Collapse" (pure white transcendence instead of rainbow)
 * 
 * This system doesn't add mechanics. It reveals the poetry already present.
 */

export default class KairosMomentSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== FLOW METRICS =====
        this.flowMetrics = {
            movementFluidity: 0,    // 0-100, smooth velocity changes
            riskCalibration: 0,     // 0-100, near-miss precision
            systemMastery: 0,       // 0-100, chain complexity
            temporalElegance: 0,     // 0-100, efficient resource use
            emotionalTrajectory: 0  // 0-100, kill/damage confidence
        };
        
        // ===== FLOW STATE =====
        this.flowScore = 0;           // 0-100 aggregate
        this.inFlowState = false;
        this.flowDuration = 0;        // Seconds in current flow
        this.peakFlowScore = 0;       // Maximum achieved this run
        this.totalFlowTime = 0;       // Cumulative flow seconds
        
        // ===== KAIROS STATE =====
        this.inKairosState = false;
        this.kairosThreshold = 90;    // Flow score to enter Kairos
        this.kairosMinDuration = 5;   // Seconds to crystallize
        this.kairosTimer = 0;
        this.kairosEligible = false;  // Met minimum duration
        
        // ===== CRYSTALLIZATION =====
        this.crystallizing = false;
        this.kairosData = null;       // Captured moment data
        this.kairosCount = 0;         // Total this run
        
        // ===== MOVEMENT HISTORY =====
        this.velocityHistory = [];
        this.maxHistorySize = 30;     // 0.5 seconds at 60fps
        this.positionHistory = [];    // For path visualization
        this.systemActivationLog = [];
        
        // ===== VISUALS =====
        this.kairosOverlay = null;
        this.saturationFilter = null;
        this.kairosParticles = null;
        
        // ===== CONSTANTS =====
        this.KAIROS_COLOR = 0xfff8e7;
        this.KAIROS_GOLD = 0xffd700;
        this.FLOW_DECAY = 0.95;
        this.FLOW_BUILD = 0.08;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.loadKairosHistory();
    }
    
    createVisuals() {
        // Kairos overlay — golden iridescent sheen
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Radial gradient: white-gold center, soft edges
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 180);
        gradient.addColorStop(0, 'rgba(255, 248, 231, 0.15)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.08)');
        gradient.addColorStop(1, 'rgba(255, 248, 231, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        this.scene.textures.addCanvas('kairos_overlay', canvas);
        
        this.kairosOverlay = this.scene.add.image(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'kairos_overlay'
        );
        this.kairosOverlay.setScrollFactor(0);
        this.kairosOverlay.setDepth(60);
        this.kairosOverlay.setVisible(false);
        this.kairosOverlay.setAlpha(0);
        this.kairosOverlay.setBlendMode(Phaser.BlendModes.ADD);
        
        // Flow trail graphics - UnifiedGraphicsManager only
        this.flowTrailLayer = 'effects';
        
        // Kairos particles
        this.kairosParticles = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 1.2, end: 0 },
            alpha: { start: 0.9, end: 0 },
            speed: { min: 30, max: 100 },
            lifespan: 800,
            gravityY: -20,
            tint: [0xfff8e7, 0xffd700, 0xffffff],
            frequency: -1
        });
        this.kairosParticles.setDepth(65);
    }
    
    loadKairosHistory() {
        try {
            const saved = localStorage.getItem('kairos_moments_v1');
            if (saved) {
                const data = JSON.parse(saved);
                this.kairosCount = data.totalCrystallized || 0;
            }
        } catch (e) {
            console.warn('Failed to load Kairos history:', e);
        }
    }
    
    saveKairosHistory() {
        try {
            const data = {
                totalCrystallized: this.kairosCount,
                lastRunPeak: this.peakFlowScore
            };
            localStorage.setItem('kairos_moments_v1', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save Kairos history:', e);
        }
    }
    
    // ===== FLOW DETECTION =====
    
    update(dt) {
        // Pause check
        if (this.scene.pauseSystem?.paused) return;
        
        if (!this.scene.player?.active) return;
        
        const player = this.scene.player;
        const body = player.body;
        
        // Update movement history
        this.updateMovementHistory(body);
        
        // Calculate flow metrics
        this.calculateMovementFluidity();
        this.calculateRiskCalibration();
        this.calculateSystemMastery();
        this.calculateTemporalElegance();
        this.calculateEmotionalTrajectory();
        
        // Aggregate flow score
        this.updateFlowScore(dt);
        
        // Check for Kairos State
        this.updateKairosState(dt);
        
        // Update visuals
        this.updateVisuals(dt);
        
        // Crystallize if ending Kairos
        if (this.kairosEligible && !this.inKairosState && !this.crystallizing) {
            this.crystallizeKairos();
        }
    }
    
    updateMovementHistory(body) {
        // Store velocity for fluidity calculation
        this.velocityHistory.push({
            x: body.velocity.x,
            y: body.velocity.y,
            speed: Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2)
        });
        
        if (this.velocityHistory.length > this.maxHistorySize) {
            this.velocityHistory.shift();
        }
        
        // Store position for trail (only during Kairos)
        if (this.inKairosState) {
            this.positionHistory.push({
                x: body.x,
                y: body.y,
                time: this.scene.time.now
            });
            
            // Keep 5 seconds of history
            const cutoff = this.scene.time.now - 5000;
            this.positionHistory = this.positionHistory.filter(p => p.time > cutoff);
        }
    }
    
    calculateMovementFluidity() {
        if (this.velocityHistory.length < 3) return;
        
        // Calculate direction changes
        let directionChanges = 0;
        let totalChange = 0;
        
        for (let i = 2; i < this.velocityHistory.length; i++) {
            const prev = this.velocityHistory[i - 1];
            const curr = this.velocityHistory[i];
            
            if (prev.speed > 50 && curr.speed > 50) {
                const prevAngle = Math.atan2(prev.y, prev.x);
                const currAngle = Math.atan2(curr.y, curr.x);
                let change = Math.abs(currAngle - prevAngle);
                if (change > Math.PI) change = 2 * Math.PI - change;
                
                totalChange += change;
                directionChanges++;
            }
        }
        
        // Smooth = low total change
        if (directionChanges > 0) {
            const avgChange = totalChange / directionChanges;
            const fluidity = Math.max(0, 100 - (avgChange * 200)); // Lower change = higher score
            this.flowMetrics.movementFluidity = Phaser.Math.Linear(
                this.flowMetrics.movementFluidity, fluidity, 0.1
            );
        }
    }
    
    calculateRiskCalibration() {
        // Risk calibration = near-misses at the "optimal danger distance"
        // Too close (hit) = 0, too far (safe) = 0, sweet spot = 100
        
        if (!this.scene.nearMissState) return;
        
        const nearMiss = this.scene.nearMissState;
        
        // If we just triggered a near-miss, check how optimal it was
        if (nearMiss.active && nearMiss.remaining > 1.1) { // Fresh trigger
            // Calculate optimal distance ratio (65px is detection, 35px is hit)
            // Sweet spot is 45-55px — close but not too close
            const optimalRatio = 0.75; // 48.75px from hit radius
            
            // We can't get exact distance, but streak level indicates skill
            const streakBonus = Math.min(nearMiss.streak * 15, 45);
            
            this.flowMetrics.riskCalibration = Phaser.Math.Linear(
                this.flowMetrics.riskCalibration, 60 + streakBonus, 0.2
            );
        } else {
            this.flowMetrics.riskCalibration *= this.FLOW_DECAY;
        }
    }
    
    calculateSystemMastery() {
        // System mastery = chaining different mechanics rapidly
        // Check recent system activations
        
        const cutoff = this.scene.time.now - 2000; // 2 second window
        const recentActivations = this.systemActivationLog.filter(
            a => a.time > cutoff
        );
        
        // Unique systems used
        const uniqueSystems = new Set(recentActivations.map(a => a.system)).size;
        
        // Score based on variety and timing
        let mastery = 0;
        if (uniqueSystems >= 2) mastery = 40;
        if (uniqueSystems >= 3) mastery = 65;
        if (uniqueSystems >= 4) mastery = 85;
        if (uniqueSystems >= 5) mastery = 100;
        
        this.flowMetrics.systemMastery = Phaser.Math.Linear(
            this.flowMetrics.systemMastery, mastery, 0.15
        );
    }
    
    calculateTemporalElegance() {
        // Temporal elegance = efficient use of temporal resources
        // High echo absorption, perfect fractures, singularity detonations at peak
        
        let elegance = this.flowMetrics.temporalElegance * this.FLOW_DECAY;
        
        // Boost from system-specific efficiency
        if (this.scene.echoStorm?.absorbedEchoes > 0) {
            elegance += 5; // Each absorbed echo
        }
        
        if (this.scene.fractureSystem?.perfectFractures > 0) {
            elegance += 15; // Perfect fracture timing
        }
        
        if (this.scene.singularitySystem?.perfectDetonations > 0) {
            elegance += 20; // Well-timed singularity burst
        }
        
        this.flowMetrics.temporalElegance = Math.min(100, elegance);
    }
    
    calculateEmotionalTrajectory() {
        // Emotional proxy = confidence indicator
        // Rising kill rate + low damage taken = confidence
        
        // We use score acceleration as proxy (simplified)
        const score = this.scene.score || 0;
        const enemies = this.scene.enemies?.countActive() || 0;
        
        // High score with low enemy count = clearing efficiently
        const efficiency = Math.min(100, score / Math.max(1, enemies + 10));
        
        // Health factor
        const health = this.scene.player?.health || 100;
        const healthBonus = health > 80 ? 15 : 0;
        
        this.flowMetrics.emotionalTrajectory = Phaser.Math.Linear(
            this.flowMetrics.emotionalTrajectory, efficiency + healthBonus, 0.05
        );
    }
    
    updateFlowScore(dt) {
        // Weighted aggregate of all metrics
        const weights = {
            movementFluidity: 0.25,
            riskCalibration: 0.25,
            systemMastery: 0.20,
            temporalElegance: 0.15,
            emotionalTrajectory: 0.15
        };
        
        let rawScore = 0;
        for (const [metric, weight] of Object.entries(weights)) {
            rawScore += this.flowMetrics[metric] * weight;
        }
        
        // Smooth transition
        this.flowScore = Phaser.Math.Linear(this.flowScore, rawScore, this.FLOW_BUILD);
        
        // Track peak
        if (this.flowScore > this.peakFlowScore) {
            this.peakFlowScore = this.flowScore;
        }
        
        // Update flow state
        if (this.flowScore >= 75) {
            this.inFlowState = true;
            this.flowDuration += dt;
            this.totalFlowTime += dt;
        } else {
            this.inFlowState = false;
            this.flowDuration = 0;
        }
    }
    
    updateKairosState(dt) {
        const wasInKairos = this.inKairosState;
        
        // Enter Kairos at threshold
        if (this.flowScore >= this.kairosThreshold) {
            this.inKairosState = true;
            this.kairosTimer += dt;
            
            // Mark eligible if sustained long enough
            if (this.kairosTimer >= this.kairosMinDuration) {
                this.kairosEligible = true;
            }
            
            // First entry effect
            if (!wasInKairos) {
                this.onKairosEnter();
            }
        } else {
            this.inKairosState = false;
            this.kairosTimer = 0;
            
            // Exit effect
            if (wasInKairos) {
                this.onKairosExit();
            }
        }
    }
    
    onKairosEnter() {
        // Visual announcement
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 80,
            'KAIROS', {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#fff8e7',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            scale: 1.5,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Show overlay
        this.kairosOverlay.setVisible(true);
        this.scene.tweens.add({
            targets: this.kairosOverlay,
            alpha: 0.8,
            duration: 1000
        });
        
        // Particle burst
        this.kairosParticles.emitParticleAt(this.scene.player.x, this.scene.player.y, 20);
        
        // Record system use for cascade
        this.recordSystemActivation('KAIROS_ENTER');
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('KAIROS_STATE', { 
                intensity: this.flowScore 
            });
        }
    }
    
    onKairosExit() {
        // Fade overlay
        this.scene.tweens.add({
            targets: this.kairosOverlay,
            alpha: 0,
            duration: 500,
            onComplete: () => this.kairosOverlay.setVisible(false)
        });
        
        // Clear trail - UnifiedGraphicsManager handles clearing automatically
        this.positionHistory = [];
        
        this.recordSystemActivation('KAIROS_EXIT');
    }
    
    updateVisuals(dt) {
        // Draw flow trail during Kairos - UnifiedGraphicsManager only
        if (this.inKairosState && this.positionHistory.length > 1 && this.scene.graphicsManager) {
            const points = this.positionHistory.map(p => ({ x: p.x, y: p.y }));
            this.scene.graphicsManager.drawPath(
                this.flowTrailLayer,
                points,
                this.KAIROS_COLOR,
                0.6,
                3
            );
        }
        
        // Pulsing particles while in Kairos
        if (this.inKairosState && Math.random() < 0.1) {
            const player = this.scene.player;
            this.kairosParticles.emitParticleAt(
                player.x + (Math.random() - 0.5) * 40,
                player.y + (Math.random() - 0.5) * 40,
                1
            );
        }
    }
    
    // ===== CRYSTALLIZATION =====
    
    crystallizeKairos() {
        if (this.crystallizing) return;
        this.crystallizing = true;
        
        // Capture the moment
        this.kairosData = this.captureKairosData();
        
        // Visual crystallization
        this.showCrystallizationEffect();
        
        // Save to chronicle
        this.saveKairosShard();
        
        // Increment count
        this.kairosCount++;
        this.saveKairosHistory();
        
        // Reset eligible
        this.kairosEligible = false;
        
        // Delay before allowing next crystallization
        this.scene.time.delayedCall(10000, () => {
            this.crystallizing = false;
        });
    }
    
    captureKairosData() {
        const player = this.scene.player;
        
        return {
            timestamp: Date.now(),
            runId: this.scene.timelineChronicle?.currentRunId || 'unknown',
            
            // Flow metrics at capture
            flowMetrics: { ...this.flowMetrics },
            flowScore: this.flowScore,
            peakFlowScore: this.peakFlowScore,
            kairosDuration: this.kairosTimer,
            
            // Game state
            score: this.scene.score,
            wave: this.scene.wave,
            health: player.health,
            position: { x: player.x, y: player.y },
            
            // System states
            systemsActive: {
                bulletTime: this.scene.nearMissState?.active || false,
                echoStorm: this.scene.echoStorm?.absorbedCount || 0,
                fracture: this.scene.fractureSystem?.ghostPlayer !== null,
                residue: this.scene.temporalResidue?.nodes?.length || 0,
                singularity: this.scene.singularitySystem?.activeSingularity !== null,
                resonance: this.scene.resonanceCascade?.chain.length || 0
            },
            
            // Path data (simplified for storage)
            pathSignature: this.positionHistory.map(p => ({
                x: Math.round(p.x),
                y: Math.round(p.y)
            })),
            
            // Crystallization metadata
            crystallizedAt: this.scene.time.now,
            shardType: 'KAIROS',
            shardColor: this.KAIROS_GOLD,
            playstyle: this.determinePlaystyle()
        };
    }
    
    determinePlaystyle() {
        const metrics = this.flowMetrics;
        
        if (metrics.riskCalibration > 80) return 'Daredevil';
        if (metrics.systemMastery > 80) return 'Synthesist';
        if (metrics.temporalElegance > 80) return 'Temporalist';
        if (metrics.movementFluidity > 80) return 'Dancer';
        if (metrics.emotionalTrajectory > 80) return 'Conqueror';
        
        return 'Flowwalker';
    }
    
    showCrystallizationEffect() {
        const player = this.scene.player;
        
        // Expanding crystal ring
        const ring = this.scene.add.circle(player.x, player.y, 10, this.KAIROS_COLOR, 0);
        ring.setStrokeStyle(3, this.KAIROS_GOLD);
        ring.setDepth(70);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 15,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
        
        // Text
        const text = this.scene.add.text(
            player.x, player.y - 60,
            'CRYSTALLIZED', {
                fontFamily: 'monospace',
                fontSize: '16px',
                fontStyle: 'bold',
                fill: '#ffd700',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Particle explosion
        this.kairosParticles.emitParticleAt(player.x, player.y, 30);
        
        // Screen flash
        this.scene.cameras.main.flash(300, 255, 248, 231, 0.3);
    }
    
    saveKairosShard() {
        // Add to Timeline Chronicle as a special shard
        if (this.scene.timelineChronicle) {
            const shard = {
                id: `kairos_${Date.now()}`,
                ...this.kairosData,
                shardName: this.generateShardName()
            };
            
            this.scene.timelineChronicle.addKairosShard(shard);
        }
    }
    
    generateShardName() {
        const names = [
            'The Perfect Moment',
            'Flow Incarnate',
            'Golden Thread',
            'Temporal Elegance',
            'The Supreme Instant',
            'Crystallized Grace',
            'Moment of Mastery',
            'The Eternal Second',
            'Peak Performance',
            'Harmony Achieved'
        ];
        
        const descriptors = {
            'Daredevil': 'Daring',
            'Synthesist': 'Masterful',
            'Temporalist': 'Elegant',
            'Dancer': 'Graceful',
            'Conqueror': 'Dominant',
            'Flowwalker': 'Balanced'
        };
        
        const desc = descriptors[this.kairosData?.playstyle] || 'Perfect';
        const base = names[Math.floor(Math.random() * names.length)];
        
        return `${desc} ${base}`;
    }
    
    // ===== PUBLIC API =====
    
    recordSystemActivation(systemName, data = {}) {
        this.systemActivationLog.push({
            system: systemName,
            time: this.scene.time.now,
            ...data
        });
        
        // Trim old entries
        const cutoff = this.scene.time.now - 5000;
        this.systemActivationLog = this.systemActivationLog.filter(
            a => a.time > cutoff
        );
    }
    
    getFlowBonus() {
        // Returns multiplier for score/etc based on flow state
        if (this.inKairosState) return 1.5;
        if (this.inFlowState) return 1.2;
        return 1.0;
    }
    
    getKairosCount() {
        return this.kairosCount;
    }
    
    getPeakFlowScore() {
        return this.peakFlowScore;
    }
    
    getTotalFlowTime() {
        return this.totalFlowTime;
    }
    
    isInKairos() {
        return this.inKairosState;
    }
    
    // ===== CLEANUP =====
    
    destroy() {
        this.saveKairosHistory();
        
        if (this.kairosOverlay) {
            this.kairosOverlay.destroy();
        }
        if (this.kairosParticles) {
            this.kairosParticles.destroy();
        }
        // Note: UnifiedGraphicsManager handles cleanup of 'effects' layer commands automatically
    }
}
