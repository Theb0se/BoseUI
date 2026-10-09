"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Sparkles, ArrowRight, Terminal, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarryNight } from "@/components/ui/StarryNight";
import { ShootingStars } from "@/components/ui/ShootingStars";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { AvatarStackPresence } from "@/components/ui/AvatarStackPresence";

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
  subheadline = "A production-grade design system and motion toolkit crafted with physics-based springs, GPU-accelerated shaders, and precision ergonomics.",
  installCommand = "npx boseui add cosmic-launch",
  developerCount = "12,000+",
  rating = 5,
  className,
}: CosmicLaunchHeroProps) {
  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[560px] overflow-hidden rounded-2xl border border-neutral-800/80 bg-[#070913] text-white flex flex-col justify-between shadow-2xl selection:bg-indigo-500/30",
        className
      )}
    >
      {/* Background Starfield & Meteor Canopy */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <StarryNight density={220} twinkle parallax={28} className="w-full h-full border-0 bg-transparent p-0 shadow-none">
          <div className="hidden" />
        </StarryNight>
        <ShootingStars frequency={1.8} angle={32} color="#818CF8" maxConcurrent={4} className="w-full h-full border-0 bg-transparent p-0 shadow-none">
          <div className="hidden" />
        </ShootingStars>
        {/* Ambient atmospheric gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20 flex flex-col items-center text-center">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-md text-xs font-medium text-indigo-300 shadow-inner hover:border-indigo-400/50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="font-semibold text-white">v2.4 Released</span>
          <span className="text-neutral-400">•</span>
          <span>Cosmic Canvas Architecture</span>
          <ArrowRight className="w-3 h-3 text-indigo-300" />
        </motion.div>

        {/* Shimmering Headline */}
        <div className="mt-6 max-w-4xl mx-auto">
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
          <CopyCodeBlock
            code={installCommand}
            title="Terminal Installation"
            showPromptPrefix
            className="bg-neutral-950/80 border-neutral-800 backdrop-blur-xl shadow-xl"
          />
        </motion.div>
      </div>

      {/* Social Proof Footer Row */}
      <div className="relative z-10 w-full border-t border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Avatar presence stack */}
          <div className="flex items-center gap-3">
            <AvatarStackPresence maxVisible={4} size="sm" />
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
            <span className="font-semibold text-white">
              {rating.toFixed(1)} / 5.0
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">4,800+ Verified Reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CosmicLaunchHero;
