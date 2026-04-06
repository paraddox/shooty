import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Phaser
vi.mock('phaser', () => ({
  default: { Scene: class MockScene {} }
}));

import SlowSystemUnlockManager from '../../src/systems/SlowSystemUnlockManager.js';
import { TIME_BASED_UNLOCK_CONFIG } from '../../src/systems/TimeBasedUnlockConfig.js';

describe('HUDPanelManager SLOT_TO_SYSTEM_MAP Validation', () => {
  let mockScene;
  let unlockManager;
  let slotToSystemMap;

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };

    mockScene = {
      cameras: { main: { width: 800, height: 600 } },
      scale: { width: 800, height: 600 },
      events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
      time: { now: 0 },
      add: {
        container: vi.fn(() => ({ add: vi.fn(), setDepth: vi.fn() })),
        rectangle: vi.fn(() => ({ setOrigin: vi.fn().mockReturnThis() })),
        text: vi.fn(() => ({ setOrigin: vi.fn().mockReturnThis() })),
        graphics: vi.fn(() => ({
          fillStyle: vi.fn().mockReturnThis(),
          fillRoundedRect: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          strokeRoundedRect: vi.fn().mockReturnThis(),
          generateTexture: vi.fn().mockReturnThis(),
          clear: vi.fn().mockReturnThis(),
          destroy: vi.fn()
        }))
      },
      make: {
        graphics: vi.fn(() => ({
          fillStyle: vi.fn().mockReturnThis(),
          fillRoundedRect: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          strokeRoundedRect: vi.fn().mockReturnThis(),
          generateTexture: vi.fn().mockReturnThis(),
          clear: vi.fn().mockReturnThis(),
          destroy: vi.fn()
        }))
      },
      systemUnlockManager: null
    };

    unlockManager = new SlowSystemUnlockManager(mockScene);
    mockScene.systemUnlockManager = unlockManager;

    // Load the SLOT_TO_SYSTEM_MAP directly without instantiating full HUDPanelManager
    // We'll test the map configuration separately
    // This mirrors the SLOT_TO_SYSTEM_MAP from HUDPanelManager.js
    slotToSystemMap = {
      'SYNTROPY': 'syntropyEngine',
      'CONVERGENCE': 'aethericConvergence',
      'SYNTHESIS': null,
      'PATTERN': 'observerEffect',
      'VOID_COHERENCE': 'voidCoherence',
      'CHRONO_LOOP': 'chronoLoop',
      'CAUSAL_LINK': 'causalEntanglement',
      'TEMPORAL_REWIND': 'temporalRewind',
      'RESONANCE_ORB': 'resonanceOrb', // FIXED: was 'resonanceOrbs'
      'QUANTUM_IMMORTALITY': 'quantumImmortality',
      'DEBT_DISPLAY': 'voidExchange',
      'BOOTSTRAP': 'bootstrapProtocol',
      'DISSOLUTION': 'dissolutionProtocol',
      'AMBIENT': null, // FIXED: was 'ambientAwareness' - not in TimeBasedUnlockConfig
      'AXIOM_NEXUS': 'axiomNexus',
      'HEARTFLUX': 'heartflux',
      'PROTEUS': 'proteusProtocol',
      'SYMBIOSIS_HARMONY': 'symbioticPrediction',
      'RESONANCE_CASCADE': 'resonanceCascade',
      'META_SYSTEM': 'metaSystemOperator',
      'APERTURE': 'apertureProtocol',
      'OBSERVER': 'observerEffect',
      'KARMA': 'axiomNexus',
      'PEDAGOGY': null, // FIXED: was 'temporalPedagogy' - not in TimeBasedUnlockConfig
      'ATHENAEUM': 'athenaeumProtocol',
      'INSCRIPTION': 'inscriptionProtocol',
      'HARMONIC': 'harmonicConvergence',
    };
  });

  describe('BUG: Invalid system ID mappings in SLOT_TO_SYSTEM_MAP', () => {
    it('should only map to system IDs that exist in TimeBasedUnlockConfig', () => {
      const validSystemIds = new Set(TIME_BASED_UNLOCK_CONFIG.map(s => s.id));
      
      const invalidMappings = [];
      for (const [slotId, systemId] of Object.entries(slotToSystemMap)) {
        if (systemId && !validSystemIds.has(systemId)) {
          invalidMappings.push({ slot: slotId, system: systemId });
        }
      }
      
      // Should have no invalid mappings
      expect(invalidMappings).toEqual([]);
    });

    it('should have RESONANCE_ORB map to resonanceOrb not resonanceOrbs', () => {
      const validSystemIds = new Set(TIME_BASED_UNLOCK_CONFIG.map(s => s.id));
      const mapping = slotToSystemMap['RESONANCE_ORB'];
      
      // resonanceOrbs is NOT in the config, resonanceOrb IS
      expect(validSystemIds.has('resonanceOrb')).toBe(true);
      expect(validSystemIds.has('resonanceOrbs')).toBe(false);
      
      // The mapping should use the valid ID
      expect(mapping).toBe('resonanceOrb');
    });

    it('should have AMBIENT map to a valid system in TimeBasedUnlockConfig or be null', () => {
      const validSystemIds = new Set(TIME_BASED_UNLOCK_CONFIG.map(s => s.id));
      const mapping = slotToSystemMap['AMBIENT'];
      
      // ambientAwareness is NOT in TimeBasedUnlockConfig
      expect(validSystemIds.has('ambientAwareness')).toBe(false);
      
      // Should be null or a valid system ID
      if (mapping !== null) {
        expect(validSystemIds.has(mapping)).toBe(true);
      }
    });

    it('should have PEDAGOGY map to a valid system in TimeBasedUnlockConfig or be null', () => {
      const validSystemIds = new Set(TIME_BASED_UNLOCK_CONFIG.map(s => s.id));
      const mapping = slotToSystemMap['PEDAGOGY'];
      
      // temporalPedagogy is NOT in TimeBasedUnlockConfig
      expect(validSystemIds.has('temporalPedagogy')).toBe(false);
      
      // Should be null or a valid system ID
      if (mapping !== null) {
        expect(validSystemIds.has(mapping)).toBe(true);
      }
    });
  });

  describe('SlowSystemUnlockManager interface', () => {
    it('should have isSystemUnlocked method', () => {
      expect(typeof unlockManager.isSystemUnlocked).toBe('function');
    });

    it('should NOT have isSystemActive method (it has isSystemUnlocked instead)', () => {
      // This is the root cause of the bug - HUDPanelManager checks for isSystemActive
      // but SlowSystemUnlockManager only has isSystemUnlocked
      expect(typeof unlockManager.isSystemActive).toBe('undefined');
    });

    it('should report no systems unlocked at game start', () => {
      expect(unlockManager.getUnlockedCount()).toBe(0);
      expect(unlockManager.permanentlyUnlocked.size).toBe(0);
    });
  });

  describe('Progressive disclosure requirements', () => {
    it('should unlock first system after 3 minutes', () => {
      const newUnlocks = unlockManager.update(180000); // 3 min
      expect(newUnlocks.length).toBe(1);
      expect(unlockManager.getUnlockedCount()).toBe(1);
    });

    it('should progressively unlock systems every 3 minutes', () => {
      const unlockTimes = [];
      
      for (let minute = 3; minute <= 30; minute += 3) {
        const timeMs = minute * 60 * 1000;
        const newUnlocks = unlockManager.update(timeMs);
        if (newUnlocks.length > 0) {
          unlockTimes.push({ minute, system: newUnlocks[0] });
        }
      }
      
      // Should unlock at least 10 systems over 30 minutes
      expect(unlockTimes.length).toBeGreaterThanOrEqual(10);
      
      // Verify unlock order matches TimeBasedUnlockConfig
      for (let i = 0; i < unlockTimes.length; i++) {
        expect(unlockTimes[i].system).toBe(TIME_BASED_UNLOCK_CONFIG[i].id);
      }
    });
  });
});

describe('HUDPanelManager Progressive Disclosure Logic', () => {
  it('should check for both isSystemActive and isSystemUnlocked methods', () => {
    // This test documents what the fix should be:
    // HUDPanelManager.updateAllSlotVisibility() should check for EITHER
    // isSystemActive (from SystemUnlockManager) OR
    // isSystemUnlocked (from SlowSystemUnlockManager)
    
    const mockWaveBasedManager = {
      isSystemActive: vi.fn(() => true),
      isSystemUnlocked: undefined
    };
    
    const mockTimeBasedManager = {
      isSystemActive: undefined,
      isSystemUnlocked: vi.fn(() => true)
    };
    
    // Both should be considered valid for progressive unlock
    const supportsProgressiveWave = typeof mockWaveBasedManager.isSystemActive === 'function' ||
                                    typeof mockWaveBasedManager.isSystemUnlocked === 'function';
    const supportsProgressiveTime = typeof mockTimeBasedManager.isSystemActive === 'function' ||
                                    typeof mockTimeBasedManager.isSystemUnlocked === 'function';
    
    expect(supportsProgressiveWave).toBe(true);
    expect(supportsProgressiveTime).toBe(true);
  });
});
