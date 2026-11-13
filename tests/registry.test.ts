import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Registry & Schema Integrity", () => {
  const uiDir = path.resolve(__dirname, "../src/components/ui");
  const rDir = path.resolve(__dirname, "../public/r");
  const registryJsonPath = path.resolve(__dirname, "../public/registry.json");

  it("ensures every UI component has a matching .meta.ts companion", () => {
    const files = fs.readdirSync(uiDir);
    const tsxFiles = files.filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"));
    const metaFiles = new Set(files.filter((f) => f.endsWith(".meta.ts")));

    expect(tsxFiles.length).toBeGreaterThan(0);

    for (const tsx of tsxFiles) {
      const base = tsx.replace(/\.tsx$/, "");
      const expectedMeta = `${base}.meta.ts`;
      expect(metaFiles.has(expectedMeta), `Missing companion meta for ${tsx}`).toBe(true);
    }
  });

  it("verifies public/registry.json exists and is valid", () => {
    expect(fs.existsSync(registryJsonPath)).toBe(true);
    const raw = fs.readFileSync(registryJsonPath, "utf-8");
    const json = JSON.parse(raw);
    expect(json).toBeDefined();
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBe(104);
  });

  it("ensures all public/r/*.json manifests exist and are valid JSON", () => {
    const rFiles = fs.readdirSync(rDir).filter((f) => f.endsWith(".json"));
    expect(rFiles.length).toBe(104);

    for (const file of rFiles) {
      const content = fs.readFileSync(path.join(rDir, file), "utf-8");
      const parsed = JSON.parse(content);
      expect(parsed.name).toBeDefined();
      expect(parsed.type).toBe("registry:ui");
      expect(Array.isArray(parsed.files)).toBe(true);
    }
  });
});
