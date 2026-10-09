"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode2,
  Columns2,
  Rows3,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  GitCommit,
  Plus,
  Minus,
  FileDiff,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DiffViewMode = "split" | "unified";

export interface DiffLine {
  type: "normal" | "add" | "del";
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface DiffFile {
  id: string;
  fileName: string;
  language: string;
  additions: number;
  deletions: number;
  hunkHeader: string;
  foldCount: number;
  hiddenLines: DiffLine[];
  visibleLines: DiffLine[];
}

export interface DiffViewerProps {
  initialViewMode?: DiffViewMode;
  fileName?: string;
  allowCopyDiff?: boolean;
  className?: string;
}

const SAMPLE_FILES: DiffFile[] = [
  {
    id: "session-ts",
    fileName: "src/auth/session.ts",
    language: "typescript",
    additions: 8,
    deletions: 4,
    hunkHeader: "@@ -14,12 +14,16 @@ export async function verifySession(token: string)",
    foldCount: 14,
    hiddenLines: [
      { type: "normal", oldLineNumber: 1, newLineNumber: 1, content: "import { jwtVerify, createRemoteJWKSet } from '@/lib/auth-jwt';" },
      { type: "normal", oldLineNumber: 2, newLineNumber: 2, content: "import { db } from '@/lib/database';" },
      { type: "normal", oldLineNumber: 3, newLineNumber: 3, content: "import type { UserSession } from '@/types/auth';" },
      { type: "normal", oldLineNumber: 4, newLineNumber: 4, content: "" },
      { type: "normal", oldLineNumber: 5, newLineNumber: 5, content: "const JWKS = createRemoteJWKSet(new URL(process.env.AUTH_JWKS_URL!));" },
    ],
    visibleLines: [
      { type: "normal", oldLineNumber: 14, newLineNumber: 14, content: "export async function verifySession(token: string) {" },
      { type: "del", oldLineNumber: 15, content: "  // Legacy slow synchronous token verification" },
      { type: "del", oldLineNumber: 16, content: "  const session = await db.sessions.findFirst({ where: { token } });" },
      { type: "del", oldLineNumber: 17, content: "  if (!session) return null;" },
      { type: "add", newLineNumber: 15, content: "  // Fast-path edge JWKS verification via V8 crypto isolate" },
      { type: "add", newLineNumber: 16, content: "  const { payload } = await jwtVerify(token, JWKS, {" },
      { type: "add", newLineNumber: 17, content: "    issuer: 'urn:pulse:issuer'," },
      { type: "add", newLineNumber: 18, content: "    audience: 'urn:pulse:api'," },
      { type: "add", newLineNumber: 19, content: "  });" },
      { type: "add", newLineNumber: 20, content: "  const session = await db.sessions.getCached(payload.sub as string);" },
      { type: "normal", oldLineNumber: 18, newLineNumber: 21, content: "  if (session.revokedAt) {" },
      { type: "del", oldLineNumber: 19, content: "    throw new Error('SESSION_REVOKED');" },
      { type: "add", newLineNumber: 22, content: "    throw new AuthenticationError('TOKEN_REVOKED', { cause: 401 });" },
      { type: "normal", oldLineNumber: 20, newLineNumber: 23, content: "  }" },
      { type: "normal", oldLineNumber: 21, newLineNumber: 24, content: "  return session;" },
      { type: "normal", oldLineNumber: 22, newLineNumber: 25, content: "}" },
    ],
  },
  {
    id: "alloc-rs",
    fileName: "crates/engine/src/alloc.rs",
    language: "rust",
    additions: 6,
    deletions: 3,
    hunkHeader: "@@ -42,8 +42,11 @@ impl MemoryPool",
    foldCount: 22,
    hiddenLines: [
      { type: "normal", oldLineNumber: 1, newLineNumber: 1, content: "use std::alloc::{alloc, dealloc, Layout};" },
      { type: "normal", oldLineNumber: 2, newLineNumber: 2, content: "use std::sync::atomic::{AtomicUsize, Ordering};" },
    ],
    visibleLines: [
      { type: "normal", oldLineNumber: 42, newLineNumber: 42, content: "pub fn acquire_slice(&mut self, capacity: usize) -> &mut [u8] {" },
      { type: "del", oldLineNumber: 43, content: "    let raw_buf = vec![0u8; capacity];" },
      { type: "del", oldLineNumber: 44, content: "    self.heap_allocations.fetch_add(1, Ordering::Relaxed);" },
      { type: "add", newLineNumber: 43, content: "    // Zero-copy ring buffer slice allocation" },
      { type: "add", newLineNumber: 44, content: "    let offset = self.ring_head.fetch_add(capacity, Ordering::AcqRel);" },
      { type: "add", newLineNumber: 45, content: "    assert!(offset + capacity <= self.ring_capacity, \"OOM in ring pool\");" },
      { type: "normal", oldLineNumber: 45, newLineNumber: 46, content: "    unsafe {" },
      { type: "del", oldLineNumber: 46, content: "        Box::leak(raw_buf.into_boxed_slice())" },
      { type: "add", newLineNumber: 47, content: "        std::slice::from_raw_parts_mut(self.base_ptr.add(offset), capacity)" },
      { type: "normal", oldLineNumber: 47, newLineNumber: 48, content: "    }" },
      { type: "normal", oldLineNumber: 48, newLineNumber: 49, content: "}" },
    ],
  },
];

export function DiffViewer({
  initialViewMode = "unified",
  allowCopyDiff = true,
  className,
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<DiffViewMode>(initialViewMode);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [isFoldExpanded, setIsFoldExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const file = SAMPLE_FILES[activeFileIndex] || SAMPLE_FILES[0];
  const allLines = isFoldExpanded
    ? [...file.hiddenLines, ...file.visibleLines]
    : file.visibleLines;

  const handleCopyRaw = () => {
    const rawPatch = [
      `--- a/${file.fileName}`,
      `+++ b/${file.fileName}`,
      file.hunkHeader,
      ...allLines.map((l) => {
        if (l.type === "add") return `+${l.content}`;
        if (l.type === "del") return `-${l.content}`;
        return ` ${l.content}`;
      }),
    ].join("\n");

    navigator.clipboard?.writeText(rawPatch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#090B10] p-6 text-white shadow-2xl flex flex-col justify-between selection:bg-neutral-700",
        className
      )}
    >
      {/* Top Header Toolbar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 font-mono text-xs font-bold text-neutral-200">
            <FileDiff className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-white font-mono">
                {file.fileName}
              </h3>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-900/50">
                  +{file.additions}
                </span>
                <span className="text-rose-400 font-semibold bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-900/50">
                  -{file.deletions}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Pull Request #412 • branch <code className="text-neutral-300">feat/perf-optimization</code>
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* File Switcher */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1">
            {SAMPLE_FILES.map((f, i) => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFileIndex(i);
                  setIsFoldExpanded(false);
                }}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-mono rounded transition-all",
                  activeFileIndex === i
                    ? "bg-neutral-800 text-white font-bold shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {f.fileName.split("/").pop()}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1">
            <button
              onClick={() => setViewMode("unified")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-all",
                viewMode === "unified"
                  ? "bg-neutral-800 text-white font-bold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <Rows3 className="h-3 w-3" />
              <span>Unified</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-all",
                viewMode === "split"
                  ? "bg-neutral-800 text-white font-bold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <Columns2 className="h-3 w-3" />
              <span>Split</span>
            </button>
          </div>

          {/* Copy Patch */}
          {allowCopyDiff && (
            <button
              onClick={handleCopyRaw}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 hover:text-white transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>Copied Patch</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Diff</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Diff Code Body */}
      <div className="relative z-10 my-4 flex-1 overflow-x-auto rounded-xl border border-neutral-800/90 bg-[#05060A] font-mono text-xs shadow-inner">
        {/* Fold Expand Bar */}
        <div
          onClick={() => setIsFoldExpanded(!isFoldExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsFoldExpanded(!isFoldExpanded);
            }
          }}
          className="flex cursor-pointer items-center justify-between border-b border-neutral-800/80 bg-neutral-900/50 px-4 py-1.5 text-[11px] text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isFoldExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
            )}
            <span className="text-cyan-400 font-medium">{file.hunkHeader}</span>
          </div>
          <span className="text-neutral-500 text-[10px]">
            {isFoldExpanded ? "Collapse unchanged lines" : `Expand ${file.foldCount} unchanged lines`}
          </span>
        </div>

        {/* Code Content: Unified Mode */}
        {viewMode === "unified" && (
          <div className="divide-y divide-neutral-900/40">
            {allLines.map((line, idx) => {
              const isAdd = line.type === "add";
              const isDel = line.type === "del";

              return (
                <div
                  key={idx}
                  className={cn(
                    "flex items-stretch text-[11px] font-mono leading-5 transition-colors",
                    isAdd && "bg-emerald-950/25 text-emerald-200 hover:bg-emerald-950/40",
                    isDel && "bg-rose-950/25 text-rose-200 hover:bg-rose-950/40",
                    !isAdd && !isDel && "text-neutral-300 hover:bg-white/[0.02]"
                  )}
                >
                  {/* Old line gutter */}
                  <span className="w-10 select-none text-right pr-2 text-neutral-600 bg-neutral-950/40 border-r border-neutral-900">
                    {line.oldLineNumber || ""}
                  </span>

                  {/* New line gutter */}
                  <span className="w-10 select-none text-right pr-2 text-neutral-600 bg-neutral-950/40 border-r border-neutral-900">
                    {line.newLineNumber || ""}
                  </span>

                  {/* Indicator symbol (+ / - / space) */}
                  <span
                    className={cn(
                      "w-6 select-none text-center font-bold",
                      isAdd && "text-emerald-400",
                      isDel && "text-rose-400",
                      !isAdd && !isDel && "text-neutral-600"
                    )}
                  >
                    {isAdd ? "+" : isDel ? "-" : " "}
                  </span>

                  {/* Code Line text */}
                  <span className="flex-1 px-2 py-0.5 whitespace-pre overflow-x-auto">
                    {line.content}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Code Content: Split Mode (Side by Side) */}
        {viewMode === "split" && (
          <div className="grid grid-cols-2 divide-x divide-neutral-800">
            {/* Left Column (Deletions / Original) */}
            <div className="divide-y divide-neutral-900/40">
              <div className="bg-neutral-900/80 px-3 py-1 text-[10px] uppercase font-mono text-neutral-400 border-b border-neutral-800">
                Original / Deletions
              </div>
              {allLines
                .filter((l) => l.type !== "add")
                .map((line, idx) => {
                  const isDel = line.type === "del";
                  return (
                    <div
                      key={`left-${idx}`}
                      className={cn(
                        "flex items-stretch text-[11px] font-mono leading-5",
                        isDel ? "bg-rose-950/30 text-rose-200" : "text-neutral-300"
                      )}
                    >
                      <span className="w-10 select-none text-right pr-2 text-neutral-600 bg-neutral-950/40 border-r border-neutral-900">
                        {line.oldLineNumber || ""}
                      </span>
                      <span className="w-6 select-none text-center font-bold text-rose-400">
                        {isDel ? "-" : " "}
                      </span>
                      <span className="flex-1 px-2 py-0.5 whitespace-pre overflow-x-auto">
                        {line.content}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Right Column (Additions / Patched) */}
            <div className="divide-y divide-neutral-900/40">
              <div className="bg-neutral-900/80 px-3 py-1 text-[10px] uppercase font-mono text-neutral-400 border-b border-neutral-800">
                Modified / Additions
              </div>
              {allLines
                .filter((l) => l.type !== "del")
                .map((line, idx) => {
                  const isAdd = line.type === "add";
                  return (
                    <div
                      key={`right-${idx}`}
                      className={cn(
                        "flex items-stretch text-[11px] font-mono leading-5",
                        isAdd ? "bg-emerald-950/30 text-emerald-200" : "text-neutral-300"
                      )}
                    >
                      <span className="w-10 select-none text-right pr-2 text-neutral-600 bg-neutral-950/40 border-r border-neutral-900">
                        {line.newLineNumber || ""}
                      </span>
                      <span className="w-6 select-none text-center font-bold text-emerald-400">
                        {isAdd ? "+" : " "}
                      </span>
                      <span className="flex-1 px-2 py-0.5 whitespace-pre overflow-x-auto">
                        {line.content}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Footer telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800/80 pt-3 text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <GitCommit className="h-3 w-3 text-neutral-500" />
          <span>COMMIT HASH: 8f49a2c</span>
        </div>
        <div className="flex items-center gap-4">
          <span>MODE: {viewMode.toUpperCase()} VIEW</span>
          <span>SYNTAX: {file.language.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

export default DiffViewer;
