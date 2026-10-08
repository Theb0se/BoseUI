"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Copy,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Search,
} from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

export interface FileTreeNode {
  id: string;
  name: string;
  type: "file" | "folder";
  badge?: string;
  children?: FileTreeNode[];
}

export interface FileTreeProps {
  /** Hierarchical file tree data */
  data?: FileTreeNode[];
  /** Default expanded folder IDs */
  defaultExpandedIds?: string[];
  /** Default selected file/folder ID */
  defaultSelectedId?: string;
  /** Callback when a node is clicked */
  onSelect?: (node: FileTreeNode) => void;
  /** Show top search filter input */
  searchable?: boolean;
  /** Additional container class names */
  className?: string;
}

const DEFAULT_TREE: FileTreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "src/app",
        name: "app",
        type: "folder",
        children: [
          { id: "src/app/layout.tsx", name: "layout.tsx", type: "file", badge: "TSX" },
          { id: "src/app/page.tsx", name: "page.tsx", type: "file", badge: "TSX" },
          { id: "src/app/globals.css", name: "globals.css", type: "file", badge: "CSS" },
        ],
      },
      {
        id: "src/components",
        name: "components",
        type: "folder",
        children: [
          {
            id: "src/components/ui",
            name: "ui",
            type: "folder",
            children: [
              { id: "src/components/ui/Autocomplete.tsx", name: "Autocomplete.tsx", type: "file", badge: "NEW" },
              { id: "src/components/ui/FileTree.tsx", name: "FileTree.tsx", type: "file", badge: "NEW" },
              { id: "src/components/ui/MagneticButton.tsx", name: "MagneticButton.tsx", type: "file" },
            ],
          },
        ],
      },
      {
        id: "src/lib",
        name: "lib",
        type: "folder",
        children: [
          { id: "src/lib/utils.ts", name: "utils.ts", type: "file", badge: "TS" },
        ],
      },
    ],
  },
  { id: "package.json", name: "package.json", type: "file", badge: "JSON" },
  { id: "README.md", name: "README.md", type: "file", badge: "MD" },
];

function collectFolderIds(nodes: FileTreeNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.type === "folder") {
      ids.push(node.id);
      if (node.children) {
        ids.push(...collectFolderIds(node.children));
      }
    }
  }
  return ids;
}

function getFileIcon(name: string) {
  if (name.endsWith(".json")) {
    return <FileJson className="h-3.5 w-3.5 shrink-0 text-neutral-400" />;
  }
  if (name.endsWith(".md") || name.endsWith(".txt")) {
    return <FileText className="h-3.5 w-3.5 shrink-0 text-neutral-400" />;
  }
  return <FileCode2 className="h-3.5 w-3.5 shrink-0 text-neutral-400" />;
}

function filterTree(nodes: FileTreeNode[], query: string): FileTreeNode[] {
  if (!query.trim()) return nodes;
  const lower = query.toLowerCase();

  return nodes.reduce<FileTreeNode[]>((acc, node) => {
    const matchesSelf = node.name.toLowerCase().includes(lower);
    if (node.type === "folder" && node.children) {
      const filteredChildren = filterTree(node.children, query);
      if (matchesSelf || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }
    } else if (matchesSelf) {
      acc.push(node);
    }
    return acc;
  }, []);
}

export function FileTree({
  data = DEFAULT_TREE,
  defaultExpandedIds = ["src", "src/components", "src/components/ui"],
  defaultSelectedId = "src/components/ui/FileTree.tsx",
  onSelect,
  searchable = true,
  className,
}: FileTreeProps) {
  const shouldReduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedIds)
  );
  const [selectedId, setSelectedId] = useState<string>(defaultSelectedId);
  const [query, setQuery] = useState("");
  const [copiedPath, setCopiedPath] = useState(false);

  const allFolderIds = useMemo(() => collectFolderIds(data), [data]);
  const visibleData = useMemo(() => filterTree(data, query), [data, query]);

  const toggleFolder = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopyPath = async () => {
    const ok = await copyToClipboard(selectedId);
    if (ok) {
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 1500);
    }
  };

  const renderNode = (node: FileTreeNode, depth = 0) => {
    const isFolder = node.type === "folder";
    const isOpen = query.trim().length > 0 || expanded.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div
        key={node.id}
        role="treeitem"
        aria-expanded={isFolder ? isOpen : undefined}
        aria-selected={isSelected}
      >
        <button
          type="button"
          onClick={() => {
            setSelectedId(node.id);
            onSelect?.(node);
            if (isFolder) toggleFolder(node.id);
          }}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={cn(
            "group flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg py-1.5 pr-2.5 text-left text-xs transition-colors",
            isSelected
              ? "bg-black font-medium text-white dark:bg-white dark:text-black"
              : "text-neutral-700 hover:bg-neutral-100 hover:text-black dark:text-neutral-300 dark:hover:bg-[#141414] dark:hover:text-white"
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            {isFolder ? (
              <>
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-150",
                    isOpen && "rotate-90",
                    isSelected
                      ? "text-white dark:text-black"
                      : "text-neutral-400"
                  )}
                />
                {isOpen ? (
                  <FolderOpen
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isSelected
                        ? "text-white dark:text-black"
                        : "text-neutral-600 dark:text-neutral-300"
                    )}
                  />
                ) : (
                  <Folder
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isSelected
                        ? "text-white dark:text-black"
                        : "text-neutral-500 dark:text-neutral-400"
                    )}
                  />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5 shrink-0" />
                {getFileIcon(node.name)}
              </>
            )}
            <span className="truncate font-mono text-[11.5px]">{node.name}</span>
          </span>

          {node.badge && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                isSelected
                  ? "bg-white/20 text-white dark:bg-black/15 dark:text-black"
                  : "border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-[#262626] dark:bg-[#121212] dark:text-neutral-400"
              )}
            >
              {node.badge}
            </span>
          )}
        </button>

        <AnimatePresence initial={false}>
          {isFolder && isOpen && node.children && node.children.length > 0 && (
            <motion.div
              role="group"
              initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={
                shouldReduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }
              }
              exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" }}
              className="overflow-hidden"
            >
              {node.children.map((child) => renderNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div
      role="tree"
      aria-label="File explorer"
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {searchable && (
        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2 dark:border-[#1F1F1F]">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter files..."
              aria-label="Filter files"
              className="w-full bg-transparent font-mono text-xs text-black placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setExpanded((prev) =>
                prev.size >= allFolderIds.length
                  ? new Set()
                  : new Set(allFolderIds)
              )
            }
            className="shrink-0 cursor-pointer rounded border border-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
          >
            {expanded.size >= allFolderIds.length ? "Collapse" : "Expand"}
          </button>
        </div>
      )}

      <div className="max-h-72 overflow-y-auto p-2">
        {visibleData.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            No matching files
          </div>
        ) : (
          visibleData.map((node) => renderNode(node, 0))
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-neutral-200 bg-neutral-50/70 px-3 py-2 font-mono text-[10px] text-neutral-500 dark:border-[#1F1F1F] dark:bg-[#050505]">
        <span className="truncate">{selectedId}</span>
        <button
          type="button"
          onClick={handleCopyPath}
          aria-label="Copy selected file path"
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-neutral-500 transition-colors hover:text-black dark:hover:text-white"
        >
          {copiedPath ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default FileTree;
