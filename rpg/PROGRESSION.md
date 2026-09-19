# Progression

## Ownership

`src/player/character-stats.js` is the single in-browser source of character stat derivation. It stores level, XP, base attributes, current HP/Energy, unlocked skills, and source-keyed modifiers. Combat continues to read its familiar derived aliases (`attack`, `defense`, `maxHealth`, `maxEnergy`, `critChance`) and does not read equipment definitions.

Derived values are recalculated when a modifier changes or a level is gained. Equipment modifiers are keyed as `equipment:<slot>`, so replacing a slot cannot stack old bonuses. Level-ups add base attributes, fully restore HP/Energy, and unlock the current level-2 `ultimate` readiness flag.

## Reward path

1. `CombatService` emits `combat:enemy-defeated` after a confirmed local defeat.
2. `RewardService` subscribes and builds a validated reward from content IDs and a loot plan.
3. It applies XP, Gold, items, and world unlock IDs to `PlayerData`/inventory, then emits `player:progress` and `reward:granted`.
4. `QuestManager` and `DungeonService` independently subscribe to the same defeat event.

Quest and dungeon rewards use the same service. This intentionally keeps reward math out of combat.

## Persistence and authority

Save version 2 stores base progression inputs and current HP/Energy, rather than trusting previously calculated attack/defense. The Python action endpoint and the browser-side intent validator reject XP, Gold, drop, item, quest, and equipment-stat fields on network intents. The shipped browser demo still performs an offline local simulation; a production server must implement the `RewardService.resolve` seam and persist authoritative player state.
