import Phaser from 'phaser';

/**
 * TEMPORAL PEDAGOGY SYSTEM — The Self-Teaching Game
 * 
 * The 38th cognitive dimension: ADAPTIVE TEACHING
 * 
 * With 36 interconnected temporal systems, the game had become a cognitive
 * labyrinth — magnificent but impenetrable to new players, overwhelming even
 * to veterans discovering new combinations. The Temporal Pedagogy System
 * doesn't add another mechanic. It adds *understanding*.
 * 
 * === THE RADICAL INNOVATION ===
 * 
 * Traditional tutorials are static — they teach what the designer predicted.
 * Temporal Pedagogy is alive — it teaches what the player needs RIGHT NOW,
 * detected from actual behavioral patterns, inferred cognitive load, and
 * readiness for the next level of mastery.
 * 
 * The game becomes a personalized mentor that:
 * 1. OBSERVES which systems you use, ignore, or struggle with
 * 2. INFERS your current cognitive load and skill gaps
 * 3. PREDICTS which concepts you're ready to learn next
 * 4. DELIVERS contextual micro-tutorials at teachable moments
 * 5. ADAPTS its teaching style to your learning preferences
 * 
 * === THE FOUR LAYERS OF PEDAGOGY ===
 * 
 * 1. OBSERVATION LAYER (The Silent Witness)
 *    - Tracks every system activation (or lack thereof)
 *    - Detects hesitation patterns (player frozen = confusion)
 *    - Identifies "system neglect" (powerful tools going unused)
 *    - Measures "combo potential" (systems that COULD interact but don't)
 * 
 * 2. DIAGNOSTIC LAYER (The Learning Profiler)
 *    - Calculates "mastery scores" for each system (0-100%)
 *    - Identifies "readiness" for advanced concepts
 *    - Detects frustration vs flow states
 *    - Builds a "learning profile" (explorer, optimizer, survivor, artist)
 * 
 * 3. PREDICTION LAYER (The Teachable Moment)
 *    - Predicts when player is receptive to new information
 *    - Identifies "natural experiments" (player just did X, teach Y)
 *    - Times interventions for minimal flow disruption
 *    - Escalates from subtle hints to direct instruction based on need
 * 
 * 4. DELIVERY LAYER (The Living Guide)
 *    - Micro-hints: Single words appearing at the edge of vision
 *    - Context tips: Brief explanations tied to current situation
 *    - Demonstration ghosts: AI echoes showing optimal technique
 *    - Challenge prompts: "Try combining X and Y" with reward incentive
 * 
 * === THE COGNITIVE LOAD BALANCING ===
 * 
 * The system respects player state:
 * - HIGH STRESS (being attacked): No teaching, pure support
 * - FLOW STATE (perfect rhythm): Minimal hints, celebrate mastery
 * - EXPLORATION (safe moments): Full tutorials, system showcases
 * - RECOVERY (after death): Reflective analysis, what to try next
 * 
 * === THE MASTERY PROGRESSION ===
 * 
 * Systems unlock in curriculum order, but player defines the pace:
 * 
 * CURRICULUM STAGES:
 * 1. SURVIVAL (0-2 min): Movement, shooting, health
 * 2. RISK (2-5 min): Near-miss, bullet time basics
 * 3. TRANSFORMATION (5-10 min): Echo Storm, Fracture
 * 4. MASTERY (10-20 min): Residue, Singularity, combos
 * 5. TRANSCENDENCE (20+ min): Advanced synergies, Architect authorship
 * 
 * But players can "test out" — demonstrate competence and skip ahead.
 * 
 * === THE PEDAGOGICAL INNOVATIONS ===
 * 
 * 1. NEGATIVE SPACE TEACHING
 *    When a system goes unused, the game asks: "What if you tried...?"
 *    Not demanding, but inviting discovery.
 * 
 * 2. SYNERGY FORESHADOWING
 *    Before teaching a combo, the game shows ghost outlines:
 *    "Your Residue nodes could fire WITH your bullets..."
 * 
 * 3. FAILURE AS LESSON
 *    Death triggers not "GAME OVER" but "ANALYSIS MODE" — 
 *    what system could have saved you? Gentle suggestion, not blame.
 * 
 * 4. PEER WISDOM
 *    "92% of players who survived this wave used Fracture..."
 *    Social proof guides without prescribing.
 * 
 * === THE TEACHING MODES ===
 * 
 * MODE: EXPLORER (Default)
 * - Hints appear as mysterious whispers
 * - System names revealed through discovery
 * - Emphasis on "what could be"
 * 
 * MODE: ENGINEER (Optional)
 * - Explicit technical explanations
 * - Damage numbers, cooldown timers
 * - Emphasis on "how it works"
 * 
 * MODE: MASTER (Unlockable)
 * - No hints unless requested
 * - Challenge completions tracked
 * - Emphasis on "perfect execution"
 * 
 * === THE ADAPTIVE UI ===
 * 
 * The HUD itself teaches:
 * - Unused system slots pulse gently when relevant
 * - System icons "light up" when their trigger conditions are met
 * - Combo potential shown as connecting lines between ready systems
 * 
 * === SYNERGIES WITH ALL SYSTEMS ===
 * 
 * - Noetic Mirror: Pedagogy uses cognitive profile to personalize teaching
 * - Observer Effect: Shares behavioral data for learning analysis  
 * - Architect: Detects when player is ready to invent new mechanics
 * - Egregore: Incorporates "what the community learned" into curriculum
 * - Mnemosyne: Tracks learning across sessions, persistent skill growth
 * - Oracle: Can "prophesy" tutorials — "Soon you will need to learn..."
 * 
 * === THE META-VISION ===
 * 
 * The Temporal Pedagogy System transforms the game from:
 * "An overwhelming collection of 36 mechanics"
 * → "A personalized journey of mastery that meets you where you are"
 * 
 * The game becomes not just intelligent, but *wise* — knowing when to
 * speak and when to be silent, when to challenge and when to support.
 * 
 * It embodies the ultimate teaching philosophy:
 * "The best teachers make themselves unnecessary."
 * 
 * Eventually, the system should fade into near-invisibility, leaving
 * behind a player who doesn't need teaching — because they've become
 * the master the game always believed they could be.
 * 
 * Color: Pedagogical Teal (#20b2aa) — between the cyan of player action
 * and the blue of guidance, representing the bridge between confusion
 * and mastery. Also suggests "flow" — the state learning enables.
 * 
 * Discovery Flash: Gentle pulse from Teal → Cyan — teaching enabling action.
 */

