"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RippleBurstButtonProps {
  /** Button label text. Default: "Emit Shockwave Pulse" */
  label?: string;
  /** Spring stiffness coefficient for tactile press compression. Default: 400 */
  stiffness?: number;
  /** Spring damping coefficient for tactile press compression. Default: 22 */
  damping?: number;
  /** Click callback */
  onClick?: () => void;
  className?: string;
}

interface RippleWave {
  id: number;
  x: number;
  y: number;
}

export function RippleBurstButton({
  label = "Emit Shockwave Pulse",
  stiffness = 400,
  damping = 22,
  onClick,
  className,
}: RippleBurstButtonProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [waves, setWaves] = useState<RippleWave[]>([]);
  const [pulseCount, setPulseCount] = useState(0);

  const handleTrigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (el && !shouldReduceMotion) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
      const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
      const id = Date.now() + Math.random();
      setWaves((prev) => [...prev.slice(-3), { id, x, y }]);
    }
    setPulseCount((c) => c + 1);
    onClick?.();
  };

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={handleTrigger}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness, damping }}
      className={cn(
        "relative inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-black bg-black px-6 text-xs font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:border-white dark:bg-white dark:text-black dark:focus-visible:ring-white",
        className
      )}
    >
      {/* Concentric Dual Shockwave Rings */}
      {!shouldReduceMotion &&
        waves.map((wave) => (
          <React.Fragment key={wave.id}>
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0, opacity: 0.65 }}
              animate={{ scale: 4.5, opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              style={{ left: wave.x - 24, top: wave.y - 24 }}
              className="pointer-events-none absolute h-12 w-12 rounded-full bg-white/35 dark:bg-black/25"
            />
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: "easeOut" }}
              style={{ left: wave.x - 24, top: wave.y - 24 }}
              className="pointer-events-none absolute h-12 w-12 rounded-full border border-white/60 dark:border-black/50"
            />
          </React.Fragment>
        ))}

      <Zap className="relative z-10 h-4 w-4" />
      <span className="relative z-10">{label}</span>
      {pulseCount > 0 && (
        <span className="relative z-10 rounded-full bg-white/20 px-1.5 py-0.5 font-mono text-[10px] dark:bg-black/15">
          ×{pulseCount}
        </span>
      )}
    </motion.button>
  );
}

export default RippleBurstButton;
