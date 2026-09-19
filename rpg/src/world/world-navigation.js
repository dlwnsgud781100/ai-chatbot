import { ZONES } from '../data/content.js';

export class WorldNavigation {
  constructor(events,saved={}) { this.events=events;this.discoveredZones=new Set(['worldtree_plaza',...(saved.discoveredZones??[])]);this.discoveredWaypoints=new Set(['worldroot_waypoint',...(saved.discoveredWaypoints??[])]);this.activeMarkers=[]; }
  discoverZone(zone){if(this.discoveredZones.has(zone.id))return false;this.discoveredZones.add(zone.id);this.events.emit('navigation:zone-discovered',{zone});return true;}
  discoverWaypoint(waypoint){if(this.discoveredWaypoints.has(waypoint.id))return false;this.discoveredWaypoints.add(waypoint.id);this.events.emit('navigation:waypoint-discovered',{waypoint});return true;}
  updateMarkers(zone,quests){const markers=[];if(zone?.landmark)markers.push({...zone.landmark,marker:'landmark'});for(const point of zone?.waypoints??[])markers.push({...point,marker:'waypoint',available:this.discoveredWaypoints.has(point.id)});for(const point of zone?.pois??[])markers.push({...point,marker:point.type});for(const spawn of zone?.spawns??[]){if(spawn.boss)markers.push({id:`marker-${spawn.id}`,name:'정예 위협',type:'boss',marker:'boss',position:spawn.position});}const quest=quests?.current;if(quest)markers.push({id:'active-quest',name:quest.title,type:'quest',marker:'quest',position:zone?.waypoints?.[0]?.position??{x:0,z:0}});this.activeMarkers=markers;this.events.emit('navigation:markers-changed',{markers,zone});return markers;}
  getZoneList(){return Object.values(ZONES).map((zone)=>({zone,discovered:this.discoveredZones.has(zone.id),waypoint:zone.waypoints.find((point)=>this.discoveredWaypoints.has(point.id))??null}));}
  getMarkers(){return this.activeMarkers;}
  snapshot(){return {discoveredZones:[...this.discoveredZones],discoveredWaypoints:[...this.discoveredWaypoints]};}
}
