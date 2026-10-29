"use client";

import React, { useRef, useState, useId } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import {
  Rocket,
  Zap,
  Palette,
  Globe,
  Layers,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & Accent Config                                              */
/* ------------------------------------------------------------------ */

export type AccentColor =
  | "blue"
  | "purple"
  | "pink"
  | "green"
  | "orange"
  | "red";

export interface RevealCardItem {
  id: string | number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: AccentColor;
  href?: string;
  onClick?: () => void;
  image?: string;
}

export interface RevealCardGridProps {
  /** Array of feature card items (defaults to 6 items) */
  items?: RevealCardItem[];
  /** Optional section header title */
  title?: string;
  /** Optional section subtitle */
  subtitle?: string;
  className?: string;
}

export interface RevealCardProps {
  item: RevealCardItem;
  className?: string;
}

// Complete static class strings to allow Tailwind compiler detection without dynamic truncation
export const ACCENT_STYLES: Record<
  AccentColor,
  {
    idleChipBg: string;
    idleIcon: string;
    hoverChipBg: string;
    hoverIcon: string;
    chipShadow: string;
    ring: string;
    stops: [string, string, string, string]; // [highlight, midtone, deepShadow, nearBlack]
  }
> = {
  blue: {
    idleChipBg: "bg-blue-500/10 dark:bg-blue-500/15",
    idleIcon: "text-blue-600/70 dark:text-blue-400/70",
    hoverChipBg: "bg-white text-blue-600 shadow-md shadow-blue-500/20",
    hoverIcon: "text-blue-600",
    chipShadow: "shadow-blue-500/20",
    ring: "focus-visible:ring-blue-500",
    stops: ["#38bdf8", "#2563eb", "#1e1b4b", "#020617"],
  },
  purple: {
    idleChipBg: "bg-purple-500/10 dark:bg-purple-500/15",
    idleIcon: "text-purple-600/70 dark:text-purple-400/70",
    hoverChipBg: "bg-white text-purple-600 shadow-md shadow-purple-500/20",
    hoverIcon: "text-purple-600",
    chipShadow: "shadow-purple-500/20",
    ring: "focus-visible:ring-purple-500",
    stops: ["#c084fc", "#9333ea", "#2e1065", "#090514"],
  },
  pink: {
    idleChipBg: "bg-pink-500/10 dark:bg-pink-500/15",
    idleIcon: "text-pink-600/70 dark:text-pink-400/70",
    hoverChipBg: "bg-white text-pink-600 shadow-md shadow-pink-500/20",
    hoverIcon: "text-pink-600",
    chipShadow: "shadow-pink-500/20",
    ring: "focus-visible:ring-pink-500",
    stops: ["#fb7185", "#e11d48", "#4c0519", "#0f0206"],
  },
  green: {
    idleChipBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    idleIcon: "text-emerald-600/70 dark:text-emerald-400/70",
    hoverChipBg: "bg-white text-emerald-600 shadow-md shadow-emerald-500/20",
    hoverIcon: "text-emerald-600",
    chipShadow: "shadow-emerald-500/20",
    ring: "focus-visible:ring-emerald-500",
    stops: ["#34d399", "#059669", "#064e3b", "#021a11"],
  },
  orange: {
    idleChipBg: "bg-amber-500/10 dark:bg-amber-500/15",
    idleIcon: "text-amber-600/70 dark:text-amber-400/70",
    hoverChipBg: "bg-white text-amber-600 shadow-md shadow-amber-500/20",
    hoverIcon: "text-amber-600",
    chipShadow: "shadow-amber-500/20",
    ring: "focus-visible:ring-amber-500",
    stops: ["#fbbf24", "#ea580c", "#431407", "#0c0402"],
  },
  red: {
    idleChipBg: "bg-rose-500/10 dark:bg-rose-500/15",
    idleIcon: "text-rose-600/70 dark:text-rose-400/70",
    hoverChipBg: "bg-white text-rose-600 shadow-md shadow-rose-500/20",
    hoverIcon: "text-rose-600",
    chipShadow: "shadow-rose-500/20",
    ring: "focus-visible:ring-rose-500",
    stops: ["#f87171", "#dc2626", "#450a0a", "#0a0101"],
  },
};

/* ------------------------------------------------------------------ */
/* Default 6 Items                                                    */
/* ------------------------------------------------------------------ */

export const DEFAULT_REVEAL_ITEMS: RevealCardItem[] = [
  {
    id: "instant-deploys",
    title: "Instant deploys",
    description: "Push to main and it's live worldwide before the kettle boils.",
    icon: Rocket,
    accent: "blue",
  },
  {
    id: "edge-functions",
    title: "Edge functions",
    description:
      "Run code a few milliseconds from every visitor, not an ocean away.",
    icon: Zap,
    accent: "purple",
  },
  {
    id: "design-tokens",
    title: "Design tokens",
    description:
      "One source of colour, type and spacing that every surface reads from.",
    icon: Palette,
    accent: "pink",
  },
  {
    id: "global-cdn",
    title: "Global CDN",
    description:
      "Assets cached in hundreds of cities and purged in under a second.",
    icon: Globe,
    accent: "green",
  },
  {
    id: "media-pipeline",
    title: "Media pipeline",
    description:
      "Images and video resized, compressed and served in the right format.",
    icon: Layers,
    accent: "orange",
  },
  {
    id: "preview-links",
    title: "Preview links",
    description:
      "Every branch gets its own URL, so reviews happen on the real thing.",
    icon: LinkIcon,
    accent: "red",
  },
];

/* ------------------------------------------------------------------ */
/* Subcomponent: Procedural Marbled Liquid Fluid Canvas                */
/* ------------------------------------------------------------------ */

export function MarbledFluidCanvas({
  accent,
  isHovered,
}: {
  accent: AccentColor;
  isHovered: boolean;
}) {
  const rawId = useId();
  const filterId = `marble-fluid-${accent}-${rawId.replace(/:/g, "")}`;
  const stops = ACCENT_STYLES[accent].stops;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black select-none">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="46"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <motion.g
          filter={`url(#${filterId})`}
          animate={
            isHovered
              ? {
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, 0],
                }
              : undefined
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="origin-center"
        >
          {/* Deep Near-Black Fluid Base */}
          <rect width="100%" height="100%" fill={stops[3]} />

          {/* Liquid swirls in mapped gradient stops */}
          <circle cx="20%" cy="25%" r="58%" fill={stops[1]} opacity="0.9" />
          <circle cx="85%" cy="30%" r="52%" fill={stops[0]} opacity="0.85" />
          <circle cx="70%" cy="80%" r="65%" fill={stops[2]} opacity="0.95" />
          <circle cx="25%" cy="85%" r="48%" fill={stops[1]} opacity="0.8" />
          <circle cx="50%" cy="50%" r="38%" fill={stops[0]} opacity="0.75" />
        </motion.g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponent: Reusable RevealCard                                  */
/* ------------------------------------------------------------------ */

export function RevealCard({ item, className }: RevealCardProps) {
  const cardRef = useRef<HTMLLIElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Dynamic ink circle clip-path motion values
  const originX = useMotionValue(0);
  const originY = useMotionValue(0);
  const radius = useMotionValue(0);

  // Transform into CSS clip-path circle(R at X Y)
  const clipPath = useTransform(
    [originX, originY, radius],
    ([x, y, r]) => `circle(${r}px at ${x}px ${y}px)`
  );

  const style = ACCENT_STYLES[item.accent];
  const Icon = item.icon;

  /* ------------------------------------------------------------------ */
  /* Pointer Entrance & Exit Physics Logic                              */
  /* ------------------------------------------------------------------ */

  const handlePointerEnter = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType === "touch") return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Entry point coordinates relative to the card bounds
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    originX.set(x);
    originY.set(y);

    // Compute maximum distance to the farthest corner so the circle covers 100% of the surface
    const dx = Math.max(x, rect.width - x);
    const dy = Math.max(y, rect.height - y);
    const maxRadius = Math.hypot(dx, dy);

    // Stop ongoing animation and resume from current radius without jump
    controlsRef.current?.stop();
    setIsHovered(true);

    controlsRef.current = animate(radius, maxRadius, {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType === "touch") return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Clamp exit pointer coordinates to card perimeter
    const exitX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const exitY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    // Move circle origin to the exit point so ink visibly drains toward the cursor
    originX.set(exitX);
    originY.set(exitY);

    controlsRef.current?.stop();
    setIsHovered(false);

    // Animate radius smoothly back to 0
    controlsRef.current = animate(radius, 0, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  /* ------------------------------------------------------------------ */
  /* Keyboard Accessibility (Focus / Blur from Card Center)             */
  /* ------------------------------------------------------------------ */

  const handleFocus = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    originX.set(cx);
    originY.set(cy);
    const maxRadius = Math.hypot(cx, cy);

    controlsRef.current?.stop();
    setIsHovered(true);
    controlsRef.current = animate(radius, maxRadius, {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  const handleBlur = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    originX.set(cx);
    originY.set(cy);

    controlsRef.current?.stop();
    setIsHovered(false);
    controlsRef.current = animate(radius, 0, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  /* ------------------------------------------------------------------ */
  /* Touch Screen Tap Handling                                          */
  /* ------------------------------------------------------------------ */

  const handlePointerDown = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== "touch") return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    originX.set(x);
    originY.set(y);
    const maxRadius = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y)
    );

    controlsRef.current?.stop();
    if (!isHovered) {
      setIsHovered(true);
      controlsRef.current = animate(radius, maxRadius, {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      });
    } else {
      setIsHovered(false);
      controlsRef.current = animate(radius, 0, {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      });
    }
  };

  return (
    <li
      ref={cardRef}
      tabIndex={0}
      role={item.href || item.onClick ? "button" : "article"}
      aria-label={`${item.title}: ${item.description}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={item.onClick}
      className={cn(
        "group relative flex min-h-[190px] sm:min-h-[210px] flex-col justify-between overflow-hidden rounded-[24px] border p-5 sm:p-6 transition-all duration-300 select-none",
        "bg-white dark:bg-neutral-900/60 border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        style.ring,
        item.href || item.onClick ? "cursor-pointer" : "cursor-default",
        className
      )}
    >
      {/* Absolutely positioned marbled fluid artwork layer masked by circular clip-path */}
      <motion.div
        aria-hidden="true"
        style={{
          clipPath: shouldReduceMotion ? undefined : clipPath,
          opacity: shouldReduceMotion ? (isHovered ? 1 : 0) : 1,
        }}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[24px] transition-opacity duration-300"
      >
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <MarbledFluidCanvas accent={item.accent} isHovered={isHovered} />
        )}

        {/* Bottom dark gradient overlay ensuring 100% white text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      </motion.div>

      {/* Top-left: Circular Icon Chip */}
      <div className="relative z-10 flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
            isHovered ? style.hoverChipBg : cn(style.idleChipBg, style.idleIcon)
          )}
        >
          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
        </div>
      </div>

      {/* Bottom-left: Title and Description */}
      <div className="relative z-10 mt-6 flex flex-col justify-end">
        <h3
          className={cn(
            "text-base font-semibold tracking-tight transition-colors duration-300",
            isHovered
              ? "text-white"
              : "text-neutral-600 dark:text-neutral-300"
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "mt-1.5 text-xs sm:text-sm leading-relaxed transition-colors duration-300",
            isHovered
              ? "text-white/80"
              : "text-neutral-400 dark:text-neutral-500"
          )}
        >
          {item.description}
        </p>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component: RevealCardGrid                                     */
/* ------------------------------------------------------------------ */

export function RevealCardGrid({
  items = DEFAULT_REVEAL_ITEMS,
  title,
  subtitle,
  className,
}: RevealCardGridProps) {
  return (
    <section
      aria-label={title ?? "Features"}
      className={cn(
        "relative w-full max-w-6xl mx-auto px-4 py-8 sm:py-12",
        className
      )}
    >
      {/* Optional Section Header */}
      {(title || subtitle) && (
        <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Semantic Grid Container: 1 col mobile, 2 col tablet, 3 col desktop */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 list-none p-0 m-0">
        {items.map((item) => (
          <RevealCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default RevealCardGrid;
