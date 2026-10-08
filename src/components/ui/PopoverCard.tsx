"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal, Bell, ShieldCheck, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverCardProps {
  /** Label shown on the default trigger button */
  triggerLabel?: string;
  /** Header title inside the popover */
  title?: string;
  /** Subtitle inside the popover header */
  description?: string;
  /** Preferred side relative to trigger. Default: "bottom" */
  side?: PopoverSide;
  /** Alignment along the chosen side. Default: "center" */
  align?: PopoverAlign;
  /** Controlled open state */
  open?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom body content inside the popover */
  children?: React.ReactNode;
  className?: string;
}

export function PopoverCard({
  triggerLabel = "Display Settings",
  title = "Workspace Preferences",
  description = "Adjust real-time notification and layout behavior.",
  side = "bottom",
  align = "center",
  open: controlledOpen,
  onOpenChange,
  children,
  className,
}: PopoverCardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const popoverId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // Interactive demo state when default children are used
  const [compactMode, setCompactMode] = useState(false);
  const [instantAlerts, setInstantAlerts] = useState(true);
  const [strictTypes, setStrictTypes] = useState(true);

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const sideClasses: Record<PopoverSide, string> = {
    bottom: "top-[calc(100%+10px)]",
    top: "bottom-[calc(100%+10px)]",
    left: "right-[calc(100%+10px)] top-0",
    right: "left-[calc(100%+10px)] top-0",
  };

  const alignClasses: Record<PopoverAlign, string> = {
    start: side === "top" || side === "bottom" ? "left-0" : "top-0",
    center:
      side === "top" || side === "bottom"
        ? "left-1/2 -translate-x-1/2"
        : "top-1/2 -translate-y-1/2",
    end: side === "top" || side === "bottom" ? "right-0" : "bottom-0",
  };

  const initialOffset = {
    bottom: { y: -6, x: 0 },
    top: { y: 6, x: 0 },
    left: { x: 6, y: 0 },
    right: { x: -6, y: 0 },
  }[side];

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        aria-haspopup="dialog"
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
          isOpen
            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
            : "border-neutral-200 bg-white text-black hover:border-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-white dark:hover:border-white"
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>{triggerLabel}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={popoverId}
            role="dialog"
            aria-label={title}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, ...initialOffset }
            }
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, ...initialOffset }
            }
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={cn(
              "absolute z-50 w-72 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl dark:border-[#262626] dark:bg-[#0A0A0A]",
              sideClasses[side],
              alignClasses[align]
            )}
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-2 border-b border-neutral-100 pb-2.5 dark:border-[#1A1A1A]">
              <div>
                <h4 className="text-xs font-semibold text-black dark:text-white">
                  {title}
                </h4>
                {description && (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="Close popover"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black dark:hover:bg-[#161616] dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Body */}
            {children ?? (
              <div className="space-y-2.5">
                {[
                  {
                    id: "alerts",
                    label: "Instant Build Alerts",
                    icon: <Bell className="h-3.5 w-3.5" />,
                    checked: instantAlerts,
                    onToggle: () => setInstantAlerts((v) => !v),
                  },
                  {
                    id: "strict",
                    label: "Strict Type Checking",
                    icon: <ShieldCheck className="h-3.5 w-3.5" />,
                    checked: strictTypes,
                    onToggle: () => setStrictTypes((v) => !v),
                  },
                  {
                    id: "compact",
                    label: "Compact Grid Density",
                    icon: <Sparkles className="h-3.5 w-3.5" />,
                    checked: compactMode,
                    onToggle: () => setCompactMode((v) => !v),
                  },
                ].map((setting) => (
                  <button
                    key={setting.id}
                    type="button"
                    role="switch"
                    aria-checked={setting.checked}
                    onClick={setting.onToggle}
                    className="flex w-full items-center justify-between rounded-xl border border-neutral-200/70 bg-neutral-50/60 px-3 py-2 text-left text-xs transition-colors hover:border-neutral-300 dark:border-[#1F1F1F] dark:bg-[#121212] dark:hover:border-neutral-700"
                  >
                    <span className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-200">
                      <span className="text-neutral-400">{setting.icon}</span>
                      {setting.label}
                    </span>
                    <span
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
                        setting.checked
                          ? "bg-black dark:bg-white"
                          : "bg-neutral-300 dark:bg-neutral-700"
                      )}
                    >
                      <motion.span
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 32,
                        }}
                        className={cn(
                          "h-4 w-4 rounded-full bg-white shadow-xs dark:bg-black",
                          setting.checked ? "ml-auto" : "ml-0"
                        )}
                      />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PopoverCard;
