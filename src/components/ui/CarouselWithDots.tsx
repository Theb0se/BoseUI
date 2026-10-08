"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Cpu, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  stat: string;
}

export interface CarouselWithDotsProps {
  /** Array of slide items */
  slides?: CarouselSlide[];
  /** Initial active slide index. Default: 0 */
  defaultIndex?: number;
  /** Enable automatic slide rotation. Default: false */
  autoPlay?: boolean;
  /** Auto-play interval in milliseconds. Default: 4500 */
  interval?: number;
  /** Callback fired when the active slide changes */
  onSlideChange?: (index: number) => void;
  className?: string;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: "display",
    eyebrow: "ProMotion 120Hz",
    title: "Adaptive refresh rates that match your gesture velocity.",
    description:
      "Every swipe and drag calculates release velocity to settle naturally without abrupt stops.",
    stat: "120 FPS",
  },
  {
    id: "acoustics",
    eyebrow: "Spatial Audio Engine",
    title: "Studio-grade acoustic isolation in a minimal enclosure.",
    description:
      "Precision-milled internals reduce harmonic distortion across the entire frequency spectrum.",
    stat: "48 kHz",
  },
  {
    id: "battery",
    eyebrow: "All-Day Efficiency",
    title: "Up to 22 hours of continuous workflow on a single charge.",
    description:
      "Fast-charge architecture restores 50% capacity in just 25 minutes over USB-C.",
    stat: "22 HRS",
  },
  {
    id: "security",
    eyebrow: "Hardware Enclave",
    title: "End-to-end encryption verified at silicon startup.",
    description:
      "Dedicated cryptographic keys remain isolated from the main application processor.",
    stat: "256-BIT",
  },
];

export function CarouselWithDots({
  slides = DEFAULT_SLIDES,
  defaultIndex = 0,
  autoPlay = false,
  interval = 4500,
  onSlideChange,
  className,
}: CarouselWithDotsProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      const next = (index + total) % total;
      setCurrentIndex(next);
      onSlideChange?.(next);
    },
    [total, onSlideChange]
  );

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const timer = setInterval(() => {
      goTo(currentIndex + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, currentIndex, total, goTo]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -300) {
      goTo(currentIndex + 1);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 300) {
      goTo(currentIndex - 1);
    }
  };

  const icons = [
    <Sparkles key="0" className="h-4 w-4" />,
    <Zap key="1" className="h-4 w-4" />,
    <Cpu key="2" className="h-4 w-4" />,
    <Shield key="3" className="h-4 w-4" />,
  ];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Feature highlights carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goTo(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goTo(currentIndex + 1);
        }
      }}
      tabIndex={0}
      className={cn(
        "w-full max-w-lg select-none focus-visible:outline-none",
        className
      )}
    >
      {/* Viewport Track */}
      <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A]">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 32 }
          }
          className="flex cursor-grab active:cursor-grabbing"
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${total}`}
              className="w-full shrink-0 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-mono text-[11px] font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                  {icons[idx % icons.length]}
                  {slide.eyebrow}
                </span>
                <span className="font-mono text-xs font-bold tracking-tight text-neutral-400 dark:text-neutral-500">
                  {slide.stat}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
                {slide.title}
              </h3>

              <p className="mt-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
                {slide.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Controls: Pill-Shaped Page Indicator + Circular Arrow Controls */}
      <div className="mt-4 flex items-center justify-between px-1">
        {/* Pill-Shaped Page Indicator */}
        <div
          role="tablist"
          aria-label="Slide indicators"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100/90 px-3.5 py-2 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}: ${slide.eyebrow}`}
                onClick={() => goTo(idx)}
                className="relative flex h-2 items-center justify-center focus-visible:outline-none"
              >
                <motion.span
                  animate={{
                    width: isActive ? 22 : 6,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="h-1.5 rounded-full bg-neutral-900 dark:bg-white"
                />
              </button>
            );
          })}
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(currentIndex - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-2xs transition-all hover:border-neutral-900 hover:text-neutral-950 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(currentIndex + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-2xs transition-all hover:border-neutral-900 hover:text-neutral-950 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarouselWithDots;
