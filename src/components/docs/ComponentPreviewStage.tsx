"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Sparkles,
  Grid3X3,
  CircleDot,
  Square,
} from "lucide-react";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { cn, copyToClipboard } from "@/lib/utils";

export interface ComponentPreviewStageProps {
  slug: string;
  sourceCode: string;
  usageCode?: string;
  filePath: string;
}

type TabId = "preview" | "usage" | "code";
type BackgroundPattern = "dots" | "grid" | "clean";
type ViewportSize = "desktop" | "tablet" | "mobile";

const TAB_META = {
  preview: { icon: Eye, label: "Preview" },
  usage: { icon: Terminal, label: "Usage" },
  code: { icon: Code2, label: "Code" },
} as const;

export function ComponentPreviewStage({
  slug,
  sourceCode,
  usageCode,
  filePath,
}: ComponentPreviewStageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("preview");
  const [replayKey, setReplayKey] = useState(0);
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop");
  const [bgPattern, setBgPattern] = useState<BackgroundPattern>("dots");
  const [mounted, setMounted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }, []);

  // Lock body scroll and listen for Escape when in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExitFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow || "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, handleExitFullscreen]);

  const handleQuickCopy = async () => {
    const targetCode =
      activeTab === "usage" && usageCode ? usageCode : sourceCode;
    const ok = await copyToClipboard(targetCode);
    if (ok) {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 1800);
    }
  };

  const handleCopyAiPrompt = async () => {
    const promptText = `I want to integrate the BoseUI "${slug}" component into my React project with Tailwind CSS and Framer Motion.\n\nHere is the component source code:\n\`\`\`tsx\n// ${filePath}\n${sourceCode}\n\`\`\`\n\n${usageCode ? `Here is the usage example:\n\`\`\`tsx\n${usageCode}\n\`\`\`\n\n` : ""}Please help me customize and wire this component with proper TypeScript types, accessible attributes, and responsive layout.`;
    const ok = await copyToClipboard(promptText);
    if (ok) {
      setCopiedAiPrompt(true);
      setTimeout(() => setCopiedAiPrompt(false), 1800);
    }
  };

  const handleReset = () => {
    setIsRotating(true);
    setReplayKey((k) => k + 1);
    setTimeout(() => setIsRotating(false), 450);
  };

  const tabs: TabId[] = usageCode
    ? ["preview", "usage", "code"]
    : ["preview", "code"];

  const renderStageCanvas = (isFs = false) => (
    <div
      key={`stage-canvas-${replayKey}-${viewportSize}-${bgPattern}`}
      className={cn(
        "relative flex min-h-[400px] w-full items-center justify-center overflow-hidden p-6 sm:p-12 transition-all duration-300",
        isFs ? "min-h-[calc(100vh-8rem)] py-8" : "sm:min-h-[460px]",
        bgPattern === "clean" && "bg-neutral-50/50 dark:bg-[#060606]"
      )}
    >
      {/* Background pattern texture */}
      {bgPattern === "dots" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-dot-matrix opacity-60 [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
        />
      )}
      {bgPattern === "grid" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
        />
      )}

      {/* Responsive Viewport Container */}
      <div
        className={cn(
          "relative z-10 flex w-full items-center justify-center transition-all duration-300 ease-out",
          viewportSize === "desktop" && "max-w-full",
          viewportSize === "tablet" &&
            "max-w-[768px] rounded-3xl border border-dashed border-neutral-300 bg-white/90 p-8 shadow-sm backdrop-blur-xs dark:border-neutral-800 dark:bg-black/90",
          viewportSize === "mobile" &&
            "max-w-[390px] rounded-3xl border border-dashed border-neutral-300 bg-white/90 p-6 shadow-sm backdrop-blur-xs dark:border-neutral-800 dark:bg-black/90"
        )}
      >
        <ComponentPreview
          slug={slug}
          className={viewportSize === "desktop" ? "max-w-none" : undefined}
        />
      </div>

      {/* Subtle responsive indicator badge when scaled down */}
      {viewportSize !== "desktop" && (
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-md border border-neutral-200 bg-white/90 px-2 py-0.5 font-mono text-[10px] text-neutral-500 shadow-2xs backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400">
          {viewportSize === "tablet" ? "Tablet · 768px" : "Mobile · 390px"}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="group/stage overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xs transition-all hover:border-neutral-300 dark:border-neutral-800 dark:bg-[#0A0A0A] dark:hover:border-neutral-700">
        {/* ── Precision Chrome Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-neutral-200/80 bg-neutral-50/70 px-3.5 py-2.5 dark:border-neutral-800 dark:bg-[#0C0C0C]">
          {/* Left: Tab Switcher (Preview | Usage | Code) */}
          <div
            role="tablist"
            aria-label="Component view mode"
            className="inline-flex items-center gap-0.5 rounded-xl border border-neutral-200/80 bg-neutral-100/90 p-1 dark:border-neutral-800 dark:bg-neutral-900/80"
          >
            {tabs.map((tabId) => {
              const { icon: Icon, label } = TAB_META[tabId];
              const isActive = activeTab === tabId;

              return (
                <button
                  key={tabId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tabId)}
                  className={cn(
                    "relative z-10 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "text-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="stage-tab-indicator"
                      className="absolute inset-0 rounded-lg bg-white shadow-2xs dark:bg-neutral-800"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Center: Viewport Switcher (Inline Preview Mode) */}
          {activeTab === "preview" && (
            <div
              role="group"
              aria-label="Preview viewport"
              className="hidden items-center gap-0.5 rounded-xl border border-neutral-200/80 bg-white p-0.5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-950 md:inline-flex"
            >
              <button
                type="button"
                onClick={() => setViewportSize("desktop")}
                title="Desktop (Full Width)"
                aria-pressed={viewportSize === "desktop"}
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  viewportSize === "desktop"
                    ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportSize("tablet")}
                title="Tablet View (768px)"
                aria-pressed={viewportSize === "tablet"}
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  viewportSize === "tablet"
                    ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportSize("mobile")}
                title="Mobile View (390px)"
                aria-pressed={viewportSize === "mobile"}
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  viewportSize === "mobile"
                    ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-1.5">
            {activeTab === "preview" && (
              <>
                {/* Background Pattern Selector */}
                <div className="hidden sm:inline-flex items-center gap-0.5 rounded-lg border border-neutral-200/80 bg-white p-0.5 dark:border-neutral-800 dark:bg-neutral-950">
                  <button
                    type="button"
                    onClick={() => setBgPattern("dots")}
                    title="Dot Matrix Background"
                    className={cn(
                      "rounded p-1 text-xs transition-colors",
                      bgPattern === "dots"
                        ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                        : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    )}
                  >
                    <CircleDot className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgPattern("grid")}
                    title="Grid Pattern Background"
                    className={cn(
                      "rounded p-1 text-xs transition-colors",
                      bgPattern === "grid"
                        ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                        : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    )}
                  >
                    <Grid3X3 className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgPattern("clean")}
                    title="Clean Solid Background"
                    className={cn(
                      "rounded p-1 text-xs transition-colors",
                      bgPattern === "clean"
                        ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                        : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    )}
                  >
                    <Square className="h-3 w-3" />
                  </button>
                </div>

                {/* Reset / Replay Animation */}
                <button
                  type="button"
                  onClick={handleReset}
                  title="Replay / Reset component animation"
                  aria-label="Replay component animation"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 font-mono text-xs font-medium text-neutral-600 shadow-2xs transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
                >
                  <RotateCcw
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-500",
                      isRotating && "-rotate-180"
                    )}
                  />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                {/* Fullscreen Trigger */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  title="Open full screen preview stage"
                  aria-label="Open full screen preview stage"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 font-mono text-xs font-medium text-neutral-600 shadow-2xs transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
              </>
            )}

            {/* Copy Prompt for AI Tools */}
            <button
              type="button"
              onClick={handleCopyAiPrompt}
              title="Copy formatted prompt for Cursor, v0, and Claude"
              aria-label="Copy prompt for AI"
              className={cn(
                "hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs font-medium shadow-2xs transition-colors",
                copiedAiPrompt
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
              )}
            >
              {copiedAiPrompt ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Prompt Copied</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>AI Prompt</span>
                </>
              )}
            </button>

            {/* Quick Copy Code / Usage */}
            <button
              type="button"
              onClick={handleQuickCopy}
              aria-label={activeTab === "usage" ? "Copy usage code" : "Copy source code"}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs font-medium shadow-2xs transition-colors",
                copiedSource
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
              )}
            >
              {copiedSource ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>{activeTab === "usage" ? "Copy Usage" : "Copy Code"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Stage Body Panels ── */}
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "preview" ? (
            <motion.div
              key="preview-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              {renderStageCanvas(false)}
            </motion.div>
          ) : activeTab === "usage" && usageCode ? (
            <motion.div
              key="usage-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="p-3 sm:p-4"
            >
              <CodeViewer
                code={usageCode}
                filename="example.tsx"
                language="tsx"
                maxHeight="460px"
              />
            </motion.div>
          ) : (
            <motion.div
              key="code-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="p-3 sm:p-4"
            >
              <CodeViewer
                code={sourceCode}
                filename={filePath}
                language="tsx"
                maxHeight="520px"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fullscreen Preview Modal Portal ── */}
      {mounted &&
        isFullscreen &&
        createPortal(
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen component preview stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9990] flex h-screen w-screen flex-col bg-white dark:bg-[#060606]"
          >
            {/* Fullscreen Header Control Bar */}
            <div className="relative z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-neutral-800 dark:bg-[#0A0A0A]/95 sm:px-6">
              {/* File details */}
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white">
                  {filePath}
                </span>
              </div>

              {/* Viewport Width Controls */}
              <div
                role="group"
                aria-label="Responsive preview sizing"
                className="hidden items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900 sm:inline-flex"
              >
                <button
                  type="button"
                  onClick={() => setViewportSize("desktop")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                    viewportSize === "desktop"
                      ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportSize("tablet")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                    viewportSize === "tablet"
                      ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  <Tablet className="h-3.5 w-3.5" />
                  <span>Tablet (768px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportSize("mobile")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                    viewportSize === "mobile"
                      ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile (390px)</span>
                </button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 font-mono text-xs font-medium text-neutral-700 shadow-2xs transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                >
                  <RotateCcw
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-500",
                      isRotating && "-rotate-180"
                    )}
                  />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickCopy}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 font-mono text-xs font-medium text-neutral-700 shadow-2xs transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                >
                  {copiedSource ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleExitFullscreen}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-neutral-950 px-3.5 font-mono text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Exit</span>
                  <kbd className="hidden rounded bg-white/20 px-1 py-0.5 text-[9px] dark:bg-black/15 sm:inline-block">
                    ESC
                  </kbd>
                </button>
              </div>
            </div>

            {/* Fullscreen Interactive Canvas */}
            <div className="relative flex-1 overflow-y-auto overscroll-contain">
              {renderStageCanvas(true)}
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}
