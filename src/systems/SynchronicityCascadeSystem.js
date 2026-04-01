import Phaser from 'phaser';

/**
 * Synchronicity Cascade — The Transcendental Convergence
 * 
 * When multiple temporal systems achieve perfect alignment, the game enters
 * a transcendental state where all 29 systems harmonize into temporary omnipotence.
 * 
 * This is the apotheosis of the shooty ecosystem — not just using systems,
 * but making them SING together in perfect synchronization.
 * 
 * Core Innovation:
 * - Tracks simultaneous system activation (not sequential like Resonance Cascade)
 * - When 5+ systems are active simultaneously, triggers Synchronicity State
 * - During Synchronicity: All systems recharge instantly, infinite ammo,
 *   time dilation stack, unified visual language, emergent behaviors
 * 
 * The Philosophy: True mastery isn't using systems one after another —
 * it's activating them ALL AT ONCE, creating a moment of pure temporal divinity.
 * 
 * Color: Prismatic White-Gold — all colors converging into unity (#ffffff → #ffd700)
 */

export default class SynchronicityCascadeSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Active system tracking (simultaneous, not sequential)
        this.activeSystems = new Set();
        this.systemActivationTime = new Map();
        this.systemDecayTime = 2.0; // Seconds until system considered inactive
        
        // Synchronicity State
        this.synchronicityActive = false;
        this.synchronicityCharge = 0; // 0-100%
        this.synchronicityDuration = 0;
        this.synchronicityLevel = 0; // 1-5 based on active system count
        
        // Thresholds
        this.SYNCHRONICITY_THRESHOLD = 5; // Systems needed to trigger
        this.MAX_SYNCHRONICITY_LEVEL = 5;
        this.BASE_DURATION = 8.0; // Seconds
        this.DURATION_PER_LEVEL = 2.0;
        
        // Visual state
        this.prismaticColor = 0xffffff;
        this.colorCycle = 0;
        this.glowIntensity = 0;
        
        // Auras around player during synchronicity
        this.auraRings = [];
        this.particleStream = null;
        
        // Time dilation during synchronicity
        this.timeDilationStack = 1.0;
        
        // Combo tracking
        this.totalSynchronicitiesAchieved = 0;
        this.longestSynchronicityDuration = 0;
        this.peakSystemsActive = 0;
        
        // Emergent behavior triggers
        this.emergentBehaviors = [];
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.registerSystemActivations();
    }
    
    createVisuals() {
        // Note: Graphics now rendered via UnifiedGraphicsManager on 'effects' layer
        // this.synchroGlow, this.chargeBar, and aura ring graphics removed - using graphicsManager instead
        
        // Prismatic aura rings (5 rings for 5 levels) - data only, no graphics objects
        for (let i = 0; i < 5; i++) {
            this.auraRings.push({
                radius: 40 + i * 15,
                speed: 0.5 + i * 0.3,
                phase: i * Math.PI / 3,
                active: false
            });
        }
        
        // Synchronicity text
        this.synchroText = this.scene.add.text(0, 0, '', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            fill: '#ffffff'
        });
        this.synchroText.setOrigin(0.5);
        this.synchroText.setScrollFactor(0);
        this.synchroText.setDepth(200);
        this.synchroText.setVisible(false);
        
        // Active system indicators
        this.systemIndicators = [];
        for (let i = 0; i < 10; i++) {
            const indicator = this.scene.add.circle(0, 0, 6, 0xffffff, 0.3);
            indicator.setScrollFactor(0);
            indicator.setDepth(100);
            indicator.setVisible(false);
            this.systemIndicators.push({
                sprite: indicator,
                system: null,
                active: false
            });
        }
        
        // Particle stream for active synchronicity
        this.particleStream = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 1.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            speed: { min: 100, max: 300 },
            lifespan: 800,
            gravityY: -50,
            quantity: 2,
            frequency: 50,
            tint: [0xffffff, 0xffd700, 0x00f0ff, 0xff00ff, 0x9d4edd],
            blendMode: Phaser.BlendModes.ADD
        });
        this.particleStream.setDepth(60);
        this.particleStream.stop();
    }
    
    /**
     * Register to receive activation events from all systems
     */
    registerSystemActivations() {
        // System names that count toward synchronicity
        this.validSystems = [
            'bulletTime',
            'echoStorm',
            'fracture',
            'residue',
            'singularity',
            'omniWeapon',
            'paradox',
            'chronoLoop',
            'quantum',
            'observer',
            'void',
            'contract',
            'entanglement',
            'symbiotic',
            'collapse',
            'rewind',
            'mnemosyne',
            'kairos',
            'syntropy',
            'nemesis',
            'oracle',
            'whisper',
            'egregore',
            'aetheric',
            'harmonic',
            'titan',
            'recursion',
            'resonance',
            'cinematic'
        ];
    }
    
    /**
     * Call this when any temporal system activates
     */
    onSystemActivate(systemName) {
        if (!this.validSystems.includes(systemName)) return;
        
        const now = this.scene.time.now / 1000;
        
        // Add to active systems
        this.activeSystems.add(systemName);
        this.systemActivationTime.set(systemName, now);
        
        // Update peak tracking
        if (this.activeSystems.size > this.peakSystemsActive) {
            this.peakSystemsActive = this.activeSystems.size;
        }
        
        // Check for synchronicity trigger
        this.checkSynchronicityTrigger();
        
        // Update UI
        this.updateSystemIndicators();
        
        // Add charge if close to threshold
        if (this.activeSystems.size >= 3 && !this.synchronicityActive) {
            this.synchronicityCharge = Math.min(100, 
                this.synchronicityCharge + (this.activeSystems.size - 2) * 5);
        }
    }
    
    /**
     * Call this when a system deactivates
     */
    onSystemDeactivate(systemName) {
        this.activeSystems.delete(systemName);
        this.systemActivationTime.delete(systemName);
        
        // Check if synchronicity should end
        if (this.synchronicityActive && this.activeSystems.size < 3) {
            this.endSynchronicity();
        }
        
        this.updateSystemIndicators();
    }
    
    /**
     * Check if we should enter synchronicity state
     */
    checkSynchronicityTrigger() {
        const activeCount = this.activeSystems.size;
        
        // Don't trigger if already active
        if (this.synchronicityActive) {
            // Level up if we gained more systems
            const newLevel = Math.min(this.MAX_SYNCHRONICITY_LEVEL, 
                Math.max(1, activeCount - this.SYNCHRONICITY_THRESHOLD + 1));
            if (newLevel > this.synchronicityLevel) {
                this.levelUpSynchronicity(newLevel);
            }
            return;
        }
        
        // Trigger at threshold
        if (activeCount >= this.SYNCHRONICITY_THRESHOLD) {
            this.enterSynchronicity(activeCount);
        }
    }
    
    /**
     * Enter the transcendental state
     */
    enterSynchronicity(activeCount) {
        this.synchronicityActive = true;
        this.synchronicityLevel = Math.min(this.MAX_SYNCHRONICITY_LEVEL, 
            activeCount - this.SYNCHRONICITY_THRESHOLD + 1);
        this.synchronicityDuration = this.BASE_DURATION + 
            (this.synchronicityLevel - 1) * this.DURATION_PER_LEVEL;
        this.totalSynchronicitiesAchieved++;
        
        // Calculate time dilation (slower time at higher levels)
        this.timeDilationStack = 1.0 - (this.synchronicityLevel * 0.12);
        this.timeDilationStack = Math.max(0.4, this.timeDilationStack);
        
        // Apply to game time
        this.scene.physics.world.timeScale = this.timeDilationStack;
        
        // Enable all aura rings up to current level
        this.auraRings.forEach((ring, i) => {
            ring.active = i < this.synchronicityLevel;
        });
        
        // Start particle stream
        this.particleStream.start();
        
        // Show announcement
        this.announceSynchronicity();
        
        // Trigger emergent behaviors
        this.triggerEmergentBehaviors();
        
        // Notify other systems
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('SYNCHRONICITY_ENTER', {
                level: this.synchronicityLevel,
                systems: Array.from(this.activeSystems)
            });
        }
        
        // Visual flash
        this.scene.cameras.main.flash(500, 255, 255, 255, 0.5);
        
        // Screen shake
        this.scene.cameras.main.shake(300, 0.01 * this.synchronicityLevel);
    }
    
    /**
     * Level up during active synchronicity
     */
    levelUpSynchronicity(newLevel) {
        this.synchronicityLevel = newLevel;
        this.synchronicityDuration += 3.0; // Bonus duration
        
        // Update time dilation
        this.timeDilationStack = 1.0 - (this.synchronicityLevel * 0.12);
        this.timeDilationStack = Math.max(0.4, this.timeDilationStack);
        this.scene.physics.world.timeScale = this.timeDilationStack;
        
        // Enable more rings
        this.auraRings.forEach((ring, i) => {
            ring.active = i < this.synchronicityLevel;
        });
        
        // Announce level up
        const levelText = ['', 'HARMONIC', 'SYMPHONIC', 'TRANSCENDENT', 'DIVINE', 'OMNISCIENT'][newLevel];
        
        const text = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 150,
            `SYNCHRONICITY ${levelText}!`,
            {
                fontFamily: 'monospace',
                fontSize: '28px',
                fontStyle: 'bold',
                fill: '#ffd700'
            }
        );
        text.setOrigin(0.5);
        text.setDepth(200);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Flash
        this.scene.cameras.main.flash(300, 255, 215, 0, 0.3);
    }
    
    /**
     * End the synchronicity state
     */
    endSynchronicity() {
        if (!this.synchronicityActive) return;
        
        // Track longest duration
        const actualDuration = this.BASE_DURATION + (this.synchronicityLevel - 1) * this.DURATION_PER_LEVEL - this.synchronicityDuration;
        if (actualDuration > this.longestSynchronicityDuration) {
            this.longestSynchronicityDuration = actualDuration;
        }
        
        this.synchronicityActive = false;
        this.synchronicityLevel = 0;
        this.synchronicityCharge = 0;
        
        // Reset time
        this.scene.physics.world.timeScale = 1.0;
        
        // Hide auras - graphics managed by UnifiedGraphicsManager
        this.auraRings.forEach(ring => {
            ring.active = false;
        });
        
        // Stop particles
        this.particleStream.stop();
        
        // Hide UI
        this.synchroText.setVisible(false);
        
        // Clear system indicators
        this.systemIndicators.forEach(ind => {
            ind.active = false;
            ind.sprite.setVisible(false);
        });
        
        // End announcement
        const endText = this.scene.add.text(
            this.scene.player.x,
            this.scene.player.y - 100,
            'SYNCHRONICITY FADES...',
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fill: '#aaaaaa'
            }
        );
        endText.setOrigin(0.5);
        endText.setDepth(200);
        
        this.scene.tweens.add({
            targets: endText,
            y: endText.y - 30,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => endText.destroy()
        });
        
        // Record in cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('SYNCHRONICITY_EXIT', {
                duration: actualDuration,
                peakSystems: this.peakSystemsActive
            });
        }
    }
    
    /**
     * Trigger emergent behaviors during synchronicity
     */
    triggerEmergentBehaviors() {
        // System combinations create unique effects
        const systems = Array.from(this.activeSystems);
        
        // Echo Storm + Bullet Time = Echo Nova (absorb all echoes instantly)
        if (systems.includes('echoStorm') && systems.includes('bulletTime')) {
            this.scene.echoStorm?.triggerEchoNova?.();
        }
        
        // Fracture + Chrono-Loop = Temporal Fracture (ghost + past echo stack)
        if (systems.includes('fracture') && systems.includes('chronoLoop')) {
            this.emergentBehaviors.push('TEMPORAL_FRACTURE');
        }
        
        // Quantum + Nemesis = Quantum Nemesis (boss creates quantum echoes on death)
        if (systems.includes('quantum') && systems.includes('nemesis')) {
            this.emergentBehaviors.push('QUANTUM_NEMESIS');
        }
        
        // Paradox + Symbiotic = Perfect Prediction (both directions = zero miss)
        if (systems.includes('paradox') && systems.includes('symbiotic')) {
            this.emergentBehaviors.push('PERFECT_SYNCHRONICITY');
            // Player can't be hit during this
            this.scene.player.isInvulnerable = true;
            this.scene.time.delayedCall(this.synchronicityDuration * 1000, () => {
                if (this.scene.player) this.scene.player.isInvulnerable = false;
            });
        }
        
        // Harmonic + Resonance = Musical Cascade (each shot plays chord)
        if (systems.includes('harmonic') && systems.includes('resonance')) {
            this.emergentBehaviors.push('MUSICAL_CASCADE');
        }
        
        // Oracle + Egregore = Evolutionary Prophecy (unknown geometry spawns with hints)
        if (systems.includes('oracle') && systems.includes('egregore')) {
            this.emergentBehaviors.push('EVOLUTIONARY_PROPHECY');
        }
    }
    
    /**
     * Announce synchronicity entry
     */
    announceSynchronicity() {
        const levelNames = ['', 'HARMONIC', 'SYMPHONIC', 'TRANSCENDENT', 'DIVINE', 'OMNISCIENT'];
        const levelName = levelNames[this.synchronicityLevel] || 'UNKNOWN';
        
        this.synchroText.setText(`SYNCHRONICITY: ${levelName}`);
        this.synchroText.setPosition(this.scene.scale.width / 2, 120);
        this.synchroText.setVisible(true);
        this.synchroText.setAlpha(1);
        this.synchroText.setScale(1);
        
        // Pulse animation
        this.scene.tweens.add({
            targets: this.synchroText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Show system count
        const systemCount = this.scene.add.text(
            this.scene.scale.width / 2,
            150,
            `${this.activeSystems.size} SYSTEMS ALIGNED`,
            {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#ffd700'
            }
        );
        systemCount.setOrigin(0.5);
        systemCount.setScrollFactor(0);
        systemCount.setDepth(200);
        
        this.scene.tweens.add({
            targets: systemCount,
            alpha: 0,
            delay: 2000,
            duration: 1000,
            onComplete: () => systemCount.destroy()
        });
    }
    
    /**
     * Update visual indicators for active systems
     */
    updateSystemIndicators() {
        const systems = Array.from(this.activeSystems);
        const colors = {
            bulletTime: 0xffd700,
            echoStorm: 0xffd700,
            fracture: 0xffd700,
            residue: 0x9d4edd,
            singularity: 0xdc143c,
            omniWeapon: 0x00f0ff,
            paradox: 0xff00ff,
            chronoLoop: 0x008080,
            quantum: 0xffffff,
            observer: 0x00f0ff,
            void: 0x1a1a2e,
            contract: 0x4b0082,
            entanglement: 0x00ffff,
            symbiotic: 0xff00ff,
            collapse: 0x6600cc,
            rewind: 0xffaa00,
            mnemosyne: 0xc0c0c0,
            kairos: 0xffd700,
            syntropy: 0x00ff88,
            nemesis: 0xff0040,
            oracle: 0xff00ff,
            whisper: 0x00f0ff,
            egregore: 0xff1493,
            aetheric: 0xffffff,
            harmonic: 0xff00ff,
            titan: 0xff0066,
            recursion: 0x00ffff,
            resonance: 0xff00ff,
            cinematic: 0xffd700
        };
        
        // Update indicator positions in a semicircle above player
        this.systemIndicators.forEach((ind, i) => {
            if (i < systems.length) {
                ind.active = true;
                ind.system = systems[i];
                ind.sprite.setFillStyle(colors[systems[i]] || 0xffffff, 0.9);
                ind.sprite.setVisible(true);
                
                // Position in arc
                const angle = Math.PI + (i / (Math.max(5, systems.length) - 1)) * Math.PI;
                const radius = 50;
                const x = this.scene.player.x + Math.cos(angle) * radius;
                const y = this.scene.player.y - 40 + Math.sin(angle) * radius * 0.3;
                ind.sprite.setPosition(x, y);
            } else {
                ind.active = false;
                ind.sprite.setVisible(false);
            }
        });
    }
    
    /**
     * Get prismatic color based on time
     */
    getPrismaticColor(time) {
        const cycle = (time * 0.5) % 1;
        const colors = [
            { r: 255, g: 215, b: 0 },   // Gold
            { r: 0, g: 240, b: 255 },   // Cyan
            { r: 255, g: 0, b: 255 },   // Magenta
            { r: 157, g: 78, b: 221 },  // Purple
            { r: 255, g: 51, b: 102 }, // Red
        ];
        
        const index = Math.floor(cycle * colors.length);
        const nextIndex = (index + 1) % colors.length;
        const t = (cycle * colors.length) % 1;
        
        const c1 = colors[index];
        const c2 = colors[nextIndex];
        
        const r = Math.floor(c1.r + (c2.r - c1.r) * t);
        const g = Math.floor(c1.g + (c2.g - c1.g) * t);
        const b = Math.floor(c1.b + (c2.b - c1.b) * t);
        
        return (r << 16) | (g << 8) | b;
    }
    
    /**
     * Main update loop
     */
    update(dt) {
        const now = this.scene.time.now / 1000;
        
        // Decay inactive systems
        this.activeSystems.forEach(system => {
            const lastActive = this.systemActivationTime.get(system) || now;
            if (now - lastActive > this.systemDecayTime) {
                this.onSystemDeactivate(system);
            }
        });
        
        // Update synchronicity duration
        if (this.synchronicityActive) {
            this.synchronicityDuration -= dt;
            
            // Update particle stream position
            this.particleStream.setPosition(this.scene.player.x, this.scene.player.y);
            
            // Render aura rings
            this.renderAuraRings(now);
            
            // Update system indicator positions (they follow player)
            this.updateSystemIndicatorPositions();
            
            // Check for expiration
            if (this.synchronicityDuration <= 0) {
                this.endSynchronicity();
            }
        }
        
        // Update charge bar when building toward synchronicity
        if (!this.synchronicityActive && this.synchronicityCharge > 0) {
            this.synchronicityCharge = Math.max(0, this.synchronicityCharge - dt * 10);
            this.renderChargeBar();
        }
        
        // Update glow overlay during synchronicity
        if (this.synchronicityActive) {
            this.renderSynchroGlow(now);
        }
    }
    
    /**
     * Update positions of system indicators to follow player
     */
    updateSystemIndicatorPositions() {
        const systems = Array.from(this.activeSystems);
        this.systemIndicators.forEach((ind, i) => {
            if (ind.active && i < systems.length) {
                const angle = Math.PI + (i / (Math.max(5, systems.length) - 1)) * Math.PI;
                const radius = 50 + this.synchronicityLevel * 10;
                const x = this.scene.player.x + Math.cos(angle) * radius;
                const y = this.scene.player.y - 40 + Math.sin(angle) * radius * 0.3;
                ind.sprite.setPosition(x, y);
            }
        });
    }
    
    /**
     * Render the charge bar via UnifiedGraphicsManager
     */
    renderChargeBar() {
        const manager = this.scene.graphicsManager;
        if (!manager) return;
        
        const width = 200;
        const height = 6;
        const x = (this.scene.scale.width - width) / 2;
        const y = 60;
        
        // Background
        manager.drawRect('effects', x, y, width, height, 0x333333, 0.5);
        
        // Fill
        const fillWidth = (this.synchronicityCharge / 100) * width;
        const color = this.synchronicityCharge >= 100 ? 0xffd700 : 0x00f0ff;
        manager.drawRect('effects', x, y, fillWidth, height, color, 0.8);
    }
    
    /**
     * Render the synchronicity glow overlay via UnifiedGraphicsManager
     */
    renderSynchroGlow(now) {
        if (!this.synchronicityActive) return;
        
        const manager = this.scene.graphicsManager;
        if (!manager) return;
        
        const prismaticColor = this.getPrismaticColor(now);
        const alpha = 0.1 + (this.synchronicityLevel * 0.03);
        
        // Screen edge glow
        const w = this.scene.scale.width;
        const h = this.scene.scale.height;
        
        // Top glow
        manager.drawRect('effects', 0, 0, w, 20, prismaticColor, alpha);
        // Bottom glow
        manager.drawRect('effects', 0, h - 20, w, 20, prismaticColor, alpha);
        // Left glow
        manager.drawRect('effects', 0, 0, 20, h, prismaticColor, alpha);
        // Right glow
        manager.drawRect('effects', w - 20, 0, 20, h, prismaticColor, alpha);
    }
    
    /**
     * Render aura rings around player via UnifiedGraphicsManager
     */
    renderAuraRings(now) {
        const manager = this.scene.graphicsManager;
        if (!manager) return;
        
        this.auraRings.forEach((ring, i) => {
            if (!ring.active) return;
            
            const prismaticColor = this.getPrismaticColor(now + i * 0.2);
            const alpha = 0.3 + Math.sin(now * 3 + ring.phase) * 0.2;
            const radius = ring.radius + Math.sin(now * 2 + ring.phase) * 5;
            
            // Rotating segments
            const segments = 6 + i * 2;
            const rotation = now * ring.speed + ring.phase;
            
            for (let j = 0; j < segments; j++) {
                const angle1 = rotation + (j / segments) * Math.PI * 2;
                const angle2 = rotation + ((j + 0.8) / segments) * Math.PI * 2;
                
                const x1 = this.scene.player.x + Math.cos(angle1) * radius;
                const y1 = this.scene.player.y + Math.sin(angle1) * radius;
                const x2 = this.scene.player.x + Math.cos(angle2) * radius;
                const y2 = this.scene.player.y + Math.sin(angle2) * radius;
                
                manager.drawLine('effects', x1, y1, x2, y2, prismaticColor, alpha, 2);
            }
        });
    }
    
    /**
     * Get damage multiplier during synchronicity
     */
    getDamageMultiplier() {
        if (!this.synchronicityActive) return 1.0;
        return 1.0 + (this.synchronicityLevel * 0.5) + (this.activeSystems.size * 0.1);
    }
    
    /**
     * Check if a specific emergent behavior is active
     */
    hasEmergentBehavior(behavior) {
        return this.emergentBehaviors.includes(behavior);
    }
    
    /**
     * Get stats for display
     */
    getStats() {
        return {
            totalSynchronicities: this.totalSynchronicitiesAchieved,
            longestDuration: this.longestSynchronicityDuration.toFixed(1),
            peakSystems: this.peakSystemsActive,
            currentActive: this.activeSystems.size,
            synchronicityActive: this.synchronicityActive,
            level: this.synchronicityLevel,
            charge: Math.floor(this.synchronicityCharge)
        };
    }
    
    /**
     * Force end synchronicity (for game over)
     */
    forceEnd() {
        if (this.synchronicityActive) {
            this.endSynchronicity();
        }
    }
    
    /**
     * Cleanup
     */
    destroy() {
        this.forceEnd();
        
        this.synchroText.destroy();
        this.particleStream.destroy();
        
        this.systemIndicators.forEach(ind => ind.sprite.destroy());
    }
}
