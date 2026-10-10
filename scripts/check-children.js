const fs = require("fs");
const path = require("path");
const files = [
  "BlackHole.tsx", "PlanetHorizon.tsx", "WormholeTunnel.tsx", "AsteroidField.tsx",
  "SolarFlare.tsx", "Waterfall.tsx", "OceanWaves.tsx", "UnderwaterCaustics.tsx",
  "WaterRipples.tsx", "LavaLamp.tsx", "Fireflies.tsx", "Thunderstorm.tsx",
  "FallingPetals.tsx", "AtmosphericFog.tsx", "VolcanoEmbers.tsx", "MatrixRain.tsx",
  "DigitalRadar.tsx", "ConstellationMap.tsx", "IsometricCity.tsx"
];

for (const f of files) {
  const p = path.join("src/components/ui", f);
  const text = fs.readFileSync(p, "utf8");
  const hasChildrenTernary = text.includes("children ?");
  console.log(f, "has children ? :", hasChildrenTernary);
}
