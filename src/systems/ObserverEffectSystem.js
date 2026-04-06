import Phaser from 'phaser';

/**
 * Observer Effect System — The Game That Watches You Back
 * 
 * Inspired by quantum mechanics: the act of observation changes the observed.
 * This system tracks HOW you use temporal mechanics and evolves the game world
 * in response, creating a unique "personality" for each playthrough.
 * 
 * The game observes your:
 * - Temporal preferences (which systems you favor)
 * - Risk patterns (aggressive vs cautious play)
 * - Movement signatures (predictable vs chaotic)
 * - Attention patterns (where you aim, when you dodge)
 * 
 * And responds by:
 * - Mutating enemy bullet patterns to counter/adapt to your style
 * - Evolving arena geometry based on your movement patterns
 * - Creating "observer echoes" — AI shadows that mimic your playstyle
 * - Shifting color palettes to match your emotional rhythm
 * - Generating personalized boss patterns from your movement data
 * 
 * This transforms the game from static challenge into a living conversation.
 * 
 * Color: Teal-cyan (#00d4ff) shifting through the spectrum as it learns
 * 
 * UnifiedGraphicsManager Implementation (April 2025):
 * - Glitch overlay rendering uses UnifiedGraphicsManager on 'effects' layer
 * - Mutation bar rendering uses UnifiedGraphicsManager on 'ui' layer
 * - ObserverEcho aura rendering uses UnifiedGraphicsManager
 * - No per-frame graphics.clear() calls (handled by UnifiedGraphicsManager)
 */

