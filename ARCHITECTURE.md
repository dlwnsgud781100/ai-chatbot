# Repository assessment and RPG foundation plan

## Existing project assessment

The tracked project began as a two-file Streamlit/Groq educational chatbot (`app.py`, `requirements.txt`). It has no game runtime, 3D renderer, game data, server authority layer, or RPG domain model. That application is intentionally left unchanged so its existing behaviour is not broken.

`game.zip` and `mystic_woods_free_2.1.zip` are archive assets, not imported source-tree dependencies. The RPG does not unpack or reuse their interface, gameplay, sprites, maps, or code.

## Boundary and decisions

The runnable game lives in `rpg/` and is served by the dependency-free root `rpg_server.py`. `GameBootstrap` is the composition root. Three.js presentation remains behind `SceneRenderer`; gameplay systems communicate through narrow dependencies and typed-by-convention events.

Content is declarative, local saves are versioned and defensively validated, and the Python endpoint validates action intents without claiming to be an authoritative multiplayer simulation. The Phase 3/4 systems remain the source of gameplay truth for the single-player demo.

## Phase 2: streamed world

`WorldManager` composes zones, chunk streaming, navigation, resources, streamed NPCs/spawns, and environment state. A bounded active chunk ring and cached inactive render groups keep the original open-world foundation intentionally compact.

## Phase 3: action combat

`CombatService` owns declarative actions, hit detection, targeting, AI callbacks, damage resolution, status effects, and combat feedback. `SpawnManager` owns enemy AI. Combat sends only action/target IDs over the demo intent boundary and emits semantic events rather than managing RPG rewards.

## Phase 4: RPG vertical loop

Phase 4 added data-driven progression, bounded item-ID/instance inventory, seven-slot modifier equipment, weighted loot planning, reward application, Gold/shop service, quest state machine, NPC choices, Aurel Sanctum gating, save-v2 migration, and live RPG UI.

```text
CombatService -- combat:enemy-defeated --> RewardService / QuestManager / DungeonService
QuestManager -- quest:turn-in -----------> RewardService
DungeonService -- dungeon:completed -----> RewardService
RewardService -- player:progress --------> HUD / save / modal UI
```

## Phase 5: presentation and immersion layer

Phase 5 does not rewrite Phase 3/4 systems. It adds observer-style services and renderer-side adapters:

```text
Existing gameplay events
  ├─ CharacterAnimator + AnimationStateMachine
  │    semantic clip states, transition priority, cancel/lock timeline, root-motion/event seam
  ├─ VfxDirector + effect manifest
  │    effect IDs → bounded pooled renderer effects
  ├─ AudioService + audio manifest
  │    cue IDs → Master/Music/SFX/Combat/UI/Ambient/Voice routing
  ├─ CameraDirector
  │    follow/lag, right-mouse orbit, lock/boss framing, FOV/distance, registered collision raycasts
  └─ RewardPresentation / TransitionUI / GuidanceUI / DebugPanel
       presentation-only DOM, transitions, next-step guidance, development telemetry
```

`PresentationSettings` persists to an independent local preference key. It must never alter player progression/save-v2 authority. `SceneRenderer` owns original procedural World Tree Plaza districts, visual effects, light/fog profiles, and startup-safe camera presentation. Camera colliders are registered meshes rather than full-scene raycasts, avoiding an avoidable per-frame streaming cost.

The audio architecture currently uses synthesized cues and silent music-state transitions because no final audio assets ship. The animation controller currently drives semantic/procedural fallback posing and is explicitly clip-ready rather than claiming to contain authored animation clips.

## Production extension sequence

1. Add authenticated authoritative simulation, persistence, server-side spatial/cooldown/reward checks, and reconciliation.
2. Bind authored GLTF animation clips, root motion, portraits, environment assets, VFX textures, and licensed audio to existing semantic IDs.
3. Add authored collision volumes/occlusion tests, automated WebGL visual regression capture, accessibility QA, asset pipeline, telemetry, and live-ops tooling.
