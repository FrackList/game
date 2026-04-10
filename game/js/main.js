// Main Game Controller - orchestrates all game systems
import { Player } from './modules/Player.js';
import { CombatSystem } from './modules/CombatSystem.js';
import { CraftingSystem } from './modules/CraftingSystem.js';
import { QuestSystem } from './modules/QuestSystem.js';
import { UIManager } from './modules/UIManager.js';
import { Renderer } from './modules/Renderer.js';
import { DataManager } from './modules/DataManager.js';
import { LOCATIONS, COMBAT_STATE } from './data/constants.js';
import { NPCS } from './data/gameData.js';

class Game {
    constructor() {
        this.player = new Player();
        this.dataManager = new DataManager();
        this.combat = new CombatSystem(this);
        this.crafting = new CraftingSystem(this);
        this.questSystem = new QuestSystem(this);
        this.ui = new UIManager(this);
        this.renderer = new Renderer(this);
        
        this.currentResourceNode = null;
    }

    init() {
        // Start the renderer
        this.renderer.start();
        
        // Update UI
        this.ui.updateAll();
        
        // Log welcome message
        this.log('🎮 Добро пожаловать в Browser MMORPG!', 'info');
        this.log('📍 Вы находитесь в городе. Используйте навигацию для перемещения.', 'info');
        
        // Setup global reference for onclick handlers
        window.game = this;
    }

    // Location management
    teleportTo(location) {
        if (this.combat.getState().state !== COMBAT_STATE.NONE) {
            this.log('❌ Нельзя сбежать из боя!', 'combat');
            return;
        }

        this.player.setLocation(location);
        this.ui.log(`🚶 Вы прибыли в: ${this.getLocationName(location)}`, 'info');
        this.ui.updateAll();
        this.currentResourceNode = null;
    }

    getLocationName(location) {
        const names = {
            [LOCATIONS.CITY]: 'Город',
            [LOCATIONS.PLAINS]: 'Равнина',
            [LOCATIONS.FOREST]: 'Лес',
            [LOCATIONS.CAVE]: 'Пещера',
        };
        return names[location] || 'Неизвестно';
    }

    // Exploration
    explore() {
        if (this.combat.getState().state !== COMBAT_STATE.NONE) return;

        const encounterChance = 0.7; // 70% chance of encounter
        
        if (Math.random() < encounterChance) {
            const mob = this.dataManager.getRandomMob(this.player.currentLocation);
            if (mob) {
                this.combat.startCombat(mob);
            } else {
                this.log('🌿 Никого интересного не найдено...', 'info');
            }
        } else {
            this.log('🔍 Вы исследовали местность, но ничего не нашли.', 'info');
        }
    }

    // Mining
    mine() {
        if (this.player.currentLocation !== LOCATIONS.CAVE) {
            this.log('❌ Добывать руду можно только в пещере!', 'info');
            return;
        }

        if (this.combat.getState().state !== COMBAT_STATE.NONE) {
            this.log('❌ Сначала закончите бой!', 'combat');
            return;
        }

        // 50% chance to find a resource node
        if (Math.random() < 0.5) {
            const resource = this.dataManager.getRandomResource(LOCATIONS.CAVE);
            if (resource) {
                this.mineNode(resource);
            }
        } else {
            // Small chance of mob encounter while mining
            if (Math.random() < 0.3) {
                const mob = this.dataManager.getRandomMob(LOCATIONS.CAVE);
                if (mob) {
                    this.log('⚠️ На вас напали пока вы копали!', 'combat');
                    this.combat.startCombat(mob);
                    return;
                }
            }
            this.log('⛏️ Вы копаете, но ничего ценного не находите...', 'info');
        }
    }

