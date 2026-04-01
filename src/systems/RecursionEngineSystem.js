import Phaser from 'phaser';

/**
 * Recursion Engine — The Game That Becomes You
 * 
 * The ultimate adversarial mirror. Not content with simply recording your position
 * (Chrono-Loop) or mimicking your stats (Nemesis Genesis), the Recursion Engine
 * analyzes your BEHAVIORAL SIGNATURE — how you move, when you shoot, where you
 * position, how you react under pressure — and EVOLVES THE ENTIRE GAME to match it.
 * 
 * === THE CORE INNOVATION ===
 * 
 * This creates a RECURSIVE FEEDBACK LOOP:
 * 
 * 1. You play your natural way — aggressive, defensive, erratic, methodical
 * 2. The Recursion Engine builds a "Behavioral Genome" — a compressed representation
 *    of your decision-making patterns
 * 3. This genome infects all enemies, the world itself, even the UI
 * 4. You face an ecosystem that thinks, acts, and fights exactly like you do
 * 5. To win, you must EVOLVE — change your playstyle to defeat your own habits
 * 6. But as you change, the Recursion Engine adapts...
 * 
 * This is the Ouroboros of gameplay — the snake eating its own tail, forever.
 * 
 * === THE BEHAVIORAL GENOME ===
 * 
 * The engine tracks 7 behavioral axes:
 * 
 * 1. AGGRESSION (0-1): Frequency of movement vs stationary positioning
 *    - Low: Camp-and-shoot player → Enemies become patient ambush predators
 *    - High: Constant motion → Enemies become relentless hunters
 * 
 * 2. PRECISION (0-1): Accuracy of shots, movement efficiency
 *    - Low: Spray-and-pray → Enemies use area-denial, saturation attacks
 *    - High: Surgical strikes → Enemies use precision, weak-point targeting
 * 
 * 3. REACTIVITY (0-1): Response time to threats, predictive vs reactive
 *    - Low: Planned movements → Enemies telegraph attacks, force commitment
 *    - High: Improvisation → Enemies feint, bait, use misdirection
 * 
 * 4. RISK_TOLERANCE (0-1): Near-miss frequency, health management
 *    - Low: Conservative → Enemies punish hesitation, reward boldness
 *    - High: Daredevil → Enemies create complex traps requiring precision
 * 
 * 5. RHYTHM (0-1): Pattern recognition in player movement timing
 *    - Extracts the "beat" of your play — do you pause every 2 seconds? 3?
 *    - Enemies sync to YOUR rhythm, attacking at your vulnerable moments
 * 
 * 6. SPATIAL_PREFERENCE (vector): Where you like to position (corners, center, edges)
 *    - Enemies control your preferred zones, force you into uncomfortable spaces
 * 
 * 7. SYSTEM_SYNTHESIS (0-1): How well you combine temporal systems
 *    - Low: Straight shooter → Enemies use base patterns only
 *    - High: System master → Enemies "use" temporal mechanics against you
 * 
 * === THE INFECTION MECHANIC ===
 * 
 * The genome doesn't just sit in data — it MANIFESTS:
 * 
 * 1. ENEMY_BEHAVIOR: Each enemy type adopts a facet of your genome
 *    - Chasers adopt your movement patterns
 *    - Shooters adopt your firing rhythms
 *    - Tanks adopt your positioning preferences
 * 
 * 2. WORLD_MORPHOLOGY: The arena changes to challenge your habits
 *    - Like corners? Suddenly corners have trap zones
 *    - Prefer open space? The center becomes dangerous
 *    - Always dodge left? Bullet patterns anticipate this
 * 
 * 3. THE_RECURSION_LORD: At wave 8, a boss spawns that is the PURE MANIFESTATION
 *    of your current behavioral genome — it IS you, perfectly replicated
 *    - Uses your movement patterns
 *    - Shoots with your timing
 *    - Anticipates your anticipation
 *    - The ultimate mirror match
 * 
 * === THE ADAPTATION CYCLE ===
 * 
 * Wave 1-2: Learning Phase — Genome builds from observation
 * Wave 3-4: First Infection — Enemies show behavioral shifts
 * Wave 5-6: Deep Recursion — World adapts, patterns emerge
 * Wave 7: Crisis Point — You're fighting yourself completely
 * Wave 8: The Recursion Lord — Pure genome manifestation
 * Wave 9+: Meta-Recursion — Engine detects you're trying to "game" it
 * 
 * === THE META-GAME ===
 * 
 * The Recursion Engine creates a unique psychological challenge:
 * 
 * You cannot simply "get good" at patterns — you must DETECT and BREAK your own
 * unconscious habits. The game becomes a tool for self-awareness:
 * 
 * - "I always dodge left when scared" → The engine knows. It waits left.
 * - "I reload after exactly 6 shots" → Enemies attack at shot 7.
 * - "I need 2 seconds to reorient after a near-miss" → Attacks come at 2.1s.
 * 
 * To defeat the Recursion Engine, you must become aware of your own programming
 * and consciously evolve beyond it. The game is a meditation on free will.
 * 
 * === THE SELF-AWARENESS METER ===
 * 
 * The engine tracks how much you've "changed" between runs:
 * - If you play identically → Recursion Strength increases
 * - If you deliberately vary → Recursion Strength decreases
 * - High awareness = bonus rewards, lower difficulty
 * - Low awareness = harder game, but "authentic" to your nature
 * 
 * === SYNERGIES ===
 * 
 * - Nemesis Genesis: Provides the "who", Recursion Engine provides the "how"
 * - Chrono-Loop: Your past literally fights you, genome determines its tactics
 * - Egregore Protocol: Combines with Recursion for collective behavioral evolution
 * - Symbiotic Prediction: The AI is now predicting itself predicting you
 * - Observer Effect: The ultimate observer — you watching yourself
 * - Mnemosyne Weave: Visit past runs and see how your genome has evolved
 * - Timeline Chronicle: Compare your behavioral genome across all runs
 * 
 * Color: Recursive Cyan — a color that seems to contain itself
 * 
 * This is the final boss of all roguelike design: a game that truly, deeply,
 * completely knows you — and forces you to know yourself.
 */

