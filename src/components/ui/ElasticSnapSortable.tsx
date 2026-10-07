"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SortableTaskItem {
  id: string;
  title: string;
  tag: string;
}

export interface ElasticSnapSortableProps {
  /** Initial array of sortable items. */
  items?: SortableTaskItem[];
  /** Spring stiffness coefficient for layout reordering. Default: 380 */
  stiffness?: number;
  /** Spring damping coefficient for layout reordering. Default: 26 */
  damping?: number;
  /** Callback fired when item order changes */
  onReorder?: (items: SortableTaskItem[]) => void;
  className?: string;
}

const DEFAULT_ITEMS: SortableTaskItem[] = [
  { id: "task-1", title: "GPU Radial Mask Compositor", tag: "P0" },
  { id: "task-2", title: "Hooke's Law Velocity Solver", tag: "P1" },
  { id: "task-3", title: "Shadcn v2 Registry Manifests", tag: "P2" },
  { id: "task-4", title: "WAI-ARIA Reduced Motion Audit", tag: "P3" },
];

export function ElasticSnapSortable({
  items: initialItems = DEFAULT_ITEMS,
  stiffness = 380,
  damping = 26,
  onReorder,
  className,
}: ElasticSnapSortableProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [list, setList] = useState<SortableTaskItem[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const next = [...list];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved!);
    setList(next);
    setActiveId(moved!.id);
    onReorder?.(next);
  };

  return (
    <div
      role="list"
      aria-label="Sortable priority queue"
      className={cn(
        "flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      <div className="mb-1 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
        <span>Priority Queue</span>
        <span className="font-mono">Click arrows or use ↑/↓ keys</span>
      </div>

      {list.map((item, idx) => {
        const isActive = activeId === item.id;

        return (
          <motion.div
            key={item.id}
            layout
            role="listitem"
            tabIndex={0}
            aria-label={`${item.title}, priority ${item.tag}, position ${idx + 1} of ${list.length}. Use Up and Down arrow keys to reorder.`}
            onFocus={() => setActiveId(item.id)}
            onBlur={() => setActiveId(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                moveItem(idx, -1);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                moveItem(idx, 1);
              }
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness, damping }
            }
            className={cn(
              "group flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
              isActive
                ? "border-black bg-neutral-50 shadow-sm dark:border-white dark:bg-[#141414]"
                : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-[#222222] dark:bg-[#0D0D0D] dark:hover:border-[#383838]"
            )}
          >
            <div className="flex items-center gap-2.5">
              <GripVertical
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-neutral-400"
              />
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-black dark:bg-[#1E1E1E] dark:text-white">
                {item.tag}
              </span>
              <span className="text-xs font-semibold text-black dark:text-white">
                {item.title}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                tabIndex={-1}
                disabled={idx === 0}
                aria-label={`Move ${item.title} up`}
                onClick={() => moveItem(idx, -1)}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition-colors hover:border-black hover:text-black disabled:opacity-25 dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                tabIndex={-1}
                disabled={idx === list.length - 1}
                aria-label={`Move ${item.title} down`}
                onClick={() => moveItem(idx, 1)}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition-colors hover:border-black hover:text-black disabled:opacity-25 dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ElasticSnapSortable;
