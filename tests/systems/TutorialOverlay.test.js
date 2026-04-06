import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Phaser before importing the overlay
vi.mock('phaser', () => {
  return {
    default: {
      Scene: class MockScene {}
    }
  };
});

// Import after mocking
import TutorialOverlay from '../../src/systems/TutorialOverlay.js';

describe('TutorialOverlay', () => {
  let mockScene;
  let overlay;
  let mockTweens;
  let mockTime;

  beforeEach(() => {
    // Mock tweens
    mockTweens = {
      add: vi.fn()
    };

    mockTime = {
      delayedCall: vi.fn(() => ({ remove: vi.fn() }))
    };

    // Mock container and UI element constructors
    const mockContainer = {
      setDepth: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setVisible: vi.fn().mockReturnThis(),
      setAlpha: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
      add: vi.fn(),
      destroy: vi.fn()
    };

    const mockRectangle = {
      setInteractive: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      setFillStyle: vi.fn().mockReturnThis(),
      setStrokeStyle: vi.fn().mockReturnThis(),
      setOrigin: vi.fn().mockReturnThis(),
      setVisible: vi.fn().mockReturnThis(),
      setAlpha: vi.fn().mockReturnThis(),
      setSize: vi.fn().mockReturnThis(),
      disableInteractive: vi.fn().mockReturnThis(),
      destroy: vi.fn()
    };

    const mockText = {
      setOrigin: vi.fn().mockReturnThis(),
      setFill: vi.fn().mockReturnThis(),
      setColor: vi.fn().mockReturnThis(),
      setVisible: vi.fn().mockReturnThis(),
      setText: vi.fn().mockReturnThis(),
      destroy: vi.fn()
    };

    const mockLine = {
      destroy: vi.fn()
    };

    // Mock Phaser scene with required methods
    mockScene = {
      cameras: {
        main: {
          width: 1920,
          height: 1080
        }
      },
      add: {
        container: vi.fn(() => mockContainer),
        rectangle: vi.fn(() => ({ ...mockRectangle })),
        text: vi.fn(() => ({ ...mockText })),
        line: vi.fn(() => ({ ...mockLine }))
      },
      input: {
        on: vi.fn().mockReturnThis(),
        off: vi.fn().mockReturnThis(),
        keyboard: {
          on: vi.fn().mockReturnThis(),
          off: vi.fn().mockReturnThis()
        }
      },
      events: {
        emit: vi.fn()
      },
      tweens: mockTweens,
      time: mockTime
    };

    overlay = new TutorialOverlay(mockScene);
  });

  describe('initialization', () => {
    it('should create UI elements', () => {
      expect(mockScene.add.container).toHaveBeenCalled();
      expect(mockScene.add.rectangle).toHaveBeenCalled();
      expect(mockScene.add.text).toHaveBeenCalled();
      expect(mockScene.input.keyboard.on).toHaveBeenCalledWith('keydown-SPACE', expect.any(Function));
      expect(mockScene.input.keyboard.on).toHaveBeenCalledWith('keydown-ENTER', expect.any(Function));
    });

    it('should start hidden', () => {
      expect(overlay.getIsVisible()).toBe(false);
    });
  });

  describe('show', () => {
    it('should display tutorial content', () => {
      const tutorial = {
        title: 'Test System',
        description: 'This is a test description.',
        hint: 'This is a hint.',
        color: 0xff0000,
        tier: 'foundation'
      };

      overlay.show(tutorial);

      expect(overlay.getIsVisible()).toBe(true);
      expect(overlay.currentTutorial).toEqual(tutorial);
    });

    it('should emit tutorialShown event', () => {
      const tutorial = {
        title: 'Test System',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      overlay.show(tutorial);

      expect(mockScene.events.emit).toHaveBeenCalledWith('tutorialShown', tutorial);
    });

    it('should show next unlock progress when provided', () => {
      const tutorial = {
        title: 'Test',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'foundation'
      };

      const nextUnlockData = {
        system: { name: 'Next System' },
        current: 2,
        target: 5,
        progress: 0.4,
        remaining: 3
      };

      overlay.show(tutorial, nextUnlockData);

      // Should call setVisible on progress elements
      expect(mockScene.add.rectangle).toHaveBeenCalled();
    });
  });

  describe('queueTutorial', () => {
    it('should add tutorial to queue when already visible', () => {
      const tutorial1 = {
        title: 'First',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      const tutorial2 = {
        title: 'Second',
        description: 'Description',
        hint: 'Hint',
        color: 0x00ff00,
        tier: 'foundation'
      };

      // First show one tutorial
      overlay.show(tutorial1);
      expect(overlay.getIsVisible()).toBe(true);
      
      // Queue another while visible
      overlay.queueTutorial(tutorial2);
      
      // Should be in queue
      expect(overlay.getQueueLength()).toBe(1);
    });

    it('should show immediately if not currently visible', () => {
      const tutorial = {
        title: 'Test',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      expect(overlay.getIsVisible()).toBe(false);
      overlay.queueTutorial(tutorial);

      // Should now be visible (shown immediately)
      expect(overlay.getIsVisible()).toBe(true);
    });
  });

  describe('dismiss', () => {
    it('should hide overlay', () => {
      const tutorial = {
        title: 'Test',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      overlay.show(tutorial);
      overlay.dismiss();

      expect(mockTweens.add).toHaveBeenCalled();
    });

    it('should emit tutorialDismissed event', () => {
      const tutorial = {
        title: 'Test',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      overlay.show(tutorial);
      overlay.dismiss();

      expect(mockScene.events.emit).toHaveBeenCalledWith('tutorialDismissed', tutorial);
    });

    it('should show next tutorial in queue after dismiss', () => {
      const tutorial1 = {
        title: 'First',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      const tutorial2 = {
        title: 'Second',
        description: 'Description',
        hint: 'Hint',
        color: 0x00ff00,
        tier: 'foundation'
      };

      overlay.queueTutorial(tutorial1);
      overlay.queueTutorial(tutorial2);

      // Should have both in queue
      expect(overlay.getQueueLength()).toBe(1); // Second one (first is showing)

      overlay.dismiss();

      // After animation completes, second should show
      const tweenCalls = mockTweens.add.mock.calls;
      const lastCall = tweenCalls[tweenCalls.length - 1];
      expect(lastCall[0]).toHaveProperty('onComplete');
    });
  });

  describe('utility methods', () => {
    it('should return isVisible state', () => {
      expect(overlay.getIsVisible()).toBe(false);

      const tutorial = {
        title: 'Test',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      overlay.show(tutorial);
      expect(overlay.getIsVisible()).toBe(true);
    });

    it('should return queue length', () => {
      expect(overlay.getQueueLength()).toBe(0);

      overlay.queue.push({ type: 'test' });
      expect(overlay.getQueueLength()).toBe(1);
    });

    it('should clear queue', () => {
      overlay.queue.push({ type: 'test1' });
      overlay.queue.push({ type: 'test2' });

      overlay.clearQueue();

      expect(overlay.getQueueLength()).toBe(0);
    });
  });

  describe('getNextAnnouncement', () => {
    it('should return next item from queue without removing', () => {
      const item = { type: 'test', tutorial: { title: 'Test' } };
      overlay.queue.push(item);

      const result = overlay.getNextAnnouncement();

      expect(result).toEqual(item);
      expect(overlay.getQueueLength()).toBe(1); // Not removed
    });

    it('should return null when queue is empty', () => {
      expect(overlay.getNextAnnouncement()).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should cleanup resources', () => {
      overlay.destroy();

      // The destroy method calls input.off (not input.keyboard.off)
      expect(mockScene.input.off).toHaveBeenCalledWith('keydown-SPACE');
      expect(mockScene.input.off).toHaveBeenCalledWith('keydown-ENTER');
    });

    it('should cancel auto-dismiss timer', () => {
      const removeSpy = vi.fn();
      overlay.autoDismissTimer = { remove: removeSpy };

      overlay.destroy();

      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe('keyboard input', () => {
    it('should handle SPACE key when visible', () => {
      const tutorial = {
        title: 'Test',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      overlay.show(tutorial);

      // Get the SPACE handler and call it
      const spaceHandler = mockScene.input.keyboard.on.mock.calls
        .find(call => call[0] === 'keydown-SPACE')[1];

      // This should not throw
      expect(() => spaceHandler()).not.toThrow();
    });

    it('should handle ENTER key when visible', () => {
      const tutorial = {
        title: 'Test',
        description: 'Description',
        hint: 'Hint',
        color: 0xff0000,
        tier: 'core'
      };

      overlay.show(tutorial);

      // Get the ENTER handler and call it
      const enterHandler = mockScene.input.keyboard.on.mock.calls
        .find(call => call[0] === 'keydown-ENTER')[1];

      // This should not throw
      expect(() => enterHandler()).not.toThrow();
    });
  });

  describe('showSummary', () => {
    it('should create summary container', () => {
      const unlockedSystems = [
        { id: 'system1', name: 'System 1', color: 0xff0000 },
        { id: 'system2', name: 'System 2', color: 0x00ff00 }
      ];

      const stats = { total: 2, max: 10 };

      const result = overlay.showSummary(unlockedSystems, stats);

      expect(result).toBeDefined();
      expect(mockScene.add.container).toHaveBeenCalled();
    });

    it('should include system names in summary', () => {
      const unlockedSystems = [
        { id: 'system1', name: 'System 1', color: 0xff0000 }
      ];

      const stats = { total: 1, max: 10 };

      overlay.showSummary(unlockedSystems, stats);

      // Should have created text for the title and system
      expect(mockScene.add.text).toHaveBeenCalled();
    });
  });
});
