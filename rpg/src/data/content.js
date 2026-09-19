// Combat and progression data. Geographic content is in world-zones.js so new zone
// packages can be authored without touching gameplay systems.
import { PLAYER_ACTIONS } from './combat-data.js';
export { ZONES, CHUNK_SIZE, WORLD_BOUNDS } from './world-zones.js';

export const ENEMIES = Object.freeze({
  thornwalker:{ id:'thornwalker', name:'가시걸음', level:1, maxHealth:54, attack:10, defense:1, speed:2.5, aggroRange:10, attackRange:2.05, attackCooldown:1.45, xp:28, loot:[{itemId:'verdant_shard',chance:.72,min:1,max:2},{itemId:'dew_vial',chance:.18,min:1,max:1}], color:0x94b96b, emissive:0x203a18 },
  cinder_moth:{ id:'cinder_moth', name:'잿빛 나방', level:2, maxHealth:38, attack:12, defense:0, speed:3.15, aggroRange:9, attackRange:1.7, attackCooldown:1.15, xp:34, loot:[{itemId:'ember_dust',chance:.84,min:1,max:2}], color:0xd68b5a, emissive:0x472015 },
  rootwarden:{ id:'rootwarden', name:'뿌리 감시자', level:3, maxHealth:160, attack:18, defense:3, speed:1.7, aggroRange:13, attackRange:2.6, attackCooldown:1.8, xp:160, loot:[{itemId:'warden_core',chance:1,min:1,max:1}], color:0x6b9865, emissive:0x1c3219, elite:true },
  cinder_sentinel:{ id:'cinder_sentinel', name:'화로 파수꾼', level:5, maxHealth:230, attack:23, defense:5, speed:1.8, aggroRange:14, attackRange:2.5, attackCooldown:1.65, xp:200, loot:[{itemId:'cinder_ore',chance:1,min:2,max:3}], color:0xc16b45, emissive:0x6d260f, elite:true },
  frost_wisp:{ id:'frost_wisp', name:'서리 유령불', level:5, maxHealth:92, attack:16, defense:2, speed:3.1, aggroRange:10, attackRange:1.8, attackCooldown:1.2, xp:58, loot:[{itemId:'frost_bloom',chance:.7,min:1,max:2}], color:0x91d5e6, emissive:0x285878 },
  frost_matriarch:{ id:'frost_matriarch', name:'설원의 모후', level:7, maxHealth:310, attack:28, defense:7, speed:1.65, aggroRange:15, attackRange:2.7, attackCooldown:1.7, xp:280, loot:[{itemId:'ice_crystal',chance:1,min:2,max:3}], color:0xbee5f0, emissive:0x417b93, elite:true },
  dune_stalker:{ id:'dune_stalker', name:'모래 추적자', level:7, maxHealth:128, attack:20, defense:3, speed:3.5, aggroRange:11, attackRange:1.9, attackCooldown:1.05, xp:75, loot:[{itemId:'sunstone',chance:.6,min:1,max:2}], color:0xd6a55e, emissive:0x6b421a },
  dune_tyrant:{ id:'dune_tyrant', name:'해시계의 폭군', level:9, maxHealth:390, attack:33, defense:9, speed:1.5, aggroRange:16, attackRange:3, attackCooldown:1.85, xp:360, loot:[{itemId:'sunstone',chance:1,min:3,max:4}], color:0xebbd72, emissive:0x81501c, elite:true },
  bog_skulker:{ id:'bog_skulker', name:'늪 그림자', level:8, maxHealth:158, attack:24, defense:4, speed:2.8, aggroRange:12, attackRange:2.1, attackCooldown:1.2, xp:95, loot:[{itemId:'bog_resin',chance:.68,min:1,max:2}], color:0x5d9878, emissive:0x1a4937 },
  bog_queen:{ id:'bog_queen', name:'가라앉은 여왕', level:10, maxHealth:455, attack:38, defense:10, speed:1.45, aggroRange:16, attackRange:2.8, attackCooldown:1.9, xp:430, loot:[{itemId:'lumen_moss',chance:1,min:3,max:4}], color:0x75b88f, emissive:0x24583b, elite:true },
  crest_giant:{ id:'crest_giant', name:'절벽 거인', level:10, maxHealth:220, attack:31, defense:8, speed:1.7, aggroRange:14, attackRange:2.8, attackCooldown:1.6, xp:130, loot:[{itemId:'crown_ore',chance:.75,min:1,max:2}], color:0x8e9994, emissive:0x3c5351 },
  crest_warden:{ id:'crest_warden', name:'하늘다리 수호자', level:12, maxHealth:570, attack:45, defense:13, speed:1.45, aggroRange:17, attackRange:3.1, attackCooldown:1.9, xp:520, loot:[{itemId:'crown_ore',chance:1,min:4,max:5}], color:0xb0bbb5, emissive:0x526d70, elite:true },
  void_sentinel:{ id:'void_sentinel', name:'공허 감시자', level:14, maxHealth:350, attack:48, defense:14, speed:2.1, aggroRange:16, attackRange:2.8, attackCooldown:1.45, xp:220, loot:[{itemId:'star_fragment',chance:.64,min:1,max:2}], color:0x807ac2, emissive:0x302761, elite:true },
  thornheart_titan:{ id:'thornheart_titan', name:'심근의 수호자 · 아우렐', level:8, maxHealth:980, attack:32, defense:9, speed:2.05, aggroRange:19, attackRange:4.2, attackCooldown:1.2, xp:750, loot:[{itemId:'warden_core',chance:1,min:1,max:1},{itemId:'rootlight_seed',chance:1,min:3,max:4}], color:0x8aae59, emissive:0x294f1e, boss:true, elite:true, bossProfile:'thornheart_titan' },
});

