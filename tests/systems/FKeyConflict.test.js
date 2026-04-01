import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * F Key Conflict Resolution Tests
 * 
 * Three systems compete for F key:
 * - DimensionalCollapseSystem: "Dimensional Collapse"
 * - ApopheniaProtocol: "Focus Mode"  
 * - ResonantWhisperSystem: "Interact with Whispers"
 * 
 * ControlsManager should handle this gracefully.
 */

describe('F Key Conflict Resolution', () => {
    let mockScene;
    let controlsManager;
    
    beforeEach(() => {
        const registeredKeys = {};
        
        controlsManager = {
            bindings: new Map(),
            
            register(key, action, handler, options = {}) {
                const normalizedKey = key.toUpperCase();
                
                if (this.bindings.has(normalizedKey)) {
                    const existing = this.bindings.get(normalizedKey);
                    console.warn(`[ControlsManager] Key ${normalizedKey} already bound to: ${existing.action} by ${existing.system}`);
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
            
            getBinding(key) {
                return this.bindings.get(key.toUpperCase()) || null;
            },
            
            isBound(key) {
                return this.bindings.has(key.toUpperCase());
            }
        };
        
        mockScene = {
            controls: controlsManager
        };
    });
    
    describe('F key conflict handling', () => {
        it('should allow first system to register F key', () => {
            const dimCollapse = {
                scene: mockScene,
                setupInput() {
                    return this.scene.controls.register('F', 'Dimensional Collapse', () => {
                        this.attemptActivation();
                    }, {
                        system: 'DimensionalCollapseSystem',
                        description: 'Activate dimensional collapse'
                    });
                },
                attemptActivation() {}
            };
            
            const result = dimCollapse.setupInput();
            expect(result).toBe(true);
            expect(controlsManager.isBound('F')).toBe(true);
            expect(controlsManager.getBinding('F').system).toBe('DimensionalCollapseSystem');
        });
        
        it('should reject second system trying to register F', () => {
            // First registration
            controlsManager.register('F', 'Dimensional Collapse', () => {}, {
                system: 'DimensionalCollapseSystem'
            });
            
            // Second attempt
            const apophenia = {
                scene: mockScene,
                setupInput() {
                    return this.scene.controls.register('F', 'Focus Mode', () => {
                        this.toggleFocusMode();
                    }, {
                        system: 'ApopheniaProtocol'
                    });
                }
            };
            
            const result = apophenia.setupInput();
            expect(result).toBe(false);
            expect(controlsManager.getBinding('F').system).toBe('DimensionalCollapseSystem');
        });
        
        it('should reject third system trying to register F', () => {
            // First registration
            controlsManager.register('F', 'Dimensional Collapse', () => {}, {
                system: 'DimensionalCollapseSystem'
            });
            
            // Second attempt (rejected)
            controlsManager.register('F', 'Focus Mode', () => {}, {
                system: 'ApopheniaProtocol'
            });
            
            // Third attempt
            const resonantWhisper = {
                scene: mockScene,
                setupInput() {
                    return this.scene.controls.register('F', 'Interact', () => {}, {
                        system: 'ResonantWhisperSystem'
                    });
                }
            };
            
            const result = resonantWhisper.setupInput();
            expect(result).toBe(false);
        });
        
        it('should document all attempted F key bindings', () => {
            const attempted = [];
            
            const tryRegister = (system, action) => {
                const result = controlsManager.register('F', action, () => {}, { system });
                attempted.push({ system, action, success: result });
                return result;
            };
            
            tryRegister('DimensionalCollapseSystem', 'Dimensional Collapse');
            tryRegister('ApopheniaProtocol', 'Focus Mode');
            tryRegister('ResonantWhisperSystem', 'Interact with Whispers');
            
            // Only first should succeed
            expect(attempted.filter(a => a.success)).toHaveLength(1);
            expect(attempted.filter(a => !a.success)).toHaveLength(2);
        });
    });
    
    describe('multiple system migration', () => {
        it('all three systems should try to register their keys', () => {
            const systems = [
                {
                    name: 'DimensionalCollapseSystem',
                    key: 'F',
                    action: 'Dimensional Collapse'
                },
                {
                    name: 'ApopheniaProtocol', 
                    key: 'F',
                    action: 'Focus Mode'
                },
                {
                    name: 'ResonantWhisperSystem',
                    key: 'F',
                    action: 'Interact'
                }
            ];
            
            let successCount = 0;
            systems.forEach(sys => {
                const result = controlsManager.register(sys.key, sys.action, () => {}, {
                    system: sys.name
                });
                if (result) successCount++;
            });
            
            // Only one should succeed
            expect(successCount).toBe(1);
        });
    });
});
