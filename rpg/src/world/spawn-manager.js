import * as THREE from 'three';
import { ENEMIES } from '../data/content.js';
import { EVENT } from '../core/constants.js';
export class SpawnManager {
  constructor(events,renderer) { this.events=events;this.renderer=renderer;this.entities=[];this.sequence=0; }
  spawn(enemyId,x,z) { const data=ENEMIES[enemyId];if(!data)throw new Error(`Unknown enemy: ${enemyId}`);const object=this.renderer.createEnemy(data);object.position.set(x,this.renderer.getGroundHeight(x,z),z);const entity={id:`${enemyId}-${++this.sequence}`,type:'enemy',data,object,position:object.position,health:data.maxHealth,maxHealth:data.maxHealth,alive:true,attackTimer:.5,hitTimer:0,wanderTimer:Math.random()*3,wanderTarget:null};this.entities.push(entity);this.events.emit(EVENT.ENTITY_SPAWNED,{entity});return entity; }
  createDefaultPopulation() { [[-1,5],[-5,-3],[-16,-9],[3,-11],[-22,1]].forEach((p)=>this.spawn('thornwalker',...p)); [[11,13],[7,-18]].forEach((p)=>this.spawn('cinder_moth',...p)); this.spawn('rootwarden',-29,-18); }
  getAlive(){return this.entities.filter(entity=>entity.alive);}
  remove(entity){entity.alive=false;this.renderer.removeObject(entity.object);this.events.emit(EVENT.ENTITY_REMOVED,{entity});}
  update(delta,playerPosition,canAttackPlayer) { for(const enemy of this.getAlive()) { enemy.hitTimer=Math.max(0,enemy.hitTimer-delta);enemy.attackTimer-=delta; const distance=enemy.position.distanceTo(playerPosition); if(distance<enemy.data.aggroRange&&distance>enemy.data.attackRange){const direction=playerPosition.clone().sub(enemy.position).setY(0).normalize();enemy.position.addScaledVector(direction,enemy.data.speed*delta);enemy.position.y=this.renderer.getGroundHeight(enemy.position.x,enemy.position.z);enemy.object.rotation.y=Math.atan2(direction.x,direction.z);this.renderer.animateEnemy(enemy,delta,true);} else {this.renderer.animateEnemy(enemy,delta,false);if(distance<=enemy.data.attackRange&&enemy.attackTimer<=0){enemy.attackTimer=enemy.data.attackCooldown;canAttackPlayer(enemy);} } } }
}
