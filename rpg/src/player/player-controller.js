import * as THREE from 'three';
import { CONFIG } from '../core/config.js';
import { EVENT, GAME_STATE, INPUT } from '../core/constants.js';

const keyPressed=(keys,bindings)=>bindings.some((binding)=>keys.has(binding));

export class PlayerController {
  constructor({events,player,renderer,world,combat,interaction,animator,gameState}) {this.events=events;this.player=player;this.renderer=renderer;this.world=world;this.combat=combat;this.interaction=interaction;this.animator=animator;this.gameState=gameState;this.keys=new Set();this.velocityY=0;this.verticalOffset=0;this.dodgeTime=0;this.dashTime=0;this.knockbackTime=0;this.actionLockTime=0;this.dodgeDirection=new THREE.Vector3();this.knockbackVelocity=new THREE.Vector3();this.lastNetworkIntent=0;this.mouseLook=false;this.suppressContextMenuUntil=0;this._onKeyDown=this.onKeyDown.bind(this);this._onKeyUp=this.onKeyUp.bind(this);this._onMouseDown=this.onMouseDown.bind(this);this._onPointerMove=this.onPointerMove.bind(this);this._onPointerUp=this.onPointerUp.bind(this);this._onContextMenu=(event)=>{if(this.mouseLook||performance.now()<this.suppressContextMenuUntil)event.preventDefault();};}
  bind(){window.addEventListener('keydown',this._onKeyDown);window.addEventListener('keyup',this._onKeyUp);window.addEventListener('mousedown',this._onMouseDown);window.addEventListener('pointermove',this._onPointerMove);window.addEventListener('pointerup',this._onPointerUp);window.addEventListener('contextmenu',this._onContextMenu);window.addEventListener('pointerdown',()=>this.combat.feedback.unlock(),{once:true});}
  dispose(){window.removeEventListener('keydown',this._onKeyDown);window.removeEventListener('keyup',this._onKeyUp);window.removeEventListener('mousedown',this._onMouseDown);window.removeEventListener('pointermove',this._onPointerMove);window.removeEventListener('pointerup',this._onPointerUp);window.removeEventListener('contextmenu',this._onContextMenu);}
  onKeyDown(event){if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;if([INPUT.INVENTORY,INPUT.QUESTS,INPUT.CHARACTER,INPUT.MAP,INPUT.MENU,INPUT.DEBUG].includes(event.code))return;this.keys.add(event.code);if(event.repeat)return;if(!this.gameState.is(GAME_STATE.PLAYING))return;
    if(event.code===INPUT.INTERACT)this.interaction.interact();
    if(event.code===INPUT.LIGHT)this.combat.useAction(this.isAirborne()?'air':'light');
    if(event.code===INPUT.HEAVY)this.combat.useAction('heavy');
    if(event.code===INPUT.SKILL)this.combat.useAction('rift');
    if(event.code===INPUT.POTION)this.combat.useAction('potion');
    if(event.code===INPUT.DODGE)this.combat.useAction('dodge');
    if(event.code===INPUT.DASH)this.combat.useAction('dash');
    if(event.code===INPUT.ULTIMATE)this.combat.useAction('ultimate');
    if(event.code===INPUT.GUARD)this.combat.beginGuard();
    if(event.code===INPUT.TARGET_LOCK)this.combat.toggleTargetLock();
    if(event.code===INPUT.TARGET_CYCLE)this.combat.cycleTarget();
    if(event.code===INPUT.JUMP)this.jump();
  }
  onKeyUp(event){this.keys.delete(event.code);if(event.code===INPUT.GUARD)this.combat.endGuard();}
  onMouseDown(event){if(event.button===2&&this.gameState.is(GAME_STATE.PLAYING)&&!event.target.closest('button')){event.preventDefault();this.suppressContextMenuUntil=performance.now()+600;this.mouseLook=true;return;}if(event.button===0&&this.gameState.is(GAME_STATE.PLAYING)&&!event.target.closest('button'))this.combat.useAction(this.isAirborne()?'air':'light');}
  onPointerMove(event){if(this.mouseLook&&this.gameState.is(GAME_STATE.PLAYING))this.renderer.orbitCamera(event.movementX??0,event.movementY??0);}
  onPointerUp(event){if(event.button===2)this.mouseLook=false;}
  jump(){if(this.verticalOffset>.02||this.actionLockTime>.1)return;this.velocityY=CONFIG.player.jumpVelocity;this.player.state='jump';this.events.emit('player:jump',{});}
  beginDodge(){const movement=this.getMovementVector();this.dodgeDirection.copy(movement.lengthSq()>.1?movement:this.renderer.getForwardDirection()).normalize();this.dodgeTime=.3;this.actionLockTime=.18;}
  beginDash(){const movement=this.getMovementVector();this.dodgeDirection.copy(movement.lengthSq()>.1?movement:this.renderer.getForwardDirection()).normalize();this.dashTime=.18;this.actionLockTime=.1;}
  applyKnockback(direction,power=4){this.knockbackVelocity.copy(direction).setY(0).normalize().multiplyScalar(power);this.knockbackTime=.18;}
  setActionLock(duration){this.actionLockTime=Math.max(this.actionLockTime,duration);}
  isInvulnerable(){return this.dodgeTime>0||this.dashTime>.07;}
  isAirborne(){return this.verticalOffset>.3;}
  getMovementVector(){const direction=new THREE.Vector3(),forward=this.renderer.getForwardDirection(),right=this.renderer.getRightDirection();forward.y=0;right.y=0;forward.normalize();right.normalize();if(keyPressed(this.keys,INPUT.FORWARD))direction.add(forward);if(keyPressed(this.keys,INPUT.BACK))direction.sub(forward);if(keyPressed(this.keys,INPUT.RIGHT))direction.add(right);if(keyPressed(this.keys,INPUT.LEFT))direction.sub(right);return direction.lengthSq()>0?direction.normalize():direction;}
  update(delta,now){if(!this.gameState.is(GAME_STATE.PLAYING))return;const position=this.renderer.player.position,movement=this.getMovementVector();let movingSpeed=0;this.actionLockTime=Math.max(0,this.actionLockTime-delta);
    if(this.knockbackTime>0){this.knockbackTime-=delta;position.addScaledVector(this.knockbackVelocity,delta);this.knockbackVelocity.multiplyScalar(.84);this.player.state='staggered';}
    else if(this.dodgeTime>0){this.dodgeTime-=delta;movingSpeed=15;position.addScaledVector(this.dodgeDirection,movingSpeed*delta);this.player.state='dodge';}
    else if(this.dashTime>0){this.dashTime-=delta;movingSpeed=18;position.addScaledVector(this.dodgeDirection,movingSpeed*delta);this.player.state='dash';}
    else if(movement.lengthSq()>0){const guarding=this.combat.isGuarding();const sprint=this.keys.has(INPUT.SPRINT)&&this.player.stats.energy>0&&!guarding;const lockMultiplier=this.actionLockTime>0 ? .42 : 1;movingSpeed=(sprint?CONFIG.player.sprintSpeed:CONFIG.player.walkSpeed)*(guarding ? .38 : lockMultiplier);if(sprint)this.player.stats.energy=Math.max(0,this.player.stats.energy-17*delta);position.addScaledVector(movement,movingSpeed*delta);this.player.rotation=Math.atan2(movement.x,movement.z);this.renderer.setPlayerFacing(this.player.rotation);this.player.state=guarding?'guard':sprint?'sprint':'run';}
    else {this.player.state=this.combat.isGuarding()?'guard':'idle';this.player.stats.restoreEnergy(this.combat.isGuarding()?4*delta:12*delta);}
    const wasAirborne=this.isAirborne();this.velocityY-=CONFIG.player.gravity*delta;this.verticalOffset+=this.velocityY*delta;if(this.verticalOffset<=0){this.verticalOffset=0;this.velocityY=0;if(wasAirborne)this.events.emit('player:land',{});}position.y=this.world.getGroundHeight(position.x,position.z)+this.verticalOffset;this.world.constrainPosition(position);this.player.position.x=position.x;this.player.position.y=position.y;this.player.position.z=position.z;this.animator?.update(delta,movingSpeed,{sprinting:this.player.state==='sprint',airborne:this.isAirborne(),guarding:this.combat.isGuarding()});this.interaction.update(position);this.events.emit(EVENT.PLAYER_CHANGED,{player:this.player,velocity:movingSpeed});
    if(now-this.lastNetworkIntent>CONFIG.network.sendIntentEveryMs&&movement.lengthSq()>.05){this.lastNetworkIntent=now;this.events.emit('network:intent',{type:'move',position:{x:Number(position.x.toFixed(2)),z:Number(position.z.toFixed(2))}});}
  }
}
