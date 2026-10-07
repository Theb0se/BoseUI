"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Command,
  Copy,
  Sparkles,
  Terminal,
  Share2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PopoverCommandItem {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

export interface MagneticPopoverMenuProps {
  /** Trigger button label. Default: "Quick Actions" */
  triggerLabel?: string;
  /** Array of popover menu items. */
  items?: PopoverCommandItem[];
  /** Hooke's Law spring stiffness coefficient. Default: 380 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 26 */
  damping?: number;
  /** Callback fired when an item is selected */
  onSelect?: (id: string) => void;
  className?: string;
}

const DEFAULT_ITEMS: PopoverCommandItem[] = [
  {
    id: "install",
    label: "Copy CLI Command",
    shortcut: "⌘C",
    icon: <Terminal className="h-3.5 w-3.5" />,
  },
  {
    id: "source",
    label: "Copy .tsx Source",
    shortcut: "⌘S",
    icon: <Copy className="h-3.5 w-3.5" />,
  },
  {
    id: "tune",
    label: "Tune Spring Constants",
    shortcut: "⌘K",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  {
    id: "share",
    label: "Share Component URL",
    shortcut: "⌘U",
    icon: <Share2 className="h-3.5 w-3.5" />,
  },
];

export function MagneticPopoverMenu({
  triggerLabel = "Quick Actions",
  items = DEFAULT_ITEMS,
  stiffness = 380,
  damping = 26,
  onSelect,
  className,
}: MagneticPopoverMenuProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const instanceId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (activeIndex + 1) % items.length;
      setActiveIndex(next);
      itemRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (activeIndex - 1 + items.length) % items.length;
      setActiveIndex(prev);
      itemRefs.current[prev]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn("relative inline-block", className)}
    >
      <motion.button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-xs font-semibold text-black shadow-sm transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-white dark:hover:border-white dark:focus-visible:ring-white"
      >
        <Command className="h-3.5 w-3.5" />
        <span>{triggerLabel}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-neutral-400 transition-transform duration-200",
            isOpen && "rotate-180 text-black dark:text-white"
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label={triggerLabel}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: -6 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: -4 }
            }
            transition={{ type: "spring", stiffness, damping }}
            className="absolute left-0 top-full z-30 mt-2 w-60 origin-top-left rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-[#262626] dark:bg-[#0D0D0D]"
          >
            {items.map((item, idx) => {
              const isHighlighted = activeIndex === idx;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  type="button"
                  role="menuitem"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  onClick={() => {
                    onSelect?.(item.id);
                    setIsOpen(false);
                  }}
                  className="relative z-10 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-black transition-colors focus-visible:outline-none dark:text-white"
                >
                  {isHighlighted && (
                    <motion.span
                      layoutId={`${instanceId}-popover-highlight`}
                      aria-hidden="true"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 28 }
                      }
                      className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-neutral-100 dark:bg-[#1A1A1A]"
                    />
                  )}

                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>

                  <kbd className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 dark:border-[#262626] dark:bg-[#121212]">
                    {item.shortcut}
                  </kbd>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MagneticPopoverMenu;
