/**
 * HUDLayoutManager — Centralized HUD element positioning system
 * 
 * Manages all HUD elements in predefined screen regions with slot allocation.
 * Prevents overlapping by assigning each element to a specific position.
 * 
 * Screen Layout:
 * 
 *     TOP-LEFT (margin=30)          TOP-CENTER              TOP-RIGHT
 *     ┌─────────────────┐            ┌──────────┐           ┌─────────────────┐
 *     │ OmniWeapon      │            │          │           │ Wave Timer      │
 *     │ (y=15)          │            │ Symbiosis│           │ (y=15)          │
 *     ├─────────────────┤            │ (y=40)   │           ├─────────────────┤
 *     │ Health Bar      │            │          │           │ Resonance Orb   │
 *     │ (y=30)          │            │ Resonance│           │ (y=50)          │
 *     ├─────────────────┤            │ Cascade  │           ├─────────────────┤
 *     │ Score           │            │ (y=80)   │           │ Quantum Immort. │
 *     │ (y=55)          │            └──────────┘           │ (y=80)          │
 *     ├─────────────────┤                                    ├─────────────────┤
 *     │ Wave            │                                    │ Debt (Contract) │
 *     │ (y=80)          │                                    │ (y=110)         │
 *     ├─────────────────┤                                    └─────────────────┘
 *     │ Enemy Count     │
 *     │ (y=100)         │
 *     ├─────────────────┤
 *     │ Syntropy        │
 *     │ (y=120)         │
 *     ├─────────────────┤
 *     │ Convergence     │
 *     │ (y=140)         │
 *     ├─────────────────┤
 *     │ Synthesis       │
 *     │ (y=160)         │
 *     ├─────────────────┤
 *     │ Pattern         │
 *     │ (y=180)         │
 *     ├─────────────────┤
 *     │ Void Coherence  │
 *     │ (y=200)         │
 *     ├─────────────────┤
 *     │ Chrono Loop     │
 *     │ (y=220)         │
 *     ├─────────────────┤
 *     │ Causal Link     │
 *     │ (y=240)         │
 *     ├─────────────────┤
 *     │ Temporal Rewind │
 *     │ (y=260)         │
 *     └─────────────────┘
 * 
 *     BOTTOM-RIGHT (margin=30 from bottom)
 *     ┌─────────────────┐
 *     │ Meta-System     │
 *     │ (y=-80)         │
 *     ├─────────────────┤
 *     │ Aperture        │
 *     │ (y=-50)         │
 *     └─────────────────┘
 */

export default class HUDLayoutManager {
    constructor(scene) {
        this.scene = scene;
        this.margin = 30;
        this.slots = new Map(); // Track occupied slots
        this.elements = new Map(); // Track all HUD elements
        
        // Define slot positions (y coordinates for left column, etc.)
        this.SLOTS = {
            TOP_LEFT: {
                OMNI_WEAPON: { x: this.margin, y: 15 },
                HEALTH_BAR: { x: this.margin, y: 30 },
                SCORE: { x: this.margin, y: 55 },
                WAVE: { x: this.margin, y: 80 },
                ENEMY_COUNT: { x: this.margin, y: 100 },
                NEAR_MISS: { x: this.margin, y: 115 },
                SYNTROPY: { x: this.margin, y: 135 },
                CONVERGENCE: { x: this.margin, y: 155 },
                SYNTHESIS: { x: this.margin, y: 175 },
                PATTERN: { x: this.margin, y: 195 },
                VOID_COHERENCE: { x: this.margin, y: 215 },
                CHRONO_LOOP: { x: this.margin, y: 235 },
                CAUSAL_LINK: { x: this.margin, y: 255 },
                TEMPORAL_REWIND: { x: this.margin, y: 275 },
            },
            TOP_CENTER: {
                SYMBIOSIS: { x: null, y: 40 }, // Centered
                RESONANCE_CASCADE: { x: null, y: 80 }, // Centered
            },
            TOP_RIGHT: {
                WAVE_TIMER: { x: null, y: 15 }, // Right-aligned - thin bar
                RESONANCE_ORB: { x: null, y: 70 }, // Right-aligned (was 50, +20 for superpositionText headroom)
                QUANTUM_IMMORTALITY: { x: null, y: 105 }, // Right-aligned (was 80, +25 for label headroom)
                DEBT_DISPLAY: { x: null, y: 140 }, // Right-aligned (was 110, +30 spacing)
            },
            BOTTOM_RIGHT: {
                META_SYSTEM: { x: null, y: -100 }, // Bottom relative (was -80, -20 for full panel height)
                APERTURE: { x: null, y: -50 }, // Bottom relative (50px gap below MetaSystem)
            }
        };
    }

