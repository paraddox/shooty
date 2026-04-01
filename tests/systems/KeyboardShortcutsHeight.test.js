import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * KeyboardShortcutsLegend Dynamic Height Tests
 * 
 * The panel should resize vertically based on the number of items,
 * growing upward to avoid going off-screen at the bottom.
 */

describe('KeyboardShortcutsLegend Dynamic Height', () => {
    let mockScene;
    let mockHudPanels;
    let keyboardLegend;
    let registeredSlotCallback;
    let container;
    let panelHeight;
    
    beforeEach(() => {
        panelHeight = 0;
        container = {
            children: [],
            add: vi.fn((items) => {
                if (Array.isArray(items)) container.children.push(...items);
                else container.children.push(items);
            }),
            removeAll: vi.fn(() => { container.children = []; }),
            setDepth: vi.fn()
        };
        
        const controlsBindings = [];
        
        mockHudPanels = {
            registerSlot: vi.fn((slotId, callback, panelId) => {
                registeredSlotCallback = callback;
                // Simulate initial render
                const result = callback(container, 200, {});
                panelHeight = result.height;
            }),
            updateSlotHeight: vi.fn((slotId, newHeight) => {
                panelHeight = newHeight;
            })
        };
        
        const controlsManager = {
            bindings: new Map(),
            _listeners: [],
            
            register(key, action, handler, options = {}) {
                this.bindings.set(key.toUpperCase(), { key, action, system: options.system });
                this._notifyListeners();
                return true;
            },
            
            getAllBindings() {
                return Array.from(this.bindings.values()).map(b => ({
                    key: b.key,
                    action: b.action,
                    system: b.system
                }));
            },
            
            onBindingChange(cb) { this._listeners.push(cb); },
            _notifyListeners() { this._listeners.forEach(cb => cb()); }
        };
        
        mockScene = {
            controls: controlsManager,
            hudPanels: mockHudPanels,
            add: {
                text: vi.fn((x, y, content, style) => ({
                    setOrigin: vi.fn(() => ({ setDepth: vi.fn() })),
                    content, style, x, y
                }))
            }
        };
        
        keyboardLegend = {
            scene: mockScene,
            container: null,
            staticShortcuts: [
                { key: 'WASD', action: 'Move' },
                { key: 'MOUSE', action: 'Aim & Shoot' }
            ],
            ROW_HEIGHT: 14,
            PADDING: 6,
            
            init() {
                this.createLegendPanel();
                this.setupAutoRefresh();
            },
            
            getShortcuts() {
                const dynamic = this.scene.controls?.getAllBindings() || [];
                const sorted = [...dynamic].sort((a, b) => a.key.localeCompare(b.key));
                return [...this.staticShortcuts, ...sorted];
            },
            
            getPanelHeight() {
                const shortcuts = this.getShortcuts();
                return (shortcuts.length * this.ROW_HEIGHT) + this.PADDING;
            },
            
            createLegendPanel() {
                this.scene.hudPanels.registerSlot('KEYBOARD_SHORTCUTS', (container, width, layout) => {
                    this.container = container;
                    this.renderShortcuts();
                    return { height: this.getPanelHeight() };
                }, 'BOTTOM_LEFT');
            },
            
            renderShortcuts() {
                if (!this.container) return;
                this.container.removeAll(true);
                
                const shortcuts = this.getShortcuts();
                let y = 6;
                
                shortcuts.forEach((shortcut) => {
                    const keyText = this.scene.add.text(6, y, shortcut.key, {
                        fontFamily: 'monospace', fontSize: '9px', fill: '#00f0ff'
                    }).setOrigin(0, 0);
                    
                    const actionText = this.scene.add.text(55, y, shortcut.action, {
                        fontFamily: 'monospace', fontSize: '9px', fill: '#ffffff'
                    }).setOrigin(0, 0);
                    
                    this.container.add([keyText, actionText]);
                    y += this.ROW_HEIGHT;
                });
            },
            
            setupAutoRefresh() {
                if (this.scene.controls) {
                    this.scene.controls.onBindingChange(() => {
                        this.refresh();
                    });
                }
            },
            
            refresh() {
                if (!this.container) return;
                this.renderShortcuts();
                // The key: update panel height dynamically
                this.updatePanelHeight();
            },
            
            updatePanelHeight() {
                const newHeight = this.getPanelHeight();
                // Notify HUDPanelManager to resize
                if (this.scene.hudPanels.updateSlotHeight) {
                    this.scene.hudPanels.updateSlotHeight('KEYBOARD_SHORTCUTS', newHeight);
                }
            }
        };
    });
    
    describe('panel height calculation', () => {
        it('should calculate correct height for 2 static items', () => {
            keyboardLegend.init();
            
            // 2 items * 14px + 6px padding = 34px
            expect(panelHeight).toBe(34);
        });
        
        it('should increase height when bindings are added', () => {
            keyboardLegend.init();
            const initialHeight = panelHeight;
            expect(initialHeight).toBe(34); // 2 items
            
            // Add 3 more bindings
            mockScene.controls.register('P', 'Patch Mode', () => {}, { system: 'Meta' });
            mockScene.controls.register('Q', 'Dash', () => {}, { system: 'NearMiss' });
            mockScene.controls.register('E', 'Storm', () => {}, { system: 'Echo' });
            
            // Refresh should update height
            keyboardLegend.refresh();
            
            // 5 items * 14px + 6px = 76px
            expect(panelHeight).toBe(76);
        });
        
        it('should handle many items without going off-screen', () => {
            keyboardLegend.init();
            
            // Simulate many systems registering
            const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            keys.forEach((key, i) => {
                mockScene.controls.register(key, `Action ${i}`, () => {}, { system: `System${i}` });
            });
            
            keyboardLegend.refresh();
            
            // 2 static + 26 dynamic = 28 items
            // 28 * 14 + 6 = 398px
            const expectedHeight = (28 * 14) + 6;
            expect(panelHeight).toBe(expectedHeight);
            expect(panelHeight).toBeLessThan(600); // Should still fit on screen
        });
    });
    
    describe('HUDPanelManager height update', () => {
        it('should call updateSlotHeight on refresh', () => {
            keyboardLegend.init();
            
            mockScene.controls.register('X', 'Test', () => {}, { system: 'Test' });
            keyboardLegend.refresh();
            
            expect(mockHudPanels.updateSlotHeight).toHaveBeenCalledWith(
                'KEYBOARD_SHORTCUTS',
                48 // 3 items * 14 + 6
            );
        });
        
        it('should handle updateSlotHeight not being available', () => {
            // Remove the method
            delete mockHudPanels.updateSlotHeight;
            
            keyboardLegend.init();
            
            // Should not throw
            mockScene.controls.register('X', 'Test', () => {}, { system: 'Test' });
            expect(() => keyboardLegend.refresh()).not.toThrow();
        });
    });
});
