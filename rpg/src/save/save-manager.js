import { SAVE_VERSION } from '../core/constants.js';
import { validateSave } from './data-validation.js';
const STORAGE_KEY='ashenwild-frontier.save';
export class SaveManager {
  constructor(logger) { this.logger=logger; }
  load(){try{return validateSave(JSON.parse(localStorage.getItem(STORAGE_KEY)));}catch(error){this.logger.warn('SaveManager','Invalid local save ignored',error);return null;}}
  save({player,inventory,quests}){const payload={version:SAVE_VERSION,updatedAt:new Date().toISOString(),player:player.snapshot(),inventory:inventory.snapshot(),quests:quests.snapshot()};try{localStorage.setItem(STORAGE_KEY,JSON.stringify(payload));return true;}catch(error){this.logger.error('SaveManager','Save failed',error);return false;}}
  clear(){localStorage.removeItem(STORAGE_KEY);}
}
