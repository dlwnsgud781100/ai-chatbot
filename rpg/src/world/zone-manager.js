import { ZONES } from '../data/content.js';
export class ZoneManager {
  constructor(events) { this.events=events;this.current=ZONES.whispering_verge; }
  update(position) { const next=Object.values(ZONES).find((zone)=>position.x>=zone.bounds.minX&&position.x<=zone.bounds.maxX&&position.z>=zone.bounds.minZ&&position.z<=zone.bounds.maxZ)??ZONES.whispering_verge; if(next.id!==this.current.id){this.current=next;this.events.emit('world:zone-changed',{zone:next});} return this.current; }
}
