# Ashenwild Frontier — 3D Action RPG Foundation

An original, browser-playable third-person action RPG foundation. It intentionally uses no art, maps, UI layouts, characters, or game logic from the archived prototype in this repository; every scene object is procedural geometry and the content/data is new.

## Run

From the repository root:

```bash
python3 rpg_server.py
# Open http://localhost:8000
```

The command exposes both the static client and a small demo intent gateway at `/api`. No packages are required. The renderer imports Three.js from jsDelivr; an internet connection is required for that one browser dependency.

## Controls

| Action | Keyboard / mouse |
| --- | --- |
| Move | `WASD` / arrow keys |
| Sprint | `Left Shift` |
| Jump | `Space` |
| Attack | left mouse button / `1` |
| Rift Lance | `2` |
| Dew vial | `3` |
| Dodge | `Q` |
| Interact / dialogue | `E` |
| Inventory / quests / character | `I` / `J` / `C` |
| World map / fast travel | `M` |
| Menu | `Esc` |
| Developer telemetry | `F3` (or `?debug`) |

## Technical map

```text
src/
  core/        bootstrap, state machine, event bus, service container, config
  data/        declarative zones, NPCs, enemies, quests, skills, items
  player/      controller, data, stats, semantic animation, interaction
  combat/      targeting, skills, damage, status-effect seam, combat service
  world/       zone packages, chunk streaming, navigation, spawning, NPC, resources, environment
  quest/       objective progress and reward progression
  inventory/   inventory, equipment seam, and loot rolls
  ui/          HUD, modal menus, dialogue, notifications
  save/        versioned local save and defensive validation
  network/     client intent gateway and shared input contract
  admin/       performance monitor and developer telemetry
  renderer/    Three.js presentation adapter
```

`GameBootstrap` is the composition root. Gameplay services do not query the DOM or Three.js directly except through the renderer adapter at that edge. Content IDs live in `src/data/content.js`; adding a standard monster/item/quest should not require modifying the combat or quest engine.

## Authority boundary

The included Python server is a **demo intent gateway**, not an online-production server. It validates payload sizes, intent names, movement vectors, action rates, and combat identifier shape, and is deliberately kept separate from UI/client code. A production server must add authenticated accounts, authoritative per-player entity state, spatial validation, server-side cooldown/resource checks, persistence, telemetry, and anti-replay tokens before multiplayer is enabled. The client uses prediction in the offline field demo and treats the gateway as a replaceable `RemoteClient` endpoint.

## Save format

The single-player demo stores a versioned save in `localStorage` under `ashenwild-frontier.save`. `DataValidation` clamps and rejects malformed values before loading it. The menu can clear this test save.

## Current vertical slice

- A data-driven 10-zone open-world topology centred on the Worldroot Plaza and its World Tree hub.
- Streamed 48×48 chunks, terrain/material variants, environmental profiles, local resources, NPCs, enemies, boss markers, landmarks, dungeon gates, POIs, and waypoint data.
- Mini map, zone discovery, world map, waypoint activation, and discovered-waypoint fast travel. See [WORLD.md](./WORLD.md) for the zone manifest and lifecycle.
- Walking, sprint energy, jumping, dodge, targeting, basic attack, ranged skill, potion consumption, enemy pursuit/attacks, death, and respawn.
- XP/levels, item drops, inventory, quest objectives/rewards, dialogue interaction, versioned local saving, HUD, responsive touch affordances, debug panel, and gateway health/action calls.

This remains a deliberately bounded vertical slice. Dungeon instance generation, boss phases, full equipment slots, authoritative multiplayer simulation, mobile gesture movement, audio playback, accessibility settings, and production asset streaming are planned extensions rather than placeholder systems disguised as complete features.
