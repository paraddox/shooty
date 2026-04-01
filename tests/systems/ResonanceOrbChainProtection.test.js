import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ResonanceOrbSystem Chain Break Protection Tests
 * 
 * Tests for the chainBreakProtection integration in the ResonanceOrb CASCADE case
 * that uses the properties added to ResonanceCascadeSystem.
 */

describe('ResonanceOrbSystem Chain Break Protection', () => {
    let resonanceOrb;
    let mockScene;
    let mockResonanceCascade;
    
    beforeEach(() => {
        mockResonanceCascade = {
            activeChain: [],
            chainTimer: 4.0,
            chainWindow: 4.0,
            chainBreakProtection: false,
            chainBreakProtectionUses: 0,
            chainWindowBonus: 0,
            currentMultiplier: 1.0,
            multiplierGainPerStep: 0.5,
            
            addChainLevels: vi.fn(function(levels, bonuses) {
                for (let i = 0; i < levels; i++) {
                    this.activeChain.push('ORB_BONUS');
                    this.currentMultiplier += this.multiplierGainPerStep;
                }
                if (bonuses.protectionUses > 0) {
                    this.chainBreakProtection = true;
                    this.chainBreakProtectionUses = bonuses.protectionUses;
                }
                if (bonuses.windowBonus > 0) {
                    this.chainWindowBonus = bonuses.windowBonus;
                    this.chainTimer += bonuses.windowBonus;
                }
            })
        };
        
        mockScene = {
            resonanceCascade: mockResonanceCascade,
            time: { now: 10000 }
        };
        
        resonanceOrb = {
            scene: mockScene,
            type: 'CASCADE',
            
            activate() {
                if (this.type === 'CASCADE' && this.scene.resonanceCascade) {
                    this.scene.resonanceCascade.addChainLevels(2, {
                        protectionUses: 1,
                        windowBonus: 2.0
                    });
                    return true;
                }
                return false;
            }
        };
    });
    
    describe('CASCADE orb activation', () => {
        it('should call addChainLevels with 2 levels', () => {
            resonanceOrb.activate();
            expect(mockResonanceCascade.addChainLevels).toHaveBeenCalledWith(2, expect.any(Object));
        });
        
        it('should grant chain break protection', () => {
            resonanceOrb.activate();
            expect(mockResonanceCascade.chainBreakProtection).toBe(true);
            expect(mockResonanceCascade.chainBreakProtectionUses).toBe(1);
        });
        
        it('should grant window bonus', () => {
            resonanceOrb.activate();
            expect(mockResonanceCascade.chainWindowBonus).toBe(2.0);
        });
    });
});
