"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DrawerSide = "right" | "left" | "bottom" | "top";

export interface DrawerProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state when uncontrolled */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Edge of the viewport the drawer slides from */
  side?: DrawerSide;
  /** Drawer header title */
  title?: string;
  /** Optional subtitle below the title */
  description?: string;
  /** Trigger button label if used self-contained */
  triggerLabel?: string;
  /** Custom trigger element */
  trigger?: React.ReactNode;
  /** Drawer body content */
  children?: React.ReactNode;
  /** Optional footer actions */
  footer?: React.ReactNode;
  /** Additional panel class names */
  className?: string;
}

const SIDE_VARIANTS: Record<
  DrawerSide,
  {
    initial: Record<string, string | number>;
    animate: Record<string, string | number>;
    exit: Record<string, string | number>;
    panelClass: string;
    dragAxis: "x" | "y";
    dragConstraints: { top?: number; bottom?: number; left?: number; right?: number };
  }
> = {
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    panelClass: "inset-y-0 right-0 h-dvh w-full max-w-md border-l",
    dragAxis: "x",
    dragConstraints: { left: 0 },
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    panelClass: "inset-y-0 left-0 h-dvh w-full max-w-md border-r",
    dragAxis: "x",
    dragConstraints: { right: 0 },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    panelClass: "inset-x-0 bottom-0 w-full max-h-[85dvh] rounded-t-2xl border-t",
    dragAxis: "y",
    dragConstraints: { top: 0 },
  },
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
    panelClass: "inset-x-0 top-0 w-full max-h-[85dvh] rounded-b-2xl border-b",
    dragAxis: "y",
    dragConstraints: { bottom: 0 },
  },
};

export function Drawer({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  side = "right",
  title = "Drawer Panel",
  description,
  triggerLabel = "Open Drawer",
  trigger,
  children,
  footer,
  className,
}: DrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setOpen]);

  const variant = SIDE_VARIANTS[side];

  const overlayContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex">
          {/* Fullscreen Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={shouldReduceMotion ? { opacity: 0 } : variant.initial}
            animate={shouldReduceMotion ? { opacity: 1 } : variant.animate}
            exit={shouldReduceMotion ? { opacity: 0 } : variant.exit}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 34,
            }}
            drag={shouldReduceMotion ? false : variant.dragAxis}
            dragConstraints={variant.dragConstraints}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (side === "bottom" && info.offset.y > 90) setOpen(false);
              if (side === "top" && info.offset.y < -90) setOpen(false);
              if (side === "right" && info.offset.x > 90) setOpen(false);
              if (side === "left" && info.offset.x < -90) setOpen(false);
            }}
            className={cn(
              "fixed z-[9999] flex flex-col justify-between border-neutral-200 bg-white p-6 text-black shadow-2xl dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-white",
              variant.panelClass,
              className
            )}
          >
            {side === "bottom" && (
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-[#1F1F1F]">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-black dark:text-white">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close drawer"
                className="cursor-pointer rounded-lg border border-neutral-200 p-1.5 text-neutral-500 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="my-4 flex-1 overflow-y-auto text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              {children || (
                <div className="space-y-3 py-2">
                  <p>
                    This drawer renders in a top-level React portal (z-9999)
                    above all headers, sidebars, and page content. You can also
                    drag it toward the screen edge to dismiss.
                  </p>
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 font-mono text-[11px] dark:border-[#1F1F1F] dark:bg-[#111111]">
                    side=&quot;{side}&quot; · Drag or press ESC to close
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-[#1F1F1F]">
              {footer || (
                <>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="cursor-pointer rounded-lg border border-neutral-200 px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="cursor-pointer rounded-lg bg-black px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-black transition-colors hover:border-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-white dark:hover:border-white"
        >
          {triggerLabel}
        </button>
      )}

      {mounted && createPortal(overlayContent, document.body)}
    </>
  );
}

export default Drawer;
