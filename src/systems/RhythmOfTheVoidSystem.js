import Phaser from 'phaser';

/**
 * THE RHYTHM OF THE VOID — The 45th Cognitive Dimension: MUSICAL ONTOGENESIS
 * 
 * The completion of the synaesthetic loop: Not only does gameplay create music,
 * but music creates gameplay. The generative soundtrack becomes the SPAWNING LOGIC —
 * bass drops birth enemy waves, hi-hats scatter bullet patterns, melodies trace
 * movement paths through the void.
 * 
 * === THE MUSICAL ONTOLOGY ===
 * 
 * | Musical Element | Gameplay Manifestation |
 * |-----------------|------------------------|
 * | Kick drum (beat 1) | Enemy spawn pulse — each kick risks new adversary |
 * | Snare (beat 2/4) | Bullet spray burst — directional scatter pattern |
 * | Hi-hat (off-beats) | Warning indicators — future bullet positions flash |
 * | Bass drop | Elite spawn + arena distortion — gravity wells activate |
 * | Melody peak | Safe corridor revelation — cyan path through chaos |
 * | Chord progression | Enemy formation shift — geometric reorganization |
 * | Silence/rest | Resource regeneration — brief sanctuary |
 * | Tempo increase | Time dilation intensifies — bullet time extends |
 * 
 * === RHYTHMIC TACTICALITY ===
 * 
 * Expert players INTERNALIZE THE BEAT:
 * - Shoot on the downbeat for damage multipliers (×1.5)
 * - Dodge on off-beats when hi-hats trigger bullet warnings
 * - Activate systems during rests for reduced cooldowns
 * - Move with the melody to find auto-generated safe paths
 * 
 * The game becomes a RHYTHM ACTION BULLET HELL — where musicality is not
 * optional atmosphere but MANDATORY MASTERY.
 * 
 * === THE BEAT MATRIX (128 BPM = 1.875s per measure) ===
 * 
 * Measure structure: [1] [e] [+] [a] [2] [e] [+] [a] [3] [e] [+] [a] [4] [e] [+] [a]
 *                   KICK    HAT     SNARE   HAT     KICK    HAT     SNARE   HAT
 * 
 * - KICK (beats 1, 3): Spawn check — enemy emergence window opens
 * - SNARE (beats 2, 4): Bullet burst — directional warning lines appear
 * - HAT (all 'e' and '+'): Precision indicators — safe/danger zones flash
 * 
 * === SYNCHRONICITY WITH EXISTING SYSTEMS ===
 * 
 * - Synaesthesia Protocol: Drives the generative engine this reads from
 * - Echo Storm: Echo absorptions sync to beat for bonus echoes
 * - Resonance Cascade: Chain activations on-beat multiply damage ×2
 * - Paradox Engine: Future echoes move along melody-derived paths
 * - Tychos Aurora: Aurora patterns follow harmonic progressions
 * - Geometric Chorus: Wall shifts occur only on measure boundaries
 * - Oracle Protocol: Prophecies show as musical notation (visual staff)
 * - Rival Protocol: Rivals spawn with leitmotifs — you hear them before seeing them
 * 
 * === THE MISSING COMPLETION ===
 * 
 * This is the 45th dimension because it inverts the 42nd (Synaesthesia).
 * Where 42 was GAMEPLAY→AUDIO, this is AUDIO→GAMEPLAY — creating the first
 * truly BIDIRECTIONAL synaesthetic game where player and soundtrack are
 * locked in an ontological dance, each creating the other.
 * 
 * Color: Rhythmic Gold (#ffd700) pulsing to the beat — the color of sound made visible
 * 
 * "In the beginning was the rhythm, and the rhythm was with the void, 
 *  and the rhythm was the void."
 */

