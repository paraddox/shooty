import Phaser from 'phaser';

/**
 * EXOGENESIS PROTOCOL — The 56th Dimension: REALITY MANIFESTATION 🌍
 * 
 * The game breaks the fourth wall of digital isolation and becomes a living
 * mirror of the player's actual world. External reality bleeds into the void:
 * time of day, weather, moon phase, astronomical events, seasons, and even
 * ambient light conditions shape the game's reality in meaningful ways.
 * 
 * === THE REVOLUTION ===
 * 
 * Games exist in suspended timelessness — the same experience at 3 AM or 3 PM,
 * sunny or stormy, summer or winter. Exogenesis changes this fundamental
 * assumption. The game becomes CONTEXTUALLY AWARE of the player's actual
 * environment and manifests that reality as gameplay mechanics.
 * 
 * This is not cosmetic. Weather changes enemy behavior. Moon phases alter
 * drop rates. The season changes the color palette and ambient story.
 * Night brings different challenges than day. The game truly lives where
 * you live.
 * 
 * === THE SIX REALITY ANCHORS ===
 * 
 * 1. TEMPORAL ANCHOR (Time of Day)
 *    - Dawn (5-8 AM): Enemies sluggish, world emerging from darkness
 *    - Day (8 AM-5 PM): Standard behavior, clarity reigns
 *    - Dusk (5-8 PM): Enemies aggressive, frantic energy
 *    - Night (8 PM-5 AM): Nocturnal mechanics, shadow enemies, altered visibility
 * 
 * 2. LUNAR ANCHOR (Moon Phase)
 *    - New Moon: Stealth enhanced, shadows deeper, "void whispers" clearer
 *    - Waxing: Growing power, enemies drop more echoes
 *    - Full Moon: Lycanthropic surge — enemies faster, stronger, rewards doubled
 *    - Waning: Fading power, healing systems boosted, restorative energy
 * 
 * 3. METEOROLOGICAL ANCHOR (Weather)
 *    - Clear: Standard gameplay, visibility maximum
 *    - Cloudy: Diffused light, enemy accuracy reduced, mists appear
 *    - Rain: Slippery physics, electric attacks amplified, "storm seeking" enemies
 *    - Storm: Chaotic patterns, random lightning strikes (danger/weapon)
 *    - Snow: Slowed movement, crystalline formations, ice physics
 *    - Fog: Reduced visibility range, "hidden" enemies emerge
 * 
 * 4. SEASONAL ANCHOR (Annual Cycle)
 *    - Spring: Renewal mechanics, faster respawn, green/blue palette
 *    - Summer: Intensity peak, enemy aggression max, warm gold/red palette
 *    - Autumn: Harvest mechanics, resource abundance, orange/brown palette
 *    - Winter: Survival mechanics, scarcity, cold blue/white palette
 * 
 * 5. ASTRONOMICAL ANCHOR (Celestial Events)
 *    - Meteor showers: Rare resource drops, "falling star" collectibles
 *    - Eclipses: Temporary total darkness, unique "eclipse enemies"
 *    - Planetary alignments: All systems boosted, convergence events
 *    - Solstices/Equinoxes: Seasonal transitions, special "threshold" gameplay
 * 
 * 6. GEOGRAPHIC ANCHOR (Location)
 *    - Hemisphere detection: Reverses seasons for southern players
 *    - Latitude affects: Day length accuracy, polar night/day mechanics
 *    - Longitude affects: Timezone synchronization for global events
 * 
 * === THE REALITY MANIFESTATION ===
 * 
 * Exogenesis doesn't just change numbers — it transforms the VOID ITSELF:
 * 
 * DAWN: The arena slowly brightens. Enemies spawn slowly at first,
 *       then accelerate. "First light" bonus for early kills.
 * 
 * STORM: Rain particles overlay the screen. Lightning periodically
 *       strikes the arena — dangerous, but can be weaponized with
 *       proper timing (Paradox Engine + lightning = time fracture).
 * 
 * FULL MOON: A large moon appears in the background. Enemies gain
 *       glowing red eyes. Their speed increases 20%. Echo drops double.
 *       The "Lunar Beast" boss can only spawn during full moons.
 * 
 * WINTER: The arena floor shows frost patterns. Enemy movement leaves
 *       ice trails. Crystalline formations block shots but can be shattered
 *       for resources. Player slides slightly after stopping.
 * 
 * METEOR SHOWER: Occasional meteors streak across the background.
 *       Rarely, one strikes the arena, creating a crater and resource node.
 *       Players can "catch" meteors with precise positioning.
 * 
 * === THE EXOGENESIS INTERFACE ===
 * 
 * A subtle HUD element shows current reality conditions:
 * 
 *     🌙 Full Moon | 🌧️ Storm | ❄️ Winter | 03:47 AM
 * 
 * Hovering reveals detailed astronomical data:
 * - Moon illumination percentage
 * - Weather conditions
 * - Next celestial event countdown
 * - Day length / seasonal progress
 * 
 * === THE SYNCHRONIZATION MECHANICS ===
 * 
 * Exogenesis uses multiple data sources (privacy-respecting):
 * - Browser geolocation API (with permission) for latitude/longitude
 * - IP-based geolocation as fallback (approximate)
 * - Weather APIs for current conditions
 * - System time for local temporal data
 * - Astronomical calculation libraries (no API needed) for moon/celestial
 * 
 * Players can opt into "Deep Sync" for more precise integration or
 * use "Manual Override" to set their preferred reality conditions.
 * 
 * === THE GAMEPLAY IMPLICATIONS ===
 * 
 * Strategic Play: "I'll wait for the full moon to attempt that boss"
 * 
 * Seasonal Mastery: Understanding how winter's ice physics affect
 * kiting patterns becomes a skill.
 * 
 * Weather Tactics: Storm-seeking players learn to weaponize lightning.
 * Rain-runners exploit slippery physics for speed tech.
 * 
 * Circadian Adaptation: Night owls develop different strategies than
 * morning players. The game truly meets you where you are.
 * 
 * Global Community: Players compare experiences — "What's it like
 * playing in the Australian summer vs Canadian winter?"
 * 
 * === SYNERGIES WITH ALL 55 SYSTEMS ===
 * 
 * + Heartflux: Biometric data + weather data = complete physiological context
 * + Dream State: Sleep cycles could theoretically sync to dawn/dusk
 * + Oracle Protocol: Predictions include upcoming weather/celestial events
 * + Apophenia: Patterns in gameplay reflect patterns in weather/time
 * + Living World: Ecosystem behavior changes with real seasons
 * + Rhythm of the Void: BPM could adapt to time of day (calmer at night)
 * + Noetic Mirror: Commentary references current conditions ("Storm mirrors your intensity")
 * + Void Exchange: Market volatility correlates with weather volatility
 * + Mnemosyne Weave: Memories tagged with weather/time context
 * + Sanctum Protocol: Sanctum appearance reflects local season
 * 
 * === THE PHILOSOPHY ===
 * 
 * Exogenesis dissolves the boundary between play and life. The game
 * stops being a separate reality and becomes a FILTER for reality —
 * a lens through which your actual world is transformed into challenge,
 * beauty, and meaning.
 * 
 * The void is no longer empty. It is FILLED with the reality you inhabit.
 * Your weather. Your moon. Your season. Your time.
 * 
 * This is the final bridge between the digital and the physical.
 * The game becomes omnipresent — not demanding your attention away from
 * life, but transforming life itself into play.
 * 
 * === THE 56TH DIMENSION ===
 * 
 * The first 55 dimensions created depth within the game.
 * The 56th dimension extends the game INTO REALITY ITSELF.
 * 
 * The canvas is no longer just the screen.
 * The canvas is the WORLD.
 * 
 * Color: Horizon Gold (#ffaa44) — the color of dawn and dusk,
 * the threshold between night and day, the bridge between worlds.
 * 
 * This is where the game becomes infinite. Not through more content,
 * but through context. Every day is different. Every place is different.
 * Every moment is unique.
 * 
 * Welcome to the endless game.
 */

