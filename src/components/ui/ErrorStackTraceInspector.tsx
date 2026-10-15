"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  FileCode,
  CheckCircle2,
  EyeOff,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StackFrame {
  id: string;
  file: string;
  line: number;
  column: number;
  functionName: string;
  isProjectCode: boolean;
  contextCode?: {
    line: number;
    code: string;
    isErrorLine?: boolean;
  }[];
}

export interface ErrorStackTraceInspectorProps {
  /** Error class name */
  errorType?: string;
  /** Error message */
  errorMessage?: string;
  /** Timestamp or event ID */
  eventId?: string;
  /** Frames list */
  frames?: StackFrame[];
  className?: string;
}

const DEFAULT_FRAMES: StackFrame[] = [
  {
    id: "f-1",
    file: "src/server/auth/session.ts",
    line: 42,
    column: 18,
    functionName: "validateSessionToken",
    isProjectCode: true,
    contextCode: [
      { line: 40, code: "  const session = await db.sessions.findUnique({ where: { token } });" },
      { line: 41, code: "  const decrypted = decryptPayload(session.encryptedData);" },
      { line: 42, code: "  if (session.user.permissions.includes('admin')) {", isErrorLine: true },
      { line: 43, code: "    return grantSuperuser(session.user);" },
      { line: 44, code: "  }" },
    ],
  },
  {
    id: "f-2",
    file: "src/app/api/auth/[...route]/route.ts",
    line: 19,
    column: 24,
    functionName: "handleAuthDispatch",
    isProjectCode: true,
    contextCode: [
      { line: 18, code: "  const token = req.headers.get('authorization')?.split(' ')[1];" },
      { line: 19, code: "  return await validateSessionToken(token);", isErrorLine: true },
      { line: 20, code: "}" },
    ],
  },
  {
    id: "f-3",
    file: "node_modules/next/dist/server/web/adapter.js",
    line: 164,
    column: 11,
    functionName: "dispatchEdgeRouteHandler",
    isProjectCode: false,
  },
  {
    id: "f-4",
    file: "node_modules/next/dist/compiled/@edge-runtime/primitives/index.js",
    line: 88,
    column: 5,
    functionName: "asyncHandlerExecution",
    isProjectCode: false,
  },
];

export function ErrorStackTraceInspector({
  errorType = "TypeError",
  errorMessage = "Cannot read properties of undefined (reading 'permissions')",
  eventId = "evt_91b8a7c29e",
  frames = DEFAULT_FRAMES,
  className,
}: ErrorStackTraceInspectorProps) {
  const [onlyProjectCode, setOnlyProjectCode] = useState(true);
  const [expandedFrameId, setExpandedFrameId] = useState<string>("f-1");
  const [isResolved, setIsResolved] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayedFrames = onlyProjectCode
    ? frames.filter((f) => f.isProjectCode)
    : frames;

  const handleCopyMarkdown = () => {
    const md = `### ${errorType}: ${errorMessage}\n\n**Event ID:** \`${eventId}\`\n\n\`\`\`\n` +
      frames.map((f) => `  at ${f.functionName} (${f.file}:${f.line}:${f.column})`).join("\n") +
      "\n```";
    navigator.clipboard?.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-rose-500/30 bg-white p-5 sm:p-6 shadow-sm text-neutral-900 dark:border-rose-500/40 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col gap-5",
        isResolved && "border-emerald-500/30 dark:border-emerald-500/40 opacity-80",
        className
      )}
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0 mt-0.5">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                {errorType}
              </span>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">#{eventId}</span>
            </div>
            <h3 className="text-sm font-semibold font-mono text-neutral-900 dark:text-white mt-1 break-words">
              {errorMessage}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsResolved(!isResolved)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-xs",
              isResolved
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-800"
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{isResolved ? "Resolved" : "Mark Resolved"}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 transition-all shadow-xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy MD</span>
          </button>
        </div>
      </div>

      {/* Filter Toggles */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-neutral-500 dark:text-neutral-400 uppercase text-[11px] tracking-wider">
          Call Stack ({displayedFrames.length} frames)
        </span>
        <button
          onClick={() => setOnlyProjectCode(!onlyProjectCode)}
          className={cn(
            "text-xs px-2.5 py-1 rounded-lg border transition-colors",
            onlyProjectCode
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-transparent font-medium"
              : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white border-neutral-200 dark:border-neutral-800"
          )}
        >
          {onlyProjectCode ? "In-App Code Only" : "Show All Frames (incl. vendor)"}
        </button>
      </div>

      {/* Stack Frames Accordion List */}
      <div className="flex flex-col gap-2">
        {displayedFrames.map((frame) => {
          const isExpanded = expandedFrameId === frame.id;

          return (
            <div
              key={frame.id}
              className={cn(
                "rounded-xl border transition-all overflow-hidden",
                isExpanded
                  ? "border-rose-500/40 bg-neutral-50 dark:bg-neutral-900/60"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700"
              )}
            >
              {/* Frame summary row */}
              <button
                onClick={() => setExpandedFrameId(isExpanded ? "" : frame.id)}
                className="w-full flex items-center justify-between p-3 text-left font-mono text-xs gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                  )}
                  <span className="font-semibold text-neutral-900 dark:text-white truncate">{frame.functionName}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">
                    {frame.file}:{frame.line}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {frame.isProjectCode ? (
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded font-sans font-semibold">
                      App Code
                    </span>
                  ) : (
                    <span className="text-[10px] bg-neutral-100 text-neutral-500 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 px-1.5 py-0.2 rounded font-sans">
                      Vendor
                    </span>
                  )}
                </div>
              </button>

              {/* Expandable Code Context with Error Squiggle */}
              <AnimatePresence>
                {isExpanded && frame.contextCode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3 font-mono text-xs overflow-x-auto"
                  >
                    <div className="flex flex-col gap-1">
                      {frame.contextCode.map((ctx) => (
                        <div
                          key={ctx.line}
                          className={cn(
                            "flex items-center gap-3 px-2 py-1 rounded transition-colors",
                            ctx.isErrorLine
                              ? "bg-rose-500/15 border-l-2 border-rose-500 text-rose-700 dark:text-rose-300 font-bold"
                              : "text-neutral-600 dark:text-neutral-400"
                          )}
                        >
                          <span className="w-8 text-right opacity-40 select-none text-[11px]">
                            {ctx.line}
                          </span>
                          <span className="flex-1 whitespace-pre">{ctx.code}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
