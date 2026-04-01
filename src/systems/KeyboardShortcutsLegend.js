/**
 * KeyboardShortcutsLegend
 * 
 * HUD panel showing all keyboard shortcuts and their actions.
 * Reads bindings from ControlsManager for single source of truth.
 * Registered in BOTTOM_LEFT slot.
 */

export default class KeyboardShortcutsLegend {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        
        // Static shortcuts not in ControlsManager (movement, mouse)
        this.staticShortcuts = [
            { key: 'WASD', action: 'Move' },
            { key: 'MOUSE', action: 'Aim & Shoot' }
        ];
        
        this.init();
    }
    
    init() {
        this.createLegendPanel();
    }
    
    /**
     * Get all shortcuts to display - combines static + ControlsManager bindings
     */
    getShortcuts() {
        // Get dynamic bindings from ControlsManager
        const dynamicBindings = this.scene.controls?.getAllBindings() || [];
        
        // Sort dynamic bindings alphabetically by key
        const sortedDynamic = [...dynamicBindings].sort((a, b) => a.key.localeCompare(b.key));
        
        // Combine static + dynamic
        return [...this.staticShortcuts, ...sortedDynamic];
    }
    
    createLegendPanel() {
        // Register with HUDPanelManager in BOTTOM_LEFT panel's KEYBOARD_SHORTCUTS slot
        this.scene.hudPanels.registerSlot('KEYBOARD_SHORTCUTS', (container, width, layout) => {
            this.container = container;
            this.container.setDepth(100);
            
            // Get all shortcuts (static + from ControlsManager)
            const shortcuts = this.getShortcuts();
            
            // Calculate dimensions based on content
            const rowHeight = 14;
            const padding = 6;
            const panelHeight = (shortcuts.length * rowHeight) + padding;
            
            // Shortcuts list (panel title handled by HUDPanelManager)
            let y = 6;
            shortcuts.forEach((shortcut) => {
                // Key binding in cyan
                const keyText = this.scene.add.text(6, y, shortcut.key, {
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    fill: '#00f0ff'
                }).setOrigin(0, 0);
                
                // Action description in white
                const actionText = this.scene.add.text(55, y, shortcut.action, {
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    fill: '#ffffff'
                }).setOrigin(0, 0);
                
                this.container.add([keyText, actionText]);
                y += rowHeight;
            });
            
            // Return the actual height used
            return { height: panelHeight };
            
        }, 'BOTTOM_LEFT');
    }
    
    /**
     * Add a new shortcut to the legend
     * @param {string} key - The key binding
     * @param {string} action - The action description
     */
    addShortcut(key, action) {
        this.shortcuts.push({ key, action });
        // Re-render would need to be handled by HUDPanelManager
    }
    
    /**
     * Remove a shortcut from the legend
     * @param {string} key - The key to remove
     */
    removeShortcut(key) {
        this.shortcuts = this.shortcuts.filter(s => s.key !== key);
    }
    
    /**
     * Update an existing shortcut
     * @param {string} key - The key to update
     * @param {string} newAction - The new action description
     */
    updateShortcut(key, newAction) {
        const shortcut = this.shortcuts.find(s => s.key === key);
        if (shortcut) {
            shortcut.action = newAction;
        }
    }
    
    /**
     * Destroy the legend panel
     */
    destroy() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }
}
