"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Rocket,
  Check,
  Copy,
  GitCommit,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SemverBump = "patch" | "minor" | "major";

export interface CommitItem {
  id: string;
  type: "feat" | "fix" | "breaking";
  title: string;
  sha: string;
  author: string;
}

export interface SemverReleaseDraftCardProps {
  /** Current release semver string */
  currentVersion?: string;
  /** Repository name */
  repoName?: string;
  /** Commits list */
  unreleasedCommits?: CommitItem[];
  /** Callback when release is published */
  onPublish?: (version: string, markdown: string) => void;
  className?: string;
}

const DEFAULT_COMMITS: CommitItem[] = [
  {
    id: "c-1",
    type: "feat",
    title: "add tactile 3D physical keycap keyboard listeners",
    sha: "4b2e8c1",
    author: "Rishabh",
  },
  {
    id: "c-2",
    type: "fix",
    title: "patch origin headers in public registry reverse proxy",
    sha: "7d9c0a4",
    author: "DevTeam",
  },
  {
    id: "c-3",
    type: "breaking",
    title: "migrate component metadata to typed PulseComponentMeta interface",
    sha: "8a1f9e2",
    author: "Rishabh",
  },
  {
    id: "c-4",
    type: "feat",
    title: "introduce interactive syntax code diff comparator",
    sha: "9f3a1d8",
    author: "Rishabh",
  },
];

function calculateNextVersion(current: string, bump: SemverBump): string {
  const clean = current.replace(/^v/, "");
  const [major, minor, patch] = clean.split(".").map(Number);
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) return "v1.0.0";

  if (bump === "patch") return `v${major}.${minor}.${patch + 1}`;
  if (bump === "minor") return `v${major}.${minor + 1}.0`;
  if (bump === "major") return `v${major + 1}.0.0`;
  return current;
}

export function SemverReleaseDraftCard({
  currentVersion = "v1.2.4",
  repoName = "boseui/core",
  unreleasedCommits = DEFAULT_COMMITS,
  onPublish,
  className,
}: SemverReleaseDraftCardProps) {
  const [bump, setBump] = useState<SemverBump>("minor");
  const [selectedCommitIds, setSelectedCommitIds] = useState<string[]>(
    unreleasedCommits.map((c) => c.id)
  );
  const [isPublished, setIsPublished] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const nextVersion = calculateNextVersion(currentVersion, bump);

  const toggleCommit = (id: string) => {
    setSelectedCommitIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedCommits = unreleasedCommits.filter((c) => selectedCommitIds.includes(c.id));

  const generateMarkdown = () => {
    let md = `## Release ${nextVersion}\n\n`;
    const features = selectedCommits.filter((c) => c.type === "feat");
    const fixes = selectedCommits.filter((c) => c.type === "fix");
    const breaking = selectedCommits.filter((c) => c.type === "breaking");

    if (breaking.length > 0) {
      md += `### ⚠️ Breaking Changes\n` + breaking.map((c) => `- ${c.title} (\`${c.sha}\`)`).join("\n") + "\n\n";
    }
    if (features.length > 0) {
      md += `### ✨ Features\n` + features.map((c) => `- ${c.title} (\`${c.sha}\`)`).join("\n") + "\n\n";
    }
    if (fixes.length > 0) {
      md += `### 🐛 Bug Fixes\n` + fixes.map((c) => `- ${c.title} (\`${c.sha}\`)`).join("\n") + "\n\n";
    }
    return md;
  };

  const handleCopyMd = () => {
    navigator.clipboard?.writeText(generateMarkdown());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handlePublish = () => {
    setIsPublished(true);
    onPublish?.(nextVersion, generateMarkdown());
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">
              Draft Release ({repoName})
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Current version: <span className="font-mono text-neutral-900 dark:text-white font-semibold">{currentVersion}</span>
          </p>
        </div>

        {/* Bump Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          {(["patch", "minor", "major"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBump(b)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg capitalize transition-all",
                bump === b
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Target Version Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-medium text-neutral-900 dark:text-white">Next Tag:</span>
          <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{nextVersion}</span>
        </div>
        <button
          onClick={handleCopyMd}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          {copiedMd ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>Changelog MD</span>
        </button>
      </div>

      {/* Commit List with Checkboxes */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Included Commits ({selectedCommits.length}/{unreleasedCommits.length})
        </span>

        <div className="flex flex-col gap-1.5">
          {unreleasedCommits.map((c) => {
            const isChecked = selectedCommitIds.includes(c.id);

            return (
              <div
                key={c.id}
                onClick={() => toggleCommit(c.id)}
                className={cn(
                  "flex items-center justify-between gap-3 p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer",
                  isChecked
                    ? "bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800"
                    : "bg-neutral-50/50 dark:bg-neutral-900/20 border-transparent opacity-50"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-0 shrink-0"
                  />
                  <span
                    className={cn(
                      "text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border shrink-0 font-sans",
                      c.type === "feat" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                      c.type === "fix" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      c.type === "breaking" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}
                  >
                    {c.type}
                  </span>
                  <span className="text-neutral-900 dark:text-white truncate">{c.title}</span>
                </div>

                <span className="text-neutral-500 dark:text-neutral-400 text-[11px] shrink-0">{c.sha}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Publish CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Generates Git tag &amp; GitHub release notes
        </span>
        <button
          onClick={handlePublish}
          disabled={isPublished}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs",
            isPublished
              ? "bg-emerald-500 text-white cursor-default"
              : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 active:scale-95"
          )}
        >
          {isPublished ? (
            <>
              <Check className="h-4 w-4" />
              <span>Published {nextVersion}</span>
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              <span>Publish Release</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
