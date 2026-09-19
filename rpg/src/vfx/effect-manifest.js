// Semantic effect IDs keep gameplay event sources independent from renderer implementation.
const effect=(id,kind,color,scale=1,life=.35,importance=1)=>Object.freeze({id,kind,color,scale,life,importance});
export const EFFECTS=Object.freeze({
  'effect.player.attack.slash':effect('effect.player.attack.slash','slash',0xf4d48d,1,.18,1),
  'effect.player.attack.heavy':effect('effect.player.attack.heavy','slash',0xffc36e,1.5,.28,2),
  'effect.player.skill.lightning':effect('effect.player.skill.lightning','burst',0xa8dfff,1.15,.34,2),
  'effect.player.ultimate':effect('effect.player.ultimate','burst',0xffeea6,2.3,.62,4),
  'effect.player.dodge':effect('effect.player.dodge','ring',0x9ccfb1,.85,.25,1),
  'effect.player.parry':effect('effect.player.parry','burst',0xffe59a,1.35,.36,3),
  'effect.impact.physical':effect('effect.impact.physical','burst',0xf4c86e,.75,.18,1),
  'effect.impact.lightning':effect('effect.impact.lightning','spark',0xa8dfff,1,.26,2),
  'effect.impact.fire':effect('effect.impact.fire','spark',0xff9d61,1,.26,2),
  'effect.impact.ice':effect('effect.impact.ice','spark',0xa5ecff,1,.26,2),
  'effect.impact.poison':effect('effect.impact.poison','spark',0xa8df6f,1,.26,2),
  'effect.boss.phase':effect('effect.boss.phase','burst',0xffe58c,2.9,.8,4),
  'effect.boss.enrage':effect('effect.boss.enrage','burst',0xf15151,2.6,.7,4),
  'effect.reward.common':effect('effect.reward.common','spark',0xe8cc7e,.75,.32,1),
  'effect.reward.rare':effect('effect.reward.rare','burst',0x72b9e9,1.3,.5,2),
  'effect.reward.epic':effect('effect.reward.epic','burst',0xbd8bea,2,.7,3),
});
