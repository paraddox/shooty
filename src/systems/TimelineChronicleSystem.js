import Phaser from 'phaser';

/**
 * Timeline Chronicle System — The Museum of Your Failures and Triumphs
 * 
 * Every run creates a permanent "Timeline Shard" — a crystallized visual record
 * of your path, bullets, near-misses, and death. These shards:
 * 
 * 1. ACCUMULATE: The main menu background becomes a constellation of all your runs
 * 2. EQUIPPABLE: Before each run, choose up to 3 shards to carry — each grants
 *    bonuses based on that run's characteristics
 * 3. RESONATE: Certain shard combinations create harmonic synergies
 * 4. REMEMBER: A complete browseable history of every run you've ever played
 * 
 * This transforms isolated attempts into a living legacy. You are literally
 * building a monument to your persistence.
 * 
 * Color: Each shard glows with colors derived from that run's dominant system:
 *   - Gold (#ffd700): Paradox-heavy runs
 *   - Cyan (#00f0ff): Echo storm specialists  
 *   - Purple (#9d4edd): Void coherence masters
 *   - Red (#ff3366): Aggressive risk-takers
 *   - White (#ffffff): Balanced play
 * 
 * Integration:
 *   - Observer Effect provides the behavioral analysis for shard properties
 *   - Void Coherence creates the crystalline visual aesthetic
 *   - Quantum Immortality determines shard "persistence" quality
 *   - Resonance Cascade patterns determine shard compatibility
 */

