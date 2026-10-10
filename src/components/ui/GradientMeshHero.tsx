"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Sliders, Shield, Terminal, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColorPreset {
  id: string;
  name: string;
  blob1: string;
  blob2: string;
  blob3: string;
  blob4: string;
  blob5: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "stripe-classic",
    name: "Stripe Classic",
    blob1: "rgba(99, 102, 241, 0.85)", // Indigo
    blob2: "rgba(168, 85, 247, 0.75)", // Violet
    blob3: "rgba(6, 182, 212, 0.7)",   // Cyan
    blob4: "rgba(244, 63, 94, 0.65)",  // Vermilion / Rose
    blob5: "rgba(245, 158, 11, 0.6)",  // Amber
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    blob1: "rgba(217, 70, 239, 0.8)",  // Fuchsia
    blob2: "rgba(59, 130, 246, 0.85)", // Electric Blue
    blob3: "rgba(16, 185, 129, 0.75)", // Emerald
    blob4: "rgba(139, 92, 246, 0.7)",  // Purple
    blob5: "rgba(14, 165, 233, 0.65)", // Sky
  },
  {
    id: "sunset-ray",
    name: "Sunset Ember",
    blob1: "rgba(239, 68, 68, 0.85)",  // Red
    blob2: "rgba(249, 115, 22, 0.8)",  // Orange
    blob3: "rgba(234, 179, 8, 0.75)",  // Yellow
    blob4: "rgba(219, 39, 119, 0.7)",  // Pink
    blob5: "rgba(147, 51, 234, 0.6)",  // Deep Purple
  },
  {
    id: "deep-aurora",
    name: "Deep Aurora",
    blob1: "rgba(16, 185, 129, 0.85)", // Emerald
    blob2: "rgba(20, 184, 166, 0.8)",  // Teal
    blob3: "rgba(99, 102, 241, 0.75)", // Indigo
    blob4: "rgba(6, 182, 212, 0.7)",   // Cyan
    blob5: "rgba(52, 211, 153, 0.6)",  // Mint
  },
];

export interface GradientMeshHeroProps {
  className?: string;
  defaultPreset?: string;
  preset?: string;
  enableClipPath?: boolean;
  headline?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  children?: React.ReactNode;
}

