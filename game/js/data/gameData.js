// Mob definitions for each location
export const MOBS = {
    plains: [
        {
            id: 'slime',
            name: 'Слайм',
            emoji: '💧',
            level: 1,
            hp: 30,
            attack: 5,
            defense: 2,
            xpReward: 10,
            goldReward: [1, 5],
            lootTable: [
                { itemId: 'slime_core', chance: 0.4 },
                { itemId: 'herb', chance: 0.3 },
            ],
        },
        {
            id: 'rabbit',
            name: 'Заяц',
            emoji: '🐰',
            level: 1,
            hp: 25,
            attack: 4,
            defense: 1,
            xpReward: 8,
            goldReward: [1, 3],
            lootTable: [
                { itemId: 'rabbit_fur', chance: 0.5 },
                { itemId: 'meat', chance: 0.4 },
            ],
        },
        {
            id: 'chicken',
            name: 'Курица',
            emoji: '🐔',
            level: 1,
            hp: 20,
            attack: 3,
            defense: 1,
            xpReward: 6,
            goldReward: [1, 3],
            lootTable: [
                { itemId: 'feather', chance: 0.6 },
                { itemId: 'meat', chance: 0.5 },
            ],
        },
        {
            id: 'goblin',
            name: 'Гоблин',
            emoji: '👺',
            level: 2,
            hp: 40,
            attack: 7,
            defense: 3,
            xpReward: 15,
            goldReward: [3, 8],
            lootTable: [
                { itemId: 'goblin_ear', chance: 0.3 },
                { itemId: 'rusty_dagger', chance: 0.1 },
            ],
        },
    ],
    forest: [
        {
            id: 'wolf',
            name: 'Волк',
            emoji: '🐺',
            level: 3,
            hp: 60,
            attack: 10,
            defense: 5,
            xpReward: 25,
            goldReward: [5, 12],
            lootTable: [
                { itemId: 'wolf_fur', chance: 0.5 },
                { itemId: 'fang', chance: 0.3 },
            ],
        },
        {
            id: 'bear',
            name: 'Медведь',
            emoji: '🐻',
            level: 5,
            hp: 120,
            attack: 15,
            defense: 8,
            xpReward: 50,
            goldReward: [10, 20],
            lootTable: [
                { itemId: 'bear_pelt', chance: 0.4 },
                { itemId: 'honey', chance: 0.5 },
            ],
        },
        {
            id: 'snake',
            name: 'Змея',
            emoji: '🐍',
            level: 4,
            hp: 50,
            attack: 12,
            defense: 3,
            xpReward: 30,
            goldReward: [5, 15],
            lootTable: [
                { itemId: 'snake_scale', chance: 0.4 },
                { itemId: 'venom', chance: 0.3 },
            ],
        },
        {
            id: 'boar',
            name: 'Кабан',
            emoji: '🐗',
            level: 4,
            hp: 80,
            attack: 13,
            defense: 7,
            xpReward: 35,
            goldReward: [8, 18],
            lootTable: [
                { itemId: 'boar_tusk', chance: 0.3 },
                { itemId: 'meat', chance: 0.6 },
            ],
        },
    ],
    cave: [
        {
            id: 'bat',
            name: 'Летучая мышь',
            emoji: '🦇',
            level: 5,
            hp: 55,
            attack: 11,
            defense: 4,
            xpReward: 28,
            goldReward: [5, 15],
            lootTable: [
                { itemId: 'bat_wing', chance: 0.5 },
                { itemId: 'guano', chance: 0.4 },
            ],
        },
        {
            id: 'spider',
            name: 'Паук',
            emoji: '🕷️',
            level: 6,
            hp: 70,
            attack: 14,
            defense: 5,
            xpReward: 35,
            goldReward: [8, 18],
            lootTable: [
                { itemId: 'spider_silk', chance: 0.5 },
                { itemId: 'venom', chance: 0.4 },
            ],
        },
        {
            id: 'skeleton',
            name: 'Скелет',
            emoji: '💀',
            level: 7,
            hp: 90,
            attack: 16,
            defense: 6,
            xpReward: 45,
            goldReward: [10, 25],
            lootTable: [
                { itemId: 'bone', chance: 0.6 },
                { itemId: 'ancient_coin', chance: 0.2 },
            ],
        },
        {
            id: 'golem',
            name: 'Каменный голем',
            emoji: '🗿',
            level: 10,
            hp: 200,
            attack: 20,
            defense: 15,
            xpReward: 100,
            goldReward: [20, 50],
            lootTable: [
                { itemId: 'stone_heart', chance: 0.3 },
                { itemId: 'gem_fragment', chance: 0.4 },
            ],
        },
    ],
};