export default class ExogenesisProtocolSystem {
    constructor(scene) {
        this.scene = scene;
        
        // ===== EXOGENESIS STATE =====
        this.realityState = {
            // Temporal
            hour: 0,
            minute: 0,
            timeOfDay: 'night', // dawn, day, dusk, night
            dayProgress: 0,     // 0-1 through the day
            
            // Lunar
            moonPhase: 'new',   // new, waxing_crescent, first_quarter, waxing_gibbous,
                                // full, waning_gibbous, third_quarter, waning_crescent
            moonIllumination: 0, // 0-1
            moonAge: 0,         // Days since new moon (0-29.5)
            
            // Seasonal
            season: 'winter',   // spring, summer, autumn, winter
            dayOfYear: 1,       // 1-365
            yearProgress: 0,    // 0-1 through the year
            
            // Astronomical
            nextEvent: null,    // Upcoming celestial event
            eventProgress: 0,   // How close to next event (0-1)
            
            // Weather (placeholder until API integration)
            weather: 'clear',   // clear, cloudy, rain, storm, snow, fog
            temperature: 20,    // Celsius
            weatherIntensity: 0, // 0-1
            
            // Geographic
            latitude: 40.7128,  // Default: NYC (will be overridden)
            longitude: -74.0060,
            hemisphere: 'northern',
            timezone: 'America/New_York'
        };
        
        // ===== MANIFESTATION STATE =====
        this.manifestation = {
            active: true,
            intensity: 1.0,     // Global multiplier for all effects
            syncMode: 'auto',   // auto, manual, off
            lastUpdate: 0
        };
        
        // ===== VISUAL ELEMENTS =====
        this.visuals = {
            skyOverlay: null,       // Tint based on time
            weatherParticles: null, // Rain, snow, etc.
            moonSprite: null,       // Visible moon
            starField: null,        // Night stars
            seasonPalette: null,    // Color grading
            lightningEffect: null   // Storm flashes
        };
        
        // ===== MECHANICAL EFFECTS =====
        this.effects = {
            enemySpeedMod: 1.0,
            enemyDamageMod: 1.0,
            playerVisibilityMod: 1.0,
            echoDropRateMod: 1.0,
            physicsFrictionMod: 1.0,
            specialEvents: []
        };
        
        // ===== CONSTANTS =====
        this.HORIZON_GOLD = 0xffaa44;
        this.TIME_COLORS = {
            dawn: 0xffa500,    // Orange
            day: 0xfffff0,     // Ivory
            dusk: 0xff6347,    // Tomato
            night: 0x191970    // Midnight blue
        };
        this.SEASON_COLORS = {
            spring: { r: 0.4, g: 0.8, b: 0.6 },  // Green-tint
            summer: { r: 1.0, g: 0.9, b: 0.7 },  // Warm
            autumn: { r: 0.9, g: 0.6, b: 0.3 },  // Orange-tint
            winter: { r: 0.7, g: 0.8, b: 0.9 }   // Blue-tint
        };
        
        // ===== UPDATE TIMING =====
        this.updateInterval = null;
        this.weatherCheckInterval = null;
        
        this.init();
    }
    
