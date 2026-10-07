"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpringPendulumProps {
  /** Length of the pendulum rod in pixels. Default: 110 */
  rodLength?: number;
  /** Initial kick angle in degrees when impulse button is pressed. Default: 42 */
  impulseAngle?: number;
  /** Hooke's Law spring stiffness coefficient. Default: 140 */
  stiffness?: number;
  /** Spring damping coefficient (lower values oscillate longer). Default: 6 */
  damping?: number;
  className?: string;
}

export function SpringPendulum({
  rodLength = 110,
  impulseAngle = 42,
  stiffness = 140,
  damping = 6,
  className,
}: SpringPendulumProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [lastPeak, setLastPeak] = useState<number>(impulseAngle);

  const rawAngle = useMotionValue(0);
  const springAngle = useSpring(rawAngle, {
    stiffness,
    damping,
    mass: 0.9,
  });

  const angularVelocity = useVelocity(springAngle);
  const bobScale = useTransform(
    angularVelocity,
    [-400, 0, 400],
    [1.12, 1, 1.12]
  );

  const applyImpulse = (angle: number) => {
    if (shouldReduceMotion) return;
    setLastPeak(Math.abs(angle));
    rawAngle.set(angle);
    setTimeout(() => {
      rawAngle.set(0);
    }, 90);
  };

  return (
    <div
      className={cn(
        "relative flex min-h-[250px] w-full max-w-sm select-none flex-col items-center justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Top Telemetry Bar */}
      <div className="flex w-full items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-black dark:text-white">
          <Activity className="h-3.5 w-3.5" />
          HARMONIC_PENDULUM
        </span>
        <span className="font-mono text-[10px] text-neutral-400">
          θ₀ = ±{lastPeak}° • ζ = {damping}
        </span>
      </div>

      {/* Pivot Mount & Swinging Arm */}
      <div className="relative my-2 flex h-[145px] w-full flex-col items-center">
        {/* Protractor Arc Guide */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 h-28 w-56 rounded-b-full border-b border-dashed border-neutral-200 dark:border-[#222222]"
        />

        {/* Ceiling Pivot Pin */}
        <div
          aria-hidden="true"
          className="z-20 h-3 w-3 rounded-full border-2 border-black bg-white dark:border-white dark:bg-[#0A0A0A]"
        />

        {/* Rotating Rod + Bob */}
        <motion.div
          style={{
            rotate: shouldReduceMotion ? 0 : springAngle,
            transformOrigin: "top center",
          }}
          className="relative -mt-1.5 flex flex-col items-center"
        >
          {/* Tether Rod */}
          <div
            style={{ height: rodLength }}
            className="w-[2px] bg-neutral-300 dark:bg-neutral-700"
          />

          {/* Kinetic Bob */}
          <motion.button
            type="button"
            aria-label="Pull and release pendulum bob"
            onClick={() => applyImpulse(impulseAngle)}
            style={{ scale: shouldReduceMotion ? 1 : bobScale }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            className=" -mt-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-black font-mono text-[10px] font-bold text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:border-white dark:bg-white dark:text-black dark:focus-visible:ring-white"
          >
            m
          </motion.button>
        </motion.div>
      </div>

      {/* Impulse Controls */}
      <div className="flex w-full items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => applyImpulse(-impulseAngle)}
          className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:border-black dark:border-[#262626] dark:bg-[#141414] dark:text-white dark:hover:border-white"
        >
          <Zap className="h-3 w-3" />
          Kick Left (-{impulseAngle}°)
        </button>
        <button
          type="button"
          onClick={() => applyImpulse(impulseAngle)}
          className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:border-black dark:border-[#262626] dark:bg-[#141414] dark:text-white dark:hover:border-white"
        >
          <Zap className="h-3 w-3" />
          Kick Right (+{impulseAngle}°)
        </button>
      </div>
    </div>
  );
}

export default SpringPendulum;
