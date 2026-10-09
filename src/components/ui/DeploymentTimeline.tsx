"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Clock,
  GitCommit,
  GitBranch,
  Terminal,
  RotateCcw,
  AlertCircle,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PipelineStage = "queued" | "building" | "assigning" | "ready" | "failed";

export interface DeploymentTimelineProps {
  commitSha?: string;
  branch?: string;
  autoPlay?: boolean;
  className?: string;
}

interface StageStep {
  id: PipelineStage;
  label: string;
  desc: string;
  durationMs: number;
}

const STAGES: StageStep[] = [
  { id: "queued", label: "Queued", desc: "Assigned to build runner-west-04", durationMs: 2500 },
  { id: "building", label: "Building", desc: "Running turbo build & asset optimization", durationMs: 4000 },
  { id: "assigning", label: "Assigning Domains", desc: "Propagating DNS & edge worker routes", durationMs: 2500 },
  { id: "ready", label: "Ready", desc: "Deployment live globally in 310 regions", durationMs: 0 },
];

const LOG_MESSAGES: Record<PipelineStage, string[]> = {
  queued: [
    "[runner] Initializing isolated microVM container...",
    "[git] Fetching origin/main @ commit a89e4c1...",
    "[cache] Restoring Turborepo lockfile hash (98.2% cache hit)...",
  ],
  building: [
    "[pnpm] Resolving dependencies with frozen-lockfile...",
    "[next] Creating optimized production build...",
    "[next] ✓ Compiled client and server bundles in 842ms",
    "[turbopack] Generating static pages (28/28)...",
    "[wasm] Compiling Rust image processing pipeline to wasm32-unknown...",
    "[edge] Generating immutable edge functions bundles...",
  ],
  assigning: [
    "[network] Uploading 142 static assets to edge CDN...",
    "[dns] Pointing pulseui.dev to canonical alias 76.76.21.21...",
    "[ssl] Validating automated Let's Encrypt TLS certificate...",
    "[mesh] Health probe verified 200 OK across 24 regional points of presence.",
  ],
  ready: [
    "✓ DEPLOYMENT COMPLETE in 9.24s",
    "Production URL: https://pulseui.dev",
    "Preview URL: https://pulseui-git-feat-engine.pulse.app",
    "State: Immutably locked and ready for incoming traffic.",
  ],
  failed: [
    "✗ ERROR: Build runner terminated with exit code 1",
    "Error: Module not found: Can't resolve '@lib/core' in /app/src/index.ts",
    "Pipeline aborted. Previous production deployment preserved.",
  ],
};

