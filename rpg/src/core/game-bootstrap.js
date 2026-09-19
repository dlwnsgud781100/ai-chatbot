import { CONFIG } from './config.js';
import { EventBus } from './event-bus.js';
import { Logger } from './logger.js';
import { ServiceContainer } from './service-container.js';
import { GameState } from './game-state.js';
import { EVENT, GAME_STATE, WORLD } from './constants.js';
import { SceneRenderer } from '../renderer/scene-renderer.js';
import { PlayerData } from '../player/player-data.js';
import { PlayerController } from '../player/player-controller.js';
import { CharacterAnimator } from '../player/character-animator.js';
import { CharacterInteraction } from '../player/character-interaction.js';
import { InventoryManager } from '../inventory/inventory-manager.js';
import { EquipmentManager } from '../inventory/equipment-manager.js';
import { LootSystem } from '../inventory/loot-system.js';
import { RewardService } from '../rewards/reward-service.js';
import { ShopService } from '../economy/shop-service.js';
import { DungeonService } from '../dungeon/dungeon-service.js';
import { QuestManager } from '../quest/quest-manager.js';
import { WorldManager } from '../world/world-manager.js';
import { CombatService } from '../combat/combat-service.js';
import { SaveManager } from '../save/save-manager.js';
import { RemoteClient } from '../network/remote-client.js';
import { HUD } from '../ui/hud.js';
import { NotificationUI } from '../ui/notification-ui.js';
import { NavigationUI } from '../ui/navigation-ui.js';
import { MenuController } from '../ui/menu-controller.js';
import { DebugPanel } from '../admin/debug-panel.js';
import { PerformanceMonitor } from '../admin/performance-monitor.js';
import { PresentationSettings } from '../presentation/presentation-settings.js';
import { AudioService } from '../audio/audio-service.js';
import { VfxDirector } from '../vfx/vfx-director.js';
import { RewardPresentation } from '../ui/reward-presentation.js';
import { TransitionUI } from '../ui/transition-ui.js';
import { GuidanceUI } from '../ui/guidance-ui.js';

