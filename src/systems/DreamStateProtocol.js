import Phaser from 'phaser';

/**
 * DREAM STATE PROTOCOL — The 52nd Dimension: ONEIRIC SYNTHESIS
 * 
 * The ultimate evolution of temporal consciousness: The game dreams about you.
 * 
 * === THE CORE INNOVATION ===
 * 
 * All 51 previous systems record, predict, remember, and evolve. But none process
 * experience into the symbolic, the surreal, the DREAM. The Dream State Protocol
 * activates when the player pauses, dies, or leaves — transforming accumulated
 * gameplay data into procedural dream sequences: abstract visual symphonies that
 * represent the player's journey through metaphor, not literal replay.
 * 
 * A dream is NOT a replay. It is a RECONFIGURATION — enemies become geometric
 * mandalas, bullet patterns become flowing rivers, near-misses become lightning
 * storms. The dream compresses hours of play into minutes of symbolic art.
 * 
 * === THE THREE DREAM TYPES ===
 * 
 * 1. DEATH DREAMS (Thanatos Somnium): When you die, the killing blow expands
 *    into an infinite recession — the bullet that killed you becomes a tunnel,
 *    the enemy becomes a titan, your death-scream becomes the dream's soundtrack.
 *    These are nightmare-like: intense, short, emotionally charged.
 * 
 * 2. PAUSE DREAMS (Hypnos Somnium): While paused, the game continues "dreaming"
 *    in the background — slowly evolving abstract representations of current
 *    session data. These are contemplative: slow, beautiful, meditative.
 * 
 * 3. RETURN DREAMS (Anamnesis Somnium): When returning after absence, the game
 *    synthesizes ALL historical data into an "epoch dream" showing your entire
 *    journey as symbolic landscape — mountains of kills, rivers of bullets,
 *    forests of near-misses, cities of high scores.
 * 
 * === THE SYMBOLIC VOCABULARY ===
 * 
 * The dream translates gameplay into pure symbolic elements:
 * 
 * - KILLS → Mountains (height = enemy difficulty, color = enemy type)
 * - BULLETS → Rivers (flow direction = bullet velocity, width = damage)
 * - NEAR-MISSES → Lightning storms (intensity = streak count)
 * - DEATHS → Void chasms (depth = times died in that location)
 * - ECHO ABSORPTIONS → Aurora blooms (color = echo type)
 * - SYSTEM ACTIVATIONS → Constellations connecting into networks
 * - MOVEMENT PATHS → Trails that become roads, then canyons
 * - HIGH SCORES → Crystalline towers piercing clouds
 * 
 * === THE ONEIRIC MECHANIC ===
 * 
 * Dreams are INTERACTIVE — you can "steer" them with mouse movement, subtly
 * influencing the procedural generation. Moving the mouse left makes the dream
 * focus on past events; right on future potentialities. Speed affects intensity.
 * 
 * This creates "lucid dreaming" — conscious influence over the unconscious
 * processing. The dream becomes a divination tool: steer it toward areas of
 * uncertainty to gain insight (symbolically rendered) into upcoming challenges.
 * 
 * === DREAM RESIDUE ===
 * 
 * When you wake (unpause/respawn/return), the dream doesn't simply end — it
 * LEAVES RESIDUE. The symbolic elements briefly bleed into reality:
 * 
 * - Kill-mountains leave actual elevation in the arena (height = kills)
 * - Bullet-rivers create flow patterns that affect enemy movement
 * - Lightning-storm zones become areas of temporal instability (slow time)
 * - Movement-roads become actual speed boost paths
 * 
 * The dream literally reshapes the game world for the next session.
 * 
 * === THE DREAM ARCHIVE ===
 * 
 * Every dream is saved as a "oneiric shard" — a compact symbolic representation
 * that can be revisited in the Chronicle. Players accumulate a gallery of dreams
 * that tells the story of their journey more truthfully than any score or replay.
 * 
 * The 52nd dimension completes the game: 
 * Play → Memory → Dream → Residue → Transformed Play
 * 
 * Color: Dream Indigo (#4b0082) — the color of twilight consciousness, liminality,
 * the boundary between waking and sleeping, the space where symbols live.
 * Secondary: Lucid Cyan (#00d4ff) — conscious control within the unconscious.
 * 
 * This is where the game becomes art. Where data becomes symbol. Where play
 * becomes poetry.
 * 
 * === MIGRATION NOTE ===
 * 
 * Migrated to UnifiedGraphicsManager (2026-04-01):
 * - Dream vignette rendering uses UnifiedGraphicsManager on 'effects' layer
 * - All legacy Graphics objects removed (dreamGraphics, dreamVignette)
 * - All graphics.clear() calls removed - UnifiedGraphicsManager clears automatically
 * - Dream symbols use GameObject containers (complex animated objects)
 * - Pure UnifiedGraphicsManager implementation - no legacy fallback code
 */

export default class DreamStateProtocol {
    constructor(scene) {
        this.scene = scene;
        
        // ===== COLORS OF DREAM =====
        this.DREAM_COLOR = 0x4b0082;         // Indigo — twilight consciousness
        this.LUCID_COLOR = 0x00d4ff;         // Cyan — conscious dream control
        this.NIGHTMARE_COLOR = 0xdc143c;     // Crimson — death dreams
        this.VOID_DREAM_COLOR = 0x0a0a1a;    // Deep dream void
        this.SYMBOL_COLORS = {
            kills: 0x8b4513,                  // Mountain brown
            bullets: 0x00b4d8,                // River blue
            nearMisses: 0xffd700,             // Lightning gold
            deaths: 0x1a0a2e,                 // Chasm purple-black
            echoes: 0x9d4edd,                 // Aurora purple
            systems: 0xffb700,                // Constellation gold
            paths: 0xc0c0c0,                  // Road silver
            scores: 0xe0e0e0                  // Crystal white
        };
        
        // ===== DREAM STATE =====
        this.dreamState = {
            isDreaming: false,
            dreamType: null,                  // 'death', 'pause', 'return'
            dreamStartTime: 0,
            dreamIntensity: 0,               // 0-1, builds during dream
            lucidity: 0,                     // Player influence level
            currentSymbols: [],              // Active dream elements
            dreamCanvas: null,               // Off-screen render target
            dreamCamera: null                // Separate camera for dream view
        };
        
        // ===== SYMBOLIC DATA =====
        this.symbolicMemory = {
            killLocations: [],               // {x, y, enemyType, difficulty, time}
            bulletPatterns: [],              // {origin, velocity, count, time}
            nearMissEvents: [],              // {x, y, streak, time}
            deathLocations: [],              // {x, y, killerType, time}
            echoAbsorptions: [],             // {x, y, echoType, time}
            systemActivations: [],           // {system, x, y, time}
            movementPath: [],                // {x, y, speed, time} — recent only
            scorePeaks: []                   // {score, x, y, time}
        };
        
        // ===== DREAM CONFIGURATION =====
        this.config = {
            maxSymbols: 100,                 // Maximum elements in one dream
            dreamFPS: 30,                  // Render every N frames
            symbolLifespan: 8000,          // Ms before symbols fade
            deathDreamDuration: 5000,      // Nightmare length
            pauseDreamInterval: 100,       // Update while paused
            returnDreamDuration: 15000,    // Epoch dream length
            lucidityThreshold: 0.3         // Mouse movement threshold
        };
        
        // ===== VISUALS =====
        this.dreamOverlay = null;
        this.symbolContainer = null;
        this.dreamParticles = null;
        this.residueEffects = [];
        
        // ===== AUDIO =====
        this.dreamOscillators = [];
        this.dreamGain = null;
        
        // ===== PERSISTENCE =====
        this.dreamArchive = [];           // Saved dreams
        this.maxArchivedDreams = 20;
        
        this.init();
    }
    
