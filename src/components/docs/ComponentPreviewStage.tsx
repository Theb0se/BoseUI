"use client";

import React, { useState } from "react";
import { RotateCcw, Eye, Code2, Terminal } from "lucide-react";
import { COMPONENT_DEMOS } from "@/registry/generated-demos";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { cn } from "@/lib/utils";

export interface ComponentPreviewStageProps {
  slug: string;
  sourceCode: string;
  usageCode?: string;
  filePath: string;
}

export function ComponentPreviewStage({
  slug,
  sourceCode,
  usageCode,
  filePath,
}: ComponentPreviewStageProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "usage" | "code">(
    "preview"
  );
  const [replayKey, setReplayKey] = useState(0);

  const Demo = COMPONENT_DEMOS[slug];

  return (
    <div className="space-y-3">
      {/* Clean Control Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-[#222222] dark:bg-[#0A0A0A]">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
              activeTab === "preview"
                ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>

          {usageCode && (
            <button
              type="button"
              onClick={() => setActiveTab("usage")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
                activeTab === "usage"
                  ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                  : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Usage</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
              activeTab === "code"
                ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
                : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Code</span>
          </button>
        </div>

        {activeTab === "preview" && (
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            title="Reset preview"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-600 transition-colors hover:border-black hover:text-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Stage Body */}
      {activeTab === "preview" ? (
        <div className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 dark:border-[#222222] dark:bg-[#050505] sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-dot-matrix [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
          />

          <div
            key={replayKey}
            className="relative z-10 flex w-full items-center justify-center"
          >
            {Demo ? (
              <Demo />
            ) : (
              <p className="font-mono text-xs text-neutral-500">
                Preview unavailable.
              </p>
            )}
          </div>
        </div>
      ) : activeTab === "usage" && usageCode ? (
        <CodeViewer
          code={usageCode}
          filename="example.tsx"
          language="tsx"
          maxHeight="420px"
        />
      ) : (
        <CodeViewer
          code={sourceCode}
          filename={filePath}
          language="tsx"
          maxHeight="520px"
        />
      )}
    </div>
  );
}
