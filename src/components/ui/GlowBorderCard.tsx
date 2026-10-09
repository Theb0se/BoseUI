"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Globe2,
  Sparkles,
  Cpu,
  ArrowUpRight,
  Zap,
  Sliders,
  CheckCircle,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlowPalette {
  id: string;
  name: string;
  gradient: string;
  glowColor: string;
  accentText: string;
  badgeBg: string;
}

const GLOW_PALETTES: GlowPalette[] = [
  {
    id: "stripe-indigo",
    name: "Stripe Indigo / Cyan",
    gradient: "linear-gradient(135deg, #6366f1, #06b6d4)",
    glowColor: "rgba(99, 102, 241, 0.45)",
    accentText: "text-indigo-400",
    badgeBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300",
  },
  {
    id: "electric-violet",
    name: "Electric Violet",
    gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
    glowColor: "rgba(168, 85, 247, 0.45)",
    accentText: "text-purple-400",
    badgeBg: "bg-purple-500/10 border-purple-500/20 text-purple-300",
  },
  {
    id: "emerald-glow",
    name: "Emerald Glow",
    gradient: "linear-gradient(135deg, #10b981, #14b8a6)",
    glowColor: "rgba(16, 185, 129, 0.45)",
    accentText: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  },
  {
    id: "golden-amber",
    name: "Golden Amber",
    gradient: "linear-gradient(135deg, #f59e0b, #f43f5e)",
    glowColor: "rgba(245, 158, 11, 0.45)",
    accentText: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-300",
  },
];

interface FeatureCardItem {
  id: string;
  badge: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
}

const CARD_DATA: FeatureCardItem[] = [
  {
    id: "radar",
    badge: "Machine Learning",
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Adaptive 3D Secure",
    description:
      "Dynamically routes authentications through frictionless SCA exemptions, reducing checkout abandonment by 24%.",
    metric: "99.8%",
    metricLabel: "Fraud prevention accuracy",
  },
  {
    id: "payouts",
    badge: "Global Rails",
    icon: <Globe2 className="h-5 w-5" />,
    title: "Instant Global Payouts",
    description:
      "Disburse funds in 45+ currencies to linked debit cards and domestic accounts with sub-second finality.",
    metric: "135+",
    metricLabel: "Supported currencies",
  },
  {
    id: "dunning",
    badge: "Revenue Recovery",
    icon: <Sparkles className="h-5 w-5" />,
    title: "Smart Retry Dunning",
    description:
      "Recovers up to 43% of failed recurring billing renewals with adaptive timing and network token synchronization.",
    metric: "43%",
    metricLabel: "Average recovered ARR",
  },
  {
    id: "unified-api",
    badge: "Unified Schema",
    icon: <Cpu className="h-5 w-5" />,
    title: "Unified Webhook Fabric",
    description:
      "Single declarative schema syncing subscriptions, dispute events, and balance updates across your tech stack.",
    metric: "0.2ms",
    metricLabel: "Event dispatch latency",
  },
];

export interface GlowBorderCardProps {
  className?: string;
  defaultRadius?: number;
  defaultIntensity?: number;
}

export function GlowBorderCard({
  className,
  defaultRadius = 280,
  defaultIntensity = 0.5,
}: GlowBorderCardProps) {
  const [selectedPalette, setSelectedPalette] = useState<string>("stripe-indigo");
  const [radius, setRadius] = useState<number>(defaultRadius);
  const [intensity, setIntensity] = useState<number>(defaultIntensity);
  const [enableLift, setEnableLift] = useState<boolean>(true);

  const activePalette =
    GLOW_PALETTES.find((p) => p.id === selectedPalette) || GLOW_PALETTES[0];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#070913] p-6 text-white flex flex-col justify-between shadow-2xl selection:bg-indigo-500/30",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 max-w-2xl mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
            Reactive Pointer Illumination
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          High-Gloss Glow Border Cards
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Stripe-style dynamic radial masking that traces cursor movement across borders and faces with zero layout reflow.
        </p>
      </div>

      {/* Grid of Glow Border Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto w-full mb-6">
        {CARD_DATA.map((card) => (
          <SingleGlowCard
            key={card.id}
            card={card}
            palette={activePalette}
            radius={radius}
            intensity={intensity}
            enableLift={enableLift}
          />
        ))}
      </div>

      {/* Interactive Controls Stage Footer */}
      <div className="relative z-20 mt-4 pt-4 border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md -mx-6 -mb-6 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Palette Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-400 font-medium flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-indigo-400" />
            Theme:
          </span>
          {GLOW_PALETTES.map((pal) => (
            <button
              key={pal.id}
              onClick={() => setSelectedPalette(pal.id)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                selectedPalette === pal.id
                  ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white"
              )}
            >
              {pal.name}
            </button>
          ))}
        </div>

        {/* Sliders: Radius & Intensity */}
        <div className="flex flex-wrap items-center gap-4 text-neutral-400">
          <div className="flex items-center gap-2">
            <span>Glow Radius ({radius}px):</span>
            <input
              type="range"
              min="160"
              max="450"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-20 accent-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span>Intensity ({Math.round(intensity * 100)}%):</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-20 accent-indigo-500"
            />
          </div>

          <button
            onClick={() => setEnableLift(!enableLift)}
            className={cn(
              "px-2.5 py-1 rounded border text-xs font-medium transition-colors",
              enableLift
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-neutral-800/60 border-neutral-700 text-neutral-400"
            )}
          >
            Hover Lift: {enableLift ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SingleGlowCard({
  card,
  palette,
  radius,
  intensity,
  enableLift,
}: {
  card: FeatureCardItem;
  palette: GlowPalette;
  radius: number;
  intensity: number;
  enableLift: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handleMouseMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-2xl p-[1px] transition-all duration-300",
        enableLift && "hover:-translate-y-1"
      )}
      style={{
        background: isHovered
          ? `radial-gradient(${radius}px circle at ${coords.x}px ${coords.y}px, ${palette.glowColor}, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.03) 100%)`
          : "rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Card Content Shell */}
      <div className="relative h-full w-full rounded-2xl bg-[#090b19] p-6 overflow-hidden flex flex-col justify-between">
        {/* Subtle face sheen gradient tracking cursor */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? intensity * 0.35 : 0,
            background: `radial-gradient(${radius * 1.2}px circle at ${coords.x}px ${coords.y}px, ${palette.glowColor}, transparent 70%)`,
          }}
        />

        {/* Card Top: Badge + Action Icon */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5",
              palette.badgeBg
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {card.badge}
          </span>

          <div
            className={cn(
              "h-8 w-8 rounded-lg bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center transition-colors group-hover:text-white",
              palette.accentText
            )}
          >
            {card.icon}
          </div>
        </div>

        {/* Card Body */}
        <div className="relative z-10 my-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-neutral-100 transition-colors">
            {card.title}
          </h3>
          <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">
            {card.description}
          </p>
        </div>

        {/* Card Footer: Metric */}
        <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex items-end justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-mono">{card.metricLabel}</div>
            <div className={cn("text-xl font-bold tracking-tight mt-0.5", palette.accentText)}>
              {card.metric}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-neutral-400 group-hover:text-white transition-colors cursor-pointer">
            <span>Learn more</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlowBorderCard;
