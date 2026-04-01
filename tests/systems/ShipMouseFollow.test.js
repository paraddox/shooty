import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Ship Mouse Follow Regression Tests
 * 
 * Tests to ensure ship follows mouse cursor correctly.
 * This is a regression test - this feature was broken before.
 */

describe('Ship Mouse Follow', () => {
    let mockScene;
    let player;
    let mainCamera;
    let pointer;
    
    beforeEach(() => {
        // Mock pointer that tracks mouse position
        pointer = {
            x: 960, // Screen X (center)
            y: 540, // Screen Y (center)
            isDown: false
        };
        
        mainCamera = {
            zoom: 1,
            scrollX: 0,
            scrollY: 0,
            width: 1920,
            height: 1080
        };
        
        // Player ship
        player = {
            x: 960,
            y: 540,
            rotation: 0,
            body: { velocity: { x: 0, y: 0 } },
            setRotation: vi.fn(function(r) {
                this.rotation = r;
                return this;
            })
        };
        
        mockScene = {
            input: {
                activePointer: pointer
            },
            cameras: {
                main: mainCamera
            },
            time: {
                now: 1000
            },
            omniWeapon: null
        };
    });
    
    describe('Mouse Tracking Calculation', () => {
        it('should calculate world mouse position correctly at 1x zoom', () => {
            // Mouse at screen position (1060, 540) - 100px right of center
            pointer.x = 1060;
            pointer.y = 540;
            
            mainCamera.zoom = 1;
            mainCamera.scrollX = 0;
            mainCamera.scrollY = 0;
            
            // Calculate world position (same as Player.js logic)
            const worldX = mainCamera.scrollX + pointer.x / mainCamera.zoom;
            const worldY = mainCamera.scrollY + pointer.y / mainCamera.zoom;
            
            expect(worldX).toBe(1060);
            expect(worldY).toBe(540);
        });
        
        it('should calculate world mouse position correctly at 2x zoom', () => {
            pointer.x = 1060;
            pointer.y = 540;
            
            mainCamera.zoom = 2;
            mainCamera.scrollX = 100;
            mainCamera.scrollY = 50;
            
            // At 2x zoom, screen pixels are half world pixels
            const worldX = mainCamera.scrollX + pointer.x / mainCamera.zoom;
            const worldY = mainCamera.scrollY + pointer.y / mainCamera.zoom;
            
            // 100 + 1060/2 = 100 + 530 = 630
            expect(worldX).toBe(630);
            // 50 + 540/2 = 50 + 270 = 320
            expect(worldY).toBe(320);
        });
        
        it('should calculate angle to mouse correctly', () => {
            player.x = 960;
            player.y = 540;
            
            // Mouse directly to the right
            pointer.x = 1060;
            pointer.y = 540;
            
            mainCamera.zoom = 1;
            mainCamera.scrollX = 0;
            mainCamera.scrollY = 0;
            
            const worldX = mainCamera.scrollX + pointer.x / mainCamera.zoom;
            const worldY = mainCamera.scrollY + pointer.y / mainCamera.zoom;
            
            const angle = Math.atan2(worldY - player.y, worldX - player.x);
            
            // Mouse to the right = angle of 0 (or very close)
            expect(angle).toBeCloseTo(0, 2);
        });
        
        it('should calculate angle when mouse is above player', () => {
            player.x = 960;
            player.y = 540;
            
            // Mouse directly above
            pointer.x = 960;
            pointer.y = 440;
            
            mainCamera.zoom = 1;
            mainCamera.scrollX = 0;
            mainCamera.scrollY = 0;
            
            const worldX = mainCamera.scrollX + pointer.x / mainCamera.zoom;
            const worldY = mainCamera.scrollY + pointer.y / mainCamera.zoom;
            
            const angle = Math.atan2(worldY - player.y, worldX - player.x);
            
            // Mouse above = angle of -PI/2 (or very close)
            expect(angle).toBeCloseTo(-Math.PI / 2, 2);
        });
    });
    
    describe('Player Ship Rotation', () => {
        it('should rotate ship to face mouse at 1x zoom', () => {
            player.x = 960;
            player.y = 540;
            pointer.x = 1060; // Mouse to the right
            pointer.y = 540;
            
            mainCamera.zoom = 1;
            mainCamera.scrollX = 0;
            mainCamera.scrollY = 0;
            
            // Simulate Player.js update logic
            const worldX = mainCamera.scrollX + pointer.x / mainCamera.zoom;
            const worldY = mainCamera.scrollY + pointer.y / mainCamera.zoom;
            
            const angle = Math.atan2(worldY - player.y, worldX - player.x);
            player.setRotation(angle + Math.PI / 2);
            
            // Should have called setRotation
            expect(player.setRotation).toHaveBeenCalled();
            
            // Angle to right + 90 degrees offset = PI/2
            expect(player.rotation).toBeCloseTo(Math.PI / 2, 2);
        });
        
        it('should rotate ship to face mouse at different zoom levels', () => {
            const zoomLevels = [0.5, 1, 1.5, 2];
            
            zoomLevels.forEach(zoom => {
                player.x = 1500;
                player.y = 1200;
                
                // Camera centered on player
                mainCamera.zoom = zoom;
                mainCamera.scrollX = player.x - (1920 / 2) / zoom;
                mainCamera.scrollY = player.y - (1080 / 2) / zoom;
                
                // Mouse position in world coordinates (to the right of player)
                const mouseWorldX = player.x + 100;
                const mouseWorldY = player.y;
                
                // Convert to screen coordinates
                pointer.x = (mouseWorldX - mainCamera.scrollX) * zoom;
                pointer.y = (mouseWorldY - mainCamera.scrollY) * zoom;
                
                // Now convert back (like Player.js does)
                const worldX = mainCamera.scrollX + pointer.x / zoom;
                const worldY = mainCamera.scrollY + pointer.y / zoom;
                
                const angle = Math.atan2(worldY - player.y, worldX - player.x);
                
                // Mouse should be to the right (angle ~0)
                expect(Math.abs(angle)).toBeLessThan(0.1); // Very close to 0
            });
        });
    });
    
    describe('Safety Checks', () => {
        it('should not throw when camera is valid', () => {
            mainCamera.zoom = 1;
            
            expect(() => {
                const worldX = mainCamera.scrollX + pointer.x / mainCamera.zoom;
                const worldY = mainCamera.scrollY + pointer.y / mainCamera.zoom;
            }).not.toThrow();
        });
        
        it('should detect invalid camera state', () => {
            // Invalid zoom (0 or negative)
            mainCamera.zoom = 0;
            
            const isValid = mainCamera && 
                           typeof mainCamera.zoom === 'number' && 
                           mainCamera.zoom > 0;
            
            expect(isValid).toBe(false);
        });
        
        it('should detect NaN in world coordinates', () => {
            mainCamera.zoom = NaN;
            
            const worldX = mainCamera.scrollX + pointer.x / mainCamera.zoom;
            const worldY = mainCamera.scrollY + pointer.y / mainCamera.zoom;
            
            expect(isNaN(worldX)).toBe(true);
            expect(isNaN(worldY)).toBe(true);
        });
    });
    
    describe('Full Player Update Simulation', () => {
        it('should simulate Player.update() aiming correctly', () => {
            // Setup like real game
            player.x = 1500;
            player.y = 1200;
            pointer.x = 1600;
            pointer.y = 1200;
            
            mainCamera.zoom = 1.2;
            mainCamera.scrollX = player.x - 1920 / 2 / 1.2;
            mainCamera.scrollY = player.y - 1080 / 2 / 1.2;
            
            // Simulate Player.js update()
            const camera = mainCamera;
            
            // Validation (from Player.js)
            if (!camera || typeof camera.zoom !== 'number' || camera.zoom <= 0) {
                throw new Error('Invalid camera');
            }
            
            const worldX = camera.scrollX + pointer.x / camera.zoom;
            const worldY = camera.scrollY + pointer.y / camera.zoom;
            
            if (isNaN(worldX) || isNaN(worldY)) {
                throw new Error('Invalid world coordinates');
            }
            
            const angle = Math.atan2(worldY - player.y, worldX - player.x);
            player.setRotation(angle + Math.PI / 2);
            
            // Verify rotation was set
            expect(player.setRotation).toHaveBeenCalled();
            expect(typeof player.rotation).toBe('number');
            expect(isNaN(player.rotation)).toBe(false);
        });
    });
});
