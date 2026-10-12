"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AIStatus = "idle" | "thinking" | "generating" | "done" | "error";

export interface AIStatusBadgeProps {
  status: AIStatus;
  /** Allow clicking to cycle or trigger action */
  onClick?: () => void;
  className?: string;
}

const STATUS_CONFIG: Record<
  AIStatus,
  { label: string; dotClass: string; badgeClass: string; pulse: boolean }
> = {
  idle: {
    label: "Idle",
    dotClass: "bg-neutral-400 dark:bg-neutral-500",
    badgeClass: "border-border bg-muted/60 text-muted-foreground",
    pulse: false,
  },
  thinking: {
    label: "Thinking",
    dotClass: "bg-amber-500",
    badgeClass:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    pulse: true,
  },
  generating: {
    label: "Generating",
    dotClass: "bg-blue-500",
    badgeClass:
      "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    pulse: true,
  },
  done: {
    label: "Ready",
    dotClass: "bg-emerald-500",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    pulse: false,
  },
  error: {
    label: "Failed",
    dotClass: "bg-red-500",
    badgeClass:
      "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    pulse: false,
  },
};

export function AIStatusBadge({ status, onClick, className }: AIStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  const reduceMotion = useReducedMotion();

  return (
    <span
      role="status"
      onClick={onClick}
      aria-label={`AI status: ${cfg.label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors select-none",
        onClick && "cursor-pointer hover:opacity-85 active:scale-95 transition-transform",
        cfg.badgeClass,
        className
      )}
    >
      {/* Dot indicator */}
      <span className="relative flex h-2 w-2 shrink-0">
        {cfg.pulse && !reduceMotion && (
          <motion.span
            className={cn("absolute inset-0 rounded-full opacity-75", cfg.dotClass)}
            animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className={cn("relative rounded-full h-2 w-2", cfg.dotClass)} />
      </span>

      {/* Label with spring transition between states */}
      <AnimatePresence mode="wait">
        <motion.span
          key={status}
          initial={reduceMotion ? {} : { opacity: 0, y: 3, filter: "blur(2px)" }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduceMotion ? {} : { opacity: 0, y: -3, filter: "blur(2px)" }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          {cfg.label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
