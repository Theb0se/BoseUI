"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Layers, ArrowUpRight, Sparkles, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StackCardItem {
  id: string;
  badge: string;
  title: string;
  metric: string;
  subtitle: string;
}

export interface AccordionStackCardsProps {
  /** Array of stack card items. Defaults to a 3-card telemetry deck. */
  items?: StackCardItem[];
  /** Spring stiffness coefficient for deck expansion and rotation. Default: 300 */
  stiffness?: number;
  /** Spring damping coefficient for deck expansion and rotation. Default: 25 */
  damping?: number;
  className?: string;
}

const DEFAULT_CARDS: StackCardItem[] = [
  {
    id: "spring-core",
    badge: "01 // PHYSICS ENGINE",
    title: "Hooke's Law Solver",
    metric: "120 Hz",
    subtitle: "Continuous velocity-preserving spring interpolation",
  },
  {
    id: "gpu-compositor",
    badge: "02 // COMPOSITOR",
    title: "Zero React Re-Renders",
    metric: "0.0 ms",
    subtitle: "Direct MotionValue & CSS mask-image projection",
  },
  {
    id: "shadcn-cli",
    badge: "03 // DISTRIBUTION",
    title: "Shadcn Registry v2",
    metric: "1-Click",
    subtitle: "Copy-paste source ownership with strict TypeScript",
  },
];

export function AccordionStackCards({
  items = DEFAULT_CARDS,
  stiffness = 300,
  damping = 25,
  className,
}: AccordionStackCardsProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [deck, setDeck] = useState<StackCardItem[]>(items);
  const [isExpanded, setIsExpanded] = useState(false);

  const cycleFrontCard = () => {
    setDeck((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first!];
    });
  };

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "relative flex min-h-[260px] w-full max-w-sm flex-col items-center justify-center py-4",
        className
      )}
    >
      <div className="relative h-[200px] w-full">
        {deck.map((card, index) => {
          const isFront = index === 0;
          const yOffset = isExpanded ? index * 54 : index * 12;
          const scale = isExpanded ? 1 : 1 - index * 0.05;
          const opacity = isExpanded ? 1 : 1 - index * 0.22;

          return (
            <motion.div
              key={card.id}
              layout
              role="button"
              tabIndex={0}
              aria-label={`${card.title} — ${card.subtitle}. Click to cycle stack.`}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              onClick={cycleFrontCard}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  cycleFrontCard();
                }
              }}
              animate={{
                y: yOffset,
                scale: shouldReduceMotion ? 1 : scale,
                opacity,
                zIndex: deck.length - index,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness, damping }
              }
              className={cn(
                "absolute inset-x-0 top-0 cursor-pointer select-none rounded-2xl border p-5 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
                isFront
                  ? "border-neutral-300 bg-white hover:border-black dark:border-[#2E2E2E] dark:bg-[#0D0D0D] dark:hover:border-white"
                  : "border-neutral-200 bg-neutral-50/95 dark:border-[#222222] dark:bg-[#141414]/95"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {index === 0 ? (
                    <Sparkles className="h-3 w-3 text-black dark:text-white" />
                  ) : index === 1 ? (
                    <Layers className="h-3 w-3" />
                  ) : (
                    <Terminal className="h-3 w-3" />
                  )}
                  {card.badge}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[10px] font-bold text-black dark:border-[#262626] dark:bg-[#1B1B1B] dark:text-white">
                  {card.metric}
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </span>
              </div>

              <div className="mt-2.5 text-sm font-semibold text-black dark:text-white">
                {card.title}
              </div>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {card.subtitle}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
        Hover to fan out deck • Click any card to cycle stack
      </div>
    </div>
  );
}

export default AccordionStackCards;
