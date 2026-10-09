"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, Cpu, Info, Check, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColorFinish {
  id: string;
  name: string;
  tagline: string;
  hex: string;
  secondaryHex: string;
  ambientRgba: string;
  specs: {
    alloy: string;
    coating: string;
    reflectance: string;
    finishTone: string;
  };
}

export interface ColorFinishPickerProps {
  /** Array of available color finishes */
  finishes?: ColorFinish[];
  /** Default selected finish ID */
  defaultFinishId?: string;
  /** Callback when finish changes */
  onChange?: (finish: ColorFinish) => void;
  /** Whether to show the top header and angle toggle */
  showHeader?: boolean;
  /** Custom container class names */
  className?: string;
}

const DEFAULT_FINISHES: ColorFinish[] = [
  {
    id: "natural-titanium",
    name: "Natural Titanium",
    tagline: "Raw aerospace metallurgy with warm industrial character",
    hex: "#9B9994",
    secondaryHex: "#777570",
    ambientRgba: "rgba(155, 153, 148, 0.16)",
    specs: {
      alloy: "Grade 5 (Ti-6Al-4V)",
      coating: "Sub-micron PVD satin etch",
      reflectance: "14% Diffuse Metallic",
      finishTone: "Warm Pewter Neutral",
    },
  },
  {
    id: "desert-titanium",
    name: "Desert Titanium",
    tagline: "Golden bronze iridescence inspired by desert quartz formations",
    hex: "#C4AFA0",
    secondaryHex: "#9E8575",
    ambientRgba: "rgba(196, 175, 160, 0.22)",
    specs: {
      alloy: "Grade 5 (Ti-6Al-4V)",
      coating: "Gold-Zirconium ion bond",
      reflectance: "18% Luminous Sheen",
      finishTone: "Warm Amber Champagne",
    },
  },
  {
    id: "white-titanium",
    name: "White Titanium",
    tagline: "Pure pristine silver-white with hyper-clarity ceramic glass",
    hex: "#E5E5E7",
    secondaryHex: "#B8B8BC",
    ambientRgba: "rgba(229, 229, 231, 0.20)",
    specs: {
      alloy: "Grade 5 (Ti-6Al-4V)",
      coating: "Optically clear nano-ceramic seal",
      reflectance: "26% Specular Reflection",
      finishTone: "Cool Glacial Platinum",
    },
  },
  {
    id: "black-titanium",
    name: "Black Titanium",
    tagline: "Deep space carbon-dark alloy with light-absorbing micro-texture",
    hex: "#343438",
    secondaryHex: "#1E1E22",
    ambientRgba: "rgba(52, 52, 56, 0.35)",
    specs: {
      alloy: "Grade 5 (Ti-6Al-4V)",
      coating: "Diamond-Like Carbon (DLC)",
      reflectance: "4% Deep Matte Absorptive",
      finishTone: "Midnight Obsidian",
    },
  },
];

