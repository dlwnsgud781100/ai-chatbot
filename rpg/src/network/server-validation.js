// Shared action-intent contract. The browser submits only action/target identifiers — never
// damage, XP, drops, cooldown values, or currency. A production server resolves all outcomes.
const VALID_TYPES=new Set(['move','combat','interact','respawn']);
const VALID_ACTIONS=new Set(['light_1','light_2','light_3','heavy','rift','air','ultimate']);
export function validateIntent(intent) { if(!intent||typeof intent!=='object'||!VALID_TYPES.has(intent.type))return {valid:false,reason:'Unsupported intent'};if(intent.type==='move'){const {x,z}=intent.position??{};if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>1000||Math.abs(z)>1000)return {valid:false,reason:'Invalid movement vector'};}if(intent.type==='combat'&&(!VALID_ACTIONS.has(intent.action)||typeof intent.targetId!=='string'||!/^[-a-z0-9_]{1,96}$/i.test(intent.targetId)))return {valid:false,reason:'Invalid combat intent'};return {valid:true}; }
