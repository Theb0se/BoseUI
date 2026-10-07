"use client";

import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { PanelBottomOpen, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DrawerDetent = "peek" | "full";

export interface KineticDrawerSheetProps {
  /** Trigger button label. Default: "Open Gesture Drawer" */
  triggerLabel?: string;
  /** Drawer heading title. Default: "Multi-Detent Spring Sheet" */
  title?: string;
  /** Spring stiffness coefficient for sheet slide and detent snapping. Default: 320 */
  stiffness?: number;
  /** Spring damping coefficient for sheet slide and detent snapping. Default: 28 */
  damping?: number;
  className?: string;
}

export function KineticDrawerSheet({
  triggerLabel = "Open Gesture Drawer",
  title = "Multi-Detent Spring Sheet",
  stiffness = 320,
  damping = 28,
  className,
}: KineticDrawerSheetProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isOpen, setIsOpen] = useState(false);
  const [detent, setDetent] = useState<DrawerDetent>("peek");

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

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 75 || info.velocity.y > 400) {
      if (detent === "full") {
        setDetent("peek");
      } else {
        setIsOpen(false);
      }
    } else if (info.offset.y < -50 || info.velocity.y < -350) {
      setDetent("full");
    }
  };

  return (
    <div className={cn("inline-block", className)}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          setDetent("peek");
          setIsOpen(true);
        }}
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 text-xs font-semibold text-black shadow-sm transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-white dark:hover:border-white dark:focus-visible:ring-white"
      >
        <PanelBottomOpen className="h-4 w-4" />
        <span>{triggerLabel}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Bottom Detent Sheet */}
            <motion.div
              layout
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : { type: "spring", stiffness, damping }
              }
              drag={shouldReduceMotion ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.32}
              onDragEnd={handleDragEnd}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 text-left shadow-2xl dark:border-[#262626] dark:bg-[#0D0D0D]"
            >
              {/* Grab Bar */}
              <div
                aria-hidden="true"
                className="mx-auto mb-4 h-1.5 w-12 cursor-grab rounded-full bg-neutral-200 active:cursor-grabbing dark:bg-[#262626]"
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-black dark:border-[#262626] dark:bg-[#141414] dark:text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-black dark:text-white">
                      {title}
                    </h3>
                    <p className="font-mono text-[10px] uppercase text-neutral-400">
                      DETENT: {detent.toUpperCase()} • DRAG UP/DOWN
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close drawer"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                Flick upward or press the detent toggle below to expand full
                diagnostics. Flick downward or press Escape to dismiss.
              </p>

              {detent === "full" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs dark:border-[#1F1F1F] dark:bg-[#141414]"
                >
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Spring Solver:</span>
                    <span className="font-semibold text-black dark:text-white">
                      k={stiffness}, c={damping}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Drag Elasticity:</span>
                    <span className="font-semibold text-black dark:text-white">
                      0.32 (Rubber-Band)
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="mt-5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDetent((d) => (d === "peek" ? "full" : "peek"))
                  }
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-semibold text-black transition-colors hover:border-black dark:border-[#262626] dark:text-white dark:hover:border-white"
                >
                  {detent === "peek" ? "Expand Full Detent" : "Snap to Peek"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default KineticDrawerSheet;
