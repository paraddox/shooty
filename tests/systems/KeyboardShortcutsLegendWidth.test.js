import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * KeyboardShortcutsLegend Panel Width Tests
 * 
 * Tests for dynamic panel width calculation based on content.
 */

describe('KeyboardShortcutsLegend Panel Width', () => {
    let legend;
    let mockScene;
    let registeredWidth;
    
    beforeEach(() => {
        mockScene = {
            add: {
                text: vi.fn((x, y, content, style) => ({
                    x, y, content, style,
                    setOrigin: vi.fn(function() { return this; }),
                    setDepth: vi.fn(function() { return this; }),
                    setVisible: vi.fn(function() { return this; }),
                    destroy: vi.fn(),
                    width: content.length * (style?.fontSize?.includes('9') ? 5.4 : 6), // Approximate width
                    height: 10
                })),
                container: vi.fn(() => ({
                    add: vi.fn(),
                    removeAll: vi.fn(),
                    setDepth: vi.fn(),
                    destroy: vi.fn(),
                    list: []
                }))
            },
            controls: {
                getAllBindings: vi.fn(() => [
                    { key: 'Q', action: 'Timeline Merge' },
                    { key: 'F', action: 'Dimensional Collapse' },
                    { key: 'DELETE', action: 'Dissolution Mode' },
                ]),
                onBindingChange: vi.fn()
            },
            hudPanels: {
                registerSlot: vi.fn((slotId, createFn, region) => {
                    // Capture the width passed to the callback
                    const container = mockScene.add.container();
                    const result = createFn(container, registeredWidth || 150, { direction: 'vertical' });
                    return container;
                }),
                updateSlotHeight: vi.fn()
            }
        };
        
        // Helper to measure text width
        const measureTextWidth = (text, fontSize = 9) => {
            // Approximate: monospace font is roughly 0.6x font size per char
            return text.length * (fontSize * 0.6);
        };
        
        legend = {
            scene: mockScene,
            container: null,
            staticShortcuts: [
                { key: 'WASD', action: 'Move' },
                { key: 'MOUSE', action: 'Aim & Shoot' }
            ],
            
            getShortcuts() {
                const dynamicBindings = this.scene.controls?.getAllBindings() || [];
                const sortedDynamic = [...dynamicBindings].sort((a, b) => a.key.localeCompare(b.key));
                return [...this.staticShortcuts, ...sortedDynamic];
            },
            
            /**
             * Calculate the maximum width needed for all content
             * Key column starts at x=6, action at x=55
             * Need: max(keyWidth) + gap + max(actionWidth) + padding
             */
            calculatePanelWidth() {
                const shortcuts = this.getShortcuts();
                const keyColumnX = 6;
                const actionColumnX = 55;
                const padding = 12; // 6px on each side
                
                let maxKeyWidth = 0;
                let maxActionWidth = 0;
                
                shortcuts.forEach(shortcut => {
                    // Key text (9px monospace)
                    const keyWidth = shortcut.key.length * 5.4; // 9 * 0.6
                    maxKeyWidth = Math.max(maxKeyWidth, keyWidth);
                    
                    // Action text (9px monospace)
                    const actionWidth = shortcut.action.length * 5.4;
                    maxActionWidth = Math.max(maxActionWidth, actionWidth);
                });
                
                // Total width = action column start + max action width + padding
                const totalWidth = actionColumnX + maxActionWidth + padding;
                
                return Math.max(totalWidth, 120); // Minimum 120px
            },
            
            createLegendPanel() {
                const requiredWidth = this.calculatePanelWidth();
                
                this.scene.hudPanels.registerSlot('KEYBOARD_SHORTCUTS', (container, width, layout) => {
                    this.container = container;
                    this.container.setDepth(100);
                    
                    // Store the allocated width for rendering
                    this.allocatedWidth = width;
                    
                    this.renderShortcuts();
                    return { height: this.getPanelHeight() };
                }, 'BOTTOM_LEFT');
                
                // Return the required width so HUDPanelManager can use it
                return requiredWidth;
            },
            
            getPanelHeight() {
                const shortcuts = this.getShortcuts();
                const rowHeight = 14;
                const padding = 6;
                return (shortcuts.length * rowHeight) + padding;
            },
            
            renderShortcuts() {
                if (!this.container) return;
                this.container.removeAll(true);
                
                const shortcuts = this.getShortcuts();
                let y = 6;
                const rowHeight = 14;
                const actionColumnX = 55;
                
                shortcuts.forEach((shortcut) => {
                    const keyText = this.scene.add.text(6, y, shortcut.key, {
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        fill: '#00f0ff'
                    }).setOrigin(0, 0);
                    
                    const actionText = this.scene.add.text(actionColumnX, y, shortcut.action, {
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        fill: '#ffffff'
                    }).setOrigin(0, 0);
                    
                    this.container.add([keyText, actionText]);
                    y += rowHeight;
                });
            }
        };
    });
    
    describe('calculatePanelWidth', () => {
        it('should calculate width based on longest action description', () => {
            // "Dimensional Collapse" is one of the longest at ~18 chars
            // 55 (action column) + 18*5.4 (width) + 12 (padding) = ~164px
            const width = legend.calculatePanelWidth();
            
            expect(width).toBeGreaterThan(150);
            expect(width).toBeGreaterThanOrEqual(160);
        });
        
        it('should include padding in width calculation', () => {
            const width = legend.calculatePanelWidth();
            const shortcuts = legend.getShortcuts();
            
            // Find longest action
            const maxActionLength = Math.max(...shortcuts.map(s => s.action.length));
            const expectedMinWidth = 55 + (maxActionLength * 5.4) + 12;
            
            expect(width).toBeGreaterThanOrEqual(expectedMinWidth);
        });
        
        it('should respect minimum width of 120px', () => {
            // Empty or very short content
            legend.staticShortcuts = [{ key: 'X', action: 'Y' }];
            mockScene.controls.getAllBindings = vi.fn(() => []);
            
            const width = legend.calculatePanelWidth();
            
            expect(width).toBeGreaterThanOrEqual(120);
        });
        
        it('should account for all shortcuts including dynamic ones', () => {
            // Add a longer dynamic binding
            mockScene.controls.getAllBindings = vi.fn(() => [
                { key: 'SHIFT', action: 'Quantum Superposition' }, // 21 chars
            ]);
            
            const width = legend.calculatePanelWidth();
            
            // Should be wider due to longer action
            expect(width).toBeGreaterThan(160);
        });
        
        it('should handle empty bindings gracefully', () => {
            mockScene.controls.getAllBindings = vi.fn(() => []);
            legend.staticShortcuts = [];
            
            const width = legend.calculatePanelWidth();
            
            // Should return minimum width
            expect(width).toBe(120);
        });
    });
});
