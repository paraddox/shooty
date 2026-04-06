import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Phaser
vi.mock('phaser', () => ({
  default: { Scene: class MockScene {} }
}));

// Import the modules under test
import SlowSystemUnlockManager from '../../src/systems/SlowSystemUnlockManager.js';
import { 
  TIME_BASED_UNLOCK_CONFIG,
  getNextTimeBasedUnlock,
  getRecommendedSessionTime
} from '../../src/systems/TimeBasedUnlockConfig.js';

describe('SlowSystemUnlockManager', () => {
  let mockScene;
  let manager;

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };

    mockScene = {
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn()
      },
      time: {
        now: 0
      }
    };

    manager = new SlowSystemUnlockManager(mockScene);
  });

  describe('time-based unlock rate limiting', () => {
    it('should not unlock any system before 3 minutes of gameplay', () => {
      // 2 minutes elapsed
      const newUnlocks = manager.update(120000);
      expect(newUnlocks.length).toBe(0);
    });

    it('should unlock first system after 3 minutes', () => {
      // 3 minutes elapsed
      const newUnlocks = manager.update(180000);
      expect(newUnlocks.length).toBe(1);
      expect(manager.getUnlockedCount()).toBe(1);
    });

    it('should not unlock second system before 6 minutes', () => {
      // First unlock at 3 min
      manager.update(180000);
      
      // Try at 5 minutes (only 2 min since last unlock)
      const newUnlocks = manager.update(300000);
      expect(newUnlocks.length).toBe(0);
      expect(manager.getUnlockedCount()).toBe(1);
    });

    it('should unlock second system after 6 minutes', () => {
      // First unlock at 3 min
      manager.update(180000);
      
      // Second unlock at 6 min
      const newUnlocks = manager.update(360000);
      expect(newUnlocks.length).toBe(1);
      expect(manager.getUnlockedCount()).toBe(2);
    });

    it('should enforce 3 minute cooldown between unlocks', () => {
      // Unlock first at 3 min
      manager.update(180000);
      
      // Try every 30 seconds - should not unlock
      for (let t = 210000; t < 360000; t += 30000) {
        const unlocks = manager.update(t);
        expect(unlocks.length).toBe(0);
      }
      
      // At 6 minutes - should unlock
      const finalUnlocks = manager.update(360000);
      expect(finalUnlocks.length).toBe(1);
    });
  });

  describe('session time tracking', () => {
    it('should track total session time', () => {
      manager.update(60000);  // 1 min
      expect(manager.getSessionTime()).toBe(60000);
      
      manager.update(120000); // 2 min
      expect(manager.getSessionTime()).toBe(120000);
    });

    it('should track time since last unlock', () => {
      manager.update(180000); // First unlock at 3 min
      expect(manager.getTimeSinceLastUnlock()).toBe(0);
      
      manager.update(240000); // 4 min total, 1 min since unlock
      expect(manager.getTimeSinceLastUnlock()).toBe(60000);
    });

    it('should format time remaining for next unlock', () => {
      manager.update(180000); // First unlock at 3 min
      
      // At 4 minutes (1 min since last, 2 min remaining)
      manager.update(240000);
      const remaining = manager.getTimeUntilNextUnlock();
      expect(remaining).toBe(120000); // 2 minutes in ms
    });
  });

  describe('system unlock ordering', () => {
    it('should unlock systems in order from simplest to most complex', () => {
      // Simulate 30 minutes of gameplay unlocking all systems
      const unlockOrder = [];
      
      for (let t = 180000; t <= 1800000; t += 180000) {
        const newUnlocks = manager.update(t);
        if (newUnlocks.length > 0) {
          unlockOrder.push(...newUnlocks);
        }
      }
      
      // Should unlock in order (core -> foundation -> adaptive -> etc)
      const config = TIME_BASED_UNLOCK_CONFIG;
      for (let i = 0; i < unlockOrder.length && i < config.length; i++) {
        expect(unlockOrder[i]).toBe(config[i].id);
      }
    });
  });

  describe('progress notification', () => {
    it('should emit warning 30 seconds before next unlock', () => {
      // First unlock at 3 min
      manager.update(180000);
      
      // At 5:30 (150 seconds since last, 30 seconds remaining)
      mockScene.events.emit.mockClear();
      manager.update(330000);
      
      expect(mockScene.events.emit).toHaveBeenCalledWith(
        'unlockApproaching',
        expect.any(Object)
      );
    });

    it('should emit event when system unlocks', () => {
      mockScene.events.emit.mockClear();
      manager.update(180000);
      
      expect(mockScene.events.emit).toHaveBeenCalledWith(
        'systemUnlocked',
        expect.any(Object)
      );
    });

    it('should include time info in unlock event', () => {
      mockScene.events.emit.mockClear();
      manager.update(180000);
      
      const eventCall = mockScene.events.emit.mock.calls.find(
        call => call[0] === 'systemUnlocked'
      );
      
      expect(eventCall[1]).toHaveProperty('systemId');
      expect(eventCall[1]).toHaveProperty('sessionTime');
      expect(eventCall[1]).toHaveProperty('timeUntilNext');
    });
  });

  describe('persistence', () => {
    it('should save unlocked systems to localStorage', () => {
      manager.update(180000);
      manager.saveProgress();
      
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'shooty_slow_unlocks_v1',
        expect.any(String)
      );
    });

    it('should load previously unlocked systems on init', () => {
      const savedData = {
        permanentlyUnlocked: ['echoStorm', 'fractureSystem'],
        sessionUnlocked: [],
        totalPlaytime: 360000
      };
      global.localStorage.getItem.mockReturnValue(JSON.stringify(savedData));
      
      const newManager = new SlowSystemUnlockManager(mockScene);
      expect(newManager.isSystemUnlocked('echoStorm')).toBe(true);
      expect(newManager.isSystemUnlocked('fractureSystem')).toBe(true);
    });
  });

  describe('visual progress indicator', () => {
    it('should provide progress toward next unlock (0-1)', () => {
      // At 1.5 min (halfway to first unlock)
      const progress = manager.getUnlockProgress(90000);
      expect(progress).toBe(0.5);
    });

    it('should provide 1.0 progress when unlock is ready', () => {
      // At exactly 3 min
      const progress = manager.getUnlockProgress(180000);
      expect(progress).toBe(1.0);
    });

    it('should cap progress at 1.0', () => {
      // At 5 min (overdue)
      const progress = manager.getUnlockProgress(300000);
      expect(progress).toBe(1.0);
    });
  });

  describe('remaining systems info', () => {
    it('should report count of remaining locked systems', () => {
      const total = TIME_BASED_UNLOCK_CONFIG.length;
      
      manager.update(180000); // Unlock 1
      expect(manager.getRemainingCount()).toBe(total - 1);
      
      manager.update(360000); // Unlock 2
      expect(manager.getRemainingCount()).toBe(total - 2);
    });

    it('should report estimated time to unlock all systems', () => {
      const total = TIME_BASED_UNLOCK_CONFIG.length;
      const estimatedMinutes = manager.getEstimatedTimeToUnlockAll();
      
      // Should be approximately (total systems * 3 minutes)
      expect(estimatedMinutes).toBeGreaterThanOrEqual(total * 3 - 1);
      expect(estimatedMinutes).toBeLessThanOrEqual(total * 3 + 1);
    });
  });
});

