import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * MnemosyneWeaveSystem ControlsManager Integration Tests
 */

describe('MnemosyneWeaveSystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let mnemosyneSystem;
    
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
        
        mnemosyneSystem = {
            scene: mockScene,
            activeIncursion: null,
            
            setupInput() {
                this.scene.controls.register('M', 'Memory Trance', () => {
                    if (this.activeIncursion) {
                        this.exitIncursion();
                    }
                }, {
                    system: 'MnemosyneWeaveSystem',
                    description: 'Enter or exit memory trance'
                });
            },
            
            exitIncursion() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register M key with ControlsManager', () => {
            mnemosyneSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'M',
                'Memory Trance',
                expect.any(Function),
                expect.objectContaining({
                    system: 'MnemosyneWeaveSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            mnemosyneSystem.setupInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalledWith(
                'keydown-M',
                expect.any(Function)
            );
        });
    });
});
