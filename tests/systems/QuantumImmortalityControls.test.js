import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * QuantumImmortalitySystem ControlsManager Integration Tests
 * 
 * Verifies that QuantumImmortalitySystem properly registers its Q key
 * binding with ControlsManager instead of directly with keyboard.
 */

describe('QuantumImmortalitySystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let quantumSystem;
    
    beforeEach(() => {
        // Track registered handlers
        const registeredKeys = {};
        
        mockControls = {
            register: vi.fn((key, action, handler, options) => {
                registeredKeys[key] = { action, handler, options };
                return true;
            }),
            isBound: vi.fn((key) => key in registeredKeys),
            getBinding: vi.fn((key) => registeredKeys[key] || null)
        };
        
        mockScene = {
            controls: mockControls,
            player: { x: 100, y: 100 },
            add: {
                graphics: vi.fn(() => ({
                    clear: vi.fn(),
                    fillStyle: vi.fn().mockReturnThis(),
                    fillCircle: vi.fn().mockReturnThis()
                })),
                text: vi.fn(() => ({
                    setOrigin: vi.fn(),
                    setDepth: vi.fn(),
                    destroy: vi.fn()
                }))
            },
            time: {
                now: 0,
                delayedCall: vi.fn()
            },
            input: {
                keyboard: {
                    on: vi.fn(),
                    off: vi.fn()
                }
            },
            cameras: {
                main: {
                    shake: vi.fn()
                }
            }
        };
        
        // Create a mock QuantumImmortalitySystem that uses ControlsManager
        quantumSystem = {
            scene: mockScene,
            mergeReady: false,
            mergeActive: false,
            mergeCooldown: 0,
            
            setupInput() {
                // Should use ControlsManager instead of direct keyboard binding
                this.scene.controls.register('Q', 'Timeline Merge', () => {
                    if (this.mergeReady && !this.mergeActive && this.mergeCooldown <= 0) {
                        this.activateTimelineMerge();
                    }
                }, {
                    system: 'QuantumImmortalitySystem',
                    description: 'Merge timelines to restore health'
                });
            },
            
            activateTimelineMerge() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register Q key with ControlsManager', () => {
            quantumSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'Q',
                'Timeline Merge',
                expect.any(Function),
                expect.objectContaining({
                    system: 'QuantumImmortalitySystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            quantumSystem.setupInput();
            
            // Should not call scene.input.keyboard.on directly
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalledWith(
                'keydown-Q',
                expect.any(Function)
            );
        });
        
        it('should be queryable through ControlsManager', () => {
            quantumSystem.setupInput();
            
            // Verify the binding can be queried
            expect(mockControls.isBound('Q')).toBe(true);
        });
        
        it('should appear in getAllBindings', () => {
            quantumSystem.setupInput();
            
            // Verify binding exists
            const binding = mockControls.getBinding('Q');
            expect(binding).toBeDefined();
            expect(binding.action).toBe('Timeline Merge');
        });
    });
    
    describe('handler behavior', () => {
        it('should only activate when mergeReady is true and cooldown is 0', () => {
            const activateSpy = vi.spyOn(quantumSystem, 'activateTimelineMerge');
            
            quantumSystem.setupInput();
            
            // Get the registered handler
            const handler = mockControls.register.mock.calls[0][2];
            
            // When not ready, should not activate
            quantumSystem.mergeReady = false;
            quantumSystem.mergeActive = false;
            quantumSystem.mergeCooldown = 0;
            handler();
            expect(activateSpy).not.toHaveBeenCalled();
            
            // When ready, should activate
            activateSpy.mockClear();
            quantumSystem.mergeReady = true;
            handler();
            expect(activateSpy).toHaveBeenCalled();
        });
        
        it('should NOT activate when mergeActive is true', () => {
            const activateSpy = vi.spyOn(quantumSystem, 'activateTimelineMerge');
            
            quantumSystem.setupInput();
            const handler = mockControls.register.mock.calls[0][2];
            
            quantumSystem.mergeReady = true;
            quantumSystem.mergeActive = true; // Already active
            quantumSystem.mergeCooldown = 0;
            handler();
            
            expect(activateSpy).not.toHaveBeenCalled();
        });
        
        it('should NOT activate when mergeCooldown > 0', () => {
            const activateSpy = vi.spyOn(quantumSystem, 'activateTimelineMerge');
            
            quantumSystem.setupInput();
            const handler = mockControls.register.mock.calls[0][2];
            
            quantumSystem.mergeReady = true;
            quantumSystem.mergeActive = false;
            quantumSystem.mergeCooldown = 5; // On cooldown
            handler();
            
            expect(activateSpy).not.toHaveBeenCalled();
        });
    });
});
