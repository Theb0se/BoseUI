"use client";

import React, { useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Layers, Shield, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StorySection {
  id: string;
  badge: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
}

export interface StickyScrollStoryProps {
  /** Array of storytelling chapters */
  sections?: StorySection[];
  /** Optional header title above the storytelling container */
  heading?: string;
  className?: string;
}

const DEFAULT_SECTIONS: StorySection[] = [
  {
    id: "design",
    badge: "01 · Design System",
    title: "Machined from a single block of tokens.",
    description:
      "Every border, surface, and shadow shares a unified monochrome scale that adapts seamlessly between daylight and OLED dark mode.",
    metricLabel: "Contrast Ratio",
    metricValue: "18.4 : 1 AAA",
  },
  {
    id: "motion",
    badge: "02 · Spring Physics",
    title: "Interruptible motion that respects momentum.",
    description:
      "Unlike fixed-duration CSS curves, spring animations preserve velocity when redirected mid-flight for natural tactile feedback.",
    metricLabel: "Response Latency",
    metricValue: "< 1.2 ms",
  },
  {
    id: "shipping",
    badge: "03 · Zero Lock-In",
    title: "Own every line of code in your repository.",
    description:
      "Install via CLI or copy the TypeScript file directly. No black-box npm wrapper, no CSS conflicts, and full control over markup.",
    metricLabel: "Runtime Overhead",
    metricValue: "0 KB External",
  },
];

export function StickyScrollStory({
  sections = DEFAULT_SECTIONS,
  heading = "Scroll inside the container or click any chapter",
  className,
}: StickyScrollStoryProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    const progress = el.scrollTop / maxScroll;
    const idx = Math.min(
      sections.length - 1,
      Math.max(0, Math.round(progress * (sections.length - 1)))
    );
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  };

  const scrollToChapter = (index: number) => {
    setActiveIndex(index);
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const targetTop =
      sections.length > 1 ? (index / (sections.length - 1)) * maxScroll : 0;
    el.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const activeSection = sections[activeIndex] ?? sections[0];

  const icons = [
    <Layers key="layers" className="h-5 w-5" />,
    <Zap key="zap" className="h-5 w-5" />,
    <Shield key="shield" className="h-5 w-5" />,
    <Sparkles key="sparkles" className="h-5 w-5" />,
  ];

  return (
    <div
      className={cn(
        "w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/70 px-5 py-2.5 dark:border-neutral-800 dark:bg-neutral-900/50">
        <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
          {heading}
        </span>
        <div className="flex items-center gap-1.5">
          {sections.map((sec, idx) => (
            <button
              key={sec.id}
              type="button"
              aria-label={`Jump to chapter ${idx + 1}`}
              onClick={() => scrollToChapter(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === activeIndex
                  ? "w-5 bg-neutral-900 dark:bg-white"
                  : "w-1.5 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700"
              )}
            />
          ))}
        </div>
      </div>

      {/* Split Scrollable Text + Sticky Synced Media */}
      <div
        ref={scrollContainerRef}
        data-fullscreen-scroll
        onScroll={handleScroll}
        className="grid max-h-[340px] grid-cols-1 gap-6 overflow-y-auto p-6 sm:grid-cols-12"
      >
        {/* Left Scrolling Chapters */}
        <div className="space-y-24 py-6 pb-28 sm:col-span-7">
          {sections.map((section, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={section.id}
                onClick={() => scrollToChapter(idx)}
                className={cn(
                  "cursor-pointer rounded-2xl p-4 transition-all duration-300",
                  isActive
                    ? "bg-neutral-100/80 opacity-100 dark:bg-neutral-900/80"
                    : "opacity-40 hover:opacity-70"
                )}
              >
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {section.badge}
                </span>
                <h3 className="mt-1.5 text-base font-bold tracking-tight text-neutral-950 dark:text-white sm:text-lg">
                  {section.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {section.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Sticky Media Stage */}
        <div className="sm:col-span-5">
          <div className="sticky top-2 flex h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-[#111111]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection.id}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 14, scale: 0.96 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -14, scale: 0.96 }
                }
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className="flex h-full flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black">
                    {icons[activeIndex % icons.length]}
                  </div>
                  <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                    Step {activeIndex + 1}/{sections.length}
                  </span>
                </div>

                {/* Center Visual Graphic */}
                <div className="my-auto rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs dark:border-neutral-800 dark:bg-[#0A0A0A]">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    {activeSection.metricLabel}
                  </div>
                  <div className="mt-1 font-mono text-lg font-bold tracking-tight text-neutral-950 dark:text-white">
                    {activeSection.metricValue}
                  </div>
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                    <motion.div
                      initial={{ width: "20%" }}
                      animate={{
                        width: `${((activeIndex + 1) / sections.length) * 100}%`,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="h-full rounded-full bg-neutral-900 dark:bg-white"
                    />
                  </div>
                </div>

                <div className="font-mono text-[10px] text-neutral-400">
                  Synced Sticky Stage
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StickyScrollStory;
