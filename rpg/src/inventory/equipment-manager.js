import { ITEMS } from '../data/content.js';
export class EquipmentManager {
  constructor(player, inventory, events) { this.player=player;this.inventory=inventory;this.events=events; }
  equip(itemId) { const item=ITEMS[itemId]; if(!item||item.type!=='weapon'||this.inventory.quantity(itemId)<1)return false; const previous=this.player.equipment.weapon; this.player.equipment.weapon=itemId; this.player.stats.attack+=item.attack??0; if(previous&&previous!==itemId) this.player.stats.attack-=ITEMS[previous]?.attack??0; this.events.emit('inventory:equipped',{itemId,previous}); return true; }
}
