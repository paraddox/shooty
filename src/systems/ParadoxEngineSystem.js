import Phaser from 'phaser';

/**
 * Paradox Engine - Predictive Causality System
 * 
 * Hold RIGHT CLICK to project your "Future Echo" - a golden silhouette showing
 * where you WILL be if you maintain current velocity. During projection:
 * - Enemy bullets show their FUTURE trajectories as red warning lines
 * - Safe corridors appear as cyan paths through the bullet pattern
 * - Release to commit: your future echo becomes reality with paradox bonuses
 * 
 * If you match the projected path perfectly, you create a TEMPORAL PARADOX:
 * - All enemies in your wake take damage from causality violation
 * - Massive score multiplier (2x-5x based on path complexity)
 * - Resonance Cascade gets +2 chain levels instantly
 * - Visual: glitch/scanline effects across screen
 * 
 * If you DEVIATE from the path:
 * - Paradox collapses early with reduced bonuses
 * - Shows "PARADOX FAILED" with feedback on deviation
 * 
 * Synergies:
 * - Echo Storm: Future echoes can graze predicted bullets for double absorption
 * - Fracture: Ghost player also leaves future echoes (double prediction)
 * - Residue: Nodes fire at intersections of your path and enemy bullets
 * - Singularity: Deploying singularity on your future path auto-traps predicted bullets
 * - Omni-Weapon: Paradox success grants temporary "Phase" mod (all bullets phase through you)
 * 
 * Color: Gold (#ffd700) for your echo, Red (#ff3366) for bullet predictions, 
 *        Cyan (#00f0ff) for safe corridors
 * 
 * This transforms reactive dodging into PROACTIVE CHOREOGRAPHY - the ultimate
 * expression of mastery in a bullet hell.
 */

