// src/utils/creatureFactory.js
import { getRandomPlantSprite } from "./spriteUtils";
import { ECOSYSTEM_SETTINGS } from "./ecosystemSettings"; // (soon, if not yet)

export function handleAddRabbit() {
  return {
    id: crypto.randomUUID(),
    type: "rabbit",
    x: Math.random() * 90,
    y: 60 + Math.random() * 35,
    dx: Math.random() * 2 - 1,
    dy: Math.random() * 2 - 1,
    energy: ECOSYSTEM_SETTINGS.initialRabbitEnergy,
    hasMated: false,
    age: 0,
    lifespan: ECOSYSTEM_SETTINGS.rabbitLifespan,
    facing: "right",
    state: "idle",
    frame: 0,
  };
}

export function handleAddFox() {
  return {
    id: crypto.randomUUID(),
    type: "fox",
    x: Math.random() * 90,
    y: 60 + Math.random() * 35,
    dx: Math.random() * 0.6 - 0.3,
    dy: Math.random() * 0.6 - 0.3,
    energy: ECOSYSTEM_SETTINGS.initialFoxEnergy,
    hasMated: false,
    age: 0,
    lifespan: ECOSYSTEM_SETTINGS.foxLifespan,
    facing: "left",
    state: "idle",
    frame: 0,
  };
}

export function handleAddPlant() {
  return {
    id: crypto.randomUUID(),
    type: "plant",
    x: Math.random() * 90,
    y: 60 + Math.random() * 35,
    sprite: getRandomPlantSprite(),
    reproductionsLeft: ECOSYSTEM_SETTINGS.plantReproductionsAllowed,
  };
}
