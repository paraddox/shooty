import Phaser from 'phaser';

/**
 * Chrono-Loop System - Temporal Recursion & Self-Synergy
 * 
 * Press T to start recording. Fight for 4 seconds — every movement, shot,
 * and ability is recorded. When the recording ends, a "Past Echo" spawns and
 * replays exactly what you did. You now fight alongside yourself.
 * 
 * Stack multiple loops: Up to 3 Past Echoes can exist simultaneously,
 * creating a squadron of you-from-the-past fighting in perfect choreography.
 * 
 * Synergies:
 * - Echo Storm: Past Echoes also graze and absorb echoes
 * - Fracture: Ghost player can record separate loops — 4 timelines converge
 * - Residue: Past Echoes spawn their own residue nodes (temporal cascade)
 * - Singularity: Record deploying a singularity, watch your past self charge
 *   while your present self detonates it
 * - Paradox Engine: Past Echo predictions show their future paths too
 * - Omni-Weapon: Past Echoes inherit your current weapon mods
 * - Resonance Cascade: Each loop completion adds +2 chain levels
 * 
 * Color: Deep Teal (#008080) - the color of recursive time
 * 
 * This transforms solo bullet hell into CHOREOGRAPHED TEMPORAL WARFARE.
 * You are your own best ally.
 */

