// Content is declarative: new regions, enemies, items, and quests can be added without changing systems.
export const ZONES = Object.freeze({
  whispering_verge:{ id:'whispering_verge', name:'잔향의 초원', subtitle:'Whispering Verge · 안전 지대', bounds:{minX:-58,maxX:22,minZ:-42,maxZ:48}, biome:'meadow', recommendedLevel:1 },
  emberfall:{ id:'emberfall', name:'잿불 낙하 지대', subtitle:'Emberfall Reach · 위협 지역', bounds:{minX:22,maxX:62,minZ:-42,maxZ:48}, biome:'ash', recommendedLevel:3, locked:true },
});
export const ENEMIES = Object.freeze({
  thornwalker:{ id:'thornwalker', name:'가시걸음', level:1, maxHealth:54, attack:10, defense:1, speed:2.5, aggroRange:10, attackRange:2.05, attackCooldown:1.45, xp:28, loot:[{itemId:'verdant_shard',chance:.72,min:1,max:2},{itemId:'dew_vial',chance:.18,min:1,max:1}], color:0x94b96b, emissive:0x203a18 },
  cinder_moth:{ id:'cinder_moth', name:'잿빛 나방', level:2, maxHealth:38, attack:12, defense:0, speed:3.15, aggroRange:9, attackRange:1.7, attackCooldown:1.15, xp:34, loot:[{itemId:'ember_dust',chance:.84,min:1,max:2}], color:0xd68b5a, emissive:0x472015 },
  rootwarden:{ id:'rootwarden', name:'뿌리 감시자', level:3, maxHealth:160, attack:18, defense:3, speed:1.7, aggroRange:13, attackRange:2.6, attackCooldown:1.8, xp:160, loot:[{itemId:'warden_core',chance:1,min:1,max:1}], color:0x6b9865, emissive:0x1c3219, elite:true },
});
export const ITEMS = Object.freeze({
  dew_vial:{ id:'dew_vial', name:'이슬 약병', icon:'♧', type:'consumable', description:'HP를 44 회복합니다.', heal:44, rarity:'uncommon' },
  verdant_shard:{ id:'verdant_shard', name:'푸른 파편', icon:'◇', type:'material', description:'변경에 남은 생명의 잔광. 의뢰 증표로도 쓰인다.', rarity:'common' },
  ember_dust:{ id:'ember_dust', name:'잿불 가루', icon:'✦', type:'material', description:'균열 근처에서 수집되는 뜨거운 분진.', rarity:'common' },
  warden_core:{ id:'warden_core', name:'감시자의 심핵', icon:'◈', type:'quest', description:'오래된 문을 열 수 있는 핵.', rarity:'rare' },
  frontier_blade:{ id:'frontier_blade', name:'개척자의 날', icon:'⚔', type:'weapon', description:'재빠른 공격을 위한 균형 잡힌 도검.', attack:8, rarity:'rare' },
});
export const SKILLS = Object.freeze({
  basic:{ id:'basic', name:'절단', cooldown:.58, energy:0, range:3.15, damage:18, type:'physical', intent:'attack' },
  arcane:{ id:'arcane', name:'균열창', cooldown:5.5, energy:24, range:9.5, damage:37, type:'arcane', intent:'skill' },
  dodge:{ id:'dodge', name:'회피', cooldown:1.5, energy:18, type:'movement', intent:'dodge' },
  potion:{ id:'potion', name:'이슬 약병', cooldown:1, energy:0, type:'consumable', intent:'item' },
});
export const QUESTS = Object.freeze({
  breach_line:{ id:'breach_line', title:'균열의 경계선', category:'메인', description:'초원의 가시걸음을 처치해 균열의 확산을 늦추십시오.', objectives:[{id:'thornwalker_hunt',type:'kill',targetId:'thornwalker',required:3,label:'가시걸음 처치'}], rewards:{xp:85,items:[{itemId:'dew_vial',quantity:1}]}, next:'watcher_signal' },
  watcher_signal:{ id:'watcher_signal', title:'감시자의 신호', category:'메인', description:'야영지의 감시자 아린에게 초원의 이상을 보고하십시오.', objectives:[{id:'talk_arin',type:'interact',targetId:'arin',required:1,label:'감시자 아린과 대화'}], rewards:{xp:120,items:[{itemId:'frontier_blade',quantity:1}]}, next:null },
});
export const NPCS = Object.freeze({
  arin:{ id:'arin', name:'감시자 아린', title:'전초 감시자', position:{x:-10,z:5}, dialogue:[
    '균열은 지도를 따라 움직이지 않아요. 오늘의 길이 내일도 안전하다는 보장은 없죠.',
    '가시걸음 셋을 정리하면 주변의 흐름이 보일 겁니다. 서두르되, 혼자 달려들진 마세요.',
    '좋아요. 변화가 잠잠해졌어요. 이 날은 이제 당신의 것이니, 다음 경계도 열어 볼 수 있겠네요.'
  ] },
});
