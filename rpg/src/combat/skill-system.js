import { SKILLS } from '../data/content.js';
export class SkillSystem {
  constructor() { this.cooldowns=new Map(); }
  definition(id){return SKILLS[id];}
  canUse(id,stats,now) { const skill=SKILLS[id];if(!skill)return {ok:false,reason:'알 수 없는 기술'};if((this.cooldowns.get(id)??0)>now)return {ok:false,reason:'재사용 대기 중'};if(stats.energy<skill.energy)return {ok:false,reason:'에너지가 부족합니다'};return {ok:true,skill}; }
  commit(id,stats,now) {const skill=SKILLS[id];stats.spendEnergy(skill.energy);this.cooldowns.set(id,now+skill.cooldown);return skill;}
  remaining(id,now){return Math.max(0,(this.cooldowns.get(id)??0)-now);}
}
