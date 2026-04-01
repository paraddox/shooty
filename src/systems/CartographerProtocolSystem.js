import Phaser from 'phaser';

/**
 * CARTOGRAPHER PROTOCOL — The 47th Cognitive Dimension: SPATIAL ONTOLOGY
 * 
 * "The player does not merely traverse the void — they cultivate it."
 * 
 * === THE MISSING DIMENSION ===
 * 
 * All 46 previous systems operated WITHIN the arena. None transformed the arena ITSELF.
 * The Cartographer Protocol makes the void REACTIVE — it remembers every step,
 * crystallizes near-misses, and becomes a living monument to your presence.
 * 
 * === CORE MECHANICS ===
 * 
 * 1. VOID TIDE (Movement creates persistent waves)
 *    - Every movement creates ripples in the void floor
 *    - Ripples persist for 30 seconds, fading gradually
 *    - Ripples from multiple sources interfere — creating zones of calm or chaos
 *    - Running in circles creates standing waves — defensive walls
 * 
 * 2. PATH LITHOGRAPHY (Repeated movement creates permanent structure)
 *    - Walking the same path 5+ times raises a crystalline bridge
 *    - Bridges block enemy bullets and movement
 *    - Bridges last 2 minutes, then dissolve back to void
 *    - Different paths create different shapes (line = wall, circle = pillar)
 * 
 * 3. STILLNESS SPRINGS (Deliberate pauses create sanctuaries)
 *    - Standing still for 2+ seconds creates a regenerative zone
 *    - Zone radius grows with stillness duration (max 100px at 5s)
 *    - Standing in zone: +5 health/sec, -20% bullet damage
 *    - Maximum 3 zones; oldest fades if new one created
 * 
 * 4. BULLET SCULPTING (Near-misses become architecture)
 *    - Bullets that pass within 65px but don't hit embed in floor
 *    - Embedded bullets become 30px crystalline obstacles
 *    - Obstacles block enemy movement and bullets
 *    - Player can "harvest" crystals by touching them (+10 score, clears obstacle)
 * 
 * 5. TERRITORIAL RESONANCE (The arena becomes your echo)
 *    - Areas where you spend time become "attuned" (cyan glow)
 *    - Attuned areas: +10% movement speed, faster fire rate
 *    - Enemy-controlled areas (where enemies linger) become crimson
 *    - Crimson areas: -10% player stats, enemies move faster
 *    - Push/pull dynamic: You're fighting for control of the floor itself
 * 
 * === THE TACTICAL LAYER ===
 * 
 * Before: You dodged bullets in a static box.
 * After: You CREATE cover, RAISE fortifications, CULTIVate safe zones.
 * 
 * The arena becomes your weapon, your shield, your legacy.
 * 
 * === THE AESTHETIC ===
 * 
 * - Void Tides: Fading cyan ripples with interference patterns
 * - Lithography: Glowing white geometric shapes rising from void
 * - Stillness: Golden radial glow with breathing pulse
 * - Sculpting: Crystalline prisms catching the light
 * - Resonance: Floor tiles shifting between cyan (player) and crimson (enemy)
 * 
 * Color: Void Cerulean (#00b4d8) — the color of space becoming aware
 * 
 * @author The 47th Dimension
 */

