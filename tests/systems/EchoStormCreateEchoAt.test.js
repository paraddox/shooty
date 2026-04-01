import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * EchoStormSystem createEchoAt Tests
 * 
 * Tests for the createEchoAt method that allows spawning echoes at specific
 * positions for Symbiotic Prediction fulfillment.
 */

describe('EchoStormSystem createEchoAt', () => {
    let mockScene;
    let echoStorm;
    let mockEcho;
    
    beforeEach(() => {
        mockEcho = {
            setPosition: vi.fn(() => mockEcho),
            setAlpha: vi.fn(() => mockEcho),
            setVisible: vi.fn(() => mockEcho),
            setRotation: vi.fn(() => mockEcho),
            setTint: vi.fn(() => mockEcho),
            clearTint: vi.fn(() => mockEcho),
            echoData: { active: false }
        };
        
        mockScene = {
            time: { now: 10000 },
            nearMissState: { active: true },
            cameras: {
                main: {
                    flash: vi.fn()
                }
            },
            tweens: {
                add: vi.fn(({ onComplete }) => {
                    // Simulate tween completion for testing
                    if (onComplete) setTimeout(onComplete, 0);
                })
            },
            player: { x: 100, y: 100 }
        };
        
        echoStorm = {
            scene: mockScene,
            ECHO_LIFETIME: 3000,
            ECHO_COLOR: 0x00f0ff,
            echoTrailPool: [mockEcho],
            echoBullets: [],
            
            createEchoAt(x, y, options = {}) {
                // Must be during bullet time
                if (!this.scene.nearMissState?.active && !options.force) {
                    return false;
                }
                
                // Find inactive echo from pool
                const echo = this.echoTrailPool.find(e => !e.echoData.active);
                if (!echo) return false;
                
                // Set up echo with random drift velocity
                const driftSpeed = options.driftSpeed || 30;
                const angle = Math.random() * Math.PI * 2;
                const vx = Math.cos(angle) * driftSpeed;
                const vy = Math.sin(angle) * driftSpeed;
                
                // Activate echo at position
                echo.setPosition(x, y);
                echo.setAlpha(options.alpha || 0.8);
                echo.setVisible(true);
                echo.setRotation(angle);
                
                // Apply custom color if provided
                if (options.color) {
                    echo.setTint(options.color);
                } else {
                    echo.clearTint();
                }
                
                echo.echoData = {
                    active: true,
                    birthTime: this.scene.time.now,
                    velocityX: vx,
                    velocityY: vy,
                    absorbed: false,
                    originalBullet: null,
                    isSynthetic: true
                };
                
                this.echoBullets.push({
                    echo: echo,
                    bullet: null
                });
                
                const lifetime = options.lifetime || this.ECHO_LIFETIME;
                
                // Visual flash
                this.scene.cameras.main.flash(100, 0x9d4edd, 0.2);
                
                return true;
            }
        };
    });
    
    describe('createEchoAt', () => {
        it('should return false when not in bullet time', () => {
            mockScene.nearMissState.active = false;
            
            const result = echoStorm.createEchoAt(100, 200);
            
            expect(result).toBe(false);
        });
        
        it('should return true when echo is created during bullet time', () => {
            const result = echoStorm.createEchoAt(100, 200);
            
            expect(result).toBe(true);
        });
        
        it('should create echo at specified position', () => {
            echoStorm.createEchoAt(150, 250);
            
            expect(mockEcho.setPosition).toHaveBeenCalledWith(150, 250);
        });
        
        it('should set echo as visible', () => {
            echoStorm.createEchoAt(100, 200);
            
            expect(mockEcho.setVisible).toHaveBeenCalledWith(true);
        });
        
        it('should apply default alpha of 0.8', () => {
            echoStorm.createEchoAt(100, 200);
            
            expect(mockEcho.setAlpha).toHaveBeenCalledWith(0.8);
        });
        
        it('should apply custom alpha when provided', () => {
            echoStorm.createEchoAt(100, 200, { alpha: 0.5 });
            
            expect(mockEcho.setAlpha).toHaveBeenCalledWith(0.5);
        });
        
        it('should apply custom color when provided', () => {
            echoStorm.createEchoAt(100, 200, { color: 0xff0000 });
            
            expect(mockEcho.setTint).toHaveBeenCalledWith(0xff0000);
        });
        
        it('should clear tint when no color provided', () => {
            echoStorm.createEchoAt(100, 200);
            
            expect(mockEcho.clearTint).toHaveBeenCalled();
        });
        
        it('should mark echo as synthetic', () => {
            echoStorm.createEchoAt(100, 200);
            
            expect(mockEcho.echoData.isSynthetic).toBe(true);
        });
        
        it('should set echoData.active to true', () => {
            echoStorm.createEchoAt(100, 200);
            
            expect(mockEcho.echoData.active).toBe(true);
        });
        
        it('should record birth time', () => {
            echoStorm.createEchoAt(100, 200);
            
            expect(mockEcho.echoData.birthTime).toBe(10000);
        });
        
        it('should add echo to echoBullets array', () => {
            echoStorm.createEchoAt(100, 200);
            
            expect(echoStorm.echoBullets.length).toBe(1);
            expect(echoStorm.echoBullets[0].echo).toBe(mockEcho);
        });
        
        it('should trigger camera flash', () => {
            echoStorm.createEchoAt(100, 200);
            
            expect(mockScene.cameras.main.flash).toHaveBeenCalledWith(100, 0x9d4edd, 0.2);
        });
        
        it('should allow creation with force option outside bullet time', () => {
            mockScene.nearMissState.active = false;
            
            const result = echoStorm.createEchoAt(100, 200, { force: true });
            
            expect(result).toBe(true);
        });
        
        it('should return false when no inactive echoes in pool', () => {
            mockEcho.echoData.active = true; // Mark as active
            
            const result = echoStorm.createEchoAt(100, 200);
            
            expect(result).toBe(false);
        });
    });
});
