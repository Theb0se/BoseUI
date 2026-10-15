"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Lock,
  Globe,
  Radio,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatabaseConnectionHealthBadgeProps {
  /** Database engine & version */
  engine?: string;
  /** Primary cluster name */
  clusterName?: string;
  /** Cloud region, e.g. "eu-central-1 (Frankfurt)" */
  region?: string;
  /** Active / max connection pool */
  activeConnections?: number;
  maxPoolSize?: number;
  /** Base round-trip latency in ms */
  baseLatencyMs?: number;
  /** Connection string */
  connectionString?: string;
  className?: string;
}

export function DatabaseConnectionHealthBadge({
  engine = "PostgreSQL 16.4",
  clusterName = "neon-edge-primary-01",
  region = "eu-central-1 (Frankfurt)",
  activeConnections = 7,
  maxPoolSize = 25,
  baseLatencyMs = 14,
  connectionString = "postgresql://cluster_admin:••••••••@eu-central-1.boseui.db/production",
  className,
}: DatabaseConnectionHealthBadgeProps) {
  const [latency, setLatency] = useState(baseLatencyMs);
  const [isPinging, setIsPinging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connections, setConnections] = useState(activeConnections);

  const poolPercentage = Math.round((connections / maxPoolSize) * 100);

  const handleTestPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setLatency(Math.floor(Math.random() * 12) + 9);
      setConnections((prev) => Math.min(maxPoolSize, Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1))));
      setIsPinging(false);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(connectionString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">{clusterName}</h3>
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{engine}</p>
          </div>
        </div>

        <button
          onClick={handleTestPing}
          disabled={isPinging}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 disabled:opacity-50 shadow-xs"
        >
          <RotateCcw className={cn("h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300", isPinging && "animate-spin")} />
          <span>{isPinging ? "Pinging..." : "Test Ping"}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Latency */}
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Round-Trip Latency</span>
            <Radio className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">{latency}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">ms</span>
          </div>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">{region}</span>
        </div>

        {/* Connection Pool */}
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Connection Pool</span>
            <Layers className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">{connections}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">/ {maxPoolSize} pooled</span>
          </div>
          {/* Micro Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden mt-1">
            <div
              className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all"
              style={{ width: `${poolPercentage}%` }}
            />
          </div>
        </div>

        {/* Security & SSL */}
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Transport Security</span>
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              TLS 1.3 Active
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Mutual TLS &amp; VPC Isolated</span>
        </div>
      </div>

      {/* Connection URI Sanitized */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">
        <span className="truncate text-neutral-600 dark:text-neutral-400 select-all">{connectionString}</span>
        <button
          onClick={handleCopy}
          title="Copy connection string"
          className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors shrink-0 font-sans text-xs px-2 py-0.5 rounded"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy URI"}</span>
        </button>
      </div>
    </div>
  );
}
