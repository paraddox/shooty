import Phaser from 'phaser';

/**
 * MIGRATED to UnifiedGraphicsManager (April 2025):
 * - Grid rendering now uses UnifiedGraphicsManager on 'ui' layer
 * - Arena boundaries, walls, sanctuaries, chambers use 'effects' layer
 * - Eliminated 4 graphics.clear() calls when using UnifiedGraphicsManager
 * - Legacy graphics paths preserved for backward compatibility
 *
 * Geometric Chorus System — The Living Arena
 * 
 * The missing environmental dimension: While 31 systems manipulate time, project echoes,
 * and spawn enemies, NONE transform the arena itself. This system makes the bullet hell
 * space ALIVE — walls that breathe, geometry that shifts, and architecture that learns
 * your playstyle to create personalized combat spaces.
 * 
 * Core Mechanics:
 * 
 * 1. ADAPTIVE BOUNDARIES (Always Active)
 *    - Arena edges are not static walls but "breathing membranes"
 *    - Contract during intense moments (bullet density ↑) to focus chaos
 *    - Expand when health is low, creating escape room (compassionate architecture)
 *    - Pulse rhythmically during Resonance Cascades (visual-audio harmony)
 * 
 * 2. GEOMETRIC RESPONSE TO PLAYSTYLE (Real-time adaptation)
 *    - Aggressive players (high graze rate): Arena creates "aggression lanes" — 
 *      narrow channels that reward risky positioning with escape routes
 *    - Defensive players (high dodge rate): Arena creates "sanctuary zones" —
 *      temporary safe pockets that dissolve if you stay too long (anti-camping)
 *    - Tactical players (high system usage): Arena creates "amplification chambers" —
 *      zones where your temporal systems have enhanced effects
 * 
 * 3. ARCHITECTURAL MEMORY (Persistent across runs)
 *    - Uses Chronicle data to remember your preferred zones
 *    - Creates "familiar geometry" — shapes that echo your best runs
 *    - At Wave 5: Arena briefly becomes a "memory palace" of your previous session
 * 
 * 4. THE CHORUS WALLS (Procedural barriers)
 *    - Walls materialize from void particles during bullet storms
 *    - They don't block YOU (phased for player), only ENEMY BULLETS
 *    - Bullets that hit walls become "wall echoes" that fire back after delay
 *    - Strategic positioning near walls creates defensive perimeters
 * 
 * 5. ZENITH GEOMETRY (Ultimate arena transformation)
 *    - Trigger: 8+ systems active simultaneously OR Wave 10
 *    - The arena becomes a rotating kaleidoscope of shifting walls
 *    - Creates "bullet hell mazes" that must be navigated while fighting
 *    - Inspiration from Devil Daggers + Geometry Wars + Bullet Hell
 * 
 * Why this is revolutionary:
 * - First bullet hell where the ARENA is an active participant, not just a container
 * - Compassionate architecture: The game literally makes space for you when struggling
 * - Punitive architecture: The game takes away safety when you're too passive
 * - Creates "terrain tactics" — positioning relative to walls becomes as important
 *   as dodging bullets (bullet hell meets tactical positioning)
 * - Makes every run spatially unique — the arena is never the same twice
 * 
 * Color: Deep Indigo (#4b0082) for walls — mysterious, void-touched architecture
 * Glow: Soft Cyan (#00f0ff) edges — inviting but ethereal
 * Warning: Amber (#ffaa00) when walls are about to shift
 * 
 * Integration:
 * - Echo Storm: Echoes that hit walls create "echo chambers" (delayed multi-fire)
 * - Fracture: Ghost player can pass through walls (real player phased), creating
 *   unique flanking routes only available during fracture
 * - Singularity: Gravity wells distort wall geometry, creating curved barriers
 * - Paradox Engine: Predicted paths show future wall positions
 * - Residue: Nodes embed in walls, creating "turret walls" that fire outward
 * - Nemesis: Boss commands the arena, shifting walls to corner you
 * - Oracle: Previews upcoming wall shifts as ghost geometry
 */

