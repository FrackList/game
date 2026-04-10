// Data Manager module - handles all game data lookups
import { MOBS, RESOURCES, NPCS, ITEMS, RECIPES, QUESTS } from '../data/gameData.js';

export class DataManager {
    constructor() {
        this.mobs = MOBS;
        this.resources = RESOURCES;
        this.npcs = NPCS;
        this.items = ITEMS;
        this.recipes = RECIPES;
        this.quests = QUESTS;
    }

    // Mob methods
    getMobsForLocation(location) {
        return this.mobs[location] || [];
    }

    getRandomMob(location) {
        const mobs = this.getMobsForLocation(location);
        if (mobs.length === 0) return null;
        
        // Filter mobs by player level (allow some variance)
        const playerLevel = window.game?.player?.level || 1;
        const validMobs = mobs.filter(mob => 
            mob.level <= playerLevel + 2 && mob.level >= playerLevel - 1
        );
        
        const mobPool = validMobs.length > 0 ? validMobs : mobs;
        return mobPool[Math.floor(Math.random() * mobPool.length)];
    }

    getMobById(mobId) {
        for (const location in this.mobs) {
            const mob = this.mobs[location].find(m => m.id === mobId);
            if (mob) return mob;
        }
        return null;
    }

    // Resource methods
    getResourcesForLocation(location) {
        return this.resources[location] || [];
    }

    getRandomResource(location) {
        const resources = this.getResourcesForLocation(location);
        if (resources.length === 0) return null;
        return resources[Math.floor(Math.random() * resources.length)];
    }

    getResourceById(resourceId) {
        for (const location in this.resources) {
            const resource = this.resources[location].find(r => r.id === resourceId);
            if (resource) return resource;
        }
        return null;
    }

    // NPC methods
    getNpcsForLocation(location) {
        return this.npcs[location] || [];
    }

    getNpcById(npcId) {
        for (const location in this.npcs) {
            const npc = this.npcs[location].find(n => n.id === npcId);
            if (npc) return npc;
        }
        return null;
    }

    // Item methods
    getItem(itemId) {
        return this.items[itemId] || { name: 'Неизвестный предмет', emoji: '❓', value: 0 };
    }

    getAllItems() {
        return this.items;
    }

    // Recipe methods
    getRecipe(recipeId) {
        return this.recipes.find(r => r.id === recipeId);
    }

    getAllRecipes() {
        return this.recipes;
    }

    // Quest methods
    getQuest(questId) {
        return this.quests[questId];
    }

    getAllQuests() {
        return Object.values(this.quests);
    }

    // Utility methods
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    rollLoot(lootTable) {
        const drops = [];
        lootTable.forEach(drop => {
            if (Math.random() < drop.chance) {
                drops.push({
                    itemId: drop.itemId,
                    amount: 1,
                });
            }
        });
        return drops;
    }
}
