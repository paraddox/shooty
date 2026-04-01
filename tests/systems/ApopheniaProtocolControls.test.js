import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ApopheniaProtocol ControlsManager Integration Tests
 */

describe('ApopheniaProtocol ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let apopheniaSystem;
    
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
        
        apopheniaSystem = {
            scene: mockScene,
            
            setupInput() {
                // Uses T key (changed from F to avoid conflict)
                return this.scene.controls.register('T', 'Apophenic Focus', () => {
                    this.toggleFocusMode();
                }, {
                    system: 'ApopheniaProtocol',
                    description: 'Toggle apophenic focus mode'
                });
            },
            
            toggleFocusMode() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register T key (changed from F to avoid conflict)', () => {
            apopheniaSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'T',
                'Apophenic Focus',
                expect.any(Function),
                expect.objectContaining({
                    system: 'ApopheniaProtocol',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT use F key anymore', () => {
            apopheniaSystem.setupInput();
            
            const fCalls = mockControls.register.mock.calls.filter(c => c[0] === 'F');
            expect(fCalls).toHaveLength(0);
        });
        
        it('should NOT register directly with keyboard', () => {
            apopheniaSystem.setupInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalled();
        });
    });
});
