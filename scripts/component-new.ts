#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

export function toKebabCase(input: string): string {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function toPascalCase(input: string): string {
  return toKebabCase(input)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function toTitleCase(input: string): string {
  return toKebabCase(input)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const rawName = args.find((arg) => !arg.startsWith("--"));
  const autoSync = args.includes("--sync");

  if (!rawName || !/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(rawName)) {
    console.error(
      "\x1b[31m✖ Error: Please provide a valid component name (e.g., TiltCard).\x1b[0m\n" +
        "  Usage: npm run component:new <ComponentName> [-- --sync]\n" +
        "  Example: npm run component:new TiltCard"
    );
    process.exit(1);
  }

  const pascalName = toPascalCase(rawName);
  const slug = toKebabCase(rawName);
  const titleName = toTitleCase(rawName);
  const today = new Date().toISOString().slice(0, 10);

  const rootDir = process.cwd();
  const uiDir = path.join(rootDir, "src", "components", "ui");
  const componentFilePath = path.join(uiDir, `${pascalName}.tsx`);
  const metaFilePath = path.join(uiDir, `${pascalName}.meta.ts`);

  if (
    (await fileExists(componentFilePath)) ||
    (await fileExists(metaFilePath))
  ) {
    console.error(
      `\x1b[31m✖ Error: Component '${pascalName}' already exists in src/components/ui/.\x1b[0m`
    );
    process.exit(1);
  }

  const componentSource = `"use client";

import React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ${pascalName}Props extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  /** Spring stiffness coefficient. Default: 240 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 20 */
  damping?: number;
}

export function ${pascalName}({
  children,
  className,
  stiffness = 240,
  damping = 20,
  ...props
}: ${pascalName}Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -3 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness,
        damping,
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 text-black transition-colors hover:border-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-white dark:hover:border-white",
        className
      )}
      {...props}
    >
      {children || (
        <div className="text-center">
          <div className="text-sm font-semibold">${titleName}</div>
          <p className="mt-1 text-xs text-neutral-500">
            Hover or tap this surface to test spring physics.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default ${pascalName};
`;

  const metaSource = `import type { PulseComponentMeta } from "../../types/component";

export const ${pascalName}Meta: PulseComponentMeta = {
  title: "${titleName}",
  description:
    "Interactive ${titleName} component engineered with Framer Motion spring physics, strict TypeScript, and reduced-motion accessibility.",
  tagline: "Spring-driven kinetic ${titleName.toLowerCase()} for modern React interfaces.",
  category: "Motion",
  badges: ["New", "Spring Physics", "A11y Ready"],
  createdAt: "${today}",
  featured: false,
  keywords: [
    "${slug}",
    "${titleName.toLowerCase()}",
    "framer motion",
    "react component",
    "tailwind css",
  ],
  features: [
    "Configurable Hooke's Law spring stiffness and damping coefficients.",
    "Zero runtime lock-in with full Tailwind CSS cn() class merging.",
    "Respects system prefers-reduced-motion settings out of the box.",
  ],
  accessibility: [
    "Automatically disables transform animations when prefers-reduced-motion is enabled.",
    "Forwards all standard HTML and ARIA attributes to the root element.",
  ],
  props: [
    {
      name: "stiffness",
      type: "number",
      default: "240",
      description: "Spring stiffness coefficient controlling snap responsiveness.",
    },
    {
      name: "damping",
      type: "number",
      default: "20",
      description: "Spring damping coefficient controlling oscillation decay.",
    },
  ],
  usageCode: \`import { ${pascalName} } from "@/components/ui/${slug}";

export function Example() {
  return (
    <${pascalName} stiffness={240} damping={20}>
      <p>Kinetic ${titleName}</p>
    </${pascalName}>
  );
}\`,
};

export default ${pascalName}Meta;
`;

  await fs.mkdir(uiDir, { recursive: true });
  await fs.writeFile(componentFilePath, componentSource, "utf-8");
  await fs.writeFile(metaFilePath, metaSource, "utf-8");

  console.log("\n\x1b[36m⚡ BoseUI Two-File Component Scaffolded!\x1b[0m");
  console.log(
    `  ├─ Component : \x1b[32msrc/components/ui/${pascalName}.tsx\x1b[0m`
  );
  console.log(
    `  ├─ Metadata  : \x1b[32msrc/components/ui/${pascalName}.meta.ts\x1b[0m`
  );
  console.log(`  └─ Slug      : \x1b[32m${slug}\x1b[0m\n`);

  if (autoSync) {
    console.log("\x1b[36m↻ Running npm run sync...\x1b[0m\n");
    execSync("npm run sync", { stdio: "inherit" });
  } else {
    console.log(
      "\x1b[33mNext steps:\x1b[0m\n" +
        `  1. Customize \x1b[36msrc/components/ui/${pascalName}.tsx\x1b[0m and \x1b[36msrc/components/ui/${pascalName}.meta.ts\x1b[0m\n` +
        `  2. Run \x1b[32mnpm run sync\x1b[0m to auto-generate the registry, CLI endpoints, and SEO files!\n`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
