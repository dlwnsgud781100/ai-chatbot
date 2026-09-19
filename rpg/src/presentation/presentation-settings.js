const STORAGE_KEY='ashenwild-frontier.presentation-settings';

export const PRESENTATION_DEFAULTS=Object.freeze({
  masterVolume:.78,musicVolume:.42,sfxVolume:.72,combatVolume:.82,uiVolume:.68,ambientVolume:.5,voiceVolume:.7,
  uiScale:1,cameraSensitivity:1,cameraDistance:1,cameraFov:55,cameraShake:true,screenEffects:true,reducedMotion:false,
});

const number=(value,fallback,min,max)=>Number.isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
const boolean=(value,fallback)=>typeof value==='boolean'?value:fallback;

/** Presentation preferences are deliberately separate from authoritative player/RPG state. */
export class PresentationSettings {
  constructor({storage=globalThis.localStorage}={}){this.storage=storage;this.values={...PRESENTATION_DEFAULTS,reducedMotion:Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)};this.load();}
  load(){try{const raw=JSON.parse(this.storage?.getItem?.(STORAGE_KEY)??'null');if(raw&&typeof raw==='object')this.values=this.validate({...this.values,...raw});}catch{this.values={...PRESENTATION_DEFAULTS,reducedMotion:Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)};}return this.snapshot();}
  set(key,value){if(!(key in PRESENTATION_DEFAULTS))return false;this.values=this.validate({...this.values,[key]:value});this.persist();return true;}
  patch(values={}){this.values=this.validate({...this.values,...values});this.persist();return this.snapshot();}
  validate(values){return {
    masterVolume:number(values.masterVolume,PRESENTATION_DEFAULTS.masterVolume,0,1),musicVolume:number(values.musicVolume,PRESENTATION_DEFAULTS.musicVolume,0,1),sfxVolume:number(values.sfxVolume,PRESENTATION_DEFAULTS.sfxVolume,0,1),combatVolume:number(values.combatVolume,PRESENTATION_DEFAULTS.combatVolume,0,1),uiVolume:number(values.uiVolume,PRESENTATION_DEFAULTS.uiVolume,0,1),ambientVolume:number(values.ambientVolume,PRESENTATION_DEFAULTS.ambientVolume,0,1),voiceVolume:number(values.voiceVolume,PRESENTATION_DEFAULTS.voiceVolume,0,1),
    uiScale:number(values.uiScale,PRESENTATION_DEFAULTS.uiScale,.8,1.25),cameraSensitivity:number(values.cameraSensitivity,PRESENTATION_DEFAULTS.cameraSensitivity,.5,1.5),cameraDistance:number(values.cameraDistance,PRESENTATION_DEFAULTS.cameraDistance,.7,1.45),cameraFov:number(values.cameraFov,PRESENTATION_DEFAULTS.cameraFov,45,72),cameraShake:boolean(values.cameraShake,PRESENTATION_DEFAULTS.cameraShake),screenEffects:boolean(values.screenEffects,PRESENTATION_DEFAULTS.screenEffects),reducedMotion:boolean(values.reducedMotion,PRESENTATION_DEFAULTS.reducedMotion),
  };}
  persist(){try{this.storage?.setItem?.(STORAGE_KEY,JSON.stringify(this.values));}catch{/* Storage is optional presentation polish, never gameplay-critical. */}}
  snapshot(){return {...this.values};}
}
