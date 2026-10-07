"use client";

import React, { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LiquidTabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface LiquidPillTabsProps {
  /** Array of tab definitions. Defaults to a 4-item studio view switcher. */
  tabs?: LiquidTabItem[];
  /** Controlled active tab ID */
  activeTab?: string;
  /** Initial active tab ID for uncontrolled usage */
  defaultActiveTab?: string;
  /** Spring stiffness coefficient for pill morphing. Default: 380 */
  stiffness?: number;
  /** Spring damping coefficient for pill morphing. Default: 26 */
  damping?: number;
  /** Callback fired when active tab changes */
  onChange?: (id: string) => void;
  className?: string;
}

const DEFAULT_TABS: LiquidTabItem[] = [
  { id: "preview", label: "Preview" },
  { id: "physics", label: "Spring Config", badge: "3" },
  { id: "code", label: "Source" },
  { id: "a11y", label: "Accessibility" },
];

export function LiquidPillTabs({
  tabs = DEFAULT_TABS,
  activeTab: controlledActive,
  defaultActiveTab = "preview",
  stiffness = 380,
  damping = 26,
  onChange,
  className,
}: LiquidPillTabsProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const instanceId = useId();
  const [internalActive, setInternalActive] = useState<string>(
    defaultActiveTab || tabs[0]?.id || ""
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const currentActive =
    controlledActive !== undefined ? controlledActive : internalActive;

  const selectTab = (id: string) => {
    if (controlledActive === undefined) {
      setInternalActive(id);
    }
    onChange?.(id);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (index + 1) % tabs.length;
      const nextTab = tabs[nextIdx];
      if (nextTab) {
        selectTab(nextTab.id);
        tabRefs.current[nextIdx]?.focus();
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = (index - 1 + tabs.length) % tabs.length;
      const prevTab = tabs[prevIdx];
      if (prevTab) {
        selectTab(prevTab.id);
        tabRefs.current[prevIdx]?.focus();
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = tabs[0];
      if (first) {
        selectTab(first.id);
        tabRefs.current[0]?.focus();
      }
    } else if (e.key === "End") {
      e.preventDefault();
      const lastIdx = tabs.length - 1;
      const last = tabs[lastIdx];
      if (last) {
        selectTab(last.id);
        tabRefs.current[lastIdx]?.focus();
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label="View mode tabs"
      onMouseLeave={() => setHoveredId(null)}
      className={cn(
        "relative inline-flex flex-wrap items-center gap-1 rounded-2xl border border-neutral-200 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-[#222222] dark:bg-[#0D0D0D]",
        className
      )}
    >
      {tabs.map((tab, idx) => {
        const isActive = currentActive === tab.id;
        const isHovered = hoveredId === tab.id;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => selectTab(tab.id)}
            onMouseEnter={() => setHoveredId(tab.id)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={cn(
              "relative z-10 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
              isActive
                ? "text-white dark:text-black"
                : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            {/* Hover Ghost Pill */}
            {isHovered && !isActive && (
              <motion.span
                layoutId={`${instanceId}-hover-pill`}
                aria-hidden="true"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 30 }
                }
                className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-neutral-200/70 dark:bg-[#1B1B1B]"
              />
            )}

            {/* Primary Active Liquid Pill */}
            {isActive && (
              <motion.span
                layoutId={`${instanceId}-active-pill`}
                aria-hidden="true"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness,
                        damping,
                        mass: 0.6,
                      }
                }
                className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-black shadow-sm dark:bg-white"
              />
            )}

            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums transition-colors",
                  isActive
                    ? "bg-white/20 text-white dark:bg-black/15 dark:text-black"
                    : "bg-neutral-200 text-neutral-700 dark:bg-[#1F1F1F] dark:text-neutral-300"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default LiquidPillTabs;
