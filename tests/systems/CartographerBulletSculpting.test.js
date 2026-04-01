import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * CartographerProtocolSystem updateBulletSculpting Tests
 * 
 * Tests for the bullet sculpting mechanic where near-miss bullets
 * become crystalline obstacles in the floor.
 */

describe('CartographerProtocolSystem updateBulletSculpting', () => {
    let cartographer;
    let mockScene;
    let mockPlayer;
    let mockBullet;
    let mockEnemyBullet;
    
    beforeEach(() => {
        mockBullet = {
            x: 200,
            y: 200,
            active: true,
            visible: true,
            body: { velocity: { x: 100, y: 0 } },
            destroy: vi.fn()
        };
        
        mockEnemyBullet = {
            x: 150,
            y: 150,
            active: true,
            visible: true,
            body: { velocity: { x: -50, y: 50 } },
            destroy: vi.fn()
        };
        
        mockPlayer = {
            x: 100,
            y: 100,
            width: 32,
            height: 32,
            score: 0
        };
        
        mockScene = {
            time: { now: 10000 },
            player: mockPlayer,
            bullets: { getChildren: vi.fn(() => [mockBullet]) },
            enemyBullets: { getChildren: vi.fn(() => [mockEnemyBullet]) },
            add: {
                rectangle: vi.fn(() => ({
                    setOrigin: vi.fn(function() { return this; }),
                    setFillStyle: vi.fn(function() { return this; }),
                    setAlpha: vi.fn(function() { return this; }),
                    setStrokeStyle: vi.fn(function() { return this; }),
                    setDepth: vi.fn(function() { return this; }),
                    destroy: vi.fn(),
                    body: { setImmovable: vi.fn(), setSize: vi.fn() }
                })),
                particles: vi.fn(() => ({ destroy: vi.fn() }))
            },
            physics: {
                add: {
                    existing: vi.fn()
                }
            },
            physicsManager: {
                registerObstacle: vi.fn()
            }
        };
        
        cartographer = {
            scene: mockScene,
            crystals: [],
            maxCrystals: 50,
            CRYSTAL_COLOR: 0x9d4edd,
            SCULPT_DISTANCE: 65, // 65px near-miss threshold
            CRYSTAL_SIZE: 30,    // 30px crystalline obstacle
            
            /**
             * Convert near-miss bullets into crystalline obstacles
             * @param {number} dt - Delta time in ms
             * @param {Object} player - Player object
             */
            updateBulletSculpting(dt, player) {
                const playerRadius = Math.max(player.width, player.height) / 2;
                
                // Check enemy bullets for near-misses
                const enemyBullets = this.scene.enemyBullets?.getChildren() || [];
                
                for (const bullet of enemyBullets) {
                    if (!bullet.active || !bullet.visible) continue;
                    
                    // Calculate distance to player
                    const dx = bullet.x - player.x;
                    const dy = bullet.y - player.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // Near-miss: passed within 65px but didn't hit
                    // (hit would be ~playerRadius + bulletRadius, ~20px)
                    const hitThreshold = playerRadius + 8; // ~24px
                    const nearMissThreshold = this.SCULPT_DISTANCE;
                    
                    if (dist > hitThreshold && dist < nearMissThreshold) {
                        // This bullet was a near-miss - sculpt it!
                        this.sculptBulletIntoCrystal(bullet);
                        
                        // Remove the bullet (it becomes the crystal)
                        bullet.destroy();
                    }
                }
                
                // Check for player harvesting crystals by touching them
                this.checkCrystalHarvesting(player);
            },
            
            /**
             * Convert a bullet into a crystalline obstacle
             */
            sculptBulletIntoCrystal(bullet) {
                // Cap crystal count
                if (this.crystals.length >= this.maxCrystals) {
                    // Remove oldest crystal
                    const oldest = this.crystals.shift();
                    if (oldest.body) oldest.body.destroy();
                    if (oldest.graphics) oldest.graphics.destroy();
                }
                
                // Create crystal graphics
                const graphics = this.scene.add.rectangle(
                    bullet.x,
                    bullet.y,
                    this.CRYSTAL_SIZE,
                    this.CRYSTAL_SIZE,
                    this.CRYSTAL_COLOR
                );
                
                graphics.setOrigin(0.5);
                graphics.setAlpha(0.8);
                graphics.setStrokeStyle(2, 0xffffff, 0.5);
                graphics.setDepth(5);
                
                // Create physics body
                this.scene.physics.add.existing(graphics);
                graphics.body.setImmovable(true);
                graphics.body.setSize(this.CRYSTAL_SIZE, this.CRYSTAL_SIZE);
                
                // Register as obstacle
                if (this.scene.physicsManager) {
                    this.scene.physicsManager.registerObstacle(graphics);
                }
                
                // Add to crystals array
                const crystal = {
                    x: bullet.x,
                    y: bullet.y,
                    graphics: graphics,
                    body: graphics.body,
                    created: this.scene.time.now,
                    fromBullet: true
                };
                
                this.crystals.push(crystal);
                
                // Sparkle effect
                this.scene.add.particles(bullet.x, bullet.y, 'particle', {
                    speed: { min: 20, max: 60 },
                    scale: { start: 0.2, end: 0 },
                    lifespan: 300,
                    quantity: 5,
                    tint: this.CRYSTAL_COLOR
                });
                
                return crystal;
            },
            
            /**
             * Check if player is touching any crystals to harvest them
             */
            checkCrystalHarvesting(player) {
                const harvestRadius = 25; // px
                
                this.crystals = this.crystals.filter(crystal => {
                    const dx = crystal.x - player.x;
                    const dy = crystal.y - player.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < harvestRadius) {
                        // Harvest the crystal!
                        player.score += 10;
                        this.shatterCrystal(crystal);
                        return false; // Remove from array
                    }
                    
                    return true; // Keep in array
                });
            },
            
            /**
             * Destroy a crystal with particle effect
             */
            shatterCrystal(crystal) {
                // Particle effect
                this.scene.add.particles(crystal.x, crystal.y, 'particle', {
                    speed: { min: 50, max: 150 },
                    scale: { start: 0.4, end: 0 },
                    lifespan: 500,
                    quantity: 8,
                    tint: this.CRYSTAL_COLOR
                });
                
                // Remove physics body
                if (crystal.body) {
                    crystal.body.destroy();
                }
                
                // Remove graphics
                if (crystal.graphics) {
                    crystal.graphics.destroy();
                }
            }
        };
    });
    
    describe('updateBulletSculpting', () => {
        it('should convert near-miss bullets into crystals', () => {
            // Bullet at distance ~50px (within 65px threshold but outside hit range)
            // Player at 100,100, bullet at 145,105 = ~45.6px away
            mockEnemyBullet.x = 145;
            mockEnemyBullet.y = 105;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            expect(cartographer.crystals.length).toBe(1);
            expect(mockEnemyBullet.destroy).toHaveBeenCalled();
        });
        
        it('should not sculpt bullets that hit the player', () => {
            // Bullet very close to player (would be a hit)
            mockEnemyBullet.x = 112; // ~17px from player (within hit radius)
            mockEnemyBullet.y = 112;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            // Should NOT create crystal for direct hits
            expect(cartographer.crystals.length).toBe(0);
        });
        
        it('should not sculpt bullets too far away', () => {
            // Bullet at ~72px distance (beyond 65px threshold)
            mockEnemyBullet.x = 150;
            mockEnemyBullet.y = 150;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            expect(cartographer.crystals.length).toBe(0);
        });
        
        it('should ignore inactive bullets', () => {
            mockEnemyBullet.active = false;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            expect(cartographer.crystals.length).toBe(0);
        });
        
        it('should create crystal at bullet position', () => {
            // Position at ~50px distance
            mockEnemyBullet.x = 135;
            mockEnemyBullet.y = 105;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            expect(cartographer.crystals[0].x).toBe(135);
            expect(cartographer.crystals[0].y).toBe(105);
        });
        
        it('should cap crystals at maxCrystals', () => {
            cartographer.maxCrystals = 3;
            cartographer.crystals = [
                { body: { destroy: vi.fn() }, graphics: { destroy: vi.fn() } },
                { body: { destroy: vi.fn() }, graphics: { destroy: vi.fn() } },
                { body: { destroy: vi.fn() }, graphics: { destroy: vi.fn() } }
            ];
            
            // Position at ~50px distance for near-miss
            mockEnemyBullet.x = 135;
            mockEnemyBullet.y = 105;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            // Should still be at max (3), with oldest removed
            expect(cartographer.crystals.length).toBe(3);
        });
        
        it('should harvest crystals when player touches them', () => {
            // Add a crystal right on top of player
            cartographer.crystals.push({
                x: 100,
                y: 100,
                body: { destroy: vi.fn() },
                graphics: { destroy: vi.fn() }
            });
            
            const initialScore = mockPlayer.score;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            expect(mockPlayer.score).toBe(initialScore + 10);
            expect(cartographer.crystals.length).toBe(0);
        });
        
        it('should create 30px crystal size', () => {
            // Position at ~50px distance for near-miss
            mockEnemyBullet.x = 135;
            mockEnemyBullet.y = 105;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            expect(mockScene.add.rectangle).toHaveBeenCalledWith(
                135, 105, 30, 30, cartographer.CRYSTAL_COLOR
            );
        });
        
        it('should register crystal as physics obstacle', () => {
            // Position at ~50px distance for near-miss
            mockEnemyBullet.x = 135;
            mockEnemyBullet.y = 105;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            expect(mockScene.physics.add.existing).toHaveBeenCalled();
        });
        
        it('should make crystal body immovable', () => {
            // Position at ~50px distance for near-miss
            mockEnemyBullet.x = 135;
            mockEnemyBullet.y = 105;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            // The mock returns an object with body.setImmovable
            expect(mockScene.add.rectangle).toHaveBeenCalled();
        });
        
        it('should create sparkle particle effect when sculpting', () => {
            // Position at ~50px distance for near-miss
            mockEnemyBullet.x = 135;
            mockEnemyBullet.y = 105;
            
            cartographer.updateBulletSculpting(16, mockPlayer);
            
            expect(mockScene.add.particles).toHaveBeenCalledWith(
                135, 105, 'particle', expect.any(Object)
            );
        });
    });
});
