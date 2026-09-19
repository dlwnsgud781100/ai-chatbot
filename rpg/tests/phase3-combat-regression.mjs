import assert from 'node:assert/strict';
import { CharacterStats } from '../src/player/character-stats.js';
import { SkillSystem } from '../src/combat/skill-system.js';
import { DamageSystem } from '../src/combat/damage-system.js';
import { PLAYER_ACTIONS, BOSS_PROFILES, ENEMY_COMBAT_PROFILES } from '../src/data/combat-data.js';

const stats=new CharacterStats();
const skills=new SkillSystem();
assert.ok(skills.canUse('light_1',stats,0,{ultimate:100}).ok);
assert.ok(skills.canUse('heavy',stats,0,{ultimate:100}).ok);
skills.commit('heavy',stats,0);
assert.equal(skills.canUse('heavy',stats,.1,{ultimate:100}).ok,false,'heavy cooldown remains enforced');
assert.equal(skills.canUse('ultimate',stats,2,{ultimate:99}).ok,false,'ultimate threshold remains enforced');
assert.ok(skills.canUse('ultimate',stats,2,{ultimate:100}).ok);

const damage=new DamageSystem();
const random=Math.random;Math.random=()=>.5;
const physical=damage.resolvePlayerHit(PLAYER_ACTIONS.heavy,stats,{data:{defense:3,resistances:{physical:0}}});
const resistant=damage.resolvePlayerHit(PLAYER_ACTIONS.rift,stats,{data:{defense:0,resistances:{lightning:60}}});
Math.random=random;
assert.ok(physical.amount>0);
assert.ok(resistant.amount<PLAYER_ACTIONS.rift.baseDamage+stats.attack,'elemental resistance reduces the resolved hit');
assert.equal(BOSS_PROFILES.thornheart_titan.phases.length,3,'Aurel retains three combat phases');
assert.ok(BOSS_PROFILES.thornheart_titan.phases.at(-1).weakPoint,'final phase exposes existing weak-point behavior');
for(const enemy of ['thornwalker','cinder_moth','frost_wisp','rootwarden','thornheart_titan'])assert.ok(ENEMY_COMBAT_PROFILES[enemy],`combat profile exists: ${enemy}`);
console.log('Phase 3 combat regression tests passed.');
