import Phaser from 'phaser';

/**
 * Resonance Cascade - Combo Synthesis System
 * 
 * Chaining different temporal systems creates exponential rewards:
 * - Bullet Time → Echo Absorption → Fracture → Node Fire = Cascading multiplier
 * - Each unique system activation adds to the Resonance Chain
 * - Higher chains = damage boost, extended durations, score multiplication
 * - "Cascade Break" finisher when chain ends = devastating area clear
 * 
 * This transforms isolated mechanics into an interconnected ecosystem,
 * rewarding mastery through emergent synergy rather than just individual use.
 */

export default class ResonanceCascadeSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Chain state
        this.activeChain = []; // Sequence of system activations
        this.chainStartTime = 0;
        this.chainTimer = 0;
        this.chainWindow = 4.0; // Seconds to maintain chain
        this.maxChainWindow = 6.0; // Extended at high chains
        
        // Multiplier state
        this.currentMultiplier = 1.0;
        this.baseMultiplier = 1.0;
        this.multiplierGainPerStep = 0.5;
        
        // Resonance States (unlocked at chain milestones)
        this.resonanceState = 'NONE'; // NONE, HARMONIC, SYMPHONIC, TRANSCENDENT
        this.resonanceStates = {
            HARMONIC: { minChain: 2, color: 0x00f0ff, damageBonus: 1.3, icon: '◆' },
            SYMPHONIC: { minChain: 3, color: 0xffd700, damageBonus: 1.6, icon: '◈' },
            TRANSCENDENT: { minChain: 4, color: 0xff00ff, damageBonus: 2.0, icon: '✦' }
        };
        
        // Chain history for tracking
        this.chainHistory = [];
        this.maxChainRecorded = 0;
        
        // Visuals
        this.chainDisplay = null;
        this.multiplierText = null;
        this.sequenceDots = [];
        
        // Damage tracking for multiplier
        this.pendingDamageBonus = 1.0;
        
        // Chain protection properties (for ResonanceOrb CASCADE synergy)
        this.chainBreakProtection = false; // Prevents chain from breaking on timeout
        this.chainBreakProtectionUses = 0; // Number of uses remaining
        this.chainWindowBonus = 0; // Additional seconds added to chain window
        
        this.init();
    }
    
    init() {
        this.createVisuals();
    }
    
    createVisuals() {
        // Chain sequence display (center-top) - registered with HUDPanelManager
        this.scene.hudPanels.registerSlot('RESONANCE_CASCADE', (container, width, layout) => {
            this.chainContainer = container;
            this.chainContainer.setDepth(100);
            this.chainContainer.setVisible(false);
            
            // Position elements to stay within positive bounds
            const centerY = 20; // Center point for elements
            
            // Multiplier text (large, central) - centered at centerY
            this.multiplierText = this.scene.add.text(0, centerY, '', {
                fontFamily: 'monospace',
                fontSize: '36px',
                fontStyle: 'bold',
                fill: '#ffffff'
            });
            this.multiplierText.setOrigin(0.5);
            this.multiplierText.setDepth(101);
            this.multiplierText.setVisible(false);
            container.add(this.multiplierText);
            
            // Sequence dot pool - positioned around center
            for (let i = 0; i < 6; i++) {
                const dot = this.scene.add.circle(0, centerY, 8, 0xffffff);
                dot.setAlpha(0);
                dot.setDepth(102);
                this.sequenceDots.push({
                    sprite: dot,
                    active: false,
                    system: null
                });
                container.add(dot);
            }
            
            // Cascade break text - centered at centerY
            this.cascadeText = this.scene.add.text(0, centerY, '', {
                fontFamily: 'monospace',
                fontSize: '48px',
                fontStyle: 'bold',
                fill: '#ff00ff'
            });
            this.cascadeText.setOrigin(0.5);
            this.cascadeText.setDepth(200);
            this.cascadeText.setVisible(false);
            container.add(this.cascadeText);
        }, 'TOP_CENTER');
    }
    
    /**
     * Record a system activation in the chain
     * Systems: 'BULLET_TIME', 'ECHO_ABSORB', 'FRACTURE', 'NODE_FIRE', 'GHOST_HIT', 'PERFECT_DODGE'
     */
    recordActivation(systemType, data = {}) {
        const now = this.scene.time.now / 1000;
        
        // Notify Observer Effect of this temporal system use
        if (this.scene.observerEffect) {
            // Map system types to observer keys
            const systemKeyMap = {
                'BULLET_TIME': 'bulletTime',
                'ECHO_ABSORB': 'echoStorm',
                'FRACTURE': 'fracture',
                'NODE_FIRE': 'residue',
                'GHOST_HIT': 'fracture',
                'PERFECT_DODGE': 'fracture',
                'SINGULARITY_DEPLOY': 'singularity',
                'SINGULARITY_DETONATE': 'singularity',
                'CHRONO_RECORD': 'chronoLoop',
                'CHRONO_PLAYBACK': 'chronoLoop',
                'PARADOX_ACTIVATE': 'paradox',
                'QUANTUM_BRANCH': 'quantum',
                'TIMELINE_MERGE': 'quantum',
                'DIMENSIONAL_COLLAPSE': 'dimensionalCollapse',
                'REWIND': 'rewind',
                'ANCHOR_PLACED': 'rewind',
                'META_PATCH': 'metaSystem',
                'META_EMERGENT': 'metaSystem'
            };
            
            const observerKey = systemKeyMap[systemType] || systemType.toLowerCase();
            this.scene.observerEffect.observeTemporalUse(observerKey, { type: systemType, ...data });
        }
        
        // Check if this is a new chain or continuation
        if (this.activeChain.length === 0) {
            // New chain
            this.chainStartTime = now;
            this.chainTimer = this.chainWindow;
            this.activeChain = [{ system: systemType, time: now, data }];
            this.currentMultiplier = this.baseMultiplier;
            this.onChainStart();
        } else {
            // Check if within window
            const timeSinceLast = now - (this.activeChain[this.activeChain.length - 1]?.time || now);
            
            if (timeSinceLast <= this.getCurrentWindow()) {
                // Continue chain
                this.activeChain.push({ system: systemType, time: now, data });
                this.chainTimer = this.getCurrentWindow();
                
                // Multiplier increases with chain length
                this.currentMultiplier = this.baseMultiplier + 
                    (this.activeChain.length - 1) * this.multiplierGainPerStep;
                
                // Cap multiplier at 5x
                this.currentMultiplier = Math.min(this.currentMultiplier, 5.0);
                
                this.onChainStep();
            } else {
                // Chain broken by time - trigger cascade break first
                this.triggerCascadeBreak();
                // Then start new chain
                this.chainStartTime = now;
                this.chainTimer = this.chainWindow;
                this.activeChain = [{ system: systemType, time: now, data }];
                this.currentMultiplier = this.baseMultiplier;
                this.onChainStart();
            }
        }
        
        // Update resonance state
        this.updateResonanceState();
        
        // Update max chain recorded
        if (this.activeChain.length > this.maxChainRecorded) {
            this.maxChainRecorded = this.activeChain.length;
        }
        
        // Resonance Orb System: Drop orb on 5+ chain
        if (this.activeChain.length === 5 && this.scene.resonanceOrbs) {
            const player = this.scene.player;
            if (player && player.active) {
                this.scene.resonanceOrbs.onResonanceChain(5, player.x, player.y);
            }
        }
        
        // Show activation feedback
        this.showActivationFeedback(systemType);
    }
    
    getCurrentWindow() {
        // Extend window at higher chains
        const extension = Math.min(this.activeChain.length * 0.5, 2.0);
        return this.chainWindow + extension;
    }
    
    /**
     * Add bonus steps to the resonance chain
     * Called by BootstrapProtocolSystem when a prophecy/singularity is fulfilled
     * @param {number} bonusSteps - Number of bonus steps to add
     * @returns {number} The updated multiplier value
     */
    addChainBonus(bonusSteps) {
        const now = Date.now() / 1000;
        
        // Ensure chain is active (start one if needed)
        if (this.activeChain.length === 0) {
            this.chainStartTime = now;
            this.chainTimer = this.chainWindow;
            this.currentMultiplier = this.baseMultiplier;
            this.onChainStart();
        }
        
        // Add bonus steps to the chain
        for (let i = 0; i < bonusSteps; i++) {
            this.activeChain.push({
                system: 'BONUS',
                time: now,
                data: { source: 'bootstrap_singularity' }
            });
            
            // Increase multiplier for each bonus step
            this.currentMultiplier += this.multiplierGainPerStep;
        }
        
        // Cap multiplier at 5x
        this.currentMultiplier = Math.min(this.currentMultiplier, 5.0);
        
        // Reset chain timer to extend the window
        this.chainTimer = this.getCurrentWindow();
        
        // Update resonance state based on new chain length
        this.updateResonanceState();
        
        // Update max chain recorded
        if (this.activeChain.length > this.maxChainRecorded) {
            this.maxChainRecorded = this.activeChain.length;
        }
        
        // Show activation feedback
        this.showActivationFeedback('BONUS');
        
        // Notify Omni-Weapon of high resonance chain if applicable
        if (this.scene.omniWeapon && this.activeChain.length >= 3) {
            this.scene.omniWeapon.onHighResonanceChain(this.activeChain.length);
        }
        
        console.log(`[ResonanceCascade] Added ${bonusSteps} bonus steps. Chain: ${this.activeChain.length}, Multiplier: ${this.currentMultiplier.toFixed(1)}x`);
        
        return this.currentMultiplier;
    }
    
    updateResonanceState() {
        const chainLength = this.activeChain.length;
        let newState = 'NONE';
        
        if (chainLength >= this.resonanceStates.TRANSCENDENT.minChain) {
            newState = 'TRANSCENDENT';
        } else if (chainLength >= this.resonanceStates.SYMPHONIC.minChain) {
            newState = 'SYMPHONIC';
        } else if (chainLength >= this.resonanceStates.HARMONIC.minChain) {
            newState = 'HARMONIC';
        }
        
        if (newState !== this.resonanceState) {
            this.resonanceState = newState;
            this.onResonanceStateChange(newState);
        }
    }
    
    onChainStart() {
        if (!this.chainContainer || !this.multiplierText) {
            console.warn('[ResonanceCascade] Chain visuals not initialized yet');
            return;
        }
        
        this.chainContainer.setVisible(true);
        this.multiplierText.setVisible(true);
        
        // Initial pulse effect
        const player = this.scene.player;
        const pulse = this.scene.add.circle(player.x, player.y, 30, 0x00f0ff);
        pulse.setAlpha(0.5);
        pulse.setDepth(47);
        
        this.scene.tweens.add({
            targets: pulse,
            scale: 3,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => pulse.destroy()
        });
    }
    
    onChainStep() {
        // Update sequence display
        this.updateSequenceDisplay();
    }
    
    onResonanceStateChange(newState) {
        if (newState === 'NONE') return;
        
        const state = this.resonanceStates[newState];
        
        // State change announcement
        const player = this.scene.player;
        const text = this.scene.add.text(player.x, player.y - 100, newState, {
            fontFamily: 'monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            fill: '#' + state.color.toString(16).padStart(6, '0')
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Apply state effects
        this.applyResonanceEffects(newState);
        
        // Notify Omni-Weapon of high resonance chain (for elemental chamber mod)
        if (this.scene.omniWeapon && this.activeChain.length >= 3) {
            this.scene.omniWeapon.onHighResonanceChain(this.activeChain.length);
        }
    }
    
    applyResonanceEffects(state) {
        const config = this.resonanceStates[state];
        
        switch (state) {
            case 'HARMONIC':
                // 30% damage boost
                this.pendingDamageBonus = config.damageBonus;
                break;
            case 'SYMPHONIC':
                // 60% damage boost, bullets pierce
                this.pendingDamageBonus = config.damageBonus;
                // Extend bullet time if active
                if (this.scene.nearMissState?.active) {
                    this.scene.nearMissState.remaining += 0.5;
                }
                break;
            case 'TRANSCENDENT':
                // Double damage, auto-absorb echoes in radius
                this.pendingDamageBonus = config.damageBonus;
                // Extend fracture if active
                if (this.scene.fractureSystem?.isFractured) {
                    this.scene.fractureSystem.fractureRemaining += 1.0;
                }
                break;
        }
    }
    
    showActivationFeedback(systemType) {
        const icons = {
            'BULLET_TIME': '◐',
            'ECHO_ABSORB': '◑', 
            'FRACTURE': '◒',
            'NODE_FIRE': '◓',
            'GHOST_HIT': '◔',
            'PERFECT_DODGE': '◕',
            'KILL': '✦',
            'SINGULARITY_DEPLOY': '◉',
            'SINGULARITY_DETONATE': '◎',
            'PARADOX_COMMIT': '◈',
            'EMPATHETIC_TIME': '◌',
            'FLOW_STATE': '◍',
            'HEARTFLUX_GRACE': '♥',
            'PARADOX_BONUS': '◇',
            'LOOP_START': '◧',
            'LOOP_COMPLETE': '◨',
            'QUANTUM_BRANCH': '◉',
            'TIMELINE_MERGE': '◈',
            'CONTRACT_SIGNED': '◊',
            'CONTRACT_FULFILLED': '◆',
            'CINEMATIC_CAPTURE': '◎',
            'DIMENSIONAL_COLLAPSE': '◆',
            'KAIROS_ENTER': '✦',
            'KAIROS_CRYSTALLIZE': '◈',
            'NEMESIS_SPAWN': '◉',
            'NEMESIS_HIT': '◆',
            'NEMESIS_DEFEAT': '◈',
            'ORACLE_ECHO': '◐',
            'ECHO_COLLAPSED': '◈',
            'BOOTSTRAP_ECHO': '⟲',
            'BOOTSTRAP_FULFILLED': '✓',
            'BOOTSTRAP_IGNORED': '✕',
            'RIVAL_SPAWN': '⚔',
            'RIVAL_ESCAPE': '↯',
            'RIVAL_DEFEAT': '⚔',
            'RIVAL_EVOLVE': '⬆',
            'RHYTHM_KICK': '♪',
            'RHYTHM_ON_BEAT': '♫',
            'RHYTHM_BASS_DROP': '♬',
            'LITHOGRAPHY': '▦',
            'STILLNESS_SPRING': '◎',
            'CRYSTAL_HARVEST': '◊'
        };
        
        const colors = {
            'BULLET_TIME': 0xffd700,
            'ECHO_ABSORB': 0xff00ff,
            'FRACTURE': 0x00f0ff,
            'NODE_FIRE': 0x9d4edd,
            'GHOST_HIT': 0xffd700,
            'PERFECT_DODGE': 0x00ff00,
            'KILL': 0xff3366,
            'SINGULARITY_DEPLOY': 0xdc143c,
            'SINGULARITY_DETONATE': 0xff1744,
            'PARADOX_COMMIT': 0xff00ff,
            'PARADOX_BONUS': 0xffd700,
            'EMPATHETIC_TIME': 0xff6b9d,
            'FLOW_STATE': 0x00f0ff,
            'HEARTFLUX_GRACE': 0xff6b9d,
            'QUANTUM_BRANCH': 0xffffff,
            'TIMELINE_MERGE': 0xff00ff,
            'LOOP_START': 0x008080,
            'LOOP_COMPLETE': 0x00cccc,
            'CONTRACT_SIGNED': 0x4b0082,
            'CONTRACT_FULFILLED': 0xffd700,
            'CINEMATIC_CAPTURE': 0xffbf00,
            'DIMENSIONAL_COLLAPSE': 0xffffff,
            'KAIROS_ENTER': 0xfff8e7,
            'KAIROS_CRYSTALLIZE': 0xffd700,
            'NEMESIS_SPAWN': 0xff0040,
            'NEMESIS_HIT': 0xff3366,
            'NEMESIS_DEFEAT': 0x00f0ff,
            'ORACLE_ECHO': 0x9d4edd,
            'ECHO_COLLAPSED': 0xffd700,
            'BOOTSTRAP_ECHO': 0xffaa00,
            'BOOTSTRAP_FULFILLED': 0xffaa00,
            'BOOTSTRAP_IGNORED': 0xff4444,
            'RIVAL_SPAWN': 0xcd7f32,
            'RIVAL_ESCAPE': 0xcd7f32,
            'RIVAL_DEFEAT': 0xcd7f32,
            'RIVAL_EVOLVE': 0xe6a65c,
            'RHYTHM_KICK': 0xffd700,
            'RHYTHM_ON_BEAT': 0xffed4a,
            'RHYTHM_BASS_DROP': 0xff00ff,
            'LITHOGRAPHY': 0xffffff,
            'STILLNESS_SPRING': 0xffd700,
            'CRYSTAL_HARVEST': 0x9d4edd
        };
        
        // Floating icon at player position
        const player = this.scene.player;
        const icon = this.scene.add.text(
            player.x + (Math.random() - 0.5) * 60,
            player.y - 40,
            icons[systemType] || '◆',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fill: '#' + (colors[systemType] || 0xffffff).toString(16).padStart(6, '0')
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: icon,
            y: icon.y - 30,
            alpha: 0,
            scale: 1.5,
            duration: 600,
            ease: 'Power2',
            onComplete: () => icon.destroy()
        });
    }
    
    updateSequenceDisplay() {
        const icons = {
            'BULLET_TIME': '◐',
            'ECHO_ABSORB': '◑',
            'FRACTURE': '◒',
            'NODE_FIRE': '◓',
            'GHOST_HIT': '◔',
            'PERFECT_DODGE': '◕',
            'KILL': '✦',
            'SINGULARITY_DEPLOY': '◉',
            'SINGULARITY_DETONATE': '◎',
            'PARADOX_COMMIT': '◈',
            'PARADOX_BONUS': '◇',
            'LOOP_START': '◧',
            'LOOP_COMPLETE': '◨',
            'QUANTUM_BRANCH': '◉',
            'TIMELINE_MERGE': '◈',
            'CONTRACT_SIGNED': '◊',
            'CONTRACT_FULFILLED': '◆',
            'CINEMATIC_CAPTURE': '◎',
            'KAIROS_ENTER': '✦',
            'KAIROS_CRYSTALLIZE': '◈',
            'NEMESIS_SPAWN': '◉',
            'NEMESIS_HIT': '◆',
            'NEMESIS_DEFEAT': '◈',
            'RHYTHM_KICK': '♪',
            'RHYTHM_ON_BEAT': '♫',
            'RHYTHM_BASS_DROP': '♬'
        };
        
        const colors = {
            'BULLET_TIME': '#ffd700',
            'ECHO_ABSORB': '#ff00ff',
            'FRACTURE': '#00f0ff',
            'NODE_FIRE': '#9d4edd',
            'GHOST_HIT': '#ffd700',
            'PERFECT_DODGE': '#00ff00',
            'KILL': '#ff3366',
            'SINGULARITY_DEPLOY': '#dc143c',
            'SINGULARITY_DETONATE': '#ff1744',
            'PARADOX_COMMIT': '#ff00ff',
            'PARADOX_BONUS': '#ffd700',
            'LOOP_START': '#008080',
            'LOOP_COMPLETE': '#00cccc',
            'QUANTUM_BRANCH': '#ffffff',
            'TIMELINE_MERGE': '#ff00ff',
            'CONTRACT_SIGNED': '#4b0082',
            'CONTRACT_FULFILLED': '#ffd700',
            'CINEMATIC_CAPTURE': '#ffbf00',
            'KAIROS_ENTER': '#fff8e7',
            'KAIROS_CRYSTALLIZE': '#ffd700',
            'NEMESIS_SPAWN': '#ff0040',
            'NEMESIS_HIT': '#ff3366',
            'NEMESIS_DEFEAT': '#00f0ff',
            'RHYTHM_KICK': '#ffd700',
            'RHYTHM_ON_BEAT': '#ffed4a',
            'RHYTHM_BASS_DROP': '#ff00ff'
        };
        
        if (!this.chainContainer || !this.multiplierText) return;
        
        // Clear and rebuild display
        this.chainContainer.removeAll(true);
        
        const spacing = 35;
        const totalWidth = (this.activeChain.length - 1) * spacing;
        
        this.activeChain.forEach((step, index) => {
            const x = (index * spacing) - (totalWidth / 2);
            const icon = icons[step.system] || '◆';
            const color = colors[step.system] || '#ffffff';
            
            const text = this.scene.add.text(x, 0, icon, {
                fontFamily: 'monospace',
                fontSize: '28px',
                fill: color
            }).setOrigin(0.5);
            
            // Animate in if new
            if (index === this.activeChain.length - 1) {
                text.setScale(0);
                this.scene.tweens.add({
                    targets: text,
                    scale: 1,
                    duration: 200,
                    ease: 'Back.out'
                });
            }
            
            this.chainContainer.add(text);
        });
        
        // Update multiplier text (if still active)
        if (!this.multiplierText?.active) return;
        
        const state = this.resonanceStates[this.resonanceState];
        const color = state ? '#' + state.color.toString(16).padStart(6, '0') : '#ffffff';
        
        this.multiplierText.setText(`×${this.currentMultiplier.toFixed(1)}`);
        this.multiplierText.setColor(color);
        
        // Pulse effect on multiplier
        this.scene.tweens.add({
            targets: this.multiplierText,
            scale: 1.3,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;
        
        // Decay chain timer
        if (this.activeChain.length > 0) {
            this.chainTimer -= dt;
            
            // Update visuals
            this.updateVisuals(dt);
            
            if (this.chainTimer <= 0) {
                // Chain window expired - trigger cascade break
                this.triggerCascadeBreak();
                this.resetChain();
            }
        }
    }
    
    updateVisuals(dt) {
        const player = this.scene.player;
        if (!player.active) return;
        
        // Use UnifiedGraphicsManager for effects layer
        const manager = this.scene.graphicsManager;
        
        const state = this.resonanceStates[this.resonanceState];
        const color = state ? state.color : 0x00f0ff;
        const pulse = 0.5 + Math.sin(this.scene.time.now / 100) * 0.3;
        const radius = 45 + Math.sin(this.scene.time.now / 80) * 5;
        
        // Render resonance ring via UnifiedGraphicsManager
        if (this.resonanceState !== 'NONE' && manager) {
            // Primary ring
            manager.drawRing('effects', player.x, player.y, radius, color, pulse, 2);
            
            // Secondary ring for higher states
            if (this.resonanceState === 'TRANSCENDENT') {
                manager.drawRing('effects', player.x, player.y, radius + 15, color, pulse * 0.5, 1);
            }
        }
        
        // Render chain glow via UnifiedGraphicsManager
        if (this.activeChain.length > 0 && manager) {
            const chainProgress = this.chainTimer / this.getCurrentWindow();
            const alpha = (1 - chainProgress) * 0.3;
            const glowRadius = 50 + this.activeChain.length * 10;
            // Draw filled circle for glow effect
            manager.drawCircle('effects', this.scene.scale.width / 2, 80, glowRadius, color, alpha, true);
        }
        
        // Update multiplier position (follow screen center)
        if (this.multiplierText) {
            this.multiplierText.setPosition(this.scene.scale.width / 2, 140);
        }
    }
    
    triggerCascadeBreak() {
        if (this.activeChain.length < 2) return; // Need at least 2 for a break
        
        const player = this.scene.player;
        const chainLength = this.activeChain.length;
        const state = this.resonanceStates[this.resonanceState];
        
        // Notify Observer Effect of combo completion
        if (this.scene.observerEffect) {
            const abilities = this.activeChain.map(c => c.system);
            this.scene.observerEffect.observeCombo(abilities);
        }
        
        // Calculate break power
        const breakPower = chainLength * this.currentMultiplier;
        
        // Visual effect based on power
        this.showCascadeBreakVisuals(chainLength, breakPower);
        
        // Apply break effects
        this.applyCascadeBreakEffects(chainLength, breakPower);
        
        // Score bonus
        const bonusScore = Math.floor(breakPower * 100);
        this.scene.score += bonusScore;
        
        // Show bonus text
        this.showBonusText(bonusScore, player.x, player.y);
        
        // Record in history
        this.chainHistory.push({
            length: chainLength,
            multiplier: this.currentMultiplier,
            systems: [...this.activeChain.map(s => s.system)],
            finalState: this.resonanceState,
            bonusScore: bonusScore
        });
    }
    
    showCascadeBreakVisuals(chainLength, breakPower) {
        if (!this.cascadeText?.active) return;
        
        const player = this.scene.player;
        const state = this.resonanceStates[this.resonanceState];
        const color = state ? state.color : 0x00f0ff;
        
        // "CASCADE BREAK" text
        this.cascadeText.setPosition(player.x, player.y - 120);
        this.cascadeText.setText('CASCADE BREAK');
        this.cascadeText.setColor('#' + color.toString(16).padStart(6, '0'));
        this.cascadeText.setVisible(true);
        this.cascadeText.setScale(0.5);
        this.cascadeText.setAlpha(1);
        
        this.scene.tweens.add({
            targets: this.cascadeText,
            scale: 1,
            y: player.y - 150,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => this.cascadeText.setVisible(false)
        });
        
        // Screen shake proportional to chain
        this.scene.cameras.main.shake(200 + chainLength * 50, 0.002 + chainLength * 0.001);
        
        // Flash
        this.scene.cameras.main.flash(150, 
            (color >> 16) & 0xff,
            (color >> 8) & 0xff,
            color & 0xff,
            0.2
        );
    }
    
    applyCascadeBreakEffects(chainLength, breakPower) {
        const player = this.scene.player;
        
        // Damage all enemies in radius based on break power
        const damageRadius = 100 + chainLength * 50;
        const baseDamage = 20 * breakPower;
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y, enemy.x, enemy.y
            );
            
            if (dist <= damageRadius) {
                // Damage falls off with distance
                const falloff = 1 - (dist / damageRadius);
                const damage = baseDamage * falloff;
                
                enemy.takeDamage(damage);
                
                // Knockback
                const angle = Phaser.Math.Angle.Between(
                    player.x, player.y, enemy.x, enemy.y
                );
                enemy.body.velocity.x += Math.cos(angle) * 200 * falloff;
                enemy.body.velocity.y += Math.sin(angle) * 200 * falloff;
            }
        });
        
        // Clear nearby enemy bullets
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y, bullet.x, bullet.y
            );
            
            if (dist <= damageRadius * 0.7) {
                // Convert to friendly bullet that fires back
                this.convertBulletToFriendly(bullet, player);
            }
        });
        
        // Heal player slightly at higher chains
        if (chainLength >= 4) {
            const healAmount = Math.min(chainLength * 3, 20);
            player.health = Math.min(player.health + healAmount, player.maxHealth);
        }
    }
    
    convertBulletToFriendly(bullet, player) {
        // Get aim angle toward nearest enemy
        let nearest = null;
        let nearestDist = 1000;
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        });
        
        // Recycle as player bullet
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.reset(0, 0);
        bullet.body.enable = false;
        
        if (nearest) {
            const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, nearest.x, nearest.y);
            
            const friendlyBullet = this.scene.getBulletsGroup().get(bullet.x, bullet.y, 'bullet');
            if (friendlyBullet) {
                friendlyBullet.setActive(true);
                friendlyBullet.setVisible(true);
                friendlyBullet.setDepth(1);
                friendlyBullet.body.enable = true;
                friendlyBullet.body.reset(bullet.x, bullet.y);
                friendlyBullet.setTint(0x00ff00); // Green = converted
                friendlyBullet.setScale(0.6);
                
                const speed = 500;
                friendlyBullet.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
                friendlyBullet.setRotation(angle);
            }
        }
    }
    
    showBonusText(amount, x, y) {
        const text = this.scene.add.text(x, y - 60, `+${amount}`, {
            fontFamily: 'monospace',
            fontSize: '28px',
            fontStyle: 'bold',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 100,
            alpha: 0,
            scale: 1.3,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    resetChain() {
        this.activeChain = [];
        this.chainTimer = 0;
        this.currentMultiplier = this.baseMultiplier;
        this.resonanceState = 'NONE';
        this.pendingDamageBonus = 1.0;
        
        // Hide displays
        if (this.chainContainer) {
            this.chainContainer.setVisible(false);
            this.chainContainer.removeAll(true);
        }
        if (this.multiplierText) {
            this.multiplierText.setVisible(false);
        }
    }
    
    /**
     * Add chain levels (for ResonanceOrb CASCADE synergy)
     * Grants bonus chain progress without requiring activations
     * @param {number} levels - Number of chain levels to add
     * @param {Object} bonuses - Optional bonuses { protectionUses, windowBonus }
     */
    addChainLevels(levels, bonuses = {}) {
        // Add phantom chain steps to boost multiplier
        for (let i = 0; i < levels; i++) {
            this.activeChain.push('ORB_BONUS');
            this.currentMultiplier += this.multiplierGainPerStep;
        }
        
        // Apply chain break protection if provided
        if (bonuses.protectionUses > 0) {
            this.chainBreakProtection = true;
            this.chainBreakProtectionUses = bonuses.protectionUses;
        }
        
        // Extend chain window if provided
        if (bonuses.windowBonus > 0) {
            this.chainWindowBonus = bonuses.windowBonus;
            this.chainTimer += bonuses.windowBonus;
        }
        
        // Update visuals to show new chain state
        // NOTE: createVisuals() is NOT called here - visuals are created once in init()
        this.updateResonanceState();
    }
    
    /**
     * Get current damage multiplier for bullets
     */
    getDamageMultiplier() {
        return this.pendingDamageBonus * this.currentMultiplier;
    }
    
    /**
     * Get current chain array
     */
    getCurrentChain() {
        return this.activeChain || [];
    }
    
    /**
     * Check if a specific resonance state is active
     */
    hasResonanceState(state) {
        return this.resonanceState === state;
    }
    
    /**
     * Force break the chain (e.g., on player damage)
     */
    forceBreak() {
        if (this.activeChain.length > 0) {
            // Penalty - lose the chain without cascade benefit
            this.resetChain();
            
            // Visual feedback for lost chain
            const player = this.scene.player;
            const text = this.scene.add.text(player.x, player.y - 50, 'CHAIN BROKEN', {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#ff3366'
            }).setOrigin(0.5);
            
            this.scene.tweens.add({
                targets: text,
                y: player.y - 80,
                alpha: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => text.destroy()
            });
        }
    }
    
    /**
     * Get chain summary for game over stats
     */
    getStats() {
        return {
            maxChain: this.maxChainRecorded,
            totalCascades: this.chainHistory.length,
            bestMultiplier: Math.max(...this.chainHistory.map(c => c.multiplier), 1.0)
        };
    }
}
