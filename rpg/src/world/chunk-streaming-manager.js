import { CHUNK_SIZE, WORLD_BOUNDS, ZONES } from '../data/content.js';

const keyFor=(x,z)=>`${x}:${z}`;
const chunkCoord=(value)=>Math.floor(value/CHUNK_SIZE);

/** Keeps only a compact ring of chunks active around the local player. */
export class ChunkStreamingManager {
  constructor(events,renderer,{radius=1}={}) { this.events=events;this.renderer=renderer;this.radius=radius;this.active=new Map();this.lastCenter=null; }
  chunkForPosition(position){return {x:chunkCoord(position.x),z:chunkCoord(position.z)};}
  zoneForChunk(x,z){const center={x:(x+.5)*CHUNK_SIZE,z:(z+.5)*CHUNK_SIZE};return Object.values(ZONES).find((zone)=>center.x>=zone.bounds.minX&&center.x<zone.bounds.maxX&&center.z>=zone.bounds.minZ&&center.z<zone.bounds.maxZ)??null;}
  update(position){const center=this.chunkForPosition(position);if(this.lastCenter?.x===center.x&&this.lastCenter?.z===center.z)return {changed:false,activeKeys:this.keys()};this.lastCenter=center;const desired=new Map();for(let z=center.z-this.radius;z<=center.z+this.radius;z++)for(let x=center.x-this.radius;x<=center.x+this.radius;x++){const worldX=(x+.5)*CHUNK_SIZE,worldZ=(z+.5)*CHUNK_SIZE;if(worldX<WORLD_BOUNDS.minX||worldX>WORLD_BOUNDS.maxX||worldZ<WORLD_BOUNDS.minZ||worldZ>WORLD_BOUNDS.maxZ)continue;const zone=this.zoneForChunk(x,z);if(!zone)continue;const key=keyFor(x,z);desired.set(key,{key,x,z,zone,distance:Math.max(Math.abs(x-center.x),Math.abs(z-center.z))});}
    for(const [key,chunk] of this.active)if(!desired.has(key)){this.renderer.deactivateChunk(key);this.active.delete(key);}
    for(const [key,chunk] of desired){if(!this.active.has(key))this.renderer.activateChunk(chunk);this.renderer.setChunkLod(key,chunk.distance);this.active.set(key,chunk);}
    const payload={changed:true,center,active:[...this.active.values()],activeKeys:this.keys()};this.events.emit('world:streaming-changed',payload);return payload; }
  isActiveAt(position){return this.active.has(keyFor(chunkCoord(position.x),chunkCoord(position.z)));}
  keys(){return new Set(this.active.keys());}
  keyAt(position){return keyFor(chunkCoord(position.x),chunkCoord(position.z));}
}
