import Phaser from 'phaser';

/**
 * LevelStartDialog
 *
 * Displays a modal dialog at the start of each level introducing:
 * - Level number and name
 * - Any new system being introduced (for levels 2+)
 * - Brief description and gameplay hint
 * - Visual presentation with tier-based color coding
 *
 * The dialog pauses the game while displayed and auto-dismisses after
 * a set time or when the player clicks/presses a key.
 */
export default class LevelStartDialog {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.isVisible = false;

    // Tier color mapping (matches LevelSystemUnlockConfig)
    this.TIER_COLORS = {
      core: 0x00f0ff,          // Cyan
      foundation: 0x4ecdc4,    // Teal
      adaptive: 0xffe66d,      // Yellow
      strategic: 0xff6b6b,     // Red
      meta: 0x9d4edd,          // Purple
      transcendent: 0xffd700   // Gold
    };

    // UI constants
    this.WIDTH = 600;
    this.HEIGHT = 400;
    this.AUTO_DISMISS_DELAY = 8000; // 8 seconds
  }

  /**
   * Show the level start dialog.
   * @param {object} options
   * @param {number} options.level - Level number
   * @param {string} options.name - Level name
   * @param {string} options.tier - System tier (for color coding)
   * @param {string|null} options.systemName - Name of system being introduced (null for level 1)
   * @param {string|null} options.description - System description
   * @param {string|null} options.hint - Gameplay hint
   * @param {number|null} options.color - Accent color
   * @param {function} options.onDismiss - Callback when dialog is dismissed
   */
  show(options) {
    // Dismiss any existing dialog
    this.dismiss();

    const {
      level,
      name,
      tier = 'core',
      systemName = null,
      description = null,
      hint = null,
      color = null,
      onDismiss = null
    } = options;

    this.onDismissCallback = onDismiss;
    this.isVisible = true;

    // Determine accent color
    const accentColor = color || this.TIER_COLORS[tier] || 0xffffff;

    // Create container centered on screen
    const screenWidth = this.scene.scale.width;
    const screenHeight = this.scene.scale.height;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    this.container = this.scene.add.container(centerX, centerY);
    this.container.setDepth(10000); // Above everything
    this.container.setScrollFactor(0); // Fixed to camera

    // Background panel
    const bg = this.scene.add.rectangle(0, 0, this.WIDTH, this.HEIGHT, 0x0a0a0f, 0.95);
    bg.setStrokeStyle(2, accentColor, 1);
    this.container.add(bg);

    // Top accent bar
    const accentBar = this.scene.add.rectangle(0, -this.HEIGHT / 2 + 4, this.WIDTH - 4, 4, accentColor, 1);
    this.container.add(accentBar);

    // Level indicator
    const levelText = this.scene.add.text(0, -this.HEIGHT / 2 + 40, `LEVEL ${level}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      letterSpacing: 4,
      fill: '#888888'
    }).setOrigin(0.5);
    this.container.add(levelText);

    // Level name
    const nameText = this.scene.add.text(0, -this.HEIGHT / 2 + 80, name.toUpperCase(), {
      fontFamily: 'monospace',
      fontSize: '32px',
      fontStyle: 'bold',
      letterSpacing: 2,
      fill: '#ffffff'
    }).setOrigin(0.5);
    this.container.add(nameText);

    // Divider line
    const divider = this.scene.add.rectangle(0, -this.HEIGHT / 2 + 115, this.WIDTH - 100, 1, 0x333333, 1);
    this.container.add(divider);

    let yOffset = -this.HEIGHT / 2 + 150;

    // System introduction section (for levels 2+)
    if (systemName) {
      // "New System Unlocked" label
      const newSystemLabel = this.scene.add.text(0, yOffset, '◆ NEW SYSTEM UNLOCKED ◆', {
        fontFamily: 'monospace',
        fontSize: '14px',
        letterSpacing: 2,
        fill: Phaser.Display.Color.IntegerToColor(accentColor).color
      }).setOrigin(0.5);
      this.container.add(newSystemLabel);
      yOffset += 40;

      // System name
      const systemText = this.scene.add.text(0, yOffset, systemName.toUpperCase(), {
        fontFamily: 'monospace',
        fontSize: '24px',
        fontStyle: 'bold',
        letterSpacing: 1,
        fill: '#ffffff'
      }).setOrigin(0.5);
      this.container.add(systemText);
      yOffset += 50;

      // Description
      if (description) {
        const descText = this.scene.add.text(0, yOffset, this.wrapText(description, 50), {
          fontFamily: 'monospace',
          fontSize: '14px',
          fill: '#cccccc',
          align: 'center',
          lineSpacing: 6
        }).setOrigin(0.5);
        this.container.add(descText);
        yOffset += descText.height + 30;
      }

      // Hint box
      if (hint) {
        const hintBg = this.scene.add.rectangle(0, yOffset + 10, this.WIDTH - 80, 50, 0x1a1a25, 0.8);
        hintBg.setStrokeStyle(1, accentColor, 0.5);
        this.container.add(hintBg);

        const hintText = this.scene.add.text(0, yOffset + 10, `💡 ${hint}`, {
          fontFamily: 'monospace',
          fontSize: '12px',
          fill: '#aaaaaa',
          align: 'center'
        }).setOrigin(0.5);
        this.container.add(hintText);
        yOffset += 70;
      }
    } else {
      // Level 1 - Pure gameplay message
      const pureText = this.scene.add.text(0, yOffset, 'PURE GAMEPLAY', {
        fontFamily: 'monospace',
        fontSize: '20px',
        letterSpacing: 3,
        fill: '#ffffff'
      }).setOrigin(0.5);
      this.container.add(pureText);
      yOffset += 40;

      const descText = this.scene.add.text(0, yOffset, this.wrapText('No systems. No tricks. Just you, the void, and the endless waves. Master the fundamentals before the void reveals its secrets.', 50), {
        fontFamily: 'monospace',
        fontSize: '14px',
        fill: '#cccccc',
        align: 'center',
        lineSpacing: 6
      }).setOrigin(0.5);
      this.container.add(descText);
      yOffset += descText.height + 40;
    }

    // Continue prompt
    this.continueText = this.scene.add.text(0, this.HEIGHT / 2 - 40, '[ CLICK OR PRESS SPACE TO CONTINUE ]', {
      fontFamily: 'monospace',
      fontSize: '14px',
      letterSpacing: 2,
      fill: '#666666'
    }).setOrigin(0.5);
    this.container.add(this.continueText);

    // Pulse animation for continue text
    this.scene.tweens.add({
      targets: this.continueText,
      alpha: { from: 0.3, to: 1 },
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Entrance animation
    this.container.setScale(0.8);
    this.container.setAlpha(0);

    this.scene.tweens.add({
      targets: this.container,
      scale: 1,
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Setup input handlers
    this.setupInputHandlers();

    // Auto-dismiss timer - use setTimeout instead of Phaser time
    // because Phaser time is paused while dialog is shown
    this.autoDismissTimer = setTimeout(() => {
      this.dismiss();
    }, this.AUTO_DISMISS_DELAY);

    // Emit event for pause handling
    this.scene.events.emit('levelDialogShown', { level, systemName });

    console.log(`[LevelStartDialog] Showing level ${level}: ${name}`);
  }

  /**
   * Setup input handlers for dismissing the dialog.
   */
  setupInputHandlers() {
    // Click/tap to dismiss
    this.clickHandler = () => {
      this.dismiss();
    };
    this.scene.input.on('pointerdown', this.clickHandler);

    // Space key to dismiss
    // Create a dedicated space key listener (more reliable than global keydown)
    this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spaceKey.on('down', () => this.dismiss());
  }

  /**
   * Dismiss the dialog.
   */
  dismiss() {
    if (!this.isVisible || !this.container) {
      return;
    }

    this.isVisible = false;

    // Clear auto-dismiss timer (setTimeout)
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
      this.autoDismissTimer = null;
    }

    // Remove input handlers
    this.scene.input.off('pointerdown', this.clickHandler);
    if (this.spaceKey) {
      this.spaceKey.destroy();
      this.spaceKey = null;
    }

    // IMPORTANT: Resume the game BEFORE starting dismiss animation
    // because tweens and time are paused while game is paused
    this.scene.events.emit('levelDialogDismissed');

    // Call callback immediately (resumes the game)
    if (this.onDismissCallback) {
      this.onDismissCallback();
      this.onDismissCallback = null;
    }

    // Exit animation (now runs after game is resumed)
    this.scene.tweens.add({
      targets: this.container,
      scale: 0.9,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        if (this.container) {
          this.container.destroy();
          this.container = null;
        }
      }
    });
  }

  /**
   * Check if dialog is currently visible.
   * @returns {boolean}
   */
  isShowing() {
    return this.isVisible;
  }

  /**
   * Wrap text to fit within a character limit.
   * @param {string} text - Text to wrap
   * @param {number} maxChars - Maximum characters per line
   * @returns {string} Wrapped text
   */
  wrapText(text, maxChars) {
    if (!text) return '';

    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > maxChars) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    lines.push(currentLine.trim());

    return lines.join('\n');
  }

  /**
   * Destroy and cleanup.
   */
  destroy() {
    this.dismiss();
  }
}