export default class ParadoxEngineSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Projection state
        this.isProjecting = false;
        this.projectionStartTime = 0;
        this.projectionDuration = 0;
        this.maxProjectionTime = 3.0; // Max seconds to project
        this.projectionCooldown = 0;
        this.projectionCooldownMax = 2.0;
        
        // Future echo state
        this.futureEcho = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            path: [], // Array of {x, y, time} for trajectory
            active: false
        };
        
        // Committed path (after release)
        this.committedPath = [];
        this.pathDeviation = 0;
        this.maxDeviation = 60; // Pixels before paradox fails
        this.paradoxActive = false;
        this.paradoxStartTime = 0;
        this.paradoxMaxDuration = 5.0;
        
        // Bullet predictions
        this.bulletPredictions = []; // {bullet, predictedPath}
        this.predictionHorizon = 2.0; // Seconds ahead to predict
        this.predictionSteps = 20; // Number of prediction points
        
        // Paradox overlay
        this.paradoxOverlay = null;
        
        // Input
        this.rightMouseDown = false;
        
        // Paradox bonuses
        this.currentParadoxMultiplier = 1.0;
        this.pathComplexity = 0; // Based on turns/dodges in path
        
        // Audio/visual feedback
        this.glitchIntensity = 0;
        this.scanlineOffset = 0;
        
        // Colors
        this.ECHO_COLOR = 0xffd700;
        this.PREDICTION_COLOR = 0xff3366;
        this.SAFE_COLOR = 0x00f0ff;
        this.PARADOX_COLOR = 0xff00ff;
        
        // Throttling for performance
        this.renderInterval = 2; // Render every 2nd frame (30fps)
        this.renderCounter = 0;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
    }
    
    createVisuals() {
        // Use existing 'effects' layer from UnifiedGraphicsManager
        // (background, world, effects, ui, overlay layers are pre-configured)

        // Paradox overlay (scanlines)
        this.createParadoxOverlay();
    }
    
    createParadoxOverlay() {
        // Create scanline texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Draw horizontal scanlines
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, 256, 256);
        
        ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
        for (let y = 0; y < 256; y += 4) {
            ctx.fillRect(0, y, 256, 1);
        }
        
        this.scene.textures.addCanvas('scanlines', canvas);
        
        this.paradoxOverlay = this.scene.add.image(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'scanlines'
        );
        this.paradoxOverlay.setScrollFactor(0);
        this.paradoxOverlay.setDepth(95);
        this.paradoxOverlay.setAlpha(0);
        this.paradoxOverlay.setVisible(false);
        this.paradoxOverlay.setScale(
            this.scene.scale.width / 256 + 1,
            this.scene.scale.height / 256 + 1
        );
    }
    
    setupInput() {
        // Right mouse button for projection
        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.rightButtonDown() && this.projectionCooldown <= 0) {
                this.startProjection();
            }
        });
        
        this.scene.input.on('pointerup', (pointer) => {
            if (this.isProjecting && !pointer.rightButtonDown()) {
                this.commitProjection();
            }
        });
        
        // Disable context menu
        this.scene.game.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    startProjection() {
        if (this.paradoxActive) return; // Can't project during active paradox
        
        const player = this.scene.player;
        if (!player.active) return;
        
        this.isProjecting = true;
        this.projectionStartTime = this.scene.time.now / 1000;
        this.projectionDuration = 0;
        
        // Initialize future echo at player position
        this.futureEcho.x = player.x;
        this.futureEcho.y = player.y;
        this.futureEcho.vx = player.body.velocity.x;
        this.futureEcho.vy = player.body.velocity.y;
        this.futureEcho.path = [];
        this.futureEcho.active = true;
        
        // Calculate initial path
        this.calculateFuturePath();
        
        // Calculate bullet predictions
        this.calculateBulletPredictions();
        
        // Visual feedback
        this.onProjectionStart();
        
        // Slow time slightly during projection
        this.scene.physics.world.timeScale = 0.7;
    }
    
    calculateFuturePath() {
        // Simulate future movement based on current velocity
        const dt = this.predictionHorizon / this.predictionSteps;
        
        this.futureEcho.path = [];
        let x = this.futureEcho.x;
        let y = this.futureEcho.y;
        let vx = this.futureEcho.vx;
        let vy = this.futureEcho.vy;
        
        for (let i = 0; i <= this.predictionSteps; i++) {
            const t = i * dt;
            
            // Apply drag (same as player physics)
            vx *= Math.pow(0.95, dt * 60);
            vy *= Math.pow(0.95, dt * 60);
            
            x += vx * dt;
            y += vy * dt;
            
            // Clamp to world bounds
            x = Phaser.Math.Clamp(x, 0, 1920);
            y = Phaser.Math.Clamp(y, 0, 1440);
            
            this.futureEcho.path.push({
                x, y, t,
                speed: Math.sqrt(vx * vx + vy * vy)
            });
        }
        
        // Calculate path complexity (turns, speed changes)
        this.pathComplexity = this.calculatePathComplexity();
    }
    
    calculatePathComplexity() {
        if (this.futureEcho.path.length < 3) return 1;
        
        let complexity = 0;
        for (let i = 2; i < this.futureEcho.path.length; i++) {
            const p1 = this.futureEcho.path[i - 2];
            const p2 = this.futureEcho.path[i - 1];
            const p3 = this.futureEcho.path[i];
            
            // Calculate angle change
            const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
            const angleDiff = Math.abs(angle2 - angle1);
            
            complexity += angleDiff;
        }
        
        return Math.max(1, complexity / Math.PI);
    }
    
    calculateBulletPredictions() {
        this.bulletPredictions = [];
        
        const dt = this.predictionHorizon / this.predictionSteps;
        
        this.scene.enemyBullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            
            const path = [];
            let x = bullet.x;
            let y = bullet.y;
            let vx = bullet.body?.velocity?.x || 0;
            let vy = bullet.body?.velocity?.y || 0;
            
            for (let i = 0; i <= this.predictionSteps; i++) {
                path.push({ x, y, t: i * dt });
                x += vx * dt;
                y += vy * dt;
            }
            
            this.bulletPredictions.push({ bullet, path });
        });
        
        // Also predict enemy-fired bullets that will spawn during projection
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active || !enemy.canFire) return;
            
            // Simple prediction - enemy fires toward player position
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                this.scene.player.x, this.scene.player.y
            );
            const speed = 250;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const path = [];
            let x = enemy.x;
            let y = enemy.y;
            
            for (let i = 0; i <= this.predictionSteps; i++) {
                path.push({ x, y, t: i * dt });
                x += vx * dt;
                y += vy * dt;
            }
            
            this.bulletPredictions.push({ 
                bullet: null, // Not yet spawned
                path,
                predicted: true,
                sourceEnemy: enemy
            });
        });
    }
    
    onProjectionStart() {
        // Show projection text
        const player = this.scene.player;
        const text = this.scene.add.text(player.x, player.y - 80, 'FUTURE VISION', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fontStyle: 'bold',
            fill: '#ffd700'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    commitProjection() {
        if (!this.isProjecting) return;
        
        this.isProjecting = false;
        this.committedPath = [...this.futureEcho.path];
        this.paradoxActive = true;
        this.paradoxStartTime = this.scene.time.now / 1000;
        this.pathDeviation = 0;
        
        // Calculate paradox multiplier based on complexity and projection time
        this.currentParadoxMultiplier = Math.min(
            5.0,
            2.0 + this.pathComplexity * 0.5
        );
        
        // Visual feedback
        this.onParadoxStart();
        
        // Record in Timeline Chronicle
        if (this.scene.timelineChronicle) {
            this.scene.timelineChronicle.recordSystemUse('paradox', {
                multiplier: this.currentParadoxMultiplier,
                complexity: this.pathComplexity
            });
        }
        
        // Resume normal time
        this.scene.physics.world.timeScale = 1.0;
        
        // Clear predictions
        this.bulletPredictions = [];
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('PARADOX_COMMIT');
            // Paradox grants +2 chain levels
            this.scene.resonanceCascade.recordActivation('PARADOX_BONUS');
        }
        
        // Harmonic Convergence: paradox commit activates melody layer
        if (this.scene.harmonicConvergence) {
            this.scene.harmonicConvergence.onParadoxCommit(this.currentParadoxMultiplier);
        }
        
        // Synchronicity Cascade: paradox activation
        if (this.scene.synchronicityCascade) {
            this.scene.synchronicityCascade.onSystemActivate('paradox');
        }
    }
    
    onParadoxStart() {
        // Show commit text
        const player = this.scene.player;
        const text = this.scene.add.text(
            player.x, 
            player.y - 80, 
            `PARADOX ×${this.currentParadoxMultiplier.toFixed(1)}`,
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#ff00ff'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            scale: 1.3,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Activate paradox overlay
        this.paradoxOverlay.setVisible(true);
        this.paradoxOverlay.setAlpha(0.3);
        
        // Screen shake
        this.scene.cameras.main.shake(200, 0.005);
        
        // Show path trail
        this.showCommittedPath();
    }
    
    showCommittedPath() {
        if (this.committedPath.length < 2) return;
        
        const manager = this.scene.graphicsManager;
        if (!manager) return;

        // Draw gradient line along path on 'effects' layer
        for (let i = 1; i < this.committedPath.length; i++) {
            const p1 = this.committedPath[i - 1];
            const p2 = this.committedPath[i];

            const alpha = 0.6 - (i / this.committedPath.length) * 0.5;
            manager.drawLine('effects', p1.x, p1.y, p2.x, p2.y, this.PARADOX_COLOR, alpha, 3);
        }

        // Add waypoint markers
        this.committedPath.forEach((point, i) => {
            if (i % 3 === 0) {
                manager.drawCircle('effects', point.x, point.y, 4, this.PARADOX_COLOR, 0.4);
            }
        });
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;
        
        // Update cooldown
        if (this.projectionCooldown > 0) {
            this.projectionCooldown -= dt;
        }
        
        // Update projection state
        if (this.isProjecting) {
            this.updateProjection(dt);
        }
        
        // Update paradox state
        if (this.paradoxActive) {
            this.updateParadox(dt);
        }
        
        // Update visuals (throttled for performance)
        this.renderCounter++;
        if (this.renderCounter >= this.renderInterval) {
            this.renderCounter = 0;
            this.render();
        }
    }
    
    updateProjection(dt) {
        this.projectionDuration += dt;
        
        // Recalculate future path based on current velocity
        const player = this.scene.player;
        this.futureEcho.vx = player.body.velocity.x;
        this.futureEcho.vy = player.body.velocity.y;
        this.calculateFuturePath();
        
        // Auto-commit at max projection time
        if (this.projectionDuration >= this.maxProjectionTime) {
            this.commitProjection();
        }
    }
    
    updateParadox(dt) {
        const player = this.scene.player;
        const now = this.scene.time.now / 1000;
        const paradoxElapsed = now - this.paradoxStartTime;
        
        // Find closest point on committed path
        let minDist = Infinity;
        let closestPoint = null;
        
        this.committedPath.forEach(point => {
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y,
                point.x, point.y
            );
            if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
            }
        });
        
        // Track deviation
        if (minDist > this.maxDeviation) {
            // Paradox failed
            this.failParadox(minDist);
            return;
        }
        
        // Update path deviation tracking
        this.pathDeviation = Math.max(this.pathDeviation, minDist);
        
        // Apply paradox effects
        this.applyParadoxEffects(dt, closestPoint);
        
        // Check paradox timeout
        if (paradoxElapsed >= this.paradoxMaxDuration) {
            this.completeParadox();
        }
        
        // Update glitch effects
        this.updateGlitchEffects(dt);
    }
    
    applyParadoxEffects(dt, closestPoint) {
        // Damage enemies near the paradox path
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            // Check if enemy is near the committed path
            let nearPath = false;
            for (const point of this.committedPath) {
                const dist = Phaser.Math.Distance.Between(
                    enemy.x, enemy.y,
                    point.x, point.y
                );
                if (dist < 100) {
                    nearPath = true;
                    break;
                }
            }
            
            if (nearPath) {
                // Apply causality damage
                const damage = 20 * dt * this.currentParadoxMultiplier;
                enemy.takeDamage(damage);
                
                // Visual feedback
                if (Math.random() < 0.1) {
                    this.spawnGlitchParticles(enemy.x, enemy.y);
                }
            }
        });
        
        // Score accumulation during paradox
        this.scene.score += Math.floor(10 * this.currentParadoxMultiplier * dt);
    }
    
    spawnGlitchParticles(x, y) {
        // Spawn glitch-style particles
        for (let i = 0; i < 3; i++) {
            const particle = this.scene.add.rectangle(
                x + (Math.random() - 0.5) * 30,
                y + (Math.random() - 0.5) * 30,
                4 + Math.random() * 8,
                2,
                this.PARADOX_COLOR
            );
            particle.setDepth(56);
            
            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                scaleX: 0,
                duration: 200 + Math.random() * 200,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    updateGlitchEffects(dt) {
        // Update scanline offset for glitch effect
        this.scanlineOffset += dt * 50;
        
        // Random glitch intensity
        if (Math.random() < 0.05) {
            this.glitchIntensity = 1.0;
        }
        this.glitchIntensity = Math.max(0, this.glitchIntensity - dt * 2);
        
        // Update overlay
        if (this.paradoxActive) {
            const baseAlpha = 0.3;
            const glitchAlpha = this.glitchIntensity * 0.4;
            this.paradoxOverlay.setAlpha(baseAlpha + glitchAlpha);
            this.paradoxOverlay.setY(
                (this.scene.scale.height / 2) + Math.sin(this.scanlineOffset) * 5
            );
        }
    }
    
    failParadox(deviation) {
        const player = this.scene.player;
        
        // Show failure text
        const text = this.scene.add.text(
            player.x,
            player.y - 60,
            'PARADOX COLLAPSED',
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fontStyle: 'bold',
                fill: '#888888'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Reduced bonus for partial completion
        const partialBonus = Math.floor(this.currentParadoxMultiplier * 50);
        this.scene.score += partialBonus;
        
        // End paradox
        this.endParadox();
    }
    
    completeParadox() {
        const player = this.scene.player;
        
        // Calculate final bonus
        const completionRatio = 1 - (this.pathDeviation / this.maxDeviation);
        const finalMultiplier = this.currentParadoxMultiplier * completionRatio;
        const bonus = Math.floor(finalMultiplier * 200);
        
        this.scene.score += bonus;
        
        // Show completion text
        const text = this.scene.add.text(
            player.x,
            player.y - 80,
            `PARADOX COMPLETE +${bonus}`,
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#00ff00'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            scale: 1.3,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Award temporary Phase mod to Omni-Weapon
        if (this.scene.omniWeapon) {
            this.grantTemporaryPhaseMod();
        }
        
        // End paradox
        this.endParadox();
    }
    
    grantTemporaryPhaseMod() {
        // Temporarily add phasing capability
        const omni = this.scene.omniWeapon;
        const originalPhasing = omni.weaponStats.phasing;
        
        omni.weaponStats.phasing = true;
        
        // Visual notification
        const player = this.scene.player;
        const text = this.scene.add.text(
            player.x,
            player.y - 50,
            'PHASE MOD ACTIVE (10s)',
            {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#00f0ff'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 2000,
            delay: 8000,
            onComplete: () => {
                text.destroy();
                omni.weaponStats.phasing = originalPhasing;
            }
        });
    }
    
    endParadox() {
        this.paradoxActive = false;
        this.committedPath = [];
        this.projectionCooldown = this.projectionCooldownMax;

        // UnifiedGraphicsManager clears layers automatically each frame
        
        this.paradoxOverlay.setVisible(false);
        this.paradoxOverlay.setAlpha(0);
    }
    
    render() {
        const manager = this.scene.graphicsManager;
        if (!manager) return;

        // UnifiedGraphicsManager clears layers automatically each frame

        if (this.isProjecting && this.futureEcho.active) {
            this.renderFutureEcho(manager);
            this.renderBulletPredictions(manager);
            this.renderSafeZones(manager);
        }
    }
    
    renderFutureEcho(manager) {
        // Draw future echo silhouette on 'effects' layer
        const lastPoint = this.futureEcho.path[this.futureEcho.path.length - 1];
        if (!lastPoint) return;

        // Draw translucent echo at end of path
        manager.drawCircle('effects', lastPoint.x, lastPoint.y, 15, this.ECHO_COLOR, 0.3);

        // Draw echo outline (stroke circle)
        manager.drawCircle('effects', lastPoint.x, lastPoint.y, 15, this.ECHO_COLOR, 0.6, 2, true);

        // Draw path line
        for (let i = 1; i < this.futureEcho.path.length; i++) {
            const p1 = this.futureEcho.path[i - 1];
            const p2 = this.futureEcho.path[i];
            manager.drawLine('effects', p1.x, p1.y, p2.x, p2.y, this.ECHO_COLOR, 0.4, 2);
        }

        // Draw velocity indicator
        const vx = this.futureEcho.vx;
        const vy = this.futureEcho.vy;
        const speed = Math.sqrt(vx * vx + vy * vy);

        if (speed > 10) {
            const angle = Math.atan2(vy, vx);
            const arrowLen = 30;
            const endX = lastPoint.x + Math.cos(angle) * arrowLen;
            const endY = lastPoint.y + Math.sin(angle) * arrowLen;

            manager.drawLine('effects', lastPoint.x, lastPoint.y, endX, endY, this.ECHO_COLOR, 0.8, 2);

            // Arrowhead (two lines)
            const headSize = 8;
            manager.drawLine('effects',
                endX, endY,
                endX - Math.cos(angle - 0.5) * headSize,
                endY - Math.sin(angle - 0.5) * headSize,
                this.ECHO_COLOR, 0.8, 2
            );
            manager.drawLine('effects',
                endX, endY,
                endX - Math.cos(angle + 0.5) * headSize,
                endY - Math.sin(angle + 0.5) * headSize,
                this.ECHO_COLOR, 0.8, 2
            );
        }
    }
    
    renderBulletPredictions(manager) {
        this.bulletPredictions.forEach(pred => {
            // Draw prediction line on 'effects' layer
            for (let i = 1; i < pred.path.length; i++) {
                const p1 = pred.path[i - 1];
                const p2 = pred.path[i];
                manager.drawLine('effects', p1.x, p1.y, p2.x, p2.y, this.PREDICTION_COLOR, 0.3, 1);
            }

            // Draw endpoint marker
            const end = pred.path[pred.path.length - 1];
            manager.drawCircle('effects', end.x, end.y, 3, this.PREDICTION_COLOR, 0.2);
        });
    }
    
    renderSafeZones(manager) {
        // Calculate safe corridors between bullet predictions
        const safePoints = [];

        this.futureEcho.path.forEach(point => {
            let minBulletDist = Infinity;

            this.bulletPredictions.forEach(pred => {
                // Find closest bullet prediction point
                pred.path.forEach(bulletPoint => {
                    const dist = Phaser.Math.Distance.Between(
                        point.x, point.y,
                        bulletPoint.x, bulletPoint.y
                    );
                    minBulletDist = Math.min(minBulletDist, dist);
                });
            });

            // If far from bullets, mark as safe
            if (minBulletDist > 80) {
                safePoints.push({ ...point, safety: minBulletDist });
            }
        });

        // Draw safe zone indicators on 'effects' layer
        safePoints.forEach(point => {
            const alpha = Math.min(0.3, (point.safety - 80) / 100 * 0.3);
            manager.drawCircle('effects', point.x, point.y, 8, this.SAFE_COLOR, alpha);
        });
    }
    
    /**
     * Called when player takes damage during paradox
     * Taking damage doesn't fail paradox, but reduces multiplier
     */
    onPlayerDamaged() {
        if (this.paradoxActive) {
            this.currentParadoxMultiplier = Math.max(1.0, this.currentParadoxMultiplier - 0.5);
            
            // Visual feedback
            const player = this.scene.player;
            const text = this.scene.add.text(
                player.x,
                player.y - 40,
                'MULTIPLIER DROP',
                {
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fill: '#ff6666'
                }
            ).setOrigin(0.5);
            
            this.scene.tweens.add({
                targets: text,
                y: text.y - 20,
                alpha: 0,
                duration: 600,
                onComplete: () => text.destroy()
            });
        }
    }
    
    /**
     * Check if echo storm absorption should be doubled
     * During projection, echoes can graze predicted bullets
     */
    checkEchoAbsorptionBonus(bulletX, bulletY) {
        if (!this.isProjecting) return false;
        
        // Check if bullet is in predictions
        for (const pred of this.bulletPredictions) {
            for (const point of pred.path) {
                const dist = Phaser.Math.Distance.Between(
                    bulletX, bulletY,
                    point.x, point.y
                );
                if (dist < 20) {
                    return true; // Double absorption
                }
            }
        }
        return false;
    }
    
    /**
     * Get safe path hints for AI or player guidance
     */
    getSafePathHints() {
        if (!this.isProjecting) return [];
        
        return this.futureEcho.path.filter(point => {
            // Check if point is safe (far from bullets)
            for (const pred of this.bulletPredictions) {
                for (const bulletPoint of pred.path) {
                    const dist = Phaser.Math.Distance.Between(
                        point.x, point.y,
                        bulletPoint.x, bulletPoint.y
                    );
                    if (dist < 60) return false;
                }
            }
            return true;
        });
    }
    
    /**
     * Clean up resources when the system is destroyed
     */
    destroy() {
        // UnifiedGraphicsManager clears layers automatically each frame
        
        // Clean up paradox overlay
        if (this.paradoxOverlay) {
            this.paradoxOverlay.destroy();
            this.paradoxOverlay = null;
        }
        
        // Reset state
        this.isProjecting = false;
        this.paradoxActive = false;
        this.committedPath = [];
        this.bulletPredictions = [];
        this.futureEcho.active = false;
    }
}
