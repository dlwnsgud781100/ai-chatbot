# Quests and NPC roles

Quest definitions in `src/data/rpg-content.js` are content records with prerequisites, giver, objectives, rewards, and an optional next quest. The current chain is:

1. **초원의 가시를 걷어라** — accept from Arin, defeat five Thornwalkers, report to Arin.
2. **아우렐의 심근 성소** — accept from Arin, enter the unlocked Sanctum, defeat its gated elite and Aurel, then report.

Brann also offers the `rootlight_supply` collection side quest and his Rootforge shop.

## State machine

A quest moves through `available → active → ready → completed`.

- NPC dialogue choices accept available quests or turn in ready quests.
- Kill/enter/collect objectives are event driven. Collection objectives are synchronized from ID quantities in the inventory.
- Completion makes a quest **ready**; it does not immediately mutate XP, Gold, or items.
- `turnIn` validates the giver and ready state, then emits `quest:turn-in`. `RewardService` applies the immutable reward record and unlock IDs.

The quest tracker displays every objective, live progress, state, and data-defined reward. The implementation does not auto-complete or auto-turn-in quests.
