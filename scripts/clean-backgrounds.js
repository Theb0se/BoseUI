const fs = require("fs");
const path = require("path");

const uiDir = path.join(process.cwd(), "src/components/ui");

const files = [
  "BlackHole.tsx",
  "PlanetHorizon.tsx",
  "WormholeTunnel.tsx",
  "AsteroidField.tsx",
  "SolarFlare.tsx",
  "Waterfall.tsx",
  "OceanWaves.tsx",
  "UnderwaterCaustics.tsx",
  "WaterRipples.tsx",
  "LavaLamp.tsx",
  "Fireflies.tsx",
  "Thunderstorm.tsx",
  "FallingPetals.tsx",
  "AtmosphericFog.tsx",
  "VolcanoEmbers.tsx",
  "MatrixRain.tsx",
  "DigitalRadar.tsx",
  "ConstellationMap.tsx",
  "IsometricCity.tsx",
];

for (const filename of files) {
  const filePath = path.join(uiDir, filename);
  let code = fs.readFileSync(filePath, "utf8");

  // Replace children ? ( ... ) : ( ... )
  // We locate "{children ?" and find the closing bracket
  const childIdx = code.indexOf("{children ?");
  if (childIdx !== -1) {
    // Find the end before `</div>\n  );\n}`
    const endIdx = code.lastIndexOf("</div>\n  );");
    if (endIdx > childIdx) {
      const partBefore = code.substring(0, childIdx);
      const partAfter = code.substring(endIdx);
      code = partBefore + `{children && (
        <div className="relative z-10 flex min-h-[520px] w-full flex-col">
          {children}
        </div>
      )}` + "\n    " + partAfter;
    }
  }

  // Remove showControls state
  code = code.replace(/const \[showControls, setShowControls\] = useState\(false\);\s*/g, "");
  // Remove handleReset
  code = code.replace(/const handleReset = \(\) => \{[\s\S]*?\};\s*/g, "");

  fs.writeFileSync(filePath, code);
  console.log("Processed:", filename);
}
