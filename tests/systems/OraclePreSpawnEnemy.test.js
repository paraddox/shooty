import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * OracleProtocolSystem preSpawnEnemy Tests
 * 
 * Tests for the preSpawnEnemy handler that generates ghost outlines
 * of enemies about to spawn (2-3 seconds ahead).
 */

describe('OracleProtocolSystem preSpawnEnemy', () => {
    let oracle;
    let mockScene;
    let mockEnemy;
    
    beforeEach(() => {
        mockEnemy = {
            x: 500,
            y: 300,
            type: 'TRIANGLE',
            setAlpha: vi.fn(() => mockEnemy),
            setTint: vi.fn(() => mockEnemy),
            setVisible: vi.fn(() => mockEnemy),
            destroy: vi.fn()
        };
        
        mockScene = {
            time: { 
                now: 10000, 
                // Don't auto-execute callback - let tests control this
                delayedCall: vi.fn((delay, callback) => ({ remove: vi.fn() }))
            },
            add: {
                sprite: vi.fn(() => mockEnemy),
                text: vi.fn(() => ({ 
                    destroy: vi.fn(),
                    setOrigin: vi.fn(() => ({ destroy: vi.fn() }))
                }))
            },
            tweens: { add: vi.fn() },
            player: { x: 400, y: 400 },
            events: { on: vi.fn(), off: vi.fn() }
        };
        
        oracle = {
            scene: mockScene,
            premonitions: [],
            GHOST_DURATION: 3000,
            GHOST_COLOR: 0x00f0ff,
            
            setupEvents() {
                // Register preSpawnEnemy handler
                this.scene.events.on('preSpawnEnemy', this.onPreSpawnEnemy, this);
            },
            
            onPreSpawnEnemy(enemyData) {
                // Create ghost outline of impending enemy
                const ghost = this.createGhostEnemy(enemyData);
                
                // Create premonition entry
                const premonition = {
                    ghost: ghost,
                    enemyData: enemyData,
                    createdAt: this.scene.time.now,
                    fulfilled: false
                };
                
                this.premonitions.push(premonition);
                
                // Auto-remove after ghost duration
                this.scene.time.delayedCall(this.GHOST_DURATION, () => {
                    this.removePremonition(premonition);
                });
                
                // Visual announcement
                this.showPremonitionNotice(enemyData);
                
                return premonition;
            },
            
            createGhostEnemy(enemyData) {
                const ghost = this.scene.add.sprite(enemyData.x, enemyData.y, 'enemy');
                ghost.setAlpha(0.4);
                ghost.setTint(this.GHOST_COLOR);
                ghost.setVisible(true);
                
                // Pulse animation
                this.scene.tweens.add({
                    targets: ghost,
                    alpha: 0.2,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
                
                return ghost;
            },
            
            removePremonition(premonition) {
                if (premonition.ghost && premonition.ghost.destroy) {
                    premonition.ghost.destroy();
                }
                this.premonitions = this.premonitions.filter(p => p !== premonition);
            },
            
            showPremonitionNotice(enemyData) {
                const text = this.scene.add.text(
                    enemyData.x, enemyData.y - 40,
                    '◆ APPROACHING',
                    { fontSize: '12px', fill: '#00f0ff' }
                );
                text.setOrigin(0.5);
                
                this.scene.tweens.add({
                    targets: text,
                    y: enemyData.y - 60,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => text.destroy()
                });
            },
            
            cleanup() {
                this.scene.events.off('preSpawnEnemy', this.onPreSpawnEnemy, this);
            }
        };
    });
    
    describe('setupEvents', () => {
        it('should register preSpawnEnemy event handler', () => {
            oracle.setupEvents();
            
            expect(mockScene.events.on).toHaveBeenCalledWith(
                'preSpawnEnemy',
                oracle.onPreSpawnEnemy,
                oracle
            );
        });
    });
    
    describe('onPreSpawnEnemy', () => {
        it('should create ghost enemy with reduced alpha', () => {
            const enemyData = { x: 500, y: 300, type: 'TRIANGLE' };
            
            oracle.onPreSpawnEnemy(enemyData);
            
            expect(mockScene.add.sprite).toHaveBeenCalledWith(500, 300, 'enemy');
            expect(mockEnemy.setAlpha).toHaveBeenCalledWith(0.4);
        });
        
        it('should apply ghost color tint', () => {
            const enemyData = { x: 500, y: 300, type: 'TRIANGLE' };
            
            oracle.onPreSpawnEnemy(enemyData);
            
            expect(mockEnemy.setTint).toHaveBeenCalledWith(oracle.GHOST_COLOR);
        });
        
        it('should add premonition to tracking array', () => {
            const enemyData = { x: 500, y: 300, type: 'TRIANGLE' };
            
            oracle.onPreSpawnEnemy(enemyData);
            
            expect(oracle.premonitions.length).toBe(1);
            expect(oracle.premonitions[0].enemyData).toBe(enemyData);
        });
        
        it('should schedule ghost removal after duration', () => {
            const enemyData = { x: 500, y: 300, type: 'TRIANGLE' };
            
            oracle.onPreSpawnEnemy(enemyData);
            
            expect(mockScene.time.delayedCall).toHaveBeenCalledWith(
                oracle.GHOST_DURATION,
                expect.any(Function)
            );
        });
        
        it('should show premonition notice', () => {
            const enemyData = { x: 500, y: 300, type: 'TRIANGLE' };
            
            oracle.onPreSpawnEnemy(enemyData);
            
            expect(mockScene.add.text).toHaveBeenCalledWith(
                500, 260,  // y - 40
                '◆ APPROACHING',
                expect.any(Object)
            );
        });
        
        it('should start pulse animation on ghost', () => {
            const enemyData = { x: 500, y: 300, type: 'TRIANGLE' };
            
            oracle.onPreSpawnEnemy(enemyData);
            
            expect(mockScene.tweens.add).toHaveBeenCalledWith(
                expect.objectContaining({
                    targets: mockEnemy,
                    yoyo: true,
                    repeat: -1
                })
            );
        });
    });
    
    describe('removePremonition', () => {
        it('should destroy ghost sprite', () => {
            const premonition = {
                ghost: mockEnemy,
                enemyData: { x: 500, y: 300 }
            };
            oracle.premonitions.push(premonition);
            
            oracle.removePremonition(premonition);
            
            expect(mockEnemy.destroy).toHaveBeenCalled();
        });
        
        it('should remove from tracking array', () => {
            const premonition = {
                ghost: mockEnemy,
                enemyData: { x: 500, y: 300 }
            };
            oracle.premonitions.push(premonition);
            
            oracle.removePremonition(premonition);
            
            expect(oracle.premonitions.length).toBe(0);
        });
    });
    
    describe('cleanup', () => {
        it('should unregister event handler', () => {
            oracle.cleanup();
            
            expect(mockScene.events.off).toHaveBeenCalledWith(
                'preSpawnEnemy',
                oracle.onPreSpawnEnemy,
                oracle
            );
        });
    });
});
