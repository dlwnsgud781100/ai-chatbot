import { ZONES } from '../data/content.js';

const MARKER_COLOR={landmark:'#efd18a',waypoint:'#8ee4e5',dungeon:'#dd8a7a',boss:'#eb655d',quest:'#f2d175',event:'#ba94e8',service:'#a7d487',secret:'#d1c0ff',npc:'#a6d9e6'};
export class NavigationUI {
  constructor({events,world,player}) { this.events=events;this.world=world;this.player=player;this.canvas=document.querySelector('#minimap-canvas');this.ctx=this.canvas.getContext('2d');this.level=document.querySelector('#minimap-zone-level');this.frame=0;this.currentZone=world.zones.current;document.querySelector('#minimap-map-button').onclick=()=>events.emit('navigation:open-map',{});events.on('world:zone-changed',({zone})=>{this.currentZone=zone;this.render();});events.on('navigation:markers-changed',()=>this.render());events.on('navigation:zone-discovered',()=>this.render());events.on('navigation:waypoint-discovered',()=>this.render()); }
  update(){if(++this.frame%5===0)this.render();}
  render(){const canvas=this.canvas,ctx=this.ctx,size=canvas.width;ctx.clearRect(0,0,size,size);ctx.fillStyle='#0b160e';ctx.fillRect(0,0,size,size);const zone=this.currentZone??this.world.zones.current;if(!zone)return;this.level.textContent=zone.levelRange.toUpperCase();const range=76,scale=size/(range*2),toCanvas=(position)=>({x:size/2+(position.x-this.player.position.x)*scale,y:size/2+(position.z-this.player.position.z)*scale});
    for(const entry of Object.values(ZONES)){if(!this.world.navigation.discoveredZones.has(entry.id))continue;const min=toCanvas({x:entry.bounds.minX,z:entry.bounds.minZ}),max=toCanvas({x:entry.bounds.maxX,z:entry.bounds.maxZ});ctx.fillStyle=entry.id===zone.id?'rgba(143,205,132,.18)':'rgba(128,157,133,.07)';ctx.fillRect(min.x,min.y,max.x-min.x,max.y-min.y);ctx.strokeStyle=entry.id===zone.id?'rgba(171,225,150,.65)':'rgba(160,190,166,.2)';ctx.strokeRect(min.x,min.y,max.x-min.x,max.y);}
    ctx.strokeStyle='rgba(211,235,199,.16)';ctx.beginPath();ctx.moveTo(size/2,0);ctx.lineTo(size/2,size);ctx.moveTo(0,size/2);ctx.lineTo(size,size/2);ctx.stroke();
    for(const marker of this.world.navigation.getMarkers()){const point=toCanvas(marker.position);if(point.x<-8||point.y<-8||point.x>size+8||point.y>size+8)continue;ctx.fillStyle=MARKER_COLOR[marker.marker??marker.type]??'#d9e1d5';ctx.beginPath();ctx.arc(point.x,point.y,marker.type==='boss'?4:2.7,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#f3f7e9';ctx.beginPath();ctx.moveTo(size/2,size/2-6);ctx.lineTo(size/2+5,size/2+5);ctx.lineTo(size/2-5,size/2+5);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(221,240,210,.3)';ctx.strokeRect(.5,.5,size-1,size-1);
  }
}
