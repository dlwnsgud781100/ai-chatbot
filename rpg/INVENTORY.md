# Inventory

`InventoryManager` is a capacity-limited, data-ID-based slot inventory. Save state contains only `{ instanceId, itemId, quantity }` slots and never embeds item definitions. Definitions live in `src/data/rpg-content.js`.

## Rules

- Default capacity is 30; supported saves clamp it between 10 and 120.
- Consumables/materials stack to each definition's `stackLimit`; equipment is non-stacking.
- `add` preflights all stack/slot capacity before mutating, so a failed add cannot create a partial stack.
- Invalid IDs, zero/negative quantities, and insufficient removals fail without mutation.
- Slot operations include add, remove, move/merge, split, sort, category filtering, and consumable use. The inventory modal exposes selection-based move/merge, empty-slot moves, one-item split, discard, sort, filters, equip, and use controls.
- The modal is bound to actual slot instances. Equipment and consume buttons invoke the real managers.

## Save migration

Version-1 `{items:{id:quantity}}` saves are migrated to version-2 inventory input and then expanded into slots. Unknown legacy item IDs are discarded. A malformed slot, instance ID, quantity, or item definition is rejected while other validated slots survive.

## Reward behavior

Combat loot, quests, dungeons, and gatherable Phase-4 resources all pass through `RewardService`. When capacity prevents a reward item from being added, the accepted reward reports the constrained inventory condition rather than accepting client-authored replacement data.
