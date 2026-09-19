// Phase 2 world manifest. A zone is a self-contained content package: environment,
// exploration hooks, markers, resource nodes, NPCs and streamable spawn definitions.
export const CHUNK_SIZE = 48;

const zone = (definition) => Object.freeze(definition);
const point = (id, type, name, x, z, extra = {}) => Object.freeze({ id, type, name, position:{x,z}, ...extra });
const resource = (id, itemId, name, x, z, extra = {}) => Object.freeze({ id, itemId, name, position:{x,z}, ...extra });
const spawn = (id, enemyId, x, z, extra = {}) => Object.freeze({ id, enemyId, position:{x,z}, ...extra });

export const ZONES = Object.freeze({
  worldtree_plaza: zone({
    id:'worldtree_plaza', name:'세계수 광장', subtitle:'Worldroot Plaza · 중심 허브', levelRange:'Lv. 1–2', bounds:{minX:-48,maxX:48,minZ:-48,maxZ:48}, biome:'verdant', weather:'pollen', ambient:'worldroot_birds', bgm:'worldroot_overture', discoveredByDefault:true,
    visual:{ground:0x547c52, fog:0x9fc0a5, sky:0xaac9bb, sun:0xffe7bd, detail:0x6a9958},
    landmark:point('world_tree','landmark','새벽의 세계수',0,0,{kind:'world_tree',description:'모든 길의 기억을 품은 거목. 광장과 순간이동망의 중심입니다.',marker:'landmark'}),
    waypoints:[point('worldroot_waypoint','waypoint','세계수 광장',-10,9,{discovered:true})],
    pois:[point('guild_board','quest','개척단 의뢰 게시판',-5,4,{kind:'board'}),point('craft_pavilion','service','뿌리결 제작소',11,6,{kind:'craft'}),point('skywell_gate','dungeon','봉인된 하늘우물',20,-16,{kind:'gate',locked:true})],
    resources:[resource('rootlight_01','rootlight_seed','뿌리빛 씨앗',-21,-5),resource('rootlight_02','rootlight_seed','뿌리빛 씨앗',15,17)],
    spawns:[spawn('hub_moth_01','cinder_moth',34,-30),spawn('hub_moth_02','cinder_moth',39,-12)],
  }),
  whispering_verge: zone({
    id:'whispering_verge', name:'잔향의 초원', subtitle:'Whispering Verge · 초심자 변경', levelRange:'Lv. 1–3', bounds:{minX:-144,maxX:-48,minZ:-48,maxZ:48}, biome:'meadow', weather:'mist', ambient:'meadow_insects', bgm:'verge_winds',
    visual:{ground:0x4e8250, fog:0xaac3ac, sky:0xa6c7b6, sun:0xffe7bd, detail:0x47783e},
    landmark:point('echo_arch','landmark','메아리 바위문',-96,-4,{kind:'stone_arch',description:'사라진 길잡이들이 남긴 초원의 관문.',marker:'landmark'}),
    waypoints:[point('verge_waypoint','waypoint','메아리 바위문',-104,5)],
    pois:[point('verge_den','dungeon','바람굴 입구',-130,-25,{kind:'cave'}),point('lost_shrine','secret','이끼 낀 봉헌대',-72,29,{kind:'shrine'})],
    resources:[resource('verdant_01','verdant_shard','푸른 파편',-119,17),resource('verdant_02','verdant_shard','푸른 파편',-86,-29),resource('dew_01','dew_vial','이슬 약초',-64,11)],
    spawns:[spawn('verge_thorn_01','thornwalker',-71,6),spawn('verge_thorn_02','thornwalker',-82,-10),spawn('verge_thorn_03','thornwalker',-108,10),spawn('verge_thorn_04','thornwalker',-128,-17),spawn('verge_warden','rootwarden',-125,-27,{boss:true})],
  }),
  emberfall: zone({
    id:'emberfall', name:'잿불 낙하 지대', subtitle:'Emberfall Reach · 무너진 유적', levelRange:'Lv. 3–5', bounds:{minX:48,maxX:144,minZ:-48,maxZ:48}, biome:'ash', weather:'embers', ambient:'ash_wind', bgm:'emberfall_drum',
    visual:{ground:0x756652, fog:0xb4a285, sky:0xc3a986, sun:0xffb275, detail:0x98684b},
    landmark:point('fallen_bastion','landmark','낙하한 성채',96,-8,{kind:'ruined_keep',description:'불타던 하늘에서 떨어진 성채의 잔해.',marker:'landmark'}),
    waypoints:[point('ember_waypoint','waypoint','성채 잔해 야영지',59,17)],
    pois:[point('cinder_vault','dungeon','잿불 금고',118,-27,{kind:'vault'}),point('forge_event','event','꺼지지 않는 대장간',82,28,{kind:'event'})],
    resources:[resource('ember_01','ember_dust','잿불 가루',69,-18),resource('ember_02','ember_dust','잿불 가루',111,16),resource('cinder_ore','cinder_ore','열석 광맥',132,24)],
    spawns:[spawn('ember_moth_01','cinder_moth',64,-4),spawn('ember_moth_02','cinder_moth',81,-20),spawn('ember_moth_03','cinder_moth',109,8),spawn('ember_sentinel','cinder_sentinel',121,-25,{boss:true})],
  }),
  frostveil: zone({
    id:'frostveil', name:'서리장막 설원', subtitle:'Frostveil Expanse · 빙결 전선', levelRange:'Lv. 5–7', bounds:{minX:-48,maxX:48,minZ:-144,maxZ:-48}, biome:'frost', weather:'snow', ambient:'frost_wind', bgm:'frostveil_chorale',
    visual:{ground:0x91b5bc, fog:0xc5d8df, sky:0xb4d3e0, sun:0xdcecff, detail:0xbedde1},
    landmark:point('ice_palace','landmark','얼어붙은 관측궁',-1,-99,{kind:'ice_palace',description:'바람의 흐름을 읽던 고대 관측소.',marker:'landmark'}),
    waypoints:[point('frost_waypoint','waypoint','푸른 설원 표석',-21,-61)],
    pois:[point('glacier_crypt','dungeon','빙하 지하묘',24,-126,{kind:'crypt'}),point('whiteout_event','event','눈보라의 눈',-36,-125,{kind:'event'})],
    resources:[resource('frost_01','frost_bloom','서리꽃',-11,-84),resource('frost_02','frost_bloom','서리꽃',30,-117),resource('ice_crystal','ice_crystal','얼음 수정',-37,-105)],
    spawns:[spawn('frost_wisp_01','frost_wisp',-20,-82),spawn('frost_wisp_02','frost_wisp',17,-101),spawn('frost_wisp_03','frost_wisp',31,-126),spawn('frost_matriarch','frost_matriarch',1,-101,{boss:true})],
  }),
  sunscorch: zone({
    id:'sunscorch', name:'태양흉터 사막', subtitle:'Sunscorch Basin · 모래의 경계', levelRange:'Lv. 7–9', bounds:{minX:-48,maxX:48,minZ:48,maxZ:144}, biome:'desert', weather:'sand', ambient:'desert_wind', bgm:'sunscorch_strings',
    visual:{ground:0xb99158, fog:0xd3b27b, sky:0xddc08b, sun:0xffd38c, detail:0x9c703d},
    landmark:point('sundial_temple','landmark','기울어진 해시계 신전',2,97,{kind:'sun_temple',description:'매일 다른 그림자를 드리우는 모래 신전.',marker:'landmark'}),
    waypoints:[point('sun_waypoint','waypoint','낮은 오아시스',-15,61)],
    pois:[point('glass_tomb','dungeon','유리무덤',29,124,{kind:'tomb'}),point('mirage_event','event','유랑하는 신기루',-31,117,{kind:'event'})],
    resources:[resource('sun_01','sunstone','햇살석',-20,84),resource('sun_02','sunstone','햇살석',18,119),resource('oasis_herb','dew_vial','오아시스 약초',-9,63)],
    spawns:[spawn('dune_01','dune_stalker',-18,79),spawn('dune_02','dune_stalker',23,102),spawn('dune_03','dune_stalker',31,128),spawn('dune_tyrant','dune_tyrant',2,98,{boss:true})],
  }),
  murkfen: zone({
    id:'murkfen', name:'숨막힌 늪', subtitle:'Murkfen Hollow · 침수된 경계', levelRange:'Lv. 8–10', bounds:{minX:-144,maxX:-48,minZ:48,maxZ:144}, biome:'swamp', weather:'rain', ambient:'swamp_calls', bgm:'murkfen_low',
    visual:{ground:0x405a4a, fog:0x6e8874, sky:0x718a7c, sun:0xb4c08f, detail:0x385443},
    landmark:point('drowned_colossus','landmark','물에 잠긴 거인상',-101,98,{kind:'drowned_statue',description:'늪의 수면 아래에서 길을 가리키는 석상.',marker:'landmark'}),
    waypoints:[point('murk_waypoint','waypoint','갈대 등불',-62,65)],
    pois:[point('sunk_hall','dungeon','가라앉은 회랑',-128,121,{kind:'sunk_hall'}),point('bog_event','event','울음 늪지',-79,128,{kind:'event'})],
    resources:[resource('bog_01','bog_resin','늪 수지',-80,74),resource('bog_02','bog_resin','늪 수지',-124,104),resource('lumen_moss','lumen_moss','등불이끼',-67,128)],
    spawns:[spawn('bog_01_enemy','bog_skulker',-82,81),spawn('bog_02_enemy','bog_skulker',-122,109),spawn('bog_03_enemy','bog_skulker',-109,132),spawn('bog_queen','bog_queen',-101,98,{boss:true})],
  }),
  crownspine: zone({
    id:'crownspine', name:'왕관등뼈 산맥', subtitle:'Crownspine Range · 절벽 전선', levelRange:'Lv. 10–12', bounds:{minX:48,maxX:144,minZ:-144,maxZ:-48}, biome:'mountain', weather:'gust', ambient:'mountain_gust', bgm:'crownspine_horns',
    visual:{ground:0x6c7470, fog:0x9da7a7, sky:0xa7b6be, sun:0xe1dcce, detail:0x535f5b},
    landmark:point('skybridge','landmark','부러진 하늘다리',95,-96,{kind:'sky_bridge',description:'구름 위를 잇던 다리의 마지막 경간.',marker:'landmark'}),
    waypoints:[point('crown_waypoint','waypoint','절벽의 모닥불',58,-66)],
    pois:[point('echo_mine','dungeon','울림 광산',129,-123,{kind:'mine'}),point('cliff_event','event','매달린 종',72,-130,{kind:'event'})],
    resources:[resource('ore_01','crown_ore','왕관 광석',73,-85),resource('ore_02','crown_ore','왕관 광석',124,-105),resource('windflower','windflower','절벽꽃',54,-132)],
    spawns:[spawn('crest_01','crest_giant',70,-87),spawn('crest_02','crest_giant',119,-112),spawn('crest_warden','crest_warden',95,-96,{boss:true})],
  }),
  underroot: zone({
    id:'underroot', name:'뿌리 아래 도시', subtitle:'Underroot · 지하 도시', levelRange:'Lv. 12–14', bounds:{minX:-240,maxX:-144,minZ:48,maxZ:144}, biome:'underground', weather:'spores', ambient:'cavern_drip', bgm:'underroot_pulse',
    visual:{ground:0x443f58, fog:0x645f78, sky:0x45415b, sun:0x9890c8, detail:0x564d70},
    landmark:point('root_city','landmark','뿌리 아래의 도시',-192,96,{kind:'under_city',description:'세계수의 오래된 뿌리 사이에 세워진 도시.',marker:'landmark'}),
    waypoints:[point('under_waypoint','waypoint','뿌리 승강기',-154,61)],
    pois:[point('hollow_depths','dungeon','공허의 갱도',-218,125,{kind:'depths'}),point('echo_market','npc','무음 시장',-180,80,{kind:'market'})],
    resources:[resource('root_ore','root_ore','심근 광석',-178,112),resource('root_moss','lumen_moss','발광 이끼',-218,74)],
    spawns:[spawn('under_01','void_sentinel',-181,112),spawn('under_02','void_sentinel',-218,121),spawn('under_boss','void_sentinel',-192,96,{boss:true})],
  }),
  dreadmarch: zone({
    id:'dreadmarch', name:'황혼의 진군로', subtitle:'Dreadmarch · 고위험 영토', levelRange:'Lv. 14–16', bounds:{minX:144,maxX:240,minZ:-48,maxZ:48}, biome:'highlands', weather:'storm', ambient:'distant_thunder', bgm:'dreadmarch_march',
    visual:{ground:0x4f4548, fog:0x78696d, sky:0x6a626d, sun:0xd09b8d, detail:0x6b4e51},
    landmark:point('black_banner','landmark','검은 깃발 요새',192,0,{kind:'black_keep',description:'끝없이 펄럭이는 깃발 아래의 요새.',marker:'landmark'}),
    waypoints:[point('dread_waypoint','waypoint','붉은 경계석',154,12)],
    pois:[point('war_dungeon','dungeon','무너진 전장',221,-22,{kind:'battlefield'}),point('storm_event','event','번개 깃발',178,29,{kind:'event'})],
    resources:[resource('dread_ore','dread_ore','황혼 광석',185,-12),resource('storm_glass','storm_glass','폭풍 유리',225,20)],
    spawns:[spawn('dread_01','void_sentinel',177,-14),spawn('dread_02','void_sentinel',220,20),spawn('dread_boss','void_sentinel',192,0,{boss:true})],
  }),
  astral_gate: zone({
    id:'astral_gate', name:'별문 최후 경계', subtitle:'Astral Gate · 종막 영토', levelRange:'Lv. 16+', bounds:{minX:144,maxX:240,minZ:-144,maxZ:-48}, biome:'astral', weather:'starlight', ambient:'astral_hum', bgm:'astral_threshold',
    visual:{ground:0x292d4a, fog:0x555478, sky:0x292c4e, sun:0xb7a4ff, detail:0x464779},
    landmark:point('astral_door','landmark','별문',192,-96,{kind:'astral_gate',description:'아직 열리지 않은 세계의 마지막 문.',marker:'landmark'}),
    waypoints:[point('astral_waypoint','waypoint','별빛 정거장',154,-61)],
    pois:[point('final_spire','dungeon','무한의 첨탑',224,-128,{kind:'spire',locked:true}),point('comet_event','event','추락한 혜성',178,-123,{kind:'event'})],
    resources:[resource('star_fragment','star_fragment','별 파편',176,-82),resource('void_bloom','void_bloom','공허꽃',222,-120)],
    spawns:[spawn('astral_01','void_sentinel',180,-83),spawn('astral_02','void_sentinel',221,-116),spawn('astral_boss','void_sentinel',192,-96,{boss:true})],
  }),
});

export const WORLD_BOUNDS = Object.freeze({minX:-240,maxX:240,minZ:-144,maxZ:144});
