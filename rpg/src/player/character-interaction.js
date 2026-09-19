import { EVENT, WORLD } from '../core/constants.js';
export class CharacterInteraction {
  constructor(events, world, gameState) { this.events=events; this.world=world; this.gameState=gameState; this.nearest=null; }
  update(playerPosition) { this.nearest=this.world.getNearestInteractable(playerPosition,WORLD.INTERACTION_RANGE); this.events.emit(EVENT.INTERACTION,{entity:this.nearest}); }
  interact() { if (!this.nearest) return false; return this.world.interact(this.nearest); }
}
