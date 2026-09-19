import * as THREE from 'three';
import { CONFIG } from '../core/config.js';
import { EVENT, GAME_STATE, INPUT } from '../core/constants.js';

const keyPressed = (keys, bindings) => bindings.some((binding) => keys.has(binding));

export class PlayerController {
  constructor({events, player, renderer, world, combat, interaction, animator, gameState}) {
    this.events=events; this.player=player; this.renderer=renderer; this.world=world; this.combat=combat; this.interaction=interaction; this.animator=animator; this.gameState=gameState;
    this.keys=new Set(); this.velocityY=0; this.verticalOffset=0; this.dodgeTime=0; this.dodgeDirection=new THREE.Vector3(); this.lastNetworkIntent=0;
    this._onKeyDown=this.onKeyDown.bind(this); this._onKeyUp=this.onKeyUp.bind(this); this._onMouseDown=this.onMouseDown.bind(this);
  }
  bind() { window.addEventListener('keydown',this._onKeyDown); window.addEventListener('keyup',this._onKeyUp); window.addEventListener('mousedown',this._onMouseDown); }
  dispose() { window.removeEventListener('keydown',this._onKeyDown); window.removeEventListener('keyup',this._onKeyUp); window.removeEventListener('mousedown',this._onMouseDown); }
  onKeyDown(event) {
    if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if ([INPUT.INVENTORY,INPUT.QUESTS,INPUT.CHARACTER,INPUT.MENU,INPUT.DEBUG].includes(event.code)) return;
    this.keys.add(event.code);
    if (event.repeat) return;
    if (event.code===INPUT.INTERACT && this.gameState.is(GAME_STATE.PLAYING)) this.interaction.interact();
    if (event.code===INPUT.ATTACK && this.gameState.is(GAME_STATE.PLAYING)) this.combat.useSkill('basic');
    if (event.code===INPUT.ARCANE && this.gameState.is(GAME_STATE.PLAYING)) this.combat.useSkill('arcane');
    if (event.code===INPUT.POTION && this.gameState.is(GAME_STATE.PLAYING)) this.combat.useSkill('potion');
    if (event.code===INPUT.DODGE && this.gameState.is(GAME_STATE.PLAYING)) this.combat.useSkill('dodge');
    if (event.code===INPUT.JUMP && this.gameState.is(GAME_STATE.PLAYING)) this.jump();
  }
  onKeyUp(event) { this.keys.delete(event.code); }
  onMouseDown(event) { if (event.button===0 && this.gameState.is(GAME_STATE.PLAYING) && !event.target.closest('button')) this.combat.useSkill('basic'); }
  jump() { if (this.verticalOffset>.02) return; this.velocityY=CONFIG.player.jumpVelocity; this.player.state='jump'; }
  beginDodge() { const movement=this.getMovementVector(); this.dodgeDirection.copy(movement.lengthSq()>.1?movement:this.renderer.getForwardDirection()).normalize(); this.dodgeTime=.24; }
  getMovementVector() { const direction=new THREE.Vector3(); const forward=this.renderer.getForwardDirection(); const right=this.renderer.getRightDirection(); forward.y=0;right.y=0;forward.normalize();right.normalize(); if(keyPressed(this.keys,INPUT.FORWARD)) direction.add(forward); if(keyPressed(this.keys,INPUT.BACK)) direction.sub(forward); if(keyPressed(this.keys,INPUT.RIGHT)) direction.add(right); if(keyPressed(this.keys,INPUT.LEFT)) direction.sub(right); return direction.lengthSq()>0?direction.normalize():direction; }
  update(delta, now) {
    if (!this.gameState.is(GAME_STATE.PLAYING)) return;
    const position=this.renderer.player.position;
    const movement=this.getMovementVector(); let movingSpeed=0;
    if(this.dodgeTime>0) { this.dodgeTime-=delta; movingSpeed=15; position.addScaledVector(this.dodgeDirection,movingSpeed*delta); this.player.state='dodge'; }
    else if(movement.lengthSq()>0) { const sprint=this.keys.has(INPUT.SPRINT)&&this.player.stats.energy>0; movingSpeed=sprint?CONFIG.player.sprintSpeed:CONFIG.player.walkSpeed; if(sprint) this.player.stats.energy=Math.max(0,this.player.stats.energy-17*delta); position.addScaledVector(movement,movingSpeed*delta); this.player.rotation=Math.atan2(movement.x,movement.z); this.renderer.setPlayerFacing(this.player.rotation); this.player.state=sprint?'sprint':'run'; }
    else { this.player.state='idle'; this.player.stats.restoreEnergy(12*delta); }
    this.velocityY-=CONFIG.player.gravity*delta; this.verticalOffset+=this.velocityY*delta; if(this.verticalOffset<=0) {this.verticalOffset=0;this.velocityY=0;} position.y=this.world.getGroundHeight(position.x,position.z)+this.verticalOffset;
    this.world.constrainPosition(position); this.player.position.x=position.x;this.player.position.y=position.y;this.player.position.z=position.z;
    this.animator?.update(delta,movingSpeed); this.interaction.update(position); this.events.emit(EVENT.PLAYER_CHANGED,{player:this.player,velocity:movingSpeed});
    if(now-this.lastNetworkIntent>CONFIG.network.sendIntentEveryMs && movement.lengthSq()>.05) { this.lastNetworkIntent=now; this.events.emit('network:intent',{type:'move',position:{x:Number(position.x.toFixed(2)),z:Number(position.z.toFixed(2))}}); }
  }
}
