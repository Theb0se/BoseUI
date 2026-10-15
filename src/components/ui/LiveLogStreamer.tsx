"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Play,
  Pause,
  Trash2,
  Search,
  ArrowDownCircle,
  Copy,
  Check,
  Filter,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

export interface LiveLogStreamerProps {
  /** Initial logs list */
  initialLogs?: LogEntry[];
  /** Service name in header */
  serviceName?: string;
  /** Max logs to retain in buffer */
  maxBuffer?: number;
  className?: string;
}

const DEFAULT_LOGS: LogEntry[] = [
  {
    id: "l-1",
    timestamp: "14:32:01.102",
    level: "INFO",
    source: "worker.runtime",
    message: "HTTP GET /api/v1/auth/session - 200 OK (22ms)",
  },
  {
    id: "l-2",
    timestamp: "14:32:01.480",
    level: "DEBUG",
    source: "db.pool",
    message: "Releasing acquired client connection #12 to pool",
  },
  {
    id: "l-3",
    timestamp: "14:32:02.015",
    level: "WARN",
    source: "redis.cache",
    message: "Cache miss for key 'sess_usr_94b'. Fetching from primary store.",
  },
  {
    id: "l-4",
    timestamp: "14:32:02.890",
    level: "INFO",
    source: "stripe.webhook",
    message: "Webhook event 'customer.subscription.updated' processed successfully",
  },
  {
    id: "l-5",
    timestamp: "14:32:03.420",
    level: "ERROR",
    source: "dns.resolver",
    message: "ETIMEDOUT connecting to upstream analytics-collector:53",
  },
];

const STREAM_SAMPLES: Omit<LogEntry, "id" | "timestamp">[] = [
  { level: "INFO", source: "worker.runtime", message: "Edge isolate garbage collection complete: freed 14MB" },
  { level: "DEBUG", source: "auth.jwt", message: "Verified RS256 token signature against public JWKS" },
  { level: "INFO", source: "rate.limiter", message: "Client ip_24.11.90 within 120 req/min threshold" },
  { level: "WARN", source: "gateway", message: "Slow upstream response from microservice /v2/inventory (410ms)" },
  { level: "INFO", source: "worker.runtime", message: "HTTP POST /v1/checkout/session - 201 Created (48ms)" },
];

const LEVEL_STYLES: Record<LogLevel, string> = {
  INFO: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  WARN: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  ERROR: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  DEBUG: "text-purple-500 bg-purple-500/10 border-purple-500/20",
};

export function LiveLogStreamer({
  initialLogs = DEFAULT_LOGS,
  serviceName = "edge-compute-gateway",
  maxBuffer = 100,
  className,
}: LiveLogStreamerProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isStreaming, setIsStreaming] = useState(true);
  const [filterLevel, setFilterLevel] = useState<LogLevel | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Streaming interval
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const sample = STREAM_SAMPLES[Math.floor(Math.random() * STREAM_SAMPLES.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;

      const newLog: LogEntry = {
        id: `l-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        ...sample,
      };

      setLogs((prev) => [...prev.slice(-(maxBuffer - 1)), newLog]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming, maxBuffer]);

  // Auto scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((l) => {
    const matchesLevel = filterLevel === "ALL" || l.level === filterLevel;
    const matchesSearch =
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.source.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`)
      .join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-neutral-100 shadow-sm flex flex-col overflow-hidden font-mono text-xs",
        className
      )}
    >
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-neutral-200">{serviceName}</span>
          <span className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isStreaming ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              )}
            />
            {isStreaming ? "TAILING" : "PAUSED"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Resume */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            {isStreaming ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span className="text-[11px]">{isStreaming ? "Pause" : "Resume"}</span>
          </button>

          {/* Clear */}
          <button
            onClick={() => setLogs([])}
            title="Clear console"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 border border-neutral-700 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopyLogs}
            title="Copy logs"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors text-[11px]"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-neutral-900/60 border-b border-neutral-800/80">
        {/* Level Filters */}
        <div className="flex items-center gap-1">
          {(["ALL", "INFO", "WARN", "ERROR", "DEBUG"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors border",
                filterLevel === lvl
                  ? "bg-neutral-700 text-white border-neutral-600"
                  : "bg-transparent text-neutral-400 hover:text-neutral-200 border-transparent"
              )}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="h-3 w-3 text-neutral-500 absolute left-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="pl-6 pr-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-[11px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 w-32 sm:w-44"
          />
        </div>
      </div>

      {/* Logs Scroll Area */}
      <div
        ref={scrollRef}
        onWheel={() => setAutoScroll(false)}
        className="p-3.5 max-h-72 min-h-48 overflow-y-auto flex flex-col gap-1.5 selection:bg-neutral-800"
      >
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-xs italic">
            No logs matching filter criteria
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 hover:bg-neutral-900/80 p-1 rounded transition-colors group"
            >
              <span className="text-neutral-500 text-[11px] shrink-0 select-none">
                {log.timestamp}
              </span>
              <span
                className={cn(
                  "text-[9px] px-1.5 py-0.2 rounded border font-semibold shrink-0 uppercase tracking-wider",
                  LEVEL_STYLES[log.level]
                )}
              >
                {log.level}
              </span>
              <span className="text-neutral-400 text-[11px] shrink-0 font-medium select-none">
                [{log.source}]
              </span>
              <span
                className={cn(
                  "flex-1 text-neutral-200 break-all leading-relaxed",
                  log.level === "ERROR" && "text-rose-400 font-medium"
                )}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-neutral-900 border-t border-neutral-800 text-[11px] text-neutral-400">
        <span>{filteredLogs.length} events buffered</span>
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={cn(
            "flex items-center gap-1 transition-colors",
            autoScroll ? "text-emerald-400 font-semibold" : "text-neutral-500 hover:text-neutral-300"
          )}
        >
          <ArrowDownCircle className="h-3 w-3" />
          <span>Auto-scroll {autoScroll ? "ON" : "OFF"}</span>
        </button>
      </div>
    </div>
  );
}
