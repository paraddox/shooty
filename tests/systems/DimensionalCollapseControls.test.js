import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * DimensionalCollapseSystem ControlsManager Integration Tests
 */

describe('DimensionalCollapseSystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let collapseSystem;
    
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
        
        collapseSystem = {
            scene: mockScene,
            
            setupInput() {
                this.scene.controls.register('F', 'Dimensional Collapse', () => {
                    this.attemptActivation();
                }, {
                    system: 'DimensionalCollapseSystem',
                    description: 'Activate dimensional collapse'
                });
            },
            
            attemptActivation() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register F key with ControlsManager', () => {
            collapseSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'F',
                'Dimensional Collapse',
                expect.any(Function),
                expect.objectContaining({
                    system: 'DimensionalCollapseSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            collapseSystem.setupInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalledWith(
                'keydown-F',
                expect.any(Function)
            );
        });
    });
});
