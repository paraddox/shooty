import Phaser from 'phaser';
import {
  TIME_BASED_UNLOCK_CONFIG,
  UNLOCK_INTERVAL,
  WARNING_BEFORE_UNLOCK,
  getNextTimeBasedUnlock
} from './TimeBasedUnlockConfig.js';

/**
 * SlowSystemUnlockManager
 * 
 * Manages the introduction of game systems at a deliberately slow pace:
 * - Maximum 1 new system every 3 minutes of gameplay
 * - Systems unlock in order of complexity
 * - Provides clear progress indicators and warnings
 * 
 * This creates a more gentle learning curve where players have time
 * to fully understand each system before encountering the next.
 */
export default class SlowSystemUnlockManager {
  constructor(scene) {
    this.scene = scene;
    
    // Session tracking
    this.sessionStartTime = scene.time.now;
    this.sessionTime = 0;
    this.lastUnlockTime = null;
    
    // Unlock state
    this.permanentlyUnlocked = new Set(); // Carries across runs
    this.sessionUnlocked = []; // Just this session, in order
    this.warningShown = new Set(); // Track which warnings we've shown
    
    // Load saved progress
    this.loadProgress();
    
    // Initialize with core systems always available
    this.initializeCoreSystems();
    
    console.log('[SlowSystemUnlockManager] Initialized');
  }

  /**
   * Core systems are not pre-unlocked - everything comes at the 3 min interval
   */
  initializeCoreSystems() {
    // No pre-unlocking - even core systems follow the 3 minute rule
    // This ensures consistent pacing throughout the experience
  }

  /**
   * Main update method - check for new unlocks based on elapsed time
   * @param {number} currentTime - Current scene time in ms
   * @returns {string[]} Array of newly unlocked system IDs
   */
  update(currentTime) {
    this.sessionTime = currentTime - this.sessionStartTime;
    
    const newlyUnlocked = [];
    const elapsedMinutes = this.sessionTime / 60000;
    
    // Get the next system that should be unlocked
    const nextSystem = getNextTimeBasedUnlock(
      elapsedMinutes,
      this.getAllUnlockedIds()
    );
    
    if (nextSystem) {
      // Check if enough time has passed since last unlock
      const timeSinceLastUnlock = this.getTimeSinceLastUnlock();
      
      if (timeSinceLastUnlock === null || timeSinceLastUnlock >= UNLOCK_INTERVAL) {
        // Unlock the system
        this.unlockSystem(nextSystem.id);
        newlyUnlocked.push(nextSystem.id);
        
        // Emit event
        this.scene.events.emit('systemUnlocked', {
          systemId: nextSystem.id,
          system: nextSystem,
          sessionTime: this.sessionTime,
          timeUntilNext: UNLOCK_INTERVAL,
          unlockNumber: this.sessionUnlocked.length
        });
        
        console.log(`[SlowSystemUnlockManager] Unlocked: ${nextSystem.name} (${this.sessionUnlocked.length}/${TIME_BASED_UNLOCK_CONFIG.length})`);
      }
    }
    
    // Check for upcoming unlocks (warning at 30 seconds before)
    this.checkUpcomingUnlocks();
    
    return newlyUnlocked;
  }

  /**
   * Unlock a specific system
   */
  unlockSystem(systemId) {
    if (!this.permanentlyUnlocked.has(systemId)) {
      this.permanentlyUnlocked.add(systemId);
      this.sessionUnlocked.push(systemId);
      this.lastUnlockTime = this.sessionTime;
      this.warningShown.delete(systemId); // Reset warning for next time
      
      // Save progress
      this.saveProgress();
    }
  }

  /**
   * Check for upcoming unlocks and emit warnings
   */
  checkUpcomingUnlocks() {
    const elapsedMinutes = this.sessionTime / 60000;
    
    for (const system of TIME_BASED_UNLOCK_CONFIG) {
      const systemUnlockMs = system.recommendedMinute * 60000;
      const warningTime = systemUnlockMs - WARNING_BEFORE_UNLOCK;
      
      // Check if we're in the warning window and haven't shown warning yet
      if (this.sessionTime >= warningTime && 
          this.sessionTime < systemUnlockMs &&
          !this.warningShown.has(system.id) &&
          !this.permanentlyUnlocked.has(system.id)) {
        
        this.warningShown.add(system.id);
        
        // Calculate which unlock number this will be
        const unlockNumber = this.sessionUnlocked.length + 1;
        
        this.scene.events.emit('unlockApproaching', {
          systemId: system.id,
          systemName: system.name,
          secondsUntilUnlock: Math.ceil((systemUnlockMs - this.sessionTime) / 1000),
          unlockNumber: unlockNumber,
          totalSystems: TIME_BASED_UNLOCK_CONFIG.length
        });
        
        console.log(`[SlowSystemUnlockManager] Approaching unlock: ${system.name} in ${Math.ceil((systemUnlockMs - this.sessionTime) / 1000)}s`);
      }
    }
  }

  /**
   * Get time since last unlock in milliseconds
   */
  getTimeSinceLastUnlock() {
    if (this.lastUnlockTime === null) return null;
    return this.sessionTime - this.lastUnlockTime;
  }

  /**
   * Get time until next unlock
   */
  getTimeUntilNextUnlock() {
    const timeSinceLast = this.getTimeSinceLastUnlock();
    if (timeSinceLast === null) {
      // First unlock happens at 3 minutes
      return Math.max(0, UNLOCK_INTERVAL - this.sessionTime);
    }
    return Math.max(0, UNLOCK_INTERVAL - timeSinceLast);
  }

