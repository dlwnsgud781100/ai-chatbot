# Repository assessment and RPG foundation plan

## Existing project assessment

The tracked project began as a two-file Streamlit/Groq educational chatbot (`app.py`, `requirements.txt`). It has no game runtime, 3D renderer, game data, server authority layer, or RPG domain model. That application is intentionally left unchanged so its existing behaviour is not broken.

`game.zip` and `mystic_woods_free_2.1.zip` are archive assets, not imported source-tree dependencies. The new RPG does not unpack or reuse their interface, gameplay, sprites, maps, or code. This avoids silently coupling the new game to an unrelated 2D prototype or third-party pixel-art pack.

## Change boundary

The runnable game lives in its own `rpg/` client directory and is served by the dependency-free root `rpg_server.py`. It is isolated from the existing Streamlit application. This creates a safe migration path: the chatbot can later link to a game portal, or both applications can be put behind an outer router, without entangling their dependencies.

## Decisions

- **Presentation:** Three.js, procedural primitives only, behind `SceneRenderer` so it can later be replaced with asset loading / a different renderer.
- **Composition:** `GameBootstrap` is the only service-wiring module. Systems talk through typed-by-convention events and narrow dependencies instead of global imports.
- **Content:** IDs and balancing data are declarative in `data/content.js`; systems are generic over content definitions.
- **Persistence:** versioned, validated local demo saves. The save shape has an explicit validation boundary rather than trusting browser storage.
- **Networking:** client intent submissions and a separate endpoint are present. The demo endpoint validates wire format but does not claim to be an authoritative multiplayer simulation.
- **Scope:** one high-quality field loop was chosen over prematurely creating dozens of empty zones, menus, items, and dungeon types.

## Phase 2 extension: open-world streaming

Phase 2 keeps the existing composition root and adds zone data in `rpg/src/data/world-zones.js`. `WorldManager` now composes `ChunkStreamingManager`, `WorldNavigation`, `ResourceManager`, streamed NPCs/spawns, and an environment adapter. A 3×3 active chunk ring drives rendering and simulation activation; terrain chunks cache only a bounded number of inactive render groups. The World Tree is a permanent hub landmark, while adjacent world content remains streamable. Details are documented in `rpg/WORLD.md`.

## Phase 3 extension: real-time combat

Phase 3 preserves the existing `CombatService` boundary and extends it with declarative action data, hit detection, elemental damage calculation, status effects, target locking, generated audio feedback, and a stream-safe enemy AI state machine. `SpawnManager` owns `EnemyAiSystem` instances rather than embedding AI branches in the World Manager. Boss phases and enemy pattern data remain in `data/combat-data.js`; renderer feedback is still isolated in `SceneRenderer`. The action intent contract sends only action/target IDs to the demo server — it never trusts client damage or rewards. Details are documented in `rpg/COMBAT.md`.

## Extension sequence

1. Move declarative content from the current module into schema-validated JSON bundles and build authoring/import tests.
2. Implement a real authoritative simulation service with account/session identity, persistence, spatial queries, server-side damage/cooldowns, snapshots, and reconciliation.
3. Add zone streaming plus instance/dungeon contracts, then a boss encounter state machine.
4. Add equipment stats, NPC dialogue graph tooling, localization, audio, accessibility, analytics, automated gameplay tests, asset pipeline, and live-ops configuration.

## Phase 4 extension: RPG vertical loop

Phase 4 keeps Phase 3 combat intact and adds a content-driven gameplay layer in `rpg/src/data/rpg-content.js`. The composition root now wires seven focused services rather than making combat a reward God Object:

- `CharacterStats` owns base attributes, source-keyed modifiers, derived combat-compatible aliases, XP/level progression, and skill-readiness state.
- `InventoryManager` owns bounded ID/instance slots; `EquipmentManager` moves real instances into seven slots and applies modifier sources.
- `LootSystem` creates validated weighted drop plans; `RewardService` subscribes to defeat, quest-turn-in, dungeon-complete, and resource events to apply configured reward records.
- `QuestManager` tracks the available/active/ready/completed state machine; `NPCManager` exposes dialogue choices that request accept/turn-in/shop operations.
- `ShopService` resolves catalog prices and sell rules from immutable content, never from UI values.
- `DungeonService` validates Sanctum entry and tells `SpawnManager` whether its elite/boss encounter spawns are eligible.
- `SaveManager` writes version 2 snapshots; `data-validation.js` migrates the old map inventory and clamps/filters untrusted browser storage.

The data/event shape is intentionally server-compatible: network action intents allow identifiers only. XP, Gold, inventory item IDs/quantities, loot, quest completion, and equipment modifiers are absent from the wire contract and the Python gateway rejects unexpected fields. The offline demo remains a local simulation; an authoritative production service must replace the `RewardService` resolution seam and retain account/session state server-side.

### Event flow

```text
CombatService -- combat:enemy-defeated --> RewardService / QuestManager / DungeonService
QuestManager -- quest:turn-in -----------> RewardService
DungeonService -- dungeon:completed -----> RewardService
RewardService -- player:progress --------> HUD / save / modal UI
```

This fan-out preserves low coupling: combat knows hit/death presentation, while progression systems independently respond to outcomes.
