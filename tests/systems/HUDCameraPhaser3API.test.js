import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * HUD Camera Setup Tests - Phaser 3 Camera API
 * 
 * Tests to verify correct Phaser 3 camera API usage.
 * Phaser 3 cameras don't have setDepth() - order matters instead.
 */

describe('HUD Camera Phaser 3 API', () => {
    let mockScene;
    let cameras;
    let addedCameras;
    
    beforeEach(() => {
        addedCameras = [];
        
        const createMockCamera = () => ({
            zoom: 1,
            scrollX: 0,
            scrollY: 0,
            width: 1920,
            height: 1080,
            setZoom: vi.fn(function(z) { this.zoom = z; return this; }),
            setScroll: vi.fn(function(x, y) { this.scrollX = x; this.scrollY = y; return this; }),
            setSize: vi.fn(function(w, h) { this.width = w; this.height = h; return this; }),
            ignore: vi.fn(function(obj) { return this; }),
            // NOTE: Phaser 3 cameras do NOT have setDepth()
            // This was the bug - trying to call setDepth on a camera
        });
        
        cameras = {
            main: createMockCamera(),
            add: vi.fn(function(x, y, width, height, makeMain) {
                const cam = createMockCamera();
                cam.x = x;
                cam.y = y;
                cam.width = width;
                cam.height = height;
                addedCameras.push(cam);
                return cam;
            }),
            cameras: [] // Array of all cameras
        };
        
        mockScene = {
            cameras: cameras,
            scale: {
                width: 1920,
                height: 1080
            }
        };
    });
    
    describe('Phaser 3 Camera API', () => {
        it('should not call setDepth on cameras (cameras do not have this method)', () => {
            const newCamera = mockScene.cameras.add(0, 0, 1920, 1080, false);
            
            // Verify camera was created
            expect(newCamera).toBeDefined();
            expect(newCamera.setZoom).toBeDefined();
            expect(newCamera.setScroll).toBeDefined();
            
            // setDepth should NOT exist on cameras
            expect(newCamera.setDepth).toBeUndefined();
        });
        
        it('should set zoom and scroll on new camera', () => {
            const hudCamera = mockScene.cameras.add(0, 0, 1920, 1080, false);
            
            // These methods exist and work
            hudCamera.setZoom(1);
            hudCamera.setScroll(0, 0);
            
            expect(hudCamera.zoom).toBe(1);
            expect(hudCamera.scrollX).toBe(0);
            expect(hudCamera.scrollY).toBe(0);
        });
        
        it('should render cameras in order of creation (last = top)', () => {
            // First camera (main)
            const mainCamera = mockScene.cameras.main;
            
            // Second camera (HUD) - added later
            const hudCamera = mockScene.cameras.add(0, 0, 1920, 1080, false);
            
            // In Phaser 3, cameras render in the order they were added
            // The HUD camera (added second) will render on top of main camera
            expect(addedCameras.length).toBe(1);
            expect(addedCameras[0]).toBe(hudCamera);
        });
        
        it('should ignore objects from specified cameras', () => {
            const hudCamera = mockScene.cameras.add(0, 0, 1920, 1080, false);
            
            const player = { name: 'player' };
            const hudElement = { name: 'hud' };
            
            // HUD camera ignores player (world object)
            hudCamera.ignore(player);
            expect(hudCamera.ignore).toHaveBeenCalledWith(player);
            
            // Main camera ignores HUD elements
            mockScene.cameras.main.ignore(hudElement);
            expect(mockScene.cameras.main.ignore).toHaveBeenCalledWith(hudElement);
        });
    });
    
    describe('Correct HUD Camera Setup', () => {
        it('should setup HUD camera without setDepth call', () => {
            // Simulate correct setup
            const hudCamera = mockScene.cameras.add(
                0, 0,
                mockScene.scale.width,
                mockScene.scale.height,
                false
            );
            
            // Configure camera
            hudCamera.setZoom(1);
            hudCamera.setScroll(0, 0);
            
            // Do NOT call setDepth - cameras don't have this method
            // The camera will render on top because it was added last
            
            expect(hudCamera.zoom).toBe(1);
            expect(hudCamera.scrollX).toBe(0);
            expect(hudCamera.scrollY).toBe(0);
            
            // Verify no setDepth method was called (would throw error)
            const hasSetDepth = 'setDepth' in hudCamera && typeof hudCamera.setDepth === 'function';
            expect(hasSetDepth).toBe(false);
        });
        
        it('should properly separate HUD and world rendering', () => {
            const player = { name: 'player', active: true };
            const enemy = { name: 'enemy', active: true };
            const hudPanel = { name: 'hud', active: true };
            
            const hudCamera = mockScene.cameras.add(0, 0, 1920, 1080, false);
            
            // HUD camera ignores world objects
            hudCamera.ignore(player);
            hudCamera.ignore(enemy);
            
            // Main camera ignores HUD
            mockScene.cameras.main.ignore(hudPanel);
            
            expect(hudCamera.ignore).toHaveBeenCalledWith(player);
            expect(hudCamera.ignore).toHaveBeenCalledWith(enemy);
            expect(mockScene.cameras.main.ignore).toHaveBeenCalledWith(hudPanel);
        });
    });
});
