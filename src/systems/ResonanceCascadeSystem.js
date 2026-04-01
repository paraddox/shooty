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
        
        this.init();
    }
    
    init() {
        this.createVisuals();
    }
    
    createVisuals() {
        // Chain sequence display (center-top of screen)
        this.chainContainer = this.scene.add.container(this.scene.scale.width / 2, 80);
        this.chainContainer.setScrollFactor(0);
        this.chainContainer.setDepth(100);
        this.chainContainer.setVisible(false);
        
        // Multiplier text (large, central)
        this.multiplierText = this.scene.add.text(0, 0, '', {
            fontFamily: 'monospace',
            fontSize: '36px',
            fontStyle: 'bold',
            fill: '#ffffff'
        });
        this.multiplierText.setOrigin(0.5);
        this.multiplierText.setScrollFactor(0);
        this.multiplierText.setDepth(101);
        this.multiplierText.setVisible(false);
        
        // Sequence dot pool
        for (let i = 0; i < 6; i++) {
            const dot = this.scene.add.circle(0, 0, 8, 0xffffff);
            dot.setAlpha(0);
            dot.setDepth(102);
            dot.setScrollFactor(0);
            this.sequenceDots.push({
                sprite: dot,
                active: false,
                system: null
            });
        }
        
        // Cascade break text
        this.cascadeText = this.scene.add.text(0, 0, '', {
            fontFamily: 'monospace',
            fontSize: '48px',
            fontStyle: 'bold',
            fill: '#ff00ff'
        });
        this.cascadeText.setOrigin(0.5);
        this.cascadeText.setDepth(200);
        this.cascadeText.setVisible(false);
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
        
        // Update multiplier text
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
        // Update chain timer
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
        this.multiplierText.setPosition(this.scene.scale.width / 2, 140);
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
        this.chainContainer.setVisible(false);
        this.chainContainer.removeAll(true);
        this.multiplierText.setVisible(false);
    }
    
    /**
     * Get current damage multiplier for bullets
     */
    getDamageMultiplier() {
        return this.pendingDamageBonus * this.currentMultiplier;
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
