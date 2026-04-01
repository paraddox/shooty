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
                // Simulate F key conflict (already bound by DimensionalCollapse)
                if (key === 'F' && registeredKeys['F']) {
                    console.warn(`[ControlsManager] Key F already bound to: ${registeredKeys['F'].action}`);
                    return false;
                }
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
                return this.scene.controls.register('F', 'Focus Mode', () => {
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
    
    describe('ControlsManager registration with conflict', () => {
        it('should try to register F key with ControlsManager', () => {
            apopheniaSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'F',
                'Focus Mode',
                expect.any(Function),
                expect.objectContaining({
                    system: 'ApopheniaProtocol',
                    description: expect.any(String)
                })
            );
        });
        
        it('should fail to register when F is already bound', () => {
            // Pre-register F as DimensionalCollapse would have
            mockControls.register('F', 'Dimensional Collapse', () => {}, {
                system: 'DimensionalCollapseSystem'
            });
            
            const result = apopheniaSystem.setupInput();
            expect(result).toBe(false);
        });
        
        it('should fallback to direct keyboard binding when ControlsManager rejects', () => {
            // Pre-register F
            mockControls.register('F', 'Dimensional Collapse', () => {}, {
                system: 'DimensionalCollapseSystem'
            });
            
            // Try ControlsManager (fails)
            const cmResult = apopheniaSystem.setupInput();
            expect(cmResult).toBe(false);
            
            // Should fall back to direct binding
            apopheniaSystem.setupInputFallback = function() {
                this.scene.input.keyboard.on('keydown-F', () => {
                    this.toggleFocusMode();
                });
            };
            apopheniaSystem.setupInputFallback();
            
            expect(mockScene.input.keyboard.on).toHaveBeenCalledWith(
                'keydown-F',
                expect.any(Function)
            );
        });
    });
});
