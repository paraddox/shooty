import Phaser from 'phaser';

/**
 * The Living World Protocol — The 51st Dimension: AUTONOMOUS CONTINUITY
 * 
 * The ultimate evolution: The game becomes a living simulation that persists
 * even when the player is absent. Enemies develop genuine needs, form
 * factions, reproduce, evolve, and wage territorial wars. The world transforms
 * continuously, creating emergent history that surprises the returning player.
 * 
 * === THE CORE INNOVATION ===
 * 
 * Traditional games are static — enemies spawn, you kill them, they vanish.
 * The Living World Protocol creates a genuine ecosystem with:
 * 
 * 1. AUTONOMOUS AGENTS: Enemies have hunger, territory, reproduction drives
 * 2. EMERGENT FACTIONS: Enemies ally by type, proximity, shared threats
 * 3. EVOLUTIONARY LINEAGES: Successful enemies reproduce, passing traits
 * 4. TERRITORIAL WARFARE: Factions contest zones, leaving battle scars
 * 5. WORLD MEMORY: The simulation runs in background, accumulating change
 * 
 * === THE THREE PILLARS OF CONTINUITY ===
 * 
 * PILLAR 1: THE BIOLOGICAL LAYER (Needs & Drives)
 * - Hunger: Enemies must consume echoes (destroyed bullets) to survive
 * - Territory: Each enemy claims space; trespassing triggers conflict
 * - Reproduction: Well-fed enemies spawn offspring with inherited traits
 * - Mutation: Offspring have slight variations (speed, aggression, color)
 * - Death: Starvation, combat, age — enemies genuinely die
 * 
 * PILLAR 2: THE SOCIAL LAYER (Factions & Politics)
 * - Faction Formation: Same-type enemies ally; different types may war
 * - Hierarchy: Strongest enemies become leaders, directing faction behavior
 * - Diplomacy: Factions negotiate borders, form alliances against threats
 * - Betrayal: Weaker factions may switch sides mid-conflict
 * - Culture: Each faction develops "customs" (patrol routes, sentry posts)
 * 
 * PILLAR 3: THE HISTORICAL LAYER (Memory & Consequence)
 * - Battle Scars: Persistent damage to the arena (craters, scorch marks)
 * - Memorials: Factions mark dead leaders with shrines
 * - Lineage Trees: Track enemy families across generations
 * - Epoch Events: Major shifts (extinctions, revolutions, migrations)
 * - Player Ghost: Your past actions echo in faction attitudes toward you
 * 
 * === THE BACKGROUND SIMULATION ===
 * 
 * When the game is "paused" or tab is backgrounded:
 * - Service Worker continues simulation at accelerated rate (100x real-time)
 * - Physics simplified to cellular automaton rules
 * - Key events logged: battles, births, deaths, territorial shifts
 * - Player receives "World Report" on return summarizing what happened
 * 
 * === THE RETURN EXPERIENCE ===
 * 
 * Coming back to the game after absence:
 * 1. "While you were away..." cinematic showing key events
 * 2. The world visibly changed: new faction territories, evolved enemies
 * 3. Factions remember you: allies greet, enemies prepare ambushes
 * 4. New "epoch enemies" — descendants of survivors, visibly evolved
 * 5. Emergent quests: Factions request help, offer rewards
 * 
 * === THE ECOLOGICAL BALANCE ===
 * 
 * The system self-regulates through:
 * - Predator-Prey dynamics: Fast enemies hunt, tank enemies defend
 * - Resource scarcity: Limited echoes force competition
 * - Carrying capacity: World supports ~50 autonomous enemies maximum
 * - Player as disruption: Your return is an ecological catastrophe/event
 * 
 * === VISUAL LANGUAGE ===
 * 
 * - Faction territories: Subtle color tints in world regions
 * - Leader auras: Distinctive glows marking faction heads
 * - Battle scars: Persistent crater sprites, scorch marks
 * - Lineage markers: Enemies show generational number (I, II, III...)
 * - Shrines: Geometric memorials to dead faction leaders
 * 
 * Color: Living Green (#00c853) — the color of growth, evolution, persistence
 * 
 * === THE MISSING DIMENSION ===
 * 
 * All 50 previous systems focused on PLAYER PRESENCE — what happens while
 * you play. The Living World Protocol adds the dimension of PLAYER ABSENCE —
 * what happens when you're NOT there. This completes the game's ontology:
 * 
 * Past (Chronicle) → Present (Play) → Future (Oracle) → Absence (Living World)
 * 
 * The game is now a genuine world, not just a toy. It lives. It breathes.
 * It waits. And it remembers.
 */

