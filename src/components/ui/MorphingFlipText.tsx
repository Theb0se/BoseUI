"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MorphingFlipTextProps {
  /** Array of words/phrases to cycle through */
  words?: string[];
  /** Duration each word stays visible (in ms). Default: 2400 */
  interval?: number;
  /** Direction of rotation: "vertical" (3D rotateX) or "horizontal" (3D rotateY). Default: "vertical" */
  direction?: "vertical" | "horizontal";
  /** Optional custom class name */
  className?: string;
}

export function MorphingFlipText({
  words = ["Fast", "Fluid", "Tactile", "Production-Ready"],
  interval = 2400,
  direction = "vertical",
  className,
}: MorphingFlipTextProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (words.length <= 1 || reduceMotion) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval, reduceMotion]);

  const currentWord = words[index % words.length];

  const isVertical = direction === "vertical";

  return (
    <span
      className={cn(
        "relative inline-flex items-center overflow-hidden [perspective:800px]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : isVertical
              ? { opacity: 0, y: 16, rotateX: -70 }
              : { opacity: 0, x: 16, rotateY: -70 }
          }
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
            rotateX: 0,
            rotateY: 0,
          }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : isVertical
              ? { opacity: 0, y: -16, rotateX: 70 }
              : { opacity: 0, x: -16, rotateY: 70 }
          }
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 24,
            mass: 0.8,
          }}
          className="inline-block transform-gpu font-bold"
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
