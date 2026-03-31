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
- **Enemy variety**: 3 types with distinct speeds/HP/damage
- **Screen shake**: Impact feedback on damage
- **200-bullet pool**: Ready for bullet density

## Roadmap

- [ ] Weapon upgrades (spread, pierce, rapid)
- [ ] Boss encounters (large geometric constructs)
- [ ] Pattern-based enemy attacks (bullet hell formations)
- [ ] Power-ups (speed, shield, bomb)
- [ ] Persistent high scores
- [ ] Synthwave audio
