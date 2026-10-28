"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Command,
  Copy,
  Terminal,
  Sparkles,
  Zap,
  ShieldCheck,
  Layers,
  Cpu,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MovingGridLines } from "@/components/ui/MovingGridLines";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ElasticDock } from "@/components/ui/ElasticDock";
import { DynamicIslandToast } from "@/components/ui/DynamicIslandToast";
import { MorphingBlob } from "@/components/ui/MorphingBlob";
import { TiltCreditCard3D } from "@/components/ui/TiltCreditCard3D";
import { DotTextCanvas } from "@/components/ui/DotTextHero";
import { CylinderCarousel, type CylinderCardItem } from "@/components/ui/CylinderCarousel";
import { ExpandableCards, type ExpandableCardItem } from "@/components/ui/ExpandableCards";
import { useCommandPalette } from "@/components/layout/CommandPalette";
import { copyToClipboard, SITE_CONFIG } from "@/lib/utils";

interface ShowcaseTab {
  slug: string;
  label: string;
  badge: string;
  hint: string;
}

const SHOWCASE_TABS: ShowcaseTab[] = [
  {
    slug: "cylinder-carousel",
    label: "3D Cylinder",
    badge: "Radial 3D Stage",
    hint: "Drag or tap cards to rotate through the 3D perspective cylinder",
  },
  {
    slug: "dot-text-hero",
    label: "Dot Matrix",
    badge: "Canvas Physics",
    hint: "Hover over the dot matrix to trigger inverse-square physics repulsion",
  },
  {
    slug: "expandable-cards",
    label: "Expandable",
    badge: "Spring Layout",
    hint: "Hover or click cards to trigger smooth flex layout spring expansion",
  },
  {
    slug: "morphing-blob",
    label: "Morphing Blob",
    badge: "Catmull-Rom Spline",
    hint: "Move pointer to attract and organically deform fluid spring nodes",
  },
  {
    slug: "tilt-credit-card3-d",
    label: "3D Metal Card",
    badge: "Gyroscope 3D",
    hint: "Move pointer around the titanium card to inspect specular depth",
  },
  {
    slug: "elastic-dock",
    label: "Elastic Dock",
    badge: "macOS Magnification",
    hint: "Hover across icons to trigger continuous Hooke's Law expansion",
  },
];

const HERO_CYLINDER_CARDS: CylinderCardItem[] = [
  {
    id: "springs",
    title: "120Hz Kinetic",
    pill: "ProMotion",
    bg: "radial-gradient(circle at 50% 55%, #17a2c8 0%, #6cc9a3 38%, #d5e59a 62%, #fbd3b6 88%)",
    content: () => (
      <div className="flex h-full flex-col items-center justify-center text-white p-4">
        <p className="text-4xl font-bold tracking-tight">120 FPS</p>
        <p className="mt-2 text-xs text-white/80">Hooke&apos;s Law Dynamics</p>
      </div>
    ),
  },
  {
    id: "catalog",
    title: "113+ Primitives",
    pill: "v2.0",
    bg: "linear-gradient(160deg, #6d6cf5 0%, #c15cf0 45%, #f06bd0 100%)",
    content: () => (
      <div className="flex h-full flex-col items-center justify-center text-white p-4">
        <p className="text-4xl font-bold tracking-tight">113+ Primitives</p>
        <p className="mt-2 text-xs text-white/80">Tailwind CSS &amp; TS</p>
      </div>
    ),
  },
  {
    id: "a11y",
    title: "Accessibility",
    pill: "WCAG AA",
    bg: "linear-gradient(180deg, #f7f8fa 0%, #eef0f4 100%)",
    dark: true,
    content: () => (
      <div className="flex h-full flex-col items-center justify-center text-neutral-900 p-4">
        <p className="text-3xl font-bold tracking-tight">A11y First</p>
        <p className="mt-2 text-xs text-neutral-600">Reduced Motion &amp; ARIA</p>
      </div>
    ),
  },
  {
    id: "cli",
    title: "CLI Ready",
    pill: "shadcn",
    bg: "linear-gradient(165deg, #3ccfb4 0%, #6fd6e8 55%, #b6e7f7 100%)",
    content: () => (
      <div className="flex h-full flex-col items-center justify-center text-white p-4">
        <p className="text-4xl font-bold tracking-tight">1-Click Install</p>
        <p className="mt-2 text-xs text-white/80">Zero Runtime Lock-In</p>
      </div>
    ),
  },
];

