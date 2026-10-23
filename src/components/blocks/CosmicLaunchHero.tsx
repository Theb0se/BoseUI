"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Sparkles, ArrowRight, Terminal, Github, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarryNight } from "@/components/ui/StarryNight";
import { ShootingStars } from "@/components/ui/ShootingStars";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { MagneticButton } from "@/components/ui/MagneticButton";

export interface CosmicLaunchHeroProps {
  /** Main marketing headline */
  headline?: string;
  /** Subtitle narrative copy */
  subheadline?: string;
  /** Default command line install script */
  installCommand?: string;
  /** Developer count proof metric */
  developerCount?: string;
  /** Star rating numeric value (1 to 5) */
  rating?: number;
  /** Optional custom class names */
  className?: string;
}

export function CosmicLaunchHero({
  headline = "Engineering the next frontier of kinetic user interfaces",
  subheadline = "Production-ready motion components, interactive devtools, and dynamic shaders built with Framer Motion, Tailwind CSS, and WebGL.",
  installCommand = "npx boseui@latest init",
  developerCount = "14,800+",
  rating = 5,
  className,
}: CosmicLaunchHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[640px] overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl flex flex-col justify-between",
        className
      )}
    >
      {/* Background Starry Universe Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-85">
        <StarryNight
          density={120}
          twinkle={true}
          className="h-full w-full rounded-none border-0"
        >
          <div className="hidden" />
        </StarryNight>
      </div>

      {/* Dynamic Shooting Stars Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <ShootingStars
          color="#A855F7"
          frequency={2}
          angle={35}
        />
      </div>

      {/* Main Hero Marketing Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-12 max-w-5xl mx-auto my-auto">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 backdrop-blur-md text-xs font-mono text-neutral-300 shadow-inner mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
          <span>v2.4 Production Catalog Active</span>
          <span className="text-neutral-600">|</span>
          <span className="text-purple-400 font-semibold">100+ Kinetic Primitives</span>
        </motion.div>

        {/* Shimmer Specular Headline */}
        <div className="max-w-4xl">
          <ShimmerText
            text={headline}
            palette="silver"
            duration={3.2}
            angle={115}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12]"
          />
        </div>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-neutral-300 leading-relaxed font-normal"
        >
          {subheadline}
        </motion.p>

        {/* Action Button CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto"
        >
          <MagneticButton
            variant="primary"
            size="lg"
            strength={0.4}
            className="min-h-[44px] px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2 group"
          >
            <span>Start Deploying</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>

          <MagneticButton
            variant="outline"
            size="lg"
            strength={0.3}
            className="min-h-[44px] px-6 py-3 rounded-xl border border-neutral-700 hover:border-neutral-500 bg-neutral-900/60 backdrop-blur-md text-neutral-200 hover:text-white font-medium transition-colors flex items-center gap-2"
          >
            <Github className="w-4 h-4 text-neutral-400" />
            <span>Star on GitHub</span>
          </MagneticButton>
        </motion.div>

        {/* Code Block Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          className="mt-10 w-full max-w-xl mx-auto text-left"
        >
          <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-xl p-3 px-4 shadow-xl font-mono text-xs text-neutral-200">
            <div className="flex items-center gap-2.5">
              <Terminal className="h-4 w-4 text-purple-400" />
              <span className="text-neutral-500">$</span>
              <span>{installCommand}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white text-[11px] transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Social Proof Footer Row */}
      <div className="relative z-10 w-full border-t border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Avatar presence stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              {["#6366f1", "#a855f7", "#ec4899", "#3b82f6"].map((bg, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: bg }}
                  className="inline-flex h-7 w-7 rounded-full ring-2 ring-neutral-900 items-center justify-center text-[10px] font-bold text-white uppercase"
                >
                  {String.fromCharCode(65 + idx)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-neutral-200">
                Trusted by {developerCount} developers
              </p>
              <p className="text-[11px] text-neutral-400">
                Active in production at high-growth engineering teams
              </p>
            </div>
          </div>

          {/* 5-Star Rating Metric */}
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={cn(
                    "w-4 h-4",
                    idx < rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-600"
                  )}
                />
              ))}
            </div>
            <span className="font-semibold text-white">5.0</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">SOC2 Type II Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CosmicLaunchHero;
