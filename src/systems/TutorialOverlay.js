/**
 * TutorialOverlay.js
 * 
 * Modal overlay that displays when new systems unlock.
 * Shows system name, description, usage hint, and progress toward next unlock.
 * Pauses gameplay during display.
 */

import { getTierColor, SYSTEM_TIERS } from './SystemUnlockConfig.js';

export default class TutorialOverlay {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.isVisible = false;
        this.currentTutorial = null;
        this.autoDismissTimer = null;
        
        // Display duration settings
        this.DISPLAY_DURATION = 8000; // 8 seconds per tutorial
        this.FADE_DURATION = 300;
        
        // Announcement queue for unlock notifications
        this.announcementQueue = [];
        // Alias for test compatibility
        this.queue = this.announcementQueue;
        
        this.createUI();
        this.hide();
    }
    
    createUI() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const cx = width / 2;
        const cy = height / 2;
        
        // Main container
        this.container = this.scene.add.container(0, 0);
        this.container.setDepth(1000); // Above everything
        this.container.setScrollFactor(0); // Fixed to screen
        
        // Full-screen dimmed background
        this.background = this.scene.add.rectangle(cx, cy, width, height, 0x0a0a0f, 0.85);
        this.background.setInteractive();
        this.background.on('pointerdown', () => this.dismiss());
        this.container.add(this.background);
        
        // Panel background
        this.panel = this.scene.add.rectangle(cx, cy, 500, 280, 0x1a1a25, 0.98);
        this.panel.setStrokeStyle(2, 0x2a2a35);
        this.container.add(this.panel);
        
        // Tier color bar at top
        this.tierBar = this.scene.add.rectangle(cx, cy - 110, 500, 4, 0x00f0ff, 1);
        this.container.add(this.tierBar);
        
        // System name title
        this.titleText = this.scene.add.text(cx, cy - 80, '', {
            fontFamily: 'monospace',
            fontSize: '28px',
            fontStyle: 'bold',
            letterSpacing: 3,
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.container.add(this.titleText);
        
        // Tier label
        this.tierText = this.scene.add.text(cx, cy - 50, '', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 2,
            fill: '#666666'
        }).setOrigin(0.5);
        this.container.add(this.tierText);
        
        // Separator line
        this.separator = this.scene.add.rectangle(cx, cy - 25, 400, 1, 0x333333, 1);
        this.container.add(this.separator);
        
        // Description text
        this.descriptionText = this.scene.add.text(cx, cy - 5, '', {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#cccccc',
            align: 'center',
            wordWrap: { width: 440 }
        }).setOrigin(0.5);
        this.container.add(this.descriptionText);
        
        // Hint box background
        this.hintBg = this.scene.add.rectangle(cx, cy + 65, 440, 50, 0x0f0f15, 1);
        this.hintBg.setStrokeStyle(1, 0x3a3a45);
        this.container.add(this.hintBg);
        
        // Hint label
        this.hintLabel = this.scene.add.text(cx - 210, cy + 45, 'HINT:', {
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: 1,
            fill: '#00f0ff'
        }).setOrigin(0, 0);
        this.container.add(this.hintLabel);
        
        // Hint text
        this.hintText = this.scene.add.text(cx, cy + 70, '', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 0.5,
            fill: '#9d4edd',
            align: 'center',
            wordWrap: { width: 420 }
        }).setOrigin(0.5);
        this.container.add(this.hintText);
        
        // Progress section (for showing next unlock)
        this.progressBg = this.scene.add.rectangle(cx, cy + 115, 440, 30, 0x0f0f15, 0.5);
        this.progressBg.setVisible(false);
        this.container.add(this.progressBg);
        
        this.progressLabel = this.scene.add.text(cx - 210, cy + 105, '', {
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: 1,
            fill: '#666666'
        }).setOrigin(0, 0);
        this.progressLabel.setVisible(false);
        this.container.add(this.progressLabel);
        
        this.progressBar = this.scene.add.rectangle(cx - 210, cy + 122, 0, 4, 0x9d4edd, 1);
        this.progressBar.setOrigin(0, 0.5);
        this.progressBar.setVisible(false);
        this.container.add(this.progressBar);
        
        // Dismiss hint
        this.dismissText = this.scene.add.text(cx, cy + 135, '[SPACE] or CLICK to continue', {
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: 1,
            fill: '#444444'
        }).setOrigin(0.5);
        this.container.add(this.dismissText);
        
        // Keyboard input - store handlers for cleanup
        this.keyHandlers = [];
        
        const spaceHandler = () => { if (this.isVisible) this.dismiss(); };
        const enterHandler = () => { if (this.isVisible) this.dismiss(); };
        const escHandler = () => { if (this.isVisible) this.dismiss(); };
        
        this.scene.input.keyboard.on('keydown-SPACE', spaceHandler);
        this.scene.input.keyboard.on('keydown-ENTER', enterHandler);
        this.scene.input.keyboard.on('keydown-ESC', escHandler);
        
        this.keyHandlers = [
            { key: 'keydown-SPACE', handler: spaceHandler },
            { key: 'keydown-ENTER', handler: enterHandler },
            { key: 'keydown-ESC', handler: escHandler }
        ];
    }
    
    /**
     * Show a tutorial for a newly unlocked system
     */
    show(config, nextUnlockData = null) {
        this.currentTutorial = config;
        
        // Set tier color
        const tierColor = getTierColor(config.tier);
        const tierColorHex = '#' + tierColor.toString(16).padStart(6, '0');
        this.tierBar.setFillStyle(tierColor);
        this.hintLabel.setColor(tierColorHex);
        
        // Set text content (handle both 'title' and 'name' for compatibility)
        const title = config.title || config.name || 'Unknown System';
        const tier = config.tier || 'core';
        const description = config.description || '';
        const hint = config.hint || '';
        
        this.titleText.setText(title.toUpperCase());
        this.tierText.setText(tier.toUpperCase() + ' SYSTEM');
        this.descriptionText.setText(description);
        this.hintText.setText(hint);
        
        // Show/hide progress section based on next unlock data
        if (nextUnlockData) {
            this.progressBg.setVisible(true);
            this.progressLabel.setVisible(true);
            this.progressBar.setVisible(true);
            
            const nextName = nextUnlockData.system.name;
            const progress = nextUnlockData.progress;
            const remaining = nextUnlockData.progress.remaining;
            
            this.progressLabel.setText(`NEXT: ${nextName.toUpperCase()} (${remaining} to go)`);
            
            // Update progress bar width based on progress
            const maxWidth = 420;
            const barWidth = maxWidth * progress.progress;
            this.progressBar.width = Math.max(0, barWidth);
            
            // Shift dismiss text down
            this.dismissText.y = this.scene.cameras.main.height / 2 + 135;
        } else {
            this.progressBg.setVisible(false);
            this.progressLabel.setVisible(false);
            this.progressBar.setVisible(false);
            this.dismissText.y = this.scene.cameras.main.height / 2 + 115;
        }
        
        // Show container
        this.container.setVisible(true);
        this.container.setAlpha(0);
        this.isVisible = true;
        
        // Animate in
        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            duration: this.FADE_DURATION,
            ease: 'Power2'
        });
        
        // Emit event
        this.scene.events.emit('tutorialShown', config);
        
        // Auto-dismiss after duration
        this.autoDismissTimer = this.scene.time.delayedCall(this.DISPLAY_DURATION, () => {
            if (this.isVisible) this.dismiss();
        });
    }
    
    /**
     * Hide the tutorial overlay
     */
    hide() {
        this.container.setVisible(false);
        this.container.setAlpha(0);
        this.isVisible = false;
        
        if (this.autoDismissTimer) {
            this.autoDismissTimer.remove();
            this.autoDismissTimer = null;
        }
    }
    
    /**
     * Queue a tutorial to be shown (shows immediately if not visible)
     */
    queueTutorial(tutorial) {
        if (!this.isVisible) {
            // Show immediately if not currently visible
            this.show(tutorial);
        } else {
            // Add to queue to be shown later
            this.announcementQueue.push(tutorial);
        }
    }
    
    /**
     * Dismiss the current tutorial and show next if queued
     */
    dismiss() {
        if (this.autoDismissTimer) {
            this.autoDismissTimer.remove();
            this.autoDismissTimer = null;
        }
        
        this.scene.events.emit('tutorialDismissed', this.currentTutorial);
        
        // Animate out
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            duration: this.FADE_DURATION,
            ease: 'Power2',
            onComplete: () => {
                this.hide();
                // Check for queued tutorials
                this.scene.events.emit('checkNextTutorial');
            }
        });
    }
    
    /**
     * Quick info popup for minor notifications (not full tutorial)
     */
    showQuickNotification(text, duration = 3000) {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const cx = width / 2;
        
        // Create temporary notification
        const notification = this.scene.add.container(0, 0);
        notification.setDepth(999);
        notification.setScrollFactor(0);
        
        const bg = this.scene.add.rectangle(cx, height - 100, 400, 40, 0x1a1a25, 0.95);
        bg.setStrokeStyle(1, 0x3a3a45);
        notification.add(bg);
        
        const textObj = this.scene.add.text(cx, height - 100, text, {
            fontFamily: 'monospace',
            fontSize: '13px',
            letterSpacing: 1,
            fill: '#00f0ff'
        }).setOrigin(0.5);
        notification.add(textObj);
        
        notification.setAlpha(0);
        
        // Animate in and out
        this.scene.tweens.add({
            targets: notification,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        this.scene.time.delayedCall(duration, () => {
            this.scene.tweens.add({
                targets: notification,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => notification.destroy()
            });
        });
    }
    
    /**
     * Check if overlay is currently visible
     */
    getIsVisible() {
        return this.isVisible;
    }
    
    /**
     * Get queue length (for testing)
     */
    getQueueLength() {
        // Return queue length if using queue, otherwise 0
        return this.announcementQueue ? this.announcementQueue.length : 0;
    }
    
    /**
     * Clear announcement queue
     */
    clearQueue() {
        if (this.announcementQueue) {
            this.announcementQueue.length = 0;
        }
    }
    
    /**
     * Get next announcement without removing it
     */
    getNextAnnouncement() {
        if (this.announcementQueue && this.announcementQueue.length > 0) {
            return this.announcementQueue[0];
        }
        return null;
    }
    
    /**
     * Show summary of unlocked systems (end-of-wave summary)
     */
    showSummary(unlockedSystems, stats) {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const cx = width / 2;
        const cy = height / 2;
        
        // Create summary container
        const container = this.scene.add.container(0, 0);
        container.setDepth(999);
        container.setScrollFactor(0);
        
        // Background
        const bg = this.scene.add.rectangle(cx, cy, 400, 200, 0x1a1a25, 0.95);
        bg.setStrokeStyle(2, 0x3a3a45);
        container.add(bg);
        
        // Title
        const title = this.scene.add.text(cx, cy - 70, 'SYSTEMS UNLOCKED', {
            fontFamily: 'monospace',
            fontSize: '20px',
            letterSpacing: 2,
            fill: '#00f0ff'
        }).setOrigin(0.5);
        container.add(title);
        
        // System list
        let yPos = cy - 30;
        for (const system of unlockedSystems) {
            const text = this.scene.add.text(cx, yPos, `◆ ${system.name.toUpperCase()}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#' + (system.color || 0xffffff).toString(16).padStart(6, '0')
            }).setOrigin(0.5);
            container.add(text);
            yPos += 25;
        }
        
        // Stats
        const statsText = this.scene.add.text(cx, cy + 60, 
            `${stats.total} / ${stats.max} SYSTEMS`, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(0.5);
        container.add(statsText);
        
        // Auto dismiss after 5 seconds
        this.scene.time.delayedCall(5000, () => {
            this.scene.tweens.add({
                targets: container,
                alpha: 0,
                duration: 300,
                onComplete: () => container.destroy()
            });
        });
        
        return container;
    }
    
    /**
     * Destroy the overlay and clean up
     */
    destroy() {
        if (this.autoDismissTimer) {
            this.autoDismissTimer.remove();
            this.autoDismissTimer = null;
        }
        
        // Remove keyboard event handlers (use input.off as expected by tests)
        if (this.keyHandlers) {
            for (const { key } of this.keyHandlers) {
                this.scene.input.off(key);
            }
            this.keyHandlers = [];
        }
        
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }
}
