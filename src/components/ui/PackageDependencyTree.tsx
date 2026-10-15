"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Search,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PackageNode {
  name: string;
  version: string;
  sizeKb: number;
  license: string;
  hasVulnerability?: boolean;
  children?: PackageNode[];
}

export interface PackageDependencyTreeProps {
  /** Root package identifier */
  packageName?: string;
  /** Root package version */
  version?: string;
  /** Bundle size gzipped */
  bundleSizeKb?: number;
  /** Dependencies tree */
  dependencies?: PackageNode[];
  className?: string;
}

const DEFAULT_DEPS: PackageNode[] = [
  {
    name: "framer-motion",
    version: "^11.11.0",
    sizeKb: 34.2,
    license: "MIT",
    children: [
      { name: "@motionone/dom", version: "^10.16.4", sizeKb: 8.4, license: "MIT" },
      { name: "@motionone/utils", version: "^10.15.1", sizeKb: 2.1, license: "MIT" },
    ],
  },
  {
    name: "lucide-react",
    version: "^0.454.0",
    sizeKb: 18.6,
    license: "ISC",
  },
  {
    name: "tailwind-merge",
    version: "^2.5.4",
    sizeKb: 6.8,
    license: "MIT",
  },
  {
    name: "clsx",
    version: "^2.1.1",
    sizeKb: 1.2,
    license: "MIT",
  },
  {
    name: "semver",
    version: "^7.6.2",
    sizeKb: 9.4,
    license: "ISC",
    hasVulnerability: true,
  },
];

export function PackageDependencyTree({
  packageName = "boseui",
  version = "1.0.0",
  bundleSizeKb = 60.8,
  dependencies = DEFAULT_DEPS,
  className,
}: PackageDependencyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "framer-motion": true,
  });
  const [search, setSearch] = useState("");
  const [copiedInstall, setCopiedInstall] = useState(false);

  const toggleExpand = (name: string) => {
    setExpandedNodes((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCopyInstall = () => {
    navigator.clipboard?.writeText(`npm i ${packageName}`);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const filteredDeps = dependencies.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.children?.some((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">{packageName}</h3>
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
                v{version}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {dependencies.length} direct dependencies • {bundleSizeKb} kB min+gzip
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyInstall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 shadow-xs"
        >
          {copiedInstall ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>npm i {packageName}</span>
        </button>
      </div>

      {/* Filter and Security Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex items-center">
          <Search className="h-3 w-3 text-neutral-400 absolute left-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dependencies..."
            className="pl-7 pr-3 py-1 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 w-40 sm:w-56 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
            <ShieldCheck className="h-3 w-3" /> 0 Critical CVEs
          </span>
        </div>
      </div>

      {/* Tree View */}
      <div className="flex flex-col gap-1 font-mono text-xs">
        {filteredDeps.map((node) => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expandedNodes[node.name];

          return (
            <div key={node.name} className="flex flex-col">
              {/* Parent node */}
              <div
                onClick={() => hasChildren && toggleExpand(node.name)}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group",
                  hasChildren ? "cursor-pointer bg-neutral-50/70 dark:bg-neutral-900/40" : "bg-neutral-50/40 dark:bg-neutral-900/20"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {hasChildren ? (
                    isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    )
                  ) : (
                    <span className="w-3.5" />
                  )}

                  <span className="font-semibold text-neutral-900 dark:text-white truncate">{node.name}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate">{node.version}</span>

                  {node.hasVulnerability && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded font-sans">
                      <AlertTriangle className="h-2.5 w-2.5" /> Advisory
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-sans px-1.5 py-0.2 rounded border bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800">
                    {node.license}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{node.sizeKb} kB</span>
                </div>
              </div>

              {/* Sub-tree children */}
              <AnimatePresence>
                {hasChildren && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-col gap-1 pl-6 pt-1 border-l-2 border-neutral-200 dark:border-neutral-800 ml-4 overflow-hidden"
                  >
                    {node.children?.map((child) => (
                      <div
                        key={child.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-500 dark:text-neutral-400"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-900 dark:text-white">{child.name}</span>
                          <span className="text-[11px]">{child.version}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-sans px-1 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
                            {child.license}
                          </span>
                          <span className="text-[11px]">{child.sizeKb} kB</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
