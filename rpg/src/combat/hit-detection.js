import * as THREE from 'three';

/** Renderer-independent range/cone checks. Server simulation can use this same contract. */
export class HitDetection {
  constructor(renderer) { this.renderer=renderer; }
  inActionVolume(sourcePosition,sourceFacing,targetPosition,action) {
    const offset=targetPosition.clone().sub(sourcePosition);offset.y=0;const distance=offset.length();if(distance>action.range)return {hit:false,distance,angle:180};if(action.arc>=175)return {hit:true,distance,angle:0};const forward=new THREE.Vector3(Math.sin(sourceFacing),0,Math.cos(sourceFacing)).normalize();const angle=THREE.MathUtils.radToDeg(forward.angleTo(offset.normalize()));return {hit:angle<=action.arc*.5,distance,angle};
  }
  getTargets(sourcePosition,sourceFacing,candidates,action) { return candidates.filter((target)=>this.inActionVolume(sourcePosition,sourceFacing,target.position,action).hit); }
}
