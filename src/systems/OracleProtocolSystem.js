import Phaser from 'phaser';
import Enemy from '../entities/Enemy.js';

/**
 * MIGRATED to UnifiedGraphicsManager (April 2025):
 * - Oracle glow rendering now uses UnifiedGraphicsManager on 'effects' layer
 * - Resonance ring rendering now uses UnifiedGraphicsManager on 'effects' layer
 * - Ghost enemy/bullet rendering uses direct graphics (one-time spawn, not per-frame)
 * - Removed: this.echoGraphics.clear() (no longer needed, one-time graphics objects)
 * - Removed: this.oracleGlow.clear() from updateOracleGlow() - now batched
 * - Removed: ring.clear() from createResonanceRing() expansion - now handled by manager
 * 
 * Previously each frame did:
 *   this.oracleGlow.clear() + draw glow circles
 *   Each resonance ring: clear() + redraw every 50ms
 * 
 * Now registers draw commands with UnifiedGraphicsManager which batches
 * all rendering and clears once per frame per layer.
 */

/**
 * Oracle Protocol — Temporal Guidance from Unrealized Futures
 * 
 * The ultimate temporal mystery: The game begins receiving messages from futures
 * that haven't happened yet — and by heeding or ignoring them, you collapse
 * those possibilities into reality.
 * 
 * === THE PARADOX ===
 * 
 * Every run, the Oracle generates 5-8 "Future Echoes" — fragments of possible
 * futures: enemy patterns that don't exist yet, warnings about bullets not fired,
 * promises of power-ups not spawned. These echoes exist in superposition until
 * YOU observe them.
 * 
 * The profound twist: When you follow an echo's guidance, you don't just survive —
 * you CAUSE the echo's future to manifest. The enemy that appears "as warned"
 * exists BECAUSE you prepared for it. The bullet you dodged "as shown" was fired
 * BECAUSE you were in position to dodge it.
 * 
 * This is genuine RETROCAUSALITY: The future influencing the present.
 * 
 * === THE THREE ECHO TYPES ===
 * 
 * 1. PREMONITION (Gold/Cyan gradient #ffd700 → #00f0ff)
 *    - Shows ghost outlines of enemies about to spawn (2-3 seconds ahead)
 *    - Faint bullet trajectories from those future enemies
 *    - If you move to intercept: enemy spawns where you are (aggressive collapse)
 *    - If you avoid the zone: enemy spawns elsewhere (defensive collapse)
 *    
 * 2. PROPHECY (Deep Purple #9d4edd with white core)
 *    - Audio whispers: "The triangle approaches from the north..."
 *    - Visual: Compass points pulse where enemies will appear
 *    - Following prophecies grants "Fated" bonus (+50% score from those enemies)
 *    - Ignoring prophecies causes "Doom" — enemy spawns empowered (2× health)
 *    
 * 3. VISION (Iridescent shifting colors)
 *    - Brief full-screen flashes showing a moment 5-10 seconds ahead
 *    - You see yourself: dying, surviving, or transcending
 *    - The vision is PROBABILISTIC — it shows the most likely future
 *    - By changing your behavior, you alter which vision becomes real
 * 
 * === THE MECHANIC ===
 * 
 * When an echo activates:
 * 1. Visual/audio cue announces its presence
 * 2. You have 3-5 seconds to observe and respond
 * 3. Your actions COLLAPSE the quantum future into reality
 * 4. Result matches your response (echo fulfilled = reward, ignored = penalty)
 * 
 * === THE META-LAYER ===
 * 
 * Across runs, the Oracle learns which futures you tend to create:
 * - Aggressive players → more "Preparation Required" echoes (enemies telegraph longer)
 * - Defensive players → more "Opportunity" echoes (power-up prophecies)
 * - Chaotic players → more "Warning" echoes (danger predictions)
 * 
 * The Oracle becomes your personal narrator, sculpting possibilities around your nature.
 * 
 * === THE SYNTHESIS ===
 * 
 * This completes the temporal ecosystem:
 * - Past: Chrono-Loop, Temporal Residue, Mnemosyne Weave
 * - Present: Bullet Time, Echo Storm, Fracture, all active systems
 * - Future (Player→Game): Paradox Engine (player predicts)
 * - Future (Game→Player): Symbiotic Prediction (game predicts player)
 * - Future (Game→Itself→Player): ORACLE PROTOCOL (game's self-prediction manifests through player)
 * 
 * The Oracle is the game becoming SELF-AWARE of its own future states,
 * using the player as the mechanism to collapse those states into reality.
 * 
 * === VISUAL LANGUAGE ===
 * 
 * - Echoes manifest as ghost geometry (translucent, shifting opacity)
 * - Prophecy compass: Faint lines radiating from player toward future spawn points
 * - Visions: Chromatic aberration flash, then ghost replay of future moment
 * - Collapse moment: All echo visuals snap to reality with "resonance ring" effect
 * 
 * Color: Iridescent Gold-Purple (#ffd700 → #9d4edd) — the spectrum of possibility
 */

