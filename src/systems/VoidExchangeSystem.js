import Phaser from 'phaser';

/**
 * VoidExchangeSystem — The 54th Dimension: TEMPORAL CAPITALISM 💹
 * 
 * A genuine futures market where players trade future potential for immediate power.
 * Exchange rates fluctuate based on market conditions and player behavior.
 * Creates risk/reward decisions that span the entire run.
 * 
 * Core Innovation: The game becomes a market simulation where time itself is currency.
 * 
 */

export default class VoidExchangeSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Market Configuration
        this.MARKET_COLOR = 0xffd700;      // Gold — the color of capital
        this.DEBT_COLOR = 0xff4444;        // Red — the color of default
        this.FUTURE_COLOR = 0x00f0ff;      // Cyan — the color of potential
        
        // Trading Floor State
        this.marketState = {
            isOpen: true,
            volatility: 0.1,                // Price fluctuation rate (0-1)
            liquidity: 1.0,               // Market depth multiplier
            panicLevel: 0,                // Crisis indicator (0-1)
            lastTradeTime: 0
        };
        
        // Temporal Commodities (what can be traded)
        this.commodities = {
            SCORE: {
                name: 'Futures Contract',
                baseValue: 100,
                currentPrice: 1.0,          // Score multiplier for trades
                volatility: 0.15,
                held: 0,                    // Long position (score promised to future)
                shorted: 0                  // Short position (score borrowed from future)
            },
            SURVIVAL: {
                name: 'Life Bond',
                baseValue: 60,
                currentPrice: 1.0,          // Seconds of survival promised
                volatility: 0.2,
                held: 0,
                shorted: 0
            },
            ABILITY: {
                name: 'Power Derivative',
                baseValue: 40,
                currentPrice: 1.0,          // System charge/efficiency
                volatility: 0.25,
                held: 0,
                shorted: 0
            },
            WAVE: {
                name: 'Wave Advancement',
                baseValue: 200,
                currentPrice: 1.0,          // Skip-ahead cost
                volatility: 0.1,
                held: 0,
                shorted: 0
            }
        };
        
        // Player's Portfolio
        this.portfolio = {
            temporalCapital: 0,             // Earned from successful trades
            totalDebt: 0,                   // Outstanding obligations
            marginCallRisk: 0,              // 0-1, triggers forced liquidation
            tradingStreak: 0,               // Consecutive successful trades
            reputation: 1.0                 // 0-2, affects exchange rates
        };
        
        // Active Contracts (promises made)
        this.contracts = [];
        
        // Market History (for chart display)
        this.priceHistory = {
            SCORE: [],
            SURVIVAL: [],
            ABILITY: [],
            WAVE: []
        };
        this.maxHistoryPoints = 60;
        
        // Available Power-ups (bought with temporal capital)
        this.marketInventory = [
            { id: 'DIVINE_INTERVENTION', name: 'Divine Intervention', cost: 500, effect: 'full_heal', stock: 1 },
            { id: 'TEMPORARY_GODHOOD', name: 'Temporary Godhood', cost: 1000, effect: 'invincibility_10s', stock: 1 },
            { id: 'CASINO_ROYALE', name: 'Casino Royale', cost: 250, effect: 'random_power', stock: 3 },
            { id: 'DEBT_FORGIVENESS', name: 'Debt Jubilee', cost: 800, effect: 'clear_debt', stock: 1 },
            { id: 'FUTURE_INSIGHT', name: 'Insider Trading', cost: 350, effect: 'price_prediction', stock: 2 },
            { id: 'LIQUIDITY_INJECTION', name: 'Bailout', cost: 600, effect: 'market_reset', stock: 1 }
        ];
        
        // UI Elements
        this.ui = {
            container: null,
            priceDisplays: {},
            portfolioDisplay: null,
            tickerText: null
        };
        this.tradingParticles = null;
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.setupInput();
        this.initializePrices();
        
        // Start market simulation
        this.scene.time.addEvent({
            delay: 1000, // Update every second
            callback: () => this.updateMarket(),
            loop: true
        });
        
        // Trading floor ambience
        this.scene.time.addEvent({
            delay: 5000,
            callback: () => this.generateMarketNews(),
            loop: true
        });
    }
    
    createVisuals() {
        // Trading floor particle emitter
        const particles = this.scene.add.particles(0, 0, 'bullet', {
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.6, end: 0 },
            tint: this.MARKET_COLOR,
            speed: { min: 20, max: 60 },
            lifespan: 800,
            quantity: 1,
            frequency: 100,
            emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 60), quantity: 12 }
        });
        particles.setDepth(46);
        particles.stop();
        this.tradingParticles = particles;
        
        // Create UI container (hidden by default, shown with 'X' key)
        this.createTradingUI();
    }
    
    createTradingUI() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        
        this.ui.container = this.scene.add.container(width / 2, height / 2);
        this.ui.container.setDepth(100);
        this.ui.container.setVisible(false);
        
        // Background panel - larger to fit all content
        const bg = this.scene.add.rectangle(0, 0, 650, 520, 0x0a0a0f, 0.95);
        bg.setStrokeStyle(2, this.MARKET_COLOR);
        this.ui.container.add(bg);
        
        // Title - moved down slightly
        const title = this.scene.add.text(0, -235, '◈ VOID EXCHANGE ◈', {
            fontFamily: 'monospace',
            fontSize: '26px',
            fontStyle: 'bold',
            fill: '#ffd700'
        }).setOrigin(0.5);
        this.ui.container.add(title);
        
        // Subtitle
        const subtitle = this.scene.add.text(0, -205, 'TEMPORAL FUTURES MARKET', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#888888'
        }).setOrigin(0.5);
        this.ui.container.add(subtitle);
        
        // Price display headers - better aligned with proper spacing
        const headers = ['COMMODITY', 'PRICE', 'HELD', 'SHORT', ''];
        const headerX = [-270, -50, 60, 140, 220, 290]; // More space between name and price
        headers.forEach((h, i) => {
            const text = this.scene.add.text(headerX[i], -165, h, {
                fontFamily: 'monospace',
                fontSize: '11px',
                fill: '#666666'
            }).setOrigin(0.5);
            this.ui.container.add(text);
        });
        
        // Commodity rows - better spacing, no overlap
        const commodities = ['SCORE', 'SURVIVAL', 'ABILITY', 'WAVE'];
        const rowX = [-270, -50, 60, 140, 220, 290];
        commodities.forEach((commodity, index) => {
            const y = -130 + index * 50;
            
            // Name - left aligned in its column
            const nameText = this.commodities[commodity].name;
            let displayName = nameText;
            
            // Add multiplier inline with the name
            if (commodity === 'SCORE') displayName += ' (9x)';
            if (commodity === 'ABILITY') displayName += ' (3x)';
            if (commodity === 'WAVE') displayName += ' (2x)';
            
            const name = this.scene.add.text(rowX[0], y, displayName, {
                fontFamily: 'monospace',
                fontSize: '13px',
                fill: '#00f0ff'
            }).setOrigin(0, 0.5);
            this.ui.container.add(name);
            
            // Price (updated dynamically) - now has room at -50
            const price = this.scene.add.text(rowX[1], y, '1.00x', {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#ffd700'
            }).setOrigin(0.5);
            this.ui.priceDisplays[commodity] = price;
            this.ui.container.add(price);
            
            // Held position
            const held = this.scene.add.text(rowX[2], y, '0', {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#00ff00'
            }).setOrigin(0.5);
            this.ui.container.add(held);
            
            // Short position
            const short = this.scene.add.text(rowX[3], y, '0', {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#ff4444'
            }).setOrigin(0.5);
            this.ui.container.add(short);
            
            // Trade buttons
            const buyBtn = this.scene.add.text(rowX[4], y, '[BUY]', {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#00ff00'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            buyBtn.on('pointerdown', () => this.executeTrade(commodity, 'BUY'));
            buyBtn.on('pointerover', () => buyBtn.setFill('#ffffff'));
            buyBtn.on('pointerout', () => buyBtn.setFill('#00ff00'));
            this.ui.container.add(buyBtn);
            
            const sellBtn = this.scene.add.text(rowX[5], y, '[SELL]', {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#ff4444'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            sellBtn.on('pointerdown', () => this.executeTrade(commodity, 'SELL'));
            sellBtn.on('pointerover', () => sellBtn.setFill('#ffffff'));
            sellBtn.on('pointerout', () => sellBtn.setFill('#ff4444'));
            this.ui.container.add(sellBtn);
        });
        
        // Portfolio section - better positioned
        const portY = 70;
        const portBg = this.scene.add.rectangle(0, portY + 15, 600, 70, 0x1a1a25, 0.8);
        this.ui.container.add(portBg);
        
        const portTitle = this.scene.add.text(-270, portY - 15, 'PORTFOLIO', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(0, 0.5);
        this.ui.container.add(portTitle);
        
        this.ui.portfolioDisplay = this.scene.add.text(0, portY + 15, 
            `Capital: 0 | Debt: 0 | Risk: 0% | Reputation: 1.00x`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.ui.container.add(this.ui.portfolioDisplay);
        
        // Market inventory - better positioned
        const invY = 145;
        const invTitle = this.scene.add.text(-270, invY - 10, 'EXCHANGE SHOP', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(0, 0.5);
        this.ui.container.add(invTitle);
        
        this.updateMarketInventoryDisplay(invY);
        
        // Instructions - moved down
        const instr = this.scene.add.text(0, 245, 
            'BUY = Promise future potential now | SELL = Borrow power, pay later | Press X to close', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#888888'
        }).setOrigin(0.5);
        this.ui.container.add(instr);
        
        // Close button - positioned in top-right of panel
        const closeBtn = this.scene.add.text(280, -235, '[X]', {
            fontFamily: 'monospace',
            fontSize: '18px',
            fill: '#ff4444'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.toggleExchange());
        this.ui.container.add(closeBtn);
    }
    
    updateMarketInventoryDisplay(baseY) {
        // Clear previous inventory display
        if (this.ui.inventoryItems) {
            this.ui.inventoryItems.forEach(item => item.destroy());
        }
        this.ui.inventoryItems = [];
        
        this.marketInventory.forEach((item, index) => {
            // FIX: Tighter spacing to stay within dialog bounds
            const x = -210 + (index % 3) * 210; // Was 200, now 210 for better fit
            const y = baseY + 30 + Math.floor(index / 3) * 28; // Slightly tighter vertical
            
            // Shorten long names to fit
            let displayName = item.name;
            if (displayName === 'Divine Intervention') displayName = 'Divine Int.';
            if (displayName === 'Temporary Godhood') displayName = 'Temp. Godhood';
            
            const text = this.scene.add.text(x, y, 
                `${displayName}: ${item.cost}TC [${item.stock}]`, {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: item.stock > 0 ? '#ffd700' : '#444444'
            }).setOrigin(0, 0.5);
            
            if (item.stock > 0) {
                text.setInteractive({ useHandCursor: true });
                text.on('pointerdown', () => this.purchaseItem(item));
                text.on('pointerover', () => text.setFill('#ffffff'));
                text.on('pointerout', () => text.setFill('#ffd700'));
            }
            
            this.ui.inventoryItems.push(text);
            this.ui.container.add(text);
        });
    }
    
    setupInput() {
        // X key toggles exchange
        this.scene.input.keyboard.on('keydown-X', () => {
            this.toggleExchange();
        });
    }
    
    toggleExchange() {
        const isVisible = !this.ui.container.visible;
        this.ui.container.setVisible(isVisible);
        
        if (isVisible) {
            // PROPERLY PAUSE the game while trading
            this.scene.physics.world.pause();
            this.scene.physics.world.timeScale = 0;
            
            // SET SCENE-WIDE PAUSE FLAG - other systems check this
            this.scene.isExchangePaused = true;
            
            // Pause all tweens
            this.scene.tweens.pauseAll();
            
            // Pause all enemy movement and updates
            this.scene.enemies.children.entries.forEach(enemy => {
                if (enemy.body) {
                    enemy._pausedVelocity = { x: enemy.body.velocity.x, y: enemy.body.velocity.y };
                    enemy.body.setVelocity(0, 0);
                }
                // Disable enemy updates
                enemy._exchangePaused = true;
            });
            
            // Pause enemy bullets
            this.scene.enemyBullets.children.entries.forEach(bullet => {
                if (bullet.body) {
                    bullet._pausedVelocity = { x: bullet.body.velocity.x, y: bullet.body.velocity.y };
                    bullet.body.setVelocity(0, 0);
                }
            });
            
            // Pause player bullets too
            this.scene.bullets.children.entries.forEach(bullet => {
                if (bullet.body) {
                    bullet._pausedVelocity = { x: bullet.body.velocity.x, y: bullet.body.velocity.y };
                    bullet.body.setVelocity(0, 0);
                }
            });
            
            // Disable player controls while exchange is open
            if (this.scene.player) {
                this.scene.player._exchangePaused = true;
                // Make player invulnerable while trading
                this.scene.player._wasInvulnerable = this.scene.player.isInvulnerable;
                this.scene.player.isInvulnerable = true;
            }
            
            this.tradingParticles.start();
            this.showMarketAnnouncement('EXCHANGE OPENED');
            
            // Pause all systems updates
            this._exchangePaused = true;
        } else {
            // RESUME the game
            this.scene.physics.world.resume();
            this.scene.physics.world.timeScale = 1;
            
            // CLEAR SCENE-WIDE PAUSE FLAG
            this.scene.isExchangePaused = false;
            
            // Resume all tweens
            this.scene.tweens.resumeAll();
            
            // Resume enemy movement
            this.scene.enemies.children.entries.forEach(enemy => {
                if (enemy.body && enemy._pausedVelocity) {
                    enemy.body.setVelocity(enemy._pausedVelocity.x, enemy._pausedVelocity.y);
                    delete enemy._pausedVelocity;
                }
                delete enemy._exchangePaused;
            });
            
            // Resume enemy bullets
            this.scene.enemyBullets.children.entries.forEach(bullet => {
                if (bullet.body && bullet._pausedVelocity) {
                    bullet.body.setVelocity(bullet._pausedVelocity.x, bullet._pausedVelocity.y);
                    delete bullet._pausedVelocity;
                }
            });
            
            // Resume player bullets
            this.scene.bullets.children.entries.forEach(bullet => {
                if (bullet.body && bullet._pausedVelocity) {
                    bullet.body.setVelocity(bullet._pausedVelocity.x, bullet._pausedVelocity.y);
                    delete bullet._pausedVelocity;
                }
            });
            
            // Re-enable player controls and restore invulnerability state
            if (this.scene.player) {
                this.scene.player._exchangePaused = false;
                // Only remove invulnerability if player wasn't already invulnerable
                if (!this.scene.player._wasInvulnerable) {
                    this.scene.player.isInvulnerable = false;
                }
                delete this.scene.player._wasInvulnerable;
            }
            
            this.tradingParticles.stop();
            this._exchangePaused = false;
        }
    }
    
    initializePrices() {
        // Set initial random prices around 1.0
        Object.keys(this.commodities).forEach(key => {
            this.commodities[key].currentPrice = 0.8 + Math.random() * 0.4;
            this.priceHistory[key].push(this.commodities[key].currentPrice);
        });
    }
    
    updateMarket() {
        if (!this.marketState.isOpen) return;
        
        // Update each commodity price with volatility
        Object.keys(this.commodities).forEach(key => {
            const commodity = this.commodities[key];
            const change = (Math.random() - 0.5) * commodity.volatility * this.marketState.volatility;
            commodity.currentPrice = Phaser.Math.Clamp(
                commodity.currentPrice + change,
                0.5,
                2.0
            );
            
            // Update history
            this.priceHistory[key].push(commodity.currentPrice);
            if (this.priceHistory[key].length > this.maxHistoryPoints) {
                this.priceHistory[key].shift();
            }
        });
        
        // Update market conditions based on game state
        this.updateMarketConditions();
        
        // Update UI
        this.updatePriceDisplay();
        this.updatePortfolioDisplay();
        this.drawPriceChart();
        
        // Check margin calls
        this.checkMarginCalls();
        
        // Random market events
        if (Math.random() < 0.05) {
            this.triggerMarketEvent();
        }
    }
    
    updateMarketConditions() {
        const player = this.scene.player;
        
        // Higher volatility when health is low (desperate times)
        if (player.health < 30) {
            this.marketState.volatility = Math.min(1.0, this.marketState.volatility + 0.1);
        } else {
            this.marketState.volatility = Math.max(0.1, this.marketState.volatility - 0.02);
        }
        
        // Panic increases with wave number
        this.marketState.panicLevel = Math.min(1.0, this.scene.wave * 0.05);
        
        // Liquidity decreases as debt increases
        const debtRatio = this.portfolio.totalDebt / 1000;
        this.marketState.liquidity = Math.max(0.5, 1.0 - debtRatio * 0.5);
    }
    
    updatePriceDisplay() {
        Object.keys(this.commodities).forEach(key => {
            const price = this.commodities[key].currentPrice;
            const display = this.ui.priceDisplays[key];
            if (display) {
                display.setText(`${price.toFixed(2)}x`);
                // Color based on trend
                const history = this.priceHistory[key];
                if (history.length >= 2) {
                    const trend = price - history[history.length - 2];
                    display.setFill(trend > 0 ? '#00ff00' : trend < 0 ? '#ff4444' : '#ffd700');
                }
            }
        });
    }
    
    updatePortfolioDisplay() {
        if (this.ui.portfolioDisplay) {
            const riskPct = Math.round(this.portfolio.marginCallRisk * 100);
            const riskColor = riskPct > 50 ? '#ff4444' : riskPct > 25 ? '#ffaa00' : '#00ff00';
            
            this.ui.portfolioDisplay.setText(
                `Capital: ${Math.round(this.portfolio.temporalCapital)} | ` +
                `Debt: ${Math.round(this.portfolio.totalDebt)} | ` +
                `Risk: ${riskPct}% | ` +
                `Reputation: ${this.portfolio.reputation.toFixed(2)}x`
            );
        }
    }
    
    drawPriceChart() {
        const graphicsManager = this.scene.graphicsManager;
        if (!graphicsManager) return;
        
        const chartX = 50;
        const chartY = -160;
        const width = 150;
        const height = 60;
        
        // Draw SCORE price chart as example
        const history = this.priceHistory.SCORE;
        if (history.length < 2) return;
        
        // Build path points for the price line
        const points = [];
        history.forEach((price, index) => {
            const x = chartX + (index / this.maxHistoryPoints) * width;
            const y = chartY + height - ((price - 0.5) / 1.5) * height;
            points.push({ x, y });
        });
        
        // Draw via UnifiedGraphicsManager on 'effects' layer
        graphicsManager.drawPath('effects', points, this.MARKET_COLOR, 0.6, 1);
    }
    
    executeTrade(commodity, type) {
        const comm = this.commodities[commodity];
        const quantity = 1;
        
        if (type === 'BUY') {
            // Buy = Promise future score now, get power now
            const cost = comm.baseValue * comm.currentPrice;
            
            // Create contract
            const contract = {
                type: commodity,
                quantity: quantity,
                promisedValue: cost,
                timeCreated: this.scene.time.now,
                maturityTime: this.scene.time.now + 30000, // 30 seconds to fulfill
                status: 'ACTIVE'
            };
            
            this.contracts.push(contract);
            comm.held += quantity;
            this.portfolio.totalDebt += cost;
            
            // Immediate benefit
            this.deliverImmediateBenefit(commodity, cost);
            
            this.showMarketAnnouncement(`BOUGHT ${comm.name}`);
            this.portfolio.tradingStreak++;
            
        } else if (type === 'SELL') {
            // Sell = Borrow power now, pay back with interest
            const loanValue = comm.baseValue * comm.currentPrice * 0.8;
            
            this.portfolio.temporalCapital += loanValue;
            comm.shorted += quantity;
            this.portfolio.totalDebt += loanValue * 1.5; // 50% interest
            
            // Immediate benefit
            this.deliverImmediateBenefit(commodity, loanValue);
            
            this.showMarketAnnouncement(`SOLD (SHORT) ${comm.name}`);
            this.portfolio.tradingStreak = 0; // Shorting breaks streak
        }
        
        // Update reputation
        this.portfolio.reputation = Math.min(2.0, 1.0 + this.portfolio.tradingStreak * 0.1);
        
        // Visual feedback
        this.createTradeEffect(type);
        
        // Record in Resonance Cascade if available
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation(type === 'BUY' ? 'MARKET_BUY' : 'MARKET_SELL');
        }
    }
    
    deliverImmediateBenefit(commodity, value) {
        const player = this.scene.player;
        
        switch (commodity) {
            case 'SCORE':
                // Score futures = immediate damage boost
                const damageBoost = Math.floor(value / 50);
                if (this.scene.omniWeapon) {
                    this.scene.omniWeapon.weaponStats.damage += damageBoost;
                }
                this.showFloatingText(`+${damageBoost} DMG`);
                break;
                
            case 'SURVIVAL':
                // Survival bonds = immediate health or shield
                if (player.health < 100) {
                    player.health = Math.min(100, player.health + 30);
                    this.showFloatingText('+30 HP (BOND)');
                } else {
                    // Create temporary shield
                    this.createTemporalShield(value / 100);
                    this.showFloatingText('SHIELD ACTIVATED');
                }
                break;
                
            case 'ABILITY':
                // Ability derivatives = charge all systems
                if (this.scene.singularitySystem) {
                    this.scene.singularitySystem.charge = Math.min(100, 
                        this.scene.singularitySystem.charge + 50);
                }
                if (this.scene.fractureSystem) {
                    this.scene.fractureSystem.momentum = Math.min(100,
                        this.scene.fractureSystem.momentum + 40);
                }
                this.showFloatingText('SYSTEMS CHARGED');
                break;
                
            case 'WAVE':
                // Wave advancement = skip ahead bonus
                this.scene.score += Math.floor(value);
                this.scene.enemySpawnRate = Math.max(500, this.scene.enemySpawnRate - 200);
                this.showFloatingText(`+${Math.floor(value)} PTS | FASTER SPAWNS`);
                break;
        }
    }
    
    createTemporalShield(duration) {
        const player = this.scene.player;
        
        // Create shield visual
        const shield = this.scene.add.circle(player.x, player.y, 45, 0x00f0ff, 0.3);
        shield.setStrokeStyle(2, 0x00f0ff);
        shield.setDepth(44);
        
        // Make it follow player
        const followEvent = this.scene.time.addEvent({
            delay: 16,
            callback: () => {
                if (player.active && shield.active) {
                    shield.x = player.x;
                    shield.y = player.y;
                }
            },
            loop: true
        });
        
        // Expire after duration
        this.scene.time.delayedCall(duration * 1000, () => {
            shield.destroy();
            followEvent.remove();
        });
        
        // Shield absorbs one hit
        player.hasTemporalShield = true;
        this.scene.time.delayedCall(duration * 1000, () => {
            player.hasTemporalShield = false;
        });
    }
    
    purchaseItem(item) {
        if (this.portfolio.temporalCapital < item.cost || item.stock <= 0) {
            this.showMarketAnnouncement('INSUFFICIENT CAPITAL');
            return;
        }
        
        this.portfolio.temporalCapital -= item.cost;
        item.stock--;
        
        // Apply effect
        switch (item.effect) {
            case 'full_heal':
                this.scene.player.health = 100;
                this.showMarketAnnouncement('DIVINE INTERVENTION: FULL HEAL');
                this.scene.cameras.main.flash(500, 0, 255, 0);
                break;
                
            case 'invincibility_10s':
                this.scene.player.isInvulnerable = true;
                this.scene.time.delayedCall(10000, () => {
                    if (this.scene.player.active) {
                        this.scene.player.isInvulnerable = false;
                    }
                });
                this.showMarketAnnouncement('TEMPORARY GODHOOD ACTIVATED');
                break;
                
            case 'random_power':
                const powers = ['rapid_fire', 'homing', 'explosive', 'phasing'];
                const power = powers[Math.floor(Math.random() * powers.length)];
                this.applyRandomPower(power);
                this.showMarketAnnouncement(`CASINO ROYALE: ${power.toUpperCase()}`);
                break;
                
            case 'clear_debt':
                this.portfolio.totalDebt = 0;
                this.contracts = [];
                this.showMarketAnnouncement('DEBT JUBILEE: ALL DEBTS FORGIVEN');
                break;
                
            case 'price_prediction':
                this.showPricePrediction();
                break;
                
            case 'market_reset':
                this.marketState.volatility = 0.1;
                this.marketState.panicLevel = 0;
                Object.keys(this.commodities).forEach(key => {
                    this.commodities[key].currentPrice = 1.0;
                });
                this.showMarketAnnouncement('MARKET STABILIZED');
                break;
        }
        
        this.updateMarketInventoryDisplay(140);
    }
    
    applyRandomPower(power) {
        // Apply to omni-weapon if available
        if (this.scene.omniWeapon) {
            switch (power) {
                case 'rapid_fire':
                    this.scene.omniWeapon.weaponStats.fireRate = Math.max(30, 
                        this.scene.omniWeapon.weaponStats.fireRate - 40);
                    break;
                case 'homing':
                    this.scene.omniWeapon.weaponStats.homing = true;
                    break;
                case 'explosive':
                    this.scene.omniWeapon.weaponStats.explosive = true;
                    break;
                case 'phasing':
                    this.scene.omniWeapon.weaponStats.phasing = true;
                    break;
            }
        }
    }
    
    showPricePrediction() {
        // Highlight commodities that will rise
        Object.keys(this.commodities).forEach(key => {
            const futurePrice = this.commodities[key].currentPrice + 
                (Math.random() - 0.3) * 0.3; // Slight upward bias
            const display = this.ui.priceDisplays[key];
            if (display) {
                const arrow = futurePrice > this.commodities[key].currentPrice ? '↑' : '↓';
                display.setText(`${this.commodities[key].currentPrice.toFixed(2)}x ${arrow}`);
            }
        });
        
        this.scene.time.delayedCall(5000, () => this.updatePriceDisplay());
    }
    
    checkMarginCalls() {
        // Calculate risk based on debt vs ability to pay
        const totalPromised = this.contracts.reduce((sum, c) => sum + c.promisedValue, 0);
        const currentScoreCapacity = this.scene.score * 0.5; // Can sacrifice 50% of score
        
        this.portfolio.marginCallRisk = totalPromised / (currentScoreCapacity + 100);
        
        // If risk exceeds threshold, trigger consequences
        if (this.portfolio.marginCallRisk > 0.8) {
            this.triggerMarginCall();
        }
    }
    
    triggerMarginCall() {
        // Forced liquidation - severe consequences
        this.showMarketAnnouncement('⚠ MARGIN CALL — FORCED LIQUIDATION ⚠');
        
        // Clear all contracts
        this.contracts = [];
        Object.keys(this.commodities).forEach(key => {
            this.commodities[key].held = 0;
            this.commodities[key].shorted = 0;
        });
        
        // Penalty
        this.scene.player.health = Math.max(1, this.scene.player.health - 30);
        this.portfolio.reputation = Math.max(0.5, this.portfolio.reputation - 0.5);
        this.portfolio.temporalCapital = Math.floor(this.portfolio.temporalCapital * 0.5);
        
        // Visual effect
        this.scene.cameras.main.shake(1000, 0.05);
        this.scene.cameras.main.flash(500, 255, 0, 0);
    }
    
    triggerMarketEvent() {
        const events = [
            { name: 'BULL RUN', effect: () => this.buffAllPrices(0.2) },
            { name: 'MARKET CRASH', effect: () => this.nerfAllPrices(0.3) },
            { name: 'TEMPORAL BUBBLE', effect: () => this.doubleVolatility() },
            { name: 'LIQUIDITY CRISIS', effect: () => this.reduceLiquidity() },
            { name: 'GOLDEN OPPORTUNITY', effect: () => this.spawnGoldenDeal() }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        this.showMarketAnnouncement(`MARKET EVENT: ${event.name}`);
    }
    
    buffAllPrices(amount) {
        Object.keys(this.commodities).forEach(key => {
            this.commodities[key].currentPrice = Math.min(2.0, 
                this.commodities[key].currentPrice + amount);
        });
    }
    
    nerfAllPrices(amount) {
        Object.keys(this.commodities).forEach(key => {
            this.commodities[key].currentPrice = Math.max(0.5,
                this.commodities[key].currentPrice - amount);
        });
    }
    
    doubleVolatility() {
        this.marketState.volatility = Math.min(1.0, this.marketState.volatility * 2);
        this.scene.time.delayedCall(15000, () => {
            this.marketState.volatility = Math.max(0.1, this.marketState.volatility / 2);
        });
    }
    
    reduceLiquidity() {
        this.marketState.liquidity = 0.5;
        this.scene.time.delayedCall(10000, () => {
            this.marketState.liquidity = 1.0;
        });
    }
    
    spawnGoldenDeal() {
        // Create a special offer
        const cheapItem = this.marketInventory.find(i => i.stock > 0);
        if (cheapItem) {
            cheapItem.cost = Math.floor(cheapItem.cost * 0.5);
            this.scene.time.delayedCall(10000, () => {
                cheapItem.cost = Math.floor(cheapItem.cost * 2);
            });
        }
    }
    
    generateMarketNews() {
        const news = [
            'Score futures trending up',
            'Survival bonds in high demand',
            'Wave derivatives volatile',
            'Ability contracts discounted',
            'Market sentiment: CAUTIOUS',
            'Temporal liquidity: STABLE'
        ];
        
        const item = news[Math.floor(Math.random() * news.length)];
        this.showMarketTicker(item);
    }
    
    showMarketAnnouncement(text) {
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2;
        
        const announcement = this.scene.add.text(centerX, centerY - 100, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            fontStyle: 'bold',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(90);
        
        this.scene.tweens.add({
            targets: announcement,
            y: announcement.y - 50,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => announcement.destroy()
        });
    }
    
    showMarketTicker(text) {
        if (this.ui.tickerText) {
            this.ui.tickerText.destroy();
        }
        
        this.ui.tickerText = this.scene.add.text(
            this.scene.scale.width - 10, 
            this.scene.scale.height - 30, 
            text, {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#888888'
        }).setOrigin(1, 0.5).setDepth(90);
        
        this.scene.time.delayedCall(4000, () => {
            if (this.ui.tickerText) {
                this.ui.tickerText.destroy();
                this.ui.tickerText = null;
            }
        });
    }
    
    showFloatingText(text) {
        const player = this.scene.player;
        const floating = this.scene.add.text(player.x, player.y - 40, text, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fontStyle: 'bold',
            fill: '#ffd700'
        }).setOrigin(0.5).setDepth(90);
        
        this.scene.tweens.add({
            targets: floating,
            y: floating.y - 60,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => floating.destroy()
        });
    }
    
    createTradeEffect(type) {
        const player = this.scene.player;
        const color = type === 'BUY' ? 0x00ff00 : 0xff4444;
        
        // Ring expansion effect
        const ring = this.scene.add.circle(player.x, player.y, 20, color, 0);
        ring.setStrokeStyle(3, color);
        ring.setDepth(45);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
        
        // Particle burst
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const particle = this.scene.add.circle(
                player.x + Math.cos(angle) * 30,
                player.y + Math.sin(angle) * 30,
                3, color
            ).setDepth(45);
            
            this.scene.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * 50,
                y: particle.y + Math.sin(angle) * 50,
                alpha: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    update(dt, player) {
        // Update market aura visual via UnifiedGraphicsManager
        const graphicsManager = this.scene.graphicsManager;
        if (graphicsManager) {
            // Pulsing aura based on market volatility
            const pulse = 1 + Math.sin(this.scene.time.now / 500) * 0.1 * this.marketState.volatility;
            const radius = 60 * pulse;
            
            // Draw concentric rings via UnifiedGraphicsManager
            for (let i = 0; i < 3; i++) {
                const alpha = 0.1 - i * 0.03;
                graphicsManager.drawRing('effects', player.x, player.y, radius + i * 15, this.MARKET_COLOR, alpha, 1);
            }
        }
        
        // Check contract maturities
        this.checkContractMaturities();
    }
    
    checkContractMaturities() {
        const now = this.scene.time.now;
        
        this.contracts.forEach(contract => {
            if (contract.status === 'ACTIVE' && now > contract.maturityTime) {
                this.fulfillContract(contract);
            }
        });
        
        // Remove fulfilled/expired contracts
        this.contracts = this.contracts.filter(c => c.status === 'ACTIVE');
    }
    
    fulfillContract(contract) {
        // Deduct promised value from score
        const fulfillment = Math.min(this.scene.score, contract.promisedValue);
        this.scene.score -= fulfillment;
        
        // Mark as fulfilled
        contract.status = 'FULFILLED';
        this.portfolio.totalDebt -= contract.promisedValue;
        
        // Bonus for fulfilling on time
        if (fulfillment >= contract.promisedValue) {
            this.portfolio.temporalCapital += 50;
            this.showFloatingText('CONTRACT FULFILLED +50 TC');
        } else {
            // Partial fulfillment penalty
            this.portfolio.reputation *= 0.9;
            this.showFloatingText('CONTRACT DEFAULT');
        }
        
        // Update commodity position
        this.commodities[contract.type].held -= contract.quantity;
    }
    
    // External API for other systems
    getMarketStatus() {
        return {
            isOpen: this.marketState.isOpen,
            volatility: this.marketState.volatility,
            liquidity: this.marketState.liquidity,
            portfolio: this.portfolio
        };
    }
    
    getCommodityPrice(type) {
        return this.commodities[type]?.currentPrice || 1.0;
    }
    
    addTemporalCapital(amount) {
        this.portfolio.temporalCapital += amount;
    }
    
    destroy() {
        if (this.ui.container) this.ui.container.destroy();
        if (this.tradingParticles) this.tradingParticles.destroy();
        if (this.ui.tickerText) this.ui.tickerText.destroy();
    }
}
