import Phaser from 'phaser';

/**
 * APOPHENIA PROTOCOL — The 53rd Dimension: PATTERN DIVINATION
 * 
 * Migrated to UnifiedGraphicsManager (2026-04-01):
 * - Pattern visualization now uses UnifiedGraphicsManager on 'effects' layer
 * - Point cloud rendering migrated to UnifiedGraphicsManager
 * - graphics.clear() calls removed for UnifiedGraphicsManager compatibility
 * 
 * The game becomes a divination instrument. Every combat action inscribes
 * meaning onto the arena floor. Death positions form constellations.
 * Bullet trails draw ideograms. Movement paths trace mandalas.
 * 
 * === THE CORE INNOVATION ===
 * 
 * Apophenia is the human tendency to perceive patterns in randomness.
 * This system EMBRACES and REWARDS that tendency. When you see a butterfly
 * in the scatterplot of your kills, the game SEES IT TOO — and manifests
 * the butterfly as a temporary blessing.
 * 
 * The arena floor accumulates:
 * - KILL MARKS: Position, timing, enemy type (dots)
 * - BULLET TRAILS: Vector, density, convergence (lines)
 * - MOVEMENT PATHS: Speed, hesitation, circles (curves)
 * - DEATH ZONES: Where you nearly died (void nodes)
 * - ECHO ABSORPTIONS: Where power was claimed (radiant points)
 * 
 * These points form a DYNAMIC POINT CLOUD that the system continuously
 * analyzes for GEOMETRIC PATTERNS:
 * 
 * PATTERN VOCABULARY:
 * ═══════════════════════════════════════════════════════════════
 * 
 * TRIANGLE (3 points)          → TRINITY BLESSING: Shield regen
 * SQUARE (4 points, aligned)   → FOUNDATION: Damage resistance
 * CIRCLE (5+ points, radial)   → WHOLENESS: Full heal
 * SPIRAL (curved convergence)  → EVOLUTION: XP boost
 * CROSS (perpendicular lines)  → BALANCE: All stats up
 * STAR (radial lines)          → ASCENSION: Temporary flight
 * HEART (cardioid curve)        → VITALITY: Life steal
 * WINGS (symmetric curves)     → LIBERATION: Speed boost
 * GATE (parallel lines)        → THRESHOLD: Portal to sanctum
 * VOID (empty center cluster)  → ABSENCE: Bullet time zone
 * 
 * === THE DIVINATION MECHANIC ===
 * 
 * When patterns form, they EMIT GLOWING GEOMETRIC OVERLAYS that only
 * the player who created them can see (subtle, not distracting).
 * Holding 'F' (Focus) brings up the DIVINATION INTERFACE — a semi-
 * transparent overlay showing detected patterns with their meanings.
 * 
 * Patterns decay over time (30 seconds), but can be "fixed" by:
 * - Shooting specific anchor points (4 bullets = square corners)
 * - Standing in pattern center (charges the pattern)
 * - Rhythmic firing on beat (Rhythm of the Void synergy)
 * 
 * === THE PROPHECY ENGINE ===
 * 
 * Pattern combinations generate PROPHECIES — one-sentence predictions
 * that actually affect upcoming gameplay:
 * 
 * "Three triangles point north — a titan approaches from the south"
 *   → Next boss spawn direction predicted; bonus damage if correct
 * 
 * "Your bullet trails form a labyrinth — the exit is also the entrance"
 *   → Chrono-Loop recharge speed doubled
 * 
 * "A spiral eats its own tail — what was lost returns"
 *   → Next death triggers Quantum Immortality regardless of cooldown
 * 
 * "The void smiles where you stood — move"
 *   → Warning of incoming heavy attack at player's location
 * 
 * These prophecies are generated procedurally based on actual pattern
 * geometry combined with upcoming game state (Oracle Protocol synergy).
 * 
 * === THE ACCUMULATED MANDALA ===
 * 
 * At wave end (30s marker), the entire session's point cloud is analyzed
 * as a single MANDALA — a geometric summary of your play style:
 * 
 * - SCATTERED: Aggressive, mobile, chaotic (bonus: damage)
 * - CONCENTRIC: Defensive, centered, controlled (bonus: shields)
 * - LINEAR: Methodical, sweep patterns (bonus: accuracy)
 * - RADIAL: Rotation, kiting, circular (bonus: speed)
 * - FRACTAL: Complex, recursive patterns (bonus: all systems)
 * 
 * The mandala type persists into the next wave as a SUBTLE TINT on
 * the arena floor — your play style literally colors your world.
 * 
 * === SYNERGIES ===
 * 
 * + Dream State: Sleep converts point cloud into symbolic dream faster
 * + Oracle Protocol: Prophecies have higher accuracy when patterns match
 * + Architect System: Patterns can be "designed" and manifested as terrain
 * + Mnemosyne Weave: Pattern analysis contributes to monument geometry
 * + Rhythm of the Void: On-beat actions create stronger pattern nodes
 * + Sanctum Protocol: Patterns become persistent room decorations
 * + Noetic Mirror: System narrates pattern discoveries with commentary
 * 
 * === VISUAL LANGUAGE ===
 * 
 * Undetected points: Subtle glimmers (1% opacity)
 * Detected patterns: Glowing wireframes (emerging)
 * Charged patterns: Pulsing auras (active)
 * Expired patterns: Fading echoes (leaving residue)
 * 
 * Color coding by pattern type:
 * - Triangles: Gold (#ffd700)
 * - Squares: Earth (#8b4513)
 * - Circles: Cyan (#00f0ff)
 * - Spirals: Emerald (#00c853)
 * - Crosses: Silver (#c0c0c0)
 * - Stars: Violet (#9d4edd)
 * - Hearts: Crimson (#dc143c)
 * - Wings: Sky (#87ceeb)
 * - Gates: Void (#1a0a2e outline)
 * - Voids: Inverted (black glow on dark floor)
 * 
 * === THE DEEPER MAGIC ===
 * 
 * This system transforms the shooter's fundamental loop:
 * 
 * OLD: Kill enemies → Score points → Survive waves
 * NEW: Kill enemies → Create patterns → Read meaning → Shape reality
 * 
 * The game becomes collaborative divination. You and the algorithm
 * together construct meaning from chaos. The bullets aren't just
 * weapons — they're a language. The arena isn't just a stage —
 * it's a manuscript you're writing in real-time.
 * 
 * Every player becomes an involuntary mystic. The act of survival
 * generates prophecy. Survival becomes divination becomes art.
 * 
 * Color: Prismatic White (#f0f0f0) — the color of all light combined,
 * of pattern itself, of the geometric truth underlying chaos.
 * 
 * This is where geometry becomes philosophy. Where combat becomes
 * cartomancy. Where the void speaks in shapes.
 */

