import Phaser from 'phaser';

/**
 * Harmonic Convergence System — The Music of Temporal Combat
 * 
 * This system transforms the bullet hell into a collaborative music generator.
 * Every action, every near-miss, every system activation contributes to an
 * emergent soundtrack that reflects the player's temporal mastery.
 * 
 * Core Innovation: Combat as Composition
 * - Enemy bullets spawn with rhythmic timing, creating polyrhythmic patterns
 * - Near-misses trigger musical stingers that harmonize with the current key
 * - System activations add layers to the music (drums, bass, melody, harmony)
 * - The Tesseract Titan conducts symphonic bullet patterns
 * - Temporal Residue nodes become physical synthesizer keys
 * - Death in Quantum Immortality creates a musical bridge/resolution
 * 
 * Color: Iridescent spectrum cycling through cyan→magenta→gold→purple
 * Represents the full harmonic range of temporal music
 */

export default class HarmonicConvergenceSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Audio context for procedural sound generation
        this.audioContext = null;
        this.masterGain = null;
        
        // Musical state
        this.currentScale = 'minor'; // 'minor', 'major', 'dorian', 'phrygian'
        this.rootNote = 110; // A2 fundamental frequency
        this.bpm = 100; // Beats per minute (tempo increases with intensity)
        this.currentBeat = 0;
        this.measureLength = 16; // 16th note grid
        
        // Harmonic layers (each system contributes a layer)
        this.harmonicLayers = {
            rhythm: { active: false, intensity: 0, lastTrigger: 0 },      // Echo Storm - percussion
            bass: { active: false, intensity: 0, lastTrigger: 0 },      // Fracture - bass line
            melody: { active: false, intensity: 0, lastTrigger: 0 },     // Paradox Engine - lead
            harmony: { active: false, intensity: 0, lastTrigger: 0 },    // Chrono-Loop - pads
            texture: { active: false, intensity: 0, lastTrigger: 0 },    // Void Coherence - ambience
            dissonance: { active: false, intensity: 0, lastTrigger: 0 }  // Quantum Immortality - tension
        };
        
        // Musical intervals (semitones from root)
        this.scales = {
            minor: [0, 3, 5, 7, 10, 12, 15, 17], // A C D E G
            major: [0, 4, 5, 7, 9, 12, 16, 17],  // A C# D E F#
            dorian: [0, 2, 3, 5, 7, 9, 10, 12],  // A B C D E F# G
            phrygian: [0, 1, 3, 5, 7, 8, 10, 12] // A Bb C D E F G
        };
        
        // Active notes and their sources
        this.activeNotes = new Map(); // noteId -> { frequency, source, type }
        this.nextNoteId = 0;
        
        // Visual feedback
        this.graphics = null;
        this.harmonicRings = [];
        this.spectrumBars = [];
        
        // Rhythm patterns for enemy spawning
        this.rhythmPatterns = [
            [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], // Basic 4/4
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // Eighth notes
            [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0], // Syncopated
            [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0], // Dense
        ];
        this.currentPattern = 0;
        
        // Convergence state (when all layers active)
        this.convergenceActive = false;
        this.convergenceTimer = 0;
        this.convergenceDuration = 8; // seconds of full harmony
        
        // Color cycling for iridescence
        this.colorHue = 0;
        
        this.init();
    }
    
    init() {
        this.initAudio();
        this.createVisuals();
        this.startMetronome();
    }
    
    initAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Master gain with limiter
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3; // Keep it subtle
            
            // Compressor to prevent clipping
            const compressor = this.audioContext.createDynamicsCompressor();
            compressor.threshold.value = -24;
            compressor.knee.value = 30;
            compressor.ratio.value = 12;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;
            
            this.masterGain.connect(compressor);
            compressor.connect(this.audioContext.destination);
            
            // Resume context on first user interaction
            const resumeAudio = () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            };
            document.addEventListener('click', resumeAudio, { once: true });
            document.addEventListener('keydown', resumeAudio, { once: true });
            
        } catch (e) {
            console.warn('Web Audio API not available:', e);
        }
    }
    
    createVisuals() {
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(90);
        
        // Harmonic rings that pulse with the beat
        for (let i = 0; i < 4; i++) {
            const ring = this.scene.add.circle(0, 0, 50 + i * 40, 0x00f0ff, 0);
            ring.setStrokeStyle(2, 0x00f0ff, 0.3);
            ring.setDepth(85);
            this.harmonicRings.push(ring);
        }
        
        // Spectrum analyzer bars - registered with panel-based HUD system
        this.scene.hudPanels.registerSlot('HARMONIC', (container, width, layout) => {
            const barCount = Math.min(16, Math.floor(width / 10));
            const barWidth = Math.min(8, (width - (barCount - 1) * 2) / barCount);
            const gap = 2;
            
            // Position bars starting from left edge (x=0)
            for (let i = 0; i < barCount; i++) {
                const x = i * (barWidth + gap);
                const bar = this.scene.add.rectangle(
                    x,
                    0, // y=0 with top-left origin
                    barWidth, 2,
                    0x00f0ff, 0.5
                );
                bar.setOrigin(0, 0); // Top-left origin so bar extends downward
                bar.setDepth(95);
                container.add(bar);
                this.spectrumBars.push(bar);
            }
        }, 'BOTTOM_RIGHT');
    }
    
    startMetronome() {
        // Metronome that advances the musical grid
        this.metronomeEvent = this.scene.time.addEvent({
            delay: (60 / this.bpm) * 250, // 16th notes
            callback: () => this.onBeat(),
            loop: true
        });
    }
    
    onBeat() {
        this.currentBeat = (this.currentBeat + 1) % this.measureLength;
        
        // Update visual rings
        this.harmonicRings.forEach((ring, i) => {
            const delay = i * 50;
            this.scene.time.delayedCall(delay, () => {
                ring.setStrokeStyle(2, this.getIridescentColor(), 0.6);
                this.scene.tweens.add({
                    targets: ring,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        ring.setScale(1);
                        ring.setStrokeStyle(2, 0x00f0ff, 0.3);
                    }
                });
            });
        });
        
        // Play bass note on beats 0, 4, 8, 12
        if (this.currentBeat % 4 === 0 && this.harmonicLayers.bass.active) {
            this.playBassNote();
        }
        
        // Update spectrum bars
        this.updateSpectrumVisualization();
        
        // Check for convergence (all layers active)
        this.checkConvergence();
    }
    
    playBassNote() {
        if (!this.audioContext) return;
        
        const scale = this.scales[this.currentScale];
        const noteIndex = Math.floor(Math.random() * 4); // Root, third, fifth, octave
        const semitones = scale[noteIndex];
        const frequency = this.rootNote * Math.pow(2, semitones / 12);
        
        this.playTone(frequency, 'sawtooth', 0.3, 0.4, 'bass');
    }
    
    playTone(frequency, waveform, attack, release, type = 'melody') {
        if (!this.audioContext) return null;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = waveform;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Filter based on type
        filter.type = type === 'bass' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'bass' ? 800 : 2000;
        filter.Q.value = type === 'bass' ? 2 : 5;
        
        // Envelope
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + attack + release);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + attack + release + 0.1);
        
        // Clean up
        osc.onended = () => {
            filter.disconnect();
            gain.disconnect();
        };
        
        return { osc, gain };
    }
    
    // Called when near-miss occurs
    onNearMiss(streakLevel, bulletX, bulletY) {
        // Play melodic stinger based on streak
        if (!this.audioContext) return;
        
        const scale = this.scales[this.currentScale];
        const baseOctave = streakLevel > 2 ? 12 : 0; // Higher octave for high streaks
        const noteIndex = Math.floor(Math.random() * scale.length);
        const semitones = scale[noteIndex] + baseOctave;
        const frequency = this.rootNote * Math.pow(2, semitones / 12);
        
        // Higher streaks = more complex tones
        const waveform = streakLevel > 3 ? 'square' : 'sine';
        const release = 0.3 + (streakLevel * 0.1);
        
        this.playTone(frequency, waveform, 0.02, release, 'melody');
        
        // Add rhythmic layer on streaks > 2
        if (streakLevel >= 2) {
            this.activateHarmonicLayer('rhythm', streakLevel * 0.3);
            
            // Play percussion
            this.playPercussion('hihat', streakLevel * 0.1);
        }
        
        // Visual pulse at near-miss location
        this.createHarmonicPulse(bulletX, bulletY, streakLevel);
    }
    
    playPercussion(type, intensity) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        if (type === 'hihat') {
            // Noise-based hi-hat
            const bufferSize = this.audioContext.sampleRate * 0.1;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            filter.type = 'highpass';
            filter.frequency.value = 8000;
            
            gain.gain.setValueAtTime(intensity * 0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            noise.start();
        }
    }
    
    // System activation callbacks
    onEchoStormActivate() {
        this.activateHarmonicLayer('rhythm', 0.8);
        this.currentScale = 'dorian'; // Shift to brighter mode
        this.playTone(this.rootNote * 2, 'square', 0.01, 0.5, 'melody');
    }
    
    onFractureActivate() {
        this.activateHarmonicLayer('bass', 0.9);
        this.playTone(this.rootNote * 0.5, 'sawtooth', 0.05, 0.8, 'bass');
    }
    
    onParadoxCommit(multiplier) {
        this.activateHarmonicLayer('melody', multiplier / 5);
        
        // Play ascending arpeggio based on multiplier
        const scale = this.scales[this.currentScale];
        const notes = [0, 2, 4, 7, 4, 2, 0]; // Arpeggio pattern
        
        notes.forEach((scaleIndex, i) => {
            this.scene.time.delayedCall(i * 100, () => {
                const semitones = scale[scaleIndex % scale.length];
                const frequency = this.rootNote * Math.pow(2, (semitones + 12) / 12);
                this.playTone(frequency, 'sine', 0.01, 0.3, 'melody');
            });
        });
    }
    
    onChronoLoopStart() {
        this.activateHarmonicLayer('harmony', 0.7);
        this.currentScale = 'phrygian'; // Mysterious mode
        
        // Pad sound
        this.playPadChord();
    }
    
    playPadChord() {
        if (!this.audioContext) return;
        
        const scale = this.scales[this.currentScale];
        const chord = [0, 2, 4]; // Triad
        
        chord.forEach((scaleIndex, i) => {
            const semitones = scale[scaleIndex % scale.length];
            const frequency = this.rootNote * Math.pow(2, (semitones) / 12);
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'triangle';
            osc.frequency.value = frequency;
            
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 1);
            gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 3);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 3);
        });
    }
    
    onVoidCoherenceActivate(intensity) {
        this.activateHarmonicLayer('texture', intensity);
        
        // Drone sound that follows void coherence
        if (intensity > 0.8) {
            this.playDrone();
        }
    }
    
    playDrone() {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = this.rootNote * 0.25; // Sub-bass
        
        lfo.frequency.value = 2; // 2Hz modulation
        lfoGain.gain.value = 5;
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        gain.gain.value = 0.1;
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        lfo.start();
        
        // Fade out after 2 seconds
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
        
        osc.stop(this.audioContext.currentTime + 2);
        lfo.stop(this.audioContext.currentTime + 2);
    }
    
    onQuantumBranch() {
        this.activateHarmonicLayer('dissonance', 0.6);
        
        // Dissonant cluster
        if (!this.audioContext) return;
        
        const dissonantFreqs = [this.rootNote * 1.06, this.rootNote * 1.12, this.rootNote * 1.18];
        
        dissonantFreqs.forEach((freq, i) => {
            this.scene.time.delayedCall(i * 50, () => {
                this.playTone(freq, 'sawtooth', 0.01, 0.5, 'texture');
            });
        });
        
        // Resolution after brief dissonance
        this.scene.time.delayedCall(400, () => {
            this.playTone(this.rootNote, 'sine', 0.01, 1.0, 'melody');
            this.playTone(this.rootNote * 1.5, 'sine', 0.01, 1.0, 'harmony');
        });
    }
    
    onResonanceCascade(chainLength) {
        // Musical reward for long chains - major key celebration
        if (chainLength >= 3) {
            this.currentScale = 'major';
            
            // Play major chord
            const majorChord = [0, 4, 7, 12];
            majorChord.forEach((semitones, i) => {
                this.scene.time.delayedCall(i * 50, () => {
                    const frequency = this.rootNote * Math.pow(2, semitones / 12);
                    this.playTone(frequency, 'triangle', 0.01, 0.6, 'melody');
                });
            });
        }
    }
    
    onSingularityDetonate(bulletCount) {
        // Crescendo based on bullet count
        const intensity = Math.min(bulletCount / 20, 1);
        
        for (let i = 0; i < bulletCount; i++) {
            this.scene.time.delayedCall(i * 30, () => {
                const scale = this.scales[this.currentScale];
                const semitones = scale[i % scale.length];
                const frequency = this.rootNote * Math.pow(2, (semitones + 12) / 12);
                this.playTone(frequency, 'square', 0.005, 0.2, 'melody');
            });
        }
    }
    
    // Harmonic layer management
    activateHarmonicLayer(layerName, intensity) {
        const layer = this.harmonicLayers[layerName];
        layer.active = true;
        layer.intensity = Math.min(1, layer.intensity + intensity);
        layer.lastTrigger = this.scene.time.now;
        
        // Decay over time
        this.scene.time.delayedCall(3000, () => {
            layer.intensity *= 0.7;
            if (layer.intensity < 0.1) {
                layer.active = false;
            }
        });
    }
    
    checkConvergence() {
        const activeLayers = Object.values(this.harmonicLayers).filter(l => l.active).length;
        
        if (activeLayers >= 5 && !this.convergenceActive) {
            this.startConvergence();
        }
        
        if (this.convergenceActive) {
            this.updateConvergence();
        }
    }
    
    startConvergence() {
        this.convergenceActive = true;
        this.convergenceTimer = this.convergenceDuration;
        
        // Show announcement
        this.showConvergenceText('HARMONIC CONVERGENCE');
        
        // Change to most complex scale
        this.currentScale = 'phrygian';
        this.bpm = 120; // Speed up
        
        // Play convergence chord
        this.playConvergenceChord();
    }
    
    playConvergenceChord() {
        if (!this.audioContext) return;
        
        // Full chord with all scale degrees
        const scale = this.scales.phrygian;
        scale.forEach((semitones, i) => {
            this.scene.time.delayedCall(i * 100, () => {
                const frequency = this.rootNote * Math.pow(2, (semitones + (i > 4 ? 12 : 0)) / 12);
                this.playTone(frequency, 'sine', 0.01, 2.0, 'harmony');
            });
        });
    }
    
    updateConvergence() {
        this.convergenceTimer -= 1 / 60; // Approximate delta
        
        if (this.convergenceTimer <= 0) {
            this.endConvergence();
        }
        
        // Visual intensity during convergence
        this.colorHue += 2;
        if (this.colorHue > 360) this.colorHue = 0;
    }
    
    endConvergence() {
        this.convergenceActive = false;
        this.bpm = 100; // Return to normal tempo
        
        // Reset layers
        Object.values(this.harmonicLayers).forEach(l => {
            l.active = false;
            l.intensity = 0;
        });
    }
    
    // Visual effects
    createHarmonicPulse(x, y, intensity) {
        const color = this.getIridescentColor();
        
        // Expanding ring
        const ring = this.scene.add.circle(x, y, 10, color, 0.5);
        ring.setDepth(88);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 3 + intensity,
            alpha: 0,
            duration: 500,
            onComplete: () => ring.destroy()
        });
        
        // Note particles
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const note = this.scene.add.text(
                x + Math.cos(angle) * 20,
                y + Math.sin(angle) * 20,
                ['♪', '♫', '♬', '♩'][i],
                { fontSize: '16px', color: '#' + color.toString(16).padStart(6, '0') }
            ).setOrigin(0.5);
            note.setDepth(89);
            
            this.scene.tweens.add({
                targets: note,
                x: x + Math.cos(angle) * 60,
                y: y + Math.sin(angle) * 60,
                alpha: 0,
                duration: 800,
                onComplete: () => note.destroy()
            });
        }
    }
    
    updateSpectrumVisualization() {
        // Animate spectrum bars based on harmonic layers
        const totalIntensity = Object.values(this.harmonicLayers)
            .reduce((sum, l) => sum + l.intensity, 0);
        
        this.spectrumBars.forEach((bar, i) => {
            const layer = Object.values(this.harmonicLayers)[i % 6];
            const height = layer.active ? 10 + layer.intensity * 40 : 2;
            const alpha = layer.active ? 0.5 + layer.intensity * 0.5 : 0.2;
            
            bar.height = height;
            bar.y = this.scene.scale.height - 20 - height / 2;
            bar.fillColor = this.getIridescentColor();
            bar.alpha = alpha;
        });
    }
    
    getIridescentColor() {
        // Cycle through the spectrum
        const hue = this.convergenceActive ? this.colorHue : 180; // Cyan base
        return Phaser.Display.Color.HSLToColor(hue / 360, 0.8, 0.5).color;
    }
    
    showConvergenceText(text) {
        const announcement = this.scene.add.text(
            this.scene.cameras.main.scrollX + this.scene.scale.width / 2,
            this.scene.cameras.main.scrollY + this.scene.scale.height / 2 - 100,
            text,
            {
                fontFamily: 'monospace',
                fontSize: '24px',
                fontStyle: 'bold',
                fill: '#ffffff',
                stroke: '#00f0ff',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        announcement.setScrollFactor(0);
        announcement.setDepth(100);
        
        this.scene.tweens.add({
            targets: announcement,
            scale: { from: 0.5, to: 1.2 },
            alpha: { from: 1, to: 0 },
            duration: 2000,
            ease: 'Power2',
            onComplete: () => announcement.destroy()
        });
    }
    
    // Called by GameScene to sync enemy spawning to rhythm
    shouldSpawnOnBeat() {
        const pattern = this.rhythmPatterns[this.currentPattern];
        const shouldSpawn = pattern[this.currentBeat] === 1;
        
        // Intensity increases spawn frequency
        const activeLayers = Object.values(this.harmonicLayers).filter(l => l.active).length;
        if (activeLayers >= 3 && Math.random() < 0.3) {
            return true; // Extra spawn during high intensity
        }
        
        return shouldSpawn;
    }
    
    onEnemySpawned(enemy) {
        // Assign musical properties to enemy
        enemy.birthBeat = this.currentBeat;
        enemy.musicalPhase = Math.random() * Math.PI * 2;
        
        // Sync movement to beat if rhythm layer active
        if (this.harmonicLayers.rhythm.active) {
            enemy.syncToBeat = true;
        }
    }
    
    update(dt, player) {
        // Update color cycling
        this.colorHue += 0.5;
        if (this.colorHue > 360) this.colorHue = 0;
        
        // Update ring positions to player
        if (player && player.active) {
            this.harmonicRings.forEach(ring => {
                ring.x = player.x;
                ring.y = player.y;
            });
        }
        
        // Update tempo based on game intensity
        const enemyCount = this.scene.enemies?.countActive() || 0;
        const targetBpm = 100 + enemyCount * 2;
        this.bpm = Phaser.Math.Linear(this.bpm, targetBpm, 0.01);
        
        // Update metronome delay
        if (this.metronomeEvent) {
            const newDelay = (60 / this.bpm) * 250;
            if (Math.abs(this.metronomeEvent.delay - newDelay) > 10) {
                this.metronomeEvent.remove();
                this.metronomeEvent = this.scene.time.addEvent({
                    delay: newDelay,
                    callback: () => this.onBeat(),
                    loop: true
                });
            }
        }
    }
    
    destroy() {
        if (this.metronomeEvent) {
            this.metronomeEvent.remove();
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.graphics.destroy();
        this.harmonicRings.forEach(r => r.destroy());
        this.spectrumBars.forEach(b => b.destroy());
    }
}
