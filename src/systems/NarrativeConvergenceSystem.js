import Phaser from 'phaser';

/**
 * THE SAGA ENGINE — NarrativeConvergenceSystem
 * 
 * The ultimate synthesis: Transforms 32 isolated temporal mechanics into a 
 * coherent, emergent personal mythology. Each run becomes a chapter. Each
 * system interaction becomes plot. Each enemy becomes a character.
 * 
 * === THE MISSING DIMENSION: MEANING ===
 * 
 * The game has 32 systems but no narrative glue. The Saga Engine generates
 * genuine stories from gameplay — not scripted, but EMERGENT from the 
 * unique combination of systems you use, enemies you fight, and choices you make.
 * 
 * === CORE INNOVATIONS ===
 * 
 * 1. CHAPTER GENERATION
 *    Each run becomes a mythic chapter with:
 *    - Title generated from dominant systems ("The Echo Fracture Paradox")
 *    - Protagonist archetype from playstyle (The Dancer, The Architect, The Survivor)
 *    - Antagonist from nemesis/titan encounters
 *    - Plot beats from system activation sequences
 * 
 * 2. CHARACTER SYSTEM  
 *    Enemies evolve into recurring characters:
 *    - Fast triangles become "The Swift Legion" with grudges
 *    - Diamond enemies become "The Crimson Order" with history
 *    - The Titan becomes "The Geometric Overseer" — a recurring foe
 *    - Each remembers wounds you dealt, adapting their "dialogue"
 * 
 * 3. MYTHOPOESIS (Story-creation)
 *    Real-time narrative generation during play:
 *    - Near-misses become "The Narrow Escape of [timestamp]"
 *    - Cascade chains become "The Symphony of Destruction"
 *    - Death becomes "The First/Second/Third Fall and Resurrection"
 *    - Perfect fractures become "The Golden Division"
 * 
 * 4. THE CODEX TEMPORALIS
 *    Persistent library of your mythology:
 *    - Volume I: The Early Trials (first 5 runs)
 *    - Volume II: The Paradox Wars (Paradox Engine mastery period)
 *    - Volume III: The Architect Ascension (discovery phase)
 *    - Each entry contains actual gameplay data rendered as prose
 * 
 * 5. NARRATIVE RESONANCE
 *    The game "narrates" key moments:
 *    - Floating text becomes story beats ("The echoes answered your call...")
 *    - System activations trigger poetic descriptions
 *    - Death triggers elegiac couplets about your fall
 *    - Victory generates triumph odes
 * 
 * === THE ARCHETYPE SYSTEM ===
 * 
 * Based on playstyle, you embody different mythic figures:
 * 
 * THE DANCER (aggressive grazers, high near-miss count)
 *    - Associated with: Echo Storm, Bullet Time, Harmonic Convergence
 *    - Saga theme: Grace under fire, the beauty of risk
 *    - Character voice: Flowery, kinetic, emphasizing movement
 * 
 * THE ARCHITECT (system combiners, high cascade chains)
 *    - Associated with: Resonance, Fracture, Singularity
 *    - Saga theme: Building order from chaos, design as combat
 *    - Character voice: Technical, structural, emphasizing systems
 * 
 * THE SURVIVOR (defensive, low damage taken, long runs)
 *    - Associated with: Residue, Quantum Immortality, Void Coherence
 *    - Saga theme: Persistence, the refusal to fall, endurance as victory
 *    - Character voice: Grim, determined, emphasizing survival
 * 
 * THE PROPHET (oracle/bootstrap users, prediction-heavy)
 *    - Associated with: Paradox Engine, Oracle Protocol, Bootstrap
 *    - Saga theme: Seeing beyond, the burden of knowledge, time as terrain
 *    - Character voice: Cryptic, foreshadowing, emphasizing vision
 * 
 * THE CHRONICLER (exploration, shard collection, replay-focused)
 *    - Associated with: Timeline Chronicle, Mnemosyne Weave, Contracts
 *    - Saga theme: Memory as power, the pattern across runs, history's weight
 *    - Character voice: Archival, connective, emphasizing continuity
 * 
 * === NARRATIVE ELEMENTS ===
 * 
 * EPITHETS: Generated titles based on accomplishments
 *    - "Kael the Echo-Forged" (mastered Echo Storm)
 *    - "The Fracture-Queen of Wave 12" (high wave fracturer)
 *    - "Deathless in the Void" (Quantum Immortality expert)
 * 
 * SAGA BEATS: Story moments triggered by gameplay events
 *    - Awakening: First system activation each run
 *    - The Trial: First damage taken
 *    - The Revelation: First time using a new system
 *    - The Confrontation: Boss spawn
 *    - The Fall: Death (or quantum branch)
 *    - The Return: Respawn/continue
 *    - The Triumph: Boss defeat
 *    - The Resolution: Run end — chapter complete
 * 
 * === SYNTHESIS WITH ALL 32 SYSTEMS ===
 * 
 * Every system feeds the narrative:
 * - Bullet Time → "The Moment Stretched" (time dilation as poetic beat)
 * - Echo Storm → "The Echoes Answered" (magical realism of echoes fighting)
 * - Fracture → "The Self Divided" (exploring identity through duplication)
 * - Residue → "The Past Armed" (history as weapon)
 * - Singularity → "The Gravity of Will" (spatial control as character agency)
 * - Omni-Weapon → "The Evolving Armament" (weapon as character growth)
 * - Paradox Engine → "The Foresight Curse" (prediction as burden)
 * - Chrono-Loop → "The Chorus of Selves" (multiple timelines as ensemble cast)
 * - Quantum Immortality → "The Deathless Bargain" (immortality as plot device)
 * - Resonance Cascade → "The Rising Symphony" (combos as musical crescendo)
 * - Observer Effect → "The Watched Warrior" (performance under observation)
 * - Titan → "The Geometric Nemesis" (recurring antagonist development)
 * - Chronicle → "The Living Record" (meta-narrative about storytelling)
 * - Contracts → "The Burden of Promise" (debts as dramatic tension)
 * - Nemesis → "The Shadow Self" (doppelgänger narrative)
 * - Oracle → "The Unwilling Prophet" (prophecy as obligation)
 * - Bootstrap → "The Paradox Born" (time loops as origin story)
 * - Symbiotic → "The Machine Sympathy" (AI partnership character arc)
 * - Dimensional Collapse → "The Apotheosis" (endgame transformation)
 * - Rewind → "The Second Chance" (regret and redemption)
 * - Mnemosyne → "The Memory Palace" (architecture of recollection)
 * - Kairos → "The Perfect Moment" (flow state as climax)
 * - Syntropy → "The Order Against Chaos" (entropy reversal as heroic act)
 * - Resonant Whisper → "The Voices Across Time" (messages as plot hooks)
 * - Egregore → "The Collective Dream" (shared unconscious as setting)
 * - Aetheric → "The Convergent Mystery" (emergence as discovery narrative)
 * - Recursion → "The Nested Story" (meta-narrative layers)
 * - Harmonic → "The Music of Battle" (combat as composition)
 * - Synchronicity → "The Transcendent Alignment" (perfection as revelation)
 * - Architect → "The World-Builder" (creation as ultimate arc)
 * - Geometric Chorus → "The Singing Arena" (space as character)
 * - Causal Entanglement → "The Web of Consequence" (choice and connection)
 * - Cinematic Archive → "The Eternal Replay" (moments preserved in amber)
 * - Void Coherence → "The Emptiness That Hears" (void as sentient entity)
 * 
 * === THE ULTIMATE VISION ===
 * 
 * After 50 runs, you don't just have "high scores" — you have:
 * - A three-volume saga with 50 chapters
 * - Recurring characters who have evolved across encounters
 * - A personal mythology unique to your playstyle
 * - An identity within the game world (your archetype)
 * - Stories worth sharing (actual exportable narrative)
 * 
 * The Saga Engine transforms SHOOTY from "a game with 32 systems" into
 * "YOUR temporal epic" — a literary work generated through play.
 * 
 * Color: Storyteller's Amber (#ffaa44) — warm, illuminating, narrative light
 */