export default class TemporalPedagogySystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== PEDAGOGICAL STATE =====
        this.learningProfile = this.loadLearningProfile();
        this.curriculumStage = this.learningProfile.curriculumStage || 0;
        this.teachingMode = this.learningProfile.teachingMode || 'EXPLORER';
        
        // ===== SYSTEM MASTERY TRACKING =====
        this.systemMastery = this.learningProfile.systemMastery || {
            'MOVEMENT': { used: 0, mastered: false, score: 0 },
            'SHOOTING': { used: 0, mastered: false, score: 0 },
            'NEAR_MISS': { used: 0, mastered: false, score: 0, discovered: false },
            'ECHO_STORM': { used: 0, mastered: false, score: 0, discovered: false },
            'FRACTURE': { used: 0, mastered: false, score: 0, discovered: false },
            'RESIDUE': { used: 0, mastered: false, score: 0, discovered: false },
            'SINGULARITY': { used: 0, mastered: false, score: 0, discovered: false },
            'OMNI_WEAPON': { used: 0, mastered: false, score: 0, discovered: false },
            'PARADOX': { used: 0, mastered: false, score: 0, discovered: false },
            'CHRONO_LOOP': { used: 0, mastered: false, score: 0, discovered: false },
            'QUANTUM': { used: 0, mastered: false, score: 0, discovered: false },
            'RESONANCE': { used: 0, mastered: false, score: 0, discovered: false },
            'OBSERVER': { used: 0, mastered: false, score: 0, discovered: false },
            'VOID': { used: 0, mastered: false, score: 0, discovered: false },
            'SYMBIOTIC': { used: 0, mastered: false, score: 0, discovered: false },
            'NEMESIS': { used: 0, mastered: false, score: 0, discovered: false },
            'ORACLE': { used: 0, mastered: false, score: 0, discovered: false },
            'BOOTSTRAP': { used: 0, mastered: false, score: 0, discovered: false },
            'SYNCHRONICITY': { used: 0, mastered: false, score: 0, discovered: false },
            'ARCHITECT': { used: 0, mastered: false, score: 0, discovered: false }
        };
        
        // ===== OBSERVATION STATE =====
        this.playerBehavior = {
            lastActionTime: 0,
            hesitationStreak: 0,
            flowStreak: 0,
            deathCount: 0,
            neglectWarnings: new Set()
        };
        
        this.currentStress = 0;      // 0-1, affects teaching intensity
        this.cognitiveLoad = 0;        // 0-1, affects hint complexity
        this.flowState = false;        // Are we in the zone?
        
        // ===== TEACHING QUEUE =====
        this.pendingHints = [];
        this.hintCooldown = 0;
        this.minHintInterval = 5000; // Minimum ms between hints
        this.demoGhost = null;       // Active demonstration
        
        // ===== VISUAL ELEMENTS =====
        this.pedagogyColor = 0x20b2aa;      // Pedagogical Teal
        this.pedagogyGlow = 0x40e0d0;
        this.hintText = null;
        this.masteryGlow = null;
        this.systemIndicators = new Map();
        
        // ===== CURRICULUM DEFINITION =====
        this.curriculum = [
            {
                stage: 0,
                name: 'SURVIVAL',
                duration: 120000,  // ~2 minutes
                systems: ['MOVEMENT', 'SHOOTING'],
                hints: [
                    { condition: 'low_movement', text: 'MOVE to dodge', priority: 10 },
                    { condition: 'no_shooting', text: 'CLICK to fire', priority: 10 },
                    { condition: 'health_low', text: 'AVOID red bullets', priority: 9 }
                ]
            },
            {
                stage: 1,
                name: 'RISK',
                duration: 180000,  // ~3 minutes
                systems: ['NEAR_MISS'],
                hints: [
                    { condition: 'near_miss_triggered', text: 'GRAZE bullets for slow time', priority: 8 },
                    { condition: 'bullet_time_active', text: 'TIME SLOWS — graze more!', priority: 7 },
                    { condition: 'near_miss_chain', text: 'CHAIN grazes for longer slow', priority: 6 }
                ]
            },
            {
                stage: 2,
                name: 'TRANSFORMATION',
                duration: 300000,  // ~5 minutes
                systems: ['ECHO_STORM', 'FRACTURE'],
                hints: [
                    { condition: 'echo_absorbed', text: 'ECHO STORM: Absorb gold bullets', priority: 7 },
                    { condition: 'momentum_full', text: 'PRESS SHIFT to fracture', priority: 8 },
                    { condition: 'fracture_active', text: 'GHOST fires with you!', priority: 6 }
                ]
            },
            {
                stage: 3,
                name: 'MASTERY',
                duration: 600000,  // ~10 minutes
                systems: ['RESIDUE', 'SINGULARITY', 'OMNI_WEAPON', 'RESONANCE'],
                hints: [
                    { condition: 'residue_spawned', text: 'PURPLE nodes fire with you', priority: 6 },
                    { condition: 'singularity_charged', text: 'PRESS SPACE for gravity well', priority: 7 },
                    { condition: 'resonance_chain', text: 'COMBO systems for multipliers', priority: 5 },
                    { condition: 'weapon_evolved', text: 'Your weapon adapts to you', priority: 5 }
                ]
            },
            {
                stage: 4,
                name: 'TRANSCENDENCE',
                duration: Infinity,
                systems: ['PARADOX', 'CHRONO_LOOP', 'QUANTUM', 'SYNCHRONICITY', 'ARCHITECT'],
                hints: [
                    { condition: 'paradox_ready', text: 'RIGHT CLICK to predict future', priority: 5 },
                    { condition: 'chrono_ready', text: 'PRESS T to record yourself', priority: 5 },
                    { condition: 'quantum_death', text: 'Death spawns echoes — use them', priority: 4 },
                    { condition: 'combo_4plus', text: '8+ systems = SYNCHRONICITY', priority: 3 },
                    { condition: 'novelty_high', text: 'Create new mechanics!', priority: 2 }
                ]
            }
        ];
        
        // ===== CHALLENGE PROMPTS =====
        this.challenges = [
            { id: 'graze_master', text: 'Graze 5 bullets in 5 seconds', reward: 500, check: () => this.checkGrazeChallenge() },
            { id: 'echo_hunter', text: 'Absorb 10 echoes in one bullet time', reward: 1000, check: () => this.checkEchoChallenge() },
            { id: 'fracture_kill', text: 'Kill an enemy while fractured', reward: 750, check: () => this.checkFractureKill() },
            { id: 'combo_novice', text: 'Chain 3 different systems', reward: 1000, check: () => this.checkComboChallenge(3) },
            { id: 'combo_master', text: 'Chain 5 different systems', reward: 2500, check: () => this.checkComboChallenge(5) },
            { id: 'paradox_perfect', text: 'Complete a perfect paradox path', reward: 2000, check: () => this.checkParadoxChallenge() }
        ];
        this.activeChallenge = null;
        
        this.init();
    }
    
    init() {
        this.createVisualElements();
        this.startObservation();
    }
    
    createVisualElements() {
        // Subtle hint text at bottom of screen
        this.hintText = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height - 40,
            '',
            {
                fontFamily: 'monospace',
                fontSize: '13px',
                letterSpacing: 1,
                fill: '#20b2aa',
                align: 'center',
                alpha: 0
            }
        ).setOrigin(0.5);
        this.hintText.setScrollFactor(0);
        this.hintText.setDepth(95);
        
        // Mastery glow ring (appears around player when learning)
        this.masteryGlow = this.scene.add.graphics();
        this.masteryGlow.setDepth(45);
        
        // System indicators will be created as systems are discovered
    }
    
    startObservation() {
        // Track player behavior every frame
        this.lastPlayerPos = { x: 0, y: 0 };
        this.lastActionTime = this.scene.time.now;
    }
    
    // ===== OBSERVATION METHODS =====
    
    observePlayerBehavior(dt, player) {
        const now = this.scene.time.now;
        
        // Detect hesitation (player not moving)
        const movement = Phaser.Math.Distance.Between(
            player.x, player.y,
            this.lastPlayerPos.x, this.lastPlayerPos.y
        );
        
        if (movement < 1) {
            this.playerBehavior.hesitationStreak += dt;
            if (this.playerBehavior.hesitationStreak > 2 && this.cognitiveLoad < 0.5) {
                // Player frozen — might be confused
                this.onPlayerHesitation(player);
            }
        } else {
            this.playerBehavior.hesitationStreak = 0;
            this.lastActionTime = now;
        }
        
        // Detect flow state (consistent good performance)
        if (this.scene.score > 0 && this.scene.nearMissState?.streak > 2) {
            this.playerBehavior.flowStreak += dt;
            if (this.playerBehavior.flowStreak > 5) {
                this.flowState = true;
            }
        } else {
            this.playerBehavior.flowStreak = 0;
            this.flowState = false;
        }
        
        // Calculate stress (enemies near, bullets near, health low)
        let stress = 0;
        if (player.health < 30) stress += 0.4;
        if (this.scene.enemyBullets?.countActive() > 20) stress += 0.3;
        if (this.scene.enemies?.countActive() > 8) stress += 0.2;
        
        // Smooth stress transition
        this.currentStress = Phaser.Math.Linear(this.currentStress, stress, dt * 2);
        
        // Update cognitive load (based on active systems)
        let activeSystems = 0;
        if (this.scene.echoStorm?.absorbedCount > 0) activeSystems++;
        if (this.scene.fractureSystem?.isFractured) activeSystems++;
        if (this.scene.temporalResidue?.nodes?.length > 0) activeSystems += 0.5;
        if (this.scene.singularitySystem?.singularityActive) activeSystems++;
        if (this.scene.resonanceCascade?.chainSequence?.length > 0) activeSystems++;
        
        this.cognitiveLoad = Math.min(1, activeSystems / 4);
        
        this.lastPlayerPos = { x: player.x, y: player.y };
    }
    
    onPlayerHesitation(player) {
        // Check curriculum stage for context-appropriate hint
        const stage = this.curriculum[this.curriculumStage];
        if (!stage) return;
        
        // Find hint for current stage
        for (const hint of stage.hints) {
            if (this.checkHintCondition(hint.condition)) {
                this.showHint(hint.text, 4000);
                break;
            }
        }
    }
    
    // ===== SYSTEM TRACKING =====
    
    recordSystemUse(systemName, quality = 1) {
        if (!this.systemMastery[systemName]) return;
        
        const mastery = this.systemMastery[systemName];
        mastery.used++;
        mastery.score = Math.min(100, mastery.score + quality);
        
        // Check for discovery
        if (!mastery.discovered && mastery.used >= 1) {
            mastery.discovered = true;
            this.onSystemDiscovered(systemName);
        }
        
        // Check for mastery
        if (!mastery.mastered && mastery.score >= 80 && mastery.used >= 5) {
            mastery.mastered = true;
            this.onSystemMastered(systemName);
        }
        
        // Update curriculum stage based on mastery
        this.updateCurriculumStage();
        
        // Save progress
        this.saveLearningProfile();
    }
    
    onSystemDiscovered(systemName) {
        // Show subtle discovery notification
        this.showHint(`${systemName.replace('_', ' ')} discovered`, 3000, true);
        
        // Create visual indicator for this system
        this.createSystemIndicator(systemName);
    }
    
    onSystemMastered(systemName) {
        // Celebration of mastery
        this.showHint(`${systemName.replace('_', ' ')} MASTERED`, 4000, true);
        
        // Pulse mastery glow
        this.pulseMasteryGlow();
        
        // Check for new challenge
        this.offerNewChallenge();
    }
    
    createSystemIndicator(systemName) {
        // Create subtle HUD indicator for this system
        const index = Object.keys(this.systemMastery).indexOf(systemName);
        const x = 20 + (index % 10) * 25;
        const y = 80 + Math.floor(index / 10) * 25;
        
        const indicator = this.scene.add.container(x, y);
        
        // Background circle
        const bg = this.scene.add.circle(0, 0, 10, 0x22222a, 0.5);
        indicator.add(bg);
        
        // System letter
        const letter = this.scene.add.text(0, 0, systemName[0], {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#444444'
        }).setOrigin(0.5);
        indicator.add(letter);
        
        // Glow (hidden initially)
        const glow = this.scene.add.circle(0, 0, 12, this.pedagogyColor, 0);
        indicator.add(glow);
        
        indicator.setScrollFactor(0);
        indicator.setDepth(90);
        indicator.setAlpha(0.3);
        
        this.systemIndicators.set(systemName, { container: indicator, bg, letter, glow });
    }
    
    updateSystemIndicators() {
        for (const [name, mastery] of Object.entries(this.systemMastery)) {
            const indicator = this.systemIndicators.get(name);
            if (!indicator) continue;
            
            // Update based on state
            if (mastery.mastered) {
                indicator.letter.setFill('#20b2aa');
                indicator.glow.setAlpha(0.3);
                indicator.container.setAlpha(0.9);
            } else if (mastery.discovered) {
                indicator.letter.setFill('#666666');
                indicator.container.setAlpha(0.6);
            }
        }
    }
    
    // ===== HINT SYSTEM =====
    
    checkHintCondition(condition) {
        const scene = this.scene;
        
        switch (condition) {
            case 'low_movement':
                return this.playerBehavior.hesitationStreak > 3;
            case 'no_shooting':
                return scene.time.now - this.lastActionTime > 5000;
            case 'health_low':
                return scene.player?.health < 50;
            case 'near_miss_triggered':
                return scene.nearMissState?.active && !this.systemMastery['NEAR_MISS'].discovered;
            case 'bullet_time_active':
                return scene.nearMissState?.active;
            case 'near_miss_chain':
                return scene.nearMissState?.streak > 1;
            case 'echo_absorbed':
                return scene.echoStorm?.absorbedCount > 0;
            case 'momentum_full':
                return scene.fractureSystem?.momentum >= 100 && !scene.fractureSystem?.isFractured;
            case 'fracture_active':
                return scene.fractureSystem?.isFractured;
            case 'residue_spawned':
                return scene.temporalResidue?.nodes?.length > 0;
            case 'singularity_charged':
                return scene.singularitySystem?.charge >= 100;
            case 'resonance_chain':
                return scene.resonanceCascade?.chainSequence?.length >= 2;
            case 'weapon_evolved':
                return scene.omniWeapon?.slots?.BARREL !== null;
            case 'paradox_ready':
                return scene.paradoxEngine?.projectionCooldown <= 0;
            case 'chrono_ready':
                return !scene.chronoLoop?.isRecording && scene.chronoLoop?.pastEchoes?.length < 3;
            case 'quantum_death':
                return scene.quantumImmortality?.quantumEchoes?.length > 0;
            case 'combo_4plus':
                return this.countActiveSystems() >= 4;
            case 'novelty_high':
                return scene.architectSystem?.noveltyScore > 0.8;
            default:
                return false;
        }
    }
    
    showHint(text, duration = 4000, important = false) {
        if (!this.hintText) return;
        
        // Don't show hints during high stress (unless important)
        if (this.currentStress > 0.7 && !important) return;
        
        // Don't interrupt flow state with minor hints
        if (this.flowState && !important) return;
        
        // Cooldown check
        if (this.hintCooldown > 0 && !important) return;
        
        this.hintText.setText(text);
        
        // Animate in
        this.scene.tweens.add({
            targets: this.hintText,
            alpha: important ? 1 : 0.7,
            y: this.scene.scale.height - 45,
            duration: 400,
            ease: 'Power2'
        });
        
        // Animate out
        this.scene.tweens.add({
            targets: this.hintText,
            alpha: 0,
            y: this.scene.scale.height - 40,
            duration: 400,
            delay: duration,
            ease: 'Power2',
            onComplete: () => {
                this.hintText.setText('');
            }
        });
        
        this.hintCooldown = this.minHintInterval;
        
        // Log teaching moment
        this.learningProfile.teachingMoments = this.learningProfile.teachingMoments || [];
        this.learningProfile.teachingMoments.push({
            time: Date.now(),
            hint: text,
            stage: this.curriculumStage,
            stress: this.currentStress
        });
    }
    
    // ===== CURRICULUM MANAGEMENT =====
    
    updateCurriculumStage() {
        // Check if ready to advance
        const current = this.curriculum[this.curriculumStage];
        if (!current) return;
        
        let masteredCount = 0;
        for (const sys of current.systems) {
            if (this.systemMastery[sys]?.mastered) masteredCount++;
        }
        
        // Advance when 70% of stage systems mastered
        if (masteredCount >= current.systems.length * 0.7) {
            if (this.curriculumStage < this.curriculum.length - 1) {
                this.curriculumStage++;
                this.onStageAdvance();
            }
        }
    }
    
    onStageAdvance() {
        const stage = this.curriculum[this.curriculumStage];
        
        // Announce stage advancement
        this.showHint(`STAGE: ${stage.name}`, 5000, true);
        
        // Flash screen with pedagogical teal
        this.scene.cameras.main.flash(500, 32, 178, 170, 0.2);
    }
    
    // ===== CHALLENGE SYSTEM =====
    
    offerNewChallenge() {
        // Pick a challenge appropriate to current mastery
        const available = this.challenges.filter(c => {
            const mastery = this.systemMastery[c.id.split('_')[0].toUpperCase()];
            return mastery?.discovered && !mastery?.mastered;
        });
        
        if (available.length === 0) return;
        
        this.activeChallenge = available[Math.floor(Math.random() * available.length)];
        
        this.showHint(`CHALLENGE: ${this.activeChallenge.text} (+${this.activeChallenge.reward})`, 6000, true);
    }
    
    checkChallengeCompletion() {
        if (!this.activeChallenge) return;
        
        if (this.activeChallenge.check()) {
            // Challenge completed!
            this.showHint(`CHALLENGE COMPLETE! +${this.activeChallenge.reward}`, 4000, true);
            this.scene.score += this.activeChallenge.reward;
            this.activeChallenge = null;
            
            // Save completion
            this.learningProfile.completedChallenges = this.learningProfile.completedChallenges || [];
            this.learningProfile.completedChallenges.push(this.activeChallenge.id);
        }
    }
    
    // Challenge check functions
    checkGrazeChallenge() {
        // Would need to track grazes in last 5 seconds
        return false; // Placeholder
    }
    
    checkEchoChallenge() {
        return this.scene.echoStorm?.absorbedCount >= 10;
    }
    
    checkFractureKill() {
        // Would need to track kills during fracture
        return false; // Placeholder
    }
    
    checkComboChallenge(count) {
        return this.scene.resonanceCascade?.chainSequence?.length >= count;
    }
    
    checkParadoxChallenge() {
        // Would need to track perfect paradox completion
        return false; // Placeholder
    }
    
    // ===== UTILITY METHODS =====
    
    countActiveSystems() {
        let count = 0;
        const scene = this.scene;
        
        if (scene.nearMissState?.active) count++;
        if (scene.echoStorm?.absorbedCount > 0) count++;
        if (scene.fractureSystem?.isFractured) count++;
        if (scene.temporalResidue?.nodes?.length > 0) count++;
        if (scene.singularitySystem?.singularityActive) count++;
        if (scene.paradoxEngine?.projectionActive) count++;
        if (scene.chronoLoop?.isRecording || scene.chronoLoop?.pastEchoes?.length > 0) count++;
        if (scene.quantumImmortality?.quantumEchoes?.length > 0) count++;
        if (scene.resonanceCascade?.chainSequence?.length > 0) count++;
        
        return count;
    }
    
    pulseMasteryGlow() {
        const player = this.scene.player;
        if (!player) return;
        
        // Draw expanding ring
        const ring = this.scene.add.circle(player.x, player.y, 20, this.pedagogyColor, 0.5);
        ring.setDepth(46);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
    }
    
    // ===== PERSISTENCE =====
    
    loadLearningProfile() {
        try {
            const saved = localStorage.getItem('shooty_learning_profile');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load learning profile:', e);
        }
        
        return {
            curriculumStage: 0,
            teachingMode: 'EXPLORER',
            systemMastery: {},
            completedChallenges: [],
            teachingMoments: [],
            totalPlayTime: 0
        };
    }
    
    saveLearningProfile() {
        try {
            const profile = {
                curriculumStage: this.curriculumStage,
                teachingMode: this.teachingMode,
                systemMastery: this.systemMastery,
                completedChallenges: this.learningProfile.completedChallenges || [],
                teachingMoments: this.learningProfile.teachingMoments?.slice(-100) || [], // Keep last 100
                totalPlayTime: (this.learningProfile.totalPlayTime || 0) + (this.scene.time.now / 1000)
            };
            localStorage.setItem('shooty_learning_profile', JSON.stringify(profile));
        } catch (e) {
            console.warn('Failed to save learning profile:', e);
        }
    }
    
    // ===== MAIN UPDATE =====
    
    update(dt, player) {
        // Cooldown management
        if (this.hintCooldown > 0) {
            this.hintCooldown -= dt * 1000;
        }
        
        // Observe player
        this.observePlayerBehavior(dt, player);
        
        // Update visual indicators
        this.updateSystemIndicators();
        
        // Check challenges
        this.checkChallengeCompletion();
        
        // Periodically offer hints based on curriculum
        if (this.hintCooldown <= 0 && this.currentStress < 0.5 && !this.flowState) {
            const stage = this.curriculum[this.curriculumStage];
            if (stage) {
                for (const hint of stage.hints) {
                    if (this.checkHintCondition(hint.condition)) {
                        if (Math.random() < 0.3) { // Don't spam hints
                            this.showHint(hint.text, 4000);
                            break;
                        }
                    }
                }
            }
        }
    }
    
    // ===== DEATH ANALYSIS =====
    
    onPlayerDeath() {
        this.playerBehavior.deathCount++;
        
        // Analyze what could have helped
        const neglected = [];
        for (const [name, mastery] of Object.entries(this.systemMastery)) {
            if (mastery.discovered && !mastery.mastered && mastery.used < 3) {
                neglected.push(name);
            }
        }
        
        if (neglected.length > 0) {
            const system = neglected[Math.floor(Math.random() * neglected.length)];
            this.showHint(`Try using ${system.replace('_', ' ')} more...`, 6000, true);
        }
        
        this.saveLearningProfile();
    }
    
    destroy() {
        this.saveLearningProfile();
        
        if (this.hintText) this.hintText.destroy();
        if (this.masteryGlow) this.masteryGlow.destroy();
        
        for (const indicator of this.systemIndicators.values()) {
            indicator.container.destroy();
        }
        this.systemIndicators.clear();
    }
}
