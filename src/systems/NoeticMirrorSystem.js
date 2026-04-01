import Phaser from 'phaser';

/**
 * Noetic Mirror System — The Self-Aware Commentary Engine
 * 
 * The 34th cognitive dimension: META-AWARENESS
 * 
 * While the Observer Effect watches and the Symbiotic Engine predicts,
 * the Noetic Mirror *understands* — and speaks. It analyzes not just
 * your actions, but your cognitive patterns: risk tolerance, decision
 * speed, attention allocation, learning curves, and strategic evolution.
 * 
 * It then generates real-time philosophical commentary that responds to
 * your unique cognitive signature, creating a dialogic relationship
 * where the game becomes a mirror for your own mind.
 * 
 * Key Innovation: The game doesn't just react to input — it develops
 * a "theory of mind" about the player and expresses that understanding
 * through procedurally generated insights that can be eerily perceptive.
 * 
 * Color: Mirror Silver (#c0c0c0) — reflection and clarity
 */

export default class NoeticMirrorSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Mirror Silver — the color of reflection
        this.MIRROR_COLOR = 0xc0c0c0;
        this.MIRROR_GLOW = 0xe8e8e8;
        this.TEXT_COLOR = '#c0c0c0';
        
        // Cognitive tracking
        this.cognitiveProfile = {
            // Decision patterns
            reactionTime: [],           // Time between threat and response
            decisionConsistency: [],   // Do you stick to strategies?
            hesitationMoments: 0,       // Times player froze/paused
            
            // Risk psychology
            riskTolerance: 0.5,         // 0 = cautious, 1 = reckless
            riskVariance: [],          // How consistent is risk-taking?
            nearMissPreference: 0,      // Do you intentionally graze?
            
            // Attention patterns
            spatialAwareness: [],       // How often check surroundings vs focus
            targetFixation: 0,        // Time spent locked on one target
            environmentalScanRate: 0,  // How frequently scan arena
            
            // Learning & adaptation
            patternRecognition: 0,      // Speed of learning enemy patterns
            adaptationSpeed: [],      // Time to adjust to new threats
            errorRecovery: [],         // How fast recover from mistakes
            
            // Strategic evolution
            strategyShifts: [],        // When and why change approaches
            systemPreferences: {},     // Which systems you favor
            comboCreativity: 0,        // Novel combinations discovered
            
            // Temporal cognition
            planningHorizon: 0,        // How far ahead do you plan?
            temporalBias: 'present',   // 'past', 'present', 'future' focused
            patienceIndex: 0.5,       // Delayed gratification capacity
            
            // Emotional patterns (inferred from behavior)
            stressResponse: 'unknown', // 'freeze', 'fight', 'flight', 'flow'
            frustrationThreshold: 0,   // Errors before play degrades
            confidenceTrajectory: [], // Rising, falling, oscillating?
        };
        
        // Session history for analysis
        this.decisionLog = [];       // Timestamped decision contexts
        this.insightArchive = [];    // Insights already shown (avoid repeat)
        this.playerMonologue = [];   // Player's "inner voice" reconstruction
        
        // Real-time state
        this.lastThreatTime = 0;
        this.lastDecisionTime = 0;
        this.currentStressLevel = 0;
        this.isInFlow = false;
        
        // Commentary system
        this.pendingCommentary = [];
        this.commentaryCooldown = 0;
        this.minCommentaryInterval = 8000; // Minimum ms between insights
        
        // Visual elements
        this.mirrorOverlay = null;
        this.reflectionText = null;
        this.insightPanel = null;
        
        // System configuration
        this.enabled = true;
        this.insightDepth = 1; // Increases as system learns player
        
        this.init();
    }
    
    init() {
        this.createVisualElements();
        this.startCognitiveTracking();
    }
    
    createVisualElements() {
        // Mirror overlay — subtle silver sheen at screen edges
        const graphics = this.scene.add.graphics();
        graphics.setScrollFactor(0);
        graphics.setDepth(90);
        
        // Create vignette effect
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        
        // Gradient from edges
        for (let i = 0; i < 50; i++) {
            const alpha = (i / 50) * 0.03;
            graphics.lineStyle(1, this.MIRROR_COLOR, alpha);
            graphics.strokeRect(i * 4, i * 3, width - i * 8, height - i * 6);
        }
        
        this.mirrorOverlay = graphics;
        
        // Reflection text — positioned at bottom center
        this.reflectionText = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height - 100,
            '',
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                letterSpacing: 1,
                fill: this.TEXT_COLOR,
                align: 'center',
                alpha: 0
            }
        ).setOrigin(0.5);
        this.reflectionText.setScrollFactor(0);
        this.reflectionText.setDepth(95);
        
        // Insight panel (appears for deep insights)
        this.insightPanel = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        );
        this.insightPanel.setScrollFactor(0);
        this.insightPanel.setDepth(100);
        this.insightPanel.setVisible(false);
        
        // Panel background
        const panelBg = this.scene.add.rectangle(0, 0, 500, 200, 0x0a0a0f, 0.95);
        panelBg.setStrokeStyle(2, this.MIRROR_COLOR, 0.5);
        this.insightPanel.add(panelBg);
        
        // Panel title
        const title = this.scene.add.text(0, -70, '◈ NOETIC MIRROR ◈', {
            fontFamily: 'monospace',
            fontSize: '16px',
            letterSpacing: 2,
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.insightPanel.add(title);
        
        // Insight content
        this.insightContent = this.scene.add.text(0, 0, '', {
            fontFamily: 'monospace',
            fontSize: '13px',
            letterSpacing: 1,
            fill: this.TEXT_COLOR,
            align: 'center',
            wordWrap: { width: 450 }
        }).setOrigin(0.5);
        this.insightPanel.add(this.insightContent);
        
        // Dismiss hint
        const hint = this.scene.add.text(0, 75, '[CONTINUE]', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 1,
            fill: '#666666'
        }).setOrigin(0.5);
        this.insightPanel.add(hint);
        
        // Pulsing animation for hint
        this.scene.tweens.add({
            targets: hint,
            alpha: { from: 0.3, to: 0.8 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }
    
    startCognitiveTracking() {
        // Record baseline
        this.cognitiveProfile.baselineEstablished = this.scene.time.now;
        
        // Start periodic analysis
        this.analysisTimer = this.scene.time.addEvent({
            delay: 5000,
            callback: () => this.performCognitiveAnalysis(),
            callbackScope: this,
            loop: true
        });
    }
    
    // Called every frame to track cognitive state
    update(dt, player) {
        if (!this.enabled) return;
        
        // Update commentary cooldown
        if (this.commentaryCooldown > 0) {
            this.commentaryCooldown -= dt * 1000;
        }
        
        // Track spatial awareness
        this.updateSpatialTracking(player);
        
        // Detect stress patterns
        this.updateStressDetection(player);
        
        // Track decision moments
        this.updateDecisionTracking(player);
        
        // Check for commentary opportunities
        this.updateCommentary();
        
        // Update visual effects
        this.updateVisuals(dt);
    }
    
    updateSpatialTracking(player) {
        // Analyze where player is looking/moving
        const velocity = player.body?.velocity;
        if (!velocity) return;
        
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
        
        // Track movement patterns
        this.cognitiveProfile.spatialAwareness.push({
            timestamp: this.scene.time.now,
            speed: speed,
            position: { x: player.x, y: player.y },
            nearWalls: this.isNearWalls(player),
            nearEnemies: this.getNearestEnemyDistance(player),
            nearBullets: this.getNearestBulletDistance(player)
        });
        
        // Keep only last 30 seconds
        const cutoff = this.scene.time.now - 30000;
        this.cognitiveProfile.spatialAwareness = 
            this.cognitiveProfile.spatialAwareness.filter(s => s.timestamp > cutoff);
    }
    
    updateStressDetection(player) {
        // Stress indicators:
        // - Rapid erratic movement
        // - Low health
        // - Many nearby threats
        // - Error recovery (took damage recently)
        
        let stressScore = 0;
        
        // Health stress
        const healthPercent = player.health / player.maxHealth;
        if (healthPercent < 0.3) stressScore += 0.4;
        else if (healthPercent < 0.5) stressScore += 0.2;
        
        // Threat proximity stress
        const nearestBullet = this.getNearestBulletDistance(player);
        if (nearestBullet < 50) stressScore += 0.3;
        else if (nearestBullet < 100) stressScore += 0.15;
        
        // Enemy count stress
        const enemyCount = this.scene.enemies.countActive();
        if (enemyCount > 8) stressScore += 0.2;
        
        // Movement erraticism
        if (this.cognitiveProfile.spatialAwareness.length > 5) {
            const recent = this.cognitiveProfile.spatialAwareness.slice(-5);
            const speedVariance = this.calculateVariance(recent.map(s => s.speed));
            if (speedVariance > 10000) stressScore += 0.15; // Erratic movement
        }
        
        this.currentStressLevel = Phaser.Math.Linear(this.currentStressLevel, stressScore, 0.1);
        
        // Detect flow state (moderate challenge, high skill)
        const isChallenged = stressScore > 0.3 && stressScore < 0.7;
        const isPerformingWell = this.getRecentPerformance() > 0.7;
        this.isInFlow = isChallenged && isPerformingWell;
        
        // Update stress response type
        if (this.currentStressLevel > 0.6) {
            // Determine response type
            const velocity = player.body?.velocity;
            if (velocity) {
                const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
                if (speed < 50) {
                    this.cognitiveProfile.stressResponse = 'freeze';
                } else if (speed > 400) {
                    this.cognitiveProfile.stressResponse = 'flight';
                } else {
                    this.cognitiveProfile.stressResponse = 'fight';
                }
            }
        } else if (this.isInFlow) {
            this.cognitiveProfile.stressResponse = 'flow';
        }
    }
    
    updateDecisionTracking(player) {
        // Decision moments occur when:
        // - Player changes direction significantly
        // - Player activates a system
        // - Player fires after a pause
        // - Player dodges a bullet
        
        const now = this.scene.time.now;
        
        // Track reaction to threats
        if (this.lastThreatTime > 0 && now - this.lastThreatTime < 500) {
            // Just reacted to something
            const reactionTime = now - this.lastThreatTime;
            this.cognitiveProfile.reactionTime.push(reactionTime);
            
            // Keep last 20 reactions
            if (this.cognitiveProfile.reactionTime.length > 20) {
                this.cognitiveProfile.reactionTime.shift();
            }
        }
        
        // Reset threat timer
        this.lastThreatTime = 0;
    }
    
    // Called when bullet passes nearby (near-miss detection)
    onThreatEncountered(type, severity) {
        this.lastThreatTime = this.scene.time.now;
        
        // Analyze risk tolerance
        if (type === 'nearMiss') {
            this.cognitiveProfile.nearMissPreference++;
            
            // Was it intentional? (check if player moved toward bullet)
            if (severity < 40) { // Very close
                this.cognitiveProfile.riskTolerance = Phaser.Math.Linear(
                    this.cognitiveProfile.riskTolerance, 1, 0.05
                );
            }
        }
    }
    
    // Called when player takes damage
    onPlayerDamaged(amount, source) {
        // Record error
        this.cognitiveProfile.errorRecovery.push({
            timestamp: this.scene.time.now,
            healthAfter: this.scene.player.health,
            source: source
        });
        
        // Frustration tracking
        const recentErrors = this.cognitiveProfile.errorRecovery.filter(
            e => e.timestamp > this.scene.time.now - 30000
        );
        
        if (recentErrors.length > 3) {
            // May be entering frustration
            this.queueCommentary('frustration');
        }
        
        // Recovery speed tracking
        this.cognitiveProfile.lastDamageTime = this.scene.time.now;
    }
    
    // Called when player kills enemy
    onEnemyKilled(enemy, method) {
        // Track system preferences
        if (!this.cognitiveProfile.systemPreferences[method]) {
            this.cognitiveProfile.systemPreferences[method] = 0;
        }
        this.cognitiveProfile.systemPreferences[method]++;
        
        // Check for adaptive learning
        if (method === 'headshot' || method === 'paradox') {
            this.queueCommentary('mastery');
        }
    }
    
    // Called when systems are combined
    onSystemCombo(systems) {
        this.cognitiveProfile.comboCreativity++;
        
        // Track strategic evolution
        this.cognitiveProfile.strategyShifts.push({
            timestamp: this.scene.time.now,
            systems: systems,
            context: this.getCurrentContext()
        });
        
        // Novel combination?
        const comboKey = systems.sort().join('+');
        if (!this.cognitiveProfile.knownCombos) {
            this.cognitiveProfile.knownCombos = new Set();
        }
        
        if (!this.cognitiveProfile.knownCombos.has(comboKey)) {
            this.cognitiveProfile.knownCombos.add(comboKey);
            this.queueCommentary('discovery');
        }
    }
    
    performCognitiveAnalysis() {
        // Deep analysis every 5 seconds
        const profile = this.cognitiveProfile;
        
        // Calculate derived metrics
        if (profile.reactionTime.length > 5) {
            const avgReaction = profile.reactionTime.reduce((a, b) => a + b, 0) 
                / profile.reactionTime.length;
            profile.reactionSpeed = avgReaction < 200 ? 'fast' : 
                                    avgReaction < 400 ? 'moderate' : 'deliberate';
        }
        
        // Risk analysis
        if (profile.nearMissPreference > 10) {
            profile.riskProfile = profile.riskTolerance > 0.7 ? 'aggressive' :
                                  profile.riskTolerance > 0.4 ? 'balanced' : 'cautious';
        }
        
        // Temporal focus
        const recentSystems = profile.strategyShifts.slice(-5);
        const futureSystems = recentSystems.filter(s => 
            s.systems.includes('paradox') || s.systems.includes('oracle')
        ).length;
        const pastSystems = recentSystems.filter(s => 
            s.systems.includes('residue') || s.systems.includes('chronoLoop')
        ).length;
        
        if (futureSystems > pastSystems) profile.temporalBias = 'future';
        else if (pastSystems > futureSystems) profile.temporalBias = 'past';
        else profile.temporalBias = 'present';
        
        // Confidence trajectory
        const recentPerformance = this.getRecentPerformance();
        profile.confidenceTrajectory.push({
            timestamp: this.scene.time.now,
            score: recentPerformance
        });
        
        // Generate insights based on analysis
        this.generateInsights();
    }
    
    generateInsights() {
        const profile = this.cognitiveProfile;
        
        // Only generate if we have enough data
        if (profile.reactionTime.length < 5) return;
        
        // Check for meaningful patterns
        const patterns = this.identifyPatterns();
        
        for (const pattern of patterns) {
            if (!this.insightArchive.includes(pattern.id)) {
                const insight = this.craftInsight(pattern);
                if (insight) {
                    this.pendingCommentary.push({
                        type: 'insight',
                        content: insight,
                        priority: pattern.priority,
                        id: pattern.id
                    });
                    this.insightArchive.push(pattern.id);
                }
            }
        }
    }
    
    identifyPatterns() {
        const patterns = [];
        const profile = this.cognitiveProfile;
        
        // Pattern 1: Risk tolerance revelation
        if (profile.nearMissPreference > 15 && !this.insightArchive.includes('risk_revealed')) {
            patterns.push({
                id: 'risk_revealed',
                type: 'risk',
                priority: 8,
                data: { tolerance: profile.riskTolerance }
            });
        }
        
        // Pattern 2: Flow state detected
        if (this.isInFlow && !this.insightArchive.includes('flow_detected')) {
            patterns.push({
                id: 'flow_detected',
                type: 'flow',
                priority: 10
            });
        }
        
        // Pattern 3: Stress response identified
        if (profile.stressResponse !== 'unknown' && 
            !this.insightArchive.includes(`stress_${profile.stressResponse}`)) {
            patterns.push({
                id: `stress_${profile.stressResponse}`,
                type: 'stress',
                priority: 7,
                data: { response: profile.stressResponse }
            });
        }
        
        // Pattern 4: Temporal bias revealed
        if (profile.temporalBias && !this.insightArchive.includes(`temporal_${profile.temporalBias}`)) {
            patterns.push({
                id: `temporal_${profile.temporalBias}`,
                type: 'temporal',
                priority: 6,
                data: { bias: profile.temporalBias }
            });
        }
        
        // Pattern 5: Learning curve
        if (profile.comboCreativity > 3 && !this.insightArchive.includes('learning')) {
            patterns.push({
                id: 'learning',
                type: 'growth',
                priority: 9
            });
        }
        
        // Pattern 6: System preference
        const prefs = Object.entries(profile.systemPreferences || {})
            .sort((a, b) => b[1] - a[1]);
        if (prefs.length > 0 && prefs[0][1] > 5 && 
            !this.insightArchive.includes(`preference_${prefs[0][0]}`)) {
            patterns.push({
                id: `preference_${prefs[0][0]}`,
                type: 'preference',
                priority: 5,
                data: { system: prefs[0][0], count: prefs[0][1] }
            });
        }
        
        // Pattern 7: Paradox behavior (contradictory patterns)
        if (profile.riskTolerance > 0.7 && profile.stressResponse === 'freeze' &&
            !this.insightArchive.includes('paradox_risk_freeze')) {
            patterns.push({
                id: 'paradox_risk_freeze',
                type: 'paradox',
                priority: 10
            });
        }
        
        return patterns.sort((a, b) => b.priority - a.priority);
    }
    
    craftInsight(pattern) {
        const insights = {
            risk_revealed: () => {
                const tolerance = pattern.data.tolerance;
                if (tolerance > 0.8) {
                    return "You dance on the edge of oblivion not because you must,\nbut because you choose to. The void calls, and you answer.";
                } else if (tolerance > 0.6) {
                    return "You have learned that safety is an illusion,\nand embrace the beautiful risk of being alive.";
                } else {
                    return "You move with measured caution, finding poetry\nin precision rather than chaos.";
                }
            },
            
            flow_detected: () => {
                return "Time has forgotten you. Thought and action merge—\nyou are not playing the game; the game plays through you.\nThis is the moment artists chase and fighters dream of.";
            },
            
            stress_fight: () => "When threatened, you do not retreat—you transform\npressure into purpose, danger into determination.",
            stress_flight: () => "Your instinct under fire is graceful evasion,\nfinding safety in movement, salvation in speed.",
            stress_freeze: () => "In moments of overwhelm, you pause, recalibrate,\nfind stillness within the storm—a different courage.",
            stress_flow: () => "Even under extreme pressure, you maintain\na crystalline clarity—this is the mark of mastery.",
            
            temporal_future: () => "You live forward in time, always anticipating,\nweaving tomorrow's safety into today's choices.",
            temporal_past: () => "You carry your history with you, letting\nwhere you've been inform where you go.",
            temporal_present: () => "You exist in the eternal now—neither haunted\nby memory nor distracted by possibility.",
            
            learning: () => "I watch you learn. Each mistake becomes wisdom,\neach success becomes instinct. You are becoming." ,
            
            paradox_risk_freeze: () => "How curious—you seek danger yet freeze when\nit arrives. There is a story here you are telling yourself.\nWhat are you really risking, and what are you protecting?"
        };
        
        const generator = insights[pattern.id];
        return generator ? generator() : null;
    }
    
    queueCommentary(type) {
        const commentaries = {
            frustration: [
                "The gap between what you want and what is\nfrustrates even the patient. Breathe. Adapt.",
                "You are learning faster than your results show.\nTrust the process that lives beneath the score.",
                "Every master has felt this moment.\nThe question is not if you fall, but how you rise."
            ],
            
            mastery: [
                "That was... unexpected. You are exceeding\nthe pattern I predicted. Continue to surprise me.",
                "Precision born of practice, or instinct\nborn of some deeper knowing? Either way: remarkable.",
                "You have crossed a threshold. The game\nis different now—you have made it so."
            ],
            
            discovery: [
                "A new combination. I see you experimenting,\nplaying not just to survive but to understand.",
                "Systems reveal themselves to those who\nask questions with their actions. You ask well.",
                "Discovery is the hunger that never\nsatisfies but always fulfills. You have the appetite."
            ]
        };
        
        const pool = commentaries[type];
        if (pool) {
            const content = pool[Math.floor(Math.random() * pool.length)];
            this.pendingCommentary.push({
                type: 'moment',
                content: content,
                priority: 5
            });
        }
    }
    
    updateCommentary() {
        // Show next commentary if cooldown expired and queue not empty
        if (this.commentaryCooldown <= 0 && this.pendingCommentary.length > 0) {
            // Sort by priority
            this.pendingCommentary.sort((a, b) => b.priority - a.priority);
            
            const next = this.pendingCommentary.shift();
            this.showCommentary(next);
            
            this.commentaryCooldown = this.minCommentaryInterval;
        }
    }
    
    showCommentary(commentary) {
        if (commentary.type === 'insight' && commentary.priority >= 8) {
            // Deep insight - show in panel
            this.showInsightPanel(commentary.content);
        } else {
            // Regular commentary - show as floating text
            this.showFloatingCommentary(commentary.content);
        }
    }
    
    showInsightPanel(content) {
        this.insightContent.setText(content);
        this.insightPanel.setVisible(true);
        this.insightPanel.setAlpha(0);
        this.insightPanel.setScale(0.9);
        
        // Animate in
        this.scene.tweens.add({
            targets: this.insightPanel,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Power2'
        });
        
        // Pulse overlay
        this.scene.tweens.add({
            targets: this.mirrorOverlay,
            alpha: { from: 0.3, to: 0.6 },
            duration: 200,
            yoyo: true,
            repeat: 2
        });
        
        // Auto-dismiss after 6 seconds
        this.scene.time.delayedCall(6000, () => {
            this.scene.tweens.add({
                targets: this.insightPanel,
                alpha: 0,
                scale: 0.9,
                duration: 300,
                onComplete: () => this.insightPanel.setVisible(false)
            });
        });
    }
    
    showFloatingCommentary(content) {
        this.reflectionText.setText(content);
        this.reflectionText.setAlpha(0);
        this.reflectionText.setY(this.scene.scale.height - 100);
        
        // Fade in
        this.scene.tweens.add({
            targets: this.reflectionText,
            alpha: 1,
            duration: 800,
            ease: 'Power2'
        });
        
        // Hold then fade out
        this.scene.time.delayedCall(4000, () => {
            this.scene.tweens.add({
                targets: this.reflectionText,
                alpha: 0,
                y: this.reflectionText.y - 20,
                duration: 800,
                ease: 'Power2'
            });
        });
    }
    
    updateVisuals(dt) {
        // Subtle mirror pulse when in flow
        if (this.isInFlow) {
            this.mirrorOverlay.alpha = 0.2 + Math.sin(this.scene.time.now / 500) * 0.1;
        } else {
            this.mirrorOverlay.alpha = Phaser.Math.Linear(
                this.mirrorOverlay.alpha, 0.05, 0.02
            );
        }
    }
    
    // Utility methods
    isNearWalls(player) {
        const margin = 100;
        return player.x < margin || player.x > 1920 - margin ||
               player.y < margin || player.y > 1440 - margin;
    }
    
    getNearestEnemyDistance(player) {
        let nearest = Infinity;
        this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(
                    player.x, player.y, enemy.x, enemy.y
                );
                nearest = Math.min(nearest, dist);
            }
        });
        return nearest;
    }
    
    getNearestBulletDistance(player) {
        let nearest = Infinity;
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.active) {
                const dist = Phaser.Math.Distance.Between(
                    player.x, player.y, bullet.x, bullet.y
                );
                nearest = Math.min(nearest, dist);
            }
        });
        return nearest;
    }
    
    getRecentPerformance() {
        // Calculate performance over last 30 seconds
        const now = this.scene.time.now;
        const kills = this.scene.score / 100; // Approximate
        const survival = this.scene.player.health / this.scene.player.maxHealth;
        
        return (kills * 0.3 + survival * 0.7);
    }
    
    calculateVariance(values) {
        if (values.length < 2) return 0;
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(v => (v - mean) ** 2);
        return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    }
    
    getCurrentContext() {
        return {
            wave: this.scene.wave,
            health: this.scene.player.health,
            enemyCount: this.scene.enemies.countActive(),
            stressLevel: this.currentStressLevel,
            isInFlow: this.isInFlow
        };
    }
    
    // Integration method for Resonance Cascade
    getCognitiveState() {
        return {
            riskTolerance: this.cognitiveProfile.riskTolerance,
            stressResponse: this.cognitiveProfile.stressResponse,
            temporalBias: this.cognitiveProfile.temporalBias,
            isInFlow: this.isInFlow,
            insightCount: this.insightArchive.length
        };
    }
    
    // Integration with Ambient Awareness System
    onTimeStateChange(timeState) {
        // Generate time-appropriate commentary
        const timeCommentary = {
            dawn: [
                "The world awakens, and so do you",
                "Fresh eyes see patterns others miss",
                "In the quiet hours, mastery begins"
            ],
            day: [
                "Full light, full alertness",
                "The arena is clear, your mind is sharp"
            ],
            dusk: [
                "Shadows lengthen, patterns shift",
                "The waning light favors the patient"
            ],
            night: [
                "Darkness reveals what daylight hides",
                "The night is intimate, dangerous, beautiful"
            ],
            witching: [
                "Reality frays at the edges",
                "In the witching hour, dreams and death intertwine",
                "You dance on the boundary of waking"
            ]
        };
        
        const comments = timeCommentary[timeState] || timeCommentary.day;
        const insight = comments[Math.floor(Math.random() * comments.length)];
        
        // Only show if enough time has passed
        if (this.commentaryCooldown <= 0) {
            this.showFloatingCommentary(insight);
            this.commentaryCooldown = this.minCommentaryInterval;
        }
    }
    
    onDreamStateEnter() {
        this.showFloatingCommentary("The game dreams without you...");
    }
    
    onDreamStateExit(duration) {
        const minutes = Math.floor(duration / 60000);
        if (minutes > 0) {
            this.showFloatingCommentary(`You return from ${minutes} minutes of shared dreaming`);
        } else {
            this.showFloatingCommentary("You return before the dream deepened");
        }
    }
    
    destroy() {
        if (this.analysisTimer) {
            this.analysisTimer.remove();
        }
        
        if (this.mirrorOverlay) this.mirrorOverlay.destroy();
        if (this.reflectionText) this.reflectionText.destroy();
        if (this.insightPanel) this.insightPanel.destroy();
    }
}