export const ITEMS = Object.freeze({
  dew_vial:{ id:'dew_vial', name:'이슬 약병', icon:'♧', type:'consumable', description:'HP를 44 회복합니다.', heal:44, rarity:'uncommon' },
  verdant_shard:{ id:'verdant_shard', name:'푸른 파편', icon:'◇', type:'material', description:'변경에 남은 생명의 잔광.', rarity:'common' },
  ember_dust:{ id:'ember_dust', name:'잿불 가루', icon:'✦', type:'material', description:'균열 근처에서 수집되는 뜨거운 분진.', rarity:'common' },
  warden_core:{ id:'warden_core', name:'감시자의 심핵', icon:'◈', type:'quest', description:'오래된 문을 열 수 있는 핵.', rarity:'rare' },
  frontier_blade:{ id:'frontier_blade', name:'개척자의 날', icon:'⚔', type:'weapon', description:'재빠른 공격을 위한 균형 잡힌 도검.', attack:8, rarity:'rare' },
  rootlight_seed:{ id:'rootlight_seed', name:'뿌리빛 씨앗', icon:'✧', type:'material', description:'세계수 주변에서만 자라는 씨앗.', rarity:'common' },
  cinder_ore:{ id:'cinder_ore', name:'열석 광맥', icon:'◆', type:'material', description:'식지 않는 열기를 품은 광석.', rarity:'uncommon' },
  frost_bloom:{ id:'frost_bloom', name:'서리꽃', icon:'❄', type:'material', description:'눈보라에도 지지 않는 푸른 꽃.', rarity:'uncommon' },
  ice_crystal:{ id:'ice_crystal', name:'얼음 수정', icon:'◈', type:'material', description:'차가운 빛을 머금은 결정.', rarity:'rare' },
  sunstone:{ id:'sunstone', name:'햇살석', icon:'☀', type:'material', description:'열기를 오래 머금는 사막의 광물.', rarity:'uncommon' },
  bog_resin:{ id:'bog_resin', name:'늪 수지', icon:'●', type:'material', description:'물에 가라앉지 않는 끈끈한 수지.', rarity:'uncommon' },
  lumen_moss:{ id:'lumen_moss', name:'등불이끼', icon:'✦', type:'material', description:'어둠에서 은은하게 빛나는 이끼.', rarity:'uncommon' },
  crown_ore:{ id:'crown_ore', name:'왕관 광석', icon:'▲', type:'material', description:'절벽 가장자리에서만 드러나는 광석.', rarity:'rare' },
  root_ore:{ id:'root_ore', name:'심근 광석', icon:'◆', type:'material', description:'세계수 깊은 곳의 단단한 광석.', rarity:'rare' },
  dread_ore:{ id:'dread_ore', name:'황혼 광석', icon:'◆', type:'material', description:'붉은 석양처럼 빛나는 광석.', rarity:'rare' },
  storm_glass:{ id:'storm_glass', name:'폭풍 유리', icon:'◊', type:'material', description:'번개를 머금은 유리 조각.', rarity:'rare' },
  star_fragment:{ id:'star_fragment', name:'별 파편', icon:'✶', type:'material', description:'별문 주변에 떨어진 찬란한 파편.', rarity:'epic' },
  void_bloom:{ id:'void_bloom', name:'공허꽃', icon:'✺', type:'material', description:'빛이 닿지 않는 곳에서 피는 꽃.', rarity:'epic' },
  windflower:{ id:'windflower', name:'절벽꽃', icon:'✿', type:'material', description:'강풍 속에서 자라는 단단한 꽃.', rarity:'uncommon' },
});

