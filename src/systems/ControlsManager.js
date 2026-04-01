/**
 * ControlsManager
 * 
 * Centralized key binding management system.
 * All modules register their key needs here to prevent conflicts
 * and enable unified display in the KeyboardShortcutsLegend.
 * 
 * Usage:
 *   this.scene.controls.register('P', 'Patch Mode', this.togglePatchMode, {
 *     system: 'MetaSystemOperator',
 *     description: 'Enter patch mode to wire systems together'
 *   });
 */

export default class ControlsManager {
    constructor(scene) {
        this.scene = scene;
        this.bindings = new Map(); // key -> { action, handler, system, description }
        
        // Special key mappings (Phaser uses different event names)
        this.keyMappings = {
            'ESC': 'ESC',
            'SPACE': 'SPACE',
            'TAB': 'TAB',
            'SHIFT': 'SHIFT',
            'CTRL': 'CTRL',
            'ALT': 'ALT',
            'ENTER': 'ENTER',
            'BACKSPACE': 'BACKSPACE',
            'DELETE': 'DELETE',
            'UP': 'UP',
            'DOWN': 'DOWN',
            'LEFT': 'LEFT',
            'RIGHT': 'RIGHT'
        };
    }
    
    /**
     * Register a key binding
     * @param {string} key - The key (e.g., 'P', 'Q', 'ESC', 'SPACE')
     * @param {string} action - Short action name (e.g., 'Patch Mode')
     * @param {Function} handler - The callback function
     * @param {Object} options - { system: 'MetaSystem', description: 'Full description' }
     * @returns {boolean} - Success or failure
     */
    register(key, action, handler, options = {}) {
        // Normalize key to uppercase
        const normalizedKey = key.toUpperCase();
        
        // Check if key already bound
        if (this.bindings.has(normalizedKey)) {
            const existing = this.bindings.get(normalizedKey);
            console.warn(`[ControlsManager] Key ${normalizedKey} already bound to: ${existing.action} by ${existing.system}`);
            return false;
        }
        
        // Store binding
        this.bindings.set(normalizedKey, {
            key: normalizedKey,
            action,
            handler,
            system: options.system || 'unknown',
            description: options.description || action
        });
        
        // Register with Phaser keyboard
        const phaserKey = this.keyMappings[normalizedKey] || normalizedKey;
        this.scene.input.keyboard.on(`keydown-${phaserKey}`, handler);
        
        console.log(`[ControlsManager] Registered: ${normalizedKey} → ${action} (${options.system || 'unknown'})`);
        return true;
    }
    
    /**
     * Unregister a key binding
     * @param {string} key - The key to unbind
     * @returns {boolean} - Whether unregistration succeeded
     */
    unregister(key) {
        const normalizedKey = key.toUpperCase();
        const binding = this.bindings.get(normalizedKey);
        
        if (binding) {
            const phaserKey = this.keyMappings[normalizedKey] || normalizedKey;
            this.scene.input.keyboard.off(`keydown-${phaserKey}`, binding.handler);
            this.bindings.delete(normalizedKey);
            console.log(`[ControlsManager] Unregistered: ${normalizedKey}`);
            return true;
        }
        
        return false;
    }
    
    /**
     * Get all bindings for display in legend
     * @returns {Array} - Array of { key, action, system } objects
     */
    getAllBindings() {
        return Array.from(this.bindings.values()).map(b => ({
            key: b.key,
            action: b.action,
            system: b.system
        }));
    }
    
    /**
     * Get binding for a specific key
     * @param {string} key - The key to look up
     * @returns {Object|null} - The binding object or null
     */
    getBinding(key) {
        return this.bindings.get(key.toUpperCase()) || null;
    }
    
    /**
     * Check if a key is already bound
     * @param {string} key - The key to check
     * @returns {boolean}
     */
    isBound(key) {
        return this.bindings.has(key.toUpperCase());
    }
    
    /**
     * Get all bindings for a specific system
     * @param {string} system - System name
     * @returns {Array} - Array of { key, action } objects
     */
    getBindingsBySystem(system) {
        return Array.from(this.bindings.values())
            .filter(b => b.system === system)
            .map(b => ({ key: b.key, action: b.action }));
    }
    
    /**
     * Register mouse input (separate from keyboard)
     * @param {string} event - 'pointerdown', 'pointermove', etc.
     * @param {Function} handler - The callback
     */
    registerMouse(event, handler) {
        this.scene.input.on(event, handler);
    }
    
    /**
     * Unregister mouse input
     * @param {string} event - The event name
     * @param {Function} handler - The callback to remove
     */
    unregisterMouse(event, handler) {
        this.scene.input.off(event, handler);
    }
    
    /**
     * Get a summary of all bindings for debugging
     * @returns {string} - Formatted string
     */
    getSummary() {
        const lines = ['[ControlsManager] Active Bindings:'];
        this.bindings.forEach((binding, key) => {
            lines.push(`  ${key.padEnd(8)} → ${binding.action.padEnd(20)} (${binding.system})`);
        });
        return lines.join('\n');
    }
    
    /**
     * Destroy all bindings (cleanup)
     */
    destroy() {
        this.bindings.forEach((binding, key) => {
            this.unregister(key);
        });
    }
}
