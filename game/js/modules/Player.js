// Player state management module
import { LOCATIONS } from '../data/constants.js';

export class Player {
    constructor() {
        this.name = 'Игрок';
        this.level = 1;
        this.xp = 0;
        this.nextLevelXp = 100;
        this.hp = 100;
        this.maxHp = 100;
        this.gold = 50;
        this.attack = 10;
        this.defense = 5;
        this.inventory = [];
        this.currentLocation = LOCATIONS.CITY;
        this.activeQuests = [];
        this.completedQuests = [];
        this.stats = {
            kills: 0,
            mined: 0,
            crafted: 0,
        };
    }

    addXp(amount) {
        this.xp += amount;
        let leveledUp = false;
        
        while (this.xp >= this.nextLevelXp) {
            this.xp -= this.nextLevelXp;
            this.levelUp();
            leveledUp = true;
        }
        
        return leveledUp;
    }

    levelUp() {
        this.level++;
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.attack += 3;
        this.defense += 2;
        this.nextLevelXp = Math.floor(this.nextLevelXp * 1.5);
        return true;
    }

    addItem(item) {
        const existing = this.inventory.find(i => i.itemId === item.itemId);
        if (existing) {
            existing.amount += item.amount || 1;
        } else {
            this.inventory.push({ ...item, amount: item.amount || 1 });
        }
    }

    removeItem(itemId, amount = 1) {
        const index = this.inventory.findIndex(i => i.itemId === itemId);
        if (index !== -1) {
            this.inventory[index].amount -= amount;
            if (this.inventory[index].amount <= 0) {
                this.inventory.splice(index, 1);
            }
            return true;
        }
        return false;
    }

    hasItem(itemId, amount = 1) {
        const item = this.inventory.find(i => i.itemId === itemId);
        return item && item.amount >= amount;
    }

    getItem(itemId) {
        return this.inventory.find(i => i.itemId === itemId);
    }

    changeGold(amount) {
        this.gold += amount;
        return this.gold;
    }

    heal(amount) {
        const oldHp = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        return this.hp - oldHp;
    }

    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.defense);
        this.hp = Math.max(0, this.hp - actualDamage);
        return actualDamage;
    }

    isAlive() {
        return this.hp > 0;
    }

    setLocation(location) {
        this.currentLocation = location;
    }

    acceptQuest(quest) {
        this.activeQuests.push({
            ...quest,
            progress: 0,
        });
    }

    completeQuest(questId) {
        const index = this.activeQuests.findIndex(q => q.id === questId);
        if (index !== -1) {
            const quest = this.activeQuests[index];
            this.activeQuests.splice(index, 1);
            this.completedQuests.push(questId);
            return quest;
        }
        return null;
    }

    updateQuestProgress(type, target, amount = 1) {
        this.activeQuests.forEach(quest => {
            if (quest.objective.type === type) {
                if (type === 'kill' && 
                    (quest.objective.target === 'any' || quest.objective.target === target)) {
                    quest.progress += amount;
                } else if (type === 'collect' && quest.objective.itemId === target) {
                    quest.progress += amount;
                } else if (type === 'mine') {
                    quest.progress += amount;
                }
            }
        });
    }

    getStats() {
        return {
            name: this.name,
            level: this.level,
            xp: this.xp,
            nextLevelXp: this.nextLevelXp,
            hp: this.hp,
            maxHp: this.maxHp,
            gold: this.gold,
            attack: this.attack,
            defense: this.defense,
            inventory: this.inventory,
            currentLocation: this.currentLocation,
            activeQuests: this.activeQuests,
            stats: this.stats,
        };
    }
}
