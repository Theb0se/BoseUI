"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Command, CornerDownLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhysicalKeycapProps {
  /** Label on the keycap, e.g. "⌘", "K", "Shift", "Enter", "Esc" */
  keyLabel: string;
  /** Key code to match against window KeyboardEvent.key */
  matchKey?: string;
  /** Size variant. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Controlled active pressed state */
  isPressed?: boolean;
  /** Listen to actual window physical keydown/keyup events. Default: true */
  listenToKeyboard?: boolean;
  /** Click handler */
  onPress?: () => void;
  className?: string;
}

export function PhysicalKeycap({
  keyLabel,
  matchKey,
  size = "md",
  isPressed: controlledPressed,
  listenToKeyboard = true,
  onPress,
  className,
}: PhysicalKeycapProps) {
  const [internalPressed, setInternalPressed] = useState(false);
  const reduceMotion = useReducedMotion();

  const isPressed = controlledPressed !== undefined ? controlledPressed : internalPressed;

  // Key event normalization
  const targetKey = (matchKey || keyLabel).toLowerCase();

  useEffect(() => {
    if (!listenToKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKey = e.key.toLowerCase();
      // Support Meta/Command, Shift, Control, Alt, and characters
      const isMatch =
        pressedKey === targetKey ||
        (targetKey === "⌘" && (e.metaKey || pressedKey === "meta")) ||
        (targetKey === "cmd" && (e.metaKey || pressedKey === "meta")) ||
        (targetKey === "ctrl" && (e.ctrlKey || pressedKey === "control")) ||
        (targetKey === "shift" && (e.shiftKey || pressedKey === "shift")) ||
        (targetKey === "alt" && (e.altKey || pressedKey === "alt")) ||
        (targetKey === "enter" && pressedKey === "enter") ||
        (targetKey === "esc" && pressedKey === "escape");

      if (isMatch) {
        setInternalPressed(true);
        onPress?.();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const releasedKey = e.key.toLowerCase();
      const isMatch =
        releasedKey === targetKey ||
        (targetKey === "⌘" && !e.metaKey) ||
        (targetKey === "cmd" && !e.metaKey) ||
        (targetKey === "ctrl" && !e.ctrlKey) ||
        (targetKey === "shift" && !e.shiftKey) ||
        (targetKey === "alt" && !e.altKey) ||
        (targetKey === "enter" && releasedKey === "enter") ||
        (targetKey === "esc" && releasedKey === "escape");

      if (isMatch) {
        setInternalPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [listenToKeyboard, targetKey, onPress]);

  const sizeClasses = {
    sm: "min-w-[24px] h-[24px] px-1.5 text-[10px] rounded-[5px]",
    md: "min-w-[32px] h-[32px] px-2 text-xs rounded-[7px]",
    lg: "min-w-[42px] h-[42px] px-3 text-sm rounded-[9px]",
  };

  return (
    <motion.button
      type="button"
      onMouseDown={() => setInternalPressed(true)}
      onMouseUp={() => setInternalPressed(false)}
      onMouseLeave={() => setInternalPressed(false)}
      onClick={onPress}
      animate={{
        y: isPressed ? (reduceMotion ? 0 : 3) : 0,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 600, damping: 30 }
      }
      className={cn(
        "relative inline-flex items-center justify-center font-mono font-semibold select-none border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        // 3D tactile bevel base
        "bg-gradient-to-b from-white via-neutral-50 to-neutral-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950",
        "border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100",
        // 3D extrusion shadow (collapses when pressed)
        isPressed
          ? "shadow-[0_1px_0_0_rgba(0,0,0,0.2)] border-neutral-400 dark:border-neutral-600 bg-neutral-200/80 dark:bg-neutral-800/80 ring-1 ring-neutral-400/20"
          : "shadow-[0_4px_0_0_rgba(0,0,0,0.15)] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.6)]",
        sizeClasses[size],
        className
      )}
    >
      {/* Top inner chamfer light */}
      <span className="pointer-events-none absolute inset-x-1 top-[1px] h-[1px] bg-white/60 dark:bg-white/10 rounded-full" />
      <span className="relative z-10 flex items-center justify-center gap-1">
        {keyLabel}
      </span>
    </motion.button>
  );
}

export interface KeyboardShortcutStackProps {
  /** Array of key labels, e.g. ["⌘", "Shift", "K"] */
  keys: string[];
  /** Shortcut action title, e.g. "Quick Command Palette" */
  title?: string;
  /** Secondary action description */
  description?: string;
  /** Size variant for all keys. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Callback when the full shortcut combination is triggered */
  onTrigger?: () => void;
  className?: string;
}

export function KeyboardShortcutStack({
  keys = ["⌘", "K"],
  title = "Command Palette",
  description = "Press shortcut on keyboard to activate",
  size = "md",
  onTrigger,
  className,
}: KeyboardShortcutStackProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md p-4 shadow-sm text-neutral-900 dark:text-neutral-100",
        className
      )}
    >
      {/* Text Info */}
      <div className="flex flex-col min-w-0 pr-2">
        {title && (
          <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white truncate">
            {title}
          </span>
        )}
        {description && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {description}
          </span>
        )}
      </div>

      {/* 3D Keycap Stack */}
      <div className="flex items-center gap-1.5 shrink-0">
        {keys.map((k, idx) => (
          <React.Fragment key={idx}>
            <PhysicalKeycap keyLabel={k} size={size} onPress={onTrigger} />
            {idx < keys.length - 1 && (
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600 select-none px-0.5">
                +
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
