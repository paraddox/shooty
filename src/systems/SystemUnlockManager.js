/**
 * SystemUnlockManager.js
 * 
 * Manages progressive system unlocking based on game progression.
 * Tracks player progress and activates systems when conditions are met.
 */

import {
    SYSTEM_UNLOCK_CONFIG,
    SYSTEM_TIERS,
    getActiveSystemsForState,
    getSystemConfig,
    UNLOCK_TRIGGERS
} from './SystemUnlockConfig.js';

export default class SystemUnlockManager {
    constructor(scene) {
        this.scene = scene;
        
        // Current game state
        this.currentWave = 1;
        this.sessionStartTime = Date.now();
        this.sessionTime = 0;
        
        // Persistent progress (loaded from storage)
        this.totalRuns = 0;
        this.totalDeaths = 0;
        this.highScore = 0;
        this.bossesKilled = 0;
        
        // Active systems tracking
        this.activeSystems = new Set();
        this.newlyUnlockedThisWave = [];
        this.warningShown = new Set();
        
        // Manual unlocks (for systems that can be unlocked manually)
        this.manualUnlocks = new Set();
        
        // Unlock announcement queue
        this.announcementQueue = [];
        
        // Load saved progress
        this.loadProgress();
        
        // Initial calculation
        this.updateActiveSystems();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Wave progression
        this.scene.events.on('waveComplete', (wave) => this.onWaveComplete(wave));
        this.scene.events.on('nextWave', (wave) => this.onNextWave(wave));
        
        // Game end states
        this.scene.events.on('playerDeath', () => this.onPlayerDeath());
        this.scene.events.on('gameOver', (data) => this.onGameOver(data));
        
        // Boss kills
        this.scene.events.on('bossKilled', (data) => {
            this.bossesKilled++;
            this.saveProgress();
        });
    }
    
    /**
     * Called when a wave completes
     */
    onWaveComplete(wave) {
        this.currentWave = wave;
        const newUnlocks = this.updateActiveSystems();
        
        if (newUnlocks.length > 0) {
            this.scene.events.emit('systemsUnlocked', newUnlocks);
        }
    }
    
    /**
     * Called when transitioning to next wave
     */
    onNextWave(wave) {
        this.currentWave = wave;
        this.newlyUnlockedThisWave = [];
        this.warningShown.clear();
        
        const newUnlocks = this.updateActiveSystems();
        
        if (newUnlocks.length > 0) {
            this.newlyUnlockedThisWave = newUnlocks;
            this.scene.events.emit('systemsUnlocked', newUnlocks);
        }
    }
    
    /**
     * Called when player dies
     */
    onPlayerDeath() {
        this.totalDeaths++;
        this.saveProgress();
        
        // Check if death unlocks anything (rare, but possible)
        const newUnlocks = this.updateActiveSystems();
        if (newUnlocks.length > 0) {
            this.scene.events.emit('systemsUnlocked', newUnlocks);
        }
    }
    
    /**
     * Called on game over
     */
    onGameOver(data) {
        this.totalRuns++;
        if (data.score > this.highScore) {
            this.highScore = data.score;
        }
        this.saveProgress();
    }
    
    /**
     * Update which systems should be active based on current state
     * Returns array of newly unlocked system IDs
     */
    updateActiveSystems() {
        this.sessionTime = Date.now() - this.sessionStartTime;
        
        const newActiveIds = getActiveSystemsForState(
            this.currentWave,
            this.totalRuns,
            this.totalDeaths,
            this.sessionTime
        );
        
        // Find newly unlocked systems
        const newlyUnlocked = [];
        for (const systemId of newActiveIds) {
            if (!this.activeSystems.has(systemId)) {
                newlyUnlocked.push(systemId);
                this.activeSystems.add(systemId);
            }
        }
        
        return newlyUnlocked;
    }
    
    /**
     * Check if a specific system is active
     */
    isSystemActive(systemId) {
        return this.activeSystems.has(systemId);
    }
    
    /**
     * Get all currently active systems
     */
    getActiveSystems() {
        return Array.from(this.activeSystems);
    }
    
    /**
     * Get system config for an active system
     */
    getSystemConfig(systemId) {
        return getSystemConfig(systemId);
    }
    
    /**
     * Get next upcoming unlock (for progress indication)
     */
    getNextUnlock() {
        const inactiveConfigs = SYSTEM_UNLOCK_CONFIG.filter(
            config => !this.activeSystems.has(config.id)
        );
        
        // Sort by unlock value
        inactiveConfigs.sort((a, b) => {
            const aVal = this.getUnlockProgress(a).progress;
            const bVal = this.getUnlockProgress(b).progress;
            return bVal - aVal; // Highest progress first
        });
        
        return inactiveConfigs[0] || null;
    }
    
    /**
     * Get progress toward unlocking a specific system
     */
    getUnlockProgress(config) {
        let current = 0;
        let target = config.value;
        
        switch (config.trigger) {
            case UNLOCK_TRIGGERS.WAVE:
                current = this.currentWave;
                break;
            case UNLOCK_TRIGGERS.RUN:
                current = this.totalRuns;
                break;
            case UNLOCK_TRIGGERS.DEATH:
                current = this.totalDeaths;
                break;
            case UNLOCK_TRIGGERS.TIME:
                current = Math.floor(this.sessionTime / 60000); // minutes
                break;
            case UNLOCK_TRIGGERS.MANUAL:
                current = target;
                break;
        }
        
        return {
            current,
            target,
            progress: Math.min(1, current / target),
            remaining: Math.max(0, target - current)
        };
    }
    