// Legacy UI consumers receive the same declarative action definitions.
export const SKILLS = PLAYER_ACTIONS;

export const QUESTS = Object.freeze({
  breach_line:{ id:'breach_line', title:'균열의 경계선', category:'메인', description:'초원의 가시걸음을 처치해 균열의 확산을 늦추십시오.', objectives:[{id:'thornwalker_hunt',type:'kill',targetId:'thornwalker',required:3,label:'가시걸음 처치'}], rewards:{xp:85,items:[{itemId:'dew_vial',quantity:1}]}, next:'watcher_signal' },
  watcher_signal:{ id:'watcher_signal', title:'감시자의 신호', category:'메인', description:'야영지의 감시자 아린에게 초원의 이상을 보고하십시오.', objectives:[{id:'talk_arin',type:'interact',targetId:'arin',required:1,label:'감시자 아린과 대화'}], rewards:{xp:120,items:[{itemId:'frontier_blade',quantity:1}]}, next:null },
});

export const NPCS = Object.freeze({
  arin:{ id:'arin', name:'감시자 아린', title:'전초 감시자', zoneId:'worldtree_plaza', position:{x:-10,z:5}, dialogue:['균열은 지도를 따라 움직이지 않아요. 오늘의 길이 내일도 안전하다는 보장은 없죠.','가시걸음 셋을 정리하면 주변의 흐름이 보일 겁니다. 서두르되, 혼자 달려들진 마세요.','좋아요. 변화가 잠잠해졌어요. 이 날은 이제 당신의 것이니, 다음 경계도 열어 볼 수 있겠네요.'] },
  iora:{ id:'iora', name:'관리인 이오라', title:'세계수 길잡이', zoneId:'worldtree_plaza', position:{x:7,z:5}, dialogue:['세계수의 길은 기억한 곳으로만 이어집니다. 새로운 표석을 찾으면 이곳에서 다시 만날 수 있어요.'] },
  brann:{ id:'brann', name:'대장장이 브란', title:'뿌리결 제작소', zoneId:'worldtree_plaza', position:{x:12,z:6}, dialogue:['광석을 모아 두세요. 지금은 이름뿐인 재료라도, 언젠가 장비의 뼈대가 될 겁니다.'] },
  saha:{ id:'saha', name:'정찰자 사하', title:'사막 선행대', zoneId:'sunscorch', position:{x:-15,z:61}, dialogue:['모래는 길을 지우지만, 오래된 발자국까지 지우진 못해요. 신전을 향한다면 표식을 놓치지 마세요.'] },
  niva:{ id:'niva', name:'설원 기록관 니바', title:'관측궁 기록관', zoneId:'frostveil', position:{x:-21,z:-61}, dialogue:['눈보라는 침묵을 좋아합니다. 소리가 사라지는 방향이 바로 위험한 곳이에요.'] },
});