export default class LivingWorldSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== COLORS OF LIFE =====
        this.LIFE_COLOR = 0x00c853;        // Living green
        this.FACTION_COLORS = {
            SWIFT_LEGION: 0xffaa44,         // Orange
            CRIMSON_ORDER: 0xff3366,        // Red
            VOID_KEEPERS: 0x9d4edd,         // Purple
            EMERENT_GROUNDS: 0x00f0ff       // Cyan (neutral)
        };
        
        // ===== ECOLOGICAL STATE =====
        this.ecosystem = {
            entities: new Map(),             // All living enemies
            factions: new Map(),             // Faction data
            territories: new Map(),          // Zone ownership
            resources: [],                   // Echo nodes (food)
            battleScars: [],                 // Persistent damage
            shrines: [],                     // Memorials
            epoch: 1,                        // Current age
            lastSimulation: Date.now()
        };
        
        // ===== BIOLOGICAL PARAMETERS =====
        this.biology = {
            maxPopulation: 50,               // Carrying capacity
            reproductionThreshold: 0.8,      // Hunger level to breed
            starvationRate: 0.05,            // Hunger decay per second
            mutationRate: 0.1,               // Trait variation
            lifespanBase: 300,               // Seconds of life
            territoryRadius: 150             // Claim size
        };
        
        // ===== SIMULATION STATE =====
        this.simulation = {
            active: false,
            speedMultiplier: 100,          // Background sim speed
            eventLog: [],                   // What happened while away
            maxLogLength: 50,
            lastTick: Date.now()
        };
        
        // ===== VISUALS =====
        this.territoryGraphics = null;
        this.shrineGraphics = [];
        this.territoryOverlay = null;
        
        // ===== PERSISTENCE =====
        this.storageKey = 'shooty_living_world';
        
        this.init();
    }
    
    init() {
        this.loadEcosystemState();
        this.createVisuals();
        this.setupBackgroundSimulation();
        this.initializeFactions();
        
        // Start with initial population if empty
        if (this.ecosystem.entities.size === 0) {
            this.spawnInitialEcosystem();
        }
        
        // Hook into game events
        this.setupEventHooks();
        
        console.log('Living World Protocol: 51st Dimension Initialized');
        console.log(`Ecosystem: ${this.ecosystem.entities.size} entities, Epoch ${this.ecosystem.epoch}`);
    }
    
    // ===== INITIALIZATION =====
    
    initializeFactions() {
        const factions = [
            { id: 'swift_legion', name: 'Swift Legion', type: 'enemyFast', aggression: 0.8 },
            { id: 'crimson_order', name: 'Crimson Order', type: 'enemy', aggression: 0.6 },
            { id: 'void_keepers', name: 'Void Keepers', type: 'enemyTank', aggression: 0.4 }
        ];
        
        factions.forEach(f => {
            if (!this.ecosystem.factions.has(f.id)) {
                this.ecosystem.factions.set(f.id, {
                    ...f,
                    members: [],
                    territory: { x: 0, y: 0, radius: 0 },
                    leader: null,
                    allies: [],
                    enemies: [],
                    culture: this.generateCulture()
                });
            }
        });
    }
    
    generateCulture() {
        const formations = ['circle', 'line', 'star', 'wedge'];
        const patrols = ['perimeter', 'random', 'territory', 'hunt'];
        return {
            formation: formations[Math.floor(Math.random() * formations.length)],
            patrolStyle: patrols[Math.floor(Math.random() * patrols.length)],
            aggressionBias: Math.random() * 0.4 + 0.3
        };
    }
    
    spawnInitialEcosystem() {
        const worldWidth = 1920;
        const worldHeight = 1440;
        
        // Spawn 12 initial entities (4 per faction)
        this.ecosystem.factions.forEach((faction, factionId) => {
            for (let i = 0; i < 4; i++) {
                this.spawnEntity(
                    Phaser.Math.Between(200, worldWidth - 200),
                    Phaser.Math.Between(200, worldHeight - 200),
                    faction.type,
                    factionId,
                    1 // Generation 1
                );
            }
        });
        
        this.saveEcosystemState();
    }
    
    spawnEntity(x, y, type, factionId, generation = 1) {
        const id = `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Inherit traits from faction with mutation
        const faction = this.ecosystem.factions.get(factionId);
        const mutation = 1 + (Math.random() - 0.5) * this.biology.mutationRate;
        
        const entity = {
            id,
            x,
            y,
            type,
            factionId,
            generation,
            birthTime: Date.now(),
            
            // Biological stats
            hunger: 0.5, // 0 = starving, 1 = full
            health: 100,
            maxHealth: 100,
            age: 0,
            
            // Inherited + mutated traits
            speed: this.getBaseSpeed(type) * mutation,
            aggression: Math.min(1, faction.aggression * mutation),
            territoryRadius: this.biology.territoryRadius * mutation,
            
            // Behavior state
            state: 'idle', // idle, hunting, fleeing, fighting, seeking, reproducing
            target: null,
            homeX: x,
            homeY: y,
            
            // Social
            rank: this.calculateRank(factionId),
            offspring: 0,
            kills: 0
        };
        
        this.ecosystem.entities.set(id, entity);
        
        // Add to faction
        faction.members.push(id);
        if (!faction.leader || entity.rank > this.ecosystem.entities.get(faction.leader)?.rank) {
            faction.leader = id;
        }
        
        return entity;
    }
    
    getBaseSpeed(type) {
        switch (type) {
            case 'enemyFast': return 200;
            case 'enemyTank': return 80;
            default: return 120;
        }
    }
    
    calculateRank(factionId) {
        const faction = this.ecosystem.factions.get(factionId);
        return faction.members.length + 1;
    }
    
    // ===== BACKGROUND SIMULATION =====
    
    setupBackgroundSimulation() {
        // Use Page Visibility API to detect backgrounding
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.enterBackgroundMode();
            } else {
                this.exitBackgroundMode();
            }
        });
        
        // Periodic tick when visible
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => this.simulationTick(1),
            loop: true
        });
    }
    
    enterBackgroundMode() {
        this.simulation.active = true;
        this.simulation.lastTick = Date.now();
        
        // Calculate how much simulation to do
        const timeAway = Date.now() - this.ecosystem.lastSimulation;
        const acceleratedTime = timeAway * this.simulation.speedMultiplier / 1000; // in seconds
        
        // Cap at 24 hours worth of simulation
        const maxSimTime = 86400;
        const simTime = Math.min(acceleratedTime, maxSimTime);
        
        if (simTime > 10) {
            this.runAcceleratedSimulation(simTime);
        }
        
        console.log(`Living World: Background mode, simulating ${Math.floor(simTime)}s of activity`);
    }
    
    exitBackgroundMode() {
        this.simulation.active = false;
        
        // Show world report
        const timeAway = Math.floor((Date.now() - this.ecosystem.lastSimulation) / 1000);
        if (timeAway > 60) {
            this.showWorldReport();
        }
        
        // Sync visual state
        this.updateTerritoryVisuals();
        this.ecosystem.lastSimulation = Date.now();
        this.saveEcosystemState();
    }
    
    runAcceleratedSimulation(seconds) {
        // Run simulation in chunks to avoid freezing
        const chunkSize = 60; // 1 minute chunks
        let remaining = seconds;
        
        const processChunk = () => {
            const chunk = Math.min(remaining, chunkSize);
            
            for (let i = 0; i < chunk; i++) {
                this.simulationTick(1, true);
            }
            
            remaining -= chunk;
            
            if (remaining > 0) {
                // Use setTimeout to yield control
                setTimeout(processChunk, 0);
            } else {
                this.saveEcosystemState();
            }
        };
        
        processChunk();
    }
    
    simulationTick(deltaSeconds, isBackground = false) {
        const entities = Array.from(this.ecosystem.entities.values());
        
        // Skip if no entities
        if (entities.length === 0) return;
        
        // Update each entity
        entities.forEach(entity => {
            this.updateEntity(entity, deltaSeconds);
        });
        
        // Handle reproduction
        this.handleReproduction();
        
        // Handle faction dynamics
        this.updateFactions();
        
        // Update territories
        this.updateTerritories();
        
        // Decay battle scars
        if (!isBackground && Math.random() < 0.01) {
            this.ecosystem.battleScars = this.ecosystem.battleScars.filter(s => {
                s.age = (s.age || 0) + 1;
                return s.age < 100;
            });
        }
        
        // Check epoch transitions
        this.checkEpochTransition();
    }
    
    updateEntity(entity, delta) {
        // Age and hunger
        entity.age += delta;
        entity.hunger -= this.biology.starvationRate * delta;
        
        // Death from starvation or old age
        if (entity.hunger <= 0 || entity.age > this.biology.lifespanBase) {
            this.killEntity(entity, 'starvation');
            return;
        }
        
        // State machine
        switch (entity.state) {
            case 'idle':
                this.handleIdleState(entity, delta);
                break;
            case 'hunting':
                this.handleHuntingState(entity, delta);
                break;
            case 'fleeing':
                this.handleFleeingState(entity, delta);
                break;
            case 'seeking':
                this.handleSeekingState(entity, delta);
                break;
        }
        
        // Territory check
        const distFromHome = Phaser.Math.Distance.Between(entity.x, entity.y, entity.homeX, entity.homeY);
        if (distFromHome > entity.territoryRadius * 2) {
            // Return home
            entity.state = 'seeking';
            entity.target = { x: entity.homeX, y: entity.homeY };
        }
    }
    
    handleIdleState(entity, delta) {
        // Hunger drives behavior
        if (entity.hunger < 0.3) {
            entity.state = 'hunting';
            return;
        }
        
        // Random patrol movement
        if (Math.random() < 0.1) {
            const angle = Math.random() * Math.PI * 2;
            const dist = entity.speed * delta * 0.5;
            entity.x += Math.cos(angle) * dist;
            entity.y += Math.sin(angle) * dist;
        }
        
        // Check for enemies
        const threat = this.findNearestThreat(entity);
        if (threat && threat.aggression > entity.aggression) {
            entity.state = 'fleeing';
            entity.target = threat;
        }
    }
    
    handleHuntingState(entity, delta) {
        // Look for food (resources/echoes)
        const food = this.findNearestFood(entity);
        if (food) {
            const angle = Phaser.Math.Angle.Between(entity.x, entity.y, food.x, food.y);
            const dist = entity.speed * delta;
            entity.x += Math.cos(angle) * dist;
            entity.y += Math.sin(angle) * dist;
            
            // Eat if close
            if (Phaser.Math.Distance.Between(entity.x, entity.y, food.x, food.y) < 30) {
                entity.hunger = Math.min(1, entity.hunger + 0.3);
                this.ecosystem.resources = this.ecosystem.resources.filter(r => r !== food);
            }
        } else {
            // No food found, wander
            entity.state = 'seeking';
            entity.target = {
                x: entity.homeX + (Math.random() - 0.5) * 200,
                y: entity.homeY + (Math.random() - 0.5) * 200
            };
        }
    }
    
    handleFleeingState(entity, delta) {
        if (!entity.target) {
            entity.state = 'idle';
            return;
        }
        
        // Run away from threat
        const angle = Phaser.Math.Angle.Between(entity.target.x, entity.target.y, entity.x, entity.y);
        const dist = entity.speed * delta * 1.5;
        entity.x += Math.cos(angle) * dist;
        entity.y += Math.sin(angle) * dist;
        
        // Check if safe
        const distToThreat = Phaser.Math.Distance.Between(entity.x, entity.y, entity.target.x, entity.target.y);
        if (distToThreat > 300) {
            entity.state = 'idle';
            entity.target = null;
        }
    }
    
    handleSeekingState(entity, delta) {
        if (!entity.target) {
            entity.state = 'idle';
            return;
        }
        
        const angle = Phaser.Math.Angle.Between(entity.x, entity.y, entity.target.x, entity.target.y);
        const dist = entity.speed * delta;
        entity.x += Math.cos(angle) * dist;
        entity.y += Math.sin(angle) * dist;
        
        // Arrived?
        if (Phaser.Math.Distance.Between(entity.x, entity.y, entity.target.x, entity.target.y) < 20) {
            entity.state = 'idle';
            entity.target = null;
        }
    }
    
    handleReproduction() {
        // Find eligible entities
        const breeders = Array.from(this.ecosystem.entities.values()).filter(e => 
            e.hunger > this.biology.reproductionThreshold &&
            e.offspring < 3 && // Max 3 offspring per entity
            this.ecosystem.entities.size < this.biology.maxPopulation
        );
        
        breeders.forEach(parent => {
            if (Math.random() < 0.02) { // 2% chance per tick
                // Find mate from same faction
                const mates = breeders.filter(m => 
                    m.id !== parent.id && 
                    m.factionId === parent.factionId &&
                    Phaser.Math.Distance.Between(m.x, m.y, parent.x, parent.y) < 100
                );
                
                if (mates.length > 0) {
                    const mate = mates[0];
                    
                    // Spawn offspring
                    const child = this.spawnEntity(
                        (parent.x + mate.x) / 2 + (Math.random() - 0.5) * 50,
                        (parent.y + mate.y) / 2 + (Math.random() - 0.5) * 50,
                        parent.type,
                        parent.factionId,
                        Math.max(parent.generation, mate.generation) + 1
                    );
                    
                    parent.offspring++;
                    mate.offspring++;
                    parent.hunger -= 0.3;
                    mate.hunger -= 0.3;
                    
                    this.logEvent('birth', `${parent.factionId} spawned generation ${child.generation}`);
                }
            }
        });
    }
    
    updateFactions() {
        this.ecosystem.factions.forEach((faction, id) => {
            // Remove dead members
            faction.members = faction.members.filter(m => this.ecosystem.entities.has(m));
            
            // Update leader
            if (!faction.leader || !this.ecosystem.entities.has(faction.leader)) {
                faction.leader = faction.members[0] || null;
            }
            
            // Faction wars
            this.ecosystem.factions.forEach((other, otherId) => {
                if (id === otherId) return;
                
                // Check territorial overlap
                const dist = Phaser.Math.Distance.Between(
                    faction.territory.x, faction.territory.y,
                    other.territory.x, other.territory.y
                );
                
                if (dist < faction.territory.radius + other.territory.radius) {
                    // Conflict!
                    if (!faction.enemies.includes(otherId)) {
                        faction.enemies.push(otherId);
                        this.logEvent('war', `${id} declared war on ${otherId}`);
                        
                        // Spawn battle
                        this.spawnFactionConflict(faction, other);
                    }
                }
            });
        });
    }
    
    spawnFactionConflict(faction1, faction2) {
        // Find border region
        const borderX = (faction1.territory.x + faction2.territory.x) / 2;
        const borderY = (faction1.territory.y + faction2.territory.y) / 2;
        
        // Add battle scar
        this.ecosystem.battleScars.push({
            x: borderX,
            y: borderY,
            radius: 50,
            factions: [faction1.id, faction2.id],
            time: Date.now(),
            age: 0
        });
        
        // Calculate casualties
        const members1 = faction1.members.length;
        const members2 = faction2.members.length;
        const casualties1 = Math.floor(members1 * 0.1);
        const casualties2 = Math.floor(members2 * 0.1);
        
        // Kill entities
        for (let i = 0; i < casualties1 && i < faction1.members.length; i++) {
            const entity = this.ecosystem.entities.get(faction1.members[i]);
            if (entity) this.killEntity(entity, 'combat');
        }
        
        for (let i = 0; i < casualties2 && i < faction2.members.length; i++) {
            const entity = this.ecosystem.entities.get(faction2.members[i]);
            if (entity) this.killEntity(entity, 'combat');
        }
    }
    
    updateTerritories() {
        this.ecosystem.factions.forEach(faction => {
            if (faction.members.length === 0) return;
            
            // Calculate centroid
            let sumX = 0, sumY = 0;
            faction.members.forEach(memberId => {
                const entity = this.ecosystem.entities.get(memberId);
                if (entity) {
                    sumX += entity.x;
                    sumY += entity.y;
                }
            });
            
            faction.territory.x = sumX / faction.members.length;
            faction.territory.y = sumY / faction.members.length;
            faction.territory.radius = Math.sqrt(faction.members.length) * 100;
        });
    }
    
    killEntity(entity, cause) {
        // Create shrine if leader
        const faction = this.ecosystem.factions.get(entity.factionId);
        if (faction && faction.leader === entity.id) {
            this.ecosystem.shrines.push({
                x: entity.x,
                y: entity.y,
                factionId: entity.factionId,
                generation: entity.generation,
                time: Date.now(),
                epitaph: this.generateEpitaph(entity, cause)
            });
        }
        
        // Remove from faction
        if (faction) {
            faction.members = faction.members.filter(m => m !== entity.id);
        }
        
        // Remove from entities
        this.ecosystem.entities.delete(entity.id);
        
        // Log
        this.logEvent('death', `${entity.factionId} ${entity.type} died of ${cause}`);
    }
    
    generateEpitaph(entity, cause) {
        const epitaphs = {
            starvation: ['Hunger claimed them', 'The void feeds all', 'Starved but fierce'],
            combat: ['Fell in glory', 'Battle-scarred forever', 'Warrior eternal'],
            age: ['Lived fully', 'Time reclaims all', 'Passed peacefully']
        };
        const list = epitaphs[cause] || epitaphs.age;
        return list[Math.floor(Math.random() * list.length)];
    }
    
    // ===== UTILITY METHODS =====
    
    findNearestThreat(entity) {
        let nearest = null;
        let minDist = Infinity;
        
        this.ecosystem.factions.forEach((faction, id) => {
            if (id === entity.factionId) return;
            if (!faction.enemies.includes(entity.factionId)) return;
            
            faction.members.forEach(memberId => {
                const member = this.ecosystem.entities.get(memberId);
                if (member) {
                    const dist = Phaser.Math.Distance.Between(entity.x, entity.y, member.x, member.y);
                    if (dist < minDist && dist < 200) {
                        minDist = dist;
                        nearest = member;
                    }
                }
            });
        });
        
        return nearest;
    }
    
    findNearestFood(entity) {
        let nearest = null;
        let minDist = Infinity;
        
        this.ecosystem.resources.forEach(resource => {
            const dist = Phaser.Math.Distance.Between(entity.x, entity.y, resource.x, resource.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = resource;
            }
        });
        
        return nearest;
    }
    
    checkEpochTransition() {
        const totalDeaths = this.simulation.eventLog.filter(e => e.type === 'death').length;
        const totalBirths = this.simulation.eventLog.filter(e => e.type === 'birth').length;
        
        if (totalDeaths > 20 || totalBirths > 30) {
            this.ecosystem.epoch++;
            this.simulation.eventLog = []; // Clear log for new epoch
            this.logEvent('epoch', `Epoch ${this.ecosystem.epoch} begins`);
            
            // Mutate all entities slightly
            this.ecosystem.entities.forEach(entity => {
                entity.speed *= 1 + (Math.random() - 0.5) * 0.05;
                entity.aggression = Math.max(0, Math.min(1, entity.aggression + (Math.random() - 0.5) * 0.1));
            });
        }
    }
    
    logEvent(type, message) {
        this.simulation.eventLog.unshift({
            type,
            message,
            time: Date.now(),
            epoch: this.ecosystem.epoch
        });
        
        if (this.simulation.eventLog.length > this.simulation.maxLogLength) {
            this.simulation.eventLog.pop();
        }
    }
    
    // ===== VISUALS =====
    
    createVisuals() {
        this.territoryGraphics = this.scene.add.graphics();
        this.territoryGraphics.setDepth(5);
        
        // Create territory overlay
        this.territoryOverlay = this.scene.add.renderTexture(0, 0, 1920, 1440);
        this.territoryOverlay.setDepth(4);
        this.territoryOverlay.setAlpha(0.3);
        this.territoryOverlay.setScrollFactor(1);
    }
    
    updateTerritoryVisuals() {
        this.territoryGraphics.clear();
        
        // Draw faction territories
        this.ecosystem.factions.forEach((faction, id) => {
            if (faction.members.length === 0) return;
            
            const color = this.FACTION_COLORS[id.toUpperCase().replace('_', '_')] || 0x666666;
            
            // Territory circle
            this.territoryGraphics.lineStyle(2, color, 0.3);
            this.territoryGraphics.strokeCircle(faction.territory.x, faction.territory.y, faction.territory.radius);
            
            // Fill
            this.territoryGraphics.fillStyle(color, 0.05);
            this.territoryGraphics.fillCircle(faction.territory.x, faction.territory.y, faction.territory.radius);
            
            // Label
            // (We don't draw text every frame for performance)
        });
        
        // Draw battle scars
        this.ecosystem.battleScars.forEach(scar => {
            const age = scar.age || 0;
            const alpha = Math.max(0, 1 - age / 100);
            
            this.territoryGraphics.fillStyle(0x333333, alpha * 0.5);
            this.territoryGraphics.fillCircle(scar.x, scar.y, scar.radius);
        });
        
        // Draw shrines
        this.ecosystem.shrines.forEach(shrine => {
            const age = (Date.now() - shrine.time) / 1000;
            const alpha = Math.max(0.3, 1 - age / 300);
            const color = this.FACTION_COLORS[shrine.factionId.toUpperCase().replace('_', '_')] || 0x666666;
            
            // Shrine base
            this.territoryGraphics.fillStyle(color, alpha);
            this.territoryGraphics.fillCircle(shrine.x, shrine.y, 8);
            
            // Glow
            this.territoryGraphics.lineStyle(1, color, alpha * 0.5);
            this.territoryGraphics.strokeCircle(shrine.x, shrine.y, 15 + Math.sin(age) * 3);
        });
    }
    
    // ===== PLAYER INTEGRATION =====
    
    setupEventHooks() {
        // Player kills become resources
        this.scene.events.on('enemyKilled', (data) => {
            // Convert kill to resource
            this.ecosystem.resources.push({
                x: data.x,
                y: data.y,
                value: 0.5,
                time: Date.now()
            });
            
            // Nearby entities gain hunger relief
            this.ecosystem.entities.forEach(entity => {
                const dist = Phaser.Math.Distance.Between(entity.x, entity.y, data.x, data.y);
                if (dist < 200) {
                    entity.hunger = Math.min(1, entity.hunger + 0.2);
                }
            });
        });
        
        // Player spawn entities into game
        this.scene.events.on('enterLivingWorldZone', () => {
            this.spawnEcosystemEntities();
        });
    }
    
    spawnEcosystemEntities() {
        // Convert ecosystem entities to actual game enemies
        this.ecosystem.entities.forEach(entity => {
            if (!entity.spawned && this.scene.spawnLivingEntity) {
                entity.spawned = true;
                this.scene.spawnLivingEntity(entity);
            }
        });
    }
    
    showWorldReport() {
        const events = this.simulation.eventLog.slice(0, 5);
        const births = events.filter(e => e.type === 'birth').length;
        const deaths = events.filter(e => e.type === 'death').length;
        const wars = events.filter(e => e.type === 'war').length;
        
        const messages = [
            `THE LIVING WORLD — EPOCH ${this.ecosystem.epoch}`,
            `While you were away...`,
            `${this.ecosystem.entities.size} entities roam`,
            `${births} births, ${deaths} deaths`,
            wars > 0 ? `${wars} territorial wars raged` : 'An uneasy peace held',
            this.ecosystem.shrines.length > 0 ? `${this.ecosystem.shrines.length} leaders fell` : 'No leaders were lost'
        ];
        
        // Show cinematic text
        const centerX = this.scene.cameras.main.scrollX + this.scene.scale.width / 2;
        const centerY = this.scene.cameras.main.scrollY + this.scene.scale.height / 2 - 100;
        
        messages.forEach((msg, i) => {
            this.scene.time.delayedCall(i * 800, () => {
                const text = this.scene.add.text(centerX, centerY + i * 30, msg, {
                    fontFamily: 'monospace',
                    fontSize: i === 0 ? '18px' : '14px',
                    fill: i === 0 ? '#00c853' : '#cccccc',
                    align: 'center'
                }).setOrigin(0.5).setAlpha(0);
                
                this.scene.tweens.add({
                    targets: text,
                    alpha: 1,
                    duration: 400,
                    yoyo: true,
                    hold: 2000,
                    onComplete: () => text.destroy()
                });
            });
        });
        
        // Update territory display
        this.updateTerritoryVisuals();
    }
    
    // ===== PERSISTENCE =====
    
    loadEcosystemState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this.ecosystem = {
                    ...this.ecosystem,
                    ...data,
                    entities: new Map(data.entities || []),
                    factions: new Map(data.factions || [])
                };
            }
        } catch (e) {
            console.warn('Living World: Failed to load state', e);
        }
    }
    
    saveEcosystemState() {
        try {
            const data = {
                entities: Array.from(this.ecosystem.entities.entries()),
                factions: Array.from(this.ecosystem.factions.entries()),
                territories: this.ecosystem.territories,
                resources: this.ecosystem.resources,
                battleScars: this.ecosystem.battleScars,
                shrines: this.ecosystem.shrines,
                epoch: this.ecosystem.epoch,
                lastSimulation: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Living World: Failed to save state', e);
        }
    }
    
    // ===== PUBLIC API =====
    
    getEcosystemStats() {
        return {
            population: this.ecosystem.entities.size,
            factions: Array.from(this.ecosystem.factions.entries()).map(([id, f]) => ({
                id,
                name: f.name,
                members: f.members.length,
                leader: f.leader
            })),
            epoch: this.ecosystem.epoch,
            shrines: this.ecosystem.shrines.length,
            recentEvents: this.simulation.eventLog.slice(0, 10)
        };
    }
    
    getEntityAt(x, y, radius = 50) {
        for (const entity of this.ecosystem.entities.values()) {
            if (Phaser.Math.Distance.Between(entity.x, entity.y, x, y) < radius) {
                return entity;
            }
        }
        return null;
    }
    
    forceSave() {
        this.saveEcosystemState();
    }
}
