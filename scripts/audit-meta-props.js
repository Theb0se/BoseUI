const fs = require("fs");
const path = require("path");

const uiDir = path.join(process.cwd(), "src/components/ui");
const files = fs.readdirSync(uiDir);

const metas = files.filter((f) => f.endsWith(".meta.ts"));
console.log("Total meta files:", metas.length);

let emptyCount = 0;
let lowPropsCount = 0;

for (const m of metas) {
  const tsxName = m.replace(".meta.ts", ".tsx");
  const tsxPath = path.join(uiDir, tsxName);
  const metaPath = path.join(uiDir, m);

  if (!fs.existsSync(tsxPath)) {
    console.log("Missing tsx for:", m);
    continue;
  }

  const tsxContent = fs.readFileSync(tsxPath, "utf8");
  const metaContent = fs.readFileSync(metaPath, "utf8");

  // Extract Props interface from tsx
  const interfaceMatch = tsxContent.match(/export\s+(?:interface|type)\s+([A-Za-z0-9]+Props)[\s\S]*?\{([\s\S]*?)\n\}/);
  let tsxPropNames = [];
  if (interfaceMatch) {
    const lines = interfaceMatch[2].split("\n");
    for (const line of lines) {
      const propMatch = line.match(/^\s*([a-zA-Z0-9_]+)\s*\??\s*:/);
      if (propMatch && !line.trim().startsWith("//") && !line.trim().startsWith("/*")) {
        tsxPropNames.push(propMatch[1]);
      }
    }
  }

  // Extract meta props
  const propsMatch = metaContent.match(/props:\s*\[([\s\S]*?)\]\s*,/);
  let metaPropNames = [];
  if (propsMatch) {
    const matches = propsMatch[1].matchAll(/name:\s*["']([^"']+)["']/g);
    for (const match of matches) {
      metaPropNames.push(match[1]);
    }
  }

  const missingInMeta = tsxPropNames.filter((p) => !metaPropNames.includes(p) && p !== "className" && p !== "children");
  if (metaPropNames.length === 0) {
    emptyCount++;
    console.log(`[EMPTY] ${m} has 0 props in meta, but TSX has [${tsxPropNames.join(", ")}]`);
  } else if (missingInMeta.length > 0) {
    lowPropsCount++;
    console.log(`[MISSING PROPS] ${m}: TSX has [${tsxPropNames.join(", ")}] but meta is missing: [${missingInMeta.join(", ")}]`);
  }
}

console.log("\nSummary:");
console.log("Total metas with 0 props:", emptyCount);
console.log("Total metas with missing props:", lowPropsCount);
