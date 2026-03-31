# Shooty 🎮

A top-down roguelike shooter built with Phaser 3.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Controls

- **WASD** or **Arrow Keys** - Move
- **Mouse** - Aim
- **Click/Hold** - Shoot

## Features

- ✅ Procedurally generated placeholder sprites (no external assets needed)
- ✅ Wave-based enemy spawning with increasing difficulty
- ✅ Bullet pool for performance
- ✅ Knockback on damage
- ✅ Health bars
- ✅ Camera follow with smooth lerp

## Project Structure

```
src/
  scenes/        # Game states (Boot, Menu, Game, GameOver)
  entities/      # Player, Enemy classes
  systems/       # (reserved for future: upgrades, loot, etc.)
assets/          # (reserved for future: real sprites, sounds)
```

## Roadmap Ideas

- [ ] Real pixel art sprites
- [ ] Weapon upgrades & variety
- [ ] Enemy types (fast, tank, ranged)
- [ ] Room-based dungeon generation (true roguelike)
- [ ] Loot drops & power-ups
- [ ] Boss fights
- [ ] High score persistence
- [ ] Sound effects & music
