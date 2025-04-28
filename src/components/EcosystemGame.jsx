import React, { useState, useEffect, useRef } from "react";
import { ECOSYSTEM_SETTINGS } from "../utils/ecosystemSettings";
import { plantSprites, getRandomPlantSprite } from "../utils/spriteUtils";
import {
  handleAddRabbit,
  handleAddFox,
  handleAddPlant,
} from "../utils/creatureFactory.js";
import "../styles/ecosystemGame.css";

export default function EcosystemGame({ onExit }) {
  const [isRunning, setIsRunning] = useState(false);
  const [creatures, setCreatures] = useState([]);
  const intervalRef = useRef(null);

  function handleStart() {
    if (!isRunning) {
      setIsRunning(true);
    }
  }

  function handleReset() {
    setIsRunning(false);
    setCreatures([]);
    clearInterval(intervalRef.current);
  }

  function addCreatures(creatureGenerator, count = 1) {
    setCreatures((prev) => [
      ...prev,
      ...Array.from({ length: count }, () => creatureGenerator()),
    ]);
  }

  // Simulation loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCreatures((prevCreatures) => {
          const newCreatures = [];

          for (const c of prevCreatures) {
            if (c.type === "rabbit" || c.type === "fox") {
              let newX = c.x + c.dx;
              let newY = c.y + c.dy;

              // Determine facing direction and walking state
              let newFacing = c.facing;
              let newState = "idle";

              if (Math.abs(c.dx) > 0.2 || Math.abs(c.dy) > 0.2) {
                newState = "walking";
                if (c.dx < 0) {
                  newFacing = "left";
                } else if (c.dx > 0) {
                  newFacing = "right";
                }
              }

              // Horizontal bounce
              if (newX < 0 || newX > 95) {
                c.dx = -c.dx;
                newX = Math.max(0, Math.min(95, newX));
              }

              // Vertical ground bounce
              if (newY < 60 || newY > 90) {
                c.dy = -c.dy;
                newY = Math.max(60, Math.min(90, newY));
              }

              const newEnergy = c.energy - 1;
              const newAge = (c.age ?? 0) + 1; // Default to 0 if undefined

              // Death by starvation or old age
              if (
                newEnergy <= 0 ||
                (c.lifespan !== undefined && newAge > c.lifespan)
              ) {
                continue; // Creature dies
              }

              newCreatures.push({
                ...c,
                x: newX,
                y: newY,
                dx: c.dx,
                dy: c.dy,
                energy: newEnergy,
                age: newAge,
                frame: (c.frame ?? 0) + 1,
                facing: newFacing,
                state: newState,
              });
            } else {
              newCreatures.push(c); // Plants stay static
            }
          }

          const rabbits = newCreatures.filter((c) => c.type === "rabbit");
          const foxes = newCreatures.filter((c) => c.type === "fox");
          const plants = newCreatures.filter((c) => c.type === "plant");

          // RABBIT MOVEMENT LOGIC
          const updatedRabbits = rabbits.map((rabbit) => {
            let threat = null;
            let target = null;

            // Check for nearby foxes first
            let minThreatDist = Infinity;
            for (const fox of foxes) {
              const dist = Math.hypot(rabbit.x - fox.x, rabbit.y - fox.y);
              if (dist < minThreatDist) {
                minThreatDist = dist;
                threat = fox;
              }
            }

            if (
              threat &&
              minThreatDist < ECOSYSTEM_SETTINGS.rabbitThreatDistance
            ) {
              const escapeAngle = Math.atan2(
                rabbit.y - threat.y,
                rabbit.x - threat.x
              );
              const randomOffset = (Math.random() - 0.5) * (Math.PI / 12);
              const angle = escapeAngle + randomOffset;

              rabbit.dx = Math.cos(angle) * ECOSYSTEM_SETTINGS.rabbitFleeSpeed;
              rabbit.dy = Math.sin(angle) * ECOSYSTEM_SETTINGS.rabbitFleeSpeed;
              rabbit.beingChased = true;
            } else {
              rabbit.beingChased = false;

              if (rabbit.energy < 200) {
                let minDist = Infinity;
                for (const plant of plants) {
                  const dist = Math.hypot(
                    rabbit.x - plant.x,
                    rabbit.y - plant.y
                  );
                  if (dist < minDist) {
                    minDist = dist;
                    target = plant;
                  }
                }

                if (target) {
                  const angle = Math.atan2(
                    target.y - rabbit.y,
                    target.x - rabbit.x
                  );
                  rabbit.dx =
                    Math.cos(angle) * ECOSYSTEM_SETTINGS.rabbitSeekFoodSpeed;
                  rabbit.dy =
                    Math.sin(angle) * ECOSYSTEM_SETTINGS.rabbitSeekFoodSpeed;
                } else {
                  // No target, slight drifting if you want (optional)
                  rabbit.dx *= ECOSYSTEM_SETTINGS.rabbitIdleDamping;
                  rabbit.dy *= ECOSYSTEM_SETTINGS.rabbitIdleDamping;
                }
              } else if (
                !rabbit.hasMated &&
                rabbit.age >= ECOSYSTEM_SETTINGS.rabbitReproductionAgeMin &&
                rabbit.age < ECOSYSTEM_SETTINGS.rabbitReproductionAgeMax
              ) {
                // Seek mate
                let minDist = Infinity;
                for (const otherRabbit of rabbits) {
                  if (
                    otherRabbit.id !== rabbit.id &&
                    !otherRabbit.hasMated &&
                    otherRabbit.age >=
                      ECOSYSTEM_SETTINGS.rabbitReproductionAgeMin &&
                    otherRabbit.age <
                      ECOSYSTEM_SETTINGS.rabbitReproductionAgeMax
                  ) {
                    const dist = Math.hypot(
                      rabbit.x - otherRabbit.x,
                      rabbit.y - otherRabbit.y
                    );
                    if (dist < minDist) {
                      minDist = dist;
                      target = otherRabbit;
                    }
                  }
                }

                if (target) {
                  const angle = Math.atan2(
                    target.y - rabbit.y,
                    target.x - rabbit.x
                  );
                  rabbit.dx =
                    Math.cos(angle) * ECOSYSTEM_SETTINGS.rabbitSeekMateSpeed;
                  rabbit.dy =
                    Math.sin(angle) * ECOSYSTEM_SETTINGS.rabbitSeekMateSpeed;
                } else {
                  rabbit.dx *= ECOSYSTEM_SETTINGS.rabbitIdleDamping;
                  rabbit.dy *= ECOSYSTEM_SETTINGS.rabbitIdleDamping;
                }
              } else {
                rabbit.dx *= ECOSYSTEM_SETTINGS.rabbitIdleDamping;
                rabbit.dy *= ECOSYSTEM_SETTINGS.rabbitIdleDamping;
              }
            }

            return rabbit;
          });

          // Fox action logic
          const updatedFoxes = foxes.map((fox) => {
            let targetRabbit = null;
            let minDist = Infinity;

            for (const rabbit of updatedRabbits) {
              const dist = Math.hypot(fox.x - rabbit.x, fox.y - rabbit.y);
              if (dist < minDist) {
                minDist = dist;
                targetRabbit = rabbit;
              }
            }

            if (
              targetRabbit &&
              minDist < ECOSYSTEM_SETTINGS.foxHuntRange &&
              fox.energy < ECOSYSTEM_SETTINGS.foxHuntEnergyThreshold
            ) {
              const angle = Math.atan2(
                targetRabbit.y - fox.y,
                targetRabbit.x - fox.x
              );

              let speed = ECOSYSTEM_SETTINGS.foxSpeedDefault;
              if (fox.energy > 480) speed = ECOSYSTEM_SETTINGS.foxSpeedWhenFull;
              if (fox.energy < 40)
                speed = ECOSYSTEM_SETTINGS.foxSpeedWhenStarving;

              fox.dx = Math.cos(angle) * speed;
              fox.dy = Math.sin(angle) * speed;

              if (minDist < ECOSYSTEM_SETTINGS.foxEatDistance) {
                // Fox eats rabbit, regains full energy
                fox.energy = ECOSYSTEM_SETTINGS.initialFoxEnergy;
                updatedRabbits.splice(updatedRabbits.indexOf(targetRabbit), 1);
              }
            } else {
              fox.dx *= ECOSYSTEM_SETTINGS.foxIdleDamping;
              fox.dy *= ECOSYSTEM_SETTINGS.foxIdleDamping;
            }

            const newEnergy = fox.energy - 1;
            const newAge = (fox.age ?? 0) + 1;

            if (
              newEnergy <= 0 ||
              (fox.lifespan !== undefined && newAge > fox.lifespan)
            ) {
              return null;
            }

            return {
              ...fox,
              x: fox.x + fox.dx,
              y: fox.y + fox.dy,
              dx: fox.dx,
              dy: fox.dy,
              energy: newEnergy,
              age: newAge,
            };
          });

          const filteredUpdatedFoxes = updatedFoxes.filter((f) => f !== null);

          // REPRODUCTION SECTION
          const newPlants = [];

          for (const plant of plants) {
            if (
              plant.reproductionsLeft > 0 &&
              Math.random() < ECOSYSTEM_SETTINGS.plantSpreadChance
            ) {
              // Check how many plants are nearby
              let nearbyPlants = 0;
              for (const otherPlant of plants) {
                if (plant.id !== otherPlant.id) {
                  const dist = Math.hypot(
                    plant.x - otherPlant.x,
                    plant.y - otherPlant.y
                  );
                  if (dist < ECOSYSTEM_SETTINGS.plantNearbyDistance) {
                    nearbyPlants++;
                  }
                }
              }

              if (nearbyPlants < ECOSYSTEM_SETTINGS.maxNearbyPlants) {
                const offsetX =
                  Math.random() * ECOSYSTEM_SETTINGS.plantSpawnRandomness -
                  ECOSYSTEM_SETTINGS.plantSpawnRandomness / 2;
                const offsetY =
                  Math.random() * ECOSYSTEM_SETTINGS.plantSpawnRandomness -
                  ECOSYSTEM_SETTINGS.plantSpawnRandomness / 2;
                const newX = Math.max(0, Math.min(95, plant.x + offsetX));
                const newY = Math.max(60, Math.min(90, plant.y + offsetY));
                console.log(
                  "🌱 New plant sprouted at:",
                  newX.toFixed(2),
                  newY.toFixed(2)
                );
                newPlants.push({
                  id: crypto.randomUUID(),
                  type: "plant",
                  x: newX,
                  y: newY,
                  sprite: getRandomPlantSprite(),
                  reproductionsLeft:
                    ECOSYSTEM_SETTINGS.plantReproductionsAllowed,
                });

                plant.reproductionsLeft -= 1;
              }
            }
          }

          // RABBIT REPRODUCTION
          const newBabies = [];
          const plantsEaten = new Set();

          for (const rabbit of updatedRabbits) {
            // Eating plants if hungry
            if (rabbit.energy < ECOSYSTEM_SETTINGS.rabbitEnergyToEat) {
              for (const plant of plants) {
                const dist = Math.hypot(rabbit.x - plant.x, rabbit.y - plant.y);
                if (dist < ECOSYSTEM_SETTINGS.rabbitEatDistance) {
                  rabbit.energy = Math.min(
                    ECOSYSTEM_SETTINGS.rabbitMaxEnergy,
                    rabbit.energy + ECOSYSTEM_SETTINGS.rabbitEnergyGainFromPlant
                  );
                  console.log(
                    "🐇 Rabbit ate a plant at:",
                    plant.x.toFixed(2),
                    plant.y.toFixed(2)
                  );

                  plantsEaten.add(plant.id);
                  break;
                }
              }
            }
            // Reproducing with nearby rabbits
            if (!rabbit.hasMated) {
              for (const otherRabbit of updatedRabbits) {
                if (
                  rabbit.id !== otherRabbit.id &&
                  !rabbit.hasMated &&
                  !otherRabbit.hasMated &&
                  rabbit.energy > 25 &&
                  otherRabbit.energy > 25 &&
                  rabbit.age >= ECOSYSTEM_SETTINGS.rabbitReproductionAgeMin &&
                  otherRabbit.age >= ECOSYSTEM_SETTINGS.rabbitReproductionAgeMin
                ) {
                  const dist = Math.hypot(
                    rabbit.x - otherRabbit.x,
                    rabbit.y - otherRabbit.y
                  );
                  if (dist < ECOSYSTEM_SETTINGS.rabbitMateDistance) {
                    // Spawn 3 babies
                    for (
                      let i = 0;
                      i < ECOSYSTEM_SETTINGS.rabbitBabiesPerPair;
                      i++
                    ) {
                      const offsetX =
                        Math.random() * ECOSYSTEM_SETTINGS.babySpawnRandomness -
                        ECOSYSTEM_SETTINGS.babySpawnRandomness / 2;
                      const offsetY =
                        Math.random() * ECOSYSTEM_SETTINGS.babySpawnRandomness -
                        ECOSYSTEM_SETTINGS.babySpawnRandomness / 2;
                      const babyX = Math.max(
                        0,
                        Math.min(95, rabbit.x + offsetX)
                      );
                      const babyY = Math.max(
                        60,
                        Math.min(95, rabbit.y + offsetY)
                      );
                      newBabies.push({
                        id: crypto.randomUUID(),
                        type: "rabbit",
                        x: babyX,
                        y: babyY,
                        dx: Math.random() * 2 - 1,
                        dy: Math.random() * 2 - 1,
                        energy: ECOSYSTEM_SETTINGS.initialRabbitEnergy,
                        hasMated: false,
                        age: 0,
                        lifespan: ECOSYSTEM_SETTINGS.rabbitLifespan,
                      });
                    }
                    rabbit.hasMated = true;
                    otherRabbit.hasMated = true;
                    break;
                  }
                }
              }
            }
          }
          // FOX REPRODUCTION
          const newFoxBabies = [];

          for (const fox of filteredUpdatedFoxes) {
            if (
              !fox.hasMated &&
              fox.age >=
                fox.lifespan - ECOSYSTEM_SETTINGS.foxReproductionAgeThreshold
            ) {
              // Only if old and unmated
              for (const otherFox of filteredUpdatedFoxes) {
                if (
                  fox.id !== otherFox.id &&
                  !otherFox.hasMated &&
                  otherFox.age >=
                    otherFox.lifespan -
                      ECOSYSTEM_SETTINGS.foxReproductionAgeThreshold
                ) {
                  const dist = Math.hypot(
                    fox.x - otherFox.x,
                    fox.y - otherFox.y
                  );
                  if (dist < ECOSYSTEM_SETTINGS.foxMateDistance) {
                    // Close enough to mate
                    for (
                      let i = 0;
                      i < ECOSYSTEM_SETTINGS.foxBabiesPerPair;
                      i++
                    ) {
                      const offsetX =
                        Math.random() * ECOSYSTEM_SETTINGS.babySpawnRandomness -
                        ECOSYSTEM_SETTINGS.babySpawnRandomness / 2;
                      const offsetY =
                        Math.random() * ECOSYSTEM_SETTINGS.babySpawnRandomness -
                        ECOSYSTEM_SETTINGS.babySpawnRandomness / 2;
                      const babyX = Math.max(0, Math.min(95, fox.x + offsetX));
                      const babyY = Math.max(60, Math.min(95, fox.y + offsetY));
                      newFoxBabies.push({
                        id: crypto.randomUUID(),
                        type: "fox",
                        x: babyX,
                        y: babyY,
                        dx: Math.random() * 0.6 - 0.3,
                        dy: Math.random() * 0.6 - 0.3,
                        energy: ECOSYSTEM_SETTINGS.initialFoxEnergy,
                        hasMated: false,
                        age: 0,
                        lifespan: ECOSYSTEM_SETTINGS.foxLifespan,
                        facing: "left",
                        state: "idle",
                        frame: 0,
                      });
                    }
                    fox.hasMated = true;
                    otherFox.hasMated = true;
                    break; // Stop looking after finding a mate
                  }
                }
              }
            }
          }

          const survivingPlants = plants.filter((p) => !plantsEaten.has(p.id));
          return [
            ...filteredUpdatedFoxes,
            ...updatedRabbits,
            ...survivingPlants,
            ...newPlants,
            ...newBabies,
            ...newFoxBabies,
          ];
        });
      }, ECOSYSTEM_SETTINGS.tickDelay);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  function getCreatureSprite(creature) {
    if (creature.type === "rabbit") {
      if (creature.state === "idle") return "/assets/sprites/rabbit/idle.png";
      if (creature.state === "walking") {
        if (creature.frame % 8 === 0)
          return "/assets/sprites/rabbit/walk_right_1.png";
        if (creature.frame % 8 === 1)
          return "/assets/sprites/rabbit/walk_right_2.png";
        if (creature.frame % 8 === 2)
          return "/assets/sprites/rabbit/walk_right_3.png";
        if (creature.frame % 8 === 3)
          return "/assets/sprites/rabbit/walk_right_4.png";
        if (creature.frame % 8 === 4)
          return "/assets/sprites/rabbit/walk_right_5.png";
        if (creature.frame % 8 === 5)
          return "/assets/sprites/rabbit/walk_right_6.png";
        if (creature.frame % 8 === 6)
          return "/assets/sprites/rabbit/walk_right_7.png";
        if (creature.frame % 8 === 7)
          return "/assets/sprites/rabbit/walk_right_8.png";
      }
    }

    if (creature.type === "fox") {
      if (creature.state === "idle") return "/assets/sprites/fox/idle.png";

      if (creature.state === "walking") {
        if (creature.frame % 4 === 0)
          return "/assets/sprites/fox/walk_right_1.png";
        if (creature.frame % 4 === 1)
          return "/assets/sprites/fox/walk_right_2.png";
        if (creature.frame % 4 === 2)
          return "/assets/sprites/fox/walk_right_3.png";
        if (creature.frame % 4 === 3)
          return "/assets/sprites/fox/walk_right_4.png";
      }
    }

    return null;
  }

  return (
    <div className="ecosystem-container">
      <h2 className="ecosystem-title">Foxes and Rabbits</h2>
      <div className="ecosystem-world">
        {creatures.map((creature) => (
          <div
            key={creature.id}
            className={
              creature.type === "plant"
                ? "plant-container"
                : `creature ${creature.type}`
            }
            style={{
              left: `${creature.x}%`,
              top: `${creature.y}%`,
              zIndex:
                creature.type === "plant"
                  ? 1
                  : creature.type === "rabbit"
                  ? 2
                  : 3,
              ...(creature.type !== "plant" && {
                transform: `
          ${creature.facing === "left" ? "scaleX(-1)" : "scaleX(1)"}
          ${creature.type === "rabbit" ? "scale(0.6)" : "scale(1.4, 1.2)"}
        `,
                transformOrigin: "center",
              }),
            }}
          >
            {creature.type === "rabbit" || creature.type === "fox" ? (
              <img
                src={getCreatureSprite(creature)}
                alt={creature.type}
                className="creature-sprite"
              />
            ) : (
              <img src={creature.sprite} alt="Plant" className="plant-sprite" />
            )}
          </div>
        ))}
      </div>
      <div className="ecosystem-controls">
        <button onClick={handleStart}>Start</button>
        <button onClick={handleReset}>Reset</button>
        <button
          onClick={() =>
            addCreatures(handleAddPlant, ECOSYSTEM_SETTINGS.plantBatchOnButton)
          }
        >
          Add Plants({ECOSYSTEM_SETTINGS.plantBatchOnButton})
        </button>
        <button onClick={() => addCreatures(handleAddRabbit)}>
          Add Rabbit
        </button>
        <button onClick={() => addCreatures(handleAddFox)}>Add Fox</button>
        <button onClick={onExit}>Quit</button>
      </div>
    </div>
  );
}
