import * as THREE from 'three';
import { ITEMS, ZONES } from '../data/content.js';

const chunkKey=(position,size=48)=>`${Math.floor(position.x/size)}:${Math.floor(position.z/size)}`;
export class ResourceManager {
  constructor(events,renderer,inventory) { this.events=events;this.renderer=renderer;this.inventory=inventory;this.entities=new Map();this.collected=new Set();this.definitions=Object.values(ZONES).flatMap((zone)=>zone.resources.map((entry)=>({...entry,zoneId:zone.id}))); }
  sync(activeKeys){for(const definition of this.definitions){const key=chunkKey(definition.position);const active=activeKeys.has(key)&&!this.collected.has(definition.id);const entity=this.entities.get(definition.id);if(active&&!entity){const object=this.renderer.createResource(definition);const position=new THREE.Vector3(definition.position.x,this.renderer.getGroundHeight(definition.position.x,definition.position.z),definition.position.z);this.entities.set(definition.id,{id:definition.id,type:'resource',data:definition,position,object});}else if(!active&&entity){this.renderer.removeObject(entity.object);this.entities.delete(definition.id);}}}
  list(){return [...this.entities.values()];}
  interact(entity){if(!entity||this.collected.has(entity.id))return false;const item=ITEMS[entity.data.itemId];if(!item)return false;this.collected.add(entity.id);this.inventory.add(item.id,1);this.renderer.createLootBurst(entity.object.position);this.renderer.removeObject(entity.object);this.entities.delete(entity.id);this.events.emit('ui:notify',{message:`${item.name} 획득`,type:'success'});this.events.emit('world:resource-collected',{resource:entity.data,item});return true;}
  snapshot(){return {collected:[...this.collected]};}
  restore(saved={}){this.collected=new Set(saved.collected??[]);}
}
