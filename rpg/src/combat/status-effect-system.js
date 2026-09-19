// Generic timed-effect registry. Effects are data-driven and do not require combat code changes.
export class StatusEffectSystem {
  constructor() { this.effects=new Map(); }
  apply(targetId,effect) { const list=this.effects.get(targetId)??[];const index=list.findIndex(entry=>entry.id===effect.id);if(index>=0)list[index]={...list[index],...effect};else list.push({...effect,remaining:effect.duration});this.effects.set(targetId,list); }
  update(delta,onTick) { for(const [targetId,list] of this.effects){for(const effect of list){effect.remaining-=delta;effect.tick=(effect.tick??effect.interval)-delta;if(effect.tick<=0){effect.tick=effect.interval;onTick?.(targetId,effect);}}const current=list.filter(effect=>effect.remaining>0);if(current.length)this.effects.set(targetId,current);else this.effects.delete(targetId);} }
  get(targetId){return this.effects.get(targetId)??[];}
}
