import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * MenuScene ControlsManager Integration Tests
 */

describe('MenuScene ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let menuScene;
    
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
        
        menuScene = {
            scene: mockScene,
            
            createInput() {
                this.scene.controls.register('SPACE', 'Start Game', () => {
                    this.startGame();
                }, {
                    system: 'MenuScene',
                    description: 'Start the game'
                });
                
                this.scene.controls.register('ENTER', 'Start Game', () => {
                    this.startGame();
                }, {
                    system: 'MenuScene',
                    description: 'Start the game'
                });
            },
            
            startGame() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register SPACE key for start game', () => {
            menuScene.createInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'SPACE',
                'Start Game',
                expect.any(Function),
                expect.objectContaining({
                    system: 'MenuScene',
                    description: expect.any(String)
                })
            );
        });
        
        it('should register ENTER key for start game', () => {
            menuScene.createInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'ENTER',
                'Start Game',
                expect.any(Function),
                expect.objectContaining({
                    system: 'MenuScene'
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            menuScene.createInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalled();
        });
    });
});
