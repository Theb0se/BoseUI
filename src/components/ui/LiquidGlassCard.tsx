"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, CreditCard, Shield, Zap, Eye, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiquidGlassCardProps {
  /** Title inside glass card */
  title?: string;
  /** Subtitle or descriptor */
  subtitle?: string;
  /** Frost blur strength in px */
  blurStrength?: number;
  /** 3D Tilt sensitivity multiplier */
  tiltFactor?: number;
  /** Enable chromatic refraction bevel */
  chromaticEdge?: boolean;
  /** Optional custom card content */
  children?: React.ReactNode;
  /** Root container className */
  className?: string;
}

export function LiquidGlassCard({
  title = "Apple Card Titanium",
  subtitle = "Mastercard • 7492 • World Elite",
  blurStrength = 24,
  tiltFactor = 1.0,
  chromaticEdge = true,
  children,
  className,
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<"apple-card" | "spatial" | "audio">("apple-card");
  const [currentTilt, setCurrentTilt] = useState(tiltFactor);
  const [showChromatic, setShowChromatic] = useState(chromaticEdge);
  const [frostedAlpha, setFrostedAlpha] = useState(0.25);
  const [isPressed, setIsPressed] = useState(false);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateXRaw = useTransform(mouseY, [0, 1], [15 * currentTilt, -15 * currentTilt]);
  const rotateYRaw = useTransform(mouseX, [0, 1], [-18 * currentTilt, 18 * currentTilt]);

  const rotateX = useSpring(rotateXRaw, { stiffness: 220, damping: 20 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 220, damping: 20 });

  // Specular reflection position
  const shineX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  if (children) {
    return (
      <div className={cn("relative select-none", className)} style={{ perspective: 1000 }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          animate={{ scale: isPressed ? 0.98 : 1 }}
          transition={{ scale: { type: "spring", stiffness: 450, damping: 25 } }}
          className={cn(
            "group relative w-full cursor-grab active:cursor-grabbing rounded-3xl p-[1.5px] transition-shadow duration-300",
            showChromatic
              ? "bg-gradient-to-br from-cyan-400/50 via-white/40 to-pink-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              : "bg-white/20 shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
          )}
        >
          <div
            className="relative overflow-hidden rounded-[22px] border border-white/30 backdrop-blur-2xl transition-colors duration-300"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${frostedAlpha})`,
              boxShadow: `
                inset 0 1px 1px 0 rgba(255, 255, 255, 0.6),
                inset 0 -1px 2px 0 rgba(0, 0, 0, 0.4)
              `,
            }}
          >
            <motion.div
              className="pointer-events-none absolute -inset-full opacity-60 transition-opacity group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle 320px at ${shineX} ${shineY}, rgba(255, 255, 255, 0.6), transparent 70%)`,
              }}
            />
            {showChromatic && (
              <div
                className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,0.5) 0%, rgba(236,72,153,0.5) 100%)",
                }}
              />
            )}
            <div className="relative z-10 p-6 sm:p-8">{children}</div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-[#060810] p-6 text-neutral-100 shadow-2xl transition-all dark:border-neutral-800",
        className
      )}
    >
      {/* Dynamic atmospheric fluid background bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 -left-20 h-96 w-96 rounded-full blur-[90px] opacity-40 transition-transform duration-1000"
          style={{
            background: "radial-gradient(circle, #38BDF8 0%, #6366F1 60%, transparent 80%)",
          }}
        />
        <div
          className="absolute -bottom-20 -right-16 h-96 w-96 rounded-full blur-[100px] opacity-35 transition-transform duration-1000"
          style={{
            background: "radial-gradient(circle, #EC4899 0%, #8B5CF6 60%, transparent 80%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/3 h-64 w-64 -translate-y-1/2 rounded-full blur-[80px] opacity-25"
          style={{
            background: "radial-gradient(circle, #F59E0B 0%, #10B981 70%, transparent 80%)",
          }}
        />
      </div>

      {/* Top Header & Preset Switches */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-pink-400" />
            Liquid Glassmorphism Engine
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
            Liquid Glass Specular Tilt Card
          </h2>
          <p className="text-xs text-neutral-400">
            Double-layer backdrop blur with dynamic cursor specular glare and chromatic edge refraction
          </p>
        </div>

        {/* Card Template Presets */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          {(["apple-card", "spatial", "audio"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setActivePreset(preset)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition",
                activePreset === preset
                  ? "bg-white/20 text-white shadow-sm ring-1 ring-white/20"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              {preset.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Center 3D Interactive Perspective Viewport */}
      <div
        className="relative z-10 flex min-h-[350px] items-center justify-center py-8 select-none"
        style={{ perspective: 1000 }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            scale: isPressed ? 0.96 : 1,
          }}
          transition={{
            scale: { type: "spring", stiffness: 450, damping: 25 },
          }}
          className={cn(
            "group relative w-full max-w-md cursor-grab active:cursor-grabbing rounded-3xl p-[1.5px] transition-shadow duration-300",
            showChromatic
              ? "bg-gradient-to-br from-cyan-400/50 via-white/40 to-pink-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              : "bg-white/20 shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Double-layer Backdrop Blur Chassis */}
          <div
            className="relative overflow-hidden rounded-[22px] border border-white/30 backdrop-blur-2xl transition-colors duration-300"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${frostedAlpha})`,
              boxShadow: `
                inset 0 1px 1px 0 rgba(255, 255, 255, 0.6),
                inset 0 -1px 2px 0 rgba(0, 0, 0, 0.4)
              `,
            }}
          >
            {/* Dynamic Specular Spotlight Highlight Tracking Cursor */}
            <motion.div
              className="pointer-events-none absolute -inset-full opacity-60 transition-opacity group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle 320px at ${shineX} ${shineY}, rgba(255, 255, 255, 0.6), transparent 70%)`,
              }}
            />

            {/* Micro Chromatic Refraction Sheen Overlay */}
            {showChromatic && (
              <div
                className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,0.5) 0%, rgba(236,72,153,0.5) 100%)",
                }}
              />
            )}

            {/* Card Content Based on Preset */}
            <div className="relative z-10 p-7">
              {children || (
                <>
                  {activePreset === "apple-card" && (
                    <div className="space-y-12">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-6 w-6 text-white drop-shadow" />
                          <span className="font-semibold tracking-wide text-white drop-shadow-sm">
                            Apple Card
                          </span>
                        </div>
                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                          Titanium Edition
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="h-9 w-12 rounded-lg border border-amber-300/40 bg-gradient-to-tr from-amber-400 to-amber-200/90 shadow-sm" />
                        <div>
                          <div className="font-mono text-sm tracking-widest text-white/90 drop-shadow">
                            •••• •••• •••• 7492
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-white/80">
                            <span className="font-medium uppercase tracking-wider">
                              Alexander Wright
                            </span>
                            <span className="font-mono">10/29</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreset === "spatial" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-sky-300" />
                          <span className="font-semibold text-white">Spatial Widget</span>
                        </div>
                        <span className="text-xs font-mono text-sky-200">visionOS 2.0</span>
                      </div>

                      <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                        <div className="text-xs font-medium text-white/90">
                          Immersive Environment
                        </div>
                        <div className="mt-1 text-[11px] text-white/70">
                          Haleakalā Crater • 100% Reality Blend
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-white/20">
                            <div className="h-full w-3/4 rounded-full bg-sky-400" />
                          </div>
                          <span className="text-[10px] font-mono text-white/80">75%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/80">
                        <span>Audio Raytracing: Spatial</span>
                        <Zap className="h-4 w-4 text-amber-300" />
                      </div>
                    </div>
                  )}

                  {activePreset === "audio" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                          AirPods Max
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                      </div>

                      <div className="text-center py-2">
                        <h4 className="text-lg font-bold text-white drop-shadow">
                          Symphony No. 9 in D Minor
                        </h4>
                        <p className="text-xs text-white/75 mt-0.5">
                          High-Res Lossless • Spatial Audio
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-6 pt-2">
                        <button type="button" className="text-white/80 hover:text-white transition">
                          ⏮
                        </button>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/30 text-white shadow-lg backdrop-blur-md transition hover:scale-105"
                        >
                          ⏸
                        </button>
                        <button type="button" className="text-white/80 hover:text-white transition">
                          ⏭
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Controls Drawer */}
      <div className="relative z-10 mt-4 grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md sm:grid-cols-3">
        {/* Tilt Factor Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">3D Tilt Sensitivity</span>
            <span className="font-mono text-neutral-400">{currentTilt.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.1}
            value={currentTilt}
            onChange={(e) => setCurrentTilt(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-700 accent-blue-500"
          />
        </div>

        {/* Frosted Opacity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Glass Frosted Tint</span>
            <span className="font-mono text-neutral-400">{Math.round(frostedAlpha * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.5}
            step={0.05}
            value={frostedAlpha}
            onChange={(e) => setFrostedAlpha(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-700 accent-blue-500"
          />
        </div>

        {/* Chromatic Edge Refraction Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
            <input
              type="checkbox"
              checked={showChromatic}
              onChange={(e) => setShowChromatic(e.target.checked)}
              className="rounded border-neutral-700 bg-neutral-800 text-pink-500 focus:ring-0"
            />
            <span>Chromatic Edge Refraction</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default LiquidGlassCard;