    init() {
        this.loadPreferences();
        this.calculateRealityState();
        this.createVisuals();
        this.startMonitoring();
        this.applyInitialManifestation();
        
        console.log('Exogenesis Protocol: 56th Dimension Initialized');
        console.log(`Reality: ${this.realityState.timeOfDay}, ${this.realityState.moonPhase} moon, ${this.realityState.season}`);
    }
    
    // ===== REALITY CALCULATION =====
    
    calculateRealityState() {
        const now = new Date();
        
        // Temporal data
        this.realityState.hour = now.getHours();
        this.realityState.minute = now.getMinutes();
        this.realityState.timeOfDay = this.calculateTimeOfDay();
        this.realityState.dayProgress = (this.realityState.hour * 60 + this.realityState.minute) / 1440;
        
        // Seasonal data
        this.realityState.dayOfYear = this.getDayOfYear(now);
        this.realityState.yearProgress = this.realityState.dayOfYear / 365;
        this.realityState.season = this.calculateSeason();
        
        // Lunar data (using astronomical calculation)
        this.calculateMoonPhase(now);
        
        // Check for celestial events
        this.calculateCelestialEvents(now);
        
        // Geographic (attempt to get from browser)
        this.detectLocation();
    }
    
    calculateTimeOfDay() {
        const hour = this.realityState.hour;
        
        // Dawn: 5-8 AM, Day: 8 AM-5 PM, Dusk: 5-8 PM, Night: 8 PM-5 AM
        if (hour >= 5 && hour < 8) return 'dawn';
        if (hour >= 8 && hour < 17) return 'day';
        if (hour >= 17 && hour < 20) return 'dusk';
        return 'night';
    }
    
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
    
    calculateSeason() {
        // Adjust for hemisphere
        const dayOfYear = this.realityState.dayOfYear;
        const isNorthern = this.realityState.hemisphere === 'northern';
        
        // Northern hemisphere seasons
        // Spring: Mar-May (60-151), Summer: Jun-Aug (152-243), 
        // Autumn: Sep-Nov (244-334), Winter: Dec-Feb (335-59)
        let season;
        if (dayOfYear >= 60 && dayOfYear <= 151) season = 'spring';
        else if (dayOfYear >= 152 && dayOfYear <= 243) season = 'spring'; // Temp fix
        else if (dayOfYear >= 152 && dayOfYear <= 243) season = 'summer';
        else if (dayOfYear >= 244 && dayOfYear <= 334) season = 'autumn';
        else season = 'winter';
        
        // Flip for southern hemisphere
        if (!isNorthern) {
            const flip = { spring: 'autumn', summer: 'winter', autumn: 'spring', winter: 'summer' };
            season = flip[season];
        }
        
        return season;
    }
    
