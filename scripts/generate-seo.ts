#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import type { PulseComponentMeta } from "../src/types/component";
import { SITE_CONFIG } from "../src/lib/utils";
import { resolveMetaFilePath, toKebabCase } from "./generate-registry";

export async function generateSeo() {
  const rootDir = process.cwd();
  const uiDir = path.join(rootDir, "src", "components", "ui");
  const publicDir = path.join(rootDir, "public");

  await fs.mkdir(publicDir, { recursive: true });

  const entries = await fs.readdir(uiDir);
  const componentFiles = entries
    .filter((f) => f.endsWith(".tsx") && !f.endsWith(".meta.ts"))
    .sort();

  const discovered: Array<{
    slug: string;
    componentName: string;
    meta: PulseComponentMeta;
  }> = [];

  for (const file of componentFiles) {
    const componentName = file.replace(/\.tsx$/, "");
    const slug = toKebabCase(componentName);
    const metaPath = await resolveMetaFilePath(uiDir, componentName);
    const metaModule = await import(
      `${pathToFileURL(metaPath).href}?t=${Date.now()}`
    );
    const meta: PulseComponentMeta =
      metaModule.meta ||
      metaModule.default ||
      metaModule[`${componentName}Meta`];
    discovered.push({ slug, componentName, meta });
  }

  const today = new Date().toISOString().slice(0, 10);

  // 1. Generate public/sitemap.xml
  const staticUrls = [
    { loc: `${SITE_CONFIG.url}/`, lastmod: today, priority: "1.0" },
    { loc: `${SITE_CONFIG.url}/components`, lastmod: today, priority: "0.9" },
    { loc: `${SITE_CONFIG.url}/docs`, lastmod: today, priority: "0.8" },
  ];

  const componentUrls = discovered.map(({ slug, meta }) => ({
    loc: `${SITE_CONFIG.url}/components/${slug}`,
    lastmod: meta.createdAt || today,
    priority: meta.featured ? "0.9" : "0.8",
  }));

  const allUrls = [...staticUrls, ...componentUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  await fs.writeFile(
    path.join(publicDir, "sitemap.xml"),
    sitemapXml,
    "utf-8"
  );

  // 2. Generate public/robots.txt
  const robotsTxt = `# BoseUI Search Crawler Directives
User-agent: *
Allow: /
Allow: /components/
Allow: /docs
Allow: /r/

Sitemap: ${SITE_CONFIG.url}/sitemap.xml
`;

  await fs.writeFile(path.join(publicDir, "robots.txt"), robotsTxt, "utf-8");

  // 3. Generate public/llms.txt (AI/LLM-friendly index)
  const llmsSections = discovered
    .map(({ slug, componentName, meta }) => {
      const propsMarkdown = (meta.props || [])
        .map(
          (p) =>
            `  - \`${p.name}\` (${p.type}${p.default ? `, default: ${p.default}` : ""}): ${p.description}`
        )
        .join("\n");

      return `### ${meta.title} (\`${componentName}\`)
- **Slug**: \`${slug}\`
- **Category**: ${meta.category || "Motion"}
- **Tagline**: ${meta.tagline}
- **Description**: ${meta.description}
- **Docs URL**: ${SITE_CONFIG.url}/components/${slug}
- **shadcn CLI Install**: \`npx shadcn@latest add ${SITE_CONFIG.url}/r/${slug}.json\`
- **Registry Manifest**: ${SITE_CONFIG.url}/r/${slug}.json
- **Key Features**:
${(meta.features || []).map((f) => `  - ${f}`).join("\n")}
- **Accessibility**:
${(meta.accessibility || []).map((a) => `  - ${a}`).join("\n")}
- **Props**:
${propsMarkdown}
- **Usage Example**:
\`\`\`tsx
${meta.usageCode}
\`\`\``;
    })
    .join("\n\n---\n\n");

  const llmsTxt = `# ${SITE_CONFIG.name} — LLM & AI Assistant Documentation Index

> ${SITE_CONFIG.tagline}
> Crafted by ${SITE_CONFIG.author.name} (${SITE_CONFIG.author.portfolio})

## Overview
- **Library**: ${SITE_CONFIG.name}
- **Website**: ${SITE_CONFIG.url}
- **Author**: ${SITE_CONFIG.author.name} — GitHub: ${SITE_CONFIG.author.github} | LinkedIn: ${SITE_CONFIG.author.linkedin}
- **Stack**: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Registry Index**: ${SITE_CONFIG.url}/registry.json

## Available Kinetic Components (${discovered.length})

${llmsSections}
`;

  await fs.writeFile(path.join(publicDir, "llms.txt"), llmsTxt, "utf-8");

  console.log(`\x1b[32m✔ SEO Artifacts Generated:\x1b[0m`);
  console.log(
    `  ├─ \x1b[36mpublic/sitemap.xml\x1b[0m (${allUrls.length} canonical URLs)`
  );
  console.log(`  ├─ \x1b[36mpublic/robots.txt\x1b[0m`);
  console.log(
    `  └─ \x1b[36mpublic/llms.txt\x1b[0m (AI assistant context index for ${discovered.length} components)\n`
  );
}

if (process.argv[1]?.includes("generate-seo")) {
  generateSeo().catch((err) => {
    console.error("\x1b[31m✖ SEO Generation Failed:\x1b[0m", err);
    process.exit(1);
  });
}
