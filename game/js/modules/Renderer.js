// 2D Renderer module using Canvas
import { CONFIG, LOCATIONS, ENTITY_TYPES } from '../data/constants.js';
import { MOBS, RESOURCES, NPCS } from '../data/gameData.js';

export class Renderer {
    constructor(game) {
        this.game = game;
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.targetEntity = null;
        this.animationFrame = 0;
        
        // Entity positions for current scene
        this.entities = [];
        this.playerPos = { x: 400, y: 250 };
    }

    getLocationBackground(location) {
        const backgrounds = {
            [LOCATIONS.CITY]: ['#87CEEB', '#4682B4'],
            [LOCATIONS.PLAINS]: ['#87CEEB', '#90EE90'],
            [LOCATIONS.FOREST]: ['#228B22', '#006400'],
            [LOCATIONS.CAVE]: ['#696969', '#2F4F4F'],
        };
        return backgrounds[location] || ['#333', '#111'];
    }

    drawBackground(location) {
        const colors = this.getLocationBackground(location);
        const gradient = this.ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    }

    drawGround(location) {
        this.ctx.fillStyle = this.getGroundColor(location);
        this.ctx.fillRect(0, CONFIG.CANVAS_HEIGHT * 0.6, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT * 0.4);
    }

    getGroundColor(location) {
        const colors = {
            [LOCATIONS.CITY]: '#8B8B8B',
            [LOCATIONS.PLAINS]: '#90EE90',
            [LOCATIONS.FOREST]: '#228B22',
            [LOCATIONS.CAVE]: '#4A4A4A',
        };
        return colors[location] || '#333';
    }

    drawPlayer() {
        const bounce = Math.sin(this.animationFrame * 0.1) * 5;
        
        // Player body
        this.ctx.fillStyle = '#4d96ff';
        this.ctx.beginPath();
        this.ctx.arc(this.playerPos.x, this.playerPos.y + bounce, 25, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player emoji
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🧙‍♂️', this.playerPos.x, this.playerPos.y + bounce);
        
        // Name tag
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(this.game.player.name, this.playerPos.x, this.playerPos.y - 35 + bounce);
        
        // HP bar
        const hpPercent = this.game.player.hp / this.game.player.maxHp;
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(this.playerPos.x - 25, this.playerPos.y - 45 + bounce, 50, 8);
        this.ctx.fillStyle = hpPercent > 0.5 ? '#6bcb77' : hpPercent > 0.25 ? '#ffd93d' : '#ff6b6b';
        this.ctx.fillRect(this.playerPos.x - 24, this.playerPos.y - 44 + bounce, 48 * hpPercent, 6);
    }

    drawTarget() {
        if (!this.targetEntity) return;

        const bounce = Math.sin(this.animationFrame * 0.15) * 8;
        const targetX = CONFIG.CANVAS_WIDTH * 0.7;
        const targetY = CONFIG.CANVAS_HEIGHT * 0.5;

        // Target body
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(targetX, targetY + bounce, 35, 0, Math.PI * 2);
        this.ctx.fill();

        // Target emoji
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.targetEntity.emoji, targetX, targetY + bounce);

        // Name and level
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`${this.targetEntity.name} (Ур.${this.targetEntity.level})`, targetX, targetY - 50 + bounce);

        // HP bar
        const hpPercent = this.targetEntity.hp / this.targetEntity.maxHp;
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(targetX - 40, targetY - 40 + bounce, 80, 10);
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(targetX - 39, targetY - 39 + bounce, 78 * hpPercent, 8);
        
        // HP text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`${this.targetEntity.hp}/${this.targetEntity.maxHp}`, targetX, targetY - 25 + bounce);
    }

    drawEnvironmentDetails(location) {
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        
        const details = {
            [LOCATIONS.CITY]: ['🏰', '🏠', '🛡️', '⛲'],
            [LOCATIONS.PLAINS]: ['🌸', '🌼', '🦋', '☁️'],
            [LOCATIONS.FOREST]: ['🌲', '🌳', '🍄', '🌿'],
            [LOCATIONS.CAVE]: ['💎', '🪨', '🔦', '🕯️'],
        };

        const locationDetails = details[location] || ['✨'];
        
        // Draw decorative elements
        locationDetails.forEach((emoji, index) => {
            const x = 50 + index * 180;
            const y = 80 + Math.sin(this.animationFrame * 0.05 + index) * 20;
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillText(emoji, x, y);
        });
        
        this.ctx.globalAlpha = 1;

        // Draw resource nodes in cave
        if (location === LOCATIONS.CAVE && !this.targetEntity) {
            this.drawResourceNodes();
        }
    }

    drawResourceNodes() {
        const resources = RESOURCES.cave || [];
        const nodeCount = Math.min(3, resources.length);
        
        for (let i = 0; i < nodeCount; i++) {
            const resource = resources[i];
            const x = 150 + i * 200;
            const y = CONFIG.CANVAS_HEIGHT * 0.7;
            const pulse = Math.sin(this.animationFrame * 0.08 + i) * 3;
            
            this.ctx.font = '36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(resource.emoji, x, y + pulse);
            
            // Label
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(resource.name, x, y + 30 + pulse);
        }
    }

    drawLocationLabel() {
        const locationNames = {
            [LOCATIONS.CITY]: '🏰 Город',
            [LOCATIONS.PLAINS]: '🌾 Равнина',
            [LOCATIONS.FOREST]: '🌲 Лес',
            [LOCATIONS.CAVE]: '⛏️ Пещера',
        };

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(10, 10, 200, 40);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(locationNames[this.game.player.currentLocation] || '???', 20, 30);
    }

    drawCombatEffects() {
        if (this.game.combat.getState().state !== 'in_combat') return;
        
        // Draw combat indicator
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10, 5]);
        
        const centerX = CONFIG.CANVAS_WIDTH / 2;
        const centerY = CONFIG.CANVAS_HEIGHT / 2;
        const radius = 150 + Math.sin(this.animationFrame * 0.2) * 20;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }

    clearTarget() {
        this.targetEntity = null;
    }

    setTarget(entity) {
        this.targetEntity = entity;
    }

    update() {
        this.animationFrame++;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // Draw scene
        const location = this.game.player.currentLocation;
        this.drawBackground(location);
        this.drawGround(location);
        this.drawEnvironmentDetails(location);
        this.drawPlayer();
        
        if (this.targetEntity) {
            this.drawTarget();
            this.drawCombatEffects();
        }
        
        this.drawLocationLabel();
    }

    start() {
        const animate = () => {
            this.update();
            requestAnimationFrame(animate);
        };
        animate();
    }
}
