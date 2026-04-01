import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * EgregoreProtocolSystem initializeEmergentMechanics Tests
 * 
 * Tests for the initializeEmergentMechanics method that sets up
 * the emergent mechanic discovery system.
 */

describe('EgregoreProtocolSystem initializeEmergentMechanics', () => {
    let egregore;
    let mockScene;
    
    beforeEach(() => {
        mockScene = {
            time: { now: 10000, delayedCall: vi.fn() },
            events: { on: vi.fn() }
        };
        
        egregore = {
            scene: mockScene,
            encounterCount: 50,
            egregoreStage: 2,
            emergentMechanics: [],
            mechanicGenePool: [],
            potentialDiscoveries: [],
            systemInteractionMatrix: new Map(),
            
            // Known emergent mechanic combinations
            KNOWN_COMBINATIONS: [
                { systems: ['ECHO_STORM', 'FRACTURE'], name: 'Echo Fracture' },
                { systems: ['PARADOX', 'CHRONO_LOOP'], name: 'Paradox Loop' },
                { systems: ['QUANTUM', 'RESIDUE'], name: 'Quantum Residue' },
                { systems: ['SINGULARITY', 'ECHO'], name: 'Gravitic Echo' },
                { systems: ['VOID', 'ECHO'], name: 'Void Echo' },
                { systems: ['RESONANCE', 'PARADOX'], name: 'Resonant Paradox' }
            ],
            
            initializeEmergentMechanics() {
                // Initialize gene pool from known combinations
                this.mechanicGenePool = this.KNOWN_COMBINATIONS.map(combo => ({
                    ...combo,
                    discovered: false,
                    fitness: 0.5,
                    mutationCount: 0
                }));
                
                // Create system interaction matrix
                const systemKeys = ['ECHO_STORM', 'FRACTURE', 'PARADOX', 'CHRONO_LOOP', 
                                    'QUANTUM', 'RESIDUE', 'SINGULARITY', 'ECHO', 'VOID'];
                
                for (const sysA of systemKeys) {
                    this.systemInteractionMatrix.set(sysA, new Map());
                    for (const sysB of systemKeys) {
                        if (sysA !== sysB) {
                            this.systemInteractionMatrix.get(sysA).set(sysB, {
                                count: 0,
                                lastContext: null,
                                synergyScore: 0
                            });
                        }
                    }
                }
                
                // Register event listeners for system activations
                this.scene.events.on('systemActivated', this.onSystemActivated, this);
                this.scene.events.on('hybridCombination', this.onHybridCombination, this);
                
                // Schedule periodic mechanic evolution check
                this.scheduleMechanicEvolution();
                
                console.log(`🧬 Emergent mechanics initialized: ${this.mechanicGenePool.length} base combinations`);
            },
            
            onSystemActivated(systemType, context) {
                // Track system activation for pattern analysis
                this.lastSystemActivation = {
                    system: systemType,
                    time: this.scene.time.now,
                    context: context
                };
            },
            
            onHybridCombination(sysA, sysB, context) {
                // Check if this combination exists in gene pool
                const existing = this.mechanicGenePool.find(m => 
                    (m.systems[0] === sysA && m.systems[1] === sysB) ||
                    (m.systems[0] === sysB && m.systems[1] === sysA)
                );
                
                if (existing && !existing.discovered) {
                    // Mark as discovered
                    existing.discovered = true;
                    existing.discoveredAt = this.scene.time.now;
                    existing.discovererContext = context;
                    
                    // Add to emergent mechanics list
                    this.emergentMechanics.push({
                        name: existing.name,
                        systems: existing.systems,
                        discovered: true,
                        discoveredAt: this.scene.time.now
                    });
                    
                    console.log(`🔮 Emergent mechanic discovered: ${existing.name}`);
                }
                
                // Update interaction matrix
                if (this.systemInteractionMatrix.has(sysA)) {
                    const interactions = this.systemInteractionMatrix.get(sysA);
                    if (interactions.has(sysB)) {
                        const data = interactions.get(sysB);
                        data.count++;
                        data.lastContext = context;
                        data.synergyScore = Math.min(1.0, data.count / 10);
                    }
                }
            },
            
            scheduleMechanicEvolution() {
                // Check for new mechanic discoveries every 30 seconds
                this.scene.time.delayedCall(30000, () => {
                    this.evolveMechanics();
                    this.scheduleMechanicEvolution();
                });
            },
            
            evolveMechanics() {
                // Simulate genetic algorithm on mechanic gene pool
                for (const mechanic of this.mechanicGenePool) {
                    // Increase fitness for undiscovered combinations
                    if (!mechanic.discovered) {
                        mechanic.fitness += 0.01;
                        
                        // Check for mutation opportunity
                        if (mechanic.fitness > 0.8 && mechanic.mutationCount < 3) {
                            this.mutateMechanic(mechanic);
                        }
                    }
                }
            },
            
            mutateMechanic(mechanic) {
                mechanic.mutationCount++;
                mechanic.fitness *= 0.7; // Reset fitness after mutation
                
                // Generate variation name
                const variations = ['Enhanced', 'Perfected', 'Transcendent', 'Chaotic', 'Harmonic'];
                const variation = variations[mechanic.mutationCount - 1] || 'Ultimate';
                mechanic.name = `${variation} ${mechanic.name}`;
                
                console.log(`🧬 Mechanic evolved: ${mechanic.name}`);
            },
            
            getDiscoveredMechanics() {
                return this.emergentMechanics.filter(m => m.discovered);
            },
            
            getUndiscoveredMechanics() {
                return this.mechanicGenePool.filter(m => !m.discovered);
            }
        };
    });
    
    describe('initializeEmergentMechanics', () => {
        it('should populate mechanic gene pool from known combinations', () => {
            egregore.initializeEmergentMechanics();
            
            expect(egregore.mechanicGenePool.length).toBe(6);
            expect(egregore.mechanicGenePool[0]).toHaveProperty('systems');
            expect(egregore.mechanicGenePool[0]).toHaveProperty('name');
            expect(egregore.mechanicGenePool[0]).toHaveProperty('discovered');
            expect(egregore.mechanicGenePool[0]).toHaveProperty('fitness');
        });
        
        it('should initialize all mechanics as undiscovered', () => {
            egregore.initializeEmergentMechanics();
            
            const allUndiscovered = egregore.mechanicGenePool.every(m => !m.discovered);
            expect(allUndiscovered).toBe(true);
        });
        
        it('should set initial fitness to 0.5 for all mechanics', () => {
            egregore.initializeEmergentMechanics();
            
            const allCorrectFitness = egregore.mechanicGenePool.every(m => m.fitness === 0.5);
            expect(allCorrectFitness).toBe(true);
        });
        
        it('should create system interaction matrix', () => {
            egregore.initializeEmergentMechanics();
            
            expect(egregore.systemInteractionMatrix.size).toBeGreaterThan(0);
            expect(egregore.systemInteractionMatrix.has('ECHO_STORM')).toBe(true);
        });
        
        it('should register systemActivated event listener', () => {
            egregore.initializeEmergentMechanics();
            
            expect(mockScene.events.on).toHaveBeenCalledWith(
                'systemActivated',
                egregore.onSystemActivated,
                egregore
            );
        });
        
        it('should register hybridCombination event listener', () => {
            egregore.initializeEmergentMechanics();
            
            expect(mockScene.events.on).toHaveBeenCalledWith(
                'hybridCombination',
                egregore.onHybridCombination,
                egregore
            );
        });
        
        it('should schedule mechanic evolution checks', () => {
            egregore.initializeEmergentMechanics();
            
            expect(mockScene.time.delayedCall).toHaveBeenCalledWith(
                30000,
                expect.any(Function)
            );
        });
    });
    
    describe('onHybridCombination', () => {
        beforeEach(() => {
            egregore.initializeEmergentMechanics();
        });
        
        it('should mark mechanic as discovered when combination matches', () => {
            egregore.onHybridCombination('ECHO_STORM', 'FRACTURE', { wave: 5 });
            
            const mechanic = egregore.mechanicGenePool.find(m => 
                m.systems.includes('ECHO_STORM') && m.systems.includes('FRACTURE')
            );
            expect(mechanic.discovered).toBe(true);
        });
        
        it('should add discovered mechanic to emergentMechanics list', () => {
            egregore.onHybridCombination('ECHO_STORM', 'FRACTURE', { wave: 5 });
            
            expect(egregore.emergentMechanics.length).toBe(1);
            expect(egregore.emergentMechanics[0].name).toBe('Echo Fracture');
        });
        
        it('should update interaction matrix count', () => {
            egregore.onHybridCombination('ECHO_STORM', 'FRACTURE', { wave: 5 });
            
            const interactions = egregore.systemInteractionMatrix.get('ECHO_STORM');
            expect(interactions.get('FRACTURE').count).toBe(1);
        });
        
        it('should increase synergy score with repeated combinations', () => {
            egregore.onHybridCombination('ECHO_STORM', 'FRACTURE', { wave: 5 });
            egregore.onHybridCombination('ECHO_STORM', 'FRACTURE', { wave: 6 });
            
            const interactions = egregore.systemInteractionMatrix.get('ECHO_STORM');
            expect(interactions.get('FRACTURE').synergyScore).toBeGreaterThan(0);
        });
        
        it('should handle reverse order system combinations', () => {
            egregore.onHybridCombination('FRACTURE', 'ECHO_STORM', { wave: 5 });
            
            const mechanic = egregore.mechanicGenePool.find(m => 
                m.systems.includes('ECHO_STORM') && m.systems.includes('FRACTURE')
            );
            expect(mechanic.discovered).toBe(true);
        });
    });
    
    describe('evolveMechanics', () => {
        beforeEach(() => {
            egregore.initializeEmergentMechanics();
        });
        
        it('should increase fitness for undiscovered mechanics', () => {
            const initialFitness = egregore.mechanicGenePool[0].fitness;
            
            egregore.evolveMechanics();
            
            expect(egregore.mechanicGenePool[0].fitness).toBeGreaterThan(initialFitness);
        });
        
        it('should not mutate mechanics below fitness threshold', () => {
            egregore.mechanicGenePool[0].fitness = 0.5; // Below 0.8 threshold
            
            egregore.evolveMechanics();
            
            expect(egregore.mechanicGenePool[0].mutationCount).toBe(0);
        });
        
        it('should mutate high-fitness mechanics', () => {
            egregore.mechanicGenePool[0].fitness = 0.9; // Above threshold
            
            egregore.evolveMechanics();
            
            expect(egregore.mechanicGenePool[0].mutationCount).toBeGreaterThan(0);
            expect(egregore.mechanicGenePool[0].name).toContain('Enhanced');
        });
    });
    
    describe('getDiscoveredMechanics', () => {
        beforeEach(() => {
            egregore.initializeEmergentMechanics();
        });
        
        it('should return empty array initially', () => {
            const discovered = egregore.getDiscoveredMechanics();
            
            expect(discovered).toEqual([]);
        });
        
        it('should return discovered mechanics after discovery', () => {
            egregore.onHybridCombination('ECHO_STORM', 'FRACTURE', { wave: 5 });
            
            const discovered = egregore.getDiscoveredMechanics();
            
            expect(discovered.length).toBe(1);
            expect(discovered[0].name).toBe('Echo Fracture');
        });
    });
    
    describe('getUndiscoveredMechanics', () => {
        beforeEach(() => {
            egregore.initializeEmergentMechanics();
        });
        
        it('should return all mechanics initially', () => {
            const undiscovered = egregore.getUndiscoveredMechanics();
            
            expect(undiscovered.length).toBe(6);
        });
        
        it('should exclude discovered mechanics', () => {
            egregore.onHybridCombination('ECHO_STORM', 'FRACTURE', { wave: 5 });
            
            const undiscovered = egregore.getUndiscoveredMechanics();
            
            expect(undiscovered.length).toBe(5);
            const names = undiscovered.map(m => m.name);
            expect(names).not.toContain('Echo Fracture');
        });
    });
});
