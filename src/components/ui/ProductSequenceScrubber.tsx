"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCw, Layers, Sparkles, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCallout {
  frameRange: [number, number];
  title: string;
  subtitle: string;
  tag: string;
  position: { x: number; y: number };
}

export interface ProductSequenceScrubberProps {
  /** Total sequence steps / frames around 360 degrees */
  totalFrames?: number;
  /** Initial frame index */
  defaultFrame?: number;
  /** Auto rotate on mount */
  defaultAutoPlay?: boolean;
  /** Initial explosion / disassemble view */
  defaultExploded?: boolean;
  /** Custom callout items synchronized with sequence angles */
  callouts?: FeatureCallout[];
  /** Whether to show the top header and controls bar */
  showHeader?: boolean;
  /** Optional custom class names */
  className?: string;
}

const DEFAULT_CALLOUTS: FeatureCallout[] = [
  {
    frameRange: [3, 9],
    title: "Grade 5 Titanium Band",
    subtitle: "Precision PVD-coated aerospace alloy with sub-micron brushed finish",
    tag: "Chassis",
    position: { x: 74, y: 32 },
  },
  {
    frameRange: [10, 16],
    title: "Dynamic Action Button",
    subtitle: "Haptic piezo-actuated key with instant customizable trigger shortcuts",
    tag: "Interface",
    position: { x: 26, y: 38 },
  },
  {
    frameRange: [17, 25],
    title: "A18 Pro Silicon Substrate",
    subtitle: "Second-gen 3nm architecture with 16-core Neural Engine & hardware RT",
    tag: "Silicon",
    position: { x: 50, y: 52 },
  },
  {
    frameRange: [27, 34],
    title: "Next-Gen Ceramic Shield",
    subtitle: "Nano-crystal formulation with 4x improved drop resilience and oleophobic seal",
    tag: "Display",
    position: { x: 68, y: 64 },
  },
];

