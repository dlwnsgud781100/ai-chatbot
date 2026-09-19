# Phase 2 — Open World Structure

## World topology

Ashenwild is deliberately a connected zone graph, not one permanently active scene. Every zone is declared in `src/data/world-zones.js` with its bounds, level range, environment profile, landmark, waypoint, points of interest, resources, and spawn table.

```text
                         [ Crownspine ] ── [ Frostveil ] ── [ Astral Gate ]
                               │                  │                  │
[ Whispering Verge ] ── [ Worldroot Plaza ] ── [ Emberfall ] ── [ Dreadmarch ]
                               │
                          [ Sunscorch ]
                         /             \
                  [ Murkfen ]      [ Underroot ]
```

`Worldroot Plaza` is the initial central hub. It contains the World Tree, campfire, NPC services, a quest board, crafting pavilion, the first waypoint, and a sealed dungeon gate. The World Tree is a permanent high-visibility scene object; surrounding terrain and content stream independently.

## Implemented zone packages

| Zone | Level | Landmark | Exploration hooks |
| --- | --- | --- | --- |
| Worldroot Plaza | 1–2 | Dawn World Tree | Hub NPCs, services, first waypoint, resources, sealed gate |
| Whispering Verge | 1–3 | Echo Stone Arch | cave entrance, shrine secret, resources, Root Warden |
| Emberfall Reach | 3–5 | Fallen Bastion | vault, forge event, ore, Cinder Sentinel |
| Frostveil Expanse | 5–7 | Frozen Observatory Palace | crypt, whiteout event, frost resources, matriarch |
| Sunscorch Basin | 7–9 | Sundial Temple | glass tomb, mirage event, sunstone, tyrant |
| Murkfen Hollow | 8–10 | Drowned Colossus | sunk hall, bog event, resin, queen |
| Crownspine Range | 10–12 | Broken Skybridge | echo mine, cliff event, ore, bridge warden |
| Underroot | 12–14 | Root-Below City | hollow depths, market, root resources, sentinels |
| Dreadmarch | 14–16 | Black Banner Keep | battle dungeon, storm event, high-risk resources |
| Astral Gate | 16+ | Astral Door | final spire, comet event, endgame resources |

## Streaming lifecycle

1. `ZoneManager` resolves the logical zone from player coordinates.
2. `ChunkStreamingManager` resolves a 3×3 chunk ring around the player (`48×48` world units per chunk).
3. `SceneRenderer` creates/reuses chunk terrain, medium-detail objects, nearby detail objects, landmarks, POIs, and waystone models.
4. `SpawnManager`, `NPCManager`, and `ResourceManager` synchronize only content whose chunk is active.
5. Far chunks are hidden and cached. The renderer caps its inactive chunk cache at 40 groups; excess hidden chunks are disposed.
6. Current-zone environment settings update fog, sky, sun colour, weather particles, and ambient/BGM profile identifiers.

The chunk ring, cache limit, active entity distance, and environment manifests are explicit extension points, not hard-coded per-zone conditionals.

## Navigation

- **Mini map:** current-zone outline, player heading, nearby markers, discovered adjacent regions.
- **World map:** `M` or the HUD map button. It lists all zone cards, danger range, landmarks, exploration state, and available travel points.
- **Waypoints:** interact with a local marker using `E` to record it; recorded waypoints can be selected from the World Map for fast travel.
- **Markers:** landmark, waypoint, dungeon, event, NPC/service, secret, boss, and active quest marker types are represented by `WorldNavigation` data.

## Performance contracts

- Spawn and NPC AI update only for entities in active streamed chunks.
- NPC mesh visibility is culled beyond 72 units.
- Chunk decorative detail is LOD-culled outside the centre chunk.
- Effects use ring/loot mesh pools instead of allocating every hit/drop.
- Far terrain stays cached as inactive groups; cached groups are disposed when the cap is exceeded.
- Gameplay emits no renderer calls except through managers/adapters; the world data can later be shared with an authoritative server.

## Intentional next boundaries

Dungeon POIs currently display as discoverable gates. Their instance rules, boss encounter machines, navigation meshes, audio playback, server-authoritative world state, and persistence of per-zone dynamic events belong to the next production phases.
