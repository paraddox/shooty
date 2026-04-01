import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * KeyboardShortcutsLegend Dynamic Update Tests
 * 
 * The legend should update when new bindings are registered
 * with ControlsManager after initial creation.
 */

describe('KeyboardShortcutsLegend Dynamic Updates', () => {
    let mockScene;
    let keyboardLegend;
    let controlsManager;
    let registeredBindings;
    let slotCallback;
    let container;
    
    beforeEach(() => {
        registeredBindings = [];
        container = {
            children: [],
            add: vi.fn((items) => {
                if (Array.isArray(items)) {
                    container.children.push(...items);
                } else {
                    container.children.push(items);
                }
            }),
            setDepth: vi.fn()
        };
        
        // ControlsManager that accumulates bindings
        controlsManager = {
            bindings: new Map(),
            
            register(key, action, handler, options = {}) {
                const normalizedKey = key.toUpperCase();
                
                if (this.bindings.has(normalizedKey)) {
                    console.warn(`[ControlsManager] Key ${normalizedKey} already bound`);
                    return false;
                }
                
                this.bindings.set(normalizedKey, {
                    key: normalizedKey,
                    action,
                    handler,
                    system: options.system || 'unknown',
                    description: options.description || action
                });
                
                // Notify listeners
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
            
            _listeners: [],
            
            onBindingChange(callback) {
                this._listeners.push(callback);
            },
            
            _notifyListeners() {
                this._listeners.forEach(cb => cb());
            }
        };
        
        mockScene = {
            controls: controlsManager,
            hudPanels: {
                registerSlot: vi.fn((slotId, callback, panelId) => {
                    slotCallback = callback;
                })
            },
            add: {
                text: vi.fn((x, y, content, style) => ({
                    setOrigin: vi.fn(() => ({ setDepth: vi.fn() })),
                    content,
                    style
                }))
            }
        };
        
        // Create KeyboardShortcutsLegend
        keyboardLegend = {
            scene: mockScene,
            container: null,
            staticShortcuts: [
                { key: 'WASD', action: 'Move' },
                { key: 'MOUSE', action: 'Aim & Shoot' }
            ],
            
            init() {
                this.createLegendPanel();
            },
            
            getShortcuts() {
                const dynamicBindings = this.scene.controls?.getAllBindings() || [];
                const sortedDynamic = [...dynamicBindings].sort((a, b) => a.key.localeCompare(b.key));
                return [...this.staticShortcuts, ...sortedDynamic];
            },
            
            createLegendPanel() {
                this.scene.hudPanels.registerSlot('KEYBOARD_SHORTCUTS', (container, width, layout) => {
                    this.container = container;
                    this.renderShortcuts();
                    return { height: this.getShortcuts().length * 14 + 6 };
                }, 'BOTTOM_LEFT');
            },
            
            renderShortcuts() {
                if (!this.container) return;
                
                // Clear existing
                this.container.children.length = 0;
                
                const shortcuts = this.getShortcuts();
                let y = 6;
                shortcuts.forEach((shortcut) => {
                    const keyText = this.scene.add.text(6, y, shortcut.key, {
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        fill: '#00f0ff'
                    }).setOrigin(0, 0);
                    
                    const actionText = this.scene.add.text(55, y, shortcut.action, {
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        fill: '#ffffff'
                    }).setOrigin(0, 0);
                    
                    this.container.add([keyText, actionText]);
                    y += 14;
                });
            },
            
            refresh() {
                this.renderShortcuts();
            }
        };
    });
    
    describe('dynamic binding updates', () => {
        it('should show only static shortcuts initially', () => {
            keyboardLegend.init();
            
            // Simulate the slot callback being triggered
            slotCallback(container, 200, {});
            
            const shortcuts = keyboardLegend.getShortcuts();
            expect(shortcuts).toHaveLength(2);  // Only WASD and MOUSE
            expect(shortcuts.map(s => s.key)).toContain('WASD');
            expect(shortcuts.map(s => s.key)).toContain('MOUSE');
        });
        
        it('should include new bindings after systems register', () => {
            keyboardLegend.init();
            slotCallback(container, 200, {});
            
            // Simulate systems registering their keys
            controlsManager.register('P', 'Patch Mode', () => {}, { system: 'MetaSystemOperator' });
            controlsManager.register('Q', 'Timeline Merge', () => {}, { system: 'QuantumImmortalitySystem' });
            controlsManager.register('SPACE', 'Blink', () => {}, { system: 'ApertureProtocolSystem' });
            
            // Refresh the legend
            keyboardLegend.refresh();
            
            const shortcuts = keyboardLegend.getShortcuts();
            expect(shortcuts).toHaveLength(5);  // 2 static + 3 dynamic
            expect(shortcuts.map(s => s.key)).toContain('P');
            expect(shortcuts.map(s => s.key)).toContain('Q');
            expect(shortcuts.map(s => s.key)).toContain('SPACE');
        });
        
        it('should automatically refresh when ControlsManager notifies', () => {
            keyboardLegend.init();
            slotCallback(container, 200, {});
            
            // Set up auto-refresh on binding change
            controlsManager.onBindingChange(() => {
                keyboardLegend.refresh();
            });
            
            // Register a key - should trigger refresh
            controlsManager.register('M', 'Memory Trance', () => {}, { system: 'MnemosyneWeaveSystem' });
            
            const shortcuts = keyboardLegend.getShortcuts();
            expect(shortcuts).toHaveLength(3);  // 2 static + M
            expect(shortcuts.map(s => s.key)).toContain('M');
        });
        
        it('should sort dynamic bindings alphabetically', () => {
            keyboardLegend.init();
            slotCallback(container, 200, {});
            
            // Register in non-alphabetical order
            controlsManager.register('Z', 'Zulu', () => {}, { system: 'Test' });
            controlsManager.register('A', 'Alpha', () => {}, { system: 'Test' });
            controlsManager.register('M', 'Mike', () => {}, { system: 'Test' });
            
            const shortcuts = keyboardLegend.getShortcuts();
            const dynamicKeys = shortcuts.filter(s => !['WASD', 'MOUSE'].includes(s.key)).map(s => s.key);
            
            expect(dynamicKeys).toEqual(['A', 'M', 'Z']);
        });
    });
});
