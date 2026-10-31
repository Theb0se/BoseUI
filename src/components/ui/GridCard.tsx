"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlickeringGrid } from "./FlickeringGrid";

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                 */
/* ------------------------------------------------------------------ */

export interface GridCardProps {
  /** Icon element rendered in the soft-bordered top container */
  icon: React.ReactNode;
  /** Main feature title */
  title: string;
  /** Explanatory description */
  description: string;
  /** Optional target destination URL making the entire card an accessible link */
  href?: string;
  /** Grid square color. Default: "currentColor" (adapts to light/dark mode) */
  gridColor?: string;
  /** Size of each square cell in the flickering grid. Default: 3 */
  squareSize?: number;
  /** Gap between adjacent grid cells. Default: 5 */
  gridGap?: number;
  /** Flickering rate when card is at rest. Default: 0.1 */
  restFlickerChance?: number;
  /** Flickering rate when card is hovered. Default: 0.6 */
  hoverFlickerChance?: number;
  /** Max opacity ceiling when card is at rest. Default: 0.15 */
  restMaxOpacity?: number;
  /** Max opacity ceiling when card is hovered. Default: 0.4 */
  hoverMaxOpacity?: number;
  /** Additional Tailwind CSS classes */
  className?: string;
}

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

export interface FeatureSectionProps {
  /** Main section headline */
  title?: string;
  /** Subtitle or eyebrow paragraph */
  subtitle?: string;
  /** Array of feature items mapped to GridCards */
  features: FeatureItem[];
  /** Optional custom grid gap and styling */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const cardVariants = {
  rest: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  hover: {
    y: -4,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const iconContainerVariants = {
  rest: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  hover: {
    scale: 1.1,
    rotate: -4,
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 18,
    },
  },
};

const arrowVariants = {
  rest: {
    x: 0,
    opacity: 0.5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  hover: {
    x: 4,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 20,
    },
  },
};

/* ------------------------------------------------------------------ */
/* GridCard Component                                                 */
/* ------------------------------------------------------------------ */

export function GridCard({
  icon,
  title,
  description,
  href,
  gridColor = "currentColor",
  squareSize = 3,
  gridGap = 5,
  restFlickerChance = 0.1,
  hoverFlickerChance = 0.6,
  restMaxOpacity = 0.15,
  hoverMaxOpacity = 0.4,
  className,
}: GridCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Diagonal corner gradient mask: opaque at top-right, transparent toward bottom-left
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(to bottom left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0) 75%)",
    maskImage:
      "linear-gradient(to bottom left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0) 75%)",
  };

  const cardContent = (
    <>
      {/* ── Top-Right Diagonal Flickering Grid Accent ── */}
      <div
        style={maskStyle}
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 -right-2 h-[60%] w-[60%] z-0 select-none overflow-hidden"
      >
        <FlickeringGrid
          squareSize={squareSize}
          gridGap={gridGap}
          flickerChance={isHovered ? hoverFlickerChance : restFlickerChance}
          maxOpacity={isHovered ? hoverMaxOpacity : restMaxOpacity}
          color={gridColor}
          className="h-full w-full opacity-80 transition-opacity duration-300 dark:opacity-70"
        />
      </div>

      {/* ── Card Content Container ── */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {/* Top Row: Icon Container + Optional Arrow Affordance */}
          <div className="flex items-center justify-between">
            <motion.div
              variants={shouldReduceMotion ? undefined : iconContainerVariants}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200/90 bg-neutral-50/90 text-neutral-800 shadow-2xs backdrop-blur-sm transition-colors group-hover:border-neutral-300 group-hover:bg-neutral-100/90 dark:border-neutral-800/90 dark:bg-neutral-900/90 dark:text-neutral-200 dark:group-hover:border-neutral-700"
            >
              {icon}
            </motion.div>

            {href && (
              <motion.div
                variants={shouldReduceMotion ? undefined : arrowVariants}
                className="text-neutral-400 group-hover:text-neutral-900 dark:text-neutral-500 dark:group-hover:text-neutral-100"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            )}
          </div>

          {/* Heading */}
          <h3 className="mt-4 text-base font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-lg">
            {title}
          </h3>

          {/* Muted Descriptive Text */}
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>
    </>
  );

  const sharedClassName = cn(
    "group relative flex flex-col justify-between overflow-hidden rounded-xl border p-6 text-left transition-all duration-300",
    "border-neutral-200/90 bg-white text-neutral-900 shadow-2xs hover:border-neutral-300 hover:shadow-md",
    "dark:border-neutral-800/90 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-700 dark:hover:shadow-neutral-900/40",
    href &&
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black",
    className
  );

  // If href is set, render as an accessible interactive link
  if (href) {
    return (
      <motion.div
        variants={shouldReduceMotion ? undefined : cardVariants}
        initial="rest"
        whileHover={shouldReduceMotion ? undefined : "hover"}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Link href={href} className={cn("block h-full", sharedClassName)}>
          {cardContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : cardVariants}
      initial="rest"
      whileHover={shouldReduceMotion ? undefined : "hover"}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={sharedClassName}
    >
      {cardContent}
    </motion.div>
  );
}

// Convenient alias
export const FeatureCard = GridCard;

/* ------------------------------------------------------------------ */
/* FeatureSection Component                                           */
/* ------------------------------------------------------------------ */

const sectionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function FeatureSection({
  title = "Engineered for Modern Systems",
  subtitle = "High-performance primitives with tactile spring physics, zero layout shifts, and comprehensive accessibility built in.",
  features,
  className,
}: FeatureSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("w-full py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || subtitle) && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center sm:mb-16"
          >
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-3xl md:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Responsive Features Grid: 1 col mobile, 2 col md, 3 col lg */}
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="h-full"
            >
              <GridCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                href={feature.href}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default GridCard;
