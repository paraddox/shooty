import Phaser from 'phaser';
import Enemy from '../entities/Enemy.js';

/**
 * ApertureProtocolSystem — Attention Economy System
 * 
 * Uses UnifiedGraphicsManager with standard layers:
 * - 'effects' layer: Attention zones, resentment overlay, gaze trail, charge indicators
 * - 'ui' layer: Blink cooldown indicator
*
 * The 46th Cognitive Dimension: ATTENTION AS ONTOLOGY
 * 
 * The ultimate inversion. All previous systems respond to what you DO. 
 * The Aperture Protocol responds to where you LOOK.
 * === THE ATTENTION ECONOMY ===
 * 
 * Your gaze is a LIMITED RESOURCE. You cannot look everywhere. The mouse cursor
 * represents not just aim, but FOCUSED ATTENTION. Where you look:
 * 
 * 1. CHARGES entities (enemies become empowered by your attention)
 * 2. REVEALS secrets (only visible while looked at directly)
 * 3. CREATES gravity (bullets subtly curve toward your gaze)
 * 4. GENERATES spawns (danger accumulates in ignored areas)
 * 
 * === THE PARADOX OF ATTENTION ===
 * 
 * To aim at an enemy, you must look at it. But looking at it makes it stronger.
 * To avoid danger, you must look away. But looking away lets it grow unchecked.
 * 
 * This creates genuine TACTICAL ATTENTION MANAGEMENT:
 * - Glance quickly (charge minimal, gather information)
 * - Sustained focus (high charge, but precision aim)
 * - Peripheral vision (keep enemies at edge of screen, mid-charge)
 * - Deliberate ignorance (let zones fester to trigger spawn cascades)
 * 
 * === THE FOVEAL MECHANICS ===
 * 
 * The screen becomes a simulation of human vision:
 * 
 * | Zone | Distance from Cursor | Effect |
 * |------|---------------------|--------|
 * | Foveal | <100px | Full attention—entities empowered ×2, precision data |
 * | Parafoveal | 100-300px | Partial attention—normal behavior, vague data |
 * | Peripheral | 300-600px | Neglected—enemies charge slowly, spawns accumulate |
 * | Ignored | >600px | Forgotten—maximum danger, unknown unknowns |
 * 
 * === THE ATTENTION TAXONOMY ===
 * 
 * **Dwell Time**: How long you look at something
 *   - <200ms: Glance—minimal charge, information gain
 *   - 200ms-2s: Focus—moderate empowerment, targeting enabled
 *   - >2s: Fixation—maximum empowerment, but complete information
 * 
 * **Saccades**: How you move between targets
 *   - Rapid jumps: Disorienting to enemies, lower charge rates
 *   - Smooth pursuit: Predictable, higher charge but better tracking
 * 
 * **Attention Field**: What you see without looking directly
 *   - The 30° cone around your gaze gets partial effects
 *   - Forces "soft focus" gameplay—keeping multiple threats in periphery
 * 
 * === THE CHARGE MECHANIC ===
 * 
 * Every entity has an "Attention Charge" (0-100%):
 * 
 * - In Foveal zone: +5% charge per second looked at
 * - In Parafoveal: +1% charge per second
 * - In Peripheral: -0.5% charge (decays slowly)
 * - In Ignored: -1% charge BUT accumulates "Resentment"
 * 
 * At 100% charge, entities gain:
 * - ×1.5 speed
 * - ×1.5 damage
 * - New attack patterns (charged variants)
 * - Visual aura (Aperture Cyan glow)
 * 
 * At 100% "Resentment" (from being ignored), zones spawn:
 * - Ambush packs (enemies that were "forgotten")
 * - Attention Seekers (fast enemies that force you to look)
 * - Void Rifts (damage if you don't look at them)
 * 
 * === THE SACRIFICE PRINCIPLE ===
 * 
 * The Aperture Protocol introduces genuine LOSS into the game:
 * 
 * You CANNOT pay attention to everything. You MUST choose:
 * - Which enemies to empower by targeting
 * - Which zones to let fester
 * - Which bullets to track (others become peripheral dangers)
 * - When to close your eyes (literal blink mechanic—space to blink, resetting all charges)
 * 
 * === THE BLINK MECHANIC ===
 * 
 * Press [SPACE] to BLINK—a tactical choice:
 * - Clears ALL attention charges (enemies reset to base state)
 * - 0.3s "blind" period where you cannot see or attack
 * - Resets Resentment accumulation
 * - Triggers Saccade Burst (enemies disoriented for 1s)
 * - Cooldown: 5 seconds
 * 
 * Expert players use blinks to:
 * 1. Reset dangerous charges on bosses
 * 2. Clear resentment before ambush
 * 3. Create escape windows during bullet hell
 * 4. Force enemy repositioning
 * 
 * === THE INFORMATION PARADOX ===
 * 
 * Information itself becomes a cost:
 * 
 * - Enemy health bars only visible in Foveal zone
 * - Bullet trajectories only predicted in Parafoveal
 * - Spawn warnings only appear where you look
 * - True danger lies in what you cannot see
 * 
 * To know is to empower. To remain safe is to remain ignorant.
 * Knowledge is not just power—it's RISK.
 * 
 * === SYNERGIES WITH ALL 45 SYSTEMS ===
 * 
 * - Echo Storm: Echoes only visible in peripheral vision (glance to see, look to lose)
 * - Bootstrap Protocol: Future echoes appear where you DON'T look
 * - Recursion Engine: Analyzes your ATTENTION patterns, not just movement
 * - Synaesthesia: Audio cues guide attention—listen to know where to look
 * - Rhythm of the Void: Beat drops force attention shifts
 * - Observer Effect: The game watching you becomes the game guiding your gaze
 * - Nemesis Genesis: Nemesis spawns in most-ignored zone
 * - Oracle Protocol: Prophecies only visible while looking at them
 * - Mnemosyne Weave: Memory fragments require sustained attention to absorb
 * - Ambient Awareness: Time of day affects attention span (tired at night)
 * - Dissolution Protocol: Dissolving systems frees up "attention budget"
 * - Quantum Immortality: Death echoes visible only in peripheral after respawn
 * 
 * === THE 46TH DIMENSION ===
 * 
 * All previous dimensions exist in the DOING domain.
 * The Aperture Protocol exists in the PERCEIVING domain.
 * 
 * This is not just "look to aim"—it's "where attention flows, reality follows."
 * The game becomes a meditation on the nature of consciousness itself:
 * 
 * "I am not what I do. I am what I notice."
 * 
 * Color: Aperture Cyan (#00d4aa) — the color of focused attention,
 * distinct from player's Cyan (#00f0ff) and UI white.
 * 
 * "The eye is not a window but a lamp. It casts light upon what it gazes,
 * and what it ignores falls into shadow—not absence, but active neglect."
 * 
 * "To see is to change. To look away is to doom. The apocalypse is not 
 * coming—it is already here, in every corner you refuse to examine."
 */

