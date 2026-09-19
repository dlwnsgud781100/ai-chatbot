# Economy and Rootforge Shop

Gold is a persistent `PlayerData` field. Enemy, quest, and dungeon grants are resolved from content definitions through `RewardService`; the UI cannot supply an amount.

`ShopService` is the only shop mutation API. The Rootforge catalog is declarative in `rpg-content.js` and each purchase resolves its price from that catalog, ignoring any UI-provided price. Purchases verify Gold and capacity before deducting currency. Selling verifies an owned item instance, quantity, and `isTradeable`/quest-item flags, then uses the configured 50% sell rate.

The Brann dialogue choice opens a functional catalog with buy-one and sell-one controls and a live Gold total. Invalid ID, quantity, ownership, insufficient-Gold, full-bag, and protected quest-item operations fail without changing Gold or inventory.

The demo persists locally. Production economy authority belongs server-side alongside authenticated inventories and transaction receipts; `/api/action` accepts no economic mutation fields.
