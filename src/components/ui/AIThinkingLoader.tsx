"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AIThinkingLoaderProps {
  /** Visual variant. Default: "dots" */
  variant?: "dots" | "wave" | "ring" | "pulse";
  /** Orb/icon size in px. Default: 8 */
  size?: number;
  /** Optional visible status text shown next to the indicator */
  text?: string;
  /** Extra class name */
  className?: string;
  /** Accessible label. Default: "AI is thinking…" */
  label?: string;
}

export function AIThinkingLoader({
  variant = "dots",
  size = 8,
  text,
  className,
  label = "AI is thinking…",
}: AIThinkingLoaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-2 text-foreground/80", className)}
    >
      {variant === "ring" && (
        <span className="relative inline-flex items-center justify-center">
          <motion.span
            className="block rounded-full border-2 border-foreground/15 border-t-foreground"
            style={{ width: size * 2.5, height: size * 2.5 }}
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
          />
        </span>
      )}

      {variant === "pulse" && (
        <span className="relative flex items-center justify-center" style={{ width: size * 2, height: size * 2 }}>
          {!reduceMotion && (
            <motion.span
              className="absolute inset-0 rounded-full bg-foreground/20"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <span
            className="rounded-full bg-foreground"
            style={{ width: size, height: size }}
          />
        </span>
      )}

      {(variant === "dots" || variant === "wave") && (
        <span className="inline-flex items-center gap-1.5 py-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block rounded-full bg-foreground"
              style={{ width: size, height: size }}
              animate={
                reduceMotion
                  ? {}
                  : variant === "wave"
                    ? {
                        y: [0, -size * 0.9, 0],
                        opacity: [0.4, 1, 0.4],
                      }
                    : {
                        scale: [0.85, 1.35, 0.85],
                        opacity: [0.35, 1, 0.35],
                      }
              }
              transition={{
                duration: 0.75,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.14,
              }}
            />
          ))}
        </span>
      )}

      {text && (
        <span className="text-xs font-mono font-medium tracking-tight text-foreground/60">
          {text}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
}
