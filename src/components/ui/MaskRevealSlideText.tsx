"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MaskRevealSlideTextProps {
  /** Array of lines or paragraphs to reveal */
  lines?: string[];
  /** Stagger delay between lines in seconds. Default: 0.12 */
  stagger?: number;
  /** Initial delay before animation starts in seconds. Default: 0 */
  delay?: number;
  /** Optional custom class name */
  className?: string;
}

export function MaskRevealSlideText({
  lines = [
    "Design with intention.",
    "Engineered with kinetic physics.",
    "Shipped for modern developers.",
  ],
  stagger = 0.12,
  delay = 0,
  className,
}: MaskRevealSlideTextProps) {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: delay,
      },
    },
  };

  const lineVariants = {
    hidden: {
      y: reduceMotion ? 0 : "110%",
      opacity: reduceMotion ? 0 : 1,
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Apple/editorial deceleration
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn("flex flex-col gap-1.5", className)}
    >
      {lines.map((line, idx) => (
        <div key={idx} className="overflow-hidden">
          <motion.div
            variants={lineVariants}
            className="will-change-transform"
          >
            {line}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}
