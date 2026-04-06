/**
 * EnvironmentalHUDSystem — "The Arena IS the HUD"
 * 
 * A radical simplification that eliminates all panel-based HUD elements
 * and encodes game state into the game world itself through:
 * - Visual patterns (ship glow, trails, environmental tints)
 * - Particle behavior (orbital rings, ambient particles)
 * - Spatial audio (system sound layers, rhythmic pulsing)
 * 
 * The player learns to read the world, not the UI.
 */

import Phaser from 'phaser';

export default class EnvironmentalHUDSystem {
  constructor(scene) {
    this.scene = scene;
    
    // System colors for environmental tinting
    this.SYSTEM_COLORS = {
      voidCoherence: { r: 107, g: 0, b: 255, hex: 0x6b00ff },      // Deep purple
      syntropyEngine: { r: 0, g: 240, b: 255, hex: 0x00f0ff },     // Cyan
      chronoLoop: { r: 0, g: 212, b: 170, hex: 0x00d4aa },        // Teal
      resonanceCascade: { r: 255, g: 107, b: 107, hex: 0xff6b6b }, // Coral
      temporalResidue: { r: 157, g: 78, b: 221, hex: 0x9d4edd },   // Purple
      quantumImmortality: { r: 255, g: 230, b: 109, hex: 0xffe66d }, // Gold
      echoStorm: { r: 255, g: 215, b: 0, hex: 0xffd700 },           // Gold
      fractureSystem: { r: 0, g: 240, b: 255, hex: 0x00f0ff },     // Cyan
      temporalRewind: { r: 78, g: 205, b: 196, hex: 0x4ecdc4 },    // Mint
      paradoxEngine: { r: 255, g: 107, b: 107, hex: 0xff6b6b },    // Coral
      harmonicConvergence: { r: 0, g: 240, b: 255, hex: 0x00f0ff }, // Cyan
      symbioticPrediction: { r: 0, g: 240, b: 255, hex: 0x00f0ff }, // Cyan
      egregoreProtocol: { r: 255, g: 107, b: 107, hex: 0xff6b6b }, // Coral
      aethericConvergence: { r: 157, g: 78, b: 221, hex: 0x9d4edd }, // Purple
      bootstrapProtocol: { r: 255, g: 230, b: 109, hex: 0xffe66b }, // Gold
      dissolutionProtocol: { r: 45, g: 31, b: 61, hex: 0x2d1f3d }, // Dark purple
      axiomNexus: { r: 255, g: 215, b: 0, hex: 0xffd700 },          // Gold
      athenaeumProtocol: { r: 157, g: 78, b: 221, hex: 0x9d4edd }, // Purple
      apertureProtocol: { r: 0, g: 212, b: 170, hex: 0x00d4aa },   // Teal
      synaesthesiaProtocol: { r: 0, g: 240, b: 255, hex: 0x00f0ff }, // Cyan
      inscriptionProtocol: { r: 255, g: 215, b: 0, hex: 0xffd700 }, // Gold
      proteusProtocol: { r: 78, g: 205, b: 196, hex: 0x4ecdc4 },    // Mint
      resonanceOrb: { r: 255, g: 230, b: 109, hex: 0xffe66d },    // Gold
      tychosAurora: { r: 157, g: 78, b: 221, hex: 0x9d4edd },      // Purple
      metaSystemOperator: { r: 0, g: 240, b: 255, hex: 0x00f0ff }, // Cyan
      livingWorld: { r: 78, g: 205, b: 196, hex: 0x4ecdc4 },        // Mint
      dreamState: { r: 157, g: 78, b: 221, hex: 0x9d4edd },        // Purple
      sanctumProtocol: { r: 0, g: 240, b: 255, hex: 0x00f0ff },    // Cyan
      cartographerProtocol: { r: 0, g: 240, b: 255, hex: 0x00f0ff }, // Cyan
      apopheniaProtocol: { r: 157, g: 78, b: 221, hex: 0x9d4edd }, // Purple
      geometricChorus: { r: 75, g: 0, b: 130, hex: 0x4b0082 },     // Indigo
      architectSystem: { r: 255, g: 215, b: 0, hex: 0xffd700 },     // Gold
      rivalProtocol: { r: 255, g: 107, b: 107, hex: 0xff6b6b },     // Coral
      synchronicityCascade: { r: 255, g: 215, b: 0, hex: 0xffd700 }, // Gold
      recursionEngine: { r: 0, g: 240, b: 255, hex: 0x00f0ff },    // Cyan
      heartflux: { r: 255, g: 107, b: 157, hex: 0xff6b9d },         // Pink
      exogenesis: { r: 255, g: 170, b: 68, hex: 0xffaa44 }          // Orange
    };

    // Base ambient colors for each tier
    this.TIER_AMBIENT = {
      core: { r: 10, g: 10, b: 15 },        // Deep void
      foundation: { r: 15, g: 5, b: 25 },   // Purple-tinged
      adaptive: { r: 10, g: 15, b: 20 },  // Blue-tinged
      strategic: { r: 20, g: 5, b: 15 },  // Red-tinged
      meta: { r: 15, g: 15, b: 15 },      // White-tinged
      transcendent: { r: 5, g: 5, b: 5 }  // Near black
    };

    // State tracking
    this.trailParticles = null;
    this.lastHealthRatio = 1.0;
    this.lastScore = 0;
    
    // Glow effect reference
    this.playerGlow = null;
    
    // Create visual elements
    this.createVisualElements();
    
    console.log('[EnvironmentalHUD] Initialized - The Arena IS the HUD');
  }

