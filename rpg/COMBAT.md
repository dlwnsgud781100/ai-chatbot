# Phase 3 — Action Combat Vertical Slice

## Controls

| Action | Input |
| --- | --- |
| Light combo | Left click / `1` |
| Heavy attack | `2` |
| Rift Lance | `3` |
| Dew vial | `4` |
| Dodge | `Q` |
| Dash | tap `Left Shift` while moving; hold to sprint afterwards |
| Guard / perfect parry | hold `F`; begin within 0.20s of impact to parry |
| Target lock / target cycle | `R` / `T` |
| Air attack | jump with `Space`, then left click / `1` |
| Ultimate | `V` at 100% Resolve |

## Flow

1. The player starts an action from declarative `PLAYER_ACTIONS` data.
2. Windup, active, recovery, hit volume, element, stagger, knockback, status, feedback, cooldown, and energy costs are owned by `CombatService`, not HUD code.
3. `HitDetection` checks an action's range and horizontal cone against active enemies.
4. `DamageSystem` resolves element, defense, resistance, variance, weak-point multiplier, and critical result.
5. Enemy AI reacts with hit feedback, stagger or a death transition; rewards still go through the existing loot/quest services.

## Combat encounters available from the Worldroot Plaza

The nearby proving field includes the required encounter set without requiring a zone transition:

| Role | Entity |
| --- | --- |
| Normal 1 | Thornwalker — melee, poison resistant |
| Normal 2 | Cinder Moth — ranged fire projectile, retreats when weak |
| Normal 3 | Frost Wisp — ranged ice projectile and chill |
| Elite | Root Warden — cleave and telegraphed root slam, staggerable |
| Boss | Thornheart Guardian Aurel — three phases, weak point, stagger, enrage, telegraphs, charge, projectile/ring patterns, and phase arena pressure |

## Enemy state machine

`EnemyAiSystem` supports `Idle`, `Patrol`, `Detect`, `Chase`, `Telegraph`, `Attack`, `Recover`, `Stunned`, `Flee`, `Return`, and `Dead` semantic states. Each profile in `combat-data.js` declares behavior ranges, movement style, resistance, stagger threshold, and pattern list independently.

## Authority boundary

The browser sends the server only an action ID and a target ID. It never sends damage, XP, item quantities, drop rolls, currency, cooldown values, or boss phase values. The included demo gateway rejects unknown actions and enforces a per-action cooldown/rate boundary. The local single-player simulation remains predictive by design; a production multiplayer server must authoritatively own entity transforms, hit volumes, resources, cooldowns, damage, loot, and reconciliation.
