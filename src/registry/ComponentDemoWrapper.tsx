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

      case "gooey-input":
        return (
          <div className="flex min-h-[160px] w-full flex-col items-center justify-center gap-4 p-8">
            <Component
              placeholder="Search primitives..."
              className={className}
            />
            <span className="text-xs text-neutral-400 font-mono">
              Click to trigger liquid gooey separation
            </span>
          </div>
        );

      case "animated-theme-toggler":
        return (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Component variant="liquid-blob" glow size="lg" />
            <span className="text-xs font-mono text-neutral-400">
              Click to trigger liquid View Transition reveal
            </span>
          </div>
        );

      case "text-mask-grid":
        return (
          <div className="flex flex-col items-center justify-center w-full py-12 px-4 text-center">
            <Component
              text="BOSE"
              fontWeight={900}
              squareSize={4}
              gridGap={5}
              flickerChance={0.4}
              maxOpacity={0.6}
              className="w-full max-w-3xl"
            />
            <span className="mt-3 text-xs font-mono text-neutral-400">
              Hover to trigger spring scale • Grid renders inside letterforms
            </span>
          </div>
        );

      case "flickering-grid":
        return (
          <div className="relative h-64 w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <Component
              squareSize={4}
              gridGap={6}
              flickerChance={0.3}
              maxOpacity={0.4}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        );

      case "grid-card":
        return (
          <div className="w-full max-w-sm py-4">
            <Component
              icon={<Sparkles className="h-5 w-5 text-blue-500" />}
              title="Adaptive Edge Compute"
              description="Sub-millisecond compute primitives with dynamic canvas flickering and spring hover feedback."
              href="#"
            />
          </div>
        );

      case "cta-banner":
        return (
          <div className="w-full max-w-3xl px-4 py-4">
            <Component
              heading="Ship beautiful interfaces faster"
              subheading="Join 12,000+ engineers building with BoseUI every week."
              placeholder="you@company.com"
              buttonLabel="Join the waitlist"
              accentColor="#6366f1"
            />
          </div>
        );

      case "pricing-banner":
        return (
          <div className="w-full bg-neutral-950 rounded-2xl py-8 px-2">
            <Component
              heading="Simple, transparent pricing"
              subheading="Scale from zero to millions."
              plans={[
                {
                  name: "Starter",
                  description: "For individuals.",
                  monthlyPrice: 0,
                  yearlyPrice: 0,
                  ctaLabel: "Start free",
                  features: [
                    { text: "5 components", included: true },
                    { text: "Community support", included: true },
                    { text: "Private projects", included: false },
                  ],
                },
                {
                  name: "Pro",
                  description: "For teams.",
                  monthlyPrice: 29,
                  yearlyPrice: 23,
                  ctaLabel: "Start trial",
                  features: [
                    { text: "Unlimited components", included: true },
                    { text: "Priority support", included: true },
                    { text: "Private projects", included: true },
                  ],
                },
                {
                  name: "Enterprise",
                  description: "For large teams.",
                  monthlyPrice: 99,
                  yearlyPrice: 79,
                  ctaLabel: "Contact sales",
                  features: [
                    { text: "Unlimited components", included: true },
                    { text: "Priority support", included: true },
                    { text: "Dedicated Slack", included: true },
                  ],
                },
              ]}
              accentColor="#6366f1"
            />
          </div>
        );

      default:
        return <Component className={className} />;
    }
  };
}
