#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import type {
  ComponentCategory,
  PulseComponentMeta,
} from "../src/types/component";
import { SITE_CONFIG } from "../src/lib/utils";

const IGNORED_CORE_PACKAGES = new Set([
  "react",
  "react-dom",
  "react/jsx-runtime",
  "next",
]);

export function toKebabCase(input: string): string {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function inferCategory(meta: PulseComponentMeta): ComponentCategory {
  if (meta.category) return meta.category;
  const hay = `${meta.title} ${(meta.badges || []).join(" ")}`.toLowerCase();
  if (hay.includes("button")) return "Buttons";
  if (hay.includes("card")) return "Cards";
  if (hay.includes("text") || hay.includes("typography")) return "Text";
  if (hay.includes("background") || hay.includes("canvas")) return "Backgrounds";
  if (hay.includes("overlay") || hay.includes("avatar")) return "Overlays";
  return "Motion";
}

export interface AnalyzedImports {
  externalDependencies: string[];
  localFiles: {
    importSpecifier: string;
    diskPath: string;
    registryTarget: string;
    registryType: "registry:lib" | "registry:ui";
  }[];
}

export function analyzeImports(
  sourceCode: string,
  knownDeps: Set<string>
): AnalyzedImports {
  const externalDeps = new Set<string>();
  const localFilesMap = new Map<
    string,
    {
      importSpecifier: string;
      diskPath: string;
      registryTarget: string;
      registryType: "registry:lib" | "registry:ui";
    }
  >();

  const importRegex =
    /import\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(sourceCode)) !== null) {
    const specifier = match[1].trim();

    if (
      specifier === "@/lib/utils" ||
      specifier === "../../lib/utils" ||
      specifier.endsWith("/lib/utils")
    ) {
      localFilesMap.set("@/lib/utils", {
        importSpecifier: specifier,
        diskPath: "src/lib/utils.ts",
        registryTarget: "lib/utils.ts",
        registryType: "registry:lib",
      });
      if (knownDeps.has("clsx")) externalDeps.add("clsx");
      if (knownDeps.has("tailwind-merge")) externalDeps.add("tailwind-merge");
      continue;
    }

    if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      continue;
    }

    const parts = specifier.split("/");
    const pkgName = specifier.startsWith("@")
      ? `${parts[0]}/${parts[1]}`
      : parts[0];

    if (!IGNORED_CORE_PACKAGES.has(pkgName) && !pkgName.startsWith("node:")) {
      externalDeps.add(pkgName);
    }
  }

  return {
    externalDependencies: Array.from(externalDeps),
    localFiles: Array.from(localFilesMap.values()),
  };
}

export async function resolveMetaFilePath(
  uiDir: string,
  componentName: string
): Promise<string> {
  const tsPath = path.join(uiDir, `${componentName}.meta.ts`);
  try {
    await fs.access(tsPath);
    return tsPath;
  } catch {
    return path.join(uiDir, `${componentName}.meta.tsx`);
  }
}

