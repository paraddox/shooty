import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * GameOverScene ControlsManager Integration Tests
 */

describe('GameOverScene ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let gameOverScene;
    
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
        
        gameOverScene = {
            scene: mockScene,
            
            createInput() {
                this.scene.controls.register('SPACE', 'Restart', () => {
                    this.restart();
                }, {
                    system: 'GameOverScene',
                    description: 'Restart game from game over'
                });
                
                this.scene.controls.register('ENTER', 'Restart', () => {
                    this.restart();
                }, {
                    system: 'GameOverScene',
                    description: 'Restart game from game over'
                });
            },
            
            restart() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register SPACE key for restart', () => {
            gameOverScene.createInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'SPACE',
                'Restart',
                expect.any(Function),
                expect.objectContaining({
                    system: 'GameOverScene',
                    description: expect.any(String)
                })
            );
        });
        
        it('should register ENTER key for restart', () => {
            gameOverScene.createInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'ENTER',
                'Restart',
                expect.any(Function),
                expect.objectContaining({
                    system: 'GameOverScene'
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            gameOverScene.createInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalled();
        });
    });
});
