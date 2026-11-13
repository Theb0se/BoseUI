/**
 * BoseUI Motion Presets — Framer Motion helper layer
 *
 * Re-exports all motion tokens from `src/lib/tokens.ts` and adds
 * higher-level helpers so components never hard-code spring values.
 *
 * Usage:
 *   import { spring, tween, stagger, variants, withSpring } from "@/lib/motion";
 */

export {
  spring,
  tween,
  stagger,
  variants,
  duration,
  ease,
} from "@/lib/tokens";

import { spring, tween, stagger } from "@/lib/tokens";
import type { Variants, Transition } from "framer-motion";

// ─────────────────────────────────────────────
// HIGHER-LEVEL HELPERS
// ─────────────────────────────────────────────

/**
 * Build a Framer Motion `transition` with spring + optional delay/stagger.
 *
 * @example
 * <motion.div transition={withSpring("snappy", { delay: 0.1 })} />
 */
export function withSpring(
  preset: keyof typeof spring = "default",
  overrides?: Partial<Transition>
): Transition {
  return { ...spring[preset], ...overrides };
}

/**
 * Build a tween transition.
 *
 * @example
 * <motion.div transition={withTween("smooth", { delay: 0.2 })} />
 */
export function withTween(
  preset: keyof typeof tween = "smooth",
  overrides?: Partial<Transition>
): Transition {
  return { ...tween[preset], ...overrides };
}

/**
 * Container variant that staggers its children.
 *
 * @example
 * <motion.ul variants={staggerContainer("fast", 0.1)} initial="hidden" animate="visible">
 */
export function staggerContainer(
  speed: keyof typeof stagger = "default",
  delayChildren = 0.05
): Variants {
  return {
    hidden:  {},
    visible: {
      transition: {
        staggerChildren: stagger[speed],
        delayChildren,
      },
    },
  };
}

/**
 * Fade-up child variant — pair with `staggerContainer`.
 */
export function fadeUpChild(springPreset: keyof typeof spring = "soft"): Variants {
  return {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { ...spring[springPreset] } },
  };
}

/**
 * Scale-in child variant — for cards/grid items.
 */
export function scaleInChild(springPreset: keyof typeof spring = "snappy"): Variants {
  return {
    hidden:  { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1,  transition: { ...spring[springPreset] } },
  };
}

/**
 * Hover / tap scale utility — standard micro-interaction.
 *
 * @example
 * <motion.button {...hoverScale()} />
 * <motion.button {...hoverScale(1.05, 0.96)} />
 */
export function hoverScale(hover = 1.03, tap = 0.97) {
  return {
    whileHover: { scale: hover },
    whileTap:   { scale: tap   },
    transition:  spring.snappy,
  };
}
