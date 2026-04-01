import Phaser from 'phaser';

/**
 * Chronicle Menu Scene — The Museum of Your Persistence
 * 
 * Browse your Timeline Shards, equip them for bonuses,
 * and see your cumulative legacy visualized as a constellation.
 */

export default class ChronicleMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChronicleMenuScene' });
    }
    
    preload() {
        // Load chronicle data
        this.chronicle = this.loadChronicle();
        this.selectedShards = [...(this.chronicle.equippedShards || [])];
        this.currentPage = 0;
        this.shardsPerPage = 6;
    }
    
    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        
        // Background - deep void with constellation of all shards
        this.cameras.main.setBackgroundColor('#050508');
        this.createConstellationBackground();
        
        // Title
        const title = this.add.text(w / 2, 50, 'THE CHRONICLE', {
            fontFamily: 'monospace',
            fontSize: '42px',
            fontStyle: 'bold',
            letterSpacing: 6,
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Subtitle with stats
        const stats = this.add.text(w / 2, 95, 
            `${this.chronicle.totalRuns} TIMELINES  |  WAVE ${this.chronicle.highestWave}  |  ${this.chronicle.mythicShards} MYTHIC`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 2,
            fill: '#666677'
        }).setOrigin(0.5);
        
        // Equipped section
        this.createEquippedSection();
        
        // Shard grid
        this.createShardGrid();
        
        // Navigation
        this.createNavigation();
        
        // Detail panel (hidden initially)
        this.createDetailPanel();
        
        // Input
        this.input.keyboard.on('keydown-ESC', () => this.returnToMenu());
    }
    
    createConstellationBackground() {
        // Visualize all shards as stars in the background
        const graphics = this.add.graphics();
        
        this.chronicle.shards.forEach((shard, i) => {
            const x = Math.random() * this.cameras.main.width;
            const y = Math.random() * this.cameras.main.height;
            const size = this.getRaritySize(shard.rarity);
            const alpha = 0.3 + Math.random() * 0.4;
            
            // Draw star
            graphics.fillStyle(shard.shardColor, alpha);
            graphics.fillCircle(x, y, size);
            
            // Glow for rare shards
            if (shard.rarity === 'mythic' || shard.rarity === 'legendary') {
                graphics.fillStyle(shard.shardColor, 0.1);
                graphics.fillCircle(x, y, size * 3);
            }
            
            // Connect nearby stars with faint lines (constellation effect)
            this.chronicle.shards.slice(i + 1).forEach((other, j) => {
                const otherX = (x + (j + 1) * 137) % this.cameras.main.width;
                const otherY = (y + (j + 1) * 89) % this.cameras.main.height;
                const dist = Math.hypot(otherX - x, otherY - y);
                
                if (dist < 150) {
                    graphics.lineStyle(1, shard.shardColor, 0.1);
                    graphics.lineBetween(x, y, otherX, otherY);
                }
            });
        });
        
        // Subtle animation
        this.tweens.add({
            targets: graphics,
            alpha: 0.7,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    getRaritySize(rarity) {
        const sizes = { common: 2, rare: 3, epic: 4, legendary: 6, mythic: 8 };
        return sizes[rarity] || 2;
    }
    
    createEquippedSection() {
        const w = this.cameras.main.width;
        const startY = 140;
        
        // Label
        this.add.text(60, startY, 'EQUIPPED SHARDS', {
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: 2,
            fill: '#888899'
        });
        
        // Slots
        this.equippedSlots = [];
        for (let i = 0; i < 3; i++) {
            const x = 60 + i * 110;
            const slot = this.createShardSlot(x, startY + 25, i);
            this.equippedSlots.push(slot);
        }
        
        // Resonance indicator
        this.resonanceText = this.add.text(60, startY + 115, '', {
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: 1,
            fill: '#00f0ff'
        });
        
        this.updateEquippedDisplay();
    }
    
    createShardSlot(x, y, index) {
        // Slot background
        const bg = this.add.rectangle(x + 40, y + 40, 80, 80, 0x1a1a25, 1);
        bg.setStrokeStyle(2, 0x333344);
        
        // Empty text
        const emptyText = this.add.text(x + 40, y + 40, '[EMPTY]', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#444455'
        }).setOrigin(0.5);
        
        const slot = { x, y, bg, emptyText, shardId: null, icon: null, glow: null };
        
        // Click to unequip
        bg.setInteractive();
        bg.on('pointerdown', () => this.unequipShard(index));
        
        return slot;
    }
    
    createShardGrid() {
        const w = this.cameras.main.width;
        const startY = 320;
        const cols = 3;
        const rows = 2;
        const cellW = (w - 120) / cols;
        const cellH = 140;
        
        this.shardCards = [];
        
        const totalPages = Math.ceil(this.chronicle.shards.length / this.shardsPerPage);
        const pageShards = this.chronicle.shards.slice(
            this.currentPage * this.shardsPerPage,
            (this.currentPage + 1) * this.shardsPerPage
        );
        
        pageShards.forEach((shard, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = 60 + col * cellW;
            const y = startY + row * cellH;
            
            const card = this.createShardCard(x, y, cellW - 20, cellH - 10, shard);
            this.shardCards.push(card);
        });
        
        // Page indicator
        this.pageText = this.add.text(w / 2, startY + rows * cellH + 20, 
            `PAGE ${this.currentPage + 1} / ${Math.max(1, totalPages)}`, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666677'
        }).setOrigin(0.5);
    }
    
    createShardCard(x, y, w, h, shard) {
        const container = this.add.container(x + w/2, y + h/2);
        
        // Card background
        const bg = this.add.rectangle(0, 0, w, h, 0x0f0f15, 0.9);
        bg.setStrokeStyle(2, shard.shardColor, 0.5);
        container.add(bg);
        
        // Shard visualization (mini constellation)
        const miniConstellation = this.createMiniConstellation(shard, -w/3, -h/4, 40);
        container.add(miniConstellation);
        
        // Rarity indicator
        const rarityColor = this.getRarityColor(shard.rarity);
        const rarityText = this.add.text(-w/3, h/4, shard.rarity.toUpperCase(), {
            fontFamily: 'monospace',
            fontSize: '9px',
            fill: rarityColor
        }).setOrigin(0.5);
        container.add(rarityText);
        
        // Info
        const infoX = w/6;
        const waveText = this.add.text(infoX, -h/3, `WAVE ${shard.wave}`, {
            fontFamily: 'monospace',
            fontSize: '11px',
            fill: '#ffffff'
        });
        container.add(waveText);
        
        const scoreText = this.add.text(infoX, -h/6, `${shard.score}`, {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#aaaaaa'
        });
        container.add(scoreText);
        
        // Bonuses preview
        shard.bonuses.forEach((bonus, i) => {
            const bonusText = this.add.text(infoX, h/12 + i * 16, `• ${bonus.name}`, {
                fontFamily: 'monospace',
                fontSize: '9px',
                fill: '#00f0ff'
            });
            container.add(bonusText);
        });
        
        // Selection indicator
        const isEquipped = this.selectedShards.includes(shard.id);
        const indicator = this.add.text(w/2 - 10, -h/2 + 10, isEquipped ? '◆' : '◇', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: isEquipped ? '#ffd700' : '#444455'
        }).setOrigin(0.5);
        container.add(indicator);
        
        // Interactions
        bg.setInteractive();
        
        bg.on('pointerover', () => {
            bg.setFillStyle(0x1a1a2e);
            this.showShardDetail(shard);
        });
        
        bg.on('pointerout', () => {
            bg.setFillStyle(0x0f0f15);
            this.hideShardDetail();
        });
        
        bg.on('pointerdown', () => {
            this.toggleShardSelection(shard.id);
        });
        
        return { container, shard, indicator, bg };
    }
    
    createMiniConstellation(shard, x, y, size) {
        const container = this.add.container(x, y);
        const graphics = this.add.graphics();
        container.add(graphics);
        
        // Draw path
        if (shard.pathData && shard.pathData.length > 1) {
            graphics.lineStyle(1, shard.shardColor, 0.6);
            
            for (let i = 1; i < shard.pathData.length; i++) {
                const p1 = this.scalePoint(shard.pathData[i-1], size);
                const p2 = this.scalePoint(shard.pathData[i], size);
                graphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
            }
            
            // Points along path
            shard.pathData.forEach((p, i) => {
                if (i % 3 === 0) {
                    const sp = this.scalePoint(p, size);
                    graphics.fillStyle(shard.shardColor, 0.8);
                    graphics.fillCircle(sp.x, sp.y, 2);
                }
            });
        }
        
        // Death marker (if exists)
        if (shard.deathLocation) {
            const dp = this.scalePoint(shard.deathLocation, size);
            graphics.fillStyle(0xff3366, 1);
            graphics.fillCircle(dp.x, dp.y, 3);
        }
        
        return container;
    }
    
    scalePoint(point, size) {
        // Normalize and center
        const x = ((point.x / 1920) - 0.5) * size;
        const y = ((point.y / 1440) - 0.5) * size;
        return { x, y };
    }
    
    getRarityColor(rarity) {
        const colors = {
            common: '#aaaaaa',
            rare: '#00f0ff',
            epic: '#9d4edd',
            legendary: '#ffd700',
            mythic: '#ff0066'
        };
        return colors[rarity] || '#aaaaaa';
    }
    
    createDetailPanel() {
        this.detailPanel = this.add.container(this.cameras.main.width - 250, 280);
        this.detailPanel.setVisible(false);
        
        // Panel background
        const bg = this.add.rectangle(0, 0, 220, 280, 0x0a0a10, 0.95);
        bg.setStrokeStyle(1, 0x333344);
        this.detailPanel.add(bg);
        
        // Detail texts (updated dynamically)
        this.detailTitle = this.add.text(-100, -120, '', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            fill: '#ffffff'
        });
        this.detailPanel.add(this.detailTitle);
        
        this.detailStats = this.add.text(-100, -90, '', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#888899'
        });
        this.detailPanel.add(this.detailStats);
        
        this.detailBonuses = this.add.text(-100, -40, '', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#00f0ff'
        });
        this.detailPanel.add(this.detailBonuses);
        
        this.detailTags = this.add.text(-100, 80, '', {
            fontFamily: 'monospace',
            fontSize: '9px',
            fill: '#666677'
        });
        this.detailPanel.add(this.detailTags);
    }
    
    showShardDetail(shard) {
        this.detailPanel.setVisible(true);
        
        this.detailTitle.setText(`${shard.playstyle.toUpperCase()} ${shard.dominantSystem.toUpperCase()}`);
        this.detailTitle.setColor('#' + shard.shardColor.toString(16).padStart(6, '0'));
        
        const duration = Math.floor(shard.duration / 1000);
        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        this.detailStats.setText(
            `Score: ${shard.score}\n` +
            `Wave: ${shard.wave}\n` +
            `Duration: ${mins}:${secs.toString().padStart(2, '0')}\n` +
            `Deaths: ${shard.deaths}`
        );
        
        const bonusText = shard.bonuses.map(b => `• ${b.name}\n  ${b.desc}`).join('\n');
        this.detailBonuses.setText(bonusText);
        
        const tagText = shard.tags.length > 0 ? `Tags: ${shard.tags.join(', ')}` : '';
        this.detailTags.setText(tagText);
    }
    
    hideShardDetail() {
        this.detailPanel.setVisible(false);
    }
    
    createNavigation() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        
        // Back button
        const backBtn = this.add.text(60, h - 60, '[ BACK TO MENU ]', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffffff'
        }).setInteractive();
        
        backBtn.on('pointerover', () => backBtn.setFill('#00f0ff'));
        backBtn.on('pointerout', () => backBtn.setFill('#ffffff'));
        backBtn.on('pointerdown', () => this.returnToMenu());
        
        // Save button
        const saveBtn = this.add.text(w - 180, h - 60, '[ SAVE & EQUIP ]', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffd700'
        }).setInteractive();
        
        saveBtn.on('pointerover', () => saveBtn.setFill('#ffffff'));
        saveBtn.on('pointerout', () => saveBtn.setFill('#ffd700'));
        saveBtn.on('pointerdown', () => this.saveAndReturn());
        
        // Page navigation (if multiple pages)
        if (this.chronicle.shards.length > this.shardsPerPage) {
            const prevBtn = this.add.text(w / 2 - 80, h - 100, '◀', {
                fontFamily: 'monospace',
                fontSize: '18px',
                fill: '#666677'
            }).setInteractive();
            
            prevBtn.on('pointerdown', () => this.changePage(-1));
            
            const nextBtn = this.add.text(w / 2 + 80, h - 100, '▶', {
                fontFamily: 'monospace',
                fontSize: '18px',
                fill: '#666677'
            }).setInteractive();
            
            nextBtn.on('pointerdown', () => this.changePage(1));
        }
    }
    
    toggleShardSelection(shardId) {
        const idx = this.selectedShards.indexOf(shardId);
        
        if (idx > -1) {
            // Deselect
            this.selectedShards.splice(idx, 1);
        } else if (this.selectedShards.length < 3) {
            // Select (max 3)
            this.selectedShards.push(shardId);
        }
        
        this.updateEquippedDisplay();
        this.updateShardCards();
    }
    
    unequipShard(index) {
        if (this.selectedShards[index]) {
            this.selectedShards.splice(index, 1);
            this.updateEquippedDisplay();
            this.updateShardCards();
        }
    }
    
    updateEquippedDisplay() {
        // Clear all slots
        this.equippedSlots.forEach(slot => {
            if (slot.icon) {
                slot.icon.destroy();
                slot.icon = null;
            }
            if (slot.glow) {
                slot.glow.destroy();
                slot.glow = null;
            }
            slot.emptyText.setVisible(true);
            slot.bg.setStrokeStyle(2, 0x333344);
        });
        
        // Populate with selected shards
        this.selectedShards.forEach((shardId, i) => {
            const shard = this.chronicle.shards.find(s => s.id === shardId);
            if (!shard || !this.equippedSlots[i]) return;
            
            const slot = this.equippedSlots[i];
            slot.emptyText.setVisible(false);
            slot.bg.setStrokeStyle(2, shard.shardColor, 0.8);
            
            // Glow effect
            const glow = this.add.rectangle(
                slot.x + 40, slot.y + 40, 80, 80, 
                shard.shardColor, 0.2
            );
            slot.glow = glow;
            
            // Mini visualization
            slot.icon = this.createMiniConstellation(shard, slot.x + 40, slot.y + 40, 35);
        });
        
        // Check resonance
        const equippedShards = this.selectedShards
            .map(id => this.chronicle.shards.find(s => s.id === id))
            .filter(Boolean);
        
        // Check resonance using a simple calculation
        const harmony = this.checkHarmony(equippedShards);
        if (harmony) {
            this.resonanceText.setText(`♦ ${harmony.name}: ${harmony.desc}`);
            this.resonanceText.setColor('#ffd700');
        } else if (equippedShards.length === 3) {
            this.resonanceText.setText('◆ No resonance — try different combinations');
            this.resonanceText.setColor('#666677');
        } else {
            this.resonanceText.setText('');
        }
    }
    
    checkHarmony(shards) {
        if (shards.length < 2) return null;
        
        const systems = shards.map(s => s.dominantSystem);
        const styles = shards.map(s => s.playstyle);
        
        // Check for system harmony
        const uniqueSystems = [...new Set(systems)];
        if (uniqueSystems.length >= 3) {
            return { name: 'Temporal Trinity', desc: 'All systems +25% efficiency' };
        }
        
        // Check for style harmony
        if (shards.length === 3 && new Set(styles).size === 1) {
            return { name: 'Pure Form', desc: `${styles[0]} bonuses doubled` };
        }
        
        // Check for complementary styles
        if (styles.includes('grazer') && styles.includes('turret')) {
            return { name: 'Controlled Chaos', desc: 'Micro-homing while stationary' };
        }
        
        return null;
    }
    
    updateShardCards() {
        this.shardCards.forEach(card => {
            const isEquipped = this.selectedShards.includes(card.shard.id);
            card.indicator.setText(isEquipped ? '◆' : '◇');
            card.indicator.setFill(isEquipped ? '#ffd700' : '#444455');
        });
    }
    
    changePage(delta) {
        const maxPage = Math.ceil(this.chronicle.shards.length / this.shardsPerPage) - 1;
        this.currentPage = Phaser.Math.Clamp(this.currentPage + delta, 0, maxPage);
        
        // Rebuild grid
        this.shardCards.forEach(c => c.container.destroy());
        this.shardCards = [];
        this.createShardGrid();
    }
    
    saveAndReturn() {
        // Save equipped shards
        this.chronicle.equippedShards = this.selectedShards;
        this.saveChronicle(this.chronicle);
        
        this.returnToMenu();
    }
    
    returnToMenu() {
        this.cameras.main.fade(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MenuScene');
        });
    }
    
    loadChronicle() {
        try {
            const saved = localStorage.getItem('shooty_chronicle_v1');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load chronicle:', e);
        }
        
        return {
            version: 1,
            shards: [],
            totalRuns: 0,
            totalScore: 0,
            highestWave: 0,
            mythicShards: 0,
            legendaryShards: 0,
            equippedShards: []
        };
    }
    
    saveChronicle(chronicle) {
        try {
            localStorage.setItem('shooty_chronicle_v1', JSON.stringify(chronicle));
        } catch (e) {
            console.warn('Failed to save chronicle:', e);
        }
    }
}