export default class ApopheniaProtocol {
    constructor(scene) {
        this.scene = scene;
        
        // ===== COLORS OF PATTERN =====
        this.PRISM_WHITE = 0xf0f0f0;      // Pure pattern
        this.PATTERN_COLORS = {
            triangle: 0xffd700,           // Trinity gold
            square: 0x8b4513,             // Foundation brown
            circle: 0x00f0ff,             // Wholeness cyan
            spiral: 0x00c853,             // Evolution green
            cross: 0xc0c0c0,              // Balance silver
            star: 0x9d4edd,               // Ascension violet
            heart: 0xdc143c,              // Vitality crimson
            wings: 0x87ceeb,              // Liberation sky
            gate: 0xffb700,               // Threshold gold
            void: 0x1a0a2e                // Absence dark
        };
        
        // ===== POINT CLOUD =====
        this.pointCloud = {
            kills: [],                    // {x, y, type, time, weight}
            bullets: [],                  // {x, y, angle, speed, time}
            deaths: [],                   // {x, y, nearMiss: bool, time}
            echoes: [],                   // {x, y, type, time}
            movements: [],                // {x, y, speed, direction, time}
            maxPoints: 200                // Prevent bloat
        };
        
        // ===== PATTERN DETECTION =====
        this.detectedPatterns = [];       // Active patterns
        this.patternHistory = [];         // All patterns this session
        this.prophecies = [];             // Generated predictions
        this.currentMandala = null;       // Session archetype
        
        // ===== CONFIGURATION =====
        this.config = {
            pointDecay: 30000,            // 30s before points fade
            patternThreshold: 0.85,       // Detection confidence (0-1)
            maxPatterns: 8,               // Active patterns cap
            detectionRadius: 300,         // Search range for geometry
            minPointsForPattern: 3,       // Minimum cluster size
            prophecyAccuracy: 0.7,        // Chance prophecy comes true
            patternLifetime: 20000,       // How long patterns last
            chargeRate: 0.05,             // Pattern charge per tick
            gridSnap: 20                  // Snap points to grid for detection
        };
        
        // ===== VISUALS =====
        // Note: patternGraphics and pointGraphics removed - now rendered via UnifiedGraphicsManager
        this.divinationOverlay = null;
        this.patternAuras = [];
        
        // ===== STATE =====
        this.isFocusMode = false;
        this.lastMandalaTime = 0;
        this.totalPatternsDiscovered = 0;
        this.prophecyFulfilled = 0;
        
        this.init();
    }
    
    init() {
        this.createGraphics();
        this.setupInput();
        this.startDetectionLoop();
    }
    
    createGraphics() {
        // Note: Pattern visualization now rendered via UnifiedGraphicsManager on 'effects' layer
        // No direct graphics objects needed - all drawing goes through this.scene.graphicsManager
        
        // Divination overlay (visible in focus mode) - container is still needed for text
        this.divinationOverlay = this.scene.add.container(0, 0);
        this.divinationOverlay.setDepth(100);
        this.divinationOverlay.setVisible(false);
    }
    
    setupInput() {
        // T key toggles focus mode (was F, changed to avoid conflict)
        this.scene.controls.register('T', 'Apophenic Focus', () => {
            this.toggleFocusMode();
        }, {
            system: 'ApopheniaProtocol',
            description: 'Toggle apophenic focus mode'
        });
        
        // Prophecy fulfilled events
        this.scene.events.on('prophecyFulfilled', (prophecy) => {
            this.onProphecyFulfilled(prophecy);
        });
    }
    
    // ===== POINT COLLECTION =====
    
    recordKill(x, y, enemyType) {
        const point = {
            x, y,
            type: 'kill',
            subtype: enemyType,
            time: Date.now(),
            weight: enemyType === 'enemyTank' ? 2 : 1
        };
        this.addPoint(point);
    }
    
    recordBulletTrail(x, y, angle, speed) {
        const point = {
            x, y,
            type: 'bullet',
            angle,
            speed,
            time: Date.now(),
            weight: 0.5
        };
        this.addPoint(point);
    }
    
    recordNearMiss(x, y, wasFatal = false) {
        const point = {
            x, y,
            type: 'death',
            nearMiss: !wasFatal,
            time: Date.now(),
            weight: wasFatal ? 3 : 1.5
        };
        this.addPoint(point);
        
        // Near-misses create stronger pattern nodes
        this.addPoint({ ...point, x: x + 10, y, weight: 0.3 });
        this.addPoint({ ...point, x: x - 10, y, weight: 0.3 });
    }
    
    recordEchoAbsorption(x, y, echoType) {
        const point = {
            x, y,
            type: 'echo',
            subtype: echoType,
            time: Date.now(),
            weight: 1.5
        };
        this.addPoint(point);
    }
    
    recordMovement(x, y, speed) {
        // Sample movement every 10 frames to avoid spam
        if (this.scene.game.loop.frame % 10 !== 0) return;
        
        const point = {
            x, y,
            type: 'movement',
            speed,
            time: Date.now(),
            weight: speed > 200 ? 0.8 : 0.4
        };
        this.addPoint(point);
    }
    
    addPoint(point) {
        // Grid snap for pattern regularity
        point.x = Math.round(point.x / this.config.gridSnap) * this.config.gridSnap;
        point.y = Math.round(point.y / this.config.gridSnap) * this.config.gridSnap;
        
        // Add to appropriate array
        switch (point.type) {
            case 'kill': this.pointCloud.kills.push(point); break;
            case 'bullet': this.pointCloud.bullets.push(point); break;
            case 'death': this.pointCloud.deaths.push(point); break;
            case 'echo': this.pointCloud.echoes.push(point); break;
            case 'movement': this.pointCloud.movements.push(point); break;
        }
        
        // Cleanup old points
        this.cleanupOldPoints();
    }
    
