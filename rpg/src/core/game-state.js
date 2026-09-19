import { EVENT, GAME_STATE } from './constants.js';
export class GameState {
  constructor(events) { this.events=events; this.value=GAME_STATE.LOADING; this.previous=null; }
  is(...states) { return states.includes(this.value); }
  set(next, reason='') { if (next===this.value) return; this.previous=this.value; this.value=next; this.events.emit(EVENT.STATE_CHANGED,{current:next,previous:this.previous,reason}); }
}