export default class ObserverEffectSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== OBSERVATION MATRICES =====
        // Track every significant player action
        this.observationLog = [];
        this.maxLogSize = 500;
        
        // Behavioral fingerprint (0-1 scales)
        this.behaviorProfile = {
            aggression: 0.5,      // High = frequent close dodges, early fractures
            caution: 0.5,         // High = maintains distance, frequent paradox checks
            temporalAffinity: {    // Which systems does player favor?
                bulletTime: 0.5,
                echoStorm: 0.5,
                fracture: 0.5,
                resonance: 0.5,
                singularity: 0.5,
                chronoLoop: 0.5,
                quantum: 0.5
            },
            movementEntropy: 0.5, // Chaos of movement (0 = circular, 1 = erratic)
            aimConsistency: 0.5,  // How often you hit where you aim
            riskTolerance: 0.5,   // Grazing bullets vs avoiding completely
            temporalCreativity: 0.5 // Combo diversity
        };
        
        // ===== REALITY MUTATION STATE =====
        this.mutationLevel = 0;        // 0-100, increases as game observes you
        this.mutationThresholds = [     // When mutations trigger
            { level: 10, mutation: 'bulletPatterns' },
            { level: 25, mutation: 'observerEchoes' },
            { level: 40, mutation: 'adaptiveSpawning' },
            { level: 55, mutation: 'realityGlitch' },
            { level: 70, mutation: 'personalityBoss' },
            { level: 85, mutation: 'quantumArena' },
            { level: 100, mutation: 'observerGod' }
        ];
        
        // ===== OBSERVER ECHOES =====
        // AI shadows that learned from your behavior
        this.observerEchoes = [];
        this.maxEchoes = 3;
        this.echoSpawnTimer = 0;
        
        // ===== ADAPTIVE BULLET PATTERNS =====
        // Enemy bullets evolve based on your dodging patterns
        this.dodgeHeatmap = new Map(); // Grid-based heatmap of where you dodge
        this.heatmapResolution = 100;  // Pixels per cell
        this.patternMutation = {
            spreadFactor: 1.0,      // Multiplier on bullet spread
            predictionBias: 0,    // How much enemies lead shots
            patternComplexity: 1,   // Additional pattern layers
            adaptiveSpeed: 1.0      // Bullet speed modifier
        };
        
        // ===== PERSONALITY BOSS DATA =====
        // Collected to generate a boss that mimics YOU
        this.bossPersonalityData = {
            movementPath: [],       // Your path during intense moments
            temporalChoices: [],    // Which systems you used when
            panicMoves: [],         // What you do under pressure
            signatureCombos: []     // Your favorite ability chains
        };
        
        // ===== VISUAL MUTATION =====
        this.currentPalette = {
            background: 0x0a0a0f,
            accent: 0x00d4ff,
            secondary: 0xffd700,
            enemy: 0xff3366
        };
        this.paletteShiftTimer = 0;
        
        // ===== ACTIVE MUTATIONS =====
        this.activeMutations = new Set();
        this.realityGlitchIntensity = 0; // 0-1, visual distortion
        
        // ===== ANALYSIS RESULTS =====
        this.lastAnalysis = null;
        this.analysisTimer = 0;
        this.analysisInterval = 5; // Seconds between deep analysis
        
        this.init();
    }
    
    init() {
        this.initHeatmap();
        this.createObserverVisuals();
        this.setupAnalysis();
    }
    
    initHeatmap() {
        const worldWidth = 1920;
        const worldHeight = 1440;
        this.heatmapCols = Math.ceil(worldWidth / this.heatmapResolution);
        this.heatmapRows = Math.ceil(worldHeight / this.heatmapResolution);
        
        // Initialize empty heatmap
        for (let y = 0; y < this.heatmapRows; y++) {
            for (let x = 0; x < this.heatmapCols; x++) {
                this.dodgeHeatmap.set(`${x},${y}`, {
                    x: x * this.heatmapResolution,
                    y: y * this.heatmapResolution,
                    visits: 0,
                    nearMisses: 0,
                    bulletTimeTriggers: 0,
                    lastVisit: 0
                });
            }
        }
    }
    
    createObserverVisuals() {
        // Observer eye indicator (top-right, subtle)
        if (!this.scene.textures.exists('observerEye')) {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            // Draw stylized eye
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(32, 32, 20, 0, Math.PI * 2); // Outer circle
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(32, 32, 8, 0, Math.PI * 2); // Pupil
            ctx.fillStyle = '#00d4ff';
            ctx.fill();
            
            this.scene.textures.addCanvas('observerEye', canvas);
        }
        
        // Observer icon - registered with panel-based HUD system
        // Environmental HUD System replaces panel-based HUD
        if (!this.scene.hudPanels) return;

        this.scene.hudPanels.registerSlot('OBSERVER', (container, width, layout) => {
            // Position icon so it doesn't extend into negative Y
            // Image is ~32px, scaled to 16px, so center at y=8
            const iconY = 8;
            
            this.observerIcon = this.scene.add.image(0, iconY, 'observerEye');
            this.observerIcon.setDepth(100);
            this.observerIcon.setAlpha(0.3);
            this.observerIcon.setScale(0.5);
            container.add(this.observerIcon);
            
            // Analysis text - below the icon
            this.analysisText = this.scene.add.text(
                0, iconY + 20,
                'OBSERVING...',
                {
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fill: '#00d4ff',
                    alpha: 0.3
                }
            );
            this.analysisText.setOrigin(0.5);
            this.analysisText.setDepth(100);
            container.add(this.analysisText);
        }, 'BOTTOM_RIGHT');
    }
    
    setupAnalysis() {
        // Periodic deep analysis
        this.scene.time.addEvent({
            delay: this.analysisInterval * 1000,
            callback: () => this.performAnalysis(),
            loop: true
        });
    }
    
    // ===== OBSERVATION METHODS =====
    // Called by other systems to report player behavior
    
    observeTemporalUse(system, context = {}) {
        this.observationLog.push({
            type: 'temporal_use',
            system,
            context,
            timestamp: this.scene.time.now,
            position: { x: this.scene.player.x, y: this.scene.player.y }
        });
        
        if (this.observationLog.length > this.maxLogSize) {
            this.observationLog.shift();
        }
        
        // Update temporal affinity
        const affinity = this.behaviorProfile.temporalAffinity;
        affinity[system] = Math.min(1, affinity[system] + 0.02);
        
        // Decay other affinities slightly
        Object.keys(affinity).forEach(key => {
            if (key !== system) {
                affinity[key] = Math.max(0, affinity[key] - 0.005);
            }
        });
        
        this.increaseMutation(0.5);
        this.updateAnalysisDisplay();
    }
    
    observeNearMiss(bulletPosition, playerPosition, wasGrazing = false) {
        // Update heatmap
        const gridX = Math.floor(playerPosition.x / this.heatmapResolution);
        const gridY = Math.floor(playerPosition.y / this.heatmapResolution);
        const cell = this.dodgeHeatmap.get(`${gridX},${gridY}`);
        
        if (cell) {
            cell.nearMisses++;
            cell.lastVisit = this.scene.time.now;
        }
        
        this.observationLog.push({
            type: 'near_miss',
            wasGrazing,
            danger: wasGrazing ? 'high' : 'low',
            timestamp: this.scene.time.now
        });
        
        if (wasGrazing) {
            this.behaviorProfile.riskTolerance = Math.min(1, 
                this.behaviorProfile.riskTolerance + 0.01);
        }
        
        this.increaseMutation(0.3);
    }
    
    observeMovement(velocity, isDodging = false) {
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
        const entropy = this.calculateMovementEntropy(velocity);
        
        this.behaviorProfile.movementEntropy = 
            this.behaviorProfile.movementEntropy * 0.95 + entropy * 0.05;
        
        // Track high-speed moments as "panic moves" for boss personality
        if (speed > 250 && isDodging) {
            this.bossPersonalityData.panicMoves.push({
                x: this.scene.player.x,
                y: this.scene.player.y,
                vx: velocity.x,
                vy: velocity.y,
                timestamp: this.scene.time.now
            });
            
            // Keep only recent panic moves
            const cutoff = this.scene.time.now - 30000;
            this.bossPersonalityData.panicMoves = 
                this.bossPersonalityData.panicMoves.filter(m => m.timestamp > cutoff);
        }
        
        // Update heatmap for movement
        const gridX = Math.floor(this.scene.player.x / this.heatmapResolution);
        const gridY = Math.floor(this.scene.player.y / this.heatmapResolution);
        const cell = this.dodgeHeatmap.get(`${gridX},${gridY}`);
        
        if (cell) {
            cell.visits++;
            cell.lastVisit = this.scene.time.now;
        }
    }
    
    observeAim(aimAngle, hitTarget) {
        this.observationLog.push({
            type: 'aim',
            angle: aimAngle,
            hit: hitTarget,
            timestamp: this.scene.time.now
        });
        
        // Update aim consistency
        const target = hitTarget ? 1 : 0;
        this.behaviorProfile.aimConsistency = 
            this.behaviorProfile.aimConsistency * 0.9 + target * 0.1;
    }
    
    observeCombo(abilitiesUsed) {
        this.observationLog.push({
            type: 'combo',
            abilities: abilitiesUsed,
            count: abilitiesUsed.length,
            timestamp: this.scene.time.now
        });
        
        // Track signature combos (3+ abilities)
        if (abilitiesUsed.length >= 3) {
            this.bossPersonalityData.signatureCombos.push({
                sequence: [...abilitiesUsed],
                timestamp: this.scene.time.now
            });
            
            // Keep recent combos
            const cutoff = this.scene.time.now - 60000;
            this.bossPersonalityData.signatureCombos = 
                this.bossPersonalityData.signatureCombos.filter(c => c.timestamp > cutoff);
        }
        
        // Update creativity score
        const creativity = Math.min(1, abilitiesUsed.length / 5);
        this.behaviorProfile.temporalCreativity = 
            this.behaviorProfile.temporalCreativity * 0.95 + creativity * 0.05;
        
        this.increaseMutation(abilitiesUsed.length * 0.5);
    }
    
    observeDeath(cause) {
        this.observationLog.push({
            type: 'death',
            cause,
            position: { x: this.scene.player.x, y: this.scene.player.y },
            timestamp: this.scene.time.now
        });
        
        // Death increases mutation faster — the game learns from your failures
        this.increaseMutation(3);
        
        // Record movement path leading to death for boss personality
        this.bossPersonalityData.movementPath.push({
            x: this.scene.player.x,
            y: this.scene.player.y,
            type: 'death',
            timestamp: this.scene.time.now
        });
    }
    
    // ===== ANALYSIS & MUTATION =====
    
    calculateMovementEntropy(velocity) {
        // Calculate how "chaotic" movement is
        // High entropy = erratic, unpredictable movement
        // Low entropy = smooth, predictable patterns
        
        if (this.observationLog.length < 10) return 0.5;
        
        const recentMoves = this.observationLog
            .filter(o => o.type === 'movement')
            .slice(-10);
        
        if (recentMoves.length < 5) return 0.5;
        
        // Calculate variance in velocity angles
        let totalVariance = 0;
        for (let i = 1; i < recentMoves.length; i++) {
            const angle1 = Math.atan2(recentMoves[i-1].vy, recentMoves[i-1].vx);
            const angle2 = Math.atan2(recentMoves[i].vy, recentMoves[i].vx);
            let diff = Math.abs(angle2 - angle1);
            if (diff > Math.PI) diff = 2 * Math.PI - diff;
            totalVariance += diff;
        }
        
        const avgVariance = totalVariance / (recentMoves.length - 1);
        return Math.min(1, avgVariance / Math.PI);
    }
    
    performAnalysis() {
        // Deep analysis of player behavior
        const recent = this.observationLog.filter(o => 
            o.timestamp > this.scene.time.now - 30000
        );
        
        if (recent.length < 5) return;
        
        // Calculate aggression
        const nearMisses = recent.filter(o => o.type === 'near_miss').length;
        const temporalUses = recent.filter(o => o.type === 'temporal_use').length;
        this.behaviorProfile.aggression = Math.min(1, 
            (nearMisses / 20) + (temporalUses / 10));
        
        // Calculate caution
        const paradoxUses = recent.filter(o => 
            o.type === 'temporal_use' && o.system === 'paradox'
        ).length;
        this.behaviorProfile.caution = Math.min(1, 
            (paradoxUses / 5) + (1 - this.behaviorProfile.riskTolerance));
        
        // Update mutation based on analysis depth
        this.increaseMutation(1);
        
        // Generate poetic observation text
        this.generateObservationPoem();
        
        // Check for mutation triggers
        this.checkMutations();
    }
    
    /**
     * Check and trigger mutations based on observation level
     */
    checkMutations() {
        // Check each threshold
        for (const threshold of this.mutationThresholds) {
            if (this.mutationLevel >= threshold.level && 
                !this.activeMutations.has(threshold.mutation)) {
                // Trigger mutation
                this.activeMutations.add(threshold.mutation);
                this.applyMutation(threshold.mutation);
            }
        }
    }
    
    /**
     * Apply a specific mutation effect
     */
    applyMutation(mutationType) {
        switch (mutationType) {
            case 'bulletPatterns':
                // Increase bullet pattern complexity
                this.patternMutation.patternComplexity += 1;
                this.showMutationNotice('BULLET PATTERNS EVOLVING');
                break;
            case 'observerEchoes':
                // Enable observer echo spawning
                this.showMutationNotice('OBSERVER ECHOES DETECTED');
                break;
            case 'adaptiveSpawning':
                // Enemies adapt to player style
                this.showMutationNotice('ADAPTIVE SPAWNING ACTIVE');
                break;
            case 'realityGlitch':
                // Enable visual glitches
                this.realityGlitchIntensity = 0.3;
                this.showMutationNotice('REALITY GLITCH DETECTED');
                break;
            case 'personalityBoss':
                // Spawn personality-matched boss
                this.showMutationNotice('PERSONALITY BOSS APPROACHING');
                break;
            case 'quantumArena':
                // Arena becomes quantum-unstable
                this.showMutationNotice('QUANTUM ARENA ACTIVE');
                break;
            case 'observerGod':
                // Final mutation - maximum difficulty
                this.realityGlitchIntensity = 1.0;
                this.showMutationNotice('THE OBSERVER AWAKENS');
                break;
        }
    }
    
    showMutationNotice(text) {
        if (this.scene.showMutationNotice) {
            this.scene.showMutationNotice(text);
        }
    }
    
    generateObservationPoem() {
        // Generate poetic text based on current profile
        const poems = [
            () => `YOU DANCE WITH ${this.behaviorProfile.riskTolerance > 0.6 ? 'CHAOS' : 'ORDER'}`,
            () => `TIME BENDS TO YOUR ${this.getDominantSystem().toUpperCase()}`,
            () => `THE ${this.behaviorProfile.movementEntropy > 0.5 ? 'STORM' : 'RIVER'} OF YOUR MOTION`,
            () => `${Math.floor(this.mutationLevel)}% OBSERVED`,
            () => `YOU ARE ${this.behaviorProfile.aggression > 0.5 ? 'FIRE' : 'WATER'}`,
            () => `ECHOES OF YOUR ${this.behaviorProfile.temporalCreativity > 0.5 ? 'CREATIVITY' : 'DISCIPLINE'}`
        ];
        
        const poem = poems[Math.floor(Math.random() * poems.length)]();
        
        // Guard: panel elements may not be initialized yet
        if (!this.analysisText) return;
        
        this.analysisText.setText(poem);
        
        // Fade in/out
        this.scene.tweens.add({
            targets: this.analysisText,
            alpha: 0.6,
            duration: 500,
            yoyo: true,
            hold: 2000
        });
    }
    
    getDominantSystem() {
        const affinity = this.behaviorProfile.temporalAffinity;
        let max = 0;
        let dominant = 'BALANCE';
        
        Object.entries(affinity).forEach(([system, value]) => {
            if (value > max) {
                max = value;
                dominant = system;
            }
        });
        
        return dominant;
    }
    
    increaseMutation(amount) {
        const oldLevel = Math.floor(this.mutationLevel / 10);
        this.mutationLevel = Math.min(100, this.mutationLevel + amount);
        const newLevel = Math.floor(this.mutationLevel / 10);
        
        // Check if we crossed a threshold
        if (newLevel > oldLevel) {
            this.onMutationLevelUp(newLevel);
        }
        
        this.drawMutationBar();
    }
    
    onMutationLevelUp(level) {
        const mutation = this.mutationThresholds.find(t => Math.floor(t.level / 10) === level);
        
        if (mutation && !this.activeMutations.has(mutation.mutation)) {
            this.activateMutation(mutation.mutation);
        }
    }
    
    activateMutation(mutationType) {
        this.activeMutations.add(mutationType);
        
        switch (mutationType) {
            case 'bulletPatterns':
                this.activateAdaptiveBullets();
                break;
            case 'observerEchoes':
                this.activateObserverEchoes();
                break;
            case 'adaptiveSpawning':
                this.activateAdaptiveSpawning();
                break;
            case 'realityGlitch':
                this.activateRealityGlitch();
                break;
            case 'personalityBoss':
                this.activatePersonalityBoss();
                break;
            case 'quantumArena':
                this.activateQuantumArena();
                break;
            case 'observerGod':
                this.activateObserverGod();
                break;
        }
        
        // Announce mutation
        this.showMutationAnnouncement(mutationType);
    }
    
    // ===== MUTATION IMPLEMENTATIONS =====
    
    activateAdaptiveBullets() {
        // Enemy bullets now adapt to your dodge patterns
        // They avoid your "safe zones" and target your "panic zones"
        
        this.patternMutation.spreadFactor = 1 + (this.behaviorProfile.movementEntropy * 0.5);
        this.patternMutation.predictionBias = this.behaviorProfile.aimConsistency;
        this.patternMutation.patternComplexity = 1 + Math.floor(this.behaviorProfile.temporalCreativity * 2);
        this.patternMutation.adaptiveSpeed = 0.8 + (this.behaviorProfile.aggression * 0.4);
        
        // Modify enemy bullet spawning in GameScene
        this.scene.adaptiveBulletMutation = this.patternMutation;
    }
    
    activateObserverEchoes() {
        // Spawn echoes that learned from your behavior
        this.echoSpawnTimer = this.scene.time.addEvent({
            delay: 15000,
            callback: () => this.spawnObserverEcho(),
            loop: true
        });
    }
    
    spawnObserverEcho() {
        if (this.observerEchoes.length >= this.maxEchoes) return;
        
        // Find spawn location in a "hot" dodge zone
        const hotCells = [];
        for (const [key, cell] of this.dodgeHeatmap) {
            if (cell.nearMisses > 3) {
                hotCells.push(cell);
            }
        }
        
        const spawnCell = hotCells.length > 0 
            ? hotCells[Math.floor(Math.random() * hotCells.length)]
            : { x: this.scene.player.x + 200, y: this.scene.player.y };
        
        // Create observer echo
        const echo = new ObserverEcho(
            this.scene,
            spawnCell.x,
            spawnCell.y,
            this.scene.player,
            this.behaviorProfile
        );
        
        this.observerEchoes.push(echo);
        
        // Remove from array when destroyed
        echo.onDestroy = () => {
            this.observerEchoes = this.observerEchoes.filter(e => e !== echo);
        };
    }
    
    activateAdaptiveSpawning() {
        // Enemies spawn based on your weaknesses
        // Spawn more of what kills you, where you die
        
        this.scene.adaptiveSpawning = {
            weaknessType: this.calculateWeaknessType(),
            dangerZones: this.bossPersonalityData.panicMoves.map(m => ({
                x: m.x, y: m.y, radius: 200
            }))
        };
    }
    
    calculateWeaknessType() {
        // Analyze deaths to find what kills you most
        const deaths = this.observationLog.filter(o => o.type === 'death');
        if (deaths.length === 0) return 'normal';
        
        // Simple analysis — could be more sophisticated
        const tankDeaths = deaths.filter(d => d.cause === 'tank').length;
        const fastDeaths = deaths.filter(d => d.cause === 'fast').length;
        const bulletDeaths = deaths.filter(d => d.cause === 'bullet').length;
        
        if (tankDeaths > fastDeaths && tankDeaths > bulletDeaths) return 'fast';
        if (fastDeaths > tankDeaths && fastDeaths > bulletDeaths) return 'tank';
        return 'normal';
    }
    
    activateRealityGlitch() {
        // Visual glitches increase over time
        this.scene.time.addEvent({
            delay: 100,
            callback: () => this.updateRealityGlitch(),
            loop: true
        });
    }
    
    updateRealityGlitch() {
        // Intensity based on mutation level
        this.realityGlitchIntensity = this.mutationLevel / 150;
        
        // Occasional visual distortions
        if (Math.random() < this.realityGlitchIntensity * 0.1) {
            this.triggerGlitchEffect();
        }
    }
    
    triggerGlitchEffect() {
        const duration = 100 + Math.random() * 300;
        
        // Unified renderer: Register glitch rectangles as render commands on 'effects' layer
        const manager = this.scene.graphicsManager;
        const cam = this.scene.cameras.main;
        
        // Random glitch rectangles (screen-space, so use camera-relative coordinates)
        for (let i = 0; i < 5; i++) {
            const x = cam.scrollX + Math.random() * cam.width;
            const y = cam.scrollY + Math.random() * cam.height;
            const w = 50 + Math.random() * 200;
            const h = 5 + Math.random() * 20;
            const color = Math.random() > 0.5 ? 0x00d4ff : 0xff00ff;
            
            manager.drawRect('effects', x, y, w, h, color, 0.5);
        }
        
        // Layer will be cleared on next render cycle, no need for explicit cleanup
        // Glitch effect rendered via UnifiedGraphicsManager
    }
    
    activatePersonalityBoss() {
        // Spawn a boss that uses YOUR patterns
        this.scene.personalityBossData = {
            movementSignature: this.bossPersonalityData.movementPath,
            panicSignature: this.bossPersonalityData.panicMoves,
            comboSignature: this.bossPersonalityData.signatureCombos,
            profile: { ...this.behaviorProfile }
        };
        
        // Announce that boss is coming
        this.scene.time.delayedCall(10000, () => {
            this.scene.spawnPersonalityBoss?.();
        });
    }
    
    activateQuantumArena() {
        // Arena shifts based on your movement patterns
        // Creates walls/barriers in your preferred paths
        // Opens shortcuts where you tend to avoid
        
        // This would modify the arena geometry
        // For now, visualize with shifting grid colors
        this.updateArenaVisuals();
    }
    
    updateArenaVisuals() {
        // Shift background color based on behavior
        const aggression = this.behaviorProfile.aggression;
        const entropy = this.behaviorProfile.movementEntropy;
        
        // More aggressive = warmer tones
        // More chaotic = more saturated
        const r = Math.floor(10 + aggression * 40);
        const g = Math.floor(10 + (1 - entropy) * 30);
        const b = Math.floor(15 + entropy * 40);
        
        this.currentPalette.background = (r << 16) | (g << 8) | b;
        this.scene.cameras.main.setBackgroundColor(this.currentPalette.background);
    }
    
    activateObserverGod() {
        // Final form: The game becomes fully reactive
        // All systems at maximum adaptation
        
        // Create the Observer God (a massive eye entity)
        this.spawnObserverGod();
    }
    
    spawnObserverGod() {
        // Spawn a massive entity that watches from the arena edge
        // Periodically judges your performance
        // Rewards creative play, punishes repetition
        
        this.observerGod = new ObserverGod(this.scene, this);
    }
    
    // ===== VISUAL METHODS =====
    
    drawMutationBar() {
        const cam = this.scene.cameras.main;
        const barX = cam.width - 110;
        const barY = 85;
        const barWidth = 100;
        const barHeight = 6;
        
        // Fill (cyan to magenta gradient based on level)
        const fillWidth = (this.mutationLevel / 100) * barWidth;
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            { r: 0, g: 212, b: 255 },
            { r: 255, g: 0, b: 255 },
            100,
            this.mutationLevel
        );
        const fillColor = (color.r << 16) | (color.g << 8) | color.b;
        
        // Unified renderer: Register bar render commands on 'ui' layer
        const manager = this.scene.graphicsManager;
        
        // Background
        manager.drawRect('ui', barX, barY, barWidth, barHeight, 0x333333, 0.5);
        
        // Fill
        manager.drawRect('ui', barX, barY, fillWidth, barHeight, fillColor, 1);
    }
    
    showMutationAnnouncement(mutationType) {
        const names = {
            bulletPatterns: 'ADAPTIVE BULLETS',
            observerEchoes: 'OBSERVER ECHOES',
            adaptiveSpawning: 'ADAPTIVE SPAWNING',
            realityGlitch: 'REALITY GLITCH',
            personalityBoss: 'PERSONALITY BOSS',
            quantumArena: 'QUANTUM ARENA',
            observerGod: 'THE OBSERVER'
        };
        
        const text = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 3,
            `MUTATION: ${names[mutationType] || mutationType}`,
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#00d4ff'
            }
        );
        text.setScrollFactor(0);
        text.setOrigin(0.5);
        text.setAlpha(0);
        
        this.scene.tweens.add({
            targets: text,
            alpha: 1,
            scale: 1.2,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            hold: 2000,
            onComplete: () => text.destroy()
        });
    }
    
    updateAnalysisDisplay() {
        // Guard: panel elements may not be initialized yet
        if (!this.observerIcon) return;
        
        // Subtle pulse on observer icon when observing
        this.scene.tweens.add({
            targets: this.observerIcon,
            alpha: 0.6,
            scale: 0.6,
            duration: 200,
            yoyo: true
        });
    }
    
    // ===== PUBLIC API FOR OTHER SYSTEMS =====
    
    getAdaptiveBulletModifiers() {
        return this.patternMutation;
    }
    
    getBehaviorProfile() {
        return { ...this.behaviorProfile };
    }
    
    getMutationLevel() {
        return this.mutationLevel;
    }
    
    getHeatmapDanger(x, y) {
        const gridX = Math.floor(x / this.heatmapResolution);
        const gridY = Math.floor(y / this.heatmapResolution);
        const cell = this.dodgeHeatmap.get(`${gridX},${gridY}`);
        
        if (!cell) return 0;
        
        // Danger based on near-miss density
        return Math.min(1, cell.nearMisses / 10);
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;

        this.analysisTimer += dt;

        // Update observer echoes
        this.observerEchoes.forEach(echo => echo.update(dt));
        
        // Update observer god if active
        if (this.observerGod) {
            this.observerGod.update(dt);
        }
        
        // Continuous mutation decay (very slow)
        const prevMutation = this.mutationLevel;
        this.mutationLevel = Math.max(0, this.mutationLevel - dt * 0.5);
        
        // Only redraw if mutation level changed significantly (throttled)
        if (Math.abs(prevMutation - this.mutationLevel) > 1) {
            this.drawMutationBar();
        }
    }
    
    destroy() {
        this.observerEchoes.forEach(e => e.destroy());
        if (this.observerGod) this.observerGod.destroy();
        if (this.echoSpawnTimer) this.echoSpawnTimer.remove();
    }
}

