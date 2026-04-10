// Game configuration and constants
export const CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 500,
    FPS: 60,
};

// Location definitions
export const LOCATIONS = {
    CITY: 'city',
    PLAINS: 'plains',
    FOREST: 'forest',
    CAVE: 'cave',
};

// Item types
export const ITEM_TYPES = {
    MATERIAL: 'material',
    WEAPON: 'weapon',
    ARMOR: 'armor',
    CONSUMABLE: 'consumable',
    QUEST: 'quest',
};

// Rarity levels
export const RARITY = {
    COMMON: { name: 'Обычный', color: '#b0b0b0', multiplier: 1 },
    UNCOMMON: { name: 'Необычный', color: '#4d96ff', multiplier: 1.5 },
    RARE: { name: 'Редкий', color: '#6bcb77', multiplier: 2 },
    EPIC: { name: 'Эпический', color: '#c56cf0', multiplier: 3 },
    LEGENDARY: { name: 'Легендарный', color: '#ffd93d', multiplier: 5 },
};

// Entity types for rendering
export const ENTITY_TYPES = {
    PLAYER: 'player',
    MOB: 'mob',
    NPC: 'npc',
    RESOURCE: 'resource',
};

// Combat states
export const COMBAT_STATE = {
    NONE: 'none',
    IN_COMBAT: 'in_combat',
    ESCAPING: 'escaping',
};
