import * as THREE from 'three';
import { ENEMIES, ZONES } from '../data/content.js';
import { EVENT } from '../core/constants.js';

const chunkKey=(position,size=48)=>`${Math.floor(position.x/size)}:${Math.floor(position.z/size)}`;

/** Spawn ownership follows streamable chunk data rather than a permanent global enemy list. */
export class SpawnManager {
  constructor(events,renderer) { this.events=events;this.renderer=renderer;this.entities=new Map();this.defeated=new Set();this.definitions=Object.values(ZONES).flatMap((zone)=>zone.spawns.map((entry)=>({...entry,zoneId:zone.id}))); }
  spawn(definition) { const data=ENEMIES[definition.enemyId];if(!data)throw new Error(`Unknown enemy: ${definition.enemyId}`);const object=this.renderer.createEnemy(data);object.position.set(definition.position.x,this.renderer.getGroundHeight(definition.position.x,definition.position.z),definition.position.z);const entity={id:definition.id,type:'enemy',data,definition,object,position:object.position,health:data.maxHealth,maxHealth:data.maxHealth,alive:true,attackTimer:.5,hitTimer:0,wanderTimer:Math.random()*3,wanderTarget:null};this.entities.set(definition.id,entity);this.events.emit(EVENT.ENTITY_SPAWNED,{entity});return entity; }
  sync(activeChunkKeys){for(const definition of this.definitions){const shouldExist=activeChunkKeys.has(chunkKey(definition.position))&&!this.defeated.has(definition.id);const entity=this.entities.get(definition.id);if(shouldExist&&!entity)this.spawn(definition);else if(!shouldExist&&entity)this.despawn(entity);}}
  getAlive(){return [...this.entities.values()].filter((entity)=>entity.alive);}
  get count(){return this.entities.size;}
  despawn(entity){this.renderer.removeObject(entity.object);this.entities.delete(entity.id);}
  remove(entity){if(!this.entities.has(entity.id))return;entity.alive=false;this.defeated.add(entity.id);this.despawn(entity);this.events.emit(EVENT.ENTITY_REMOVED,{entity});}
  update(delta,playerPosition,canAttackPlayer) { for(const enemy of this.getAlive()) { enemy.hitTimer=Math.max(0,enemy.hitTimer-delta);enemy.attackTimer-=delta; const distance=enemy.position.distanceTo(playerPosition); if(distance<enemy.data.aggroRange&&distance>enemy.data.attackRange){const direction=playerPosition.clone().sub(enemy.position).setY(0).normalize();enemy.position.addScaledVector(direction,enemy.data.speed*delta);enemy.position.y=this.renderer.getGroundHeight(enemy.position.x,enemy.position.z);enemy.object.rotation.y=Math.atan2(direction.x,direction.z);this.renderer.animateEnemy(enemy,delta,true);} else {this.renderer.animateEnemy(enemy,delta,false);if(distance<=enemy.data.attackRange&&enemy.attackTimer<=0){enemy.attackTimer=enemy.data.attackCooldown;canAttackPlayer(enemy);} } } }
  snapshot(){return {defeated:[...this.defeated]};}
  restore(saved={}){this.defeated=new Set(saved.defeated??[]);}
}
