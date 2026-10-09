"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, Volume2, Sliders, RefreshCw, AudioWaveform } from "lucide-react";
import { cn } from "@/lib/utils";

export type SiriState = "idle" | "listening" | "thinking" | "responding";

export interface SiriGlowEdgeProps {
  /** Initial or controlled intelligence state */
  initialState?: SiriState;
  /** Glow intensity factor (0.4 to 2.0) */
  intensity?: number;
  /** Glow spread thickness in px */
  glowWidth?: number;
  /** Whether the chromatic aura breathes / pulses */
  enableBreathing?: boolean;
  /** Inner content or prompt card */
  children?: React.ReactNode;
  /** Container custom classes */
  className?: string;
}

export function SiriGlowEdge({
  initialState = "idle",
  intensity = 1.0,
  glowWidth = 14,
  enableBreathing = true,
  children,
  className,
}: SiriGlowEdgeProps) {
  const [siriState, setSiriState] = useState<SiriState>(initialState);
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const [currentGlowWidth, setCurrentGlowWidth] = useState(glowWidth);
  const [promptText, setPromptText] = useState("");
  const [waveformBars, setWaveformBars] = useState<number[]>([
    24, 45, 78, 62, 90, 48, 85, 34, 60, 40,
  ]);

  // Audio wave simulation when listening/responding
  useEffect(() => {
    if (siriState === "idle") return;

    const interval = setInterval(() => {
      setWaveformBars(
        Array.from({ length: 12 }, () =>
          Math.floor(Math.random() * (siriState === "listening" ? 75 : 45) + 15)
        )
      );
    }, 110);

    return () => clearInterval(interval);
  }, [siriState]);

  // State configurations
  const stateConfigs = {
    idle: {
      badge: "Apple Intelligence Ready",
      color: "text-neutral-400",
      auraSpeed: "12s",
      auraOpacity: 0.55 * currentIntensity,
      blurAmount: `${currentGlowWidth * 1.2}px`,
    },
    listening: {
      badge: "Listening to Audio Input...",
      color: "text-cyan-400",
      auraSpeed: "4s",
      auraOpacity: 0.95 * currentIntensity,
      blurAmount: `${currentGlowWidth * 1.8}px`,
    },
    thinking: {
      badge: "Processing Neural Query...",
      color: "text-purple-400",
      auraSpeed: "2.5s",
      auraOpacity: 0.9 * currentIntensity,
      blurAmount: `${currentGlowWidth * 2.0}px`,
    },
    responding: {
      badge: "Apple Intelligence Synthesizing...",
      color: "text-amber-400",
      auraSpeed: "6s",
      auraOpacity: 0.85 * currentIntensity,
      blurAmount: `${currentGlowWidth * 1.5}px`,
    },
  };

  const currentCfg = stateConfigs[siriState];

  const handleMicToggle = () => {
    if (siriState === "idle") {
      setSiriState("listening");
      setPromptText("Summarize my notifications and draft a reply to Sarah...");
    } else if (siriState === "listening") {
      setSiriState("thinking");
      setTimeout(() => {
        setSiriState("responding");
        setTimeout(() => {
          setSiriState("idle");
        }, 4000);
      }, 1500);
    } else {
      setSiriState("idle");
    }
  };

  if (children) {
    return (
      <div className={cn("relative w-full", className)}>
        <style>{`
          @keyframes siriConicRotate {
            0% { transform: rotate(0deg) scale(1.02); }
            50% { transform: rotate(180deg) scale(1.07); }
            100% { transform: rotate(360deg) scale(1.02); }
          }
          @keyframes siriBreathingAura {
            0%, 100% { opacity: ${currentCfg.auraOpacity * 0.75}; }
            50% { opacity: ${Math.min(1, currentCfg.auraOpacity * 1.25)}; }
          }
        `}</style>
        {/* Layer 1: Hyper-diffuse outer rainbow chromatic aura blur */}
        <div
          className="pointer-events-none absolute -inset-3 rounded-3xl transition-all duration-700"
          style={{
            filter: `blur(${currentCfg.blurAmount})`,
            opacity: currentCfg.auraOpacity,
            animation: enableBreathing ? `siriBreathingAura 3.6s ease-in-out infinite` : undefined,
            background: `conic-gradient(from 0deg at 50% 50%,
              #F43F5E, #FB923C, #FACC15, #34D399, #38BDF8, #818CF8, #C084FC, #F43F5E
            )`,
          }}
        />
        {/* Layer 2: Rotating crisp edge conic contour */}
        <div
          className="pointer-events-none absolute -inset-[3px] rounded-3xl transition-opacity duration-500 overflow-hidden"
          style={{ opacity: Math.min(1, currentCfg.auraOpacity * 1.1) }}
        >
          <div
            className="absolute -inset-[100%]"
            style={{
              animation: `siriConicRotate ${currentCfg.auraSpeed} linear infinite`,
              background: `conic-gradient(from 180deg at 50% 50%,
                #EC4899 0%, #F97316 20%, #38BDF8 40%, #8B5CF6 60%, #06B6D4 80%, #EC4899 100%
              )`,
            }}
          />
        </div>
        {/* Layer 3: Inner Content */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-[#07090E] p-6 text-neutral-100 shadow-2xl transition-all dark:border-neutral-800",
        className
      )}
    >
      {/* Dynamic Keyframe style for Siri conic aura rotation */}
      <style>{`
        @keyframes siriConicRotate {
          0% { transform: rotate(0deg) scale(1.02); }
          50% { transform: rotate(180deg) scale(1.07); }
          100% { transform: rotate(360deg) scale(1.02); }
        }
        @keyframes siriBreathingAura {
          0%, 100% { opacity: ${currentCfg.auraOpacity * 0.75}; }
          50% { opacity: ${Math.min(1, currentCfg.auraOpacity * 1.25)}; }
        }
      `}</style>

      {/* Atmospheric backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(244, 63, 94, 0.12), rgba(59, 130, 246, 0.12), transparent 75%)`,
        }}
      />

      {/* Top Controls Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            Apple Intelligence Siri Glow
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
            Fluid Perimeter Chromatic Aura
          </h2>
          <p className="text-xs text-neutral-400">
            Multi-layer conic gradient perimeter aura with breathing pulse and voice waveform feedback
          </p>
        </div>

        {/* State Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 p-1">
          {(["idle", "listening", "thinking", "responding"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSiriState(st)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition",
                siriState === st
                  ? "bg-neutral-800 text-white shadow-sm ring-1 ring-white/10"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Center Aura Card Showcase */}
      <div className="relative z-10 flex min-h-[330px] items-center justify-center py-8">
        {/* The Outer Aura Wrapper */}
        <div className="relative w-full max-w-xl">
          {/* Layer 1: Hyper-diffuse outer rainbow chromatic aura blur */}
          <div
            className="pointer-events-none absolute -inset-3 rounded-3xl transition-all duration-700"
            style={{
              filter: `blur(${currentCfg.blurAmount})`,
              opacity: currentCfg.auraOpacity,
              animation: enableBreathing
                ? `siriBreathingAura 3.6s ease-in-out infinite`
                : undefined,
              background: `conic-gradient(from 0deg at 50% 50%,
                #F43F5E,
                #FB923C,
                #FACC15,
                #34D399,
                #38BDF8,
                #818CF8,
                #C084FC,
                #F43F5E
              )`,
            }}
          />

          {/* Layer 2: Rotating crisp edge conic contour */}
          <div
            className="pointer-events-none absolute -inset-[3px] rounded-3xl transition-opacity duration-500 overflow-hidden"
            style={{
              opacity: Math.min(1, currentCfg.auraOpacity * 1.1),
            }}
          >
            <div
              className="absolute -inset-[100%]"
              style={{
                animation: `siriConicRotate ${currentCfg.auraSpeed} linear infinite`,
                background: `conic-gradient(from 180deg at 50% 50%,
                  #EC4899 0%,
                  #F97316 20%,
                  #38BDF8 40%,
                  #8B5CF6 60%,
                  #06B6D4 80%,
                  #EC4899 100%
                )`,
              }}
            />
          </div>

          {/* Layer 3: Inner Card Core Container */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0B0E17]/95 p-6 backdrop-blur-2xl shadow-2xl">
            {children || (
              <div className="space-y-5">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full animate-ping",
                        siriState === "listening"
                          ? "bg-cyan-400"
                          : siriState === "thinking"
                          ? "bg-purple-400"
                          : siriState === "responding"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      )}
                    />
                    <span className={cn("text-xs font-medium", currentCfg.color)}>
                      {currentCfg.badge}
                    </span>
                  </div>

                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-neutral-400 border border-white/10">
                    A18 Neural Engine
                  </span>
                </div>

                {/* Simulated Assistant Query / Response */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-neutral-200">
                  {siriState === "idle" && (
                    <span className="text-neutral-400">
                      Tap the microphone button or speak: &quot;Hey Siri, summarize the quarterly earnings and draft my key points.&quot;
                    </span>
                  )}
                  {siriState === "listening" && (
                    <span className="text-white font-medium animate-pulse">
                      &quot;{promptText}&quot;
                    </span>
                  )}
                  {siriState === "thinking" && (
                    <span className="text-purple-300">
                      Synthesizing context across Mail, Calendar, and Messages with on-device model...
                    </span>
                  )}
                  {siriState === "responding" && (
                    <span className="text-neutral-100">
                      &quot;You have 3 unread messages from Sarah regarding the prototype review at 3 PM. Would you like me to confirm?&quot;
                    </span>
                  )}
                </div>

                {/* Animated Voice Waveform Bars when active */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-1.5 h-8">
                    {siriState !== "idle" ? (
                      waveformBars.map((height, i) => (
                        <motion.span
                          key={i}
                          animate={{ height: `${height}%` }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 via-purple-500 to-rose-400"
                        />
                      ))
                    ) : (
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                        <AudioWaveform className="h-3.5 w-3.5" />
                        Microphone idle
                      </span>
                    )}
                  </div>

                  {/* Primary Trigger Button */}
                  <button
                    type="button"
                    onClick={handleMicToggle}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-lg transition active:scale-95",
                      siriState === "listening"
                        ? "bg-rose-500 text-white shadow-rose-500/25 animate-pulse"
                        : "bg-white text-neutral-950 hover:bg-neutral-200"
                    )}
                  >
                    {siriState === "listening" ? (
                      <>
                        <MicOff className="h-3.5 w-3.5" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-3.5 w-3.5 text-neutral-900" />
                        <span>Talk to Siri</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Tuning Sliders */}
      <div className="relative z-10 mt-4 grid grid-cols-1 gap-4 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 backdrop-blur-md sm:grid-cols-2">
        {/* Aura Intensity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Glow Intensity</span>
            <span className="font-mono text-neutral-400">{currentIntensity.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={0.4}
            max={2.0}
            step={0.1}
            value={currentIntensity}
            onChange={(e) => setCurrentIntensity(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-purple-500"
          />
        </div>

        {/* Aura Thickness Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium">Perimeter Glow Spread</span>
            <span className="font-mono text-neutral-400">{currentGlowWidth}px</span>
          </div>
          <input
            type="range"
            min={6}
            max={30}
            step={2}
            value={currentGlowWidth}
            onChange={(e) => setCurrentGlowWidth(parseInt(e.target.value, 10))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}

export default SiriGlowEdge;
