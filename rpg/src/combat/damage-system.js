export class DamageSystem {
  calculate({base,attack=0,defense=0,criticalChance=.1,criticalMultiplier=1.55}) { const variance=.9+Math.random()*.2;const critical=Math.random()<criticalChance;const raw=(base+attack)*variance*(critical?criticalMultiplier:1);return {amount:Math.max(1,Math.round(raw-defense*.42)),critical}; }
}
