"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useId,
  useLayoutEffect,
  useEffect,
} from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { CircleCheck, Hand, Ban, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                 */
/* ------------------------------------------------------------------ */

export interface PermissionOption {
  value: string;
  label: string;
  icon?: LucideIcon | React.ComponentType<any>;
}

export interface PermissionSwitchProps {
  /** Array of options with value, label, and optional icon */
  options?: PermissionOption[];
  /** Controlled active value */
  value?: string;
  /** Default uncontrolled initial value */
  defaultValue?: string;
  /** Callback fired when selected value changes */
  onChange?: (value: string) => void;
  /** If true, expands active tab with a slower, luxurious cinematic spring */
  activeMotion?: boolean;
  /** Custom duration in ms when activeMotion is enabled. Default: 780 */
  slowDuration?: number;
  /** Custom default duration in ms. Default: 460 */
  duration?: number;
  /** Accessible label for the segmented radiogroup. Default: "Permission" */
  "aria-label"?: string;
  /** Additional container class names */
  className?: string;
}

export const DEFAULT_PERMISSION_OPTIONS: PermissionOption[] = [
  { value: "allow", label: "Always allow", icon: CircleCheck },
  { value: "ask", label: "Needs approval", icon: Hand },
  { value: "deny", label: "Deny", icon: Ban },
];

// Geometry layout constants (px)
const TRACK_PAD = 4;
const GAP = 2;
const ICON_SIZE = 20;
const CELL_PAD = 8;
const LABEL_GAP = 8;
const LABEL_TAIL = 4;

const DEFAULT_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const SLOW_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * PermissionSwitch
 * A tactile segmented control where the active option smoothly expands
 * to reveal its label while inactive options collapse to icon-only.
 * Built with Tailwind CSS and Framer Motion for kinetic, fluid interactions.
 */
export function PermissionSwitch({
  options = DEFAULT_PERMISSION_OPTIONS,
  value,
  defaultValue,
  onChange,
  activeMotion,
  slowDuration = 780,
  duration = 460,
  "aria-label": ariaLabel = "Permission",
  className,
}: PermissionSwitchProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const isSlow = Boolean(activeMotion);
  const activeDuration = isSlow ? slowDuration : duration;
  const activeEase = isSlow ? SLOW_EASE : DEFAULT_EASE;

  const isControlled = value !== undefined;
  const [inner, setInner] = useState(
    defaultValue ?? options[0]?.value ?? "allow"
  );
  const current = isControlled ? value : inner;

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === current)
  );

  const [labelWidths, setLabelWidths] = useState<number[]>(() =>
    options.map(() => 0)
  );
  const [ready, setReady] = useState(false);

  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  // Measure natural label widths for exact pixel animations
  const measure = useCallback(() => {
    const next = options.map(
      (_, i) =>
        Math.ceil(
          measureRefs.current[i]?.getBoundingClientRect().width ?? 0
        ) + 1
    );
    setLabelWidths((prev) =>
      prev.length === next.length &&
        prev.every((w, i) => Math.abs(w - next[i]) < 0.5)
        ? prev
        : next
    );
  }, [options]);

  useIsomorphicLayoutEffect(() => {
    measure();
    const id = requestAnimationFrame(() => setReady(true));
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const baseWidth = ICON_SIZE + CELL_PAD * 2; // 36px
  const widths = options.map((_, i) =>
    i === activeIndex
      ? baseWidth + LABEL_GAP + (labelWidths[i] || 0) + LABEL_TAIL
      : baseWidth
  );

  const pillLeft =
    TRACK_PAD +
    widths.slice(0, activeIndex).reduce((acc, w) => acc + w + GAP, 0);

  const totalWidth =
    TRACK_PAD * 2 +
    widths.reduce((acc, w) => acc + w, 0) +
    GAP * Math.max(0, options.length - 1);

  const select = (i: number) => {
    const opt = options[i];
    if (!opt) return;
    if (!isControlled) setInner(opt.value);
    onChange?.(opt.value);
    btnRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1;
    let nextIndex: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = activeIndex === last ? 0 : activeIndex + 1;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = activeIndex === 0 ? last : activeIndex - 1;
    }
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = last;

    if (nextIndex !== null) {
      e.preventDefault();
      select(nextIndex);
    }
  };

  const mainTransition: Transition =
    shouldReduceMotion || !ready
      ? { duration: 0 }
      : {
        duration: activeDuration / 1000,
        ease: activeEase,
      };

  const labelTransition = (isActive: boolean): Transition => {
    if (shouldReduceMotion || !ready) return { duration: 0 };
    return {
      duration: isSlow ? 0.38 : 0.22,
      delay: isActive ? (isSlow ? 0.16 : 0.08) : 0,
      ease: activeEase,
    };
  };

  return (
    <>
      {/* Hidden container for accurate text width measurement */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-50 invisible flex select-none overflow-hidden opacity-0"
      >
        {options.map((opt, i) => (
          <span
            key={opt.value}
            ref={(el) => {
              measureRefs.current[i] = el;
            }}
            className="whitespace-nowrap text-sm font-medium tracking-tight"
          >
            {opt.label}
          </span>
        ))}
      </div>

      <motion.div
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        initial={false}
        animate={{
          width: ready && totalWidth > 0 ? totalWidth : "auto",
        }}
        transition={mainTransition}
        className={cn(
          "relative inline-flex items-center gap-0.5 rounded-full p-1 select-none",
          "bg-neutral-200/70 dark:bg-neutral-800/80",
          "border border-neutral-300/40 dark:border-neutral-700/50",
          className
        )}
      >
        {/* Sliding background pill indicator */}
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{
            x: pillLeft,
            width: widths[activeIndex] || baseWidth,
          }}
          transition={mainTransition}
          className="pointer-events-none absolute top-1 left-0 h-9 rounded-full bg-white shadow-sm shadow-neutral-950/10 dark:bg-neutral-700 dark:shadow-neutral-950/40"
        />

        {options.map((opt, i) => {
          const Icon = opt.icon;
          const active = i === activeIndex;

          return (
            <motion.button
              key={opt.value}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              id={`${uid}-${opt.value}`}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={opt.label}
              tabIndex={active ? 0 : -1}
              onClick={() => select(i)}
              initial={false}
              animate={{
                width: widths[i] || baseWidth,
              }}
              transition={mainTransition}
              className={cn(
                "group relative z-10 flex h-9 shrink-0 cursor-pointer items-center overflow-hidden rounded-full px-2 text-sm font-medium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-neutral-900",
                "transition-colors duration-200",
                active
                  ? "text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              )}
            >
              {Icon && (
                <Icon
                  className="h-5 w-5 shrink-0 transition-colors duration-200"
                  strokeWidth={1.75}
                />
              )}

              <motion.span
                aria-hidden={!active}
                initial={false}
                animate={{
                  opacity: active ? 1 : 0,
                  filter: active ? "blur(0px)" : "blur(4px)",
                  x: active ? 0 : -6,
                }}
                transition={labelTransition(active)}
                className={cn(
                  "pointer-events-none whitespace-nowrap text-sm font-medium tracking-tight",
                  Icon ? "ml-2" : "ml-0"
                )}
              >
                {opt.label}
              </motion.span>
            </motion.button>
          );
        })}
      </motion.div>
    </>
  );
}

export default PermissionSwitch;
