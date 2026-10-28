"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  MousePointer,
  CreditCard,
  Compass,
  Activity,
  Type,
  SunMedium,
  Layers,
  Laptop,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

interface CategoryMeta {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  featuredPills: string[];
}

const CATEGORIES_DATA: CategoryMeta[] = [
  {
    name: "Buttons",
    icon: MousePointer,
    tagline: "Magnetic pull, ripple shockwaves, split menus, and haptic spring triggers.",
    featuredPills: ["magnetic-button", "ripple-burst-button", "split-button"],
  },
  {
    name: "Cards",
    icon: CreditCard,
    tagline: "Cursor spotlight, 3D gyroscope tilt, holographic glare, and peel physics.",
    featuredPills: ["spotlight-card", "holographic-flip-card", "peel-reveal-card"],
  },
  {
    name: "Navigation",
    icon: Compass,
    tagline: "Elastic macOS docks, fluid pill tabs, and magnetic breadcrumb tracks.",
    featuredPills: ["elastic-dock", "animated-tabs", "liquid-pill-tabs"],
  },
  {
    name: "Motion",
    icon: Activity,
    tagline: "Custom cursor followers, rotary springs, gravity portals, and kinetic dials.",
    featuredPills: ["cursor-follower", "rotary-spring-dial", "gravity-well-portal"],
  },
  {
    name: "Inputs",
    icon: Layers,
    tagline: "Keystroke spring pins, scrubbable numeric dials, and elastic tag pills.",
    featuredPills: ["spring-pin-input", "scrubbable-number-input", "elastic-tag-input"],
  },
  {
    name: "Text",
    icon: Type,
    tagline: "Hyperspace warp speed, quantum cipher scramble, and split-flap boards.",
    featuredPills: ["shimmer-text", "cipher-scramble-text", "split-flap-text"],
  },
  {
    name: "Backgrounds",
    icon: SunMedium,
    tagline: "Dynamic traveling grid beams, aurora flux meshes, and constellation fields.",
    featuredPills: ["moving-grid-lines", "black-hole", "ocean-waves"],
  },
  {
    name: "Overlays",
    icon: Sparkles,
    tagline: "Dynamic island toasts, kinetic sheet drawers, and morphing spring dialogs.",
    featuredPills: ["dynamic-island-toast", "kinetic-drawer-sheet", "morphing-dialog"],
  },
];

export function CategoryExplorerSection() {
  return (
    <section className="border-b border-neutral-200/80 bg-white py-16 dark:border-neutral-800 dark:bg-black sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-200/80 pb-8 dark:border-neutral-800 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
              Explore by Category
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Organized into 8 focused kinetic disciplines. Copy individual primitives or compose them seamlessly into production interfaces.
            </p>
          </div>

          <Link
            href="/components"
            className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-900 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
          >
            <span>Browse All Components</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 8-Category Grid with Spotlight Cursor Tracking */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES_DATA.map((cat) => {
            const Icon = cat.icon;

            return (
              <SpotlightCard
                key={cat.name}
                enableTilt={false}
                spotlightColor="rgba(255, 255, 255, 0.08)"
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-neutral-50/50 p-6 transition-all hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#070707] dark:hover:border-neutral-600"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/80 bg-white shadow-2xs dark:border-neutral-800 dark:bg-[#121212]">
                      <Icon className="h-4 w-4 text-neutral-950 dark:text-white" />
                    </div>
                    <span className="rounded-md border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                      v2
                    </span>
                  </div>

                  <Link
                    href={`/components?category=${encodeURIComponent(cat.name)}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-base font-semibold text-neutral-950 transition-colors hover:underline dark:text-white"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {cat.tagline}
                  </p>
                </div>

                {/* Quick component links */}
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-neutral-200/80 pt-4 dark:border-neutral-800/80">
                  {cat.featuredPills.map((slug) => (
                    <Link
                      key={slug}
                      href={`/components/${slug}`}
                      className="rounded-md border border-neutral-200/70 bg-white px-2 py-0.5 font-mono text-[10px] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-[#121212] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
                    >
                      {slug}
                    </Link>
                  ))}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