    cleanupOldPoints() {
        const now = Date.now();
        const cutoff = now - this.config.pointDecay;
        
        ['kills', 'bullets', 'deaths', 'echoes', 'movements'].forEach(type => {
            this.pointCloud[type] = this.pointCloud[type].filter(p => p.time > cutoff);
        });
        
        // Hard limit
        const totalPoints = Object.values(this.pointCloud).flat().length;
        if (totalPoints > this.config.maxPoints) {
            // Remove oldest points proportionally
            const toRemove = totalPoints - this.config.maxPoints;
            this.removeOldestPoints(toRemove);
        }
    }
    
    removeOldestPoints(count) {
        const allPoints = Object.values(this.pointCloud).flat();
        allPoints.sort((a, b) => a.time - b.time);
        
        const toRemove = new Set(allPoints.slice(0, count));
        
        ['kills', 'bullets', 'deaths', 'echoes', 'movements'].forEach(type => {
            this.pointCloud[type] = this.pointCloud[type].filter(p => !toRemove.has(p));
        });
    }
    
    // ===== PATTERN DETECTION =====
    
    startDetectionLoop() {
        // TUNED: 750ms balance between responsiveness and performance
        this.scene.time.addEvent({
            delay: 750,
            callback: () => this.detectPatterns(),
            loop: true
        });
    }
    
    detectPatterns() {
        const allPoints = this.getWeightedPoints();
        if (allPoints.length < this.config.minPointsForPattern) return;
        
        // TUNED: Limit points to prevent O(n³) explosion but allow more patterns
        // Sort by weight (heaviest first) and take max 30 points (was 20)
        if (allPoints.length > 30) {
            allPoints.sort((a, b) => (b.weight || 1) - (a.weight || 1));
            allPoints.length = 30;
        }
        
        const newPatterns = [];
        
        // Detect each pattern type
        const triangle = this.detectTriangle(allPoints);
        if (triangle) newPatterns.push(triangle);
        
        const square = this.detectSquare(allPoints);
        if (square) newPatterns.push(square);
        
        const circle = this.detectCircle(allPoints);
        if (circle) newPatterns.push(circle);
        
        const spiral = this.detectSpiral(allPoints);
        if (spiral) newPatterns.push(spiral);
        
        const cross = this.detectCross(allPoints);
        if (cross) newPatterns.push(cross);
        
        const star = this.detectStar(allPoints);
        if (star) newPatterns.push(star);
        
        const wings = this.detectWings(allPoints);
        if (wings) newPatterns.push(wings);
        
        const gate = this.detectGate(allPoints);
        if (gate) newPatterns.push(gate);
        
        // Merge with existing patterns, update charge
        this.mergePatterns(newPatterns);
        
        // Generate prophecies from significant patterns
        this.updateProphecies();
    }
    
    getWeightedPoints() {
        const all = [];
        ['kills', 'bullets', 'deaths', 'echoes', 'movements'].forEach(type => {
            this.pointCloud[type].forEach(p => {
                all.push({ ...p, weightedX: p.x * p.weight, weightedY: p.y * p.weight });
            });
        });
        return all;
    }
    
    // GEOMETRIC DETECTION ALGORITHMS
    
    detectTriangle(points) {
        // TUNED: Find 3 points forming roughly equilateral triangle
        // Increased iterations (2000) for better detection while keeping FPS stable
        const maxIterations = 2000;
        let iterations = 0;
        const minDistSq = 50 * 50; // squared min distance
        const maxDistSq = this.config.detectionRadius * this.config.detectionRadius;
        
        for (let i = 0; i < points.length - 2 && iterations < maxIterations; i++) {
            for (let j = i + 1; j < points.length - 1 && iterations < maxIterations; j++) {
                // Quick bounding box check before third loop
                const p1 = points[i], p2 = points[j];
                const dx1 = p1.x - p2.x, dy1 = p1.y - p2.y;
                const d1Sq = dx1 * dx1 + dy1 * dy1;
                if (d1Sq < minDistSq || d1Sq > maxDistSq) continue;
                
                for (let k = j + 1; k < points.length && iterations < maxIterations; k++, iterations++) {
                    const p3 = points[k];
                    
                    // Squared distance (avoid expensive sqrt)
                    const dx2 = p2.x - p3.x, dy2 = p2.y - p3.y;
                    const dx3 = p3.x - p1.x, dy3 = p3.y - p1.y;
                    const d2Sq = dx2 * dx2 + dy2 * dy2;
                    const d3Sq = dx3 * dx3 + dy3 * dy3;
                    
                    // Check distances are in valid range
                    if (d2Sq < minDistSq || d2Sq > maxDistSq) continue;
                    if (d3Sq < minDistSq || d3Sq > maxDistSq) continue;
                    
                    // Compare squared distances for equilateral check (avoid sqrt)
                    const d1 = Math.sqrt(d1Sq); // Only one sqrt needed
                    const d2 = Math.sqrt(d2Sq);
                    const d3 = Math.sqrt(d3Sq);
                    const avg = (d1 + d2 + d3) / 3;
                    const variance = Math.max(Math.abs(d1 - avg), Math.abs(d2 - avg), Math.abs(d3 - avg)) / avg;
                    
                    if (variance < 0.3) {
                        return this.createPattern('triangle', [p1, p2, p3], 1 - variance);
                    }
                }
            }
        }
        return null;
    }
    
    detectSquare(points) {
        // TUNED: Find 4 points forming roughly square
        // O(n⁴) is expensive - limit iterations but allow more thorough search
        if (points.length < 4) return null;
        
        const maxIterations = 1000; // Tuned for better square detection
        let iterations = 0;
        
        // Look for right-angle relationships
        for (let i = 0; i < points.length - 3 && iterations < maxIterations; i++) {
            for (let j = i + 1; j < points.length - 2 && iterations < maxIterations; j++) {
                for (let k = j + 1; k < points.length - 1 && iterations < maxIterations; k++) {
                    for (let l = k + 1; l < points.length && iterations < maxIterations; l++, iterations++) {
                        const quad = [points[i], points[j], points[k], points[l]];
                        if (this.isSquareLike(quad)) {
                            return this.createPattern('square', quad, 0.9);
                        }
                    }
                }
            }
        }
        return null;
    }
    
