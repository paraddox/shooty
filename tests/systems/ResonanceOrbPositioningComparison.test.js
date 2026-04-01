import { describe, it, expect } from 'vitest';

/**
 * Demonstration: Old vs New Positioning Logic
 * 
 * This shows how the old center-based positioning would fail the bounds tests,
 * proving the tests correctly catch the clipping issue.
 */

describe('Positioning Comparison - Old vs New', () => {
    const SLOT_WIDTH = 136;
    const ORB_RADIUS = 14;
    
    // OLD broken logic: center-based around x=0
    function oldCalculateOrbPositions(orbCount) {
        const positions = [];
        for (let i = 0; i < orbCount; i++) {
            const x = (i - (orbCount - 1) / 2) * 35; // Negative positions for left orbs!
            positions.push(x);
        }
        return positions;
    }
    
    // NEW fixed logic: left-edge based with calculated spacing
    function newCalculateOrbPositions(orbCount) {
        const orbSpacing = Math.min(32, (SLOT_WIDTH - ORB_RADIUS * 2) / Math.max(1, orbCount - 1));
        const totalWidth = orbCount * ORB_RADIUS * 2 + (orbCount - 1) * (orbSpacing - ORB_RADIUS * 2);
        const startX = (SLOT_WIDTH - totalWidth) / 2 + ORB_RADIUS;
        
        const positions = [];
        for (let i = 0; i < orbCount; i++) {
            positions.push(startX + i * orbSpacing);
        }
        return positions;
    }
    
    describe('OLD positioning (broken)', () => {
        it('places first orb at negative x with 2 orbs (CLIPPED!)', () => {
            const positions = oldCalculateOrbPositions(2);
            
            // Old logic: positions are [-17.5, 17.5]
            expect(positions[0]).toBe(-17.5); // NEGATIVE! Will clip at left edge
            expect(positions[1]).toBe(17.5);
            
            // Verify the bug: left edge of first orb is outside slot
            const firstOrbLeft = positions[0] - ORB_RADIUS;
            expect(firstOrbLeft).toBe(-31.5); // Clearly outside [0, 136] bounds!
        });
        
        it('places leftmost orb at negative x with 3 orbs (CLIPPED!)', () => {
            const positions = oldCalculateOrbPositions(3);
            
            // Old logic: positions are [-35, 0, 35]
            expect(positions[0]).toBe(-35); // NEGATIVE! Clipped!
            expect(positions[1]).toBe(0);
            expect(positions[2]).toBe(35);
            
            // Verify the bug
            const firstOrbLeft = positions[0] - ORB_RADIUS;
            expect(firstOrbLeft).toBe(-49); // Way outside bounds
        });
    });
    
    describe('NEW positioning (fixed)', () => {
        it('keeps all orbs within slot bounds with 2 orbs', () => {
            const positions = newCalculateOrbPositions(2);
            
            // All positions should be positive and within slot
            for (const x of positions) {
                expect(x).toBeGreaterThan(ORB_RADIUS); // Center must be > radius from left
                expect(x).toBeLessThan(SLOT_WIDTH - ORB_RADIUS); // Center must be < width - radius from right
            }
            
            // Specifically verify no clipping
            const firstOrbLeft = positions[0] - ORB_RADIUS;
            const lastOrbRight = positions[1] + ORB_RADIUS;
            
            expect(firstOrbLeft).toBeGreaterThanOrEqual(0);
            expect(lastOrbRight).toBeLessThanOrEqual(SLOT_WIDTH);
        });
        
        it('keeps all orbs within slot bounds with 3 orbs', () => {
            const positions = newCalculateOrbPositions(3);
            
            for (const x of positions) {
                const orbLeft = x - ORB_RADIUS;
                const orbRight = x + ORB_RADIUS;
                
                expect(orbLeft).toBeGreaterThanOrEqual(0);
                expect(orbRight).toBeLessThanOrEqual(SLOT_WIDTH);
            }
        });
    });
    
    describe('contrast: old vs new with 1 orb', () => {
        it('shows old centered at 0, new centered at 68', () => {
            const oldPos = oldCalculateOrbPositions(1)[0];
            const newPos = newCalculateOrbPositions(1)[0];
            
            expect(oldPos).toBe(0); // Old: centered at 0 (panel boundary!)
            expect(newPos).toBe(68); // New: centered at 68 (middle of 136)
            
            // Old: extends from -14 to +14 (half clipped!)
            expect(oldPos - ORB_RADIUS).toBe(-14);
            expect(oldPos + ORB_RADIUS).toBe(14);
            
            // New: extends from 54 to 82 (fully visible!)
            expect(newPos - ORB_RADIUS).toBe(54);
            expect(newPos + ORB_RADIUS).toBe(82);
        });
    });
});
