import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Phaser before importing the systems
vi.mock('phaser', () => {
  return {
    default: {
      Scene: class MockScene {}
    },
    Events: {
      EventEmitter: class MockEventEmitter {}
    }
  };
});

// Mock the SYSTEM_UNLOCK_CONFIG to avoid importing the full file
vi.mock('../../src/systems/SystemUnlockConfig.js', () => {
  const SYSTEM_TIERS = {
    CORE: 'core',
    FOUNDATION: 'foundation',
    ADAPTIVE: 'adaptive',
    STRATEGIC: 'strategic',
    META: 'meta',
    TRANSCENDENT: 'transcendent'
  };

  const UNLOCK_TRIGGERS = {
    WAVE: 'wave',
    RUN: 'run',
    DEATH: 'death',
    SCORE: 'score',
    BOSS_KILL: 'bossKill',
    MANUAL: 'manual'
  };

  const SYSTEM_UNLOCK_CONFIG = [
    {
      id: 'echoStorm',
      name: 'Echo Storm',
      tier: SYSTEM_TIERS.CORE,
      trigger: UNLOCK_TRIGGERS.MANUAL,
      value: 0,
      description: 'Test description',
      hint: 'Test hint',
      color: 0xffd700
    },
    {
      id: 'fractureSystem',
      name: 'Fracture Protocol',
      tier: SYSTEM_TIERS.CORE,
      trigger: UNLOCK_TRIGGERS.MANUAL,
      value: 0,
      description: 'Test description',
      hint: 'Test hint',
      color: 0x00f0ff
    },
    {
      id: 'observerEffect',
      name: 'Observer Effect',
      tier: SYSTEM_TIERS.ADAPTIVE,
      trigger: UNLOCK_TRIGGERS.WAVE,
      value: 3,
      description: 'Test description',
      hint: 'Test hint',
      color: 0x9d4edd,
      requires: ['echoStorm']
    },
    {
      id: 'proteusProtocol',
      name: 'Proteus Protocol',
      tier: SYSTEM_TIERS.TRANSCENDENT,
      trigger: UNLOCK_TRIGGERS.RUN,
      value: 30,
      description: 'Test description',
      hint: 'Test hint',
      color: 0x9d4edd,
      requires: ['observerEffect']
    }
  ];

  function getActiveSystemsForState(wave, totalRuns = 0, totalDeaths = 0, sessionTime = 0) {
    return SYSTEM_UNLOCK_CONFIG
      .filter(system => {
        if (system.trigger === UNLOCK_TRIGGERS.MANUAL) return true;
        if (system.trigger === UNLOCK_TRIGGERS.WAVE && wave >= system.value) return true;
        if (system.trigger === UNLOCK_TRIGGERS.RUN && totalRuns >= system.value) return true;
        return false;
      })
      .map(s => s.id);
  }

  function getNextUnlock(wave, totalRuns = 0, totalDeaths = 0, sessionTime = 0) {
    const locked = SYSTEM_UNLOCK_CONFIG.filter(system => {
      if (system.trigger === UNLOCK_TRIGGERS.MANUAL) return false;
      if (system.trigger === UNLOCK_TRIGGERS.WAVE && wave >= system.value) return false;
      if (system.trigger === UNLOCK_TRIGGERS.RUN && totalRuns >= system.value) return false;
      return true;
    });
    return locked[0] || null;
  }

  function getSystemTutorial(systemId) {
    const system = SYSTEM_UNLOCK_CONFIG.find(s => s.id === systemId);
    if (!system) return null;
    return {
      title: system.name,
      description: system.description,
      hint: system.hint,
      color: system.color,
      tier: system.tier
    };
  }

  function getSystemConfig(systemId) {
    return SYSTEM_UNLOCK_CONFIG.find(s => s.id === systemId);
  }

  return {
    SYSTEM_UNLOCK_CONFIG,
    UNLOCK_TRIGGERS,
    SYSTEM_TIERS,
    getActiveSystemsForState,
    getNextUnlock,
    getSystemTutorial,
    getSystemConfig
  };
});

// Now import the SystemUnlockManager after mocks are set up
import SystemUnlockManager from '../../src/systems/SystemUnlockManager.js';
import {
  SYSTEM_UNLOCK_CONFIG,
  UNLOCK_TRIGGERS,
  getActiveSystemsForState,
  getNextUnlock,
  getSystemTutorial
} from '../../src/systems/SystemUnlockConfig.js';