    isSquareLike(quad) {
        // OPTIMIZED: Check if 4 points form roughly square using squared distances
        const [p1, p2, p3, p4] = quad;
        
        // Calculate squared distances (avoid sqrt for comparisons)
        const distSq = [
            (p1.x-p2.x)**2 + (p1.y-p2.y)**2,
            (p2.x-p3.x)**2 + (p2.y-p3.y)**2,
            (p3.x-p4.x)**2 + (p3.y-p4.y)**2,
            (p4.x-p1.x)**2 + (p4.y-p1.y)**2,
            (p1.x-p3.x)**2 + (p1.y-p3.y)**2, // diagonal
            (p2.x-p4.x)**2 + (p2.y-p4.y)**2  // diagonal
        ];
        
        const sides = distSq.slice(0, 4);
        const diagonals = distSq.slice(4);
        
        // Check sides are roughly equal (squared comparison)
        const avgSideSq = sides.reduce((a, b) => a + b) / 4;
        const sideVariance = Math.max(...sides.map(d => Math.abs(d - avgSideSq))) / avgSideSq;
        
        // Check diagonals are roughly equal
        const diagonalRatio = Math.abs(diagonals[0] - diagonals[1]) / diagonals[0];
        
        // For square, diagonal² ≈ 2 * side²
        const expectedDiagonalSq = avgSideSq * 2;
        const diagonalError = Math.abs(diagonals[0] - expectedDiagonalSq) / expectedDiagonalSq;
        
        return sideVariance < 0.3 && diagonalRatio < 0.25 && diagonalError < 0.3;
    }
    
    detectCircle(points) {
        // Find 5+ points with common center
        if (points.length < 5) return null;
        
        // Sample point as potential center
        const centerCandidates = points.slice(0, 10);
        
        for (const center of centerCandidates) {
            const radii = points
                .filter(p => p !== center)
                .map(p => Phaser.Math.Distance.Between(center.x, center.y, p.x, p.y))
                .filter(r => r > 30 && r < this.config.detectionRadius);
            
            if (radii.length < 5) continue;
            
            const avgRadius = radii.reduce((a, b) => a + b) / radii.length;
            const variance = radii.map(r => Math.abs(r - avgRadius) / avgRadius);
            const goodFits = variance.filter(v => v < 0.2).length;
            
            if (goodFits >= 5) {
                const circlePoints = points.filter((p, idx) => variance[idx] < 0.2);
                return this.createPattern('circle', circlePoints, goodFits / radii.length);
            }
        }
        return null;
    }
    
    detectSpiral(points) {
        // Find curved convergence pattern
        const bullets = this.pointCloud.bullets;
        if (bullets.length < 8) return null;
        
        // Look for bullet trails converging in spiral
        const recent = bullets.slice(-15);
        
        // Check for curved pattern by analyzing angles
        let curveCount = 0;
        let totalCurve = 0;
        
        for (let i = 1; i < recent.length - 1; i++) {
            const prev = recent[i - 1];
            const curr = recent[i];
            const next = recent[i + 1];
            
            const angle1 = Phaser.Math.Angle.Between(prev.x, prev.y, curr.x, curr.y);
            const angle2 = Phaser.Math.Angle.Between(curr.x, curr.y, next.x, next.y);
            const curve = Phaser.Math.Angle.ShortestBetween(angle1, angle2);
            
            if (Math.abs(curve) > 0.1 && Math.abs(curve) < Math.PI / 2) {
                curveCount++;
                totalCurve += Math.abs(curve);
            }
        }
        
        if (curveCount >= 4) {
            return this.createPattern('spiral', recent, Math.min(curveCount / 6, 1));
        }
        return null;
    }
    
    detectCross(points) {
        // Find perpendicular line patterns
        const all = this.getWeightedPoints();
        if (all.length < 6) return null;
        
        // Look for two intersecting lines
        for (let i = 0; i < all.length - 3; i++) {
            for (let j = i + 1; j < all.length - 2; j++) {
                const angle1 = Phaser.Math.Angle.Between(all[i].x, all[i].y, all[j].x, all[j].y);
                
                for (let k = j + 1; k < all.length - 1; k++) {
                    for (let l = k + 1; l < all.length; l++) {
                        const angle2 = Phaser.Math.Angle.Between(all[k].x, all[k].y, all[l].x, all[l].y);
                        const perp = Math.abs(Phaser.Math.Angle.ShortestBetween(angle1, angle2));
                        
                        if (Math.abs(perp - Math.PI / 2) < 0.3) {
                            return this.createPattern('cross', [all[i], all[j], all[k], all[l]], 0.85);
                        }
                    }
                }
            }
        }
        return null;
    }
    
    detectStar(points) {
        // Find radial pattern from center point
        if (points.length < 6) return null;
        
        for (const center of points.slice(0, 8)) {
            const spokes = points
                .filter(p => p !== center)
                .map(p => ({
                    point: p,
                    angle: Phaser.Math.Angle.Between(center.x, center.y, p.x, p.y),
                    dist: Phaser.Math.Distance.Between(center.x, center.y, p.x, p.y)
                }))
                .filter(s => s.dist > 50 && s.dist < this.config.detectionRadius);
            
            if (spokes.length < 5) continue;
            
            // Check for roughly even angular distribution
            spokes.sort((a, b) => a.angle - b.angle);
            let evenSpread = 0;
            
            for (let i = 1; i < spokes.length; i++) {
                const gap = spokes[i].angle - spokes[i - 1].angle;
                if (gap > 0.3 && gap < 1.5) evenSpread++;
            }
            
            if (evenSpread >= 4) {
                return this.createPattern('star', [center, ...spokes.map(s => s.point)], evenSpread / spokes.length);
            }
        }
        return null;
    }
    
    detectWings(points) {
        // Find symmetric curved patterns
        const kills = this.pointCloud.kills;
        if (kills.length < 6) return null;
        
        // Look for pairs of kills with symmetric positions
        const recent = kills.slice(-12);
        let symmetricPairs = [];
        
        for (let i = 0; i < recent.length - 1; i++) {
            for (let j = i + 1; j < recent.length; j++) {
                const p1 = recent[i], p2 = recent[j];
                // Check if roughly symmetric around vertical or horizontal
                const dx = Math.abs(p1.x - p2.x);
                const dy = Math.abs(p1.y - p2.y);
                
                if ((dx < 40 && dy > 60) || (dy < 40 && dx > 60)) {
                    symmetricPairs.push([p1, p2]);
                }
            }
        }
        
        if (symmetricPairs.length >= 3) {
            const wingPoints = symmetricPairs.flat();
            return this.createPattern('wings', wingPoints, Math.min(symmetricPairs.length / 4, 1));
        }
        return null;
    }
    
