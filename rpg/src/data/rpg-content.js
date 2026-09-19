// Phase 4 RPG content manifests. IDs are the only values stored in inventory/quest/dungeon state.
const item=(id,definition)=>Object.freeze({id,stackLimit:1,levelRequirement:1,rarity:'Common',sellPrice:1,isTradeable:true,isQuestItem:false,...definition});

export const ITEM_DATABASE=Object.freeze({
  dew_vial:item('dew_vial',{name:'이슬 약병',icon:'♧',type:'consumable',stackLimit:20,description:'HP를 44 회복합니다.',effects:{heal:44},sellPrice:8}),
  field_tonic:item('field_tonic',{name:'전초 활력제',icon:'✚',type:'consumable',stackLimit:10,description:'HP와 Energy를 회복합니다.',effects:{heal:25,energy:30},rarity:'Uncommon',sellPrice:16}),
  verdant_shard:item('verdant_shard',{name:'푸른 파편',icon:'◇',type:'material',stackLimit:99,description:'변경에 남은 생명의 잔광.',sellPrice:3}),
  ember_dust:item('ember_dust',{name:'잿불 가루',icon:'✦',type:'material',stackLimit:99,description:'균열 근처의 뜨거운 분진.',sellPrice:5}),
  frost_bloom:item('frost_bloom',{name:'서리꽃',icon:'❄',type:'material',stackLimit:99,description:'눈보라 속에서도 지지 않는 꽃.',rarity:'Uncommon',sellPrice:8}),
  rootlight_seed:item('rootlight_seed',{name:'뿌리빛 씨앗',icon:'✧',type:'material',stackLimit:99,description:'세계수 주변에서 자라는 씨앗.',sellPrice:7}),
  cinder_ore:item('cinder_ore',{name:'열석 광맥',icon:'◆',type:'material',stackLimit:99,description:'식지 않는 열기를 품은 광석.',rarity:'Uncommon',sellPrice:9}),
  ice_crystal:item('ice_crystal',{name:'얼음 수정',icon:'◈',type:'material',stackLimit:99,description:'차가운 빛을 머금은 결정.',rarity:'Rare',sellPrice:12}),
  sunstone:item('sunstone',{name:'햇살석',icon:'☀',type:'material',stackLimit:99,description:'열기를 오래 머금는 사막의 광물.',rarity:'Uncommon',sellPrice:9}),
  bog_resin:item('bog_resin',{name:'늪 수지',icon:'●',type:'material',stackLimit:99,description:'물에 가라앉지 않는 끈끈한 수지.',rarity:'Uncommon',sellPrice:10}),
  lumen_moss:item('lumen_moss',{name:'등불이끼',icon:'✦',type:'material',stackLimit:99,description:'어둠에서 은은하게 빛나는 이끼.',rarity:'Uncommon',sellPrice:10}),
  crown_ore:item('crown_ore',{name:'왕관 광석',icon:'▲',type:'material',stackLimit:99,description:'절벽 가장자리에서만 드러나는 광석.',rarity:'Rare',sellPrice:14}),
  root_ore:item('root_ore',{name:'심근 광석',icon:'◆',type:'material',stackLimit:99,description:'세계수 깊은 곳의 단단한 광석.',rarity:'Rare',sellPrice:14}),
  windflower:item('windflower',{name:'절벽꽃',icon:'✿',type:'material',stackLimit:99,description:'강풍 속에서 자라는 단단한 꽃.',rarity:'Uncommon',sellPrice:8}),
  dread_ore:item('dread_ore',{name:'황혼 광석',icon:'◆',type:'material',stackLimit:99,description:'붉은 석양처럼 빛나는 광석.',rarity:'Rare',sellPrice:16}),
  storm_glass:item('storm_glass',{name:'폭풍 유리',icon:'◊',type:'material',stackLimit:99,description:'번개를 머금은 유리 조각.',rarity:'Rare',sellPrice:17}),
  star_fragment:item('star_fragment',{name:'별 파편',icon:'✶',type:'material',stackLimit:99,description:'별문 주변에 떨어진 찬란한 파편.',rarity:'Epic',sellPrice:28}),
  void_bloom:item('void_bloom',{name:'공허꽃',icon:'✺',type:'material',stackLimit:99,description:'빛이 닿지 않는 곳에서 피는 꽃.',rarity:'Epic',sellPrice:28}),
  warden_core:item('warden_core',{name:'감시자의 심핵',icon:'◈',type:'quest',stackLimit:9,description:'심근 성소를 증명하는 핵.',rarity:'Rare',isTradeable:false,isQuestItem:true,sellPrice:0}),
  verdant_blade:item('verdant_blade',{name:'초원의 개척검',icon:'⚔',type:'equipment',slot:'weapon',itemLevel:2,rarity:'Uncommon',description:'가시를 가르도록 벼려진 한손검.',stats:{attackPower:10,critChance:.03},sellPrice:42}),
  rootguard_helm:item('rootguard_helm',{name:'뿌리수호 투구',icon:'⌑',type:'equipment',slot:'helmet',itemLevel:3,rarity:'Rare',description:'수호자의 뿌리결을 엮은 투구.',stats:{defense:5,vitality:2},sellPrice:75}),
  warden_hauberk:item('warden_hauberk',{name:'감시자의 흉갑',icon:'▣',type:'equipment',slot:'armor',itemLevel:3,rarity:'Rare',description:'강한 충격을 분산하는 흉갑.',stats:{defense:9,maxHealth:24},sellPrice:92}),
  trail_gloves:item('trail_gloves',{name:'길잡이 장갑',icon:'✋',type:'equipment',slot:'gloves',itemLevel:2,rarity:'Common',description:'손끝의 감각을 살려 주는 장갑.',stats:{dexterity:2,critChance:.02},sellPrice:28}),
  stride_boots:item('stride_boots',{name:'바람걸음 장화',icon:'◒',type:'equipment',slot:'boots',itemLevel:2,rarity:'Uncommon',description:'가벼운 발걸음을 돕는 장화.',stats:{moveSpeed:.55,dexterity:1},sellPrice:45}),
  moss_charm:item('moss_charm',{name:'이끼 부적',icon:'◉',type:'equipment',slot:'accessory',itemLevel:2,rarity:'Uncommon',description:'생명력이 천천히 흐르는 부적.',stats:{vitality:2,resistance:{poison:8}},sellPrice:48}),
  dawn_loop:item('dawn_loop',{name:'여명의 고리',icon:'◎',type:'equipment',slot:'accessory',itemLevel:4,rarity:'Rare',description:'광휘 속성을 다루는 이의 고리.',stats:{intelligence:2,elementalPower:{light:.12},skillPower:.06},sellPrice:110}),
  aurel_heartblade:item('aurel_heartblade',{name:'아우렐의 심근검',icon:'✹',type:'equipment',slot:'weapon',itemLevel:7,levelRequirement:2,rarity:'Epic',description:'심근의 수호자가 남긴 살아 있는 검날.',stats:{attackPower:24,strength:3,critDamage:.18,elementalPower:{light:.1}},passiveEffect:'heartbreaker',setId:'aurel',sellPrice:380}),
  aurel_signet:item('aurel_signet',{name:'심근 성소의 인장',icon:'☼',type:'equipment',slot:'accessory',itemLevel:7,levelRequirement:2,rarity:'Epic',description:'보스의 심장 박동을 기억하는 인장.',stats:{maxEnergy:18,skillPower:.12,resistance:{poison:12}},setId:'aurel',sellPrice:260}),
});

