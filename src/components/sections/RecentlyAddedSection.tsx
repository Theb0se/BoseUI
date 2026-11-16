"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Rocket, Sparkles, Plus, Check } from "lucide-react";
import { CATALOG_INDEX } from "@/registry/catalog-index";
import type { CatalogIndexEntry } from "@/types/component";
import { cn, copyToClipboard, SITE_CONFIG } from "@/lib/utils";

// Real component imports for live preview
import { AgentStatusBadge } from "@/components/ui/AgentStatusBadge";
import { PermissionSwitch } from "@/components/ui/PermissionSwitch";
import { MinimalAuthCard } from "@/components/ui/MinimalAuthCard";
import { RevealCard } from "@/components/ui/RevealCardGrid";
import { WeatherCard } from "@/components/ui/WeatherCard";
import { GlyphTrail } from "@/components/ui/GlyphTrail";
import { ExpandableCards } from "@/components/ui/ExpandableCards";
import { DotTextCanvas } from "@/components/ui/DotTextHero";
import { CylinderCarousel } from "@/components/ui/CylinderCarousel";
import { AnimatedThemeToggler } from "@/components/ui/AnimatedThemeToggler";
import { CTABanner } from "@/components/ui/CTABanner";
import { FlickeringGrid } from "@/components/ui/FlickeringGrid";
import { GridCard } from "@/components/ui/GridCard";
import { TextMaskGrid } from "@/components/ui/TextMaskGrid";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SpringPinInput } from "@/components/ui/SpringPinInput";
import { HoldToConfirmButton } from "@/components/ui/HoldToConfirmButton";
import { ElasticSwipeSlider } from "@/components/ui/ElasticSwipeSlider";
import { KineticRollingCounter } from "@/components/ui/KineticRollingCounter";
import { HeartBurstButton } from "@/components/ui/HeartBurstButton";
import { DynamicIslandToast } from "@/components/ui/DynamicIslandToast";
import { COMPONENT_DEMOS } from "@/registry/generated-demos";

interface PreviewProps {
  slug: string;
  active: boolean;
  reducedMotion: boolean;
}