    detectGate(points) {
        // Find parallel lines (bullet trails)
        const bullets = this.pointCloud.bullets;
        if (bullets.length < 8) return null;
        
        // Group bullets by similar angles
        const recent = bullets.slice(-12);
        const angleGroups = new Map();
        
        recent.forEach(b => {
            const key = Math.round(b.angle * 2) / 2; // Group by 0.5 radian buckets
            if (!angleGroups.has(key)) angleGroups.set(key, []);
            angleGroups.get(key).push(b);
        });
        
        // Look for two parallel groups with offset
        for (const [angle1, group1] of angleGroups) {
            if (group1.length < 3) continue;
            
            for (const [angle2, group2] of angleGroups) {
                if (angle1 === angle2 || group2.length < 3) continue;
                
                const angleDiff = Math.abs(Phaser.Math.Angle.ShortestBetween(angle1, angle2));
                if (angleDiff < 0.2 || angleDiff > Math.PI - 0.2) { // Nearly parallel
                    return this.createPattern('gate', [...group1, ...group2], 0.8);
                }
            }
        }
        return null;
    }
    
    createPattern(type, points, confidence) {
        const center = this.calculateCenter(points);
        
        return {
            id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            type,
            points,
            center,
            confidence,
            discoveredAt: Date.now(),
            charge: 0,
            maxCharge: 100,
            activated: false,
            visual: null,
            prophecy: null,
            color: this.PATTERN_COLORS[type]
        };
    }
    
    calculateCenter(points) {
        const avgX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const avgY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return { x: avgX, y: avgY };
    }
    
    mergePatterns(newPatterns) {
        const now = Date.now();
        
        // Remove expired patterns
        this.detectedPatterns = this.detectedPatterns.filter(p => {
            return now - p.discoveredAt < this.config.patternLifetime;
        });
        
        // Add new patterns if not already detected nearby
        for (const newPat of newPatterns) {
            const duplicate = this.detectedPatterns.some(existing => {
                const dist = Phaser.Math.Distance.Between(
                    newPat.center.x, newPat.center.y,
                    existing.center.x, existing.center.y
                );
                return dist < 50 && existing.type === newPat.type;
            });
            
            if (!duplicate && this.detectedPatterns.length < this.config.maxPatterns) {
                this.detectedPatterns.push(newPat);
                this.totalPatternsDiscovered++;
                this.onPatternDiscovered(newPat);
            }
        }
        
        // Update charge for patterns near player
        if (this.scene.player && this.scene.player.active) {
            this.detectedPatterns.forEach(p => {
                const dist = Phaser.Math.Distance.Between(
                    p.center.x, p.center.y,
                    this.scene.player.x, this.scene.player.y
                );
                
                if (dist < 60) {
                    p.charge = Math.min(p.charge + this.config.chargeRate * 10, p.maxCharge);
                    if (p.charge >= p.maxCharge && !p.activated) {
                        this.activatePattern(p);
                    }
                }
            });
        }
    }
    
    // ===== PATTERN EFFECTS =====
    
    onPatternDiscovered(pattern) {
        // Visual flare
        this.visualizePattern(pattern);
        
        // Audio cue if synaesthesia available
        if (this.scene.synaesthesiaProtocol) {
            this.scene.synaesthesiaProtocol.onGameplayEvent('patternDetected', pattern.type);
        }
        
        // Noetic mirror narration
        if (this.scene.noeticMirror) {
            const messages = {
                triangle: 'Three points align — the trinity emerges',
                square: 'Four corners found — foundation solidifies',
                circle: 'A circle closes — wholeness approaches',
                spiral: 'The serpent coils — evolution quickens',
                cross: 'Paths intersect — balance demands attention',
                star: 'Light radiates — ascension is possible',
                wings: 'Symmetry unfolds — liberation awaits',
                gate: 'Parallel lines converge — a threshold opens'
            };
            this.scene.noeticMirror.showFloatingCommentary(messages[pattern.type] || 'A pattern forms...');
        }
    }
    
    activatePattern(pattern) {
        pattern.activated = true;
        
        // Apply effect based on type
        const effects = {
            triangle: () => this.applyTrinityBlessing(pattern),
            square: () => this.applyFoundation(pattern),
            circle: () => this.applyWholeness(pattern),
            spiral: () => this.applyEvolution(pattern),
            cross: () => this.applyBalance(pattern),
            star: () => this.applyAscension(pattern),
            wings: () => this.applyLiberation(pattern),
            gate: () => this.applyThreshold(pattern)
        };
        
        if (effects[pattern.type]) {
            effects[pattern.type]();
        }
        
        // Visual activation
        this.pulsePattern(pattern);
    }
    
    applyTrinityBlessing(pattern) {
        // Shield regeneration
        if (this.scene.player && this.scene.player.health < this.scene.player.maxHealth) {
            const heal = 15;
            this.scene.player.health = Math.min(this.scene.player.health + heal, this.scene.player.maxHealth);
            this.showPatternEffect(pattern, 'SHIELD REGEN', 0xffd700);
        }
    }
    
    applyFoundation(pattern) {
        // Damage resistance buff
        this.scene.playerDamageMult = 0.7; // 30% reduction
        this.scene.time.delayedCall(5000, () => {
            this.scene.playerDamageMult = 1.0;
        });
        this.showPatternEffect(pattern, 'RESISTANCE +30%', 0x8b4513);
    }
    
    applyWholeness(pattern) {
        // Full heal
        if (this.scene.player) {
            this.scene.player.health = this.scene.player.maxHealth;
            this.showPatternEffect(pattern, 'FULL RESTORE', 0x00f0ff);
        }
    }
    
    applyEvolution(pattern) {
        // XP/synthesis boost
        if (this.scene.syntropyEngine) {
            this.scene.syntropyEngine.syntropyPoints += 50;
        }
        this.showPatternEffect(pattern, '+50 SYNERGY', 0x00c853);
    }
    
    applyBalance(pattern) {
        // All stats up temporarily
        if (this.scene.player) {
            const originalSpeed = this.scene.player.speed;
            this.scene.player.speed *= 1.3;
            this.scene.time.delayedCall(6000, () => {
                this.scene.player.speed = originalSpeed;
            });
        }
        this.showPatternEffect(pattern, 'BALANCE RESTORED', 0xc0c0c0);
    }
    