    mineNode(resource) {
        this.currentResourceNode = { ...resource, currentHp: resource.health };
        this.log(`⛏️ Вы нашли: ${resource.emoji} ${resource.name}!`, 'loot');
        this.log(`   HP узла: ${this.currentResourceNode.currentHp}/${resource.health}`, 'info');
        
        // Mine once
        const damage = this.dataManager.getRandomInt(15, 25);
        this.currentResourceNode.currentHp -= damage;
        
        this.log(`💥 Вы нанесли ${damage} урона узлу`, 'info');

        if (this.currentResourceNode.currentHp <= 0) {
            // Node destroyed, get rewards
            const amount = this.dataManager.getRandomInt(
                resource.reward.amount[0], 
                resource.reward.amount[1]
            );
            
            this.player.addItem({ itemId: resource.reward.itemId, amount });
            this.player.addXp(resource.xpReward);
            this.player.stats.mined++;
            this.player.updateQuestProgress('mine', null, amount);
            
            const itemData = this.dataManager.getItem(resource.reward.itemId);
            this.log(`📦 Получено: ${itemData.emoji} ${itemData.name} x${amount}`, 'loot');
            this.log(`✨ +${resource.xpReward} XP`, 'loot');
            
            this.currentResourceNode = null;
            this.checkQuests();
        } else {
            this.log(`   Продолжайте копать! HP узла: ${this.currentResourceNode.currentHp}`, 'info');
        }

        this.ui.updatePlayerStats();
        this.ui.updateInventory();
        this.ui.updateQuests();
    }

    // Rest in city
    rest() {
        if (this.player.currentLocation !== LOCATIONS.CITY) {
            this.log('❌ Отдохнуть можно только в городе!', 'info');
            return;
        }

        const healAmount = this.player.maxHp - this.player.hp;
        if (healAmount > 0) {
            this.player.heal(healAmount);
            this.log(`🛏️ Вы отдохнули и восстановили ${healAmount} HP`, 'info');
            this.ui.updatePlayerStats();
        } else {
            this.log('😴 Вы полны сил!', 'info');
        }
    }

    // Item usage
    useItem(itemId) {
        const item = this.dataManager.getItem(itemId);
        
        if (item.type === 'consumable' && item.effect) {
            if (item.effect.type === 'heal') {
                const healed = this.player.heal(item.effect.value);
                this.player.removeItem(itemId);
                this.log(`💚 Использовано ${item.name}, восстановлено ${healed} HP`, 'info');
                this.ui.updatePlayerStats();
                this.ui.updateInventory();
            }
        } else {
            this.log(`ℹ️ ${item.name}: ${item.type === 'weapon' ? `+${item.stats.attack} Атака` : item.type === 'armor' ? `+${item.stats.defense} Защита` : 'Предмет'}`, 'info');
        }
    }

    // NPC interactions
    showNPCDialogById(npcId) {
        const npc = this.dataManager.getNpcById(npcId);
        if (npc) {
            this.ui.showNPCDialog(npc);
        }
    }

    giveQuestFromNPC(npcId) {
        const npc = this.dataManager.getNpcById(npcId);
        if (!npc || !npc.quests) {
            this.log('У этого NPC нет квестов для вас.', 'info');
            return;
        }

        const availableQuest = npc.quests.find(qid => 
            !this.player.activeQuests.some(q => q.id === qid) &&
            !this.player.completedQuests.includes(qid)
        );

        if (availableQuest) {
            this.questSystem.giveQuest(availableQuest);
            document.getElementById('npc-dialog').close();
        } else {
            this.log('У этого NPC нет доступных квестов.', 'info');
        }
    }

    openShop(npcId) {
        this.log('🏪 Торговля будет доступна в следующей версии!', 'info');
    }

    // Quest management
    checkQuests() {
        this.player.activeQuests.forEach(quest => {
            if (this.questSystem.checkQuestCompletion(quest)) {
                this.log(`✅ Квест "${quest.name}" можно завершить!`, 'quest');
            }
        });
        this.ui.updateQuests();
    }

    completeQuest(questId) {
        this.questSystem.completeQuest(questId);
    }

    // Logging
    log(message, type = 'info') {
        this.ui.log(message, type);
    }

    // Sell item
    sellItem(itemId) {
        const item = this.dataManager.getItem(itemId);
        const sellPrice = Math.floor(item.value * 0.5);
        
        this.player.removeItem(itemId);
        this.player.changeGold(sellPrice);
        
        this.log(`💰 Продано: ${item.name} за ${sellPrice} золота`, 'loot');
        this.ui.updatePlayerStats();
        this.ui.updateInventory();
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
