"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RollingNumberTickerProps {
  /** Target numeric value to display */
  value?: number;
  /** Currency symbol or prefix (e.g. "$", "€") */
  currency?: string;
  /** Decimal precision (default: 2) */
  decimalPlaces?: number;
  /** Font size scale variant */
  fontSize?: "sm" | "md" | "lg" | "xl";
  /** Spring physics stiffness (default: 260) */
  stiffness?: number;
  /** Spring physics damping (default: 26) */
  damping?: number;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface SingleDigitColumnProps {
  digit: number;
  itemHeight: number;
  stiffness: number;
  damping: number;
}

function SingleDigitColumn({
  digit,
  itemHeight,
  stiffness,
  damping,
}: SingleDigitColumnProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        height: itemHeight,
        overflow: "hidden",
        verticalAlign: "top",
      }}
      className="font-mono font-bold select-none"
    >
      <motion.div
        initial={false}
        animate={{ y: -digit * itemHeight }}
        transition={{ type: "spring", stiffness, damping, mass: 0.8 }}
        style={{ display: "block" }}
      >
        {DIGITS.map((d) => (
          <div
            key={d}
            style={{
              height: itemHeight,
              lineHeight: `${itemHeight}px`,
              textAlign: "center",
            }}
          >
            {d}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function RollingNumberTicker({
  value = 48932.18,
  currency = "$",
  decimalPlaces = 2,
  fontSize = "xl",
  stiffness = 260,
  damping = 26,
  className,
}: RollingNumberTickerProps) {
  const [lastDirection, setLastDirection] = useState<"up" | "down" | null>(null);
  const prevValRef = useRef(value);

  useEffect(() => {
    if (value === prevValRef.current) return;
    setLastDirection(value > prevValRef.current ? "up" : "down");
    prevValRef.current = value;

    const timer = setTimeout(() => setLastDirection(null), 900);
    return () => clearTimeout(timer);
  }, [value]);

  const formattedString = value.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  const chars = formattedString.split("");
  const itemHeight =
    fontSize === "sm" ? 36 : fontSize === "md" ? 44 : fontSize === "lg" ? 54 : 64;

  const fontClasses =
    fontSize === "sm"
      ? "text-xl sm:text-2xl"
      : fontSize === "md"
        ? "text-2xl sm:text-3xl"
        : fontSize === "lg"
          ? "text-3xl sm:text-4xl"
          : "text-3xl sm:text-5xl";

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative inline-flex flex-col items-center justify-center select-none",
        className
      )}
    >
      {/* Status indicator: fixed-height slot so the layout never jumps */}
      <div className="mb-2 flex h-4 items-center justify-center gap-1 text-xs font-medium">
        {lastDirection === "up" && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]"
          >
            <ArrowUpRight className="h-3 w-3" />
            <span>Increased</span>
          </motion.span>
        )}
        {lastDirection === "down" && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 text-rose-400 font-mono text-[11px]"
          >
            <ArrowDownRight className="h-3 w-3" />
            <span>Decreased</span>
          </motion.span>
        )}
      </div>

      {/* Odometer frame */}
      <div
        aria-label={`${currency}${formattedString}`}
        role="text"
        className="relative flex items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/90 px-6 py-3 shadow-2xl backdrop-blur-md"
      >
        {/* Shading masks */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 rounded-t-2xl bg-gradient-to-b from-neutral-900 via-neutral-900/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 rounded-b-2xl bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />

        {/* Currency prefix */}
        {currency && (
          <span
            aria-hidden
            style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}
            className={cn("mr-1.5 font-mono font-extrabold text-neutral-400", fontClasses)}
          >
            {currency}
          </span>
        )}

        {/* Rolling columns (keys count from the right so they stay stable) */}
        <div
          aria-hidden
          className={cn("flex items-center font-extrabold text-white", fontClasses)}
        >
          {chars.map((char, index) => {
            const fromRight = chars.length - index;
            const digit = parseInt(char, 10);

            if (isNaN(digit)) {
              return (
                <span
                  key={`static-${fromRight}`}
                  style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}
                  className="inline-flex items-center justify-center px-0.5 font-mono text-neutral-400"
                >
                  {char}
                </span>
              );
            }

            return (
              <SingleDigitColumn
                key={`col-${fromRight}`}
                digit={digit}
                itemHeight={itemHeight}
                stiffness={stiffness}
                damping={damping}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RollingNumberTicker;