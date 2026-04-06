/**
 * SystemUnlockConfig.js
 * 
 * Defines all game systems, their unlock conditions, and tier organization.
 * Core systems are always available; advanced systems unlock progressively.
 */

export const UNLOCK_TRIGGERS = {
    WAVE: 'wave',           // Unlock at specific wave threshold
    RUN: 'run',             // Unlock after N total runs  
    DEATH: 'death',         // Unlock after N deaths
    SCORE: 'score',         // Unlock at score milestone
    TIME: 'time',           // Unlock after N minutes of play
    MANUAL: 'manual'        // Always available (core systems)
};

export const SYSTEM_TIERS = {
    CORE: 'core',               // Always available (waves 1+)
    FOUNDATION: 'foundation',   // Early game (wave 2+)
    ADAPTIVE: 'adaptive',       // Mid game (wave 4+)
    STRATEGIC: 'strategic',     // Late game (wave 8+)
    META: 'meta'                // Meta-progression (wave 12+)
};

/**
 * System unlock configuration
 * 
 * Each system defines:
 * - id: System identifier (matches the property name in GameScene)
 * - className: Constructor name for dynamic instantiation
 * - tier: Which tier this belongs to (determines color/announcement style)
 * - trigger: What type of condition unlocks this
 * - value: Threshold value for the trigger
 * - description: Brief explanation shown on unlock
 * - hint: How to use the system
 * - color: UI color for this system
 * - requires: Prerequisites (system IDs that must be unlocked first)
 */
