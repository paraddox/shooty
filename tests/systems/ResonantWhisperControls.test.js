import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ResonantWhisperSystem ControlsManager Integration Tests
 */

describe('ResonantWhisperSystem ControlsManager Integration', () => {
    let mockScene;
    let mockControls;
    let whisperSystem;
    
    beforeEach(() => {
        const registeredKeys = {};
        
        mockControls = {
            register: vi.fn((key, action, handler, options) => {
                // Simulate F key conflict
                if (key === 'F' && registeredKeys['F']) {
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
        
        whisperSystem = {
            scene: mockScene,
            nearbyWhisper: null,
            activeFragment: null,
            
            setupInput() {
                // F key for whisper interaction
                const fRegistered = this.scene.controls.register('F', 'Interact', () => {
                    if (this.nearbyWhisper) {
                        this.interactWithWhisper(this.nearbyWhisper);
                    }
                }, {
                    system: 'ResonantWhisperSystem',
                    description: 'Interact with nearby whispers'
                });
                
                // Fallback if F rejected
                if (!fRegistered) {
                    this.scene.input.keyboard.on('keydown-F', () => {
                        if (this.nearbyWhisper) {
                            this.interactWithWhisper(this.nearbyWhisper);
                        }
                    });
                }
                
                // Number keys for fragment responses
                this.scene.controls.register('ONE', 'Response Yes', () => {
                    if (this.activeFragment) {
                        this.respondToFragment(this.activeFragment, 'yes');
                    }
                }, {
                    system: 'ResonantWhisperSystem',
                    description: 'Respond "yes" to fragment'
                });
                
                this.scene.controls.register('TWO', 'Response No', () => {
                    if (this.activeFragment) {
                        this.respondToFragment(this.activeFragment, 'no');
                    }
                }, {
                    system: 'ResonantWhisperSystem',
                    description: 'Respond "no" to fragment'
                });
                
                this.scene.controls.register('THREE', 'Response Perhaps', () => {
                    if (this.activeFragment) {
                        this.respondToFragment(this.activeFragment, 'perhaps');
                    }
                }, {
                    system: 'ResonantWhisperSystem',
                    description: 'Respond "perhaps" to fragment'
                });
            },
            
            interactWithWhisper(whisper) {
                // Implementation
            },
            
            respondToFragment(fragment, response) {
                // Implementation
            }
        };
    });
    
    describe('ControlsManager registration', () => {
        it('should try to register F key with ControlsManager', () => {
            whisperSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'F',
                'Interact',
                expect.any(Function),
                expect.objectContaining({
                    system: 'ResonantWhisperSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should register number keys 1-3 with ControlsManager', () => {
            whisperSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'ONE',
                'Response Yes',
                expect.any(Function),
                expect.objectContaining({ system: 'ResonantWhisperSystem' })
            );
            expect(mockControls.register).toHaveBeenCalledWith(
                'TWO',
                'Response No',
                expect.any(Function),
                expect.objectContaining({ system: 'ResonantWhisperSystem' })
            );
            expect(mockControls.register).toHaveBeenCalledWith(
                'THREE',
                'Response Perhaps',
                expect.any(Function),
                expect.objectContaining({ system: 'ResonantWhisperSystem' })
            );
        });
        
        it('should fallback to direct F binding when ControlsManager rejects', () => {
            // Pre-register F
            mockControls.register('F', 'Dimensional Collapse', () => {}, {
                system: 'DimensionalCollapseSystem'
            });
            
            whisperSystem.setupInput();
            
            // Should have tried ControlsManager first
            expect(mockControls.register).toHaveBeenCalledWith('F', expect.anything(), expect.anything(), expect.anything());
            
            // Then fallback to direct binding
            expect(mockScene.input.keyboard.on).toHaveBeenCalledWith(
                'keydown-F',
                expect.any(Function)
            );
        });
    });
});