const HERO_EXPANDABLE_STORIES: ExpandableCardItem[] = [
  {
    id: 1,
    name: "Tactile Motion",
    tagline: "Hooke's Law physics preserved on every frame.",
    logo: <Sparkles className="h-5 w-5 text-white" />,
    quote: [
      "Physical velocity and momentum preserved across touch and pointer interactions.",
    ],
    author: "Rishabh Bose",
    role: "BoseUI Creator",
    bg: "bg-gradient-to-b from-rose-500 via-pink-600 to-orange-500",
  },
  {
    id: 2,
    name: "Source Ownership",
    tagline: "Clean TypeScript and Tailwind living directly in your repository.",
    logo: <Zap className="h-5 w-5 text-white" />,
    quote: [
      "Zero obscure node_modules wrappers. Copy, paste, and customize freely.",
    ],
    author: "Design Systems",
    role: "Engineering",
    bg: "bg-gradient-to-b from-[#0e1726] to-[#050914]",
  },
  {
    id: 3,
    name: "Strict Accessibility",
    tagline: "WCAG AA compliant with automatic reduced-motion fallbacks.",
    logo: <ShieldCheck className="h-5 w-5 text-white" />,
    quote: [
      "Full keyboard focus loops and assistive screen reader support by default.",
    ],
    author: "A11y Standards",
    role: "Inclusive UI",
    bg: "bg-gradient-to-b from-neutral-800 to-neutral-950",
  },
];

const SPECS = [
  {
    tag: "SPRING KINEMATICS",
    title: "120Hz Fluid Physics",
    text: "Engineered with Framer Motion spring-mass-damping equations so every interaction feels instantaneous and tactile.",
  },
  {
    tag: "SOURCE OWNERSHIP",
    title: "Zero Runtime Lock-In",
    text: "Written in clean TypeScript and Tailwind CSS. The code lives directly in your project with zero external stylesheet bloat.",
  },
  {
    tag: "REGISTRY READY",
    title: "One-Command Install",
    text: "Add any primitive with standard shadcn CLI tooling (npx, pnpm, bun) or copy-paste directly with automatic dependency wiring.",
  },
  {
    tag: "PRODUCTION GRADE",
    title: "Accessible & Responsive",
    text: "Built with strict WCAG AA keyboard support, prefers-reduced-motion fallbacks, and seamless light/dark mode parity.",
  },
];

