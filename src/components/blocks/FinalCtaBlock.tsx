"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlackHole } from "@/components/ui/BlackHole";
import { KineticSwipeButton } from "@/components/ui/KineticSwipeButton";
import { HoldToConfirmButton } from "@/components/ui/HoldToConfirmButton";

export interface FinalCtaBlockProps {
  /** Main headline copy */
  title?: string;
  /** Subheadline explanatory copy */
  description?: string;
  /** Label for kinetic swipe action */
  swipeLabel?: string;
  /** Label for hold to confirm action */
  holdLabel?: string;
  /** Callback fired when swipe deploy is triggered */
  onDeploy?: () => void;
  /** Callback fired when hold confirmation completes */
  onLaunch?: () => void;
  /** Additional container classes */
  className?: string;
}

const HIGHLIGHT_STATS = [
  { label: "Pipeline Latency", value: "<12ms", icon: Zap },
  { label: "Global Edge Uptime", value: "99.99%", icon: ShieldCheck },
  { label: "Interactive Physics", value: "60 FPS", icon: Sparkles },
];

export function FinalCtaBlock({
  title = "Ready to transcend traditional web limits?",
  description = "Deploy your tactile high-performance interface with relativistic physics, zero runtime bloat, and sub-millisecond precision.",
  swipeLabel = "Slide to deploy production",
  holdLabel = "Hold to launch cluster",
  onDeploy,
  onLaunch,
  className,
}: FinalCtaBlockProps) {
  const [deployTriggered, setDeployTriggered] = useState(false);
  const [launchTriggered, setLaunchTriggered] = useState(false);

  const handleSwipeComplete = () => {
    setDeployTriggered(true);
    onDeploy?.();
  };

  const handleHoldConfirm = () => {
    setLaunchTriggered(true);
    onLaunch?.();
  };

  const handleReset = () => {
    setDeployTriggered(false);
    setLaunchTriggered(false);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-800 bg-black text-white shadow-2xl",
        className
      )}
    >
      {/* Relativistic cosmic singularity backdrop */}
      <BlackHole
        size={110}
        diskColor="#FF7A18"
        spinSpeed={1.4}
        particleCount={240}
        pull={0.4}
        lensing={true}
        className="min-h-[540px] w-full"
      >
        <div className="relative z-10 flex min-h-[540px] flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Top telemetry and badge pill */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              Production Release 4.0 &bull; Gravitational Architecture
            </div>

            {(deployTriggered || launchTriggered) && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md transition hover:bg-white/20"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Pipeline State
              </button>
            )}
          </div>

          {/* Center conversion hero content */}
          <div className="my-auto max-w-3xl space-y-6 pt-6 pb-8">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base lg:text-lg"
            >
              {description}
            </motion.p>

            {/* Live conversion action controls */}
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <div className="w-full sm:max-w-xs">
                <KineticSwipeButton
                  label={swipeLabel}
                  completedLabel="Production Deployed"
                  onComplete={handleSwipeComplete}
                  className="w-full shadow-lg"
                />
              </div>

              <div className="w-full sm:max-w-xs">
                <HoldToConfirmButton
                  label={holdLabel}
                  confirmedLabel="Cluster Online"
                  holdDuration={1200}
                  onConfirm={handleHoldConfirm}
                  className="w-full shadow-lg"
                />
              </div>
            </div>

            {/* Notification alert banner upon completion */}
            <AnimatePresence>
              {(deployTriggered || launchTriggered) && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-medium text-emerald-200 backdrop-blur-md"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>
                    Deployment synchronized across 310 global edge nodes. Zero
                    downtime handoff confirmed.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom proof metrics */}
          <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            {HIGHLIGHT_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/40 p-3 backdrop-blur-md"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Icon className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-neutral-400">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BlackHole>
    </div>
  );
}

export default FinalCtaBlock;
