/**
 * Level-Based System Unlock Configuration
 *
 * Each level introduces exactly ONE new system.
 * - Level 1: No systems (pure gameplay)
 * - Level 2+: One system per level
 * - Boss spawns at wave 5 of each level
 *
 * This creates a clear progression where players master each system
 * before encountering the next.
 */

export const WAVES_PER_LEVEL = 5;
export const MAX_LEVELS = 15; // 15 systems after level 1

export const TIERS = {
  CORE: 'core',
  FOUNDATION: 'foundation',
  ADAPTIVE: 'adaptive',
  STRATEGIC: 'strategic',
  META: 'meta',
  TRANSCENDENT: 'transcendent'
};

/**
 * Level unlock configuration.
 * Index 0 = Level 1 (no system - pure gameplay)
 * Index 1 = Level 2 (first system unlocks)
 * etc.
 */
export const LEVEL_UNLOCK_CONFIG = [
  // === LEVEL 1: PURE GAMEPLAY - No systems ===
  {
    level: 1,
    systemId: null,
    name: 'The Beginning',
    description: 'Pure survival. No tricks, no systems. Just you, the void, and the endless waves.',
    hint: 'Master movement and shooting before the void reveals its secrets.',
    color: 0xffffff
  },

  // === LEVEL 2: CORE - Echo Storm ===
  {
    level: 2,
    systemId: 'echoStorm',
    name: 'Echo Storm',
    tier: TIERS.CORE,
    description: 'During bullet time, graze enemy bullets to absorb their energy. When time resumes, unleash devastating homing counter-attacks.',
    hint: 'Graze bullets during slow-motion to charge your echo storm.',
    color: 0xffd700
  },

  // === LEVEL 3: CORE - Fracture Protocol ===
  {
    level: 3,
    systemId: 'fractureSystem',
    name: 'Fracture Protocol',
    tier: TIERS.CORE,
    description: 'Press [SHIFT] to fracture time - everything slows while you move at normal speed. Your ultimate defensive tool.',
    hint: 'Hold SHIFT to slow time and escape tight situations.',
    color: 0x00f0ff
  },

  // === LEVEL 4: CORE - Temporal Residue ===
  {
    level: 4,
    systemId: 'temporalResidue',
    name: 'Temporal Residue',
    tier: TIERS.CORE,
    description: 'Your movement leaves behind temporal trails. These residue clouds amplify damage to enemies who pass through them.',
    hint: 'Move through areas repeatedly to create damage zones.',
    color: 0x9d4edd
  },

  // === LEVEL 5: CORE - Resonance Cascade ===
  {
    level: 5,
    systemId: 'resonanceCascade',
    name: 'Resonance Cascade',
    tier: TIERS.CORE,
    description: 'Systems activate each other in chains. Watch for the cascade indicator - triggering it amplifies your next attack.',
    hint: 'Chain system activations for massive damage bonuses.',
    color: 0xff6b6b
  },

  // === LEVEL 6: FOUNDATION - Temporal Singularity ===
  {
    level: 6,
    systemId: 'singularitySystem',
    name: 'Temporal Singularity',
    tier: TIERS.FOUNDATION,
    description: 'Your position creates a gravity well that pulls enemies toward you. Strategic positioning becomes a weapon.',
    hint: 'Use positioning to herd enemies into clusters.',
    color: 0x4ecdc4
  },

  // === LEVEL 7: FOUNDATION - Omni-Weapon ===
  {
    level: 7,
    systemId: 'omniWeapon',
    name: 'Omni-Weapon',
    tier: TIERS.FOUNDATION,
    description: 'Your weapon adapts to your playstyle. Aggressive play increases fire rate; cautious play increases damage per shot.',
    hint: 'Your weapon evolves based on how you play.',
    color: 0xffe66d
  },

  // === LEVEL 8: FOUNDATION - Paradox Engine ===
  {
    level: 8,
    systemId: 'paradoxEngine',
    name: 'Paradox Engine',
    tier: TIERS.FOUNDATION,
    description: 'Create temporal paradoxes by returning to previous positions. The resulting explosion damages all enemies in the area.',
    hint: 'Loop back through your path to trigger paradox explosions.',
    color: 0xff6b6b
  },

  // === LEVEL 9: FOUNDATION - Chrono Loop ===
  {
    level: 9,
    systemId: 'chronoLoop',
    name: 'Chrono Loop',
    tier: TIERS.FOUNDATION,
    description: 'A temporal loop that tracks your actions. Complete the loop by repeating your path to trigger temporal echoes.',
    hint: 'Retrace your movements to complete time loops.',
    color: 0x00f0ff
  },

  // === LEVEL 10: FOUNDATION - Void Coherence ===
  {
    level: 10,
    systemId: 'voidCoherence',
    name: 'Void Coherence',
    tier: TIERS.FOUNDATION,
    description: 'Maintain stillness to charge the void. When fully coherent, your next shot pierces through all enemies.',
    hint: 'Stand still to charge piercing shots.',
    color: 0x4ecdc4
  },

  // === LEVEL 11: ADAPTIVE - Quantum Immortality ===
  {
    level: 11,
    systemId: 'quantumImmortality',
    name: 'Quantum Immortality',
    tier: TIERS.ADAPTIVE,
    description: 'Death is not the end. In quantum branches where you survive, echoes of yourself continue fighting.',
    hint: 'Even death has consequences - echoes persist across timelines.',
    color: 0xffe66d
  },

  // === LEVEL 12: ADAPTIVE - Observer Effect ===
  {
    level: 12,
    systemId: 'observerEffect',
    name: 'Observer Effect',
    tier: TIERS.ADAPTIVE,
    description: 'The game watches you back. It learns your patterns and adapts, but this also creates exploitable weaknesses.',
    hint: 'The void observes and adapts - change tactics frequently.',
    color: 0x9d4edd
  },

  // === LEVEL 13: ADAPTIVE - Causal Entanglement ===
  {
    level: 13,
    systemId: 'causalEntanglement',
    name: 'Causal Entanglement',
    tier: TIERS.ADAPTIVE,
    description: 'Enemies become quantum-entangled. Damage one, and its partner feels the pain regardless of distance.',
    hint: 'Find entangled pairs and exploit the connection.',
    color: 0xff6b6b
  },

  // === LEVEL 14: ADAPTIVE - Temporal Contract ===
  {
    level: 14,
    systemId: 'temporalContract',
    name: 'Temporal Contract',
    tier: TIERS.ADAPTIVE,
    description: 'Accept contracts that bind you to specific challenges. Fulfill them for powerful temporal rewards.',
    hint: 'Contracts offer risk and reward - choose wisely.',
    color: 0xffd700
  },

  // === LEVEL 15: ADAPTIVE - Symbiotic Prediction ===
  {
    level: 15,
    systemId: 'symbioticPrediction',
    name: 'Symbiotic Prediction',
    tier: TIERS.ADAPTIVE,
    description: 'The game predicts your movements and shows you where enemies will strike. Use this foresight to position perfectly.',
    hint: 'Watch the prediction lines - they show enemy intent.',
    color: 0x00f0ff
  },

  // === LEVEL 16: STRATEGIC - Dimensional Collapse ===
  {
    level: 16,
    systemId: 'dimensionalCollapse',
    name: 'Dimensional Collapse',
    tier: TIERS.STRATEGIC,
    description: 'Collapse multiple timelines into one point. The convergence releases tremendous destructive energy.',
    hint: 'Stack temporal effects for collapse events.',
    color: 0xff6b6b
  }
];

