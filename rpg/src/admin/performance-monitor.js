export class PerformanceMonitor {
  constructor() {this.frames=0;this.elapsed=0;this.fps=0;}
  update(delta){this.frames++;this.elapsed+=delta;if(this.elapsed>=.5){this.fps=Math.round(this.frames/this.elapsed);this.frames=0;this.elapsed=0;}return this.fps;}
}
