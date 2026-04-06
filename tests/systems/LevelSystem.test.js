import { describe, it, expect, vi, beforeEach } from 'vitest';
import LevelManager from '../../src/systems/LevelManager.js';
import {
  getLevelConfig,
  getActiveSystemsForLevel,
  isSystemActiveAtLevel,
  getSystemForLevel,
  getTotalLevels,
  WAVES_PER_LEVEL
} from '../../src/systems/LevelSystemUnlockConfig.js';

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {},
    Events: {
      EventEmitter: class MockEventEmitter {
        emit() {}
        on() {}
        off() {}
      }
    }
  }
}));

describe('LevelSystemUnlockConfig', () => {
  describe('getLevelConfig', () => {
    it('should return config for level 1 (no system)', () => {
      const config = getLevelConfig(1);
      expect(config).toBeDefined();
      expect(config.level).toBe(1);
      expect(config.systemId).toBeNull();
      expect(config.name).toBe('The Beginning');
    });

    it('should return config for level 2 (first system)', () => {
      const config = getLevelConfig(2);
      expect(config).toBeDefined();
      expect(config.level).toBe(2);
      expect(config.systemId).toBe('echoStorm');
      expect(config.name).toBe('Echo Storm');
      expect(config.tier).toBe('core');
    });

    it('should return config for level 6 (foundation tier)', () => {
      const config = getLevelConfig(6);
      expect(config).toBeDefined();
      expect(config.systemId).toBe('singularitySystem');
      expect(config.tier).toBe('foundation');
    });

    it('should return null for invalid levels', () => {
      expect(getLevelConfig(0)).toBeNull();
      expect(getLevelConfig(-1)).toBeNull();
      expect(getLevelConfig(999)).toBeNull();
    });
  });

  describe('getSystemForLevel', () => {
    it('should return null for level 1', () => {
      expect(getSystemForLevel(1)).toBeNull();
    });

    it('should return correct system IDs', () => {
      expect(getSystemForLevel(2)).toBe('echoStorm');
      expect(getSystemForLevel(3)).toBe('fractureSystem');
      expect(getSystemForLevel(4)).toBe('temporalResidue');
      expect(getSystemForLevel(5)).toBe('resonanceCascade');
    });
  });

  describe('getActiveSystemsForLevel', () => {
    it('should return empty array for level 1', () => {
      expect(getActiveSystemsForLevel(1)).toEqual([]);
    });

    it('should return one system for level 2', () => {
      const systems = getActiveSystemsForLevel(2);
      expect(systems).toEqual(['echoStorm']);
    });

    it('should return cumulative systems for higher levels', () => {
      const systems = getActiveSystemsForLevel(5);
      expect(systems).toContain('echoStorm');
      expect(systems).toContain('fractureSystem');
      expect(systems).toContain('temporalResidue');
      expect(systems).toContain('resonanceCascade');
      expect(systems).toHaveLength(4);
    });
  });

  describe('isSystemActiveAtLevel', () => {
    it('should return false for any system at level 1', () => {
      expect(isSystemActiveAtLevel('echoStorm', 1)).toBe(false);
    });

    it('should return true for echoStorm at level 2', () => {
      expect(isSystemActiveAtLevel('echoStorm', 2)).toBe(true);
    });

    it('should return false for fractureSystem at level 2', () => {
      expect(isSystemActiveAtLevel('fractureSystem', 2)).toBe(false);
    });

    it('should return true for fractureSystem at level 3', () => {
      expect(isSystemActiveAtLevel('fractureSystem', 3)).toBe(true);
    });

    it('should return true for earlier systems at higher levels', () => {
      expect(isSystemActiveAtLevel('echoStorm', 5)).toBe(true);
    });
  });

  describe('getTotalLevels', () => {
    it('should return the number of configured levels', () => {
      const total = getTotalLevels();
      expect(total).toBeGreaterThan(0);
      expect(total).toBe(16); // 16 levels configured
    });
  });
});

