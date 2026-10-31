"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { COMPONENT_DEMOS } from "@/registry/generated-demos";
import { BLOCK_COMPONENTS } from "@/components/blocks/registry";

// Backgrounds & simulations
import { BlackHole } from "@/components/ui/BlackHole";
import { SolarFlare } from "@/components/ui/SolarFlare";
import { UnderwaterCaustics } from "@/components/ui/UnderwaterCaustics";
import { WaterRipples } from "@/components/ui/WaterRipples";
import { Thunderstorm } from "@/components/ui/Thunderstorm";
import { FallingPetals } from "@/components/ui/FallingPetals";
import { AtmosphericFog } from "@/components/ui/AtmosphericFog";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { DigitalRadar } from "@/components/ui/DigitalRadar";
import { IsometricCity } from "@/components/ui/IsometricCity";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { StarryNight } from "@/components/ui/StarryNight";
import { ShootingStars } from "@/components/ui/ShootingStars";
import { HorizonLight } from "@/components/ui/HorizonLight";
import { WarpSpeed } from "@/components/ui/WarpSpeed";
import { Snowfall } from "@/components/ui/Snowfall";
import { RainOnGlass } from "@/components/ui/RainOnGlass";
import { GalaxyNebula } from "@/components/ui/GalaxyNebula";
import { ParticleNetwork } from "@/components/ui/ParticleNetwork";
import { MorphingBlob } from "@/components/ui/MorphingBlob";
import { DotTextHero } from "@/components/ui/DotTextHero";
import { CylinderCarousel, type CylinderCardItem } from "@/components/ui/CylinderCarousel";
import { PermissionSwitch, type PermissionOption } from "@/components/ui/PermissionSwitch";
import { GlyphTrail } from "@/components/ui/GlyphTrail";
import {
  AgentStatusBadge,
  AGENT_STATUSES,
  DEFAULT_STATUS_LABELS,
  type AgentStatus,
  type AgentBadgeSize,
} from "@/components/ui/AgentStatusBadge";
import { RevealCardGrid } from "@/components/ui/RevealCardGrid";
import { MinimalAuthCard } from "@/components/ui/MinimalAuthCard";
import { WeatherCard } from "@/components/ui/WeatherCard";
import { AnimatedThemeToggler, type TransitionVariant } from "@/components/ui/AnimatedThemeToggler";
import { TextMaskGrid } from "@/components/ui/TextMaskGrid";
import { FlickeringGrid } from "@/components/ui/FlickeringGrid";
import { GridCard, FeatureSection } from "@/components/ui/GridCard";
import { CTABanner } from "@/components/ui/CTABanner";

// Stripe, Apple, DevTools, Consumer & Fintech components
import { TiltCreditCard3D } from "@/components/ui/TiltCreditCard3D";
import { RollingNumberTicker } from "@/components/ui/RollingNumberTicker";
import { PricingCalculator } from "@/components/ui/PricingCalculator";
import { GlowBorderCard } from "@/components/ui/GlowBorderCard";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { HoverRevealFeatureGrid } from "@/components/ui/HoverRevealFeatureGrid";
import { HeartBurstButton } from "@/components/ui/HeartBurstButton";

// Core Primitives
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitButton } from "@/components/ui/SplitButton";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { HoldToConfirmButton } from "@/components/ui/HoldToConfirmButton";
import { ToastStack } from "@/components/ui/ToastStack";
import { Drawer } from "@/components/ui/Drawer";
import { ModalPopup } from "@/components/ui/ModalPopup";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { FileTree } from "@/components/ui/FileTree";
import { KineticSlider } from "@/components/ui/KineticSlider";
import { ScrubbableNumberInput } from "@/components/ui/ScrubbableNumberInput";
import { StepperSliderControl } from "@/components/ui/StepperSliderControl";
import { Stepper } from "@/components/ui/Stepper";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { SpringPinInput } from "@/components/ui/SpringPinInput";
import { MultiSelectTagInput } from "@/components/ui/MultiSelectTagInput";
import { ElasticTagInput } from "@/components/ui/ElasticTagInput";
import { RotarySpringDial } from "@/components/ui/RotarySpringDial";
import { KineticSwipeButton } from "@/components/ui/KineticSwipeButton";
import { RippleBurstButton } from "@/components/ui/RippleBurstButton";
import { MorphingActionButton } from "@/components/ui/MorphingActionButton";
import { MorphingDialog } from "@/components/ui/MorphingDialog";
import { DynamicIslandToast } from "@/components/ui/DynamicIslandToast";
import { SplitFlapText } from "@/components/ui/SplitFlapText";
import { CipherScrambleText } from "@/components/ui/CipherScrambleText";
import { ElasticWaveText } from "@/components/ui/ElasticWaveText";
import { VariableProximityText } from "@/components/ui/VariableProximityText";
import { Accordion } from "@/components/ui/Accordion";
import { AccordionStackCards } from "@/components/ui/AccordionStackCards";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { LiquidPillTabs } from "@/components/ui/LiquidPillTabs";
import { ExpandableBentoCard } from "@/components/ui/ExpandableBentoCard";
import { ExpandableCards, type ExpandableCardItem } from "@/components/ui/ExpandableCards";
import { ParallaxTiltCard } from "@/components/ui/ParallaxTiltCard";
import { HolographicFlipCard } from "@/components/ui/HolographicFlipCard";
import { PeelRevealCard } from "@/components/ui/PeelRevealCard";
import { ProductCompareTable } from "@/components/ui/ProductCompareTable";
import { StickyScrollStory } from "@/components/ui/StickyScrollStory";
import { StickyPages } from "@/components/ui/StickyPages";
import { FloatingCompassNav } from "@/components/ui/FloatingCompassNav";
import { MagneticPopoverMenu } from "@/components/ui/MagneticPopoverMenu";
import { RadialMenuOrb } from "@/components/ui/RadialMenuOrb";
import { ElasticDock } from "@/components/ui/ElasticDock";
import { AppleContextMenu } from "@/components/ui/AppleContextMenu";
import { AppleSearchField } from "@/components/ui/AppleSearchField";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { CarouselWithDots } from "@/components/ui/CarouselWithDots";
import { StoryCards } from "@/components/ui/StoryCards";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { ElasticSnapSortable } from "@/components/ui/ElasticSnapSortable";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { KineticDrawerSheet } from "@/components/ui/KineticDrawerSheet";
import { KineticRollingCounter } from "@/components/ui/KineticRollingCounter";
import { KineticStepIndicator } from "@/components/ui/KineticStepIndicator";
import { MagneticBreadcrumb } from "@/components/ui/MagneticBreadcrumb";
import { PickerWheel } from "@/components/ui/PickerWheel";
import { PopoverCard } from "@/components/ui/PopoverCard";
import { InteractiveGridBeam } from "@/components/ui/InteractiveGridBeam";
import { GridHorizon } from "@/components/ui/GridHorizon";
import { GravityWellPortal } from "@/components/ui/GravityWellPortal";
import { CloudsDrift } from "@/components/ui/CloudsDrift";

