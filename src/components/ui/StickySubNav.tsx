"use client";

import React, { useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ArrowDown, Monitor, Cpu, Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SubNavLink {
  id: string;
  label: string;
}

export interface StickySubNavProps {
  /** Product title shown on the left of the sub-nav */
  productTitle?: string;
  /** Price or subtitle shown next to the CTA */
  priceLabel?: string;
  /** Label for the right-hand primary action button */
  ctaLabel?: string;
  /** Navigation links inside the bar */
  links?: SubNavLink[];
  /** Callback fired when the Buy / CTA button is clicked */
  onBuy?: () => void;
  className?: string;
}

const DEFAULT_LINKS: SubNavLink[] = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Tech Specs" },
  { id: "compare", label: "Compare" },
];

export function StickySubNav({
  productTitle = "Studio Display Pro",
  priceLabel = "$1,599",
  ctaLabel = "Buy",
  links = DEFAULT_LINKS,
  onBuy,
  className,
}: StickySubNavProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isStuck, setIsStuck] = useState(false);
  const [activeTab, setActiveTab] = useState(links[0]?.id ?? "overview");
  const [purchased, setPurchased] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsStuck(scrollTop > 110);
  };

  const handleBuyClick = () => {
    setPurchased(true);
    onBuy?.();
    setTimeout(() => setPurchased(false), 1800);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Floating / Sticky Product Sub-Nav that reveals once Hero scrolls out */}
      <AnimatePresence>
        {isStuck && (
          <motion.header
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -48 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -48 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute inset-x-0 top-0 z-30 flex h-12 items-center justify-between border-b border-neutral-200/80 bg-white/85 px-5 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-[#0A0A0A]/85"
          >
            {/* Left: Product Title */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-neutral-950 dark:text-white">
                {productTitle}
              </span>
            </div>

            {/* Center: Section Links */}
            <nav className="hidden items-center gap-5 sm:flex">
              {links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "text-xs transition-colors",
                    activeTab === link.id
                      ? "font-semibold text-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right: Price + Buy Pill */}
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:inline">
                {priceLabel}
              </span>
              <button
                type="button"
                onClick={handleBuyClick}
                className="inline-flex h-7 items-center gap-1 rounded-full bg-neutral-900 px-3.5 text-xs font-semibold text-white transition-transform active:scale-95 dark:bg-white dark:text-black"
              >
                {purchased ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Added</span>
                  </>
                ) : (
                  <span>{ctaLabel}</span>
                )}
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Scrollable Demo Viewport */}
      <div
        ref={scrollRef}
        data-fullscreen-scroll
        onScroll={handleScroll}
        className="max-h-[320px] overflow-y-auto"
      >
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center border-b border-neutral-100 bg-neutral-50/60 px-6 py-12 text-center dark:border-neutral-900 dark:bg-[#111111]">
          <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
            5K Retina XDR Display
          </span>
          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
            {productTitle}
          </h2>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            From {priceLabel} · Scroll down to reveal the sticky product sub-nav
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            <span>Scroll down</span>
          </div>
        </div>

        {/* Product Details Content (tall enough to scroll in both compact and full-screen viewports) */}
        <div className="grid grid-cols-1 gap-4 p-6 pb-32 sm:grid-cols-2">
          {[
            {
              icon: <Monitor className="h-4 w-4" />,
              title: "True-to-Life 1600 Nits Peak HDR",
              body: "Anti-reflective nano-texture glass scatters ambient light to minimize glare in bright studio environments.",
            },
            {
              icon: <Cpu className="h-4 w-4" />,
              title: "Thunderbolt 4 Single-Cable Hub",
              body: "Delivers 96W host charging plus three downstream USB-C ports for high-speed studio peripherals.",
            },
            {
              icon: <Sparkles className="h-4 w-4" />,
              title: "12MP Ultra Wide Camera with Center Stage",
              body: "Machine-learning camera framing keeps you centered automatically as you move around your workspace.",
            },
            {
              icon: <Layers className="h-4 w-4" />,
              title: "Machined Aluminum Tilt & Height Stand",
              body: "Counterbalanced arm lets you adjust angle and elevation with effortless one-finger precision.",
            },
            {
              icon: <Monitor className="h-4 w-4" />,
              title: "Reference Modes for Color Grading",
              body: "Factory-calibrated P3 wide color gamut with 10-bit depth for broadcast video and print workflows.",
            },
            {
              icon: <Cpu className="h-4 w-4" />,
              title: "Six-Speaker Spatial Audio Array",
              body: "Four force-cancelling woofers produce rich, distortion-free bass and crystal-clear dialogue.",
            },
          ].map((block) => (
            <div
              key={block.title}
              className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-5 dark:border-neutral-800/80 dark:bg-neutral-900/40"
            >
              <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                {block.icon}
              </div>
              <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">
                {block.title}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickySubNav;
