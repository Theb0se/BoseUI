"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  AlignLeft,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SchemaDiagnostic {
  line: number;
  message: string;
  severity: "error" | "warning";
  property?: string;
}

export interface JsonSchemaFormValidatorProps {
  /** Initial JSON string */
  initialJson?: string;
  /** Schema identifier */
  schemaName?: string;
  className?: string;
}

const DEFAULT_JSON = `{
  "username": "alex_mercer",
  "email": "alex@boseui.com",
  "age": 28,
  "role": "engineer",
  "tags": ["frontend", "systems"]
}`;

export function JsonSchemaFormValidator({
  initialJson = DEFAULT_JSON,
  schemaName = "UserConfigSchema.json",
  className,
}: JsonSchemaFormValidatorProps) {
  const [jsonText, setJsonText] = useState(initialJson);
  const [copied, setCopied] = useState(false);

  // Validate JSON syntax & mock schema rules
  const diagnostics = useMemo((): SchemaDiagnostic[] => {
    const list: SchemaDiagnostic[] = [];
    try {
      const parsed = JSON.parse(jsonText);

      // Schema rule 1: username must be >= 3 chars
      if (typeof parsed.username === "string" && parsed.username.length < 3) {
        list.push({
          line: 2,
          property: "username",
          message: "String must be at least 3 characters",
          severity: "error",
        });
      }

      // Schema rule 2: email format check
      if (typeof parsed.email === "string" && !parsed.email.includes("@")) {
        list.push({
          line: 3,
          property: "email",
          message: "Value does not match format 'email'",
          severity: "error",
        });
      }

      // Schema rule 3: age must be positive number
      if (typeof parsed.age === "number" && parsed.age < 18) {
        list.push({
          line: 4,
          property: "age",
          message: "Age must be greater than or equal to 18",
          severity: "warning",
        });
      }

      return list;
    } catch (err) {
      return [
        {
          line: 1,
          message: `JSON Syntax Error: ${(err as Error).message}`,
          severity: "error",
        },
      ];
    }
  }, [jsonText]);

  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasErrors = diagnostics.some((d) => d.severity === "error");

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
            <FileCode className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">JSON Schema Validator</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Validating against schema <code className="font-mono text-neutral-900 dark:text-neutral-200">{schemaName}</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrettify}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 transition-all"
          >
            <AlignLeft className="h-3.5 w-3.5" />
            <span>Format</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 transition-all"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Editor & Diagnostics Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Raw JSON Input
          </span>
          <textarea
            rows={8}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3.5 font-mono text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 shadow-xs leading-relaxed resize-y"
          />
        </div>

        {/* Diagnostics Output */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Diagnostics ({diagnostics.length})
            </span>
            {diagnostics.length === 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Schema Valid
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-mono text-rose-500 font-semibold">
                <AlertCircle className="h-3.5 w-3.5" /> Issues Detected
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 min-h-[160px] overflow-y-auto font-mono text-xs">
            {diagnostics.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-500 dark:text-neutral-400 gap-1.5">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <span className="text-xs text-neutral-900 dark:text-white font-medium">All properties conform to schema.</span>
                <span className="text-[11px]">Ready for network dispatch or storage.</span>
              </div>
            ) : (
              diagnostics.map((diag, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2.5 p-2.5 rounded-lg border text-xs",
                    diag.severity === "error"
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                  )}
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 font-bold">
                      {diag.property && <span>[{diag.property}]</span>}
                      <span>Line {diag.line}:</span>
                    </div>
                    <span className="opacity-90">{diag.message}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
