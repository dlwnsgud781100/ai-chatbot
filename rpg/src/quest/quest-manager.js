import { EVENT } from '../core/constants.js';
import { QUESTS } from '../data/content.js';
export class QuestManager {
  constructor(events, inventory, player, saved={}) { this.events=events;this.inventory=inventory;this.player=player;this.active=saved.active ?? ['breach_line'];this.progress=saved.progress ?? {};this.completed=saved.completed ?? []; }
  get current() { return QUESTS[this.active[0]]; }
  getQuest(id) { return QUESTS[id]; }
  objectiveProgress(quest,objective) { return Number(this.progress[`${quest.id}:${objective.id}`]??0); }
  advance(type,targetId,amount=1) { for(const questId of [...this.active]) { const quest=QUESTS[questId]; for(const objective of quest.objectives) { if(objective.type!==type||objective.targetId!==targetId)continue; const key=`${quest.id}:${objective.id}`; this.progress[key]=Math.min(objective.required,this.objectiveProgress(quest,objective)+amount); this.events.emit(EVENT.QUEST_CHANGED,{quest,objective,progress:this.objectiveProgress(quest,objective)}); if(quest.objectives.every((entry)=>this.objectiveProgress(quest,entry)>=entry.required))this.complete(quest); } } }
  complete(quest) { if(this.completed.includes(quest.id)) return; this.active=this.active.filter((id)=>id!==quest.id);this.completed.push(quest.id); const levels=this.player.stats.gainXp(quest.rewards.xp); for(const reward of quest.rewards.items??[])this.inventory.add(reward.itemId,reward.quantity); if(quest.next)this.active.push(quest.next); this.events.emit(EVENT.QUEST_CHANGED,{quest,completed:true,levels}); }
  list() { return [...this.active,...this.completed].map(id=>({quest:QUESTS[id],completed:this.completed.includes(id)})); }
  snapshot() { return {active:this.active,progress:this.progress,completed:this.completed}; }
}
