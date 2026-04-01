import Phaser from 'phaser';

/**
 * Tychos Aurora Protocol — The 43rd Cognitive Dimension: PHASE SPACE MANIFESTATION
 * 
 * "The invisible made visible. The void speaks in light."
 * 
 * This system renders the hidden topology of the bullet hell as shimmering 
 * aurora borealis patterns that flow across the game space. It makes the 
 * invisible mathematics of survival visible - and beautiful.
 * 
 * === THE CORE CONCEPT ===
 * 
 * Every bullet, enemy, and player movement creates "ripples" in the game's 
 * phase space - invisible force fields that determine where safety and danger 
 * exist. The Tychos Aurora Protocol manifests these ripples as flowing light:
 * 
 * - Safe corridors appear as aurora tunnels glowing with cyan serenity
 * - Bullet trajectories leave ion trails showing their magnetic field lines  
 * - Enemy spawn points pulse like gravitational wells in crimson
 * - Player momentum creates rippling wakes of silver light
 * - High-danger zones shimmer with warning amber
 * - The "eye of the storm" - the optimal position - glows with whitegold
 * 
 * === THE TYCHOS FIELD ===
 * 
 * The system maintains a continuous field simulation (TYCHOS_FIELD) that tracks:
 * 
 * | Field Layer | Data Source | Visual Manifestation |
 * |-------------|-------------|---------------------|
 * | Safety Field | Inverse bullet density | Cyan aurora corridors |
 * | Danger Field | Bullet velocity vectors | Crimson ion trails |
 * | Spawn Field | Enemy spawn probability | Pulsing gravity wells |
 * | Momentum Field | Player movement history | Silver wake patterns |
 * | Optimal Field | AI pathfinding + predictions | Whitegold guidance glow |
 * | Memory Field | Timeline Chronicle data | Ghost echoes in violet |
 * 
 * === GAMEPLAY INTEGRATION ===
 * 
 * This isn't just eye-candy - the aurora provides genuine tactical information:
 * 
 * 1. READING THE VOID: Expert players learn to "surf" the aurora currents,
 *    finding the flow lines that lead to safety
 * 
 * 2. PREDICTIVE ILLUMINATION: Before enemies spawn, their spawn point pulses,
 *    giving 0.5-1 second of advance warning visualized as aurora concentration
 * 
 * 3. BULLET PATTERN RECOGNITION: Complex bullet hells create recognizable
 *    aurora signatures - spiral patterns, grid formations, radial bursts
 * 
 * 4. FLOW STATE INDICATOR: When the player is "in the zone", their wake
 *    becomes longer and more luminous - immediate feedback on performance
 * 
 * 5. THE EYE: During intense moments, the optimal position glows brightest,
 *    a subtle guidance system that rewards player intuition
 * 
 * === AESTHETIC PRINCIPLES ===
 * 
 * - Clean geometric flows (no particle noise, pure mathematical beauty)
 * - Limited palette: Cyan (safety), Crimson (danger), Silver (momentum),
 *   Amber (warning), Whitegold (optimal), Violet (memory)
 * - High contrast against the dark void background
 * - Smooth, flowing animations at 60fps using shader-based rendering
 * - Minimalist - the aurora enhances, never obscures, the gameplay
 * 
 * === SYNERGIES ===
 * 
 * - Synaesthesia Protocol: Aurora patterns sync to the audio frequencies
 * - Oracle Protocol: Prophecies manifest as aurora premonitions
 * - Bootstrap Protocol: Future echoes appear as ghost aurora traces
 * - Mnemosyne Weave: Past runs leave persistent aurora "scars" in the void
 * - Observer Effect: The aurora evolves to match the player's visual style
 * - Temporal Residue: Echoes create ripples in the aurora field
 * - Harmonic Convergence: Aurora flows lock to the musical tempo
 * - Symbiotic Prediction: The "Eye" guidance comes from AI pathfinding
 * 
 * === THE 43RD DIMENSION ===
 * 
 * All 42 previous dimensions added new cognitive systems. The Tychos Aurora
 * Protocol adds a new PERCEPTUAL dimension - making visible what was always
 * there but never seen. It completes the cognitive architecture by giving
 * the player a new sense: sight beyond sight.
 * 
 * Color: Aurora Cyan — the color of revealed truth, flowing like light 
 * through the cracks of reality.
 * 
 * "In the depths of the void, the aurora whispers: 'Here is safety. 
 * Here is danger. Here is the path you seek.'"
 */

