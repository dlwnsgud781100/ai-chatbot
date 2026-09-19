import * as THREE from 'three';
import { NPCS } from '../data/content.js';

const chunkKey=(position,size=48)=>`${Math.floor(position.x/size)}:${Math.floor(position.z/size)}`;
export class NPCManager {
  constructor(events,renderer,quests) { this.events=events;this.renderer=renderer;this.quests=quests;this.entities=new Map();this.definitions=Object.values(NPCS); }
  sync(activeChunkKeys){for(const npc of this.definitions){const active=activeChunkKeys.has(chunkKey(npc.position));const entity=this.entities.get(npc.id);if(active&&!entity){const object=this.renderer.createNpc(npc);const position=new THREE.Vector3(npc.position.x,this.renderer.getGroundHeight(npc.position.x,npc.position.z),npc.position.z);this.entities.set(npc.id,{id:npc.id,type:'npc',data:npc,object,position});}else if(!active&&entity){this.renderer.removeObject(entity.object);this.entities.delete(npc.id);}}}
  getAll(){return [...this.entities.values()];}
  update(playerPosition){for(const entity of this.entities.values()){const close=entity.position.distanceTo(playerPosition)<72;entity.object.visible=close;}}
  interact(entity) { const npc=entity.data; const current=this.quests.current; const isReport=current?.id==='watcher_signal'; const line=isReport&&npc.id==='arin'?npc.dialogue.at(-1):this.quests.completed.includes('breach_line')&&npc.id==='arin'?npc.dialogue[1]:npc.dialogue[0]; this.events.emit('ui:dialogue',{speaker:npc.name,text:line,onComplete:()=>this.quests.advance('interact',npc.id)}); return true; }
}