// Resource nodes (only in cave)
export const RESOURCES = {
    cave: [
        {
            id: 'copper_ore',
            name: 'Медная руда',
            emoji: '🪨',
            health: 50,
            reward: { itemId: 'copper_ore', amount: [1, 3] },
            xpReward: 10,
        },
        {
            id: 'iron_ore',
            name: 'Железная руда',
            emoji: '⚫',
            health: 80,
            reward: { itemId: 'iron_ore', amount: [1, 2] },
            xpReward: 20,
        },
        {
            id: 'gold_ore',
            name: 'Золотая руда',
            emoji: '🟡',
            health: 120,
            reward: { itemId: 'gold_ore', amount: [1, 2] },
            xpReward: 35,
        },
        {
            id: 'crystal',
            name: 'Кристалл',
            emoji: '💎',
            health: 150,
            reward: { itemId: 'crystal', amount: [1, 1] },
            xpReward: 50,
        },
    ],
};

// NPC definitions
export const NPCS = {
    city: [
        {
            id: 'elder',
            name: 'Старейшина',
            emoji: '🧙‍♂️',
            role: 'quest_giver',
            dialog: {
                greeting: 'Приветствую тебя, путник! Наш город нуждается в героях.',
                options: [
                    { text: 'Есть ли у вас работа для меня?', action: 'give_quest' },
                    { text: 'Расскажите о городе.', action: 'info' },
                    { text: 'До свидания.', action: 'close' },
                ],
            },
            quests: ['beginner_hunt', 'collect_herbs'],
        },
        {
            id: 'merchant',
            name: 'Торговец',
            emoji: '🧔',
            role: 'merchant',
            shop: {
                buy: [
                    { itemId: 'health_potion', price: 10 },
                    { itemId: 'sword_iron', price: 50 },
                    { itemId: 'armor_leather', price: 40 },
                ],
                sell: true, // Can sell any item at 50% base value
            },
            dialog: {
                greeting: 'Добро пожаловать в мою лавку! Посмотрите мои товары.',
                options: [
                    { text: 'Показать товары.', action: 'open_shop' },
                    { text: 'Продать предметы.', action: 'sell_items' },
                    { text: 'До свидания.', action: 'close' },
                ],
            },
        },
        {
            id: 'blacksmith',
            name: 'Кузнец',
            emoji: '👨‍🔧',
            role: 'crafter',
            dialog: {
                greeting: 'Нужно что-то выковать? Я мастер своего дела!',
                options: [
                    { text: 'Показать рецепты крафта.', action: 'open_crafting' },
                    { text: 'До свидания.', action: 'close' },
                ],
            },
        },
    ],
};

// Item definitions
export const ITEMS = {
    // Materials from mobs
    slime_core: { name: 'Ядро слайма', type: 'material', value: 5, emoji: '💧' },
    herb: { name: 'Трава', type: 'material', value: 3, emoji: '🌿' },
    rabbit_fur: { name: 'Шкура зайца', type: 'material', value: 4, emoji: '🐰' },
    feather: { name: 'Перо', type: 'material', value: 2, emoji: '🪶' },
    goblin_ear: { name: 'Ухо гоблина', type: 'material', value: 6, emoji: '👂' },
    wolf_fur: { name: 'Шкура волка', type: 'material', value: 10, emoji: '🐺' },
    fang: { name: 'Клык', type: 'material', value: 8, emoji: '🦷' },
    bear_pelt: { name: 'Шкура медведя', type: 'material', value: 20, emoji: '🐻' },
    honey: { name: 'Мёд', type: 'material', value: 12, emoji: '🍯' },
    snake_scale: { name: 'Чешуя змеи', type: 'material', value: 15, emoji: '🐍' },
    venom: { name: 'Яд', type: 'material', value: 18, emoji: '🧪' },
    boar_tusk: { name: 'Клык кабана', type: 'material', value: 16, emoji: '🦷' },
    bat_wing: { name: 'Крыло летучей мыши', type: 'material', value: 14, emoji: '🦇' },
    guano: { name: 'Гуано', type: 'material', value: 5, emoji: '💩' },
    spider_silk: { name: 'Паутина', type: 'material', value: 18, emoji: '🕸️' },
    bone: { name: 'Кость', type: 'material', value: 8, emoji: '🦴' },
    ancient_coin: { name: 'Древняя монета', type: 'material', value: 25, emoji: '🪙' },
    stone_heart: { name: 'Каменное сердце', type: 'material', value: 30, emoji: '❤️' },
    gem_fragment: { name: 'Осколок самоцвета', type: 'material', value: 35, emoji: '💠' },
    meat: { name: 'Мясо', type: 'material', value: 5, emoji: '🥩' },
    rusty_dagger: { name: 'Ржавый кинжал', type: 'material', value: 10, emoji: '🗡️' },

    // Ores from mining
    copper_ore: { name: 'Медная руда', type: 'material', value: 8, emoji: '🪨' },
    iron_ore: { name: 'Железная руда', type: 'material', value: 15, emoji: '⚫' },
    gold_ore: { name: 'Золотая руда', type: 'material', value: 30, emoji: '🟡' },
    crystal: { name: 'Кристалл', type: 'material', value: 50, emoji: '💎' },

    // Consumables
    health_potion: { 
        name: 'Зелье здоровья', 
        type: 'consumable', 
        value: 10, 
        emoji: '🧪',
        effect: { type: 'heal', value: 50 }
    },

    // Equipment
    sword_iron: { 
        name: 'Железный меч', 
        type: 'weapon', 
        value: 50, 
        emoji: '⚔️',
        stats: { attack: 10 }
    },
    armor_leather: { 
        name: 'Кожаная броня', 
        type: 'armor', 
        value: 40, 
        emoji: '🛡️',
        stats: { defense: 8 }
    },
};

