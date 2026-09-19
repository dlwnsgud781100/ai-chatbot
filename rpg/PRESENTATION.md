# Phase 5 Presentation Layer

Phase 5 is a presentation pass over the Phase 3/4 playable loop. It does **not** replace combat, rewards, quests, inventory, equipment, dungeon state, or save v2. `GameBootstrap` wires independent presentation services that observe existing events.

## Runtime flow

```text
Gameplay events
  ├─ CharacterAnimator → semantic animation state / clip-event seam
  ├─ VfxDirector       → effect-ID renderer calls and bounded effect pool
  ├─ AudioService      → routed audio-ID cues and music-state seam
  ├─ RewardPresentation / TransitionUI / GuidanceUI → DOM presentation
  └─ DebugPanel        → developer-only live instrumentation
```

`CombatService` continues to own combat outcomes and emits the same events. Presentation listeners never assign damage, XP, Gold, inventory, quest, or dungeon state.

## World Tree Plaza

The existing procedural hub now has a water landmark, coloured quest/forge/gate districts, wayfinding paths, lanterns, physical signage sprites, a forge, quest board, hub wisps, and purpose-specific lighting. The content is original procedural geometry; it is not a replacement for authored environment art.

`GuidanceUI` adds a compact next-step/distance card based on current quest/dungeon state. It intentionally avoids a permanent giant directional arrow.

## Visual safety and performance

- Dynamic effects have a maximum active budget of 140 and recycle ring, loot, and spark meshes.
- Streaming keeps existing LOD/chunk culling; camera collision raycasts only registered colliders rather than every world mesh.
- Reduced motion limits renderer pixel ratio and disables new VFX effects. Screen-effects toggle suppresses renderer effects and HUD hit flashes.
- `main.js` renders a player-facing retry fallback if renderer/bootstrap startup fails.

Interactive WebGL visual QA was not run in this environment. See the README and final report for the exact static and HTTP checks completed.