export default class GeometricChorusSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.INDIGO_COLOR = 0x4b0082;
        this.INDIGO_GLOW = 0x6b30a0;
        this.CYAN_EDGE = 0x00f0ff;
        this.AMBER_WARNING = 0xffaa00;
        this.WALL_ALPHA = 0.4;
        this.WALL_GLOW_ALPHA = 0.2;
        
        // Arena boundaries (dynamic)
        this.baseBounds = { x: 0, y: 0, width: 1920, height: 1440 };
        this.currentBounds = { ...this.baseBounds };
        this.targetBounds = { ...this.baseBounds };
        this.breathPhase = 0;
        this.breathSpeed = 0.5; // Breaths per minute
        
        // Playstyle tracking
        this.playstyleProfile = {
            aggression: 0.5,  // 0 = defensive, 1 = aggressive
            mobility: 0.5,    // 0 = static, 1 = constantly moving
            systemUsage: 0.5, // 0 = basic, 1 = uses all temporal systems
            grazeRate: 0,     // Near-misses per second
            dodgeRate: 0,     // Successful dodges per second
            wallProximity: 0  // Time spent near walls
        };
        this.profileWindow = 10; // Seconds to calculate averages
        this.history = [];
        
        // Procedural walls
        this.walls = []; // Array of wall segments
        this.maxWalls = 8;
        this.wallLifetime = 12; // Seconds
        this.wallThickness = 40;
        this.wallHealth = 100;
        
        // Sanctuary zones (safe pockets)
        this.sanctuaries = []; // Active safe zones
        this.maxSanctuaries = 2;
        this.sanctuaryLifetime = 5;
        
        // Aggression lanes (narrow channels)
        this.lanes = [];
        this.maxLanes = 3;
        
        // Amplification chambers (system boost zones)
        this.chambers = [];
        this.maxChambers = 2;
        
        // Chorus state
        this.chorusIntensity = 0; // 0-1 scale
        this.isZenith = false; // Ultimate transformation active
        this.zenithTimer = 0;
        
        // Visuals
        this.wallGraphics = null;
        this.arenaGraphics = null;
        this.glowGraphics = null;
        this.gridGraphics = null;
        
        // Breathing animation
        this.breathTimer = 0;
        this.breathIn = true;
        
        // State
        this.initialized = false;
        this.active = true;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.createArenaGrid();
        this.startBreathing();
        this.initialized = true;
    }
    
    createVisuals() {
        // Check for UnifiedGraphicsManager (new architecture)
        if (this.scene.graphicsManager) {
            this.useUnifiedRenderer = true;
        } else {
            this.useUnifiedRenderer = false;
            // Legacy: Main wall rendering
            this.wallGraphics = this.scene.add.graphics();
            this.wallGraphics.setDepth(30); // Below enemies, above floor
            
            // Legacy: Arena boundary graphics
            this.arenaGraphics = this.scene.add.graphics();
            this.arenaGraphics.setDepth(25);
            
            // Legacy: Glow effects
            this.glowGraphics = this.scene.add.graphics();
            this.glowGraphics.setDepth(24);
            
            // Legacy: Grid pattern on floor
            this.gridGraphics = this.scene.add.graphics();
            this.gridGraphics.setDepth(1);
        }
        
        // Create wall texture
        this.createWallTexture();
    }
    
    createWallTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Indigo base with subtle pattern
        ctx.fillStyle = '#4b0082';
        ctx.fillRect(0, 0, 64, 64);
        
        // Hexagonal pattern
        ctx.strokeStyle = '#6b30a0';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        
        for (let y = 0; y < 64; y += 16) {
            for (let x = 0; x < 64; x += 16) {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const px = x + 8 + Math.cos(angle) * 6;
                    const py = y + 8 + Math.sin(angle) * 6;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
        
        this.scene.textures.addCanvas('chorusWall', canvas);
    }
    
    createArenaGrid() {
        // Draw subtle grid on arena floor
        if (this.useUnifiedRenderer) {
            // Use UnifiedGraphicsManager - grid is static, register once on 'ui' layer
            const gridSize = 120;
            for (let x = 0; x <= 1920; x += gridSize) {
                this.scene.graphicsManager.drawLine('ui', x, 0, x, 1440, this.CYAN_EDGE, 0.1, 1);
            }
            for (let y = 0; y <= 1440; y += gridSize) {
                this.scene.graphicsManager.drawLine('ui', 0, y, 1920, y, this.CYAN_EDGE, 0.1, 1);
            }
        } else {
            // Legacy: direct graphics - graphics.clear() eliminated when using UnifiedGraphicsManager
            this.gridGraphics.lineStyle(1, this.CYAN_EDGE, 0.1);
            
            const gridSize = 120;
            for (let x = 0; x <= 1920; x += gridSize) {
                this.gridGraphics.moveTo(x, 0);
                this.gridGraphics.lineTo(x, 1440);
            }
            for (let y = 0; y <= 1440; y += gridSize) {
                this.gridGraphics.moveTo(0, y);
                this.gridGraphics.lineTo(1920, y);
            }
            this.gridGraphics.strokePath();
        }
    }
    
    startBreathing() {
        // Arena "breathes" - expands and contracts subtly
        this.breathTimer = 0;
    }
    
    update(dt, player) {
        if (!this.active || !player) return;
        
        // Update playstyle profile
        this.updatePlaystyleProfile(dt, player);
        
        // Calculate chorus intensity based on game state
        this.updateChorusIntensity(dt);
        
        // Breathe the arena boundaries
        this.updateArenaBreathing(dt);
        
        // Adapt geometry based on playstyle
        this.updateAdaptiveGeometry(dt, player);
        
        // Update procedural walls
        this.updateWalls(dt, player);
        
        // Update sanctuaries
        this.updateSanctuaries(dt, player);
        
        // Update lanes
        this.updateLanes(dt, player);
        
        // Update chambers
        this.updateChambers(dt, player);
        
        // Zenith transformation
        this.updateZenithState(dt, player);
        
        // Render everything
        this.render();
    }
    
    updatePlaystyleProfile(dt, player) {
        // Record position history
        this.history.push({
            x: player.x,
            y: player.y,
            health: player.health,
            velocity: Math.sqrt(player.body?.velocity?.x ** 2 + player.body?.velocity?.y ** 2) || 0,
            nearMisses: this.scene.nearMissState?.totalCount || 0,
            systemsActive: this.countActiveSystems(),
            time: this.scene.time.now / 1000
        });
        
        // Keep only recent history
        const cutoff = (this.scene.time.now / 1000) - this.profileWindow;
        this.history = this.history.filter(h => h.time > cutoff);
        
        // Calculate metrics
        if (this.history.length > 2) {
            const recent = this.history.slice(-Math.floor(this.profileWindow));
            
            // Mobility: average velocity
            const avgVelocity = recent.reduce((sum, h) => sum + h.velocity, 0) / recent.length;
            this.playstyleProfile.mobility = Math.min(1, avgVelocity / 200);
            
            // System usage: average active systems
            const avgSystems = recent.reduce((sum, h) => sum + h.systemsActive, 0) / recent.length;
            this.playstyleProfile.systemUsage = Math.min(1, avgSystems / 8);
            
            // Wall proximity: time spent near arena edges
            const timeNearWalls = recent.filter(h => {
                const distToEdge = Math.min(
                    h.x, h.y,
                    1920 - h.x, 1440 - h.y
                );
                return distToEdge < 200;
            }).length / recent.length;
            this.playstyleProfile.wallProximity = timeNearWalls;
            
            // Aggression based on position in arena
            // Center = aggressive, edges = defensive
            const centerX = 960, centerY = 720;
            const avgDistToCenter = recent.reduce((sum, h) => {
                return sum + Math.sqrt((h.x - centerX) ** 2 + (h.y - centerY) ** 2);
            }, 0) / recent.length;
            // Normalize: max distance is ~1200 to corner
            this.playstyleProfile.aggression = Math.max(0, 1 - (avgDistToCenter / 800));
        }
    }
    
    countActiveSystems() {
        let count = 0;
        if (this.scene.nearMissState?.active) count++;
        if (this.scene.fractureSystem?.isFractured) count++;
        if (this.scene.singularitySystem?.isDeployed) count++;
        if (this.scene.paradoxEngine?.isProjecting) count++;
        if (this.scene.chronoLoop?.isRecording || (this.scene.chronoLoop?.pastEchoes?.length > 0)) count++;
        if (this.scene.quantumImmortality?.quantumEchoes?.length > 0) count++;
        if (this.scene.temporalResidue?.nodes?.length > 0) count++;
        if (this.scene.temporalRewind?.isRewinding) count++;
        return count;
    }
    
    updateChorusIntensity(dt) {
        // Intensity based on:
        // - Number of active systems
        // - Enemy density
        // - Bullet density
        // - Player health (inverse)
        
        const systemFactor = Math.min(1, this.countActiveSystems() / 6);
        const enemyCount = this.scene.enemies?.countActive() || 0;
        const enemyFactor = Math.min(1, enemyCount / 10);
        const bulletCount = this.scene.enemyBullets?.countActive() || 0;
        const bulletFactor = Math.min(1, bulletCount / 50);
        const healthFactor = 1 - ((this.scene.player?.health || 100) / 100);
        
        const targetIntensity = (systemFactor * 0.3) + 
                               (enemyFactor * 0.25) + 
                               (bulletFactor * 0.25) + 
                               (healthFactor * 0.2);
        
        // Smooth transition
        this.chorusIntensity += (targetIntensity - this.chorusIntensity) * dt * 2;
    }
    
    updateArenaBreathing(dt) {
        this.breathTimer += dt;
        
        // Breath cycle: 4 seconds in, 4 seconds out
        const breathDuration = 8;
        const phase = (this.breathTimer % breathDuration) / breathDuration;
        
        // Calculate breath factor (0 = contracted, 1 = expanded)
        let breathFactor;
        if (phase < 0.5) {
            // Inhale: contracting
            breathFactor = 1 - (phase * 2);
        } else {
            // Exhale: expanding
            breathFactor = (phase - 0.5) * 2;
        }
        
        // Modify breath based on intensity
        // High intensity = more contracted (focused chaos)
        // Low intensity = more expanded (breathing room)
        const intensityModifier = (1 - this.chorusIntensity) * 0.3;
        const effectiveBreath = breathFactor * (0.7 + intensityModifier);
        
        // Calculate target bounds
        const margin = 100 * (1 - effectiveBreath * 0.3); // 70-100px margin
        this.targetBounds = {
            x: this.baseBounds.x + margin,
            y: this.baseBounds.y + margin,
            width: this.baseBounds.width - (margin * 2),
            height: this.baseBounds.height - (margin * 2)
        };
        
        // Smoothly interpolate current bounds
        this.currentBounds.x += (this.targetBounds.x - this.currentBounds.x) * dt * 2;
        this.currentBounds.y += (this.targetBounds.y - this.currentBounds.y) * dt * 2;
        this.currentBounds.width += (this.targetBounds.width - this.currentBounds.width) * dt * 2;
        this.currentBounds.height += (this.targetBounds.height - this.currentBounds.height) * dt * 2;
    }
    
    updateAdaptiveGeometry(dt, player) {
        // Create sanctuary when health is low (compassionate)
        const healthPercent = (player.health || 100) / 100;
        if (healthPercent < 0.3 && this.sanctuaries.length < this.maxSanctuaries) {
            if (Math.random() < dt * 0.5) { // 50% chance per second when low health
                this.createSanctuary(player);
            }
        }
        
        // Create aggression lanes for high-aggression players
        if (this.playstyleProfile.aggression > 0.7 && this.lanes.length < this.maxLanes) {
            if (Math.random() < dt * 0.3) {
                this.createAggressionLane(player);
            }
        }
        
        // Create amplification chambers for system users
        if (this.playstyleProfile.systemUsage > 0.6 && this.chambers.length < this.maxChambers) {
            if (Math.random() < dt * 0.2) {
                this.createAmplificationChamber(player);
            }
        }
        
        // Spawn walls during bullet storms (protection)
        const bulletCount = this.scene.enemyBullets?.countActive() || 0;
        if (bulletCount > 30 && this.walls.length < this.maxWalls) {
            if (Math.random() < dt * 0.4) {
                this.createStrategicWall(player);
            }
        }
    }
    
    createSanctuary(player) {
        // Find safe position away from enemies and bullets
        let bestX = player.x;
        let bestY = player.y;
        let bestScore = -Infinity;
        
        // Try several positions
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 200 + Math.random() * 300;
            const testX = player.x + Math.cos(angle) * dist;
            const testY = player.y + Math.sin(angle) * dist;
            
            // Clamp to arena
            const clampedX = Phaser.Math.Clamp(testX, 200, 1720);
            const clampedY = Phaser.Math.Clamp(testY, 200, 1240);
            
            // Score based on distance from enemies and bullets
            let score = 0;
            
            this.scene.enemies?.children?.entries?.forEach(enemy => {
                if (!enemy.active) return;
                const d = Phaser.Math.Distance.Between(clampedX, clampedY, enemy.x, enemy.y);
                score += d * 0.1;
            });
            
            this.scene.enemyBullets?.children?.entries?.forEach(bullet => {
                if (!bullet.active) return;
                const d = Phaser.Math.Distance.Between(clampedX, clampedY, bullet.x, bullet.y);
                score += d * 0.05;
            });
            
            if (score > bestScore) {
                bestScore = score;
                bestX = clampedX;
                bestY = clampedY;
            }
        }
        
        const sanctuary = {
            x: bestX,
            y: bestY,
            radius: 80,
            createdAt: this.scene.time.now / 1000,
            lifetime: this.sanctuaryLifetime,
            pulsePhase: 0
        };
        
        this.sanctuaries.push(sanctuary);
        
        // Announce
        this.showSanctuaryText(bestX, bestY);
    }
    
    showSanctuaryText(x, y) {
        const text = this.scene.add.text(x, y - 60, 'SANCTUARY', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#00f0ff',
            alpha: 0.8
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 80,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    createAggressionLane(player) {
        // Create a narrow channel toward nearest enemy (risk/reward)
        let nearestEnemy = null;
        let nearestDist = Infinity;
        
        this.scene.enemies?.children?.entries?.forEach(enemy => {
            if (!enemy.active) return;
            const d = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
            if (d < nearestDist && d > 200) {
                nearestDist = d;
                nearestEnemy = enemy;
            }
        });
        
        if (!nearestEnemy) return;
        
        const angle = Phaser.Math.Angle.Between(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
        const perpAngle = angle + Math.PI / 2;
        
        // Create two parallel walls forming a lane
        const wallLength = 400;
        const laneWidth = 60;
        const midX = (player.x + nearestEnemy.x) / 2;
        const midY = (player.y + nearestEnemy.y) / 2;
        
        const wall1 = {
            x1: midX + Math.cos(perpAngle) * laneWidth,
            y1: midY + Math.sin(perpAngle) * laneWidth,
            x2: midX + Math.cos(perpAngle) * laneWidth + Math.cos(angle) * wallLength,
            y2: midY + Math.sin(perpAngle) * laneWidth + Math.sin(angle) * wallLength,
            createdAt: this.scene.time.now / 1000,
            lifetime: 10,
            type: 'lane'
        };
        
        const wall2 = {
            x1: midX - Math.cos(perpAngle) * laneWidth,
            y1: midY - Math.sin(perpAngle) * laneWidth,
            x2: midX - Math.cos(perpAngle) * laneWidth + Math.cos(angle) * wallLength,
            y2: midY - Math.sin(perpAngle) * laneWidth + Math.sin(angle) * wallLength,
            createdAt: this.scene.time.now / 1000,
            lifetime: 10,
            type: 'lane'
        };
        
        this.walls.push(wall1, wall2);
        this.lanes.push({ walls: [wall1, wall2], createdAt: this.scene.time.now / 1000 });
    }
    
    createAmplificationChamber(player) {
        // Create zone where temporal systems are enhanced
        const chamber = {
            x: player.x,
            y: player.y,
            radius: 120,
            createdAt: this.scene.time.now / 1000,
            lifetime: 15,
            rotation: 0
        };
        
        this.chambers.push(chamber);
        
        // Announce
        const text = this.scene.add.text(player.x, player.y - 80, 'AMPLIFICATION CHAMBER', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#9d4edd'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: player.y - 100,
            alpha: 0,
            duration: 2500,
            onComplete: () => text.destroy()
        });
    }
    
    createStrategicWall(player) {
        // Place wall between player and dense bullet area
        const bulletDirections = {};
        const sectorSize = Math.PI / 4; // 8 sectors
        
        this.scene.enemyBullets?.children?.entries?.forEach(bullet => {
            if (!bullet.active) return;
            const angle = Phaser.Math.Angle.Between(player.x, player.y, bullet.x, bullet.y);
            const sector = Math.floor((angle + Math.PI) / sectorSize) % 8;
            bulletDirections[sector] = (bulletDirections[sector] || 0) + 1;
        });
        
        // Find sector with most bullets
        let maxSector = 0;
        let maxCount = 0;
        for (const [sector, count] of Object.entries(bulletDirections)) {
            if (count > maxCount) {
                maxCount = count;
                maxSector = parseInt(sector);
            }
        }
        
        if (maxCount < 5) return; // Not enough bullets to warrant wall
        
        // Place wall perpendicular to threat direction
        const threatAngle = (maxSector * sectorSize) - Math.PI;
        const wallAngle = threatAngle + Math.PI / 2;
        const wallDist = 150;
        
        const wall = {
            x1: player.x + Math.cos(threatAngle) * wallDist + Math.cos(wallAngle) * 100,
            y1: player.y + Math.sin(threatAngle) * wallDist + Math.sin(wallAngle) * 100,
            x2: player.x + Math.cos(threatAngle) * wallDist - Math.cos(wallAngle) * 100,
            y2: player.y + Math.sin(threatAngle) * wallDist - Math.sin(wallAngle) * 100,
            createdAt: this.scene.time.now / 1000,
            lifetime: this.wallLifetime,
            type: 'strategic',
            health: this.wallHealth
        };
        
        this.walls.push(wall);
    }
    
    updateWalls(dt, player) {
        const now = this.scene.time.now / 1000;
        
        // Remove expired walls
        this.walls = this.walls.filter(wall => {
            const age = now - wall.createdAt;
            if (age >= wall.lifetime) {
                this.dissolveWall(wall);
                return false;
            }
            
            // Check bullet collisions
            this.scene.enemyBullets?.children?.entries?.forEach(bullet => {
                if (!bullet.active) return;
                if (this.checkBulletWallCollision(bullet, wall)) {
                    this.onBulletHitWall(bullet, wall);
                }
            });
            
            return true;
        });
        
        // Remove expired lanes
        this.lanes = this.lanes.filter(lane => {
            const age = now - lane.createdAt;
            return age < 10;
        });
    }
    
    checkBulletWallCollision(bullet, wall) {
        // Line segment vs point collision
        const dx = wall.x2 - wall.x1;
        const dy = wall.y2 - wall.y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const dot = ((bullet.x - wall.x1) * dx + (bullet.y - wall.y1) * dy) / (len * len);
        const t = Math.max(0, Math.min(1, dot));
        const closestX = wall.x1 + t * dx;
        const closestY = wall.y1 + t * dy;
        const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, closestX, closestY);
        
        return dist < 20; // Wall thickness
    }
    
    onBulletHitWall(bullet, wall) {
        // Bullet becomes wall echo - fires back after delay
        bullet.setActive(false);
        
        // Create wall echo
        const midX = (wall.x1 + wall.x2) / 2;
        const midY = (wall.y1 + wall.y2) / 2;
        
        // Visual flash
        this.createWallFlash(midX, midY);
        
        // After delay, fire back at nearest enemy
        this.scene.time.delayedCall(800, () => {
            let nearest = null;
            let nearestDist = Infinity;
            
            this.scene.enemies?.children?.entries?.forEach(enemy => {
                if (!enemy.active) return;
                const d = Phaser.Math.Distance.Between(midX, midY, enemy.x, enemy.y);
                if (d < nearestDist) {
                    nearestDist = d;
                    nearest = enemy;
                }
            });
            
            if (nearest) {
                const angle = Phaser.Math.Angle.Between(midX, midY, nearest.x, nearest.y);
                const echoBullet = this.scene.spawnEnemyBullet(midX, midY, angle, 350);
                if (echoBullet) {
                    echoBullet.setTint(0x4b0082); // Indigo echo
                    echoBullet.isWallEcho = true;
                    echoBullet.damage = 50;
                }
            }
        });
        
        // Damage wall
        wall.health -= 10;
        if (wall.health <= 0) {
            this.dissolveWall(wall);
        }
    }
    
    createWallFlash(x, y) {
        const flash = this.scene.add.circle(x, y, 30, this.INDIGO_GLOW, 0.8);
        
        this.scene.tweens.add({
            targets: flash,
            scale: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => flash.destroy()
        });
    }
    
    dissolveWall(wall) {
        // Visual dissolution
        const midX = (wall.x1 + wall.x2) / 2;
        const midY = (wall.y1 + wall.y2) / 2;
        
        // Particle effect
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 40;
            const px = midX + Math.cos(angle) * dist;
            const py = midY + Math.sin(angle) * dist;
            
            const particle = this.scene.add.circle(px, py, 3, this.INDIGO_COLOR, 0.8);
            
            this.scene.tweens.add({
                targets: particle,
                x: px + Math.cos(angle) * 50,
                y: py + Math.sin(angle) * 50,
                alpha: 0,
                duration: 600,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    updateSanctuaries(dt, player) {
        const now = this.scene.time.now / 1000;
        
        this.sanctuaries = this.sanctuaries.filter(sanctuary => {
            const age = now - sanctuary.createdAt;
            
            if (age >= sanctuary.lifetime) {
                this.dissolveSanctuary(sanctuary);
                return false;
            }
            
            // Check if player is inside
            const dist = Phaser.Math.Distance.Between(player.x, player.y, sanctuary.x, sanctuary.y);
            if (dist < sanctuary.radius) {
                // Player in sanctuary gets healing
                if (player.health < 100 && Math.random() < dt) {
                    player.health = Math.min(100, player.health + 2);
                }
                
                // Bullets don't hurt in sanctuary
                this.scene.enemyBullets?.children?.entries?.forEach(bullet => {
                    if (!bullet.active) return;
                    const bd = Phaser.Math.Distance.Between(bullet.x, bullet.y, sanctuary.x, sanctuary.y);
                    if (bd < sanctuary.radius) {
                        bullet.setActive(false);
                    }
                });
            }
            
            // Pulse animation
            sanctuary.pulsePhase += dt * 2;
            
            return true;
        });
    }
    
    dissolveSanctuary(sanctuary) {
        // Ripple effect
        const ripple = this.scene.add.circle(sanctuary.x, sanctuary.y, sanctuary.radius, this.CYAN_EDGE, 0.3);
        
        this.scene.tweens.add({
            targets: ripple,
            scale: 2,
            alpha: 0,
            duration: 800,
            onComplete: () => ripple.destroy()
        });
    }
    
    updateLanes(dt, player) {
        // Lanes are managed through walls, just update visual pulse
    }
    
    updateChambers(dt, player) {
        const now = this.scene.time.now / 1000;
        
        this.chambers = this.chambers.filter(chamber => {
            const age = now - chamber.createdAt;
            
            if (age >= chamber.lifetime) {
                this.dissolveChamber(chamber);
                return false;
            }
            
            // Rotate chamber
            chamber.rotation += dt * 0.5;
            
            // Check if player is inside
            const dist = Phaser.Math.Distance.Between(player.x, player.y, chamber.x, chamber.y);
            if (dist < chamber.radius) {
                // Amplify all temporal systems
                if (this.scene.temporalResidue) {
                    this.scene.temporalResidue.nodeFireRateMultiplier = 1.5;
                }
                if (this.scene.echoStorm) {
                    this.scene.echoStorm.echoAbsorptionRadius = 100; // Larger radius
                }
            }
            
            return true;
        });
    }
    
    dissolveChamber(chamber) {
        // Fade out with geometric pattern
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, this.INDIGO_COLOR, 0.5);
        graphics.strokeCircle(chamber.x, chamber.y, chamber.radius);
        
        this.scene.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 500,
            onComplete: () => graphics.destroy()
        });
    }
    
    updateZenithState(dt, player) {
        // Trigger zenith at high chorus intensity or Wave 10
        const wave = this.scene.wave || 1;
        const shouldZenith = (this.chorusIntensity > 0.9 && !this.isZenith) || 
                            (wave >= 10 && !this.isZenith && Math.random() < dt * 0.1);
        
        if (shouldZenith) {
            this.enterZenith();
        }
        
        if (this.isZenith) {
            this.zenithTimer -= dt;
            
            // Rapid wall shifts during zenith
            if (Math.random() < dt * 2) {
                this.createStrategicWall(player);
            }
            
            if (this.zenithTimer <= 0) {
                this.exitZenith();
            }
        }
    }
    
    enterZenith() {
        this.isZenith = true;
        this.zenithTimer = 10; // 10 seconds of zenith
        
        // Announce
        const text = this.scene.add.text(960, 600, 'GEOMETRIC CHORUS — ZENITH', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fill: '#4b0082',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            scale: 1.5,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Screen flash
        this.scene.cameras.main.flash(1000, 75, 0, 130, 0.3); // Indigo flash
        
        // Clear existing geometry, start fresh
        this.walls.forEach(w => this.dissolveWall(w));
        this.walls = [];
        
        // Create initial maze pattern
        this.createMazePattern();
    }
    
    createMazePattern() {
        // Create rotating maze walls
        const centerX = 960;
        const centerY = 720;
        
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const wall = {
                x1: centerX + Math.cos(angle) * 300,
                y1: centerY + Math.sin(angle) * 300,
                x2: centerX + Math.cos(angle + 0.5) * 500,
                y2: centerY + Math.sin(angle + 0.5) * 500,
                createdAt: this.scene.time.now / 1000,
                lifetime: 10,
                type: 'maze',
                rotation: angle
            };
            this.walls.push(wall);
        }
    }
    
    exitZenith() {
        this.isZenith = false;
        
        // Gradually return to normal
        this.walls.forEach(w => this.dissolveWall(w));
        this.walls = [];
        
        // Text
        const text = this.scene.add.text(960, 600, 'CHORUS SUBSIDES', {
            fontFamily: 'monospace',
            fontSize: '18px',
            fill: '#00f0ff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }
    
    render() {
        if (this.useUnifiedRenderer) {
            // Unified: register commands with graphics manager
            // UnifiedGraphicsManager handles clear() once per frame per layer
            this.renderArenaBoundariesUnified();
            this.renderWallsUnified();
            this.renderSanctuariesUnified();
            this.renderChambersUnified();
        } else {
            // Legacy: clear all graphics and render directly
            // Note: These 4 clear() calls are eliminated when using UnifiedGraphicsManager
            this.wallGraphics.clear();
            this.arenaGraphics.clear();
            this.glowGraphics.clear();
            
            // Render arena boundaries
            this.renderArenaBoundaries();
            
            // Render walls
            this.renderWalls();
            
            // Render sanctuaries
            this.renderSanctuaries();
            
            // Render chambers
            this.renderChambers();
        }
    }
    
    renderArenaBoundaries() {
        const bounds = this.currentBounds;
        
        // Glow effect
        this.glowGraphics.lineStyle(8, this.INDIGO_GLOW, this.WALL_GLOW_ALPHA);
        this.glowGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        
        // Main boundary
        const pulse = 1 + Math.sin(this.scene.time.now / 1000) * 0.1;
        this.arenaGraphics.lineStyle(3 * pulse, this.CYAN_EDGE, 0.8);
        this.arenaGraphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        
        // Corner markers
        const cornerSize = 30;
        this.arenaGraphics.fillStyle(this.CYAN_EDGE, 0.6);
        
        // Top-left
        this.arenaGraphics.fillRect(bounds.x - 2, bounds.y - 2, cornerSize, 3);
        this.arenaGraphics.fillRect(bounds.x - 2, bounds.y - 2, 3, cornerSize);
        
        // Top-right
        this.arenaGraphics.fillRect(bounds.x + bounds.width - cornerSize, bounds.y - 2, cornerSize, 3);
        this.arenaGraphics.fillRect(bounds.x + bounds.width - 2, bounds.y - 2, 3, cornerSize);
        
        // Bottom-left
        this.arenaGraphics.fillRect(bounds.x - 2, bounds.y + bounds.height - 3, cornerSize, 3);
        this.arenaGraphics.fillRect(bounds.x - 2, bounds.y + bounds.height - cornerSize, 3, cornerSize);
        
        // Bottom-right
        this.arenaGraphics.fillRect(bounds.x + bounds.width - cornerSize, bounds.y + bounds.height - 3, cornerSize, 3);
        this.arenaGraphics.fillRect(bounds.x + bounds.width - 2, bounds.y + bounds.height - cornerSize, 3, cornerSize);
    }
    
    renderWalls() {
        this.walls.forEach(wall => {
            const age = (this.scene.time.now / 1000) - wall.createdAt;
            const remaining = wall.lifetime - age;
            const alpha = Math.min(1, remaining / 2); // Fade in first 2 seconds
            const fadeOut = remaining < 2 ? remaining / 2 : 1;
            
            // Wall glow
            this.glowGraphics.lineStyle(12, this.INDIGO_GLOW, 0.2 * fadeOut);
            this.glowGraphics.lineBetween(wall.x1, wall.y1, wall.x2, wall.y2);
            
            // Wall body
            this.wallGraphics.lineStyle(4, this.INDIGO_COLOR, this.WALL_ALPHA * alpha * fadeOut);
            this.wallGraphics.lineBetween(wall.x1, wall.y1, wall.x2, wall.y2);
            
            // Wall pulse
            const pulse = 1 + Math.sin(this.scene.time.now / 500) * 0.2;
            this.wallGraphics.lineStyle(2, this.CYAN_EDGE, 0.6 * alpha * fadeOut);
            this.wallGraphics.lineBetween(
                wall.x1 + (wall.x2 - wall.x1) * (1 - pulse) * 0.5,
                wall.y1 + (wall.y2 - wall.y1) * (1 - pulse) * 0.5,
                wall.x2 - (wall.x2 - wall.x1) * (1 - pulse) * 0.5,
                wall.y2 - (wall.y2 - wall.y1) * (1 - pulse) * 0.5
            );
        });
    }
    
    renderSanctuaries() {
        this.sanctuaries.forEach(sanctuary => {
            const pulse = 1 + Math.sin(sanctuary.pulsePhase) * 0.1;
            
            // Outer glow
            this.glowGraphics.fillStyle(this.CYAN_EDGE, 0.1);
            this.glowGraphics.fillCircle(sanctuary.x, sanctuary.y, sanctuary.radius * pulse);
            
            // Main circle
            this.wallGraphics.lineStyle(2, this.CYAN_EDGE, 0.6);
            this.wallGraphics.strokeCircle(sanctuary.x, sanctuary.y, sanctuary.radius * pulse);
            
            // Inner calm zone
            this.wallGraphics.fillStyle(this.CYAN_EDGE, 0.05);
            this.wallGraphics.fillCircle(sanctuary.x, sanctuary.y, sanctuary.radius * 0.7);
            
            // Label
            // (Text is expensive, only render if close to player)
        });
    }
    
    renderChambers() {
        this.chambers.forEach(chamber => {
            const rotation = chamber.rotation;
            
            // Rotating hexagon
            this.wallGraphics.lineStyle(3, this.INDIGO_COLOR, 0.5);
            this.wallGraphics.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = rotation + (i * Math.PI) / 3;
                const x = chamber.x + Math.cos(angle) * chamber.radius;
                const y = chamber.y + Math.sin(angle) * chamber.radius;
                if (i === 0) this.wallGraphics.moveTo(x, y);
                else this.wallGraphics.lineTo(x, y);
            }
            this.wallGraphics.closePath();
            this.wallGraphics.strokePath();
            
            // Inner rotating square
            this.wallGraphics.lineStyle(2, this.CYAN_EDGE, 0.4);
            this.wallGraphics.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = -rotation + (i * Math.PI) / 2;
                const x = chamber.x + Math.cos(angle) * chamber.radius * 0.5;
                const y = chamber.y + Math.sin(angle) * chamber.radius * 0.5;
                if (i === 0) this.wallGraphics.moveTo(x, y);
                else this.wallGraphics.lineTo(x, y);
            }
            this.wallGraphics.closePath();
            this.wallGraphics.strokePath();
            
            // Center glow
            this.glowGraphics.fillStyle(this.INDIGO_GLOW, 0.2);
            this.glowGraphics.fillCircle(chamber.x, chamber.y, 20);
        });
    }
    
    // Unified Rendering Methods (UnifiedGraphicsManager)
    
    renderArenaBoundariesUnified() {
        const bounds = this.currentBounds;
        const manager = this.scene.graphicsManager;
        
        // Glow effect - use line commands
        manager.addCommand('effects', 'rect', {
            x: bounds.x - 4, y: bounds.y - 4,
            width: bounds.width + 8, height: bounds.height + 8,
            color: this.INDIGO_GLOW, alpha: this.WALL_GLOW_ALPHA, filled: false, lineWidth: 8
        });
        
        // Main boundary
        const pulse = 1 + Math.sin(this.scene.time.now / 1000) * 0.1;
        manager.addCommand('effects', 'rect', {
            x: bounds.x, y: bounds.y,
            width: bounds.width, height: bounds.height,
            color: this.CYAN_EDGE, alpha: 0.8, filled: false, lineWidth: 3 * pulse
        });
        
        // Corner markers
        const cornerSize = 30;
        const corners = [
            { x: bounds.x - 2, y: bounds.y - 2 }, // Top-left
            { x: bounds.x + bounds.width - cornerSize, y: bounds.y - 2 }, // Top-right
            { x: bounds.x - 2, y: bounds.y + bounds.height - 3 }, // Bottom-left
            { x: bounds.x + bounds.width - cornerSize, y: bounds.y + bounds.height - 3 } // Bottom-right
        ];
        
        corners.forEach(corner => {
            // Horizontal line
            manager.drawRect('effects', corner.x, corner.y, cornerSize, 3, this.CYAN_EDGE, 0.6);
            // Vertical line
            manager.drawRect('effects', corner.x, corner.y, 3, cornerSize, this.CYAN_EDGE, 0.6);
        });
    }
    
    renderWallsUnified() {
        const manager = this.scene.graphicsManager;
        
        this.walls.forEach(wall => {
            const age = (this.scene.time.now / 1000) - wall.createdAt;
            const remaining = wall.lifetime - age;
            const alpha = Math.min(1, remaining / 2);
            const fadeOut = remaining < 2 ? remaining / 2 : 1;
            
            // Wall glow
            manager.drawLine('effects', wall.x1, wall.y1, wall.x2, wall.y2, this.INDIGO_GLOW, 0.2 * fadeOut, 12);
            
            // Wall body
            manager.drawLine('effects', wall.x1, wall.y1, wall.x2, wall.y2, this.INDIGO_COLOR, this.WALL_ALPHA * alpha * fadeOut, 4);
            
            // Wall pulse
            const pulse = 1 + Math.sin(this.scene.time.now / 500) * 0.2;
            const midX = (wall.x1 + wall.x2) / 2;
            const midY = (wall.y1 + wall.y2) / 2;
            const dx = (wall.x2 - wall.x1) * 0.5 * pulse;
            const dy = (wall.y2 - wall.y1) * 0.5 * pulse;
            
            manager.drawLine('effects', midX - dx, midY - dy, midX + dx, midY + dy, this.CYAN_EDGE, 0.6 * alpha * fadeOut, 2);
        });
    }
    
    renderSanctuariesUnified() {
        const manager = this.scene.graphicsManager;
        
        this.sanctuaries.forEach(sanctuary => {
            const pulse = 1 + Math.sin(sanctuary.pulsePhase) * 0.1;
            
            // Outer glow
            manager.drawCircle('effects', sanctuary.x, sanctuary.y, sanctuary.radius * pulse, this.CYAN_EDGE, 0.1);
            
            // Main circle (stroke)
            manager.addCommand('effects', 'circle', {
                x: sanctuary.x, y: sanctuary.y,
                radius: sanctuary.radius * pulse,
                color: this.CYAN_EDGE, alpha: 0.6, filled: false, lineWidth: 2
            });
            
            // Inner calm zone
            manager.drawCircle('effects', sanctuary.x, sanctuary.y, sanctuary.radius * 0.7, this.CYAN_EDGE, 0.05);
        });
    }
    
    renderChambersUnified() {
        const manager = this.scene.graphicsManager;
        
        this.chambers.forEach(chamber => {
            const rotation = chamber.rotation;
            
            // Build hexagon points
            const hexPoints = [];
            for (let i = 0; i < 6; i++) {
                const angle = rotation + (i * Math.PI) / 3;
                hexPoints.push({
                    x: chamber.x + Math.cos(angle) * chamber.radius,
                    y: chamber.y + Math.sin(angle) * chamber.radius
                });
            }
            
            // Rotating hexagon
            manager.addCommand('effects', 'path', {
                points: hexPoints, color: this.INDIGO_COLOR, alpha: 0.5, lineWidth: 3
            });
            
            // Build inner square points
            const squarePoints = [];
            for (let i = 0; i < 4; i++) {
                const angle = -rotation + (i * Math.PI) / 2;
                squarePoints.push({
                    x: chamber.x + Math.cos(angle) * chamber.radius * 0.5,
                    y: chamber.y + Math.sin(angle) * chamber.radius * 0.5
                });
            }
            
            // Inner rotating square
            manager.addCommand('effects', 'path', {
                points: squarePoints, color: this.CYAN_EDGE, alpha: 0.4, lineWidth: 2
            });
            
            // Center glow
            manager.drawCircle('effects', chamber.x, chamber.y, 20, this.INDIGO_GLOW, 0.2);
        });
    }
    
    // Public API for other systems
    
    getArenaBounds() {
        return this.currentBounds;
    }
    
    isPointInArena(x, y) {
        const b = this.currentBounds;
        return x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
    }
    
    getNearestWall(x, y) {
        let nearest = null;
        let nearestDist = Infinity;
        
        this.walls.forEach(wall => {
            const midX = (wall.x1 + wall.x2) / 2;
            const midY = (wall.y1 + wall.y2) / 2;
            const d = Phaser.Math.Distance.Between(x, y, midX, midY);
            if (d < nearestDist) {
                nearestDist = d;
                nearest = wall;
            }
        });
        
        return nearest;
    }
    
    isPlayerInSanctuary(player) {
        for (const sanctuary of this.sanctuaries) {
            const d = Phaser.Math.Distance.Between(player.x, player.y, sanctuary.x, sanctuary.y);
            if (d < sanctuary.radius) return true;
        }
        return false;
    }
    
    isPlayerInChamber(player) {
        for (const chamber of this.chambers) {
            const d = Phaser.Math.Distance.Between(player.x, player.y, chamber.x, chamber.y);
            if (d < chamber.radius) return true;
        }
        return false;
    }
    
    onNearMiss() {
        // Sanctuary might appear on near-miss streak during low health
        if (this.scene.player?.health < 50 && Math.random() < 0.1) {
            this.createSanctuary(this.scene.player);
        }
    }
    
    destroy() {
        this.active = false;
        if (!this.useUnifiedRenderer) {
            this.wallGraphics?.destroy();
            this.arenaGraphics?.destroy();
            this.glowGraphics?.destroy();
            this.gridGraphics?.destroy();
        }
        // Note: UnifiedGraphicsManager handles cleanup of its own graphics objects
    }
}
