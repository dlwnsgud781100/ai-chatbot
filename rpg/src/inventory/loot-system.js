import { LOOT_TABLES, ITEM_DATABASE } from '../data/rpg-content.js';
/** Produces validated loot plans. Applying a plan belongs to RewardService, never to combat. */
export class LootSystem {
  constructor(events,{random=Math.random}={}){this.events=events;this.random=random;}
  plan(tableId,{rolls=1,context={}}={}){const table=LOOT_TABLES[tableId]??LOOT_TABLES.default;if(!Array.isArray(table)||rolls<1||rolls>12)return [];const eligible=table.filter((entry)=>ITEM_DATABASE[entry.itemId]&&(!entry.condition||context[entry.condition]));const total=eligible.reduce((sum,entry)=>sum+Math.max(0,entry.weight??0),0);if(!total)return [];const drops=[];for(let roll=0;roll<rolls;roll++){let cursor=this.random()*total;let selected=eligible.at(-1);for(const entry of eligible){cursor-=entry.weight;if(cursor<=0){selected=entry;break;}}const min=Math.max(1,Math.floor(selected.minQuantity??1)),max=Math.max(min,Math.floor(selected.maxQuantity??min));const quantity=min+Math.floor(this.random()*(max-min+1));const previous=drops.find((drop)=>drop.itemId===selected.itemId);if(previous)previous.quantity+=quantity;else drops.push({itemId:selected.itemId,quantity});}return drops;}
  validatePlan(drops){if(!Array.isArray(drops)||drops.length>12)return false;return drops.every((drop)=>ITEM_DATABASE[drop.itemId]&&Number.isInteger(drop.quantity)&&drop.quantity>0&&drop.quantity<=99);}
}
