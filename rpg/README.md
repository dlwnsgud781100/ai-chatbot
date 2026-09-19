# Ashenwild Frontier — Browser Action RPG Presentation Slice

Ashenwild Frontier is an original, browser-playable third-person action RPG foundation. It does not copy the archived prototype's UI, maps, characters, icons, or gameplay logic: scenes use procedural geometry and the Phase-4 content is authored specifically for this project.

## Run

From the repository root:

```bash
python3 rpg_server.py
# Open http://localhost:8000
```

The dependency-free host serves the client and a validated `/api/action` intent gateway. Three.js remains a CDN browser dependency.

## Controls

| Action | Keys |
| --- | --- |
| Move / sprint | `WASD` or arrows / `Left Shift` |
| Camera orbit / light combo, heavy, Rift Lance | right-mouse drag / left mouse / `1`, `2`, `3` |
| Dew vial, dodge, guard/parry | `4`, `Q`, `F` |
| Target lock / cycle / ultimate | `R`, `T`, `V` |
| Interact / dialogue choices | `E`, then click a choice |
| Inventory / quest log / character | `I` / `J` / `C` |
| Map / fast travel | `M` |
| Menu / debug | `Esc` / `F3` |

## Playable Phase-5 presentation loop

The Phase 4 loop now has a stronger presentation layer: a landmarked World Tree hub, district lighting/signage/path guidance, smooth third-person camera with right-mouse orbit and registered-collider avoidance, combat/reward/boss feedback, settings, transition veil, test hooks, and startup failure fallback. These layers subscribe to existing gameplay events; they do not replace the RPG systems below.

## Playable RPG loop

1. Speak with **Watcher Arin** at the Worldroot Plaza and accept the Thornwatch hunt.
2. Defeat five Thornwalkers in the field. Combat emits confirmed defeat events; reward, quest, dungeon, and progression systems subscribe independently.
3. Report to Arin for XP, Gold, a real equipment reward, and the Sanctum unlock. Use inventory/equipment controls to equip, consume, sort, filter, split/merge (API), or move items.
4. Visit **Blacksmith Brann** for a functional Rootforge buy/sell shop and his collection quest.
5. Accept Arin's Sanctum quest. At level 2, enter the Skywell Gate near `(20, -16)` using `E`.
6. The dungeon gate validates level, quest, and unlocks. Defeat its gated Root Warden elite, then Aurel; report back for the final quest reward and Emberfall world unlock.
7. Reload the page: version-2 save migration/validation restores stats, inventory/equipment IDs, Gold, quest state, world navigation, defeats, and dungeon state.

## Architecture

```text
src/
  data/rpg-content.js   immutable Phase-4 items, loot, quests, NPCs, shops, dungeon
  player/               base/modifier/derived CharacterStats and persistent PlayerData
  inventory/            slot inventory, equipment bridge, weighted loot planner
  rewards/              event-driven reward application
  economy/              catalog-resolved shop transactions
  quest/                available/active/ready/completed state machine
  dungeon/              authored Sanctum entry and elite/boss gate
  combat/               preserved action combat, hit detection, feedback, AI
  world/                streaming, NPC/resource interaction, gated spawns
  save/                 v1→v2 validation/migration
  ui/                   HUD, live modals, dialogue choices, reward/transition/guidance UI
  presentation/         settings and semantic animation controller seam
  audio/                routed cue IDs, channels, music-state seam
  vfx/                  event-to-effect ID presentation mapping
  renderer/             procedural scene, streamed LOD, camera collision/follow rig
  network/              restrictive intent contract and remote adapter
```

`GameBootstrap` is the composition root. `CombatService` only emits an enemy-defeated event; it does not award XP, Gold, drops, quest credit, or dungeon completion itself. Combat-compatible stat aliases are retained so the Phase-3 combat flow is not replaced.

## Documentation

- [Progression](./PROGRESSION.md)
- [Inventory](./INVENTORY.md)
- [Equipment](./EQUIPMENT.md)
- [Quests & NPCs](./QUESTS.md)
- [Dungeon](./DUNGEONS.md)
- [Economy](./ECONOMY.md)
- [Presentation](./PRESENTATION.md), [UI system](./UI_SYSTEM.md), [Camera](./CAMERA.md), [Audio](./AUDIO.md), and [VFX](./VFX.md)
- [Combat](./COMBAT.md) and [World](./WORLD.md)

## Authority and known boundaries

The Python endpoint rejects client-supplied damage, XP, Gold, items, loot, quest, and equipment-stat fields; it is an intent gateway, not a full online game server. The included single-player browser loop is still an offline local simulation, so browser state/localStorage is not anti-cheat secure. `RewardService` and `RemoteClient` are deliberately narrow seams for a future authenticated server that resolves rewards, persistence, spatial state, cooldowns, and reconciliation.

No browser automation/WebGL runtime is bundled in this checkout. Run `node --experimental-default-type=module rpg/tests/phase4-rpg-flow.mjs` for RPG flow and `node --experimental-default-type=module rpg/tests/phase5-presentation.mjs` for settings validation, semantic animation states, audio/VFX manifests, and stable UI selector coverage. Static module checks, import resolution, and HTTP asset/authority checks complement them. Interactive WebGL visual QA was not executed.
