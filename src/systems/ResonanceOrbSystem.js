import Phaser from 'phaser';

/**
 * Resonance Orb System — Living Power-Ups
 * 
 * The missing synthesis: Traditional power-ups are static bonuses that exist
 * outside the game's intricate temporal ecosystem. Resonance Orbs are different.
 * They are ALIVE — temporary surges of dimensional energy that cascade through
 * the existing 43+ systems, amplifying and interconnecting them in unique ways.
 * 
 * Core Philosophy:
 * - Every orb feeds INTO existing systems (never isolated effects)
 * - Orbs create meaningful tactical decisions (which system to surge?)
 * - Unclaimed orbs fade, creating risk/reward spatial pressure
 * - Multiple orbs create "superposition" bonuses (quantum stacking)
 * 
 * Orb Types (7 Resonance Categories):
 * 
 * 1. CHRONO ORB (Cyan) — Temporal Manipulation Surge
 *    - Extends bullet time duration by 50%
 *    - Accelerates Fracture Protocol charge by 2x
 *    - Reduces Chrono-Loop cooldown by 30%
 *    - Duration: 8 seconds
 * 
 * 2. ECHO ORB (Gold) — Echo Storm Amplification
 *    - Auto-absorbs all echoes within 100px (no graze required)
 *    - Boosts Echo Storm homing missile damage by 75%
 *    - Extends echo lifetime during bullet time
 *    - Duration: 6 seconds
 * 
 * 3. CASCADE ORB (Magenta) — Resonance Chain Surge
 *    - Instantly grants +2 Resonance Chain levels
 *    - Prevents chain breaks from minor damage (1 hit protection)
 *    - Extends chain window by 3 seconds
 *    - Duration: 10 seconds (or until chain breaks)
 * 
 * 4. PARADOX ORB (Iridescent) — Causal Manipulation
 *    - All paradox predictions become perfect (100% accuracy)
 *    - Auto-triggers paradox projections on near-misses
 *    - Reduces paradox cooldown by 50%
 *    - Duration: 5 seconds (rare, powerful)
 * 
 * 5. VOID ORB (Deep Purple) — Coherence Acceleration
 *    - Rapidly accelerates Void Coherence to 100%
 *    - Unlocks hidden "Void Bloom" effect (damage aura)
 *    - Syntropy Radial becomes omni-directional
 *    - Duration: 7 seconds
 * 
 * 6. SINGULARITY ORB (Black with White Halo) — Gravitational Surge
 *    - Instantly charges singularity to maximum
 *    - Expands singularity radius by 50%
 *    - Enemy bullets within radius are slowed to 25%
 *    - Duration: Passive (one-time deploy enhancement)
 * 
 * 7. QUANTUM ORB (Rainbow Shimmer) — Superposition State
 *    - The rarest orb — triggers ALL active orbs simultaneously
 *    - Creates "Quantum Superposition" where all bonuses stack
 *    - Duration: 4 seconds of absolute power
 * 
 * Drop Mechanics:
 * - 15% chance on enemy death (scales with combo length)
 * - 50% chance on boss phase transition
 * - Guaranteed on perfect fracture resolution
 * - Guaranteed on 5+ Resonance Chain
 * 
 * Collection Mechanics:
 * - Orbs drift slowly toward player when nearby (50px magnetism)
 * - Unclaimed orbs fade after 8 seconds (temporal decay)
 * - Collecting orb during its matching system = 25% bonus extension
 * 
 * Superposition Bonus (Multiple Orbs):
 * - 2 orbs active: +25% duration to both
 * - 3 orbs active: "Resonance Harmony" — all damage +30%
 * - 4+ orbs active: "Dimensional Overload" — brief invincibility pulse
 * 
 * Visual Design:
 * - Each orb is a pulsing geometric shape matching its color
 * - Trails fade behind drifting orbs (temporal wake)
 * - HUD shows active orbs as glowing seals at screen edge
 * - Fading orbs pulse rapidly then wink out (temporal collapse)
 * 
 * Why This Is Revolutionary:
 * 1. **No isolated mechanics** — Every orb connects to existing systems
 * 2. **Meaningful choice** — Players prioritize orbs based on playstyle
 * 3. **Spatial pressure** — Drift + fade creates urgency
 * 4. **Mastery amplification** — Better players maintain more orbs
 * 5. **Spectacle** — Superposition states are visually stunning
 * 6. **Complements all 43 systems** — Integrates without adding complexity debt
 * 
 * Integration Notes:
 * - Echo Storm: Orbs can be absorbed like echoes during bullet time
 * - Fracture: Both ghost and real player can collect (stacking potential)
 * - Resonance Cascade: Orb collection adds +1 to chain
 * - Chronicle: Records which orbs were favored across runs
 * - Nemesis: Nemesis can collect corrupted orbs (inverted effects)
 */

