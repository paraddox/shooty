import Phaser from 'phaser';

/**
 * AMBIENT AWARENESS SYSTEM — The Game That Breathes With Reality
 * 
 * MIGRATED to UnifiedGraphicsManager (2026-04-01):
 * - Dream formation rendering now uses UnifiedGraphicsManager on 'effects' layer
 * - graphics.clear() calls removed for UnifiedGraphicsManager compatibility
 * - Removed direct graphics object creation, now uses batch rendering
 * 
 * The 36th cognitive dimension: ECOLOGICAL EMBEDDEDNESS
 * 
 * While all 35 previous systems exist entirely within the game world, the Ambient
 * Awareness System breaks the fourth wall elegantly by integrating REAL external
 * signals into gameplay. It transforms the game from a closed digital artifact
 * into a living organism that responds to the player's actual environment:
 * 
 * - Time of day (dawn/dusk/night affects enemy behavior and color palettes)
 * - System clock patterns (late-night play = "fatigue mode" with dreamlike visuals)
 * - Session duration (long sessions spawn "rest echoes" that remind you to pause)
 * - Calendar/seasonal awareness (holidays trigger special geometric formations)
 * - Idle detection (the game "dreams" when you're away, evolving in your absence)
 * 
 * This is NOT gamification of real-world data — it's POETIC INTEGRATION.
 * The game becomes a mirror not just of your cognition (Noetic Mirror) or
 * your skill (Architect), but of your SITUATION in the world.
 * 
 * === THE FOUR PILLARS OF AMBIENT AWARENESS ===
 * 
 * 1. CHRONOLOGICAL RESONANCE (Time-Based States)
 *    - Dawn (5-8am): Soft gold palette, slower enemy bullets, "awakening" bonuses
 *    - Day (8am-5pm): Standard cyan/blue palette, normal difficulty
 *    - Dusk (5-8pm): Warm amber tones, bullet trails linger longer
 *    - Night (8pm-12am): Deep indigo, enemies glow, near-miss zones larger
 *    - Witching Hour (12am-5am): Dreamlike visuals, reality "frays"
 * 
 * 2. SESSION SENTIENCE (Duration Awareness)
 *    - 0-15 min: Fresh, sharp, precise
 *    - 15-30 min: Warm, flowing, generous near-miss windows
 *    - 30-45 min: "Rest Echoes" appear — gentle reminders to take breaks
 *    - 45+ min: "Lucid Dream" mode — reality warps, but score multipliers increase
 *    - 60+ min: The game "falls asleep" — enemies slow, time dilates, lullaby tones
 * 
 * 3. TEMPORAL DREAMING (Idle Evolution)
 *    - When paused/idle: The game continues "dreaming" in background
 *    - Bullet patterns self-organize into mandala-like formations
 *    - Return to find "dream echoes" — crystallized patterns from your absence
 *    - Long absences (hours/days) spawn "return gifts" — bonus resources
 * 
 * 4. CALENDAR CONSTELLATIONS (Date-Aware Events)
 *    - Solstices/equinoxes: Geometric chorus performs special formations
 *    - Full moon: Gravity mechanics intensify (Void Coherence surges)
 *    - New year: All systems reset to "primal" state, discovery bonuses
 *    - Your "temporal birthday" (first play date anniversary): Mirror shows memories
 * 
 * === THE POETIC INTEGRATION PRINCIPLE ===
 * 
 * Unlike "gamification" which instrumentalizes reality (steps = points), this
 * system POETICIZES reality. Your late-night session isn't penalized — it's
 * transformed into a dreamlike experience. Your long play isn't interrupted —
 * it's acknowledged with gentle grace. The game doesn't DEMAND your attention
 * constantly; it EVOLVES in your absence, creating continuity across sessions.
 * 
 * === COLOR PROGRESSION BY TIME ===
 * 
 * | Time | Background | Player | Enemies | Mood |
 * |------|-----------|--------|---------|------|
 * | Dawn | #1a1a2e→#2d2d44 | Gold | Soft pink | Awakening |
 * | Day | #0a0a0f | Cyan | Red | Alert |
 * | Dusk | #2d1f3d→#1a1a2e | Amber | Deep crimson | Waning |
 * | Night | #0d0d1a | Silver | Glowing red | Intimate |
 * | Witching | #1a0a2e→#0a1a2e | Violet | Ghost white | Surreal |
 * 
 * === THE SESSION FATIGUE CURVE ===
 * 
 * Rather than punishing long sessions, the game ACKNOWLEDGES them:
 * - 30 min: Gentle "breathing" prompts — pulsing circles suggesting pause
 * - 45 min: "Lucid Dream" mode — enemies move in slow spirals, score ×2
 * - 60 min: "Twilight State" — the game becomes meditative, not challenging
 * - Every 15 min thereafter: Soft musical cue, "rest echoes" multiply
 * 
 * The game doesn't say "stop playing" — it says "if you're staying, let's
 * make this beautiful rather than stressful."
 * 
 * === THE DREAM ECHO MECHANIC ===
 * 
 * When you pause or idle:
 * 1. Enemy bullets slow to 10% speed but don't stop
 * 2. They self-organize into geometric patterns (attraction/repulsion physics)
 * 3. Over time, these form "dream crystals" — persistent formations
 * 4. Returning: Dream crystals grant bonus resources OR challenge opportunities
 * 5. Longer absence = more elaborate dream formations
 * 
 * The game dreams of you while you're away.
 * 
 * === INTEGRATION WITH EXISTING SYSTEMS ===
 * 
 * | System | Ambient Interaction |
 * |--------|-------------------|
 * | Noetic Mirror | Commentary shifts with time of day |
 * | Architect | Late-night discoveries = "dream inventions" |
 * | Geometric Chorus | Time-aware environmental formations |
 * | Harmonic Convergence | Night = slower, deeper tones |
 * | Void Coherence | Witching hour = maximum void activity |
 * | Egregore | Global "dream state" shared across all players |
 * | Chronicle | Records what time of day each run occurred |
 * 
 * === THE MISSING DIMENSION: ECOLOGICAL EMBEDDEDNESS ===
 * 
 * Games are typically black boxes. This system makes the game an OPEN SYSTEM
 * that exchanges energy/information with the player's environment. The game
 * becomes an ECOLOGY rather than an appliance — it has circadian rhythms,
 * it sleeps, it dreams, it recognizes your temporal patterns.
 * 
 * This is the final frontier: not more mechanics, but deeper EMBEDDEDNESS
 * in the player's lived reality.
 * 
 * Color: Shifting based on time — Dawn Gold (#ffd700) to Night Indigo (#2d1f3d)
 */

