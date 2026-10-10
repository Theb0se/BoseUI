import type { Metadata } from "next";
import Link from "next/link";
import {
  Terminal,
  GitBranch,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCode2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  ExternalLink,
  Code2,
  HeartHandshake,
} from "lucide-react";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contributing Guide",
  description:
    "How to design, build, test, and contribute kinetic components and features to BoseUI.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/docs/contributing`,
  },
  openGraph: {
    title: `Contributing Guide · ${SITE_CONFIG.name}`,
    description:
      "How to design, build, test, and contribute kinetic components and features to BoseUI.",
    url: `${SITE_CONFIG.url}/docs/contributing`,
    siteName: SITE_CONFIG.name,
    type: "article",
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} Contributing Guide`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Contributing Guide · ${SITE_CONFIG.name}`,
    description:
      "How to design, build, test, and contribute kinetic components and features to BoseUI.",
    creator: "@Theb0se",
    images: [SITE_CONFIG.ogImage],
  },
};

const CLONE_CODE = `# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/bose-ui.git
cd bose-ui

# 2. Add upstream remote
git remote add upstream https://github.com/Theb0se/bose-ui.git

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev`;

const SCAFFOLD_CODE = `# Scaffold your new component files in one command:
npm run component:new KineticCard

# This automatically creates:
#  ├── src/components/ui/KineticCard.tsx       (Pure UI component)
#  └── src/components/ui/KineticCard.meta.ts   (Metadata & props schema)`;

const COMPONENT_TEMPLATE = `"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface KineticCardProps {
  /** Card title */
  title?: string;
  /** Explanatory description */
  description?: string;
  /** Spring physics stiffness (default: 300) */
  stiffness?: number;
  /** Spring physics damping (default: 25) */
  damping?: number;
  /** Custom classes */
  className?: string;
  children?: React.ReactNode;
}

export function KineticCard({
  title,
  description,
  stiffness = 300,
  damping = 25,
  className,
  children,
}: KineticCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness, damping }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm",
        "dark:border-neutral-800/80 dark:bg-neutral-950 dark:text-white",
        className
      )}
    >
      {title && <h3 className="text-base font-semibold">{title}</h3>}
      {description && (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}

export default KineticCard;`;

const META_TEMPLATE = `import type { PulseComponentMeta } from "../../types/component";

export const kineticCardMeta: PulseComponentMeta = {
  title: "Kinetic Card",
  description: "Physics-driven surface with responsive spring elevation and dynamic lighting.",
  tagline: "Tactile surface with micro-elevation mechanics",
  category: "Cards",
  badges: ["Kinetic", "Spring Physics", "Micro-interaction"],
  createdAt: "2026-10-10",
  keywords: ["card", "kinetic", "spring", "motion", "elevation"],
  features: [
    "Sub-pixel spring elevation on hover with inertia dampening",
    "Zero runtime lock-in with native shadcn CLI distribution",
    "Respects prefers-reduced-motion accessibility standards",
  ],
  accessibility: [
    "Graceful degradation when prefers-reduced-motion is active",
    "WCAG AA compliant contrast ratios across dark and light modes",
  ],
  props: [
    {
      name: "title",
      type: "string",
      defaultValue: "undefined",
      description: "Optional title heading",
      required: false,
    },
    {
      name: "description",
      type: "string",
      defaultValue: "undefined",
      description: "Primary description copy",
      required: false,
    },
    {
      name: "stiffness",
      type: "number",
      defaultValue: "300",
      description: "Spring physics stiffness tension",
      required: false,
    },
    {
      name: "damping",
      type: "number",
      defaultValue: "25",
      description: "Spring physics damping coefficient",
      required: false,
    },
  ],
  usageCode: \`import { KineticCard } from "@/components/ui/KineticCard";

export function Example() {
  return (
    <KineticCard
      title="Predictive Scaling"
      description="Autonomous workload balancing based on real-time traffic surges."
    />
  );
}\`,
};

export default kineticCardMeta;`;

const PREVIEW_TEMPLATE = `// Inside src/components/docs/preview.tsx:
import { KineticCard } from "@/components/ui/KineticCard";

// Add a case matching your kebab-case slug:
case "kinetic-card":
  return (
    <div className="w-full max-w-md p-4">
      <KineticCard
        title="Predictive Scaling"
        description="Autonomous workload balancing based on real-time traffic surges."
        className={className}
      />
    </div>
  );`;

const SYNC_CODE = `# 1. Run typecheck to verify types
npm run typecheck

# 2. Sync the registry, sitemaps, and analyze props
npm run sync

# 3. Test the static production build
npm run build`;