    /**
     * Register a HUD element at a specific slot
     * @param {string} slotName - The slot name (e.g., 'HEALTH_BAR')
     * @param {Phaser.GameObjects.GameObject} element - The element to register
     * @param {string} region - Region name ('TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT', 'BOTTOM_RIGHT')
     * @returns {Object} Position {x, y} for the slot
     */
    registerSlot(slotName, element, region = 'TOP_LEFT') {
        // Check if slot is already occupied
        if (this.slots.has(slotName)) {
            console.warn(`[HUDLayoutManager] Slot ${slotName} is already occupied!`);
            // Move existing element to debug position
            const existing = this.slots.get(slotName);
            if (existing && existing.element) {
                existing.element.setPosition(10, 10);
                existing.element.setAlpha(0.3);
            }
        }

        // Get slot position
        const slot = this.SLOTS[region]?.[slotName];
        if (!slot) {
            console.warn(`[HUDLayoutManager] Unknown slot: ${slotName} in ${region}`);
            return null;
        }

        // Calculate actual position
        let x = slot.x;
        let y = slot.y;

        // Handle dynamic positions (center/right/bottom)
        if (x === null) {
            const screenWidth = this.scene.scale.width;
            const screenHeight = this.scene.scale.height;
            
            if (region === 'TOP_CENTER') {
                x = screenWidth / 2; // Center of screen
            }
            if (region === 'TOP_RIGHT') {
                x = screenWidth - this.margin;
            }
            if (region === 'BOTTOM_RIGHT') {
                x = screenWidth - this.margin;
                y = screenHeight + y; // y is negative, so this moves it up from bottom
            }
        }

        // Store slot info
        this.slots.set(slotName, {
            element: element,
            region: region,
            x: x,
            y: y
        });

        // Position the element
        if (element && element.setPosition) {
            element.setPosition(x, y);
        }

        return { x, y };
    }

    /**
     * Get position for a slot without registering
     * @param {string} slotName - The slot name
     * @param {string} region - Region name
     * @returns {Object} Position {x, y}
     */
    getSlotPosition(slotName, region = 'TOP_LEFT') {
        const slot = this.SLOTS[region]?.[slotName];
        if (!slot) return null;

        let x = slot.x;
        let y = slot.y;

        if (x === null) {
            const screenWidth = this.scene.scale.width;
            const screenHeight = this.scene.scale.height;
            
            if (region === 'TOP_CENTER') {
                x = screenWidth / 2; // Center of screen
            }
            if (region === 'TOP_RIGHT') {
                x = screenWidth - this.margin;
            }
            if (region === 'BOTTOM_RIGHT') {
                x = screenWidth - this.margin;
                y = screenHeight + y;
            }
        }

        return { x, y };
    }

    /**
     * Register a container-based HUD element
     * @param {string} slotName - The slot name
     * @param {Function} createFn - Function that creates and returns the container
     * @param {string} region - Region name
     * @returns {Phaser.GameObjects.Container} The created container
     */
    registerContainer(slotName, createFn, region = 'TOP_LEFT') {
        const pos = this.getSlotPosition(slotName, region);
        if (!pos) {
            console.warn(`[HUDLayoutManager] Cannot find position for ${slotName}`);
            return null;
        }

        // Create the container
        const container = createFn(pos.x, pos.y);
        
        if (container) {
            container.setScrollFactor(0);
            container.setDepth(100);
            this.registerSlot(slotName, container, region);
        }

        return container;
    }

    /**
     * Release a slot when a system is destroyed
     * @param {string} slotName - The slot to release
     */
    releaseSlot(slotName) {
        this.slots.delete(slotName);
    }

    /**
     * Update positions on resize
     */
    onResize() {
        // Recalculate positions for dynamic slots
        this.slots.forEach((slot, slotName) => {
            const pos = this.getSlotPosition(slotName, slot.region);
            if (pos && slot.element && slot.element.setPosition) {
                slot.element.setPosition(pos.x, pos.y);
            }
        });
    }

    /**
     * Debug: Show slot boundaries
     */
    showDebug() {
        // Draw slot boundaries
        const graphics = this.scene.add.graphics();
        graphics.setScrollFactor(0);
        graphics.setDepth(999);
        
        this.slots.forEach((slot) => {
            graphics.lineStyle(1, 0xff0000, 0.5);
            graphics.strokeRect(slot.x - 2, slot.y - 2, 4, 4);
        });
    }

    /**
     * Get all registered slots for debugging
     */
    getDebugInfo() {
        const info = [];
        this.slots.forEach((slot, name) => {
            info.push(`${name}: (${slot.x.toFixed(0)}, ${slot.y.toFixed(0)})`);
        });
        return info.join('\n');
    }
}
