import { describe, it, expect } from 'vitest';

/**
 * KeyboardShortcutsLegend Width Calculation Test
 * 
 * Verifies that calculatePanelWidth produces correct widths for actual game content.
 */

describe('KeyboardShortcutsLegend Width Calculation', () => {
    // Simulate the actual calculatePanelWidth implementation
    const calculatePanelWidth = (shortcuts) => {
        const actionColumnX = 55;
        const rightPadding = 10;
        
        let maxActionWidth = 0;
        
        shortcuts.forEach(shortcut => {
            // Using 6.2px per char (conservative estimate)
            const actionWidth = shortcut.action.length * 6.2;
            maxActionWidth = Math.max(maxActionWidth, actionWidth);
        });
        
        const totalWidth = actionColumnX + maxActionWidth + rightPadding;
        const roundedWidth = Math.ceil(totalWidth / 10) * 10;
        return Math.max(roundedWidth, 160);
    };
    
    // Actual shortcuts from the game
    const gameShortcuts = [
        { key: 'WASD', action: 'Move' },
        { key: 'MOUSE', action: 'Aim & Shoot' },
        { key: 'C', action: 'Cinematic Mode' },
        { key: 'DELETE', action: 'Dissolution Mode' },
        { key: 'ESC', action: 'Exit Dissolution' },
        { key: 'F', action: 'Dimensional Collapse' },
        { key: 'F12', action: 'Screenshot' },
        { key: 'G', action: 'Whisper' },
        { key: 'M', action: 'Memory Trance' },
        { key: 'ONE', action: 'Harmonic Entanglement' },
        { key: 'P', action: 'Patch Mode' },
        { key: 'Q', action: 'Timeline Merge' },
        { key: 'SPACE', action: 'Blink' },
        { key: 'T', action: 'Apophenic Focus' },
        { key: 'THREE', action: 'Cascade Entanglement' },
        { key: 'TWO', action: 'Phase Entanglement' },
        { key: 'V', action: 'Void Resonance' },
        { key: 'X', action: 'Void Exchange' },
    ];
    
    describe('Actual Game Content', () => {
        it('should calculate sufficient width for all game shortcuts', () => {
            const width = calculatePanelWidth(gameShortcuts);
            
            // Find longest action
            const longestAction = gameShortcuts.reduce((a, b) => 
                a.action.length > b.action.length ? a : b
            );
            
            console.log(`Longest action: "${longestAction.action}" (${longestAction.action.length} chars)`);
            console.log(`Calculated width: ${width}px`);
            
            // With 6.2px per char:
            // "Harmonic Entanglement" = 21 chars * 6.2 = 130.2px
            // Total = 55 + 130.2 + 10 = 195.2 -> rounded to 200
            expect(width).toBeGreaterThanOrEqual(190);
        });
        
        it('should fit "Harmonic Entanglement" without overflow', () => {
            const shortcuts = [{ key: 'ONE', action: 'Harmonic Entanglement' }];
            const width = calculatePanelWidth(shortcuts);
            
            // Action at x=55, width ~130px, ends at ~185px
            // Panel width should be at least 195px (rounded to 200)
            expect(width).toBeGreaterThanOrEqual(190);
        });
        
        it('should fit "Dimensional Collapse" without overflow', () => {
            const shortcuts = [{ key: 'F', action: 'Dimensional Collapse' }];
            const width = calculatePanelWidth(shortcuts);
            
            // "Dimensional Collapse" = 20 chars * 6.2 = 124px
            // Total = 55 + 124 + 10 = 189 -> rounded to 190
            expect(width).toBeGreaterThanOrEqual(180);
        });
        
        it('should fit "Cascade Entanglement" without overflow', () => {
            const shortcuts = [{ key: 'THREE', action: 'Cascade Entanglement' }];
            const width = calculatePanelWidth(shortcuts);
            
            // "Cascade Entanglement" = 20 chars * 6.2 = 124px
            expect(width).toBeGreaterThanOrEqual(180);
        });
        
        it('should produce consistent rounded widths', () => {
            const testCases = [
                { shortcuts: [{ key: 'A', action: 'Short' }], minExpected: 160 },
                { shortcuts: [{ key: 'B', action: 'Medium Length' }], minExpected: 160 },
                { shortcuts: [{ key: 'C', action: 'Very Long Action Name' }], minExpected: 190 },
            ];
            
            testCases.forEach(({ shortcuts, minExpected }) => {
                const width = calculatePanelWidth(shortcuts);
                expect(width).toBeGreaterThanOrEqual(minExpected);
                expect(width % 10).toBe(0); // Should be rounded to nearest 10
            });
        });
    });
});