export const SYSTEM_UNLOCK_CONFIG = [
    // ===== CORE SYSTEMS (Always Available) =====
    {
        id: 'echoStorm',
        className: 'EchoStormSystem',
        tier: SYSTEM_TIERS.CORE,
        trigger: UNLOCK_TRIGGERS.MANUAL,
        value: 0,
        description: 'During bullet time, graze enemy bullets to build up a devastating echo barrage.',
        hint: 'Close calls charge your storm. When full, echoes fire with you.',
        color: 0xffd700,
        requires: []
    },
    {
        id: 'fractureSystem',
        className: 'FractureSystem',
        tier: SYSTEM_TIERS.CORE,
        trigger: UNLOCK_TRIGGERS.MANUAL,
        value: 0,
        description: 'Press [SHIFT] to fracture time itself. Move in slow-motion while planning your next move.',
        hint: 'Hold SHIFT to slow time. Your bullets still move fast.',
        color: 0x00f0ff,
        requires: []
    },
    {
        id: 'resonanceCascade',
        className: 'ResonanceCascadeSystem',
        tier: SYSTEM_TIERS.CORE,
        trigger: UNLOCK_TRIGGERS.MANUAL,
        value: 0,
        description: 'Systems speak to each other. Activating one may trigger others in unexpected ways.',
        hint: 'Watch for the resonance indicator. Chain reactions multiply damage.',
        color: 0x9d4edd,
        requires: []
    },
    {
        id: 'temporalResidue',
        className: 'TemporalResidueSystem',
        tier: SYSTEM_TIERS.CORE,
        trigger: UNLOCK_TRIGGERS.MANUAL,
        value: 0,
        description: 'Death leaves echoes. Defeated enemies become spectral nodes that pulse with temporal energy.',
        hint: 'Stand near residue nodes to absorb their energy.',
        color: 0x6b00ff,
        requires: []
    },

    // ===== FOUNDATION SYSTEMS (Wave 2+) =====
    {
        id: 'voidCoherence',
        className: 'VoidCoherenceSystem',
        tier: SYSTEM_TIERS.FOUNDATION,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 2,
        description: 'The void remembers. Your bullet trajectories leave quantum structures that amplify future shots.',
        hint: 'Shoot without hitting enemies to build coherence. Structures form automatically.',
        color: 0x6b00ff,
        requires: ['echoStorm']
    },
    {
        id: 'observerEffect',
        className: 'ObserverEffectSystem',
        tier: SYSTEM_TIERS.FOUNDATION,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 2,
        description: 'The game watches you back. It learns your patterns and adapts the world around you.',
        hint: 'Play differently than before. The observer notices and responds.',
        color: 0x9d4edd,
        requires: []
    },
    {
        id: 'chronoLoop',
        className: 'ChronoLoopSystem',
        tier: SYSTEM_TIERS.FOUNDATION,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 2,
        description: 'Your echoes can persist across runs. Past selves become allies in the present.',
        hint: 'Press [T] near an echo to record it. Future runs may encounter it.',
        color: 0x00d4ff,
        requires: ['echoStorm']
    },

    // ===== ADAPTIVE SYSTEMS (Wave 4+) =====
    {
        id: 'causalEntanglement',
        className: 'CausalEntanglementSystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 4,
        description: 'Link entities with quantum bonds. Damage to one echoes through the chain.',
        hint: 'Press [E] to enter entanglement mode. Select two targets to link them.',
        color: 0x00f0ff,
        requires: ['voidCoherence']
    },
    {
        id: 'temporalRewind',
        className: 'TemporalRewindSystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 4,
        description: 'Place temporal anchors with [R]. Return to them later, leaving afterimages as traps.',
        hint: 'Press R to place an anchor. Press R again near it to rewind. Afterimages damage enemies.',
        color: 0xffaa00,
        requires: []
    },
    {
        id: 'symbioticPrediction',
        className: 'SymbioticPredictionSystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 4,
        description: 'The game predicts your movement. Fulfill predictions for harmony, subvert them for chaos.',
        hint: 'Follow the cyan echoes for harmony bonuses. Ignore them for chaos power.',
        color: 0x00f0ff,
        requires: ['observerEffect']
    },
    {
        id: 'singularitySystem',
        className: 'TemporalSingularitySystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 5,
        description: 'Collapsing temporal structures creates singularities. Press [F] to detonate a zone.',
        hint: 'Build up temporal energy. Press F when the singularity is ready.',
        color: 0xff0066,
        requires: ['temporalResidue']
    },
    {
        id: 'quantumImmortality',
        className: 'QuantumImmortalitySystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 5,
        description: 'Death is not the end. Some timelines persist, allowing you to continue from echoes.',
        hint: 'When you die, look for quantum echoes. They may offer a second chance.',
        color: 0x9d4edd,
        requires: []
    },
    {
        id: 'mnemosyneWeave',
        className: 'MnemosyneWeaveSystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 6,
        description: 'The arena remembers. Your actions shape permanent geometric patterns.',
        hint: 'Move and fight. The weave records your patterns and responds to them.',
        color: 0x9d4edd,
        requires: []
    },

    // ===== STRATEGIC SYSTEMS (Wave 8+) =====
    {
        id: 'paradoxEngine',
        className: 'ParadoxEngineSystem',
        tier: SYSTEM_TIERS.STRATEGIC,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 8,
        description: 'See echoes from unrealized futures. Their paths reveal optimal strategies.',
        hint: 'Watch the paradox echoes. They show what could have been.',
        color: 0xff0066,
        requires: ['symbioticPrediction']
    },
    {
        id: 'dimensionalCollapse',
        className: 'DimensionalCollapseSystem',
        tier: SYSTEM_TIERS.STRATEGIC,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 8,
        description: 'The ultimate technique. Collapse all dimensions into a single point of pure potential.',
        hint: 'Build up all systems. When ready, press [F] to unleash dimensional collapse.',
        color: 0xffffff,
        requires: ['singularitySystem', 'causalEntanglement']
    },
    {
        id: 'omniWeapon',
        className: 'OmniWeaponSystem',
        tier: SYSTEM_TIERS.STRATEGIC,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 9,
        description: 'Your weapon adapts to your playstyle. It becomes what you need most.',
        hint: 'Play consistently. The weapon notices and transforms.',
        color: 0xffd700,
        requires: []
    },
    {
        id: 'bootstrapProtocol',
        className: 'BootstrapProtocolSystem',
        tier: SYSTEM_TIERS.STRATEGIC,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 10,
        description: 'Future echoes can influence the present. Receive guidance from your future selves.',
        hint: 'Listen to the whispers. Future-you knows things you don\'t.',
        color: 0x00d4ff,
        requires: ['quantumImmortality']
    },

    // ===== META SYSTEMS (Wave 12+) =====
    {
        id: 'cinematicArchive',
        className: 'CinematicArchiveSystem',
        tier: SYSTEM_TIERS.META,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 12,
        description: 'Epic moments are captured automatically. Build your legend across runs.',
        hint: 'Perform dramatic feats. The archive records them as memory shards.',
        color: 0xffd700,
        requires: []
    },
    {
        id: 'timelineChronicle',
        className: 'TimelineChronicleSystem',
        tier: SYSTEM_TIERS.META,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 12,
        description: 'Your runs become history. View statistics and patterns across all timelines.',
        hint: 'After each run, review the chronicle. Learn from past timelines.',
        color: 0x9d4edd,
        requires: []
    },
    {
        id: 'temporalContract',
        className: 'TemporalContractSystem',
        tier: SYSTEM_TIERS.META,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 14,
        description: 'Bind timelines together. Decisions in one run affect future runs.',
        hint: 'Make choices carefully. Contracts persist across realities.',
        color: 0xffaa00,
        requires: ['timelineChronicle']
    },
    {
        id: 'egregoreProtocol',
        className: 'EgregoreProtocolSystem',
        tier: SYSTEM_TIERS.META,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 15,
        description: 'The collective unconscious shapes reality. All players influence the same world.',
        hint: 'Your actions join the collective. The egregore evolves based on all players.',
        color: 0x6b00ff,
        requires: []
    },

    // ===== LATE-GAME SUPPORT SYSTEMS =====
    // These enhance existing systems rather than introducing new mechanics
    {
        id: 'kairosMoment',
        className: 'KairosMomentSystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 6,
        description: 'Perfect moments of flow are recognized and amplified.',
        hint: 'Achieve flow states. Kairos moments reward perfect play.',
        color: 0xffd700,
        requires: []
    },
    {
        id: 'syntropyEngine',
        className: 'SyntropyEngineSystem',
        tier: SYSTEM_TIERS.FOUNDATION,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 3,
        description: 'Order emerges from chaos. Your consistent play builds permanent bonuses.',
        hint: 'Play consistently. Syntropy rewards predictable excellence.',
        color: 0x00f0ff,
        requires: []
    },
    {
        id: 'resonantWhispers',
        className: 'ResonantWhisperSystem',
        tier: SYSTEM_TIERS.FOUNDATION,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 3,
        description: 'Whispers from other timelines offer guidance... or deception.',
        hint: 'Listen to the whispers. Some are helpful, others misleading.',
        color: 0x9d4edd,
        requires: []
    },
    {
        id: 'harmonicConvergence',
        className: 'HarmonicConvergenceSystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 5,
        description: 'Time-of-day affects the arena. The game responds to real-world cycles.',
        hint: 'Play at different times. Dawn, day, dusk, and night each bring unique effects.',
        color: 0x00f0ff,
        requires: []
    },
    {
        id: 'geometricChorus',
        className: 'GeometricChorusSystem',
        tier: SYSTEM_TIERS.ADAPTIVE,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 6,
        description: 'The arena itself becomes alive. Geometric regions form and evolve.',
        hint: 'Explore the arena. Regions offer bonuses to those who find them.',
        color: 0x00f0ff,
        requires: []
    },
    {
        id: 'architectSystem',
        className: 'ArchitectSystem',
        tier: SYSTEM_TIERS.STRATEGIC,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 9,
        description: 'Author your own mechanics. Define custom rules for your runs.',
        hint: 'Access the architect menu. Create custom challenges and modifiers.',
        color: 0xffd700,
        requires: []
    },
    {
        id: 'aethericConvergence',
        className: 'AethericConvergenceSystem',
        tier: SYSTEM_TIERS.STRATEGIC,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 10,
        description: 'The apotheosis of emergence. All systems synchronize into a transcendent whole.',
        hint: 'Activate multiple systems simultaneously. Watch for the convergence.',
        color: 0xffffff,
        requires: ['resonanceCascade', 'harmonicConvergence']
    },
    {
        id: 'synchronicityCascade',
        className: 'SynchronicityCascadeSystem',
        tier: SYSTEM_TIERS.META,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 12,
        description: 'Meaningful coincidences cascade. The universe aligns around your intent.',
        hint: 'Notice the patterns. Synchronicity rewards awareness.',
        color: 0xffd700,
        requires: []
    },
    {
        id: 'recursionEngine',
        className: 'RecursionEngineSystem',
        tier: SYSTEM_TIERS.META,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 13,
        description: 'The game that plays itself. Your strategies become autonomous agents.',
        hint: 'Build effective strategies. The recursion engine learns and replicates them.',
        color: 0x00f0ff,
        requires: []
    },
    {
        id: 'nemesisGenesis',
        className: 'NemesisGenesisSystem',
        tier: SYSTEM_TIERS.META,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 14,
        description: 'Your defeats spawn personalized adversaries. Each nemesis remembers.',
        hint: 'When you die, a nemesis may form. Defeat them before they grow stronger.',
        color: 0xff0066,
        requires: []
    },
    {
        id: 'oracleProtocol',
        className: 'OracleProtocolSystem',
        tier: SYSTEM_TIERS.STRATEGIC,
        trigger: UNLOCK_TRIGGERS.WAVE,
        value: 8,
        description: 'Glimpse unrealized futures. Oracles show what might have been.',
        hint: 'Follow oracular guidance... or defy it. Both have consequences.',
        color: 0x9d4edd,
        requires: ['paradoxEngine']
    }
];