export default class CartographerProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.VOID_COLOR = 0x00b4d8;
        this.LITHO_COLOR = 0xffffff;
        this.STILLNESS_COLOR = 0xffd700;
        this.CRYSTAL_COLOR = 0x9d4edd;
        this.PLAYER_TERRITORY_COLOR = 0x00f0ff;
        this.ENEMY_TERRITORY_COLOR = 0xff3366;
        
        // Void Tides (movement ripples)
        this.ripples = [];
        this.maxRipples = 100;
        this.rippleLifespan = 30000; // 30 seconds
        
        // Path Lithography (persistent paths)
        this.pathSegments = new Map(); // key: "x,y" → segment data
        this.lithographyThreshold = 5; // crossings to crystallize
        this.lithographyLifespan = 120000; // 2 minutes
        this.lithographyBodies = [];
        
        // Stillness Springs (regenerative zones)
        this.springs = [];
        this.maxSprings = 3;
        this.springMinDuration = 2000; // 2 seconds to create
        this.springMaxRadius = 100;
        this.playerStillTime = 0;
        this.playerLastPos = { x: 0, y: 0 };
        
        // Bullet Sculpting (embedded bullets)
        this.crystals = [];
        this.maxCrystals = 50;
        
        // Territorial Resonance (floor control)
        this.territoryGrid = [];
        this.gridSize = 64; // pixels per cell
        this.gridWidth = Math.ceil(1920 / this.gridSize);
        this.gridHeight = Math.ceil(1440 / this.gridSize);
        this.territoryDecay = 0.98; // decay per second
        
        // Player tracking for path detection
        this.playerPathHistory = [];
        this.maxHistoryLength = 300; // 5 seconds at 60fps
        
        this.init();
    }
    
    init() {
        this.initTerritoryGrid();
    }
    
    initTerritoryGrid() {
        for (let y = 0; y < this.gridHeight; y++) {
            this.territoryGrid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.territoryGrid[y][x] = {
                    playerInfluence: 0,
                    enemyInfluence: 0,
                    dominant: 'neutral' // 'player', 'enemy', 'neutral'
                };
            }
        }
    }
    
    update(dt, player, enemies) {
        const deltaSeconds = dt / 1000;
        
        this.updateVoidTides(dt, player);
        this.updatePathLithography(dt, player);
        this.updateStillnessSprings(dt, player);
        this.updateBulletSculpting(dt, player);
        this.updateTerritorialResonance(deltaSeconds, player, enemies);
        this.updateCrystals(dt);
        this.renderAll();
    }
    
    // === VOID TIDE: Movement creates ripples ===
    updateVoidTides(dt, player) {
        // Check if player moved significantly
        const dx = player.x - this.playerLastPos.x;
        const dy = player.y - this.playerLastPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 5) { // Moved enough to create a ripple
            this.playerLastPos = { x: player.x, y: player.y };
            
            // Add to history for path detection
            this.playerPathHistory.push({
                x: player.x,
                y: player.y,
                time: this.scene.time.now
            });
            
            if (this.playerPathHistory.length > this.maxHistoryLength) {
                this.playerPathHistory.shift();
            }
            
            // Create ripple based on movement speed
            const speed = dist / (dt / 1000);
            this.createRipple(player.x, player.y, speed);
        }
        
        // Age and filter ripples
        const now = this.scene.time.now;
        this.ripples = this.ripples.filter(ripple => {
            ripple.age += dt;
            ripple.radius = (ripple.age / 1000) * ripple.speed * 0.5;
            ripple.alpha = 1 - (ripple.age / this.rippleLifespan);
            return ripple.age < this.rippleLifespan;
        });
    }
    
    createRipple(x, y, speed) {
        if (this.ripples.length >= this.maxRipples) {
            this.ripples.shift(); // Remove oldest
        }
        
        this.ripples.push({
            x: x,
            y: y,
            age: 0,
            speed: Math.min(speed, 300),
            radius: 0,
            alpha: 1,
            intensity: Math.min(speed / 200, 1)
        });
    }
    
    // === PATH LITHOGRAPHY: Repeated paths become solid ===
    updatePathLithography(dt, player) {
        // Check for path crossings (simplified: check if near previous positions)
        const now = this.scene.time.now;
        
        // Get grid cell player is in
        const gridX = Math.floor(player.x / this.gridSize);
        const gridY = Math.floor(player.y / this.gridSize);
        const key = `${gridX},${gridY}`;
        
        if (!this.pathSegments.has(key)) {
            this.pathSegments.set(key, {
                x: gridX * this.gridSize + this.gridSize / 2,
                y: gridY * this.gridSize + this.gridSize / 2,
                crossings: 1,
                lastCrossing: now,
                crystallized: false,
                crystallizationTime: 0
            });
        } else {
            const segment = this.pathSegments.get(key);
            if (now - segment.lastCrossing > 500) { // Debounce
                segment.crossings++;
                segment.lastCrossing = now;
                
                // Crystallize if threshold reached
                if (!segment.crystallized && segment.crossings >= this.lithographyThreshold) {
                    this.crystallizeSegment(segment);
                }
            }
        }
        
        // Age and remove old crystallized segments
        this.pathSegments.forEach((segment, key) => {
            if (segment.crystallized) {
                segment.crystallizationTime += dt;
                if (segment.crystallizationTime > this.lithographyLifespan) {
                    this.dissolveSegment(key);
                }
            }
        });
    }
    
    crystallizeSegment(segment) {
        segment.crystallized = true;
        segment.crystallizationTime = 0;
        
        // Create physics body for collision
        const body = this.scene.add.rectangle(
            segment.x, segment.y,
            this.gridSize - 4, this.gridSize - 4,
            this.LITHO_COLOR, 0.6
        );
        body.setDepth(10);
        
        // Add physics for collision
        this.scene.physics.add.existing(body, true); // Static body
        
        segment.body = body;
        
        // Add collision with enemy bullets
        if (this.scene.enemyBullets) {
            this.scene.physics.add.collider(body, this.scene.enemyBullets, (wall, bullet) => {
                bullet.setActive(false);
                bullet.setVisible(false);
                this.createCrystalShatterEffect(bullet.x, bullet.y);
            });
        }
        
        // Visual effect
        this.createCrystallizationEffect(segment.x, segment.y);
        
        // Show announcement
        this.showAnnouncement('LITHOGRAPHY', segment.x, segment.y - 40);
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('LITHOGRAPHY');
        }
    }
    
    dissolveSegment(key) {
        const segment = this.pathSegments.get(key);
        if (segment && segment.body) {
            // Fade out effect
            this.scene.tweens.add({
                targets: segment.body,
                alpha: 0,
                scale: 0.8,
                duration: 1000,
                onComplete: () => {
                    segment.body.destroy();
                }
            });
        }
        this.pathSegments.delete(key);
    }
    
    // === STILLNESS SPRINGS: Pauses create sanctuaries ===
    updateStillnessSprings(dt, player) {
        const dx = player.x - this.playerLastPos.x;
        const dy = player.y - this.playerLastPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 2) { // Essentially still
            this.playerStillTime += dt;
            
            // Check if we should create a spring
            if (this.playerStillTime >= this.springMinDuration) {
                const existingSpring = this.getSpringAt(player.x, player.y);
                
                if (!existingSpring) {
                    this.createSpring(player.x, player.y);
                } else {
                    // Grow existing spring
                    existingSpring.targetRadius = Math.min(
                        this.springMaxRadius,
                        50 + (this.playerStillTime - this.springMinDuration) / 50
                    );
                }
            }
        } else {
            this.playerStillTime = 0;
        }
        
        // Update springs
        this.springs.forEach(spring => {
            // Smooth radius transition
            spring.radius = Phaser.Math.Linear(spring.radius, spring.targetRadius, 0.1);
            
            // Check if player is in spring
            const distToPlayer = Phaser.Math.Distance.Between(
                spring.x, spring.y, this.scene.player.x, this.scene.player.y
            );
            
            spring.playerInside = distToPlayer < spring.radius;
            
            // Pulse effect
            spring.pulsePhase += dt * 0.003;
            spring.pulseScale = 1 + Math.sin(spring.pulsePhase) * 0.1;
        });
    }
    
    createSpring(x, y) {
        // Remove oldest if at max
        if (this.springs.length >= this.maxSprings) {
            const old = this.springs.shift();
            this.fadeOutSpring(old);
        }
        
        const spring = {
            x: x,
            y: y,
            radius: 0,
            targetRadius: 50,
            playerInside: false,
            pulsePhase: 0,
            pulseScale: 1
        };
        
        this.springs.push(spring);
        
        // Announcement
        this.showAnnouncement('SANCTUARY', x, y - 50);
        
        // Effect
        this.createSpringBirthEffect(x, y);
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('STILLNESS_SPRING');
        }
    }
    
    fadeOutSpring(spring) {
        // Visual fade out
        const ghost = this.scene.add.circle(spring.x, spring.y, spring.radius, this.STILLNESS_COLOR, 0.5);
        this.scene.tweens.add({
            targets: ghost,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            onComplete: () => ghost.destroy()
        });
    }
    
    getSpringAt(x, y) {
        return this.springs.find(spring => 
            Phaser.Math.Distance.Between(spring.x, spring.y, x, y) < spring.radius
        );
    }
    
    // Apply spring benefits (called from GameScene)
    getSpringBenefits() {
        const activeSpring = this.springs.find(s => s.playerInside);
        if (activeSpring) {
            return {
                healthRegen: 5, // per second
                damageReduction: 0.2,
                inSpring: true
            };
        }
        return { healthRegen: 0, damageReduction: 0, inSpring: false };
    }
    
    // === BULLET SCULPTING: Near-misses become crystals ===
    onNearMiss(bulletX, bulletY) {
        // Chance to crystallize based on near-miss
        if (Math.random() < 0.3 && this.crystals.length < this.maxCrystals) {
            this.createCrystal(bulletX, bulletY);
        }
    }
    
    createCrystal(x, y) {
        const crystal = {
            x: x,
            y: y,
            radius: 15,
            health: 30, // Can absorb 30 damage worth of bullets
            maxHealth: 30,
            created: this.scene.time.now
        };
        
        this.crystals.push(crystal);
        
        // Create physics body
        const body = this.scene.add.rectangle(x, y, 30, 30, this.CRYSTAL_COLOR, 0.8);
        body.setDepth(12);
        this.scene.physics.add.existing(body, true);
        
        crystal.body = body;
        
        // Collision with enemy bullets
        if (this.scene.enemyBullets) {
            this.scene.physics.add.overlap(body, this.scene.enemyBullets, (crystalBody, bullet) => {
                // Find crystal data
                const crystal = this.crystals.find(c => c.body === crystalBody);
                if (crystal) {
                    crystal.health -= 10;
                    bullet.setActive(false);
                    bullet.setVisible(false);
                    
                    // Flash effect
                    crystalBody.setFillStyle(0xffffff, 1);
                    this.scene.time.delayedCall(100, () => {
                        if (crystalBody.active) {
                            crystalBody.setFillStyle(this.CRYSTAL_COLOR, 0.8);
                        }
                    });
                    
                    if (crystal.health <= 0) {
                        this.shatterCrystal(crystal);
                    }
                }
            });
        }
        
        // Collision with player (for harvesting)
        if (this.scene.player) {
            this.scene.physics.add.overlap(body, this.scene.player.sprite, (crystalBody, playerSprite) => {
                const crystal = this.crystals.find(c => c.body === crystalBody);
                if (crystal && !crystal.harvested) {
                    crystal.harvested = true;
                    this.harvestCrystal(crystal);
                }
            });
        }
    }
    
    harvestCrystal(crystal) {
        // Score bonus
        this.scene.score += 10;
        
        // Visual feedback
        this.showAnnouncement('+10', crystal.x, crystal.y - 20, 0x00ff00);
        
        // Shatter effect
        this.shatterCrystal(crystal);
        
        // Notify Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('CRYSTAL_HARVEST');
        }
    }
    
    shatterCrystal(crystal) {
        // Particle effect
        const particles = this.scene.add.particles(crystal.x, crystal.y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.4, end: 0 },
            lifespan: 500,
            quantity: 8,
            tint: this.CRYSTAL_COLOR
        });
        
        this.scene.time.delayedCall(500, () => particles.destroy());
        
        // Remove
        if (crystal.body) {
            crystal.body.destroy();
        }
        this.crystals = this.crystals.filter(c => c !== crystal);
    }
    
    updateCrystals(dt) {
        // Age crystals (they fade over time)
        const maxAge = 60000; // 1 minute
        this.crystals = this.crystals.filter(crystal => {
            const age = this.scene.time.now - crystal.created;
            const remaining = 1 - (age / maxAge);
            
            if (crystal.body && crystal.body.active) {
                crystal.body.setAlpha(0.5 + remaining * 0.5);
            }
            
            if (remaining <= 0) {
                this.shatterCrystal(crystal);
                return false;
            }
            return true;
        });
    }
    
    // === TERRITORIAL RESONANCE: Floor control ===
    updateTerritorialResonance(deltaSeconds, player, enemies) {
        // Decay all influence
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.territoryGrid[y][x];
                cell.playerInfluence *= Math.pow(this.territoryDecay, deltaSeconds);
                cell.enemyInfluence *= Math.pow(this.territoryDecay, deltaSeconds);
            }
        }
        
        // Add player influence
        const playerGridX = Math.floor(player.x / this.gridSize);
        const playerGridY = Math.floor(player.y / this.gridSize);
        
        // Influence radius of 2 cells
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const gx = playerGridX + dx;
                const gy = playerGridY + dy;
                
                if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = Math.max(0, 1 - dist / 3) * 0.1;
                    this.territoryGrid[gy][gx].playerInfluence += influence;
                }
            }
        }
        
        // Add enemy influence
        if (enemies) {
            enemies.getChildren().forEach(enemy => {
                if (!enemy.active) return;
                
                const ex = Math.floor(enemy.x / this.gridSize);
                const ey = Math.floor(enemy.y / this.gridSize);
                
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const gx = ex + dx;
                        const gy = ey + dy;
                        
                        if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const influence = Math.max(0, 1 - dist / 2) * 0.15;
                            this.territoryGrid[gy][gx].enemyInfluence += influence;
                        }
                    }
                }
            });
        }
        
        // Determine dominance
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.territoryGrid[y][x];
                const diff = cell.playerInfluence - cell.enemyInfluence;
                
                if (diff > 0.3) {
                    cell.dominant = 'player';
                } else if (diff < -0.3) {
                    cell.dominant = 'enemy';
                } else {
                    cell.dominant = 'neutral';
                }
            }
        }
    }
    
    // Get territorial bonuses for player
    getTerritorialBonuses() {
        const player = this.scene.player;
        if (!player) return { speedMod: 1, fireRateMod: 1 };
        
        const gx = Math.floor(player.x / this.gridSize);
        const gy = Math.floor(player.y / this.gridSize);
        
        if (gx >= 0 && gx < this.gridWidth && gy >= 0 && gy < this.gridHeight) {
            const cell = this.territoryGrid[gy][gx];
            
            if (cell.dominant === 'player') {
                return { speedMod: 1.1, fireRateMod: 1.1 };
            } else if (cell.dominant === 'enemy') {
                return { speedMod: 0.9, fireRateMod: 0.9 };
            }
        }
        
        return { speedMod: 1, fireRateMod: 1 };
    }
    
    // === RENDERING ===
    renderAll() {
        this.renderRipplesUnified();
        this.renderTerritoryUnified();
        this.renderSpringsUnified();
    }
    
    // Unified Rendering Methods
    renderRipplesUnified() {
        const manager = this.scene.graphicsManager;
        
        this.ripples.forEach(ripple => {
            const alpha = ripple.alpha * 0.3 * ripple.intensity;
            
            // Main ripple ring
            manager.drawRing('effects', ripple.x, ripple.y, ripple.radius, this.VOID_COLOR, alpha, 2);
            
            // Second ring
            if (ripple.radius > 20) {
                manager.drawRing('effects', ripple.x, ripple.y, ripple.radius * 0.7, this.VOID_COLOR, alpha * 0.5, 1);
            }
        });
    }
    
    renderTerritoryUnified() {
        const manager = this.scene.graphicsManager;
        
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.territoryGrid[y][x];
                const px = x * this.gridSize;
                const py = y * this.gridSize;
                
                if (cell.dominant === 'player') {
                    const alpha = Math.min(0.3, cell.playerInfluence * 0.5);
                    manager.drawRect('effects', px, py, this.gridSize, this.gridSize, this.PLAYER_TERRITORY_COLOR, alpha);
                } else if (cell.dominant === 'enemy') {
                    const alpha = Math.min(0.3, Math.abs(cell.enemyInfluence) * 0.5);
                    manager.drawRect('effects', px, py, this.gridSize, this.gridSize, this.ENEMY_TERRITORY_COLOR, alpha);
                }
            }
        }
    }
    
    renderSpringsUnified() {
        const manager = this.scene.graphicsManager;
        
        this.springs.forEach(spring => {
            // Outer glow
            manager.drawCircle('effects', spring.x, spring.y, spring.radius * spring.pulseScale, this.STILLNESS_COLOR, 0.2);
            
            // Inner core
            manager.drawCircle('effects', spring.x, spring.y, spring.radius * 0.5 * spring.pulseScale, this.STILLNESS_COLOR, 0.4);
            
            // Ring
            manager.drawRing('effects', spring.x, spring.y, spring.radius * spring.pulseScale, this.STILLNESS_COLOR, 0.6, 2);
        });
    }
    
    // === VISUAL EFFECTS ===
    createCrystallizationEffect(x, y) {
        // Ring expansion
        const ring = this.scene.add.circle(x, y, 10, this.LITHO_COLOR, 0);
        ring.setStrokeStyle(3, this.LITHO_COLOR);
        this.scene.tweens.add({
            targets: ring,
            radius: this.gridSize,
            alpha: { from: 1, to: 0 },
            duration: 600,
            onComplete: () => ring.destroy()
        });
        
        // Particle burst
        const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 30, max: 80 },
            scale: { start: 0.3, end: 0 },
            lifespan: 400,
            quantity: 6,
            tint: this.LITHO_COLOR
        });
        this.scene.time.delayedCall(400, () => particles.destroy());
    }
    
    createSpringBirthEffect(x, y) {
        const ring = this.scene.add.circle(x, y, 5, this.STILLNESS_COLOR, 0);
        ring.setStrokeStyle(4, this.STILLNESS_COLOR);
        this.scene.tweens.add({
            targets: ring,
            radius: 80,
            alpha: { from: 1, to: 0 },
            duration: 800,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
    }
    
    createCrystalShatterEffect(x, y) {
        const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 120 },
            scale: { start: 0.4, end: 0 },
            lifespan: 300,
            quantity: 5,
            tint: this.CRYSTAL_COLOR
        });
        this.scene.time.delayedCall(300, () => particles.destroy());
    }
    
    showAnnouncement(text, x, y, color = this.VOID_COLOR) {
        const hexColor = typeof color === 'number' ? 
            '#' + color.toString(16).padStart(6, '0') : 
            '#00b4d8';
        
        const announcement = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            fill: hexColor,
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: announcement,
            y: y - 30,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => announcement.destroy()
        });
    }
    
    // === CLEANUP ===
    destroy() {
        // Clean up physics bodies
        this.pathSegments.forEach(segment => {
            if (segment.body) segment.body.destroy();
        });
        
        this.crystals.forEach(crystal => {
            if (crystal.body) crystal.body.destroy();
        });
    }
}
