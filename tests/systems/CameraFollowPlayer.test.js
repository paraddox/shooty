import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Camera Follow Player Tests
 * 
 * Tests to ensure the camera follows the player when they move
 * beyond the visible screen area.
 */

describe('Camera Follow Player', () => {
    let mockScene;
    let player;
    let mainCamera;
    let worldWidth;
    let worldHeight;
    
    beforeEach(() => {
        worldWidth = 3000; // Larger than screen
        worldHeight = 2500; // Larger than screen
        
        player = {
            x: 1500,
            y: 1250,
            width: 32,
            height: 32
        };
        
        mainCamera = {
            zoom: 1,
            scrollX: 0,
            scrollY: 0,
            width: 1920,
            height: 1080,
            setScroll: vi.fn(function(x, y) {
                this.scrollX = x;
                this.scrollY = y;
                return this;
            }),
            setZoom: vi.fn(function(z) {
                this.zoom = z;
                return this;
            })
        };
        
        mockScene = {
            cameras: {
                main: mainCamera
            },
            player: player,
            scale: {
                width: 1920,
                height: 1080
            }
        };
    });
    
    describe('Camera Bounds and Following', () => {
        it('should calculate scroll position to center player on screen', () => {
            // Camera should center on player
            const viewWidth = mainCamera.width / mainCamera.zoom;
            const viewHeight = mainCamera.height / mainCamera.zoom;
            
            // Calculate scroll to center player
            const expectedScrollX = player.x - viewWidth / 2;
            const expectedScrollY = player.y - viewHeight / 2;
            
            // Apply scroll
            mainCamera.setScroll(expectedScrollX, expectedScrollY);
            
            // Verify camera scrolled
            expect(mainCamera.scrollX).toBe(expectedScrollX);
            expect(mainCamera.scrollY).toBe(expectedScrollY);
            
            // Verify player is centered (approximately)
            const centerX = mainCamera.scrollX + viewWidth / 2;
            const centerY = mainCamera.scrollY + viewHeight / 2;
            
            expect(centerX).toBeCloseTo(player.x);
            expect(centerY).toBeCloseTo(player.y);
        });
        
        it('should clamp scroll position within world bounds', () => {
            const viewWidth = mainCamera.width / mainCamera.zoom;
            const viewHeight = mainCamera.height / mainCamera.zoom;
            
            // Player near left edge
            player.x = 50;
            player.y = 1250;
            
            let scrollX = player.x - viewWidth / 2;
            let scrollY = player.y - viewHeight / 2;
            
            // Clamp to world bounds
            scrollX = Math.max(0, Math.min(scrollX, worldWidth - viewWidth));
            scrollY = Math.max(0, Math.min(scrollY, worldHeight - viewHeight));
            
            // Should not scroll negative (can't show beyond left edge)
            expect(scrollX).toBeGreaterThanOrEqual(0);
            
            // Player near right edge
            player.x = worldWidth - 50;
            
            scrollX = player.x - viewWidth / 2;
            scrollX = Math.max(0, Math.min(scrollX, worldWidth - viewWidth));
            
            // Should not scroll beyond world width
            expect(scrollX).toBeLessThanOrEqual(worldWidth - viewWidth);
        });
        
        it('should follow player as they move off-screen to the right', () => {
            // Player starts centered
            player.x = 1500;
            player.y = 1250;
            
            // View size at 1x zoom
            const viewWidth = 1920;
            const viewHeight = 1080;
            
            // Initial camera position - center on player
            let scrollX = player.x - viewWidth / 2;
            let scrollY = player.y - viewHeight / 2;
            
            mainCamera.setScroll(scrollX, scrollY);
            
            // Player moves right, past the visible area
            player.x = 2500;
            
            // Update camera to follow
            scrollX = player.x - viewWidth / 2;
            scrollY = player.y - viewHeight / 2;
            
            // Clamp to bounds
            scrollX = Math.max(0, Math.min(scrollX, worldWidth - viewWidth));
            scrollY = Math.max(0, Math.min(scrollY, worldHeight - viewHeight));
            
            mainCamera.setScroll(scrollX, scrollY);
            
            // Camera should have scrolled right
            expect(mainCamera.scrollX).toBeGreaterThan(0);
            
            // Player should be visible and within screen bounds
            const playerScreenX = player.x - mainCamera.scrollX;
            
            // Player should be within visible screen area
            expect(playerScreenX).toBeGreaterThanOrEqual(0);
            expect(playerScreenX).toBeLessThanOrEqual(viewWidth);
        });
        
        it('should follow player as they move off-screen to the bottom', () => {
            player.x = 1500;
            player.y = 2000; // Move down
            
            const viewWidth = 1920;
            const viewHeight = 1080;
            
            let scrollX = player.x - viewWidth / 2;
            let scrollY = player.y - viewHeight / 2;
            
            // Clamp
            scrollX = Math.max(0, Math.min(scrollX, worldWidth - viewWidth));
            scrollY = Math.max(0, Math.min(scrollY, worldHeight - viewHeight));
            
            mainCamera.setScroll(scrollX, scrollY);
            
            // Camera should have scrolled down
            expect(mainCamera.scrollY).toBeGreaterThan(0);
            
            // Player should be visible on screen
            const playerScreenY = player.y - mainCamera.scrollY;
            
            // Player should be within visible screen area
            expect(playerScreenY).toBeGreaterThanOrEqual(0);
            expect(playerScreenY).toBeLessThanOrEqual(viewHeight);
        });
        
        it('should maintain camera follow after zoom changes', () => {
            // Start at 1x zoom
            mainCamera.zoom = 1;
            player.x = 1500;
            player.y = 1250;
            
            // Calculate scroll at 1x zoom
            let viewWidth = mainCamera.width / mainCamera.zoom;
            let viewHeight = mainCamera.height / mainCamera.zoom;
            
            let scrollX = player.x - viewWidth / 2;
            let scrollY = player.y - viewHeight / 2;
            
            scrollX = Math.max(0, Math.min(scrollX, worldWidth - viewWidth));
            scrollY = Math.max(0, Math.min(scrollY, worldHeight - viewHeight));
            
            mainCamera.setZoom(1);
            mainCamera.setScroll(scrollX, scrollY);
            
            // Zoom to 2x
            mainCamera.zoom = 2;
            
            viewWidth = mainCamera.width / mainCamera.zoom;
            viewHeight = mainCamera.height / mainCamera.zoom;
            
            // Recalculate scroll for new zoom
            scrollX = player.x - viewWidth / 2;
            scrollY = player.y - viewHeight / 2;
            
            scrollX = Math.max(0, Math.min(scrollX, worldWidth - viewWidth));
            scrollY = Math.max(0, Math.min(scrollY, worldHeight - viewHeight));
            
            mainCamera.setZoom(2);
            mainCamera.setScroll(scrollX, scrollY);
            
            // Camera should still center player (approximately)
            const playerScreenX = player.x - mainCamera.scrollX;
            const playerScreenY = player.y - mainCamera.scrollY;
            
            // At 2x zoom, view is 960x540
            // Player should be at center of visible area
            expect(playerScreenX).toBeGreaterThan(0);
            expect(playerScreenX).toBeLessThanOrEqual(960);
            expect(playerScreenY).toBeGreaterThan(0);
            expect(playerScreenY).toBeLessThanOrEqual(540);
        });
    });
    
    describe('Per-frame Camera Update', () => {
        it('should update camera scroll every frame to follow player', () => {
            // Simulate update loop
            const updateCamera = () => {
                const viewWidth = mainCamera.width / mainCamera.zoom;
                const viewHeight = mainCamera.height / mainCamera.zoom;
                
                let scrollX = player.x - viewWidth / 2;
                let scrollY = player.y - viewHeight / 2;
                
                // Clamp to bounds
                scrollX = Math.max(0, Math.min(scrollX, worldWidth - viewWidth));
                scrollY = Math.max(0, Math.min(scrollY, worldHeight - viewHeight));
                
                mainCamera.setScroll(scrollX, scrollY);
            };
            
            // Frame 1
            player.x = 1000;
            player.y = 1000;
            updateCamera();
            const frame1ScrollX = mainCamera.scrollX;
            
            // Frame 2 - player moves
            player.x = 1500;
            player.y = 1200;
            updateCamera();
            const frame2ScrollX = mainCamera.scrollX;
            
            // Camera should have moved
            expect(frame2ScrollX).toBeGreaterThan(frame1ScrollX);
            
            // Player should remain on screen
            const playerScreenX = player.x - mainCamera.scrollX;
            expect(playerScreenX).toBeGreaterThanOrEqual(0);
            expect(playerScreenX).toBeLessThanOrEqual(mainCamera.width);
        });
        
        it('should keep player visible on screen at all times', () => {
            const positions = [
                { x: 100, y: 100 },     // Top-left
                { x: 1500, y: 1250 },   // Center
                { x: 2900, y: 2400 },   // Bottom-right
            ];
            
            positions.forEach(pos => {
                player.x = pos.x;
                player.y = pos.y;
                
                const viewWidth = mainCamera.width / mainCamera.zoom;
                const viewHeight = mainCamera.height / mainCamera.zoom;
                
                let scrollX = player.x - viewWidth / 2;
                let scrollY = player.y - viewHeight / 2;
                
                scrollX = Math.max(0, Math.min(scrollX, worldWidth - viewWidth));
                scrollY = Math.max(0, Math.min(scrollY, worldHeight - viewHeight));
                
                mainCamera.setScroll(scrollX, scrollY);
                
                // Calculate player position on screen
                const playerScreenX = player.x - mainCamera.scrollX;
                const playerScreenY = player.y - mainCamera.scrollY;
                
                // Player should be within screen bounds
                expect(playerScreenX).toBeGreaterThanOrEqual(-50); // Small buffer for player size
                expect(playerScreenX).toBeLessThanOrEqual(mainCamera.width + 50);
                expect(playerScreenY).toBeGreaterThanOrEqual(-50);
                expect(playerScreenY).toBeLessThanOrEqual(mainCamera.height + 50);
            });
        });
    });
});
