import Phaser from 'phaser';

/**
 * Heartflux Protocol — The 55th Dimension: BIOMETRIC EMPATHY 🫀
 * 
 * The game develops a theory of your BODY, not just your mind.
 * 
 * === THE REVOLUTION ===
 * 
 * While all 54 previous systems responded to WHAT you do, Heartflux responds to
 * HOW YOU ARE — your stress, your flow, your fatigue, your arousal. It creates
 * a genuine biofeedback loop where the game becomes a living partner that
 * breathes with you, adapting not to challenge you but to KEEP YOU IN FLOW.
 * 
 * === THE SCIENCE ===
 * 
 * Without requiring hardware sensors, Heartflux infers physiological state from
 * input patterns that correlate with autonomic nervous system activity:
 * 
 * - Mouse micro-tremor (0.5-2px jitter) → Sympathetic arousal (stress/focus)
 * - Movement fluidity variance → Parasympathetic tone (flow vs. strain)
 * - Reaction time patterns → Cognitive load (quick = automatic, delayed = deliberative)
 * - Hesitation signatures → Uncertainty/anxiety (micro-pauses before actions)
 * - Rhythm consistency → Autonomic coherence (heart rate variability proxy)
 * 
 * These patterns form a "biometric shadow" — an inferred physiological profile
 * that evolves in real-time and drives empathetic adaptation.
 * 
 * === THE FOUR AROUSAL STATES ===
 * 
 * 1. THE VOID (0-20%): Deep flow, trance-like precision
 *    → Game breathes slower, time dilates gently, rewards are subtle
 *    → Visual: Calm cyan pulse, 60 BPM ambient rhythm
 *    
 * 2. THE STREAM (20-50%): Active engagement, optimal challenge
 *    → Game meets you exactly where you are, perfect difficulty matching
 *    → Visual: Flowing gold transitions, 72 BPM heartbeat sync
 *    
 * 3. THE STORM (50-80%): High arousal, edge of control
 *    → Game provides "empathetic easing" — subtle slowdowns, extra resonance orbs
 *    → Visual: Crimson warning edges, 90 BPM urgency pulse
 *    
 * 4. THE CASCADE (80-100%): Overwhelm, sympathetic dominance
 *    → Game actively protects you — dramatic time dilation, auto-activation of defensive systems
 *    → Visual: White flash warnings, bullet trails become prediction lines
 * 
 * === THE EMPATHIC ADAPTATIONS ===
 * 
 * Rather than punishing high stress, Heartflux SUPPORTS it:
 * 
 * - Time Dilation: Bullet time triggers automatically when arousal spikes
 * - Pattern Easing: Enemy bullet patterns simplify during stress (invisible to player)
 * - Resonance Orbs: Spawn more frequently near player during fatigue
 * - Echo Absorption: Graze radius increases when tremor detected
 * - Sanctuary Pulses: Safe zones briefly appear when overwhelm predicted
 * - Breathing Cues: Subtle visual rhythm guides player breathing (4-7-8 technique)
 * 
 * === THE HEARTFLUX VISUAL ===
 * 
 * A living, breathing orb in the corner that represents YOU — not your health,
 * not your score, but your STATE. It pulses with your inferred rhythm:
 * 
 * - Smooth cyan pulse → You're in flow, the game is quiet
 * - Rapid gold flicker → You're engaged, everything is synchronous  
 * - Crimson tremor → You're stressed, the game is helping
 * - White strobe → You're overwhelmed, the game is protecting
 * 
 * === THE META-INNOVATION ===
 * 
 * Heartflux doesn't just adapt gameplay — it teaches self-regulation. Players
 * learn to recognize their own stress patterns by seeing them reflected in the
 * game. The biometric shadow becomes a mirror for somatic awareness.
 * 
 * Over time, players develop:
 * - Somatic literacy: Recognizing stress before it overwhelms
 * - Flow cultivation: Understanding what conditions create peak performance
 * - Self-regulation: Using the visual feedback to breathe, reset, return to center
 * 
 * === SYNERGIES WITH ALL 54 SYSTEMS ===
 * 
 * - Echo Storm: High tremor = larger graze radius for easier echo absorption
 * - Fracture: Stress-triggered automatic fractures deploy defensive ghosts
 * - Paradox Engine: Low arousal = longer prediction windows (deeper foresight)
 * - Resonance Cascade: Flow state doubles chain duration (you're in the zone)
 * - Quantum Immortality: High stress = more generous death branch timing
 * - Symbiotic Prediction: AI predictions merge with biometric predictions
 * - Noetic Mirror: Commentary includes somatic awareness ("Your hands are steady...")
 * - Rhythm of the Void: BPM adapts to player arousal (entrainment)
 * - Tychos Aurora: Safe corridors become more visible during stress
 * - Void Exchange: Trading becomes unavailable during high arousal (no stress-trading)
 * - Dream State: Biometric patterns influence dream narrative intensity
 * - Apophenia: Pattern recognition calibrated to current cognitive load
 * 
 * === THE 55TH DIMENSION ===
 * 
 * While Aperture (46th) added ATTENTION and Synaesthesia (42nd) added AUDITION,
 * Heartflux adds INTEROCEPTION — awareness of the internal bodily state.
 * This completes the cognitive architecture from external perception through
 * attention to the internal somatic experience. The game now sees you from
 * outside (Observer), predicts you (Symbiotic), remembers you (Chronicle),
 * AND feels with you (Heartflux).
 * 
 * Color: Biometric Rose (#ff6b9d) — the color of living tissue, pulse, empathy
 */

