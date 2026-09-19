import { DAMAGE_TYPES } from '../data/combat-data.js';

export class DamageSystem {
  calculate({base,attack=0,defense=0,type='physical',resistances={},criticalChance=.1,criticalMultiplier=1.55,bonusMultiplier=1}) {
    const normalizedType=DAMAGE_TYPES[type]?type:'physical';const variance=.93+Math.random()*.14;const critical=Math.random()<criticalChance;const resistance=Math.max(-80,Math.min(85,Number(resistances[normalizedType]??0)));const defenseReduction=normalizedType==='physical'?defense*.42:defense*.16;const raw=Math.max(1,(base+attack-defenseReduction)*variance);const amount=Math.max(1,Math.round(raw*(1-resistance/100)*(critical?criticalMultiplier:1)*bonusMultiplier));return {amount,critical,type:normalizedType,resistance};
  }
  resolvePlayerHit(action,playerStats,target,{bonusMultiplier=1}={}) { const elemental=playerStats.elementalPower?.[action.type]??0;const skillBonus=(action.id==='rift'||action.id==='ultimate')?(playerStats.skillPower??0):0;return this.calculate({base:action.baseDamage*(1+elemental+skillBonus),attack:playerStats.attack,defense:target.data.defense,type:action.type,resistances:target.resistances??target.data.resistances,criticalChance:Math.max(playerStats.critChance??.05,action.id==='ultimate' ? .3 : .12),criticalMultiplier:action.id==='heavy'?Math.max(1.75,playerStats.critDamage??1.55):(playerStats.critDamage??1.55),bonusMultiplier}); }
  resolveEnemyHit(pattern,enemy,playerStats,{guardMultiplier=1}={}) {return this.calculate({base:pattern.damage??enemy.data.attack,attack:enemy.data.attack*.18,defense:playerStats.defense,type:pattern.type??'physical',criticalChance:0.025,bonusMultiplier:guardMultiplier});}
}