  /**
   * Create persistent visual elements
   */
  createVisualElements() {
    // Trail particle emitter (for score encoding) - deferred until player exists
    this.trailParticles = null;
    
    // Graphics for orbital rings
    this.ringGraphics = this.scene.add.graphics();
    
    // Background tint overlay
    this.bgTintOverlay = this.scene.add.rectangle(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height / 2,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      0x000000,
      0
    );
    this.bgTintOverlay.setDepth(-1000); // Behind everything
    this.bgTintOverlay.setScrollFactor(0);
  }

  /**
   * Main update loop - called every frame
   */
  update(dt) {
    if (!this.scene.player) return;
    
    // Update ship glow (health encoding)
    this.updateShipGlow();
    
    // Update trail intensity (score encoding)
    this.updateTrailIntensity();
    
    // Update environmental tint (system status)
    this.updateEnvironmentalTint();
    
    // Update orbital rings (cooldowns)
    this.updateOrbitalRings(dt);
    
    // Update ambient sound layers
    this.updateSoundLayers();
    
    // Update arena boundary pulse (wave timer)
    this.updateArenaBoundary();
  }

  /**
   * Calculate glow intensity from health
   * Full health = bright, steady glow
   * Critical health = warning strobe
   */
  calculateGlowIntensity(health, maxHealth) {
    const ratio = health / maxHealth;
    
    // Critical health (<25%) = strobing warning
    if (ratio < 0.25) {
      const time = this.scene.time?.now || 0;
      return 0.2 + (Math.sin(time / 100) + 1) * 0.15; // 0.2 to 0.5 strobe
    }
    
    // Normal: Map to 0.5-1.0 range
    return 0.5 + (ratio * 0.5);
  }

  /**
   * Update player ship glow based on health
   */
  updateShipGlow() {
    const player = this.scene.player;
    if (!player || !player.sprite) return;
    
    const health = player.health || 100;
    const maxHealth = player.maxHealth || 100;
    
    const intensity = this.calculateGlowIntensity(health, maxHealth);
    
    // Apply glow effect via preFX or tint
    if (player.sprite.preFX) {
      if (!this.playerGlow) {
        this.playerGlow = player.sprite.preFX.addGlow();
      }
      
      // Critical health = red glow, otherwise cyan
      const isCritical = (health / maxHealth) < 0.25;
      const glowColor = isCritical ? 0xff0000 : 0x00f0ff;
      
      this.playerGlow.setColor(glowColor);
      this.playerGlow.setIntensity(intensity * 2);
      this.playerGlow.setDistance(intensity * 10);
    } else {
      // Fallback: use alpha for glow effect
      player.sprite.setAlpha(0.7 + (intensity * 0.3));
    }
    
    this.lastHealthRatio = health / maxHealth;
  }