export default class TimelineChronicleSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== RUN DATA COLLECTION =====
        this.currentRun = {
            startTime: Date.now(),
            events: [],           // Position, velocity, action snapshots
            bulletPaths: [],      // All bullets fired
            nearMisses: [],       // Grazing moments
            deaths: [],           // Where you died
            systemsUsed: {},      // Count of each temporal system
            finalStats: null      // Score, wave, time survived
        };
        
        this.snapshotInterval = 500; // ms between position snapshots
        this.lastSnapshot = 0;
        this.maxEvents = 1000; // Cap to prevent memory issues
        
        // ===== SHARD GENERATION =====
        this.shardConfig = {
            maxBulletsTracked: 200,
            maxPathPoints: 500,
            nearMissWeight: 3.0,  // Near misses are more significant
            deathWeight: 5.0      // Deaths are most significant
        };
        
        this.init();
    }
    
    init() {
        this.setupEventCapture();
    }
    
    setupEventCapture() {
        // Capture begins automatically in constructor
        // Systems will call record methods as events happen
    }
    
    // ===== EVENT RECORDING METHODS =====
    // Called by GameScene and other systems to record significant moments
    
    recordPosition(x, y, velocity, time) {
        if (time - this.lastSnapshot < this.snapshotInterval) return;
        
        this.currentRun.events.push({
            type: 'position',
            x, y,
            vx: velocity.x,
            vy: velocity.y,
            timestamp: time
        });
        
        this.lastSnapshot = time;
        
        // Trim if too large
        if (this.currentRun.events.length > this.maxEvents) {
            // Keep every other event to maintain rough shape
            this.currentRun.events = this.currentRun.events.filter((_, i) => i % 2 === 0);
        }
    }
    
    recordBulletFired(x, y, angle, speed, isPlayer) {
        if (this.currentRun.bulletPaths.length >= this.shardConfig.maxBulletsTracked) return;
        
        this.currentRun.bulletPaths.push({
            x, y, angle, speed, isPlayer,
            timestamp: this.scene.time.now
        });
    }
    
    recordNearMiss(x, y, bulletX, bulletY, wasGrazing) {
        this.currentRun.nearMisses.push({
            playerX: x,
            playerY: y,
            bulletX,
            bulletY,
            wasGrazing,
            timestamp: this.scene.time.now
        });
    }
    
    recordDeath(x, y, cause) {
        this.currentRun.deaths.push({
            x, y, cause,
            timestamp: this.scene.time.now,
            wave: this.scene.wave,
            score: this.scene.score
        });
    }
    
    recordSystemUse(systemName, context = {}) {
        if (!this.currentRun.systemsUsed[systemName]) {
            this.currentRun.systemsUsed[systemName] = { count: 0, contexts: [] };
        }
        
        this.currentRun.systemsUsed[systemName].count++;
        this.currentRun.systemsUsed[systemName].contexts.push({
            timestamp: this.scene.time.now,
            ...context
        });
    }
    
    // ===== SHARD GENERATION =====
    
    generateShard() {
        // Calculate final stats
        const duration = Date.now() - this.currentRun.startTime;
        const dominantSystem = this.calculateDominantSystem();
        const playstyle = this.calculatePlaystyle();
        const shardColor = this.determineShardColor(dominantSystem, playstyle);
        
        const shard = {
            id: this.generateShardId(),
            created: Date.now(),
            duration,
            score: this.scene.score || 0,
            wave: this.scene.wave || 1,
            deaths: this.currentRun.deaths.length,
            
            // Visual data
            pathData: this.compressPathData(),
            bulletData: this.compressBulletData(),
            nearMissHighlights: this.currentRun.nearMisses.slice(-10),
            deathLocation: this.currentRun.deaths.length > 0 
                ? this.currentRun.deaths[this.currentRun.deaths.length - 1] 
                : null,
            
            // Properties for equippable bonuses
            dominantSystem,
            playstyle,
            shardColor,
            rarity: this.calculateRarity(),
            
            // Bonuses this shard grants
            bonuses: this.generateBonuses(dominantSystem, playstyle),
            
            // Metadata for resonance
            tags: this.generateTags(),
            
            // Raw data (for debugging/analysis)
            raw: {
                eventCount: this.currentRun.events.length,
                bulletCount: this.currentRun.bulletPaths.length,
                nearMissCount: this.currentRun.nearMisses.length,
                systemsUsed: this.currentRun.systemsUsed
            }
        };
        
        return shard;
    }
    
    compressPathData() {
        // Simplify path to key points for visualization
        const events = this.currentRun.events.filter(e => e.type === 'position');
        if (events.length === 0) return [];
        
        // Douglas-Peucker-like simplification
        const simplified = [];
        let lastAdded = events[0];
        simplified.push({ x: lastAdded.x, y: lastAdded.y, t: lastAdded.timestamp });
        
        for (let i = 1; i < events.length; i++) {
            const current = events[i];
            const dist = Phaser.Math.Distance.Between(lastAdded.x, lastAdded.y, current.x, current.y);
            
            // Add point if far enough or significant direction change
            if (dist > 50 || i === events.length - 1) {
                simplified.push({ x: current.x, y: current.y, t: current.timestamp });
                lastAdded = current;
            }
        }
        
        return simplified.slice(0, this.shardConfig.maxPathPoints);
    }
    
    compressBulletData() {
        // Group bullets into "salvos" for visualization
        const bullets = this.currentRun.bulletPaths;
        if (bullets.length === 0) return [];
        
        const salvoGroups = [];
        let currentSalvo = [bullets[0]];
        
        for (let i = 1; i < bullets.length; i++) {
            const timeDiff = bullets[i].timestamp - bullets[i-1].timestamp;
            
            if (timeDiff < 200) {
                // Same salvo
                currentSalvo.push(bullets[i]);
            } else {
                // New salvo
                salvoGroups.push({
                    x: currentSalvo[0].x,
                    y: currentSalvo[0].y,
                    count: currentSalvo.length,
                    isPlayer: currentSalvo[0].isPlayer,
                    timestamp: currentSalvo[0].timestamp
                });
                currentSalvo = [bullets[i]];
            }
        }
        
        // Add final salvo
        salvoGroups.push({
            x: currentSalvo[0].x,
            y: currentSalvo[0].y,
            count: currentSalvo.length,
            isPlayer: currentSalvo[0].isPlayer,
            timestamp: currentSalvo[0].timestamp
        });
        
        return salvoGroups.slice(0, 50);
    }
    
    calculateDominantSystem() {
        const systems = this.currentRun.systemsUsed;
        let maxCount = 0;
        let dominant = 'none';
        
        for (const [name, data] of Object.entries(systems)) {
            if (data.count > maxCount) {
                maxCount = data.count;
                dominant = name;
            }
        }
        
        return dominant;
    }
    
    calculatePlaystyle() {
        const nm = this.currentRun.nearMisses.length;
        const deaths = this.currentRun.deaths.length;
        const bullets = this.currentRun.bulletPaths.length;
        
        if (deaths === 0 && nm > 20) return 'dancer';
        if (bullets > 500 && nm < 10) return 'turret';
        if (deaths > 3) return 'persistent';
        if (nm > 30) return 'grazer';
        if (this.currentRun.systemsUsed.paradox?.count > 5) return 'oracle';
        if (this.currentRun.systemsUsed.chronoLoop?.count > 3) return 'timebinder';
        
        return 'balanced';
    }
    
    determineShardColor(dominantSystem, playstyle) {
        // Color based on dominant system, modified by playstyle
        const baseColors = {
            none: 0xffffff,
            bulletTime: 0xffd700,
            echoStorm: 0x00f0ff,
            fracture: 0xff6600,
            paradox: 0xffd700,
            chronoLoop: 0x008080,
            quantum: 0xffffff,
            voidCoherence: 0x9d4edd,
            resonance: 0xff00ff,
            observer: 0x00d4ff
        };
        
        const playstyleShifts = {
            dancer: 0xff66aa,
            turret: 0xff4444,
            persistent: 0x44ff44,
            grazer: 0xffaa00,
            oracle: 0xaa00ff,
            timebinder: 0x00aaaa,
            balanced: 0xaaaaaa
        };
        
        const base = baseColors[dominantSystem] || 0xffffff;
        const shift = playstyleShifts[playstyle] || 0xaaaaaa;
        
        // Blend colors
        const r = ((base >> 16) & 0xff) * 0.7 + ((shift >> 16) & 0xff) * 0.3;
        const g = ((base >> 8) & 0xff) * 0.7 + ((shift >> 8) & 0xff) * 0.3;
        const b = (base & 0xff) * 0.7 + (shift & 0xff) * 0.3;
        
        return (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
    }
    
    calculateRarity() {
        const score = this.scene.score || 0;
        const wave = this.scene.wave || 1;
        const systems = Object.keys(this.currentRun.systemsUsed).length;
        
        if (wave >= 10 && score > 5000) return 'mythic';
        if (wave >= 7 && systems >= 5) return 'legendary';
        if (wave >= 5) return 'epic';
        if (systems >= 3) return 'rare';
        return 'common';
    }
    
    generateBonuses(dominantSystem, playstyle) {
        const bonuses = [];
        
        // Base bonus from dominant system
        const systemBonuses = {
            bulletTime: { type: 'bulletTime', name: 'Extended Flow', value: 0.3, desc: '+30% bullet time duration' },
            echoStorm: { type: 'echoStorm', name: 'Echo Resonance', value: 0.25, desc: '+25% echo absorption range' },
            paradox: { type: 'paradox', name: 'Clear Sight', value: 0.2, desc: '+20% prediction accuracy' },
            chronoLoop: { type: 'chronoLoop', name: 'Bound Time', value: 2, desc: '+2s loop duration' },
            quantum: { type: 'quantum', name: 'Many Worlds', value: 1, desc: '+1 quantum echo' },
            voidCoherence: { type: 'void', name: 'Void Touched', value: 0.3, desc: '+30% void coherence gain' },
            none: { type: 'general', name: 'Stubborn Will', value: 0.1, desc: '+10% score gain' }
        };
        
        bonuses.push(systemBonuses[dominantSystem] || systemBonuses.none);
        
        // Secondary bonus from playstyle
        const styleBonuses = {
            dancer: { type: 'movement', name: 'Grace', value: 15, desc: '+15% movement speed' },
            turret: { type: 'combat', name: 'Focus Fire', value: 0.15, desc: '+15% fire rate' },
            persistent: { type: 'defense', name: 'Resilience', value: 20, desc: '+20 max health' },
            grazer: { type: 'risk', name: 'Edge Walker', value: 0.2, desc: 'Near misses grant +20% damage for 3s' },
            oracle: { type: 'paradox', name: 'Future Sight', value: 0.5, desc: '+0.5s prediction horizon' },
            timebinder: { type: 'temporal', name: 'Temporal Anchor', value: 0.15, desc: '+15% temporal system efficiency' },
            balanced: { type: 'general', name: 'Versatility', value: 0.08, desc: '+8% all stats' }
        };
        
        bonuses.push(styleBonuses[playstyle] || styleBonuses.balanced);
        
        return bonuses;
    }
    
    generateTags() {
        const tags = [];
        
        if (this.currentRun.nearMisses.length > 20) tags.push('grazer');
        if (this.currentRun.deaths.length === 0) tags.push('flawless');
        if (Object.keys(this.currentRun.systemsUsed).length >= 4) tags.push('synthesist');
        if (this.currentRun.bulletPaths.length > 300) tags.push('volley');
        if (this.currentRun.duration > 300000) tags.push('marathon'); // 5+ minutes
        
        return tags;
    }
    
    generateShardId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 4);
        return `shard_${timestamp}_${random}`;
    }
    
    // ===== PERSISTENCE =====
    
    finalizeAndSave() {
        const shard = this.generateShard();
        
        // Load existing chronicle
        const chronicle = this.loadChronicle();
        
        // Add new shard
        chronicle.shards.push(shard);
        
        // Update stats
        chronicle.totalRuns++;
        chronicle.totalScore += shard.score;
        chronicle.highestWave = Math.max(chronicle.highestWave, shard.wave);
        
        if (shard.rarity === 'mythic') chronicle.mythicShards++;
        else if (shard.rarity === 'legendary') chronicle.legendaryShards++;
        
        // Save
        this.saveChronicle(chronicle);
        
        return shard;
    }
    
    /**
     * Add a Kairos Moment shard — a crystallized perfect moment of flow
     * These are premium shards that grant unique bonuses
     */
    addKairosShard(kairosData) {
        // Load existing chronicle
        const chronicle = this.loadChronicle();
        
        // Create special Kairos shard
        const kairosShard = {
            id: kairosData.id,
            type: 'KAIROS',
            shardName: kairosData.shardName,
            shardColor: kairosData.shardColor || 0xfff8e7,
            timestamp: kairosData.timestamp,
            
            // Flow metrics
            flowScore: kairosData.flowScore,
            peakFlowScore: kairosData.peakFlowScore,
            kairosDuration: kairosData.kairosDuration,
            
            // Game state at crystallization
            score: kairosData.score,
            wave: kairosData.wave,
            health: kairosData.health,
            
            // Playstyle classification
            playstyle: kairosData.playstyle || 'Flowwalker',
            
            // System bonuses — Kairos shards grant stronger bonuses
            bonuses: this.generateKairosBonuses(kairosData),
            
            // Rarity — all Kairos shards are at least Legendary
            rarity: kairosData.flowScore >= 95 ? 'mythic' : 'legendary',
            
            // Path signature for visualization
            pathSignature: kairosData.pathSignature
        };
        
        // Add to chronicle
        chronicle.shards.push(kairosShard);
        
        // Update special counters
        if (kairosShard.rarity === 'mythic') chronicle.mythicShards++;
        else chronicle.legendaryShards++;
        
        // Save
        this.saveChronicle(chronicle);
        
        return kairosShard;
    }
    
    /**
     * Generate bonuses specific to Kairos shards — stronger than normal
     */
    generateKairosBonuses(kairosData) {
        const bonuses = [];
        const flow = kairosData.flowScore;
        
        // Base bonus based on playstyle
        const playstyleBonuses = {
            'Daredevil': { type: 'combat', value: 0.25, desc: '+25% damage during bullet time' },
            'Synthesist': { type: 'general', value: 0.30, desc: '+30% score from system chains' },
            'Temporalist': { type: 'bulletTime', value: 0.35, desc: '+35% bullet time duration' },
            'Dancer': { type: 'movement', value: 15, desc: '+15% movement speed' },
            'Conqueror': { type: 'combat', value: 0.20, desc: '+20% all damage' },
            'Flowwalker': { type: 'general', value: 0.20, desc: '+20% all score' }
        };
        
        const baseBonus = playstyleBonuses[kairosData.playstyle] || playstyleBonuses['Flowwalker'];
        
        // Scale bonus by flow score
        const scaledValue = baseBonus.value * (0.8 + flow / 100 * 0.4);
        bonuses.push({
            ...baseBonus,
            value: scaledValue
        });
        
        // Additional bonus for very high flow
        if (flow >= 95) {
            bonuses.push({
                type: 'defense',
                value: 25,
                desc: '+25 max health from perfect flow'
            });
        }
        
        return bonuses;
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
            equippedShards: [], // IDs of currently equipped shards
            resonantHarmonies: [] // Discovered combinations
        };
    }
    
    saveChronicle(chronicle) {
        try {
            localStorage.setItem('shooty_chronicle_v1', JSON.stringify(chronicle));
        } catch (e) {
            console.warn('Failed to save chronicle:', e);
        }
    }
    
    // ===== UTILITY METHODS =====
    
    getEquippedShards() {
        const chronicle = this.loadChronicle();
        return chronicle.shards.filter(s => chronicle.equippedShards.includes(s.id));
    }
    
    equipShards(shardIds) {
        const chronicle = this.loadChronicle();
        chronicle.equippedShards = shardIds.slice(0, 3); // Max 3
        this.saveChronicle(chronicle);
    }
    
    checkResonantHarmony(equippedShards) {
        // Check if equipped shards create a resonance
        if (equippedShards.length < 2) return null;
        
        const systems = equippedShards.map(s => s.dominantSystem);
        const playstyles = equippedShards.map(s => s.playstyle);
        
        // System resonance: 3 different systems
        if (new Set(systems).size === 3) {
            return {
                name: 'Temporal Trinity',
                desc: 'All temporal systems recharge 25% faster',
                bonus: { type: 'recharge', value: 0.25 }
            };
        }
        
        // Playstyle resonance: all same playstyle
        if (new Set(playstyles).size === 1 && equippedShards.length === 3) {
            return {
                name: 'Pure Form',
                desc: `${playstyles[0]} bonuses doubled`,
                bonus: { type: 'double_style', value: playstyles[0] }
            };
        }
        
        // Opposites attract: grazer + turret
        if (playstyles.includes('grazer') && playstyles.includes('turret')) {
            return {
                name: 'Controlled Chaos',
                desc: 'Bullets home slightly while stationary',
                bonus: { type: 'micro_homing', value: 0.15 }
            };
        }
        
        return null;
    }
    
    // Update called by GameScene
    update() {
        if (this.scene.player && this.scene.player.active) {
            this.recordPosition(
                this.scene.player.x,
                this.scene.player.y,
                this.scene.player.body.velocity,
                this.scene.time.now
            );
        }
    }
}
