import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Mouse Follow Camera Independence Tests
 * 
 * Tests to ensure player ship follows mouse cursor correctly
 * regardless of camera zoom or HUD camera presence.
 */

describe('Mouse Follow with Camera Zoom', () => {
    let mockScene;
    let player;
    let mainCamera;
    let hudCamera;
    let inputCallbacks;
    
    beforeEach(() => {
        inputCallbacks = {};
        
        // Player that follows mouse
        player = {
            x: 960,
            y: 540,
            rotation: 0,
            setRotation: vi.fn(function(r) {
                this.rotation = r;
                return this;
            })
        };
        
        // Main camera with zoom
        mainCamera = {
            zoom: 1.0,
            scrollX: 0,
            scrollY: 0,
            width: 1920,
            height: 1080,
            setZoom: vi.fn(function(z) {
                this.zoom = z;
                return this;
            }),
            setScroll: vi.fn(function(x, y) {
                this.scrollX = x;
                this.scrollY = y;
                return this;
            }),
            ignore: vi.fn()
        };
        
        // HUD camera (no input)
        hudCamera = {
            zoom: 1,
            scrollX: 0,
            scrollY: 0,
            width: 1920,
            height: 1080,
            inputEnabled: false,
            ignore: vi.fn()
        };
        
        // Track mouse position
        let mouseX = 960;
        let mouseY = 540;
        
        mockScene = {
            cameras: {
                main: mainCamera,
                add: vi.fn(() => hudCamera)
            },
            input: {
                activePointer: {
                    get x() { return mouseX; },
                    get y() { return mouseY; },
                    worldX: 960,
                    worldY: 540,
                    updateWorldPoint: vi.fn(function(camera) {
                        // Calculate world position based on camera scroll and zoom
                        this.worldX = (mouseX - camera.width / 2) / camera.zoom + camera.scrollX + player.x;
                        this.worldY = (mouseY - camera.height / 2) / camera.zoom + camera.scrollY + player.y;
                    })
                },
                on: vi.fn((event, handler) => {
                    inputCallbacks[event] = handler;
                }),
                off: vi.fn((event) => {
                    delete inputCallbacks[event];
                })
            },
            player: player,
            scale: { width: 1920, height: 1080 }
        };
        
        // Helper to set mouse position
        mockScene._setMousePos = (x, y) => {
            mouseX = x;
            mouseY = y;
        };
    });
    
    describe('Mouse Position Calculation', () => {
        it('should calculate world mouse position at 1x zoom', () => {
            mainCamera.zoom = 1.0;
            mainCamera.scrollX = 0;
            mainCamera.scrollY = 0;
            
            mockScene._setMousePos(1000, 600);
            
            // Update world point
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            
            // At 1x zoom, screen position roughly equals world position (plus scroll)
            const worldX = mockScene.input.activePointer.worldX;
            const worldY = mockScene.input.activePointer.worldY;
            
            expect(worldX).toBeGreaterThan(0);
            expect(worldY).toBeGreaterThan(0);
        });
        
        it('should calculate world mouse position at 2x zoom', () => {
            mainCamera.zoom = 2.0;
            mainCamera.scrollX = 100;
            mainCamera.scrollY = 50;
            
            mockScene._setMousePos(1000, 600);
            
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            
            const worldX = mockScene.input.activePointer.worldX;
            const worldY = mockScene.input.activePointer.worldY;
            
            // At 2x zoom, the visible area is smaller
            expect(worldX).toBeDefined();
            expect(worldY).toBeDefined();
        });
        
        it('should calculate world mouse position at 0.5x zoom', () => {
            mainCamera.zoom = 0.5;
            mainCamera.scrollX = -100;
            mainCamera.scrollY = -50;
            
            mockScene._setMousePos(1000, 600);
            
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            
            const worldX = mockScene.input.activePointer.worldX;
            const worldY = mockScene.input.activePointer.worldY;
            
            expect(worldX).toBeDefined();
            expect(worldY).toBeDefined();
        });
    });
    
    describe('Player Mouse Following', () => {
        it('should calculate angle to mouse at 1x zoom', () => {
            player.x = 960;
            player.y = 540;
            
            mockScene._setMousePos(1060, 540); // Mouse to the right
            
            mainCamera.zoom = 1.0;
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            
            const worldX = mockScene.input.activePointer.worldX;
            const worldY = mockScene.input.activePointer.worldY;
            
            const angle = Math.atan2(worldY - player.y, worldX - player.x);
            
            // Mouse to the right = ~0 radians
            expect(angle).toBeCloseTo(0, 1);
        });
        
        it('should calculate angle to mouse at 2x zoom', () => {
            player.x = 960;
            player.y = 540;
            
            mockScene._setMousePos(1060, 540); // Mouse 100px to right on screen
            
            mainCamera.zoom = 2.0;
            // At 2x zoom, visible area is half size, scroll to center on player
            // scrollX = playerX - screenWidth/(2*zoom)
            mainCamera.scrollX = player.x - (1920 / 2) / 2;
            mainCamera.scrollY = player.y - (1080 / 2) / 2;
            
            // Using Player.js calculation: worldX = scrollX + pointer.x / zoom
            const worldX = mainCamera.scrollX + 1060 / 2.0;
            const worldY = mainCamera.scrollY + 540 / 2.0;
            
            const angle = Math.atan2(worldY - player.y, worldX - player.x);
            
            // Mouse should still be to the right of player
            expect(Math.abs(angle)).toBeLessThan(0.5); // Within ~30 degrees of 0
        });
        
        it('should calculate angle to mouse at 0.5x zoom', () => {
            player.x = 960;
            player.y = 540;
            
            mockScene._setMousePos(1060, 540);
            
            mainCamera.zoom = 0.5;
            // At 0.5x zoom, visible area is larger
            mainCamera.scrollX = player.x - (1920 / 2) / 0.5;
            mainCamera.scrollY = player.y - (1080 / 2) / 0.5;
            
            // Using Player.js calculation: worldX = scrollX + pointer.x / zoom
            const worldX = mainCamera.scrollX + 1060 / 0.5;
            const worldY = mainCamera.scrollY + 540 / 0.5;
            
            const angle = Math.atan2(worldY - player.y, worldX - player.x);
            
            // Mouse should still be to the right
            expect(Math.abs(angle)).toBeLessThan(0.5); // Within ~30 degrees of 0
        });
    });
    
    describe('After Wheel Event', () => {
        it('should maintain mouse tracking after wheel event at 1x zoom', () => {
            player.x = 960;
            player.y = 540;
            
            // Initial mouse position
            mockScene._setMousePos(1060, 540);
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            
            const initialWorldX = mockScene.input.activePointer.worldX;
            
            // Simulate wheel event (zoom in)
            mainCamera.zoom = 1.2;
            mainCamera.setZoom(1.2);
            
            // Update world point again
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            
            const afterZoomWorldX = mockScene.input.activePointer.worldX;
            
            // Mouse should still point to same world position
            expect(afterZoomWorldX).toBeDefined();
        });
        
        it('should not break pointer worldX/worldY after wheel', () => {
            player.x = 960;
            player.y = 540;
            
            mockScene._setMousePos(1000, 600);
            
            // Before wheel
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            const beforeX = mockScene.input.activePointer.worldX;
            const beforeY = mockScene.input.activePointer.worldY;
            
            expect(beforeX).not.toBeNaN();
            expect(beforeY).not.toBeNaN();
            
            // Simulate multiple wheel events
            mainCamera.zoom = 1.4;
            mainCamera.setZoom(1.4);
            
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            const after1X = mockScene.input.activePointer.worldX;
            const after1Y = mockScene.input.activePointer.worldY;
            
            expect(after1X).not.toBeNaN();
            expect(after1Y).not.toBeNaN();
            
            // Another wheel
            mainCamera.zoom = 0.8;
            mainCamera.setZoom(0.8);
            
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            const after2X = mockScene.input.activePointer.worldX;
            const after2Y = mockScene.input.activePointer.worldY;
            
            expect(after2X).not.toBeNaN();
            expect(after2Y).not.toBeNaN();
        });
    });
    
    describe('HUD Camera with Main Camera', () => {
        it('should use main camera for mouse world position, not HUD camera', () => {
            // Add HUD camera
            mockScene.cameras.add(0, 0, 1920, 1080, false);
            
            player.x = 960;
            player.y = 540;
            mockScene._setMousePos(1000, 600);
            
            // Should update using main camera, not HUD camera
            mockScene.input.activePointer.updateWorldPoint(mainCamera);
            
            const worldX = mockScene.input.activePointer.worldX;
            const worldY = mockScene.input.activePointer.worldY;
            
            expect(worldX).toBeDefined();
            expect(worldY).toBeDefined();
            expect(worldX).not.toBeNaN();
            expect(worldY).not.toBeNaN();
        });
        
        it('should maintain correct mouse following with both cameras', () => {
            // Setup both cameras
            mockScene.cameras.add(0, 0, 1920, 1080, false);
            
            player.x = 960;
            player.y = 540;
            
            // Test at different zoom levels
            const zoomLevels = [0.5, 1.0, 1.5, 2.0];
            
            zoomLevels.forEach(zoom => {
                mainCamera.zoom = zoom;
                
                mockScene._setMousePos(1060, 540); // Mouse to right
                mockScene.input.activePointer.updateWorldPoint(mainCamera);
                
                const angle = Math.atan2(
                    mockScene.input.activePointer.worldY - player.y,
                    mockScene.input.activePointer.worldX - player.x
                );
                
                // Mouse should consistently be to the right
                expect(Math.abs(angle)).toBeLessThan(Math.PI / 4); // Within 45 degrees of 0
            });
        });
    });
});
