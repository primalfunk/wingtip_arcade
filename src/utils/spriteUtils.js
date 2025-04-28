// src/utils/spriteUtils.js

// Load all available plant sprites
export const plantSprites = Array.from(
    { length: 25 },
    (_, i) => `/assets/sprites/plants/plants${i + 1}.png`
  );
  
  // Copy of the sprites list that we mutate
  let availablePlantSprites = [...plantSprites];
  
  // Get a random plant sprite (without immediate repetition)
  export function getRandomPlantSprite() {
    if (availablePlantSprites.length === 0) {
      availablePlantSprites = [...plantSprites];
    }
    const index = Math.floor(Math.random() * availablePlantSprites.length);
    return availablePlantSprites.splice(index, 1)[0];
  }
  