"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Terminal, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CipherScrambleTextProps {
  /** Target decoded text string. Default: "ZERO-DEPENDENCY KINETIC PRIMITIVES" */
  text?: string;
  /** Pool of cipher characters used during scramble permutation. */
  charset?: string;
  /** Duration of each scramble frame tick in milliseconds. Default: 28 */
  frameInterval?: number;
  /** Number of scramble cycles per character before locking in. Default: 2 */
  cyclesPerChar?: number;
  className?: string;
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+<>?";

export function CipherScrambleText({
  text = "ZERO-DEPENDENCY KINETIC PRIMITIVES",
  charset = DEFAULT_CHARSET,
  frameInterval = 28,
  cyclesPerChar = 2,
  className,
}: CipherScrambleTextProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [displayed, setDisplayed] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopScramble = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsScrambling(false);
  }, []);

  const triggerScramble = useCallback(() => {
    if (shouldReduceMotion) {
      setDisplayed(text);
      return;
    }

    stopScramble();
    setIsScrambling(true);

    let step = 0;
    const totalSteps = text.length * cyclesPerChar;

    timerRef.current = setInterval(() => {
      step += 1;
      const lockedCount = Math.floor(step / cyclesPerChar);

      const nextStr = text
        .split("")
        .map((char, idx) => {
          if (char === " ") return " ";
          if (idx < lockedCount) return char;
          const randomIndex = Math.floor(Math.random() * charset.length);
          return charset[randomIndex] || char;
        })
        .join("");

      setDisplayed(nextStr);

      if (step >= totalSteps) {
        setDisplayed(text);
        stopScramble();
      }
    }, frameInterval);
  }, [text, charset, frameInterval, cyclesPerChar, shouldReduceMotion, stopScramble]);

  useEffect(() => {
    setDisplayed(text);
    return () => stopScramble();
  }, [text, stopScramble]);

  return (
    <motion.button
      type="button"
      onClick={triggerScramble}
      onMouseEnter={triggerScramble}
      onFocus={triggerScramble}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      className={cn(
        "group relative inline-flex w-full max-w-lg flex-col items-start justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-6 text-left transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-white dark:focus-visible:ring-white",
        className
      )}
    >
      {/* Screen-reader stable text */}
      <span className="sr-only">{text}</span>

      <div className="flex w-full items-center justify-between text-[11px] font-medium uppercase tracking-widest text-neutral-400">
        <span className="inline-flex items-center gap-1.5 font-mono">
          <Terminal className="h-3.5 w-3.5 text-black dark:text-white" />
          {isScrambling ? "DECODING_STREAM..." : "CIPHER_LOCKED"}
        </span>
        <RefreshCw
          aria-hidden="true"
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            isScrambling && "rotate-180 text-black dark:text-white"
          )}
        />
      </div>

      <div
        aria-hidden="true"
        className="font-mono text-base font-bold tracking-tight text-black sm:text-lg dark:text-white"
      >
        {displayed}
      </div>

      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
        Hover, focus, or click to trigger cryptographic glyph wave
      </div>
    </motion.button>
  );
}

export default CipherScrambleText;
