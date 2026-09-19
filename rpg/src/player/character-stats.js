export class CharacterStats {
  constructor(data={}) { this.level=data.level ?? 1; this.xp=data.xp ?? 0; this.xpToLevel=data.xpToLevel ?? 100; this.maxHealth=data.maxHealth ?? 120; this.health=Math.min(data.health ?? this.maxHealth,this.maxHealth); this.maxEnergy=data.maxEnergy ?? 80; this.energy=Math.min(data.energy ?? this.maxEnergy,this.maxEnergy); this.attack=data.attack ?? 12; this.defense=data.defense ?? 3; }
  heal(value) { const before=this.health; this.health=Math.min(this.maxHealth,this.health+Math.max(0,value)); return this.health-before; }
  spendEnergy(value) { if (this.energy<value) return false; this.energy-=value; return true; }
  restoreEnergy(value) { this.energy=Math.min(this.maxEnergy,this.energy+value); }
  takeDamage(value) { const amount=Math.max(1,Math.round(value)); this.health=Math.max(0,this.health-amount); return amount; }
  gainXp(value) { this.xp+=Math.max(0,value); const levels=[]; while(this.xp>=this.xpToLevel) { this.xp-=this.xpToLevel; this.level++; this.xpToLevel=Math.round(this.xpToLevel*1.27); this.maxHealth+=18; this.maxEnergy+=8; this.attack+=3; this.defense+=1; this.health=this.maxHealth; this.energy=this.maxEnergy; levels.push(this.level); } return levels; }
  snapshot() { return { level:this.level,xp:this.xp,xpToLevel:this.xpToLevel,maxHealth:this.maxHealth,health:this.health,maxEnergy:this.maxEnergy,energy:this.energy,attack:this.attack,defense:this.defense }; }
}
