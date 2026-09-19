import * as THREE from 'three';
import { ZONES } from '../data/content.js';
import { ITEM_DATABASE } from '../data/rpg-content.js';

const chunkKey=(position,size=48)=>`${Math.floor(position.x/size)}:${Math.floor(position.z/size)}`;
export class ResourceManager {
  constructor(events,renderer,inventory){this.events=events;this.renderer=renderer;this.inventory=inventory;this.entities=new Map();this.collected=new Set();this.definitions=Object.values(ZONES).flatMap((zone)=>zone.resources.map((entry)=>({...entry,zoneId:zone.id})));}
  sync(activeKeys){for(const definition of this.definitions){const key=chunkKey(definition.position),active=activeKeys.has(key)&&!this.collected.has(definition.id),entity=this.entities.get(definition.id);if(active&&!entity){const object=this.renderer.createResource(definition);const position=new THREE.Vector3(definition.position.x,this.renderer.getGroundHeight(definition.position.x,definition.position.z),definition.position.z);this.entities.set(definition.id,{id:definition.id,type:'resource',data:definition,position,object});}else if(!active&&entity){this.renderer.removeObject(entity.object);this.entities.delete(entity.id);}}}
  list(){return [...this.entities.values()];}
  interact(entity){if(!entity||this.collected.has(entity.id))return false;const item=ITEM_DATABASE[entity.data.itemId];if(!item){this.events.emit('ui:notify',{message:'이 자원은 아직 이 지역의 제작 체계에 연결되지 않았습니다.',type:'warning'});return false;}this.collected.add(entity.id);this.renderer.createLootBurst(entity.object.position);this.renderer.removeObject(entity.object);this.entities.delete(entity.id);this.events.emit('world:resource-collected',{resource:entity.data,item,position:entity.position});return true;}
  snapshot(){return {collected:[...this.collected]};}
  restore(saved={}){this.collected=new Set(saved.collected??[]);}
}
