/**
 * PauseSystem — Unified game pause manager
 * 
 * Centralized pause/resume functionality for all game dialogs and systems.
 * Handles physics, tweens, velocities, invulnerability, and all system updates.
 */

export default class PauseSystem {
    constructor(scene) {
        this.scene = scene;
        this.isPaused = false;
        this.pauseReason = null; // 'exchange', 'contract', etc.
        this.pausedVelocities = new Map(); // Store velocities by object
    }

    /**
     * Pause the game
     * @param {string} reason - Why we're pausing ('exchange', 'contract', etc.)
     * @returns {boolean} - Whether pause succeeded
     */
    pause(reason = 'unknown') {
        if (this.isPaused) {
            console.log(`[PauseSystem] Already paused (reason: ${this.pauseReason}), adding ${reason}`);
            return false;
        }

        this.isPaused = true;
        this.pauseReason = reason;

        // 1. Pause physics world
        this.scene.physics.world.pause();
        this.scene.physics.world.timeScale = 0;

        // 2. Pause all tweens (but NOT for patch_mode - UI needs animations)
        if (reason !== 'patch_mode') {
            this.scene.tweens.pauseAll();
        }
        
        // 3. Pause the Time system (stops delayedCall and addEvent) - but NOT for patch_mode
        if (reason !== 'patch_mode') {
            this.scene.time.paused = true;
        }
        
        // 4. Stop all enemy movement
        this.scene.enemies?.children?.entries?.forEach(enemy => {
            if (enemy.body) {
                this.pausedVelocities.set(enemy, {
                    x: enemy.body.velocity.x,
                    y: enemy.body.velocity.y
                });
                enemy.body.setVelocity(0, 0);
            }
            enemy._paused = true;
        });

        // 4. Stop enemy bullets
        this.scene.enemyBullets?.children?.entries?.forEach(bullet => {
            if (bullet.body) {
                this.pausedVelocities.set(bullet, {
                    x: bullet.body.velocity.x,
                    y: bullet.body.velocity.y
                });
                bullet.body.setVelocity(0, 0);
            }
        });

        // 5. Stop player bullets
        this.scene.bullets?.children?.entries?.forEach(bullet => {
            if (bullet.body) {
                this.pausedVelocities.set(bullet, {
                    x: bullet.body.velocity.x,
                    y: bullet.body.velocity.y
                });
                bullet.body.setVelocity(0, 0);
            }
        });

        // 6. Disable player controls and make invulnerable
        if (this.scene.player) {
            this.scene.player._wasInvulnerable = this.scene.player.isInvulnerable;
            this.scene.player.isInvulnerable = true;
            this.scene.player._paused = true;
        }

        // 7. Set scene-wide pause flags (for backward compatibility)
        this.scene.isPaused = true;
        if (reason === 'exchange') {
            this.scene.isExchangePaused = true;
        } else if (reason === 'contract') {
            this.scene.isContractPaused = true;
        }

        console.log(`[PauseSystem] Game paused: ${reason}`);
        return true;
    }

    /**
     * Resume the game
     * @param {string} reason - Must match the pause reason to resume
     * @returns {boolean} - Whether resume succeeded
     */
    resume(reason = 'unknown') {
        if (!this.isPaused) {
            console.log('[PauseSystem] Not paused, nothing to resume');
            return false;
        }

        // Allow resume if reason matches or no specific reason stored
        if (this.pauseReason && this.pauseReason !== reason && reason !== 'force') {
            console.log(`[PauseSystem] Cannot resume ${reason} while paused for ${this.pauseReason}`);
            return false;
        }

        // 1. Resume physics world
        this.scene.physics.world.resume();
        this.scene.physics.world.timeScale = 1;

        // 2. Resume all tweens (only if we paused them - not for patch_mode)
        if (this.pauseReason !== 'patch_mode') {
            this.scene.tweens.resumeAll();
        }
        
        // 3. Resume the Time system (only if we paused it - not for patch_mode)
        if (this.pauseReason !== 'patch_mode') {
            this.scene.time.paused = false;
        }

        // 4. Restore enemy velocities
        this.scene.enemies?.children?.entries?.forEach(enemy => {
            const velocity = this.pausedVelocities.get(enemy);
            if (enemy.body && velocity) {
                enemy.body.setVelocity(velocity.x, velocity.y);
            }
            delete enemy._paused;
        });

        // 4. Restore enemy bullet velocities
        this.scene.enemyBullets?.children?.entries?.forEach(bullet => {
            const velocity = this.pausedVelocities.get(bullet);
            if (bullet.body && velocity) {
                bullet.body.setVelocity(velocity.x, velocity.y);
            }
        });

        // 5. Restore player bullet velocities
        this.scene.bullets?.children?.entries?.forEach(bullet => {
            const velocity = this.pausedVelocities.get(bullet);
            if (bullet.body && velocity) {
                bullet.body.setVelocity(velocity.x, velocity.y);
            }
        });

        // 6. Restore player controls and invulnerability
        if (this.scene.player) {
            // Only remove invulnerability if player wasn't already invulnerable
            if (!this.scene.player._wasInvulnerable) {
                this.scene.player.isInvulnerable = false;
            }
            delete this.scene.player._wasInvulnerable;
            delete this.scene.player._paused;
        }

        // 7. Clear scene-wide pause flags
        this.scene.isPaused = false;
        this.scene.isExchangePaused = false;
        this.scene.isContractPaused = false;

        // Clear stored velocities
        this.pausedVelocities.clear();

        const wasReason = this.pauseReason;
        this.isPaused = false;
        this.pauseReason = null;

        console.log(`[PauseSystem] Game resumed from: ${wasReason}`);
        return true;
    }

    /**
     * Toggle pause state
     * @param {string} reason - Reason for pausing (ignored when resuming)
     * @returns {boolean} - New pause state
     */
    toggle(reason = 'unknown') {
        if (this.isPaused) {
            this.resume(reason);
            return false;
        } else {
            this.pause(reason);
            return true;
        }
    }

    /**
     * Force resume regardless of reason
     * @returns {boolean} - Whether resume succeeded
     */
    forceResume() {
        return this.resume('force');
    }

    /**
     * Check if game is currently paused
     * @returns {boolean}
     */
    get paused() {
        return this.isPaused;
    }

    /**
     * Get current pause reason
     * @returns {string|null}
     */
    get reason() {
        return this.pauseReason;
    }

    /**
     * Clean up
     */
    destroy() {
        this.pausedVelocities.clear();
    }
}