export default function ContributingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 lg:py-12">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-8 dark:border-neutral-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <HeartHandshake className="h-3 w-3" />
            Open Source Community
          </span>
          <span className="text-xs text-neutral-400">·</span>
          <span className="text-xs font-mono text-neutral-500">v1.0.0</span>
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
          Contributing to BoseUI
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
          We welcome contributions from developers, motion designers, and UI enthusiasts.
          Whether you&apos;re crafting a new kinetic interaction, tuning spring curves, or fixing
          documentation, here is everything you need to build and ship with confidence.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/Theb0se/bose-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://github.com/Theb0se/bose-ui/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:text-black dark:border-neutral-800 dark:bg-[#0A0A0A] dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:text-white"
          >
            <span>Open an Issue</span>
          </a>
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {/* Core Architectural Pillars */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">
              The 4 Architecture Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white dark:bg-white dark:text-black">
                  1
                </span>
                <span>Pure UI Primitives</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Components inside <code className="font-mono text-[11px] text-neutral-800 dark:text-neutral-200">src/components/ui/</code> must be clean primitives with zero internal test HUDs, sliders, or prop changers.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white dark:bg-white dark:text-black">
                  2
                </span>
                <span>Centralized Preview Stage</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Custom test states, interactive controls, and playground wrappers belong exclusively in <code className="font-mono text-[11px] text-neutral-800 dark:text-neutral-200">src/components/docs/preview.tsx</code>.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white dark:bg-white dark:text-black">
                  3
                </span>
                <span>100% Props Metadata Contract</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Every prop accepted by your TypeScript interface must be documented in your accompanying <code className="font-mono text-[11px] text-neutral-800 dark:text-neutral-200">&lt;Name&gt;.meta.ts</code> file.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white dark:bg-white dark:text-black">
                  4
                </span>
                <span>Accessible Spring Physics</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Always use <code className="font-mono text-[11px] text-neutral-800 dark:text-neutral-200">useReducedMotion()</code> to respect accessibility settings. Use tactile spring physics over linear easings.
              </p>
            </div>
          </div>
        </section>

        {/* Step 1: Development Setup */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
                Step 1: Local Setup
              </h2>
              <p className="text-xs text-neutral-500">
                Clone the repository and install dependencies
              </p>
            </div>
          </div>

          <CodeViewer
            code={CLONE_CODE}
            filename="terminal"
            language="bash"
            maxHeight="220px"
          />
        </section>

        {/* Step 2: Component Scaffolding */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
                Step 2: Scaffold Your Component
              </h2>
              <p className="text-xs text-neutral-500">
                Use our automated generator to create boilerplate files in seconds
              </p>
            </div>
          </div>

          <CodeViewer
            code={SCAFFOLD_CODE}
            filename="terminal"
            language="bash"
            maxHeight="180px"
          />
        </section>

        {/* Step 3: Implement Primitive */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
                Step 3: Author the Component Primitive
              </h2>
              <p className="text-xs text-neutral-500">
                Write clean, production-ready React in <code className="font-mono text-[11px]">src/components/ui/KineticCard.tsx</code>
              </p>
            </div>
          </div>

          <CodeViewer
            code={COMPONENT_TEMPLATE}
            filename="src/components/ui/KineticCard.tsx"
            language="tsx"
            maxHeight="380px"
          />
        </section>

        {/* Step 4: Metadata Contract */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <FileCode2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
                Step 4: Author the Metadata Contract
              </h2>
              <p className="text-xs text-neutral-500">
                Document props, features, and accessibility in <code className="font-mono text-[11px]">KineticCard.meta.ts</code>
              </p>
            </div>
          </div>

          <CodeViewer
            code={META_TEMPLATE}
            filename="src/components/ui/KineticCard.meta.ts"
            language="typescript"
            maxHeight="420px"
          />
        </section>

        {/* Step 5: Central Preview */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
                Step 5: Register in Central Preview Switchboard
              </h2>
              <p className="text-xs text-neutral-500">
                Customize how the component displays in documentation stages inside <code className="font-mono text-[11px]">src/components/docs/preview.tsx</code>
              </p>
            </div>
          </div>

          <CodeViewer
            code={PREVIEW_TEMPLATE}
            filename="src/components/docs/preview.tsx"
            language="tsx"
            maxHeight="220px"
          />
        </section>

        {/* Step 6: Sync & Validate */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
                Step 6: Sync, Test & Build
              </h2>
              <p className="text-xs text-neutral-500">
                Verify TypeScript types, update the shadcn registry, and build static pages
              </p>
            </div>
          </div>

          <CodeViewer
            code={SYNC_CODE}
            filename="terminal"
            language="bash"
            maxHeight="200px"
          />
        </section>

        {/* PR Checklist */}
        <section className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-950/40">
          <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">
            Pull Request Checklist
          </h3>
          <ul className="mt-3 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Component is a pure primitive without internal test HUDs or state sliders.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>All props in TypeScript interface are documented in <code className="font-mono text-[11px]">.meta.ts</code>.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Preview case added to <code className="font-mono text-[11px]">preview.tsx</code> for documentation staging.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span><code className="font-mono text-[11px]">useReducedMotion()</code> is supported for users with motion sensitivities.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span><code className="font-mono text-[11px]">npm run typecheck</code> and <code className="font-mono text-[11px]">npm run sync</code> pass with 100% health.</span>
            </li>
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            >
              <span>← Back to Introduction</span>
            </Link>
            <a
              href="https://github.com/Theb0se/bose-ui/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <span>Submit Pull Request</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