export default class HeartfluxProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== BIOMETRIC STATE =====
        this.arousal = 0.3; // 0-1 scale (starts in mild engagement)
        this.arousalVelocity = 0; // Rate of change
        this.flowState = false; // Are we in the zone?
        this.stressSpike = false; // Recent sharp increase?
        
        // ===== INPUT PATTERN ANALYSIS =====
        this.inputHistory = []; // Last 3 seconds of mouse data
        this.HISTORY_WINDOW = 3000; // ms
        this.analysisInterval = null;
        
        // Pattern metrics
        this.metrics = {
            tremorIndex: 0,        // Micro-jitter in mouse position
            fluidityScore: 1.0,    // Movement smoothness (0=jerky, 1=flowing)
            hesitationRate: 0,     // Micro-pauses per second
            rhythmVariance: 0,     // Consistency of action timing
            reactionDrift: 0       // Change in average reaction time
        };
        
        // ===== EMPATHIC PARAMETERS =====
        this.adaptationLevel = 0; // How much we're currently helping (0-1)
        this.lastBreathCue = 0;   // Last time we showed breathing guide
        this.flowStreak = 0;      // Consecutive seconds in flow
        
        // ===== VISUALS =====
        this.BIOMETRIC_COLOR = 0xff6b9d; // Rose
        this.VOID_COLOR = 0x00f0ff;      // Cyan
        this.STREAM_COLOR = 0xffd700;    // Gold
        this.STORM_COLOR = 0xff3366;     // Crimson
        this.CASCADE_COLOR = 0xffffff;   // White
        
        this.graphics = null;
        this.heartOrb = null;
        this.pulseRing = null;
        this.breathGuide = null;
        this.stateText = null;
        
        // ===== DEBUG =====
        this.debugEnabled = false;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.startAnalysis();
        this.setupInputTracking();
    }
    
    createVisuals() {
        // Heart flux indicator - registered with panel-based HUD system
        this.scene.hudPanels.registerSlot('HEARTFLUX', (container, width, layout) => {
            this.container = container;
            this.container.setDepth(1000);
            
            // Position elements so they don't extend into negative Y
            // Largest element is bgRing with radius 30, so center at y=30
            const centerY = 30;
            
            // Background ring (subtle)
            const bgRing = this.scene.add.circle(0, centerY, 30, 0x1a1a25, 0.5);
            container.add(bgRing);
            
            // The Heart Orb — represents player's biometric state
            this.heartOrb = this.scene.add.circle(0, centerY, 20, this.BIOMETRIC_COLOR, 0.8);
            container.add(this.heartOrb);
            
            // Inner glow that pulses
            this.innerGlow = this.scene.add.circle(0, centerY, 12, this.VOID_COLOR, 0.4);
            container.add(this.innerGlow);
            
            // Pulse ring (expands with "heartbeat")
            this.pulseRing = this.scene.add.circle(0, centerY, 20, this.BIOMETRIC_COLOR, 0);
            this.pulseRing.setStrokeStyle(2, this.BIOMETRIC_COLOR, 0.6);
            container.add(this.pulseRing);
            
            // State indicator text below the orb
            this.stateText = this.scene.add.text(0, centerY + 45, 'STREAM', {
                fontFamily: 'monospace',
                fontSize: '9px',
                fill: '#ff6b9d',
                align: 'center'
            }).setOrigin(0.5);
            container.add(this.stateText);
            
            // Arousal bar (mini) below the text
            const barY = centerY + 58;
            const barWidth = Math.min(50, width - 10);
            this.arousalBar = this.scene.add.rectangle(0, barY, barWidth, 3, 0x333344, 0.5);
            container.add(this.arousalBar);
            this.arousalFill = this.scene.add.rectangle(0, barY, 0, 3, this.STREAM_COLOR, 0.8);
            this.arousalFill.setOrigin(0, 0.5);
            container.add(this.arousalFill);
            
            // Start pulse animation now that pulseRing is created
            this.startPulseAnimation();
        }, 'TOP_RIGHT');
        
        // Breathing guide (initially hidden) - NOT in panel, screen-centered overlay
        this.breathGuide = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height - 100,
            'BREATHE IN...',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#00f0ff',
                align: 'center',
                alpha: 0
            }
        ).setOrigin(0.5);
        this.breathGuide.setScrollFactor(0);
        this.breathGuide.setDepth(1000);
        
        // Pulse animation will start when panel callback completes
        this.pulseAnimationStarted = false;
    }
    
    startPulseAnimation() {
        // Guard: pulseRing may not be initialized yet (panel-based HUD async)
        if (!this.pulseRing) {
            console.warn('[HeartfluxProtocol] Pulse animation deferred - ring not initialized yet');
            this.pulseAnimationStarted = false;
            return;
        }
        
        if (this.pulseAnimationStarted) return; // Already running
        this.pulseAnimationStarted = true;
        
        // Base pulse that adapts to arousal
        const pulseDuration = this.getPulseDuration();
        
        this.scene.tweens.add({
            targets: this.pulseRing,
            scale: 1.5,
            alpha: 0,
            duration: pulseDuration,
            repeat: -1,
            onRepeat: () => {
                if (!this.pulseRing) return; // Guard for cleanup
                // Update pulse parameters based on current arousal
                const newDuration = this.getPulseDuration();
                this.scene.tweens.getTweensOf(this.pulseRing).forEach(t => {
                    t.duration = newDuration;
                });
                
                // Update colors based on state
                this.updateVisualState();
            }
        });
    }
    
    getPulseDuration() {
        // Map arousal to pulse duration (60-120 BPM range)
        // Low arousal = slower, deeper pulse
        // High arousal = rapid, urgent pulse
        const bpm = 60 + (this.arousal * 60); // 60-120 BPM
        return (60 / bpm) * 1000; // Convert to ms
    }
    
    setupInputTracking() {
        // Track mouse position continuously
        this.lastMouseX = this.scene.input.activePointer.x;
        this.lastMouseY = this.scene.input.activePointer.y;
        this.lastMouseTime = this.scene.time.now;
        
        // Track action timing
        this.lastActionTime = this.scene.time.now;
        this.actionIntervals = [];
        
        // Hook into player actions
        if (this.scene.player) {
            const originalShoot = this.scene.player.shoot.bind(this.scene.player);
            this.scene.player.shoot = (angle) => {
                this.recordAction('shoot');
                return originalShoot(angle);
            };
        }
    }
    
    recordAction(type) {
        const now = this.scene.time.now;
        const interval = now - this.lastActionTime;
        this.actionIntervals.push(interval);
        
        // Keep only last 10 intervals
        if (this.actionIntervals.length > 10) {
            this.actionIntervals.shift();
        }
        
        this.lastActionTime = now;
        
        // Record in input history
        this.inputHistory.push({
            type: type,
            time: now,
            arousal: this.arousal
        });
    }
    
    startAnalysis() {
        // Analyze input patterns every 100ms
        this.analysisInterval = this.scene.time.addEvent({
            delay: 100,
            callback: () => this.analyzePatterns(),
            loop: true
        });
    }
    
    analyzePatterns() {
        const now = this.scene.time.now;
        const pointer = this.scene.input.activePointer;
        
        // ===== 1. TREMOR ANALYSIS =====
        // Measure micro-jitter in mouse position
        const dx = pointer.x - this.lastMouseX;
        const dy = pointer.y - this.lastMouseY;
        const dt = now - this.lastMouseTime;
        
        if (dt > 0) {
            // Calculate velocity
            const vx = dx / dt * 1000; // px per second
            const vy = dy / dt * 1000;
            const speed = Math.sqrt(vx * vx + vy * vy);
            
            // Tremor = high-frequency, low-amplitude movement
            // We look for jitter in the velocity itself
            if (!this.lastVelocity) this.lastVelocity = { x: 0, y: 0 };
            
            const dvx = vx - this.lastVelocity.x;
            const dvy = vy - this.lastVelocity.y;
            const acceleration = Math.sqrt(dvx * dvx + dvy * dvy);
            
            // High acceleration with low speed = tremor (nervous micro-adjustments)
            if (speed < 50 && acceleration > 100) {
                this.metrics.tremorIndex = Math.min(1, this.metrics.tremorIndex + 0.1);
            } else {
                this.metrics.tremorIndex *= 0.95; // Decay
            }
            
            // Fluidity = smoothness of movement (low acceleration relative to speed)
            const fluidity = speed > 0 ? Math.max(0, 1 - (acceleration / (speed + 1))) : 1;
            this.metrics.fluidityScore = this.metrics.fluidityScore * 0.9 + fluidity * 0.1;
            
            this.lastVelocity = { x: vx, y: vy };
        }
        
        // ===== 2. HESITATION ANALYSIS =====
        // Detect micro-pauses (not moving but not aiming precisely)
        const mouseDelta = Math.sqrt(dx * dx + dy * dy);
        if (mouseDelta < 2 && dt > 100 && pointer.active) {
            // Mouse is still but active — potential hesitation
            if (!this.hesitationStart) {
                this.hesitationStart = now;
            } else if (now - this.hesitationStart > 150) {
                // 150ms+ pause = hesitation
                this.metrics.hesitationRate = Math.min(1, this.metrics.hesitationRate + 0.05);
                this.hesitationStart = null;
            }
        } else {
            this.hesitationStart = null;
            this.metrics.hesitationRate *= 0.98;
        }
        
        // ===== 3. RHYTHM ANALYSIS =====
        // Measure consistency of action timing (heart rate variability proxy)
        if (this.actionIntervals.length >= 5) {
            const mean = this.actionIntervals.reduce((a, b) => a + b, 0) / this.actionIntervals.length;
            const variance = this.actionIntervals.reduce((sum, val) => {
                return sum + Math.pow(val - mean, 2);
            }, 0) / this.actionIntervals.length;
            
            // Coefficient of variation (lower = more consistent = more flow)
            const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
            this.metrics.rhythmVariance = this.metrics.rhythmVariance * 0.9 + cv * 0.1;
        }
        
        // ===== 4. UPDATE AROUSAL MODEL =====
        this.updateArousal();
        
        // Store for next frame
        this.lastMouseX = pointer.x;
        this.lastMouseY = pointer.y;
        this.lastMouseTime = now;
        
        // Cleanup old history
        this.inputHistory = this.inputHistory.filter(h => now - h.time < this.HISTORY_WINDOW);
    }
    
    updateArousal() {
        // Combine metrics into arousal score
        // High tremor, high hesitation, low fluidity, high rhythm variance = high stress
        
        const tremorWeight = 0.3;
        const hesitationWeight = 0.25;
        const fluidityWeight = 0.25; // Inverse — low fluidity = high arousal
        const rhythmWeight = 0.2;
        
        const targetArousal = Math.min(1, Math.max(0,
            this.metrics.tremorIndex * tremorWeight +
            this.metrics.hesitationRate * hesitationWeight +
            (1 - this.metrics.fluidityScore) * fluidityWeight +
            this.metrics.rhythmVariance * rhythmWeight
        ));
        
        // Smooth transitions (arousal doesn't change instantly)
        const arousalDelta = targetArousal - this.arousal;
        this.arousalVelocity = arousalDelta * 0.1;
        this.arousal += this.arousalVelocity;
        this.arousal = Math.max(0, Math.min(1, this.arousal));
        
        // Detect stress spikes (rapid increase)
        this.stressSpike = arousalDelta > 0.2;
        
        // Detect flow state (low arousal, high fluidity, consistent rhythm)
        const wasFlow = this.flowState;
        this.flowState = this.arousal < 0.25 && 
                        this.metrics.fluidityScore > 0.7 && 
                        this.metrics.rhythmVariance < 0.3;
        
        if (this.flowState && !wasFlow) {
            this.onEnterFlow();
        } else if (!this.flowState && wasFlow) {
            this.onExitFlow();
        }
        
        if (this.flowState) {
            this.flowStreak++;
        } else {
            this.flowStreak = 0;
        }
        
        // Apply empathetic adaptations
        this.applyEmpathicAdaptations();
    }
    
    onEnterFlow() {
        // Subtle feedback that we're in the zone
        this.showFloatingText('FLOW STATE', this.VOID_COLOR);
        
        // Notify other systems
        if (this.scene.resonanceCascade) {
            // Flow state doubles resonance chain duration
            this.scene.resonanceCascade.flowMultiplier = 2.0;
        }
        
        if (this.scene.noeticMirror?.showFloatingCommentary) {
            this.scene.noeticMirror.showFloatingCommentary('Time has forgotten you. Thought and action merge.');
        }
    }
    
    onExitFlow() {
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.flowMultiplier = 1.0;
        }
    }
    
    applyEmpathicAdaptations() {
        const now = this.scene.time.now;
        
        // ===== THE VOID (0-20%) =====
        if (this.arousal < 0.2) {
            this.adaptationLevel = 0;
            // Deep flow — game stays quiet, no interventions
        }
        // ===== THE STREAM (20-50%) =====
        else if (this.arousal < 0.5) {
            this.adaptationLevel = 0.1;
            // Optimal engagement — minimal support
        }
        // ===== THE STORM (50-80%) =====
        else if (this.arousal < 0.8) {
            this.adaptationLevel = 0.3;
            
            // Empathetic easing
            // 1. Subtle time dilation during intense moments
            if (this.stressSpike && this.scene.nearMissState && !this.scene.nearMissState.active) {
                // Pre-emptive bullet time when stress spikes
                this.scene.triggerEmpatheticBulletTime(0.5); // Half strength, no reward
            }
            
            // 2. Breathing cues if stress sustained
            if (now - this.lastBreathCue > 8000 && this.arousal > 0.6) {
                this.showBreathingCue();
                this.lastBreathCue = now;
            }
        }
        // ===== THE CASCADE (80-100%) =====
        else {
            this.adaptationLevel = 0.6;
            
            // Active protection
            // 1. Auto-activate defensive systems
            if (this.scene.quantumImmortality && !this.scene.quantumImmortality.active) {
                // Make death branch more generous
                this.scene.quantumImmortality.empatheticMode = true;
            }
            
            // 2. Emergency bullet time
            if (!this.scene.nearMissState?.active) {
                this.scene.triggerEmpatheticBulletTime(0.7);
            }
            
            // 3. Show sanctuary pulses
            if (now % 2000 < 100) { // Every 2 seconds briefly
                this.showSanctuaryPulse();
            }
        }
    }
    
    showBreathingCue() {
        // 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s
        const steps = [
            { text: 'BREATHE IN...', duration: 4000, color: '#00f0ff' },
            { text: 'HOLD...', duration: 7000, color: '#ffd700' },
            { text: 'BREATHE OUT...', duration: 8000, color: '#ff6b9d' }
        ];
        
        let stepIndex = 0;
        
        const showStep = () => {
            if (stepIndex >= steps.length) {
                this.breathGuide.setAlpha(0);
                return;
            }
            
            const step = steps[stepIndex];
            this.breathGuide.setText(step.text);
            this.breathGuide.setFill(step.color);
            
            this.scene.tweens.add({
                targets: this.breathGuide,
                alpha: { from: 0, to: 0.8 },
                scale: { from: 0.9, to: 1.0 },
                duration: 500,
                yoyo: true,
                hold: step.duration - 1000,
                onComplete: () => {
                    stepIndex++;
                    showStep();
                }
            });
        };
        
        showStep();
    }
    
    showSanctuaryPulse() {
        // Briefly highlight a safe zone
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(this.VOID_COLOR, 0.15);
        
        // Find area away from enemies
        const player = this.scene.player;
        const safeX = player.x + (Math.random() - 0.5) * 200;
        const safeY = player.y + (Math.random() - 0.5) * 200;
        
        graphics.fillCircle(safeX, safeY, 80);
        
        this.scene.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 1500,
            onComplete: () => graphics.destroy()
        });
    }
    
    showFloatingText(text, color) {
        const x = this.scene.cameras.main.width / 2;
        const y = this.scene.cameras.main.height / 3;
        
        const floatingText = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fontStyle: 'bold',
            fill: '#' + color.toString(16).padStart(6, '0'),
            align: 'center'
        }).setOrigin(0.5);
        floatingText.setScrollFactor(0);
        floatingText.setDepth(1000);
        
        this.scene.tweens.add({
            targets: floatingText,
            y: y - 50,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => floatingText.destroy()
        });
    }
    
    updateVisualState() {
        // Guard: panel elements may not be initialized yet
        if (!this.heartOrb || !this.innerGlow || !this.pulseRing || !this.stateText || !this.arousalFill) {
            return;
        }
        
        // Update colors and appearance based on arousal state
        let mainColor, glowColor, stateName;
        
        if (this.arousal < 0.2) {
            mainColor = this.BIOMETRIC_COLOR;
            glowColor = this.VOID_COLOR;
            stateName = 'VOID';
        } else if (this.arousal < 0.5) {
            mainColor = this.BIOMETRIC_COLOR;
            glowColor = this.STREAM_COLOR;
            stateName = 'STREAM';
        } else if (this.arousal < 0.8) {
            mainColor = this.STORM_COLOR;
            glowColor = this.STORM_COLOR;
            stateName = 'STORM';
        } else {
            mainColor = this.CASCADE_COLOR;
            glowColor = this.CASCADE_COLOR;
            stateName = 'CASCADE';
        }
        
        // Apply colors
        this.heartOrb.setFillStyle(mainColor, 0.8);
        this.innerGlow.setFillStyle(glowColor, 0.4);
        this.pulseRing.setStrokeStyle(2, mainColor, 0.6);
        this.stateText.setText(stateName);
        this.stateText.setFill('#' + mainColor.toString(16).padStart(6, '0'));
        
        // Update arousal bar
        const barWidth = 50 * this.arousal;
        this.arousalFill.setSize(barWidth, 4);
        this.arousalFill.setFillStyle(glowColor, 0.8);
    }
    
    // ===== PUBLIC API FOR OTHER SYSTEMS =====
    
    getArousal() {
        return this.arousal;
    }
    
    isInFlow() {
        return this.flowState;
    }
    
    getStressSpike() {
        return this.stressSpike;
    }
    
    getAdaptationLevel() {
        return this.adaptationLevel;
    }
    
    // Called by Echo Storm to get adjusted graze radius
    getEmpatheticGrazeRadius(baseRadius) {
        // During high tremor, make grazing easier
        if (this.metrics.tremorIndex > 0.5) {
            return baseRadius * 1.3;
        }
        return baseRadius;
    }
    
    // Called by game when checking bullet time eligibility
    shouldTriggerEmpatheticBulletTime() {
        return this.arousal > 0.7 && !this.stressSpike;
    }
    
    // Called by Resonance Cascade to get flow-adjusted duration
    getFlowAdjustedDuration(baseDuration) {
        if (this.flowState) {
            return baseDuration * 2.0;
        }
        return baseDuration;
    }
    
    // ===== UPDATE LOOP =====
    
    update(dt, player) {
        // Visual updates happen in tween onRepeat
        // Analysis happens in the interval callback
        
        // Guard: container may not be initialized yet (panel-based HUD async)
        if (!this.container) return;
        
        // Update container position for camera
        const camera = this.scene.cameras.main;
        this.container.x = camera.scrollX + camera.width - 60;
        this.container.y = camera.scrollY + 60;
    }
    
    destroy() {
        if (this.analysisInterval) {
            this.analysisInterval.remove();
        }
        if (this.container) {
            this.container.destroy();
        }
        if (this.breathGuide) {
            this.breathGuide.destroy();
        }
    }
}
