// Renderer-neutral state holder. A production animation controller can map these semantic states to clips.
export class CharacterAnimator {
  constructor(renderer) { this.renderer=renderer; this.state='idle'; }
  set(state) { this.state=state; this.renderer.setPlayerAnimation(state); }
  update(delta, velocity) { if (this.state==='attack'||this.state==='dodge'||this.state==='dead') return; this.set(velocity>.2?'run':'idle'); this.renderer.animatePlayer(delta,velocity); }
}
