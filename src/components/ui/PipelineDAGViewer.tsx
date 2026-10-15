"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitMerge,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Terminal,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PipelineStage {
  id: string;
  name: string;
  status: "success" | "running" | "failed" | "pending";
  duration: string;
  column: number; // 0, 1, 2, 3
  dependsOn?: string[]; // IDs of stages that connect to this stage
  logs?: string[];
}

export interface PipelineDAGViewerProps {
  /** Pipeline workflow title */
  pipelineName?: string;
  /** Git branch / commit reference */
  commitSha?: string;
  /** Stages list */
  stages?: PipelineStage[];
  className?: string;
}

const DEFAULT_STAGES: PipelineStage[] = [
  {
    id: "lint",
    name: "Lint & Typecheck",
    status: "success",
    duration: "42s",
    column: 0,
    logs: [
      "✔ eslint: 0 errors, 0 warnings",
      "✔ tsc --noEmit: typecheck verified in 2.1s",
    ],
  },
  {
    id: "test-unit",
    name: "Unit Tests (Jest)",
    status: "success",
    duration: "1m 18s",
    column: 1,
    dependsOn: ["lint"],
    logs: [
      "PASS src/__tests__/auth.test.ts (14 tests)",
      "PASS src/__tests__/pipeline.test.ts (8 tests)",
      "Test Suites: 2 passed, 2 total",
    ],
  },
  {
    id: "test-e2e",
    name: "E2E Playwright",
    status: "success",
    duration: "2m 04s",
    column: 1,
    dependsOn: ["lint"],
    logs: [
      "Running 12 tests across 3 browsers (Chromium, Firefox, WebKit)",
      "✔ 12 passed (124.2s)",
    ],
  },
  {
    id: "docker-build",
    name: "Build Docker Image",
    status: "running",
    duration: "54s",
    column: 2,
    dependsOn: ["test-unit", "test-e2e"],
    logs: [
      "Step 4/12 : RUN npm run build",
      "Generating static pages (361/361) ...",
      "Exporting multi-stage container layer ...",
    ],
  },
  {
    id: "deploy-canary",
    name: "Deploy Canary",
    status: "pending",
    duration: "--",
    column: 3,
    dependsOn: ["docker-build"],
    logs: ["Waiting for upstream container image build..."],
  },
];

export function PipelineDAGViewer({
  pipelineName = "ci-cd-matrix.yml",
  commitSha = "main • 4b2e8c1",
  stages = DEFAULT_STAGES,
  className,
}: PipelineDAGViewerProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>("docker-build");

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  // Group stages by column
  const columnsMap: Record<number, PipelineStage[]> = {};
  stages.forEach((s) => {
    if (!columnsMap[s.column]) columnsMap[s.column] = [];
    columnsMap[s.column].push(s);
  });

  const columns = Object.keys(columnsMap)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col gap-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">{pipelineName}</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
            Triggered by commit <span className="text-neutral-900 dark:text-white font-semibold">{commitSha}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold">
            <RotateCcw className="h-3.5 w-3.5 animate-spin" />
            BUILD IN PROGRESS
          </span>
        </div>
      </div>

      {/* DAG Workflow Pipeline Board */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 py-2 overflow-x-auto">
        {columns.map((colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-3 min-w-[180px]">
            <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 tracking-wider font-semibold">
              Stage {colIdx + 1}
            </span>

            <div className="flex flex-col gap-2.5">
              {columnsMap[colIdx].map((stage) => {
                const isSelected = selectedStageId === stage.id;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 shadow-xs",
                      isSelected
                        ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 ring-1 ring-blue-500"
                        : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/80",
                      stage.status === "running" && "border-blue-500/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {stage.name}
                      </span>
                      {stage.status === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                      {stage.status === "running" && (
                        <RotateCcw className="h-4 w-4 text-blue-500 animate-spin shrink-0" />
                      )}
                      {stage.status === "failed" && (
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      )}
                      {stage.status === "pending" && (
                        <Clock className="h-4 w-4 text-neutral-400 dark:text-neutral-600 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                      <span className="capitalize">{stage.status}</span>
                      <span>{stage.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Job Console Log Viewer */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 p-4 text-neutral-200 font-mono text-xs flex flex-col gap-2.5 shadow-inner">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-white">{selectedStage.name} — Step Output</span>
          </div>
          <span className="text-[11px] text-neutral-400 capitalize">
            {selectedStage.status} ({selectedStage.duration})
          </span>
        </div>

        <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pt-1 text-neutral-400">
          {selectedStage.logs?.map((l, i) => (
            <div key={i} className="leading-relaxed">
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