export function DeploymentTimeline({
  commitSha = "a89e4c1",
  branch = "main",
  autoPlay = true,
  className,
}: DeploymentTimelineProps) {
  const [currentStage, setCurrentStage] = useState<PipelineStage>("building");
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(3.4);
  const [showStdout, setShowStdout] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(autoPlay);
  const [copiedSha, setCopiedSha] = useState<boolean>(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([
    ...LOG_MESSAGES.queued,
    ...LOG_MESSAGES.building.slice(0, 3),
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (showStdout && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeLogs, showStdout]);

  // Timer loop
  useEffect(() => {
    if (!isSimulating || currentStage === "ready" || currentStage === "failed") return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating, currentStage]);

  // Stage progression simulator
  useEffect(() => {
    if (!isSimulating) return;

    let timeout: NodeJS.Timeout;

    if (currentStage === "queued") {
      timeout = setTimeout(() => {
        setCurrentStage("building");
        setActiveLogs((prev) => [...prev, ...LOG_MESSAGES.building]);
      }, 2500);
    } else if (currentStage === "building") {
      timeout = setTimeout(() => {
        setCurrentStage("assigning");
        setActiveLogs((prev) => [...prev, ...LOG_MESSAGES.assigning]);
      }, 3500);
    } else if (currentStage === "assigning") {
      timeout = setTimeout(() => {
        setCurrentStage("ready");
        setActiveLogs((prev) => [...prev, ...LOG_MESSAGES.ready]);
      }, 2500);
    }

    return () => clearTimeout(timeout);
  }, [currentStage, isSimulating]);

  const restartDeployment = () => {
    setCurrentStage("queued");
    setElapsedSeconds(0.0);
    setIsSimulating(true);
    setActiveLogs([...LOG_MESSAGES.queued]);
  };

  const triggerFailure = () => {
    setCurrentStage("failed");
    setIsSimulating(false);
    setActiveLogs((prev) => [...prev, ...LOG_MESSAGES.failed]);
  };

  const copySha = () => {
    navigator.clipboard?.writeText(commitSha);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const getStageIndex = (stage: PipelineStage) => {
    if (stage === "failed") return 1;
    return STAGES.findIndex((s) => s.id === stage);
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#07080D] p-6 text-white shadow-2xl flex flex-col justify-between selection:bg-neutral-800",
        className
      )}
    >
      {/* Background glow when ready */}
      {currentStage === "ready" && (
        <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      )}
      {currentStage === "failed" && (
        <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />
      )}

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 font-mono text-xs font-bold text-neutral-200">
            ▲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-white">
                pulseui.dev
              </h3>
              <span
                className={cn(
                  "text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border",
                  currentStage === "ready"
                    ? "border-emerald-500/40 bg-emerald-950/60 text-emerald-400"
                    : currentStage === "failed"
                    ? "border-rose-500/40 bg-rose-950/60 text-rose-400"
                    : "border-cyan-500/40 bg-cyan-950/60 text-cyan-400 animate-pulse"
                )}
              >
                {currentStage === "ready"
                  ? "Production Ready"
                  : currentStage === "failed"
                  ? "Build Failed"
                  : "Deploying..."}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono mt-0.5">
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3 text-neutral-500" />
                {branch}
              </span>
              <button
                onClick={copySha}
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Copy Commit Hash"
              >
                <GitCommit className="h-3 w-3 text-neutral-500" />
                <span>{commitSha}</span>
                {copiedSha ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={restartDeployment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 transition-all shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Redeploy</span>
          </button>

          <button
            onClick={triggerFailure}
            disabled={currentStage === "failed"}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-all",
              currentStage === "failed"
                ? "border-neutral-800 text-neutral-600 cursor-not-allowed"
                : "border-rose-900/60 bg-rose-950/30 text-rose-400 hover:bg-rose-900/40"
            )}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Simulate Error</span>
          </button>

          <button
            onClick={() => setShowStdout(!showStdout)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white transition-colors"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{showStdout ? "Hide Logs" : "Show Logs"}</span>
            {showStdout ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Main Deployment Pipeline Stepper */}
      <div className="relative z-10 my-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {STAGES.map((step, idx) => {
            const isCompleted = currentIndex > idx || currentStage === "ready";
            const isCurrent = currentStage === step.id;
            const isFailed = currentStage === "failed" && step.id === "building";

            return (
              <div
                key={step.id}
                className={cn(
                  "relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-300",
                  isCurrent && !isFailed
                    ? "border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40"
                    : isCompleted
                    ? "border-neutral-700/80 bg-neutral-900/70"
                    : isFailed
                    ? "border-rose-500/60 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                    : "border-neutral-800/60 bg-neutral-950/40 opacity-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    PHASE 0{idx + 1}
                  </span>

                  {/* Status Indicator Icon */}
                  {isFailed ? (
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-neutral-700" />
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                    {step.label}
                  </div>
                  <div className="mt-1 text-[11px] leading-snug text-neutral-400 line-clamp-2">
                    {step.desc}
                  </div>
                </div>

                <div className="mt-3 border-t border-neutral-800/80 pt-2 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span>
                    {isCompleted ? "DONE" : isCurrent ? "IN PROGRESS" : isFailed ? "FAILED" : "PENDING"}
                  </span>
                  {isCurrent && (
                    <span className="text-cyan-400 font-bold">{elapsedSeconds}s</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streaming Stdout Console */}
      <AnimatePresence>
        {showStdout && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 my-2 overflow-hidden rounded-xl border border-neutral-800 bg-[#040508] font-mono text-xs shadow-inner"
          >
            {/* Console top header */}
            <div className="flex items-center justify-between border-b border-neutral-800/90 bg-neutral-900/60 px-4 py-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-neutral-300 font-medium">Build Stdout Logs</span>
                <span className="text-neutral-600">•</span>
                <span>Streaming live</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-500">
                <span>{activeLogs.length} events logged</span>
                <button
                  onClick={() => setActiveLogs([])}
                  className="hover:text-neutral-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Console lines container */}
            <div
              tabIndex={0}
              role="region"
              aria-label="Build stdout logs"
              aria-live="polite"
              className="max-h-48 overflow-y-auto p-4 space-y-1.5 text-neutral-300 selection:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-700"
            >
              {activeLogs.map((log, index) => {
                const isError = log.includes("ERROR") || log.includes("✗");
                const isSuccess = log.includes("✓") || log.includes("COMPLETE");
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-2.5 font-mono text-[11px] leading-relaxed",
                      isError
                        ? "text-rose-400 font-medium"
                        : isSuccess
                        ? "text-emerald-400 font-medium"
                        : "text-neutral-300"
                    )}
                  >
                    <span className="text-neutral-600 select-none w-5 text-right font-mono text-[10px]">
                      {index + 1}
                    </span>
                    <span className="flex-1 break-all">{log}</span>
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800/80 pt-3 text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-neutral-500" />
          <span>ELAPSED TOTAL: {elapsedSeconds}s</span>
        </div>

        {currentStage === "ready" ? (
          <a
            href="https://pulseui.dev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:underline"
          >
            <Globe className="h-3 w-3" />
            <span>Visit Live URL: pulseui.dev</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <div className="flex items-center gap-2">
            <span>EDGE WORKERS: 310 REGIONS ROUTED</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeploymentTimeline;
