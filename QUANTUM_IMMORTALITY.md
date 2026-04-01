# Quantum Immortality System — Implementation Summary

## Overview
The **Quantum Immortality System** is the 10th temporal mechanic added to the shooty bullet-hell game, based on the quantum suicide thought experiment. Instead of dying, the player "branches" into parallel universes — every death creates a permanent **Quantum Echo** that continues fighting, while the player respawns instantly.

## Core Mechanics

### 1. Death Branching (Automatic)
When the player would die (health ≤ 0):
- The timeline splits instead of triggering game over
- A **Quantum Echo** (gold-white ghost) spawns at the death location
- The echo continues the death trajectory, firing at enemies for 8 seconds
- Player respawns at a safe position with full health and 1-second invulnerability
- Nearby enemy bullets are cleared to give breathing room

### 2. Entropy Accumulation (Risk/Reward)
Each death increases **Timeline Entropy** (0-100 scale):
- **Enemy effects** (negative): Faster spawns, more damage
- **Echo effects** (positive): Echoes deal more damage, last longer
- Creates strategic tension: dying makes game harder AND boosts your ghost army
- Entropy decays slowly over time

### 3. Timeline Merge (Press Q)
When you have 3+ echoes active:
- Press **Q** to activate **Timeline Merge**
- All echoes become fully controllable for 5 seconds
- Creates coordinated "death blossom" attack patterns
- After merge: all echoes dissipate, entropy partially resets
- 8-second cooldown before next merge

### 4. Sentient Echoes (5-7% chance)
Occasionally an echo gains "consciousness":
- Actively seeks enemies and dodges bullets
- Lasts 2x longer than normal echoes
- Visual indicator: cyan sparkle effect

## Visual Design
- **Color**: White (#ffffff) → Gold (#ffd700) gradient
- **Echoes**: Translucent white triangles with gold glow
- **Merge**: Magenta (#ff00ff) connections between player and echoes
- **UI**: Entropy bar (top-right), Echo counter, Merge prompt when available

## Integration with Existing Systems

### Resonance Cascade
- `QUANTUM_BRANCH` activation recorded when dying
- `TIMELINE_MERGE` activation recorded when merging
- White and magenta icons in the chain sequence

### Omni-Weapon
- `onQuantumBranch()` hook adds progress to ELEMENTAL and PHASING mods
- Rewards quantum suicide with quantum-tunneling themed weapon upgrades

### Other Systems
- Echoes can absorb enemy bullets (like Residue nodes/Chrono echoes)
- Works during Bullet Time, Fracture, and all other temporal states
- Does NOT prevent game over from other systems (only replaces death)

## Files Modified/Created

### New Files
- `src/systems/QuantumImmortalitySystem.js` (600+ lines)

### Modified Files
- `src/scenes/GameScene.js` — Integration, death hook, cleanup
- `src/scenes/GameOverScene.js` — Display quantum stats
- `src/entities/Player.js` — Invulnerability check
- `src/systems/ResonanceCascadeSystem.js` — Icons and colors
- `src/systems/OmniWeaponSystem.js` — onQuantumBranch hook

## Key Design Decisions

1. **Death as Resource**: Subverts the core bullet-hell tension — deaths are now strategic
2. **Solo Squadron**: Creates 4-ship formations (you + 3 echoes) without multiplayer
3. **Emergent Geography**: WHERE you die matters — death locations become tactical assets
4. **Beautiful Chaos**: At high entropy, screen fills with ghosts creating spectacular visuals
5. **Never Truly Dead**: Aligns with quantum immortality theory — you only experience branches where you survive

## Technical Stats
- Max 8 simultaneous echoes
- Echo lifespan: 8 seconds (base), up to 16 with entropy
- Echo damage: 20 base, up to 60 with entropy
- Sentience chance: 5% + 0.02% per entropy point
- Merge cooldown: 8 seconds
- Invulnerability after respawn: 1 second

## Why This Is Revolutionary
This system fundamentally reimagines the most core mechanic of bullet-hell games: **avoid death at all costs**. By transforming death into a resource that creates persistent AI allies, it:
- Removes the frustration of one-shot deaths
- Adds strategic depth around controlled risks
- Creates unique emergent scenarios based on death geography
- Provides a genuine "many-worlds" gameplay experience
- Becomes the capstone that completes the temporal ecosystem
