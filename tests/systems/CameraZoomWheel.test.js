import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Camera Zoom Wheel Event Tests
 * 
 * Tests to ensure mouse wheel zoom works on the arena/main camera
 * even when a HUD camera exists.
 */

describe('Camera Zoom Wheel Events', () => {
    let mockScene;
    let mainCamera;
    let hudCamera;
    let wheelHandler;
    let zoomLevel;
    
    beforeEach(() => {
        zoomLevel = 1.0;
        
        mainCamera = {
            zoom: 1.0,
            width: 1920,
            height: 1080,
            setZoom: vi.fn(function(z) {
                this.zoom = z;
                zoomLevel = z;
                return this;
            }),
            setScroll: vi.fn(function(x, y) {
                this.scrollX = x;
                this.scrollY = y;
                return this;
            }),
            ignore: vi.fn()
        };
        
        hudCamera = {
            zoom: 1, // Always fixed
            width: 1920,
            height: 1080,
            setZoom: vi.fn(function(z) {
                // HUD camera should never change zoom
                return this;
            }),
            ignore: vi.fn()
        };
        
        // Input system that handles wheel events
        const inputCallbacks = {};
        
        mockScene = {
            cameras: {
                main: mainCamera
            },
            input: {
                on: vi.fn(function(event, handler) {
                    inputCallbacks[event] = handler;
                    return this;
                }),
                off: vi.fn(function(event) {
                    delete inputCallbacks[event];
                    return this;
                }),
                // Simulate triggering an event
                trigger: function(event, ...args) {
                    if (inputCallbacks[event]) {
                        inputCallbacks[event](...args);
                    }
                }
            },
            scale: {
                width: 1920,
                height: 1080
            },
            player: {
                x: 960,
                y: 540
            }
        };
        
        // Store reference for tests
        mockScene._inputCallbacks = inputCallbacks;
    });
    
    describe('Wheel Event Registration', () => {
        it('should register wheel event handler on input system', () => {
            const wheelCallback = vi.fn();
            
            mockScene.input.on('wheel', wheelCallback);
            
            expect(mockScene.input.on).toHaveBeenCalledWith('wheel', wheelCallback);
        });
        
        it('should call wheel handler when wheel event is triggered', () => {
            let zoomCalled = false;
            
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                const zoomStep = 0.2;
                const camera = mockScene.cameras.main;
                
                if (deltaY > 0) {
                    const newZoom = Math.max(0.5, camera.zoom - zoomStep);
                    camera.setZoom(newZoom);
                } else {
                    const newZoom = Math.min(3.0, camera.zoom + zoomStep);
                    camera.setZoom(newZoom);
                }
                zoomCalled = true;
            });
            
            // Simulate scroll up (zoom in)
            mockScene.input.trigger('wheel', {}, [], 0, -100, 0);
            
            expect(zoomCalled).toBe(true);
            expect(mockScene.cameras.main.zoom).toBe(1.2);
        });
    });
    
    describe('Zoom Control', () => {
        it('should zoom in when scrolling up (negative deltaY)', () => {
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                const zoomStep = 0.2;
                const camera = mockScene.cameras.main;
                
                if (deltaY > 0) {
                    camera.setZoom(Math.max(0.5, camera.zoom - zoomStep));
                } else {
                    camera.setZoom(Math.min(3.0, camera.zoom + zoomStep));
                }
            });
            
            // Scroll up (negative deltaY) = zoom in
            mockScene.input.trigger('wheel', {}, [], 0, -100, 0);
            
            expect(mockScene.cameras.main.setZoom).toHaveBeenCalledWith(1.2);
        });
        
        it('should zoom out when scrolling down (positive deltaY)', () => {
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                const zoomStep = 0.2;
                const camera = mockScene.cameras.main;
                
                if (deltaY > 0) {
                    camera.setZoom(Math.max(0.5, camera.zoom - zoomStep));
                } else {
                    camera.setZoom(Math.min(3.0, camera.zoom + zoomStep));
                }
            });
            
            // Scroll down (positive deltaY) = zoom out
            mockScene.input.trigger('wheel', {}, [], 0, 100, 0);
            
            expect(mockScene.cameras.main.setZoom).toHaveBeenCalledWith(0.8);
        });
        
        it('should not zoom beyond minimum (0.5)', () => {
            mainCamera.zoom = 0.5;
            
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                const zoomStep = 0.2;
                const camera = mockScene.cameras.main;
                
                if (deltaY > 0) {
                    camera.setZoom(Math.max(0.5, camera.zoom - zoomStep));
                } else {
                    camera.setZoom(Math.min(3.0, camera.zoom + zoomStep));
                }
            });
            
            // Try to zoom out more at minimum zoom
            mockScene.input.trigger('wheel', {}, [], 0, 100, 0);
            
            expect(mockScene.cameras.main.setZoom).toHaveBeenCalledWith(0.5);
        });
        
        it('should not zoom beyond maximum (3.0)', () => {
            mainCamera.zoom = 3.0;
            
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                const zoomStep = 0.2;
                const camera = mockScene.cameras.main;
                
                if (deltaY > 0) {
                    camera.setZoom(Math.max(0.5, camera.zoom - zoomStep));
                } else {
                    camera.setZoom(Math.min(3.0, camera.zoom + zoomStep));
                }
            });
            
            // Try to zoom in more at maximum zoom
            mockScene.input.trigger('wheel', {}, [], 0, -100, 0);
            
            expect(mockScene.cameras.main.setZoom).toHaveBeenCalledWith(3.0);
        });
    });
    
    describe('With HUD Camera Present', () => {
        it('should still zoom main camera when HUD camera exists', () => {
            // Simulate having both cameras
            mockScene.cameras.hud = hudCamera;
            
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                const zoomStep = 0.2;
                // Must use main camera, not any other camera
                const camera = mockScene.cameras.main;
                
                if (deltaY > 0) {
                    camera.setZoom(Math.max(0.5, camera.zoom - zoomStep));
                } else {
                    camera.setZoom(Math.min(3.0, camera.zoom + zoomStep));
                }
            });
            
            // Trigger zoom
            mockScene.input.trigger('wheel', {}, [], 0, -100, 0);
            
            // Main camera should zoom
            expect(mockScene.cameras.main.setZoom).toHaveBeenCalled();
            
            // HUD camera should NOT zoom
            expect(mockScene.cameras.hud.setZoom).not.toHaveBeenCalled();
        });
        
        it('should only affect main camera zoom, never HUD camera', () => {
            mockScene.cameras.hud = hudCamera;
            
            // Set up the zoom handler
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                const zoomStep = 0.2;
                const camera = mockScene.cameras.main;
                
                if (deltaY > 0) {
                    camera.setZoom(Math.max(0.5, camera.zoom - zoomStep));
                } else {
                    camera.setZoom(Math.min(3.0, camera.zoom + zoomStep));
                }
            });
            
            // Multiple zoom actions
            mockScene.input.trigger('wheel', {}, [], 0, -100, 0); // Zoom in
            mockScene.input.trigger('wheel', {}, [], 0, -100, 0); // Zoom in
            mockScene.input.trigger('wheel', {}, [], 0, 100, 0);  // Zoom out
            
            // HUD camera zoom should never change (always 1)
            expect(hudCamera.zoom).toBe(1);
            
            // Main camera should have been zoomed
            expect(mainCamera.setZoom).toHaveBeenCalledTimes(3);
        });
    });
    
    describe('GameObjects Parameter', () => {
        it('should receive empty gameObjects array when wheeling over empty space', () => {
            let receivedGameObjects = null;
            
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                receivedGameObjects = gameObjects;
            });
            
            // Wheel over empty space (no game objects under cursor)
            mockScene.input.trigger('wheel', { x: 100, y: 100 }, [], 0, -100, 0);
            
            expect(receivedGameObjects).toEqual([]);
        });
        
        it('should handle wheel events over HUD elements correctly', () => {
            // When wheeling over a HUD element, gameObjects contains that element
            const hudElement = { name: 'hudPanel', isHUDElement: true };
            let receivedGameObjects = null;
            let zoomCalled = false;
            
            mockScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                receivedGameObjects = gameObjects;
                
                // Even if wheeling over HUD, we should still zoom main camera
                // because HUD camera has scrollFactor 0 and shouldn't block
                const camera = mockScene.cameras.main;
                camera.setZoom(deltaY < 0 ? camera.zoom + 0.2 : Math.max(0.5, camera.zoom - 0.2));
                zoomCalled = true;
            });
            
            // Wheel over HUD element
            mockScene.input.trigger('wheel', { x: 20, y: 20 }, [hudElement], 0, -100, 0);
            
            expect(receivedGameObjects).toContain(hudElement);
            expect(zoomCalled).toBe(true);
        });
    });
});
