import Phaser from 'phaser';

/**
 * AthenaeumProtocolSystem — The Geography of Memory
 * 
 * The arena is no longer an abstract void. It becomes a living atlas where
 * location matters. Different regions develop distinct properties based on
 * what occurred there. The game gains PLACE — a fundamental cognitive
 * dimension that transforms spatial navigation into strategic terrain reading.
 * 
 * Core Innovation: Procedural geography that emerges from play history.
 * The arena develops regions (Verdant, Scorched, Echo, Void, Nexus) based on
 * activity patterns. Each region modifies gameplay when you're in it.
 * 
 * This is the missing 39th cognitive dimension: TOPOGRAPHY.
 */

export default class AthenaeumProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.REGION_SIZE = 240; // px - size of each terrain cell
        this.MAX_REGIONS = 32; // 4x8 grid for 1920x1440 arena
        this.DECAY_RATE = 0.05; // How fast regions fade without activity
        
        // Region types and their colors
        this.REGION_TYPES = {
            VERDANT: {    // High player movement, healing, growth
                color: 0x00ff88,
                glowColor: 0x00cc66,
                symbol: '🌿',
                effect: 'regeneration'
            },
            SCORCHED: {   // High combat, damage amplification, aggression
                color: 0xff4400,
                glowColor: 0xcc3300,
                symbol: '🔥',
                effect: 'ferocity'
            },
            ECHO: {       // Temporal activity, cooldown reduction, recursion
                color: 0xffd700,
                glowColor: 0xccaa00,
                symbol: '◈',
                effect: 'temporal_echo'
            },
            VOID: {       // Low activity, stealth, bullet absorption
                color: 0x663399,
                glowColor: 0x442266,
                symbol: '◉',
                effect: 'dissolution'
            },
            NEXUS: {      // Crossroads of multiple activities, amplification
                color: 0x00f0ff,
                glowColor: 0x00c0cc,
                symbol: '◊',
                effect: 'convergence'
            }
        };
        
        // The atlas - stores region data for each cell
        this.atlas = new Map(); // key: "x,y", value: regionData
        
        // Activity tracking for current frame
        this.activityBuffer = new Map();
        
        // Unified rendering via graphicsManager - no direct graphics objects
        
        // Player position tracking
        this.playerPath = []; // Recent positions for trail effects
        this.maxPathLength = 20;
        
        // Active effects
        this.currentRegion = null;
        this.regionEffectTimer = 0;
        
        // Throttling handled by UnifiedGraphicsManager
        
        // UI
        this.regionIndicator = null;
        
        // Discovery tracking
        this.discoveredRegions = new Set();
        this.regionHistory = []; // For Chronicle integration
        
        this.init();
    }
    
    init() {
        this.createUI();
        this.initializeAtlas();
    }
    
    createUI() {
        // Region indicator in corner
        const margin = 20;
        this.regionIndicator = this.scene.add.container(
            this.scene.cameras.main.width - margin - 100,
            this.scene.cameras.main.height - margin - 60
        );
        this.regionIndicator.setScrollFactor(0);
        this.regionIndicator.setDepth(1000);
        
        // Background
        const bg = this.scene.add.rectangle(0, 0, 200, 60, 0x1a1a25, 0.9);
        bg.setStrokeStyle(1, 0x444455);
        this.regionIndicator.add(bg);
        
        // Symbol
        this.regionSymbol = this.scene.add.text(-80, 0, '◊', {
            fontFamily: 'monospace',
            fontSize: '28px',
            fill: '#00f0ff'
        }).setOrigin(0.5);
        this.regionIndicator.add(this.regionSymbol);
        
        // Name
        this.regionName = this.scene.add.text(-20, -10, 'PRISTINE VOID', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fontStyle: 'bold',
            fill: '#ffffff'
        }).setOrigin(0, 0.5);
        this.regionIndicator.add(this.regionName);
        
        // Effect description
        this.regionEffect = this.scene.add.text(-20, 10, 'No terrain effects', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#888888'
        }).setOrigin(0, 0.5);
        this.regionIndicator.add(this.regionEffect);
        
        // Intensity bar
        this.intensityBar = this.scene.add.rectangle(50, 15, 80, 4, 0x00f0ff, 0.8);
        this.intensityBar.setOrigin(0, 0.5);
        this.intensityBar.scaleX = 0;
        this.regionIndicator.add(this.intensityBar);
    }
    
    initializeAtlas() {
        // Pre-populate with VOID regions
        const worldWidth = 1920;
        const worldHeight = 1440;
        const cols = Math.ceil(worldWidth / this.REGION_SIZE);
        const rows = Math.ceil(worldHeight / this.REGION_SIZE);
        
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const key = `${x},${y}`;
                const worldX = x * this.REGION_SIZE + this.REGION_SIZE / 2;
                const worldY = y * this.REGION_SIZE + this.REGION_SIZE / 2;
                
                this.atlas.set(key, {
                    x: worldX,
                    y: worldY,
                    gridX: x,
                    gridY: y,
                    type: 'VOID',
                    intensity: 0.1,
                    activity: {
                        movement: 0,
                        combat: 0,
                        temporal: 0,
                        passes: 0
                    },
                    lastActive: 0,
                    discovered: false
                });
            }
        }
    }
    
    update(dt, player) {
        // Update player path
        this.updatePlayerPath(player);
        
        // Record activities
        this.recordActivity(player, dt);
        
        // Update region states
        this.updateRegions(dt);
        
        // Check current region and apply effects
        this.updateCurrentRegion(player, dt);
        
        // Render via UnifiedGraphicsManager
        this.renderRegions();
        this.renderConnections();
        
        // Clear activity buffer
        this.activityBuffer.clear();
    }
    
    updatePlayerPath(player) {
        this.playerPath.push({
            x: player.x,
            y: player.y,
            timestamp: this.scene.time.now / 1000
        });
        
        if (this.playerPath.length > this.maxPathLength) {
            this.playerPath.shift();
        }
    }
    
    recordActivity(player, dt) {
        const gridX = Math.floor(player.x / this.REGION_SIZE);
        const gridY = Math.floor(player.y / this.REGION_SIZE);
        const key = `${gridX},${gridY}`;
        const region = this.atlas.get(key);
        
        if (!region) return;
        
        // Calculate movement intensity
        let movement = 0;
        if (this.playerPath.length >= 2 && dt > 0) {
            const last = this.playerPath[this.playerPath.length - 1];
            const prev = this.playerPath[this.playerPath.length - 2];
            const dist = Phaser.Math.Distance.Between(last.x, last.y, prev.x, prev.y);
            movement = dist / (dt / 1000); // pixels per second (dt is in ms)
        }
        
        // Record to buffer for batch processing
        if (!this.activityBuffer.has(key)) {
            this.activityBuffer.set(key, {
                movement: 0,
                combat: 0,
                temporal: 0,
                passes: 0
            });
        }
        
        const activity = this.activityBuffer.get(key);
        activity.movement += movement * 0.1;
        activity.passes += 1;
        
        // Temporal activity detection
        if (this.scene.nearMissState?.active || 
            this.scene.fractureSystem?.isFractured ||
            this.scene.chronoLoop?.isRecording) {
            activity.temporal += 1;
        }
    }
    
    // Called by GameScene when combat happens
    recordCombat(x, y, damage) {
        const gridX = Math.floor(x / this.REGION_SIZE);
        const gridY = Math.floor(y / this.REGION_SIZE);
        const key = `${gridX},${gridY}`;
        
        if (this.activityBuffer.has(key)) {
            this.activityBuffer.get(key).combat += damage;
        } else {
            this.activityBuffer.set(key, {
                movement: 0,
                combat: damage,
                temporal: 0,
                passes: 0
            });
        }
    }
    
    // Called by GameScene when temporal systems activate
    recordTemporalActivity(x, y, intensity = 1) {
        const gridX = Math.floor(x / this.REGION_SIZE);
        const gridY = Math.floor(y / this.REGION_SIZE);
        const key = `${gridX},${gridY}`;
        
        if (this.activityBuffer.has(key)) {
            this.activityBuffer.get(key).temporal += intensity;
        }
    }
    
    updateRegions(dt) {
        const now = this.scene.time.now / 1000;
        
        // Process activity buffer
        this.activityBuffer.forEach((activity, key) => {
            const region = this.atlas.get(key);
            if (!region) return;
            
            // Accumulate activity
            region.activity.movement = Math.min(100, region.activity.movement + activity.movement);
            region.activity.combat = Math.min(100, region.activity.combat + activity.combat * 0.5);
            region.activity.temporal = Math.min(100, region.activity.temporal + activity.temporal);
            region.activity.passes = Math.min(50, region.activity.passes + activity.passes * 0.1);
            
            region.lastActive = now;
            
            // Recalculate region type based on dominant activity
            this.recalculateRegionType(region);
        });
        
        // Decay all regions
        this.atlas.forEach(region => {
            if (now - region.lastActive > 5) { // Only decay after 5s of inactivity
                region.activity.movement = Math.max(0, region.activity.movement - this.DECAY_RATE * dt * 10);
                region.activity.combat = Math.max(0, region.activity.combat - this.DECAY_RATE * dt * 10);
                region.activity.temporal = Math.max(0, region.activity.temporal - this.DECAY_RATE * dt * 10);
                region.activity.passes = Math.max(0, region.activity.passes - this.DECAY_RATE * dt * 5);
                
                // Recalculate if significant decay occurred
                if (region.activity.movement < 5 && region.activity.combat < 5 && 
                    region.activity.temporal < 5) {
                    region.type = 'VOID';
                    region.intensity = 0.1;
                }
            }
        });
    }
    
    recalculateRegionType(region) {
        const { movement, combat, temporal, passes } = region.activity;
        const total = movement + combat + temporal + passes;
        
        if (total < 10) {
            region.type = 'VOID';
            region.intensity = 0.1 + (total / 100);
            return;
        }
        
        // Determine dominant activity
        const dominant = Math.max(movement, combat, temporal, passes);
        
        if (dominant === movement && movement > combat * 1.5) {
            region.type = 'VERDANT';
            region.intensity = Math.min(1, movement / 50);
        } else if (dominant === combat && combat > movement * 1.5) {
            region.type = 'SCORCHED';
            region.intensity = Math.min(1, combat / 50);
        } else if (dominant === temporal && temporal > passes * 2) {
            region.type = 'ECHO';
            region.intensity = Math.min(1, temporal / 30);
        } else if (movement > 20 && combat > 20 && temporal > 10) {
            region.type = 'NEXUS';
            region.intensity = Math.min(1, total / 150);
        } else {
            // Mixed activity defaults to VOID
            region.type = 'VOID';
            region.intensity = Math.min(0.5, total / 100);
        }
        
        // Mark discovery
        if (!region.discovered && region.intensity > 0.3) {
            region.discovered = true;
            this.discoveredRegions.add(`${region.gridX},${region.gridY}`);
            this.onRegionDiscovered(region);
        }
    }
    
    onRegionDiscovered(region) {
        const typeInfo = this.REGION_TYPES[region.type];
        
        // Visual notification
        const notification = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2 - 100,
            `${typeInfo.symbol} DISCOVERED: ${region.type} REGION`,
            {
                fontFamily: 'monospace',
                fontSize: '16px',
                fontStyle: 'bold',
                fill: '#' + typeInfo.color.toString(16).padStart(6, '0')
            }
        );
        notification.setOrigin(0.5);
        notification.setScrollFactor(0);
        notification.setDepth(1000);
        
        this.scene.tweens.add({
            targets: notification,
            y: notification.y - 50,
            alpha: 0,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => notification.destroy()
        });
        
        // Record for Chronicle
        this.regionHistory.push({
            type: region.type,
            x: region.x,
            y: region.y,
            timestamp: Date.now(),
            intensity: region.intensity
        });
        
        // Notify other systems
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('REGION_DISCOVER', {
                regionType: region.type
            });
        }
    }
    
    updateCurrentRegion(player, dt) {
        const gridX = Math.floor(player.x / this.REGION_SIZE);
        const gridY = Math.floor(player.y / this.REGION_SIZE);
        const key = `${gridX},${gridY}`;
        const region = this.atlas.get(key);
        
        if (!region) return;
        
        // Update UI
        const typeInfo = this.REGION_TYPES[region.type];
        this.regionSymbol.setText(typeInfo.symbol);
        this.regionSymbol.setFill('#' + typeInfo.color.toString(16).padStart(6, '0'));
        this.regionName.setText(`${region.type} TERRAIN`);
        this.regionEffect.setText(this.getEffectDescription(region));
        this.intensityBar.fillColor = typeInfo.color;
        this.intensityBar.scaleX = region.intensity;
        
        // Apply region effects
        this.applyRegionEffects(region, player, dt);
        
        this.currentRegion = region;
    }
    
    getEffectDescription(region) {
        const intensity = Math.floor(region.intensity * 100);
        switch (region.type) {
            case 'VERDANT':
                return `+${Math.floor(region.intensity * 5)} HP/sec regeneration (${intensity}%)`;
            case 'SCORCHED':
                return `+${Math.floor(region.intensity * 30)}% damage, ${Math.floor(region.intensity * 20)}% received`;
            case 'ECHO':
                return `-${Math.floor(region.intensity * 25)}% cooldowns (${intensity}%)`;
            case 'VOID':
                return `Stealth: ${Math.floor(region.intensity * 50)}% enemy detection range`;
            case 'NEXUS':
                return `All effects +${Math.floor(region.intensity * 50)}% amplified (${intensity}%)`;
            default:
                return 'No terrain effects';
        }
    }
    
    applyRegionEffects(region, player, dt) {
        const intensity = region.intensity;
        
        switch (region.type) {
            case 'VERDANT':
                // Health regeneration
                if (player.health < 100 && this.scene.time.now % 1000 < 20) {
                    player.health = Math.min(100, player.health + intensity * 0.5);
                    if (this.scene.updateHUD) {
                        this.scene.updateHUD();
                    }
                }
                break;
                
            case 'SCORCHED':
                // Damage amplification - notify OmniWeapon
                if (this.scene.omniWeapon && !this.scene.omniWeapon.terrainBonus) {
                    this.scene.omniWeapon.terrainBonus = {
                        damageMult: 1 + intensity * 0.3,
                        riskMult: 1 + intensity * 0.2
                    };
                }
                break;
                
            case 'ECHO':
                // Cooldown reduction - affects temporal systems
                if (this.scene.fractureSystem) {
                    this.scene.fractureSystem.cooldownReduction = intensity * 0.25;
                }
                if (this.scene.chronoLoop) {
                    this.scene.chronoLoop.cooldownReduction = intensity * 0.25;
                }
                break;
                
            case 'VOID':
                // Enemy detection reduction
                if (this.scene.enemies) {
                    this.scene.enemies.children.entries.forEach(enemy => {
                        if (enemy.active && enemy.detectionRange) {
                            enemy.currentDetectionRange = enemy.detectionRange * (1 - intensity * 0.5);
                        }
                    });
                }
                break;
                
            case 'NEXUS':
                // Amplifies other systems - notify Resonance Cascade
                if (this.scene.resonanceCascade && !this.scene.resonanceCascade.nexusAmplification) {
                    this.scene.resonanceCascade.nexusAmplification = 1 + intensity * 0.5;
                }
                break;
        }
    }
    
    renderRegions() {
        // Render via UnifiedGraphicsManager on 'effects' layer
        if (!this.scene.graphicsManager) return;
        
        const gm = this.scene.graphicsManager;
        
        this.atlas.forEach(region => {
            if (region.intensity < 0.15 && !region.discovered) return;
            
            const typeInfo = this.REGION_TYPES[region.type];
            const alpha = region.discovered ? 0.3 + region.intensity * 0.4 : 0.1;
            const size = this.REGION_SIZE * 0.9;
            
            // Draw region cell (filled rect)
            gm.drawRect(
                'effects',
                region.x - size / 2,
                region.y - size / 2,
                size,
                size,
                typeInfo.color,
                alpha * 0.3
            );
            
            // Draw border for discovered regions (stroked rect)
            if (region.discovered) {
                const borderAlpha = 0.2 + region.intensity * 0.5;
                // Note: UnifiedGraphicsManager doesn't have direct strokeRect with custom line width
                // We use a filled rect approach for border (thinner inner rect)
                const borderWidth = 2;
                gm.drawRect(
                    'effects',
                    region.x - size / 2,
                    region.y - size / 2,
                    size,
                    borderWidth,
                    typeInfo.glowColor,
                    borderAlpha
                );
                gm.drawRect(
                    'effects',
                    region.x - size / 2,
                    region.y + size / 2 - borderWidth,
                    size,
                    borderWidth,
                    typeInfo.glowColor,
                    borderAlpha
                );
                gm.drawRect(
                    'effects',
                    region.x - size / 2,
                    region.y - size / 2,
                    borderWidth,
                    size,
                    typeInfo.glowColor,
                    borderAlpha
                );
                gm.drawRect(
                    'effects',
                    region.x + size / 2 - borderWidth,
                    region.y - size / 2,
                    borderWidth,
                    size,
                    typeInfo.glowColor,
                    borderAlpha
                );
                
                // Draw symbol in center (circle)
                if (region.intensity > 0.5) {
                    gm.drawCircle(
                        'effects',
                        region.x,
                        region.y,
                        8 + region.intensity * 12,
                        typeInfo.color,
                        alpha
                    );
                }
            }
        });
    }
    
    renderConnections() {
        // Render via UnifiedGraphicsManager on 'effects' layer
        if (!this.scene.graphicsManager) return;
        
        const gm = this.scene.graphicsManager;
        
        // Connect adjacent regions of the same type
        const connected = new Set();
        
        this.atlas.forEach(region => {
            if (!region.discovered || region.intensity < 0.4) return;
            
            const neighbors = [
                [region.gridX + 1, region.gridY],
                [region.gridX, region.gridY + 1],
                [region.gridX - 1, region.gridY],
                [region.gridX, region.gridY - 1]
            ];
            
            neighbors.forEach(([nx, ny]) => {
                const neighbor = this.atlas.get(`${nx},${ny}`);
                if (!neighbor || !neighbor.discovered) return;
                
                const connKey = [region.gridX, region.gridY, nx, ny].sort().join(',');
                if (connected.has(connKey)) return;
                
                // Same type = strong connection
                if (region.type === neighbor.type) {
                    const typeInfo = this.REGION_TYPES[region.type];
                    const avgIntensity = (region.intensity + neighbor.intensity) / 2;
                    const lineWidth = 2 + avgIntensity * 4;
                    const alpha = 0.3 + avgIntensity * 0.4;
                    
                    gm.drawLine(
                        'effects',
                        region.x,
                        region.y,
                        neighbor.x,
                        neighbor.y,
                        typeInfo.color,
                        alpha,
                        lineWidth
                    );
                    
                    connected.add(connKey);
                }
            });
        });
    }
    
    // Get region at position
    getRegionAt(x, y) {
        const gridX = Math.floor(x / this.REGION_SIZE);
        const gridY = Math.floor(y / this.REGION_SIZE);
        return this.atlas.get(`${gridX},${gridY}`);
    }
    
    // Get nearby regions of specific type
    getNearbyRegions(x, y, radius, type = null) {
        const results = [];
        const gridRadius = Math.ceil(radius / this.REGION_SIZE);
        const centerGridX = Math.floor(x / this.REGION_SIZE);
        const centerGridY = Math.floor(y / this.REGION_SIZE);
        
        for (let dx = -gridRadius; dx <= gridRadius; dx++) {
            for (let dy = -gridRadius; dy <= gridRadius; dy++) {
                const region = this.atlas.get(`${centerGridX + dx},${centerGridY + dy}`);
                if (!region) continue;
                
                const dist = Phaser.Math.Distance.Between(x, y, region.x, region.y);
                if (dist <= radius && (!type || region.type === type)) {
                    results.push(region);
                }
            }
        }
        
        return results;
    }
    
    // Called by GameScene on game over
    getAtlasData() {
        return {
            discovered: Array.from(this.discoveredRegions),
            history: this.regionHistory,
            dominantType: this.calculateDominantType()
        };
    }
    
    calculateDominantType() {
        const counts = {};
        this.atlas.forEach(region => {
            if (region.discovered) {
                counts[region.type] = (counts[region.type] || 0) + 1;
            }
        });
        
        let dominant = 'VOID';
        let maxCount = 0;
        
        Object.entries(counts).forEach(([type, count]) => {
            if (count > maxCount) {
                dominant = type;
                maxCount = count;
            }
        });
        
        return dominant;
    }
    
    destroy() {
        // Note: Graphics objects are now managed by UnifiedGraphicsManager
        // Only destroy UI elements created by this system
        if (this.regionIndicator) this.regionIndicator.destroy();
    }
}
