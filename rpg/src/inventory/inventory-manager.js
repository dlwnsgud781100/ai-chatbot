import { EVENT } from '../core/constants.js';
import { ITEMS } from '../data/content.js';
export class InventoryManager {
  constructor(events, saved={}) { this.events=events; this.items=new Map(Object.entries(saved.items ?? {dew_vial:2,verdant_shard:0,ember_dust:0})); }
  quantity(itemId) { return Number(this.items.get(itemId) ?? 0); }
  add(itemId, quantity=1) { if(!ITEMS[itemId]||quantity<=0) return false; this.items.set(itemId,this.quantity(itemId)+quantity); this.changed(); return true; }
  remove(itemId, quantity=1) { if(this.quantity(itemId)<quantity||quantity<=0) return false; const next=this.quantity(itemId)-quantity; if(next===0)this.items.delete(itemId);else this.items.set(itemId,next); this.changed(); return true; }
  list() { return [...this.items.entries()].filter(([,quantity])=>quantity>0).map(([id,quantity])=>({item:ITEMS[id],quantity})); }
  snapshot() { return {items:Object.fromEntries(this.items)}; }
  changed() { this.events.emit(EVENT.INVENTORY_CHANGED,{inventory:this}); }
}
