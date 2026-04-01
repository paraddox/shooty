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
                    { id: 'HEALTH_BAR', label: 'INTEGRITY', type: 'bar', minHeight: 16 },
                    { id: 'SCORE', label: 'SCORE', type: 'value', minHeight: 20 },
                    { id: 'WAVE', label: 'WAVE', type: 'text', minHeight: 16 },
                    { id: 'ENEMY_COUNT', label: 'HOSTILES', type: 'text', minHeight: 14 },
                    { id: 'NEAR_MISS', label: 'STREAK', type: 'text', minHeight: 14 },
                    { id: 'SYNTROPY', label: 'SYNTROPY', type: 'value', minHeight: 14 },
                    { id: 'OMNI_WEAPON', label: 'WEAPON', type: 'compact', minHeight: 12 },
                    { id: 'CONVERGENCE', label: 'CONVERGENCE', type: 'text', minHeight: 14 },
                    { id: 'SYNTHESIS', label: 'SYNTHESIS', type: 'text', minHeight: 14 },
                    { id: 'PATTERN', label: 'PATTERNS', type: 'text', minHeight: 14 },
                    { id: 'VOID_COHERENCE', label: 'COHERENCE', type: 'bar', minHeight: 12 },
                    { id: 'CHRONO_LOOP', label: 'TIME LOOP', type: 'bar', minHeight: 12 },
                    { id: 'CAUSAL_LINK', label: 'CAUSALITY', type: 'compact', minHeight: 12 },
                    { id: 'TEMPORAL_REWIND', label: 'REWIND', type: 'bar', minHeight: 12 },
                ]
            },
            TOP_RIGHT: {
                x: null, // Right-aligned
                y: this.margin,
                width: 160,
                title: 'SYSTEMS',
                color: 0xffd700, // Gold accent
                slots: [
                    { id: 'WAVE_TIMER', label: 'WAVE TIME', type: 'bar', minHeight: 10 },
                    { id: 'RESONANCE_ORB', label: 'ORBS', type: 'compact', minHeight: 30 },
                    { id: 'QUANTUM_IMMORTALITY', label: 'QUANTUM', type: 'compact', minHeight: 30 },
                    { id: 'DEBT_DISPLAY', label: 'DEBT', type: 'compact', minHeight: 30 },
                    { id: 'BOOTSTRAP', label: 'PARADOX', type: 'compact', minHeight: 30 },
                    { id: 'DISSOLUTION', label: 'ESSENCE', type: 'compact', minHeight: 35 },
                    { id: 'AMBIENT', label: 'AMBIENT', type: 'compact', minHeight: 20 },
                    { id: 'AXIOM_NEXUS', label: 'NEXUS', type: 'compact', minHeight: 20 },
                    { id: 'HEARTFLUX', label: 'HEARTFLUX', type: 'compact', minHeight: 20 },
                ]
            },
            TOP_CENTER: {
                x: null, // Centered
                y: this.margin + 10,
                width: 240,
                title: 'SYMBIOSIS',
                color: 0xff00ff, // Magenta accent
                slots: [
                    { id: 'SYMBIOSIS_HARMONY', label: 'HARMONY/CHAOS', type: 'balance', minHeight: 25 },
                    { id: 'RESONANCE_CASCADE', label: 'RESONANCE', type: 'multiplier', minHeight: 30 },
                ]
            },
            BOTTOM_RIGHT: {
                x: null, // Right-aligned
                y: null, // Bottom-relative
                width: 140,
                title: 'ACTIVE',
                color: 0x00d4aa, // Teal accent
                slots: [
                    { id: 'META_SYSTEM', label: 'META', type: 'compact', minHeight: 35 },
                    { id: 'APERTURE', label: 'BLINK', type: 'icon', minHeight: 30 },
                    { id: 'OBSERVER', label: 'OBSERVER', type: 'icon', minHeight: 20 },
                    { id: 'KARMA', label: 'KARMA', type: 'compact', minHeight: 20 },
                    { id: 'PEDAGOGY', label: 'PEDAGOGY', type: 'compact', minHeight: 20 },
                    { id: 'ATHENAEUM', label: 'ATHENAEUM', type: 'compact', minHeight: 20 },
                    { id: 'INSCRIPTION', label: 'INSCRIPTION', type: 'compact', minHeight: 20 },
                    { id: 'HARMONIC', label: 'HARMONIC', type: 'compact', minHeight: 20 },
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
        // Use minHeight as baseline - actual height will be measured after content creation
        const slotHeight = config.slots.reduce((sum, slot) => sum + (slot.minHeight || 12) + 4, 0);
        return titleHeight + slotHeight + this.panelPadding * 2;
    }
    
    /**
     * Recalculate and resize panel background after all slots are registered
     * Call this after all systems have registered their slots
     */
    recalculatePanelHeights() {
        this.panels.forEach((panel, region) => {
            // Calculate actual height based on measured slot heights
            let actualContentHeight = 35; // Title area
            panel.slotMap.forEach((slot) => {
                actualContentHeight += (slot.measuredHeight || slot.config.minHeight || 12) + 4;
            });
            actualContentHeight += this.panelPadding * 2;
            
            // Store for resize handling
            panel.actualHeight = actualContentHeight;
            
            // Recreate background with correct size
            // The background is always the first element (index 0) in the panel container
            const oldBg = panel.container.list[0];
            if (oldBg) {
                oldBg.destroy();
            }
            const newBg = this.createPanelBackground(panel.config.width, actualContentHeight, panel.config.color);
            panel.container.addAt(newBg, 0);
            
            console.log(`[HUDPanelManager] ${region} panel resized to ${actualContentHeight}px for ${panel.slotMap.size} slots`);
            
            // Reposition panel if it's bottom-aligned
            if (panel.config.y === null) {
                const screenH = this.scene.scale.height;
                const newY = screenH - actualContentHeight - this.margin;
                panel.container.setY(newY);
            }
        });
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
            
            // Calculate any offset needed for negative Y content
            const contentOffsetY = 0; // Will be calculated after content creation
            
            // Create slot container at the allocated position
            const slotContainer = this.scene.add.container(0, panel.nextY);
            slotContainer.setDepth(100);
            
            // Add slot label (positioned at top of slot)
            const label = this.scene.add.text(0, 0, slotConfig.label, {
                fontFamily: 'monospace',
                fontSize: '9px',
                letterSpacing: 1,
                fill: '#666677'
            });
            slotContainer.add(label);
            const labelHeight = label.height; // Measure actual label height
            
            // Create content area below label
            const contentY = labelHeight + 2; // 2px gap after label
            const contentContainer = this.scene.add.container(0, contentY);
            slotContainer.add(contentContainer);
            
            // Provide layout helpers to the create function
            const availableWidth = panel.config.width - this.panelPadding * 2;
            const layoutHelpers = {
                width: availableWidth,
                centerX: availableWidth / 2,
                
                // Add a progress bar - positioned correctly
                addBar: (height = 6, color = 0x00f0ff) => {
                    const y = height / 2;
                    const bg = this.scene.add.rectangle(0, y, availableWidth, height, 0x22222a);
                    const bar = this.scene.add.rectangle(0, y, availableWidth, height, color);
                    bar.setOrigin(0, 0.5);
                    bg.setOrigin(0, 0.5);
                    contentContainer.add([bg, bar]);
                    return { bg, bar, height };
                },
                
                // Add text - returns height for flow layout
                addText: (text, options = {}) => {
                    const config = {
                        fontFamily: 'monospace',
                        fontSize: options.size || '12px',
                        fill: options.color || '#ffffff',
                        ...options.style
                    };
                    const txt = this.scene.add.text(options.x || 0, options.y || 0, text, config);
                    if (options.origin) txt.setOrigin(options.origin);
                    contentContainer.add(txt);
                    return { text: txt, height: txt.height, width: txt.width };
                },
                
                // Add text that flows below previous content
                addFlowText: (text, options = {}) => {
                    const y = contentContainer.list.reduce((max, child) => {
                        const childBottom = child.y + (child.height || 0);
                        return Math.max(max, childBottom);
                    }, 0) + (options.gap || 2);
                    
                    return layoutHelpers.addText(text, { ...options, y });
                },
                
                // Row layout - items side by side
                addRow: (items, options = {}) => {
                    const gap = options.gap || 4;
                    let currentX = 0;
                    const elements = [];
                    
                    items.forEach((item, i) => {
                        if (i > 0) currentX += gap;
                        
                        if (typeof item === 'string') {
                            const txt = layoutHelpers.addText(item, { x: currentX });
                            currentX += txt.width;
                            elements.push(txt);
                        } else if (item.type === 'icon') {
                            const txt = layoutHelpers.addText(item.value || '◆', { 
                                x: currentX, 
                                color: item.color || '#ffffff' 
                            });
                            currentX += txt.width;
                            elements.push(txt);
                        } else if (item.type === 'text') {
                            const txt = layoutHelpers.addText(item.value || '', { 
                                x: currentX,
                                size: item.size,
                                color: item.color
                            });
                            currentX += txt.width;
                            elements.push(txt);
                        }
                    });
                    
                    return elements;
                },
                
                // Get current content height - accounts for elements extending into negative Y
                getContentHeight: () => {
                    if (contentContainer.list.length === 0) return 0;
                    
                    let minY = 0;
                    let maxY = 0;
                    
                    contentContainer.list.forEach(child => {
                        const originY = child.originY !== undefined ? child.originY : 0.5;
                        const height = child.displayHeight || child.height || 0;
                        const top = child.y - height * originY;
                        const bottom = child.y + height * (1 - originY);
                        minY = Math.min(minY, top);
                        maxY = Math.max(maxY, bottom);
                    });
                    
                    return maxY - minY; // Total height including any negative Y extension
                },
                
                // Get content bounds including negative Y space
                getContentBounds: () => {
                    if (contentContainer.list.length === 0) return { top: 0, bottom: 0, height: 0 };
                    
                    let minY = 0;
                    let maxY = 0;
                    
                    contentContainer.list.forEach(child => {
                        const originY = child.originY !== undefined ? child.originY : 0.5;
                        const height = child.displayHeight || child.height || 0;
                        const top = child.y - height * originY;
                        const bottom = child.y + height * (1 - originY);
                        minY = Math.min(minY, top);
                        maxY = Math.max(maxY, bottom);
                    });
                    
                    return { top: minY, bottom: maxY, height: maxY - minY };
                }
            };
            
            // Let the system create its elements in the content container
            const userElements = createFn(contentContainer, layoutHelpers.width, layoutHelpers);
            
            // Measure actual content bounds after creation (handles negative Y space)
            const bounds = layoutHelpers.getContentBounds();
            const contentHeight = bounds.height;
            // total slot height = label + gap + content extending below label + any negative extension
            const totalSlotHeight = contentY + contentHeight;
            
            // Add to panel
            panel.content.add(slotContainer);
            
            // Store reference with actual measured height and bounds
            panel.slotMap.set(slotId, {
                container: slotContainer,
                content: contentContainer,
                elements: userElements,
                config: slotConfig,
                measuredHeight: totalSlotHeight,
                contentBounds: bounds
            });
            
            // Advance nextY based on ACTUAL measured content height
            panel.nextY += Math.max(totalSlotHeight, slotConfig.minHeight || 12) + 4; // 4px gap between slots
            
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
    
    /**
     * Register a display element - manager handles all positioning
     * @param {string} slotId - Slot identifier
     * @param {Object} display - Display configuration
     * @param {string} region - Panel region
     * @returns {Object} References to created elements
     */
    registerDisplay(slotId, display, region = 'TOP_LEFT') {
        const panel = this.panels.get(region);
        if (!panel) {
            console.warn(`[HUDPanelManager] Unknown panel: ${region}`);
            return null;
        }
        
        const slotConfig = panel.config.slots.find(s => s.id === slotId);
        if (!slotConfig) {
            console.warn(`[HUDPanelManager] Unknown slot: ${slotId} in ${region}`);
            return null;
        }
        
        // Create using registerSlot with automatic positioning
        return this.registerSlot(slotId, (container, width, layout) => {
            const elements = {};
            
            switch (display.type) {
                case 'bar':
                    // Progress bar with label value
                    const bars = layout.addBar(display.height || 6, display.color || 0x00f0ff);
                    elements.bg = bars.bg;
                    elements.bar = bars.bar;
                    if (display.value !== undefined) {
                        elements.value = layout.addText(display.value.toString(), {
                            size: display.valueSize || '10px',
                            color: display.valueColor || '#ffffff',
                            x: width - 5,
                            y: (display.height || 6) / 2,
                            origin: { x: 1, y: 0.5 }
                        });
                    }
                    break;
                    
                case 'text':
                    // Simple text value
                    elements.text = layout.addText(display.text || '', {
                        size: display.size || '12px',
                        color: display.color || '#ffffff'
                    });
                    break;
                    
                case 'value':
                    // Label + value pair
                    elements.text = layout.addText(`${display.prefix || ''}${display.value || 0}${display.suffix || ''}`, {
                        size: display.size || '14px',
                        color: display.color || '#ffffff'
                    });
                    break;
                    
                case 'icon':
                    // Icon + text pair
                    const iconText = `${display.icon || '◆'} ${display.text || ''}`;
                    elements.text = layout.addText(iconText, {
                        size: display.size || '12px',
                        color: display.color || '#ffffff'
                    });
                    break;
                    
                default:
                    // Custom - let the display provide its own renderer
                    if (display.render) {
                        display.render(container, width, layout, elements);
                    }
            }
            
            return elements;
        }, region);
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
