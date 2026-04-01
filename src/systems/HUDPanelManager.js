/**
 * HUDPanelManager — Panel-based HUD system with semi-transparent backgrounds
 * 
 * Organizes HUD elements into clean panels with glass-morphism styling:
 * - TOP_LEFT_PANEL: Player stats (health, score, wave, syntropy, etc.)
 * - TOP_RIGHT_PANEL: System statuses (orbs, quantum, debt, etc.)
 * - BOTTOM_RIGHT_PANEL: Active abilities (meta-system, aperture, etc.)
 * - TOP_CENTER_PANEL: Symbiosis/harmony indicators
 */

export default class HUDPanelManager {
    constructor(scene) {
        this.scene = scene;
        this.margin = 20;
        this.panelPadding = 12;
        this.gap = 15;
        
        // Panel configurations
        this.PANELS = {
            TOP_LEFT: {
                x: this.margin,
                y: this.margin,
                width: 220,
                title: 'STATUS',
                color: 0x00f0ff, // Cyan accent
                slots: [
                    { id: 'HEALTH_BAR', label: 'INTEGRITY', type: 'bar', height: 20 },
                    { id: 'SCORE', label: 'SCORE', type: 'value', height: 25 },
                    { id: 'WAVE', label: 'WAVE', type: 'text', height: 20 },
                    { id: 'ENEMY_COUNT', label: 'HOSTILES', type: 'text', height: 18 },
                    { id: 'NEAR_MISS', label: 'STREAK', type: 'text', height: 18 },
                    { id: 'SYNTROPY', label: 'SYNTROPY', type: 'value', height: 18 },
                    { id: 'OMNI_WEAPON', label: 'WEAPON', type: 'compact', height: 15 },
                    { id: 'CONVERGENCE', label: 'CONVERGENCE', type: 'text', height: 18 },
                    { id: 'SYNTHESIS', label: 'SYNTHESIS', type: 'text', height: 18 },
                    { id: 'PATTERN', label: 'PATTERNS', type: 'text', height: 18 },
                    { id: 'VOID_COHERENCE', label: 'COHERENCE', type: 'bar', height: 15 },
                    { id: 'CHRONO_LOOP', label: 'TIME LOOP', type: 'bar', height: 15 },
                    { id: 'CAUSAL_LINK', label: 'CAUSALITY', type: 'compact', height: 15 },
                    { id: 'TEMPORAL_REWIND', label: 'REWIND', type: 'bar', height: 15 },
                ]
            },
            TOP_RIGHT: {
                x: null, // Right-aligned
                y: this.margin,
                width: 160,
                title: 'SYSTEMS',
                color: 0xffd700, // Gold accent
                slots: [
                    { id: 'WAVE_TIMER', label: 'WAVE TIME', type: 'bar', height: 12 },
                    { id: 'RESONANCE_ORB', label: 'ORBS', type: 'compact', height: 45 },
                    { id: 'QUANTUM_IMMORTALITY', label: 'QUANTUM', type: 'compact', height: 40 },
                    { id: 'DEBT_DISPLAY', label: 'DEBT', type: 'compact', height: 45 },
                    { id: 'BOOTSTRAP', label: 'PARADOX', type: 'compact', height: 40 },
                    { id: 'DISSOLUTION', label: 'ESSENCE', type: 'compact', height: 50 },
                    { id: 'AMBIENT', label: 'AMBIENT', type: 'compact', height: 30 },
                    { id: 'AXIOM_NEXUS', label: 'NEXUS', type: 'compact', height: 30 },
                    { id: 'HEARTFLUX', label: 'HEARTFLUX', type: 'compact', height: 30 },
                ]
            },
            TOP_CENTER: {
                x: null, // Centered
                y: this.margin + 10,
                width: 240,
                title: 'SYMBIOSIS',
                color: 0xff00ff, // Magenta accent
                slots: [
                    { id: 'SYMBIOSIS_HARMONY', label: 'HARMONY/CHAOS', type: 'balance', height: 35 },
                    { id: 'RESONANCE_CASCADE', label: 'RESONANCE', type: 'multiplier', height: 40 },
                ]
            },
            BOTTOM_RIGHT: {
                x: null, // Right-aligned
                y: null, // Bottom-relative
                width: 140,
                title: 'ACTIVE',
                color: 0x00d4aa, // Teal accent
                slots: [
                    { id: 'META_SYSTEM', label: 'META', type: 'compact', height: 50 },
                    { id: 'APERTURE', label: 'BLINK', type: 'icon', height: 40 },
                    { id: 'OBSERVER', label: 'OBSERVER', type: 'icon', height: 30 },
                    { id: 'KARMA', label: 'KARMA', type: 'compact', height: 30 },
                    { id: 'PEDAGOGY', label: 'PEDAGOGY', type: 'compact', height: 30 },
                    { id: 'ATHENAEUM', label: 'ATHENAEUM', type: 'compact', height: 30 },
                    { id: 'INSCRIPTION', label: 'INSCRIPTION', type: 'compact', height: 30 },
                    { id: 'HARMONIC', label: 'HARMONIC', type: 'compact', height: 30 },
                ]
            }
        };
        
        this.panels = new Map();
        this.elements = new Map();
        this.containers = new Map();
        
        this.createPanels();
    }
    
