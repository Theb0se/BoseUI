"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { COMPONENT_DEMOS } from "@/registry/generated-demos";
import { BLOCK_COMPONENTS } from "@/components/blocks/registry";

// Backgrounds & simulations
import { BlackHole } from "@/components/ui/BlackHole";
import { PlanetHorizon } from "@/components/ui/PlanetHorizon";
import { WormholeTunnel } from "@/components/ui/WormholeTunnel";
import { AsteroidField } from "@/components/ui/AsteroidField";
import { SolarFlare } from "@/components/ui/SolarFlare";
import { Waterfall } from "@/components/ui/Waterfall";
import { OceanWaves } from "@/components/ui/OceanWaves";
import { UnderwaterCaustics } from "@/components/ui/UnderwaterCaustics";
import { WaterRipples } from "@/components/ui/WaterRipples";
import { LavaLamp } from "@/components/ui/LavaLamp";
import { Fireflies } from "@/components/ui/Fireflies";
import { Thunderstorm } from "@/components/ui/Thunderstorm";
import { FallingPetals } from "@/components/ui/FallingPetals";
import { AtmosphericFog } from "@/components/ui/AtmosphericFog";
import { VolcanoEmbers } from "@/components/ui/VolcanoEmbers";
import { MatrixRain } from "@/components/ui/MatrixRain";
import { DigitalRadar } from "@/components/ui/DigitalRadar";
import { ConstellationMap } from "@/components/ui/ConstellationMap";
import { IsometricCity } from "@/components/ui/IsometricCity";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { StarryNight } from "@/components/ui/StarryNight";
import { ShootingStars } from "@/components/ui/ShootingStars";
import { HorizonLight } from "@/components/ui/HorizonLight";
import { SunriseHorizon } from "@/components/ui/SunriseHorizon";
import { WarpSpeed } from "@/components/ui/WarpSpeed";
import { Snowfall } from "@/components/ui/Snowfall";
import { RainOnGlass } from "@/components/ui/RainOnGlass";
import { MeshGradient } from "@/components/ui/MeshGradient";
import { GalaxyNebula } from "@/components/ui/GalaxyNebula";
import { ParticleNetwork } from "@/components/ui/ParticleNetwork";

// Stripe, Apple, DevTools, Consumer & Fintech components
import { LiveCardForm } from "@/components/ui/LiveCardForm";
import { TiltCreditCard3D } from "@/components/ui/TiltCreditCard3D";
import { RollingNumberTicker } from "@/components/ui/RollingNumberTicker";
import { ScrubbableSparkline } from "@/components/ui/ScrubbableSparkline";
import { PricingCalculator } from "@/components/ui/PricingCalculator";
import { GradientMeshHero } from "@/components/ui/GradientMeshHero";
import { TabbedCodeBlock } from "@/components/ui/TabbedCodeBlock";
import { GlobeArcs } from "@/components/ui/GlobeArcs";
import { GlowBorderCard } from "@/components/ui/GlowBorderCard";
import { MorphingMegaMenu } from "@/components/ui/MorphingMegaMenu";
import { ColorFinishPicker } from "@/components/ui/ColorFinishPicker";
import { DockMagnification } from "@/components/ui/DockMagnification";
import { SiriGlowEdge } from "@/components/ui/SiriGlowEdge";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { AutoplayStoryCarousel } from "@/components/ui/AutoplayStoryCarousel";
import { PlusGridBorder } from "@/components/ui/PlusGridBorder";
import { ShimmerText } from "@/components/ui/ShimmerText";
import { KeycapChips } from "@/components/ui/KeycapChips";
import { DeploymentTimeline } from "@/components/ui/DeploymentTimeline";
import { DiffViewer } from "@/components/ui/DiffViewer";
import { HoverRevealFeatureGrid } from "@/components/ui/HoverRevealFeatureGrid";
import { ExpandingSearchPill } from "@/components/ui/ExpandingSearchPill";
import { CategoryFilterScroller } from "@/components/ui/CategoryFilterScroller";
import { HeartBurstButton } from "@/components/ui/HeartBurstButton";
import { NowPlayingWaveform } from "@/components/ui/NowPlayingWaveform";
import { SwipeCards } from "@/components/ui/SwipeCards";
import { StreakCounter } from "@/components/ui/StreakCounter";
import { SegmentedRangePicker } from "@/components/ui/SegmentedRangePicker";
import { MultiplayerCursors } from "@/components/ui/MultiplayerCursors";
import { SlashCommandMenu } from "@/components/ui/SlashCommandMenu";
import { ReactionPicker } from "@/components/ui/ReactionPicker";
import { AvatarStackPresence } from "@/components/ui/AvatarStackPresence";

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
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
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
import { StickySubNav } from "@/components/ui/StickySubNav";
import { StickyScrollStory } from "@/components/ui/StickyScrollStory";
import { FloatingCompassNav } from "@/components/ui/FloatingCompassNav";
import { MagneticPopoverMenu } from "@/components/ui/MagneticPopoverMenu";
import { RadialMenuOrb } from "@/components/ui/RadialMenuOrb";
import { ElasticDock } from "@/components/ui/ElasticDock";
import { AppleContextMenu } from "@/components/ui/AppleContextMenu";
import { AppleSearchField } from "@/components/ui/AppleSearchField";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { CarouselWithDots } from "@/components/ui/CarouselWithDots";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { ElasticSnapSortable } from "@/components/ui/ElasticSnapSortable";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { KineticDrawerSheet } from "@/components/ui/KineticDrawerSheet";
import { KineticRollingCounter } from "@/components/ui/KineticRollingCounter";
import { KineticStepIndicator } from "@/components/ui/KineticStepIndicator";
import { LiquidGradientBlob } from "@/components/ui/LiquidGradientBlob";
import { MagneticBreadcrumb } from "@/components/ui/MagneticBreadcrumb";
import { PickerWheel } from "@/components/ui/PickerWheel";
import { PopoverCard } from "@/components/ui/PopoverCard";
import { TopographicRippleSurface } from "@/components/ui/TopographicRippleSurface";
import { InteractiveGridBeam } from "@/components/ui/InteractiveGridBeam";
import { GridHorizon } from "@/components/ui/GridHorizon";
import { GravityWellPortal } from "@/components/ui/GravityWellPortal";
import { CloudsDrift } from "@/components/ui/CloudsDrift";
import { AuroraFluxSurface } from "@/components/ui/AuroraFluxSurface";

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
import { AIStreamingText } from "@/components/ui/AIStreamingText";
import { AIThinkingLoader } from "@/components/ui/AIThinkingLoader";
import { AIStatusBadge } from "@/components/ui/AIStatusBadge";
import { AIChatBubble } from "@/components/ui/AIChatBubble";
import { AIPromptInput } from "@/components/ui/AIPromptInput";
import { AIGenerationProgress } from "@/components/ui/AIGenerationProgress";
import { AICommandBar } from "@/components/ui/AICommandBar";
import { AIReasoningAccordion } from "@/components/ui/AIReasoningAccordion";
import { AIVoiceOrb, type AIVoiceOrbState, type AIVoiceOrbTheme } from "@/components/ui/AIVoiceOrb";
import { ContextTokenGauge } from "@/components/ui/ContextTokenGauge";
import { AIPromptDiffViewer } from "@/components/ui/AIPromptDiffViewer";
import { AICodeExecutionSandbox } from "@/components/ui/AICodeExecutionSandbox";

