import { EVENT, WORLD } from '../core/constants.js';
export class TargetingSystem {
  constructor(events,spawns) { this.events=events;this.spawns=spawns;this.target=null; }
  update(playerPosition) { const next=this.spawns.getAlive().map(entity=>({entity,distance:entity.position.distanceTo(playerPosition)})).filter(entry=>entry.distance<WORLD.TARGET_RANGE).sort((a,b)=>a.distance-b.distance)[0]?.entity ?? null; if(next!==this.target){this.target=next;this.events.emit(EVENT.TARGET_CHANGED,{target:next});} return this.target; }
  clear(target) { if(this.target===target){this.target=null;this.events.emit(EVENT.TARGET_CHANGED,{target:null});} }
}
