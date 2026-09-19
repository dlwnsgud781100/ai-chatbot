// Small synthesized cues avoid shipping copied audio assets while preserving action feedback.
export class CombatFeedback {
  constructor(renderer) { this.renderer=renderer;this.context=null; }
  unlock(){if(!this.context){const Audio=window.AudioContext||window.webkitAudioContext;if(Audio)this.context=new Audio();}if(this.context?.state==='suspended')this.context.resume();}
  tone(frequency,duration=.06,volume=.035,type='triangle'){if(!this.context)return;const oscillator=this.context.createOscillator(),gain=this.context.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,this.context.currentTime);gain.gain.setValueAtTime(volume,this.context.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,this.context.currentTime+duration);oscillator.connect(gain).connect(this.context.destination);oscillator.start();oscillator.stop(this.context.currentTime+duration);}
  playerSwing(action){this.unlock();this.tone(action.id==='heavy'?110:action.id==='ultimate'?240:180,.055,.025,'sawtooth');}
  impact({critical=false,type='physical',heavy=false}){this.unlock();const frequency=type==='lightning'?510:type==='fire'?280:type==='ice'?640:critical?390:220;this.tone(frequency,heavy ? .11 : .055,heavy ? .06 : .035,heavy?'square':'triangle');}
  guard(parry){this.unlock();this.tone(parry?720:300,parry ? .12 : .05,parry ? .07 : .025,'sine');}
  enemyTelegraph(boss){this.unlock();this.tone(boss?85:130,boss ? .16 : .06,boss ? .045 : .018,'sawtooth');}
}