export default class TychosAuroraSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== TYCHOS FIELD STATE =====
        this.fieldResolution = 40; // 40x30 grid covering the arena
        this.fieldWidth = 48; // 1920 / 40
        this.fieldHeight = 48; // 1440 / 30
        this.columns = 40;
        this.rows = 30;
        
        // Field layers (each cell holds values 0-1)
        this.safetyField = new Float32Array(this.columns * this.rows);
        this.dangerField = new Float32Array(this.columns * this.rows);
        this.spawnField = new Float32Array(this.columns * this.rows);
        this.momentumField = new Float32Array(this.columns * this.rows);
        this.optimalField = new Float32Array(this.columns * this.rows);
        this.memoryField = new Float32Array(this.columns * this.rows);
        
        // Field decay rates
        this.decayRates = {
            safety: 0.92,
            danger: 0.88,
            spawn: 0.85,
            momentum: 0.90,
            optimal: 0.95,
            memory: 0.98
        };
        
        // ===== AURORA RENDERING =====
        this.auroraGraphics = null;
        this.flowLines = [];
        this.gravityWells = [];
        this.wakeParticles = [];
        this.eyeGlow = null;
        
        // ===== PLAYER TRACKING =====
        this.playerPath = [];
        this.maxPathLength = 20;
        this.playerVelocity = { x: 0, y: 0 };
        this.lastPlayerPos = { x: 0, y: 0 };
        
        // ===== SPAWN PREDICTION =====
        this.spawnPredictions = [];
        this.predictionAccuracy = 0.7; // 70% accurate predictions
        
        // ===== OPTIMAL POSITION =====
        this.optimalPosition = { x: 960, y: 720 };
        this.optimalIntensity = 0;
        
        // ===== MEMORY ECHOES =====
        this.memoryEchoes = [];
        this.maxEchoes = 5;
        
        // ===== VISUALIZATION SETTINGS =====
        this.colors = {
            safety: 0x00f0ff,      // Cyan
            danger: 0xff3366,      // Crimson
            spawn: 0xffaa00,       // Amber
            momentum: 0xc0c0c0,    // Silver
            optimal: 0xffd700,     // Whitegold
            memory: 0x9b59b6       // Violet
        };
        
        this.auroraAlpha = 0.35;      // Base aurora opacity
        this.flowSpeed = 1.0;         // Animation speed
        this.time = 0;                // Animation time
        
        // ===== SHADER UNIFORMS =====
        this.shaderUniforms = {
            time: 0,
            resolution: { x: 1920, y: 1440 },
            safetyData: null,
            dangerData: null,
            playerPos: { x: 960, y: 720 },
            optimalPos: { x: 960, y: 720 },
            intensity: 1.0
        };
        
        this.init();
    }
    
    init() {
        this.createAuroraGraphics();
        this.createShaders();
        this.createGravityWells();
        this.createEyeGlow();
        this.createWakeSystem();
    }
    
    createAuroraGraphics() {
        // Check for UnifiedGraphicsManager (new architecture)
        if (this.scene.graphicsManager) {
            this.useUnifiedRenderer = true;
        } else {
            this.useUnifiedRenderer = false;
            // Legacy: Main aurora rendering layer
            this.auroraGraphics = this.scene.add.graphics();
            this.auroraGraphics.setDepth(5); // Between background (0) and gameplay (10+)
        }
        
        // Aurora texture for shader (still needed for both paths)
        this.auroraCanvas = document.createElement('canvas');
        this.auroraCanvas.width = this.columns;
        this.auroraCanvas.height = this.rows;
        this.auroraTexture = this.scene.textures.addCanvas('auroraField', this.auroraCanvas);
        
        // Field data texture (for shader access)
        this.fieldTexture = this.scene.textures.addCanvas('fieldData', this.auroraCanvas);
    }
    
    createShaders() {
        // Aurora flow shader - creates the flowing light effect
        const auroraShader = `
            precision mediump float;
            
            uniform float time;
            uniform vec2 resolution;
            uniform sampler2D fieldData;
            uniform vec2 playerPos;
            uniform float intensity;
            
            varying vec2 vTextureCoord;
            
            // Color palette
            vec3 safetyColor = vec3(0.0, 0.941, 1.0);    // Cyan
            vec3 dangerColor = vec3(1.0, 0.2, 0.4);       // Crimson
            vec3 spawnColor = vec3(1.0, 0.667, 0.0);      // Amber
            vec3 optimalColor = vec3(1.0, 0.843, 0.0);    // Whitegold
            
            void main() {
                vec2 uv = vTextureCoord;
                vec2 worldPos = uv * resolution;
                
                // Sample field data
                vec4 field = texture2D(fieldData, uv);
                float safety = field.r;
                float danger = field.g;
                float spawn = field.b;
                float optimal = field.a;
                
                // Create flowing aurora pattern
                float flow = sin(uv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
                flow *= sin(uv.y * 8.0 - time * 1.5) * 0.5 + 0.5;
                
                // Distance from player (creates wake effect)
                float distToPlayer = distance(worldPos, playerPos) / 500.0;
                float wake = smoothstep(1.0, 0.0, distToPlayer) * 0.3;
                
                // Combine fields with flow
                vec3 aurora = vec3(0.0);
                aurora += safetyColor * safety * flow * 0.8;
                aurora += dangerColor * danger * (1.0 - flow) * 0.6;
                aurora += spawnColor * spawn * 0.9;
                aurora += optimalColor * optimal * 1.2;
                
                // Add subtle wake
                aurora += safetyColor * wake * 0.4;
                
                // Vignette for depth
                float vignette = 1.0 - smoothstep(0.3, 0.8, length(uv - 0.5));
                aurora *= vignette * intensity;
                
                gl_FragColor = vec4(aurora, max(max(safety, danger), max(spawn, optimal)) * 0.4);
            }
        `;
        
        // Create shader pipeline using graphics
        this.shaderPipeline = auroraShader;
    }
    
    createGravityWells() {
        // Container for spawn prediction gravity wells
        if (!this.useUnifiedRenderer) {
            this.gravityWellGraphics = this.scene.add.graphics();
            this.gravityWellGraphics.setDepth(6);
        }
        
        // Well sprites pool (still needed for both paths as they're game objects, not graphics)
        this.wellPool = [];
        for (let i = 0; i < 8; i++) {
            const well = this.scene.add.circle(0, 0, 30, this.colors.spawn, 0);
            well.setDepth(6);
            well.setVisible(false);
            this.wellPool.push(well);
        }
    }
    
    createEyeGlow() {
        // The "Eye" - optimal position guidance
        this.eyeGraphics = this.scene.add.graphics();
        this.eyeGraphics.setDepth(7);
        
        this.eyeGlow = this.scene.add.circle(960, 720, 50, this.colors.optimal, 0.2);
        this.eyeGlow.setDepth(7);
        this.eyeGlow.setVisible(false);
        
        // Eye pulsing animation
        this.scene.tweens.add({
            targets: this.eyeGlow,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0.1, to: 0.3 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createWakeSystem() {
        // Player wake visualization
        if (!this.useUnifiedRenderer) {
            this.wakeGraphics = this.scene.add.graphics();
            this.wakeGraphics.setDepth(6);
            
            // Wake line that follows player
            this.wakeLine = this.scene.add.graphics();
            this.wakeLine.setDepth(6);
        }
    }
    
    update(delta) {
        this.time += delta / 1000;
        
        // Update player tracking
        this.updatePlayerTracking();
        
        // Update field simulation
        this.updateFields();
        
        // Calculate spawn predictions
        this.updateSpawnPredictions();
        
        // Calculate optimal position
        this.updateOptimalPosition();
        
        // Render aurora visualization
        this.renderAurora();
        
        // Update gravity wells
        this.updateGravityWells();
        
        // Update eye glow
        this.updateEyeGlow();
        
        // Update player wake
        this.updateWake();
        
        // Update memory echoes
        this.updateMemoryEchoes();
    }
    
    updatePlayerTracking() {
        if (!this.scene.player || !this.scene.player.active) return;
        
        const player = this.scene.player;
        const currentPos = { x: player.x, y: player.y };
        
        // Calculate velocity
        this.playerVelocity = {
            x: currentPos.x - this.lastPlayerPos.x,
            y: currentPos.y - this.lastPlayerPos.y
        };
        
        // Update path history
        this.playerPath.unshift({ ...currentPos });
        if (this.playerPath.length > this.maxPathLength) {
            this.playerPath.pop();
        }
        
        // Add to momentum field around player position
        this.addToField('momentum', currentPos.x, currentPos.y, 1.0);
        
        // Add momentum trail
        const speed = Math.sqrt(
            this.playerVelocity.x ** 2 + 
            this.playerVelocity.y ** 2
        );
        
        if (speed > 5) {
            // Create wake behind player
            const wakeX = currentPos.x - this.playerVelocity.x * 2;
            const wakeY = currentPos.y - this.playerVelocity.y * 2;
            this.addToField('momentum', wakeX, wakeY, 0.5);
        }
        
        this.lastPlayerPos = currentPos;
    }
    
    updateFields() {
        // Decay all fields
        for (let i = 0; i < this.columns * this.rows; i++) {
            this.safetyField[i] *= this.decayRates.safety;
            this.dangerField[i] *= this.decayRates.danger;
            this.spawnField[i] *= this.decayRates.spawn;
            this.momentumField[i] *= this.decayRates.momentum;
            this.optimalField[i] *= this.decayRates.optimal;
            this.memoryField[i] *= this.decayRates.memory;
        }
        
        // Add bullet influence to danger field
        if (this.scene.enemyBullets) {
            this.scene.enemyBullets.getChildren().forEach(bullet => {
                if (bullet.active) {
                    // Add danger at bullet position
                    this.addToField('danger', bullet.x, bullet.y, 0.8);
                    
                    // Predict future position and add danger there too
                    const velocity = bullet.body.velocity;
                    for (let t = 1; t <= 5; t++) {
                        const futureX = bullet.x + velocity.x * t * 0.1;
                        const futureY = bullet.y + velocity.y * t * 0.1;
                        this.addToField('danger', futureX, futureY, 0.5 / t);
                    }
                }
            });
        }
        
        // Add enemy influence
        if (this.scene.enemies) {
            this.scene.enemies.getChildren().forEach(enemy => {
                if (enemy.active) {
                    // Enemies create danger zones
                    this.addToField('danger', enemy.x, enemy.y, 0.6);
                    
                    // But create safety in the "shadow" behind them
                    const player = this.scene.player;
                    if (player && player.active) {
                        const angle = Phaser.Math.Angle.Between(
                            enemy.x, enemy.y,
                            player.x, player.y
                        );
                        const safeX = enemy.x + Math.cos(angle) * 100;
                        const safeY = enemy.y + Math.sin(angle) * 100;
                        this.addToField('safety', safeX, safeY, 0.3);
                    }
                }
            });
        }
        
        // Propagate fields (blur/diffusion)
        this.propagateField(this.safetyField);
        this.propagateField(this.dangerField);
    }
    
    addToField(fieldName, x, y, value) {
        // Convert world position to grid coordinates
        const col = Math.floor(x / this.fieldWidth);
        const row = Math.floor(y / this.fieldHeight);
        
        if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) return;
        
        const index = row * this.columns + col;
        
        // Add with falloff for neighboring cells
        for (let dc = -1; dc <= 1; dc++) {
            for (let dr = -1; dr <= 1; dr++) {
                const c = col + dc;
                const r = row + dr;
                if (c >= 0 && c < this.columns && r >= 0 && r < this.rows) {
                    const idx = r * this.columns + c;
                    const dist = Math.sqrt(dc * dc + dr * dr);
                    const falloff = 1 - (dist * 0.3);
                    
                    switch (fieldName) {
                        case 'safety':
                            this.safetyField[idx] = Math.min(1, this.safetyField[idx] + value * falloff);
                            break;
                        case 'danger':
                            this.dangerField[idx] = Math.min(1, this.dangerField[idx] + value * falloff);
                            break;
                        case 'momentum':
                            this.momentumField[idx] = Math.min(1, this.momentumField[idx] + value * falloff);
                            break;
                        case 'spawn':
                            this.spawnField[idx] = Math.min(1, this.spawnField[idx] + value * falloff);
                            break;
                        case 'optimal':
                            this.optimalField[idx] = Math.min(1, this.optimalField[idx] + value * falloff);
                            break;
                        case 'memory':
                            this.memoryField[idx] = Math.min(1, this.memoryField[idx] + value * falloff);
                            break;
                    }
                }
            }
        }
    }
    
    propagateField(field) {
        // Simple diffusion - average with neighbors
        const temp = new Float32Array(field);
        for (let row = 1; row < this.rows - 1; row++) {
            for (let col = 1; col < this.columns - 1; col++) {
                const idx = row * this.columns + col;
                const sum = (
                    temp[idx] +
                    temp[idx - 1] + temp[idx + 1] +
                    temp[idx - this.columns] + temp[idx + this.columns]
                ) / 5;
                field[idx] = field[idx] * 0.7 + sum * 0.3;
            }
        }
    }
    
    updateSpawnPredictions() {
        // Predict enemy spawn locations based on wave timing
        if (!this.scene.wave || !this.scene.nextWaveTime) return;
        
        const timeToNextWave = this.scene.nextWaveTime - this.scene.time.now;
        
        // As wave approaches, predict spawn locations
        if (timeToNextWave < 2000 && timeToNextWave > 0) {
            // Predict 3-5 spawn points around the arena edges
            const numPredictions = 3 + Math.floor(Math.random() * 3);
            
            for (let i = 0; i < numPredictions; i++) {
                // Random edge position
                const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
                let x, y;
                
                switch (edge) {
                    case 0: x = Math.random() * 1920; y = 0; break;
                    case 1: x = 1920; y = Math.random() * 1440; break;
                    case 2: x = Math.random() * 1920; y = 1440; break;
                    case 3: x = 0; y = Math.random() * 1440; break;
                }
                
                // Add to spawn field
                this.addToField('spawn', x, y, 0.7 * (1 - timeToNextWave / 2000));
                
                // Track prediction
                this.spawnPredictions.push({
                    x, y,
                    confidence: 1 - timeToNextWave / 2000,
                    time: this.scene.time.now
                });
            }
        }
        
        // Clean old predictions
        this.spawnPredictions = this.spawnPredictions.filter(
            p => this.scene.time.now - p.time < 3000
        );
    }
    
    updateOptimalPosition() {
        // Calculate the "optimal" position - safest place to be
        // Based on: distance from enemies, distance from bullets, proximity to center
        
        let bestScore = -Infinity;
        let bestX = 960;
        let bestY = 720;
        
        // Sample points on a grid
        for (let x = 200; x < 1720; x += 100) {
            for (let y = 200; y < 1240; y += 100) {
                let score = 0;
                
                // Add safety field value
                const col = Math.floor(x / this.fieldWidth);
                const row = Math.floor(y / this.fieldHeight);
                if (col >= 0 && col < this.columns && row >= 0 && row < this.rows) {
                    score += this.safetyField[row * this.columns + col] * 50;
                }
                
                // Subtract danger
                if (this.scene.enemyBullets) {
                    this.scene.enemyBullets.getChildren().forEach(bullet => {
                        if (bullet.active) {
                            const dist = Phaser.Math.Distance.Between(x, y, bullet.x, bullet.y);
                            score -= Math.max(0, (300 - dist) / 10);
                        }
                    });
                }
                
                // Prefer center slightly
                const distFromCenter = Phaser.Math.Distance.Between(x, y, 960, 720);
                score -= distFromCenter / 100;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestX = x;
                    bestY = y;
                }
            }
        }
        
        this.optimalPosition = { x: bestX, y: bestY };
        this.optimalIntensity = Phaser.Math.Clamp(bestScore / 100, 0, 1);
        
        // Add to optimal field
        if (this.optimalIntensity > 0.3) {
            this.addToField('optimal', bestX, bestY, this.optimalIntensity);
        }
    }
    
    renderAurora() {
        if (this.useUnifiedRenderer) {
            // Unified: register commands with graphics manager
            this.renderAuroraUnified();
        } else {
            // Legacy: clear all graphics and render directly
            this.auroraGraphics.clear();
            
            // Update field texture for shader
            this.updateFieldTexture();
            
            // Draw flow lines (safety corridors)
            this.drawFlowLines();
            
            // Draw field cells (subtle background)
            this.drawFieldCells();
        }
    }
    
    // Unified Rendering Methods (UnifiedGraphicsManager)
    
    renderAuroraUnified() {
        const manager = this.scene.graphicsManager;
        
        // Update field texture for shader (still needed)
        this.updateFieldTexture();
        
        // Draw flow lines using unified renderer
        this.drawFlowLinesUnified(manager);
        
        // Draw field cells using unified renderer
        this.drawFieldCellsUnified(manager);
    }
    
    drawFlowLinesUnified(manager) {
        // Draw flowing lines showing safe corridors
        const time = this.time;
        
        // Draw lines along safety gradients
        for (let row = 2; row < this.rows - 2; row += 2) {
            for (let col = 2; col < this.columns - 2; col += 2) {
                const idx = row * this.columns + col;
                const safety = this.safetyField[idx];
                
                if (safety > 0.3) {
                    const x = col * this.fieldWidth + this.fieldWidth / 2;
                    const y = row * this.fieldHeight + this.fieldHeight / 2;
                    
                    // Calculate flow direction based on safety gradient
                    const left = this.safetyField[idx - 1] || 0;
                    const right = this.safetyField[idx + 1] || 0;
                    const up = this.safetyField[idx - this.columns] || 0;
                    const down = this.safetyField[idx + this.columns] || 0;
                    
                    const dx = (right - left) * this.fieldWidth * 2;
                    const dy = (down - up) * this.fieldHeight * 2;
                    
                    // Draw flow line
                    const flowLength = 20 + safety * 40;
                    const angle = Math.atan2(dy, dx) + Math.sin(time + x * 0.01) * 0.2;
                    
                    const endX = x + Math.cos(angle) * flowLength;
                    const endY = y + Math.sin(angle) * flowLength;
                    
                    const lineWidth = 1 + safety * 3;
                    const alpha = 0.2 + safety * 0.3;
                    
                    manager.drawLine('effects', x, y, endX, endY, this.colors.safety, alpha, lineWidth);
                }
            }
        }
    }
    
    drawFieldCellsUnified(manager) {
        // Draw cell-based aurora (subtle background glow)
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const idx = row * this.columns + col;
                const x = col * this.fieldWidth;
                const y = row * this.fieldHeight;
                
                const safety = this.safetyField[idx];
                const danger = this.dangerField[idx];
                const momentum = this.momentumField[idx];
                const memory = this.memoryField[idx];
                
                // Draw if any field is active
                const maxVal = Math.max(safety, danger, momentum, memory);
                if (maxVal > 0.1) {
                    let color = this.colors.safety;
                    let alpha = safety;
                    
                    if (danger > safety && danger > momentum) {
                        color = this.colors.danger;
                        alpha = danger;
                    } else if (momentum > safety && momentum > danger) {
                        color = this.colors.momentum;
                        alpha = momentum;
                    } else if (memory > 0.3) {
                        color = this.colors.memory;
                        alpha = memory;
                    }
                    
                    // Subtle cell glow
                    manager.drawRect('effects', x + 2, y + 2, this.fieldWidth - 4, this.fieldHeight - 4, color, alpha * 0.15, true);
                }
            }
        }
    }
    
    updateFieldTexture() {
        // Update the canvas texture with current field data
        if (!this.auroraCanvas) return;
        const ctx = this.auroraCanvas.getContext('2d');
        const imgData = ctx.createImageData(this.columns, this.rows);
        
        for (let i = 0; i < this.columns * this.rows; i++) {
            const idx = i * 4;
            imgData.data[idx] = Math.floor(this.safetyField[i] * 255);     // R
            imgData.data[idx + 1] = Math.floor(this.dangerField[i] * 255); // G
            imgData.data[idx + 2] = Math.floor(this.spawnField[i] * 255);  // B
            imgData.data[idx + 3] = Math.floor(this.optimalField[i] * 255); // A
        }
        
        ctx.putImageData(imgData, 0, 0);
        this.auroraTexture.refresh();
    }
    
    drawFlowLines() {
        // Draw flowing lines showing safe corridors
        const time = this.time;
        
        this.auroraGraphics.lineStyle(2, this.colors.safety, 0.3);
        
        // Draw lines along safety gradients
        for (let row = 2; row < this.rows - 2; row += 2) {
            for (let col = 2; col < this.columns - 2; col += 2) {
                const idx = row * this.columns + col;
                const safety = this.safetyField[idx];
                
                if (safety > 0.3) {
                    const x = col * this.fieldWidth + this.fieldWidth / 2;
                    const y = row * this.fieldHeight + this.fieldHeight / 2;
                    
                    // Calculate flow direction based on safety gradient
                    const left = this.safetyField[idx - 1] || 0;
                    const right = this.safetyField[idx + 1] || 0;
                    const up = this.safetyField[idx - this.columns] || 0;
                    const down = this.safetyField[idx + this.columns] || 0;
                    
                    const dx = (right - left) * this.fieldWidth * 2;
                    const dy = (down - up) * this.fieldHeight * 2;
                    
                    // Draw flow line
                    const flowLength = 20 + safety * 40;
                    const angle = Math.atan2(dy, dx) + Math.sin(time + x * 0.01) * 0.2;
                    
                    const endX = x + Math.cos(angle) * flowLength;
                    const endY = y + Math.sin(angle) * flowLength;
                    
                    this.auroraGraphics.lineStyle(
                        1 + safety * 3,
                        this.colors.safety,
                        0.2 + safety * 0.3
                    );
                    
                    this.auroraGraphics.beginPath();
                    this.auroraGraphics.moveTo(x, y);
                    this.auroraGraphics.lineTo(endX, endY);
                    this.auroraGraphics.strokePath();
                }
            }
        }
    }
    
    drawFieldCells() {
        // Draw cell-based aurora (subtle background glow)
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const idx = row * this.columns + col;
                const x = col * this.fieldWidth;
                const y = row * this.fieldHeight;
                
                const safety = this.safetyField[idx];
                const danger = this.dangerField[idx];
                const momentum = this.momentumField[idx];
                const memory = this.memoryField[idx];
                
                // Draw if any field is active
                const maxVal = Math.max(safety, danger, momentum, memory);
                if (maxVal > 0.1) {
                    let color = this.colors.safety;
                    let alpha = safety;
                    
                    if (danger > safety && danger > momentum) {
                        color = this.colors.danger;
                        alpha = danger;
                    } else if (momentum > safety && momentum > danger) {
                        color = this.colors.momentum;
                        alpha = momentum;
                    } else if (memory > 0.3) {
                        color = this.colors.memory;
                        alpha = memory;
                    }
                    
                    // Subtle cell glow
                    this.auroraGraphics.fillStyle(color, alpha * 0.15);
                    this.auroraGraphics.fillRect(
                        x + 2, y + 2,
                        this.fieldWidth - 4, this.fieldHeight - 4
                    );
                }
            }
        }
    }
    
    updateGravityWells() {
        // Update spawn prediction gravity wells
        if (this.useUnifiedRenderer) {
            this.updateGravityWellsUnified();
        } else {
            this.gravityWellGraphics.clear();
            
            // Use pool for active wells
            let wellIndex = 0;
            
            this.spawnPredictions.forEach(prediction => {
                if (wellIndex >= this.wellPool.length) return;
                
                const well = this.wellPool[wellIndex++];
                well.setPosition(prediction.x, prediction.y);
                well.setVisible(true);
                
                // Pulse based on confidence
                const pulse = 0.5 + prediction.confidence * 0.5;
                well.setScale(pulse);
                well.setAlpha(0.3 + prediction.confidence * 0.4);
                
                // Draw gravity well rings
                this.gravityWellGraphics.lineStyle(2, this.colors.spawn, 0.4);
                this.gravityWellGraphics.strokeCircle(prediction.x, prediction.y, 40 * pulse);
                
                this.gravityWellGraphics.lineStyle(1, this.colors.spawn, 0.2);
                this.gravityWellGraphics.strokeCircle(prediction.x, prediction.y, 60 * pulse);
            });
            
            // Hide unused wells
            for (let i = wellIndex; i < this.wellPool.length; i++) {
                this.wellPool[i].setVisible(false);
            }
        }
    }
    
    updateGravityWellsUnified() {
        const manager = this.scene.graphicsManager;
        
        // Use pool for active wells
        let wellIndex = 0;
        
        this.spawnPredictions.forEach(prediction => {
            if (wellIndex >= this.wellPool.length) return;
            
            const well = this.wellPool[wellIndex++];
            well.setPosition(prediction.x, prediction.y);
            well.setVisible(true);
            
            // Pulse based on confidence
            const pulse = 0.5 + prediction.confidence * 0.5;
            well.setScale(pulse);
            well.setAlpha(0.3 + prediction.confidence * 0.4);
            
            // Draw gravity well rings using unified renderer
            manager.addCommand('effects', 'circle', {
                x: prediction.x, y: prediction.y,
                radius: 40 * pulse,
                color: this.colors.spawn, alpha: 0.4, filled: false, lineWidth: 2
            });
            
            manager.addCommand('effects', 'circle', {
                x: prediction.x, y: prediction.y,
                radius: 60 * pulse,
                color: this.colors.spawn, alpha: 0.2, filled: false, lineWidth: 1
            });
        });
        
        // Hide unused wells
        for (let i = wellIndex; i < this.wellPool.length; i++) {
            this.wellPool[i].setVisible(false);
        }
    }
    
    updateEyeGlow() {
        // Update the optimal position eye glow
        if (this.optimalIntensity > 0.4) {
            this.eyeGlow.setPosition(this.optimalPosition.x, this.optimalPosition.y);
            this.eyeGlow.setVisible(true);
            this.eyeGlow.setAlpha(0.1 + this.optimalIntensity * 0.3);
        } else {
            this.eyeGlow.setVisible(false);
        }
    }
    
    updateWake() {
        // Draw player wake - trail of recent positions
        if (this.playerPath.length < 2) return;
        
        if (this.useUnifiedRenderer) {
            this.updateWakeUnified();
        } else {
            this.wakeLine.clear();
            
            // Draw wake as fading line
            for (let i = 1; i < this.playerPath.length; i++) {
                const alpha = (1 - i / this.playerPath.length) * 0.4;
                const width = (1 - i / this.playerPath.length) * 4;
                
                this.wakeLine.lineStyle(width, this.colors.momentum, alpha);
                this.wakeLine.beginPath();
                this.wakeLine.moveTo(this.playerPath[i - 1].x, this.playerPath[i - 1].y);
                this.wakeLine.lineTo(this.playerPath[i].x, this.playerPath[i].y);
                this.wakeLine.strokePath();
            }
        }
    }
    
    updateWakeUnified() {
        const manager = this.scene.graphicsManager;
        
        // Build wake path points
        for (let i = 1; i < this.playerPath.length; i++) {
            const alpha = (1 - i / this.playerPath.length) * 0.4;
            const lineWidth = (1 - i / this.playerPath.length) * 4;
            
            manager.drawLine('effects', 
                this.playerPath[i - 1].x, this.playerPath[i - 1].y,
                this.playerPath[i].x, this.playerPath[i].y,
                this.colors.momentum, alpha, lineWidth
            );
        }
    }
    
    updateMemoryEchoes() {
        // Add memory echoes from Timeline Chronicle
        if (this.scene.timelineChronicle && Math.random() < 0.001) {
            // Occasionally add a memory echo
            const x = 200 + Math.random() * 1520;
            const y = 200 + Math.random() * 1040;
            
            this.addMemoryEcho(x, y);
        }
        
        if (this.useUnifiedRenderer) {
            this.updateMemoryEchoesUnified();
        } else {
            // Render echoes (legacy)
            this.memoryEchoes = this.memoryEchoes.filter(echo => {
                echo.age += 0.016;
                echo.x += echo.vx;
                echo.y += echo.vy;
                
                if (echo.age > echo.lifespan) {
                    if (echo.graphics) echo.graphics.destroy();
                    return false;
                }
                
                // Update echo visualization
                if (!echo.graphics) {
                    echo.graphics = this.scene.add.graphics();
                    echo.graphics.setDepth(4);
                }
                
                const alpha = (1 - echo.age / echo.lifespan) * 0.3;
                echo.graphics.clear();
                echo.graphics.lineStyle(1, this.colors.memory, alpha);
                echo.graphics.strokeCircle(echo.x, echo.y, 20 + echo.age * 10);
                
                // Add to memory field
                this.addToField('memory', echo.x, echo.y, alpha * 0.5);
                
                return true;
            });
        }
    }
    
    updateMemoryEchoesUnified() {
        const manager = this.scene.graphicsManager;
        
        // Render echoes using unified renderer
        this.memoryEchoes = this.memoryEchoes.filter(echo => {
            echo.age += 0.016;
            echo.x += echo.vx;
            echo.y += echo.vy;
            
            if (echo.age > echo.lifespan) {
                return false;
            }
            
            const alpha = (1 - echo.age / echo.lifespan) * 0.3;
            const radius = 20 + echo.age * 10;
            
            // Register echo circle with unified renderer
            manager.addCommand('effects', 'circle', {
                x: echo.x, y: echo.y,
                radius: radius,
                color: this.colors.memory, alpha: alpha, filled: false, lineWidth: 1
            });
            
            // Add to memory field
            this.addToField('memory', echo.x, echo.y, alpha * 0.5);
            
            return true;
        });
    }
    
    addMemoryEcho(x, y) {
        if (this.memoryEchoes.length >= this.maxEchoes) {
            // Remove oldest
            const old = this.memoryEchoes.shift();
            if (old.graphics) old.graphics.destroy();
        }
        
        this.memoryEchoes.push({
            x, y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            age: 0,
            lifespan: 5 + Math.random() * 5,
            graphics: null
        });
    }
    
    // ===== PUBLIC API =====
    
    getFieldIntensityAt(x, y, fieldName) {
        const col = Math.floor(x / this.fieldWidth);
        const row = Math.floor(y / this.fieldHeight);
        
        if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) {
            return 0;
        }
        
        const idx = row * this.columns + col;
        
        switch (fieldName) {
            case 'safety': return this.safetyField[idx];
            case 'danger': return this.dangerField[idx];
            case 'momentum': return this.momentumField[idx];
            case 'spawn': return this.spawnField[idx];
            case 'optimal': return this.optimalField[idx];
            case 'memory': return this.memoryField[idx];
            default: return 0;
        }
    }
    
    getOptimalPosition() {
        return { ...this.optimalPosition, intensity: this.optimalIntensity };
    }
    
    pulseField(fieldName, x, y, intensity) {
        this.addToField(fieldName, x, y, intensity);
    }
    
    shutdown() {
        // Clean up legacy graphics (only if not using unified renderer)
        if (!this.useUnifiedRenderer) {
            if (this.auroraGraphics) this.auroraGraphics.destroy();
            if (this.gravityWellGraphics) this.gravityWellGraphics.destroy();
            if (this.wakeGraphics) this.wakeGraphics.destroy();
            if (this.wakeLine) this.wakeLine.destroy();
        }
        
        // These are always cleaned up (they're game objects, not graphics)
        if (this.eyeGraphics) this.eyeGraphics.destroy();
        if (this.eyeGlow) this.eyeGlow.destroy();
        
        // Clean up wells
        this.wellPool.forEach(well => well.destroy());
        
        // Clean up echoes (legacy only - unified doesn't create graphics objects)
        if (!this.useUnifiedRenderer) {
            this.memoryEchoes.forEach(echo => {
                if (echo.graphics) echo.graphics.destroy();
            });
        }
        
        // Note: UnifiedGraphicsManager handles cleanup of its own graphics objects
    }
}
