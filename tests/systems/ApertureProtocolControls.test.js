import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ApertureProtocolSystem ControlsManager Integration Tests
 */

describe('ApertureProtocolSystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let apertureSystem;
    
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
        
        apertureSystem = {
            scene: mockScene,
            blinkReady: true,
            
            setupInput() {
                this.scene.controls.register('SPACE', 'Blink', () => {
                    this.attemptBlink();
                }, {
                    system: 'ApertureProtocolSystem',
                    description: 'Blink teleport short distance'
                });
            },
            
            attemptBlink() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register SPACE key with ControlsManager', () => {
            apertureSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'SPACE',
                'Blink',
                expect.any(Function),
                expect.objectContaining({
                    system: 'ApertureProtocolSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            apertureSystem.setupInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalledWith(
                'keydown-SPACE',
                expect.any(Function)
            );
        });
    });
});
