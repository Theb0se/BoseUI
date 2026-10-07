"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpringPinInputProps {
  /** Number of OTP verification digits. Default: 6 */
  length?: number;
  /** Initial digits string for preview convenience. Default: "482" */
  defaultValue?: string;
  /** Spring stiffness coefficient for keystroke slot bounce. Default: 420 */
  stiffness?: number;
  /** Spring damping coefficient for keystroke slot bounce. Default: 22 */
  damping?: number;
  /** Callback fired when all digits are filled */
  onComplete?: (code: string) => void;
  className?: string;
}

export function SpringPinInput({
  length = 6,
  defaultValue = "482",
  stiffness = 420,
  damping = 22,
  onComplete,
  className,
}: SpringPinInputProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = Array.from({ length }, (_, i) => defaultValue[i] || "");
    return arr;
  });
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [shakeCount, setShakeCount] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isComplete = digits.every((d) => d !== "");

  const updateDigit = (index: number, char: string) => {
    if (!/^[0-9]?$/.test(char)) {
      setShakeCount((c) => c + 1);
      return;
    }

    const next = [...digits];
    next[index] = char;
    setDigits(next);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "")) {
      onComplete?.(next.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        updateDigit(index, "");
      } else if (index > 0) {
        updateDigit(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) {
      setShakeCount((c) => c + 1);
      return;
    }
    const next = Array.from({ length }, (_, i) => pasted[i] || "");
    setDigits(next);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
    if (next.every((d) => d !== "")) {
      onComplete?.(next.join(""));
    }
  };

  const resetPin = () => {
    setDigits(Array.from({ length }, () => ""));
    inputRefs.current[0]?.focus();
  };

  return (
    <motion.div
      key={shakeCount}
      animate={
        shakeCount > 0 && !shouldReduceMotion
          ? { x: [0, -8, 8, -5, 5, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.32 }}
      className={cn(
        "inline-flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      <div className="flex w-full items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold text-black dark:text-white">
          <ShieldCheck className="h-4 w-4" />
          <span>{isComplete ? "Code Verified" : "Verification Code"}</span>
        </span>
        <button
          type="button"
          onClick={resetPin}
          aria-label="Clear verification digits"
          className="inline-flex items-center gap-1 text-[11px] text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Clear
        </button>
      </div>

      <div
        role="group"
        aria-label="One-time verification code digits"
        className="flex items-center gap-2"
      >
        {digits.map((digit, idx) => {
          const isFocused = focusedIndex === idx;
          const isFilled = digit !== "";

          return (
            <motion.div
              key={idx}
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: isComplete ? [0, -6, 0] : isFilled ? -2 : 0,
                      scale: isFocused ? 1.07 : isFilled ? 1.02 : 1,
                    }
              }
              transition={{
                type: "spring",
                stiffness,
                damping,
                delay: isComplete ? idx * 0.035 : 0,
              }}
              className="relative"
            >
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                aria-label={`Digit ${idx + 1} of ${length}`}
                onFocus={(e) => {
                  setFocusedIndex(idx);
                  e.target.select();
                }}
                onBlur={() => setFocusedIndex(null)}
                onChange={(e) => updateDigit(idx, e.target.value.slice(-1))}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={cn(
                  "h-12 w-10 rounded-xl border text-center font-mono text-base font-bold transition-colors focus:outline-none",
                  isFocused
                    ? "border-black bg-white text-black ring-2 ring-black/15 dark:border-white dark:bg-[#121212] dark:text-white dark:ring-white/15"
                    : isFilled
                      ? "border-neutral-400 bg-neutral-50 text-black dark:border-[#383838] dark:bg-[#141414] dark:text-white"
                      : "border-neutral-200 bg-white text-neutral-400 dark:border-[#222222] dark:bg-[#0D0D0D]"
                )}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
        Type digits, paste code, or press non-numeric key to test shake
      </div>
    </motion.div>
  );
}

export default SpringPinInput;