/**
 * Get the system configuration for a specific level.
 * @param {number} level - Level number (1-based)
 * @returns {object|null} System config or null if invalid level
 */
export function getLevelConfig(level) {
  if (level < 1 || level > LEVEL_UNLOCK_CONFIG.length) {
    return null;
  }
  return LEVEL_UNLOCK_CONFIG[level - 1];
}

/**
 * Get the system that unlocks at a specific level.
 * @param {number} level - Level number (1-based)
 * @returns {string|null} System ID or null for level 1
 */
export function getSystemForLevel(level) {
  const config = getLevelConfig(level);
  return config ? config.systemId : null;
}

/**
 * Get all systems that should be active at a given level.
 * Returns all systems from levels 2 through the given level.
 * @param {number} level - Current level (1-based)
 * @returns {string[]} Array of active system IDs
 */
export function getActiveSystemsForLevel(level) {
  const activeSystems = [];
  for (let i = 2; i <= level && i <= LEVEL_UNLOCK_CONFIG.length; i++) {
    const config = getLevelConfig(i);
    if (config && config.systemId) {
      activeSystems.push(config.systemId);
    }
  }
  return activeSystems;
}

/**
 * Check if a system should be active at a given level.
 * @param {string} systemId - System ID to check
 * @param {number} level - Current level (1-based)
 * @returns {boolean} True if system is active
 */
export function isSystemActiveAtLevel(systemId, level) {
  const activeSystems = getActiveSystemsForLevel(level);
  return activeSystems.includes(systemId);
}

/**
 * Get the level at which a system unlocks.
 * @param {string} systemId - System ID
 * @returns {number|null} Level number or null if not found
 */
export function getLevelForSystem(systemId) {
  const config = LEVEL_UNLOCK_CONFIG.find(cfg => cfg.systemId === systemId);
  return config ? config.level : null;
}

/**
 * Get total number of levels.
 * @returns {number} Total level count
 */
export function getTotalLevels() {
  return LEVEL_UNLOCK_CONFIG.length;
}
