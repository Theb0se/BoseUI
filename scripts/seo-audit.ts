#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import type { PulseComponentMeta } from "../src/types/component";
import { toKebabCase } from "./generate-registry";

export async function runSeoAudit() {
  const rootDir = process.cwd();
  const uiDir = path.join(rootDir, "src", "components", "ui");
  const publicDir = path.join(rootDir, "public");

  const entries = await fs.readdir(uiDir);
  const tsxFiles = entries
    .filter((f) => f.endsWith(".tsx") && !f.endsWith(".meta.tsx"))
    .sort();

  const sitemapContent = await fs
    .readFile(path.join(publicDir, "sitemap.xml"), "utf-8")
    .catch(() => "");
  const llmsContent = await fs
    .readFile(path.join(publicDir, "llms.txt"), "utf-8")
    .catch(() => "");

  const issues: string[] = [];
  const componentReportRows: Array<{
    slug: string;
    title: string;
    descLen: number;
    propsCount: number;
    a11yCount: number;
    inSitemap: boolean;
    inLlms: boolean;
  }> = [];

  for (const file of tsxFiles) {
    const componentName = file.replace(/\.tsx$/, "");
    const slug = toKebabCase(componentName);
    const metaPath = path.join(uiDir, `${componentName}.meta.ts`);
    const metaModule = await import(
      `${pathToFileURL(metaPath).href}?t=${Date.now()}`
    );
    const meta: PulseComponentMeta =
      metaModule.meta ||
      metaModule.default ||
      metaModule[`${componentName}Meta`];

    // 1. Check title length (3 to 60 chars)
    const titleLen = (meta.title || "").trim().length;
    if (titleLen < 3 || titleLen > 60) {
      issues.push(
        `[${slug}] Title length (${titleLen} chars) should be between 3 and 60 characters.`
      );
    }

    // 2. Check description length (40 to 320 chars)
    const descLen = (meta.description || "").trim().length;
    if (descLen < 40 || descLen > 320) {
      issues.push(
        `[${slug}] Description length (${descLen} chars) must be between 40 and 320 characters.`
      );
    }

    // 3. Check props documentation
    if (!Array.isArray(meta.props) || meta.props.length === 0) {
      issues.push(`[${slug}] Props documentation array must not be empty.`);
    } else {
      for (const prop of meta.props) {
        if (!prop.description || prop.description.trim().length < 5) {
          issues.push(
            `[${slug}] Prop '${prop.name}' must have a meaningful description (>= 5 chars).`
          );
        }
      }
    }

    // 4. Check accessibility notes
    if (!Array.isArray(meta.accessibility) || meta.accessibility.length === 0) {
      issues.push(`[${slug}] Accessibility notes array must not be empty.`);
    }

    // 5. Check sitemap.xml and llms.txt presence
    const inSitemap = sitemapContent.includes(`/components/${slug}</loc>`);
    const inLlms = llmsContent.includes(`/r/${slug}.json`);

    if (!inSitemap) {
      issues.push(`[${slug}] Missing entry in public/sitemap.xml.`);
    }
    if (!inLlms) {
      issues.push(`[${slug}] Missing entry in public/llms.txt.`);
    }

    componentReportRows.push({
      slug,
      title: meta.title,
      descLen,
      propsCount: meta.props?.length || 0,
      a11yCount: meta.accessibility?.length || 0,
      inSitemap,
      inLlms,
    });
  }

  const score = Math.max(0, 100 - issues.length * 10);

  console.log(
    "\x1b[36m┌──────────────────────────────────────────────────────────────────────────┐\x1b[0m"
  );
  console.log(
    "\x1b[36m│                    ⚡ BOSEUI AUTOMATED SEO SCORECARD                     │\x1b[0m"
  );
  console.log(
    "\x1b[36m├──────────────────────┬──────────┬───────┬──────┬──────────┬──────────────┤\x1b[0m"
  );
  console.log(
    "\x1b[36m│ Component Slug       │ Desc Len │ Props │ A11y │ Sitemap  │ llms.txt     │\x1b[0m"
  );
  console.log(
    "\x1b[36m├──────────────────────┼──────────┼───────┼──────┼──────────┼──────────────┤\x1b[0m"
  );

  for (const row of componentReportRows) {
    const slugCol = row.slug.padEnd(20, " ");
    const descCol = `${row.descLen} ch`.padEnd(8, " ");
    const propsCol = `${row.propsCount}`.padEnd(5, " ");
    const a11yCol = `${row.a11yCount}`.padEnd(4, " ");
    const sitemapCol = (row.inSitemap ? "✔ PASS" : "✖ FAIL").padEnd(8, " ");
    const llmsCol = (row.inLlms ? "✔ PASS" : "✖ FAIL").padEnd(12, " ");
    console.log(
      `│ ${slugCol} │ ${descCol} │ ${propsCol} │ ${a11yCol} │ \x1b[32m${sitemapCol}\x1b[0m │ \x1b[32m${llmsCol}\x1b[0m │`
    );
  }

  console.log(
    "\x1b[36m└──────────────────────┴──────────┴───────┴──────┴──────────┴──────────────┘\x1b[0m"
  );

  if (issues.length > 0) {
    console.error(
      `\n\x1b[31m✖ SEO Audit Failed (${score}/100 SEO Health Score):\x1b[0m`
    );
    for (const issue of issues) {
      console.error(`  • ${issue}`);
    }
    process.exit(1);
  }

  console.log(
    `\x1b[32m★ ${score}/100 SEO Health Score — All metadata, JSON-LD prerequisites, Sitemap & LLM Index verified!\x1b[0m\n`
  );
}

if (process.argv[1]?.includes("seo-audit")) {
  runSeoAudit().catch((err) => {
    console.error("\x1b[31m✖ SEO Audit Error:\x1b[0m", err);
    process.exit(1);
  });
}
