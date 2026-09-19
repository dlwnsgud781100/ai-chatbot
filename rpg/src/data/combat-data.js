// Combat data is intentionally separate from enemy presentation/progression data.
// Adding an element, player action, enemy pattern, or boss phase should be a data change.
export const DAMAGE_TYPES = Object.freeze({
  physical:{label:'물리',color:'#f4ead4'}, fire:{label:'화염',color:'#f39a65'}, ice:{label:'냉기',color:'#9fe7ff'}, lightning:{label:'번개',color:'#d8b7ff'}, dark:{label:'암흑',color:'#b487d9'}, light:{label:'광휘',color:'#ffe28a'}, poison:{label:'독',color:'#9bd66d'}, bleed:{label:'출혈',color:'#ef6f6b'},
});

export const PLAYER_ACTIONS = Object.freeze({
  light_1:{id:'light_1',label:'초승 절단',type:'physical',baseDamage:16,range:3.2,arc:115,windup:.07,active:.12,recovery:.18,comboWindow:.52,stagger:14,hitStop:.045,shake:.09,animation:'light_1'},
  light_2:{id:'light_2',label:'되돌림',type:'physical',baseDamage:20,range:3.4,arc:130,windup:.08,active:.12,recovery:.2,comboWindow:.5,stagger:18,hitStop:.055,shake:.12,animation:'light_2'},
  light_3:{id:'light_3',label:'갈라지는 끝',type:'bleed',baseDamage:28,range:3.8,arc:145,windup:.13,active:.16,recovery:.32,comboWindow:0,stagger:31,knockback:4.6,status:{id:'bleed',duration:4,interval:1,damage:5},hitStop:.075,shake:.18,animation:'light_3'},
  heavy:{id:'heavy',label:'균열 강타',type:'physical',energy:14,cooldown:1.15,baseDamage:48,range:4.2,arc:105,windup:.32,active:.18,recovery:.48,stagger:52,knockback:7.5,hitStop:.11,shake:.35,animation:'heavy'},
  rift:{id:'rift',label:'번개 균열창',type:'lightning',energy:22,cooldown:4.4,baseDamage:38,range:10.5,arc:36,windup:.16,active:.08,recovery:.32,stagger:30,status:{id:'shock',duration:1.15,interval:1,damage:0,stun:.45},hitStop:.07,shake:.22,animation:'rift'},
  air:{id:'air',label:'낙하 참격',type:'physical',energy:8,cooldown:.8,baseDamage:35,range:3.6,arc:150,windup:.04,active:.14,recovery:.3,stagger:38,knockback:5.5,hitStop:.09,shake:.28,animation:'air'},
  ultimate:{id:'ultimate',label:'여명의 단죄',type:'light',ultimateCost:100,cooldown:16,baseDamage:92,range:8.5,arc:180,windup:.38,active:.22,recovery:.7,stagger:120,knockback:9,status:{id:'radiant_burn',duration:4,interval:1,damage:9},hitStop:.16,shake:.6,animation:'ultimate'},
  dodge:{id:'dodge',label:'회피',energy:18,cooldown:1.25,animation:'dodge'},
  dash:{id:'dash',label:'질풍 돌진',energy:12,cooldown:.75,animation:'dash'},
  potion:{id:'potion',label:'이슬 약병',cooldown:1,animation:'potion'},
});

