import Phaser from 'phaser';

/**
 * CinematicArchiveSystem - The Memory That Outlives the Moment
 * 
 * Automatically captures screenshots during "movie moments" — when multiple
 * temporal systems create emergent spectacles. Creates a persistent gallery
 * of mastery with full system-state metadata for retroactive study.
 * 
 * Core Innovation: The game recognizes when you're having a "moment" and
 * automatically saves it for posterity, complete with what systems were active,
 * your score, and the exact temporal choreography you achieved.
 * 
 * Color: Amber (#ffbf00) - the color of preserved memory and cinematic film
 */

export default class CinematicArchiveSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.AMBER_COLOR = 0xffbf00;
        this.AMBER_GLOW = 0xffd700;
        this.CAPTURE_COOLDOWN = 2000; // ms between captures
        this.MOMENT_DETECTION_WINDOW = 3000; // ms to evaluate "movie moments"
        
        // Capture state
        this.lastCaptureTime = 0;
        this.capturesThisRun = 0;
        this.maxCapturesPerRun = 12;
        
        // Moment detection scoring
        this.momentScore = 0;
        this.activeSystemsSnapshot = [];
        this.lastMomentCheck = 0;
        
        // Archive storage (in-memory for session, persisted to localStorage)
        this.sessionCaptures = [];
        
        // Visual feedback
        this.captureFlash = null;
        this.frameOverlay = null;
        this.letterboxBars = [];
        
        // Composite score thresholds for auto-capture
        this.MOMENT_THRESHOLDS = {
            EPIC: 800,      // Auto-capture guaranteed
            RARE: 500,      // 70% chance to capture
            GOOD: 300,      // 30% chance to capture
            BASE: 100       // No auto-capture, but track
        };
        
        this.init();
    }
    
    init() {
        // Use UnifiedGraphicsManager if available (new architecture)
        if (this.scene.graphicsManager) {
            this.useUnifiedRenderer = true;
        }
        
        this.loadExistingArchive();
        this.createVisualFeedback();
        this.setupInputHandlers();
    }
    
    createVisualFeedback() {
        // Flash effect for capture
        this.captureFlash = this.scene.add.rectangle(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            this.scene.scale.width,
            this.scene.scale.height,
            0xffffff,
            0
        );
        this.captureFlash.setScrollFactor(0);
        this.captureFlash.setDepth(1000);
        
        // Cinematic frame overlay (subtle amber border)
        // Use UnifiedGraphicsManager if available, else legacy graphics
        if (!this.useUnifiedRenderer) {
            this.frameOverlay = this.scene.add.graphics();
            this.frameOverlay.setScrollFactor(0);
            this.frameOverlay.setDepth(999);
        }
        
        // Letterbox bars for "cinematic mode"
        const barHeight = 40;
        this.letterboxBars = [
            this.scene.add.rectangle(
                this.scene.scale.width / 2, barHeight / 2,
                this.scene.scale.width, barHeight,
                0x0a0a0f, 1
            ).setScrollFactor(0).setDepth(998).setVisible(false),
            this.scene.add.rectangle(
                this.scene.scale.width / 2, this.scene.scale.height - barHeight / 2,
                this.scene.scale.width, barHeight,
                0x0a0a0f, 1
            ).setScrollFactor(0).setDepth(998).setVisible(false)
        ];
        
        this.drawFrameOverlay();
    }
    
    drawFrameOverlay() {
        const w = this.scene.scale.width;
        const h = this.scene.scale.height;
        const thickness = 2;
        const cornerSize = 30;
        
        if (this.useUnifiedRenderer && this.scene.graphicsManager) {
            // New way: register commands with UnifiedGraphicsManager on 'effects' layer
            // Amber corner brackets (subtle cinematic framing)
            // Top-left
            this.scene.graphicsManager.drawLine('effects', 10, 10, 10 + cornerSize, 10, this.AMBER_COLOR, 0.3, thickness);
            this.scene.graphicsManager.drawLine('effects', 10, 10, 10, 10 + cornerSize, this.AMBER_COLOR, 0.3, thickness);
            // Top-right
            this.scene.graphicsManager.drawLine('effects', w - 10, 10, w - 10 - cornerSize, 10, this.AMBER_COLOR, 0.3, thickness);
            this.scene.graphicsManager.drawLine('effects', w - 10, 10, w - 10, 10 + cornerSize, this.AMBER_COLOR, 0.3, thickness);
            // Bottom-left
            this.scene.graphicsManager.drawLine('effects', 10, h - 10, 10 + cornerSize, h - 10, this.AMBER_COLOR, 0.3, thickness);
            this.scene.graphicsManager.drawLine('effects', 10, h - 10, 10, h - 10 - cornerSize, this.AMBER_COLOR, 0.3, thickness);
            // Bottom-right
            this.scene.graphicsManager.drawLine('effects', w - 10, h - 10, w - 10 - cornerSize, h - 10, this.AMBER_COLOR, 0.3, thickness);
            this.scene.graphicsManager.drawLine('effects', w - 10, h - 10, w - 10, h - 10 - cornerSize, this.AMBER_COLOR, 0.3, thickness);
        } else {
            // Legacy way: direct graphics manipulation
            this.frameOverlay.clear();
            this.frameOverlay.lineStyle(thickness, this.AMBER_COLOR, 0.3);
            
            // Top-left
            this.frameOverlay.lineBetween(10, 10, 10 + cornerSize, 10);
            this.frameOverlay.lineBetween(10, 10, 10, 10 + cornerSize);
            // Top-right
            this.frameOverlay.lineBetween(w - 10, 10, w - 10 - cornerSize, 10);
            this.frameOverlay.lineBetween(w - 10, 10, w - 10, 10 + cornerSize);
            // Bottom-left
            this.frameOverlay.lineBetween(10, h - 10, 10 + cornerSize, h - 10);
            this.frameOverlay.lineBetween(10, h - 10, 10, h - 10 - cornerSize);
            // Bottom-right
            this.frameOverlay.lineBetween(w - 10, h - 10, w - 10 - cornerSize, h - 10);
            this.frameOverlay.lineBetween(w - 10, h - 10, w - 10, h - 10 - cornerSize);
        }
    }
    
    setupInputHandlers() {
        // Manual capture with F12 (screenshot key convention)
        this.scene.input.keyboard.on('keydown-F12', (event) => {
            event.preventDefault();
            this.manualCapture();
        });
        
        // C key for cinematic mode toggle
        this.scene.input.keyboard.on('keydown-C', () => {
            this.toggleCinematicMode();
        });
    }
    
    update(dt, time) {
        // Check for movie moments every 100ms
        this.lastMomentCheck += dt;
        if (this.lastMomentCheck >= 100) {
            this.evaluateMomentScore(time);
            this.lastMomentCheck = 0;
        }
        
        // Update UI elements if needed
        this.updateCaptureIndicator(dt);
    }
    
    evaluateMomentScore(time) {
        this.momentScore = 0;
        this.activeSystemsSnapshot = [];
        
        // Score based on active temporal systems and their states
        
        // Near-miss bullet time active (rare and intense)
        if (this.scene.nearMissState?.active) {
            this.momentScore += 150;
            this.activeSystemsSnapshot.push('BULLET_TIME');
            
            // Higher score for streaks
            if (this.scene.nearMissState.streak > 1) {
                this.momentScore += this.scene.nearMissState.streak * 50;
            }
        }
        
        // Echo Storm grazing (skill expression)
        if (this.scene.echoStorm?.activeEchoes?.length > 0) {
            const echoCount = this.scene.echoStorm.activeEchoes.length;
            this.momentScore += echoCount * 30;
            this.activeSystemsSnapshot.push(`ECHO_STORM×${echoCount}`);
        }
        
        // Fracture Protocol active (split consciousness)
        if (this.scene.fractureSystem?.isFractured) {
            this.momentScore += 200;
            this.activeSystemsSnapshot.push('FRACTURE');
        }
        
        // Resonance Cascade high multiplier
        if (this.scene.resonanceCascade) {
            const multiplier = this.scene.resonanceCascade.getDamageMultiplier();
            if (multiplier > 1.5) {
                this.momentScore += (multiplier - 1) * 100;
                this.activeSystemsSnapshot.push(`RESONANCE×${multiplier.toFixed(1)}`);
            }
            
            // Chain length
            const chain = this.scene.resonanceCascade.getCurrentChain();
            if (chain.length >= 3) {
                this.momentScore += chain.length * 40;
            }
        }
        
        // Temporal Singularity deployed
        if (this.scene.singularitySystem?.singularityActive) {
            const trapped = this.scene.singularitySystem.getTrappedBulletCount?.() || 0;
            this.momentScore += 100 + trapped * 20;
            this.activeSystemsSnapshot.push(`SINGULARITY×${trapped}`);
        }
        
        // Chrono-Loop echoes active
        if (this.scene.chronoLoop?.pastEchoes?.length > 0) {
            const echoCount = this.scene.chronoLoop.pastEchoes.length;
            this.momentScore += echoCount * 80;
            this.activeSystemsSnapshot.push(`CHRONO_LOOP×${echoCount}`);
        }
        
        // Quantum Immortality echoes active
        if (this.scene.quantumImmortality?.quantumEchoes?.length > 0) {
            const echoCount = this.scene.quantumImmortality.quantumEchoes.length;
            this.momentScore += echoCount * 60;
            this.activeSystemsSnapshot.push(`QUANTUM×${echoCount}`);
        }
        
        // Paradox Engine active
        if (this.scene.paradoxEngine?.paradoxActive) {
            const multiplier = this.scene.paradoxEngine.currentParadoxMultiplier || 2;
            this.momentScore += multiplier * 100;
            this.activeSystemsSnapshot.push(`PARADOX×${multiplier.toFixed(1)}`);
        }
        
        // Void Coherence high level
        if (this.scene.voidCoherence) {
            const coherence = this.scene.voidCoherence.coherenceLevel;
            if (coherence > 50) {
                this.momentScore += coherence;
                this.activeSystemsSnapshot.push(`VOID_${coherence.toFixed(0)}%`);
            }
        }
        
        // Causal Entanglement network active
        if (this.scene.causalEntanglement?.entanglements?.length > 0) {
            const links = this.scene.causalEntanglement.entanglements.length;
            this.momentScore += links * 50;
            this.activeSystemsSnapshot.push(`ENTANGLE×${links}`);
        }
        
        // Tesseract Titan fight
        if (this.scene.tesseractTitan?.active) {
            this.momentScore += 300;
            const phase = this.scene.tesseractTitan.phase;
            this.activeSystemsSnapshot.push(`TITAN_P${phase}`);
        }
        
        // Temporal Contract active
        if (this.scene.temporalContract?.activeContract) {
            this.momentScore += 100;
            this.activeSystemsSnapshot.push('CONTRACT');
        }
        
        // Multi-system synthesis bonus (the magic number)
        const uniqueSystems = new Set(this.activeSystemsSnapshot.map(s => s.split('×')[0])).size;
        if (uniqueSystems >= 4) {
            this.momentScore += uniqueSystems * uniqueSystems * 25; // Quadratic bonus
            this.activeSystemsSnapshot.push(`SYNTHESIS×${uniqueSystems}`);
        }
        
        // Score and wave context
        this.momentScore += (this.scene.score || 0) / 1000;
        this.momentScore += (this.scene.wave || 1) * 10;
        
        // Check for auto-capture
        this.checkAutoCapture(time);
    }
    
    checkAutoCapture(time) {
        const timeSinceLast = time - this.lastCaptureTime;
        if (timeSinceLast < this.CAPTURE_COOLDOWN) return;
        if (this.capturesThisRun >= this.maxCapturesPerRun) return;
        
        let shouldCapture = false;
        let captureQuality = 'BASE';
        
        if (this.momentScore >= this.MOMENT_THRESHOLDS.EPIC) {
            shouldCapture = true;
            captureQuality = 'EPIC';
        } else if (this.momentScore >= this.MOMENT_THRESHOLDS.RARE) {
            shouldCapture = Math.random() < 0.7;
            captureQuality = 'RARE';
        } else if (this.momentScore >= this.MOMENT_THRESHOLDS.GOOD) {
            shouldCapture = Math.random() < 0.3;
            captureQuality = 'GOOD';
        }
        
        if (shouldCapture) {
            this.captureMoment(captureQuality, true);
        }
    }
    
    async captureMoment(quality = 'MANUAL', auto = false) {
        const now = this.scene.time.now;
        this.lastCaptureTime = now;
        this.capturesThisRun++;
        
        // Flash effect
        this.triggerCaptureFlash();
        
        // Show capture notification
        this.showCaptureNotification(quality, auto);
        
        // Gather comprehensive metadata
        const captureData = this.gatherCaptureMetadata(quality);
        
        // Save to session archive
        this.sessionCaptures.push(captureData);
        
        // Persist to localStorage
        this.persistCapture(captureData);
        
        // Notify Resonance Cascade (capturing moments is a chain event)
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('CINEMATIC_CAPTURE', {
                quality,
                score: this.momentScore,
                systems: this.activeSystemsSnapshot.length
            });
        }
        
        console.log(`[Cinematic Archive] Captured ${quality} moment (${this.momentScore.toFixed(0)} pts)`);
        console.log(`  Systems: ${this.activeSystemsSnapshot.join(', ')}`);
    }
    
    gatherCaptureMetadata(quality) {
        const player = this.scene.player;
        
        return {
            id: `capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            gameTime: this.scene.time.now,
            quality,
            momentScore: Math.floor(this.momentScore),
            
            // Game state
            score: this.scene.score || 0,
            wave: this.scene.wave || 1,
            health: player?.health || 0,
            
            // Position
            playerX: player?.x || 0,
            playerY: player?.y || 0,
            
            // Active systems snapshot
            activeSystems: [...this.activeSystemsSnapshot],
            
            // System-specific states
            systemStates: {
                bulletTime: this.scene.nearMissState?.active || false,
                bulletTimeStreak: this.scene.nearMissState?.streak || 0,
                resonanceMultiplier: this.scene.resonanceCascade?.getDamageMultiplier() || 1,
                singularityTrapped: this.scene.singularitySystem?.getTrappedBulletCount?.() || 0,
                voidCoherence: this.scene.voidCoherence?.coherenceLevel || 0,
                chronoEchoes: this.scene.chronoLoop?.pastEchoes?.length || 0,
                quantumEchoes: this.scene.quantumImmortality?.quantumEchoes?.length || 0,
                paradoxMultiplier: this.scene.paradoxEngine?.currentParadoxMultiplier || 1,
                entanglementLinks: this.scene.causalEntanglement?.entanglements?.length || 0,
                titanPhase: this.scene.tesseractTitan?.phase || 0,
                titanActive: this.scene.tesseractTitan?.active || false
            },
            
            // Capture context
            runCaptures: this.capturesThisRun,
            isAutoCapture: quality !== 'MANUAL',
            
            // Session identifier
            sessionId: this.getSessionId()
        };
    }
    
    triggerCaptureFlash() {
        // White flash fade
        this.captureFlash.setAlpha(0.8);
        this.scene.tweens.add({
            targets: this.captureFlash,
            alpha: 0,
            duration: 400,
            ease: 'Power2'
        });
        
        // Shutter sound effect (if audio system existed)
        // this.playShutterSound();
    }
    
    showCaptureNotification(quality, auto) {
        const qualityColors = {
            'EPIC': '#ff0066',
            'RARE': '#ffbf00',
            'GOOD': '#00d4ff',
            'MANUAL': '#ffffff'
        };
        
        const qualityIcons = {
            'EPIC': '★★★',
            'RARE': '★★',
            'GOOD': '★',
            'MANUAL': '◎'
        };
        
        const text = auto 
            ? `${qualityIcons[quality]} ${quality} MOMENT CAPTURED`
            : `${qualityIcons[quality]} MANUAL CAPTURE`;
        
        const notification = this.scene.add.text(
            this.scene.scale.width - 20, 80,
            text, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fontStyle: 'bold',
                fill: qualityColors[quality]
            }
        ).setOrigin(1, 0).setScrollFactor(0).setDepth(1001);
        
        // Slide in and fade out
        notification.x += 50;
        this.scene.tweens.add({
            targets: notification,
            x: notification.x - 50,
            alpha: { from: 1, to: 0 },
            duration: 2000,
            delay: 1000,
            ease: 'Power2',
            onComplete: () => notification.destroy()
        });
    }
    
    manualCapture() {
        if (this.capturesThisRun >= this.maxCapturesPerRun) {
            this.showLimitWarning();
            return;
        }
        
        const timeSinceLast = this.scene.time.now - this.lastCaptureTime;
        if (timeSinceLast < this.CAPTURE_COOLDOWN) {
            this.showCooldownWarning();
            return;
        }
        
        this.captureMoment('MANUAL', false);
    }
    
    showLimitWarning() {
        const warning = this.scene.add.text(
            this.scene.scale.width / 2, this.scene.scale.height / 2,
            'ARCHIVE FULL\n12/12 CAPTURES USED', {
                fontFamily: 'monospace',
                fontSize: '20px',
                fill: '#ff4444',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
        
        this.scene.tweens.add({
            targets: warning,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => warning.destroy()
        });
    }
    
    showCooldownWarning() {
        const remaining = Math.ceil((this.CAPTURE_COOLDOWN - (this.scene.time.now - this.lastCaptureTime)) / 1000);
        const warning = this.scene.add.text(
            this.scene.scale.width / 2, this.scene.scale.height / 2,
            `COOLDOWN\n${remaining}s remaining`, {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: '#ffaa00',
                align: 'center'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
        
        this.scene.tweens.add({
            targets: warning,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => warning.destroy()
        });
    }
    
    toggleCinematicMode() {
        const isActive = this.letterboxBars[0].visible;
        
        this.letterboxBars.forEach(bar => bar.setVisible(!isActive));
        
        if (!isActive) {
            // Entering cinematic mode - show notification
            const notification = this.scene.add.text(
                this.scene.scale.width / 2, 60,
                'CINEMATIC MODE', {
                    fontFamily: 'monospace',
                    fontSize: '18px',
                    fill: '#ffbf00',
                    letterSpacing: 4
                }
            ).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
            
            this.scene.tweens.add({
                targets: notification,
                alpha: 0,
                y: notification.y - 30,
                duration: 2000,
                ease: 'Power2',
                onComplete: () => notification.destroy()
            });
        }
    }
    
    updateCaptureIndicator(dt) {
        // Could add subtle pulsing to frame overlay when moment score is high
        if (this.momentScore >= this.MOMENT_THRESHOLDS.RARE) {
            const pulse = 0.3 + Math.sin(this.scene.time.now / 200) * 0.2;
            const w = this.scene.scale.width;
            const h = this.scene.scale.height;
            const cornerSize = 40;
            
            if (this.useUnifiedRenderer && this.scene.graphicsManager) {
                // New way: register commands with UnifiedGraphicsManager on 'effects' layer
                // Draw base frame
                this.drawFrameOverlay();
                // Enhance corners when moment is building with pulsing effect
                // Top-left
                this.scene.graphicsManager.drawLine('effects', 10, 10, 10 + cornerSize, 10, this.AMBER_COLOR, pulse, 3);
                this.scene.graphicsManager.drawLine('effects', 10, 10, 10, 10 + cornerSize, this.AMBER_COLOR, pulse, 3);
                // Top-right
                this.scene.graphicsManager.drawLine('effects', w - 10, 10, w - 10 - cornerSize, 10, this.AMBER_COLOR, pulse, 3);
                this.scene.graphicsManager.drawLine('effects', w - 10, 10, w - 10, 10 + cornerSize, this.AMBER_COLOR, pulse, 3);
                // Bottom-left
                this.scene.graphicsManager.drawLine('effects', 10, h - 10, 10 + cornerSize, h - 10, this.AMBER_COLOR, pulse, 3);
                this.scene.graphicsManager.drawLine('effects', 10, h - 10, 10, h - 10 - cornerSize, this.AMBER_COLOR, pulse, 3);
                // Bottom-right
                this.scene.graphicsManager.drawLine('effects', w - 10, h - 10, w - 10 - cornerSize, h - 10, this.AMBER_COLOR, pulse, 3);
                this.scene.graphicsManager.drawLine('effects', w - 10, h - 10, w - 10, h - 10 - cornerSize, this.AMBER_COLOR, pulse, 3);
            } else {
                // Legacy way: direct graphics manipulation
                this.frameOverlay.clear();
                this.drawFrameOverlay();
                // Enhance corners when moment is building
                this.frameOverlay.lineStyle(3, this.AMBER_COLOR, pulse);
                // Redraw with enhanced glow
                this.frameOverlay.lineBetween(10, 10, 10 + cornerSize, 10);
                this.frameOverlay.lineBetween(10, 10, 10, 10 + cornerSize);
                this.frameOverlay.lineBetween(w - 10, 10, w - 10 - cornerSize, 10);
                this.frameOverlay.lineBetween(w - 10, 10, w - 10, 10 + cornerSize);
                this.frameOverlay.lineBetween(10, h - 10, 10 + cornerSize, h - 10);
                this.frameOverlay.lineBetween(10, h - 10, 10, h - 10 - cornerSize);
                this.frameOverlay.lineBetween(w - 10, h - 10, w - 10 - cornerSize, h - 10);
                this.frameOverlay.lineBetween(w - 10, h - 10, w - 10, h - 10 - cornerSize);
            }
        } else {
            if (this.useUnifiedRenderer && this.scene.graphicsManager) {
                // New way: just draw the base frame (no clear needed - UnifiedGraphicsManager handles it)
                this.drawFrameOverlay();
            } else {
                // Legacy way
                this.frameOverlay.clear();
                this.drawFrameOverlay();
            }
        }
    }
    
    persistCapture(captureData) {
        try {
            // Get existing archive
            const existing = JSON.parse(localStorage.getItem('shooty_cinematic_archive') || '[]');
            
            // Add new capture (limit to 100 to prevent storage bloat)
            existing.unshift(captureData);
            if (existing.length > 100) {
                existing.pop();
            }
            
            // Save back
            localStorage.setItem('shooty_cinematic_archive', JSON.stringify(existing));
            
            // Also save to timeline chronicle if available
            if (this.scene.timelineChronicle) {
                this.scene.timelineChronicle.recordCapture(captureData);
            }
        } catch (e) {
            console.warn('[Cinematic Archive] Failed to persist capture:', e);
        }
    }
    
    loadExistingArchive() {
        try {
            const existing = JSON.parse(localStorage.getItem('shooty_cinematic_archive') || '[]');
            console.log(`[Cinematic Archive] Loaded ${existing.length} captures from archive`);
        } catch (e) {
            console.warn('[Cinematic Archive] Failed to load archive:', e);
        }
    }
    
    getSessionId() {
        if (!this._sessionId) {
            this._sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return this._sessionId;
    }
    
    getArchiveStats() {
        try {
            const archive = JSON.parse(localStorage.getItem('shooty_cinematic_archive') || '[]');
            return {
                totalCaptures: archive.length,
                epicMoments: archive.filter(c => c.quality === 'EPIC').length,
                rareMoments: archive.filter(c => c.quality === 'RARE').length,
                manualCaptures: archive.filter(c => c.quality === 'MANUAL').length,
                averageMomentScore: archive.reduce((sum, c) => sum + c.momentScore, 0) / (archive.length || 1),
                mostSystemsActive: Math.max(...archive.map(c => c.activeSystems?.length || 0), 0),
                favoriteSystem: this.calculateFavoriteSystem(archive)
            };
        } catch (e) {
            return null;
        }
    }
    
    calculateFavoriteSystem(archive) {
        const systemCounts = {};
        for (const capture of archive) {
            for (const system of capture.activeSystems || []) {
                const baseName = system.split('×')[0];
                systemCounts[baseName] = (systemCounts[baseName] || 0) + 1;
            }
        }
        
        let favorite = null;
        let maxCount = 0;
        for (const [system, count] of Object.entries(systemCounts)) {
            if (count > maxCount) {
                maxCount = count;
                favorite = system;
            }
        }
        
        return favorite;
    }
    
    // Called by other systems to hint that something cinematic is happening
    hintCinematicMoment(bonusScore, reason) {
        this.momentScore += bonusScore;
        if (reason) {
            this.activeSystemsSnapshot.push(reason);
        }
    }
    
    destroy() {
        if (this.captureFlash) this.captureFlash.destroy();
        if (this.frameOverlay) this.frameOverlay.destroy(); // Legacy cleanup
        this.letterboxBars.forEach(bar => bar.destroy());
    }
}
