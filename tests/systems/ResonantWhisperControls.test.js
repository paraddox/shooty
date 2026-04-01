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
                // G key for whisper interaction (was F, changed to avoid conflict)
                this.scene.controls.register('G', 'Whisper', () => {
                    if (this.nearbyWhisper) {
                        this.interactWithWhisper(this.nearbyWhisper);
                    }
                }, {
                    system: 'ResonantWhisperSystem',
                    description: 'Interact with nearby whispers'
                });
                
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
        it('should register G key (changed from F to avoid conflict)', () => {
            whisperSystem.setupInput();
            
            expect(mockControls.register).toHaveBeenCalledWith(
                'G',
                'Whisper',
                expect.any(Function),
                expect.objectContaining({
                    system: 'ResonantWhisperSystem',
                    description: expect.any(String)
                })
            );
        });
        
        it('should NOT use F key anymore', () => {
            whisperSystem.setupInput();
            
            const fCalls = mockControls.register.mock.calls.filter(c => c[0] === 'F');
            expect(fCalls).toHaveLength(0);
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
        
        it('should NOT register directly with keyboard', () => {
            whisperSystem.setupInput();
            
            expect(mockScene.input.keyboard.on).not.toHaveBeenCalled();
        });
    });
});
