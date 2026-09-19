import * as THREE from 'three';
import { EVENT, WORLD } from '../core/constants.js';

export class TargetingSystem {
  constructor(events,spawns) { this.events=events;this.spawns=spawns;this.target=null;this.locked=false;this.lastPlayerPosition=null; }
  candidates(playerPosition,cameraForward){const view=cameraForward.clone().setY(0).normalize();return this.spawns.getAlive().map((entity)=>{const offset=entity.position.clone().sub(playerPosition);const distance=offset.length();const direction=offset.setY(0).normalize();const dot=Math.max(-1,Math.min(1,view.dot(direction)));const inView=dot>.12;const score=distance*1.45+(1-dot)*7-(entity.data.boss?5:entity.data.elite?2:0);return {entity,distance,dot,inView,score};}).filter((entry)=>entry.distance<WORLD.TARGET_RANGE&&entry.inView).sort((a,b)=>a.score-b.score);}
  update(playerPosition,cameraForward){this.lastPlayerPosition=playerPosition;const choices=this.candidates(playerPosition,cameraForward);if(this.locked){const valid=this.spawns.getAlive().find((entry)=>entry===this.target&&entry.position.distanceTo(playerPosition)<WORLD.TARGET_RANGE*1.3);if(!valid){this.locked=false;this.setTarget(choices[0]?.entity??null);}}else this.setTarget(choices[0]?.entity??null);return this.target;}
  setTarget(next){if(next===this.target)return;this.target=next;this.events.emit(EVENT.TARGET_CHANGED,{target:next,locked:this.locked});}
  toggleLock(playerPosition,cameraForward){this.update(playerPosition,cameraForward);if(!this.target){this.events.emit(EVENT.NOTIFY,{message:'시야 안에 고정할 적이 없습니다.',type:'warning'});return false;}this.locked=!this.locked;this.events.emit(EVENT.TARGET_CHANGED,{target:this.target,locked:this.locked});this.events.emit(EVENT.NOTIFY,{message:this.locked?`${this.target.data.name} 고정`:'타겟 고정 해제',type:'info'});return this.locked;}
  cycle(playerPosition,cameraForward,direction=1){const choices=this.candidates(playerPosition,cameraForward);if(!choices.length){this.setTarget(null);return null;}const index=Math.max(0,choices.findIndex((entry)=>entry.entity===this.target));const next=choices[(index+direction+choices.length)%choices.length].entity;this.locked=true;this.setTarget(next);return next;}
  clear(target){if(this.target===target){this.target=null;this.locked=false;this.events.emit(EVENT.TARGET_CHANGED,{target:null,locked:false});}}
}
