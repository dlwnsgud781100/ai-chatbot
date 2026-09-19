export class LootSystem {
  constructor(inventory, events) { this.inventory=inventory; this.events=events; }
  grant(table) { const awarded=[]; for(const entry of table ?? []) { if(Math.random()<=entry.chance) { const amount=entry.min+Math.floor(Math.random()*(entry.max-entry.min+1));this.inventory.add(entry.itemId,amount);awarded.push({itemId:entry.itemId,quantity:amount}); } } return awarded; }
}
