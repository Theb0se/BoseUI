"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Info,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CronScheduleBuilderProps {
  /** Initial standard 5-segment cron string (e.g. "0 0 * * 1-5") */
  initialCron?: string;
  /** Callback when cron expression changes */
  onChange?: (cron: string, humanDescription: string) => void;
  className?: string;
}

interface CronPreset {
  label: string;
  cron: string;
  description: string;
}

const PRESETS: CronPreset[] = [
  { label: "Every 15 mins", cron: "*/15 * * * *", description: "Every 15 minutes" },
  { label: "Hourly", cron: "0 * * * *", description: "At minute 0 of every hour" },
  { label: "Daily Midnight", cron: "0 0 * * *", description: "At 00:00 every day" },
  { label: "Weekdays 9 AM", cron: "0 9 * * 1-5", description: "At 09:00 on Monday through Friday" },
  { label: "Weekly Sunday", cron: "0 0 * * 0", description: "At 00:00 on Sunday" },
  { label: "Monthly 1st", cron: "0 0 1 * *", description: "At 00:00 on day 1 of every month" },
];

function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron format (must have 5 fields)";

  const [min, hour, dom, mon, dow] = parts;

  if (min === "*/15" && hour === "*") return "Runs every 15 minutes";
  if (min === "0" && hour === "*" && dom === "*" && mon === "*" && dow === "*") return "Runs every hour at :00";
  if (min === "0" && hour === "0" && dom === "*" && mon === "*" && dow === "*") return "Runs daily at 00:00 UTC";
  if (dow === "1-5") return `Runs at ${hour.padStart(2, "0")}:${min.padStart(2, "0")} Monday through Friday`;
  if (dow === "0") return `Runs at ${hour.padStart(2, "0")}:${min.padStart(2, "0")} every Sunday`;
  if (dom === "1") return `Runs at ${hour.padStart(2, "0")}:${min.padStart(2, "0")} on the 1st of every month`;

  return `Runs at ${hour === "*" ? "every hour" : `${hour}h`}:${min === "*" ? "every minute" : `${min}m`} (Day ${dom}, Mo ${mon}, Dow ${dow})`;
}

export function CronScheduleBuilder({
  initialCron = "0 9 * * 1-5",
  onChange,
  className,
}: CronScheduleBuilderProps) {
  const [cron, setCron] = useState(initialCron);
  const [copied, setCopied] = useState(false);

  const parts = cron.trim().split(/\s+/);
  const minute = parts[0] || "*";
  const hour = parts[1] || "*";
  const dayOfMonth = parts[2] || "*";
  const month = parts[3] || "*";
  const dayOfWeek = parts[4] || "*";

  const updateField = (index: number, val: string) => {
    const current = [...(cron.trim().split(/\s+/) || ["*", "*", "*", "*", "*"])];
    while (current.length < 5) current.push("*");
    current[index] = val || "*";
    const nextCron = current.join(" ");
    setCron(nextCron);
    onChange?.(nextCron, describeCron(nextCron));
  };

  const handleApplyPreset = (preset: CronPreset) => {
    setCron(preset.cron);
    onChange?.(preset.cron, preset.description);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(cron);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock upcoming 3 execution dates
  const nextRuns = [
    "Today at 09:00:00 UTC",
    "Tomorrow at 09:00:00 UTC",
    "In 2 days at 09:00:00 UTC",
  ];

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Header & Copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-neutral-900 dark:text-white" />
            <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
              Cron Schedule Builder
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure recurrent jobs and view human-readable dispatch times.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/80 dark:text-neutral-200 transition-all active:scale-95"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{cron}</span>
        </button>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mr-1">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => handleApplyPreset(p)}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-lg border transition-all",
              cron === p.cron
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs"
                : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 5 Field Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Minute", val: minute, hint: "0-59, *, */15", idx: 0 },
          { label: "Hour", val: hour, hint: "0-23, *, */2", idx: 1 },
          { label: "Day (Month)", val: dayOfMonth, hint: "1-31, *", idx: 2 },
          { label: "Month", val: month, hint: "1-12, *", idx: 3 },
          { label: "Day (Week)", val: dayOfWeek, hint: "0-6, 1-5, *", idx: 4 },
        ].map((field) => (
          <div key={field.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {field.label}
            </span>
            <input
              type="text"
              value={field.val}
              onChange={(e) => updateField(field.idx, e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-center text-sm font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 shadow-xs"
              placeholder="*"
            />
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center font-mono">
              {field.hint}
            </span>
          </div>
        ))}
      </div>

      {/* Human Readable Box */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-neutral-900 dark:text-white shrink-0" />
          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
            {describeCron(cron)}
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 shrink-0">
          UTC Timezone
        </span>
      </div>

      {/* Upcoming Runs */}
      <div className="flex flex-col gap-2 pt-1 border-t border-neutral-200 dark:border-neutral-800">
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> Next scheduled triggers
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {nextRuns.map((run, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] text-neutral-800 dark:text-neutral-200">{run}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
