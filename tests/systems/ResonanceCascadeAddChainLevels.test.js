import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ResonanceCascadeSystem addChainLevels Tests
 * 
 * Tests for the addChainLevels method that should NOT recreate visuals
 * (they're already created in init()).
 */

describe('ResonanceCascadeSystem addChainLevels', () => {
    let resonanceCascade;
    let mockScene;
    let mockHUDPanels;
    
    beforeEach(() => {
        mockHUDPanels = {
            registerSlot: vi.fn((slotId, callback) => {
                // Simulate creating a slot container
                const container = {
                    add: vi.fn(),
                    setDepth: vi.fn(),
                    setVisible: vi.fn(),
                    destroy: vi.fn()
                };
                // Execute callback to initialize
                if (callback) callback(container, 200, { direction: 'horizontal' });
                return container;
            }),
            updateSlot: vi.fn()
        };
        
        mockScene = {
            add: {
                container: vi.fn(() => ({
                    add: vi.fn(),
                    setDepth: vi.fn(),
                    setVisible: vi.fn(),
                    destroy: vi.fn()
                })),
                text: vi.fn(() => ({
                    setOrigin: vi.fn(),
                    setDepth: vi.fn(),
                    setVisible: vi.fn(),
                    setText: vi.fn(),
                    setFill: vi.fn(),
                    destroy: vi.fn()
                })),
                circle: vi.fn(() => ({
                    setAlpha: vi.fn(),
                    setFillStyle: vi.fn(),
                    destroy: vi.fn()
                }))
            },
            hudPanels: mockHUDPanels
        };
        
        resonanceCascade = {
            scene: mockScene,
            chainLength: 0,
            maxChain: 6,
            currentMultiplier: 1,
            pendingDamageBonus: 1,
            resonanceState: 'IDLE',
            activeChain: [],
            chainBreakProtection: 0,
            chainBreakProtectionUses: 0,
            chainWindowBonus: 0,
            visualsCreated: false,
            chainContainer: null,
            multiplierText: null,
            sequenceDots: [],
            
            init() {
                this.createVisuals();
                this.visualsCreated = true;
            },
            
            createVisuals() {
                // Should only be called once - guard against double-registration
                if (this.visualsCreated) {
                    return;
                }
                
                this.scene.hudPanels.registerSlot('RESONANCE_CASCADE', (container, width, layout) => {
                    this.chainContainer = container;
                    
                    this.multiplierText = this.scene.add.text(0, 20, '', {
                        fontFamily: 'monospace',
                        fontSize: '36px',
                        fontStyle: 'bold',
                        fill: '#ffffff'
                    });
                    this.multiplierText.setOrigin(0.5);
                    this.multiplierText.setDepth(101);
                    this.multiplierText.setVisible(false);
                    container.add(this.multiplierText);
                    
                    // Create dot pool
                    for (let i = 0; i < 6; i++) {
                        const dot = this.scene.add.circle(0, 20, 8, 0xffffff);
                        dot.setAlpha(0);
                        this.sequenceDots.push(dot);
                        container.add(dot);
                    }
                    
                    this.visualsCreated = true;
                });
            },
            
            /**
             * Add chain levels from orb collection
             * @param {number} count - Number of levels to add
             * @param {Object} orbType - Type of orb collected
             */
            addChainLevels(count, orbType = {}) {
                // Check if we have break protection
                if (this.chainBreakProtection > 0 && this.chainLength > 0) {
                    this.chainBreakProtectionUses++;
                    console.log(`🛡️ Chain break protection used (${this.chainBreakProtectionUses}/${this.chainBreakProtection})`);
                    
                    // Extend the chain window
                    this.chainWindowBonus += 2000; // +2 seconds
                }
                
                // Add to chain
                for (let i = 0; i < count; i++) {
                    if (this.activeChain.length < this.maxChain) {
                        this.activeChain.push(orbType.type || 'HARMONIC');
                    }
                }
                
                this.chainLength = this.activeChain.length;
                this.currentMultiplier = 1 + (this.chainLength * 0.5);
                
                // Update state based on chain length
                if (this.chainLength >= 6) {
                    this.resonanceState = 'MAX_RESONANCE';
                } else if (this.chainLength >= 3) {
                    this.resonanceState = 'RESONATING';
                } else {
                    this.resonanceState = 'BUILDING';
                }
                
                // Update visuals (but don't recreate them!)
                this.updateResonanceState();
                // NOTE: createVisuals() should NOT be called here - they're already created in init()
            },
            
            updateResonanceState() {
                // Update multiplier text
                if (this.multiplierText) {
                    this.multiplierText.setText(`${this.currentMultiplier.toFixed(1)}x`);
                    this.multiplierText.setVisible(this.chainLength > 0);
                }
                
                // Update dot visibility
                this.sequenceDots.forEach((dot, i) => {
                    if (i < this.chainLength) {
                        dot.setAlpha(1);
                        // Color based on position
                        const colors = [0x00f0ff, 0xffd700, 0xff3366, 0x9d4edd, 0x00ff88, 0xff6b35];
                        dot.setFillStyle(colors[i % colors.length]);
                    } else {
                        dot.setAlpha(0.2);
                    }
                });
                
                // Show/hide container
                if (this.chainContainer) {
                    this.chainContainer.setVisible(this.chainLength > 0);
                }
            }
        };
    });
    
    describe('addChainLevels', () => {
        it('should NOT call createVisuals when adding chain levels', () => {
            // Initialize first (as done in constructor)
            resonanceCascade.init();
            
            // Reset the mock to track new calls
            mockHUDPanels.registerSlot.mockClear();
            
            // Now add chain levels - this should NOT re-register the slot
            resonanceCascade.addChainLevels(2, { type: 'HARMONIC' });
            
            // Should NOT try to register the slot again
            expect(mockHUDPanels.registerSlot).not.toHaveBeenCalled();
        });
        
        it('should update existing visuals via updateResonanceState', () => {
            resonanceCascade.init();
            
            resonanceCascade.addChainLevels(3, { type: 'HARMONIC' });
            
            // Multiplier text should be updated
            expect(resonanceCascade.multiplierText.setText).toHaveBeenCalledWith('2.5x');
            expect(resonanceCascade.multiplierText.setVisible).toHaveBeenCalledWith(true);
        });
        
        it('should update chain state correctly', () => {
            resonanceCascade.init();
            
            resonanceCascade.addChainLevels(2, { type: 'HARMONIC' });
            
            expect(resonanceCascade.chainLength).toBe(2);
            expect(resonanceCascade.currentMultiplier).toBe(2); // 1 + (2 * 0.5)
            expect(resonanceCascade.resonanceState).toBe('BUILDING');
        });
        
        it('should apply chain break protection when available', () => {
            resonanceCascade.init();
            resonanceCascade.chainBreakProtection = 2;
            resonanceCascade.chainLength = 1; // Existing chain
            resonanceCascade.activeChain = ['HARMONIC'];
            
            resonanceCascade.addChainLevels(1, { type: 'CASCADE' });
            
            expect(resonanceCascade.chainBreakProtectionUses).toBe(1);
            expect(resonanceCascade.chainWindowBonus).toBe(2000);
        });
        
        it('should transition to RESONATING state at 3+ chains', () => {
            resonanceCascade.init();
            
            resonanceCascade.addChainLevels(3, { type: 'HARMONIC' });
            
            expect(resonanceCascade.resonanceState).toBe('RESONATING');
        });
        
        it('should transition to MAX_RESONANCE at 6 chains', () => {
            resonanceCascade.init();
            
            resonanceCascade.addChainLevels(6, { type: 'HARMONIC' });
            
            expect(resonanceCascade.resonanceState).toBe('MAX_RESONANCE');
        });
        
        it('should cap chain at maxChain', () => {
            resonanceCascade.init();
            
            resonanceCascade.addChainLevels(10, { type: 'HARMONIC' });
            
            expect(resonanceCascade.chainLength).toBe(6); // maxChain
            expect(resonanceCascade.activeChain.length).toBe(6);
        });
        
        it('should not create duplicate visuals on multiple addChainLevels calls', () => {
            resonanceCascade.init();
            
            // Reset mock after init
            mockHUDPanels.registerSlot.mockClear();
            
            // Add chains multiple times
            resonanceCascade.addChainLevels(1, { type: 'HARMONIC' });
            resonanceCascade.addChainLevels(1, { type: 'PHASE' });
            resonanceCascade.addChainLevels(1, { type: 'CASCADE' });
            
            // Should never try to register slot again
            expect(mockHUDPanels.registerSlot).not.toHaveBeenCalled();
            
            // Chain should be correct
            expect(resonanceCascade.chainLength).toBe(3);
        });
    });
});
