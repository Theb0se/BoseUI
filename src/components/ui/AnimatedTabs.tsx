"use client";

import React, { useState, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  content: React.ReactNode;
}

export interface AnimatedTabsProps {
  /** Array of tab definitions */
  tabs?: TabItem[];
  /** Default active tab ID */
  defaultTabId?: string;
  /** Callback fired when active tab changes */
  onChange?: (tabId: string) => void;
  /** Additional container class names */
  className?: string;
}

const DEFAULT_TABS: TabItem[] = [
  {
    id: "preview",
    label: "Overview",
    content: (
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-black dark:text-white">
          Shared-Element Sliding Indicator
        </div>
        <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          The active pill glides smoothly between tabs using Framer Motion
          layoutId springs with zero layout shift.
        </p>
      </div>
    ),
  },
  {
    id: "metrics",
    label: "Metrics",
    badge: "99.9%",
    content: (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-neutral-200 p-3 dark:border-[#222222]">
          <div className="font-mono text-[10px] text-neutral-400">FRAME BUDGET</div>
          <div className="mt-1 font-mono text-sm font-semibold text-black dark:text-white">
            &lt; 1.2ms
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 p-3 dark:border-[#222222]">
          <div className="font-mono text-[10px] text-neutral-400">BUNDLE SIZE</div>
          <div className="mt-1 font-mono text-sm font-semibold text-black dark:text-white">
            1.8 kB
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    content: (
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-black dark:text-white">
          Keyboard Accessible
        </div>
        <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          Use Left, Right, Home, and End keys to cycle through tabs with full
          WAI-ARIA tablist focus management.
        </p>
      </div>
    ),
  },
];

export function AnimatedTabs({
  tabs = DEFAULT_TABS,
  defaultTabId,
  onChange,
  className,
}: AnimatedTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const instanceId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeId, setActiveId] = useState<string>(
    defaultTabId || tabs[0]?.id || ""
  );

  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  const handleSelect = (id: string, focusIndex?: number) => {
    setActiveId(id);
    onChange?.(id);
    if (focusIndex !== undefined) {
      tabRefs.current[focusIndex]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (idx + 1) % tabs.length;
      const next = tabs[nextIdx];
      if (next) handleSelect(next.id, nextIdx);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = (idx - 1 + tabs.length) % tabs.length;
      const prev = tabs[prevIdx];
      if (prev) handleSelect(prev.id, prevIdx);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (tabs[0]) handleSelect(tabs[0].id, 0);
    } else if (e.key === "End") {
      e.preventDefault();
      const lastIdx = tabs.length - 1;
      if (tabs[lastIdx]) handleSelect(tabs[lastIdx].id, lastIdx);
    }
  };

  return (
    <div className={cn("w-full max-w-md", className)}>
      {/* Tab List */}
      <div
        role="tablist"
        aria-label="Content tabs"
        className="inline-flex w-full items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 dark:border-[#222222] dark:bg-[#0C0C0C]"
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              onClick={() => handleSelect(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                "relative flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
                isActive
                  ? "text-white dark:text-black"
                  : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`tab-pill-${instanceId}`}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                  className="absolute inset-0 rounded-lg bg-black shadow-xs dark:bg-white"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "relative z-10 rounded px-1 py-0.2 font-mono text-[10px]",
                    isActive
                      ? "bg-white/20 text-white dark:bg-black/15 dark:text-black"
                      : "bg-neutral-200/80 text-neutral-600 dark:bg-[#1A1A1A] dark:text-neutral-400"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div
        role="tabpanel"
        className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 dark:border-[#222222] dark:bg-[#0A0A0A]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab?.id}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
          >
            {activeTab?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AnimatedTabs;
