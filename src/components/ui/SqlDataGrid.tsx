"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Search,
  Plus,
  Download,
  Copy,
  Check,
  ChevronDown,
  Table,
  Filter,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SqlColumn {
  key: string;
  label: string;
  type: "UUID" | "VARCHAR" | "BOOLEAN" | "INT" | "TIMESTAMPTZ" | "JSONB";
}

export interface SqlRow {
  id: string;
  [key: string]: string | number | boolean | null;
}

export interface SqlDataGridProps {
  /** Table name header */
  tableName?: string;
  /** Schema columns definitions */
  columns?: SqlColumn[];
  /** Initial rows */
  initialRows?: SqlRow[];
  /** Callback when cell is updated */
  onCellEdit?: (rowId: string, colKey: string, newValue: unknown) => void;
  className?: string;
}

const DEFAULT_COLUMNS: SqlColumn[] = [
  { key: "id", label: "id", type: "UUID" },
  { key: "username", label: "username", type: "VARCHAR" },
  { key: "tier", label: "tier", type: "VARCHAR" },
  { key: "is_active", label: "is_active", type: "BOOLEAN" },
  { key: "credits", label: "credits", type: "INT" },
  { key: "created_at", label: "created_at", type: "TIMESTAMPTZ" },
];

const DEFAULT_ROWS: SqlRow[] = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    username: "alex_mercer",
    tier: "enterprise",
    is_active: true,
    credits: 4500,
    created_at: "2026-10-12T10:14:00Z",
  },
  {
    id: "f9e8d7c6-b5a4-3210-9876-54321fedcba9",
    username: "sara_chen",
    tier: "pro",
    is_active: true,
    credits: 1200,
    created_at: "2026-10-11T18:32:00Z",
  },
  {
    id: "10293847-5647-3829-1029-384756102938",
    username: "dev_bot_9",
    tier: "starter",
    is_active: false,
    credits: 0,
    created_at: "2026-10-09T08:00:00Z",
  },
  {
    id: "84739201-9283-7461-9201-837465928172",
    username: "marcus_v",
    tier: "pro",
    is_active: true,
    credits: 890,
    created_at: "2026-10-08T12:45:00Z",
  },
];

const TYPE_COLORS: Record<string, string> = {
  UUID: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  VARCHAR: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  BOOLEAN: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  INT: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  TIMESTAMPTZ: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
  JSONB: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
};

export function SqlDataGrid({
  tableName = "public.users",
  columns = DEFAULT_COLUMNS,
  initialRows = DEFAULT_ROWS,
  onCellEdit,
  className,
}: SqlDataGridProps) {
  const [rows, setRows] = useState<SqlRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [activeCell, setActiveCell] = useState<{ rowId: string; colKey: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);

  const filteredRows = rows.filter((r) =>
    Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const handleCellClick = (rowId: string, colKey: string, currentVal: unknown) => {
    setActiveCell({ rowId, colKey });
    setEditValue(String(currentVal ?? ""));
  };

  const handleSaveCell = () => {
    if (!activeCell) return;
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === activeCell.rowId) {
          return { ...r, [activeCell.colKey]: editValue };
        }
        return r;
      })
    );
    onCellEdit?.(activeCell.rowId, activeCell.colKey, editValue);
    setActiveCell(null);
  };

  const handleCopyInsert = () => {
    const sql = `INSERT INTO ${tableName} (${columns.map((c) => c.key).join(", ")}) VALUES\n` +
      rows.map((r) => `  (${columns.map((c) => `'${r[c.key]}'`).join(", ")})`).join(",\n") + ";";
    navigator.clipboard?.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white shadow-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col overflow-hidden",
        className
      )}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Database className="h-4 w-4 text-neutral-900 dark:text-white" />
          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{tableName}</span>
          <span className="text-[11px] font-mono text-neutral-600 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800">
            {filteredRows.length} rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter */}
          <div className="relative flex items-center">
            <Search className="h-3 w-3 text-neutral-400 dark:text-neutral-500 absolute left-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter table..."
              className="pl-7 pr-3 py-1 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 w-32 sm:w-44 font-mono shadow-xs"
            />
          </div>

          <button
            onClick={handleCopyInsert}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300 transition-colors shadow-xs"
          >
            {copiedSql ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            <span>Export SQL</span>
          </button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-neutral-100/70 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
              {columns.map((col) => (
                <th key={col.key} className="p-3 font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-900 dark:text-white font-semibold">{col.label}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded border font-mono font-medium",
                        TYPE_COLORS[col.type] || "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      )}
                    >
                      {col.type}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-neutral-200/70 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors group"
              >
                {columns.map((col) => {
                  const val = row[col.key];
                  const isEditing = activeCell?.rowId === row.id && activeCell?.colKey === col.key;

                  return (
                    <td
                      key={col.key}
                      onClick={() => handleCellClick(row.id, col.key, val)}
                      className={cn(
                        "p-3 whitespace-nowrap cursor-pointer transition-all border-r border-transparent hover:border-neutral-200 dark:hover:border-neutral-800",
                        isEditing ? "bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-400 dark:ring-neutral-600" : ""
                      )}
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveCell();
                              if (e.key === "Escape") setActiveCell(null);
                            }}
                            autoFocus
                            className="w-full bg-white dark:bg-neutral-900 rounded px-1.5 py-0.5 border border-neutral-400 dark:border-neutral-600 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none"
                          />
                          <button
                            onClick={handleSaveCell}
                            className="p-1 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            col.type === "UUID" && "text-neutral-500 dark:text-neutral-400 text-[11px]",
                            col.type === "BOOLEAN" &&
                              (val ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-rose-600 dark:text-rose-400 font-semibold"),
                            col.type === "INT" && "text-amber-600 dark:text-amber-400 font-semibold",
                            col.type === "VARCHAR" && "text-neutral-800 dark:text-neutral-200"
                          )}
                        >
                          {val === null || val === undefined ? (
                            <span className="text-neutral-400 dark:text-neutral-600 italic">null</span>
                          ) : (
                            String(val)
                          )}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>Click any cell to edit inline • Press Enter to save</span>
        <span className="font-mono">Read/Write Access</span>
      </div>
    </div>
  );
}