  /**
   * Get progress toward next unlock (0.0 to 1.0)
   */
  getUnlockProgress(currentSessionTime) {
    const time = currentSessionTime || this.sessionTime;
    
    // Check if we have any unlocked systems
    if (this.lastUnlockTime === null) {
      // First unlock happens at 3 minutes
      const firstSystem = TIME_BASED_UNLOCK_CONFIG[0];
      const timeNeeded = firstSystem.recommendedMinute * 60000;
      return Math.min(1.0, time / timeNeeded);
    }
    
    // Calculate progress since last unlock
    const timeSinceLast = time - this.lastUnlockTime;
    return Math.min(1.0, timeSinceLast / UNLOCK_INTERVAL);
  }

  /**
   * Get formatted time string for next unlock
   */
  getFormattedTimeUntilNextUnlock() {
    const ms = this.getTimeUntilNextUnlock();
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Check if a system is unlocked
   */
  isSystemUnlocked(systemId) {
    return this.permanentlyUnlocked.has(systemId);
  }

  /**
   * Get number of unlocked systems
   */
  getUnlockedCount() {
    return this.permanentlyUnlocked.size;
  }

  /**
   * Get number of remaining locked systems
   */
  getRemainingCount() {
    return TIME_BASED_UNLOCK_CONFIG.length - this.permanentlyUnlocked.size;
  }

  /**
   * Get all unlocked system IDs
   */
  getAllUnlockedIds() {
    return Array.from(this.permanentlyUnlocked);
  }

  /**
   * Get estimated time to unlock all systems (in minutes)
   */
  getEstimatedTimeToUnlockAll() {
    const remaining = this.getRemainingCount();
    return remaining * 3; // 3 minutes per system
  }

  /**
   * Get total session time
   */
  getSessionTime() {
    return this.sessionTime;
  }

  /**
   * Get formatted session time
   */
  getFormattedSessionTime() {
    const minutes = Math.floor(this.sessionTime / 60000);
    const seconds = Math.floor((this.sessionTime % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get next unlock info
   */
  getNextUnlockInfo() {
    const elapsedMinutes = this.sessionTime / 60000;
    const nextSystem = getNextTimeBasedUnlock(
      elapsedMinutes,
      this.getAllUnlockedIds()
    );
    
    if (!nextSystem) {
      return null;
    }
    
    const timeUntil = this.getTimeUntilNextUnlock();
    const progress = this.getUnlockProgress();
    
    return {
      systemId: nextSystem.id,
      name: nextSystem.name,
      tier: nextSystem.tier,
      timeRemaining: timeUntil,
      formattedTimeRemaining: this.getFormattedTimeUntilNextUnlock(),
      progress: progress,
      unlockNumber: this.sessionUnlocked.length + 1
    };
  }

  /**
   * Get tutorial content for a system
   */
  getSystemTutorial(systemId) {
    const system = TIME_BASED_UNLOCK_CONFIG.find(s => s.id === systemId);
    if (!system) return null;
    
    return {
      title: system.name,
      description: system.description,
      hint: system.hint,
      color: system.color,
      tier: system.tier,
      recommendedMinute: system.recommendedMinute
    };
  }

  /**
   * Get summary of unlocked systems
   */
  getUnlockSummary() {
    const summary = {
      core: 0,
      foundation: 0,
      adaptive: 0,
      strategic: 0,
      meta: 0,
      transcendent: 0,
      total: 0,
      max: TIME_BASED_UNLOCK_CONFIG.length
    };
    
    for (const systemId of this.permanentlyUnlocked) {
      const system = TIME_BASED_UNLOCK_CONFIG.find(s => s.id === systemId);
      if (system) {
        summary[system.tier]++;
        summary.total++;
      }
    }
    
    return summary;
  }

  /**
   * Save progress to localStorage
   */
  saveProgress() {
    try {
      const data = {
        permanentlyUnlocked: Array.from(this.permanentlyUnlocked),
        sessionUnlocked: this.sessionUnlocked,
        totalPlaytime: this.sessionTime,
        version: 'v1'
      };
      localStorage.setItem('shooty_slow_unlocks_v1', JSON.stringify(data));
    } catch (e) {
      console.warn('[SlowSystemUnlockManager] Failed to save progress:', e);
    }
  }

  /**
   * Load progress from localStorage
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem('shooty_slow_unlocks_v1');
      if (saved) {
        const data = JSON.parse(saved);
        
        if (data.permanentlyUnlocked) {
          this.permanentlyUnlocked = new Set(data.permanentlyUnlocked);
        }
        
        if (data.sessionUnlocked) {
          this.sessionUnlocked = data.sessionUnlocked;
        }
        
        console.log(`[SlowSystemUnlockManager] Loaded progress: ${this.permanentlyUnlocked.size} systems unlocked`);
      }
    } catch (e) {
      console.warn('[SlowSystemUnlockManager] Failed to load progress:', e);
    }
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    this.permanentlyUnlocked.clear();
    this.sessionUnlocked = [];
    this.warningShown.clear();
    this.lastUnlockTime = null;
    
    // Re-initialize core
    this.initializeCoreSystems();
    
    try {
      localStorage.removeItem('shooty_slow_unlocks_v1');
    } catch (e) {
      console.warn('[SlowSystemUnlockManager] Failed to clear progress:', e);
    }
    
    console.log('[SlowSystemUnlockManager] Progress reset');
  }

  /**
   * Manual unlock for testing/debug
   */
  manualUnlock(systemId) {
    this.unlockSystem(systemId);
    this.saveProgress();
  }

  /**
   * Get all systems info (for UI)
   */
  getAllSystemsInfo() {
    return TIME_BASED_UNLOCK_CONFIG.map(system => ({
      ...system,
      isUnlocked: this.permanentlyUnlocked.has(system.id),
      unlockNumber: this.sessionUnlocked.indexOf(system.id) + 1 || null
    }));
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.saveProgress();
  }
}
