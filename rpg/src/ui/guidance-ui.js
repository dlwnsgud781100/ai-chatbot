import { DUNGEONS, NPC_DATABASE } from '../data/rpg-content.js';

const distance=(from,to)=>Math.max(0,Math.round(Math.hypot(to.x-from.x,to.z-from.z)));
/** A restrained next-step readout, intentionally not a permanent screen-sized arrow. */
export class GuidanceUI {
  constructor({events,player,world,quests,dungeon}){this.events=events;this.player=player;this.world=world;this.quests=quests;this.dungeon=dungeon;this.root=document.querySelector('#world-guidance');this.title=this.root.querySelector('[data-guidance-title]');this.detail=this.root.querySelector('[data-guidance-detail]');this.frame=0;events.on('quest:changed',()=>this.render());events.on('dungeon:changed',()=>this.render());}
  update(){if(++this.frame%12===0)this.render();}
  destination(){const quest=this.quests.current;if(!quest){const npc=NPC_DATABASE.arin;return {title:'감시자 아린',detail:'세계수 광장 · 의뢰 확인',position:npc.position};}if(this.quests.isReady(quest.id)){const npc=NPC_DATABASE[quest.giver];return {title:`${npc.name}에게 보고`,detail:quest.title,position:npc.position};}const objective=quest.objectives.find((entry)=>this.quests.objectiveProgress(quest,entry)<entry.required)??quest.objectives[0];if(objective.type==='EnterDungeon'){return {title:'봉인된 하늘우물',detail:'심근 성소 입장',position:{x:20,z:-16}};}const alive=this.world.spawns.getAlive().find((entity)=>entity.data.id===objective.targetId);if(alive)return {title:objective.label,detail:`${this.quests.objectiveProgress(quest,objective)} / ${objective.required} · 주변 목표`,position:alive.position};return {title:objective.label,detail:`${this.quests.objectiveProgress(quest,objective)} / ${objective.required} · ${quest.location}`,position:this.player.position};}
  render(){const target=this.destination();if(!target)return;this.title.textContent=target.title;this.detail.textContent=`${target.detail} · ${distance(this.player.position,target.position)}m`;}
}