    calculateMoonPhase(date) {
        // Known new moon: January 6, 2025 (for calculation reference)
        // Synodic month = 29.53059 days
        const SYNODIC_MONTH = 29.53059;
        const KNOWN_NEW_MOON = new Date('2025-01-06T00:00:00Z');
        
        // Calculate days since known new moon
        const daysSinceNew = (date - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
        const moonAge = ((daysSinceNew % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
        
        this.realityState.moonAge = moonAge;
        this.realityState.moonIllumination = 0.5 * (1 - Math.cos((moonAge / SYNODIC_MONTH) * 2 * Math.PI));
        
        // Determine phase name
        if (moonAge < 1) this.realityState.moonPhase = 'new';
        else if (moonAge < 6.5) this.realityState.moonPhase = 'waxing_crescent';
        else if (moonAge < 9) this.realityState.moonPhase = 'first_quarter';
        else if (moonAge < 13.5) this.realityState.moonPhase = 'waxing_gibbous';
        else if (moonAge < 16.5) this.realityState.moonPhase = 'full';
        else if (moonAge < 21) this.realityState.moonPhase = 'waning_gibbous';
        else if (moonAge < 24) this.realityState.moonPhase = 'third_quarter';
        else if (moonAge < 28.5) this.realityState.moonPhase = 'waning_crescent';
        else this.realityState.moonPhase = 'new';
    }
    
    calculateCelestialEvents(date) {
        // Check for upcoming solstices/equinoxes
        const year = date.getFullYear();
        const events = [
            { name: 'Spring Equinox', date: new Date(year, 2, 20), type: 'equinox' },
            { name: 'Summer Solstice', date: new Date(year, 5, 21), type: 'solstice' },
            { name: 'Autumn Equinox', date: new Date(year, 8, 23), type: 'equinox' },
            { name: 'Winter Solstice', date: new Date(year, 11, 21), type: 'solstice' }
        ];
        
        // Find next event
        const nextEvent = events.find(e => e.date > date);
        this.realityState.nextEvent = nextEvent || events[0];
        
        // Calculate progress toward event
        if (nextEvent) {
            const msUntil = nextEvent.date - date;
            const msTotal = 1000 * 60 * 60 * 24 * 30; // Roughly month scale
            this.realityState.eventProgress = Math.max(0, 1 - (msUntil / msTotal));
        }
    }
    
    detectLocation() {
        // Try to get location from browser
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    this.realityState.latitude = pos.coords.latitude;
                    this.realityState.longitude = pos.coords.longitude;
                    this.realityState.hemisphere = this.realityState.latitude >= 0 ? 'northern' : 'southern';
                    this.recalculateSeason();
                },
                () => {
                    // Fallback: use IP-based approximation or defaults
                    this.useFallbackLocation();
                },
                { timeout: 5000 }
            );
        } else {
            this.useFallbackLocation();
        }
    }
    
    useFallbackLocation() {
        // Try timezone-based detection
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.realityState.timezone = tz;
        
        // Rough hemisphere guess from timezone
        const southernZones = ['Australia', 'Pacific', 'America/Santiago', 'Africa/Johannesburg'];
        this.realityState.hemisphere = southernZones.some(z => tz.includes(z)) ? 'southern' : 'northern';
        
        this.recalculateSeason();
    }
    
    recalculateSeason() {
        this.realityState.season = this.calculateSeason();
        this.updateSeasonalManifestation();
    }
    
    // ===== VISUAL CREATION =====
    
    createVisuals() {
        // Sky overlay (tints entire screen based on time)
        this.visuals.skyOverlay = this.scene.add.rectangle(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            this.TIME_COLORS[this.realityState.timeOfDay],
            0.1
        );
        this.visuals.skyOverlay.setScrollFactor(0);
        this.visuals.skyOverlay.setDepth(-100);
        
        // Moon sprite (visible during night and visible during day at certain phases)
        this.visuals.moonSprite = this.scene.add.circle(0, 0, 30, 0xfffff0, 0.8);
        this.visuals.moonSprite.setDepth(-50);
        this.updateMoonVisual();
        
        // Star field for night
        this.visuals.starField = this.createStarField();
        
        // Weather particles container
        this.visuals.weatherContainer = this.scene.add.container(0, 0);
        this.visuals.weatherContainer.setScrollFactor(0);
        this.visuals.weatherContainer.setDepth(200);
        
        // Create weather particles based on condition
        this.createWeatherParticles();
        
        // Lightning effect
        this.visuals.lightningEffect = this.scene.add.rectangle(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xffffff,
            0
        );
        this.visuals.lightningEffect.setScrollFactor(0);
        this.visuals.lightningEffect.setDepth(199);
        
        // Reality HUD
        this.createRealityHUD();
    }
    
    createStarField() {
        const stars = this.scene.add.graphics();
        stars.setDepth(-60);
        
        // Generate random stars
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * 1920; // World bounds
            const y = Math.random() * 1440;
            const size = Math.random() * 2 + 0.5;
            const alpha = Math.random() * 0.5 + 0.3;
            
            stars.fillStyle(0xffffff, alpha);
            stars.fillCircle(x, y, size);
        }
        
        // Only visible at night
        stars.setAlpha(this.realityState.timeOfDay === 'night' ? 1 : 0);
        
