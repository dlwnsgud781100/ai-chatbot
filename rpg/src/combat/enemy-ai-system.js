import * as THREE from 'three';
import { BOSS_PROFILES, ENEMY_COMBAT_PROFILES } from '../data/combat-data.js';

const clonePosition=(position)=>new THREE.Vector3(position.x,position.y,position.z);
const profileFor=(entity)=>ENEMY_COMBAT_PROFILES[entity.data.id]??ENEMY_COMBAT_PROFILES.default;

/** Data-driven enemy state machine: Idle → Patrol → Detect → Chase → Telegraph → Attack → Recover. */
export class EnemyAiSystem {
  constructor(renderer) { this.renderer=renderer; }
  initialize(entity) { const profile=profileFor(entity);entity.resistances=profile.resistances??{};entity.ai={state:'idle',timer:.4,profile,home:clonePosition(entity.position),patternIndex:0,currentPattern:null,hasHit:false,stagger:0,staggerDecay:0,stunTime:0,phaseIndex:0,enraged:false,weakPointOpen:false};entity.aiState='Idle'; }
  profile(entity){return entity.ai?.profile??profileFor(entity);}
  bossProfile(entity){return entity.data.bossProfile?BOSS_PROFILES[entity.data.bossProfile]:null;}
  setState(entity,state,duration=0){entity.ai.state=state;entity.ai.timer=duration;entity.aiState=state[0].toUpperCase()+state.slice(1);}
  update(entity,delta,playerPosition,callbacks) { if(!entity.ai)this.initialize(entity);const ai=entity.ai;const profile=this.profile(entity);const distance=entity.position.distanceTo(playerPosition);const boss=this.bossProfile(entity);if(boss&&distance<profile.detectRange&&!ai.bossStarted){ai.bossStarted=true;callbacks.onBossPhase?.(entity,boss.phases[0],1);}this.updateBossPhase(entity,callbacks);if(ai.stunTime>0){ai.stunTime-=delta;this.setState(entity,'stunned',ai.stunTime);this.renderer.animateEnemy(entity,delta,false);if(ai.stunTime<=0)this.setState(entity,'recover',.25);return;}
    if(!entity.data.boss&&profile.fleeAt&&entity.health/entity.maxHealth<=profile.fleeAt&&ai.state!=='flee'){this.setState(entity,'flee',1.4);}if(distance>profile.leashRange&&ai.state!=='return'){this.setState(entity,'return');ai.currentPattern=null;this.renderer.clearEnemyTelegraph(entity);}
    switch(ai.state){
      case 'idle': case 'patrol':
        ai.timer-=delta;this.renderer.animateEnemy(entity,delta,false);if(distance<=profile.detectRange)this.setState(entity,'detect',.2);else if(ai.timer<=0)this.setState(entity,'patrol',1.2+Math.random()*1.8);break;
      case 'detect':
        this.renderer.animateEnemy(entity,delta,false);ai.timer-=delta;if(ai.timer<=0)this.setState(entity,'chase');break;
      case 'chase':
        if(distance>profile.leashRange){this.setState(entity,'return');break;}const pattern=this.choosePattern(entity,distance);if(pattern){ai.currentPattern=pattern;ai.hasHit=false;this.setState(entity,'telegraph',pattern.windup);this.renderer.setEnemyTelegraph(entity,pattern,true);callbacks.onTelegraph?.(entity,pattern);break;}this.moveToward(entity,playerPosition,delta,entity.data.speed*(ai.enraged?1.2:1));break;
      case 'telegraph':
        this.face(entity,playerPosition);this.renderer.animateEnemy(entity,delta,false);ai.timer-=delta;ai.weakPointOpen=Boolean(this.currentBossPhase(entity)?.weakPoint);if(ai.timer<=0){this.setState(entity,'attack',ai.currentPattern.active);this.renderer.playEnemyPattern(entity,ai.currentPattern);}
        break;
      case 'attack':
        this.face(entity,playerPosition);if(ai.currentPattern?.dash)this.moveToward(entity,playerPosition,delta,entity.data.speed*4.2);ai.timer-=delta;if(!ai.hasHit){ai.hasHit=true;callbacks.onAttack(entity,ai.currentPattern,playerPosition);}if(ai.timer<=0){this.renderer.clearEnemyTelegraph(entity);ai.weakPointOpen=false;this.setState(entity,'recover',ai.currentPattern.recovery);}
        break;
      case 'recover':
        this.renderer.animateEnemy(entity,delta,false);ai.timer-=delta;if(ai.timer<=0)this.setState(entity,'chase');break;
      case 'flee':
        ai.timer-=delta;const retreat=entity.position.clone().sub(playerPosition).setY(0);if(retreat.lengthSq()>.01){retreat.normalize();entity.position.addScaledVector(retreat,entity.data.speed*1.45*delta);entity.position.y=this.renderer.getGroundHeight(entity.position.x,entity.position.z);entity.object.rotation.y=Math.atan2(retreat.x,retreat.z);}this.renderer.animateEnemy(entity,delta,true);if(ai.timer<=0)this.setState(entity,'return');break;
      case 'return':
        if(entity.position.distanceTo(ai.home)<.5){this.setState(entity,'idle',1);break;}this.moveToward(entity,ai.home,delta,entity.data.speed*.8);break;
      default:this.setState(entity,'idle',.5);
    }
  }
  choosePattern(entity,distance){const phase=this.currentBossPhase(entity);const patterns=phase?.patterns??this.profile(entity).patterns;const candidates=patterns.filter((pattern)=>distance<=pattern.range+(pattern.projectile?2:0));if(!candidates.length)return null;const ai=entity.ai;const pattern=candidates[ai.patternIndex%candidates.length];ai.patternIndex++;return pattern;}
  currentBossPhase(entity){const boss=this.bossProfile(entity);return boss?.phases[entity.ai?.phaseIndex??0]??null;}
  updateBossPhase(entity,callbacks){const boss=this.bossProfile(entity);if(!boss)return;const ratio=entity.health/entity.maxHealth;let desired=0;for(let index=0;index<boss.phases.length;index++)if(ratio<=boss.phases[index].threshold)desired=index;if(desired!==entity.ai.phaseIndex){entity.ai.phaseIndex=desired;entity.ai.currentPattern=null;entity.ai.stagger=0;this.setState(entity,'recover',.65);this.renderer.setBossPhase(entity,boss.phases[desired]);callbacks.onBossPhase?.(entity,boss.phases[desired],desired+1);}if(ratio<=boss.enrageAt&&!entity.ai.enraged){entity.ai.enraged=true;callbacks.onEnrage?.(entity);}}
  moveToward(entity,target,delta,speed){const direction=target.clone().sub(entity.position).setY(0);if(direction.lengthSq()<.01)return;direction.normalize();entity.position.addScaledVector(direction,speed*delta);entity.position.y=this.renderer.getGroundHeight(entity.position.x,entity.position.z);entity.object.rotation.y=Math.atan2(direction.x,direction.z);this.renderer.animateEnemy(entity,delta,true);}
  face(entity,target){const direction=target.clone().sub(entity.position).setY(0);if(direction.lengthSq()>.01)entity.object.rotation.y=Math.atan2(direction.x,direction.z);}
  addStagger(entity,amount){if(!entity.ai)this.initialize(entity);const threshold=this.bossProfile(entity)?.staggerThreshold??this.profile(entity).staggerThreshold??Infinity;if(!Number.isFinite(threshold))return false;entity.ai.stagger=Math.min(threshold,entity.ai.stagger+amount);if(entity.ai.stagger>=threshold){entity.ai.stagger=0;this.stun(entity,entity.data.boss?2.5:1.4);return true;}return false;}
  stun(entity,duration){if(!entity.ai)this.initialize(entity);entity.ai.stunTime=Math.max(entity.ai.stunTime,duration);entity.ai.currentPattern=null;entity.ai.weakPointOpen=false;this.renderer.clearEnemyTelegraph(entity);this.setState(entity,'stunned',duration);this.renderer.playStunEffect(entity);}
  isWeakPointOpen(entity){return Boolean(entity.ai?.weakPointOpen);}
}
