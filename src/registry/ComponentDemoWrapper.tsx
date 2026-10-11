"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function createComponentDemo(
  slug: string,
  Component: React.ComponentType<any>
): React.ComponentType<{ className?: string }> {
  return function AutoComponentDemo({ className }: { className?: string }) {
    switch (slug) {
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
            className={className}
          />
        );

      case "spotlight-card":
        return (
          <Component enableTilt className={className ?? "w-full max-w-sm"}>
            <div className="text-sm font-semibold text-black dark:text-white">
              Spotlight Card
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Move your cursor across this surface to reveal the radial glow and
              1px border mask.
            </p>
          </Component>
        );

      case "hold-to-confirm-button":
        return (
          <Component
            label="Hold to Purge Cache"
            confirmedLabel="Cache Purged"
            holdDuration={1400}
            className={className}
          />
        );

      case "toast-stack":
        return <Component position="bottom-right" className={className} />;

      case "drawer":
        return (
          <Component
            side="right"
            triggerLabel="Open Drawer"
            className={className}
          />
        );

      case "modal-popup":
        return <Component triggerLabel="Open Dialog" className={className} />;

      case "command-menu":
        return (
          <Component triggerLabel="Search commands..." className={className} />
        );

      case "warp-text":
        return <Component demoMode className={className} />;

      case "blur-fade-in-text":
        return (
          <Component
            text="Cinematic blur fade with kinetic spring arrival."
            by="word"
            className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl"
          />
        );

      case "chromatic-aberration-glitch-text":
        return (
          <Component
            text="CHROMATIC GLITCH"
            trigger="hover"
            className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white sm:text-4xl"
          />
        );

      case "magnetic-scatter-text":
        return (
          <Component
            text="MAGNETIC SCATTER"
            radius={120}
            strength={45}
            className="text-2xl font-black tracking-wider text-neutral-900 dark:text-white sm:text-3xl"
          />
        );

      case "perspective-tilt-text":
        return (
          <Component
            text="PERSPECTIVE 3D"
            maxTilt={20}
            className="text-3xl font-black text-neutral-950 dark:text-white sm:text-4xl"
          />
        );

      case "spotlight-glow-reveal-text":
        return (
          <Component
            text="Hover cursor to illuminate the hidden text"
            radius={140}
            className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl"
          />
        );

      case "typewriter-cursor-effect":
        return (
          <div className="text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
            <span>Build </span>
            <Component
              words={["fluid animations", "kinetic interfaces", "tactile experiences"]}
              className="text-blue-600 dark:text-blue-400 font-extrabold"
            />
          </div>
        );

      default:
        return <Component className={className} />;
    }
  };
}
