"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Gauge,
  Feather,
  ShieldCheck,
  Check,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HorizonLight } from "@/components/ui/HorizonLight";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { SplitButton, SplitButtonOption } from "@/components/ui/SplitButton";

export interface DawnHeroMetric {
  value: string;
  label: string;
  description: string;
}

export interface DawnHeroProps {
  /** Pinned navigation brand title */
  brandTitle?: string;
  /** Primary headline text */
  headline?: string;
  /** Narrative description text */
  description?: string;
  /** Feature metric callouts displayed across the bottom */
  metrics?: DawnHeroMetric[];
  /** Optional custom class names */
  className?: string;
}

const DEFAULT_METRICS: DawnHeroMetric[] = [
  {
    value: "60 FPS",
    label: "Continuous Refresh",
    description: "Sub-millisecond WebGL horizon frame generation",
  },
  {
    value: "120Hz",
    label: "Spring Kinematics",
    description: "Hardware-accelerated reactive micro-interactions",
  },
  {
    value: "< 4.2 KB",
    label: "Ultralight Footprint",
    description: "Tree-shakeable modular component composition",
  },
  {
    value: "100%",
    label: "A11y Compliance",
    description: "Full keyboard navigation and screen-reader semantics",
  },
];

export function DawnHero({
  brandTitle = "Dawn Architecture",
  headline = "The dawn of fluid kinetic interfaces",
  description = "A new paradigm of tactile, physics-based user experience. Harmonizing volumetric light shaders with instantaneous mechanical feedback.",
  metrics = DEFAULT_METRICS,
  className,
}: DawnHeroProps) {
  const [selectedCli, setSelectedCli] = useState("npx");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const cliOptions: SplitButtonOption[] = [
    {
      value: "npx",
      label: "npx boseui add dawn-hero",
      icon: <Terminal className="w-3.5 h-3.5 text-orange-400" />,
      onSelect: () => handleSelectCli("npx", "npx boseui add dawn-hero"),
    },
    {
      value: "pnpm",
      label: "pnpm dlx boseui add dawn-hero",
      icon: <Terminal className="w-3.5 h-3.5 text-amber-400" />,
      onSelect: () => handleSelectCli("pnpm", "pnpm dlx boseui add dawn-hero"),
    },
    {
      value: "bun",
      label: "bunx boseui add dawn-hero",
      icon: <Terminal className="w-3.5 h-3.5 text-yellow-400" />,
      onSelect: () => handleSelectCli("bun", "bunx boseui add dawn-hero"),
    },
  ];

  const handleSelectCli = (key: string, cmd: string) => {
    setSelectedCli(key);
    navigator.clipboard?.writeText(cmd);
    setCopiedNotification(`Copied ${key} command to clipboard!`);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handlePrimaryClick = () => {
    const cmd =
      selectedCli === "bun"
        ? "bunx boseui add dawn-hero"
        : selectedCli === "pnpm"
        ? "pnpm dlx boseui add dawn-hero"
        : "npx boseui add dawn-hero";
    navigator.clipboard?.writeText(cmd);
    setCopiedNotification(`Copied: ${cmd}`);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[580px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#090708] text-white flex flex-col justify-between shadow-2xl selection:bg-orange-500/30",
        className
      )}
    >
      {/* Pinned SubNav Header with Live Breadcrumb Context */}
      <div className="relative z-30 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm tracking-tight text-white">{brandTitle}</span>
          <span className="rounded-full bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 text-[11px] font-mono text-orange-400">
            v2.0 Beta
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs text-neutral-400 font-medium">
          <span className="text-white hover:text-orange-400 transition-colors cursor-pointer">Overview</span>
          <span className="hover:text-white transition-colors cursor-pointer">Kinetic Optics</span>
          <span className="hover:text-white transition-colors cursor-pointer">Shader Specs</span>
          <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
        </div>
        <button
          type="button"
          onClick={handlePrimaryClick}
          className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition-all shadow-sm"
        >
          Explore Kit
        </button>
      </div>

      {/* Volumetric Horizon Light Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HorizonLight
          primaryColor="#FF4D1C"
          secondaryColor="#FF8A3D"
          deepColor="#6E1404"
          coreColor="#FFF3E0"
          horizonHeight={0.46}
          intensity={1.15}
          interactive
          className="w-full h-full border-0 bg-transparent p-0 shadow-none"
        >
          <div className="hidden" />
        </HorizonLight>
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#090708]/40 to-[#090708]/90 pointer-events-none" />
      </div>

      {/* Main Hero Content Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-12 pb-14 text-center flex flex-col items-center">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-950/40 backdrop-blur-md text-xs font-medium text-orange-300 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span>Volumetric Horizon Shader</span>
          <span className="text-orange-500">•</span>
          <span className="text-white font-semibold">Optical Flare Engine</span>
        </motion.div>

        {/* Shimmering Headline */}
        <div className="mt-6 max-w-3xl mx-auto">
          <ShimmerText
            text={headline}
            palette="gold"
            duration={3.5}
            angle={120}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.14]"
          />
        </div>

        {/* Narrative Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-neutral-300 leading-relaxed font-normal"
        >
          {description}
        </motion.p>

        {/* Primary CTA SplitButton & Notification */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-3">
            <SplitButton
              label={`Get Started (${selectedCli})`}
              onClick={handlePrimaryClick}
              options={cliOptions}
              variant="primary"
              size="lg"
              className="shadow-xl shadow-orange-500/20"
            />
          </div>

          {copiedNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono"
            >
              <Check className="w-3 h-3 text-emerald-400" />
              <span>{copiedNotification}</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Feature Metric Callout Cards */}
      <div className="relative z-10 w-full border-t border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md px-6 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="flex flex-col p-3.5 rounded-xl border border-neutral-800/60 bg-neutral-900/40 backdrop-blur-sm hover:border-orange-500/30 transition-colors"
            >
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-100 to-orange-400">
                {metric.value}
              </span>
              <span className="mt-1 text-xs font-semibold text-neutral-200">
                {metric.label}
              </span>
              <span className="mt-0.5 text-[11px] text-neutral-400 leading-tight">
                {metric.description}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DawnHero;
