"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpringBadgePillProps {
  /** The count number or main metric */
  count?: number;
  /** Label text displayed beside the count */
  label?: string;
  /** Visual variant. Default: "default" */
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  /** Whether to show a live pulsing beacon radar dot. Default: true */
  pulseBeacon?: boolean;
  /** Whether the badge can be dismissed with a flick or close button. Default: false */
  dismissible?: boolean;
  /** Callback fired when badge is dismissed */
  onDismiss?: () => void;
  /** Optional custom class name */
  className?: string;
}

const VARIANTS = {
  default:
    "bg-neutral-900 text-white border-neutral-800 dark:bg-white dark:text-black dark:border-neutral-200",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
  danger:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60",
  outline:
    "bg-white text-neutral-800 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800",
};

const BEACON_COLORS = {
  default: "bg-white dark:bg-black",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  outline: "bg-neutral-500",
};

export function SpringBadgePill({
  count,
  label = "Updates",
  variant = "default",
  pulseBeacon = true,
  dismissible = false,
  onDismiss,
  className,
}: SpringBadgePillProps) {
  const [dismissed, setDismissed] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.85, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 4 }}
        transition={
          reduceMotion
            ? { duration: 0.15 }
            : { type: "spring", stiffness: 450, damping: 26 }
        }
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm transition-shadow select-none",
          VARIANTS[variant] || VARIANTS.default,
          className
        )}
      >
        {pulseBeacon && (
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                BEACON_COLORS[variant] || BEACON_COLORS.default
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                BEACON_COLORS[variant] || BEACON_COLORS.default
              )}
            />
          </span>
        )}

        {count !== undefined && (
          <motion.span
            key={count}
            initial={reduceMotion ? false : { y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="font-mono text-[11px] font-bold"
          >
            {count}
          </motion.span>
        )}

        <span>{label}</span>

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss badge"
            className="ml-0.5 rounded-full p-0.5 opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
