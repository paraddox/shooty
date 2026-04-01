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
                    { id: 'PROTEUS', label: 'EVOLUTION', type: 'compact', minHeight: 35 },
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
            },
            BOTTOM_LEFT: {
                x: this.margin, // Left-aligned
                y: null, // Bottom-relative
                width: 200, // Increased from 150 to fit longer action names
                title: 'CONTROLS',
                color: 0x00f0ff, // Cyan accent
                slots: [
                    { id: 'KEYBOARD_SHORTCUTS', label: 'KEYS', type: 'compact', minHeight: 120 },
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
            
            // Mark as HUD element so main camera can ignore it
            panel.isHUDElement = true;
            
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
        
        // Set up separate HUD camera after all panels are created
        this.setupHUDCamera();
    }
    
    /**
     * Set up a dedicated HUD camera that renders at fixed 1x zoom
     * This keeps HUD elements at constant size regardless of main camera zoom
     */
    setupHUDCamera() {
        const mainCamera = this.scene.cameras.main;
        
        // Create HUD camera FIRST (before setting up ignores)
        const hudCamera = this.scene.cameras.add(
            0, 0, // Position covers entire screen
            this.scene.scale.width,
            this.scene.scale.height,
            false // Don't make it the main camera
        );
        
        // HUD camera stays at 1x zoom always (fixed size regardless of main camera)
        hudCamera.setZoom(1);
        hudCamera.setScroll(0, 0); // Fixed position
        
        // Set depth so HUD renders on top
        hudCamera.setDepth(100);
        
        // Store reference
        this.hudCamera = hudCamera;
        
        // Now ignore HUD elements from main camera
        // They will be rendered by the HUD camera only
        this.panels.forEach((panel, region) => {
            mainCamera.ignore(panel.container);
        });
        
        // Ignore world objects from HUD camera (rendered by main camera instead)
        this.ignoreWorldObjects(hudCamera);
        
        console.log('[HUDPanelManager] HUD camera initialized - fixed 1x zoom, screen-space positioning');
    }
    
    /**
     * Ignore all world/arena objects from a camera
     * Called during setup and whenever new world objects are created
     */
    ignoreWorldObjects(camera) {
        // Ignore player
        if (this.scene.player) {
            camera.ignore(this.scene.player);
        }
        
        // Ignore enemies
        if (this.scene.enemies?.getChildren) {
            this.scene.enemies.getChildren().forEach(enemy => camera.ignore(enemy));
        }
        
        // Ignore player bullets
        if (this.scene.bullets?.getChildren) {
            this.scene.bullets.getChildren().forEach(bullet => camera.ignore(bullet));
        }
        
        // Ignore enemy bullets
        if (this.scene.enemyBullets?.getChildren) {
            this.scene.enemyBullets.getChildren().forEach(bullet => camera.ignore(bullet));
        }
        
        // Ignore other world systems' visual elements
        // These are checked by their existence
        const worldSystems = [
            'ripples', 'lithographyBodies', 'springs', 'crystals',
            'graphics', 'visualEffects', 'particles'
        ];
        
        worldSystems.forEach(systemName => {
            const system = this.scene[systemName] || this.scene.cartographer?.[systemName];
            if (system) {
                if (Array.isArray(system)) {
                    system.forEach(obj => {
                        if (obj && obj.active !== false) camera.ignore(obj);
                    });
                }
            }
        });
    }
    
    /**
     * Register a world object to be ignored by HUD camera
     * Call this when creating new game objects that shouldn't appear in HUD
     */
    registerWorldObject(gameObject) {
        if (this.hudCamera && gameObject) {
            this.hudCamera.ignore(gameObject);
        }
    }
    
    /**
     * Update HUD camera on window resize
     */
    resizeHUDCamera() {
        if (this.hudCamera) {
            this.hudCamera.setSize(this.scene.scale.width, this.scene.scale.height);
        }
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
            
            // Recalculate and update slot positions
            let nextY = 0;
            panel.slotMap.forEach((slot) => {
                slot.container.setY(nextY);
                nextY += (slot.measuredHeight || slot.config.minHeight || 12) + 4;
            });
            
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
     * Update a panel's width dynamically
     * Used when content requires more/less space than the default config width
     * @param {string} region - Panel region to update
     * @param {number} newWidth - New width in pixels
     */
    updatePanelWidth(region, newWidth) {
        const panel = this.panels.get(region);
        if (!panel) {
            console.warn(`[HUDPanelManager] Cannot update width for unknown panel: ${region}`);
            return;
        }
        
        // Only update if new width is greater than current
        if (newWidth <= panel.config.width) {
            return;
        }
        
        const oldWidth = panel.config.width;
        panel.config.width = newWidth;
        
        // Recreate background with new width
        const oldBg = panel.container.list[0];
        if (oldBg) {
            oldBg.destroy();
        }
        const newBg = this.createPanelBackground(newWidth, panel.actualHeight || this.calculatePanelHeight(panel.config), panel.config.color);
        panel.container.addAt(newBg, 0);
        
        // Update title bar width
        const titleBg = panel.container.list[1];
        if (titleBg) {
            titleBg.destroy();
            const newTitleBg = this.scene.add.rectangle(
                newWidth / 2, 
                this.panelPadding + 8, 
                newWidth - 4, 
                18, 
                panel.config.color, 
                0.15
            );
            newTitleBg.setStrokeStyle(1, panel.config.color, 0.3);
            panel.container.addAt(newTitleBg, 1);
        }
        
        // Reposition title text
        const titleText = panel.container.list[2];
        if (titleText) {
            titleText.setX(newWidth / 2);
        }
        
        // Reposition panel if right-aligned
        if (panel.config.x !== null && region.includes('RIGHT')) {
            const screenW = this.scene.scale.width;
            const newX = screenW - this.margin - newWidth;
            panel.container.setX(newX);
        }
        
        console.log(`[HUDPanelManager] ${region} panel width updated: ${oldWidth}px → ${newWidth}px`);
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
            
            // Add inactive indicator (shown when content is hidden)
            const inactiveIndicator = this.scene.add.text(0, contentY, '—', {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#444444'
            });
            inactiveIndicator.setOrigin(0, 0);
            inactiveIndicator.setVisible(false); // Hidden by default
            slotContainer.add(inactiveIndicator);
            
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
     * Update the height of a slot and recalculate panel layout
     * Call this when slot content changes size
     * @param {string} slotId - The slot identifier
     * @param {number} newHeight - The new height in pixels
     * @returns {boolean} Whether the update succeeded
     */
    updateSlotHeight(slotId, newHeight) {
        // Find which panel contains this slot
        for (const [region, panel] of this.panels) {
            if (panel.slotMap.has(slotId)) {
                const slot = panel.slotMap.get(slotId);
                const oldHeight = slot.measuredHeight;
                
                // Update the slot's measured height
                slot.measuredHeight = newHeight;
                
                console.log(`[HUDPanelManager] Slot ${slotId} height: ${oldHeight}px → ${newHeight}px`);
                
                // Recalculate the entire panel layout
                this.recalculatePanelHeights();
                
                return true;
            }
        }
        
        console.warn(`[HUDPanelManager] Cannot update height: slot ${slotId} not found`);
        return false;
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
     * Update slot content visibility and show inactive indicator when hidden
     * @param {string} slotId - Slot identifier
     * @param {string} region - Panel region
     * @param {Object} options - Update options
     * @param {string} options.label - New label (optional)
     * @param {boolean} options.visible - Container visibility (optional)
     * @param {boolean} options.contentVisible - Content area visibility (optional)
     */
    updateSlot(slotId, region, { label, visible, contentVisible } = {}) {
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
        
        // Handle content visibility - show inactive indicator when content hidden
        if (contentVisible !== undefined) {
            const contentContainer = slot.content;
            const inactiveIndicator = slot.container.list[2]; // Index 2 is inactive indicator
            
            if (contentContainer) {
                contentContainer.setVisible(contentVisible);
            }
            if (inactiveIndicator) {
                inactiveIndicator.setVisible(!contentVisible);
            }
            
            // Dim the label when inactive
            const labelText = slot.container.list[0];
            if (labelText && labelText.setColor) {
                labelText.setColor(contentVisible ? '#666677' : '#333344');
            }
        }
    }
    
    /**
     * Check if slot content is visible (has visible elements)
     * @param {string} slotId - Slot identifier  
     * @param {string} region - Panel region
     * @returns {boolean} true if any content element is visible
     */
    isSlotContentVisible(slotId, region) {
        const panel = this.panels.get(region);
        if (!panel) return false;
        
        const slot = panel.slotMap.get(slotId);
        if (!slot || !slot.content) return false;
        
        // Check if any content element is visible
        for (const child of slot.content.list) {
            if (child.visible !== false) {
                return true;
            }
        }
        return false;
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