export function GradientMeshHero({
  className,
  defaultPreset = "stripe-classic",
  preset,
  enableClipPath = true,
  headline,
  description,
  primaryCtaText,
  secondaryCtaText,
  children,
}: GradientMeshHeroProps) {
  const [selectedPresetId, setSelectedPresetId] = useState(preset || defaultPreset);
  const [useClip, setUseClip] = useState(enableClipPath);
  const [speed, setSpeed] = useState<number>(20); // seconds duration
  const [blurAmount, setBlurAmount] = useState<number>(80);

  const activePreset =
    COLOR_PRESETS.find((p) => p.id === selectedPresetId) || COLOR_PRESETS[0];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#060814] text-white flex flex-col justify-between shadow-2xl selection:bg-indigo-500/30",
        className
      )}
    >
      <style>{`
        @keyframes meshDrift1 {
          0% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
          33% { transform: translate(25%, -20%) rotate(60deg) scale(1.15); }
          66% { transform: translate(-20%, 15%) rotate(120deg) scale(0.9); }
          100% { transform: translate(0%, 0%) rotate(180deg) scale(1); }
        }
        @keyframes meshDrift2 {
          0% { transform: translate(0%, 0%) rotate(0deg) scale(1.1); }
          33% { transform: translate(-30%, 25%) rotate(-80deg) scale(0.85); }
          66% { transform: translate(20%, -15%) rotate(-140deg) scale(1.2); }
          100% { transform: translate(0%, 0%) rotate(-200deg) scale(1.1); }
        }
        @keyframes meshDrift3 {
          0% { transform: translate(0%, 0%) scale(0.95); }
          50% { transform: translate(30%, 30%) scale(1.25); }
          100% { transform: translate(0%, 0%) scale(0.95); }
        }
        @keyframes meshDrift4 {
          0% { transform: translate(0%, 0%) scale(1.2); }
          50% { transform: translate(-25%, -25%) scale(0.85); }
          100% { transform: translate(0%, 0%) scale(1.2); }
        }
      `}</style>

      {/* Clipped Mesh Container */}
      <div
        className="absolute inset-0 overflow-hidden transition-all duration-700 pointer-events-none"
        style={{
          clipPath: useClip
            ? "polygon(0 0, 100% 0, 100% 88%, 0 100%)"
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        {/* Deep dark backdrop under mesh */}
        <div className="absolute inset-0 bg-[#090b1c]" />

        {/* Ambient Gradient Mesh Canvas of Blobs */}
        <div
          className="absolute inset-0 opacity-80 transition-opacity"
          style={{ filter: `blur(${blurAmount}px)` }}
        >
          {/* Blob 1 */}
          <div
            className="absolute -top-1/4 -left-1/4 h-[90%] w-[90%] rounded-full opacity-90 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${activePreset.blob1} 0%, transparent 70%)`,
              animation: `meshDrift1 ${speed}s ease-in-out infinite alternate`,
            }}
          />

          {/* Blob 2 */}
          <div
            className="absolute top-1/6 -right-1/4 h-[85%] w-[85%] rounded-full opacity-85 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${activePreset.blob2} 0%, transparent 70%)`,
              animation: `meshDrift2 ${speed * 1.25}s ease-in-out infinite alternate`,
            }}
          />

          {/* Blob 3 */}
          <div
            className="absolute -bottom-1/3 left-1/4 h-[90%] w-[90%] rounded-full opacity-80 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${activePreset.blob3} 0%, transparent 70%)`,
              animation: `meshDrift3 ${speed * 0.9}s ease-in-out infinite alternate`,
            }}
          />

          {/* Blob 4 */}
          <div
            className="absolute top-1/3 left-1/3 h-[75%] w-[75%] rounded-full opacity-70 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${activePreset.blob4} 0%, transparent 70%)`,
              animation: `meshDrift4 ${speed * 1.1}s ease-in-out infinite alternate`,
            }}
          />

          {/* Blob 5 Accent Core */}
          <div
            className="absolute bottom-1/6 right-1/4 h-[60%] w-[60%] rounded-full opacity-75 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${activePreset.blob5} 0%, transparent 65%)`,
              animation: `meshDrift1 ${speed * 1.4}s ease-in-out infinite alternate-reverse`,
            }}
          />
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Vignette / dark bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#060814]/90" />
      </div>

      {/* Hero Foreground Content */}
      {children ? (
        <div className="relative z-10 w-full">{children}</div>
      ) : (
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-6 text-center flex flex-col items-center">
          {/* Top Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-lg"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Stripe-Grade Mesh v4.0</span>
            <span className="h-1 w-1 rounded-full bg-white/50" />
            <span className="text-white/80 font-normal">Next-gen Canvas GPU Drift</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
          >
            {headline || (
              <>
                Financial infrastructure <br />
                <span className="bg-gradient-to-r from-cyan-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                  for the modern internet
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-2xl text-base sm:text-lg text-neutral-200/90 leading-relaxed font-light drop-shadow"
          >
            {description ||
              "Millions of companies—from fast-growing startups to global enterprises—use Pulse’s software and APIs to accept payments, send payouts, and scale recurring revenue."}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-sm shadow-xl shadow-white/10 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <span>{primaryCtaText || "Start now"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]">
              {secondaryCtaText || "Contact sales"}
            </button>
          </motion.div>

          {/* Live Telemetry Metric Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-6 rounded-xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl text-left"
          >
            <div>
              <div className="text-xl font-bold text-white tracking-tight">$1.4T+</div>
              <div className="text-xs text-neutral-400">Annual volume</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400 tracking-tight">99.999%</div>
              <div className="text-xs text-neutral-400">Historical uptime</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-300 tracking-tight">135+</div>
              <div className="text-xs text-neutral-400">Currencies supported</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-300 tracking-tight">500M+</div>
              <div className="text-xs text-neutral-400">Daily API queries</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Interactive Controls Stage Footer (only when standalone without children) */}
      {!children && (
        <div className="relative z-20 mt-8 pt-4 pb-2 px-6 border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Preset Palettes */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all font-medium text-xs",
                      selectedPresetId === preset.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700/80"
                    )}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GradientMeshHero;