export default class RecursionEngineSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== BEHAVIORAL GENOME =====
        this.genome = this.initializeGenome();
        this.genomeHistory = this.loadGenomeHistory();
        this.sampleWindow = 5000; // ms of behavior to sample
        this.samples = [];
        
        // ===== BEHAVIORAL AXES =====
        this.axes = {
            aggression: { current: 0.5, target: 0.5, samples: [] },
            precision: { current: 0.5, target: 0.5, samples: [] },
            reactivity: { current: 0.5, target: 0.5, samples: [] },
            riskTolerance: { current: 0.5, target: 0.5, samples: [] },
            rhythm: { current: 0.5, target: 0.5, samples: [], pattern: [] },
            spatialPreference: { current: { x: 0.5, y: 0.5 }, samples: [] },
            systemSynthesis: { current: 0.5, target: 0.5, samples: [] }
        };
        
        // ===== INFECTION STATE =====
        this.infectionLevel = 0; // 0-1, how much genome has manifested
        this.infectionRate = 0.08; // How fast infection spreads per wave
        this.recursionDepth = 0; // How many layers deep the recursion goes
        
        // ===== TRACKING STATE =====
        this.lastPosition = { x: 0, y: 0 };
        this.lastShotTime = 0;
        this.shotsFired = 0;
        this.hitsLanded = 0;
        this.movementSamples = [];
        this.positionHistory = [];
        this.systemActivationLog = [];
        this.nearMissTimes = [];
        
        // ===== WORLD MORPHOLOGY =====
        this.dangerZones = []; // Areas that become dangerous based on preference
        this.playerHotspots = []; // Where player spends most time
        this.adaptedPatterns = []; // Bullet patterns that counter player habits
        
        // ===== RECURSION LORD =====
        this.recursionLord = null;
        this.lordSpawned = false;
        this.lordWave = 8;
        
        // ===== META-AWARENESS =====
        this.selfAwarenessScore = 0;
        this.behavioralVariance = 0; // How much player varies their play
        this.lastRunGenome = null; // For comparing evolution
        
        // ===== VISUALS =====
        this.recursionOverlay = null;
        this.genomeVisualizer = null;
        
        // Start tracking
        this.startTracking();
    }
    
    initializeGenome() {
        return {
            generation: 1,
            timestamp: Date.now(),
            axes: {},
            fingerprint: null, // Unique hash of behavioral signature
            evolutionDelta: 0 // How much changed from last run
        };
    }
    
    loadGenomeHistory() {
        try {
            const saved = localStorage.getItem('shooty_recursion_genomes');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load genome history:', e);
        }
        return [];
    }
    
    saveGenome() {
        // Finalize genome
        this.genome.axes = {
            aggression: this.axes.aggression.current,
            precision: this.axes.precision.current,
            reactivity: this.axes.reactivity.current,
            riskTolerance: this.axes.riskTolerance.current,
            rhythm: this.axes.rhythm.current,
            spatialPreference: this.axes.spatialPreference.current,
            systemSynthesis: this.axes.systemSynthesis.current
        };
        
        // Generate fingerprint
        this.genome.fingerprint = this.generateFingerprint();
        
        // Calculate evolution from last run
        if (this.genomeHistory.length > 0) {
            const lastGenome = this.genomeHistory[this.genomeHistory.length - 1];
            this.genome.evolutionDelta = this.calculateGenomeDelta(lastGenome, this.genome);
        }
        
        // Save to history
        this.genomeHistory.push({ ...this.genome });
        if (this.genomeHistory.length > 10) {
            this.genomeHistory.shift(); // Keep last 10
        }
        
        try {
            localStorage.setItem('shooty_recursion_genomes', JSON.stringify(this.genomeHistory));
        } catch (e) {
            console.warn('Failed to save genome:', e);
        }
    }
    
    generateFingerprint() {
        // Create unique hash from behavioral signature
        const sig = [
            Math.round(this.axes.aggression.current * 100),
            Math.round(this.axes.precision.current * 100),
            Math.round(this.axes.reactivity.current * 100),
            Math.round(this.axes.riskTolerance.current * 100),
            Math.round(this.axes.rhythm.current * 100),
            Math.round(this.axes.systemSynthesis.current * 100)
        ].join('.');
        
        // Simple hash
        let hash = 0;
        for (let i = 0; i < sig.length; i++) {
            const char = sig.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16).toUpperCase();
    }
    
    calculateGenomeDelta(g1, g2) {
        let delta = 0;
        const axes = ['aggression', 'precision', 'reactivity', 'riskTolerance', 'rhythm', 'systemSynthesis'];
        axes.forEach(axis => {
            delta += Math.abs((g1.axes[axis] || 0.5) - (g2.axes[axis] || 0.5));
        });
        return delta / axes.length; // 0 = identical, 1 = completely different
    }
    
    startTracking() {
        // Sample player behavior every frame
        this.scene.events.on('update', this.sampleBehavior, this);
    }
    
    sampleBehavior(time, delta) {
        if (!this.scene.player || !this.scene.player.active) return;
        
        const player = this.scene.player;
        const now = this.scene.time.now;
        
        // Track position for spatial analysis
        this.positionHistory.push({
            x: player.x,
            y: player.y,
            t: now
        });
        
        // Keep last 10 seconds
        this.positionHistory = this.positionHistory.filter(p => now - p.t < 10000);
        
        // Sample movement (every 100ms)
        if (now % 100 < delta) {
            const dx = player.x - this.lastPosition.x;
            const dy = player.y - this.lastPosition.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            this.movementSamples.push({
                distance: dist,
                time: now,
                velocity: Math.sqrt(player.body.velocity.x ** 2 + player.body.velocity.y ** 2)
            });
            
            // Keep last 5 seconds
            this.movementSamples = this.movementSamples.filter(m => now - m.time < 5000);
            
            this.lastPosition = { x: player.x, y: player.y };
        }
        
        // Update all axes
        this.updateAggression();
        this.updatePrecision();
        this.updateReactivity();
        this.updateRiskTolerance();
        this.updateRhythm();
        this.updateSpatialPreference();
        this.updateSystemSynthesis();
    }
    
    updateAggression() {
        // Movement vs stationary ratio
        const movingSamples = this.movementSamples.filter(m => m.velocity > 10).length;
        const totalSamples = this.movementSamples.length || 1;
        const movingRatio = movingSamples / totalSamples;
        
        // High movement = high aggression
        this.axes.aggression.samples.push(movingRatio);
        if (this.axes.aggression.samples.length > 20) {
            this.axes.aggression.samples.shift();
        }
        
        this.axes.aggression.current = this.average(this.axes.aggression.samples);
    }
    
    updatePrecision() {
        if (this.shotsFired === 0) return;
        
        // Accuracy = hits / shots
        const accuracy = this.hitsLanded / this.shotsFired;
        
        // Movement efficiency = straight-line distance / actual distance
        let efficiency = 0;
        if (this.positionHistory.length > 1) {
            const start = this.positionHistory[0];
            const end = this.positionHistory[this.positionHistory.length - 1];
            const straightDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
            
            let actualDist = 0;
            for (let i = 1; i < this.positionHistory.length; i++) {
                const dx = this.positionHistory[i].x - this.positionHistory[i-1].x;
                const dy = this.positionHistory[i].y - this.positionHistory[i-1].y;
                actualDist += Math.sqrt(dx * dx + dy * dy);
            }
            
            efficiency = actualDist > 0 ? straightDist / actualDist : 0;
        }
        
        // Combine accuracy and efficiency
        const precision = (accuracy * 0.6) + (efficiency * 0.4);
        
        this.axes.precision.samples.push(precision);
        if (this.axes.precision.samples.length > 20) {
            this.axes.precision.samples.shift();
        }
        
        this.axes.precision.current = Math.min(1, Math.max(0, this.average(this.axes.precision.samples)));
    }
    
    updateReactivity() {
        // Analyze near-miss response times
        if (this.nearMissTimes.length < 2) return;
        
        // Calculate average response pattern
        let responseCount = 0;
        let totalResponseTime = 0;
        
        for (let i = 1; i < this.nearMissTimes.length; i++) {
            const responseTime = this.nearMissTimes[i] - this.nearMissTimes[i-1];
            if (responseTime < 2000) { // Reasonable response window
                totalResponseTime += responseTime;
                responseCount++;
            }
        }
        
        if (responseCount > 0) {
            const avgResponse = totalResponseTime / responseCount;
            // Faster response = higher reactivity
            const reactivity = Math.min(1, 500 / avgResponse);
            
            this.axes.reactivity.samples.push(reactivity);
            if (this.axes.reactivity.samples.length > 20) {
                this.axes.reactivity.samples.shift();
            }
            
            this.axes.reactivity.current = this.average(this.axes.reactivity.samples);
        }
    }
    
    updateRiskTolerance() {
        // Based on near-miss frequency and health management
        const nearMissCount = this.nearMissTimes.length;
        const timeWindow = 30000; // 30 seconds
        const now = this.scene.time.now;
        const recentNearMisses = this.nearMissTimes.filter(t => now - t < timeWindow).length;
        
        // More near-misses = higher risk tolerance
        const nearMissRate = Math.min(1, recentNearMisses / 10);
        
        // Health factor (if we had health history, we'd use it)
        const healthFactor = this.scene.player ? (1 - this.scene.player.health / this.scene.player.maxHealth) : 0;
        
        const riskTolerance = (nearMissRate * 0.7) + (healthFactor * 0.3);
        
        this.axes.riskTolerance.samples.push(riskTolerance);
        if (this.axes.riskTolerance.samples.length > 20) {
            this.axes.riskTolerance.samples.shift();
        }
        
        this.axes.riskTolerance.current = this.average(this.axes.riskTolerance.samples);
    }
    
    updateRhythm() {
        // Extract temporal patterns from movement
        if (this.movementSamples.length < 10) return;
        
        // Detect pauses (velocity drops)
        const pauses = [];
        for (let i = 1; i < this.movementSamples.length; i++) {
            if (this.movementSamples[i].velocity < 10 && this.movementSamples[i-1].velocity > 10) {
                pauses.push(this.movementSamples[i].time);
            }
        }
        
        // Calculate rhythm from pause intervals
        if (pauses.length >= 2) {
            const intervals = [];
            for (let i = 1; i < pauses.length; i++) {
                intervals.push(pauses[i] - pauses[i-1]);
            }
            
            // Consistency of intervals = rhythm strength
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const variance = intervals.reduce((sum, int) => sum + Math.abs(int - avgInterval), 0) / intervals.length;
            const consistency = Math.max(0, 1 - (variance / 1000));
            
            this.axes.rhythm.samples.push(consistency);
            if (this.axes.rhythm.samples.length > 20) {
                this.axes.rhythm.samples.shift();
            }
            
            this.axes.rhythm.current = this.average(this.axes.rhythm.samples);
            this.axes.rhythm.pattern = intervals.slice(-3); // Keep last 3 intervals
        }
    }
    
    updateSpatialPreference() {
        if (this.positionHistory.length < 10) return;
        
        // Calculate centroid of position history
        const sumX = this.positionHistory.reduce((sum, p) => sum + p.x, 0);
        const sumY = this.positionHistory.reduce((sum, p) => sum + p.y, 0);
        
        const avgX = sumX / this.positionHistory.length;
        const avgY = sumY / this.positionHistory.length;
        
        // Normalize to 0-1 (world bounds)
        const worldWidth = 1920;
        const worldHeight = 1440;
        
        this.axes.spatialPreference.current = {
            x: avgX / worldWidth,
            y: avgY / worldHeight
        };
    }
    
    updateSystemSynthesis() {
        // Track how many systems are being used together
        // This is called from external system activations
        const now = this.scene.time.now;
        const recentActivations = this.systemActivationLog.filter(a => now - a.time < 10000);
        
        // Unique systems in last 10 seconds
        const uniqueSystems = new Set(recentActivations.map(a => a.system)).size;
        
        // More unique systems = higher synthesis
        const synthesis = Math.min(1, uniqueSystems / 5);
        
        this.axes.systemSynthesis.samples.push(synthesis);
        if (this.axes.systemSynthesis.samples.length > 20) {
            this.axes.systemSynthesis.samples.shift();
        }
        
        this.axes.systemSynthesis.current = this.average(this.axes.systemSynthesis.samples);
    }
    
    // ===== PUBLIC API FOR OTHER SYSTEMS =====
    
    recordShot(accuracy = null) {
        this.shotsFired++;
        this.lastShotTime = this.scene.time.now;
        
        if (accuracy !== null) {
            // accuracy: true if hit, false if miss
            if (accuracy) this.hitsLanded++;
        }
    }
    
    recordHit() {
        this.hitsLanded++;
    }
    
    recordNearMiss() {
        this.nearMissTimes.push(this.scene.time.now);
    }
    
    recordSystemActivation(systemName) {
        this.systemActivationLog.push({
            system: systemName,
            time: this.scene.time.now
        });
        
        // Keep last 60 seconds
        const cutoff = this.scene.time.now - 60000;
        this.systemActivationLog = this.systemActivationLog.filter(a => a.time > cutoff);
    }
    
    // ===== INFECTION MECHANICS =====
    
    advanceWave(waveNumber) {
        // Increase infection level
        this.infectionLevel = Math.min(1, waveNumber * this.infectionRate);
        this.recursionDepth = Math.floor(waveNumber / 3);
        
        // Adapt the world
        this.adaptWorldToGenome();
        
        // Check for Recursion Lord spawn
        if (waveNumber === this.lordWave && !this.lordSpawned) {
            this.spawnRecursionLord();
        }
        
        // Show infection feedback
        this.showInfectionFeedback(waveNumber);
    }
    
    adaptWorldToGenome() {
        // Update danger zones based on spatial preference
        this.updateDangerZones();
        
        // Create adaptive bullet patterns
        this.generateAdaptivePatterns();
    }
    
    updateDangerZones() {
        const pref = this.axes.spatialPreference.current;
        const worldW = 1920;
        const worldH = 1440;
        
        // Player's preferred zone becomes "hot"
        const hotspotX = pref.x * worldW;
        const hotspotY = pref.y * worldH;
        
        this.playerHotspots.push({ x: hotspotX, y: hotspotY, intensity: this.infectionLevel });
        
        // Limit hotspots
        if (this.playerHotspots.length > 3) {
            this.playerHotspots.shift();
        }
        
        // In high infection, these become danger zones
        if (this.infectionLevel > 0.5) {
            this.dangerZones = this.playerHotspots.map(h => ({
                x: h.x,
                y: h.y,
                radius: 150 + (this.infectionLevel * 100),
                damage: this.infectionLevel * 0.1 // Damage per second
            }));
        }
    }
    
    generateAdaptivePatterns() {
        // Create patterns that counter player's rhythm
        const rhythm = this.axes.rhythm;
        if (rhythm.pattern.length > 0) {
            // Predict when player will pause next
            const avgInterval = rhythm.pattern.reduce((a, b) => a + b, 0) / rhythm.pattern.length;
            
            // Pattern attacks at the predicted vulnerable moment
            this.adaptedPatterns.push({
                type: 'rhythm_counter',
                timing: avgInterval,
                intensity: this.infectionLevel
            });
        }
        
        // Counter aggression
        if (this.axes.aggression.current > 0.7) {
            // High aggression = chasing enemies
            this.adaptedPatterns.push({
                type: 'pursuit',
                intensity: this.axes.aggression.current
            });
        } else if (this.axes.aggression.current < 0.3) {
            // Low aggression = ambush predators
            this.adaptedPatterns.push({
                type: 'ambush',
                intensity: 1 - this.axes.aggression.current
            });
        }
    }
    
    // ===== ENEMY BEHAVIOR INJECTION =====
    
    getEnemyModifiers(enemyType) {
        // Return behavior modifiers based on genome and infection level
        const mods = {
            speedMult: 1,
            fireRateMult: 1,
            aggression: 0.5,
            precision: 0.5,
            pattern: 'basic'
        };
        
        if (this.infectionLevel < 0.2) return mods;
        
        // Apply genome-based modifiers
        switch (enemyType) {
            case 'chaser':
                // Adopts player's movement patterns
                mods.speedMult = 0.8 + (this.axes.aggression.current * 0.4);
                mods.aggression = this.axes.aggression.current;
                break;
                
            case 'shooter':
                // Adopts player's firing rhythm
                mods.fireRateMult = 0.7 + (this.axes.rhythm.current * 0.6);
                mods.precision = this.axes.precision.current;
                break;
                
            case 'tank':
                // Adopts player's positioning preference
                mods.aggression = 1 - this.axes.riskTolerance.current;
                break;
                
            default:
                // General infection
                mods.speedMult = 1 + (this.infectionLevel * 0.2);
                mods.aggression = this.axes.aggression.current;
        }
        
        return mods;
    }
    
    getBulletPatternModifiers() {
        // Return pattern modifications based on player habits
        if (this.infectionLevel < 0.3) return null;
        
        const mods = {};
        
        // If player has low reactivity, use faster patterns
        if (this.axes.reactivity.current < 0.4) {
            mods.speedMult = 1.3;
        }
        
        // If player has high precision, use spread patterns
        if (this.axes.precision.current > 0.7) {
            mods.spreadMult = 1.5;
        }
        
        // If player has specific rhythm, sync to it
        if (this.axes.rhythm.current > 0.6 && this.axes.rhythm.pattern.length > 0) {
            mods.rhythmSync = this.axes.rhythm.pattern[0];
        }
        
        return mods;
    }
    
    // ===== RECURSION LORD =====
    
    spawnRecursionLord() {
        this.lordSpawned = true;
        
        // Create the boss at the center
        const x = 960;
        const y = 720;
        
        this.recursionLord = new RecursionLord(this.scene, x, y, this.genome);
        
        // Announce
        this.showLordAnnouncement();
        
        // Boss music/visuals would go here
    }
    
    showLordAnnouncement() {
        const text = this.scene.add.text(960, 500, 
            'THE RECURSION LORD MANIFESTS\n' +
            'You face your perfect reflection.\n' +
            `Genome Fingerprint: ${this.genome.fingerprint}`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            letterSpacing: 2,
            fill: '#00ffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(1000);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 50,
            duration: 8000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    // ===== UI FEEDBACK =====
    
    showInfectionFeedback(waveNumber) {
        const stageNames = ['OBSERVATION', 'ADAPTATION', 'INFECTION', 'RECURSION'];
        const stage = Math.min(3, Math.floor(waveNumber / 2));
        
        const text = this.scene.add.text(this.scene.player.x, this.scene.player.y - 80,
            `WAVE ${waveNumber} — ${stageNames[stage]}\n` +
            `Infection: ${Math.round(this.infectionLevel * 100)}%`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: 1,
            fill: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 4000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    // ===== UTILITIES =====
    
    average(arr) {
        if (arr.length === 0) return 0.5;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    
    getGenomeForDisplay() {
        return {
            fingerprint: this.genome.fingerprint,
            axes: {
                aggression: Math.round(this.axes.aggression.current * 100),
                precision: Math.round(this.axes.precision.current * 100),
                reactivity: Math.round(this.axes.reactivity.current * 100),
                riskTolerance: Math.round(this.axes.riskTolerance.current * 100),
                rhythm: Math.round(this.axes.rhythm.current * 100),
                systemSynthesis: Math.round(this.axes.systemSynthesis.current * 100)
            },
            infectionLevel: Math.round(this.infectionLevel * 100),
            recursionDepth: this.recursionDepth
        };
    }
    
    onGameEnd() {
        this.saveGenome();
    }
}

/**
 * Recursion Lord — The Behavioral Apotheosis
 * 
 * A boss that literally is the player's behavioral genome made manifest.
 * It moves like you, shoots like you, thinks like you.
 */
class RecursionLord extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, genome) {
        super(scene, x, y, 'enemy');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.genome = genome;
        this.axes = genome.axes;
        
        // Stats based on genome
        this.health = 500;
        this.maxHealth = 500;
        this.speed = 200 + (this.axes.aggression * 100);
        
        // Visual
        this.setTint(0x00ffff);
        this.setScale(2);
        
        // Combat
        this.lastMoved = 0;
        this.lastShot = 0;
        this.movePattern = [];
        this.generateMovePattern();
        
        // Rhythm tracking
        this.rhythmIndex = 0;
        this.rhythmInterval = this.axes.rhythm > 0.5 ? 800 : 1200;
        
        // Precision aiming
        this.aimOffset = (1 - this.axes.precision) * 0.3; // Lower precision = more spread
    }
    
    generateMovePattern() {
        // Generate movement pattern based on player's spatial preference
        const prefX = this.axes.spatialPreference?.x || 0.5;
        const prefY = this.axes.spatialPreference?.y || 0.5;
        
        // Generate waypoints that counter player's preference
        const waypoints = [];
        for (let i = 0; i < 8; i++) {
            waypoints.push({
                x: 960 + Math.cos(i * Math.PI / 4) * 300 * (1 - prefX),
                y: 720 + Math.sin(i * Math.PI / 4) * 300 * (1 - prefY)
            });
        }
        
        this.movePattern = waypoints;
        this.currentWaypoint = 0;
    }
    
    update(time, delta) {
        if (!this.active) return;
        
        const player = this.scene.player;
        if (!player || !player.active) return;
        
        // Movement based on aggression
        if (this.axes.aggression > 0.6) {
            // High aggression = chase directly
            this.scene.physics.moveToObject(this, player, this.speed);
        } else if (this.axes.aggression < 0.4) {
            // Low aggression = tactical positioning
            const target = this.movePattern[this.currentWaypoint];
            this.scene.physics.moveTo(this, target.x, target.y, this.speed);
            
            const dist = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
            if (dist < 50) {
                this.currentWaypoint = (this.currentWaypoint + 1) % this.movePattern.length;
            }
        } else {
            // Medium = mix
            const distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (distToPlayer > 400) {
                this.scene.physics.moveToObject(this, player, this.speed);
            } else {
                // Orbit
                const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                const orbitAngle = angle + Math.PI / 4;
                this.setVelocity(
                    Math.cos(orbitAngle) * this.speed,
                    Math.sin(orbitAngle) * this.speed
                );
            }
        }
        
        // Shooting based on rhythm
        if (time > this.lastShot + this.rhythmInterval) {
            this.shoot(player);
            this.lastShot = time;
        }
        
        // Look at player
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setRotation(angle + Math.PI / 2);
    }
    
    shoot(target) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        
        // Precision affects shot count
        const shotCount = this.axes.precision > 0.7 ? 1 : 3;
        
        for (let i = 0; i < shotCount; i++) {
            const bullet = this.scene.enemyBullets.get(this.x, this.y, 'enemy_bullet');
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setDepth(1);
                bullet.body.enable = true;
                bullet.body.reset(this.x, this.y);
                
                // Apply precision offset
                const spread = (i - 1) * this.aimOffset;
                const finalAngle = angle + spread;
                
                bullet.setVelocity(
                    Math.cos(finalAngle) * 350,
                    Math.sin(finalAngle) * 350
                );
                
                bullet.setRotation(finalAngle);
            }
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        // Flash
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            if (this.active) this.setTint(0x00ffff);
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        // Massive explosion
        for (let i = 0; i < 5; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                this.scene.deathParticles.emitParticleAt(
                    this.x + (Math.random() - 0.5) * 100,
                    this.y + (Math.random() - 0.5) * 100
                );
            });
        }
        
        // Victory text
        const text = this.scene.add.text(this.x, this.y - 100,
            'RECURSION BROKEN\nYou have defeated yourself.', {
            fontFamily: 'monospace',
            fontSize: '18px',
            fill: '#00ffff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        this.destroy();
    }
}
