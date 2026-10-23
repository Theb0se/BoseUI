"use client";

import React, { useState, useEffect } from "react";
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
