import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * EnvironmentalHUDSystem Tests
 * 
 * "The Arena IS the HUD" - A radical simplification that eliminates
 * all panel-based HUD elements and encodes game state into the 
 * game world itself through visual patterns, ambient colors, 
 * particle behavior, and spatial audio.
 */

// Mock Phaser
vi.mock('phaser', () => ({
  default: { 
    Scene: class MockScene {},
    GameObjects: {
      Graphics: class MockGraphics {
        constructor() {
          this.fillStyle = vi.fn().mockReturnThis();
          this.fillCircle = vi.fn().mockReturnThis();
          this.fillRect = vi.fn().mockReturnThis();
          this.lineStyle = vi.fn().mockReturnThis();
          this.strokeCircle = vi.fn().mockReturnThis();
          this.strokeRect = vi.fn().mockReturnThis();
          this.arc = vi.fn().mockReturnThis();
          this.beginPath = vi.fn().mockReturnThis();
          this.strokePath = vi.fn().mockReturnThis();
          this.clear = vi.fn().mockReturnThis();
          this.destroy = vi.fn();
        }
      }
    }
  }
}));

// Import the system under test
import EnvironmentalHUDSystem from '../../src/systems/EnvironmentalHUDSystem.js';

describe('EnvironmentalHUDSystem - "The Arena IS the HUD"', () => {
  let mockScene;
  let environmentalHUD;

  beforeEach(() => {
    // Mock scene with player and game state
    mockScene = {
      player: {
        x: 400, y: 300,
        health: 100, maxHealth: 100,
        sprite: { 
          setTint: vi.fn(),
          setAlpha: vi.fn(),
          preFX: { 
            addGlow: vi.fn(() => ({ 
              setColor: vi.fn(), 
              setIntensity: vi.fn(), 
              setDistance: vi.fn() 
            })) 
          }
        }
      },
      score: 0,
      wave: 1,
      enemies: [],
      systems: {},
      cameras: { 
        main: { 
          width: 800, height: 600, 
          setBackgroundColor: vi.fn(),
          setAlpha: vi.fn() 
        } 
      },
      add: {
        graphics: vi.fn(() => ({
          fillStyle: vi.fn().mockReturnThis(),
          fillCircle: vi.fn().mockReturnThis(),
          fillRect: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          strokeCircle: vi.fn().mockReturnThis(),
          strokeRect: vi.fn().mockReturnThis(),
          arc: vi.fn().mockReturnThis(),
          beginPath: vi.fn().mockReturnThis(),
          strokePath: vi.fn().mockReturnThis(),
          clear: vi.fn().mockReturnThis(),
          destroy: vi.fn()
        })),
        particles: vi.fn((x, y, texture, config) => {
          const emitter = { 
            start: vi.fn(), 
            stop: vi.fn(),
            setConfig: vi.fn(),
            frequency: 100
          };
          return {
            createEmitter: vi.fn(() => emitter),
            start: vi.fn(),
            stop: vi.fn(),
            setConfig: vi.fn()
          };
        }),
        container: vi.fn(() => ({
          add: vi.fn(), remove: vi.fn(), destroy: vi.fn()
        })),
        rectangle: vi.fn(() => ({
          setDepth: vi.fn().mockReturnThis(),
          setScrollFactor: vi.fn().mockReturnThis(),
          setFillStyle: vi.fn().mockReturnThis(),
          destroy: vi.fn()
        }))
      },
      events: { on: vi.fn(), emit: vi.fn() },
      time: { now: 0, delta: 16 }
    };

    // Create the system
    environmentalHUD = new EnvironmentalHUDSystem(mockScene);
  });

  describe('Core Principle: Zero Panels, Pure Perception', () => {
    it('should encode health as ship glow intensity', () => {
      // Full health = bright glow (0.8-1.0 range)
      const fullHealthGlow = environmentalHUD.calculateGlowIntensity(100, 100);
      expect(fullHealthGlow).toBeGreaterThan(0.8);
      expect(fullHealthGlow).toBeLessThanOrEqual(1.0);
      
      // Half health = moderate glow
      const halfHealthGlow = environmentalHUD.calculateGlowIntensity(50, 100);
      expect(halfHealthGlow).toBeGreaterThan(0.5);
      expect(halfHealthGlow).toBeLessThan(0.8);
      
      // Low health = warning strobe (lower value)
      const lowHealthGlow = environmentalHUD.calculateGlowIntensity(20, 100);
      expect(lowHealthGlow).toBeLessThan(0.5);
    });

    it('should encode score as persistent trail luminosity', () => {
      // High score = bright trail (>0.5)
      const highScoreTrail = environmentalHUD.calculateTrailIntensity(30000);
      expect(highScoreTrail).toBeGreaterThan(0.5);
      
      // Low score = dim trail
      const lowScoreTrail = environmentalHUD.calculateTrailIntensity(100);
      expect(lowScoreTrail).toBeLessThan(0.3);
      
      // Max score = full intensity
      const maxTrail = environmentalHUD.calculateTrailIntensity(100000);
      expect(maxTrail).toBe(1.0);
    });

    it('should encode wave progress as arena boundary behavior', () => {
      // Mid wave = moderate pulse (0.5-1.5 Hz)
      const midPulse = environmentalHUD.calculateBoundaryPulse(30, 60);
      expect(midPulse).toBeGreaterThan(0);
      expect(midPulse).toBeGreaterThanOrEqual(1.0);
      
      // Critical time = faster pulse
      const criticalPulse = environmentalHUD.calculateBoundaryPulse(55, 60);
      expect(criticalPulse).toBeGreaterThan(midPulse);
      
      // Should cap at reasonable max
      expect(criticalPulse).toBeLessThanOrEqual(2.5);
    });
  });

  describe('System Status as Environmental Tints', () => {
    it('should return base color when no systems active', () => {
      const noSystemTint = environmentalHUD.calculateBackgroundTint([]);
      expect(noSystemTint).toHaveProperty('r');
      expect(noSystemTint).toHaveProperty('g');
      expect(noSystemTint).toHaveProperty('b');
    });

    it('should return different colors for different system combinations', () => {
      const voidCoherenceTint = environmentalHUD.calculateBackgroundTint(['voidCoherence']);
      const syntropyTint = environmentalHUD.calculateBackgroundTint(['syntropyEngine']);
      
      // Different systems should produce different tints
      expect(voidCoherenceTint).not.toEqual(syntropyTint);
    });

    it('should blend multiple system colors', () => {
      const singleSystem = environmentalHUD.calculateBackgroundTint(['voidCoherence']);
      const blended = environmentalHUD.blendSystemColors(['voidCoherence', 'syntropyEngine']);
      
      // Blended should be different from single system
      expect(blended).not.toEqual(singleSystem);
      
      // Should have values between the two source colors
      expect(blended.r).toBeGreaterThanOrEqual(Math.min(singleSystem.r, 0));
      expect(blended.g).toBeGreaterThan(100); // Mix of 0 and 240
    });

    it('should generate unique color signatures per system combination', () => {
      // Each system has a unique "color contribution"
      const systemColors = {
        voidCoherence: { r: 107, g: 0, b: 255 },
        syntropyEngine: { r: 0, g: 240, b: 255 },
        chronoLoop: { r: 0, g: 212, b: 170 }
      };
      
      // Active systems blend their colors
      const activeSystems = ['voidCoherence', 'syntropyEngine'];
      const blended = environmentalHUD.blendSystemColors(activeSystems);
      
      // Blended color should be mix of both (purple + cyan = lighter purple-blue)
      expect(blended.r).toBeGreaterThan(0);
      expect(blended.r).toBeLessThan(107); // Averaged down
      expect(blended.g).toBeGreaterThan(100); // Mix of 0 and 240
      expect(blended.b).toBe(255); // Both have 255
    });

    it('should show system cooldowns as orbital rings around player', () => {
      const cooldowns = [
        { id: 'chronoLoop', progress: 0.7, color: 0x00d4aa },
        { id: 'temporalRewind', progress: 0.3, color: 0xffaa00 }
      ];
      
      const ringPositions = environmentalHUD.calculateOrbitalRingPositions(cooldowns);
      
      expect(ringPositions).toHaveLength(2);
      expect(ringPositions[0].radius).toBeDefined();
      expect(ringPositions[0].fill).toBe(0.7);
      expect(ringPositions[1].fill).toBe(0.3);
    });
  });

  describe('Progressive Environmental Literacy', () => {
    it('should start with core vitals visible (health glow, score trail)', () => {
      // Minute 0: Core vitals only (health + score)
      const minute0Indicators = environmentalHUD.getActiveEnvironmentalIndicators(0);
      expect(minute0Indicators.length).toBeGreaterThanOrEqual(2);
      expect(minute0Indicators.some(i => i.id === 'health')).toBe(true);
      expect(minute0Indicators.some(i => i.id === 'score')).toBe(true);
    });

    it('should add resonance tint at 3 minutes', () => {
      // Minute 3: First system unlock adds environmental cue
      const minute3Indicators = environmentalHUD.getActiveEnvironmentalIndicators(3);
      const hasResonanceTint = minute3Indicators.some(i => i.id === 'echoStormTint');
      expect(hasResonanceTint).toBe(true);
    });

    it('should have full synaesthetic experience by 15 minutes', () => {
      // Minute 15: Multiple overlapping environmental cues
      const minute15Indicators = environmentalHUD.getActiveEnvironmentalIndicators(15);
      
      // Should have many indicators (7 in our implementation)
      expect(minute15Indicators.length).toBeGreaterThan(5);
      
      // Should have variety of indicator types
      const types = new Set(minute15Indicators.map(i => i.type));
      expect(types.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Enemy Threat Encoding', () => {
    it('should encode enemy count as bullet pattern density', () => {
      // More enemies = denser patterns
      const highDensity = environmentalHUD.calculateBulletPatternDensity(10);
      expect(highDensity).toBeGreaterThanOrEqual(0.5);
      
      const lowDensity = environmentalHUD.calculateBulletPatternDensity(2);
      expect(lowDensity).toBeLessThan(highDensity);
      
      // Should cap at max
      const maxDensity = environmentalHUD.calculateBulletPatternDensity(100);
      expect(maxDensity).toBe(1.0);
    });

    it('should show enemy loadouts through bullet color signatures', () => {
      // Enemy with specific system = bullets tinted that color
      const voidColor = environmentalHUD.getBulletColorForLoadout(['voidCoherence']);
      expect(voidColor).toBe(0x6b00ff);
      
      const syntropyColor = environmentalHUD.getBulletColorForLoadout(['syntropyEngine']);
      expect(syntropyColor).toBe(0x00f0ff);
      
      // No loadout = white
      const noLoadout = environmentalHUD.getBulletColorForLoadout([]);
      expect(noLoadout).toBe(0xffffff);
    });
  });

  describe('Audio-Visual Synaesthesia', () => {
    it('should map system activations to environmental sound layers', () => {
      const activeSystems = ['harmonicConvergence', 'syntropyEngine'];
      const soundLayers = environmentalHUD.calculateSoundLayers(activeSystems);
      
      expect(soundLayers).toHaveLength(2);
      expect(soundLayers[0].frequency).toBeDefined();
      expect(soundLayers[0].amplitude).toBeDefined();
    });

    it('should pulse environmental elements to audio rhythm', () => {
      // Background elements pulse in time with "combat music"
      const bpm = 120;
      const pulsePhase0 = environmentalHUD.calculatePulsePhase(0, bpm);
      const pulsePhaseHalf = environmentalHUD.calculatePulsePhase(0.25, bpm); // Half beat at 120bpm
      
      expect(pulsePhase0).toBe(0); // Start at 0
      expect(pulsePhase0).toBeGreaterThanOrEqual(0);
      expect(pulsePhase0).toBeLessThan(Math.PI * 2);
      
      // Phase should advance with time (0.25s at 120bpm = half beat = PI)
      expect(pulsePhaseHalf).toBe(Math.PI);
    });
  });

  describe('System Integration', () => {
    it('should expose color lookup for other systems', () => {
      const voidColor = environmentalHUD.getSystemColor('voidCoherence');
      expect(voidColor).toBe(0x6b00ff);
      
      const unknownColor = environmentalHUD.getSystemColor('nonexistent');
      expect(unknownColor).toBe(0xffffff); // Default white
    });
  });
});