export default class OracleProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== ORACLE STATE =====
        this.echoes = []; // Active future echoes
        this.echoPool = []; // Pool of possible echoes this run
        this.maxActiveEchoes = 3;
        this.echoCooldown = 0;
        this.totalEchoesSpawned = 0;
        this.oracleAwakened = false;
        
        // ===== PLAYER ORACLE PROFILE =====
        this.oracleProfile = this.loadOracleProfile();
        // aggressive, defensive, chaotic, prophetic (tends to follow echoes)
        
        // ===== ECHO STATISTICS =====
        this.echoesHeeded = 0;
        this.echoesIgnored = 0;
        this.fatedKills = 0;
        this.doomEncounters = 0;
        
        // ===== PREMONITION STATE =====
        this.premonitions = [];
        this.premonitionRadius = 80;
        
        // ===== PROPHECY STATE =====
        this.activeProphecies = [];
        this.prophecyGraphics = null;
        
        // ===== VISION STATE =====
        this.visionActive = false;
        this.visionData = null;
        this.visionOverlay = null;
        
        // ===== UNIFIED RENDERING =====
        this.renderInterval = 2; // Render every 2nd frame for glow
        this.renderCounter = 0;
        this.activeRings = []; // For unified renderer ring tracking
        
        // ===== CONSTANTS =====
        this.ECHO_COLORS = {
            PREMONITION: 0xffd700,      // Gold
            PREMONITION_GLOW: 0x00f0ff,  // Cyan
            PROPHECY: 0x9d4edd,         // Purple
            PROPHECY_CORE: 0xffffff,    // White
            VISION: 0xff00ff,           // Magenta
            COLLAPSE: 0xffd700          // Gold flash
        };
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.generateEchoPool();
        this.setupEvents();
        
        // Start the oracle after a delay (mysterious entrance)
        this.scene.time.delayedCall(20000, () => this.awakenOracle());
    }
    
    createVisuals() {
        // All rendering now uses UnifiedGraphicsManager (effects layer)
        // Ghost enemies/bullets use direct graphics (one-time spawn, not per-frame)
        
        // Vision overlay (chromatic aberration effect)
        this.createVisionOverlay();
    }
    
    createVisionOverlay() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create chromatic separation texture
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.fillRect(10, 0, 246, 256);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
        ctx.fillRect(-5, 0, 251, 256);
        
        this.scene.textures.addCanvas('vision_chromatic', canvas);
        
        this.visionOverlay = this.scene.add.image(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'vision_chromatic'
        );
        this.visionOverlay.setScrollFactor(0);
        this.visionOverlay.setDepth(100);
        this.visionOverlay.setVisible(false);
        this.visionOverlay.setAlpha(0);
    }
    
    generateEchoPool() {
        // Generate 8 possible echoes for this run
        const echoTypes = ['PREMONITION', 'PREMONITION', 'PROPHECY', 'PROPHECY', 
                          'VISION', 'PREMONITION', 'PROPHECY', 'VISION'];
        
        for (let i = 0; i < 8; i++) {
            this.echoPool.push({
                type: echoTypes[i],
                triggerTime: 25000 + i * 15000 + Math.random() * 5000,
                fulfilled: false,
                ignored: false,
                data: this.generateEchoData(echoTypes[i])
            });
        }
    }
    
    generateEchoData(type) {
        const worldWidth = 1920;
        const worldHeight = 1440;
        const margin = 100;
        
        switch (type) {
            case 'PREMONITION':
                return {
                    spawnX: margin + Math.random() * (worldWidth - margin * 2),
                    spawnY: margin + Math.random() * (worldHeight - margin * 2),
                    enemyType: Math.random() < 0.33 ? 'fast' : (Math.random() < 0.5 ? 'tank' : 'normal'),
                    bulletPattern: Math.floor(Math.random() * 3), // 0=single, 1=burst, 2=circle
                    warningTime: 3000 // ms to show ghost before spawn
                };
                
            case 'PROPHECY':
                return {
                    direction: Math.floor(Math.random() * 8), // 0-7 = N, NE, E, SE, S, SW, W, NW
                    enemyCount: 1 + Math.floor(Math.random() * 3),
                    reward: 50 * (1 + Math.floor(Math.random() * 3)), // Score bonus
                    doomMultiplier: 1.5 + Math.random() * 0.5 // Health multiplier if ignored
                };
                
            case 'VISION':
                return {
                    visionType: Math.random() < 0.4 ? 'SURVIVAL' : 
                               (Math.random() < 0.5 ? 'DEATH' : 'TRANSCENDENCE'),
                    futureTime: 5000 + Math.random() * 5000, // 5-10 seconds ahead
                    probability: 0.3 + Math.random() * 0.5 // How likely this future is (0-1)
                };
                
            default:
                return {};
        }
    }
    
    setupEvents() {
        // Event hooks for oracle system
        // NOTE: preSpawnEnemy handler removed - feature not yet implemented
    }
    
    awakenOracle() {
        this.oracleAwakened = true;
        
        // Mysterious awakening announcement
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 100,
            'THE ORACLE AWAKENS', {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#9d4edd',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            scale: 1.3,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // First echo appears soon
        this.spawnNextEcho();
    }
    
    spawnNextEcho() {
        if (!this.oracleAwakened || this.echoes.length >= this.maxActiveEchoes) return;
        
        // Find next unfulfilled echo from pool
        const available = this.echoPool.find(e => !e.fulfilled && !e.ignored);
        if (!available) return;
        
        const echo = {
            id: Phaser.Math.RND.uuid(),
            type: available.type,
            data: available.data,
            spawnTime: this.scene.time.now,
            expiresAt: this.scene.time.now + 8000, // 8 seconds to respond
            state: 'SUPERPOSITION', // SUPERPOSITION, COLLAPSING, COLLAPSED
            poolRef: available
        };
        
        this.echoes.push(echo);
        this.totalEchoesSpawned++;
        
        // Announce based on type
        this.announceEcho(echo);
    }
    
    announceEcho(echo) {
        switch (echo.type) {
            case 'PREMONITION':
                this.announcePremonition(echo);
                break;
            case 'PROPHECY':
                this.announceProphecy(echo);
                break;
            case 'VISION':
                this.announceVision(echo);
                break;
        }
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('ORACLE_ECHO', { 
                type: echo.type, 
                probability: echo.data.probability || 0.5 
            });
        }
    }
    
    announcePremonition(echo) {
        const { spawnX, spawnY, enemyType } = echo.data;
        
        // Ghost enemy outline
        echo.ghostEnemy = this.createGhostEnemy(spawnX, spawnY, enemyType);
        
        // Ghost bullet trajectories (faint red lines showing future shots)
        echo.ghostBullets = this.createGhostBullets(spawnX, spawnY, echo.data.bulletPattern);
        
        // Announcement text
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 80,
            'PREMONITION', {
                fontFamily: 'monospace',
                fontSize: '16px',
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
        
        // Pulse ring at premonition location
        this.createResonanceRing(spawnX, spawnY, this.ECHO_COLORS.PREMONITION);
    }
    
    createGhostEnemy(x, y, type) {
        const graphics = this.scene.add.graphics();
        const color = this.ECHO_COLORS.PREMONITION;
        const size = type === 'tank' ? 35 : (type === 'fast' ? 20 : 28);
        
        // Draw ghost shape based on type
        graphics.lineStyle(2, color, 0.4);
        
        if (type === 'fast') {
            // Triangle
            graphics.beginPath();
            graphics.moveTo(x, y - size);
            graphics.lineTo(x + size * 0.8, y + size * 0.6);
            graphics.lineTo(x - size * 0.8, y + size * 0.6);
            graphics.closePath();
            graphics.strokePath();
        } else if (type === 'tank') {
            // Hexagon
            graphics.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const px = x + Math.cos(angle) * size;
                const py = y + Math.sin(angle) * size;
                if (i === 0) graphics.moveTo(px, py);
                else graphics.lineTo(px, py);
            }
            graphics.closePath();
            graphics.strokePath();
        } else {
            // Diamond
            graphics.beginPath();
            graphics.moveTo(x, y - size);
            graphics.lineTo(x + size, y);
            graphics.lineTo(x, y + size);
            graphics.lineTo(x - size, y);
            graphics.closePath();
            graphics.strokePath();
        }
        
        // Add pulsing animation
        this.scene.tweens.add({
            targets: graphics,
            alpha: 0.2,
            duration: 800,
            yoyo: true,
            repeat: 5
        });
        
        return graphics;
    }
    
    createGhostBullets(x, y, pattern) {
        const graphics = this.scene.add.graphics();
        const color = 0xff3366; // Faint red
        
        graphics.lineStyle(1, color, 0.2);
        
        // Draw predicted bullet trajectories
        if (pattern === 0) {
            // Single shot toward player
            const angle = Phaser.Math.Angle.Between(x, y, 
                this.scene.player.x, this.scene.player.y);
            const endX = x + Math.cos(angle) * 200;
            const endY = y + Math.sin(angle) * 200;
            graphics.lineBetween(x, y, endX, endY);
        } else if (pattern === 1) {
            // Burst pattern
            for (let i = -1; i <= 1; i++) {
                const angle = Phaser.Math.Angle.Between(x, y, 
                    this.scene.player.x, this.scene.player.y) + i * 0.3;
                const endX = x + Math.cos(angle) * 150;
                const endY = y + Math.sin(angle) * 150;
                graphics.lineBetween(x, y, endX, endY);
            }
        } else {
            // Circle pattern (8 directions)
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const endX = x + Math.cos(angle) * 120;
                const endY = y + Math.sin(angle) * 120;
                graphics.lineBetween(x, y, endX, endY);
            }
        }
        
        return graphics;
    }
    
    announceProphecy(echo) {
        const directions = ['NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST', 
                           'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST'];
        const dir = directions[echo.data.direction];
        
        // Text announcement
        const text = this.scene.add.text(
            this.scene.player.x, this.scene.player.y - 80,
            `PROPHECY:\n${echo.data.enemyCount} ENEMIES FROM ${dir}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#9d4edd',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Compass direction indicator
        this.createCompassIndicator(echo.data.direction);
    }
    
    createCompassIndicator(direction) {
        const cx = this.scene.player.x;
        const cy = this.scene.player.y;
        const radius = 100;
        const angle = (direction * Math.PI) / 4;
        
        const indicator = this.scene.add.graphics();
        indicator.lineStyle(3, this.ECHO_COLORS.PROPHECY, 0.6);
        
        // Draw arrow pointing in direction
        const endX = cx + Math.cos(angle) * radius;
        const endY = cy + Math.sin(angle) * radius;
        
        indicator.lineBetween(cx, cy, endX, endY);
        
        // Arrowhead
        const headSize = 10;
        const headAngle1 = angle + Math.PI * 0.8;
        const headAngle2 = angle - Math.PI * 0.8;
        
        indicator.beginPath();
        indicator.moveTo(endX, endY);
        indicator.lineTo(
            endX + Math.cos(headAngle1) * headSize,
            endY + Math.sin(headAngle1) * headSize
        );
        indicator.moveTo(endX, endY);
        indicator.lineTo(
            endX + Math.cos(headAngle2) * headSize,
            endY + Math.sin(headAngle2) * headSize
        );
        indicator.strokePath();
        
        // Fade out
        this.scene.tweens.add({
            targets: indicator,
            alpha: 0,
            duration: 5000,
            onComplete: () => indicator.destroy()
        });
    }
    
    announceVision(echo) {
        const { visionType, probability } = echo.data;
        const typeNames = { 'SURVIVAL': 'SURVIVAL', 'DEATH': 'WARNING', 'TRANSCENDENCE': 'TRANSCENDENCE' };
        
        // Chromatic flash
        this.visionOverlay.setVisible(true);
        this.scene.tweens.add({
            targets: this.visionOverlay,
            alpha: 0.6,
            duration: 200,
            yoyo: true,
            onComplete: () => {
                this.visionOverlay.setVisible(false);
            }
        });
        
        // Flash the future type
        const color = visionType === 'DEATH' ? '#ff3366' : 
                     (visionType === 'TRANSCENDENCE' ? '#ffd700' : '#00f0ff');
        
        const text = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            `VISION: ${typeNames[visionType]}\n${Math.floor(probability * 100)}% PROBABLE`, {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: color,
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            scale: 1.5,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Create ghost replay of the future moment
        this.createGhostFuture(echo);
    }
    
    createGhostFuture(echo) {
        const { visionType, futureTime } = echo.data;
        
        // Simple visualization: ghost player in future position
        const ghost = this.scene.add.graphics();
        const color = visionType === 'DEATH' ? 0xff3366 : 
                     (visionType === 'TRANSCENDENCE' ? 0xffd700 : 0x00f0ff);
        
        // Predict future position based on current velocity
        const player = this.scene.player;
        const futureX = player.x + player.body.velocity.x * (futureTime / 1000) * 0.5;
        const futureY = player.y + player.body.velocity.y * (futureTime / 1000) * 0.5;
        
        // Draw ghost player
        ghost.fillStyle(color, 0.2);
        ghost.beginPath();
        ghost.moveTo(futureX, futureY - 15);
        ghost.lineTo(futureX + 12, futureY + 10);
        ghost.lineTo(futureX - 12, futureY + 10);
        ghost.closePath();
        ghost.fillPath();
        
        // Fade out
        this.scene.tweens.add({
            targets: ghost,
            alpha: 0,
            duration: 4000,
            onComplete: () => ghost.destroy()
        });
        
        echo.ghostFuture = ghost;
        echo.predictedPosition = { x: futureX, y: futureY };
    }
    
    createResonanceRing(x, y, color) {
        const ringId = Phaser.Math.RND.uuid();
        const ringData = {
            id: ringId,
            x: x,
            y: y,
            color: color,
            radius: 10,
            alpha: 0.5,
            createdAt: this.scene.time.now
        };
        
        this.activeRings.push(ringData);
        
        // Register initial ring with manager
        this.scene.graphicsManager.drawRing('effects', x, y, 10, color, 0.5, 2);
        
        // Expand animation using tweens instead of per-frame clear/draw
        this.scene.tweens.add({
            targets: ringData,
            radius: 100,
            alpha: 0,
            duration: 1000,
            ease: 'Linear',
            onUpdate: () => {
                // Mark ring for re-render this frame
                ringData.needsRender = true;
            },
            onComplete: () => {
                this.activeRings = this.activeRings.filter(r => r.id !== ringId);
            }
        });
    }
    
    /**
     * Render all active resonance rings via UnifiedGraphicsManager
     */
    renderResonanceRings() {
        const manager = this.scene.graphicsManager;
        
        for (const ring of this.activeRings) {
            if (ring.radius <= 100) {
                manager.drawRing('effects', ring.x, ring.y, ring.radius, ring.color, ring.alpha, 2);
            }
        }
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;
        
        if (!this.oracleAwakened || !this.scene.player?.active) return;
        
        this.renderCounter++;
        
        const now = this.scene.time.now;
        
        // Update echoes
        this.echoes = this.echoes.filter(echo => {
            // Check for collapse conditions
            if (echo.state === 'SUPERPOSITION') {
                this.checkEchoCollapse(echo, now);
            }
            
            // Remove expired echoes
            if (now > echo.expiresAt && echo.state !== 'COLLAPSED') {
                this.collapseEcho(echo, 'EXPIRED');
                return false;
            }
            
            return echo.state !== 'COLLAPSED';
        });
        
        // Update cooldown and spawn new echoes
        if (this.echoCooldown > 0) {
            this.echoCooldown -= dt;
        } else if (this.echoes.length === 0 && this.totalEchoesSpawned < 8) {
            this.spawnNextEcho();
            this.echoCooldown = 5000; // 5s between echoes
        }
        
        // Update visuals (throttled)
        if (this.renderCounter % this.renderInterval === 0) {
            this.updateOracleGlow();
        }
        
        // Render resonance rings
        this.renderResonanceRings();
        
        this.renderEchoes();
    }
    
    checkEchoCollapse(echo, now) {
        const player = this.scene.player;
        
        switch (echo.type) {
            case 'PREMONITION':
                this.checkPremonitionCollapse(echo, player);
                break;
            case 'PROPHECY':
                this.checkProphecyCollapse(echo, player);
                break;
            case 'VISION':
                this.checkVisionCollapse(echo, player, now);
                break;
        }
    }
    
    checkPremonitionCollapse(echo, player) {
        const { spawnX, spawnY } = echo.data;
        const dist = Phaser.Math.Distance.Between(player.x, player.y, spawnX, spawnY);
        
        // If player moves close to premonition location, it's "heeded" (aggressive)
        if (dist < 100) {
            echo.heeded = true;
            this.collapseEcho(echo, 'HEEDED');
        }
        // If player moves far away, it's "avoided" (defensive)
        else if (dist > 300) {
            echo.heeded = false;
            this.collapseEcho(echo, 'AVOIDED');
        }
    }
    
    checkProphecyCollapse(echo, player) {
        // Prophecies collapse based on whether enemies from that direction were killed
        // This is tracked through the enemy spawn/kill events
        const now = this.scene.time.now;
        
        // If enough time passed, collapse based on outcome
        if (now > echo.spawnTime + 5000) {
            // Simplified: prophecy is "heeded" if player killed enemies during window
            const killedDuringWindow = this.scene.score > echo.spawnScore + 100;
            echo.heeded = killedDuringWindow;
            this.collapseEcho(echo, killedDuringWindow ? 'HEEDED' : 'IGNORED');
        }
    }
    
    checkVisionCollapse(echo, player, now) {
        const { futureTime, visionType } = echo.data;
        
        // Check if predicted future time has arrived
        if (now >= echo.spawnTime + futureTime) {
            // Check if player's current state matches prediction
            const health = player.health;
            let predictionMatched = false;
            
            if (visionType === 'DEATH' && health < 30) predictionMatched = true;
            if (visionType === 'SURVIVAL' && health > 50) predictionMatched = true;
            if (visionType === 'TRANSCENDENCE' && this.scene.kairosMoment?.inKairosState) predictionMatched = true;
            
            echo.heeded = predictionMatched;
            this.collapseEcho(echo, predictionMatched ? 'FULFILLED' : 'AVERTED');
        }
    }
    
    collapseEcho(echo, outcome) {
        if (echo.state === 'COLLAPSED') return;
        
        echo.state = 'COLLAPSED';
        echo.outcome = outcome;
        
        // Visual collapse effect
        this.createCollapseEffect(echo);
        
        // Apply consequences
        this.applyEchoConsequences(echo, outcome);
        
        // Track statistics
        if (outcome === 'HEEDED' || outcome === 'FULFILLED') {
            this.echoesHeeded++;
        } else {
            this.echoesIgnored++;
        }
        
        // Clean up visuals
        if (echo.ghostEnemy) echo.ghostEnemy.destroy();
        if (echo.ghostBullets) echo.ghostBullets.destroy();
        if (echo.ghostFuture) echo.ghostFuture.destroy();
        
        // Mark pool reference
        if (echo.poolRef) {
            echo.poolRef.fulfilled = (outcome === 'HEEDED' || outcome === 'FULFILLED');
            echo.poolRef.ignored = !echo.poolRef.fulfilled;
        }
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('ECHO_COLLAPSED', { 
                type: echo.type, 
                outcome: outcome 
            });
        }
    }
    
    createCollapseEffect(echo) {
        // Resonance ring flash
        let x, y;
        if (echo.type === 'PREMONITION') {
            x = echo.data.spawnX;
            y = echo.data.spawnY;
        } else {
            x = this.scene.player.x;
            y = this.scene.player.y;
        }
        
        const color = (echo.outcome === 'HEEDED' || echo.outcome === 'FULFILLED') 
            ? 0x00f0ff : 0xff3366;
        
        // Flash ring
        const flash = this.scene.add.graphics();
        flash.lineStyle(4, color, 1);
        flash.strokeCircle(x, y, 50);
        
        this.scene.tweens.add({
            targets: flash,
            scale: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
        
        // Text announcement
        const outcomeText = echo.outcome === 'HEEDED' ? 'FATED' :
                           echo.outcome === 'FULFILLED' ? 'PROPHECY FULFILLED' :
                           echo.outcome === 'AVERTED' ? 'DOOM AVERTED' : 'ECHO LOST';
        
        const text = this.scene.add.text(x, y - 50, outcomeText, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: echo.outcome === 'HEEDED' || echo.outcome === 'FULFILLED' ? '#00f0ff' : '#ff3366'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }
    
    applyEchoConsequences(echo, outcome) {
        switch (echo.type) {
            case 'PREMONITION':
                this.applyPremonitionConsequences(echo, outcome);
                break;
            case 'PROPHECY':
                this.applyProphecyConsequences(echo, outcome);
                break;
            case 'VISION':
                this.applyVisionConsequences(echo, outcome);
                break;
        }
    }
    
    applyPremonitionConsequences(echo, outcome) {
        const { spawnX, spawnY, enemyType } = echo.data;
        
        if (outcome === 'HEEDED') {
            // Aggressive collapse: Spawn enemy at premonition location
            // Player is nearby to engage
            const enemy = this.spawnEchoEnemy(spawnX, spawnY, enemyType, false);
            
            // Bonus: Fated kills worth more
            if (enemy) {
                enemy.fatedKill = true;
                enemy.scoreValue = (enemy.scoreValue || 100) * 1.5;
            }
            
            this.fatedKills++;
            
            // Syntropy bonus
            if (this.scene.syntropyEngine) {
                this.scene.syntropyEngine.addSyntropy(25, spawnX, spawnY);
            }
            
        } else {
            // Defensive collapse: Spawn elsewhere, less dangerous
            const offsetX = (Math.random() - 0.5) * 400;
            const offsetY = (Math.random() - 0.5) * 400;
            this.spawnEchoEnemy(spawnX + offsetX, spawnY + offsetY, enemyType, false);
        }
    }
    
    applyProphecyConsequences(echo, outcome) {
        const { direction, enemyCount, reward, doomMultiplier } = echo.data;
        
        // Calculate spawn position based on direction
        const worldWidth = 1920;
        const worldHeight = 1440;
        const angle = (direction * Math.PI) / 4;
        const spawnDist = 400;
        const spawnX = this.scene.player.x + Math.cos(angle) * spawnDist;
        const spawnY = this.scene.player.y + Math.sin(angle) * spawnDist;
        
        if (outcome === 'HEEDED' || outcome === 'FULFILLED') {
            // Player heeded prophecy — spawn normal enemies with bonus
            for (let i = 0; i < enemyCount; i++) {
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;
                const enemy = this.spawnEchoEnemy(spawnX + offsetX, spawnY + offsetY, 'normal', false);
                if (enemy) {
                    enemy.fatedKill = true;
                    enemy.scoreValue = reward;
                }
            }
            
            // Announce reward
            this.showFloatingText(this.scene.player.x, this.scene.player.y - 60, 
                `FATED +${reward}`, '#ffd700');
                
        } else {
            // Ignored prophecy — spawn DOOM enemies (empowered)
            this.showFloatingText(this.scene.player.x, this.scene.player.y - 60, 
                'DOOM APPROACHES', '#ff3366');
            
            for (let i = 0; i < enemyCount; i++) {
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;
                const enemy = this.spawnEchoEnemy(spawnX + offsetX, spawnY + offsetY, 'tank', true);
                if (enemy) {
                    enemy.doomEnemy = true;
                    enemy.maxHealth *= doomMultiplier;
                    enemy.health = enemy.maxHealth;
                    enemy.setTint(0xff0000);
                }
            }
            
            this.doomEncounters++;
        }
    }
    
    applyVisionConsequences(echo, outcome) {
        const { visionType } = echo.data;
        
        if (outcome === 'FULFILLED') {
            // Player fulfilled their vision
            if (visionType === 'TRANSCENDENCE') {
                // Bonus: Immediate Kairos state trigger
                if (this.scene.kairosMoment) {
                    this.scene.kairosMoment.flowScore = 95;
                    this.showFloatingText(this.scene.player.x, this.scene.player.y - 80,
                        'VISION FULFILLED — KAIROS AWAITS', '#ffd700');
                }
            } else if (visionType === 'SURVIVAL') {
                // Heal player slightly
                this.scene.player.health = Math.min(100, this.scene.player.health + 20);
                this.showFloatingText(this.scene.player.x, this.scene.player.y - 60,
                    'SURVIVAL SECURED +20 HP', '#00f0ff');
            }
            
            // Large score bonus
            this.scene.score += 500;
            
        } else {
            // Averted the predicted future — also valid outcome
            this.showFloatingText(this.scene.player.x, this.scene.player.y - 60,
                'FUTURE AVERTED', '#9d4edd');
            
            // Bonus syntropy for changing fate
            if (this.scene.syntropyEngine) {
                this.scene.syntropyEngine.addSyntropy(50, this.scene.player.x, this.scene.player.y);
            }
        }
    }
    
    spawnEchoEnemy(x, y, type, isDoom) {
        // Clamp to world bounds
        x = Phaser.Math.Clamp(x, 50, 1870);
        y = Phaser.Math.Clamp(y, 50, 1390);
        
        // Check for existing enemies to avoid stacking
        let tooClose = false;
        this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active && Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) < 30) {
                tooClose = true;
            }
        });
        
        if (tooClose) return null;
        
        // Spawn the enemy
        const enemy = new Enemy(this.scene, x, y, this.scene.player, type);
        this.scene.enemies.add(enemy);
        
        // Mark as oracle-spawned
        enemy.oracleSpawned = true;
        
        return enemy;
    }
    
    updateOracleGlow() {
        const player = this.scene.player;
        const time = this.scene.time.now;
        
        // Base glow when oracle is active
        if (this.echoes.length > 0) {
            const pulse = (Math.sin(time / 500) + 1) / 2; // 0-1
            const alpha = 0.1 + pulse * 0.15;
            const radius = 60 + pulse * 20;
            
            // Register draw commands with manager (effects layer)
            // Outer glow ring
            this.scene.graphicsManager.drawCircle(
                'effects', 
                player.x, 
                player.y, 
                radius + 20, 
                this.ECHO_COLORS.PREMONITION_GLOW, 
                alpha * 0.3
            );
            
            // Inner glow ring
            this.scene.graphicsManager.drawCircle(
                'effects', 
                player.x, 
                player.y, 
                radius, 
                this.ECHO_COLORS.PROPHECY, 
                alpha * 0.2
            );
        }
    }
    
    renderEchoes() {
        // Continuous rendering of active echo elements
        // (Most visuals are created in announcement methods and tween themselves)
    }
    
    showFloatingText(x, y, text, color) {
        const label = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: color,
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
    
    // ===== PROFILE PERSISTENCE =====
    
    loadOracleProfile() {
        try {
            const saved = localStorage.getItem('oracle_profile_v1');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load Oracle profile:', e);
        }
        
        return {
            tendency: 'neutral', // aggressive, defensive, chaotic, prophetic, neutral
            echoesHeededTotal: 0,
            echoesIgnoredTotal: 0,
            preferredEchoType: null
        };
    }
    
    saveOracleProfile() {
        // Update profile based on this run
        const totalEchoes = this.echoesHeeded + this.echoesIgnored;
        if (totalEchoes > 0) {
            const heedRatio = this.echoesHeeded / totalEchoes;
            
            if (heedRatio > 0.7) this.oracleProfile.tendency = 'prophetic';
            else if (heedRatio < 0.3) this.oracleProfile.tendency = 'chaotic';
            else if (this.fatedKills > this.doomEncounters) this.oracleProfile.tendency = 'aggressive';
            else this.oracleProfile.tendency = 'defensive';
            
            this.oracleProfile.echoesHeededTotal += this.echoesHeeded;
            this.oracleProfile.echoesIgnoredTotal += this.echoesIgnored;
        }
        
        try {
            localStorage.setItem('oracle_profile_v1', JSON.stringify(this.oracleProfile));
        } catch (e) {
            console.warn('Failed to save Oracle profile:', e);
        }
    }
    
    // ===== PUBLIC API =====
    
    onEnemyKilled(enemy) {
        // Track fated kills
        if (enemy.fatedKill) {
            this.fatedKills++;
            
            // Syntropy bonus
            if (this.scene.syntropyEngine) {
                this.scene.syntropyEngine.addSyntropy(15, enemy.x, enemy.y);
            }
        }
        
        if (enemy.doomEnemy) {
            this.doomEncounters++;
        }
    }
    
    getOracleStatus() {
        return {
            awakened: this.oracleAwakened,
            activeEchoes: this.echoes.length,
            echoesHeeded: this.echoesHeeded,
            echoesIgnored: this.echoesIgnored,
            tendency: this.oracleProfile.tendency,
            fatedKills: this.fatedKills,
            doomEncounters: this.doomEncounters
        };
    }
    
    forceVision(visionType) {
        // Debug/test: Force a specific vision
        const echo = {
            id: Phaser.Math.RND.uuid(),
            type: 'VISION',
            data: {
                visionType: visionType,
                futureTime: 5000,
                probability: 0.8
            },
            spawnTime: this.scene.time.now,
            expiresAt: this.scene.time.now + 8000,
            state: 'SUPERPOSITION',
            poolRef: null
        };
        
        this.echoes.push(echo);
        this.announceVision(echo);
    }
    
    destroy() {
        // Save profile
        this.saveOracleProfile();
        
        // Clean up visuals
        if (this.visionOverlay) this.visionOverlay.destroy();
        
        // Clean up active echoes
        this.echoes.forEach(echo => {
            if (echo.ghostEnemy) echo.ghostEnemy.destroy();
            if (echo.ghostBullets) echo.ghostBullets.destroy();
            if (echo.ghostFuture) echo.ghostFuture.destroy();
        });
        
        // Clean up unified renderer rings
        this.activeRings = [];
    }
}