export function ColorFinishPicker({
  finishes = DEFAULT_FINISHES,
  defaultFinishId = "natural-titanium",
  onChange,
  showHeader = true,
  className,
}: ColorFinishPickerProps) {
  const [selectedId, setSelectedId] = useState(defaultFinishId);
  const [viewAngle, setViewAngle] = useState<"rear" | "profile" | "camera">("rear");
  const [showSpecs, setShowSpecs] = useState(true);

  const activeFinish =
    finishes.find((f) => f.id === selectedId) || finishes[0];

  const handleSelect = (finish: ColorFinish) => {
    setSelectedId(finish.id);
    onChange?.(finish);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-2xl transition-all dark:border-neutral-800",
        className
      )}
    >
      {/* Dynamic Synchronized Ambient Page Tinting */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle 700px at 50% 38%, ${activeFinish.ambientRgba}, transparent 70%),
                       radial-gradient(circle 500px at 80% 85%, ${activeFinish.ambientRgba}, transparent 65%)`,
        }}
      />

      {/* Header Bar */}
      {showHeader && (
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Finish & Material Studio
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Apple Titanium Finishes
            </h2>
            <p className="text-xs text-neutral-400">
              Select a metallic finish to crossfade precision aerospace graphics and synchronized ambient lighting
            </p>
          </div>

          {/* View Angle Toggle */}
          <div className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 p-1">
            {(["rear", "profile", "camera"] as const).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setViewAngle(view)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition",
                  viewAngle === view
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                {view} view
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="relative z-10 grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-12">
        {/* Left / Center Graphic: Crossfading Device Model */}
        <div className="flex min-h-[340px] items-center justify-center lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFinish.id}-${viewAngle}`}
              initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              <svg
                width="280"
                height="340"
                viewBox="0 0 280 340"
                className="overflow-visible filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  {/* Active finish metallic chassis gradient */}
                  <linearGradient id={`frameGrad-${activeFinish.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={activeFinish.hex} />
                    <stop offset="25%" stopColor="#ffffff" stopOpacity={0.6} />
                    <stop offset="50%" stopColor={activeFinish.secondaryHex} />
                    <stop offset="80%" stopColor={activeFinish.hex} />
                    <stop offset="100%" stopColor={activeFinish.secondaryHex} />
                  </linearGradient>

                  {/* Back glass matte gradient */}
                  <linearGradient id={`glassGrad-${activeFinish.id}`} x1="0%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" stopColor={activeFinish.hex} stopOpacity={0.85} />
                    <stop offset="100%" stopColor={activeFinish.secondaryHex} stopOpacity={0.95} />
                  </linearGradient>

                  {/* Camera plateau frosted gradient */}
                  <linearGradient id={`plateauGrad-${activeFinish.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={activeFinish.hex} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={activeFinish.secondaryHex} stopOpacity={0.7} />
                  </linearGradient>
                </defs>

                {/* Render Based on Selected View Angle */}
                {viewAngle === "rear" && (
                  <g transform="translate(140, 170)">
                    {/* Device Chassis Outer Frame */}
                    <rect
                      x="-100"
                      y="-155"
                      width="200"
                      height="310"
                      rx="42"
                      fill={`url(#frameGrad-${activeFinish.id})`}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                    />

                    {/* Back Matte Glass Texture */}
                    <rect
                      x="-96"
                      y="-151"
                      width="192"
                      height="302"
                      rx="38"
                      fill={`url(#glassGrad-${activeFinish.id})`}
                    />

                    {/* Apple Logo Silhouette in Finish Sheen */}
                    <path
                      d="M 0,-15 C 3,-15 7,-18 7,-23 C 2,-23 -2,-18 0,-15 Z M 9,-8 C 4,-9 0,-5 0,-5 C 0,-5 -4,-9 -9,-8 C -14,-7 -17, -2 -17, 8 C -17, 19 -9, 28 0, 28 C 9, 28 17, 19 17, 8 C 17,-2 14,-7 9,-8 Z"
                      fill="rgba(255,255,255,0.25)"
                      transform="translate(0, 15) scale(0.65)"
                    />

                    {/* Camera Island Plateau */}
                    <rect
                      x="-84"
                      y="-138"
                      width="92"
                      height="92"
                      rx="24"
                      fill={`url(#plateauGrad-${activeFinish.id})`}
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="1.5"
                    />

                    {/* Three Pro Lens Rings */}
                    {/* Top Lens (Main 48MP) */}
                    <circle cx="-58" cy="-114" r="17" fill="#0C0D10" stroke={activeFinish.hex} strokeWidth="2.5" />
                    <circle cx="-58" cy="-114" r="11" fill="#141720" stroke="#374151" strokeWidth="1" />
                    <circle cx="-55" cy="-117" r="4" fill="rgba(255,255,255,0.4)" />

                    {/* Bottom Lens (Ultra Wide) */}
                    <circle cx="-58" cy="-70" r="17" fill="#0C0D10" stroke={activeFinish.hex} strokeWidth="2.5" />
                    <circle cx="-58" cy="-70" r="11" fill="#141720" stroke="#374151" strokeWidth="1" />
                    <circle cx="-55" cy="-73" r="4" fill="rgba(255,255,255,0.4)" />

                    {/* Right Lens (5x Telephoto Tetraprism) */}
                    <circle cx="-16" cy="-92" r="17" fill="#0C0D10" stroke={activeFinish.hex} strokeWidth="2.5" />
                    <circle cx="-16" cy="-92" r="11" fill="#141720" stroke="#374151" strokeWidth="1" />
                    <circle cx="-13" cy="-95" r="4" fill="rgba(255,255,255,0.4)" />

                    {/* True Tone Flash & LiDAR */}
                    <circle cx="-16" cy="-122" r="6" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                    <circle cx="-16" cy="-62" r="4" fill="#1F2937" stroke="#111827" strokeWidth="1" />
                  </g>
                )}

                {viewAngle === "profile" && (
                  <g transform="translate(140, 170)">
                    {/* Profile Edge: Micro-blasted titanium rail */}
                    <rect
                      x="-14"
                      y="-155"
                      width="28"
                      height="310"
                      rx="14"
                      fill={`url(#frameGrad-${activeFinish.id})`}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1.5"
                    />

                    {/* Antenna Band lines */}
                    <line x1="-14" y1="-100" x2="14" y2="-100" stroke="#1F2430" strokeWidth="2" />
                    <line x1="-14" y1="100" x2="14" y2="100" stroke="#1F2430" strokeWidth="2" />

                    {/* Action Button */}
                    <rect x="12" y="-70" width="4" height="24" rx="2" fill={activeFinish.secondaryHex} stroke="#FFFFFF" strokeWidth="0.8" />

                    {/* Volume Up / Down Buttons */}
                    <rect x="12" y="-35" width="4" height="32" rx="2" fill={activeFinish.secondaryHex} />
                    <rect x="12" y="5" width="4" height="32" rx="2" fill={activeFinish.secondaryHex} />

                    {/* Camera Plateau Profile Bump */}
                    <path
                      d="M -14,-135 L -26,-130 L -26,-55 L -14,-50 Z"
                      fill={`url(#plateauGrad-${activeFinish.id})`}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1.2"
                    />
                  </g>
                )}

                {viewAngle === "camera" && (
                  <g transform="translate(140, 170)">
                    {/* Macro Close-up Camera Plateau & Tetraprism ring */}
                    <circle cx="0" cy="0" r="105" fill={`url(#plateauGrad-${activeFinish.id})`} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    
                    {/* Concentric Macro Lens Ring */}
                    <circle cx="0" cy="0" r="82" fill="#0E1015" stroke={activeFinish.hex} strokeWidth="7" />
                    <circle cx="0" cy="0" r="68" fill="#171A24" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="50" fill="#08090C" />
                    <circle cx="0" cy="0" r="30" fill="#0F172A" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />

                    {/* Specular glare arcs */}
                    <path d="M -45 -45 A 64 64 0 0 1 45 -45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
                    <text x="0" y="8" fill="#9CA3AF" fontSize="10" textAnchor="middle" fontFamily="monospace">48MP • ƒ/1.78</text>
                  </g>
                )}
              </svg>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Swatches with Concentric Rings & Specs */}
        <div className="space-y-6 lg:col-span-5">
          {/* Active Finish Title & Description */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Titanium Alloy Finish
            </span>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">
              {activeFinish.name}
            </h3>
            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
              {activeFinish.tagline}
            </p>
          </div>

          {/* Circular Swatches with Apple-style Concentric Selection Rings */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-300">
              Select Finish
            </label>
            <div className="flex items-center gap-3.5 pt-1">
              {finishes.map((finish) => {
                const isSelected = finish.id === activeFinish.id;
                return (
                  <button
                    key={finish.id}
                    type="button"
                    onClick={() => handleSelect(finish)}
                    aria-label={`Select ${finish.name}`}
                    className="group relative flex items-center justify-center p-1 focus:outline-none"
                  >
                    {/* Concentric Selection Outer Ring */}
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300",
                        isSelected
                          ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-950 scale-105"
                          : "ring-1 ring-neutral-700/60 hover:ring-neutral-500 hover:scale-105"
                      )}
                    >
                      {/* Inner Color Swatch Circle */}
                      <span
                        className="h-8 w-8 rounded-full shadow-inner transition-transform group-hover:scale-95"
                        style={{
                          backgroundColor: finish.hex,
                          boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.5)`,
                        }}
                      />
                    </div>

                    {/* Tooltip on Hover */}
                    <span className="pointer-events-none absolute -bottom-7 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-neutral-200 opacity-0 shadow-lg ring-1 ring-neutral-700 transition-opacity group-hover:opacity-100">
                      {finish.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technical Material Specifications */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/70">
              <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                <Shield className="h-3.5 w-3.5 text-neutral-400" />
                Material Metallurgy
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                {activeFinish.specs.alloy}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">
                  Surface Treatment
                </span>
                <span className="font-medium text-neutral-200">
                  {activeFinish.specs.coating}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">
                  Optical Sheen
                </span>
                <span className="font-medium text-neutral-200">
                  {activeFinish.specs.reflectance}
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-neutral-800/50">
                <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">
                  Chroma Profile
                </span>
                <span className="font-medium text-neutral-200">
                  {activeFinish.specs.finishTone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorFinishPicker;
