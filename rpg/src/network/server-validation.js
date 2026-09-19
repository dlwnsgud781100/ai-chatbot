// Shared intent contract. The Python demo server mirrors this allow-list; production must authenticate
// each player and validate against authoritative entity state held only on the server.
const VALID_TYPES=new Set(['move','combat','interact','respawn']);
export function validateIntent(intent) { if(!intent||typeof intent!=='object'||!VALID_TYPES.has(intent.type)) return {valid:false,reason:'Unsupported intent'};if(intent.type==='move'){const {x,z}=intent.position??{};if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>1000||Math.abs(z)>1000)return {valid:false,reason:'Invalid movement vector'};}if(intent.type==='combat'&&(!/^[a-z_]+$/.test(intent.skill??'')||typeof intent.targetId!=='string'))return {valid:false,reason:'Invalid combat intent'};return {valid:true}; }
