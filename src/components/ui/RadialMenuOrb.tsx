"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Plus,
  Sparkles,
  Copy,
  Share2,
  Bookmark,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RadialOrbAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface RadialMenuOrbProps {
  /** Array of satellite actions distributed along the polar ring. */
  actions?: RadialOrbAction[];
  /** Orbit radius in pixels from center trigger to satellite buttons. Default: 78 */
  radius?: number;
  /** Hooke's Law spring stiffness for radial blossom. Default: 340 */
  stiffness?: number;
  /** Spring damping coefficient for radial blossom. Default: 22 */
  damping?: number;
  /** Callback fired when an action is selected */
  onSelect?: (id: string) => void;
  className?: string;
}

const DEFAULT_ACTIONS: RadialOrbAction[] = [
  { id: "inspect", label: "Inspect", icon: <Sparkles className="h-4 w-4" /> },
  { id: "cli", label: "Copy CLI", icon: <Terminal className="h-4 w-4" /> },
  { id: "duplicate", label: "Clone", icon: <Copy className="h-4 w-4" /> },
  { id: "bookmark", label: "Save", icon: <Bookmark className="h-4 w-4" /> },
  { id: "share", label: "Share", icon: <Share2 className="h-4 w-4" /> },
];

export function RadialMenuOrb({
  actions = DEFAULT_ACTIONS,
  radius = 78,
  stiffness = 340,
  damping = 22,
  onSelect,
  className,
}: RadialMenuOrbProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isOpen, setIsOpen] = useState(false);
  const [lastSelected, setLastSelected] = useState<string>("Ready");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div
      className={cn(
        "relative flex min-h-[230px] w-full max-w-xs flex-col items-center justify-center",
        className
      )}
    >
      {/* Orbital Ring Guide */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            aria-hidden="true"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness, damping }
            }
            style={{ width: radius * 2, height: radius * 2 }}
            className="pointer-events-none absolute rounded-full border border-dashed border-neutral-300 dark:border-[#2A2A2A]"
          />
        )}
      </AnimatePresence>

      {/* Polar Satellite Action Buttons */}
      <AnimatePresence>
        {isOpen &&
          actions.map((action, index) => {
            const angleDeg = (360 / actions.length) * index - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const targetX = Math.cos(angleRad) * radius;
            const targetY = Math.sin(angleRad) * radius;

            return (
              <motion.button
                key={action.id}
                type="button"
                aria-label={action.label}
                initial={
                  shouldReduceMotion
                    ? { x: targetX, y: targetY, opacity: 1 }
                    : { x: 0, y: 0, scale: 0.3, opacity: 0 }
                }
                animate={{ x: targetX, y: targetY, scale: 1, opacity: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { x: 0, y: 0, scale: 0.3, opacity: 0 }
                }
                whileHover={shouldReduceMotion ? undefined : { scale: 1.14 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness,
                        damping,
                        delay: index * 0.025,
                      }
                }
                onClick={() => {
                  setLastSelected(action.label);
                  onSelect?.(action.id);
                  action.onClick?.();
                  setIsOpen(false);
                }}
                className="group absolute z-10 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-black shadow-md transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#2A2A2A] dark:bg-[#121212] dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black dark:focus-visible:ring-white"
              >
                {action.icon}
                <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-black">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
      </AnimatePresence>

      {/* Center Core Trigger Orb */}
      <motion.button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close radial command menu" : "Open radial command menu"}
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
        className="relative z-20 flex h-14 w-14 items-center justify-center rounded-full border border-black bg-black text-white shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:border-white dark:bg-white dark:text-black dark:focus-visible:ring-white"
      >
        <motion.span
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 360, damping: 22 }
          }
        >
          <Plus className="h-5 w-5" />
        </motion.span>
      </motion.button>

      {/* Telemetry Status Readout */}
      <div className="pointer-events-none absolute bottom-1 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
        {isOpen ? "Select orbital node • Esc to close" : `Action: ${lastSelected}`}
      </div>
    </div>
  );
}

export default RadialMenuOrb;
