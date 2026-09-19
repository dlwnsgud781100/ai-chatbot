// Data IDs, routing, and synthesized fallback envelopes. Replace `synth` with asset URLs later.
const cue=(id,channel,frequency,duration=.08,volume=.04,type='triangle')=>Object.freeze({id,channel,synth:{frequency,duration,volume,type}});
export const AUDIO_CUES=Object.freeze({
  'ui.click':cue('ui.click','ui',440,.035,.018,'sine'),'ui.open':cue('ui.open','ui',520,.06,.02,'sine'),'ui.close':cue('ui.close','ui',300,.05,.018,'sine'),
  'player.footstep':cue('player.footstep','ambient',105,.035,.012,'triangle'),'player.swing.light':cue('player.swing.light','combat',180,.055,.025,'sawtooth'),'player.swing.heavy':cue('player.swing.heavy','combat',110,.09,.05,'square'),'player.skill':cue('player.skill','combat',510,.09,.045,'sine'),'player.dodge':cue('player.dodge','combat',390,.05,.022,'sine'),'player.parry':cue('player.parry','combat',720,.12,.07,'sine'),
  'combat.hit':cue('combat.hit','combat',220,.055,.035,'triangle'),'combat.hit.critical':cue('combat.hit.critical','combat',390,.08,.055,'square'),'combat.boss-warning':cue('combat.boss-warning','combat',85,.16,.045,'sawtooth'),'combat.boss-phase':cue('combat.boss-phase','combat',96,.22,.06,'sawtooth'),
  'progress.item':cue('progress.item','ui',660,.07,.028,'sine'),'progress.level':cue('progress.level','ui',840,.16,.05,'sine'),'progress.quest':cue('progress.quest','ui',570,.12,.035,'triangle'),
});

export const MUSIC_STATES=Object.freeze({TOWN:'town',EXPLORATION:'exploration',COMBAT:'combat',ELITE:'elite',BOSS:'boss',BOSS_PHASE_2:'boss_phase_2',BOSS_FINAL:'boss_final',DUNGEON:'dungeon',VICTORY:'victory'});
export const MUSIC_STATE_DEFINITIONS=Object.freeze(Object.fromEntries(Object.values(MUSIC_STATES).map((id)=>[id,{id,asset:null,crossfade:.65}])));