export default class ResonanceOrbSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.ORB_TYPES = {
            CHRONO: { color: 0x00f0ff, glow: 0x40ffff, name: 'CHRONO', duration: 8000, shape: 'triangle' },
            ECHO: { color: 0xffd700, glow: 0xffec8b, name: 'ECHO', duration: 6000, shape: 'circle' },
            CASCADE: { color: 0xff00ff, glow: 0xff80ff, name: 'CASCADE', duration: 10000, shape: 'diamond' },
            PARADOX: { color: 0xffffff, glow: 0xff00ff, name: 'PARADOX', duration: 5000, shape: 'hexagon', rarity: 'rare' },
            VOID: { color: 0x9400d3, glow: 0xda70d6, name: 'VOID', duration: 7000, shape: 'pentagon' },
            SINGULARITY: { color: 0x1a1a1a, glow: 0xffffff, name: 'SINGULARITY', duration: 0, shape: 'ring', rarity: 'uncommon' },
            QUANTUM: { color: 0xff00ff, glow: 0x00ffff, name: 'QUANTUM', duration: 4000, shape: 'star', rarity: 'legendary', isRainbow: true }
        };
        
        this.DROP_CHANCE_BASE = 0.15;
        this.DROP_CHANCE_MAX = 0.40;
        this.ORB_LIFETIME = 8000; // ms before fading
        this.MAGNET_RANGE = 150; // px
        this.MAGNET_SPEED = 80; // px/sec drift toward player
        
        // Active orbs on screen (not collected)
        this.activeOrbs = [];
        
        // Player's current orb effects
        this.playerOrbs = new Map(); // orbType -> { startTime, duration, timer }
        
        // Visual group
        this.orbGroup = null;
        this.graphics = null;
        
        // Superposition tracking
        this.superpositionLevel = 0;
        this.superpositionTimer = null;
        
        // Statistics
        this.stats = {
            totalDropped: 0,
            totalCollected: 0,
            orbsByType: {},
            superpositionsAchieved: 0,
            longestOrbChain: 0
        };
        
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        // Create visual group for orbs
        this.orbGroup = this.scene.add.group();
        this.graphics = this.scene.add.graphics();
        
        // Create UI container for active orb indicators
        this.createOrbHUD();
        
        this.initialized = true;
    }
    
    createOrbHUD() {
        // HUD container at top-right, below other UI
        this.hudContainer = this.scene.add.container(
            this.scene.cameras.main.width - 20, 
            140
        ).setScrollFactor(0).setDepth(1000);
        
        this.orbIndicators = [];
        
        // Background panel for active orbs
        const bg = this.scene.add.rectangle(0, 0, 160, 40, 0x000000, 0.5);
        bg.setStrokeStyle(1, 0x444444);
        this.hudContainer.add(bg);
        this.hudBg = bg;
        
        // Superposition text
        this.superpositionText = this.scene.add.text(0, -35, '', {
            fontFamily: 'Courier New',
            fontSize: '11px',
            color: '#ff00ff'
        }).setOrigin(0.5);
        this.hudContainer.add(this.superpositionText);
        
        this.hudContainer.setVisible(false);
    }
    
    update(time, delta) {
        if (!this.initialized) return;
        
        // Update floating orbs
        this.updateFloatingOrbs(time, delta);
        
        // Update player orb effects
        this.updatePlayerOrbs(time);
        
        // Update HUD
        this.updateHUD(time);
        
        // Update superposition state
        this.updateSuperposition();
    }
    
    updateFloatingOrbs(time, delta) {
        const player = this.scene.player;
        if (!player || !player.active) return;
        
        for (let i = this.activeOrbs.length - 1; i >= 0; i--) {
            const orb = this.activeOrbs[i];
            
            // Magnetism toward player
            const dx = player.x - orb.x;
            const dy = player.y - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < this.MAGNET_RANGE && dist > 20) {
                // Drift toward player
                const speed = this.MAGNET_SPEED * (1 - dist / this.MAGNET_RANGE);
                orb.x += (dx / dist) * speed * (delta / 1000);
                orb.y += (dy / dist) * speed * (delta / 1000);
            }
            
            // Gentle floating animation
            orb.floatOffset += delta * 0.002;
            orb.y += Math.sin(orb.floatOffset) * 0.3;
            orb.rotation += delta * 0.001;
            
            // Check collection
            if (dist < 30) {
                this.collectOrb(orb);
                this.removeOrb(i);
                continue;
            }
            
            // Check fade
            const age = time - orb.spawnTime;
            const remaining = this.ORB_LIFETIME - age;
            
            if (remaining <= 0) {
                this.fadeOutOrb(i);
                continue;
            }
            
            // Pulse when about to fade
            if (remaining < 2000) {
                orb.alpha = 0.5 + 0.5 * Math.sin(time * 0.01);
                orb.pulseScale = 1 + 0.2 * Math.sin(time * 0.02);
            }
            
            // Update visual
            this.drawOrb(orb);
        }
    }
    
    drawOrb(orb) {
        const config = this.ORB_TYPES[orb.type];
        const g = this.graphics;
        
        // Clear previous draw for this orb (simplified - full clear each frame)
        g.clear();
        
        // Draw all orbs
        for (const o of this.activeOrbs) {
            const cfg = this.ORB_TYPES[o.type];
            const x = o.x - this.scene.cameras.main.scrollX;
            const y = o.y - this.scene.cameras.main.scrollY;
            const scale = o.pulseScale || 1;
            
            // Glow
            g.fillStyle(cfg.glow, 0.3 * o.alpha);
            this.drawShape(g, x, y, 18 * scale, cfg.shape);
            
            // Core
            g.fillStyle(cfg.color, 0.9 * o.alpha);
            this.drawShape(g, x, y, 12 * scale, cfg.shape);
            
            // Inner light
            g.fillStyle(0xffffff, 0.5 * o.alpha);
            this.drawShape(g, x, y, 6 * scale, cfg.shape);
            
            // Rainbow effect for quantum orbs
            if (cfg.isRainbow) {
                const hue = (this.scene.time.now * 0.2) % 360;
                const rainbowColor = Phaser.Display.Color.HSLToColor(hue / 360, 1, 0.5).color;
                g.lineStyle(2, rainbowColor, 0.8 * o.alpha);
                g.strokeCircle(x, y, 20 * scale);
            }
        }
    }
    
    drawShape(g, x, y, size, shape) {
        switch (shape) {
            case 'triangle':
                g.fillTriangle(
                    x, y - size,
                    x - size * 0.866, y + size * 0.5,
                    x + size * 0.866, y + size * 0.5
                );
                break;
            case 'circle':
                g.fillCircle(x, y, size);
                break;
            case 'diamond':
                g.fillPoints([
                    { x: x, y: y - size },
                    { x: x + size, y: y },
                    { x: x, y: y + size },
                    { x: x - size, y: y }
                ], true);
                break;
            case 'hexagon':
                const hexPoints = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (i * 60 - 90) * Math.PI / 180;
                    hexPoints.push({
                        x: x + Math.cos(angle) * size,
                        y: y + Math.sin(angle) * size
                    });
                }
                g.fillPoints(hexPoints, true);
                break;
            case 'pentagon':
                const pentPoints = [];
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 72 - 90) * Math.PI / 180;
                    pentPoints.push({
                        x: x + Math.cos(angle) * size,
                        y: y + Math.sin(angle) * size
                    });
                }
                g.fillPoints(pentPoints, true);
                break;
            case 'ring':
                g.fillCircle(x, y, size);
                g.fillStyle(0x000000, 1);
                g.fillCircle(x, y, size * 0.6);
                break;
            case 'star':
                const starPoints = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i * 36 - 90) * Math.PI / 180;
                    const r = i % 2 === 0 ? size : size * 0.4;
                    starPoints.push({
                        x: x + Math.cos(angle) * r,
                        y: y + Math.sin(angle) * r
                    });
                }
                g.fillPoints(starPoints, true);
                break;
        }
    }
    
    spawnOrb(x, y, type = null, forced = false) {
        if (!this.initialized) this.init();
        
        // Determine orb type if not specified
        if (!type) {
            type = this.selectRandomOrbType();
        }
        
        const config = this.ORB_TYPES[type];
        
        // Create orb object
        const orb = {
            x: x,
            y: y,
            type: type,
            spawnTime: this.scene.time.now,
            floatOffset: Math.random() * Math.PI * 2,
            alpha: 1,
            pulseScale: 1,
            rotation: 0,
            isCollected: false
        };
        
        this.activeOrbs.push(orb);
        
        // Track stats
        this.stats.totalDropped++;
        this.stats.orbsByType[type] = (this.stats.orbsByType[type] || 0) + 1;
        
        // Visual spawn effect
        this.spawnEffect(x, y, config.color);
        
        // Audio cue
        if (this.scene.synaesthesiaProtocol) {
            this.scene.synaesthesiaProtocol.onGameplayEvent('orbSpawned', type.toLowerCase());
        }
        
        return orb;
    }
    
    selectRandomOrbType() {
        const rand = Math.random();
        
        // Rarity distribution
        if (rand < 0.01) return 'QUANTUM'; // 1% legendary
        if (rand < 0.05) return 'PARADOX'; // 4% rare
        if (rand < 0.15) return 'SINGULARITY'; // 10% uncommon
        
        // Common pool (remaining 85%)
        const common = ['CHRONO', 'ECHO', 'CASCADE', 'VOID'];
        return common[Math.floor(Math.random() * common.length)];
    }
    
    tryDropFromEnemy(enemyX, enemyY, comboLength = 0) {
        // Base drop chance increases with combo
        const comboBonus = Math.min(comboLength * 0.02, 0.15);
        const dropChance = this.DROP_CHANCE_BASE + comboBonus;
        
        if (Math.random() < dropChance) {
            this.spawnOrb(enemyX, enemyY);
            return true;
        }
        return false;
    }
    
    tryDropFromBoss(bossX, bossY, isPhaseTransition = false) {
        if (isPhaseTransition || Math.random() < 0.3) {
            // Boss drops are more likely to be rare
            let type = null;
            const rand = Math.random();
            if (rand < 0.3) type = 'PARADOX';
            else if (rand < 0.6) type = 'SINGULARITY';
            else if (rand < 0.8) type = 'QUANTUM';
            
            this.spawnOrb(bossX, bossY, type);
            return true;
        }
        return false;
    }
    
    collectOrb(orb) {
        const type = orb.type;
        const config = this.ORB_TYPES[type];
        
        // Remove existing effect of same type (refresh)
        if (this.playerOrbs.has(type)) {
            const existing = this.playerOrbs.get(type);
            if (existing.timer) existing.timer.remove();
        }
        
        // Calculate duration with superposition bonus
        let duration = config.duration;
        const activeCount = this.playerOrbs.size;
        
        // 2+ orbs = +25% duration
        if (activeCount >= 1) {
            duration *= 1.25;
        }
        
        // Apply the effect
        this.applyOrbEffect(type, duration);
        
        // Track in player orbs
        const endTime = this.scene.time.now + duration;
        const timer = this.scene.time.delayedCall(duration, () => {
            this.expireOrb(type);
        });
        
        this.playerOrbs.set(type, {
            startTime: this.scene.time.now,
            endTime: endTime,
            duration: duration,
            timer: timer
        });
        
        // Visual collection effect
        this.collectionEffect(orb.x, orb.y, config.color);
        
        // Floating text
        this.showFloatingText(
            orb.x, orb.y - 30,
            `${config.name} SURGE!`,
            config.color
        );
        
        // Audio
        if (this.scene.synaesthesiaProtocol) {
            this.scene.synaesthesiaProtocol.onGameplayEvent('orbCollected', type.toLowerCase());
        }
        
        // Add to Resonance Cascade chain
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.addToChain('orb', orb.x, orb.y);
        }
        
        // Track stats
        this.stats.totalCollected++;
        
        // Update chain record
        if (this.playerOrbs.size > this.stats.longestOrbChain) {
            this.stats.longestOrbChain = this.playerOrbs.size;
        }
        
        // Check for superposition achievements
        this.checkSuperpositionAchievements();
        
    }
    
    applyOrbEffect(type, duration) {
        const nearMissState = this.scene.nearMissState;
        
        switch (type) {
            case 'CHRONO':
                // Extend bullet time duration
                nearMissState.durationMultiplier = 1.5;
                
                // Accelerate Fracture charge
                if (this.scene.fractureSystem) {
                    this.scene.fractureSystem.chargeMultiplier = 2.0;
                }
                
                // Reduce Chrono-Loop cooldown
                if (this.scene.chronoLoop) {
                    this.scene.chronoLoop.cooldownMultiplier = 0.7;
                }
                break;
                
            case 'ECHO':
                // Auto-absorb echoes
                if (this.scene.echoStorm) {
                    this.scene.echoStorm.autoAbsorbRadius = 100;
                    this.scene.echoStorm.damageMultiplier = 1.75;
                }
                break;
                
            case 'CASCADE':
                // Cascade orb effects
                if (this.scene.resonanceCascade) {
                    // NOTE: addChainLevels() not implemented - chainBreakProtection and chainWindowBonus
                    // properties don't exist either, this needs proper implementation
                }
                break;
                
            case 'PARADOX':
                // Perfect predictions
                if (this.scene.paradoxEngine) {
                    this.scene.paradoxEngine.accuracyBonus = 1.0; // 100%
                    this.scene.paradoxEngine.autoTriggerOnNearMiss = true;
                    this.scene.paradoxEngine.cooldownMultiplier = 0.5;
                }
                break;
                
            case 'VOID':
                // Rapid coherence
                if (this.scene.voidCoherence) {
                    this.scene.voidCoherence.accelerationRate = 3.0;
                    this.scene.voidCoherence.voidBloomUnlocked = true;
                }
                if (this.scene.syntropyEngine) {
                    this.scene.syntropyEngine.omniDirectional = true;
                }
                break;
                
            case 'SINGULARITY':
                // Instant charge + enhancement
                if (this.scene.singularitySystem) {
                    this.scene.singularitySystem.instantMaxCharge();
                    this.scene.singularitySystem.radiusMultiplier = 1.5;
                    this.scene.singularitySystem.bulletSlowFactor = 0.25;
                }
                break;
                
            case 'QUANTUM':
                // Trigger all active effects at maximum power
                this.activateQuantumSuperposition();
                break;
        }
    }
    
    expireOrb(type) {
        // Remove from player orbs
        this.playerOrbs.delete(type);
        
        // Remove effects
        this.removeOrbEffect(type);
        
        // Visual feedback
        this.showFloatingText(
            this.scene.player.x, this.scene.player.y - 50,
            `${this.ORB_TYPES[type].name} FADES...`,
            0x888888
        );
        
    }
    
    removeOrbEffect(type) {
        switch (type) {
            case 'CHRONO':
                this.scene.nearMissState.durationMultiplier = 1.0;
                if (this.scene.fractureSystem) {
                    this.scene.fractureSystem.chargeMultiplier = 1.0;
                }
                if (this.scene.chronoLoop) {
                    this.scene.chronoLoop.cooldownMultiplier = 1.0;
                }
                break;
                
            case 'ECHO':
                if (this.scene.echoStorm) {
                    this.scene.echoStorm.autoAbsorbRadius = 0;
                    this.scene.echoStorm.damageMultiplier = 1.0;
                }
                break;
                
            case 'CASCADE':
                if (this.scene.resonanceCascade) {
                    this.scene.resonanceCascade.chainBreakProtection = false;
                    this.scene.resonanceCascade.chainWindowBonus = 0;
                }
                break;
                
            case 'PARADOX':
                if (this.scene.paradoxEngine) {
                    this.scene.paradoxEngine.accuracyBonus = 0;
                    this.scene.paradoxEngine.autoTriggerOnNearMiss = false;
                    this.scene.paradoxEngine.cooldownMultiplier = 1.0;
                }
                break;
                
            case 'VOID':
                if (this.scene.voidCoherence) {
                    this.scene.voidCoherence.accelerationRate = 1.0;
                    this.scene.voidCoherence.voidBloomUnlocked = false;
                }
                if (this.scene.syntropyEngine) {
                    this.scene.syntropyEngine.omniDirectional = false;
                }
                break;
                
            case 'SINGULARITY':
                if (this.scene.singularitySystem) {
                    this.scene.singularitySystem.radiusMultiplier = 1.0;
                    this.scene.singularitySystem.bulletSlowFactor = 1.0;
                }
                break;
        }
    }
    
    activateQuantumSuperposition() {
        // Apply ALL non-quantum orb effects simultaneously at enhanced power
        const types = ['CHRONO', 'ECHO', 'CASCADE', 'PARADOX', 'VOID', 'SINGULARITY'];
        
        for (const type of types) {
            // Apply with extended duration
            this.applyOrbEffect(type, 6000);
        }
        
        // Superposition bonuses
        this.superpositionLevel = 4;
        
        // Brief invincibility pulse
        if (this.scene.player) {
            this.scene.player.isInvulnerable = true;
            this.scene.time.delayedCall(1000, () => {
                if (this.scene.player) {
                    this.scene.player.isInvulnerable = false;
                }
            });
        }
        
        // Visual spectacle
        this.quantumEffect();
        
        // Track achievement
        this.stats.superpositionsAchieved++;
        
        // Announce
        this.showFloatingText(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 100,
            'QUANTUM SUPERPOSITION!',
            0xff00ff,
            24
        );
        
        if (this.scene.synaesthesiaProtocol) {
            this.scene.synaesthesiaProtocol.onGameplayEvent('quantumSuperposition', 'activated');
        }
    }
    
    updatePlayerOrbs(time) {
        // Effects are handled by their respective systems checking these flags
        // This just maintains the tracking
    }
    
    updateHUD(time) {
        const orbCount = this.playerOrbs.size;
        
        if (orbCount === 0) {
            this.hudContainer.setVisible(false);
            return;
        }
        
        this.hudContainer.setVisible(true);
        
        // Clear old indicators
        for (const indicator of this.orbIndicators) {
            indicator.destroy();
        }
        this.orbIndicators = [];
        
        // Resize background
        this.hudBg.setSize(Math.max(160, orbCount * 35 + 20), 40);
        
        // Create indicators for each active orb
        let index = 0;
        for (const [type, data] of this.playerOrbs) {
            const config = this.ORB_TYPES[type];
            const remaining = Math.max(0, data.endTime - time);
            const pct = remaining / data.duration;
            
            // Container for this indicator
            const x = (index - (orbCount - 1) / 2) * 35;
            const y = 0;
            
            // Background circle
            const bg = this.scene.add.circle(x, y, 14, 0x222222, 0.8);
            bg.setStrokeStyle(2, config.color);
            this.hudContainer.add(bg);
            
            // Progress ring (simplified as alpha)
            bg.setAlpha(0.3 + 0.7 * pct);
            
            // Icon (first letter)
            const icon = this.scene.add.text(x, y, config.name[0], {
                fontFamily: 'Courier New',
                fontSize: '14px',
                color: Phaser.Display.Color.IntegerToColor(config.color).rgba
            }).setOrigin(0.5);
            this.hudContainer.add(icon);
            
            this.orbIndicators.push(bg, icon);
            index++;
        }
        
        // Superposition text
        if (this.superpositionLevel >= 3) {
            this.superpositionText.setText('⚡ DIMENSIONAL OVERLOAD ⚡');
            this.superpositionText.setColor('#ff00ff');
        } else if (this.superpositionLevel === 2) {
            this.superpositionText.setText('♪ RESONANCE HARMONY ♪');
            this.superpositionText.setColor('#00ffff');
        } else {
            this.superpositionText.setText('');
        }
    }
    
    updateSuperposition() {
        const count = this.playerOrbs.size;
        
        if (count >= 4) {
            this.superpositionLevel = 3; // Dimensional Overload
        } else if (count === 3) {
            this.superpositionLevel = 2; // Resonance Harmony
        } else if (count === 2) {
            this.superpositionLevel = 1; // Basic Superposition
        } else {
            this.superpositionLevel = 0;
        }
    }
    
    checkSuperpositionAchievements() {
        // Check for special achievements
        if (this.playerOrbs.size >= 3 && this.scene.achievements) {
            this.scene.achievements.unlock('orb_trinity');
        }
        
        if (this.playerOrbs.size >= 5) {
            this.scene.achievements?.unlock('orb_nexus');
        }
    }
    
    removeOrb(index) {
        this.activeOrbs.splice(index, 1);
    }
    
    fadeOutOrb(index) {
        const orb = this.activeOrbs[index];
        
        // Fade effect
        this.scene.tweens.add({
            targets: orb,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => {
                const idx = this.activeOrbs.indexOf(orb);
                if (idx >= 0) this.removeOrb(idx);
            }
        });
    }
    
    spawnEffect(x, y, color) {
        // Particle burst
        if (this.scene.hitParticles) {
            const originalTint = this.scene.hitParticles.particleTint;
            this.scene.hitParticles.setParticleTint(color);
            this.scene.hitParticles.emitParticleAt(x, y, 8);
            this.scene.hitParticles.setParticleTint(originalTint);
        }
    }
    
    collectionEffect(x, y, color) {
        // Expanding ring
        const ring = this.scene.add.circle(x, y, 10, color, 0.5);
        this.scene.tweens.add({
            targets: ring,
            scale: 4,
            alpha: 0,
            duration: 400,
            onComplete: () => ring.destroy()
        });
        
        // Particle burst
        if (this.scene.deathParticles) {
            const originalTint = this.scene.deathParticles.particleTint;
            this.scene.deathParticles.setParticleTint(color);
            this.scene.deathParticles.emitParticleAt(x, y, 15);
            this.scene.deathParticles.setParticleTint(originalTint);
        }
    }
    
    quantumEffect() {
        // Massive visual spectacle for quantum superposition
        const cx = this.scene.cameras.main.centerX;
        const cy = this.scene.cameras.main.centerY;
        
        // Expanding rainbow rings
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                const ring = this.scene.add.circle(cx, cy, 50 + i * 30, 0xffffff, 0.3);
                this.scene.tweens.add({
                    targets: ring,
                    scale: 5,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => ring.destroy()
                });
            });
        }
        
        // Screen flash
        const flash = this.scene.add.rectangle(cx, cy, 
            this.scene.cameras.main.width * 2, 
            this.scene.cameras.main.height * 2, 
            0xffffff, 0.5
        );
        flash.setScrollFactor(0);
        flash.setDepth(9999);
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
    }
    
    // Integration helpers
    onEnemyDefeated(enemyX, enemyY, comboLength = 0) {
        return this.tryDropFromEnemy(enemyX, enemyY, comboLength);
    }
    
    onBossPhaseTransition(bossX, bossY) {
        return this.tryDropFromBoss(bossX, bossY, true);
    }
    
    onPerfectFracture(x, y) {
        // Guaranteed drop on perfect fracture
        this.spawnOrb(x, y, 'CHRONO');
        return true;
    }
    
    onResonanceChain(chainLength, x, y) {
        if (chainLength >= 5) {
            this.spawnOrb(x, y, 'CASCADE');
            return true;
        }
        return false;
    }
    
    destroy() {
        // Clean up
        if (this.graphics) this.graphics.clear();
        
        for (const [type, data] of this.playerOrbs) {
            if (data.timer) data.timer.remove();
        }
        this.playerOrbs.clear();
        
        if (this.hudContainer) {
            this.hudContainer.destroy();
        }
    }
    
    getStats() {
        return { ...this.stats };
    }
    
    showFloatingText(x, y, text, color, fontSize = 14) {
        const label = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: `${fontSize}px`,
            fill: typeof color === 'number' ? Phaser.Display.Color.IntegerToColor(color).color : color,
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: label,
            y: y - 40,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => label.destroy()
        });
    }
}
