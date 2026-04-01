import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * AmbientAwarenessSystem Harmonic Convergence Palette Sync Tests
 * 
 * Tests for the Harmonic Convergence palette synchronization that
 * syncs the ambient time-based palette with the Harmonic Convergence system.
 */

describe('AmbientAwarenessSystem Harmonic Convergence Sync', () => {
    let ambient;
    let mockScene;
    let mockHarmonicConvergence;
    
    beforeEach(() => {
        mockHarmonicConvergence = {
            setAmbientPalette: vi.fn(),
            currentPalette: null
        };
        
        mockScene = {
            time: { now: 10000 },
            player: { sprite: { setTint: vi.fn() } },
            harmonicConvergence: mockHarmonicConvergence,
            noeticMirror: { onTimeStateChange: vi.fn() }
        };
        
        ambient = {
            scene: mockScene,
            currentPalette: {
                name: 'dawn',
                background: 0x0a0a0f,
                player: 0xff6b35,
                enemy: 0xff3366,
                bullet: 0x00f0ff,
                accent: 0xffd700
            },
            currentTimeState: 'DAWN',
            
            applyPalette(palette) {
                this.currentPalette = palette;
                
                // Apply to player
                if (this.scene.player && this.scene.player.sprite) {
                    this.scene.player.sprite.setTint(palette.player);
                }
                
                // Update time state text
                if (this.timeStateText) {
                    this.timeStateText.setText(palette.name.toUpperCase());
                    this.timeStateText.setFill('#' + palette.accent.toString(16).padStart(6, '0'));
                }
                
                // Sync with Harmonic Convergence system
                this.syncWithHarmonicConvergence(palette);
                
                // Notify Noetic Mirror for commentary
                if (this.scene.noeticMirror) {
                    this.scene.noeticMirror.onTimeStateChange(this.currentTimeState);
                }
            },
            
            syncWithHarmonicConvergence(palette) {
                // Only sync if Harmonic Convergence system exists
                if (!this.scene.harmonicConvergence) {
                    return false;
                }
                
                // Convert ambient palette to Harmonic Convergence format
                const harmonicPalette = {
                    primary: palette.player,
                    secondary: palette.enemy,
                    accent: palette.accent,
                    background: palette.background,
                    source: 'ambient', // Track that this came from Ambient Awareness
                    timeState: this.currentTimeState
                };
                
                // Send to Harmonic Convergence
                this.scene.harmonicConvergence.setAmbientPalette(harmonicPalette);
                
                return true;
            },
            
            updatePaletteFromTime(hour) {
                // Determine time state from hour
                let newPalette;
                let newState;
                
                if (hour >= 5 && hour < 8) {
                    newState = 'DAWN';
                    newPalette = {
                        name: 'dawn',
                        background: 0x0a0a0f,
                        player: 0xff6b35,
                        enemy: 0xff3366,
                        bullet: 0x00f0ff,
                        accent: 0xffd700
                    };
                } else if (hour >= 8 && hour < 17) {
                    newState = 'DAY';
                    newPalette = {
                        name: 'day',
                        background: 0x1a1a2e,
                        player: 0x00f0ff,
                        enemy: 0xff3366,
                        bullet: 0xffffff,
                        accent: 0x00ff88
                    };
                } else if (hour >= 17 && hour < 20) {
                    newState = 'DUSK';
                    newPalette = {
                        name: 'dusk',
                        background: 0x1f0a1f,
                        player: 0x9d4edd,
                        enemy: 0xff0066,
                        bullet: 0xffd700,
                        accent: 0xff6b35
                    };
                } else {
                    newState = 'NIGHT';
                    newPalette = {
                        name: 'night',
                        background: 0x0a0a1a,
                        player: 0x4a90e2,
                        enemy: 0xff3366,
                        bullet: 0x9d4edd,
                        accent: 0x00f0ff
                    };
                }
                
                this.currentTimeState = newState;
                this.applyPalette(newPalette);
                
                return { state: newState, palette: newPalette };
            }
        };
    });
    
    describe('syncWithHarmonicConvergence', () => {
        it('should return false when Harmonic Convergence system does not exist', () => {
            ambient.scene.harmonicConvergence = null;
            
            const result = ambient.syncWithHarmonicConvergence(ambient.currentPalette);
            
            expect(result).toBe(false);
        });
        
        it('should convert palette to Harmonic Convergence format', () => {
            ambient.syncWithHarmonicConvergence(ambient.currentPalette);
            
            expect(mockHarmonicConvergence.setAmbientPalette).toHaveBeenCalledWith(
                expect.objectContaining({
                    primary: 0xff6b35,
                    secondary: 0xff3366,
                    accent: 0xffd700,
                    background: 0x0a0a0f,
                    source: 'ambient',
                    timeState: 'DAWN'
                })
            );
        });
        
        it('should return true when sync succeeds', () => {
            const result = ambient.syncWithHarmonicConvergence(ambient.currentPalette);
            
            expect(result).toBe(true);
        });
        
        it('should include time state in palette data', () => {
            ambient.currentTimeState = 'NIGHT';
            
            ambient.syncWithHarmonicConvergence(ambient.currentPalette);
            
            expect(mockHarmonicConvergence.setAmbientPalette).toHaveBeenCalledWith(
                expect.objectContaining({
                    timeState: 'NIGHT'
                })
            );
        });
    });
    
    describe('applyPalette', () => {
        it('should sync with Harmonic Convergence when applying palette', () => {
            const syncSpy = vi.spyOn(ambient, 'syncWithHarmonicConvergence');
            
            ambient.applyPalette(ambient.currentPalette);
            
            expect(syncSpy).toHaveBeenCalledWith(ambient.currentPalette);
        });
        
        it('should apply player tint', () => {
            ambient.applyPalette(ambient.currentPalette);
            
            expect(mockScene.player.sprite.setTint).toHaveBeenCalledWith(0xff6b35);
        });
        
        it('should notify Noetic Mirror', () => {
            ambient.applyPalette(ambient.currentPalette);
            
            expect(mockScene.noeticMirror.onTimeStateChange).toHaveBeenCalledWith('DAWN');
        });
    });
    
    describe('updatePaletteFromTime', () => {
        it('should apply DAWN palette for hours 5-7', () => {
            const result = ambient.updatePaletteFromTime(6);
            
            expect(result.state).toBe('DAWN');
            expect(result.palette.name).toBe('dawn');
        });
        
        it('should apply DAY palette for hours 8-16', () => {
            const result = ambient.updatePaletteFromTime(12);
            
            expect(result.state).toBe('DAY');
            expect(result.palette.name).toBe('day');
        });
        
        it('should apply DUSK palette for hours 17-19', () => {
            const result = ambient.updatePaletteFromTime(18);
            
            expect(result.state).toBe('DUSK');
            expect(result.palette.name).toBe('dusk');
        });
        
        it('should apply NIGHT palette for hours 20-4', () => {
            const result = ambient.updatePaletteFromTime(23);
            
            expect(result.state).toBe('NIGHT');
            expect(result.palette.name).toBe('night');
        });
        
        it('should sync with Harmonic Convergence after palette update', () => {
            const syncSpy = vi.spyOn(ambient, 'syncWithHarmonicConvergence');
            
            ambient.updatePaletteFromTime(12);
            
            expect(syncSpy).toHaveBeenCalled();
        });
    });
});
