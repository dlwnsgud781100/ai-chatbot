import { EVENT } from '../core/constants.js';
import { ECONOMY, ITEM_DATABASE, SHOPS } from '../data/rpg-content.js';
/** Shop prices and tradability are always resolved from immutable manifests, never UI input. */
export class ShopService {
  constructor(events,player,inventory){this.events=events;this.player=player;this.inventory=inventory;}
  get(shopId){return SHOPS[shopId]??null;}
  buy(shopId,itemId,quantity=1){const shop=this.get(shopId),listing=shop?.items.find((entry)=>entry.itemId===itemId);if(!listing||!Number.isSafeInteger(quantity)||quantity<1||quantity>20)return this.fail('판매 목록 또는 수량이 올바르지 않습니다.');const cost=listing.price*quantity;if(this.player.gold<cost)return this.fail('Gold가 부족합니다.');if(!this.inventory.add(itemId,quantity,{silent:true}))return this.fail('가방 공간이 부족합니다.');this.player.spendGold(cost);this.events.emit(EVENT.SHOP_CHANGED,{action:'buy',shopId,itemId,quantity,gold:this.player.gold});this.events.emit(EVENT.PLAYER_PROGRESS,{kind:'shop',gold:-cost,items:[{itemId,quantity}]});return true;}
  sell(instanceId,quantity=1){const found=this.inventory.find(instanceId)??this.inventory.findFirst(instanceId);if(!found||!Number.isSafeInteger(quantity)||quantity<1||quantity>found.entry.quantity)return this.fail('판매할 아이템 또는 수량이 올바르지 않습니다.');const item=found.item;if(!item.isTradeable||item.isQuestItem)return this.fail('이 아이템은 판매할 수 없습니다.');const earned=Math.max(1,Math.floor(item.sellPrice*ECONOMY.sellRate))*quantity;if(!this.inventory.removeInstance(found.entry.instanceId,quantity,{silent:true}))return this.fail('판매 처리에 실패했습니다.');this.player.addGold(earned);this.events.emit(EVENT.SHOP_CHANGED,{action:'sell',itemId:item.id,quantity,gold:this.player.gold,earned});this.events.emit(EVENT.PLAYER_PROGRESS,{kind:'shop',gold:earned,items:[]});return true;}
  catalog(shopId){const shop=this.get(shopId);if(!shop)return [];return shop.items.map((listing)=>({listing,item:ITEM_DATABASE[listing.itemId]}));}
  fail(message){this.events.emit(EVENT.NOTIFY,{message,type:'warning'});return false;}
}
