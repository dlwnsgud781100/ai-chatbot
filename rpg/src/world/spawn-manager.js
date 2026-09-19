import { ENEMIES, ZONES } from '../data/content.js';
import { EVENT } from '../core/constants.js';
import { EnemyAiSystem } from '../combat/enemy-ai-system.js';

const chunkKey=(position,size=48)=>`${Math.floor(position.x/size)}:${Math.floor(position.z/size)}`;

/** Spawn ownership follows streamable chunk data; each entity owns a data-driven AI state machine. */
export class SpawnManager {
  constructor(events,renderer) { this.events=events;this.renderer=renderer;this.ai=new EnemyAiSystem(renderer);this.entities=new Map();this.defeated=new Set();this.availability=()=>true;this.definitions=Object.values(ZONES).flatMap((zone)=>zone.spawns.map((entry)=>({...entry,zoneId:zone.id}))); }
  setAvailability(check){this.availability=typeof check==='function'?check:()=>true;}
  spawn(definition) { const data=ENEMIES[definition.enemyId];if(!data)throw new Error(`Unknown enemy: ${definition.enemyId}`);const object=this.renderer.createEnemy(data);object.position.set(definition.position.x,this.renderer.getGroundHeight(definition.position.x,definition.position.z),definition.position.z);const entity={id:definition.id,type:'enemy',data,definition,object,position:object.position,health:data.maxHealth,maxHealth:data.maxHealth,alive:true,active:true,hitTimer:0};this.ai.initialize(entity);this.entities.set(definition.id,entity);this.events.emit(EVENT.ENTITY_SPAWNED,{entity});return entity; }
  sync(activeChunkKeys){for(const definition of this.definitions){const shouldExist=activeChunkKeys.has(chunkKey(definition.position))&&!this.defeated.has(definition.id)&&this.availability(definition);const entity=this.entities.get(definition.id);if(shouldExist&&!entity)this.spawn(definition);else if(!shouldExist&&entity)this.despawn(entity);}}
  getAlive(){return [...this.entities.values()].filter((entity)=>entity.alive);}
  get count(){return this.entities.size;}
  despawn(entity){entity.active=false;this.renderer.removeObject(entity.object);this.entities.delete(entity.id);}
  remove(entity){if(!this.entities.has(entity.id))return;entity.alive=false;entity.aiState='Dead';this.defeated.add(entity.id);this.despawn(entity);this.events.emit(EVENT.ENTITY_REMOVED,{entity});}
  update(delta,playerPosition,callbacks) { for(const enemy of this.getAlive()) { enemy.hitTimer=Math.max(0,enemy.hitTimer-delta);this.ai.update(enemy,delta,playerPosition,callbacks); } }
  snapshot(){return {defeated:[...this.defeated]};}
  restore(saved={}){this.defeated=new Set(saved.defeated??[]);}
}
