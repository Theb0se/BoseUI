"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { Sparkles, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MorphingDialogProps {
  /** Trigger button title text. Default: "Inspect Spring Telemetry" */
  triggerTitle?: string;
  /** Subtitle shown inside the compact trigger card. Default: "Click to expand shared-layout surface" */
  triggerSubtitle?: string;
  /** Modal dialog heading. Default: "Hooke's Law Telemetry Architecture" */
  dialogTitle?: string;
  /** Modal dialog body description. */
  dialogDescription?: string;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Spring stiffness coefficient for shared layout projection. Default: 290 */
  stiffness?: number;
  /** Spring damping coefficient for shared layout projection. Default: 26 */
  damping?: number;
  /** Optional custom content inside the expanded dialog body */
  children?: React.ReactNode;
  className?: string;
}

export function MorphingDialog({
  triggerTitle = "Inspect Spring Telemetry",
  triggerSubtitle = "Click to expand shared-layout surface",
  dialogTitle = "Hooke's Law Telemetry Architecture",
  dialogDescription = "Every BoseUI overlay morphs directly from the bounding box of its origin trigger using GPU-accelerated layout projection, complete with vertical drag-to-dismiss elasticity.",
  open: controlledOpen,
  onOpenChange,
  stiffness = 290,
  damping = 26,
  children,
  className,
}: MorphingDialogProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const uniqueId = useId();
  const layoutId = `morphing-dialog-${uniqueId}`;

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
    if (!next) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const timer = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.y) > 85 || Math.abs(info.velocity.y) > 420) {
      setOpen(false);
    }
  };

  const springConfig = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness, damping };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Origin Trigger Card */}
      <motion.button
        ref={triggerRef}
        type="button"
        layoutId={layoutId}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        transition={springConfig}
        className="group flex items-center gap-3.5 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-white dark:focus-visible:ring-white"
      >
        <motion.div
          layoutId={`${layoutId}-icon`}
          transition={springConfig}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-black dark:border-[#262626] dark:bg-[#141414] dark:text-white"
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>

        <div className="pr-2">
          <motion.div
            layoutId={`${layoutId}-title`}
            transition={springConfig}
            className="text-sm font-semibold text-black dark:text-white"
          >
            {triggerTitle}
          </motion.div>
          <motion.div
            layoutId={`${layoutId}-subtitle`}
            transition={springConfig}
            className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400"
          >
            {triggerSubtitle}
          </motion.div>
        </div>

        <ArrowUpRight className="ml-auto h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black dark:group-hover:text-white" />
      </motion.button>

      {/* Shared-Element Expanded Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Dialog Surface */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uniqueId}-heading`}
              aria-describedby={`${uniqueId}-desc`}
              layoutId={layoutId}
              transition={springConfig}
              drag={shouldReduceMotion ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.35}
              onDragEnd={handleDragEnd}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 text-left shadow-2xl dark:border-[#262626] dark:bg-[#0D0D0D]"
            >
              {/* Drag Handle Indicator */}
              <div
                aria-hidden="true"
                className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200 dark:bg-[#262626]"
              />

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    layoutId={`${layoutId}-icon`}
                    transition={springConfig}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-black dark:border-[#262626] dark:bg-[#141414] dark:text-white"
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                  <div>
                    <motion.h3
                      id={`${uniqueId}-heading`}
                      layoutId={`${layoutId}-title`}
                      transition={springConfig}
                      className="text-base font-semibold text-black dark:text-white"
                    >
                      {dialogTitle}
                    </motion.h3>
                    <motion.p
                      layoutId={`${layoutId}-subtitle`}
                      transition={springConfig}
                      className="text-xs text-neutral-500 dark:text-neutral-400"
                    >
                      Shared-element projection • Drag vertically to dismiss
                    </motion.p>
                  </div>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#262626] dark:hover:border-white dark:hover:text-white dark:focus-visible:ring-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ delay: 0.05, duration: 0.18 }}
                className="mt-5"
              >
                <p
                  id={`${uniqueId}-desc`}
                  className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300"
                >
                  {dialogDescription}
                </p>

                {children || (
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-[#1F1F1F] dark:bg-[#141414]">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Stiffness
                      </div>
                      <div className="mt-0.5 font-mono text-xs font-semibold text-black dark:text-white">
                        {stiffness} N/m
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Damping
                      </div>
                      <div className="mt-0.5 font-mono text-xs font-semibold text-black dark:text-white">
                        {damping} Ns/m
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Dismiss
                      </div>
                      <div className="mt-0.5 font-mono text-xs font-semibold text-black dark:text-white">
                        &gt;85px / Esc
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MorphingDialog;
