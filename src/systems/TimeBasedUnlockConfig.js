/**
 * Time-Based Unlock Configuration
 * 
 * Systems are introduced one at a time, every 3 minutes of gameplay.
 * This creates a much slower, more gradual learning curve.
 * 
 * Unlock schedule (assuming continuous play):
 * - Minute 3: First core system
 * - Minute 6: Second core system
 * - Minute 9: Third core system
 * - etc.
 */

export const UNLOCK_INTERVAL = 180000; // 3 minutes in milliseconds
export const WARNING_BEFORE_UNLOCK = 30000; // 30 seconds warning

export const TIERS = {
  CORE: 'core',
  FOUNDATION: 'foundation',
  ADAPTIVE: 'adaptive',
  STRATEGIC: 'strategic',
  META: 'meta',
  TRANSCENDENT: 'transcendent'
};

/**
 * All game systems ordered by recommended introduction time.
 * Each system unlocks 3 minutes after the previous one.
 */
export const TIME_BASED_UNLOCK_CONFIG = [
  // === CORE SYSTEMS (First 12 minutes) ===
  {
    id: 'echoStorm',
    name: 'Echo Storm',
    tier: TIERS.CORE,
    recommendedMinute: 3,
    description: 'During bullet time, graze enemy bullets to absorb their energy. When time resumes, unleash devastating homing counter-attacks.',
    hint: 'Graze bullets during slow-motion to charge your echo storm.',
    color: 0xffd700
  },
  {
    id: 'fractureSystem',
    name: 'Fracture Protocol',
    tier: TIERS.CORE,
    recommendedMinute: 6,
    description: 'Press [SHIFT] to fracture time - everything slows while you move at normal speed. Your ultimate defensive tool.',
    hint: 'Hold SHIFT to slow time and escape tight situations.',
    color: 0x00f0ff
  },
  {
    id: 'temporalResidue',
    name: 'Temporal Residue',
    tier: TIERS.CORE,
    recommendedMinute: 9,
    description: 'Your movement leaves behind temporal trails. These residue clouds amplify damage to enemies who pass through them.',
    hint: 'Move through areas repeatedly to create damage zones.',
    color: 0x9d4edd
  },
  {
    id: 'resonanceCascade',
    name: 'Resonance Cascade',
    tier: TIERS.CORE,
    recommendedMinute: 12,
    description: 'Systems activate each other in chains. Watch for the cascade indicator - triggering it amplifies your next attack.',
    hint: 'Chain system activations for massive damage bonuses.',
    color: 0xff6b6b
  },

  // === FOUNDATION SYSTEMS (Minutes 15-27) ===
  {
    id: 'singularitySystem',
    name: 'Temporal Singularity',
    tier: TIERS.FOUNDATION,
    recommendedMinute: 15,
    description: 'Your position creates a gravity well that pulls enemies toward you. Strategic positioning becomes a weapon.',
    hint: 'Use positioning to herd enemies into clusters.',
    color: 0x4ecdc4
  },
  {
    id: 'omniWeapon',
    name: 'Omni-Weapon',
    tier: TIERS.FOUNDATION,
    recommendedMinute: 18,
    description: 'Your weapon adapts to your playstyle. Aggressive play increases fire rate; cautious play increases damage per shot.',
    hint: 'Your weapon evolves based on how you play.',
    color: 0xffe66d
  },
  {
    id: 'paradoxEngine',
    name: 'Paradox Engine',
    tier: TIERS.FOUNDATION,
    recommendedMinute: 21,
    description: 'Create temporal paradoxes by returning to previous positions. The resulting explosion damages all enemies in the area.',
    hint: 'Loop back through your path to trigger paradox explosions.',
    color: 0xff6b6b
  },
  {
    id: 'chronoLoop',
    name: 'Chrono Loop',
    tier: TIERS.FOUNDATION,
    recommendedMinute: 24,
    description: 'A temporal loop that tracks your actions. Complete the loop by repeating your path to trigger temporal echoes.',
    hint: 'Retrace your movements to complete time loops.',
    color: 0x00f0ff
  },
  {
    id: 'voidCoherence',
    name: 'Void Coherence',
    tier: TIERS.FOUNDATION,
    recommendedMinute: 27,
    description: 'Maintain stillness to charge the void. When fully coherent, your next shot pierces through all enemies.',
    hint: 'Stand still to charge piercing shots.',
    color: 0x4ecdc4
  },

  // === ADAPTIVE SYSTEMS (Minutes 30-45) ===
  {
    id: 'quantumImmortality',
    name: 'Quantum Immortality',
    tier: TIERS.ADAPTIVE,
    recommendedMinute: 30,
    description: 'Death is not the end. In quantum branches where you survive, echoes of yourself continue fighting.',
    hint: 'Even death has consequences - echoes persist across timelines.',
    color: 0xffe66d
  },
  {
    id: 'observerEffect',
    name: 'Observer Effect',
    tier: TIERS.ADAPTIVE,
    recommendedMinute: 33,
    description: 'The game watches you back. It learns your patterns and adapts, but this also creates exploitable weaknesses.',
    hint: 'The void observes and adapts - change tactics frequently.',
    color: 0x9d4edd
  },
  {
    id: 'causalEntanglement',
    name: 'Causal Entanglement',
    tier: TIERS.ADAPTIVE,
    recommendedMinute: 36,
    description: 'Enemies become quantum-entangled. Damage one, and its partner feels the pain regardless of distance.',
    hint: 'Find entangled pairs and exploit the connection.',
    color: 0xff6b6b
  },
  {
    id: 'temporalContract',
    name: 'Temporal Contract',
    tier: TIERS.ADAPTIVE,
    recommendedMinute: 39,
    description: 'Accept contracts that bind you to specific challenges. Fulfill them for powerful temporal rewards.',
    hint: 'Contracts offer risk and reward - choose wisely.',
    color: 0xffd700
  },
  {
    id: 'symbioticPrediction',
    name: 'Symbiotic Prediction',
    tier: TIERS.ADAPTIVE,
    recommendedMinute: 42,
    description: 'The game predicts your movements and shows you where enemies will strike. Use this foresight to position perfectly.',
    hint: 'Watch the prediction lines - they show enemy intent.',
    color: 0x00f0ff
  },
  {
    id: 'dimensionalCollapse',
    name: 'Dimensional Collapse',
    tier: TIERS.ADAPTIVE,
    recommendedMinute: 45,
    description: 'Collapse multiple timelines into one point. The convergence releases tremendous destructive energy.',
    hint: 'Stack temporal effects for collapse events.',
    color: 0xff6b6b
  },

  // === STRATEGIC SYSTEMS (Minutes 48-66) ===
  {
    id: 'temporalRewind',
    name: 'Temporal Rewind',
    tier: TIERS.STRATEGIC,
    recommendedMinute: 48,
    description: 'Press [R] to rewind time. Return to safety, but know that the timeline you left still echoes forward.',
    hint: 'Press R to rewind - but your past self continues fighting.',
    color: 0x4ecdc4
  },
  {
    id: 'kairosMoment',
    name: 'Kairos Moment',
    tier: TIERS.STRATEGIC,
    recommendedMinute: 51,
    description: 'Perfect moments crystallize into kairos - time where your actions have multiplied effect.',
    hint: 'Flow states create kairos - moments of perfect action.',
    color: 0xffe66d
  },
  {
    id: 'mnemosyneWeave',
    name: 'Mnemosyne Weave',
    tier: TIERS.STRATEGIC,
    recommendedMinute: 54,
    description: 'Your history manifests in the arena. Echoes of past runs appear as monuments you can interact with.',
    hint: 'The arena remembers - your history becomes terrain.',
    color: 0x9d4edd
  },
  {
    id: 'syntropyEngine',
    name: 'Syntropy Engine',
    tier: TIERS.STRATEGIC,
    recommendedMinute: 57,
    description: 'Order from chaos. Every near-miss, every perfect dodge, feeds the engine that creates shields from entropy.',
    hint: 'Near-misses charge your defensive shields.',
    color: 0x4ecdc4
  },
  {
    id: 'nemesisGenesis',
    name: 'Nemesis Genesis',
    tier: TIERS.STRATEGIC,
    recommendedMinute: 60,
    description: 'From your failures, a nemesis is born. It embodies your weaknesses and grows with each encounter.',
    hint: 'Your nemesis learns from every fight. Adapt or perish.',
    color: 0xff6b6b
  },
  {
    id: 'oracleProtocol',
    name: 'Oracle Protocol',
    tier: TIERS.STRATEGIC,
    recommendedMinute: 63,
    description: 'Glimpse possible futures. These unrealized timelines show you what might happen - and give you time to prevent it.',
    hint: 'Watch for oracle warnings - they show incoming threats.',
    color: 0x00f0ff
  },
  {
    id: 'tesseractTitan',
    name: 'Tesseract Titan',
    tier: TIERS.STRATEGIC,
    recommendedMinute: 66,
    description: 'A geometric boss emerges. Its form shifts through dimensional states, requiring adaptive tactics.',
    hint: 'The boss transforms - watch its geometry for attack patterns.',
    color: 0x9d4edd
  },

  // === META SYSTEMS (Minutes 69-87) ===
  {
    id: 'resonantWhispers',
    name: 'Resonant Whispers',
    tier: TIERS.META,
    recommendedMinute: 69,
    description: 'Messages from other timelines reach you. These whispers contain hints, warnings, and fragments of strategies.',
    hint: 'Listen to the whispers - they carry wisdom from other runs.',
    color: 0xffe66d
  },
  {
    id: 'egregoreProtocol',
    name: 'Egregore Protocol',
    tier: TIERS.META,
    recommendedMinute: 72,
    description: 'The collective unconscious of all players shapes the void. Strange geometries emerge from shared dreams.',
    hint: 'The void dreams - and those dreams take form.',
    color: 0xff6b6b
  },
  {
    id: 'aethericConvergence',
    name: 'Aetheric Convergence',
    tier: TIERS.META,
    recommendedMinute: 75,
    description: 'All systems align. When every temporal mechanic activates simultaneously, reality itself becomes malleable.',
    hint: 'Activate multiple systems at once for convergence.',
    color: 0x9d4edd
  },
  {
    id: 'harmonicConvergence',
    name: 'Harmonic Convergence',
    tier: TIERS.META,
    recommendedMinute: 78,
    description: 'Combat becomes music. Near-misses trigger notes. System activations add layers. Fight in rhythm.',
    hint: 'Your actions create the soundtrack.',
    color: 0x00f0ff
  },
  {
    id: 'tychosAurora',
    name: "Tycho's Aurora",
    tier: TIERS.META,
    recommendedMinute: 81,
    description: 'Your playstyle creates visual auroras in the void. Different tactics produce different colors and patterns.',
    hint: 'How you play shapes what you see.',
    color: 0x9d4edd
  },
  {
    id: 'rivalProtocol',
    name: 'Rival Protocol',
    tier: TIERS.META,
    recommendedMinute: 84,
    description: 'An entity that mimics your best techniques. It learns from your victories and turns them against you.',
    hint: 'Your greatest strength becomes your rival.',
    color: 0xff6b6b
  },
  {
    id: 'synchronicityCascade',
    name: 'Synchronicity Cascade',
    tier: TIERS.META,
    recommendedMinute: 87,
    description: 'Activate 5+ systems simultaneously to trigger synchronicity - time dilates, power multiplies, all systems harmonize.',
    hint: 'The apotheosis of temporal mastery.',
    color: 0xffd700
  },

  // === TRANSCENDENT SYSTEMS (Minutes 90+) ===
  {
    id: 'recursionEngine',
    name: 'Recursion Engine',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 90,
    description: 'The game plays itself - and learns. Your strategies become its strategies; your victories, its training.',
    hint: 'The void learns from you - and uses your tactics against you.',
    color: 0x00f0ff
  },
  {
    id: 'geometricChorus',
    name: 'Geometric Chorus',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 93,
    description: 'The arena breathes. The walls respond. Space itself is alive and responds to your playstyle.',
    hint: 'The arena is alive - it feels your presence.',
    color: 0x4b0082
  },
  {
    id: 'architectSystem',
    name: 'Architect System',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 96,
    description: 'You become the designer. Modify the fundamental rules of the void to create your own challenges.',
    hint: 'You can now modify the game\'s fundamental parameters.',
    color: 0xffd700
  },
  {
    id: 'bootstrapProtocol',
    name: 'Bootstrap Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 99,
    description: 'Discover systems that should not exist yet. Retrocausal technology from futures that have not happened.',
    hint: 'Some systems exist before they are discovered.',
    color: 0xffe66d
  },
  {
    id: 'narrativeConvergence',
    name: 'Narrative Convergence',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 102,
    description: 'Your story becomes the game\'s story. Every run writes a new chapter in the saga of the void.',
    hint: 'Your journey becomes legend - and legends have power.',
    color: 0xff6b6b
  },
  {
    id: 'noeticMirror',
    name: 'Noetic Mirror',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 105,
    description: 'The game speaks to you. Commentary on your choices, observations on your style - a mirror that thinks.',
    hint: 'The void has opinions - it shares them freely.',
    color: 0x4ecdc4
  },
  {
    id: 'apertureProtocol',
    name: 'Aperture Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 108,
    description: 'Attention becomes mechanics. Where you look matters more than where you click - the void responds to perception.',
    hint: 'Your gaze has power - look with intention.',
    color: 0x00d4aa
  },
  {
    id: 'athenaeumProtocol',
    name: 'Athenaeum Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 111,
    description: 'The geography of memory. Regions of the arena correspond to different eras of your play history.',
    hint: 'Where you go carries meaning from your past.',
    color: 0x9d4edd
  },
  {
    id: 'synaesthesiaProtocol',
    name: 'Synaesthesia Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 114,
    description: 'Your actions create sound. Every shot, every dodge, every near-miss contributes to the combat symphony.',
    hint: 'You are the instrument - play accordingly.',
    color: 0x00f0ff
  },
  {
    id: 'inscriptionProtocol',
    name: 'Inscription Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 117,
    description: 'Transcendence through persistent memory. Your achievements become permanent features of the void.',
    hint: 'What you do matters forever.',
    color: 0xffd700
  },
  {
    id: 'resonanceOrb',
    name: 'Resonance Orb',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 120,
    description: 'Living power-ups that respond to your playstyle. Aggression creates attack orbs; caution creates shields.',
    hint: 'Your style shapes your tools.',
    color: 0xffe66d
  },
  {
    id: 'voidExchange',
    name: 'Void Exchange',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 123,
    description: 'Temporal capitalism. Trade your future for power now. Debt is power. Margin calls are death.',
    hint: 'Trade wisely - the void always collects.',
    color: 0xffd700
  },
  {
    id: 'apopheniaProtocol',
    name: 'Apophenia Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 126,
    description: 'Pattern divination. The void speaks in patterns - learn to read them and gain prophetic insight.',
    hint: 'Patterns are messages - learn the language.',
    color: 0x9d4edd
  },
  {
    id: 'metaSystemOperator',
    name: 'Meta-System Operator',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 129,
    description: 'Architectural ontology. You can now modify which systems are active and how they interact.',
    hint: 'You control the architecture itself.',
    color: 0x00f0ff
  },
  {
    id: 'livingWorld',
    name: 'Living World',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 132,
    description: 'Autonomous continuity. The arena exists when you are not there. Return to find it changed.',
    hint: 'The world lives on without you.',
    color: 0x4ecdc4
  },
  {
    id: 'dreamState',
    name: 'Dream State',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 135,
    description: 'Oneiric synthesis. Death sends you to a dream state where different rules apply. Dreams have rewards.',
    hint: 'Death is but a dream - and dreams have power.',
    color: 0x9d4edd
  },
  {
    id: 'sanctumProtocol',
    name: 'Sanctum Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 138,
    description: 'A persistent spatial sanctuary between runs. Walk through your accumulated legacy in the void.',
    hint: 'Between runs, you walk through memory.',
    color: 0x00f0ff
  },
  {
    id: 'cartographerProtocol',
    name: 'Cartographer Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 141,
    description: 'Spatial ontology. Your bullets sculpt the arena. Your movement reshapes space itself.',
    hint: 'You are the cartographer - draw carefully.',
    color: 0x00f0ff
  },
  {
    id: 'dissolutionProtocol',
    name: 'Dissolution Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 144,
    description: 'The art of intentional forgetting. Disable systems to gain focus. Less is more.',
    hint: 'Sometimes forgetting is wisdom.',
    color: 0x2d1f3d
  },
  {
    id: 'axiomNexus',
    name: 'Axiom Nexus',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 147,
    description: 'Pedagogical synthesis. The game becomes your mentor, adapting challenges to teach you mastery.',
    hint: 'The void teaches - if you are willing to learn.',
    color: 0xffe66d
  },
  {
    id: 'proteusProtocol',
    name: 'Proteus Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 150,
    description: 'The evolution of rules. The game itself evolves between sessions, adapting to all players.',
    hint: 'The rules themselves are alive.',
    color: 0x9d4edd
  },
  {
    id: 'heartflux',
    name: 'Heartflux Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 153,
    description: 'Biometric empathy. Your real-world heart rate affects the void. Calm brings clarity; stress brings power.',
    hint: 'Your heart shapes the game.',
    color: 0xff6b9d
  },
  {
    id: 'exogenesis',
    name: 'Exogenesis Protocol',
    tier: TIERS.TRANSCENDENT,
    recommendedMinute: 156,
    description: 'Reality manifestation. Time of day, weather, and season affect the void. The game mirrors reality.',
    hint: 'Reality and the void are one.',
    color: 0xffaa44
  }
];

