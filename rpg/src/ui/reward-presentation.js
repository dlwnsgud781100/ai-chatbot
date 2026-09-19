import { EVENT } from '../core/constants.js';
import { ITEM_DATABASE } from '../data/rpg-content.js';

const rarityRank={Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4};
/** Compact for ordinary rewards; prominent only when rarity/level warrants attention. */
export class RewardPresentation {
  constructor(events){this.events=events;this.reward=document.querySelector('#reward-presentation');this.level=document.querySelector('#level-up-presentation');events.on(EVENT.REWARD_GRANTED,(payload)=>this.showReward(payload));}
  showReward({items=[],levels=[]}={}){const best=items.reduce((winner,entry)=>{const rarity=ITEM_DATABASE[entry.itemId]?.rarity??'Common';return rarityRank[rarity]>rarityRank[winner]?rarity:winner;},'Common');if(levels.length)this.showLevel(levels.at(-1));if(!items.length||rarityRank[best]<2)return;const item=items.map((entry)=>ITEM_DATABASE[entry.itemId]).find((entry)=>entry?.rarity===best)??ITEM_DATABASE[items[0].itemId];if(!item)return;this.reward.dataset.rarity=best.toLowerCase();this.reward.querySelector('[data-reward-icon]').textContent=item.icon;this.reward.querySelector('[data-reward-title]').textContent=best==='Legendary'?'LEGENDARY AWAKENING':best==='Epic'?'EPIC FIND':'RARE FIND';this.reward.querySelector('[data-reward-name]').textContent=item.name;this.flash(this.reward,best==='Legendary'?4200:best==='Epic'?3200:2100);}
  showLevel(level){this.level.querySelector('[data-level-value]').textContent=`Lv. ${level}`;this.flash(this.level,2100);}
  flash(element,duration){element.classList.remove('hidden','show');requestAnimationFrame(()=>element.classList.add('show'));clearTimeout(element._timer);element._timer=setTimeout(()=>{element.classList.remove('show');setTimeout(()=>element.classList.add('hidden'),180);},duration);}
}
