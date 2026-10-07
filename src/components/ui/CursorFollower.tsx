"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface CursorFollowerProps {
  children: React.ReactNode;
  className?: string;
  /** Custom accent color override for the cursor ring and dot */
  accentColor?: string;
  /** Spring stiffness for the outer trailing ring. Default: 260 */
  ringStiffness?: number;
  /** Spring damping for the outer trailing ring. Default: 22 */
  ringDamping?: number;
  /** Size of the outer ring in pixels when idle. Default: 34 */
  ringSize?: number;
  /** Show coordinate HUD readout in corner of stage. Default: true */
  showCoordinates?: boolean;
}

export function CursorFollower({
  children,
  className,
  accentColor,
  ringStiffness = 260,
  ringDamping = 22,
  ringSize = 34,
  showCoordinates = true,
}: CursorFollowerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isInside, setIsInside] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const dotX = useSpring(rawX, { stiffness: 750, damping: 35, mass: 0.1 });
  const dotY = useSpring(rawY, { stiffness: 750, damping: 35, mass: 0.1 });

  const ringX = useSpring(rawX, {
    stiffness: ringStiffness,
    damping: ringDamping,
    mass: 0.35,
  });
  const ringY = useSpring(rawY, {
    stiffness: ringStiffness,
    damping: ringDamping,
    mass: 0.35,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    rawX.set(x);
    rawY.set(y);
    setCoords({ x, y });

    const target = e.target as HTMLElement | null;
    const labeledEl = target?.closest(
      "[data-cursor-label]"
    ) as HTMLElement | null;
    if (labeledEl) {
      setActiveLabel(labeledEl.getAttribute("data-cursor-label"));
    } else {
      setActiveLabel(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => {
        setIsInside(false);
        setIsPressed(false);
        setActiveLabel(null);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 select-none dark:border-[#222222] dark:bg-black",
        isInside && !shouldReduceMotion && "cursor-none",
        className
      )}
    >
      {showCoordinates && (
        <div className="pointer-events-none absolute right-3.5 top-3.5 z-20 flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[10px] text-neutral-500 dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-neutral-400">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              isInside
                ? "bg-black dark:bg-white"
                : "bg-neutral-300 dark:bg-neutral-700"
            )}
            style={
              isInside && accentColor
                ? { backgroundColor: accentColor }
                : undefined
            }
          />
          <span>
            X:{coords.x.toString().padStart(3, "0")} Y:
            {coords.y.toString().padStart(3, "0")}
          </span>
        </div>
      )}

      <div className="relative z-10">{children}</div>

      {!shouldReduceMotion && (
        <AnimatePresence>
          {isInside && (
            <>
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: activeLabel ? 0 : 1,
                  scale: isPressed ? 0.7 : 1,
                }}
                exit={{ opacity: 0, scale: 0 }}
                style={{
                  x: dotX,
                  y: dotY,
                  translateX: "-50%",
                  translateY: "-50%",
                  ...(accentColor ? { backgroundColor: accentColor } : {}),
                }}
                className="pointer-events-none absolute left-0 top-0 z-30 h-2 w-2 rounded-full bg-black dark:bg-white"
              />

              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{
                  opacity: 1,
                  scale: isPressed ? 0.88 : 1,
                  width: activeLabel ? "auto" : ringSize,
                  height: activeLabel ? 30 : ringSize,
                }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{
                  width: { type: "spring", stiffness: 380, damping: 28 },
                  height: { type: "spring", stiffness: 380, damping: 28 },
                }}
                style={{
                  x: ringX,
                  y: ringY,
                  translateX: "-50%",
                  translateY: "-50%",
                  ...(accentColor ? { borderColor: accentColor } : {}),
                }}
                className={cn(
                  "pointer-events-none absolute left-0 top-0 z-30 flex items-center justify-center rounded-full border border-black transition-colors duration-150 dark:border-white",
                  activeLabel
                    ? "bg-black px-3 text-white shadow-lg dark:bg-white dark:text-black"
                    : "bg-black/5 backdrop-blur-sm dark:bg-white/10"
                )}
              >
                {activeLabel && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="whitespace-nowrap font-mono text-[10px] font-semibold tracking-wider text-white dark:text-black"
                  >
                    {activeLabel}
                  </motion.span>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
