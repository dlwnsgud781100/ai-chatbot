// Environment is driven by zone data, not hand-written conditional branches.
export class EnvironmentManager {
  constructor(renderer) { this.renderer=renderer;this.time=0;this.currentZone=null; }
  setZone(zone){if(!zone||zone.id===this.currentZone?.id)return;this.currentZone=zone;this.renderer.applyZoneEnvironment(zone);}
  update(delta,zone) { this.time+=delta;if(zone?.id!==this.currentZone?.id)this.setZone(zone);this.renderer.updateEnvironment(this.time,zone); }
}