/**
 * ObserverEcho — An AI entity that learned from your behavior
 */
class ObserverEcho {
    constructor(scene, x, y, target, behaviorProfile) {
        this.scene = scene;
        this.target = target;
        this.behaviorProfile = behaviorProfile;
        
        // Create visual (ghostly version of player)
        this.sprite = scene.add.triangle(
            x, y,
            0, -15,
            12, 12,
            -12, 12,
            0x00d4ff
        );
        this.sprite.setAlpha(0.6);
        
        // Physics body
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCircle(12);
        
        // AI state
        this.state = 'observing'; // observing, mirroring, countering
        this.stateTimer = 0;
        this.lifespan = 20; // Seconds
        this.age = 0;
        
        // Combat
        this.fireRate = 800;
        this.lastFired = 0;
        
        // Visual effects
        this.createAura();
        
        // Announce
        this.announce();
    }
    
    createAura() {
        // Aura is rendered via UnifiedGraphicsManager in update()
    }
    
    announce() {
        const text = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 40,
            'OBSERVER ECHO',
            {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#00d4ff'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;

        this.age += dt;

        if (this.age >= this.lifespan) {
            this.die();
            return;
        }

        // Update aura via UnifiedGraphicsManager
        const pulse = 1 + Math.sin(this.age * 3) * 0.2;
        const alpha = 0.3 * (1 - this.age / this.lifespan);
        
        // Unified renderer: Register aura as render command on 'effects' layer
        this.scene.graphicsManager.addCommand('effects', 'circle', {
            x: this.sprite.x,
            y: this.sprite.y,
            radius: 25 * pulse,
            color: 0x00d4ff,
            alpha: alpha,
            filled: false
        });
        
        // AI behavior based on player's profile
        const distToTarget = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            this.target.x, this.target.y
        );
        
        // Mirror player's aggression
        const aggression = this.behaviorProfile.aggression;
        const caution = this.behaviorProfile.caution;
        
        if (distToTarget > 200 + aggression * 100) {
            // Approach target
            const angle = Phaser.Math.Angle.Between(
                this.sprite.x, this.sprite.y,
                this.target.x, this.target.y
            );
            const speed = 100 + aggression * 100;
            this.sprite.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
        } else if (distToTarget < 100 - caution * 50) {
            // Retreat (like a cautious player)
            const angle = Phaser.Math.Angle.Between(
                this.target.x, this.target.y,
                this.sprite.x, this.sprite.y
            );
            this.sprite.body.setVelocity(
                Math.cos(angle) * 150,
                Math.sin(angle) * 150
            );
        } else {
            // Orbit (like reading the situation)
            const orbitAngle = Phaser.Math.Angle.Between(
                this.sprite.x, this.sprite.y,
                this.target.x, this.target.y
            ) + Math.PI / 2;
            const orbitSpeed = 80;
            this.sprite.body.setVelocity(
                Math.cos(orbitAngle) * orbitSpeed,
                Math.sin(orbitAngle) * orbitSpeed
            );
        }
        
        // Fire at nearby enemies (supporting the player)
        const enemies = this.scene.enemies.children.entries.filter(e => e.active);
        const nearest = enemies
            .map(e => ({
                enemy: e,
                dist: Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, e.x, e.y)
            }))
            .sort((a, b) => a.dist - b.dist)[0];
        