    /**
     * Queue an unlock announcement
     */
    queueUnlockAnnouncement(systemId) {
        const config = getSystemConfig(systemId);
        if (!config) return;
        
        const nextUnlock = this.getNextUnlock();
        const nextUnlockData = nextUnlock ? {
            system: nextUnlock,
            progress: this.getUnlockProgress(nextUnlock)
        } : null;
        
        this.announcementQueue.push({
            type: 'systemUnlock',
            systemId,
            config,
            nextUnlockData
        });
    }
    
    /**
     * Get next announcement from queue (sorted by priority, highest first)
     */
    getNextAnnouncement() {
        if (this.announcementQueue.length === 0) return null;
        
        // Sort by priority (highest first) and return the first
        this.announcementQueue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        return this.announcementQueue[0];
    }
    
    /**
     * Check if there are pending announcements
     */
    hasAnnouncements() {
        return this.announcementQueue.length > 0;
    }
    
    /**
     * Load persistent progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('shooty_system_unlocks_v1');
            if (saved) {
                const data = JSON.parse(saved);
                this.totalRuns = data.totalRuns || 0;
                this.totalDeaths = data.totalDeaths || 0;
                this.highScore = data.highScore || 0;
                this.bossesKilled = data.bossesKilled || 0;
            }
        } catch (e) {
            console.warn('[SystemUnlockManager] Failed to load progress:', e);
        }
    }
    
    /**
     * Save persistent progress to localStorage
     */
    saveProgress() {
        try {
            const data = {
                totalRuns: this.totalRuns,
                totalDeaths: this.totalDeaths,
                highScore: this.highScore,
                bossesKilled: this.bossesKilled,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('shooty_system_unlocks_v1', JSON.stringify(data));
        } catch (e) {
            console.warn('[SystemUnlockManager] Failed to save progress:', e);
        }
    }
    
    /**
     * Manually unlock a system (for testing or special conditions)
     */
    manualUnlock(systemId) {
        this.manualUnlocks.add(systemId);
        this.activeSystems.add(systemId);
        this.saveProgress();
        return true;
    }
    
    /**
     * Reset all progress (for testing or player request)
     */
    resetProgress() {
        this.totalRuns = 0;
        this.totalDeaths = 0;
        this.highScore = 0;
        this.bossesKilled = 0;
        this.manualUnlocks.clear();
        this.activeSystems.clear();
        
        // Save reset state (test expects setItem to be called)
        this.saveProgress();
        
        // Re-initialize
        this.resetSession();
    }
    
    /**
     * Reset session progress (called on new game)
     */
    resetSession() {
        this.sessionStartTime = Date.now();
        this.sessionTime = 0;
        this.currentWave = 1;
        this.activeSystems.clear();
        this.newlyUnlockedThisWave = [];
        this.warningShown.clear();
        this.announcementQueue = [];
        
        // Re-calculate with fresh session
        this.updateActiveSystems();
    }
    
    /**
     * Get debug info for development
     */
    getDebugInfo() {
        return {
            currentWave: this.currentWave,
            sessionTime: Math.floor(this.sessionTime / 1000),
            totalRuns: this.totalRuns,
            totalDeaths: this.totalDeaths,
            activeSystems: Array.from(this.activeSystems),
            inactiveCount: SYSTEM_UNLOCK_CONFIG.length - this.activeSystems.size,
            nextUnlock: this.getNextUnlock()?.id || null
        };
    }
    
    /**
     * Update loop - called every frame to check time-based unlocks
     */
    update(dt) {
        this.sessionTime = Date.now() - this.sessionStartTime;
        
        // Check for time-based unlocks
        const newUnlocks = this.updateActiveSystems();
        if (newUnlocks.length > 0) {
            this.scene.events.emit('systemsUnlocked', newUnlocks);
        }
    }
    
    /**
     * Get progress toward next unlock
     */
    getNextUnlockProgress() {
        const nextUnlock = this.getNextUnlock();
        if (!nextUnlock) {
            return { system: null, current: 0, target: 1, progress: 1.0, remaining: 0 };
        }
        const progress = this.getUnlockProgress(nextUnlock);
        return {
            system: nextUnlock,
            ...progress
        };
    }
    
    /**
     * Clear the announcement queue
     */
    clearAnnouncements() {
        this.announcementQueue = [];
        if (this.queue) {
            this.queue.length = 0;
        }
    }
    
    /**
     * Get tutorial content for a system
     */
    getSystemTutorial(systemId) {
        const config = getSystemConfig(systemId);
        if (!config) return null;
        
        return {
            title: config.name,
            name: config.name,
            description: config.description,
            hint: config.hint,
            color: config.color,
            tier: config.tier
        };
    }
    
    /**
     * Get unlock statistics by tier
     */
    getUnlockStats() {
        const stats = {
            total: this.activeSystems.size,
            max: SYSTEM_UNLOCK_CONFIG.length
        };
        
        // Initialize tier counts directly on stats object (for test compatibility)
        for (const tier of Object.values(SYSTEM_TIERS)) {
            stats[tier] = { unlocked: 0, total: 0 };
        }
        
        // Count by tier
        for (const config of SYSTEM_UNLOCK_CONFIG) {
            stats[config.tier].total++;
            if (this.activeSystems.has(config.id)) {
                stats[config.tier].unlocked++;
            }
        }
        
        return stats;
    }
}
