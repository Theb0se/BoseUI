"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TypewriterCursorEffectProps {
  /** Array of phrases to rotate through, or single string */
  words?: string[];
  /** Typing speed per character (ms). Default: 80 */
  typeSpeed?: number;
  /** Backspacing speed per character (ms). Default: 40 */
  deleteSpeed?: number;
  /** Delay before backspacing (ms). Default: 1800 */
  delayBetween?: number;
  /** Blinking cursor character. Default: "|" */
  cursorChar?: string;
  /** Optional custom class name */
  className?: string;
}

export function TypewriterCursorEffect({
  words = ["modern interfaces", "fluid animations", "tactile experiences"],
  typeSpeed = 80,
  deleteSpeed = 40,
  delayBetween = 1800,
  cursorChar = "|",
  className,
}: TypewriterCursorEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (words.length === 0) return;
    if (reduceMotion) {
      setCurrentText(words[0]);
      return;
    }

    const targetWord = words[currentWordIndex % words.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < targetWord.length) {
        timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length + 1));
        }, typeSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetween);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    currentWordIndex,
    words,
    typeSpeed,
    deleteSpeed,
    delayBetween,
    reduceMotion,
  ]);

  return (
    <span
      className={cn(
        "inline-flex items-baseline",
        className
      )}
    >
      <span>{currentText}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-0.5 select-none font-bold text-neutral-900 dark:text-neutral-100"
      >
        {cursorChar}
      </motion.span>
    </span>
  );
}
