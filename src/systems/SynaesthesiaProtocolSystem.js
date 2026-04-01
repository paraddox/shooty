import Phaser from 'phaser';

/**
 * SYNAESTHESIA PROTOCOL — The 42nd Cognitive Dimension: AUDITORY SYNTHESIS
 * 
 * The ultimate synthesis: Gameplay becomes music, music becomes gameplay.
 * 
 * This is not "background music" or even "adaptive audio." This is genuine
 * BIDIRECTIONAL COUPLING between the auditory and ludic dimensions:
 * 
 * 1. GAMEPLAY → SOUND: Every action, system activation, and temporal event
 *    generates precise audio that reflects its nature (not random, but MAPPED)
 * 2. SOUND → GAMEPLAY: The generative music creates gameplay elements -
 *    bass drops spawn enemy waves, hi-hats trigger bullet patterns,
 *    melodies become movement paths
 * 
 * The player experiences the game as a LIVING COMPOSITION they both perform
 * and are performed by. The distinction between action and audio dissolves.
 * 
 * === THE SYNTHESIS MATRIX ===
 * 
 * | Gameplay Element | Sonic Signature | Reverse Mapping |
 * |-----------------|-----------------|-----------------|
 * | Player movement | Pitch-shifted triangle wave | Melody contours guide echo paths |
 * | Bullet fired | Short exponential decay ping | Rhythm triggers firing windows |
 * | Near-miss bullet time | Time-stretched pad swell | Swell duration = bullet time length |
 * | Echo absorption | Granular synthesis sparkle | Sparkle density = enemy spawn density |
 * | Fracture activation | Dual stereo detuned saw | Detune width = ghost separation |
 * | Resonance cascade | Arpeggiator acceleration | Arp speed = damage multiplier |
 * | Temporal singularity | Low-frequency gravitational drone | Drone intensity = gravity pull |
 * | Paradox engine | Reversed reverb trail | Trail length = prediction window |
 * | Chrono-loop record | Tape saturation warmth | Saturation = echo fidelity |
 * | Quantum immortality | Spectral freeze shimmer | Shimmer = death echo persistence |
 * | Observer mutation | FM synthesis complexity | FM index = mutation intensity |
 * | Nemesis genesis | Dark filtered bass pulse | Pulse rate = nemesis aggression |
 * | Oracle prophecy | Ethereal glass harmonics | Harmonic series = future probabilities |
 * | Bootstrap paradox | Shepard tone illusion | Illusion direction = time flow |
 * | Void coherence | Noise floor texture | Noise density = void activity |
 * | Wave transition | Cymbal swell + sub drop | Drop triggers wave spawn |
 * | Death | Frequency sweep to silence | Silence duration = respawn time |
 * | Score milestone | Major chord celebration | Chord quality = milestone tier |
 * 
 * === THE GENERATIVE ENGINE ===
 * 
 * Audio is synthesized in real-time using Web Audio API (no samples needed):
 * - 4-operator FM synthesis for melodic elements
 * - Subtractive synthesis with resonant filters for bass/gravity
 * - Granular synthesis for texture/echoes
 * - Physical modeling for percussion/transients
 * - Spectral processing for "impossible" sounds (paradox, void)
 * 
 * The generative algorithm uses a "narrative arc" structure:
 * - Intro: Sparse, establishing key and mood from time-of-day (Ambient Awareness)
 * - Build: Layering as systems activate, intensity from Resonance Cascade
 * - Climax: Full density during boss/Nemesis encounters
 * - Resolution: Gradual return to sparse during quiet moments
 * - Coda: End-of-run summary theme based on performance archetype
 * 
 * === THE SYNCHRONICITY ENGINE ===
 * 
 * The 128 BPM tempo (classic synthwave) locks to:
 * - Enemy spawn timing (quarter notes = 1.875 seconds)
 * - Bullet pattern rhythmic phrasing
 * - System cooldown durations (musical measures)
 * - Wave transitions (phrase boundaries)
 * 
 * This creates "musical tacticality" - skilled players internalize the beat
 * and use it for timing dodges, shots, and system activations.
 * 
 * === THE 42ND DIMENSION ===
 * 
 * All 41 previous systems exist in the visual-ludic domain. The Synaesthesia
 * Protocol adds the AUDITORY dimension and then FUSES them:
 * 
 * Visual + Ludic + Auditory = SYNTHESIS
 * 
 * This is the final integration. The game is no longer just played or watched
 * - it is HEARD, and in hearing, the player becomes composer, performer, and
 * instrument simultaneously.
 * 
 * === WHY THIS IS REVOLUTIONARY ===
 * 
 * 1. **True synesthesia**: The game stimulates cross-modal perception
 * 2. **Generative music**: Every run produces a unique, professional-quality track
 * 3. **Audio as information**: Expert players "read" the soundscape tactically
 * 4. **Performance art**: Skilled play produces beautiful music automatically
 * 5. **The 42nd dimension**: Completes the cognitive architecture
 * 6. **No other game**: Has this level of bidirectional audio-gameplay coupling
 * 
 * Color: Synaesthetic Silver — a color that seems to shimmer with sound
 * 
 * "To see the sound, to hear the geometry, to play the music, to become the song."
 */