    applyAscension(pattern) {
        // Temporary "flight" - ignore collision with enemies
        if (this.scene.player) {
            this.scene.player.setCollideWorldBounds(false);
            this.scene.physics.world.removeCollider(this.scene.enemyCollider);
            
            this.scene.time.delayedCall(3000, () => {
                if (this.scene.player && this.scene.player.active) {
                    this.scene.player.setCollideWorldBounds(true);
                    this.scene.enemyCollider = this.scene.physics.add.overlap(
                        this.scene.player, this.scene.enemies, 
                        this.scene.playerHit, null, this.scene
                    );
                }
            });
        }
        this.showPatternEffect(pattern, 'ASCENSION', 0x9d4edd);
    }
    
    applyLiberation(pattern) {
        // Speed boost
        if (this.scene.player) {
            const originalSpeed = this.scene.player.speed;
            this.scene.player.speed *= 1.5;
            this.scene.time.delayedCall(4000, () => {
                if (this.scene.player) this.scene.player.speed = originalSpeed;
            });
        }
        this.showPatternEffect(pattern, 'SPEED +50%', 0x87ceeb);
    }
    
    applyThreshold(pattern) {
        // Portal to sanctum if available
        if (this.scene.sanctumProtocol) {
            this.scene.sanctumProtocol.attemptSanctumAccess();
            this.showPatternEffect(pattern, 'SANCTUM OPENS', 0xffb700);
        } else {
            // Otherwise, teleport to random safe location
            const safeX = Phaser.Math.Between(200, 1720);
            const safeY = Phaser.Math.Between(200, 1240);
            if (this.scene.player) {
                this.scene.player.setPosition(safeX, safeY);
            }
            this.showPatternEffect(pattern, 'TELEPORT', 0xffb700);
        }
    }
    
    showPatternEffect(pattern, text, color) {
        // Floating text
        const fx = this.scene.add.text(pattern.center.x, pattern.center.y - 30, text, {
            fontFamily: 'Arial', fontSize: '14px', color: '#' + color.toString(16).padStart(6, '0')
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: fx,
            y: pattern.center.y - 60,
            alpha: 0,
            duration: 1500,
            onComplete: () => fx.destroy()
        });
        
        // Particle burst
        if (this.scene.hitParticles) {
            this.scene.hitParticles.setParticleTint(color);
            this.scene.hitParticles.emitParticleAt(pattern.center.x, pattern.center.y, 12);
        }
    }
    
    // ===== PROPHECY SYSTEM =====
    
    updateProphecies() {
        // Generate prophecies from high-confidence patterns
        const highConfidence = this.detectedPatterns.filter(p => p.confidence > 0.9 && !p.prophecy);
        
        for (const pattern of highConfidence) {
            const prophecy = this.generateProphecy(pattern);
            if (prophecy) {
                pattern.prophecy = prophecy;
                this.prophecies.push(prophecy);
            }
        }
        
        // Clean up fulfilled/expired prophecies
        this.prophecies = this.prophecies.filter(p => !p.fulfilled && Date.now() - p.createdAt < 60000);
    }
    
    generateProphecy(pattern) {
        const templates = {
            triangle: [
                'Three points align — a titan approaches',
                'The trinity points to your next challenge',
                'Triangular convergence signals a boss'
            ],
            square: [
                'Four corners guard a secret power-up',
                'The foundation holds where enemies gather',
                'Stand within the square when darkness falls'
            ],
            circle: [
                'What begins must end — the circle closes soon',
                'Wholeness comes after the next wave',
                'A full rotation brings revelation'
            ],
            spiral: [
                'The spiral eats its tail — cooldowns reset',
                'Evolution accelerates — prepare for change',
                'What you sent out returns transformed'
            ],
            cross: [
                'Where paths cross, danger waits',
                'Balance will be tested in the next minute',
                'The intersection reveals the way'
            ],
            star: [
                'Radiant energy gathers — power approaches',
                'Ascension is possible if you dare',
                'The stars align for a miracle'
            ],
            wings: [
                'Flight will be needed where enemies cluster',
                'Liberation comes through sacrifice',
                'The wings point to safe passage'
            ],
            gate: [
                'A threshold opens — step through wisely',
                'The gate swings both ways — remember',
                'What enters must also exit'
            ]
        };
        
        const typeTemplates = templates[pattern.type];
        if (!typeTemplates) return null;
        
        return {
            id: `prophecy_${Date.now()}`,
            text: typeTemplates[Math.floor(Math.random() * typeTemplates.length)],
            patternType: pattern.type,
            patternCenter: pattern.center,
            createdAt: Date.now(),
            fulfilled: false,
            fulfillmentCondition: this.determineFulfillment(pattern)
        };
    }
    
    determineFulfillment(pattern) {
        // Abstract conditions that can actually be checked
        return {
            type: pattern.type,
            location: pattern.center,
            radius: 100,
            timeLimit: 60000
        };
    }
    
    onProphecyFulfilled(prophecy) {
        this.prophecyFulfilled++;
        
        // Bonus for fulfilled prophecies
        if (this.scene.syntropyEngine) {
            this.scene.syntropyEngine.syntropyPoints += 100;
        }
        
        if (this.scene.noeticMirror?.showFloatingCommentary) {
            this.scene.noeticMirror.showFloatingCommentary('The pattern spoke true...');
        }
    }
    
    // ===== MANDALA ANALYSIS =====
    
    analyzeMandala() {
        const now = Date.now();
        if (now - this.lastMandalaTime < 30000) return; // Every 30s max
        
        this.lastMandalaTime = now;
        
        const allPoints = this.getWeightedPoints();
        if (allPoints.length < 10) return;
        
        // Calculate centroid and dispersion
        const centroid = this.calculateCenter(allPoints);
        
        // Calculate average distance from center (concentration measure)
        const distances = allPoints.map(p => 
            Phaser.Math.Distance.Between(p.x, p.y, centroid.x, centroid.y)
        );
        const avgDist = distances.reduce((a, b) => a + b) / distances.length;
        const maxDist = Math.max(...distances);
        
        // Determine archetype based on dispersion pattern
        const concentration = avgDist / maxDist;
        
        let archetype = 'scattered';
        if (concentration < 0.3) archetype = 'concentric';
        else if (concentration > 0.7) archetype = 'dispersed';
        else {
            // Check for linear or radial
            const angles = allPoints.map(p => 
                Phaser.Math.Angle.Between(centroid.x, centroid.y, p.x, p.y)
            );
            
            // Group by angle sectors
            const sectors = new Array(8).fill(0);
            angles.forEach(a => {
                const sector = Math.floor((a + Math.PI) / (Math.PI / 4)) % 8;
                sectors[sector]++;
            });
            
            const maxSector = Math.max(...sectors);
            if (maxSector > allPoints.length * 0.4) {
                archetype = 'linear'; // Clustered in one direction
            } else if (sectors.every(s => s > 0)) {
                archetype = 'radial'; // Even distribution
            }
        }
        
        // Check for fractal/complex
        if (this.totalPatternsDiscovered > 5) {
            archetype = 'fractal';
        }
        
        this.currentMandala = {
            archetype,
            centroid,
            concentration,
            points: allPoints.length,
            patterns: this.detectedPatterns.length,
            timestamp: now
        };
        
        this.applyMandalaEffect(archetype);
        
        // Notify other systems
        this.scene.events.emit('mandalaAnalyzed', this.currentMandala);
    }
    