  /**
   * Calculate trail intensity from score
   * Higher score = brighter, more persistent trail
   */
  calculateTrailIntensity(score) {
    const maxExpectedScore = 50000;
    return Math.min(1.0, score / maxExpectedScore);
  }

  /**
   * Update trail particle intensity based on score
   */
  updateTrailIntensity() {
    const score = this.scene.score || 0;
    const intensity = this.calculateTrailIntensity(score);
    
    // Lazy initialization of trail particles when needed and player exists
    if (intensity > 0.1 && !this.trailParticles && this.scene.player && this.scene.add.particles) {
      this.trailParticles = this.scene.add.particles(0, 0, 'particle', {
        follow: this.scene.player,
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.3, end: 0 },
        tint: 0x00f0ff,
        lifespan: 1000,
        frequency: 100,
        quantity: 1,
        blendMode: 'ADD'
      });
      this.trailParticles.stop();
    }
    
    if (!this.trailParticles) return;
    
    if (intensity > 0.1) {
      this.trailParticles.start();
      
      // Adjust trail properties based on intensity
      const emissionFrequency = 100 - (intensity * 80); // 100ms to 20ms
      this.trailParticles.frequency = emissionFrequency;
      
      // Higher score = longer trail (higher alpha at start)
      this.trailParticles.setConfig({
        alpha: { start: 0.2 + (intensity * 0.3), end: 0 }
      });
    } else {
      this.trailParticles.stop();
    }
    
