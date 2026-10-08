"use client";

import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ToastStackProps {
  /** Viewport position of the toast stack */
  position?: ToastPosition;
  /** Initial toast items displayed in the stack */
  initialToasts?: ToastItem[];
  /** Maximum visible toasts in the stack */
  maxVisible?: number;
  /** Automatically dismiss toasts after duration (paused on hover) */
  autoDismiss?: boolean;
  /** Auto-dismiss duration in milliseconds. Default: 4500 */
  duration?: number;
  /** Render toasts fixed to the viewport via portal (default: true) */
  viewportPortal?: boolean;
  /** Additional container class names */
  className?: string;
}

const ALL_POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-left": "top-5 left-5 items-start",
  "top-center": "top-5 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-5 right-5 items-end",
  "bottom-left": "bottom-5 left-5 items-start",
  "bottom-center": "bottom-5 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-5 right-5 items-end",
};

function getVariantIcon(variant: ToastVariant = "default") {
  switch (variant) {
    case "success":
      return (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-black dark:text-white" />
      );
    case "error":
      return <XCircle className="h-4 w-4 shrink-0 text-black dark:text-white" />;
    case "warning":
      return (
        <AlertTriangle className="h-4 w-4 shrink-0 text-black dark:text-white" />
      );
    default:
      return <Info className="h-4 w-4 shrink-0 text-neutral-500" />;
  }
}

export function ToastStack({
  position = "bottom-right",
  initialToasts = [],
  maxVisible = 4,
  autoDismiss = true,
  duration = 4500,
  viewportPortal = true,
  className,
}: ToastStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activePosition, setActivePosition] = useState<ToastPosition>(position);
  const [toasts, setToasts] = useState<ToastItem[]>(initialToasts);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActivePosition(position);
  }, [position]);

  // Auto-dismiss timer (pauses while user hovers the stack)
  useEffect(() => {
    if (!autoDismiss || expanded || toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, duration);
    return () => clearTimeout(timer);
  }, [autoDismiss, duration, expanded, toasts]);

  const pushToast = useCallback(
    (variant: ToastVariant, posOverride?: ToastPosition) => {
      const targetPos = posOverride || activePosition;
      if (posOverride) setActivePosition(posOverride);

      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const presets: Record<ToastVariant, { title: string; description: string }> = {
        default: {
          title: `Notification (${targetPos})`,
          description: "Hover the stack to pause auto-dismiss and expand.",
        },
        success: {
          title: "Deployment Succeeded",
          description: `Anchored at ${targetPos} of your viewport.`,
        },
        warning: {
          title: "Rate Limit Approaching",
          description: "85% of your hourly API quota has been used.",
        },
        error: {
          title: "Build Failed",
          description: "Check the terminal logs for details.",
        },
      };

      setToasts((prev) => [
        { id, variant, ...presets[variant] },
        ...prev.slice(0, 7),
      ]);
    },
    [activePosition]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const visibleToasts = toasts.slice(0, maxVisible);
  const isTop = activePosition.startsWith("top");
  const directionMultiplier = isTop ? 1 : -1;

  const viewportOverlay = (
    <div
      role="region"
      aria-live="polite"
      aria-label="Viewport notifications"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        "pointer-events-none fixed z-[9999] flex w-full max-w-sm flex-col px-4 sm:px-0",
        POSITION_CLASSES[activePosition]
      )}
    >
      <div className="relative w-full">
        <AnimatePresence initial={false}>
          {visibleToasts.map((toast, index) => {
            const yOffset =
              directionMultiplier * (expanded ? index * 74 : index * 12);
            const scale = expanded ? 1 : 1 - index * 0.04;
            const opacity = index >= maxVisible ? 0 : 1 - index * 0.15;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        y: isTop ? -24 : 24,
                        scale: 0.94,
                      }
                }
                animate={{
                  opacity,
                  y: yOffset,
                  scale,
                  zIndex: maxVisible - index,
                }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.92,
                        transition: { duration: 0.15 },
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                style={{
                  [isTop ? "top" : "bottom"]: 0,
                }}
                className="pointer-events-auto absolute left-0 right-0 flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 text-black shadow-2xl dark:border-[#262626] dark:bg-[#0C0C0C] dark:text-white"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <div className="mt-0.5">{getVariantIcon(toast.variant)}</div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-black dark:text-white">
                      {toast.title}
                    </div>
                    {toast.description && (
                      <p className="mt-0.5 truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                        {toast.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black dark:hover:bg-[#1A1A1A] dark:hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col items-center gap-4",
        className
      )}
    >
      {/* Position Selector Grid */}
      <div className="w-full rounded-2xl border border-neutral-200 bg-white p-4 dark:border-[#222222] dark:bg-[#0A0A0A]">
        <div className="mb-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          <span>Viewport Position ({toasts.length} active)</span>
          <div className="flex items-center gap-2">
            {toasts.length > 0 && (
              <button
                type="button"
                onClick={() => setToasts([])}
                className="inline-flex cursor-pointer items-center gap-1 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear</span>
              </button>
            )}
            <span className="text-black dark:text-white">{activePosition}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {ALL_POSITIONS.map((pos) => {
            const isSelected = activePosition === pos;
            return (
              <button
                key={pos}
                type="button"
                onClick={() => {
                  setActivePosition(pos);
                  pushToast("default", pos);
                }}
                className={cn(
                  "cursor-pointer rounded-lg border px-2.5 py-2 font-mono text-[10px] transition-colors",
                  isSelected
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-black hover:text-black dark:border-[#222222] dark:bg-[#111111] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
                )}
              >
                {pos}
              </button>
            );
          })}
        </div>

        {/* Variant Triggers */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 border-t border-neutral-200 pt-3 dark:border-[#1F1F1F]">
          {(["success", "default", "warning", "error"] as ToastVariant[]).map(
            (variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => pushToast(variant)}
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-[10px] capitalize text-black transition-colors hover:border-black dark:border-[#262626] dark:bg-[#121212] dark:text-white dark:hover:border-white"
              >
                <Bell className="h-3 w-3 text-neutral-400" />
                <span>{variant}</span>
              </button>
            )
          )}
        </div>
      </div>

      {viewportPortal && mounted && createPortal(viewportOverlay, document.body)}
    </div>
  );
}

export default ToastStack;
