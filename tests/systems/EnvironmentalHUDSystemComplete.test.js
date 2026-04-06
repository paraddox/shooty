import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Expanded EnvironmentalHUDSystem Tests
 * 
 * "The Arena IS the HUD" — Complete replacement for HUDPanelManager.
 * All 30+ panel data points encoded into environmental perception:
 * - Ship glow/aura/pulse (health, score, streak, systems)
 * - Orbital rings/glyphs (cooldowns, charges, abilities)
 * - Trail/stardust (score persistence, karma, quantum echoes)
 * - Arena boundary (wave timer, enemy density, threat)
 * - Background/environmental (system tints, convergence, synthesis)
 * - Body modifications (proteus evolution, weapon adaptation, harmonic state)
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

import EnvironmentalHUDSystem from '../../src/systems/EnvironmentalHUDSystem.js';

describe('EnvironmentalHUDSystem — "The Arena IS the HUD" (Complete)', () => {
  let mockScene;
  let environmentalHUD;

  beforeEach(() => {
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
              setDistance: vi.fn(),
              destroy: vi.fn()
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
            frequency: 100,
            destroy: vi.fn()
          };
          return {
            createEmitter: vi.fn(() => emitter),
            start: vi.fn(),
            stop: vi.fn(),
            setConfig: vi.fn(),
            destroy: vi.fn()
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
        })),
        text: vi.fn(() => ({
          setOrigin: vi.fn().mockReturnThis(),
          setStyle: vi.fn().mockReturnThis(),
          setText: vi.fn(),
          destroy: vi.fn()
        }))
      },
      events: { on: vi.fn(), emit: vi.fn() },
      time: { now: 0, delta: 16 }
    };

    environmentalHUD = new EnvironmentalHUDSystem(mockScene);
  });

  describe('Core Vitals (was TOP_LEFT panel)', () => {
    it('should encode health as ship glow intensity', () => {
      const fullHealth = environmentalHUD.calculateGlowIntensity(100, 100);
      expect(fullHealth).toBeGreaterThan(0.8);
      
      const criticalHealth = environmentalHUD.calculateGlowIntensity(20, 100);
      expect(criticalHealth).toBeLessThan(0.5); // Strobing warning
    });

    it('should encode score as stardust trail density', () => {
      const lowScore = environmentalHUD.calculateTrailIntensity(5000);
      expect(lowScore).toBeLessThan(0.2);
      
      const highScore = environmentalHUD.calculateTrailIntensity(40000);
      expect(highScore).toBeGreaterThan(0.7);
      
      const maxScore = environmentalHUD.calculateTrailIntensity(100000);
      expect(maxScore).toBe(1.0);
    });

    it('should encode near-miss streak as ship aura pulsing', () => {
      const noStreak = environmentalHUD.calculateStreakPulse(0);
      expect(noStreak).toBe(0);
      
      const activeStreak = environmentalHUD.calculateStreakPulse(5);
      expect(activeStreak).toBeGreaterThan(0);
      expect(activeStreak).toBeLessThanOrEqual(1);
      
      const maxStreak = environmentalHUD.calculateStreakPulse(20);
      expect(maxStreak).toBe(1.0);
    });

    it('should encode syntropy as golden orbital particles', () => {
      const lowSyntropy = environmentalHUD.calculateSyntropyOrbitalRadius(0.2);
      expect(lowSyntropy).toBeGreaterThan(30);
      
      const highSyntropy = environmentalHUD.calculateSyntropyOrbitalRadius(0.9);
      expect(highSyntropy).toBeGreaterThan(lowSyntropy);
    });

    it('should encode convergence as background light bloom', () => {
      const noConvergence = environmentalHUD.calculateConvergenceBloom(0);
      expect(noConvergence).toBe(0);
      
      const fullConvergence = environmentalHUD.calculateConvergenceBloom(1.0);
      expect(fullConvergence).toBeGreaterThan(0.5);
    });
  });

  describe('Systems Status (was TOP_RIGHT panel)', () => {
    it('should encode wave timer as arena boundary urgency', () => {
      const earlyWave = environmentalHUD.calculateBoundaryPulse(10, 60);
      expect(earlyWave).toBeLessThan(1.0);
      
      const lateWave = environmentalHUD.calculateBoundaryPulse(55, 60);
      expect(lateWave).toBeGreaterThan(earlyWave);
      expect(lateWave).toBeLessThanOrEqual(2.5);
    });

    it('should encode resonance orbs as orbiting orb particles', () => {
      const noOrbs = environmentalHUD.calculateOrbVisuals(0);
      expect(noOrbs.count).toBe(0);
      
      const someOrbs = environmentalHUD.calculateOrbVisuals(3);
      expect(someOrbs.count).toBe(3);
      expect(someOrbs.radius).toBeGreaterThan(0);
      
      const manyOrbs = environmentalHUD.calculateOrbVisuals(8);
      expect(manyOrbs.count).toBe(8);
    });

    it('should encode quantum immortality as death echo ghosts', () => {
      const noDeaths = environmentalHUD.calculateQuantumEchoes(0);
      expect(noDeaths).toBe(0);
      
      const someDeaths = environmentalHUD.calculateQuantumEchoes(3);
      expect(someDeaths).toBe(3);
    });

    it('should encode void debt as screen vignette darkness', () => {
      const noDebt = environmentalHUD.calculateDebtVignette(0);
      expect(noDebt).toBe(0);
      
      const heavyDebt = environmentalHUD.calculateDebtVignette(10000);
      expect(heavyDebt).toBeGreaterThan(0.3);
      expect(heavyDebt).toBeLessThanOrEqual(0.8);
    });

    it('should encode bootstrap paradox as time fracture visuals', () => {
      const stable = environmentalHUD.calculateParadoxFractures(0);
      expect(stable).toBe(0);
      
      const paradox = environmentalHUD.calculateParadoxFractures(5);
      expect(paradox).toBeGreaterThan(0);
    });

    it('should encode dissolution as ship flicker/fade', () => {
      const noDissolution = environmentalHUD.calculateDissolutionFlicker(0);
      expect(noDissolution).toBe(0);
      
      const dissolving = environmentalHUD.calculateDissolutionFlicker(0.5);
      expect(dissolving).toBeGreaterThan(0);
    });

    it('should encode heartflux as heartbeat screen pulse', () => {
      const calm = environmentalHUD.calculateHeartfluxPulse(60); // 60 BPM
      expect(calm).toBeGreaterThan(0);
      
      const excited = environmentalHUD.calculateHeartfluxPulse(120); // 120 BPM
      expect(excited).toBeGreaterThan(calm);
    });
  });

  describe('Symbiosis State (was TOP_CENTER panel)', () => {
    it('should encode proteus evolution as ship body mutations', () => {
      const baseForm = environmentalHUD.calculateProteusMutation(0);
      expect(baseForm.mutationLevel).toBe(0);
      
      const evolved = environmentalHUD.calculateProteusMutation(5);
      expect(evolved.mutationLevel).toBeGreaterThan(0);
      expect(evolved.wingCount).toBeGreaterThanOrEqual(0);
    });

    it('should encode symbiosis harmony/chaos as ship color balance', () => {
      const pureHarmony = environmentalHUD.calculateSymbiosisColor(1.0, 0);
      expect(pureHarmony.hue).toBeGreaterThan(100); // Green/cyan range
      
      const pureChaos = environmentalHUD.calculateSymbiosisColor(0, 1.0);
      expect(pureChaos.hue).toBeLessThan(60); // Red/orange range
      
      const balanced = environmentalHUD.calculateSymbiosisColor(0.5, 0.5);
      expect(balanced.hue).toBeGreaterThan(60);
      expect(balanced.hue).toBeLessThan(100);
    });

    it('should encode resonance cascade as ripple wave intensity', () => {
      const noCascade = environmentalHUD.calculateCascadeRipples(0);
      expect(noCascade.amplitude).toBe(0);
      
      const activeCascade = environmentalHUD.calculateCascadeRipples(3.5);
      expect(activeCascade.amplitude).toBeGreaterThan(0);
      expect(activeCascade.frequency).toBeGreaterThan(0);
    });
  });

  describe('Active Abilities (was BOTTOM_RIGHT panel)', () => {
    it('should encode ability cooldowns as orbital glyph rings', () => {
      const ready = environmentalHUD.calculateAbilityGlyph('aperture', 0, 5000);
      expect(ready.fill).toBe(1.0);
      expect(ready.glow).toBe(true);
      
      const cooling = environmentalHUD.calculateAbilityGlyph('aperture', 3000, 5000);
      expect(cooling.fill).toBeLessThan(1.0);
      expect(cooling.fill).toBeGreaterThan(0);
    });

    it('should encode meta-system operator as cursor halo', () => {
      const inactive = environmentalHUD.calculateMetaHalo(false);
      expect(inactive.intensity).toBe(0);
      
      const active = environmentalHUD.calculateMetaHalo(true);
      expect(active.intensity).toBeGreaterThan(0.5);
      expect(active.color).toBeDefined();
    });

    it('should encode karma as ship shadow weight', () => {
      const noKarma = environmentalHUD.calculateKarmaShadow(0);
      expect(noKarma.offset).toBe(0);
      
      const heavyKarma = environmentalHUD.calculateKarmaShadow(100);
      expect(heavyKarma.offset).toBeGreaterThan(0);
      expect(heavyKarma.opacity).toBeGreaterThan(0.3);
    });

    it('should encode athenaeum knowledge as accumulated aura text', () => {
      const empty = environmentalHUD.calculateKnowledgeAura(0);
      expect(empty.glyphCount).toBe(0);
      
      const learned = environmentalHUD.calculateKnowledgeAura(50);
      expect(learned.glyphCount).toBeGreaterThan(0);
    });
  });

  describe('Threat & Environment (Enemy Count, Wave State)', () => {
    it('should encode enemy count as arena edge density', () => {
      const empty = environmentalHUD.calculateEnemyDensityEffect(0);
      expect(empty.edgeThrob).toBe(0);
      
      const crowded = environmentalHUD.calculateEnemyDensityEffect(15);
      expect(crowded.edgeThrob).toBeGreaterThan(0.5);
      
      const swarming = environmentalHUD.calculateEnemyDensityEffect(30);
      expect(swarming.edgeThrob).toBe(1.0);
    });

    it('should encode weapon status as barrel glow color', () => {
      const standard = environmentalHUD.getWeaponGlowColor('standard');
      expect(standard).toBeDefined();
      
      const adapted = environmentalHUD.getWeaponGlowColor('adapted');
      expect(adapted).not.toEqual(standard);
    });

    it('should encode wave progression as seasonal void shift', () => {
      const wave1 = environmentalHUD.calculateWaveSeasonTint(1);
      expect(wave1).toHaveProperty('r');
      expect(wave1.name).toBe('void');
      
      // Wave 5 cycles back to season 0 (same as wave 1)
      const wave5 = environmentalHUD.calculateWaveSeasonTint(5);
      expect(wave5).toEqual(wave1);
      
      // Wave 2 is different season
      const wave2 = environmentalHUD.calculateWaveSeasonTint(2);
      expect(wave2.name).not.toEqual(wave1.name);
    });
  });

  describe('Integration & API', () => {
    it('should provide unified environmental state query', () => {
      const state = environmentalHUD.getEnvironmentalState();
      expect(state).toHaveProperty('shipGlow');
      expect(state).toHaveProperty('trailIntensity');
      expect(state).toHaveProperty('boundaryPulse');
      expect(state).toHaveProperty('systemTints');
    });

    it('should calculate all HUD values without panel dependencies', () => {
      // Simulate game state
      mockScene.score = 25000;
      mockScene.wave = 3;
      mockScene.player.health = 75;
      
      const hudValues = environmentalHUD.calculateAllHUDValues();
      
      expect(hudValues.healthGlow).toBeGreaterThan(0);
      expect(hudValues.scoreTrail).toBeGreaterThan(0);
      expect(hudValues.waveSeason).toBeDefined();
    });
  });

  describe('Progressive Environmental Literacy', () => {
    it('should reveal indicators gradually over 15 minutes', () => {
      const minute0 = environmentalHUD.getActiveEnvironmentalIndicators(0);
      expect(minute0.length).toBeLessThanOrEqual(2);
      
      const minute15 = environmentalHUD.getActiveEnvironmentalIndicators(15);
      expect(minute15.length).toBeGreaterThan(10);
    });

    it('should maintain core vitals visible from start', () => {
      const indicators = environmentalHUD.getActiveEnvironmentalIndicators(0);
      const hasHealth = indicators.some(i => i.id === 'health');
      const hasScore = indicators.some(i => i.id === 'score');
      
      expect(hasHealth).toBe(true);
      expect(hasScore).toBe(true);
    });
  });
});
