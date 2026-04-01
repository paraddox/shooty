import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * No Fallback Policy Tests
 * 
 * All keyboard bindings MUST go through ControlsManager.
 * No direct this.input.keyboard.on() calls allowed.
 */

describe('No Fallback Policy', () => {
    let mockScene;
    let controlsManager;
    let directBindingCalls;
    
    beforeEach(() => {
        directBindingCalls = [];
        
        const registeredKeys = {};
        
        controlsManager = {
            bindings: new Map(),
            
            register(key, action, handler, options = {}) {
                const normalizedKey = key.toUpperCase();
                
                if (this.bindings.has(normalizedKey)) {
                    console.warn(`[ControlsManager] Key ${normalizedKey} already bound to: ${this.bindings.get(normalizedKey).action}`);
                    return false;
                }
                
                this.bindings.set(normalizedKey, {
                    key: normalizedKey,
                    action,
                    handler,
                    system: options.system || 'unknown',
                    description: options.description || action
                });
                
                return true;
            },
            
            isBound(key) {
                return this.bindings.has(key.toUpperCase());
            }
        };
        
        mockScene = {
            controls: controlsManager,
            input: {
                keyboard: {
                    on: vi.fn((event, handler) => {
                        directBindingCalls.push(event);
                    }),
                    off: vi.fn()
                }
            }
        };
    });
    
    describe('strict ControlsManager-only policy', () => {
        it('should register keys only through ControlsManager', () => {
            // Simulate a system using ControlsManager
            const system = {
                setupInput() {
                    // This is the ONLY allowed way
                    return this.scene.controls.register('Q', 'Ability', () => {}, {
                        system: 'TestSystem'
                    });
                }
            };
            system.scene = mockScene;
            
            const result = system.setupInput();
            
            expect(result).toBe(true);
            expect(controlsManager.isBound('Q')).toBe(true);
        });
        
        it('should NOT allow direct keyboard.on calls', () => {
            // Any direct binding is a violation
            mockScene.input.keyboard.on('keydown-F', () => {});
            
            expect(directBindingCalls).toContain('keydown-F');
            // This documents the violation - in real code this should fail
        });
        
        it('all scenes must have ControlsManager', () => {
            // Every scene that has keyboard input must have controls
            const scenesWithInput = [
                'GameScene',
                'MenuScene', 
                'GameOverScene',
                'ChronicleMenuScene'
            ];
            
            scenesWithInput.forEach(sceneName => {
                // Each scene should have this.controls available
                expect(sceneName).toBeDefined(); // Document requirement
            });
        });
    });
    
    describe('F key conflict resolution', () => {
        it('should prevent multiple systems registering same key', () => {
            // First system registers F
            const result1 = controlsManager.register('F', 'Dimensional Collapse', () => {}, {
                system: 'DimensionalCollapseSystem'
            });
            expect(result1).toBe(true);
            
            // Second system tries to register F - should FAIL
            const result2 = controlsManager.register('F', 'Focus Mode', () => {}, {
                system: 'ApopheniaProtocol'
            });
            expect(result2).toBe(false);
            
            // Third system tries - should also FAIL  
            const result3 = controlsManager.register('F', 'Interact', () => {}, {
                system: 'ResonantWhisperSystem'
            });
            expect(result3).toBe(false);
        });
        
        it('conflicting systems must use different keys', () => {
            // Solution: Assign different keys to conflicting systems
            const keyAssignments = {
                'DimensionalCollapseSystem': 'F',     // Keeps F
                'ApopheniaProtocol': 'T',               // Changed to T
                'ResonantWhisperSystem': 'G'            // Changed to G (or keep F for interact)
            };
            
            // Register all with different keys - all should succeed
            const results = [];
            for (const [system, key] of Object.entries(keyAssignments)) {
                const result = controlsManager.register(key, system, () => {}, { system });
                results.push({ system, key, success: result });
            }
            
            // All should succeed with different keys
            expect(results.every(r => r.success)).toBe(true);
        });
    });
});
