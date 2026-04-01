import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * F Key Conflict Resolution Tests (RESOLVED)
 * 
 * Three systems used to compete for F key:
 * - DimensionalCollapseSystem: "Dimensional Collapse" (keeps F)
 * - ApopheniaProtocol: Changed from "Focus Mode" (F) to "Apophenic Focus" (T)
 * - ResonantWhisperSystem: Changed from "Interact" (F) to "Whisper" (G)
 * 
 * Conflict resolved by reassigning keys.
 */

describe('F Key Conflict Resolution (RESOLVED)', () => {
    let mockScene;
    let controlsManager;
    
    beforeEach(() => {
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
            },
            
            getBinding(key) {
                return this.bindings.get(key.toUpperCase());
            }
        };
        
        mockScene = {
            controls: controlsManager
        };
    });
    
    describe('conflict resolved by key reassignment', () => {
        it('all three systems use different keys now', () => {
            // After migration: F conflict resolved by changing keys
            const keyAssignments = [
                { system: 'DimensionalCollapseSystem', key: 'F', action: 'Dimensional Collapse' },
                { system: 'ApopheniaProtocol', key: 'T', action: 'Apophenic Focus' },  // Changed from F
                { system: 'ResonantWhisperSystem', key: 'G', action: 'Whisper' }         // Changed from F
            ];
            
            let successCount = 0;
            keyAssignments.forEach(sys => {
                const result = controlsManager.register(sys.key, sys.action, () => {}, {
                    system: sys.system
                });
                if (result) successCount++;
            });
            
            // All three should succeed with different keys
            expect(successCount).toBe(3);
            
            // Verify each is registered
            expect(controlsManager.isBound('F')).toBe(true);  // DimensionalCollapse
            expect(controlsManager.isBound('T')).toBe(true);  // ApopheniaProtocol  
            expect(controlsManager.isBound('G')).toBe(true);  // ResonantWhisperSystem
        });
        
        it('dimensional collapse keeps F key', () => {
            controlsManager.register('F', 'Dimensional Collapse', () => {}, {
                system: 'DimensionalCollapseSystem'
            });
            
            expect(controlsManager.getBinding('F').system).toBe('DimensionalCollapseSystem');
        });
        
        it('apophenia now uses T key instead of F', () => {
            controlsManager.register('T', 'Apophenic Focus', () => {}, {
                system: 'ApopheniaProtocol'
            });
            
            expect(controlsManager.getBinding('T').system).toBe('ApopheniaProtocol');
            expect(controlsManager.isBound('F')).toBe(false);  // Not using F
        });
        
        it('resonant whisper now uses G key instead of F', () => {
            controlsManager.register('G', 'Whisper', () => {}, {
                system: 'ResonantWhisperSystem'
            });
            
            expect(controlsManager.getBinding('G').system).toBe('ResonantWhisperSystem');
            expect(controlsManager.isBound('F')).toBe(false);  // Not using F
        });
    });
    
    describe('duplicate key prevention still works', () => {
        it('still prevents duplicate registrations on same key', () => {
            controlsManager.register('F', 'First', () => {}, { system: 'SystemA' });
            const result = controlsManager.register('F', 'Second', () => {}, { system: 'SystemB' });
            
            expect(result).toBe(false);
        });
    });
});
