import { CharacterStats } from './character-stats.js';
export class PlayerData {
  constructor(saved={}) {this.id='local-player';this.name='리프';this.position={x:saved.position?.x??-10,y:0,z:saved.position?.z??9};this.rotation=saved.rotation??0;this.stats=new CharacterStats(saved.stats);this.state=saved.state??'idle';this.equipment=saved.equipment??{};this.gold=Math.max(0,Number(saved.gold??45));this.unlocks=new Set(saved.unlocks??[]);this.dungeonProgress=saved.dungeonProgress??{};}
  addGold(amount){this.gold=Math.max(0,this.gold+Math.floor(amount));return this.gold;}
  spendGold(amount){if(amount<0||this.gold<amount)return false;this.gold-=Math.floor(amount);return true;}
  unlock(id){this.unlocks.add(id);}
  hasUnlock(id){return this.unlocks.has(id);}
  snapshot(){return {position:{x:this.position.x,z:this.position.z},rotation:this.rotation,state:this.state,stats:this.stats.snapshot(),equipment:this.equipment,gold:this.gold,unlocks:[...this.unlocks],dungeonProgress:this.dungeonProgress};}
}
