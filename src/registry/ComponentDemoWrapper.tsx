"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function createComponentDemo(
  slug: string,
  Component: React.ComponentType<any>
): React.ComponentType {
  return function AutoComponentDemo() {
    switch (slug) {
      case "cursor-follower":
        return (
          <Component className="w-full max-w-lg p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                data-cursor-label="INSPECT ↗"
                className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-[#222222] dark:bg-[#0A0A0A]"
              >
                <div className="text-xs font-semibold text-black dark:text-white">
                  Hover Target 01
                </div>
                <div className="mt-1 text-[11px] text-neutral-500">
                  Morphs cursor ring into pill
                </div>
              </div>
              <div
                data-cursor-label="TRIGGER ⚡"
                className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-[#222222] dark:bg-[#0A0A0A]"
              >
                <div className="text-xs font-semibold text-black dark:text-white">
                  Hover Target 02
                </div>
                <div className="mt-1 text-[11px] text-neutral-500">
                  Dual-spring telemetry
                </div>
              </div>
            </div>
          </Component>
        );

      case "magnetic-button":
        return (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Component variant="primary" size="md">
              <Sparkles className="h-4 w-4" />
              <span>Magnetic Primary</span>
            </Component>
            <Component variant="outline" size="md">
              <span>Outline</span>
            </Component>
          </div>
        );

      case "split-button":
        return (
          <Component
            label="Deploy Release"
            options={[
              { value: "preview", label: "Deploy Preview" },
              { value: "staging", label: "Deploy to Staging" },
              { value: "rollback", label: "Rollback Production" },
            ]}
          />
        );

      case "spotlight-card":
        return (
          <Component enableTilt className="w-full max-w-sm">
            <div className="text-sm font-semibold text-black dark:text-white">
              Spotlight Card
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Move your cursor across this surface to reveal the radial glow and
              1px border mask.
            </p>
          </Component>
        );

      case "elastic-dock":
        return <Component baseSize={44} magnifiedSize={66} distance={135} />;

      case "variable-proximity-text":
        return (
          <Component
            text="Kinetic typography engineered with spring physics."
            radius={115}
            maxLift={-9}
            maxScale={1.2}
            className="w-full max-w-lg"
          />
        );

      case "kinetic-slider":
        return (
          <Component
            label="Spring Stiffness"
            defaultValue={68}
            min={0}
            max={100}
            unit="%"
          />
        );

      case "morphing-dialog":
        return (
          <Component
            triggerTitle="Inspect Spring Telemetry"
            triggerSubtitle="Click to expand shared-layout surface"
            dialogTitle="Hooke's Law Telemetry Architecture"
          />
        );

      case "interactive-grid-beam":
        return <Component gridSize={32} glowRadius={220} className="w-full max-w-lg" />;

      case "scrubbable-number-input":
        return (
          <Component
            label="Stiffness"
            defaultValue={240}
            min={20}
            max={600}
            step={5}
            unit="N/m"
          />
        );

      case "liquid-pill-tabs":
        return <Component />;

      case "holographic-flip-card":
        return <Component maxTilt={12} stiffness={220} damping={22} />;

      case "gravity-well-portal":
        return <Component pullRadius={180} pullStrength={0.55} />;

      case "hold-to-confirm-button":
        return (
          <Component
            label="Hold to Purge Cache"
            confirmedLabel="Cache Purged"
            holdDuration={1400}
          />
        );

      case "accordion-stack-cards":
        return <Component stiffness={300} damping={25} />;

      case "radial-menu-orb":
        return <Component radius={78} stiffness={340} damping={22} />;

      case "cipher-scramble-text":
        return (
          <Component
            text="ZERO-DEPENDENCY KINETIC PRIMITIVES"
            frameInterval={28}
            cyclesPerChar={2}
          />
        );

      case "topographic-ripple-surface":
        return <Component ringCount={6} stiffness={220} damping={20} />;

      case "dynamic-island-toast":
        return (
          <Component
            defaultMode="compact"
            title="Registry Sync Active"
            subtitle="20 shadcn v2 manifests compiled in 42ms"
          />
        );

      case "spring-pin-input":
        return <Component length={6} defaultValue="482" />;

      case "spring-pendulum":
        return (
          <Component
            rodLength={110}
            impulseAngle={42}
            stiffness={140}
            damping={6}
          />
        );

      case "elastic-snap-sortable":
        return <Component stiffness={380} damping={26} />;

      case "kinetic-swipe-button":
        return (
          <Component
            label="Slide to Deploy Production"
            completedLabel="Deployment Triggered"
            threshold={0.78}
          />
        );

      case "ripple-burst-button":
        return (
          <Component
            label="Emit Shockwave Pulse"
            stiffness={400}
            damping={22}
          />
        );

      case "morphing-action-button":
        return (
          <Component
            idleLabel="Publish Registry"
            loadingLabel="Compiling..."
            successLabel="Published v2.4"
          />
        );

      case "parallax-tilt-card":
        return (
          <Component
            title="Spatial Depth Plane"
            maxTilt={14}
            stiffness={240}
            damping={22}
          />
        );

      case "expandable-bento-card":
        return (
          <Component
            badge="RUNTIME_TELEMETRY"
            title="GPU Compositor Pipeline"
          />
        );

      case "peel-reveal-card":
        return (
          <Component
            title="Production Secret Key"
            secretValue="bose_live_98f72a41c09e3b1d"
          />
        );

      case "magnetic-breadcrumb":
        return <Component stiffness={380} damping={26} />;

      case "floating-compass-nav":
        return (
          <Component defaultQuadrant="SE" stiffness={300} damping={24} />
        );

      case "kinetic-step-indicator":
        return <Component defaultStep={1} stiffness={320} damping={25} />;

      case "kinetic-rolling-counter":
        return (
          <Component
            defaultValue={1248}
            step={17}
            stiffness={340}
            damping={26}
          />
        );

      case "split-flap-text":
        return (
          <Component
            words={["KINETIC", "PHYSICS", "SPRINGS", "MINIMAL"]}
            stiffness={380}
            damping={24}
          />
        );

      case "elastic-wave-text":
        return (
          <Component text="Harmonic Transverse Wave" amplitude={-14} />
        );

      case "constellation-mesh-field":
        return <Component connectRadius={130} />;

      case "aurora-flux-surface":
        return <Component orbRadius={260} stiffness={180} damping={24} />;

      case "kinetic-drawer-sheet":
        return (
          <Component
            triggerLabel="Open Gesture Drawer"
            title="Multi-Detent Spring Sheet"
          />
        );

      case "magnetic-popover-menu":
        return (
          <Component
            triggerLabel="Quick Actions"
            stiffness={380}
            damping={26}
          />
        );

      case "rotary-spring-dial":
        return (
          <Component
            label="Damping Ratio"
            defaultValue={65}
            min={0}
            max={100}
            step={5}
            unit="%"
          />
        );

      case "elastic-tag-input":
        return (
          <Component
            defaultTags={["framer-motion", "spring-physics", "shadcn-v2"]}
            maxTags={8}
          />
        );

      default:
        return <Component />;
    }
  };
}
