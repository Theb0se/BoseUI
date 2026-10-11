"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export type WarpDirection = "forward" | "left" | "right" | "up" | "down";
export type WarpTrigger = "mount" | "viewport" | "hover" | "manual";
export type WarpSplit = "character" | "word" | "line";

export interface WarpTextProps {
  /** The text string to animate through warp speed */
  text?: string;
  /** Direction of the warp acceleration. Default: "forward" */
  direction?: WarpDirection;
  /** Speed multiplier for acceleration. Default: 1 */
  speed?: number;
  /** Base duration of the warp sequence in seconds. Default: 1.1 */
  duration?: number;
  /** Delay before animation starts in seconds. Default: 0 */
  delay?: number;
  /** Whether to apply directional motion blur. Default: true */
  blur?: boolean;
  /** Whether to render photonic bloom and glow highlights. Default: true */
  glow?: boolean;
  /** Whether to render velocity motion trail echoes. Default: true */
  trail?: boolean;
  /** Whether to repeat the animation continuously in a loop. Default: false */
  loop?: boolean;
  /** Animation trigger condition. Default: "mount" */
  trigger?: WarpTrigger;
  /** How the text is partitioned for animation stagger. Default: "character" */
  split?: WarpSplit;
  /** Optional custom glow accent color. Defaults to futuristic cyan/blue */
  glowColor?: string;
  /** Custom CSS classes for the container */
  className?: string;
  /** Whether to render the full interactive showcase demo playground. Default: false */
  demoMode?: boolean;
  /** Callback fired when the warp sequence finishes */
  onAnimationComplete?: () => void;
}

