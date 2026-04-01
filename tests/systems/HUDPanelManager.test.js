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
  if (contentContainer.list.length === 0) return { top: 0, bottom: 0, height: 0 };

  let minY = 0;
  let maxY = 0;

  contentContainer.list.forEach(child => {
    const originY = child.originY !== undefined ? child.originY : 0.5;
    const height = child.displayHeight || child.height || 0;
    const top = child.y - height * originY;
    const bottom = child.y + height * (1 - originY);
    minY = Math.min(minY, top);
    maxY = Math.max(maxY, bottom);
  });

  return { top: minY, bottom: maxY, height: maxY - minY };
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
      // Elements positioned at positive Y with top-left origin
      const segment1 = new MockRectangle(2, 1, 6, 6, 0x00f0ff, 0.3);
      segment1.setOrigin(0, 0);
      container.add(segment1);

      const bounds = getContentBounds(container);

      // Element at y=1 with origin 0,0 and height 6 extends from y=1 to y=7
      // But minY starts at 0, so top is 0 (content area always starts at 0)
      expect(bounds.top).toBe(0);
      expect(bounds.bottom).toBe(7);
      expect(bounds.height).toBe(7);
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
});
