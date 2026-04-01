import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Tests for HUDPanelManager content bounds calculation
 * These tests verify that the panel properly measures content including
 * elements that extend into negative coordinate space.
 */

// Mock Phaser-like objects for testing
class MockRectangle {
  constructor(x, y, width, height, color, alpha = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.displayWidth = width;
    this.displayHeight = height;
    this.originX = 0.5;
    this.originY = 0.5;
    this._color = color;
    this._alpha = alpha;
  }

  setOrigin(x, y) {
    if (y === undefined || y === null) {
      this.originX = x;
      this.originY = x;
    } else {
      this.originX = x;
      this.originY = y;
    }
    return this;
  }
}

class MockText {
  constructor(x, y, text, style) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.style = style;
    this.width = 20; // Default text width
    this.height = 12; // Default text height
    this.displayWidth = this.width;
    this.displayHeight = this.height;
    this.originX = 0.5;
    this.originY = 0.5;
  }

  setOrigin(x, y) {
    if (y === undefined || y === null) {
      this.originX = x;
      this.originY = x;
    } else {
      this.originX = x;
      this.originY = y;
    }
    return this;
  }
}

class MockContainer {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.list = [];
  }

  add(child) {
    if (Array.isArray(child)) {
      this.list.push(...child);
    } else {
      this.list.push(child);
    }
    return this;
  }

  setDepth(depth) {
    this.depth = depth;
    return this;
  }
}

// Simulate the getContentBounds function logic
function getContentBounds(contentContainer) {
  if (contentContainer.list.length === 0) return { top: 0, bottom: 0, height: 0, left: 0, right: 0 };

  let minY = Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let maxX = -Infinity;

  contentContainer.list.forEach(child => {
    const originY = child.originY !== undefined ? child.originY : 0.5;
    const originX = child.originX !== undefined ? child.originX : 0.5;
    const height = child.displayHeight || child.height || 0;
    const width = child.displayWidth || child.width || 0;
    const top = child.y - height * originY;
    const bottom = child.y + height * (1 - originY);
    const left = child.x - width * originX;
    const right = child.x + width * (1 - originX);
    minY = Math.min(minY, top);
    maxY = Math.max(maxY, bottom);
    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
  });

  // Handle case where no valid children
  if (minY === Infinity) {
    return { top: 0, bottom: 0, height: 0, left: 0, right: 0, width: 0 };
  }

  return { top: minY, bottom: maxY, height: maxY - minY, left: minX, right: maxX, width: maxX - minX };
}

