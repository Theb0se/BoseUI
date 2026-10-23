"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Terminal,
  Download,
  Settings,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Layers,
  Zap,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

export interface WalkthroughChapter {
  id: string;
  step: string;
  badge: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  codeLang: "curl" | "node" | "python" | "go";
  command: string;
}

const WALKTHROUGH_CHAPTERS: WalkthroughChapter[] = [
  {
    id: "install",
    step: "01",
    badge: "01 · INSTALL CLI",
    title: "Scaffold primitives directly into your codebase.",
    description:
      "Run the CLI generator to add accessible, spring-animated blocks directly into your src directory. No rigid npm wrapper or stylesheet collision.",
    metricLabel: "Scaffold Speed",
    metricValue: "< 1.4s via pnpm",
    codeLang: "curl",
    command: "npx pulse-ui@latest init",
  },
  {
    id: "configure",
    step: "02",
    badge: "02 · CONFIGURE TOKENS",
    title: "Bind Tailwind v4 semantic tokens & spring physics.",
    description:
      "Fine-tune Hooke's Law spring stiffness and damping constants in your configuration file. Automatic seamless support for daylight and OLED dark modes.",
    metricLabel: "External CSS",
    metricValue: "0 KB Overhead",
    codeLang: "node",
    command: "npx pulse-ui add mega-navbar feature-bento",
  },
  {
    id: "deploy",
    step: "03",
    badge: "03 · DEPLOY & SHIP",
    title: "Ship with zero layout shift and 120Hz fluid motion.",
    description:
      "Verify production bundles with built-in ARIA compliance, server-side compatibility, and GPU-composited spring transforms ready for edge deployments.",
    metricLabel: "Frame Latency",
    metricValue: "120 FPS / 8.3ms",
    codeLang: "python",
    command: "pnpm build && pnpm start",
  },
];

export interface FeatureWalkthroughBlockProps {
  /** Eyebrow tag above the section */
  eyebrow?: string;
  /** Main section headline */
  title?: string;
  /** Section summary paragraph */
  description?: string;
  /** Default active chapter index (0 = Install, 1 = Configure, 2 = Deploy) */
  defaultChapterIndex?: number;
  className?: string;
}

export function FeatureWalkthroughBlock({
  eyebrow = "DEVELOPER WORKFLOW",
  title = "Three-Step Developer Walkthrough",
  description = "Experience seamless integration from CLI scaffolding to production deployment with synchronized live code previews and terminal execution.",
  defaultChapterIndex = 0,
  className,
}: FeatureWalkthroughBlockProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(defaultChapterIndex);

  const activeChapter = WALKTHROUGH_CHAPTERS[activeChapterIndex] ?? WALKTHROUGH_CHAPTERS[0];

  const chapterIcons = [
    <Download key="install" className="h-4 w-4" />,
    <Settings key="configure" className="h-4 w-4" />,
    <Rocket key="deploy" className="h-4 w-4" />,
  ];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 sm:p-10 lg:p-12 text-neutral-100 shadow-2xl dark:border-neutral-800",
        className
      )}
    >
      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-mono text-neutral-300 backdrop-blur-md mb-4">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span>{eyebrow}</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mt-3.5 text-sm text-neutral-400 sm:text-base leading-relaxed">
          {description}
        </p>

        {/* Step Progress Stepper */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {WALKTHROUGH_CHAPTERS.map((ch, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChapterIndex(idx)}
                className={cn(
                  "group flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-neutral-950 shadow-md scale-105 font-semibold"
                    : "border border-neutral-800 bg-neutral-900/70 text-neutral-400 hover:border-neutral-700 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono",
                    isActive
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-800 text-neutral-400 group-hover:text-white"
                  )}
                >
                  {ch.step}
                </span>
                <span>{ch.id === "install" ? "1: Install" : ch.id === "configure" ? "2: Configure" : "3: Deploy"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Stage: Synchronized Storytelling + Tabbed Code Block */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Storytelling Deck */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Active Chapter Spotlight Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-blue-400">
                    {chapterIcons[activeChapterIndex]}
                    {activeChapter.badge}
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    VERIFIED
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
                  {activeChapter.title}
                </h3>

                <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                  {activeChapter.description}
                </p>

                {/* Live CLI Snippet Pill */}
                <div className="mt-5 flex items-center justify-between rounded-xl border border-neutral-800/90 bg-neutral-950 px-3.5 py-2.5 font-mono text-xs text-neutral-300">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-emerald-400 select-none">$</span>
                    <span>{activeChapter.command}</span>
                  </div>
                </div>

                {/* Key Metric Badge */}
                <div className="mt-5 flex items-center justify-between border-t border-neutral-800/80 pt-4 text-xs">
                  <span className="text-neutral-500">{activeChapter.metricLabel}</span>
                  <span className="font-mono font-semibold text-white">
                    {activeChapter.metricValue}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Chapter Navigation Selector */}
            <div className="flex flex-col gap-2 rounded-3xl border border-neutral-800 bg-neutral-900/40 p-3 backdrop-blur-md">
              <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  <span>Workflow Chapters</span>
                </span>
                <span>{activeChapterIndex + 1} / {WALKTHROUGH_CHAPTERS.length}</span>
              </div>
              {WALKTHROUGH_CHAPTERS.map((ch, idx) => {
                const isSelected = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChapterIndex(idx)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl p-3 text-left transition-all",
                      isSelected
                        ? "bg-neutral-800/90 text-white border border-neutral-700/80 shadow-md"
                        : "text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-xl font-mono text-xs font-semibold",
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-neutral-800 text-neutral-400"
                        )}
                      >
                        {ch.step}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-white">{ch.title}</div>
                        <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{ch.metricLabel}: {ch.metricValue}</div>
                      </div>
                    </div>
                    <ArrowRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isSelected ? "translate-x-0.5 text-blue-400" : "text-neutral-600"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Pinned Code Stage with Live Terminal */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-blue-400" />
                  <span>SYNCHRONIZED_CODE_STAGE</span>
                </span>
                <span className="text-neutral-500">Step {activeChapter.step} // {activeChapter.id.toUpperCase()}</span>
              </div>

              <div className="mt-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">
                  <code>
                    {activeChapter.id === "install" && `# 1. Initialize BoseUI in your project
npx boseui@latest init

# 2. Add kinetic primitives and composite blocks
npx boseui add mega-navbar feature-bento

# 3. Start local development server
npm run dev`}
                    {activeChapter.id === "configure" && `// tailwind.config.ts / tokens.ts
export const boseConfig = {
  springPhysics: {
    stiffness: 420,
    damping: 28,
    mass: 0.8,
  },
  theming: {
    defaultMode: "dark",
    reducedMotion: "auto",
  },
};`}
                    {activeChapter.id === "deploy" && `// Production build & edge deployment
// pnpm build && pnpm start

import { FinalCtaBlock } from "@/components/blocks/FinalCtaBlock";

export default function Page() {
  return <FinalCtaBlock headline="Ship 120Hz Fluid Interfaces" />;
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
