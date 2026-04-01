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
        this.setupAutoRefresh();
    }
    
    /**
     * Set up automatic refresh when ControlsManager bindings change
     */
    setupAutoRefresh() {
        if (this.scene.controls) {
            this.scene.controls.onBindingChange(() => {
                this.refresh();
            });
        }
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
    
    /**
     * Calculate the required panel width based on content
     * Uses conservative estimates to ensure no overflow
     */
    calculatePanelWidth() {
        const shortcuts = this.getShortcuts();
        const actionColumnX = 55;
        const rightPadding = 10; // Extra space on right side
        
        let maxActionWidth = 0;
        
        shortcuts.forEach(shortcut => {
            // More conservative character width estimate
            // Phaser 9px monospace is approximately 5.5-6px per character
            // Using 6.2px to be safe, plus add buffer for longer words
            const actionWidth = shortcut.action.length * 6.2;
            maxActionWidth = Math.max(maxActionWidth, actionWidth);
        });
        
        // Total width = action column start + max action width + right padding
        const totalWidth = actionColumnX + maxActionWidth + rightPadding;
        
        // Round up to nearest 10 and ensure minimum
        const roundedWidth = Math.ceil(totalWidth / 10) * 10;
        return Math.max(roundedWidth, 160); // Minimum 160px
    }
    
    createLegendPanel() {
        // Calculate required width before registration
        const requiredWidth = this.calculatePanelWidth();
        
        // Register with HUDPanelManager in BOTTOM_LEFT panel's KEYBOARD_SHORTCUTS slot
        this.scene.hudPanels.registerSlot('KEYBOARD_SHORTCUTS', (container, width, layout) => {
            this.container = container;
            this.container.setDepth(100);
            
            // Render shortcuts
            this.renderShortcuts();
            
            // Return the actual height and preferred width
            return { 
                height: this.getPanelHeight(),
                preferredWidth: requiredWidth
            };
            
        }, 'BOTTOM_LEFT');
        
        // Update panel width immediately after registration
        // Use next frame to ensure HUDPanelManager has processed the registration
        this.updatePanelWidth(requiredWidth);
    }
    
    /**
     * Update the panel width if content requires more space
     */
    updatePanelWidth(requiredWidth) {
        if (this.scene.hudPanels?.updatePanelWidth) {
            this.scene.hudPanels.updatePanelWidth('BOTTOM_LEFT', requiredWidth);
        }
    }
    
    /**
     * Calculate panel height based on shortcuts
     */
    getPanelHeight() {
        const shortcuts = this.getShortcuts();
        const rowHeight = 14;
        const padding = 6;
        return (shortcuts.length * rowHeight) + padding;
    }
    
    /**
     * Render shortcuts to the container
     */
    renderShortcuts() {
        if (!this.container) return;
        
        // Clear existing text objects
        this.container.removeAll(true);
        
        // Get all shortcuts (static + from ControlsManager)
        const shortcuts = this.getShortcuts();
        
        // Shortcuts list (panel title handled by HUDPanelManager)
        let y = 6;
        const rowHeight = 14;
        
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
    }
    
    /**
     * Refresh the legend panel (re-render with current bindings)
     */
    refresh() {
        if (!this.container) return;
        
        this.renderShortcuts();
        
        // Update panel height in HUDPanelManager
        this.updatePanelHeight();
    }
    
    /**
     * Update the panel height in HUDPanelManager when content changes
     */
    updatePanelHeight() {
        const newHeight = this.getPanelHeight();
        
        if (this.scene.hudPanels?.updateSlotHeight) {
            this.scene.hudPanels.updateSlotHeight('KEYBOARD_SHORTCUTS', newHeight);
        }
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
