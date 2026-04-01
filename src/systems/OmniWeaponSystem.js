import Phaser from 'phaser';

/**
 * Omni-Weapon Adaptation System — Modular Fire Control
 * 
 * Your weapon evolves based on HOW you play, creating unique builds every run.
 * Three mod slots (BARREL, CHAMBER, LENS) adapt to your dominant temporal mechanics.
 * 
 * BARREL (firing pattern):
 *   - RAPID (bullet time grazes): High fire rate, lower damage per shot
 *   - PIERCE (fracture kills): Shots penetrate through enemies
 *   - SPREAD (residue node proximity): Shotgun-style burst
 * 
 * CHAMBER (projectile behavior):
 *   - EXPLOSIVE (singularity detonations): Rounds detonate on impact
 *   - ELEMENTAL (high resonance chains): Fire/frost/shock cycling
 *   - PHASING (ghost bullet hits): Shots briefly phase through enemies before solidifying
 * 
 * LENS (targeting/trajectory):
 *   - HOMING (echo absorptions): Mild tracking toward nearest enemy
 *   - RICOCHET (bullet time streaks): Bounces off walls once
 *   - SPLIT (perfect fractures): Shots split into two after first hit
 * 
 * Combinations create unique effects:
 *   - PIERCE + EXPLOSIVE + HOMING = Drill through line, detonate at end, seek new target
 *   - RAPID + ELEMENTAL + RICOCHET = Spray ricocheting elemental chaos
 *   - SPREAD + PHASING + SPLIT = Each split pellet phases through, hits twice
 * 
 * Visual: Mods manifest as glowing attachments on the player ship, updating in real-time.
 * UI: Minimal — three small icons above health bar showing current configuration.
 * 
 * This transforms the static weapon into the game's seventh temporal system,
 * completing the ecosystem with player-expression-driven firepower.
 */

