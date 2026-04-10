// UI Manager module
import { LOCATIONS, COMBAT_STATE } from '../data/constants.js';
import { MOBS, RESOURCES, NPCS, ITEMS, RECIPES, QUESTS } from '../data/gameData.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.elements = {};
        this.cacheElements();
    }

    cacheElements() {
        // Player stats
        this.elements.playerName = document.getElementById('player-name');
        this.elements.playerLevel = document.getElementById('player-level');
        this.elements.playerHp = document.getElementById('player-hp');
        this.elements.playerMaxHp = document.getElementById('player-max-hp');
        this.elements.playerXp = document.getElementById('player-xp');
        this.elements.playerNextXp = document.getElementById('player-next-xp');
        this.elements.playerGold = document.getElementById('player-gold');

        // Location nav
        this.elements.locationNav = document.getElementById('location-nav');

        // Action groups
        this.elements.combatActions = document.getElementById('combat-actions');
        this.elements.explorationActions = document.getElementById('exploration-actions');
        this.elements.cityActions = document.getElementById('city-actions');
        this.elements.btnMine = document.getElementById('btn-mine');

        // Panels
        this.elements.inventoryList = document.getElementById('inventory-list');
        this.elements.questList = document.getElementById('quest-list');
        this.elements.craftingList = document.getElementById('crafting-list');
        this.elements.combatLog = document.getElementById('combat-log');

        // Dialogs
        this.elements.npcDialog = document.getElementById('npc-dialog');
        this.elements.npcName = document.getElementById('npc-name');
        this.elements.npcText = document.getElementById('npc-text');
        this.elements.dialogOptions = document.getElementById('dialog-options');
        this.elements.closeDialog = document.getElementById('close-dialog');

        this.elements.craftingModal = document.getElementById('crafting-modal');
        this.elements.craftingDetails = document.getElementById('crafting-details');
        this.elements.confirmCraft = document.getElementById('confirm-craft');
        this.elements.cancelCraft = document.getElementById('cancel-craft');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Location navigation
        this.elements.locationNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const location = e.target.dataset.location;
                this.game.teleportTo(location);
            }
        });

        // Combat actions
        document.getElementById('btn-attack').addEventListener('click', () => {
            this.game.combat.playerAttack();
        });

        document.getElementById('btn-heal').addEventListener('click', () => {
            this.game.combat.playerHeal();
        });

        document.getElementById('btn-flee').addEventListener('click', () => {
            this.game.combat.flee();
        });

        // Exploration actions
        document.getElementById('btn-explore').addEventListener('click', () => {
            this.game.explore();
        });

        document.getElementById('btn-mine').addEventListener('click', () => {
            this.game.mine();
        });

        // City actions
        document.getElementById('btn-rest').addEventListener('click', () => {
            this.game.rest();
        });

        document.getElementById('btn-talk-npc').addEventListener('click', () => {
            this.game.showNPCSelector();
        });

        // Dialog close
        this.elements.closeDialog.addEventListener('click', () => {
            this.elements.npcDialog.close();
        });

        // Crafting modal
        this.elements.cancelCraft.addEventListener('click', () => {
            this.elements.craftingModal.close();
        });

        this.elements.confirmCraft.addEventListener('click', () => {
            if (this.game.crafting.selectedRecipe) {
                this.game.crafting.craft(this.game.crafting.selectedRecipe);
                this.elements.craftingModal.close();
            }
        });
    }

    updatePlayerStats() {
        const stats = this.game.player.getStats();
        this.elements.playerName.textContent = stats.name;
        this.elements.playerLevel.textContent = stats.level;
        this.elements.playerHp.textContent = stats.hp;
        this.elements.playerMaxHp.textContent = stats.maxHp;
        this.elements.playerXp.textContent = stats.xp;
        this.elements.playerNextXp.textContent = stats.nextLevelXp;
        this.elements.playerGold.textContent = stats.gold;
    }

    updateLocationNav() {
        const buttons = this.elements.locationNav.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.location === this.game.player.currentLocation);
        });
    }

    updateActions() {
        const combatState = this.game.combat.getState().state;
        const location = this.game.player.currentLocation;

        // Hide all action groups first
        this.elements.combatActions.classList.add('hidden');
        this.elements.explorationActions.classList.add('hidden');
        this.elements.cityActions.classList.add('hidden');

        if (combatState === COMBAT_STATE.IN_COMBAT) {
            this.elements.combatActions.classList.remove('hidden');
        } else if (location === LOCATIONS.CITY) {
            this.elements.cityActions.classList.remove('hidden');
        } else {
            this.elements.explorationActions.classList.remove('hidden');
            
            // Show mine button only in cave
            if (location === LOCATIONS.CAVE) {
                this.elements.btnMine.classList.remove('hidden');
            } else {
                this.elements.btnMine.classList.add('hidden');
            }
        }
    }

    updateInventory() {
        const inventory = this.game.player.inventory;
        
        if (inventory.length === 0) {
            this.elements.inventoryList.innerHTML = '<p style="opacity: 0.6;">Инвентарь пуст</p>';
            return;
        }

        this.elements.inventoryList.innerHTML = inventory.map(item => {
            const itemData = ITEMS[item.itemId];
            return `
                <div class="inventory-item">
                    <span>${itemData.emoji} ${itemData.name} x${item.amount}</span>
                    <button onclick="game.useItem('${item.itemId}')">Использовать</button>
                </div>
            `;
        }).join('');
    }

    updateQuests() {
        const activeQuests = this.game.player.activeQuests;
        
        if (activeQuests.length === 0) {
            this.elements.questList.innerHTML = '<p style="opacity: 0.6;">Нет активных квестов</p>';
            return;
        }

        this.elements.questList.innerHTML = activeQuests.map(quest => {
            const status = this.game.questSystem.getQuestStatus(quest.id);
            const canComplete = status?.isComplete;
            
            return `
                <div class="quest-item">
                    <div>
                        <strong>${quest.name}</strong>
                        <p style="font-size: 12px; opacity: 0.8;">${status?.progressText || ''}</p>
                    </div>
                    ${canComplete ? `<button onclick="game.completeQuest('${quest.id}')">Завершить</button>` : ''}
                </div>
            `;
        }).join('');
    }

    updateCrafting() {
        const recipes = RECIPES;
        
        this.elements.craftingList.innerHTML = recipes.map(recipe => {
            const itemData = ITEMS[recipe.result.itemId];
            const canCraft = this.game.crafting.canCraft(recipe);
            const ingredients = recipe.ingredients.map(ing => {
                const ingData = ITEMS[ing.itemId];
                const has = this.game.player.hasItem(ing.itemId, ing.amount);
                return `<span style="color: ${has ? '#6bcb77' : '#ff6b6b'}">${ingData.emoji} ${ingData.name} ${this.game.player.getItem(ing.itemId)?.amount || 0}/${ing.amount}</span>`;
            }).join(', ');

            return `
                <div class="craft-item">
                    <div>
                        <strong>${itemData.emoji} ${recipe.name}</strong>
                        <p style="font-size: 11px;">${ingredients}</p>
                    </div>
                    <button 
                        onclick="game.openCraftingModal('${recipe.id}')" 
                        ${!canCraft ? 'disabled' : ''}
                    >
                        Скрафтить
                    </button>
                </div>
            `;
        }).join('');
    }

    log(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.elements.combatLog.appendChild(entry);
        this.elements.combatLog.scrollTop = this.elements.combatLog.scrollHeight;

        // Limit log entries
        while (this.elements.combatLog.children.length > 50) {
            this.elements.combatLog.removeChild(this.elements.combatLog.firstChild);
        }
    }

    showNPCDialog(npc) {
        this.elements.npcName.textContent = `${npc.emoji} ${npc.name}`;
        this.elements.npcText.textContent = npc.dialog.greeting;
        
        this.elements.dialogOptions.innerHTML = npc.dialog.options.map(opt => {
            let actionHandler = '';
            switch (opt.action) {
                case 'give_quest':
                    actionHandler = `onclick="game.giveQuestFromNPC('${npc.id}')"`;
                    break;
                case 'open_shop':
                    actionHandler = `onclick="game.openShop('${npc.id}')"`;
                    break;
                case 'open_crafting':
                    actionHandler = `onclick="document.getElementById('crafting-modal').showModal()"`;
                    break;
                case 'close':
                    actionHandler = `onclick="document.getElementById('npc-dialog').close()"`;
                    break;
                default:
                    actionHandler = `onclick="alert('Функционал в разработке!')"`;
            }
            
            return `<button ${actionHandler}>${opt.text}</button>`;
        }).join('');

        this.elements.npcDialog.showModal();
    }

    showNPCSelector() {
        const npcs = NPCS[this.game.player.currentLocation] || [];
        
        if (npcs.length === 0) {
            this.log('Здесь нет NPC для общения', 'info');
            return;
        }

        if (npcs.length === 1) {
            this.showNPCDialog(npcs[0]);
            return;
        }

        this.elements.npcName.textContent = 'Выберите NPC';
        this.elements.npcText.textContent = 'С кем вы хотите поговорить?';
        
        this.elements.dialogOptions.innerHTML = npcs.map(npc => 
            `<button onclick="game.showNPCDialogById('${npc.id}')">${npc.emoji} ${npc.name}</button>`
        ).join('');

        this.elements.npcDialog.showModal();
    }

    updateAll() {
        this.updatePlayerStats();
        this.updateLocationNav();
        this.updateActions();
        this.updateInventory();
        this.updateQuests();
        this.updateCrafting();
        this.game.renderer.update();
    }

    openCraftingModal(recipeId) {
        const recipe = this.game.crafting.getRecipeDetails(recipeId);
        if (!recipe) return;

        this.game.crafting.selectRecipe(recipeId);
        
        const itemData = ITEMS[recipe.result.itemId];
        const ingredients = recipe.ingredients.map(ing => {
            const ingData = ITEMS[ing.itemId];
            const has = this.game.player.hasItem(ing.itemId, ing.amount);
            const currentAmount = this.game.player.getItem(ing.itemId)?.amount || 0;
            return `
                <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                    <span>${ingData.emoji} ${ingData.name}</span>
                    <span style="color: ${has ? '#6bcb77' : '#ff6b6b'}">${currentAmount}/${ing.amount}</span>
                </div>
            `;
        }).join('');

        this.elements.craftingDetails.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 48px;">${itemData.emoji}</span>
                <h4>${itemData.name}</h4>
            </div>
            <h5>Требуемые ресурсы:</h5>
            ${ingredients}
        `;

        this.elements.craftingModal.showModal();
    }
}
