import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * VoidCoherenceSystem ControlsManager Integration Tests
 */

describe('VoidCoherenceSystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let voidSystem;
    
    beforeEach(() => {
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
            input: {
                keyboard: {
                    on: vi.fn(),
                    off: vi.fn()
                }
            }
        };
        
        voidSystem = {
            scene: mockScene,
            resonanceReady: false,
            resonanceActive: false,
            resonanceCooldown: 0,
            
            setupInput() {
                this.scene.controls.register('V', 'Void Resonance', () => {
                    if (this.resonanceReady && !this.resonanceActive && this.resonanceCooldown <= 0) {
                        this.activateResonance();
                    }
                }, {
                    system: 'VoidCoherenceSystem',
                    description: 'Activate void resonance field'
                });
            },
            
            activateResonance() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register V key with ControlsManager', () => {
            voidSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'V',
                'Void Resonance',
                expect.any(Function),
                expect.objectContaining({
                    system: 'VoidCoherenceSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            voidSystem.setupInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalledWith(
                'keydown-V',
                expect.any(Function)
            );
        });
        
        it('should be queryable through ControlsManager', () => {
            voidSystem.setupInput();
            expect(mockControls.isBound('V')).toBe(true);
        });
    });
    
    describe('handler behavior', () => {
        it('should only activate when conditions are met', () => {
            const activateSpy = vi.spyOn(voidSystem, 'activateResonance');
            
            voidSystem.setupInput();
            const handler = mockControls.register.mock.calls[0][2];
            
            // Not ready
            voidSystem.resonanceReady = false;
            voidSystem.resonanceActive = false;
            voidSystem.resonanceCooldown = 0;
            handler();
            expect(activateSpy).not.toHaveBeenCalled();
            
            // Ready now
            voidSystem.resonanceReady = true;
            handler();
            expect(activateSpy).toHaveBeenCalled();
        });
    });
});
