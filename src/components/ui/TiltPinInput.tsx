"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TiltPinInputProps {
  /** Number of digits in the PIN. Default: 4 */
  length?: number;
  /** Callback fired when all digits are entered */
  onComplete?: (pin: string) => void;
  /** Callback fired on every keystroke */
  onChange?: (pin: string) => void;
  /** Whether the input is currently in an error state */
  hasError?: boolean;
  /** Whether digits are masked (e.g. for sensitive PINs). Default: false */
  masked?: boolean;
  /** Optional custom class name */
  className?: string;
}

export function TiltPinInput({
  length = 4,
  onComplete,
  onChange,
  hasError = false,
  masked = false,
  className,
}: TiltPinInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  const handleChange = (val: string, idx: number) => {
    // Only accept numeric inputs
    const char = val.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[idx] = char || "";
    setDigits(newDigits);

    const fullPin = newDigits.join("");
    onChange?.(fullPin);

    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "") && newDigits.length === length) {
      onComplete?.(fullPin);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasteData) return;

    const newDigits = Array(length).fill("");
    pasteData.split("").forEach((c, i) => {
      newDigits[i] = c;
    });
    setDigits(newDigits);

    const fullPin = newDigits.join("");
    onChange?.(fullPin);

    const nextIndex = Math.min(pasteData.length, length - 1);
    inputsRef.current[nextIndex]?.focus();

    if (pasteData.length === length) {
      onComplete?.(fullPin);
    }
  };

  return (
    <motion.div
      animate={
        hasError && !reduceMotion
          ? {
              x: [-8, 8, -6, 6, -3, 3, 0],
              transition: { duration: 0.4 },
            }
          : {}
      }
      className={cn("flex items-center gap-3", className)}
    >
      {Array.from({ length }).map((_, idx) => {
        const isFilled = Boolean(digits[idx]);
        const isFocused = focusedIndex === idx;

        return (
          <motion.div
            key={idx}
            animate={
              reduceMotion
                ? {}
                : {
                    scale: isFocused ? 1.08 : isFilled ? 1.02 : 1,
                    y: isFocused ? -3 : 0,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 24,
            }}
            className={cn(
              "relative flex h-14 w-12 items-center justify-center rounded-xl border-2 bg-white text-xl font-bold shadow-sm transition-colors dark:bg-neutral-900",
              hasError
                ? "border-rose-500 text-rose-600 dark:border-rose-500 dark:text-rose-400"
                : isFocused
                ? "border-black text-black ring-2 ring-black/10 dark:border-white dark:text-white dark:ring-white/10"
                : isFilled
                ? "border-neutral-400 text-black dark:border-neutral-600 dark:text-white"
                : "border-neutral-200 text-neutral-400 dark:border-neutral-800"
            )}
          >
            <input
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digits[idx]}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onFocus={() => setFocusedIndex(idx)}
              onBlur={() => setFocusedIndex(null)}
              onPaste={handlePaste}
              aria-label={`Digit ${idx + 1} of ${length}`}
              className="h-full w-full bg-transparent text-center font-mono focus:outline-none"
            />
            {masked && isFilled && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono">
                •
              </span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
