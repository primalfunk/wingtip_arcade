export const ECOSYSTEM_SETTINGS = {
    // General Simulation Timing
    tickDelay: 250, // Milliseconds between each simulation tick
  
    // Rabbit Settings
    initialRabbitEnergy: 300,        // Starting energy for a rabbit
    rabbitBabiesPerPair: 3,          // Number of baby rabbits born per mating
    rabbitEatDistance: 5,            // Distance within which a rabbit can eat a plant
    rabbitEnergyGainFromPlant: 200,  // Energy gained from eating a plant
    rabbitEnergyToEat: 250,          // If energy falls below this, rabbit searches for food
    rabbitFleeSpeed: 0.4,           // Speed when fleeing from a fox
    rabbitIdleDamping: 1,            // Damping when idle (1 = no slowing down)
    rabbitLifespan: 300,             // Maximum age (in ticks) before a rabbit dies
    rabbitMateDistance: 5,           // Distance within which rabbits can mate
    rabbitMaxEnergy: 300,            // Maximum energy a rabbit can have
    rabbitPostMateDamping: 0.9,      // Damping after mating (slow down factor)
    rabbitReproductionAgeMin: 100,   // Minimum age to start mating
    rabbitReproductionAgeMax: 250,   // Maximum age to mate
    rabbitSeekFoodSpeed: 0.5,        // Speed when seeking food
    rabbitSeekMateSpeed: 0.6,        // Speed when seeking a mate
    rabbitThreatDistance: 25,        // Distance to detect nearby fox threats
  
    // Fox Settings
    initialFoxEnergy: 600,           // Starting energy for a fox
    foxBabiesPerPair: 2,             // Number of baby foxes born per mating
    foxEatDistance: 5,               // Distance within which a fox can eat a rabbit
    foxHuntEnergyThreshold: 300,     // Foxes only hunt if below this energy
    foxHuntRange: 30,                // Distance within which a fox detects prey
    foxIdleDamping: 1,               // Damping when idle (1 = no slowing down)
    foxLifespan: 600,               // Maximum age (in ticks) before a fox dies
    foxMateDistance: 8,              // Distance within which foxes can mate
    foxReproductionAgeThreshold: 100,// Final ticks of life during which foxes can mate
    foxSpeedDefault: 0.3,           // Default movement speed
    foxSpeedWhenFull: 0.2,           // Movement speed when well-fed
    foxSpeedWhenStarving: 0.6,       // Movement speed when starving
  
    // Plant Settings
    plantBatchOnButton: 10,          // Number of plants added when "Add Plants" is clicked
    plantNearbyDistance: 15,         // Max distance considered "nearby" for reproduction crowding
    plantReproductionsAllowed: 2,    // How many times a single plant can reproduce
    plantSpawnRandomness: 10,        // Random placement spread for new plants
    plantSpreadChance: 0.05,         // Chance per tick that a plant reproduces
    maxNearbyPlants: 3,              // Max nearby plants allowed before reproduction stops
  
    // Baby Spawning Settings
    babySpawnRandomness: 10,         // Random spread when placing baby rabbits and foxes
  };  