const melee=(id,damage,range=2.25,windup=.38,recovery=.45,extra={})=>({id,type:'physical',damage,range,windup,active:.11,recovery,telegraph:0xff8866,...extra});
export const ENEMY_COMBAT_PROFILES = Object.freeze({
  thornwalker:{detectRange:11,leashRange:22,patrolRadius:3,moveStyle:'skitter',patterns:[melee('thorn_lash',10,2.1,.34,.42,{stagger:7})],resistances:{poison:35,fire:-15}},
  cinder_moth:{detectRange:10,leashRange:22,patrolRadius:4,fleeAt:.18,moveStyle:'hover',patterns:[{id:'ember_spit',type:'fire',damage:13,range:6.6,windup:.52,active:.08,recovery:.5,telegraph:0xff813f,stagger:6,projectile:true}],resistances:{fire:45,ice:-20}},
  frost_wisp:{detectRange:11,leashRange:24,patrolRadius:4,moveStyle:'hover',patterns:[{id:'frost_bolt',type:'ice',damage:16,range:7.5,windup:.48,active:.08,recovery:.45,telegraph:0x94e6ff,stagger:7,projectile:true,status:{id:'chill',duration:2,interval:1,damage:0,slow:.28}}],resistances:{ice:45,fire:-20}},
  rootwarden:{detectRange:13,leashRange:28,patrolRadius:3,moveStyle:'heavy',staggerThreshold:115,patterns:[melee('root_cleave',19,2.9,.56,.7,{stagger:18,knockback:4}),{id:'root_slam',type:'physical',damage:24,range:4.5,windup:.82,active:.16,recovery:.72,telegraph:0xd8b66f,stagger:27,knockback:6,area:true}],resistances:{poison:50,fire:-10}},
  ember_sentinel:{detectRange:14,leashRange:30,patrolRadius:2,moveStyle:'heavy',staggerThreshold:150,patterns:[melee('furnace_cleave',25,3,.58,.65,{type:'fire',stagger:24}),{id:'cinder_wave',type:'fire',damage:30,range:7,windup:.9,active:.1,recovery:.8,telegraph:0xff6d3f,area:true,stagger:28}],resistances:{fire:65,ice:-25}},
  thornheart_titan:{detectRange:19,leashRange:38,patrolRadius:1,moveStyle:'heavy',staggerThreshold:220,patterns:[melee('root_hammer',28,3.7,.66,.65,{stagger:30,knockback:6})],resistances:{poison:55,fire:10,light:-20}},
  frost_matriarch:{detectRange:15,leashRange:34,patrolRadius:2,moveStyle:'hover',staggerThreshold:190,patterns:[{id:'ice_lance',type:'ice',damage:28,range:9,windup:.7,active:.08,recovery:.58,telegraph:0xa9efff,projectile:true,stagger:19},{id:'whiteout_burst',type:'ice',damage:34,range:6,windup:1,active:.15,recovery:.85,telegraph:0xc5f4ff,area:true,status:{id:'chill',duration:2.5,interval:1,damage:0,slow:.35}}],resistances:{ice:65,fire:-25}},
  default:{detectRange:12,leashRange:26,patrolRadius:3,moveStyle:'ground',patterns:[melee('wild_strike',14)]},
});

export const BOSS_PROFILES = Object.freeze({
  thornheart_titan:{
    id:'thornheart_titan',name:'심근의 수호자 · 아우렐',staggerThreshold:220,enrageAt:.22,
    phases:[
      {threshold:1,label:'각성',arena:'roots',patterns:[melee('root_hammer',28,3.7,.66,.65,{stagger:30,knockback:6}),{id:'thorn_line',type:'poison',damage:24,range:9,windup:.72,active:.1,recovery:.65,telegraph:0xb9e36e,projectile:true,status:{id:'poison',duration:4,interval:1,damage:5}}]},
      {threshold:.65,label:'뿌리 폭주',arena:'brambles',patterns:[{id:'briar_nova',type:'poison',damage:33,range:7,windup:1.05,active:.17,recovery:.72,telegraph:0xd9ff7d,area:true,stagger:35,status:{id:'poison',duration:4,interval:1,damage:6}},{id:'root_charge',type:'physical',damage:39,range:10,windup:.72,active:.13,recovery:.65,telegraph:0xefbb6e,dash:true,stagger:44,knockback:9},melee('sweeping_root',31,4.5,.54,.52,{stagger:31,knockback:6})]},
      {threshold:.32,label:'심장 노출',arena:'pulse',weakPoint:true,patterns:[{id:'heart_pulse',type:'light',damage:42,range:11,windup:1.15,active:.2,recovery:.7,telegraph:0xffe389,area:true,stagger:48},{id:'thorn_rain',type:'poison',damage:30,range:10,windup:.66,active:.09,recovery:.5,telegraph:0xc3ed73,projectile:true,projectileCount:3,stagger:20},melee('furious_hammer',38,4.3,.45,.42,{stagger:42,knockback:8})]},
    ],
  },
});
