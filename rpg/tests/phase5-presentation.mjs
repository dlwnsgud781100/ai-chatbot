import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PresentationSettings, PRESENTATION_DEFAULTS } from '../src/presentation/presentation-settings.js';
import { ANIMATION_STATES, AnimationStateMachine } from '../src/presentation/animation-state-machine.js';
import { AUDIO_CUES, MUSIC_STATES } from '../src/audio/audio-manifest.js';
import { EFFECTS } from '../src/vfx/effect-manifest.js';

const memory=new Map();
const storage={getItem:(key)=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};
const settings=new PresentationSettings({storage});
assert.equal(settings.snapshot().cameraFov,PRESENTATION_DEFAULTS.cameraFov);
settings.patch({masterVolume:9,uiScale:.1,cameraFov:100,reducedMotion:true});
const safe=settings.snapshot();
assert.equal(safe.masterVolume,1);
assert.equal(safe.uiScale,.8);
assert.equal(safe.cameraFov,72);
assert.equal(safe.reducedMotion,true);
const reloaded=new PresentationSettings({storage});
assert.equal(reloaded.snapshot().cameraFov,72,'presentation settings persist separately from gameplay saves');

for(const state of ['Idle','Walk','Run','Sprint','Jump','Fall','Land','LightAttack1','LightAttack2','LightAttack3','HeavyAttack','Skill','Dodge','Dash','Guard','Parry','Hit','Stagger','Death','Victory'])assert.ok(Object.values(ANIMATION_STATES).includes(state),`animation state exists: ${state}`);
const animation=new AnimationStateMachine();
assert.equal(animation.current,ANIMATION_STATES.IDLE);
assert.ok(animation.action({id:'heavy',windup:.2,active:.1,recovery:.3}));
assert.equal(animation.current,ANIMATION_STATES.HEAVY);
assert.equal(animation.transition(ANIMATION_STATES.IDLE),false,'attack lock blocks an accidental locomotion override');
animation.update(.7,{velocity:0});
assert.equal(animation.current,ANIMATION_STATES.IDLE);
animation.transition(ANIMATION_STATES.STAGGER,{lock:.3});
assert.equal(animation.transition(ANIMATION_STATES.RUN),false);

for(const id of ['ui.click','player.swing.heavy','player.parry','combat.boss-phase','progress.level'])assert.ok(AUDIO_CUES[id],`audio cue exists: ${id}`);
for(const state of ['town','exploration','combat','elite','boss','boss_phase_2','boss_final','victory','dungeon'])assert.ok(Object.values(MUSIC_STATES).includes(state));
for(const id of ['effect.player.attack.heavy','effect.player.ultimate','effect.impact.lightning','effect.boss.phase','effect.reward.epic'])assert.ok(EFFECTS[id],`VFX record exists: ${id}`);

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const id of ['hud','boss-hud','dialogue','reward-presentation','transition-layer','game-canvas'])assert.match(html,new RegExp(`data-testid=["']${id}["']`),`stable selector exists: ${id}`);
const menuSource=readFileSync(new URL('../src/ui/menu-controller.js',import.meta.url),'utf8');
for(const id of ['inventory','equipment','quest-tracker','shop','dungeon'])assert.match(menuSource,new RegExp(`dataset\.testid=['"]${id}['"]`),`runtime selector exists: ${id}`);
assert.match(html,/id="damage-direction"/,'directional damage feedback DOM exists');
const mainSource=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
assert.match(mainSource,/renderer-fallback/,'renderer fallback is implemented in page runtime');
console.log('Phase 5 presentation architecture tests passed.');
