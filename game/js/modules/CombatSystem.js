// Combat system module
import { COMBAT_STATE, ENTITY_TYPES } from '../data/constants.js';
import { MOBS } from '../data/gameData.js';

export class CombatSystem {
    constructor(game) {
        this.game = game;
        this.state = COMBAT_STATE.NONE;
        this.currentMob = null;
        this.turn = 'player';
    }

    startCombat(mobTemplate) {
        if (this.state !== COMBAT_STATE.NONE) return false;

        this.currentMob = {
            ...mobTemplate,
            maxHp: mobTemplate.hp,
            id: `${mobTemplate.id}_${Date.now()}`,
        };

        this.state = COMBAT_STATE.IN_COMBAT;
        this.turn = 'player';
        
        this.game.log(`⚔️ Бой начался! ${this.currentMob.emoji} ${this.currentMob.name} (Ур.${this.currentMob.level})`, 'combat');
        this.game.ui.updateActions();
        this.game.renderer.setTarget(this.currentMob);
        
        return true;
    }

    playerAttack() {
        if (this.state !== COMBAT_STATE.IN_COMBAT || this.turn !== 'player') return;

        const player = this.game.player;
        const damage = Math.max(1, player.attack + this.getRandomInt(0, 5));
        this.currentMob.hp -= damage;

        this.game.log(`💥 Вы нанесли ${damage} урона ${this.currentMob.name}`, 'combat');

        if (this.currentMob.hp <= 0) {
            this.winCombat();
        } else {
            this.turn = 'enemy';
            setTimeout(() => this.enemyAttack(), 800);
        }

        this.game.renderer.update();
    }

    enemyAttack() {
        if (this.state !== COMBAT_STATE.IN_COMBAT) return;

        const player = this.game.player;
        const damage = Math.max(1, this.currentMob.attack - player.defense + this.getRandomInt(-2, 3));
        const actualDamage = player.takeDamage(damage);

        this.game.log(`🩸 ${this.currentMob.name} нанёс вам ${actualDamage} урона`, 'combat');

        if (!player.isAlive()) {
            this.loseCombat();
        } else {
            this.turn = 'player';
        }

        this.game.ui.updatePlayerStats();
        this.game.renderer.update();
    }

    playerHeal() {
        if (this.state !== COMBAT_STATE.IN_COMBAT || this.turn !== 'player') return;

        const player = this.game.player;
        
        // Try to use health potion
        if (player.hasItem('health_potion')) {
            player.removeItem('health_potion');
            const healed = player.heal(50);
            this.game.log(`💚 Вы использовали зелье и восстановили ${healed} HP`, 'info');
            this.turn = 'enemy';
            setTimeout(() => this.enemyAttack(), 800);
            this.game.ui.updatePlayerStats();
            this.game.ui.updateInventory();
        } else {
            this.game.log(`❌ Нет зелий здоровья!`, 'info');
        }
    }

    flee() {
        if (this.state !== COMBAT_STATE.IN_COMBAT) return;

        const escapeChance = 0.5 + (this.game.player.level * 0.05);
        
        if (Math.random() < escapeChance) {
            this.game.log(`🏃 Вам удалось сбежать!`, 'info');
            this.endCombat();
        } else {
            this.game.log(`❌ Не удалось сбежать!`, 'combat');
            this.turn = 'enemy';
            setTimeout(() => this.enemyAttack(), 800);
        }
    }

    winCombat() {
        const player = this.game.player;
        const mob = this.currentMob;

        // Rewards
        const goldReward = this.getRandomInt(mob.goldReward[0], mob.goldReward[1]);
        player.changeGold(goldReward);
        player.addXp(mob.xpReward);
        player.stats.kills++;

        this.game.log(`🏆 Победа! +${mob.xpReward} XP, +${goldReward} золота`, 'loot');

        // Drop loot
        mob.lootTable.forEach(drop => {
            if (Math.random() < drop.chance) {
                player.addItem({ itemId: drop.itemId, amount: 1 });
                const itemData = this.game.dataManager.getItem(drop.itemId);
                this.game.log(`📦 Получено: ${itemData.emoji} ${itemData.name}`, 'loot');
            }
        });

        // Update quest progress
        player.updateQuestProgress('kill', mob.id);

        // Check for level up
        const stats = player.getStats();
        if (stats.xp === 0 && stats.level > 1) {
            this.game.log(`🎉 Уровень повышен! Теперь вы ${stats.level} уровня!`, 'info');
        }

        this.game.checkQuests();
        this.endCombat();
        this.game.ui.updateAll();
    }

    loseCombat() {
        this.game.log(`💀 Вы погибли... Вас возродили в городе.`, 'combat');
        
        const player = this.game.player;
        player.hp = player.maxHp;
        player.setLocation('city');
        player.gold = Math.floor(player.gold * 0.9); // Lose 10% gold
        
        this.game.log(`💰 Потеряно 10% золота при смерти`, 'info');
        
        this.endCombat();
        this.game.teleportTo('city');
        this.game.ui.updateAll();
    }

    endCombat() {
        this.state = COMBAT_STATE.NONE;
        this.currentMob = null;
        this.turn = 'player';
        this.game.renderer.clearTarget();
        this.game.ui.updateActions();
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getState() {
        return {
            state: this.state,
            currentMob: this.currentMob,
            turn: this.turn,
        };
    }
}
