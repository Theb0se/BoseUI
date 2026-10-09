"use client";

import React, { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbSegment {
  id: string;
  label: string;
  href?: string;
}

export interface MagneticBreadcrumbProps {
  /** Ordered array of breadcrumb path segments. */
  items?: BreadcrumbSegment[];
  /** Spring stiffness coefficient for sliding hover pill. Default: 380 */
  stiffness?: number;
  /** Spring damping coefficient for sliding hover pill. Default: 26 */
  damping?: number;
  /** Callback fired when a segment is clicked */
  onSelect?: (id: string) => void;
  className?: string;
}

const DEFAULT_SEGMENTS: BreadcrumbSegment[] = [
  { id: "root", label: "Workspace" },
  { id: "registry", label: "Registry v2" },
  { id: "primitives", label: "Primitives" },
  { id: "kinetic", label: "MagneticBreadcrumb" },
];

export function MagneticBreadcrumb({
  items = DEFAULT_SEGMENTS,
  stiffness = 380,
  damping = 26,
  onSelect,
  className,
}: MagneticBreadcrumbProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const instanceId = useId();
  const [activeId, setActiveId] = useState<string>(
    items[items.length - 1]?.id || "kinetic"
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <nav
      aria-label="Breadcrumb"
      onMouseLeave={() => setHoveredId(null)}
      className={cn(
        "inline-flex flex-wrap items-center gap-1 py-2",
        className
      )}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((segment, index) => {
          const isCurrent = activeId === segment.id;
          const isHovered = hoveredId === segment.id;

          return (
            <li key={segment.id} className="flex items-center gap-1">
              <motion.button
                type="button"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => {
                  setActiveId(segment.id);
                  onSelect?.(segment.id);
                }}
                onMouseEnter={() => setHoveredId(segment.id)}
                onFocus={() => setHoveredId(segment.id)}
                whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                transition={{ type: "spring", stiffness, damping }}
                className={cn(
                  "relative z-10 inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
                  isCurrent
                    ? "font-semibold text-black dark:text-white"
                    : "text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                )}
              >
                {isHovered && (
                  <motion.span
                    layoutId={`${instanceId}-crumb-pill`}
                    aria-hidden="true"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness, damping }
                    }
                    className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-neutral-100 dark:bg-[#181818]"
                  />
                )}

                {index === 0 && <Home className="h-3.5 w-3.5" />}
                <span>{segment.label}</span>
              </motion.button>

              {index < items.length - 1 && (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-600"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default MagneticBreadcrumb;