export function WarpText({
  text = "WARP SPEED",
  direction = "forward",
  speed = 1,
  duration = 1.1,
  delay = 0,
  blur = true,
  glow = true,
  trail = true,
  loop = false,
  trigger = "mount",
  split = "character",
  glowColor = "rgba(56, 189, 248, 0.75)",
  className,
  demoMode = false,
  onAnimationComplete,
}: WarpTextProps) {
  if (demoMode) {
    return <WarpTextDemo className={className} />;
  }

  const shouldReduceMotion = useReducedMotion() ?? false;
  const [animationKey, setAnimationKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Compute calculated duration based on speed
  const actualDuration = Math.max(0.3, duration / Math.max(0.2, speed));
  const staggerDuration = (0.025 / Math.max(0.5, speed));

  const triggerAnimation = useCallback(() => {
    setAnimationKey((prev) => prev + 1);
  }, []);

  // Split text into tokens based on chosen granularity
  const tokens = useMemo(() => {
    if (!text) return [];

    if (split === "line") {
      return text.split("\n").map((line, idx) => ({
        id: `line-${idx}`,
        content: line,
        isSpace: false,
      }));
    }

    if (split === "word") {
      return text.split(" ").map((word, idx) => ({
        id: `word-${idx}`,
        content: word,
        isSpace: false,
      }));
    }

    // Default: Character split with preserved word boundaries
    const words = text.split(" ");
    const charList: Array<{ id: string; content: string; isSpace: boolean }> = [];

    words.forEach((word, wIdx) => {
      const chars = word.split("");
      chars.forEach((char, cIdx) => {
        charList.push({
          id: `char-${wIdx}-${cIdx}`,
          content: char,
          isSpace: false,
        });
      });

      if (wIdx < words.length - 1) {
        charList.push({
          id: `space-${wIdx}`,
          content: "\u00A0",
          isSpace: true,
        });
      }
    });

    return charList;
  }, [text, split]);

  // Motion variants based on direction and physics
  const getVariants = (): {
    container: Variants;
    item: Variants;
    trail1: Variants;
    trail2: Variants;
  } => {
    if (shouldReduceMotion) {
      return {
        container: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: actualDuration, delay },
          },
        },
        item: {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        },
        trail1: { hidden: { opacity: 0 }, visible: { opacity: 0 } },
        trail2: { hidden: { opacity: 0 }, visible: { opacity: 0 } },
      };
    }

    // Directional offsets and stretches
    let initialX = 0;
    let initialY = 0;
    let initialScale = 1;
    let initialScaleX = 1;
    let initialScaleY = 1;
    let blurValue = blur ? "16px" : "0px";

    switch (direction) {
      case "left":
        initialX = 160;
        initialScaleX = 2.4;
        initialScaleY = 0.85;
        break;
      case "right":
        initialX = -160;
        initialScaleX = 2.4;
        initialScaleY = 0.85;
        break;
      case "up":
        initialY = 120;
        initialScaleY = 2.2;
        initialScaleX = 0.9;
        break;
      case "down":
        initialY = -120;
        initialScaleY = 2.2;
        initialScaleX = 0.9;
        break;
      case "forward":
      default:
        initialScale = 0.12;
        blurValue = blur ? "24px" : "0px";
        break;
    }

    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDuration,
          delayChildren: delay,
        },
      },
    };

    const itemVariants: Variants = {
      hidden: {
        opacity: 0,
        x: initialX,
        y: initialY,
        scale: initialScale,
        scaleX: initialScaleX,
        scaleY: initialScaleY,
        filter: `blur(${blurValue})`,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        filter: "blur(0px)",
        transition: {
          duration: actualDuration,
          ease: [0.16, 1, 0.3, 1], // Cinematic rapid decel curve
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 1.6 : 0,
          repeatType: "loop",
        },
      },
    };

    const trail1Variants: Variants = {
      hidden: {
        opacity: 0,
        x: initialX * 1.35,
        y: initialY * 1.35,
        scale: initialScale * 1.25,
        scaleX: initialScaleX * 1.2,
        scaleY: initialScaleY * 1.2,
        filter: blur ? "blur(18px)" : "blur(0px)",
      },
      visible: {
        opacity: [0, 0.45, 0],
        x: 0,
        y: 0,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        filter: "blur(0px)",
        transition: {
          duration: actualDuration * 0.85,
          ease: "easeOut",
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 1.6 : 0,
        },
      },
    };

    const trail2Variants: Variants = {
      hidden: {
        opacity: 0,
        x: initialX * 1.7,
        y: initialY * 1.7,
        scale: initialScale * 1.5,
        scaleX: initialScaleX * 1.4,
        scaleY: initialScaleY * 1.4,
        filter: blur ? "blur(26px)" : "blur(0px)",
      },
      visible: {
        opacity: [0, 0.25, 0],
        x: 0,
        y: 0,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        filter: "blur(0px)",
        transition: {
          duration: actualDuration * 0.95,
          ease: "easeOut",
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 1.6 : 0,
        },
      },
    };

    return {
      container: containerVariants,
      item: itemVariants,
      trail1: trail1Variants,
      trail2: trail2Variants,
    };
  };

  const { container, item, trail1, trail2 } = getVariants();

  // Handle hover trigger
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (trigger === "hover") {
      triggerAnimation();
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none font-bold tracking-tight",
        trigger === "hover" && "cursor-pointer",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      style={
        glow
          ? ({
              textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor.replace(/[\d.]+\)$/, "0.35)")}`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Screen reader full accessibility string */}
      <span className="sr-only">{text}</span>

      {/* Primary Animated Tokens */}
      <motion.div
        key={animationKey}
        variants={container}
        initial="hidden"
        animate={trigger === "viewport" ? undefined : "visible"}
        whileInView={trigger === "viewport" ? "visible" : undefined}
        viewport={trigger === "viewport" ? { once: !loop } : undefined}
        onAnimationComplete={onAnimationComplete}
        aria-hidden="true"
        className="flex flex-wrap items-center justify-center leading-none"
      >
        {tokens.map((token) => (
          <span
            key={token.id}
            className={cn(
              "relative inline-block",
              split === "word" && "mr-[0.28em] last:mr-0"
            )}
          >
            {/* Trailing photonic echoes */}
            {trail && !shouldReduceMotion && (
              <>
                <motion.span
                  variants={trail1}
                  className="pointer-events-none absolute inset-0 text-cyan-400/60 dark:text-cyan-300/70 select-none mix-blend-screen"
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  {token.content}
                </motion.span>
                <motion.span
                  variants={trail2}
                  className="pointer-events-none absolute inset-0 text-violet-400/40 dark:text-violet-300/50 select-none mix-blend-screen"
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  {token.content}
                </motion.span>
              </>
            )}

            {/* Main Token */}
            <motion.span
              variants={item}
              className="inline-block transform-gpu"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {token.content}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Interactive Demo Playground for documentation and registry previews.
 */
export function WarpTextDemo({ className = "" }: { className?: string }) {
  const [preset, setPreset] = useState<"entrance" | "hyperspace" | "loop" | "minimal">("hyperspace");
  const [direction, setDirection] = useState<WarpDirection>("forward");
  const [speed, setSpeed] = useState(1.2);
  const [blur, setBlur] = useState(true);
  const [glow, setGlow] = useState(true);
  const [trail, setTrail] = useState(true);
  const [loop, setLoop] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);

  // Apply preset configurations
  useEffect(() => {
    switch (preset) {
      case "entrance":
        setDirection("forward");
        setSpeed(1.4);
        setBlur(true);
        setGlow(true);
        setTrail(true);
        setLoop(false);
        break;
      case "hyperspace":
        setDirection("forward");
        setSpeed(1.8);
        setBlur(true);
        setGlow(true);
        setTrail(true);
        setLoop(false);
        break;
      case "loop":
        setDirection("forward");
        setSpeed(1.3);
        setBlur(true);
        setGlow(true);
        setTrail(true);
        setLoop(true);
        break;
      case "minimal":
        setDirection("left");
        setSpeed(1.1);
        setBlur(false);
        setGlow(false);
        setTrail(false);
        setLoop(false);
        break;
    }
  }, [preset]);

  return (
    <div className={cn("flex w-full flex-col items-center gap-8 py-6", className)}>
      {/* Preset Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-neutral-200/80 bg-neutral-100/70 p-1 dark:border-neutral-800 dark:bg-neutral-900/60">
        {[
          { id: "entrance", label: "Warp Entrance" },
          { id: "hyperspace", label: "Hyperspace" },
          { id: "loop", label: "Velocity Loop" },
          { id: "minimal", label: "Minimal Warp" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setPreset(tab.id as any);
              setTriggerCount((c) => c + 1);
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              preset === tab.id
                ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-800 dark:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cinematic Preview Stage */}
      <div className="relative flex min-h-[220px] w-full max-w-2xl items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 px-6 py-12 text-white shadow-xl dark:border-neutral-800">
        {/* Hyperspace Radial Background Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.12)_0%,transparent_65%)]" />

        <WarpText
          key={`${preset}-${triggerCount}`}
          text={
            preset === "hyperspace"
              ? "HYPERSPACE DRIVE"
              : preset === "loop"
              ? "VELOCITY PULSE"
              : preset === "minimal"
              ? "KINETIC TEXT"
              : "WARP SPEED"
          }
          direction={direction}
          speed={speed}
          blur={blur}
          glow={glow}
          trail={trail}
          loop={loop}
          trigger="mount"
          className="text-3xl font-extrabold tracking-tighter text-white sm:text-5xl md:text-6xl"
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setTriggerCount((c) => c + 1)}
          className="rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          Re-engage Warp ⚡
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/70 px-3 py-1.5 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
          <span>Direction:</span>
          {(["forward", "left", "right", "up", "down"] as WarpDirection[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDirection(d);
                setTriggerCount((c) => c + 1);
              }}
              className={cn(
                "capitalize transition-colors",
                direction === d
                  ? "font-bold text-neutral-950 dark:text-white underline underline-offset-4"
                  : "hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