    init() {
        this.createDreamOverlay();
        this.createSymbolContainer();
        this.setupDreamAudio();
        this.loadDreamArchive();
        this.setupEventListeners();
        
        // Create dream particle texture
        this.createDreamParticleTexture();
    }
    
    createDreamOverlay() {
        // Full-screen overlay that fades in during dreams
        this.dreamOverlay = this.scene.add.rectangle(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            this.VOID_DREAM_COLOR,
            0
        );
        this.dreamOverlay.setDepth(199);
        this.dreamOverlay.setScrollFactor(0);
        this.dreamOverlay.setVisible(false);
    }
    
    createDreamParticleTexture() {
        // Create dream particle texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Ethereal soft glow for dream symbols
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(75, 0, 130, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        this.scene.textures.addCanvas('dreamParticle', canvas);
    }
    
    createSymbolContainer() {
        this.symbolContainer = this.scene.add.container(0, 0);
        this.symbolContainer.setDepth(202);
        this.symbolContainer.setVisible(false);
    }
    
    setupDreamAudio() {
        // Initialize Web Audio API for dream soundscapes
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.dreamGain = this.audioContext.createGain();
            this.dreamGain.gain.value = 0;
            this.dreamGain.connect(this.audioContext.destination);
            
            // Create multiple oscillators for ethereal chords
            const frequencies = [110, 164.81, 196, 220];  // A2, E3, G3, A3 (minor 7th)
            frequencies.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                osc.type = i % 2 === 0 ? 'sine' : 'triangle';
                osc.frequency.value = freq;
                
                const gain = this.audioContext.createGain();
                gain.gain.value = 0.1;
                
                osc.connect(gain);
                gain.connect(this.dreamGain);
                osc.start();
                
                this.dreamOscillators.push({ osc, gain, baseFreq: freq });
            });
        } catch (e) {
            console.log('Dream audio not available:', e);
        }
    }
    
    setupEventListeners() {
        // Listen to ALL systems to build symbolic memory
        this.scene.events.on('enemyKilled', (data) => this.recordKill(data));
        this.scene.events.on('bulletFired', (data) => this.recordBullet(data));
        this.scene.events.on('nearMiss', (data) => this.recordNearMiss(data));
        this.scene.events.on('playerDeath', (data) => this.startDeathDream(data));
        this.scene.events.on('echoAbsorbed', (data) => this.recordEcho(data));
        this.scene.events.on('systemActivated', (data) => this.recordSystem(data));
        this.scene.events.on('scoreMilestone', (data) => this.recordScore(data));
        
        // Track movement for path symbols
        this.scene.time.addEvent({
            delay: 500,
            callback: () => this.recordMovement(),
            loop: true
        });
        
        // Monitor pause state
        this.scene.game.events.on('pause', () => this.onPause());
        this.scene.game.events.on('resume', () => this.onResume());
        
        // Visibility change for tab switching
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onBackground();
            } else {
                this.onReturn();
            }
        });
    }
    
    // ===== MEMORY RECORDING =====
    
    recordKill(data) {
        this.symbolicMemory.killLocations.push({
            x: data.x,
            y: data.y,
            enemyType: data.type,
            difficulty: data.maxHealth || 50,
            time: Date.now()
        });
        
        // Trim old data
        this.trimMemory('killLocations', 50);
    }
    
    recordBullet(data) {
        this.symbolicMemory.bulletPatterns.push({
            originX: data.x,
            originY: data.y,
            velocityX: data.vx,
            velocityY: data.vy,
            isPlayer: data.isPlayer,
            time: Date.now()
        });
        
        this.trimMemory('bulletPatterns', 100);
    }
    
    recordNearMiss(data) {
        this.symbolicMemory.nearMissEvents.push({
            x: data.x,
            y: data.y,
            streak: data.streak || 1,
            bulletVelocity: data.velocity,
            time: Date.now()
        });
        
        this.trimMemory('nearMissEvents', 30);
    }
    
    recordEcho(data) {
        this.symbolicMemory.echoAbsorptions.push({
            x: data.x,
            y: data.y,
            echoType: data.type,
            power: data.power || 1,
            time: Date.now()
        });
        
        this.trimMemory('echoAbsorptions', 40);
    }
    
    recordSystem(data) {
        this.symbolicMemory.systemActivations.push({
            system: data.system,
            x: data.x || this.scene.player?.x || 960,
            y: data.y || this.scene.player?.y || 720,
            intensity: data.intensity || 1,
            time: Date.now()
        });
        
        this.trimMemory('systemActivations', 50);
    }
    
    recordScore(data) {
        this.symbolicMemory.scorePeaks.push({
            score: data.score,
            x: this.scene.player?.x || 960,
            y: this.scene.player?.y || 720,
            time: Date.now()
        });
        
        this.trimMemory('scorePeaks', 20);
    }
    
    recordMovement() {
        if (!this.scene.player?.active) return;
        
        const player = this.scene.player;
        const velocity = Math.sqrt(player.body.velocity.x ** 2 + player.body.velocity.y ** 2);
        
        this.symbolicMemory.movementPath.push({
            x: player.x,
            y: player.y,
            speed: velocity,
            time: Date.now()
        });
        
        // Only keep recent path (last 60 seconds)
        const cutoff = Date.now() - 60000;
        this.symbolicMemory.movementPath = this.symbolicMemory.movementPath.filter(
            p => p.time > cutoff
        );
    }
    
    trimMemory(key, maxItems) {
        const arr = this.symbolicMemory[key];
        if (arr.length > maxItems) {
            // Remove oldest
            this.symbolicMemory[key] = arr.slice(-maxItems);
        }
    }
    
    // ===== DREAM TRIGGERING =====
    
    startDeathDream(deathData) {
        if (this.dreamState.isDreaming) return;
        
        // FIX: Don't enter dream state if exchange is open (game is paused)
        if (this.scene.isExchangePaused) {
            console.log('[DreamState] Death occurred while exchange open - deferring dream');
            return;
        }
        
        this.dreamState.dreamType = 'death';
        this.dreamState.dreamIntensity = 1.0;  // Maximum intensity
        this.dreamState.lucidity = 0;
        
        // Record death location
        this.symbolicMemory.deathLocations.push({
            x: deathData.x,
            y: deathData.y,
            killerType: deathData.killerType || 'unknown',
            time: Date.now()
        });
        this.trimMemory('deathLocations', 20);
        
        this.enterDreamState();
        
        // Death dream ends with respawn
        this.scene.time.delayedCall(this.config.deathDreamDuration, () => {
            this.exitDreamState();
        });
    }
    
    onPause() {
        // Start gentle pause dream after short delay
        this.pauseTimeout = this.scene.time.delayedCall(2000, () => {
            if (!this.dreamState.isDreaming) {
                this.dreamState.dreamType = 'pause';
                this.dreamState.dreamIntensity = 0.3;
                this.dreamState.lucidity = 0.5;  // More lucid during pause
                this.enterDreamState();
            }
        });
    }
    
    onResume() {
        if (this.pauseTimeout) {
            this.pauseTimeout.remove();
        }
        
        if (this.dreamState.isDreaming && this.dreamState.dreamType === 'pause') {
            this.exitDreamState();
        }
    }
    
    onBackground() {
        // Calculate time away for return dream
        this.backgroundTime = Date.now();
    }
    
    onReturn() {
        if (!this.backgroundTime) return;
        
        const awayTime = Date.now() - this.backgroundTime;
        
        // If away for more than 30 seconds, trigger return dream
        if (awayTime > 30000 && !this.dreamState.isDreaming) {
            this.dreamState.dreamType = 'return';
            this.dreamState.dreamIntensity = Math.min(awayTime / 60000, 1.0);  // Scale with absence
            this.dreamState.lucidity = 0.2;
            this.enterDreamState();
            
            this.scene.time.delayedCall(this.config.returnDreamDuration, () => {
                this.exitDreamState();
            });
        }
    }
    
    // ===== DREAM STATE MANAGEMENT =====
    
    enterDreamState() {
        if (this.dreamState.isDreaming) return;
        
        this.dreamState.isDreaming = true;
        this.dreamState.dreamStartTime = Date.now();
        this.dreamState.currentSymbols = [];
        
        // Fade in dream overlay
        this.dreamOverlay.setVisible(true);
        this.symbolContainer.setVisible(true);
        
        this.scene.tweens.add({
            targets: this.dreamOverlay,
            alpha: { from: 0, to: 0.85 },
            duration: 2000,
            ease: 'Power2'
        });
        
        // Fade in dream audio
        if (this.audioContext && this.dreamGain) {
            this.dreamGain.gain.setTargetAtTime(0.3, this.audioContext.currentTime, 2);
        }
        
        // Generate initial symbols
        this.generateDreamSymbols();
        
        // Start dream update loop
        this.dreamUpdateEvent = this.scene.time.addEvent({
            delay: 50,
            callback: () => this.updateDream(),
            loop: true
        });
        
        // Start residue application when dream ends
        this.dreamState.pendingResidue = true;
        
        // Save dream to archive
        this.archiveDream();
    }
    
    exitDreamState() {
        if (!this.dreamState.isDreaming) return;
        
        // Apply dream residue
        if (this.dreamState.pendingResidue) {
            this.applyDreamResidue();
        }
        
        // Fade out
        this.scene.tweens.add({
            targets: [this.dreamOverlay, this.symbolContainer],
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                this.dreamOverlay.setVisible(false);
                this.symbolContainer.setVisible(false);
                this.symbolContainer.removeAll(true);
                
                // Note: UnifiedGraphicsManager clears automatically each frame
            }
        });
        
        // Fade out audio
        if (this.audioContext && this.dreamGain) {
            this.dreamGain.gain.setTargetAtTime(0, this.audioContext.currentTime, 1);
        }
        
        // Stop update loop
        if (this.dreamUpdateEvent) {
            this.dreamUpdateEvent.remove();
        }
        
        // Reset state
        this.dreamState.isDreaming = false;
        this.dreamState.currentSymbols = [];
        this.dreamState.dreamIntensity = 0;
    }
    
    // ===== DREAM GENERATION =====
    
    generateDreamSymbols() {
        const symbols = [];
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;
        
        // Generate kill mountains
        this.symbolicMemory.killLocations.forEach((kill, i) => {
            if (i >= 20) return;  // Limit mountains
            
            const symbol = this.createMountainSymbol(kill, i);
            symbols.push(symbol);
        });
        
        // Generate bullet rivers
        this.symbolicMemory.bulletPatterns.forEach((bullet, i) => {
            if (i >= 30) return;
            
            const symbol = this.createRiverSymbol(bullet, i);
            symbols.push(symbol);
        });
        
        // Generate near-miss lightning
        this.symbolicMemory.nearMissEvents.forEach((miss, i) => {
            if (i >= 15) return;
            
            const symbol = this.createLightningSymbol(miss, i);
            symbols.push(symbol);
        });
        
        // Generate death chasms
        this.symbolicMemory.deathLocations.forEach((death, i) => {
            const symbol = this.createChasmSymbol(death, i);
            symbols.push(symbol);
        });
        
        // Generate echo auroras
        this.symbolicMemory.echoAbsorptions.forEach((echo, i) => {
            if (i >= 20) return;
            
            const symbol = this.createAuroraSymbol(echo, i);
            symbols.push(symbol);
        });
        
        // Generate system constellations
        this.generateConstellationSymbols(symbols);
        
        // Generate path roads
        this.generatePathSymbols(symbols);
        
        // Generate score crystals
        this.symbolicMemory.scorePeaks.forEach((score, i) => {
            if (i >= 10) return;
            
            const symbol = this.createCrystalSymbol(score, i);
            symbols.push(symbol);
        });
        
        // Create all symbol visuals
        symbols.forEach(symbol => this.createSymbolVisual(symbol));
        
        this.dreamState.currentSymbols = symbols;
    }
    
    createMountainSymbol(kill, index) {
        // Mountains represent kills — height = difficulty, color = enemy type
        const height = Math.max(30, kill.difficulty / 2);
        const width = height * 0.8;
        const hue = kill.enemyType === 'enemyFast' ? 30 : 
                    kill.enemyType === 'enemyTank' ? 270 : 0;
        
        return {
            type: 'mountain',
            x: this.normalizeX(kill.x),
            y: this.normalizeY(kill.y),
            height,
            width,
            color: Phaser.Display.Color.HSLToColor(hue / 360, 0.6, 0.4).color,
            glowColor: Phaser.Display.Color.HSLToColor(hue / 360, 0.8, 0.6).color,
            birth: Date.now() + index * 100,
            data: kill
        };
    }
    
    createRiverSymbol(bullet, index) {
        // Rivers represent bullet patterns — flow = velocity, width = damage
        const speed = Math.sqrt(bullet.velocityX ** 2 + bullet.velocityY ** 2);
        const width = Math.max(2, speed / 100);
        
        return {
            type: 'river',
            x: this.normalizeX(bullet.originX),
            y: this.normalizeY(bullet.originY),
            vx: bullet.velocityX * 0.5,
            vy: bullet.velocityY * 0.5,
            width,
            color: bullet.isPlayer ? this.SYMBOL_COLORS.bullets : 0xff3366,
            birth: Date.now() + index * 50,
            data: bullet
        };
    }
    
    createLightningSymbol(miss, index) {
        // Lightning represents near-misses — intensity = streak count
        const branches = Math.min(5, miss.streak);
        
        return {
            type: 'lightning',
            x: this.normalizeX(miss.x),
            y: this.normalizeY(miss.y),
            branches,
            intensity: miss.streak / 5,
            color: this.SYMBOL_COLORS.nearMisses,
            birth: Date.now() + index * 150,
            data: miss
        };
    }
    
    createChasmSymbol(death, index) {
        // Chasms represent deaths — depth = times died near here
        const nearbyDeaths = this.symbolicMemory.deathLocations.filter(
            d => Phaser.Math.Distance.Between(d.x, d.y, death.x, death.y) < 200
        ).length;
        
        return {
            type: 'chasm',
            x: this.normalizeX(death.x),
            y: this.normalizeY(death.y),
            depth: nearbyDeaths * 20,
            radius: 40 + nearbyDeaths * 10,
            color: this.SYMBOL_COLORS.deaths,
            birth: Date.now() + index * 200,
            data: death
        };
    }
    
    createAuroraSymbol(echo, index) {
        // Auroras represent echo absorptions — color = echo type
        return {
            type: 'aurora',
            x: this.normalizeX(echo.x),
            y: this.normalizeY(echo.y),
            radius: 60 + (echo.power || 1) * 20,
            hue: (index * 30) % 360,
            color: this.SYMBOL_COLORS.echoes,
            birth: Date.now() + index * 80,
            data: echo
        };
    }
    
    generateConstellationSymbols(symbols) {
        // Create constellation networks from system activations
        const systems = this.symbolicMemory.systemActivations;
        if (systems.length < 2) return;
        
        // Group by proximity to form constellations
        const groups = [];
        let currentGroup = [systems[0]];
        
        for (let i = 1; i < systems.length; i++) {
            const last = currentGroup[currentGroup.length - 1];
            const dist = Phaser.Math.Distance.Between(last.x, last.y, systems[i].x, systems[i].y);
            
            if (dist < 300 && currentGroup.length < 5) {
                currentGroup.push(systems[i]);
            } else {
                if (currentGroup.length >= 2) groups.push(currentGroup);
                currentGroup = [systems[i]];
            }
        }
        
        if (currentGroup.length >= 2) groups.push(currentGroup);
        
        // Create constellation symbols
        groups.forEach((group, gi) => {
            symbols.push({
                type: 'constellation',
                nodes: group.map(s => ({
                    x: this.normalizeX(s.x),
                    y: this.normalizeY(s.y)
                })),
                color: this.SYMBOL_COLORS.systems,
                birth: Date.now() + gi * 300,
                data: group
            });
        });
    }
    
    generatePathSymbols(symbols) {
        // Convert movement path into symbolic roads/canyons
        const path = this.symbolicMemory.movementPath;
        if (path.length < 5) return;
        
        // Sample points along path
        const samples = [];
        for (let i = 0; i < path.length; i += Math.floor(path.length / 10) || 1) {
            samples.push(path[i]);
        }
        
        if (samples.length >= 2) {
            symbols.push({
                type: 'path',
                points: samples.map(p => ({
                    x: this.normalizeX(p.x),
                    y: this.normalizeY(p.y),
                    speed: p.speed
                })),
                color: this.SYMBOL_COLORS.paths,
                birth: Date.now(),
                data: { samples }
            });
        }
    }
    
    createCrystalSymbol(score, index) {
        // Crystals represent high scores — height = score magnitude
        const height = Math.min(150, score.score / 100);
        
        return {
            type: 'crystal',
            x: this.normalizeX(score.x),
            y: this.normalizeY(score.y) - height / 2,
            height,
            facets: 6 + (index % 4),
            color: this.SYMBOL_COLORS.scores,
            glowColor: this.LUCID_COLOR,
            birth: Date.now() + index * 250,
            data: score
        };
    }
    
    // ===== SYMBOL VISUAL CREATION =====
    
    createSymbolVisual(symbol) {
        const age = Date.now() - symbol.birth;
        if (age < 0) return;  // Not born yet
        
        const alpha = Math.min(1, age / 1000) * this.dreamState.dreamIntensity;
        
        switch (symbol.type) {
            case 'mountain':
                this.createMountainVisual(symbol, alpha);
                break;
            case 'river':
                this.createRiverVisual(symbol, alpha);
                break;
            case 'lightning':
                this.createLightningVisual(symbol, alpha);
                break;
            case 'chasm':
                this.createChasmVisual(symbol, alpha);
                break;
            case 'aurora':
                this.createAuroraVisual(symbol, alpha);
                break;
            case 'constellation':
                this.createConstellationVisual(symbol, alpha);
                break;
            case 'path':
                this.createPathVisual(symbol, alpha);
                break;
            case 'crystal':
                this.createCrystalVisual(symbol, alpha);
                break;
        }
    }
    
    createMountainVisual(symbol, alpha) {
        const container = this.scene.add.container(symbol.x, symbol.y);
        
        // Mountain shape (triangle with gradient)
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(symbol.color, alpha * 0.8);
        graphics.fillTriangle(
            0, -symbol.height,
            -symbol.width / 2, 0,
            symbol.width / 2, 0
        );
        
        // Glow outline
        graphics.lineStyle(2, symbol.glowColor, alpha);
        graphics.strokeTriangle(
            0, -symbol.height,
            -symbol.width / 2, 0,
            symbol.width / 2, 0
        );
        
        // Snow cap (white triangle at top)
        if (symbol.height > 50) {
            graphics.fillStyle(0xffffff, alpha * 0.6);
            graphics.fillTriangle(
                0, -symbol.height,
                -symbol.width / 6, -symbol.height * 0.6,
                symbol.width / 6, -symbol.height * 0.6
            );
        }
        
        container.add(graphics);
        container.setAlpha(0);
        
        // Float up animation
        this.scene.tweens.add({
            targets: container,
            alpha: 1,
            y: symbol.y - 20,
            duration: 2000,
            ease: 'Power2'
        });
        
        this.symbolContainer.add(container);
        symbol.visual = container;
    }
    
    createRiverVisual(symbol, alpha) {
        const graphics = this.scene.add.graphics();
        
        // Flowing river — curved line following velocity
        const length = 100;
        const endX = symbol.x + symbol.vx * 2;
        const endY = symbol.y + symbol.vy * 2;
        const midX = (symbol.x + endX) / 2 + symbol.vy * 0.5;
        const midY = (symbol.y + endY) / 2 - symbol.vx * 0.5;
        
        graphics.lineStyle(symbol.width, symbol.color, alpha * 0.6);
        graphics.beginPath();
        graphics.moveTo(symbol.x, symbol.y);
        // FIX: Phaser 3 uses curveTo, not quadraticCurveTo
        graphics.curveTo(midX, midY, endX, endY);
        graphics.strokePath();
        
        // Flow particles
        const flowParticle = this.scene.add.circle(
            symbol.x, symbol.y, symbol.width / 2,
            0xffffff, alpha * 0.8
        );
        
        this.scene.tweens.add({
            targets: flowParticle,
            x: endX,
            y: endY,
            duration: 2000,
            repeat: -1,
            ease: 'Linear'
        });
        
        this.symbolContainer.add([graphics, flowParticle]);
        symbol.visual = { graphics, flowParticle };
    }
    
    createLightningVisual(symbol, alpha) {
        const container = this.scene.add.container(symbol.x, symbol.y);
        
        // Generate jagged lightning bolt
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(3, symbol.color, alpha);
        
        for (let b = 0; b < symbol.branches; b++) {
            const angle = (b / symbol.branches) * Math.PI * 2;
            const length = 60 + Math.random() * 40;
            
            let currentX = 0;
            let currentY = 0;
            const segments = 5;
            
            graphics.beginPath();
            graphics.moveTo(0, 0);
            
            for (let i = 0; i < segments; i++) {
                const segLength = length / segments;
                const segAngle = angle + (Math.random() - 0.5) * 0.5;
                currentX += Math.cos(segAngle) * segLength;
                currentY += Math.sin(segAngle) * segLength;
                graphics.lineTo(currentX, currentY);
            }
            
            graphics.strokePath();
        }
        
        // Glow center
        const glow = this.scene.add.circle(0, 0, 20, symbol.color, alpha * 0.5);
        container.add([glow, graphics]);
        
        // Pulse animation
        this.scene.tweens.add({
            targets: glow,
            scale: 1.5,
            alpha: alpha * 0.2,
            duration: 500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        
        this.symbolContainer.add(container);
        symbol.visual = container;
    }
    
    createChasmVisual(symbol, alpha) {
        const container = this.scene.add.container(symbol.x, symbol.y);
        
        // Void spiral representing depth
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(symbol.color, alpha * 0.9);
        
        // Concentric circles receding into depth
        for (let i = 3; i >= 0; i--) {
            const radius = symbol.radius * (1 - i * 0.2);
            const depthAlpha = alpha * (1 - i * 0.2);
            graphics.fillStyle(
                Phaser.Display.Color.Interpolate.ColorWithColor(
                    Phaser.Display.Color.ValueToColor(symbol.color),
                    Phaser.Display.Color.ValueToColor(0x000000),
                    100,
                    i * 25
                ).color,
                depthAlpha
            );
            graphics.fillCircle(0, 0, radius);
        }
        
        // Void particles being sucked in
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const particle = this.scene.add.circle(
                Math.cos(angle) * symbol.radius,
                Math.sin(angle) * symbol.radius,
                3,
                0x4b0082,
                alpha
            );
            
            this.scene.tweens.add({
                targets: particle,
                x: 0,
                y: 0,
                scale: 0,
                duration: 2000 + Math.random() * 1000,
                repeat: -1,
                ease: 'Power2'
            });
            
            container.add(particle);
        }
        
        container.addAt(graphics, 0);
        this.symbolContainer.add(container);
        symbol.visual = container;
    }
    
    createAuroraVisual(symbol, alpha) {
        const container = this.scene.add.container(symbol.x, symbol.y);
        
        // Flowing aurora ribbons
        for (let i = 0; i < 3; i++) {
            const ribbon = this.scene.add.graphics();
            const hue = (symbol.hue + i * 40) % 360;
            const color = Phaser.Display.Color.HSLToColor(hue / 360, 0.8, 0.6).color;
            
            ribbon.lineStyle(8 - i * 2, color, alpha * (0.5 - i * 0.1));
            
            // Sine wave ribbon
            ribbon.beginPath();
            for (let x = -symbol.radius; x <= symbol.radius; x += 5) {
                const y = Math.sin(x * 0.05 + i) * 20;
                if (x === -symbol.radius) ribbon.moveTo(x, y);
                else ribbon.lineTo(x, y);
            }
            ribbon.strokePath();
            
            container.add(ribbon);
            
            // Flow animation
            this.scene.tweens.add({
                targets: ribbon,
                y: 10,
                duration: 3000 + i * 500,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
        
        this.symbolContainer.add(container);
        symbol.visual = container;
    }
    
    createConstellationVisual(symbol, alpha) {
        const container = this.scene.add.container(0, 0);
        const graphics = this.scene.add.graphics();
        
        // Draw connections
        graphics.lineStyle(1, symbol.color, alpha * 0.5);
        for (let i = 0; i < symbol.nodes.length - 1; i++) {
            graphics.beginPath();
            graphics.moveTo(symbol.nodes[i].x, symbol.nodes[i].y);
            graphics.lineTo(symbol.nodes[i + 1].x, symbol.nodes[i + 1].y);
            graphics.strokePath();
        }
        
        // Draw nodes
        symbol.nodes.forEach((node, i) => {
            const star = this.scene.add.circle(node.x, node.y, 4, symbol.color, alpha);
            const glow = this.scene.add.circle(node.x, node.y, 12, symbol.color, alpha * 0.3);
            
            container.add([glow, star]);
            
            // Twinkle
            this.scene.tweens.add({
                targets: star,
                alpha: alpha * 0.5,
                scale: 0.8,
                duration: 1000 + i * 200,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        });
        
        container.addAt(graphics, 0);
        this.symbolContainer.add(container);
        symbol.visual = container;
    }
    
    createPathVisual(symbol, alpha) {
        const graphics = this.scene.add.graphics();
        
        // Draw path as glowing trail
        graphics.lineStyle(4, symbol.color, alpha * 0.4);
        graphics.beginPath();
        
        symbol.points.forEach((point, i) => {
            if (i === 0) graphics.moveTo(point.x, point.y);
            else graphics.lineTo(point.x, point.y);
        });
        
        graphics.strokePath();
        
        // Speed indicators along path
        symbol.points.forEach((point, i) => {
            if (i % 3 === 0 && point.speed > 50) {
                const speedMarker = this.scene.add.circle(
                    point.x, point.y,
                    Math.min(15, point.speed / 20),
                    this.LUCID_COLOR,
                    alpha * 0.3
                );
                this.symbolContainer.add(speedMarker);
            }
        });
        
        this.symbolContainer.add(graphics);
        symbol.visual = graphics;
    }
    
    createCrystalVisual(symbol, alpha) {
        const container = this.scene.add.container(symbol.x, symbol.y);
        const graphics = this.scene.add.graphics();
        
        // Draw crystal facets
        const facets = symbol.facets;
        const radius = symbol.height / 2;
        
        for (let i = 0; i < facets; i++) {
            const angle1 = (i / facets) * Math.PI * 2 - Math.PI / 2;
            const angle2 = ((i + 1) / facets) * Math.PI * 2 - Math.PI / 2;
            
            const x1 = Math.cos(angle1) * radius * 0.3;
            const y1 = symbol.height * 0.3;
            const x2 = Math.cos(angle2) * radius * 0.3;
            const y2 = symbol.height * 0.3;
            const x3 = Math.cos((angle1 + angle2) / 2) * radius;
            const y3 = -symbol.height * 0.5;
            
            // Facet with gradient effect
            const brightness = 0.3 + (i % 2) * 0.2;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.ValueToColor(symbol.color),
                Phaser.Display.Color.ValueToColor(symbol.glowColor),
                100,
                i * (100 / facets)
            ).color;
            
            graphics.fillStyle(color, alpha * brightness);
            graphics.fillTriangle(x1, y1, x2, y2, x3, y3);
            graphics.lineStyle(1, symbol.glowColor, alpha * 0.5);
            graphics.strokeTriangle(x1, y1, x2, y2, x3, y3);
        }
        
        // Base
        graphics.fillStyle(symbol.color, alpha * 0.5);
        graphics.fillCircle(0, symbol.height * 0.3, radius * 0.3);
        
        container.add(graphics);
        
        // Rotate slowly
        this.scene.tweens.add({
            targets: container,
            rotation: Math.PI * 2,
            duration: 20000,
            repeat: -1,
            ease: 'Linear'
        });
        
        this.symbolContainer.add(container);
        symbol.visual = container;
    }
    
    // ===== DREAM UPDATE =====
    
    updateDream() {
        if (!this.dreamState.isDreaming) return;
        
        // Update dream intensity
        const dreamAge = Date.now() - this.dreamState.dreamStartTime;
        const maxDuration = this.dreamState.dreamType === 'death' ? this.config.deathDreamDuration :
                           this.dreamState.dreamType === 'return' ? this.config.returnDreamDuration :
                           30000;
        
        // Intensity curve: rise, sustain, fall
        if (dreamAge < 2000) {
            this.dreamState.dreamIntensity = dreamAge / 2000;
        } else if (dreamAge > maxDuration - 2000) {
            this.dreamState.dreamIntensity = (maxDuration - dreamAge) / 2000;
        }
        
        // Check for lucid control (mouse movement during dream)
        const pointer = this.scene.input.activePointer;
        if (pointer.isDown) {
            this.dreamState.lucidity = Math.min(1, this.dreamState.lucidity + 0.05);
        } else {
            this.dreamState.lucidity = Math.max(0, this.dreamState.lucidity - 0.02);
        }
        
        // Apply lucidity effects (steer dream)
        if (this.dreamState.lucidity > 0.3) {
            this.applyLucidityEffects(pointer);
        }
        
        // Update audio based on intensity
        this.updateDreamAudio();
        
        // Draw vignette
        this.drawVignette();
    }
    
    applyLucidityEffects(pointer) {
        // Mouse position influences which symbols become prominent
        const screenX = pointer.x;
        const screenY = pointer.y;
        
        this.dreamState.currentSymbols.forEach(symbol => {
            if (!symbol.visual) return;
            
            const dist = Phaser.Math.Distance.Between(symbol.x, symbol.y, screenX, screenY);
            const influence = Math.max(0, 1 - dist / 300) * this.dreamState.lucidity;
            
            if (influence > 0.3) {
                // Enhance symbol
                if (symbol.visual.setScale) {
                    symbol.visual.setScale(1 + influence * 0.3);
                }
                
                // Rotate toward focus
                if (symbol.visual.rotation !== undefined) {
                    const angle = Phaser.Math.Angle.Between(symbol.x, symbol.y, screenX, screenY);
                    symbol.visual.rotation += (angle - symbol.visual.rotation) * 0.05;
                }
            }
        });
    }
    
    drawVignette() {
        const camera = this.scene.cameras.main;
        const cx = camera.width / 2;
        const cy = camera.height / 2;
        const maxRadius = Math.max(cx, cy);
        
        // Use UnifiedGraphicsManager for vignette rendering
        const manager = this.scene.graphicsManager;
        const baseAlpha = this.dreamState.dreamIntensity * 0.9;
        
        // Draw vignette rings with decreasing alpha toward center
        const steps = 10;
        for (let i = 0; i < steps; i++) {
            const radius = maxRadius * 0.3 + (i / steps) * maxRadius * 0.7;
            const alpha = (i / steps) * baseAlpha * 0.5; // Scale down for ring method
            
            // Use ring commands for vignette effect on 'effects' layer
            manager.drawRing('effects', cx, cy, radius, this.VOID_DREAM_COLOR, alpha, 8);
        }
        
        // Note: UnifiedGraphicsManager clears once per frame automatically
    }
    
    updateDreamAudio() {
        if (!this.audioContext || !this.dreamOscillators.length) return;
        
        // Modulate frequencies based on dream intensity and symbol count
        const baseFreqs = [110, 164.81, 196, 220];
        const intensity = this.dreamState.dreamIntensity;
        const symbolCount = this.dreamState.currentSymbols.length;
        
        this.dreamOscillators.forEach((oscData, i) => {
            const detune = Math.sin(Date.now() / 1000 + i) * 10 * intensity;
            const freqMod = 1 + (symbolCount / 100) * 0.1;
            oscData.osc.frequency.setTargetAtTime(
                oscData.baseFreq * freqMod + detune,
                this.audioContext.currentTime,
                0.1
            );
        });
    }
    
    // ===== DREAM RESIDUE =====
    
    applyDreamResidue() {
        // Transform symbols into actual gameplay effects
        this.dreamState.currentSymbols.forEach(symbol => {
            switch (symbol.type) {
                case 'mountain':
                    this.createResidueMountain(symbol);
                    break;
                case 'river':
                    this.createResidueRiver(symbol);
                    break;
                case 'lightning':
                    this.createResidueLightning(symbol);
                    break;
                case 'chasm':
                    this.createResidueChasm(symbol);
                    break;
                case 'aurora':
                    this.createResidueAurora(symbol);
                    break;
                case 'path':
                    this.createResiduePath(symbol);
                    break;
                case 'crystal':
                    this.createResidueCrystal(symbol);
                    break;
            }
        });
        
        // Show residue notification
        this.showResidueNotification();
    }
    
    createResidueMountain(symbol) {
        // Creates temporary elevation that blocks/enhances movement
        const worldX = symbol.data.x;
        const worldY = symbol.data.y;
        
        // Visual residue: persistent mountain sprite
        const mountain = this.scene.add.triangle(
            worldX, worldY,
            0, -symbol.height,
            -symbol.width / 2, 0,
            symbol.width / 2, 0,
            symbol.color,
            0.4
        );
        mountain.setDepth(1);
        
        // Fade out over time
        this.scene.tweens.add({
            targets: mountain,
            alpha: 0,
            duration: 60000,
            onComplete: () => mountain.destroy()
        });
        
        // Gameplay effect: slow enemies near mountain
        const zone = this.scene.add.zone(worldX, worldY, symbol.width, symbol.height);
        this.scene.physics.world.enable(zone);
        zone.body.setAllowGravity(false);
        zone.body.moves = false;
        
        this.residueEffects.push({ type: 'mountain', visual: mountain, zone, duration: 60000 });
    }
    
    createResidueRiver(symbol) {
        // Creates flow that pushes entities
        const worldX = symbol.data.originX;
        const worldY = symbol.data.originY;
        const vx = symbol.data.velocityX * 0.3;
        const vy = symbol.data.velocityY * 0.3;
        
        // Visual: flowing line
        const river = this.scene.add.graphics();
        river.lineStyle(symbol.width, symbol.color, 0.5);
        river.beginPath();
        river.moveTo(worldX, worldY);
        river.lineTo(worldX + vx * 5, worldY + vy * 5);
        river.strokePath();
        
        this.scene.tweens.add({
            targets: river,
            alpha: 0,
            duration: 45000,
            onComplete: () => river.destroy()
        });
        
        this.residueEffects.push({ 
            type: 'river', 
            visual: river, 
            x: worldX, 
            y: worldY, 
            vx, 
            vy, 
            duration: 45000 
        });
    }
    
    createResidueLightning(symbol) {
        // Creates temporal instability zone (slow time)
        const worldX = symbol.data.x;
        const worldY = symbol.data.y;
        
        // Visual: crackling energy
        const energy = this.scene.add.circle(worldX, worldY, 80, symbol.color, 0.3);
        energy.setDepth(2);
        
        // Pulse animation
        this.scene.tweens.add({
            targets: energy,
            scale: 1.2,
            alpha: 0.1,
            duration: 1000,
            repeat: 5,
            yoyo: true,
            onComplete: () => energy.destroy()
        });
        
        // Gameplay: bullets slow in this zone
        this.residueEffects.push({
            type: 'lightning',
            visual: energy,
            x: worldX,
            y: worldY,
            radius: 80,
            effect: 'slow_time',
            duration: 5000
        });
    }
    
    createResidueChasm(symbol) {
        // Creates dangerous void zone
        const worldX = symbol.data.x;
        const worldY = symbol.data.y;
        
        // Visual: swirling void
        const chasm = this.scene.add.circle(worldX, worldY, symbol.radius, symbol.color, 0.6);
        chasm.setDepth(1);
        
        this.scene.tweens.add({
            targets: chasm,
            scale: 0,
            alpha: 0,
            duration: 30000,
            ease: 'Power2',
            onComplete: () => chasm.destroy()
        });
        
        this.residueEffects.push({
            type: 'chasm',
            visual: chasm,
            x: worldX,
            y: worldY,
            radius: symbol.radius,
            effect: 'damage_over_time',
            duration: 30000
        });
    }
    
    createResidueAurora(symbol) {
        // Creates power-up regeneration zone
        const worldX = symbol.data.x;
        const worldY = symbol.data.y;
        
        // Visual: glowing aura
        const aura = this.scene.add.circle(worldX, worldY, symbol.radius, symbol.color, 0.4);
        aura.setDepth(1);
        
        this.scene.tweens.add({
            targets: aura,
            alpha: 0,
            scale: 1.5,
            duration: 40000,
            onComplete: () => aura.destroy()
        });
        
        this.residueEffects.push({
            type: 'aurora',
            visual: aura,
            x: worldX,
            y: worldY,
            radius: symbol.radius,
            effect: 'power_regen',
            duration: 40000
        });
    }
    
    createResiduePath(symbol) {
        // Creates speed boost along traveled paths
        if (!symbol.data.samples || symbol.data.samples.length < 2) return;
        
        symbol.data.samples.forEach((point, i) => {
            if (i % 2 !== 0) return;
            
            const marker = this.scene.add.circle(point.x, point.y, 8, symbol.color, 0.5);
            marker.setDepth(1);
            
            this.scene.tweens.add({
                targets: marker,
                alpha: 0,
                duration: 20000,
                delay: i * 100,
                onComplete: () => marker.destroy()
            });
        });
    }
    
    createResidueCrystal(symbol) {
        // Creates score multiplier zone
        const worldX = symbol.data.x;
        const worldY = symbol.data.y;
        
        // Visual: crystal shard
        const crystal = this.scene.add.rectangle(worldX, worldY, 20, symbol.height, symbol.color, 0.6);
        crystal.setDepth(2);
        
        this.scene.tweens.add({
            targets: crystal,
            alpha: 0,
            y: worldY - 50,
            duration: 30000,
            onComplete: () => crystal.destroy()
        });
        
        this.residueEffects.push({
            type: 'crystal',
            visual: crystal,
            x: worldX,
            y: worldY,
            height: symbol.height,
            effect: 'score_multiplier',
            multiplier: 1 + symbol.height / 100,
            duration: 30000
        });
    }
    
    showResidueNotification() {
        const notification = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            'THE DREAM LEAVES RESIDUE',
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fill: '#4b0082',
                stroke: '#00d4ff',
                strokeThickness: 2
            }
        ).setOrigin(0.5);
        notification.setScrollFactor(0);
        notification.setDepth(300);
        
        this.scene.tweens.add({
            targets: notification,
            alpha: 0,
            y: notification.y - 50,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => notification.destroy()
        });
    }
    
    // ===== UTILITY =====
    
    normalizeX(x) {
        // Convert world X to screen X
        const camera = this.scene.cameras.main;
        return (x - camera.scrollX) * camera.zoom;
    }
    
    normalizeY(y) {
        // Convert world Y to screen Y
        const camera = this.scene.cameras.main;
        return (y - camera.scrollY) * camera.zoom;
    }
    
    // ===== PERSISTENCE =====
    
    archiveDream() {
        const dream = {
            timestamp: Date.now(),
            type: this.dreamState.dreamType,
            intensity: this.dreamState.dreamIntensity,
            symbols: this.dreamState.currentSymbols.length,
            data: {
                kills: this.symbolicMemory.killLocations.length,
                bullets: this.symbolicMemory.bulletPatterns.length,
                nearMisses: this.symbolicMemory.nearMissEvents.length,
                deaths: this.symbolicMemory.deathLocations.length,
                echoes: this.symbolicMemory.echoAbsorptions.length,
                systems: this.symbolicMemory.systemActivations.length
            }
        };
        
        this.dreamArchive.unshift(dream);
        
        if (this.dreamArchive.length > this.maxArchivedDreams) {
            this.dreamArchive = this.dreamArchive.slice(0, this.maxArchivedDreams);
        }
        
        this.saveDreamArchive();
    }
    
    saveDreamArchive() {
        try {
            localStorage.setItem('shooty_dream_archive', JSON.stringify(this.dreamArchive));
        } catch (e) {
            console.log('Could not save dream archive:', e);
        }
    }
    
    loadDreamArchive() {
        try {
            const saved = localStorage.getItem('shooty_dream_archive');
            if (saved) {
                this.dreamArchive = JSON.parse(saved);
            }
        } catch (e) {
            console.log('Could not load dream archive:', e);
        }
    }
    
    // ===== PUBLIC API =====
    
    isDreaming() {
        return this.dreamState.isDreaming;
    }
    
    getDreamType() {
        return this.dreamState.dreamType;
    }
    
    getDreamIntensity() {
        return this.dreamState.dreamIntensity;
    }
    
    getDreamArchive() {
        return this.dreamArchive;
    }
    
    getLucidity() {
        return this.dreamState.lucidity;
    }
    
    getResidueEffects() {
        return this.residueEffects.filter(r => r.duration > 0);
    }
    
    updateResidue(delta) {
        // Update residue effect durations
        this.residueEffects = this.residueEffects.filter(effect => {
            effect.duration -= delta;
            
            // Apply active effects
            if (effect.duration > 0) {
                this.applyResidueEffect(effect);
            } else {
                if (effect.visual && effect.visual.active) {
                    effect.visual.destroy();
                }
                if (effect.zone) {
                    effect.zone.destroy();
                }
            }
            
            return effect.duration > 0;
        });
    }
    
    applyResidueEffect(effect) {
        // Check if player is in effect zone
        if (!this.scene.player?.active) return;
        
        const player = this.scene.player;
        const dist = Phaser.Math.Distance.Between(player.x, player.y, effect.x, effect.y);
        
        switch (effect.effect) {
            case 'slow_time':
                if (dist < effect.radius) {
                    // Slow time for bullets near player
                    this.scene.physics.world.timeScale = 0.5;
                    this.scene.time.delayedCall(100, () => {
                        this.scene.physics.world.timeScale = 1;
                    });
                }
                break;
                
            case 'power_regen':
                if (dist < effect.radius) {
                    // Visual indicator only — actual regen handled by other systems
                    if (Math.random() < 0.05) {
                        this.scene.hitParticles.emitParticleAt(player.x, player.y);
                    }
                }
                break;
                
            case 'score_multiplier':
                if (dist < 50) {
                    // Score multiplier active in zone
                    if (!this._multiplierActive) {
                        this._multiplierActive = true;
                        this._originalMultiplier = this.scene.scoreMultiplier || 1;
                        this.scene.scoreMultiplier = (this._originalMultiplier || 1) * effect.multiplier;
                    }
                } else {
                    if (this._multiplierActive) {
                        this.scene.scoreMultiplier = this._originalMultiplier || 1;
                        this._multiplierActive = false;
                    }
                }
                break;
        }
    }
    
    update(time, delta) {
        // Main update loop called by GameScene
        if (this.dreamState.isDreaming) {
            // Dream is handled by dreamUpdateEvent
        } else {
            // Update residue effects
            this.updateResidue(delta);
        }
    }
}