type PackageManager = "npx" | "pnpm" | "bun";

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 flex h-3 w-3 items-center justify-center text-neutral-300 dark:text-neutral-700 ${className}`}
    >
      <span className="absolute h-px w-3 bg-current" />
      <span className="absolute h-3 w-px bg-current" />
    </span>
  );
}

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>(SHOWCASE_TABS[0]);
  const [packageManager, setPackageManager] = useState<PackageManager>("npx");
  const [copied, setCopied] = useState(false);
  const { openPalette } = useCommandPalette();
  const reduceMotion = useReducedMotion();

  const getCliCommand = (pkg: PackageManager, slug: string) => {
    const url = `${SITE_CONFIG.url}/r/${slug}.json`;
    if (pkg === "pnpm") return `pnpm dlx shadcn@latest add "${url}"`;
    if (pkg === "bun") return `bunx --bun shadcn@latest add "${url}"`;
    return `npx shadcn@latest add "${url}"`;
  };

  const cliCommand = getCliCommand(packageManager, activeTab.slug);

  const handleCopyCli = async () => {
    const ok = await copyToClipboard(cliCommand);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative overflow-hidden border-b border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-black">
      {/* Background ambient lighting and dynamic moving grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <MovingGridLines
          gridSize={64}
          beamCount={5}
          beamLength={200}
          speed={0.6}
          radialMask={true}
          className="absolute inset-0 h-full w-full"
        />
        {/* Optimized subtle ambient bloom */}
        <div className="absolute left-1/2 top-0 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-radial from-neutral-200/40 via-neutral-100/10 to-transparent dark:from-white/[0.06] dark:via-white/[0.01]" />
      </div>

      <div className="relative mx-auto max-w-[1340px] border-x border-neutral-200/80 dark:border-neutral-800">
        <Crosshair className="-left-[6px] top-6" />
        <Crosshair className="-right-[6px] top-6" />

        {/* Top architectural telemetry header bar */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-4 py-2.5 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold uppercase tracking-widest text-neutral-900 dark:text-neutral-200">
              BOSEUI v2
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden lg:inline text-neutral-500 dark:text-neutral-400">
              FRAMER MOTION · TAILWIND CSS · TYPESCRIPT
            </span>
            <a
              href={SITE_CONFIG.author.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-700 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            >
              <span>BY RISHABH BOSE</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Main Hero Header Stack */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center px-4 pb-16 pt-12 text-center sm:px-8 sm:pb-20 sm:pt-16 lg:pt-20"
        >
          {/* Release Eyebrow Pill */}
          <motion.div variants={item}>
            <Link
              href="/components"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50/90 py-1 pl-1.5 pr-3.5 text-xs font-medium text-neutral-700 shadow-2xs backdrop-blur-md transition-all hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white dark:bg-white dark:text-black">
                <Sparkles className="h-2.5 w-2.5" />
                NEW
              </span>
              <span>Physics-Based React Primitives · Free &amp; Open Source</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* High-Impact Headline with Crisp Typography */}
          <motion.h1
            variants={item}
            className="mt-6 max-w-4xl text-balance text-4xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-6xl lg:text-[72px] sm:leading-[1.08]"
          >
            React components{" "}
            <span className="text-neutral-500 dark:text-neutral-400 font-semibold">
              engineered to make interfaces feel alive.
            </span>
          </motion.h1>

          {/* Clear Value-Proposition Subtitle */}
          <motion.p
            variants={item}
            className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg"
          >
            A curated design system of tactile micro-interactions, spring mechanics,
            and WebGL background simulations. Copy-paste directly into your codebase with zero
            runtime lock-in.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/components">
              <MagneticButton variant="primary" size="lg" strength={0.3}>
                <span>Explore Components</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>

            <Link href="/docs">
              <MagneticButton variant="secondary" size="lg" strength={0.22}>
                <span>Documentation &amp; CLI</span>
              </MagneticButton>
            </Link>

            <button
              type="button"
              onClick={openPalette}
              aria-label="Search components"
              className="inline-flex h-[46px] cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-xs font-medium text-neutral-700 shadow-2xs transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white"
            >
              <Command className="h-3.5 w-3.5 text-neutral-400" />
              <span>Search</span>
              <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                ⌘K
              </kbd>
            </button>
          </motion.div>

          {/* Studio Interactive Sandbox Stage */}
          <motion.div variants={item} className="mt-12 w-full max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-[#070707] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
              {/* Studio Window Chrome Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 bg-neutral-50/70 px-4 py-2.5 dark:border-neutral-800/80 dark:bg-[#0A0A0A]">
                {/* Window Dots & Tab Switcher */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-neutral-200 dark:border-neutral-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                    {SHOWCASE_TABS.map((tab) => {
                      const isActive = activeTab.slug === tab.slug;
                      return (
                        <button
                          key={tab.slug}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`cursor-pointer whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${isActive
                            ? "bg-neutral-900 text-white shadow-2xs dark:bg-white dark:text-black font-semibold"
                            : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                            }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Telemetry Pill */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {activeTab.badge}
                  </span>
                </div>
              </div>

              {/* Dynamic Interactive Playground Arena */}
              <div className="relative flex min-h-[300px] sm:min-h-[340px] items-center justify-center p-6 sm:p-10 bg-dot-matrix [background-size:20px_20px] bg-neutral-50/40 dark:bg-[#030303] overflow-hidden">
                {activeTab.slug === "cylinder-carousel" && (
                  <div className="w-full flex flex-col items-center justify-center py-2">
                    <CylinderCarousel
                      cards={HERO_CYLINDER_CARDS}
                      cardWidth={240}
                      cardHeight={290}
                      gap={36}
                      className="min-h-[360px] py-2 bg-transparent dark:bg-transparent"
                    />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      {activeTab.hint}
                    </span>
                  </div>
                )}

                {activeTab.slug === "dot-text-hero" && (
                  <div className="w-full flex flex-col items-center justify-center py-4 max-w-lg">
                    <DotTextCanvas
                      lines={["KINETIC", "PHYSICS"]}
                      dotSize={12}
                      repelRadius={90}
                      repelStrength={6}
                      className="w-full"
                    />
                    <span className="mt-4 font-mono text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      {activeTab.hint}
                    </span>
                  </div>
                )}

                {activeTab.slug === "expandable-cards" && (
                  <div className="w-full max-w-2xl py-2">
                    <ExpandableCards
                      stories={HERO_EXPANDABLE_STORIES}
                      className="py-4 px-2 bg-transparent"
                    />
                    <div className="text-center mt-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        {activeTab.hint}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab.slug === "morphing-blob" && (
                  <div className="relative flex flex-col items-center justify-center">
                    <MorphingBlob
                      width={380}
                      height={320}
                      baseRadius={110}
                      variance={30}
                      cursorFollow={true}
                      colors={["#8B5CF6", "#06B6D4"]}
                    />
                    <div className="pointer-events-none absolute text-center">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        {activeTab.hint}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab.slug === "tilt-credit-card3-d" && (
                  <div className="flex flex-col items-center justify-center py-4">
                    <TiltCreditCard3D
                      theme="titanium"
                      cardHolder="RISHABH BOSE"
                      cardNumber="4829 •••• •••• 9102"
                      expiry="09/30"
                    />
                    <span className="mt-3 font-mono text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      {activeTab.hint}
                    </span>
                  </div>
                )}

                {activeTab.slug === "elastic-dock" && (
                  <div className="flex flex-col items-center justify-center gap-4 py-4 w-full">
                    <ElasticDock />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      {activeTab.hint}
                    </span>
                  </div>
                )}
              </div>

              {/* Studio Command Bar & 1-Click CLI Install */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-neutral-200/80 bg-neutral-50/70 px-4 py-3 dark:border-neutral-800/80 dark:bg-[#070707]">
                {/* CLI Package Manager Switcher & Snippet */}
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <div className="flex rounded-lg bg-neutral-200/60 p-0.5 font-mono text-[11px] dark:bg-neutral-800/60">
                    {(["npx", "pnpm", "bun"] as const).map((pkg) => (
                      <button
                        key={pkg}
                        type="button"
                        onClick={() => setPackageManager(pkg)}
                        className={`rounded-md px-2 py-0.5 transition-colors ${packageManager === pkg
                          ? "bg-white font-semibold text-black shadow-2xs dark:bg-neutral-700 dark:text-white"
                          : "text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                          }`}
                      >
                        {pkg}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 overflow-hidden font-mono text-xs pl-1">
                    <Terminal className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                    <span className="select-all truncate text-neutral-800 dark:text-neutral-200">
                      {cliCommand}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 shrink-0">
                  <Link
                    href={`/components/${activeTab.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-medium text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                  >
                    <span>Inspect Docs</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleCopyCli}
                    aria-label="Copy CLI install command"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono text-[11px] font-medium text-neutral-900 shadow-2xs transition-colors hover:border-black hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:border-neutral-500 dark:hover:bg-neutral-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy CLI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Architectural 4-Column Feature Strip */}
        <div className="relative grid grid-cols-1 border-t border-neutral-200/80 bg-neutral-50/50 dark:border-neutral-800 dark:bg-[#040404] sm:grid-cols-2 lg:grid-cols-4">
          <Crosshair className="-left-[6px] -top-[6px]" />
          <Crosshair className="-right-[6px] -top-[6px]" />

          {SPECS.map((spec, idx) => (
            <div
              key={spec.title}
              className={`group relative flex flex-col justify-between p-6 transition-colors hover:bg-white dark:hover:bg-[#080808] sm:p-8 ${idx !== SPECS.length - 1
                ? "border-b border-neutral-200/80 dark:border-neutral-800 lg:border-b-0 lg:border-r"
                : ""
                } ${idx % 2 === 0 ? "sm:border-r" : ""}`}
            >
              <div>
                <span className="rounded bg-neutral-200/60 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-neutral-600 dark:bg-neutral-800/80 dark:text-neutral-400">
                  {spec.tag}
                </span>
                <h2 className="mt-3 text-base font-semibold tracking-tight text-neutral-950 dark:text-white">
                  {spec.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {spec.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
