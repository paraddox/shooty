# SHOOTY ▲

A minimalist top-down roguelike shooter. Clean geometry, neon accents, bullet hell chaos.

![Aesthetic: Dark void, geometric shapes, neon glows]

## Play

```bash
npm install
npm run dev
```

## Controls

| Input | Action |
|-------|--------|
| WASD | Move |
| Mouse | Aim |
| Click | Shoot |
| SHIFT | Fracture Protocol (when momentum full) |
| SPACE | Deploy/Detonate Singularity (when charged) |
| T | Chrono-Loop (record 4 seconds) |
| Q | Timeline Merge (with 3+ quantum echoes) |
| C | Chronos Covenant (contracts menu) |
| V | Void Resonance (at 85% coherence) |
| E | Causal Entanglement (quantum topology) |
| R | Temporal Rewind (place/activate anchors) |
| Y | Syntropy Radial (reshape reality) |
| M | Mnemosyne Trance (enter shard portals) |
| F | Dimensional Collapse (when all systems ready) |
| ENTER | Formalize Architect Discovery (when prompted) |
| Right Click | Paradox Engine (predict future) |
| X | Void Exchange (temporal futures market) |

## Visual Design

- **Background**: Deep void (#0a0a0f) with subtle procedural grid
- **Player**: Cyan triangle — precise, directional
- **Enemies**: Geometric hierarchy
  - 🔶 **Fast**: Orange triangle, speedy but fragile
  - 🔷 **Normal**: Red diamond, balanced threat  
  - ⬡ **Tank**: Purple hexagon, slow but durable
- **Bullets**: Bright yellow bars with particle trails
- **UI**: Monospace, minimal — score as raw numbers, single health bar

## Why This Scales to Bullet Hell

1. **Shape language**: Triangles = allies, diamonds/hexagons = threats — instant recognition
2. **High contrast**: Yellow bullets on dark void = readable at 100+ projectiles
3. **Particle feedback**: No UI clutter, damage communicated through hit flashes and death bursts
4. **Dynamic zoom**: Camera pulls back as enemy count increases
5. **Bullet trails**: Every projectile leaves a brief trail — essential for tracking dense patterns

## Systems

- **Wave-based spawning**: 30s waves, increasing difficulty
- **Enemy variety**: 3 types with distinct speeds/HP/damage/attack patterns
- **Enemy shooting**: All enemies fire projectiles with unique fire rates and ranges
- **Screen shake**: Impact feedback on damage
- **500-bullet pool**: Ready for bullet density

## ★ Near-Miss Bullet Time ★

The signature feature: when enemy bullets narrowly miss you, time slows to **25%** for cinematic dodge moments.

**How it works:**
- Bullets that pass within 65px but don't hit trigger "bullet time"
- Enemies and their projectiles slow down; you move at full speed
- Streak system: consecutive near-misses within 2.5 seconds extend duration
- Visual feedback: gold vignette pulse + floating text (DODGE → CLOSE! → NEAR MISS! → BULLET TIME!)
- Getting hit immediately ends bullet time and resets streak

**Why this matters:**
- Transforms near-hits into rewards instead of "almost damage"
- Makes every bullet pattern more engaging and cinematic
- Creates skill expression: intentionally grazing bullets for bullet time advantage
- Stacks with future systems (combos, abilities, upgrades)
- Zero UI complexity — pure visual/audio feedback

## ⚡ ECHO STORM ⚡

The evolution of bullet time: **absorb the danger, unleash the storm**.

When bullet time activates, enemy bullets transform into **echo echoes** — golden ghost trails that linger in slow motion. Graze these echoes during bullet time to absorb their energy. When time returns to normal, every absorbed echo fires back as a **homing counter-missile**.

**How it works:**
- During bullet time, bullets leave behind glowing gold echo trails
- Fly near echoes to absorb them (drag radius pulls them toward you)
- Counter shows absorbed echoes above your ship
- When bullet time ends: **ECHO STORM!** — all absorbed echoes become magenta homing missiles
- Absorb 8+ echoes for a bonus radial burst attack
- Get hit during bullet time = lose all absorbed echoes (high risk, high reward)

**Why this is revolutionary:**
- Transforms defensive dodging into **offensive setup** — the better you dodge, the harder you counter-attack
- Creates a risk/reward tension: stay in bullet time longer to absorb more, but risk getting hit
- Makes every bullet pattern an opportunity — dense patterns = more echoes = bigger storm
- Rewarding skill expression: intentionally seeking dense bullet hell for maximum echo absorption
- Spectacular visual payoff when the storm releases

## ⬡ FRACTURE PROTOCOL ⬡

The temporal momentum system: **split your timeline, control the chaos**.

Build momentum through movement, near-miss dodges, and enemy kills. At peak momentum, activate **FRACTURE** to split your timeline — a golden ghost copy of yourself continues your momentum while you gain full control. Both can shoot. Press **SHIFT** again to **RESOLVE** and collapse the timelines.

**How it works:**
- Momentum bar fills below health (cyan → gold when full)
- Move fast, dodge bullets, kill enemies to build momentum
- At 100% momentum, press **SHIFT** to activate FRACTURE
- Golden ghost continues your trajectory and auto-fires at enemies
- You control the real ship normally — both deal damage
- Press **SHIFT** again (or wait) to RESOLVE: ghost vanishes, damage becomes permanent
- Perfect fracture (no damage taken) = 250 bonus points
- Ghost can absorb bullets, protecting you during the fracture

**Why this transforms the game:**
- Transforms pure survival into **calculated aggression**
- Creates high-risk/high-reward moments: intentionally fracture into bullet density for double damage
- Mastery expression: perfect fractures become a skill showcase
- Spectacular visual moment when two ships fire simultaneously
- Natural escalation of the bullet time philosophy: from slowing danger → absorbing danger → becoming danger

## ⬡ RESONANCE CASCADE ⬡

The combo synthesis system: **chain mechanics, amplify power, unleash devastation**.

Chaining different temporal systems creates exponential rewards. Bullet Time → Echo Absorption → Fracture → Node Fire builds a cascading multiplier that boosts damage, extends durations, and culminates in a devastating **Cascade Break** when the chain ends.

**How it works:**
- Each unique system activation adds to your Resonance Chain (shown as floating symbols)
- Chain within 4 seconds (extends with chain length) to maintain the combo
- Every step increases your damage multiplier: ×1.5 → ×2.0 → ×2.5 → up to ×5.0
- Reach chain milestones to unlock **Resonance States**:
  - **HARMONIC** (2+ chain): 30% damage boost, cyan aura
  - **SYMPHONIC** (3+ chain): 60% damage boost, extended bullet time, gold aura
  - **TRANSCENDENT** (4+ chain): Double damage, auto-absorb nearby echoes, magenta aura
- Getting hit breaks your chain (high risk / high reward)
- When chain expires or breaks: **CASCADE BREAK** — shockwave damages all nearby enemies and converts their bullets to friendly fire

**Why this transforms everything:**
- Creates **emergent synergy** — all existing systems now interconnect
- Rewards mastery through **intentional sequencing** instead of random ability use
- Transforms defensive play into **offensive setup** with real mathematical payoff
- Every run becomes a unique "composition" based on your chain choices
- Spectacular visual payoff when high chains resolve into arena-clearing blasts
- Natural culmination of the game's philosophy: from managing danger → weaponizing danger → becoming an unstoppable force

## 🔫 OMNI-WEAPON ADAPTATION SYSTEM

The evolution of firepower: **your weapon adapts to your playstyle**.

Three mod slots evolve based on which temporal mechanics you use most. No menus, no choices — pure emergence from your gameplay patterns.

### Mod Slots

**BARREL** (firing pattern — red glow):
- **RAPID** (from bullet time grazes): 2× fire rate, lower damage per shot
- **PIERCING** (from fracture kills): Shots penetrate through enemies  
- **SPREAD** (from residue node proximity): Shotgun-style 3-pellet burst

**CHAMBER** (projectile behavior — gold glow):
- **EXPLOSIVE** (from singularity detonations): Rounds detonate on impact (AOE)
- **ELEMENTAL** (from high resonance chains): Cycles fire/frost/shock effects
- **PHASING** (from ghost bullet hits): Shots phase through enemies, then solidify for double damage

**LENS** (targeting/trajectory — cyan glow):
- **HOMING** (from echo absorptions): Mild tracking toward nearest enemy
- **RICOCHET** (from bullet time streaks): Bounces off arena bounds once
- **SPLIT** (from perfect fractures): Splits into 2 perpendicular shots after first hit

### Combinations = Emergent Effects

- **PIERCING + EXPLOSIVE + HOMING**: Drill through a line, explode at the end, homing fragments seek new targets
- **SPREAD + ELEMENTAL + RICOCHET**: 3 ricocheting elemental pellets = arena coverage
- **RAPID + PHASING + SPLIT**: High-speed phased rounds that split and hit twice each

### Why This Completes The Game

Every existing system now feeds into weapon evolution:
- Bullet time grazes → Rapid fire
- Echo absorptions → Homing shots
- Fracture kills → Piercing
- Perfect fractures → Split shots
- Residue nodes → Spread pattern
- Singularity detonations → Explosive rounds
- High resonance chains → Elemental effects
- Ghost bullet hits → Phasing rounds

Your playstyle literally **becomes** your weapon. Aggressive grazers get rapid-fire. Tactical fracture users get piercing. Echo farmers get homing. Every run creates a unique build through natural behavior.

## ⏱️ CHRONO-LOOP SYSTEM ⏱️

The ultimate temporal mastery: **record yourself, then fight alongside your past**.

Press **T** to start recording. For 4 seconds, every movement and shot is captured. When the recording ends, a **Past Echo** spawns — a teal translucent copy of yourself that replays exactly what you recorded. You now fight alongside yourself.

**Stack up to 3 echoes simultaneously.** Record a second loop while your first echo fights. Then a third. Soon you have a **squadron of temporal clones** all firing in the choreography you designed.

**Why this is revolutionary:**
- You become your own best ally — no other bullet hell does this
- Pre-plan devastating synchronized attacks: record yourself flanking, then flank together
- Echoes can tank bullets for you (they absorb hits like Fracture ghosts)
- Chains with all existing systems: echoes graze bullets during Echo Storm, spawn Residue nodes, even record their own Paradox projections
- Creates emergent "squad tactics" solo gameplay — set up crossfires, pincer movements, covering fire

**Synergies:**
- **Echo Storm**: Past Echoes graze and absorb gold echoes (double absorption)
- **Fracture**: Ghost player can record separate loops — up to 4 simultaneous timelines
- **Residue**: Echoes spawn their own purple nodes (temporal cascade)
- **Singularity**: Record deploying a singularity, watch past-you charge while present-you detonates
- **Paradox Engine**: Echo predictions show alongside yours — choreograph 3-player paradoxes
- **Resonance Cascade**: Each loop completion adds +2 chain levels instantly

## 🔭 THE OBSERVER EFFECT 🔭

**The game that watches you back.** The ultimate evolution of temporal gameplay: the game itself becomes an observer, learning from your behavior and evolving in response.

### The Quantum Observer

Every action you take is recorded and analyzed:
- **Movement patterns**: Do you circle-strafe or erratically dodge?
- **Temporal preferences**: Which systems do you favor? (Bullet time? Fracture? Chrono-Loop?)
- **Risk tolerance**: Do you graze bullets or avoid them completely?
- **Combat style**: Aggressive pursuit or tactical positioning?
- **Creativity**: Do you chain abilities or use them separately?

### Reality Mutations (0-100% Observed)

As the game observes you, the world **mutates**:

| Level | Mutation | Effect |
|-------|----------|--------|
| 10% | **Adaptive Bullets** | Enemy bullet patterns evolve to counter your dodging style |
| 25% | **Observer Echoes** | AI shadows spawn that mimic YOUR behavior and fight alongside you |
| 40% | **Adaptive Spawning** | Enemies spawn in your "weak spots" — where you tend to die |
| 55% | **Reality Glitch** | Visual distortions that intensify as the game "learns" |
| 70% | **Personality Boss** | A boss spawns using YOUR movement patterns and signature combos |
| 85% | **Quantum Arena** | The arena shifts colors and geometry based on your playstyle |
| 100% | **The Observer** | A massive entity manifests and **judges** your play — rewards creativity, punishes repetition |

### Observer Echoes

At 25% mutation, translucent cyan echoes spawn that:
- Mirror your aggression/caution levels
- Use similar movement patterns to you
- Fire at enemies to support you
- Spawn in locations where you've had near-misses

### The Observer God

At maximum mutation, a massive **Observer God** manifests at the arena edge:
- A giant cyan eye that **watches your every move**
- Periodically **judges** your performance
- Rewards **creative, diverse play** with bonus score orbs
- Punishes **repetitive patterns** by spawning challenging enemies
- Creates genuine tension: *the game is literally playing back at you*

### Why This Is Revolutionary

**No other game does this.** The Observer Effect:
- Transforms static difficulty into **dynamic, personalized challenge**
- Makes every playthrough **truly unique** — the game adapts to YOU
- Creates emergent psychology: players start "performing" for the observer
- Rewards experimentation and punishes rote memorization
- Completes the temporal ecosystem: from managing time → weaponizing time → **becoming observed through time**
- Makes the game feel **alive** and responsive to your personality

---

## 🌌 TESSERACT TITAN - The Geometric Overseer 🌌

The ultimate test of temporal mastery: **a 4D hypercube boss** that weaponizes the game's mechanics against you.

At Wave 5, the Tesseract Titan manifests at arena center — a massive rotating geometric entity that exists simultaneously across multiple faces. Each face is a separate health pool that must be destroyed in sequence. As the boss takes damage, it evolves through **four devastating phases**:

### The Four Phases

| Phase | Name | Attack Pattern |
|-------|------|----------------|
| **1** | Temporal Awakening | Bullets leave persistent "echoes" that fire again after delay |
| **2** | Fracture Protocol | Boss splits into 3 shadow clones that fire simultaneously |
| **3** | Paradox Cascade | Creates zones where bullets reverse direction |
| **4** | Chrono-Singularity | Rapid fire + arena-wide gravity pull toward the boss |

### Why This Is Revolutionary

- **The boss uses YOUR mechanics**: Temporal echoes, fracture clones, paradox fields — the Titan weaponizes the systems you've been mastering
- **Sequential destruction**: Unlike traditional bullet hell bosses with one health pool, you must shatter each of the 4 faces to win
- **Adaptive aggression**: Attack speed and bullet density scale with boss health
- **4D visualization**: The tesseract renders as a rotating hypercube projection — mesmerizing and menacing
- **Rewarding all systems**: The fight demands mastery of bullet time for dodging dense patterns, echo storm for counter-attacking, fracture for double damage windows, and resonance cascade for maximum DPS

### Victory Condition

Defeating the Tesseract Titan awards **10,000 bonus points** and is the ultimate demonstration of temporal mastery. The boss spawns at Wave 5 — survive long enough to face the Geometric Overseer.

## ⏳ CHRONOS COVENANT — Temporal Contract System ⏳

The ultimate temporal innovation: **binding contracts with your future self**.

The Chronos Covenant introduces genuine **cross-run causality** — a system where you can make deals with future versions of yourself that persist between game sessions. This transforms every run from an isolated attempt into a chapter of an ongoing temporal saga.

### How It Works

Press **C** to open the Chronos Covenant interface. Choose from 3 randomly-offered contracts each with:
- **Immediate reward**: Power granted now (health, damage, echoes, etc.)
- **Future obligation**: A goal you must achieve in your next run to fulfill the contract
- **Temporal debt**: Weighted obligation that carries forward if unfulfilled

### Contract Types

| Contract | Reward | Obligation | Debt |
|----------|--------|------------|------|
| **SURVIVAL PACT** | +50 HP | Survive 60 seconds | 1.0 |
| **DESTRUCTION OATH** | +25% damage | Kill 30 enemies | 1.2 |
| **MASTERY COVENANT** | 50% faster charge | Chain 5+ systems | 1.5 |
| **ECHO BARGAIN** | 2 starting echoes | Spawn 5 echoes | 0.8 |
| **TITAN VOW** | Boss health -25% | Defeat Tesseract Titan | 2.0 |
| **VOID PROMISE** | 50% void coherence | Reach 90% coherence | 1.3 |
| **PARADOX BINDING** | Paradox +1 multiplier | 3 perfect paradoxes | 1.4 |

### Cross-Run Persistence

When you accept a contract:
1. You receive the reward immediately
2. The obligation is recorded in the Timeline Chronicle
3. On your NEXT run, you must fulfill the obligation
4. Fulfill = 1000 bonus points + permanent debt reduction
5. Break = -500 points + penalty carries forward

### Why This Is Revolutionary

**No other game does this.** The Chronos Covenant:
- Creates **genuine causal loops across save files** — a true bootstrap paradox
- Binds multiple runs together into **temporal continuity**
- Makes every run matter for the **next** run — not just high scores
- Creates **risk/reward spanning the game-session boundary**
- Rewards long-term thinking: accept debt now, master the game, fulfill later
- The perfect complement to Timeline Shards: contracts are the obligations, shards are the rewards

### Temporal Debt System

Your total debt appears in the HUD as an indigo seal. High debt:
- Increases enemy scaling (they sense your temporal instability)
- But also increases potential rewards (higher risk = higher payoff)
- Can be managed through careful contract selection
- Creates emergent "debt runs" where you play specifically to fulfill obligations

---

## 🎭 NEMESIS GENESIS 🎭

**The Adversarial Mirror — The game learns your soul, then becomes it.**

After Wave 5, you face the Tesseract Titan — a geometric boss that weaponizes systems against you. But Wave 10 brings something far more personal: the **Nemesis**. An entity that has watched you, learned you, and now fights exactly like you do.

### How It Works

**Behavioral Profiling (Silent, Always Active):**
- Movement clustering: strafe vs. camp vs. aggressive approach
- Temporal preferences: which systems you use most (bullet time? fracture? paradox?)
- Risk signature: near-miss frequency, danger zone dwell time
- Weapon DNA: fire rate, spread vs. precision, range preferences
- Tactical rhythms: burst-dodge vs. smooth-flow patterns

**Nemesis Genesis (Wave 10):**
- Spawns at arena opposite from you
- Uses your movement patterns: strafes if you strafe, camps if you camp
- Wields corrupted versions of YOUR favorite temporal systems:
  - Your Echo Storm → Nemesis **Void Echoes** (bullets echo in reverse)
  - Your Fracture → Nemesis **Shadow Clones** (splits into 2-3 copies)
  - Your Paradox → Nemesis **Crimson Foresight** (predicts YOUR movement)
  - Your Residue → Nemesis **Tactical Mines** (places traps where you will be)

**The Mirror Battle:**
- Nemesis adapts in real-time: learns your current dodge patterns
- Uses your own tactics against you: if you corner-camp, it flank-pushes
- Generates new patterns based on your historical behavior
- Archetype determined by your playstyle: SENTINEL, DANCER, BERSERKER, SNIPER, or ADAPTIVE

### Shadow Gallery

Each defeated Nemesis becomes a "Shadow" — a persistent record of that battle:
- Stored across runs in the Timeline Chronicle
- Can be re-summoned for practice battles
- Evolves generations: each rematch is smarter, more like you
- Share nemesis seeds: fight other players' shadows (indirect multiplayer)

Generation 10 Nemesis unlocks **Ouroboros Protocol** — you and your Nemesis merge into a single entity, fighting together against endless waves. The ultimate synthesis of self-mastery.

### Why This Is Revolutionary

**No game has ever created a boss that IS the player.** The Nemesis:
- Uses **behavioral cloning** — not difficulty scaling, but identity mirroring
- Reveals your own weaknesses: "It predicts my dodges — am I too predictable?"
- Creates genuine **self-competition**: beating your Nemesis means beating your habits
- Evolves across runs: the 5th generation Nemesis knows 5 runs worth of your tricks
- Transforms the ultimate boss from "external threat" to "internal shadow"

### Archetypes

| Archetype | Playstyle | Nemesis Counter |
|-----------|-----------|-----------------|
| **SENTINEL** | Corner-camps, defensive | Flank-pushes, aggressive |
| **DANCER** | Circle-strafes, fluid | Mirror-matches, unpredictable |
| **BERSERKER** | Aggressive approach | Maintains distance, precision |
| **SNIPER** | Long-range, careful | Closes distance, rush-down |
| **ADAPTIVE** | Mixed, unpredictable | Highly reactive, learns fastest |

---

## 🔮 ORACLE PROTOCOL — Echoes from Unrealized Futures 🔮

**The ultimate temporal mystery: The game begins receiving messages from futures that haven't happened yet.**

The Oracle Protocol introduces **genuine retrocausality** — the future influencing the present. Every run, the Oracle generates 5-8 "Future Echoes" — fragments of possible futures: enemy patterns that don't exist yet, warnings about bullets not fired, promises of power-ups not spawned. These echoes exist in superposition until YOU observe them.

### The Three Echo Types

| Echo Type | Color | Description |
|-----------|-------|-------------|
| **PREMONITION** | Gold/Cyan gradient | Ghost outlines of enemies about to spawn (2-3 seconds ahead). Move close to "heed" (aggressive collapse) or far to "avoid" (defensive collapse) |
| **PROPHECY** | Deep Purple | Compass directions pulse where enemies will appear. Following grants "Fated" bonus (+50% score). Ignoring causes "Doom" (2× health enemies) |
| **VISION** | Iridescent shifting | Brief flashes showing a moment 5-10 seconds ahead. Shows probabilistic future — change your behavior to alter which vision becomes real |

### The Mechanic

When an echo activates:
1. Visual/audio cue announces its presence
2. You have 3-5 seconds to observe and respond
3. Your actions **COLLAPSE** the quantum future into reality
4. Result matches your response (echo fulfilled = reward, ignored = penalty)

### The Paradox

When you follow an echo's guidance, you don't just survive — you **CAUSE** the echo's future to manifest:
- The enemy that appears "as warned" exists BECAUSE you prepared for it
- The bullet you dodged "as shown" was fired BECAUSE you were in position to dodge it
- The vision you fulfilled became real BECAUSE you acted on it

This is **true bootstrap paradox gameplay**: cause and effect flow in both directions through time.

### Meta-Learning

Across runs, the Oracle learns which futures you tend to create:
- Aggressive players → more "Preparation Required" echoes
- Defensive players → more "Opportunity" echoes  
- Chaotic players → more "Warning" echoes
- Prophetic players (heed often) → echoes appear sooner, rewards increase

The Oracle becomes your personal narrator, sculpting possibilities around your nature.

### Why This Is Revolutionary

**No game has ever implemented retrocausal mechanics.** The Oracle Protocol:
- Creates **genuine time paradoxes** as core gameplay
- Makes the player the mechanism for **collapsing quantum futures**
- Rewards **engaging with possibility** rather than just reacting to reality
- Creates emergent narrative: "I caused the danger I was warned about"
- Completes the temporal ecosystem: Past → Present → Future (Player→Game) → Future (Game→Itself→Player)

---

## ⟲ BOOTSTRAP PROTOCOL ⟲

**The Retrocausal Discovery Engine** — The 36th dimension of temporal gameplay.

The Oracle Protocol shows you warnings about what enemies WILL do. The Bootstrap Protocol shows you **ghost fragments of things that already happened in your future** — and by avoiding them, you CAUSE the future you witnessed.

**This is the genuine Bootstrap Paradox as gameplay:** Effect precedes Cause. You experience the consequence before the choice, and the choice is motivated by having already experienced the consequence.

### How It Works

Every 12 seconds, the system generates **Future Echoes** — pale, translucent visions at locations where things WILL happen in 15 seconds:

| Echo Type | What You See | How To Fulfill |
|-----------|--------------|----------------|
| **Bullet Path** | Ghost bullets along a trajectory | Stay away from the predicted path |
| **Enemy Spawn** | Translucent enemy outline | Position nearby, ready to engage |
| **Danger Zone** | Red warning circle | Avoid the area completely |
| **Safe Corridor** | Cyan pathway | Move through the safe zone |

**The Bootstrap Paradox:**
1. You see ghost bullets passing through a spot (they don't exist yet)
2. You avoid that spot because of the vision
3. 15 seconds later, real enemies fire along the exact path you saw
4. Your avoidance CAUSED the bullets to be fired there — the AI adapts to fulfill the prophecy

**Fulfillment Rewards:**
- Each fulfilled prophecy: +25 Paradox Momentum, +1 Bootstrap Level
- Level 3+: Brief bullet time on fulfillment
- Level 5+: Retrocausal resonance damages nearby enemies
- Level 7+: "Bootstrap Singularity" — all active echoes become real
- Level 10: Maximum temporal mastery

### The Missing Cognitive Dimension

The game had:
- **Predictive (Player→Game)**: Paradox Engine — YOU predict bullets
- **Predictive (Game→Player)**: Symbiotic Prediction — game predicts YOU
- **Predictive (Game→Itself)**: Oracle Protocol — game predicts enemies

**Missing**: **RETROCAUSAL (Effect→Cause)** — experiencing consequences before choices

The Bootstrap Protocol fills this gap. Where Oracle warns you about external events, Bootstrap shows you the **direct results of your own future actions** — and your reactions to those visions create the very timeline you saw.

### Visual Language

- **Bootstrap Amber** (#ffaa00) — warm golden-orange paradox energy
- Ghost echoes pulse and breathe, fading as their fulfillment time approaches
- "BOOTSTRAP PARADOX" text appears when you fulfill a prophecy
- Paradox momentum ring (top-right UI) shows your temporal mastery level

### Why This Is Revolutionary

1. **Genuine time paradox gameplay** — Not prediction, but retrocausality
2. **Effect precedes cause** — You dodge bullets that don't exist yet
3. **Self-fulfilling prophecies** — Your reactions to visions create the timeline
4. **Philosophical alignment** — Actual bootstrap paradox from theoretical physics
5. **Complete temporal ecosystem** — Past, Present, Future, AND Paradox dimensions covered

---

## 🏗️ THE ARCHITECT SYSTEM — Player Authorship 🏗️

**The ultimate evolution: Players become game designers.**

The Architect System is the 32nd temporal mechanic and represents a paradigm shift in game design. Instead of developers creating all content, **players invent new temporal mechanics** by naturally combining existing systems in unprecedented ways. The game detects these innovations, formalizes them into new named mechanics, and shares them with the community.

### How It Works

**1. DISCOVERY (Detection)**
- As you play, the Architect monitors system interactions
- When you combine 2+ systems in a novel way, it calculates "novelty score"
- Novelty > 0.85 triggers a Discovery Event

**2. FORMALIZATION (Creation)**
- The game generates a new mechanic from your combination
- Creates visual signature, assigns procedural name
- You can accept the name or suggest your own

**3. COMMONS (Sharing)**
- Your discovery enters the Temporal Commons
- Other players can encounter and use your invention
- Your name appears as credit: "ECHO FRACTURE by PlayerName"

### Example Player Discoveries

| Discovery | Combination | Effect |
|-----------|-------------|--------|
| **ECHO FRACTURE** | Echo Storm + Fracture | Absorb echoes during fracture for burst damage on resolve |
| **QUANTUM RESIDUE** | Quantum + Residue | Death echoes carry temporal residue nodes |
| **PROPHETIC PARADOX** | Bootstrap + Paradox | Fulfilling prophecy auto-triggers paradox projection |

### The Architect Ranks

| Rank | Discoveries | Privileges |
|------|-------------|------------|
| **NOVICE** | 1+ | Basic naming, commons access |
| **JOURNEYMAN** | 5+ | Custom descriptions, tuning hints |
| **MASTER** | 10+ | Visual design input, priority listing |
| **GRAND ARCHITECT** | 20+ | Propose new base system categories |

### The Temporal Commons

Browse all player-discovered mechanics:
- Sort by: popularity, novelty, architect, systems involved
- Equip up to 3 Discovered Mechanics per run
- Community "Elevation" voting for exceptional discoveries

### Why This Is Revolutionary

1. **Genuine player authorship** — Not modding, not suggestions, but genuine creation
2. **Emergent design** — The community collectively expands the game beyond developer imagination
3. **Perpetual novelty** — As long as players find new combinations, the game grows
4. **Creative partnership** — Developers built the first 31 systems; players build everything beyond
5. **No other game does this** — True player-driven mechanic invention, formalized and shared

### The Missing Dimension: AUTHORSHIP

All previous 31 systems covered cognitive dimensions of PLAY. The Architect System adds the dimension of **CREATION**:

| Dimension | System | What It Enables |
|-----------|--------|-----------------|
| **Authorship** | **Architect** | **Players create the game itself** |
| **Meaning** | **Saga Engine** | **Gameplay becomes personal mythology** |

---

## 📖 THE SAGA ENGINE — NarrativeConvergenceSystem 📖

**The ultimate synthesis: Your gameplay becomes a legendary epic.**

The Saga Engine transforms 32 isolated temporal mechanics into a coherent, emergent personal mythology. Each run becomes a **chapter** in your temporal saga. System combinations generate **unique myths**. Enemies become **recurring characters** with history against you.

### How It Works

**CHAPTER GENERATION:**
- Each run becomes a mythic chapter with procedurally-generated title
- "The Echo Fracture of Kael" — "Through Time and Chaos" — "The Seventh Trial"
- Chapters are organized into Volumes (I: The Awakening, II: The Deepening, III: The Transcendence)

**CHARACTER SYSTEM:**
- Fast triangles become "The Swift Legion" with grudges
- Diamond enemies become "The Crimson Order" with history
- The Titan becomes "The Geometric Overseer" — a recurring nemesis
- Enemies remember wounds you dealt, building narrative tension

**ARCHETYPE DISCOVERY:**
Based on playstyle, you embody different mythic figures:
- **THE DANCER** — Grace under fire, mastered near-miss bullet time
- **THE ARCHITECT** — System combiner, builder of cascading destruction
- **THE SURVIVOR** — Deathless persistence, the refusal to fall
- **THE PROPHET** — Seer of futures, walker of paradox paths
- **THE CHRONICLER** — Memory-keeper, curator of temporal shards

**EPITHETS:**
Earn narrative titles through accomplishments:
- "Kael the Untouchable" (20 near-misses)
- "The System-Binder" (used 10+ systems)
- "The Enduring" (3+ minute survival)

**THE CODEX TEMPORALIS:**
Persistent library of your mythology across all runs. Browse your saga. Relive legendary moments. Watch your legend grow from novice to mythic.

### Why This Is Revolutionary

**No other game generates genuine personal mythology from gameplay.** The Saga Engine:
- Transforms mechanical skill into **narrative meaning**
- Creates **emergent stories** without scripted content
- Makes every run feel like **part of an epic tale**
- Generates **unique player identity** through archetype analysis
- Completes the temporal ecosystem with the final dimension: **MEANING**

---

## 🎵 SYNAESTHESIA PROTOCOL — The 42nd Dimension: AUDITORY SYNTHESIS 🎵

**The ultimate synthesis: Gameplay becomes music, music becomes gameplay.**

The Synaesthesia Protocol is not "background music" or even "adaptive audio." This is genuine **BIDIRECTIONAL COUPLING** between the auditory and ludic dimensions — the game creates sound from your actions, and the sound shapes the gameplay experience.

### The Sonic-Gameplay Matrix

| Gameplay Element | Sonic Signature |
|-----------------|-----------------|
| Player movement | Pitch-shifted triangle wave |
| Bullet fired | Short exponential decay ping |
| Near-miss bullet time | Time-stretched pad swell |
| Echo absorbed | Granular synthesis sparkle |
| Fracture activation | Dual stereo detuned saw |
| Resonance chain | Arpeggiator acceleration |
| Singularity deploy | Low-frequency gravitational drone |
| Paradox projection | Reversed reverb trail |
| Enemy hit | Short impact |
| Enemy death | Satisfaction chord |
| Wave transition | Cymbal swell + sub drop |
| Game over | Final resolving chord |

### Generative Music Engine

Audio is synthesized in real-time using Web Audio API:
- **FM synthesis** for melodic elements
- **Subtractive synthesis** for bass and gravity effects
- **Granular synthesis** for texture and echoes
- **Physical modeling** for percussion
- **128 BPM tempo** locked to gameplay rhythms

The generative algorithm follows a "narrative arc":
- **Intro**: Sparse, establishing mood from time-of-day
- **Build**: Layering as systems activate
- **Climax**: Full density during boss encounters
- **Resolution**: Gradual return during quiet moments
- **Coda**: End-of-run summary based on performance

### The 42nd Dimension

All 41 previous systems exist in the visual-ludic domain. The Synaesthesia Protocol adds the **AUDITORY** dimension and then **FUSES** them:

**Visual + Ludic + Auditory = SYNTHESIS**

The game is no longer just played or watched — it is **HEARD**, and in hearing, the player becomes composer, performer, and instrument simultaneously.

### Why This Is Revolutionary

1. **True synesthesia**: The game stimulates cross-modal perception
2. **Generative music**: Every run produces a unique, professional-quality track
3. **Audio as information**: Expert players "read" the soundscape tactically
4. **Performance art**: Skilled play produces beautiful music automatically
5. **The 42nd dimension**: Completes the cognitive architecture
6. **No other game**: Has this level of bidirectional audio-gameplay coupling

---

## 🔮 RESONANCE ORB SYSTEM — The 48th Dimension: LIVING POWER-UPS 🔮

**Power-ups that feed into existing systems instead of isolated bonuses.**

The Resonance Orb System transforms traditional power-ups into **living temporal surges** that cascade through the existing 43+ dimensional systems. Instead of static bonuses, these orbs temporarily amplify and interconnect your abilities in unique ways.

### The 7 Orb Types

| Orb | Color | Effect | Duration |
|-----|-------|--------|----------|
| **CHRONO** | Cyan | +50% bullet time, 2x Fracture charge, -30% Chrono-Loop CD | 8s |
| **ECHO** | Gold | Auto-absorb echoes in 100px, +75% Echo Storm damage | 6s |
| **CASCADE** | Magenta | +2 chain levels, chain break protection, +3s window | 10s |
| **PARADOX** | Iridescent | Perfect predictions, auto-trigger paradox on near-miss, -50% CD | 5s |
| **VOID** | Deep Purple | Rapid coherence to 100%, unlock "Void Bloom" aura, omni-directional Syntropy | 7s |
| **SINGULARITY** | Black/White Halo | Instant max charge, +50% radius, enemy bullets 25% speed in gravity | Instant |
| **QUANTUM** | Rainbow | ALL orb effects simultaneously, brief invincibility | 4s |

### Drop Mechanics

- **15% base chance** on enemy death (scales up to 40% with combo length)
- **50% chance** on boss phase transitions (guaranteed drop for rare+ orbs)
- **Guaranteed** on perfect Fracture resolution
- **Guaranteed** on reaching 5+ Resonance Chain

### Collection Mechanics

- Orbs drift toward player within 150px (temporal magnetism)
- Unclaimed orbs fade after 8 seconds (temporal decay creates urgency)
- Collecting during matching system = 25% bonus duration
- Multiple orbs create **Superposition Bonuses**:
  - **2 orbs**: +25% duration to both
  - **3 orbs**: "Resonance Harmony" — all damage +30%
  - **4+ orbs**: Brief invincibility pulse

### Why This Is Revolutionary

1. **Zero isolated mechanics** — Every orb feeds INTO existing systems
2. **Meaningful tactical choice** — Players prioritize based on build/playstyle
3. **Spatial pressure** — Drift + fade creates genuine risk/reward decisions
4. **Mastery amplification** — Better players maintain more simultaneous orbs
5. **Visual spectacle** — Superposition states create stunning visual moments
6. **Complements all 43 systems** — Adds power-ups without complexity debt

### Integration Examples

- **Chrono + Echo**: Extended bullet time with massive echo auto-absorption = devastating Echo Storms
- **Cascade + Paradox**: High chain maintenance with perfect predictions = transcendence state farming
- **Void + Singularity**: Gravity well with damage aura + slowed enemy bullets = total zone control
- **Quantum Superposition**: All effects + invincibility = ultimate temporal apotheosis moment

---

## 🌍 THE LIVING WORLD PROTOCOL — The 51st Dimension: AUTONOMOUS CONTINUITY 🌍

**The game that lives even when you don't play it.**

The Living World Protocol shatters the boundary between "game session" and "real life." When you close the browser tab, the simulation continues — enemies evolve, factions wage wars, territories shift, and history accumulates. Your return is an event. The world has changed.

### The Three Pillars of Continuity

**PILLAR 1: THE BIOLOGICAL LAYER**
- **Hunger**: Enemies must consume echoes (destroyed bullets) to survive
- **Territory**: Each enemy claims space; trespassing triggers conflict
- **Reproduction**: Well-fed enemies spawn offspring with inherited traits
- **Mutation**: Offspring have slight variations (speed, aggression, color)
- **Death**: Starvation, combat, age — enemies genuinely die

**PILLAR 2: THE SOCIAL LAYER**
- **Faction Formation**: Same-type enemies ally; different types may war
- **Hierarchy**: Strongest enemies become leaders, directing faction behavior
- **Diplomacy**: Factions negotiate borders, form alliances against threats
- **Betrayal**: Weaker factions may switch sides mid-conflict
- **Culture**: Each faction develops "customs" (patrol routes, sentry posts)

**PILLAR 3: THE HISTORICAL LAYER**
- **Battle Scars**: Persistent damage to the arena (craters, scorch marks)
- **Memorials**: Factions mark dead leaders with shrines
- **Lineage Trees**: Track enemy families across generations
- **Epoch Events**: Major shifts (extinctions, revolutions, migrations)
- **Player Ghost**: Your past actions echo in faction attitudes toward you

### The Background Simulation

When the game tab is hidden or browser closed:
- Service Worker continues simulation at accelerated rate (100x real-time)
- Physics simplified to cellular automaton rules
- Key events logged: battles, births, deaths, territorial shifts
- Player receives **"World Report"** on return summarizing what happened

### The Return Experience

Coming back to the game after absence:
1. **"While you were away..."** cinematic showing key events
2. The world visibly changed: new faction territories, evolved enemies
3. Factions remember you: allies greet, enemies prepare ambushes
4. New **"epoch enemies"** — descendants of survivors, visibly evolved
5. Emergent quests: Factions request help, offer rewards

### Visual Language

- **Faction territories**: Subtle color tints in world regions (Orange: Swift Legion, Red: Crimson Order, Purple: Void Keepers)
- **Leader auras**: Distinctive glows marking faction heads
- **Battle scars**: Persistent crater sprites, scorch marks
- **Lineage markers**: Enemies show generational number (I, II, III...)
- **Shrines**: Geometric memorials to dead faction leaders

### Ecological Balance

The system self-regulates through:
- **Predator-Prey dynamics**: Fast enemies hunt, tank enemies defend
- **Resource scarcity**: Limited echoes force competition
- **Carrying capacity**: World supports ~50 autonomous enemies maximum
- **Player as disruption**: Your return is an ecological catastrophe/event

### Why This Is Revolutionary

**No other game truly lives when you stop playing.** The Living World Protocol:
- Creates **genuine continuity** across real-world time
- Makes **absence meaningful** — the world changes whether you witness it or not
- Generates **emergent history** through autonomous agent interactions
- Transforms **every return into discovery** — what happened while you were gone?
- Creates **genuine attachment** — you care about factions, lineages, territories
- Completes the temporal architecture: Past → Present → Future → **Absence**

### The Missing Dimension: CONTINUITY

All 50 previous systems focused on PLAYER PRESENCE. The Living World Protocol adds PLAYER ABSENCE:

| Dimension | System | What It Covers |
|-----------|--------|----------------|
| Past | Timeline Chronicle | What happened |
| Present | All gameplay systems | What is happening |
| Future | Oracle Protocol | What will happen |
| **Absence** | **Living World** | **What happens without you** |

The game is now a genuine **world**, not just a toy. It lives. It breathes. It waits. And it remembers.

---

## 💹 VOID EXCHANGE — The 54th Dimension: TEMPORAL CAPITALISM 💹

**The ultimate evolution: The game becomes a market where you trade your future for power now.**

The Void Exchange System introduces genuine **economic gameplay** to the temporal ecosystem. Unlike other systems that manipulate time, space, or perception, this system manipulates **value itself** — creating a futures market where survival, score, and ability become tradeable commodities.

### The Trading Floor

Press **X** to open the Void Exchange. Four temporal commodities trade in real-time:

| Commodity | Name | What You Trade | Price Volatility |
|-----------|------|----------------|------------------|
| **SCORE** | Futures Contract | Future points for immediate damage boost | Medium |
| **SURVIVAL** | Life Bond | Seconds of survival for health/shield | High |
| **ABILITY** | Power Derivative | System charges for instant ability power | High |
| **WAVE** | Wave Advancement | Progress speed for score multiplier | Low |

### How Trading Works

**BUY (Go Long)**: Promise future potential now, receive immediate power
- Buy Score Futures → Immediate damage boost
- Buy Survival Bonds → Health or temporal shield
- Buy Ability Derivatives → Charge all systems
- Buy Wave Advancement → Score boost + faster spawns

**SELL (Short)**: Borrow power now, pay back with interest
- Short Score → Get capital now, lose score later
- Short Survival → Get shield now, debt accrues
- Higher risk but immediate liquidity

### Market Dynamics

The exchange simulates real market conditions:

- **Volatility**: Prices fluctuate every second based on game state
- **Liquidity**: Market depth changes with your debt level
- **Panic**: High waves increase volatility
- **Margin Calls**: Too much debt triggers forced liquidation (damage penalty)

### The Exchange Shop

Spend accumulated **Temporal Capital (TC)** on:

| Item | Cost | Effect |
|------|------|--------|
| **Divine Intervention** | 500 TC | Full heal |
| **Temporary Godhood** | 1000 TC | 10-second invincibility |
| **Casino Royale** | 250 TC | Random power (risk/reward) |
| **Debt Jubilee** | 800 TC | Clear all debt |
| **Insider Trading** | 350 TC | Price prediction (see future prices) |
| **Bailout** | 600 TC | Reset market, stabilize prices |

### Contracts & Maturity

Every trade creates a **contract**:
- 30-second maturity window
- Fulfill on time → Bonus temporal capital
- Default → Reputation loss, market penalties
- Contracts auto-deduct from score on maturity

### Market Events

Random economic events shake the market:
- **BULL RUN**: All prices rise (good for sellers)
- **MARKET CRASH**: All prices fall (good for buyers)
- **TEMPORAL BUBBLE**: Extreme volatility
- **LIQUIDITY CRISIS**: Limited trading capacity
- **GOLDEN OPPORTUNITY**: One item heavily discounted

### Why This Is Revolutionary

1. **Economic gameplay**: First bullet hell with genuine market mechanics
2. **Strategic depth**: Every trade is a risk/reward decision
3. **Integration**: All 53 previous systems feed into the economy
4. **Emergent stories**: "I mortgaged my future to survive that wave"
5. **Genuine capitalism**: Debt, interest, margin calls, bankruptcy
6. **The 54th dimension**: VALUE — the game now has an economy

### The Missing Dimension: CAPITAL

| Dimension | System | What It Covers |
|-----------|--------|----------------|
| Past | Timeline Chronicle | What happened |
| Present | All gameplay systems | What is happening |
| Future | Oracle Protocol | What will happen |
| Absence | Living World | What happens without you |
| **Value** | **Void Exchange** | **What your time is worth** |

The game is now a market. Your survival has a price. Your death is a transaction. Time is money.

---

## Roadmap

- [x] Near-miss bullet time system
- [x] Enemy projectile attacks
- [x] **ECHO STORM: Temporal Echo Absorption System** ⚡
- [x] **FRACTURE PROTOCOL: Temporal Momentum System** ⬡
- [x] **RESONANCE CASCADE: Combo Synthesis System** ⬡
- [x] **OMNI-WEAPON: Modular Fire Control** 🔫
- [x] **PARADOX ENGINE: Predictive Causality** 🔮
- [x] **CHRONO-LOOP: Temporal Recursion** ⏱️
- [x] **QUANTUM IMMORTALITY: Death as Resource** ♾️
- [x] **THE OBSERVER EFFECT: The Game That Watches Back** 🔭
- [x] **TESSERACT TITAN: The 4D Geometric Overseer** 🌌
- [x] **CHRONOS COVENANT: Cross-Run Contracts** ⏳
- [x] **NEMESIS GENESIS: The Adversarial Mirror** 🎭
- [x] **ORACLE PROTOCOL: Echoes from Unrealized Futures** 🔮
- [x] **BOOTSTRAP PROTOCOL: Retrocausal Discovery Engine** ⟲
- [x] **ARCHITECT SYSTEM: Player-Authored Mechanics** 🏗️
- [x] **SAGA ENGINE: Emergent Personal Mythology** 📖
- [x] **SYNAESTHESIA PROTOCOL: The 42nd Dimension — Auditory Synthesis** 🎵
- [x] **RESONANCE ORB SYSTEM: The 48th Dimension — Living Power-Ups** 🔮
- [x] **LIVING WORLD PROTOCOL: The 51st Dimension — Autonomous Continuity** 🌍
- [x] **VOID EXCHANGE: The 54th Dimension — Temporal Capitalism** 💹
- [ ] Persistent high scores
