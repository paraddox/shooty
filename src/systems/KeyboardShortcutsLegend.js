/**
 * KeyboardShortcutsLegend
 * 
 * HUD panel showing all keyboard shortcuts and their actions.
 * Registered in BOTTOM_LEFT slot.
 */

export default class KeyboardShortcutsLegend {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        
        // Define all shortcuts with their display names
        this.shortcuts = [
            { key: 'WASD', action: 'Move' },
            { key: 'MOUSE', action: 'Aim & Shoot' },
            { key: 'Q', action: 'Near-Miss Dash' },
            { key: 'E', action: 'Echo Storm' },
            { key: 'R', action: 'Fracture' },
            { key: 'P', action: 'Patch Mode' },
            { key: 'ESC', action: 'Close Menu' }
        ];
        
        this.init();
    }
    
    init() {
        this.createLegendPanel();
    }
    
    createLegendPanel() {
        // Register with HUDPanelManager in BOTTOM_LEFT slot
        this.scene.hudPanels.registerSlot('KEYBOARD_SHORTCUTS', (container, width, layout) => {
            this.container = container;
            this.container.setDepth(100);
            
            // Calculate dimensions based on content
            const rowHeight = 14;
            const titleHeight = 18;
            const padding = 6;
            const panelHeight = titleHeight + (this.shortcuts.length * rowHeight) + padding;
            
            // Background - semi-transparent dark
            const bg = this.scene.add.rectangle(
                0, 0, 
                width, 
                panelHeight, 
                0x0a0a0f, 
                0.9
            );
            bg.setStrokeStyle(1, 0x333333);
            bg.setOrigin(0, 0); // Top-left origin
            this.container.add(bg);
            
            // Title
            const title = this.scene.add.text(5, 4, 'CONTROLS', {
                fontFamily: 'monospace',
                fontSize: '11px',
                fill: '#ffb700'
            }).setOrigin(0, 0);
            this.container.add(title);
            
            // Horizontal line under title
            const line = this.scene.add.rectangle(5, 16, width - 10, 1, 0x333333, 1);
            line.setOrigin(0, 0);
            this.container.add(line);
            
            // Shortcuts list
            let y = 20;
            this.shortcuts.forEach((shortcut) => {
                // Key binding in cyan
                const keyText = this.scene.add.text(8, y, shortcut.key, {
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fill: '#00f0ff'
                }).setOrigin(0, 0);
                
                // Action description in white
                const actionText = this.scene.add.text(65, y, shortcut.action, {
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fill: '#ffffff'
                }).setOrigin(0, 0);
                
                this.container.add([keyText, actionText]);
                y += rowHeight;
            });
            
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
