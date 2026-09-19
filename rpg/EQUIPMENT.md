# Equipment

Equipment has seven named slots:

`weapon`, `helmet`, `armor`, `gloves`, `boots`, `accessory`, and `relic`.

`EquipmentManager` moves a real inventory instance into a slot and returns the previous item to the inventory. It verifies that the item is an equipment definition, belongs in that slot, is owned, and satisfies its level requirement. A full bag prevents unequipping/replacement safely.

## Stat model

Item definitions contain declarative `stats` such as `attackPower`, `vitality`, `defense`, `critChance`, `moveSpeed`, elemental power, and resistance. Equipping applies those values as one keyed modifier to `CharacterStats`; removing/replacing that source recomputes all derived values. This prevents cumulative direct writes such as `stats.attack += item.attack`.

The character modal shows all seven slots and exposes real equip/unequip actions. Equipment snapshots save only the equipped `{itemId, instanceId}` references. Item stat objects are never serialized as authoritative player state.
