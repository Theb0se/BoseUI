#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import type { PulseComponentMeta } from "../src/types/component";
import { analyzeImports, toKebabCase } from "./generate-registry";

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function validateRegistry() {
  const rootDir = process.cwd();
  const uiDir = path.join(rootDir, "src", "components", "ui");
  const publicRDir = path.join(rootDir, "public", "r");

  const pkgJson = JSON.parse(
    await fs.readFile(path.join(rootDir, "package.json"), "utf-8")
  );
  const installedPackages = new Set<string>([
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {}),
  ]);

  const entries = await fs.readdir(uiDir);
  const tsxFiles = entries.filter(
    (f) => f.endsWith(".tsx") && !f.endsWith(".meta.tsx")
  );
  const metaFiles = new Set(entries.filter((f) => f.endsWith(".meta.ts")));

  const errors: string[] = [];
  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();

  if (tsxFiles.length === 0) {
    errors.push("No component .tsx files found in src/components/ui/.");
  }

  // Check for orphan .meta.ts files without a matching .tsx file
  for (const metaFile of metaFiles) {
    const baseName = metaFile.replace(/\.meta\.ts$/, ".tsx");
    if (!tsxFiles.includes(baseName)) {
      errors.push(
        `Orphan metadata file 'src/components/ui/${metaFile}' has no matching '${baseName}'.`
      );
    }
  }

  for (const file of tsxFiles) {
    const componentName = file.replace(/\.tsx$/, "");
    const slug = toKebabCase(componentName);
    const expectedMetaFile = `${componentName}.meta.ts`;

    // 1. Verify matching .meta.ts exists
    if (!metaFiles.has(expectedMetaFile)) {
      errors.push(
        `Component 'src/components/ui/${file}' is missing its required '${expectedMetaFile}'.`
      );
      continue;
    }

    // 2. Check duplicate slugs
    if (seenSlugs.has(slug)) {
      errors.push(`Duplicate component slug detected: '${slug}'.`);
    }
    seenSlugs.add(slug);

    // 3. Import .meta.ts & check duplicate titles
    const metaPath = path.join(uiDir, expectedMetaFile);
    const metaModule = await import(
      `${pathToFileURL(metaPath).href}?t=${Date.now()}`
    );
    const meta: PulseComponentMeta | undefined =
      metaModule.meta ||
      metaModule.default ||
      metaModule[`${componentName}Meta`];

    if (!meta) {
      errors.push(
        `'src/components/ui/${expectedMetaFile}' does not export a metadata object.`
      );
      continue;
    }

    const normalizedTitle = meta.title.trim().toLowerCase();
    if (seenTitles.has(normalizedTitle)) {
      errors.push(`Duplicate component title detected: '${meta.title}'.`);
    }
    seenTitles.add(normalizedTitle);

    // 4. Verify all imported npm dependencies exist in package.json
    const sourceCode = await fs.readFile(path.join(uiDir, file), "utf-8");
    const { externalDependencies } = analyzeImports(
      sourceCode,
      installedPackages
    );
    for (const dep of externalDependencies) {
      if (!installedPackages.has(dep)) {
        errors.push(
          `Component '${file}' imports '${dep}', which is not listed in package.json.`
        );
      }
    }

    // 5. Verify public/r/<slug>.json exists and has non-empty source code
    const registryJsonPath = path.join(publicRDir, `${slug}.json`);
    if (!(await fileExists(registryJsonPath))) {
      errors.push(
        `Missing generated registry file 'public/r/${slug}.json'. Run 'npm run registry:generate'.`
      );
    } else {
      const registryItem = JSON.parse(
        await fs.readFile(registryJsonPath, "utf-8")
      );
      const primaryFile = registryItem.files?.[0];
      if (
        !primaryFile ||
        typeof primaryFile.content !== "string" ||
        primaryFile.content.trim().length === 0
      ) {
        errors.push(
          `'public/r/${slug}.json' has empty or missing embedded source code.`
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("\n\x1b[31m✖ Registry Validation Failed:\x1b[0m");
    for (const err of errors) {
      console.error(`  • ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `\x1b[32m✔ Registry Validation Passed:\x1b[0m ${tsxFiles.length}/${tsxFiles.length} component pairs (.tsx + .meta.ts), dependencies, and JSON manifests verified.\n`
  );
}

if (process.argv[1]?.includes("validate-registry")) {
  validateRegistry().catch((err) => {
    console.error("\x1b[31m✖ Registry Validation Error:\x1b[0m", err);
    process.exit(1);
  });
}
