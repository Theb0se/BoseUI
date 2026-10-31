"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Copy,
  Sparkles,
  Sliders,
  MousePointer,
  Activity,
  KeyRound,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

// Real BoseUI components for the live interactive sandbox
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PermissionSwitch } from "@/components/ui/PermissionSwitch";
import { AgentStatusBadge, type AgentStatus } from "@/components/ui/AgentStatusBadge";
import { SpringPinInput } from "@/components/ui/SpringPinInput";

type PackageManager = "npm" | "pnpm" | "bun";
type DemoTab = "button" | "switch" | "badge" | "pin";

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: "npx shadcn@latest add https://boseui.site/r/magnetic-button.json",
  pnpm: "pnpm dlx shadcn@latest add https://boseui.site/r/magnetic-button.json",
  bun: "bunx --bun shadcn@latest add https://boseui.site/r/magnetic-button.json",
};

const DEMO_TABS: { id: DemoTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "button", label: "Magnetic", icon: MousePointer },
  { id: "switch", label: "Switch", icon: Sliders },
  { id: "badge", label: "Agent", icon: Activity },
  { id: "pin", label: "PIN", icon: KeyRound },
];

const SPRING_PRESETS = [
  { label: "Snappy", stiffness: 440, damping: 28 },
  { label: "Bouncy", stiffness: 280, damping: 14 },
  { label: "Smooth", stiffness: 180, damping: 22 },
] as const;

