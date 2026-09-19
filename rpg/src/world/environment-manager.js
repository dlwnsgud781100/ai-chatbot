export class EnvironmentManager {
  constructor(renderer) { this.renderer=renderer;this.time=0; }
  update(delta,zone) { this.time+=delta; this.renderer.updateEnvironment(this.time,zone?.biome); }
}