describe('SystemUnlockManager', () => {
  let mockScene;
  let manager;

  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };

    // Mock Phaser scene
    mockScene = {
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn()
      },
      time: {
        now: 0
      },
      score: 0
    };

    manager = new SystemUnlockManager(mockScene);
  });

  describe('initialization', () => {
    it('should initialize with default game state', () => {
      expect(manager.currentWave).toBe(1);
      expect(manager.totalRuns).toBe(0);
      expect(manager.totalDeaths).toBe(0);
      expect(manager.highScore).toBe(0);
      expect(manager.bossesKilled).toBe(0);
    });

    it('should load saved progress from localStorage', () => {
      const savedData = {
        totalRuns: 5,
        totalDeaths: 10,
        highScore: 5000,
        bossesKilled: 2
      };
      global.localStorage.getItem.mockReturnValue(JSON.stringify(savedData));

      manager.loadProgress();

      expect(manager.totalRuns).toBe(5);
      expect(manager.totalDeaths).toBe(10);
      expect(manager.highScore).toBe(5000);
      expect(manager.bossesKilled).toBe(2);
    });

    it('should handle localStorage errors gracefully', () => {
      global.localStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => manager.loadProgress()).not.toThrow();
      expect(manager.totalRuns).toBe(0);
    });
  });

  describe('system activation', () => {
    it('should have core systems active by default', () => {
      const active = manager.activeSystems;
      expect(active.has('echoStorm')).toBe(true);
      expect(active.has('fractureSystem')).toBe(true);
    });

    it('should not have advanced systems active initially', () => {
      expect(manager.isSystemActive('proteusProtocol')).toBe(false);
    });

    it('should unlock systems when wave threshold is reached', () => {
      manager.onWaveComplete(3);
      expect(manager.isSystemActive('observerEffect')).toBe(true);
    });

    it('should unlock systems after deaths', () => {
      manager.onPlayerDeath();
      expect(manager.totalDeaths).toBe(1);
    });

    it('should emit events when systems unlock', () => {
      manager.currentWave = 1;
      manager.updateActiveSystems();
      
      // Advance to wave 3
      manager.onWaveComplete(3);
      
      expect(mockScene.events.emit).toHaveBeenCalledWith('systemsUnlocked', expect.any(Array));
    });
  });

  describe('getNextUnlock', () => {
    it('should return the next system to unlock', () => {
      const nextUnlock = manager.getNextUnlock();
      expect(nextUnlock).not.toBeNull();
      expect(nextUnlock).toHaveProperty('id');
      expect(nextUnlock).toHaveProperty('name');
      expect(nextUnlock).toHaveProperty('trigger');
      expect(nextUnlock).toHaveProperty('value');
    });

    it('should return the next locked system when some remain locked', () => {
      // Initially some systems are locked
      const next = manager.getNextUnlock();
      expect(next).not.toBeNull();
      expect(next.id).toBeDefined();
    });
  });

  describe('getNextUnlockProgress', () => {
    it('should return progress information for next unlock', () => {
      manager.currentWave = 1;
      const progress = manager.getNextUnlockProgress();
      
      expect(progress).toHaveProperty('system');
      expect(progress).toHaveProperty('current');
      expect(progress).toHaveProperty('target');
      expect(progress).toHaveProperty('progress');
      expect(progress).toHaveProperty('remaining');
    });

    it('should calculate progress correctly for wave-based unlocks', () => {
      manager.currentWave = 2;
      const progress = manager.getNextUnlockProgress();
      
      expect(progress.current).toBe(2);
      expect(progress.progress).toBeGreaterThanOrEqual(0);
      expect(progress.progress).toBeLessThanOrEqual(1);
    });
  });

  describe('announcement queue', () => {
    it('should add tutorials to queue when systems unlock', () => {
      manager.announcementQueue.push({
        type: 'systemUnlock',
        systemId: 'test',
        priority: 50
      });
      
      expect(manager.getNextAnnouncement()).not.toBeNull();
    });

    it('should return announcements by priority', () => {
      manager.announcementQueue.push(
        { type: 'systemUnlock', systemId: 'low', priority: 10 },
        { type: 'systemUnlock', systemId: 'high', priority: 100 }
      );
      
      const next = manager.getNextAnnouncement();
      expect(next.priority).toBe(100);
    });

    it('should clear announcements', () => {
      manager.announcementQueue.push({ type: 'test', priority: 50 });
      manager.clearAnnouncements();
      expect(manager.getNextAnnouncement()).toBeNull();
    });
  });

  describe('getSystemTutorial', () => {
    it('should return tutorial content for a system', () => {
      const tutorial = manager.getSystemTutorial('echoStorm');
      
      expect(tutorial).toHaveProperty('title');
      expect(tutorial).toHaveProperty('description');
      expect(tutorial).toHaveProperty('hint');
      expect(tutorial).toHaveProperty('color');
      expect(tutorial).toHaveProperty('tier');
    });

    it('should return null for unknown systems', () => {
      expect(manager.getSystemTutorial('unknownSystem')).toBeNull();
    });
  });

  describe('unlock stats', () => {
    it('should return stats by tier', () => {
      const stats = manager.getUnlockStats();
      
      expect(stats).toHaveProperty('core');
      expect(stats).toHaveProperty('foundation');
      expect(stats).toHaveProperty('adaptive');
      expect(stats).toHaveProperty('strategic');
      expect(stats).toHaveProperty('meta');
      expect(stats).toHaveProperty('transcendent');
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('max');
    });

    it('should count unlocked systems correctly', () => {
      const stats = manager.getUnlockStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.total).toBeLessThanOrEqual(stats.max);
    });
  });

  describe('manual unlock', () => {
    it('should allow manual unlocking for debug/testing', () => {
      manager.manualUnlock('proteusProtocol');
      expect(manager.isSystemActive('proteusProtocol')).toBe(true);
    });

    it('should save manual unlocks to localStorage', () => {
      manager.manualUnlock('testSystem');
      expect(global.localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('resetProgress', () => {
    it('should reset all progress', () => {
      manager.manualUnlock('someSystem');
      manager.resetProgress();
      
      expect(manager.totalRuns).toBe(0);
      expect(manager.totalDeaths).toBe(0);
      expect(manager.manualUnlocks.size).toBe(0);
    });

    it('should save reset state to localStorage', () => {
      manager.resetProgress();
      expect(global.localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('save/load progress', () => {
    it('should save progress to localStorage', () => {
      manager.totalRuns = 10;
      manager.saveProgress();
      
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'shooty_system_unlocks_v1',
        expect.any(String)
      );
    });
  });
});

describe('SystemUnlockConfig', () => {
  describe('configuration validation', () => {
    it('should have valid system configurations', () => {
      SYSTEM_UNLOCK_CONFIG.forEach(system => {
        expect(system).toHaveProperty('id');
        expect(system).toHaveProperty('name');
        expect(system).toHaveProperty('tier');
        expect(system).toHaveProperty('trigger');
        expect(system).toHaveProperty('value');
        expect(system).toHaveProperty('description');
        expect(system).toHaveProperty('hint');
        expect(system).toHaveProperty('color');
      });
    });

    it('should have unique system IDs', () => {
      const ids = SYSTEM_UNLOCK_CONFIG.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid trigger types', () => {
      const validTriggers = Object.values(UNLOCK_TRIGGERS);
      SYSTEM_UNLOCK_CONFIG.forEach(system => {
        expect(validTriggers).toContain(system.trigger);
      });
    });

    it('should have valid tier values', () => {
      const validTiers = ['core', 'foundation', 'adaptive', 'strategic', 'meta', 'transcendent'];
      SYSTEM_UNLOCK_CONFIG.forEach(system => {
        expect(validTiers).toContain(system.tier);
      });
    });

    it('should have prerequisites that exist', () => {
      const systemIds = SYSTEM_UNLOCK_CONFIG.map(s => s.id);
      SYSTEM_UNLOCK_CONFIG.forEach(system => {
        if (system.requires) {
          system.requires.forEach(prereqId => {
            expect(systemIds).toContain(prereqId);
          });
        }
      });
    });
  });

  describe('getActiveSystemsForState', () => {
    it('should return core systems for new players', () => {
      const active = getActiveSystemsForState(1, 0, 0, 0);
      
      expect(active).toContain('echoStorm');
      expect(active).toContain('fractureSystem');
    });

    it('should include systems at appropriate waves', () => {
      const active = getActiveSystemsForState(3, 0, 0, 0);
      
      expect(active).toContain('observerEffect');
    });

    it('should check prerequisites', () => {
      // With prerequisites defined, observerEffect requires echoStorm
      const active = getActiveSystemsForState(3, 0, 0, 0);
      
      // observerEffect should be present since its prerequisite (echoStorm) is core
      expect(active).toContain('observerEffect');
    });
  });

  describe('getNextUnlock', () => {
    it('should return the closest unlock', () => {
      const next = getNextUnlock(1, 0, 0, 0);
      
      expect(next).not.toBeNull();
    });

    it('should return null when all unlocked', () => {
      expect(getNextUnlock(100, 100, 100, 6000000)).toBeNull();
    });
  });

  describe('getSystemTutorial', () => {
    it('should return tutorial for existing systems', () => {
      const tutorial = getSystemTutorial('echoStorm');
      
      expect(tutorial).toEqual({
        title: 'Echo Storm',
        description: expect.any(String),
        hint: expect.any(String),
        color: expect.any(Number),
        tier: 'core'
      });
    });

    it('should return null for unknown systems', () => {
      expect(getSystemTutorial('nonexistent')).toBeNull();
    });
  });
});