export default class RhythmOfTheVoidSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== MUSICAL PARAMETERS =====
        this.bpm = 128;
        this.beatDuration = 60 / this.bpm; // 0.46875 seconds
        this.measureDuration = this.beatDuration * 4; // 1.875 seconds
        
        // ===== BEAT TRACKING =====
        this.currentBeat = 0; // 0-15 for 16th notes
        this.currentMeasure = 0;
        this.lastBeatTime = 0;
        this.beatPhase = 0; // 0.0-1.0 through current beat
        
        // ===== SPAWN WINDOWS =====
        this.spawnWindows = {
            kick: { active: false, intensity: 0 },    // Beats 1, 3
            snare: { active: false, intensity: 0 },    // Beats 2, 4
            hat: { active: false, pattern: null },       // Off-beats
            melody: { active: false, note: null },      // Peak moments
            bass: { active: false, drop: false }        // Sub-bass events
        };
        
        // ===== RHYTHM TACTICALITY =====
        this.onBeatBonus = 1.5;          // Damage multiplier for on-beat actions
        this.offBeatPenalty = 0.8;       // Slight reduction for mistimed shots
        this.lastActionBeat = -1;        // Track when player last acted
        this.playerRhythmScore = 0;      // Cumulative rhythmic accuracy
        this.rhythmStreak = 0;           // Consecutive on-beat actions
        
        // ===== VISUAL METRONOME =====
        this.beatIndicator = null;
        this.measureRing = null;
        this.pulseEffects = [];
        
        // ===== PREDICTIVE VISUALIZATION =====
        this.spawnPreviews = [];         // Ghost enemies showing future spawns
        this.bulletWarnings = [];        // Warning lines for incoming bursts
        this.safeCorridors = [];         // Melody-derived safe paths
        
        // ===== SYNERGY STATE =====
        this.synaesthesiaRef = null;     // Reference to audio system
        this.nextSpawnOnBeat = false;    // Flag for rhythm-synced spawning
        this.rhythmDilation = 1.0;       // Time scale based on musical intensity
        
        // Colors
        this.RHYTHM_GOLD = 0xffd700;
        this.RHYTHM_GLOW = 0xffed4a;
        this.WARNING_RED = 0xff3366;
        this.SAFE_CYAN = 0x00f0ff;
        
        // Throttling for performance
        this.renderInterval = 2; // Update visuals every 2nd frame
        this.renderCounter = 0;
        
        this.init();
    }
    
    init() {
        this.createVisualElements();
        this.connectToSynaesthesia();
        this.startBeatTracking();
    }
    
    createVisualElements() {
        // Central beat indicator
        this.beatIndicator = this.scene.add.graphics();
        this.beatIndicator.setDepth(90);
        
        // Measure ring that expands/contracts
        this.measureRing = this.scene.add.graphics();
        this.measureRing.setDepth(89);
        
        // Beat flash effect
        this.beatFlash = this.scene.add.graphics();
        this.beatFlash.setDepth(88);
    }
    
    connectToSynaesthesia() {
        // Get reference to Synaesthesia Protocol
        this.synaesthesiaRef = this.scene.synaesthesiaProtocol;
        
        if (this.synaesthesiaRef) {
            // Subscribe to audio events
            this.synaesthesiaRef.onBeat = (beatData) => this.onAudioBeat(beatData);
            this.synaesthesiaRef.onMeasure = (measureData) => this.onAudioMeasure(measureData);
        }
    }
    
    startBeatTracking() {
        this.trackStartTime = this.scene.time.now;
        this.lastBeatTime = this.trackStartTime;
    }
    
    // ===== AUDIO EVENT HANDLERS =====
    
    onAudioBeat(beatData) {
        if (!beatData) return;
        const { beat, type, intensity } = beatData;
        
        // Activate spawn windows based on beat type
        switch (type) {
            case 'kick':
                this.spawnWindows.kick = { active: true, intensity };
                this.triggerKickEvent(intensity);
                break;
            case 'snare':
                this.spawnWindows.snare = { active: true, intensity };
                this.triggerSnareEvent(intensity);
                break;
            case 'hat':
                this.spawnWindows.hat = { active: true, pattern: beatData.pattern };
                this.triggerHatEvent(beatData);
                break;
        }
        
        // Visual pulse
        this.pulseToBeat(type, intensity);
        
        // Update current beat tracking
        this.currentBeat = beat;
        this.lastBeatTime = this.scene.time.now;
    }
    
    onAudioMeasure(measureData) {
        if (!measureData) return;
        const { measure, chord, tension } = measureData;
        
        this.currentMeasure = measure;
        
        // Bass drop detection triggers elite spawn
        if (measureData.bassDrop) {
            this.spawnWindows.bass = { active: true, drop: true };
            this.triggerBassDropEvent();
        }
        
        // Melody peaks reveal safe corridors
        if (measureData.melodyPeak) {
            this.spawnWindows.melody = { active: true, note: measureData.melodyNote };
            this.generateMelodyCorridor(measureData.melodyNote);
        }
        
        // Chord progression shifts formations
        this.applyChordFormation(chord, tension);
    }
    
    // ===== MUSICAL GAMEPLAY EVENTS =====
    
    triggerKickEvent(intensity) {
        // Kick drums spawn enemies — probability based on intensity
        const spawnChance = 0.3 + (intensity * 0.4); // 30-70% chance
        
        if (Math.random() < spawnChance && this.scene.gameActive) {
            // Preview the spawn 2 beats early
            this.previewSpawn();
            
            // Schedule actual spawn on next kick
            this.nextSpawnOnBeat = true;
            
            // Announce to other systems
            if (this.scene.resonanceCascade) {
                this.scene.resonanceCascade.recordActivation('RHYTHM_KICK', { intensity });
            }
        }
    }
    
    triggerSnareEvent(intensity) {
        // Snares trigger bullet burst warnings
        const warningCount = Math.floor(3 + intensity * 5); // 3-8 warnings
        
        this.createBulletWarnings(warningCount);
        
        // Rival Protocol: Rivals telegraph with snare hits
        if (this.scene.rivalProtocol) {
            const activeRivals = this.scene.rivalProtocol.activeRivals;
            activeRivals.forEach(rival => {
                this.announceRivalAction(rival, 'snare');
            });
        }
    }
    
    triggerHatEvent(beatData) {
        // Hi-hats show precision indicators
        const { subdivision } = beatData; // 'e', '+', or 'a'
        
        // Flash safe/danger zones
        this.flashRhythmIndicators(subdivision);
        
        // Echo Storm: Perfect echo absorption timing on '+' (the "and")
        if (subdivision === '+' && this.scene.echoStorm) {
            this.scene.echoStorm.rhythmBonus = true;
            this.scene.time.delayedCall(this.beatDuration * 500, () => {
                if (this.scene.echoStorm) this.scene.echoStorm.rhythmBonus = false;
            });
        }
    }
    
    triggerBassDropEvent() {
        // Bass drops are MAJOR events
        
        // 1. Spawn elite enemy
        this.scheduleEliteSpawn();
        
        // 2. Distort arena geometry (Geometric Chorus)
        if (this.scene.geometricChorus) {
            this.scene.geometricChorus.triggerRhythmDistortion();
        }
        
        // 3. Screen shake and visual effects
        this.scene.cameras.main.shake(500, 0.02);
        
        // 4. Announce
        this.showRhythmText('BASS DROP', '#ff00ff');
        
        // 5. Temporarily increase spawn rate
        this.spawnMultiplier = 2.0;
        this.scene.time.delayedCall(5000, () => {
            this.spawnMultiplier = 1.0;
        });
    }
    
    // ===== RHYTHMIC TACTICALITY =====
    
    checkRhythmAccuracy() {
        // Called when player fires or activates system
        const timeSinceLastBeat = (this.scene.time.now - this.lastBeatTime) / 1000;
        const beatPhase = timeSinceLastBeat / this.beatDuration;
        
        // "On beat" is within 15% of beat center
        const isOnBeat = beatPhase < 0.15 || beatPhase > 0.85;
        const isOffBeat = beatPhase > 0.35 && beatPhase < 0.65;
        
        if (isOnBeat) {
            this.rhythmStreak++;
            this.playerRhythmScore += 10;
            return 'on_beat';
        } else if (isOffBeat) {
            this.rhythmStreak = 0;
            return 'off_beat';
        }
        
        return 'neutral';
    }
    
    getRhythmBonus() {
        const accuracy = this.checkRhythmAccuracy();
        
        switch (accuracy) {
            case 'on_beat':
                // Visual feedback
                this.flashOnBeatIndicator();
                return this.onBeatBonus + (this.rhythmStreak * 0.1); // Stacking bonus
            case 'off_beat':
                return this.offBeatPenalty;
            default:
                return 1.0;
        }
    }
    
    // ===== VISUAL PREDICTION SYSTEM =====
    
    previewSpawn() {
        // Show ghost enemy 2 beats before spawn
        const player = this.scene.player;
        const angle = Math.random() * Math.PI * 2;
        const distance = 400 + Math.random() * 300;
        
        const ghostX = Phaser.Math.Clamp(
            player.x + Math.cos(angle) * distance,
            100, 1820
        );
        const ghostY = Phaser.Math.Clamp(
            player.y + Math.sin(angle) * distance,
            100, 1340
        );
        
        // Create ghost preview
        const ghost = this.scene.add.graphics();
        ghost.lineStyle(2, this.WARNING_RED, 0.4);
        ghost.strokeCircle(0, 0, 20);
        ghost.fillStyle(this.WARNING_RED, 0.1);
        ghost.fillCircle(0, 0, 20);
        ghost.x = ghostX;
        ghost.y = ghostY;
        
        // Pulse animation
        this.scene.tweens.add({
            targets: ghost,
            scale: 1.3,
            alpha: 0.2,
            duration: this.beatDuration * 1000,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                ghost.destroy();
                // Spawn real enemy here
                if (this.nextSpawnOnBeat) {
                    this.executeSpawn(ghostX, ghostY);
                    this.nextSpawnOnBeat = false;
                }
            }
        });
        
        this.spawnPreviews.push(ghost);
    }
    
    createBulletWarnings(count) {
        // Show warning lines where bullets will appear
        const player = this.scene.player;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.5);
            const distance = 600;
            
            const startX = player.x + Math.cos(angle) * distance;
            const startY = player.y + Math.sin(angle) * distance;
            
            // Warning line
            const graphics = this.scene.add.graphics();
            graphics.lineStyle(2, this.WARNING_RED, 0.5);
            graphics.lineBetween(startX, startY, player.x, player.y);
            
            // Fade out
            this.scene.tweens.add({
                targets: graphics,
                alpha: 0,
                duration: this.beatDuration * 2000,
                onComplete: () => graphics.destroy()
            });
            
            // Actually spawn bullets after warning
            this.scene.time.delayedCall(this.beatDuration * 1000, () => {
                this.scene.spawnEnemyBullet(startX, startY, angle + Math.PI, 250);
            });
        }
    }
    
    generateMelodyCorridor(note) {
        // Create a safe path based on the musical note
        const player = this.scene.player;
        
        // Map note frequency to direction
        const direction = (note.frequency % 360) * (Math.PI / 180);
        const length = 200 + note.velocity * 300;
        
        // Create corridor nodes
        const corridor = [];
        for (let i = 1; i <= 5; i++) {
            const t = i / 5;
            const x = player.x + Math.cos(direction) * length * t;
            const y = player.y + Math.sin(direction) * length * t;
            
            // Visual node
            const node = this.scene.add.circle(x, y, 8, this.SAFE_CYAN, 0.3);
            node.setDepth(25);
            
            // Pulse to melody
            this.scene.tweens.add({
                targets: node,
                scale: 1.5,
                alpha: 0.6,
                duration: note.duration * 1000,
                yoyo: true,
                repeat: -1
            });
            
            corridor.push(node);
        }
        
        // Auto-clean after measure
        this.scene.time.delayedCall(this.measureDuration * 1000, () => {
            corridor.forEach(node => node.destroy());
        });
        
        this.safeCorridors = corridor;
    }
    
    // ===== SPAWN EXECUTION =====
    
    executeSpawn(x, y) {
        // Spawn enemy at rhythm-determined location
        const enemy = new this.scene.EnemyClass(
            this.scene, x, y, this.scene.player, 'enemy'
        );
        
        // Rhythm-synced enemies have slight glow
        enemy.setTint(0xffd700);
        
        this.scene.enemies.add(enemy);
        
        // Spawn effect
        this.createSpawnPulse(x, y);
    }
    
    scheduleEliteSpawn() {
        // Delay for dramatic timing
        this.scene.time.delayedCall(this.beatDuration * 2000, () => {
            if (!this.scene.gameActive) return;
            
            const player = this.scene.player;
            const angle = Math.random() * Math.PI * 2;
            const distance = 500;
            
            const x = Phaser.Math.Clamp(
                player.x + Math.cos(angle) * distance,
                100, 1820
            );
            const y = Phaser.Math.Clamp(
                player.y + Math.sin(angle) * distance,
                100, 1340
            );
            
            // Create elite (hexagon shape, more health)
            const elite = new this.scene.EnemyClass(
                this.scene, x, y, this.scene.player, 'elite'
            );
            
            elite.maxHealth *= 2;
            elite.health = elite.maxHealth;
            elite.speed *= 1.3;
            elite.setTint(0xff00ff); // Magenta for musical elites
            
            // Visual aura
            const aura = this.scene.add.graphics();
            aura.lineStyle(2, 0xff00ff, 0.5);
            aura.strokeCircle(0, 0, 35);
            
            this.scene.tweens.add({
                targets: aura,
                rotation: Math.PI * 2,
                duration: 3000,
                repeat: -1
            });
            
            // Attach aura to elite
            const updateAura = () => {
                if (elite.active) {
                    aura.x = elite.x;
                    aura.y = elite.y;
                } else {
                    aura.destroy();
                    this.scene.events.off('update', updateAura);
                }
            };
            this.scene.events.on('update', updateAura);
            
            this.scene.enemies.add(elite);
            
            // Announce
            this.showRhythmText('♫ ELITE ♫', '#ff00ff');
        });
    }
    
    // ===== FORMATION SYSTEM =====
    
    applyChordFormation(chord, tension) {
        // Reorganize existing enemies based on chord
        const enemies = this.scene.enemies.getChildren();
        if (enemies.length === 0) return;
        
        // Chord determines formation shape
        const formationType = chord.type; // 'major', 'minor', 'diminished', etc.
        
        switch (formationType) {
            case 'major':
                // Triangular spread — aggressive
                this.arrangeInFormation(enemies, 'triangle');
                break;
            case 'minor':
                // Line formation — defensive
                this.arrangeInFormation(enemies, 'line');
                break;
            case 'diminished':
                // Scattered — chaotic
                this.arrangeInFormation(enemies, 'scatter');
                break;
            default:
                // Circle — balanced
                this.arrangeInFormation(enemies, 'circle');
        }
    }
    
    arrangeInFormation(enemies, shape) {
        const player = this.scene.player;
        const count = Math.min(enemies.length, 12);
        
        switch (shape) {
            case 'triangle':
                for (let i = 0; i < count; i++) {
                    const t = i / count;
                    const angle = -Math.PI/2 + (t - 0.5) * Math.PI; // Arc above player
                    const dist = 400;
                    enemies[i].targetX = player.x + Math.cos(angle) * dist;
                    enemies[i].targetY = player.y + Math.sin(angle) * dist - 200;
                }
                break;
            case 'line':
                for (let i = 0; i < count; i++) {
                    const t = (i / (count - 1)) - 0.5;
                    enemies[i].targetX = player.x + t * 600;
                    enemies[i].targetY = player.y - 400;
                }
                break;
            case 'circle':
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2;
                    const dist = 350;
                    enemies[i].targetX = player.x + Math.cos(angle) * dist;
                    enemies[i].targetY = player.y + Math.sin(angle) * dist;
                }
                break;
        }
    }
    
    // ===== VISUAL EFFECTS =====
    
    pulseToBeat(type, intensity) {
        const player = this.scene.player;
        const color = type === 'kick' ? this.RHYTHM_GOLD : 
                      type === 'snare' ? this.WARNING_RED : 
                      this.SAFE_CYAN;
        
        // Ring pulse from player
        this.beatIndicator.clear();
        
        const maxRadius = 50 + intensity * 100;
        const duration = this.beatDuration * 500;
        
        // Animated ring
        let progress = 0;
        const animate = () => {
            progress += 0.05;
            if (progress > 1) {
                this.beatIndicator.clear();
                return;
            }
            
            const radius = maxRadius * progress;
            const alpha = 1 - progress;
            
            this.beatIndicator.clear();
            this.beatIndicator.lineStyle(2, color, alpha);
            this.beatIndicator.strokeCircle(player.x, player.y, radius);
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    flashOnBeatIndicator() {
        // Bright flash when player acts on beat
        const player = this.scene.player;
        
        this.beatFlash.clear();
        this.beatFlash.fillStyle(this.RHYTHM_GOLD, 0.6);
        this.beatFlash.fillCircle(player.x, player.y, 60);
        
        this.scene.tweens.add({
            targets: this.beatFlash,
            alpha: 0,
            duration: 200,
            onComplete: () => this.beatFlash.clear()
        });
    }
    
    flashRhythmIndicators(subdivision) {
        // Flash the safe/danger zones
        const player = this.scene.player;
        
        // Zone color based on subdivision
        const color = subdivision === 'e' ? 0x00f0ff : 
                      subdivision === '+' ? 0xffd700 : 
                      0xff3366;
        
        // Brief zone flash around player
        this.scene.cameras.main.flash(100, 
            (color >> 16) & 0xff,
            (color >> 8) & 0xff,
            color & 0xff,
            0.2
        );
    }
    
    createSpawnPulse(x, y) {
        // Visual pulse at spawn location
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(3, this.RHYTHM_GOLD, 0.8);
        graphics.strokeCircle(x, y, 30);
        
        this.scene.tweens.add({
            targets: graphics,
            scale: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => graphics.destroy()
        });
    }
    
    showRhythmText(text, color) {
        const centerX = this.scene.cameras.main.worldView.centerX;
        const centerY = this.scene.cameras.main.worldView.centerY - 100;
        
        const display = this.scene.add.text(centerX, centerY, text, {
            fontFamily: 'monospace',
            fontSize: '24px',
            fontStyle: 'bold',
            fill: color,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        display.setScrollFactor(0);
        display.setDepth(100);
        
        this.scene.tweens.add({
            targets: display,
            y: centerY - 50,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => display.destroy()
        });
    }
    
    announceRivalAction(rival, beatType) {
        // Rivals telegraph with musical cues
        if (!rival.entity.active) return;
        
        // Visual note above rival
        const note = beatType === 'snare' ? '♪' : '♫';
        const text = this.scene.add.text(
            rival.entity.x, 
            rival.entity.y - 50, 
            note, 
            {
                fontSize: '20px',
                fill: '#cd7f32'
            }
        ).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: rival.entity.y - 80,
            alpha: 0,
            duration: 600,
            onComplete: () => text.destroy()
        });
    }
    
    // ===== INTEGRATION METHODS =====
    
    onPlayerFire() {
        // Called by GameScene when player fires
        const bonus = this.getRhythmBonus();
        return bonus;
    }
    
    onSystemActivate(systemName) {
        // Check if system activation was on-beat
        const accuracy = this.checkRhythmAccuracy();
        
        if (accuracy === 'on_beat') {
            // Reduced cooldown for rhythmic play
            return 0.8; // 20% reduction
        }
        
        return 1.0;
    }
    
    isSafeCorridor(x, y) {
        // Check if position is in a melody-derived safe corridor
        if (!this.safeCorridors || this.safeCorridors.length === 0) return false;
        
        for (const node of this.safeCorridors) {
            const dist = Phaser.Math.Distance.Between(x, y, node.x, node.y);
            if (dist < 40) return true;
        }
        return false;
    }
    
    // ===== MAIN UPDATE =====
    
    update(dt) {
        // Calculate current beat phase
        const timeSinceLastBeat = (this.scene.time.now - this.lastBeatTime) / 1000;
        this.beatPhase = timeSinceLastBeat / this.beatDuration;
        
        // Update measure ring (throttled for performance)
        this.renderCounter++;
        if (this.renderCounter >= this.renderInterval) {
            this.renderCounter = 0;
            const measureProgress = ((this.scene.time.now - this.trackStartTime) / 1000) % this.measureDuration;
            const measurePhase = measureProgress / this.measureDuration;
            this.updateMeasureRing(measurePhase);
        }
        
        // Decay spawn windows
        this.decaySpawnWindows(dt);
        
        // Update visual elements attached to player (throttled)
        if (this.renderCounter === 0) {
            this.updateAttachedVisuals();
        }
    }
    
    updateMeasureRing(phase) {
        const player = this.scene.player;
        const radius = 80 + phase * 40;
        
        this.measureRing.clear();
        this.measureRing.lineStyle(2, this.RHYTHM_GOLD, 0.3);
        this.measureRing.strokeCircle(player.x, player.y, radius);
        
        // Beat markers
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
            const markerX = player.x + Math.cos(angle) * radius;
            const markerY = player.y + Math.sin(angle) * radius;
            
            const isCurrentBeat = i === Math.floor(phase * 4);
            const alpha = isCurrentBeat ? 0.8 : 0.3;
            const size = isCurrentBeat ? 6 : 3;
            
            this.measureRing.fillStyle(this.RHYTHM_GOLD, alpha);
            this.measureRing.fillCircle(markerX, markerY, size);
        }
    }
    
    decaySpawnWindows(dt) {
        // Decay active spawn windows over time
        for (const [key, window] of Object.entries(this.spawnWindows)) {
            if (window.active) {
                // Window lasts for a fraction of a beat
                if (Math.random() < dt / this.beatDuration) {
                    window.active = false;
                }
            }
        }
    }
    
    updateAttachedVisuals() {
        // Ensure visual elements follow player
        // (Most are drawn fresh each frame in their respective methods)
    }
    
    // ===== CLEANUP =====
    
    destroy() {
        this.beatIndicator?.destroy();
        this.measureRing?.destroy();
        this.beatFlash?.destroy();
        
        this.spawnPreviews.forEach(p => p.destroy());
        this.safeCorridors.forEach(c => c.destroy());
        
        this.spawnPreviews = [];
        this.safeCorridors = [];
        this.bulletWarnings = [];
    }
}