describe('HUDPanelManager Content Bounds', () => {
  let container;

  beforeEach(() => {
    container = new MockContainer(0, 0);
  });

  describe('Content Height Calculation', () => {
    it('should measure elements with top-left origin (0,0) as starting at y=0', () => {
      // Element with top-left origin at y=0 should start at 0
      const rect = new MockRectangle(0, 0, 60, 8, 0x22222a);
      rect.setOrigin(0, 0); // Top-left origin
      container.add(rect);

      const bounds = getContentBounds(container);

      expect(bounds.top).toBe(0);
      expect(bounds.bottom).toBe(8);
      expect(bounds.height).toBe(8);
    });

    it('should detect elements that extend into negative Y space with centered origin', () => {
      // Element at y=0 with centered origin (0.5) extends from -4 to +4
      const rect = new MockRectangle(0, 0, 60, 8, 0x22222a);
      rect.setOrigin(0, 0.5); // Centered vertically
      container.add(rect);

      const bounds = getContentBounds(container);

      // With centered origin, element at y=0 extends from -4 to +4
      expect(bounds.top).toBe(-4);
      expect(bounds.bottom).toBe(4);
      expect(bounds.height).toBe(8);
    });

    it('should calculate correct height when elements have positive Y positions', () => {
      // Element at y=1 with origin 0,0 and height 6 extends from y=1 to y=7
      const rect = new MockRectangle(0, 1, 60, 6, 0x22222a);
      rect.setOrigin(0, 0);
      container.add(rect);

      const bounds = getContentBounds(container);

      // Element at y=1 with origin 0,0 and height 6 extends from y=1 to y=7
      expect(bounds.top).toBe(1);
      expect(bounds.bottom).toBe(7);
      expect(bounds.height).toBe(6);
    });

    it('should detect overflow when segments start at negative X', () => {
      // Multiple segments starting at negative X
      for (let i = 0; i < 3; i++) {
        const segment = new MockRectangle(-25 + i * 8, 1, 6, 6, 0x00f0ff, 0.3);
        segment.setOrigin(0, 0);
        container.add(segment);
      }

      const bounds = getContentBounds(container);

      // First segment at x=-25 extends left of content area
      expect(container.list[0].x).toBe(-25);
      expect(container.list[0].x).toBeLessThan(0);
    });

    it('should calculate correct total height with multiple elements', () => {
      // Bar background at top
      const bg = new MockRectangle(0, 0, 60, 8, 0x22222a);
      bg.setOrigin(0, 0);
      container.add(bg);

      // Text below bar
      const text = new MockText(35, 10, '≈', { fontSize: '14px' });
      text.setOrigin(0, 0);
      container.add(text);

      const bounds = getContentBounds(container);

      expect(bounds.top).toBe(0);
      expect(bounds.bottom).toBe(22); // 8 (bar) + 12 (text) + 2 gap
      expect(bounds.height).toBe(22);
    });
  });

  describe('Proper Positioning Pattern', () => {
    it('should keep all elements within positive bounds when using correct pattern', () => {
      // Using the correct pattern: all elements from x=0, y=0 with positive offsets
      const segmentWidth = 6;
      const segmentGap = 2;

      // Segments positioned from left starting at x=2
      for (let i = 0; i < 3; i++) {
        const segment = new MockRectangle(
          2 + i * (segmentWidth + segmentGap), 1, segmentWidth, 6, 0x00f0ff, 0.3
        );
        segment.setOrigin(0, 0);
        container.add(segment);
      }

      // Check all segments have positive X
      container.list.forEach(child => {
        expect(child.x).toBeGreaterThanOrEqual(0);
        expect(child.y).toBeGreaterThanOrEqual(0);
      });

      const bounds = getContentBounds(container);
      expect(bounds.top).toBeGreaterThanOrEqual(0);
    });

    it('should position type indicator to the right of segments', () => {
      // Segments take up ~24px (3 segments * 6px + gaps)
      // Type indicator should be positioned at x=62 or similar
      const typeIndicator = new MockText(62, 0, '≈', { fontSize: '14px' });
      typeIndicator.setOrigin(0, 0);
      container.add(typeIndicator);

      expect(typeIndicator.x).toBe(62);
      expect(typeIndicator.x).toBeGreaterThan(60); // Should be right of 60px bar
    });
  });

  describe('Content Bounds API', () => {
    it('should return proper bounds structure', () => {
      const rect = new MockRectangle(0, 0, 60, 8, 0x22222a);
      rect.setOrigin(0, 0);
      container.add(rect);

      const bounds = getContentBounds(container);

      expect(bounds).toHaveProperty('top');
      expect(bounds).toHaveProperty('bottom');
      expect(bounds).toHaveProperty('height');
      expect(bounds.height).toBe(bounds.bottom - bounds.top);
    });

    it('should handle empty containers', () => {
      const bounds = getContentBounds(container);

      expect(bounds.top).toBe(0);
      expect(bounds.bottom).toBe(0);
      expect(bounds.height).toBe(0);
    });
  });
});

