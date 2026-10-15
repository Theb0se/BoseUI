"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, GitBranch, GitMerge, Copy, Check, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GitGraphCommit {
  id: string;
  sha: string;
  branch: string;
  message: string;
  author: string;
  date: string;
  lane: number; // 0 = main, 1 = feature, 2 = hotfix
  isMerge?: boolean;
}

export interface InteractiveGitGraphProps {
  /** Commit list to render in graph */
  commits?: GitGraphCommit[];
  /** Default selected commit SHA */
  defaultSelectedSha?: string;
  /** Callback when commit node is clicked */
  onSelectCommit?: (commit: GitGraphCommit) => void;
  className?: string;
}

const DEFAULT_COMMITS: GitGraphCommit[] = [
  {
    id: "c-1",
    sha: "8a1f9e2",
    branch: "main",
    message: "chore: release boseui v1.0.0 core catalog",
    author: "Rishabh Bose",
    date: "1 day ago",
    lane: 0,
  },
  {
    id: "c-2",
    sha: "4b2e8c1",
    branch: "feature/ai-agents",
    message: "feat: add o1 reasoning accordion & token gauge",
    author: "Rishabh Bose",
    date: "18 hours ago",
    lane: 1,
  },
  {
    id: "c-3",
    sha: "7d9c0a4",
    branch: "hotfix/cors",
    message: "fix(api): patch origin headers in registry proxy",
    author: "Dev Team",
    date: "12 hours ago",
    lane: 2,
  },
  {
    id: "c-4",
    sha: "9f3a1d8",
    branch: "main",
    message: "merge: pull request #42 from hotfix/cors",
    author: "Rishabh Bose",
    date: "6 hours ago",
    lane: 0,
    isMerge: true,
  },
  {
    id: "c-5",
    sha: "e2c8a14",
    branch: "feature/ai-agents",
    message: "feat(voice): implement Canvas 2D voice mesh orb",
    author: "Rishabh Bose",
    date: "2 hours ago",
    lane: 1,
  },
  {
    id: "c-6",
    sha: "f1a9b03",
    branch: "main",
    message: "merge: pull request #48 from feature/ai-agents",
    author: "Rishabh Bose",
    date: "Just now",
    lane: 0,
    isMerge: true,
  },
];

