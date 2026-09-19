// Combat owns semantic cue requests; AudioService selects routed synthesized/asset playback.
export class CombatFeedback {
  constructor(renderer,events=null){this.renderer=renderer;this.events=events;}
  unlock(){this.events?.emit('audio:unlock',{});}
  play(id,options={}){this.events?.emit('audio:play',{id,options});}
  playerSwing(action){this.unlock();this.play(action.id==='heavy'?'player.swing.heavy':action.id==='rift'||action.id==='ultimate'?'player.skill':'player.swing.light');}
  impact({critical=false,type='physical',heavy=false}){this.unlock();this.play(critical||heavy?'combat.hit.critical':'combat.hit',{pitch:type==='lightning'?1.5:type==='ice'?1.8:type==='fire'?1.2:1});}
  guard(parry){this.unlock();this.play(parry?'player.parry':'combat.hit',{volume:parry?1:.35});}
  enemyTelegraph(boss){this.unlock();this.play(boss?'combat.boss-warning':'combat.hit',{volume:boss?1:.25,pitch:boss ? .45 : .62});}
}
