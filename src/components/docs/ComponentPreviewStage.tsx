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
import { ComponentPreview } from "@/components/docs/preview";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { cn, copyToClipboard } from "@/lib/utils";

export interface ComponentPreviewStageProps {
  slug: string;
  sourceCode: string;
  usageCode?: string;
  filePath: string;
}

/* ─── Toolbar icon-button ─── */
function ToolbarButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs font-medium transition-colors",
        "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950",
        "dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white",
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}

/* ─── Tab item with animated indicator ─── */
const TAB_META = {
  preview: { icon: Eye, label: "Preview" },
  usage: { icon: Terminal, label: "Usage" },
  code: { icon: Code2, label: "Code" },
} as const;

type TabId = "preview" | "usage" | "code";

function TabButton({
  id,
  activeTab,
  onClick,
}: {
  id: TabId;
  activeTab: TabId;
  onClick: () => void;
}) {
  const { icon: Icon, label } = TAB_META[id];
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        "relative z-10 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
        isActive
          ? "text-neutral-950 dark:text-white"
          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="stage-tab-pill"
          className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-800"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </span>
    </button>
  );
}

/* ─── Panel transition variants ─── */
const panelVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

/* ─── Viewport Switcher (used inside fullscreen) ─── */
const viewportOptions = [
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
] as const;

export function ComponentPreviewStage({
  slug,
  sourceCode,
  usageCode,
  filePath,
}: ComponentPreviewStageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("preview");
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

  const handleQuickCopy = async () => {
    const targetCode =
      activeTab === "usage" && usageCode ? usageCode : sourceCode;
    const ok = await copyToClipboard(targetCode);
    if (ok) {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 1800);
    }
  };

  /* ─── Which tabs to show ─── */
  const tabs: TabId[] = usageCode
    ? ["preview", "usage", "code"]
    : ["preview", "code"];

  return (
    <>
      <div className="group/stage overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:border-neutral-800/80 dark:bg-[#0A0A0A] dark:shadow-none dark:hover:shadow-[0_2px_16px_rgba(255,255,255,0.03)]">
        {/* ── Unified Top Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 px-3.5 py-2.5 dark:border-neutral-800/80">
          {/* Left Tabs: Preview | Usage | Code */}
          <div
            role="tablist"
            aria-label="Component view mode"
            className="inline-flex items-center gap-0.5 rounded-xl bg-neutral-100/90 p-1 dark:bg-neutral-900/80"
          >
            {tabs.map((tabId) => (
              <TabButton
                key={tabId}
                id={tabId}
                activeTab={activeTab}
                onClick={() => setActiveTab(tabId)}
              />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Copy button */}
            <motion.button
              type="button"
              onClick={handleQuickCopy}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs font-medium transition-all duration-200",
                copiedSource
                  ? "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-black"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {copiedSource ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied!</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>
                      {activeTab === "usage" ? "Copy Usage" : "Copy Code"}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {activeTab === "preview" && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5"
              >
                <ToolbarButton
                  onClick={() => setReplayKey((k) => k + 1)}
                  title="Reset component state"
                  aria-label="Reset component state"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </ToolbarButton>

                <ToolbarButton
                  onClick={() => setIsFullscreen(true)}
                  title="Open full screen preview"
                  aria-label="Open full screen preview"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Full Screen</span>
                </ToolbarButton>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Stage Body with panel transitions ── */}
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "preview" ? (
            <motion.div
              key="preview-panel"
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden p-6 sm:p-12"
            >
              {/* Subtle dot-grid pattern behind the preview */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-dot-matrix opacity-50 [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
              />

              <div
                key={replayKey}
                className="relative z-10 flex w-full items-center justify-center"
              >
                {!isFullscreen ? (
                  <ComponentPreview slug={slug} />
                ) : (
                  <p className="font-mono text-xs text-neutral-500">
                    Viewing in Full Screen mode...
                  </p>
                )}
              </div>
            </motion.div>
          ) : activeTab === "usage" && usageCode ? (
            <motion.div
              key="usage-panel"
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-2"
            >
              <CodeViewer
                code={usageCode}
                filename="example.tsx"
                language="tsx"
                maxHeight="440px"
                className="border-0"
              />
            </motion.div>
          ) : (
            <motion.div
              key="code-panel"
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-2"
            >
              <CodeViewer
                code={sourceCode}
                filename={filePath}
                language="tsx"
                maxHeight="540px"
                className="border-0"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Full Screen Preview Portal ── */}
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
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9990] flex h-screen w-screen flex-col bg-white dark:bg-[#050505]"
              >
                {/* Full Screen Top Control Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.2 }}
                  className="relative z-30 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-[#0A0A0A]/95 sm:px-6"
                >
                  {/* Left: File Path */}
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-900/40 dark:bg-white/40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-white" />
                    </span>
                    <span className="font-mono text-xs font-medium text-neutral-900 dark:text-white">
                      {filePath}
                    </span>
                  </div>

                  {/* Center: Responsive Viewport Width Switcher */}
                  <div
                    role="group"
                    aria-label="Viewport size"
                    className="hidden items-center gap-0.5 rounded-xl border border-neutral-200/80 bg-neutral-100/80 p-1 dark:border-neutral-800/80 dark:bg-neutral-900/80 md:inline-flex"
                  >
                    {viewportOptions.map((vp) => (
                      <button
                        key={vp.id}
                        type="button"
                        onClick={() => setViewportSize(vp.id)}
                        className={cn(
                          "relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                          viewportSize === vp.id
                            ? "text-neutral-950 dark:text-white"
                            : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        )}
                      >
                        {viewportSize === vp.id && (
                          <motion.span
                            layoutId="viewport-pill"
                            className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-800"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 28,
                            }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          {vp.icon}
                          <span>{vp.label}</span>
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right: Reset + Copy + Exit Full Screen */}
                  <div className="flex items-center gap-1.5">
                    <ToolbarButton
                      onClick={() => setReplayKey((k) => k + 1)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset</span>
                    </ToolbarButton>

                    <ToolbarButton onClick={handleQuickCopy}>
                      {copiedSource ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Copy Code</span>
                        </>
                      )}
                    </ToolbarButton>

                    <motion.button
                      type="button"
                      onClick={() => setIsFullscreen(false)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-neutral-900 px-3 font-mono text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                      <Minimize2 className="h-3.5 w-3.5" />
                      <span>Exit</span>
                      <kbd className="ml-0.5 hidden rounded bg-white/20 px-1 py-0.5 text-[10px] dark:bg-black/15 sm:inline-block">
                        ESC
                      </kbd>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Full Screen Interactive Stage */}
                <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none fixed inset-0 top-14 bg-dot-matrix [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                    className="relative z-10 flex min-h-full w-full flex-col items-center justify-start py-4 sm:py-8"
                  >
                    <div
                      key={`fs-${replayKey}-${viewportSize}`}
                      className={cn(
                        "relative w-full transition-all duration-300 ease-out",
                        viewportSize === "full" &&
                          "fullscreen-stage-expand max-w-[1400px]",
                        viewportSize === "centered" && "max-w-4xl",
                        viewportSize === "tablet" &&
                          "fullscreen-stage-expand max-w-[768px] rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-black/80",
                        viewportSize === "mobile" &&
                          "fullscreen-stage-expand max-w-[390px] rounded-3xl border border-dashed border-neutral-300 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-black/80"
                      )}
                    >
                      <ComponentPreview
                        slug={slug}
                        className={
                          viewportSize === "full" ? "max-w-none" : undefined
                        }
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
