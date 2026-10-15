"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusService {
  name: string;
  uptime: number; // e.g. 99.98
  history: ("operational" | "degraded" | "down")[]; // 90 or 45 days
}

export interface HealthCheckStatusMatrixProps {
  /** Organization or system name */
  systemName?: string;
  /** Overall SLA percentage */
  overallUptime?: number;
  /** Services list */
  services?: StatusService[];
  className?: string;
}

const DEFAULT_HISTORY = (degradedIdx?: number, downIdx?: number): ("operational" | "degraded" | "down")[] => {
  return Array.from({ length: 45 }, (_, i) => {
    if (i === downIdx) return "down";
    if (i === degradedIdx) return "degraded";
    return "operational";
  });
};

const DEFAULT_SERVICES: StatusService[] = [
  {
    name: "Global Edge API Gateway",
    uptime: 99.99,
    history: DEFAULT_HISTORY(14),
  },
  {
    name: "Serverless Database Clusters",
    uptime: 99.95,
    history: DEFAULT_HISTORY(28, 12),
  },
  {
    name: "Authentication & OAuth Services",
    uptime: 100.0,
    history: DEFAULT_HISTORY(),
  },
  {
    name: "CDN & Static Asset Delivery",
    uptime: 99.98,
    history: DEFAULT_HISTORY(3),
  },
];

export function HealthCheckStatusMatrix({
  systemName = "BoseUI Cloud Platform",
  overallUptime = 99.98,
  services = DEFAULT_SERVICES,
  className,
}: HealthCheckStatusMatrixProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    service: string;
    dayIndex: number;
    status: "operational" | "degraded" | "down";
  } | null>(null);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">
              {systemName} Status
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Operational telemetry &amp; 45-day rolling SLA uptime matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {overallUptime}% Uptime
          </span>
        </div>
      </div>

      {/* Services List */}
      <div className="flex flex-col gap-4">
        {services.map((svc) => (
          <div key={svc.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-900 dark:text-white">{svc.name}</span>
              <span className="font-mono text-neutral-500 dark:text-neutral-400 font-medium">
                {svc.uptime.toFixed(2)}%
              </span>
            </div>

            {/* Segmented day strip */}
            <div className="flex items-center gap-1 w-full">
              {svc.history.map((status, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() =>
                    setHoveredDay({ service: svc.name, dayIndex: idx, status })
                  }
                  onMouseLeave={() => setHoveredDay(null)}
                  className={cn(
                    "flex-1 h-7 rounded-sm transition-all hover:scale-110 hover:z-10 cursor-pointer relative",
                    status === "operational" && "bg-emerald-500/80 hover:bg-emerald-400",
                    status === "degraded" && "bg-amber-500 hover:bg-amber-400",
                    status === "down" && "bg-rose-500 hover:bg-rose-400"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hover Tooltip Info Banner */}
      <div className="min-h-[38px] flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
        {hoveredDay ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {hoveredDay.status === "operational" && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              )}
              {hoveredDay.status === "degraded" && (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              )}
              {hoveredDay.status === "down" && (
                <XCircle className="h-3.5 w-3.5 text-rose-500" />
              )}
              <span className="font-semibold text-neutral-900 dark:text-white">
                {hoveredDay.service} — {45 - hoveredDay.dayIndex} days ago
              </span>
            </div>
            <span
              className={cn(
                "capitalize font-bold text-[11px]",
                hoveredDay.status === "operational" && "text-emerald-500",
                hoveredDay.status === "degraded" && "text-amber-500",
                hoveredDay.status === "down" && "text-rose-500"
              )}
            >
              {hoveredDay.status === "operational" ? "100% Operational" : `${hoveredDay.status} incident reported`}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-neutral-500 dark:text-neutral-400 text-[11px]">
            <span>45 days ago</span>
            <span>Hover any day bar for incident telemetry</span>
            <span>Today</span>
          </div>
        )}
      </div>
    </div>
  );
}
