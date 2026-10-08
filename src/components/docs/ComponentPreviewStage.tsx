"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  RotateCcw,
  Eye,
  Code2,
  Terminal,
  Check,
  Copy,
  Maximize2,
  Minimize2,
  Monitor,
  Tablet,
  Smartphone,
  Expand,
} from "lucide-react";
import { COMPONENT_DEMOS } from "@/registry/generated-demos";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { cn, copyToClipboard } from "@/lib/utils";

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
  const [copiedSource, setCopiedSource] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportSize, setViewportSize] = useState<
    "full" | "centered" | "tablet" | "mobile"
  >("full");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape when in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const Demo = COMPONENT_DEMOS[slug] as
    | React.ComponentType<{ className?: string }>
    | undefined;

  const handleQuickCopy = async () => {
    const targetCode =
      activeTab === "usage" && usageCode ? usageCode : sourceCode;
    const ok = await copyToClipboard(targetCode);
    if (ok) {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 1800);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#0A0A0A]">
        {/* Unified Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-3.5 py-2.5 dark:border-neutral-800">
          {/* Left Tabs: Preview | Usage | Code */}
          <div
            role="tablist"
            aria-label="Component view mode"
            className="inline-flex items-center gap-1 rounded-xl bg-neutral-100/90 p-1 dark:bg-neutral-900"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "preview"}
              onClick={() => setActiveTab("preview")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === "preview"
                  ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>

            {usageCode && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "usage"}
                onClick={() => setActiveTab("usage")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === "usage"
                    ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                )}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Usage</span>
              </button>
            )}

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "code"}
              onClick={() => setActiveTab("code")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === "code"
                  ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Code</span>
            </button>
          </div>

          {/* Right Actions: Quick Copy Source + Reset + Full Screen */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickCopy}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs font-medium transition-colors",
                copiedSource
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
              )}
            >
              {copiedSource ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>
                    {activeTab === "usage" ? "Copy Usage" : "Copy Code"}
                  </span>
                </>
              )}
            </button>

            {activeTab === "preview" && (
              <>
                <button
                  type="button"
                  onClick={() => setReplayKey((k) => k + 1)}
                  title="Reset component state"
                  aria-label="Reset component state"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 font-mono text-xs text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  title="Open full screen preview"
                  aria-label="Open full screen preview"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 font-mono text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Full Screen</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stage Body */}
        {activeTab === "preview" ? (
          <div className="relative flex min-h-[360px] w-full items-center justify-center p-6 sm:p-12">
            {/* Decorative Dot Background (clipped to rounded-b-2xl while leaving dropdowns unclipped) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-2xl bg-neutral-50/50 dark:bg-[#050505]"
            >
              <div className="h-full w-full bg-dot-matrix [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)]" />
            </div>

            <div
              key={replayKey}
              className="relative z-10 flex w-full items-center justify-center"
            >
              {!isFullscreen && Demo ? (
                <Demo />
              ) : (
                <p className="font-mono text-xs text-neutral-500">
                  {isFullscreen
                    ? "Viewing in Full Screen mode..."
                    : "Preview unavailable."}
                </p>
              )}
            </div>
          </div>
        ) : activeTab === "usage" && usageCode ? (
          <div className="p-2">
            <CodeViewer
              code={usageCode}
              filename="example.tsx"
              language="tsx"
              maxHeight="440px"
              className="border-0"
            />
          </div>
        ) : (
          <div className="p-2">
            <CodeViewer
              code={sourceCode}
              filename={filePath}
              language="tsx"
              maxHeight="540px"
              className="border-0"
            />
          </div>
        )}
      </div>

      {/* Full Screen Preview Portal (z-[9990] so component overlays at z-[9999] stay on top) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Full screen component preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[9990] flex h-screen w-screen flex-col bg-white dark:bg-[#050505]"
              >
                {/* Full Screen Top Control Bar */}
                <div className="relative z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-neutral-800 dark:bg-[#0A0A0A]/95 sm:px-6">
                  {/* Left: File Path */}
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
                    <span className="font-mono text-xs font-medium text-neutral-900 dark:text-white">
                      {filePath}
                    </span>
                  </div>

                  {/* Center: Responsive Viewport Width Switcher */}
                  <div
                    role="group"
                    aria-label="Viewport size"
                    className="hidden items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 dark:border-neutral-800 dark:bg-neutral-900 md:inline-flex"
                  >
                    {(
                      [
                        {
                          id: "full",
                          label: "Full Width",
                          icon: <Expand className="h-3.5 w-3.5" />,
                        },
                        {
                          id: "centered",
                          label: "Default Size",
                          icon: <Monitor className="h-3.5 w-3.5" />,
                        },
                        {
                          id: "tablet",
                          label: "Tablet (768px)",
                          icon: <Tablet className="h-3.5 w-3.5" />,
                        },
                        {
                          id: "mobile",
                          label: "Mobile (390px)",
                          icon: <Smartphone className="h-3.5 w-3.5" />,
                        },
                      ] as const
                    ).map((vp) => (
                      <button
                        key={vp.id}
                        type="button"
                        onClick={() => setViewportSize(vp.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                          viewportSize === vp.id
                            ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                            : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        )}
                      >
                        {vp.icon}
                        <span>{vp.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Right: Reset + Copy + Exit Full Screen */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReplayKey((k) => k + 1)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 font-mono text-xs text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickCopy}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 font-mono text-xs text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                    >
                      {copiedSource ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Copy Code</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFullscreen(false)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-neutral-900 px-3 font-mono text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                      <Minimize2 className="h-3.5 w-3.5" />
                      <span>Exit</span>
                      <kbd className="ml-0.5 hidden rounded bg-white/20 px-1 py-0.2 text-[10px] dark:bg-black/15 sm:inline-block">
                        ESC
                      </kbd>
                    </button>
                  </div>
                </div>

                {/* Full Screen Interactive Stage */}
                <div className="relative flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-10">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none fixed inset-0 top-14 bg-dot-matrix [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]"
                  />

                  <div
                    key={`fs-${replayKey}-${viewportSize}`}
                    className={cn(
                      "relative z-10 flex items-center justify-center transition-all duration-200",
                      viewportSize === "full" &&
                        "fullscreen-stage-expand h-full w-full max-w-[1400px]",
                      viewportSize === "centered" && "w-full max-w-4xl",
                      viewportSize === "tablet" &&
                        "fullscreen-stage-expand w-full max-w-[768px] rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-black/80",
                      viewportSize === "mobile" &&
                        "fullscreen-stage-expand w-full max-w-[390px] rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-black/80"
                    )}
                  >
                    {Demo ? (
                      <Demo
                        className={
                          viewportSize === "full" ? "max-w-none" : undefined
                        }
                      />
                    ) : (
                      <p className="font-mono text-xs text-neutral-500">
                        Preview unavailable.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