export const ECONOMY=Object.freeze({currency:'Gold',startingGold:45,inventoryCapacity:30,sellRate:.5});

export const LOOT_TABLES=Object.freeze({
  thornwalker:[{itemId:'verdant_shard',weight:70,minQuantity:1,maxQuantity:2},{itemId:'dew_vial',weight:18,minQuantity:1,maxQuantity:1},{itemId:'trail_gloves',weight:5,minQuantity:1,maxQuantity:1}],
  cinder_moth:[{itemId:'ember_dust',weight:72,minQuantity:1,maxQuantity:2},{itemId:'field_tonic',weight:12,minQuantity:1,maxQuantity:1},{itemId:'stride_boots',weight:4,minQuantity:1,maxQuantity:1}],
  frost_wisp:[{itemId:'frost_bloom',weight:75,minQuantity:1,maxQuantity:2},{itemId:'moss_charm',weight:5,minQuantity:1,maxQuantity:1}],
  rootwarden:[{itemId:'warden_core',weight:100,minQuantity:1,maxQuantity:1},{itemId:'rootguard_helm',weight:34,minQuantity:1,maxQuantity:1},{itemId:'warden_hauberk',weight:22,minQuantity:1,maxQuantity:1}],
  thornheart_titan:[{itemId:'aurel_heartblade',weight:100,minQuantity:1,maxQuantity:1,condition:'boss'},{itemId:'aurel_signet',weight:55,minQuantity:1,maxQuantity:1,condition:'boss'},{itemId:'rootlight_seed',weight:100,minQuantity:3,maxQuantity:5,condition:'boss'}],
  default:[{itemId:'verdant_shard',weight:45,minQuantity:1,maxQuantity:1}],
});

