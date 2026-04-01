import Phaser from 'phaser';

/**
 * Resonant Whisper System — The Conversation Across Eternity
 * 
 * In a game about time, memory, and persistence, the most profound missing piece
 * is COMMUNICATION. Not just with yourself — but with all versions of yourself,
 * and with other players traversing their own temporal labyrinths.
 * 
 * === THE CORE INNOVATION ===
 * 
 * The Resonant Whisper System transforms the arena into a palimpsest of voices:
 * messages, warnings, gifts, and mysteries left by players across all timelines.
 * These aren't static notes — they're LIVING ECHOES that evolve based on how
 * they're received, creating an emergent collective narrative.
 * 
 * === THE THREE WHISPER TYPES ===
 * 
 * 1. BLOODMARK (Crimson #ff0040) — Warnings from deaths
 *    - Left automatically when you die, at your death location
 *    - Contains: cause of death, final words (player input), danger rating
 *    - Persists for 10 runs or until "honored" (another player dies nearby)
 *    - Honoring transforms it into a GUIDANCE MARK (+50 score)
 * 
 * 2. GIFTED ECHO (Gold/Cyan #ffd700→#00f0ff) — Presents across time  
 *    - Place items at cost to your current run for future benefit
 *    - Health pickups, syntropy boosts, temporal anchor charges
 *    - 50% chance your "future self" (next run) finds it
 *    - If another player finds it, both get bonus (+100 to giver, +50 to finder)
 *    - Creates KARMA CHAIN when passed between multiple players
 * 
 * 3. PHILOSOPHICAL FRAGMENT (Iridescent #9d4edd) — The Deep Questions
 *    - Players can leave existential questions, observations, poems
 *    - Other players discover and can respond (yes/no/perhaps)
 *    - Responses cascade: majority consensus affects GLOBAL ORACLE behavior
 *    - "Are we the Nemesis?" — if 66% agree, Oracle shifts to darker predictions
 *    - "Is beauty in the chaos?" — if 66% agree, arena gains procedural art generation
 * 
 * === THE MECHANIC ===
 * 
 * WHISPERS APPEAR as crystalline formations throughout the arena:
 * - Bloodmarks: Red crystal spikes (danger, avoid)
 * - Gifted Echoes: Floating geometric gifts (approach, claim)
 * - Fragments: Shifting iridescent monoliths (contemplate, respond)
 * 
 * INTERACTION:
 * - Walk near to "sense" (faint text appears)
 * - Press F to fully receive (triggers effect, reveals full message)
 * - Gifted echoes: immediate benefit + karma tracking
 * - Bloodmarks: warning display + honoring mechanic
 * - Fragments: question display + response interface
 * 
 * === THE KARMA ECONOMY ===
 * 
 * Every player has KARMA — accumulated through:
 * - Leaving helpful whispers (+10 per helpful mark)
 * - Having whispers honored/claimed (+5 per interaction)
 * - Contributing to fragment consensus (+20)
 * - Being a good temporal citizen
 * 
 * Karma unlocks:
 * - 100+ Karma: Can leave GOLDEN whispers (enhanced visibility)
 * - 500+ Karma: Can place GUIDANCE whispers (predictive warnings)
 * - 1000+ Karma: Can create ANCHOR whispers (respawn points for others)
 * - 5000+ Karma: SYNTHESIS — your whispers appear in ALL players' worlds
 * 
 * === TEMPORAL WHISPER DYNAMICS ===
 * 
 * Whispers exist in QUANTUM STATES:
 * - UNSYNCED: Only visible to you (your own past/future whispers)
 * - RESONANT: Visible to all players (shared pool)
 * - ENTANGLED: Linked to another player's whisper (paired messages)
 * - COLLAPSED: Faded but left permanent trace in Chronicle
 * 
 * === SYNERGIES ===
 * 
 * - Timeline Chronicle: Stores all whispers you've left and found
 * - Mnemosyne Weave: Can enter shards to find whispers from THAT specific run
 * - Oracle Protocol: Whispers influence the "futures" Oracle predicts
 * - Nemesis Genesis: Nemesis uses whispers to ambush you (reads your patterns)
 * - Observer Effect: Your response to whispers feeds the behavioral model
 * - Syntropy Engine: Helping others generates massive syntropy
 * - Kairos Moment: Finding a whisper mid-flow doubles its benefit
 * - Temporal Contract: Can bind yourself to respond to certain whisper types
 * - Symbiotic Prediction: AI predicts which whispers you'll find most meaningful
 * 
 * === THE PHILOSOPHY ===
 * 
 * This completes the game's arc from isolation to connection:
 * 
 * STAGE 1: You fight alone (basic survival)
 * STAGE 2: You learn from yourself (temporal systems)
 * STAGE 3: You face yourself (Nemesis)
 * STAGE 4: You create yourself (Syntropy)
 * STAGE 5: You COMMUNE with all selves (Resonant Whispers)
 * 
 * The game becomes not just a personal journey, but a SHARED MYTHOLOGY.
 * Every death matters because it can warn another.
 * Every gift matters because it connects timelines.
 * Every thought matters because it shapes the collective Oracle.
 * 
 * You are no longer alone in the void.
 * You are part of a CHORUS ACROSS ETERNITY.
 * 
 * Color: Iridescent shifting spectrum — each whisper finds its true color
 * based on the karma and intent of its creator.
 */

