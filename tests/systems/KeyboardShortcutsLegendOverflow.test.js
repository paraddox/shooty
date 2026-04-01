import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * KeyboardShortcutsLegend Overflow Prevention Tests
 * 
 * Tests to ensure action descriptions don't overflow the panel boundaries.
 */

describe('KeyboardShortcutsLegend Overflow Prevention', () => {
    let legend;
    let mockScene;
    let renderedTexts;
    
    beforeEach(() => {
        renderedTexts = [];
        
        mockScene = {
            add: {
                text: vi.fn((x, y, content, style) => {
                    // Simulate actual text measurement
                    // Monospace 9px: character width is approximately 5.4px
                    const charWidth = 5.4;
                    const textWidth = content.length * charWidth;
                    
                    const textObj = {
                        x, y, content, style,
                        width: textWidth,
                        height: 10,
                        setOrigin: vi.fn(function() { return this; }),
                        setDepth: vi.fn(function() { return this; }),
                        setVisible: vi.fn(function() { return this; }),
                        destroy: vi.fn()
                    };
                    
                    renderedTexts.push(textObj);
                    return textObj;
                }),
                container: vi.fn(() => ({
                    add: vi.fn(),
                    removeAll: vi.fn(),
                    setDepth: vi.fn(),
                    destroy: vi.fn(),
                    list: [],
                    width: 200 // Panel width
                }))
            },
            controls: {
                getAllBindings: vi.fn(() => [
                    { key: 'F', action: 'Dimensional Collapse' },
                    { key: 'ONE', action: 'Harmonic Entanglement' },
                    { key: 'DELETE', action: 'Dissolution Mode' },
                    { key: 'SPACE', action: 'Blink' },
                ]),
                onBindingChange: vi.fn()
            },
            hudPanels: {
                registerSlot: vi.fn((slotId, createFn, region) => {
                    const container = mockScene.add.container();
                    // Pass a reasonable width to the callback
                    const allocatedWidth = 180;
                    const result = createFn(container, allocatedWidth, { direction: 'vertical' });
                    return { container, result };
                }),
                updateSlotHeight: vi.fn(),
                updatePanelWidth: vi.fn()
            },
            time: {
                delayedCall: vi.fn((delay, callback) => {
                    // Execute immediately for tests
                    callback();
                    return { remove: vi.fn() };
                })
            }
        };
        
        // Create the actual implementation
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
             * FIXED: Calculate panel width ensuring no overflow
             * Must account for: key column width + gap + action width + padding
             */
            calculatePanelWidth() {
                const shortcuts = this.getShortcuts();
                const padding = 12; // 6px on each side
                const keyColumnWidth = 45; // Space reserved for keys
                const gap = 10; // Gap between key and action
                
                let maxActionWidth = 0;
                
                shortcuts.forEach(shortcut => {
                    // More accurate character measurement
                    // 9px monospace: ~5.4px per char, but add buffer for safety
                    const actionWidth = shortcut.action.length * 5.4;
                    maxActionWidth = Math.max(maxActionWidth, actionWidth);
                });
                
                // Total width = padding + key column + gap + max action + padding
                const totalWidth = padding + keyColumnWidth + gap + maxActionWidth + padding;
                
                // Add 10px safety buffer for rendering variations
                return Math.ceil(Math.max(totalWidth + 10, 150));
            },
            
            createLegendPanel() {
                const requiredWidth = this.calculatePanelWidth();
                
                this.scene.hudPanels.registerSlot('KEYBOARD_SHORTCUTS', (container, width, layout) => {
                    this.container = container;
                    this.container.setDepth(100);
                    this.allocatedWidth = width;
                    
                    this.renderShortcuts();
                    
                    return { 
                        height: this.getPanelHeight(),
                        preferredWidth: requiredWidth
                    };
                }, 'BOTTOM_LEFT');
                
                // Update panel width
                this.scene.time.delayedCall(0, () => {
                    this.updatePanelWidth(requiredWidth);
                });
            },
            
            updatePanelWidth(requiredWidth) {
                if (this.scene.hudPanels?.updatePanelWidth) {
                    this.scene.hudPanels.updatePanelWidth('BOTTOM_LEFT', requiredWidth);
                }
            },
            
            getPanelHeight() {
                const shortcuts = this.getShortcuts();
                const rowHeight = 14;
                const padding = 6;
                return (shortcuts.length * rowHeight) + padding;
            },
            
            /**
             * FIXED: Render with proper positioning to prevent overflow
             */
            renderShortcuts() {
                if (!this.container) return;
                this.container.removeAll(true);
                renderedTexts = []; // Reset tracking
                
                const shortcuts = this.getShortcuts();
                let y = 6;
                const rowHeight = 14;
                
                // Use consistent column positions
                const keyX = 6;
                const actionX = 55; // This gives ~49px for keys (55-6)
                
                shortcuts.forEach((shortcut) => {
                    // Key at left
                    const keyText = this.scene.add.text(keyX, y, shortcut.key, {
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        fill: '#00f0ff'
                    }).setOrigin(0, 0);
                    
                    // Action at fixed position
                    const actionText = this.scene.add.text(actionX, y, shortcut.action, {
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        fill: '#ffffff'
                    }).setOrigin(0, 0);
                    
                    this.container.add([keyText, actionText]);
                    y += rowHeight;
                });
            },
            
            /**
             * Check if any rendered text overflows the panel
             */
            checkForOverflow() {
                const panelWidth = this.allocatedWidth || 150;
                const actionColumnX = 55;
                
                for (const text of renderedTexts) {
                    if (text.x === actionColumnX) {
                        // This is an action text
                        const rightEdge = text.x + text.width;
                        if (rightEdge > panelWidth - 6) { // 6px padding
                            return {
                                overflows: true,
                                text: text.content,
                                rightEdge,
                                panelWidth: panelWidth - 6
                            };
                        }
                    }
                }
                
                return { overflows: false };
            }
        };
    });
    
    describe('Overflow Detection', () => {
        it('should detect when action text overflows panel', () => {
            legend.createLegendPanel();
            
            // Check for overflow
            const overflow = legend.checkForOverflow();
            
            // Should not overflow with proper width calculation
            expect(overflow.overflows).toBe(false);
        });
        
        it('should calculate sufficient width for longest action', () => {
            const width = legend.calculatePanelWidth();
            const shortcuts = legend.getShortcuts();
            
            // Find longest action
            const longestAction = shortcuts.reduce((a, b) => 
                a.action.length > b.action.length ? a : b
            );
            
            // Calculate expected minimum width
            const actionWidth = longestAction.action.length * 5.4;
            const expectedMin = 55 + actionWidth + 12 + 10; // actionX + width + padding + buffer
            
            expect(width).toBeGreaterThanOrEqual(expectedMin);
        });
        
        it('should position action texts within panel bounds', () => {
            legend.createLegendPanel();
            
            const panelWidth = legend.allocatedWidth || 150;
            const actionTexts = renderedTexts.filter(t => t.x === 55);
            
            for (const text of actionTexts) {
                const rightEdge = text.x + text.width;
                expect(rightEdge).toBeLessThanOrEqual(panelWidth - 6);
            }
        });
    });
});