// Mockup Components
import { IPhone16ProMockup } from "@/components/ui/IPhone16ProMockup";
import { MacBookProMockup } from "@/components/ui/MacBookProMockup";
import { IPadProMockup } from "@/components/ui/IPadProMockup";
import { MacOSWindowMockup } from "@/components/ui/MacOSWindowMockup";
import { SafariBrowserMockup } from "@/components/ui/SafariBrowserMockup";
import { TerminalWindowMockup } from "@/components/ui/TerminalWindowMockup";

// DevTools & Fintech Components
import { KeyboardShortcutStack, PhysicalKeycap } from "@/components/ui/KeyboardShortcutStack";
import { InteractiveCodeDiff } from "@/components/ui/InteractiveCodeDiff";
import { TransactionReceipt } from "@/components/ui/TransactionReceipt";
import { InteractiveGitGraph } from "@/components/ui/InteractiveGitGraph";
import { InteractivePricingTierDial } from "@/components/ui/InteractivePricingTierDial";

// Developer Tools Suite (18 Components)
import { InteractiveApiEndpointBar } from "@/components/ui/InteractiveApiEndpointBar";
import { CronScheduleBuilder } from "@/components/ui/CronScheduleBuilder";
import { RateLimitMeter } from "@/components/ui/RateLimitMeter";
import { WebhookPayloadSimulator } from "@/components/ui/WebhookPayloadSimulator";
import { SqlDataGrid } from "@/components/ui/SqlDataGrid";
import { EnvSecretVault } from "@/components/ui/EnvSecretVault";
import { DatabaseConnectionHealthBadge } from "@/components/ui/DatabaseConnectionHealthBadge";
import { LiveLogStreamer } from "@/components/ui/LiveLogStreamer";
import { ServerMetricsSparkboard } from "@/components/ui/ServerMetricsSparkboard";
import { ErrorStackTraceInspector } from "@/components/ui/ErrorStackTraceInspector";
import { HealthCheckStatusMatrix } from "@/components/ui/HealthCheckStatusMatrix";
import { PipelineDAGViewer } from "@/components/ui/PipelineDAGViewer";
import { SemverReleaseDraftCard } from "@/components/ui/SemverReleaseDraftCard";
import { PackageDependencyTree } from "@/components/ui/PackageDependencyTree";
import { RegexPlayground } from "@/components/ui/RegexPlayground";
import { FeatureFlagToggleStack } from "@/components/ui/FeatureFlagToggleStack";
import { JsonSchemaFormValidator } from "@/components/ui/JsonSchemaFormValidator";
import { ArchitectureFlowchartNode } from "@/components/ui/ArchitectureFlowchartNode";

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
function PlanetHorizonPreviewStage({ className }: { className?: string }) {
  const [atmosphereColor, setAtmosphereColor] = useState("#38BDF8");
  const [flareColor, setFlareColor] = useState("#FDE047");
  const [flarePosition, setFlarePosition] = useState(0.5);
  const [autoplay, setAutoplay] = useState(true);

  return (
    <div className="relative w-full flex flex-col">
      <PlanetHorizon
        atmosphereColor={atmosphereColor}
        flareColor={flareColor}
        flarePosition={flarePosition}
        autoplay={autoplay}
        className={className}
      >
        <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-6 sm:p-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-xs font-medium text-sky-300">
              <Sparkles className="h-3 w-3" /> Orbital Sunrise
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Atmospheric Limb
            </h2>
            <p className="text-xs text-neutral-300">
              Curved planetary horizon with Rayleight atmospheric scattering
            </p>
          </div>
        </div>
      </PlanetHorizon>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200/80 bg-neutral-50/50 p-4 text-xs dark:border-neutral-800/80 dark:bg-neutral-900/40">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 font-mono text-neutral-600 dark:text-neutral-400">
            <span>Flare Position:</span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={flarePosition}
              onChange={(e) => {
                setAutoplay(false);
                setFlarePosition(Number(e.target.value));
              }}
              className="w-24 accent-sky-500"
            />
            <span className="w-8">{Math.round(flarePosition * 100)}%</span>
          </label>

          <label className="flex items-center gap-1.5 font-mono text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              className="rounded accent-sky-500"
            />
            <span>Autoplay Sunrise</span>
          </label>

          <div className="flex items-center gap-1.5">
            {[
              { label: "Earth", atmo: "#38BDF8", flare: "#FDE047" },
              { label: "Mars", atmo: "#FB923C", flare: "#FED7AA" },
              { label: "Kepler", atmo: "#A855F7", flare: "#E9D5FF" },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setAtmosphereColor(p.atmo);
                  setFlareColor(p.flare);
                }}
                className="rounded border border-neutral-300 bg-white px-2 py-0.5 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-800"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive preview wrapper for Live Card Form
 */
function LiveCardFormPreviewStage({ className }: { className?: string }) {
  const [success, setSuccess] = useState(false);

  return (
    <div className="relative w-full flex flex-col">
      <LiveCardForm
        defaultAmount="$149.00"
        onSuccess={() => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
        }}
        className={className}
      />
    </div>
  );
}

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

function AIStreamingTextPreviewStage({ className }: { className?: string }) {
  const [speed, setSpeed] = useState(20);
  const [key, setKey] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const prompts = [
    "I've analyzed your component hierarchy. The layout projection springs in Framer Motion 11 can be optimized by elevating `layoutId` to shared boundary contexts.",
    "Quantum superposition allows particles to exist in a linear combination of states until an observation collapses the wavefunction into a definite eigenstate.",
    "BoseUI is engineered for architectural tactile precision — combining fluid spring physics, zero-runtime overhead, and monochrome minimalism.",
  ];

  return (
    <div className={cn("w-full max-w-2xl mx-auto flex flex-col gap-5 p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-1.5">
          {prompts.map((_, i) => (
            <button
              key={i}
              onClick={() => { setSelectedPrompt(i); setKey((k) => k + 1); }}
              className={cn(
                "px-2.5 py-1 text-xs font-mono rounded-lg transition-all",
                selectedPrompt === i ? "bg-foreground text-background font-medium shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Prompt {i + 1}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>
      <div className="min-h-[110px] rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
        <AIStreamingText
          key={key}
          text={prompts[selectedPrompt]}
          speed={speed}
          className="text-base font-normal leading-relaxed text-foreground"
        />
      </div>
    </div>
  );
}

function AIThinkingLoaderPreviewStage({ className }: { className?: string }) {
  const [variant, setVariant] = useState<"dots" | "wave" | "ring" | "pulse">("dots");
  const [showText, setShowText] = useState(true);

  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col items-center gap-6 p-6", className)}>
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
        {(["dots", "wave", "ring", "pulse"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all",
              variant === v ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex min-h-[140px] w-full items-center justify-center rounded-2xl border border-border bg-card/60 p-8 shadow-sm">
        <AIThinkingLoader
          variant={variant}
          size={10}
          text={showText ? "Processing reasoning tokens…" : undefined}
        />
      </div>
    </div>
  );
}

function AIStatusBadgePreviewStage({ className }: { className?: string }) {
  const statuses = ["idle", "thinking", "generating", "done", "error"] as const;
  const [statusIndex, setStatusIndex] = useState(1);
  const currentStatus = statuses[statusIndex];

  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col items-center gap-6 p-6", className)}>
      <div className="flex flex-col items-center gap-2">
        <AIStatusBadge
          status={currentStatus}
          onClick={() => setStatusIndex((i) => (i + 1) % statuses.length)}
          className="text-sm px-4 py-1.5 cursor-pointer"
        />
        <span className="text-[11px] text-muted-foreground/60 select-none">
          Click badge to cycle status
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 border-t border-border w-full">
        {statuses.map((s, i) => (
          <button
            key={s}
            onClick={() => setStatusIndex(i)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-lg capitalize transition-all",
              statusIndex === i ? "bg-foreground text-background font-medium shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function AIChatBubblePreviewStage({ className }: { className?: string }) {
  const [messages, setMessages] = useState([
    { role: "user" as const, content: "Can you create an accessible spring modal for Next.js?", time: "10:24 AM" },
    { role: "assistant" as const, content: "Here's an accessible modal with Framer Motion spring physics, focus trap, and keyboard Escape handling built for BoseUI.", time: "10:24 AM" },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateReply = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setMessages((m) => [...m, { role: "user" as const, content: "How do I animate list stagger?", time: "10:25 AM" }]);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant" as const,
          content: "Use `variants` with `transition: { staggerChildren: 0.08 }` on the parent `<motion.ul>` container.",
          time: "10:25 AM",
        },
      ]);
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className={cn("w-full max-w-lg mx-auto flex flex-col gap-4 p-4", className)}>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono font-medium text-foreground">AI Conversation Stage</span>
        </div>
        <button
          onClick={simulateReply}
          disabled={isSimulating}
          className="text-xs px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-accent transition-colors disabled:opacity-50"
        >
          {isSimulating ? "Thinking…" : "+ Simulate Turn"}
        </button>
      </div>
      <div className="flex flex-col gap-3 min-h-[180px]">
        {messages.map((msg, i) => (
          <AIChatBubble
            key={i}
            role={msg.role}
            content={msg.content}
            avatar={msg.role === "user" ? "U" : "AI"}
            timestamp={msg.time}
          />
        ))}
        {isSimulating && (
          <AIChatBubble role="assistant" typing avatar="AI" />
        )}
      </div>
    </div>
  );
}

function AIPromptInputPreviewStage({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState<string[]>([]);
  const suggestions = [
    "Explain React 19 Actions",
    "Generate kinetic button styles",
    "Refactor to custom hook",
  ];

  return (
    <div className={cn("w-full max-w-xl mx-auto flex flex-col gap-4 p-4", className)}>
      <AIPromptInput
        placeholder="Ask anything or test prompt input…"
        suggestions={suggestions}
        onSubmit={(val) => setSubmitted((prev) => [val, ...prev])}
      />
      {submitted.length > 0 && (
        <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
          <span className="text-[11px] font-mono text-muted-foreground uppercase">Recently Submitted:</span>
          {submitted.slice(0, 3).map((item, i) => (
            <div key={i} className="text-xs text-foreground bg-muted/40 p-2.5 rounded-lg border border-border">
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AIGenerationProgressPreviewStage({ className }: { className?: string }) {
  const [progress, setProgress] = useState(65);
  const [running, setRunning] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    if (!running || indeterminate) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setRunning(false);
          return 100;
        }
        return p + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [running, indeterminate]);

  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col items-center gap-6 p-6", className)}>
      <AIGenerationProgress
        progress={progress}
        total={500}
        current={Math.round((progress / 100) * 500)}
        indeterminate={indeterminate}
        size={110}
        statusText={indeterminate ? "Reasoning tokens…" : running ? "Streaming response…" : progress >= 100 ? "Generation Complete" : "Paused"}
      />
      <div className="flex items-center gap-2 border-t border-border pt-4 w-full justify-center">
        <button
          onClick={() => {
            if (progress >= 100) setProgress(0);
            setRunning(!running);
          }}
          disabled={indeterminate}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent transition-colors disabled:opacity-40"
        >
          {running ? "Pause" : progress >= 100 ? "Restart" : "Start Progress"}
        </button>
        <button
          onClick={() => { setProgress(0); setRunning(false); }}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => setIndeterminate(!indeterminate)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
            indeterminate ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-accent"
          )}
        >
          {indeterminate ? "Determinate" : "Indeterminate"}
        </button>
      </div>
    </div>
  );
}

function AICommandBarPreviewStage({ className }: { className?: string }) {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className={cn("w-full max-w-xl mx-auto flex flex-col gap-4 p-4", className)}>
      <AICommandBar
        onSelect={(cmd) => setLastAction(`Selected: /${cmd.trigger} (${cmd.label})`)}
        onSubmit={(cmd, query) => setLastAction(`Executed: ${cmd ? `/${cmd.trigger} ` : ""}"${query}"`)}
      />
      {lastAction ? (
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground font-mono">
          <span>{lastAction}</span>
          <button onClick={() => setLastAction(null)} className="text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          Type <code className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">/</code> to trigger command dropdown, or type any prompt and press Enter
        </p>
      )}
    </div>
  );
}

function AIReasoningAccordionPreviewStage({ className }: { className?: string }) {
  const [status, setStatus] = useState<"thinking" | "completed">("completed");
  const [seconds, setSeconds] = useState(3.4);

  return (
    <div className={cn("w-full max-w-xl mx-auto flex flex-col items-center gap-4 p-4", className)}>
      <div className="flex items-center gap-2 border-b border-border pb-3 w-full justify-between">
        <span className="text-xs font-mono text-muted-foreground">Reasoning Engine</span>
        <button
          onClick={() => {
            setStatus("thinking");
            setTimeout(() => {
              setStatus("completed");
              setSeconds((s) => Number((s + 0.3).toFixed(1)));
            }, 1800);
          }}
          className="text-xs px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
        >
          {status === "thinking" ? "Thinking…" : "Simulate Thought"}
        </button>
      </div>
      <AIReasoningAccordion thinkingTime={seconds} status={status}>
        <p>The reasoning model concluded that client-side spring dampening provides superior 60fps fluidity compared to standard CSS easing cubic-beziers.</p>
      </AIReasoningAccordion>
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

function ContextTokenGaugePreviewStage({ className }: { className?: string }) {
  const [variant, setVariant] = useState<"radial" | "bar">("radial");
  const [used, setUsed] = useState(48200);

  return (
    <div className={cn("w-full max-w-lg mx-auto flex flex-col items-center gap-5 p-4", className)}>
      <div className="flex items-center justify-between border-b border-border pb-3 w-full">
        {/* Variant toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {(["radial", "bar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all",
                variant === v ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Quick loads */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setUsed(34000)}
            className="text-xs px-2 py-1 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            Optimal (34k)
          </button>
          <button
            onClick={() => setUsed(102000)}
            className="text-xs px-2 py-1 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            High (102k)
          </button>
          <button
            onClick={() => setUsed(121000)}
            className="text-xs px-2 py-1 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            Critical (121k)
          </button>
        </div>
      </div>

      <ContextTokenGauge
        usedTokens={used}
        maxTokens={128000}
        systemTokens={4200}
        promptTokens={Math.round(used * 0.65)}
        completionTokens={Math.round(used * 0.35)}
        variant={variant}
      />
    </div>
  );
}

function AIPromptDiffViewerPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <AIPromptDiffViewer
        filename="components/MagneticButton.tsx"
        language="typescript"
      />
    </div>
  );
}

function AICodeExecutionSandboxPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <AICodeExecutionSandbox
        language="typescript"
        executionTimeMs={138}
      />
    </div>
  );
}

function IPhone16ProMockupPreviewStage({ className }: { className?: string }) {
  const [color, setColor] = useState<"natural" | "desert" | "black" | "white">("natural");
  const [enableTilt, setEnableTilt] = useState(true);
  const [showLockScreen, setShowLockScreen] = useState(true);
  const wallpapers = [
    { label: "Titanium", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" },
    { label: "Neon Fluid", url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop" },
    { label: "Cyber Minimal", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" },
  ];
  const [selectedWallpaper, setSelectedWallpaper] = useState(0);

  return (
    <div className={cn("w-full flex flex-col items-center gap-6 p-4", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-border pb-4 w-full max-w-lg">
        {/* Colors */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {(["natural", "desert", "black", "white"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-all",
                color === c ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Wallpaper Presets */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {wallpapers.map((w, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWallpaper(idx)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg transition-all",
                selectedWallpaper === idx ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {w.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowLockScreen(!showLockScreen)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
            showLockScreen ? "border-foreground bg-foreground text-background shadow-sm" : "border-border bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          {showLockScreen ? "Lockscreen UI" : "Clean Screen"}
        </button>

        <button
          onClick={() => setEnableTilt(!enableTilt)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
            enableTilt ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:text-foreground"
          )}
        >
          {enableTilt ? "Tilt On" : "Tilt Off"}
        </button>
      </div>

      <IPhone16ProMockup
        color={color}
        enableTilt={enableTilt}
        showLockScreen={showLockScreen}
        imageSrc={wallpapers[selectedWallpaper].url}
      />
    </div>
  );
}

function MacBookProMockupPreviewStage({ className }: { className?: string }) {
  const [color, setColor] = useState<"space-black" | "silver">("space-black");
  const [enableTilt, setEnableTilt] = useState(true);
  const [showDock, setShowDock] = useState(true);
  const screens = [
    { label: "macOS Sequoia", url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1600&auto=format&fit=crop" },
    { label: "Analytics SaaS", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop" },
    { label: "Code Studio", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop" },
  ];
  const [selectedScreen, setSelectedScreen] = useState(0);

  return (
    <div className={cn("w-full flex flex-col items-center gap-6 p-4", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-border pb-4 w-full max-w-lg">
        {/* Colors */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {(["space-black", "silver"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all",
                color === c ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Screen Presets */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {screens.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScreen(idx)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg transition-all",
                selectedScreen === idx ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowDock(!showDock)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
            showDock ? "border-foreground bg-foreground text-background shadow-sm" : "border-border bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          {showDock ? "Dock On" : "Dock Off"}
        </button>

        <button
          onClick={() => setEnableTilt(!enableTilt)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
            enableTilt ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-accent"
          )}
        >
          {enableTilt ? "Tilt On" : "Tilt Off"}
        </button>
      </div>

      <MacBookProMockup
        color={color}
        enableTilt={enableTilt}
        showDock={showDock}
        imageSrc={screens[selectedScreen].url}
      />
    </div>
  );
}

function IPadProMockupPreviewStage({ className }: { className?: string }) {
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [color, setColor] = useState<"space-black" | "silver">("space-black");
  const screens = [
    { label: "Procreate Fluid", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1400&auto=format&fit=crop" },
    { label: "Minimal Mesh", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop" },
  ];
  const [selectedScreen, setSelectedScreen] = useState(0);

  return (
    <div className={cn("w-full flex flex-col items-center gap-6 p-4", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-border pb-4 w-full max-w-lg">
        {/* Orientation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {(["landscape", "portrait"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrientation(o)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all",
                orientation === o ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {o}
            </button>
          ))}
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {(["space-black", "silver"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all",
                color === c ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Screens */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          {screens.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScreen(idx)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg transition-all",
                selectedScreen === idx ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <IPadProMockup
        orientation={orientation}
        color={color}
        imageSrc={screens[selectedScreen].url}
      />
    </div>
  );
}

function MacOSWindowMockupPreviewStage({ className }: { className?: string }) {
  const screens = [
    { label: "Code Studio", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop" },
    { label: "Design Canvas", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop" },
  ];
  const [selectedScreen, setSelectedScreen] = useState(0);

  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-5", className)}>
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {screens.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedScreen(idx)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
              selectedScreen === idx ? "border-foreground bg-foreground text-background shadow-sm" : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <MacOSWindowMockup
        title="App Workspace"
        subtitle="Sequoia"
        imageSrc={screens[selectedScreen].url}
      />
    </div>
  );
}

function SafariBrowserMockupPreviewStage({ className }: { className?: string }) {
  const screens = [
    { label: "Analytics Dashboard", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop", path: "https://analytics.boseui.site" },
    { label: "Fintech Platform", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop", path: "https://stripe.com/overview" },
  ];
  const [selectedScreen, setSelectedScreen] = useState(0);

  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 flex flex-col items-center gap-5", className)}>
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {screens.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedScreen(idx)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-lg border transition-all",
              selectedScreen === idx ? "border-foreground bg-foreground text-background shadow-sm" : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <SafariBrowserMockup
        url={screens[selectedScreen].path}
        title={`${screens[selectedScreen].label} — Live Demo`}
        imageSrc={screens[selectedScreen].url}
      />
    </div>
  );
}

function TerminalWindowMockupPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-xl mx-auto p-4 flex items-center justify-center", className)}>
      <TerminalWindowMockup
        title="zsh — boseui cli"
        command="npx boseui add iphone-16-pro-mockup"
        output={[
          "✔ Fetching component manifest...",
          "✔ Installing Framer Motion spring physics...",
          "✔ Component ready at src/components/ui/IPhone16ProMockup.tsx",
        ]}
      />
    </div>
  );
}

function KeyboardShortcutStackPreviewStage({ className }: { className?: string }) {
  const [lastPressed, setLastPressed] = useState<string | null>(null);

  return (
    <div className={cn("w-full max-w-xl mx-auto flex flex-col gap-6 p-4", className)}>
      <div className="flex flex-col items-center text-center gap-1.5">
        <span className="text-xs font-medium text-foreground">Tactile 3D Physical Keycaps</span>
        <p className="text-xs text-muted-foreground">
          Press on your real keyboard (<kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">⌘</kbd>, <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">Shift</kbd>, <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">K</kbd>, <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">Enter</kbd>, <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">Esc</kbd>) or click any keycap:
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 py-2">
        <PhysicalKeycap keyLabel="⌘" size="lg" onPress={() => setLastPressed("Command (⌘)")} />
        <PhysicalKeycap keyLabel="Shift" size="lg" onPress={() => setLastPressed("Shift (⇧)")} />
        <PhysicalKeycap keyLabel="K" size="lg" onPress={() => setLastPressed("Letter K")} />
        <PhysicalKeycap keyLabel="Enter" size="lg" onPress={() => setLastPressed("Return ↵")} />
        <PhysicalKeycap keyLabel="Esc" size="lg" onPress={() => setLastPressed("Escape")} />
      </div>

      <div className="flex flex-col gap-3">
        <KeyboardShortcutStack
          keys={["⌘", "K"]}
          title="Command Palette"
          description="Global spotlight search & quick actions"
          onTrigger={() => setLastPressed("Shortcut: ⌘ + K")}
        />
        <KeyboardShortcutStack
          keys={["⇧", "⌘", "P"]}
          title="Command Runner"
          description="Execute developer tooling actions"
          onTrigger={() => setLastPressed("Shortcut: ⇧ + ⌘ + P")}
        />
      </div>

      {lastPressed && (
        <div className="text-center text-xs font-mono text-muted-foreground animate-fade-in">
          Last triggered: <span className="text-foreground font-semibold">{lastPressed}</span>
        </div>
      )}
    </div>
  );
}

function InteractiveCodeDiffPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <InteractiveCodeDiff
        filename="src/server/auth.ts"
        compareRange="main...feature/audit-logs"
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

function InteractiveGitGraphPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <InteractiveGitGraph />
    </div>
  );
}

function InteractivePricingTierDialPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <InteractivePricingTierDial />
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

function CronScheduleBuilderPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <CronScheduleBuilder />
    </div>
  );
}

function RateLimitMeterPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <RateLimitMeter />
    </div>
  );
}

function WebhookPayloadSimulatorPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <WebhookPayloadSimulator />
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

function EnvSecretVaultPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <EnvSecretVault />
    </div>
  );
}

function DatabaseConnectionHealthBadgePreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <DatabaseConnectionHealthBadge />
    </div>
  );
}

function LiveLogStreamerPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <LiveLogStreamer />
    </div>
  );
}

function ServerMetricsSparkboardPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-4xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <ServerMetricsSparkboard />
    </div>
  );
}

function ErrorStackTraceInspectorPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <ErrorStackTraceInspector />
    </div>
  );
}

function HealthCheckStatusMatrixPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <HealthCheckStatusMatrix />
    </div>
  );
}

function PipelineDAGViewerPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <PipelineDAGViewer />
    </div>
  );
}

function SemverReleaseDraftCardPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <SemverReleaseDraftCard />
    </div>
  );
}

function PackageDependencyTreePreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <PackageDependencyTree />
    </div>
  );
}

function RegexPlaygroundPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <RegexPlayground />
    </div>
  );
}

function FeatureFlagToggleStackPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <FeatureFlagToggleStack />
    </div>
  );
}

function JsonSchemaFormValidatorPreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <JsonSchemaFormValidator />
    </div>
  );
}

function ArchitectureFlowchartNodePreviewStage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 flex flex-col items-center gap-4", className)}>
      <ArchitectureFlowchartNode />
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

    case "planet-horizon":
      return <PlanetHorizonPreviewStage className={className} />;

    case "wormhole-tunnel":
      return (
        <WormholeTunnel ringCount={28} speed={1.2} twist={1.4} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                <Sparkles className="h-3 w-3" /> Warp Velocity
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Wormhole Conduit
              </h2>
            </div>
          </div>
        </WormholeTunnel>
      );

    case "asteroid-field":
      return (
        <AsteroidField asteroidCount={36} speed={1.0} angle={22} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                <Sparkles className="h-3 w-3" /> Deep Space Parallax
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Asteroid Field
              </h2>
            </div>
          </div>
        </AsteroidField>
      );

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
    case "waterfall":
      return (
        <Waterfall flow={1.0} mistAmount={0.8} splashIntensity={1.0} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-xs font-medium text-sky-300">
                <Sparkles className="h-3 w-3" /> Cascading Fluid Physics
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Waterfall
              </h2>
            </div>
          </div>
        </Waterfall>
      );

    case "ocean-waves":
      return (
        <OceanWaves waveCount={5} amplitude={26} speed={1.0} foam={true} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-400/10 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                <Sparkles className="h-3 w-3" /> Trochoidal Harmonics
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Ocean Waves
              </h2>
            </div>
          </div>
        </OceanWaves>
      );

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

    case "lava-lamp":
      return (
        <LavaLamp blobCount={7} speed={1.0} viscosity={0.45} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                <Sparkles className="h-3 w-3" /> Smooth-Min Metaballs
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Lava Lamp
              </h2>
            </div>
          </div>
        </LavaLamp>
      );

    // ── Nature & Atmosphere ──
    case "fireflies":
      return (
        <Fireflies count={55} showForest={true} speed={1.0} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-xs font-medium text-lime-300">
                <Sparkles className="h-3 w-3" /> Twilight Bioluminescence
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Fireflies
              </h2>
            </div>
          </div>
        </Fireflies>
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

    case "volcano-embers":
      return (
        <VolcanoEmbers emberCount={110} updraftSpeed={1.2} turbulence={1.0} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-2.5 py-0.5 text-xs font-medium text-orange-300">
                <Sparkles className="h-3 w-3" /> Thermal Ash & Updrafts
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Volcano Embers
              </h2>
            </div>
          </div>
        </VolcanoEmbers>
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

    case "constellation-map":
      return (
        <ConstellationMap showGrid={true} showLabels={true} className={className}>
          <div className="relative z-10 flex min-h-[460px] flex-col justify-between p-8 pointer-events-none">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-xs font-medium text-sky-300">
                <Sparkles className="h-3 w-3" /> Celestial Coordinates
              </span>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Constellation Map
              </h2>
            </div>
          </div>
        </ConstellationMap>
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
    case "live-card-form":
      return <LiveCardFormPreviewStage className={className} />;

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

    case "scrubbable-sparkline":
      return <ScrubbableSparkline className={className} />;

    case "pricing-calculator":
      return <PricingCalculator className={className} />;

    case "gradient-mesh-hero":
      return <GradientMeshHero className={className} />;

    case "tabbed-code-block":
      return (
        <div className="w-full max-w-4xl mx-auto p-4">
          <TabbedCodeBlock className={className} />
        </div>
      );

    case "globe-arcs":
      return <GlobeArcs className={className} />;

    case "glow-border-card":
      return <GlowBorderCard className={className} />;

    case "morphing-mega-menu":
      return (
        <div className="w-full flex justify-center py-12 min-h-[380px]">
          <MorphingMegaMenu className={className} />
        </div>
      );

    case "segmented-range-picker":
      return (
        <div className="w-full flex justify-center py-8">
          <SegmentedRangePicker className={className} />
        </div>
      );

    // ── Apple Inspired ──


    case "color-finish-picker":
      return <ColorFinishPicker className={className} />;

    case "dock-magnification":
      return (
        <div className="w-full flex justify-center py-12">
          <DockMagnification className={className} />
        </div>
      );

    case "siri-glow-edge":
      return (
        <div className="flex items-center justify-center p-8">
          <SiriGlowEdge className={cn("w-full max-w-md p-6", className)}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-400 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Apple Intelligence</h4>
                <p className="text-xs text-neutral-400">Contextual language reasoning at edge latency.</p>
              </div>
            </div>
          </SiriGlowEdge>
        </div>
      );

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

    case "autoplay-story-carousel":
      return (
        <div className="w-full max-w-2xl mx-auto p-4">
          <AutoplayStoryCarousel className={className} />
        </div>
      );

    // ── Developer Tools ──
    case "plus-grid-border":
      return <PlusGridBorder className={className} />;

    case "shimmer-text":
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <ShimmerText text="Next-Generation Kinetic Motion" className="text-3xl sm:text-5xl font-black" />
          <ShimmerText text="Crafted with sub-pixel precision" palette="emerald" className="text-lg font-medium" />
        </div>
      );

    case "keycap-chips":
      return (
        <div className="flex flex-wrap items-center justify-center gap-4 py-12">
          <KeycapChips keys={["⌘", "K"]} />
          <KeycapChips keys={["⇧", "⌘", "P"]} />
          <KeycapChips keys={["⌥", "↵"]} />
        </div>
      );

    case "deployment-timeline":
      return (
        <div className="w-full max-w-3xl mx-auto p-4">
          <DeploymentTimeline className={className} />
        </div>
      );

    case "diff-viewer":
      return (
        <div className="w-full max-w-4xl mx-auto p-4">
          <DiffViewer className={className} />
        </div>
      );

    case "hover-reveal-feature-grid":
      return (
        <div className="w-full max-w-4xl mx-auto p-4">
          <HoverRevealFeatureGrid className={className} />
        </div>
      );

    // ── Consumer & Social ──
    case "expanding-search-pill":
      return (
        <div className="flex items-center justify-center py-12">
          <ExpandingSearchPill className={className} />
        </div>
      );

    case "category-filter-scroller":
      return (
        <div className="w-full max-w-4xl mx-auto py-6">
          <CategoryFilterScroller className={className} />
        </div>
      );

    case "heart-burst-button":
      return (
        <div className="flex items-center justify-center py-16">
          <HeartBurstButton initialCount={1248} className={className} />
        </div>
      );

    case "now-playing-waveform":
      return (
        <div className="w-full max-w-xl mx-auto p-4">
          <NowPlayingWaveform className={className} />
        </div>
      );

    case "swipe-cards":
      return (
        <div className="flex items-center justify-center py-8">
          <SwipeCards className={className} />
        </div>
      );

    case "streak-counter":
      return (
        <div className="flex items-center justify-center py-12">
          <StreakCounter initialStreak={14} className={className} />
        </div>
      );

    case "multiplayer-cursors":
      return <MultiplayerCursors className={className} />;

    case "slash-command-menu":
      return (
        <div className="w-full max-w-2xl mx-auto p-4">
          <SlashCommandMenu className={className} />
        </div>
      );

    case "reaction-picker":
      return (
        <div className="flex items-center justify-center py-12">
          <ReactionPicker className={className} />
        </div>
      );

    case "avatar-stack-presence":
      return (
        <div className="flex items-center justify-center py-12">
          <AvatarStackPresence className={className} />
        </div>
      );

    // ── Buttons & Navigation ──
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

    case "copy-code-block":
      return (
        <div className="w-full max-w-2xl mx-auto p-4">
          <CopyCodeBlock code="npx boseui add magnetic-button" className={className} />
        </div>
      );

    case "hover-cursor-shimmer-text":
      return (
        <div className="w-full max-w-2xl mx-auto p-4 flex items-center justify-center h-24">
          <HoverCursorShimmerText text="npx boseui add magnetic-button" className={className} as="h1" />
        </div>
      );

    // ── AI Components ──
    case "ai-streaming-text":
    case "aistreaming-text":
      return <AIStreamingTextPreviewStage className={className} />;

    case "ai-thinking-loader":
    case "aithinking-loader":
      return <AIThinkingLoaderPreviewStage className={className} />;

    case "ai-status-badge":
    case "aistatus-badge":
      return <AIStatusBadgePreviewStage className={className} />;

    case "ai-chat-bubble":
    case "aichat-bubble":
      return <AIChatBubblePreviewStage className={className} />;

    case "ai-prompt-input":
    case "aiprompt-input":
      return <AIPromptInputPreviewStage className={className} />;

    case "ai-generation-progress":
    case "aigeneration-progress":
      return <AIGenerationProgressPreviewStage className={className} />;

    case "ai-command-bar":
    case "aicommand-bar":
      return <AICommandBarPreviewStage className={className} />;

    case "ai-reasoning-accordion":
    case "aireasoning-accordion":
      return <AIReasoningAccordionPreviewStage className={className} />;

    case "ai-voice-orb":
    case "aivoice-orb":
      return <AIVoiceOrbPreviewStage className={className} />;

    case "context-token-gauge":
      return <ContextTokenGaugePreviewStage className={className} />;

    case "ai-prompt-diff-viewer":
    case "aiprompt-diff-viewer":
      return <AIPromptDiffViewerPreviewStage className={className} />;

    case "ai-code-execution-sandbox":
    case "aicode-execution-sandbox":
      return <AICodeExecutionSandboxPreviewStage className={className} />;

    // ── Mockup Components ──
    case "iphone-16-pro-mockup":
    case "i-phone16-pro-mockup":
      return <IPhone16ProMockupPreviewStage className={className} />;

    case "macbook-pro-mockup":
    case "mac-book-pro-mockup":
      return <MacBookProMockupPreviewStage className={className} />;

    case "ipad-pro-mockup":
    case "i-pad-pro-mockup":
      return <IPadProMockupPreviewStage className={className} />;

    case "macos-window-mockup":
    case "mac-os-window-mockup":
      return <MacOSWindowMockupPreviewStage className={className} />;

    case "safari-browser-mockup":
      return <SafariBrowserMockupPreviewStage className={className} />;

    case "terminal-window-mockup":
      return <TerminalWindowMockupPreviewStage className={className} />;

    // ── DevTools & Fintech Components ──
    case "keyboard-shortcut-stack":
      return <KeyboardShortcutStackPreviewStage className={className} />;

    case "interactive-code-diff":
      return <InteractiveCodeDiffPreviewStage className={className} />;

    case "transaction-receipt":
      return <TransactionReceiptPreviewStage className={className} />;

    case "interactive-git-graph":
      return <InteractiveGitGraphPreviewStage className={className} />;

    case "interactive-pricing-tier-dial":
      return <InteractivePricingTierDialPreviewStage className={className} />;

    // ── Developer Tools Suite (18 Components) ──
    case "interactive-api-endpoint-bar":
      return <InteractiveApiEndpointBarPreviewStage className={className} />;

    case "cron-schedule-builder":
      return <CronScheduleBuilderPreviewStage className={className} />;

    case "rate-limit-meter":
      return <RateLimitMeterPreviewStage className={className} />;

    case "webhook-payload-simulator":
      return <WebhookPayloadSimulatorPreviewStage className={className} />;

    case "sql-data-grid":
      return <SqlDataGridPreviewStage className={className} />;

    case "env-secret-vault":
      return <EnvSecretVaultPreviewStage className={className} />;

    case "database-connection-health-badge":
      return <DatabaseConnectionHealthBadgePreviewStage className={className} />;

    case "live-log-streamer":
      return <LiveLogStreamerPreviewStage className={className} />;

    case "server-metrics-sparkboard":
      return <ServerMetricsSparkboardPreviewStage className={className} />;

    case "error-stack-trace-inspector":
      return <ErrorStackTraceInspectorPreviewStage className={className} />;

    case "health-check-status-matrix":
      return <HealthCheckStatusMatrixPreviewStage className={className} />;

    case "pipeline-dag-viewer":
      return <PipelineDAGViewerPreviewStage className={className} />;

    case "semver-release-draft-card":
      return <SemverReleaseDraftCardPreviewStage className={className} />;

    case "package-dependency-tree":
      return <PackageDependencyTreePreviewStage className={className} />;

    case "regex-playground":
      return <RegexPlaygroundPreviewStage className={className} />;

    case "feature-flag-toggle-stack":
      return <FeatureFlagToggleStackPreviewStage className={className} />;

    case "json-schema-form-validator":
      return <JsonSchemaFormValidatorPreviewStage className={className} />;

    case "architecture-flowchart-node":
      return <ArchitectureFlowchartNodePreviewStage className={className} />;

    // ── Default Fallback ──
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