export function HeroSection() {
  const [pkg, setPkg] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);
  const [activeDemo, setActiveDemo] = useState<DemoTab>("button");
  const [badgeStatus, setBadgeStatus] = useState<AgentStatus>("analyzing");
  const [stiffness, setStiffness] = useState(380);
  const [damping, setDamping] = useState(24);
  const [selectedPreset, setSelectedPreset] = useState<string>("Snappy");
  const shouldReduceMotion = useReducedMotion();

  const handleCopy = async () => {
    const success = await copyToClipboard(INSTALL_COMMANDS[pkg]);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyPreset = (p: (typeof SPRING_PRESETS)[number]) => {
    setStiffness(p.stiffness);
    setDamping(p.damping);
    setSelectedPreset(p.label);
  };

  const scrollToRecentlyAdded = () => {
    const el = document.getElementById("recently-added");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-between py-8 sm:py-12 lg:py-16">
      {/* Top / Main Hero Content */}
      <div className="my-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Direct Copy & Actions */}
        <div className="lg:col-span-7">
          {/* Subtle Eyebrow Pill */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            <span>Open-source React primitives</span>
          </motion.div>

          {/* Headline (one line, plain) */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.05 }}
            className="text-4xl font-semibold tracking-[-0.03em] text-neutral-950 dark:text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]"
          >
            React components with <span className="text-neutral-600 dark:text-neutral-300">spring animations.</span>
          </motion.h1>

          {/* Subtext (one sentence) */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.12 }}
            className="mt-4 max-w-xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg leading-relaxed font-normal"
          >
            Copy-paste into your project. Built with Framer Motion, Tailwind and
            TypeScript. Free and open source.
          </motion.p>

          {/* Two Actions Only: [Browse components] & install chip */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {/* Primary Action Button */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <Link
                href="/components"
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                <span>Browse components</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* Install command as a copyable chip with sliding tab indicator */}
            <div className="inline-flex h-10 items-center rounded-lg border border-neutral-200 bg-neutral-50/90 p-1 text-xs dark:border-neutral-800 dark:bg-neutral-950/90">
              {/* Package manager toggle */}
              <div className="relative flex items-center border-r border-neutral-200 pr-1 mr-1.5 dark:border-neutral-800">
                {(["npm", "pnpm", "bun"] as const).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPkg(pm)}
                    className={`relative rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors z-10 ${pkg === pm
                      ? "font-medium text-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                      }`}
                  >
                    {pkg === pm && (
                      <motion.div
                        layoutId="hero-pm-indicator"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute inset-0 rounded-md bg-white shadow-2xs dark:bg-neutral-900 -z-10"
                      />
                    )}
                    {pm}
                  </button>
                ))}
              </div>

              {/* Command text & animated copy button */}
              <div className="flex items-center gap-2.5 pl-1 pr-1.5">
                <code className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                  {INSTALL_COMMANDS[pkg]}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={`Copy ${pkg} install command`}
                  title="Copy to clipboard"
                  className="relative inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        className="flex items-center justify-center text-emerald-600 dark:text-emerald-400"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        className="flex items-center justify-center"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Small text line below */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24, duration: 0.4 }}
            className="mt-5 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500"
          >
            <span>Open-source </span>
            <span>·</span>
            <span>MIT license</span>
            <span>·</span>
            <span>Next.js ready</span>
          </motion.div>
        </div>

        {/* Right Column: Live Interactive Spring Sandbox */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.15 }}
          className="lg:col-span-5"
        >
          <div className="rounded-2xl border border-neutral-200/90 bg-neutral-100/60 p-1.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40">
            <div className="rounded-xl border border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden">
              {/* Top Header: window controls, lab title & segmented tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 bg-neutral-50/80 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                  </span>
                  <span className="font-mono text-xs font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    spring.lab
                  </span>
                  <span className="rounded bg-neutral-200/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    Interactive
                  </span>
                </div>

                {/* Tab Switcher */}
                <div className="inline-flex items-center rounded-lg border border-neutral-200/80 bg-neutral-100/80 p-0.5 text-xs dark:border-neutral-800 dark:bg-neutral-900">
                  {DEMO_TABS.map((tab) => {
                    const isActive = activeDemo === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveDemo(tab.id)}
                        className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors z-10 ${isActive
                          ? "text-neutral-950 dark:text-white"
                          : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                          }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="hero-demo-pill"
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                            className="absolute inset-0 rounded-md bg-white shadow-2xs dark:bg-neutral-800 -z-10"
                          />
                        )}
                        <Icon className="h-3 w-3" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Interactive Stage */}
              <div className="relative flex min-h-[250px] flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-white to-neutral-50/40 dark:from-neutral-950 dark:to-neutral-900/30">
                {/* Subtle corner crosshairs for precision physics feel */}
                <div className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] text-neutral-300 dark:text-neutral-700 select-none">
                  +
                </div>
                <div className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-neutral-300 dark:text-neutral-700 select-none">
                  +
                </div>
                <div className="pointer-events-none absolute left-3 bottom-3 font-mono text-[9px] text-neutral-300 dark:text-neutral-700 select-none">
                  +
                </div>
                <div className="pointer-events-none absolute right-3 bottom-3 font-mono text-[9px] text-neutral-300 dark:text-neutral-700 select-none">
                  +
                </div>

                <AnimatePresence mode="wait">
                  {activeDemo === "button" && (
                    <motion.div
                      key="button"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.16 }}
                      className="flex w-full flex-col items-center gap-4 text-center"
                    >
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <MagneticButton
                          variant="primary"
                          size="md"
                          strength={0.42}
                          stiffness={stiffness}
                          damping={damping}
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Magnetic Pull</span>
                        </MagneticButton>
                        <MagneticButton
                          variant="outline"
                          size="md"
                          strength={0.42}
                          stiffness={stiffness}
                          damping={damping}
                        >
                          <span>Snap Recoil</span>
                        </MagneticButton>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/60 bg-neutral-100/60 px-3 py-1 text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
                        <MousePointer className="h-3 w-3 text-blue-500" />
                        <span>Hover near buttons to inspect Hooke&apos;s Law attraction</span>
                      </div>
                    </motion.div>
                  )}

                  {activeDemo === "switch" && (
                    <motion.div
                      key="switch"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.16 }}
                      className="flex w-full flex-col items-center gap-4 text-center"
                    >
                      <PermissionSwitch className="scale-100" />
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/60 bg-neutral-100/60 px-3 py-1 text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
                        <Sliders className="h-3 w-3 text-blue-500" />
                        <span>Click segments to feel fluid layout projection springs</span>
                      </div>
                    </motion.div>
                  )}

                  {activeDemo === "badge" && (
                    <motion.div
                      key="badge"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.16 }}
                      className="flex w-full flex-col items-center gap-3.5 text-center"
                    >
                      <AgentStatusBadge
                        status={badgeStatus}
                        interactive={true}
                        onStatusChange={(s) => setBadgeStatus(s)}
                        size="md"
                      />
                      <div className="flex flex-wrap items-center justify-center gap-1">
                        {(["reading-docs", "analyzing", "debugging", "success"] as const).map(
                          (s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setBadgeStatus(s)}
                              className={`rounded px-2 py-0.5 font-mono text-[10px] transition-colors ${badgeStatus === s
                                ? "bg-neutral-900 text-white font-medium dark:bg-white dark:text-neutral-900 shadow-2xs"
                                : "bg-neutral-100 text-neutral-600 hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                }`}
                            >
                              {s}
                            </button>
                          )
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Click badge or status chips to test 4x4 animated matrix signatures
                      </p>
                    </motion.div>
                  )}

                  {activeDemo === "pin" && (
                    <motion.div
                      key="pin"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.16 }}
                      className="flex w-full flex-col items-center gap-4 text-center"
                    >
                      <SpringPinInput
                        length={4}
                        defaultValue="42"
                        stiffness={stiffness}
                        damping={damping}
                      />
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/60 bg-neutral-100/60 px-3 py-1 text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
                        <KeyRound className="h-3 w-3 text-blue-500" />
                        <span>Type digits to trigger keystroke slot bounce physics</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Physics Telemetry HUD */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200/80 bg-neutral-50/80 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/60 text-xs">
                {/* Presets */}
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mr-1">
                    Preset:
                  </span>
                  {SPRING_PRESETS.map((p) => {
                    const isSelected = selectedPreset === p.label;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className={`rounded px-2 py-0.5 font-mono text-[10px] font-medium transition-colors ${isSelected
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-2xs"
                          : "border border-neutral-200/80 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
                          }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>

                {/* Live Metrics & Slider */}
                <div className="flex items-center gap-2.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span>k:</span>
                    <input
                      type="range"
                      min={140}
                      max={600}
                      step={20}
                      value={stiffness}
                      onChange={(e) => {
                        setStiffness(Number(e.target.value));
                        setSelectedPreset("custom");
                      }}
                      aria-label="Spring stiffness"
                      className="h-1.5 w-16 sm:w-20 cursor-pointer accent-blue-600 dark:accent-blue-400"
                    />
                    <span className="w-8 text-right font-semibold text-neutral-900 dark:text-white">
                      {stiffness}
                    </span>
                  </div>
                  <span className="text-neutral-300 dark:text-neutral-700">|</span>
                  <span className="text-[10px]">
                    d: <strong className="text-neutral-900 dark:text-white">{damping}</strong>
                  </span>
                  <span className="text-neutral-300 dark:text-neutral-700">|</span>
                  <span className="text-[10px] text-neutral-400">m: 0.6</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom: Minimalist Mouse Scroll Indicator */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="flex justify-center pb-2 pt-6"
      >
        <button
          type="button"
          onClick={scrollToRecentlyAdded}
          aria-label="Scroll to explore components"
          className="group flex flex-col items-center gap-2 text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
        >
          <span className="text-[11px] font-medium tracking-wide text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
            Scroll to explore
          </span>
          <div className="h-5 w-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-600 dark:group-hover:border-neutral-400 transition-colors flex justify-center pt-1">
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 5, 0], opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="h-1 w-1 rounded-full bg-neutral-500 dark:bg-neutral-400"
            />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