    this.lastScore = score;
  }

  /**
   * Calculate background tint from active systems
   */
  calculateBackgroundTint(activeSystemIds) {
    if (activeSystemIds.length === 0) {
      return this.TIER_AMBIENT.core;
    }
    
    // Get colors for all active systems
    const colors = activeSystemIds
      .map(id => this.SYSTEM_COLORS[id])
      .filter(c => c);
    
    if (colors.length === 0) {
      return this.TIER_AMBIENT.core;
    }
    
    // Blend colors by averaging
    const totalR = colors.reduce((sum, c) => sum + c.r, 0);
    const totalG = colors.reduce((sum, c) => sum + c.g, 0);
    const totalB = colors.reduce((sum, c) => sum + c.b, 0);
    
    return {
      r: Math.round(totalR / colors.length),
      g: Math.round(totalG / colors.length),
      b: Math.round(totalB / colors.length)
    };
  }

  /**
   * Blend system colors for environmental tint
   */
  blendSystemColors(activeSystemIds) {
    return this.calculateBackgroundTint(activeSystemIds);
  }

  /**
   * Update environmental background tint based on active systems
   */
  updateEnvironmentalTint() {
    // Get active systems from unlock manager
    const unlockManager = this.scene.systemUnlockManager;
    if (!unlockManager) return;
    
    const unlockedIds = unlockManager.getAllUnlockedIds ? 
      unlockManager.getAllUnlockedIds() : 
      (unlockManager.getActiveSystems ? unlockManager.getActiveSystems() : []);
    
    // Calculate blended tint
    const tint = this.calculateBackgroundTint(unlockedIds);
    const hexTint = (tint.r << 16) | (tint.g << 8) | tint.b;
    
    // Apply subtle background tint
    const baseColor = this.TIER_AMBIENT.core;
    const blendStrength = 0.15; // Subtle effect
    
    const finalR = Math.round(baseColor.r + (tint.r - baseColor.r) * blendStrength);
    const finalG = Math.round(baseColor.g + (tint.g - baseColor.g) * blendStrength);
    const finalB = Math.round(baseColor.b + (tint.b - baseColor.b) * blendStrength);
    const finalHex = (finalR << 16) | (finalG << 8) | finalB;
    
    // Apply to background
    this.scene.cameras.main.setBackgroundColor(finalHex);
    
    // Update tint overlay for additional effect
    if (this.bgTintOverlay) {
      this.bgTintOverlay.setFillStyle(hexTint, 0.05);
    }
  }

  /**
   * Calculate orbital ring positions for cooldowns
   */
  calculateOrbitalRingPositions(cooldowns) {
    return cooldowns.map((cd, index) => ({
      radius: 40 + (index * 15),
      fill: cd.progress,
      color: cd.color,
      systemId: cd.id
    }));
  }

  /**
   * Update orbital rings around player showing cooldowns
   */
  updateOrbitalRings(dt) {
    const player = this.scene.player;
    if (!player) return;
    
    // Collect cooldown info from systems
    const cooldowns = [];
    
    // Chrono Loop
    if (this.scene.chronoLoop && this.scene.chronoLoop.echoCharge !== undefined) {
      cooldowns.push({
        id: 'chronoLoop',
        progress: this.scene.chronoLoop.echoCharge / 100,
        color: 0x00d4aa
      });
    }
    
    // Temporal Rewind
    if (this.scene.temporalRewind && this.scene.temporalRewind.cooldown !== undefined) {
      const maxCooldown = this.scene.temporalRewind.maxCooldown || 5000;
      const remaining = Math.max(0, this.scene.temporalRewind.cooldown);
      cooldowns.push({
        id: 'temporalRewind',
        progress: 1 - (remaining / maxCooldown),
        color: 0xffaa00
      });
    }
    
    // Clear and redraw rings
    this.ringGraphics.clear();
    
    const ringPositions = this.calculateOrbitalRingPositions(cooldowns);
    
    ringPositions.forEach(ring => {
      const x = player.x;
      const y = player.y;
      
      // Background ring
      this.ringGraphics.lineStyle(2, ring.color, 0.3);
      this.ringGraphics.strokeCircle(x, y, ring.radius);
      
      // Fill arc based on progress
      if (ring.fill > 0) {
        this.ringGraphics.lineStyle(2, ring.color, 0.8);
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * ring.fill);
        this.ringGraphics.beginPath();
        this.ringGraphics.arc(x, y, ring.radius, startAngle, endAngle);
        this.ringGraphics.strokePath();
      }
    });
  }

  /**
   * Calculate bullet pattern density from enemy count
   */
  calculateBulletPatternDensity(enemyCount) {
    return Math.min(1.0, enemyCount / 15); // Cap at 15 enemies
  }

  /**
   * Calculate wave boundary pulse rate
   * Returns pulse frequency in Hz
   */
  calculateBoundaryPulse(elapsed, total) {
    const remaining = total - elapsed;
    const urgency = 1 - (remaining / total);
    // Base 0.5Hz, up to 2.5Hz at end
    return Math.min(2.5, 0.5 + (urgency * 2.0));
  }

  /**
   * Update arena boundary visual feedback
   */
  updateArenaBoundary() {
    // Get wave timing
    const waveManager = this.scene.waveManager || this.scene;
    const elapsed = waveManager.waveElapsed || 0;
    const total = waveManager.waveDuration || 60000;
    
    const pulseRate = this.calculateBoundaryPulse(elapsed, total);
    
    // Store for boundary rendering systems to use
    this.currentBoundaryPulse = pulseRate;
    
    // Emit for other systems
    if (this.scene.events) {
      this.scene.events.emit('boundaryPulseUpdate', { pulseRate, urgency: pulseRate / 2.5 });
    }
  }

  /**
   * Get active environmental indicators based on game time (progressive disclosure)
   */
  getActiveEnvironmentalIndicators(minute) {
    const indicators = [
      { type: 'healthGlow', id: 'health', description: 'Ship glow intensity shows health' },
      { type: 'stardust', id: 'score', description: 'Trail density shows score magnitude' }
    ];
    
    // Progressive unlock schedule matching TimeBasedUnlockConfig
    if (minute >= 3) {
      indicators.push({ 
        type: 'systemTint', 
        id: 'echoStormTint', 
        system: 'echoStorm',
        description: 'Gold tint when Echo Storm active'
      });
    }
    
    if (minute >= 6) {
      indicators.push({ 
        type: 'orbitalRing', 
        id: 'fractureRing', 
        system: 'fractureSystem',
        description: 'Cyan orbital ring shows Fracture cooldown'
      });
      indicators.push({
        type: 'glyph',
        id: 'abilityGlyphs',
        system: 'cooldowns',
        description: 'Orbital glyphs show ability readiness'
      });
    }
    
    if (minute >= 9) {
      indicators.push({ 
        type: 'trail', 
        id: 'temporalResidueTrail',
        system: 'temporalResidue',
        description: 'Purple trail shows score persistence'
      });
      indicators.push({
        type: 'aura',
        id: 'syntropyOrbitals',
        system: 'syntropyEngine',
        description: 'Golden orbital particles show syntropy'
      });
    }
    
    if (minute >= 12) {
      indicators.push({ 
        type: 'systemTint', 
        id: 'resonanceCascadeTint',
        system: 'resonanceCascade',
        description: 'Coral tint when cascade active'
      });
      indicators.push({
        type: 'orbits',
        id: 'resonanceOrbs',
        system: 'resonanceOrb',
        description: 'Orbiting orbs show collected power'
      });
    }
    
    if (minute >= 15) {
      indicators.push({ 
        type: 'orbitalRing', 
        id: 'singularityRing',
        system: 'singularitySystem',
        description: 'Mint ring shows singularity charge'
      });
      indicators.push({ 
        type: 'systemTint', 
        id: 'omniWeaponTint',
        system: 'omniWeapon',
        description: 'Gold tint reflects weapon adaptation'
      });
      indicators.push({
        type: 'mutation',
        id: 'proteusBody',
        system: 'proteusProtocol',
        description: 'Ship body mutations show evolution'
      });
      indicators.push({
        type: 'vignette',
        id: 'voidDebt',
        system: 'voidExchange',
        description: 'Screen edge darkness shows debt weight'
      });
    }
    
    return indicators;
  }

  /**
   * Calculate sound layers for active systems
   */
  calculateSoundLayers(activeSystemIds) {
    const baseFrequencies = {
      voidCoherence: 220,      // A3
      syntropyEngine: 261.63, // C4
      chronoLoop: 329.63,     // E4
      resonanceCascade: 392, // G4
      harmonicConvergence: 440, // A4
      quantumImmortality: 523.25, // C5
      echoStorm: 293.66,      // D4
      temporalRewind: 349.23, // F4
      aethericConvergence: 493.88 // B4
    };
    
    return activeSystemIds
      .filter(id => baseFrequencies[id])
      .map(id => ({
        system: id,
        frequency: baseFrequencies[id] || 440,
        amplitude: 0.3,
        phase: 0
      }));
  }

  /**
   * Update ambient sound layers
   */
  updateSoundLayers() {
    // Get active systems
    const unlockManager = this.scene.systemUnlockManager;
    if (!unlockManager) return;
    
    const activeSystems = unlockManager.getAllUnlockedIds ? 
      unlockManager.getAllUnlockedIds() : [];
    
    const layers = this.calculateSoundLayers(activeSystems);
    
    // Emit sound layer update for audio system
    if (this.scene.events) {
      this.scene.events.emit('environmentalSoundLayers', layers);
    }
  }

  /**
   * Calculate pulse phase for rhythmic environmental effects
   */
  calculatePulsePhase(time, bpm) {
    const beatDuration = 60 / bpm;
    const phase = (time % beatDuration) / beatDuration;
    return phase * Math.PI * 2;
  }

  /**
   * Get bullet color for enemy loadout
   */
  getBulletColorForLoadout(loadout) {
    if (!loadout || loadout.length === 0) return 0xffffff;
    
    const systemId = loadout[0];
    const color = this.SYSTEM_COLORS[systemId];
    return color ? color.hex : 0xffffff;
  }

  /**
   * Get color for system (for bullet tinting, etc.)
   */
  getSystemColor(systemId) {
    const color = this.SYSTEM_COLORS[systemId];
    return color ? color.hex : 0xffffff;
  }

  // ===== EXPANDED ENVIRONMENTAL HUD METHODS (replaces HUDPanelManager) =====

  /**
   * Calculate near-miss streak as ship aura pulse intensity
   */
  calculateStreakPulse(streakCount) {
    return Math.min(1.0, streakCount / 20); // Max at 20 streak
  }

  /**
   * Calculate syntropy as golden orbital particle radius
   */
  calculateSyntropyOrbitalRadius(syntropyValue) {
    // Base 30px, expands up to 80px with high syntropy
    return 30 + (syntropyValue * 50);
  }

  /**
   * Calculate convergence as background light bloom intensity
   */
  calculateConvergenceBloom(convergenceValue) {
    return Math.min(1.0, convergenceValue);
  }

  /**
   * Calculate resonance orb visuals
   */
  calculateOrbVisuals(orbCount) {
    return {
      count: orbCount || 0,
      radius: 40 + ((orbCount || 0) * 8),
      color: 0xffe66d // Gold
    };
  }

  /**
   * Calculate quantum immortality death echoes
   */
  calculateQuantumEchoes(deathCount) {
    return deathCount || 0;
  }

  /**
   * Calculate void debt as screen vignette darkness
   */
  calculateDebtVignette(debtAmount) {
    // Max vignette at 20000 debt
    return Math.min(0.8, (debtAmount || 0) / 20000);
  }

  /**
   * Calculate bootstrap paradox time fracture visuals
   */
  calculateParadoxFractures(paradoxCount) {
    return paradoxCount || 0;
  }

  /**
   * Calculate dissolution as ship flicker intensity
   */
  calculateDissolutionFlicker(dissolutionProgress) {
    return Math.min(1.0, dissolutionProgress || 0);
  }

  /**
   * Calculate heartflux as screen pulse intensity from BPM
   */
  calculateHeartfluxPulse(bpm) {
    // Higher BPM = more intense pulse
    return Math.min(1.0, (bpm || 60) / 120);
  }

  /**
   * Calculate proteus evolution mutation level
   */
  calculateProteusMutation(generation) {
    return {
      mutationLevel: generation || 0,
      wingCount: Math.min(4, Math.floor((generation || 0) / 2)),
      auraIntensity: Math.min(1.0, (generation || 0) / 10)
    };
  }

  /**
   * Calculate symbiosis harmony/chaos as ship color hue
   */
  calculateSymbiosisColor(harmony, chaos) {
    // Harmony = green/cyan (120-180), Chaos = red/orange (0-60)
    // Balance = yellow/gold (60-120)
    const h = harmony || 0;
    const c = chaos || 0;
    const total = h + c;
    if (total === 0) return { hue: 90, saturation: 0.5, lightness: 0.5 };
    
    const harmonyRatio = h / total;
    // Map 0-1 to hue 0-180
    const hue = harmonyRatio * 180;
    return {
      hue: Math.round(hue),
      saturation: 0.7 + (Math.abs(harmonyRatio - 0.5) * 0.3),
      lightness: 0.5
    };
  }

  /**
   * Calculate resonance cascade ripple wave intensity
   */
  calculateCascadeRipples(cascadeMultiplier) {
    return {
      amplitude: Math.min(1.0, (cascadeMultiplier || 0) / 5),
      frequency: 0.5 + ((cascadeMultiplier || 0) * 0.2),
      color: 0x00f0ff // Cyan
    };
  }

  /**
   * Calculate ability cooldown as orbital glyph ring
   */
  calculateAbilityGlyph(abilityId, currentCooldown, maxCooldown) {
    const progress = maxCooldown > 0 ? 1 - ((currentCooldown || 0) / maxCooldown) : 1;
    return {
      id: abilityId,
      fill: Math.max(0, Math.min(1.0, progress)),
      glow: progress >= 1.0,
      color: this.SYSTEM_COLORS[abilityId]?.hex || 0xffffff
    };
  }

  /**
   * Calculate meta-system operator cursor halo
   */
  calculateMetaHalo(isActive) {
    return {
      intensity: isActive ? 0.8 : 0,
      color: 0xff00ff, // Magenta
      pulse: isActive
    };
  }

  /**
   * Calculate karma as ship shadow offset and opacity
   */
  calculateKarmaShadow(karmaValue) {
    const normalized = Math.min(1.0, (karmaValue || 0) / 100);
    return {
      offset: normalized * 20, // 0-20px offset
      opacity: 0.2 + (normalized * 0.5) // 0.2-0.7 opacity
    };
  }

  /**
   * Calculate athenaeum knowledge as aura text glyphs
   */
  calculateKnowledgeAura(knowledgePoints) {
    return {
      glyphCount: Math.min(12, Math.floor((knowledgePoints || 0) / 10)),
      rotationSpeed: 0.5 + ((knowledgePoints || 0) * 0.01)
    };
  }

  /**
   * Calculate enemy density effect on arena edges
   */
  calculateEnemyDensityEffect(enemyCount) {
    const density = Math.min(1.0, (enemyCount || 0) / 20);
    return {
      edgeThrob: density,
      colorShift: density * 30, // Red shift
      pulseFrequency: 0.5 + (density * 1.5)
    };
  }

  /**
   * Get weapon glow color based on adaptation state
   */
  getWeaponGlowColor(adaptationState) {
    if (adaptationState === 'adapted') {
      return 0xffd700; // Gold for adapted
    }
    return 0x00f0ff; // Cyan for standard
  }

  /**
   * Calculate wave progression as seasonal void tint
   */
  calculateWaveSeasonTint(waveNumber) {
    // Waves cycle through color seasons
    const season = (waveNumber - 1) % 4;
    const seasons = [
      { r: 10, g: 10, b: 20, name: 'void' },      // Deep void
      { r: 20, g: 10, b: 30, name: 'crimson' },  // Crimson tinged
      { r: 10, g: 20, b: 25, name: 'azure' },    // Azure shift
      { r: 25, g: 15, b: 20, name: 'ember' }     // Ember glow
    ];
    return seasons[season];
  }

  /**
   * Get unified environmental state (replaces all panel queries)
   */
  getEnvironmentalState() {
    const player = this.scene.player;
    const health = player?.health || 100;
    const maxHealth = player?.maxHealth || 100;
    
    return {
      shipGlow: this.calculateGlowIntensity(health, maxHealth),
      trailIntensity: this.calculateTrailIntensity(this.scene.score || 0),
      boundaryPulse: this.currentBoundaryPulse || 0.5,
      systemTints: this.calculateBackgroundTint([]),
      waveSeason: this.calculateWaveSeasonTint(this.scene.wave || 1),
      healthRatio: health / maxHealth
    };
  }

  /**
   * Calculate all HUD values for complete panel replacement
   */
  calculateAllHUDValues() {
    const player = this.scene.player;
    const health = player?.health || 100;
    const maxHealth = player?.maxHealth || 100;
    const score = this.scene.score || 0;
    const wave = this.scene.wave || 1;
    
    return {
      // Core vitals
      healthGlow: this.calculateGlowIntensity(health, maxHealth),
      scoreTrail: this.calculateTrailIntensity(score),
      waveSeason: this.calculateWaveSeasonTint(wave),
      
      // System status (pull from scene systems if available)
      resonanceOrbs: this.calculateOrbVisuals(this.scene.resonanceOrbs?.orbCount || 0),
      quantumEchoes: this.calculateQuantumEchoes(this.scene.quantumImmortality?.deathCount || 0),
      debtVignette: this.calculateDebtVignette(this.scene.voidExchange?.debt || 0),
      
      // Abilities
      abilities: this.calculateActiveAbilityGlyphs(),
      
      // Environmental
      boundaryPulse: this.currentBoundaryPulse || 0.5,
      enemyDensity: this.calculateEnemyDensityEffect(this.scene.enemies?.length || 0)
    };
  }

  /**
   * Calculate glyphs for all active abilities
   */
  calculateActiveAbilityGlyphs() {
    const glyphs = [];
    
    // Check various ability systems on scene
    if (this.scene.apertureProtocol) {
      glyphs.push(this.calculateAbilityGlyph(
        'aperture',
        this.scene.apertureProtocol.cooldown || 0,
        this.scene.apertureProtocol.maxCooldown || 5000
      ));
    }
    
    if (this.scene.temporalRewind) {
      glyphs.push(this.calculateAbilityGlyph(
        'temporalRewind',
        this.scene.temporalRewind.cooldown || 0,
        this.scene.temporalRewind.maxCooldown || 5000
      ));
    }
    
    return glyphs;
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.trailParticles) {
      this.trailParticles.destroy();
    }
    if (this.ringGraphics) {
      this.ringGraphics.destroy();
    }
    if (this.bgTintOverlay) {
      this.bgTintOverlay.destroy();
    }
    if (this.playerGlow) {
      this.playerGlow.destroy();
    }
  }
}