const LANE_COLORS = [
  { stroke: "#10B981", fill: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500" }, // main (emerald)
  { stroke: "#0EA5E9", fill: "bg-sky-500", text: "text-sky-500", border: "border-sky-500" },         // feature (sky)
  { stroke: "#F43F5E", fill: "bg-rose-500", text: "text-rose-500", border: "border-rose-500" },       // hotfix (rose)
];

export function InteractiveGitGraph({
  commits = DEFAULT_COMMITS,
  defaultSelectedSha,
  onSelectCommit,
  className,
}: InteractiveGitGraphProps) {
  const [selectedCommit, setSelectedCommit] = useState<GitGraphCommit | null>(
    commits.find((c) => c.sha === defaultSelectedSha) || commits[commits.length - 1]
  );
  const [activeBranchFilter, setActiveBranchFilter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const branches = Array.from(new Set(commits.map((c) => c.branch)));

  const handleSelect = (commit: GitGraphCommit) => {
    setSelectedCommit(commit);
    onSelectCommit?.(commit);
  };

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const nodeHeight = 52;
  const laneWidth = 26;
  const graphWidth = 100;
  const graphHeight = commits.length * nodeHeight;

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm font-sans text-xs select-none text-neutral-900 dark:text-neutral-100",
        className
      )}
    >
      {/* Title Header Bar */}
      <div className="flex h-11 w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <span className="font-semibold text-neutral-900 dark:text-white">Interactive Git Commit Tree</span>
        </div>

        {/* Branch Filter Chips */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveBranchFilter(null)}
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors",
              activeBranchFilter === null
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            All
          </button>
          {branches.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setActiveBranchFilter(b)}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors",
                activeBranchFilter === b
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              {b.replace("feature/", "").replace("hotfix/", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph & Commit List */}
      <div className="flex divide-x divide-neutral-200 dark:divide-neutral-800 overflow-x-auto bg-white dark:bg-neutral-950">
        {/* Left: SVG Graph Tracks */}
        <div className="relative shrink-0 p-3 pt-4 pl-4" style={{ width: graphWidth }}>
          <svg className="w-full" style={{ height: graphHeight }}>
            {/* Draw Connecting Bezier Curves */}
            {commits.map((commit, idx) => {
              if (idx === 0) return null;
              const prev = commits[idx - 1];
              const x1 = 16 + prev.lane * laneWidth;
              const y1 = (idx - 1) * nodeHeight + nodeHeight / 2;
              const x2 = 16 + commit.lane * laneWidth;
              const y2 = idx * nodeHeight + nodeHeight / 2;

              const laneTheme = LANE_COLORS[commit.lane % LANE_COLORS.length];

              if (x1 === x2) {
                // Straight vertical line
                return (
                  <line
                    key={`line-${idx}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={laneTheme.stroke}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                );
              }

              // Curved bezier branching / merging path
              const cx1 = x1;
              const cy1 = y1 + (y2 - y1) * 0.5;
              const cx2 = x2;
              const cy2 = y1 + (y2 - y1) * 0.5;

              return (
                <path
                  key={`path-${idx}`}
                  d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={laneTheme.stroke}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              );
            })}

            {/* Commit Circles */}
            {commits.map((commit, idx) => {
              const cx = 16 + commit.lane * laneWidth;
              const cy = idx * nodeHeight + nodeHeight / 2;
              const isSelected = selectedCommit?.sha === commit.sha;
              const laneTheme = LANE_COLORS[commit.lane % LANE_COLORS.length];

              return (
                <g
                  key={`node-${idx}`}
                  onClick={() => handleSelect(commit)}
                  className="cursor-pointer"
                >
                  {/* Selected Ripple Ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      fill="none"
                      stroke={laneTheme.stroke}
                      strokeWidth="2"
                      className="animate-ping opacity-50"
                    />
                  )}
                  {/* Outer Border */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={commit.isMerge ? "6.5" : "5.5"}
                    stroke={laneTheme.stroke}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="fill-white dark:fill-neutral-950 transition-transform hover:scale-125"
                  />
                  {/* Inner Node Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill={laneTheme.stroke}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Commit Details List */}
        <div className="flex-1 divide-y divide-neutral-200/60 dark:divide-neutral-800/60 py-1">
          {commits.map((commit, idx) => {
            const isSelected = selectedCommit?.sha === commit.sha;
            const isFiltered = activeBranchFilter && commit.branch !== activeBranchFilter;
            const laneTheme = LANE_COLORS[commit.lane % LANE_COLORS.length];

            return (
              <div
                key={commit.sha}
                style={{ height: nodeHeight }}
                onClick={() => handleSelect(commit)}
                className={cn(
                  "flex items-center justify-between px-4 py-2 cursor-pointer transition-colors",
                  isSelected
                    ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-900/40 text-neutral-500 dark:text-neutral-400",
                  isFiltered && "opacity-25"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  {commit.isMerge ? (
                    <GitMerge className={cn("h-3.5 w-3.5 shrink-0", laneTheme.text)} />
                  ) : (
                    <GitCommit className={cn("h-3.5 w-3.5 shrink-0", laneTheme.text)} />
                  )}

                  <div className="truncate">
                    <span className="text-xs font-medium text-neutral-900 dark:text-white truncate block">
                      {commit.message}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate block">
                      {commit.author} • {commit.date}
                    </span>
                  </div>
                </div>

                {/* Right: Branch pill and SHA */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={cn(
                      "hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border",
                      laneTheme.text,
                      laneTheme.border,
                      "bg-neutral-100 dark:bg-neutral-900"
                    )}
                  >
                    {commit.branch}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
                    {commit.sha}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Commit Inspector Drawer */}
      {selectedCommit && (
        <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white font-mono">
              #{selectedCommit.sha}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 truncate">
              "{selectedCommit.message}"
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopySha(selectedCommit.sha)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors text-[11px]"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3 text-neutral-400" />
            )}
            <span>{copied ? "Copied" : "Copy SHA"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
