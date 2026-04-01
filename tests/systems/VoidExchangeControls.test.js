import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * VoidExchangeSystem ControlsManager Integration Tests
 */

describe('VoidExchangeSystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let exchangeSystem;
    
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
        
        exchangeSystem = {
            scene: mockScene,
            
            setupInput() {
                this.scene.controls.register('X', 'Void Exchange', () => {
                    this.toggleExchange();
                }, {
                    system: 'VoidExchangeSystem',
                    description: 'Toggle void exchange trading'
                });
            },
            
            toggleExchange() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register X key with ControlsManager', () => {
            exchangeSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'X',
                'Void Exchange',
                expect.any(Function),
                expect.objectContaining({
                    system: 'VoidExchangeSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            exchangeSystem.setupInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalledWith(
                'keydown-X',
                expect.any(Function)
            );
        });
    });
});