/**
 * Get systems that should be active for a given game state
 */
export function getActiveSystemsForState(wave, totalRuns = 0, totalDeaths = 0, sessionTime = 0) {
    return SYSTEM_UNLOCK_CONFIG.filter(config => {
        // Check prerequisites first
        const prereqsMet = config.requires.every(reqId => {
            const reqConfig = SYSTEM_UNLOCK_CONFIG.find(c => c.id === reqId);
            if (!reqConfig) return false;
            return isSystemUnlocked(reqConfig, wave, totalRuns, totalDeaths, sessionTime);
        });
        
        if (!prereqsMet) return false;
        
        // Check unlock condition
        return isSystemUnlocked(config, wave, totalRuns, totalDeaths, sessionTime);
    }).map(config => config.id);
}

function isSystemUnlocked(config, wave, totalRuns, totalDeaths, sessionTime) {
    switch (config.trigger) {
        case UNLOCK_TRIGGERS.MANUAL:
            return true;
        case UNLOCK_TRIGGERS.WAVE:
            return wave >= config.value;
        case UNLOCK_TRIGGERS.RUN:
            return totalRuns >= config.value;
        case UNLOCK_TRIGGERS.DEATH:
            return totalDeaths >= config.value;
        case UNLOCK_TRIGGERS.TIME:
            return sessionTime >= (config.value * 60 * 1000); // minutes to ms
        default:
            return false;
    }
}

/**
 * Get system config by ID
 */
export function getSystemConfig(systemId) {
    return SYSTEM_UNLOCK_CONFIG.find(config => config.id === systemId);
}

/**
 * Get display color for a tier
 */
export function getTierColor(tier) {
    const colors = {
        [SYSTEM_TIERS.CORE]: 0x00f0ff,      // Cyan
        [SYSTEM_TIERS.FOUNDATION]: 0x9d4edd, // Purple
        [SYSTEM_TIERS.ADAPTIVE]: 0xffd700,   // Gold
        [SYSTEM_TIERS.STRATEGIC]: 0xff0066,  // Magenta
        [SYSTEM_TIERS.META]: 0xffffff         // White
    };
    return colors[tier] || 0xffffff;
}