export class GameBootstrap {
  constructor() { this.services=new ServiceContainer();this.lastFrame=0;this.lastSave=0;this.dialogue=null;this.dialogueReadyAt=0; }
  async initialize() {
    const loading=document.querySelector('#loading-screen');const loadingText=loading.querySelector('span');const loadingBar=loading.querySelector('i b');const progress=(value,label)=>{loadingText.textContent=`${label} · ${value}%`;loadingBar.style.width=`${value}%`;};
    progress(8,'CORE SERVICES');const events=this.services.register('events',new EventBus());const logger=this.services.register('logger',new Logger(events,CONFIG.debug));const state=this.services.register('state',new GameState(events));const save=this.services.register('save',new SaveManager(logger));const presentationSettings=this.services.register('presentationSettings',new PresentationSettings());const saved=save.load();
    progress(22,'RENDERER');const renderer=this.services.register('renderer',new SceneRenderer(document.querySelector('#game-canvas')));renderer.setPresentationSettings(presentationSettings.snapshot());
    progress(38,'PLAYER DATA');const player=this.services.register('player',new PlayerData(saved?.player));const inventory=this.services.register('inventory',new InventoryManager(events,saved?.inventory));const equipment=this.services.register('equipment',new EquipmentManager(player,inventory,events));const quests=this.services.register('quests',new QuestManager(events,inventory,player,saved?.quests));
    progress(54,'WORLD MANAGER');const world=this.services.register('world',new WorldManager(events,renderer,quests,inventory,saved?.world));await world.initialize();const dungeon=this.services.register('dungeon',new DungeonService({events,player,quests,world,saved:player.dungeonProgress}));world.setDungeonService(dungeon);renderer.player.position.set(player.position.x,world.getGroundHeight(player.position.x,player.position.z),player.position.z);renderer.setPlayerFacing(player.rotation);world.activate(renderer.player.position);
    progress(68,'COMBAT SERVICES');const audio=this.services.register('audio',new AudioService(events,presentationSettings));const vfx=this.services.register('vfx',new VfxDirector({events,renderer,settings:presentationSettings}));const loot=this.services.register('loot',new LootSystem(events));const rewards=this.services.register('rewards',new RewardService({events,player,inventory,loot}));const shop=this.services.register('shop',new ShopService(events,player,inventory));const combat=this.services.register('combat',new CombatService({events,player,world,renderer,inventory,gameState:state}));const interaction=this.services.register('interaction',new CharacterInteraction(events,world,state));const animator=this.services.register('animator',new CharacterAnimator(renderer,events));const controller=this.services.register('controller',new PlayerController({events,player,renderer,world,combat,interaction,animator,gameState:state}));combat.setController(controller);controller.bind();
    progress(82,'INTERFACE');const remote=this.services.register('remote',new RemoteClient(events,logger));const hud=this.services.register('hud',new HUD({events,player,inventory,quests,renderer,settings:presentationSettings}));events.emit('world:zone-changed',{zone:world.zones.current});new NotificationUI(events);new RewardPresentation(events);new TransitionUI(events);const persist=()=>save.save({player,inventory,quests,world,dungeon});const navigation=this.services.register('navigation',new NavigationUI({events,world,player}));const guidance=this.services.register('guidance',new GuidanceUI({events,player,world,quests,dungeon}));const applyPresentation=(values)=>{document.documentElement.style.setProperty('--ui-scale',String(values.uiScale));document.documentElement.classList.toggle('reduced-motion',values.reducedMotion);renderer.setPresentationSettings(values);audio.applySettings(values);};applyPresentation(presentationSettings.snapshot());const menu=this.services.register('menu',new MenuController({events,gameState:state,inventory,equipment,quests,player,world,shop,dungeon,settings:presentationSettings,applySettings:applyPresentation,save:persist}));const performance=this.services.register('performance',new PerformanceMonitor());const debug=this.services.register('debug',new DebugPanel({renderer,world,remote,performance,player,quests,dungeon,combat,save}));
    this.bindUI({events,state,renderer,player,inventory,quests,world,combat,controller,remote,menu,persist,audio});events.emit('audio:music',{state:'town'});
    progress(94,'AUTHORITY HANDSHAKE');remote.connect();
    await new Promise(resolve=>setTimeout(resolve,260));progress(100,'FIELD READY');await new Promise(resolve=>setTimeout(resolve,180));loading.style.opacity='0';setTimeout(()=>loading.remove(),500);state.set(GAME_STATE.TITLE,'boot-complete');this.loop(performance,debug,navigation,guidance,controller,combat,renderer,persist);return this;
  }
  bindUI({events,state,renderer,player,inventory,quests,world,combat,controller,remote,menu,persist,audio}) {
    document.querySelector('#start-button').onclick=()=>this.start(state,audio);
    document.querySelector('#respawn-button').onclick=()=>this.respawn({state,renderer,player,world,events,persist});
    document.querySelectorAll('[data-skill]').forEach(button=>button.addEventListener('click',()=>combat.useAction(button.dataset.skill)));
    document.querySelector('#mobile-interact').onclick=()=>controller.interaction.interact();
    events.on('navigation:open-map',()=>menu.open('map'));
    events.on('shop:open',({shopId})=>menu.open('shop',{shopId}));
    events.on(EVENT.BOSS_PHASE,({index})=>events.emit('audio:music',{state:index>=3?'boss_final':'boss_phase_2'}));
    events.on(EVENT.TARGET_CHANGED,({target,locked})=>{if(locked&&target?.data?.boss)events.emit('audio:music',{state:'boss'});else if(locked&&target?.data?.elite)events.emit('audio:music',{state:'elite'});});
    events.on(EVENT.ENEMY_DEFEATED,({enemy})=>{if(enemy?.data?.boss)events.emit('audio:music',{state:'victory'});});
    events.on('world:zone-changed',({zone})=>events.emit('audio:music',{state:zone.id==='worldtree_plaza'?'town':zone.id==='worldtree_plaza'?'town':'exploration'}));
    events.on('network:intent',(intent)=>remote.submit(intent));
    events.on('network:rejected',(result)=>events.emit(EVENT.NOTIFY,{message:`서버 검증 거부: ${result.reason??'알 수 없는 요청'}`,type:'warning'}));
    events.on(EVENT.QUEST_CHANGED,({quest,state:questState})=>{if(questState==='completed')events.emit(EVENT.NOTIFY,{message:`의뢰 완료: ${quest.title}`,type:'success'});});
    events.on(EVENT.REWARD_GRANTED,({xp,gold,items,levels,kind})=>{const itemText=items?.length?` · 아이템 ${items.map((entry)=>`${entry.itemId} ×${entry.quantity}`).join(', ')}`:'';if(xp||gold||items?.length)events.emit(EVENT.NOTIFY,{message:`${kind==='quest'?'의뢰 보상':'획득'} · EXP +${xp} · Gold +${gold}${itemText}`,type:'success'});if(levels?.length)events.emit(EVENT.NOTIFY,{message:`Lv.${levels.at(-1)}로 성장했습니다.`,type:'success'});});
    events.on('player:death',()=>{if(!state.is(GAME_STATE.DEAD)){state.set(GAME_STATE.DEAD,'health-depleted');document.querySelector('#death-screen').classList.remove('hidden');}});
    events.on('ui:dialogue',(dialogue)=>this.openDialogue(dialogue,state));
    window.addEventListener('keydown',(event)=>{
      if(event.code==='F3'){event.preventDefault();this.services.get('debug').toggle();return;}
      if(event.code==='Escape'){if(state.is(GAME_STATE.MODAL))menu.close();return;}
      if(state.is(GAME_STATE.DIALOGUE)&&Date.now()>this.dialogueReadyAt&&(event.code==='KeyE'||event.code==='Space')){event.preventDefault();this.closeDialogue(state);return;}
      if(state.is(GAME_STATE.PLAYING)){if(event.code==='KeyI')menu.open('inventory');if(event.code==='KeyJ')menu.open('quests');if(event.code==='KeyC')menu.open('character');if(event.code==='KeyM')menu.open('map');}
    });
    // Save only on meaningful state changes and on a conservative timed cadence in the loop.
    for(const event of [EVENT.INVENTORY_CHANGED,EVENT.QUEST_CHANGED,EVENT.EQUIPMENT_CHANGED,EVENT.PLAYER_PROGRESS,EVENT.DUNGEON_CHANGED,EVENT.SHOP_CHANGED])events.on(event,()=>persist());
    window.addEventListener('beforeunload',persist);
    events.on('world:zone-changed',({zone})=>events.emit(EVENT.NOTIFY,{message:`${zone.name}에 진입했습니다.`,type:'info'}));
  }
  start(state,audio){audio?.unlock();document.querySelector('#title-screen').classList.add('hidden');document.querySelector('#game-canvas').focus?.();state.set(GAME_STATE.PLAYING,'field-start');this.services.get('events').emit(EVENT.NOTIFY,{message:'변경 탐사가 시작되었습니다. 감시자 아린에게 말을 걸어 보세요.',type:'info'});}
  openDialogue(dialogue,state){this.dialogue=dialogue;document.querySelector('#dialogue-speaker').textContent=dialogue.speaker;document.querySelector('#dialogue-text').textContent=dialogue.text;const choices=document.querySelector('#dialogue-choices');choices.innerHTML='';for(const choice of dialogue.choices??[]){const button=document.createElement('button');button.type='button';button.textContent=choice.label;button.onclick=()=>{this.services.get('events').emit('audio:play',{id:'ui.click'});const action=choice.action;this.closeDialogue(state);action?.();};choices.append(button);}document.querySelector('#dialogue-box').classList.remove('hidden');state.set(GAME_STATE.DIALOGUE,'interaction');this.dialogueReadyAt=Date.now()+160;}
  closeDialogue(state){document.querySelector('#dialogue-box').classList.add('hidden');document.querySelector('#dialogue-choices').innerHTML='';const callback=this.dialogue?.onComplete;this.dialogue=null;state.set(GAME_STATE.PLAYING,'dialogue-close');callback?.();}
  respawn({state,renderer,player,world,events,persist}){player.stats.health=Math.ceil(player.stats.maxHealth*.7);player.stats.energy=player.stats.maxEnergy;renderer.player.position.set(WORLD.RESPAWN.x,world.getGroundHeight(WORLD.RESPAWN.x,WORLD.RESPAWN.z),WORLD.RESPAWN.z);player.position.x=WORLD.RESPAWN.x;player.position.z=WORLD.RESPAWN.z;document.querySelector('#death-screen').classList.add('hidden');state.set(GAME_STATE.PLAYING,'respawn');events.emit(EVENT.NOTIFY,{message:'길잡이 불씨 곁에서 되살아났습니다.',type:'success'});events.emit('player:respawn',{});persist();}
  loop(performance,debug,navigation,guidance,controller,combat,renderer,persist){const frame=(time)=>{const delta=Math.min(CONFIG.performance.maxDelta,(time-this.lastFrame||16.7)/1000);this.lastFrame=time;const state=this.services.get('state');if(state.is(GAME_STATE.PLAYING)){controller.update(delta,time);combat.update(delta,time/1000);if(time-this.lastSave>12000){persist();this.lastSave=time;}}performance.update(delta);navigation.update();guidance.update();debug.update();renderer.update(delta);requestAnimationFrame(frame);};requestAnimationFrame(frame);}
}
