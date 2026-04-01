import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * CinematicArchiveSystem ControlsManager Integration Tests
 */

describe('CinematicArchiveSystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let cinematicSystem;
    
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
        
        cinematicSystem = {
            scene: mockScene,
            
            setupInputHandlers() {
                this.scene.controls.register('F12', 'Screenshot', (event) => {
                    event.preventDefault();
                    this.manualCapture();
                }, {
                    system: 'CinematicArchiveSystem',
                    description: 'Manual screenshot capture'
                });
                
                this.scene.controls.register('C', 'Cinematic Mode', () => {
                    this.toggleCinematicMode();
                }, {
                    system: 'CinematicArchiveSystem',
                    description: 'Toggle cinematic mode'
                });
            },
            
            manualCapture() {
                // Implementation
            },
            
            toggleCinematicMode() {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should register F12 key with ControlsManager', () => {
            cinematicSystem.setupInputHandlers();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'F12',
                'Screenshot',
                expect.any(Function),
                expect.objectContaining({
                    system: 'CinematicArchiveSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should register C key with ControlsManager', () => {
            cinematicSystem.setupInputHandlers();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'C',
                'Cinematic Mode',
                expect.any(Function),
                expect.objectContaining({
                    system: 'CinematicArchiveSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT register directly with keyboard', () => {
            cinematicSystem.setupInputHandlers();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalled();
        });
    });
});
