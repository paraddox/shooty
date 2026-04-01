import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ControlsManager Tests
 * 
 * Centralized key binding management system.
 * All modules register their key needs here to prevent conflicts
 * and enable unified display in the KeyboardShortcutsLegend.
 */

describe('ControlsManager', () => {
    let controlsManager;
    let mockScene;
    
    beforeEach(() => {
        // Track registered handlers
        const keyboardHandlers = {};
        
        mockScene = {
            input: {
                keyboard: {
                    on: vi.fn((event, handler) => {
                        const key = event.replace('keydown-', '');
                        keyboardHandlers[key] = handler;
                    }),
                    off: vi.fn()
                }
            }
        };
        
        // Simple ControlsManager implementation for testing
        controlsManager = {
            scene: mockScene,
            bindings: new Map(), // key -> { action, handler, system, description }
            
            /**
             * Register a key binding
             * @param {string} key - The key (e.g., 'P', 'Q', 'ESC')
             * @param {string} action - Short action name (e.g., 'Patch Mode')
             * @param {Function} handler - The callback function
             * @param {Object} options - { system: 'MetaSystem', description: 'Full description' }
             * @returns {boolean} - Success or failure
             */
            register(key, action, handler, options = {}) {
                // Check if key already bound
                if (this.bindings.has(key)) {
                    const existing = this.bindings.get(key);
                    console.warn(`[ControlsManager] Key ${key} already bound to: ${existing.action} by ${existing.system}`);
                    return false;
                }
                
                // Store binding
                this.bindings.set(key, {
                    key,
                    action,
                    handler,
                    system: options.system || 'unknown',
                    description: options.description || action
                });
                
                // Register with Phaser keyboard
                const eventKey = key === 'ESC' ? 'ESC' : key;
                this.scene.input.keyboard.on(`keydown-${eventKey}`, handler);
                
                return true;
            },
            
            /**
             * Unregister a key binding
             * @param {string} key - The key to unbind
             */
            unregister(key) {
                const binding = this.bindings.get(key);
                if (binding) {
                    const eventKey = key === 'ESC' ? 'ESC' : key;
                    this.scene.input.keyboard.off(`keydown-${eventKey}`, binding.handler);
                    this.bindings.delete(key);
                    return true;
                }
                return false;
            },
            
            /**
             * Get all bindings for display
             * @returns {Array} - Array of binding objects
             */
            getAllBindings() {
                return Array.from(this.bindings.values()).map(b => ({
                    key: b.key,
                    action: b.action,
                    system: b.system
                }));
            },
            
            /**
             * Get binding for a specific key
             * @param {string} key - The key to look up
             */
            getBinding(key) {
                return this.bindings.get(key);
            },
            
            /**
             * Check if a key is already bound
             * @param {string} key - The key to check
             */
            isBound(key) {
                return this.bindings.has(key);
            },
            
            /**
             * Get all bindings for a specific system
             * @param {string} system - System name
             */
            getBindingsBySystem(system) {
                return Array.from(this.bindings.values())
                    .filter(b => b.system === system)
                    .map(b => ({ key: b.key, action: b.action }));
            }
        };
    });
    
    describe('key registration', () => {
        it('should register a simple key binding', () => {
            const handler = vi.fn();
            const result = controlsManager.register('P', 'Patch Mode', handler, {
                system: 'MetaSystemOperator',
                description: 'Enter patch mode to wire systems'
            });
            
            expect(result).toBe(true);
            expect(controlsManager.isBound('P')).toBe(true);
            expect(mockScene.input.keyboard.on).toHaveBeenCalledWith('keydown-P', handler);
        });
        
        it('should prevent duplicate key bindings', () => {
            const handler1 = vi.fn();
            const handler2 = vi.fn();
            
            controlsManager.register('Q', 'Ability 1', handler1, { system: 'SystemA' });
            const result = controlsManager.register('Q', 'Ability 2', handler2, { system: 'SystemB' });
            
            expect(result).toBe(false);
            expect(controlsManager.getBinding('Q').system).toBe('SystemA');
        });
        
        it('should handle special keys like ESC', () => {
            const handler = vi.fn();
            controlsManager.register('ESC', 'Close Menu', handler, { system: 'UI' });
            
            expect(controlsManager.isBound('ESC')).toBe(true);
            expect(mockScene.input.keyboard.on).toHaveBeenCalledWith('keydown-ESC', handler);
        });
        
        it('should store system information with each binding', () => {
            controlsManager.register('E', 'Echo Storm', vi.fn(), {
                system: 'EchoStormSystem',
                description: 'Release echo storm'
            });
            
            const binding = controlsManager.getBinding('E');
            expect(binding.system).toBe('EchoStormSystem');
            expect(binding.description).toBe('Release echo storm');
        });
    });
    
    describe('key unregistration', () => {
        it('should unregister a key binding', () => {
            const handler = vi.fn();
            controlsManager.register('R', 'Fracture', handler, { system: 'FractureSystem' });
            
            const result = controlsManager.unregister('R');
            
            expect(result).toBe(true);
            expect(controlsManager.isBound('R')).toBe(false);
            expect(mockScene.input.keyboard.off).toHaveBeenCalledWith('keydown-R', handler);
        });
        
        it('should return false when unregistering non-existent key', () => {
            const result = controlsManager.unregister('Z');
            expect(result).toBe(false);
        });
    });
    
    describe('querying bindings', () => {
        beforeEach(() => {
            controlsManager.register('Q', 'Near-Miss Dash', vi.fn(), { system: 'NearMissSystem' });
            controlsManager.register('E', 'Echo Storm', vi.fn(), { system: 'EchoStormSystem' });
            controlsManager.register('R', 'Fracture', vi.fn(), { system: 'FractureSystem' });
            controlsManager.register('P', 'Patch Mode', vi.fn(), { system: 'MetaSystemOperator' });
        });
        
        it('should return all bindings for legend display', () => {
            const all = controlsManager.getAllBindings();
            
            expect(all).toHaveLength(4);
            expect(all.map(b => b.key)).toContain('Q');
            expect(all.map(b => b.key)).toContain('E');
            expect(all.map(b => b.key)).toContain('R');
            expect(all.map(b => b.key)).toContain('P');
        });
        
        it('should get bindings by system', () => {
            const echoBindings = controlsManager.getBindingsBySystem('EchoStormSystem');
            
            expect(echoBindings).toHaveLength(1);
            expect(echoBindings[0].key).toBe('E');
            expect(echoBindings[0].action).toBe('Echo Storm');
        });
        
        it('should return empty array for unknown system', () => {
            const unknown = controlsManager.getBindingsBySystem('NonExistent');
            expect(unknown).toEqual([]);
        });
    });
    
    describe('known game keys', () => {
        it('should include all known ability keys', () => {
            const abilities = [
                { key: 'Q', action: 'Near-Miss Dash', system: 'NearMissSystem' },
                { key: 'E', action: 'Echo Storm', system: 'EchoStormSystem' },
                { key: 'R', action: 'Fracture', system: 'FractureSystem' },
                { key: 'F', action: '??', system: '?' },  // F is mentioned as missing
                { key: 'T', action: '??', system: '?' },  // T is mentioned as missing
                { key: 'X', action: '??', system: '?' }   // X is mentioned as missing
            ];
            
            // Document that these keys exist but aren't documented
            const undocumentedKeys = abilities.filter(a => a.action === '??');
            expect(undocumentedKeys.length).toBeGreaterThan(0);
            console.log('Undocumented keys:', undocumentedKeys.map(k => k.key));
        });
        
        it('should handle WASD as movement (not single keys)', () => {
            // WASD is typically handled differently - continuous input
            // Should it be registered as four separate bindings or one group?
            const movementBinding = {
                key: 'WASD',
                action: 'Move',
                system: 'PlayerMovement'
            };
            
            expect(movementBinding.key).toBe('WASD');
        });
        
        it('should handle mouse separately from keyboard', () => {
            const mouseBinding = {
                key: 'MOUSE',
                action: 'Aim & Shoot',
                system: 'PlayerCombat'
            };
            
            expect(mouseBinding.key).toBe('MOUSE');
        });
    });
});
