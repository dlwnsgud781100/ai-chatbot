import * as THREE from 'three';
import { NPC_DATABASE } from '../data/rpg-content.js';

const chunkKey=(position,size=48)=>`${Math.floor(position.x/size)}:${Math.floor(position.z/size)}`;
/** NPCs expose role-driven dialogue actions; they don't mutate quest or shop state directly. */
export class NPCManager {
  constructor(events,renderer,quests){this.events=events;this.renderer=renderer;this.quests=quests;this.entities=new Map();this.definitions=Object.values(NPC_DATABASE);}
  sync(activeChunkKeys){for(const npc of this.definitions){const active=activeChunkKeys.has(chunkKey(npc.position)),entity=this.entities.get(npc.id);if(active&&!entity){const object=this.renderer.createNpc(npc);const position=new THREE.Vector3(npc.position.x,this.renderer.getGroundHeight(npc.position.x,npc.position.z),npc.position.z);this.entities.set(npc.id,{id:npc.id,type:'npc',data:npc,object,position});}else if(!active&&entity){this.renderer.removeObject(entity.object);this.entities.delete(npc.id);}}}
  getAll(){return [...this.entities.values()];}
  update(playerPosition){for(const entity of this.entities.values())entity.object.visible=entity.position.distanceTo(playerPosition)<72;}
  interact(entity){const npc=entity.data,ready=this.quests.readyFor(npc.id)[0],available=this.quests.availableFor(npc.id)[0];if(ready){this.events.emit('ui:dialogue',{speaker:npc.name,text:`${npc.dialogue.turnIn??'의뢰를 완수하셨군요.'}\n\n[보고] ${ready.title}`,choices:[{label:'의뢰 보고',action:()=>this.quests.turnIn(ready.id,npc.id)},{label:'나중에',action:null}]});return true;}if(available){this.events.emit('ui:dialogue',{speaker:npc.name,text:`${npc.dialogue.accept??'새로운 의뢰가 있습니다.'}\n\n[수락] ${available.title}`,choices:[{label:'의뢰 수락',action:()=>this.quests.accept(available.id)},{label:'거절',action:null}]});return true;}if(npc.shopId){this.events.emit('ui:dialogue',{speaker:npc.name,text:npc.dialogue.shop??npc.dialogue.idle,choices:[{label:'상점 열기',action:()=>this.events.emit('shop:open',{shopId:npc.shopId})},{label:'대화 종료',action:null}]});return true;}this.events.emit('ui:dialogue',{speaker:npc.name,text:npc.dialogue.idle,choices:[{label:'확인',action:null}]});return true;}
}
