import * as THREE from 'three';
import { WORLD } from '../core/constants.js';
import { ZoneManager } from './zone-manager.js';
import { EnvironmentManager } from './environment-manager.js';
import { SpawnManager } from './spawn-manager.js';
import { NPCManager } from './npc-manager.js';

export class WorldManager {
  constructor(events,renderer,quests) { this.events=events;this.renderer=renderer;this.quests=quests;this.zones=new ZoneManager(events);this.environment=new EnvironmentManager(renderer);this.spawns=new SpawnManager(events,renderer);this.npcs=new NPCManager(events,renderer,quests);this.interactables=[]; }
  async initialize() { this.renderer.createWorld();this.npcs.create();this.spawns.createDefaultPopulation();this.interactables=[...this.npcs.getAll(),{id:'campfire',type:'campfire',data:{name:'길잡이 불씨',text:'따뜻한 불씨가 균열 너머의 길을 비춥니다.'},position:new THREE.Vector3(-10,0,10),object:this.renderer.campfire}]; }
  getGroundHeight(x,z){return this.renderer.getGroundHeight(x,z);}
  constrainPosition(position) { position.x=Math.max(-56,Math.min(60,position.x));position.z=Math.max(-40,Math.min(45,position.z)); if(position.x>20&&position.x<24){position.x=19.9;this.events.emit('ui:notify',{message:'잿불 낙하 지대는 다음 지역 업데이트에서 열립니다.',type:'warning'});} }
  update(delta,playerPosition,attackPlayer) { const zone=this.zones.update(playerPosition);this.environment.update(delta,zone);this.spawns.update(delta,playerPosition,attackPlayer); }
  getNearestInteractable(position,range=WORLD.INTERACTION_RANGE) { let found=null;let best=range;for(const entity of this.interactables){const distance=entity.position.distanceTo(position);if(distance<best){best=distance;found=entity;}}return found; }
  interact(entity) { if(entity.type==='npc')return this.npcs.interact(entity);if(entity.type==='campfire'){this.events.emit('ui:dialogue',{speaker:entity.data.name,text:entity.data.text});return true;}return false; }
}
