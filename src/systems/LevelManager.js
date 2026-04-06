import Phaser from 'phaser';
import {
  getLevelConfig,
  getActiveSystemsForLevel,
  isSystemActiveAtLevel,
  WAVES_PER_LEVEL,
  MAX_LEVELS,
  getTotalLevels
} from './LevelSystemUnlockConfig.js';

/**
 * LevelManager
 *
 * Manages the level-based progression system:
 * - Tracks current level and wave within level
 * - Handles level transitions and completion
 * - Determines which systems are active
 * - Emits events for level start/completion
 *
 * Structure:
 * - Level 1: 5 waves, no systems (pure gameplay)
 * - Level 2+: 5 waves each, one new system per level
 * - Boss spawns at wave 5 of every level
 */
export default class LevelManager {
  constructor(scene) {
    this.scene = scene;

    // Current progression state
    this.currentLevel = 1;
    this.currentWaveInLevel = 1; // 1-5 within current level
    this.totalWavesCompleted = 0; // Total across all levels

    // Level state
    this.levelInProgress = false;
    this.bossDefeatedThisLevel = false;

    // Persistent unlocks (carry across runs)
    this.maxLevelReached = 1;
    this.unlockedSystems = new Set();

    // Load saved progress
    this.loadProgress();

    console.log(`[LevelManager] Initialized at level ${this.currentLevel}, wave ${this.currentWaveInLevel}`);
  }

  /**
   * Start a new level.
   * @param {number} level - Level number to start (optional, defaults to current)
   * @returns {object} Level configuration
   */
  startLevel(level = null) {
    if (level !== null) {
      this.currentLevel = Math.max(1, Math.min(level, getTotalLevels()));
    }

    this.currentWaveInLevel = 1;
    this.bossDefeatedThisLevel = false;
    this.levelInProgress = true;

    const config = this.getCurrentLevelConfig();

    // Update unlocked systems
    this.updateUnlockedSystems();

    // Emit level start event
    this.scene.events.emit('levelStarted', {
      level: this.currentLevel,
      config: config,
      activeSystems: this.getActiveSystemIds(),
      newSystem: config.systemId // System introduced this level (null for level 1)
    });

    console.log(`[LevelManager] Started level ${this.currentLevel}: ${config.name}`);
    if (config.systemId) {
      console.log(`[LevelManager] New system unlocked: ${config.systemId}`);
    }

    return config;
  }

  /**
   * Advance to the next wave within the current level.
   * @returns {object} Result with flags for level/boss events
   */
  advanceWave() {
    if (!this.levelInProgress) {
      this.startLevel();
    }

    this.currentWaveInLevel++;
    this.totalWavesCompleted++;

    const result = {
      level: this.currentLevel,
      waveInLevel: this.currentWaveInLevel,
      isBossWave: this.isBossWave(),
      isLevelComplete: false,
      nextLevel: null
    };

    // Check if level is complete (after wave 5)
    if (this.currentWaveInLevel > WAVES_PER_LEVEL) {
      result.isLevelComplete = true;
      this.completeLevel();

      // Determine next level
      if (this.currentLevel < getTotalLevels()) {
        result.nextLevel = this.currentLevel + 1;
      }
    }

    // Emit wave advanced event
    this.scene.events.emit('waveAdvanced', result);

    return result;
  }

  /**
   * Complete the current level and prepare for next.
   */
  completeLevel() {
    this.levelInProgress = false;

    // Update max level reached
    if (this.currentLevel > this.maxLevelReached) {
      this.maxLevelReached = this.currentLevel;
    }

    // Save progress
    this.saveProgress();

    // Emit level complete event
    this.scene.events.emit('levelCompleted', {
      level: this.currentLevel,
      maxLevelReached: this.maxLevelReached,
      nextLevel: this.currentLevel < getTotalLevels() ? this.currentLevel + 1 : null
    });

    console.log(`[LevelManager] Completed level ${this.currentLevel}`);
  }

  /**
   * Advance to the next level.
   * @returns {object} New level configuration
   */
  nextLevel() {
    if (this.currentLevel < getTotalLevels()) {
      this.currentLevel++;
    }
    return this.startLevel();
  }