export default class OmniWeaponSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Mod slots - each can hold one mod type
        this.slots = {
            BARREL: null,  // firing pattern
            CHAMBER: null, // projectile behavior  
            LENS: null     // targeting/trajectory
        };
        
        // Mod progression (0-100 for each type)
        this.modProgress = {
            // Barrel mods
            RAPID: 0,      // From bullet time grazes
            PIERCE: 0,     // From fracture kills
            SPREAD: 0,     // From residue node proximity
            
            // Chamber mods
            EXPLOSIVE: 0,  // From singularity detonations
            ELEMENTAL: 0,  // From high resonance chains (3+)
            PHASING: 0,    // From ghost bullet hits
            
            // Lens mods
            HOMING: 0,     // From echo absorptions
            RICOCHET: 0,   // From bullet time streaks
            SPLIT: 0       // From perfect fractures (no damage)
        };
        
        // Mod unlock threshold
        this.UNLOCK_THRESHOLD = 40;
        this.MAX_PROGRESS = 100;
        
        // Progress decay (per second) - encourages focusing your playstyle
        this.DECAY_RATE = 2;
        
        // Current weapon stats (modified by active mods)
        this.weaponStats = {
            fireRate: 120,
            damage: 34,
            bulletSpeed: 600,
            spread: 0.05,
            piercing: false,
            explosive: false,
            homing: false,
            ricochet: false,
            split: false,
            elemental: false,
            phasing: false
        };
        
        // Elemental cycle state
        this.elementalState = 0; // 0=fire, 1=frost, 2=shock
        this.elementalTimer = 0;
        
        // Visual attachments - now rendered via UnifiedGraphicsManager on 'effects' layer
        // (Legacy graphics objects removed - drawing is now centralized)
        
        // UI elements
        this.uiContainer = null;
        this.modIcons = {};
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.createUI();
    }
    
    createVisuals() {
        // Note: Graphics rendering is now handled by UnifiedGraphicsManager
        // All visual effects are drawn via the 'effects' layer
        // Attachments are now drawn through updateVisualAttachments() using graphicsManager
    }
    
    createUI() {
        // Register with HUDPanelManager at OMNI_WEAPON slot
        this.scene.hudPanels.registerSlot('OMNI_WEAPON', (container, width, layout) => {
            this.uiContainer = container;
            this.uiContainer.setDepth(100);
            
            // Use top-left origin so elements stay within content bounds (x >= 0, y >= 0)
            const barHeight = 14;
            const iconY = barHeight / 2; // Center icons vertically within the bar
            
            // Background - full width bar
            const bg = this.scene.add.rectangle(0, 0, width, barHeight, 0x1a1a25, 0.8);
            bg.setOrigin(0, 0); // Top-left origin
            container.add(bg);
            
            // Mod icons will be positioned across the width
            const slots = ['BARREL', 'CHAMBER', 'LENS'];
            const colors = [0xff3366, 0xffd700, 0x00f0ff];
            const spacing = width / 3;
            
            slots.forEach((slot, index) => {
                const x = index * spacing + spacing / 3;
                
                // Empty slot indicator (centered at iconY)
                const empty = this.scene.add.circle(x, iconY, 5, 0x444455, 0.3);
                container.add(empty);
                
                // Active icon (hidden until unlocked) - centered
                const icon = this.scene.add.text(x, iconY, '?', {
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fill: '#ffffff'
                }).setOrigin(0.5); // Keep centered for text
                icon.setVisible(false);
                
                this.modIcons[slot] = { empty, icon, x, color: colors[index] };
                container.add(icon);
            });
        }, 'TOP_LEFT');
    }
    
    /**
     * Add progress to a specific mod type
     */
    addProgress(modType, amount) {
        if (!this.modProgress.hasOwnProperty(modType)) return;
        
        const oldProgress = this.modProgress[modType];
        this.modProgress[modType] = Math.min(
            this.modProgress[modType] + amount,
            this.MAX_PROGRESS
        );
        
        // Check for unlock
        if (oldProgress < this.UNLOCK_THRESHOLD && 
            this.modProgress[modType] >= this.UNLOCK_THRESHOLD) {
            this.onModUnlocked(modType);
        }
        
        // Update slot assignment
        this.updateSlotAssignments();
    }
    
    onModUnlocked(modType) {
        // Determine which slot this mod belongs to
        const slot = this.getSlotForMod(modType);
        
        // Show unlock notification
        const player = this.scene.player;
        const modNames = {
            RAPID: 'RAPID BARREL',
            PIERCE: 'PIERCING BARREL',
            SPREAD: 'SPREAD BARREL',
            EXPLOSIVE: 'EXPLOSIVE CHAMBER',
            ELEMENTAL: 'ELEMENTAL CHAMBER',
            PHASING: 'PHASING CHAMBER',
            HOMING: 'HOMING LENS',
            RICOCHET: 'RICOCHET LENS',
            SPLIT: 'SPLIT LENS'
        };
        
        const colors = {
            RAPID: '#ff3366', PIERCE: '#ff3366', SPREAD: '#ff3366',
            EXPLOSIVE: '#ffd700', ELEMENTAL: '#ffd700', PHASING: '#ffd700',
            HOMING: '#00f0ff', RICOCHET: '#00f0ff', SPLIT: '#00f0ff'
        };
        
        const text = this.scene.add.text(player.x, player.y - 90, 
            `${modNames[modType]} UNLOCKED`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            fill: colors[modType]
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Update weapon stats immediately
        this.updateWeaponStats();
        this.updateVisualAttachments();
    }
    
    getSlotForMod(modType) {
        if (['RAPID', 'PIERCE', 'SPREAD'].includes(modType)) return 'BARREL';
        if (['EXPLOSIVE', 'ELEMENTAL', 'PHASING'].includes(modType)) return 'CHAMBER';
        return 'LENS';
    }
    
    updateSlotAssignments() {
        // For each slot, find the mod with highest progress
        const barrelMods = ['RAPID', 'PIERCE', 'SPREAD'];
        const chamberMods = ['EXPLOSIVE', 'ELEMENTAL', 'PHASING'];
        const lensMods = ['HOMING', 'RICOCHET', 'SPLIT'];
        
        // Assign best unlocked mod to each slot
        this.slots.BARREL = this.getBestUnlockedMod(barrelMods);
        this.slots.CHAMBER = this.getBestUnlockedMod(chamberMods);
        this.slots.LENS = this.getBestUnlockedMod(lensMods);
        
        // Update UI
        this.updateUI();
        this.updateWeaponStats();
        this.updateVisualAttachments();
    }
    
    getBestUnlockedMod(modTypes) {
        let bestMod = null;
        let bestProgress = 0;
        
        modTypes.forEach(mod => {
            if (this.modProgress[mod] >= this.UNLOCK_THRESHOLD && 
                this.modProgress[mod] > bestProgress) {
                bestProgress = this.modProgress[mod];
                bestMod = mod;
            }
        });
        
        return bestMod;
    }
    
    updateUI() {
        // Guard: panel elements may not be initialized yet
        if (!this.modIcons) return;
        
        const slotIcons = {
            RAPID: 'R', PIERCE: '|', SPREAD: 'W',
            EXPLOSIVE: '◈', ELEMENTAL: '✦', PHASING: '○',
            HOMING: '◉', RICOCHET: '↺', SPLIT: 'Y'
        };
        
        Object.keys(this.slots).forEach(slotName => {
            const mod = this.slots[slotName];
            const ui = this.modIcons[slotName];
            
            // Guard: individual slot UI may not be initialized
            if (!ui) return;
            
            if (mod) {
                ui.empty.setVisible(false);
                ui.icon.setText(slotIcons[mod]);
                ui.icon.setColor('#' + ui.color.toString(16).padStart(6, '0'));
                ui.icon.setVisible(true);
            } else {
                ui.empty.setVisible(true);
                ui.icon.setVisible(false);
            }
        });
    }
    
    updateWeaponStats() {
        // Reset to base
        this.weaponStats = {
            fireRate: 120,
            damage: 34,
            bulletSpeed: 600,
            spread: 0.05,
            piercing: false,
            explosive: false,
            homing: false,
            ricochet: false,
            split: false,
            elemental: false,
            phasing: false
        };
        
        // Apply BARREL mods
        switch (this.slots.BARREL) {
            case 'RAPID':
                this.weaponStats.fireRate = 60; // 2x fire rate
                this.weaponStats.damage = 20;   // Lower damage per shot
                break;
            case 'PIERCE':
                this.weaponStats.piercing = true;
                this.weaponStats.damage = 28;
                break;
            case 'SPREAD':
                this.weaponStats.spread = 0.25; // Wide spread
                this.weaponStats.fireRate = 150; // Slower for balance
                break;
        }
        
        // Apply CHAMBER mods
        switch (this.slots.CHAMBER) {
            case 'EXPLOSIVE':
                this.weaponStats.explosive = true;
                this.weaponStats.damage *= 0.7; // Lower direct damage
                break;
            case 'ELEMENTAL':
                this.weaponStats.elemental = true;
                break;
            case 'PHASING':
                this.weaponStats.phasing = true;
                this.weaponStats.damage = 40; // Higher damage for delayed hit
                break;
        }
        
        // Apply LENS mods
        switch (this.slots.LENS) {
            case 'HOMING':
                this.weaponStats.homing = true;
                this.weaponStats.bulletSpeed = 450; // Slower for tracking
                break;
            case 'RICOCHET':
                this.weaponStats.ricochet = true;
                this.weaponStats.bulletSpeed = 500;
                break;
            case 'SPLIT':
                this.weaponStats.split = true;
                this.weaponStats.damage *= 0.8; // Lower initial for balance
                break;
        }
        
        // Update player weapon stats
        if (this.scene.player) {
            this.scene.player.fireRate = this.weaponStats.fireRate;
            this.scene.player.bulletSpeed = this.weaponStats.bulletSpeed;
            this.scene.player.bulletSpread = this.weaponStats.spread;
        }
    }
    
    updateVisualAttachments() {
        // Note: Graphics clearing is now handled by UnifiedGraphicsManager (single clear per frame per layer)
        const player = this.scene.player;
        const gm = this.scene.graphicsManager;
        if (!player || !gm) return;
        
        // Position attachments at player
        const x = player.x;
        const y = player.y;
        const angle = player.rotation - Math.PI / 2; // Forward angle
        
        // Draw BARREL attachment
        if (this.slots.BARREL) {
            const color = this.getModColor(this.slots.BARREL);
            
            switch (this.slots.BARREL) {
                case 'RAPID':
                    // Triple barrel tips
                    for (let i = -1; i <= 1; i++) {
                        const bx = x + Math.cos(angle) * 25 + Math.cos(angle + Math.PI/2) * i * 6;
                        const by = y + Math.sin(angle) * 25 + Math.sin(angle + Math.PI/2) * i * 6;
                        gm.drawRing('effects', bx, by, 3, color, 0.8, 2);
                    }
                    break;
                case 'PIERCE':
                    // Long barrel extension
                    const px = x + Math.cos(angle) * 30;
                    const py = y + Math.sin(angle) * 30;
                    gm.drawRing('effects', px, py, 4, color, 0.9, 3);
                    gm.drawRing('effects', px, py, 8, color, 0.5, 1);
                    break;
                case 'SPREAD':
                    // Wide muzzle
                    const sx = x + Math.cos(angle) * 22;
                    const sy = y + Math.sin(angle) * 22;
                    gm.drawCircle('effects', sx, sy, 10, color, 0.3, true);
                    break;
            }
        }
        
        // Draw CHAMBER attachment
        if (this.slots.CHAMBER) {
            const color = this.getModColor(this.slots.CHAMBER);
            
            switch (this.slots.CHAMBER) {
                case 'EXPLOSIVE':
                    // Pulsing core
                    const pulse = 0.7 + Math.sin(this.scene.time.now / 100) * 0.3;
                    gm.drawCircle('effects', x, y, 12, color, 0.4 * pulse, true);
                    break;
                case 'ELEMENTAL':
                    // Rotating element indicator
                    const elemColors = [0xff4400, 0x00ffff, 0xffff00]; // fire, frost, shock
                    const elemIndex = Math.floor(this.scene.time.now / 500) % 3;
                    gm.drawCircle('effects', x, y, 10, elemColors[elemIndex], 0.5, true);
                    break;
                case 'PHASING':
                    // Ghostly ring
                    const alpha = 0.3 + Math.sin(this.scene.time.now / 80) * 0.2;
                    gm.drawRing('effects', x, y, 15, color, alpha, 2);
                    break;
            }
        }
        
        // Draw LENS attachment
        if (this.slots.LENS) {
            const color = this.getModColor(this.slots.LENS);
            
            switch (this.slots.LENS) {
                case 'HOMING':
                    // Targeting ring
                    gm.drawRing('effects', x, y, 35, color, 0.4, 1);
                    // Crosshair
                    const cSize = 8;
                    gm.drawLine('effects', x - cSize, y, x + cSize, y, color, 0.6, 1);
                    gm.drawLine('effects', x, y - cSize, x, y + cSize, color, 0.6, 1);
                    break;
                case 'RICOCHET':
                    // Bounce indicator arcs
                    for (let i = 0; i < 3; i++) {
                        const arcAngle = angle + (i - 1) * 0.5;
                        const ax = x + Math.cos(arcAngle) * 40;
                        const ay = y + Math.sin(arcAngle) * 40;
                        gm.drawRing('effects', ax, ay, 5, color, 0.4, 1);
                    }
                    break;
                case 'SPLIT':
                    // Y-shaped indicator
                    const splitLen = 20;
                    const leftX = x + Math.cos(angle - 0.3) * splitLen;
                    const leftY = y + Math.sin(angle - 0.3) * splitLen;
                    const rightX = x + Math.cos(angle + 0.3) * splitLen;
                    const rightY = y + Math.sin(angle + 0.3) * splitLen;
                    gm.drawLine('effects', x, y, leftX, leftY, color, 0.5, 2);
                    gm.drawLine('effects', x, y, rightX, rightY, color, 0.5, 2);
                    break;
            }
        }
    }
    
    getModColor(modType) {
        const colors = {
            RAPID: 0xff3366, PIERCE: 0xff3366, SPREAD: 0xff3366,
            EXPLOSIVE: 0xffd700, ELEMENTAL: 0xffd700, PHASING: 0xffd700,
            HOMING: 0x00f0ff, RICOCHET: 0x00f0ff, SPLIT: 0x00f0ff
        };
        return colors[modType] || 0xffffff;
    }
    
    /**
     * Apply weapon effects to a spawned bullet
     */
    applyBulletEffects(bullet) {
        // Mark bullet with mod flags
        bullet.isPiercing = this.weaponStats.piercing;
        bullet.isExplosive = this.weaponStats.explosive;
        bullet.isHoming = this.weaponStats.homing;
        bullet.isRicochet = this.weaponStats.ricochet;
        bullet.isSplit = this.weaponStats.split;
        bullet.isPhasing = this.weaponStats.phasing;
        bullet.isElemental = this.weaponStats.elemental;
        
        // Elemental type assignment
        if (bullet.isElemental) {
            bullet.elementalType = this.elementalState; // 0=fire, 1=frost, 2=shock
        }
        
        // Tint based on active mods
        let tint = 0xffff00; // Default yellow
        if (bullet.isExplosive) tint = 0xff6600;
        else if (bullet.isElemental) {
            const elemTints = [0xff4400, 0x00ffff, 0xffff00];
            tint = elemTints[bullet.elementalType];
        }
        else if (bullet.isPiercing) tint = 0xff00ff;
        else if (bullet.isPhasing) tint = 0xaaaaaa;
        
        bullet.setTint(tint);
        
        // Phasing: start invisible, fade in
        if (bullet.isPhasing) {
            bullet.setAlpha(0.3);
            bullet.phaseTimer = 15; // Frames until solid
        }
        
        // Track pierced enemies
        bullet.piercedEnemies = [];
        
        // Track bounces
        bullet.bounces = 0;
        bullet.maxBounces = bullet.isRicochet ? 1 : 0;
        
        // Track if split has occurred
        bullet.hasSplit = false;
        
        return bullet;
    }
    
    /**
     * Update bullet each frame (called from GameScene bullet update)
     */
    updateBullet(bullet) {
        // Phasing: fade in over time
        if (bullet.isPhasing && bullet.phaseTimer > 0) {
            bullet.phaseTimer--;
            bullet.setAlpha(0.3 + (15 - bullet.phaseTimer) / 15 * 0.7);
            bullet.body.checkCollision.none = true; // No collision while phasing
        } else if (bullet.isPhasing && bullet.phaseTimer === 0) {
            bullet.body.checkCollision.none = false;
            bullet.phaseTimer = -1; // Done phasing
            bullet.setAlpha(1);
            // Flash on solidify
            bullet.setTint(0xffffff);
            this.scene.time.delayedCall(50, () => {
                if (bullet.active) bullet.setTint(0xaaaaaa);
            });
        }
        
        // Homing: adjust velocity toward nearest enemy
        if (bullet.isHoming && bullet.seekingLife > 0) {
            const target = this.findNearestEnemy(bullet.x, bullet.y);
            if (target) {
                const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y);
                const currentAngle = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
                // Smooth turn
                const turnRate = 0.08;
                const newAngle = Phaser.Math.Angle.RotateTo(currentAngle, angle, turnRate);
                const speed = this.weaponStats.bulletSpeed;
                bullet.body.setVelocity(
                    Math.cos(newAngle) * speed,
                    Math.sin(newAngle) * speed
                );
                bullet.setRotation(newAngle);
            }
            bullet.seekingLife--;
        }
        
        // Ricochet: bounce off world bounds
        if (bullet.isRicochet && bullet.bounces < bullet.maxBounces) {
            const worldWidth = 1920;
            const worldHeight = 1440;
            let bounced = false;
            let vx = bullet.body.velocity.x;
            let vy = bullet.body.velocity.y;
            
            if (bullet.x <= 0 || bullet.x >= worldWidth) {
                vx = -vx;
                bounced = true;
            }
            if (bullet.y <= 0 || bullet.y >= worldHeight) {
                vy = -vy;
                bounced = true;
            }
            
            if (bounced) {
                bullet.body.setVelocity(vx, vy);
                bullet.setRotation(Math.atan2(vy, vx));
                bullet.bounces++;
                // Visual flash on bounce
                bullet.setTint(0xffffff);
                this.scene.time.delayedCall(50, () => {
                    if (bullet.active) {
                        const tint = bullet.isExplosive ? 0xff6600 : 
                                    bullet.isElemental ? [0xff4400, 0x00ffff, 0xffff00][bullet.elementalType] : 
                                    0xffff00;
                        bullet.setTint(tint);
                    }
                });
            }
        }
    }
    
    findNearestEnemy(x, y) {
        let nearest = null;
        let nearestDist = Infinity;
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            if (dist < nearestDist && dist < 400) { // 400px homing range
                nearestDist = dist;
                nearest = enemy;
            }
        });
        
        return nearest;
    }
    
    /**
     * Handle bullet hitting enemy
     */
    onBulletHitEnemy(bullet, enemy) {
        // Piercing: continue through, don't destroy
        if (bullet.isPiercing) {
            if (!bullet.piercedEnemies.includes(enemy)) {
                bullet.piercedEnemies.push(enemy);
                // Visual trail through enemy
                this.scene.hitParticles.emitParticleAt(enemy.x, enemy.y);
                return 'continue'; // Signal to not destroy bullet
            }
        }
        
        // Explosive: AOE damage
        if (bullet.isExplosive) {
            this.createExplosion(bullet.x, bullet.y, 60);
        }
        
        // Elemental: status effect
        if (bullet.isElemental) {
            this.applyElementalEffect(enemy, bullet.elementalType);
        }
        
        // Split: create two new bullets perpendicular to impact
        if (bullet.isSplit && !bullet.hasSplit) {
            bullet.hasSplit = true;
            this.splitBullet(bullet, enemy);
        }
        
        return 'destroy'; // Normal destroy
    }
    
    createExplosion(x, y, radius) {
        // Visual
        const explosion = this.scene.add.graphics();
        explosion.fillStyle(0xff6600, 0.5);
        explosion.fillCircle(x, y, radius * 0.5);
        explosion.lineStyle(2, 0xff6600, 0.8);
        explosion.strokeCircle(x, y, radius);
        explosion.setDepth(40);
        
        this.scene.tweens.add({
            targets: explosion,
            scale: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => explosion.destroy()
        });
        
        // Damage nearby enemies
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            if (dist <= radius) {
                const damage = Math.floor(20 * (1 - dist / radius)); // Falloff
                enemy.takeDamage(damage);
            }
        });
    }
    
    applyElementalEffect(enemy, type) {
        // 0=fire: damage over time
        // 1=frost: slow
        // 2=shock: chain to nearby
        
        switch (type) {
            case 0: // Fire
                if (!enemy.burnTimer) {
                    enemy.burnTimer = this.scene.time.addEvent({
                        delay: 200,
                        callback: () => {
                            if (enemy.active) {
                                enemy.takeDamage(3);
                                // Fire particles
                                this.scene.hitParticles.setParticleTint(0xff4400);
                                this.scene.hitParticles.emitParticleAt(enemy.x, enemy.y);
                            }
                        },
                        repeat: 4
                    });
                    // Clear burn after 1 second
                    this.scene.time.delayedCall(1000, () => {
                        enemy.burnTimer = null;
                    });
                }
                break;
            case 1: // Frost
                const oldSpeed = enemy.speed;
                enemy.speed *= 0.5;
                enemy.setTint(0x00ffff);
                this.scene.time.delayedCall(2000, () => {
                    if (enemy.active) {
                        enemy.speed = oldSpeed;
                        enemy.clearTint();
                    }
                });
                break;
            case 2: // Shock - chain to nearest enemy
                this.chainShock(enemy, 100);
                break;
        }
    }
    
    chainShock(sourceEnemy, damage) {
        // Find nearest enemy to chain to
        let nearest = null;
        let nearestDist = 150; // Chain range
        
        this.scene.enemies.children.entries.forEach(enemy => {
            if (!enemy.active || enemy === sourceEnemy) return;
            const dist = Phaser.Math.Distance.Between(
                sourceEnemy.x, sourceEnemy.y, enemy.x, enemy.y
            );
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        });
        
        if (nearest) {
            // Visual chain
            const chain = this.scene.add.graphics();
            chain.lineStyle(2, 0xffff00, 0.8);
            chain.moveTo(sourceEnemy.x, sourceEnemy.y);
            chain.lineTo(nearest.x, nearest.y);
            chain.strokePath();
            chain.setDepth(45);
            
            this.scene.tweens.add({
                targets: chain,
                alpha: 0,
                duration: 200,
                onComplete: () => chain.destroy()
            });
            
            // Damage chained enemy
            nearest.takeDamage(damage);
            
            // Lightning effect on chained
            nearest.setTint(0xffff00);
            this.scene.time.delayedCall(100, () => {
                if (nearest.active) nearest.clearTint();
            });
        }
    }
    
    splitBullet(originalBullet, hitEnemy) {
        const angle = originalBullet.rotation;
        const speed = this.weaponStats.bulletSpeed * 0.8;
        
        // Create two split bullets at perpendicular angles
        for (let i = -1; i <= 1; i += 2) {
            const splitAngle = angle + i * Math.PI / 2;
            const splitBullet = this.scene.bullets.get(hitEnemy.x, hitEnemy.y, 'bullet');
            
            if (splitBullet) {
                splitBullet.setActive(true);
                splitBullet.setVisible(true);
                splitBullet.setDepth(1);
                splitBullet.body.enable = true;
                splitBullet.body.reset(hitEnemy.x, hitEnemy.y);
                splitBullet.setScale(0.4);
                
                splitBullet.body.setVelocity(
                    Math.cos(splitAngle) * speed,
                    Math.sin(splitAngle) * speed
                );
                splitBullet.setRotation(splitAngle);
                
                // Mark as split child (no further splitting)
                splitBullet.isSplitChild = true;
                splitBullet.setTint(0x00f0ff);
            }
        }
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;
        
        // Decay progress over time (encourages focusing your playstyle)
        Object.keys(this.modProgress).forEach(mod => {
            if (this.modProgress[mod] > 0 && this.modProgress[mod] < this.UNLOCK_THRESHOLD) {
                this.modProgress[mod] = Math.max(0, this.modProgress[mod] - this.DECAY_RATE * dt);
            }
        });
        
        // Cycle elemental state
        if (this.weaponStats.elemental) {
            this.elementalTimer += dt;
            if (this.elementalTimer >= 0.5) { // Change every 0.5s
                this.elementalTimer = 0;
                this.elementalState = (this.elementalState + 1) % 3;
            }
        }
        
        // Update visual attachments
        this.updateVisualAttachments();
    }
    
    /**
     * Integration hooks - called from other systems
     */
    onBulletTimeGraze() {
        this.addProgress('RAPID', 8);
    }
    
    onBulletTimeStreak(streakLevel) {
        this.addProgress('RICOCHET', 5 * streakLevel);
    }
    
    onEchoAbsorbed() {
        this.addProgress('HOMING', 12);
    }
    
    onFractureKill() {
        this.addProgress('PIERCE', 15);
    }
    
    onPerfectFracture() {
        this.addProgress('SPLIT', 25);
    }
    
    onResidueNodeFire() {
        this.addProgress('SPREAD', 6);
    }
    
    onSingularityDetonate(bulletsFired) {
        this.addProgress('EXPLOSIVE', 10 + bulletsFired * 2);
    }
    
    onHighResonanceChain(chainLength) {
        if (chainLength >= 3) {
            this.addProgress('ELEMENTAL', chainLength * 5);
        }
    }
    
    onGhostBulletHit() {
        this.addProgress('PHASING', 8);
    }
    
    onChronoLoopComplete() {
        // Temporal recursion rewards: boosts all progress slightly
        this.addProgress('RAPID', 5);
        this.addProgress('HOMING', 5);
        this.addProgress('PIERCE', 5);
    }
    
    onQuantumBranch() {
        // Quantum suicide creates temporal paradox energy
        // Boosts ELEMENTAL and PHASING (quantum-tunneling themed mods)
        this.addProgress('ELEMENTAL', 10);
        this.addProgress('PHASING', 8);
    }
}
