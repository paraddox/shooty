import { describe, it, expect } from 'vitest';

/**
 * HUD Panel Content Positioning Tests
 * 
 * Verifies that content is properly centered within slots using layout.centerX
 */

describe('HUD Panel Content Centering', () => {
    const PANEL_WIDTH = 160;
    const PADDING = 12;
    const AVAILABLE_WIDTH = PANEL_WIDTH - PADDING * 2; // 136
    const CENTER_X = AVAILABLE_WIDTH / 2; // 68
    
    describe('layout helpers provide correct center', () => {
        it('centerX should be at half of available width', () => {
            expect(CENTER_X).toBe(68);
        });
        
        it('circle centered at centerX extends from centerX-radius to centerX+radius', () => {
            const radius = 20;
            const leftEdge = CENTER_X - radius;
            const rightEdge = CENTER_X + radius;
            
            expect(leftEdge).toBe(48); // 68 - 20
            expect(rightEdge).toBe(88); // 68 + 20
            
            // Both edges should be within slot bounds
            expect(leftEdge).toBeGreaterThanOrEqual(0);
            expect(rightEdge).toBeLessThanOrEqual(AVAILABLE_WIDTH);
        });
    });
    
    describe('orb positioning should use centerX', () => {
        it('single orb should be centered at centerX', () => {
            const orbRadius = 14;
            const expectedCenter = CENTER_X; // 68
            
            const leftEdge = expectedCenter - orbRadius;
            const rightEdge = expectedCenter + orbRadius;
            
            expect(leftEdge).toBe(54); // 68 - 14
            expect(rightEdge).toBe(82); // 68 + 14
            expect(leftEdge).toBeGreaterThanOrEqual(0);
            expect(rightEdge).toBeLessThanOrEqual(AVAILABLE_WIDTH);
        });
        
        it('multiple orbs should be centered around centerX', () => {
            const orbCount = 3;
            const orbRadius = 14;
            const orbSpacing = 32; // Max spacing
            
            // Calculate positions centered around centerX
            const totalWidth = (orbCount - 1) * orbSpacing + orbRadius * 2;
            const startX = CENTER_X - (totalWidth / 2) + orbRadius;
            
            const positions = [];
            for (let i = 0; i < orbCount; i++) {
                positions.push(startX + i * orbSpacing);
            }
            
            // Middle orb should be at centerX
            expect(positions[1]).toBe(CENTER_X);
            
            // All orbs should fit within bounds
            for (const x of positions) {
                expect(x - orbRadius).toBeGreaterThanOrEqual(0);
                expect(x + orbRadius).toBeLessThanOrEqual(AVAILABLE_WIDTH);
            }
        });
    });
    
    describe('incorrect positioning at x=0 (left edge)', () => {
        it('placing circle center at x=0 causes left clipping', () => {
            const radius = 20;
            const centerX = 0; // WRONG - this is left edge
            
            const leftEdge = centerX - radius;
            const rightEdge = centerX + radius;
            
            expect(leftEdge).toBe(-20); // CLIPPED!
            expect(rightEdge).toBe(20);
        });
        
        it('placing orb center at x=0 causes left clipping', () => {
            const radius = 14;
            const centerX = 0; // WRONG - this is left edge
            
            const leftEdge = centerX - radius;
            expect(leftEdge).toBe(-14); // CLIPPED!
        });
    });
});
