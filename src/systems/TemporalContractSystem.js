import Phaser from 'phaser';

/**
 * TemporalContractSystem — Chronos Covenant
 * 
 * A revolutionary meta-mechanic that binds multiple runs together through
 * binding contracts with your future self. Creates genuine causal loops
 * across the save-game boundary.
 * 
 * Core Philosophy: Every action has consequences that ripple across timelines.
 * You can borrow power from your future, but your future self must repay it.
 * 
 * Design Innovation:
 * - Cross-run causality: Contracts persist between game sessions
 * - Temporal debt/repayment: Creates genuine obligation across runs
 * - Risk/reward binding: High immediate power vs. future obligation
 * - Bootstrap paradox items: Rewards received before their cause exists
 * 
 * Color: Deep Indigo (#4b0082) — the color of binding contracts and cosmic law
 */

export default class TemporalContractSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Configuration
        this.INDIGO_COLOR = 0x4b0082;
        this.INDIGO_GLOW = 0x663399;
        this.GOLD_COLOR = 0xffd700;
        this.CYAN_COLOR = 0x00d4ff;
        
        // Contract state
        this.activeContracts = []; // Contracts from previous runs (must fulfill)
        this.pendingContracts = []; // Contracts being offered this run
        this.fulfilledContracts = []; // Completed this run
        this.brokenContracts = []; // Failed this run
        
        // Debt tracking
        this.temporalDebt = 0; // Total debt from active contracts
        this.repaymentProgress = new Map(); // contractId -> progress (0-1)
        
        // Contract types
        this.contractTypes = {
            SURVIVAL: {
                name: 'SURVIVAL PACT',
                description: 'Start with +50 HP, survive 60 seconds',
                immediateReward: { healthBonus: 50 },
                obligation: { surviveTime: 60 },
                debtWeight: 1.0,
                icon: '◈',
                color: 0x4b0082
            },
            DESTRUCTION: {
                name: 'DESTRUCTION OATH',
                description: '+25% damage, destroy 30 enemies',
                immediateReward: { damageMultiplier: 1.25 },
                obligation: { killsRequired: 30 },
                debtWeight: 1.2,
                icon: '◉',
                color: 0xff3366
            },
            MASTERY: {
                name: 'MASTERY COVENANT',
                description: 'All systems charge 50% faster, chain 5+ systems',
                immediateReward: { chargeRateBonus: 0.5 },
                obligation: { chainLength: 5 },
                debtWeight: 1.5,
                icon: '◇',
                color: 0xffd700
            },
            ECHOES: {
                name: 'ECHO BARGAIN',
                description: 'Start with 2 quantum echoes, spawn 5 echoes',
                immediateReward: { startingEchoes: 2 },
                obligation: { echoesSpawned: 5 },
                debtWeight: 0.8,
                icon: '◊',
                color: 0x00d4ff
            },
            TITAN: {
                name: 'TITAN VOW',
                description: 'Boss health -25%, defeat the Tesseract Titan',
                immediateReward: { bossHealthReduction: 0.25 },
                obligation: { defeatBoss: true },
                debtWeight: 2.0,
                icon: '◆',
                color: 0xff0066
            },
            VOID: {
                name: 'VOID PROMISE',
                description: 'Start with 50% void coherence, reach 90%',
                immediateReward: { startingCoherence: 50 },
                obligation: { maxCoherence: 90 },
                debtWeight: 1.3,
                icon: '●',
                color: 0x9d4edd
            },
            PARADOX: {
                name: 'PARADOX BINDING',
                description: 'Paradox multiplier +1, execute 3 perfect paradoxes',
                immediateReward: { paradoxBonus: 1 },
                obligation: { perfectParadoxes: 3 },
                debtWeight: 1.4,
                icon: '◐',
                color: 0xff00ff
            }
        };
        
        // UI elements
        this.contractUI = null;
        this.debtDisplay = null;
        this.offerIndicators = [];
        
        // Tracking for obligations
        this.tracking = {
            enemiesKilled: 0,
            survivalTime: 0,
            maxChainLength: 0,
            echoesSpawned: 0,
            bossDefeated: false,
            maxCoherenceReached: 0,
            perfectParadoxes: 0,
            systemActivations: []
        };
        
        // Input handling
        this.cKey = null;
        
        this.init();
    }
    
    init() {
        this.loadContractsFromChronicle();
        this.createVisuals();
        this.setupInput();
        this.applyActiveContractRewards();
    }
    
    /**
     * Load contracts from Timeline Chronicle (cross-run persistence)
     */
    loadContractsFromChronicle() {
        const chronicle = this.scene.timelineChronicle;
        if (chronicle && chronicle.shardStorage) {
            // Load contracts that need fulfillment from previous runs
            const pendingContracts = chronicle.shardStorage.getItem('temporalContracts');
            if (pendingContracts) {
                try {
                    const contracts = JSON.parse(pendingContracts);
                    this.activeContracts = contracts.filter(c => !c.fulfilled && !c.broken);
                    console.log(`[Chronos] Loaded ${this.activeContracts.length} active contracts`);
                } catch (e) {
                    console.error('[Chronos] Failed to load contracts:', e);
                }
            }
        }
        
        // Calculate total temporal debt
        this.calculateTemporalDebt();
    }
    
    /**
     * Save contracts to Timeline Chronicle for next run
     */
    saveContractsToChronicle() {
        const chronicle = this.scene.timelineChronicle;
        if (chronicle && chronicle.shardStorage) {
            // Prepare contracts for next run
            const contractsToSave = [
                ...this.activeContracts.filter(c => !c.fulfilledThisRun),
                ...this.pendingContracts.filter(c => c.accepted).map(c => ({
                    ...c,
                    createdAt: Date.now(),
                    fulfilled: false,
                    broken: false,
                    runNumber: (chronicle.runNumber || 0) + 1
                }))
            ];
            
            chronicle.shardStorage.setItem('temporalContracts', 
                JSON.stringify(contractsToSave));
            
            // Save broken contracts for penalty tracking
            const brokenContracts = [
                ...this.brokenContracts,
                ...this.activeContracts.filter(c => c.brokenThisRun)
            ];
            chronicle.shardStorage.setItem('brokenTemporalContracts',
                JSON.stringify(brokenContracts));
        }
    }
    
    calculateTemporalDebt() {
        this.temporalDebt = this.activeContracts.reduce((total, contract) => {
            const type = this.contractTypes[contract.type];
            return total + (type ? type.debtWeight : 1.0);
        }, 0);
    }
    
    /**
     * Apply rewards from contracts loaded from previous runs
     */
    applyActiveContractRewards() {
        this.activeContracts.forEach(contract => {
            const type = this.contractTypes[contract.type];
            if (!type) return;
            
            console.log(`[Chronos] Fulfilling past contract: ${type.name}`);
            
            // Apply the reward (we're the future self fulfilling a past request)
            if (type.immediateReward) {
                this.applyReward(type.immediateReward, true);
            }
            
            // Mark as being fulfilled this run
            contract.fulfillingThisRun = true;
        });
        
        if (this.activeContracts.length > 0) {
            this.showFulfillmentText();
        }
    }
    
    applyReward(reward, isFulfillment = false) {
        const player = this.scene.player;
        
        if (reward.healthBonus && player) {
            player.maxHealth += reward.healthBonus;
            player.health += reward.healthBonus;
        }
        
        if (reward.damageMultiplier) {
            this.scene.damageMultiplier = (this.scene.damageMultiplier || 1) * reward.damageMultiplier;
        }
        
        if (reward.chargeRateBonus && this.scene.singularitySystem) {
            this.scene.singularitySystem.chargeGainPerNearMiss *= (1 + reward.chargeRateBonus);
        }
        
        if (reward.startingEchoes && this.scene.quantumImmortality) {
            // Spawn starting echoes
            for (let i = 0; i < reward.startingEchoes; i++) {
                this.scene.quantumImmortality.spawnEchoAt(player.x + (Math.random() - 0.5) * 100, 
                    player.y + (Math.random() - 0.5) * 100);
            }
        }
        
        if (reward.bossHealthReduction) {
            this.scene.bossHealthModifier = (this.scene.bossHealthModifier || 1) - reward.bossHealthReduction;
        }
        
        if (reward.startingCoherence && this.scene.voidCoherence) {
            this.scene.voidCoherence.coherenceLevel = reward.startingCoherence;
        }
        
        if (reward.paradoxBonus && this.scene.paradoxEngine) {
            this.scene.paradoxEngine.maxMultiplier += reward.paradoxBonus;
        }
    }
    
    createVisuals() {
        // Contract seal texture (indigo ring)
        const graphics = this.scene.make.graphics();
        
        // Draw contract seal
        graphics.lineStyle(3, this.INDIGO_COLOR);
        graphics.strokeCircle(32, 32, 28);
        graphics.lineStyle(2, this.INDIGO_GLOW);
        graphics.strokeCircle(32, 32, 22);
        
        // Add rune in center
        graphics.lineStyle(2, this.GOLD_COLOR);
        graphics.beginPath();
        graphics.moveTo(32, 20);
        graphics.lineTo(40, 32);
        graphics.lineTo(32, 44);
        graphics.lineTo(24, 32);
        graphics.closePath();
        graphics.strokePath();
        
        graphics.generateTexture('contractSeal', 64, 64);
        graphics.destroy();
        
        // Debt indicator in corner
        this.createDebtIndicator();
    }
    
    createDebtIndicator() {
        const margin = 20;
        const x = this.scene.scale.width - margin - 100;
        const y = margin + 140;
        
        this.debtDisplay = this.scene.add.container(x, y);
        this.debtDisplay.setScrollFactor(0);
        this.debtDisplay.setDepth(1000);
        
        // Background
        const bg = this.scene.add.rectangle(0, 0, 120, 40, 0x1a1a25, 0.9);
        bg.setStrokeStyle(2, this.INDIGO_COLOR);
        this.debtDisplay.add(bg);
        
        // Indigo seal icon
        const seal = this.scene.add.image(-45, 0, 'contractSeal').setScale(0.4);
        this.debtDisplay.add(seal);
        
        // Debt text
        this.debtText = this.scene.add.text(-10, 0, `DEBT: ${this.temporalDebt.toFixed(1)}`, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#4b0082'
        }).setOrigin(0, 0.5);
        this.debtDisplay.add(this.debtText);
        
        // Contract count
        this.contractCountText = this.scene.add.text(-10, 12, 
            `${this.activeContracts.length} ACTIVE`, {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#666666'
        }).setOrigin(0, 0.5);
        this.debtDisplay.add(this.contractCountText);
        
        // Hide if no debt
        this.debtDisplay.setVisible(this.temporalDebt > 0);
    }
    
    setupInput() {
        // C key to open contract menu
        this.cKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.cKey.on('down', () => {
            this.toggleContractMenu();
        });
    }
    
    toggleContractMenu() {
        if (this.contractUI && this.contractUI.visible) {
            this.hideContractMenu();
        } else {
            this.showContractMenu();
        }
    }
    
    showContractMenu() {
        if (this.contractUI) {
            this.contractUI.destroy();
        }
        
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2;
        
        this.contractUI = this.scene.add.container(centerX, centerY);
        this.contractUI.setScrollFactor(0);
        this.contractUI.setDepth(2000);
        
        // Darken background
        const overlay = this.scene.add.rectangle(0, 0, this.scene.scale.width, 
            this.scene.scale.height, 0x000000, 0.85);
        overlay.setPosition(0, 0);
        this.contractUI.add(overlay);
        
        // Title
        const title = this.scene.add.text(0, -200, 'CHRONOS COVENANT', {
            fontFamily: 'monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            fill: '#4b0082',
            align: 'center'
        }).setOrigin(0.5);
        this.contractUI.add(title);
        
        // Subtitle
        const subtitle = this.scene.add.text(0, -170, 
            'Make binding contracts with your future self', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#888888'
        }).setOrigin(0.5);
        this.contractUI.add(subtitle);
        
        // Active contracts section (top)
        if (this.activeContracts.length > 0) {
            this.renderActiveContractsSection(0, -120);
        }
        
        // Available contracts section (bottom)
        this.renderAvailableContractsSection(0, 50);
        
        // Close instruction
        const closeText = this.scene.add.text(0, 220, 
            '[C] to close  •  [1-7] to accept contract', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#666666'
        }).setOrigin(0.5);
        this.contractUI.add(closeText);
        
        // Number key handlers
        this.setupNumberKeys();
    }
    
    renderActiveContractsSection(x, y) {
        const sectionTitle = this.scene.add.text(x, y, 'ACTIVE OBLIGATIONS', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffd700'
        }).setOrigin(0.5);
        this.contractUI.add(sectionTitle);
        
        this.activeContracts.forEach((contract, index) => {
            const type = this.contractTypes[contract.type];
            if (!type) return;
            
            const progress = this.repaymentProgress.get(contract.id) || 0;
            const rowY = y + 40 + index * 35;
            
            // Contract row
            const row = this.scene.add.container(x, rowY);
            
            // Icon
            const icon = this.scene.add.text(-180, 0, type.icon, {
                fontFamily: 'monospace',
                fontSize: '16px',
                fill: type.color
            }).setOrigin(0.5);
            row.add(icon);
            
            // Name
            const name = this.scene.add.text(-160, 0, type.name, {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#ffffff'
            }).setOrigin(0, 0.5);
            row.add(name);
            
            // Progress bar
            const barBg = this.scene.add.rectangle(20, 0, 100, 8, 0x333333);
            row.add(barBg);
            
            const bar = this.scene.add.rectangle(20 - (100 - 100 * progress) / 2, 0, 
                100 * progress, 8, type.color);
            row.add(bar);
            
            // Progress text
            const progressText = this.scene.add.text(80, 0, `${(progress * 100).toFixed(0)}%`, {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#aaaaaa'
            }).setOrigin(0, 0.5);
            row.add(progressText);
            
            this.contractUI.add(row);
        });
    }
    
    renderAvailableContractsSection(x, y) {
        const sectionTitle = this.scene.add.text(x, y, 'AVAILABLE CONTRACTS', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#4b0082'
        }).setOrigin(0.5);
        this.contractUI.add(sectionTitle);
        
        // Generate 3 random available contracts
        const availableTypes = Object.keys(this.contractTypes);
        const selectedTypes = availableTypes
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        
        this.pendingContracts = selectedTypes.map((typeKey, index) => ({
            type: typeKey,
            accepted: false,
            index: index + 1
        }));
        
        selectedTypes.forEach((typeKey, index) => {
            const type = this.contractTypes[typeKey];
            const rowY = y + 40 + index * 50;
            
            const row = this.scene.add.container(x, rowY);
            
            // Number key
            const number = this.scene.add.text(-200, 0, `[${index + 1}]`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#666666'
            }).setOrigin(0.5);
            row.add(number);
            
            // Icon
            const icon = this.scene.add.text(-160, 0, type.icon, {
                fontFamily: 'monospace',
                fontSize: '20px',
                fill: type.color
            }).setOrigin(0.5);
            row.add(icon);
            
            // Name
            const name = this.scene.add.text(-130, -10, type.name, {
                fontFamily: 'monospace',
                fontSize: '13px',
                fontStyle: 'bold',
                fill: '#ffffff'
            }).setOrigin(0, 0.5);
            row.add(name);
            
            // Description
            const desc = this.scene.add.text(-130, 8, type.description, {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#888888'
            }).setOrigin(0, 0.5);
            row.add(desc);
            
            // Debt weight
            const debt = this.scene.add.text(120, 0, `DEBT: ${type.debtWeight}`, {
                fontFamily: 'monospace',
                fontSize: '10px',
                fill: '#4b0082'
            }).setOrigin(0.5);
            row.add(debt);
            
            this.contractUI.add(row);
        });
    }
    
    setupNumberKeys() {
        // FIX: Track keys so we can remove listeners later
        if (!this.contractKeys) {
            this.contractKeys = [];
        }
        
        const keyCodes = [
            Phaser.Input.Keyboard.KeyCodes.ONE,
            Phaser.Input.Keyboard.KeyCodes.TWO,
            Phaser.Input.Keyboard.KeyCodes.THREE
        ];
        
        keyCodes.forEach((keyCode, index) => {
            const key = this.scene.input.keyboard.addKey(keyCode);
            key.on('down', () => {
                this.acceptContract(index);
            });
            this.contractKeys.push(key);
        });
    }
    
    acceptContract(index) {
        if (index >= this.pendingContracts.length) return;
        
        const contract = this.pendingContracts[index];
        if (contract.accepted) return;
        
        contract.accepted = true;
        contract.id = `contract_${Date.now()}_${index}`;
        
        // Apply immediate reward
        const type = this.contractTypes[contract.type];
        this.applyReward(type.immediateReward, false);
        
        // Add to active contracts
        this.activeContracts.push(contract);
        this.calculateTemporalDebt();
        
        // Visual feedback
        this.showContractAcceptedText(type);
        
        // Update UI
        this.hideContractMenu();
        this.updateDebtDisplay();
        
        // Record in Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('CONTRACT_SIGNED', {
                type: contract.type,
                debt: type.debtWeight
            });
        }
        
        console.log(`[Chronos] Accepted contract: ${type.name}`);
    }
    
    showContractAcceptedText(type) {
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 80, 
            `PACT SEALED\n${type.name}`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#4b0082',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Indigo seal effect
        const seal = this.scene.add.image(this.scene.player.x, this.scene.player.y, 'contractSeal');
        seal.setScale(0.1);
        seal.setAlpha(0.8);
        
        this.scene.tweens.add({
            targets: seal,
            scale: 2,
            alpha: 0,
            rotation: Math.PI,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => seal.destroy()
        });
    }
    
    showFulfillmentText() {
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 100, 
            'TEMPORAL DEBT COMES DUE\nYour future self demands payment', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    hideContractMenu() {
        if (this.contractUI) {
            this.contractUI.destroy();
            this.contractUI = null;
        }
        
        // FIX: Use tracked keys to remove listeners (getKey doesn't exist)
        if (this.contractKeys && this.contractKeys.length > 0) {
            this.contractKeys.forEach(key => {
                key.removeAllListeners();
                key.destroy(); // Properly clean up the key
            });
            this.contractKeys = [];
        }
    }
    
    updateDebtDisplay() {
        if (this.debtDisplay) {
            this.debtDisplay.setVisible(this.temporalDebt > 0);
            this.debtText.setText(`DEBT: ${this.temporalDebt.toFixed(1)}`);
            this.contractCountText.setText(`${this.activeContracts.length} ACTIVE`);
        }
    }
    
    /**
     * Update contract tracking
     */
    update(dt) {
        // Update survival time for active contracts
        this.tracking.survivalTime += dt;
        
        // Update max coherence
        if (this.scene.voidCoherence) {
            this.tracking.maxCoherenceReached = Math.max(
                this.tracking.maxCoherenceReached,
                this.scene.voidCoherence.coherenceLevel
            );
        }
        
        // Check contract progress
        this.checkContractProgress();
        
        // Update UI if visible
        if (this.contractUI && this.contractUI.visible) {
            this.updateContractUI();
        }
    }
    
    checkContractProgress() {
        this.activeContracts.forEach(contract => {
            if (contract.fulfilled || contract.broken) return;
            
            const type = this.contractTypes[contract.type];
            if (!type || !type.obligation) return;
            
            const obligation = type.obligation;
            let progress = 0;
            let fulfilled = false;
            
            // Check each obligation type
            if (obligation.surviveTime) {
                progress = Math.min(1, this.tracking.survivalTime / obligation.surviveTime);
                fulfilled = this.tracking.survivalTime >= obligation.surviveTime;
            }
            
            if (obligation.killsRequired) {
                progress = Math.min(1, this.tracking.enemiesKilled / obligation.killsRequired);
                fulfilled = this.tracking.enemiesKilled >= obligation.killsRequired;
            }
            
            if (obligation.chainLength) {
                const currentChain = this.scene.resonanceCascade?.chain?.length || 0;
                progress = Math.min(1, currentChain / obligation.chainLength);
                fulfilled = currentChain >= obligation.chainLength;
                if (currentChain > this.tracking.maxChainLength) {
                    this.tracking.maxChainLength = currentChain;
                }
            }
            
            if (obligation.echoesSpawned) {
                progress = Math.min(1, this.tracking.echoesSpawned / obligation.echoesSpawned);
                fulfilled = this.tracking.echoesSpawned >= obligation.echoesSpawned;
            }
            
            if (obligation.defeatBoss) {
                progress = this.tracking.bossDefeated ? 1 : 0;
                fulfilled = this.tracking.bossDefeated;
            }
            
            if (obligation.maxCoherence) {
                progress = Math.min(1, this.tracking.maxCoherenceReached / obligation.maxCoherence);
                fulfilled = this.tracking.maxCoherenceReached >= obligation.maxCoherence;
            }
            
            if (obligation.perfectParadoxes) {
                progress = Math.min(1, this.tracking.perfectParadoxes / obligation.perfectParadoxes);
                fulfilled = this.tracking.perfectParadoxes >= obligation.perfectParadoxes;
            }
            
            // Store progress
            this.repaymentProgress.set(contract.id, progress);
            
            // Check for fulfillment
            if (fulfilled && !contract.fulfilled) {
                this.fulfillContract(contract);
            }
        });
    }
    
    fulfillContract(contract) {
        contract.fulfilled = true;
        contract.fulfilledThisRun = true;
        this.fulfilledContracts.push(contract);
        
        // Visual feedback
        this.showContractFulfilledText(contract);
        
        // Bonus score
        this.scene.score += 1000;
        
        // Record in Resonance Cascade
        if (this.scene.resonanceCascade) {
            this.scene.resonanceCascade.recordActivation('CONTRACT_FULFILLED', {
                type: contract.type
            });
        }
        
        console.log(`[Chronos] Contract fulfilled: ${contract.type}`);
    }
    
    showContractFulfilledText(contract) {
        const type = this.contractTypes[contract.type];
        
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 80, 
            `OBLIGATION FULFILLED\n${type.name}`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ffd700',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Gold seal burst
        const seal = this.scene.add.image(this.scene.player.x, this.scene.player.y, 'contractSeal');
        seal.setTint(0xffd700);
        seal.setScale(1);
        
        this.scene.tweens.add({
            targets: seal,
            scale: 3,
            alpha: 0,
            rotation: Math.PI * 2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => seal.destroy()
        });
    }
    
    /**
     * Mark a contract as broken (player failed to fulfill)
     */
    breakContract(contract, reason) {
        contract.broken = true;
        contract.brokenThisRun = true;
        contract.breakReason = reason;
        this.brokenContracts.push(contract);
        
        // Penalty: reduce score
        this.scene.score = Math.max(0, this.scene.score - 500);
        
        // Visual feedback
        this.showContractBrokenText(contract);
        
        console.log(`[Chronos] Contract broken: ${contract.type} - ${reason}`);
    }
    
    showContractBrokenText(contract) {
        const type = this.contractTypes[contract.type];
        
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 80, 
            `PACT BROKEN\n${type.name}`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff3366',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    updateContractUI() {
        // Update progress bars if UI is open
        // This would require keeping references to progress bar objects
    }
    
    /**
     * Track enemy kill for contract obligations
     */
    onEnemyKilled() {
        this.tracking.enemiesKilled++;
    }
    
    /**
     * Track echo spawn
     */
    onEchoSpawned() {
        this.tracking.echoesSpawned++;
    }
    
    /**
     * Track boss defeat
     */
    onBossDefeated() {
        this.tracking.bossDefeated = true;
    }
    
    /**
     * Track perfect paradox
     */
    onPerfectParadox() {
        this.tracking.perfectParadoxes++;
    }
    
    /**
     * Get bonus for equipped shard based on contract history
     */
    getShardBonus(shardType) {
        // Fulfillment streak bonus
        const fulfilledCount = this.fulfilledContracts.length;
        const brokenCount = this.brokenContracts.length;
        
        switch (shardType) {
            case 'CHAMPION':
                // Bonus based on fulfilled contracts
                return fulfilledCount * 0.05; // +5% per fulfilled contract
            case 'PRESERVER':
                // Bonus if no broken contracts
                return brokenCount === 0 ? 0.2 : 0;
            case 'TRADER':
                // Bonus based on temporal debt managed
                return Math.min(0.3, this.temporalDebt * 0.05);
            default:
                return 0;
        }
    }
    
    /**
     * Called when game ends - save contracts for next run
     */
    onGameEnd() {
        // Save unfulfilled contracts for next run
        this.saveContractsToChronicle();
        
        // Report statistics
        console.log(`[Chronos] Run complete:`);
        console.log(`  Fulfilled: ${this.fulfilledContracts.length}`);
        console.log(`  Broken: ${this.brokenContracts.length}`);
        console.log(`  Carried forward: ${this.activeContracts.filter(c => !c.fulfilledThisRun).length}`);
    }
    
    destroy() {
        this.hideContractMenu();
        
        if (this.debtDisplay) {
            this.debtDisplay.destroy();
        }
        
        // Save contracts
        this.saveContractsToChronicle();
        
        // Clean up input
        if (this.cKey) {
            this.cKey.removeAllListeners();
        }
    }
}
