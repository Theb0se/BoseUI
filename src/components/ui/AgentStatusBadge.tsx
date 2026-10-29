"use client";

import React, { useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & Constants                                                  */
/* ------------------------------------------------------------------ */

export type AgentStatus =
  | "reading-docs"
  | "analyzing"
  | "debugging"
  | "success";

export type AgentBadgeSize = "sm" | "md" | "lg";
export type AgentBadgeVariant = "default" | "outline" | "ghost" | "glass";

export const AGENT_STATUSES: AgentStatus[] = [
  "reading-docs",
  "analyzing",
  "debugging",
  "success",
];

export const DEFAULT_STATUS_LABELS: Record<AgentStatus, string> = {
  "reading-docs": "Reading docs",
  "analyzing": "Analyzing",
  "debugging": "Debugging",
  "success": "Success",
};

// Checkmark dot indices for 4x4 grid (row, col):
// (2,0)=8, (3,1)=13, (2,2)=10, (1,3)=7, (0,3)=3
const CHECKMARK_DOTS = [8, 13, 10, 7, 3];

export interface StatusStyleConfig {
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glowColor: string;
  dotActive: string;
  dotInactive: string;
  dotGlow: string;
}

export const STATUS_CONFIG: Record<AgentStatus, StatusStyleConfig> = {
  "reading-docs": {
    label: "Reading docs",
    badgeBg: "bg-sky-500/10 dark:bg-sky-500/15",
    badgeBorder: "border-sky-500/30 dark:border-sky-500/30",
    badgeText: "text-sky-700 dark:text-sky-300",
    glowColor: "rgba(14, 165, 233, 0.22)",
    dotActive: "bg-sky-500 dark:bg-sky-400",
    dotInactive: "bg-sky-500/25 dark:bg-sky-400/20",
    dotGlow: "shadow-[0_0_6px_rgba(56,189,248,0.8)]",
  },
  "analyzing": {
    label: "Analyzing",
    badgeBg: "bg-violet-500/10 dark:bg-violet-500/15",
    badgeBorder: "border-violet-500/30 dark:border-violet-500/30",
    badgeText: "text-violet-700 dark:text-violet-300",
    glowColor: "rgba(168, 85, 247, 0.22)",
    dotActive: "bg-violet-500 dark:bg-violet-400",
    dotInactive: "bg-violet-500/25 dark:bg-violet-400/20",
    dotGlow: "shadow-[0_0_6px_rgba(168,85,247,0.8)]",
  },
  "debugging": {
    label: "Debugging",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/15",
    badgeBorder: "border-amber-500/30 dark:border-amber-500/30",
    badgeText: "text-amber-700 dark:text-amber-300",
    glowColor: "rgba(245, 158, 11, 0.22)",
    dotActive: "bg-amber-500 dark:bg-amber-400",
    dotInactive: "bg-amber-500/25 dark:bg-amber-400/20",
    dotGlow: "shadow-[0_0_6px_rgba(245,158,11,0.8)]",
  },
  "success": {
    label: "Success",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    badgeBorder: "border-emerald-500/30 dark:border-emerald-500/30",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    glowColor: "rgba(16, 185, 129, 0.25)",
    dotActive: "bg-emerald-500 dark:bg-emerald-400",
    dotInactive: "bg-emerald-500/25 dark:bg-emerald-400/20",
    dotGlow: "shadow-[0_0_6px_rgba(52,211,153,0.85)]",
  },
};

/* ------------------------------------------------------------------ */
/* 4x4 Dot Matrix Subcomponent                                        */
/* ------------------------------------------------------------------ */

export interface AgentDotGridProps {
  status: AgentStatus;
  size?: AgentBadgeSize;
  className?: string;
}

export function AgentDotGrid({
  status,
  size = "md",
  className,
}: AgentDotGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = STATUS_CONFIG[status];

  // Sizing definitions for the 4x4 matrix
  const dotSizeClasses: Record<AgentBadgeSize, { dot: string; gap: string }> = {
    sm: { dot: "w-[2.5px] h-[2.5px]", gap: "gap-[1.5px]" },
    md: { dot: "w-[3px] h-[3px]", gap: "gap-[2px]" },
    lg: { dot: "w-[3.5px] h-[3.5px]", gap: "gap-[2.5px]" },
  };

  const { dot: dotCls, gap: gapCls } = dotSizeClasses[size];

  // Helper calculating per-dot animation variants based on status
  const getDotAnimation = (index: number) => {
    if (shouldReduceMotion) {
      if (status === "success") {
        return {
          opacity: CHECKMARK_DOTS.includes(index) ? 1 : 0.2,
          scale: CHECKMARK_DOTS.includes(index) ? 1.1 : 0.8,
        };
      }
      return { opacity: 0.85, scale: 1 };
    }

    const row = Math.floor(index / 4);
    const col = index % 4;

    switch (status) {
      case "reading-docs": {
        // Line-by-line raster scan across each row
        const delay = row * 0.2 + col * 0.055;
        return {
          animate: {
            opacity: [0.2, 1, 0.45, 0.2],
            scale: [0.85, 1.3, 0.95, 0.85],
          },
          transition: {
            duration: 1.25,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          },
        };
      }

      case "analyzing": {
        // Concentric radial waves rippling outward from the 4 central dots
        const dist = Math.hypot(col - 1.5, row - 1.5);
        const normalized = (dist - 0.707) / (2.121 - 0.707); // 0 (center) to 1 (corners)
        const delay = normalized * 0.48;
        return {
          animate: {
            opacity: [0.2, 1, 0.2],
            scale: [0.75, 1.35, 0.75],
          },
          transition: {
            duration: 1.15,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          },
        };
      }

      case "debugging": {
        // Diagnostic radar search probe stepping across coordinates
        const pingOrder = [
          0, 5, 10, 15, 12, 9, 6, 3, 1, 4, 11, 14, 2, 7, 8, 13,
        ];
        const step = pingOrder.indexOf(index);
        const delay = step * 0.055;
        return {
          animate: {
            opacity: [0.15, 1, 0.35, 0.9, 0.15],
            scale: [0.8, 1.35, 0.9, 1.2, 0.8],
          },
          transition: {
            duration: 0.9,
            repeat: Infinity,
            delay,
            ease: "linear",
          },
        };
      }

      case "success": {
        // Triumphant checkmark drawing sequence that settles with glowing green
        const isCheck = CHECKMARK_DOTS.includes(index);
        if (isCheck) {
          const checkIndex = CHECKMARK_DOTS.indexOf(index);
          return {
            animate: {
              opacity: [0.3, 1, 0.95, 1],
              scale: [0.6, 1.4, 1.15, 1.1],
            },
            transition: {
              duration: 2.4,
              repeat: Infinity,
              delay: checkIndex * 0.08,
              ease: "easeInOut",
            },
          };
        }
        return {
          animate: { opacity: 0.12, scale: 0.75 },
          transition: { duration: 0.3 },
        };
      }
    }
  };

  return (
    <div
      aria-hidden="true"
      className={cn("grid grid-cols-4 select-none items-center justify-center", gapCls, className)}
    >
      {Array.from({ length: 16 }).map((_, i) => {
        const anim = getDotAnimation(i);
        const isCheck = status === "success" && CHECKMARK_DOTS.includes(i);

        return (
          <motion.span
            key={`${status}-dot-${i}`}
            initial={false}
            animate={anim.animate}
            transition={anim.transition}
            className={cn(
              "rounded-full transition-colors duration-300",
              dotCls,
              isCheck || status !== "success" ? config.dotActive : config.dotInactive,
              isCheck && config.dotGlow
            )}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component: AgentStatusBadge                                   */
/* ------------------------------------------------------------------ */

export interface AgentStatusBadgeProps
  extends Omit<HTMLMotionProps<"div">, "children" | "onChange"> {
  /** Current AI agent status */
  status?: AgentStatus;
  /** Custom label text override (defaults to status-specific label) */
  label?: React.ReactNode;
  /** Optional children for custom badge content */
  children?: React.ReactNode;
  /** Size variant */
  size?: AgentBadgeSize;
  /** Visual variant */
  variant?: AgentBadgeVariant;
  /** Whether to render ambient status glow behind badge */
  glow?: boolean;
  /** Whether to render the 4x4 animated dot matrix */
  showGrid?: boolean;
  /** If true, clicking cycles through the statuses */
  interactive?: boolean;
  /** Callback triggered when status is updated */
  onStatusChange?: (nextStatus: AgentStatus) => void;
  className?: string;
}

export function AgentStatusBadge({
  status: controlledStatus,
  label,
  children,
  size = "md",
  variant = "default",
  glow = true,
  showGrid = true,
  interactive = false,
  onStatusChange,
  className,
  ...props
}: AgentStatusBadgeProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalStatus, setInternalStatus] =
    useState<AgentStatus>("reading-docs");

  const currentStatus = controlledStatus ?? internalStatus;
  const config = STATUS_CONFIG[currentStatus];

  // Cycling interaction
  const handleCycle = useCallback(() => {
    if (!interactive) return;
    const currentIndex = AGENT_STATUSES.indexOf(currentStatus);
    const nextStatus =
      AGENT_STATUSES[(currentIndex + 1) % AGENT_STATUSES.length];

    if (controlledStatus === undefined) {
      setInternalStatus(nextStatus);
    }
    onStatusChange?.(nextStatus);
  }, [interactive, currentStatus, controlledStatus, onStatusChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (interactive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      handleCycle();
    }
  };

  // Dimensions & paddings
  const sizeClasses: Record<AgentBadgeSize, string> = {
    sm: "h-7 px-2.5 gap-2 text-xs",
    md: "h-8 px-3 gap-2.5 text-xs font-medium",
    lg: "h-9 px-3.5 gap-3 text-sm font-medium",
  };

  // Visual variants
  const variantClasses: Record<AgentBadgeVariant, string> = {
    default: cn(config.badgeBg, config.badgeBorder, config.badgeText),
    outline: cn("bg-transparent", config.badgeBorder, config.badgeText),
    ghost: cn("bg-transparent border-transparent", config.badgeText),
    glass: cn(
      "backdrop-blur-md bg-white/40 dark:bg-neutral-900/40",
      config.badgeBorder,
      config.badgeText
    ),
  };

  const displayText = label ?? children ?? config.label;

  return (
    <motion.div
      role={interactive ? "button" : "status"}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`AI agent status: ${typeof displayText === "string" ? displayText : currentStatus}`}
      aria-live="polite"
      onClick={handleCycle}
      onKeyDown={handleKeyDown}
      whileHover={interactive && !shouldReduceMotion ? { scale: 1.03 } : undefined}
      whileTap={interactive && !shouldReduceMotion ? { scale: 0.97 } : undefined}
      style={{
        boxShadow:
          glow && variant !== "ghost"
            ? `0 0 16px ${config.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            : undefined,
      }}
      className={cn(
        "relative inline-flex items-center rounded-full border transition-all duration-300 select-none",
        interactive && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-400",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* 4x4 animated matrix */}
      {showGrid && <AgentDotGrid status={currentStatus} size={size} />}

      {/* Animated label text */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={String(displayText)}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="inline-block whitespace-nowrap tracking-tight font-medium"
          >
            {displayText}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Interactive indicator pill */}
      {interactive && (
        <span
          aria-hidden="true"
          className="ml-0.5 text-[10px] opacity-40 hover:opacity-80 transition-opacity"
        >
          ⇄
        </span>
      )}
    </motion.div>
  );
}

export default AgentStatusBadge;