export default class ApertureProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== GRAPHICS MANAGER =====
        this.graphicsManager = scene.graphicsManager;
        
        // ===== ATTENTION ZONES =====
        this.zones = {
            foveal: { radius: 100, chargeRate: 5, label: 'FOVEAL' },      // Direct focus
            parafoveal: { radius: 300, chargeRate: 1, label: 'PARAFOVEAL' }, // Soft focus  
            peripheral: { radius: 600, chargeRate: -0.5, label: 'PERIPHERAL' }, // Neglected
            ignored: { radius: Infinity, chargeRate: 0, label: 'IGNORED' }   // Forgotten
        };
        
        // ===== ATTENTION STATE =====
        this.attentionMap = new Map();      // entity -> attention data
        this.gazeHistory = [];              // Recent gaze positions for saccade detection
        this.currentGaze = { x: 0, y: 0 };  // Current mouse position (world space)
        this.gazeVelocity = 0;              // Speed of gaze movement
        this.isBlinking = false;            // During blink period
        this.blinkCooldown = 0;             // Time until next blink available
        this.blinkDuration = 300;           // ms of blindness
        this.blinkCooldownMax = 5000;         // ms between blinks
        
        // ===== RESENTMENT MECHANIC =====
        this.resentmentGrid = [];           // 8x6 grid of screen sectors
        this.resentmentDecay = 0.5;         // Resentment decay per second
        this.resentmentThreshold = 100;     // Spawn threshold
        this.gridCols = 8;
        this.gridRows = 6;
        this.initResentmentGrid();
        
        // ===== VISUAL SYSTEM =====
        this.APERTURE_CYAN = 0x00d4aa;
        this.APERTURE_GLOW = 0x00ffcc;
        this.RESENTMENT_RED = 0xff4444;
        this.FOVEAL_WHITE = 0xffffff;
        
        // MIGRATED: All graphics now use UnifiedGraphicsManager layers
        this.chargeIndicators = new Map();  // Visual charge bars on entities (layer refs)
        this.gazeTrail = [];                // Visual trail of recent gaze positions
        
        // ===== STATS =====
        this.stats = {
            totalDwellTime: 0,              // Total time looking at things
            saccadeCount: 0,                // Number of gaze jumps
            blinksUsed: 0,                  // Tactical blinks
            entitiesMaxCharged: 0,          // Peak attention investment
            resentmentCleared: 0,           // Resentment prevented
            informationSacrificed: 0        // Deliberate ignorance events
        };
        
        // ===== UI =====
        this.uiIndicator = null;
        this.blinkIndicator = null;
        this.attentionMeter = null;
        
        this.init();
    }
    
    init() {
        this.createVisualElements();
        this.setupInputTracking();
        this.createUI();
        this.startTracking();
    }
    
    createVisualElements() {
        // Uses standard UnifiedGraphicsManager layers:
        // - 'effects' for attention field, resentment overlay, gaze trail
        // - 'ui' for blink cooldown
        
        // Create attention charge particle texture
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(0, 212, 170, 0.6)');
        gradient.addColorStop(0.5, 'rgba(0, 212, 170, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 212, 170, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        this.scene.textures.addCanvas('attentionGlow', canvas);
        
        // Attention particles
        this.attentionParticles = this.scene.add.particles(0, 0, 'attentionGlow', {
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: { min: 10, max: 30 },
            lifespan: 400,
            frequency: -1
        });
    }
    
    setupInputTracking() {
        // Track mouse position for gaze
        this.scene.input.on('pointermove', (pointer) => {
            if (this.isBlinking) return;
            
            const camera = this.scene.cameras.main;
            const worldX = camera.scrollX + pointer.x / camera.zoom;
            const worldY = camera.scrollY + pointer.y / camera.zoom;
            
            // Calculate saccade velocity
            const dx = worldX - this.currentGaze.x;
            const dy = worldY - this.currentGaze.y;
            this.gazeVelocity = Math.sqrt(dx * dx + dy * dy);
            
            // Record saccade if jump is large
            if (this.gazeVelocity > 200) {
                this.stats.saccadeCount++;
                this.onSaccade();
            }
            
            this.currentGaze = { x: worldX, y: worldY };
            this.gazeHistory.push({ ...this.currentGaze, time: this.scene.time.now });
            
            // Keep history manageable
            if (this.gazeHistory.length > 60) {
                this.gazeHistory.shift();
            }
        });
        
        // Blink mechanic - spacebar
        this.scene.input.keyboard.on('keydown-SPACE', () => {
            this.attemptBlink();
        });
    }
    
    attemptBlink() {
        if (this.isBlinking || this.blinkCooldown > 0) return;
        
        this.executeBlink();
    }
    
    executeBlink() {
        this.isBlinking = true;
        this.stats.blinksUsed++;
        
        // Clear all attention charges
        this.attentionMap.forEach((data, entity) => {
            data.charge = 0;
            data.dwellTime = 0;
        });
        
        // Clear resentment
        let resentmentCleared = 0;
        for (let y = 0; y < this.gridRows; y++) {
            for (let x = 0; x < this.gridCols; x++) {
                resentmentCleared += this.resentmentGrid[y][x];
                this.resentmentGrid[y][x] = 0;
            }
        }
        this.stats.resentmentCleared += resentmentCleared;
        
        // Visual blink effect
        this.showBlinkEffect();
        
        // Saccade burst - disorient enemies
        this.scene.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                enemy.setVelocity(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 100
                );
            }
        });
        
        // End blink after duration
        this.scene.time.delayedCall(this.blinkDuration, () => {
            this.isBlinking = false;
        });
        
        // Start cooldown
        this.blinkCooldown = this.blinkCooldownMax;
    }
    
    showBlinkEffect() {
        // White flash
        const flash = this.scene.add.rectangle(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xffffff
        );
        flash.setScrollFactor(0);
        flash.setDepth(200);
        flash.alpha = 0.8;
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: this.blinkDuration,
            onComplete: () => flash.destroy()
        });
        
        // Blink announcement
        const blinkText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            'BLINK',
            {
                fontFamily: 'monospace',
                fontSize: '48px',
                fill: '#00d4aa',
                letterSpacing: 4
            }
        );
        blinkText.setScrollFactor(0);
        blinkText.setDepth(201);
        blinkText.setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: blinkText,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => blinkText.destroy()
        });
    }
    
    initResentmentGrid() {
        for (let y = 0; y < this.gridRows; y++) {
            this.resentmentGrid[y] = [];
            for (let x = 0; x < this.gridCols; x++) {
                this.resentmentGrid[y][x] = 0;
            }
        }
    }
    
    createUI() {
        const screenW = this.scene.cameras.main.width;
        const screenH = this.scene.cameras.main.height;
        
        // Blink cooldown indicator
        this.blinkIndicator = this.scene.add.container(screenW - 100, screenH - 80);
        this.blinkIndicator.setScrollFactor(0);
        this.blinkIndicator.setDepth(100);
        
        // Background
        const bg = this.scene.add.circle(0, 0, 25, 0x22222a, 0.8);
        bg.setStrokeStyle(2, 0x00d4aa);
        this.blinkIndicator.add(bg);
        
        // Icon
        this.blinkIcon = this.scene.add.text(0, 0, '◉', {
            fontFamily: 'monospace',
            fontSize: '20px',
            fill: '#00d4aa'
        }).setOrigin(0.5);
        this.blinkIndicator.add(this.blinkIcon);
        
        // Cooldown arc - MIGRATED: Uses UnifiedGraphicsManager layer created in createVisualElements()
        
        // Attention meter (showing how many entities are charged)
        this.attentionMeter = this.scene.add.text(screenW - 100, screenH - 40, 'APERTURE: 0%', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#00d4aa'
        });
        this.attentionMeter.setScrollFactor(0);
        this.attentionMeter.setDepth(100);
        this.attentionMeter.setOrigin(0.5);
    }
    
    startTracking() {
        // Update every frame
        this.scene.events.on('update', this.update, this);
    }
    
    update(time, delta) {
        if (!this.scene.gameActive) return;
        
        const dt = delta / 1000; // Convert to seconds
        
        // Update blink cooldown
        if (this.blinkCooldown > 0) {
            this.blinkCooldown = Math.max(0, this.blinkCooldown - delta);
            this.updateBlinkUI();
        }
        
        // During blink, skip all attention processing
        if (this.isBlinking) {
            return;
        }
        
        // Update attention for all entities
        this.updateEntityAttention(dt);
        
        // Update resentment grid
        this.updateResentment(dt);
        
        // Render visual elements
        this.renderAttentionField();
        this.renderResentmentOverlay();
        this.renderChargeIndicators();
        
        // Update UI
        this.updateUI();
    }
    
    updateEntityAttention(dt) {
        const enemies = this.scene.enemies.getChildren();
        let maxChargedCount = 0;
        let totalCharge = 0;
        
        enemies.forEach(enemy => {
            if (!enemy.active) {
                this.cleanupEntity(enemy);
                return;
            }
            
            const distance = Phaser.Math.Distance.Between(
                this.currentGaze.x, this.currentGaze.y,
                enemy.x, enemy.y
            );
            
            let data = this.attentionMap.get(enemy);
            if (!data) {
                data = {
                    charge: 0,
                    dwellTime: 0,
                    maxCharge: 100,
                    zone: 'ignored',
                    resentment: 0
                };
                this.attentionMap.set(enemy, data);
            }
            
            // Determine zone and charge rate
            let chargeRate = 0;
            let zone = 'ignored';
            
            if (distance < this.zones.foveal.radius) {
                zone = 'foveal';
                chargeRate = this.zones.foveal.chargeRate;
                data.dwellTime += dt;
                this.stats.totalDwellTime += dt;
            } else if (distance < this.zones.parafoveal.radius) {
                zone = 'parafoveal';
                chargeRate = this.zones.parafoveal.chargeRate;
            } else if (distance < this.zones.peripheral.radius) {
                zone = 'peripheral';
                chargeRate = this.zones.peripheral.chargeRate;
            }
            
            data.zone = zone;
            
            // Apply charge
            if (chargeRate > 0) {
                data.charge = Math.min(data.maxCharge, data.charge + chargeRate * dt);
            } else {
                data.charge = Math.max(0, data.charge + chargeRate * dt);
            }
            
            totalCharge += data.charge;
            if (data.charge >= 50) maxChargedCount++;
            
            // Apply charge effects to enemy
            this.applyChargeEffects(enemy, data);
            
            // Emit particles if in foveal
            if (zone === 'foveal' && Math.random() < 0.1) {
                this.attentionParticles.emitParticleAt(enemy.x, enemy.y);
            }
        });
        
        this.stats.entitiesMaxCharged = Math.max(this.stats.entitiesMaxCharged, maxChargedCount);
    }
    
    applyChargeEffects(enemy, data) {
        // Base tint reset
        enemy.clearTint();
        
        if (data.charge > 75) {
            // High charge - empowered enemy
            enemy.setTint(this.APERTURE_CYAN);
            if (!enemy.chargeBoosted) {
                enemy.speed *= 1.3;
                enemy.damageMultiplier = 1.5;
                enemy.chargeBoosted = true;
            }
        } else if (data.charge > 50) {
            // Medium charge - glowing
            enemy.setTint(this.APERTURE_GLOW);
            if (enemy.chargeBoosted) {
                enemy.speed /= 1.3;
                enemy.damageMultiplier = 1.0;
                enemy.chargeBoosted = false;
            }
        } else {
            // Low charge - normal
            if (enemy.chargeBoosted) {
                enemy.speed /= 1.3;
                enemy.damageMultiplier = 1.0;
                enemy.chargeBoosted = false;
            }
        }
        
        // Store charge for external systems
        enemy.attentionCharge = data.charge;
    }
    
    updateResentment(dt) {
        const worldWidth = 1920;
        const worldHeight = 1440;
        const cellW = worldWidth / this.gridCols;
        const cellH = worldHeight / this.gridRows;
        
        // Find which grid cell gaze is in
        const gazeCol = Math.floor(this.currentGaze.x / cellW);
        const gazeRow = Math.floor(this.currentGaze.y / cellH);
        
        // Build up resentment in ignored cells
        for (let y = 0; y < this.gridRows; y++) {
            for (let x = 0; x < this.gridCols; x++) {
                // Is this cell being looked at?
                const isWatched = (x === gazeCol && y === gazeRow) ||
                                  (Math.abs(x - gazeCol) <= 1 && Math.abs(y - gazeRow) <= 1);
                
                if (!isWatched) {
                    // Build resentment
                    this.resentmentGrid[y][x] += dt * 2; // 2% per second
                } else {
                    // Decay resentment
                    this.resentmentGrid[y][x] = Math.max(0, 
                        this.resentmentGrid[y][x] - this.resentmentDecay * dt * 10
                    );
                }
                
                // Check for spawn threshold
                if (this.resentmentGrid[y][x] >= this.resentmentThreshold) {
                    this.spawnResentmentEvent(x, y, cellW, cellH);
                    this.resentmentGrid[y][x] = 0; // Reset after spawn
                }
            }
        }
    }
    
    spawnResentmentEvent(col, row, cellW, cellH) {
        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;
        
        // Different spawn types based on resentment level
        const spawnType = Math.random();
        
        if (spawnType < 0.4) {
            // Ambush pack - 3 fast enemies
            for (let i = 0; i < 3; i++) {
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;
                const enemy = new Enemy(
                    this.scene, x + offsetX, y + offsetY, this.scene.player, 'fast'
                );
                enemy.speed *= 1.5;
                this.scene.enemies.add(enemy);
            }
        } else if (spawnType < 0.7) {
            // Attention Seeker - chases gaze
            const seeker = new Enemy(
                this.scene, x, y, this.scene.player, 'fast'
            );
            seeker.setTint(this.RESENTMENT_RED);
            this.scene.enemies.add(seeker);
        } else {
            // Void Rift - damages if not looked at
            this.createVoidRift(x, y);
        }
        
        // Announce
        this.showResentmentText(x, y);
    }
    
    createVoidRift(x, y) {
        const rift = this.scene.add.graphics();
        rift.x = x;
        rift.y = y;
        rift.setDepth(20);
        
        // Draw rift
        rift.fillStyle(this.RESENTMENT_RED, 0.3);
        rift.fillCircle(0, 0, 80);
        rift.lineStyle(2, this.RESENTMENT_RED, 0.8);
        rift.strokeCircle(0, 0, 80);
        
        // Animate
        this.scene.tweens.add({
            targets: rift,
            scale: 1.2,
            alpha: 0.6,
            duration: 1000,
            yoyo: true,
            repeat: 5,
            onComplete: () => rift.destroy()
        });
        
        // Damage player if they don't look at it
        let riftAge = 0;
        const riftEvent = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                if (!rift.active) return;
                
                riftAge += 0.1;
                const distToGaze = Phaser.Math.Distance.Between(
                    rift.x, rift.y, this.currentGaze.x, this.currentGaze.y
                );
                
                // If not looking at rift, damage player
                if (distToGaze > 150 && riftAge > 2) {
                    this.scene.player.takeDamage(5);
                    // Flash red
                    this.scene.cameras.main.flash(100, 255, 0, 0);
                }
            },
            repeat: 50
        });
    }
    
    showResentmentText(x, y) {
        const text = this.scene.add.text(x, y - 50, 'RESENTMENT MANIFESTS', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff4444',
            letterSpacing: 2
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }
    
    onSaccade() {
        // Saccade burst - brief confusion for enemies
        this.scene.enemies.getChildren().forEach(enemy => {
            if (enemy.active && Math.random() < 0.3) {
                enemy.setVelocity(
                    enemy.body.velocity.x * 0.5,
                    enemy.body.velocity.y * 0.5
                );
            }
        });
    }
    
    renderAttentionField() {
        if (!this.showDebug) return;
        
        const gazeX = this.currentGaze.x;
        const gazeY = this.currentGaze.y;
        
        this.graphicsManager.drawCircle('effects', gazeX, gazeY, this.zones.foveal.radius, {
            lineStyle: { width: 2, color: this.APERTURE_CYAN, alpha: 0.3 }
        });
        this.graphicsManager.drawCircle('effects', gazeX, gazeY, this.zones.parafoveal.radius, {
            lineStyle: { width: 1, color: this.APERTURE_GLOW, alpha: 0.2 }
        });
        this.graphicsManager.drawCircle('effects', gazeX, gazeY, this.zones.peripheral.radius, {
            lineStyle: { width: 1, color: 0x666666, alpha: 0.1 }
        });
    }
    
    renderResentmentOverlay() {
        const worldWidth = 1920;
        const worldHeight = 1440;
        const cellW = worldWidth / this.gridCols;
        const cellH = worldHeight / this.gridRows;
        
        for (let y = 0; y < this.gridRows; y++) {
            for (let x = 0; x < this.gridCols; x++) {
                const resentment = this.resentmentGrid[y][x];
                if (resentment > 20) {
                    const alpha = Math.min(0.3, resentment / 200);
                    this.graphicsManager.drawRect('effects', x * cellW, y * cellH, cellW, cellH, {
                        fillStyle: { color: this.RESENTMENT_RED, alpha: alpha }
                    });
                }
            }
        }
    }
    
    renderChargeIndicators() {
        // Clean up old indicators
        this.chargeIndicators.forEach((indicator, enemy) => {
            if (!enemy.active) {
                this.chargeIndicators.delete(enemy);
            }
        });
        
        // Update/create indicators for charged enemies
        this.attentionMap.forEach((data, enemy) => {
            if (!enemy.active) return;
            
            let indicator = this.chargeIndicators.get(enemy);
            
            if (data.charge > 0) {
                if (!indicator) {
                    indicator = { enemy };
                    this.chargeIndicators.set(enemy, indicator);
                }
                
                const radius = 25;
                const arcLength = (data.charge / 100) * Math.PI * 2;
                const color = data.charge > 75 ? this.APERTURE_CYAN : 
                             data.charge > 50 ? this.APERTURE_GLOW : 0x888888;
                
                // Background ring
                this.graphicsManager.drawCircle('effects', enemy.x, enemy.y - 40, radius, {
                    lineStyle: { width: 3, color: 0x333333, alpha: 0.5 }
                });
                // Charge arc (relative to enemy position)
                const centerX = enemy.x;
                const centerY = enemy.y - 40;
                const startAngle = -Math.PI / 2;
                const endAngle = startAngle + arcLength;
                // Draw arc as series of short lines
                const arcPoints = [];
                const segments = 20;
                for (let i = 0; i <= segments; i++) {
                    const angle = startAngle + (endAngle - startAngle) * (i / segments);
                    arcPoints.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius
                    });
                }
                for (let i = 0; i < arcPoints.length - 1; i++) {
                    this.graphicsManager.drawLine('effects', arcPoints[i].x, arcPoints[i].y, 
                        arcPoints[i+1].x, arcPoints[i+1].y, color, 0.8, 3);
                }
            } else if (indicator) {
                this.chargeIndicators.delete(enemy);
            }
        });
    }
    
    updateUI() {
        // Calculate average charge
        let totalCharge = 0;
        let count = 0;
        this.attentionMap.forEach((data) => {
            if (data.charge > 0) {
                totalCharge += data.charge;
                count++;
            }
        });
        
        const avgCharge = count > 0 ? Math.floor(totalCharge / count) : 0;
        this.attentionMeter.setText(`APERTURE: ${avgCharge}%`);
    }
    
    updateBlinkUI() {
        const pct = this.blinkCooldown / this.blinkCooldownMax;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (pct * Math.PI * 2);
        const indicatorX = this.blinkIndicator.x;
        const indicatorY = this.blinkIndicator.y;
        
        if (this.blinkCooldown > 0) {
            // Draw arc as series of short lines (since drawArc may not be available)
            const arcPoints = [];
            const segments = 20;
            for (let i = 0; i <= segments; i++) {
                const angle = startAngle + (endAngle - startAngle) * (i / segments);
                arcPoints.push({
                    x: indicatorX + Math.cos(angle) * 22,
                    y: indicatorY + Math.sin(angle) * 22
                });
            }
            for (let i = 0; i < arcPoints.length - 1; i++) {
                this.graphicsManager.drawLine('ui', arcPoints[i].x, arcPoints[i].y, 
                    arcPoints[i+1].x, arcPoints[i+1].y, 0x444444, 0.8, 4);
            }
        }
        
        // Update icon alpha
        if (this.blinkCooldown > 0) {
            this.blinkIcon.setAlpha(0.3);
        } else {
            this.blinkIcon.setAlpha(1);
        }
    }
    
    cleanupEntity(enemy) {
        this.attentionMap.delete(enemy);
        this.chargeIndicators.delete(enemy);
    }
    
    // ===== PUBLIC API =====
    
    getAttentionData(entity) {
        return this.attentionMap.get(entity);
    }
    
    isInFovealZone(entity) {
        const data = this.attentionMap.get(entity);
        return data && data.zone === 'foveal';
    }
    
    getCurrentGaze() {
        return { ...this.currentGaze };
    }
    
    getGazeVelocity() {
        return this.gazeVelocity;
    }
    
    canBlink() {
        return this.blinkCooldown <= 0 && !this.isBlinking;
    }
    
    getStats() {
        return { ...this.stats };
    }
    
    getResentmentAt(x, y) {
        const worldWidth = 1920;
        const worldHeight = 1440;
        const col = Math.floor(x / (worldWidth / this.gridCols));
        const row = Math.floor(y / (worldHeight / this.gridRows));
        
        if (row >= 0 && row < this.gridRows && col >= 0 && col < this.gridCols) {
            return this.resentmentGrid[row][col];
        }
        return 0;
    }
    
    // Toggle debug visualization
    toggleDebug() {
        this.showDebug = !this.showDebug;
    }
    
    destroy() {
        this.attentionParticles.destroy();
        this.blinkIndicator.destroy();
        this.attentionMeter.destroy();
        
        this.chargeIndicators.clear();
        
        this.scene.events.off('update', this.update, this);
    }
}