/**
 * Get the next system that should unlock based on elapsed time
 */
export function getNextTimeBasedUnlock(elapsedMinutes, alreadyUnlockedIds) {
  const elapsedMs = elapsedMinutes * 60000;
  
  for (const system of TIME_BASED_UNLOCK_CONFIG) {
    const systemUnlockMs = system.recommendedMinute * 60000;
    
    // Check if enough time has passed
    if (elapsedMs >= systemUnlockMs) {
      // Check if not already unlocked
      if (!alreadyUnlockedIds.includes(system.id)) {
        return system;
      }
    } else {
      // Not enough time has passed for this or any subsequent system
      break;
    }
  }
  
  return null;
}

/**
 * Get recommended session duration to unlock N systems
 */
export function getRecommendedSessionTime(systemCount) {
  const total = TIME_BASED_UNLOCK_CONFIG.length;
  const desiredCount = Math.min(systemCount, total);
  return desiredCount * 3 * 60000; // N systems * 3 minutes * 60k ms
}

/**
 * Get total session time needed to unlock all systems
 */
export function getTotalTimeToUnlockAll() {
  return TIME_BASED_UNLOCK_CONFIG.length * 3 * 60000;
}

/**
 * Get unlock status for a specific minute
 */
export function getUnlockStatusAtMinute(minute, unlockedIds) {
  const elapsedMs = minute * 60000;
  const available = [];
  const pending = [];
  
  for (const system of TIME_BASED_UNLOCK_CONFIG) {
    const systemUnlockMs = system.recommendedMinute * 60000;
    const isUnlocked = unlockedIds.includes(system.id);
    
    if (isUnlocked) {
      available.push(system);
    } else if (elapsedMs >= systemUnlockMs) {
      available.push(system); // Should be unlocked but isn't yet
    } else {
      pending.push({
        ...system,
        minutesRemaining: Math.ceil((systemUnlockMs - elapsedMs) / 60000)
      });
    }
  }
  
  return { available, pending };
}