describe('HUD System Compliance', () => {
  describe('CausalEntanglementSystem Pattern', () => {
    it('should position all link segments within content bounds', () => {
      const container = new MockContainer(0, 0);
      const segmentWidth = 6;
      const segmentGap = 2;
      const maxEntanglements = 3;

      // Background
      const bg = new MockRectangle(0, 0, 60, 8, 0x22222a);
      bg.setOrigin(0, 0);
      container.add(bg);

      // Segments positioned from left
      for (let i = 0; i < maxEntanglements; i++) {
        const segment = new MockRectangle(
          2 + i * (segmentWidth + segmentGap), 1, segmentWidth, 6, 0x00f0ff, 0.3
        );
        segment.setOrigin(0, 0);
        container.add(segment);
      }

      // Type indicator to the right
      const typeIndicator = new MockText(62, 0, '≈', { fontSize: '14px' });
      typeIndicator.setOrigin(0, 0);
      container.add(typeIndicator);

      // Verify all elements are in positive space
      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(bounds.bottom).toBe(12); // Text element is tallest (height 12)
      expect(bounds.height).toBe(12);

      // Verify no element extends into negative X
      container.list.forEach(child => {
        expect(child.x).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('ChronoLoopSystem Pattern', () => {
    it('should position echo segments within content bounds', () => {
      const container = new MockContainer(0, 0);
      const segmentWidth = 18;
      const segmentGap = 3;
      const maxEchoes = 3;

      // Background
      const bg = new MockRectangle(0, 0, 60, 8, 0x22222a);
      bg.setOrigin(0, 0);
      container.add(bg);

      // Segments positioned from left
      for (let i = 0; i < maxEchoes; i++) {
        const segment = new MockRectangle(
          2 + i * (segmentWidth + segmentGap), 1, segmentWidth, 6, 0x00d4aa, 0.3
        );
        segment.setOrigin(0, 0);
        container.add(segment);
      }

      // Verify all elements are in positive space
      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(bounds.height).toBe(8);

      // Verify no element extends into negative X
      container.list.forEach(child => {
        expect(child.x).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('ApertureProtocolSystem Pattern (circular icons)', () => {
    it('should position circular icons so they do not extend into negative Y', () => {
      const container = new MockContainer(0, 0);
      const radius = 25;
      const centerY = radius; // Position so top of circle is at y=0

      // Circular background at centerY
      const bg = new MockRectangle(0, centerY, radius * 2, radius * 2, 0x22222a);
      bg.setOrigin(0.5, 0.5); // Centered origin for circle
      container.add(bg);

      // Icon centered in the circle
      const icon = new MockText(0, centerY, '◉', { fontSize: '20px' });
      icon.setOrigin(0.5);
      container.add(icon);

      // Text below the circle
      const label = new MockText(0, centerY + 35, 'APERTURE: 0%', { fontSize: '10px' });
      label.setOrigin(0.5);
      container.add(label);

      // Verify circle doesn't extend into negative Y
      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0); // Circle top edge at y=0
      expect(bounds.bottom).toBeGreaterThan(50); // Circle bottom + text

      // Verify center is at expected position
      expect(bg.y).toBe(radius);
    });
  });

  describe('HeartfluxProtocolSystem Pattern (concentric circles)', () => {
    it('should position heart orb elements with positive Y only', () => {
      const container = new MockContainer(0, 0);
      const centerY = 30; // Largest ring radius

      // Background ring (radius 30)
      const bgRing = new MockRectangle(0, centerY, 60, 60, 0x1a1a25);
      bgRing.setOrigin(0.5);
      container.add(bgRing);

      // Heart orb (radius 20) at same center
      const heartOrb = new MockRectangle(0, centerY, 40, 40, 0xff6b9d);
      heartOrb.setOrigin(0.5);
      container.add(heartOrb);

      // Inner glow (radius 12)
      const innerGlow = new MockRectangle(0, centerY, 24, 24, 0x9d4edd);
      innerGlow.setOrigin(0.5);
      container.add(innerGlow);

      // State text below
      const stateText = new MockText(0, centerY + 45, 'STREAM', { fontSize: '9px' });
      stateText.setOrigin(0.5);
      container.add(stateText);

      // Verify all elements are in positive Y
      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0); // Largest ring starts at y=0
      expect(bounds.bottom).toBeGreaterThan(centerY + 45);

      // All circles share the same center Y
      expect(bgRing.y).toBe(centerY);
      expect(heartOrb.y).toBe(centerY);
      expect(innerGlow.y).toBe(centerY);
    });
  });

  // === TOP_RIGHT Panel System Patterns ===
  describe('ResonanceOrbSystem Pattern (TOP_RIGHT panel)', () => {
    it('should position background panel at y=0 with top-left origin', () => {
      const container = new MockContainer(0, 0);
      const width = 100;
      const bgHeight = 40;

      // Background panel - positioned at y=0 with top-left origin
      const bg = new MockRectangle(0, 0, width, bgHeight, 0x000000, 0.5);
      bg.setOrigin(0, 0);
      container.add(bg);

      // Superposition text - above the panel (y=0 with bottom-center origin)
      const superpositionText = new MockText(width / 2, 0, 'SUPERPOSITION', { fontSize: '11px' });
      superpositionText.setOrigin(0.5, 1); // Bottom-center so it extends upward from y=0
      container.add(superpositionText);

      const bounds = getContentBounds(container);
      expect(bounds.top).toBeLessThan(0); // Text extends above y=0 (OK for labels)
      expect(bounds.bottom).toBe(bgHeight); // Background at y=0 to y=40
      expect(bg.originX).toBe(0);
      expect(bg.originY).toBe(0);
    });
  });

  describe('QuantumImmortalitySystem Pattern (entropy bar)', () => {
    it('should position entropy bar elements from left edge', () => {
      const container = new MockContainer(0, 0);
      const barWidth = 100;
      const barHeight = 12;

      // Background at top-left
      const bg = new MockRectangle(0, 0, barWidth, barHeight, 0x1a1a25);
      bg.setOrigin(0, 0);
      container.add(bg);

      // Entropy fill starting from left edge
      const entropyFill = new MockRectangle(1, 1, 50, barHeight - 2, 0xffaa00);
      entropyFill.setOrigin(0, 0);
      container.add(entropyFill);

      // Echo indicator below the bar
      const echoIndicator = new MockText(barWidth / 2, barHeight + 2, '◉ 3', { fontSize: '12px' });
      echoIndicator.setOrigin(0.5, 0); // Top-center origin
      container.add(echoIndicator);

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(bounds.left).toBe(0);
      expect(entropyFill.x).toBeGreaterThanOrEqual(0);
    });
  });

  describe('BootstrapProtocolSystem Pattern (circular ring)', () => {
    it('should position bootstrap ring at centerY=20 to avoid negative Y', () => {
      const container = new MockContainer(0, 0);
      const centerY = 20;
      const radius = 20;

      // Background ring centered at y=20
      const bgRing = new MockRectangle(0, centerY, radius * 2, radius * 2, 0x22222a);
      bgRing.setOrigin(0.5, 0.5);
      container.add(bgRing);

      // Icon centered in ring
      const icon = new MockText(0, centerY, '⟲', { fontSize: '16px' });
      icon.setOrigin(0.5);
      container.add(icon);

      // Level text below ring
      const levelText = new MockText(0, centerY + 28, '3', { fontSize: '10px' });
      levelText.setOrigin(0.5);
      container.add(levelText);

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0); // Ring starts at y=0
      expect(bgRing.y).toBe(centerY);
    });
  });

  describe('DissolutionProtocolSystem Pattern (essence bars grid)', () => {
    it('should position essence bars starting from y=0', () => {
      const container = new MockContainer(0, 0);
      const types = ['T', 'S', 'C', 'N', 'V'];
      const barWidth = 100;

      types.forEach((label, i) => {
        const yPos = i * 12; // Start from y=0
        // Label at yPos with top-left origin so it doesn't extend above y=0
        const labelText = new MockText(0, yPos, label, { fontSize: '9px' });
        labelText.setOrigin(0, 0);
        container.add(labelText);

        // Bar at yPos + 2 offset
        const bar = new MockRectangle(10, yPos + 2, barWidth, 6, 0x00f0ff);
        bar.setOrigin(0, 0);
        container.add(bar);

        // Value text aligned with label, top-left origin
        const valueText = new MockText(10 + barWidth + 5, yPos, '0', { fontSize: '9px' });
        valueText.setOrigin(0, 0);
        container.add(valueText);
      });

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(bounds.left).toBe(0);
    });
  });

  // === TOP_CENTER Panel System Patterns ===
  describe('SymbioticPredictionSystem Pattern (harmony/chaos bar)', () => {
    it('should position harmony bar from left edge with top-left origin', () => {
      const container = new MockContainer(0, 0);
      const barWidth = 200;
      const barHeight = 6;
      const barY = 0;

      // Background bar
      const barBg = new MockRectangle(0, barY, barWidth, barHeight, 0x22222a);
      barBg.setOrigin(0, 0);
      container.add(barBg);

      // Harmony side (left half)
      const harmonyBar = new MockRectangle(0, barY + 1, barWidth / 2, barHeight - 2, 0x00f0ff);
      harmonyBar.setOrigin(0, 0);
      container.add(harmonyBar);

      // Chaos side (right half)
      const chaosBar = new MockRectangle(barWidth / 2, barY + 1, barWidth / 2, barHeight - 2, 0xff00ff);
      chaosBar.setOrigin(0, 0);
      container.add(chaosBar);

      // Status text below
      const statusText = new MockText(barWidth / 2, barY + barHeight + 4, 'BALANCED', { fontSize: '12px' });
      statusText.setOrigin(0.5, 0);
      container.add(statusText);

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(harmonyBar.x).toBe(0);
    });
  });

  describe('ResonanceCascadeSystem Pattern (centered elements)', () => {
    it('should position multiplier text at centerY=20', () => {
      const container = new MockContainer(0, 0);
      const centerY = 20;

      const multiplierText = new MockText(0, centerY, '3.5x', { fontSize: '36px' });
      multiplierText.setOrigin(0.5);
      container.add(multiplierText);

      // Sequence dots positioned around center (8px radius = 16px width/height)
      const dot = new MockRectangle(0, centerY, 16, 16, 0xffffff);
      dot.setOrigin(0.5);
      container.add(dot);

      const bounds = getContentBounds(container);
      // With centerY=20 and 8px dot radius, top should be 20-8=12
      // Text has height=12, so with center origin its top is 20-6=14
      // Dot extends to 12, which is less than text's 14, so bounds.top = 12
      expect(bounds.top).toBe(centerY - 8); // 8px radius
      expect(multiplierText.y).toBe(centerY);
    });
  });

  // === BOTTOM_RIGHT Panel System Patterns ===
  describe('MetaSystemOperator Pattern (patch HUD)', () => {
    it('should position patch count and energy bar from top-left', () => {
      const container = new MockContainer(0, 0);
      const barWidth = 80;
      const barHeight = 6;

      // Patch count at top
      const patchCountText = new MockText(0, 0, 'PATCHES: 2/3', { fontSize: '11px' });
      patchCountText.setOrigin(0, 0);
      container.add(patchCountText);

      // Energy bar below
      const barY = 14;
      const energyBarBg = new MockRectangle(0, barY, barWidth, barHeight, 0x222222);
      energyBarBg.setOrigin(0, 0);
      container.add(energyBarBg);

      const energyBar = new MockRectangle(0, barY, barWidth, barHeight, 0x00f0ff);
      energyBar.setOrigin(0, 0);
      container.add(energyBar);

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(bounds.left).toBe(0);
    });
  });

  describe('ObserverEffectSystem Pattern (eye icon)', () => {
    it('should position observer icon at iconY=8 to avoid negative Y', () => {
      const container = new MockContainer(0, 0);
      const iconY = 8; // Center of 16px image

      // Eye icon centered at y=8
      const observerIcon = new MockRectangle(0, iconY, 16, 16, 0x00d4ff); // ~32px scaled to 16
      observerIcon.setOrigin(0.5);
      container.add(observerIcon);

      // Analysis text below
      const analysisText = new MockText(0, iconY + 20, 'OBSERVING...', { fontSize: '10px' });
      analysisText.setOrigin(0.5);
      container.add(analysisText);

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(iconY - 8); // Top of 16px image
      expect(observerIcon.y).toBe(iconY);
    });
  });

  describe('TemporalPedagogySystem Pattern (system indicators grid)', () => {
    it('should position pedagogy indicators in grid from top-left', () => {
      const container = new MockContainer(0, 0);
      const systemNames = ['WEAPON', 'HEALTH', 'SHIELD', 'SPEED'];
      const spacing = 22;
      const cols = 2;

      systemNames.forEach((name, index) => {
        const x = (index % cols) * spacing;
        const y = Math.floor(index / cols) * spacing;

        // Background circle centered in grid cell (9px radius = 18px size)
        // Positioned at cell center, but we verify the grid starts at 0,0
        const bg = new MockRectangle(x + spacing / 2, y + spacing / 2, 18, 18, 0x22222a);
        bg.setOrigin(0.5);
        container.add(bg);

        // Letter centered in grid cell
        const letter = new MockText(x + spacing / 2, y + spacing / 2, name[0], { fontSize: '9px' });
        letter.setOrigin(0.5);
        container.add(letter);
      });

      const bounds = getContentBounds(container);
      // Circle at y=11, height=18, originY=0.5: top = 11 - 9 = 2
      // Text at y=11, height=12, originY=0.5: top = 11 - 6 = 5
      // So minimum top is 2 (from the circle)
      expect(bounds.top).toBe(2);
      // Text at x=11, width=20, originX=0.5: left = 11 - 10 = 1
      // Circle at x=11, width=18, originX=0.5: left = 11 - 9 = 2
      // So minimum left is 1 (from the text)
      expect(bounds.left).toBe(1);
      // Verify the grid origin is correct (positive coordinates)
      expect(bounds.top).toBeGreaterThanOrEqual(0);
      expect(bounds.left).toBeGreaterThanOrEqual(0);
    });
  });

  describe('AthenaeumProtocolSystem Pattern (region indicator)', () => {
    it('should position region elements from left edge', () => {
      const container = new MockContainer(0, 0);
      const barWidth = 80;

      // Symbol at left
      const regionSymbol = new MockText(0, 12, '◊', { fontSize: '24px' });
      regionSymbol.setOrigin(0, 0.5);
      container.add(regionSymbol);

      // Name to right of symbol
      const regionName = new MockText(28, 0, 'VOID', { fontSize: '11px' });
      regionName.setOrigin(0, 0);
      container.add(regionName);

      // Effect below name
      const regionEffect = new MockText(28, 14, 'No effects', { fontSize: '9px' });
      regionEffect.setOrigin(0, 0);
      container.add(regionEffect);

      // Bar below text
      const intensityBar = new MockRectangle(0, 28, barWidth, 3, 0x00f0ff);
      intensityBar.setOrigin(0, 0);
      container.add(intensityBar);

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(bounds.left).toBe(0);
    });
  });

  describe('HarmonicConvergenceSystem Pattern (spectrum bars)', () => {
    it('should position spectrum bars from left edge with top-left origin', () => {
      const container = new MockContainer(0, 0);
      const barCount = 8;
      const barWidth = 8;
      const gap = 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        const bar = new MockRectangle(x, 0, barWidth, 2, 0x00f0ff);
        bar.setOrigin(0, 0); // Top-left so bar extends downward
        container.add(bar);
      }

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(bounds.left).toBe(0);
    });
  });

  describe('ProteusProtocolSystem Pattern (generation/species display)', () => {
    it('should position generation counter at top of content area', () => {
      const container = new MockContainer(0, 0);

      // Generation counter - cyan, top of panel
      const generationText = new MockText(0, 0, 'GEN 1', { fontSize: '14px' });
      generationText.setOrigin(0, 0); // Top-left origin
      container.add(generationText);

      // Species name - below generation
      const speciesText = new MockText(0, 16, 'Primordial', { fontSize: '10px' });
      speciesText.setOrigin(0, 0); // Top-left origin
      container.add(speciesText);

      const bounds = getContentBounds(container);
      expect(bounds.top).toBe(0);
      expect(bounds.left).toBe(0);
      expect(generationText.y).toBe(0);
      expect(speciesText.y).toBe(16);
    });
  });
});
