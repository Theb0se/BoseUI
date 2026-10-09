"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Shuffle,
  Coins,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RollingNumberTickerProps {
  value?: number;
  currency?: string;
  decimalPlaces?: number;
  fontSize?: "sm" | "md" | "lg" | "xl";
  stiffness?: number;
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
      style={{ height: itemHeight }}
      className="relative overflow-hidden inline-flex items-center justify-center font-mono font-bold select-none"
    >
      <motion.div
        animate={{ y: -digit * itemHeight }}
        transition={{
          type: "spring",
          stiffness,
          damping,
          mass: 0.8,
        }}
        className="flex flex-col items-center"
      >
        {DIGITS.map((d) => (
          <div
            key={d}
            style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}
            className="flex items-center justify-center"
          >
            {d}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function RollingNumberTicker({
  value: initialValue = 48932.18,
  currency: initialCurrency = "$",
  decimalPlaces = 2,
  stiffness = 260,
  damping = 26,
  className,
}: RollingNumberTickerProps) {
  const [val, setVal] = useState<number>(initialValue);
  const [currency, setCurrency] = useState<string>(initialCurrency);
  const [springStiffness, setSpringStiffness] = useState<number>(stiffness);
  const [springDamping, setSpringDamping] = useState<number>(damping);
  const [lastDirection, setLastDirection] = useState<"up" | "down" | null>(null);

  const prevValRef = useRef(val);

  useEffect(() => {
    if (val > prevValRef.current) {
      setLastDirection("up");
    } else if (val < prevValRef.current) {
      setLastDirection("down");
    }
    prevValRef.current = val;

    const timer = setTimeout(() => {
      setLastDirection(null);
    }, 900);
    return () => clearTimeout(timer);
  }, [val]);

  // Format value to string with commas and fixed decimals
  const formattedString = val.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  const chars = formattedString.split("");
  const itemHeight = 64; // height of each digit row in px

  const adjustValue = (delta: number) => {
    setVal((prev) => Math.max(0, +(prev + delta).toFixed(decimalPlaces)));
  };

  const PRESETS = [
    { label: "$1,250.40", value: 1250.4 },
    { label: "$48,932.18", value: 48932.18 },
    { label: "$125,480.00", value: 125480.0 },
    { label: "$1,000,000.00", value: 1000000.0 },
  ];

  const CURRENCIES = ["$", "€", "£", "¥", "₿"];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-xl dark:border-neutral-800 flex flex-col justify-between items-center",
        className
      )}
    >
      {/* Background radial glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full blur-[100px] transition-colors duration-700 opacity-20",
          lastDirection === "up"
            ? "bg-emerald-500"
            : lastDirection === "down"
            ? "bg-rose-500"
            : "bg-indigo-500"
        )}
      />

      {/* Top Header */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-neutral-400" />
          <span className="font-semibold text-sm text-neutral-200">
            Rolling Number Ticker
          </span>
          <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
            Odometer Spring Physics
          </span>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900/90 p-1">
          {CURRENCIES.map((cur) => (
            <button
              key={cur}
              type="button"
              onClick={() => setCurrency(cur)}
              className={cn(
                "h-7 w-7 rounded-lg text-xs font-mono font-semibold transition-all",
                currency === cur
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {cur}
            </button>
          ))}
        </div>
      </div>

      {/* Center Ticker Stage */}
      <div className="relative my-10 flex flex-col items-center">
        {/* Status Pill Indicator */}
        <div className="mb-4 flex items-center gap-1.5 text-xs font-medium">
          {lastDirection === "up" && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1 text-emerald-400"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Yield Increased</span>
            </motion.span>
          )}
          {lastDirection === "down" && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1 text-rose-400"
            >
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>Balance Decreased</span>
            </motion.span>
          )}
          {!lastDirection && (
            <span className="text-neutral-500 font-mono">
              Wise / Robinhood Style Odometric Drum
            </span>
          )}
        </div>

        {/* Cylinder Odometer Frame */}
        <div className="relative flex items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/80 px-8 py-4 shadow-2xl backdrop-blur-md">
          {/* Top and Bottom Cylinder Shading Masks */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-neutral-900 via-neutral-900/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent z-10" />

          {/* Currency Prefix */}
          <span
            style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}
            className="mr-2 font-mono text-3xl sm:text-5xl font-extrabold text-neutral-400"
          >
            {currency}
          </span>

          {/* Rolling Columns */}
          <div className="flex items-center text-3xl sm:text-5xl font-extrabold text-white">
            {chars.map((char, index) => {
              const digit = parseInt(char, 10);
              const isDigit = !isNaN(digit);

              if (!isDigit) {
                return (
                  <span
                    key={`static-${index}`}
                    style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}
                    className="inline-flex items-center justify-center font-mono text-neutral-400 px-0.5"
                  >
                    {char}
                  </span>
                );
              }

              return (
                <SingleDigitColumn
                  key={`col-${index}`}
                  digit={digit}
                  itemHeight={itemHeight}
                  stiffness={springStiffness}
                  damping={springDamping}
                />
              );
            })}
          </div>
        </div>

        {/* Fast presets */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setVal(p.value)}
              className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-mono text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 transition-colors"
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const rand = Math.floor(Math.random() * 950000) + 1200 + Math.random();
              setVal(+rand.toFixed(decimalPlaces));
            }}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-mono text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 transition-colors"
          >
            <Shuffle className="h-3 w-3" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
        {/* Quick Stepper Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-neutral-500 font-mono mr-1">Step:</span>
          <button
            type="button"
            onClick={() => adjustValue(-1000)}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono font-medium text-rose-400 hover:bg-neutral-800 transition-colors"
          >
            -1k
          </button>
          <button
            type="button"
            onClick={() => adjustValue(-50)}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono font-medium text-rose-400 hover:bg-neutral-800 transition-colors"
          >
            -50
          </button>
          <button
            type="button"
            onClick={() => adjustValue(10)}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono font-medium text-emerald-400 hover:bg-neutral-800 transition-colors"
          >
            +10
          </button>
          <button
            type="button"
            onClick={() => adjustValue(100)}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono font-medium text-emerald-400 hover:bg-neutral-800 transition-colors"
          >
            +100
          </button>
          <button
            type="button"
            onClick={() => adjustValue(1000)}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono font-medium text-emerald-400 hover:bg-neutral-800 transition-colors"
          >
            +1k
          </button>
          <button
            type="button"
            onClick={() => adjustValue(10000)}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-mono font-medium text-emerald-400 hover:bg-neutral-800 transition-colors"
          >
            +10k
          </button>
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-mono">Amount:</span>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
            className="w-32 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs font-mono text-neutral-200 focus:border-neutral-700 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default RollingNumberTicker;