    createPanels() {
        const screenW = this.scene.scale.width;
        const screenH = this.scene.scale.height;
        
        Object.entries(this.PANELS).forEach(([region, config]) => {
            let x = config.x;
            let y = config.y;
            
            // Handle dynamic positions
            if (x === null) {
                if (region === 'TOP_CENTER') {
                    x = screenW / 2 - config.width / 2;
                } else {
                    x = screenW - this.margin - config.width;
                }
            }
            if (y === null) {
                y = screenH - this.calculatePanelHeight(config) - this.margin;
            }
            
            // Create panel container
            const panel = this.scene.add.container(x, y);
            panel.setScrollFactor(0);
            panel.setDepth(99);
            
            // Calculate panel height based on slots
            const panelHeight = this.calculatePanelHeight(config);
            
            // Create semi-transparent background
            const bg = this.createPanelBackground(config.width, panelHeight, config.color);
            panel.add(bg);
            
            // Create title bar
            const titleBg = this.scene.add.rectangle(
                config.width / 2, 
                this.panelPadding + 8, 
                config.width - 4, 
                18, 
                config.color, 
                0.15
            );
            titleBg.setStrokeStyle(1, config.color, 0.3);
            panel.add(titleBg);
            
            // Create title text
            const title = this.scene.add.text(config.width / 2, this.panelPadding + 8, config.title, {
                fontFamily: 'monospace',
                fontSize: '10px',
                letterSpacing: 2,
                fill: this.colorToHex(config.color)
            }).setOrigin(0.5);
            panel.add(title);
            
            // Create content container (where systems add their elements)
            const contentY = 35; // Below title
            const contentContainer = this.scene.add.container(this.panelPadding, contentY);
            panel.add(contentContainer);
            
            // Store panel data
            this.panels.set(region, {
                container: panel,
                content: contentContainer,
                config: config,
                nextY: 0,
                slotMap: new Map()
            });
            
            this.containers.set(region, contentContainer);
        });
    }
    
    createPanelBackground(width, height, accentColor) {
        const graphics = this.scene.add.graphics();
        
        // Main background - semi-transparent dark
        graphics.fillStyle(0x0a0a0f, 0.85);
        graphics.fillRoundedRect(0, 0, width, height, 8);
        
        // Border with accent color
        graphics.lineStyle(1, accentColor, 0.4);
        graphics.strokeRoundedRect(0, 0, width, height, 8);
        
        // Subtle inner glow at top
        graphics.fillStyle(accentColor, 0.05);
        graphics.fillRect(2, 2, width - 4, 3);
        
        // Bottom accent line
        graphics.lineStyle(2, accentColor, 0.3);
        graphics.beginPath();
        graphics.moveTo(8, height - 2);
        graphics.lineTo(width - 8, height - 2);
        graphics.strokePath();
        
        return graphics;
    }
    
