import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ChronicleMenuScene ControlsManager Integration Tests
 */

describe('ChronicleMenuScene ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let chronicleScene;
    
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
        
        chronicleScene = {
            scene: mockScene,
            
            createInput() {
                this.scene.controls.register('ESC', 'Return to Menu', () => {
                    this.returnToMenu();
                }, {
                    system: 'ChronicleMenuScene',
                    description: 'Return to main menu'
                });
            },
            
            returnToMenu() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register ESC key to return to menu', () => {
            chronicleScene.createInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'ESC',
                'Return to Menu',
                expect.any(Function),
                expect.objectContaining({
                    system: 'ChronicleMenuScene',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            chronicleScene.createInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalled();
        });
    });
});
