import { EVENT } from '../core/constants.js';
import { QUEST_DATABASE } from '../data/rpg-content.js';

const validIds=(values)=>Array.isArray(values)?values.filter((id)=>QUEST_DATABASE[id]):[];
/** Data-driven quest state machine. It tracks objectives and emits reward intents; RewardService applies rewards. */
export class QuestManager {
  constructor(events,inventory,player,saved={}){this.events=events;this.inventory=inventory;this.player=player;this.active=validIds(saved.active);this.ready=validIds(saved.ready);this.completed=validIds(saved.completed);this.progress=typeof saved.progress==='object'&&saved.progress?{...saved.progress}:{};this.events.on(EVENT.ENEMY_DEFEATED,({enemy})=>{if(!enemy?.data)return;const context={spawnId:enemy.definition?.id};this.advance(enemy.data.boss?'DefeatBoss':'Kill',enemy.data.id,1,context);if(enemy.data.boss)this.advance('Kill',enemy.data.id,1,context);});this.events.on(EVENT.INVENTORY_CHANGED,()=>this.syncCollectObjectives());}
  get current(){return this.getActive()[0]?.quest??null;}
  getQuest(id){return QUEST_DATABASE[id]??null;}
  getActive(){return this.active.map((id)=>({quest:this.getQuest(id),state:'active'})).filter(({quest})=>quest);}
  isActive(id){return this.active.includes(id);}
  isReady(id){return this.ready.includes(id);}
  isCompleted(id){return this.completed.includes(id);}
  isAvailable(id){const quest=this.getQuest(id);return Boolean(quest&&!this.isActive(id)&&!this.isReady(id)&&!this.isCompleted(id)&&quest.prerequisites.every((required)=>this.isCompleted(required)));}
  availableFor(npcId){return Object.values(QUEST_DATABASE).filter((quest)=>quest.giver===npcId&&this.isAvailable(quest.id));}
  readyFor(npcId){return this.ready.map((id)=>this.getQuest(id)).filter((quest)=>quest?.giver===npcId);}
  objectiveProgress(quest,objective){return Math.max(0,Number(this.progress[`${quest.id}:${objective.id}`]??0));}
  accept(id){if(!this.isAvailable(id))return false;this.active.push(id);const quest=this.getQuest(id);this.events.emit(EVENT.QUEST_CHANGED,{quest,state:'accepted'});this.syncCollectObjectives();return true;}
  advance(type,targetId,amount=1,context={}){if(!Number.isFinite(amount)||amount<=0)return false;let changed=false;for(const id of [...this.active]){const quest=this.getQuest(id);if(!quest)continue;for(const objective of quest.objectives){if(objective.type!==type||objective.targetId!==targetId||(objective.sourceSpawnId&&objective.sourceSpawnId!==context.spawnId))continue;const key=`${quest.id}:${objective.id}`,next=Math.min(objective.required,this.objectiveProgress(quest,objective)+Math.floor(amount));if(next===this.objectiveProgress(quest,objective))continue;this.progress[key]=next;changed=true;this.events.emit(EVENT.QUEST_CHANGED,{quest,objective,progress:next,state:'progress'});}if(this.objectivesComplete(quest))this.markReady(quest);}return changed;}
  syncCollectObjectives(){for(const id of [...this.active]){const quest=this.getQuest(id);for(const objective of quest?.objectives??[]){if(objective.type==='Collect'){const key=`${quest.id}:${objective.id}`,next=Math.min(objective.required,this.inventory.quantity(objective.targetId));if(next!==this.objectiveProgress(quest,objective)){this.progress[key]=next;this.events.emit(EVENT.QUEST_CHANGED,{quest,objective,progress:next,state:'progress'});}}}if(quest&&this.objectivesComplete(quest))this.markReady(quest);}}
  objectivesComplete(quest){return quest.objectives.every((objective)=>this.objectiveProgress(quest,objective)>=objective.required);}
  markReady(quest){if(this.ready.includes(quest.id)||!this.active.includes(quest.id))return;this.active=this.active.filter((id)=>id!==quest.id);this.ready.push(quest.id);this.events.emit(EVENT.QUEST_CHANGED,{quest,state:'ready'});this.events.emit(EVENT.NOTIFY,{message:`의뢰 완료 준비: ${quest.title} · ${quest.giver}에게 보고하세요.`,type:'success'});}
  turnIn(id,npcId){const quest=this.getQuest(id);if(!quest||quest.giver!==npcId||!this.ready.includes(id))return false;this.ready=this.ready.filter((entry)=>entry!==id);this.completed.push(id);this.events.emit(EVENT.QUEST_TURN_IN,{quest,npcId});this.events.emit(EVENT.QUEST_CHANGED,{quest,state:'completed'});return true;}
  list(){const rows=[];for(const quest of Object.values(QUEST_DATABASE)){const state=this.isCompleted(quest.id)?'completed':this.isReady(quest.id)?'ready':this.isActive(quest.id)?'active':this.isAvailable(quest.id)?'available':'locked';if(state!=='locked')rows.push({quest,state,completed:state==='completed'});}return rows;}
  snapshot(){return {active:[...this.active],ready:[...this.ready],completed:[...this.completed],progress:{...this.progress}};}
}
