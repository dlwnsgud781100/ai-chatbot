# VFX System

`src/vfx/effect-manifest.js` defines semantic effect IDs and presentation metadata. `VfxDirector` observes existing combat/reward/boss events and asks `SceneRenderer` to render only those IDs. Examples:

- `effect.player.attack.slash`, `effect.player.attack.heavy`
- `effect.player.skill.lightning`, `effect.player.ultimate`
- `effect.player.dodge`, `effect.player.parry`
- elemental impact effects for physical, lightning, fire, ice, and poison
- boss phase/enrage and rarity-sensitive reward effects

## Budget and pooling

The renderer limits active dynamic effects to 140. Reusable ring, loot, and spark meshes are pooled; when pressure is reached, pooled effects are released before accepting more. This is intentionally a small browser-safe budget rather than a post-processing particle showcase.

Existing Phase 3 hit rings, telegraphs, projectiles, loot bursts, screen shake, and impact responses are retained. Phase 5 adds ID-based mapping and bounded impact particles around them; it does not claim to provide authored particle textures or cinematic VFX assets.

Screen Effects and Reduced Motion can suppress presentation effects without touching combat timings, hit detection, reward logic, or AI.