    calculatePanelHeight(config) {
        const titleHeight = 35;
        const slotHeight = config.slots.reduce((sum, slot) => sum + slot.height + 3, 0);
        return titleHeight + slotHeight + this.panelPadding * 2;
    }
    
    /**
     * Register a HUD element in a panel slot
     * @param {string} slotId - The slot identifier
     * @param {Function} createFn - Function that creates and returns the element(s)
     * @param {string} region - Panel region
     * @returns {Phaser.GameObjects.Container} The created element
     */
    registerSlot(slotId, createFn, region = 'TOP_LEFT') {
        try {
            const panel = this.panels.get(region);
            if (!panel) {
                console.warn(`[HUDPanelManager] Unknown panel: ${region}`);
                return null;
            }
            
            // Find slot config
            const slotConfig = panel.config.slots.find(s => s.id === slotId);
            if (!slotConfig) {
                console.warn(`[HUDPanelManager] Unknown slot: ${slotId} in ${region}. Available: ${panel.config.slots.map(s => s.id).join(', ')}`);
                return null;
            }
            
            // Check if slot already occupied
            if (panel.slotMap.has(slotId)) {
                console.warn(`[HUDPanelManager] Slot ${slotId} already occupied in ${region}`);
                const existing = panel.slotMap.get(slotId);
                if (existing) existing.destroy();
            }
            
            // Create slot container at the allocated position
            const slotContainer = this.scene.add.container(0, panel.nextY);
            slotContainer.setDepth(100);
            
            // Add slot label
            const label = this.scene.add.text(0, 0, slotConfig.label, {
                fontFamily: 'monospace',
                fontSize: '9px',
                letterSpacing: 1,
                fill: '#666677'
            });
            slotContainer.add(label);
            
            // Create content area below label
            const contentY = 12;
            const contentContainer = this.scene.add.container(0, contentY);
            slotContainer.add(contentContainer);
            
            // Let the system create its elements in the content container
            const userElements = createFn(contentContainer, panel.config.width - this.panelPadding * 2);
            
            // Add to panel
            panel.content.add(slotContainer);
            
            // Store reference
            panel.slotMap.set(slotId, {
                container: slotContainer,
                content: contentContainer,
                elements: userElements,
                config: slotConfig
            });
            
            // Advance nextY for following slots
            panel.nextY += slotConfig.height + 3;
            
            return contentContainer;
        } catch (err) {
            console.error(`[HUDPanelManager] Error registering slot ${slotId}:`, err);
            return null;
        }
    }
    
    /**
     * Get a panel's content container for manual element addition
     * @param {string} region - Panel region
     * @returns {Phaser.GameObjects.Container}
     */
    getPanelContent(region) {
        return this.containers.get(region);
    }
    
    /**
     * Get slot position within panel (relative to panel content)
     * @param {string} slotId - Slot identifier
     * @param {string} region - Panel region
     * @returns {Object} {x, y, width}
     */
    getSlotPosition(slotId, region) {
        const panel = this.panels.get(region);
        if (!panel) return null;
        
        const slot = panel.slotMap.get(slotId);
        if (slot) {
            return {
                x: 0,
                y: slot.container.y + 12, // Below label
                width: panel.config.width - this.panelPadding * 2
            };
        }
        
        // If slot not created yet, calculate position
        const slotConfig = panel.config.slots.find(s => s.id === slotId);
        if (!slotConfig) return null;
        
        let y = 0;
        for (const s of panel.config.slots) {
            if (s.id === slotId) break;
            if (!panel.slotMap.has(s.id)) {
                y += s.height + 3;
            }
        }
        
        return {
            x: 0,
            y: y + 12,
            width: panel.config.width - this.panelPadding * 2
        };
    }
    
    /**
     * Update slot content
     * @param {string} slotId - Slot identifier
     * @param {string} region - Panel region
     * @param {string} label - New label (optional)
     * @param {boolean} visible - Visibility (optional)
     */
    updateSlot(slotId, region, { label, visible } = {}) {
        const panel = this.panels.get(region);
        if (!panel) return;
        
        const slot = panel.slotMap.get(slotId);
        if (!slot) return;
        
        if (label !== undefined) {
            const labelText = slot.container.list[0];
            if (labelText && labelText.setText) {
                labelText.setText(label);
            }
        }
        
        if (visible !== undefined) {
            slot.container.setVisible(visible);
        }
    }
    
