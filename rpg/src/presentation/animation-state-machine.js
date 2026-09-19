export const ANIMATION_STATES=Object.freeze({
  IDLE:'Idle',WALK:'Walk',RUN:'Run',SPRINT:'Sprint',JUMP:'Jump',FALL:'Fall',LAND:'Land',
  LIGHT_1:'LightAttack1',LIGHT_2:'LightAttack2',LIGHT_3:'LightAttack3',HEAVY:'HeavyAttack',SKILL:'Skill',DODGE:'Dodge',DASH:'Dash',GUARD:'Guard',PARRY:'Parry',HIT:'Hit',STAGGER:'Stagger',DEATH:'Death',VICTORY:'Victory',
});

export const ACTION_TO_ANIMATION=Object.freeze({light_1:ANIMATION_STATES.LIGHT_1,light_2:ANIMATION_STATES.LIGHT_2,light_3:ANIMATION_STATES.LIGHT_3,heavy:ANIMATION_STATES.HEAVY,rift:ANIMATION_STATES.SKILL,air:ANIMATION_STATES.HEAVY,ultimate:ANIMATION_STATES.SKILL,dodge:ANIMATION_STATES.DODGE,dash:ANIMATION_STATES.DASH});

const priority=Object.freeze({[ANIMATION_STATES.DEATH]:100,[ANIMATION_STATES.STAGGER]:90,[ANIMATION_STATES.PARRY]:85,[ANIMATION_STATES.HEAVY]:80,[ANIMATION_STATES.SKILL]:80,[ANIMATION_STATES.LIGHT_3]:75,[ANIMATION_STATES.LIGHT_2]:74,[ANIMATION_STATES.LIGHT_1]:73,[ANIMATION_STATES.DODGE]:70,[ANIMATION_STATES.DASH]:68,[ANIMATION_STATES.GUARD]:60,[ANIMATION_STATES.JUMP]:50,[ANIMATION_STATES.FALL]:50,[ANIMATION_STATES.LAND]:48,[ANIMATION_STATES.SPRINT]:30,[ANIMATION_STATES.RUN]:20,[ANIMATION_STATES.WALK]:10,[ANIMATION_STATES.IDLE]:0});

/**
 * Semantic controller only: no clips are claimed or embedded. Future adapters can bind GLTF
 * clips, animation events, cancel windows and root motion without touching combat logic.
 */
export class AnimationStateMachine {
  constructor(){this.current=ANIMATION_STATES.IDLE;this.elapsed=0;this.lock=0;this.timeline=null;this.lastEvent=null;this.rootMotionAdapter=null;}
  setRootMotionAdapter(adapter){this.rootMotionAdapter=adapter??null;}
  transition(next,{lock=0,force=false,event=null}={}){if(!Object.values(ANIMATION_STATES).includes(next))return false;if(!force&&this.lock>0&&priority[next]<priority[this.current])return false;if(next===this.current&&!force)return false;this.current=next;this.elapsed=0;this.lock=Math.max(0,lock);this.lastEvent=event;return true;}
  action(action){const state=ACTION_TO_ANIMATION[action.id]??ANIMATION_STATES.SKILL;const windup=action.windup??0,active=action.active??0,recovery=action.recovery??.16;this.timeline={actionId:action.id,windup,active,recovery,contactAt:windup,cancelAt:action.cancelAt??windup+active};return this.transition(state,{lock:windup+active+recovery,event:{phase:'start',actionId:action.id}});}
  canCancelInto(next){return this.lock<=0||Boolean(this.timeline&&this.elapsed>=this.timeline.cancelAt&&priority[next]>=priority[this.current]);}
  animationEvent(phase,payload={}){this.lastEvent={phase,...payload};return this.lastEvent;}
  consumeRootMotion(delta){return this.rootMotionAdapter?.consume?.(this.current,delta,this.snapshot())??null;}
  update(delta,{velocity=0,sprinting=false,airborne=false,guarding=false}={}){this.elapsed+=delta;this.lock=Math.max(0,this.lock-delta);if(this.timeline&&this.elapsed>=this.timeline.contactAt&&this.lastEvent?.phase==='start')this.animationEvent('contact',{actionId:this.timeline.actionId});if(this.lock>0)return false;this.timeline=null;if(airborne)return this.transition(ANIMATION_STATES.FALL);if(guarding)return this.transition(ANIMATION_STATES.GUARD);if(sprinting&&velocity>.15)return this.transition(ANIMATION_STATES.SPRINT);if(velocity>5)return this.transition(ANIMATION_STATES.RUN);if(velocity>.15)return this.transition(ANIMATION_STATES.WALK);return this.transition(ANIMATION_STATES.IDLE);}
  snapshot(){return {state:this.current,elapsed:this.elapsed,locked:this.lock,timeline:this.timeline,event:this.lastEvent};}
}