function LivePreview({ slug, active, reducedMotion }: PreviewProps) {
  // If reduced motion is preferred, fallback to static presentation
  const isAnimated = active && !reducedMotion;

  switch (slug) {
    case "agent-status-badge":
      return (
        <div className="flex flex-col items-center justify-center">
          <AgentStatusBadge
            status={isAnimated ? "analyzing" : "reading-docs"}
            interactive={false}
            size="md"
          />
        </div>
      );

    case "permission-switch":
      return (
        <div className="flex items-center justify-center">
          <PermissionSwitch
            value={isAnimated ? "ask" : "allow"}
            className="scale-90"
          />
        </div>
      );

    case "animated-theme-toggler":
      return (
        <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
          <AnimatedThemeToggler variant="liquid-blob" glow size="lg" />
          <span className="text-[10px] font-mono text-neutral-400">
            Liquid View Transition reveal
          </span>
        </div>
      );

    case "magnetic-button":
      return (
        <div className="flex items-center justify-center pointer-events-none">
          <MagneticButton
            strength={isAnimated ? 0.4 : 0.2}
            className="px-5 py-2.5 text-xs font-medium"
          >
            Hover Magnetic
          </MagneticButton>
        </div>
      );

    case "spring-pin-input":
      return (
        <div className="flex items-center justify-center scale-90 pointer-events-none">
          <SpringPinInput length={4} defaultValue="4096" />
        </div>
      );

    case "hold-to-confirm-button":
      return (
        <div className="flex items-center justify-center pointer-events-none">
          <HoldToConfirmButton
            label="Hold to Deploy"
            confirmedLabel="Deployed!"
            className="scale-90"
          />
        </div>
      );

    case "elastic-swipe-slider":
      return (
        <div className="flex items-center justify-center scale-90 pointer-events-none">
          <ElasticSwipeSlider
            key={String(isAnimated)}
            width={240}
            label={isAnimated ? "Slide to Confirm" : "Swipe to Unlock"}
            confirmedLabel="Confirmed"
          />
        </div>
      );

    case "kinetic-rolling-counter":
      return (
        <div className="flex items-center justify-center scale-90 pointer-events-none">
          <KineticRollingCounter
            defaultValue={isAnimated ? 2048 : 1024}
            step={256}
          />
        </div>
      );

    case "dynamic-island-toast":
      return (
        <div className="flex items-center justify-center pointer-events-none scale-90">
          <DynamicIslandToast
            key={String(isAnimated)}
            defaultMode={isAnimated ? "telemetry" : "compact"}
            title="Copied to clipboard"
            subtitle="npx shadcn@latest add boseui"
          />
        </div>
      );

    case "heart-burst-button":
      return (
        <div className="flex items-center justify-center pointer-events-none scale-105">
          <HeartBurstButton
            key={String(isAnimated)}
            size="md"
            theme="instagram"
            initialLiked={isAnimated}
            initialCount={isAnimated ? 143 : 142}
          />
        </div>
      );

    case "minimal-auth-card":
      return (
        <div className="w-[360px] scale-[0.50] origin-center -my-14 select-none pointer-events-none">
          <MinimalAuthCard
            brandName="BoseUI"
            defaultMode={isAnimated ? "signup" : "signin"}
            tagline="Spring animated auth"
          />
        </div>
      );

    case "reveal-card-grid":
      return (
        <div className="w-full max-w-[250px] pointer-events-none">
          <RevealCard
            item={{
              id: "edge",
              title: "Edge Compute",
              description: "Zero cold-start compute functions deployed globally.",
              icon: Rocket,
              accent: "blue",
            }}
            className={cn(
              "transition-transform duration-200",
              isAnimated && "scale-[1.02]"
            )}
          />
        </div>
      );

    case "grid-card":
      return (
        <div className="w-full px-3 pointer-events-none scale-90 origin-center">
          <GridCard
            icon={<Sparkles className="h-5 w-5 text-blue-500" />}
            title="Adaptive Edge Compute"
            description="Sub-millisecond compute with dynamic flickering grid and spring hover."
          />
        </div>
      );

    case "weather-card":
      return (
        <div className="w-[420px] scale-[0.45] origin-center -my-20 select-none pointer-events-none">
          <WeatherCard location="San Francisco" />
        </div>
      );

    case "glyph-trail":
      return (
        <div className="scale-90 origin-center text-center select-none pointer-events-none">
          <GlyphTrail
            lines={["SPRING MOTION", "FLUID PHYSICS"]}
            className="text-xs"
          />
        </div>
      );

    case "expandable-cards":
      return (
        <div className="w-full max-w-[270px] pointer-events-none">
          <ExpandableCards
            stories={[
              { id: 1, name: "Spring", tagline: "Fluid dynamics" },
              { id: 2, name: "Layout", tagline: "Projection" },
            ]}
            defaultActiveId={isAnimated ? 2 : 1}
            className="p-0 border-0 bg-transparent"
          />
        </div>
      );

    case "dot-text-hero":
      return (
        <div className="h-32 w-full flex items-center justify-center overflow-hidden pointer-events-none">
          <DotTextCanvas
            lines={["BOSE"]}
            dotSize={7}
            repelRadius={isAnimated ? 60 : 0}
            className="h-full w-full"
          />
        </div>
      );

    case "cylinder-carousel":
      return (
        <div className="h-36 w-full flex items-center justify-center overflow-hidden pointer-events-none">
          <CylinderCarousel
            cardWidth={80}
            cardHeight={100}
            showControls={false}
            showDots={false}
            gap={24}
            perspective={700}
            initialIndex={isAnimated ? 1 : 0}
            cards={[
              { id: 1, title: "Spring", bg: "#1f2937" },
              { id: 2, title: "Motion", bg: "#111827" },
              { id: 3, title: "Tailwind", bg: "#374151" },
            ]}
          />
        </div>
      );

    case "flickering-grid":
      return (
        <div className="relative h-full w-full overflow-hidden pointer-events-none">
          <FlickeringGrid
            squareSize={4}
            gridGap={6}
            flickerChance={0.3}
            maxOpacity={0.4}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );

    case "text-mask-grid":
      return (
        <div className="h-full w-full flex items-center justify-center overflow-hidden pointer-events-none">
          <TextMaskGrid
            text="BOSE"
            fontWeight={900}
            squareSize={4}
            gridGap={5}
            flickerChance={0.4}
            maxOpacity={0.6}
            className="w-full"
          />
        </div>
      );

    case "cta-banner":
      return (
        <div className="w-full scale-[0.32] origin-center -my-12 pointer-events-none select-none">
          <CTABanner
            heading="Ship beautiful interfaces faster"
            subheading="Join 12,000+ engineers building with BoseUI every week."
            placeholder="you@company.com"
            buttonLabel="Join the waitlist"
            accentColor="#6366f1"
          />
        </div>
      );

    default: {
      const Fallback = COMPONENT_DEMOS[slug];
      if (Fallback) {
        return (
          <div className="pointer-events-none w-full flex items-center justify-center">
            <Fallback />
          </div>
        );
      }
      return (
        <div className="text-xs text-neutral-400 font-mono">
          {slug}
        </div>
      );
    }
  }
}

