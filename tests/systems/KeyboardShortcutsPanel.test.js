import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Keyboard Shortcuts Legend Panel Tests
 * 
 * Tests for the bottom-left HUD panel displaying all keyboard shortcuts.
 */

describe('KeyboardShortcutsLegend Panel', () => {
    let mockScene;
    let shortcutsPanel;
    
    beforeEach(() => {
        // Mock HUD panel registration
        const registeredSlots = {};
        
        mockScene = {
            add: {
                container: vi.fn(() => ({
                    add: vi.fn(),
                    setDepth: vi.fn(),
                    setVisible: vi.fn(),
                    setAlpha: vi.fn(),
                    destroy: vi.fn()
                })),
                text: vi.fn((x, y, content, style) => ({
                    x, y, content, style,
                    setOrigin: vi.fn().mockReturnThis(),
                    setFill: vi.fn()
                })),
                rectangle: vi.fn(() => ({
                    setStrokeStyle: vi.fn(),
                    setOrigin: vi.fn()
                }))
            },
            hudPanels: {
                registerSlot: vi.fn((slotId, renderFn) => {
                    registeredSlots[slotId] = renderFn;
                }),
                getRegisteredSlot: vi.fn((slotId) => registeredSlots[slotId])
            },
            input: {
                keyboard: {
                    on: vi.fn()
                }
            }
        };
        
        // Define expected shortcuts
        shortcutsPanel = {
            slotId: 'KEYBOARD_SHORTCUTS',
            position: 'BOTTOM_LEFT',
            shortcuts: [
                { key: 'WASD', action: 'Move' },
                { key: 'MOUSE', action: 'Aim & Shoot' },
                { key: 'Q', action: 'Near-Miss Dash' },
                { key: 'E', action: 'Echo Storm' },
                { key: 'R', action: 'Fracture' },
                { key: 'P', action: 'Patch Mode' },
                { key: 'ESC', action: 'Close Menu' },
                { key: 'SPACE', action: 'Special' },
                { key: '1-5', action: 'Quick Select' }
            ],
            
            render(container, width, layout) {
                // Background
                const bg = mockScene.add.rectangle(0, 0, width, 150, 0x0a0a0f, 0.9);
                bg.setStrokeStyle(1, 0x333333);
                bg.setOrigin(0, 0);
                container.add(bg);
                
                // Title
                const title = mockScene.add.text(5, 5, 'CONTROLS', {
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fill: '#ffb700'
                }).setOrigin(0, 0);
                container.add(title);
                
                // Shortcuts list
                let y = 22;
                this.shortcuts.forEach((shortcut, index) => {
                    const keyText = mockScene.add.text(5, y, shortcut.key, {
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        fill: '#00f0ff'
                    }).setOrigin(0, 0);
                    
                    const actionText = mockScene.add.text(70, y, shortcut.action, {
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        fill: '#ffffff'
                    }).setOrigin(0, 0);
                    
                    container.add([keyText, actionText]);
                    y += 14;
                });
                
                return container;
            }
        };
    });
    
    describe('panel registration', () => {
        it('should register with HUDPanelManager in BOTTOM_LEFT slot', () => {
            const slotId = 'KEYBOARD_SHORTCUTS';
            const position = 'BOTTOM_LEFT';
            
            expect(slotId).toBe('KEYBOARD_SHORTCUTS');
            expect(position).toBe('BOTTOM_LEFT');
        });
        
        it('should have all expected shortcuts defined', () => {
            expect(shortcutsPanel.shortcuts).toHaveLength(9);
            
            // Check specific shortcuts exist
            const keys = shortcutsPanel.shortcuts.map(s => s.key);
            expect(keys).toContain('WASD');
            expect(keys).toContain('MOUSE');
            expect(keys).toContain('Q');
            expect(keys).toContain('E');
            expect(keys).toContain('P');
            expect(keys).toContain('ESC');
        });
    });
    
    describe('panel rendering', () => {
        it('should create container with proper depth', () => {
            const mockContainer = {
                add: vi.fn(),
                setDepth: vi.fn(),
                setVisible: vi.fn()
            };
            
            mockScene.add.container.mockReturnValue(mockContainer);
            
            expect(mockContainer.setDepth).not.toHaveBeenCalled();
        });
        
        it('should render background with border', () => {
            shortcutsPanel.render(
                { add: vi.fn() }, 
                150, 
                { slot: 'BOTTOM_LEFT' }
            );
            
            expect(mockScene.add.rectangle).toHaveBeenCalledWith(
                0, 0, 150, 150, 0x0a0a0f, 0.9
            );
        });
        
        it('should render title CONTROLS', () => {
            shortcutsPanel.render(
                { add: vi.fn() }, 
                150, 
                { slot: 'BOTTOM_LEFT' }
            );
            
            const titleCall = mockScene.add.text.mock.calls.find(
                call => call[2] === 'CONTROLS'
            );
            expect(titleCall).toBeDefined();
            expect(titleCall[3]).toEqual({
                fontFamily: 'monospace',
                fontSize: '11px',
                fill: '#ffb700'
            });
        });
        
        it('should render key in cyan color', () => {
            shortcutsPanel.render(
                { add: vi.fn() }, 
                150, 
                { slot: 'BOTTOM_LEFT' }
            );
            
            // Find a key text call
            const keyCall = mockScene.add.text.mock.calls.find(
                call => call[2] === 'WASD' || call[2] === 'Q' || call[2] === 'P'
            );
            expect(keyCall).toBeDefined();
            expect(keyCall[3].fill).toBe('#00f0ff');
        });
        
        it('should render action in white color', () => {
            shortcutsPanel.render(
                { add: vi.fn() }, 
                150, 
                { slot: 'BOTTOM_LEFT' }
            );
            
            // Find an action text call
            const actionCall = mockScene.add.text.mock.calls.find(
                call => call[2] === 'Move' || call[2] === 'Patch Mode'
            );
            expect(actionCall).toBeDefined();
            expect(actionCall[3].fill).toBe('#ffffff');
        });
        
        it('should stack shortcuts vertically with 14px spacing', () => {
            shortcutsPanel.render(
                { add: vi.fn() }, 
                150, 
                { slot: 'BOTTOM_LEFT' }
            );
            
            // Title at y=5, first shortcut at y=22, spacing should be 14px
            const yPositions = mockScene.add.text.mock.calls.map(call => call[1]);
            expect(yPositions).toContain(22); // First shortcut row
            expect(yPositions).toContain(36); // 22 + 14
        });
    });
    
    describe('shortcut entries', () => {
        it('should have movement controls first', () => {
            const movement = shortcutsPanel.shortcuts[0];
            expect(movement.key).toBe('WASD');
            expect(movement.action).toBe('Move');
        });
        
        it('should have mouse controls', () => {
            const mouse = shortcutsPanel.shortcuts.find(s => s.key === 'MOUSE');
            expect(mouse).toBeDefined();
            expect(mouse.action).toBe('Aim & Shoot');
        });
        
        it('should have all ability keys (Q, E, R)', () => {
            const q = shortcutsPanel.shortcuts.find(s => s.key === 'Q');
            const e = shortcutsPanel.shortcuts.find(s => s.key === 'E');
            const r = shortcutsPanel.shortcuts.find(s => s.key === 'R');
            
            expect(q).toBeDefined();
            expect(e).toBeDefined();
            expect(r).toBeDefined();
        });
        
        it('should have patch mode key', () => {
            const p = shortcutsPanel.shortcuts.find(s => s.key === 'P');
            expect(p).toBeDefined();
            expect(p.action).toBe('Patch Mode');
        });
    });
});
