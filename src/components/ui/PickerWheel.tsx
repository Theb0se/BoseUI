"use client";

import React, { useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PickerColumn {
  id: string;
  label?: string;
  options: string[];
  defaultIndex?: number;
}

export interface PickerWheelProps {
  /** Columns rendered side-by-side inside the drum wheel */
  columns?: PickerColumn[];
  /** Callback fired whenever any column selection changes */
  onChange?: (selectedValues: Record<string, string>) => void;
  /** Title shown in the header bar */
  title?: string;
  className?: string;
}

const DEFAULT_COLUMNS: PickerColumn[] = [
  {
    id: "day",
    options: [
      "Mon, Oct 5",
      "Tue, Oct 6",
      "Wed, Oct 7",
      "Today",
      "Fri, Oct 9",
      "Sat, Oct 10",
      "Sun, Oct 11",
    ],
    defaultIndex: 3,
  },
  {
    id: "hour",
    options: ["07", "08", "09", "10", "11", "12", "01", "02", "03"],
    defaultIndex: 2,
  },
  {
    id: "minute",
    options: ["00", "15", "30", "45"],
    defaultIndex: 2,
  },
  {
    id: "period",
    options: ["AM", "PM"],
    defaultIndex: 0,
  },
];

const ITEM_HEIGHT = 36;

export function PickerWheel({
  columns = DEFAULT_COLUMNS,
  onChange,
  title = "Schedule Deployment",
  className,
}: PickerWheelProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const [selectedIndices, setSelectedIndices] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      columns.forEach((col) => {
        initial[col.id] = col.defaultIndex ?? 0;
      });
      return initial;
    }
  );

  const selectOption = (colId: string, nextIdx: number, maxLen: number) => {
    const clamped = Math.max(0, Math.min(maxLen - 1, nextIdx));
    setSelectedIndices((prev) => {
      const next = { ...prev, [colId]: clamped };
      if (onChange) {
        const result: Record<string, string> = {};
        columns.forEach((c) => {
          result[c.id] = c.options[next[c.id] ?? 0] ?? "";
        });
        onChange(result);
      }
      return next;
    });
  };

  const formattedSummary = columns
    .map((col) => col.options[selectedIndices[col.id] ?? 0])
    .join(" · ");

  return (
    <div
      className={cn(
        "w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Top Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-950 dark:text-white">
          <Clock className="h-3.5 w-3.5 text-neutral-400" />
          {title}
        </span>
        <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-mono text-[11px] font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          {formattedSummary}
        </span>
      </div>

      {/* Drum Wheel Container */}
      <div className="relative flex h-[180px] select-none items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/60 px-3 dark:border-neutral-800/80 dark:bg-[#111111]">
        {/* Top & Bottom Fade Masks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-14 bg-gradient-to-b from-neutral-50 via-neutral-50/80 to-transparent dark:from-[#111111] dark:via-[#111111]/80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent dark:from-[#111111] dark:via-[#111111]/80"
        />

        {/* Center Highlight Selection Bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2.5 top-1/2 z-10 h-9 -translate-y-1/2 rounded-xl border border-neutral-300/80 bg-white/90 shadow-2xs dark:border-neutral-700/80 dark:bg-neutral-900/90"
        />

        {/* Columns */}
        <div className="relative z-20 flex w-full items-center justify-around">
          {columns.map((col) => {
            const activeIdx = selectedIndices[col.id] ?? 0;
            const offsetY = (2 - activeIdx) * ITEM_HEIGHT;

            return (
              <div
                key={col.id}
                role="listbox"
                tabIndex={0}
                aria-label={col.label ?? col.id}
                onWheel={(e) => {
                  e.preventDefault();
                  const delta = e.deltaY > 0 ? 1 : -1;
                  selectOption(col.id, activeIdx + delta, col.options.length);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    selectOption(col.id, activeIdx + 1, col.options.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    selectOption(col.id, activeIdx - 1, col.options.length);
                  }
                }}
                className="relative h-[180px] flex-1 overflow-hidden focus-visible:outline-none"
              >
                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(
                    _: MouseEvent | TouchEvent | PointerEvent,
                    info: PanInfo
                  ) => {
                    const stepsMoved = Math.round(
                      -info.offset.y / (ITEM_HEIGHT * 0.75)
                    );
                    if (stepsMoved !== 0) {
                      selectOption(
                        col.id,
                        activeIdx + stepsMoved,
                        col.options.length
                      );
                    }
                  }}
                  animate={{ y: offsetY }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                  className="cursor-grab active:cursor-grabbing"
                >
                  {col.options.map((opt, idx) => {
                    const distance = idx - activeIdx;
                    const absDist = Math.abs(distance);
                    const isSelected = distance === 0;

                    return (
                      <button
                        key={opt}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() =>
                          selectOption(col.id, idx, col.options.length)
                        }
                        style={{
                          height: ITEM_HEIGHT,
                          transform: shouldReduceMotion
                            ? undefined
                            : `perspective(300px) rotateX(${distance * -18}deg) scale(${Math.max(0.82, 1 - absDist * 0.08)})`,
                        }}
                        className={cn(
                          "flex w-full items-center justify-center px-1 text-center font-mono text-xs transition-opacity",
                          isSelected
                            ? "font-bold text-neutral-950 opacity-100 dark:text-white"
                            : absDist === 1
                              ? "font-medium text-neutral-500 opacity-70 dark:text-neutral-400"
                              : "text-neutral-400 opacity-35 dark:text-neutral-600"
                        )}
                      >
                        <span className="truncate">{opt}</span>
                      </button>
                    );
                  })}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-2.5 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
        Scroll wheel, drag vertically, or click any row to snap
      </p>
    </div>
  );
}

export default PickerWheel;