        if (nearest && nearest.dist < 400 && this.scene.time.now > this.lastFired + this.fireRate) {
            const angle = Phaser.Math.Angle.Between(
                this.sprite.x, this.sprite.y,
                nearest.enemy.x, nearest.enemy.y
            );
            this.scene.spawnEchoBullet(this.sprite.x, this.sprite.y, angle);
            this.lastFired = this.scene.time.now;
        }
    }
    
    die() {
        // Fade out
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scale: 0,
            duration: 500,
            onComplete: () => this.destroy()
        });
    }
    
    destroy() {
        this.sprite.destroy();
        if (this.onDestroy) this.onDestroy();
    }
}

/**
 * ObserverGod — The Final Form
 * A massive entity that watches and judges your play
 */
class ObserverGod {
    constructor(scene, observerSystem) {
        this.scene = scene;
        this.observerSystem = observerSystem;
        
        // Position at arena edge
        this.x = 1920 - 200;
        this.y = 720;
        
        // Create massive eye visual
        this.createVisual();
        
        // Judgment system
        this.judgmentTimer = 0;
        this.judgmentInterval = 15; // Seconds between judgments
        
        // Announce arrival
        this.announce();
    }
    
    createVisual() {
        // Massive eye
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Outer eye (white)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.ellipse(128, 128, 100, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Iris (cyan)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(128, 128, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupil (watching you)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(128, 128, 15, 0, Math.PI * 2);
        ctx.fill();
        
        this.scene.textures.addCanvas('observerGod', canvas);
        this.sprite = this.scene.add.image(this.x, this.y, 'observerGod');
        this.sprite.setDepth(40);
        this.sprite.setAlpha(0.6);
    }
    
    announce() {
        const text = this.scene.add.text(this.x, this.y - 150, 
            'THE OBSERVER HAS ARRIVED',
            {
                fontFamily: 'monospace',
                fontSize: '28px',
                fontStyle: 'bold',
                fill: '#00d4ff'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            scale: 1.3,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
        
        // Dramatic camera shake
        this.scene.cameras.main.shake(1000, 0.02);
    }
    
    update(dt) {
        if (this.scene.pauseSystem?.paused) return;

        this.judgmentTimer += dt;

        // Look at player
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.scene.player.x, this.scene.player.y
        );
        this.sprite.setRotation(angle);
        
        // Periodic judgment
        if (this.judgmentTimer >= this.judgmentInterval) {
            this.judgmentTimer = 0;
            this.judge();
        }
    }
    
    judge() {
        const profile = this.observerSystem.getBehaviorProfile();
        
        // Judge based on creativity
        const creativity = profile.temporalCreativity;
        const repetition = this.calculateRepetition();
        
        if (creativity > 0.6 && repetition < 0.3) {
            // Reward creative play
            this.reward();
        } else if (repetition > 0.5) {
            // Punish repetitive play
            this.punish();
        } else {
            // Neutral observation
            this.observe();
        }
    }
    
    calculateRepetition() {
        // Check if player is doing the same things repeatedly
        const recent = this.observerSystem.observationLog.slice(-20);
        if (recent.length < 10) return 0;
        
        const systems = recent.map(o => o.system).filter(Boolean);
        const unique = new Set(systems).size;
        
        return 1 - (unique / 7); // 7 possible temporal systems
    }
    
    reward() {
        // Spawn power orbs
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            const orb = this.scene.add.circle(
                this.x + Math.cos(angle) * 100,
                this.y + Math.sin(angle) * 100,
                8,
                0x00ff00
            );
            orb.setDepth(50);
            
            this.scene.tweens.add({
                targets: orb,
                x: this.scene.player.x,
                y: this.scene.player.y,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    this.scene.score += 100;
                    orb.destroy();
                }
            });
        }
        
        this.showJudgmentText('CREATIVITY REWARDED', '#00ff00');
    }
    
    punish() {
        // Spawn challenging enemies
        this.scene.spawnEnemies(5, 'tank');
        this.showJudgmentText('REPETITION DETECTED', '#ff0000');
    }
    
    observe() {
        // Neutral — just watch
        this.showJudgmentText('OBSERVING...', '#00d4ff');
    }
    
    showJudgmentText(text, color) {
        const t = this.scene.add.text(this.x, this.y + 120, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            fill: color
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: t,
            alpha: 0,
            y: t.y + 30,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => t.destroy()
        });
    }
    
    destroy() {
        this.sprite.destroy();
    }
}