  /**
   * Check if current wave is the boss wave (wave 5).
   * @returns {boolean}
   */
  isBossWave() {
    return this.currentWaveInLevel === WAVES_PER_LEVEL;
  }

  /**
   * Get configuration for current level.
   * @returns {object} Level configuration
   */
  getCurrentLevelConfig() {
    return getLevelConfig(this.currentLevel);
  }

  /**
   * Get the system ID that unlocks at current level.
   * @returns {string|null}
   */
  getCurrentLevelSystem() {
    const config = this.getCurrentLevelConfig();
    return config ? config.systemId : null;
  }

  /**
   * Get all active system IDs for current level.
   * @returns {string[]}
   */
  getActiveSystemIds() {
    return getActiveSystemsForLevel(this.currentLevel);
  }

  /**
   * Check if a specific system is active at current level.
   * @param {string} systemId
   * @returns {boolean}
   */
  isSystemActive(systemId) {
    return isSystemActiveAtLevel(systemId, this.currentLevel);
  }

  /**
   * Update the set of unlocked systems based on current level.
   */
  updateUnlockedSystems() {
    const activeSystems = this.getActiveSystemIds();
    activeSystems.forEach(systemId => {
      this.unlockedSystems.add(systemId);
    });
  }

  /**
   * Mark boss as defeated for current level.
   */
  onBossDefeated() {
    this.bossDefeatedThisLevel = true;
    this.scene.events.emit('bossDefeated', {
      level: this.currentLevel,
      wave: this.currentWaveInLevel
    });
  }

  /**
   * Get current level display info.
   * @returns {object}
   */
  getDisplayInfo() {
    const config = this.getCurrentLevelConfig();
    return {
      level: this.currentLevel,
      waveInLevel: this.currentWaveInLevel,
      totalWaves: WAVES_PER_LEVEL,
      wavesRemaining: WAVES_PER_LEVEL - this.currentWaveInLevel + 1,
      isBossWave: this.isBossWave(),
      name: config ? config.name : 'Unknown',
      systemName: config && config.systemId ? config.name : null,
      tier: config ? config.tier : null
    };
  }

  /**
   * Check if we're on the first wave of a level (for dialog display).
   * @returns {boolean}
   */
  isFirstWaveOfLevel() {
    return this.currentWaveInLevel === 1 && this.levelInProgress;
  }

  /**
   * Save progress to localStorage.
   */
  saveProgress() {
    try {
      const data = {
        maxLevelReached: this.maxLevelReached,
        unlockedSystems: Array.from(this.unlockedSystems),
        version: 'v1'
      };
      localStorage.setItem('shooty_level_progress_v1', JSON.stringify(data));
    } catch (e) {
      console.warn('[LevelManager] Failed to save progress:', e);
    }
  }

  /**
   * Load progress from localStorage.
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem('shooty_level_progress_v1');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.maxLevelReached) {
          this.maxLevelReached = data.maxLevelReached;
        }
        if (data.unlockedSystems) {
          this.unlockedSystems = new Set(data.unlockedSystems);
        }
        console.log(`[LevelManager] Loaded progress: max level ${this.maxLevelReached}`);
      }
    } catch (e) {
      console.warn('[LevelManager] Failed to load progress:', e);
    }
  }

  /**
   * Reset all progress.
   */
  resetProgress() {
    this.currentLevel = 1;
    this.currentWaveInLevel = 1;
    this.totalWavesCompleted = 0;
    this.maxLevelReached = 1;
    this.unlockedSystems.clear();
    this.bossDefeatedThisLevel = false;
    this.levelInProgress = false;

    try {
      localStorage.removeItem('shooty_level_progress_v1');
    } catch (e) {
      console.warn('[LevelManager] Failed to clear progress:', e);
    }

    console.log('[LevelManager] Progress reset');
  }

  /**
   * Get total number of levels.
   * @returns {number}
   */
  getTotalLevels() {
    return getTotalLevels();
  }

  /**
   * Check if current level has a new system to introduce.
   * @returns {boolean}
   */
  hasNewSystemThisLevel() {
    const config = this.getCurrentLevelConfig();
    return config && config.systemId !== null && this.currentLevel > 1;
  }

  /**
   * Destroy and cleanup.
   */
  destroy() {
    this.saveProgress();
  }
}
