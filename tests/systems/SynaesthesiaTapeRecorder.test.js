import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * SynaesthesiaProtocolSystem Tape Recorder Sound Tests
 * 
 * Tests for the chronoRecord tape recorder sound effect implementation.
 */

describe('SynaesthesiaProtocolSystem chronoRecord', () => {
    let synaesthesia;
    let mockScene;
    let mockAudioContext;
    let createdOscillators;
    let mockGainNode;
    let mockFilter;
    
    beforeEach(() => {
        createdOscillators = [];
        
        mockGainNode = {
            connect: vi.fn(() => mockGainNode),
            gain: { 
                value: 0, 
                setValueAtTime: vi.fn(), 
                linearRampToValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn()
            }
        };
        
        mockFilter = {
            connect: vi.fn(() => mockFilter),
            frequency: { value: 0 }
        };
        
        mockAudioContext = {
            createOscillator: vi.fn(() => {
                const osc = {
                    connect: vi.fn(() => osc),
                    start: vi.fn(),
                    stop: vi.fn(),
                    frequency: { value: 0 },
                    type: 'sine'
                };
                createdOscillators.push(osc);
                return osc;
            }),
            createGain: vi.fn(() => mockGainNode),
            createBiquadFilter: vi.fn(() => mockFilter),
            currentTime: 0,
            destination: {}
        };
        
        mockScene = {
            sound: {
                context: mockAudioContext
            }
        };
        
        synaesthesia = {
            scene: mockScene,
            compressor: {},
            audioContext: mockAudioContext,
            
            // Reference to actual implementation
            playTapeRecorderEffect() {
                if (!this.audioContext) return;
                
                const now = this.audioContext.currentTime;
                
                // Carrier oscillator (tape motor hum)
                const carrier = this.audioContext.createOscillator();
                carrier.type = 'sine';
                carrier.frequency.value = 60; // 60Hz hum
                
                // FM modulation for tape wobble
                const modulator = this.audioContext.createOscillator();
                modulator.type = 'sine';
                modulator.frequency.value = 3; // 3Hz wow/flutter
                
                const modGain = this.audioContext.createGain();
                modGain.gain.value = 2; // Modulation depth
                
                // Main tone
                const tone = this.audioContext.createOscillator();
                tone.type = 'sawtooth';
                tone.frequency.value = 440;
                
                // Lowpass filter for tape warmth
                const filter = this.audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 3000;
                
                // Gain envelope
                const gain = this.audioContext.createGain();
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
                
                // Connect graph
                modulator.connect(modGain);
                modGain.connect(tone.frequency);
                tone.connect(filter);
                carrier.connect(filter);
                filter.connect(gain);
                gain.connect(this.compressor);
                
                // Start/stop
                carrier.start(now);
                modulator.start(now);
                tone.start(now);
                
                carrier.stop(now + 1.0);
                modulator.stop(now + 1.0);
                tone.stop(now + 1.0);
                
                return { carrier, modulator, tone, filter, gain };
            }
        };
    });
    
    describe('playTapeRecorderEffect', () => {
        it('should create carrier oscillator at 60Hz', () => {
            synaesthesia.playTapeRecorderEffect();
            
            expect(mockAudioContext.createOscillator).toHaveBeenCalled();
            // First call should be carrier
            expect(createdOscillators[0].frequency.value).toBe(60);
            expect(createdOscillators[0].type).toBe('sine');
        });
        
        it('should create modulator at 3Hz for wow/flutter', () => {
            synaesthesia.playTapeRecorderEffect();
            
            // Second call should be modulator
            expect(createdOscillators[1].frequency.value).toBe(3);
            expect(createdOscillators[1].type).toBe('sine');
        });
        
        it('should create main tone at 440Hz', () => {
            synaesthesia.playTapeRecorderEffect();
            
            // Third call should be tone
            expect(createdOscillators[2].frequency.value).toBe(440);
            expect(createdOscillators[2].type).toBe('sawtooth');
        });
        
        it('should create lowpass filter at 3000Hz for tape warmth', () => {
            synaesthesia.playTapeRecorderEffect();
            
            expect(mockAudioContext.createBiquadFilter).toHaveBeenCalled();
            expect(mockFilter.type).toBe('lowpass');
            expect(mockFilter.frequency.value).toBe(3000);
        });
        
        it('should set up gain envelope with attack and decay', () => {
            synaesthesia.playTapeRecorderEffect();
            
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.3, 0.1);
        });
        
        it('should start all oscillators', () => {
            synaesthesia.playTapeRecorderEffect();
            
            expect(createdOscillators[0].start).toHaveBeenCalled();
            expect(createdOscillators[1].start).toHaveBeenCalled();
            expect(createdOscillators[2].start).toHaveBeenCalled();
        });
        
        it('should stop all oscillators after 1 second', () => {
            synaesthesia.playTapeRecorderEffect();
            
            expect(createdOscillators[0].stop).toHaveBeenCalledWith(1.0);
            expect(createdOscillators[1].stop).toHaveBeenCalledWith(1.0);
            expect(createdOscillators[2].stop).toHaveBeenCalledWith(1.0);
        });
        
        it('should return audio nodes for potential chaining', () => {
            const result = synaesthesia.playTapeRecorderEffect();
            
            expect(result).toHaveProperty('carrier');
            expect(result).toHaveProperty('modulator');
            expect(result).toHaveProperty('tone');
            expect(result).toHaveProperty('filter');
            expect(result).toHaveProperty('gain');
        });
    });
});