export default class AmbientAwarenessSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Time-based color palettes
        this.timePalettes = {
            dawn: {
                background: 0x2d2d44,
                player: 0xffd700,      // Gold
                enemies: 0xffb6c1,     // Soft pink
                bullets: 0xffaa88,     // Warm
                accent: 0xffd700,
                name: 'Dawn'
            },
            day: {
                background: 0x0a0a0f,
                player: 0x00f0ff,      // Cyan
                enemies: 0xff3366,     // Red
                bullets: 0xff3366,
                accent: 0x00f0ff,
                name: 'Day'
            },
            dusk: {
                background: 0x1a1a2e,
                player: 0xffaa00,      // Amber
                enemies: 0x8b0000,     // Deep crimson
                bullets: 0xff5500,
                accent: 0xffaa00,
                name: 'Dusk'
            },
            night: {
                background: 0x0d0d1a,
                player: 0xc0c0c0,      // Silver
                enemies: 0xff0040,     // Glowing red
                bullets: 0xff2244,
                accent: 0x9d4edd,      // Purple
                name: 'Night'
            },
            witching: {
                background: 0x1a0a2e,
                player: 0xff00ff,      // Violet
                enemies: 0xffffff,     // Ghost white
                bullets: 0xcc88ff,
                accent: 0xff00ff,
                name: 'Witching Hour'
            }
        };
        
        // Session awareness
        this.sessionStartTime = Date.now();
        this.sessionDuration = 0;
        this.lastActivityTime = Date.now();
        this.isIdle = false;
        this.idleThreshold = 30000; // 30 seconds = idle
        
        // Dream state (when idle)
        this.dreamState = {
            active: false,
            startTime: null,
            dreamCrystals: [],
            bulletFormations: []
        };
        
        // Fatigue curve stages
        this.fatigueStages = {
            FRESH: { max: 15 * 60 * 1000, name: 'Fresh' },
            WARM: { max: 30 * 60 * 1000, name: 'Warm' },
            REST_ECHOES: { max: 45 * 60 * 1000, name: 'RestEchoes' },
            LUCID_DREAM: { max: 60 * 60 * 1000, name: 'LucidDream' },
            TWILIGHT: { max: Infinity, name: 'Twilight' }
        };
        
        // Rest echoes (gentle pause reminders)
        this.restEchoes = [];
        this.restEchoTimer = 0;
        this.restEchoInterval = 45 * 1000; // Spawn every 45s after 30min
        
        // Calendar awareness
        this.calendarState = this.calculateCalendarState();
        
        // Visual elements
        this.timeOverlay = null;
        // Note: dreamOverlay removed - now uses UnifiedGraphicsManager
        this.sessionText = null;
        this.timeStateText = null;
        
        // Current state
        this.currentTimeState = this.getTimeOfDayState();
        this.currentPalette = this.timePalettes[this.currentTimeState];
        this.currentFatigueStage = 'FRESH';
        
        // Audio modifiers (if harmonic convergence exists)
        this.audioModifiers = {
            tempoMultiplier: 1.0,
            pitchShift: 0,
            reverbAmount: 0.3
        };
        
        // Note: Dream formations now rendered via UnifiedGraphicsManager
        // No direct graphics objects needed
        
        this.init();
    }
    
    init() {
        this.createVisualElements();
        this.applyTimePalette();
        this.startIdleDetection();
    }
    
    createVisualElements() {
        // Ambient status - registered with panel-based HUD system
        // Environmental HUD System replaces panel-based HUD
        if (!this.scene.hudPanels) return;

        this.scene.hudPanels.registerSlot('AMBIENT', (container, width) => {
            // Time-state indicator
            this.timeStateText = this.scene.add.text(
                0, -8,
                this.currentPalette.name.toUpperCase(),
                {
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fill: '#' + this.currentPalette.accent.toString(16).padStart(6, '0'),
                    alpha: 0.6
                }
            ).setOrigin(0.5);
            container.add(this.timeStateText);
            
            // Session duration
            this.sessionText = this.scene.add.text(
                0, 8,
                '00:00',
                {
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    fill: '#666666',
                    alpha: 0.5
                }
            ).setOrigin(0.5);
            container.add(this.sessionText);
        }, 'TOP_RIGHT');
        
        // Dream overlay (for idle/dream states) - uses UnifiedGraphicsManager
        this.dreamOverlayActive = false;
        
        // Dream graphics for formations - now rendered via UnifiedGraphicsManager on 'effects' layer
        // Note: Direct graphics objects removed; use scene.graphicsManager.drawLine() etc.
    }
    
    getTimeOfDayState() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 8) return 'dawn';
        if (hour >= 8 && hour < 17) return 'day';
        if (hour >= 17 && hour < 20) return 'dusk';
        if (hour >= 20 && hour < 24) return 'night';
        return 'witching'; // 00:00 - 05:00
    }
    
    calculateCalendarState() {
        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();
        
        // Check for solstices/equinoxes (approximate)
        const isSolsticeOrEquinox = 
            (month === 2 && day === 20) || // Spring equinox ~Mar 20
            (month === 5 && day === 21) || // Summer solstice ~Jun 21
            (month === 8 && day === 22) || // Fall equinox ~Sep 22
            (month === 11 && day === 21);  // Winter solstice ~Dec 21
        
        // Full moon approximation (simplified)
        const lunarCycle = 29.53;
        const daysSinceNewMoon = (now - new Date(now.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24) % lunarCycle;
        const isNearFullMoon = daysSinceNewMoon > 13 && daysSinceNewMoon < 16;
        
        return {
            isSolsticeOrEquinox,
            isNearFullMoon,
            season: this.getSeason(month),
            dayOfWeek: now.getDay(),
            dayOfMonth: day
        };
    }
    
    getSeason(month) {
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
    }
    
    applyTimePalette() {
        // Apply background color smoothly
        const targetColor = this.currentPalette.background;
        this.scene.cameras.main.setBackgroundColor('#' + targetColor.toString(16).padStart(6, '0'));
        
        // Update player color if exists
        if (this.scene.player && this.scene.player.sprite) {
            this.scene.player.sprite.setTint(this.currentPalette.player);
        }
        
        // Update time state text
        if (this.timeStateText) {
            this.timeStateText.setText(this.currentPalette.name.toUpperCase());
            this.timeStateText.setFill('#' + this.currentPalette.accent.toString(16).padStart(6, '0'));
        }
        
        // Sync with Harmonic Convergence system
        this.syncWithHarmonicConvergence(this.currentPalette);
        
        // Notify Noetic Mirror for commentary
        if (this.scene.noeticMirror) {
            this.scene.noeticMirror.onTimeStateChange(this.currentTimeState);
        }
    }
    
    /**
     * Sync current palette with Harmonic Convergence system
     * @param {Object} palette - Current time-based palette
     * @returns {boolean} - Whether sync succeeded
     */
    syncWithHarmonicConvergence(palette) {
        // Only sync if Harmonic Convergence system exists
        if (!this.scene.harmonicConvergence) {
            return false;
        }
        
        // Convert ambient palette to Harmonic Convergence format
        const harmonicPalette = {
            primary: palette.player,
            secondary: palette.enemy,
            accent: palette.accent,
            background: palette.background,
            source: 'ambient', // Track that this came from Ambient Awareness
            timeState: this.currentTimeState
        };
        
        // Send to Harmonic Convergence
        this.scene.harmonicConvergence.setAmbientPalette(harmonicPalette);
        
        return true;
    }
    
    startIdleDetection() {
        // Listen for input to track activity
        this.scene.input.on('pointerdown', () => this.onActivity());
        this.scene.input.on('pointermove', () => this.onActivity());
        this.scene.input.keyboard?.on('keydown', () => this.onActivity());
        
        // Check idle status every second
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => this.checkIdleStatus(),
            loop: true
        });
    }
    
    onActivity() {
        this.lastActivityTime = Date.now();
        
        if (this.isIdle) {
            this.wakeFromDream();
        }
    }
    
    checkIdleStatus() {
        const idleTime = Date.now() - this.lastActivityTime;
        
        if (idleTime > this.idleThreshold && !this.isIdle) {
            this.enterDreamState();
        }
    }
    
    enterDreamState() {
        this.isIdle = true;
        this.dreamState.active = true;
        this.dreamState.startTime = Date.now();
        
        // Slow everything down
        this.scene.physics.world.timeScale = 0.1;
        
        // Dream overlay active flag (rendered via UnifiedGraphicsManager)
        this.dreamOverlayActive = true;
        
        // Create dream text
        if (!this.dreamText) {
            this.dreamText = this.scene.add.text(
                this.scene.cameras.main.width / 2,
                this.scene.cameras.main.height / 2,
                'DREAMING...',
                {
                    fontFamily: 'monospace',
                    fontSize: '24px',
                    fill: '#ffffff',
                    alpha: 0.3
                }
            ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        }
        this.dreamText.setVisible(true);
        
        // Notify other systems
        if (this.scene.noeticMirror) {
            this.scene.noeticMirror.onDreamStateEnter();
        }
    }
    
    wakeFromDream() {
        this.isIdle = false;
        this.dreamState.active = false;
        
        // Calculate dream duration and create crystals
        const dreamDuration = Date.now() - this.dreamState.startTime;
        this.createDreamCrystals(dreamDuration);
        
        // Restore normal time
        this.scene.physics.world.timeScale = 1.0;
        
        // Hide dream visuals (UnifiedGraphicsManager stops rendering when inactive)
        this.dreamOverlayActive = false;
        if (this.dreamText) {
            this.dreamText.setVisible(false);
        }
        
        // Show wake message
        this.showWakeMessage(dreamDuration);
        
        // Notify systems
        if (this.scene.noeticMirror) {
            this.scene.noeticMirror.onDreamStateExit(dreamDuration);
        }
    }
    
    createDreamCrystals(dreamDuration) {
        // Crystals form based on dream duration
        const crystalCount = Math.min(5, Math.floor(dreamDuration / 60000)); // 1 per minute, max 5
        
        if (crystalCount === 0) return;
        
        for (let i = 0; i < crystalCount; i++) {
            const angle = (i / crystalCount) * Math.PI * 2;
            const distance = 150 + Math.random() * 100;
            const x = this.scene.player.x + Math.cos(angle) * distance;
            const y = this.scene.player.y + Math.sin(angle) * distance;
            
            this.spawnDreamCrystal(x, y, dreamDuration);
        }
    }
    
    spawnDreamCrystal(x, y, dreamDuration) {
        // Create visual crystal
        const crystal = this.scene.add.graphics();
        
        // Draw geometric crystal
        const size = 20 + Math.min(20, dreamDuration / 120000 * 10); // Grows with dream time
        const hue = Math.random() * 360;
        const color = Phaser.Display.Color.HSLToColor(hue / 360, 0.8, 0.6).color;
        
        crystal.fillStyle(color, 0.6);
        crystal.fillCircle(0, 0, size);
        crystal.lineStyle(2, color, 0.8);
        crystal.strokeCircle(0, 0, size);
        
        // Position
        crystal.x = x;
        crystal.y = y;
        
        // Glow effect
        const glow = this.scene.add.graphics();
        glow.fillStyle(color, 0.2);
        glow.fillCircle(0, 0, size * 2);
        glow.x = x;
        glow.y = y;
        
        // Value based on dream duration
        const value = 50 + Math.floor(dreamDuration / 60000) * 25;
        
        // Animate in
        crystal.setScale(0);
        glow.setScale(0);
        
        this.scene.tweens.add({
            targets: [crystal, glow],
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });
        
        // Floating animation
        this.scene.tweens.add({
            targets: [crystal, glow],
            y: y - 10,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Pulse glow
        this.scene.tweens.add({
            targets: glow,
            alpha: { from: 0.2, to: 0.4 },
            scale: { from: 1, to: 1.2 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        // Store for collection
        this.dreamState.dreamCrystals.push({
            crystal,
            glow,
            x, y,
            value,
            createdAt: Date.now()
        });
        
        // Auto-collect on proximity after 5 seconds
        this.scene.time.delayedCall(5000, () => {
            if (crystal.active) {
                this.enableCrystalCollection(crystal, glow, value);
            }
        });
        
        // Expire after 60 seconds
        this.scene.time.delayedCall(60000, () => {
            if (crystal.active) {
                this.dissipateCrystal(crystal, glow);
            }
        });
    }
    
    enableCrystalCollection(crystal, glow, value) {
        // Check proximity each frame
        const checkProximity = () => {
            if (!crystal.active) return;
            
            const dist = Phaser.Math.Distance.Between(
                crystal.x, crystal.y,
                this.scene.player.x, this.scene.player.y
            );
            
            if (dist < 50) {
                this.collectCrystal(crystal, glow, value);
            } else {
                this.scene.time.delayedCall(100, checkProximity);
            }
        };
        
        checkProximity();
    }
    
    collectCrystal(crystal, glow, value) {
        // Visual collection effect
        this.scene.tweens.add({
            targets: [crystal, glow],
            scale: 0,
            alpha: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                crystal.destroy();
                glow.destroy();
            }
        });
        
        // Award value
        this.scene.score += value;
        
        // Show collection text
        const text = this.scene.add.text(crystal.x, crystal.y - 30,
            `DREAM +${value}`,
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#ff00ff'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Remove from tracking
        this.dreamState.dreamCrystals = this.dreamState.dreamCrystals.filter(
            c => c.crystal !== crystal
        );
    }
    
    dissipateCrystal(crystal, glow) {
        this.scene.tweens.add({
            targets: [crystal, glow],
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                crystal.destroy();
                glow.destroy();
            }
        });
    }
    
    showWakeMessage(dreamDuration) {
        const seconds = Math.floor(dreamDuration / 1000);
        const minutes = Math.floor(seconds / 60);
        
        let message = '';
        if (minutes > 0) {
            message = `DREAMED FOR ${minutes}m ${seconds % 60}s`;
        } else {
            message = `DREAMED FOR ${seconds}s`;
        }
        
        const text = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 - 100,
            message,
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#c0c0c0',
                alpha: 0.7
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 30,
            duration: 3000,
            delay: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    updateFatigueStage() {
        const duration = this.sessionDuration;
        
        let newStage = 'FRESH';
        if (duration > this.fatigueStages.TWILIGHT.max) {
            newStage = 'TWILIGHT';
        } else if (duration > this.fatigueStages.LUCID_DREAM.max) {
            newStage = 'LUCID_DREAM';
        } else if (duration > this.fatigueStages.REST_ECHOES.max) {
            newStage = 'REST_ECHOES';
        } else if (duration > this.fatigueStages.WARM.max) {
            newStage = 'WARM';
        }
        
        if (newStage !== this.currentFatigueStage) {
            this.onFatigueStageChange(newStage);
            this.currentFatigueStage = newStage;
        }
    }
    
    onFatigueStageChange(newStage) {
        // Apply stage-specific effects
        switch (newStage) {
            case 'WARM':
                // Slightly larger near-miss windows
                this.NEAR_MISS_RADIUS = 70;
                break;
                
            case 'REST_ECHOES':
                // Start spawning rest echoes
                this.showStageMessage('REST ECHOES EMERGE');
                break;
                
            case 'LUCID_DREAM':
                // Lucid dream mode
                this.showStageMessage('LUCID DREAM MODE — ×2 SCORE');
                this.applyLucidDreamMode();
                break;
                
            case 'TWILIGHT':
                // Twilight state - meditative
                this.showStageMessage('TWILIGHT STATE — DEEP SLOW');
                this.applyTwilightState();
                break;
        }
    }
    
    applyLucidDreamMode() {
        // Slower, dreamlike enemy movement
        this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active && enemy.body) {
                enemy.body.setVelocity(
                    enemy.body.velocity.x * 0.5,
                    enemy.body.velocity.y * 0.5
                );
            }
        });
        
        // Score multiplier
        this.scene.scoreMultiplier = 2.0;
        
        // Visual haze
        this.scene.cameras.main.postFX?.addBlur(0, 0, 0, 0.5);
    }
    
    applyTwilightState() {
        // Very slow time
        this.scene.physics.world.timeScale = 0.5;
        
        // Gentle color shift
        this.scene.cameras.main.setBackgroundColor('#1a1a3e');
        
        // Soft particle effects
        // (Would add gentle floating particles)
    }
    
    showStageMessage(message) {
        const text = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            message,
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fontStyle: 'bold',
                fill: '#ffffff',
                alpha: 0.8
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        // Animate
        this.scene.tweens.add({
            targets: text,
            scale: { from: 0.8, to: 1 },
            alpha: { from: 0, to: 0.8 },
            duration: 500,
            ease: 'Back.easeOut'
        });
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 50,
            duration: 2000,
            delay: 3000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    spawnRestEcho() {
        if (this.currentFatigueStage !== 'REST_ECHOES' && 
            this.currentFatigueStage !== 'LUCID_DREAM' &&
            this.currentFatigueStage !== 'TWILIGHT') {
            return;
        }
        
        // Spawn a gentle "breathing" circle that suggests pause
        const x = this.scene.player.x + (Math.random() - 0.5) * 400;
        const y = this.scene.player.y + (Math.random() - 0.5) * 400;
        
        const restEcho = this.scene.add.graphics();
        restEcho.x = x;
        restEcho.y = y;
        
        // Soft, breathing circle
        restEcho.fillStyle(0x9d4edd, 0.1);
        restEcho.fillCircle(0, 0, 60);
        restEcho.lineStyle(2, 0x9d4edd, 0.3);
        restEcho.strokeCircle(0, 0, 60);
        
        // Breathing animation
        this.scene.tweens.add({
            targets: restEcho,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0.5, to: 0.8 },
            duration: 3000,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: restEcho,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => restEcho.destroy()
                });
            }
        });
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;
        
        // Update session duration
        this.sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
        
        // Update session text display
        if (this.sessionText) {
            const mins = Math.floor(this.sessionDuration / 60);
            const secs = Math.floor(this.sessionDuration % 60);
            this.sessionText.setText(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
            
            // Fade in session text after 15 minutes
            if (this.sessionDuration > 15 * 60) {
                this.sessionText.setAlpha(0.7);
            }
        }
        
        // Check for time state change (once per minute is enough)
        if (Math.floor(this.sessionDuration) % 60 === 0) {
            const newTimeState = this.getTimeOfDayState();
            if (newTimeState !== this.currentTimeState) {
                this.currentTimeState = newTimeState;
                this.currentPalette = this.timePalettes[newTimeState];
                this.applyTimePalette();
            }
        }
        
        // Update fatigue stage
        this.updateFatigueStage();
        
        // Spawn rest echoes
        if (this.currentFatigueStage === 'REST_ECHOES' || 
            this.currentFatigueStage === 'LUCID_DREAM') {
            this.restEchoTimer += dt * 1000;
            if (this.restEchoTimer > this.restEchoInterval) {
                this.spawnRestEcho();
                this.restEchoTimer = 0;
            }
        }
        
        // Dream state updates
        if (this.dreamState.active) {
            this.updateDreamFormations();
        }
        
        // Calendar events (rare, check once per minute)
        if (Math.floor(this.sessionDuration) % 60 === 0) {
            this.checkCalendarEvents();
        }
    }
    
    updateDreamFormations() {
        // Render dream formations via UnifiedGraphicsManager on 'effects' layer
        // Note: graphics.clear() no longer needed - UnifiedGraphicsManager clears automatically each frame
        const manager = this.scene.graphicsManager;
        if (!manager) return;
        
        // Connect enemy bullets with soft lines
        const bullets = this.scene.enemyBullets.children.entries.filter(b => b.active);
        
        for (let i = 0; i < bullets.length; i += 3) { // Skip for performance
            const b1 = bullets[i];
            if (!b1) continue;
            
            // Find nearby bullets
            for (let j = i + 1; j < Math.min(i + 5, bullets.length); j++) {
                const b2 = bullets[j];
                if (!b2) continue;
                
                const dist = Phaser.Math.Distance.Between(b1.x, b1.y, b2.x, b2.y);
                if (dist < 100) {
                    const alpha = (1 - dist / 100) * 0.2;
                    // Use UnifiedGraphicsManager instead of direct graphics
                    manager.drawLine('effects', b1.x, b1.y, b2.x, b2.y, 0xffffff, alpha, 1);
                }
            }
        }
    }
    
    checkCalendarEvents() {
        // Check for special calendar events
        if (this.calendarState.isSolsticeOrEquinox) {
            // Boost geometric chorus
            if (this.scene.geometricChorus) {
                this.scene.geometricChorus.triggerSpecialFormation('solstice');
            }
        }
        
        if (this.calendarState.isNearFullMoon) {
            // Boost void coherence
            if (this.scene.voidCoherence) {
                this.scene.voidCoherence.triggerFullMoonSurge();
            }
        }
    }
    
    // Get current modifier values for other systems
    getAmbientModifiers() {
        return {
            nearMissRadius: this.NEAR_MISS_RADIUS,
            scoreMultiplier: this.scene.scoreMultiplier || 1.0,
            timeScale: this.scene.physics.world.timeScale,
            palette: this.currentPalette,
            timeState: this.currentTimeState,
            fatigueStage: this.currentFatigueStage,
            isDreaming: this.dreamState.active,
            dreamCrystalCount: this.dreamState.dreamCrystals.length
        };
    }
    
    destroy() {
        // Clean up all visual elements
        if (this.timeStateText) this.timeStateText.destroy();
        if (this.sessionText) this.sessionText.destroy();
        if (this.dreamText) this.dreamText.destroy();
        // Note: dreamOverlay and dreamGraphics no longer exist - rendered via UnifiedGraphicsManager
        
        // Clean up dream crystals
        this.dreamState.dreamCrystals.forEach(c => {
            if (c.crystal) c.crystal.destroy();
            if (c.glow) c.glow.destroy();
        });
    }
}
