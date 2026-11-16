"use client";

import React, { useState } from "react";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import { FlickeringGrid } from "@/components/ui/FlickeringGrid";
import { RotateCcw } from "lucide-react";

export function AnnouncementBannerDemo() {
  const [demoKey, setDemoKey] = useState(0);

  const resetBanners = () => {
    try {
      localStorage.removeItem("demo-static-announcement-lens");
      localStorage.removeItem("demo-rotating-announcement-v2");
      localStorage.removeItem("demo-sponsor-announcement-vercel");
    } catch {
      // ignore
    }
    setDemoKey((k) => k + 1);
  };

  return (
    <div key={demoKey} className="flex w-full flex-col gap-10 p-4 sm:p-8">
      {/* Control Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
            Announcement Banner Showcase
          </h3>
          <p className="text-xs text-neutral-500">
            Interactive demonstration of static, rotating, and dogfooded accent variants.
          </p>
        </div>
        <button
          type="button"
          onClick={resetBanners}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Dismissed States</span>
        </button>
      </div>

      {/* ── Example 1: Single Static Message ── */}
      <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Example 1 • Single Static Message (Default Variant)
          </span>
          <span className="rounded-full bg-neutral-200/60 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            Static • Dismissible
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <AnnouncementBanner
            variant="default"
            storageKey="demo-static-announcement"
            messages={[
              {
                id: "lens",
                badge: "New",
                text: "Text Hover Lens follows your cursor with spring physics.",
                href: "/components/text-hover-lens",
                linkLabel: "Try it",
              },
            ]}
          />
        </div>
      </section>

      {/* ── Example 2: Rotating Banner (3 Messages) ── */}
      <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Example 2 • Rotating Messages (Inverted Variant • 3500ms Interval)
          </span>
          <span className="rounded-full bg-neutral-200/60 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            Auto-Rotate • Pauses on Hover
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <AnnouncementBanner
            variant="inverted"
            rotateInterval={3500}
            storageKey="demo-rotating-announcement"
            messages={[
              {
                id: "v2",
                badge: "Release",
                text: "BoseUI v2.1 introduces 105 kinetic primitives for React 18 & Next.js 14.",
                href: "/components",
                linkLabel: "Browse catalog",
              },
              {
                id: "cli",
                badge: "CLI",
                text: "Install components directly into your codebase with npx shadcn add.",
                href: "/docs",
                linkLabel: "Read docs",
              },
              {
                id: "springs",
                badge: "Physics",
                text: "Every micro-interaction is grounded with Hooke's Law spring mechanics.",
                href: "/components",
                linkLabel: "Explore lab",
              },
            ]}
          />
        </div>
      </section>

      {/* ── Example 3: Accent Variant with Sponsor Offer & Dogfooded FlickeringGrid ── */}
      <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Example 3 • Accent Variant with Sponsor Offer & Dogfooded Grid
          </span>
          <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium text-teal-600 dark:text-teal-400">
            Teal Accent • Background Texture
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-teal-200/80 bg-white dark:border-teal-900/60 dark:bg-neutral-900">
          <AnnouncementBanner
            variant="accent"
            storageKey="demo-sponsor-announcement"
            background={
              <FlickeringGrid
                squareSize={3}
                gridGap={4}
                flickerChance={0.2}
                maxOpacity={0.08}
                color="rgb(13, 148, 136)"
                className="h-full w-full"
              />
            }
            messages={[
              {
                id: "vercel",
                badge: "Sponsor",
                text: "Vercel powers BoseUI edge delivery and analytics. Deploy your Next.js app in seconds.",
                href: "https://vercel.com",
                linkLabel: "Get started",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

export default AnnouncementBannerDemo;
