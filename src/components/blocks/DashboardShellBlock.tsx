"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Terminal,
  FolderTree,
  GitPullRequest,
  CheckCircle2,
  Users,
  Maximize2,
  Columns,
  Layers,
} from "lucide-react";
import { FileTree } from "@/components/ui/FileTree";
import { DeploymentTimeline } from "@/components/ui/DeploymentTimeline";
import { DiffViewer } from "@/components/ui/DiffViewer";
import { MultiplayerCursors } from "@/components/ui/MultiplayerCursors";
import { cn } from "@/lib/utils";

export interface DashboardShellBlockProps {
  repoName?: string;
  branchName?: string;
  className?: string;
}

export function DashboardShellBlock({
  repoName = "boseui/quantum-core",
  branchName = "feature/kinetic-physics-v3",
  className,
}: DashboardShellBlockProps) {
  const [activeTab, setActiveTab] = useState<"diff" | "deploy">("diff");
  const [selectedFile, setSelectedFile] = useState("src/components/ui/Button.tsx");

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[780px] overflow-hidden rounded-3xl bg-[#090b14] text-white border border-neutral-800 shadow-2xl flex flex-col",
        className
      )}
    >
      {/* Top Application Workspace Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-neutral-800/80 bg-neutral-950/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>{repoName}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-xs font-mono text-neutral-300">
            <GitBranch className="h-3 w-3 text-emerald-400" />
            <span>{branchName}</span>
          </div>
        </div>

        {/* View Switcher & Live Peer Status */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-neutral-800 bg-neutral-900 p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("diff")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                activeTab === "diff"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              Diff Review
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("deploy")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                activeTab === "deploy"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              CI / CD Pipeline
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[11px] font-mono text-purple-300">
            <Users className="h-3 w-3 text-purple-400" />
            <span>3 Peers Live</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Body: FileTree Sidebar + Main Panel */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-neutral-800/80 bg-neutral-950/50 p-4">
          <div className="flex items-center justify-between pb-3 text-xs font-mono uppercase tracking-wider text-neutral-400">
            <span>Explorer</span>
            <FolderTree className="h-3.5 w-3.5 text-neutral-500" />
          </div>
          <FileTree
            searchable={false}
            onSelect={(node) => setSelectedFile(node.name)}
            className="border-0 bg-transparent p-0"
          />
        </div>

        {/* Main Center Panel: Tabbed between DiffViewer and DeploymentTimeline */}
        <div className="relative flex-1 p-4 lg:p-6 overflow-hidden flex flex-col justify-between">
          {activeTab === "diff" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  Inspecting changes in: <strong className="text-cyan-300">{selectedFile}</strong>
                </span>
                <span className="text-xs font-mono text-emerald-400">+148 additions / -32 deletions</span>
              </div>
              <DiffViewer
                fileName={selectedFile}
                initialViewMode="split"
                className="min-h-[460px] border-neutral-800 bg-neutral-950/70"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  Active Vercel Edge Pipeline: <strong className="text-emerald-400">Ready in 310 Regions</strong>
                </span>
              </div>
              <DeploymentTimeline
                branch={branchName}
                commitSha="8f2a9e1"
                autoPlay={true}
                className="min-h-[460px] border-neutral-800 bg-neutral-950/70"
              />
            </div>
          )}

          {/* Bottom Telemetry Strip */}
          <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              TypeScript 5.6 · Zero Type Errors
            </span>
            <span>Multiplayer Session: Synced via CRDT</span>
          </div>
        </div>
      </div>

      {/* Real-time Multiplayer Collaborative Cursors Overlay */}
      <MultiplayerCursors
        showGrid={false}
        overlayOnly={true}
        className="pointer-events-none absolute inset-0 z-20"
      />
    </div>
  );
}

export default DashboardShellBlock;