describe('LevelManager', () => {
  let mockScene;
  let levelManager;

  beforeEach(() => {
    mockScene = {
      events: {
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn()
      },
      time: {
        now: 0
      }
    };
    levelManager = new LevelManager(mockScene);
  });

  describe('initialization', () => {
    it('should start at level 1', () => {
      expect(levelManager.currentLevel).toBe(1);
      expect(levelManager.currentWaveInLevel).toBe(1);
    });

    it('should have level not in progress initially', () => {
      expect(levelManager.levelInProgress).toBe(false);
    });
  });

  describe('startLevel', () => {
    it('should start level 1 and emit event', () => {
      const config = levelManager.startLevel();

      expect(levelManager.currentLevel).toBe(1);
      expect(levelManager.levelInProgress).toBe(true);
      expect(config.level).toBe(1);
      expect(mockScene.events.emit).toHaveBeenCalledWith('levelStarted', expect.any(Object));
    });

    it('should start specified level', () => {
      levelManager.startLevel(3);

      expect(levelManager.currentLevel).toBe(3);
      expect(levelManager.currentWaveInLevel).toBe(1);
    });
  });

  describe('advanceWave', () => {
    it('should advance wave within level', () => {
      levelManager.startLevel();

      const result = levelManager.advanceWave();

      expect(result.waveInLevel).toBe(2);
      expect(result.level).toBe(1);
      expect(result.isLevelComplete).toBe(false);
    });

    it('should complete level after wave 5', () => {
      levelManager.startLevel();

      // Advance through waves 2-5
      for (let i = 0; i < 4; i++) {
        levelManager.advanceWave();
      }

      const result = levelManager.advanceWave();

      expect(result.isLevelComplete).toBe(true);
      expect(result.nextLevel).toBe(2);
    });

    it('should identify boss wave (wave 5)', () => {
      levelManager.startLevel();

      // Advance to wave 5
      for (let i = 0; i < 3; i++) {
        levelManager.advanceWave();
      }

      const result = levelManager.advanceWave();
      expect(result.isBossWave).toBe(true);
    });

    it('should start level automatically if not in progress', () => {
      expect(levelManager.levelInProgress).toBe(false);

      levelManager.advanceWave();

      expect(levelManager.levelInProgress).toBe(true);
    });
  });

  describe('nextLevel', () => {
    it('should advance to next level', () => {
      levelManager.startLevel(1);

      const config = levelManager.nextLevel();

      expect(levelManager.currentLevel).toBe(2);
      expect(config.level).toBe(2);
    });

    it('should not exceed max levels', () => {
      const maxLevel = getTotalLevels();
      levelManager.startLevel(maxLevel);

      levelManager.nextLevel();

      expect(levelManager.currentLevel).toBe(maxLevel);
    });
  });

  describe('isBossWave', () => {
    it('should return true only for wave 5', () => {
      levelManager.startLevel();

      expect(levelManager.isBossWave()).toBe(false); // wave 1

      levelManager.currentWaveInLevel = 2;
      expect(levelManager.isBossWave()).toBe(false);

      levelManager.currentWaveInLevel = 5;
      expect(levelManager.isBossWave()).toBe(true);
    });
  });

  describe('isSystemActive', () => {
    it('should return false for all systems at level 1', () => {
      levelManager.startLevel(1);

      expect(levelManager.isSystemActive('echoStorm')).toBe(false);
      expect(levelManager.isSystemActive('fractureSystem')).toBe(false);
    });

    it('should return true for echoStorm at level 2', () => {
      levelManager.startLevel(2);

      expect(levelManager.isSystemActive('echoStorm')).toBe(true);
    });

    it('should return true for multiple systems at level 5', () => {
      levelManager.startLevel(5);

      expect(levelManager.isSystemActive('echoStorm')).toBe(true);
      expect(levelManager.isSystemActive('fractureSystem')).toBe(true);
      expect(levelManager.isSystemActive('temporalResidue')).toBe(true);
      expect(levelManager.isSystemActive('resonanceCascade')).toBe(true);
    });
  });

  describe('getActiveSystemIds', () => {
    it('should return empty array for level 1', () => {
      levelManager.startLevel(1);

      expect(levelManager.getActiveSystemIds()).toEqual([]);
    });

    it('should return correct systems for level 5', () => {
      levelManager.startLevel(5);

      const systems = levelManager.getActiveSystemIds();
      expect(systems).toHaveLength(4);
      expect(systems).toContain('echoStorm');
      expect(systems).toContain('fractureSystem');
      expect(systems).toContain('temporalResidue');
      expect(systems).toContain('resonanceCascade');
    });
  });

  describe('getDisplayInfo', () => {
    it('should return correct display info', () => {
      levelManager.startLevel(2);
      levelManager.currentWaveInLevel = 3;

      const info = levelManager.getDisplayInfo();

      expect(info.level).toBe(2);
      expect(info.waveInLevel).toBe(3);
      expect(info.totalWaves).toBe(WAVES_PER_LEVEL);
      expect(info.wavesRemaining).toBe(3); // 5 - 3 + 1
      expect(info.name).toBe('Echo Storm');
    });
  });

  describe('level progression with systems', () => {
    it('should track systems correctly through multiple levels', () => {
      // Level 1: no systems
      levelManager.startLevel(1);
      expect(levelManager.getActiveSystemIds()).toHaveLength(0);

      // Complete level 1 and go to level 2
      for (let i = 1; i < WAVES_PER_LEVEL; i++) {
        levelManager.advanceWave();
      }
      levelManager.advanceWave(); // Complete level
      levelManager.nextLevel();

      // Level 2: 1 system
      expect(levelManager.getActiveSystemIds()).toHaveLength(1);
      expect(levelManager.isSystemActive('echoStorm')).toBe(true);

      // Complete level 2 and go to level 3
      for (let i = 1; i < WAVES_PER_LEVEL; i++) {
        levelManager.advanceWave();
      }
      levelManager.advanceWave();
      levelManager.nextLevel();

      // Level 3: 2 systems
      expect(levelManager.getActiveSystemIds()).toHaveLength(2);
      expect(levelManager.isSystemActive('echoStorm')).toBe(true);
      expect(levelManager.isSystemActive('fractureSystem')).toBe(true);
    });
  });

  describe('isFirstWaveOfLevel', () => {
    it('should return true on first wave', () => {
      levelManager.startLevel();
      expect(levelManager.isFirstWaveOfLevel()).toBe(true);
    });

    it('should return false after advancing', () => {
      levelManager.startLevel();
      levelManager.advanceWave();
      expect(levelManager.isFirstWaveOfLevel()).toBe(false);
    });
  });

  describe('hasNewSystemThisLevel', () => {
    it('should return false for level 1', () => {
      levelManager.startLevel(1);
      expect(levelManager.hasNewSystemThisLevel()).toBe(false);
    });

    it('should return true for level 2+', () => {
      levelManager.startLevel(2);
      expect(levelManager.hasNewSystemThisLevel()).toBe(true);
    });
  });

  describe('Level 1 pure gameplay verification', () => {
    it('should have zero active systems at level 1', () => {
      levelManager.startLevel(1);
      const activeSystems = levelManager.getActiveSystemIds();
      expect(activeSystems).toHaveLength(0);
    });

    it('should not activate any systems until level 2', () => {
      levelManager.startLevel(1);

      // Check specific systems that should NOT be active at level 1
      expect(levelManager.isSystemActive('echoStorm')).toBe(false);
      expect(levelManager.isSystemActive('fractureSystem')).toBe(false);
      expect(levelManager.isSystemActive('temporalResidue')).toBe(false);
      expect(levelManager.isSystemActive('resonanceCascade')).toBe(false);
      expect(levelManager.isSystemActive('singularitySystem')).toBe(false);
      expect(levelManager.isSystemActive('omniWeapon')).toBe(false);
      expect(levelManager.isSystemActive('paradoxEngine')).toBe(false);
      expect(levelManager.isSystemActive('chronoLoop')).toBe(false);
      expect(levelManager.isSystemActive('quantumImmortality')).toBe(false);
      expect(levelManager.isSystemActive('observerEffect')).toBe(false);
    });

    it('should activate echoStorm when advancing to level 2', () => {
      levelManager.startLevel(1);
      expect(levelManager.isSystemActive('echoStorm')).toBe(false);

      // Complete level 1 (5 waves)
      for (let i = 1; i <= WAVES_PER_LEVEL; i++) {
        levelManager.advanceWave();
      }

      // Advance to level 2
      levelManager.nextLevel();

      // Now echoStorm should be active
      expect(levelManager.isSystemActive('echoStorm')).toBe(true);
      expect(levelManager.getActiveSystemIds()).toContain('echoStorm');
    });
  });
});