interface ComponentCardProps {
  component: CatalogIndexEntry;
  reducedMotion: boolean;
}

function ComponentCard({ component, reducedMotion }: ComponentCardProps) {
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy-mount via IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopyAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cli = `npx shadcn@latest add ${SITE_CONFIG.url}/r/${component.slug}.json`;
    const ok = await copyToClipboard(cli);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const active = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="group relative flex flex-col rounded-lg border border-neutral-200 bg-white transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
    >
      <Link
        href={`/components/${component.slug}`}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
        aria-label={`View ${component.title} component`}
      />

      {/* Top: LIVE component preview stage */}
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-neutral-200 bg-neutral-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/30">
        {inView ? (
          <LivePreview
            slug={component.slug}
            active={active}
            reducedMotion={reducedMotion}
          />
        ) : (
          <div className="h-6 w-24 rounded bg-neutral-200/50 dark:bg-neutral-800/50 animate-pulse" />
        )}
      </div>

      {/* Bottom: Meta info & Add button */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white">
              {component.title}
            </h3>
            <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-400">
              Featured
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {component.description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
          <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            {component.category}
          </span>
          <button
            type="button"
            onClick={handleCopyAdd}
            className="z-20 inline-flex items-center gap-1 rounded border border-neutral-200 bg-neutral-100/90 px-2 py-0.5 text-[11px] font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-neutral-200 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
            title={`Copy shadcn add command for ${component.title}`}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Curated list of minimal featured components (clean, simple UI primitives without cards)
const FEATURED_MINIMAL_SLUGS = [
  "agent-status-badge",
  "permission-switch",
  "animated-theme-toggler",
  "magnetic-button",
  "spring-pin-input",
  "hold-to-confirm-button",
  "elastic-swipe-slider",
  "kinetic-rolling-counter",
  "dynamic-island-toast",
];

export function FeaturedComponentsSection() {
  const shouldReduceMotion = useReducedMotion();
  const reducedMotion = Boolean(shouldReduceMotion);

  // Read curated minimal featured components from registry
  const featuredComponents = React.useMemo(() => {
    const map = new Map(CATALOG_INDEX.map((c) => [c.slug, c]));
    return FEATURED_MINIMAL_SLUGS.map((slug) => map.get(slug)).filter(
      Boolean
    ) as CatalogIndexEntry[];
  }, []);

  return (
    <section>
      {/* Title & View all link */}
      <div className="flex items-baseline justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
            Featured components
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Minimal interactive primitives with spring animations.
          </p>
        </div>
        <Link
          href="/components"
          className="group inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:underline dark:text-blue-400"
        >
          <span>View all components</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 3 columns desktop, 2 on tablet, 1 on mobile */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredComponents.map((component) => (
          <ComponentCard
            key={component.slug}
            component={component}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}

// Backwards-compatible alias
export { FeaturedComponentsSection as RecentlyAddedSection };
