import * as THREE from 'three';
import { NPCS } from '../data/content.js';
import { EVENT } from '../core/constants.js';
export class NPCManager {
  constructor(events,renderer,quests) { this.events=events;this.renderer=renderer;this.quests=quests;this.entities=[]; }
  create() { for(const npc of Object.values(NPCS)) { const object=this.renderer.createNpc(npc);this.entities.push({id:npc.id,type:'npc',data:npc,object,position:new THREE.Vector3(npc.position.x,0,npc.position.z)}); } }
  getAll(){return this.entities;}
  interact(entity) { const npc=entity.data; const current=this.quests.current; const isReport=current?.id==='watcher_signal'; const line=isReport?npc.dialogue[2]:this.quests.completed.includes('breach_line')?npc.dialogue[1]:npc.dialogue[0]; this.events.emit('ui:dialogue',{speaker:npc.name,text:line,onComplete:()=>this.quests.advance('interact',npc.id)}); return true; }
}