// Crafting recipes
export const RECIPES = [
    {
        id: 'health_potion',
        name: 'Зелье здоровья',
        emoji: '🧪',
        result: { itemId: 'health_potion', amount: 1 },
        ingredients: [
            { itemId: 'herb', amount: 3 },
            { itemId: 'honey', amount: 1 },
        ],
    },
    {
        id: 'sword_iron',
        name: 'Железный меч',
        emoji: '⚔️',
        result: { itemId: 'sword_iron', amount: 1 },
        ingredients: [
            { itemId: 'iron_ore', amount: 5 },
            { itemId: 'bone', amount: 2 },
        ],
    },
    {
        id: 'armor_leather',
        name: 'Кожаная броня',
        emoji: '🛡️',
        result: { itemId: 'armor_leather', amount: 1 },
        ingredients: [
            { itemId: 'wolf_fur', amount: 4 },
            { itemId: 'rabbit_fur', amount: 6 },
        ],
    },
    {
        id: 'steel_sword',
        name: 'Стальной меч',
        emoji: '⚔️',
        result: { itemId: 'steel_sword', amount: 1 },
        ingredients: [
            { itemId: 'iron_ore', amount: 10 },
            { itemId: 'coal', amount: 5 },
            { itemId: 'wolf_fur', amount: 2 },
        ],
    },
    {
        id: 'magic_staff',
        name: 'Магический посох',
        emoji: '🪄',
        result: { itemId: 'magic_staff', amount: 1 },
        ingredients: [
            { itemId: 'crystal', amount: 3 },
            { itemId: 'wood', amount: 5 },
            { itemId: 'spider_silk', amount: 4 },
        ],
    },
];

// Quest definitions
export const QUESTS = {
    beginner_hunt: {
        id: 'beginner_hunt',
        name: 'Первая охота',
        description: 'Убейте 5 мобов на равнине, чтобы доказать свою доблесть.',
        objective: {
            type: 'kill',
            target: 'any',
            locations: ['plains'],
            count: 5,
        },
        rewards: {
            xp: 50,
            gold: 20,
            items: [{ itemId: 'health_potion', amount: 2 }],
        },
    },
    collect_herbs: {
        id: 'collect_herbs',
        name: 'Сбор трав',
        description: 'Соберите 10 трав для старейшины.',
        objective: {
            type: 'collect',
            itemId: 'herb',
            count: 10,
        },
        rewards: {
            xp: 40,
            gold: 15,
        },
    },
    wolf_hunter: {
        id: 'wolf_hunter',
        name: 'Охотник на волков',
        description: 'Убейте 10 волков в лесу.',
        objective: {
            type: 'kill',
            target: 'wolf',
            locations: ['forest'],
            count: 10,
        },
        rewards: {
            xp: 100,
            gold: 50,
            items: [{ itemId: 'armor_leather', amount: 1 }],
        },
    },
    mine_resources: {
        id: 'mine_resources',
        name: 'Шахтёрское дело',
        description: 'Добудьте 15 единиц руды в пещере.',
        objective: {
            type: 'mine',
            count: 15,
        },
        rewards: {
            xp: 80,
            gold: 40,
        },
    },
};