        return stars;
    }
    
    createWeatherParticles() {
        // Clear existing
        this.visuals.weatherContainer.removeAll(true);
        
        const weather = this.realityState.weather;
        
        if (weather === 'rain' || weather === 'storm') {
            this.createRainParticles();
        } else if (weather === 'snow') {
            this.createSnowParticles();
        } else if (weather === 'fog') {
            this.createFogOverlay();
        }
    }
    
    createRainParticles() {
        const rain = this.scene.add.particles(0, 0, 'particle', {
            x: { min: 0, max: this.scene.cameras.main.width },
            y: -10,
            scale: { start: 0.3, end: 0.1 },
            alpha: { start: 0.6, end: 0 },
            tint: 0x88aaff,
            speedY: { min: 400, max: 600 },
            speedX: { min: -20, max: 20 },
            lifespan: 1000,
            frequency: 50,
            quantity: 2
        });
        rain.setScrollFactor(0);
        this.visuals.weatherContainer.add(rain);
    }
    
    createSnowParticles() {
        const snow = this.scene.add.particles(0, 0, 'particle', {
            x: { min: 0, max: this.scene.cameras.main.width },
            y: -10,
            scale: { start: 0.4, end: 0.2 },
            alpha: { start: 0.8, end: 0.3 },
            tint: 0xffffff,
            speedY: { min: 50, max: 150 },
            speedX: { min: -30, max: 30 },
            lifespan: 3000,
            frequency: 100,
            quantity: 1
        });
        snow.setScrollFactor(0);
        this.visuals.weatherContainer.add(snow);
    }
    
    createFogOverlay() {
        const fog = this.scene.add.rectangle(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xcccccc,
            0.3
        );
        fog.setScrollFactor(0);
        this.visuals.weatherContainer.add(fog);
    }
    
    updateMoonVisual() {
        const moon = this.visuals.moonSprite;
        const phase = this.realityState.moonPhase;
        
        // Position moon based on time
        const hour = this.realityState.hour;
        const x = 200 + (hour / 24) * 400; // Move across sky
        const y = 100;
        
        moon.x = x;
        moon.y = y;
        
        // Set moon visibility based on phase and time
        let visibility = 0;
        
        if (this.realityState.timeOfDay === 'night') {
            visibility = this.realityState.moonIllumination;
        } else if (phase === 'new') {
            visibility = 0;
        }
        
        moon.setAlpha(visibility * 0.8);
        
        // Change color based on phase
        if (phase === 'full') {
            moon.setFillStyle(0xfffff0); // Bright white
            moon.setRadius(35);
        } else if (phase === 'new') {
            moon.setAlpha(0);
        } else {
            moon.setFillStyle(0xeeeeee); // Slightly dim
            moon.setRadius(30);
        }
    }
    
    createRealityHUD() {
        const x = this.scene.cameras.main.width / 2;
        const y = 25;
        
        this.realityHUD = this.scene.add.container(x, y);
        this.realityHUD.setScrollFactor(0);
        this.realityHUD.setDepth(1000);
        
        // Background
        const bg = this.scene.add.rectangle(0, 0, 300, 30, 0x0a0a0f, 0.7);
        bg.setStrokeStyle(1, this.HORIZON_GOLD, 0.5);
        this.realityHUD.add(bg);
        
        // Time indicator
        this.timeText = this.scene.add.text(-130, 0, this.getTimeString(), {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: '#ffaa44'
        }).setOrigin(0, 0.5);
        this.realityHUD.add(this.timeText);
        
        // Weather icon
        this.weatherIcon = this.scene.add.text(-20, 0, this.getWeatherIcon(), {
            fontFamily: 'monospace',
            fontSize: '14px'
        }).setOrigin(0.5);
        this.realityHUD.add(this.weatherIcon);
        
        // Moon icon
        this.moonIcon = this.scene.add.text(20, 0, this.getMoonIcon(), {
            fontFamily: 'monospace',
            fontSize: '14px'
        }).setOrigin(0.5);
        this.realityHUD.add(this.moonIcon);
        
        // Season icon
        this.seasonIcon = this.scene.add.text(60, 0, this.getSeasonIcon(), {
            fontFamily: 'monospace',
            fontSize: '14px'
        }).setOrigin(0.5);
        this.realityHUD.add(this.seasonIcon);
        
        // Status text (brief condition summary)
        this.statusText = this.scene.add.text(100, 0, this.getStatusString(), {
            fontFamily: 'monospace',
            fontSize: '10px',
            fill: '#888888'
        }).setOrigin(0, 0.5);
        this.realityHUD.add(this.statusText);
        
        // Make interactive for details
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => this.showRealityDetails());
    }
    
    // ===== REALITY APPLICATION =====
    
    applyInitialManifestation() {
        this.applyTimeOfDayEffects();
        this.applyMoonPhaseEffects();
        this.applySeasonalEffects();
        this.applyWeatherEffects();
    }
    
    applyTimeOfDayEffects() {
        const time = this.realityState.timeOfDay;
        
        switch (time) {
            case 'dawn':
                this.effects.enemySpeedMod = 0.8; // Sluggish enemies
                this.effects.playerVisibilityMod = 0.9;
                this.effects.specialEvents.push('first_light_bonus');
                break;
            case 'day':
                this.effects.enemySpeedMod = 1.0;
                this.effects.enemyDamageMod = 1.0;
                this.effects.playerVisibilityMod = 1.0;
                break;
            case 'dusk':
                this.effects.enemySpeedMod = 1.15; // Frantic
                this.effects.enemyDamageMod = 1.1;
                break;
            case 'night':
                this.effects.enemySpeedMod = 1.0;
                this.effects.playerVisibilityMod = 0.85; // Reduced visibility
                this.effects.specialEvents.push('nocturnal_enemies');
                break;
        }
        
        // Apply sky overlay color
        if (this.visuals.skyOverlay) {
            const color = this.TIME_COLORS[time];
            this.visuals.skyOverlay.setFillStyle(color, 0.1);
        }
        
        // Update star visibility
        if (this.visuals.starField) {
            this.scene.tweens.add({
                targets: this.visuals.starField,
                alpha: time === 'night' ? 1 : 0,
                duration: 2000
            });
        }
    }
    
    applyMoonPhaseEffects() {
        const phase = this.realityState.moonPhase;
        
        switch (phase) {
            case 'new':
                // Stealth enhanced
                this.effects.playerVisibilityMod *= 0.9;
                break;
            case 'waxing_crescent':
            case 'waxing_gibbous':
                this.effects.echoDropRateMod = 1.1;
                break;
            case 'full':
                // Lycanthropic surge
                this.effects.enemySpeedMod *= 1.2;
                this.effects.enemyDamageMod *= 1.15;
                this.effects.echoDropRateMod = 2.0;
                this.effects.specialEvents.push('lunar_beast_possible');
                
                // Visual notification
                this.showMoonEvent('FULL MOON RISES — THE VOID HOWLS');
                break;
            case 'waning_gibbous':
            case 'waning_crescent':
                // Healing boosted
                this.effects.specialEvents.push('restorative_energy');
                break;
        }
    }
    
    applySeasonalEffects() {
        const season = this.realityState.season;
        const colors = this.SEASON_COLORS[season];
        
        // Apply color grading via camera
        this.scene.cameras.main.setBackgroundColor(
            Phaser.Display.Color.GetColor(
                colors.r * 10,
                colors.g * 10,
                colors.b * 10
            )
        );
        
        // Seasonal mechanics
        switch (season) {
            case 'spring':
                this.effects.specialEvents.push('renewal');
                break;
            case 'summer':
                this.effects.enemyAggressionMod = 1.2;
                break;
            case 'autumn':
                this.effects.echoDropRateMod *= 1.15;
                break;
            case 'winter':
                this.effects.physicsFrictionMod = 0.8; // Slippery
                this.effects.specialEvents.push('ice_physics');
                break;
        }
    }
    
    applyWeatherEffects() {
        const weather = this.realityState.weather;
        
        switch (weather) {
            case 'rain':
                this.effects.physicsFrictionMod *= 0.9;
                this.effects.specialEvents.push('electric_amplified');
                break;
            case 'storm':
                this.effects.physicsFrictionMod *= 0.85;
                this.effects.specialEvents.push('electric_amplified');
                this.effects.specialEvents.push('lightning_strikes');
                this.startLightningStrikes();
                break;
            case 'snow':
                this.effects.physicsFrictionMod *= 0.7;
                this.effects.enemySpeedMod *= 0.9;
                break;
            case 'fog':
                this.effects.playerVisibilityMod *= 0.8;
                this.effects.enemyAccuracyMod = 0.8;
                break;
        }
    }
    
    startLightningStrikes() {
        // Periodic lightning during storms
        this.scene.time.addEvent({
            delay: 8000 + Math.random() * 7000, // 8-15 seconds
            callback: () => this.triggerLightningStrike(),
            loop: true
        });
    }
    
    triggerLightningStrike() {
        // Visual flash
        this.scene.tweens.add({
            targets: this.visuals.lightningEffect,
            alpha: 0.8,
            duration: 50,
            yoyo: true,
            hold: 50
        });
        
        // Strike a random location near player
        const px = this.scene.player?.x || 960;
        const py = this.scene.player?.y || 720;
        const strikeX = px + (Math.random() - 0.5) * 400;
        const strikeY = py + (Math.random() - 0.5) * 400;
        
        // Create lightning bolt visual
        const bolt = this.scene.add.graphics();
        bolt.lineStyle(3, 0xffff00, 0.9);
        bolt.beginPath();
        bolt.moveTo(strikeX, strikeY - 200);
        
        let currentX = strikeX;
        let currentY = strikeY - 200;
        
        for (let i = 0; i < 10; i++) {
            currentX += (Math.random() - 0.5) * 40;
            currentY += 20;
            bolt.lineTo(currentX, currentY);
        }
        
        bolt.strokePath();
        
        // Damage enemies near strike
        this.scene.enemies?.getChildren().forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, strikeX, strikeY);
            if (dist < 100) {
                enemy.takeDamage?.(50);
                this.showFloatingText('⚡ SHOCKED', enemy.x, enemy.y, 0xffff00);
            }
        });
        
        // Fade out bolt
        this.scene.tweens.add({
            targets: bolt,
            alpha: 0,
            duration: 200,
            onComplete: () => bolt.destroy()
        });
        
        // Screen shake
        this.scene.cameras.main.shake(100, 0.01);
    }
    
    updateSeasonalManifestation() {
        // Called when season changes
        this.showRealityShift(`${this.realityState.season.toUpperCase()} MANIFESTS`);
    }
    
    // ===== UTILITY METHODS =====
    
    getTimeString() {
        const h = this.realityState.hour.toString().padStart(2, '0');
        const m = this.realityState.minute.toString().padStart(2, '0');
        return `${h}:${m}`;
    }
    
    getWeatherIcon() {
        const icons = {
            clear: '☀️',
            cloudy: '☁️',
            rain: '🌧️',
            storm: '⛈️',
            snow: '❄️',
            fog: '🌫️'
        };
        return icons[this.realityState.weather] || '🌤️';
    }
    
    getMoonIcon() {
        const icons = {
            new: '🌑',
            waxing_crescent: '🌒',
            first_quarter: '🌓',
            waxing_gibbous: '🌔',
            full: '🌕',
            waning_gibbous: '🌖',
            third_quarter: '🌗',
            waning_crescent: '🌘'
        };
        return icons[this.realityState.moonPhase] || '🌙';
    }
    
    getSeasonIcon() {
        const icons = {
            spring: '🌸',
            summer: '☀️',
            autumn: '🍂',
            winter: '❄️'
        };
        return icons[this.realityState.season] || '🌿';
    }
    
    getStatusString() {
        const parts = [];
        if (this.realityState.timeOfDay === 'night') parts.push('night');
        if (this.realityState.weather !== 'clear') parts.push(this.realityState.weather);
        if (this.realityState.moonPhase === 'full') parts.push('full moon');
        
        return parts.join(' | ') || 'clear';
    }
    
    showMoonEvent(text) {
        const eventText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            text,
            {
                fontFamily: 'monospace',
                fontSize: '20px',
                fontStyle: 'bold',
                fill: '#ffaa44'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        this.scene.tweens.add({
            targets: eventText,
            alpha: 0,
            y: eventText.y - 50,
            duration: 3000,
            onComplete: () => eventText.destroy()
        });
    }
    
    showRealityShift(text) {
        const shiftText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            100,
            `◈ ${text} ◈`,
            {
                fontFamily: 'monospace',
                fontSize: '18px',
                fill: '#ffaa44'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        this.scene.tweens.add({
            targets: shiftText,
            scale: 1.2,
            alpha: 0,
            duration: 2500,
            onComplete: () => shiftText.destroy()
        });
    }
    
    showFloatingText(text, x, y, color) {
        const ft = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '12px',
            fill: color ? `#${color.toString(16).padStart(6, '0')}` : '#ffffff'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: ft,
            y: y - 30,
            alpha: 0,
            duration: 1000,
            onComplete: () => ft.destroy()
        });
    }
    
    showRealityDetails() {
        // Show detailed reality panel
        const width = 400;
        const height = 300;
        const x = this.scene.cameras.main.width / 2;
        const y = this.scene.cameras.main.height / 2;
        
        const container = this.scene.add.container(x, y);
        container.setScrollFactor(0).setDepth(2000);
        
        // Background
        const bg = this.scene.add.rectangle(0, 0, width, height, 0x0a0a0f, 0.95);
        bg.setStrokeStyle(2, this.HORIZON_GOLD);
        container.add(bg);
        
        // Title
        const title = this.scene.add.text(0, -120, '◈ EXOGENESIS MANIFESTATION ◈', {
            fontFamily: 'monospace',
            fontSize: '16px',
            fontStyle: 'bold',
            fill: '#ffaa44'
        }).setOrigin(0.5);
        container.add(title);
        
        // Details
        const details = [
            `Local Time: ${this.getTimeString()} (${this.realityState.timeOfDay})`,
            `Moon: ${this.realityState.moonPhase.replace(/_/g, ' ')} (${Math.round(this.realityState.moonIllumination * 100)}% illuminated)`,
            `Season: ${this.realityState.season} (${this.realityState.hemisphere} hemisphere)`,
            `Day ${this.realityState.dayOfYear} of 365`,
            ``,
            `Active Effects:`,
            ...this.effects.specialEvents.map(e => `  • ${e.replace(/_/g, ' ')}`),
            ``,
            `Enemy Speed: ${Math.round(this.effects.enemySpeedMod * 100)}%`,
            `Echo Drops: ${Math.round(this.effects.echoDropRateMod * 100)}%`,
            `Visibility: ${Math.round(this.effects.playerVisibilityMod * 100)}%`
        ];
        
        details.forEach((line, i) => {
            const text = this.scene.add.text(0, -80 + i * 18, line, {
                fontFamily: 'monospace',
                fontSize: '11px',
                fill: line.startsWith('  •') ? '#00f0ff' : '#ffffff'
            }).setOrigin(0.5);
            container.add(text);
        });
        
        // Close button
        const closeBtn = this.scene.add.text(180, -130, '[X]', {
            fontFamily: 'monospace',
            fontSize: '14px',
            fill: '#ff4444'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => container.destroy());
        container.add(closeBtn);
        
        // Auto-close after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            if (container.active) container.destroy();
        });
    }
    
    // ===== MONITORING & UPDATES =====
    
    startMonitoring() {
        // Update every minute for time changes
        this.updateInterval = this.scene.time.addEvent({
            delay: 60000,
            callback: () => this.minuteUpdate(),
            loop: true
        });
        
        // Check for weather changes every 5 minutes (simulated)
        this.weatherCheckInterval = this.scene.time.addEvent({
            delay: 300000,
            callback: () => this.checkWeatherChange(),
            loop: true
        });
    }
    
    minuteUpdate() {
        const oldTime = this.realityState.timeOfDay;
        const oldHour = this.realityState.hour;
        
        this.calculateRealityState();
        
        // Check for time-of-day transition
        if (this.realityState.timeOfDay !== oldTime) {
            this.onTimeOfDayChange(oldTime, this.realityState.timeOfDay);
        }
        
        // Check for hour change
        if (this.realityState.hour !== oldHour) {
            this.onHourChange();
        }
        
        // Update HUD
        this.updateHUD();
    }
    
    onTimeOfDayChange(from, to) {
        this.showRealityShift(`${from.toUpperCase()} FADES → ${to.toUpperCase()} RISES`);
        this.applyTimeOfDayEffects();
        this.updateMoonVisual();
    }
    
    onHourChange() {
        // Hourly chime or effect
        if (this.realityState.hour === 0) {
            this.showRealityShift('MIDNIGHT — THE VOID DEEPENS');
        }
    }
    
    checkWeatherChange() {
        // Simulate weather changes (in a real implementation, this would fetch from API)
        const weathers = ['clear', 'cloudy', 'rain', 'storm', 'fog'];
        const currentIdx = weathers.indexOf(this.realityState.weather);
        
        // Small chance to change weather
        if (Math.random() < 0.3) {
            const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
            if (newWeather !== this.realityState.weather) {
                this.realityState.weather = newWeather;
                this.createWeatherParticles();
                this.applyWeatherEffects();
                this.updateHUD();
                
                this.showRealityShift(`WEATHER SHIFTS → ${newWeather.toUpperCase()}`);
            }
        }
    }
    
    updateHUD() {
        if (!this.realityHUD) return;
        
        this.timeText.setText(this.getTimeString());
        this.weatherIcon.setText(this.getWeatherIcon());
        this.moonIcon.setText(this.getMoonIcon());
        this.seasonIcon.setText(this.getSeasonIcon());
        this.statusText.setText(this.getStatusString());
    }
    
    // ===== PUBLIC API =====
    
    getEnemyModifiers() {
        return {
            speed: this.effects.enemySpeedMod,
            damage: this.effects.enemyDamageMod,
            aggression: this.effects.enemyAggressionMod || 1.0,
            accuracy: this.effects.enemyAccuracyMod || 1.0
        };
    }
    
    getPlayerModifiers() {
        return {
            visibility: this.effects.playerVisibilityMod,
            friction: this.effects.physicsFrictionMod
        };
    }
    
    isFullMoon() {
        return this.realityState.moonPhase === 'full';
    }
    
    isNight() {
        return this.realityState.timeOfDay === 'night';
    }
    
    getCurrentSeason() {
        return this.realityState.season;
    }
    
    // ===== PERSISTENCE =====
    
    loadPreferences() {
        try {
            const saved = localStorage.getItem('exogenesis_prefs');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.manifestation.syncMode = prefs.syncMode || 'auto';
                this.manifestation.intensity = prefs.intensity || 1.0;
                
                if (prefs.manualSettings) {
                    this.realityState.weather = prefs.manualSettings.weather || 'clear';
                }
            }
        } catch (e) {
            console.warn('Failed to load Exogenesis preferences');
        }
    }
    
    savePreferences() {
        try {
            const prefs = {
                syncMode: this.manifestation.syncMode,
                intensity: this.manifestation.intensity,
                manualSettings: {
                    weather: this.realityState.weather
                }
            };
            localStorage.setItem('exogenesis_prefs', JSON.stringify(prefs));
        } catch (e) {
            console.warn('Failed to save Exogenesis preferences');
        }
    }
    
    // ===== DESTRUCTION =====
    
    destroy() {
        this.savePreferences();
        
        if (this.updateInterval) {
            this.updateInterval.remove();
        }
        if (this.weatherCheckInterval) {
            this.weatherCheckInterval.remove();
        }
    }
    
    update() {
        // Continuous updates for smooth visual effects
        if (this.visuals.moonSprite) {
            this.updateMoonVisual();
        }
    }
}
