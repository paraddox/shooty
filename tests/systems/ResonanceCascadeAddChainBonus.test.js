import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ResonanceCascadeSystem Chain Bonus Tests
 * 
 * Tests for the addChainBonus method that adds bonus steps to the chain.
 * This is called by BootstrapProtocolSystem when a prophecy is fulfilled.
 */

describe('ResonanceCascadeSystem addChainBonus', () => {
    let system;
    let mockScene;
    
    beforeEach(() => {
        mockScene = {
            add: {
                text: vi.fn(() => ({
                    setOrigin: vi.fn(),
                    setDepth: vi.fn(),
                    setVisible: vi.fn(),
                    setText: vi.fn(),
                    setFill: vi.fn(),
                    destroy: vi.fn(),
                    x: 0, y: 0
                })),
                circle: vi.fn(() => ({
                    setAlpha: vi.fn(),
                    setDepth: vi.fn(),
                    setFillStyle: vi.fn(),
                    destroy: vi.fn()
                }))
            },
            hudPanels: {
                registerSlot: vi.fn((slotId, callback) => {
                    const container = {
                        setDepth: vi.fn(),
                        setVisible: vi.fn(),
                        add: vi.fn()
                    };
                    callback(container, 200, { direction: 'vertical' });
                })
            }
        };
        
        // Create minimal ResonanceCascadeSystem
        system = {
            scene: mockScene,
            activeChain: [],
            chainStartTime: 0,
            chainTimer: 0,
            chainWindow: 4.0,
            currentMultiplier: 1.0,
            baseMultiplier: 1.0,
            multiplierGainPerStep: 0.5,
            resonanceState: 'NONE',
            chainHistory: [],
            maxChainRecorded: 0,
            chainDisplay: null,
            multiplierText: null,
            sequenceDots: [],
            chainBreakProtection: false,
            chainBreakProtectionUses: 0,
            chainWindowBonus: 0,
            
            /**
             * Record a system activation in the chain
             */
            recordActivation(systemType, metadata = {}) {
                const now = Date.now() / 1000;
                
                // Check if chain has expired
                if (this.activeChain.length > 0 && now - this.chainTimer > this.chainWindow + this.chainWindowBonus) {
                    if (!this.chainBreakProtection) {
                        this.breakChain();
                    } else {
                        // Use protection
                        this.chainBreakProtectionUses--;
                        if (this.chainBreakProtectionUses <= 0) {
                            this.chainBreakProtection = false;
                        }
                    }
                }
                
                // Start new chain if empty
                if (this.activeChain.length === 0) {
                    this.chainStartTime = now;
                    this.currentMultiplier = this.baseMultiplier;
                }
                
                // Add to chain
                this.activeChain.push({
                    systemType,
                    timestamp: now,
                    metadata
                });
                
                this.chainTimer = now;
                
                // Update multiplier
                this.currentMultiplier += this.multiplierGainPerStep;
                
                // Update resonance state
                this.updateResonanceState();
                
                return this.currentMultiplier;
            },
            
            /**
             * Add bonus steps to the chain (called by BootstrapProtocolSystem)
             * @param {number} bonusSteps - Number of bonus steps to add
             */
            addChainBonus(bonusSteps) {
                const now = Date.now() / 1000;
                
                // Ensure chain is active
                if (this.activeChain.length === 0) {
                    this.chainStartTime = now;
                    this.currentMultiplier = this.baseMultiplier;
                }
                
                // Add bonus steps
                for (let i = 0; i < bonusSteps; i++) {
                    this.activeChain.push({
                        systemType: 'BONUS',
                        timestamp: now,
                        metadata: { source: 'bootstrap_singularity' }
                    });
                    
                    // Update multiplier for each bonus step
                    this.currentMultiplier += this.multiplierGainPerStep;
                }
                
                // Update chain timer to extend window
                this.chainTimer = now;
                
                // Update resonance state
                this.updateResonanceState();
                
                console.log(`[ResonanceCascade] Added ${bonusSteps} bonus steps. Chain: ${this.activeChain.length}, Multiplier: ${this.currentMultiplier.toFixed(1)}x`);
                
                return this.currentMultiplier;
            },
            
            /**
             * Update resonance state based on chain length
             */
            updateResonanceState() {
                const chainLength = this.activeChain.length;
                
                if (chainLength >= 4) {
                    this.resonanceState = 'TRANSCENDENT';
                } else if (chainLength >= 3) {
                    this.resonanceState = 'SYMPHONIC';
                } else if (chainLength >= 2) {
                    this.resonanceState = 'HARMONIC';
                } else {
                    this.resonanceState = 'NONE';
                }
                
                // Track max chain
                if (chainLength > this.maxChainRecorded) {
                    this.maxChainRecorded = chainLength;
                }
            },
            
            /**
             * Break the chain and reset
             */
            breakChain() {
                if (this.activeChain.length > 0) {
                    this.chainHistory.push({
                        length: this.activeChain.length,
                        multiplier: this.currentMultiplier,
                        startTime: this.chainStartTime,
                        endTime: Date.now() / 1000
                    });
                }
                
                this.activeChain = [];
                this.currentMultiplier = this.baseMultiplier;
                this.resonanceState = 'NONE';
                this.chainWindowBonus = 0;
            },
            
            /**
             * Get current chain info
             */
            getChainInfo() {
                return {
                    length: this.activeChain.length,
                    multiplier: this.currentMultiplier,
                    state: this.resonanceState,
                    timeRemaining: this.chainWindow + this.chainWindowBonus - (Date.now() / 1000 - this.chainTimer)
                };
            }
        };
    });
    
    describe('addChainBonus', () => {
        it('should exist as a method', () => {
            expect(typeof system.addChainBonus).toBe('function');
        });
        
        it('should add bonus steps to an empty chain', () => {
            const result = system.addChainBonus(3);
            
            expect(system.activeChain.length).toBe(3);
            expect(result).toBeGreaterThan(1);
        });
        
        it('should add bonus steps to an existing chain', () => {
            // Start a chain
            system.recordActivation('FRACTURE');
            system.recordActivation('ECHO');
            
            expect(system.activeChain.length).toBe(2);
            
            // Add bonus
            system.addChainBonus(5);
            
            expect(system.activeChain.length).toBe(7);
        });
        
        it('should increase multiplier for each bonus step', () => {
            const initialMultiplier = system.currentMultiplier;
            
            system.addChainBonus(3);
            
            // Each step adds 0.5 to multiplier
            // 3 steps = 1.5 increase
            expect(system.currentMultiplier).toBe(initialMultiplier + 1.5);
        });
        
        it('should mark bonus steps with BONUS system type', () => {
            system.addChainBonus(2);
            
            const bonusSteps = system.activeChain.filter(step => step.systemType === 'BONUS');
            expect(bonusSteps.length).toBe(2);
        });
        
        it('should include bootstrap_singularity metadata', () => {
            system.addChainBonus(1);
            
            const bonusStep = system.activeChain.find(step => step.systemType === 'BONUS');
            expect(bonusStep.metadata.source).toBe('bootstrap_singularity');
        });
        
        it('should update resonance state when adding bonus steps', () => {
            // Add enough steps to reach TRANSCENDENT state
            system.addChainBonus(4);
            
            expect(system.resonanceState).toBe('TRANSCENDENT');
        });
        
        it('should reset chain timer when adding bonus', () => {
            const beforeTimer = system.chainTimer;
            
            // Wait a bit (simulate)
            system.chainTimer = Date.now() / 1000 - 1;
            
            system.addChainBonus(1);
            
            // Timer should be reset to now
            expect(system.chainTimer).toBeGreaterThan(beforeTimer);
        });
        
        it('should return the new multiplier value', () => {
            const result = system.addChainBonus(2);
            
            expect(result).toBe(system.currentMultiplier);
            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });
        
        it('should update max chain recorded', () => {
            system.addChainBonus(5);
            
            expect(system.maxChainRecorded).toBe(5);
        });
    });
    
    describe('Integration with recordActivation', () => {
        it('should allow mixing regular and bonus activations', () => {
            system.recordActivation('FRACTURE');
            system.addChainBonus(2);
            system.recordActivation('ENTANGLEMENT');
            
            expect(system.activeChain.length).toBe(4);
            expect(system.activeChain[0].systemType).toBe('FRACTURE');
            expect(system.activeChain[1].systemType).toBe('BONUS');
            expect(system.activeChain[2].systemType).toBe('BONUS');
            expect(system.activeChain[3].systemType).toBe('ENTANGLEMENT');
        });
        
        it('should maintain correct multiplier calculation with mixed chain', () => {
            system.recordActivation('FRACTURE'); // +0.5
            system.addChainBonus(2); // +1.0
            
            // Base 1.0 + 0.5 + 1.0 = 2.5
            expect(system.currentMultiplier).toBe(2.5);
        });
    });
});
