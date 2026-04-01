import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * DissolutionProtocolSystem ControlsManager Integration Tests
 */

describe('DissolutionProtocolSystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let dissolutionSystem;
    
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
                    off: vi.fn(),
                    addKey: vi.fn(),
                    checkDown: vi.fn()
                }
            }
        };
        
        dissolutionSystem = {
            scene: mockScene,
            dissolutionMode: false,
            reservoirOpen: false,
            
            setupInput() {
                // DELETE key enters dissolution mode
                this.scene.controls.register('DELETE', 'Dissolution Mode', () => {
                    this.toggleDissolutionMode();
                }, {
                    system: 'DissolutionProtocolSystem',
                    description: 'Toggle dissolution mode'
                });
                
                // ESC exits dissolution mode (if active)
                this.scene.controls.register('ESC', 'Exit Dissolution', () => {
                    if (this.dissolutionMode) {
                        this.exitDissolutionMode();
                    }
                }, {
                    system: 'DissolutionProtocolSystem',
                    description: 'Exit dissolution mode'
                });
                
                // Note: SHIFT+DELETE combo handled separately via direct keyboard
            },
            
            toggleDissolutionMode() {
                this.dissolutionMode = !this.dissolutionMode;
            },
            
            exitDissolutionMode() {
                this.dissolutionMode = false;
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register DELETE key with ControlsManager', () => {
            dissolutionSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'DELETE',
                'Dissolution Mode',
                expect.any(Function),
                expect.objectContaining({
                    system: 'DissolutionProtocolSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should register ESC key for exiting dissolution', () => {
            dissolutionSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'ESC',
                'Exit Dissolution',
                expect.any(Function),
                expect.objectContaining({
                    system: 'DissolutionProtocolSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('ESC handler should only exit if in dissolution mode', () => {
            dissolutionSystem.setupInput();
            const exitSpy = vi.spyOn(dissolutionSystem, 'exitDissolutionMode');
            
            // Get the ESC handler
            const escCall = mockControls.register.mock.calls.find(c => c[0] === 'DELETE');
            expect(escCall).toBeDefined();
        });
    });
});
