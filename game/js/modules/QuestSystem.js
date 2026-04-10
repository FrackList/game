// Quest system module
import { QUESTS } from '../data/gameData.js';

export class QuestSystem {
    constructor(game) {
        this.game = game;
    }

    getQuest(questId) {
        return QUESTS[questId];
    }

    getAllQuests() {
        return Object.values(QUESTS);
    }

    getAvailableQuests() {
        const player = this.game.player;
        return this.getAllQuests().filter(quest => 
            !player.completedQuests.includes(quest.id) &&
            !player.activeQuests.some(q => q.id === quest.id)
        );
    }

    giveQuest(questId) {
        const quest = this.getQuest(questId);
        if (!quest) return false;

        const player = this.game.player;
        
        // Check if already active or completed
        if (player.activeQuests.some(q => q.id === questId) ||
            player.completedQuests.includes(questId)) {
            return false;
        }

        player.acceptQuest(quest);
        this.game.log(`📜 Получен квест: ${quest.name}`, 'quest');
        this.game.log(`   ${quest.description}`, 'quest');
        
        this.game.ui.updateQuests();
        return true;
    }

    checkQuestCompletion(quest) {
        const objective = quest.objective;
        
        switch (objective.type) {
            case 'kill':
                return quest.progress >= objective.count;
            case 'collect':
                return this.game.player.hasItem(objective.itemId, objective.count);
            case 'mine':
                return quest.progress >= objective.count;
            default:
                return false;
        }
    }

    completeQuest(questId) {
        const player = this.game.player;
        const quest = player.activeQuests.find(q => q.id === questId);
        
        if (!quest || !this.checkQuestCompletion(quest)) {
            return false;
        }

        // Give rewards
        if (quest.rewards.xp) {
            player.addXp(quest.rewards.xp);
            this.game.log(`✨ +${quest.rewards.xp} XP`, 'quest');
        }
        
        if (quest.rewards.gold) {
            player.changeGold(quest.rewards.gold);
            this.game.log(`💰 +${quest.rewards.gold} золота`, 'quest');
        }
        
        if (quest.rewards.items) {
            quest.rewards.items.forEach(item => {
                player.addItem({ itemId: item.itemId, amount: item.amount });
                this.game.log(`📦 +${item.amount}x ${this.game.dataManager.getItem(item.itemId).name}`, 'quest');
            });
        }

        // Handle collect quests - remove items
        if (quest.objective.type === 'collect') {
            player.removeItem(quest.objective.itemId, quest.objective.count);
        }

        player.completeQuest(questId);
        this.game.log(`✅ Квест завершён: ${quest.name}`, 'quest');
        
        this.game.ui.updateAll();
        return true;
    }

    getQuestStatus(questId) {
        const player = this.game.player;
        const quest = player.activeQuests.find(q => q.id === questId);
        
        if (!quest) return null;
        
        const isComplete = this.checkQuestCompletion(quest);
        const objective = quest.objective;
        
        let progressText = '';
        switch (objective.type) {
            case 'kill':
            case 'mine':
                progressText = `${quest.progress}/${objective.count}`;
                break;
            case 'collect':
                const hasAmount = player.getItem(objective.itemId)?.amount || 0;
                progressText = `${hasAmount}/${objective.count}`;
                break;
        }
        
        return {
            quest,
            isComplete,
            progressText,
        };
    }
}
