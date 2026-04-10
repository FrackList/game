// Crafting system module
import { RECIPES, ITEMS } from '../data/gameData.js';

export class CraftingSystem {
    constructor(game) {
        this.game = game;
        this.selectedRecipe = null;
    }

    getRecipes() {
        return RECIPES;
    }

    canCraft(recipe) {
        return recipe.ingredients.every(ing => 
            this.game.player.hasItem(ing.itemId, ing.amount)
        );
    }

    craft(recipe) {
        if (!this.canCraft(recipe)) {
            this.game.log(`❌ Недостаточно ресурсов для крафта!`, 'craft');
            return false;
        }

        // Remove ingredients
        recipe.ingredients.forEach(ing => {
            this.game.player.removeItem(ing.itemId, ing.amount);
        });

        // Add result
        const resultItem = { ...recipe.result };
        this.game.player.addItem(resultItem);

        // Update stats
        this.game.player.stats.crafted++;

        const itemData = ITEMS[recipe.result.itemId];
        this.game.log(`🔨 Скрафчено: ${itemData.emoji} ${itemData.name} x${resultItem.amount}`, 'craft');

        this.game.ui.updateInventory();
        this.game.ui.updateCrafting();
        
        return true;
    }

    getCraftableRecipes() {
        return RECIPES.filter(recipe => this.canCraft(recipe));
    }

    getRecipeDetails(recipeId) {
        return RECIPES.find(r => r.id === recipeId);
    }

    selectRecipe(recipeId) {
        this.selectedRecipe = this.getRecipeDetails(recipeId);
        return this.selectedRecipe;
    }
}