    /**
     * Show/hide entire panel
     * @param {string} region - Panel region
     * @param {boolean} visible - Visibility
     */
    setPanelVisible(region, visible) {
        const panel = this.panels.get(region);
        if (panel) {
            panel.container.setVisible(visible);
        }
    }
    
    /**
     * Handle window resize
     */
    onResize() {
        const screenW = this.scene.scale.width;
        const screenH = this.scene.scale.height;
        
        this.panels.forEach((panel, region) => {
            const config = panel.config;
            let x = config.x;
            let y = config.y;
            
            if (x === null) {
                if (region === 'TOP_CENTER') {
                    x = screenW / 2 - config.width / 2;
                } else {
                    x = screenW - this.margin - config.width;
                }
            }
            if (y === null) {
                y = screenH - this.calculatePanelHeight(config) - this.margin;
            }
            
            panel.container.setPosition(x, y);
        });
    }
    
    /**
     * Debug: Highlight all slots
     */
    showDebug() {
        this.panels.forEach((panel, region) => {
            panel.slotMap.forEach((slot, slotId) => {
                const debugRect = this.scene.add.rectangle(
                    slot.container.x + panel.config.width / 2,
                    slot.container.y + slot.config.height / 2,
                    panel.config.width - this.panelPadding * 2,
                    slot.config.height,
                    0xff0000,
                    0.2
                );
                debugRect.setStrokeStyle(1, 0xff0000, 0.5);
                panel.content.add(debugRect);
            });
        });
    }
    
    colorToHex(color) {
        const hex = color.toString(16).padStart(6, '0');
        return '#' + hex;
    }
    
    // ============================================================================
    // BACKWARD COMPATIBILITY with old HUDLayoutManager API
    // These methods allow existing systems to work without immediate rewrites
    // ============================================================================
    
    /**
     * Compatibility method: Get slot position (maps to panel slot position)
     * @param {string} slotId - Slot identifier
     * @param {string} region - Panel region (TOP_LEFT, TOP_RIGHT, TOP_CENTER, BOTTOM_RIGHT)
     * @returns {Object} Position {x, y}
     * @deprecated Use registerSlot() instead for new code
     */
    getSlotPosition(slotId, region = 'TOP_LEFT') {
        // Map old slot names to panel regions
        const slot = this.getSlotPositionInternal(slotId, region);
        if (slot) return slot;
        
        // Fallback: return panel content position
        const panel = this.panels.get(region);
        if (!panel) return { x: 0, y: 0 };
        
        return { x: panel.container.x + this.panelPadding, y: panel.container.y + 35 };
    }
    
    getSlotPositionInternal(slotId, region) {
        const panel = this.panels.get(region);
        if (!panel) return null;
        
        // Check if slot exists
        const slotConfig = panel.config.slots.find(s => s.id === slotId);
        if (!slotConfig) return null;
        
        // Calculate position based on slot index
        let y = 35; // Start below title
        for (const s of panel.config.slots) {
            if (s.id === slotId) break;
            y += s.height + 3;
        }
        
        return {
            x: panel.container.x + this.panelPadding,
            y: panel.container.y + y
        };
    }
    
    /**
     * Compatibility method: Register a slot with old API signature
     * Creates a wrapper that works with the panel system
     * @param {string} slotId - Slot identifier
     * @param {Phaser.GameObjects.GameObject} element - Element to register
     * @param {string} region - Panel region
     * @deprecated Use registerSlot() with callback for new code
     */
    registerExternalElement(slotId, element, region = 'TOP_LEFT') {
        const pos = this.getSlotPositionInternal(slotId, region);
        if (pos && element && element.setPosition) {
            element.setPosition(pos.x, pos.y);
        }
        
        // Store in slot map for tracking
        const panel = this.panels.get(region);
        if (panel) {
            panel.slotMap.set(slotId, {
                container: element,
                external: true  // Mark as externally managed
            });
        }
    }
}