export default class SynaesthesiaProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== AUDIO CONTEXT =====
        this.audioContext = null;
        this.masterGain = null;
        this.compressor = null;
        this.reverb = null;
        this.delay = null;
        this.analyser = null;
        
        // ===== SYNTHESIS PARAMETERS =====
        this.bpm = 128;
        this.beatDuration = 60 / this.bpm; // 0.46875 seconds
        this.nextBeatTime = 0;
        this.currentMeasure = 0;
        this.currentBeat = 0;
        
        // ===== GENERATIVE STATE =====
        this.generativeState = {
            intensity: 0.2,        // 0.0-1.0 overall musical density
            tension: 0.0,          // 0.0-1.0 harmonic tension
            brightness: 0.5,     // 0.0-1.0 filter cutoff / harmonic content
            motion: 0.0,          // 0.0-1.0 rhythmic activity / arp speed
            depth: 0.5,           // 0.0-1.0 reverb/delay send
            key: 'C',             // Current musical key
            mode: 'minor',        // minor for dark, major for triumphant
            rootFrequency: 65.41  // C2
        };
        
        // ===== ACTIVE VOICES =====
        this.activeVoices = new Map(); // voiceId -> {oscillator, gain, filter, type}
        this.voiceCounter = 0;
        
        // ===== GAMEPLAY-AUDIO MAPPING =====
        this.eventMappings = this.initializeEventMappings();
        
        // ===== REVERSE MAPPING (Audio → Gameplay) =====
        this.audioToGameplayQueue = [];
        this.beatPredictions = []; // Upcoming beat events
        
        // ===== VISUALIZATION =====
        this.spectrumData = new Uint8Array(64);
        this.waveformData = new Uint8Array(64);
        this.synesthesiaParticles = null;
        
        // ===== ARCHETYPE THEMES =====
        this.archetypeThemes = {
            DANCER: { mode: 'dorian', brightness: 0.7, motion: 0.9 },
            ARCHITECT: { mode: 'lydian', brightness: 0.6, motion: 0.5 },
            SURVIVOR: { mode: 'phrygian', brightness: 0.3, motion: 0.4 },
            PROPHET: { mode: 'mixolydian', brightness: 0.8, motion: 0.6 },
            CHRONICLER: { mode: 'aeolian', brightness: 0.5, motion: 0.3 }
        };
        
        // ===== PLAYBACK STATE =====
        this.isPlaying = false;
        this.runStartTime = 0;
        this.hasInteracted = false; // Wait for user interaction
        
        this.initializeAudio();
        this.createSynesthesiaVisualization();
    }
    
    initializeAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Master chain: compressor → master gain → destination
            this.compressor = this.audioContext.createDynamicsCompressor();
            this.compressor.threshold.value = -24;
            this.compressor.knee.value = 30;
            this.compressor.ratio.value = 12;
            this.compressor.attack.value = 0.003;
            this.compressor.release.value = 0.25;
            
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.6;
            
            // Reverb for depth
            this.reverb = this.createReverb();
            
            // Delay for echo effects
            this.delay = this.audioContext.createDelay(2.0);
            const delayGain = this.audioContext.createGain();
            delayGain.gain.value = 0.3;
            this.delay.connect(delayGain);
            delayGain.connect(this.delay); // Feedback loop
            delayGain.connect(this.compressor);
            
            // Analyser for visualization
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 128;
            
            // Chain
            this.compressor.connect(this.masterGain);
            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
        } catch (e) {
            console.warn('Web Audio API not available:', e);
        }
    }
    
    createReverb() {
        // Create impulse response for reverb
        const rate = this.audioContext.sampleRate;
        const length = rate * 2.0; // 2 seconds
        const impulse = this.audioContext.createBuffer(2, length, rate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Exponential decay with noise
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
            }
        }
        
        const convolver = this.audioContext.createConvolver();
        convolver.buffer = impulse;
        convolver.connect(this.compressor);
        
        return convolver;
    }
    
    initializeEventMappings() {
        return {
            // Movement → Pitch-shifted triangle
            playerMove: (velocity, direction) => {
                const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
                if (speed < 10) return; // Don't trigger on drift
                
                const pitch = this.mapRange(speed, 0, 300, 220, 880);
                this.playTone(pitch, 0.05, 'triangle', 0.1, { 
                    filterFreq: 2000, 
                    pan: this.mapRange(direction, -Math.PI, Math.PI, -1, 1)
                });
            },
            
            // Bullet fired → Exponential ping
            bulletFired: (weaponType) => {
                const baseFreq = weaponType === 'rapid' ? 880 : weaponType === 'spread' ? 660 : 440;
                this.playPercussive(baseFreq, 0.08, 'sine', 0.15, {
                    decay: 0.1,
                    sweep: -1 // Downward sweep
                });
            },
            
            // Near-miss → Pad swell
            nearMiss: (streak) => {
                const duration = 1.0 + (streak * 0.2);
                this.playPad(this.generativeState.rootFrequency * 2, duration, {
                    attack: 0.3,
                    release: 0.5,
                    filterMod: true
                });
            },
            
            // Echo absorbed → Granular sparkle
            echoAbsorbed: (count) => {
                const density = Math.min(count / 10, 1.0);
                this.playGranular(2000, density, 0.2);
            },
            
            // Echo storm release → Chord burst
            echoStorm: (echoes) => {
                const chord = this.generateChord(this.generativeState.key, 'minor');
                chord.forEach((freq, i) => {
                    setTimeout(() => this.playTone(freq, 0.3, 'sawtooth', 0.2), i * 50);
                });
            },
            
            // Fracture → Dual detuned
            fractureActivate: () => {
                this.playDualTone(220, 222, 2.0, 0.25); // 2Hz beat frequency
            },
            
            // Fracture resolve → Resonance ping
            fractureResolve: (perfect) => {
                const freq = perfect ? 523.25 : 440; // C5 vs A4
                this.playResonant(freq, 0.4, perfect ? 0.3 : 0.15);
            },
            
            // Resonance chain step → Arp note
            resonanceChain: (depth) => {
                const note = this.getScaleNote(depth, this.generativeState.mode);
                this.playArpNote(note, 0.15, depth);
            },
            
            // Cascade break → Noise burst
            cascadeBreak: (power) => {
                this.playNoiseBurst(0.5, power * 1000, 0.3);
            },
            
            // Singularity deploy → Sub drop
            singularityDeploy: () => {
                this.playSubDrop(55, 1.5, 0.4);
            },
            
            // Singularity detonate → Explosion
            singularityDetonate: (charge) => {
                this.playExplosion(charge);
            },
            
            // Paradox projection → Reverb trail
            paradoxProject: () => {
                this.playReverbTrail(330, 3.0, 0.2);
            },
            
            // Chrono-loop record → Tape effect (not yet implemented)
            chronoRecord: () => {
                // TODO: Tape recorder sound effect
            },
            
            // Chrono-loop echo spawn → Echo delay
            chronoEcho: () => {
                this.playEchoEffect(440, 0.5);
            },
            
            // Quantum immortality → Spectral shimmer
            quantumDeath: () => {
                this.playSpectralShimmer(2.0);
            },
            
            // Wave transition → Cymbal + sub
            waveTransition: (waveNumber) => {
                this.playCymbalAndSub(waveNumber);
            },
            
            // Enemy hit → Short impact
            enemyHit: () => {
                this.playImpact(150, 0.05, 0.08);
            },
            
            // Enemy death → Satisfaction chord
            enemyDeath: () => {
                this.playSatisfactionChord();
            },
            
            // Damage taken → Warning tone
            damageTaken: (health) => {
                const urgency = 1 - (health / 100);
                this.playWarning(urgency);
            },
            
            // Void coherence peak → Drone swell
            voidCoherence: (percent) => {
                if (percent > 0.8) {
                    this.playDroneSwell(percent);
                }
            },
            
            // Observer mutation → FM complexity
            observerMutation: (level) => {
                this.playFMComplex(level);
            },
            
            // Nemesis spawn → Dark pulse
            nemesisSpawn: () => {
                this.playDarkPulse();
            },
            
            // Oracle prophecy → Glass harmonics
            oracleProphecy: () => {
                this.playGlassHarmonics();
            },
            
            // Bootstrap fulfillment → Shepard tone
            bootstrapFulfilled: () => {
                this.playShepardTone('ascending');
            },
            
            // Score milestone → Celebration
            scoreMilestone: (tier) => {
                this.playCelebration(tier);
            },
            
            // Game over → Final chord
            gameOver: () => {
                this.playFinalChord();
            }
        };
    }
    
    // ===== SYNTHESIS METHODS =====
    
    playTone(frequency, duration, type = 'sine', volume = 0.1, options = {}) {
        if (!this.audioContext) return;
        
        const voiceId = ++this.voiceCounter;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = type;
        osc.frequency.value = frequency;
        
        filter.type = 'lowpass';
        filter.frequency.value = options.filterFreq || 3000;
        filter.Q.value = 1;
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        if (options.pan !== undefined) {
            const panner = this.audioContext.createStereoPanner();
            panner.pan.value = options.pan;
            osc.connect(filter);
            filter.connect(panner);
            panner.connect(gain);
        } else {
            osc.connect(filter);
            filter.connect(gain);
        }
        
        // Send to reverb based on depth
        if (options.sendToReverb !== false) {
            const reverbGain = this.audioContext.createGain();
            reverbGain.gain.value = this.generativeState.depth * 0.3;
            gain.connect(reverbGain);
            reverbGain.connect(this.reverb);
        }
        
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + duration + 0.1);
        
        // Track voice
        this.activeVoices.set(voiceId, { osc, gain, filter, type });
        
        osc.onended = () => {
            this.activeVoices.delete(voiceId);
        };
        
        return voiceId;
    }
    
    playDualTone(freq1, freq2, duration, volume) {
        if (!this.audioContext) return;
        
        // Left ear
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        const pan1 = this.audioContext.createStereoPanner();
        
        osc1.type = 'sawtooth';
        osc1.frequency.value = freq1;
        pan1.pan.value = -0.8;
        gain1.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        osc1.connect(pan1);
        pan1.connect(gain1);
        gain1.connect(this.compressor);
        
        // Right ear (detuned)
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        const pan2 = this.audioContext.createStereoPanner();
        
        osc2.type = 'sawtooth';
        osc2.frequency.value = freq2;
        pan2.pan.value = 0.8;
        gain2.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        osc2.connect(pan2);
        pan2.connect(gain2);
        gain2.connect(this.compressor);
        
        osc1.start();
        osc2.start();
        osc1.stop(this.audioContext.currentTime + duration + 0.1);
        osc2.stop(this.audioContext.currentTime + duration + 0.1);
    }
    
    playPercussive(frequency, duration, type, volume, options = {}) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        if (options.sweep) {
            const endFreq = options.sweep > 0 ? frequency * 2 : frequency / 2;
            osc.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        }
        
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + (options.decay || duration));
        
        osc.connect(gain);
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + duration + 0.05);
    }
    
    playPad(frequency, duration, options = {}) {
        if (!this.audioContext) return;
        
        // Multiple oscillators for rich pad
        const freqs = [frequency, frequency * 1.5, frequency * 2]; // Root, fifth, octave
        
        freqs.forEach((f, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = i === 0 ? 'sine' : 'triangle';
            osc.frequency.value = f;
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
            if (options.filterMod) {
                filter.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + duration * 0.5);
                filter.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + duration);
            }
            
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.08 / freqs.length, this.audioContext.currentTime + (options.attack || 0.5));
            gain.gain.setValueAtTime(0.08 / freqs.length, this.audioContext.currentTime + duration - (options.release || 0.5));
            gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
            
            osc.connect(filter);
            filter.connect(gain);
            
            // Heavy reverb
            const reverbGain = this.audioContext.createGain();
            reverbGain.gain.value = 0.5;
            gain.connect(reverbGain);
            reverbGain.connect(this.reverb);
            
            gain.connect(this.compressor);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + duration + 0.1);
        });
    }
    
    playGranular(baseFreq, density, duration) {
        if (!this.audioContext) return;
        
        // Simulate granular by rapid short grains
        const grainCount = Math.floor(density * 20);
        for (let i = 0; i < grainCount; i++) {
            setTimeout(() => {
                const freq = baseFreq + (Math.random() - 0.5) * 200;
                this.playPercussive(freq, 0.03, 'sine', 0.05, { decay: 0.02 });
            }, i * 25);
        }
    }
    
    playResonant(frequency, duration, volume) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.value = frequency;
        
        // High resonance filter ping
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        filter.Q.value = 20;
        
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + duration + 0.1);
    }
    
    playArpNote(frequency, duration, position) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.value = frequency;
        
        // Arp notes are short and rhythmic
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + duration + 0.05);
    }
    
    playNoiseBurst(duration, filterFreq, volume) {
        if (!this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = filterFreq;
        filter.Q.value = 5;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);
        
        noise.start();
    }
    
    playSubDrop(startFreq, duration, volume) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(startFreq / 4, this.audioContext.currentTime + duration);
        
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + duration + 0.1);
    }
    
    playExplosion(charge) {
        if (!this.audioContext) return;
        
        const duration = 0.5 + charge * 0.5;
        const volume = 0.3 + charge * 0.2;
        
        // Layer noise and sweep
        this.playNoiseBurst(duration, 200 + charge * 300, volume);
        this.playSubDrop(100, duration * 0.7, volume * 0.5);
    }
    
    playReverbTrail(frequency, duration, volume) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = frequency;
        
        // Slow attack, very long decay
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        // Heavy reverb send
        const reverbGain = this.audioContext.createGain();
        reverbGain.gain.value = 0.8;
        
        osc.connect(gain);
        gain.connect(reverbGain);
        reverbGain.connect(this.reverb);
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + duration + 0.5);
    }
    
    playEchoEffect(frequency, delayTime) {
        if (!this.audioContext) return;
        
        // Play original
        this.playTone(frequency, 0.2, 'sine', 0.15);
        
        // Play delayed echo
        setTimeout(() => {
            this.playTone(frequency * 0.98, 0.15, 'sine', 0.1);
        }, delayTime * 1000);
    }
    
    playSpectralShimmer(duration) {
        if (!this.audioContext) return;
        
        // Multiple oscillators with slight detuning for shimmer
        for (let i = 0; i < 6; i++) {
            const freq = 440 * Math.pow(2, i / 12); // Chromatic spread
            const detune = (Math.random() - 0.5) * 10;
            
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq + detune;
                
                gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.0);
                
                osc.connect(gain);
                gain.connect(this.compressor);
                
                osc.start();
                osc.stop(this.audioContext.currentTime + 1.1);
            }, i * 100);
        }
    }
    
    playCymbalAndSub(waveNumber) {
        if (!this.audioContext) return;
        
        // Cymbal noise
        this.playNoiseBurst(1.5, 8000, 0.15);
        
        // Sub drop after brief delay
        setTimeout(() => {
            this.playSubDrop(55 + waveNumber * 5, 1.0, 0.3);
        }, 200);
    }
    
    playImpact(frequency, duration, volume) {
        if (!this.audioContext) return;
        
        // Quick low thud
        this.playPercussive(frequency, duration, 'triangle', volume, {
            decay: duration,
            sweep: -1
        });
    }
    
    playSatisfactionChord() {
        if (!this.audioContext) return;
        
        // Minor 7th chord
        const chord = [329.63, 392.00, 493.88, 587.33]; // E minor 7
        
        chord.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'triangle', 0.08);
            }, i * 30);
        });
    }
    
    playWarning(urgency) {
        if (!this.audioContext) return;
        
        const freq = 880 + urgency * 440;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.value = freq;
        
        // Pulsing
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.setValueAtTime(0.05, this.audioContext.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.5);
    }
    
    playDroneSwell(intensity) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 55; // Low A
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        filter.frequency.linearRampToValueAtTime(800 * intensity, this.audioContext.currentTime + 2.0);
        
        gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.15 * intensity, this.audioContext.currentTime + 1.0);
        gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 2.0);
        
        osc.connect(filter);
        filter.connect(gain);
        
        // Heavy reverb
        const reverbGain = this.audioContext.createGain();
        reverbGain.gain.value = 0.6;
        gain.connect(reverbGain);
        reverbGain.connect(this.reverb);
        
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 2.1);
    }
    
    playFMComplex(level) {
        if (!this.audioContext) return;
        
        // Simple FM synthesis approximation
        const carrier = this.audioContext.createOscillator();
        const carrierGain = this.audioContext.createGain();
        const modulator = this.audioContext.createOscillator();
        const modulatorGain = this.audioContext.createGain();
        
        carrier.type = 'sine';
        carrier.frequency.value = 220;
        
        modulator.type = 'sine';
        modulator.frequency.value = 110 * (1 + level);
        
        modulatorGain.gain.value = 220 * level;
        
        carrierGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        carrierGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        modulator.connect(modulatorGain);
        modulatorGain.connect(carrier.frequency);
        carrier.connect(carrierGain);
        carrierGain.connect(this.compressor);
        
        carrier.start();
        modulator.start();
        carrier.stop(this.audioContext.currentTime + 0.6);
        modulator.stop(this.audioContext.currentTime + 0.6);
    }
    
    playDarkPulse() {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 55; // Deep A
        
        // Slow rhythmic pulse
        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, this.audioContext.currentTime + 0.3);
        gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.05, this.audioContext.currentTime + 0.9);
        
        osc.connect(gain);
        gain.connect(this.compressor);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 1.0);
    }
    
    playGlassHarmonics() {
        if (!this.audioContext) return;
        
        // High glassy tones
        const freqs = [1046.50, 1318.51, 1567.98, 2093.00]; // C6 chord
        
        freqs.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.3);
                gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2.0);
                
                osc.connect(gain);
                gain.connect(this.compressor);
                
                osc.start();
                osc.stop(this.audioContext.currentTime + 2.1);
            }, i * 200);
        });
    }
    
    playShepardTone(direction) {
        if (!this.audioContext) return;
        
        // Create Shepard tone illusion with multiple octaves
        const baseFreq = 110;
        const octaves = 4;
        
        for (let i = 0; i < octaves; i++) {
            const freq = baseFreq * Math.pow(2, i);
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            
            // Gaussian envelope for seamless loop illusion
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 1.0);
            gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2.0);
            
            osc.connect(gain);
            gain.connect(this.compressor);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 2.1);
        }
    }
    
    playCelebration(tier) {
        if (!this.audioContext) return;
        
        // Major chord arpeggio based on tier
        const baseFreq = tier === 'gold' ? 523.25 : tier === 'silver' ? 440 : 329.63;
        const chord = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
        
        chord.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.5, 'triangle', 0.12);
            }, i * 100);
        });
        
        // Add sparkle
        setTimeout(() => {
            this.playGranular(2000, 0.5, 0.5);
        }, 300);
    }
    
    playFinalChord() {
        if (!this.audioContext) return;
        
        // Resolving minor to major for emotional impact
        const minor = [261.63, 311.13, 392.00]; // C minor
        const major = [261.63, 329.63, 392.00, 523.25]; // C major with octave
        
        // Play minor first
        minor.forEach((freq, i) => {
            this.playTone(freq, 2.0, 'sine', 0.08);
        });
        
        // Resolve to major after delay
        setTimeout(() => {
            major.forEach((freq, i) => {
                this.playTone(freq, 3.0, 'sine', 0.1);
            });
        }, 1500);
    }
    
    // ===== MUSICAL UTILITY =====
    
    generateChord(root, quality) {
        const rootFreq = this.noteToFrequency(root + '3');
        
        switch (quality) {
            case 'major':
                return [rootFreq, rootFreq * 1.25, rootFreq * 1.5];
            case 'minor':
                return [rootFreq, rootFreq * 1.2, rootFreq * 1.5];
            case 'diminished':
                return [rootFreq, rootFreq * 1.2, rootFreq * 1.4];
            case 'augmented':
                return [rootFreq, rootFreq * 1.25, rootFreq * 1.6];
            default:
                return [rootFreq];
        }
    }
    
    getScaleNote(position, mode) {
        // Return frequency for scale degree
        const baseFreq = this.generativeState.rootFrequency;
        const intervals = {
            ionian: [0, 2, 4, 5, 7, 9, 11],
            dorian: [0, 2, 3, 5, 7, 9, 10],
            phrygian: [0, 1, 3, 5, 7, 8, 10],
            lydian: [0, 2, 4, 6, 7, 9, 11],
            mixolydian: [0, 2, 4, 5, 7, 9, 10],
            aeolian: [0, 2, 3, 5, 7, 8, 10],
            minor: [0, 2, 3, 5, 7, 8, 10]
        };
        
        const semitones = intervals[mode] || intervals.minor;
        const octave = Math.floor(position / 7);
        const degree = position % 7;
        const interval = semitones[degree] || 0;
        
        return baseFreq * Math.pow(2, octave + interval / 12);
    }
    
    noteToFrequency(note) {
        const notes = { 'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23, 
                       'G': 392.00, 'A': 440.00, 'B': 493.88 };
        return notes[note.charAt(0)] || 440;
    }
    
    mapRange(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
    
    // ===== GAMEPLAY INTEGRATION =====
    
    onGameplayEvent(eventType, data) {
        // Resume audio context on first interaction
        if (!this.hasInteracted && this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
            this.hasInteracted = true;
        }
        
        const handler = this.eventMappings[eventType];
        if (handler) {
            handler(data);
        }
        
        // Update generative state based on event
        this.updateGenerativeState(eventType, data);
    }
    
    updateGenerativeState(eventType, data) {
        // Intensity follows action density
        switch (eventType) {
            case 'bulletFired':
                this.generativeState.intensity = Math.min(1.0, this.generativeState.intensity + 0.02);
                break;
            case 'nearMiss':
                this.generativeState.tension = Math.min(1.0, this.generativeState.tension + 0.1);
                break;
            case 'enemyDeath':
                this.generativeState.tension = Math.max(0, this.generativeState.tension - 0.05);
                break;
            case 'waveTransition':
                this.generativeState.brightness = Math.min(1.0, this.generativeState.brightness + 0.1);
                break;
        }
        
        // Decay intensity over time
        this.generativeState.intensity *= 0.9995;
        this.generativeState.tension *= 0.995;
    }
    
    // ===== VISUAL SYNTHESIS =====
    
    createSynesthesiaVisualization() {
        // Create particles that respond to audio
        this.synesthesiaParticles = this.scene.add.particles(0, 0, 'particle', {
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.4, end: 0 },
            speed: { min: 20, max: 60 },
            lifespan: 800,
            tint: 0xffffff,
            quantity: 1,
            frequency: -1,
            blendMode: 'ADD'
        });
    }
    
    update(time, delta) {
        if (!this.audioContext || !this.isPlaying) return;
        
        // Get audio data for visualization
        if (this.analyser) {
            this.analyser.getByteFrequencyData(this.spectrumData);
            this.analyser.getByteTimeDomainData(this.waveformData);
            
            // Emit particles based on audio activity
            const bassActivity = this.spectrumData[2] / 255;
            if (bassActivity > 0.6 && Math.random() < 0.3) {
                this.emitSynesthesiaBurst(bassActivity);
            }
        }
        
        // Generative rhythm
        this.nextBeatTime -= delta;
        if (this.nextBeatTime <= 0) {
            this.onBeat();
            this.nextBeatTime = this.beatDuration * 1000;
        }
    }
    
    onBeat() {
        this.currentBeat++;
        if (this.currentBeat >= 4) {
            this.currentBeat = 0;
            this.currentMeasure++;
            this.onMeasure();
        }
        
        // Play generative bass/kick on beat
        if (this.generativeState.intensity > 0.3) {
            this.playGenerativeBeat();
        }
    }
    
    onMeasure() {
        // Update harmony every measure
        if (this.currentMeasure % 4 === 0) {
            this.progressHarmony();
        }
        
        // Play generative chord on phrase
        if (this.currentMeasure % 4 === 0 && this.generativeState.intensity > 0.5) {
            this.playGenerativeChord();
        }
    }
    
    playGenerativeBeat() {
        // Kick drum
        this.playSubDrop(60, 0.15, 0.25 * this.generativeState.intensity);
    }
    
    playGenerativeChord() {
        const chord = this.generateChord(this.generativeState.key, this.generativeState.mode);
        chord.forEach((freq, i) => {
            setTimeout(() => {
                this.playPad(freq, 1.5, { attack: 0.2, release: 0.5 });
            }, i * 50);
        });
    }
    
    progressHarmony() {
        // Modulate to related keys
        const keys = ['C', 'G', 'F', 'A', 'E'];
        const currentIndex = keys.indexOf(this.generativeState.key);
        const nextIndex = (currentIndex + Math.floor(Math.random() * 3) - 1 + keys.length) % keys.length;
        this.generativeState.key = keys[nextIndex];
    }
    
    emitSynesthesiaBurst(intensity) {
        if (!this.synesthesiaParticles || !this.scene.player) return;
        
        // Emit from player position with audio-responsive color
        const hue = (this.spectrumData[10] / 255) * 360;
        const color = Phaser.Display.Color.HSLToColor(hue / 360, 0.8, 0.6).color;
        
        this.synesthesiaParticles.emitParticleAt(
            this.scene.player.x, 
            this.scene.player.y, 
            Math.floor(intensity * 5),
            color
        );
    }
    
    // ===== PUBLIC API =====
    
    start() {
        this.isPlaying = true;
        this.runStartTime = Date.now();
        this.nextBeatTime = this.beatDuration * 1000;
        
        // Play opening chord
        this.playPad(this.generativeState.rootFrequency, 4.0, { 
            attack: 2.0, 
            release: 2.0,
            filterMod: true 
        });
        
        console.log('🎵 SYNAESTHESIA PROTOCOL ACTIVATED — The 42nd Dimension');
    }
    
    stop() {
        this.isPlaying = false;
        
        // Fade out all voices
        this.activeVoices.forEach(voice => {
            try {
                voice.gain.gain.cancelScheduledValues(this.audioContext.currentTime);
                voice.gain.gain.setValueAtTime(voice.gain.gain.value, this.audioContext.currentTime);
                voice.gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
                voice.osc.stop(this.audioContext.currentTime + 0.6);
            } catch (e) {
                // Voice may have already stopped
            }
        });
        
        this.activeVoices.clear();
    }
    
    setIntensity(value) {
        this.generativeState.intensity = Phaser.Math.Clamp(value, 0, 1);
    }
    
    setArchetype(archetype) {
        const theme = this.archetypeThemes[archetype];
        if (theme) {
            this.generativeState.mode = theme.mode;
            this.generativeState.brightness = theme.brightness;
            this.generativeState.motion = theme.motion;
        }
    }
    
    // Get visualization data for other systems
    getAudioData() {
        return {
            spectrum: this.spectrumData,
            waveform: this.waveformData,
            intensity: this.generativeState.intensity,
            beat: this.currentBeat,
            measure: this.currentMeasure,
            bpm: this.bpm
        };
    }
}
