import { CharacterStats } from './character-stats.js';
export class PlayerData {
  constructor(saved={}) { this.id='local-player'; this.name='리프'; this.position={x:saved.position?.x ?? -10,y:0,z:saved.position?.z ?? 9}; this.rotation=saved.rotation ?? 0; this.stats=new CharacterStats(saved.stats); this.state=saved.state ?? 'idle'; this.equipment=saved.equipment ?? {weapon:'frontier_blade'}; }
  snapshot() { return { position:{x:this.position.x,z:this.position.z},rotation:this.rotation,state:this.state,stats:this.stats.snapshot(),equipment:this.equipment }; }
}