export default class ChronoLoopSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Recording state
        this.isRecording = false;
        this.recordStartTime = 0;
        this.recordDuration = 4.0; // Seconds to record
        this.recordedActions = []; // Array of timestamped actions
        this.recordCooldown = 0;
        this.recordCooldownMax = 1.0;
        
        // Loop playback state
        this.pastEchoes = []; // Active Past Echo entities
        this.maxEchoes = 3; // Maximum simultaneous echoes
        this.echoLifespan = 8.0; // Seconds each echo lives
        
        // Visuals
        this.recordingRing = null;
        this.echoGraphics = null;
        this.trailGraphics = null;
        this.loopIndicator = null;
        
        // Input
        this.tKey = null;
        
        // Colors
        this.TEAL_COLOR = 0x008080;
        this.TEAL_GLOW = 0x00cccc;
        this.TEAL_DARK = 0x004040;
        
        // Audio feedback (visual only)
        this.pulsePhase = 0;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
    }
    
    createVisuals() {
        // Note: Graphics rendering is now handled by UnifiedGraphicsManager
        // All visual effects are drawn via the 'effects' layer
        
        // UI indicator for available loops (container-based, not graphics)
        this.createLoopIndicator();
    }
    
    createLoopIndicator() {
        const margin = 30;
        
        // Container for loop indicators
        this.loopIndicator = this.scene.add.container(margin + 100, margin + 105);
        this.loopIndicator.setScrollFactor(0);
        this.loopIndicator.setDepth(100);
        
        // Background bar
        const bg = this.scene.add.rectangle(0, 0, 60, 8, 0x22222a);
        this.loopIndicator.add(bg);
        
        // Teal segments for each possible echo
        this.loopSegments = [];
        for (let i = 0; i < this.maxEchoes; i++) {
            const segment = this.scene.add.rectangle(
                -25 + i * 21, 0, 18, 6, this.TEAL_COLOR, 0.3
            );
            segment.setOrigin(0, 0.5);
            this.loopSegments.push(segment);
            this.loopIndicator.add(segment);
        }
        
        // Recording progress bar (hidden by default)
        this.recordProgressBar = this.scene.add.rectangle(-30, 0, 0, 4, this.TEAL_GLOW);
        this.recordProgressBar.setOrigin(0, 0.5);
        this.recordProgressBar.setVisible(false);
        this.loopIndicator.add(this.recordProgressBar);
        
        // Label
        const label = this.scene.add.text(0, -12, 'LOOPS', {
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: 1,
            fill: '#008080'
        }).setOrigin(0.5);
        this.loopIndicator.add(label);
    }
    
    setupInput() {
        this.tKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.tKey.on('down', () => this.onTPressed());
    }
    
    onTPressed() {
        if (this.isRecording) {
            // Early stop - still creates echo but with partial recording
            this.stopRecording();
        } else if (this.recordCooldown <= 0 && this.pastEchoes.length < this.maxEchoes) {
            // Start recording
            this.startRecording();
        }
    }
    
    startRecording() {
        if (!this.scene.player.active) return;
        
        this.isRecording = true;
        this.recordStartTime = this.scene.time.now / 1000;
        this.recordedActions = [];
        
        // Record initial state
        this.recordAction('spawn', {
            x: this.scene.player.x,
            y: this.scene.player.y,
            rotation: this.scene.player.rotation
        });
        
        // Show progress bar
        this.recordProgressBar.setVisible(true);
        this.recordProgressBar.width = 0;
        
        // Note: Recording ring is now drawn via UnifiedGraphicsManager in updateRecordingVisuals()
        
        // Announcement
        this.showRecordingText();
        
        // Record for Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('LOOP_START');
        }
        
        // Synchronicity Cascade: chrono-loop activation
        if (this.scene.synchronicityCascade) {
            this.scene.synchronicityCascade.onSystemActivate('chronoLoop');
        }
    }
    
    stopRecording() {
        if (!this.isRecording) return;
        
        this.isRecording = false;
        this.recordProgressBar.setVisible(false);
        // Note: Recording ring is now cleared via UnifiedGraphicsManager (no visibility toggle needed)
        
        // Create Past Echo from recording
        if (this.recordedActions.length > 5) { // Minimum actions to be useful
            this.spawnPastEcho();
        }
        
        // Start cooldown
        this.recordCooldown = this.recordCooldownMax;
    }
    
    spawnPastEcho() {
        const echo = {
            actions: [...this.recordedActions],
            actionIndex: 0,
            spawnTime: this.scene.time.now / 1000,
            lifespan: this.echoLifespan,
            x: this.recordedActions[0].data.x,
            y: this.recordedActions[0].data.y,
            rotation: this.recordedActions[0].data.rotation || 0,
            health: 100,
            trail: [], // Position history for trail effect
            flashTime: 0,
            isDying: false
        };
        
        // If at max echoes, remove oldest
        if (this.pastEchoes.length >= this.maxEchoes) {
            const oldest = this.pastEchoes.shift();
            this.dissipateEcho(oldest);
        }
        
        this.pastEchoes.push(echo);
        
        // Spawn effect
        this.spawnEchoEffect(echo.x, echo.y);
        
        // Update UI
        this.updateLoopIndicator();
        
        // Announcement
        const echoNumber = this.pastEchoes.length;
        const text = echoNumber === 1 ? 'PAST ECHO' : `ECHO ×${echoNumber}`;
        this.showEchoText(text);
        
        // Record for Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('LOOP_COMPLETE', { 
                echoCount: echoNumber 
            });
        }
        
        // Notify Omni-Weapon
        if (this.scene.omniWeapon) {
            this.scene.omniWeapon.onChronoLoopComplete();
        }
        
        // Harmonic Convergence: chrono-loop activates harmony layer
        if (this.scene.harmonicConvergence) {
            this.scene.harmonicConvergence.onChronoLoopStart();
        }
    }
    
    spawnEchoEffect(x, y) {
        // Teal explosion
        const ring = this.scene.add.graphics();
        ring.lineStyle(3, this.TEAL_COLOR, 0.8);
        ring.strokeCircle(x, y, 20);
        ring.setDepth(55);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 2.5,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
        
        // Particles
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            const particle = this.scene.add.circle(
                x + Math.cos(angle) * 15,
                y + Math.sin(angle) * 15,
                3,
                this.TEAL_GLOW
            );
            particle.setDepth(55);
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * 50,
                y: y + Math.sin(angle) * 50,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    dissipateEcho(echo) {
        echo.isDying = true;
        
        // Fade out effect
        const fade = this.scene.add.graphics();
        fade.fillStyle(this.TEAL_COLOR, 0.4);
        fade.fillCircle(echo.x, echo.y, 25);
        fade.setDepth(54);
        
        this.scene.tweens.add({
            targets: fade,
            scale: 1.5,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => fade.destroy()
        });
    }
    
    recordAction(type, data) {
        const timestamp = (this.scene.time.now / 1000) - this.recordStartTime;
        this.recordedActions.push({
            type,
            timestamp,
            data
        });
    }
    
    update(dt) {
        // Update cooldown
        if (this.recordCooldown > 0) {
            this.recordCooldown -= dt;
            if (this.recordCooldown < 0) this.recordCooldown = 0;
        }
        
        // Update recording
        if (this.isRecording) {
            this.updateRecording(dt);
        }
        
        // Update echoes
        this.updateEchoes(dt);
        
        // Update visuals
        this.renderEchoes();
        this.updateRecordingVisuals(dt);
        this.updateLoopIndicator();
    }
    
    updateRecording(dt) {
        const elapsed = (this.scene.time.now / 1000) - this.recordStartTime;
        
        // Auto-stop when duration reached
        if (elapsed >= this.recordDuration) {
            this.stopRecording();
            return;
        }
        
        // Record player state
        const player = this.scene.player;
        
        // Only record if moved significantly or fired
        const lastAction = this.recordedActions[this.recordedActions.length - 1];
        const shouldRecord = !lastAction || 
            Phaser.Math.Distance.Between(
                lastAction.data.x || 0, lastAction.data.y || 0,
                player.x, player.y
            ) > 2 ||
            (player.lastFired && player.lastFired > (this.lastRecordFire || 0));
        
        if (shouldRecord) {
            this.recordAction('state', {
                x: player.x,
                y: player.y,
                rotation: player.rotation,
                velocityX: player.body.velocity.x,
                velocityY: player.body.velocity.y
            });
            
            if (player.lastFired && player.lastFired > (this.lastRecordFire || 0)) {
                this.recordAction('fire', {
                    x: player.x,
                    y: player.y,
                    rotation: player.rotation
                });
                this.lastRecordFire = player.lastFired;
            }
        }
        
        // Update progress bar
        const progress = elapsed / this.recordDuration;
        this.recordProgressBar.width = 60 * progress;
    }
    
    updateEchoes(dt) {
        const now = this.scene.time.now / 1000;
        
        this.pastEchoes = this.pastEchoes.filter(echo => {
            if (echo.isDying) return false;
            
            const age = now - echo.spawnTime;
            
            // Check lifespan
            if (age >= echo.lifespan) {
                this.dissipateEcho(echo);
                return false;
            }
            
            // Advance through recorded actions
            while (echo.actionIndex < echo.actions.length) {
                const action = echo.actions[echo.actionIndex];
                
                if (age >= action.timestamp) {
                    this.applyEchoAction(echo, action);
                    echo.actionIndex++;
                } else {
                    break;
                }
            }
            
            // If finished all actions, loop back to beginning (create cycle)
            if (echo.actionIndex >= echo.actions.length) {
                echo.actionIndex = 0;
                echo.spawnTime = now; // Reset timing for loop
            }
            
            // Update trail
            echo.trail.push({ x: echo.x, y: echo.y, age: 0 });
            echo.trail = echo.trail.filter(t => {
                t.age += dt;
                return t.age < 0.5; // Keep 0.5 seconds of trail
            });
            
            return true;
        });
    }
    
    applyEchoAction(echo, action) {
        switch (action.type) {
            case 'spawn':
            case 'state':
                echo.x = action.data.x;
                echo.y = action.data.y;
                echo.rotation = action.data.rotation || 0;
                break;
                
            case 'fire':
                this.fireEchoBullet(echo, action.data);
                break;
        }
    }
    
    fireEchoBullet(echo, data) {
        // Get aim direction from rotation
        const angle = data.rotation - Math.PI / 2;
        
        // Create bullet at echo position
        const bullet = this.scene.getBulletsGroup().get(echo.x, echo.y, 'bullet');
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(1);
            bullet.body.enable = true;
            bullet.body.reset(echo.x, echo.y);
            
            // Echo bullets are teal-tinted
            bullet.setTint(this.TEAL_COLOR);
            bullet.setScale(0.45);
            bullet.isEchoBullet = true;
            
            const bulletSpeed = 500;
            bullet.setVelocity(
                Math.cos(angle) * bulletSpeed,
                Math.sin(angle) * bulletSpeed
            );
            bullet.setRotation(angle);
            
            // Small muzzle flash
            const flash = this.scene.add.ellipse(
                echo.x + Math.cos(angle) * 15,
                echo.y + Math.sin(angle) * 15,
                8, 4, this.TEAL_GLOW
            );
            flash.setRotation(angle);
            flash.setDepth(2);
            
            this.scene.tweens.add({
                targets: flash,
                alpha: 0,
                scale: 2,
                duration: 100,
                onComplete: () => flash.destroy()
            });
            
            // Apply omni-weapon effects if active
            if (this.scene.omniWeapon) {
                this.scene.omniWeapon.applyBulletEffects(bullet);
            }
        }
    }
    
    renderEchoes() {
        // Note: Graphics clearing is now handled by UnifiedGraphicsManager (single clear per frame per layer)
        const gm = this.scene.graphicsManager;
        if (!gm) return;
        
        const now = this.scene.time.now / 1000;
        
        this.pastEchoes.forEach((echo, index) => {
            const age = now - echo.spawnTime;
            const lifeRatio = 1 - (age / echo.lifespan);
            
            // Draw trail
            echo.trail.forEach((point, i) => {
                const trailAlpha = (1 - point.age / 0.5) * 0.3 * lifeRatio;
                const size = 4 * (1 - point.age / 0.5);
                gm.drawCircle('effects', point.x, point.y, size, this.TEAL_COLOR, trailAlpha);
            });
            
            // Draw echo ship (triangle like player but teal)
            const size = 15;
            const cos = Math.cos(echo.rotation);
            const sin = Math.sin(echo.rotation);
            
            // Calculate triangle points
            const tipX = echo.x + cos * size;
            const tipY = echo.y + sin * size;
            const leftX = echo.x + Math.cos(echo.rotation - 2.5) * size * 0.7;
            const leftY = echo.y + Math.sin(echo.rotation - 2.5) * size * 0.7;
            const rightX = echo.x + Math.cos(echo.rotation + 2.5) * size * 0.7;
            const rightY = echo.y + Math.sin(echo.rotation + 2.5) * size * 0.7;
            
            // Glow
            const pulse = 0.5 + Math.sin(this.pulsePhase + index) * 0.2;
            gm.drawCircle('effects', echo.x, echo.y, size * 1.2, this.TEAL_COLOR, 0.3 * lifeRatio * pulse);
            
            // Core triangle - drawn as a path
            gm.drawPath('effects', [
                { x: tipX, y: tipY },
                { x: leftX, y: leftY },
                { x: rightX, y: rightY },
                { x: tipX, y: tipY } // Close the triangle
            ], this.TEAL_GLOW, 0.8 * lifeRatio, 1.5);
            
            // Echo number indicator
            if (index > 0) {
                gm.drawCircle('effects', echo.x, echo.y - 20, 6, this.TEAL_COLOR, 0.6 * lifeRatio);
            }
        });
    }
    
    updateRecordingVisuals(dt) {
        this.pulsePhase += dt * 4;
        
        const gm = this.scene.graphicsManager;
        if (!gm) return;
        
        if (this.isRecording) {
            // Note: Graphics clearing is handled by UnifiedGraphicsManager
            
            const player = this.scene.player;
            const pulse = 0.7 + Math.sin(this.pulsePhase * 2) * 0.3;
            const radius = 35 + pulse * 5;
            
            // Pulsing recording ring - drawn as two circles for ring effect
            gm.drawCircle('effects', player.x, player.y, radius, this.TEAL_GLOW, 0.8);
            gm.drawCircle('effects', player.x, player.y, radius - 2, 0x000000, 1); // Cutout center for ring
            
            // Recording dots
            const dotCount = 8;
            for (let i = 0; i < dotCount; i++) {
                const angle = (Math.PI * 2 / dotCount) * i + this.pulsePhase;
                const dotX = player.x + Math.cos(angle) * radius;
                const dotY = player.y + Math.sin(angle) * radius;
                const dotAlpha = 0.6 + Math.sin(angle * 3) * 0.4;
                
                gm.drawCircle('effects', dotX, dotY, 3, this.TEAL_GLOW, dotAlpha);
            }
            
            // "REC" indicator dot
            gm.drawCircle('effects', player.x - 25, player.y - 35, 4, this.TEAL_GLOW, 1);
        }
    }
    
    updateLoopIndicator() {
        // Update segment colors based on active echoes
        this.loopSegments.forEach((segment, i) => {
            if (i < this.pastEchoes.length) {
                segment.fillColor = this.TEAL_GLOW;
                segment.alpha = 0.9;
            } else {
                segment.fillColor = this.TEAL_COLOR;
                segment.alpha = 0.3;
            }
        });
    }
    
    showRecordingText() {
        const player = this.scene.player;
        const text = this.scene.add.text(player.x, player.y - 60, 'RECORDING', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            letterSpacing: 2,
            fill: '#00cccc'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    showEchoText(textContent) {
        const player = this.scene.player;
        const text = this.scene.add.text(player.x, player.y - 60, textContent, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fontStyle: 'bold',
            letterSpacing: 1,
            fill: '#008080'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            scale: 1.2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    /**
     * Check if an echo was hit by a bullet (echoes can tank shots)
     */
    checkEchoCollision(bulletX, bulletY, bulletRadius = 5) {
        for (const echo of this.pastEchoes) {
            if (echo.isDying) continue;
            
            const dist = Phaser.Math.Distance.Between(bulletX, bulletY, echo.x, echo.y);
            if (dist <= 15 + bulletRadius) {
                this.damageEcho(echo);
                return true; // Bullet was absorbed by echo
            }
        }
        return false;
    }
    
    damageEcho(echo) {
        echo.health -= 10;
        echo.flashTime = this.scene.time.now / 1000;
        
        // Hit effect
        const hit = this.scene.add.graphics();
        hit.fillStyle(0xffffff, 0.5);
        hit.fillCircle(echo.x, echo.y, 15);
        hit.setDepth(55);
        
        this.scene.tweens.add({
            targets: hit,
            alpha: 0,
            scale: 1.5,
            duration: 150,
            onComplete: () => hit.destroy()
        });
        
        if (echo.health <= 0) {
            this.destroyEcho(echo);
        }
    }
    
    destroyEcho(echo) {
        echo.isDying = true;
        
        // Explosion effect
        const explosion = this.scene.add.graphics();
        explosion.fillStyle(this.TEAL_COLOR, 0.5);
        explosion.fillCircle(echo.x, echo.y, 30);
        explosion.setDepth(55);
        
        this.scene.tweens.add({
            targets: explosion,
            scale: 2,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => explosion.destroy()
        });
        
        // Screen shake
        this.scene.cameras.main.shake(80, 0.003);
        
        // Remove from array
        const index = this.pastEchoes.indexOf(echo);
        if (index > -1) {
            this.pastEchoes.splice(index, 1);
        }
        
        this.updateLoopIndicator();
    }
    
    /**
     * Get echoes for external systems (residue, echo storm, etc.)
     */
    getEchoPositions() {
        return this.pastEchoes.filter(e => !e.isDying).map(e => ({
            x: e.x,
            y: e.y,
            rotation: e.rotation
        }));
    }
    
    destroy() {
        // Note: UnifiedGraphicsManager handles cleanup of its own graphics objects
        this.loopIndicator.destroy();
        
        // Clean up echoes
        this.pastEchoes = [];
    }
}