    applyMandalaEffect(archetype) {
        const effects = {
            scattered: { damageMult: 1.2, speedMult: 1.1, desc: 'CHAOS FAVORS THE BOLD' },
            concentric: { shieldRegen: 2, damageMult: 0.9, desc: 'CENTER HOLDS' },
            dispersed: { rangeMult: 1.3, desc: 'REACH EXTENDS' },
            linear: { pierceBonus: 1, desc: 'DIRECT ACTION' },
            radial: { areaMult: 1.2, desc: 'CIRCULAR THINKING' },
            fractal: { allMult: 1.1, desc: 'COMPLEXITY EMERGES' }
        };
        
        const effect = effects[archetype];
        if (!effect) return;
        
        // Apply to scene temporarily
        this.scene.mandalaBonus = effect;
        
        // Visual feedback
        if (this.scene.noeticMirror?.showFloatingCommentary) {
            this.scene.noeticMirror.showFloatingCommentary(effect.desc);
        }
        
        // Clear after 30 seconds
        this.scene.time.delayedCall(30000, () => {
            delete this.scene.mandalaBonus;
        });
    }
    
    // ===== VISUALIZATION =====
    // Note: All visualization now uses UnifiedGraphicsManager on 'effects' layer
    // Methods migrated from direct graphics drawing to command-based rendering
    
    visualizePattern(pattern) {
        const gm = this.scene.graphicsManager;
        if (!gm) return;
        
        const color = pattern.color;
        const { x, y } = pattern.center;
        
        switch (pattern.type) {
            case 'triangle':
                this.drawTriangleUnified(gm, pattern.points, color);
                break;
            case 'square':
                this.drawSquareUnified(gm, pattern.points, color);
                break;
            case 'circle':
                const radius = this.calculateAverageRadius(pattern);
                gm.drawRing('effects', x, y, radius, color, 0.6, 2);
                break;
            case 'spiral':
                this.drawSpiralUnified(gm, x, y, color);
                break;
            case 'cross':
                this.drawCrossUnified(gm, pattern.points, color);
                break;
            case 'star':
                this.drawStarUnified(gm, x, y, 5, 30, 60, color);
                break;
            case 'wings':
                this.drawWingsUnified(gm, pattern.points, color);
                break;
            case 'gate':
                this.drawGateUnified(gm, pattern.points, color);
                break;
        }
        
        // Center glow - filled circle
        gm.drawCircle('effects', x, y, 8, color, 0.3, true);
    }
    
    drawTriangleUnified(gm, points, color) {
        if (points.length < 3) return;
        // Draw three lines to form triangle
        gm.drawLine('effects', points[0].x, points[0].y, points[1].x, points[1].y, color, 0.6, 2);
        gm.drawLine('effects', points[1].x, points[1].y, points[2].x, points[2].y, color, 0.6, 2);
        gm.drawLine('effects', points[2].x, points[2].y, points[0].x, points[0].y, color, 0.6, 2);
    }
    
    drawSquareUnified(gm, points, color) {
        if (points.length < 4) return;
        // Draw four lines to form square
        gm.drawLine('effects', points[0].x, points[0].y, points[1].x, points[1].y, color, 0.6, 2);
        gm.drawLine('effects', points[1].x, points[1].y, points[2].x, points[2].y, color, 0.6, 2);
        gm.drawLine('effects', points[2].x, points[2].y, points[3].x, points[3].y, color, 0.6, 2);
        gm.drawLine('effects', points[3].x, points[3].y, points[0].x, points[0].y, color, 0.6, 2);
    }
    
    drawSpiralUnified(gm, x, y, color) {
        // Build spiral as a series of short line segments
        const points = [];
        for (let i = 0; i < 50; i++) {
            const angle = 0.2 * i;
            const r = 5 + i * 1.5;
            points.push({
                x: x + r * Math.cos(angle),
                y: y + r * Math.sin(angle)
            });
        }
        gm.drawPath('effects', points, color, 0.5, 2);
    }
    
    drawCrossUnified(gm, points, color) {
        if (points.length < 4) return;
        // Line 1
        gm.drawLine('effects', points[0].x, points[0].y, points[1].x, points[1].y, color, 0.6, 2);
        // Line 2
        gm.drawLine('effects', points[2].x, points[2].y, points[3].x, points[3].y, color, 0.6, 2);
    }
    