export default class ResonantWhisperSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== WHISPER REGISTRY =====
        this.whispers = []; // Active whispers in current run
        this.localWhispers = []; // Player's own cross-run whispers
        this.globalWhispers = []; // Shared pool (simulated or from server)
        
        // ===== KARMA STATE =====
        this.karma = 0;
        this.karmaLevel = 0; // 0-4, determines whisper capabilities
        this.totalWhispersLeft = 0;
        this.totalWhispersFound = 0;
        this.whispersHonored = 0;
        this.karmaChains = []; // Sequences of gifted echoes passed between players
        
        // ===== WHISPER CONFIG =====
        this.whisperRange = 120; // Detection range
        this.interactRange = 60; // Interaction range
        this.maxWhispersPerRun = 15; // Cap for performance
        this.bloodmarkDuration = 10; // Runs before fading
        this.giftedEchoPersistence = 0.5; // 50% chance to survive to next run
        
        // ===== ACTIVE WHISPER STATE =====
        this.nearbyWhisper = null; // Currently sensed whisper
        this.whisperOverlay = null; // Visual overlay for interactions
        this.responseUI = null; // Fragment response interface
        
        // ===== WHISPER SPAWN TIMING =====
        this.whisperSpawnTimer = 0;
        this.whisperSpawnInterval = 8000; // New whisper every 8 seconds
        this.lastBloodmarkDeath = null; // Track last death for bloodmark
        
        // ===== CONSTANTS =====
        this.WHISPER_COLORS = {
            BLOODMARK: 0xff0040,           // Crimson
            BLOODMARK_CORE: 0x8b0000,      // Dark red
            GIFTED_ECHO: 0xffd700,         // Gold
            GIFTED_GLOW: 0x00f0ff,         // Cyan glow
            FRAGMENT: 0x9d4edd,            // Purple
            FRAGMENT_SHIFT: 0x00f0ff,      // Cyan shift
            KARMA_HIGH: 0xffd700,          // Golden karma
            KARMA_LOW: 0x808080            // Gray karma
        };
        
        this.init();
    }
    
    init() {
        this.loadKarmaData();
        this.loadLocalWhispers();
        this.createVisuals();
        this.setupInput();
        this.spawnInitialWhispers();
    }
    
    loadKarmaData() {
        try {
            const saved = localStorage.getItem('resonant_karma_v1');
            if (saved) {
                const data = JSON.parse(saved);
                this.karma = data.karma || 0;
                this.totalWhispersLeft = data.totalWhispersLeft || 0;
                this.totalWhispersFound = data.totalWhispersFound || 0;
                this.whispersHonored = data.whispersHonored || 0;
                this.karmaChains = data.karmaChains || [];
                this.updateKarmaLevel();
            }
        } catch (e) {
            console.warn('Failed to load karma data:', e);
        }
    }
    
    saveKarmaData() {
        try {
            const data = {
                karma: this.karma,
                totalWhispersLeft: this.totalWhispersLeft,
                totalWhispersFound: this.totalWhispersFound,
                whispersHonored: this.whispersHonored,
                karmaChains: this.karmaChains
            };
            localStorage.setItem('resonant_karma_v1', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save karma data:', e);
        }
    }
    
    loadLocalWhispers() {
        try {
            const saved = localStorage.getItem('resonant_whispers_v1');
            if (saved) {
                const data = JSON.parse(saved);
                this.localWhispers = data.localWhispers || [];
                this.globalWhispers = data.globalWhispers || this.generateMockGlobalWhispers();
            } else {
                this.globalWhispers = this.generateMockGlobalWhispers();
            }
        } catch (e) {
            console.warn('Failed to load whispers:', e);
            this.globalWhispers = this.generateMockGlobalWhispers();
        }
    }
    
    saveLocalWhispers() {
        try {
            const data = {
                localWhispers: this.localWhispers,
                globalWhispers: this.globalWhispers
            };
            localStorage.setItem('resonant_whispers_v1', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save whispers:', e);
        }
    }
    
    generateMockGlobalWhispers() {
        // Simulated global whispers for single-player experience
        // In multiplayer, these would come from a server
        const mockWhispers = [
            {
                id: 'global_1',
                type: 'fragment',
                x: 400,
                y: 300,
                message: 'Do you believe the Nemesis is a reflection of your fear, or your potential?',
                author: 'TemporalWalker',
                karma: 2500,
                responses: { yes: 342, no: 128, perhaps: 89 },
                created: Date.now() - 86400000, // 1 day ago
                color: 0x9d4edd
            },
            {
                id: 'global_2',
                type: 'gifted',
                x: 800,
                y: 600,
                giftType: 'health',
                giftValue: 25,
                message: 'From one traveler to another — may this sustain you where I fell.',
                author: 'ChronosChild',
                karma: 890,
                claimedBy: [],
                created: Date.now() - 43200000, // 12 hours ago
                color: 0xffd700
            },
            {
                id: 'global_3',
                type: 'bloodmark',
                x: 1200,
                y: 400,
                deathCause: 'Nemesis ambush',
                message: 'NEVER retreat east during bullet time. He expects it.',
                author: 'EchoLost',
                karma: 150,
                honored: 23,
                created: Date.now() - 172800000, // 2 days ago
                color: 0xff0040
            },
            {
                id: 'global_4',
                type: 'fragment',
                x: 600,
                y: 900,
                message: 'Is there meaning in the chaos, or do we impose order on the void?',
                author: 'VoidPhilosopher',
                karma: 4200,
                responses: { yes: 891, no: 234, perhaps: 567 },
                created: Date.now() - 259200000, // 3 days ago
                color: 0x9d4edd
            },
            {
                id: 'global_5',
                type: 'gifted',
                x: 1500,
                y: 1100,
                giftType: 'syntropy',
                giftValue: 50,
                message: 'Spent my last moments generating this. Use it well.',
                author: 'FinalLoop',
                karma: 3400,
                claimedBy: [],
                created: Date.now() - 64800000, // 18 hours ago
                color: 0xffd700
            },
            {
                id: 'global_6',
                type: 'bloodmark',
                x: 300,
                y: 700,
                deathCause: 'Fracture overload',
                message: 'The void hungers. Do not trust the purple calm.',
                author: 'ShatteredOne',
                karma: 2000,
                honored: 45,
                created: Date.now() - 345600000, // 4 days ago
                color: 0xff0040
            }
        ];
        return mockWhispers;
    }
    
    createVisuals() {
        // Interaction prompt text
        this.interactPrompt = this.scene.add.text(0, 0, '', {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)'
        }).setOrigin(0.5);
        this.interactPrompt.setDepth(100);
        this.interactPrompt.setVisible(false);
        
        // Whisper detail panel
        this.detailPanel = this.scene.add.container(0, 0);
        this.detailPanel.setDepth(100);
        this.detailPanel.setVisible(false);
        
        // Panel background
        const panelBg = this.scene.add.rectangle(0, 0, 320, 180, 0x000000, 0.85);
        panelBg.setStrokeStyle(2, 0x9d4edd, 0.8);
        this.detailPanel.add(panelBg);
        
        // Panel text
        this.panelTitle = this.scene.add.text(0, -60, '', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            fill: '#ffd700'
        }).setOrigin(0.5);
        this.detailPanel.add(this.panelTitle);
        
        this.panelMessage = this.scene.add.text(0, -10, '', {
            fontFamily: 'monospace',
            fontSize: '11px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 280 }
        }).setOrigin(0.5);
        this.detailPanel.add(this.panelMessage);
        
        this.panelAuthor = this.scene.add.text(0, 50, '', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#00f0ff'
        }).setOrigin(0.5);
        this.detailPanel.add(this.panelAuthor);
        
        this.panelKarma = this.scene.add.text(0, 70, '', {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#9d4edd'
        }).setOrigin(0.5);
        this.detailPanel.add(this.panelKarma);
        
        // Response buttons for fragments
        this.responseContainer = this.scene.add.container(0, 0);
        this.responseContainer.setDepth(100);
        this.responseContainer.setVisible(false);
        
        // Karma display - registered with panel-based HUD system
        this.scene.hudPanels.registerSlot('KARMA', (container, width, layout) => {
            // Position at top of content area
            this.karmaDisplay = this.scene.add.text(
                0, 0,
                '',
                {
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fill: '#ffd700'
                }
            ).setOrigin(0, 0); // Top-left origin
            container.add(this.karmaDisplay);
            this.updateKarmaDisplay();
        }, 'BOTTOM_RIGHT');
    }
    
    setupInput() {
        // G key to interact with whispers (was F, changed to avoid conflict)
        this.scene.controls.register('G', 'Whisper', () => {
            if (this.nearbyWhisper) {
                this.interactWithWhisper(this.nearbyWhisper);
            }
        }, {
            system: 'ResonantWhisperSystem',
            description: 'Interact with nearby whispers'
        });
        
        // Numbers 1-3 for fragment responses - registered with ControlsManager
        this.scene.controls.register('ONE', 'Response Yes', () => {
            if (this.activeFragment) {
                this.respondToFragment(this.activeFragment, 'yes');
            }
        }, {
            system: 'ResonantWhisperSystem',
            description: 'Respond "yes" to fragment'
        });
        
        this.scene.controls.register('TWO', 'Response No', () => {
            if (this.activeFragment) {
                this.respondToFragment(this.activeFragment, 'no');
            }
        }, {
            system: 'ResonantWhisperSystem',
            description: 'Respond "no" to fragment'
        });
        
        this.scene.controls.register('THREE', 'Response Perhaps', () => {
            if (this.activeFragment) {
                this.respondToFragment(this.activeFragment, 'perhaps');
            }
        }, {
            system: 'ResonantWhisperSystem',
            description: 'Respond "perhaps" to fragment'
        });
    }
    
    spawnInitialWhispers() {
        // Spawn local whispers from previous runs
        this.localWhispers.forEach(whisper => {
            if (Math.random() < 0.7) { // 70% persistence chance
                this.spawnWhisper(whisper);
            }
        });
        
        // Spawn global whispers
        this.globalWhispers.forEach(whisper => {
            this.spawnWhisper(whisper);
        });
        
        // Create bloodmark from last death if exists
        this.createBloodmarkFromLastDeath();
    }
    
    createBloodmarkFromLastDeath() {
        const chronicle = this.scene.timelineChronicle?.loadChronicle();
        if (chronicle && chronicle.shards.length > 0) {
            const lastShard = chronicle.shards[chronicle.shards.length - 1];
            if (lastShard.deaths && lastShard.deaths.length > 0) {
                const lastDeath = lastShard.deaths[lastShard.deaths.length - 1];
                this.lastBloodmarkDeath = {
                    x: lastDeath.x,
                    y: lastDeath.y,
                    cause: lastDeath.cause || 'unknown',
                    wave: lastShard.wave,
                    timestamp: lastShard.created
                };
                
                // Spawn as regular whisper
                this.spawnWhisper({
                    id: `bloodmark_${Date.now()}`,
                    type: 'bloodmark',
                    x: lastDeath.x,
                    y: lastDeath.y,
                    deathCause: lastShard.cause || 'combat',
                    message: 'You died here. Remember. Adapt. Overcome.',
                    author: 'Your Past Self',
                    karma: this.karma,
                    honored: 0,
                    created: Date.now(),
                    color: this.WHISPER_COLORS.BLOODMARK,
                    isLocal: true
                });
            }
        }
    }
    
    spawnWhisper(whisperData) {
        if (this.whispers.length >= this.maxWhispersPerRun) return;
        
        const whisper = {
            ...whisperData,
            visual: null,
            pulseTween: null,
            claimed: false,
            honored: whisperData.honored || 0
        };
        
        this.createWhisperVisuals(whisper);
        this.whispers.push(whisper);
    }
    
    createWhisperVisuals(whisper) {
        const container = this.scene.add.container(whisper.x, whisper.y);
        container.setDepth(35);
        
        // Different visuals for each type
        switch (whisper.type) {
            case 'bloodmark':
                this.createBloodmarkVisuals(container, whisper);
                break;
            case 'gifted':
                this.createGiftedVisuals(container, whisper);
                break;
            case 'fragment':
                this.createFragmentVisuals(container, whisper);
                break;
        }
        
        whisper.visual = container;
    }
    
    createBloodmarkVisuals(container, whisper) {
        // Core glow
        const core = this.scene.add.circle(0, 0, 12, this.WHISPER_COLORS.BLOODMARK, 0.4);
        core.setBlendMode(Phaser.BlendModes.ADD);
        container.add(core);
        
        // Pulsing animation
        whisper.pulseTween = this.scene.tweens.add({
            targets: core,
            scale: { from: 1, to: 1.4 },
            alpha: { from: 0.4, to: 0.7 },
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        // Particle bleed
        const bleed = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.6, end: 0 },
            speed: { min: 10, max: 30 },
            lifespan: 1500,
            tint: this.WHISPER_COLORS.BLOODMARK,
            frequency: 300,
            quantity: 1
        });
        bleed.setDepth(34);
        container.add(bleed);
    }
    
    createGiftedVisuals(container, whisper) {
        const color = whisper.color || this.WHISPER_COLORS.GIFTED_ECHO;
        const glowColor = this.WHISPER_COLORS.GIFTED_GLOW;
        
        // Inner glow
        const glow = this.scene.add.circle(0, 0, 15, glowColor, 0.5);
        glow.setBlendMode(Phaser.BlendModes.ADD);
        container.add(glow);
        
        // Pulsing glow
        whisper.pulseTween = this.scene.tweens.add({
            targets: glow,
            scale: { from: 1, to: 1.5 },
            alpha: { from: 0.5, to: 0.8 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        
        // Gift particles
        const particles = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.7, end: 0 },
            speed: { min: 20, max: 50 },
            lifespan: 1200,
            tint: [color, glowColor],
            frequency: 200,
            quantity: 2
        });
        particles.setDepth(34);
        container.add(particles);
    }
    
    createFragmentVisuals(container, whisper) {
        const baseColor = whisper.color || this.WHISPER_COLORS.FRAGMENT;
        
        // Outer glow ring
        const ring = this.scene.add.circle(0, 0, 45, baseColor, 0.15);
        ring.setBlendMode(Phaser.BlendModes.ADD);
        container.add(ring);
        
        // Shimmer effect
        const shimmer = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            speed: { min: 5, max: 20 },
            lifespan: 2000,
            tint: [baseColor, this.WHISPER_COLORS.FRAGMENT_SHIFT],
            frequency: 400,
            quantity: 1
        });
        shimmer.setDepth(34);
        container.add(shimmer);
        
        // Color shifting ring
        whisper.pulseTween = this.scene.tweens.add({
            targets: ring,
            scale: { from: 1, to: 1.2 },
            alpha: { from: 0.15, to: 0.3 },
            duration: 3000,
            yoyo: true,
            repeat: -1
        });
    }
    
    update(time, delta) {
        const player = this.scene.player;
        if (!player || !player.active) return;
        
        // Check for nearby whispers
        this.checkNearbyWhispers(player);
        
        // Spawn new whispers periodically
        this.whisperSpawnTimer += delta;
        if (this.whisperSpawnTimer >= this.whisperSpawnInterval) {
            this.whisperSpawnTimer = 0;
            this.attemptSpawnNewWhisper();
        }
        
        // Update visual positions for screen-space UI
        if (this.detailPanel.visible) {
            this.detailPanel.setPosition(
                this.scene.scale.width / 2,
                this.scene.scale.height / 2
            );
        }
    }
    
    checkNearbyWhispers(player) {
        let closestWhisper = null;
        let closestDist = Infinity;
        
        this.whispers.forEach(whisper => {
            if (!whisper.visual || whisper.claimed) return;
            
            const dist = Phaser.Math.Distance.Between(
                player.x, player.y,
                whisper.x, whisper.y
            );
            
            // Pulse faster when nearby
            if (dist < this.whisperRange && whisper.pulseTween) {
                whisper.pulseTween.timeScale = 2;
            } else if (whisper.pulseTween) {
                whisper.pulseTween.timeScale = 1;
            }
            
            // Track closest in interaction range
            if (dist < this.interactRange && dist < closestDist) {
                closestDist = dist;
                closestWhisper = whisper;
            }
        });
        
        // Update interaction state
        if (closestWhisper !== this.nearbyWhisper) {
            this.nearbyWhisper = closestWhisper;
            
            if (closestWhisper) {
                this.showInteractPrompt(closestWhisper);
            } else {
                this.hideInteractPrompt();
            }
        }
    }
    
    showInteractPrompt(whisper) {
        const player = this.scene.player;
        const screenX = player.x - this.scene.cameras.main.scrollX;
        const screenY = player.y - this.scene.cameras.main.scrollY - 50;
        
        const promptText = whisper.type === 'fragment' 
            ? 'Press F to Contemplate [F]'
            : whisper.type === 'bloodmark'
            ? 'Press F to Honor [F]'
            : 'Press F to Receive [F]';
        
        this.interactPrompt.setText(promptText);
        this.interactPrompt.setPosition(screenX, screenY);
        this.interactPrompt.setVisible(true);
    }
    
    hideInteractPrompt() {
        this.interactPrompt.setVisible(false);
        this.hideDetailPanel();
        this.activeFragment = null;
    }
    
    interactWithWhisper(whisper) {
        switch (whisper.type) {
            case 'bloodmark':
                this.honorBloodmark(whisper);
                break;
            case 'gifted':
                this.claimGiftedEcho(whisper);
                break;
            case 'fragment':
                this.contemplateFragment(whisper);
                break;
        }
    }
    
    honorBloodmark(whisper) {
        // Add honoring
        whisper.honored++;
        this.whispersHonored++;
        
        // Reward
        this.scene.score = (this.scene.score || 0) + 50;
        this.showFloatingText(whisper.x, whisper.y - 40, '+50 HONOR', '#ff0040');
        
        // Karma gain
        this.addKarma(5);
        
        // Visual effect
        this.createResonanceRing(whisper.x, whisper.y, this.WHISPER_COLORS.BLOODMARK);
        
        // Record in chronicle
        this.scene.timelineChronicle?.recordSystemUse('honorBloodmark', {
            whisperId: whisper.id,
            honored: whisper.honored
        });
        
        // Mark as claimed (honored bloodmarks fade)
        whisper.claimed = true;
        this.fadeWhisper(whisper);
        
        // Hide UI
        this.hideInteractPrompt();
    }
    
    claimGiftedEcho(whisper) {
        if (whisper.claimed) return;
        
        // Apply gift
        const giftValue = whisper.giftValue || 25;
        
        switch (whisper.giftType) {
            case 'health':
                this.scene.player.health = Math.min(
                    this.scene.player.maxHealth,
                    this.scene.player.health + giftValue
                );
                this.showFloatingText(whisper.x, whisper.y - 40, `+${giftValue} HP`, '#00ff00');
                break;
            case 'syntropy':
                if (this.scene.syntropyEngine) {
                    this.scene.syntropyEngine.generateSyntropy(giftValue, 'gifted_echo');
                }
                this.showFloatingText(whisper.x, whisper.y - 40, `+${giftValue} SYN`, '#ffd700');
                break;
        }
        
        // Karma gain (both giver and receiver benefit)
        this.addKarma(10);
        
        // Track claim
        whisper.claimed = true;
        whisper.claimedBy = whisper.claimedBy || [];
        whisper.claimedBy.push('current_player');
        
        // Visual effect
        this.createResonanceRing(whisper.x, whisper.y, this.WHISPER_COLORS.GIFTED_ECHO);
        
        // Particle burst
        this.scene.deathParticles?.setParticleTint(this.WHISPER_COLORS.GIFTED_GLOW);
        this.scene.deathParticles?.emitParticleAt(whisper.x, whisper.y);
        
        // Fade out
        this.fadeWhisper(whisper);
        this.hideInteractPrompt();
        
        // Record
        this.scene.timelineChronicle?.recordSystemUse('claimGiftedEcho', {
            whisperId: whisper.id,
            giftType: whisper.giftType
        });
    }
    
    contemplateFragment(whisper) {
        this.activeFragment = whisper;
        
        // Show detail panel
        this.panelTitle.setText('≋ PHILOSOPHICAL FRAGMENT ≋');
        this.panelMessage.setText(whisper.message);
        this.panelAuthor.setText(`— ${whisper.author}`);
        
        const responses = whisper.responses || { yes: 0, no: 0, perhaps: 0 };
        const total = responses.yes + responses.no + responses.perhaps;
        this.panelKarma.setText(
            `Karma: ${whisper.karma} | Responses: ${total} (Yes: ${responses.yes}, No: ${responses.no}, Perhaps: ${responses.perhaps})`
        );
        
        this.detailPanel.setPosition(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        );
        this.detailPanel.setVisible(true);
        this.detailPanel.setAlpha(0);
        
        this.scene.tweens.add({
            targets: this.detailPanel,
            alpha: 1,
            duration: 300
        });
        
        // Show response UI
        this.showResponseUI();
        
        // Pause game slightly
        this.scene.physics.world.timeScale = 0.1;
    }
    
    showResponseUI() {
        // Simple text prompt for now
        const responseText = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2 + 110,
            '[1] YES    [2] NO    [3] PERHAPS',
            {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#00f0ff',
                backgroundColor: 'rgba(0,0,0,0.7)'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(101);
        
        this.responseText = responseText;
    }
    
    respondToFragment(whisper, response) {
        // Update response counts
        whisper.responses = whisper.responses || { yes: 0, no: 0, perhaps: 0 };
        whisper.responses[response]++;
        
        // Karma reward
        this.addKarma(20);
        
        // Visual feedback
        const responseLabels = { yes: 'AFFIRMED', no: 'DENIED', perhaps: 'PONDERED' };
        this.showFloatingText(
            this.scene.player.x,
            this.scene.player.y - 50,
            responseLabels[response],
            '#9d4edd'
        );
        
        // Check consensus effects
        this.checkFragmentConsensus(whisper);
        
        // Close panel
        this.hideDetailPanel();
        
        // Resume game
        this.scene.physics.world.timeScale = 1;
        
        // Record
        this.scene.timelineChronicle?.recordSystemUse('respondToFragment', {
            whisperId: whisper.id,
            response: response
        });
    }
    
    checkFragmentConsensus(whisper) {
        const responses = whisper.responses;
        const total = responses.yes + responses.no + responses.perhaps;
        
        if (total < 10) return; // Need minimum responses
        
        // Check for significant consensus (66%)
        if (responses.yes / total > 0.66) {
            // Yes consensus - could affect Oracle behavior
            this.showFloatingText(
                this.scene.player.x,
                this.scene.player.y - 80,
                'CONSENSUS FORMS: Reality shifts...',
                '#ffd700'
            );
        }
    }
    
    hideDetailPanel() {
        this.detailPanel.setVisible(false);
        this.activeFragment = null;
        
        if (this.responseText) {
            this.responseText.destroy();
            this.responseText = null;
        }
        
        // Resume game speed
        this.scene.physics.world.timeScale = 1;
    }
    
    fadeWhisper(whisper) {
        if (!whisper.visual) return;
        
        this.scene.tweens.add({
            targets: whisper.visual,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            onComplete: () => {
                whisper.visual.destroy();
                whisper.visual = null;
            }
        });
    }
    
    createResonanceRing(x, y, color) {
        const ring = this.scene.add.circle(x, y, 20, color, 0.3);
        ring.setBlendMode(Phaser.BlendModes.ADD);
        ring.setDepth(36);
        
        this.scene.tweens.add({
            targets: ring,
            scale: { from: 1, to: 4 },
            alpha: { from: 0.3, to: 0 },
            duration: 1500,
            onComplete: () => ring.destroy()
        });
    }
    
    showFloatingText(x, y, text, color) {
        // Don't show text while paused
        if (this.scene.pauseSystem?.paused) return;
        
        const floating = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: color,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: floating,
            y: y - 60,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => floating.destroy()
        });
    }
    
    addKarma(amount) {
        this.karma += amount;
        this.updateKarmaLevel();
        this.updateKarmaDisplay();
        this.saveKarmaData();
    }
    
    updateKarmaLevel() {
        if (this.karma >= 5000) this.karmaLevel = 4; // Synthesis
        else if (this.karma >= 1000) this.karmaLevel = 3; // Anchor
        else if (this.karma >= 500) this.karmaLevel = 2; // Guidance
        else if (this.karma >= 100) this.karmaLevel = 1; // Golden
        else this.karmaLevel = 0;
    }
    
    updateKarmaDisplay() {
        // Guard: panel elements may not be initialized yet
        if (!this.karmaDisplay) return;
        
        const karmaSymbols = ['○', '◐', '◑', '◒', '●'];
        const symbol = karmaSymbols[this.karmaLevel] || '○';
        this.karmaDisplay.setText(`≋ Karma ${symbol} ${this.karma} ≋`);
    }
    
    attemptSpawnNewWhisper() {
        if (this.whispers.length >= this.maxWhispersPerRun) return;
        
        // 30% chance to spawn a new whisper from global pool
        if (Math.random() < 0.3) {
            const availableGlobals = this.globalWhispers.filter(
                gw => !this.whispers.some(w => w.id === gw.id)
            );
            
            if (availableGlobals.length > 0) {
                const randomGlobal = Phaser.Utils.Array.GetRandom(availableGlobals);
                this.spawnWhisper(randomGlobal);
            }
        }
    }
    
    // ===== PUBLIC API FOR OTHER SYSTEMS =====
    
    onPlayerDeath(cause) {
        // Automatically leave a bloodmark at death location
        const player = this.scene.player;
        if (!player) return;
        
        const bloodmark = {
            id: `death_${Date.now()}`,
            type: 'bloodmark',
            x: player.x,
            y: player.y,
            deathCause: cause,
            message: this.generateDeathMessage(cause),
            author: 'You',
            karma: this.karma,
            honored: 0,
            created: Date.now(),
            color: this.WHISPER_COLORS.BLOODMARK,
            isLocal: true
        };
        
        // Save to local whispers
        this.localWhispers.push(bloodmark);
        if (this.localWhispers.length > 20) {
            this.localWhispers.shift(); // Keep only last 20
        }
        this.saveLocalWhispers();
        
        // Record in chronicle
        this.scene.timelineChronicle?.recordSystemUse('leaveBloodmark', {
            cause: cause,
            x: player.x,
            y: player.y
        });
    }
    
    generateDeathMessage(cause) {
        const messages = {
            'enemy': 'The swarm took me here. Watch your flanks.',
            'bullet': 'A single shot, perfectly placed. Respect their aim.',
            'Nemesis': 'I faced myself and lost. Learn my patterns.',
            'fracture': 'Reality broke. I broke with it.',
            'void': 'The void does not forgive hesitation.',
            'default': 'I fell here. May you stand where I fell.'
        };
        
        return messages[cause] || messages['default'];
    }
    
    leaveGiftedEcho(giftType, giftValue, message) {
        const player = this.scene.player;
        if (!player) return false;
        
        const echo = {
            id: `gift_${Date.now()}`,
            type: 'gifted',
            x: player.x,
            y: player.y,
            giftType: giftType,
            giftValue: giftValue,
            message: message || 'A gift across time.',
            author: 'You',
            karma: this.karma,
            claimedBy: [],
            created: Date.now(),
            color: this.WHISPER_COLORS.GIFTED_ECHO,
            isLocal: true
        };
        
        this.localWhispers.push(echo);
        this.saveLocalWhispers();
        
        // Cost to current run
        this.totalWhispersLeft++;
        this.addKarma(10);
        
        return true;
    }
    
    leavePhilosophicalFragment(message) {
        const player = this.scene.player;
        if (!player) return false;
        
        const fragment = {
            id: `fragment_${Date.now()}`,
            type: 'fragment',
            x: player.x,
            y: player.y,
            message: message,
            author: 'You',
            karma: this.karma,
            responses: { yes: 0, no: 0, perhaps: 0 },
            created: Date.now(),
            color: this.WHISPER_COLORS.FRAGMENT,
            isLocal: true
        };
        
        this.localWhispers.push(fragment);
        this.saveLocalWhispers();
        
        this.totalWhispersLeft++;
        this.addKarma(15);
        
        return true;
    }
    
    getKarmaLevel() {
        return this.karmaLevel;
    }
    
    getKarma() {
        return this.karma;
    }
}