describe('TimeBasedUnlockConfig', () => {
  describe('configuration structure', () => {
    it('should have all systems ordered by complexity', () => {
      TIME_BASED_UNLOCK_CONFIG.forEach((system, index) => {
        expect(system).toHaveProperty('id');
        expect(system).toHaveProperty('name');
        expect(system).toHaveProperty('description');
        expect(system).toHaveProperty('hint');
        expect(system).toHaveProperty('tier');
        expect(system).toHaveProperty('recommendedMinute');
        expect(system.recommendedMinute).toBe((index + 1) * 3);
      });
    });

    it('should have core systems in first 4 positions', () => {
      const coreSystems = TIME_BASED_UNLOCK_CONFIG.filter(s => s.tier === 'core');
      expect(coreSystems.length).toBeLessThanOrEqual(4);
      
      coreSystems.forEach((system, index) => {
        expect(TIME_BASED_UNLOCK_CONFIG.indexOf(system)).toBe(index);
      });
    });

    it('should have no duplicate system IDs', () => {
      const ids = TIME_BASED_UNLOCK_CONFIG.map(s => s.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds.length).toBe(ids.length);
    });
  });

  describe('getNextTimeBasedUnlock', () => {
    it('should return correct system for given minute', () => {
      // At minute 3, should return first system
      const first = getNextTimeBasedUnlock(3, []);
      expect(first.id).toBe(TIME_BASED_UNLOCK_CONFIG[0].id);
      
      // At minute 6 with 1 unlocked, should return second
      const second = getNextTimeBasedUnlock(6, [TIME_BASED_UNLOCK_CONFIG[0].id]);
      expect(second.id).toBe(TIME_BASED_UNLOCK_CONFIG[1].id);
    });

    it('should return null when all systems unlocked', () => {
      const allIds = TIME_BASED_UNLOCK_CONFIG.map(s => s.id);
      const next = getNextTimeBasedUnlock(100, allIds);
      expect(next).toBeNull();
    });
  });

  describe('getRecommendedSessionTime', () => {
    it('should calculate total time needed to unlock desired systems', () => {
      const time = getRecommendedSessionTime(5); // Want 5 systems
      expect(time).toBe(5 * 3 * 60000); // 5 systems * 3 min * 60k ms
    });

    it('should handle requesting more systems than exist', () => {
      const total = TIME_BASED_UNLOCK_CONFIG.length;
      const time = getRecommendedSessionTime(total + 10);
      expect(time).toBe(total * 3 * 60000);
    });
  });
});