export function ProductSequenceScrubber({
  totalFrames = 36,
  defaultFrame = 6,
  defaultAutoPlay = false,
  defaultExploded = false,
  callouts = DEFAULT_CALLOUTS,
  showHeader = true,
  className,
}: ProductSequenceScrubberProps) {
  const [currentFrame, setCurrentFrame] = useState(defaultFrame);
  const [isPlaying, setIsPlaying] = useState(defaultAutoPlay);
  const [isExploded, setIsExploded] = useState(defaultExploded);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 85);
    return () => clearInterval(interval);
  }, [isPlaying, totalFrames]);

  // Derive angle & rotation properties
  const rotationAngle = (currentFrame / totalFrames) * 360;
  const rad = (rotationAngle * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  // Active callout matching frame
  const activeCallout = useMemo(() => {
    return callouts.find(
      (c) => currentFrame >= c.frameRange[0] && currentFrame <= c.frameRange[1]
    );
  }, [callouts, currentFrame]);

  // Angle presets
  const presets = [
    { label: "Front 0°", frame: 0 },
    { label: "Action 90°", frame: Math.round(totalFrames * 0.25) },
    { label: "Rear 180°", frame: Math.round(totalFrames * 0.5) },
    { label: "Profile 270°", frame: Math.round(totalFrames * 0.75) },
  ];

  const handleSeek = (frame: number) => {
    setCurrentFrame(frame);
    setIsPlaying(false);
  };

  // Exploded layer offsets
  const explodeZ = isExploded ? 1 : 0;

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-2xl transition-all dark:border-neutral-800",
        className
      )}
    >
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 600px at 50% 45%, rgba(60, 100, 160, 0.18), transparent 70%),
                       radial-gradient(circle 400px at 80% 80%, rgba(210, 140, 70, 0.08), transparent 70%)`,
        }}
      />

      {/* Top Header & Metadata */}
      {showHeader && (
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              360° Hardware Sequence Scrubber
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Pro Titanium Design Sequence
            </h2>
            <p className="text-xs text-neutral-400">
              Scrub continuous multi-angle inspection • Disassemble layer architecture
            </p>
          </div>

          {/* Top Controls: Play/Pause, Explode */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 shadow-sm transition hover:bg-neutral-800 active:scale-95"
              aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-blue-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Spin 360°</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExploded(!isExploded)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition active:scale-95",
                isExploded
                  ? "border-blue-500/60 bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                  : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isExploded ? "Assembled" : "Explode Layers"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Center 3D Interactive Vector Stage */}
      <div className="relative flex min-h-[340px] items-center justify-center py-6 select-none">
        {/* Synchronized Callout Badge */}
        <AnimatePresence mode="wait">
          {activeCallout && (
            <motion.div
              key={activeCallout.title}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              style={{
                top: `${activeCallout.position.y}%`,
                left: `${activeCallout.position.x}%`,
              }}
              className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-blue-500/30 bg-neutral-900/95 p-3.5 shadow-2xl backdrop-blur-xl max-w-[240px] ring-1 ring-white/10"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                <Sparkles className="h-3 w-3" />
                {activeCallout.tag}
              </div>
              <div className="mt-1 text-xs font-semibold text-white">
                {activeCallout.title}
              </div>
              <div className="mt-0.5 text-[11px] leading-tight text-neutral-400">
                {activeCallout.subtitle}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vector 3D Phone Model rendered with perspective projection */}
        <div
          className="relative flex items-center justify-center transition-transform duration-200"
          style={{
            perspective: 1200,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main SVG assembly */}
          <svg
            width="320"
            height="340"
            viewBox="0 0 320 340"
            className="overflow-visible filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
          >
            <defs>
              {/* Titanium frame gradient */}
              <linearGradient id="titaniumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7E7F85" />
                <stop offset="35%" stopColor="#A8A9AF" />
                <stop offset="55%" stopColor="#5B5C60" />
                <stop offset="85%" stopColor="#9C9DA3" />
                <stop offset="100%" stopColor="#3C3D42" />
              </linearGradient>

              {/* Glass screen reflection gradient */}
              <linearGradient id="screenReflection" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="45%" stopColor="rgba(255,255,255,0.03)" />
                <stop offset="100%" stopColor="rgba(100,180,255,0.08)" />
              </linearGradient>

              {/* Silicon chip gradient */}
              <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B132B" />
                <stop offset="50%" stopColor="#1C2541" />
                <stop offset="100%" stopColor="#3A506B" />
              </linearGradient>

              {/* Battery gradient */}
              <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1c23" />
                <stop offset="100%" stopColor="#0d0e12" />
              </linearGradient>
            </defs>

            {/* Compute geometric projections */}
            {(() => {
              const cx = 160;
              const cy = 170;
              const w = 130 * Math.max(0.18, Math.abs(cos));
              const h = 260;
              const r = 32 * Math.max(0.2, Math.abs(cos));
              const sideFacing = cos > 0 ? 1 : -1;
              const depthOffset = sin * 28;

              // Explosion offsets for each layer
              const dispOffset = explodeZ * -45;
              const chassisOffset = explodeZ * -15;
              const boardOffset = explodeZ * 15;
              const battOffset = explodeZ * 40;
              const backOffset = explodeZ * 65;

              return (
                <g transform={`translate(${cx}, ${cy})`}>
                  {/* Layer 5: Back Matte Glass & Triple Camera Bump */}
                  <g
                    transform={`translate(${depthOffset * 0.4 + (sideFacing === -1 ? 0 : backOffset)}, ${backOffset * 0.3})`}
                    opacity={isExploded ? 0.9 : cos < 0 ? 1 : 0.25}
                    className="transition-all duration-500 ease-out"
                  >
                    <rect
                      x={-w / 2}
                      y={-h / 2}
                      width={w}
                      height={h}
                      rx={r}
                      fill="#1E1F24"
                      stroke="#42434A"
                      strokeWidth="1.5"
                    />
                    {/* Camera Island */}
                    {Math.abs(cos) > 0.3 && (
                      <g transform={`translate(${sideFacing > 0 ? -w * 0.25 : w * 0.25}, ${-h * 0.28})`}>
                        <rect
                          x={-24 * Math.abs(cos)}
                          y={-28}
                          width={48 * Math.abs(cos)}
                          height={56}
                          rx={12 * Math.abs(cos)}
                          fill="#15161A"
                          stroke="#38393F"
                          strokeWidth="1.5"
                        />
                        {/* Lenses */}
                        <circle cx={-8 * cos} cy={-12} r={7 * Math.abs(cos)} fill="#0A0B0E" stroke="#5E606B" strokeWidth="1" />
                        <circle cx={-8 * cos} cy={12} r={7 * Math.abs(cos)} fill="#0A0B0E" stroke="#5E606B" strokeWidth="1" />
                        <circle cx={10 * cos} cy={0} r={6 * Math.abs(cos)} fill="#0A0B0E" stroke="#5E606B" strokeWidth="1" />
                      </g>
                    )}
                  </g>

                  {/* Layer 4: High-density Battery pack (Exploded view) */}
                  {isExploded && (
                    <g
                      transform={`translate(${battOffset * 0.7}, ${battOffset * 0.2})`}
                      className="transition-all duration-500 ease-out"
                    >
                      <rect
                        x={-w * 0.42}
                        y={-h * 0.1}
                        width={w * 0.84}
                        height={h * 0.52}
                        rx={12 * Math.abs(cos)}
                        fill="url(#batteryGrad)"
                        stroke="#333842"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y={h * 0.16}
                        fill="#7A808C"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        4,422 mAh Li-Ion
                      </text>
                    </g>
                  )}

                  {/* Layer 3: Logic Board & A18 Pro Chip (Exploded view) */}
                  {isExploded && (
                    <g
                      transform={`translate(${boardOffset * 0.6}, ${boardOffset * 0.15})`}
                      className="transition-all duration-500 ease-out"
                    >
                      <rect
                        x={-w * 0.4}
                        y={-h * 0.45}
                        width={w * 0.8}
                        height={h * 0.32}
                        rx={8 * Math.abs(cos)}
                        fill="url(#chipGradient)"
                        stroke="#4F7CAC"
                        strokeWidth="1.5"
                      />
                      {/* Apple Silicon Logo / A18 Pro core */}
                      <rect
                        x={-14 * Math.abs(cos)}
                        y={-h * 0.32}
                        width={28 * Math.abs(cos)}
                        height={28}
                        rx={4}
                        fill="#0A0F1D"
                        stroke="#60A5FA"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y={-h * 0.32 + 18}
                        fill="#93C5FD"
                        fontSize="8"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        A18 Pro
                      </text>
                    </g>
                  )}

                  {/* Layer 2: Grade 5 Titanium Chassis Frame */}
                  <g
                    transform={`translate(${chassisOffset * 0.5}, ${chassisOffset * 0.1})`}
                    className="transition-all duration-500 ease-out"
                  >
                    <rect
                      x={-w / 2}
                      y={-h / 2}
                      width={w}
                      height={h}
                      rx={r}
                      fill="none"
                      stroke="url(#titaniumGradient)"
                      strokeWidth={isExploded ? "3.5" : "4.5"}
                    />
                    {/* Action button notch & Volume indicators on side */}
                    {Math.abs(cos) < 0.85 && (
                      <g>
                        <rect
                          x={sideFacing > 0 ? w / 2 - 2 : -w / 2}
                          y={-60}
                          width={4}
                          height={16}
                          rx={2}
                          fill="#FF9F0A"
                          opacity={activeCallout?.tag === "Interface" ? 1 : 0.7}
                        />
                        <rect
                          x={sideFacing > 0 ? w / 2 - 2 : -w / 2}
                          y={-32}
                          width={4}
                          height={28}
                          rx={2}
                          fill="#A8A9AF"
                        />
                      </g>
                    )}
                  </g>

                  {/* Layer 1: Front Ceramic Shield & Super Retina XDR */}
                  <g
                    transform={`translate(${dispOffset * 0.6}, ${dispOffset * 0.2})`}
                    opacity={isExploded ? 0.88 : cos >= 0 ? 1 : 0.35}
                    className="transition-all duration-500 ease-out"
                  >
                    {/* Screen Body */}
                    <rect
                      x={-w / 2 + 3}
                      y={-h / 2 + 3}
                      width={Math.max(1, w - 6)}
                      height={h - 6}
                      rx={Math.max(2, r - 3)}
                      fill="#030407"
                      stroke="#22252B"
                      strokeWidth="1.5"
                    />

                    {/* Dynamic Island Pill */}
                    {Math.abs(cos) > 0.25 && (
                      <rect
                        x={-18 * Math.abs(cos)}
                        y={-h / 2 + 14}
                        width={36 * Math.abs(cos)}
                        height={10}
                        rx={5}
                        fill="#000000"
                        stroke="#1C1D22"
                        strokeWidth="1"
                      />
                    )}

                    {/* Display reflection shine */}
                    <path
                      d={`M ${-w / 2 + 4} ${-h / 2 + 4} L ${w / 2 - 4} ${h / 2 - 4} L ${-w / 2 + 4} ${h / 2 - 4} Z`}
                      fill="url(#screenReflection)"
                      clipPath="url(#screenClip)"
                      opacity={Math.abs(cos) * 0.8}
                    />

                    {/* UI Clock & lockscreen preview when front-facing */}
                    {cos > 0.6 && !isExploded && (
                      <g opacity={cos}>
                        <text
                          x="0"
                          y={-h / 2 + 65}
                          fill="#FFFFFF"
                          fontSize="22"
                          fontWeight="600"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          9:41
                        </text>
                        <text
                          x="0"
                          y={-h / 2 + 82}
                          fill="#9CA3AF"
                          fontSize="9"
                          fontWeight="500"
                          textAnchor="middle"
                        >
                          Friday, October 9
                        </text>
                      </g>
                    )}
                  </g>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Bottom Timeline Scrubber Controls */}
      <div className="relative z-10 mt-2 space-y-3 rounded-xl border border-neutral-800/80 bg-neutral-900/80 p-3.5 backdrop-blur-md">
        {/* Scrub Slider Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-neutral-300">
              Scrub Sequence Timeline
            </span>
            <span className="font-mono text-neutral-400">
              Angle: <strong className="text-white">{Math.round(rotationAngle)}°</strong> ({currentFrame + 1}/{totalFrames})
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={totalFrames - 1}
              value={currentFrame}
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="360 Product angle scrubber slider"
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-blue-500 transition-all hover:bg-neutral-700"
            />
          </div>

          {/* Timeline markers */}
          <div className="flex justify-between px-1 text-[10px] text-neutral-500 font-mono">
            <span>0° (Face)</span>
            <span>90° (Left)</span>
            <span>180° (Back)</span>
            <span>270° (Right)</span>
            <span>360°</span>
          </div>
        </div>

        {/* Preset Angle Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800/60">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-neutral-400 mr-1">Jump to:</span>
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSeek(preset.frame)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                  currentFrame === preset.frame
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-neutral-400">
            {isExploded ? (
              <span className="text-blue-400 font-medium">⚡ 5 Disassembled Hardware Layers</span>
            ) : (
              <span>Drag slider or click presets to inspect angles</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSequenceScrubber;