export const QUEST_DATABASE=Object.freeze({
  thornwatch_hunt:{id:'thornwatch_hunt',title:'초원의 가시를 걷어라',category:'Main Quest',giver:'arin',zone:'worldtree_plaza',location:'잔향의 초원',description:'세계수 광장 서쪽 초원을 위협하는 가시걸음을 정리하십시오.',prerequisites:[],objectives:[{id:'thorn_hunt',type:'Kill',targetId:'thornwalker',required:5,label:'가시걸음 처치'}],rewards:{xp:145,gold:110,items:[{itemId:'verdant_blade',quantity:1},{itemId:'dew_vial',quantity:2}],unlocks:['aurel_sanctum']},nextQuest:'sanctum_assault'},
  sanctum_assault:{id:'sanctum_assault',title:'아우렐의 심근 성소',category:'Dungeon Quest',giver:'arin',zone:'worldtree_plaza',location:'봉인된 하늘우물',description:'성소에 진입해 뿌리 감시자를 돌파하고 심근의 수호자 아우렐을 처치하십시오.',prerequisites:['thornwatch_hunt'],objectives:[{id:'enter_sanctum',type:'EnterDungeon',targetId:'aurel_sanctum',required:1,label:'심근 성소 입장'},{id:'warden_defeat',type:'Kill',targetId:'rootwarden',sourceSpawnId:'hub_elite_warden',required:1,label:'뿌리 감시자 처치'},{id:'aurel_defeat',type:'DefeatBoss',targetId:'thornheart_titan',sourceSpawnId:'hub_boss_aurel',required:1,label:'아우렐 처치'}],rewards:{xp:480,gold:420,items:[{itemId:'aurel_signet',quantity:1}],unlocks:['emberfall']},nextQuest:null},
  rootlight_supply:{id:'rootlight_supply',title:'뿌리빛의 재료',category:'Side Quest',giver:'brann',zone:'worldtree_plaza',location:'세계수 광장',description:'제작소에 뿌리빛 씨앗을 가져다주십시오.',prerequisites:[],objectives:[{id:'seed_collect',type:'Collect',targetId:'rootlight_seed',required:3,label:'뿌리빛 씨앗 수집'}],rewards:{xp:80,gold:70,items:[{itemId:'field_tonic',quantity:2}]},nextQuest:null},
});

export const NPC_DATABASE=Object.freeze({
  arin:{id:'arin',name:'감시자 아린',title:'전초 감시자',zoneId:'worldtree_plaza',position:{x:-10,z:5},role:['questGiver'],questIds:['thornwatch_hunt','sanctum_assault'],dialogue:{idle:'균열은 지도를 따라 움직이지 않아요. 준비가 되면 의뢰를 받아 주세요.',accept:'변경의 길은 먼저 정리해야 합니다. 돌아오면 다음 문을 열겠습니다.',turnIn:'잘 해냈어요. 이제 성소의 심장부가 당신을 기다립니다.'}},
  brann:{id:'brann',name:'대장장이 브란',title:'뿌리결 제작소',zoneId:'worldtree_plaza',position:{x:12,z:6},role:['shopkeeper','questGiver'],shopId:'rootforge',questIds:['rootlight_supply'],dialogue:{idle:'장비와 소모품이 필요하면 내게 오게.',shop:'쓸모 있는 물건만 골라 두었지.'}},
  iora:{id:'iora',name:'관리인 이오라',title:'세계수 길잡이',zoneId:'worldtree_plaza',position:{x:7,z:5},role:['guide'],dialogue:{idle:'세계수의 길은 기억한 표석으로 이어집니다.'}},
});

export const SHOPS=Object.freeze({
  rootforge:{id:'rootforge',name:'브란의 전초 보급소',refreshPolicy:'static',items:[{itemId:'dew_vial',price:18},{itemId:'field_tonic',price:36},{itemId:'trail_gloves',price:64},{itemId:'stride_boots',price:92},{itemId:'moss_charm',price:105}]},
});

export const DUNGEONS=Object.freeze({
  aurel_sanctum:{id:'aurel_sanctum',name:'아우렐의 심근 성소',recommendedLevel:2,entryRequirements:{minLevel:2,questId:'sanctum_assault',unlock:'aurel_sanctum'},entryPosition:{x:27,z:-18},bossPosition:{x:34,z:22},eliteSpawnId:'hub_elite_warden',bossSpawnId:'hub_boss_aurel',bossId:'thornheart_titan',completionReward:{xp:90,gold:140,items:[{itemId:'rootlight_seed',quantity:2}]},state:'NotStarted'},
});
