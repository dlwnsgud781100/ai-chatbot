import { PLAYER_ACTIONS } from '../data/combat-data.js';

/** Cooldowns are keyed by semantic action ID; UI never owns combat timing. */
export class SkillSystem {
  constructor() { this.cooldowns=new Map(); }
  definition(id){return PLAYER_ACTIONS[id];}
  canUse(id,stats,now,{ultimate=0}={}) { const action=PLAYER_ACTIONS[id];if(!action)return {ok:false,reason:'알 수 없는 전투 행동'};if((this.cooldowns.get(id)??0)>now)return {ok:false,reason:'재사용 대기 중'};if(stats.energy<(action.energy??0))return {ok:false,reason:'에너지가 부족합니다'};if((action.ultimateCost??0)>ultimate)return {ok:false,reason:'궁극기 에너지가 부족합니다'};return {ok:true,action}; }
  commit(id,stats,now) {const action=PLAYER_ACTIONS[id];stats.spendEnergy(action.energy??0);if(action.cooldown)this.cooldowns.set(id,now+action.cooldown);return action;}
  remaining(id,now){return Math.max(0,(this.cooldowns.get(id)??0)-now);}
}
