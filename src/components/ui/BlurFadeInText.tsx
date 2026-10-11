"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BlurFadeInTextProps {
  /** The text string to animate */
  text?: string;
  /** Delay before animation begins (in seconds). Default: 0 */
  delay?: number;
  /** Stagger interval between words or characters (in seconds). Default: 0.05 */
  stagger?: number;
  /** Animate by word or by character. Default: "word" */
  by?: "word" | "character";
  /** Initial blur radius in pixels. Default: 10 */
  blurRadius?: number;
  /** Vertical drift distance in pixels. Default: 12 */
  yOffset?: number;
  /** Optional custom class name */
  className?: string;
}

export function BlurFadeInText({
  text = "Blur Fade In Text",
  delay = 0,
  stagger = 0.05,
  by = "word",
  blurRadius = 10,
  yOffset = 12,
  className,
}: BlurFadeInTextProps) {
  const reduceMotion = useReducedMotion();

  const safeText = text || "Blur Fade In Text";
  const tokens = by === "word" ? safeText.split(" ") : safeText.split("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      filter: reduceMotion ? "none" : `blur(${blurRadius}px)`,
      y: reduceMotion ? 0 : yOffset,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn("inline-flex flex-wrap items-baseline gap-x-[0.25em]", className)}
    >
      {tokens.map((token, index) => (
        <motion.span
          key={`${token}-${index}`}
          variants={itemVariants}
          className="inline-block will-change-[filter,opacity,transform]"
        >
          {token === " " ? "\u00A0" : token}
        </motion.span>
      ))}
    </motion.div>
  );
}
