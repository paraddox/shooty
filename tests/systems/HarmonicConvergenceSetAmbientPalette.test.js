import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * HarmonicConvergenceSystem setAmbientPalette Tests
 * 
 * Tests for the setAmbientPalette method that receives palette data
 * from AmbientAwarenessSystem.
 */

describe('HarmonicConvergenceSystem setAmbientPalette', () => {
    let harmonicConvergence;
    let mockScene;
    
    beforeEach(() => {
        mockScene = {
            time: { now: 10000 },
            cameras: { main: { setBackgroundColor: vi.fn() } }
        };
        
        harmonicConvergence = {
            scene: mockScene,
            currentPalette: null,
            ambientPaletteSource: null,
            
            /**
             * Receive ambient palette from AmbientAwarenessSystem
             * @param {Object} palette - Palette data from ambient system
             * @returns {boolean} - Whether palette was applied
             */
            setAmbientPalette(palette) {
                if (!palette || !palette.primary) {
                    return false;
                }
                
                // Store the ambient palette
                this.currentPalette = {
                    primary: palette.primary,
                    secondary: palette.secondary,
                    accent: palette.accent,
                    background: palette.background,
                    timeState: palette.timeState || 'unknown'
                };
                
                // Track that this came from ambient system
                this.ambientPaletteSource = palette.source || 'unknown';
                
                // Apply background color if provided
                if (palette.background && this.scene.cameras?.main) {
                    const bgColor = '#' + palette.background.toString(16).padStart(6, '0');
                    this.scene.cameras.main.setBackgroundColor(bgColor);
                }
                
                console.log(`🎨 Harmonic Convergence synced with ${palette.timeState} palette from ${this.ambientPaletteSource}`);
                
                return true;
            }
        };
    });
    
    describe('setAmbientPalette', () => {
        it('should store the received palette', () => {
            const palette = {
                primary: 0xff6b35,
                secondary: 0xff3366,
                accent: 0xffd700,
                background: 0x0a0a0f,
                source: 'ambient',
                timeState: 'DAWN'
            };
            
            harmonicConvergence.setAmbientPalette(palette);
            
            expect(harmonicConvergence.currentPalette).toEqual({
                primary: 0xff6b35,
                secondary: 0xff3366,
                accent: 0xffd700,
                background: 0x0a0a0f,
                timeState: 'DAWN'
            });
        });
        
        it('should track the source of the palette', () => {
            const palette = {
                primary: 0x00f0ff,
                source: 'ambient',
                timeState: 'DAY'
            };
            
            harmonicConvergence.setAmbientPalette(palette);
            
            expect(harmonicConvergence.ambientPaletteSource).toBe('ambient');
        });
        
        it('should apply background color to camera', () => {
            const palette = {
                primary: 0x9d4edd,
                background: 0x1f0a1f,
                source: 'ambient',
                timeState: 'DUSK'
            };
            
            harmonicConvergence.setAmbientPalette(palette);
            
            expect(mockScene.cameras.main.setBackgroundColor).toHaveBeenCalledWith('#1f0a1f');
        });
        
        it('should return true on successful palette application', () => {
            const palette = {
                primary: 0x4a90e2,
                source: 'ambient',
                timeState: 'NIGHT'
            };
            
            const result = harmonicConvergence.setAmbientPalette(palette);
            
            expect(result).toBe(true);
        });
        
        it('should return false for invalid palette (no primary)', () => {
            const palette = {
                secondary: 0xff3366,
                source: 'ambient'
            };
            
            const result = harmonicConvergence.setAmbientPalette(palette);
            
            expect(result).toBe(false);
        });
        
        it('should return false for null/undefined palette', () => {
            expect(harmonicConvergence.setAmbientPalette(null)).toBe(false);
            expect(harmonicConvergence.setAmbientPalette(undefined)).toBe(false);
        });
        
        it('should default timeState to unknown if not provided', () => {
            const palette = {
                primary: 0x00f0ff,
                source: 'ambient'
                // timeState omitted
            };
            
            harmonicConvergence.setAmbientPalette(palette);
            
            expect(harmonicConvergence.currentPalette.timeState).toBe('unknown');
        });
        
        it('should handle all four time-of-day palettes', () => {
            const palettes = [
                { primary: 0xff6b35, timeState: 'DAWN', source: 'ambient' },
                { primary: 0x00f0ff, timeState: 'DAY', source: 'ambient' },
                { primary: 0x9d4edd, timeState: 'DUSK', source: 'ambient' },
                { primary: 0x4a90e2, timeState: 'NIGHT', source: 'ambient' }
            ];
            
            palettes.forEach(palette => {
                const result = harmonicConvergence.setAmbientPalette(palette);
                expect(result).toBe(true);
                expect(harmonicConvergence.currentPalette.timeState).toBe(palette.timeState);
            });
        });
    });
});
