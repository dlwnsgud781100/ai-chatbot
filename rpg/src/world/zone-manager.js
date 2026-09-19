import { ZONES } from '../data/content.js';
export class ZoneManager {
  constructor(events) { this.events=events;this.current=ZONES.worldtree_plaza; }
  find(position){return Object.values(ZONES).find((zone)=>position.x>=zone.bounds.minX&&position.x<zone.bounds.maxX&&position.z>=zone.bounds.minZ&&position.z<zone.bounds.maxZ)??ZONES.worldtree_plaza;}
  update(position) { const next=this.find(position); if(next.id!==this.current.id){const previous=this.current;this.current=next;this.events.emit('world:zone-changed',{zone:next,previous});} return this.current; }
}
