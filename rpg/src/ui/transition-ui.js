import { EVENT } from '../core/constants.js';

/** Short diegetic veil for transitions; it never blocks gameplay state or streaming work. */
export class TransitionUI {
  constructor(events){this.events=events;this.root=document.querySelector('#transition-layer');this.title=this.root.querySelector('[data-transition-title]');this.subtitle=this.root.querySelector('[data-transition-subtitle]');events.on('world:zone-changed',({zone})=>this.show(zone.name,zone.subtitle,900));events.on(EVENT.DUNGEON_CHANGED,({dungeon,state})=>this.show(dungeon.name,state==='Entered'?'심근 성소에 발을 들입니다.':'성소의 맥박이 변화합니다.',780));events.on(EVENT.TARGET_CHANGED,({target,locked})=>{if(locked&&target?.data?.boss)this.show(target.data.name,'심근의 수호자가 길을 가로막습니다.',1250);});events.on('world:fast-travel',({name})=>this.show(name,'표석의 빛을 따라 이동합니다.',720));events.on('player:respawn',()=>this.show('길잡이 불씨','다시 경계로 돌아갑니다.',680));}
  show(title,subtitle,duration=800){this.title.textContent=title;this.subtitle.textContent=subtitle;this.root.classList.remove('hidden','show');requestAnimationFrame(()=>this.root.classList.add('show'));clearTimeout(this.timer);this.timer=setTimeout(()=>{this.root.classList.remove('show');setTimeout(()=>this.root.classList.add('hidden'),220);},duration);}
}