import {
  Sparkles,
  Sliders,
  RotateCcw,
  Play,
  RotateCw,
  Shuffle,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  Coins,
  ArrowRight,
  X,
  CircleCheck,
  Hand,
  Ban,
  Layers,
  Cpu,
  Shield,
} from "lucide-react";
import { HoverCursorShimmerText } from "../ui/HoverCursorShimmerText";

// AI Components
import { AIVoiceOrb, type AIVoiceOrbState, type AIVoiceOrbTheme } from "@/components/ui/AIVoiceOrb";

// Mockup Components
import { TerminalWindowMockup } from "@/components/ui/TerminalWindowMockup";

// DevTools & Fintech Components
import { TransactionReceipt } from "@/components/ui/TransactionReceipt";

// Developer Tools Suite (18 Components)
import { InteractiveApiEndpointBar } from "@/components/ui/InteractiveApiEndpointBar";
import { SqlDataGrid } from "@/components/ui/SqlDataGrid";

/**
 * Interactive preview wrapper for Black Hole
 */
function BlackHolePreviewStage({ className }: { className?: string }) {
  const [size, setSize] = useState(105);
  const [diskColor, setDiskColor] = useState("#FF7A18");
  const [spinSpeed, setSpinSpeed] = useState(1.2);
  const [pull, setPull] = useState(0.35);
  const [lensing, setLensing] = useState(true);

  const presets = [
    { name: "Gargantua", color: "#FF7A18", size: 105, spin: 1.2, pull: 0.35 },
    { name: "Cygnus X-1", color: "#38BDF8", size: 85, spin: 2.0, pull: 0.5 },
    { name: "Sagittarius A*", color: "#F59E0B", size: 125, spin: 0.8, pull: 0.28 },
    { name: "Ultraviolet Void", color: "#A855F7", size: 95, spin: 1.5, pull: 0.42 },
  ];

  return (
    <div className="relative w-full flex flex-col">
      <BlackHole
        size={size}
        diskColor={diskColor}
        spinSpeed={spinSpeed}
        pull={pull}
        lensing={lensing}
        className={className}
      >
        <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                <Sparkles className="h-3 w-3" /> Relativistic Singularity
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Event Horizon
              </h2>
              <p className="text-xs text-neutral-400">
                Kerr spacetime curvature with gravitational lensing
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setDiskColor(p.color);
                    setSize(p.size);
                    setSpinSpeed(p.spin);
                    setPull(p.pull);
                  }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors",
                    diskColor === p.color
                      ? "border-white/40 bg-white/20 text-white"
                      : "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BlackHole>

      {/* Preview Playground Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200/80 bg-neutral-50/50 p-4 text-xs dark:border-neutral-800/80 dark:bg-neutral-900/40">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 font-mono text-neutral-600 dark:text-neutral-400">
            <span>Size:</span>
            <input
              type="range"
              min="60"
              max="160"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-24 accent-amber-500"
            />
            <span className="w-8">{size}px</span>
          </label>

          <label className="flex items-center gap-2 font-mono text-neutral-600 dark:text-neutral-400">
            <span>Spin:</span>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={spinSpeed}
              onChange={(e) => setSpinSpeed(Number(e.target.value))}
              className="w-20 accent-amber-500"
            />
            <span className="w-8">{spinSpeed.toFixed(1)}x</span>
          </label>

          <label className="flex items-center gap-2 font-mono text-neutral-600 dark:text-neutral-400">
            <span>Pull:</span>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={pull}
              onChange={(e) => setPull(Number(e.target.value))}
              className="w-20 accent-amber-500"
            />
            <span className="w-8">{pull.toFixed(2)}</span>
          </label>

          <label className="flex items-center gap-1.5 font-mono text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={lensing}
              onChange={(e) => setLensing(e.target.checked)}
              className="rounded accent-amber-500"
            />
            <span>Lensing</span>
          </label>
        </div>

        <button
          onClick={() => {
            setSize(105);
            setDiskColor("#FF7A18");
            setSpinSpeed(1.2);
            setPull(0.35);
            setLensing(true);
          }}
          className="flex items-center gap-1 font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>
    </div>
  );
}

/**
 * Interactive preview wrapper for Planet Horizon
 */

/**
 * Interactive preview wrapper for Live Card Form
 */

/**
 * Interactive preview wrapper for Rolling Number Ticker
 */
function RollingNumberTickerPreviewStage({ className }: { className?: string }) {
  const [value, setValue] = useState(48290);
  const [currency, setCurrency] = useState("$");

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-8 bg-neutral-950 rounded-2xl border border-neutral-800 text-white min-h-[420px]">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-mono text-neutral-400">
          <Coins className="h-3.5 w-3.5 text-amber-400" /> High-Precision Odometer
        </span>
        <h3 className="mt-2 text-xl font-bold tracking-tight">Real-Time Yield Index</h3>
      </div>

      <RollingNumberTicker
        value={value}
        currency={currency}
        fontSize="xl"
        className="my-4"
      />

      {/* Playground Ticker Steppers */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-neutral-800 pt-6">
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1 mr-4">
          {["$", "€", "£", "¥", "₿"].map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={cn(
                "h-7 w-7 rounded font-mono text-xs font-semibold transition-colors",
                currency === c ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={() => setValue((v) => Math.max(0, v - 1000))}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-rose-400 hover:bg-neutral-800"
        >
          -1,000
        </button>
        <button
          onClick={() => setValue((v) => Math.max(0, v - 50))}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-rose-400 hover:bg-neutral-800"
        >
          -50
        </button>
        <button
          onClick={() => setValue((v) => v + 50)}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-emerald-400 hover:bg-neutral-800"
        >
          +50
        </button>
        <button
          onClick={() => setValue((v) => v + 1000)}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-emerald-400 hover:bg-neutral-800"
        >
          +1,000
        </button>
        <button
          onClick={() => setValue(Math.floor(Math.random() * 80000) + 1200)}
          className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-neutral-300 hover:bg-neutral-800"
        >
          <Shuffle className="h-3 w-3" /> Random
        </button>
      </div>
    </div>
  );
}









function AIVoiceOrbPreviewStage({ className }: { className?: string }) {
  const [state, setState] = useState<AIVoiceOrbState>("idle");
  const [theme, setTheme] = useState<AIVoiceOrbTheme>("chromatic");
  const [audioLevel, setAudioLevel] = useState(0.2);

  return (
    <div className={cn("w-full flex flex-col items-center gap-6 p-4", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-border pb-4 w-full max-w-lg">
        {/* States */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {(["idle", "listening", "thinking", "speaking"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setState(s);
                if (s === "listening") setAudioLevel(0.65);
                else setAudioLevel(0.2);
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-all",
                state === s ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Themes */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {(["chromatic", "aurora", "monochrome"] as const).map((th) => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-all",
                theme === th ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[260px]">
        <AIVoiceOrb
          state={state}
          theme={theme}
          audioLevel={audioLevel}
          size={240}
        />
      </div>
      <span className="text-xs text-muted-foreground/60 select-none">
        Click orb or switch states to preview fluid reactive modes
      </span>
    </div>
  );
}









function TerminalWindowMockupPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-xl mx-auto p-4 flex items-center justify-center", className)}>
      <TerminalWindowMockup
        title="zsh — boseui cli"
        command="npx boseui add terminal-window-mockup"
        output={[
          "✔ Fetching component manifest...",
          "✔ Installing Framer Motion spring physics...",
          "✔ Component ready at src/components/ui/TerminalWindowMockup.tsx",
        ]}
      />
    </div>
  );
}



function TransactionReceiptPreviewStage({ className }: { className?: string }) {
  const [stamp, setStamp] = useState<"PAID" | "SETTLED" | "REFUNDED" | null>("PAID");

  return (
    <div className={cn("w-full max-w-xl mx-auto p-4 flex flex-col items-center gap-6", className)}>
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {(["PAID", "SETTLED", "REFUNDED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStamp(s)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
              stamp === s
                ? "border-foreground bg-foreground text-background shadow-sm"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            Stamp: {s}
          </button>
        ))}
        <button
          onClick={() => setStamp(null)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
            stamp === null
              ? "border-foreground bg-foreground text-background shadow-sm"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          No Stamp
        </button>
      </div>

      <TransactionReceipt
        merchantName="BoseUI Cloud Infrastructure"
        transactionId="TXN-84920481"
        stampText={stamp}
      />
    </div>
  );
}



function InteractiveApiEndpointBarPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <InteractiveApiEndpointBar />
    </div>
  );
}




function SqlDataGridPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <SqlDataGrid />
    </div>
  );
}

function PermissionSwitchPreviewStage({ className }: { className?: string }) {
  const [val, setVal] = useState("allow");
  const [slowMotion, setSlowMotion] = useState(true);

  const customOptions: PermissionOption[] = [
    { value: "allow", label: "Always allow", icon: CircleCheck },
    { value: "ask", label: "Needs approval", icon: Hand },
    { value: "deny", label: "Deny access", icon: Ban },
  ];

  return (
    <div className={cn("w-full flex flex-col items-center justify-center gap-6 py-16 px-4", className)}>
      <div className="flex flex-col items-center gap-4">
        <PermissionSwitch
          options={customOptions}
          value={val}
          onChange={setVal}
          activeMotion={slowMotion}
        />
        <div className="text-xs text-neutral-500 font-mono mt-2">
          Selected State:{" "}
          <span className="rounded bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 text-neutral-900 dark:text-neutral-100 font-semibold">
            {val}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 px-4 py-2 backdrop-blur-sm">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={slowMotion}
            onChange={(e) => setSlowMotion(e.target.checked)}
            className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
          />
          <span>activeMotion (slow luxurious expansion)</span>
        </label>
      </div>
    </div>
  );
}

function GlyphTrailPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-neutral-800 bg-black flex flex-col items-center justify-center p-6", className)}>
      <GlyphTrail
        lines={[
          "stem docs logic",
          "ideas natural input",
          "text corca math",
          "formulas notation",
          "functions variables",
          "collaborative editing",
        ]}
        highlight="corca"
        radius={36}
        lifeMs={1200}
      />
    </div>
  );
}

function AgentStatusBadgePreviewStage({ className }: { className?: string }) {
  const [status, setStatus] = useState<AgentStatus>("analyzing");
  const [size, setSize] = useState<AgentBadgeSize>("md");

  return (
    <div className={cn("w-full flex flex-col items-center justify-center gap-8 py-12 px-4", className)}>
      {/* Interactive Main Hero Badge */}
      <div className="flex flex-col items-center gap-3">
        <AgentStatusBadge
          status={status}
          size={size}
          interactive
          onStatusChange={setStatus}
          className="shadow-lg"
        />
        <span className="text-[11px] font-mono text-neutral-400">
          Click badge to cycle • Current: <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{status}</span>
        </span>
      </div>

      {/* Manual Status Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 p-1.5 backdrop-blur-sm">
        {AGENT_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              status === s
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            {DEFAULT_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Side-by-side showcase of all 4 states */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xl pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          All 4 Matrix Animations
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <AgentStatusBadge status="reading-docs" />
          <AgentStatusBadge status="analyzing" />
          <AgentStatusBadge status="debugging" />
          <AgentStatusBadge status="success" />
        </div>
      </div>
    </div>
  );
}

const THEME_TOGGLER_VARIANTS: { id: TransitionVariant; label: string; group: "liquid" | "geometric" }[] = [
  // Primary: Organic Liquids & Waves
  { id: "liquid-blob", label: "Liquid Blob", group: "liquid" },
  { id: "ocean-wave", label: "Ocean Wave", group: "liquid" },
  { id: "waterfall", label: "Waterfall", group: "liquid" },
  { id: "tide-sweep", label: "Tide Sweep", group: "liquid" },
  { id: "tide-sweep-left", label: "Tide Sweep Left", group: "liquid" },
  { id: "concentric-ripple", label: "Water Ripple", group: "liquid" },
  { id: "liquid-droplet", label: "Liquid Droplet", group: "liquid" },
  { id: "goo-melt", label: "Goo Melt", group: "liquid" },
  { id: "aurora-wave", label: "Aurora S-Wave", group: "liquid" },
  { id: "bubble-burst", label: "Bubble Burst", group: "liquid" },
  { id: "whirlpool", label: "Whirlpool", group: "liquid" },
  { id: "fluid-curtain", label: "Fluid Curtain", group: "liquid" },
  { id: "circle", label: "Smooth Circle", group: "liquid" },
  // Secondary: Geometric shapes
  { id: "star", label: "Star", group: "geometric" },
  { id: "diamond", label: "Diamond", group: "geometric" },
  { id: "hexagon", label: "Hexagon", group: "geometric" },
  { id: "aperture", label: "Aperture", group: "geometric" },
  { id: "diagonal-slash", label: "Diagonal", group: "geometric" },
];

function AnimatedThemeTogglerPreviewStage({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"liquid" | "geometric">("liquid");
  const [variant, setVariant] = useState<TransitionVariant>("liquid-blob");
  const [duration, setDuration] = useState<number>(520);
  const [fromCenter, setFromCenter] = useState<boolean>(false);
  const [size, setSize] = useState<"sm" | "md" | "lg">("lg");

  const filteredVariants = THEME_TOGGLER_VARIANTS.filter((v) => v.group === activeTab);

  return (
    <div className={cn("w-full flex flex-col items-center justify-center gap-8 py-12 px-4", className)}>
      {/* Central Interactive Toggle */}
      <div className="flex flex-col items-center gap-4">
        <AnimatedThemeToggler
          variant={variant}
          duration={duration}
          fromCenter={fromCenter}
          size={size}
          glow
        />
        <div className="text-center">
          <p className="text-xs font-mono text-neutral-500">
            Click icon to trigger{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {variant}
            </span>{" "}
            liquid reveal
          </p>
          <span className="text-[11px] text-neutral-400">
            Multi-harmonic wave undulation with fluid deceleration
          </span>
        </div>
      </div>

      {/* Category Tabs: Liquid & Waves vs Geometric */}
      <div className="flex flex-col items-center gap-3 max-w-xl w-full">
        <div className="flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/70 p-1">
          <button
            onClick={() => {
              setActiveTab("liquid");
              setVariant("liquid-blob");
            }}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-medium transition-all",
              activeTab === "liquid"
                ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            🌊 Liquids & Waves (13 styles)
          </button>
          <button
            onClick={() => {
              setActiveTab("geometric");
              setVariant("star");
            }}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-medium transition-all",
              activeTab === "geometric"
                ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            Shapes
          </button>
        </div>

        {/* Variant Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-sm">
          {filteredVariants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariant(v.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                variant === v.id
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls: Duration & Options */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-mono">Speed:</span>
          {[
            { label: "Fast (320ms)", val: 320 },
            { label: "Fluid (480ms)", val: 480 },
            { label: "Cinematic (720ms)", val: 720 },
          ].map((d) => (
            <button
              key={d.val}
              onClick={() => setDuration(d.val)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-mono transition-colors",
                duration === d.val
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFromCenter((prev) => !prev)}
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-mono transition-colors border",
            fromCenter
              ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
          )}
        >
          {fromCenter ? "✓ Expand from Center" : "Expand from Button"}
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 font-mono">Size:</span>
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                "px-2 py-0.5 rounded text-xs uppercase font-mono transition-colors",
                size === s
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TextMaskGridPreviewStage({ className }: { className?: string }) {
  const [inputText, setInputText] = useState("Acme");
  const [color, setColor] = useState("currentColor");
  const [stagger, setStagger] = useState(false);
  const [squareSize, setSquareSize] = useState(4);
  const [flickerChance, setFlickerChance] = useState(0.4);

  const PRESET_WORDS = ["Acme", "BoseUI", "Kinetic", "Vector", "Future"];

  return (
    <div className={cn("w-full flex flex-col items-center justify-center gap-8 py-12 px-4", className)}>
      {/* Hero Showcase Stage */}
      <div className="w-full flex flex-col items-center justify-center text-center">
        <TextMaskGrid
          text={inputText || "Acme"}
          color={color}
          stagger={stagger}
          squareSize={squareSize}
          gridGap={5}
          flickerChance={flickerChance}
          maxOpacity={0.55}
          className="w-full max-w-4xl"
        />
        <p className="mt-3 text-sm text-neutral-500 font-mono tracking-tight max-w-md">
          High-performance developer primitives for the modern responsive web.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xl pt-6 border-t border-neutral-200 dark:border-neutral-800">
        {/* Preset Words */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-xs font-mono text-neutral-400 mr-1">Sample Words:</span>
          {PRESET_WORDS.map((w) => (
            <button
              key={w}
              onClick={() => setInputText(w)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono transition-all",
                inputText === w
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              )}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Input & Toggles */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type custom text..."
            maxLength={12}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 font-mono text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            onClick={() => setStagger((prev) => !prev)}
            className={cn(
              "px-3 py-1 rounded-lg font-mono text-xs transition-colors border",
              stagger
                ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
            )}
          >
            {stagger ? "✓ Staggered Letters" : "Single SVG Mask"}
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-400">Color:</span>
          {[
            { label: "Theme", val: "currentColor" },
            { label: "Blue", val: "#3b82f6" },
            { label: "Emerald", val: "#10b981" },
            { label: "Amber", val: "#f59e0b" },
            { label: "Rose", val: "#f43f5e" },
          ].map((c) => (
            <button
              key={c.val}
              onClick={() => setColor(c.val)}
              className={cn(
                "px-2 py-0.5 rounded text-xs transition-colors",
                color === c.val
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlickeringGridPreviewStage({ className }: { className?: string }) {
  const [squareSize, setSquareSize] = useState(4);
  const [flickerChance, setFlickerChance] = useState(0.35);

  return (
    <div className={cn("w-full flex flex-col items-center justify-center gap-6 py-10 px-4", className)}>
      <div className="relative h-72 w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
        <FlickeringGrid
          squareSize={squareSize}
          gridGap={6}
          flickerChance={flickerChance}
          maxOpacity={0.45}
          className="absolute inset-0 h-full w-full"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-6 pointer-events-none">
          <span className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 px-3 py-1 font-mono text-xs backdrop-blur-sm">
            Flickering Grid Canvas
          </span>
          <p className="mt-2 text-xs text-neutral-500 font-mono">
            Device-pixel-ratio scaled • Battery-aware auto pause
          </p>
        </div>
      </div>
    </div>
  );
}

function GridCardPreviewStage({ className }: { className?: string }) {
  const sampleFeatures = [
    {
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      title: "Real-time Reactivity",
      description: "Ultra-fast state synchronization with zero hydration latency across edge runtimes.",
      href: "#",
    },
    {
      icon: <Layers className="h-5 w-5 text-emerald-500" />,
      title: "Zero-trust Security",
      description: "End-to-end cryptographic token verification with hardware-backed encryption.",
      href: "#",
    },
    {
      icon: <Cpu className="h-5 w-5 text-blue-500" />,
      title: "Compute at the Edge",
      description: "Execute sub-millisecond serverless functions deployed to 300+ global data centers.",
      href: "#",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      title: "Adaptive Physics",
      description: "Spring dynamics calibrated to 120Hz display refresh rates for natural fluidity.",
      href: "#",
    },
    {
      icon: <Layers className="h-5 w-5 text-sky-500" />,
      title: "Composability First",
      description: "Modular primitives that combine effortlessly into complex application dashboards.",
      href: "#",
    },
    {
      icon: <ArrowRight className="h-5 w-5 text-indigo-500" />,
      title: "Continuous Deployment",
      description: "Automated git preview branches with instant rollbacks and deterministic builds.",
      href: "#",
    },
  ];

  return (
    <div className={cn("w-full py-4", className)}>
      <FeatureSection
        title="Everything you need to ship faster"
        subtitle="Hover cards to accelerate corner flickering grid rates from 0.1 to 0.6."
        features={sampleFeatures}
      />
    </div>
  );
}

/* ── CTABanner Preview ── */
function CTABannerPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full px-4 py-8 bg-neutral-100 dark:bg-neutral-900 rounded-2xl", className)}>
      <CTABanner
        heading="Ship beautiful interfaces faster"
        subheading="Join 12,000+ engineers building with BoseUI components every week."
        placeholder="you@company.com"
        buttonLabel="Join the waitlist"
        accentColor="#6366f1"
        onSubmit={async (email) => {
          await new Promise((r) => setTimeout(r, 1400));
          console.log("Subscribed:", email);
        }}
      />
    </div>
  );
}

/* ── PricingBanner Preview ── */
const PRICING_PLANS = [
  {
    name: "Starter",
    description: "For individuals and small projects.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    ctaLabel: "Start for free",
    features: [
      { text: "5 components", included: true },
      { text: "Community support", included: true },
      { text: "Private projects", included: false },
      { text: "Custom domain", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For teams shipping production products.",
    monthlyPrice: 29,
    yearlyPrice: 23,
    ctaLabel: "Start free trial",
    features: [
      { text: "Unlimited components", included: true },
      { text: "Priority support", included: true },
      { text: "Private projects", included: true },
      { text: "Custom domain", included: true },
      { text: "Dedicated Slack channel", included: false },
    ],
  },
  {
    name: "Enterprise",
    description: "For large teams with advanced requirements.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    ctaLabel: "Contact sales",
    features: [
      { text: "Unlimited components", included: true },
      { text: "Priority support", included: true },
      { text: "Private projects", included: true },
      { text: "Custom domain", included: true },
      { text: "Dedicated Slack channel", included: true },
    ],
  },
];


function RevealCardGridPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full bg-[#fcfcfd] dark:bg-neutral-950 py-8 px-2 sm:px-4 rounded-2xl border border-neutral-200 dark:border-neutral-800", className)}>
      <RevealCardGrid
        title="Edge Infrastructure"
        subtitle="Hover anywhere on any card to see fluid ink expand from the exact entry point."
      />
    </div>
  );
}

function MinimalAuthCardPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex items-center justify-center py-10 px-4", className)}>
      <MinimalAuthCard
        brandName="BoseUI"
        onSubmit={(data) => console.log("Auth submit:", data)}
        onOAuthClick={(provider) => console.log("OAuth clicked:", provider)}
      />
    </div>
  );
}

function WeatherCardPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex items-center justify-center py-8 px-2 sm:px-4", className)}>
      <WeatherCard location="San Francisco, CA" />
    </div>
  );
}














/**
 * Central Component Preview Factory
 *
 * Switch-case returns the customized interactive preview based on component slug/title.
 * Change or enhance any component's website presentation here!
 */
export function ComponentPreview({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  switch (slug) {
    // ── Space & Cosmic Backgrounds ──
    case "black-hole":
      return <BlackHolePreviewStage className={className} />;

    case "solar-flare":
      return (
        <SolarFlare turbulence={1.2} speed={1.0} eruptionIntensity={1.1} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-2.5 py-0.5 text-xs font-medium text-orange-300">
                <Sparkles className="h-3 w-3" /> Photosphere Convection
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Solar Flare
              </h2>
            </div>
          </div>
        </SolarFlare>
      );

    // ── Water & Fluid Backgrounds ──

    case "underwater-caustics":
      return (
        <UnderwaterCaustics causticIntensity={1.0} bubbleCount={32} sunbeams={true} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                <Sparkles className="h-3 w-3" /> Refracted Light Network
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Underwater Caustics
              </h2>
            </div>
          </div>
        </UnderwaterCaustics>
      );

    case "water-ripples":
      return (
        <WaterRipples damping={0.97} rippleRadius={140} ambientDrops={true} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-xs font-medium text-sky-300">
                <Sparkles className="h-3 w-3" /> Interactive Surface Wave Buffer
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Water Ripples
              </h2>
            </div>
          </div>
        </WaterRipples>
      );

    case "morphing-blob":
      return (
        <div className="relative flex min-h-[460px] w-full items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 p-8">
          <MorphingBlob
            width={440}
            height={440}
            baseRadius={130}
            variance={30}
            cursorFollow={true}
            colors={["#7C3AED", "#06B6D4"]}
          />
          <div className="pointer-events-none absolute z-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-mono text-violet-300 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-cyan-400" /> Catmull-Rom Spring Splines
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
              Organic Morphing Blob
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Move cursor to attract fluid spring nodes
            </p>
          </div>
        </div>
      );

    case "thunderstorm":
      return (
        <Thunderstorm rainIntensity={180} lightningFrequency={0.35} windAngle={14} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Thunderstorm
              </h2>
            </div>
          </div>
        </Thunderstorm>
      );

    case "falling-petals":
      return (
        <FallingPetals variant="sakura" count={65} windSpeed={1.0} fallSpeed={1.0} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-0.5 text-xs font-medium text-rose-300">
                <Sparkles className="h-3 w-3" /> 3D Projected Flutter
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Falling Petals
              </h2>
            </div>
          </div>
        </FallingPetals>
      );

    case "atmospheric-fog":
      return (
        <AtmosphericFog density={0.7} speed={1.0} layers={4} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-400/30 bg-slate-400/10 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                <Sparkles className="h-3 w-3" /> Multi-Layer Noise Bank
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Atmospheric Fog
              </h2>
            </div>
          </div>
        </AtmosphericFog>
      );

    case "matrix-rain":
      return (
        <MatrixRain color="#10B981" speed={1.0} charset="katakana" fontSize={15} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                <Sparkles className="h-3 w-3" /> Phosphor Terminal Streams
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Matrix Rain
              </h2>
            </div>
          </div>
        </MatrixRain>
      );

    case "digital-radar":
      return (
        <DigitalRadar sweepSpeed={1.0} blipCount={8} color="#10B981" showTelemetry={true} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                <Sparkles className="h-3 w-3" /> Polar Scope Sweep
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Digital Radar
              </h2>
            </div>
          </div>
        </DigitalRadar>
      );

    case "isometric-city":
      return (
        <IsometricCity gridSize={7} buildingDensity={0.78} trafficSpeed={1.0} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                <Sparkles className="h-3 w-3" /> 3D Avenue Grid & Traffic
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Isometric City
              </h2>
            </div>
          </div>
        </IsometricCity>
      );

    // ── Stripe & Fintech Inspired ──

    case "tilt-credit-card3-d":
    case "tilt-credit-card-3d":
      return (
        <div className="flex items-center justify-center p-8 bg-neutral-950 rounded-2xl border border-neutral-800 min-h-[440px]">
          <TiltCreditCard3D
            cardHolder="ALEXANDER MERCER"
            cardNumber="4532 8920 4829 1042"
            expiry="08/29"
            cvv="892"
            theme="titanium"
            className={className}
          />
        </div>
      );

    case "rolling-number-ticker":
      return <RollingNumberTickerPreviewStage className={className} />;

    case "pricing-calculator":
      return <PricingCalculator className={className} />;

    case "glow-border-card":
      return <GlowBorderCard className={className} />;

    case "liquid-glass-card":
      return (
        <div className="flex items-center justify-center p-8 bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-black rounded-2xl">
          <LiquidGlassCard className={cn("max-w-sm p-6", className)}>
            <h4 className="font-semibold text-white">Liquid Glass</h4>
            <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
              Real-time specular refraction with double-layer backdrop blur and gyroscope angle response.
            </p>
          </LiquidGlassCard>
        </div>
      );

    case "shimmer-text":
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <ShimmerText text="Next-Generation Kinetic Motion" className="text-3xl sm:text-5xl font-black" />
          <ShimmerText text="Crafted with sub-pixel precision" palette="emerald" className="text-lg font-medium" />
        </div>
      );

    case "hover-reveal-feature-grid":
      return (
        <div className="w-full max-w-4xl mx-auto p-4">
          <HoverRevealFeatureGrid className={className} />
        </div>
      );

    case "story-cards":
      return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
          <StoryCards className={className} />
        </div>
      );

    case "sticky-pages": {
      const demoPages = [
        {
          id: 1,
          badge: "Foundation",
          subtitle: "Performance",
          title: "Sub-millisecond Latency",
          description: "Zero overhead CSS sticky stacking with progressive hardware-accelerated transforms.",
          bg: "bg-slate-950",
        },
        {
          id: 2,
          badge: "Aesthetics",
          subtitle: "Visual Depth",
          title: "Cumulative Scaling",
          description: "Covering cards smoothly shrink lower layers by 5% while casting subtle top elevation shadows.",
          bg: "bg-indigo-950",
        },
        {
          id: 3,
          badge: "Production",
          subtitle: "Adaptive Design",
          title: "Engineered for Velocity",
          description: "Self-contained component supporting custom child nodes or typed pages configuration.",
          bg: "bg-neutral-950",
        },
      ];
      return (
        <div className="relative h-[480px] w-full overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-950">
          <StickyPages pages={demoPages} pageHeight="380px" />
        </div>
      );
    }

    case "expandable-cards": {
      const demoStories: ExpandableCardItem[] = [
        {
          id: 1,
          name: "Kinetic Physics",
          tagline: "Spring-mass-damping equations tuned for real-time 120Hz tactility.",
          logo: <Sparkles className="h-6 w-6 text-white" />,
          quote: [
            "Motion isn't a cosmetic afterthought — it's tactile communication.",
            "Every interaction preserves physical velocity and momentum.",
          ],
          author: "Alex Rivera",
          role: "Design Technologist",
          href: "/components/kinetic-slider",
          bg: "bg-gradient-to-b from-rose-500 via-pink-600 to-orange-500",
          border: "border-rose-400/20",
        },
        {
          id: 2,
          name: "Source Ownership",
          tagline: "Clean TypeScript & Tailwind CSS living directly in your repository.",
          logo: <Zap className="h-6 w-6 text-white" />,
          quote: [
            "No bloated dependencies or mysterious stylesheet overrides.",
            "Run one command, own the raw code directly.",
          ],
          author: "Elena Vance",
          role: "Design Systems Lead",
          href: "/docs",
          bg: "bg-gradient-to-b from-[#0e1726] to-[#050914]",
          border: "border-indigo-500/20",
        },
        {
          id: 3,
          name: "Accessibility First",
          tagline: "Strict WCAG AA standards with automatic reduced motion fallbacks.",
          logo: <ShieldCheck className="h-6 w-6 text-white" />,
          quote: [
            "High-performance motion shouldn't compromise universal accessibility.",
            "Full keyboard loops and assistive screen reader cues.",
          ],
          author: "Sophia Dubois",
          role: "Accessibility Lead",
          href: "/docs/contributing",
          bg: "bg-gradient-to-b from-neutral-800 to-neutral-950",
          border: "border-white/10",
        },
      ];

      return (
        <div className="w-full max-w-5xl mx-auto p-2 sm:p-4">
          <ExpandableCards
            className={className}
            stories={demoStories}
            title="How Leading Teams Build"
            subtitle="Design Engineering"
            moreStoriesText="Explore all components"
            moreStoriesHref="/components"
          />
        </div>
      );
    }

    case "dot-text-hero":
      return (
        <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#080808]">
          <DotTextHero className={className} />
        </div>
      );

    case "cylinder-carousel": {
      const demoCylinderCards: CylinderCardItem[] = [
        {
          id: "kinetic-physics",
          title: "Kinetic Physics",
          pill: "120 FPS",
          bg: "radial-gradient(circle at 50% 55%, #17a2c8 0%, #6cc9a3 38%, #d5e59a 62%, #fbd3b6 88%)",
          content: ({ active }) => (
            <div className="relative flex h-full flex-col items-center justify-center text-white">
              <p className="text-5xl font-medium tracking-tight">120Hz</p>
              <p className="mt-1 text-[11px] text-white/80">Hooke's Law Springs</p>
              <svg viewBox="0 0 280 120" className="mt-6 w-full" aria-hidden="true">
                <motion.path
                  key={active ? "on" : "off"}
                  d="M0 84 L70 84 L90 96 L112 92 L122 74 L128 54 L140 54 L146 38 L158 34 L164 26"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  initial={active ? { pathLength: 0 } : false}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                />
                <motion.path
                  key={active ? "on-dash" : "off-dash"}
                  d="M164 26 C182 26 192 46 212 58 L240 76"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray="3 4"
                  initial={active ? { pathLength: 0 } : false}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.9 }}
                />
                <circle cx="164" cy="26" r="5" fill="white" />
              </svg>
              <p className="absolute inset-x-6 bottom-9 text-center text-[10px] leading-relaxed text-white/75">
                Velocity conservation:<br />
                Fluid gestures with zero stutter.
              </p>
            </div>
          ),
        },
        {
          id: "components",
          title: "Library Catalog",
          pill: "v2.0",
          bg: "linear-gradient(160deg, #6d6cf5 0%, #c15cf0 45%, #f06bd0 100%)",
          content: () => (
            <div className="flex h-full flex-col">
              <div className="flex flex-1 items-center justify-center text-white">
                <p className="text-6xl font-medium tracking-tight">113+</p>
              </div>
              <div className="m-3 flex h-24 items-center justify-between rounded-3xl bg-white/90 px-5 text-neutral-800">
                <div>
                  <p className="text-xs font-medium">Kinetic Primitives</p>
                  <p className="text-[10px] text-neutral-500">Accessible & Copy-Paste</p>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white font-semibold">
                  +
                </span>
              </div>
            </div>
          ),
        },
        {
          id: "accessibility",
          title: "Accessibility",
          pill: "WCAG AA",
          bg: "linear-gradient(180deg, #f7f8fa 0%, #eef0f4 100%)",
          dark: true,
          content: () => (
            <div className="flex h-full flex-col">
              <div className="relative flex flex-1 items-center justify-center">
                <div className="h-36 w-36 rounded-full bg-[radial-gradient(circle,#4f8cff_0%,#f58fb5_45%,rgba(255,255,255,0)_72%)] blur-md" />
              </div>
              <div className="m-3 rounded-3xl bg-white p-5 text-neutral-800 shadow-sm">
                <p className="text-xs font-medium">Inclusive By Default</p>
                <p className="text-xs text-neutral-500">Arrow keys & reduced-motion.</p>
              </div>
            </div>
          ),
        },
        {
          id: "source-ownership",
          title: "Source Ownership",
          pill: "CLI Ready",
          bg: "linear-gradient(165deg, #3ccfb4 0%, #6fd6e8 55%, #b6e7f7 100%)",
          content: ({ active }) => (
            <div className="flex h-full flex-col items-center justify-center text-white">
              <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90" aria-hidden="true">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="white"
                  strokeOpacity={0.3}
                  strokeWidth={8}
                />
                <motion.circle
                  key={active ? "on" : "off"}
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="white"
                  strokeWidth={8}
                  strokeLinecap="round"
                  initial={active ? { pathLength: 0 } : false}
                  animate={{ pathLength: 0.88 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <p className="absolute text-4xl font-medium">100%</p>
              <p className="mt-4 text-[11px] text-white/80">Code in your repo</p>
            </div>
          ),
        },
        {
          id: "zero-bloat",
          title: "Zero Bloat",
          pill: "Sub-ms",
          bg: "linear-gradient(165deg, #ff9a5a 0%, #ff7a8a 55%, #f4a6d0 100%)",
          content: ({ active }) => {
            const bars = [38, 52, 44, 68, 60, 84, 96];
            return (
              <div className="flex h-full flex-col justify-end px-7 pb-14 text-white">
                <p className="mb-6 text-4xl font-medium tracking-tight">&lt; 0.4ms</p>
                <div className="flex h-32 items-end gap-2">
                  {bars.map((b, i) => (
                    <motion.div
                      key={`${i}-${active}`}
                      className="flex-1 rounded-full bg-white/85"
                      initial={active ? { height: 0 } : false}
                      animate={{ height: `${b}%` }}
                      transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
                    />
                  ))}
                </div>
              </div>
            );
          },
        },
      ];

      return (
        <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <CylinderCarousel cards={demoCylinderCards} className={className} />
        </div>
      );
    }

    case "permission-switch":
      return <PermissionSwitchPreviewStage className={className} />;

    case "glyph-trail":
      return <GlyphTrailPreviewStage className={className} />;

    case "agent-status-badge":
      return <AgentStatusBadgePreviewStage className={className} />;

    case "animated-theme-toggler":
      return <AnimatedThemeTogglerPreviewStage className={className} />;

    case "text-mask-grid":
      return <TextMaskGridPreviewStage className={className} />;

    case "flickering-grid":
      return <FlickeringGridPreviewStage className={className} />;

    case "grid-card":
      return <GridCardPreviewStage className={className} />;

    case "cta-banner":
      return <CTABannerPreviewStage className={className} />;


    case "reveal-card-grid":
      return <RevealCardGridPreviewStage className={className} />;

    case "minimal-auth-card":
      return <MinimalAuthCardPreviewStage className={className} />;

    case "weather-card":
      return <WeatherCardPreviewStage className={className} />;

    // ── Consumer & Social ──

    case "heart-burst-button":
      return (
        <div className="flex items-center justify-center py-16">
          <HeartBurstButton initialCount={1248} className={className} />
        </div>
      );
    case "magnetic-button":
      return (
        <div className="flex flex-wrap items-center justify-center gap-4 py-12">
          <MagneticButton variant="primary" size="md">
            <Sparkles className="h-4 w-4" />
            <span>Magnetic Primary</span>
          </MagneticButton>
          <MagneticButton variant="outline" size="md">
            <span>Outline Button</span>
          </MagneticButton>
        </div>
      );

    case "split-button":
      return (
        <div className="flex items-center justify-center py-12">
          <SplitButton
            label="Deploy Release"
            options={[
              { value: "preview", label: "Deploy Preview" },
              { value: "staging", label: "Deploy Staging" },
              { value: "rollback", label: "Rollback Version" },
            ]}
            className={className}
          />
        </div>
      );

    case "spotlight-card":
      return (
        <div className="flex items-center justify-center py-8">
          <SpotlightCard enableTilt className={cn("w-full max-w-sm", className)}>
            <div className="text-sm font-semibold text-black dark:text-white">
              Spotlight Card
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Move your cursor across this surface to reveal the radial glow and 1px border mask.
            </p>
          </SpotlightCard>
        </div>
      );

    case "hold-to-confirm-button":
      return (
        <div className="flex items-center justify-center py-12">
          <HoldToConfirmButton
            label="Hold to Purge Cache"
            confirmedLabel="Cache Purged"
            holdDuration={1400}
            className={className}
          />
        </div>
      );

    case "toast-stack":
      return (
        <div className="w-full min-h-[300px] flex items-center justify-center">
          <ToastStack position="bottom-right" className={className} />
        </div>
      );

    case "drawer":
      return (
        <div className="flex items-center justify-center py-12">
          <Drawer side="right" triggerLabel="Open Drawer" className={className} />
        </div>
      );

    case "modal-popup":
      return (
        <div className="flex items-center justify-center py-12">
          <ModalPopup triggerLabel="Open Dialog" className={className} />
        </div>
      );

    case "command-menu":
      return (
        <div className="flex items-center justify-center py-12">
          <CommandMenu triggerLabel="Search commands..." className={className} />
        </div>
      );

    case "file-tree":
      return (
        <div className="w-full max-w-md mx-auto p-4">
          <FileTree className={className} />
        </div>
      );

    case "hover-cursor-shimmer-text":
      return (
        <div className="w-full max-w-2xl mx-auto p-4 flex items-center justify-center h-24">
          <HoverCursorShimmerText text="npx boseui add magnetic-button" className={className} as="h1" />
        </div>
      );

    // ── AI Components ──
    case "ai-voice-orb":
    case "aivoice-orb":
      return <AIVoiceOrbPreviewStage className={className} />;

    // ── Mockup Components ──
    case "terminal-window-mockup":
      return <TerminalWindowMockupPreviewStage className={className} />;

    // ── DevTools & Fintech Components ──

    case "transaction-receipt":
      return <TransactionReceiptPreviewStage className={className} />;
    case "interactive-api-endpoint-bar":
      return <InteractiveApiEndpointBarPreviewStage className={className} />;

    case "sql-data-grid":
      return <SqlDataGridPreviewStage className={className} />;
    default: {
      const BlockDemo = BLOCK_COMPONENTS[slug];
      if (BlockDemo) {
        return <BlockDemo className={className} />;
      }
      const FallbackDemo = COMPONENT_DEMOS[slug] as
        | React.ComponentType<{ className?: string }>
        | undefined;
      if (FallbackDemo) {
        return <FallbackDemo className={className} />;
      }
      return (
        <div className="flex min-h-[280px] w-full items-center justify-center p-8 text-center text-xs font-mono text-neutral-400">
          <span>Component preview stage for {slug}</span>
        </div>
      );
    }
  }
}

/**
 * Helper to return a ComponentType suitable for LazyDemoStage or dynamic renderers
 */
export function getComponentPreview(slug: string): React.ComponentType<{ className?: string }> {
  return function LazyPreviewWrapper({ className }: { className?: string }) {
    return <ComponentPreview slug={slug} className={className} />;
  };
}
