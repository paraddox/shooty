import Phaser from 'phaser';

/**
 * Temporal Residue System - Historical Movement as Weaponry
 * 
 * Every 4 seconds, a Residue Node spawns at your current position. These nodes:
 * - Orbit around the player when within range (gravitational tether)
 * - Fire synchronously with player shots (synchronized salvo)
 * - Absorb enemy bullets (defensive buffer) but die after 3 hits
 * - Dissipate after 10 seconds
 * 
 * This transforms your movement patterns into strategic resources. Players
 * will intentionally move in "useful" patterns knowing they'll weaponize.
 * Creates emergent phalanx formations and rewards predictive play.
 */

export default class TemporalResidueSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Timing
        this.residueInterval = 4.0; // Seconds between node spawns
        this.residueTimer = 0;
        this.residueLifespan = 10.0; // Seconds before dissipation
        
        // Node tracking
        this.nodes = []; // Active residue nodes
        this.maxNodes = 4; // Cap to prevent clutter
        
        // Visual config
        this.NODE_COLOR = 0x9d4edd; // Purple - distinct from gold/cyan
        this.NODE_CORE_COLOR = 0xe0aaff;
        this.ORBIT_RADIUS = 120; // Distance to activate orbiting
        this.ORBIT_SPEED = 2.5; // Radians per second
        
        // Node health
        this.NODE_MAX_HEALTH = 3;
        
        // Shooting sync
        this.lastPlayerShotTime = 0;
        
        // Visuals
        this.nodeGraphics = null;
        this.connectionGraphics = null;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
    }
    
    createVisuals() {
        // Connection lines between nodes and player
        this.connectionGraphics = this.scene.add.graphics();
        this.connectionGraphics.setDepth(48);
        
        // Node container graphics
        this.nodeGraphics = this.scene.add.graphics();
        this.nodeGraphics.setDepth(49);
    }
    
    /**
     * Spawn a new residue node at position
     */
    spawnNode(x, y) {
        // Cap nodes
        if (this.nodes.length >= this.maxNodes) {
            // Remove oldest node with dissipation effect
            this.dissipateNode(this.nodes[0]);
            this.nodes.shift();
        }
        
            const node = {
                x: x,
                y: y,
                spawnTime: this.scene.time.now,
                health: this.NODE_MAX_HEALTH,
                maxHealth: this.NODE_MAX_HEALTH,
                orbiting: false,
                orbitAngle: Math.random() * Math.PI * 2,
                orbitRadius: 60 + Math.random() * 40,
                id: Math.random().toString(36).substr(2, 9),
                pulsePhase: Math.random() * Math.PI * 2,
                recentDamage: false
            };
        
        this.nodes.push(node);
        
        // Spawn effect
        this.spawnEffect(x, y);
        
        // Show first spawn notification
        if (this.nodes.length === 1) {
            this.showFirstSpawnNotification(x, y);
        }
        
        return node;
    }
    
    spawnEffect(x, y) {
        // Burst particles
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const speed = 80 + Math.random() * 40;
            
            const particle = this.scene.add.circle(
                x + Math.cos(angle) * 10,
                y + Math.sin(angle) * 10,
                2,
                this.NODE_COLOR
            );
            particle.setAlpha(0.8);
            particle.setDepth(50);
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
        
        // Flash ring
        const ring = this.scene.add.graphics();
        ring.lineStyle(2, this.NODE_COLOR, 0.8);
        ring.strokeCircle(x, y, 15);
        ring.setDepth(50);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
    }
    
    showFirstSpawnNotification(x, y) {
        const text = this.scene.add.text(x, y - 30, 'NODE SPAWNED', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 1,
            fill: '#9d4edd'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    /**
     * Main update - called from GameScene update
     */
    update(dt, player) {
        // Update spawn timer
        this.residueTimer += dt;
        if (this.residueTimer >= this.residueInterval) {
            this.residueTimer = 0;
            if (player.active) {
                this.spawnNode(player.x, player.y);
            }
        }
        
        // Update nodes
        this.updateNodes(dt, player);
        
        // Draw connections and nodes
        this.renderNodes(player);
        
        // Check for player shooting to sync
        this.checkSynchronizedFire(player);
    }
    
    updateNodes(dt, player) {
        const now = this.scene.time.now;
        
        this.nodes = this.nodes.filter(node => {
            // Check lifespan
            const age = (now - node.spawnTime) / 1000;
            if (age >= this.residueLifespan) {
                this.dissipateNode(node);
                return false;
            }
            
            // Update orbit status
            const distToPlayer = Phaser.Math.Distance.Between(
                node.x, node.y, player.x, player.y
            );
            
            if (distToPlayer <= this.ORBIT_RADIUS && !node.orbiting) {
                // Enter orbit
                node.orbiting = true;
                node.orbitAngle = Phaser.Math.Angle.Between(
                    player.x, player.y, node.x, node.y
                );
            } else if (distToPlayer > this.ORBIT_RADIUS + 50 && node.orbiting) {
                // Exit orbit (hysteresis to prevent flickering)
                node.orbiting = false;
            }
            
            // Update position
            if (node.orbiting && player.active) {
                // Orbit around player
                node.orbitAngle += this.ORBIT_SPEED * dt;
                node.x = player.x + Math.cos(node.orbitAngle) * node.orbitRadius;
                node.y = player.y + Math.sin(node.orbitAngle) * node.orbitRadius;
            } else {
                // Drift slowly toward player
                if (player.active) {
                    const angle = Phaser.Math.Angle.Between(node.x, node.y, player.x, player.y);
                    const driftSpeed = 30 * dt;
                    node.x += Math.cos(angle) * driftSpeed;
                    node.y += Math.sin(angle) * driftSpeed;
                }
            }
            
            // Update pulse phase
            node.pulsePhase += dt * 3;
            
            // Clear recent damage flag
            if (node.recentDamage && (now - node.lastDamageTime > 100)) {
                node.recentDamage = false;
            }
            
            return true;
        });
    }
    
    renderNodes(player) {
        this.nodeGraphics.clear();
        this.connectionGraphics.clear();
        
        const now = this.scene.time.now;
        
        this.nodes.forEach((node, index) => {
            const age = (now - node.spawnTime) / 1000;
            const lifeRatio = 1 - (age / this.residueLifespan);
            const healthRatio = node.health / node.maxHealth;
            
            // Pulsing alpha
            const pulse = 0.6 + Math.sin(node.pulsePhase) * 0.2;
            const alpha = pulse * lifeRatio;
            
            // Connection line to player if within orbit range
            const distToPlayer = Phaser.Math.Distance.Between(
                node.x, node.y, player.x, player.y
            );
            
            if (distToPlayer <= this.ORBIT_RADIUS + 50 && player.active) {
                const lineAlpha = Math.max(0, 1 - distToPlayer / this.ORBIT_RADIUS) * 0.3;
                this.connectionGraphics.lineStyle(1, this.NODE_COLOR, lineAlpha);
                this.connectionGraphics.lineBetween(player.x, player.y, node.x, node.y);
            }
            
            // Node core glow
            const glowRadius = 12 + Math.sin(node.pulsePhase) * 3;
            const gradient = this.nodeGraphics;
            
            // Outer glow
            gradient.fillStyle(this.NODE_COLOR, alpha * 0.3);
            gradient.fillCircle(node.x, node.y, glowRadius * 1.5);
            
            // Core
            gradient.fillStyle(this.NODE_CORE_COLOR, alpha);
            gradient.fillCircle(node.x, node.y, 8);
            
            // Health indicator (small dots around node)
            const dotRadius = 14;
            for (let i = 0; i < node.maxHealth; i++) {
                const dotAngle = (Math.PI * 2 / node.maxHealth) * i - Math.PI / 2;
                const dotX = node.x + Math.cos(dotAngle) * dotRadius;
                const dotY = node.y + Math.sin(dotAngle) * dotRadius;
                
                if (i < node.health) {
                    gradient.fillStyle(this.NODE_CORE_COLOR, alpha);
                    gradient.fillCircle(dotX, dotY, 2);
                } else {
                    gradient.fillStyle(0x333344, alpha * 0.5);
                    gradient.fillCircle(dotX, dotY, 2);
                }
            }
            
            // Damage flash
            if (node.recentDamage) {
                gradient.fillStyle(0xffffff, 0.6);
                gradient.fillCircle(node.x, node.y, 10);
            }
            
            // Orbit indicator when active
            if (node.orbiting) {
                gradient.lineStyle(1, this.NODE_COLOR, alpha * 0.5);
                gradient.strokeCircle(node.x, node.y, 16);
            }
        });
        
        // Draw count indicator near player
        if (this.nodes.length > 0 && player.active) {
            const offsetY = -50;
            gradient.fillStyle(this.NODE_COLOR, 0.8);
            gradient.fillCircle(player.x - 20, player.y + offsetY, 4);
            
            // Node count text
            this.scene.residueCountText = this.scene.residueCountText || 
                this.scene.add.text(0, 0, '', {
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fill: '#9d4edd'
                }).setOrigin(0.5).setDepth(100);
            
            this.scene.residueCountText.setPosition(player.x - 8, player.y + offsetY);
            this.scene.residueCountText.setText(`×${this.nodes.length}`);
            this.scene.residueCountText.setVisible(true);
        } else if (this.scene.residueCountText) {
            this.scene.residueCountText.setVisible(false);
        }
    }
    
    checkSynchronizedFire(player) {
        // Check if player fired recently
        if (this.scene.time.now > this.lastPlayerShotTime + this.scene.player.fireRate * 0.8) {
            return; // Not shooting
        }
        
        // Check if we already fired this burst
        if (this.lastPlayerShotTime === this.scene.player.lastFired) {
            return;
        }
        
        this.lastPlayerShotTime = this.scene.player.lastFired;
        
        // Fire from all nodes that are orbiting or near player
        this.nodes.forEach(node => {
            const distToPlayer = Phaser.Math.Distance.Between(
                node.x, node.y, player.x, player.y
            );
            
            if (distToPlayer <= this.ORBIT_RADIUS + 100) {
                this.fireFromNode(node, player);
            }
        });
    }
    
    fireFromNode(node, player) {
        // Get aim angle from player
        const pointer = this.scene.input.activePointer;
        const camera = this.scene.cameras.main;
        const worldX = camera.scrollX + pointer.x / camera.zoom;
        const worldY = camera.scrollY + pointer.y / camera.zoom;
        
        const angle = Phaser.Math.Angle.Between(node.x, node.y, worldX, worldY);
        
        // Create bullet
        const bullet = this.scene.getBulletsGroup().get(node.x, node.y, 'bullet');
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setDepth(1);
            bullet.body.enable = true;
            bullet.body.reset(node.x, node.y);
            
            // Node bullets are purple and slightly smaller
            bullet.setTint(this.NODE_COLOR);
            bullet.setScale(0.4);
            bullet.isNodeBullet = true;
            
            const bulletSpeed = 500;
            bullet.setVelocity(
                Math.cos(angle) * bulletSpeed,
                Math.sin(angle) * bulletSpeed
            );
            bullet.setRotation(angle);
            
            // Small muzzle flash at node
            this.spawnMuzzleFlash(node.x, node.y, angle);
            
            // Notify Resonance Cascade of node firing
            if (this.scene.resonanceCascade) {
                this.scene.resonanceCascade.recordActivation('NODE_FIRE');
            }
            
            // Notify Synchronicity Cascade
            if (this.scene.synchronicityCascade) {
                this.scene.synchronicityCascade.onSystemActivate('residue');
            }
            
            // Notify Omni-Weapon of residue node firing (for spread barrel mod)
            if (this.scene.omniWeapon) {
                this.scene.omniWeapon.onResidueNodeFire();
            }
        }
    }
    
    spawnMuzzleFlash(x, y, angle) {
        const flash = this.scene.add.ellipse(
            x + Math.cos(angle) * 10,
            y + Math.sin(angle) * 10,
            8,
            4,
            this.NODE_COLOR
        );
        flash.setRotation(angle);
        flash.setDepth(2);
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 2,
            duration: 150,
            onComplete: () => flash.destroy()
        });
    }
    
    /**
     * Check if a bullet hit any node (called from collision handler)
     */
    checkBulletCollision(bulletX, bulletY, bulletRadius = 5) {
        for (const node of this.nodes) {
            const dist = Phaser.Math.Distance.Between(bulletX, bulletY, node.x, node.y);
            if (dist <= 12 + bulletRadius) {
                this.damageNode(node);
                return true; // Bullet was absorbed
            }
        }
        return false;
    }
    
    damageNode(node) {
        node.health--;
        node.recentDamage = true;
        node.lastDamageTime = this.scene.time.now;
        
        // Hit effect
        this.spawnDamageEffect(node.x, node.y);
        
        if (node.health <= 0) {
            this.destroyNode(node);
        }
    }
    
    spawnDamageEffect(x, y) {
        // Particle burst
        for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const particle = this.scene.add.circle(
                x, y, 2, this.NODE_CORE_COLOR
            );
            particle.setDepth(51);
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * 30,
                y: y + Math.sin(angle) * 30,
                alpha: 0,
                duration: 200,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    destroyNode(node) {
        // Explosion effect
        const explosion = this.scene.add.graphics();
        explosion.fillStyle(this.NODE_COLOR, 0.5);
        explosion.fillCircle(node.x, node.y, 20);
        explosion.setDepth(52);
        
        this.scene.tweens.add({
            targets: explosion,
            scale: 2,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => explosion.destroy()
        });
        
        // Screen shake micro-effect
        this.scene.cameras.main.shake(50, 0.002);
        
        // Remove from array
        const index = this.nodes.indexOf(node);
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
    }
    
    dissipateNode(node) {
        // Gentle fade-out effect
        const fade = this.scene.add.graphics();
        fade.fillStyle(this.NODE_COLOR, 0.3);
        fade.fillCircle(node.x, node.y, 15);
        fade.setDepth(51);
        
        this.scene.tweens.add({
            targets: fade,
            alpha: 0,
            scale: 1.5,
            duration: 400,
            ease: 'Power2',
            onComplete: () => fade.destroy()
        });
    }
    
    /**
     * Get nearest node to a position (for enemy targeting)
     */
    getNearestNode(x, y) {
        let nearest = null;
        let nearestDist = Infinity;
        
        this.nodes.forEach(node => {
            const dist = Phaser.Math.Distance.Between(x, y, node.x, node.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = node;
            }
        });
        
        return nearest;
    }
    
    /**
     * Get all active nodes (for collision checks)
     */
    getActiveNodes() {
        return this.nodes;
    }
    
    destroy() {
        this.nodeGraphics.destroy();
        this.connectionGraphics.destroy();
        
        if (this.scene.residueCountText) {
            this.scene.residueCountText.destroy();
        }
    }
}
