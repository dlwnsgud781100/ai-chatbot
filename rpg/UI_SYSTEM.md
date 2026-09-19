# UI System

## Design language

The interface shares a restrained **verdant-metal** system: dark translucent panels, leaf/gold hierarchy, compact mono labels, clipped corners, consistent borders, and short motion timings. Existing Phase 4 inventory, equipment, quest, shop, dungeon, character, dialogue, and HUD data flows remain unchanged.

## HUD hierarchy

- Top: current region and active objective.
- Under top bar: compact Pathfinder readout with next step and distance.
- Left: HP, Energy, XP, level, and state.
- Centre: target/lock status; boss frame is more prominent but remains narrow.
- Bottom: combat skills and cooldowns; quick panels remain at the lower right.

Damage includes elemental colour, critical scale, weak/stagger notation, and a short directional indicator when the player is hit. The response is suppressed when Screen Effects is disabled.

## Modals and dialogue

Modals use fade/rise motion and preserve keyboard close behavior. Dialogue has a portrait slot (`#dialogue-portrait`) ready for future portrait assets, real choice buttons, and semantic roles. Rare/Epic item results and level-ups use a short reward emphasis; ordinary rewards remain compact toast notifications.

## Settings

The sound button opens a functional Presentation & Accessibility panel. It persists independently under `ashenwild-frontier.presentation-settings` so preferences do not alter gameplay/save-v2 authority.

Available preferences: Master, Music, Combat, UI, Ambient volume; UI scale; camera sensitivity/distance/FOV; camera shake; screen effects; reduced motion. Camera sensitivity applies to right-mouse drag orbit. Music has no shipped music asset yet, so its control configures the ready routing channel but cannot affect an absent track.

## Test and accessibility hooks

Stable static `data-testid` markers include `hud`, `game-canvas`, `boss-hud`, `dialogue`, `reward-presentation`, and `transition-layer`. Inventory, equipment, quest tracker, shop, and dungeon set their stable test IDs when their real modal panel opens. Canvas is focusable; buttons retain native semantics and visible keyboard focus.