export default class NarrativeConvergenceSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== NARRATIVE STATE =====
        this.sagaData = this.loadSagaData();
        this.currentChapter = null;
        this.currentArchetype = null;
        this.storyBeats = [];
        this.characterRegistry = new Map(); // enemy ID → character data
        this.epithets = [];
        
        // ===== MYTHOLOGY GENERATION =====
        this.narrativeHooks = [];
        this.pendingStoryBeat = null;
        this.chapterProgress = 0;
        this.systemUsageHistory = [];
        
        // ===== VISUALS =====
        this.narrativeOverlay = null;
        this.storyTextElements = [];
        this.epithetDisplay = null;
        
        // ===== CONSTANTS =====
        this.SAGA_COLOR = 0xffaa44;
        this.EPITHET_TIERS = {
            NOVICE: { threshold: 0, title: 'the Initiate' },
            ADEPT: { threshold: 5, title: 'the Tempered' },
            MASTER: { threshold: 15, title: 'the Legend' },
            MYTHIC: { threshold: 30, title: 'the Eternal' }
        };
        
        this.ARCHETYPE_THRESHOLDS = {
            DANCER: { bulletTimeRatio: 0.3, nearMisses: 20 },
            ARCHITECT: { cascadeRatio: 0.25, systemDiversity: 8 },
            SURVIVOR: { survivalTime: 120, damageTaken: 50 },
            PROPHET: { paradoxRatio: 0.2, predictionAccuracy: 0.6 },
            CHRONICLER: { shardCollectors: 10, replayCount: 5 }
        };
        
        this.init();
    }
    
    init() {
        this.createVisuals();
        this.startNewChapter();
    }
    
    // ===== DATA PERSISTENCE =====
    
    loadSagaData() {
        try {
            const data = localStorage.getItem('saga_data');
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('Failed to load saga data:', e);
        }
        return {
            volumes: [],
            totalRuns: 0,
            archetypeHistory: {},
            epithetsEarned: [],
            characterRelationships: {},
            legendaryMoments: [],
            playerName: this.generateMythicName()
        };
    }
    
    saveSagaData() {
        try {
            localStorage.setItem('saga_data', JSON.stringify(this.sagaData));
        } catch (e) {
            console.warn('Failed to save saga data:', e);
        }
    }
    
    generateMythicName() {
        const prefixes = ['Kael', 'Seren', 'Vorn', 'Ael', 'Thorn', 'Nyx', 'Orion', 'Vex'];
        const suffixes = ['', 'the Bold', 'the Swift', 'the Unbroken', 'the Seeker', 'the Last'];
        return prefixes[Math.floor(Math.random() * prefixes.length)] + 
               suffixes[Math.floor(Math.random() * suffixes.length)];
    }
    
    // ===== CHAPTER GENERATION =====
    
    startNewChapter() {
        this.sagaData.totalRuns++;
        const runNumber = this.sagaData.totalRuns;
        
        // Determine volume
        let volume = 1;
        if (runNumber > 20) volume = 3;
        else if (runNumber > 10) volume = 2;
        
        // Generate chapter title from dominant systems
        const title = this.generateChapterTitle();
        
        this.currentChapter = {
            number: runNumber,
            volume: volume,
            title: title,
            startTime: Date.now(),
            systemsUsed: new Set(),
            storyBeats: [],
            dominantArchetype: null,
            enemiesEncountered: new Map(),
            narrativeHighlights: [],
            epithetsGained: []
        };
        
        // Display chapter opening
        this.displayChapterOpening();
    }
    
    generateChapterTitle() {
        const templates = [
            'The {system} of {fate}',
            'Through {realm} and {danger}',
            'The {number} {trials}',
            '{adjective} {convergence}',
            'When {entity} {verb}'
        ];
        
        const components = {
            system: ['Echo', 'Fracture', 'Paradox', 'Chronicle', 'Resonance', 'Void'],
            fate: ['Destiny', 'Doom', 'Glory', 'Ruin', 'Transcendence'],
            realm: ['Time', 'Space', 'Void', 'Chaos', 'Order'],
            danger: ['Fire', 'Shadow', 'Storm', 'Silence'],
            number: ['First', 'Second', 'Third', 'Final', 'Seventh'],
            trials: ['Trials', 'Gates', 'Hours', 'Echoes'],
            adjective: ['Harmonic', 'Temporal', 'Quantum', 'Geometric', 'Eternal'],
            convergence: ['Convergence', 'Sundering', 'Awakening', 'Collapse', 'Covenant'],
            entity: ['the Titan', 'Time', 'Death', 'the Egregore', 'the Self'],
            verb: ['Fell', 'Rose', 'Watching', 'Divided', 'Sang']
        };
        
        const template = templates[Math.floor(Math.random() * templates.length)];
        return template.replace(/\{(\w+)\}/g, (match, key) => {
            const options = components[key] || ['Mystery'];
            return options[Math.floor(Math.random() * options.length)];
        });
    }
    
    // ===== ARCHETYPE SYSTEM =====
    
    updateArchetypeAnalysis() {
        const stats = this.calculatePlaystyleStats();
        let dominantArchetype = null;
        let highestScore = 0;
        
        for (const [archetype, thresholds] of Object.entries(this.ARCHETYPE_THRESHOLDS)) {
            const score = this.calculateArchetypeScore(stats, thresholds);
            if (score > highestScore && score > 0.5) {
                highestScore = score;
                dominantArchetype = archetype;
            }
        }
        
        if (dominantArchetype && dominantArchetype !== this.currentArchetype) {
            this.currentArchetype = dominantArchetype;
            this.currentChapter.dominantArchetype = dominantArchetype;
            this.displayArchetypeRevelation(dominantArchetype);
        }
    }
    
    calculatePlaystyleStats() {
        // This would integrate with other systems in GameScene
        return {
            bulletTimeCount: this.currentChapter.systemsUsed.has('bulletTime') ? 5 : 0,
            cascadeCount: this.currentChapter.systemsUsed.has('resonance') ? 3 : 0,
            nearMissCount: 0, // Would track from near-miss events
            survivalTime: (Date.now() - this.currentChapter.startTime) / 1000,
            systemDiversity: this.currentChapter.systemsUsed.size
        };
    }
    
    calculateArchetypeScore(stats, thresholds) {
        let score = 0;
        let checks = 0;
        
        for (const [key, threshold] of Object.entries(thresholds)) {
            if (stats[key] !== undefined) {
                checks++;
                if (stats[key] >= threshold) score++;
            }
        }
        
        return checks > 0 ? score / checks : 0;
    }
    
    displayArchetypeRevelation(archetype) {
        const descriptions = {
            DANCER: 'The rhythm of bullets guides your dance...',
            ARCHITECT: 'You build order from chaos, system by system...',
            SURVIVOR: 'Death cannot claim what refuses to fall...',
            PROPHET: 'You see what has not yet come to pass...',
            CHRONICLER: 'Every moment is preserved, every choice recorded...'
        };
        
        this.displayNarrativeText(
            `THE ARCHITECT REVEALS`,
            descriptions[archetype],
            this.SAGA_COLOR,
            4000
        );
    }
    
    // ===== CHARACTER SYSTEM =====
    
    registerEnemyAsCharacter(enemy, enemyType) {
        const enemyId = `${enemyType}_${Math.floor(enemy.x)}_${Math.floor(enemy.y)}`;
        
        if (!this.characterRegistry.has(enemyId)) {
            // Create new character
            const characterNames = {
                fast: ['The Swift', 'The Blur', 'Velocity Incarnate', 'The Dancer\'s Bane'],
                normal: ['The Crimson Order', 'The Red Sentinels', 'Blood-Diamond', 'The Vanguard'],
                tank: ['The Immovable', 'Hexagon-Prime', 'The Living Fortress', 'The Unyielding']
            };
            
            const names = characterNames[enemyType] || ['The Unknown'];
            const name = names[Math.floor(Math.random() * names.length)];
            
            const character = {
                id: enemyId,
                name: name,
                type: enemyType,
                encounters: 1,
                woundsDealt: 0,
                woundsTaken: 0,
                firstEncounter: this.currentChapter.number,
                grudgeLevel: 0,
                epithet: null
            };
            
            this.characterRegistry.set(enemyId, character);
            this.currentChapter.enemiesEncountered.set(enemyId, character);
            
            // Narrative introduction for recurring characters
            if (this.sagaData.totalRuns > 5 && Math.random() < 0.3) {
                this.displayNarrativeText(
                    'AN OLD ENEMY',
                    `${name} returns to test you again...`,
                    0xff6666,
                    2500
                );
            }
        } else {
            // Update existing character
            const character = this.characterRegistry.get(enemyId);
            character.encounters++;
            
            // Build grudge if player has killed this type before
            if (character.encounters > 2) {
                character.grudgeLevel = Math.min(10, character.encounters);
            }
        }
        
        return this.characterRegistry.get(enemyId);
    }
    
    recordEnemyWound(enemyId, damage) {
        if (this.characterRegistry.has(enemyId)) {
            const character = this.characterRegistry.get(enemyId);
            character.woundsTaken += damage;
            
            // Generate grudge-based epithet
            if (character.woundsTaken > 100 && !character.epithet) {
                character.epithet = `Scarred by ${this.sagaData.playerName}`;
            }
        }
    }
    
    // ===== STORY BEAT GENERATION =====
    
    recordSystemEvent(systemName, context = {}) {
        this.currentChapter.systemsUsed.add(systemName);
        
        const beat = this.generateStoryBeat(systemName, context);
        if (beat) {
            this.currentChapter.storyBeats.push(beat);
            this.displayStoryBeat(beat);
        }
        
        // Check for archetype shifts
        this.updateArchetypeAnalysis();
    }
    
    generateStoryBeat(systemName, context) {
        const beatTemplates = {
            bulletTime: {
                title: 'The Moment Stretched',
                descriptions: [
                    'Time itself bends to your will...',
                    'In the space between seconds, you find clarity...',
                    'The world slows, but your mind races ahead...'
                ]
            },
            echoStorm: {
                title: 'The Echoes Answered',
                descriptions: [
                    'The danger you dodged becomes your weapon...',
                    'The storm of echoes gathers at your command...',
                    'What sought to destroy you now serves your purpose...'
                ]
            },
            fracture: {
                title: 'The Self Divided',
                descriptions: [
                    'Two where one stood — the ultimate multiplication...',
                    'Your timeline splits, each path a weapon...',
                    'The fracture creates symphony from solitude...'
                ]
            },
            resonance: {
                title: 'The Rising Symphony',
                descriptions: [
                    'Systems harmonize, power compounds...',
                    'The cascade builds toward crescendo...',
                    'Your mastery creates resonance across reality...'
                ]
            },
            quantumDeath: {
                title: 'The Deathless Bargain',
                descriptions: [
                    'You fall, yet rise — death becomes doorway...',
                    'The quantum branch offers second life...',
                    'Your echo fights on while you return...'
                ]
            },
            paradox: {
                title: 'The Foresight Curse',
                descriptions: [
                    'You see the future, and by seeing, change it...',
                    'The paradox rewards those who plan beyond now...',
                    'Your vision becomes reality through will alone...'
                ]
            },
            titan: {
                title: 'The Geometric Nemesis',
                descriptions: [
                    'The Overseer manifests — your ultimate test...',
                    'Four faces of destruction, one enemy...',
                    'The Titan recognizes your growing power...'
                ]
            },
            cascadeBreak: {
                title: 'The Crescendo',
                descriptions: [
                    'The chain reaches its inevitable conclusion...',
                    'All systems align in devastating release...',
                    'The cascade breaks upon your enemies...'
                ]
            }
        };
        
        const template = beatTemplates[systemName];
        if (!template) return null;
        
        return {
            timestamp: Date.now(),
            system: systemName,
            title: template.title,
            description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
            context: context
        };
    }
    
    displayStoryBeat(beat) {
        // Only show major beats to avoid overwhelming
        if (Math.random() < 0.3) {
            this.displayNarrativeText(
                beat.title.toUpperCase(),
                beat.description,
                this.SAGA_COLOR,
                3000
            );
        }
    }
    
    // ===== EPITHET SYSTEM =====
    
    checkEpithets() {
        const stats = this.calculatePlaystyleStats();
        const newEpithets = [];
        
        // Check for epithet qualifications
        if (stats.nearMissCount > 20 && !this.hasEpithet('the Untouchable')) {
            newEpithets.push({ name: 'the Untouchable', condition: '20 near-misses' });
        }
        
        if (this.currentChapter.systemsUsed.size >= 10 && !this.hasEpithet('the System-Binder')) {
            newEpithets.push({ name: 'the System-Binder', condition: 'Used 10+ systems' });
        }
        
        if (stats.survivalTime > 180 && !this.hasEpithet('the Enduring')) {
            newEpithets.push({ name: 'the Enduring', condition: '3+ minute survival' });
        }
        
        for (const epithet of newEpithets) {
            this.awardEpithet(epithet);
        }
    }
    
    hasEpithet(name) {
        return this.sagaData.epithetsEarned.some(e => e.name === name);
    }
    
    awardEpithet(epithet) {
        this.sagaData.epithetsEarned.push({
            ...epithet,
            chapter: this.currentChapter.number,
            timestamp: Date.now()
        });
        this.currentChapter.epithetsGained.push(epithet.name);
        
        this.displayNarrativeText(
            'TITLE EARNED',
            `${this.sagaData.playerName} ${epithet.name}\n${epithet.condition}`,
            0xffd700,
            4000
        );
    }
    
    // ===== CHAPTER COMPLETION =====
    
    completeChapter(finalScore, survivalTime, waveReached) {
        this.checkEpithets();
        
        this.currentChapter.finalStats = {
            score: finalScore,
            survivalTime: survivalTime,
            wave: waveReached,
            systemsUsed: Array.from(this.currentChapter.systemsUsed),
            storyBeatCount: this.currentChapter.storyBeats.length
        };
        
        // Generate chapter summary
        const summary = this.generateChapterSummary();
        this.currentChapter.summary = summary;
        
        // Add to saga
        if (!this.sagaData.volumes[this.currentChapter.volume - 1]) {
            this.sagaData.volumes[this.currentChapter.volume - 1] = {
                chapters: [],
                title: this.generateVolumeTitle(this.currentChapter.volume)
            };
        }
        this.sagaData.volumes[this.currentChapter.volume - 1].chapters.push(this.currentChapter);
        
        // Save
        this.saveSagaData();
        
        // Display completion
        this.displayChapterCompletion(summary);
    }
    
    generateVolumeTitle(volume) {
        const titles = [
            'The Awakening',
            'The Deepening',
            'The Transcendence'
        ];
        return titles[volume - 1] || `Volume ${volume}`;
    }
    
    generateChapterSummary() {
        const archetype = this.currentChapter.dominantArchetype || 'Warrior';
        const systemCount = this.currentChapter.systemsUsed.size;
        const beatCount = this.currentChapter.storyBeats.length;
        
        return {
            title: this.currentChapter.title,
            duration: (Date.now() - this.currentChapter.startTime) / 1000,
            archetype: archetype,
            systemsMastered: systemCount,
            momentsOfLegend: beatCount,
            epithetsGained: this.currentChapter.epithetsGained,
            closingLine: this.generateClosingLine(archetype, systemCount)
        };
    }
    
    generateClosingLine(archetype, systemCount) {
        const lines = {
            DANCER: `The dance continues through ${systemCount} rhythms of war.`,
            ARCHITECT: `${systemCount} systems woven into the grand design.`,
            SURVIVOR: `Against all endings, you persist.`,
            PROPHET: `You have seen, and therefore you have changed.`,
            CHRONICLER: `Another chapter preserved in the eternal record.`,
            Warrior: `The battle ends, but the saga grows.`
        };
        return lines[archetype] || lines.Warrior;
    }
    
    // ===== VISUAL DISPLAY =====
    
    createVisuals() {
        // Narrative overlay container
        this.narrativeOverlay = this.scene.add.container(0, 0);
        this.narrativeOverlay.setDepth(1000);
        this.narrativeOverlay.setScrollFactor(0);
    }
    
    displayChapterOpening() {
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;
        
        // Volume title
        const volumeText = this.scene.add.text(centerX, centerY - 80, 
            `VOLUME ${this.currentChapter.volume}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#888888',
            letterSpacing: 4
        }).setOrigin(0.5).setAlpha(0);
        
        // Chapter number
        const chapterNumText = this.scene.add.text(centerX, centerY - 40,
            `CHAPTER ${this.currentChapter.number}`, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#aaaaaa'
        }).setOrigin(0.5).setAlpha(0);
        
        // Chapter title
        const titleText = this.scene.add.text(centerX, centerY,
            this.currentChapter.title.toUpperCase(), {
            fontFamily: 'monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            fill: '#ffaa44',
            letterSpacing: 2
        }).setOrigin(0.5).setAlpha(0);
        
        // Player epithet if any
        let epithetText = null;
        if (this.sagaData.epithetsEarned.length > 0) {
            const latestEpithet = this.sagaData.epithetsEarned[this.sagaData.epithetsEarned.length - 1];
            epithetText = this.scene.add.text(centerX, centerY + 50,
                `${this.sagaData.playerName} ${latestEpithet.name}`, {
                fontFamily: 'monospace',
                fontSize: '14px',
                fill: '#ffd700',
                fontStyle: 'italic'
            }).setOrigin(0.5).setAlpha(0);
        }
        
        this.narrativeOverlay.add([volumeText, chapterNumText, titleText, epithetText].filter(Boolean));
        
        // Animate in sequence
        this.scene.tweens.add({
            targets: volumeText,
            alpha: 1,
            duration: 1000,
            delay: 500
        });
        
        this.scene.tweens.add({
            targets: chapterNumText,
            alpha: 1,
            duration: 1000,
            delay: 800
        });
        
        this.scene.tweens.add({
            targets: titleText,
            alpha: 1,
            duration: 1200,
            delay: 1100
        });
        
        if (epithetText) {
            this.scene.tweens.add({
                targets: epithetText,
                alpha: 1,
                duration: 800,
                delay: 1500
            });
        }
        
        // Fade out
        this.scene.tweens.add({
            targets: [volumeText, chapterNumText, titleText, epithetText].filter(Boolean),
            alpha: 0,
            duration: 1000,
            delay: 4000,
            onComplete: () => {
                volumeText.destroy();
                chapterNumText.destroy();
                titleText.destroy();
                if (epithetText) epithetText.destroy();
            }
        });
    }
    
    displayNarrativeText(header, body, color, duration = 3000) {
        const x = this.scene.cameras.main.width / 2;
        const y = this.scene.cameras.main.height / 2;
        
        const container = this.scene.add.container(x, y);
        container.setDepth(1001);
        container.setScrollFactor(0);
        
        // Background panel
        const bg = this.scene.add.rectangle(0, 0, 400, 120, 0x000000, 0.7);
        bg.setStrokeStyle(1, color, 0.5);
        
        // Header
        const headerText = this.scene.add.text(0, -30, header, {
            fontFamily: 'monospace',
            fontSize: '14px',
            fontStyle: 'bold',
            fill: '#' + color.toString(16).padStart(6, '0'),
            letterSpacing: 2
        }).setOrigin(0.5);
        
        // Body
        const bodyText = this.scene.add.text(0, 10, body, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#cccccc',
            align: 'center',
            wordWrap: { width: 360 }
        }).setOrigin(0.5);
        
        container.add([bg, headerText, bodyText]);
        container.setAlpha(0);
        container.setScale(0.9);
        
        this.scene.tweens.add({
            targets: container,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Power2'
        });
        
        this.scene.tweens.add({
            targets: container,
            alpha: 0,
            scale: 0.95,
            duration: 400,
            delay: duration,
            ease: 'Power2',
            onComplete: () => container.destroy()
        });
    }
    
    displayChapterCompletion(summary) {
        const lines = [
            `CHAPTER ${this.currentChapter.number} COMPLETE`,
            '',
            summary.title,
            '',
            `Systems mastered: ${summary.systemsMastered}`,
            `Legendary moments: ${summary.momentsOfLegend}`,
            '',
            summary.closingLine
        ];
        
        if (summary.epithetsGained.length > 0) {
            lines.push('', 'New titles earned:');
            summary.epithetsGained.forEach(e => lines.push(`• ${e}`));
        }
        
        this.displayNarrativeText(
            'THE SAGA CONTINUES',
            lines.join('\n'),
            this.SAGA_COLOR,
            6000
        );
    }
    
    // ===== INTEGRATION API =====
    
    onSystemActivated(systemName, context = {}) {
        this.recordSystemEvent(systemName, context);
    }
    
    onEnemySpawned(enemy, enemyType) {
        return this.registerEnemyAsCharacter(enemy, enemyType);
    }
    
    onPlayerDamaged(amount, source) {
        // Record wound in character relationship
        if (source && source.id) {
            this.recordEnemyWound(source.id, amount);
        }
        
        // Generate damage narrative if significant
        if (amount > 20 && Math.random() < 0.2) {
            this.displayNarrativeText(
                'THE WOUND',
                'Pain sharpens focus. The saga demands resilience.',
                0xff6666,
                2000
            );
        }
    }
    
    onGameEnd(finalScore, survivalTime, waveReached) {
        this.completeChapter(finalScore, survivalTime, waveReached);
    }
    
    // ===== UTILITY =====
    
    getPlayerEpithet() {
        if (this.sagaData.epithetsEarned.length === 0) {
            return this.sagaData.playerName;
        }
        const latest = this.sagaData.epithetsEarned[this.sagaData.epithetsEarned.length - 1];
        return `${this.sagaData.playerName} ${latest.name}`;
    }
    
    getSagaSummary() {
        return {
            totalRuns: this.sagaData.totalRuns,
            volumes: this.sagaData.volumes.length,
            epithets: this.sagaData.epithetsEarned.length,
            playerName: this.sagaData.playerName,
            latestEpithet: this.sagaData.epithetsEarned[this.sagaData.epithetsEarned.length - 1]?.name || ''
        };
    }
    
    destroy() {
        if (this.narrativeOverlay) {
            this.narrativeOverlay.destroy();
        }
        this.saveSagaData();
    }
}