export async function generateRegistry() {
  const rootDir = process.cwd();
  const uiDir = path.join(rootDir, "src", "components", "ui");
  const publicRDir = path.join(rootDir, "public", "r");
  const publicRegistryPath = path.join(rootDir, "public", "registry.json");
  const catalogOutputPath = path.join(
    rootDir,
    "src",
    "registry",
    "generated-catalog.tsx"
  );

  const pkgJsonRaw = await fs.readFile(
    path.join(rootDir, "package.json"),
    "utf-8"
  );
  const pkgJson = JSON.parse(pkgJsonRaw);
  const knownDeps = new Set<string>([
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {}),
  ]);

  const entries = await fs.readdir(uiDir);
  const componentFiles = entries
    .filter((file) => file.endsWith(".tsx") && !file.endsWith(".meta.tsx"))
    .sort();

  await fs.mkdir(publicRDir, { recursive: true });
  const existingRFiles = await fs.readdir(publicRDir);
  for (const oldFile of existingRFiles) {
    if (oldFile.endsWith(".json")) {
      await fs.unlink(path.join(publicRDir, oldFile));
    }
  }
  await fs.mkdir(path.dirname(catalogOutputPath), { recursive: true });

  const utilsMinimalContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

  const catalogItems: Array<Record<string, unknown>> = [];
  const registryItems: Array<Record<string, unknown>> = [];
  const demoDynamicEntries: Array<{ slug: string; componentName: string }> = [];

  for (const file of componentFiles) {
    const componentName = file.replace(/\.tsx$/, "");
    const slug = toKebabCase(componentName);
    const componentPath = path.join(uiDir, file);
    const metaPath = await resolveMetaFilePath(uiDir, componentName);

    let sourceCode = await fs.readFile(componentPath, "utf-8");
    if (!/^\s*["']use client["']/.test(sourceCode)) {
      sourceCode = `"use client";\n\n${sourceCode}`;
      await fs.writeFile(componentPath, sourceCode, "utf-8");
    }

    const metaModuleUrl = `${pathToFileURL(metaPath).href}?t=${Date.now()}`;
    const metaModule = await import(metaModuleUrl);
    const meta: PulseComponentMeta =
      metaModule.meta ||
      metaModule.default ||
      metaModule[`${componentName}Meta`];

    if (!meta || !meta.title) {
      throw new Error(
        `Invalid or missing metadata export in src/components/ui/${componentName}.meta.ts`
      );
    }

    const category = inferCategory(meta);

    const { externalDependencies, localFiles } = analyzeImports(
      sourceCode,
      knownDeps
    );

    const filesPayload = [
      {
        path: `components/ui/${slug}.tsx`,
        content: sourceCode,
        type: "registry:ui",
        target: `components/ui/${slug}.tsx`,
      },
      ...localFiles.map((lf) => ({
        path: lf.registryTarget,
        content: utilsMinimalContent,
        type: lf.registryType,
        target: lf.registryTarget,
      })),
    ];

    const shadcnItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: slug,
      type: "registry:ui",
      title: meta.title,
      author: `${SITE_CONFIG.author.name} <${SITE_CONFIG.author.portfolio}>`,
      description: meta.description,
      dependencies: externalDependencies,
      files: filesPayload,
    };

    const itemJsonPath = path.join(publicRDir, `${slug}.json`);
    await fs.writeFile(
      itemJsonPath,
      JSON.stringify(shadcnItem, null, 2) + "\n",
      "utf-8"
    );

    registryItems.push(shadcnItem);

    const cliCommand = `npx shadcn@latest add ${SITE_CONFIG.url}/r/${slug}.json`;

    catalogItems.push({
      id: slug,
      slug,
      componentName,
      filePath: `src/components/ui/${componentName}.tsx`,
      title: meta.title,
      description: meta.description,
      tagline: meta.tagline,
      category,
      badges: meta.badges || [],
      createdAt: meta.createdAt || "2026-10-07",
      featured: Boolean(meta.featured),
      keywords: meta.keywords || [],
      features: meta.features || [],
      accessibility: meta.accessibility || [],
      props: meta.props || [],
      usageCode: meta.usageCode || "",
      cliCommand,
      dependencies: externalDependencies,
      sourceCode,
    });

    demoDynamicEntries.push({ slug, componentName });
  }

  // Write root public/registry.json
  const rootRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "bose-ui",
    homepage: SITE_CONFIG.url,
    author: `${SITE_CONFIG.author.name} (${SITE_CONFIG.author.portfolio})`,
    items: registryItems,
  };
  await fs.writeFile(
    publicRegistryPath,
    JSON.stringify(rootRegistry, null, 2) + "\n",
    "utf-8"
  );

  // Generate src/registry/generated-demos.tsx ("use client" boundary for all interactive previews)
  const demosOutputPath = path.join(
    rootDir,
    "src",
    "registry",
    "generated-demos.tsx"
  );
  const demoMapLines = demoDynamicEntries
    .map(
      ({ slug, componentName }) =>
        `  "${slug}": dynamic(() => import("@/components/ui/${componentName}").then((mod: any) => createComponentDemo("${slug}", mod.default || mod.${componentName})), { ssr: false }),`
    )
    .join("\n");

  const demosFileContent = `"use client";
/* eslint-disable */
// ============================================================================
// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY!
// Generated by \`scripts/generate-registry.ts\` via \`npm run sync\`
// ============================================================================

import type React from "react";
import dynamic from "next/dynamic";
import { createComponentDemo } from "@/registry/ComponentDemoWrapper";

export const COMPONENT_DEMOS: Record<string, React.ComponentType> = {
${demoMapLines}
};
`;

  await fs.writeFile(demosOutputPath, demosFileContent, "utf-8");

  // Generate src/registry/generated-catalog.tsx (Server-safe pure catalog metadata)
  const catalogFileContent = `/* eslint-disable */
// ============================================================================
// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY!
// Generated by \`scripts/generate-registry.ts\` via \`npm run sync\`
// ============================================================================

import type { PulseComponentCatalogEntry } from "@/types/component";

export const PULSE_COMPONENTS: PulseComponentCatalogEntry[] = ${JSON.stringify(
    catalogItems,
    null,
    2
  )};

export function getCatalogComponentBySlug(
  slug: string
): PulseComponentCatalogEntry | undefined {
  const clean = decodeURIComponent(slug).replace(/\\.json$/i, "").trim();
  const lower = clean.toLowerCase();
  const compact = lower.replace(/[-_\\s]/g, "");
  return PULSE_COMPONENTS.find(
    (c) =>
      c.id === lower ||
      c.slug === lower ||
      c.componentName.toLowerCase() === lower ||
      c.slug.replace(/[-_]/g, "") === compact
  );
}
`;

  await fs.writeFile(catalogOutputPath, catalogFileContent, "utf-8");

  console.log(
    `\x1b[32m✔ Registry Generated:\x1b[0m ${catalogItems.length} components discovered in src/components/ui/`
  );
  for (const item of catalogItems) {
    console.log(
      `  ├─ \x1b[36mpublic/r/${item.slug}.json\x1b[0m (${(item.dependencies as string[]).join(", ")})`
    );
  }
  console.log(`  ├─ \x1b[36mpublic/registry.json\x1b[0m`);
  console.log(`  └─ \x1b[36msrc/registry/generated-catalog.tsx\x1b[0m\n`);
}

if (process.argv[1]?.includes("generate-registry")) {
  generateRegistry().catch((err) => {
    console.error("\x1b[31m✖ Registry Generation Failed:\x1b[0m", err);
    process.exit(1);
  });
}