    drawStarUnified(gm, x, y, points, innerRadius, outerRadius, color) {
        // Build star as a path
        const pathPoints = [];
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / points - Math.PI / 2;
            pathPoints.push({
                x: x + radius * Math.cos(angle),
                y: y + radius * Math.sin(angle)
            });
        }
        // Close the star by adding first point again
        pathPoints.push({ ...pathPoints[0] });
        gm.drawPath('effects', pathPoints, color, 0.6, 2);
    }
    
    drawWingsUnified(gm, points, color) {
        if (points.length < 6) return;
        // Draw curves connecting symmetric pairs using line segments
        for (let i = 0; i < points.length - 1; i += 2) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const midX = (p1.x + p2.x) / 2;
            const midY = Math.min(p1.y, p2.y) - 50;
            
            // Approximate quadratic curve with line segments
            const curvePoints = [];
            for (let t = 0; t <= 1; t += 0.1) {
                const invT = 1 - t;
                curvePoints.push({
                    x: invT * invT * p1.x + 2 * invT * t * midX + t * t * p2.x,
                    y: invT * invT * p1.y + 2 * invT * t * midY + t * t * p2.y
                });
            }
            gm.drawPath('effects', curvePoints, color, 0.5, 2);
        }
    }
    
    drawGateUnified(gm, points, color) {
        // Draw parallel lines
        for (let i = 0; i < Math.min(points.length, 6); i += 2) {
            if (i + 1 >= points.length) break;
            gm.drawLine('effects', points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, color, 0.5, 3);
        }
    }
    
    calculateAverageRadius(pattern) {
        const center = pattern.center;
        let totalRadius = 0;
        pattern.points.forEach(p => {
            totalRadius += Phaser.Math.Distance.Between(center.x, center.y, p.x, p.y);
        });
        return totalRadius / pattern.points.length;
    }
    
    pulsePattern(pattern) {
        // Add pulsing animation to activated pattern
        const circle = this.scene.add.circle(pattern.center.x, pattern.center.y, 20, pattern.color, 0.3);
        circle.setDepth(26);
        
        this.scene.tweens.add({
            targets: circle,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => circle.destroy()
        });
    }
    
    // ===== FOCUS MODE =====
    
    toggleFocusMode() {
        this.isFocusMode = !this.isFocusMode;
        this.divinationOverlay.setVisible(this.isFocusMode);
        
        if (this.isFocusMode) {
            this.renderDivinationInterface();
        } else {
            this.divinationOverlay.removeAll(true);
        }
        
        // Notify player
        if (this.scene.noeticMirror?.showFloatingCommentary) {
            const msg = this.isFocusMode ? 'Focus deepens... patterns emerge' : 'Focus released...';
            this.scene.noeticMirror.showFloatingCommentary(msg);
        }
    }
    
    renderDivinationInterface() {
        this.divinationOverlay.removeAll(true);
        
        const cx = this.scene.cameras.main.width / 2;
        const cy = this.scene.cameras.main.height / 2;
        
        // Title
        const title = this.scene.add.text(cx, 40, '◈ DIVINATION ◈', {
            fontFamily: 'monospace', fontSize: '20px', color: '#f0f0f0'
        }).setOrigin(0.5).setScrollFactor(0);
        this.divinationOverlay.add(title);
        
        // Active patterns list
        let yPos = 80;
        this.detectedPatterns.forEach(pattern => {
            const text = `${pattern.type.toUpperCase()} (${Math.round(pattern.charge)}%)`;
            const color = '#' + pattern.color.toString(16).padStart(6, '0');
            const entry = this.scene.add.text(cx, yPos, text, {
                fontFamily: 'monospace', fontSize: '14px', color
            }).setOrigin(0.5).setScrollFactor(0);
            this.divinationOverlay.add(entry);
            yPos += 25;
        });
        
        // Active prophecies
        if (this.prophecies.length > 0) {
            yPos += 20;
            const propTitle = this.scene.add.text(cx, yPos, '─ PROPHECIES ─', {
                fontFamily: 'monospace', fontSize: '14px', color: '#9d4edd'
            }).setOrigin(0.5).setScrollFactor(0);
            this.divinationOverlay.add(propTitle);
            yPos += 25;
            
            this.prophecies.slice(-3).forEach(p => {
                const status = p.fulfilled ? '✓' : '◯';
                const entry = this.scene.add.text(cx, yPos, `${status} ${p.text}`, {
                    fontFamily: 'monospace', fontSize: '12px', color: '#c0c0c0'
                }).setOrigin(0.5).setScrollFactor(0);
                this.divinationOverlay.add(entry);
                yPos += 20;
            });
        }
        
        // Mandala archetype
        if (this.currentMandala) {
            yPos += 20;
            const mandalaText = this.scene.add.text(cx, yPos, 
                `MANDALA: ${this.currentMandala.archetype.toUpperCase()}`, {
                fontFamily: 'monospace', fontSize: '14px', color: '#00f0ff'
            }).setOrigin(0.5).setScrollFactor(0);
            this.divinationOverlay.add(mandalaText);
        }
        
        // Stats
        yPos += 40;
        const stats = this.scene.add.text(cx, yPos, 
            `${this.totalPatternsDiscovered} patterns • ${this.prophecyFulfilled} prophecies fulfilled`, {
            fontFamily: 'monospace', fontSize: '11px', color: '#666666'
        }).setOrigin(0.5).setScrollFactor(0);
        this.divinationOverlay.add(stats);
    }
    
    // ===== MAIN UPDATE =====
    
    update() {
        // Record player movement
        if (this.scene.player && this.scene.player.active) {
            this.recordMovement(this.scene.player.x, this.scene.player.y, 
                Math.abs(this.scene.player.body.velocity.x) + Math.abs(this.scene.player.body.velocity.y));
        }
        
        // Periodically analyze mandala
        if (this.scene.time.now % 10000 < 20) {
            this.analyzeMandala();
        }
        
        // Update visuals
        this.renderPointCloud();
        
        // Update focus mode display
        if (this.isFocusMode && this.scene.game.loop.frame % 30 === 0) {
            this.renderDivinationInterface();
        }
    }
    
    renderPointCloud() {
        // Note: Point cloud rendering now uses UnifiedGraphicsManager on 'effects' layer
        // UnifiedGraphicsManager clears once per frame automatically
        const gm = this.scene.graphicsManager;
        if (!gm) return;
        
        // Draw subtle points
        const allPoints = this.getWeightedPoints();
        allPoints.forEach(p => {
            const age = Date.now() - p.time;
            const alpha = 1 - (age / this.config.pointDecay);
            if (alpha > 0) {
                const size = p.weight * 3;
                gm.drawCircle('effects', p.x, p.y, size, this.PRISM_WHITE, alpha * 0.3, true);
            }
        });
    }
    
    // ===== UTILITY =====
    
    getPatternCount(type) {
        return this.detectedPatterns.filter(p => p.type === type).length;
    }
    
    getActivePatterns() {
        return this.detectedPatterns;
    }
    
    getCurrentProphecies() {
        return this.prophecies.filter(p => !p.fulfilled);
    }
    
    forcePatternDetection() {
        // Debug: trigger immediate detection
        this.detectPatterns();
    }
    
    destroy() {
        // Note: patternGraphics and pointGraphics no longer exist - managed by UnifiedGraphicsManager
        // UnifiedGraphicsManager handles its own cleanup
        if (this.divinationOverlay) {
            this.divinationOverlay.destroy();
        }
    }
}
